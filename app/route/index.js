"use strict";

var Router = require('koa-router');

var router = new Router();

router.get('/', function*() {
	console.log(this.ip);
    yield this.render('index/index.html');
});

module.exports = router;
