/**
 * Created by cyp on 2019/7/1.
 */
var SDHOptBtnLayer = cc.Layer.extend({
    clockCount:0,
    timeCount:0,
    selectIds:null,
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("SDH_Select_Card",this,this.onSelectCard);

        this.selectIds = [];

        this.initLayer();
        this.setBtnState(0);
    },

    handleTableData:function(type,data){
        if(type == SDHTabelType.CreateTable){
            this.setBtnState(0);

            if(SDHRoomModel.nextSeat == SDHRoomModel.mySeat){
                if(SDHRoomModel.remain == 3)this.setBtnState(2);
                else if(SDHRoomModel.remain == 4)this.setBtnState(1);

                this.checkBtnState();
            }

            this.setClockState();

            if(SDHRoomModel.isSelectLiuShou()){
                this.setBtnState(0);
                this.hideClock();
            }

        }else if(type == SDHTabelType.DealCard) {
            this.cleanSelectIds();
            this.setClockState();
        }else if(type == SDHTabelType.JiaoFen){
            this.setClockState();
        }else if(type == SDHTabelType.DingZhuang){
            this.cleanSelectIds();
            this.setClockState();
        }else if(type == SDHTabelType.XuanZhu){
            this.cleanSelectIds();
            if(SDHRoomModel.nextSeat == SDHRoomModel.mySeat){
                this.setBtnState(2);
            }else{
                this.setBtnState(0);
            }
            this.setClockState();
        }else if(type == SDHTabelType.PlayCard){
            this.setBtnState(0);
            this.hideClock();

            if(data.cardType  == 200){//抠底消息
                return;
            }

            if(data.seat == SDHRoomModel.mySeat){
                this.cleanSelectIds();
            }else{
                this.checkBtnState();
            }

            var func = function(){
                this.setClockState();
                if (data.nextSeat == SDHRoomModel.mySeat && SDHRoomModel.remain == 4) {
                    this.setBtnState(1);
                }
                if(SDHRoomModel.isSelectLiuShou()){//需要先选留守花色，先不显示出牌按钮
                    this.setBtnState(0);
                    this.hideClock();
                }
            }.bind(this);

            if(data.isClearDesk){//打完一轮，延时处理
                setTimeout(func,1500);
            }else{
                func();
            }
        }else if(type == SDHTabelType.OnOver){
            this.setClockState();
        }else if(type == SDHTabelType.XuanLiuShou){//选完留守花色，显示出牌操作按钮
            if (SDHRoomModel.nextSeat == SDHRoomModel.mySeat) {
                this.setClockState();
                this.setBtnState(1);
            }
        }else if(type == SDHTabelType.TouXiang){
            if(SDHRoomModel.mySeat == SDHRoomModel.banker){
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

        this.btn_tishi = new ccui.Button("res/res_sdh/ts.png","res/res_sdh/ts.png","res/res_sdh/ts1.png");
        this.btn_tishi.setPosition(-300,0);
        this.btn_tishi.setBright(false);
        this.btn_tishi.setTouchEnabled(false);
        this.contentNode.addChild(this.btn_tishi,1);

        this.btn_chupai = new ccui.Button("res/res_sdh/cp.png","res/res_sdh/cp.png");
        this.btn_chupai.setPosition(300,0);
        this.contentNode.addChild(this.btn_chupai,1);

        this.spr_clock = new cc.Sprite("res/res_sdh/naozhong.png");
        this.spr_clock.setPosition(this.contentNode.getPosition());
        this.addChild(this.spr_clock,1);

        this.clock_num = UICtor.cLabel("60",56);
        this.clock_num.setColor(cc.color(157,74,9));
        this.clock_num.setPosition(this.spr_clock.width/2 - 1,this.spr_clock.height/2 + 1);
        this.spr_clock.addChild(this.clock_num,1);

        this.btn_touxiang = new ccui.Button("res/res_sdh/tx.png","res/res_sdh/tx.png","");
        this.btn_touxiang.setPosition(-300,0);
        this.contentNode.addChild(this.btn_touxiang);

        this.btn_maipai = new ccui.Button("res/res_sdh/mp.png","res/res_sdh/mp.png","res/res_sdh/mp1.png");
        this.btn_maipai.setPosition(300,0);
        this.contentNode.addChild(this.btn_maipai);

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
        this.btn_touxiang.setVisible(type == 2);

        if(type == 2){
            var p = SDHRoomModel.getPlayerDataByItem("seat",SDHRoomModel.mySeat);
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
        if(SDHRoomModel.nextSeat != SDHRoomModel.mySeat){
            isShow = SDHRoomModel.remain > 0 && SDHRoomModel.remain < 5;
        }else if(SDHRoomModel.remain == 3 || SDHRoomModel.remain == 4){
            isShow = true;
        }

        this.spr_clock.setVisible(isShow);
        if(isShow){
            this.clockCount = SDHRoomModel.getCountTime();
            this.clock_num.setString(this.clockCount);
            var seq = SDHRoomModel.getSeqWithSeat(SDHRoomModel.nextSeat);

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
                SDHRoomModel.sendPlayCardMsg(100,this.selectIds);
            }else if(sender == this.btn_chupai){
                SDHRoomModel.sendPlayCardMsg(0,this.selectIds);
            }else if(sender == this.btn_touxiang){
                sySocket.sendComReqMsg(3105,[1]);
            }else if(sender == this.btn_tishi){
                SyEventManager.dispatchEvent("SDH_TIP_CARD");
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
        var canMaiPai = this.selectIds.length == SDHRoomModel.getDiPaiNum();
        this.btn_maipai.setBright(canMaiPai);
        this.btn_maipai.setTouchEnabled(canMaiPai);

        var canChuPai = this.selectIds.length > 0;
        var firstCards = SDHRoomModel.getFirstCards();

        if(this.selectIds.length > 0){
            var baofu = SDHRoomModel.getOtherIsBaoFu();
            if(firstCards.length > 0){
                canChuPai = SDHRoomModel.checkSecondPlay(this.selectIds,firstCards);
            }else{
                canChuPai = SDHRoomModel.checkFirstPlay(this.selectIds, baofu);
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