/**
 * Created by zhoufan on 2016/11/7.
 */
var PHZRoomModel = {
    seatSeq:{
        1:[1,2,3],
        2:[2,3,1],
        3:[3,1,2]
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
    selfAct:[],
    banker:0,
    ext:[],
    mineRoot:null,
    currentAction:0,
    _playersIp:[],
    ipSameTipStr:null,
    isStart:false,
    renshu:0,
    lastMineSortedJson:null,
    timeSeat:0,
    fengding:0,
    choice:0,
    masterId:0,//创建或者代开房间的玩家id
    tableType : 0,//0普通 1军团 2练习
    sortCardWay : 0,//0默认1是按胡息，手牌排序方式
    wanfaHhd:0,//红黑点
    wanfaKlz:0,//可连庄
    costWay:1,//支付方式
    myOutHuxi:0,//当前自己的外面的胡息
    allHuxi:0,//当前自己的外面的总胡息
    touchCardId:0,//当前选择的牌Id
    bankerSeat:-1,//庄的方位
    sxSeat:-1,//数醒的方位
    isChiBianDaBian:false,
    chibianParams:[],
    outCardsX:200,//滑动出牌的X坐标
    outCardsY:121,//滑动出牌的Y坐标
    isSelfOutCard:false,//是否是自己出牌
    goldMsg:[],
    // chibianParamsForFangZhao:[],
    init:function(message){
        PHZSetModel.init();
        this.bankerSeat = -1;
        this.sxSeat = -1;
        this.myOutHuxi = 0;
        this.allHuxi = 0;
        this.touchCardId = 0;
        this.wanfa = message.wanfa;
        this.tableId = message.tableId;
        this.nowBurCount = message.nowBurCount;
        this.totalBurCount = message.totalBurCount || 0;
        this.players = message.players;
        this.nextSeat = message.nextSeat;

        this.checkMySeat();

        this.intParams = message.intParams;//储存创房选择的玩法
        this.goldMsg  = message.goldMsg ? message.goldMsg.split(",") : [0,0,0];// goldMsg:100,1000,1; 第1位：门票// 第2位：进房限制// 第3位：倍率
        GoldRoomConfigModel.curClickRoomkeyId =  message.goldRoomConfigId || 0;
        this.strParams = message.strParams || [];

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        //this.mySeat = this.getPlayerVo().seat;
        this.remain = message.remain;
        this.masterId = message.masterId;
        this.ext = message.ext;
        this.isStart = false;
        this.renshu = message.renshu || 3;
        this.lastMineSortedJson = null;
        this.timeSeat = this.ext[0] || 0;
        this.fengding = this.ext[1] || 0;
        this.limitScore = this.ext[2] || 0;
        this.wanfaHhd = this.ext[3] || 0;
        this.wanfaKlz = this.ext[4] || 0;
        this.costWay = this.ext[1] || 1;
        this.choice = message.config || 0;
        // cc.log("message =",message);
        this.roomName = message.roomName;
        this.tableType = message.tableType;
        this.timeOut = message.timeOut;//托管配置时间
        if(this.renshu==3){
            this.seatSeq={1:[1,2,3],2:[2,3,1],3:[3,1,2]};
        }else if(this.renshu==2){
            this.seatSeq = {1:[1,2],2:[2,1]};
        }else{
            this.seatSeq = {1:[1,2,3,4],2:[2,3,4,1],3:[3,4,1,2],4:[4,1,2,3]};
        }
        this.creditConfig = message.creditConfig || [];
        this.isCredit = this.creditConfig[0];//是否是比赛房
        this.creditDivide = this.creditConfig[8];//当前是否需要除100
        this.creditScore =  this.creditConfig[3];//底分
        this.creditGiveNum =  this.creditConfig[4];//赠送分
        this.creditType = this.creditConfig[5];//赠送类型1固定2比例
        this.creditWay = this.creditConfig[6];//赠送方式1大赢家2所有赢家
        this.creditXpkf = this.creditConfig[11]/100;
        this.switchCoin = message.generalExt[1];//是否打开金币模式 0：关闭，1：打开
        this.creditAApay = Math.floor((this.creditConfig[12] || 0)/100);

        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            p.isRoladIcon = 0;
            if(p.userId == PlayerModel.userId){
                if(p.handCardIds.length>0 || p.outedIds.length>0|| p.moldCards.length>0){
                    this.isStart = true;
                }
                if(p.ext[3]==PHZRoomModel.mySeat)
                    this.isStart = true;
                break;
            }
        }

        this.currentlyChiData = [];
        this.hasGuoedByChiData = [];

        //cc.log("this.isStart============",this.isStart)
        this.cleanData();
    },

    setGmData: function (message) {
        this.GmDataArr = [];
        this.GmChoiceCard = null;
        for (let index = 0; index < message.params.length; index++) {
            this.GmDataArr.push(PHZAI.getPHZDef(message.params[index]));
        }
        if (message.strParams.length > 0) {
            var choiceCard = Number(message.strParams[0]);
            this.GmChoiceCard = PHZAI.getPHZDef(choiceCard);
        }
        SyEventManager.dispatchEvent(SyEvent.PHZ_REFRESH_GM_DATA);
    },

    getGmData: function () {
        return this.GmDataArr || [];
    },
    getGmChoiceCard: function () {
        return this.GmChoiceCard || null;
    },
    
    getCreditPayWay:function(){
        return this.creditAApay != 0;
    },

    checkMySeat:function(){
        if(this.getPlayerVo()){
            this.mySeat = this.getPlayerVo().seat;
        }else{
            this.mySeat = 1;
        }
    },

    getIs_LHQ_SHK_16:function(){
        if(this.wanfa == GameTypeEunmZP.HYLHQ){
            var bool = false;
            return this.intParams?this.intParams[7] == 4 || this.intParams[20] == 0:false;
        }else if(this.wanfa == GameTypeEunmZP.HYSHK){
            return this.intParams?this.intParams[23] == 0:false;
        }
        return false;
    },
    isClubRoom: function(_tableType) {
        return (_tableType == 1);
    },

    is3Ren: function() {
        return (this.renshu==3);
    },

    is2Ren: function() {
        return (this.renshu==2);
    },

    is4Ren: function() {
        return (this.renshu==4);
    },

    updateGPS:function(userId,gps){
        var p = this.getPlayerVo(userId);
        p.gps = gps;
    },

    //玩家的房内头像是否已经绘制完全
    isRoomIconRoad:function()
    {
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.isRoladIcon != 1){
                return false;
            }
        }
        return true;

    },

    getIsSwitchCoin:function(){
        return this.switchCoin == 1
    },

    cleanSPanel:function(){
        SyEventManager.dispatchEvent(SyEvent.PHZ_CLEAN_SPANEL);
    },

    getLimitDesc:function(){
        if(this.limitScore == 0){
            return "连庄上限不封顶。";
        }else{
            return "连庄上限"+ this.limitScore + "胡息";
        }
    },

    getWanFaDesc:function(){
        var str = "";
        // str = this.intParams[7] + "人,";
        if (this.wanfa == GameTypeEunmZP.SYZP){
            var tunStr = this.ext[5] || 3;
            var costStr = "";
            if (this.costWay == 1){
                costStr = "AA支付,";
            }else if (this.costWay == 2){
                costStr = "房主支付,";
            }else{
                costStr = "群主支付,";
            }
            str = this.intParams[7] + "人," + costStr + tunStr + "息1囤";
        }else if(this.wanfa == GameTypeEunmZP.XPPHZ){
            var infoArr = [];
            infoArr.push(this.intParams[2] == 3?"群主支付":this.intParams[2] == 2?"房主支付":"AA支付");
            if(this.intParams[4] == 1){
                infoArr.push("1-2-3");
            }else if(this.intParams[4] == 2){
                infoArr.push("2-4-6");
            }else if(this.intParams[4] == 3){
                infoArr.push("3-6-9");
            }
            if(this.intParams[5] != 0){
                infoArr.push("冲"+this.intParams[5]*2);
            }else{
                infoArr.push("不冲");
            }

            if(this.intParams[6] == 1)infoArr.push("箍臭");
            if(this.intParams[8] > 0){
                if(this.intParams[9] == 1){
                    infoArr.push("单局托管");
                }else if(this.intParams[9] == 3){
                    infoArr.push("三局托管");
                }else{
                    infoArr.push("整局托管");
                }
            }

            if (this.intParams[7] == 2 ){
                if(this.intParams[3] == 0){
                    infoArr.push("不抽牌");
                }else{
                    infoArr.push("抽" + this.intParams[3] + "张");
                }
            }

            if (this.intParams[7] == 2 && this.intParams[10] == 1){
                infoArr.push("低于" + this.intParams[11] + "分翻" + this.intParams[12] +"倍");
            }

            if(this.intParams[7] == 2 && this.intParams[14] && parseInt(this.intParams[14]) > 0){
                infoArr.push("低于"+ (this.intParams[13] || 10) + "分，加"+this.intParams[14]+"分 ");
            }

            return infoArr.join(" ");
        }else if(this.wanfa == GameTypeEunmZP.LDFPF){
            //cc.log("intParams = ",JSON.stringify(this.intParams));
            if (this.costWay == 1){
                costStr = "AA支付,";
            }else if (this.costWay == 2){
                costStr = "房主支付,";
            }else{
                costStr = "群主支付,";
            }
            costStr = costStr + this.intParams[13] + "胡起胡";
            var tuoguanStr = "";
            if (this.intParams[23] != 0) {
                tuoguanStr = " 可托管";
                if (this.intParams[36]){
                    tuoguanStr = " 整局托管";
                    if (this.intParams[36]==1){
                        tuoguanStr = " 单局托管";
                    }else if (this.intParams[36]==3){
                        tuoguanStr = " 三局托管";
                    }
                }
            }
            costStr = costStr + tuoguanStr;
            if (this.intParams[28] == 1) {
                costStr = costStr + ",飘胡";
            }
            if (this.intParams[0] == 1) {
                costStr = costStr + ",200息,一局";
            }else{
                costStr = costStr + "," + this.intParams[10] + "息";
            }
            if (this.intParams[34] == 0) {
                costStr = costStr + ",不打鸟";
            }else if (this.intParams[34] == 1) {
                costStr = costStr + ",胡息打鸟";
            }else if (this.intParams[34] == 2) {
                costStr = costStr + ",打鸟" + this.intParams[35] + "分";
            }else if (this.intParams[34] == 3) {
                costStr = costStr + ",局内打鸟";
            }

            if (this.intParams[7] == 2) {
                if(this.intParams[30] && this.intParams[30] != 0){
                    costStr = costStr + ",低于" + this.intParams[31] + "分翻"+this.intParams[32]+"倍";
                }
                if(this.intParams[37] && this.intParams[37] != 0){
                    costStr = costStr + ",低于" + this.intParams[38] + "分加"+this.intParams[37]+"分";
                }
            }

            return this.intParams[7] + "人," + costStr
        }else if (this.wanfa == GameTypeEunmZP.CZZP){
            var costStr = "";
            var huxi = this.intParams[11]==2?6:this.intParams[11]==3?3:9;
            var zhuanhuanStr =huxi + "息1囤";
            if (this.intParams[12] == 2){
                zhuanhuanStr = huxi + "息" + huxi/3 + "囤";
            }
            costStr = costStr + zhuanhuanStr;
            var huStr = "";
            if (this.intParams[13] == 2){
                huStr = ",有炮必胡";
            }else if (this.intParams[13] == 3){
                huStr = ",有胡必胡";
            }
            costStr = costStr + huStr;
            if (this.intParams[17] == 1){
                costStr = costStr + ",15张玩法";
            }
            if (this.intParams[18] == 2){
                costStr = costStr + ",飘1/2/3";
            }else if (this.intParams[18] == 3){
                costStr = costStr + ",飘2/3/5";
            }
            var hhd = "";
            if (this.intParams[14] == 2){
                hhd = " 红黑点";
            }else if (this.intParams[14] == 3){
                hhd = " 红黑点2倍";
            }
            costStr  = costStr + hhd;
            return costStr;
        }else if (this.wanfa == GameTypeEunmZP.LYZP){
            var costStr = this.intParams[7] + "人";
            // if (this.intParams[10] == 1){
            //     costStr = costStr + ",举手做声";
            // }
            if (this.intParams[11] == 1){
                costStr = costStr + ",不带无胡";
            }else if (this.intParams[11] == 0){
                costStr = costStr + ",可无胡";
            }
            if (this.intParams[12] == 1){
                costStr = costStr + ",不带一点红";
            }
            if (this.intParams[13] == 1){
                costStr = costStr + ",吃边打边";
            }
            if(this.intParams[15] != 0){
                if (this.intParams[19] == 2){
                    costStr = costStr + ",整局托管";
                } else if (this.intParams[19] == 1){
                    costStr = costStr + ",单局托管";
                }else if (this.intParams[19] == 3){
                    costStr = costStr + ",三局托管";
                }
            }
            if (this.intParams[7] == 2 ){
                if (this.intParams[14] != 0) {
                    costStr = costStr + ",抽" +  this.intParams[14] + "张";
                }
                if(this.intParams[16] && this.intParams[16] != 0){
                    costStr = costStr + ",低于" + this.intParams[17] + "分翻"+this.intParams[18]+"倍";
                }
                if(this.intParams[21] && this.intParams[21] != 0){
                    costStr = costStr + ",低于" + this.intParams[22] + "分加"+this.intParams[21]+"分";
                }
            }
            return costStr;
        }else if (this.wanfa == GameTypeEunmZP.ZHZ){
            var costStr = "";
            if (this.intParams[2] == 2){
                costStr = costStr + "4红起胡 "
            }else{
                costStr = costStr + "3红起胡 "
            }
            if (this.intParams[3] != 0){
                costStr = costStr + this.intParams[3] + "王 ";
            }
            if (this.intParams[4] == 1){
                costStr = costStr + "双合翻倍 ";
            }  
            if (this.intParams[5] == 1){
                costStr = costStr + "大胡10分 ";
            }
            if (this.intParams[10] == 1){
                costStr = costStr + "80分封顶 ";
            }
            if (this.intParams[7] == 2 ){
                if (this.intParams[21] != 0) {
                    costStr = costStr + "小于" + this.intParams[22]  + "分翻" +  this.intParams[23] + "倍 ";
                }
            }
            return costStr;
        }else if (this.wanfa == GameTypeEunmZP.WHZ){
            var infoArr = [];

            //infoArr.push(this.intParams[4] == 1?"卡歪":"不卡歪");

            if(this.intParams[3] == 1)infoArr.push("胡>歪");

            infoArr.push(this.intParams[10] == 2?"豪分20/30/40":"豪分10/20/30");
            infoArr.push(this.intParams[11] == 2?"名堂80/100/120":"名堂60/80/100");

            return infoArr.join(" ");
        }else if (this.wanfa == GameTypeEunmZP.LDS) {
            var infoArr = [];

            var wangArr = ["无王", "单王", "双王", "三王"];
            if (wangArr[this.intParams[4]]) {
                infoArr.push(wangArr[this.intParams[4]]);
            }

            if (this.intParams[5] == 1)infoArr.push("翻醒");
            else infoArr.push("跟醒");

            if (this.intParams[6] == 1)infoArr.push("双醒");

            if (this.intParams[3] == 2)infoArr.push("无王必胡");
            else infoArr.push("放炮必胡");

            if (this.intParams[8] == 2)infoArr.push("600封顶");
            else if (this.intParams[8] == 1)infoArr.push("300封顶");
            else infoArr.push("不封顶");

            if(!PHZRoomModel.isMoneyRoom()){
                if(this.intParams[9] != 0){
                    if (this.intParams[10] == 2){
                        infoArr.push("整局托管");
                    } else if (this.intParams[10] == 1){
                        infoArr.push("单局托管");
                    }else if (this.intParams[10] == 3){
                        infoArr.push("三局托管");
                    }
                }

                if (this.intParams[7] == 2 ){
                    if(this.intParams[11] && this.intParams[11] != 0){
                        infoArr.push("低于" + this.intParams[12] + "分翻"+this.intParams[13]+"倍");
                    }
                    if(this.intParams[14] && this.intParams[14] != 0){
                        infoArr.push("低于" + this.intParams[15] + "分加"+this.intParams[14]+"分");
                    }
                }
            }

            return infoArr.join(" ");
        }else if (this.wanfa == GameTypeEunmZP.JHSWZ) {
            var infoArr = [];

            if (this.intParams[5] == 1)infoArr.push("翻醒");
            else infoArr.push("跟醒");

            if (this.intParams[8] == 2)infoArr.push("600封顶");
            else if (this.intParams[8] == 1)infoArr.push("300封顶");
            else infoArr.push("不封顶");

            if(!PHZRoomModel.isMoneyRoom()){
                if(this.intParams[9] != 0){
                    if (this.intParams[10] == 2){
                        infoArr.push("整局托管");
                    } else if (this.intParams[10] == 1){
                        infoArr.push("单局托管");
                    }else if (this.intParams[10] == 3){
                        infoArr.push("三局托管");
                    }
                }

                if (this.intParams[7] == 2 ){
                    if(this.intParams[11] && this.intParams[11] != 0){
                        infoArr.push("低于" + this.intParams[12] + "分翻"+this.intParams[13]+"倍");
                    }
                    if(this.intParams[14] && this.intParams[14] != 0){
                        infoArr.push("低于" + this.intParams[15] + "分加"+this.intParams[14]+"分");
                    }
                }
            }

            return infoArr.join(" ");
        }else if(this.wanfa == GameTypeEunmZP.YZCHZ){
            var infoArr = [];
            if(this.intParams[16] > 0){
                infoArr.push("全局" + this.intParams[16] + "封顶");
            }

            var wangArr = ["无王","单王","双王","三王","四王"];
            if(wangArr[this.intParams[4]]){
                infoArr.push(wangArr[this.intParams[4]]);
            }
            if(this.intParams[5] == 1)infoArr.push("翻醒");
            else infoArr.push("跟醒");

            if(this.intParams[6] == 1)infoArr.push("双醒");

            if(this.intParams[3] == 1)infoArr.push("按王限胡");
            else if(this.intParams[3] == 2)infoArr.push("按番限胡");
            else infoArr.push("不限胡");

            if(this.intParams[8] == 3)infoArr.push("800封顶");
            else if(this.intParams[8] == 2)infoArr.push("600封顶");
            else if(this.intParams[8] == 1)infoArr.push("300封顶");
            else infoArr.push("不封顶");

            if(!PHZRoomModel.isMoneyRoom()){
                if(this.intParams[9] != 0){
                    if (this.intParams[10] == 2){
                        infoArr.push("整局托管");
                    } else if (this.intParams[10] == 1){
                        infoArr.push("单局托管");
                    }else if (this.intParams[10] == 3){
                        infoArr.push("三局托管");
                    }
                }

                if (this.intParams[7] == 2 ){
                    if(this.intParams[11] && this.intParams[11] != 0){
                        infoArr.push("低于" + this.intParams[12] + "分翻"+this.intParams[13]+"倍");
                    }
                    if(this.intParams[17] && this.intParams[17] != 0){
                        infoArr.push("低于" + this.intParams[18] + "分加"+this.intParams[17]+"分");
                    }
                }
            }

            return infoArr.join("/");
        }else if(this.wanfa == GameTypeEunmZP.HYLHQ){
            var infoArr = [];
            if (this.intParams[10] == 1){
                infoArr.push("跟醒");
            }else if (this.intParams[10] == 2){
                infoArr.push("翻醒");
            }

            if (this.intParams[11] == 1) infoArr.push("一息一囤");
            if (this.intParams[12] == 1) infoArr.push("一五十");
            if (this.intParams[29] == 1){
                infoArr.push("有胡必胡");
            }else{
                if (this.intParams[19] == 1) 
                    infoArr.push("放炮必胡");
            }
            if (this.intParams[18] == 1) infoArr.push("放炮包赔");
            if (this.intParams[30] == 1) infoArr.push("底分两分");
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.HYSHK){
            var infoArr = [];
            if (this.intParams[10] == 1){
                infoArr.push("跟醒");
            }else if (this.intParams[10] == 2){
                infoArr.push("翻醒");
            }
            if (this.intParams[11] == 1) infoArr.push("有胡必胡");
            if (this.intParams[11] == 2) infoArr.push("放炮必胡");
            infoArr.push("放炮"+this.intParams[12]+"倍");

            if (this.intParams[14] == 1) infoArr.push("一五十");
            if (this.intParams[16] == 1) infoArr.push("红黑点");
            if (this.intParams[19] == 1) infoArr.push("自摸翻倍");
            infoArr.push("底分"+(parseInt(this.intParams[32])+1)+"分");
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.HBGZP){ var infoArr = [];
            infoArr.push(this.intParams[7] + "人");
            infoArr.push(this.intParams[0] + "局");
            infoArr.push(this.intParams[2] == 3?"群主支付":this.intParams[2] == 2?"房主支付":"AA支付");

            infoArr.push(this.intParams[22]+"个子起胡");
            infoArr.push(this.intParams[23] == 1 ? "十个花" : "溜花");
            infoArr.push(this.intParams[24] == 0 ? "不跑" : this.intParams[24] == 1 ? "带跑" : "定跑");
            if(this.intParams[24] == 1){
                infoArr.push("跑"+this.intParams[25]+"分");
            }
            if(this.intParams[26] == 1){
                infoArr.push("一炮多响");
            }

            if(this.intParams[8] > 0){
                if(this.intParams[21] == 1){
                    infoArr.push("单局托管");
                }else if(this.intParams[21] == 2){
                    infoArr.push("整局托管");
                }else if(this.intParams[21] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }

            if (this.intParams[7] == 2 && this.intParams[18] == 1){
                infoArr.push("低于" + this.intParams[19] + "分翻" + this.intParams[20] +"倍");
            }

            if (this.intParams[7] == 2 && this.intParams[27] && this.intParams[27] != 0){
                infoArr.push("低于" + this.intParams[27] + "分加" + this.intParams[28] +"分");
            }

            return infoArr.join(" ");

        }else if(this.wanfa == GameTypeEunmZP.SMPHZ){
            var infoArr = [];
            infoArr.push(this.intParams[15] == 0 ? "随机坐庄" : "房主坐庄");
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }

            if(this.intParams[18] == 0){
                infoArr.push("不封顶 ");
            }else{
                infoArr.push(this.intParams[18]+"封顶 ");
            }

            if(this.intParams[17] == 2){
                infoArr.push("小六八番 ");
            }else if(this.intParams[17] == 1){
                infoArr.push("大六八番 ");
            }

            infoArr.push(this.intParams[16] == 1 ? "全名堂 " : "土炮胡 ");

            if(this.intParams[16] == 0 && this.intParams[19] == 1){
                infoArr.push("对子胡 ");
            }

            if(this.intParams[16] == 1 && this.intParams[20] == 1){
                infoArr.push("团胡 ");
            }

            infoArr.push("底分: " + this.intParams[45]);

            if(this.intParams[7] == 2) {
                if (this.intParams[14] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[14] + "张");
                }
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.GLZP){
            var infoArr = [];
            infoArr.push(this.intParams[7]+"人");
            if (this.intParams[10] == 1){
                infoArr.push("跟醒");
            }else if (this.intParams[10] == 2){
                infoArr.push("翻醒");
            }
            infoArr.push(this.intParams[41] + "息起胡");
            infoArr.push(this.intParams[42] + "胡1子");
            if(this.intParams[19] == 1){
                infoArr.push("自摸加1");
            }else{
                infoArr.push("自摸" + this.intParams[19] + "倍");
            }
            infoArr.push(this.intParams[26] == 0 ? "无鬼牌" : "有鬼牌");
            infoArr.push("放炮" + this.intParams[12] + "倍");
            if (this.intParams[37] == 1) infoArr.push("重醒");
            if (this.intParams[38] == 1) infoArr.push("上醒");
            if (this.intParams[39] == 1) infoArr.push("中醒");
            if (this.intParams[40] == 1) infoArr.push("下醒");

            if(this.intParams[27] != 0){
                if(this.intParams[28] == 2){
                    infoArr.push("整局托管");
                }else if(this.intParams[28] == 3){
                    infoArr.push("三局托管");
                }else{
                    infoArr.push("单局托管");
                }
            }else{
                infoArr.push("不托管");
            }

            if(this.intParams[7] == 2){
                if (this.intParams[23] != 0) {
                    infoArr.push("抽" + this.intParams[23]  + "张");
                }else{
                    infoArr.push("不抽牌");
                }
                if (this.intParams[29] != 0) {
                    infoArr.push("低于" + this.intParams[30]  + "分翻" +  this.intParams[31] + "倍");
                }
                if(this.intParams[33] && this.intParams[35] && this.intParams[33] != 0 && this.intParams[35] != 0){
                    infoArr.push("低于" + this.intParams[35]  + "分加" +  this.intParams[33] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.YZLC){
            var infoArr = [];
            var costStr = "";
            if(this.intParams[9] == 1){
                infoArr.push("AA支付");
            }else if(this.intParams[9] == 2){
                infoArr.push("房主支付");;
            }else if(this.intParams[9] == 3){
                infoArr.push("群主支付");
            }
            infoArr.push(this.intParams[0] +  "局");
            infoArr.push(this.intParams[7] +  "人");
            infoArr.push(this.intParams[17]+"戳");
            if(this.intParams[18] == 1){
                infoArr.push("见红加分");
            }
            if(this.intParams[19] == 1){
                infoArr.push("起胡2分");
            }
            if(this.intParams[20] == 1){
                infoArr.push("红戳4番");
            }
            if(this.intParams[21] == 1){
                infoArr.push("番戳");
            }
            infoArr.push(this.intParams[16] == 0?"曲戳":"定戳");
            if(this.intParams[7] == 2){//如果是两人
                if(this.intParams[24] == 1){
                    infoArr.push("低于"+this.intParams[25]+"分，翻"+ this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            if(this.intParams[23] != 0){
                if(this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if(this.intParams[27] == 2){
                    infoArr.push("整局托管");
                }else if(this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.XXGHZ){
            var infoArr = [];
            infoArr.push(this.intParams[7]+"人");
            infoArr.push("满百结算");
            infoArr.push(this.intParams[15] == 0 ? "随机坐庄" : "先进房坐庄");
            var numArr = [0,4,3];
            var datuo = ["不打坨","坨对坨4番","坨对坨3番"];
            var index = numArr.indexOf(parseInt(this.intParams[28])) ;
            index = index != -1 ? index : 0;
            infoArr.push(datuo[index]);
            if(this.intParams[11] == 1){
                infoArr.push("红黑胡");
            }
            if(this.intParams[33] == 1){
                infoArr.push("30胡翻倍");
            }
            if(this.intParams[36] == 1){
                infoArr.push("天地胡");
            }
            if(this.intParams[41] == 1){
                infoArr.push("放炮必胡");
            }
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }

            if(this.intParams[7] == 2) {
                if (this.intParams[14] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[14] + "张");
                }
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.XXPHZ){
            var infoArr = [];
            infoArr.push(this.intParams[15] == 0 ? "随机坐庄" : "先进房坐庄");
            infoArr.push(this.intParams[16] == 0 ? "明偎" : "暗偎");
            infoArr.push(this.intParams[30] + "息起胡");
            infoArr.push(this.intParams[29] == 0 ? "囤数计分" : "胡息计分");
            if(this.intParams[11] == 1){
                infoArr.push("红黑胡");
            }
            if(this.intParams[35] == 1){
                infoArr.push("一点红");
            }
            if(this.intParams[36] == 1){
                infoArr.push("天地胡");
            }
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
            if(this.intParams[7] == 2) {
                if (this.intParams[14] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[14] + "张");
                }
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.XTPHZ){
            var infoArr = [];
            infoArr.push(this.intParams[15] == 0 ? "随机坐庄" : "先进房坐庄");
            infoArr.push(this.intParams[16] ? "明偎" : "暗偎");
            infoArr.push(this.intParams[30] + "息起胡");
            var StrArr = ["1息1囤","3息1囤"];
            infoArr.push(StrArr[parseInt(this.intParams[13]) - 1]);
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
            if(this.intParams[11] == 1){
                if(this.intParams[44] == 13){
                    infoArr.push("红黑胡(13红)");
                }else{
                    infoArr.push("红黑胡(10红)");
                }
            }
            if(this.intParams[12] == 100){
                infoArr.push("100分封顶");
            }else if(this.intParams[12] == 200){
                infoArr.push("200分封顶");
            }
            if(this.intParams[17] == 1){
                infoArr.push("2番封顶");
            }else if(this.intParams[17] == 2){
                infoArr.push("4番封顶");
            }
            if(this.intParams[17] == 0 && this.intParams[12] == 0){
                infoArr.push("不封顶");
            }
            if(this.intParams[31] == 1){
                infoArr.push("自摸加番");
            }
            if(this.intParams[32] == 1){
                infoArr.push("一五十");
            }
            if(this.intParams[33] == 1){
                infoArr.push("30胡翻倍");
            }
            if(this.intParams[35] == 1){
                infoArr.push("一点红");
            }
            if(this.intParams[36] == 1){
                infoArr.push("天地胡");
            }
            if(this.intParams[37] == 1){
                infoArr.push("大小字");
            }
            if(this.intParams[38] == 1){
                infoArr.push("碰碰胡");
            }
            if(this.intParams[18] == 1){
                infoArr.push("株洲计分");
            }
            if(this.intParams[19] == 1){
                infoArr.push("自摸加3胡");
            }
            if(this.intParams[7] == 2) {
                if (this.intParams[14] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[14] + "张");
                }
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");

        }else if(this.wanfa==GameTypeEunmZP.CDPHZ) {

            var infoArr = [];

            if (this.intParams[15] == 1)infoArr.push("首局随机坐庄");

            if (this.intParams[18] == 0) {
                infoArr.push("不封顶 ");
            } else {
                infoArr.push(this.intParams[18] + "封顶 ");
            }

            if (this.intParams[17] == 2) {
                infoArr.push("小六八番 ");
            } else if (this.intParams[17] == 1) {
                infoArr.push("大六八番 ");
            }

            if (this.intParams[16] == 1)infoArr.push("全名堂");
            else if (this.intParams[16] == 2)infoArr.push("红黑点");
            else if (this.intParams[16] == 3)infoArr.push("多红多番");

            infoArr.push("底分: " + this.intParams[45]);

            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.AXWMQ){
            var infoArr = [];

            if(this.intParams[3] == 2)infoArr.push("小卓版");
            else if(this.intParams[3] == 3)infoArr.push("大卓版");
            else if(this.intParams[3] == 4)infoArr.push("全名堂版");
            else if(this.intParams[3] == 5)infoArr.push("钻石版");
            else infoArr.push("老名堂版");

            if(this.intParams[7] == 2 && this.intParams[4] > 0)infoArr.push("起胡胡息:" + this.intParams[4]);
            if(this.intParams[7] == 2 && this.intParams[5] > 0)infoArr.push("底牌数:" + this.intParams[5]);

            if(this.intParams[6] > 0)infoArr.push("逗:" + this.intParams[6]);

            return infoArr.join(",");

        }else if(this.wanfa==GameTypeEunmZP.HHHGW){

            var infoArr = [];

            if(this.intParams[7] == 2 && this.intParams[3] > 0){
                infoArr.push("抽牌" + this.intParams[3] + "张");
            }

            if(this.intParams[4] == 1)infoArr.push("15胡可自摸");
            if(this.intParams[5] == 1)infoArr.push("自摸加一囤");
            if(this.intParams[6] == 1)infoArr.push("自摸2番");

            if(this.intParams[8] == 1){
                infoArr.push("红拐弯(234)");
            }else {
                infoArr.push("红拐弯(468)");
            }

            return infoArr.join(",");

        }else if(this.wanfa == GameTypeEunmZP.AHPHZ){
            var infoArr = [];
            infoArr.push(this.intParams[15] == 0 ? "随机坐庄" : "先进房坐庄");
            var StrArr = ["1息1囤","3息1囤"];
            infoArr.push(StrArr[parseInt(this.intParams[13]) - 1]);
            infoArr.push(this.intParams[45] == 1 ? "1分底":"2分底");
            if(this.intParams[43] == 1){
                infoArr.push("自摸翻倍");
            }
            if(this.intParams[31] == 1){
                infoArr.push("自摸加一囤");
            }
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
            if(this.intParams[41] == 1){
                infoArr.push("三提五坎");
            }
            if(this.intParams[44] == 1){
                infoArr.push("爬坡");
            }
            if(this.intParams[7] == 2) {
                if (this.intParams[14] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[14] + "张");
                }
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.WCPHZ){
            var infoArr = [];
            infoArr.push(this.intParams[15] == 0 ? "臭牌臭庄" : "臭牌不臭庄");
            infoArr.push("30胡"+this.intParams[17]+ "牌");
            infoArr.push(this.intParams[18] == 0 ? "自摸不加分" : "自摸+1牌");
            infoArr.push("30胡息以上见1+"+this.intParams[19]+ "分");
            infoArr.push(this.intParams[20] == 0 ? "不飘" : "自由飘");
            infoArr.push(this.intParams[21] == 0 ? "不坐飘" : ("坐飘" + this.intParams[21]));

            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
            if(this.intParams[7] == 2) {
                if (this.intParams[14] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[14] + "张");
                }
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.NXPHZ){
            var infoArr = [];
            infoArr.push(this.intParams[15] == 0 ? "随机坐庄" : "先进房坐庄");
            infoArr.push(this.intParams[30] + "息起胡");
            if(this.intParams[32] == 1){
                infoArr.push("海底胡");
            }
            if(this.intParams[37] == 1){
                infoArr.push("十六小");
            }
            if(this.intParams[37] == 2){
                infoArr.push("十八小");
            }
            if(this.intParams[38] == 1){
                infoArr.push("加红加小加大");
            }
            if(this.intParams[33] == 1){
                infoArr.push("有胡必胡");
            }
            if(this.intParams[31] != 0){
                if(parseInt(this.intParams[31]) > 0){
                    infoArr.push("加" + this.intParams[31] + "分");
                }else{
                    infoArr.push("自摸翻倍");
                }
            }
            if(this.intParams[34] == 0){
                infoArr.push("不扎鸟");
            }else{
                infoArr.push("扎"+ this.intParams[34] +"鸟");
            }
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
            if(this.intParams[7] == 2) {
                if (this.intParams[14] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[14] + "张");
                }
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.HSPHZ){
            var infoArr = [];
            //infoArr.push(this.intParams[48] +"倍")
            infoArr.push("倒分：" + this.intParams[49])
            infoArr.push(this.intParams[50] == 1 ? "单局封顶20分" : "无封顶")
            infoArr.push("底牌" + this.intParams[14]+"张")
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    infoArr.push("整局托管");
                } else if (this.intParams[27] == 1){
                    infoArr.push("单局托管");
                }else if (this.intParams[27] == 3){
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
            if(this.intParams[7] == 2) {
                if (this.intParams[24] != 0) {
                    infoArr.push("低于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍");
                }
                if(this.intParams[46] && this.intParams[47] && this.intParams[46] != 0 && this.intParams[47] != 0){
                    infoArr.push("低于" + this.intParams[46]  + "分加" +  this.intParams[47] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.XXEQS){
            var infoArr = [];
            infoArr.push(this.intParams[12] == 0?"无庄分":("庄分" + this.intParams[12] + " "));
            if(this.intParams[13] == 1)infoArr.push("自摸加1分")
            if(this.intParams[14] == 1)infoArr.push("自摸红字加1分")
            if(this.intParams[15] == 1)infoArr.push("充分")
            if(this.intParams[20] > 0){
                if(this.intParams[24] == 1){
                    infoArr.push("单局托管");
                }else if(this.intParams[24] == 2){
                    infoArr.push("整局托管");
                }else{
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }

            if(this.intParams[7] == 2){
                if(this.intParams[11] == 0){
                    infoArr.push("不抽牌");
                }else{
                    infoArr.push("抽" + this.intParams[11] + "张");
                }
                if (this.intParams[21] != 0) {
                    infoArr.push("低于" + this.intParams[22]  + "分翻" +  this.intParams[23] + "倍");
                }
                if(this.intParams[16] && this.intParams[17] && this.intParams[16] != 0 && this.intParams[17] != 0){
                    infoArr.push("低于" + this.intParams[16]  + "分加" +  this.intParams[17] + "分");
                }
            }
            return infoArr.join(" ");
        }else if(this.wanfa == GameTypeEunmZP.LSZP) {
            var infoArr = [];
            infoArr.push(this.intParams[10] == 1 ? "飘1/2/3" : this.intParams[10] == 2 ? "飘2/3/5" : "不飘");
            if (this.intParams[12] > 0) {
                if (this.intParams[16] == 1) {
                    infoArr.push("单局托管");
                } else if (this.intParams[16] == 2) {
                    infoArr.push("整局托管");
                } else {
                    infoArr.push("三局托管");
                }
            } else {
                infoArr.push("不托管");
            }

            if (this.intParams[7] == 2) {
                if (this.intParams[11] == 0) {
                    infoArr.push("不抽牌");
                } else {
                    infoArr.push("抽" + this.intParams[11] + "张");
                }
                if (this.intParams[13] != 0) {
                    infoArr.push("低于" + this.intParams[14] + "分翻" + this.intParams[15] + "倍");
                }
                if (this.intParams[17] && this.intParams[18] && this.intParams[17] != 0 && this.intParams[18] != 0) {
                    infoArr.push("低于" + this.intParams[18] + "分加" + this.intParams[17] + "分");
                }
            }
            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.ZZPH){
            var infoArr = [];
            infoArr.push(this.intParams[4] == 2?"强制胡牌":"不强制");
            infoArr.push(this.intParams[5] == 2?"先进房坐庄":"随机坐庄");
            infoArr.push(this.intParams[6] == 2?"连庄":this.intParams[6] == 1?"中庄x2":"不连庄不中张");

            if(PHZRoomModel.isMoneyRoom()){
                if(this.intParams[8] > 0){
                    if(this.intParams[9] == 1){
                        infoArr.push("单局托管");
                    }else if(this.intParams[9] == 2){
                        infoArr.push("整局托管");
                    }else{
                        infoArr.push("三局托管");
                    }
                }else{
                    infoArr.push("不托管");
                }
            }


            if(this.intParams[7] == 2){
                if(this.intParams[3] == 0){
                    infoArr.push("不抽牌");
                }else{
                    infoArr.push("抽" + this.intParams[3] + "张");
                }

                if(PHZRoomModel.isMoneyRoom()){
                    if (this.intParams[10] != 0) {
                        infoArr.push("低于" + this.intParams[11]  + "分翻" +  this.intParams[12] + "倍");
                    }
                    if(this.intParams[13] && this.intParams[14] && this.intParams[13] != 0 && this.intParams[14] != 0){
                        infoArr.push("低于" + this.intParams[13]  + "分加" +  this.intParams[14] + "分");
                    }
                }

            }
            return infoArr.join(" ");
        }else if(this.wanfa == GameTypeEunmZP.YJGHZ){

            var infoArr = [];

            infoArr.push("封顶:" + (this.intParams[3]) + "息");
            infoArr.push(this.intParams[4] == 1?"可飘":"不可飘");
            infoArr.push("无息平:" + (this.intParams[5] == 1?"有":"没有"));
            infoArr.push("吊吊手:" + (this.intParams[6] == 1?"有":"没有"));

            return infoArr.join(",");
        }else if(this.wanfa == GameTypeEunmZP.NXGHZ){
            var infoArr = [];
            infoArr.push(this.intParams[0] + "局");
            infoArr.push(this.intParams[2] == 3?"群主支付":this.intParams[2] == 2?"房主支付":"AA支付");
            infoArr.push(this.intParams[16] == 1?"大卓版":"小卓版");
            if(this.intParams[17] == 1){
                infoArr.push("背靠背");
            }
            if(this.intParams[18] == 1) {
                infoArr.push("手牵手");
            }
            if(this.intParams[7] == 2){
                if(this.intParams[15] > 0)infoArr.push("抽牌" + this.intParams[15] +"张");
                else infoArr.push("不抽底牌");
            }
            if(this.intParams[8] > 0){
                if(this.intParams[9] == 1){
                    infoArr.push("单局托管");
                }else if(this.intParams[9] == 2){
                    infoArr.push("整局托管");
                }else{
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }

            if(this.intParams[7] == 2){
                if (this.intParams[10] != 0) {
                    infoArr.push("低于" + this.intParams[11]  + "分翻" +  this.intParams[12] + "倍");
                }
                if(this.intParams[14] && this.intParams[13] && this.intParams[14] != 0 && this.intParams[13] != 0){
                    infoArr.push("低于" + this.intParams[14]  + "分加" +  this.intParams[13] + "分");
                }
            }
            return infoArr.join(" ");
        }else if(this.wanfa == GameTypeEunmZP.YYWHZ){
            var infoArr = [];
            infoArr.push(this.intParams[0] + "局");
            infoArr.push(this.intParams[2] == 3?"群主支付":this.intParams[2] == 2?"房主支付":"AA支付");
            infoArr.push(this.intParams[19]+"息");
            infoArr.push(this.intParams[3] == 0 ? "不封顶":("封顶:" + (this.intParams[3]) + "息"));
            if(this.intParams[16] == 1){
                infoArr.push("大小字胡");
            }
            if(this.intParams[17] == 1) {
                infoArr.push("天胡报听");
            }
            if(this.intParams[18] == 1) {
                infoArr.push("名堂");
            }
            if(this.intParams[7] == 2){
                if(this.intParams[15] > 0)infoArr.push("抽牌" + this.intParams[15] +"张");
                else infoArr.push("不抽底牌");
            }
            if(this.intParams[20] == 1) {
                infoArr.push("只可吃摸的牌");
            }
            if(this.intParams[8] > 0){
                if(this.intParams[9] == 1){
                    infoArr.push("单局托管");
                }else if(this.intParams[9] == 2){
                    infoArr.push("整局托管");
                }else{
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }

            if(this.intParams[7] == 2){
                if (this.intParams[10] != 0) {
                    infoArr.push("低于" + this.intParams[11]  + "分翻" +  this.intParams[12] + "倍");
                }
                if(this.intParams[14] && this.intParams[13] && this.intParams[14] != 0 && this.intParams[13] != 0){
                    infoArr.push("低于" + this.intParams[14]  + "分加" +  this.intParams[13] + "分");
                }
            }
            return infoArr.join(" ");
        }else if(this.wanfa == GameTypeEunmZP.DYBP){
            var costStr = "";
            if (this.costWay == 1){
                costStr = "AA支付,";
            }else if (this.costWay == 2){
                costStr = "房主支付,";
            }else{
                costStr = "群主支付,";
            }
            if(SdkUtil.isYYBReview()){
                costStr = "";
            }
            var limitScoreStr = "";
            var hhdStr = "";
            if (this.wanfaHhd == 1){
                hhdStr = "红黑点,";
            }
            if(this.intParams[7] == 2) {
                if (this.intParams[24] != 0) {
                    hhdStr = hhdStr +"小于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍,";
                }
                if (this.intParams[29] && this.intParams[29] != 0) {
                    hhdStr = hhdStr +"低于" + this.intParams[30]  + "分加" +  this.intParams[29] + "分,";
                }
            }
            if(this.intParams[23] != 0){
                if (this.intParams[27] == 2){
                    hhdStr = hhdStr +"整局托管,";
                } else if (this.intParams[27] == 1){
                    hhdStr = hhdStr +"单局托管,";
                }else if (this.intParams[27] == 3){
                    hhdStr = hhdStr +"三局托管,";
                }
            }
            hhdStr = hhdStr + (this.intParams[28] == 0 ? "不加锤," : "加锤,");
            //if(this.intParams[0] == 1){
            //    hhdStr = hhdStr + "1局,";
            //}
            hhdStr = hhdStr + this.intParams[32] + "息起胡,";
            if(this.intParams[33] == 1){
                hhdStr = hhdStr + "随机庄家,";
            }
            if(this.intParams[31] == 1){
                hhdStr = hhdStr + "天地胡加10胡,";
            }else if(this.intParams[31] == 2){
                hhdStr = hhdStr + "天地胡翻倍,";
            }else if(this.intParams[31] == 0){
                hhdStr = hhdStr + "无天地胡,";
            }
            var klzStr = "";
            if (this.wanfaKlz == 1){
                klzStr = "可连庄,";
                if(this.limitScore == 0){
                    limitScoreStr = "不封顶,";
                }else{
                    limitScoreStr = this.limitScore + "息封顶,";
                }
            }else{
                klzStr = "不可连庄";
            }
            str = this.intParams[7] + "人," + costStr + hhdStr+ klzStr+limitScoreStr;
        }else{
            var costStr = "";
            if (this.costWay == 1){
                costStr = "AA支付,";
            }else if (this.costWay == 2){
                costStr = "房主支付,";
            }else{
                costStr = "群主支付,";
            }
            if(SdkUtil.isYYBReview()){
                costStr = "";
            }
            var limitScoreStr = "";
            var hhdStr = "";
            if (this.wanfaHhd == 1){
                hhdStr = "红黑点,";
            }
            if(this.wanfa == GameTypeEunmZP.SYBP){
                if(this.intParams[7] == 2) {
                    if (this.intParams[14] == 0) {
                        hhdStr = hhdStr +"不抽牌,";
                    } else {
                        hhdStr = hhdStr +"抽" + this.intParams[14] + "张,";
                    }
                    if (this.intParams[24] != 0) {
                        hhdStr = hhdStr +"小于" + this.intParams[25]  + "分翻" +  this.intParams[26] + "倍,";
                    }
                    if (this.intParams[29] && this.intParams[29] != 0) {
                        hhdStr = hhdStr +"低于" + this.intParams[30]  + "分加" +  this.intParams[29] + "分,";
                    }
                }
                if(this.intParams[23] != 0){
                    if (this.intParams[27] == 2){
                        hhdStr = hhdStr +"整局托管,";
                    } else if (this.intParams[27] == 1){
                        hhdStr = hhdStr +"单局托管,";
                    }else if (this.intParams[27] == 3){
                        hhdStr = hhdStr +"三局托管,";
                    }
                }
                hhdStr = hhdStr + (this.intParams[28] == 0 ? "不加锤," : "加锤,");
            }
            if(this.intParams[0] == 1){
                hhdStr = hhdStr + "1局,";
            }
            var klzStr = "";
            if (this.wanfaKlz == 1){
                klzStr = "可连庄,";
                if(this.limitScore == 0){
                    limitScoreStr = "不封顶,";
                }else{
                    limitScoreStr = this.limitScore + "息,";
                }
            }else{
                klzStr = "不可连庄";
            }
            str = this.intParams[7] + "人," + costStr + hhdStr+ klzStr+limitScoreStr;
        }
        return str
    },

    getPlayerSeq:function(userId,seat){
        if(userId == PlayerModel.userId)
            return 1;
        var seqArray = this.seatSeq[this.mySeat];
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

    getPlayerUserIdBySeat:function(seat){
        var userId = null;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(seat && p.seat == seat){
                userId = p.userId;
                break;
            }
        }
        return userId;
    },

    LYZP_ChiBianChangeCards:function(message){
        var params = message.params;
        // cc.log("ChiBianChangeCards::"+JSON.stringify(params));
        PHZMineLayout.ChiBianChangeCards(params,2);
        this.chibianParams = params;
    },
    ZHZ_CardsChangeGray:function(message){
        var params = message.params;
        cc.log("ZHZ_CardsChangeGray::"+JSON.stringify(message));
        ZHZMineLayout.CardsChangeGray(params);
    },
    LYZP_ChiBianDaBianAndFangzhao:function(c){
        var self = this;
        AlertPop.show("吃边打边，本局将只能胡黑胡、红胡、点朱胡、无胡，且同时放招，放招后不能吃牌、碰牌，确定出牌吗？",function(){
            sySocket.sendComReqMsg(2019,[c]);
            if (self.chibianParams.length > 0){
                PHZMineLayout.ChiBianChangeCards(self.chibianParams,1);
                self.chibianParams = [];
            }
            self.isChiBianDaBian = true;
        },function(){
            //把打出去的牌还原回来，直接拿上一次的手牌数据来还原
            if(self.lastMineSortedJson){
                self.nextSeat = self.mySeat;
                PHZMineLayout.restoreCard(self.lastMineSortedJson);
                self.mineRoot.cancelFangZhao();
                PHZMineLayout.ChiBianChangeCards(self.chibianParams,2);
            }
        });
    },
    LYZP_ChiBianDaBian:function(c){
        var self = this;
        AlertPop.show("吃边打边，本局将只能胡黑胡、红胡、点朱胡、无胡，确定出牌吗？",function(){
            sySocket.sendComReqMsg(2018,[c]);
            if (self.chibianParams.length > 0){
                PHZMineLayout.ChiBianChangeCards(self.chibianParams,1);
                // self.chibianParamsForFangZhao = self.chibianParams;
                self.chibianParams = [];
            }
            self.isChiBianDaBian = true;
        },function(){
            //把打出去的牌还原回来，直接拿上一次的手牌数据来还原
            if(self.lastMineSortedJson){
                self.nextSeat = self.mySeat;
                PHZMineLayout.restoreCard(self.lastMineSortedJson);
                self.mineRoot.cancelFangZhao();
                PHZMineLayout.ChiBianChangeCards(self.chibianParams,2);
            }
        });
    },
    HYSHK_KehuShizhongpai:function(message){
        SyEventManager.dispatchEvent(SyEvent.HYSHK_KHSZP,message);
    },
    SYBP_StartChui:function(message){
        SyEventManager.dispatchEvent(SyEvent.SYBP_CHUI,message);
    },
    SYBP_FinishChui:function(message){
        SyEventManager.dispatchEvent(SyEvent.SYBP_FINISH_CHUI,message);
    },
    StartDaNiao:function(message){
        SyEventManager.dispatchEvent(SyEvent.LDFPF_DANIAO,message);
    },

    FinishDaNiao:function(message) {
        SyEventManager.dispatchEvent(SyEvent.LDFPF_FINISH_DANIAO, message);
    },

    // ReportDaNiao:function(message) {
    //     SyEventManager.dispatchEvent(SyEvent.LDFPF_REPORT_DANIAO, message);
    // },
    OnQiHu:function(message){
        SyEventManager.dispatchEvent(SyEvent.LDFPF_QIHU, message);
    },

    StartPiaoFen:function(message){
        SyEventManager.dispatchEvent(SyEvent.CZZP_PIAOFEN,message);
    },

    FinishPiaoFen:function(message) {
        SyEventManager.dispatchEvent(SyEvent.CZZP_FINISH_PIAOFEN, message);
    },
    cleanData:function(){
        this.selfAct.length=0;
        this.currentAction=0;
        this.lastMineSortedJson = null;
    },

    getMoneyRoomBeilv:function(){
        return this.ext[7];
    },

    getTuoguanTime:function(){
        //return 120;
        return (this.timeOut[0] || 1000) / 1000 ;
    },

    //是否是托管房间
    isAutoPlay:function(){

        if(this.wanfa == GameTypeEunmZP.YJGHZ || this.wanfa == GameTypeEunmZP.NXGHZ || this.wanfa == GameTypeEunmZP.YYWHZ || this.wanfa == GameTypeEunmZP.XPPHZ){
            return this.intParams[8] > 0;
        }
        if(this.wanfa == GameTypeEunmZP.ZZPH){
            return this.intParams[8] > 0;
        }
        if(this.wanfa == GameTypeEunmZP.LDS || this.wanfa == GameTypeEunmZP.YZCHZ || this.wanfa == GameTypeEunmZP.JHSWZ){
            return this.ext[13];
        }else if(this.wanfa == GameTypeEunmZP.XXGHZ || this.wanfa == GameTypeEunmZP.XXPHZ
            || this.wanfa == GameTypeEunmZP.XTPHZ || this.wanfa == GameTypeEunmZP.AHPHZ
            || this.wanfa == GameTypeEunmZP.NXPHZ || this.wanfa == GameTypeEunmZP.HSPHZ
            || this.wanfa == GameTypeEunmZP.SMPHZ || this.wanfa == GameTypeEunmZP.CDPHZ
            || this.wanfa == GameTypeEunmZP.HHHGW|| this.wanfa == GameTypeEunmZP.WCPHZ
            || this.wanfa == GameTypeEunmZP.AXWMQ){
            return this.ext[15];
        }else{
            return this.ext[17];
        }
    },

    getNewTuoguanTime:function(){
        //return 120;
        if (this.isAutoPlay()){
            if (this.wanfa == GameTypeEunmZP.CZZP){
                return this.intParams[21]==1?60:this.intParams[21];
            }else if (this.wanfa == GameTypeEunmZP.LYZP){
                return this.intParams[15]==1?60:this.intParams[15];
            }else if (this.wanfa == GameTypeEunmZP.ZHZ){
                return this.intParams[20]==1?60:this.intParams[20];
            }else if (this.wanfa == GameTypeEunmZP.WHZ){
                return this.intParams[13]==1?60:this.intParams[13];
            }else if (this.wanfa == GameTypeEunmZP.LDS || this.wanfa == GameTypeEunmZP.YZCHZ || this.wanfa == GameTypeEunmZP.JHSWZ){
                return this.intParams[9]==1?60:this.intParams[9];
            }else if (this.wanfa == GameTypeEunmZP.HYLHQ){
                return this.intParams[24]==1?60:this.intParams[24];
            }else if (this.wanfa == GameTypeEunmZP.HYSHK){
                return this.intParams[27]==1?60:this.intParams[27];
            }else if (this.wanfa == GameTypeEunmZP.XTPHZ){
                return this.intParams[23]==1?60:this.intParams[23];
            }else if (this.wanfa == GameTypeEunmZP.XXGHZ){
                return this.intParams[23]==1?60:this.intParams[23];
            }else if (this.wanfa == GameTypeEunmZP.XXPHZ){
                return this.intParams[23]==1?60:this.intParams[23];
            }else if (this.wanfa == GameTypeEunmZP.LSZP) {
                return this.intParams[12] == 1 ? 60 : this.intParams[12];
            }else if(this.wanfa == GameTypeEunmZP.YJGHZ || this.wanfa == GameTypeEunmZP.NXGHZ || this.wanfa == GameTypeEunmZP.YYWHZ){
                return this.intParams[8] == 1 ? 60 : this.intParams[8];
            }else if (this.wanfa == GameTypeEunmZP.ZZPH){
                return this.intParams[8]==1?60:this.intParams[8];
            }else if (this.wanfa == GameTypeEunmZP.XXEQS){
                return this.intParams[20]==1?60:this.intParams[20];
            }else if (this.wanfa == GameTypeEunmZP.NXPHZ){
                return this.intParams[23]==1?60:this.intParams[23];
            }else if (this.wanfa == GameTypeEunmZP.XPPHZ){
                return this.intParams[8]==1?60:this.intParams[8];
            }else if (this.wanfa == GameTypeEunmZP.YZLC) {
                return this.intParams[23] == 1 ? 60 : this.intParams[23];
            }else if(this.wanfa == GameTypeEunmZP.HHHGW || this.wanfa == GameTypeEunmZP.AXWMQ){
                return this.intParams[18]==1?60:this.intParams[18];
            }else{
                if (!this.intParams[23]){
                    this.intParams[23] = 60;
                }
                return  this.intParams[23]==1?60:this.intParams[23];
            }
        }else{
            return 30;
        }
    },

    getPlayerIsTuoguan:function(playerVo){

        if(this.wanfa == GameTypeEunmZP.YJGHZ||this.wanfa == GameTypeEunmZP.NXGHZ||this.wanfa == GameTypeEunmZP.YYWHZ)return playerVo.ext[0];

        return (this.wanfa==GameTypeEunmZP.LSZP||this.wanfa==GameTypeEunmZP.ZZPH)?playerVo.ext[3]:playerVo.ext[6];
    },

    isShowFinger:function(){
        if(this.nextSeat==this.mySeat&&this.selfAct.length==0){
            return true;
            //if(this.remain==19)
            //    return true;
            //var actions = [2,3,4,6,7];
            //if(ArrayUtil.indexOf(actions,this.currentAction)>=0)
            //    return true;
        }
        return false;
    },

    //isAAzhifu
    getCostFangShi:function(){
        cc.log("this.ext..." , this.ext);
        return this.ext[1];
    },

    //getQihuHuxi:function(){
    //    return this.ext[1];
    //},

    dealCard:function(message){
        this.cleanData();
        this.nextSeat = message.nextSeat;
        this.remain = message.remain;
        this.banker = message.banker;
        SyEventManager.dispatchEvent(SyEvent.START_PLAY,message);
    },

    /**
     * 出牌、碰牌、胡牌等操作
     * @param type
     * @param cardIds
     */
    sendPlayCardMsg:function(type,cardIds){
        var build = MsgHandler.getBuilder("proto/PlayCardReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var PlayCardReq = builder.build("PlayCardReq");
        var msg = new PlayCardReq();
        msg.cardIds = cardIds;
        msg.cardType = type;
        sySocket.send(msg,msgType);
    },

    isMoneyRoom:function(){
        //cc.log("this.tableType..." , this.tableType , this.tableId);
        return this.tableType == 3 || this.tableId >= 10000000;
    },

    isMatchRoom:function(){
        return this.tableType == 4;
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

    join:function(player){
        if(this.players.length>=PHZRoomModel.renshu)
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
            player.isRoladIcon = 0;
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
        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
    },

    simulateLetOutCard:function(id,curSortedData){
        var message = {"userId":PlayerModel.userId,"phzIds":[id],
            "action":0,"seat":this.mySeat,"selfAct":[],
            "fromSeat":null,"actType":2,"remain":(this.remain-1),
            "nextSeat":0,"huxi":null,"isZaiPao":null,simulate:1};
        //记录下出牌之前的手牌数据
        this.lastMineSortedJson = curSortedData;
        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
    },

    moPai:function(message){
        SyEventManager.dispatchEvent(SyEvent.GET_MAJIANG,message);
    },
    
    isShowFangZhao:function(c){//是否放招
        if(!this.getFangZhao(this.getPlayerVo())){
            var self = this;
            var str = "放招后不能吃牌、碰牌，是否确定放招？"
            if(PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ){
                str = "冲跑后不能吃牌、碰牌，是否确定冲跑？"
            }
            AlertPop.show(str,function(){
                sySocket.sendComReqMsg(24,[c]);
            },function(){
                //把打出去的牌还原回来，直接拿上一次的手牌数据来还原
                if(self.lastMineSortedJson){
                    self.nextSeat = self.mySeat;
                    if(PHZRoomModel.wanfa == GameTypeEunmZP.DYBP) {
                        DYBPMineLayout.restoreCard(self.lastMineSortedJson);
                        self.mineRoot.cancelFangZhao();
                        if (self.chibianParams.length > 0)
                            DYBPMineLayout.ChiBianChangeCards(self.chibianParams, 2);
                    }else if(PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ){
                        WCPHZMineLayout.restoreCard(self.lastMineSortedJson);
                        self.mineRoot.cancelFangZhao();
                        if (self.chibianParams.length > 0)
                            WCPHZMineLayout.ChiBianChangeCards(self.chibianParams, 2);
                    }else{
                        PHZMineLayout.restoreCard(self.lastMineSortedJson);
                        self.mineRoot.cancelFangZhao();
                        if(self.chibianParams.length > 0)
                            PHZMineLayout.ChiBianChangeCards(self.chibianParams,2);
                    }
                    self.isChiBianDaBian = false;
                }
            });
        }
    },

    isShowChongPao:function(){
        var self = this;
        AlertPop.showOnlyOk("只有听牌后才能打出这张牌",function(){
            //把打出去的牌还原回来，直接拿上一次的手牌数据来还原
            if(self.lastMineSortedJson) {
                self.nextSeat = self.mySeat;
                WCPHZMineLayout.restoreCard(self.lastMineSortedJson);
                self.mineRoot.cancelFangZhao();
                if (self.chibianParams.length > 0)
                    WCPHZMineLayout.ChiBianChangeCards(self.chibianParams, 2);
            }
        })

    },
    
    setFangZhao:function(message){
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == message.userId){
                p.ext[1] = message.fangzhao;
                SyEventManager.dispatchEvent(SyEvent.FANGZHAO,message);
            }
        }
    },
    
    getFangZhao:function(playerVo){//玩家是否没放招
        if (this.isMoneyRoom()){
            return false;
        }
        return (playerVo.ext[1]==1);
    },

    getFangZhu:function(playerVo){//玩家是不是房主
        if (this.isMoneyRoom()){
            return false;
        }

        if(PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ ||PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ ||PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            return false;
        }

        return (playerVo.ext[2]==1);
    },

    getName:function(wanfa){
        var str="";
        if(wanfa==GameTypeEunmZP.SYZP)
            str = "邵阳字牌";
        if(wanfa==GameTypeEunmZP.SYBP)
            str = "邵阳剥皮";
        if(wanfa==GameTypeEunmZP.DYBP)
            str = "大字剥皮";
        if(wanfa==GameTypeEunmZP.LDFPF){
            str = "娄底放炮罚";
            if (this.intParams[34] == 0) {
                str = str + " 不打鸟";
            }else if (this.intParams[34] == 1) {
                str = str + " 胡息打鸟";
            }else if (this.intParams[34] == 2) {
                str = str + " 打鸟" + this.intParams[35] +"分";
            }else if (this.intParams[34] == 3) {
                str = str + " 局内打鸟";
            }
        }

        if(wanfa == GameTypeEunmZP.CZZP){
            str = "郴州字牌";
            var huxi = this.intParams[11]==2?6:this.intParams[11]==3?3:9;
            var tunStr = " 3息一囤";
            if (this.intParams[10] == 2){
                tunStr = " 1息一囤";
            }
            var zhuanhuanStr = huxi + "息1囤起";
            if (this.intParams[12] == 2){
                zhuanhuanStr = huxi + "息" + huxi/3 + "囤起";
            }
            str = str + " " + zhuanhuanStr + tunStr;
            if (this.intParams[14] == 2){
                str = str + " 红黑点";
            }
            if (this.intParams[14] == 3){
                str = str + " 红黑点2倍";
            }
        }

        if(!str){
            str = ClubRecallDetailModel.getGameStr(wanfa);
        }

        return str;
    },

    //获取是否加倍
    isDouble:function(){
        return (this.ext[18] || false);
    },
    //获取加倍数
    getDoubleNum:function(){
        return (this.ext[20] || 0);
    },
    //获取小于多少分加倍
    getDScore:function(){
        return (this.ext[19] || 0);
    },


    setTouchCard:function(cardId){
        if (this.touchCardId != cardId){
            this.touchCardId = cardId;
        }
    },
    getTouchCard:function(){
        return this.touchCardId;
    },

    /**
     * 是不是这几种玩法之一
     */
    isSpecialWanfa:function(){

        var wanfaArr = [GameTypeEunmZP.XXGHZ,GameTypeEunmZP.XXPHZ,GameTypeEunmZP.XTPHZ,GameTypeEunmZP.AHPHZ
            ,GameTypeEunmZP.NXPHZ,GameTypeEunmZP.GLZP,GameTypeEunmZP.LDFPF,GameTypeEunmZP.SMPHZ,
            GameTypeEunmZP.HSPHZ,GameTypeEunmZP.CDPHZ,GameTypeEunmZP.XXEQS,GameTypeEunmZP.NXGHZ,
            GameTypeEunmZP.HHHGW,GameTypeEunmZP.DYBP,GameTypeEunmZP.WCPHZ,GameTypeEunmZP.AXWMQ];

        return ArrayUtil.indexOf(wanfaArr,this.wanfa) >= 0;

    },

    getCardsByString:function(strArr){
        var valArr = [];
        if(strArr && strArr != "") {
            var val = "";
            for (var i = 0; i < strArr.length; ++i) {
                if (strArr[i] == ',') {
                    valArr.push(parseInt(val));
                    val = "";
                    continue;
                }
                val += strArr[i];
                if (strArr[i + 1] == undefined) {//最后一位
                    valArr.push(parseInt(val));
                }
            }
        }
        return valArr;
    },

    //沅江鬼胡子的一些用到的方法
    setCurrentlyChiData: function(chiResult, lastId ) {
        this.currentlyChiData.length=0;
        var data = chiResult.data;
        for (var i = 0; i < data.length; i++) {
            var vo = data[i];
            for(var j=0;j<vo.length;j++) {
                if (vo[j].c == lastId) {
                    vo.splice(j, 1);
                    break;
                }
            }
            this.currentlyChiData.push(vo);
        }
    },

    cleanCurrentlyChiData:function(){
        this.currentlyChiData.length=0;
    },

    updateHasGuoedByChiData: function(recoverData) {
        if(recoverData)
            this.currentlyChiData = recoverData;
        for(var i=0;i<this.currentlyChiData.length;i++){
            this.hasGuoedByChiData.push(this.currentlyChiData[i]);
        }
    },

    getHasGuoedByChiData: function() {
        return this.hasGuoedByChiData;
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