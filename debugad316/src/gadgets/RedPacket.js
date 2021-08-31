/**
 * Created by zyq on 2020/1/11.
 */

var RedPacket = {
    showTime:null,
    showHour:null,
    showDay:null,

    loadData:function(data){
        this.activityID = data.id;//活动ID
        this.object_type = data.object_type;//对象 0所有游戏 1亲友圈普通场 2亲友圈比赛场 3普通游戏
        var trigger_time = data.trigger_time;//触发时间段
        trigger_time = trigger_time.split(",");
        this.game_num = data.game_num;//游戏局数
        this.redpackage_type = data.redpackage_type;//红包类型  1随机红包 2固定红包
        this.activityStatus = data.status;//活动状态 1开启  0关闭
        this.trigger_time = []
        for(var i = 0;i<trigger_time.length;i++){
            var data = trigger_time[i].split(":");
            this.trigger_time.push(data)
        }
    },

    check:function(parent){
        this.btn_redpacket = null;
        this.parent = parent;
        this.showTime = [[1,21],[1,22],[1,23],[1,29],[1,30],[1,31],[2,1]];
        this.showHour = 22;

        var serverDate = sy.scene.getCurServerTime()
        var date = new Date(serverDate)
        //var date = new Date()
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var bShowDay = false;
        for(var i = 0;i<this.showTime.length;i++){
            if(month == this.showTime[i][0] && day == this.showTime[i][1]){
                bShowDay = true;
                break;
            }
        }
        if(!bShowDay)return

        //var temp = cc.sys.localStorage.getItem("sy_is_show_red_packet_" + PlayerModel.userId);
        //if(temp == day) return;
        parent.schedule(this.updateTime.bind(this),1,cc.REPEAT_FOREVER,0);
    },
    updateTime:function(){
        var serverDate = sy.scene.getCurServerTime()
        var date = new Date(serverDate)
        //var date = new Date()
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var temp = cc.sys.localStorage.getItem("sy_is_show_red_packet_" + PlayerModel.userId);
        if(temp == day) {
            return;
        }
        for(var i = 0;i<this.showTime.length;i++){
            if(month == this.showTime[i][0] && day == this.showTime[i][1] && hour == this.showHour && min < 1){
                cc.sys.localStorage.setItem("sy_is_show_red_packet_" + PlayerModel.userId,day);
                this.showRedPacket()
                return;
            }
        }
    },

    showRedPacket:function(){
        if(this.btn_redpacket)return
        this.btn_redpacket = new ccui.Button("res/ui/ActivityPop/redpacket_0.png","res/ui/ActivityPop/redpacket_0.png","");
        this.btn_redpacket.setPosition(cc.winSize.width/2,cc.winSize.height/2+105);
        this.parent.addChild(this.btn_redpacket)
        UITools.addClickEvent(this.btn_redpacket,this,this.onRedPacketClick);
        var redpacketAnim = new AnimateSprite("res/plist/redpacket.plist","redpacket",1/5);
        redpacketAnim.setPosition(this.btn_redpacket.width/2,this.btn_redpacket.height/2)
        redpacketAnim.play();
        this.btn_redpacket.addChild(redpacketAnim);
    },

    removeRedPacket:function(){
        if(this.btn_redpacket){
            this.btn_redpacket.removeFromParent(true)
            this.btn_redpacket = null
        }

    },

    onRedPacketClick:function(){
        var pop = new RedPacketPop(this.parent.roomName);
        PopupManager.addPopup(pop);
    },

    getRedPackageActivityList:function(type,parent) {//type 2、大厅，1、房间内
        if(type == 2){
            SyEventManager.dispatchEvent(SyEvent.NEW_YEAR_ACTIVITY_NOTICE);
        }else if(type == 1){
            //if(parent)this.check(parent)
        }
        //var char_id = "char_id=" + PlayerModel.userId;
        //var t = "&t=" + Math.round(new Date().getTime() / 1000).toString();
        //var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
        //var code = "&code=getRedPackageActivityList"
        //var sign = char_id + code + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        //sign = "&sign=" + md5(sign).toUpperCase();
        //
        //var url = "http://bjdqp.firstmjq.club/agent/Redpackage/getRedPackageActivityList"
        //var body = char_id + code + rand + t + sign
        //var xhr = cc.loader.getXMLHttpRequest();
        //xhr.open("POST", url);
        //xhr.timeout = 12000;
        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        //var self = this;
        //var onerror = function () {
        //    xhr.abort();
        //    ServerUtil.getServerFromTJD();
        //    if (self._onErr)self._onErr("");
        //};
        //xhr.onerror = onerror;
        //xhr.ontimeout = onerror;
        //xhr.onreadystatechange = function () {
        //    if (xhr.readyState == 4) {
        //        if (xhr.status == 200) {
        //            var data = JSON.parse(xhr.responseText);
        //            if (data.code == 0) {//成功
        //                self.loadData(data.data[0])
        //                if(type == 2){
        //                    SyEventManager.dispatchEvent(SyEvent.NEW_YEAR_ACTIVITY_NOTICE);
        //                }else if(type == 1){
        //                    if(parent)self.check(parent)
        //                }
        //            } else {
        //            }
        //        } else {
        //            onerror.call(self);
        //        }
        //    }
        //};
        //xhr.send(body);
    },


    onClickHblxBtn:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/redpackage/index?"
        url = url + char_id + rand + t + sign
        var url = Network.getWebUrl(url);
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }else if(url.indexOf("bjdqp://redpacketshare") >= 0) {
                        //分享
                        this.onClickInviteBtn()
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    cancel:function(){
        this.parent.unscheduleAllCallbacks();
    }
}

