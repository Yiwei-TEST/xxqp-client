/**
 * Created by Administrator on 2017/5/12.
 */
var QFRoom = BaseRoom.extend({

//原Room.js 中的代码
    _cardPanel: null,
    _cardW: 110,
    _cardG: 151, //65
    _cardY1: 17,
    _cardY2: 126,
    //用于卡牌定位
    firstLineLimit : 22,
    initCardYLine1 : 100,
    initCardYLine2 : 0,
    line1cardNumber:0,
    line2cardNumber:0,
    initX : 725,
    _cardScale:0.92,
    _letOutCardScale:0.85,
    /**
     * {Array.<QFBigCard>}
     */
    choiceTeamCardList: [],
    _cards: [],
    _allCards: [],
    _cCardPattern: null,
    _lastCardPattern: null,
    _lastLetOutSeat: 0,
    _touchedCards: null,
    _touchListener: null,
    _startId: null,
    _currentlyMoveId: null,
    _startX: null,
    _touchBeganX: null,
    _isLeft2Right: false,
    _isLeft2RightWithBegan: false,
    _players: null,
    seatSeq: {},
    _letOutButtonTouchable: null,

    //附加记录的卡牌
    _curChoiceCards:null,
    _curChoiceCardsTypeData:null,
    _curTipCard: null,
    _lastCardTypeData:null,

    //左上角分数详情
    roomCurScore:0,  //当前牌面分数
    roomFiveNum:0,   //5个数
    roomTenNum:0,    //10个数
    roomKNum:0,      //k个数
    //curaTeamScore:0, //本局a组得分
    //curbTeamScore:0, //本局b组得分
    //aTeamAllScore:0,    // a组总得分
    //bTeamAllScore:0,    // b组总得分
    //aTeamTongziScore:0, // a组总筒子分
    //bTeamTongziSscore:0,// b组总筒子分

    // 原OnlineRoom.js
    _statusMap: null,
    _dt: null,
    _countDown: null,
    _timedt: null,
    //
    _hasChoiceTeam: false,

    _pzLableColor: [],
    showResultTimeOutHandle:null,

    ctor: function () {
        this._letOutButtonTouchable = true;
        this._cards = [];
        this._allCards = [];
        this._touchedCards = [];
        this._players = {};
        this.seatSeq = QFRoomModel.seatSeq;
        var layerName = LayerFactory.QF_ROOM;
        this._renshu = 3;
        this._super(layerName);
        this._statusMap = {};
        this._dt = 0;
        this._countDown = QFRoomModel.getTuoguanTime() || 30;
        this._timedt = 0;
        this._curChoiceCards = null;
        this._curChoiceCardsTypeData = null;
        this._curTipCard =  null;
        this._lastCardTypeData = null;
    },

    /**
     * 获取网络状态的PNG图片
     * @param type
     * @returns {string}
     */
    getNetTypePNG:function(type){
        return "res/res_yjqf/qfRoom/net_" + type + ".png";
    },

    getWidgetName:function(wName){
        var name = "";
        switch(wName){
            case this.BTN_READY:
                name = "Button_30";
                break;
            case this.BTN_INVITE:
                name = "Button_17";
                break;
            case this.BTN_BREAK:
                name = "Button_6";
                break;
            case this.BTN_SETUP:
                name = "Button_23";
                break;
            case this.BTN_LEAVE:
                name = "Button_20";
                break;
            case this.BTN_CHAT:
                name = "Button_42";
                break;
            case this.BTN_YUYIN:
                name = "Button_40";
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

    getModel: function () {
        return QFRoomModel;
    },

    setRadioBtnImg:function(){
        this.audioBtnImg = "res/ui/common/pdkRoom_4.png";
        this.btnUntouchImg = "res/ui/common/pdkRoom_5.png";
    },

    selfRender: function () {
        //cc.log("DTZRoom...selfRender...!");
        BaseRoom.prototype.selfRender.call(this);

        for (var i = 1; i <= this._renshu; i++) {
            //if (i > 1)
            //    this.getWidget("bt" + i).visible = false;
            this.getWidget("ybq" + i).visible = false;
            UITools.addClickEvent(this.getWidget("player" + i), this, this.onPlayerInfo);
        }

        this.roomFiveNumLable = this.getWidget("LableFiveNum");//当前牌面5的个数
        this.roomTenNumLable = this.getWidget("LableTenNum");//当前牌面10的个数
        this.roomKNumLable = this.getWidget("LableKNum");//当前牌面K的个数

        this.yuyin = this.getWidget("yuyin");//语音
        this.yuyin.visible = false;
        this.Image_40 = this.getWidget("panel_time");//闹钟
        this.lableRoomRound = this.getWidget("lableRoomRound");//第几局
        this.lableRoomId = this.getWidget("lableRoomId");//房号
        this.Button_6 = this.getWidget("Button_6");//出牌;
        this.Button_4 = this.getWidget("Button_4");//提示;
        this.Button_giveUp = this.getWidget("ButtonGiveup");//不出牌
        this.Button_30 = this.getWidget("Button_30");//准备
        this.Button_20 = this.getWidget("Button_20");//退出房间
        this.Button_25 = this.getWidget("Button_25");//解散房间
        this.Image_set = this.getWidget("Image_set");
        this.jiesuanlable = this.getWidget("dtzJiesuan");//结算分lable
        this.jianglilable = this.getWidget("dtzJiangli");//奖励lable
        //this.RoomIdlable = this.getWidget("RoomIdImg");  //房号lable
        this.Button_sset = this.getWidget("Button_sset");
        //this.RoomScoreLable = this.getWidget("lableTitle_4");
        //this.RoomScoreLable.setString("喜分");

        //this.dark8Node = this.getWidget("dark8Node");//隐藏牌数
        //this.dark8Node.visible = false;

        UITools.addClickEvent(this.Button_sset, this, this.onZhanKai);
        this.visibleOpButton(false);
        this.Button_17 = this.getWidget("Button_17");//邀请微信好友
        this.Button_17.visible = false;
        this.Label_39 = this.getWidget("Label_39");//时间
        this.Button_40 = this.getWidget("Button_40");//语音按钮
        this.Button_42 = this.getWidget("Button_42");//快捷聊天
        this.Button_23 = this.getWidget("Button_23");//设置

        this.lastCardPanel = this.getWidget("Panel_lastCard");//剩余牌层

        UITools.addClickEvent(this.Button_42, this, this.onChat);
        UITools.addClickEvent(this.Button_23, this, this.onSetUp);
        var cardPanel = this._cardPanel = ccui.helper.seekWidgetByName(this.root, "cardPanel");
        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        });
        cc.eventManager.addListener(this._touchListener, cardPanel);

        // PDKRoom.js selfRender
        this.uidText = this.getWidget("uid1");
        this.Panel_37 = this.getWidget("Panel_37");
        this.Panel_36 = this.getWidget("Panel_36");
        this.Panel_15 = this.getWidget("Panel_15");
        this.battery = this.getWidget("battery");
        this.netType = this.getWidget("netType");

        // cc.log("cc.winSize.width =",cc.winSize.width);
        if(cc.winSize.width > SyConfig.DESIGN_WIDTH && cc.winSize.width < 2400){
            var bgTexture = "res/res_yjqf/qfRoom/zhuodi.png";
            this.Panel_15.setBackGroundImage(bgTexture);
            var rightLine = new cc.Sprite("res/res_yjqf/qfRoom/zuo.png");
            var leftLine = new cc.Sprite("res/res_yjqf/qfRoom/you.png");
            rightLine.x = (SyConfig.DESIGN_WIDTH - cc.winSize.width )/2 + rightLine.width/2;
            leftLine.x = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 - leftLine.width/2 + SyConfig.DESIGN_WIDTH ;
            rightLine.y = leftLine.y = rightLine.height/2;
            this.Panel_15.addChild(rightLine);
            this.Panel_15.addChild(leftLine);
            // cc.log("leftLine.x =",leftLine.x);
        }else if(cc.winSize.width >= 2400){
            var bgTexture = "res/res_yjqf/qfRoom/zhuodi.png";
            this.Panel_15.setBackGroundImage(bgTexture);
        }

        // cc.log("this.recordBtn =",this.recordBtn.isVisible());
        // cc.log("this.recordBtn =",JSON.stringify(this.recordBtn.getPosition()));
        this.roomName_label = new cc.LabelTTF("","Arial",38,cc.size(500, 40));
        this.addChild(this.roomName_label, 10);
        if (QFRoomModel.roomName){
            this.roomName_label.setString(QFRoomModel.roomName);
            this.roomName_label.setColor(cc.color(214,203,173));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = cc.winSize.width/2 ;
            this.roomName_label.y = cc.winSize.height/2 + 150;
        }

        var paiNumStr = "模式：3副牌";

        //隐藏不需要显示的
        this.paiNumLabel = this.getWidget("Label_paiNum");
        this.paiNumLabel.setString(paiNumStr);
        this.paiNumLabel.setString("");

        this.Image_game = this.getWidget("Image_game");
        this.Image_game.visible = false;
        var endScoreStr = "结算：" + QFRoomModel.endScore;
        var exScoreStr =  "奖励：" + QFRoomModel.exScore;

        this.awardLabel = this.getWidget("Label_award");
        this.awardLabel.setString(exScoreStr);
        this.awardLabel.setString("");

        this.jsScoreLabel = this.getWidget("Label_jsScore");
        this.jsScoreLabel.setString(endScoreStr);
        this.jsScoreLabel.setString("");

        var wanfaString = "留6和7"
        if(QFRoomModel.intParams[3]==2){
            wanfaString = "不留6和7"
        }
        var wanfaString1 = " 排名+100/-40/-60";
        if(QFRoomModel.intParams[5]==2){
            wanfaString1 = " 排名+100/-30/-70"
        }else if(QFRoomModel.intParams[5]==3){
            wanfaString1 = " 排名+40/0/-40"
        }else if(QFRoomModel.intParams[5]==4){
            wanfaString1 = " 排名+60/-60"
        }else if(QFRoomModel.intParams[5]==5){
            wanfaString1 = " 排名+40/-40"
        }
        this.paiNumLabel.setString(wanfaString + wanfaString1);

        var wanfaString2 = "喜分算加法"
        if(QFRoomModel.intParams[4]==2){
            wanfaString2 = "喜分算乘法"
        }
        var wanfaString3 = " 奖分100";
        if(QFRoomModel.intParams[6]==2){
            wanfaString3 = " 奖分200"
        }
        this.jsScoreLabel.setString(wanfaString2 + wanfaString3);

        //伸缩按钮
        this.allScoreShowBtn = this.getWidget("btn_AllScoreShow");
        this.allScoreHideBtn = this.getWidget("btn_AllScoreHide");
        //this.curScoreShowBtn = this.getWidget("btn_curScoreShow");
        //this.curScoreHideBtn = this.getWidget("btn_curScoreHide");
        //this.curTouchPanel = this.getWidget("curScoreTouchPanel");
        //this.allTouchPanel = this.getWidget("allScoreTouchPanel");

        this.allScoreNode = this.getWidget("allScoreImg");
        //this.curScoreNode = this.getWidget("curScoreImg");


        UITools.addClickEvent(this.Panel_15, this, this.onCancelSelect, false);
        UITools.addClickEvent(this.Button_6, this, this.onPlayCard);
        UITools.addClickEvent(this.Button_4, this, this.onPlayTip);
        UITools.addClickEvent(this.Button_17, this, this.onInvite);
        UITools.addClickEvent(this.Button_30, this, this.onReady);
        UITools.addClickEvent(this.Button_20, this, this.onLeave);
        UITools.addClickEvent(this.Button_25, this, this.onBreak);
        UITools.addClickEvent(this.Button_giveUp , this , this.onGiveUp);


        this.addCustomEvent(SyEvent.JOIN_ROOM, this, this.onJoin);
        this.addCustomEvent(SyEvent.EXIT_ROOM, this, this.onExitRoom);
        this.addCustomEvent(SyEvent.START_PLAY, this, this.startGame);
        this.addCustomEvent(SyEvent.LET_OUT_CARD, this, this.onLetOutCard);
        this.addCustomEvent(SyEvent.OVER_PLAY, this, this.onOver);
        this.addCustomEvent(SyEvent.PLAYER_STATUS_CHANGE, this, this.onChangeStauts);
        this.addCustomEvent(SyEvent.ONLINE_OFFLINE_NOTIFY, this, this.onOnline);
        this.addCustomEvent(SyEvent.ROOM_FAST_CHAT, this, this.onFastChat);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_START, this, this.onStartSpeak);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_FINISH, this, this.onStopSpeak);
        this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction);
        //this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS , this,this.updateGpsBtn);
        this.addCustomEvent(SyEvent.ROOM_ROLD_ICON , this,this.setRoldPlayerIcon);
        //this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBgColor);
        this.addCustomEvent(SyEvent.QF_DEAL_SCORE , this , this.onDealScore);
        this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);


        this.countDownLabel = new cc.LabelBMFont(this._countDown, "res/font/font_phz_countdown.fnt");
        this.countDownLabel.x = this.Image_40.width / 2;
        this.countDownLabel.y = this.Image_40.height / 2 + 8;
        this.Image_40.addChild(this.countDownLabel);

        //显示版本号
        this.getWidget("Label_version").setString(SyVersion.v);

        //GPS
        this.btn_Gps = this.getWidget("Button_gps");
        if(QFRoomModel.renshu > 2){
            this.btn_Gps.visible = true;
        }else{
            this.btn_Gps.visible = false;
        }
        //if(GPSModel.getGpsData(PlayerModel.userId) == null){
        //    this.btn_Gps.setBright(false);
        //    this.btn_Gps.setTouchEnabled(false);
        //}else{
            this.btn_Gps.setBright(true);
            this.btn_Gps.setTouchEnabled(true);
        //}
        UITools.addClickEvent(this.btn_Gps ,this,this.onGpsPop);

        this.btn_cardNote = this.getWidget("btn_cardNote");
        this.btn_cardNote.visible = false;
        UITools.addClickEvent(this.btn_cardNote ,this,this.onCardNote);


        this.Image_bg = this.getWidget("Image_bg");//背景图
        //初始化牌桌字体颜色
        this.initLabelColor();

        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//取消托管按钮
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            this.bg_CancelTuoguan.setLocalZOrder(100);
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

    },

    showAddScoreAni:function(seat,callback){
        // var seat = 1;
        var direct = this.getPlayerSeq(-2, QFRoomModel.mySeat,seat);
        var curPlayer = this._players[seat];
        var coords =  {1:{x:61,y:-51},2:{x:-83 ,y:62},3:{x:126,y:63}};
        var targetX = curPlayer.getContainer().x + coords[direct].x;
        var targetY = curPlayer.getContainer().y + coords[direct].y;
        var runActionFunc = function(targetX,targetY,label){
            var spawn = cc.Spawn(cc.moveTo(0.5,targetX,targetY),cc.tintTo(0.5 , 255 , 255 , 255));
            var action = cc.sequence(cc.delayTime(1),spawn,cc.callFunc(function(){
                label.removeFromParent(true);
                callback();
            }));
            label.runAction(action);
        }

        if (this.roomFiveNum > 0){
            var fiveNumScore = new cc.LabelTTF(this.roomFiveNum*5+"分","Arial",40);
            fiveNumScore.setColor(cc.color(255,255,0));
            fiveNumScore.setPosition(cc.p(801,892));
            this.Panel_15.addChild(fiveNumScore,999);
            runActionFunc(targetX,targetY,fiveNumScore);
        }
        if (this.roomTenNum > 0){
            var tenNumScore = new cc.LabelTTF(this.roomTenNum*10+"分","Arial",40);
            tenNumScore.setPosition(cc.p(957,892));
            tenNumScore.setColor(cc.color(255,255,0));
            this.Panel_15.addChild(tenNumScore,999);
            runActionFunc(targetX,targetY,tenNumScore);

        }
        // cc.log("this.roomKNum =",this.roomKNum);
        if (this.roomKNum > 0){
            var kNumScore = new cc.LabelTTF(this.roomKNum*10+"分","Arial",26);
            // kNumScore.setString((this.roomKNum*10)+""+"分")
            kNumScore.setColor(cc.color(255,255,0));
            kNumScore.setPosition(cc.p(1110,892));
            this.Panel_15.addChild(kNumScore,999);
            runActionFunc(targetX,targetY,kNumScore);
        }
    },
    /**
     * 点击取消托管
     */
    onCancelTuoguan:function(){
        sySocket.sendComReqMsg(131);
    },

    updatePlayTuoguan:function(event){
        var data = event.getUserData();
        // cc.log("updatePlayTuoguan..." , data);
        //data = data.split(",");
        var self = this;
        if(data.length >= 2){
            //var userId = data[0];
            var seat = data[0];
            var isTuoguan = data[1];
            // cc.log("seat , isTuoguan" , seat , isTuoguan);
            var player = this._players[seat];
            if(player){
                player.updateTuoguan(isTuoguan);
            }else{
                cc.log("!!!!!!!未获取到player");
            }
            if(seat == QFRoomModel.mySeat && this.bg_CancelTuoguan){
                if (isTuoguan){
                    this.showTuoGuanTimeOutHandle = setTimeout(function(){//延时显示取消托管
                        self.bg_CancelTuoguan.visible = isTuoguan;
                    },2000);
                }else{
                    self.bg_CancelTuoguan.visible = isTuoguan;
                }
            }
        }
    },

    onCardNote: function() {
        sySocket.sendComReqMsg(129);
        //var args = {1:[[111,211],[308,408]],2:[[108,208]],3:[[312,412]]};
        //PopupManager.addPopup(new QFCardNote(args));
    },

    onChat:function(){
        var mc = new ChatPop("res/qfChat.json");
        PopupManager.addPopup(mc);
    },
    
    cleanRoom: function(){
        if(this.player3card) {
            this.player3card.visible = false;
        }
        if (this._cards.length > 0) {//清理掉上一局的牌
            for (var i = 0; i < this._cards.length; i++) {
                this._cardPanel.removeChild(this._cards[i]);
            }
            this._cards.length = 0;
        }
        for (var i = 1; i <= this._renshu; i++) {
            this.getWidget("ybq" + i).visible = false;
            this.getWidget("zhunbei" + i).visible = false;
            this.getWidget("small" + i).removeAllChildren(true);
        }
        this.lastCardPanel.removeAllChildren();
    },

    initData: function (isConnect) {
        //移除上一把的结算页面(托管开始下一局的时候)
        //PopupManager.removeClassByPopup(DTZSmallResultPop);
        if(this.showResultTimeOutHandle){
            clearTimeout(this.showResultTimeOutHandle);
            this.showResultTimeOutHandle = null;
        }
        if(this.bg_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
        }
        this.roomName_label.setString(QFRoomModel.roomName);

        if(this.showTuoGuanTimeOutHandle){
            clearTimeout(this.showTuoGuanTimeOutHandle);
            this.showTuoGuanTimeOutHandle = null;
        }
        this.Image_40.visible =false;
        this.initCardYLine1 = QFRoomModel.initCardYLine1;
        this.initCardYLine2 = QFRoomModel.initCardYLine2;
        this.initX = QFRoomModel.initX;
        this._cardScale = QFRoomModel._cardScale;
        this._letOutCardScale = QFRoomModel._letOutCardScale;
        this._curChoiceCards = null;
        this._curChoiceCardsTypeData = null;
        this._curTipCard =  null;
        this._lastCardTypeData = null;
        QFRoomSound.bombNumber = 0;
        var players = QFRoomModel.players;

        for (var i=0;i<players.length;i++) {
            //var group = QFRoomModel.getPlayerGroup(players[i]);
            var name = players[i].name;
            name = CustomTextUtil.subTextWithFixWidth(name, 80, 20);
        }

        this.seatSeq = QFRoomModel.seatSeq;
        sy.scene.hideLoading();
        // this.Image_40.visible = false;
        this.lableRoomRound.setString(QFRoomModel.nowBurCount);
        this._players = {};
        //分数相关
        this.roomFiveNum = 0;
        this.roomTenNum = 0;
        this.roomKNum = 0;
        this.roomCurScore = 0;  //当前牌面分数

        for (var i = 1; i <= this._renshu; i++) {
            this.getWidget("player" + i).visible = false;
            this.getWidget("ybq" + i).visible = false;
            this.getWidget("zhunbei" + i).visible = false;
            this.getWidget("small" + i).removeAllChildren(true);
            if (this._players[i] != null) {
                this._players[i].refreshAllScore();
            }
        }

        if (this._cards.length > 0) {//清理掉上一局的牌
            for (var i = 0; i < this._cards.length; i++) {
                this._cardPanel.removeChild(this._cards[i]);
            }
            this._cards.length = 0;
        }
        this._lastCardPattern = null;
        //this.Button_6.visible = this.Button_4.visible = false;
        this.visibleOpButton(false);
        this.Button_30.visible = (QFRoomModel.mySeat != 0);
        var isContinue = false;//是否是恢复牌局
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            isContinue = (p.handCardIds.length > 0 || p.outCardIds.length > 0 || p.mingci > 0);//p.mingci 该玩家可能确实没有手牌了
            if (isContinue)
                break;
        }

        //判断当前玩家数量
        var isFirstOut = null;
        var isMyFirstOut = false;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if(p.seat == QFRoomModel.mySeat){
                isMyFirstOut = QFRoomModel.getPlayerIsFirstOut(p);
            }
        }
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            //分组结束后 显示所有玩家 并且 我自身在一号位置
            var seq = this.getPlayerSeq(p.userId, QFRoomModel.mySeat, p.seat);
            var cardPlayer = this._players[p.seat] = new QFCardPlayer(p, this.root, seq , p.group);
            if (!isContinue) {
                if (p.status)
                    cardPlayer.showStatus(p.status);
            } else {//恢复牌局
                if (p.outCardIds.length > 0) {//模拟最后一个人出牌
                    if ((p.userId == PlayerModel.userId && QFRoomModel.nextSeat == p.seat)
                    ||(p.handCardIds.length <= 0 && QFRoomModel.nextSeat == QFRoomModel.mySeat && isMyFirstOut)) {
                        this._lastCardPattern = null;
                        this._lastCardTypeData = null;
                        QFRoomSound.bombNumber = 0;
                    } else {
                        var cardTransData = [];
                        for (var j = 0; j < p.outCardIds.length; j++) {
                            cardTransData.push(QFAI.getCardDef(p.outCardIds[j]));
                        }
                        this._lastCardPattern = QFAI.filterCards(cardTransData);
                       /* cc.log("cardTransData:",JSON.stringify(cardTransData));
                        cc.log("this._lastCardTypeData",JSON.stringify(this._lastCardTypeData));*/
                        this._lastCardTypeData = QFAI.getCardsType(cardTransData , this._lastCardTypeData);
                    }
                    this._lastLetOutSeat = p.seat;
                    p.ext[1] += p.outCardIds.length;
                    this.letOutCards(p.outCardIds, p.seat , QFRoomModel.nextSeat , isContinue);
                } else {
                    if (p.recover.length > 0) {//恢复牌局的状态重设
                        //if (p.recover[0] == 0) {
                        //    if (p.userId == PlayerModel.userId && QFRoomModel.nextSeat == p.seat) {//要不起，轮到我出牌，需要通知后台
                        //        if (QFRoomModel.is3Ren()) {
                        //            sySocket.sendComReqMsg(124 , []);
                        //        }
                        //    }else{
                        //        cardPlayer.showStatus(-1);
                        //    }
                        //}
                    }
                }
                //cardPlayer.showLastCard();
            }
            if (p.recover.length > 2) {
                cardPlayer.leaveOrOnLine(p.recover[2]);
            }
            if (QFRoomModel.isAutoPlay() && QFRoomModel.getPlayerIsTuoguan(p)){
                cardPlayer.updateTuoguan(true)
            }
            if (p.userId == PlayerModel.userId) {//自己的状态处理
                if (p.handCardIds.length > 0) {
                    isFirstOut = QFRoomModel.getPlayerIsFirstOut(p);
                    //this.visibleOpButton(( QFRoomModel.nextSeat == QFRoomModel.mySeat) , false);
                    this._players[QFRoomModel.mySeat].deal(p.handCardIds);
                    var isTuoguan = QFRoomModel.getPlayerIsTuoguan(p);
                    var showAction = !isConnect && !isTuoguan;
                    this.initCards(p.handCardIds,showAction && !isContinue);
                } else {//恢复牌局的时候 我自身已经没有牌了 要发出牌消息告诉后台 来跳过自己
                    if(isContinue){
                        this.visibleOpButton(false);
                        if(QFRoomModel.nextSeat == QFRoomModel.mySeat){
                            this.sendPlayCardMsg(0,[]);
                        }
                    }
                }

                //判断是否需要显示 取消托管按钮
                if(this.bg_CancelTuoguan){
                    var isMeTuoguan = QFRoomModel.getPlayerIsTuoguan(p);
                    cc.log("断线重连判断是否是托管状态..."  , isMeTuoguan);
                    this.bg_CancelTuoguan.visible = isMeTuoguan;
                }

                if (p.status){
                    this.Button_30.visible = false;
                }
            }
        }

        //显示桌面 5，10，k的个数和总分
        QFExfunc.countCurScoreAndNumber(this , QFRoomModel.scoreCard);

        //if (isFirstOut){
        //    this.visibleOpButton(( QFRoomModel.nextSeat == QFRoomModel.mySeat) , false);
        //}
        //IP相同的显示
        if(players.length>1 && QFRoomModel.renshu != 2){
            var seats = QFRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }
        if (isContinue) {
            this.showJianTou(QFRoomModel.nextSeat);
            if (QFRoomModel.isNextSeatBt()) {
            }
        }
        this.uidText.setString("UID：" + PlayerModel.userId);
        this.Button_17.visible = (players.length < QFRoomModel.renshu);
        this.lableRoomId.setString(QFRoomModel.tableId);
        //不用显示不要按钮
        this.Button_giveUp.visible = false;
        //cc.log("QFRoomModel.cutCardSeat = "+QFRoomModel.cutCardSeat);
        this.lastCardPanel.removeAllChildren();
        if(QFRoomModel.cutCardSeat != 0 && this._cards.length == 0){
            this.Button_30.visible = false;
            this.cleanRoom();
            var mc = new CutCardPop(QFRoomModel.mySeat != QFRoomModel.cutCardSeat);
            PopupManager.addPopup(mc);
        }
        //cc.log("end this._lastCardTypeData%%%%%%%%%="+JSON.stringify(this._lastCardTypeData));
        var isNew = true;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if(p.handCardIds.length > 0 || p.outCardIds.length > 0){
                isNew = false;
            }
        }
        if (isNew) {
            for (var i = 1; i <= this._renshu; i++) {
                if (this._players[i] != null) {
                    this._players[i].hideNumber();
                }
            }
        }
    },


    //这种情况是前端无法独立解析 飞机牌的连续次数 要依赖后台的数据修正
    specialDealForLastCards:function(realSerialNum){
        //cc.log("specialDealForLastCards")
        //cc.log("realSerialNum:::::::::::::"+realSerialNum)
        if( this._lastCardTypeData
            && (this._lastCardTypeData.type == QFAI.PLANE || this._lastCardTypeData.type == QFAI.PLANEWithCard)
            && this._lastCardTypeData.serialNum != realSerialNum ){

            var oldSerialNum = this._lastCardTypeData.serialNum;
            this._lastCardTypeData.serialNum  = realSerialNum;
            this._lastCardTypeData.value = this._lastCardTypeData.value + (oldSerialNum - realSerialNum);
        }
    },

    /**
     * 不出牌
     */
    onGiveUp: function (){
        sySocket.sendComReqMsg(124 , []);
        this.visibleOpButton(false);
    },

    /**
     * 不出牌的回调
     */
    resGiveUp:function(){
        this.visibleOpButton(false);
        this.onCancelSelect();
    },

    onCancelSelect: function () {
        var isHas = false;
        //cc.log("onCancelSelect!!!!!!!!!!!!!!!!111");
        this._curChoiceCards = null;
        for (var i = 0; i < this._cards.length; i++) {
            if (this._cards[i].isEnable()) {
                isHas = true;
                break;
            }
        }
        //cc.log("isHas = "+isHas)
        if (!isHas) {
            this.unSelectAllCards();
            this._allCards.length = 0;
            this.isCanLetOut();
        }
    },

    onOver: function (event) {
        var data = event.getUserData();
        if(PlayQFMessageSeq.sequenceArray.length>0){
            PlayQFMessageSeq.cacheClosingMsg(data);
            return;
        }
        
        this.visibleOpButton(false);
        // this.Image_40.visible  = false;
        var self = this;

        //清空玩家名次 和 光圈效果
        for (var i = 1; i <= self._renshu; i++) {
            if (this._players[i] != null) {
                this._players[i].hideNumber();
                this._players[i].playerQuanAnimation(false);
            }
        }

        var birdslist = [];
        for (var i = 0; i < QFRoomModel.overbird.length; i++) {
            birdslist.push(QFAI.getCardDef(QFRoomModel.overbird[i]));
        }

        this.showResultTimeOutHandle = setTimeout(function () {//延迟弹出结算框
            self.onshowLastCard(birdslist);
            setTimeout(function(){
                for (var i = 1; i <= self._renshu; i++) {
                    self.getWidget("ybq" + i).visible = false;
                    self.getWidget("zhunbei" + i).visible = false;
                }
                for (var i = 0; i < data.length; i++) {
                    self._players[data[i].seat].refreshAllScore();
                    self._players[data[i].seat].showNumber(0);
                }

                //if(ClosingInfoModel.round == QFRoomModel.nowBurCount){
                    self.cleanRoom();
                    var mc = new QFSmallResultPop(data);
                    PopupManager.addPopup(mc);
                //}
            }, 1000);
        }, 500);
    },

    //显示剩余牌
    onshowLastCard: function (cards) {
        this.lastCardPanel.removeAllChildren();
        for (var i = 0; i < cards.length; i++){
            var card = new QFBigCard(cards[i]);
            //card.anchorX = card.anchorY = 0.5;
            card.scale = 0.8;
            card.x = 60+i*53;
            card.y = 38;
            card.setLocalZOrder(i);
            this.lastCardPanel.addChild(card);
        }
    },

    /**
     * 收到出牌消息，前台开始处理
     * @param event
     */
    onLetOutCard: function (event) {
        this.changeLetOutButton(false);
        this._countDown = QFRoomModel.getTuoguanTime() || 30;

        //某种莫名的情况下 玩家的准备字样又显示出来了 增加一个保护
        for (var i = 1; i <= this._renshu; i++) {
            //this.getWidget("ybq" + i).visible = false;
            this.getWidget("zhunbei" + i).visible = false;
        }
        var self = this;
        var buyao = false;
        var message = event.getUserData();
        var seat = message.seat;
        var isFirstOut = message.isFirstOut;
        if (seat == QFRoomModel.mySeat) {//我自己出牌了，清理掉选择的牌
            this._allCards.length = 0;
            for (var i = 0; i < this._cards.length; i++) {
                this._cards[i].unselected();
            }
            this._curTipCard = null; //清理掉上次提示的牌
            this.enableAllCards();
        }
        this._players[seat].leaveOrOnLine(2);
        //下个出牌的位置
        var nextSeat = message.nextSeat;
        if (message.cardIds.length == 0) {//不要
            buyao = true;
            this._players[seat].showStatus(-1);
        } else {
            //已经出牌了
            var ids = message.cardIds;
            var cardTransData = [];
            for (var i = 0; i < ids.length; i++) {
                cardTransData.push(QFAI.getCardDef(ids[i]));
            }
            //if(message.isPlay == 2 && cardTransData.length > 0){
            if(message.isPlay != 2 ){
                if (cardTransData.length > 0){
                    this._lastCardPattern = QFAI.filterCards(cardTransData);
                    this._lastCardTypeData = QFAI.getCardsType(cardTransData , this._lastCardTypeData);
                }
            }
            this._lastLetOutSeat = seat;
            //cc.log("this._lastLetOutSeat = seat:::"+seat)
        }

        if(message.isPlay != 2 && !isFirstOut){
            cc.log("nextSeat == QFRoomModel.mySeat =",nextSeat == QFRoomModel.mySeat);
            if(seat != QFRoomModel.mySeat && !this.bg_CancelTuoguan.isVisible() && nextSeat == QFRoomModel.mySeat)
                this.onlyOneChooseCardsOut();
        }

        //cc.log("")
        //cc.log("nextSeat:::"+nextSeat)
        //cc.log("this._lastLetOutSeat:::"+this._lastLetOutSeat)
        //cc.log("QFRoomModel.mySeat:::"+QFRoomModel.mySeat)
        //

        var playerVo = QFRoomModel.getPlayerVoBySeat(seat);
        if (playerVo != null) {
            playerVo.ext[0]  = message.isBt;
        }

        //var isClean = false;
        if (nextSeat == QFRoomModel.mySeat) {//轮到我出牌了
            if (this._lastLetOutSeat == QFRoomModel.mySeat){//转了一圈 没人要的起
                this._lastCardPattern = null;
                this._lastCardTypeData = null;
                QFRoomSound.bombNumber = 0;
                this.getWidget("small1").removeAllChildren(true);
            }
            if(isFirstOut){
                //isClean = true;
                this.visibleOpButton(true , false);
            }else{
                this.visibleOpButton(true);
            }
            this.showJianTou(nextSeat);
            this.isCanLetOut();

            if(self._cards.length == 0){ //我已经打完了所有牌
                this.sendPlayCardMsg(0 , []);
                this.visibleOpButton(false);
            }
            //三人打筒子要不起由后台触发，前端回复确认消息就行
            if (QFRoomModel.is3Ren() && message.isLet===0) {
                this.visibleOpButton(false);
            }
            this.onPlayTip(true);
        } else {
            this.showJianTou(nextSeat);
            this.visibleOpButton(false);
        }

        //记录当前牌面分数和 5 10 K的个数
        QFExfunc.countCurScoreAndNumber(this , message.scoreCard);

        if (!buyao) {
            QFRoomSound.letOutSound(message.userId , this._lastCardTypeData);
        } else {
            QFRoomSound.yaobuqi(message.userId);
            if(seat == QFRoomModel.mySeat){
                QFRoomSound.bombNumber = 0;
            }
        }

        this.letOutCards(message.cardIds, message.seat ,message.nextSeat);
        PlayQFMessageSeq.finishPlay();
    },

    update:function(dt){
        this._dt += dt;
        PlayQFMessageSeq.updateDT(dt);
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
     * 发送出牌消息
     * @param type
     * @param allCards
     */
    sendPlayCardMsg: function (type, allCards) {
        var build = MsgHandler.getBuilder("proto/PlayCardReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var PlayCardReq = builder.build("PlayCardReq");
        var cardIds = [];
        for (var i = 0; i < allCards.length; i++) {
            cardIds.push(allCards[i].c);
        }
        var msg = new PlayCardReq();
        msg.cardIds = cardIds;
        msg.cardType = type;
        cc.log("玩家出牌："+JSON.stringify(cardIds));
        sySocket.send(msg, msgType);
    },

    /**
     * 出牌动作
     */
    onPlayCard: function (obj, tongziBreak , boomBreak , superboomBreak , xiBreak) {
        var self = this;
        tongziBreak = tongziBreak || false;
        boomBreak = boomBreak || false;
        superboomBreak = superboomBreak || false;
        xiBreak = xiBreak || false;
        //如果过了任意检测就直接出牌 玩家已经点击确认 不在考虑其他拆开的情况
        if(tongziBreak || boomBreak || superboomBreak || xiBreak){
            //cc.log("检测当前要打的牌的类型..." , JSON.stringify(curCardsTypeData));
            var curCardsTypeData = QFAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
            this.sendPlayCardMsg(curCardsTypeData.type , this._curChoiceCards);
            return ;
        }

        if (this._curChoiceCardsTypeData) {//this._cCardPattern
            if(!boomBreak && QFExfunc.isBombBreak(this)){
                //AlertPop.show("炸弹被拆散，确定出牌吗？", function () {
                //    self.onPlayCard(obj, false , true , false , false , false);
                //});

                AlertPop.show("炸弹不能被拆散", function () {
                    //self.onPlayCard(obj, false , true , false , false , false);
                });
                return;
            }

        }

        var curCardsTypeData = QFAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
        //cc.log("检测当前要打的牌的类型..." , JSON.stringify(curCardsTypeData));
        this.sendPlayCardMsg(curCardsTypeData.type , this._curChoiceCards);
    },

    onlyOneChooseCardsOut:function(){
        var result = [];
        var curTipCards = [];
        if(this._lastCardTypeData != null){
            result = QFAI.autoGetCards(null , this._cards , this._lastCardTypeData);
            curTipCards = result;
        }
        if(curTipCards != null && curTipCards.length > 0){
            result = QFAI.autoGetCards(curTipCards , this._cards , null);
            // cc.log("result.length ",result.length);
            if(result.length == 0){
                result = curTipCards ;
                if(result != null && result.length > 0){
                    //先把现在选中的牌取消
                    this.unSelectAllCards();
                    this._curTipCard = result;
                    this._curChoiceCards = result;
                    this._allCards = result;

                    for (var i = 0; i < result.length; i++) {
                        var card = result[i];
                        card.selectAction();
                    }
                    this._cCardPattern = QFAI.filterCards(this._curChoiceCards,QFExfunc.getCardsOnHand(this),this._lastCardPattern);
                    this._curChoiceCardsTypeData = QFAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
                    QFRoomModel.prompt(this._cCardPattern , result);
                    this.isCanLetOut();
                }
            }
        }
    },
    onPlayTip: function (isCheckOnece) { //是不是只是检查能够一手甩牌，如果是，直接出牌而不是选中牌，如果不能不做处理
        if(!this.Button_6.visible){
            return;
        }
        //获取当前要比较的牌面
        var result = [];
        if(this._curTipCard != null && this._curTipCard.length > 0){ //递归进行提示 在已经提示了一组牌的情况下 去找下一组提示牌
            result = QFAI.autoGetCards(this._curTipCard , this._cards , null);
            if(result.length == 0){
                if(this._lastCardTypeData != null){
                    result = QFAI.autoGetCards(null , this._cards , this._lastCardTypeData);
                }else{
                    result = QFAI.autoGetUnlimitCards(this._cards);
                }
            }
        }else if(this._lastCardTypeData != null){ //按照当前记录的上家牌型来提示第一手牌
            result = QFAI.autoGetCards(null , this._cards , this._lastCardTypeData);
        }else{//无限制提示,本轮是我出首牌
            result = QFAI.autoGetUnlimitCards(this._cards);
        }

        // cc.log("result =",JSON.stringify(result));
        if(isCheckOnece === true && !this.bg_CancelTuoguan.isVisible()){
            // if(result.length == this._cards.length){
            //     //先把现在选中的牌取消
            //     this.unSelectAllCards();
            //     var self = this;
            //     cc.log("1 秒后执行出牌")
            //     setTimeout(function(){
            //         cc.log("执行出牌")
            //         self._curTipCard = result;
            //         self._curChoiceCards = result;
            //         self._allCards = result;
            //         self.onPlayCard(null, false , true , false , false , false);
            //     },1000);
            // }
        }else{
            //先把现在选中的牌取消
            this.unSelectAllCards();
            this._curTipCard = result;
            this._curChoiceCards = result;
            this._allCards = result;
            for (var i = 0; i < result.length; i++) {
                var card = result[i];
                card.selectAction();
            }
            //cc.log("this._curTipCard=",JSON.stringify(this._curTipCard));
            this._cCardPattern = QFAI.filterCards(this._curChoiceCards,QFExfunc.getCardsOnHand(this),this._lastCardPattern);
            this._curChoiceCardsTypeData = QFAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
            QFRoomModel.prompt(this._cCardPattern , result);
            this.isCanLetOut();
        }
    },

    /**
     * 邀请
     */
    onInvite: function () {
        //cc.log("房间信息:" , QFRoomModel.wanfa  , QFRoomModel.costFangFei , QFRoomModel.endScore , QFRoomModel.exScore);
        var fangfeiDesc = "";
        var wanfaDesc = "";
        var save6Desc = QFRoomModel.getSave67Str();
        var xiWayDesc = QFRoomModel.getXiWayStr();
        var exScoreDesc = QFRoomModel.getExScoreStr();
        var cfRewardDesc = QFRoomModel.getCfReward();


        fangfeiDesc = "房主支付";
        if (QFRoomModel.getCostFangShi() == 1){
            fangfeiDesc = "AA支付";
        }else if (QFRoomModel.getCostFangShi() == 3) {
            fangfeiDesc = "群主支付";
        }
        wanfaDesc = QFRoomModel.renshu+"人模式";

        //cc.log("房间信息组成的描述..." , fangfeiDesc , wanfaDesc  , exScoreDesc , isDark8Desc);
        var clubStr = "";
        if (QFRoomModel.isClubRoom(QFRoomModel.tableType)){
            clubStr = "[亲友圈]";
        }
        var playerNum = " "+ QFRoomModel.renshu + "缺" + (QFRoomModel.renshu - QFRoomModel.players.length);
        var obj = {};
        obj.tableId = QFRoomModel.tableId;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?num=' + QFRoomModel.tableId + '&userId=' + encodeURIComponent(PlayerModel.userId);
        obj.title = '千分  房号:' + QFRoomModel.tableId + playerNum;

        obj.description = clubStr + wanfaDesc + "," + fangfeiDesc + "," + save6Desc + "," + xiWayDesc + "," + cfRewardDesc + "," + exScoreDesc + "。";
        obj.shareType = 1;
        SdkUtil.sdkFeed(obj,true);
    },

    /**
     * 传说中的互动表情
     */
    runPropAction:function(event){
        //seat 接收者的座位号  userId表示发送者的userId  content表示道具的索引值
        var data = event.getUserData();
        var userId = data.userId;
        var seat = data.seat;
        var content = data.content;
        var p = QFRoomModel.getPlayerVo(userId);
        var fromPlayer = this._players[p.seat];
        var targetPlayer = this._players[seat];
        if(fromPlayer._playerVo.userId != targetPlayer._playerVo.userId) {
            var url = "res/wzyx/yjPlayerInfo/yjPlayerInfo_prop" + content + ".png";
            var prop = new cc.Sprite(url);
            var initX = fromPlayer.getContainer().x;
            var initY = fromPlayer.getContainer().y;
            var x = initX - 20;
            var y = initY - 50;

            prop.setPosition(x, y);
            this.root.addChild(prop,2000);
            initX = targetPlayer.getContainer().x;
            initY = targetPlayer.getContainer().y;
            var targetX = initX - 20;
            var targetY = initY - 50;

            var action = cc.sequence(cc.moveTo(0.3, targetX, targetY), cc.callFunc(function () {
                targetPlayer.playPropArmature(content);
                prop.removeFromParent(true);
            }));
            prop.runAction(action);
        }else{
            targetPlayer.playPropArmature(content);
        }
    },

    /**
     * 有人加入房间
     * @param event
     */
    onJoin: function (event) {
        var p = event.getUserData();
        //cc.log("p.seat , p.userId" , p.seat , p.userId);
        if(p.seat != 0) {
            var seq = this.getPlayerSeq(p.userId,QFRoomModel.mySeat, p.seat);
            this._players[p.seat] = new QFCardPlayer(p, this.root, seq);
        }


        var name = CustomTextUtil.subTextWithFixWidth(p.name, 80, 20);
        //this["lableName"+group].setString(name);

        this.Button_17.visible = (ObjectUtil.size(this._players)<QFRoomModel.renshu);
        var seats = QFRoomModel.isIpSame();
        if(seats.length>1 && QFRoomModel.renshu != 2){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }
    },

    /**
     * 玩家选择作为 通知后台
     */
    onChoiceSeat: function(sender){
        var tag = sender.getTag();
        sySocket.sendComReqMsg(120 , [tag]);//120
        //cc.log("选择的座位tag值为：" , tag);
    },

    /**
     * 后台推送告知 开始选择分组
     *
     *
     */
    onChoiceTeam: function (data){
        this.choiceTeamCardList = [];
        //cc.log("onChoiceTeam data::" , JSON.stringify(data) );
    },

    /**
     *
     * 有玩家选择了分组卡牌
     * 有玩家ID 可以考虑后期加入显示效果
     */
    onPlayerChoiceTeamCard:function (event){
        var choiceCardIndex = event[0] || 0;
        var playerId = event[1];
        //cc.log("有玩家选择了分组卡牌！！！！！" ,  JSON.stringify(event) + "玩家数据为..." + JSON.stringify(QFRoomModel.players) , choiceCardIndex);
        //cc.log("分组的位置为:" , choiceCardIndex);

        //新的分组规则
        //后台告知某个玩家选择了座位
        var choiceCardIndex = event[0] || 0;
        var playerId = event[1];
        var playerList = QFRoomModel.players;
        var teamId = 0;

        if(choiceCardIndex == 2 || choiceCardIndex == 4){
            teamId = 2;
        }else{
            teamId = 1;
        }

        for(var index = 0 ; index < playerList.length ; index++){
            var tPlayerInfo = playerList[index];
            if(tPlayerInfo.getUserId() == playerId){
                //如果这个玩家已经是显示状态 清理之前的显示 并且重新显示这个地方的选座按钮
                this.clearTheShowPlayer(playerId);
                //将这个玩家显示在座位上 并且显示那个位置的选座按钮
                this["choiceSeatBtn" + choiceCardIndex].visible = false;
                tPlayerInfo.seat = choiceCardIndex;
                QFRoomModel.updatePayerTeamId(playerId , teamId);
                this._players[choiceCardIndex] = new QFCardPlayer(tPlayerInfo, this.root, choiceCardIndex, teamId);

            }

            if(playerId == PlayerModel.userId){
                this.getWidget("LableChoiceTeam").visible = false;
                QFRoomModel.mySeat = choiceCardIndex;
            }
        }

        var seats = QFRoomModel.isIpSame();
        if(seats.length>0 && QFRoomModel.renshu != 2){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }
    },

    /**
     * 清空某个已显示的玩家
     */
    clearTheShowPlayer:function(userId){
        var seats = QFRoomModel.isIpSame();
        for(var index = 1 ; index <= 4 ; index ++){
            if(this._players[index] != null){
                if (ArrayUtil.indexOf(seats, index) < 0) {
                    this._players[index].isIpSame(false);
                }
                if(this._players[index].getUserId() == userId){
                    //进行清理
                    //cc.log("进行清理..." , (index));
                    var playerNode = this.getWidget("player" + (index) );
                    var jiahaoImg = this.getWidget("jiahaoImg" + (index)).visible = true;

                    //清空名字
                    this.getWidget("name" + (index)).setString("");
                    //清空头像
                    if(playerNode.getChildByTag(345)){
                        //cc.log("移除头像成功...");
                        playerNode.removeChildByTag(345);
                    }
                    //清理已经选择的分组图标
                    ccui.helper.seekWidgetByName(playerNode,"teamIcon1").visible = false;
                    ccui.helper.seekWidgetByName(playerNode,"teamIcon2").visible = false;
                    //清理准备状态
                    var readySp = this.getWidget("zhunbei" + (index));
                    if(readySp){
                        readySp.visible = false;
                    }
                    //清理房主标示
                    var readySp = this.getWidget("CreaterSignImg" + (index));
                    if(readySp){
                        readySp.visible = false;
                    }

                    //显示这个位置的选座按钮
                    //if (QFRoomModel.mySeat != 1) {//房主不显示换座位按钮
                    this["choiceSeatBtn" + (index)].visible = true;
                    //}
                    this._players[index] = null;
                }
            }
        }
    },

    /**
     * 分组完成 刷新各个玩家的座位
     *
     */
    onUpdatePlayerMsg:function(messageData){
       QFExfunc.updatePlayerMsg(this , messageData);
    },

    /**
     * 一圈结束 三家要不起 清空计分 计分加入对应的玩家
     */
    onDealScore:function(event){

        //cc.log("一轮结束..." + JSON.stringify(event));
        //var tScole = parseInt(this.curScoreLable.getString());
        QFRoomSound.bombNumber = 0;
        var messageData = event.getUserData();
        var addScoreUserId = messageData[0]; //加分的玩家ID
        var curIndex = 3;
        if (QFRoomModel.is3Ren()) {
            curIndex++;
        }
        var tScole = messageData[curIndex];  //增加的分值
        curIndex++;

        var shouldClearnOutCard = 1; //是否要清理所有打出去的牌 (小结弹出的时候 不应该清楚) 0不清理 1清理
        if( messageData[curIndex] != null){
            shouldClearnOutCard = messageData[curIndex];
        }
        // cc.log("shouldClearnOutCard..." , shouldClearnOutCard)

        var tTeamId = 0;
        var addScorePlayerSeat = 0;


        //金币飞到自己家
        for (var seat in this._players) {
            var seat = parseInt(seat);
            var curPlayer = this._players[seat];
            //cc.log("this._PlayerData ... " , JSON.stringify(curPlayer));
            if(curPlayer.getUserId() == addScoreUserId){
                tTeamId = seat;
                //curPlayer.updatePointByBomb(tScole , true);
                addScorePlayerSeat = seat;
                //cc.log("这个分数应该加在" + tTeamId + "组" + tScole + "玩家的seat为：" + addScorePlayerSeat);
                // var taddScorePalyerSeq = this.getPlayerSeq(-1, QFRoomModel.mySeat, addScorePlayerSeat);
                //var tTargetPlayer = curPlayer;
                //if(tScole > 0){
                //    var coinNumber = Math.min( Math.max( (tScole / 5) , 5)  , 16);
                //    coinNumber = Math.ceil(coinNumber);
                //    QFJetton.runEffect(this.root , cc.p(600 , 664) , tTargetPlayer, false , coinNumber);
                //}
            }
        }


        //var teamAllScore = messageData[1];//历史得分

        var teamCurScore = messageData[2];//本局得分
        var xiScore = messageData[3];//喜分
        if(tTeamId == 1){
            QFRoomModel.aTeamTongziScore = xiScore;
            //this.aTeamAllScore = teamAllScore;
            QFRoomModel.aTeamCurScore = teamCurScore;
        } else if (tTeamId == 2) {
            QFRoomModel.bTeamTongziScore = xiScore;
            //this.bTeamAllScore = teamAllScore;
            QFRoomModel.bTeamCurScore = teamCurScore;
        }else{
            QFRoomModel.cTeamTongziScore = xiScore;
            //this.cTeamAllScore = teamAllScore;
            QFRoomModel.cTeamCurScore = teamCurScore;
        }


        var pmScore = messageData[4];
        //清理记录的上一次牌型
        //this._lastCardTypeData = null;
        //this._curTipCard = null;
        if (pmScore == 0){
            var self = this;
            var callbal = function(){
                QFExfunc.updateRoomCount(self);
                AudioManager.play("res/audio/qfSound/jetton.mp3");
            };
            this.showAddScoreAni(addScorePlayerSeat,callbal);
            
            QFExfunc.cleanSomeCount(this);
        }else{
            QFExfunc.updateXifen(this);
        }
    },

    /**
     * 后台推送 有玩家出完牌了 显示名次
     * 后台推送 有玩家出完牌了 显示名次
     */
    showWinNumber :function(messageData){
        //cc.log("有玩家出完牌了..." + JSON.stringify(messageData));
        var tWinPlayerUserId = messageData[0];
        var tWinPlayerNum = messageData[1];
        if(tWinPlayerNum < QFRoomModel.renshu){
            AudioManager.play("res/audio/qfSound/audio_win.mp3");
        }
        for (var seat in this._players) {
            var seat = parseInt(seat);
            var curPlayer = this._players[seat];

            if(curPlayer.getUserId() == tWinPlayerUserId){
                curPlayer.showNumber(tWinPlayerNum);
            }
        }
    },

    /**
     * 牌局开始 OnlimeRoom.js (子类实现)
     * @param event
     */
    startGame: function (event) {
        // cc.log("游戏开始...DTZRoom startGame...");

        for (var i = 1; i <= this._renshu; i++) {
            this.getWidget("ybq" + i).visible = false;
            this.getWidget("zhunbei" + i).visible = false;
            this.getWidget("small" + i).removeAllChildren(true);
            if (this._players[i] != null) {
                //this._players[i].showLastCard();
                this._players[i].hideNumber();
                this._players[i].playerQuanAnimation(false);
            }
        }
        var p = event.getUserData();
        //if(p.handCardIds.length != 0){
        //    this.visibleOpButton((QFRoomModel.nextSeat == QFRoomModel.mySeat) , false);
        //}
        this._players[QFRoomModel.mySeat].deal(p.handCardIds);
        this.showJianTou();
        this._countDown = QFRoomModel.getTuoguanTime() || 30;
        this._lastCardPattern = null;
        this._lastCardTypeData = null;
        QFRoomSound.bombNumber = 0;
        this._curChoiceCardsTypeData = null;
        this._curChoiceCards = null;
        this._lastLetOutSeat = 0;
        QFRoomModel.cleanScore();
        for (var i = 1; i <= this._renshu; i++) {
            if (this._players[i] != null) {
                this._players[i].refreshAllScore();
            }
        }
        this.initCards(p.handCardIds , !this.bg_CancelTuoguan.isVisible());
    },

    /**
     * 获取显示时间的label OnlimeRoom.js (子类实现)
     *
     */
    getLabelTime: function () {
        return this.getWidget("Label_39");//时间;
    },

    /**
     * 闹钟上面的箭头 OnlimeRoom.js
     * @param seat
     */
    showJianTou: function (seat) {
        this.Image_40.visible = true;
        seat = seat || QFRoomModel.nextSeat;
        //cc.log("显示箭头..." , seat);
        if(seat == null ||　seat == 0 ){
            //cc.log("这个值是null 或者 0 ...", QFRoomModel.nextSeat);
            return;
        }
        var direct = this.getPlayerSeq(-2, QFRoomModel.mySeat,seat);
        var coords =  {1:{x:70,y:370},2:{x:1380 ,y:775},3:{x:440,y:775}};
        var coord = coords[direct];
        this.Image_40.x = coord.x;
        this.Image_40.y = coord.y;

        //显示或者影藏光圈
        for(var index = 1 ; index <= 4 ; index ++) {
            if (this._players[index]) {
                this._players[index].playerQuanAnimation(index == seat);
            }
        }

    },

    //OnlimeRoom.js
    onShow: function () {
        this._dt = 0;   
        this._timedt = 0;
        this.calcTime();
        this.scheduleUpdate();
    },

    //OnlimeRoom.js
    onHide: function () {
        this.unscheduleUpdate();
    },

    onGpsPop:function(){
        PopupManager.addPopup(new GpsPop(QFRoomModel , QFRoomModel.renshu));
    },

    //标记 玩家已经显示了头像
    setRoldPlayerIcon:function(event)
    {
        var seat = event.getUserData();
        var players = QFRoomModel.players;
        for(var i=0;i<players.length;i++) {
            var p = players[i];
            if(p.seat ==seat){
                p.isRoladIcon = 1;
            }
        }
    },

    /**
     * 退出房间
     * @param event
     */
    onExitRoom:function(event){
        var p = event.getUserData();
        this._players[p.seat].exitRoom();
        delete this._players[p.seat];
        var seats = QFRoomModel.isIpSame();
        for (var key in this._players) {
            if (ArrayUtil.indexOf(seats, key) < 0) {
                this._players[key].isIpSame(false);
            }
        }
    },

     /*
     显示或者影藏总分表
      */
    showOrHideAllScore:function(){
        if(this.allScoreNode.isMoveing == true){
            return;
        }
        var time = 1;
        var offsetY1 = 642;
        var offsetY2 = 795;
        var endPos = cc.p(this.allScoreNode.x , 0);
        if(this.allScoreShowBtn.visible){
            this.allScoreShowBtn.visible = false;
            this.allScoreHideBtn.visible = true;
            endPos = cc.p(this.allScoreNode.x , offsetY1);
        }else{
            this.allScoreShowBtn.visible = true;
            this.allScoreHideBtn.visible = false;
            endPos = cc.p(this.allScoreNode.x , offsetY2);
        }

        var actionEndCallBack = cc.callFunc(this.actionEndCallBack, this);
        var move_ease_in = cc.moveTo(time , endPos).easing(cc.easeElasticOut(0.5));
        var rep = cc.sequence(move_ease_in ,  actionEndCallBack);
        this.allScoreNode.runAction(rep);
        this.allScoreNode.isMoveing = true;
    },

    actionEndCallBack:function(sender){
        if(sender){
            sender.isMoveing = false;
        }
    },

    onChangeStauts:function (event){
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        var status = params[1];
        //cc.log("改变该座位玩家状态..." , seat,status,this._players[seat]._playerVo.name);
        if(this._players[seat])
            this._players[seat].showStatus(status);
        if(seat == QFRoomModel.mySeat){
            this.Button_30.visible = false;
            this.Button_17.visible = (ObjectUtil.size(this._players)<QFRoomModel.renshu);
        }
        var statusCount = 0;
        for (var i = 1; i <= this._renshu; i++) {
            if (this._players[i] != null) {
                if(this._players[i].zbImg.visible){
                    statusCount++;
                }
                if(QFRoomModel.nowBurCount == 1 && this._players[i].isMaster){
                    //cc.log("QFRoomModel.nowBurCount"+QFRoomModel.nowBurCount+"this._players[i].seat="+this._players[i].seat)
                    QFRoomModel.cutCardSeat = i;
                }else if(QFRoomModel.renshu == this._players[i].mingci){
                    //cc.log("this._players[i].mingci = "+this._players[i].mingci+"this._players[i].seat="+this._players[i].seat)
                    QFRoomModel.cutCardSeat = i;
                }
            }
        }
        //cc.log("statusCount = "+statusCount+"QFRoomModel.renshu="+QFRoomModel.renshu+"QFRoomModel.cutCardSeat="+QFRoomModel.cutCardSeat)

        if(statusCount == QFRoomModel.renshu && QFRoomModel.cutCardSeat != 0){
            //cc.log("clean LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
            this.cleanRoom();
            var mc = new CutCardPop(QFRoomModel.mySeat != QFRoomModel.cutCardSeat);
            PopupManager.addPopup(mc);
            QFRoomModel.cutCardSeat = 0;
        }
    },

    onZhanKai: function () {
        this.image_setPp = new QFRoomSetPop();
        PopupManager.addPopup(this.image_setPp);
    },

    onPlayerInfo: function (obj) {
        if(this.Image_set.visible){
            return;
        }
        //cc.log("onPlayerInfo:" + JSON.stringify(this._players));
        if(this._players[obj.temp] == null){
            //cc.log("这个位置还没有玩家...");
        }else{
            this._players[obj.temp].showInfo();
        }

    },

    getChatJSON:function(){
        return "res/qfChat.json";
    },

    visibleOpButton: function(visible , buyaoVisible){
        this.Button_6.visible = this.Button_4.visible = visible;
        //是否清掉上家的出牌
        if((visible == true && buyaoVisible == false)){
            this._lastCardTypeData = null;
            QFRoomSound.bombNumber = 0;
        }
    },

    unSelectAllCards: function () {
        this._curChoiceCards = null;
        for (var i = 0; i < this._cards.length; i++) {
            var card = this._cards[i];
            if (card.isSelected()){
                card.unselected();
            }else{
                card.fixHeight();
            }
        }
    },

    enableAllCards: function () {
        for (var i = 0; i < this._cards.length; i++) {
            this._cards[i].enableAction();
        }
    },

    onTouchBegan: function (touch, event) {
        return QFCardDelegate.dealTouchBegin(this , touch , event);
    },

    onTouchMoved: function (touch, event) {
        return QFCardDelegate.dealTouchMove(this , touch , event);
    },

    onTouchEnded: function (touch, event) {
        return QFCardDelegate.dealTouchEnded(this, touch , event);
    },

    changeLetOutButton: function (isTouch) {
     /*   cc.log("1111111111111111111111111111111111111isTouch",isTouch,this._letOutButtonTouchable);*/
        if (isTouch == this._letOutButtonTouchable)
            return;
        this._letOutButtonTouchable = isTouch;
        if (isTouch) {
            this.Button_6.setTouchEnabled(true);
            this.Button_6.setBright(true);
            //this.Button_6.loadTextureNormal("res/ui/buttons/btn_15.png");
        } else {
            this.Button_6.setTouchEnabled(false);
            this.Button_6.setBright(false);
            //this.Button_6.loadTextureNormal("res/ui/buttons/btn_15_g.png");
        }

        //this.Button_6.setTouchEnabled(true);
        //this.Button_6.setBright(true);
    },

    isCanLetOut: function () {
        var tCards = this._curChoiceCards;
        var allCardsObj = [];
        for (var i = 0; i < this._cards.length; i++) {
            var card = this._cards[i];
            if (card.isSelected()) {
                allCardsObj.push(card);
            }
        }
        tCards = this._curChoiceCards = allCardsObj;

        //当前牌是否可以打出的判断
        if(tCards === null || tCards.length <= 0){
            this.changeLetOutButton(false);
            //cc.log("当前未选择牌 不可打出 ...");
            return
        }
        if(this._lastCardTypeData != null){
            //cc.log("当前有记录上家的牌型..." , JSON.stringify(this._lastCardTypeData));
            //this.Button_giveUp.visible = true;
        }else{
            //cc.log("没人要的起 轮到我出牌...")
            //this.Button_giveUp.visible = false;

        }
        var curTipCardsTypeDate = QFAI.getCardsType(tCards , this._lastCardTypeData);
        //cc.log("当前选择牌 解析出的牌型为：" , JSON.stringify(curTipCardsTypeDate));
        if(curTipCardsTypeDate.type <= 0){
            this.changeLetOutButton(false);
            //cc.log("当前选择的牌 牌型异常 不可打出 ...");
            return;
        }else{
            if(this._lastCardTypeData == null || this._lastCardTypeData.type == 0){
                this.changeLetOutButton(true);
                return;
            }else if(curTipCardsTypeDate.type == this._lastCardTypeData.type && this._lastCardTypeData.type == QFAI.LIANDUI ){ //连对
                if( curTipCardsTypeDate.value > this._lastCardTypeData.value && curTipCardsTypeDate.serialNum == this._lastCardTypeData.serialNum){
                    this.changeLetOutButton(true);
                }else{
                    this.changeLetOutButton(false);
                }
                return;
            //} else if ((this._lastCardTypeData.type == QFAI.THREE || this._lastCardTypeData.type == QFAI.THREEWithCard) && //三张和三张带
            //        (curTipCardsTypeDate.type == QFAI.THREE || curTipCardsTypeDate.type == QFAI.THREEWithCard) ){
            } else if (this._lastCardTypeData.type == QFAI.THREE && curTipCardsTypeDate.type == QFAI.THREE){//三张和三张带
                //cc.log("上家的是三张 下家三张或者非三张都可以打");
                if(curTipCardsTypeDate.value > this._lastCardTypeData.value){
                    this.changeLetOutButton(true);
                }else{
                    this.changeLetOutButton(false);
                }
                return;
            //} else if((this._lastCardTypeData.type == QFAI.PLANE || this._lastCardTypeData.type == QFAI.PLANEWithCard) && //飞机和飞机带
            //    (curTipCardsTypeDate.type == QFAI.PLANE || curTipCardsTypeDate.type == QFAI.PLANEWithCard)){
            } else if(this._lastCardTypeData.type == QFAI.PLANE && curTipCardsTypeDate.type == QFAI.PLANE){//飞机和飞机带
                if((curTipCardsTypeDate.serialNum == this._lastCardTypeData.serialNum)  && (curTipCardsTypeDate.value > this._lastCardTypeData.value)){
                    this.changeLetOutButton(true);
                }else{
                    this.changeLetOutButton(false);
                }
                return;
            }  else if (curTipCardsTypeDate.type >= QFAI.BOMB && curTipCardsTypeDate.type >= this._lastCardTypeData.type){ //炸弹 以及筒子 地炸 喜
                if(curTipCardsTypeDate.type == this._lastCardTypeData.type && this._lastCardTypeData.type == QFAI.BOMB) { //炸弹要比较长度
                    if(curTipCardsTypeDate.repeatNum == this._lastCardTypeData.repeatNum){
                        this.changeLetOutButton( curTipCardsTypeDate.value > this._lastCardTypeData.value );
                        return;
                    }else{
                        this.changeLetOutButton( curTipCardsTypeDate.repeatNum > this._lastCardTypeData.repeatNum );
                        return;
                    }
                }

                //类型碾压
                this.changeLetOutButton(true);
                return;
            }else if(curTipCardsTypeDate.type == this._lastCardTypeData.type && curTipCardsTypeDate.value > this._lastCardTypeData.value ){
                this.changeLetOutButton(true);
                return;
            } else{
                //不属于以上任何情况 按钮为false
                this.changeLetOutButton(false);
                return;
            }
        }
    },

    /**
     * 初始化卡牌 小付
     * @param cards {Array.<CardVo>}
     */
    initCards: function (cards , showAction) {
        //cc.log("initCards..."  + cards.length + JSON.stringify(cards));
        showAction = showAction || false;

        if (this._cards.length > 0) {//清理掉上一局的牌
            for (var i = 0; i < this._cards.length; i++) {
                this._cardPanel.removeChild(this._cards[i]);
            }
            this._cards.length = 0;
        }
        if (this._cards.length == 0) {
            cards.sort(function (item1, item2) {
                if (item1.i != item2.i) {
                    return item2.i - item1.i;
                } else {
                    return item2.t - item1.t;
                }
            });

            for (var i = 0; i < cards.length; i++){
                var card = new QFBigCard(cards[i]);
                card.cardId = i;
                card.anchorX = card.anchorY = 0.5;
                card.scale = this._cardScale;
                card.setLocalZOrder(i);
                this._cards.push(card);
            }
            //暂时注销特殊牌型
            //新增排序 保护筒子地炸囍不被拆散 并且保护第一行的结尾不会拆开连续的牌
            var that = this;
            that.visibleOpButton((QFRoomModel.nextSeat == QFRoomModel.mySeat) , !showAction);
            this.changeLetOutButton(false);
            this.Button_4.setTouchEnabled(false);
            var callback = function(){
                that.isCanLetOut();
                that.onPlayTip(true);
                that.changeLetOutButton(false);
                that.Button_4.setTouchEnabled(true);
                // if(QFRoomModel.renshu == 2){ //2人玩法创建第三个人的牌，假牌 摆在左上角
                //     if(!that.player3card){
                //         that.player3card = new cc.Node();
                //         var player3 = that.getWidget("player3");
                //         that.player3card.x = player3.x;
                //         that.player3card.y = player3.y;
                //         player3.getParent().addChild(that.player3card);
                //         for(var i = 0; i < 34; i++) {
                //             var backbg = new cc.Sprite("res/res_yjqf/qfcutcard/cut_card_3.png");
                //             backbg.x = i*10;
                //             that.player3card.addChild(backbg);
                //         }
                //     }else {
                //         that.player3card.visible = true;
                //     }
                // }
            };
            QFExfunc.fixSort(this , showAction, callback);
            // QFExfunc.fixSort(this , showAction);
        }
    },

    getPlayerSeq: function (userId, ownSeat, seat) {
        if(userId == -2 && QFRoomModel.renshu == 2){
            if(ownSeat == seat){
                return 1;
            }else{
                return 2;
            }
        }
        if (userId == PlayerModel.userId)
            return 1;
        if(QFRoomModel.renshu == 2)
            return 2;
        var seqArray = this.seatSeq[ownSeat];
        //cc.log("seqArray=========",seqArray);
        var seq = ArrayUtil.indexOf(seqArray, seat) + 1;
        return seq;
    },

    letOutCards: function (cardIds, seat, nextSeat , isContinue) {
        // cc.log("打出去的牌..." , cardIds  , nextSeat);
        // cc.log("cardIds =",JSON.stringify(cardIds));
        // cardIds = [109,109,209,209,309,309,409,409]
        var isOver = false;
        var initX = 0;
        var isContinue = isContinue || false;
        //cc.log("isContinue ... " , isContinue);
        //
        //cc.log("isContinue==this._lastCardTypeData:::"+JSON.stringify(this._lastCardTypeData));

        //新的清卡牌规则
        if(QFRoomModel.cleanCards == 1){
            if(cardIds.length != 0){
                //有玩家出牌了 清理掉所有之前出的牌
                for(var index = 1 ; index <= this._renshu ; index++) {
                    this.getWidget("small" + index).removeAllChildren(true);
                }
            }
            //不管当前的玩家是出牌还是不要 清理掉下个出牌的玩家的不要显示
            if(nextSeat != null && nextSeat != 0){//后台下发了nextSeat就直接清空这个玩家出过的牌 并且 影藏不要的状态
                var tnextPlaySep = this.getPlayerSeq(-1, QFRoomModel.mySeat, nextSeat);
                this.getWidget("small" + tnextPlaySep).removeAllChildren(true);
                this.getWidget("ybq" + tnextPlaySep).visible = false;
            }

            //出完牌的人的特殊处理
            var nextSeq = this.getPlayerSeq(-1, QFRoomModel.mySeat, this.seatSeq[seat][1]);
            var nextNextSeqp = this.getPlayerSeq(-1, QFRoomModel.mySeat, this.seatSeq[seat][2]);

            //这个地方改为 判断后面两家是否出完牌了 出完了则清理掉之前打的牌
            if(QFExfunc.isPlayerHasNoCard(this , nextSeq)){
                this.getWidget("ybq" + nextSeq).visible = false;
            }

            if(QFExfunc.isPlayerHasNoCard(this ,nextSeq) && QFExfunc.isPlayerHasNoCard(this , nextNextSeqp)){
                this.getWidget("ybq" + nextNextSeqp).visible = false;
            }
        }

        if (cardIds.length == 0){
            return;
        }

        AudioManager.play("res/audio/common/audio_card_out.mp3");
        var seq = 1;
        //this.unSelectAllCards();
        var removeCardLength = 0;

        if (seat == QFRoomModel.mySeat) {//自己出牌
            var cards = this._cards;
            var length = this._cards.length;
            cc.log("当前玩家剩余卡牌数："+this._cards.length + "后台通知删除卡牌数:" + cardIds.length)
            for (var n = 0; n < cardIds.length; n++) {
                var removeCardSus = false;
                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i];
                    if (card.getData().c == cardIds[n]) {
                        this._cardPanel.removeChild(card);
                        this._cards.splice(i, 1);
                        removeCardLength ++;
                        removeCardSus = true;
                        break;
                    }
                }
            }
            //重新检测筒子
            //QFExfunc.signTongzi(this._cards);
            //自己出牌后 重新定位
            this.resetCardList();
        } else {
            seq = this.getPlayerSeq(-1, QFRoomModel.mySeat, seat);
            var playerVo = QFRoomModel.getPlayerVoBySeat(seat);
            //if (playerVo != null) {
                //if (!isOver && isContinue == false) {
                //    //刷新玩家的剩余牌数量
                //    playerVo.ext[0] -= cardIds.length;
                //}
                //if (this._players[seat]) {
                //    this._players[seat].showLastCard();
                //}
            //}
        }


        //显示玩家或者我打出去的卡牌
        var copyCardIds = ArrayUtil.clone(cardIds);
        var outCardObj = [];
        var tcheckTypeObj = [];
        var length = copyCardIds.length;
        var smallW = 58;
        var outCardOffX = 55;
        var effectX = 0;//记录卡牌显示的中间位置 用来控制特效的显示位置
        var effectY = 0;
        var midLength = Math.ceil( length / 2 );


        var copyCardIdsObj = [];
        for (var i = 0; i < length; i++) {
            copyCardIdsObj.push(QFAI.getCardDef(copyCardIds[i]));
        }
        var parentNode = this.getWidget("small" + seq);
        parentNode.removeAllChildren(true);
        for (var i = 0; i < length; i++) {
            var smallCard = new QFSmallCard(copyCardIdsObj[i]);
            var smallCardforType = new QFSmallCard(copyCardIdsObj[i]);
            outCardObj.push(smallCard);
            tcheckTypeObj.push(smallCardforType);
        }
        if (QFRoomModel.is3Ren() && seq == 3) {
            seq = 4;
        }
        //this._lastCardTypeData = QFAI.getCardsType(cardTransData , this._lastCardTypeData);
        //cc.log("1111111111111111111111111111111111",JSON.stringify(outCardObj));
        // cc.log("222222222222223333333333333333333",JSON.stringify(this._lastCardTypeData));

        var cardType = QFAI.getCardsType(tcheckTypeObj , this._lastCardTypeData);
       // cc.log("100000000000000000000000000000000000000100",JSON.stringify(cardType));
        var cardListWidth = (smallW + outCardOffX * (length - 1));
        //cc.log("cardType" , cardType.type);
        if (seq == 1 || seq == 3) {
            initX = (1200 - cardListWidth) / 2;
            effectX = parentNode.x + parentNode.width * 0.5 ;
        } else if (seq == 2) {
            initX = (1200 - smallW);
            effectX = parentNode.x + parentNode.width - cardListWidth * 0.5;
            //copyCardIds.reverse();
        } else {
            initX = 0;
            effectX = parentNode.x + cardListWidth * 0.5 ;
        }
        effectY = parentNode.y + parentNode.height * 0.5;
        //cc.log("记录特效应该显示的位置..." , effectX , effectY);

        var specialIndex = -1;
        var specialLongIndex = 0;
        var offX = 12;
        //cc.log("cardType.type" , cardType.type);
        if(cardType.type == QFAI.PLANE || cardType.type == QFAI.THREE){
            //cc.log("这个卡牌要特殊显示")
            if(cardType.type == QFAI.PLANE){
                var threeLength = cardType.serialNum * 3;
                specialIndex = threeLength
            }else if(cardType.type == QFAI.THREE){
                specialIndex = 3;
                specialLongIndex =3;
            }
        }
        //if (cardType.type == QFAI.PLANE&&cardType.serialNum==2)
        //cc.log("第" + specialIndex + "张牌隔开");

        //换行的显示情况
        var changeLineLength = 20;
        //cc.log("22222222222222222222222222222222222222222222222222222222222222222222222",length,changeLineLength,cardType.type,cardType.serialNum );
        // if(length >= changeLineLength && (cardType.type == changeLineLength)){
        //     var cutPos = 0;
        //     var fixBeginX = 0;
        //     if(specialIndex != -1){ //三张带牌 把带的牌切到第二排
        //         cutPos = specialIndex;
        //     }else{
        //         cutPos = parseInt(Math.round(length / 2));
        //     }
        //     //cc.log("cutPos length..." , cutPos , length);
        //     fixBeginX = (outCardOffX * (length - cutPos - 1));
        //     if(seq == 1 || seq == 3){
        //         initX = initX + fixBeginX * 0.5;
        //     }

        //     for (var i = 0; i < length; i++) {
        //         var smallCard = outCardObj[i];//new SmallCard(QFAI.getCardDef(copyCardIds[i]));
        //         //cc.log("绘制的卡牌i , c" , smallCard.i , smallCard.c);
        //         smallCard.anchorX = 0;
        //         smallCard.anchorY = 0;
        //         smallCard.scale = this._letOutCardScale;

        //         if (seq == 2) {
        //             smallCard.x = initX - i * outCardOffX;
        //             smallCard.setLocalZOrder(length - i);
        //             if(specialIndex != -1 && specialIndex <= i){
        //                 smallCard.x = smallCard.x - offX;
        //             }
        //          } else {
        //             smallCard.x = initX + i * outCardOffX;
        //             if (specialIndex != -1 && specialIndex <= i) {
        //                 smallCard.x = smallCard.x + offX;
        //             }
        //         }

        //         if(i >= cutPos){
        //             smallCard.y = -60;
        //             smallCard.x = smallCard.x = initX + (i - cutPos) * outCardOffX;
        //             if(seq == 2){
        //                 smallCard.setLocalZOrder(length - i + cutPos + 1);
        //                 smallCard.x = smallCard.x = initX - (i - cutPos) * outCardOffX;
        //             }
        //         }else{
        //             smallCard.y = 0;
        //         }
        //         parentNode.addChild(smallCard);
        //     }
        // }else{  //正常的现实情况
            for (var i = 0; i < length; i++) {
                var smallCard = outCardObj[i];//new SmallCard(QFAI.getCardDef(copyCardIds[i]));
                //cc.log("绘制的卡牌i , c" , smallCard.i , smallCard.c);
                smallCard.anchorX = 0;
                smallCard.anchorY = 0;
                smallCard.scale = this._letOutCardScale;
                if (seq == 2) {
                    smallCard.x = initX - i * outCardOffX;
                    smallCard.setLocalZOrder(length - i);
                    if(specialIndex != -1 && specialIndex <= i){
                        smallCard.x = smallCard.x - outCardOffX;
                    }
                } else {
                    smallCard.x = initX + i * outCardOffX;
                    if(specialIndex != -1 && specialIndex <= i){
                        smallCard.x = smallCard.x + outCardOffX;
                    }
                }
                smallCard.y = 0;

                parentNode.addChild(smallCard);
            }
            if(specialLongIndex){
                var dai = UICtor.cLabel("带",40,null,cc.color("#f1e024"),0,1);
                parentNode.addChild(dai);
                if (seq == 2){
                    dai.x = initX - 2 * outCardOffX - 28;
                }else if (seq == 1){
                    dai.x = initX + 3 * outCardOffX+30;
                }else {
                    dai.x = initX + 3 * outCardOffX+30;
                }

                dai.y = 47;
            }

            if (cardType.type == QFAI.PLANE&&cardType.serialNum>=2){// 两张飞机也要隔开
                var dai = UICtor.cLabel("带",40,null,cc.color("#f1e024"),0,1);
                parentNode.addChild(dai);
                if (seq == 2){
                    dai.x = initX - (cardType.serialNum * 3-1) * outCardOffX -27;
                }else if (seq == 1){
                    dai.x = initX +cardType.serialNum * 3 * outCardOffX+32;
                }else {
                    dai.x = initX +cardType.serialNum * 3 * outCardOffX+32;
                }

                dai.y = 47;
            }

        // }
        if (cardType.type == QFAI.BOMB){
            var jizhang = UICtor.cLabel(length+"张",40,null,cc.color("#f1e024"),0,1);
            parentNode.addChild(jizhang);
            // cc.log("seq =",seq);
            if (seq == 1 || seq == 3) {
                jizhang.x =  initX  + cardListWidth +jizhang.width/2+5;
            } else if (seq == 2) {
                jizhang.x = initX - cardListWidth + jizhang.width/2 -5 ;
            }else{
                jizhang.x =  initX + cardListWidth + jizhang.width/2+5;
            }
            jizhang.y=47;
        }

        //播放特效
        // QFRoomEffects.play(this.root, this._lastCardTypeData , cc.p(effectX , effectY));
    },

    /**
     * 出牌后重新排版和检测
     */
    resetCardList:function() {
        //自己出牌后 重新定位
        this.cardMapData = QFAI.getCardsMap(this._cards , false);
        QFExfunc.updateShowMap(this,this._cards);
        this._cards.sort(function (item2, item1) {
            //if (item1.i != item2.i) {
                return item1.i - item2.i;
            //} else {
            //    if( (item2.isSpecialCard() != item1.isSpecialCard()) ){
            //        return item1.isSpecialCard() - item2.isSpecialCard()
            //    }else{
            //        return item1.t - item2.t;
            //    }
            //}
        });

        var ArrayByCardId = [];
        var ArrayCount = -1;
        var cardid = 0;

        for (var i = 0; i < this._cards.length; i++){
            var card = this._cards[i];
            if(cardid != card.n){
                cardid = card.n;
                ArrayCount++;
                ArrayByCardId[ArrayCount] = [];
            }
            ArrayByCardId[ArrayCount].push(card);
        }

        var initX = QFRoomModel.CardMidX;
        initX -= (ArrayCount)/2*this._cardG;
        var cardid = 0;
        for (var key in ArrayByCardId) {
            var cardArray = ArrayByCardId[key];
            //cc.log(key+" : "+cardArray.length+initX)
            for (var i = 0; i < cardArray.length; i++) {
                card = cardArray[i];
                //cc.log(key+":"+i+" = "+card.n)
                card.cardId = cardid++;
                card.setLocalZOrder(12-i);

                if(cardArray.length >= 4){
                    card._BoomNumber = cardArray.length;
                    card.y = this.initCardYLine2+this._cardY1*i;
                }else{
                    card.y = this.initCardYLine2+this._cardY2*i;
                }
                card.x = initX;

                if(i == cardArray.length-1){
                    initX += this._cardG;
                    if(cardArray.length >= 4){
                        if (!card.cardCount) {
                            card.cardCount = new cc.Sprite("res/res_yjqf/images/qfCardCount_" + cardArray.length + ".png");
                            card.cardCount.y = card.height + 120;
                            card.cardCount.x = card.width / 2;
                            card.addChild(card.cardCount);
                        }else{
                            card.cardCount.setTexture("res/res_yjqf/images/qfCardCount_" + cardArray.length + ".png");
                        }
                    }
                }else if(card.cardCount){
                    card.removeChild(card.cardCount,true);
                    card.cardCount = null;
                }
            }
        }
        this._curChoiceCards = null;
    },

    //开局前显示玩家所有状态
    showPlayersStates:function(messageStr) {
        QFExfunc.updatePlayersStates(this, messageStr);
    },

    initLabelColor: function () {
        var color1 = cc.color(227,227,227);//灰色
        var color2 = cc.color(255,228,104);//黄色
        //for(var i = 1 ; i <= 4 ; i ++) {
        //    this.getWidget("lableTitle_" + i).setColor(color1);
        //}
        //this.getWidget("Label_94").setColor(color1);
        //this.getWidget("Label_95").setColor(color1);
        //this.lableNameA.setColor(color1);
        //this.lableNameB.setColor(color1);
        //this.lableNameC.setColor(color1);
        //this.cTeamScoreLable.setColor(color2);
        //this.aTeamScoreLable.setColor(color2);
        //this.bTeamScoreLable.setColor(color2);
        //this.curScoreLable.setColor(color2);

        var type = this.getLocalItem("sy_dtz_pz") || 1;
        this.showBgColor(type);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    updateBgColor:function(event){
        var type = event.getUserData();
        this.showBgColor(type);
    },

    //更新背景图和 更新字体颜色
    showBgColor: function (_type) {
        //绿色背景1蓝色背景2紫色背景3
        var color = cc.color(130,248,171);
        var sezhi1 = 130;
        var sezhi2 = 248;
        var sezhi3 = 171;
        var bgTexture = "res/res_yjqf/qfRoom/background1.jpg";
        var wfcolor = cc.color(30,111,74);
        if (_type == 1){

        }else if (_type == 2){
            bgTexture = "res/res_yjqf/qfRoom/background2.jpg";
            color = cc.color(112,225,235);
            sezhi1 = 112;
            sezhi2 = 225;
            sezhi3 = 235;
            wfcolor = cc.color(54,80,103);
        }else if (_type == 3){
            bgTexture = "res/res_yjqf/qfRoom/background3.jpg";
            color = cc.color(164,203,251);
            sezhi1 = 164;
            sezhi2 = 203;
            sezhi3 = 251;
            wfcolor = cc.color(50,73,117);
        }
        QFRoomModel._pzLableColor = [sezhi1,sezhi2,sezhi3];
    }

});