"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * 笔记本模型
 * @module app/model/BookSchema
 */
var BookSchema = new Schema({
    //关联用户
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    //笔记本名称
    title: {
        type: String,
        trim: true,
        index: true,
        required: 'Title is required',
        default: 'default book'
    },

    //笔记总数
    total: {
        type: Number,
        default: 0
    },

    description: {
        type: String
    },

    createAt: {
        type: Date,
        default: Date.now
    },

    updateAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Book', BookSchema);
