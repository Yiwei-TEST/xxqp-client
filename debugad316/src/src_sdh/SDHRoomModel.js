/**
 * Created by cyp on 2019/6/21.
 */
var SDHTabelType = {
    CreateTable:"CreateTable",
    JoinTable:"JoinTable",
    ExitTable:"ExitTable",
    ChangeState:"ChangeState",
    ChangeOnLine:"ChangeOnLine",
    ChangeTuoGuan:"ChangeTuoGuan",
    DealCard:"DealCard",
    JiaoFen:"JiaoFen",
    DingZhuang:"DingZhuang",
    XuanZhu:"XuanZhu",
    XuanLiuShou:"XuanLiuShou",
    TouXiang:"TouXiang",
    PlayCard:"PlayCard",
    OnOver:"OnOver",
}

//key 牌的id,t：牌的类型 1-方块，2-梅花,3-红桃,4-黑桃
//v:牌的连续状态，用于判断拖拉机，2,7设置间隔2，用于正主加一判断
//i:牌的排序大小的值，正主加一百,用于判断排序
var SDHCardID = {
    //大小王
    502:{t:5,v:17,i:602}, 501:{t:5,v:16,i:601},

    407:{t:4,v:14,i:477},307:{t:3,v:14,i:457},207:{t:2,v:14,i:427},107:{t:1,v:14,i:407},
    415:{t:4,v:12,i:275},315:{t:3,v:12,i:255},215:{t:2,v:12,i:235},115:{t:1,v:12,i:215},

    414:{t:4,v:11,i:74},314:{t:3,v:11,i:54},214:{t:2,v:11,i:34},114:{t:1,v:11,i:14},
    413:{t:4,v:10,i:73},313:{t:3,v:10,i:53},213:{t:2,v:10,i:33},113:{t:1,v:10,i:13},
    412:{t:4,v:9,i:72},312:{t:3,v:9,i:52},212:{t:2,v:9,i:32},112:{t:1,v:9,i:12},
    411:{t:4,v:8,i:71},311:{t:3,v:8,i:51},211:{t:2,v:8,i:31},111:{t:1,v:8,i:11},
    410:{t:4,v:7,i:70},310:{t:3,v:7,i:50},210:{t:2,v:7,i:30},110:{t:1,v:7,i:10},
    409:{t:4,v:6,i:69},309:{t:3,v:6,i:49},209:{t:2,v:6,i:29},109:{t:1,v:6,i:9},
    408:{t:4,v:5,i:68},308:{t:3,v:5,i:48},208:{t:2,v:5,i:28},108:{t:1,v:5,i:8},
    406:{t:4,v:4,i:66},306:{t:3,v:4,i:46},206:{t:2,v:4,i:26},106:{t:1,v:4,i:6},
    405:{t:4,v:3,i:65},305:{t:3,v:3,i:45},205:{t:2,v:3,i:25},105:{t:1,v:3,i:5},
    404:{t:4,v:2,i:64},304:{t:3,v:2,i:44},204:{t:2,v:2,i:24},104:{t:1,v:2,i:4},
    403:{t:4,v:1,i:63},303:{t:3,v:1,i:43},203:{t:2,v:1,i:23},103:{t:1,v:1,i:3}
}

var SDHCardType = {
    Dan:1,//单牌
    Dui:2,//对子
    TuoLaji:3,//拖拉机
}
    
