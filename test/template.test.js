"use strict";

var request = require('supertest');
var koa = require('koa');
var template = require('../app/lib/template');


describe('template', function() {
    var app = koa();

    template(app, {
        templatePath: __dirname
    });

    app.use(function*() {

        yield this.render('template.html', {
            test: 'ok'
        });

    });

    it('render', function(done) {
        request(app.callback())
            .get('/')
            .expect(/<div>ok<\/div>/)
            .expect(200, done);
    });
});
