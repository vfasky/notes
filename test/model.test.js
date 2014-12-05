"use strict";

var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../config');

require('../app/model/user');

describe('model', function() {
    mongoose.connect(config.mongodb, function(err) {
        if (err) {
            console.error('connect to %s error: ', config.mongodb, err.message);
        }
    });

    it('user validate min length name', function() {
        var User = mongoose.model('User');

        var user = new User({
        	name: '1'
        });

        user.save(function (err) {
        	assert.equal(err.message, 'Validation failed');
        });
    });

    it('user validate max length name', function() {
        var User = mongoose.model('User');

        var user = new User({
        	name: 'adksfsjfsfsfjsfjsdfksjdlkfjlsjflsjdl'
        });

        user.save(function (err) {
        	assert.equal(err.message, 'Validation failed');
        });
    });

    it('user validate name', function() {
        var User = mongoose.model('User');

        var user = new User({
        	name: 'a_&*('
        });

        user.save(function (err) {
        	assert.equal(err.message, 'Validation failed');
        });
    });
});
