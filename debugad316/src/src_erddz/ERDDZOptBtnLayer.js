/**
 * Created by cyp on 2019/11/13.
 */
var ERDDZOptBtnLayer = cc.Layer.extend({
    clockCount:0,
    timeCount:0,
    selectIds:null,
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("ERDDZ_Select_Card",this,this.onSelectCard);

        this.selectIds = [];

        this.initLayer();
        this.setBtnState(0);
        this.hideClock();
    },

    handleTableData:function(type,data){
        if(type == ERDDZTabelType.CreateTable){
            this.setBtnState(0);
            this.showNoDaTip(false);
            if(ERDDZRoomModel.nextSeat == ERDDZRoomModel.mySeat){
                if(ERDDZRoomModel.remain == 2){
                    this.setBtnState(1);

                    var deskCards = ERDDZRoomModel.getDeskCards();
                    if(deskCards){
                        var p = ERDDZRoomModel.getPlayerDataByItem("seat",ERDDZRoomModel.mySeat);
                        var tipCards = ERDDZRoomModel.getTipCardsData(deskCards, p.handCardIds);
                        if(tipCards.length == 0){
                            this.setBtnState(3);
                            this.showNoDaTip(true);
                        }
                    }

                }else if(ERDDZRoomModel.remain == 3){
                    this.setBtnState(2);
                }else if(ERDDZRoomModel.remain == 4){
                    this.setBtnState(4);
                }else if(ERDDZRoomModel.remain == 5){
                    this.setBtnState(5);
                }else if(ERDDZRoomModel.remain == 6){
                    this.showRangBtn(true);
                }
            }

            this.cleanSelectIds();

            this.setClockState();

        }else if(type == ERDDZTabelType.DealCard) {
            this.cleanSelectIds();
            this.setBtnState(0);
            if (ERDDZRoomModel.nextSeat == ERDDZRoomModel.mySeat) {
                if (ERDDZRoomModel.remain == 3){
                    this.setBtnState(2);
                }
            }

            this.setClockState();
        }else if(type == ERDDZTabelType.FenZu){

            if (ERDDZRoomModel.nextSeat == ERDDZRoomModel.mySeat) {
                this.setBtnState(1);
            }
            this.setClockState();

        }else if(type == ERDDZTabelType.PlayCard){
            this.setBtnState(0);
            this.hideClock();
            this.showNoDaTip(false);

            if(data.seat == ERDDZRoomModel.mySeat){
                if(data.cardType == 0){
                    this.cleanSelectIds();
                }
            }else{
                this.checkBtnState();
            }

            var func = function(){
                if (data.nextSeat == ERDDZRoomModel.mySeat && ERDDZRoomModel.remain == 2) {
                    this.setBtnState(1);

                    var deskCards = ERDDZRoomModel.getDeskCards();
                    if(deskCards){
                        var p = ERDDZRoomModel.getPlayerDataByItem("seat",ERDDZRoomModel.mySeat);
                        var tipCards = ERDDZRoomModel.getTipCardsData(deskCards, p.handCardIds);
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
        }else if(type == ERDDZTabelType.OnOver){
            this.setClockState();
            this.setBtnState(0);
        }else if(type == ERDDZTabelType.JiaoDiZhu
            || type == ERDDZTabelType.QiangDiZhu
            || type == ERDDZTabelType.SureDiZhu
            || type == ERDDZTabelType.JiaBei
            || type == ERDDZTabelType.RangPai){
            this.setBtnState(0);
            if(ERDDZRoomModel.nextSeat == ERDDZRoomModel.mySeat){
                if(ERDDZRoomModel.remain == 2){
                    this.setBtnState(1);
                }else if(ERDDZRoomModel.remain == 3){
                    this.setBtnState(2);
                }else if(ERDDZRoomModel.remain == 4){
                    this.setBtnState(4);
                }else if(ERDDZRoomModel.remain == 5){
                    this.setBtnState(5);
                }else if(ERDDZRoomModel.remain == 6){
                    this.showRangBtn(true);
                }
            }

            this.setClockState();
        }
    },

    showNoDaTip:function(isShow){
        if(isShow){
            if(!this.nodaSpr){
                this.nodaSpr = new cc.Scale9Sprite("res/res_erddz/jiugonga1.png");
                this.nodaSpr.setContentSize(375,60);
                this.nodaSpr.setPosition(cc.winSize.width/2,400);
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
        this.contentNode.setPosition(cc.winSize.width/2,480);
        this.addChild(this.contentNode);
        //this.contentNode.setVisible(false);

        this.btn_buyao = new ccui.Button("res/res_erddz/passBtn.png","res/res_erddz/passBtn.png");
        this.btn_buyao.setPosition(-300,0);
        this.contentNode.addChild(this.btn_buyao,1);

        this.btn_tishi = new ccui.Button("res/res_erddz/tipBtn.png","res/res_erddz/tipBtn.png","");
        this.btn_tishi.setPosition(0,0);
        this.contentNode.addChild(this.btn_tishi,1);

        this.btn_chupai = new ccui.Button("res/res_erddz/outBtn.png","res/res_erddz/outBtn.png");
        this.btn_chupai.setPosition(300,0);
        this.contentNode.addChild(this.btn_chupai,1);

        this.spr_clock = new cc.Sprite("res/res_erddz/naozhong.png");
        this.spr_clock.setPosition(cc.winSize.width/2 - 525,this.contentNode.y);
        this.addChild(this.spr_clock,1);

        this.clock_num = UICtor.cLabel("60",56);
        this.clock_num.setColor(cc.color(157,74,9));
        this.clock_num.setPosition(this.spr_clock.width/2 - 1,this.spr_clock.height/2 + 1);
        this.clock_num.setScale(0.9);
        this.spr_clock.addChild(this.clock_num,1);

        var img = "res/res_erddz/btn_jiaodizhu.png";
        this.btn_jiaodizhu = new ccui.Button(img,img,"");
        this.btn_jiaodizhu.setPosition(300,0);
        this.contentNode.addChild(this.btn_jiaodizhu);

        img = "res/res_erddz/btn_bujiao.png";
        this.btn_bujiao = new ccui.Button(img,img,"");
        this.btn_bujiao.setPosition(-300,0);
        this.contentNode.addChild(this.btn_bujiao);

        img = "res/res_erddz/btn_qiangdizhu.png";
        this.btn_qiangdizhu = new ccui.Button(img,img);
        this.btn_qiangdizhu.setPosition(300,0);
        this.contentNode.addChild(this.btn_qiangdizhu);

        img = "res/res_erddz/btn_buqiang.png";
        this.btn_buqiang = new ccui.Button(img,img,"");
        this.btn_buqiang.setPosition(-300,0);
        this.contentNode.addChild(this.btn_buqiang);

        img = "res/res_erddz/btn_jiabei.png";
        this.btn_jiabei = new ccui.Button(img,img,"");
        this.btn_jiabei.setPosition(300,0);
        this.contentNode.addChild(this.btn_jiabei);

        img = "res/res_erddz/btn_bujiabei.png";
        this.btn_bujiabei = new ccui.Button(img,img,"");
        this.btn_bujiabei.setPosition(-300,0);
        this.contentNode.addChild(this.btn_bujiabei);

        this.btn_buyao.addTouchEventListener(this.onClickBtn,this);
        this.btn_tishi.addTouchEventListener(this.onClickBtn,this);
        this.btn_chupai.addTouchEventListener(this.onClickBtn,this);
        this.btn_jiaodizhu.addTouchEventListener(this.onClickBtn,this);
        this.btn_bujiao.addTouchEventListener(this.onClickBtn,this);
        this.btn_qiangdizhu.addTouchEventListener(this.onClickBtn,this);
        this.btn_buqiang.addTouchEventListener(this.onClickBtn,this);
        this.btn_jiabei.addTouchEventListener(this.onClickBtn,this);
        this.btn_bujiabei.addTouchEventListener(this.onClickBtn,this);

        this.clockCount = 0;
        this.updateClockNum();
        this.scheduleUpdate();
    },

    setBtnState:function(type){
        this.showType  = type;

        this.btn_buyao.setVisible(type == 1 || type == 3);
        this.btn_tishi.setVisible(type == 1);
        this.btn_chupai.setVisible(type == 1);
        this.btn_jiaodizhu.setVisible(type == 2);
        this.btn_bujiao.setVisible(type == 2);
        this.btn_qiangdizhu.setVisible(type == 4);
        this.btn_buqiang.setVisible(type == 4);
        this.btn_jiabei.setVisible(type == 5);
        this.btn_bujiabei.setVisible(type == 5);

        if(type == 0){
            this.showRangBtn(false);
        }

        if(type == 3){
            this.btn_buyao.setPositionX(0);
        }else{
            this.btn_buyao.setPositionX(-300);
        }
    },

    showRangBtn:function(isShow){
        var num = ERDDZRoomModel.intParams[4] || 0;
        if(this.rangBtnNode){
            this.rangBtnNode.removeFromParent(true);
            this.rangBtnNode = null;
        }
        if(!isShow || num <= 0)return;

        this.showType = 6;

        this.rangBtnNode = new cc.Node();
        this.contentNode.addChild(this.rangBtnNode);

        var offSetX = 330;
        var clockWidth = 180;
        var allWidth = num*offSetX + clockWidth;
        var startX = (offSetX-allWidth)/2;
        this.rangClcPosX = startX + (clockWidth + offSetX)/2;
        for(var i = 0;i<=num;++i){
            if(i == 1){
                startX += clockWidth;
                continue;
            }

            var img = "res/res_erddz/btn_rang_" + i + ".png";
            var btn = new ccui.Button(img,img,"");
            btn.setPosition(startX,0);
            btn.setTag(i);
            btn.addTouchEventListener(this.onClickRangPai,this);
            this.rangBtnNode.addChild(btn);

            startX += offSetX;
        }

    },

    hideClock:function(){
        this.spr_clock.setVisible(false);
    },

    setClockState:function(){
        var isShow = ERDDZRoomModel.remain > 0 && ERDDZRoomModel.remain <= 6;

        if(ERDDZRoomModel.nextSeat == 0){
            isShow = false;
        }

        this.spr_clock.setVisible(isShow);
        if(isShow){
            this.clockCount = ERDDZRoomModel.getCountTime();
            this.clock_num.setString(this.clockCount);
            var seq = ERDDZRoomModel.getSeqWithSeat(ERDDZRoomModel.nextSeat);

            var pos = cc.p(cc.winSize.width/2 - 525,this.contentNode.y);
            if(this.showType == 2){
                pos = cc.p(cc.winSize.width/2,this.contentNode.y);
            }else if(this.showType == 3){
                pos = cc.p(cc.winSize.width/2 - 300,this.contentNode.y);
            }else if(this.showType == 6){
                pos = cc.p(cc.winSize.width/2 + this.rangClcPosX,this.contentNode.y);
            }else if(this.showType == 4 || this.showType == 5){
                pos.x = cc.winSize.width/2;
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

            if(sender == this.btn_bujiao){
                sySocket.sendComReqMsg(4140,[0]);

            }else if(sender == this.btn_chupai){
                ERDDZRoomModel.sendPlayCardMsg(0,this.selectIds);
            }else if(sender == this.btn_jiaodizhu){
                sySocket.sendComReqMsg(4140,[1]);

            }else if(sender == this.btn_tishi){
                SyEventManager.dispatchEvent("ERDDZ_TIP_CARD");
            }else if(sender == this.btn_buyao){
                ERDDZRoomModel.sendPlayCardMsg(1,[]);
            }else if(sender == this.btn_qiangdizhu){
                sySocket.sendComReqMsg(4141,[1]);
            }else if(sender == this.btn_buqiang){
                sySocket.sendComReqMsg(4141,[0]);
            }else if(sender == this.btn_jiabei){
                sySocket.sendComReqMsg(4144,[2]);
            }else if(sender == this.btn_bujiabei){
                sySocket.sendComReqMsg(4144,[1]);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickRangPai:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            var tag = sender.getTag();
            sySocket.sendComReqMsg(4143,[tag]);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onSelectCard:function(event){
        this.selectIds = event.getUserData();
        this.checkBtnState();
    },

    checkBtnState:function(){

        var deskCards = ERDDZRoomModel.getDeskCards();

        var isFirst = !!deskCards;

        this.btn_buyao.setBright(isFirst);
        this.btn_buyao.setTouchEnabled(isFirst);

        this.btn_tishi.setBright(isFirst);
        this.btn_tishi.setTouchEnabled(isFirst);

        var typeData2 = ERDDZRoomModel.getCardTypeData(this.selectIds);
        var canChuPai = typeData2.type > 0;

        var typeData1 = null;
        if(deskCards){
            typeData1 = ERDDZRoomModel.getCardTypeData(deskCards);
            canChuPai = ERDDZRoomModel.isCardTypeBig(typeData1,typeData2);
        }

        if(ERDDZRoomModel.intParams[5] != 1
            && (typeData2.type == ERDDZCardType.SanZhang || typeData2.type == ERDDZCardType.FeiJi)){
            canChuPai = false;
        }
        if(ERDDZRoomModel.intParams[6] != 1){
            if(typeData2.type == ERDDZCardType.SanDaiDui)canChuPai = false;
            if(typeData2.type == ERDDZCardType.FeiJiDCB && typeData2.daiNum == typeData2.flag*2)canChuPai = false;
        }
        if((ERDDZRoomModel.intParams[8] != 1) && typeData2.type == ERDDZCardType.SiDaiEr){
            canChuPai = false;
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