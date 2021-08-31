/**
 * Created by zhoufan on 2016/7/23.
 */
/**
 * 卡牌的数据映射
 * @type {{userId: number, name: string, seat: number, sex: number, icon: string, point: number, status: number, ip: string}}
 */
var QfGameType ={
    QF:190,
};

var RoomPlayerVo = {
    userId: 0,
    name: 0,
    seat: 0,
    sex: 0,
    icon: "",
    point: 0,
    status: 0,
    handCardIds: null,
    outCardIds: null,
    recover: null,
    ip: "",
    outedIds: null,
    moldIds: null,
    angangIds: null,
    ext: [],
    needScore:100,
};

var QFRoomModel = {
    seatSeq: {
        1: [1, 2, 3],
        2: [2, 3, 1],
        3: [3, 1, 2],
        4: [4 , 1 , 2 , 3]
    },
    tableId: 0,
    nowBurCount: 0,
    totalBurCount: 0,
    _cardY1: 17,
    _cardY2: 74,
    mySeat: null,
    /**
     * {Array.<RoomPlayerVo>}
     */
    players: [],
    mySeat: 0,
    nextSeat: 0,
    btMap: {},
    promptCardPattern: null,
    lastTipCards:null,
    wanfa: 0,
    renshu: 0,
    _playersIp: [],
    ipSameTipStr: null,
    isStart: false,
    ext: [],
    cutPoint:129,
    cutCardSeat:0, //切牌人座位，0为不能切牌
    cardsListNum:3,//几副牌模式
    isGameSite: 0,//是否比赛场
    gameSiteRound: 0,// 比赛场当前轮数
    promotionNum: 0,// 晋级人数
    integralTimes: 0,// 倍数加成
    roundNumber: 0,   // 当前轮参赛人数
    gameSiteMaxRound: 0,//比赛场最大轮数
    aTeamScore:0,//a组当前的总分数
    bTeamScore:0,//b组当前的总分数
    cTeamScore:0,//c组当前的总分数
    aTeamTongziScore:0,//a组当局喜分
    bTeamTongziScore:0,//b组当局喜分
    cTeamTongziScore:0,//c组当局喜分
    aTeamTotalXiScore:0,//a组所有喜分
    bTeamTotalXiScore:0,//b组所有喜分
    cTeamTotalXiScore:0,//c组所有喜分
    
    aTeamCurScore:0,//a组这一局的当前分数
    bTeamCurScore:0,//b组这一局的当前分数
    cTeamCurScore:0,//c组这一局的当前分数
    cleanCards:1,//清牌的逻辑开关
    //界面布局相关参数
    firstLineLimit : 23,
    initCardYLine1 : 95,
    initCardYLine2 : 60,
    _cardG: 101,
    CardMidX : 1060,
    _cardScale : 1.08,
    _letOutCardScale : 0.85,
    tableType : 0,//0普通 1军团 2练习

    _pzLableColor:[],

    scoreCard:[],//桌面的5，10，k列表;
    isSave67:0,
    cfReward:0,
    exScore:0,
    xifenWay:0,
    overbird:[],



    init: function (message) {
        //cc.log("QFRoomModel init ..." , JSON.stringify(message));
        //cc.log("QFRoomModel data..." , message.num5 , message.num10 , message.numk );
        //{"tableId":"100001","nowBurCount":1,"totalBurCount":10,"players":[{"userId":"999","name":"test","seat":3,"sex":1,"icon":"123","point":0,"handCardIds":[],"outCardIds":[]}],"nextSeat":null}
        this.wanfa = message.wanfa;
        this.renshu = message.renshu;
        this.cleanScore();
        
        this.aTeamScore = 0;
        this.bTeamScore = 0;
        this.cTeamScore = 0;
        this.aTeamTotalXiScore = 0;
        this.bTeamTotalXiScore = 0;
        this.cTeamTotalXiScore = 0;
        this.roomName = message.roomName;
        
        this.curScore = message.score || 0;
        this.intParams = message.intParams;//储存创房选择的玩法
        
        this.fiveNum = 0;
        this.tenNum = 0;
        this.kNum = 0;

        this.exScore = message.jiangli;
        this.endScore = message.MaxScore;
        this.costFangFei = message.fangfei;
        this.nextSeat = message.nextSeat;
        this.costFangShi = 0;
        this.tableType = message.tableType;
        this.scoreCard = message.scoreCard;
        this.overbird = [415,206,308,314,305,305];

        // cc.log("当前创建的房间类型：" , this.tableType);

        //cc.log("当前创建的房间的玩法为：" , this.wanfa);

        this.loadExtData3Ren(message);

        this.creditConfig = message.creditConfig || [];
        this.isCredit = this.creditConfig[0];//是否是比赛房
        this.creditDivide = this.creditConfig[8];//当前是否需要除100
        this.creditScore =  this.creditConfig[3];//底分
        this.creditGiveNum =  this.creditConfig[4];//赠送分
        this.creditType = this.creditConfig[5];//赠送类型1固定2比例
        this.creditWay = this.creditConfig[6];//赠送方式1大赢家2所有赢家
        this.switchCoin = message.generalExt[1];//是否开启金币模式，0：关闭，1：开启
        this.creditAApay = Math.floor((this.creditConfig[12] || 0)/100);

        //cc.log("创建房间后台下发的部分数据为 ：",this.wanfa , this.exScore , this.endScore , this.costFangFei , this.nextSeat);
        this.initMyCardForm();

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        this.seatSeq = {1: [1, 2, 3], 2: [2, 3, 1], 3: [3, 1, 2]};

        // cc.log("this.seatSeq===========" , this.seatSeq);

        QFAI.MAX_CARD = this.wanfa;
        //AI.MAX_CARD = this.wanfa;
        // cc.log("message.tableId ===="+message.tableId);
        this.tableId = message.tableId;
        this.nowBurCount = message.nowBurCount;
        this.totalBurCount = message.totalBurCount;
        this.players = message.players;
        //cc.log("后台下发的 玩家数量！！！！！！！！！！！！！！！：" , this.players.length);
        //cc.log("this.players :" + JSON.stringify(message.players) );
        this.ext = message.ext;
        // cc.log("information :::::::::::::::::::::::::"+JSON.stringify(this.ext));
        this.cutCardSeat = message.ext[10];

        this.isStart = false;
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            p.isRoladIcon = 0;
            if (p.userId == PlayerModel.userId) {
                //p.handCardIds = [105,105,105,105,106,106,206,106,314,207,207,207,308,308,308,209,409,409,110,110,210,111,111,211,212,312,412]
                //p.handCardIds = [112,212,312,111,211,311,110,104,204,106,206,206,409,407,214,314,314,215,315,115,108,208,308,113,213,313,413]

                //p.handCardIds = [213,212,314,215,211,215,210,110,104,204];

                //p.handCardIds = [213,213,213,214,114,314,215,115,215,311,110,212,112];
                var ids = p.handCardIds;

                //cc.log("this.players handCardIds :" + ids.length + JSON.stringify( p.handCardIds) , p.handCardIds.length );
                var cardIds = [];
                for (var j = 0; j < ids.length; j++) {
                    cardIds.push(QFAI.getCardDef(ids[j]));
                }
                p.handCardIds = cardIds;
                if (p.handCardIds.length > 0 || p.outCardIds.length > 0) {
                    this.isStart = true;
                }
                break;
            }
            if (p.handCardIds.length > 0 || p.outCardIds.length > 0) {
                this.isStart = true;
            }
        }
        //记录当前两组这一局的分数
        for (var index = 0; index < this.players.length; index++) {
            var tPlayer = this.players[index];
            tPlayer.group = tPlayer.seat; //this.getPlayerGroup(tPlayer);

            if(tPlayer.group == 1){
                this.aTeamScore = tPlayer.ext[4];
                this.aTeamCurScore = tPlayer.ext[6];
                this.aTeamTongziScore = tPlayer.ext[7];
                this.aTeamTotalXiScore = tPlayer.ext[9];
            }else if(tPlayer.group == 2){
                this.bTeamScore = tPlayer.ext[4];
                this.bTeamCurScore = tPlayer.ext[6];
                this.bTeamTongziScore = tPlayer.ext[7];
                this.bTeamTotalXiScore = tPlayer.ext[9];
            }else{
                this.cTeamScore = tPlayer.ext[4];
                this.cTeamCurScore = tPlayer.ext[6];
                this.cTeamTongziScore = tPlayer.ext[7];
                this.cTeamTotalXiScore = tPlayer.ext[9];
            }
        }
        //cc.log("后台下发的玩家当局分数为..." , this.aTeamCurScore , this.bTeamCurScore);

        this.isGameSite = 0;
        this.mySeat = this.getPlayerVo().seat;
        this.cleanData();
    },

    getCreditPayWay:function(){
        return this.creditAApay != 0;
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

    getIsSwitchCoin:function(){
        return this.switchCoin == 1
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
        //return 120;
        if (this.isAutoPlay()){
            return this.intParams[8]==1?60:this.intParams[8];
        }else{
            return 30;
        }
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

        QFAI.initCARDS();

    },

    getCostFangShi:function(){
        return this.costFangShi
    },

    getSave67Str:function(){
        var str = "";
        if (this.isSave67 == 1){
            str = "留6和7";
        }else{
            str = "不留6和7";
        }
        return str;
    },

    getCfReward:function(){
        var str = "";
        if(this.renshu == 2){
            str = "排名奖惩+50/-50";
        } else if (this.cfReward == 4){
            str = "排名奖惩+100/-40/-60";
        }else if(this.cfReward == 3){
            str = "排名奖惩+100/-30/-70";
        }else{
            str = "排名奖惩+40/0/-40";
        }
        return str;
    },

    getExScoreStr:function(){
        var str = this.exScore +  "最终奖励分";
        return str;
    },

    getXiWayStr:function(){
        var str = "";
        if (this.xifenWay == 1){
            str = "喜分用加法计算";
        }else{
            str = "喜分用乘法计算";
        }
        return str;
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
        //
        //PopupManager.removeClassByPopup(DTZSmallResultPop);
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

}