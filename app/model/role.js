"use strict";

var mongoose = require('mongoose');
var validator = require('validator');
var mongooseExt = require('../lib/mongooseExt');

var Schema = mongoose.Schema;

/**
 * 角色模型
 * @author vfasky <vfasky@gmail.com>
 * @module app/model/RoleSchema
 * @type {Schema}
 */
var RoleSchema = new Schema({
    //角色代码
    code: {
        type: String,
        trim: true,
        unique: true,
        required: 'Code is required',
        validate: function(x) {
            return validator.isAlpha(x) && validator.isLength(x, 3, 15);
        }
    },
    description: {
        type: String,
        trim: true
    }
});
mongooseExt(RoleSchema);

mongoose.model('Role', RoleSchema);
