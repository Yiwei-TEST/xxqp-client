/**
 * Created by Administrator on 2016/7/11.
 */
var PlayerGPSCell = ccui.Widget.extend({

    ctor:function(label){
        this._super();
        var text = UICtor.cLabel(label, 22, cc.size(400,0), cc.color("#814731"), 0, 0);
        text.anchorX=text.anchorY=0;
        this.addChild(text);
        this.setContentSize(text.width,text.height);
    }

})
var PlayerInfoPop = BasePopup.extend({

    ctor: function (data,tableType) {
        this._playerVo = data;
        this.tableType = tableType
        this._super("res/playerInfo.json");
    },

    selfRender: function () {
        var nameStr = this._playerVo.name;
        nameStr = UITools.truncateLabel(nameStr,5);
        this.getWidget("name").setString(nameStr);
        var idStr = this._playerVo.userId;
        if (idStr != PlayerModel.userId){
            idStr = UITools.dealUserId(idStr);
        }
        // cc.log("BaseRoomModel.isGoldRoom() =",BaseRoomModel.isGoldRoom());
        this.getWidget("uid").setString("ID："+idStr);
        // this.getWidget("ip").setString(!BaseRoomModel.isGoldRoom() ? "IP：" + this._playerVo.ip : "");
        this.getWidget("ip").setString("");
        this.ListView_7 = this.getWidget("ListView_7");
        this.iconbg = this.getWidget("Image_8");
        this._iconUrl = "";
        if(this._playerVo.credit){
            this.getWidget("Label_credit").setString(""+ MathUtil.toDecimal(this._playerVo.credit)||0)
        }else{
            this.getWidget("Label_credit").visible = false;
        }
        if(this._playerVo.sex==0)
            this.getWidget("Image_10").loadTexture("res/ui/common/women.png");
        //this.ListView_7.visible = false;
        //先只显示六个
        var array = [7,4,3,6,5,1,2];
        //写新的排版
        var beginX = 75;
        var beginY = 175;
        var offx  = 150;
        var offy = 120;
        var panelNode = this.getWidget("anmPanel");
        for(var i = 0 ; i < 7 ; i++){
            var x = beginX;
            var y = beginY;
            if(i < 4){
                x = beginX + i * offx;
            }else{
                x = beginX + (i - 4) * offx;
                y = beginY - offy;
            }
            var prop = new ccui.Button();
            prop.temp = array[i];
            prop.loadTextureNormal("res/ui/emoji/prop" + array[i] + ".png");
            prop.setZoomScale(0);
            prop.anchorX = prop.anchorY = 0.5;
            prop.scale = 1.0;
            prop.x = x;
            prop.y = y;
            panelNode.addChild(prop);
            UITools.addClickEvent(prop,this,this.onProp);

        }

        if(((BaseRoomModel.curRoomData.wanfa == GameTypeEunmPK.CDTLJ && CDTLJRoomModel.isFzbHide())
            || (BaseRoomModel.curRoomData.wanfa == GameTypeEunmPK.XTSDH && SDHRoomModel.isFzbHide()))){
            panelNode.setVisible(false);
        }

        this.Panel_bigHead = this.getWidget("Panel_bigHead");
        this.Panel_bigHead.visible = false;
        this.iconbg.temp = 1;
        UITools.addClickEvent(this.iconbg,this,this.showBigHead);
        var closeBtn = this.getWidget("closeBtn");
        closeBtn.visible = false;
        this.Panel_bigHead.temp = 2;
        UITools.addClickEvent(this.Panel_bigHead,this,this.showBigHead);

        if(BaseRoomModel.isBanVoiceAndProps()){
            panelNode.setVisible(false);
        }

        //for(var i = 0;i < 7;i++){
        //    var ui = new ccui.Widget();
        //    ui.setContentSize(80,0);
        //    var prop = new ccui.Button();
        //    prop.temp = array[i];
        //    prop.loadTextureNormal("res/ui/emoji/prop" + array[i] + ".png");
        //    prop.setZoomScale(0);
        //    prop.anchorX = prop.anchorY = 0.5;
        //    prop.x = prop.y = 40;
        //    ui.addChild(prop);
        //    this.ListView_7.addChild(ui);
        //    UITools.addClickEvent(prop,this,this.onProp);
        //}
        this.showIcon();
/*
        //GPS处理（已关闭显示 ）
        if(GPSSdkUtil.isHasGPS()){
            var myUserId = this._playerVo.userId;
            var players = DTZRoomModel.players;
            for(var i=0;i<players.length;i++){
                var p = players[i];
                if(p.userId != this._playerVo.userId){
                    var distance = GPSModel.getDistance(myUserId, p.userId);
                    this.ListView_7.pushBackCustomItem(new PlayerGPSCell("与"+ p.name+"(ID:"+ p.userId+")相距"+distance))
                }
            }
            if(SdkUtil.isReview()){
                if (this.ListView_7.getItems().length <= 0) {
                    this.ListView_7.pushBackCustomItem(new PlayerGPSCell("距离定位系统："));
                    this.ListView_7.pushBackCustomItem(new PlayerGPSCell("暂无其他玩家，无法显示距离信息"));
                    this.ListView_7.pushBackCustomItem(new PlayerGPSCell("请先邀请一名玩家进入游戏"));
                }
            }
        }*/
        this.getWidget("score").visible = false;
        this.getWidget("leader").visible = false;
        if(BaseRoomModel.curRoomData.wanfa == GameTypeEunmZP.LDFPF && PHZRoomModel.ext[21]
        && parseInt(PHZRoomModel.ext[21]) > 0)
            this.getLeaderData();
    },
    
    getLeaderData:function () {
        var self = this;
        NetworkJT.loginReq("groupActionNew", "loadGroupUserInfoForSpy",
                {groupId:parseInt(PHZRoomModel.ext[21]),sessCode:PlayerModel.sessCode,userId:PlayerModel.userId,targetUserId:self._playerVo.userId}, function (data) {
                    if (data.code == 0) {
                        // cc.log("loadGroupUserInfoForSpy data =",JSON.stringify(data));
                        self.getWidget("score").visible = true;
                        self.getWidget("score").setString("输赢:" + (data.message.sumCredit/100));
                        self.getWidget("leader").visible = true;
                        self.getWidget("leader").setString("上级:" + data.message.upUserName + " ID:" +  data.message.upUserId);
                    }
                }, function (data) {
                    // cc.log("data =",JSON.stringify(data));
                    self.getWidget("score").visible = false;
                    self.getWidget("leader").visible = false;
                });
    },

    //显示隐藏大图层
    showBigHead:function(obj){
        if (obj.temp == 1){
            this.Panel_bigHead.visible = true;
        }else{
            this.Panel_bigHead.visible = false;
        }
    },

    onProp:function(obj){
        sySocket.sendComReqMsg(9,[-1,this._playerVo.seat],[obj.temp+""]);
        PopupManager.remove(this);
    },

    showIcon:function(){
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = this._playerVo.icon;
        var defaultimg = (this._playerVo.sex==1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";
        if(!url)
            url = defaultimg;
        if(this._iconUrl == url)
            return;
        if(this.iconbg.getChildByTag(345))
            this.iconbg.removeChildByTag(345);
        this._iconUrl = url;

        if(this.Panel_bigHead.getChildByTag(345))
            this.Panel_bigHead.removeChildByTag(345);

        //大图
        var sprite1 = new cc.Sprite(defaultimg);
        sprite1.x = this.Panel_bigHead.width*0.5;
        sprite1.y = this.Panel_bigHead.height*0.5;
        sprite1.scale = 5;
        this.Panel_bigHead.addChild(sprite1,5,345);

        var sprite = new cc.Sprite(defaultimg);

        if(this._playerVo.icon){
            sprite.x = sprite.y = 0;
            var sten = new cc.Sprite("res/ui/common/img_14_c.png");
            var clipnode = new cc.ClippingNode();
            clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: this.iconbg.width/2, y: this.iconbg.height/2, alphaThreshold: 1});
            clipnode.addChild(sprite);
            this.iconbg.addChild(clipnode,5,345);
            var self = this;
            cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite1.setTexture(img);
                    sprite.setTexture(img);
                }else{
                    self._iconUrl = "";
                }
            });
        }else{
            sprite.setPosition(this.iconbg.width/2,this.iconbg.height/2);
            this.iconbg.addChild(sprite,5,345);
        }


    }
});

