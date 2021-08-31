/**
 * Created by cyp on 2019/6/27.
 * 叫分按钮层
 */
var CDTLJJiaoFenBtnLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        this.layerType = 1;

        this.initLayer();
    },

    handleTableData:function(type,data){
        if(type == CDTLJTabelType.CreateTable){
            this.layerBg.setVisible(false);
            this.showFanZhuLayer(false);
            if(CDTLJRoomModel.remain == 1 && CDTLJRoomModel.qzCards.length == 0){
                this.layerBg.setVisible(true);
                this.showBtnWithType(1);
                this.setBtnState();
                this.countTime();
            }

            if(CDTLJRoomModel.remain == 1 && CDTLJRoomModel.qzCards.length > 0
                && CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.showBtnWithType(2);
                this.setBtnState();
                this.countTime();
            }

        }else if(type == CDTLJTabelType.DealCard){
            this.layerBg.setVisible(false);

            setTimeout(function(){
                if(CDTLJRoomModel.remain == 1 && CDTLJRoomModel.qzCards.length == 0){
                    this.layerBg.setVisible(true);
                    this.showBtnWithType(1);
                    this.setBtnState();
                    this.countTime();
                }
            }.bind(this),4300);

        }else if(type == CDTLJTabelType.JiaoFen){
            this.layerBg.setVisible(false);
            this.showFanZhuLayer(false);
            if(data.params[2] > 0 && CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.showBtnWithType(2);
                this.setBtnState();
                this.countTime();
            }
        }
    },

    showFanZhuLayer:function(isShow,fzCards){
        if(CDTLJRoomModel.replay)isShow = false;

        var layer = this.getChildByName("FanZhuLayer");
        layer && layer.removeFromParent(true);

        if(isShow){
            layer = new CDTLJFanZhuLayer(fzCards);
            layer.setName("FanZhuLayer");
            this.addChild(layer,10);
        }
    },

    initLayer:function(){
        var bg = new ccui.ImageView("res/res_cdtlj/dia.png");
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
        var imgArr = ["wang","er","fangkuai","meihua","hongtao","heitao","fangqi"];
        var typeArr = [5,6,1,2,3,4,0];
        for(var i = 0;i<typeArr.length;++i){
            var btn = new ccui.Button("res/res_cdtlj/JFc_anniu_zhu.png","res/res_cdtlj/JFc_anniu_zhu.png","");
            btn.setPosition(bg.width/2 + (i-(imgArr.length - 1)/2)*offsetX,105);
            btn.addTouchEventListener(this.onClickTypeBtn,this);
            bg.addChild(btn,1);
            btn.flag = typeArr[i];

            var img = "res/res_cdtlj/" + imgArr[i] + ".png";
            var icon = new cc.Sprite(img);
            icon.setPosition(btn.width/2,btn.height/2);
            btn.addChild(icon);

            var num = new cc.LabelBMFont("0", "res/res_cdtlj/font/jiaozhu.fnt");
            num.setPosition(btn.width - 30, 35);
            num.setTag(1);
            btn.addChild(num);

            if(typeArr[i] == 0){
                num.setVisible(false);
            }

            this.btnArr.push(btn);
        }


        var spr = new cc.Scale9Sprite("res/res_cdtlj/dushi.png");
        spr.setAnchorPoint(1,0.5);
        this.progressBar = new cc.ProgressTimer(spr);
        this.progressBar.setPosition(bg.width/2,bg.height - 9);
        this.progressBar.setBarChangeRate(cc.p(1,0));
        this.progressBar.setMidpoint(cc.p(1,0));
        this.progressBar.setType(cc.ProgressTimer.TYPE_BAR);
        bg.addChild(this.progressBar,1);
        this.progressBar.setPercentage(100);
    },

    showBtnWithType:function(type){
        this.layerType = type;

        var num = 7;
        if(type == 1){
            num = 6;
            for(var i = 0;i<this.btnArr.length;++i){
                var btn = this.btnArr[i];
                btn.setPositionX(this.layerBg.width/2 + (i-(num - 1)/2)*210);
                btn.setVisible(btn.flag > 0);
            }
        }else{
            for(var i = 0;i<this.btnArr.length;++i){
                var btn = this.btnArr[i];
                btn.setPositionX(this.layerBg.width/2 + (i-(num - 1)/2)*210);
                btn.setVisible(true);
            }
        }
        this.label_tip.setString(this.layerType==1?"开始抢庄":"选择反主");
    },

    setBtnState:function(){

        var numCfg = {};
        var stateCfg = {};

        var p = CDTLJRoomModel.getPlayerDataByItem("seat",CDTLJRoomModel.mySeat);
        for(var i = 0;i< p.handCardIds.length;++i){
            var id = p.handCardIds[i];
            var temp = CDTLJCardID[id];
            var k = 0;
            if(temp.v == 12)k = 6;
            else k = temp.t;

            if(!numCfg[k]){
                numCfg[k] = 1;
            }else{
                numCfg[k]++;
            }
        }

        if(this.layerType == 1){
            stateCfg = this.getQzCard(p.handCardIds);
        }else{
            for(var i = 1;i<=6;++i){
                var data = CDTLJRoomModel.getFanZhuCards(i);
                stateCfg[i] = data.length > 0?data:null;
            }
            stateCfg[0] = 1;
        }

        for(var i = 0;i<this.btnArr.length;++i){
            var btn = this.btnArr[i];
            btn.getChildByTag(1).setString(numCfg[btn.flag] || "");
        }

        for(var i = 0;i<this.btnArr.length;++i){
            var btn = this.btnArr[i];
            btn.tempData = stateCfg[btn.flag];
            btn.setBright(btn.tempData);
            btn.setTouchEnabled(btn.tempData);
        }

    },

    getQzCard:function(ids){
        var shi = {};
        var hong2Arr = [];
        var hei2Arr = [];
        var wangArr = [];

        for(var i = 0;i<ids.length;++i){
            var id = ids[i];
            var temp = CDTLJCardID[id];
            if(id == 115 || id == 315)hong2Arr.push(id);
            if(id == 215 || id == 415)hei2Arr.push(id);
            if(temp.t == 5)wangArr.push(id);
            if(temp.v == 14){
                shi[temp.t] = id;
            }
        }

        var retData = {};

        if(hong2Arr.length > 0){
            for(var k in shi){
                retData[k] = [hong2Arr[0],shi[k]];
            }
        }
        if(hong2Arr.length == 4)retData[6] = hong2Arr;
        if(hei2Arr.length == 4)retData[6] = hei2Arr;
        if(wangArr.length == 4)retData[5] = wangArr;

        return retData;

    },

    onClickTypeBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender.flag == 0){
                sySocket.sendComReqMsg(3100,[0],[]);
            }else if(this.layerType == 1){
                sySocket.sendComReqMsg(3100,[1],sender.tempData.join(","));
            }else if(sender.flag > 0){
                this.showFanZhuLayer(true,sender.tempData);
            }

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

