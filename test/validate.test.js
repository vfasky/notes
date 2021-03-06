"use strict";

var request = require('supertest');
var router = require('koa-router');
var app = require('../server');
var validate = require('../app/middleware/validate');

describe('validate', function() {

    app.use(router(app));

    app.get('/test/validate/required', validate({
        test: validate.required
    }), function*() {
        this.body = 'ok?';
    });

    app.post('/test/validate/required', validate({
        test: validate.required
    }), function*() {
        this.body = 'ok?';
    });

    app.del('/test/validate/requiredMsg', validate({
        test: [validate.required, 'test Not None']
    }), function*() {
        this.body = 'ok?';
    });

    app.put('/test/validate/email', validate({
        test: validate.required,
        email: [validate.required, validate.isEmail()]
    }), function*() {
        this.body = 'ok?';
    });

    app.post('/test/validate/emailMsg', validate({
        test: validate.required,
        email: [
            validate.required, [validate.isEmail, 'Please fill a valid email address']
        ]
    }), function*() {
        this.body = 'ok?';
    });

    app.get('/test/validate/emailMsg', validate({
        test: validate.required,
        email: [
            validate.required, [validate.isEmail, 'Please fill a valid email address']
        ]
    }), function*() {
        this.body = 'ok?';
    });


    app.post('/test/validate/byteLength', validate({
        test: validate.isByteLength(3, 6),
    }), function*() {
        this.body = 'ok?';
    });


    var noteApp = request(app.callback());

    it('required', function(done) {
        noteApp.post('/test/validate/required')
            .send({
                t: 1
            })
            .expect(/test Validation fails/)
            .expect(200, done);
    });

    it('required get', function(done) {
        noteApp.get('/test/validate/required?t=1')
            .expect(/test Validation fails/)
            .expect(200, done);
    });


    it('required message', function(done) {
        noteApp.del('/test/validate/requiredMsg')
            .send({
                t: 1
            })
            .expect(/test Not None/)
            .expect(200, done);
    });

    it('email', function(done) {
        noteApp.put('/test/validate/email')
            .send({
                test: 'ok',
                email: 'no email'
            })
            .expect(/email Validation fails/)
            .expect(200, done);
    });

    it('email message', function(done) {
        noteApp.post('/test/validate/emailMsg')
            .send({
                test: 'ok',
                email: 'no email'
            })
            .expect(/Please fill a valid email address/)
            .expect(200, done);
    });

    it('email message get', function(done) {
        noteApp.get('/test/validate/emailMsg?test=ok&email=noemail')
            .expect(/Please fill a valid email address/)
            .expect(200, done);
    });

    it('min length', function(done) {
        noteApp.post('/test/validate/byteLength')
            .send({
                test: 'ok'
            })
            .expect(/test Validation fails/)
            .expect(200, done);
    });

    it('max length', function(done) {
        noteApp.post('/test/validate/byteLength')
            .send({
                test: 'ok123456'
            })
            .expect(/test Validation fails/)
            .expect(200, done);
    });

});
