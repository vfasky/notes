"use strict";

var request = require('supertest');
var router = require('koa-router');
var app = require('../server');

describe('session', function() {

    app.use(router(app));

    app.get('/test/session', function *(){
        var session = this.session;
        session.count = session.count || 0;
        session.count++;
        this.body = session.count;
    });

    var noteApp = request.agent(app.callback()); 

    it('get 1', function(done) {
        noteApp.get('/test/session')
            .expect(/1/)
            .expect(200, done);
    });

    it('get 2', function(done) {
        noteApp.get('/test/session')
            .expect(/2/)
            .expect(200, done);
    });

});
