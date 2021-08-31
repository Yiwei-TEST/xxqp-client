/**
 * Created by zhoufan on 2016/7/23.1
 */
var MJRoomModel = {
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
    matchKeyId: 0,//比赛场ID
    isGameSite: false,//是否比赛场
    gameSiteRound: 0,// 比赛场当前轮数
    promotionNum: 0,// 晋级人数
    integralTimes: 0,// 倍数加成
    roundNumber: 0,   // 当前轮参赛人数
    gameSiteMaxRound: 0,//比赛场最大轮数
    huCards: [],//当前可胡的列表
    csmjIsOptXiaoHu:false,//长沙麻将用来判断是否操作了小胡可出牌
    mj_xianjia_oprete:false,
    cqxzmj_gameType:0,
    cqxzmj_dingqueType:0,
    cqxzmj_huanzhangCardsType:-1,
    cxmj_pengMJ:[],
    scoreCard:[],//德宏麻将底牌

    init:function(message){
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

        this.isCredit = this.creditConfig[0];//是否是比赛房
        this.creditDivide = this.creditConfig[8];//当前是否需要除100
        this.creditScore =  this.creditConfig[3];//底分
        this.creditGiveNum =  this.creditConfig[4];//赠送分
        this.creditType = this.creditConfig[5];//赠送类型1固定2比例
        this.creditWay = this.creditConfig[6];//赠送方式1大赢家2所有赢家
        this.creditXpkf = this.creditConfig[11]/100;
        this.switchCoin = message.generalExt[1];
        this.creditAApay = Math.floor((this.creditConfig[12] || 0)/100);

        this.goldMsg  = [];// goldMsg:100,1000,1; 第1位：门票// 第2位：进房限制// 第3位：倍率
        if(message.goldMsg){
            this.goldMsg = message.goldMsg.split(",");
        }

        this.strParams = message.strParams || [];

        GoldRoomConfigModel.curClickRoomkeyId = message.goldRoomConfigId || 0;

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        // cc.log("message.ext =",JSON.stringify(message.ext));
        //cc.log("this.wanfa =",this.wanfa);
        if (this.wanfa == GameTypeEunmMJ.HZMJ || this.wanfa == GameTypeEunmMJ.ZJMJ){
            this.openTuoguan = message.ext[6];//托管
        }else if (this.wanfa == GameTypeEunmMJ.BSMJ || this.wanfa == GameTypeEunmMJ.DHMJ){
            this.openTuoguan = message.ext[12];//托管
        }else if (this.wanfa == GameTypeEunmMJ.ZZMJ){
            this.openTuoguan = message.intParams[9];//托管
        }else if(this.wanfa == GameTypeEunmMJ.CSMJ || this.wanfa == GameTypeEunmMJ.NXMJ || this.wanfa == GameTypeEunmMJ.NYMJ){
            this.openTuoguan = message.intParams[28];//托管
        }else if(this.wanfa == GameTypeEunmMJ.TDH){
            this.openTuoguan = message.intParams[8];//托管
        }else if(this.wanfa == GameTypeEunmMJ.SYMJ){
            this.openTuoguan = message.intParams[8];//托管
        }else if(this.wanfa == GameTypeEunmMJ.YZWDMJ){
            this.openTuoguan = message.intParams[11];//托管
        }else if(this.wanfa == GameTypeEunmMJ.AHMJ|| this.isYYNXMJ()){
            this.openTuoguan = message.intParams[10];//托管
        }else if(this.wanfa == GameTypeEunmMJ.TJMJ || this.wanfa == GameTypeEunmMJ.GDCSMJ || this.wanfa == GameTypeEunmMJ.TCMJ){
            this.openTuoguan = message.intParams[28];//托管
        }else if(this.isTCPFMJ() || this.isTCDPMJ()){
            this.openTuoguan = message.intParams[9];
        }else if(this.wanfa == GameTypeEunmMJ.CXMJ){
            this.openTuoguan = message.intParams[8];//托管
        }else if(this.wanfa == GameTypeEunmMJ.YJMJ){
            this.openTuoguan = message.intParams[11];//托管
        }else if(this.wanfa == GameTypeEunmMJ.KWMJ){
            this.openTuoguan = message.intParams[11];
        }else if(this.wanfa == GameTypeEunmMJ.DZMJ || this.wanfa == GameTypeEunmMJ.ZOUMJ){
            this.openTuoguan = message.intParams[13];
        }else if(this.wanfa == GameTypeEunmMJ.CQXZMJ){
            this.openTuoguan = message.intParams[8];
        }else if(this.wanfa == GameTypeEunmMJ.JZMJ){
            this.openTuoguan = message.intParams[8];
        }

        this.intParams = message.intParams;//储存创房选择的玩法

        //cc.log("==========",message.ext[12]);
        if (message.ext[12]==100000000){
            this.isGameSite = true;
        }
        //if (message.ext[3]!=-1) {
        //
        //}
        if (message.extStr){
            this.matchKeyId = message.extStr[0];
        }
        this.checkMySeat();
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
        this.scoreCard = message.scoreCard || [];
        this.ahmj_wangID = message.ext[4] || -1;//安化麻将翻出的王牌ID
        //var groupProperty = message.groupProperty.split(",");
        //for(var i=0;i<groupProperty.length;i++){
        //    var cardI = parseInt(groupProperty[i]);
        //    if(cardI)
        //        this.groupProperty.push(cardI);
        //}
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

    checkMySeat:function(){
        if(this.getPlayerVo()){
            this.mySeat = this.getPlayerVo().seat;
        }else{
            this.mySeat = 1;
        }
    },

    //风牌
    isFuPaiVo: function(vo) {
        //TODO 现在所有副牌都是黑三风，后期加入别的副牌需要从model里面拿出type来区分
        var type = this.getFuType();
        var boolean = false;
        switch (type) {
            case MJFuPaiType.FENG_SAN_YAO:
            case MJFuPaiType.FENG_SAN_JIU:
            case MJFuPaiType.FENG_SAN_ZFB:
            case MJFuPaiType.FENG_SAN_YAOJIU:
            case MJFuPaiType.FENG_SAN_YAO_ZFB:
            case MJFuPaiType.FENG_SAN_JIU_ZFB:
            case MJFuPaiType.FENG_JDF:
            case MJFuPaiType.FENG_JDK:
                boolean = (vo && vo.t==4 && vo.n<=4);
                break;
            case MJFuPaiType.ZFB_JDF:
            case MJFuPaiType.SAN_YAO_ZFB:
            case MJFuPaiType.ZFB_XJF:
                boolean = (vo.t == 4 && vo.n >= 9);
                break;
            case MJFuPaiType.SAN_JIU_ZFBJ:
                boolean = (vo.t == 4 && vo.n >= 9) || (vo.t == 1 && vo.n == 1);
                break;
            case MJFuPaiType.HZD_3938:
                boolean = ((vo.t < 4 && vo.n == 8) || (vo.t == 4 && vo.n == 9));
                break;
            case MJFuPaiType.BBD_3231:
                boolean = ((vo.t < 4 && vo.n == 2) || (vo.t == 4 && vo.n == 11));
                break;
        }
        return boolean;
    },
    //万能牌
    isFeiPaiVo: function(vo) {
        if (!this.isGSMJ() && !this.isGuCang()) {
            return false;
        }
        if (!vo) {
            return false;
        }
        var type = this.getFuType();
        var boolean = false;
        switch (type) {
            case MJFuPaiType.FENG_SAN_YAO:
                boolean = (vo.t < 4 && vo.n == 1);
                break;
            case MJFuPaiType.FENG_SAN_JIU:
                boolean = (vo.t < 4 && vo.n == 9);
                break;
            case MJFuPaiType.FENG_SAN_ZFB:
                boolean = (vo.t == 4 && vo.n >= 9);
                break;
            case MJFuPaiType.FENG_SAN_YAOJIU:
                boolean = (vo.t < 4 && (vo.n == 1 || vo.n == 9));
                break;
            case MJFuPaiType.FENG_SAN_YAO_ZFB:
                boolean = ((vo.t < 4 && vo.n == 1) || (vo.t == 4 && vo.n >= 9));
                break;
            case MJFuPaiType.FENG_SAN_JIU_ZFB:
                boolean = ((vo.t < 4 && vo.n == 9) || (vo.t == 4 && vo.n >= 9));
                break;
            case MJFuPaiType.ZFB_JDF:
                boolean = (vo.t < 3 && vo.n == 1 );
                break;
            case MJFuPaiType.SAN_YAO_ZFB:
                boolean = (vo.t < 4 && vo.n == 1);
                break;
            case MJFuPaiType.FENG_JDF:
                boolean = (vo.t < 3 && vo.n == 1);
                break;
            case MJFuPaiType.SAN_JIU_ZFBJ:
                boolean = (vo.t < 4 && vo.n == 9);
                break;
            case MJFuPaiType.FENG_JDK:
                boolean = ((vo.t < 3 && vo.n == 1) || (vo.t == 4 && vo.n == 11));
                break;
            case MJFuPaiType.HZD_3938:
                boolean = (vo.t < 4 &&  vo.n == 9);
                break;
            case MJFuPaiType.BBD_3231:
                boolean = (vo.t < 4 && vo.n == 1);
                break;
            case MJFuPaiType.ZFB_XJF:
                boolean = (vo.t == 1 && vo.n == 1 );
                break;
        }
        return boolean;
    },

    getIsSwitchCoin:function(){
        return this.switchCoin == 1
    },
    isCXMJ_pengMJ:function(_cardVo){
        var showTip = false;
        for (var i = 0; i < this.cxmj_pengMJ.length; i++) {
            var cardVo =this.cxmj_pengMJ[i];
            if (_cardVo.i == cardVo.i){
                showTip = true;
            }
        }
        return showTip;
    },

    StartPiaoFen:function(message){
        SyEventManager.dispatchEvent(SyEvent.ZZMJ_PIAOFEN,message);
    },

    FinishPiaoFen:function(message) {
        SyEventManager.dispatchEvent(SyEvent.ZZMJ_FINISH_PIAOFEN, message);
    },
    //张掖麻将
    isYaoPaiVo:function(vo){
        if(this.isJNMJ()){
            return ((vo.n == 1 || vo.n == 9 || vo.t == 4) && vo.i != this.levelCardIds);
        }else {
            return (vo.n == 1 || vo.n == 9 || vo.t == 4);
        }
    },

    isHuiPaiVo:function(vo){
        return vo.i == this.levelCardIds;
    },

    getFangFei: function() {
        return this.ext[5];
    },

    getFuType: function() {
        return this.ext[6];
    },

    getChiPengConf: function() {
        return this.ext[7];
    },

    getJiangConf: function() {
        return this.ext[8];
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

    getGangScore: function() {
        return this.ext[12];
    },

    getQGH: function() {
        return this.ext[13];
    },

    getJiangLeiConf: function() {
        return this.ext[14];
    },

    getFangzhuSeat:function(){
        return this.ext[15];
    },

    getDiFen: function() {
        return this.ext[16];
    },
    isMoneyRoom:function(){
        return this.tableType == 3;
    },

    isMatchRoom:function(){
        return this.tableType == 4;
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
        if(this.wanfa == GameTypeEunmMJ.LZMJ || this.wanfa == GameTypeEunmMJ.GCMJ){
            tingResult = this.lzTingResult;
        }
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


    //是否是比赛房
    isCreditRoom:function(){
        return this.isCredit == 1;
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
        return (this.wanfa == GameTypeEunmMJ.ZZMJ || this.wanfa == GameTypeEunmMJ.YZWDMJ|| this.wanfa == GameTypeEunmMJ.CQXZMJ|| this.wanfa == GameTypeEunmMJ.AHMJ|| this.wanfa == GameTypeEunmMJ.CXMJ
            || this.isTCPFMJ()|| this.isTCDPMJ() || this.isYYNXMJ())?(playerVo.ext[3]==1):(playerVo.ext[4]==1);
    },

    getHasChuPai: function(playerVo) {
        return (playerVo.ext[2]==1);
    },

    getHuPoint: function(playerVo) {
        var curPoint = playerVo.ext[4];
        if(this.isJNMJ()){
            curPoint = playerVo.ext[8]
        }
        return curPoint;
    },

    setHuPoint: function(playerVo, currentPoint) {
        if(this.isJNMJ()){
            playerVo.ext[8] = currentPoint;
        }else {
            playerVo.ext[4] = currentPoint;
        }
    },

    seeBaoPai: function(id) {
        this.ext[4] = id;
    },

    isCCMJ: function() {
        return (this.wanfa==5);
    },

    isGSMJ: function() {
        return (this.wanfa==101);
    },

    isLNMJ: function() {
        return (this.wanfa==102);
    },

    isKETMJ: function() {
        return (this.wanfa==103);
    },

    isHuiPai:function(){
        return (this.wanfa==104);
    },

    isGuCang: function() {
        return (this.wanfa==105);
    },

    isZYMJ: function() {
        return (this.wanfa==106);
    },

    isHSMJ: function() {
        return (this.wanfa==107);
    },

    isThreeLNMJ: function() {
        return (this.wanfa==108);
    },

    isTwoLNMJ: function() {
        return (this.wanfa==109);
    },

    isTwoKETMJ: function() {
        return (this.wanfa==110);
    },

    isGGMJ: function() {
        return (this.wanfa==111);
    },

    isEBT:function(){
        return (this.wanfa == 104 && this.getWanfaTypeByHp() == 2);
    },

    isQAMJ: function() {
        return (this.wanfa==112);
    },

    isPLMJ: function() {
        return (this.wanfa==500);
    },

    isJNMJ: function() {
        return (this.wanfa==501);
    },

    isJCHS: function() {
        return (this.wanfa==503);
    },

    isTSMJ:function(){
        return (this.wanfa==502);
    },

    isLXMJ:function(){
        return (this.wanfa==504);
    },

    isWWMJ:function(){
        return (this.wanfa==505);
    },

    isJQMJ:function(){
        return (this.wanfa==506);
    },

    isJQSB:function(){
        return (this.wanfa==507);
    },

    isJQTJ:function(){
        return (this.wanfa==508);
    },

    isJQEB:function(){
        return (this.wanfa==509);
    },

    isLZEB:function(){
        return (this.wanfa==510);
    },

    isLZFJ:function(){
        return (this.wanfa==511);
    },
    isYZWDMJ:function(){
        return (this.wanfa==193);
    },
    isAHMJ:function(){
        return (this.wanfa==4);
    },
    isTJMJ:function(){
        return (this.wanfa==260);
    },
    isTCPFMJ:function(){
        return (this.wanfa==188);
    },
    isTCDPMJ:function(){
        return (this.wanfa==187);
    },
    isYYNXMJ:function(){
        return (this.wanfa==186);
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
        this.cleanLocalBySmartFitler();
    },

    addCheckedTingData: function(allMJs, tingResult) {
        allMJs = ArrayUtil.clone(allMJs);
        this.checkedTingData.push({mjs:allMJs,tingResult:tingResult});
    },

    getCheckedTingFromCache: function(data) {
        var result = null;
        for (var i=0;i<this.checkedTingData.length;i++) {
            var checkedData = this.checkedTingData[i];
            var checked = ArrayUtil.clone(checkedData.mjs);
            var copy = ArrayUtil.clone(data);
            while (checked.length > 0) {
                var mjVo = checked.shift();
                var index = MJAI.findIndexByMJVoI(copy,mjVo.i);
                if(index < 0) {
                    break;
                } else {
                    copy.splice(index,1);
                }
            }
            if(copy.length == 0) {
                result = checkedData.tingResult;
                cc.log("isCheckedTing----------------------------------hit...");
                break;
            }
        }
        return result;
    },

    dealCard:function(message){
        cc.log("dealCard meesage =",JSON.stringify(message));
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

    //IP相同提示信息
    showTipsIpSame:function(){
        PopupManager.addPopup(new AlertIPPop(this.ipSameTipStr,function() {
            sySocket.sendComReqMsg(21);
        }));
        //this.ipSameTipStr = "发现相同IP玩家，是否解散房间？\n"+this.ipSameTipStr;
//    	AlertPopRichText.show("res/alertPop.json","发现相同IP玩家，是否解散房间？",this.ipSameTipStr,function(){
//    		sySocket.sendComReqMsg(21);
//    	},function(){
////    		sySocket.sendComReqMsg(4);
//    	},false,true);
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

            this.checkMySeat();

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
        //if ((message.action == MJAction.HU || message.action == MJAction.CHU_PAI)
        //    && (this.isTing(message.seat) || this.isHued(message.seat))) {
        //    setTimeout(function(){
        //        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
        //    },500);
        //} else {
            SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
        //}
    },

    chuMahjong:function(id,endPos){
        if(MJRoomModel.isKETMJ() || MJRoomModel.isTwoKETMJ()){
            var huIList = this.checkTingByPutOut(id);
            this.sendPlayCardMsg(0, id, huIList);
        }else {
            if (MJRoomModel.isGSMJ() || MJRoomModel.isGuCang()) {
                this.sendPlayCardMsg(0, [id]);
            } else {
                this.sendPlayCardMsg(0, id, []);
            }
        }
        var simulate = true;
        if(this.wanfa == GameTypeEunmMJ.TCPFMJ){
            if (this.ahmj_wangID == 201 ){
                if(id>200 && id<205)
                    simulate = false;
            }else{
                if(id>204 && id<209)
                    simulate = false;
            }
            if(this.intParams[4] == 1)
                simulate = false;
        }
        if(this.isTCDPMJ()){
            if(this.intParams[4] == 1)
                simulate = false;
            if(this.intParams[16] == 1){
                if(id>204 && id<209)
                    simulate = false;
            }
        }
        if(simulate)
            this.simulateLetOutCard(id,endPos);
    },


    checkTingByPutOut:function(id){
        var handCards = this.mineLayout.getPlace1Data();
        var allMJs = ArrayUtil.clone(handCards);
        var index = MJAI.findIndexByMJVoC(allMJs,id);
        if(index>=0){
            allMJs.splice(index,1);
        }
        var huBean = new KETMajiangHuBean();
        var smart = new KETMajiangSmartFilter();
        var list = smart.isHu(allMJs,huBean);
        var huIList = [];
        for(var i=0;i<list.length;i++){
            huIList.push(list[i].i);
        }
        return huIList;
    },

    checkTingZYMJByPutOut:function(id){
        var handCards = this.mineLayout.getPlace1Data();
        var allMJs = ArrayUtil.clone(handCards);
        var index = MJAI.findIndexByMJVoC(allMJs,id);
        if(index>=0){
            allMJs.splice(index,1);
        }
        var huBean = new ZYMajiangHuBean();
        var smart = new ZYMajiangSmartFilter();
        var list = smart.isHu(allMJs,huBean);
        var huIList = [];
        for(var i=0;i<list.length;i++){
            huIList.push(list[i].i);
        }
        return huIList;
    },

    sendBJPlayCardMsg: function (type, cardIds,huCardIds) {
        var build = MsgHandler.getBuilder("proto/BJPlayCardReq.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var BJPlayCardReq = builder.build("BJPlayCardReq");
        var msg = new BJPlayCardReq();
        msg.cardIds = cardIds;
        msg.cardType = type;
        msg.huCardIds = huCardIds || [];
        sySocket.send(msg, msgType);
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

    cleanLocalBySmartFitler: function() {
        this.setLocalBySmartFitler(null);
    },

    setLocalBySmartFitler: function(result) {
        var obj = {};
        obj.id = this.tableId;
        obj.jushu = this.nowBurCount;
        obj.smart = result;
        //cc.log("1111111111111119999999999999",JSON.stringify(obj));
        cc.sys.localStorage.setItem("sy_smart_fitler",JSON.stringify(obj));
    },

    isNeedSmartFitler: function() {
        var isNeed = true;
        var val = cc.sys.localStorage.getItem("sy_smart_fitler");
        if (val) {
            val = JSON.parse(val);
            if (val.id == this.tableId && val.jushu == this.nowBurCount
                && val.smart != null && val.smart.length > 0) {
                isNeed = false;
            }
        }
        return isNeed;
    },

    /**
     * 客户端模拟出牌
     * @param id
     */
    simulateLetOutCard:function(id,endPos){
        var message = {"userId":PlayerModel.userId,"majiangIds":[id],"action":0,
            "seat":this.mySeat,"selfAct":[],"fromSeat":null,"zimo":null,"huArray":[],"xiaohu":[],simulate:1,endPos:endPos};
        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
    },

    baiMahjong:function(cardVo){
        SyEventManager.dispatchEvent(SyEvent.BAI_JIAO_CARD,cardVo);
    },

    cancelBaiMahjong:function(id){
        SyEventManager.dispatchEvent(SyEvent.CANCEL_BAI_JIAO_CARD,id);
    },

    moPai:function(message){
        if (message.selfAct.length == 6 && message.majiangIds.length==0 && message.seat == MJRoomModel.mySeat) {
            //防止闪退
            FloatLabelUtil.comText("摸牌消息发送过来的ids长度为0!!!");
        } else {
            SyEventManager.dispatchEvent(SyEvent.GET_MAJIANG,message);
        }
    },

    buHuaMoPai:function(message){
        if (message.majiangId.length==0 && message.seat == MJRoomModel.mySeat) {
            //防止闪退
            FloatLabelUtil.comText("补花摸牌消息发送过来的ids长度为0!!!");
        } else {
            SyEventManager.dispatchEvent(SyEvent.GET_MAJIANG_BY_BUHUA,message);
        }
    },

    getName:function(wanfa){
        var name = "转转麻将";
        if(wanfa==2)
            name = "长沙麻将";
        if(wanfa==3)
            name = "红中麻将";
        if(wanfa==5)
            name = "长春麻将";
        return name;
    },

    isDaiQueMeng:function(){
         return (this.ext[8]==1);
    },

    isPiaoHu7DuiNoSe9:function(){
        return (this.ext[9]==1);
    },

    getBaijiaoGuize:function(){
        return this.ext[4];
    },

    getDiFenByZZ:function(){
        return this.ext[4];
    },

    getTuoguanByZZ:function(){
        return this.ext[6];
    },
    getTuoguanByHP:function(){
        return this.ext[16];
    },

    getFangFeiName: function(val) {
        var def = ["AA支付","房主支付","群主支付"];
        return def[val-1];
    },

    getZuiZiName: function(val) {
        var def = ["黑三风三幺飞","黑三风三九飞","黑三风中发白","黑三风幺九飞","黑三风三幺中发白","黑三风三九中发白",
            "中发白鸡蛋飞","中发白三幺飞","黑三风鸡蛋飞","三九中发白鸡","黑三风鸡蛋壳","3938红中带","3231白板带","中发白小鸡飞"];
        return def[val-1];
    },

    getChiPengName: function(val) {
        var def = ["软门清x2","硬门清x2","无番","硬门清"];
        return def[val-1];
    },

    getJiangName: function(val) {
        var def = ["无将制","一四七","二五八","三六九"];
        return def[val-1];
    },

    getJiangLeiName: function(val) {
        var def = ["硬将258","软将258","软将(无番)","硬将369","软将369","硬将147","软将147"];
        return def[val-1];
    },

    getTingHuName: function(val) {
        var def = ["悄悄胡","听胡必须报听"];
        return def[val-1];
    },

    getJTTingHuName: function(val) {
        var def = ["悄悄胡","报听胡"];
        return def[val-1];
    },

    getJiFenName: function(val,wanfa) {
        var def = ["加法","乘法"];
        var wanfa = wanfa || this.wanfa;
        if(wanfa == 105){
            def = ["加法","默认","现实"];
        }
        return def[val-1];
    },

    getLzJifenName:function(val){
        var def = ["加法","乘法"];
        return def[val-1];
    },

    getGCJiFenName: function(val) {
        var def = ["加法","默认","现实"];
        return def[val-1];
    },

    getHuCountName: function(val) {
        var def = ["挖到底","挖一次","挖两次","挖三次"];
        return def[val];
    },

    getGCKeXuanName:function(index){
        var def = "";
        if(index == 1){
            def = "杠加番";
        }
        return def;
    },

    getKeXuanName: function(index) {
        var def = ["杠加番","抢杠胡"];
        var str = "";
        if (index == 1 && this.getGangScore() == 1) {
            str = def[index-1];
        }
        if (index == 2 && this.getQGH() == 1) {
            str = def[index-1];
        }
        return str;
    },

    getGJFName:function(val){
        var name = "";
        if(val == 1){
            name = "杠加番";
        }
        return name;
    },

    getBaiJiaoGuiZeName : function(temp){
        var def = ["一摆一","二摆一","三摆一"];
        return def[temp -1];
    },

    getTuoGuanByLN:function(){
        return this.ext[6];
    },

    getTuoGuanNameByLN:function(val){
        var name = (val==1) ? " 托管":"";
        return name;
    },

    //玩家是否开了托管
    isTuoGuanByLNMJ:function(playerVo){
        return playerVo.ext[4]==1;
    },

    getPaoJianTou: function(paoSeq) {
        var seq = this.seatSeq[1];
        var index = ArrayUtil.indexOf(seq, paoSeq);
        if(this.renshu == 3 && paoSeq == 3){
            index = 3;
        }
        if(this.renshu == 2 && paoSeq == 2){
            index = 2;
        }
        var tex = "jt_";
        switch (index) {
            case 0:
                tex += "bottom";
                break;
            case 1:
                tex += "next";
                break;
            case 2:
                tex += "up";
                break;
            case 3:
                tex += "last";
                break;
        }
        tex += ".png";
        return tex;
    },

    isLunZhuang : function() {
        return this.ext[6]==1;
    },

    isDaiFeng:function(){
        return this.ext[7]==1;
    },

    //脱光挖
    isTuoGuangWa:function(){
        return this.ext[8]==1;
    },

    //三会必挖
    isSanHuiBiWa : function() {
        return this.ext[9]==1;
    },

    //三会必挖加番
    isJiaFan:function(){
        return this.ext[10];
    },

    //金昌麻将玩法类型
    getWanfaTypeByHp:function(){
        return this.ext[12];
    },

    //七对加番
    getZiMoHu:function(){
        return this.ext[13];
    },

    //庄加番
    getZhuangJiaFan:function(){
        return this.ext[14];
    },

    //七对加番
    getQiDuiJiaFan:function(){
        return this.ext[15];
    },


    getWanfaNameByHp:function(val){
        var name = ["会牌","二报听"];
        return name[val-1];
    },

    getZiMoHuName:function(val){
        var name = val == 1 ? "自摸胡 ":"";
        return name;
    },

    getZhuangJiaFanName:function(val){
        var name = val == 1 ? "庄加番 ":"";
        return name;
    },

    getQiDuiJiaFanName:function(val){
        var name =  val == 1 ? "七对加番 ":"";
        return name;
    },

    getTuoGuangWaName:function(val){
        var name = val? " 脱光挖" : "";
        return name;
    },

    getDaiFengName:function(val){
        var name = val? " 带风" : "";
        return name;
    },

    getSanHuiBiWaName:function(val,isJiaFan){
        var name = "";
        if(val) {
            if (isJiaFan == 1) {
                name = " 三会必挖(加番)";
            } else {
                name = " 三会必挖(不加番)";
            }
        }
        return name;
    },

    getJiaFanName:function(val){
        var name = val? " 加番" : " 不加番";
        return name;
    },

    getLunZhuangName:function(val){
        var name = val? " 轮庄" : "";
        return name;
    },

    //张掖麻将是否带抛
    isDaiPao: function () {
        return this.ext[4]==1;
    },

    //一点一炸 推倒胡
    getZYWanfa:function(){
        return this.ext[5];
    },

    isYDYZ:function(){
        return this.ext[5]==1;
    },

    isDaiFengByZy:function(){
        return this.ext[6];
    },


    getDaiPaoName:function(val){
        var name = val == 1? "可抛":"不可抛";
        return name;
    },

    getDaiFengNameByZy:function(val){
        var name = val == 1? "带风" : "不带风";
        return name;
    },

    getZYWanfaName:function(val){
        var name = ["一点一炸","推倒胡","炸翻天"];
        return name[val-1];
    },

    getDiFenNameByZZ:function(val){
        var name  = ["1、2、4分","2、3、5分","5、10、15分","3、5、10分"];
        return name[val-1];
    },

    getAllGuiZeName:function(){
        var name = this.getLunZhuangName(this.isLunZhuang())+ this.getDaiFengName(this.isDaiFeng())+this.getTuoGuangWaName(this.isTuoGuangWa())+
            this.getSanHuiBiWaName(this.isSanHuiBiWa(),this.isJiaFan());
        return name;
    },

    setBaoting:function(){
        this.baoting = 0;
    },


    decideZhuang:function(seat,paofen){
        var self = this;
        var obj = {};
        obj.seat = seat;
        obj.paofen = paofen;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.seat==seat){
                SyEventManager.dispatchEvent(SyEvent.DOUNIU_DECIDE_ZHUANG,obj);
                break;
            }
        }
    },

    needSmartFitlerMayHuPai:function(){
        return (this.isGSMJ() || this.isGuCang());
    },

    StartMaiDian:function(message){
        //cc.log("StartMaiDian::"+JSON.stringify(message));
        SyEventManager.dispatchEvent(SyEvent.BSMJ_MAI_DIAN,message);
    },
    finishMaidian:function(message) {
        SyEventManager.dispatchEvent(SyEvent.BSMJ_MAI_DIAN_FINISH,message);
    },
    getWanfaName:function(wanfa){
        var name = "";
        var wanfa = wanfa || this.wanfa;
        switch (wanfa){
            case GameTypeEunmMJ.GCMJ:
                name = "谷仓麻将 ";
                break;
            case GameTypeEunmMJ.LZMJ:
                name = "兰州麻将 ";
                break;
            case GameTypeEunmMJ.LNMJ:
            case GameTypeEunmMJ.THREE_LNMJ:
            case GameTypeEunmMJ.TWO_LNMJ:
                name = "陇南摆叫 ";
                break;
            case GameTypeEunmMJ.HPMJ:
                name = "金昌麻将 ";
                break;
            case GameTypeEunmMJ.KETMJ:
            case GameTypeEunmMJ.TWO_KETMJ:
                name = "卡二条 ";
                break;
            case GameTypeEunmMJ.MXGG:
                name = "咣咣麻将 ";
                break;
            case GameTypeEunmMJ.ZYMJ:
                name = "张掖麻将 ";
                break;
            case GameTypeEunmMJ.QAMJ:
                name = "秦安麻将 ";
                break;
            case GameTypeEunmMJ.HSMJ:
                name = "滑水麻将 ";
                break;
            case GameTypeEunmMJ.PLMJ:
                name = "平凉划水 ";
                break;
            case GameTypeEunmMJ.JNMJ:
                name = "静宁打经 ";
                break;
            case GameTypeEunmMJ.TSMJ:
                name = "二报麻将 ";
                break;
            case GameTypeEunmMJ.JCHS:
                name = "金昌滑水 ";
                break;
            case GameTypeEunmMJ.LXMJ:
                name = "陇西麻将 ";
                break;
            case GameTypeEunmMJ.WWMJ:
                name = "武威麻将 ";
                break;
            case GameTypeEunmMJ.JQMJ:
                name = "嘉峪关悄悄胡 ";
                break;
            case GameTypeEunmMJ.JQSB:
                name = "酒泉三报 ";
                break;
            case GameTypeEunmMJ.JQTJ:
                name = "酒泉挑经 ";
                break;
            case GameTypeEunmMJ.JQEB:
                name = "酒泉二报 ";
                break;
            case GameTypeEunmMJ.LZEB:
                name = "兰州二报 ";
                break;
            case GameTypeEunmMJ.LZFJ:
                name = "兰州翻金 ";
                break;
            case GameTypeEunmMJ.SYMJ:
                name = "邵阳麻将 ";
                break;
            case GameTypeEunmMJ.TJMJ:
                name = "桃江麻将 ";
                break;
        }
        return name;
    },


    getBaotingByHS:function(){
        return this.ext[6];
    },

    isLaiziWanfa :function(){
        return this.ext[7];
    },

    getDaiFengByHS:function(){
        return this.ext[8];
    },
    //荒庄加倍
    getHZJFByHS:function(){
        return this.ext[9];
    },

    //庆阳滑水
    getYuZi:function(){
        return this.ext[12];
    },

    getDiFenByHS:function(){
        return this.ext[13];
    },

    getGangJiaFenByHS:function(){
        return this.ext[14];
    },

    getBaotingNameByHS:function(temp){
        var name = temp==1? "报听胡 ":"悄悄胡 ";
        return name;
    },

    getLaiziWanfaName:function(temp) {
        var name = temp == 1? "癞子玩法 ":"";
        return name;
    },

    getDaiFengNameByHS:function(temp){
        var name = temp == 1? "带风 ":"";
        return name;
    },

    getHZJFNameByHS:function(temp){
        var name = temp == 1? "荒庄加倍 ":"";
        return name;
    },

    getDiFenNameByHS:function(temp){
        var name = "底分x" +temp;
        return name;
    },

    getGJFNameByHS:function(temp){
        var name = temp == 1? "杠加分 ":"";
        return name;
    },

    getDifenByGG:function(){
        return this.ext[3];
    },

    getDifenNameByGG:function(val){
        var name = ["1、2、4分 ","5、10分 ","干5分 "];
        return name[val-1];
    },

    getZiMoHuByPL:function(){
        return this.ext[5];
    },

    getDaiFengByPL:function(){
        return this.ext[7];
    },

    getZhangjingByPL:function(){
        return this.ext[13];
    },

    getChiByPL:function(){
        return this.ext[14];
    },

    getDaiJingChiByPL:function(){
        return this.ext[15];
    },

    getDaiJingPengByPL:function(){
        return this.ext[16];
    },

    getXiPaiByPL:function(){
        return this.ext[17];
    },

    getZiMoHuNameByPL:function(val){
        var name = val == 1 ? "自摸胡 ":"";
        return name;
    },

    getDaiFengNameByPL:function(val){
        var name = val == 1 ?"带风 ":"不带风 ";
        return name;
    },

    getZhangjingNameByPL:function(val){
        var name = val == 1 ? "涨经 ":"";
        return name;
    },

    getChiNameByPL:function(val){
        var name = val == 1 ? "可吃 ":"不吃 ";
        return name;
    },

    getDaiJingChiNameByPL:function(val){
        var name = val == 1 ?"带经吃 ":"";
        return name;
    },

    getDaiJingPengNameByPL:function(val){
        var name = val == 1 ? "带经碰 ":"";
        return name;
    },

    getXiPaiNameByPL:function(val){
        var name = val == 1 ? "洗牌 ":"";
        return name;
    },

    getDaiFengByJCHS:function(){
        return this.ext[7];
    },

    getHuTypeByJCHS:function(){
        return this.ext[8];
    },

    getGangByJCHS:function(){
        return this.ext[9];
    },

    getTingByJCHS:function(){
        return this.ext[10];
    },

    getDifenByJCHS:function(){
        return this.ext[5];
    },

    getDaiFengNameByJCHS:function(val){
        var name = val == 1 ? "带风 ":"不带风 ";
        return name;
    },

    getHuTypeNameByJCHS:function(val){
        var name = ["单抠 ","双抠包无限 "];
        return name[val-1];
    },

    getGangNameByJCHS:function(val){
        var name = ["短杠 ","长杠 "]
        return name[val-1];
    },

    getTingNameByJCHS:function(val){
        var name = ["两下 ","两下半 ","三下 "];
        return name[val-1];
    },

    getDifenNameByJCHS:function(val){
        var name = "底分x"+val;
        return name;
    },

    getDaiFengByTS:function(){
        return this.ext[6];
    },

    getQiDuiJiaFanByTS:function(){
        return this.ext[8];
    },

    getQingYiSeByTS:function(){
        return this.ext[9];
    },

    getBaoByTS:function(){
        return this.ext[10];
    },


    getDaiFengNameByTS:function(val){
        var name = val == 1 ? "带风 ":"不带风 ";
        return name;
    },

    getQDJFNameByTS:function(val){
        var name = val == 1 ?"七对加番 ":"";
        return name;
    },

    getQYSJFNameByTS:function(val){
        var name = val == 1 ? "清一色加番 ":"";
        return name;
    },

    getBaoNameByTS:function(val){
        var name = val == 1 ? "硬包 ":"软包 ";
        return name;
    },

    getDifenByLX:function(){
        return this.ext[5];
    },

    getDifenNameByLX:function(val){
        var name = "";
        if(val == 1){
            name = "1、2、4分 ";
        }else if(val == 2){
            name = "2、4、8分 ";
        }else if(val == 5){
            name = "5、10、20分 ";
        }
        return name;
    },

    getWanfaByLX:function(){
        return this.ext[9];
    },

    getWanfaNameByLX:function(val){
        var name = ["二报 ","一挖倒 ","两挖倒 ","挖到底 "];
        return name[val-1];
    },

    getTuoGuanByLX:function(){
        return this.ext[8];
    },

    getTuoGuanNameByLX:function(val){
        var name = (val==1) ? " 托管":"";
        return name;
    },

    //玩家是否开了托管
    isTuoGuan:function(playerVo){
        return playerVo.ext[3]==1;
    },


    //玩家是否开了托管
    isTuoGuanByZZ:function(playerVo){
        return playerVo.ext[5]==1;
    },

    //会牌玩家是否开了托管
    isTuoGuanByHP:function(playerVo){
        return playerVo.ext[3]==1;
    },

    getDaiPiaoByWW:function(){
        return this.ext[7];
    },

    getDaiFengByWW:function(){
        return this.ext[8];
    },

    getZBYByWW:function(){
        return this.ext[9];
    },

    getSYByWW:function(){
        return this.ext[10];
    },

    getZaGuoByWW:function(){
        return this.ext[11];
    },

    getMoshiByWW:function(){
        return this.ext[12];
    },

    getGSHByWW:function(){
        return this.ext[13];
    },

    getBKPHByWW:function(){
        return this.ext[14];
    },

    getQGHByWW:function(){
        return this.ext[15];
    },

    getQXDByWW:function(){
        return this.ext[16];
    },

    getSSYByWW:function(){
        return this.ext[17];
    },

    getDiFenByWW:function(){
        return this.ext[18];
    },

    getDaiFengNameByWW:function(val){
        var name = val == 1 ? "":"不带风 ";
        return name;
    },

    getDaiPiaoNameByWW:function(val){
        var name = val == 1 ?"带飘 ":"";
        return name;
    },

    getZBYNameByWW:function(val){
        var name = val == 1 ? "庄绑一 ":"";
        return name;
    },

    getSYNameByWW:function(val){
        var name = val == 1 ? "甩幺 ":"";
        return name;
    },

    getMoshiNameByWW:function(val){
        var name = ["胡牌即结束 ","自摸到底 ","自摸两次 "];
        return name[val-1];
    },

    getGSHNameByWW:function(val){
        var name = val == 1 ?"杠上花 ":"";
        return name;
    },

    getBKPHNameByWW:function(val){
        var name = val == 1 ? "不可平胡 ":"";
        return name;
    },

    getQGHNameByWW:function(val){
        var name = val == 1 ? "抢杠胡 ":"";
        return name;
    },

    getQXDNameByWW:function(val){
        var name = val == 1 ? "七小对 ":"";
        return name;
    },

    getSSYNameByWW:function(val){
        var name = val == 1 ? "十三幺 ":"";
        return name;
    },

    getDiFenNameByWW:function(val){
        var name = "底分x"+val;
        return name;
    },

    getZaGuoNameByWW:function(val){
        var name = "";
        if(val == 0){
            name = "不砸锅 ";
        }else if(val == 20){
            name = "砸20分 ";
        }else if(val == 30){
            name = "砸30分 ";
        }
        return name;
    },

    isDaiFengByJQ:function(){
        return (!this.isJQMJ() || (this.isJQMJ() && this.getDaifengByJQ()));
    },

    getDaifengByJQ:function(){
        return this.ext[6];
    },

    getShuaiYaoByJQ:function(){
        return this.ext[8];
    },

    getQDJFByJQ:function(){
        return this.ext[9];
    },

    getQYSJFByJQ:function(){
        return this.ext[10];
    },

    getBaoByJQ:function(){
        return this.ext[11];
    },

    getDaiFengNameByJQ:function(val){
        var name = val == 1 ?"带风 ":"不带风 ";
        return name;
    },

    getShuaiYaoNameByJQ:function(val){
        var name = val == 1 ? "甩幺 ":"";
        return name;
    },

    getQDJFNameByJQ:function(val){
        var name = val == 1 ? "七对加番 ":"";
        return name;
    },

    getQYSJFNameByJQ:function(val){
        var name = val == 1 ? "清一色加番 ":"";
        return name;
    },

    getBaoNameByJQ:function(val){
        var name = val == 1 ? "硬包 ":"软包 ";
        return name;
    },

    getDifenByLZEB:function(){
        return this.ext[5];
    },

    getJiaHuaByLZEB:function(){
        return this.ext[7];
    },

    getMoshiByLZEB:function(){
        return this.ext[8];
    },

    getGJFByLZEB:function(){
        return this.ext[9];
    },

    getMQByLZEB:function(){
        return this.ext[10];
    },

    getJiangByLZEB:function(){
        return this.ext[11];
    },

    getGKJFByLZEB:function(){
        return this.ext[12];
    },

    getQGHByLZEB:function(){
        return this.ext[13];
    },

    getBKJPByLZEB:function(){
        return this.ext[14];
    },

    getJHDGKByLZEB:function(){
        return this.ext[15];
    },

    getTuoguanByLZEB:function(){
        return this.ext[16];
    },

    getDifenNameByLZEB:function(val){
        var name = "底分x"+val + " ";
        return name;
    },

    getJiaHuaNameByLZEB:function(val){
        var name = val==1 ? "加花 ": "";
        return name;
    },

    getMoshiNameByLZEB:function(val){
        var name = ["推倒胡 ","挖到底 ","自摸一下 ","自摸两下 "];
        return name[val-1];
    },

    getGJFNameByLZEB:function(val){
        var name = val==1? "杠加分 ": "";
        return name;
    },

    getMQNameByLZEB:function(val){
        var name = ["硬门清 ","硬门清加番 ","软门清 ","软门清加番 "];
        return name[val-1];
    },

    getJiangNameByLZEB:function(val){
        if(val == 0){
            return "乱将 ";
        }
        var name = ["乱将 ","147将 ","258将 ","369将 "];
        return name[val-1];
    },

    getGKJFNameByLZEB:function(val){
        var name = val==1 ? "杠开加番 ": "";
        return name;
    },

    getQGHNameByLZEB:function(val){
        var name = val==1 ? "抢杠胡 ": "";
        return name;
    },

    getBKJPNameByLZEB:function(val){
        var name = val==1? "不可点炮 " : "";
        return name;
    },

    getJHDGKNameByLZEB:function(val){
        var name = val==1? "加花带杠开 " : "";
        return name;
    },

    getTGNameByLZEB:function(val){
        var name = val==1? "托管 " : "";
        return name;
    },

    //秦安麻将
    getHuaSeTypeByQA:function(){
        return this.ext[6];
    },

    getLZKTypeByQA:function(){
        return this.ext[7];
    },

    getFengTypeByQA:function(){
        return this.ext[8];
    },

    getZhangShuByQA:function(){
        return this.ext[9];
    },

    getJiangTypeByQA:function(){
        return this.ext[10];
    },

    getTingTypeByQA:function(){
        return this.ext[11];
    },

    getDanDiaoByQA:function(){
        return this.ext[12];
    },

    getYingZhongWuByQA:function(){
        return this.ext[13];
    },

    getLiangDuanByQA:function(){
        return this.ext[14];
    },

    getDifenByQA:function(){
        return this.ext[15];
    },

    getHuaSeNameByQA:function(temp){
        var name = ["","花三副 ","花四副 ","清混 ","清缺 ","硬混 "];
        return name[temp-1];
    },

    getFengNameByQA:function(temp){
        var name = ["不要风 ","要风 ","三风 ","六风 "];
        return name[temp-1];
    },

    getZhangShuNameByQA:function(temp){
        var name = ["","八长 ","硬八页 ","九长 ","硬九页 ","三五六页 ","二五七页 ","十一页长 ","硬十一页 "];
        return name[temp-1];
    },

    getJiangNameByQA:function(temp){
        var name = ["","258将 ","四副将 "];
        return name[temp-1];
    },

    getTingNameByQA:function(temp){
        var name = ["悄悄胡 ","不吃 ","砍报 ","二报 "];
        return name[temp-1];
    },

    getDanDiaoNameByQA:function(temp){
        var name = temp>0? "":"不单吊 ";
        return name;
    },

    getLDNameByQA:function(temp){
        var name = temp>0? "亮断 ":"";
        return name;
    },

    getYHWNameByQA:function(temp){
        var name = temp>0? "硬中五 ":"";
        return name;
    },

    getDiFenNameByQA:function(val){
        var name = ["1、2、3分 ","2、3、5分 "];
        return name[val-1];
    },

    isQiaoQiaoHu:function(){
        return (this.getTingTypeByQA() == 1 || this.getTingTypeByQA() == 2);
    },

    /**
     * 三风  硬九叶 三五六叶 二五七页 硬十一页 （四副将） 花三副 花四副 硬中五 亮断  这些情况不能胡小七对
     * @return
     */
    isXiaoQiDuiByQA:function() {
        var fengType = this.getFengTypeByQA();
        var zhangShuType = this.getZhangShuByQA();
        var huaSeType = this.getHuaSeTypeByQA();
        var jiangType = this.getJiangTypeByQA();
        var yingZhongWu = this.getYingZhongWuByQA();
        var liangDuan = this.getLiangDuanByQA();
        var dandiao = this.getDanDiaoByQA();
        if (fengType == QAConstants.FENG_SANFENG || zhangShuType == QAConstants.ZS_YINGJIUYE ||
            zhangShuType == QAConstants.ZS_SANWULIUYE || zhangShuType == QAConstants.ZS_ERWUQIYE ||
            zhangShuType == QAConstants.ZS_YINGSHIYIYE || huaSeType == QAConstants.HUASE_HUASANFU ||
            huaSeType == QAConstants.HUASE_HUASIFU || jiangType == QAConstants.JIANG_SIFUJIANG ||
            yingZhongWu == 1 || liangDuan == 1 || dandiao == 0) {
            return false;
        } else {
            return true;
        }
    },

    getMatchInfos:function(playerVo){
        //ext[9]：0为预赛，大于0为复赛第几轮

        if(this.ext[13] <= 0){
            var name = "预赛 第"+playerVo.ext[12]+"局  "+"低于"+this.ext[14]+"分淘汰";
        }else{
            var name = "复赛 第"+this.ext[13]+"轮 第"+this.nowBurCount+"局";
        }
        return name;
    },


    /** 邵阳麻将添加 ***/
    //获取是否是选择了带风
    getIsWind:function(){
        var isShow = false;
        if (this.intParams && this.intParams[3]){
            isShow = true;
        }
        return isShow;
    },

    //获取是否是加锤状态
    getIsJiaChuiState:function(){
        return (this.ext[5] || 0);
    },


    //获取是否是选择了加锤
    getIsJiaChui:function(){
        var isShow = false;
        if (this.intParams && this.intParams[6]){
            isShow = true;
        }
        return isShow;
    },

    getSYMJResultName: function() {
        var def = [{mark:"0",name:"门清"},{mark:"1",name:"清一色"},{mark:"2",name:"七小对"},{mark:"3",name:"大对碰"},
            {mark:"4",name:"龙七对"},{mark:"5",name:"风一色"},{mark:"6",name:"十三幺"},{mark:"100",name:"平胡"},
            {mark:"101",name:"抢杠胡"},{mark:"102",name:"自摸胡"},{mark:"103",name:"杠开胡"},{mark:"202",name:"杠上炮"}];
        return def;
    },

    newSubString:function (strName,maxLength){
        var count = 0;
        var str = "";
        for(var i = 0;i < strName.length;i++){
            var temp = strName.substring(i,i + 1);
            var isBool = temp.charCodeAt(0) > 255;
            if(isBool){
                count += 2;
            }else{
                count += 1;
            }
            if(count >= maxLength){
                if(!isBool){
                    str = str.substring(0,str.length - 1);
                }
                str += "..";
                break;
            }
            str += temp;
        }
        return str;
    },
}
