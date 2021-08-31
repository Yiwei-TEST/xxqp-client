/**
 * Created by zhoufan on 2016/7/23.
 */

var AHMJPlayer = BaseRoomPlayer.extend({
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
        this.root = root;
        this._jettons = [];
        this._isStart = false;
        if(MJRoomModel.isMoneyRoom()){
            if(MJRoomModel.isLNMJ()){
                this.coinNum = vo.ext[5];
            }else if(MJRoomModel.isKETMJ()) {
                this.coinNum = vo.ext[6];
            }
        }else{
            this.coinNum = 0;
        }
        if(MJRoomModel.isGameSite){
            this.coinNum = vo.totalPoint;
        }
        this._super(vo,root,seq);
        var initCoords = {1:{x:960,y:180},2:{x:1740,y:640},3:{x:960,y:900},4:{x:180,y:640}};
        if(MJRoomModel.renshu == 3){
            initCoords = {1:{x:960,y:180},2:{x:1740,y:640},3:{x:180,y:640}};
        }else if(MJRoomModel.renshu == 2){
            initCoords = {1:{x:960,y:180},2:{x:960,y:900}};
        }
        this.initX = initCoords[seq].x;
        this.initY = initCoords[seq].y;
        this.iconbg.x = this.initX;
        this.iconbg.y = this.initY;
        this.cp = ccui.helper.seekWidgetByName(root,"cp"+seq);
        this.cp.visible = false;
        this.ting = ccui.helper.seekWidgetByName(root,"ting"+seq);
        this.ting.visible = false;
        this.spoint = ccui.helper.seekWidgetByName(root,"spoint"+seq);
        this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
        this.spoint.visible = false;

        //this.img_dian = ccui.helper.seekWidgetByName(root,"img_dian"+seq);
        //if (this.img_dian){
        //    this.img_dian.visible = false;
        //}

        //var player = ccui.helper.seekWidgetByName(root,"player"+seq);
        //this.label_piaofen = ccui.helper.seekWidgetByName(player,"label_piaofen");
        //if (this.label_piaofen)
        //    this.label_piaofen.setString("");

        // if(MJRoomModel.isZYMJ() || MJRoomModel.isQAMJ() || MJRoomModel.isJNMJ() || MJRoomModel.isWWMJ() || MJRoomModel.isJQSB()) {
        //     this.xuanpai = ccui.helper.seekWidgetByName(root,"xuanpai"+seq);
        //     this.xuanpai.visible = false;
        //     if(MJRoomModel.isZYMJ()) {
        //         this.spritePlayer = ccui.helper.seekWidgetByName(root, "spritePlayer" + seq);
        //         this.zj.visible = this.spritePlayer.visible = MJRoomModel.isBanker(this._playerVo);
        //     }
        // }
        //if(MJRoomModel.isLZEB()){
        //    this.buhua = ccui.helper.seekWidgetByName(root,"buhua"+seq);
        //    this.buhua.visible = false;
        //}

        this.tuoguanSp = ccui.helper.seekWidgetByName(root,"tuoguanSp"+seq);
        if(this.tuoguanSp){
            this.tuoguanSp.visible = false;
        }
        if(MJRoomModel.isMoneyRoom()){
            this.updatePoint(this.coinNum);
        }
        if(MJRoomModel.isGameSite){
            this.updatePoint(vo.ext[14]);
        }

        this.ipSame = ccui.helper.seekWidgetByName(root,"ipSame"+seq);
        if (this.ipSame){
            this.ipSame.visible = false;
        }

        var isCredit = MJRoomModel.isCreditRoom();
        if(isCredit && isCredit != "0"){
            if(MJRoomModel.getIsSwitchCoin()){
                if(ccui.helper.seekWidgetByName(root,"Image_coin_"+seq)){
                    ccui.helper.seekWidgetByName(root,"Image_coin_"+seq).visible = true;
                }
                this.Label_coin = ccui.helper.seekWidgetByName(root,"Label_coin_"+seq);
                if(this.Label_coin){
                    this.Label_coin.setString(""+this._playerVo.coin);
                }
                this.showHeadFrame()
            }else{
                this.spoint.visible = true;
                var creditNum = MJRoomModel.getCreditNum(this._playerVo);
                this.spoint.setString("赛:"+creditNum);
                if(ccui.helper.seekWidgetByName(root,"Image_coin_"+seq)) {
                    ccui.helper.seekWidgetByName(root, "Image_coin_" + seq).visible = false;
                }
            }
        }else{
            if(ccui.helper.seekWidgetByName(root,"Image_coin_"+seq)) {
                ccui.helper.seekWidgetByName(root, "Image_coin_" + seq).visible = false;
            }
        }

        if(MJRoomModel.isClubGoldRoom()){
            this.spoint.visible = true;
            var num = UITools.moneyToStr(vo.gold);
            this.spoint.setString("豆:"+num);
        }

        this.piaofen_img = this.iconbg.getChildByName("piaofen_img");
        if (!this.piaofen_img){
            this.piaofen_img = new cc.Sprite("res/res_mj/mjSmallResult/biao_piao0.png");
            this.iconbg.addChild(this.piaofen_img,19);
            this.piaofen_img.setName("piaofen_img");
            this.piaofen_img.x = 120;
            this.piaofen_img.y = 40;
            this.piaofen_img.visible = false;
        }else{
            this.hidePiaoFenImg();
        }

        this.paofenImg_TCPFMJ = this.iconbg.getChildByName("paofenImg_TCPFMJ");
        if (!this.paofenImg_TCPFMJ){
            this.paofenImg_TCPFMJ = new cc.Sprite("res/res_mj/res_ahmj/tcmjRoom/paofeng.png");
            this.paofenImg_TCPFMJ.scale = 1.2;
            this.iconbg.addChild(this.paofenImg_TCPFMJ,99999);
            this.paofenImg_TCPFMJ.setName("paofenImg_TCPFMJ");
            this.paofenImg_TCPFMJ.x = 75;
            this.paofenImg_TCPFMJ.y = 0;
            this.paofenImg_TCPFMJ.visible = false;
            var action = cc.sequence(cc.scaleTo(0.5,1.5),cc.scaleTo(0.5,1.2)).repeatForever();
            this.paofenImg_TCPFMJ.runAction(action);
        }

        if(MJRoomModel.isTJMJ() && seq == 1){
            //this.point.x = 200;
            this.point.y = 100;
            //this.spoint.x = 200;
            this.spoint.y = 70;
            this.ting.x = 100;
            this.ting.y = -110;
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.DHMJ || MJRoomModel.wanfa == GameTypeEunmMJ.BSMJ){//保山德宏不要比赛分
            this.spoint.setString("");
            this.spoint.visible = false;
        }
    },

    updateClubTableCoin:function(coin){
        if(this.Label_coin){
            this.Label_coin.setString(coin ||0)
        }
    },

    hideJaiChuiImg:function(){
        this.piaofen_img.visible =false;
    },


    showJaiChuiImg:function(type){
        if (this.piaofen_img){
            var pngUrl ="res/res_mj/mjRoom/img_chui"+type+".png";
            this.piaofen_img.setTexture(pngUrl);
            this.piaofen_img.visible = true;
        }
    },

    showPiaoFenImg:function(type){
        var pngUrl ="res/res_mj/mjSmallResult/biao_piao"+type+".png";
        this.piaofen_img.setTexture(pngUrl);
        this.piaofen_img.visible =true;
    },
    hidePiaoFenImg:function(){
        this.piaofen_img.visible =false;
    },

    updateTuoguan:function(isTuoguan){
        if(this.tuoguanSp && isTuoguan != null){
            cc.log("刷新托管状态的显示" , isTuoguan);
            this.tuoguanSp.visible = isTuoguan;
            this.isTuoguan = isTuoguan;
        }
    },
    updatePoint:function(point){
        if(MJRoomModel.isMoneyRoom()){
            cc.log("显示玩家金币：" , point);
            if(point>= 0 && point < 1000000){
                this.point.setString(point);
            }else if(point < 0){
                this.point.setString("-" + Math.abs(point));
            }else{
                this.point.setString(PlayerModel.moneyToStr(point));
            }
        }else{
            this.point.setString(point);
        }
    },

    setPiaofen:function(point){
        //var str = "";
        //if(point == 0)str = "不飘";
        //if(point > 0)str = "飘" + point + "分";
        //this.label_piaofen.setString(str);
        this.showPiaoFenImg(point);
    },

    changeSPoint: function(point) {
        var currently = MJRoomModel.getHuPoint(this._playerVo);
        currently += point;
        MJRoomModel.setHuPoint(this._playerVo, currently);
        this.updateSPoint(currently);
        this.playHuPointAction(point);
    },

    updateSPoint: function(point) {
        this.spoint.setString(point+"");
    },

    getContainer:function(){
        return this.iconbg;
    },

    pushJettonData:function(jetton){
        this._jettons.push(jetton);
    },

    shiftJettonData:function(){
        var jetton = this._jettons.shift();
        this.removeJetton(jetton);
    },

    removeJetton:function(jetton){
        cc.pool.putInPool(jetton);
        this.root.removeChild(jetton);
    },

    getJettonCount:function(){
        return this._jettons.length;
    },

    playJettonArmature:function(){
        //if(this.isPlayArmature){
        //    return;
        //}
        //this.isPlayArmature = true;
        //if(!this.jettonArmature){
        //    ccs.armatureDataManager.addArmatureFileInfo(
        //        "res/plist/texiao01.ExportJson");
        //    this.jettonArmature = new ccs.Armature("texiao01");
        //    this.jettonArmature.x = -45;
        //    this.jettonArmature.y = 150;
        //    this.iconbg.addChild(this.jettonArmature,199);
        //    this.jettonArmature.getAnimation().setFrameEventCallFunc(function(bone, evt) {
        //        if(evt == "finish"){
        //            self.isPlayArmature = false;
        //            self.jettonArmature.getAnimation().stop();
        //            self.jettonArmature.visible = false;
        //        }
        //    });
        //}
        //this.jettonArmature.visible = true;
        //var self = this;
        //this.jettonArmature.getAnimation().play("play",-1,0);
        //AudioManager.play("res/audio/mj/jetton.mp3");
    },

    showHeadFrame:function(){
        if(this._playerVo.frameId > 0) {
            var img = "res/ui/bjdmj/popup/pyq/playerinfo/img_vip_head_frame_" + this._playerVo.frameId + ".png";
            var headFrame = this.iconbg.getChildByName("headFrame");
            if (!headFrame) {
                headFrame = new cc.Sprite();
                this.iconbg.addChild(headFrame, 10);
                headFrame.setPosition(cc.p(this.iconbg.width / 2, this.iconbg.height / 2));
                headFrame.setName("headFrame");
            }
            headFrame.setTexture(img)
        }
    },

    showIcon:function(){
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = this._playerVo.icon;
        var defaultimg = "res/res_mj/mjBigResult/default_m.png" ;
        if(!url)
            url = defaultimg;
        if(this._iconUrl == url)
            return;
        if(this.iconbg.getChildByTag(345))
            this.iconbg.removeChildByTag(345);
        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        sprite.setScale(0.95);
        var sten = new cc.Sprite("res/res_mj/mjRoom/img_14_c.png");
        var clipnode = new cc.ClippingNode();
        var cpoint = this.getIconPoint();
        clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: cpoint.x, y: cpoint.y, alphaThreshold: 0.8});
        clipnode.addChild(sprite);
        this.iconbg.addChild(clipnode,5,345);
        if(this._playerVo.icon){
            cc.log("加载网络头像");
            sprite.x = sprite.y = 0;
            try{
                var self = this;
                cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
                    if (!error && (LayerManager.isInMJ())) {
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
            //sprite.x = this.icon.width/2;
            //sprite.y = this.icon.height/2;
            //this.icon.addChild(sprite,5,345);
        }
    },

    setPaoFengImg_TCPFMJ:function(type){
        this.paofenImg_TCPFMJ.visible = type == 1;
    },

    cleanJettonData:function(){
        for(var i=0;i<this._jettons.length;i++){
            this.removeJetton(this._jettons[i]);
        }
        this._jettons.length = 0;
    },
    showDianNum:function (num) {
        //this.img_dian.visible=true;
        //if (num == 0){
        //    this.img_dian.loadTexture("res/res_symj/symjRoom/img_bumai.png");
        //}else{
        //    this.img_dian.loadTexture("res/res_symj/symjRoom/img_"+num+"dian.png");
        //}
        this.ting.visible = true;
        if (num == 0){
            this.ting.loadTexture("res/res_mj/mjRoom/img_bumai.png");
        }else{
            this.ting.loadTexture("res/res_mj/mjRoom/img_"+num+"dian.png");
        }
    },

    BSMJBaoTing:function(isBool){
        if(isBool){
            var pngUrl ="res/res_mj/mjRoom/mjRoom_13.png";//mj_btn_ting
            this.piaofen_img.setTexture(pngUrl);
        }
        this.piaofen_img.visible = isBool;
    },

    tingPai:function(){
        this.ting.visible = false;
        //if((MJRoomModel.getWanfaTypeByHp() == 2 && MJRoomModel.isHuiPai())){
        //    this.ting.loadTexture("res/res_mj/zzmjRoom/mjRoom_13.png");
        //}
        //if(MJRoomModel.isJQTJ()){
        //    this.ting.loadTexture("res/res_mj/zzmjRoom/mjRoom_44.png");
        //}
    },

    /**
     * 获取快捷聊天内容模版
     * @returns {Array}
     */
    getChatData:function(){
        return ChatData.mj_fix_msg;
    },

    getIconPoint: function() {
        return cc.p(70.5,70.5);
    },

    chuPai:function(mjVo,delayTime){
        if(mjVo.n == 0){
            return
        }
        delayTime = delayTime || 0.5;
        this.cp.visible = true;
        var mj = null;
        mj = new AHMahjong(MJAI.getDisplayVo(1, 1), mjVo);
        mj.setScale(1.15);
        mj.x = -3;
        mj.y = -5;
        this.cp.addChild(mj,1,123);
        //this.cp.y = 175;
        //if(MJRoomModel.wanfa != GameTypeEunmMJ.YJMJ){
        //    this.cp.y = 175;
        //}
        var self = this;
        var action = cc.sequence(cc.delayTime(delayTime),cc.callFunc(function(){
            self.cp.visible = false;
            self.cp.removeChildByTag(123);
        }));
        this.cp.runAction(action);
    },

    startGame:function(){
        this.statusImg.visible = false;
        var size = cc.director.getWinSize();
        var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
        var offx = tempSize > 100 ? 50 : tempSize/2;
        if(MJRoomModel.renshu == 4) {
            if (this.seq == 1) {
                this.iconbg.x = 80;
                this.iconbg.y = 350;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 2) {
                this.iconbg.x = 1820;
                this.iconbg.y = 690;
                if(MJRoomModel.wanfa == GameTypeEunmMJ.TJMJ){
                    this.iconbg.y = 640;
                }
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 3) {
                this.iconbg.x = 1350;
                this.iconbg.y = 980;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 4) {
                this.iconbg.x = 100;
                this.iconbg.y = 690;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
        }else if(MJRoomModel.renshu == 3){
            if (this.seq == 1) {
                this.iconbg.x = 80;
                this.iconbg.y = 350;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 2) {
                this.iconbg.x = 1820;
                this.iconbg.y = 690;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 3) {
                this.iconbg.x = 100;
                this.iconbg.y = 690;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
        }else if(MJRoomModel.renshu == 2){
            if (this.seq == 1) {
                this.iconbg.x = 80;
                this.iconbg.y = 350;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 2) {
                this.iconbg.x = 1350;
                this.iconbg.y = 980;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    this.iconbg.x += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
        }
        this._isStart = true;
    },

    startGameAni:function(){
        this.statusImg.visible = false;
        var endposx = this.iconbg.x;
        var endposy = this.iconbg.y;
        var size = cc.director.getWinSize();
        var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
        var offx = tempSize > 100 ? 50 : tempSize/2;
        if(MJRoomModel.renshu == 4) {
            if (this.seq == 1) {
                endposx = 80;
                endposy = 350;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 2) {
                endposx = 1820;
                endposy = 690;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 3) {
                endposx = 1350;
                endposy = 980;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 4) {
                endposx = 100;
                endposy = 690;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
        }else if(MJRoomModel.renshu == 3){
            if (this.seq == 1) {
                endposx = 80;
                endposy = 350;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 2) {
                endposx = 1820;
                endposy = 690;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 3) {
                endposx = 100;
                endposy = 690;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
        }else if(MJRoomModel.renshu == 2){
            if (this.seq == 1) {
                endposx = 80;
                endposy = 350;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx -= (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
            if (this.seq == 2) {
                endposx = 1350;
                endposy = 980;
                if(size.width > SyConfig.DESIGN_WIDTH){
                    endposx += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
                }
            }
        }
        this.iconbg.runAction(cc.moveTo(0.25,cc.p(endposx,endposy)));
        this._isStart = true;
    },

    fastChat:function(data){
        var id = data.id;
        var sprite = null;
        var label = null;
        var content = "";
        if(id>0){//快捷聊天
            var array = ChatData.mj_fix_msg;
            if(MJRoomModel.isTJMJ()){
                array = ChatData.tjmj_fix_msg;
            }
            if(MJRoomModel.wanfa == GameTypeEunmMJ.YJMJ){
                array = ChatData.yjmj_fix_msg;
            }else  if(MJRoomModel.isTCPFMJ() ||MJRoomModel.isTCDPMJ() ){
                array = ChatData.tcpfmj_fix_msg;
            }
            content = array[parseInt(id)-1];
        }else {
            if (id < 0) {//表情
                var armatureJson = "res/plist/faceAM" + data.content + ".ExportJson";
                var armatureName = "faceAM" + data.content;
                ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
                var chatArmature = new ccs.Armature(armatureName);
                chatArmature.x = 70;
                chatArmature.y = 50;
                if(this.seq == 2){//最后边的玩家 头像稍微往左边移动些
                    chatArmature.x = 30;
                }
                this.iconbg.addChild(chatArmature, 100);
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
            var coords = {1:{x:-50,y:-20},2:{x:50,y:-20},3:{x:-50,y:-20},4:{x:-50,y:-20}};
            var coord = coords[this.seq];
            label = UICtor.cLabel(content,42,null,cc.color("FF361e06"),0,1);
            sprite = new cc.Scale9Sprite("res/res_mj/mjRoom/img_chat_4.png",null,cc.rect(30,0,10,64));
            if(this.seq==2){
                sprite.anchorX=1;sprite.anchorY=0;
            }else{
                sprite.anchorX=sprite.anchorY=0;
            }
            sprite.addChild(label);
            var height = (label.height+40)<96 ? 96 : (label.height+40);
            sprite.setContentSize(label.width+40,height);
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
        var renshu = MJRoomModel.renshu;

        var posx = 55;
        var posy = 65;


        if(animationName == "socialAM7"){//monkey
            posx = 75;
            posy = 65;
        }
        if(animationName == "socialAM4"){//boom
            posx = 70;
            posy = 80;
        }
        if(animationName == "socialAM3"){//ji
            posx = 75;
            posy = 65;
        }
        if(animationName == "socialAM6"){//ice
            posx = 75;
            posy = 85;
        }
        if(animationName == "socialAM5"){//beer
            posx = 75;
            posy = 80;
        }
        if(animationName == "socialAM2"){//fanqie
            posx = 75;
            posy = 80;
        }
        if(animationName == "socialAM1"){//kiss
            posx = 75;
            posy = 70;
        }

        return {x :posx , y:posy};
    },

    playPropArmature:function(temp){
        var armatureName = "socialAM"+temp;
        var armatureJson = "res/plist/"+armatureName+".ExportJson";
        ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
        var propArmature = new ccs.Armature(armatureName);

        cc.log("this.seq..." ,this.seq);
        var posMsg = this.getAnimationPos(this.seq , armatureName);
        propArmature.x = posMsg.x;
        propArmature.y = posMsg.y;
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

    overGame:function(){
        this.iconbg.x = this.initX;
        this.iconbg.y = this.initY;
    },

    //玩家显示托管字样
    showTrusteeship:function(status){
        //if(status==1){
        //    this.tuoguan.visible = true;
        //}else{
        //    this.tuoguan.visible = false;
        //}
    },

    //IP相同显示
    isIpSame:function(bool){
        if(MJRoomModel.renshu == 2)
            bool = false;
        this.ipSame.visible = bool;
    },

    playHuPointAction: function(point) {
        var fnt = point>0 ? "res/font/font_mj4.fnt" : "res/font/font_mj5.fnt";
        point = point>0 ? "+"+point : ""+point;
        var scoreLabel = new cc.LabelBMFont(point,fnt);
        scoreLabel.x = this.iconbg.width/2;
        scoreLabel.y = this.iconbg.height/2-50;
        this.iconbg.addChild(scoreLabel,99,789);
        var action = cc.sequence(cc.moveTo(1,scoreLabel.x,scoreLabel.y+80),cc.delayTime(0.8),cc.fadeTo(0.5,0),cc.callFunc(function() {
            scoreLabel.removeFromParent(true);
        }));
        scoreLabel.runAction(action);
    },

    setTingState:function(bool){
        this.ting.visible = bool;
    },

    setPaofenByResult:function(paofen){
        if(this.iconbg.getChildByTag(699)){
            this.iconbg.removeChildByTag(699);
        }
        if(this.iconbg.getChildByTag(700)){
            this.iconbg.removeChildByTag(700);
        }
        var url = "res/res_mj/mjRoom/pao"+paofen+".png";
        var Image = UICtor.cImg(url);
        Image.setPosition(this.iconbg.width+Image.width/2,Image.height/2+5);
        if(this.seq == 2 || this.seq == 4 || this.seq == 1)
            Image.setPosition(this.iconbg.width/2,this.iconbg.height + Image.height/2);
        this.iconbg.addChild(Image,1,699);
        this.isBanker(true);
    },

    play:function(){
        var self = this;
        var action = cc.sequence(cc.blink(2,6),cc.callFunc(function(){
            self.spritePlayer.visible = false;
        }));
        this.spritePlayer.runAction(action);
    },

    stop:function(){
        this.spritePlayer.stopAllActions();
    },

    paoFen:function(paofen){
        if(this.iconbg.getChildByTag(700)){
            this.iconbg.removeChildByTag(700);
        }
        if(this.iconbg.getChildByTag(699)){
            this.iconbg.removeChildByTag(699);
        }
        var url = "res/res_mj/mjRoom/pao"+paofen+".png";
        if(MJRoomModel.isHSMJ()){
            url = "res/res_mj/mjRoom/icon_yuzi_"+paofen+".png";
        }else if(MJRoomModel.isWWMJ()){
            url = "res/res_mj/mjRoom/piao"+paofen+".png";
        }
        var Image = UICtor.cImg(url);
        Image.setPosition(this.iconbg.width+Image.width/2,Image.height/2+5);
        if(MJRoomModel.renshu == 4) {
            if (this.seq == 2 || this.seq == 4 || this.seq == 1)
                Image.setPosition(this.iconbg.width / 2, this.iconbg.height + Image.height / 2);
        }else if(MJRoomModel.renshu == 3){
            Image.setPosition(this.iconbg.width / 2, this.iconbg.height + Image.height / 2);
        }else if(MJRoomModel.renshu == 2){
            if (this.seq == 1)
                Image.setPosition(this.iconbg.width / 2, this.iconbg.height + Image.height / 2);
        }
        this.iconbg.addChild(Image,1,700);
    },

    refrePosition:function(){
        var image = this.iconbg.getChildByTag(700);
        if(image && !this.xuanpai.visible){
            if(MJRoomModel.renshu == 2) {
                if(this.seq == 1) {
                    image.setPosition(this.iconbg.width / 2, -image.height / 2);
                }
            }else if(MJRoomModel.renshu == 3){
                image.setPosition(this.iconbg.width / 2, -image.height / 2);
            }else if(MJRoomModel.renshu == 4 && this.seq != 3){
                image.setPosition(this.iconbg.width / 2, -image.height / 2);
            }
        }
    },

    xuanPai: function (bool) {
        this.xuanpai.loadTexture("res/res_mj/mjRoom/mjRoom_40.png");
        this.xuanpai.visible = bool;
        this.refrePosition();
    },

    changeXuanPai:function(){
        this.xuanpai.visible = true;
        this.xuanpai.loadTexture("res/res_mj/mjRoom/mjRoom_41.png");
    },

    cleanLastPaoFen:function(){
        if(this.iconbg.getChildByTag(700)){
            this.iconbg.removeChildByTag(700);
        }
        if(this.iconbg.getChildByTag(699)){
            this.iconbg.removeChildByTag(699);
        }
    },

    isBanker:function(bool){
        this.zj.visible = bool;
        if(this.spritePlayer)
            this.spritePlayer.visible = bool;
    },

    showTingCard:function(id,isTianTing){
        var isTianTing = isTianTing || false;
        if(this.ting.getChildByTag(99)){
            this.ting.removeChildByTag(99);
        }
        if(isTianTing){
            var url = "res/res_mj/mjRoom/tianting"+id+".png";
            var card = UICtor.cImg(url);
            card.setScale(0.6);
            card.x = this.ting.width / 2 + 30;
            card.y = 30;
            this.ting.addChild(card,1,99);
        }else {
            var mjVo = MJAI.getMJDef(id);
            var card = new Mahjong(MJAI.getDisplayVo(1, 4), mjVo);
            card.x = this.ting.width / 2 + 5;
            card.y = 5;
            this.ting.addChild(card,1,99);
        }
    },

    buHuaByLZEB:function(huaCount){
        this.buhua.visible = true;
        if(this.buhua.getChildByTag(123)){
            this.buhua.removeChildByTag(123);
        }
        var label = new cc.LabelBMFont("x"+huaCount,"res/font/res_font_buhua.fnt");
        label.x = this.buhua.width+label.width/2-5;
        label.y = this.buhua.height/2-5;
        label.setScale(0.8);
        this.buhua.addChild(label,1,123);
    },


    setPlayerOnLine:function(){
        if(this.leave.visible && this.tuoguanSp && !this.tuoguanSp.isVisible()){
            this.leave.visible = false;
        }
    },

});
