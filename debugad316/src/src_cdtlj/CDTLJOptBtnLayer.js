/**
 * Created by cyp on 2019/7/1.
 */
var CDTLJOptBtnLayer = cc.Layer.extend({
    clockCount:0,
    timeCount:0,
    selectIds:null,
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("CDTLJ_Select_Card",this,this.onSelectCard);

        this.selectIds = [];

        this.initLayer();
        this.setBtnState(0);
    },

    handleTableData:function(type,data){
        if(type == CDTLJTabelType.CreateTable){
            this.setBtnState(0);
            this.showCDPLayer(false);

            if(CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat){
                if(CDTLJRoomModel.remain == 3)this.setBtnState(2);
                else if(CDTLJRoomModel.remain == 4)this.setBtnState(1);
                else if(CDTLJRoomModel.remain == 10)this.setBtnState(3);

                this.checkBtnState();
            }

            this.setClockState();

            if(CDTLJRoomModel.isSelectLiuShou()){
                this.setBtnState(0);
                this.hideClock();
            }

            if(CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat
                && CDTLJRoomModel.remain == 12){
                this.showCDPLayer(true);
            }

        }else if(type == CDTLJTabelType.DealCard) {
            this.cleanSelectIds();
            this.setClockState();
        }else if(type == CDTLJTabelType.JiaoFen){
            this.setClockState();
        }else if(type == CDTLJTabelType.DingZhuang){
            this.cleanSelectIds();
            this.setClockState();
        }else if(type == CDTLJTabelType.XuanZhu){
            this.cleanSelectIds();
            if(CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat){
                this.setBtnState(2);
            }else{
                this.setBtnState(0);
            }
            this.setClockState();
        }else if(type == CDTLJTabelType.PlayCard){
            this.setBtnState(0);
            this.hideClock();

            if(data.cardType == 100 && CDTLJRoomModel.mySeat == data.seat){//埋牌消息
                this.setBtnState(3);
            }

            if(data.cardType  == 200){//抠底消息
                return;
            }


            if(data.seat == CDTLJRoomModel.mySeat){
                this.cleanSelectIds();
            }else{
                this.checkBtnState();
            }

            var func = function(){
                this.setClockState();
                if (data.nextSeat == CDTLJRoomModel.mySeat && CDTLJRoomModel.remain == 4) {
                    this.setBtnState(1);
                }
                if(CDTLJRoomModel.isSelectLiuShou()){//需要先选留守花色，先不显示出牌按钮
                    this.setBtnState(0);
                    this.hideClock();
                }
            }.bind(this);

            if(data.isClearDesk){//打完一轮，延时处理
                setTimeout(func,1500);
            }else{
                func();
            }
        }else if(type == CDTLJTabelType.OnOver){
            this.setClockState();
        }else if(type == CDTLJTabelType.XuanLiuShou){//选完留守花色，显示出牌操作按钮
            if (CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat) {
                this.setClockState();
                this.setBtnState(1);
            }
        }else if(type == CDTLJTabelType.TouXiang){
            if(CDTLJRoomModel.mySeat == CDTLJRoomModel.banker){
                this.btn_touxiang.setBright(false);
                this.btn_touxiang.setTouchEnabled(false);
            }
            var temp = JSON.parse(data.strParams[0]);

            var is_refuse = false;
            for(var i = 0;i<temp.length;++i){
                if(temp[i].state == 3){
                    is_refuse = true;
                    break;
                }
            }
            //拒绝投降后刷新下倒计时
            if(is_refuse){
                this.setClockState();
            }
        }else if(type == "YYBS_ZDY"){
            if(CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat
                && CDTLJRoomModel.remain == 4){
                this.setBtnState(1);
            }else{
                this.setBtnState(0);
            }

            if(CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat
                && CDTLJRoomModel.remain == 12){
                this.showCDPLayer(true);
            }else{
                this.showCDPLayer(false);
            }

            this.setClockState();
        }else if(type == "CDTLJ_CDP"){
            this.showCDPLayer(false);

            if(CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat
                && CDTLJRoomModel.remain == 4){
                this.setBtnState(1);
            }else{
                this.setBtnState(0);
            }
            this.setClockState();
        }
    },

    cleanSelectIds:function(){
        this.selectIds = [];
        this.checkBtnState();
    },

    initLayer:function(){
        this.contentNode = new cc.Node();
        this.contentNode.setPosition(cc.winSize.width/2,510);
        this.addChild(this.contentNode);
        //this.contentNode.setVisible(false);

        this.btn_tishi = new ccui.Button("res/res_cdtlj/ts.png","res/res_cdtlj/ts.png","res/res_cdtlj/ts1.png");
        this.btn_tishi.setPosition(-300,0);
        this.btn_tishi.setBright(false);
        this.btn_tishi.setTouchEnabled(false);
        this.contentNode.addChild(this.btn_tishi,1);

        this.btn_chupai = new ccui.Button("res/res_cdtlj/cp.png","res/res_cdtlj/cp.png");
        this.btn_chupai.setPosition(300,0);
        this.contentNode.addChild(this.btn_chupai,1);

        this.spr_clock = new cc.Sprite("res/res_cdtlj/naozhong.png");
        this.spr_clock.setPosition(this.contentNode.getPosition());
        this.addChild(this.spr_clock,1);

        this.clock_num = UICtor.cLabel("60",56);
        this.clock_num.setColor(cc.color(157,74,9));
        this.clock_num.setPosition(this.spr_clock.width/2 - 1,this.spr_clock.height/2 + 1);
        this.spr_clock.addChild(this.clock_num,1);

        this.btn_touxiang = new ccui.Button("res/res_cdtlj/tx.png","res/res_cdtlj/tx.png","");
        this.btn_touxiang.setPosition(-300,0);
        this.contentNode.addChild(this.btn_touxiang);

        this.btn_maipai = new ccui.Button("res/res_cdtlj/mp.png","res/res_cdtlj/mp.png","res/res_cdtlj/mp1.png");
        this.btn_maipai.setPosition(300,0);
        this.contentNode.addChild(this.btn_maipai);

        var img = "res/res_cdtlj/btn_yds.png";
        this.btn_yds = new ccui.Button(img,img);
        this.btn_yds.addTouchEventListener(this.onClickBtn,this);
        this.btn_yds.setPosition(-300,0);
        this.contentNode.addChild(this.btn_yds,1);

        var img = "res/res_cdtlj/btn_zdy.png";
        this.btn_zdy = new ccui.Button(img,img);
        this.btn_zdy.addTouchEventListener(this.onClickBtn,this);
        this.btn_zdy.setPosition(300,0);
        this.contentNode.addChild(this.btn_zdy,1);

        this.btn_tishi.addTouchEventListener(this.onClickBtn,this);
        this.btn_chupai.addTouchEventListener(this.onClickBtn,this);
        this.btn_touxiang.addTouchEventListener(this.onClickBtn,this);
        this.btn_maipai.addTouchEventListener(this.onClickBtn,this);

        this.clockCount = 0;
        this.updateClockNum();
        this.scheduleUpdate();
    },

    setBtnState:function(type){
        this.showType  = type;

        this.btn_tishi.setVisible(type == 1);
        this.btn_chupai.setVisible(type == 1);
        this.btn_maipai.setVisible(type == 2);
        this.btn_touxiang.setVisible(false);

        this.btn_yds.setVisible(type == 3);
        this.btn_zdy.setVisible(type == 3);

        if(type == 2){
            var p = CDTLJRoomModel.getPlayerDataByItem("seat",CDTLJRoomModel.mySeat);
            var canTouXiang = false;
            if(p && p.ext[5] != 1){
                canTouXiang = true;
            }
            this.btn_touxiang.setBright(canTouXiang);
            this.btn_touxiang.setTouchEnabled(canTouXiang);
        }
    },

    hideClock:function(){
        this.spr_clock.setVisible(false);
    },

    setClockState:function(){
        var isShow = false;
        if(CDTLJRoomModel.nextSeat != CDTLJRoomModel.mySeat){
            isShow = CDTLJRoomModel.remain > 0 && CDTLJRoomModel.remain < 5;
        }else if(CDTLJRoomModel.remain == 3 || CDTLJRoomModel.remain == 4){
            isShow = true;
        }
        if(CDTLJRoomModel.remain == 10 || CDTLJRoomModel.remain == 12){
            isShow = true;
        }

        //抢庄不显示
        if(CDTLJRoomModel.remain == 1 && CDTLJRoomModel.qzCards.length == 0){
            isShow = false;
        }

        this.spr_clock.setVisible(isShow);
        if(isShow){
            this.clockCount = CDTLJRoomModel.getCountTime();
            this.clock_num.setString(this.clockCount);
            var seq = CDTLJRoomModel.getSeqWithSeat(CDTLJRoomModel.nextSeat);

            var pos = cc.p(cc.winSize.width/2,510);
            if(seq == 2){
                pos.x = cc.winSize.width - 300;
                pos.y = cc.winSize.height/2 + 150;
            }else if(seq == 3){
                pos.x = cc.winSize.width/2 + 150;
                pos.y = cc.winSize.height - 270;
            }else if(seq == 4){
                pos.x = 300;
                pos.y = cc.winSize.height/2 + 150;
            }
            this.spr_clock.setPosition(pos);
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_maipai){
                CDTLJRoomModel.sendPlayCardMsg(100,this.selectIds);
            }else if(sender == this.btn_chupai){
                CDTLJRoomModel.sendPlayCardMsg(0,this.selectIds);
            }else if(sender == this.btn_touxiang){
                sySocket.sendComReqMsg(3105,[1]);
            }else if(sender == this.btn_tishi){
                SyEventManager.dispatchEvent("CDTLJ_TIP_CARD");
            }else if(sender == this.btn_yds){
                sySocket.sendComReqMsg(3106,[1]);
            }else if(sender == this.btn_zdy){
                sySocket.sendComReqMsg(3106,[2]);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    showCDPLayer:function(isShow){
        if(CDTLJRoomModel.replay)isShow = false;

        var layer = this.getChildByName("CDPLayer");
        layer && layer.removeFromParent(true);

        if(isShow){
            layer = new CDTLJCDPLayer();
            layer.setName("CDPLayer");
            this.addChild(layer,10);
        }
    },

    onSelectCard:function(event){
        this.selectIds = event.getUserData();
        this.checkBtnState();
    },

    checkBtnState:function(){
        var canMaiPai = this.selectIds.length == CDTLJRoomModel.getDiPaiNum();
        this.btn_maipai.setBright(canMaiPai);
        this.btn_maipai.setTouchEnabled(canMaiPai);

        var canChuPai = this.selectIds.length > 0;
        var firstCards = CDTLJRoomModel.getFirstCards();

        if(this.selectIds.length > 0){
            var baofu = CDTLJRoomModel.getOtherIsBaoFu();
            if(firstCards.length > 0){
                canChuPai = CDTLJRoomModel.checkSecondPlay(this.selectIds,firstCards);
            }else{
                canChuPai = CDTLJRoomModel.checkFirstPlay(this.selectIds, baofu);
            }
        }

        var canTishi = firstCards.length > 0;
        this.btn_tishi.setBright(canTishi);
        this.btn_tishi.setTouchEnabled(canTishi);


        this.btn_chupai.setBright(canChuPai);
        this.btn_chupai.setTouchEnabled(canChuPai);
    },

    update:function(dt){
        this.timeCount += dt;
        if(this.timeCount >= 1){
            this.timeCount = 0;
            this.updateClockNum();
        }
    },

    updateClockNum:function(){
        this.timeCount = 0;
        this.clock_num.setString(this.clockCount);
        if(this.clockCount > 0){
            this.clockCount--;
        }
    },
});

var CDTLJCDPLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(180);
        this.addChild(grayLayer);

        var label_tip = UICtor.cLabel("请抽取一张底牌",60);
        label_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 200);
        this.addChild(label_tip,1);

        var offsetX = cc.winSize.width/10;
        var startX = cc.winSize.width/2 - 3.5*offsetX;
        for(var i = 0;i<8;++i){
            var img = "res/pkCommon/cards/sdh_card_pai_bei.png";
            var btn = new ccui.Button(img,img);
            btn.setPosition(startX + offsetX*i,cc.winSize.height/2);
            btn.setScale(0.8);
            btn.flag = i;
            btn.addTouchEventListener(this.onClickBtn,this);
            this.addChild(btn);
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            sySocket.sendComReqMsg(3107,[sender.flag],[]);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

});