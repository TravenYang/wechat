'use strict';
let Koa = require('koa');
let wechat = require('./wechat/g');
let path = require('path');
let wechat_file = path.join(__dirname,'./config/wechat.txt');
let util = require('./libs/util');
let config = {
    wechat: {
        appID: 'wxb72c464bf26777ad',
        appsecret: '6fdb9dfafa6a7a07eb3c413a0e79cb26',
        token: 'q1w',
        getAccessToken:function(){
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken:function(data){
            data = JSON.stringify(data);
            console.log(data,'data');
            return util.writeFileAsync(wechat_file,data);
        }
    }
};
let app = new Koa();
app.use(wechat(config.wechat));
app.listen(3100);
console.log('start 3100');