/**
 * Created by cyp on 2019/11/13.
 */
var HSTHRoomLayer = HSTHBaseRoomLayer.extend({
    tableMsgArr:null,
    ctor:function(){
        this._super();

        this.tableMsgArr = [];

        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableData);
        this.addCustomEvent(SyEvent.BISAI_XIPAI , this,this.NeedXipai);
        this.addCustomEvent("XIPAI_CLEAR_NODE", this, this.clearXiPai);

        this.soundHandle = new HSTHRoomSound();

        this.initLayer();
        this.addRoomTitle();
        this.addRoomLayer();
        this.addBottomBtn();
        this.addYuyinRecored();
        this.addRoomBtn();

    },

    NeedXipai: function () {
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
        this.optBtnLayer.visible = true;
        this.cardLayer.visible = true;
        BaseXiPaiModel.isNeedXiPai = false;
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.scheduleUpdate();
    },

    initLayer:function(){
        var roomInfoBg = new cc.Scale9Sprite("res/res_hsth/jiugonga1.png");
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

        this.label_room_name = UICtor.cLabel("衡山同花房间名",36);
        this.label_room_name.setAnchorPoint(0,0.5);
        this.label_room_name.setPosition(15,this.label_jushu.y - 45);
        roomInfoBg.addChild(this.label_room_name);

        this.label_rule_tip = new ccui.Text("","",40);
        this.label_rule_tip.setTextAreaSize(cc.size(1200,0));
        this.label_rule_tip.setFontName("res/font/bjdmj/fzcy.TTF");
        this.label_rule_tip.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_rule_tip.setOpacity(100);
        this.label_rule_tip.setColor(cc.color(0,0,0));
        this.label_rule_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 15);
        this.addChild(this.label_rule_tip);

        //var btn_bg = new cc.Scale9Sprite("res/res_hsth/image_xiadi.png");
        //btn_bg.setContentSize(cc.winSize.width,btn_bg.height);
        //btn_bg.setAnchorPoint(0.5,0);
        //btn_bg.setPosition(cc.winSize.width/2,0);
        //this.addChild(btn_bg);

        this.paiZhuoFen = new cc.Sprite("res/res_hsth/paizhuofen.png");
        this.paiZhuoFen.setPosition(cc.winSize.width - 420,cc.winSize.height - 225);
        this.paiZhuoFen.setVisible(false);
        this.addChild(this.paiZhuoFen);

        this.num_fen = UICtor.cLabel("",80);
        this.num_fen.setColor(cc.color(213,62,55));
        this.num_fen.setAnchorPoint(0,0.5);
        this.num_fen.setPosition(200,this.paiZhuoFen.height/2);
        this.paiZhuoFen.addChild(this.num_fen);

        this.setPaiZhuoFen(0);

        var tongji_bg = new cc.Sprite("res/res_hsth/tongji.png");
        tongji_bg.setPosition(cc.winSize.width - 360,cc.winSize.height - 90);
        this.addChild(tongji_bg);

        var label_txt1 = UICtor.cLabel("己方:",36);
        label_txt1.setPosition(60,tongji_bg.height/2 + 30);
        tongji_bg.addChild(label_txt1);

        var label_txt2 = UICtor.cLabel("对方:",36);
        label_txt2.setPosition(60,tongji_bg.height/2 - 30);
        tongji_bg.addChild(label_txt2);

        this.label_team_my = UICtor.cLabel("0",36);
        this.label_team_my.setPosition(tongji_bg.width/2 + 38,label_txt1.y);
        this.label_team_my.setColor(cc.color.YELLOW);
        tongji_bg.addChild(this.label_team_my);

        this.label_team_other = UICtor.cLabel("0",36);
        this.label_team_other.setPosition(tongji_bg.width/2 + 38,label_txt2.y);
        this.label_team_other.setColor(cc.color.YELLOW);
        tongji_bg.addChild(this.label_team_other);

    },

    setPaiZhuoFen:function(num){
        this.num_fen.setString(num);
    },

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/res_hsth/title_hsth.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 225);
        this.addChild(spr);
    },

    addBottomBtn:function(){

        var img = "res/res_hsth/huatong.png";
        this.btn_yuyin = new ccui.Button(img,img);
        this.btn_yuyin.setPosition(cc.winSize.width - 90,375);
        this.addChild(this.btn_yuyin);

        img = "res/res_hsth/liaotian.png";
        this.btn_chat = new ccui.Button(img,img);
        this.btn_chat.setPosition(this.btn_yuyin.x - 150,this.btn_yuyin.y);
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

        this.addChild(this.playerLayer = new HSTHPlayerLayer(),2);
        this.addChild(this.cardLayer = new HSTHCardLayer(),1);
        this.addChild(this.optBtnLayer = new HSTHOptBtnLayer(),10);
    },

    addRoomBtn:function(){
        var isQyqRoom = HSTHRoomModel.tableType == 1;

        var img_wx = "res/res_hsth/btn_invite.png";
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
                if(HSTHRoomModel.privateRoom == 1){
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

        var img_ready = "res/res_hsth/btn_ready.png";
        this.btn_ready = new ccui.Button(img_ready,img_ready);
        this.btn_ready.setPosition(cc.winSize.width/2,225);
        this.addChild(this.btn_ready);
        this.btn_ready.addTouchEventListener(this.onClickBtn,this);

        //this.roomBtnContent.setVisible(false);
    },

    addYuyinRecored:function(){
        this.yuyinBg = new cc.Scale9Sprite("res/res_hsth/img_40.png");
        this.yuyinBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.yuyinBg.setContentSize(500,315);
        this.addChild(this.yuyinBg,100);

        var img1 = new cc.Sprite("res/res_hsth/img_39.png");
        img1.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 38);
        this.yuyinBg.addChild(img1);

        var progressBg = new cc.Sprite("res/res_hsth/img_audio_1.png");
        progressBg.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 38);
        this.yuyinBg.addChild(progressBg);

        var tipLabel = UICtor.cLabel("手指上滑取消发送",42);
        tipLabel.setPosition(this.yuyinBg.width/2,45);
        this.yuyinBg.addChild(tipLabel);

        this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
        this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/res_hsth/img_audio_2.png"));
        this.progCycle.x = progressBg.width/2;
        this.progCycle.y = progressBg.height/2;
        this.progCycle.setPercentage(0);
        progressBg.addChild(this.progCycle,1);
        this.recordBtn = new RecordAudioButton(this.yuyinBg,this.progCycle,"res/res_hsth/huatong.png","res/res_hsth/huatong.png");
        this.recordBtn.x = this.btn_yuyin.width/2;
        this.recordBtn.y = this.btn_yuyin.height/2;
        this.btn_yuyin.addChild(this.recordBtn,1);
        this.btn_yuyin.setOpacity(0);
        this.recordBtn.setOpacity(100);
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
                if(HSTHRoomModel.privateRoom == 1) inviteType = 2
                var pop = new PyqInviteListPop(inviteType);
                this.addChild(pop);
            }else if(sender == this.btn_qyq_back){
                var pop = new PyqHall();
                pop.setBackBtnType(2);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_chat){
                var pop = new ChatPop();
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_ready){
                sySocket.sendComReqMsg(4);
            }else if(sender == this.btn_show_defen){
                this.showScoreLayer(1);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "衡山同花";
        var queZi = HSTHRoomModel.renshu + "缺"+(HSTHRoomModel.renshu - HSTHRoomModel.players.length);
        var obj={};
        obj.tableId=HSTHRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+HSTHRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+HSTHRoomModel.tableId+"] "+queZi;

        var youxiName = "衡山同花";
        if(HSTHRoomModel.tableType == 1){
            youxiName = "[亲友圈]衡山同花"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,HSTHRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "HSTH_ROOM";
    },

    update:function(){
        if(HSTHRoomModel.pauseValue == 0 && this.tableMsgArr.length > 0){
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
        var state = HSTHRoomModel.handleTableData(type,data);
        if(!state)return;

        if(type == HSTHTabelType.CreateTable){
            this.tableMsgArr = [];
            sy.scene.hideLoading();
            this.removeScoreLayer();
            this.updateRoomInfo();
            this.updateRoomBtnState();
            this.updateReadyBtnState();
            this.updateRoomTip();
            this.setRuleTip();
            this.setTeamScore();

            this.setChatBtnOpacity();

            if(HSTHRoomModel.nowBurCount == 1
                && HSTHRoomModel.remain == 0 && !this.isShowGps){
                this.isShowGps = true;
                this.onClickGpsBtn();
            }

        }else if(type == HSTHTabelType.JoinTable){
            this.updateRoomBtnState();

            this.onClickGpsBtn();

        }else if(type == HSTHTabelType.ExitTable){
            this.updateRoomBtnState();
        }else if(type == HSTHTabelType.ChangeState){
            this.updateReadyBtnState();
        }else if(type == HSTHTabelType.DealCard){
            this.updateRoomTip();

            if(data.dealDice > 0){
                this.showMoDuiCard(data.dealDice);
            }

        }else if(type == HSTHTabelType.PlayCard){
            this.updateRoomTip();
            this.setTeamScore();
        }else if(type == HSTHTabelType.OnOver){
            var SmallResultLayer = HSTHRoomModel.getSamllResultLayer();
            if(data.isBreak){

            }else{
                //延时弹出小结算
                setTimeout(function(){
                    var layer = new SmallResultLayer(data);
                    PopupManager.addPopup(layer);
                },1000);
            }
        }else if(type == HSTHTabelType.MingPai){
            this.setChatBtnOpacity();
        }

        this.playerLayer.handleTableData(type,data);
        this.cardLayer.handleTableData(type,data);
        this.optBtnLayer.handleTableData(type,data);

        this.soundHandle.handleTableData(type,data);

    },

    setTeamScore:function(){
        var my_team_id = 0;
        var scoreData = {};

        var players = HSTHRoomModel.players;
        for(var i = 0;i<players.length;++i){
            var p = players[i];
            scoreData[p.ext[6]] = p.ext[4];
            if(p.seat == HSTHRoomModel.mySeat){
                my_team_id = p.ext[6];
            }
        }

        for(var k in scoreData){
            if(k == my_team_id){
                this.label_team_my.setString(scoreData[k] || 0);
            }else{
                this.label_team_other.setString(scoreData[k] || 0);
            }
        }
    },

    showMoDuiCard:function(id){
        if(!id)return;

        var card = new HSTHCard(id);
        card.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 150);
        card.setScale(0);
        this.addChild(card,20);

        var action = cc.sequence(cc.scaleTo(0.2,1),cc.delayTime(0.8),cc.callFunc(function(node){
            node.removeFromParent(true)
        }));

        card.runAction(action);
    },

    showScoreLayer:function(type){
        this.removeScoreLayer();

        var layer = new HSTHShowScoreLayer(type);
        layer.setName("ScoreLayer");
        this.addChild(layer,20);
    },

    removeScoreLayer:function(){
        var layer = this.getChildByName("ScoreLayer");
        layer && layer.removeFromParent(true);
    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getHSTHWanfa(HSTHRoomModel.intParams,true);
        this.label_rule_tip.setString(str);
    },

    updateRoomInfo:function(){
        this.label_room_id.setString("房号:" + HSTHRoomModel.tableId);
        var jushuStr = "局数:" + HSTHRoomModel.nowBurCount;
        if(HSTHRoomModel.totalBurCount < 100){
            jushuStr += ("/" + HSTHRoomModel.totalBurCount);
        }
        this.label_jushu.setString(jushuStr);
        this.label_room_name.setString(HSTHRoomModel.roomName || "衡山同花");

        if(!HSTHRoomModel.replay){
            this.btn_chat.setLocalZOrder(2);
            this.btn_yuyin.setLocalZOrder(2);
        }
    },

    //本地座位为1的玩家如果明牌了，吧按钮透明化处理，可以看到下面的牌
    setChatBtnOpacity:function(){
        var opacity = 255;

        var seat = HSTHRoomModel.getSeatWithSeq(2);
        var p = HSTHRoomModel.getPlayerDataByItem("seat",seat);

        if(p && p.shiZhongCard == 1)opacity = 100;

        this.btn_chat.setOpacity(opacity);
        this.recordBtn.prog.setOpacity(opacity);
    },

    updateRoomBtnState:function(){
        this.roomBtnContent.setVisible(HSTHRoomModel.players.length < HSTHRoomModel.renshu);
    },

    updateReadyBtnState:function(){
        var isShowReadyBtn = false;
        var players = HSTHRoomModel.players;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId && players[i].status == 0){
                isShowReadyBtn = true;
            }
        }
        this.btn_ready.setVisible(isShowReadyBtn);
    },

    updateRoomTip:function(){
        if(HSTHRoomModel.remain == 2){
            this.paiZhuoFen.setVisible(true);
            this.setPaiZhuoFen(HSTHRoomModel.ext[3] || 0);
        }else{
            this.paiZhuoFen.setVisible(false);
        }
    },
});