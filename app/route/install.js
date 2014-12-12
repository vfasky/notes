"use strict";

/**
 * 安装
 * @author vfasky <vfasky@gmail.com>
 */	
var Router = require('koa-router');
var model = require('../model');

var router = new Router();

router.get('/install', function *(){
	this.throw(200, 'test error');
});


module.exports = router;