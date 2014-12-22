"use strict";

/**
 * 用户
 * @module app/route/api/v1/usr
 * @author vfasky <vfasky@gmail.com>
 */
var Router = require('koa-router');
var validate = require('../../../middleware/validate');
var model = require('../../../model');
var router = new Router();
var util = require('../../../lib/util');
var _ = require('lodash');

/**
 * 用户登陆
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-12
 * @param  {String} email 邮箱
 * @param  {String} password 密码
 */
router.post('/api/v1/user.login', validate({
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

    var session = {
        userId: user._id,
        email: user.email,
        name: user.name,
        location: user.location,
        avatarUrl: user.avatarUrl,
        roles: []
    };

    _.each(roles, function(r) {
        session.roles.push(r.code);
    });

    this.session = session;

    this.body = {
        state: true
    };
});

module.exports = router;
