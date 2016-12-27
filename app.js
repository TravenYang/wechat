'use strict';
let Koa = require('koa');
let sha1 = require('sha1');
let config = {
    webchat:{
        appID:'wxb72c464bf26777ad',
        appsecret:'6fdb9dfafa6a7a07eb3c413a0e79cb26',
        token:'q1w'
    }
};
let app = new Koa();
app.use(function *(next){
    console.log(this.query);

});
app.listen(3100);
console.log('start 3100');