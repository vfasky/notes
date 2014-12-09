"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var segment = require('../lib/segment');

/**
 * 笔记模型
 * @module app/model/NoteSchema
 */
var NoteSchema = new Schema({
    //关联用户
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    //所属笔记本
    _book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
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
        required: 'Content is required',
        set: function(txt) {
            return txt.replace(/\r\n/g, '\n');
        }
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

/**
 * 通过关键字，查找用户笔记
 * @type {Schema}
 */
NoteSchema.statics.findByKeyword = function(keyword, user) {
    var self = this;

    return function(done) {
        self.model('Keyword').findOne({
            keyword: keyword
        }, function(err, keyword) {
            if (err) {
                return done(err);
            }

            if (null === keyword) {
                return done(null, null);
            }

            var query = self.model('NoteKeyword').find({
                _keyword: keyword._id,
                _user: user._id
            }).populate('_note').sort({
                weight: 'desc'
            });

            done(null, query);
        });
    };
};

/**
 * 通过笔记，生成关键字
 * @type {[type]}
 */
NoteSchema.methods.buildKeywords = function() {
    // var texts = [this.title];

    // var content = this.content;

    // _.each(content.split('\n\n'), function(v) {
    //     v = v.trim();
    //     if (v !== '') {
    //         texts.push(v);
    //     }
    // });

    return segment([this.title, this.content].join('\n'));
};

NoteSchema.methods.saveKeywords = function(keywords) {
    var self = this;

    return function(done) {
        var words = Object.keys(keywords);
        var total = 0;
        var len = words.length;

        var Keyword = self.model('Keyword');
        var NoteKeyword = self.model('NoteKeyword');

        var _has = [];

        _.each(words, function(word) {
            Keyword.findOne({
                keyword: word
            }, function(err, keyword) {
                if (err) {
                    return done(err);
                }

                //保存keyword
                if (!keyword) {
                    keyword = new Keyword({
                        keyword: word
                    });
                } else {
                    keyword.total++;
                }
                keyword.save(function(err, keyword) {
                    if (err) {
                        return done(err);
                    }

                    //关联
                    var noteKeyword = new NoteKeyword({
                        _keyword: keyword._id,
                        _user: self._user,
                        _note: self._id,
                        weight: keywords[word] || 0
                    });

                    noteKeyword.save(function(err) {
                        if (err) {
                            return done(err);
                        }

                        total++;
                        _has.push({
                            noteKeyword: noteKeyword,
                            keyword: keyword
                        });
                        if (total === len) {
                            done(null, _has);
                        }
                    });
                });
            });
        });
    };
};

mongoose.model('Note', NoteSchema);
