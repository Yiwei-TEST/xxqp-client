/**
 * Created by cyp on 2019/10/21.
 */

//一样的消息保持和三打哈一致，就不需要额外添加消息推送了
var DTTabelType = {
    CreateTable:"CreateTable",
    JoinTable:"JoinTable",
    ExitTable:"ExitTable",
    ChangeState:"ChangeState",
    ChangeOnLine:"ChangeOnLine",
    ChangeTuoGuan:"ChangeTuoGuan",
    DealCard:"DealCard",
    XuanDuZhan:"XuanDuZhan",
    FenZu:"FenZu",
    PlayCard:"PlayCard",
    ShowTeamCard:"ShowTeamCard",//看队友牌
    BaoWang:"BaoWang",//出单报王
    OnOver:"OnOver",
}

//key 牌的id,t：牌的类型 1-方块，2-梅花,3-红桃,4-黑桃
//v:单牌大小顺序
var DTCardID = {
    //大小王
    502:{t:5,v:17}, 501:{t:5,v:16},

    415:{t:4,v:15},315:{t:3,v:15},215:{t:2,v:15},115:{t:1,v:15},
    414:{t:4,v:14},314:{t:3,v:14},214:{t:2,v:14},114:{t:1,v:14},
    413:{t:4,v:13},313:{t:3,v:13},213:{t:2,v:13},113:{t:1,v:13},
    412:{t:4,v:12},312:{t:3,v:12},212:{t:2,v:12},112:{t:1,v:12},
    411:{t:4,v:11},311:{t:3,v:11},211:{t:2,v:11},111:{t:1,v:11},
    410:{t:4,v:10},310:{t:3,v:10},210:{t:2,v:10},110:{t:1,v:10},
    409:{t:4,v:9},309:{t:3,v:9},209:{t:2,v:9},109:{t:1,v:9},
    408:{t:4,v:8},308:{t:3,v:8},208:{t:2,v:8},108:{t:1,v:8},
    407:{t:4,v:7},307:{t:3,v:7},207:{t:2,v:7},107:{t:1,v:7},
    406:{t:4,v:6},306:{t:3,v:6},206:{t:2,v:6},106:{t:1,v:6},
    405:{t:4,v:5},305:{t:3,v:5},205:{t:2,v:5},105:{t:1,v:5},
    404:{t:4,v:4},304:{t:3,v:4},204:{t:2,v:4},104:{t:1,v:4},
    403:{t:4,v:3},303:{t:3,v:3},203:{t:2,v:3},103:{t:1,v:3}
}

var DTCardType = {
    DanZhang:1,//单牌
    DuiZi:2,//对子
    LianDui:3,//连对
    ShunZi:4,//顺子
    SanZhang:5,//三张
    SanDaiYi:6,//三带一
    SanDaiEr:7,//三带二
    FeiJi:8,//飞机
    WuShiK:9,//五十K
    ZhaDan:10,//炸弹
    TianZha:11,//天炸
}

