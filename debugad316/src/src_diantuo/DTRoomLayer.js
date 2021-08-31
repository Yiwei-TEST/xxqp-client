/**
 * Created by cyp on 2019/10/21.
 */
var DTRoomLayer = DTBaseRoomLayer.extend({
    tableMsgArr:null,
    ctor:function(){
        this._super();

        this.tableMsgArr = [];

        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableData);

        this.soundHandle = new DTRoomSound();

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
        var roomInfoBg = new cc.Scale9Sprite("res/res_diantuo/jiugonga1.png");
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

        this.label_room_name = UICtor.cLabel("掂坨房间名",36);
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

        var btn_bg = new cc.Scale9Sprite("res/res_diantuo/image_xiadi.png");
        btn_bg.setContentSize(cc.winSize.width,btn_bg.height);
        btn_bg.setAnchorPoint(0.5,0);
        btn_bg.setPosition(cc.winSize.width/2,0);
        this.addChild(btn_bg);

        this.paiZhuoFen = new cc.Sprite("res/res_diantuo/paizhuofen.png");
        this.paiZhuoFen.setPosition(cc.winSize.width/2 - 75,cc.winSize.height/2 + 120);
        this.paiZhuoFen.setVisible(false);
        this.addChild(this.paiZhuoFen);

        this.num_fen = UICtor.cLabel("",80);
        this.num_fen.setColor(cc.color(213,62,55));
        this.num_fen.setAnchorPoint(0,0.5);
        this.num_fen.setPosition(200,this.paiZhuoFen.height/2);
        this.paiZhuoFen.addChild(this.num_fen);

        this.setPaiZhuoFen(0);

    },

    setPaiZhuoFen:function(num){
        this.num_fen.setString(num);
    },

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/res_diantuo/wanfa.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 225);
        this.addChild(spr);
    },

    addBottomBtn:function(){

        var img = "res/res_diantuo/huatong.png";
        this.btn_yuyin = new ccui.Button(img,img);
        this.btn_yuyin.setPosition(cc.winSize.width - 90,375);
        this.addChild(this.btn_yuyin);

        img = "res/res_diantuo/liaotian.png";
        this.btn_chat = new ccui.Button(img,img);
        this.btn_chat.setPosition(this.btn_yuyin.x - 150,this.btn_yuyin.y);
        this.addChild(this.btn_chat);

        this.btn_chat.setScale(0.8);
        this.btn_yuyin.setScale(0.8);

        img = "res/res_diantuo/bao.png";
        this.btn_bao = new ccui.Button(img,img);
        this.btn_bao.setPosition(this.btn_chat.x - 150,this.btn_chat.y);
        this.addChild(this.btn_bao);

        img = "res/res_diantuo/show_baoFen.png";
        this.btn_show_baofen = new ccui.Button(img,img);
        this.btn_show_baofen.setPosition(cc.winSize.width - 270,cc.winSize.height - 90);
        this.addChild(this.btn_show_baofen);

        img = "res/res_diantuo/show_deFen.png";
        this.btn_show_defen = new ccui.Button(img,img);
        this.btn_show_defen.setPosition(this.btn_show_baofen.x - 180,this.btn_show_baofen.y);
        this.addChild(this.btn_show_defen);

        img = "res/res_diantuo/paixu_n.png";
        this.btn_paixu = new ccui.Button(img,img);
        this.btn_paixu.setPosition(cc.winSize.width - 150,40);
        this.addChild(this.btn_paixu);

        img = "res/res_diantuo/wushik_n.png";
        this.btn_wushik = new ccui.Button(img,img);
        this.btn_wushik.setPosition(this.btn_paixu.x - 255,this.btn_paixu.y);
        this.addChild(this.btn_wushik);

        img = "res/res_diantuo/zhadan_n.png";
        this.btn_zhadan = new ccui.Button(img,img);
        this.btn_zhadan.setPosition(this.btn_wushik.x - 255,this.btn_paixu.y);
        this.addChild(this.btn_zhadan);

        this.btn_chat.addTouchEventListener(this.onClickBtn,this);
        this.btn_yuyin.addTouchEventListener(this.onClickBtn,this);
        this.btn_bao.addTouchEventListener(this.onClickBtn,this);
        this.btn_show_baofen.addTouchEventListener(this.onClickBtn,this);
        this.btn_show_defen.addTouchEventListener(this.onClickBtn,this);
        this.btn_paixu.addTouchEventListener(this.onClickBtn,this);
        this.btn_wushik.addTouchEventListener(this.onClickBtn,this);
        this.btn_zhadan.addTouchEventListener(this.onClickBtn,this);


        if(BaseRoomModel.isBanVoiceAndProps()){
            this.btn_yuyin.setVisible(false);
        }
    },

    addRoomLayer:function(){

        this.addChild(this.playerLayer = new DTPlayerLayer(),2);
        this.addChild(this.cardLayer = new DTCardLayer(),1);
        this.addChild(this.optBtnLayer = new DTOptBtnLayer(),10);
    },

    addRoomBtn:function(){
        var isQyqRoom = DTRoomModel.tableType == 1;

        var img_wx = "res/res_diantuo/btn_invite.png";
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
                if(DTRoomModel.privateRoom == 1){
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

        var img_ready = "res/res_diantuo/btn_ready.png";
        this.btn_ready = new ccui.Button(img_ready,img_ready);
        this.btn_ready.setPosition(cc.winSize.width/2,225);
        this.addChild(this.btn_ready);
        this.btn_ready.addTouchEventListener(this.onClickBtn,this);

        //this.roomBtnContent.setVisible(false);
    },

    addYuyinRecored:function(){
        this.yuyinBg = new cc.Scale9Sprite("res/res_diantuo/img_40.png");
        this.yuyinBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.yuyinBg.setContentSize(500,315);
        this.addChild(this.yuyinBg,100);

        var img1 = new cc.Sprite("res/res_diantuo/img_39.png");
        img1.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 40);
        this.yuyinBg.addChild(img1);

        var progressBg = new cc.Sprite("res/res_diantuo/img_audio_1.png");
        progressBg.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 40);
        this.yuyinBg.addChild(progressBg);

        var tipLabel = UICtor.cLabel("手指上滑取消发送",42);
        tipLabel.setPosition(this.yuyinBg.width/2,45);
        this.yuyinBg.addChild(tipLabel);

        this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
        this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/res_diantuo/img_audio_2.png"));
        this.progCycle.x = progressBg.width/2;
        this.progCycle.y = progressBg.height/2;
        this.progCycle.setPercentage(0);
        progressBg.addChild(this.progCycle,1);
        this.recordBtn = new RecordAudioButton(this.yuyinBg,this.progCycle,"res/res_diantuo/huatong.png","res/res_diantuo/huatong.png");
        this.recordBtn.x = this.btn_yuyin.width/2;
        this.recordBtn.y = this.btn_yuyin.height/2;
        this.btn_yuyin.addChild(this.recordBtn,1);
        this.btn_yuyin.setOpacity(0);
        this.recordBtn.setOpacity(150);
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
                if(DTRoomModel.privateRoom == 1) inviteType = 2
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
            }else if(sender == this.btn_show_baofen){
                this.showScoreLayer(2);
            }else if(sender == this.btn_show_defen){
                this.showScoreLayer(1);
            }else if(sender == this.btn_bao){
                var layer = new DTBaoInfoLayer();
                this.addChild(layer,20);
            }else if(sender == this.btn_paixu){
                SyEventManager.dispatchEvent("DT_Sort_Card");
            }else if(sender == this.btn_wushik){
                SyEventManager.dispatchEvent("DT_Get_WuShiK");
            }else if(sender == this.btn_zhadan){
                SyEventManager.dispatchEvent("DT_Get_ZhaDan");
            }


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "掂坨";
        var queZi = DTRoomModel.renshu + "缺"+(DTRoomModel.renshu - DTRoomModel.players.length);
        var obj={};
        obj.tableId=DTRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+DTRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+DTRoomModel.tableId+"] "+queZi;

        var youxiName = "掂坨";
        if(DTRoomModel.tableType == 1){
            youxiName = "[亲友圈]掂坨";
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,DTRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "DT_ROOM";
    },

    update:function(){
        if(DTRoomModel.pauseValue == 0 && this.tableMsgArr.length > 0){
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
        var state = DTRoomModel.handleTableData(type,data);
        if(!state)return;

        if(type == DTTabelType.CreateTable){

            if(this.tableMsgArr.length > 0
                && this.tableMsgArr[this.tableMsgArr.length - 1].eventType == DTTabelType.DealCard){
                this.tableMsgArr = this.tableMsgArr.slice(-1);
            }else{
                this.tableMsgArr = [];
            }

            sy.scene.hideLoading();
            this.removeScoreLayer();
            this.updateRoomInfo();
            this.updateRoomBtnState();
            this.updateReadyBtnState();
            this.updateRoomTip();
            this.setRuleTip();

            //显示开局翻出的牌
            if(DTRoomModel.showDuiCard > 0){
                var seq = DTRoomModel.getSeqWithSeat(DTRoomModel.nextSeat);
                this.showMoDuiCard(DTRoomModel.showDuiCard,seq);
            }

            if(DTRoomModel.nowBurCount == 1
                && DTRoomModel.remain == 0 && !this.isShowGps){
                this.isShowGps = true;
                this.onClickGpsBtn();
            }

        }else if(type == DTTabelType.JoinTable){
            this.updateRoomBtnState();

            this.onClickGpsBtn();

        }else if(type == DTTabelType.ExitTable){
            this.updateRoomBtnState();
        }else if(type == DTTabelType.ChangeState){
            this.updateReadyBtnState();
        }else if(type == DTTabelType.DealCard){
            this.updateRoomTip();

            if(data.dealDice > 0){
                var seq = DTRoomModel.getSeqWithSeat(DTRoomModel.nextSeat);
                this.showMoDuiCard(data.dealDice,seq);
            }

        }else if(type == DTTabelType.PlayCard){
            this.updateRoomTip();

            if(!DTRoomModel.replay && DTRoomModel.banker == 0
                && (data.isBt == 1 || data.isBt == 2) && (DTRoomModel.renshu != 2)){//非独战，出完牌，显示报分
                this.showScoreLayer(2);
            }else if(data.seat == DTRoomModel.mySeat){
                this.removeScoreLayer();
            }

        }else if(type == DTTabelType.OnOver){
            var SmallResultLayer = DTRoomModel.getSamllResultLayer();
            if(data.isBreak){

            }else{
                var layer = new SmallResultLayer(data);
                PopupManager.addPopup(layer);
            }
        }


        this.playerLayer.handleTableData(type,data);
        this.cardLayer.handleTableData(type,data);
        this.optBtnLayer.handleTableData(type,data);

        this.soundHandle.handleTableData(type,data);

    },

    showMoDuiCard:function(id,seq){
        if(!id)return;

        var pos = cc.p(cc.winSize.width/2,cc.winSize.height/2 + 150);
        if(seq == 1)pos.y -= 225;
        if(seq == 2)pos.x += 600;
        if(seq == 3)pos.y += 120;
        if(seq == 4)pos.x -= 600;

        var card = new DTCard(id);
        card.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 150);
        card.setScale(0);
        card.setColor(cc.color(255,100,100));
        this.addChild(card,20);


        var action = cc.sequence(cc.scaleTo(0.2,1),cc.moveTo(0.2,pos),cc.delayTime(1.5),cc.callFunc(function(node){
            node.removeFromParent(true);
        }));

        card.runAction(action);
    },

    showScoreLayer:function(type){
        this.removeScoreLayer();

        var layer = new DTShowScoreLayer(type);
        layer.setName("ScoreLayer");
        this.addChild(layer,20);
    },

    removeScoreLayer:function(){
        var layer = this.getChildByName("ScoreLayer");
        layer && layer.removeFromParent(true);
    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getDTWanfa(DTRoomModel.intParams,true);
        this.label_rule_tip.setString(str);
    },

    updateRoomInfo:function(){
        this.label_room_id.setString("房号:" + DTRoomModel.tableId);
        var jushuStr = "局数:" + DTRoomModel.nowBurCount;
        if(DTRoomModel.totalBurCount < 100){
            jushuStr += ("/" + DTRoomModel.totalBurCount);
        }
        this.label_jushu.setString(jushuStr);
        this.label_room_name.setString(DTRoomModel.roomName || "掂坨");

        if(DTRoomModel.intParams[9] == 1){//不打港
            this.btn_yuyin.setVisible(false);
        }
        if(!this.btn_yuyin.isVisible()){
            this.btn_chat.setPositionX(this.btn_yuyin.x);
            this.btn_bao.setPositionX(this.btn_yuyin.x - 150);
        }else{
            this.btn_chat.setPositionX(this.btn_yuyin.x - 150);
            this.btn_bao.setPositionX(this.btn_chat.x - 150);
        }
    },

    updateRoomBtnState:function(){
        this.roomBtnContent.setVisible(DTRoomModel.players.length < DTRoomModel.renshu);
    },

    updateReadyBtnState:function(){
        var isShowReadyBtn = false;
        var players = DTRoomModel.players;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId && players[i].status == 0){
                isShowReadyBtn = true;
            }
        }
        this.btn_ready.setVisible(isShowReadyBtn);
    },

    updateRoomTip:function(){
        if(DTRoomModel.remain == 2){
            this.paiZhuoFen.setVisible(true);
            this.setPaiZhuoFen(DTRoomModel.ext[3] || 0);
        }else{
            this.paiZhuoFen.setVisible(false);
        }
    },
});