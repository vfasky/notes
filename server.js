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
var path = require('path');
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
app.proxy = true;

/**
 * 静态文件
 */
if(null === config.staticHost){
    app.use(require('koa-static')(path.join(__dirname, 'static')));
}

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

/**
 * 错误处理
 */
app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;

        this.app.emit('error', err, this);

        var t = this.accepts('json', 'html');
        if (t === 'json') {
            this.body = {
                state: false,
                error: err.message
            };
        } else {
            yield this.render('error.html', {
                message: err.message
            });
        }
    }
});

/**
 * 绑定路由
 */
app.use(require('./app/route').middleware());
app.use(require('./app/route/install').middleware());
app.use(require('./app/route/api/v1/user').middleware());


/**
 * 错误记录
 */
app.on('error', function(err, ctx) {
    //TODO log	
    if (err.status === 500) {
        console.log(err, ctx);
    }
});

if (!module.parent) {

    /**
     * 404
     */
    app.use(function *() {
        this.status = 404;

        var t = this.accepts('json', 'html');
        if (t === 'json') {
            this.body = {
                message: 'Page Not Found'
            };
        } else {
            yield this.render('404.html');
        }
    });
    
    app.listen(port);
    console.log('note web app listen: ' + port);
}
