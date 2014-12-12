"use strict";

/**
 * 用户
 * @module app/route/api/v1/usr
 * @author vfasky <vfasky@gmail.com>
 */	
var Router = require('koa-router');
var validate = require('../../../middleware/validate');

var router = new Router();

/**
 * 用户登陆
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-12
 * @param  {String} email 邮箱
 * @param  {String} password 密码
 */
router.post('/api/v1/user.login', validate({
	email: [validate.required, validate.isEmail],
	password: validate.isByteLength(6, 32)
}), function*() {
	  
});

module.exports = router;
