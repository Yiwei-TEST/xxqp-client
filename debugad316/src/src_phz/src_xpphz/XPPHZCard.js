 /**
 * Created by zhoufan on 2016/11/7.
 */
var XPPHZCard = ccui.Widget.extend({
    /** @lends Card.prototype */
    _cardVo:null,
    _displayVo:null,
    _bg:null,
    maxY:885,
    minY:-18,
    maxX:1820,
    minX:16,
    numberImg:null,
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
            cc.log("PHZ texture::"+texture+" is not exist!!!");
        }
        return new cc.Sprite("#"+texture);
    },

    /**
     * @param displayVo {MJDisplayVo}
     * @param cardVo {PHZVo}
     */
    refresh:function(displayVo,cardVo,action){
        this._displayVo = displayVo;
        this._cardVo = cardVo;
        this.diplay(action);
    },


    refreshCardByOpenTex:function() {
        if (this.numberImg){
            this.diplay();
        }
    },

    refreshCardBgByOpenTex:function() {
        if (this._bg && this.numberImg){
            var place = this._displayVo.place;
            var an = this._cardVo.a;
            var bgPng = "";
            if (place == 1){
                bgPng = "big_cards_fk_1b.png";
            }else{
                bgPng = "small_cards_fk_1b.png";
            }
                
            if (this._cardVo.ishu){ //当前胡的这张牌
                bgPng = "xpphz_card_hu.png";
            }
            this._bg.setSpriteFrame(bgPng);
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
        this.showTingImg(true);
        this._tingList = tingList || [];
        this._tingList.sort(function(a,b){
            var t1 = a>40?1:0;var t2 = b>40?1:0;
            var n1 = a>80?11:a%10;var n2 = b>80?11:b%10;
            if(n1 == 0)n1 = 10;if(n2 == 0)n2 = 10;
            return (t1*100+n1) - (t2*100+n2);
        });
    },

    setGrayColor:function(){
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
        var isMyTurn = PHZRoomModel.nextSeat==PHZRoomModel.mySeat;
        if(type == ccui.Widget.TOUCH_BEGAN){
            if(this._bg.getChildByTag(234))
                this._bg.removeChildByTag(234);
            // this.createBigCard();
            if(isMyTurn && PHZRoomModel.selfAct.length==0){
                if (PHZRoomModel.getTouchCard() != this._cardVo.v){
                    PHZRoomModel.setTouchCard(this._cardVo.v);
                    SyEventManager.dispatchEvent(SyEvent.PHZ_CLEAN_TING);
                    SyEventManager.dispatchEvent(SyEvent.PHZ_DEAL_CARD,this._cardVo);
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

            touchPoint.y = Math.min(touchPoint.y,cc.winSize.height - 80);
            touchPoint.y = Math.max(touchPoint.y,80);

            touchPoint = this.getParent().convertToNodeSpace(touchPoint);
            var targetX = touchPoint.x-this.width/2 ;
            var targetY = touchPoint.y-this.height/2;

            if(this.mjTouchMoved || Math.abs(targetX-this.initX)>=25 || Math.abs(targetY-this.initY)>=25){
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
            //this._bg.setScale(1.0);
            //PHZRoomModel.mineRoot.Image_hdx.visible=PHZRoomModel.mineRoot.fingerArmature.visible=false;
            if(this.selected&&Math.abs(this.x-this.initX)<45&&Math.abs(this.maxY-this.initY)<45){
                if(this.mjTouchMoved){
                    this.mjTouchMoved = false;
                    this.selected = false;
                    //this.x = this.initX;
                    //this.y = this.initY;
                }
                PHZMineLayout.reSetCardPos();
                if(isMyTurn && PHZRoomModel.selfAct.length==0) {
                    SyEventManager.dispatchEvent(SyEvent.PHZ_HIDE_TING);
                }
                return;
            }
            this.mjTouchMoved = false;
            if(this.y>=PHZSetModel.cardTouchend){//拖出去了松开，并且超过出牌线，直接出牌
                if(isMyTurn && PHZRoomModel.selfAct.length==0 && !this._cardVo.grayNoChu){//落地扫王牌不能出
                    // this.setNormalColor();
                    PHZRoomModel.outCardsX = this.x;
                    PHZRoomModel.outCardsY = this.y;
                    PHZRoomModel.isSelfOutCard = true;
                    PHZRoomModel.simulateLetOutCard(this._cardVo.c,JSON.stringify(PHZMineLayout.curSortedData));
                }else{
                    this.setLocalZOrder(this.initZorder);
                }
                PHZMineLayout.reSetCardPos();
            }else{//插牌处理
                if(isMyTurn && PHZRoomModel.selfAct.length==0) {
                    SyEventManager.dispatchEvent(SyEvent.PHZ_HIDE_TING);
                }
                this.selected = false;
                var isArrived = false;
                var isInsert = false;
                for(var i=0;i<PHZMineLayout.coords.length;i++){
                    var coord = PHZMineLayout.coords[i];
                    var tCardListLength = PHZMineLayout.curSortedData[i].length;
                    // cc.log("this.x...  ",this.x);
                    // cc.log("coord.x...  ",coord.x);
                    if(Math.abs(this.x-coord.x)<67 && Math.abs(this.y-coord.y)<241){
                        var isSameLine = (i == this.fromIndex);
                        //cc.log("根据高度 计算卡牌插入的位置: " , Math.ceil((this.y + this.height * this.scale * 0.5) / 86));
                        var insertIndexY = Math.ceil((this.y + this.height * this.scale * 0.18) / 76);
                        //重写插入方法
                        //同列操作可互相换位
                        //不同列操作插入到最顶上的位置
                        //cc.log("insertIndexY...  ",insertIndexY);
                        if(!isSameLine){
                            if(tCardListLength >= 4){
                                //cc.log("计划插入的地方超过四行 取消插入...");
                                isArrived = false;
                                break;
                            }
                            //cc.log("this.isTouchMove..  ",this.isTouchMove);
                            if (!this.isTouchMove){
                                isInsert = true;
                            }
                            insertIndexY = 0;//0表示插入到列的最上面(数组的末尾)
                        }else{
                            if(tCardListLength > 4){
                                //cc.log("同一列的操作 计划插入的地方超过四行了 取消插入...");
                                isArrived = false;
                                break;
                            }
                        }
                        // cc.log("isSameLine..  ",isSameLine,i,this.fromIndex,insertIndexY);
                        if(Math.abs(this.x-coord.x)<67 && Math.abs(this.y-coord.y)<241){
                            if(PHZMineLayout.curSortedData[i].length<=4){
                                this.setLocalZOrder(2 - insertIndexY );
                                PHZMineLayout.reSortAndDisplay(this._cardVo,i,isInsert,insertIndexY);
                                isArrived = true;
                            }
                            break;
                        }
                    }
                }
                if(!isArrived){
                    if(this.x>PHZMineLayout.coords[PHZMineLayout.coords.length-1].x+66 && PHZMineLayout.curSortedData.length<10){
                        PHZMineLayout.reSortAndDisplay(this._cardVo,-1,false);
                    }else if(this.x<PHZMineLayout.coords[0].x-66 && PHZMineLayout.curSortedData.length<10){
                        PHZMineLayout.reSortAndDisplay(this._cardVo,-2,false);
                    }
                }
            }
            PHZMineLayout.reSetCardPos();
        }
    },

    diplay:function(action){
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
        var bgPng = "";
        // var paiType = PHZSetModel.zpxz == 3 ? 3 : 1;
        var pmType = null;
        if(this._cardVo.c <= 40){//小一到小十
            if(this._cardVo.c <= 20){
                pmType = "ht";//黑桃花色
            }else{
                pmType = "mh";//梅花花色
            }
        }else{//大一到大十
            if(this._cardVo.c <= 60){
                pmType = "hx";//红心花色
            }else{
                pmType = "fk";//方块花色
            }
        }
        if(an==1){
            bgPng = "xpphz_small_half_back.png";
        }else{
            var t = this._cardVo.t == 1 ? "s" : "b";
            if (place == 1){
                bgPng = "big_cards_fk_1b.png";
            }else{
                bgPng = "small_cards_fk_1b.png";
                // bgPng = "xpphz_card_hu.png"
            }
            if(place == 1){
                png = "big_cards_" + pmType + "_" + this._cardVo.n + t + ".png";
            }else {
                png = "small_cards_" + pmType + "_" + this._cardVo.n + t + ".png";
            }
        }

        if (this._cardVo.ishu){ //当前胡的这张牌
            bgPng = "xpphz_card_hu.png"
        }

        this.anchorX=this.anchorY=0;

        var bgImg =  this._bg = this.getSprite(bgPng);
        bgImg.anchorX=bgImg.anchorY=0;
        bgImg.x = 0;
        bgImg.y = 0;
        this.addChild(bgImg);


        if (png != ""){
            var bg = this.numberImg = this.getSprite(png);
            bg.anchorX=bg.anchorY=0.5;
            bg.x = this._bg.width*0.5;
            bg.y = this._bg.height*0.5;
            bgImg.addChild(bg);
        }

        if (this._cardVo.n == 1){
            // cc.log("this._cardVo =",JSON.stringify(this._cardVo));
        }
        if(this._cardVo.as==1 || an == 1){//自己偎了的牌加一层透明层
            bgImg.setColor(cc.color(175,175,175));
        }
        if(this._cardVo.zhe==1){//吃的当前这张牌
            bgImg.setColor(cc.color(175,175,175));
        }

        if(same==1&&direct==1&&place==1){//大于等于3个一样的 加一层遮罩
            this.numberImg.setColor(cc.color(175,175,175));
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

        var tingImg  = this.tingImg = new cc.Sprite("res/res_phz/xpphz/ting.png");
        tingImg.x = bgImg.width*0.173;
        tingImg.y = bgImg.height*0.86;
        tingImg.setName("tingImg");
        bgImg.addChild(tingImg);
        tingImg.visible = false;
        if(this.isTouchEnabled()){
            var bool = false;
            if (this._cardVo.isTing && this.isTouchEnabled()){
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
        var pmType = PHZSetModel.pmxz;
        var kuangText = "#cards_face_"+pmType+".png";
        var per = 0.2;
        var kuang = new cc.Sprite(kuangText);
        kuang.scale = 1.45;
        kuang.x = this._bg.width*0.5;
        kuang.y = this._bg.height*0.5;
        this._bg.addChild(kuang,6,234);
        if (PHZRoomModel.sxSeat == PHZRoomModel.mySeat){
            kuang.setColor(cc.color(175,175,175));
        }
        var png = "xpphz_cards_back.png";
        if(this._cardVo.c>0){
            png = this.getPaiPngurl(this._cardVo);
            var bg1 = this.getSprite(png);
            bg1.x = kuang.width/2;
            bg1.y = kuang.height*per;
            bg1.setFlippedY(-180);
            bg1.setFlippedX(-180);
            bg1.scale = 0.8;
            kuang.addChild(bg1);

            var bg = this.getSprite(png);
            bg.x = kuang.width/2;
            bg.y = kuang.height*(1-per);
            bg.scale = 0.8;
            kuang.addChild(bg);
        }
    },
    getPaiPngurl:function(phzVo){
        var t = phzVo.t==1 ? "s" : "b";
        var paiType = PHZSetModel.zpxz == 3 ? 3 : 1;
        var png = "cards_cards" + paiType + "_" + phzVo.n + t + ".png";
        return png
    }
});