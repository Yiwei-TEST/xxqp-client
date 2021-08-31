/**
 * Created by Administrator on 2019/12/9.
 */
var HBGZPPlayer = cc.Class.extend({
    /** @lends CardPlayer.prototype */

    /**
     * {RoomPlayerVo}
     */
    _playerVo:null,
    _iconUrl:"",
    /**
     *
     * @param name {RoomPlayerVo}
     * @param root {Object}
     */
    ctor:function(vo,root,seq){
        // cc.log("new player seq",seq);
        this._iconUrl = "";
        this._playerVo = vo;
        this.seq = seq;
        this.iconContainer = this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq);
        this.iconContainer.setLocalZOrder(4);// 让快捷短语的层级高于手牌
        this.initX = this.iconbg.x;
        this.initY = this.iconbg.y;
        this.iconbg.temp = vo.seat;
        this.iconbg.visible = true;
        this.isTuoguan = false;
        if(HBGZPRoomModel.isMoneyRoom()){
            this.coinNum = vo.ext[5];
        }else{
            this.coinNum = vo.point;
        }
        this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
        var nameStr = vo.name;
        nameStr = UITools.truncateLabel(nameStr,4);
        this.name.setString(nameStr);
        //this.name.setString("我是来测试的的啊");
        this.statusImg = ccui.helper.seekWidgetByName(root,"zb"+seq);
        this.statusImg.visible = false;
        this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
        this.leave = ccui.helper.seekWidgetByName(root,"zl"+seq);
        cc.log("this.leave=",this.leave);
        this.leave.visible = false;
        this.yybg = ccui.helper.seekWidgetByName(root,"yy"+seq);
        this.yyts = ccui.helper.seekWidgetByName(root,"yyts"+seq);
        this.yybg.visible = false;
        this.cp = ccui.helper.seekWidgetByName(root,"cp"+seq);
        this.cp.visible = false;
        this.zj = ccui.helper.seekWidgetByName(root,"zj"+seq);
        this.zj.visible = false;
        if(HBGZPRoomModel.renshu==4){
            this.sx = ccui.helper.seekWidgetByName(root,"sx"+seq);
            this.sx.visible = false;
        }
        this.label_daniao = ccui.helper.seekWidgetByName(root,"Label_daniao_"+seq);
        //this.label_daniao.setString("跑分中...");
        this.label_daniao.visible = false;

        this.hx = ccui.helper.seekWidgetByName(root,"hx"+seq);
        this.fz = ccui.helper.seekWidgetByName(root,"fz"+seq);

        this.hx.setString("胡:0");
        this.isShowFangZhao(0);
        this.updateHuXi(vo.ext[0]);
        this.updatePoint(this.coinNum);
        this.showIcon();

        if (HBGZPRoomModel.mySeat == vo.seat){
            HBGZPRoomModel.myOutHuxi = vo.ext[0];
        }
        //ip相同提示
        this.ipSame = ccui.helper.seekWidgetByName(root,"ipSame"+seq);
        this.ipSame.visible = false;
        this.blink = ccui.helper.seekWidgetByName(root, "blink" + seq);
        this.blink.visible = false;

        this.fangzhuImg = ccui.helper.seekWidgetByName(root,"fangzhu"+seq);
        this.fangzhuImg.visible = false;

        if (HBGZPRoomModel.getFangZhu(vo)){
            this.fangzhuImg.visible = true;
        }

        this.playerBgImg = ccui.helper.seekWidgetByName(root,"Image_playerBg"+seq);

        //ccui.helper.seekWidgetByName(root,"lableCreditScore"+seq).visible = true;

        this.tuoguanSp = ccui.helper.seekWidgetByName(this.iconbg, "tuoguanSp");
        if (this.tuoguanSp){
            this.tuoguanSp.visible = false;
        }

        this.creditScore = ccui.helper.seekWidgetByName(root,"lableCreditScore"+seq);
        if (this.creditScore){
            this.creditScore.setString("");
        }
        var isCredit = HBGZPRoomModel.isCreditRoom();

        if (isCredit){
            if(HBGZPRoomModel.getIsSwitchCoin()){
               this.showHeadFrame(seq)
            }else {
                var creditNum = HBGZPRoomModel.getCreditNum(this._playerVo);
                this.creditScore.setString("赛:" + creditNum);
            }
        }

        if(HBGZPRoomModel.isClubGoldRoom()){
            this.creditScore.setString("豆:"+ UITools.moneyToStr(vo.gold));
        }

        this.niao_img = this.iconContainer.getChildByName("niao_img");
        if (!this.niao_img){
            this.niao_img = new cc.Sprite("res/res_phz/phz_niao.png");
            this.iconContainer.addChild(this.niao_img,20);
            this.niao_img.setName("niao_img");
            this.niao_img.x = 75;
            this.niao_img.y = 15;
            this.niao_img.visible = false;
        }

        this.datuo_img = ccui.helper.seekWidgetByName(root,"img_datuo_"+seq);

        this.qihu_img = this.iconContainer.getChildByName("qihu_img");
        if (!this.qihu_img){
            this.qihu_img = new cc.Sprite("res/res_phz/phz_qihu.png");
            this.iconContainer.addChild(this.qihu_img,20);
            this.qihu_img.setName("qihu_img");
            this.qihu_img.x = 45;
            this.qihu_img.y = 45;
            this.qihu_img.visible = false;
        }


    },

    showHeadFrame:function(){
        //cc.log("showHeadFrame",JSON.stringify(this._playerVo))
        if(this._playerVo.frameId > 0) {
            var img = "res/ui/bjdmj/popup/pyq/playerinfo/img_vip_head_frame_" + this._playerVo.frameId + ".png"
            this.headFrame = this.iconbg.getChildByName("headFrame")
            if (!this.headFrame) {
                this.headFrame = new cc.Sprite();
                this.kuang.addChild(this.headFrame, 10)
                this.headFrame.setPosition(cc.p(this.kuang.width / 2, this.kuang.height / 2))
                this.headFrame.setName("headFrame")
            }
            this.headFrame.visible = true
            this.headFrame.setTexture(img)
        }

        this.Label_coin = this.creditScore.getChildByName("Label_coin")
        if(!this.Label_coin){
            this.Label_coin = UICtor.cLabel("",30,cc.size(0,0),cc.color("#FFDF2D"),0,0);
            this.creditScore.addChild(this.Label_coin);
            this.Label_coin.setName("Label_coin")
            this.Label_coin.setPosition(20 - this.creditScore.getAnchorPoint().x*90,-5)
            this.Label_coin.setAnchorPoint(0,0.5)
            var coinImg = new cc.Sprite("res/res_phz/img_jinbi.png");
            this.Label_coin.addChild(coinImg)
            coinImg.setPosition(-25,20)
        }
        this.Label_coin.visible = true;
        this.Label_coin.setString(""+this._playerVo.coin)
    },

    updateClubTableCoin:function(coin){
        if(this.Label_coin){
            this.Label_coin.setString(coin ||0)
        }
    },

    showQiHuImg:function(){
        cc.log("showQiHuImg ================>");
        this.qihu_img.visible =true;
    },

    hideQiHuImg:function(){
        cc.log("hideQiHuImg ================>");
        this.qihu_img.visible =false;
    },
    showDaNiaoImg:function(){
        // this.niao_img.setTexture("res/ui/phz/phz_niao.png");
        this.niao_img.visible =true;
    },
    hideDaNiaoImg:function(){
        this.niao_img.visible =false;
    },

    showPiaoFenImg:function(type){
        var pngUrl ="res/ui/phz/phzRoom/biao_piao"+type+".png";
        this.niao_img.setTexture(pngUrl);
        this.niao_img.visible =true;
    },

    hidePiaoFenImg:function(){
        this.niao_img.visible =false;
    },

    showChuiImg:function(type){
        var pngUrl ="res/res_phz/phzRoom/img_chui"+type+".png";
        this.niao_img.setTexture(pngUrl);
        this.niao_img.visible =true;
    },

    hideDaTuoImg:function(){
        this.datuo_img.visible =false;
    },

    showDaTuoImg:function(type,isHBGZP){
        var pngUrl = "res/res_phz/phzRoom/img_jiatuo.png";
        if(type != 1){
            pngUrl = "res/res_phz/phzRoom/img_bujiatuo.png";
        }
        if(isHBGZP){
            pngUrl = "res/res_phz/res_hbgzp/" + "tag"+type+".png";
        }
        this.datuo_img.loadTexture(pngUrl);
        this.datuo_img.visible =true;
    },

    hidePiaoFenImg:function(){
        this.niao_img.visible =false;
    },

    updateTuoguan:function(isTuoguan){
        if(this.tuoguanSp && isTuoguan != null){
            cc.log("刷新托管状态的显示" , isTuoguan);
            this.tuoguanSp.visible = isTuoguan;
            this.isTuoguan = isTuoguan;
        }
    },

    //IP相同显示
    isIpSame:function(visible){
        if (HBGZPRoomModel.renshu == 2)
            visible = false;
        this.ipSame.visible = visible;
    },

    updateHuXi:function(huxi){
        if(this.seq == 1){
            this.hx.setString("总胡:"+huxi);
        }else{
            this.hx.setString("胡:"+huxi);
        }
    },

    showInfo:function(){
        var fal = (HBGZPRoomModel.masterId==PlayerModel.userId && this._playerVo.userId!=HBGZPRoomModel.masterId) ? true : false;
        var mc = new PlayerInfoPop(this._playerVo,HBGZPRoomModel.tableId,fal);
        //var mc = new PlayerInfoPop(this._playerVo,PHZRoomModel.tableId,fal);
        PopupManager.addPopup(mc);
    },

    fastChat:function(data){
        var id = data.id;
        var sprite = null;
        var label = null;
        var content = "";
        if(id>0){//快捷聊天
            var array = ChatData.hbgzp_fix_msg;
            content = array[parseInt(id)-1];
        }else {
            if (id < 0) {//表情
                var armatureJson = "res/plist/faceAM" + data.content + ".ExportJson";
                var armatureName = "faceAM" + data.content;
                ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
                var chatArmature = new ccs.Armature(armatureName);
                chatArmature.x = 70;
                chatArmature.y = 90;
                if (PHZRoomModel.renshu == 4){
                    if(this.seq == 3 || this.seq == 4){//最后边的玩家 头像稍微往左边移动些
                        chatArmature.y = 20;
                    }
                    if (this.seq == 2 || this.seq == 3){
                        chatArmature.x = 20;
                    }
                }else if(PHZRoomModel.renshu == 3){
                    if(this.seq == 2 || this.seq == 3){//最后边的玩家 头像稍微往左边移动些
                        if (this.seq == 2){
                            chatArmature.x = 20;
                        }
                        chatArmature.y = 20;
                    }
                }
                this.iconbg.addChild(chatArmature, 22);
                var musicName = "res/audio/fixMsg/emoticon_" + data.content + ".mp3";
                AudioManager.play(musicName);
                chatArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
                    if (evt == "finish") {
                        chatArmature.getAnimation().stop();
                        chatArmature.removeFromParent(true);
                        //ccs.armatureDataManager.removeArmatureFileInfo(armatureJson);
                    }
                });
                chatArmature.getAnimation().play(armatureName, -1, 0);
            } else {
                content = data.content;
            }
        }
        if(content){
            var coords = {1:{x:-50,y:-20},2:{x:70,y:-20},3:{x:-50,y:-20},4:{x:-50,y:-20}};
            var coord = coords[this.seq];
            label = UICtor.cLabel(content,42,null,cc.color("FF361e06"),0,1);
            sprite = new cc.Scale9Sprite("res/ui/common/img_chat_4.png",null,cc.rect(10,10,10,96));
            if(this.seq==2){
                sprite.anchorX=0.5;sprite.anchorY=0;
            }else{
                sprite.anchorX=sprite.anchorY=0;
            }
            sprite.addChild(label);
            var height = (label.height+45)<96 ? 96 : (label.height+30);
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
    },

    getAnimationPos:function(direct , animationName){
        cc.log("direct , animationName"  , direct , animationName);
        var renshu = PHZRoomModel.renshu;

        var posx = 55;
        var posy = 65;

        if(animationName == "socialAM4"){
            posx = 40;
            posy = 125;
        }
        if(animationName == "socialAM6"){
            posx = 45;
            posy = 125;
        }
        if(animationName == "socialAM5"){
            posx = 45;
            posy = 125;
        }
        if(animationName == "socialAM2"){
            posx = 50;
            posy = 125;
        }
        if(animationName == "socialAM1"){
            posx = 45;
            posy = 125;
        }

        if(PHZRoomModel.is4Ren()){
            if(animationName == "socialAM7"){//monkey
                posx = 35;
                posy = 10;
            }
            if(animationName == "socialAM4"){//boom
                posx = 35;
                posy = 50;
            }
            if(animationName == "socialAM3"){//ji
                posx = 45;
                posy = 25;
            }
            if(animationName == "socialAM6"){//ice
                posx = 35;
                posy = 65;
            }
            if(animationName == "socialAM5"){//beer
                posx = 45;
                posy = 45;
            }
            if(animationName == "socialAM2"){//fanqie
                posx = 50;
                posy = 50;
            }
            if(animationName == "socialAM1"){//kiss
                posx = 45;
                posy = 40;
            }

        }

        return {x :posx , y:posy};
    },

    playPropArmature:function(temp){
        var armatureName = "socialAM"+temp;
        var armatureJson = "res/plist/"+armatureName+".ExportJson";
        ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
        var propArmature = new ccs.Armature(armatureName);

        //cc.log("this.seq...,armatureName" ,this.seq , armatureName);
        if (HBGZPRoomModel.is3Ren()  || HBGZPRoomModel.is2Ren()) {
            var posMsg = this.getAnimationPos(this.seq , armatureName);
            propArmature.x = posMsg.x;
            propArmature.y = posMsg.y -50;
        } else {
            propArmature.x = 55;
            propArmature.y = 65;
        }
        /*		if(this.seq == 2) {
         propArmature.x = 140;
         }else if(this.seq == 3){
         propArmature.x = 20;
         }*/

        propArmature.anchorX = propArmature.anchorY = 0.5;
        if(temp == 7){
            propArmature.setScale(0.7);
        }
        this.iconbg.addChild(propArmature,20);
        propArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
            if (evt == "finish") {
                propArmature.getAnimation().stop();
                propArmature.removeFromParent(true);
            }
        });
        var musicName = "res/audio/fixMsg/prop"+temp+".mp3";
        AudioManager.play(musicName);
        propArmature.getAnimation().play(armatureName, -1, 0);
    },

    chuPai:function(mjVo){
        //this.cp.visible = true;
        //this.cp.setOpacity(255);
        //var mj = new Mahjong(MJAI.getDisplayVo(1,2),mjVo);
        //mj.x = 2;
        //mj.y = 1;
        //this.cp.addChild(mj,1,123);
        //var self = this;
        //var action = cc.sequence(cc.delayTime(1),cc.callFunc(function(){
        //    mj.chuPai();
        //}),cc.fadeTo(1,0),cc.callFunc(function(){
        //    self.cp.visible = false;
        //    self.cp.removeChildByTag(123);
        //}));
        //this.cp.runAction(action);
    },

    startSpeak:function(){
        if(this.yybg.visible)
            return;
        this.yybg.visible = true;
        this.yybg.setOpacity(0);
        this.yyts.runAction(cc.fadeTo(0.8,255));
        this.yybg.runAction(cc.fadeTo(0.8,255));
    },

    stopSpeak:function(){
        var self = this;
        var action = cc.sequence(cc.fadeTo(0.8,0),cc.callFunc(function(){
            self.yybg.visible = false;
        }))
        this.yyts.runAction(cc.fadeTo(0.8,0));
        this.yybg.runAction(action);
    },

    onReady:function(){
        this.statusImg.visible = true;
        //this.hx.visible = false;
    },

    startGame:function(){
        this.statusImg.visible = false;
        //this.hx.visible = true;
        // this.qihu_img.visible =false;
    },

    overGame:function(){
        this.iconbg.x = this.initX;
        this.iconbg.y = this.initY;
        this.updateHuXi(0);
    },

    leaveOrOnLine:function(status){
        if(status == 2){
            this.leave.visible = false;
        }else{
            this.leave.visible = true;
            var texture = (status==1) ? "res/ui/dtz/images/img_dx.png" : "res/ui/dtz/images/img_zl.png";
            this.leave.loadTexture(texture);
        }
    },

    hideLeaveSp:function(){
        //非托管状态下
        if(this.leave && this.leave.visible && !this.isTuoguan){
            this.leave.visible = false
        }
    },
    showDaNiaoType:function () {
        // cc.log("showDaNiaoType ========>");
        if (this.label_daniao)
            this.label_daniao.visible=true;
    },

    hideDaNiaoType:function () {
        if (this.label_daniao)
            this.label_daniao.visible=false;
    },
    exitRoom:function(){
        delete WXHeadIconManager.loadedIconListInRoom[this._playerVo.userId];
        //this.iconbg.visible = false;
        if(this.iconbg.getChildByTag(345))
            this.iconbg.removeChildByTag(345);
        this.name.setString("");
        this.point.setString("");
        this.ipSame.visible = false;
        this.leave.visible = false;
        this.zj.visible = false;
        this.yybg.visible = false;
        this.statusImg.visible = false;
        this.playerBgImg.visible = false;
        this.creditScore.setString("");
        this.hx.setString("");
        if(this.headFrame){
            this.headFrame.visible = false;
        }
        if(this.Label_coin){
            this.Label_coin.visible = false;
        }
    },

    isBanker:function(bool){
        this.zj.visible = bool;
        if (bool){
            HBGZPRoomModel.bankerSeat = this._playerVo.seat;
        }
    },

    isShuXing:function(bool){
        this.sx.visible = false;
    },

    isShowFangZhao:function(val){
        this.fz.visible = (val == 1);
    },

    updatePoint:function(point){
        if(HBGZPRoomModel.isMoneyRoom()){
            // cc.log("显示玩家金币：" , point);
            if(point>= 0 && point < 1000000){
                this.point.setString(point);
            }else if(point < 0){
                this.point.setString("-" + Math.abs(point));
            }else{
                this.point.setString(DTZRoomModel.moneyToStr(point));
            }
        }else{
            this.point.setString(point);
        }
    },

    showIcon:function(){

        /*        if(WXHeadIconManager.loadedIconListInRoom[this._playerVo.userId])
         return;*/
        WXHeadIconManager.loadedIconListInRoom[this._playerVo.userId] = 1;
        // this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = this._playerVo.icon;
        var defaultimg = "res/res_phz/default_m.png";

        if(!url)
            url = defaultimg;
        if(this._iconUrl == url)
            return;
        if(this.iconbg.getChildByTag(345))
            this.iconbg.removeChildByTag(345);
        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);

        sprite.setScale(1.05);
        if(this._playerVo.icon){
            cc.log("showIcon::"+this._playerVo.icon);
            sprite.x = sprite.y = 0;
            try{
                var sten = null;
                sten = new cc.Sprite("res/res_phz/header_mask.png");
                var clipnode = new cc.ClippingNode();
                if (HBGZPRoomModel.is3Ren()) {
                    //clipnode.scale = 0.86;
                    clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 46, y: 50, alphaThreshold: 0.8});
                } else{
                    clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 46, y: 50, alphaThreshold: 0.8});
                }
                clipnode.addChild(sprite);
                if (HBGZPRoomModel.is3Ren()) {
                    this.iconContainer.addChild(clipnode,5,345);
                } else {
                    this.iconContainer.addChild(clipnode,5,345);
                }
                var self = this;
                cc.loader.loadImg(this._playerVo.icon, {width: 270, height: 270}, function (error, img) {
                    if (!error && (LayerManager.getCurrentLayer()==LayerFactory.HBGZP_ROOM || LayerManager.getCurrentLayer()==LayerFactory.HBGZP_ROOM_MORE
                        || LayerManager.getCurrentLayer()==LayerFactory.HBGZP_ROOM_LESS)) {
                        sprite.setTexture(img);
                        sprite.x = 0;
                        sprite.y = 0;
                        SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,self._playerVo.seat);
                    }else{
                        self._iconUrl = "";
                    }
                });
            }catch(e){}
        }else{
            SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,this._playerVo.seat);
            sprite.x = 46;
            sprite.y = 45;
            this.iconContainer.addChild(sprite,5,345);
        }
    },

    playerQuanAnimation:function( showOrHide ){
        if(this.quanAnimation == null && this.iconbg.getChildByTag(1314) != null){
            cc.log(".. 玩家断线重连了 其实特效还在 不要重复创建");
        }

        this.quanAnimation = this.iconbg.getChildByTag(1314);

        if(this.quanAnimation == null){
            var armatureJson = "res/res_phz/plist/txklq/txklq.ExportJson";
            ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
            this.quanAnimation = new ccs.Armature("txklq");
            this.quanAnimation.getAnimation().play("txlk", -1, -1);
            this.quanAnimation.x = 45;
            this.quanAnimation.y = this.iconbg.height * 0.48;
            //this.quanAnimation.play();
            this.quanAnimation.setLocalZOrder(5);
            this.quanAnimation.setTag(1314);
            this.iconbg.addChild(this.quanAnimation);
        }else{
            //this.quanAnimation.stop();
            //this.quanAnimation.play();
            this.quanAnimation.x = 45;
            this.quanAnimation.y = this.iconbg.height * 0.48;
        }
        this.quanAnimation.visible = showOrHide;
    },

    //增加金币飞行特效的部分接口
    getContainer:function(){
        return this.iconbg;
    },

});