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
            .expect(200, function(err, res){
                if(err){
                    return done(err);
                }
                if(res.res.text.indexOf('<div>ok</div>') === -1){
                    return done('template error');
                }
                done();

            });
    });
});
