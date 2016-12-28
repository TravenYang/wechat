'use strict';
let Promise = require('bluebird');
let request = Promise.promisify(require('request'));
let util = require('./util');
let fs = require('fs');
let _=require('lodash');
let prefix = 'https://api.weixin.qq.com/cgi-bin/';
//https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=ACCESS_TOKEN
//https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=TYPE
//https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN
let api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    temporary:{//临时素材
        upload:prefix+'media/upload?'
    },
    permanent:{//永久素材
        upload:prefix+'material/add_material?',
        uploadNews:prefix+'material/add_news?',
        uploadNewsPic:prefix+'media/uploadimg?'
    }

};
function Wechat(opts) {
    let that = this;
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
}
Wechat.prototype.fetchAccessToken = function (data) {
    let that = this;
    if(this.access_token && this.expires_in){
        if(this.isValidAccessToken(this)){
            return Promise.resolve(this);
        }
    }
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
        return Promise.resolve(data);
    });
};
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
Wechat.prototype.uploadMaterial = function (type,material,permanent) {
    let that = this;
    let form = {};
    let uploadUrl = api.temporary.upload;
    if(permanent){
        uploadUrl = api.permanent.upload;
        _.extend(form,permanent);
    }
    console.log(type,' type');
    if(type === 'pic'){
        uploadUrl = api.permanent.uploadNewsPic;
    }else if(type === 'news'){
        uploadUrl = api.permanent.uploadNews;
        form = material;
    }else{
        form.media = fs.createReadStream(material);
    }
    console.log(form,'form');
    return new Promise(function (resolve, reject) {
        that.fetchAccessToken()
        .then(function(data){
            let url = uploadUrl + 'access_token=' + data.access_token;
            if(!permanent){
                url+='&type='+type;
            }else{
                form.access_token = data.access_token;
            }
            let options = {
                method:'POST',
                url:url,
                json:true
            };
            if(type==='news'){
                options.body = form;
            }else{
                options.formData = form;
            }
            request(options).then(function (response) {
                let _data = response[1];
                console.log(_data);
                if(_data){
                    resolve(_data);
                }else {
                    throw new Error('Upload material fails');
                }
            }).catch(function(err){
                reject(err);
            });
        });
    });
};
Wechat.prototype.reply = function(){
    let content = this.body;
    let message = this.weixin;
    let xml = util.tpl(content,message);
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
};
module.exports = Wechat;