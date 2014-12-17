"use strict";

var env = process.env.NODE_ENV || 'deploy';
var nunjucks = require('nunjucks');
var _ = require('lodash');
var config = require('../../config');
var fs = require('fs');
var path = require('path');
var Remarkable = require('remarkable');
var hljs = require('highlight.js');

/**
 * markdown 设置
 * @type {Remarkable}
 */
var remarkable = new Remarkable('full', {
    linkify: true,
    breaks: true,
    typographer: true,
    langPrefix: 'hljs ',
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {}
        }

        return ''; // use external default escaping
    }
});

/**
 * default render options
 * @type {Object}
 */
var defaultSettings = {
    autoescape: true,
    watch: env === 'development'
};

//时间缀
var _time = (new Date()).getTime();

//文件 hash
var _hash = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../../build/hash.json')
), 'utf8');


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

    //渲染markdown
    template.addFilter('markdown', function(str) {
        return '<div class="markdown">' + remarkable.render(str) + '</div>';
    });

    //静态文件前缀
    template.addFilter('staticUrl', function(uri) {
        var hash = _hash[uri] || _time;

        if (null === config.staticHost) {
            return '/' + uri + '?' + hash;
        }
        return config.staticHost + uri + '?' + hash;
    });

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
        var html =
            yield render(view, options);

        return html;
    };


    app.context.render = function*(view, options) {
        var html =
            yield render(view, options);

        this.body = html;
    };

};

exports.nunjucks = nunjucks;
