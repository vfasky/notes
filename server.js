
"use strict";

var koa = require('koa');

var session = require('koa-generic-session');
var memcachedStore = require('koa-memcached');

var app = module.exports = koa();

app.keys = ['keys', 'keykeys'];
app.use(session({
  store: memcachedStore()
}));

app.use(function *(){
  this.body = {
    test: 'ok?'
  };
});

if (!module.parent) app.listen(3000);