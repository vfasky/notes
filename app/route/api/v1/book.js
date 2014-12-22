"use strict";

/**
 * 笔记本资源
 * @module app/route/api/v1/book
 * @author vfasky <vfasky@gmail.com>
 */
var Router = require('koa-router');
var acl = require('../../../middleware/acl');
var model = require('../../../model');
var router = new Router();
// var _ = require('lodash');

router.get('/api/v1/book', acl.allow('user'), function*() {
    var user = this.session.user;

    var books =
        yield model.Book.find({
            _user: user._id
        }).exec();

    this.body = {
        state: true,
        books: books
    };
});


module.exports = router;