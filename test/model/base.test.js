"use strict";

var assert = require('assert');
var mongoose = require('mongoose');
var config = require('../../config');

require('../../app/model/user');

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

        user.save(function(err) {
            assert.equal(
                err.errors.name.message, 
                'Validator failed for path `name` with value `1`'
            );
        });
    });

    it('user validate max length name', function() {
        var User = mongoose.model('User');

        var user = new User({
            name: 'adksfsjfsfsfjsfjsdfksjdlkfjlsjflsjdl'
        });

        user.save(function(err) {
            assert.equal(
                err.errors.name.message, 
                'Validator failed for path `name` with value `adksfsjfsfsfjsfjsdfksjdlkfjlsjflsjdl`'
            );
        });
    });

    it('user validate name', function() {
        var User = mongoose.model('User');

        var user = new User({
            name: 'a_&*('
        });

        user.save(function(err) {
            assert.equal(
                err.errors.name.message, 
                'Validator failed for path `name` with value `a_&*(`'
            );
        });
    });

    it('user required name', function() {
        var User = mongoose.model('User');

        var user = new User({});

        user.save(function(err) {
            assert.equal(
                err.errors.name.message, 
                'Name is required'
            );
        });
    });

    it('user validate email', function() {
        var User = mongoose.model('User');

        var user = new User({
            name: 'testname',
            email: 'test'
        });

        user.save(function(err) {
            assert.equal(
                err.errors.email.message, 
                'Please fill a valid email address'
            );
        });
    });


    it('user avatarUrl', function() {
        var User = mongoose.model('User');

        var user = new User({ 
            email: 'vfasky@gmail.com'
        });

        assert.equal(
            user.avatarUrl, 
            '//cdn.v2ex.com/gravatar/79ba89b4bc6fd5749abb000d232df371?size=48'
        );

        user.avatarUrl = '//cdn.v2ex.com/gravatar/79ba89b4bc6fd5749abb000d232df371?size=48';

        assert.equal(
            user.avatar, 
            '//cdn.v2ex.com/gravatar/79ba89b4bc6fd5749abb000d232df371?size=48'
        );

    });
});
