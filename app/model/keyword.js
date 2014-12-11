"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * 关键字模型
 * @author vfasky <vfasky@gmail.com>
 * @module app/model/KeywordSchema
 */
var KeywordSchema = new Schema({

    keyword: {
        type: String,
        trim: true,
        unique: true,
        required: 'keyword is required'
    },

    total: {
        type: Number,
        index: true,
        default: 0
    }

});

mongoose.model('Keyword', KeywordSchema);
