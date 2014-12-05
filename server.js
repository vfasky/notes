/**
 * Application 启动文件
 */
"use strict";

var koa = require('koa');

var session = require('koa-generic-session');
var memcachedStore = require('koa-memcached');
var config = require('./config');
var template = require('./app/lib/template');

var app = module.exports = koa();

/**
 * 监听端口
 * @type {Int}
 */
var port = process.env.PORT || 3000;

/**
 * 设置一个签名 Cookie 的密钥
 * @type {Array}
 */
app.keys = config.keys;

/**
 * 定义 session store
 */
app.use(session({
    store: memcachedStore()
}));

/**
 * 加载模板引擎
 */
template(app, {
    templatePath: config.templatePath
});

if (!module.parent) {
    app.listen(port);
}
