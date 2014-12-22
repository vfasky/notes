"use strict";

var request = require('supertest');
var app = require('../../../server');
var noteApp = request.agent(app.callback());
var util = require('../../../app/lib/util');
var model = require('../../../app/model');
var assert = require('assert');

describe('api book', function() {
    var user, roles = [],
        password, book;

    before(function(done) {
        var role = new model.Role({
            code: 'user',
            description: '用户'
        });

        role.save(function(err, role) {
            if (err) {
                return done(err);
            }
            roles.push(role);
            done();
        });
    });

    before(function(done) {
        util.bhash('123456')(function(err, has) {
            password = has;
            done();
        });
    });

    before(function(done) {
        user = new model.User({
            name: 'test',
            email: 'test@mail.com',
            active: true,
            password: password
        });

        user.setRoles(roles);
        user.save(done);
    });

    before(function(done) {
        book = new model.Book({
            _user: user._id
        });

        book.save(done);
    });

    it('user login', function(done) {
        noteApp.put('/api/v1/user')
            .send({
                email: 'test@mail.com',
                password: '123456'
            })
            .expect(/true/)
            .expect(200, done);
    });

    it('get books', function(done) {
        noteApp.get('/api/v1/book')
            .expect(200, function(err, res) {
                if (err) {
                    return done(err);
                }
                var data = res.body;

                if (data.state !== true) {
                    return done(data.error);
                }

                assert.equal(1, data.books.length);

                done();
            });
    });


    after(function(done) {
        roles.forEach(function(v) {
            v.remove();
        });
        book.remove();
        user.remove(done);
    });


});
