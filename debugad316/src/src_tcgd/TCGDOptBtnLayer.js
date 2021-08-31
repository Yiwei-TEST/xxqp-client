/**
 * Created by cyp on 2019/11/13.
 */
var TCGDOptBtnLayer = cc.Layer.extend({
    clockCount:0,
    timeCount:0,
    selectIds:null,
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("TCGD_Select_Card",this,this.onSelectCard);

        this.selectIds = [];

        this.initLayer();
        this.setBtnState(0);
        this.hideClock();
    },

    handleTableData:function(type,data){
        if(type == TCGDTabelType.CreateTable){
            this.setBtnState(0);
            this.showNoDaTip(false);
            if(TCGDRoomModel.nextSeat == TCGDRoomModel.mySeat){
                if(TCGDRoomModel.remain == 2){
                    this.setBtnState(1);

                    var deskCards = TCGDRoomModel.getDeskCards();
                    if(deskCards){
                        var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
                        var tipCards = TCGDRoomModel.getTipCardsData(deskCards, p.handCardIds);
                        if(tipCards.length == 0){
                            this.setBtnState(3);
                            this.showNoDaTip(true);
                        }
                    }

                }
            }

            this.cleanSelectIds();

            this.setClockState(true);

        }else if(type == TCGDTabelType.DealCard) {
            this.cleanSelectIds();

        }else if(type == TCGDTabelType.ShowHong3){
            if (TCGDRoomModel.nextSeat == TCGDRoomModel.mySeat) {
                if (TCGDRoomModel.remain == 2)this.setBtnState(1);
            }
            this.setClockState();
        }else if(type == TCGDTabelType.FenZu){

            if (TCGDRoomModel.nextSeat == TCGDRoomModel.mySeat) {
                this.setBtnState(1);
            }
            this.setClockState();

        }else if(type == TCGDTabelType.PlayCard){
            this.setBtnState(0);
            this.hideClock();
            this.showNoDaTip(false);

            if(data.seat == TCGDRoomModel.mySeat){
                if(data.cardType == 0){
                    this.cleanSelectIds();
                }
            }else{
                this.checkBtnState();
            }

            var func = function(){
                if (data.nextSeat == TCGDRoomModel.mySeat && TCGDRoomModel.remain == 2) {
                    this.setBtnState(1);

                    var deskCards = TCGDRoomModel.getDeskCards();
                    if(deskCards){
                        var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
                        var tipCards = TCGDRoomModel.getTipCardsData(deskCards, p.handCardIds);
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
        }else if(type == TCGDTabelType.OnOver){
            this.setClockState();

        }else if(type == TCGDTabelType.SwitchSeat){
            this.setBtnState(0);
            this.showNoDaTip(false);
            if(TCGDRoomModel.nextSeat == TCGDRoomModel.mySeat && TCGDRoomModel.remain == 2){
                this.setBtnState(1);
            }

            this.cleanSelectIds();
            this.setClockState();
        }
    },

    showNoDaTip:function(isShow){
        if(isShow){
            if(!this.nodaSpr){
                this.nodaSpr = new cc.Scale9Sprite("res/res_tcgd/jiugonga1.png");
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

        this.btn_buyao = new ccui.Button("res/res_tcgd/passBtn.png","res/res_tcgd/passBtn.png");
        this.btn_buyao.setPosition(-300,0);
        this.contentNode.addChild(this.btn_buyao,1);

        this.btn_tishi = new ccui.Button("res/res_tcgd/tipBtn.png","res/res_tcgd/tipBtn.png","");
        this.btn_tishi.setPosition(0,0);
        this.contentNode.addChild(this.btn_tishi,1);

        this.btn_chupai = new ccui.Button("res/res_tcgd/outBtn.png","res/res_tcgd/outBtn.png");
        this.btn_chupai.setPosition(300,0);
        this.contentNode.addChild(this.btn_chupai,1);

        this.spr_clock = new cc.Sprite("res/res_tcgd/naozhong.png");
        this.spr_clock.setPosition(cc.winSize.width/2 - 525,600);
        this.addChild(this.spr_clock,1);

        this.clock_num = UICtor.cLabel("60",56);
        this.clock_num.setColor(cc.color(157,74,9));
        this.clock_num.setPosition(this.spr_clock.width/2 - 1,this.spr_clock.height/2 + 1);
        this.clock_num.setScale(0.9);
        this.spr_clock.addChild(this.clock_num,1);

        this.btn_duzhan = new ccui.Button("res/res_tcgd/duzhan_n.png","res/res_tcgd/duzhan_n.png","");
        this.btn_duzhan.setPosition(-300,0);
        this.contentNode.addChild(this.btn_duzhan);

        this.btn_fangqi = new ccui.Button("res/res_tcgd/fangqi_n.png","res/res_tcgd/fangqi_n.png","");
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

    setClockState:function(isCreateMsg){
        var isShow = TCGDRoomModel.remain > 0 && TCGDRoomModel.remain < 3;

        this.spr_clock.setVisible(isShow);
        if(isShow){
            this.clockCount = TCGDRoomModel.getCountTime(isCreateMsg);
            this.clock_num.setString(this.clockCount);
            var seq = TCGDRoomModel.getSeqWithSeat(TCGDRoomModel.nextSeat);

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

            }else if(sender == this.btn_chupai || sender == this.btn_feiji || sender == this.btn_liandui){
                if(sender == this.btn_chupai && this.btn_chupai.xuanZe){
                    this.showXuanBtn(true);
                }else{
                    TCGDRoomModel.sendPlayCardMsg(sender.flag + 10,this.selectIds);
                }
            }else if(sender == this.btn_duzhan){
                sySocket.sendComReqMsg(4100,[1]);
            }else if(sender == this.btn_tishi){
                SyEventManager.dispatchEvent("TCGD_TIP_CARD");
            }else if(sender == this.btn_buyao){
                TCGDRoomModel.sendPlayCardMsg(1,[]);
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

        var deskCards = TCGDRoomModel.getDeskCards();

        var isFirst = !!deskCards;

        this.btn_buyao.setBright(isFirst);
        this.btn_buyao.setTouchEnabled(isFirst);

        this.btn_tishi.setBright(isFirst);
        this.btn_tishi.setTouchEnabled(isFirst);

        var typeData2 = TCGDRoomModel.getCardTypeData(this.selectIds);
        var canChuPai = typeData2.type > 0;

        this.btn_chupai.xuanZe = false;
        this.showXuanBtn(false);

        var typeData1 = null;
        if(deskCards){
            typeData1 = TCGDRoomModel.getCardTypeData(deskCards);
            var deskType = TCGDRoomModel.getDeskCardsType();
            TCGDRoomModel.lianDuiOrFeiji(typeData1,deskType);
            TCGDRoomModel.lianDuiOrFeiji(typeData2,deskType);

            canChuPai = TCGDRoomModel.isCardTypeBig(typeData1,typeData2);
        }else if(TCGDRoomModel.lianDuiOrFeiji(typeData2)){
            this.btn_chupai.xuanZe = true;
        }

        //红2不可单出
        if(TCGDRoomModel.intParams[11] == 1){
            var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
            if(p.handCardIds.length > this.selectIds.length){
                if(typeData2.type == TCGDCardType.DanZhang && this.selectIds[0] == 315)canChuPai = false;
                if(typeData2.type == TCGDCardType.DuiZi && this.selectIds[0] == 315 && this.selectIds[1] == 315)canChuPai = false;
            }
        }

        this.btn_chupai.setBright(canChuPai);
        this.btn_chupai.setTouchEnabled(canChuPai);
        this.btn_chupai.flag = typeData2.type;
    },

    showXuanBtn:function(isShow){
        if(isShow){
            if(!this.btn_feiji){
                var img = "res/res_tcgd/btn_feiji.png";
                this.btn_feiji = ccui.Button(img,img,"");
                this.btn_feiji.setPosition(this.btn_chupai.width/2,this.btn_chupai.height + 75);
                this.btn_feiji.setScale(0.8);
                this.btn_feiji.addTouchEventListener(this.onClickBtn,this);
                this.btn_chupai.addChild(this.btn_feiji,1);

                var img = "res/res_tcgd/btn_liandui.png";
                this.btn_liandui = ccui.Button(img,img,"");
                this.btn_liandui.setPosition(this.btn_chupai.width/2,-75);
                this.btn_liandui.setScale(0.8);
                this.btn_liandui.addTouchEventListener(this.onClickBtn,this);
                this.btn_chupai.addChild(this.btn_liandui,1);

                this.btn_feiji.flag = TCGDCardType.FeiJi;
                this.btn_liandui.flag = TCGDCardType.LianDui;
            }
        }else{
            this.btn_feiji && this.btn_feiji.removeFromParent(true);
            this.btn_liandui && this.btn_liandui.removeFromParent(true);
            this.btn_feiji = this.btn_liandui = null;
        }
    },

    update:function(dt){
        this.timeCount += dt;
        if(this.timeCount >= 1){
            this.timeCount = 0;
            this.updateClockNum();
            this.showCountTip(this.clockCount);
        }
    },

    updateClockNum:function(){
        this.timeCount = 0;
        this.clock_num.setString(this.clockCount);
        if(this.clockCount > 0){
            this.clockCount--;
        }
    },

    showCountTip:function(count){

        var isShow = false;
        var time = TCGDRoomModel.timeOut[0]/1000;

        if(count > 0 && count < time/2 && TCGDRoomModel.remain > 0){
            isShow = true;
        }

        if(isShow){
            if(!this.tipLayer){
                var str = "托管倒计时过半,如果进入托管将解散房间,托管玩家给其他玩家每人1分,请理解并耐心等待";
                this.tipLayer = new cc.Scale9Sprite("res/ui/bjdmj/popup/phoneLogin/kuang1.png");
                this.tipLayer.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 180);
                this.tipLayer.setContentSize(800,150);
                this.addChild(this.tipLayer,1);

                var label = ccui.Text(str,"res/font/bjdmj/fzcy.TTF",36);
                label.setTextAreaSize(cc.size(this.tipLayer.width - 30,0));
                label.setPosition(this.tipLayer.width/2,this.tipLayer.height/2);
                this.tipLayer.addChild(label);
            }
        }else if(this.tipLayer){
            this.tipLayer.removeFromParent(true);
            this.tipLayer = null;
        }
    },
});