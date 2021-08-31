/**
 * Created by cyp on 2019/11/13.
 */

//一样的消息保持和三打哈一致，就不需要额外添加消息推送了
var ERDDZTabelType = {
    CreateTable:"CreateTable",
    JoinTable:"JoinTable",
    ExitTable:"ExitTable",
    ChangeState:"ChangeState",
    ChangeOnLine:"ChangeOnLine",
    ChangeTuoGuan:"ChangeTuoGuan",
    DealCard:"DealCard",
    FenZu:"FenZu",
    MingPai:"MingPai",//明牌
    JiaoDiZhu:"JiaoDiZhu",//叫地主
    QiangDiZhu:"QiangDiZhu",//抢地主
    SureDiZhu:"SureDiZhu",//确定地主
    JiaBei:"JiaBei",//选加倍
    RangPai:"RangPai",//选让牌
    PlayCard:"PlayCard",
    ShowTeamCard:"ShowTeamCard",//看队友牌
    BaoWang:"BaoWang",//出单报王
    OnOver:"OnOver",
}

//key 牌的id,t：牌的类型 1-方块，2-梅花,3-红桃,4-黑桃
//v:单牌大小顺序
var ERDDZCardID = {
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

var ERDDZCardType = {
    DanZhang:1,//单牌
    DuiZi:2,//对子
    ShunZi:3,//顺子
    LianDui:4,//连对
    SanZhang:5,//三张
    SanDaiYi:6,//三带一
    SanDaiDui:7,//三带一对
    SiDaiEr:8,//四带二
    FeiJi:9,//飞机
    FeiJiDCB:10,//飞机带翅膀
    ZhaDan:11,//炸弹
    TianZha:12,//天炸
}

var ERDDZRoomModel = {
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
        this.checkMySeat();

        this.intParams = message.intParams || [];//储存创房选择的玩法

        this.diCards = message.strExt[0].split(",") || [];

        this.creditConfig = message.creditConfig || [];
        this.creditXpkf = message.creditConfig[11] / 100;
        this.tableType = message.tableType;

        this.goldMsg  = [];// goldMsg:100,1000,1; 第1位：门票// 第2位：进房限制// 第3位：倍率
        if(message.goldMsg){
            this.goldMsg = message.goldMsg.split(",");
        }

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

        GoldRoomConfigModel.curClickRoomkeyId = message.goldRoomConfigId || 0;

        this.pauseValue = 0;//用于暂停处理消息

        this.paixuType = this.paixuType || 1;//手牌排序类型

        this.replay = message.replay || false;//是否是回放

        if(this.replay){
            this.paixuType = 1;
        }
        this.switchCoin = message.generalExt[1] || 0;//是否是金币房间
        this.privateRoom = message.strParams[4] || 0;//是否是私密房
    },

    isMoneyRoom:function(){
        return this.tableType == 3;
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
        if(type == ERDDZTabelType.JoinTable){
            var newPlayer = data.player;
            checkState = false;
            if(this.players.length<ERDDZRoomModel.renshu){
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
                    this.checkMySeat();
                }
            }
        }else if(type == ERDDZTabelType.ExitTable){
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
        }else if(type == ERDDZTabelType.ChangeState){
            var seat = data.params[0];
            for(var i=0;i<this.players.length;i++){
                var p = this.players[i];
                if(p.seat == seat){
                    p.status = 1;
                    break;
                }
            }
        }else if(type == ERDDZTabelType.ChangeOnLine) {
            var seat = data[0];
            for (var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.recover[0] = data[1];
                    break;
                }
            }
        }else if(type == ERDDZTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[3] = tuoguan;
                    break;
                }
            }
        }else if(type == ERDDZTabelType.DealCard) {
            var p = this.getPlayerDataByItem("seat", this.mySeat);
            p.handCardIds = data.handCardIds;
            this.nextSeat = data.nextSeat;
            this.remain = data.remain;

            for(var i = 0;i<this.players.length;++i){
                //发牌后的剩余牌数量
                this.players[i].ext[8] = data.handCardIds.length;
            }

            //重置叫地主状态
            for(var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                p.ext[1] = -1;
            }

        }else if(type == ERDDZTabelType.FenZu){
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

        }else if(type == ERDDZTabelType.PlayCard) {
            this.nextSeat = data.nextSeat;

            for (var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];

                if (p.seat == data.seat) {
                    p.handCardIds = this.delCardWithArr(p.handCardIds, data.cardIds);
                    p.outCardIds = data.cardIds;
                    p.outedIds = [];//用于显示报王，操作后清掉
                    p.ext[5] = data.cardType;
                    if (data.cardType == 0) {
                        p.ext[8] -= data.cardIds.length;//剩余牌数
                    }

                    if(data.curScore > 0){
                        this.ext[22] *= data.curScore;
                    }

                } else if (data.cardType == 0) {
                    p.outCardIds = [];//有人出牌，清理掉其他人的出牌数据
                    p.ext[5] = 0;

                }
            }

            if (data.isClearDesk) {
                for (var i = 0; i < this.players.length; ++i) {
                    var p = this.players[i];
                    p.outCardIds = [];//打完一轮清理出的牌
                }
            }
        }else if(type == ERDDZTabelType.ShowTeamCard) {
            for (var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == this.mySeat) {
                    p.moldIds = data.params || [];
                }
            }
        }else if(type == ERDDZTabelType.BaoWang){

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

        }else if(type == ERDDZTabelType.OnOver){
            this.remain = 0;
        }else if(type == ERDDZTabelType.MingPai){
            var seat = data.params[0];
            var p_mp = this.getPlayerDataByItem("seat",seat);
            p_mp && (p_mp.shiZhongCard = 1);

            if(data.strParams[0]){
                var cfg = JSON.parse(data.strParams[0]);

                for(var i = 0;i<cfg.length;++i){
                    var seat = cfg[i].seat;
                    var cards = cfg[i].cards;
                    var p = this.getPlayerDataByItem("seat",seat);
                    p && (p.handCardIds = cards);
                }
            }
        }else if(type == ERDDZTabelType.JiaoDiZhu){
            var seat = data.params[0];
            this.nextSeat = data.params[2];
            if(data.params[1] == 1){//叫了地主进入抢地主阶段
                this.ext[22] = 1;//倍数
                this.ext[23] = 1;//让牌
                this.remain = 4;
            }

            //保存叫地主状态数据
            for(var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[1] = data.params[1];
                }
            }
        }else if(type == ERDDZTabelType.QiangDiZhu){
            var seat  = data.params[0];
            this.nextSeat = data.params[4];

            if(data.params[1] == 1){
                this.ext[22] *=2;//倍数
                this.ext[23] +=1;//让牌
            }

            //保存抢地主状态数据
            for(var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[1] = (data.params[1] == 1?2:3);
                }
            }
        }else if(type == ERDDZTabelType.SureDiZhu){
            this.banker = this.nextSeat = data.params[0];

            if(data.params[1] > 0){//底牌倍数
                this.ext[22] *= data.params[1];
            }

            this.diCards = [];
            for(var i = 0;i<3;++i){
                this.diCards.push(data.params[i+2]);
            }
            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if(p.seat == this.nextSeat){
                    if(p.handCardIds.length > 0)p.handCardIds = p.handCardIds.concat(this.diCards);
                    p.ext[8] += this.diCards.length;
                }
            }

            if(this.intParams[10] != 1){//下个阶段选加倍
                this.remain = 5;
            }else if(this.intParams[4] > 0){//下个阶段选让牌
                this.remain = 6;
            }else{//下个阶段打牌
                this.remain = 2;
            }
        }else if(type == ERDDZTabelType.JiaBei){
            var seat = data.params[0];
            this.nextSeat = data.params[2];

            if(data.params[1] == 2){
                this.ext[22] *= 2;//加倍倍数
            }

            if(data.params[3] > 0){
                if(this.intParams[4] > 0){
                    this.remain = 6;
                }else{
                    this.remain = 2;
                }
            }

            for(var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[1] = (data.params[1] == 2?4:5);
                }
            }

        }else if(type == ERDDZTabelType.RangPai){
            this.remain = 2;
            this.nextSeat = data.params[2];

            if(data.params[1] > 0){
                this.ext[22] *= Math.pow(2,data.params[1]);
                this.ext[23] += data.params[1];
            }

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
        return ERDDZCardID[id].v;
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
        if(typeData2.type == ERDDZCardType.TianZha)return true;


        if(typeData2.type == ERDDZCardType.ZhaDan){
            //炸弹比普通牌型大
            if(typeData1.type < ERDDZCardType.ZhaDan)return true;

            if(typeData1.type == ERDDZCardType.ZhaDan){
                if(typeData2.fv > typeData1.fv)return true;
            }
        }

        //牌型相同比牌值大小
        if(typeData2.type == typeData1.type && typeData2.flag == typeData1.flag
            && typeData2.daiNum == typeData1.daiNum && typeData2.fv > typeData1.fv){
            return true;
        }

        return false;
    },

    getCardTypeData:function(ids){
        this.sortIdByNum(ids);

        var data = {type:0,flag:0,fv:0,daiNum:0};
        //flag:保存牌型的数量类型
        //fv:保存判断相同牌型大小的最大值

        if(ids.length == 1){
            data.type = ERDDZCardType.DanZhang;
            data.fv = ERDDZCardID[ids[0]].v;
        } else if(ids.length == 2){
            if(ERDDZCardID[ids[0]].v == ERDDZCardID[ids[1]].v){
                data.type = ERDDZCardType.DuiZi;
                data.fv = ERDDZCardID[ids[0]].v;
            }

            if(ids[0] == 502 && ids[1] == 501){
                data.type = ERDDZCardType.TianZha;
            }

        }else if(ids.length == 3){
            var cfg1 = ERDDZCardID[ids[0]];
            var cfg2 = ERDDZCardID[ids[1]];
            var cfg3 = ERDDZCardID[ids[2]];

            if(cfg1.v == cfg2.v && cfg1.v == cfg3.v){
                data.type = ERDDZCardType.SanZhang;
                data.fv = ERDDZCardID[ids[0]].v;
            }
        }else if(ids.length >= 4){

            do{

                var isLianDui = true;
                if(ids.length >= 6 && ids.length % 2 == 0){
                    for(var i = 1;i<ids.length;i+=2){
                        var v1 = ERDDZCardID[ids[i-1]].v;
                        var v2 = ERDDZCardID[ids[i]].v;
                        if(v1 != v2 || v1 >= 15 || v2 >= 15){//2和王不能出现在连对
                            isLianDui = false;
                            break;
                        }
                        if(i+1 < ids.length){
                            var v3 = ERDDZCardID[ids[i+1]].v;
                            if(v3 >= 15){
                                isLianDui = false;
                                break;
                            }

                            if(v2 - v3 != 1){
                                isLianDui = false;
                                break;
                            }
                        }
                    }
                }else{
                    isLianDui = false;
                }

                if(isLianDui){
                    data.type = ERDDZCardType.LianDui;
                    data.flag = ids.length/2;
                    data.fv = ERDDZCardID[ids[0]].v;
                    break;
                }

                var isShunZi = true;
                if(ids.length >= 5){
                    for(var i = 0;i<ids.length - 1;++i){
                        var v1 = ERDDZCardID[ids[i]].v;
                        var v2 = ERDDZCardID[ids[i+1]].v;

                        if(v1 >= 15 || v2 >= 15){//2王不能出现在顺子
                            isShunZi = false;
                            break;
                        }
                        if(v1 - v2 != 1){
                            isShunZi = false;
                            break;
                        }
                    }
                }else{
                    isShunZi = false;
                }

                if(isShunZi){
                    data.type = ERDDZCardType.ShunZi;
                    data.flag = ids.length;
                    data.fv = ERDDZCardID[ids[0]].v;
                    break;
                }

                var equalNum = 1;
                for(var i = 1;i<ids.length;++i){
                    var v1 = ERDDZCardID[ids[i-1]].v;
                    var v2 = ERDDZCardID[ids[i]].v;
                    if(v2 == v1)equalNum++;
                    else break;
                }
                if(equalNum == 3){
                    var lastV1 = ERDDZCardID[ids[ids.length-1]].v;
                    var lastV2 = ERDDZCardID[ids[ids.length-2]].v;
                    if(ids.length == 4){
                        data.type = ERDDZCardType.SanDaiYi;
                        data.fv = ERDDZCardID[ids[0]].v;
                        break;
                    }else if(ids.length == 5 && lastV1 == lastV2){
                        data.type = ERDDZCardType.SanDaiDui;
                        data.fv = ERDDZCardID[ids[0]].v;
                        break;
                    }
                }else if(equalNum == ids.length){
                    data.type = ERDDZCardType.ZhaDan;
                    data.flag = ids.length;
                    data.fv = ERDDZCardID[ids[0]].v;
                    break;
                }

                if(equalNum == 4 && ids.length == 6){
                    data.type = ERDDZCardType.SiDaiEr;
                    data.fv = ERDDZCardID[ids[0]].v;
                    break;
                }

                var isFeiji = true;
                if(ids.length >= 6){

                    var keyData = {};
                    for(var k = 1;k<=17;++k)keyData[k] = [];

                    for(var i = 0;i<ids.length;++i){
                        var v = ERDDZCardID[ids[i]].v;
                        keyData[v].push(ids[i]);
                    }

                    var sanZhangNum = 0;
                    var lianSi = 0;
                    var firstLianSi = false;
                    var lastLianSi = false;
                    var buLianSi = 0;
                    var lastV = 0;
                    var duiNum = 0;
                    for(var k = 3;k<17;++k){
                        var num = keyData[k].length;
                        if(num >= 3){
                            if(lastV == 0 || (k - lastV == 1)){
                                if(num == 4){
                                    if(lastV == 0)firstLianSi = true;
                                    lianSi++;
                                    lastLianSi = true;
                                }else{
                                    lastLianSi = false;
                                }
                                sanZhangNum++;
                                lastV = k;
                            }else if(num == 4){
                                buLianSi++;
                            }
                        }else if(num == 2){
                            duiNum++;
                        }else if(num > 0 && sanZhangNum < 2){
                            sanZhangNum = 0;
                            lastV = 0;
                            lianSi = 0;
                        }
                    }

                    if(sanZhangNum < 2){
                        isFeiji = false;
                    }else if(sanZhangNum*3 != ids.length){

                        if(sanZhangNum*4 == ids.length){
                            data.type = ERDDZCardType.FeiJiDCB;
                            data.flag = sanZhangNum;
                            data.fv = lastV;
                            data.daiNum = sanZhangNum;
                            break;
                        }else if(sanZhangNum*5 == ids.length){
                            var isDaiDui = false;

                            //没有连起来的四张当对子用
                            if((duiNum + buLianSi*2) == sanZhangNum)isDaiDui = true;

                            if(isDaiDui){
                                data.type = ERDDZCardType.FeiJiDCB;
                                data.flag = sanZhangNum;
                                data.fv = lastV;
                                data.daiNum = sanZhangNum*2;
                                break;
                            }

                        }else if((firstLianSi || lastLianSi) && sanZhangNum > 2 && lianSi > 0){//如果有连起来的四张，判断是否可当对子用
                            sanZhangNum--;
                            buLianSi++;

                            if((sanZhangNum*5 == ids.length) && (duiNum + buLianSi*2) == sanZhangNum){

                                data.type = ERDDZCardType.FeiJiDCB;
                                data.flag = sanZhangNum;
                                data.fv = lastV;
                                if(!firstLianSi && lastLianSi)data.fv--;
                                data.daiNum = sanZhangNum*2;
                                break;

                            }

                        }

                        isFeiji = false;
                    }

                }else{
                    isFeiji = false;
                }

                if(isFeiji){
                    data.type = ERDDZCardType.FeiJi;
                    data.flag = sanZhangNum;
                    data.fv = lastV;
                    break;
                }

            } while(0);


        }

        return data;
    },

    //获取提示出牌数据
    getTipCardsData:function(chuIds,handIds){
        var chuTypeData = this.getCardTypeData(chuIds);
        if(chuTypeData.type == 0)return [];

        var allTipsData = [];

        var tipData = [];
        if(chuTypeData.type == ERDDZCardType.DanZhang){
            tipData = this.getDanZhangTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == ERDDZCardType.DuiZi){
            tipData = this.getDuiZiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == ERDDZCardType.ShunZi){
            tipData = this.getShunZiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == ERDDZCardType.LianDui){
            tipData = this.getLianDuiTipCard(chuTypeData,handIds,chuIds);
        }else if(chuTypeData.type == ERDDZCardType.SanZhang){
            tipData = this.getSanZhangTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == ERDDZCardType.SanDaiYi){
            tipData = this.getSanDaiYiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == ERDDZCardType.SanDaiDui){
            tipData = this.getSanDaiDuiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == ERDDZCardType.SiDaiEr){

        }else if(chuTypeData.type == ERDDZCardType.FeiJi ){
            tipData = this.getFeijiTipCard(chuTypeData,handIds,chuIds);
        }else if(chuTypeData.type == ERDDZCardType.FeiJiDCB){
            tipData = this.getFeijiDCBTipCard(chuTypeData,handIds,chuIds);
        }

        for(var i = 0;i<tipData.length;++i){
            allTipsData.push(tipData[i]);
        }

        if(chuTypeData.type <= ERDDZCardType.ZhaDan){
            tipData = this.getZhaDanTipCard(chuTypeData,handIds);

            for(var i = 0;i<tipData.length;++i){
                allTipsData.push(tipData[i]);
            }
        }

        if(chuTypeData.type != ERDDZCardType.TianZha){
            tipData = this.getTianZhaTipCard(handIds);
            if(tipData){
                allTipsData.push(tipData);
            }
        }

        return allTipsData;
    },

    getDanZhangTipCard:function(chuTypeData,handIds){
        if(handIds.length <= 0)return [];

        var retData = [];

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            if(v > chuTypeData.fv){
                retData.push([handIds[i]]);
            }
        }
        return retData;
    },

    getDuiZiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 2)return [];

        var retData = [];

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length - 1;++i){
            var v1 = ERDDZCardID[handIds[i]].v;
            var v2 = ERDDZCardID[handIds[i+1]].v;
            if(v1 == v2 && v1 > chuTypeData.fv){
                retData.push([handIds[i],handIds[i+1]]);
            }
        }
        return retData;
    },

    getShunZiTipCard:function(chuTypeData,handIds){
        if(handIds.length < chuTypeData.flag)return [];

        var retData = [];

        var keyData = {};

        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            keyData[v] = handIds[i];
        }

        var num = chuTypeData.flag;
        for(var i = 3;i<=15 - num;++i){
            if(keyData[i]){
                var shunziArr = [keyData[i]];
                for(var j = 1;j<num;++j){
                    if(keyData[i+j]){
                        shunziArr.push(keyData[i+j]);
                    }else{
                        break;
                    }
                }

                if(shunziArr.length == num){
                    if((i + num - 1) > chuTypeData.fv){
                        retData.push(shunziArr);
                    }
                }
            }

        }
        return retData;
    },

    getLianDuiTipCard:function(chuTypeData,handIds,chuIds){
        if(handIds.length < chuTypeData.flag*2)return [];

        var retData = [];

        var keyData = {};
        for(var k = 1;k<=17;++k)keyData[k] = [];

        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            keyData[v].push(handIds[i]);
        }

        var num = chuTypeData.flag;
        for(var i = 3;i<13;++i){
            if(keyData[i].length >= 2){
                var lianduiArr = [keyData[i][0],keyData[i][1]];
                for(var j = 1;j<num;++j){
                    if((i+j<15) && keyData[i+j].length >= 2){
                        lianduiArr.push(keyData[i+j][0]);
                        lianduiArr.push(keyData[i+j][1]);
                    }else{
                        break;
                    }
                }

                if(lianduiArr.length == chuIds.length && (i + num - 1) > chuTypeData.fv){
                    retData.push(lianduiArr);
                }
            }
        }

        return retData;
    },

    getSanZhangTipCard:function(chuTypeData,handIds){
        if(handIds.length < 3)return [];

        var retData = [];

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length - 2;++i){
            var v1 = ERDDZCardID[handIds[i]].v;
            var v2 = ERDDZCardID[handIds[i+1]].v;
            var v3 = ERDDZCardID[handIds[i+2]].v;
            if(v1 == v2 && v1 == v3 && v1 > chuTypeData.fv){
                retData.push([handIds[i],handIds[i+1],handIds[i+2]]);
            }
        }

        return retData;
    },

    getSanDaiYiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 4)return [];

        var retData = [];

        var keyData = {};
        for(var k = 3;k<=17;++k)keyData[k] = [];

        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            keyData[v].push(handIds[i]);
        }

        for(var i = 3;i<=15;++i){
            var tipArr = [];
            var sanZhangV = 0;
            //查找三张
            if(keyData[i].length >= 3 && i > chuTypeData.fv){
                sanZhangV = i;
                for(var t = 0;t<3;++t){
                    tipArr.push(keyData[i][t]);
                }
            }
            //查找单张
            if(tipArr.length == 3){
                for(var j = 3;j <= 17;++j){
                    if(j != sanZhangV && keyData[j].length > 0){
                        retData.push(tipArr.concat(keyData[j][0]));
                    }
                }
            }
        }

        return retData;
    },

    getSanDaiDuiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 5)return [];

        var retData = [];

        var keyData = {};
        for(var k = 3;k<=17;++k)keyData[k] = [];

        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            keyData[v].push(handIds[i]);
        }

        for(var i = 3;i<=15;++i){
            var tipArr = [];
            var sanZhangV = 0;
            //查找三张
            if(keyData[i].length >= 3 && i > chuTypeData.fv){
                sanZhangV = i;
                for(var t = 0;t<3;++t){
                    tipArr.push(keyData[i][t]);
                }
            }
            //查找对子
            if(tipArr.length == 3){
                for(var j = 3;j <= 15;++j){
                    var duiArr = [];
                    if(j != sanZhangV && keyData[j].length >= 2){
                        for(var t = 0;t<2;++t){
                            duiArr.push(keyData[j][t]);
                        }
                        retData.push(tipArr.concat(duiArr));
                    }
                }
            }
        }

        return retData;
    },

    getFeijiTipCard:function(chuTypeData,handIds,chuIds){
        if(handIds.length < 6)return [];

        var retData = [];

        var keyData = {};
        for(var k = 1;k<=17;++k)keyData[k] = [];

        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            keyData[v].push(handIds[i]);
        }

        var num = chuTypeData.flag;
        for(var i = 3;i<14;++i){
            if(keyData[i].length >= 3){
                var feijiArr = [keyData[i][0],keyData[i][1],keyData[i][2]];
                for(var j = 1;j<num;++j){
                    if(keyData[i+j].length >= 3){
                        feijiArr.push(keyData[i+j][0]);
                        feijiArr.push(keyData[i+j][1]);
                        feijiArr.push(keyData[i+j][2]);
                    }else{
                        break;
                    }
                }

                if(feijiArr.length == chuIds.length && (i + num - 1) > chuTypeData.fv){
                    retData.push(feijiArr);
                }
            }
        }

        return retData;
    },

    getFeijiDCBTipCard:function(chuTypeData,handIds,chuIds){
        if(handIds.length < chuTypeData.flag*3 + chuTypeData.daiNum)return [];

        var retData = [];

        var keyData = {};
        for(var k = 1;k<=17;++k)keyData[k] = [];

        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            keyData[v].push(handIds[i]);
        }

        this.sortIdByNum(handIds);
        handIds.reverse();

        var num = chuTypeData.flag;
        var daiNum = chuTypeData.daiNum;
        for(var i = 3;i<14;++i){
            if(keyData[i].length >= 3){
                var feijiArr = [keyData[i][0],keyData[i][1],keyData[i][2]];
                for(var j = 1;j<num;++j){
                    if(keyData[i+j].length >= 3){
                        feijiArr.push(keyData[i+j][0]);
                        feijiArr.push(keyData[i+j][1]);
                        feijiArr.push(keyData[i+j][2]);
                    }else{
                        break;
                    }
                }
                if(feijiArr.length == num*3){
                    var daiArr = [];
                    if(daiNum == num){
                        for(var t = 0;t<handIds.length;++t){
                            var v = ERDDZCardID[handIds[t]].v;
                            if(((v < i) || (v >= i+num)) && daiArr.length < daiNum){
                                daiArr.push(handIds[t]);
                            }
                        }
                        if(daiArr.length == daiNum){
                            feijiArr = feijiArr.concat(daiArr);
                        }
                    }else if(daiNum == num*2){
                        var daiArr = [];

                        for(var j = 3;j<=15;++j){
                            if((j >= i) && (j<i+num))continue;
                            if(keyData[j].length >= 2 && daiArr.length < daiNum){
                                daiArr.push(keyData[j][0]);
                                daiArr.push(keyData[j][1]);
                            }
                        }
                        if(daiArr.length == daiNum){
                            feijiArr = feijiArr.concat(daiArr);
                        }
                    }
                }

                if(feijiArr.length == chuIds.length && (i + num - 1) > chuTypeData.fv){
                    retData.push(feijiArr);
                }
            }
        }

        return retData;
    },

    getZhaDanTipCard:function(chuTypeData,handIds){
        if(handIds.length < 4)return [];

        var retData = [];

        var keyData = {};
        for(var k = 3;k<=17;++k)keyData[k] = [];

        for(var i = 0;i<handIds.length;++i){
            var v = ERDDZCardID[handIds[i]].v;
            keyData[v].push(handIds[i]);
        }

        for(var i = 3;i<=15;++i){
            var num = keyData[i].length;
            if(num < 4)continue;

            if(chuTypeData.type < ERDDZCardType.ZhaDan
                || (chuTypeData.type == ERDDZCardType.ZhaDan && i > chuTypeData.fv)){

                var tipArr = [];
                for(var t = 0;t<keyData[i].length;++t){
                    tipArr.push(keyData[i][t]);
                }
                retData.push(tipArr);
            }
        }

        return retData;
    },

    getTianZhaTipCard:function(handIds){
        if(handIds.length < 2)return null;

        var wangArr = [];
        for(var i = 0;i<handIds.length;++i){
            if(handIds[i] == 501 || handIds[i] == 502){
                wangArr.push(handIds[i]);
            }
        }

        if(wangArr.length == 2)return wangArr;

        return null;
    },

    //把数量多的牌优先排在前面，再按牌值大小排序
    sortIdByNum:function(ids){
        var cardNumData = this.getCardNumData(ids);

        ids.sort(function(a,b){
            var numa = cardNumData[ERDDZCardID[a].v];
            var numb = cardNumData[ERDDZCardID[b].v];

            if(numa != numb){
                return numb - numa;
            }else{
                var cfg_a = ERDDZCardID[a];
                var cfg_b = ERDDZCardID[b];
                if(cfg_a.v == cfg_b.v){
                    return cfg_b.t - cfg_a.t;
                }else{
                    return cfg_b.v - cfg_a.v;
                }
            }
        });
    },

    sortIdByValue:function(ids){
        ids.sort(function(a,b){
            var cfg_a = ERDDZCardID[a];
            var cfg_b = ERDDZCardID[b];
            if(cfg_a.v == cfg_b.v){
                return cfg_b.t - cfg_a.t;
            }else{
                return cfg_b.v - cfg_a.v;
            }
        });
    },

    getCardNumData:function(ids){
        var data = {};
        for(var i = 0;i<ids.length;++i){
            var v = ERDDZCardID[ids[i]].v;
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
        return ERDDZRoomLayer;
    },

    getSamllResultLayer:function(){
        return ERDDZSmallResultLayer;
    },

    getBigResultLayer:function(){
        return ERDDZBigResultLayer;
    },
};