var DTRoomModel = {
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
        this.banker = message.ext[1] || 0;//独战座位号
        this.scoreCard = message.scoreCard || [];
        this.timeOut = message.timeOut || [];
        this.checkMySeat();

        this.intParams = message.intParams || [];//储存创房选择的玩法

        this.creditConfig = message.creditConfig || [];
        this.tableType = message.tableType;

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        this.showDuiCard = message.showRenew || 0;//显示确认队伍的那张牌

        this.pauseValue = 0;//用于暂停处理消息

        this.paixuType = this.paixuType || 2;//手牌排序类型

        this.replay = message.replay || false;//是否是回放

        if(this.replay){
            this.paixuType = 1;
        }
        this.switchCoin = message.generalExt[1] || 0;//是否是金币房间
        this.privateRoom = message.strParams[4] || 0;//是否是私密房
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
        if(type == DTTabelType.JoinTable){
            var newPlayer = data.player;
            checkState = false;
            if(this.players.length<DTRoomModel.renshu){
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
        }else if(type == DTTabelType.ExitTable){
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
        }else if(type == DTTabelType.ChangeState){
            var seat = data.params[0];
            for(var i=0;i<this.players.length;i++){
                var p = this.players[i];
                if(p.seat == seat){
                    p.status = 1;
                    break;
                }
            }
        }else if(type == DTTabelType.ChangeOnLine) {
            var seat = data[0];
            for (var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.recover[0] = data[1];
                    break;
                }
            }
        }else if(type == DTTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[3] = tuoguan;
                    break;
                }
            }
        }else if(type == DTTabelType.DealCard) {
            var p = this.getPlayerDataByItem("seat", this.mySeat);
            p.handCardIds = data.handCardIds;
            this.nextSeat = data.nextSeat;
            this.remain = data.remain;

            for(var i = 0;i<this.players.length;++i){
                //发牌后的剩余牌数量
                this.players[i].ext[8] = data.handCardIds.length;
            }

        }else if(type == DTTabelType.XuanDuZhan) {

            this.nextSeat = data.params[2];
            if (data.params[1] == 1) {
                this.remain = 2;
                this.banker = this.ext[1] = data.params[0];
            }
        }else if(type == DTTabelType.FenZu){
            this.remain = 2;
            var teamArr = JSON.parse(data.strParams[0]);
            var config = {};
            for(var i = 0;i<teamArr.length;++i){
                config[teamArr[i].seat] = teamArr[i].team;
            }
            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if(config[p.seat]){
                    p.ext[6] = config[p.seat];
                }
            }

        }else if(type == DTTabelType.PlayCard) {
            this.nextSeat = data.nextSeat;
            this.ext[3] = data.curScore;//牌桌分

            var chuTeam = 0;
            for (var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];

                if (p.seat == data.seat) {
                    p.handCardIds = this.delCardWithArr(p.handCardIds, data.cardIds);
                    p.outCardIds = data.cardIds;
                    p.outedIds = [];//用于显示报王，操作后清掉
                    p.ext[5] = data.cardType;
                    p.ext[1] += data.isLet;//炸弹喜分
                    if (data.isBt > 0)p.ext[7] = data.isBt;//上游，二游，三游，四游
                    if (data.cardType == 0) {
                        p.ext[8] -= data.cardIds.length;//剩余牌数
                    }
                    chuTeam = p.ext[6];
                } else if (data.cardType == 0) {
                    p.outCardIds = [];//有人出牌，清理掉其他人的出牌数据
                    p.ext[5] = 0;

                    if(data.isLet > 0){
                        if(this.renshu == 2){
                            p.ext[1] -= data.isLet;
                        }else{
                            p.ext[1] -= data.isLet/3;
                        }
                    }
                }
            }

            //队友出牌，看队友牌的人删除相应显示的牌
            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if(chuTeam == p.ext[6] && p.moldIds.length > 0){
                    p.moldIds = this.delCardWithArr(p.moldIds, data.cardIds);
                }
            }

            if (data.isBt == 3) {//第三个人出完牌，给下游赋值
                for (var i = 0; i < this.players.length; ++i) {
                    var p = this.players[i];
                    if (!p.ext[7])p.ext[7] = 4;
                }
            }

            if (data.isClearDesk) {
                var fenzu = 0;
                for (var i = 0; i < this.players.length; ++i) {
                    var p = this.players[i];
                    p.outCardIds = [];//打完一轮清理出的牌
                    if (p.seat == data.nextSeat) {
                        p.ext[2] += data.curScore;//吃分
                        fenzu = p.ext[6];
                    }
                }
                for (var i = 0; i < this.players.length; ++i) {
                    var p = this.players[i];
                    if (p.ext[6] == fenzu) {
                        p.ext[4] += data.curScore;//分组总分
                    }
                }

                this.ext[3] = 0;//清掉一轮积累的牌桌分
            }
        }else if(type == DTTabelType.ShowTeamCard) {
            for (var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == this.mySeat) {
                    p.moldIds = data.params || [];
                }
            }
        }else if(type == DTTabelType.BaoWang){

            var baoWangArr = JSON.parse(data.strParams[0]);
            var config = {};
            for(var i = 0;i<baoWangArr.length;++i){
                config[baoWangArr[i].seat] = baoWangArr[i].cards;
            }
            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if(config[p.seat]){
                    p.outedIds = config[p.seat];
                }
            }

        }else if(type == DTTabelType.OnOver){
            this.remain = 0;
        }

        return checkState;
    },

    //获取桌面上最有一个出的牌
    getDeskCards:function(){
        for(var i = 0;i<this.players.length;++i){
            var p = this.players[i];
            if(p.seat != this.mySeat && p.outCardIds.length > 0){
                return p.outCardIds;
            }
        }
        return null;
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

    //获取排序数字
    getOrderNum:function(id){
        return DTCardID[id].v;
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
        }
        if(this.renshu == 2){
            seqArr = [1,3];
        }
        var seq = seqArr[(seat - this.mySeat + this.renshu)%this.renshu] || 0;
        return seq;
    },

    getSeatWithSeq:function(seq){
        var seqArr = [1,2,3,4];
        if(this.renshu == 3){
            seqArr = [1,2,4];
        }
        if(this.renshu == 2){
            seqArr = [1,3];
        }
        var idx = ArrayUtil.indexOf(seqArr,seq);
        var seat = 0;
        if(idx >= 0){
            seat = (this.mySeat + idx - 1)%this.renshu + 1;
        }
        return seat;
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

    //比较第二个牌型是否比第一个牌型大
    isCardTypeBig:function(typeData1,typeData2){
        if(typeData1.type == 0 || typeData2.type == 0)return false;
        //天炸最大
        if(typeData2.type == DTCardType.TianZha)return true;

        if(typeData2.type == DTCardType.ZhaDan){
            //炸弹比普通牌型和五十K大
            if(typeData1.type < DTCardType.ZhaDan)return true;

            if(typeData1.type == DTCardType.ZhaDan){
                //炸弹之间比较个数
                if(typeData2.flag > typeData1.flag)return true;
                //个数相同比较牌值大小
                if(typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv)return true;
            }

        }

        if(typeData2.type == DTCardType.WuShiK){
            //五十K比普通牌型大
            if(typeData1.type < DTCardType.WuShiK)return true;

            if(typeData1.type == DTCardType.WuShiK){
                //正五十K比花五十K大
                if(typeData2.flag > typeData1.flag)return true;
                //正五十K之间分花色
                if(DTRoomModel.intParams[10] == 1 && typeData2.flag == 2
                    && typeData1.flag == 2 && typeData2.ft > typeData1.ft){
                    return true;
                }
            }
        }

        //牌型相同比牌值大小
        if(typeData2.type == typeData1.type && typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv){
            return true;
        }

        //勾选了仅最后三张和飞机可少带
        if(DTRoomModel.intParams[11] == 1 && typeData2.fv > typeData1.fv){
            //牌值大，三带几张不限牌型
            if((typeData1.type == DTCardType.SanZhang || typeData1.type == DTCardType.SanDaiYi || typeData1.type == DTCardType.SanDaiEr)
                && (typeData2.type == DTCardType.SanZhang || typeData2.type == DTCardType.SanDaiYi || typeData2.type == DTCardType.SanDaiEr)){
                return true;
            }
        }

        return false;
    },

    getCardTypeData:function(ids){
        this.sortIdByNum(ids);

        var data = {type:0,flag:0,fv:0};
        //flag:保存牌型的数量类型
        //fv:保存判断相同牌型大小的最大值

        if(ids.length == 1){
            data.type = DTCardType.DanZhang;
            data.fv = DTCardID[ids[0]].v;
        } else if(ids.length == 2){
            if(DTCardID[ids[0]].v == DTCardID[ids[1]].v){
                data.type = DTCardType.DuiZi;
                data.fv = DTCardID[ids[0]].v;
            }
        }else if(ids.length == 3){
            var cfg1 = DTCardID[ids[0]];
            var cfg2 = DTCardID[ids[1]];
            var cfg3 = DTCardID[ids[2]];

            if(cfg1.v == cfg2.v && cfg1.v == cfg3.v){
                data.type = DTCardType.SanZhang;
                data.fv = DTCardID[ids[0]].v;
            }else if(cfg1.v == 13 && cfg2.v == 10 && cfg3.v == 5){
                data.type = DTCardType.WuShiK;
                data.flag = 1;//花五十K
                if(cfg1.t == cfg2.t && cfg1.t == cfg3.t){
                    data.flag = 2;//正五十K
                    data.ft = cfg1.t;
                }
            }
        }else if(ids.length >= 4){

            do{

                if(ids.length == 4 && ids[0] == 502 && ids[1] == 502 && ids[2] == 501 && ids[3] == 501){
                    data.type = DTCardType.TianZha;
                    break;
                }

                var isShunZi = true;
                if(ids.length >= 5){
                    for(var i = 0;i<ids.length - 1;++i){
                        var v1 = DTCardID[ids[i]].v;
                        var v2 = DTCardID[ids[i+1]].v;
                        if(v1 - v2 != 1 || v1 > 14 || v2 > 14){//大王，小王，2不能出现在顺子
                            isShunZi = false;
                            break;
                        }
                    }
                }else{
                    isShunZi = false;
                }

                if(isShunZi){
                    data.type = DTCardType.ShunZi;
                    data.flag = ids.length;
                    data.fv = DTCardID[ids[0]].v;
                    break;
                }

                var isLianDui = true;
                if(ids.length % 2 == 0){
                    for(var i = 1;i<ids.length;i+=2){
                        var v1 = DTCardID[ids[i-1]].v;
                        var v2 = DTCardID[ids[i]].v;
                        if(v1 != v2 || v1 > 14 || v2 > 14){//大王，小王，2不能出现在连对
                            isLianDui = false;
                            break;
                        }
                        if(i+1 < ids.length){
                            var v3 = DTCardID[ids[i+1]].v;
                            if((v2 - v3 != 1) || v3 > 14){
                                isLianDui = false;
                                break;
                            }
                        }
                    }
                }else{
                    isLianDui = false;
                }

                if(isLianDui){
                    data.type = DTCardType.LianDui;
                    data.flag = ids.length/2;
                    data.fv = DTCardID[ids[0]].v;
                    break;
                }

                var equalNum = 1;
                for(var i = 1;i<ids.length;++i){
                    var v1 = DTCardID[ids[i-1]].v;
                    var v2 = DTCardID[ids[i]].v;
                    if(v2 == v1)equalNum++;
                    else break;
                }
                if(equalNum == 3){
                    if(ids.length == 4){
                        data.type = DTCardType.SanDaiYi;
                        data.fv = DTCardID[ids[0]].v;
                        break;
                    } else if(ids.length == 5){
                        data.type = DTCardType.SanDaiEr;
                        data.fv = DTCardID[ids[0]].v;
                        break;
                    }
                }else if(equalNum == ids.length){
                    data.type = DTCardType.ZhaDan;
                    data.flag = ids.length;
                    data.fv = DTCardID[ids[0]].v;
                    break;
                }else if(equalNum >= 4){//判断是否炸弹带王的情况

                    var isDaiWang = true;
                    for(var i = equalNum;i<ids.length;++i){
                        if(DTCardID[ids[i]].t != 5){
                            isDaiWang = false;
                            break;
                        }
                    }

                    //炸弹不带王选项
                    if(isDaiWang && DTRoomModel.intParams[12] != 1){
                        data.type = DTCardType.ZhaDan;
                        data.flag = ids.length;
                        data.fv = DTCardID[ids[0]].v;
                        data.daiWang = ids.length - equalNum;
                        break;
                    }

                    //如果不是带王，4带一可当成三带二
                    if(equalNum == 4 && ids.length == 5){
                        data.type = DTCardType.SanDaiEr;
                        data.fv = DTCardID[ids[0]].v;
                        break;
                    }

                }

                var isFeiji = true;
                if(ids.length >= 6){

                    var cardNumData = this.getCardNumData(ids);
                    var sanZhangNum = 0;
                    var numArr = [];
                    var tempk = 0;
                    var fvArr = [];
                    for(var k = 3;k<15;++k){
                        if(cardNumData[k] >= 3){
                            if(k - tempk == 1 || tempk == 0){
                                sanZhangNum++;
                            }else{
                                numArr.push(sanZhangNum);
                                fvArr.push(tempk);
                                sanZhangNum = 1;
                            }
                            tempk = k;
                        }
                    }
                    var fv = tempk;
                    //选取一个连续三张最多的
                    for(var i = 0;i<numArr.length;++i){
                        if(numArr[i] > sanZhangNum){
                            sanZhangNum = numArr[i];
                            fv = fvArr[i];
                        }
                    }

                    //连续两个三张且每个三张最多带两个
                    if((sanZhangNum >= 2 && sanZhangNum*5 >= ids.length)){
                        isFeiji = true;
                    }else{
                        isFeiji = false;
                    }

                    //连续三张超出的可以当作带的牌处理
                    for(var t = 2;t < sanZhangNum;++t){
                        if(t*5 == ids.length || t*4 == ids.length || t*3 == ids.length){
                            isFeiji = true;
                            sanZhangNum = t;
                            break;
                        }
                    }

                }else{
                    isFeiji = false;
                }

                if(isFeiji){
                    data.type = DTCardType.FeiJi;
                    data.flag = sanZhangNum;
                    data.daiNum = ids.length - sanZhangNum*3;
                    data.fv = fv;
                    break;
                }

            } while(0);


        }

        return data;
    },

    //获取提示出牌数据
    getTipCardsData:function(chuIds,handIds){
        var chuTypeData = this.getCardTypeData(chuIds);

        if(chuTypeData.type == 0)return null;

        var tipData = null;
        if(chuTypeData.type == DTCardType.DanZhang){
            tipData = this.getDanZhangTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == DTCardType.DuiZi){
            tipData = this.getDuiZiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == DTCardType.LianDui){
            tipData = this.getLianDuiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == DTCardType.ShunZi){
            tipData = this.getShunZiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == DTCardType.SanZhang
            || chuTypeData.type == DTCardType.SanDaiYi
            || chuTypeData.type == DTCardType.SanDaiEr){

            tipData = this.getSanDaiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == DTCardType.FeiJi){
            tipData = this.getFeijiTipCard(chuTypeData,handIds,chuIds);
        }
        if(!tipData && chuTypeData.type <= DTCardType.WuShiK){
            tipData = this.getWuShiKTipCard(chuTypeData,handIds,chuIds);
        }
        if(!tipData && chuTypeData.type <= DTCardType.ZhaDan){
            tipData = this.getZhaDanTipCard(chuTypeData,handIds);
        }

        return tipData;
    },

    getDanZhangTipCard:function(chuTypeData,handIds){
        if(handIds.length <= 0)return null;

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length;++i){
            var v = DTCardID[handIds[i]].v;
            if(v > chuTypeData.fv){
                return [handIds[i]];
            }
        }
        return null;
    },

    getDuiZiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 2)return null;

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length - 1;++i){
            var v1 = DTCardID[handIds[i]].v;
            var v2 = DTCardID[handIds[i+1]].v;
            if(v1 == v2 && v1 > chuTypeData.fv){
                return [handIds[i],handIds[i+1]];
            }
        }
        return null;
    },

    getLianDuiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 4)return null;

        this.sortIdByValue(handIds);
        handIds.reverse();
        var lianduiArr = [];
        for(var i = 0;i<handIds.length - 1;++i){
            var v1 = DTCardID[handIds[i]].v;
            var v2 = DTCardID[handIds[i+1]].v;

            if(lianduiArr.length > 0){
                var lastV = DTCardID[lianduiArr[lianduiArr.length - 1]].v;
                if(v1 == lastV)continue;
                if(v1 - lastV != 1){
                    lianduiArr = [];
                }
            }

            if(v1 == v2 && v1 < 15){

                lianduiArr.push(handIds[i]);
                lianduiArr.push(handIds[i+1]);

                if(v1 > chuTypeData.fv && lianduiArr.length >= chuTypeData.flag*2){
                    return lianduiArr.slice(-chuTypeData.flag*2);
                }

                i++;
            }else{
                lianduiArr = [];
            }
        }
        return null;
    },

    getShunZiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 5)return null;

        this.sortIdByValue(handIds);
        handIds.reverse();
        var shunziArr = [];
        for(var i = 0;i<handIds.length;++i){
            var v1 = DTCardID[handIds[i]].v;
            if(v1 < 15){
                if(shunziArr.length > 0){
                    var lastV = DTCardID[shunziArr[shunziArr.length - 1]].v;
                    if(v1 == lastV)continue;
                    if(v1 - lastV != 1){
                        shunziArr = [];
                    }
                }

                shunziArr.push(handIds[i]);

                if(v1 > chuTypeData.fv && shunziArr.length >= chuTypeData.flag){
                    return shunziArr.slice(-chuTypeData.flag);
                }
            }else{
                shunziArr = [];
            }
        }
        return null;
    },

    getSanDaiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 3)return null;

        this.sortIdByNum(handIds);
        handIds.reverse();
        var tipArr = [];
        var daiArr = [];
        for(var i = 0;i<handIds.length;++i){
            var v1 = DTCardID[handIds[i]].v;

            var v2 = 0;var v3 = 0;
            if(i+1<handIds.length)v2 = DTCardID[handIds[i+1]].v;
            if(i+2<handIds.length)v3 = DTCardID[handIds[i+2]].v;

            if(v1 == v2 && v1 == v3 && v1 > chuTypeData.fv && tipArr.length == 0){
                tipArr = [handIds[i],handIds[i+1],handIds[i+2]];
                i+=2;
            }else if(daiArr.length < 2){
                daiArr.push(handIds[i]);
            }
        }

        if(tipArr.length > 0){
            for(var i = 0;i<daiArr.length;++i){
                if(DTRoomModel.intParams[11] == 1){
                    if(i==2)break;
                }else{
                    if(chuTypeData.type == DTCardType.SanZhang && i==0)break;
                    if(chuTypeData.type == DTCardType.SanDaiYi && i==1)break;
                    if(chuTypeData.type == DTCardType.SanDaiEr && i==2)break;
                }
                tipArr.push(daiArr[i]);
            }

            if(DTRoomModel.intParams[11] == 1) {
                return tipArr;
            }else{
                if (chuTypeData.type == DTCardType.SanZhang && tipArr.length == 3)return tipArr;
                if (chuTypeData.type == DTCardType.SanDaiYi && tipArr.length == 4)return tipArr;
                if (chuTypeData.type == DTCardType.SanDaiEr && tipArr.length == 5)return tipArr;
            }
        }
        return null;
    },

    getFeijiTipCard:function(chuTypeData,handIds,chuIds){
        if(handIds.length < 6)return null;

        this.sortIdByValue(handIds);
        handIds.reverse();
        var feijiArr = [];
        var tipArr = [];
        for(var i = 0;i<handIds.length - 2;++i){
            var v1 = DTCardID[handIds[i]].v;
            var v2 = DTCardID[handIds[i+1]].v;
            var v3 = DTCardID[handIds[i+2]].v;

            if(feijiArr.length > 0){
                var lastV = DTCardID[feijiArr[feijiArr.length - 1]].v;
                if(v1 == lastV)continue;
                if(v1 - lastV != 1){
                    feijiArr = [];
                }
            }

            if(v1 == v2 && v1 == v3 && v1 < 15){

                feijiArr.push(handIds[i]);
                feijiArr.push(handIds[i+1]);
                feijiArr.push(handIds[i+2]);

                if(v1 > chuTypeData.fv && feijiArr.length >= chuTypeData.flag*3){
                    tipArr = feijiArr.slice(-chuTypeData.flag*3);
                }

                i+=2;
            }else{
                feijiArr = [];
            }
        }

        if(tipArr.length > 0){
            var daiArr = [];
            var j = 0;
            for(var i = 0;i<handIds.length;++i){
                if(j < tipArr.length && tipArr[j] == handIds[i]){
                    j++;
                } else {
                    daiArr.push(handIds[i]);
                }

            }
            if(daiArr.length > 0){
                this.sortIdByNum(daiArr);
                daiArr.reverse();

                var daiNum = chuIds.length - tipArr.length;

                //飞机可能少带
                if(daiNum > 0 && daiNum < chuTypeData.flag){
                    daiNum = chuTypeData.flag;
                } else if(daiNum > chuTypeData.flag && daiNum < chuTypeData.flag*2){
                    daiNum = chuTypeData.flag*2;
                }

                if(DTRoomModel.intParams[11] == 1)daiNum = chuTypeData.flag*2;

                for(var i = 0;i<daiNum && i<daiArr.length;++i){
                    tipArr.push(daiArr[i]);
                }
            }

            if(DTRoomModel.intParams[11] == 1) {
                return tipArr;
            }else{
                if (chuIds.length == tipArr.length)return tipArr;
            }
        }

        return null;
    },

    getWuShiKTipCard:function(chuTypeData,handIds,chuIds){
        var wuCards = {4:[],3:[],2:[],1:[]};
        var shiCards = {4:[],3:[],2:[],1:[]};
        var kCards = {4:[],3:[],2:[],1:[]};

        for(var i = 0;i<handIds.length;++i){
            var cfg = DTCardID[handIds[i]];
            if(cfg.v == 5)wuCards[cfg.t].push(handIds[i]);
            if(cfg.v == 10)shiCards[cfg.t].push(handIds[i]);
            if(cfg.v == 13)kCards[cfg.t].push(handIds[i]);
        }

        var zhengWuShiK = [];
        var huaWuShiK = [];

        for(var k = 4;k > 0;k--){
            if(wuCards[k].length > 0 && shiCards[k].length > 0 && kCards[k].length > 0){
                zhengWuShiK.push(wuCards[k][0]);
                zhengWuShiK.push(shiCards[k][0]);
                zhengWuShiK.push(kCards[k][0]);
                break;
            }
        }

        for(var k = 4;k > 0;k--){
            if(wuCards[k].length > 0){
                huaWuShiK.push(wuCards[k][0]);
                break;
            }
        }

        for(var k = 4;k > 0;k--){
            if(shiCards[k].length > 0){
                huaWuShiK.push(shiCards[k][0]);
                break;
            }
        }

        for(var k = 4;k > 0;k--){
            if(kCards[k].length > 0){
                huaWuShiK.push(kCards[k][0]);
                break;
            }
        }

        if(chuTypeData.type < DTCardType.WuShiK){
            if(zhengWuShiK.length == 3)return zhengWuShiK;
            if(huaWuShiK.length == 3)return huaWuShiK;
        }else if(chuTypeData.type == DTCardType.WuShiK){
            if(chuTypeData.flag == 1 && zhengWuShiK.length == 3)return zhengWuShiK;
            if(DTRoomModel.intParams[10] == 1 //正五十k分花色
                &&chuTypeData.flag == 2 && zhengWuShiK.length == 3
                && (DTCardID[zhengWuShiK[0]].t > chuTypeData.ft)){
                return zhengWuShiK;
            }
        }

        return null;
    },

    getZhaDanTipCard:function(chuTypeData,handIds){
        if(handIds.length < 4)return null;

        this.sortIdByNum(handIds);
        handIds.reverse();

        var zhaDanArr = [];
        var wangArr = [];

        for(var i = 0;i<handIds.length;++i){
            var cfg1 = DTCardID[handIds[i]];
            if(cfg1.t == 5){
                wangArr.push(handIds[i]);
            }else{
                var newArr = [handIds[i]];
                for(var j = i+1;j<handIds.length;++j){
                    var v2 = DTCardID[handIds[j]].v;
                    if(cfg1.v == v2){
                        newArr.push(handIds[j]);
                    }else{
                        break;
                    }
                }

                if(newArr.length >= 4){
                    zhaDanArr.push(newArr);
                }
                i += (newArr.length - 1);
            }
        }

        if(chuTypeData.type < DTCardType.ZhaDan){
            if(zhaDanArr.length > 0)return zhaDanArr[0];
            if(wangArr.length == 4)return wangArr;
        }else if(chuTypeData.type == DTCardType.ZhaDan){
            for(var i = 0;i<zhaDanArr.length;++i){
                if(zhaDanArr[i].length > chuTypeData.flag)return zhaDanArr[i];
                else if(zhaDanArr[i].length == chuTypeData.flag
                    && DTCardID[zhaDanArr[i][0]].v > chuTypeData.fv){

                    return zhaDanArr[i];
                }
            }
            //天炸
            if(wangArr.length == 4)return wangArr;

            if(DTRoomModel.intParams[12] == 1){
                //炸弹不带王
            }else{
                //炸弹带王的情况
                for(var i = 0;i<zhaDanArr.length;++i){
                    if(zhaDanArr[i].length + wangArr.length > chuTypeData.flag){
                        return zhaDanArr[i].concat(wangArr);

                    } else if(zhaDanArr[i].length + wangArr.length == chuTypeData.flag
                        && DTCardID[zhaDanArr[i][0]].v > chuTypeData.fv){

                        return zhaDanArr[i].concat(wangArr);
                    }
                }

            }


        }

        return null;
    },

    //把数量多的牌优先排在前面，再按牌值大小排序
    sortIdByNum:function(ids){
        var cardNumData = this.getCardNumData(ids);

        ids.sort(function(a,b){
            var numa = cardNumData[DTCardID[a].v];
            var numb = cardNumData[DTCardID[b].v];

            if(numa != numb){
                return numb - numa;
            }else{
                return DTRoomModel.getOrderNum(b) - DTRoomModel.getOrderNum(a);
            }
        });
    },

    sortIdByValue:function(ids){
        ids.sort(function(a,b){
            return DTRoomModel.getOrderNum(b) - DTRoomModel.getOrderNum(a);
        });
    },

    getCardNumData:function(ids){
        var data = {};
        for(var i = 0;i<ids.length;++i){
            var v = DTCardID[ids[i]].v;
            if(!data[v])data[v] = 1;
            else data[v]++;
        }
        return data;
    },

    //玩家的房内头像是否已经绘制完全
    isRoomIconRoad: function() {
        return true;
    },

    getRoomLayerById:function(){
        return DTRoomLayer;
    },

    getSamllResultLayer:function(){
        return DTSmallResultLayer;
    },

    getBigResultLayer:function(){
        return DTBigResultLayer;
    },
};