/**
 * Created by cyp on 2019/11/13.
 */

//一样的消息保持和三打哈一致，就不需要额外添加消息推送了
var TCGDTabelType = {
    CreateTable:"CreateTable",
    JoinTable:"JoinTable",
    ExitTable:"ExitTable",
    ChangeState:"ChangeState",
    ChangeOnLine:"ChangeOnLine",
    ChangeTuoGuan:"ChangeTuoGuan",
    DealCard:"DealCard",
    ShowHong3:"ShowHong3",//显示红桃3
    SwitchSeat:"SwitchSeat",//换位置
    FenZu:"FenZu",
    MingPai:"MingPai",//明牌
    PlayCard:"PlayCard",
    ShowTeamCard:"ShowTeamCard",//看队友牌
    BaoWang:"BaoWang",//出单报王
    OnOver:"OnOver",
}

//key 牌的id,t：牌的类型 1-方块，2-梅花,3-红桃,4-黑桃
//v:单牌大小顺序
var TCGDCardID = {
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

var TCGDCardType = {
    DanZhang:1,//单牌
    DuiZi:2,//对子
    ShunZi:3,//顺子
    LianDui:4,//连对
    SanZhang:5,//三张
    SanDaiDui:6,//三带一对
    FeiJi:7,//飞机
    ZhaDan:10,//炸弹
    TongHuaShun:13,//同花顺
    TianZha:20,//天炸
}

var TCGDRoomModel = {
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
        if(type == TCGDTabelType.JoinTable){
            var newPlayer = data.player;
            checkState = false;
            if(this.players.length<TCGDRoomModel.renshu){
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
        }else if(type == TCGDTabelType.ExitTable){
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
        }else if(type == TCGDTabelType.ChangeState){
            var seat = data.params[0];
            for(var i=0;i<this.players.length;i++){
                var p = this.players[i];
                if(p.seat == seat){
                    p.status = 1;
                    break;
                }
            }
        }else if(type == TCGDTabelType.ChangeOnLine) {
            var seat = data[0];
            for (var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.recover[0] = data[1];
                    break;
                }
            }
        }else if(type == TCGDTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[3] = tuoguan;
                    break;
                }
            }
        }else if(type == TCGDTabelType.DealCard) {
            var p = this.getPlayerDataByItem("seat", this.mySeat);
            p.handCardIds = data.handCardIds;
            this.nextSeat = data.nextSeat;
            this.remain = data.remain;

            for(var i = 0;i<this.players.length;++i){
                //发牌后的剩余牌数量
                this.players[i].ext[8] = data.handCardIds.length;
                this.players[i].status = 2;
            }

        }else if(type == TCGDTabelType.FenZu){
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

        }else if(type == TCGDTabelType.PlayCard) {
            this.nextSeat = data.nextSeat;
            this.timeOut[0] = data.curScore || 0;//倒计时起始时间

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
                    p.ext[1] = data.isLet || 0;//存客户端传的牌型
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
                for (var i = 0; i < this.players.length; ++i) {
                    var p = this.players[i];
                    p.outCardIds = [];//打完一轮清理出的牌
                }
            }
        }else if(type == TCGDTabelType.ShowTeamCard) {
            for (var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == this.mySeat) {
                    p.moldIds = data.params || [];
                }
            }
        }else if(type == TCGDTabelType.BaoWang){

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

        }else if(type == TCGDTabelType.OnOver){
            this.remain = 0;
        }else if(type == TCGDTabelType.MingPai){
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
        }else if(type == TCGDTabelType.SwitchSeat){

            var oldSeq = {};
            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                oldSeq[p.userId] = this.getSeqWithSeat(p.seat);
            }

            var newSeat = JSON.parse(data.strParams[0]);

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if(newSeat[p.userId]){
                    p.seat = newSeat[p.userId];
                }
            }

            this.switchDataArr = [];

            this.checkMySeat();
            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                var seq = this.getSeqWithSeat(p.seat);
                if(seq != oldSeq[p.userId]){
                    var item = {};
                    item.userId = p.userId;
                    item.icon = p.icon;
                    item.oldSeq = oldSeq[p.userId];
                    item.newSeq = seq;
                    this.switchDataArr.push(item);
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

    //获取桌面已打出牌的牌型
    getDeskCardsType:function(){
        for(var i = 0;i<this.players.length;++i){
            var p = this.players[i];
            if(p.outCardIds.length > 0){
                return p.ext[1];
            }
        }
        return 0;
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
        return TCGDCardID[id].v;
    },

    //获取倒计时时间
    getCountTime:function(isCreateMsg){
        var time = 30;

        if(isCreateMsg && this.timeOut[1] > 0){
            time = parseInt(this.timeOut[1]/1000);
        }else if(this.timeOut[0] > 0){
            time = parseInt(this.timeOut[0]/1000);
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
        if(typeData2.type == TCGDCardType.TianZha)return true;
        if(typeData2.type == TCGDCardType.TongHuaShun){
            //同花顺比普通牌型大
            if(typeData1.type < TCGDCardType.ZhaDan)return true;

            //同花顺比5张和4张的炸弹大
            if(typeData1.type == TCGDCardType.ZhaDan && typeData1.flag <= 5)return true;

            if(typeData1.type == TCGDCardType.TongHuaShun){
                //比较牌值大小
                if(typeData2.fv > typeData1.fv)return true;
            }
        }

        if(typeData2.type == TCGDCardType.ZhaDan){
            //炸弹比普通牌型大
            if(typeData1.type < TCGDCardType.ZhaDan)return true;

            if(typeData1.type == TCGDCardType.ZhaDan){
                //炸弹之间比较个数
                if(typeData2.flag > typeData1.flag)return true;
                //个数相同比较牌值大小
                if(typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv)return true;
            }

            if(typeData1.type == TCGDCardType.TongHuaShun && typeData2.flag >= 6)return true;

        }

        //牌型相同比牌值大小
        if(typeData2.type == typeData1.type && typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv){
            return true;
        }

        return false;
    },

    //通过牌的数字大小判断牌型
    getCardTypeByValue:function(vals,isTongHua){
        var data = {type:0,flag:0,fv:0,tiArr:null};

        vals.sort(function(a,b){return a-b});

        if(vals.length == 1){
            data.type = TCGDCardType.DanZhang;
            data.fv = vals[0];
        }else if(vals.length == 2){
            if(vals[0] == vals[1]){
                data.type = TCGDCardType.DuiZi;
                data.fv = vals[0];
            }
        }else if(vals.length == 3){
            if(vals[0] == vals[1] && vals[0] == vals[2]){
                data.type = TCGDCardType.SanZhang;
                data.fv = vals[0];
            }
        }else if(vals.length >= 4 && vals.length <= 8){

            var sameNum = 1;
            for(var i = 1;i<vals.length;++i){
                if(vals[i] == vals[i-1]){
                    sameNum++;
                }else{
                    break;
                }
            }
            if(sameNum == vals.length && sameNum >= 4 && sameNum <= 8){
                data.type = TCGDCardType.ZhaDan;
                data.flag = sameNum;
                data.fv = vals[0];
                return data;
            }

            if(vals.length == 6){
                var liandui = true;

                for(var i = 0;i<vals.length - 1;i+=2){
                    if(vals[i] != vals[i+1]){
                        liandui = false;
                        break;
                    }
                    if((i >= 2) && (vals[i] - vals[i-2] != 1)){
                        liandui = false;
                        break;
                    }
                    if(vals[i] >= 15){//连对最大到A
                        liandui = false;
                        break;
                    }
                }

                if(liandui){
                    data.type = TCGDCardType.LianDui;
                    data.flag = 3;
                    data.fv = vals[vals.length - 1];
                    return data;
                }

                var feiji = true;

                for(var i = 0;i<vals.length - 2;i+=3){
                    if(vals[i] != vals[i+1] || vals[i] != vals[i+2]){
                        feiji = false;
                        break;
                    }
                    if((i >= 3) && (vals[i] - vals[i-3] != 1)){
                        feiji = false;
                        break;
                    }
                    if(vals[i] >= 15){//飞机最大到A
                        feiji = false;
                        break;
                    }
                }

                if(feiji){
                    data.type = TCGDCardType.FeiJi;
                    data.flag = 2;
                    data.fv = vals[vals.length - 1];
                    return data;
                }


            }

            if(vals.length == 5){

                var shunzi = true;

                for(var i = 1;i<vals.length;++i){
                    if(vals[i] - vals[i-1] != 1){
                        shunzi = false;
                        break;
                    }
                    if(vals[i] >= 15){
                        shunzi = false;
                        break;
                    }
                }

                if(shunzi){
                    if(isTongHua){
                        data.type = TCGDCardType.TongHuaShun;
                    }else{
                        data.type = TCGDCardType.ShunZi;
                    }
                    data.flag = 5;
                    data.fv = vals[vals.length - 1];
                    return data;
                }

                if(vals[0] == vals[1] && vals[3] == vals[4]
                    && (vals[2] == vals[0] || vals[2] == vals[3])){

                    data.type = TCGDCardType.SanDaiDui;
                    data.fv = vals[2];
                    return data;
                }

            }


        }
        return data;
    },

    getCardTypeData:function(ids){
        this.sortIdByNum(ids);

        var data = {type:0,flag:0,fv:0,tiArr:null};
        //flag:保存牌型的数量类型
        //fv:保存判断相同牌型大小的最大值

        if(ids.length <=0 || ids.length > 8)return data;

        if(ids.length == 4 && ids[0] == 502 && ids[1] == 502 && ids[2] == 501 && ids[3] == 501){
            data.type = TCGDCardType.TianZha;
            return data;
        }

        var vals1 = [];
        var vals2 = [];
        var hasAor2 = false;
        var hong2Num = 0;
        var isTongHua = true;
        var firstType = 0;
        for(var i = 0;i<ids.length;++i){
            if(ids[i] == 315){
                hong2Num++;
            }else {
                var cfg = TCGDCardID[ids[i]];
                if(firstType == 0){
                    firstType = cfg.t;
                }else{
                    if(cfg.t != firstType)isTongHua = false;
                }
                vals1.push(cfg.v);
                if(cfg.v == 15 || cfg.v == 14){
                    vals2.push(cfg.v - 13);
                    hasAor2 = true;
                }else{
                    vals2.push(cfg.v);
                }
            }
        }

        if(hong2Num == 2){

            //三张相同的和2张钻牌，优先判断为炸弹
            if(vals1.length == 3 && vals1[0] == vals1[1] && vals1[0] == vals1[2]){
                data = this.getCardTypeByValue(vals1.concat(vals1[0],vals1[0]),isTongHua);
                if(data.type > 0){
                    data.tiArr = [vals1[0],vals1[0]];
                    return data;
                }
            }

            for(var i = 15;i >= 1;--i){
                for(var j = 15;j>=1;--j){
                    data = this.getCardTypeByValue(vals1.concat(i,j),isTongHua);
                    if(data.type > 0){
                        data.tiArr = [i,j];
                        return data;
                    }
                }
            }

            if(data.type == 0 && hasAor2){
                for(var i = 15;i >= 1;--i){
                    for(var j = 15;j>=1;--j){
                        data = this.getCardTypeByValue(vals2.concat(i,j),isTongHua);
                        if(data.type > 0){
                            data.tiArr = [i,j];
                            data.isA2 = true;
                            return data;
                        }
                    }
                }
            }

        }else if(hong2Num == 1){

            for(var i = 15;i>=1;--i){
                data = this.getCardTypeByValue(vals1.concat(i),isTongHua);
                if(data.type > 0){
                    data.tiArr = [i];
                    return data;
                }
            }

            if(data.type == 0 && hasAor2){
                for(var i = 15;i>=1;--i){
                    data = this.getCardTypeByValue(vals2.concat(i),isTongHua);
                    if(data.type > 0){
                        data.tiArr = [i];
                        data.isA2 = true;
                        return data;
                    }
                }
            }

        }else{
            data = this.getCardTypeByValue(vals1,isTongHua);
            if(data.type == 0 && hasAor2){
                data = this.getCardTypeByValue(vals2,isTongHua);
                data.isA2 = true;
            }
        }

        return data;
    },

    //两个癞子牌的情况下，同一个牌型连对和飞机的判定
    lianDuiOrFeiji:function(typeData,type){
        if(!typeData.tiArr)return false;
        if(typeData.tiArr.length != 2)return false;

        var isKeBian = false;

        if(typeData.type == TCGDCardType.LianDui
            && typeData.tiArr[0] == typeData.tiArr[1]
            && (typeData.fv - typeData.tiArr[0] != 1)){

            if(type == TCGDCardType.FeiJi){
                typeData.type = TCGDCardType.FeiJi;
                typeData.flag = 2;

                if(typeData.fv - typeData.tiArr[0] == 0){
                    typeData.fv = typeData.fv - 1;
                    typeData.tiArr = [typeData.tiArr[0]-1,typeData.tiArr[0]-2];
                }else{
                    typeData.tiArr = [typeData.tiArr[0]+1,typeData.tiArr[0]+2];
                }
            }

            isKeBian = true;
        }

        if(typeData.type == TCGDCardType.FeiJi
            && typeData.tiArr[0] != typeData.tiArr[1]){

            if(type == TCGDCardType.LianDui){
                typeData.type = TCGDCardType.LianDui;
                typeData.flag = 3;

                var maxTi = Math.max(typeData.tiArr[0],typeData.tiArr[1]);

                if(maxTi + 1 > 14){
                    typeData.tiArr = [maxTi-2,maxTi-2];
                }else{
                    typeData.fv = typeData.fv + 1;
                    typeData.tiArr = [maxTi+1,maxTi+1];
                }
            }

            isKeBian = true;
        }

        return isKeBian;
    },

    //获取提示出牌数据
    getTipCardsData:function(chuIds,handIds){
        var allTipData = [];

        var chuTypeData = this.getCardTypeData(chuIds);
        if(chuTypeData.type == 0)return allTipData;

        var deskCardType = this.getDeskCardsType();
        TCGDRoomModel.lianDuiOrFeiji(chuTypeData,deskCardType);

        var tipData = [];

        if(chuTypeData.type == TCGDCardType.DanZhang){
            tipData = this.getDanZhangTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == TCGDCardType.DuiZi){
            tipData = this.getDuiZiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == TCGDCardType.ShunZi){
            tipData = this.getShunZiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == TCGDCardType.LianDui){
            tipData = this.getLianDuiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == TCGDCardType.SanZhang){
            tipData = this.getSanZhangTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == TCGDCardType.SanDaiDui){
            tipData = this.getSanDaiDuiTipCard(chuTypeData,handIds);
        }else if(chuTypeData.type == TCGDCardType.FeiJi){
            tipData = this.getFeijiTipCard(chuTypeData,handIds,chuIds);
        }

        for(var i = 0;i<tipData.length;++i){
            allTipData.push(tipData[i]);
        }

        if(chuTypeData.type <= TCGDCardType.ZhaDan || chuTypeData.type == TCGDCardType.TongHuaShun){
            tipData = this.getZhaDanTipCard(chuTypeData,handIds);

            for(var i = 0;i<tipData.length;++i){
                allTipData.push(tipData[i]);
            }
        }

        if(chuTypeData.type <= TCGDCardType.TongHuaShun){
            tipData = this.getTongHuaShunTipCard(chuTypeData,handIds);

            for(var i = 0;i<tipData.length;++i){
                allTipData.push(tipData[i]);
            }
        }

        if(chuTypeData != TCGDCardType.TianZha){
            var tianZha = this.getTianZhaTipCard(handIds);
            if(tianZha)allTipData.push(tianZha);
        }

        return allTipData;
    },

    getDanZhangTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length <= 0)return dataArr;

        var hong2bdc = (TCGDRoomModel.intParams[11] == 1);

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;
            if(v > chuTypeData.fv){

                if(handIds[i] == 315 && hong2bdc && handIds.length > 1){
                    continue;//如果是红桃2不是最后一张选了红2不单出
                }

                dataArr.push([handIds[i]]);
            }
        }
        return dataArr;
    },

    getDuiZiTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length < 2)return dataArr;

        var hong2bdc = (TCGDRoomModel.intParams[11] == 1);

        var hong2Num = 0;

        this.sortIdByNum(handIds);
        handIds.reverse();
        for(var i = 0;i<handIds.length - 1;++i){
            var v1 = TCGDCardID[handIds[i]].v;
            var v2 = TCGDCardID[handIds[i+1]].v;

            if(handIds[i] == 315){
                hong2Num++;
                continue;
            }
            if(handIds[i+1] == 315){
                if(i == handIds.length - 2)hong2Num++;
                continue;
            }

            if(v1 == v2 && v1 > chuTypeData.fv){
                dataArr.push([handIds[i],handIds[i+1]]);
            }
        }

        if(hong2Num > 0){
            for(var i = 0;i<handIds.length;++i){
                var v1 = TCGDCardID[handIds[i]].v;

                if(handIds[i] == 315 && hong2bdc && handIds.length > 2){
                    continue;//如果是红桃2 不是最后两张 选了红2不单出
                }
                //去除掉重复红2的情况
                if(handIds[i] == 315 && (hong2Num == 1 || handIds[i+1] == 315)){
                    continue;
                }

                if(v1 <= 15 && v1 > chuTypeData.fv){
                    dataArr.push([handIds[i],315]);
                }
            }
        }

        return dataArr;
    },

    getShunZiTipCard:function(chuTypeData,handIds,isTongHua){
        var dataArr = [];
        if(handIds.length < 5)return dataArr;

        var keyData = {};
        var hongArr = [];

        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;
            if(handIds[i] == 315){
                hongArr.push(handIds[i]);
            }else{

                if(v == 15){
                    keyData[2] = handIds[i];
                }else if(v == 14){
                    keyData[1] = handIds[i];
                    keyData[14] = handIds[i];
                }else{
                    keyData[v] = handIds[i];
                }
            }
        }

        //先查找不带癞子的顺子
        for(var i = 1;i<11;++i){
            if(keyData[i]){
                var shunziArr = [keyData[i]];
                for(var j = 1;j<5;++j){
                    if(keyData[i+j]){
                        shunziArr.push(keyData[i+j]);
                    }else{
                        break;
                    }
                }

                if(shunziArr.length == 5){
                    if(isTongHua){
                        if(chuTypeData.type < TCGDCardType.ZhaDan
                            || (chuTypeData.type == TCGDCardType.ZhaDan && chuTypeData.flag <= 5)
                            || (chuTypeData.type == TCGDCardType.TongHuaShun && (i + 4) > chuTypeData.fv)){
                            dataArr.push(shunziArr);
                        }
                    }else if((i + 4) > chuTypeData.fv){
                        dataArr.push(shunziArr);
                    }
                }
            }

        }

        //再查找带癞子的顺子
        if(hongArr.length > 0){
            for(var i = 1;i<11;++i){
                var num = hongArr.length;
                var shunziArr = [];
                if(keyData[i]){
                    shunziArr.push(keyData[i]);
                }else{
                    shunziArr.push(315);
                    num--;
                }
                for(var j = 1;j<5;++j){
                    if(keyData[i+j]){
                        shunziArr.push(keyData[i+j]);
                    }else if(num > 0){
                        shunziArr.push(315);
                        num--;
                    }else{
                        break;
                    }
                }

                if(shunziArr.length == 5 && num < hongArr.length){
                    if(isTongHua){
                        if(chuTypeData.type < TCGDCardType.ZhaDan
                            || (chuTypeData.type == TCGDCardType.ZhaDan && chuTypeData.flag <= 5)
                            || (chuTypeData.type == TCGDCardType.TongHuaShun && (i + 4) > chuTypeData.fv)){
                            dataArr.push(shunziArr);
                        }
                    }else if((i + 4) > chuTypeData.fv){
                        dataArr.push(shunziArr);
                    }
                }
            }
        }

        return dataArr;
    },

    getLianDuiTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length < 6)return dataArr;

        var keyData = {};

        for(var k = 1;k<=17;++k)keyData[k] = [];

        var hongArr = [];

        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;
            if(handIds[i] == 315){
                hongArr.push(handIds[i]);
            }else{
                if(v == 15){
                    keyData[2].push(handIds[i]);
                }else if(v == 14){
                    keyData[1].push(handIds[i]);
                    keyData[14].push(handIds[i]);
                }else{
                    keyData[v].push(handIds[i]);
                }
            }
        }

        //先查找不带癞子的三连对
        for(var i = 1;i<13;++i){
            if(keyData[i].length >= 2){
                var lianduiArr = [keyData[i][0],keyData[i][1]];
                for(var j = 1;j<3;++j){
                    if(keyData[i+j].length >= 2){
                        lianduiArr.push(keyData[i+j][0]);
                        lianduiArr.push(keyData[i+j][1]);
                    }else{
                        break;
                    }
                }

                if(lianduiArr.length == 6 && (i + 2) > chuTypeData.fv){
                    dataArr.push(lianduiArr);
                }
            }
        }

        //再查找带癞子的三连对
        if(hongArr.length > 0){
            for(var i = 1;i<13;++i){
                var num = hongArr.length;
                var lianduiArr = [];
                if(keyData[i].length + num >= 2){
                    for(var t = 0;t<2;++t){
                        if(t< keyData[i].length){
                            lianduiArr.push(keyData[i][t]);
                        }else if(num > 0){
                            lianduiArr.push(315);
                            num--;
                        }
                    }
                }else{
                    continue;
                }

                for (var j = 1; j < 3; ++j) {
                    if ((keyData[i + j].length + num) >= 2) {
                        for(var t = 0;t<2;++t){
                            if(t< keyData[i+j].length){
                                lianduiArr.push(keyData[i+j][t]);
                            }else if(num > 0){
                                lianduiArr.push(315);
                                num--;
                            }
                        }
                    } else {
                        break;
                    }
                }

                if (lianduiArr.length == 6 && (i + 2) > chuTypeData.fv) {
                    if(num < hongArr.length)dataArr.push(lianduiArr);
                }

            }
        }

        return dataArr;
    },

    getSanZhangTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length < 3)return dataArr;

        var keyData = {};

        for(var k = 3;k<=17;++k)keyData[k] = [];

        var hongArr = [];

        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;
            if(handIds[i] == 315){
                hongArr.push(handIds[i]);
            }else{
                keyData[v].push(handIds[i]);
            }
        }

        //先查找不带癞子的三张
        for(var i = 3;i<=15;++i){
            if(keyData[i].length >= 3 && i > chuTypeData.fv){
                var sanzhang = [];
                for(var t = 0;t<3;++t){
                    sanzhang.push(keyData[i][t]);
                }
                dataArr.push(sanzhang);
            }
        }

        //再查找带癞子的三张
        if(hongArr.length > 0){
            for(var i = 3;i<=15;++i){
                if((keyData[i].length < 3) && (keyData[i].length + hongArr.length >= 3) && i > chuTypeData.fv){
                    var tipArr = [];
                    for(var t = 0;t<3;++t){
                        if(t < keyData[i].length)tipArr.push(keyData[i][t]);
                        else tipArr.push(315);
                    }

                    dataArr.push(tipArr);
                }
            }
        }

        return dataArr;
    },

    getSanDaiDuiTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length < 5)return dataArr;

        var keyData = {};

        for(var k = 3;k<=17;++k)keyData[k] = [];

        var hongArr = [];

        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;
            if(handIds[i] == 315){
                hongArr.push(handIds[i]);
            }else{
                keyData[v].push(handIds[i]);
            }
        }

        //先查找不带癞子的三带一对
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
                for(var j = 3;j <= 17;++j){
                    var duiArr = [];
                    if(j != sanZhangV && keyData[j].length >= 2){
                        for(var t = 0;t<2;++t){
                            duiArr.push(keyData[j][t]);
                        }
                        dataArr.push(tipArr.concat(duiArr));
                    }
                }
            }
        }

        //再查找带癞子的三带一对
        if(hongArr.length > 0){
            for(var i = 3;i<=15;++i){
                var num = hongArr.length;
                var tipArr = [];
                var sanZhangV = 0;
                //查找三张
                if((keyData[i].length + num >= 3) && i > chuTypeData.fv){
                    sanZhangV = i;
                    for (var t = 0; t < 3; ++t) {
                        if (t < keyData[i].length) {
                            tipArr.push(keyData[i][t]);
                        } else if (num > 0) {
                            tipArr.push(315);
                            num--;
                        }
                    }
                }
                //查找对子
                if(tipArr.length == 3){
                    for(var j = 3;j <= 17;++j){
                        var duiArr = [];
                        var num2 = num;
                        if (j != sanZhangV && keyData[j].length + num2 >= 2) {
                            for (var t = 0; t < 2; ++t) {
                                if (t < keyData[j].length) {
                                    duiArr.push(keyData[j][t]);
                                } else if (num2 > 0 && j < 15) {
                                    duiArr.push(315);
                                    num2--;
                                }
                            }
                        }

                        if(duiArr.length == 2 && num2 < hongArr.length){
                            dataArr.push(tipArr.concat(duiArr));
                        }
                    }

                }
            }

        }

        return dataArr;
    },

    getFeijiTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length < 6)return dataArr;

        var keyData = {};

        for(var k = 1;k<=17;++k)keyData[k] = [];

        var hongArr = [];

        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;
            if(handIds[i] == 315){
                hongArr.push(handIds[i]);
            }else{
                if(v == 15){
                    keyData[2].push(handIds[i]);
                }else if(v == 14){
                    keyData[1].push(handIds[i]);
                    keyData[14].push(handIds[i]);
                }else{
                    keyData[v].push(handIds[i]);
                }
            }
        }

        //先查找不带癞子的飞机
        for(var i = 1;i<14;++i){
            if(keyData[i].length >= 3){
                var feijiArr = [keyData[i][0],keyData[i][1],keyData[i][2]];
                for(var j = 1;j<2;++j){
                    if(keyData[i+j].length >= 3){
                        feijiArr.push(keyData[i+j][0]);
                        feijiArr.push(keyData[i+j][1]);
                        feijiArr.push(keyData[i+j][2]);
                    }else{
                        break;
                    }
                }

                if(feijiArr.length == 6 && (i + 1) > chuTypeData.fv){
                    dataArr.push(feijiArr);
                }
            }
        }

        //再查找带癞子的飞机
        if(hongArr.length > 0){
            for(var i = 1;i<14;++i){
                var num = hongArr.length;
                var feijiArr = [];
                if(keyData[i].length + num >= 3){
                    for(var t = 0;t<3;++t){
                        if(t < keyData[i].length){
                            feijiArr.push(keyData[i][t]);
                        }else if(num > 0){
                            feijiArr.push(315);
                            num--;
                        }
                    }
                }else{
                    continue;
                }

                for (var j = 1; j < 2; ++j) {
                    if (keyData[i + j].length + num >= 3) {
                        for(var t = 0;t<3;++t){
                            if(t < keyData[i+j].length){
                                feijiArr.push(keyData[i+j][t]);
                            }else if(num > 0){
                                feijiArr.push(315);
                                num--;
                            }
                        }
                    } else {
                        break;
                    }
                }

                if (feijiArr.length == 6 && (i + 1) > chuTypeData.fv) {
                    if(num < hongArr.length)dataArr.push(feijiArr);
                }

            }
        }

        return dataArr;
    },

    getZhaDanTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length < 4)return dataArr;
        var keyData = {};

        for(var k = 3;k<=17;++k)keyData[k] = [];

        var hongArr = [];

        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;
            if(handIds[i] == 315){
                hongArr.push(handIds[i]);
            }else{
                keyData[v].push(handIds[i]);
            }
        }

        var hasData  = {};
        //先查找不带癞子的炸弹
        for(var i = 3;i<=15;++i){
            var num = keyData[i].length;
            if((chuTypeData.type == TCGDCardType.TongHuaShun && num > 5)
                || (chuTypeData.type == TCGDCardType.ZhaDan && num > chuTypeData.flag)
                || (chuTypeData.type == TCGDCardType.ZhaDan && num == chuTypeData.flag && i > chuTypeData.fv)
                || (chuTypeData.type < TCGDCardType.ZhaDan && num >= 4)){

                var tipArr = [];
                for(var t = 0;t<keyData[i].length;++t){
                    tipArr.push(keyData[i][t]);
                }
                dataArr.push(tipArr);

                hasData[i] = 1;
            }
        }

        //再查找带癞子的炸弹
        if(hongArr.length > 0){
            for(var i = 3;i<=15;++i){
                var num = keyData[i].length + hongArr.length;

                if((chuTypeData.type == TCGDCardType.TongHuaShun && num > 5)
                    || (chuTypeData.type == TCGDCardType.ZhaDan && num > chuTypeData.flag)
                    || (chuTypeData.type == TCGDCardType.ZhaDan && num == chuTypeData.flag && i > chuTypeData.fv)
                    || (chuTypeData.type < TCGDCardType.ZhaDan && num >= 4)){

                    var tipArr = [];
                    for(var t = 0;t<num;++t){
                        if(t < keyData[i].length)tipArr.push(keyData[i][t]);
                        else tipArr.push(315);
                    }
                    if(!hasData[i])dataArr.push(tipArr);
                }
            }
        }

        return dataArr;
    },

    getTongHuaShunTipCard:function(chuTypeData,handIds){
        var dataArr = [];

        if(handIds.length < 5)return dataArr;

        var cardData = {1:[],2:[],3:[],4:[],5:[]};

        var hongArr = [];
        for(var i = 0;i<handIds.length;++i){
            var t = TCGDCardID[handIds[i]].t;
            if(handIds[i] == 315){
                hongArr.push(315);
            }else{
                cardData[t].push(handIds[i]);
            }

        }

        for(var k = 1;k<5;++k){
            var tipCard = this.getShunZiTipCard(chuTypeData,cardData[k].concat(hongArr),true);
            for(var i = 0;i<tipCard.length;++i){
                dataArr.push(tipCard[i]);
            }
        }
        return dataArr;
    },

    //获取所有顺子
    getAllShunZi:function(handIds){
        var allShunZi = [];

        if(handIds.length < 5)return allShunZi;

        var keyData = {};
        var hongArr = [];
        for(var i = 0;i<handIds.length;++i){
            var v = TCGDCardID[handIds[i]].v;

            if(handIds[i] == 315){
                hongArr.push(handIds[i]);
            } else if (v == 15) {
                keyData[2] = handIds[i];
            } else if (v == 14) {
                keyData[1] = handIds[i];
                keyData[14] = handIds[i];
            } else {
                keyData[v] = handIds[i];
            }

        }
        var hasData = {};
        //先获取不带癞子的顺子
        for(var i = 1;i<11;++i){
            var shunziArr = [];
            if (keyData[i]) {
                shunziArr.push(keyData[i]);

                for (var j = 1; j < 5; ++j) {
                    if (keyData[i + j]) {
                        shunziArr.push(keyData[i + j]);
                    } else {
                        break;
                    }
                }
            }

            if (shunziArr.length == 5) {
                hasData[i] = 1;
                allShunZi.push(shunziArr);
            }
        }

        //再获取带癞子的顺子
        for(var i = 1;i<11;++i){
            if(hasData[i])continue;

            var num = hongArr.length;

            var shunziArr = [];
            if (keyData[i]) {
                shunziArr.push(keyData[i]);
            } else if(num > 0){
                shunziArr.push(315);
                num--;
            }
            for (var j = 1; j < 5; ++j) {
                if (keyData[i + j]) {
                    shunziArr.push(keyData[i + j]);
                } else if (num > 0) {
                    shunziArr.push(315);
                    num--;
                } else {
                    break;
                }
            }

            if (shunziArr.length == 5 && num < hongArr.length){
                allShunZi.push(shunziArr);
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
            var numa = cardNumData[TCGDCardID[a].v];
            var numb = cardNumData[TCGDCardID[b].v];

            if(numa != numb){
                return numb - numa;
            }else{
                var cfg_a = TCGDCardID[a];
                var cfg_b = TCGDCardID[b];
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
            var cfg_a = TCGDCardID[a];
            var cfg_b = TCGDCardID[b];
            if(cfg_a.v == cfg_b.v){
                return cfg_b.t - cfg_a.t;
            }else{
                return cfg_b.v - cfg_a.v;
            }
        });
    },

    sortIdByType:function(ids){
        ids.sort(function(a,b){
            var cfg_a = TCGDCardID[a];
            var cfg_b = TCGDCardID[b];
            if(cfg_a.t == cfg_b.t){
                return cfg_b.v - cfg_a.v;
            }else{
                return cfg_b.t - cfg_a.t;
            }
        });
    },

    //根据红2代替的牌牌序
    sortIdByZuanPai:function(ids,tiArr,isA2){
        var cardNumData = {};

        var tiIdx = 0;
        for(var i = 0;i<ids.length;++i){
            var v = TCGDCardID[ids[i]].v;
            if(ids[i] == 315 && tiIdx < tiArr.length){
                v = tiArr[tiIdx];
                tiIdx++;
            }else if(isA2){
                if(v == 15)v = 2;
                if(v == 14)v = 1;
            }

            if(!cardNumData[v])cardNumData[v] = 1;
            else cardNumData[v]++;
        }

        var num = 0;
        if(tiArr)num = tiArr.length;

        for (var i = 0; i < ids.length; ++i) {
            if (ids[i] == 315 && num > 0) {
                ids[i] = 1000 + num - 1;
                num--;
            }
        }

        ids.sort(function(a,b){
            var va = 0;
            var vb = 0;

            var ta = 0;
            var tb = 0;

            if(a >= 1000){
                va = tiArr[a-1000];
                ta = 6;
            }else{
                va = TCGDCardID[a].v;
                ta = TCGDCardID[a].t;

                if(isA2){
                    if(va == 15)va = 2;
                    if(va == 14)va = 1;
                }
            }

            if(b >= 1000){
                vb = tiArr[b-1000];
                tb = 6;
            }else{
                vb = TCGDCardID[b].v;
                tb = TCGDCardID[b].t;

                if(isA2){
                    if(vb == 15)vb = 2;
                    if(vb == 14)vb = 1;
                }
            }

            var numa = cardNumData[va];
            var numb = cardNumData[vb];

            if(numa != numb){
                return numb - numa;
            }else if(va != vb){
                return va - vb;
            }else{
                return ta - tb;
            }
        });

        for (var i = 0; i < ids.length; ++i) {
            if (ids[i] >= 1000) {
                ids[i] = 315;
            }
        }

    },

    getCardNumData:function(ids){
        var data = {};
        for(var i = 0;i<ids.length;++i){
            var v = TCGDCardID[ids[i]].v;
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
        return TCGDRoomLayer;
    },

    getSamllResultLayer:function(){
        return TCGDSmallResultLayer;
    },

    getBigResultLayer:function(){
        return TCGDBigResultLayer;
    },
};