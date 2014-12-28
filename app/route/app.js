/**
 * 笔记本 app
 * @author vfasky <vfasky@gmail.com>
 */
"use strict";

var Router = require('koa-router');

var router = new Router();

router.get('/app', function*() {
    yield this.render('app/index.html');
});

module.exports = router;
