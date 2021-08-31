/**
 * Created by cyp on 2019/7/1.
 */
var YYBSOptBtnLayer = cc.Layer.extend({
    clockCount:0,
    timeCount:0,
    selectIds:null,
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("YYBS_Select_Card",this,this.onSelectCard);

        this.selectIds = [];

        this.initLayer();
        this.setBtnState(0);
    },

    handleTableData:function(type,data){
        if(type == YYBSTabelType.CreateTable){
            this.setBtnState(0);

            if(YYBSRoomModel.nextSeat == YYBSRoomModel.mySeat){
                if(YYBSRoomModel.remain == 3)this.setBtnState(2);
                else if(YYBSRoomModel.remain == 4)this.setBtnState(1);
                else if(YYBSRoomModel.remain == 10)this.setBtnState(3);

                this.checkBtnState();
            }

            this.setClockState();

            if(YYBSRoomModel.isSelectLiuShou()){
                this.setBtnState(0);
                this.hideClock();
            }

        }else if(type == YYBSTabelType.DealCard) {
            this.cleanSelectIds();
            this.setClockState();
        }else if(type == YYBSTabelType.JiaoFen){
            this.setClockState();
        }else if(type == YYBSTabelType.DingZhuang){
            this.cleanSelectIds();
            this.setClockState();
        }else if(type == YYBSTabelType.XuanZhu){
            this.cleanSelectIds();
            if(YYBSRoomModel.nextSeat == YYBSRoomModel.mySeat){
                this.setBtnState(2);
            }else{
                this.setBtnState(0);
            }
            this.setClockState();
        }else if(type == YYBSTabelType.PlayCard){
            this.setBtnState(0);
            this.hideClock();

            if(data.cardType == 100 && YYBSRoomModel.mySeat == data.seat){//埋牌消息
                this.setBtnState(3);
            }

            if(data.cardType  == 200){//抠底消息
                return;
            }


            if(data.seat == YYBSRoomModel.mySeat){
                this.cleanSelectIds();
            }else{
                this.checkBtnState();
            }

            var func = function(){
                this.setClockState();
                if (data.nextSeat == YYBSRoomModel.mySeat && YYBSRoomModel.remain == 4) {
                    this.setBtnState(1);
                }
                if(YYBSRoomModel.isSelectLiuShou()){//需要先选留守花色，先不显示出牌按钮
                    this.setBtnState(0);
                    this.hideClock();
                }
            }.bind(this);

            if(data.isClearDesk){//打完一轮，延时处理
                setTimeout(func,1500);
            }else{
                func();
            }
        }else if(type == YYBSTabelType.OnOver){
            this.setClockState();
        }else if(type == YYBSTabelType.XuanLiuShou){//选完留守花色，显示出牌操作按钮
            if (YYBSRoomModel.nextSeat == YYBSRoomModel.mySeat) {
                this.setClockState();
                this.setBtnState(1);
            }
        }else if(type == YYBSTabelType.TouXiang){
            if(YYBSRoomModel.mySeat == YYBSRoomModel.banker){
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
            if(YYBSRoomModel.nextSeat == YYBSRoomModel.mySeat){
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

        this.btn_tishi = new ccui.Button("res/res_yybs/ts.png","res/res_yybs/ts.png","res/res_yybs/ts1.png");
        this.btn_tishi.setPosition(-300,0);
        this.btn_tishi.setBright(false);
        this.btn_tishi.setTouchEnabled(false);
        this.contentNode.addChild(this.btn_tishi,1);

        this.btn_chupai = new ccui.Button("res/res_yybs/cp.png","res/res_yybs/cp.png");
        this.btn_chupai.setPosition(300,0);
        this.contentNode.addChild(this.btn_chupai,1);

        this.spr_clock = new cc.Sprite("res/res_yybs/naozhong.png");
        this.spr_clock.setPosition(this.contentNode.getPosition());
        this.addChild(this.spr_clock,1);

        this.clock_num = UICtor.cLabel("60",56);
        this.clock_num.setColor(cc.color(157,74,9));
        this.clock_num.setPosition(this.spr_clock.width/2 - 1,this.spr_clock.height/2 + 1);
        this.spr_clock.addChild(this.clock_num,1);

        this.btn_touxiang = new ccui.Button("res/res_yybs/tx.png","res/res_yybs/tx.png","");
        this.btn_touxiang.setPosition(-300,0);
        this.contentNode.addChild(this.btn_touxiang);

        this.btn_maipai = new ccui.Button("res/res_yybs/mp.png","res/res_yybs/mp.png","res/res_yybs/mp1.png");
        this.btn_maipai.setPosition(300,0);
        this.contentNode.addChild(this.btn_maipai);

        var img = "res/res_yybs/btn_yds.png";
        this.btn_yds = new ccui.Button(img,img);
        this.btn_yds.addTouchEventListener(this.onClickBtn,this);
        this.btn_yds.setPosition(-300,0);
        this.contentNode.addChild(this.btn_yds,1);

        var img = "res/res_yybs/btn_zdy.png";
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
            var p = YYBSRoomModel.getPlayerDataByItem("seat",YYBSRoomModel.mySeat);
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
        if(YYBSRoomModel.nextSeat != YYBSRoomModel.mySeat){
            isShow = YYBSRoomModel.remain > 0 && YYBSRoomModel.remain < 5;
        }else if(YYBSRoomModel.remain == 3 || YYBSRoomModel.remain == 4){
            isShow = true;
        }
        if(YYBSRoomModel.remain == 10){
            isShow = true;
        }

        //抢庄不显示
        if(YYBSRoomModel.remain == 1 && YYBSRoomModel.qzCards.length == 0){
            isShow = false;
        }

        this.spr_clock.setVisible(isShow);
        if(isShow){
            this.clockCount = YYBSRoomModel.getCountTime();
            this.clock_num.setString(this.clockCount);
            var seq = YYBSRoomModel.getSeqWithSeat(YYBSRoomModel.nextSeat);

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
                YYBSRoomModel.sendPlayCardMsg(100,this.selectIds);
            }else if(sender == this.btn_chupai){
                YYBSRoomModel.sendPlayCardMsg(0,this.selectIds);
            }else if(sender == this.btn_touxiang){
                sySocket.sendComReqMsg(3105,[1]);
            }else if(sender == this.btn_tishi){
                SyEventManager.dispatchEvent("YYBS_TIP_CARD");
            }else if(sender == this.btn_yds){
                sySocket.sendComReqMsg(3106,[1]);
            }else if(sender == this.btn_zdy){
                sySocket.sendComReqMsg(3106,[2]);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onSelectCard:function(event){
        this.selectIds = event.getUserData();
        this.checkBtnState();
    },

    checkBtnState:function(){
        var canMaiPai = this.selectIds.length == YYBSRoomModel.getDiPaiNum();
        this.btn_maipai.setBright(canMaiPai);
        this.btn_maipai.setTouchEnabled(canMaiPai);

        var canChuPai = this.selectIds.length > 0;
        var firstCards = YYBSRoomModel.getFirstCards();

        if(this.selectIds.length > 0){
            var baofu = YYBSRoomModel.getOtherIsBaoFu();
            if(firstCards.length > 0){
                canChuPai = YYBSRoomModel.checkSecondPlay(this.selectIds,firstCards);
            }else{
                canChuPai = YYBSRoomModel.checkFirstPlay(this.selectIds, baofu);
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