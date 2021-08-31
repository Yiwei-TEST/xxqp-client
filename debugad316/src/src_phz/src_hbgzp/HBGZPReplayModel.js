/**
 * Created by Administrator on 2019/12/4.
 */

var HBGZPRePlayModel = {
    players:[],
    steps:[],
    step:0,
    tableId:0,//房号
    playCount:0,
    mySeat:0,
    dataByStep:{},
    outSeatByStep:{},
    closingData:[],
    init:function(data,isDaiKai){
        HBGZPSetModel.init();
        cc.log("this.data为:"+JSON.stringify(data));
        this.players.length = 0;
        this.dataByStep = {};
        this.outSeatByStep = {};
        this.playCount = data.playCount;
        this.tableId = data.tableId;
        this.playType = data.playType;
        if(data.generalExt){
            var ext = JSON.parse(data.generalExt);
            // cc.log("ext.roomName =",ext.roomName);
            if(ext.roomName){
                this.roomName =ext.roomName;
            }
        }
        if(data.resList.length==3){
            this.seatSeq={1:[1,2,3],2:[2,3,1],3:[3,1,2]};
        }else if(data.resList.length==2){
            this.seatSeq={1:[1,2],2:[2,1]};
        }else{
            this.seatSeq = {1:[1,2,3,4],2:[2,3,4,1],3:[3,4,1,2],4:[4,1,2,3]};
        }
        this.closingData.length=0;
        //resList:data中保存的玩家信息
        // cc.log("****************** =",JSON.stringify(data.resList));
        for(var i=0;i<data.resList.length;i++){
            this.players.push(JSON.parse(data.resList[i]));
            this.closingData.push(JSON.parse(data.resList[i]));
        }
        //cc.log("  this.players = ",this.players.length);
        var closingMsg = JSON.parse(data.closingMsg);
         //cc.log("closingMsg =",JSON.stringify(closingMsg));
        ClosingInfoModel.ext = closingMsg.ext;
        ClosingInfoModel.isReplay = true;
        ClosingInfoModel.cards = closingMsg.cards || [];
        ClosingInfoModel.leftCards = closingMsg.leftCards || [];
        ClosingInfoModel.tun = closingMsg.tun || 0;
        ClosingInfoModel.fan = closingMsg.fan || 0;
        ClosingInfoModel.huxi = closingMsg.huxi || 0;
        ClosingInfoModel.huSeat = closingMsg.huSeat || 0;
        ClosingInfoModel.huCard = closingMsg.huCard || 0;
        ClosingInfoModel.totalTun = closingMsg.totalTun || 0;
        ClosingInfoModel.fanTypes = closingMsg.fanTypes || [];
        ClosingInfoModel.firstCard = closingMsg.firstCard;
        ClosingInfoModel.startLeftCards = closingMsg.startLeftCards || [];
        ClosingInfoModel.chouCards = closingMsg.chouCards || [];
        ClosingInfoModel.intParams = closingMsg.intParams || [];
        ClosingInfoModel.allCardsCombo = closingMsg.allCardsCombo || [];
        HBGZPRoomModel.wanfa = closingMsg.ext[3];
        HBGZPRoomModel.renshu = ClosingInfoModel.allCardsCombo.length;

        this.intParams = closingMsg.intParams || [];
        this.time = data.time.substr(0,16);
        //把play中的字符串根据分号分隔成数组
        var playLogs = data.play.split(";");
        var tempSeat = 0 ;
        // cc.log("playLogs =",JSON.stringify(playLogs));
        // for(var i=0;i<this.players.length;i++){
        //     var temp = playLogs[i].split("_");
        //     if(temp.length>=3){
        //         if(parseInt(temp[1])==16)//新增的弹框选择动作，先过滤掉
        //             tempSeat = i+1;
        //     }
        // }

        for(var i=0;i<this.players.length;i++){
            for(var j=0;j<this.players.length;j++){
                if(this.players[j].seat == (i+1)){
                    // this.players[j].handCardIds = playLogs[i+tempSeat].split(",");
                    this.players[j].handCardIds = playLogs[i+1].split(",");
                    //获取开始时手上的牌
                    // cc.log("this.players[j].handCardIds =",JSON.stringify(this.players[j].handCardIds));
                }
            }
        }
        this.steps.length = 0;
        this.step = 0;
        // for(var i = 0;i<playLogs.length;i++){
        // cc.log("playLogs =",JSON.stringify(playLogs));

        for(;i<playLogs.length;i++){
            var temp = playLogs[i].split("_");
            if(temp.length>=3){
                if(parseInt(temp[1])==12)//新增的弹框选择动作，先过滤掉
                    continue;
                this.steps.push(temp);
            }
        }
        if(!this.getPlayerVo()){
            this.mySeat = this.players[0].seat;
        }else{
            this.mySeat = this.getPlayerVo().seat;
        }

        this.checkTuoGuan();
    },

    checkTuoGuan:function(){
        this.tgState = {1:[0],2:[0],3:[0],4:[0]};
        var curState = {1:0,2:0,3:0,4:0};
        for(var i = 0;i<this.steps.length;++i){
            var data = this.steps[i];
            if(data[1] == 100){
                curState[data[0]] = Number(data[2].split(",")[0]);
            }
            for(var key in this.tgState){
                this.tgState[key].push(curState[key]);
            }
        }
    },

    //获取玩家
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
    //获取玩家序号
    getPlayerSeq:function(userId,seat){
        if(userId == PlayerModel.userId){
            return 1;
        }
        var seqArray = this.seatSeq[this.mySeat];
        var seq = ArrayUtil.indexOf(seqArray,seat)+1;
        return seq;
    },

    ff:function(){
        if(this.step<this.steps.length){
            this.step++;
        }
    },
    getPlayerBySeat:function(seat){
        var userId = 0;
        for(var j=0;j<this.players.length;j++){
            var p = this.players[j];
            if(p.seat == seat){
                userId = p.userId;
                break;
            }
        }
        return userId;
    },
    getCurrentlyStep:function(){
        var temp = this.steps[this.step];
        if(!temp){
            return null;
        }
        var stepVo = {};
        stepVo.seat = parseInt(temp[0]);
        stepVo.action = parseInt(temp[1]);
        stepVo.ids = temp[2]?temp[2].split(","):0;
        stepVo.type = temp.length>3?temp[3]:0;
        return stepVo;
    },

    getDataByStep:function(step,direct){
        var prefix = step+"_"+direct;
        return this.dataByStep[prefix];
    },
    //获取上一个出牌的位置
    getLastOutSeatByStep:function(step){
        return this.outSeatByStep[step];
    },
    //保存上一个出牌的位置
    saveLastOutSeatByStep:function(step,seat){
        seat = (step==-1)?-1:seat;
        this.outSeatByStep[step] = seat;
    },
    saveDataByStep:function(step,direct,data1,data2,data3){
        var prefix = step+"_"+direct;
        if(!this.dataByStep[prefix]){
            this.dataByStep[prefix] = {data1:data1,data2:data2,data3:data3}
        }
    }

}