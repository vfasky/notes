"use strict";

var request = require('supertest');
var app = require('../../../server');
var noteApp = request.agent(app.callback());
var util = require('../../../app/lib/util');
var model = require('../../../app/model');

describe('api user', function() {
    var user, roles = [],
        password;

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

    it('user login', function(done) {
        noteApp.post('/api/v1/user.login')
            .send({
                email: 'test@mail.com',
                password: '123456'
            })
            .expect(/true/)
            .expect(200, done);
    });

    after(function(done) {
        roles.forEach(function(v) {
            v.remove();
        });

        user.remove(done);
    });


});
