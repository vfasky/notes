"use strict";

/**
 * 用户
 * @module app/route/api/v1/user
 * @author vfasky <vfasky@gmail.com>
 */
var Router = require('koa-router');
var validate = require('../../../middleware/validate');
var model = require('../../../model');
var router = new Router();
var util = require('../../../lib/util');
var _ = require('lodash');

/**
 * 用户注册
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-22
 * @param  {String} email 邮箱
 * @param  {String} name 账号
 * @param  {String} password 密码
 */
router.post('/api/v1/user', validate({
    name: [validate.isAlphanumeric, validate.isLength(3, 15)],
    email: [validate.required, validate.isEmail],
    password: validate.isLength(6, 32)
}), function*() {

    var data = this.request.body;

    var total =
        yield model.User.find({
            email: data.email
        }).count().exec();

    if (0 !== total) {
        this.throw(200, '邮箱已存在');
    }

    total =
        yield model.User.find({
            name: data.name
        }).count().exec();

    if (0 !== total) {
        this.throw(200, '账号已存在');
    }

    var role =
        yield model.Role.findOne({
            code: 'user'
        }).exec();

    if (null === role) {
        this.throw('角色异常');
    }

    var user = model.User({
        name: data.name,
        password: yield util.bhash(data.password),
        email: data.email,
        active: true
    });

    //绑定角色
    user.setRoles([role]);

    yield user.saveAsync();

    //初始化 book
    yield new model.Book({
        _user: user._id
    }).saveAsync();

    this.body = {
        state: true
    };
});

/**
 * 用户登陆
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-12
 * @param  {String} email 邮箱
 * @param  {String} password 密码
 */
router.put('/api/v1/user', validate({
    email: [validate.required, validate.isEmail],
    password: validate.isLength(6, 32)
}), function*() {

    yield util.sleep(1000);

    var data = this.request.body;

    var user =
        yield model.User.findOne({
            email: data.email
        }).exec();

    if (null === user) {
        this.throw(200, '账号不存在');
    }

    var match =
        yield util.bcompare(data.password, user.password);
    if (!match) {
        this.throw(200, '密码错误');
    }

    var roles =
        yield user.getRoles();

    var sessionUser = {
        _id: user._id,
        email: user.email,
        name: user.name,
        location: user.location,
        avatarUrl: user.avatarUrl,
        roles: []
    };

    _.each(roles, function(r) {
        sessionUser.roles.push(r.code);
    });

    this.session.user = sessionUser;

    this.body = {
        state: true
    };
});

module.exports = router;
