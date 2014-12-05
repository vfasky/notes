"use strict";

var mongoose = require('mongoose');
var validator = require('validator');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    //用户名
    name: {
        type: String,
        trim: true,
        unique: true,
        required: 'Name is required',
        validate: function(x) {
            return validator.isAlphanumeric(x) && validator.isLength(x, 3, 15);
        }
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        validate: [validator.isEmail, 'Please fill a valid email address'],
    },
    //本地化
    location: {
        type: String,
        default: 'zh-CN'
    },
    password: {
        type: String
    },
    //头像地址
    avatar: {
        type: String
    },
    //是否激活
    active: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
});

/**
 * 头像地址
 * @return {String}
 */
UserSchema.virtual('avatarUrl').get(function() {
    //使用 v2ex 的cdn
    var url = this.avatar || '//cdn.v2ex.com/gravatar/' +
        crypto.createHash('md5').update(this.email).digest('hex') +
        '?size=48';

    return url;

}).set(function(url) {

    this.avatar = url.trim();

});

mongoose.model('User', UserSchema);
