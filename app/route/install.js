"use strict";

/**
 * 安装
 * @author vfasky <vfasky@gmail.com>
 */
var Router = require('koa-router');
var model = require('../model');
var config = require('../../config');
var validate = require('../middleware/validate');
var util = require('../lib/util');
var router = new Router();
var task = require('../lib/task');

router.get('/install', function*() {
    if (!config.superUserEmail) {
        yield this.render('install/tip.html');
        return;
    }

    var total =
        yield model.Role.find().count().exec();

    if (0 !== total) {
        this.throw(200, 'Installation has been completed !');
    }

    var user =
        yield model.User.findOne({
            email: config.superUserEmail
        }).exec();

    if (null !== user) {
        this.throw(200, 'Insstall Error');
    }

    yield this.render('install/index.html', {
        email: config.superUserEmail
    });
});

router.post('/install', validate({
    name: [validate.isAlphanumeric, validate.isLength(3, 15)],
    password: validate.isLength(6, 32)
}), function*() {
    
    var user =
        yield model.User.findOne({
            email: config.superUserEmail
        }).exec();

    if (null !== user) {
        this.throw(200, 'Insstall Error');
    }

    var roleTotal =
        yield model.Role.find().count().exec();

    if (0 !== roleTotal) {
        this.throw(200, 'Insstall Error');
    }

    //初始化角色
    var roleAdmin = new model.Role({
        code: 'admin',
        description: 'super User'
    });

    yield roleAdmin.saveAsync();

    var roleUser = new model.Role({
        code: 'user',
        description: 'user'
    });

    yield roleUser.saveAsync();

    //初始化管理员
    user = model.User({
        name: this.request.body.name,
        password: yield util.bhash(this.request.body.password),
        email: config.superUserEmail,
        active: true
    });

    //绑定角色
    user.setRoles([roleAdmin, roleUser]);

    yield user.saveAsync();

    //初始化 book
    yield new model.Book({
        _user: user._id
    }).saveAsync();

    //创建队列
    if(config.MQS.accessKeyId !== 'you accessKeyId'){
        yield task.queue.create(task.email);
        yield task.queue.create(task.index);
    }

    this.body = {
        state: true
    };
});


module.exports = router;
