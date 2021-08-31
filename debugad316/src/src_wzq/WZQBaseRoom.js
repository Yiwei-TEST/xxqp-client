/**
 * Created by zhoufan on 2016/12/16.
 */

var WZQBaseRoom = BaseLayer.extend({

    //房间内玩家对象的集合
    _players:{},
    _dt:0,
    _loacationDt:0,
    _countDown:30,
    _timedt:0,
    audioBtnImg:null,
    btnUntouchImg:null,


    ctor:function(json){
        cc.log("WZQBaseRoom",json)
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
    BATTERYBG:"BATTERYBG",
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
            case this.BATTERYBG:
                name = "batteryBg";
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
        this.netType = this.getWidget(this.getWidgetName(this.NET_TYPE));
        this.batteryBg = this.getWidget(this.getWidgetName(this.BATTERYBG));
        this.battery = new cc.Scale9Sprite("res/res_wzq/dianchitiao.png");
        this.battery.setAnchorPoint(0,0.5);
        this.battery.setPosition(3,this.batteryBg.height/2-1);
        this.battery.setContentSize(this.batteryBg.width - 10,this.battery.height);
        this.batteryBg.addChild(this.battery,1);
        this.labelTime = this.getLabelTime();
        UITools.addClickEvent(this.btnReady,this,this.onReady);
        UITools.addClickEvent(this.btnInvite,this,this.onInvite);
        this.btn_qyq_invite = this.getWidget("Button_qyqinvite")
        UITools.addClickEvent(this.btn_qyq_invite,this,this.onShowInviteList);
        if(this.btnBreak){
            UITools.addClickEvent(this.btnBreak,this,this.onBreak);
        }
        if(this.btnSetup){
            UITools.addClickEvent(this.btnSetup,this,this.onSetUp);
        }
        if(this.btnLeave){
            UITools.addClickEvent(this.btnLeave,this,this.onLeave);
        }
        //通用事件初始化
        this.addCustomEvent(SyEvent.JOIN_ROOM,this,this.onJoin);
        this.addCustomEvent(SyEvent.EXIT_ROOM,this,this.onExitRoom);
        this.addCustomEvent(SyEvent.START_PLAY,this,this.startGame);
        this.addCustomEvent(SyEvent.LET_OUT_CARD,this,this.onLetOutCard);
        this.addCustomEvent(SyEvent.OVER_PLAY,this,this.onOver);
        this.addCustomEvent(SyEvent.PLAYER_STATUS_CHANGE,this,this.onChangeStauts);
        this.addCustomEvent(SyEvent.ONLINE_OFFLINE_NOTIFY,this,this.onOnline);

        this.calcTime();
        this.calcWifi();
        this.scheduleUpdate();

        //this.adjustInviteBtn();

    },
    //微信邀请按钮统一换资源，增加亲友圈邀请按钮
    //adjustInviteBtn:function() {
    //    var img_wx = "res/ui/bjdmj/wx_invite.png";
    //    var img_qyq = "res/ui/bjdmj/qyq_invite.png";
    //    this.btnInvite = new ccui.Button(img_wx, "", "");
    //    this.btnInvite.setPosition(224, 254);
    //    cc.log("this.btnInvite====", JSON.stringify(BaseRoomModel.curRoomData))
    //    var offsetX = 350;
    //
    //    this.btn_qyq_invite = new ccui.Button(img_qyq, "", "");
    //    this.btn_qyq_invite.setPosition(224, 120);
    //    UITools.addClickEvent(this.btn_qyq_invite, this, this.onShowInviteList);
    //    this.addChild(this.btn_qyq_invite);
    //
    //},

    onBackToPyqHall:function(){
        var pop = new PyqHall();
        pop.setBackBtnType(2);
        PopupManager.addPopup(pop);
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
            this.labelTime.setString(hours+":"+minutes);
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
        var inviteType = 1
        var pop = new PyqInviteListPop(inviteType);
        this.addChild(pop);
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
        sySocket.sendComReqMsg(6);
    },

    /**
     * 点击取消托管
     */
    onCancelTuoguan:function(){
        sySocket.sendComReqMsg(131);
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
        //this.btnInvite.visible = (ObjectUtil.size(this._players)<MJRoomModel.renshu);
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

});
