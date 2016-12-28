'use strict';
let config = require('./../config');
let Wechat = require('./../wechat/wechat');
let wechatApi = new Wechat(config.wechat);
let menu = require('./menu');
let path = require('path');
exports.reply = function* (next) {
    let message = this.weixin;
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫二维码进来： ' + message.EventKey + ' ' + message.ticket);
            }
            wechatApi.deleteMenu().then(function(){
                console.log(222222);
                return wechatApi.createMenu(menu);
                console.log(222222444444);
            }).then(function(msg){
                console.log(msg);
            });
            this.body = '很好，你订阅了这个号' + ' 消息ID ' + message.MsgId;
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关');
            this.body = '';
        } else if (message.Event === 'LOCATION') {
            this.body = '上报的位置是： ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
        } else if (message.Event === 'CLICK') {
            this.body = '点击了菜单' + message.EventKey;
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫二维码' + message.EventKey + message.Ticket);
            this.body = '看到你扫了一下哦';
        } else if (message.Event === 'VIEW') {
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'scancode_push') {
            console.log(message.ScanCodeInfo.ScanType);
            console.log(message.ScanResult.ScanResult);
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'scancode_waitmsg') {
            console.log(message.ScanCodeInfo.ScanType);
            console.log(message.ScanResult.ScanResult);
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'pic_sysphoto') {
            console.log(message.SendPicsInfo.PicList);
            console.log(message.SendPicsInfo.count);
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'pic_photo_or_album') {
            console.log(message.SendPicsInfo.PicList);
            console.log(message.SendPicsInfo.count);
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'pic_weixin') {
            console.log(message.SendPicsInfo.PicList);
            console.log(message.SendPicsInfo.count);
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'location_select') {
            console.log(message.SendLocationInfo.Location_X);
            console.log(message.SendLocationInfo.Location_Y);
            console.log(message.SendLocationInfo.Scale);
            console.log(message.SendLocationInfo.Label);
            console.log(message.SendLocationInfo.Poiname);
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'media_id') {
            this.body = '点击了菜单中的链接' + message.EventKey;
        }else if (message.Event === 'view_limited') {
            this.body = '点击了菜单中的链接' + message.EventKey;
        }
    } else if (message.MsgType === 'text') {
        let content = message.Content;
        let reply = '额,你说的 ' + content + ' 太复杂了';
        if (content === '1') {
            reply = '你说的是 ' + content;
        } else if (content === '2') {
            reply = '你说的是你说的是 ' + content;
        } else if (content === '3') {
            reply = '你说的是你说的是你说的是 ' + content;
        } else if (content === '4') {
            reply = [{
                title: '嘟嘟嘟嘟有多帅',
                description: '只是一个小问题',
                picUrl: 'http://wanzao2.b0.upaiyun.com/system/pictures/29448439/original/1444383361_452x281.png'
            }];
        } else if (content === '5') {
            reply = [{
                title: '尤娇寿考上研究僧了吗？',
                description: '必须可以',
                picUrl: 'http://comment.b0.upaiyun.com/system/comments/attachments/037/407/180/original/1451751663-320x320.png'
            }];
        } else if (content === '6') {
            let data = yield wechatApi.uploadMaterial('image', path.join(__dirname , '../2.jpg'));
            reply = {
                type: 'image',
                mediaId: data.media_id
            };
        } else if (content === '7') {
            let data = yield wechatApi.uploadMaterial('video', path.join(__dirname ,'../6.mp4'));
            reply = {
                type: 'video',
                title: '回复视频内容',
                description: '测试视频',
                mediaId: data.media_id
            };
        } else if (content === '8') {
            let data = yield wechatApi.uploadMaterial('image', path.join(__dirname ,'../2.jpg'));
            reply = {
                type: 'music',
                title: '回复音乐内容',
                description: '放松一下',
                musicUrl: 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
                thumbMediaId: data.media_id
            };
        } else if (content === '9') {
            let data = yield wechatApi.uploadMaterial('video', path.join(__dirname,'../6.mp4'), {
                type: 'video',
                description: '{"title":"really a nice place","introduction":"never think it so easy"}'
            });
            console.log(data);
            reply = {
                type: 'video',
                title: '回复视频内容',
                description: '测试视频',
                mediaId: data.media_id
            };
        } else if (content === '10') {
            let picData = yield wechatApi.uploadMaterial('image', path.join(__dirname , '../2.jpg'), {});
            let media = {
                articles: [{
                    title: 'tututu',
                    thumb_media_id: picData.media_id,
                    author: 'traven',
                    digest: '没有摘要',
                    show_cover_pic: 1,
                    content: '没有内容',
                    content_source_url: 'https://baidu.com'
                }, {
                    title: 'tututu1',
                    thumb_media_id: picData.media_id,
                    author: 'traven',
                    digest: '没有摘要',
                    show_cover_pic: 1,
                    content: '没有内容',
                    content_source_url: 'https://baidu.com'
                }, {
                    title: 'tututu2',
                    thumb_media_id: picData.media_id,
                    author: 'traven',
                    digest: '没有摘要',
                    show_cover_pic: 1,
                    content: '没有内容',
                    content_source_url: 'https://baidu.com'
                }]
            };
            let data = yield wechatApi.uploadMaterial('news', media, {});
            data = yield wechatApi.fetchMaterial(data.media_id, 'news', {});
            console.log(data);
            let items = data.news_item;
            let news = [];
            items.forEach(function (item) {
                news.push({
                    title: item.title,
                    description: item.digest,
                    picUrl: picData.url,
                    url: item.url
                });
            });
            reply = news;
        } else if (content === '11') {
            let counts = yield wechatApi.countMaterial();
            console.log(JSON.stringify(counts));
            let results = yield[
                wechatApi.batchMaterial({offset: 0, count: 10, type: 'image'}),
                wechatApi.batchMaterial({offset: 0, count: 10, type: 'video'}),
                wechatApi.batchMaterial({offset: 0, count: 10, type: 'voice'}),
                wechatApi.batchMaterial({offset: 0, count: 10, type: 'news'})
            ];
            console.log('result', JSON.stringify(results));
        }else if (content === '12') {
            // let group = yield wechatApi.createGroup('wechat7')
            //
            // console.log('新分组 wechat7')
            // console.log(group)
            //
            // let groups = yield wechatApi.fetchGroups()
            //
            // console.log('加了 wechat 后的分组列表')
            // console.log(groups)
            ////
            // let group2 = yield wechatApi.checkGroup(message.FromUserName)
            //
            // console.log('查看自己的分组')
            //
            // console.log(group2)
            //
            // let result = yield wechatApi.moveGroup(message.FromUserName, 109)
            // console.log('移动到  115')
            // console.log(result)
            //
            // let groups2 = yield wechatApi.fetchGroups()
            //
            // console.log('移动后的分组列表')
            // console.log(groups2)
            //
            //let result2 = yield wechatApi.moveGroup([message.FromUserName], 119)
            //console.log('批量移动到  119')
            //console.log(result2)
            //
            //let groups3 = yield wechatApi.fetchGroups()
            //
            //console.log('批量移动后的分组列表')
            //console.log(groups3)
            //
            // let result3 = yield wechatApi.updateGroup(109, 'wechat109')
            //
            // console.log('117 wechat2 改名 wechat117')
            // console.log(result3)

             let groups4 = yield wechatApi.fetchGroups()

             console.log('改名后的分组列表')
             console.log(groups4)

             let result4 = yield wechatApi.deleteGroup(109)

             console.log('删除 114 tututu 分组')

             console.log(result4)
            

             let groups5 = yield wechatApi.fetchGroups()

             console.log('删除 114 后分组列表')
             console.log(groups5)


            reply = JSON.stringify('done')
        }
        this.body = reply;
    }
};