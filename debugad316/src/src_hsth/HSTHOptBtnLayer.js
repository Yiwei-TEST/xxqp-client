/**
 * Created by cyp on 2019/11/13.
 */
var HSTHOptBtnLayer = cc.Layer.extend({
    clockCount:0,
    timeCount:0,
    selectIds:null,
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("HSTH_Select_Card",this,this.onSelectCard);

        this.selectIds = [];

        this.initLayer();
        this.setBtnState(0);
        this.hideClock();
    },

    handleTableData:function(type,data){
        if(type == HSTHTabelType.CreateTable){
            this.setBtnState(0);
            this.showNoDaTip(false);
            if(HSTHRoomModel.nextSeat == HSTHRoomModel.mySeat){
                if(HSTHRoomModel.remain == 2){
                    this.setBtnState(1);

                    var deskCards = HSTHRoomModel.getDeskCards();
                    if(deskCards){
                        var p = HSTHRoomModel.getPlayerDataByItem("seat",HSTHRoomModel.mySeat);
                        var tipCards = HSTHRoomModel.getTipCardsData(deskCards, p.handCardIds);
                        if(tipCards.length == 0){
                            this.setBtnState(3);
                            this.showNoDaTip(true);
                        }
                    }

                }
            }

            this.cleanSelectIds();

            this.setClockState();

        }else if(type == HSTHTabelType.DealCard) {
            this.cleanSelectIds();

            if (HSTHRoomModel.nextSeat == HSTHRoomModel.mySeat) {
                if (HSTHRoomModel.remain == 2)this.setBtnState(1);
            }

            this.setClockState();
        }else if(type == HSTHTabelType.FenZu){

            if (HSTHRoomModel.nextSeat == HSTHRoomModel.mySeat) {
                this.setBtnState(1);
            }
            this.setClockState();

        }else if(type == HSTHTabelType.PlayCard){
            this.setBtnState(0);
            this.hideClock();
            this.showNoDaTip(false);

            if(data.seat == HSTHRoomModel.mySeat){
                if(data.cardType == 0){
                    this.cleanSelectIds();
                }
            }else{
                this.checkBtnState();
            }

            var func = function(){
                if (data.nextSeat == HSTHRoomModel.mySeat && HSTHRoomModel.remain == 2) {
                    this.setBtnState(1);

                    var deskCards = HSTHRoomModel.getDeskCards();
                    if(deskCards){
                        var p = HSTHRoomModel.getPlayerDataByItem("seat",HSTHRoomModel.mySeat);
                        var tipCards = HSTHRoomModel.getTipCardsData(deskCards, p.handCardIds);
                        if(tipCards.length == 0){
                            this.setBtnState(3);
                            this.showNoDaTip(true);
                        }
                    }
                }
                this.setClockState();
            }.bind(this);

            if(data.isClearDesk){//打完一轮，延时处理
                setTimeout(func,300);
            }else{
                func();
            }
        }else if(type == HSTHTabelType.OnOver){
            this.setClockState();
            this.setBtnState(0);
        }
    },

    showNoDaTip:function(isShow){
        if(isShow){
            if(!this.nodaSpr){
                this.nodaSpr = new cc.Scale9Sprite("res/res_hsth/jiugonga1.png");
                this.nodaSpr.setContentSize(375,60);
                this.nodaSpr.setPosition(cc.winSize.width/2,340);
                this.addChild(this.nodaSpr);

                var label = UICtor.cLabel("没有比上家大的牌",42);
                label.setColor(cc.color.YELLOW);
                label.setPosition(this.nodaSpr.width/2,this.nodaSpr.height/2);
                this.nodaSpr.addChild(label);
            }
            this.nodaSpr.setVisible(true);
        }else{
            this.nodaSpr && this.nodaSpr.setVisible(false);
        }
    },

    cleanSelectIds:function(){
        this.selectIds = [];
        this.checkBtnState();
    },

    initLayer:function(){
        this.contentNode = new cc.Node();
        this.contentNode.setPosition(cc.winSize.width/2,600);
        this.addChild(this.contentNode);
        //this.contentNode.setVisible(false);

        this.btn_buyao = new ccui.Button("res/res_hsth/passBtn.png","res/res_hsth/passBtn.png");
        this.btn_buyao.setPosition(-300,0);
        this.contentNode.addChild(this.btn_buyao,1);

        this.btn_tishi = new ccui.Button("res/res_hsth/tipBtn.png","res/res_hsth/tipBtn.png","");
        this.btn_tishi.setPosition(0,0);
        this.contentNode.addChild(this.btn_tishi,1);

        this.btn_chupai = new ccui.Button("res/res_hsth/outBtn.png","res/res_hsth/outBtn.png");
        this.btn_chupai.setPosition(300,0);
        this.contentNode.addChild(this.btn_chupai,1);

        this.spr_clock = new cc.Sprite("res/res_hsth/naozhong.png");
        this.spr_clock.setPosition(cc.winSize.width/2 - 525,600);
        this.addChild(this.spr_clock,1);

        this.clock_num = UICtor.cLabel("60",56);
        this.clock_num.setColor(cc.color(157,74,9));
        this.clock_num.setPosition(this.spr_clock.width/2 - 1,this.spr_clock.height/2 + 1);
        this.clock_num.setScale(0.9);
        this.spr_clock.addChild(this.clock_num,1);

        this.btn_duzhan = new ccui.Button("res/res_hsth/duzhan_n.png","res/res_hsth/duzhan_n.png","");
        this.btn_duzhan.setPosition(-300,0);
        this.contentNode.addChild(this.btn_duzhan);

        this.btn_fangqi = new ccui.Button("res/res_hsth/fangqi_n.png","res/res_hsth/fangqi_n.png","");
        this.btn_fangqi.setPosition(300,0);
        this.contentNode.addChild(this.btn_fangqi);

        this.btn_buyao.addTouchEventListener(this.onClickBtn,this);
        this.btn_tishi.addTouchEventListener(this.onClickBtn,this);
        this.btn_chupai.addTouchEventListener(this.onClickBtn,this);
        this.btn_duzhan.addTouchEventListener(this.onClickBtn,this);
        this.btn_fangqi.addTouchEventListener(this.onClickBtn,this);

        this.clockCount = 0;
        this.updateClockNum();
        this.scheduleUpdate();
    },

    setBtnState:function(type){
        this.showType  = type;

        this.btn_buyao.setVisible(type == 1 || type == 3);
        this.btn_tishi.setVisible(type == 1);
        this.btn_chupai.setVisible(type == 1);
        this.btn_duzhan.setVisible(type == 2);
        this.btn_fangqi.setVisible(type == 2);

        if(type == 3){
            this.btn_buyao.setPositionX(0);
        }else{
            this.btn_buyao.setPositionX(-300);
        }
    },

    hideClock:function(){
        this.spr_clock.setVisible(false);
    },

    setClockState:function(){
        var isShow = HSTHRoomModel.remain > 0 && HSTHRoomModel.remain < 3;

        this.spr_clock.setVisible(isShow);
        if(isShow){
            this.clockCount = HSTHRoomModel.getCountTime();
            this.clock_num.setString(this.clockCount);
            var seq = HSTHRoomModel.getSeqWithSeat(HSTHRoomModel.nextSeat);

            var pos = cc.p(cc.winSize.width/2 - 525,600);
            if(this.showType == 2){
                pos = cc.p(cc.winSize.width/2,600);
            }else if(this.showType == 3){
                pos = cc.p(cc.winSize.width/2 - 300,600);
            }
            if(seq == 2){
                pos.x = cc.winSize.width - 390;
                pos.y = cc.winSize.height/2 + 150;
            }else if(seq == 3){
                pos.x = cc.winSize.width/2;
                pos.y = cc.winSize.height - 270;
            }else if(seq == 4){
                pos.x = 390;
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

            if(sender == this.btn_fangqi){
                sySocket.sendComReqMsg(4100,[0]);

            }else if(sender == this.btn_chupai){
                HSTHRoomModel.sendPlayCardMsg(0,this.selectIds);
            }else if(sender == this.btn_duzhan){
                sySocket.sendComReqMsg(4100,[1]);

            }else if(sender == this.btn_tishi){
                SyEventManager.dispatchEvent("HSTH_TIP_CARD");
            }else if(sender == this.btn_buyao){
                HSTHRoomModel.sendPlayCardMsg(1,[]);
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

        var deskCards = HSTHRoomModel.getDeskCards();

        var isFirst = !!deskCards;

        this.btn_buyao.setBright(isFirst);
        this.btn_buyao.setTouchEnabled(isFirst);

        this.btn_tishi.setBright(isFirst);
        this.btn_tishi.setTouchEnabled(isFirst);

        var typeData2 = HSTHRoomModel.getCardTypeData(this.selectIds);
        var canChuPai = typeData2.type > 0;

        var typeData1 = null;
        if(deskCards){
            typeData1 = HSTHRoomModel.getCardTypeData(deskCards);
            canChuPai = HSTHRoomModel.isCardTypeBig(typeData1,typeData2);
        }

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