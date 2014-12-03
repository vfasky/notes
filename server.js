
"use strict";

var koa = require('koa');
var app = koa();

app.use(function *(){
  this.body = {
  	test: 'ok?'
  };
});

app.listen(3000);