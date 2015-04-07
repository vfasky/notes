"use strict";

var env = process.env.NODE_ENV || 'deploy';
var nunjucks = require('nunjucks');
var _ = require('lodash');
var config = require('../../config');
var fs = require('fs');
var path = require('path');
var Remarkable = require('remarkable');
var crypto = require('crypto');

var md5 = function(text) {
    return crypto.createHash('md5').update(String(text)).digest('hex');
};

var getHash = function(text) {
    return md5(text).substring(0, 6);
};

/**
 * markdown 设置
 * @type {Remarkable}
 */
var remarkable = new Remarkable('full', {
    linkify: true,
    breaks: true,
    typographer: true,
    langPrefix: 'hljs '
});

/**
 * default render options
 * @type {Object}
 */
var defaultSettings = {
    autoescape: true,
    watch: env === 'development'
};


//文件 hash
var _fileHash = {};


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

    var template = nunjucks.configure(
        settings.templatePath,
        settings
    );

    //渲染markdown
    template.addFilter('markdown', function(str) {
        return '<div class="markdown">' + remarkable.render(str) + '</div>';
    });

    //静态文件前缀
    template.addFilter('staticUrl', function(uri, callback) {
        var filePath = path.join(__dirname, '../../static', uri);

        var hash = _fileHash[uri];

        var buildFullUrl = function(){
            if (null === config.staticHost) {
                return callback(null, '/' + uri + '?' + hash);
            }
            return callback(null, config.staticHost + uri + '?' + hash);
        };

        if(hash){
            return buildFullUrl();
        }

        fs.readFile(filePath, function(err, context){
            if(err){
                return callback(err);
            }
            hash = getHash(context);
            _fileHash[uri] = hash;

            return buildFullUrl();
        });

    }, true);

    /**
     * locals
     * @type {Object}
     */
    var locals = {
        get config() {
            return config;
        },
        get ENV() {
            return env;
        },
        get undef(){
            return undefined;
        }
    };

    /**
     * generate html with view name and options
     * @param {String} view
     * @param {Object} options
     */
    var render = function(view, options, self) {
        options = options || {};

        return function(done) {
            options = _.extend(locals, options);

            if(options.session === undefined){
                Object.defineProperty(options, 'session', {
                    get : function(){
                        return self.session;
                    }
                });
            }

            template.render(view, options, done);
        };
    };

    app.context.renderString = function*(view, options) {
        var html =
            yield render(view, options, this);

        return html;
    };


    app.context.render = function*(view, options) {
        var html =
            yield render(view, options, this);

        this.body = html;
    };

};

exports.nunjucks = nunjucks;
