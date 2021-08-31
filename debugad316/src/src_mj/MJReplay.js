/**
 * Created by Administrator on 2016/8/30.1
 */
var MJReplayer = cc.Class.extend({
    _playerVo:null,
    _iconUrl:"",
    /**
     *
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
        this.name.setString(vo.name);
        this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
        this.cp = ccui.helper.seekWidgetByName(root,"cp"+seq);
        this.cp.visible = false;
        this.zj = ccui.helper.seekWidgetByName(root,"zj"+seq);
        this.zj.visible = false;
        this.ting = ccui.helper.seekWidgetByName(root,"ting"+seq);
        this.ting.visible = false;
        this.updatePoint(vo.point);
        this.showIcon();
        this.startGame();
        this.isBanker((vo.handCardIds.length>13));
        this.spoint = ccui.helper.seekWidgetByName(root,"spoint"+seq);
        if(MJReplayModel.isGSMJ()) {
            this.updateSPoint(MJReplayModel.getHuPoint(vo));
        } else {
            this.spoint.visible = false;
            if(cc.isNumber(vo.credit)){
                this.spoint.visible = true;
                this.spoint.setString("赛:" + MathUtil.toDecimal(vo.credit/100));
            }
        }
        if(MJReplayModel.isLZEB()){
            this.buhua = ccui.helper.seekWidgetByName(root,"buhua"+seq);
            this.buhua.visible = false;
        }

        this.tuoguanSp = ccui.helper.seekWidgetByName(root,"tuoguanSp"+seq);
        if(this.tuoguanSp){
            this.tuoguanSp.visible = false;
        }

        this.piaofen_img = this.iconbg.getChildByName("piaofen_img");
        if (!this.piaofen_img){
            this.piaofen_img = new cc.Sprite("res/res_mj/mjSmallResult/biao_piao0.png");
            this.iconbg.addChild(this.piaofen_img,99999);
            this.piaofen_img.setName("piaofen_img");
            this.piaofen_img.x = 140;
            this.piaofen_img.y = 50;
            this.piaofen_img.visible = false;
        }
    },

    showHuanZhangCards:function(cards){
        this.cqxzmj_hzNode = new cc.Node();
        this.iconbg.addChild(this.cqxzmj_hzNode,19);
        for (var i = 0; i < cards.length; i++) {
            var card = new CQXZMahjong(MJAI.getDisplayVo(1,3),MJAI.getMJDef(cards[i]));
            this.cqxzmj_hzNode.addChild(card);
            card.scale = 0.7;
            if(cards.length == 4){
                card.x = 20 + i%2*45;
                card.y = Math.floor(i/2)*65;
                card.scale = 0.6;
                card.setLocalZOrder(i);
            }else{
                card.x = i*50;
            }
        }
        var cardY = cards.length == 4?130:150;
        if(this.seq == 1){
            this.cqxzmj_hzNode.y = cardY;
        }else if(this.seq == 2){
            if(MJReplayModel.renshu == 2){
                this.cqxzmj_hzNode.x = 150;
            }else{
                this.cqxzmj_hzNode.y = cardY;
            }
        }else if(this.seq == 3){
            if(MJReplayModel.renshu == 3){
                this.cqxzmj_hzNode.y = cardY;
            }else if(MJReplayModel.renshu == 4){
                this.cqxzmj_hzNode.x = 150;
            }
        }else if(this.seq == 4){
            this.cqxzmj_hzNode.y = cardY;
        }
    },
    removeHuanZhangCards:function(){
        this.cqxzmj_hzNode.removeAllChildren();
        this.cqxzmj_hzNode.removeFromParent();
    },
    showDingQueImg:function(type){
        this.dingque_img = this.iconbg.getChildByName("dingque_img");
        if (!this.dingque_img){
            var pngUrl ="res/res_mj/res_cqxzmj/cqxzmjRoom/dingque_"+type+".png";
            this.dingque_img = new cc.Sprite(pngUrl);
            this.iconbg.addChild(this.dingque_img,19);
            this.dingque_img.setName("dingque_img");
            this.dingque_img.x = 80;
            this.dingque_img.y = 85;
            this.dingque_img.visible = true;
        }else{
            if (this.dingque_img){
                var pngUrl ="res/res_mj/res_cqxzmj/cqxzmjRoom/dingque_"+type+".png";
                this.dingque_img.setTexture(pngUrl);
                this.dingque_img.visible = true;
            }
        }
    },
    hideDingqueImg:function(){
        if(this.dingque_img){
            this.dingque_img.removeFromParent();
            this.dingque_img = null;
        }
    },

    updateTuoguan:function(isTuoguan){
        if(this.tuoguanSp){
            this.tuoguanSp.visible = isTuoguan == 1;
        }
    },

    showTingLogo:function(isShow){
        if(isShow){
            this.ting.x = 120;
            this.ting.y = 70;
            this.ting.visible = true;
            this.ting.loadTexture("res/res_mj/mjRoom/mjRoom_13.png");
        }
    },

    showPiaoFenImg:function(type){
        if (type == -1){
            return
        }
        var pngUrl ="res/res_mj/mjSmallResult/biao_piao"+type+".png";
        this.piaofen_img.setTexture(pngUrl);
        this.piaofen_img.visible =true;
    },
    hidePiaoFenImg:function(){
        this.piaofen_img.visible = false;
    },
    updateSPoint: function(point) {
        this.spoint.setString(point+"");
    },

    changeSPoint: function(point) {
        var currently = MJReplayModel.getHuPoint(this._playerVo);
        currently += point;
        MJReplayModel.setHuPoint(this._playerVo, currently);
        this.updateSPoint(currently);
        this.playHuPointAction(point);
    },

    playHuPointAction: function(point) {
        var fnt = point>0 ? "res/font/font_mj4.fnt" : "res/font/font_mj5.fnt";
        point = point>0 ? "+"+point : ""+point;
        var scoreLabel = new cc.LabelBMFont(point,fnt);
        scoreLabel.x = this.iconbg.width/2;
        scoreLabel.y = this.iconbg.height/2-50;
        this.iconbg.addChild(scoreLabel,99);
        var action = cc.sequence(cc.moveTo(1,scoreLabel.x,scoreLabel.y+80),cc.delayTime(0.8),cc.fadeTo(0.5,0),cc.callFunc(function() {
            scoreLabel.removeFromParent(true);
        }));
        scoreLabel.runAction(action);
    },

    tingPai:function(bool){
        this.ting.visible = bool;
    },

    showDianNum:function (num) {
        this.ting.visible = true;
        if (num == 0){
            this.ting.loadTexture("res/res_mj/mjRoom/img_bumai.png");
        }else{
            this.ting.loadTexture("res/res_mj/mjRoom/img_"+num+"dian.png");
        }
    },

    showInfo:function(){
        var mc = new PlayerInfoPop(this._playerVo);
        PopupManager.addPopup(mc);
    },

    chuPai:function(mjVo){
        this.cp.visible = true;
        this.cp.setOpacity(255);
        var mj = new Mahjong(MJAI.getDisplayVo(1,2),mjVo);
        mj.x = 5;
        mj.y = 5;
        this.cp.addChild(mj,1,123);
        var self = this;
        var action = cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            mj.chuPai();
        }),cc.fadeTo(1,0),cc.callFunc(function(){
            self.cp.visible = false;
            self.cp.removeChildByTag(123);
        }));
        this.cp.runAction(action);
    },


    startGame:function(){
        if(MJReplayModel.renshu == 4) {
            if (this.seq == 1) {
                this.iconbg.x = 100;
                this.iconbg.y = 320;
            }
            if (this.seq == 2) {
                this.iconbg.x = 1820;
                this.iconbg.y = 690;
            }
            if (this.seq == 3) {
                this.iconbg.x = 1350;
                this.iconbg.y = 980;
            }
            if (this.seq == 4) {
                this.iconbg.x = 100;
                this.iconbg.y = 690;
            }
        }else if(MJReplayModel.renshu == 3){
            if (this.seq == 1) {
                this.iconbg.x = 100;
                this.iconbg.y = 320;
            }
            if (this.seq == 2) {
                this.iconbg.x = 1820;
                this.iconbg.y = 690;
            }
            if (this.seq == 3) {
                this.iconbg.x = 100;
                this.iconbg.y = 690;
            }
        }else if(MJReplayModel.renshu == 2){
            if (this.seq == 1) {
                this.iconbg.x = 100;
                this.iconbg.y = 320;
            }
            if (this.seq == 2) {
                this.iconbg.x = 1350;
                this.iconbg.y = 980;
            }
        }
    },

    isBanker:function(bool){
        this.zj.visible = bool;
    },

    updatePoint:function(point){
        this.point.setString(point);
    },

    showIcon:function(){
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = this._playerVo.icon;
        var defaultimg = "res/res_mj/mjRoom/mjRoom_8.png";
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
            try{
                var sten = new cc.Sprite("res/res_mj/mjRoom/mjRoom_8.png");
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 70.5, y: 70.5, alphaThreshold: 0.8});
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
            sprite.x = 70.5;
            sprite.y = 70.5;
            this.iconbg.addChild(sprite,5,345);
        }
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
            var card = new BSMahjong(MJAI.getDisplayVo(1, 4), mjVo);
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
    }

});