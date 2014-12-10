"use strict";

var request = require('supertest');
var router = require('koa-router');
var app = require('../server');
var acl = require('../app/middleware/acl');

describe('acl', function() {

    app.use(router(app));

    app.get('/test/acl/init', function *(){
        var session = this.session;
        session.user = {
            roles: ['test1', 'test2']
        };
        this.body = 'init';
    });

    app.get('/test/acl/reject', acl.allow('test'), function *(){
        this.body = 'ok';
    });

    app.get('/test/acl/allow', acl.allow('test1'), function *(){
        this.body = 'ok';
    });

    var noteApp = request.agent(app.callback()); 

    it('init role', function(done) {
        noteApp.get('/test/acl/init')
            .expect(/init/)
            .expect(200, done);
    });

    it('acl allow', function(done) {
        noteApp.get('/test/acl/allow')
            .expect(/ok/)
            .expect(200, done);
    });

    it('acl reject', function(done) {
        noteApp.get('/test/acl/reject')
            .expect(403, done);
    });

});
