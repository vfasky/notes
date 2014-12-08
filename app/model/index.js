/**
 * models
 * @module app/model
 * @author vfasky <vfasky@gmail.com>
 */
"use strict";

var mongoose = require('mongoose');
var config = require('../../config');

require('./user');
require('./role');

mongoose.connect(config.mongodb, function(err) {
    if (err) {
        console.error('connect to %s error: ', config.mongodb, err.message);
    }
});

module.exports = exports = {
    User: mongoose.model('User'),
    Role: mongoose.model('Role')
};
