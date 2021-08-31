/**
 * Created by cyp on 2019/11/13.
 */
var ERDDZRoomLayer = ERDDZBaseRoomLayer.extend({
    tableMsgArr:null,
    ctor:function(){
        this._super();

        this.tableMsgArr = [];
        this.diPaiNodeArr = [];

        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableData);
        this.addCustomEvent("XIPAI_CLEAR_NODE", this, this.clearXiPai);

        this.soundHandle = new ERDDZRoomSound();
        this.roomEffectHandle = new ERDDZRoomEffect();

        this.initLayer();
        this.addRoomTitle();
        this.addRoomLayer();
        this.addBottomBtn();
        this.addYuyinRecored();
        this.addRoomBtn();
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.scheduleUpdate();
    },

    initLayer:function(){
        var roomInfoBg = new cc.Scale9Sprite("res/res_erddz/jiugonga1.png");
        roomInfoBg.setAnchorPoint(0,1);
        roomInfoBg.setPosition(180,cc.winSize.height - 23);
        roomInfoBg.setContentSize(240,150);
        this.addChild(roomInfoBg);

        this.label_room_id = UICtor.cLabel("房号:123456",36);
        this.label_room_id.setAnchorPoint(0,0.5);
        this.label_room_id.setPosition(15,roomInfoBg.height - 30);
        roomInfoBg.addChild(this.label_room_id);

        this.label_jushu = UICtor.cLabel("局数:0/10",36);
        this.label_jushu.setAnchorPoint(0,0.5);
        this.label_jushu.setPosition(15,this.label_room_id.y - 45);
        roomInfoBg.addChild(this.label_jushu);

        this.label_room_name = UICtor.cLabel("二人斗地主",36);
        this.label_room_name.setAnchorPoint(0,0.5);
        this.label_room_name.setPosition(15,this.label_jushu.y - 45);
        roomInfoBg.addChild(this.label_room_name);

        this.label_rule_tip = new ccui.Text("","",40);
        this.label_rule_tip.setTextAreaSize(cc.size(1200,0));
        this.label_rule_tip.setFontName("res/font/bjdmj/fzcy.TTF");
        this.label_rule_tip.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_rule_tip.setOpacity(100);
        this.label_rule_tip.setColor(cc.color(0,0,0));
        this.label_rule_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 120);
        this.addChild(this.label_rule_tip);

        var tongji_bg = new cc.Sprite("res/res_erddz/tongji.png");
        tongji_bg.setPosition(cc.winSize.width - 360,cc.winSize.height - 90);
        this.addChild(tongji_bg);

        var label_txt1 = UICtor.cLabel("倍数:",36);
        label_txt1.setPosition(60,tongji_bg.height/2 + 30);
        tongji_bg.addChild(label_txt1);

        var label_txt2 = UICtor.cLabel("让牌:",36);
        label_txt2.setPosition(60,tongji_bg.height/2 - 30);
        tongji_bg.addChild(label_txt2);

        this.label_beishu = UICtor.cLabel("0",36);
        this.label_beishu.setPosition(tongji_bg.width/2 + 38,label_txt1.y);
        this.label_beishu.setColor(cc.color.YELLOW);
        tongji_bg.addChild(this.label_beishu);

        this.label_rangpai = UICtor.cLabel("0",36);
        this.label_rangpai.setPosition(tongji_bg.width/2 + 38,label_txt2.y);
        this.label_rangpai.setColor(cc.color.YELLOW);
        tongji_bg.addChild(this.label_rangpai);

        this.tip_bg = new cc.Scale9Sprite("res/res_erddz/jiugonga1.png");
        this.tip_bg.setContentSize(700,60);
        this.tip_bg.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 25);
        this.tip_bg.setVisible(false);
        this.addChild(this.tip_bg);

        this.label_tip = UICtor.cLabel("",40);
        this.label_tip.setPosition(this.tip_bg.width/2,this.tip_bg.height/2);
        this.label_tip.setColor(cc.color.YELLOW);
        this.tip_bg.addChild(this.label_tip);

        this.addCustomEvent(SyEvent.BISAI_XIPAI, this, this.NeedXipai);
    },

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/res_erddz/title_erddz.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 225);
        this.addChild(spr);
    },

    addBottomBtn:function(){

        var img = "res/res_erddz/huatong.png";
        this.btn_yuyin = new ccui.Button(img,img);
        this.btn_yuyin.setPosition(cc.winSize.width - 90,620);
        this.addChild(this.btn_yuyin);

        img = "res/res_erddz/liaotian.png";
        this.btn_chat = new ccui.Button(img,img);
        this.btn_chat.setPosition(this.btn_yuyin.x,460);
        this.addChild(this.btn_chat);

        this.btn_chat.setScale(0.8);
        this.btn_yuyin.setScale(0.8);

        this.btn_chat.addTouchEventListener(this.onClickBtn,this);
        this.btn_yuyin.addTouchEventListener(this.onClickBtn,this);

        if(BaseRoomModel.isBanVoiceAndProps()){
            this.btn_yuyin.setVisible(false);
        }
    },

    addRoomLayer:function(){
        this.addChild(this.playerLayer = new ERDDZPlayerLayer(),2);
        this.addChild(this.cardLayer = new ERDDZCardLayer(),1);
        this.addChild(this.optBtnLayer = new ERDDZOptBtnLayer(),10);
    },

    addRoomBtn:function(){
        var isQyqRoom = ERDDZRoomModel.tableType == 1;

        var img_wx = "res/res_erddz/btn_invite.png";
        if(isQyqRoom)img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";

        this.roomBtnContent = new cc.Node();
        this.roomBtnContent.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 120);
        this.addChild(this.roomBtnContent);

        var btnArr = [];

        this.btn_invite_wx = new ccui.Button(img_wx,img_wx);
        this.roomBtnContent.addChild(this.btn_invite_wx);
        btnArr.push(this.btn_invite_wx);

        if(isQyqRoom){
            if(ClickClubModel.getIsForbidInvite()){
                if(ERDDZRoomModel.privateRoom == 1){
                    img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
                }
                this.btn_invite_qyq = new ccui.Button(img_qyq,img_qyq);
                this.roomBtnContent.addChild(this.btn_invite_qyq);
                btnArr.push(this.btn_invite_qyq);
            }

            this.btn_qyq_back = new ccui.Button(img_back,img_back);
            this.roomBtnContent.addChild(this.btn_qyq_back);
            btnArr.push(this.btn_qyq_back);
        }

        var offsetX = 350;
        var startX = -(btnArr.length - 1)/2 * offsetX;
        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].setPosition(startX + offsetX*i,0);
            btnArr[i].addTouchEventListener(this.onClickBtn,this);
        }

        var img_ready = "res/res_erddz/btn_ready.png";
        this.btn_ready = new ccui.Button(img_ready,img_ready);
        this.btn_ready.setPosition(cc.winSize.width/2,225);
        this.addChild(this.btn_ready);
        this.btn_ready.addTouchEventListener(this.onClickBtn,this);

        //this.roomBtnContent.setVisible(false);
    },

    addYuyinRecored:function(){
        this.yuyinBg = new cc.Scale9Sprite("res/res_erddz/img_40.png");
        this.yuyinBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.yuyinBg.setContentSize(500,315);
        this.addChild(this.yuyinBg,100);

        var img1 = new cc.Sprite("res/res_erddz/img_39.png");
        img1.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 38);
        this.yuyinBg.addChild(img1);

        var progressBg = new cc.Sprite("res/res_erddz/img_audio_1.png");
        progressBg.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 38);
        this.yuyinBg.addChild(progressBg);

        var tipLabel = UICtor.cLabel("手指上滑取消发送",42);
        tipLabel.setPosition(this.yuyinBg.width/2,45);
        this.yuyinBg.addChild(tipLabel);

        this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
        this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/res_erddz/img_audio_2.png"));
        this.progCycle.x = progressBg.width/2;
        this.progCycle.y = progressBg.height/2;
        this.progCycle.setPercentage(0);
        progressBg.addChild(this.progCycle,1);
        this.recordBtn = new RecordAudioButton(this.yuyinBg,this.progCycle,"res/res_erddz/huatong.png","res/res_erddz/huatong.png");
        this.recordBtn.x = this.btn_yuyin.width/2;
        this.recordBtn.y = this.btn_yuyin.height/2;
        this.btn_yuyin.addChild(this.recordBtn,1);
        this.recordBtn.setBright(IMSdkUtil.isReady());

        this.yuyinBg.setVisible(false);
    },

    /**
     * sdk调用，当语音使用状态改变
     */
    onRadioReady:function(event){
        var useful = event.getUserData();
        this.recordBtn.setBright(useful);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_invite_wx){
                this.onInvite();
            }else if(sender == this.btn_invite_qyq){
                var inviteType = 0
                if(ERDDZRoomModel.privateRoom == 1) inviteType = 2
                var pop = new PyqInviteListPop(inviteType);
                this.addChild(pop);
            }else if(sender == this.btn_qyq_back){
                var pop = new PyqHall();
                pop.setBackBtnType(2);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_chat){
                // this.roomEffectHandle.showAni("baozhade",this,3);
                var pop = new ChatPop();
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_ready){
                sySocket.sendComReqMsg(4);
            }else if(sender == this.btn_leave){
                if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.isClientData){
                    CheckJoinModel.exitMatchRoom();
                }else{
                    sySocket.sendComReqMsg(6);
                }
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "二人斗地主";
        var queZi = ERDDZRoomModel.renshu + "缺"+(ERDDZRoomModel.renshu - ERDDZRoomModel.players.length);
        var obj={};
        obj.tableId=ERDDZRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+ERDDZRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+ERDDZRoomModel.tableId+"] "+queZi;

        var youxiName = "二人斗地主";
        if(ERDDZRoomModel.tableType == 1){
            youxiName = "[亲友圈]二人斗地主"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,ERDDZRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "ERDDZ_ROOM";
    },

    update:function(){
        if(ERDDZRoomModel.pauseValue == 0 && this.tableMsgArr.length > 0){
            var event = this.tableMsgArr.shift();
            this.handleTableData(event.eventType,event.getUserData());
        }
    },

    onGetTableData:function(event){
        this.tableMsgArr.push(event);
    },

    handleTableData:function(type,data){
        var date = new Date();
        cc.log("=============handleTableData=============",type,date.getSeconds(),date.getMilliseconds());
        var state = ERDDZRoomModel.handleTableData(type,data);
        if(!state)return;

        if(type == ERDDZTabelType.CreateTable){
            this.tableMsgArr = [];
            sy.scene.hideLoading();
            this.removeScoreLayer();
            this.updateRoomInfo();
            this.updateRoomBtnState();
            this.updateReadyBtnState();
            this.updateRoomTip();
            this.setRuleTip();

            this.setChatBtnOpacity();

            this.showDiPai(ERDDZRoomModel.remain>0?1:0);

            if(ERDDZRoomModel.nowBurCount == 1
                && ERDDZRoomModel.remain == 0 && !this.isShowGps){
                this.isShowGps = true;
                this.onClickGpsBtn();
            }

            if(ERDDZRoomModel.isMoneyRoom()){
                var isShow = ERDDZRoomModel.players.length < ERDDZRoomModel.renshu;
                this.moneyRoomShowLeaveBtn(isShow);
                this.moneyRoomShowWaitAni(isShow);
            }

        }else if(type == ERDDZTabelType.JoinTable){
            this.updateRoomBtnState();

            this.onClickGpsBtn();

        }else if(type == ERDDZTabelType.ExitTable){
            this.updateRoomBtnState();
        }else if(type == ERDDZTabelType.ChangeState){
            this.updateReadyBtnState();
        }else if(type == ERDDZTabelType.DealCard){
            this.updateRoomTip();
            this.showDiPai(1);

            var seq = ERDDZRoomModel.getSeqWithSeat(ERDDZRoomModel.nextSeat);
            if(data.dealDice > 0){
                this.showLiangZhang(data.dealDice,seq);
            }

            if(ERDDZRoomModel.isMoneyRoom()){
                this.moneyRoomShowTiket(true,ERDDZRoomModel.goldMsg[0],true);

                this.moneyRoomShowLeaveBtn(false);
                this.moneyRoomShowWaitAni(false);
            }

        }else if(type == ERDDZTabelType.PlayCard){
            this.updateRoomTip();

            if(data.curScore > 0){
                this.showChangeInfo("倍数x" + data.curScore);
            }

        }else if(type == ERDDZTabelType.OnOver){
            var SmallResultLayer = ERDDZRoomModel.getSamllResultLayer();
            if(data.isBreak){

            }else{
                var delay = 1000;
                if(ERDDZRoomModel.isMoneyRoom()){
                    if(data.closingPlayers[0].ext[3] == 1 || data.closingPlayers[0].ext[3] == 2){
                        delay = 3000;
                    }
                }
                setTimeout(function(){
                    if(ERDDZRoomModel.isMoneyRoom()){
                        var layer = new GoldResult_PK(data.closingPlayers,false,ERDDZRoomModel.tableId);
                    }else{
                        var layer = new SmallResultLayer(data);
                    }
                    PopupManager.addPopup(layer);
                },delay);
            }
        }else if(type == ERDDZTabelType.MingPai){
            this.setChatBtnOpacity();
        }else if(type == ERDDZTabelType.JiaoDiZhu){
            this.updateRoomTip();
        }else if(type == ERDDZTabelType.QiangDiZhu) {
            this.updateRoomTip();
            if(data.params[1] == 1){
                this.showChangeInfo("倍数x2");
            }
        }else if(type == ERDDZTabelType.SureDiZhu){
            this.updateRoomTip();
            this.showDiPai(2);
            if(data.params[1] > 1){
                this.showChangeInfo("倍数x" + data.params[1]);
            }
        }else if(type == ERDDZTabelType.JiaBei){
            this.updateRoomTip();
            if(data.params[1] == 2){
                this.showChangeInfo("倍数x2");
            }
        }else if(type == ERDDZTabelType.RangPai){
            this.updateRoomTip();

            if(data.params[1] > 0){
                this.showChangeInfo("让牌+" + data.params[1]);
            }
        }


        this.playerLayer.handleTableData(type,data);
        this.cardLayer.handleTableData(type,data);
        this.optBtnLayer.handleTableData(type,data);
        this.soundHandle.handleTableData(type,data);
        if(ERDDZRoomModel.isMoneyRoom()){
            var seq = ERDDZRoomModel.getSeqWithSeat(data.seat);
            this.roomEffectHandle.handleTableData(type,data,this,seq);
            if(this.cardLayer.getChildByName("huojian")){
                this.cardLayer.removeChildByName("huojian");
            }
        }
    },
    NeedXipai: function () {
        for (var i = 0; i < this.diPaiNodeArr.length; ++i) {
            this.diPaiNodeArr[i].removeFromParent(true);
        }
        this.diPaiNodeArr = [];
        this.removeScoreLayer();
        this.cardLayer.cleanAllCards();
        this.cardLayer.showTeamCardTip(false);
        this.cardLayer.visible = false;
        for(var i = 0;i<this.playerLayer.players.length;++i){
            this.playerLayer.players[i].setDiPaiVisible(false);
        }
        this.optBtnLayer.visible = false;
        this.xipaiAni();
        this.addTipLabel();
    },

    clearXiPai:function(){
        if (this.actionnode) {
            this.actionnode.removeAllChildren();
            delete this.actionnode;
        }
        if (this.actionnode2) {
            this.actionnode2.removeAllChildren();
            delete this.actionnode2;
        }
        if(this.tipLabelStr){
            this.tipLabelStr.visible = false;
        }
        for(var i = 0;i<this.playerLayer.players.length;++i){
            this.playerLayer.players[i].setDiPaiVisible(true);
        }
        for(var i = 0;i<this.diPaiNodeArr.length;++i){
            this.diPaiNodeArr[i].visible = true;
        }
        this.optBtnLayer.visible = true;
        this.cardLayer.visible = true;
        BaseXiPaiModel.isNeedXiPai = false;
    },

    addTipLabel:function(){
        if(BaseXiPaiModel.isNeedXiPai){
            var nameList = BaseXiPaiModel.nameList || [];
            var LabelStr = "";
            for(var i = 0;i < nameList.length;++i){
                if(nameList[i]){
                    if(LabelStr == ""){
                        LabelStr += nameList[i]
                    }else{
                        LabelStr += "、" + nameList[i];
                    }
                }

            }
            if(LabelStr != ""){
                if(!this.tipLabelStr){
                    this.tipLabelStr = new cc.LabelTTF("", "", 45);
                    this.tipLabelStr.x = 960;
                    this.tipLabelStr.y = 620;
                    this.addChild(this.tipLabelStr,100);
                }
                this.tipLabelStr.visible = true;
                this.tipLabelStr.setString("玩家 "+LabelStr+" 正在洗牌");
            }
        }
    },
    xipaiAni: function () {
        this.actionnode = new cc.Node();
        this.addChild(this.actionnode, 10);
        this.actionnode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 300);

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/jnqp/jnqp.ExportJson");
        var ani = new ccs.Armature("jnqp");
        ani.setAnchorPoint(0.5, 0.5);
        ani.setPosition(-50, 600);
        ani.getAnimation().play("Animation1", -1, 1);
        this.actionnode.addChild(ani);
        for (var index = 0; index < 11; index++) {
            var back_card = new cc.Sprite("res/res_erddz/action_card.png");
            back_card.scale = 0.6;
            back_card.setPosition(-300, 0);
            this.actionnode.addChild(back_card);
            back_card.setLocalZOrder(-index);

            var action = this.xipaiAction(index, 1)
            back_card.runAction(action);
        }

        for (var j = 0; j < 11; j++) {
            var back_card2 = new cc.Sprite("res/res_erddz/action_card.png");
            back_card2.scale = 0.6;
            back_card2.setPosition(300, 0);
            this.actionnode.addChild(back_card2);
            back_card2.setLocalZOrder(-j);

            var action = this.xipaiAction(j, 2)
            back_card2.runAction(action);
        }
    },

    xipaiAction: function (index, type) {
        var self = this;
        var end_x = type == 2 ? 300 : -300;
        var action = cc.sequence(
            cc.delayTime(0.1 * index),
            cc.moveTo(0.3, end_x, 600 - 60 * index),
            cc.moveTo(0.2, end_x, 200),
            cc.moveTo(0.1, 0, 300),
            cc.callFunc(function () {
                if (index == 10 && type == 2) {
                    self.actionnode.removeAllChildren();
                    sySocket.sendComReqMsg(3);
                    self.clearXiPai();
                }
            })
        );
        return action;
    },
    showChangeInfo:function(str){
        var label = this.getChildByName("Label_Ani");
        label && label.removeFromParent(true);
        if(str){
            label = new ccui.Text(str,"res/font/bjdmj/fznt.TTF",80);
            label.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 100);
            label.setName("Label_Ani");
            label.setColor(cc.color.YELLOW);
            label.setScale(0);
            this.addChild(label,10);

            var action = cc.sequence(cc.scaleTo(0.1,1.5),cc.scaleTo(0.1,1),cc.delayTime(0.5),
                cc.callFunc(function(node){
                    node.removeFromParent(true);
                }));

            label.runAction(action);
        }
    },

    showDiPai:function(type){
        for(var i = 0;i<this.diPaiNodeArr.length;++i){
            this.diPaiNodeArr[i].removeFromParent(true);
        }
        this.diPaiNodeArr = [];

        if(!type)return;

        var cards = ERDDZRoomModel.diCards || [];
        for(var i = 0;i<cards.length;++i){
            var card = new ERDDZCard(cards[i],type == 2);
            card.setScale(0.5);
            card.setPosition(cc.winSize.width - 400 + i*140,cc.winSize.height/2 + 280);
            this.addChild(card);
            if(type == 2){
                card.showFanPaiAni();
            }
            if(BaseXiPaiModel.isNeedXiPai){
                card.visible = false;
            }
            this.diPaiNodeArr.push(card);
        }

        var str= this.getDiPaiTypeStr(cards);
        if(str && ERDDZRoomModel.intParams[9] == 1){
            var typeBg = new cc.Scale9Sprite("res/res_erddz/jiugonga1.png");
            typeBg.setContentSize(240,60);
            typeBg.setPosition(cc.winSize.width - 230,cc.winSize.height/2 + 150);
            this.addChild(typeBg);

            var label = UICtor.cLabel(str,40);
            label.setPosition(typeBg.width/2,typeBg.height/2);
            label.setColor(cc.color.YELLOW);
            typeBg.addChild(label);
            if(BaseXiPaiModel.isNeedXiPai){
                card.visible = false;
            }
            this.diPaiNodeArr.push(typeBg);
        }
    },

    getDiPaiTypeStr:function(ids){
        var wangNum = 0;
        var isTongHua = true;
        var isShunZi = true;
        var isEqual = true;

        for(var i = 0;i<ids.length;++i){
            if(ids[i] == 0)return "";
        }

        ERDDZRoomModel.sortIdByValue(ids);
        for(var i = 0;i<ids.length;++i){
            var cfg = ERDDZCardID[ids[i]];
            if(cfg.t == 5)wangNum++;
            if(i+1 < ids.length){
                var cfg1 = ERDDZCardID[ids[i+1]];
                if(cfg1.t != cfg.t)isTongHua = false;
                if(cfg1.v != cfg.v)isEqual = false;
                if(cfg.v - cfg1.v != 1)isShunZi = false;
            }
        }

        if(!isTongHua && wangNum == 0 && !isEqual){//重新检测顺子
            var shunziList = ["15,4,3","15,14,3"];//1,2,3是顺子   2,3,4是顺子
            var notShunziList = ["15,14,13"];//K,A,2不算顺子
            var localArr = [];
            for(var i = 0;i<ids.length;++i){
                var cfg = ERDDZCardID[ids[i]];
                localArr.push(cfg.v);
            }
            var localArrStr = localArr.toString();
            if(shunziList.indexOf(localArrStr) != -1){
                isShunZi = true;
            }
            if(notShunziList.indexOf(localArrStr) != -1){
                isShunZi = false;
            }
        }

        var str = "";
        if(wangNum == 1){
            str = "单王2倍";
        }else if(wangNum == 2){
            str = "双王4倍";
        }else if(isEqual){
            str = "豹子4倍";
        }else if(isTongHua && isShunZi){
            str = "同花顺4倍";
        }else if(isTongHua){
            str = "同花3倍";
        }else if(isShunZi){
            str = "顺子3倍";
        }

        return str;
    },

    getShowCardPos:function(seq){
        var pos = cc.p(cc.winSize.width/2,cc.winSize.height/2 + 150);
        if(seq == 1)pos.y -= 225;
        if(seq == 2)pos.x += 600;
        if(seq == 3)pos.y += 100;
        if(seq == 4)pos.x -= 600;

        return pos;
    },

    showLiangZhang:function(id,seq){
        if(!id)return;

        var card = new ERDDZCard(id);
        card.setPosition(this.getShowCardPos(seq));
        card.setScale(0);
        this.addChild(card,20);

        var action = cc.sequence(cc.scaleTo(0.2,1),cc.delayTime(0.8),cc.callFunc(function(node){
            node.removeFromParent(true);
        }));

        card.runAction(action);
    },

    removeScoreLayer:function(){
        var layer = this.getChildByName("ScoreLayer");
        layer && layer.removeFromParent(true);
    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getERDDZWanfa(ERDDZRoomModel.intParams,true,ERDDZRoomModel.isMoneyRoom());
        this.label_rule_tip.setString(str);
    },

    updateRoomInfo:function(){
        this.label_room_id.setString("房号:" + ERDDZRoomModel.tableId);

        if(ERDDZRoomModel.isMoneyRoom()){
            this.label_room_id.setString("序号:" + ERDDZRoomModel.tableId);
        }

        var jushuStr = "局数:" + ERDDZRoomModel.nowBurCount;
        if(ERDDZRoomModel.totalBurCount < 100){
            jushuStr += ("/" + ERDDZRoomModel.totalBurCount);
        }

        if(ERDDZRoomModel.isMoneyRoom()){
            jushuStr = "底分:" + ERDDZRoomModel.goldMsg[2];
        }

        this.label_jushu.setString(jushuStr);
        this.label_room_name.setString(ERDDZRoomModel.roomName || "二人斗地主");

        if(!ERDDZRoomModel.replay){
            this.btn_chat.setLocalZOrder(2);
            this.btn_yuyin.setLocalZOrder(2);
        }
    },

    //本地座位为1的玩家如果明牌了，吧按钮透明化处理，可以看到下面的牌
    setChatBtnOpacity:function(){
        var opacity = 255;

        var seat = ERDDZRoomModel.getSeatWithSeq(2);
        var p = ERDDZRoomModel.getPlayerDataByItem("seat",seat);

        if(p && p.shiZhongCard == 1)opacity = 100;

        this.btn_chat.setOpacity(opacity);
        this.btn_yuyin.setOpacity(opacity);
        this.recordBtn.setOpacity(opacity);
    },

    updateRoomBtnState:function(){
        this.roomBtnContent.setVisible(ERDDZRoomModel.players.length < ERDDZRoomModel.renshu);

        if(ERDDZRoomModel.isMoneyRoom()){
            this.roomBtnContent.setVisible(false);
        }
    },

    updateReadyBtnState:function(){
        var isShowReadyBtn = false;
        var players = ERDDZRoomModel.players;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId && players[i].status == 0){
                isShowReadyBtn = true;
            }
        }
        this.btn_ready.setVisible(isShowReadyBtn);
    },

    updateRoomTip:function(){
        var beishu = ERDDZRoomModel.ext[22] || 0;
        var rangpai = ERDDZRoomModel.ext[23] || 0;

        this.label_beishu.setString(beishu + "倍");
        this.label_rangpai.setString(rangpai + "张");

        var tipStr = "";

        if(ERDDZRoomModel.remain == 2){

            var paiShu = 0;
            for(var i = 0;i<ERDDZRoomModel.players.length;++i){
                var p = ERDDZRoomModel.players[i];
                if(p.seat != ERDDZRoomModel.banker){
                    paiShu = p.ext[8];
                }
            }
            paiShu -= rangpai;

            if(ERDDZRoomModel.mySeat == ERDDZRoomModel.banker){
                tipStr = "你让" + rangpai + "张牌,对手再出" + paiShu + "张牌即可胜利";
            }else{
                tipStr = "地主让" + rangpai + "张牌,你再出" + paiShu + "张牌即可胜利";
            }

            if(paiShu <= 0){
                tipStr = "";
            }

        }
        this.tip_bg.setVisible(!!tipStr);
        this.label_tip.setString(tipStr);
    },

    moneyRoomShowLeaveBtn:function(isShow){
        if(isShow){
            if(!this.btn_leave){
                var img = "res/ui/bjdmj/back_qyq_hall.png";
                this.btn_leave = new ccui.Button(img,img,"");
                this.btn_leave.setPosition(cc.winSize.width/2,cc.winSize.height/3);
                this.btn_leave.addTouchEventListener(this.onClickBtn,this);
                this.addChild(this.btn_leave,1);
            }
            this.btn_leave.setVisible(true);
        }else if(this.btn_leave){
            this.btn_leave.setVisible(false);
        }
    },

    moneyRoomShowWaitAni:function(isShow){
        if(isShow){
            if(!this.waitAni){
                ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/gold_zzpp/NewAnimation2.ExportJson");
                this.waitAni = new ccs.Armature("NewAnimation2");
                this.waitAni.setPosition(cc.winSize.width/2,cc.winSize.height/2);
                this.addChild(this.waitAni,1);
                this.waitAni.getAnimation().play("Animation1",-1,1);
            }

        }else if(this.waitAni){
            this.waitAni.removeFromParent(true);
            this.waitAni = null;
        }
    },

    //对局门票显示
    moneyRoomShowTiket:function(isShow,num,delayRemove){
        if(isShow){
            if(!this.imgTiket){
                this.imgTiket = new cc.Sprite("res/res_mj/common/gold_mp.png");
                this.imgTiket.setAnchorPoint(1,0.5);
                this.imgTiket.setPosition(cc.winSize.width,cc.winSize.height/4);
                this.addChild(this.imgTiket,1);

                var label = new cc.LabelBMFont(num,"res/font/gold_mp.fnt");
                label.setPosition(this.imgTiket.width*0.68,this.imgTiket.height*0.85);
                this.imgTiket.addChild(label,1);

                var self = this;
                if(delayRemove){
                    var action = cc.sequence(cc.delayTime(3),cc.callFunc(function(node){
                        node.removeFromParent(true);
                        self.imgTiket = null;
                    }));
                    this.imgTiket.runAction(action);
                }
            }
        }else if(this.imgTiket){
            this.imgTiket.removeFromParent(true);
            this.imgTiket = null;
        }
    },
});