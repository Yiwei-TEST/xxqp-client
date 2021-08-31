/**
 * Created by zyq on 2020/1/9.
 */

var RedPacketPop = BasePopup.extend({
    ctor: function (roomName) {
        this.roomName = roomName;
        this._super("res/RedPacketPop.json");
    },

    selfRender: function () {
        this.Panel_bg = this.getWidget("Panel_bg")
        UITools.addClickEvent(this.Panel_bg, this, this.onCloseClick);
        this.layerBg_1 = this.getWidget("layerBg_1")
        this.layerBg_2 = this.getWidget("layerBg_2")
        this.layerBg_2.visible = false;
        this.btn_open = this.getWidget("btn_open")
        UITools.addClickEvent(this.btn_open, this, this.onClickOpenBtn);
        this.Label_money = this.getWidget("Label_money")
        this.Image_bg = this.getWidget("Image_bg")
        this.Label_no = this.getWidget("Label_no")
    },

    onClickOpenBtn:function(){
        if(this.roomName){
            var aid = "aid=" + RedPacket.activityID
            var char_id = "&char_id=" + PlayerModel.userId;
            var code = "&code=RedPackageActivity"
            var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
            var t = "&t=" + Math.round(new Date().getTime() / 1000).toString();
            var trigger_stage = "&trigger_stage=" + 0
            var sign = aid + char_id + code + rand + t +trigger_stage+ "dfc2c2d62dde2c104203cf71c6e15580";
            cc.log("sign=",sign)
            sign = "&sign=" + md5(sign).toUpperCase();

            var url = "http://bjdqp.firstmjq.club/agent/Redpackage/createRedPackageActivityCDKey"
            var body = aid + char_id + code + rand + t +trigger_stage+ sign
            cc.log("body=",body)
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("POST", url);
            xhr.timeout = 12000;
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            var self = this;
            var onerror = function () {
                xhr.abort();
                ServerUtil.getServerFromTJD();
                SocketErrorModel.updateLoginIndex();
                if (self._onErr)self._onErr("");
            };
            xhr.onerror = onerror;
            xhr.ontimeout = onerror;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var data = JSON.parse(xhr.responseText);
                        if (data.code == 0) {//成功
                            self.layerBg_1.visible = false
                            self.layerBg_2.visible = true
                            self.Label_money.setString((data.amount || 0) + "")
                            RedPacket.removeRedPacket()
                            self.addAnim()
                        } else {
                            self.layerBg_1.visible = false
                            self.layerBg_2.visible = true
                            self.Image_bg.visible = false
                            self.Label_no.visible = true
                            RedPacket.removeRedPacket()
                        }
                    } else {
                        onerror.call(self);
                    }
                }
            };
            xhr.send(body);
        }else{
            this.layerBg_1.visible = false
            this.layerBg_2.visible = true
            this.Image_bg.visible = false
            this.Label_no.visible = true
            RedPacket.removeRedPacket()
        }
    },

    addAnim:function(){
        var redpacketAnim = new AnimateSprite("res/plist/redpacket_open.plist","redpacket_open",1/6);
        redpacketAnim.setPosition(this.layerBg_2.width/2-50,this.layerBg_2.height/2+360)
        redpacketAnim.play();
        this.layerBg_2.addChild(redpacketAnim);
    },

    onCloseClick:function(){
        PopupManager.remove(this);
    }

})