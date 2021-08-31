/**
 * Created by zhoufan on 2016/11/7.
 */
var PHZCard = ccui.Widget.extend({
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
    ctor:function(displayVo,cardVo,action,isRecord,_scale){
        this._super();        
        this.touchLayer=null;
        this.selected = false;
        this.mjTouchMoved = false;
        this.isTouchMove = false;
        this.isRecord = isRecord || false;//是不是回放
        // cc.log("_scale =", _scale);
        this.bg_scale = _scale || null;
        this._tingList = [];
        this.isLHQ_SHK_16 = PHZRoomModel && PHZRoomModel.getIs_LHQ_SHK_16();
        
        this.refresh(displayVo,cardVo,action,_scale);

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
    refresh: function (displayVo, cardVo, action, _scale){
        this._displayVo = displayVo;
        this._cardVo = cardVo;
        this.bg_scale = _scale || null;
        this.diplay(action);
        this.isLHQ_SHK_16 = PHZRoomModel && PHZRoomModel.getIs_LHQ_SHK_16();
        // cc.log("this.isLHQ_SHK_16 = ",this.isLHQ_SHK_16);
    },


    refreshCardByOpenTex:function() {
        if (this.numberImg){
            //var color = this._cardVo.t == 1 ? "s" : "b";
            //var number = this._cardVo.n;
            //var paiType = PHZSetModel.zpxz == 3?3:1;
            //var pngName = "big_cards" + paiType + "_" + number + color + ".png";
            //var place = this._displayVo.place;
            //if(place != 1){
            //    pngName= "small_cards" + paiType + "_" + number + color + ".png";
            //}
            //var frame = cc.spriteFrameCache.getSpriteFrame(pngName);
            //this.numberImg.setSpriteFrame(frame);
            this.diplay();

            // this.refreshCardBgByOpenTex()
        }else{
            //cc.log("this._cardVo.n::"+this._cardVo.n)
            //cc.log("this._cardVo.t::"+this._cardVo.t)
        }
    },

    refreshCardBgByOpenTex:function() {
        if (this._bg && this.numberImg){
            var place = this._displayVo.place;
            var an = this._cardVo.a;
            var pmType = PHZSetModel.pmxz;
            var bgPng = "";
            if (place == 1){
                bgPng = PHZSetModel.zpdx == 1 ? "big_half_face_"+pmType+".png" : "big_half_face2_"+pmType+".png";
            }else{
                bgPng = "small_half_face_"+pmType+".png";
            }
                
            if (this._cardVo.ishu){ //当前胡的这张牌
                bgPng = "small_half_face1_"+pmType+".png"
            }
            this._bg.setSpriteFrame(bgPng);
        }
    },

    //onEnter:function(){
    //    this._super();
    //    if(this._cardVo.hasOwnProperty("m"))
    //        delete this._cardVo.m;
    //},

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
    setCardIndex:function(valueX,valueY){
        this.cardIndex = valueX;
        this.cardIndexY = valueY;
    },

    getCardIndex:function(){
        return this.cardIndex;
    },
    getCardIndexY: function () {
        return this.cardIndexY;
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
        // cc.log("this.isTouchEnabled()1 =",this.isTouchEnabled());
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
        //if(!this.smallGray){
        //    this.smallGray = UICtor.cS9Img("res/res_phz/img_18.png",cc.rect(5,5,5,5),cc.size(38,56));
        //    this.smallGray.anchorX=this.smallGray.anchorY=0;
        //    this.addChild(this.smallGray);
        //}
    },

    onTouchHandler:function(obj,type){
        var isMyTurn = PHZRoomModel.nextSeat==PHZRoomModel.mySeat;
        if(type == ccui.Widget.TOUCH_BEGAN){
            if(this._bg.getChildByTag(234))
                this._bg.removeChildByTag(234);
            this.createBigCard();
            //this._bg.setScale(0.75);

            if(isMyTurn && PHZRoomModel.selfAct.length==0){
                if (PHZRoomModel.getTouchCard() != this._cardVo.v){
                    PHZRoomModel.setTouchCard(this._cardVo.v);
                    SyEventManager.dispatchEvent(SyEvent.PHZ_CLEAN_TING);
                    if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ || PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ
                        || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.GLZP
                        || PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ
                        || PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ || PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
                        SyEventManager.dispatchEvent(SyEvent.SHOW_TING,this._tingList);
                    }else{
                        SyEventManager.dispatchEvent(SyEvent.PHZ_DEAL_CARD,this._cardVo);
                    }
                }else{
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KQTP,1);
                }
                //PHZRoomModel.mineRoot.Image_hdx.visible=true;
            }
            this.hasTouchBegin = true;
            this.setLocalZOrder(999);   
            this.fromIndex = this.getCardIndex();
            //cc.log("this.fromIndex... ",this.fromIndex)
            this.mjTouchMoved = false;
            this.isTouchMove = false;
        }else if(type == ccui.Widget.TOUCH_MOVED){
            // cc.log("this.hasTouchBegin =", this.hasTouchBegin);
            if(!this.hasTouchBegin){
                return;
            }
            this.isTouchMove = true;
            var touchPoint = this.getTouchMovePosition();
            touchPoint.x = Math.min(touchPoint.x,cc.winSize.width - 60);
            touchPoint.x = Math.max(touchPoint.x,50);

            touchPoint.y = Math.min(touchPoint.y,cc.winSize.height - 130);
            touchPoint.y = Math.max(touchPoint.y,130);

            touchPoint = this.getParent().convertToNodeSpace(touchPoint);
            var targetX = touchPoint.x-this.width/2 ;
            var targetY = touchPoint.y-this.height/2;
            
            if(this.mjTouchMoved || Math.abs(targetX-this.initX)>=60 || Math.abs(targetY-this.initY)>=60){
                this.mjTouchMoved = true;
                this.x = targetX;
                this.y = targetY;
                // if(targetX<this.minX){
                //     this.x = this.minX;
                // }
                // if(targetX>this.maxX){
                //     this.x = this.maxX;
                // }
                // if(targetY<this.minY){
                //     this.y = this.minY;
                // }
                // if(targetY>this.maxY){
                //     this.y = this.maxY;
                // }
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
                if(isMyTurn && PHZRoomModel.selfAct.length==0 && !this._cardVo.grayNoChu &&
                    !((PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ
                    || PHZRoomModel.wanfa == GameTypeEunmZP.GLZP) && this._cardVo.n == 11)){//落地扫王牌不能出
                    // this.setNormalColor();
                    PHZRoomModel.outCardsX = this.x;
                    PHZRoomModel.outCardsY = this.y;
                    PHZRoomModel.isSelfOutCard = true;
                    PHZRoomModel.simulateLetOutCard(this._cardVo.c,JSON.stringify(PHZMineLayout.curSortedData));
                }else{
                    this.setLocalZOrder(this.initZorder);
                    //this.x = this.initX;
                    //this.y = this.initY;
                    //if(isMyTurn && PHZRoomModel.selfAct.length==0) {
                    //    SyEventManager.dispatchEvent(SyEvent.PHZ_HIDE_TING);
                    //}
                }
                PHZMineLayout.reSetCardPos();
            }else{//插牌处理
                if(isMyTurn && PHZRoomModel.selfAct.length==0) {
                    SyEventManager.dispatchEvent(SyEvent.PHZ_HIDE_TING);
                }
                this.selected = false;
                var isArrived = false;
                var isInsert = false;
                var isSwap = false;
                var touchPoint = this.getTouchMovePosition();
                touchPoint.x = Math.min(touchPoint.x, cc.winSize.width - 60);
                touchPoint.x = Math.max(touchPoint.x, 50);

                touchPoint.y = Math.min(touchPoint.y, cc.winSize.height - 130);
                touchPoint.y = Math.max(touchPoint.y, 130);

                // cc.log("PHZMineLayout.coords.length =", PHZMineLayout.coords.length);
                for(var i=0;i<PHZMineLayout.coords.length;i++){
                    var coord = PHZMineLayout.coords[i];
                    // cc.log("Coord =",JSON.stringify(coord));
                    var tCardList = PHZMineLayout.curSortedData[i];
                    var tCardListLength = tCardList.length;

                    // cc.log("this.x...  ",this.x);
                    // cc.log("coord.x...  ",coord.x);
                    // if(Math.abs(this.x-coord.x)<67 && Math.abs(this.y-coord.y)<241){
                    // cc.log("Math.abs(this.x-coord.x)<67 =", Math.abs(this.x - coord.x));
                    
                    if(Math.abs(this.x-coord.x)<85){
                        for (let index = 0; index < PHZMineLayout.cards.length; index++) {
                            // cc.log("cc.p(this.x,this.y) =", this.x, this.y);
                            var targetCard = PHZMineLayout.cards[index];
                            if (targetCard._cardVo.c != this._cardVo.c && cc.rectContainsPoint(targetCard.getBoundingBox(), cc.p(touchPoint.x, touchPoint.y))
                                && !targetCard._cardVo.same) {
                                // cc.log("CardsImages =", JSON.stringify(PHZMineLayout.cards[index]._cardVo));
                                var targetIndexX = targetCard.getCardIndex();
                                var targetIndexY = targetCard.getCardIndexY();
                                // cc.log("index =", this.fromIndex, targetIndexX, targetIndexY);
                                var fromIndexArr = {x:this.fromIndex,y:this.getCardIndexY()};
                                var toIndexArr = { x: targetIndexX, y: targetIndexY};
                                PHZMineLayout.swapCardsPos(fromIndexArr, toIndexArr);
                                isSwap = true;
                                break;
                            }
                        }

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
                        // if(Math.abs(this.x-coord.x)<67 && Math.abs(this.y-coord.y)<241){
                        if (Math.abs(this.x - coord.x) < 85 && !isSwap){
                            if(PHZMineLayout.curSortedData[i].length<=4){
                                this.setLocalZOrder(2 - insertIndexY );
                                PHZMineLayout.reSortAndDisplay(this._cardVo,i,isInsert,insertIndexY);
                                isArrived = true;
                            }
                            //cc.log("isArrived",isArrived);
                            break;
                        }
                    }
                }
                if (!isArrived && !isSwap){
                    if(this.x>PHZMineLayout.coords[PHZMineLayout.coords.length-1].x+66 && PHZMineLayout.curSortedData.length<10){
                        PHZMineLayout.reSortAndDisplay(this._cardVo,-1,false);
                    }else if(this.x<PHZMineLayout.coords[0].x-66 && PHZMineLayout.curSortedData.length<10){
                        PHZMineLayout.reSortAndDisplay(this._cardVo,-2,false);
                        //}else{
                        //    this.setLocalZOrder(this.initZorder);
                        //    this.x = this.initX;
                        //    this.y = this.initY;
                    }
                }
            }
            PHZMineLayout.reSetCardPos();
        }
    },

    diplay:function(action){
        this.removeAllChildren(true);
        // cc.log("this.isLHQ_SHK_16 =",this.isLHQ_SHK_16);
        this.touchLayer=null;
        //先选一个背景
        if(this._cardVo.c<=0)//偎、提等显示背景
            this._cardVo.a=1;
        var direct = this._displayVo.direct;
        var place = this._displayVo.place;
        var an = this._cardVo.a;
        var same = this._cardVo.same;

        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ || PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            same = 0;
        }

        var png = "";
        var bgPng = "";
        var paiType = PHZSetModel.zpxz==3?3:1;
        var pmType = PHZSetModel.pmxz;
        var scale = 1;
        var scaleX = 1;
        if(an==1){
            scale = 0.8;
            bgPng = "small_half_back.png";
            if(PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
                bgPng = "yzchz_small_back.png";
            }
        }else{
            var t = this._cardVo.t == 1 ? "s" : "b";
            if (place == 1){
                bgPng = PHZSetModel.zpdx == 1 ? "big_half_face_"+pmType+".png" : "big_half_face2_"+pmType+".png";
            }else{
                scale = 0.8;
                bgPng = "small_half_face_"+pmType+".png";
            }
            if(place == 1){
                // cc.log("this.isLHQ_SHK_16 =",this.isLHQ_SHK_16);
                if(PHZSetModel.zpdx == 4){
                    scale = 1.25;
                }
                if (PHZSetModel.zpdx == 3) {
                    scale = 1.2;
                }
                if (PHZSetModel.zpdx == 2){
                    scaleX = 1.1;
                    if(this.isLHQ_SHK_16 &&  PHZSetModel.zpdx == 4){
                        scale = 1.25;
                        scaleX= 1;
                    }
                }
                png = "big_cards" + paiType + "_" + this._cardVo.n + t + ".png";
            }else {
                png = "small_cards" + paiType + "_" + this._cardVo.n + t + ".png";
            }
        }

        if(direct!=1 && PHZRoomModel.wanfa==38 && action==PHZAction.WEI){
            scale = 0.5;
            bgPng = "small_half_back.png";
        }

        if (this._cardVo.ishu){ //当前胡的这张牌
            scale = 0.7;
            bgPng = "small_half_face1_"+pmType+".png"
            
        }

        this.anchorX=this.anchorY=0;

        var bgImg =  this._bg = this.getSprite(bgPng);
        bgImg.anchorX=bgImg.anchorY=0;
        bgImg.setScale(scale); //= 1.2;
        // cc.log("this.bg_scale =", this.bg_scale);
        if(this._cardVo.ishu){
            var huLogo = new cc.Sprite("res/res_phz/huLogo.png");
            huLogo.scale = 1.5;
            this._bg.addChild(huLogo);
            huLogo.x = 70;
            huLogo.y = 95;
        }
        if (this.bg_scale){
            bgImg.setScale(this.bg_scale); //= 1.2;
        }
        if (scaleX > 1){
            bgImg.setScaleX(scaleX);
        }
        bgImg.x = 0;
        bgImg.y = 0;
        this.addChild(bgImg);


        if (png != ""){
            var bg = this.numberImg = this.getSprite(png);
            bg.anchorX=bg.anchorY=0.5;
            bg.x = this._bg.width*0.5;
            bg.y = this._bg.height*0.62;
            bgImg.addChild(bg);
            if (place == 1){
                if (PHZSetModel.zpdx == 4){
                    bg.scale = 1.10;
                }else if (PHZSetModel.zpdx == 3){
                    bg.scale = 1.05;
                }
                // if(this.isLHQ_SHK_16){
                //     bg.scale = 1.2;
                // }
                if(PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ && paiType == 3){
                    bg.scale = bg.scale*1.1;
                }
            }
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

        if (this._cardVo.ishu){ //当前胡的这张牌
            bgImg.x = -5;
            bgImg.y = -5;
        }

        if (this._cardVo.dabian){
            // cc.log("this._cardVo.n = ",this._cardVo.n);
            bgImg.setColor(cc.color(175,175,175));
        }

        if((PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ||PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ
            ||PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ || PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ) && same == 1){
            same = 0;
            this.setGrayCanMove();
        }
        
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            if(this._cardVo.c >= 81 && this._cardVo.c <= 84){//王牌可以拖动
                same = 0;
            }
        }

        if(same==1&&direct==1&&place==1){//大于等于3个一样的 加一层遮罩
            if(PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.XXEQS&& PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ){//落地扫不让加置灰，说是看着不爽，我了个去
                bgImg.setColor(cc.color(175,175,175));
            }
        }
        this.setContentSize(this._bg.width*scale,this._bg.height*scale);
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

        // cc.log("this.isTouchEnabled() =",this.isTouchEnabled());
        // if(this.isTouchEnabled()){
        var tingImg  = this.tingImg = new cc.Sprite("res/res_phz/ting.png");
        tingImg.x = bgImg.width*0.18;
        tingImg.y = bgImg.height*0.85;
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
        
        // }

        // var nettip_txt = new cc.LabelTTF("" + this._cardVo.c, "Arial", 36);
        // nettip_txt.setColor(cc.color(0, 0, 0));
        // nettip_txt.x = 20;
        // nettip_txt.y = 100;
        // bgImg.addChild(nettip_txt)

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
        //this._huase.runAction(cc.fadeTo(1,0));
    },

    showTingImg:function(_bool){
        // cc.log("this.tingImg =",this.tingImg);
        if (this._bg.getChildByName("tingImg") && this.isTouchEnabled()){
            this.tingImg.visible = _bool;
            if (!_bool) this._tingList = [];
        }
    },

    createBigCard:function(){
        var pmType = PHZSetModel.pmxz;
        var kuangText = "#big_face"+pmType+".png";
        var per = 0.22;
        var kuang = new cc.Sprite(kuangText);
        kuang.scale = 1.5;
        kuang.x = this._bg.width*0.5;
        kuang.y = this._bg.height*0.5;
        this._bg.addChild(kuang,6,234);
        if (PHZRoomModel.sxSeat == PHZRoomModel.mySeat){
            kuang.setColor(cc.color(175,175,175));
        }
        var png = "cards_back.png";
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
        var paiType = PHZSetModel.zpxz==3?3:1;
        var png = "big_cards" + paiType + "_" + phzVo.n + t + ".png";
        return png
    },
});