
var WZQRoom = WZQBaseRoom.extend({
    seatSeq: {},
    _countDown: null,
    ctor:function(json){
        this._super(json);
        this._players = {};
        this.seatSeq = WZQRoomModel.seatSeq;
        this._countDown = WZQRoomModel.getTuoguanTime() || 10;
    },

    selfRender:function(){
        WZQBaseRoom.prototype.selfRender.call(this);
        for (var i = 1; i <= WZQRoomModel.renshu; i++) {
            UITools.addClickEvent(this.getWidget("player" + i), this, this.onPlayerInfo);
        }
        UITools.addClickEvent(this.getWidget("btn_fanhui"),this,this.onReturn);//退出房间
        this.Label_fh = this.getWidget("Label_fh");
        this.Label_xf = this.getWidget("Label_xf");
        this.Image_tip = this.getWidget("Image_tip");
        this.Button_bisaifen = this.getWidget("Button_bisaifen")
        this.Button_bisaifen.tempData = 1
        UITools.addClickEvent(this.Button_bisaifen,this,this.onScoreClick);//比赛分
        this.Button_qifen = this.getWidget("Button_qifen")
        this.Button_qifen.tempData = 2
        UITools.addClickEvent(this.Button_qifen,this,this.onScoreClick);//棋分
        this.Button_jieshu = this.getWidget("Button_jieshu")
        this.Button_jieshu.visible = false
        UITools.addClickEvent(this.Button_jieshu,this,this.onOverClick);//解散
        this.Button_touxiang = this.getWidget("Button_touxiang")
        this.Button_touxiang.visible = false
        UITools.addClickEvent(this.Button_touxiang,this,this.onTouXiangClick);//投降
        this.label_version = this.getWidget("label_version")
        this.label_version.setString(SyVersion.v + "")
        this.Button_setting = this.getWidget("Button_setting")
        UITools.addClickEvent(this.Button_setting,this,this.onSettingClick);//设置

        for (var i = 1; i <= this._renshu; i++) {
            UITools.addClickEvent(this.getWidget("player" + i), this, this.onPlayerInfo);
        }
        this.Panel_qizi = this.getWidget("Panel_qizi");
        WZQChessLayer.setRoot(this.Panel_qizi)

        this.Image_time = this.getWidget("Image_time");//闹钟
        this.Image_time.visible = false
        this.countDownLabel = this.getWidget("label_time");//时间

        this.addCustomEvent(SyEvent.CLUB_WZQ_SELECT_SCORE_TYPE,this,this.showSelectScore);
        this.addCustomEvent(SyEvent.CLUB_WZQ_SELECT_SCORE,this,this.onUpdateScore);
        this.addCustomEvent(SyEvent.OVER_PLAY,this,this.onOver);
        this.addCustomEvent(SyEvent.START_PLAY,this,this.startGame);
        this.addCustomEvent(SyEvent.LET_OUT_CARD,this,this.onLetOutCard);
        this.addCustomEvent(SyEvent.EXIT_ROOM, this, this.onExitRoom);
        this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction);
    },

    /**
     * 牌局开始,由DealInfoResponder驱动
     * @param event
     */
    startGame:function(event){
        WZQRoomModel.isStart = true;
        this.Image_tip.visible = false;
        this.Button_jieshu.visible = true;
        this.Button_touxiang.visible = true;
        for(var i=1;i<=WZQRoomModel.renshu;i++) {
            if (this._players[i]) {
                this._players[i].playerQuanAnimation(false);
                this._players[i].showChessImg()
            }
        }
        this._countDown = WZQRoomModel.getTuoguanTime() || 10;
        this.showJianTou(WZQRoomModel.nextSeat);
        //this.Button_invite.visible = this.Button_ready.visible =false;

        this.addArmature()
    },

    addArmature:function(){
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/wzq_kaishi/kaishi.ExportJson");
        var kaishi = new ccs.Armature("kaishi");
        kaishi.setPosition(cc.winSize.width/2,SyConfig.DESIGN_HEIGHT/2);
        kaishi.getAnimation().play("Animation1",-1,0);
        this.addChild(kaishi, 2);
        kaishi.getAnimation().setFrameEventCallFunc(function (bone, evt) {
            if (evt == "finish") {
                kaishi.getAnimation().stop();
                kaishi.removeFromParent(true);
                ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/wzq_kaishi/kaishi.ExportJson");
            }
        });
    },

    showTouguanTime:function(_time){
        var countDown = (_time<10) ? "0"+_time : ""+_time;
        this.countDownLabel.setString(countDown);
    },

    /**
     * 闹钟上面的箭头 OnlimeRoom.js
     * @param seat
     */
    showJianTou: function (seat) {
        this.Image_time.visible = true;
        seat = seat || WZQRoomModel.nextSeat;
        if(seat == null ||　seat == 0 ){
            cc.log("这个值是null 或者 0 ...", WZQRoomModel.nextSeat);
            return;
        }
        var direct = this.getPlayerSeq(-2, WZQRoomModel.mySeat,seat);
        var coords = {1:{x:400 ,y:330},2:{x:1528,y:688}};
        var coord = coords[direct];
        this.Image_time.x = coord.x;
        this.Image_time.y = coord.y;

        //显示或者影藏光圈
        for(var index = 1 ; index <= WZQRoomModel.renshu ; index ++) {
            if (this._players[index]) {
                this._players[index].playerQuanAnimation(index == seat);
            }
        }
        this.showTouguanTime(this._countDown);
    },

    /**
     * 收到出牌消息，前台开始处理,由PlayPaohuziResponder驱动
     * @param event
     */
    onLetOutCard:function(event) {
        var message = event.getUserData();
        this._countDown = WZQRoomModel.getTuoguanTime() || 10;
        var userId = message.userId;
        var seat = message.seat;
        WZQChessLayer.addChess(this.Panel_qizi,message.cardIds)
        //下个出牌的位置
        var nextSeat = seat == 1 ? 2:1
        this.showJianTou(nextSeat);
    },

    onScoreClick:function(obj){
        var score = parseInt(obj.tempData)
        sySocket.sendComReqMsg(4201,[score]);
    },

    showSelectScore:function(){
        this.Image_tip.visible = true;
    },

    onUpdateScore:function(event){
        var message = event.getUserData();
        var seat = message.params[0]
        var score = message.params[1]
        this.onShowScore(seat,score)
    },

    onShowScore:function(seat,score){
        var playerVo = WZQRoomModel.getPlayerVoBySeat(seat)
        if(score != 0){
            this._players[seat].showScore(score)
        }
        if(playerVo.userId == PlayerModel.userId){
            this.myScore = score
            if(score == 0){
                this.Button_qifen.visible = this.Button_bisaifen.visible = true
            }else{
                this.Button_qifen.visible = this.Button_bisaifen.visible = false
                if(WZQRoomModel.getFangZhu(playerVo)){
                    this.getWidget("Image_text").loadTexture("res/res_wzq/tishiwenzi_2.png")
                }else{
                    this.getWidget("Image_text").loadTexture("res/res_wzq/tishiwenzi_1.png")
                }
            }
        }
    },

    onPlayerInfo: function (obj) {
        //cc.log("onPlayerInfo:" + JSON.stringify(this._players));
        if(this._players[obj.temp] == null){
            //cc.log("这个位置还没有玩家...");
        }else{
            this._players[obj.temp].showInfo();
        }

    },

    initData: function () {
        this.cleanData()
        this.seatSeq = WZQRoomModel.seatSeq;
        var players = WZQRoomModel.players;
        this.Image_time.visible =false;
        this.Label_fh.setString("房号:"+WZQRoomModel.tableId);
        this.Label_xf.setString("倍率:"+(WZQRoomModel.intParams[8]/100));
        this.btn_qyq_invite.visible = (ObjectUtil.size(players)<WZQRoomModel.renshu);
        for (var i=0;i<players.length;i++) {
            var name = players[i].name;
            name = CustomTextUtil.subTextWithFixWidth(name, 80, 20);
        }
        sy.scene.hideLoading();
        this._players = {};
        for (var i = 1; i <= players.length; i++) {
            this.getWidget("player" + i).visible = false;
            if (this._players[i] != null) {
                this._players[i].refreshAllScore();
            }
        }
        var isContinue = WZQRoomModel.ext[1] == 2;//是否是恢复牌局
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            var seq = this.getPlayerSeq(p.userId, WZQRoomModel.mySeat, p.seat);
            var wzqPlayer = this._players[p.seat] = new WZQPlayer(p, this.root, seq, p.group);
            wzqPlayer.showStatus(p.status);
            this.onShowScore(p.seat,p.ext[0])
            if(isContinue){
                this._players[p.seat].showChessImg(p.ext[1])
            }
        }
        if(isContinue){
            this.Image_tip.visible = false;
            this.showJianTou(WZQRoomModel.nextSeat);
            this.Button_jieshu.visible = true;
            this.Button_touxiang.visible = true;
            //for (var i = 1; i <= players.length; i++) {
            //    if (this._players[i] != null) {
            //        this._players[i].showChessImg()
            //    }
            //}
        }

        var qiPan = WZQRoomModel.qiPan
        var cardIds = []
        for(var i = 0;i < qiPan.length;i++){
            var cardId = []
            cardId.push(qiPan[i].x)
            cardId.push(qiPan[i].y)
            cardId.push(qiPan[i].val)
            cardIds.push(cardId)
        }
        WZQChessLayer.setChess(this.Panel_qizi,cardIds)
    },

    cleanData:function(){
        this.Panel_qizi.removeAllChildren(true)
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

    getPlayerSeq: function (userId, ownSeat, seat) {
        if(userId == -2 && WZQRoomModel.renshu == 2){
            if(ownSeat == seat){
                return 1;
            }else{
                return 2;
            }
        }
        if (userId == PlayerModel.userId)
            return 1;
        if(WZQRoomModel.renshu == 2)
            return 2;
        var seqArray = this.seatSeq[ownSeat];
        //cc.log("seqArray=========",seqArray);
        var seq = ArrayUtil.indexOf(seqArray, seat) + 1;
        return seq;
    },

    onJoin:function(event){
        var p = event.getUserData();
        var seq = this.getPlayerSeq(p.userId,WZQRoomModel.mySeat, p.seat);
        this._players[p.seat] = new WZQPlayer(p,this.root,seq);

        this.btn_qyq_invite.visible = (ObjectUtil.size(this._players)<WZQRoomModel.renshu);
    },

    onReturn:function(){
        sySocket.sendComReqMsg(6);
    },

    onOverClick:function(){
        AlertPop.show("确认要解散房间吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    onTouXiangClick:function(){
        var str = "确定认输？您将会输掉本局并向对方支付"+(WZQRoomModel.intParams[8]/100)+(this.myScore == 1?"比赛分":"棋分")
        AlertPop.show(str,function(){
            sySocket.sendComReqMsg(4203);
        })
    },

    onOver:function(event){
        this.isShowReadyBtn = false;
        var data = event.getUserData();
        this.message = data;
        //消息队列还没播完，结算消息过来了，先缓存下来
        if(PlayWZQMessageSeq.sequenceArray.length>0){
            PlayWZQMessageSeq.cacheClosingMsg(data);
            return;
        }

        for(var index = 0 ; index < WZQRoomModel.renshu ; index ++){
            if(this._players[index]){
                this._players[index].playerQuanAnimation(false);
            }
        }

        //清理听牌的显示
        var self = this;
        var t = 2500;
        var t1 = 800;//延时展示其他玩家的剩余牌的时间
        for(var i=0;i<data.length;i++){
            self._players[data[i].seat].updatePoint(data[i].totalPoint);
            if(data[i].totalPoint > 0){
                self._players[data[i].seat].addWinArmature()
            }
        }

        this.showResultTimeOutHandle = setTimeout(function(){//延迟弹出结算框
            self.isShowReadyBtn = true;
            var mc = new WZQBigResultPop(data);
            PopupManager.addPopup(mc);
        },t);
    },

    onSettingClick:function(){
        var mc = new WZQSetUpPop();
        PopupManager.addPopup(mc);
    },

    /**
     * 退出房间
     * @param event
     */
    onExitRoom:function(event){
        var p = event.getUserData();
        this._players[p.seat].exitRoom();
        delete this._players[p.seat];
        this.btn_qyq_invite.visible = (ObjectUtil.size(this._players)<WZQRoomModel.renshu);p.seat
        this._players[p.seat == 1?2:1].showFangZhu()
    },

    /**
     * 邀请
     */
    onInvite: function () {
        var wanfaDesc = WZQRoomModel.renshu+"人模式";
        var fangfeiDesc = "倍率:"+WZQRoomModel.intParams[8]/100

        var clubStr = "";
        if (WZQRoomModel.isClubRoom(WZQRoomModel.tableType)){
            clubStr = "[亲友圈]";
        }
        var playerNum = " "+ WZQRoomModel.renshu + "缺" + (WZQRoomModel.renshu - WZQRoomModel.players.length);
        var obj = {};
        obj.tableId = WZQRoomModel.tableId;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?num=' + WZQRoomModel.tableId + '&userId=' + encodeURIComponent(PlayerModel.userId);
        obj.title = '五子棋  房号:' + WZQRoomModel.tableId + playerNum;

        obj.description = clubStr + wanfaDesc + "," + fangfeiDesc +  "。";
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
        var p = WZQRoomModel.getPlayerVo(userId);
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

    onEnterTransitionDidFinish:function(){
        this._super();

        //this.scheduleUpdate();
    },

    getModel: function () {
       return WZQRoomModel;
    },

    /**
     * 获取显示时间的label OnlimeRoom.js (子类实现)
     *
     */
    getLabelTime: function () {
        return this.getWidget("Label_11");//时间;
    },


});