'use strict';
let sha1 = require('sha1');
let Wechat = require('./wechat');
let getRawBody = require('raw-body');
let util = require('./util');

module.exports = function (opts) {
    let wechat = new Wechat(opts);
    return function *(next) {
        console.log(this.query);
        let token = opts.token;
        let signature = this.query.signature;
        let nonce = this.query.nonce;
        let timestamp = this.query.timestamp;
        let echostr = this.query.echostr;
        let str = [token, timestamp, nonce].sort().join('');
        let sha = sha1(str);
        if(this.method === 'GET'){
            if (sha === signature) {
                this.body = echostr + '';
            } else {
                this.body = 'wrong';
            }
        }else if(this.method === 'POST'){
            if (sha !== signature) {
                this.body = 'wrong';
                return false;
            } else {
                let data = yield getRawBody(this.req,{
                    length:this.length,
                    limit:'1mb',
                    encoding:this.charset
                });
                console.log(data.toString());
                let content = yield util.parseXMLAsync(data);
                console.log(content.xml);
                let message = yield util.formatMessage(content.xml);
                console.log('message',message);
            }

        }


    }
};