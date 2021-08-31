/**
 * Created by cyp on 2019/11/13.
 */

//一样的消息保持和三打哈一致，就不需要额外添加消息推送了
var NSBTabelType = {
    CreateTable:"CreateTable",
    JoinTable:"JoinTable",
    ExitTable:"ExitTable",
    ChangeState:"ChangeState",
    ChangeOnLine:"ChangeOnLine",
    ChangeTuoGuan:"ChangeTuoGuan",
    DealCard:"DealCard",
    FenZu:"FenZu",
    MingPai:"MingPai",//明牌
    PlayCard:"PlayCard",
    ShowTeamCard:"ShowTeamCard",//看队友牌
    BaoWang:"BaoWang",//出单报王
    OnOver:"OnOver",
}

//key 牌的id,t：牌的类型 1-方块，2-梅花,3-红桃,4-黑桃
//v:单牌大小顺序
var NSBCardID = {
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

var NSBCardType = {
    DanZhang:1,//单牌
    DuiZi:2,//对子
    ShunZi:3,//顺子
    LianDui:4,//连对
    SanZhang:5,//三张
    SanDaiDui:6,//三带一对
    FeiJi:7,//飞机
    FeiJiDaiLD:8,//飞机带连对
    WuShiK:9,//五十K
    ZhaDan:10,//炸弹
    TongHuaShun:11,//同花顺
    TianZha:12,//天炸
}

var NSBRoomModel = {
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

        this.creditConfig = message.creditConfig || [];
        this.tableType = message.tableType;

        //亲友圈白金豆房配置信息，0--是否是白金豆房，1--底分，2--进入限制，3--解散限制
        this.groupTableGoldMsg = [];
        if(message.groupTableGoldMsg){
            this.groupTableGoldMsg = message.groupTableGoldMsg.split(",");
        }

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
        if(type == NSBTabelType.JoinTable){
            var newPlayer = data.player;
            checkState = false;
            if(this.players.length<NSBRoomModel.renshu){
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
        }else if(type == NSBTabelType.ExitTable){
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
        }else if(type == NSBTabelType.ChangeState){
            var seat = data.params[0];
            for(var i=0;i<this.players.length;i++){
                var p = this.players[i];
                if(p.seat == seat){
                    p.status = 1;
                    break;
                }
            }
        }else if(type == NSBTabelType.ChangeOnLine) {
            var seat = data[0];
            for (var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.recover[0] = data[1];
                    break;
                }
            }
        }else if(type == NSBTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[3] = tuoguan;
                    break;
                }
            }
        }else if(type == NSBTabelType.DealCard) {
            var p = this.getPlayerDataByItem("seat", this.mySeat);
            p.handCardIds = data.handCardIds;
            this.nextSeat = data.nextSeat;
            this.remain = data.remain;

            for(var i = 0;i<this.players.length;++i){
                //发牌后的剩余牌数量
                this.players[i].ext[8] = data.handCardIds.length;
            }

        }else if(type == NSBTabelType.FenZu){
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

        }else if(type == NSBTabelType.PlayCard) {
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
                    if (data.isBt > 0)p.ext[7] = data.isBt;//上游，二游，三游，四游
                    if (data.cardType == 0) {
                        p.ext[8] -= data.cardIds.length;//剩余牌数
                    }
                    chuTeam = p.ext[6];
                } else if (data.cardType == 0) {
                    p.outCardIds = [];//有人出牌，清理掉其他人的出牌数据
                    p.ext[5] = 0;

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
                    if (p.seat == data.isLet) {
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
        }else if(type == NSBTabelType.ShowTeamCard) {
            for (var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == this.mySeat) {
                    p.moldIds = data.params || [];
                }
            }
        }else if(type == NSBTabelType.BaoWang){

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

        }else if(type == NSBTabelType.OnOver){
            this.remain = 0;
        }else if(type == NSBTabelType.MingPai){
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
        return NSBCardID[id].v;
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
        var seq = seqArr[(seat - this.mySeat + this.renshu)%this.renshu] || 0;
        return seq;
    },

    getSeatWithSeq:function(seq){
        var seqArr = [1,2,3,4];
        if(this.renshu == 3){
            seqArr = [1,2,4];
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
        if(typeData2.type == NSBCardType.TianZha)return true;

        if(typeData2.type == NSBCardType.TongHuaShun){
            //除了天炸，同花顺最大
            if(typeData1.type < NSBCardType.TongHuaShun)return true;

            if(typeData1.type == NSBCardType.TongHuaShun){
                //同花顺之间比较个数
                if(typeData2.flag > typeData1.flag)return true;
                //个数相同比较牌值大小
                if(typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv)return true;
                //牌值也相同比较花色
                if(typeData2.flag == typeData1.flag && typeData2.fv == typeData1.fv && typeData2.ft > typeData1.ft)return true;
            }
        }

        if(typeData2.type == NSBCardType.ZhaDan){
            //炸弹比普通牌型和五十K大
            if(typeData1.type < NSBCardType.ZhaDan)return true;

            if(typeData1.type == NSBCardType.ZhaDan){
                //炸弹之间比较个数
                if(typeData2.flag > typeData1.flag)return true;
                //个数相同比较牌值大小
                if(typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv)return true;
            }

        }

        if(typeData2.type == NSBCardType.WuShiK){
            //五十K比普通牌型大
            if(typeData1.type < NSBCardType.WuShiK)return true;

            if(typeData1.type == NSBCardType.WuShiK){
                //正五十K比花五十K大
                if(typeData2.flag > typeData1.flag)return true;
                //正五十K之间分花色
                if(typeData2.flag == 2 && typeData1.flag == 2 && typeData2.ft > typeData1.ft){
                    return true;
                }
            }
        }

        //牌型相同比牌值大小
        if(typeData2.type == typeData1.type && typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv){
            return true;
        }

        return false;
    },

    getCardTypeData:function(ids){
        this.sortIdByNum(ids);

        var data = {type:0,flag:0,fv:0};
        //flag:保存牌型的数量类型
        //fv:保存判断相同牌型大小的最大值

        if(ids.length == 1){
            data.type = NSBCardType.DanZhang;
            data.fv = NSBCardID[ids[0]].v;
        } else if(ids.length == 2){
            if(NSBCardID[ids[0]].v == NSBCardID[ids[1]].v){
                data.type = NSBCardType.DuiZi;
                data.fv = NSBCardID[ids[0]].v;
            }
        }else if(ids.length == 3){
            var cfg1 = NSBCardID[ids[0]];
            var cfg2 = NSBCardID[ids[1]];
            var cfg3 = NSBCardID[ids[2]];

            if(cfg1.v == cfg2.v && cfg1.v == cfg3.v){
                data.type = NSBCardType.SanZhang;
                data.fv = NSBCardID[ids[0]].v;
            }else if(cfg1.v == 13 && cfg2.v == 10 && cfg3.v == 5){
                data.type = NSBCardType.WuShiK;
                data.flag = 1;//花五十K
                if(cfg1.t == cfg2.t && cfg1.t == cfg3.t){
                    data.flag = 2;//正五十K
                    data.ft = cfg1.t;
                }
            }
        }else if(ids.length >= 4){

            do{

                if(ids.length == 4 && ids[0] == 502 && ids[1] == 502 && ids[2] == 501 && ids[3] == 501){
                    data.type = NSBCardType.TianZha;
                    break;
                }

                var lastV = NSBCardID[ids[ids.length - 1]].v;
                var firstV = NSBCardID[ids[0]].v;

                var isLianDui = true;
                var extV = 0;
                if(ids.length % 2 == 0){
                    for(var i = 1;i<ids.length;i+=2){
                        var v1 = NSBCardID[ids[i-1]].v;
                        var v2 = NSBCardID[ids[i]].v;
                        if(v1 != v2 || v1 > 15 || v2 > 15){//大王，小王不能出现在连对
                            isLianDui = false;
                            break;
                        }
                        if(i+1 < ids.length){
                            var v3 = NSBCardID[ids[i+1]].v;
                            if(v3 > 15){
                                isLianDui = false;
                                break;
                            }

                            if((v2 - v3 != 1)){
                                //AA2233算连对
                                if(lastV == 3 && firstV == 15 && (v1 == 14 || v1 == 15) && v2 != v3){
                                    extV = v3;
                                    continue;
                                }else{
                                    isLianDui = false;
                                    break;
                                }
                            }
                        }
                    }
                }else{
                    isLianDui = false;
                }

                if(isLianDui){
                    data.type = NSBCardType.LianDui;
                    data.flag = ids.length/2;
                    data.fv = extV>0?extV:NSBCardID[ids[0]].v;
                    break;
                }

                var isShunZi = true;
                var isTongHua = true;

                var extV = 0;
                if(ids.length >= 5){
                    for(var i = 0;i<ids.length - 1;++i){
                        var v1 = NSBCardID[ids[i]].v;
                        var v2 = NSBCardID[ids[i+1]].v;
                        
                        if(NSBCardID[ids[i]].t != NSBCardID[ids[i+1]].t){
                            isTongHua = false;
                        }

                        if(v1 > 15 || v2 > 15){//大王，小王不能出现在顺子
                            isShunZi = false;
                            break;
                        }
                        if(v1 - v2 != 1){
                            //A2345算顺子，这里处理下
                            if(lastV == 3 && firstV == 15 && (v1 == 14 || v1 == 15) && v1 != v2){
                                extV = v2;
                                continue;
                            }else{
                                isShunZi = false;
                                break;
                            }

                        }
                    }
                }else{
                    isShunZi = false;
                }

                if(isShunZi){
                    data.type = isTongHua?NSBCardType.TongHuaShun:NSBCardType.ShunZi;
                    data.flag = ids.length;
                    data.fv = extV>0?extV:NSBCardID[ids[0]].v;
                    data.ft = NSBCardID[ids[0]].t;//用于同花顺比较花色
                    break;
                }

                var equalNum = 1;
                for(var i = 1;i<ids.length;++i){
                    var v1 = NSBCardID[ids[i-1]].v;
                    var v2 = NSBCardID[ids[i]].v;
                    if(v2 == v1)equalNum++;
                    else break;
                }
                if(equalNum == 3){
                    var lastV1 = NSBCardID[ids[ids.length-1]].v;
                    var lastV2 = NSBCardID[ids[ids.length-2]].v;
                    if(ids.length == 5 && lastV1 == lastV2){
                        data.type = NSBCardType.SanDaiDui;
                        data.fv = NSBCardID[ids[0]].v;
                        break;
                    }
                }else if(equalNum == ids.length){
                    data.type = NSBCardType.ZhaDan;
                    data.flag = ids.length;
                    data.fv = NSBCardID[ids[0]].v;
                    break;
                }

                var isFeiji = true;
                var daiLianDui = false;
                if(ids.length >= 6){
                    var sanZhangNum = 0;
                    var lastV = 0;
                    for(var i = 0;i<ids.length - 2;i+=3){
                        var v1 = NSBCardID[ids[i]].v;
                        var v2 = NSBCardID[ids[i+1]].v;
                        var v3 = NSBCardID[ids[i+2]].v;

                        if(v1 == v2 && v1 == v3){
                            if(lastV > 0){
                                if(lastV - v1 == 1){
                                    lastV = v1;
                                    sanZhangNum++;
                                }
                            }else{
                                lastV = v1;
                                sanZhangNum++;
                            }
                        }
                    }
                    if(sanZhangNum < 2){
                        isFeiji = false;
                    }else if(sanZhangNum*3 != ids.length){

                        var lianDuiNum = 0;
                        var lastV = 0;
                        for(var i = sanZhangNum*3;i<ids.length - 1;i+=2){
                            var v1 = NSBCardID[ids[i]].v;
                            var v2 = NSBCardID[ids[i+1]].v;
                            if(v1 == v2){
                                if(lastV > 0){
                                    if(lastV - v1 == 1){
                                        lastV = v1;
                                        lianDuiNum++;
                                    }
                                }else{
                                    lastV = v1;
                                    lianDuiNum++;
                                }
                            }
                        }

                        if(lianDuiNum == sanZhangNum && (sanZhangNum*5 == ids.length)){
                            daiLianDui = true;
                        }else{
                            isFeiji = false;
                        }

                    }

                }else{
                    isFeiji = false;
                }

                if(isFeiji){
                    data.type = daiLianDui?NSBCardType.FeiJiDaiLD:NSBCardType.FeiJi;
                    data.flag = sanZhangNum;
                    data.fv = NSBCardID[ids[0]].v;
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
        if(chuTypeData.type == NSBCardType.DanZhang){
            tipData = this.getDanZhangTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == NSBCardType.DuiZi){
            tipData = this.getDuiZiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == NSBCardType.ShunZi){
            tipData = this.getShunZiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == NSBCardType.LianDui){
            tipData = this.getLianDuiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == NSBCardType.SanZhang
            || chuTypeData.type == NSBCardType.SanDaiDui){

            tipData = this.getSanDaiTipCard(chuTypeData,handIds);
        }
        if(chuTypeData.type == NSBCardType.FeiJi || chuTypeData.type == NSBCardType.FeiJiDaiLD){
            tipData = this.getFeijiTipCard(chuTypeData,handIds,chuIds);
        }
        if(!tipData && chuTypeData.type <= NSBCardType.WuShiK){
            tipData = this.getWuShiKTipCard(chuTypeData,handIds,chuIds);
        }
        if(!tipData && chuTypeData.type <= NSBCardType.ZhaDan){
            tipData = this.getZhaDanTipCard(chuTypeData,handIds);
        }
        if(!tipData && chuTypeData.type <= NSBCardType.TongHuaShun){
            tipData = this.getTongHuaShunTipCard(chuTypeData,handIds);
        }
        if(!tipData && chuTypeData != NSBCardType.TianZha){
            tipData = this.getTianZhaTipCard(handIds);
        }

        return tipData;
    },

    getDanZhangTipCard:function(chuTypeData,handIds){
        if(handIds.length <= 0)return null;

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length;++i){
            var v = NSBCardID[handIds[i]].v;
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
            var v1 = NSBCardID[handIds[i]].v;
            var v2 = NSBCardID[handIds[i+1]].v;
            if(v1 == v2 && v1 > chuTypeData.fv){
                return [handIds[i],handIds[i+1]];
            }
        }
        return null;
    },

    getShunZiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 5)return null;

        this.sortIdByValue(handIds);
        handIds.reverse();
        var shunziArr = [];

        //如果有A的话先放到前面
        for(var i = handIds.length - 1;i>=0;--i){
            if(NSBCardID[handIds[i]].v == 14){
                shunziArr.push(handIds[i]);
                break;
            }
        }

        //如果有2的话先放到前面
        for(var i = handIds.length - 1;i>=0;--i){
            if(NSBCardID[handIds[i]].v == 15){
                shunziArr.push(handIds[i]);
                break;
            }
        }

        for(var i = 0;i<handIds.length;++i){
            var v1 = NSBCardID[handIds[i]].v;
            if(v1 <= 15){
                if(shunziArr.length > 0){
                    var lastV = NSBCardID[shunziArr[shunziArr.length - 1]].v;
                    if(v1 == lastV)continue;
                    if(v1 - lastV != 1){
                        if(lastV == 15 && v1 == 3){

                        }else{
                            shunziArr = [];
                        }
                    }
                }

                shunziArr.push(handIds[i]);

                if(shunziArr.length > 13){
                    shunziArr = shunziArr.slice(1);
                }

                if(v1 > chuTypeData.fv && shunziArr.length >= chuTypeData.flag){
                    return shunziArr.slice(-chuTypeData.flag);
                }
            }else{
                shunziArr = [];
            }
        }
        return null;
    },

    getLianDuiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 4)return null;

        this.sortIdByValue(handIds);
        handIds.reverse();
        var lianduiArr = [];

        //如果有2的话先放到前面
        for(var i = handIds.length - 1;i>=0;--i){
            if(NSBCardID[handIds[i]].v == 15){
                lianduiArr.push(handIds[i]);
                if(lianduiArr.length == 2){
                    break;
                }
            }
        }
        if(lianduiArr.length != 2){
            lianduiArr = [];
        }

        for(var i = 0;i<handIds.length - 1;++i){
            var v1 = NSBCardID[handIds[i]].v;
            var v2 = NSBCardID[handIds[i+1]].v;

            if(lianduiArr.length > 0){
                var lastV = NSBCardID[lianduiArr[lianduiArr.length - 1]].v;
                if(v1 == lastV)continue;
                if(v1 - lastV != 1){
                    if(lastV == 15 && v1 == 3){

                    }else{
                        lianduiArr = [];
                    }
                }
            }

            if(v1 == v2 && v1 <= 15){

                lianduiArr.push(handIds[i]);
                lianduiArr.push(handIds[i+1]);

                if(lianduiArr.length > 26){
                    lianduiArr = lianduiArr.slice(2);
                }

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

    getSanDaiTipCard:function(chuTypeData,handIds){
        if(handIds.length < 3)return null;

        this.sortIdByNum(handIds);
        handIds.reverse();
        var tipArr = [];
        var daiArr = [];
        for(var i = 0;i<handIds.length;++i){
            var v1 = NSBCardID[handIds[i]].v;

            var v2 = 0;var v3 = 0;
            if(i+1 < handIds.length)v2 = NSBCardID[handIds[i+1]].v;
            if(i+2 < handIds.length)v3 = NSBCardID[handIds[i+2]].v;

            if(v1 == v2 && v1 == v3 && v1 > chuTypeData.fv && tipArr.length == 0){
                tipArr = [handIds[i],handIds[i+1],handIds[i+2]];
                i+=2;
            }else{
                daiArr.push(handIds[i]);
            }
        }

        if(tipArr.length > 0){
            if(chuTypeData.type == NSBCardType.SanZhang ){
                return tipArr;
            }

            for(var i = 0;i<daiArr.length - 1;++i){

                var v1 = NSBCardID[daiArr[i]].v;
                var v2 = NSBCardID[daiArr[i+1]].v;
                if(v1 == v2){
                    tipArr.push(daiArr[i]);
                    tipArr.push(daiArr[i+1]);
                    break;
                }
            }

            if (chuTypeData.type == NSBCardType.SanDaiDui && tipArr.length == 5)return tipArr;

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
            var v1 = NSBCardID[handIds[i]].v;
            var v2 = NSBCardID[handIds[i+1]].v;
            var v3 = NSBCardID[handIds[i+2]].v;

            if(feijiArr.length > 0){
                var lastV = NSBCardID[feijiArr[feijiArr.length - 1]].v;
                if(v1 == lastV)continue;
                if(v1 - lastV != 1){
                    feijiArr = [];
                }
            }

            if(v1 == v2 && v1 == v3 && v1 <= 15){

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

            if(chuTypeData.type == NSBCardType.FeiJi)return tipArr;


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

                var lianDui = this.getLianDui(daiArr,chuTypeData.flag);

                if(chuTypeData.type == NSBCardType.FeiJiDaiLD && lianDui){
                    return tipArr.concat(lianDui);
                }
            }
        }

        return null;
    },

    getLianDui:function(ids,num){
        if(ids.length < num*2)return null;

        this.sortIdByValue(ids);
        ids.reverse();
        var lianduiArr = [];
        for(var i = 0;i<ids.length - 1;++i){
            var v1 = NSBCardID[ids[i]].v;
            var v2 = NSBCardID[ids[i+1]].v;

            if(lianduiArr.length > 0){
                var lastV = NSBCardID[lianduiArr[lianduiArr.length - 1]].v;
                if(v1 == lastV)continue;
                if(v1 - lastV != 1){
                    lianduiArr = [];
                }
            }

            if(v1 == v2 && v1 <= 15){

                lianduiArr.push(ids[i]);
                lianduiArr.push(ids[i+1]);

                if(lianduiArr.length == num*2){
                    return lianduiArr;
                }

                i++;
            }else{
                lianduiArr = [];
            }
        }
        return null;
    },

    getWuShiKTipCard:function(chuTypeData,handIds,chuIds){
        var wuCards = {4:[],3:[],2:[],1:[]};
        var shiCards = {4:[],3:[],2:[],1:[]};
        var kCards = {4:[],3:[],2:[],1:[]};

        for(var i = 0;i<handIds.length;++i){
            var cfg = NSBCardID[handIds[i]];
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

        if(chuTypeData.type < NSBCardType.WuShiK){
            if(zhengWuShiK.length == 3)return zhengWuShiK;
            if(huaWuShiK.length == 3)return huaWuShiK;
        }else if(chuTypeData.type == NSBCardType.WuShiK){
            if(chuTypeData.flag == 1 && zhengWuShiK.length == 3)return zhengWuShiK;
            if(chuTypeData.flag == 2 && zhengWuShiK.length == 3
                && (NSBCardID[zhengWuShiK[0]].t > chuTypeData.ft)){
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

        for(var i = 0;i<handIds.length;++i){
            var cfg1 = NSBCardID[handIds[i]];

            var newArr = [handIds[i]];
            for (var j = i + 1; j < handIds.length; ++j) {
                var v2 = NSBCardID[handIds[j]].v;
                if (cfg1.v == v2) {
                    newArr.push(handIds[j]);
                } else {
                    break;
                }
            }

            if (newArr.length >= 4) {
                zhaDanArr.push(newArr);
            }
            i += (newArr.length - 1);

        }

        if(chuTypeData.type < NSBCardType.ZhaDan){
            if(zhaDanArr.length > 0)return zhaDanArr[0];

        }else if(chuTypeData.type == NSBCardType.ZhaDan){
            for(var i = 0;i<zhaDanArr.length;++i){
                if(zhaDanArr[i].length > chuTypeData.flag)return zhaDanArr[i];
                else if(zhaDanArr[i].length == chuTypeData.flag
                    && NSBCardID[zhaDanArr[i][0]].v > chuTypeData.fv){

                    return zhaDanArr[i];
                }
            }
        }

        return null;
    },

    getTongHuaShunTipCard:function(chuTypeData,handIds){
        if(handIds.length < 5)return null;

        var cardData = {1:[],2:[],3:[],4:[],5:[]};

        for(var i = 0;i<handIds.length;++i){
            var t = NSBCardID[handIds[i]].t;
            cardData[t].push(handIds[i]);
        }

        for(var k = 1;k<5;++k){
            var tipCard = this.getShunZi(chuTypeData,cardData[k]);
            if(tipCard){
                return tipCard;
            }
        }
        return null;
    },

    getShunZi:function(chuTypeData,handIds){
        if(handIds.length < 5)return null;

        var curT = NSBCardID[handIds[0]].t;

        this.sortIdByValue(handIds);
        handIds.reverse();
        var shunziArr = [];

        //如果有A的话先放到前面
        for(var i = handIds.length - 1;i>=0;--i){
            if(NSBCardID[handIds[i]].v == 14){
                shunziArr.push(handIds[i]);
                break;
            }
        }

        //如果有2的话先放到前面
        for(var i = handIds.length - 1;i>=0;--i){
            if(NSBCardID[handIds[i]].v == 15){
                shunziArr.push(handIds[i]);
                break;
            }
        }

        for(var i = 0;i<handIds.length;++i){
            var v1 = NSBCardID[handIds[i]].v;
            if(v1 <= 15){
                if(shunziArr.length > 0){
                    var lastV = NSBCardID[shunziArr[shunziArr.length - 1]].v;
                    if(v1 == lastV)continue;
                    if(v1 - lastV != 1){
                        if(lastV == 15 && v1 == 3){

                        }else{
                            shunziArr = [];
                        }
                    }
                }

                shunziArr.push(handIds[i]);

                if(shunziArr.length > 13){
                    shunziArr = shunziArr.slice(1);
                }

                if(chuTypeData.type < NSBCardType.TongHuaShun){
                    if(shunziArr.length >= 5)return shunziArr;
                }else if(chuTypeData.type == NSBCardType.TongHuaShun){
                    if(shunziArr.length > chuTypeData.flag)return shunziArr;
                    if(shunziArr.length == chuTypeData.flag && v1 > chuTypeData.fv)return shunziArr;
                    if(shunziArr.length == chuTypeData.flag && v1 == chuTypeData.fv && curT > chuTypeData.ft)return shunziArr;
                }
            }else{
                shunziArr = [];
            }
        }
        return null;
    },

    //获取所有顺子
    getAllShunZi:function(handIds){
        var allShunZi = [];

        if(handIds.length < 5)return allShunZi;

        this.sortIdByValue(handIds);
        handIds.reverse();
        var shunziArr = [];

        //如果有A的话先放到前面
        for(var i = handIds.length - 1;i>=0;--i){
            if(NSBCardID[handIds[i]].v == 14){
                shunziArr.push(handIds[i]);
                break;
            }
        }

        //如果有2的话先放到前面
        for(var i = handIds.length - 1;i>=0;--i){
            if(NSBCardID[handIds[i]].v == 15){
                shunziArr.push(handIds[i]);
                break;
            }
        }

        for(var i = 0;i<handIds.length;++i){
            var v1 = NSBCardID[handIds[i]].v;
            if(v1 <= 15){
                if(shunziArr.length > 0){
                    var lastV = NSBCardID[shunziArr[shunziArr.length - 1]].v;
                    if(v1 == lastV)continue;
                    if(v1 - lastV != 1){
                        if(lastV == 15 && v1 == 3){

                        }else{

                            if(shunziArr.length >= 5)allShunZi.push(shunziArr);

                            shunziArr = [];
                        }
                    }
                }

                shunziArr.push(handIds[i]);

                if(shunziArr.length > 13){
                    shunziArr = shunziArr.slice(1);
                }

                if(i == handIds.length -1){
                    if(shunziArr.length >= 5)allShunZi.push(shunziArr);
                }

            }else{

                if(shunziArr.length >= 5)allShunZi.push(shunziArr);

                shunziArr = [];
            }
        }
        return allShunZi;
    },

    getTianZhaTipCard:function(handIds){
        if(handIds.length < 4)return null;

        var wangArr = [];
        for(var i = 0;i<handIds.length;++i){
            if(handIds[i] == 501 || handIds[i] == 502){
                wangArr.push(handIds[i]);
            }
        }

        if(wangArr.length == 4)return wangArr;

        return null;
    },

    //把数量多的牌优先排在前面，再按牌值大小排序
    sortIdByNum:function(ids){
        var cardNumData = this.getCardNumData(ids);

        ids.sort(function(a,b){
            var numa = cardNumData[NSBCardID[a].v];
            var numb = cardNumData[NSBCardID[b].v];

            if(numa != numb){
                return numb - numa;
            }else{
                var cfg_a = NSBCardID[a];
                var cfg_b = NSBCardID[b];
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
            var cfg_a = NSBCardID[a];
            var cfg_b = NSBCardID[b];
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
            var v = NSBCardID[ids[i]].v;
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
        return NSBRoomLayer;
    },

    getSamllResultLayer:function(){
        return NSBSmallResultLayer;
    },

    getBigResultLayer:function(){
        return NSBBigResultLayer;
    },
};