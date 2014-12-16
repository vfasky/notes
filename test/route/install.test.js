"use strict";

var request = require('supertest');
var app = require('../../server');
var noteApp = request.agent(app.callback());
var model = require('../../app/model');

describe('route install', function() {
    var user, roles;

    it('get', function(done) {
        noteApp.get('/install')
            .expect(/form/)
            .expect(200, done);
    });

    it('post', function(done) {
        noteApp.post('/install')
            .send({
                name: 'vfasky',
                password: '123456'
            })
            .expect(/true/)
            .expect(200, done);
    });

    after(function(done) {
        model.User.findOne({
            name: 'vfasky'
        }, function(err, data){
        	if(err){
        		return done(err);
        	}
        	user = data;
        	done();
        });
    });

    after(function(done) {
        model.Role.find({
            _id: {
                $in: user._roles
            }
        }, function(err, data){
        	if(err){
        		return done(err);
        	}
        	roles = data;
        	done();
        });
    });

    after(function(done) {
        roles.forEach(function(v) {
            v.remove();
        });

        user.remove(done);
    });

    after(function(done){
    	model.Book.findOne({
    		_user: user._id
    	}, function(err, book){
    		book.remove(done);
    	});
    });

});
