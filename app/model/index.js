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
require('./book');
require('./note');
require('./noteKeyword');
require('./keyword');

mongoose.connect(config.mongodb, function(err) {
    if (err) {
        console.error('connect to %s error: ', config.mongodb, err.message);
    }
});

module.exports = exports = {
    User: mongoose.model('User'),
    Role: mongoose.model('Role'),
    Book: mongoose.model('Book'),
    Note: mongoose.model('Note'),
    Keyword: mongoose.model('Keyword'),
    NoteKeyword: mongoose.model('NoteKeyword')
};
