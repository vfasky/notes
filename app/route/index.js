"use strict";

var Router = require('koa-router');

var router = new Router();

router.get('/', function*() {
    yield this.render('index/index.html');
});

router.get('/signin', function*(){
	yield this.render('index/signin.html');
});

module.exports = router;
