'use strict';
let Koa = require('koa');
let path = require('path');
let wechat = require('./wechat/g');
let util = require('./libs/util');
let config = require('./config');
let reply = require('./wx/reply');
let app = new Koa();
app.use(wechat(config.wechat,reply.reply));
app.listen(3100);
console.log('start 3100');