var SDHRoomModel = {
    init:function(message){
        this.wanfa = message.wanfa;
        this.renshu = message.renshu;
        this.tableId = message.tableId;
        this.roomName = message.roomName;
        this.nowBurCount = message.nowBurCount;
        this.totalBurCount = message.totalBurCount;
        this.players = message.players;
        this.creditConfig = message.creditConfig || [];
        this.creditXpkf = message.creditConfig[11] / 100;
        this.nextSeat = message.nextSeat;
        this.remain = message.remain;//用于标明牌桌当前阶段状态
        this.ext = message.ext;
        this.banker = message.ext[3] || 0;
        this.scoreCard = message.scoreCard || [];
        this.timeOut = message.timeOut || [];
        this.checkMySeat();

        this.intParams = message.intParams || [];//储存创房选择的玩法

        this.strParams = message.strParams || [];

        GoldRoomConfigModel.curClickRoomkeyId = message.goldRoomConfigId || 0;

        this.creditConfig = message.creditConfig || [];
        this.tableType = message.tableType;

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        this.selectZhu = message.ext[2] || 0;
        this.pauseValue = 0;//用于暂停处理消息

        this.replay = message.replay || false;//是否是回放
        this.isBiPai = false;//出牌是否闭了，用于播放音效的判断
        this.switchCoin = message.generalExt[1] || 0;//是否是金币房间
        this.privateRoom = message.strParams[4] || 0;//是否是私密房
    },

    isFzbHide:function(){
        return this.ext[17] == 1;
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


        return infoArr.join("\n");
    },

    isMatchRoom:function(){
        return this.tableType == 4;
    },

    getIsSwitchCoin:function(){
        return this.switchCoin == 1
    },

    //用于暂停服务器消息的处理,和removeOnePause成对使用
    pauseMsg:function(){
        this.pauseValue++;
    },

    removeOnePause:function(){
        if(this.pauseValue > 0){
            this.pauseValue--;
        }
    },

    handleTableData:function(type,data){
        var checkState = true;
        if(type == SDHTabelType.JoinTable){
            var newPlayer = data.player;
            checkState = false;
            if(this.players.length<SDHRoomModel.renshu){
                var isHas = false;
                for(var i=0;i<this.players.length;i++){
                    var p = this.players[i];
                    if(p.userId == newPlayer.userId){
                        isHas = true;
                        break;
                    }
                }
                if(!isHas){
                    checkState = true;
                    this.players.push(newPlayer);
                }
            }
        }else if(type == SDHTabelType.ExitTable){
            var player = null;
            var idx = 0;
            checkState = false;
            for(var i=0;i<this.players.length;i++){
                var p = this.players[i];
                if(p.userId == data){
                    player = p;
                    idx = i;
                    break;
                }
            }
            if(player){
                checkState = true;
                this.players.splice(idx,1);
            }
        }else if(type == SDHTabelType.ChangeState){
            var seat = data.params[0];
            for(var i=0;i<this.players.length;i++){
                var p = this.players[i];
                if(p.seat == seat){
                    p.status = 1;
                    break;
                }
            }
        }else if(type == SDHTabelType.ChangeOnLine) {
            var seat = data[0];
            for (var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.recover[0] = data[1];
                    break;
                }
            }
        }else if(type == SDHTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[3] = tuoguan;
                    break;
                }
            }
        }else if(type == SDHTabelType.DealCard){
            var p = this.getPlayerDataByItem("seat",this.mySeat);
            p.handCardIds = data.handCardIds;
            this.nextSeat = data.nextSeat;
            this.remain = data.remain;
            this.selectZhu = 0;

            //全部不要重新发牌要清理下叫分数据
            for(var i = 0;i<this.players.length;++i){
                this.players[i].ext[1] = -1;
            }

        }else if(type == SDHTabelType.JiaoFen){
            var parmas = data.params;
            if(parmas[0] > 0){
                this.ext[1] = parmas[0];
                this.ext[4] = parmas[1];
            }
            for(var i = 0;i<this.players.length;++i){
                if(this.players[i].seat == parmas[2]){
                    this.players[i].ext[1] = parmas[0];
                }
            }
            if(parmas[3] > 0)this.nextSeat = parmas[3];
        }else if(type == SDHTabelType.DingZhuang){
            var params = data.params;
            var strParams = data.strParams;
            this.nextSeat = strParams[0];
            this.remain = 2;
            this.banker = this.ext[3] = this.nextSeat;
            for(var i = 0;i<this.players.length;++i){
                if(this.players[i].seat == this.banker){
                    this.players[i].handCardIds = this.players[i].handCardIds.concat(params);
                    this.players[i].shiZhongCard = 1;//该轮第一个出牌
                }else{
                    this.players[i].shiZhongCard = 0;
                }
            }
        }else if(type == SDHTabelType.XuanZhu){
            this.selectZhu = this.ext[2] = data.params[0];
            this.remain = 3;
        }else if(type == SDHTabelType.XuanLiuShou){
            var seat = data.params[0];
            var huase = data.params[1];

            for(var i = 0;i<this.players.length;++i){
                if(this.players[i].seat == seat){
                    this.players[i].ext[4] = huase;
                }
            }

        }else if(type == SDHTabelType.PlayCard){
            this.nextSeat = data.nextSeat;
            if(data.cardType == 100){
                this.remain = 4;
            }else if(data.cardType == 200){//抠底消息

                this.ext[5] = data.curScore;//当前得分
                this.scoreCard = this.scoreCard.concat(data.scoreCard);
            }

            //报副状态
            //1000 座位号4报副，100 座位号3报副 ，10 座位号 2 报副 ,1 座位号1报副
            //同时报副相加
            var baofuArr = [0,0,0,0];
            var temp = data.isLet;
            for(var i = 3;i>=0;--i){
                if(temp - Math.pow(10,i) >= 0){
                    baofuArr[i] = 1;
                    temp = temp - Math.pow(10,i);
                }
            }

            if(data.cardType == 0){
                this.checkBiPai(data.cardIds);
            }

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];

                if(baofuArr[p.seat - 1]) p.ext[2] = 1;

                if(p.seat == data.seat){
                    p.handCardIds = this.delCardWithArr(p.handCardIds,data.cardIds);
                    if(data.cardType == 0){
                        p.outCardIds = data.cardIds;
                    }else if(data.cardType == 100){
                        p.moldIds = data.cardIds;//埋的底牌
                        p.shiZhongCard = 1;
                    }
                }
            }

            //一轮打完,设置玩家的第一个出牌的状态
            if(data.isClearDesk){
                this.ext[5] = data.curScore;//当前得分
                this.scoreCard = this.scoreCard.concat(data.scoreCard);

                var hasHandCards = true;
                for(var i = 0;i<this.players.length;++i){
                    var p = this.players[i];
                    p.outCardIds = [];//打完一轮清理出的牌
                    p.shiZhongCard = ((p.seat == data.nextSeat)?1:0);

                    if(p.seat == this.mySeat){
                        hasHandCards = p.handCardIds.length > 0;
                    }
                }

                if(!hasHandCards){//最后一个出牌，自己没有手牌了，改变下阶段状态
                    this.remain = 5;
                }
            }
        }else if(type == SDHTabelType.OnOver){
            this.remain = 0;
        }else if(type == "PiaoFen"){
            if(data.params[0] == 1){
                var temp = JSON.parse(data.strParams[0]);
                for(var i = 0;i<this.players.length;++i){
                    var p = this.players[i];
                    if(p.seat == temp.seat){
                        p.ext[6] = temp.piaofen;
                    }
                }
            }else if(data.params[0] == 0){
                this.remain = 8;
            }
        }

        return checkState;
    },

    checkBiPai:function(ids){
        var firstCards = this.getFirstCards();
        if(firstCards.length == 0){
            this.isBiPai = false;
            return;
        }
        if(this.hasZhuOrFu(firstCards) == 2){//首次出的是副牌
            if(this.hasZhuOrFu(ids) == 1){
                var data_my = this.checkCardsType(ids);
                var data_first = this.checkCardsType(firstCards);

                var type_num_my = 0
                var type_num_first = 0;

                for (var key in data_my) {
                    var arr_my = data_my[key];
                    if (arr_my.length == 1) {
                        type_num_my = arr_my[0].cards.length;
                        break;
                    }
                }
                for (var key in data_first) {
                    var arr_first = data_first[key];
                    if (arr_first.length == 1) {
                        type_num_first = arr_first[0].cards.length;
                        break;
                    }
                }

                this.isBiPai = (type_num_my > 0 && type_num_my == type_num_first);

            }else{
                this.isBiPai = false;
            }
        }else{
            this.isBiPai = false;
        }
    },

    delCardWithArr:function(arr1,arr2){
        for(var i = 0;i<arr2.length;++i){
            for(var j = 0;j<arr1.length;++j){
                if(arr2[i] == arr1[j]){
                    arr1.splice(j,1);
                    break;
                }
            }
        }
        return arr1;
    },

    //获取第一个人出的牌
    getFirstCards:function(){
        for(var i = 0;i<this.players.length;++i){
            var p = this.players[i];
            if(p.shiZhongCard == 1){
                return p.outCardIds;
            }
        }
        return [];
    },

    isFirstPlay:function(seat){
        seat = seat || this.mySeat;
        for(var i = 0;i<this.players.length;++i){
            var p = this.players[i];
            if(p.seat == seat && p.shiZhongCard == 1){
                return true;
            }
        }
        return false;
    },

    //获取得分的类型,大光，大倒这些
    getScoreType:function(jiaofen,defen){
        if(this.wanfa == GameTypeEunmPK.XTBP){
            return this.getXTBPScoreType(jiaofen,defen);
        }

        var type = 0;

        if(!jiaofen){
            jiaofen = SDHRoomModel.ext[1];
            defen = SDHRoomModel.ext[5];
        }

        if(jiaofen == 0)return 0;

        var xgScore = 30;
        if(SDHRoomModel.intParams[10] == 1)xgScore = 25;

        if(defen == 0)type = 3;
        else if(defen < jiaofen && defen < xgScore)type = 2;
        else if(defen < jiaofen)type = 1;


        if(defen - jiaofen >= 70){
            type = -3;
        } else if(defen - jiaofen >= 40){
            type = -2;
        } else if(defen - jiaofen >= 0){
            type = -1;
        }

        return type;
    },

    getXTBPScoreType:function(jiaofen,defen){
        var type = 0;

        if(!jiaofen){
            jiaofen = SDHRoomModel.ext[1];
            defen = SDHRoomModel.ext[5];
        }
        if(jiaofen == 0)return 0;

        var xgScore = 30;

        var zhuangFen = 200 - jiaofen;

        if(defen == 0)type = 3;
        else if(defen < zhuangFen && defen < xgScore)type = 2;
        else if(defen <= zhuangFen)type = 1;

        if(defen - zhuangFen >= 80){
            type = -3;
        } else if(defen - zhuangFen >= 40){
            type = -2;
        } else if(defen - zhuangFen > 0){
            type = -1;
        }

        return type;

    },

    //获取其他人是否都已报副
    getOtherIsBaoFu:function(){
        if(this.remain < 4)return false;

        var ret = true;
        for(var i = 0;i<this.players.length;++i){
            var p = this.players[i];
            if(p.seat != this.mySeat && p.ext[2] == 0){
                ret = false;
            }
        }
        return ret;
    },

    //是否要提示选择留守花色
    isSelectLiuShou:function() {
        //选了报副留守才需要提示
        if (this.intParams[4] != 1) return false;
        //庄家不需要
        if(this.banker == this.mySeat) return false;
        //不是在出牌阶段不需要
        if(this.remain != 4) return false;
        //没轮到自己出牌不需要
        if(this.nextSeat != this.mySeat) return false;

        var all_baofu = true;
        var has_select = false;
        for(var i  = 0;i<this.players.length;++i){
            var p = this.players[i];
            if(p.seat != this.banker){
                if(p.ext[2] != 1) all_baofu = false;
                if(p.seat == this.mySeat && p.ext[4] > 0) has_select = true;
            }
        }
        return all_baofu && !has_select;
    },

    getPlayerData:function(userId){
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

    getPlayerDataByItem:function(item,data){
        var player = null;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p[item] == data){
                player = p;
                break;
            }
        }
        return player;
    },

    checkMySeat:function(){
        this.mySeat = 1;
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].userId == PlayerModel.userId){
                this.mySeat = this.players[i].seat;
                break;
            }
        }
    },


    isZhuPai:function(id){
        var ret = false;
        if(id == 501 || id == 502)ret = true;
        if(id%100 == 15 || id%100 == 7)ret = true;
        if(Math.floor(id/100) == this.selectZhu)ret = true;
        return ret;
    },

    //是否是分牌
    isFenPai:function(id){
        return (id % 100 == 5) || (id % 100 == 10) || (id % 100 == 13);
    },

    //获取排序数字
    getOrderNum:function(id){
        var config = SDHCardID[id];

        var num = config.i;
        if(config.t == this.selectZhu){
            num += 100;
        }

        return num;
    },

    //获取连续状态数字
    getValueNum:function(id){
        var config = SDHCardID[id];
        var num = config.v;
        if(config.t == this.selectZhu && ((id%100 == 7) || (id%100 == 15))){
            num+= 1;
        }
        return num;
    },

    //获取底牌的数量
    getDiPaiNum:function(){
        var num = 8;
        if(this.renshu == 3){
            if((this.wanfa == GameTypeEunmPK.XTSDH && this.intParams[6] == 1)
                || this.wanfa == GameTypeEunmPK.XTBP){
                num = 9;
            }
        }

        return num;
    },

    //获取倒计时时间
    getCountTime:function(){
        var time = 30;

        if(this.timeOut[0] > 0){
            time = this.timeOut[0]/1000;
        }

        return time;
    },

    getSeqWithSeat:function(seat){
        var seqArr = [1,2,3,4];
        if(this.renshu == 3){
            seqArr = [1,2,4];
        }else if(this.renshu == 2){
            seqArr = [1,3];
        }
        var seq = seqArr[(seat - this.mySeat + this.renshu)%this.renshu] || 0;
        return seq;
    },

    getSeatWithSeq:function(seq){
        var seqArr = [1,2,3,4];
        if(this.renshu == 3){
            seqArr = [1,2,4];
        }else if(this.renshu == 2){
            seqArr = [1,3];
        }
        var idx = ArrayUtil.indexOf(seqArr,seq);
        var seat = 0;
        if(idx >= 0){
            seat = (this.mySeat + idx - 1)%this.renshu + 1;
        }
        return seat;
    },

    //根据id检测出牌型
    checkCardsType:function(ids){
        var retData = {0:[],1:[],2:[],3:[],4:[]};

        //按连续数从大到小排序
        var self = this;
        ids.sort(function(a,b){
            return self.getValueNum(b) - self.getValueNum(a);
        });

        //先把所有牌都当作单牌,分主副花色分类
        for(var i = 0;i<ids.length;++i){
            var data = {type:SDHCardType.Dan,cards:[ids[i]]};
            if(this.isZhuPai(ids[i])){
                retData[0].push(data);
            }else{
                retData[Math.floor(ids[i]/100)].push(data);
            }
        }

        //再从所有单牌中组合成对
        for(var key in retData){
            var typeArr = retData[key];
            var newArr = [];
            for(var i = 0;i<typeArr.length;++i){
                if(i+1 < typeArr.length && typeArr[i].cards[0] == typeArr[i+1].cards[0]){
                    var data = {type:SDHCardType.Dui,cards:[typeArr[i].cards[0],typeArr[i+1].cards[0]]};
                    newArr.push(data);
                    i++;
                }else{
                    newArr.push(typeArr[i]);
                }
            }
            retData[key] = newArr;
        }

        //再从所有对子中组合成连对
        for(var key in retData){
            var typeArr = retData[key];
            var newArr = [];
            for(var i = 0;i<typeArr.length;++i){
                if(typeArr[i].type == SDHCardType.Dan){
                    newArr.push(typeArr[i]);
                }else{

                    if(newArr.length > 0){
                        var last = newArr[newArr.length - 1];
                        if(last.type == SDHCardType.Dui || last.type == SDHCardType.TuoLaji){

                            var v1 = this.getValueNum(last.cards[last.cards.length - 1]);
                            var v2 = this.getValueNum(typeArr[i].cards[0]);

                            //新田包牌58连对算拖拉机
                            if (v1 - v2 == 1 || (this.wanfa == GameTypeEunmPK.XTBP && v1 == 5 && v2 == 3)
                                || (this.wanfa == GameTypeEunmPK.XTSDH && v1 == 5 && v2 == 3 && SDHRoomModel.intParams[6] == 1)) {
                                last.type = SDHCardType.TuoLaji;
                                last.cards.push(typeArr[i].cards[0]);
                                last.cards.push(typeArr[i].cards[1]);
                            } else {
                                newArr.push(typeArr[i]);
                            }

                        }else{
                            newArr.push(typeArr[i]);
                        }
                    }else{
                        newArr.push(typeArr[i]);
                    }
                }
            }
            retData[key] = newArr;
        }

        //按拖拉机，对子，单牌，类型排序（拖拉机牌数多的放前面）
        for(var key in retData){
            var arr = retData[key];

            arr.sort(function(a,b){
                return b.cards.length - a.cards.length;
            });
        }

        return retData;
    },

    //检查首个出牌是否符合规则
    checkFirstPlay:function(ids,baofu){
        //单牌
        if(ids.length == 1)return true;
        //对子
        if(this.isDuizi(ids))return true;

        //拖拉机
        if(this.isTuolaji(ids))return true;

        //其他人都报副,可以甩主牌
        if(baofu && this.hasZhuOrFu(ids) == 1)return true;

        return false;
    },

    //检查跟牌是否符合规则
    checkSecondPlay:function(ids,firstCards){
        if(ids.length != firstCards.length)return false;

        var canPlay = true;

        var p = this.getPlayerDataByItem("seat",this.mySeat);
        if(p && p.handCardIds.length > 0){


        }


        return canPlay;
    },

    //判断是否是拖拉机牌型
    isTuolaji:function(ids){
        var data = this.checkCardsType(ids);
        var typeNum = 0;
        var hasTuoLaji = false;
        for(var key in data){
            var arr = data[key];
            for(var i = 0;i<arr.length;++i){
                typeNum++
                if(arr[i].type == SDHCardType.TuoLaji){
                    hasTuoLaji = true;
                }
            }
        }

        return (hasTuoLaji && typeNum == 1);

    },

    isDuizi:function(ids){
        if(ids.length == 2 && ids[0] == ids[1]){
            return true;
        }else{
            return false;
        }
    },

    //判断牌主和副混合状态
    hasZhuOrFu:function(ids){
        var hasZhu = false;
        var hasFu = false;
        for(var i = 0;i<ids.length;++i){
            if(this.isZhuPai(ids[i])){
                hasZhu = true;
            }else{
                hasFu = true;
            }
        }
        var ret = 0;
        if(hasZhu && !hasFu)ret = 1;
        if(!hasZhu && hasFu)ret = 2;
        if(hasZhu && hasFu)ret = 3;
        return ret;
    },

    //处理自己跟牌的的可出状态
    handCardsCanPlay:function(handCardIds,firstCards){
        var retObj = {};
        for(var i = 0;i<handCardIds.length;++i){
            retObj[handCardIds[i]] = 0;
        }


        var data_my = this.checkCardsType(handCardIds);
        var data_other = this.checkCardsType(firstCards);

        for (var key in data_other) {
            var arr_other = data_other[key];
            var arr_my = data_my[key];

            if (arr_other.length > 0) {

                var num_other = 0;
                var num_deal = 0;

                var allArr = [];
                for(t = 0;t<arr_my.length;++t){
                    for(var j = 0;j<arr_my[t].cards.length;++j){
                        allArr.push(arr_my[t].cards[j]);
                    }
                }

                //按顺序添加必须出的牌型
                var needArr = [];

                var i = 0;
                var upType = 0;
                for(var t = 0;t<arr_other.length;++t){
                    num_other += arr_other[t].cards.length;

                    if(arr_other[t].type == SDHCardType.Dan)continue;

                    num_deal += arr_other[t].cards.length;

                    for(;i<arr_my.length;++i){
                        if((arr_my[i].cards.length >= arr_other[t].cards.length)
                            || (needArr.length < num_deal && arr_my[i].type != SDHCardType.Dan)
                            || (needArr.length >= num_deal && arr_my[i].type != SDHCardType.Dan && arr_my[i].type == upType)){

                            upType = arr_my[i].type;
                            for(var j = 0;j<arr_my[i].cards.length;++j){
                                needArr.push(arr_my[i].cards[j]);
                            }
                        }else{
                            break;
                        }
                    }
                }

                if(allArr.length < num_other){//自己该类型牌不够,全部必选，其他可选
                    for(var i = 0;i<allArr.length;++i){
                        retObj[allArr[i]] = 1;
                    }

                }else{
                    //自己该类型牌够了，其他类型牌不可选
                    for(var id in retObj){
                        retObj[id] = -1;
                    }

                    var state_all = 0;
                    //需要出的牌数多，且没有单牌，该类型牌先设置不可选
                    if(needArr.length > num_other && num_deal == num_other){
                        state_all = -1;
                    }
                    for (var i = 0; i < allArr.length; ++i) {
                        retObj[allArr[i]] = state_all;
                    }

                    if(allArr.length > num_other){//排除该类型牌数量和出牌数量相等的情况
                        var state_need = 0;
                        //拖拉机和对子牌数量不够，或者刚好够，设置必选
                        if(needArr.length <= num_deal){
                            state_need = 1;
                        }
                        for (var i = 0; i < needArr.length; ++i) {
                            retObj[needArr[i]] = state_need;
                        }
                    }
                }

                break;
            }
        }
        return retObj;
    },

    /**
     * 出牌等操作
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

    isCreditRoom:function(){
        return this.creditConfig && this.creditConfig[0];
    },

    getCreditConfigStr:function(){
        var str = "";

        if(this.creditConfig[0]){
            var difen = this.creditConfig[3];
            var giveNum = this.creditConfig[4];
            var giveType = this.creditConfig[5];
            var giveWay = this.creditConfig[6];
            var isDivide = this.creditConfig[8];

            difen = MathUtil.toDecimal(isDivide?(difen/100):difen);
            giveNum = MathUtil.toDecimal(isDivide?(giveNum/100):giveNum);

            str += ("底分:" + difen + "\n");
            str += ("赠送分:" + giveNum + (giveType == 1?"":"%") + "\n");
            str += ("赠送方式:" + (giveWay == 1?(this.creditConfig[12] && this.creditConfig[12] != 0 ?"AA赠送":"大赢家"):"所有赢家") + "\n");
            str += ("赠送类型:" + (giveType == 1?(this.creditConfig[12] && this.creditConfig[12] != 0 ?"":"固定赠送"):"比例赠送"));

        }

        return str;
    },

    //玩家的房内头像是否已经绘制完全
    isRoomIconRoad: function() {
        return true;
    },

    getRoomLayerById:function(){

        if(this.wanfa == GameTypeEunmPK.XTBP){
            return XTBPRoomLayer;
        }

        return SDHRoomLayer;
    },

    getSamllResultLayer:function(){

        if(this.wanfa == GameTypeEunmPK.XTBP){
            return XTBPSmallResultLayer;
        }

        return SDHSmallResultLayer;
    },

    getBigResultLayer:function(){

        if(this.wanfa == GameTypeEunmPK.XTBP){
            return XTBPBigResultLayer;
        }

        return SDHBigResultLayer;
    },
};