/**
 * Created by cyp on 2019/6/27.
 * 叫分按钮层
 */
var YYBSJiaoFenBtnLayer = cc.Layer.extend({
    curFen:110,
    ctor:function(){
        this._super();

        this.initLayer();
    },

    handleTableData:function(type,data){
        if(type == YYBSTabelType.CreateTable){

            if(YYBSRoomModel.remain == 1 && YYBSRoomModel.qzCards.length == 0){
                this.layerBg.setVisible(true);
                this.setBtnState();
                this.countTime();
            }else{
                this.layerBg.setVisible(false);
            }

            if(YYBSRoomModel.remain == 1 && YYBSRoomModel.qzCards.length > 0 && YYBSRoomModel.nextSeat == YYBSRoomModel.mySeat){
                this.showFanZhuLayer(true);
            }else{
                this.showFanZhuLayer(false);
            }

        }else if(type == YYBSTabelType.DealCard){

            if(YYBSRoomModel.remain == 1 && YYBSRoomModel.qzCards.length == 0){
                this.layerBg.setVisible(true);
                this.setBtnState();
                this.countTime();
            }else{
                this.layerBg.setVisible(false);
            }

        }else if(type == YYBSTabelType.JiaoFen){
            this.layerBg.setVisible(false);
            if(data.params[2] > 0 && YYBSRoomModel.nextSeat == YYBSRoomModel.mySeat){
                this.showFanZhuLayer(true);
            }else{
                this.showFanZhuLayer(false);
            }
        }
    },

    showFanZhuLayer:function(isShow){
        if(YYBSRoomModel.replay)isShow = false;

        var layer = this.getChildByName("FanZhuLayer");
        layer && layer.removeFromParent(true);

        if(isShow){
            layer = new YYBSFanZhuLayer();
            layer.setName("FanZhuLayer");
            this.addChild(layer,10);
        }
    },

    initLayer:function(){
        var bg = new ccui.ImageView("res/res_yybs/dia.png");
        bg.setAnchorPoint(0.5,0);
        bg.setScale9Enabled(true);
        bg.setCapInsets(cc.rect(bg.width/3,bg.height/3,bg.width/3,bg.height/3));
        bg.setPosition(cc.winSize.width/2,410);
        this.addChild(bg);

        this.layerBg = bg;
        this.layerBg.setVisible(false);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                if(bg.isVisible() && cc.rectContainsPoint(bg.getBoundingBox(),touch.getLocation())){
                    return true;
                }
                return false;
            }
        }), this);

        var tipStr = "开始抢庄";
        this.label_tip = UICtor.cLabel(tipStr,54);
        this.label_tip.setPosition(bg.width/2,240);
        bg.addChild(this.label_tip,1);

        this.btnArr = [];

        var offsetX = 210;
        var imgArr = ["fangkuai","meihua","hongtao","heitao"];
        var typeArr = [1,2,3,4];
        for(var i = 0;i<typeArr.length;++i){
            var btn = new ccui.Button("res/res_yybs/JFc_anniu_zhu.png","res/res_yybs/JFc_anniu_zhu.png","");
            btn.setPosition(bg.width/2 + (i-1.5)*offsetX,105);
            btn.addTouchEventListener(this.onClickTypeBtn,this);
            bg.addChild(btn,1);
            btn.flag = typeArr[i];

            var img = "res/res_yybs/" + imgArr[i] + ".png";
            var icon = new cc.Sprite(img);
            icon.setPosition(btn.width/2,btn.height/2);
            btn.addChild(icon);

            this.btnArr.push(btn);
        }


        var spr = new cc.Scale9Sprite("res/res_yybs/dushi.png");
        spr.setAnchorPoint(1,0.5);
        this.progressBar = new cc.ProgressTimer(spr);
        this.progressBar.setPosition(bg.width/2,bg.height - 9);
        this.progressBar.setBarChangeRate(cc.p(1,0));
        this.progressBar.setMidpoint(cc.p(1,0));
        this.progressBar.setType(cc.ProgressTimer.TYPE_BAR);
        bg.addChild(this.progressBar,1);
        this.progressBar.setPercentage(100);
    },

    setBtnState:function(){
        var typeObj = {};
        var p = YYBSRoomModel.getPlayerDataByItem("seat",YYBSRoomModel.mySeat);
        for(var i = 0;i< p.handCardIds.length;++i){
            var id = p.handCardIds[i];
            if(id % 100 == 10){
                var temp = YYBSCardID[id];
                typeObj[temp.t] = true;
            }
            if(id == 115 || id == 315){
                typeObj.hasHong2 = true;
            }
        }

        var hong2Rule = (YYBSRoomModel.intParams[16] != 2) || (YYBSRoomModel.intParams[16] == 2 && typeObj.hasHong2);
        for(var i = 0;i<this.btnArr.length;++i){
            var btn = this.btnArr[i];
            var canClick =  hong2Rule && typeObj[btn.flag];
            btn.setBright(canClick);
            btn.setTouchEnabled(canClick);
        }

    },

    onClickTypeBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            var paiStr = "";

            //筛选红2
            if(YYBSRoomModel.intParams[16] == 2){
                var p = YYBSRoomModel.getPlayerDataByItem("seat",YYBSRoomModel.mySeat);
                for(var i = 0;i< p.handCardIds.length;++i){
                    if(p.handCardIds[i] == 115 || p.handCardIds[i] == 315){
                        paiStr += (p.handCardIds[i] + ",");
                        break;
                    }
                }
            }

            paiStr += (sender.flag + "10");

            sySocket.sendComReqMsg(3100,[1],[paiStr]);


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    countTime:function(){
        var time = 20;

        this.progressBar.stopAllActions();
        this.progressBar.setPercentage(100);
        var action = new cc.ProgressTo(time - 3,1);
        this.progressBar.runAction(cc.sequence(action,cc.blink(3,3)));
    },
});

var YYBSFanZhuLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        this.cardsData = [];

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:this.onTouchBegan.bind(this),
            onTouchEnded:this.onTouchEnded.bind(this),
            onTouchCanceled:this.onTouchCanceled.bind(this)
        }), this);

        this.initLayer();

        this.addCurCard(YYBSRoomModel.qzCards);

        //限制只能用最小一级的反主
        var cards = YYBSRoomModel.getFanZhuCards();
        if(cards.length > 1)cards.length = 1;

        this.addSelectCard(cards);
    },

    onTouchBegan:function(touch,event){

        this.beganIdx = this.getTouchCardIdx(touch.getLocation());
        if(this.beganIdx >= 0){
            for(var i = 0;i<this.cardsArr[this.beganIdx].length;++i){
                var card = this.cardsArr[this.beganIdx][i];
                card.setColor(cc.color.GRAY);
            }
        }


        return true;
    },

    onTouchEnded:function(touch,event){
        var idx = this.getTouchCardIdx(touch.getLocation());

        if(idx >= 0 && idx == this.beganIdx){
            var paiStr = this.cardsData[idx].join(",");
            cc.log("=======fanzhuCards=========",paiStr);
            sySocket.sendComReqMsg(3100,[2],[paiStr]);
        }

        this.resetTouchState();
    },

    onTouchCanceled:function(){
        this.resetTouchState();
    },

    resetTouchState:function(){
        if(this.beganIdx >= 0){
            if(this.beganIdx >= 0){
                for(var i = 0;i<this.cardsArr[this.beganIdx].length;++i){
                    var card = this.cardsArr[this.beganIdx][i];
                    card.setColor(cc.color.WHITE);
                }
            }
        }
    },

    getTouchCardIdx:function(pos){
        var idx = -1;
        pos = this.cardNode.convertToNodeSpace(pos);
        for(var i = 0;i < this.cardsArr.length;++i){
            for(var j = 0;j<this.cardsArr[i].length;++j){
                var card = this.cardsArr[i][j];
                var rect = card.getBoundingBox();
                if(cc.rectContainsPoint(rect,pos)){
                    idx = i;
                    break;
                }
            }

        }
        return idx;
    },

    initLayer:function(){
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(180);
        this.addChild(gray);

        this.layerBg = new cc.Scale9Sprite("res/res_yybs/score_bg.png");
        this.layerBg.setContentSize(1080,600);
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 120);
        this.addChild(this.layerBg);

        var title = UICtor.cLabel("点击牌反主",60);
        title.setPosition(this.layerBg.width/2,this.layerBg.height - 75);
        title.setColor(cc.color(100,50,50));
        this.layerBg.addChild(title);

        this.cardNode = new cc.Node();
        this.layerBg.addChild(this.cardNode,1);
        this.cardNode.setPosition(this.layerBg.width/2,this.layerBg.height/2 + 30);

        var img = "res/res_yybs/btn_fqfz.png";
        this.btn_cancel = new ccui.Button(img,img);
        this.btn_cancel.addTouchEventListener(this.onClickBtn,this);
        this.btn_cancel.setPosition(this.layerBg.width/2,105);
        this.layerBg.addChild(this.btn_cancel,1);

    },

    addCurCard:function(data){
        for(var i = 0;i<data.length;++i){
            var card = new cc.Sprite("res/pkCommon/smallCard/s_card_" + data[i] +".png");
            card.setPosition(75 + i*card.width,this.layerBg.height - 90);
            this.layerBg.addChild(card);
        }
    },

    addSelectCard:function(data){
        this.cardsData = data;
        this.cardsArr = [];

        var posx = 0;
        var posy = 0;
        var lastx = 0;
        var lasty = 0;
        for(var i = 0;i<data.length;++i){
            var arr = [];

            if((posx + 53*data[i].length) > (this.layerBg.width - 105)){
                posx = 0;posy -= 225;
            }

            for(var j = 0;j<data[i].length;++j){
                var card = new YYBSCard(data[i][j]);
                card.setScale(0.6);
                card.setPosition(posx,posy);
                card.idx = i;
                this.cardNode.addChild(card);
                arr.push(card);
                if(posx > lastx)lastx = posx;
                if(posy < lasty)lasty = posy;
                posx += 53;
            }
            this.cardsArr.push(arr);
            posx += 105;

        }

        this.cardNode.x -= lastx/2;
        this.cardNode.y -= lasty/2;
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            sySocket.sendComReqMsg(3100,[0],[]);


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },
});