"use strict";

/**
 * 笔记本资源
 * @module app/route/api/v1/book
 * @author vfasky <vfasky@gmail.com>
 */
var Router = require('koa-router');
var acl = require('../../../middleware/acl');
var validate = require('../../../middleware/validate');
var model = require('../../../model');
var router = new Router();
// var _ = require('lodash');

/**
 * 取笔记本
 */
router.get('/api/v1/book', acl.allow('user'), validate({
    id: validate.isMongoId,
}), function*() {
    var user = this.session.user;
    var data = this.query;
    if (!data.id) {
        var books =
            yield model.Book.find({
                _user: user._id
            }).exec();

        this.body = {
            state: true,
            books: books
        };
    } else {
        var book =
            yield model.Book.findOne({
                _id: data.id,
                _user: user._id
            }).exec();

        this.body = {
            state: true,
            book: book
        };
    }
});

/**
 * 创建笔记本
 */
router.post('/api/v1/book', acl.allow('user'), validate({
    title: validate.isLength(1, 50)
}), function*() {
    var user = this.session.user;
    var data = this.request.body;

    var book =
        yield new model.Book({
            _user: user._id,
            title: data.title
        }).saveAsync();

    this.body = {
        state: true,
        book: book
    };
});

/**
 * 修改笔记本
 */
router.put('/api/v1/book', acl.allow('user'), validate({
    id: validate.isMongoId,
    title: validate.isLength(1, 50)
}), function*() {
    var user = this.session.user;
    var data = this.request.body;

    var book =
        yield model.Book.findOne({
            _user: user._id,
            _id: data.id
        }).exec();

    if (null === book) {
        this.throw(200, '笔记本不存在');
    }

    book.title = data.title;
    yield book.saveAsync();

    this.body = {
        state: true,
        book: book
    };
});

/**
 * 删除笔记本
 */
router.del('/api/v1/book', acl.allow('user'), validate({
    id: validate.isMongoId
}), function*() {
    var user = this.session.user;
    var data = this.request.body;

    var book =
        yield model.Book.findOne({
            _user: user._id,
            _id: data.id
        }).exec();

    if (null === book) {
        this.throw(200, '笔记本不存在');
    }

    yield book.removeAsync();

    this.body = {
        state: true
    };
});



module.exports = router;
