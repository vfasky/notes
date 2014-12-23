"use strict";

/**
 * 笔记资源
 * @author vfasky <vfasky@gmail.com>
 */
var Router = require('koa-router');
var acl = require('../../../middleware/acl');
var validate = require('../../../middleware/validate');
var model = require('../../../model');
var router = new Router();

/**
 * 取笔记
 * @author vfasky <vfasky@gmail.com>
 */
router.get('/api/v1/note', acl.allow('user'), validate({
    id: validate.isMongoId,
}), function*() {
    var user = this.session.user;
    var data = this.query;

    var note =
        yield model.Note.findOne({
            _id: data.id,
            _user: user._id
        }).exec();

    if (null === note) {
        this.throw(200, '笔记不存在');
    }

    this.body = {
        state: true,
        note: note
    };
});

/**
 * 创建笔记
 * @author vfasky <vfasky@gmail.com>
 */
router.post('/api/v1/note', acl.allow('user'), validate({
    title: validate.isLength(1, 50),
    content: validate.required,
    bookId: validate.isMongoId
}), function*() {
    var user = this.session.user;
    var data = this.request.body;


    var book =
        yield model.Book.findOne({
            _user: user._id,
            _id: data.bookId
        }).exec();

    if (null === book) {
        this.throw(200, '笔记本不存在');
    }

    var note =
        yield new model.Note({
            title: data.title,
            content: data.content,
            _book: book._id,
            _user: user._id
        }).saveAsync();
        
    //TODO 创建索引

    this.body = {
        state: true,
        note: note
    };
});

/**
 * 更新笔记
 * @author vfasky <vfasky@gmail.com>
 */
router.put('/api/v1/note', acl.allow('user'), validate({
    title: validate.isLength(1, 50),
    content: validate.required,
    bookId: validate.isMongoId,
    id: validate.isMongoId
}), function*() {
    var user = this.session.user;
    var data = this.request.body;

    var book =
        yield model.Book.findOne({
            _user: user._id,
            _id: data.bookId
        }).exec();

    if (null === book) {
        this.throw(200, '笔记本不存在');
    }

    var note =
        yield model.Note.findOne({
            _id: data.id,
            _user: user._id
        }).exec();

    if (null === note) {
        this.throw(200, '笔记不存在');
    }

    note.title = data.title;
    note.content = data.content;
    note.updateAt = Date.now();
    note._book = book._id;

    yield note.saveAsync();

    //TODO 重建索引

    this.body = {
        state: true,
        note: note
    };
});

/**
 * 删除笔记
 * @author vfasky <vfasky@gmail.com>
 */
router.del('/api/v1/note', acl.allow('user'), validate({
    id: validate.isMongoId
}), function*() {
    var user = this.session.user;
    var data = this.request.body;

    var note =
        yield model.Note.findOne({
            _id: data.id,
            _user: user._id
        }).exec();

    if (null === note) {
        this.throw(200, '笔记不存在');
    }

    yield note.removeAsync();

    this.body = {
        state: true
    };
});

module.exports = router;