var PHZPlayerInfoPop = BasePopup.extend({

    ctor: function (data) {
        this._playerVo = data;
        this._super("res/phzPlayerInfo.json");
    },

    selfRender: function () {
        var nameStr = this._playerVo.name;
        nameStr = UITools.truncateLabel(nameStr,5);
        this.getWidget("name").setString(nameStr);
        var idStr = this._playerVo.userId;
        if (idStr != PlayerModel.userId){
            idStr = UITools.dealUserId(idStr);
        }
        this.getWidget("uid").setString("ID："+idStr);
        // this.getWidget("ip").setString(BaseRoomModel.isGoldRoom()?" ":"IP："+this._playerVo.ip);
        this.getWidget("ip").setString("");
        this.ListView_7 = this.getWidget("ListView_7");
        this.iconbg = this.getWidget("Image_8");
        this._iconUrl = "";
        if(this._playerVo.credit){
            this.getWidget("Label_credit").setString(""+ MathUtil.toDecimal(this._playerVo.credit/100)||0)
        }else{
            this.getWidget("Label_credit").visible = false;
        }
        if(this._playerVo.sex==0)
            this.getWidget("Image_10").loadTexture("res/ui/common/women.png");
        //this.ListView_7.visible = false;
        //先只显示六个
        var array = [7,4,3,6,5,1,2];
        //写新的排版
        var beginX = 60;
        var beginY = 120;
        var offx  = 120;
        var offy = 80;
        var panelNode = this.getWidget("anmPanel");
        for(var i = 0 ; i < 7 ; i++){
            var x = beginX;
            var y = beginY;
            if(i < 4){
                x = beginX + i * offx;
            }else{
                x = beginX + (i - 4) * offx;
                y = beginY - offy;
            }
            var prop = new ccui.Button();
            prop.temp = array[i];
            prop.loadTextureNormal("res/ui/emoji/prop" + array[i] + ".png");
            prop.setZoomScale(0);
            prop.anchorX = prop.anchorY = 0.5;
            prop.x = x;
            prop.y = y;
            panelNode.addChild(prop);
            UITools.addClickEvent(prop,this,this.onProp);

        }
        this.showIcon();

        if(BaseRoomModel.isBanVoiceAndProps()){
            panelNode.setVisible(false);
        }
    },

    onProp:function(obj){
        sySocket.sendComReqMsg(9,[-1,this._playerVo.seat],[obj.temp+""]);
        PopupManager.remove(this);
    },

    showIcon:function(){
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = this._playerVo.icon;
        var defaultimg = (this._playerVo.sex==1) ? "res/res_dtz/images/default_m.png" : "res/res_dtz/images/default_w.png";
        if(!url)
            url = defaultimg;
        if(this._iconUrl == url)
            return;
        if(this.iconbg.getChildByTag(345))
            this.iconbg.removeChildByTag(345);
        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        if(this._playerVo.icon){
            sprite.x = sprite.y = 0;
            var sten = new cc.Sprite("res/res_dtz/images/img_40.png");
            var clipnode = new cc.ClippingNode();
            clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 44, y: 44, alphaThreshold: 0.8});
            clipnode.addChild(sprite);
            this.iconbg.addChild(clipnode,5,345);
            var self = this;
            cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = 0;
                    sprite.y = 0;
                }else{
                    self._iconUrl = "";
                }
            });
        }else{
            sprite.x = sprite.y = 44;
            this.iconbg.addChild(sprite,5,345);
        }
    }
});
