/**
 * Created by zhoufan on 2016/11/7.
 */
var HBGZPCard = ccui.Widget.extend({
    /** @lends Card.prototype */
    _cardVo:null,
    _displayVo:null,
    _bg:null,
    maxY:590,
    minY:-18,
    maxX:1188 + (cc.winSize.width-1280)/2,
    minX:16,
    //numberImg:null,
    isRecord:false,
    hasTouchBegin:false,
    /**
     * @construct
     * @param displayVo {MJDisplayVo}
     * @param cardVo {PHZVo}
     */
    ctor:function(displayVo,cardVo,action,isRecord){
        this._super();        
        this.touchLayer=null;
        this.selected = false;
        this.mjTouchMoved = false;
        this.isTouchMove = false;
        this.isRecord = isRecord || false;//是不是回放

        this._tingList = [];
        
        this.refresh(displayVo,cardVo,action);

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
            //cc.log("PHZ texture::"+texture+" is not exist!!!");
        }
        return new cc.Sprite("res/res_phz/res_hbgzp/cards/"+texture);
    },

    /**
     * @param displayVo {MJDisplayVo}
     * @param cardVo {PHZVo}
     */
    refresh:function(displayVo,cardVo,action){
        this._displayVo = displayVo;
        this._cardVo = cardVo;
        this.display(action);
    },


    refreshCardByOpenTex:function() {
        this.refreshCardBgByOpenTex();
    },

    refreshCardBgByOpenTex:function() {
        if (this._bg){
            var bgPng = this.getPaiPngurl(this._cardVo);
            var frame = cc.spriteFrameCache.getSpriteFrame(bgPng);
            this._bg.setSpriteFrame(frame);
        }
    },

    initCoord:function(){
        if(this._displayVo.direct==1&&this._displayVo.place==1) {
            this.initX = this.x;
            this.initY = this.y;
            this.initZorder = this.getLocalZOrder();
        }
    },

    /**
     * 记录当前这张卡牌在第几列
     */
    setCardIndex:function(value){
        this.cardIndex = value;
    },

    getCardIndex:function(){
        return this.cardIndex;
    },


    unselected:function(){
        this.x = this.initX;
        this.y = this.initY;
        this.selected = false;
    },

    csGang:function(){
        if(!this.touchLayer){
            this.touchLayer = UICtor.cS9Img("res/res_phz/img_43.png",cc.rect(10,10,5,5),cc.size(87,127));
            this.touchLayer.anchorX=this.touchLayer.anchorY=0;
            this.addChild(this.touchLayer);
        }
    },

    displayTingArrows:function(tingList){
        // cc.log("tingList =",JSON.stringify(tingList));
        this._tingList = tingList || [];
        this.showTingImg(this._tingList.length > 0);
    },

    setGrayColor:function(){
        cc.log("setGrayColor ====================>");
        this._bg.setColor(cc.color(175,175,175));
        this._cardVo.dabian = 1;
        this.setTouchEnabled(false);
        if (this._bg.getChildByName("tingImg")){
            this.tingImg.visible = false;
        }
    },

    setGrayCanMove:function(){
        this._bg.setColor(cc.color(175,175,175));
        this._cardVo.grayNoChu = 1;
    },

    setNormalColor:function(){
        this._cardVo.dabian = 0;
        this._bg.setColor(cc.color(255,255,255));
        this.setTouchEnabled(true);
    },

    graySmallCard:function(){
        this._bg.setColor(cc.color(175,175,175));
    },

    onTouchHandler:function(obj,type){
        var isMyTurn = HBGZPRoomModel.nextSeat==HBGZPRoomModel.mySeat;
        if(type == ccui.Widget.TOUCH_BEGAN){
            if(this._bg.getChildByTag(234))
                this._bg.removeChildByTag(234);
            this.createBigCard();

            if(isMyTurn && ((HBGZPRoomModel.selfAct.length==0) || (HBGZPRoomModel.selfAct.length > 0 && HBGZPRoomModel.selfAct[3] == 1))){//如果有观也可以直接出牌
                if (HBGZPRoomModel.getTouchCard().v != this._cardVo.v || (HBGZPRoomModel.getTouchCard().v == this._cardVo.v && HBGZPRoomModel.getTouchCard().hua != this._cardVo.hua)){
                    HBGZPRoomModel.setTouchCard(this._cardVo);
                    SyEventManager.dispatchEvent(SyEvent.PHZ_CLEAN_TING);
                    //SyEventManager.dispatchEvent(SyEvent.PHZ_DEAL_CARD,this._cardVo);
                    SyEventManager.dispatchEvent(SyEvent.SHOW_TING,[this._tingList]);
                }else{
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KQTP,1);
                }
            }
            this.hasTouchBegin = true;
            this.setLocalZOrder(999);   
            this.fromIndex = this.getCardIndex();
            this.mjTouchMoved = false;
            this.isTouchMove = false;
        }else if(type == ccui.Widget.TOUCH_MOVED){
            if(!this.hasTouchBegin){
                return;
            }
            this.isTouchMove = true;
            var touchPoint = this.getTouchMovePosition();

            touchPoint.x = Math.min(touchPoint.x,cc.winSize.width - 60);
            touchPoint.x = Math.max(touchPoint.x,50);

            touchPoint.y = Math.min(touchPoint.y,cc.winSize.height - 130);
            touchPoint.y = Math.max(touchPoint.y,50);

            touchPoint = this.getParent().convertToNodeSpace(touchPoint);
            var targetX = touchPoint.x-this.width/2 ;
            var targetY = touchPoint.y-this.height/2;

            if(this.mjTouchMoved || Math.abs(targetX-this.initX)>=40 || (targetY-this.initY)>=40){
                this.mjTouchMoved = true;
                this.x = targetX;
                this.y = targetY;
            }
        }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
            if(!this.hasTouchBegin){
                return;
            }
            this.hasTouchBegin = false;
            if(this._bg.getChildByTag(234))
                this._bg.removeChildByTag(234);

            var localIndex = this.getCardIndex();//当前第几列 1 ~ 9
            var changeIndex = Math.floor((this.x-this.initX + this._bg.width/2) / 150) + localIndex;

            if(this.selected&&Math.abs(this.x-this.initX + this._bg.width/2)<150&&Math.abs(this.maxY-this.initY)<55*1.5){
                if(this.mjTouchMoved){
                    this.mjTouchMoved = false;
                    this.selected = false;
                }
                HBGZPMineLayout.updateCard();
                return;
            }
            this.mjTouchMoved = false;
            if(this.y>=HBGZPSetModel.cardTouchend){//拖出去了松开，并且超过出牌线，直接出牌
                if(isMyTurn && HBGZPRoomModel.selfAct.length==0 || (HBGZPRoomModel.selfAct.length > 0 && HBGZPRoomModel.selfAct[3] == 1)){//如果有观也可以直接出牌
                    HBGZPRoomModel.outCardsX = this.x;
                    HBGZPRoomModel.outCardsY = this.y;
                    HBGZPRoomModel.isSelfOutCard = true;
                    this.onChuMahjong();
                }else{
                    this.setLocalZOrder(this.initZorder);
                }
            }else{//插牌处理
                if(changeIndex < 1 || changeIndex > 9){//第几列
                    if(this.mjTouchMoved){
                        this.mjTouchMoved = false;
                        this.selected = false;
                    }
                    HBGZPMineLayout.updateCard();
                    return;
                }
                this.mjTouchMoved = false;
                this.selected = false;
                if(HBGZPMineLayout.curSortedData[changeIndex - 1] && HBGZPMineLayout.curSortedData[changeIndex - 1].length < 6){//最多五张
                    if(localIndex !== changeIndex){
                        HBGZPMineLayout.insertCard(this._cardVo,localIndex,changeIndex);
                    }
                }
            }
            HBGZPMineLayout.updateCard();
        }
    },

    onChuMahjong:function(){
        if(HBGZPRoomModel.localJianVo && HBGZPRoomModel.localJianVo.n === this._cardVo.n){
            FloatLabelUtil.comText("捡牌后本轮不能打捡的牌和相同的牌！");
            return;
        }
        var id = this._cardVo.c;
        if(HBGZPRoomModel.JianArray.length > 0){
            for(var i = 0;i < HBGZPRoomModel.JianArray.length;++i){
                if(HBGZPAI.getPHZDef(HBGZPRoomModel.JianArray[i]).n == this._cardVo.n){
                    id = HBGZPRoomModel.JianArray[i];
                    break;
                }
            }
        }
        HBGZPRoomModel.chuMahjong(id);
    },

    display:function(action){
        this.removeAllChildren(true);
        this.touchLayer=null;
        //先选一个背景
        if(this._cardVo.c<=0)//偎、提等显示背景
            this._cardVo.a=1;
        var direct = this._displayVo.direct;
        var place = this._displayVo.place;
        var an = this._cardVo.a;
        var same = this._cardVo.same;

        var png = "";
        var paiType = 2;//HBGZPSetModel.zpxz == 2 ? 1 : 2;
        var scale = 1;//1.1;
        //if(HBGZPSetModel.zpxz == 2){
        //    if(HBGZPSetModel.zpdx == 1){
        //        scale = 1;
        //    }else if(HBGZPSetModel.zpdx == 2){
        //        scale = 1.05;
        //    }
        //}else{
        //    if(HBGZPSetModel.zpdx == 1){
        //        scale = 0.8;
        //    }else if(HBGZPSetModel.zpdx == 2){
        //        scale = 0.9;
        //    }else{
        //        scale = 1;
        //    }
        //}
        //var scaleX = 1;
        if(an==1){
            png = "hbgzp_card.png";
        }else{
            png = "hbgzp_card"+paiType+"_"+this._cardVo.n + ".png";
            if(this._cardVo.hua == 1){
                png = "hbgzp_card"+paiType+"_"+this._cardVo.n + "_1.png";
            }
        }
        this.anchorX=this.anchorY=0;

        var bgImg = this._bg = this.getSprite(png);
        bgImg.anchorX=bgImg.anchorY=0;
        bgImg.setScaleX(scale); //= 1.2;
        //if (scaleX == 1.1){
        //    bgImg.setScaleX(scaleX);
        //}
        bgImg.x = 0;
        bgImg.y = 0;
        this.addChild(bgImg);

        if(this._cardVo.zhe==1){//吃的当前这张牌
            bgImg.setColor(cc.color(175,175,175));
        }

        if (this._cardVo.dabian){
            bgImg.setColor(cc.color(175,175,175));
        }

        this.setContentSize(this._bg.width,this._bg.height);
        if(!same && !an && (direct==1&&place==1 || this._cardVo.se===1 || this._cardVo.se===2)){
            if(!this.isTouchEnabled()){
                this.setTouchEnabled(true);
                this.addTouchEventListener(this.onTouchHandler,this);
            }
        }else{
            this.setTouchEnabled(false);
        }
        if (this.isRecord){
            this.setTouchEnabled(false);
        }

        if(this._cardVo.isJian == 1){
            var tingImg = new cc.Sprite("res/res_phz/res_hbgzp/jianTip.png");
            tingImg.setAnchorPoint(0,1);
            tingImg.x = 5;
            tingImg.y = bgImg.height - 5;
            bgImg.addChild(tingImg);
        }

        var tingImg  = this.tingImg = new cc.Sprite("res/res_phz/ting.png");
        tingImg.x = bgImg.width*0.185;
        tingImg.y = bgImg.height*0.85;
        tingImg.setName("tingImg");
        bgImg.addChild(tingImg);
        tingImg.visible = false;
        if(this.isTouchEnabled()){
            var bool = false;
            if ((this._cardVo.isTing || this._tingList.length > 0) && this.isTouchEnabled()){
                bool = true;
            }
            this.showTingImg(bool);
        }
    },

    /**
     * 获取数据模型
     * @returns {CardVo}
     */
    getData:function(){
        return this._cardVo;
    },

    chuPai:function(){
        this._bg.runAction(cc.fadeTo(1,0));
    },

    showTingImg:function(_bool){
        if (this._bg.getChildByName("tingImg") && this.isTouchEnabled()){
            this.tingImg.visible = _bool;
            if (!_bool) this._tingList = [];
        }
    },

    createBigCard:function(){
        var paiType = 3;//HBGZPSetModel.zpxz == 2 ? 2 : 3;
        var png = "res/res_phz/res_hbgzp/cards/normal_card_" + paiType + "_" + this._cardVo.n + ".png";
        if(this._cardVo.hua == 1){
            png = "res/res_phz/res_hbgzp/cards/normal_card_"+ paiType + "_" + this._cardVo.n + "_1.png";
        }
        var kuang = new cc.Sprite(png);
        kuang.anchorX=kuang.anchorY=0;
        this._bg.addChild(kuang,6,234);
    },
    getPaiPngurl:function(phzVo){
        var paiType = 2;//HBGZPSetModel.zpxz == 2 ? 1 : 2;
        var png = "res/res_phz/res_hbgzp/cards/hbgzp_card_"+paiType+"_"+this._cardVo.n + ".png";
        if(phzVo.hua == 1){
            png = "res/res_phz/res_hbgzp/cards/hbgzp_card_"+paiType+"_"+this._cardVo.n + "_1.png";
        }
        return png;
    }
});