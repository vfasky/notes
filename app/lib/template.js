"use strict";

var env = process.env.NODE_ENV || 'deploy';
var nunjucks = require('nunjucks');
var _ = require('lodash');

/**
 * default render options
 * @type {Object}
 */
var defaultSettings = {
    autoescape: true,
    watch: env === 'development'
};

/**
 * 模板引擎
 * @module app/lib/template
 * @author vfasky <vfasky@gmail.com>
 *
 * @example
 * ```
 * yield this.render('user.html', {name: 'dead_horse'});
 *
 * this.body = yield this.renderString('index.html', {name: 'dead_horse'});
 * ```
 * @param {Application} app koa application instance
 * @param {Object} settings user settings
 */
exports = module.exports = function(app, settings) {
    if (app.context.render) {
        return;
    }

    settings = _.extend(defaultSettings, settings);

    var template = nunjucks.configure(settings.templatePath, settings);

    /**
     * locals
     * @type {Object}
     */
    var locals = {
        config: require('../../config'),
        ENV: env
    };

    /**
     * generate html with view name and options
     * @param {String} view
     * @param {Object} options
     */
    var render = function(view, options) {
        return function(done) {
            template.render(view, _.extend(locals, options), done);
        };
    };

    app.context.renderString = function*(view, options) {
        var html = yield render(view, options);

        return html;
    };


    app.context.render = function*(view, options) {
        var html = yield render(view, options);

        this.body = html;
    };

};

exports.nunjucks = nunjucks;
