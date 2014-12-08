"use strict";

require('./role');

var mongoose = require('mongoose');
var validator = require('validator');
var crypto = require('crypto');
var _ = require('lodash');

var Schema = mongoose.Schema;

/**
 * 用户模型
 * @module app/model/user
 */
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
    //关联角色
    roles: [Schema.Types.ObjectId]
});

/**
 * 取头像地址
 * @return {String}
 */
UserSchema.virtual('avatarUrl').get(function() {
    //使用 v2ex 的cdn
    var url = this.avatar || '//cdn.v2ex.com/gravatar/' +
        crypto.createHash('md5').update(this.email).digest('hex') +
        '?size=48';

    return url;

    /**
     * 设置头像地址
     * @param  {String} url
     * @return {Void}
     */
}).set(function(url) {

    this.avatar = url.trim();

});

/**
 * 取用户角色
 * @return {Array}
 */
UserSchema.methods.getRoles = function(){

    return this.model('Role').find({
        _id: {
            $in: this.roles
        }
    }).exec();

};

/**
 * 设置用户角色
 * @param {Array} roles
 * @return {module:app/model/user}
 */
UserSchema.methods.setRoles = function(roles){
    var self = this;
    this.roles = [];

    _.each(roles, function(r){
        r._id && self.roles.push(r._id);    
    });

    return this;
};

mongoose.model('User', UserSchema);
