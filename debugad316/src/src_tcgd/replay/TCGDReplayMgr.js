/**
 * Created by cyp on 2019/11/13.
 */
var TCGDReplayMgr = {
    tablesArr:[],
    msgArr:[],
    resultData:null,
    cleanData:function(){
        this.tablesArr = [];
        this.msgArr = [];
        this.resultData = null;//结算数据
    },

    handleReplayData:function(hfData){
        this.cleanData();

        var build = MsgHandler.getResBuilder(5002);
        var tableClass = build.builder.build("CreateTableRes");
        var data = new tableClass();

        var closingMsg = JSON.parse(hfData.closingMsg);

        this.resultData = {};
        this.resultData.ext = closingMsg.ext || [];
        this.resultData.closingPlayers = [];

        data.replay = true;
        data.wanfa = hfData.playType;
        data.renshu = hfData.maxPlayerCount;
        data.tableId = hfData.tableId;
        data.roomName = "";
        if(hfData.generalExt){
            var ext = JSON.parse(hfData.generalExt);
            if(ext.roomName)data.roomName =ext.roomName;
        }
        data.nowBurCount = hfData.playCount;
        data.totalBurCount = hfData.totalCount;
        data.remain = 2;
        data.intParams = closingMsg.intParams;
        data.tableType = 0;
        if(data.roomName)data.tableType = 1;
        data.nextSeat = 1;
        data.ext = [0,0,0,0,0,0];
        data.scoreCard = [];

        var playLogs = hfData.play.split(";");

        for(var i=0;i<hfData.resList.length;i++){
            var playerData = JSON.parse(hfData.resList[i]);
            this.resultData.closingPlayers.push(playerData);

            var pClass = build.builder.build("PlayerInTableRes");
            var p = new pClass();
            p.userId = playerData.userId;
            p.name = playerData.name;
            p.seat = playerData.seat;
            p.sex = playerData.sex;
            p.icon = playerData.icon;
            p.point = playerData.point;
            p.credit = playerData.credit;
            p.handCardIds = [];
            if(playLogs[p.seat - 1]){
                p.handCardIds = playLogs[p.seat - 1].split(",");
            }
            p.outCardIds = [];
            p.moldIds = [];
            p.outedIds = [];
            p.ext = [0,0,0,0,0,0,0,0, p.handCardIds.length];

            data.players.push(p);

        }

        var stepsData = [];
        for(var i = data.renshu;i<playLogs.length;++i){
            if(playLogs[i]){
                stepsData.push(JSON.parse(playLogs[i]));
            }
        }

        for(var i = 0;i<stepsData.length;++i){
            if(stepsData[i].action == 5 || stepsData[i].action == 0){
                data.nextSeat = stepsData[i].seat;
                break;
            }
        }

        this.tablesArr.push(data);
        this.msgArr.push({type:TCGDTabelType.CreateTable,data:data});


        this.handStepMsg(stepsData);
    },

    handStepMsg:function(stepsData){

        var youIdx = 1;

        for(var idx = 0;idx<stepsData.length;++idx){
            var step = stepsData[idx];

            var msg = {};
            var table = ObjectUtil.deepCopy(this.tablesArr[this.tablesArr.length - 1]);

            if(step.action == 0 || step.action == 1){//出牌，不要
                msg.type = TCGDTabelType.PlayCard;
                msg.data = {};
                msg.data.cardType = step.action;
                msg.data.cardIds = step.vals;
                msg.data.seat = step.seat;
                msg.data.nextSeat = step.nextSeat;
                msg.data.isLet = step.fen || 0;//出牌牌型
                msg.data.isBt = 0;
                msg.data.isClearDesk = step.over;
                msg.data.curScore = 0;
                msg.data.isFirstOut = 0;

                if(step.fenCards && step.fenCards[0]){
                    msg.data.isFirstOut = step.fenCards[0];
                }

                table.nextSeat = step.nextSeat;

                for (var i = 0; i < table.players.length; ++i) {
                    var p = table.players[i];

                    if (p.seat == msg.data.seat) {
                        p.handCardIds = TCGDRoomModel.delCardWithArr(p.handCardIds, msg.data.cardIds);

                        if(p.handCardIds.length == 0){
                            msg.data.isBt = youIdx;
                            youIdx++;
                        }

                        p.outCardIds = msg.data.cardIds;
                        p.outedIds = [];//用于显示报王，操作后清掉
                        p.ext[5] = msg.data.cardType;
                        if (msg.data.isBt > 0)p.ext[7] = msg.data.isBt;//上游，二游，三游，四游
                        if (msg.data.cardType == 0) {
                            p.ext[8] -= msg.data.cardIds.length;//剩余牌数
                        }
                        p.ext[1] = msg.data.isLet || 0;
                    } else if (msg.data.cardType == 0) {
                        p.outCardIds = [];//有人出牌，清理掉其他人的出牌数据
                        p.ext[5] = 0;

                    }
                }

                if (msg.data.isBt == 3) {//第三个人出完牌，给下游赋值
                    for (var i = 0; i < table.players.length; ++i) {
                        var p = table.players[i];
                        if (!p.ext[7])p.ext[7] = 4;
                    }
                }

                if (msg.data.isClearDesk) {
                    for (var i = 0; i < table.players.length; ++i) {
                        var p = table.players[i];
                        p.outCardIds = [];//打完一轮清理出的牌
                    }
                }


            }else if(step.action == 4){//分组
                msg.type = TCGDTabelType.FenZu;
                msg.data = {};

                var config = {};

                for(var i = 0;i<table.players.length;++i){
                    var p = table.players[i];
                    config[p.seat] = 2;
                }
                //分组1的座位号
                for(var i = 0;i<step.vals.length;++i){
                    config[step.vals[i]] = 1;
                }

                var temp = [];
                for(var k in config){
                    temp.push({seat:k,team:config[k]});
                }

                msg.data.strParams = [JSON.stringify(temp)];

                table.remain = 2;

                for(var i = 0;i<table.players.length;++i){
                    var p = table.players[i];
                    if(config[p.seat]){
                        p.ext[6] = config[p.seat];
                    }
                }

            }else if(step.action == 5) {//选独战
                msg.type = TCGDTabelType.XuanDuZhan;
                msg.data = {};

                var params = [];
                params[0] = step.seat;
                params[1] = step.vals[0];
                params[2] = step.nextSeat;

                msg.data.params = params;

                table.nextSeat = params[2];
                if (params[1] == 1) {
                    table.remain = 2;
                    table.banker = table.ext[1] = params[0];
                }
            }else if(step.action == 6){//明牌

                msg.type = TCGDTabelType.MingPai;
                msg.data = {};

                msg.data.params = [step.seat];
                msg.data.strParams = [];

                for(var i = 0;i<table.players.length;++i){
                    var p = table.players[i];
                    if (p.seat == step.seat) {
                        p.shiZhongCard = 1;
                        break;
                    }
                }

            }else if(step.action == 100){//托管
                msg.type = TCGDTabelType.ChangeTuoGuan;
                msg.data = {};

                var seat = step.seat;
                var tuoguan = step.vals[0];

                msg.data.params = [seat,tuoguan];

                for(var i = 0;i<table.players.length;++i){
                    var p = table.players[i];
                    if (p.seat == seat) {
                        p.ext[3] = tuoguan;
                        break;
                    }
                }

            }

            if(msg.type){
                this.msgArr.push(msg);
                this.tablesArr.push(table);
            }
        }

    },

    runReplay:function(hfData){
        this.handleReplayData(hfData);

        if(this.msgArr.length > 0){

            var layerClass = TCGDRoomModel.getRoomLayerById();
            var layer = new layerClass();

            var ctrLayer = new TCGDReplayCtrLayer();
            ctrLayer.setShowStep();
            layer.addChild(ctrLayer,100);

            PopupManager.addPopup(layer);

            var table = ObjectUtil.deepCopy(this.tablesArr[0]);
            TCGDRoomModel.init(table);
            layer.handleTableData(TCGDTabelType.CreateTable,table);

        }else{
            FloatLabelUtil.comText("回放数据错误");
        }
    },



    sendTableMsg:function(step){
        if(this.tablesArr.length <=0)return false;
        if(step >= this.tablesArr.length)step = this.tablesArr.length - 1;

        var table = ObjectUtil.deepCopy(this.tablesArr[step]);

        TCGDRoomModel.init(table);
        SyEventManager.dispatchTableEvent(TCGDTabelType.CreateTable,table);
    },

    sendPlayMsg:function(step){
        if(this.msgArr.length <=0)return false;
        if(step >= this.msgArr.length)step = this.msgArr.length - 1;

        var msgData = ObjectUtil.deepCopy(this.msgArr[step].data);

        SyEventManager.dispatchTableEvent(this.msgArr[step].type,msgData);
    },

    sendOverMsg:function(){
        SyEventManager.dispatchTableEvent(TCGDTabelType.OnOver,this.resultData);
    },

}