var CDTLJFanZhuLayer = cc.Layer.extend({
    ctor:function(fzCards){
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

        this.addCurCard(CDTLJRoomModel.qzCards);

        this.addSelectCard(fzCards);
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

        this.layerBg = new cc.Scale9Sprite("res/res_cdtlj/score_bg.png");
        this.layerBg.setContentSize(1080,600);
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 120);
        this.addChild(this.layerBg);

        var title = UICtor.cLabel("点击牌反主",60);
        title.setPosition(this.layerBg.width/2,this.layerBg.height - 75);
        title.setColor(cc.color(100,50,50));
        this.layerBg.addChild(title);

        this.cardNode = new cc.Node();
        this.layerBg.addChild(this.cardNode,1);
        this.cardNode.setPosition(this.layerBg.width/2,this.layerBg.height/2);

        var img = "res/ui/bjdmj/popup/x.png";
        this.btn_cancel = new ccui.Button(img,img);
        this.btn_cancel.addTouchEventListener(this.onClickBtn,this);
        this.btn_cancel.setPosition(this.layerBg.width - 20,this.layerBg.height - 20);
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
                var card = new CDTLJCard(data[i][j]);
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

            this.removeFromParent(true);
            //sySocket.sendComReqMsg(3100,[0],[]);


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },
});