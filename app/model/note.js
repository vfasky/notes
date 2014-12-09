"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * 笔记模型
 * @module app/model/NoteSchema
 */
var NoteSchema = new Schema({
	//关联用户
	userId: {
		type: Schema.Types.ObjectId,
		index: true
	},

	//所属笔记本
	bookId:{
		type: Schema.Types.ObjectId,
		index: true
	},

	//笔记名称
	title: {
		type: String,
        trim: true,
        required: 'Title is required'
	},

	//内容
	content: {
        type: String,
        required: 'Content is required'
    },

    //内容格式
    format: {
    	type: String,
    	required: 'Format is required',
    	default: 'md'
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

mongoose.model('Note', NoteSchema);