"use strict";

var mongoose = require('mongoose');
var validator = require('validator');

var Schema = mongoose.Schema;

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

mongoose.model('Role', RoleSchema);