"use strict";

var Router = require('koa-router');
var acl = require('../../../middleware/acl');
var validate = require('../../../middleware/validate');
var model = require('../../../model');
var router = new Router();

router.get('/api/v1/note', acl.allow('user'), validate({
	id: validate.isMongoId,
}), function*() {
    var user = this.session.user;

    var data = this.query;

    var note = yield model.Note.findOne({
    	_id: data.id,
    	_user: user._id
    }).exec();

    if(null === note){
    	this.throw(200, '笔记不存在');
    }

    this.body = {
        state: true,
        note: note
    };
});