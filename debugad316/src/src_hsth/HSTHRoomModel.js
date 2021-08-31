/**
 * Created by cyp on 2019/11/13.
 */

//一样的消息保持和三打哈一致，就不需要额外添加消息推送了
var HSTHTabelType = {
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
var HSTHCardID = {
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

var HSTHCardType = {
    DanZhang:1,//单牌
    DuiZi:2,//对子
    SanZhang:3,//三张
    ZhaDan:4,//炸弹
    TongHua:5,//同花
}

var HSTHRoomModel = {
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
        this.creditXpkf = message.creditConfig[11] / 100;
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
        if(type == HSTHTabelType.JoinTable){
            var newPlayer = data.player;
            checkState = false;
            if(this.players.length<HSTHRoomModel.renshu){
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
        }else if(type == HSTHTabelType.ExitTable){
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
        }else if(type == HSTHTabelType.ChangeState){
            var seat = data.params[0];
            for(var i=0;i<this.players.length;i++){
                var p = this.players[i];
                if(p.seat == seat){
                    p.status = 1;
                    break;
                }
            }
        }else if(type == HSTHTabelType.ChangeOnLine) {
            var seat = data[0];
            for (var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                if (p.seat == seat) {
                    p.recover[0] = data[1];
                    break;
                }
            }
        }else if(type == HSTHTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];

            for(var i = 0;i<this.players.length;++i){
                var p = this.players[i];
                if (p.seat == seat) {
                    p.ext[3] = tuoguan;
                    break;
                }
            }
        }else if(type == HSTHTabelType.DealCard) {
            var p = this.getPlayerDataByItem("seat", this.mySeat);
            p.handCardIds = data.handCardIds;
            this.nextSeat = data.nextSeat;
            this.remain = data.remain;

            for(var i = 0;i<this.players.length;++i){
                //发牌后的剩余牌数量
                this.players[i].ext[8] = data.handCardIds.length;
            }

        }else if(type == HSTHTabelType.FenZu){
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

        }else if(type == HSTHTabelType.PlayCard) {
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
                    p.ext[11] += data.isFirstOut;//喜分
                    if (data.isBt > 0)p.ext[7] = data.isBt;//上游，二游，三游，四游
                    if (data.cardType == 0) {
                        p.ext[8] -= data.cardIds.length;//剩余牌数
                    }
                    chuTeam = p.ext[6];
                } else if (data.cardType == 0) {
                    p.outCardIds = [];//有人出牌，清理掉其他人的出牌数据
                    p.ext[5] = 0;

                    if(data.isFirstOut > 0){
                        if(this.renshu == 2){
                            p.ext[11] -= data.isFirstOut;
                        }else{
                            p.ext[11] -= data.isFirstOut/3;
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
        }else if(type == HSTHTabelType.ShowTeamCard) {
            for (var i = 0; i < this.players.length; ++i) {
                var p = this.players[i];
                if (p.seat == this.mySeat) {
                    p.moldIds = data.params || [];
                }
            }
        }else if(type == HSTHTabelType.BaoWang){

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

        }else if(type == HSTHTabelType.OnOver){
            this.remain = 0;
        }else if(type == HSTHTabelType.MingPai){
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
        return HSTHCardID[id].v;
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

        if(typeData2.type == HSTHCardType.TongHua){
            //除了天炸，同花顺最大
            if(typeData1.type < HSTHCardType.TongHua)return true;

            if(typeData1.type == HSTHCardType.TongHua){
                //同花之间比较个数
                if(typeData2.flag > typeData1.flag)return true;
                //个数相同比较牌值大小
                if(typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv)return true;
                //牌值也相同比较花色
                if(typeData2.flag == typeData1.flag && typeData2.fv == typeData1.fv && typeData2.ft > typeData1.ft)return true;
            }
        }

        if(typeData2.type == HSTHCardType.ZhaDan){
            //炸弹比普通牌型大
            if(typeData1.type < HSTHCardType.ZhaDan)return true;

            if(typeData1.type == HSTHCardType.ZhaDan){
                //炸弹之间比较个数
                if(typeData2.flag > typeData1.flag)return true;
                //个数相同比较牌值大小
                if(typeData2.flag == typeData1.flag && typeData2.fv > typeData1.fv)return true;
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

        var data = {type:0,flag:0,fv:0,ft:0};
        //flag:保存牌型的数量类型
        //fv:保存判断相同牌型大小的最大值

        if(ids.length == 1){
            data.type = HSTHCardType.DanZhang;
            data.flag = 1;
            data.fv = HSTHCardID[ids[0]].v;
        } else if(ids.length == 2){
            if(HSTHCardID[ids[0]].v == HSTHCardID[ids[1]].v){
                data.type = HSTHCardType.DuiZi;
                data.fv = HSTHCardID[ids[0]].v;
                data.flag = 2;
            }
        }else if(ids.length == 3){
            var cfg1 = HSTHCardID[ids[0]];
            var cfg2 = HSTHCardID[ids[1]];
            var cfg3 = HSTHCardID[ids[2]];

            if(cfg1.v == cfg2.v && cfg1.v == cfg3.v){
                data.type = HSTHCardType.SanZhang;
                data.fv = HSTHCardID[ids[0]].v;
                data.flag = 3;
            }
        }else if(ids.length >= 4){

            var isTongHua = true;
            var isEqual = true;

            for (var i = 1; i < ids.length; ++i) {
                var cfg1 = HSTHCardID[ids[i - 1]];
                var cfg2 = HSTHCardID[ids[i]];
                if (cfg1.v != cfg2.v)isEqual = false;
                if(cfg1.t != cfg2.t)isTongHua = false;
            }

            var limitNum = 4;
            if(this.intParams[4] >= 10)limitNum = 5;

            if(isEqual){
                if(isTongHua && ids.length >= limitNum){
                    data.type = HSTHCardType.TongHua;
                    data.flag = ids.length;
                    data.fv = HSTHCardID[ids[0]].v;
                    data.ft = HSTHCardID[ids[0]].t;
                }else{
                    data.type = HSTHCardType.ZhaDan;
                    data.flag = ids.length;
                    data.fv = HSTHCardID[ids[0]].v;
                }
            }
        }

        return data;
    },

    //获取提示出牌数据
    getTipCardsData:function(chuIds,handIds){
        var allTipData = [];

        var chuTypeData = this.getCardTypeData(chuIds);
        if(chuTypeData.type == 0)return allTipData;

        var data = this.handleCards(handIds);

        for(var i = 0;i<data.length;++i){
            if(this.isCardTypeBig(chuTypeData,data[i])){
                allTipData.push(data[i].ids);
            }else if(chuTypeData.type < HSTHCardType.ZhaDan
                && data[i].type < HSTHCardType.ZhaDan
                && data[i].flag > chuTypeData.flag
                && data[i].fv > chuTypeData.fv){

                allTipData.push(data[i].ids.slice(0,chuTypeData.flag));
            }
        }

        return allTipData;
    },

    //把数量多的牌优先排在前面，再按牌值大小排序
    sortIdByNum:function(ids){
        var cardNumData = this.getCardNumData(ids);

        ids.sort(function(a,b){
            var numa = cardNumData[HSTHCardID[a].v];
            var numb = cardNumData[HSTHCardID[b].v];

            if(numa != numb){
                return numb - numa;
            }else{
                var cfg_a = HSTHCardID[a];
                var cfg_b = HSTHCardID[b];
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
            var cfg_a = HSTHCardID[a];
            var cfg_b = HSTHCardID[b];
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
            var v = HSTHCardID[ids[i]].v;
            if(!data[v])data[v] = 1;
            else data[v]++;
        }
        return data;
    },

    handleCards:function(cardIds,tonghua_left){
        var ids = ObjectUtil.deepCopy(cardIds);

        this.sortIdByNum(ids);

        var limitNum = 4;
        if(this.intParams[4] >= 10)limitNum = 5;

        var retData = [];

        //先提出同花
        for(var i = 0;i<ids.length;++i){
            var cfg1 = HSTHCardID[ids[i]];

            var tempIds = [ids[i]];
            for(var j = i+1;j<ids.length;++j){
                var cfg2 = HSTHCardID[ids[j]];
                if(cfg1.v == cfg2.v && cfg1.t == cfg2.t){
                    tempIds.push(ids[j]);
                }else{
                    break;
                }
            }

            if(tempIds.length >= limitNum){
                var item = {};
                item.type = HSTHCardType.TongHua;
                item.fv = cfg1.v;
                item.ft = cfg1.t;
                item.flag = tempIds.length;
                item.ids = tempIds;
                retData.push(item);

                ids.splice(i,tempIds.length);
                i--;
            }
        }

        for(var i = 0;i<ids.length;++i){
            var cfg1 = HSTHCardID[ids[i]];

            var tempIds = [ids[i]];
            for(var j = i+1;j<ids.length;++j){
                var cfg2 = HSTHCardID[ids[j]];
                if(cfg1.v == cfg2.v){
                    tempIds.push(ids[j]);
                }else{
                    break;
                }
            }

            var item = {};
            item.fv = cfg1.v;
            item.ft = 0;
            item.flag = tempIds.length;
            item.ids = tempIds;
            if(tempIds.length >= 4){
                item.type = HSTHCardType.ZhaDan;
            }else if(tempIds.length == 3){
                item.type = HSTHCardType.SanZhang;
            }else if(tempIds.length == 2){
                item.type = HSTHCardType.DuiZi;
            }else{
                item.type = HSTHCardType.DanZhang;
            }

            retData.push(item);

            i += (tempIds.length - 1);
        }

        retData.sort(function(a,b){
            var tempa = a.type;
            var tempb = b.type;

            if(tonghua_left){
                if(tempa == HSTHCardType.TongHua)tempa = 0;
                if(tempb == HSTHCardType.TongHua)tempb = 0;
            }

            if(tempa != tempb)return tempa - tempb;
            else if(a.flag != b.flag)return a.flag - b.flag;
            else if(a.fv != b.fv)return a.fv - b.fv;
            else return a.ft - b.ft;
        });

        return retData;

    },

    //玩家的房内头像是否已经绘制完全
    isRoomIconRoad: function() {
        return true;
    },

    getRoomLayerById:function(){
        return HSTHRoomLayer;
    },

    getSamllResultLayer:function(){
        return HSTHSmallResultLayer;
    },

    getBigResultLayer:function(){
        return HSTHBigResultLayer;
    },
};