'use strict';
let path = require('path');
let util = require('./libs/util');
let wechat_file = path.join(__dirname,'./config/wechat.txt');
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
module.exports = config;