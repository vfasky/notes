"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * 关键字模型
 * @module app/model/KeywordSchema
 */
var KeywordSchema = new Schema({

	keyword: {
		type: String,
        trim: true,
        unique: true,
        required: 'keyword is required'
	}

});

mongoose.model('Keyword', KeywordSchema);