
var WZQRoomModel = {
    init:function(message){
        this.wanfa = message.wanfa;
        this.renshu = message.renshu;
        this.tableId = message.tableId;
        this.roomName = message.roomName;
        this.nowBurCount = message.nowBurCount;
        this.totalBurCount = message.totalBurCount;
        this.players = message.players;
        this.creditConfig = message.creditConfig || [];
        this.nextSeat = message.nextSeat;
        this.remain = message.remain;//用于标明牌桌当前阶段状态
        this.ext = message.ext;
        this.banker = message.ext[1] || 0;
        this.scoreCard = message.scoreCard || [];
        this.timeOut = message.timeOut || [];

        this.intParams = message.intParams || [];//储存创房选择的玩法

        this.creditConfig = message.creditConfig || [];
        this.tableType = message.tableType;

        this.pauseValue = 0;//用于暂停处理消息

        this.replay = message.replay || false;//是否是回放
        this.qiPan = message.qiPan

        if(this.replay){
            this.paixuType = 1;
        }

        if(this.getPlayerVo()){
            this.mySeat = this.getPlayerVo().seat;
        }else{
            this.mySeat = 1;
        }
        this.switchCoin = message.generalExt[1] || 0;//是否是金币房间
        this.privateRoom = message.strParams[4] || 0;//是否是私密房
    },

    getIsSwitchCoin:function(){
        return this.switchCoin == 1
    },

    /**
     * 发送出牌消息
     * @param type
     * @param allCards
     */
    sendPlayCardMsg: function (allCards) {
        var build = MsgHandler.getBuilder("proto/PlayCardReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var PlayCardReq = builder.build("PlayCardReq");
        //var cardIds = [];
        //for (var i = 0; i < allCards.length; i++) {
        //    cardIds.push(allCards[i].c);
        //}
        var msg = new PlayCardReq();
        msg.cardIds = allCards;
        sySocket.send(msg, msgType);
    },

    cleanScore:function(){
        this.aTeamTongziScore = 0;
        this.bTeamTongziScore = 0;
        this.cTeamTongziScore = 0;

        this.aTeamCurScore = 0;
        this.bTeamCurScore = 0;
        this.cTeamCurScore = 0;
    },

    initMyCardForm:function(){
        this.initX = 86;
        //this._cardScale = 1.16;
        this._letOutCardScale = 1;
        this.cardsListNum = 3;
    },

    isClubRoom: function(_tableType) {
        return (_tableType == 1);
    },

    is3Ren: function(wanfa) {
        return true;
        //var tWanfa = wanfa || this.wanfa;
        //return (tWanfa == 115 || tWanfa == 116);
    },

    //是否使用保护牌不被拆开的策略
    isProtectedSort:function(){
        return false;
    },

    //是否是比赛房
    isCreditRoom:function(){
        return this.isCredit;
    },

    //是否是需要除以100
    isCreditDivide:function(){
        return this.creditDivide;
    },

    //获取比赛分数
    getCreditNum: function(playerVo) {
        playerVo.credit = MathUtil.toDecimal(playerVo.credit/100);
        return (playerVo.credit || 0);
    },

    //获取比赛底分
    getCreditScore: function() {
        if (this.creditDivide){
            this.creditScore = MathUtil.toDecimal(this.creditScore/100);
        }else{
            this.creditScore = MathUtil.toDecimal(this.creditScore);
        }
        return this.creditScore;
    },

    //获取赠送的值或者比例
    getCreditGiveNum: function() {
        if (this.creditDivide){
            this.creditGiveNum = MathUtil.toDecimal(this.creditGiveNum/100);
        }else{
            this.creditGiveNum = MathUtil.toDecimal(this.creditGiveNum);
        }
        return this.creditGiveNum;
    },

    //获取赠送类型固定还是比例
    getCreditType: function() {
        return this.creditType;
    },

    //获取赠送方式大赢家还是所有赢家
    getCreditWay: function() {
        return this.creditWay;
    },

    //是否是托管房间
    isAutoPlay:function(){
        return this.intParams[8] > 0;
    },

    getTuoguanTime:function(){
        return 10;
    },
    getPlayerIsTuoguan:function(playerVo){
        cc.log("playerVo.ext[10] =",playerVo.ext[10]);
        return playerVo.ext[10];
    },

    loadExtData3Ren:function(message){
        /*0是否显示剩余牌
         1几副牌
         2支付方式
         3谁先出牌
         4多少分结算
         5当前轮分数
         6切牌标识
         7排名奖惩
         8终局奖励
         9记分规则*/
        // cc.log("3ren ext" , message.ext);


        this.costFangShi = message.ext[2];//支付方式

        this.curScore = message.ext[4] || 0;

        this.isSave67 = message.ext[6] || 1;
        this.cfReward = message.ext[7] || 4;
        this.exScore = message.ext[8] || 100;
        this.xifenWay = message.ext[9] || 1;

        this.endScore = message.ext[12];


    },

    getFangZhu:function(playerVo){//玩家是不是房主
        return (playerVo.ext[2]==1);
    },

    getCostFangShi:function(){
        return this.costFangShi
    },

    getPlayerGroup: function(playerVo) {
        playerVo.group = playerVo.ext[0];
        return playerVo.ext[0];
    },

    getPlayerIsFirstOut: function(playerVo){
        playerVo.isFirstOut = playerVo.ext[2];
        return playerVo.ext[2];
    },

    //玩家的房内头像是否已经绘制完全
    isRoomIconRoad:function() {
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.isRoladIcon != 1 && p.seat != 0){
                return false;
            }
        }
        return true;

    },

    updatePayerTeamId: function(userId , newTeamId){
        var playerVo = this.getPlayerVo(userId);
        if(playerVo){
            playerVo.ext[0] = newTeamId;
        }

    },

    updateGPS: function (userId, gps) {
        var p = this.getPlayerVo(userId);
        p.gps = gps;
    },

    isNextSeatBt: function () {
        var nextSeat = this.seatSeq[this.mySeat][1];
        if (this.btMap[nextSeat])
            return true;
        return false;
    },

    isShowCardNumber: function () {
        return true;
        //return this.ext[0] == 1;
    },

    /**
     * 上一次提示出牌的数据
     * @param cardPattern {CardPattern}
     */
    prompt: function (cardPattern , cardsList) {
        this.promptCardPattern = cardPattern;
        this.lastTipCards = cardsList;
    },

    /**
     * 获取player对象
     * @param userId
     * @returns {RoomPlayerVo}
     */
    getPlayerVo: function (userId) {
        userId = userId || PlayerModel.userId;
        var player = null;
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.userId == userId) {
                player = p;
                break;
            }
        }
        return player;
    },
    /**
     * 获取player对象
     * @param userId
     * @returns {RoomPlayerVo}
     */
    getPlayerVoBySeat: function (seat) {
        var player = null;
        //cc.log("QFRoomModel this.players.length" , this.players.length);
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.seat == seat) {
                player = p;
                break;
            }
        }
        return player;
    },

    /**
     * player对象与其他人IP是否有相同
     * @returns {Array}
     */
    isIpSame: function () {
        var sameIpSeats = [];
        var allIPs = [];
        for(var i=0;i<this.players.length;i++){
            allIPs.push(this.players[i].ip);
        }
        for(var i=0;i<this.players.length-1;i++){
            var p = this.players[i];
            var meSeat = p.seat;
            for(var j=i+1;j<allIPs.length;j++){
                var himSeat = this.players[j].seat;
                if(p.ip == allIPs[j]){
                    if (ArrayUtil.indexOf(sameIpSeats,meSeat)<0) {
                        sameIpSeats.push(meSeat);
                    }
                    if (ArrayUtil.indexOf(sameIpSeats,himSeat)<0) {
                        sameIpSeats.push(himSeat);
                    }
                }
            }
        }
        return sameIpSeats;
    },

    /**
     *
     * @param player {RoomPlayerVo}
     * @return
     */
    join: function (player) {
        if (this.players.length >= 4)
            return;
        var isHas = false;
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.userId == player.userId) {
                isHas = true;
                break;
            }
        }
        if (!isHas) {
            player.isRoladIcon = 0;
            this.players.push(player);
            SyEventManager.dispatchEvent(SyEvent.JOIN_ROOM, player);
        }
    },

    exitRoom: function (userId) {
        var player = null;
        var index = -1;
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.userId == userId) {
                player = p;
                index = i;
                break;
            }
        }
        if (player) {
            this.players.splice(index, 1);
            SyEventManager.dispatchEvent(SyEvent.EXIT_ROOM, player);
        }
    },

    cleanData: function () {
        this.btMap = {};
        this.promptCardPattern = null;
        this.lastTipCards = null;
    },

    /**
     * 发牌
     * @param message
     */
    dealCard: function (message) {
        this.cleanData();
        this.nextSeat = message.nextSeat;
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            p.ext[0] = message.xiaohu[p.seat-1];
        }
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.userId == PlayerModel.userId) {
                var ids = message.handCardIds;
                var cardIds = [];
                for (var j = 0; j < ids.length; j++) {
                    cardIds.push(QFAI.getCardDef(ids[j]));
                }

                p.handCardIds = cardIds;
                SyEventManager.dispatchEvent(SyEvent.START_PLAY, p);
                break;
            }
        }
    },

    /**
     * 出牌
     */
    letOutCard: function (message) {
        cc.log("letOutCard",JSON.stringify(message))
        this.promptCardPattern = null;
        this.lastTipCards = null;
        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD, message);
    },

    /**
     * 四舍五入十位数
     */
    dealScore:function(value){
        //return value;//屏蔽四舍五入功能
        if(value == 0){
            return 0;
        }
        cc.log("dealScore ... " , value + "--->" + Math.round(value / 100) * 100);
        return  Math.round(value / 100) * 100;
    },

};