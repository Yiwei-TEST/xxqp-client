/**
 * Created by zhoufan on 2016/12/16.
 */

var BaseRoomModel = {
    curRoomData:null,

    isBanVoiceAndProps: function() {
        var isBan = false;
        //cc.log("===========isBanVoiceAndProps===========" + this.curRoomData.generalExt);
        if (this.curRoomData && this.curRoomData.generalExt
            && Number(this.curRoomData.generalExt[0])){
            isBan = true;
        }
        return isBan;
    },

    isClubGoldRoom:function(){
        var arr = [];
        if(this.curRoomData && this.curRoomData.groupTableGoldMsg){
            arr = this.curRoomData.groupTableGoldMsg.split(",");
        }

        return arr[0] == 1;
    },

    //是不是娱乐场房间
    isGoldRoom:function () {
        return this.curRoomData && this.curRoomData.tableType == 3;
    },
    //是不是娱乐场房间
    isGoldMatchRoom:function () {
        return this.curRoomData && this.curRoomData.tableType == 5;
    },
}

var BaseRoom = BaseLayer.extend({

    //房间内玩家对象的集合
    _players:{},
    _dt:0,
    _loacationDt:0,
    _countDown:30,
    _timedt:0,
    audioBtnImg:null,
    btnUntouchImg:null,


    ctor:function(json){
        this._dt = 0;
        this._countDown = 30;
        this._timedt = 0;
        this.getModel();
        this._super(json);
    },

    isForceRemove:function(){
        return true;
    },

    onRemove:function(){
        this.unscheduleUpdate();
        this._players=null;
    },

    /**
     * button名称定义
     */
    BTN_READY:"BTN_READY",
    BTN_INVITE:"BTN_INVITE",
    BTN_BREAK:"BTN_BREAK",
    BTN_SETUP:"BTN_SETUP",
    BTN_LEAVE:"BTN_LEAVE",
    BTN_CHAT:"BTN_CHAT",
    BTN_YUYIN:"BTN_YUYIN",
    NET_TYPE:"NET_TYPE",
    BATTERY:"BATTERY",
    /**
     * 获取指定按钮的名字
     * @param wName
     */
    getWidgetName:function(wName){
        var name = "";
        switch(wName){
            case this.BTN_READY:
                name = "Button_ready";
                break;
            case this.BTN_INVITE:
                name = "Button_invite";
                break;
            case this.BTN_BREAK:
                name = "Button_6";
                break;
            case this.BTN_SETUP:
                name = "Button_75";
                break;
            case this.BTN_LEAVE:
                name = "Button_7";
                break;
            case this.BTN_CHAT:
                name = "Button_52";
                break;
            case this.BTN_YUYIN:
                name = "Button_53";
                break;
            case this.NET_TYPE:
                name = "netType";
                break;
            case this.BATTERY:
                name = "battery";
                break;
        }
        return name;
    },

    getLabelTime:function(){
        throw new Error("BaseRoom's subclass must override function getLabelTime");
    },

    selfRender:function(){
        var bgMusic = 2;
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,bgMusic);
        WXHeadIconManager.loadedIconListInRoom = [];
        //通用按钮初始化
        this.btnReady = this.getWidget(this.getWidgetName(this.BTN_READY));
        this.btnInvite = this.getWidget(this.getWidgetName(this.BTN_INVITE));
        this.btnBreak = this.getWidget(this.getWidgetName(this.BTN_BREAK));
        this.btnInvite.setLocalZOrder(1);
        this.btnSetup = this.getWidget(this.getWidgetName(this.BTN_SETUP));
        this.btnLeave = this.getWidget(this.getWidgetName(this.BTN_LEAVE));
        this.btnChat = this.getWidget(this.getWidgetName(this.BTN_CHAT));
        this.btnYuyin = this.getWidget(this.getWidgetName(this.BTN_YUYIN));
        this.yuyin = this.getWidget("yuyin");//实时语音提示
        this.netType = this.getWidget(this.getWidgetName(this.NET_TYPE));
        this.battery = this.getWidget(this.getWidgetName(this.BATTERY));
        this.labelTime = this.getLabelTime();
        UITools.addClickEvent(this.btnReady,this,this.onReady);
        UITools.addClickEvent(this.btnInvite,this,this.onInvite);
        if(this.btnBreak){
            UITools.addClickEvent(this.btnBreak,this,this.onBreak);
        }
        if(this.btnSetup){
            UITools.addClickEvent(this.btnSetup,this,this.onSetUp);
        }
        if(this.btnLeave){
            UITools.addClickEvent(this.btnLeave,this,this.onLeave);
        }

        UITools.addClickEvent(this.btnChat,this,this.onChat);
        //通用事件初始化
        this.addCustomEvent(SyEvent.JOIN_ROOM,this,this.onJoin);
        this.addCustomEvent(SyEvent.EXIT_ROOM,this,this.onExitRoom);
        this.addCustomEvent(SyEvent.START_PLAY,this,this.startGame);
        this.addCustomEvent(SyEvent.LET_OUT_CARD,this,this.onLetOutCard);
        this.addCustomEvent(SyEvent.OVER_PLAY,this,this.onOver);
        this.addCustomEvent(SyEvent.PLAYER_STATUS_CHANGE,this,this.onChangeStauts);
        this.addCustomEvent(SyEvent.ONLINE_OFFLINE_NOTIFY,this,this.onOnline);
        this.addCustomEvent(SyEvent.ROOM_FAST_CHAT,this,this.onFastChat);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_START,this,this.onStartSpeak);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_FINISH,this,this.onStopSpeak);
        this.addCustomEvent("UPDATA_SHOUPAI",this,this.updateHands);

        //实时语音初始化
        if(!SdkUtil.isReview()){
            this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
            var progbg = this.getWidget("progbg");
            this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/ui/common/img_audio_2.png"));
            this.progCycle.x = progbg.width/2;
            this.progCycle.y = progbg.height/2;
            this.progCycle.setPercentage(0);
            progbg.addChild(this.progCycle);
            this.setRadioBtnImg();
            var recordBtn = this.recordBtn = new RecordAudioButton(this.yuyin,this.progCycle,this.audioBtnImg , this.btnUntouchImg);
            recordBtn.x = this.btnYuyin.x;
            recordBtn.y = this.btnYuyin.y;
            this.root.addChild(recordBtn,99999);
            recordBtn.setBright(IMSdkUtil.isReady());
            this.btnYuyin.y += 200;
        }
        this.btnYuyin.visible = false;
        this.calcTime();
        this.calcWifi();
        this.scheduleUpdate();

        this.adjustInviteBtn();

        // if(BaseRoomModel.isBanVoiceAndProps()){
            this.recordBtn.setVisible(false);
        // }

        // if(LayerManager.isInMJ()){
        //     // this.btnInvite.setScale(2);
        //     // this.btnInvite.y = 100;
        // }
        //if(!(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName)){
            //this.btnInvite.setScale(1.2);
        //}
        if(BaseRoomModel.isGoldRoom() || BaseRoomModel.isGoldMatchRoom()){
            this.paomadeng = new PaoMaDeng();
            this.root.addChild(this.paomadeng, 10);
            this.paomadeng.anchorX = this.paomadeng.anchorY = 0;
            if(BaseRoomModel.isGoldRoom()){
                this.paomadeng.updatePosition(10-(cc.winSize.width-SyConfig.DESIGN_WIDTH)/2, 900);
            }else{
                this.paomadeng.updatePosition(10-(cc.winSize.width-SyConfig.DESIGN_WIDTH)/2, 840);
            }
            this.paomadeng.visible = false
            this.schedule(this.updateMarquee,1,cc.REPEAT_FOREVER,0);
        }
    },

    updateMarquee:function(dt){
        // GoldMatchRoomModel._msgdt += dt;
        // if (GoldMatchRoomModel._msgdt >= GoldMatchRoomModel._msgDdiff) {
        //     GoldMatchRoomModel._msgdt = 0;
        //     GoldMatchRoomModel.getMatchMarquee(this.paomadeng)
        // }

        if(!this.paomadeng.playing && !sy.scene.msgPlaying && PaoMaDengModel.getCurrentMsg()) {
            this.paomadeng.visible = true
            var curMsg = PaoMaDengModel.getCurrentMsg();
            this.paomadeng.matchPlay(curMsg);
        }else if(!this.paomadeng.playing && !sy.scene.msgPlaying && this.paomadeng.isVisible()){
            this.paomadeng.visible = false
        }
    },
    //微信邀请按钮统一换资源，增加亲友圈邀请按钮
    adjustInviteBtn:function(){
        var img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";
        var btn_wx_invite = this.btnInvite;
        btn_wx_invite.visible = false;
        btn_wx_invite.loadTextureNormal(img_wx);
        //cc.log("this.btnInvite====",JSON.stringify(BaseRoomModel.curRoomData))

        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName){
            var offsetX = 370;
            this.btn_qyq_back = new ccui.Button(img_back,"","");
            this.btn_qyq_back.setPosition(btn_wx_invite.width/2 - 2*offsetX,btn_wx_invite.height/2);
            UITools.addClickEvent(this.btn_qyq_back,this,this.onBackToPyqHall);
            // btn_wx_invite.addChild(this.btn_qyq_back);

            if(BaseRoomModel.curRoomData.strParams[4] == 1){
                img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
            }
            this.btn_qyq_invite = new ccui.Button(img_qyq,"","");
            this.btn_qyq_invite.visible = ClickClubModel.getIsForbidInvite();
            this.btn_qyq_invite.setPosition(btn_wx_invite.width/2 - offsetX,btn_wx_invite.height/2);
            UITools.addClickEvent(this.btn_qyq_invite,this,this.onShowInviteList);
            // btn_wx_invite.addChild(this.btn_qyq_invite);
            if(!ClubRecallDetailModel.isDTZWanfa(BaseRoomModel.curRoomData.wanfa)){
                btn_wx_invite.setPositionX(btn_wx_invite.x + (offsetX));
            }else{
                this.btn_qyq_invite.setPosition(btn_wx_invite.width/2,185);
                this.btn_qyq_back.setPosition(btn_wx_invite.width/2,319);
                btn_wx_invite.setPositionY(btn_wx_invite.y - 65);
            }
        }

    },

    onBackToPyqHall:function(){
        var pop = new PyqHall();
        pop.setBackBtnType(2);
        PopupManager.addPopup(pop);
    },

    /**
    * 设置语音按钮的按钮资源 可点击和 灰化按钮
     */
    setRadioBtnImg:function(){
        this.audioBtnImg = "res/ui/common/pdkRoom_4.png";
        this.btnUntouchImg = "res/ui/common/pdkRoom_5.png";
    },

    /**
     * 刷新时间
     */
    calcTime:function(){
        var date = new Date();
        var hours = date.getHours().toString();
        hours = hours.length < 2 ? "0"+hours : hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length < 2 ? "0"+minutes : minutes;
        if(this.labelTime){
            this.labelTime.setString(hours+":"+minutes);
        }else{
            this.labelTime = this.getLabelTime();
            if (this.labelTime) {
                this.labelTime.setString(hours + ":" + minutes);
            }
        }
    },

    /**
     * 获取网络状态的PNG图片
     * @param type
     * @returns {string}
     */
    getNetTypePNG:function(type){
        return "res/res_dtz/dtzRoom/net_"+type+".png";
    },

    /**
     * 检测网络状态
     */
    calcWifi:function(){
        var type = SdkUtil.getNetworkType();
        if(!type || type==0){
            this.netType.visible = false;
        }else{
            this.netType.loadTexture(this.getNetTypePNG(type));
        }
        var batteryNum = Math.ceil(SdkUtil.getBatteryNum()/100*31);
        this.battery.width = batteryNum;
    },

    update:function(dt){
        this._dt += dt;
        if(this._dt>=1){
            this._dt = 0;
            if(this._countDown >= 0 && this.countDownLabel){
                var countDown = (this._countDown<10) ? "0"+this._countDown : ""+this._countDown
                this.countDownLabel.setString(countDown);
                this._countDown--;
            }
            this._timedt+=1;
            if(this._timedt%60==0)
                this.calcTime();
            if(this._timedt>=180){
                this._timedt = 0;
                this.calcWifi();
            }
        }
    },

    /**
     * 收到进入房间消息后，初始化房间数据的统一入口
     */
    initData:function(){
        sy.scene.hideLoading();
        this._players = {};
    },

    /**
     * sdk调用，当语音使用状态改变
     */
    onRadioReady:function(event){
        var useful = event.getUserData();
        if(useful){
            // this.recordBtn.setBright(true);
        }else{
            this.recordBtn.setBright(false);
        }
    },

    /**
     * 点击准备按钮
     */
    onReady:function(){
        sySocket.sendComReqMsg(4);
    },

    /**
     * 点击邀请按钮
     */
    onInvite:function(){
        throw new Error("BaseRoom's subclass must override function onInvite");
    },

    onShowInviteList:function(){
        var inviteType = 0
        if(BaseRoomModel.curRoomData.strParams[4] == 1) inviteType = 2
        var pop = new PyqInviteListPop(inviteType);
        this.addChild(pop,1);
    },

    /**
     * 点击解散房间
     */
    onBreak:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    /**
     * 点击设置
     */
    onSetUp:function(){
        var mc = new SetUpPop();
        PopupManager.addPopup(mc);
    },

    /**
     * 点击退出房间
     */
    onLeave:function(){
        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.isClientData){
            CheckJoinModel.exitMatchRoom();
        }else{
            sySocket.sendComReqMsg(6);
        }
    },

    /**
     * 点击取消托管
     */
    onCancelTuoguan:function(){
        sySocket.sendComReqMsg(131);
    },

    /**
     * 点击聊天
     */
    onChat:function(){
        var mc = new ChatPop(this.getChatJSON());
        PopupManager.addPopup(mc);
    },

    /**
     * 加入房间
     * @param event
     */
    onJoin:function(event){
        throw new Error("BaseRoom's subclass must override function onJoin");
    },

    /**
     * 退出房间
     * @param event
     */
    onExitRoom:function(event){
        var p = event.getUserData();
        if(this._players[p.seat])
            this._players[p.seat].exitRoom();
        delete this._players[p.seat];
        // this.btnInvite.visible = (ObjectUtil.size(this._players) < MJRoomModel.renshu);
        this.btnInvite.visible = false;
    },

    /**
     * 获取聊天JSON
     */
    getChatJSON:function(){
        throw new Error("BaseRoom's subclass must override function getChatJSON");
    },

    /**
     * 获取每个房间的数据模型
     */
    getModel:function(){
        throw new Error("BaseRoom's subclass must override function getModel");
    },

    /**
     * 发牌动作，发牌后，游戏正式开始
     * @param event
     */
    startGame:function(event){
        throw new Error("BaseRoom's subclass must override function startGame");
    },

    /**
     * 出牌动作
     * @param event
     */
    onLetOutCard:function(event){
        throw new Error("BaseRoom's subclass must override function onLetOutCard");
    },

    /**
     * 每小局结束
     * @param event
     */
    onOver:function(event){
        throw new Error("BaseRoom's subclass must override function onOver");
    },

    /**
     * 玩家是否准备
     * @param event
     */
    onChangeStauts:function(event){
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        if(this._players[seat])
            this._players[seat].onReady();
        if(seat == this.getModel().mySeat){
            this.btnReady.visible = false;
        }
    },

    /**
     * 玩家在线or离线状态切换
     * @param event
     */
    onOnline:function(event){
        var data = event.getUserData();
        if(this._players[data[0]])
            this._players[data[0]].leaveOrOnLine(data[1]);
    },

    /**
     * 快捷语言聊天
     * @param event
     */
    onFastChat:function(event){
        var data = event.getUserData();
        var userId = data.userId;
        var p = this.getModel().getPlayerVo(userId);
        if(this._players[p.seat])
            this._players[p.seat].fastChat(data);
    },

    /**
     * 开始播放语音
     * @param event
     */
    onStartSpeak:function(event){
        var userId = event.getUserData();
        var p = this.getModel().getPlayerVo(userId);
        if(p && this._players[p.seat]){
            this._players[p.seat].startSpeak();
        }
    },

    /**
     * 语音播完了
     * @param event
     */
    onStopSpeak:function(event){
        var userId = event.getUserData();
        var p = this.getModel().getPlayerVo(userId);
        if(p && this._players[p.seat]){
            this._players[p.seat].stopSpeak();
        }
    },

    updateHands:function(event){
        var data = event.getUserData();
        var cards = data.params ? data.params : null;
        var wanfa = (BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.wanfa) ? BaseRoomModel.curRoomData.wanfa : 0;
        // cc.log("updateHands===",cards,wanfa,ClubRecallDetailModel.isPDKWanfa(wanfa));
        if (cards && cards.length > 0 && ClubRecallDetailModel.isPDKWanfa(wanfa)){
            // cc.log("cards====",JSON.stringify(cards));
            var allcardIds = [];
            for(var index = 0 ; index < cards.length ; index ++){
                allcardIds.push(PDKAI.getCardDef(parseInt(cards[index])));
            }
            this.initCards(allcardIds,true)
        }
    },
});
