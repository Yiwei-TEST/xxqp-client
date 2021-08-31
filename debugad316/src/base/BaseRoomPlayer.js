/**
 * Created by zhoufan on 2016/12/16.
 */
var BaseRoomPlayer = cc.Class.extend({

    /**
     * {RoomPlayerVo}
     */
    _playerVo:null,
    _iconUrl:"",
    /**
     * @param name {RoomPlayerVo}
     * @param root {Object}
     */
    ctor:function(vo,root,seq){
        this._iconUrl = "";
        this._playerVo = vo;
        this.seq = seq;
        this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq);
        this.initX = this.iconbg.x;
        this.initY = this.iconbg.y;
        this.iconbg.temp = vo.seat;
        this.iconbg.visible = true;
        this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
        var nameStr = vo.name;
        nameStr = UITools.truncateLabel(nameStr,4);
        this.name.setString(nameStr);
        this.statusImg = ccui.helper.seekWidgetByName(root,"zb"+seq);
        if(this.statusImg)
            this.statusImg.visible = false;
        this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
        this.leave = ccui.helper.seekWidgetByName(root,"zl"+seq);
        if(this.leave)
            this.leave.visible = false;
        this.yybg = ccui.helper.seekWidgetByName(root,"yy"+seq);
        this.yyts = ccui.helper.seekWidgetByName(root,"yyts"+seq);
        if(this.yybg)
            this.yybg.visible = false;
        this.zj = ccui.helper.seekWidgetByName(root,"zj"+seq);
        if(this.zj)
            this.zj.visible = false;
        this.updatePoint(vo.point);
        this.showIcon();
    },

    /**
     * 庄家显示
     * @param bool
     */
    isBanker:function(bool){
        this.zj.visible = bool;
    },

    /**
     * 获取聊天数据模型
     */
    getChatData:function(){
        throw new Error("BaseRoomPlayer's subclass must override function getChatData");
    },

    /**
     * 获取头像icon的坐标 e.g. cc.p(10,10);
     */
    getIconPoint:function(){
        return cc.p(42,43);
    },

    /**
     * 获取快捷语言聊天的坐标
     * @param direct
     */
    getChatPoint:function(direct){
        var coords = {1:{x:-50,y:-20},2:{x:50,y:-20},3:{x:50,y:-20},4:{x:-50,y:-20}};
        return coords[direct];
    },

    /**
     * 获取表情的坐标
     * @param direct
     */
    getFacePoint:function(direct){
        var coords = {1:{x:-20},2:{x:20},3:{x:20},4:{x:-20}};
        return coords[direct];
    },

    /**
     * 表情or聊天需要转换anchorX的方向
     * @returns {boolean}
     */
    isChatAnchorDirect:function(){
        return (this.seq==2||this.seq==3);
    },

    /**
     * 获取playerVo
     * @returns {RoomPlayerVo}
     */
    getPlayerVo:function(){
        return this._playerVo;
    },

    /**
     * 打开玩家详细信息
     */
    showInfo:function(){
        var mc = new PlayerInfoPop(this._playerVo);
        PopupManager.addPopup(mc);
    },

    /**
     * 更新积分
     * @param point
     */
    updatePoint:function(point){
        this.point.setString(point);
    },

    /**
     * 退出房间
     */
    exitRoom:function(){
        this.iconbg.visible = false;
        this.statusImg.visible = false;
    },

    /**
     * 准备状态
     */
    onReady:function(){
        this.statusImg.visible = true;
    },

    /**
     * 语音聊天开始
     */
    startSpeak:function(){
        if(this.yybg.visible)
            return;
        this.yybg.visible = true;
        this.yybg.setOpacity(0);
        this.yyts.runAction(cc.fadeTo(0.8,255));
        this.yybg.runAction(cc.fadeTo(0.8,255));
    },

    /**
     * 语音聊天结束
     */
    stopSpeak:function(){
        var self = this;
        var action = cc.sequence(cc.fadeTo(0.8,0),cc.callFunc(function(){
            self.yybg.visible = false;
        }))
        this.yyts.runAction(cc.fadeTo(0.8,0));
        this.yybg.runAction(action);
    },

    /**
     * 离线或者在线状态
     * @param status
     */
    leaveOrOnLine:function(status){
        if(status == 2){
            this.leave.visible = false;
        }else{
            this.leave.visible = true;
            var texture = (status==1) ? "res/ui/images/img_dx.png" : "res/ui/images/img_zl.png";
            this.leave.loadTexture(texture);
        }
    },

    /**
     * 展示头像Icon
     */
    showIcon:function(){
        if(WXHeadIconManager.loadedIconListInRoom[this._playerVo.userId]){
            cc.log("weixin head icon has loaded..."+this._playerVo.name);
            return;
        }
        WXHeadIconManager.loadedIconListInRoom[this._playerVo.userId] = 1;
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = this._playerVo.icon;
        var defaultimg = (this._playerVo.sex==1) ? "res/res_dtz/dtzCom/default_m.png" : "res/res_dtz/dtzCom/default_w.png";
        if(!url)
            url = defaultimg;
        if(this._iconUrl == url)
            return;
        if(this.iconbg.getChildByTag(345))
            this.iconbg.removeChildByTag(345);
        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        var cpoint = this.getIconPoint();
        if(this._playerVo.icon){
            sprite.x = sprite.y = 0;
            try{
                var sten = new cc.Sprite("res/res_dtz/images/img_14_c.png");
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: cpoint.x, y: cpoint.y, alphaThreshold: 0.8});
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
            }catch(e){}
        }else{
            sprite.x = cpoint.x;
            sprite.y = cpoint.y;
            this.iconbg.addChild(sprite,5,345);
        }
    },

    /**
     * 快捷语言
     * @param data
     */
    fastChat:function(data){
        var id = data.id;
        var sprite = null;
        var label = null;
        var content = "";
        if(id>0){//快捷聊天
            var array = this.getChatData();//ChatData.mj_fix_msg;
            content = array[parseInt(id)-1];
        }else{
            if(id<0){//表情
                var frame = cc.spriteFrameCache.getSpriteFrame("face_"+data.content+".png");
                if(frame){
                    var coord = this.getFacePoint(this.seq);//{1:{x:-20},2:{x:20},3:{x:-20},4:{x:-20}};
                    sprite = new cc.Sprite("#face_"+data.content+".png");
                    sprite.scale = 1.5;
                    sprite.opacity=0;sprite.x = this.yybg.x+coord.x;sprite.y = this.yybg.y;
                    this.iconbg.addChild(sprite,20);
                }
            }else{
                content = data.content;
            }
        }
        if(content){
            var coord = this.getChatPoint(this.seq);//{1:{x:-50,y:-20},2:{x:50,y:-20},3:{x:50,y:-20},4:{x:-50,y:-20}};
            label = UICtor.cLabel(content,24,null,cc.color("FF361e06"),0,1);
            sprite = new cc.Scale9Sprite("res/res_mj/img_chat_4.png",null,cc.rect(30,0,10,64));
            if(this.isChatAnchorDirect()){
                sprite.anchorX=1;sprite.anchorY=0;
            }else{
                sprite.anchorX=sprite.anchorY=0;
            }
            sprite.addChild(label);
            var height = (label.height+30)<64 ? 64 : (label.height+30);
            sprite.setContentSize(label.width+30,height);
            label.x = sprite.width/2;label.y = sprite.height/2;
            this.iconbg.addChild(sprite,20);
            sprite.opacity=0;sprite.x = this.yybg.x+coord.x;sprite.y=this.yybg.y+coord.y;
        }
        if(sprite){
            var self = this;
            if(label){
                label.runAction(cc.sequence(cc.fadeTo(0.3,255),cc.delayTime(2.5),cc.fadeTo(0.8,0)));
            }
            var action = cc.sequence(cc.fadeTo(0.3,255),cc.delayTime(2.5),cc.fadeTo(0.8,0),cc.callFunc(function(){
                self.iconbg.removeChild(sprite);
            }))
            sprite.runAction(action);
        }
    }

})