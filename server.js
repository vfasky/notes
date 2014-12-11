/**
 * Application 启动文件
 */
"use strict";

var koa = require('koa');

var session = require('koa-generic-session');
var memcachedStore = require('koa-memcached');
var bodyParser = require('koa-bodyparser');
var config = require('./config');
var template = require('./app/lib/template');

var app = module.exports = koa();

/**
 * 监听端口
 * @type {Int}
 */
var port = process.env.PORT || 3001;

/**
 * 设置一个签名 Cookie 的密钥
 * @type {Array}
 */
app.keys = config.keys;

/**
 * 定义 session store
 */
app.use(session({
    store: memcachedStore(config.memcached)
}));

/**
 * 加载模板引擎
 */
template(app, {
    templatePath: config.templatePath
});

/**
 * 解释body
 */
app.use(bodyParser());

app.use(
	require('./app/route').middleware()
);

if (!module.parent) {
    app.listen(port);
    console.log('note web app listen: ' + port);
}
