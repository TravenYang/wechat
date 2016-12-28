'use strict';
let config = require('./config');
let Wechat = require('./wechat/wechat');
let wechatApi = new Wechat(config.wechat);
exports.reply = function* (next){
    let message = this.weixin;
    if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            if(message.EventKey){
                console.log('扫二维码进来： '+message.EventKey+' '+message.ticket);
            }
            this.body = '很好，你订阅了这个号'+' 消息ID '+message.MsgId;
        }else if(message.Event === 'unsubscribe'){
            console.log('无情取关');
            this.body = '';
        }else if(message.Event === 'LOCATION'){
            this.body = '上报的位置是： '+message.Latitude+'/'+message.Longitude+'-'+message.Precision;
        }else if(message.Event === 'CLICK'){
            this.body = '点击了菜单'+message.EventKey;
        }else if(message.Event === 'SCAN'){
            console.log('关注后扫二维码'+message.EventKey+message.Ticket);
            this.body = '看到你扫了一下哦';
        }else if(message.Event === 'VIEW'){
            console.log('关注后扫二维码'+message.EventKey+message.Ticket);
            this.body ='点击了菜单中的链接'+message.EventKey;
        }
    }else if(message.MsgType === 'text'){
        let content = message.Content;
        let reply = '额,你说的 '+content+' 太复杂了';
        if(content === '1'){
            reply = '你说的是 '+content;
        }else if(content === '2'){
            reply = '你说的是你说的是 '+content;
        }else if(content === '3'){
            reply = '你说的是你说的是你说的是 '+content;
        }else if(content === '4'){
            reply = [{
                title:'嘟嘟嘟嘟有多帅',
                description:'只是一个小问题',
                picUrl:'http://wanzao2.b0.upaiyun.com/system/pictures/29448439/original/1444383361_452x281.png'
            }];
        }else if(content === '5'){
            reply = [{
                title:'尤娇寿考上研究僧了吗？',
                description:'必须可以',
                picUrl:'http://comment.b0.upaiyun.com/system/comments/attachments/037/407/180/original/1451751663-320x320.png'
            }];
        }else if(content === '6'){
            let data = yield wechatApi.uploadMaterial('image',__dirname+'/2.jpg');
            reply = {
                type:'image',
                mediaId:data.media_id
            };
        }else if(content === '7'){
            let data = yield wechatApi.uploadMaterial('video',__dirname+'/6.mp4');
            reply = {
                type:'video',
                title:'回复视频内容',
                description:'测试视频',
                mediaId:data.media_id
            };
        }else if(content === '8'){
            let data = yield wechatApi.uploadMaterial('image',__dirname+'/2.jpg');
            reply = {
                type:'music',
                title:'回复音乐内容',
                description:'放松一下',
                musicUrl:'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
                thumbMediaId:data.media_id
            };
        }else if(content === '9'){
            let data = yield wechatApi.uploadMaterial('video',__dirname+'/6.mp4',{type:'video',description:'{"title":"really a nice place","introduction":"never think it so easy"}'});
            console.log(data);
            reply = {
                type:'video',
                title:'回复视频内容',
                description:'测试视频',
                mediaId:data.media_id
            };
        }
        this.body = reply;
    }
};