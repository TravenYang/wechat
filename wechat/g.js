'use strict';
let sha1 = require('sha1');
let Promise = require('bluebird');
let request = Promise.promisify(require('request'));
let prefix = 'https://api.weixin.qq.com/cgi-bin';
let api = {
    accessToken: prefix + '/token?grant_type=client_credential'
};
function Wechat(opts) {
    let that = this;
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getAccessToken().then(function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return that.updateAccessToken();
            }
            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data);
            } else {
                return that.updateAccessToken();
            }
        }).then(function (data) {
            that.access_token = data.access_token;
            that.expires_in = data.expires_in;
        console.log(data,'data1');
            that.saveAccessToken(data);
        });
}
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    let access_token = data.access_token;
    let expires_in = data.expires_in;
    let now = new Date().getTime();
    if (now < expires_in) return true;
    else return false;
};
Wechat.prototype.updateAccessToken = function () {
    let appID = this.appID;
    let appsecret = this.appsecret;
    let url = api.accessToken + '&appid=' + appID + '&secret=' + appsecret;
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}).then(function (response) {
            let data = response[1];
            let now = new Date().getTime();
            let expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            console.log(data);
            resolve(data);
        });
    });
};
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
        if (sha === signature) {
            console.log(echostr);
            this.body = echostr + '';
        } else {
            this.body = 'wrong';
        }
    }
};