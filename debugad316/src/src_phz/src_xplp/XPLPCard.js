/**
 * Created by Administrator on 2020/6/3.
 */
var XPLPCard = ccui.Widget.extend({
    /** @lends Card.prototype */
    _cardVo:null,
    _displayVo:null,
    _bg:null,
    _bgPng:null,
    _tingList:[],
    /**
     * @construct
     * @param displayVo {MJDisplayVo}
     * @param cardVo {MJVo}
     */
    ctor:function(displayVo,cardVo){
        this._super();
        this.touchLayer=null;
        this.selected = false;
        this.mjTouchMoved = false;
        this.isTing = false;
        this.refresh(displayVo,cardVo);
    },

    /**
     * 出牌
     */
    pushOut:function(){
        this.removeFromParent(true);
    },

    getSprite:function(texture){
        var frame = cc.spriteFrameCache.getSpriteFrame(texture);
        if(!frame){
            //cc.log("Mahjong texture::"+texture+" is not exist!!!");
            FloatLabelUtil.comText("Mahjong::"+texture+"not exist!!!");
            //texture = "lnmjbg_d4p3_an_1.png";
        }
        return new cc.Sprite("#"+texture);
    },

    /**
     * @param displayVo {MJDisplayVo}
     * @param cardVo {MJVo}
     */
    refresh:function(displayVo,cardVo){
        if(this._displayVo){
            if(displayVo.direct==this._displayVo.direct&&displayVo.place==this._displayVo.place){
                if(this._cardVo && this._cardVo.hasOwnProperty("c")){
                    if(cardVo&&cardVo.hasOwnProperty("c") && cardVo.c==this._cardVo.c){
                        var localDan = cardVo.dan || 0;
                        var curDan = this._cardVo.dan || 0;
                        if(localDan==curDan)
                            return;
                    }
                }
            }
        }
        this._displayVo = displayVo;
        this._cardVo = cardVo;
        this.diplay();
    },

    onEnter:function(){
        this._super();
        if(this._cardVo.hasOwnProperty("m"))
            delete this._cardVo.m;
    },

    initCoord:function(){
        if(this._displayVo.direct==1&&this._displayVo.place==1) {
            this.initX = this.x;
            this.initY = this.y;
        }
    },

    unselected:function(){
        //if ((!XPLPRoomModel.isGuCang() && XPLPRoomModel.isTingSelecting) || (XPLPRoomModel.selfAct.length>0 && XPLPRoomModel.selfAct[7]==1)) {
        //    return;
        //}
        this.x = this.initX;
        this.y = this.initY;
        this.selected = false;
        SyEventManager.dispatchEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS);
    },

    onDisplayTingPaiByGC:function(isTingSelected){
        if(isTingSelected) {
            var sprite = UICtor.cS9Img("res/res_mj/ting_3.png", cc.rect(10, 10, 5, 5), cc.size(90, 130));
            sprite.x = 46.5;
            sprite.y = 66;
            this._bg.addChild(sprite,1,999);
        }
        var mjs = XPLPRoomModel.mineLayout.getMahjongs1();
        for(var i=0;i<mjs.length;i++){
            mjs[i].unselected();
        }
        this.isTing = isTingSelected;
    },

    cancelTingPai: function() {
        if(this._bg.getChildByTag(999)){
            this._bg.removeChildByTag(999);
        }
        this.y = this.initY;
        this.selected = false;
        this.isTing = false;
    },

    csGang:function(){
        if(!this.touchLayer){
            this.touchLayer = UICtor.cS9Img("res/res_mj/mjRoom/img_43.png",cc.rect(10,10,5,5),cc.size(87,127));
            this.touchLayer.anchorX=this.touchLayer.anchorY=0;
            this.touchLayer.x = 1;
            this.touchLayer.y = 4;
            this.addChild(this.touchLayer);
        }
    },

    cancelCsGang:function(){
        if(this.touchLayer){
            this.touchLayer.removeFromParent(true);
            this.touchLayer=null;
        }
    },

    showPengDir:function(seat,isHuifang){
        if(this._displayVo.place != 2)return;

        if(isHuifang){
            var seq = MJReplayModel.getPlayerSeq("",MJReplayModel.mySeat,seat);
            var renshu = MJReplayModel.renshu;
        }else{
            var seq = XPLPRoomModel.getPlayerSeq("",XPLPRoomModel.mySeat,seat);
            var renshu = XPLPRoomModel.renshu;
        }

        var dirArr = [1,2,3,4];
        if(renshu == 3)dirArr = [1,2,4];
        if(renshu == 2)dirArr = [1,3];
        var dir = dirArr[seq - 1];

        var imgNameArr = ["jt_bottom","jt_next","jt_up","jt_last"];

        var curImg = "";
        if(imgNameArr[dir - 1]){
            curImg = "res/res_mj/mjRoom/" + imgNameArr[dir - 1] + ".png";
        }

        this.removeChildByName("pengDirSpr");

        var scale = 1;//this._bg.scale;
        var pos = cc.p(this._bg.width/2*scale,this._bg.height/2*scale);
        if(this._displayVo.direct == 1)pos.y = this._bg.height*scale + 15;
        else if(this._displayVo.direct == 2){
            pos.x = -15;
            pos.y += 10;
        } else if(this._displayVo.direct == 3)pos.y = -10;
        else if(this._displayVo.direct == 4){
            pos.x = this._bg.width*scale + 15;
            pos.y += 10;
        }

        var spr = new cc.Sprite(curImg);
        spr.setPosition(pos);
        spr.setName("pengDirSpr");
        this.addChild(spr,99);
    },

    changeSkin:function(type){
        return;
        var direct = this._displayVo.direct;
        var place = this._displayVo.place;
        var an = this._cardVo.a;
        var isJs = this._cardVo.isJs;//是否是结算界面的展示
        this.isHu = this._cardVo.ishu;//是否是结算界面胡的牌的展示
        var bgPng = "";
        var hdirect = direct;
        var hplace = place;
        var bgFlippedX = false;
        var ziFlippedX = false;
        var mjScale = 1;
        if(place == 1){
            switch (direct) {
                case 1:
                case 3:
                case 2:
                    break;
                case 4:
                    hdirect = 2;
                    break;
            }
        } else if(place == 2) {
            switch (direct) {
                case 1:
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    break;
                case 4:
                    hplace = 3;
                    break;
            }
        } else if(place == 3) {
            switch (direct) {
                case 1:
                    hplace = 2;
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    hplace = 2;
                    break;
                case 4:
                    hplace = 3;
                    break;
            }
        } else if(place == 4) {
            switch (direct) {
                case 1:
                    hplace = 2;
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    hplace = 2;
                    break;
                case 4:
                    hplace = 3;
                    break;
            }
        }
        var hdp = "d"+hdirect+"p"+hplace;

        if (type == 1){
            if(an===1 || (direct==3&&place==1) || (direct==4&&place==1) || (direct==2&&place==1)){
                if(an===1){
                    hdp += "_an";
                }
                bgPng = "lnmjbg_"+hdp+".png";
            }else{
                bgPng = "lnmjbg_"+hdp+".png";
            }
        }else if (type == 3){
            if(an===1 || (direct==3&&place==1) || (direct==4&&place==1) || (direct==2&&place==1)){
                if(an===1){
                    hdp += "_an";
                }
                bgPng = "thjmjbg_"+hdp+".png";
            }else{
                bgPng = "thjmjbg_"+hdp+".png";
            }
        }else {
            if(an===1 || (direct==3&&place==1) || (direct==4&&place==1) || (direct==2&&place==1)){
                if(an===1){
                    hdp += "_an";
                }
                bgPng = "ymjbg_"+hdp+".png";
            }else{
                bgPng = "ymjbg_"+hdp+".png";
            }
        }
        var png = SetUpModel.getMahjongRes(bgPng);
        var frame = cc.spriteFrameCache.getSpriteFrame(png);
        this._bg.setSpriteFrame(frame);
    },

    changeZi:function(type){
        return;
        //先选一个背景
        var direct = this._displayVo.direct;
        var place = this._displayVo.place;
        var an = this._cardVo.a;
        var isJs = this._cardVo.isJs;//是否是结算界面的展示
        this.isHu = this._cardVo.ishu;//是否是结算界面胡的牌的展示
        var zipng = "";
        var hdirect = direct;
        var hplace = place;
        var bgFlippedX = false;
        var ziFlippedX = false;
        var mjScale = 1;
        if(place == 1){
            switch (direct) {
                case 1:
                case 3:
                case 2:
                    break;
                case 4:
                    hdirect = 2;
                    break;
            }
        } else if(place == 2) {
            switch (direct) {
                case 1:
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    break;
                case 4:
                    hplace = 3;
                    break;
            }
        } else if(place == 3) {
            switch (direct) {
                case 1:
                    hplace = 2;
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    hplace = 2;
                    break;
                case 4:
                    hplace = 3;
                    break;
            }
        } else if(place == 4) {
            switch (direct) {
                case 1:
                    hplace = 2;
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    hplace = 2;
                    break;
                case 4:
                    hplace = 3;
                    break;
            }
        }
        var hdp = "d"+hdirect+"p"+hplace;
        if (type == 2){
            if(an===1 || (direct==3&&place==1) || (direct==4&&place==1) || (direct==2&&place==1)){
            }else{
                zipng = "lnmj_"+hdp+"_"+this._cardVo.t+"_"+this._cardVo.n+".png";
            }
        }else if (type == 3){
            if(an===1 || (direct==3&&place==1) || (direct==4&&place==1) || (direct==2&&place==1)){
            }else{
                zipng = "thjmj_"+hdp+"_"+this._cardVo.t+"_"+this._cardVo.n+".png";
            }
        }else {
            if(an===1 || (direct==3&&place==1) || (direct==4&&place==1) || (direct==2&&place==1)){
            }else{
                zipng = "oldmj_"+hdp+"_"+this._cardVo.t+"_"+this._cardVo.n+".png";
            }
        }
        cc.log("HZMJ zipng =",zipng);
        //var png = SetUpModel.getMahjongRes(zipng);
        if(zipng!=""){
            var frame = cc.spriteFrameCache.getSpriteFrame(zipng);
            this._zi.setSpriteFrame(frame);

            if(hdirect == 4 && hplace == 3 && type != 3){
                this._zi.scale = 0.8;
            }else if(hdirect == 1 && hplace == 2 && type == 3){
                this._zi.scale = 1.3;
            }else if(hdirect == 1 && hplace == 1 && type == 3){
                this._zi.scale = 1.35;
            }else if(hdirect == 1 && hplace == 1 && type == 2){
                this._zi.scale = 1.2;
            }else{
                this._zi.scale = 1;
            }
        }
    },
    isForSelect:function(){
        return (this._cardVo.se && this._cardVo.se>0);
    },

    onChuMahjong:function(){
        XPLPRoomModel.chuMahjong(this._cardVo.c);
    },

    onTingMahjong: function() {
        var tingResult = XPLPRoomModel.getTingWithMahjong(this._cardVo);
        var tingIds = [];
        for (var i=0;i<tingResult.length;i++) {
            tingIds.push(tingResult[i].c);
        }
        var tingParam = [this._cardVo.c];
        ArrayUtil.merge(tingIds, tingParam);
        XPLPRoomModel.sendPlayCardMsg(21,tingParam);
    },

    onTouchHandler:function(obj,type){
        if(this.isForSelect()){
            if(type == ccui.Widget.TOUCH_ENDED)
                SyEventManager.dispatchEvent(SyEvent.SELECT_MAJIANG,{action:this._cardVo.se,ids:this._cardVo.ids});
            return false;
        }
        if (/*XPLPRoomModel.isTingSelecting && !*/this.isTing) {//点了听之后，选牌的状态
            return false;
        }
        if(XPLPRoomModel.nextSeat!=XPLPRoomModel.mySeat || (XPLPRoomModel.selfAct.length>0 && XPLPRoomModel.selfAct[7] != 1))
            return false;
        if(XPLPRoomModel.isTing() || XPLPRoomModel.isHued())//长沙麻将杠了不能换牌
            return false;
        if(!XPLPRoomModel.mineLayout){
            return false;
        }

        var mjs = XPLPRoomModel.mineLayout.getMahjongs1();

        if(mjs && mjs.length%3==2 && XPLPRoomModel.intParams[4] == 1 && XPLPRoomModel.isCloseHandCard == true){//闲家有箍臭
            return false;
        }

        if(mjs && mjs.length%3!=2){//过滤掉多出牌的问题
            return false;
        }
        //cc.log("this._cardVo",JSON.stringify(this._cardVo));
        //if (this._cardVo && this._cardVo.i == 201){
        //    return false;
        //}
        var self = this;
        if(type == ccui.Widget.TOUCH_BEGAN){
            if(!this.selected){
                this.maxY = this.y;
                for(var i=0;i<mjs.length;i++){
                    mjs[i].unselected();
                }
                if (this.y == this.initY) {
                    this.y += 30;
                }
                if(XPLPRoomModel.isTingSelecting){
                    SyEventManager.dispatchEvent(SyEvent.FIND_HU_BY_PUTOUT,this._cardVo);
                }
                if(this._tingList){
                    SyEventManager.dispatchEvent(SyEvent.SHOW_TING_CARDS,{huCards:this._tingList,isShow:true});
                }else{
                    SyEventManager.dispatchEvent(SyEvent.HIDE_HU_CARDS);
                }
                SyEventManager.dispatchEvent(SyEvent.SHOW_DESKTTOP_CARDS,this._cardVo);
                this.selected = true;
            }else{//第二次点击，直接出牌
                SyEventManager.dispatchEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS);
                if(XPLPRoomModel.isTingSelecting){
                    this.onTingMahjong();
                }else{
                    //if(this._cardVo && this._cardVo.i == 201){
                    //    AlertPop.show("万能牌，确定要出吗？",function(){
                    //        self.onChuMahjong();
                    //    },function(){
                    //        self.selected = false;
                    //        self.x = self.initX;
                    //        self.y = self.initY;
                    //    });
                    //}else{
                        this.onChuMahjong();
                    //}
                    //XPLPRoomModel.sendPlayCardMsg(0,[this._cardVo.c]);
                }
            }
            this.mjTouchMoved = false;
        }else if(type == ccui.Widget.TOUCH_MOVED){
            //var touchPoint = this.getTouchMovePosition();
            //var targetX = touchPoint.x-this.width/2 - (cc.winSize.width-SyConfig.DESIGN_WIDTH)/2;
            //var targetY = touchPoint.y-this.height/2;
            //if(this.mjTouchMoved || Math.abs(targetX-this.initX)>=40 || (targetY-this.initY)>=40){
            //    this.mjTouchMoved = true;
            //    this.x = targetX;
            //    this.y = targetY;
            //}
            //if(this.y>this.maxY)
            //    this.maxY = this.y;
            this.isTouchMove = true;
            var touchPoint = this.getTouchMovePosition();
            touchPoint.x = Math.min(touchPoint.x,cc.winSize.width - 60);
            touchPoint.x = Math.max(touchPoint.x,50);

            touchPoint.y = Math.min(touchPoint.y,cc.winSize.height - 130);
            touchPoint.y = Math.max(touchPoint.y,130);

            touchPoint = this.getParent().convertToNodeSpace(touchPoint);
            var targetX = touchPoint.x-this.width/2 ;
            var targetY = touchPoint.y-this.height/2;

            if(this.mjTouchMoved || Math.abs(targetX-this.initX)>=60 || (targetY-this.initY)>=60){
                this.mjTouchMoved = true;
                this.x = targetX;
                this.y = targetY;
            }
        }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
            if(this.selected&&Math.abs(this.x-this.initX)<45&&Math.abs(this.maxY-this.initY)<45){
                if(this.mjTouchMoved){
                    this.mjTouchMoved = false;
                    this.selected = false;
                    this.x = this.initX;
                    this.y = this.initY;
                }
                return;
            }
            this.mjTouchMoved = false;
            if(Math.abs(this.x-this.initX) >=45 || Math.abs(this.y-this.initY)>=45){
                if(this.y<=100){
                    this.selected = false;
                    this.x = this.initX;
                    this.y = this.initY;
                }else{//拖出去了松开，直接出牌
                    SyEventManager.dispatchEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS);
                    if(XPLPRoomModel.isTingSelecting){
                        this.onTingMahjong();
                    }else{
                        //if(this._cardVo && this._cardVo.i == 201){
                        //    AlertPop.show("万能牌，确定要出吗？",function(){
                        //        self.onChuMahjong();
                        //    },function(){
                        //        self.selected = false;
                        //        self.x = self.initX;
                        //        self.y = self.initY;
                        //    });
                        //}else{
                            this.onChuMahjong();
                        //}
                    }
                }
            }else{
                this.selected = false;
                this.x = this.initX;
                this.y = this.initY;
            }
        }
    },

    updateCardColor:function(){
        if(XPLPRoomModel.isCloseHandCard == true){
            this._bg.setColor(cc.color(200,200,200));//置灰
        }else{
            this._bg.setColor(cc.color(255,255,255));
        }
    },

    diplay:function(){
        this.removeAllChildren(true);
        this.touchLayer=null;
        //先选一个背景
        if(this._cardVo.c<=0)//偎、提等显示背景
            this._cardVo.a=1;
        var direct = this._displayVo.direct;
        var place = this._displayVo.place;
        var png = "";
        var bgPng = "xplp_"+this._cardVo.t+this._cardVo.n+".png";
         //cc.log("hzmj bgPng =",bgPng);
        this.anchorX=this.anchorY=0;
        //根据设置的值，获取对应的资源
        this._bgPng = bgPng;
        //bgPng = SetUpModel.getMahjongRes(bgPng);
        var bg = this._bg = this.getSprite(bgPng);
        //if(direct==1&&place==1&&!isJs)
        //    bg.scale=1.16;
        if(direct==4&&place==1)
            bg.setFlippedX(true);
        bg.anchorX=bg.anchorY=0;
        bg.x = 0;
        bg.y = 0;
        this.addChild(bg);
        this.setContentSize(bg.width,bg.height);

        //听牌的展示
        if (this._cardVo.tingDisplay == 1) {
            this.displayTing(bg);
        }
        ////place4有绿色遮罩
        //if (this._cardVo.huDisplay == 1) {
        //    this.displayHu();
        //}
        if(direct==1&&place==1 || this.isForSelect()){
            if(!this.isTouchEnabled()){
                this.setTouchEnabled(true);
                this.addTouchEventListener(this.onTouchHandler,this);
            }
        }else{
            this.setTouchEnabled(false);
        }

    },

    displayGreyBg:function(){
        if(!this._bg.getChildByTag(1001)) {
            var png = "res/res_mj/mjRoom/mjRoom_37.png";
            var initX = 0;
            var initY = 0;
            var scale = 1;
            if (this._displayVo.direct == 4 || this._displayVo.direct == 2) {
                png = "res/res_mj/mjRoom/mjRoom_38.png";
                initX = 4;
                initY = 1;
                scale = 1.71;
            }
            var bg = new cc.Sprite(png);
            if (this._displayVo.direct == 3 || this._displayVo.direct == 1) {
                initX = 2;
                initY = 0;
                scale = 2.15;
            }
            bg.setScale(scale);
            bg.setPosition(this._bg.width / 2 + initX, this._bg.height / 2 + initY);
            this._bg.addChild(bg, 1, 1001);
        }
    },

    //显示我可以出哪些牌可听
    displayTingArrows:function(tingList,huCardNum){
        if(!this._bg.getChildByTag(1008)) {
            if (this._displayVo.direct == 1) {
                var png = "res/res_mj/mjRoom/img_ting4.png";
                var arrowsImg = new cc.Sprite(png);
                var initX = 0;
                var initY = 8;
                arrowsImg.setPosition(this._bg.width / 2 + initX, this._bg.height + initY);
                this._bg.addChild(arrowsImg, 1, 1008);

                var size = arrowsImg.getContentSize();
                var numLabel = new cc.LabelTTF(huCardNum, "Arial", 36);
                numLabel.y = size.height*0.61;
                numLabel.x = size.width*0.45;
                numLabel.setColor(cc.color(87,2,3));
                arrowsImg.addChild(numLabel);

                this._tingList = tingList || [];
                //this._huCardNum = huCardNum || 0;
            }
        }
    },

    //显示我可以出哪些牌可听
    removeTingArrows:function(){
        if(this._bg.getChildByTag(1008)) {
            this._bg.removeChildByTag(1008);
        }
        this._tingList = [];
        //this._huCardNum = 0;
    },

    removeGreyBg:function(){
        if(this._bg.getChildByTag(1001)){
            this._bg.removeChildByTag(1001);
        }
    },

    displayGCFuOrFeiPai: function(direct, place, tex, bg) {
        if(direct==1 && place==1) {
            var fei = this.getSprite(tex);
            fei.anchorX = fei.anchorY = 0;
            if(this.isHu == 1){
                fei.scale = 0.4;
                fei.x = -1;
                fei.y = fei.height - 10;
            }else {
                fei.x = -1;
                fei.y = bg.height - fei.height - 17;
            }
            this.addChild(fei);
        }
    },


    displayHu: function() {
        var sprite = UICtor.cS9Img("res/res_mj/mjRoom/mjRoom_29.png",cc.rect(5,5,5,5),cc.size(this._bg.width, this._bg.height));
        sprite.x = this._bg.width/2;
        sprite.y = this._bg.height/2;
        this._bg.addChild(sprite);
    },

    /***
     *  资源有缺少
     * @param bg
     */
    displayTing: function(bg) {
        this.tingpaiSprite = new cc.Sprite("res/res_mj/ting_2.png");
        this.tingpaiSprite.setScale(1.2);
        this.tingpaiSprite.x = 62;
        this.tingpaiSprite.y = 102;
        bg.addChild(this.tingpaiSprite);
        this.tingpaiLab = UICtor.cLabel("0",20,cc.size(220,45),cc.color(255,248,238),1,1);
        this.tingpaiLab.x = this.tingpaiLab.y = 12;
        this.tingpaiSprite.addChild(this.tingpaiLab);
        this.shadeSprite = UICtor.cS9Img("res/res_mj/ting_3.png",cc.rect(10,10,5,5),cc.size(73,107));
        this.shadeSprite.x = 37;
        this.shadeSprite.y = 54;
        bg.addChild(this.shadeSprite);
        this.tingpaiSprite.visible = false;
        this.shadeSprite.visible = false;
    },

    displayJianTou: function(direct, bg, scale) {
        var bgw = bg.width*scale;
        var bgh = bg.height*scale;
        var realpath = "res/res_mj/mjRoom/"+this._cardVo.jt;
        if(!jsb.fileUtils.isFileExist(realpath)){
            //cc.log("realpath is not exist...");
            return;
        }
        var sprite = new cc.Sprite(realpath);
        sprite.scale = 0.8;
        var sw = sprite.width*sprite.scale;
        var sh = sprite.height*sprite.scale;
        if (direct == 1) {
            sprite.x = bgw/2;
            sprite.y = bgh+sh/2;
        } else if (direct == 3) {
            sprite.x = bgw/2;
            sprite.y = 3;
        } else if (direct == 2) {
            sprite.x = -sw/2;
            sprite.y = bgh/2+4;
        } else if (direct == 4) {
            sprite.x = bgw+sw/2;
            sprite.y = bgh/2+4;
        }
        this.addChild(sprite);
    },

    displayFuOrFeiPai: function(direct, place, bg) {
        if(direct==1&&place==1) {
            var sprite = UICtor.cS9Img("res/res_mj/ting_3.png",cc.rect(10,10,5,5),cc.size(90,130));
            sprite.x = 46.5;
            sprite.y = 66;
            bg.addChild(sprite);
        }
    },

    gang:function(){
        //var gang = new cc.Sprite("res/res_mj/img_50.png");
        //this._bg.addChild(gang);
    },

    /**
     * 获取数据模型
     * @returns {CardVo}
     */
    getData:function(){
        return this._cardVo;
    },

    chuPai:function(){
        //this._bg.runAction(cc.fadeTo(0.5,0));
        //this._huase.runAction(cc.fadeTo(1,0));
    },

    xiaoHu:function(){
        var self = this;
        this._bg.runAction(cc.sequence(cc.delayTime(8),cc.fadeTo(1.5,0),cc.delayTime(0.2),cc.callFunc(function(){
            self.removeFromParent(true);
        })));
        //this._huase.runAction(cc.sequence(cc.delayTime(8),cc.fadeTo(1.5,0)));
    }
});
