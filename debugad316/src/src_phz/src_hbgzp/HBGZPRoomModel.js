/**
 * Created by Administrator on 2019/11/21.
 */
var HBGZPRoomModel = {
    seatSeq:{
        1:[1,2,3,4],
        2:[2,3,4,1],
        3:[3,4,1,2],
        4:[4,1,2,3]
    },
    tableId:0,
    nowBurCount:0,
    totalBurCount:0,
    /**
     * {Array.<RoomPlayerVo>}
     */
    players:[],
    mySeat:0,
    nextSeat:0,
    wanfa:0,
    remain:0,
    mineLayout:null,
    selfAct:[],
    banker:0,
    overNiaoIds:[],
    overNiaoSeats:[],
    gangSeats:[],
    tingSeats:[],
    ext:[],
    _playersIp:[],
    ipSameTipStr:null,
    isStart:false,
    hasChuPai:false,
    needAutoLetOutId:0,
    isTingSelecting:false,
    isBaiJiao:false,
    nearestTingResult:[],
    isTrusteeship:0,//是否托管状态  0不托管  1托管
    isDaiKai:0,
    tableType:0,
    tableZqId:"",
    masterId:0,//创建或者代开房间的玩家id
    matchKeyId: 0,//比赛场ID
    isGameSite: false,//是否比赛场
    gameSiteRound: 0,// 比赛场当前轮数
    promotionNum: 0,// 晋级人数
    integralTimes: 0,// 倍数加成
    roundNumber: 0,   // 当前轮参赛人数
    gameSiteMaxRound: 0,//比赛场最大轮数
    huCards: [],//当前可胡的列表
    csmjIsOptXiaoHu:false,//长沙麻将用来判断是否操作了小胡可出牌
    touchCardId:0,//当前选择的牌Id
    localZhaCount:0,
    myOutHuxi:0,//当前自己的外面的胡息
    JianArray:[],//捡的牌id数组

    init:function(message){
        this.touchCardId = 0;
        this.myOutHuxi = 0;
        this.wanfa = message.wanfa;
        //cc.log("this.wanfa=====",JSON.stringify(message));
        this.renshu = message.renshu || 4;
        this.tableId = message.tableId;
        this.nowBurCount = message.nowBurCount;
        this.totalBurCount = message.totalBurCount;
        this.players = message.players;
        this.nextSeat = message.nextSeat;
        this.isGameSite = false;
        this.creditConfig = message.creditConfig || [];
        this.roomName = message.roomName;
        this.huCards.length = 0;

        this.JianArray = [];//捡的牌id数组

        this.masterId = message.masterId;
        this.isCredit = this.creditConfig[0];//是否是比赛房
        this.creditDivide = this.creditConfig[8];//当前是否需要除100
        this.creditScore =  this.creditConfig[3];//底分
        this.creditGiveNum =  this.creditConfig[4];//赠送分
        this.creditType = this.creditConfig[5];//赠送类型1固定2比例
        this.creditWay = this.creditConfig[6];//赠送方式1大赢家2所有赢家
        this.creditAApay = Math.floor((this.creditConfig[12] || 0)/100);

        this.openTuoguan = message.intParams[8];//托管

        this.intParams = message.intParams;//储存创房选择的玩法
        this.switchCoin = message.generalExt[1];//是否打开金币模式 0：关闭，1：打开

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        if (message.ext[12]==100000000){
            this.isGameSite = true;
        }

        if (message.extStr){
            this.matchKeyId = message.extStr[0];
        }
        if(this.getPlayerVo()){
            this.mySeat = this.getPlayerVo().seat;
        }else{
            this.mySeat = 1;
        }
        this.remain = message.remain;
        this.ext = message.ext;
        this.isDaiKai = message.isDaiKai;
        this.tableType = message.tableType;
        this.tableZqId = message.groupProperty;
        this.isStart = false;
        this.hasChuPai = false;
        this.isTingSelecting = false;
        this.isBaiJiao = false;
        this.nearestTingResult = [];
        this.needAutoLetOutId = 0;
        this.checkedTingData = [];
        this.isShuaiPai = false;//张掖麻将甩牌阶段
        //this.groupProperty = [];//禁牌
        this.chiTingByQA = false;
        this.isTianTing = false;
        this.isSelectHuaSe = false;
        this.allHuCard = [];
        this.lzTingResult = [];

        this.ahmj_wangID = message.ext[4] || -1;//安化麻将翻出的王牌ID

        if(this.renshu == 4){
            this.seatSeq = {
                1:[1,2,3,4],
                2:[2,3,4,1],
                3:[3,4,1,2],
                4:[4,1,2,3]}
        }else if(this.renshu == 3){
            this.seatSeq = {
                1:[1,2,3],
                2:[2,3,1],
                3:[3,1,2]}
        }else if(this.renshu == 2){
            this.seatSeq = {
                1:[1,2],
                2:[2,1]}
        }

        this.cleanData();
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == PlayerModel.userId){
                this.hasChuPai = this.getHasChuPai(p);
                if(p.handCardIds.length>0 || p.outedIds.length>0 || p.moldIds.length>0){
                    this.isStart = true;
                }
                this.handCardIds = p.matchExt;
                break;
            }
        }
        this.jtAngle = 0;
        this.jtSeq = [1,2,3,4];
        var angles = [0,270,180,90];
        if(this.renshu == 3){
            this.jtSeq = [1,2,3];
            angles = [0,270,90];
        }else if(this.renshu == 2){
            this.jtSeq = [1,2];
            angles = [0,180];
        }
        var seqArray = this.seatSeq[this.mySeat];
        for(var i=0;i<seqArray.length;i++){
            if(seqArray[i]==this.getFangzhuSeat()){
                this.jtAngle = angles[i];
                this.jtSeq = this.seatSeq[i+1];
                break;
            }
        }

        if(!this.isStart && (this.nowBurCount==1)){
            if (SdkUtil.isReview() && SyConfig.HAS_GPS) {
                PopupManager.addPopup(new GpsPop(MJRoomModel , 4));
            }
        }
    },

    getCreditPayWay:function(){
        return this.creditAApay != 0;
    },

    getIsSwitchCoin:function(){
        return this.switchCoin == 1
    },

    is3Ren: function() {
        return (this.renshu==3);
    },

    is2Ren: function() {
        return (this.renshu==2);
    },

    isClubRoom: function(_tableType) {
        return (_tableType == 1);
    },

    is4Ren: function() {
        return (this.renshu==4);
    },


    getFangFei: function() {
        return this.ext[5];
    },

    getFuType: function() {
        return this.ext[6];
    },

    //isAAzhifu
    getCostFangShi:function(){
        cc.log("this.ext..." , this.ext);
        return this.ext[1];
    },

    getFangZhu:function(playerVo){//玩家是不是房主
        if (this.isMoneyRoom()){
            return false;
        }
        return (playerVo.ext[2]==1);
    },

    setTouchCard:function(cardId){
        if (this.touchCardId != cardId){
            this.touchCardId = cardId;
        }
    },
    getTouchCard:function(){
        return this.touchCardId;
    },
    isShowFinger:function(){
        if(this.nextSeat==this.mySeat){
            return true;
        }
        return false;
    },

    getJSQTime: function() {
        return this.ext[18]|| 0;
    },

    isTingHu: function() {
        return (this.getTingHuConf() == 2);
    },

    getTingHuConf: function() {
        return this.ext[9];
    },

    getJiFenConf: function() {
        return this.ext[10];
    },

    getHuCountConf: function() {
        return this.ext[11];
    },

    getJiangLeiConf: function() {
        return this.ext[14];
    },

    getFangzhuSeat:function(){
        return this.ext[15];
    },

    isMoneyRoom:function(){
        return this.tableType == 3 || this.tableId >= 10000000;
    },
    getTuoguanTime:function(){
        return 120;
        // return (this.timeOut[0] || 1000) / 1000 ;
    },
    getDifenName:function(val){
        var name = "底分x"+val;
        return name;
    },

    getTingAllPushOutVoArray:function(){
        var voArray = [];
        for(var i=0;i<this.nearestTingResult.length;i++){
            var result = this.nearestTingResult[i];
            if(this.wanfa ==GameTypeEunmMJ.LZMJ ){
                voArray.push(result)
            }else{
                voArray.push(result.pushOut)
            }

        }
        return voArray;
    },

    getTingWithMahjong:function(curVo){
        var ting = null;
        var tingResult = this.nearestTingResult;
        for(var i=0;i<tingResult.length;i++){
            var result = tingResult[i];
            var pushOut = result.pushOut;
            if(pushOut.t==curVo.t&&pushOut.n==curVo.n){
                ting = result.ting;
                break;
            }
        }
        return ting;
    },

    isBanker:function(playerVo){//玩家是否是庄家
        return (playerVo.recover[1]==1);
    },

    is159Bird:function(){//是不是159中鸟
        return this.wanfa == GameTypeEunmMJ.AHMJ ?this.intParams[17]: this.ext[17];
    },

    isOneBird:function(){//是不是一鸟全中
        // if ()
        return this.ext[10];
    },

    isOneBirdInZZMJ:function(){//是不是一鸟全中
        return this.intParams?this.intParams[10] == 10:0;
    },

    //获取是否加倍
    isDouble:function(){
        return (this.ext[18] || false);
    },

    //获取小于多少分加倍
    getDScore:function(){
        return (this.ext[19] || 0);
    },

    //获取加倍数
    getDoubleNum:function(){
        return (this.ext[20] || 0);
    },

    isClubGoldRoom:function(){
        return this.groupTableGoldMsg[0] == 1;
    },

    getClubGlodCfg:function(){
        if(!this.isClubGoldRoom()){
            return "";
        }

        var infoArr = [];

        infoArr.push("底分:" + this.groupTableGoldMsg[1]);
        infoArr.push("最低进房:" + this.groupTableGoldMsg[2]);
        infoArr.push("最低踢出:" + this.groupTableGoldMsg[3]);


        return infoArr.join(" ");
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
    /**
     * 是否开启了托管
     * @returns {number|*}
     */
    isOpenTuoguan:function(){
        // cc.log("this.openTuoguan.."+this.openTuoguan)
        return this.openTuoguan
    },

    getPlayerIsTuoguan:function(playerVo){
        return playerVo.ext[4]==1;
    },

    getHasChuPai: function(playerVo) {
        return (playerVo.ext[2]==1);
    },

    getHuPoint: function(playerVo) {
        return playerVo.ext[4];
    },

    setHuPoint: function(playerVo, currentPoint) {
        playerVo.ext[4] = currentPoint;
    },

    seeBaoPai: function(id) {
        this.ext[4] = id;
    },

    gang: function(seat) {
        if(ArrayUtil.indexOf(this.gangSeats,seat) < 0)
            this.gangSeats.push(seat);
    },

    ting: function(seat) {
        if(ArrayUtil.indexOf(this.tingSeats,seat) < 0)
            this.tingSeats.push(seat);
    },

    isGang: function(seat) {
        seat = seat || this.mySeat;
        return (this.wanfa==2&&ArrayUtil.indexOf(this.gangSeats,seat)>=0);
    },

    isTing: function(seat) {
        seat = seat || this.mySeat;
        return ((this.isBaoTingHu())&&ArrayUtil.indexOf(this.tingSeats,seat)>=0);
    },

    isBaoTingHu:function(){
        return (this.isGSMJ() || this.isGuCang() || this.isKETMJ() || this.isTwoKETMJ() || this.isHSMJ() || this.isZYMJ() || this.isEBT() || this.isQAMJ()
        || this.isJNMJ() || this.isJCHS() || this.isTSMJ() || this.isLXMJ() || this.isWWMJ() || this.isJQSB() || this.isJQTJ() || this.isLZEB());
    },

    isHued: function(seat) {
        seat = seat || this.mySeat;
        var p = this.getPlayerVoBySeat(seat);
        if(p && p.huCards.length > 0) {
            return true;
        }
        return false;
    },

    hued: function(seat, huBean) {
        var p = this.getPlayerVoBySeat(seat);
        if(p) {
            p.huCards.push(huBean);
        }
    },

    getJTSeq:function(seat){
        var seq = ArrayUtil.indexOf(this.jtSeq,seat)+1;
        return seq;
    },

    getPlayerSeq:function(userId,ownSeat,seat){
        if(userId == PlayerModel.userId)
            return 1;
        var seqArray = this.seatSeq[ownSeat];
        var seq = ArrayUtil.indexOf(seqArray,seat)+1;
        return seq;
    },

    getPlayerVo:function(userId){
        userId = userId || PlayerModel.userId;
        var player = null;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == userId){
                player = p;
                break;
            }
        }
        return player;
    },

    getPlayerVoBySeat: function(seat) {
        var player = null;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.seat == seat){
                player = p;
                break;
            }
        }
        return player;
    },

    cleanData:function(){
        this.overNiaoIds.length = 0;
        this.overNiaoSeats.length = 0;
        this.gangSeats.length = 0;
        this.tingSeats.length = 0;
        this.hasChuPai = false;
        this.isTingSelecting = false;
        this.nearestTingResult = [];
        this.checkedTingData = [];
    },

    dealCard:function(message){
        cc.log(" mj dealCard meesage =",JSON.stringify(message));
        this.cleanData();
        this.nextSeat = message.nextSeat;
        this.remain = message.remain;
        this.banker = message.banker;
        this.baoting = message.xiaohu || -1;//其他玩家是否起手报听
        if(message.levelCardIds){
            this.levelCardIds = message.levelCardIds;
        }
        SyEventManager.dispatchEvent(SyEvent.START_PLAY,message);
    },

    sendPlayCardMsg:function(type,cardIds){
        var build = MsgHandler.getBuilder("proto/PlayCardReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var PlayCardReq = builder.build("PlayCardReq");
        var msg = new PlayCardReq();
        msg.cardIds = cardIds;
        msg.cardType = type;
        PingClientModel.setCustomLastTime(1);
        sySocket.send(msg,msgType);
    },

    /**
     * player对象与其他人IP是否有相同
     * @param userId
     * @returns {*}
     */
    isIpSame:function(){
        var sameIpSeats = [];
        var allIPs = [] ;
        for(var i=0;i<this.players.length;i++){
            allIPs.push(this.players[i].ip);
        }
        for(var i=0;i<this.players.length;i++){
            var mySeat = this.players[i].seat;
            for(var j=i+1;j<allIPs.length;j++){
                var himSeat = this.players[j].seat;
                if(this.players[i].ip == allIPs[j]){
                    if(ArrayUtil.indexOf(sameIpSeats,mySeat) < 0){
                        sameIpSeats.push(mySeat);
                    }
                    if(ArrayUtil.indexOf(sameIpSeats,himSeat) < 0){
                        sameIpSeats.push(himSeat);
                    }
                }
            }
        }
        return sameIpSeats;
    },

    getMoneyRoomBeilv:function(){
        return this.ext[8];
    },

    join:function(player){
        if(this.players.length>=4)
            return;
        var isHas = false;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == player.userId){
                isHas = true;
                break;
            }
        }
        if(!isHas){
            this.players.push(player);
            SyEventManager.dispatchEvent(SyEvent.JOIN_ROOM,player);
        }
    },

    exitRoom:function(userId){
        var player = null;
        var index = -1;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == userId){
                player = p;
                index = i;
                break;
            }
        }
        if(player){
            this.players.splice(index,1);
            SyEventManager.dispatchEvent(SyEvent.EXIT_ROOM,player);
        }
    },

    /**
     * 出牌
     */
    letOutCard:function(message){
        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
    },

    chuMahjong:function(id){
        this.sendPlayCardMsg(0,id,[]);
        this.simulateLetOutCard(id);
    },


    //玩家的房内头像是否已经绘制完全
    isRoomIconRoad: function() {
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.isRoladIcon != 1 && p.seat != 0){
                return false;
            }
        }
        return true;
    },

    updateGPS:function(userId,gps){
        var p = this.getPlayerVo(userId);
        p.gps = gps;
    },

    getWanFaDesc:function(){
        var infoArr = [];
        infoArr.push(HBGZPRoomModel.intParams[7] + "人");
        infoArr.push(HBGZPRoomModel.intParams[0] + "局");
        infoArr.push(HBGZPRoomModel.intParams[2] == 3?"群主支付":HBGZPRoomModel.intParams[2] == 2?"房主支付":"AA支付");

        infoArr.push(HBGZPRoomModel.intParams[22]+"个子起胡");
        infoArr.push(HBGZPRoomModel.intParams[23] == 1 ? "十个花" : "溜花");
        infoArr.push(HBGZPRoomModel.intParams[24] == 0 ? "不跑" : HBGZPRoomModel.intParams[24] == 1 ? "带跑" : "定跑");
        infoArr.push("底分:"+HBGZPRoomModel.intParams[17]+"");
        if(HBGZPRoomModel.intParams[24] == 1){
            infoArr.push("跑"+HBGZPRoomModel.intParams[25]+"分");
        }
        if(HBGZPRoomModel.intParams[26] == 1){
            infoArr.push("一炮多响");
        }

        if(HBGZPRoomModel.intParams[8] > 0){
            if(HBGZPRoomModel.intParams[21] == 1){
                infoArr.push("单局托管");
            }else if(HBGZPRoomModel.intParams[21] == 2){
                infoArr.push("整局托管");
            }else if(HBGZPRoomModel.intParams[21] == 3){
                infoArr.push("三局托管");
            }
        }else{
            infoArr.push("不托管");
        }

        if (HBGZPRoomModel.intParams[7] == 2 && HBGZPRoomModel.intParams[18] == 1){
            infoArr.push("低于" + HBGZPRoomModel.intParams[19] + "分翻" + HBGZPRoomModel.intParams[20] +"倍");
        }

        if (HBGZPRoomModel.intParams[7] == 2 && HBGZPRoomModel.intParams[27] && HBGZPRoomModel.intParams[27] != 0){
            infoArr.push("低于" + HBGZPRoomModel.intParams[27] + "分加" + HBGZPRoomModel.intParams[28] +"分");
        }

        return infoArr.join(" ");
    },

    /**
     * 客户端模拟出牌
     * @param id
     */
    simulateLetOutCard:function(id){
        var message = {"userId":PlayerModel.userId,"majiangIds":[id],"action":0,
            "seat":this.mySeat,"selfAct":[],"fromSeat":null,"zimo":null,"huArray":[],"xiaohu":[],simulate:1};
        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
    },


    moPai:function(message){
        if (message.selfAct.length == 6 && message.majiangIds.length==0 && message.seat == MJRoomModel.mySeat) {
            //防止闪退
            FloatLabelUtil.comText("摸牌消息发送过来的ids长度为0!!!");
        } else {
            SyEventManager.dispatchEvent(SyEvent.HBGZP_MO_PAI,message);
        }
    },

    getWanfaName:function(wanfa){
        var name = "";
        var wanfa = wanfa || this.wanfa;
        switch (wanfa){
            case GameTypeEunmZP.HBGZP:
                name = "湖北个子牌 ";
                break;
        }
        return name;
    },


    //玩家是否开了托管
    isTuoGuan:function(playerVo){
        return playerVo.ext[3]==1;
    },


}