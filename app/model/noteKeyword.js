"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * 关键字与笔记关联模型
 * @module app/model/NoteKeywordSchema
 */
var NoteKeywordSchema = new Schema({

	keywordId: {
		type: Schema.Types.ObjectId,
		index: true
	},

	noteId: {
		type: Schema.Types.ObjectId,
		index: true
	},

	userId: {
		type: Schema.Types.ObjectId,
		index: true
	},

});

mongoose.model('NoteKeyword', NoteKeywordSchema);