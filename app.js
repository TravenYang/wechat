'use strict';
let Koa = require('koa');
let sha1 = require('sha1');
let config = {
    wechat:{
        appID:'wxb72c464bf26777ad',
        appsecret:'6fdb9dfafa6a7a07eb3c413a0e79cb26',
        token:'q1w'
    }
};
let app = new Koa();
app.use(function *(next){
    console.log(this.query);
    console.log(this.query.ecostr);
    let token = config.wechat.token;
    let signature = this.query.signature;
    let nonce = this.query.nonce;
    let timestamp = this.query.timestamp;
    let echostr = this.query.echostr;
    let str = [token,timestamp,nonce].sort().join('');
    let sha = sha1(str);
    if(sha === signature){
        console.log(echostr);
        this.body = echostr+'';
    }else{
        this.body = 'wrong';
    }
});
app.listen(3100);
console.log('start 3100');