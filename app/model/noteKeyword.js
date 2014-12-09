"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * 关键字与笔记关联模型
 * @module app/model/NoteKeywordSchema
 */
var NoteKeywordSchema = new Schema({

	_keyword: {
		type: Schema.Types.ObjectId,
		ref: 'Keyword'
	},

	_note: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	},

	_user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	//权重
	weight: {
		type: Number,
		index: true,
		default: 0
	}
});

mongoose.model('NoteKeyword', NoteKeywordSchema);