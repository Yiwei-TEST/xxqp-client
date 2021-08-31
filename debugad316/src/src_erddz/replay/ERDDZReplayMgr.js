/**
 * Created by cyp on 2019/11/13.
 */
var ERDDZReplayMgr = {
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
        data.remain = 3;
        data.intParams = closingMsg.intParams;
        data.tableType = 0;
        if(data.roomName)data.tableType = 1;
        data.nextSeat = 1;
        data.ext = [0,0,0,0,0,0];
        data.scoreCard = [];
        data.strExt = ["0,0,0"];

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
            p.ext = [0,-1,0,0,0,0,0,0, p.handCardIds.length];

            data.players.push(p);

        }

        var stepsData = [];
        for(var i = data.renshu;i<playLogs.length;++i){
            if(playLogs[i]){
                stepsData.push(JSON.parse(playLogs[i]));
            }
        }

        for(var i = 0;i<stepsData.length;++i){
            if(stepsData[i].action == 3){
                data.nextSeat = stepsData[i].seat;
                break;
            }
        }

        this.tablesArr.push(data);
        this.msgArr.push({type:ERDDZTabelType.CreateTable,data:data});


        this.handStepMsg(stepsData);
    },

    handStepMsg:function(stepsData){

        var youIdx = 1;

        for(var idx = 0;idx<stepsData.length;++idx){
            var step = stepsData[idx];

            var msg = {};
            var table = ObjectUtil.deepCopy(this.tablesArr[this.tablesArr.length - 1]);

            if(step.action == 0 || step.action == 1) {//出牌，不要
                msg.type = ERDDZTabelType.PlayCard;
                msg.data = {};
                msg.data.cardType = step.action;
                msg.data.cardIds = step.vals;
                msg.data.seat = step.seat;
                msg.data.nextSeat = step.nextSeat;
                msg.data.isLet = step.islet || 0;//谁赢分
                msg.data.isBt = 0;
                msg.data.isClearDesk = step.over;
                msg.data.curScore = step.fen;

                if(idx == stepsData.length - 1){
                    msg.data.isClearDesk = false;
                }

                table.nextSeat = step.nextSeat;

                for (var i = 0; i < table.players.length; ++i) {
                    var p = table.players[i];

                    if (p.seat == msg.data.seat) {
                        p.handCardIds = ERDDZRoomModel.delCardWithArr(p.handCardIds, msg.data.cardIds);

                        if (p.handCardIds.length == 0) {
                            msg.data.isBt = youIdx;
                            youIdx++;
                        }

                        if (msg.data.curScore > 0) {
                            table.ext[22] *= msg.data.curScore;
                        }

                        p.outCardIds = msg.data.cardIds;
                        p.outedIds = [];//用于显示报王，操作后清掉
                        p.ext[5] = msg.data.cardType;
                        if (msg.data.cardType == 0) {
                            p.ext[8] -= msg.data.cardIds.length;//剩余牌数
                        }
                    } else if (msg.data.cardType == 0) {
                        p.outCardIds = [];//有人出牌，清理掉其他人的出牌数据
                        p.ext[5] = 0;

                    }
                }

                if (msg.data.isClearDesk) {
                    for (var i = 0; i < table.players.length; ++i) {
                        var p = table.players[i];
                        p.outCardIds = [];//打完一轮清理出的牌
                    }
                }
            }else if(step.action == 3) {//叫地主
                msg.type = ERDDZTabelType.JiaoDiZhu;
                msg.data = {};
                msg.data.params = [step.seat, step.param, step.nextSeat];

                var seat = msg.data.params[0];
                table.nextSeat = msg.data.params[2];
                if (msg.data.params[1] == 1) {//叫了地主进入抢地主阶段
                    table.ext[22] = 1;//倍数
                    table.ext[23] = 1;//让牌
                    table.remain = 4;
                }

                //保存叫地主状态数据
                for (var i = 0; i < table.players.length; ++i) {
                    var p = table.players[i];
                    if (p.seat == seat) {
                        p.ext[1] = msg.data.params[1];
                    }
                }

            }else if(step.action == 4) {//抢地主
                msg.type = ERDDZTabelType.QiangDiZhu;
                msg.data = {};
                msg.data.params = [step.seat, step.param, 0, 0, step.nextSeat];
                if (step.over == 1)msg.data.params[4] = 0;

                var seat = msg.data.params[0];
                table.nextSeat = msg.data.params[4];

                if (msg.data.params[1] == 1) {
                    table.ext[22] *= 2;//倍数
                    table.ext[23] += 1;//让牌
                }

                //保存抢地主状态数据
                for (var i = 0; i < table.players.length; ++i) {
                    var p = table.players[i];
                    if (p.seat == seat) {
                        p.ext[1] = (msg.data.params[1] == 1 ? 2 : 3);
                    }
                }
            }else if(step.action == 7) {//确定地主
                msg.type = ERDDZTabelType.SureDiZhu;
                msg.data = {};
                msg.data.params = [step.seat, step.param];
                for (var i = 0; i < step.vals.length; ++i) {
                    msg.data.params.push(step.vals[i]);
                }


                table.ext[1] = table.nextSeat = msg.data.params[0];

                if (msg.data.params[1] > 0) {//底牌倍数
                    table.ext[22] *= msg.data.params[1];
                }

                table.strExt[0] = step.vals.join(",");

                for (var i = 0; i < table.players.length; ++i) {
                    var p = table.players[i];
                    if (p.seat == table.nextSeat) {
                        p.handCardIds = p.handCardIds.concat(step.vals);
                    }
                }

                if (table.intParams[10] != 1) {//下个阶段选加倍
                    table.remain = 5;
                } else if (table.intParams[4] > 0) {//下个阶段选让牌
                    table.remain = 6;
                } else {//下个阶段打牌
                    table.remain = 2;
                }
            }else if(step.action == 5) {//选加倍
                msg.type = ERDDZTabelType.JiaBei;
                msg.data = {};
                msg.data.params = [step.seat, step.param, step.nextSeat, step.over];

                var seat = msg.data.params[0];
                table.nextSeat = msg.data.params[2];

                if (msg.data.params[1] == 2) {
                    table.ext[22] *= 2;//加倍倍数
                }

                if (msg.data.params[3] > 0) {
                    if (table.intParams[4] > 0) {
                        table.remain = 6;
                    } else {
                        table.remain = 2;
                    }
                }

                for (var i = 0; i < table.players.length; ++i) {
                    var p = table.players[i];
                    if (p.seat == seat) {
                        p.ext[1] = (msg.data.params[1] == 2 ? 4 : 5);
                    }
                }

            }else if(step.action == 6){//选让牌
                msg.type = ERDDZTabelType.RangPai;
                msg.data = {};
                msg.data.params = [step.seat, step.param, step.nextSeat];

                table.remain = 2;
                table.nextSeat = msg.data.params[2];

                if(msg.data.params[1] > 0){
                    table.ext[22] *= Math.pow(2,msg.data.params[1]);
                    table.ext[23] += msg.data.params[1];
                }

            }else if(step.action == 100){//托管
                msg.type = ERDDZTabelType.ChangeTuoGuan;
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
            var table = ObjectUtil.deepCopy(this.tablesArr[0]);
            ERDDZRoomModel.init(table);

            var layerClass = ERDDZRoomModel.getRoomLayerById();
            var layer = new layerClass();

            var ctrLayer = new ERDDZReplayCtrLayer();
            ctrLayer.setShowStep();
            layer.addChild(ctrLayer,100);

            PopupManager.addPopup(layer);

            layer.handleTableData(ERDDZTabelType.CreateTable,table);

        }else{
            FloatLabelUtil.comText("回放数据错误");
        }
    },



    sendTableMsg:function(step){
        if(this.tablesArr.length <=0)return false;
        if(step >= this.tablesArr.length)step = this.tablesArr.length - 1;

        var table = ObjectUtil.deepCopy(this.tablesArr[step]);

        ERDDZRoomModel.init(table);
        SyEventManager.dispatchTableEvent(ERDDZTabelType.CreateTable,table);
    },

    sendPlayMsg:function(step){
        if(this.msgArr.length <=0)return false;
        if(step >= this.msgArr.length)step = this.msgArr.length - 1;

        var msgData = ObjectUtil.deepCopy(this.msgArr[step].data);

        SyEventManager.dispatchTableEvent(this.msgArr[step].type,msgData);
    },

    sendOverMsg:function(){
        SyEventManager.dispatchTableEvent(ERDDZTabelType.OnOver,this.resultData);
    },

}
