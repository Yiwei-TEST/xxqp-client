/**
 * Created by zhoufan on 2016/7/23.
 */
/**
 * 卡牌的数据映射
 * @type {{userId: number, name: string, seat: number, sex: number, icon: string, point: number, status: number, ip: string}}
 */
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

var DTZRoomModel = {
    seatSeq: {
        1: [1, 2, 3],
        2: [2, 3, 1],
        3: [3, 1, 2],
        4: [4 , 1 , 2 , 3]
    },
    tableId: 0,
    nowBurCount: 0,
    totalBurCount: 0,
    wanfa3:113,
    wanfa4:114,
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
    cardsListNum:3,//几副牌模式
    isGameSite: 0,//是否比赛场
    gameSiteRound: 0,// 比赛场当前轮数
    promotionNum: 0,// 晋级人数
    integralTimes: 0,// 倍数加成
    roundNumber: 0,   // 当前轮参赛人数
    gameSiteMaxRound: 0,//比赛场最大轮数
    aTeamScore:0,//a组当前的总分数
    bTeamScore:0,//b组当前的总分数
    aTeamTongziScore:0,//a组所有筒子分
    bTeamTongziScore:0,//b组所有筒子分
    aTeamCurScore:0,//a组这一局的当前分数
    bTeamCurScore:0,//b组这一局的当前分数
    cTeamCurScore:0,//c组这一局的当前分数
    fiveNum:0,
    tenNum:0,
    kNum:0,
    cleanCards:1,//清牌的逻辑开关
    //界面布局相关参数
    firstLineLimit : 25,
    initCardYLine1 : 143,
    initCardYLine2 : 23,
    initX : 150,
    _cardScale : 1.1,
    _letOutCardScale : 0.85,
    tableType : 0,//0 普通 1 军团 2 练习 3 金币场
    _pzLableColor:[],
    countDown: 0,//托管时间
    matchKeyId: 0,//比赛场ID



    init: function (message) {
        cc.log("DTZRoomModel init ..." , JSON.stringify(message));
        //cc.log("DTZRoomModel data..." , message.num5 , message.num10 , message.numk );
        //{"tableId":"100001","nowBurCount":1,"totalBurCount":10,"players":[{"userId":"999","name":"test","seat":3,"sex":1,"icon":"123","point":0,"handCardIds":[],"outCardIds":[]}],"nextSeat":null}
        this.wanfa = message.wanfa;
        this.renshu = message.renshu;
        this.aTeamScore = message.apoint || 0;
        this.bTeamScore = message.bpoint || 0;
        this.cTeamScore = 0;
        this.curScore = message.score || 0;
        this.aTeamTongziScore = message.tzAgroup || 0;
        this.bTeamTongziScore = message.tzBgroup || 0;
        this.cTeamTongziScore = 0;
        this.fiveNum = message.num5 || 0;
        this.tenNum = message.num10 || 0;
        this.kNum = message.numk || 0;
        this.aTeamCurScore = 0;
        this.bTeamCurScore = 0;
        this.cTeamCurScore = 0;
        this.exScore = message.jiangli;
        this.endScore = message.MaxScore;
        this.costFangFei = message.fangfei;
        this.nextSeat = message.nextSeat;
        this.isDark8 = 0;
        this.isRemove67 = 0;
        this.costFangShi = 0;
        this.tableType = message.tableType;
        this.roomName = message.roomName;
        if (message.extStr){
            this.matchKeyId = message.extStr[0];
        }

        this.creditConfig = message.creditConfig || [];
        this.isCredit = this.creditConfig[0];//是否是比赛房
        this.creditDivide = this.creditConfig[8];//当前是否需要除100
        this.creditScore =  this.creditConfig[3];//底分
        this.creditGiveNum =  this.creditConfig[4];//赠送分
        this.creditType = this.creditConfig[5];//赠送类型1固定2比例
        this.creditWay = this.creditConfig[6];//赠送方式1大赢家2所有赢家
        this.creditXpkf = message.creditConfig[11] / 100;
        this.creditAApay = Math.floor((this.creditConfig[12] || 0)/100);

        this.intParams = message.intParams;//储存创房选择的玩法
        this.goldMsg  = message.goldMsg ? message.goldMsg.split(",") : [0,0,0];// goldMsg:100,1000,1; 第1位：门票// 第2位：进房限制// 第3位：倍率
        GoldRoomConfigModel.curClickRoomkeyId =  message.goldRoomConfigId || 0;

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        cc.log("当前创建的房间类型：" , this.tableType);

        //cc.log("当前创建的房间的玩法为：" , this.wanfa);

        if (this.is3Ren()) {
            this.loadExtData3Ren(message);
        } else {
            this.loadExtData(message);
        }

        //cc.log("创建房间后台下发的部分数据为 ：",this.wanfa , this.exScore , this.endScore , this.costFangFei , this.nextSeat);
        this.initMyCardForm();


        if (this.renshu == 2) {
            this.seatSeq = {1: [1, 2], 2: [2, 1]};
        } else if (this.renshu == 3) {
            this.seatSeq = {1: [1, 2, 3], 2: [2, 3, 1], 3: [3, 1, 2]};
        } else if (this.renshu == 4) {
            this.seatSeq = {1: [1, 2, 3, 4], 2: [2, 3, 4, 1], 3: [3, 4, 1, 2] , 4: [4, 1, 2, 3] };
        }
        DTZAI.MAX_CARD = this.wanfa;

        this.tableId = message.tableId;
        this.nowBurCount = message.nowBurCount;
        this.totalBurCount = message.totalBurCount;
        this.players = message.players;
        //cc.log("后台下发的 玩家数量！！！！！！！！！！！！！！！：" , this.players.length);
        cc.log("this.players :" + JSON.stringify(message.players) );
        this.ext = message.ext;

        this.isStart = false;
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            p.isRoladIcon = 0;
            if (p.userId == PlayerModel.userId) {
                var ids = p.handCardIds;
                //cc.log("this.players handCardIds :" + ids.length + JSON.stringify( p.handCardIds) , p.handCardIds.length );
                var cardIds = [];
                for (var j = 0; j < ids.length; j++) {
                    cardIds.push(DTZAI.getCardDef(ids[j]));
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
            tPlayer.group = this.getPlayerGroup(tPlayer);
            if(tPlayer.group == 1){
                this.aTeamCurScore += tPlayer.point;
            }else if(tPlayer.group == 2){
                this.bTeamCurScore += tPlayer.point;
            }else{
                this.cTeamCurScore += tPlayer.point;
            }
        }
        //cc.log("后台下发的玩家当局分数为..." , this.aTeamCurScore , this.bTeamCurScore);

        this.isGameSite = 0;
        if(this.getPlayerVo()){
            this.mySeat = this.getPlayerVo().seat;
        }else{
            this.mySeat = 1;
        }
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
        this.creditScore =  this.creditConfig[3];
        if (this.creditDivide){
            this.creditScore = MathUtil.toDecimal(this.creditScore/100);
        }else{
            this.creditScore = MathUtil.toDecimal(this.creditScore);
        }
        return this.creditScore;
    },

    //获取赠送的值或者比例
    getCreditGiveNum: function() {
        this.creditScore =  this.creditConfig[4];
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

    initMyCardForm:function(){
        if (this.is4FuPai() && this.is4Ren()) {   //四人 四副
            this.firstLineLimit = 22; //最下面一行卡牌最多显示多少张
            this.initCardYLine1 = 240;//上面那行的显示y坐标
            this.initCardYLine2 = 113;//下面那行的显示y坐标
            this.initX = 129;         //初始显示卡牌的x坐标
            this._cardScale = 1.16;    //卡牌的缩放比
            this._letOutCardScale = 1; //打出去的卡牌的缩放比
            this.cardsListNum = 4;    //用于显示是几副牌模式
        } else if(this.is3FuPai() && this.is4Ren()){//四人 三副
            this.firstLineLimit = 22; //同上
            this.initCardYLine1 = 240;
            this.initCardYLine2 = 113;
            this.initX = 129;
            this._cardScale = 1.16;
            this._letOutCardScale = 1;
            this.cardsListNum = 3;
        }else if(this.is4FuPai() && this.is3Ren()){//三人 三幅
            this.firstLineLimit = 22; //同上
            this.initCardYLine1 = 240;
            this.initCardYLine2 = 113;
            this.initX = 129;
            this._cardScale = 1.16;
            this._letOutCardScale = 1;
            this.cardsListNum = 3;
        }else if(this.is3FuPai() && this.is3Ren()){//三人 四副
            this.firstLineLimit = 22; //同上
            this.initCardYLine1 = 240;
            this.initCardYLine2 = 113;
            this.initX = 129;
            this._cardScale = 1.16;
            this._letOutCardScale = 1;
            this.cardsListNum = 3;
        }else if(this.is4FuPai() && this.is2Ren()){//三人 三幅
            this.firstLineLimit = 22; //同上
            this.initCardYLine1 = 240;
            this.initCardYLine2 = 113;
            this.initX = 129;
            this._cardScale = 1.16;
            this._letOutCardScale = 1;
            this.cardsListNum = 3;
        }else if(this.is3FuPai() && this.is2Ren()){//三人 四副
            this.firstLineLimit = 22; //同上
            this.initCardYLine1 = 240;
            this.initCardYLine2 = 113;
            this.initX = 129;
            this._cardScale = 1.16;
            this._letOutCardScale = 1;
            this.cardsListNum = 3;
        }
    },

    isMoneyRoom:function(){
        cc.log("this.tableType..." , this.tableType , this.tableId);
        return this.tableType == 3 || this.tableId >= 10000000;
        //return this.tableId >= 10000000;
    },

    isMatchRoom:function(){
        return this.matchKeyId > 0 ;
    },

    getMatchInfos:function(playerVo){
        //ext[9]：0为预赛，大于0为复赛第几轮
        if(this.ext[29] <= 0){
            var name = "预赛 第"+playerVo.ext[12]+"局  "+"低于"+this.ext[30]+"分淘汰";
        }else{
            var name = "复赛 第"+this.ext[29]+"轮 第"+playerVo.ext[12]+"局";
        }
        return name;
    },

    getMoneyModeId:function(){
        return this.ext[21];
    },

    getMoneyRoomBeilv:function(){
        return this.ext[22];
    },

    getTuoguanTime:function(){
        //return 120;
        return (this.tuoguanTime || 1000) / 1000 ;
    },

    getMatchTuoguanTime:function(_seat){
        var seat = _seat || this.nextSeat;
        var time = 0;
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.seat == seat) {
                time = p.ext[12];
                break;
            }
        }
        return parseInt(time / 1000);
    },

    getTuoguanRealTime:function(){
        return this.needTimeToTuoguan || 30;//服务器告知 进入托管的剩余时间
    },

    isClubRoom: function(_tableType) {
        return (_tableType == 1);
    },

    is3FuPai: function(wanfa) {
        var tWanfa = wanfa || this.wanfa;
        return (tWanfa == 113 || tWanfa == 115 || tWanfa == 117);
    },

    is4FuPai: function(wanfa) {
        var tWanfa = wanfa || this.wanfa;
        return (tWanfa==114 || tWanfa==116 || tWanfa==118  || tWanfa == 210 || tWanfa == 211 || tWanfa == 212);
    },

    is2Ren: function(wanfa) {
        var tWanfa = wanfa || this.wanfa;
        return (tWanfa==117 || tWanfa==118 || tWanfa == 210);
    },

    is3Ren: function(wanfa) {
        var tWanfa = wanfa || this.wanfa;
        return (tWanfa == 115 || tWanfa == 116 || tWanfa == 211);
    },

    is4Ren: function(wanfa) {
        var tWanfa = wanfa || this.wanfa;
        return (tWanfa==113 || tWanfa==114 || tWanfa == 212);
    },

    //快乐四喜玩法
    isKlsx: function(wanfa) {
        var tWanfa = wanfa || this.wanfa;
        return (tWanfa==210 || tWanfa==211 || tWanfa==212);
    },


    //是不是打筒子玩法
    isDTZ: function(wanfa) {
        var tWanfa = wanfa || this.wanfa;
        var isDtz = false ;
        if ((tWanfa >= 113 && tWanfa <= 118) || (tWanfa >= 210 && tWanfa <= 212))
            isDtz = true;
        return isDtz;
    },

    //是否使用保护牌不被拆开的策略
    isProtectedSort:function(){
        if(this.is3Ren() || this.is2Ren() || (this.is4Ren() && this.is4FuPai())){
            return false;
        }else if(this.is4Ren() && this.is3FuPai()){
            return true;
        }
    },

    loadExtData3Ren:function(message){
        cc.log("3ren ext" , message.ext);
        this.aTeamScore = message.ext[1] || 0;
        this.bTeamScore = message.ext[2] || 0;
        this.cTeamScore = message.ext[3] || 0;
        this.curScore = message.ext[4] || 0;

        this.fiveNum = message.ext[5] || 0;
        this.tenNum = message.ext[6] || 0;
        this.kNum = message.ext[7] || 0;

        this.aTeamTongziScore = message.ext[8] || 0;
        this.bTeamTongziScore = message.ext[9] || 0;
        this.cTeamTongziScore = message.ext[10] || 0;

        this.costFangFei = message.ext[11];
        this.endScore = message.ext[12];
        this.exScore = message.ext[13];

        this.isDark8 = message.ext[14];//是否扑八张
        this.isRemove67 = message.ext[15];//是否移除67
        this.costFangShi = message.ext[16];//支付方式

        this.bida = message.ext[17];//有牌必打
        this.wangtongzi = message.ext[18];//王筒子
        this.openTuoguan = message.ext[19];//托管
        this.suijiChuTou = message.ext[20];//随机出头
        //中间有几项 是金币场使用的
        this.moneyModeId = message.ext[21];
        this.moneyRoomBeilv = message.ext[22];
        this.tuoguanTime = message.ext[23];
        this.needTimeToTuoguan = message.ext[26];//服务器告知 进入托管的剩余时间
        this.isKeDaiPai = message.ext[27];//可带牌

    },

    /**
     * 两人 四人
     * @param message
     */
    loadExtData:function(message){
        this.aTeamScore = message.ext[1] || 0;
        this.bTeamScore = message.ext[2] || 0;
        this.curScore = message.ext[3] || 0;

        this.fiveNum = message.ext[4] || 0;
        this.tenNum = message.ext[5] || 0;
        this.kNum = message.ext[6] || 0;

        this.aTeamTongziScore = message.ext[7] || 0;
        this.bTeamTongziScore = message.ext[8] || 0;

        this.costFangFei = message.ext[9];
        this.endScore = message.ext[10];
        this.exScore = message.ext[11];

        this.isDark8 = message.ext[12];//是否扑八张
        this.isRemove67 = message.ext[13];//是否移除67
        this.costFangShi = message.ext[14];//支付方式
        this.bida = message.ext[15];//有牌必打
        this.wangtongzi = message.ext[16];//王筒子
        this.openTuoguan = message.ext[17];//托管
        this.suijiChuTou = message.ext[18];//随机出头
        //中间有几项 是金币场使用的
        this.tuoguanTime = message.ext[21];//进入托管的配置时间
        this.needTimeToTuoguan = message.ext[24];//服务器告知 进入托管的剩余时间
        this.isKeDaiPai = message.ext[25];//可带牌
        //
        //this.isCredit = message.ext[29];//是否是比赛房
        //this.creditScore =  message.ext[32];//底分
        //this.creditGiveNum =  message.ext[33];//赠送分
        //this.creditType = message.ext[34];//赠送类型1固定2比例
        //this.creditWay = message.ext[35];//赠送方式1大赢家2所有赢家
    },

    isBida:function(){
      return this.bida;
    },

    /**
     * 如果开启了王筒子玩法 影响牌型判断 连对能上王 飞机能上2
     */
    isWTZ:function(){
        //cc.log("是否是 王筒子模式.." , this.wangtongzi);
        if(DTZRoomModel.is4FuPai() || DTZRoomModel.is4Ren()){//后台的保护没有做全面
            return false;
        }
        return this.wangtongzi
    },

    /**
     * 是否是随机出头
     */
    isSjct:function(){
        if(DTZRoomModel.is4Ren()){//后台没有屏蔽
            return false;
        }
        return this.suijiChuTou;
    },

    /**
     * 是否开启了托管
     * @returns {number|*}
     */
    isOpenTuoguan:function(){
        //if(DTZRoomModel.is4Ren(this.wanfa)){
        //    return false;
        //}
        cc.log("this.openTuoguan.."+this.openTuoguan)
        return this.openTuoguan
    },

    /**
     * 是否开启了可带牌选项
     * @returns {number|*}
     */
    isOpenDaiPai:function(){
        cc.log("是否可带牌..." , this.isKeDaiPai);
        return this.isKeDaiPai;
    },

    getCostFangShi:function(){
        return this.costFangShi;
    },

    isPdkFangzhu:function(playerVo){
      return playerVo.ext[2] == 1;

    },

    getPlayerGroup: function(playerVo) {
        playerVo.group = playerVo.ext[0];
        return playerVo.ext[0];
    },

    getPlayerIsFirstOut: function(playerVo){
        playerVo.isFirstOut = playerVo.ext[3];
        return playerVo.ext[3];
    },

    getPlayerIsTuoguan:function(playerVo){
        return playerVo.ext[7];
    },

    //玩家的房内头像是否已经绘制完全
    isRoomIconRoad:function()
    {
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

    isWanfa3:function(){
        return this.wanfa == this.wanfa3;
    },

    isWanfa4:function(){
        return this.wanfa == this.wanfa4;
    },

    updateGPS: function (userId, gps) {
        var p = this.getPlayerVo(userId);
        p.gps = gps;
    },

    baoting: function (seat) {
        this.btMap[seat] = 1;
    },

    isNextSeatBt: function () {
        var nextSeat = this.seatSeq[this.mySeat][1];
        if (this.btMap[nextSeat])
            return true;
        return false;
    },

    isShowCardNumber: function () {
        return this.ext[0] == 1;
    },

    //是否是AA支付
    isPDKAAcostWay:function(){
        return this.ext[2] == 1;
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
        //cc.log("DTZRoomModel this.players.length" , this.players.length);
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
            if (this.is4Ren() && this.getPlayerGroup(p) <= 0) {
                continue;
            }
            var meSeat = p.seat;
            for(var j=i+1;j<allIPs.length;j++){
                if (this.is4Ren() && this.getPlayerGroup(this.players[j]) <= 0) {
                    continue;
                }
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
        //注释一下 。。。。。xiaohu 是数组 ，第0位是是否托管，第1位 是剩余时间
        if (message.xiaohu){
            var xiaohu = message.xiaohu;
            this.countDown = parseInt(xiaohu[1] / 1000);
        }
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.userId == PlayerModel.userId) {
                var ids = message.handCardIds;
                var cardIds = [];
                for (var j = 0; j < ids.length; j++) {
                    cardIds.push(DTZAI.getCardDef(ids[j]));
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
        //cc.log("dealScore ... " , value + "--->" + Math.round(value / 100) * 100);
        if(value < 0) {
            return -Math.round(-value / 100) * 100;
        }
        return  Math.round(value / 100) * 100;
    },

    /**
     * 数字转字符串
     */
    moneyToStr:function(moneyValue){
        if(moneyValue == null){
            return "--"
        }
        var moneyNum = Number(moneyValue);
        var moneyStr = moneyNum + "";
        //小于100W直接显示数字
        if(moneyNum <= 1000000){
            return moneyStr;
        }

        //百万内 保留1位
        if((10000000 > moneyNum) && (moneyNum >= 10000)) {
            //moneyStr = parseFloat(moneyNum / 10000).toFixed(2) + "万";
            moneyStr = Math.floor(parseFloat(moneyNum / 10000) * 10) / 10 + "万"
        }else if( 100000000 > moneyNum && (moneyNum >= 10000000)){ //千万以上 亿以下 保留两位
            moneyStr = Math.floor(parseFloat(moneyNum / 10000) * 100) / 100 + "万"
        }else if(moneyNum >= 100000000){
            moneyStr = Math.floor(parseFloat(moneyNum / 100000000) * 10) / 10 + "亿"
        };
        return moneyStr + "";
    },

}