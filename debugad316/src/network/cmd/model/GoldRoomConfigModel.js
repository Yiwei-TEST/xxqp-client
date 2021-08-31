/**
 * Created by Administrator on 2016/6/24.
 */
var GoldRoomConfigModel = {
    goldRoomId:0,               //当前进入的房间好
    clickClubId:0,              //当前选择的当前俱乐部ID
    curClickPlayType:0,         //当前选择的玩法PlayType
    curClickRoomkeyId:0,        //当前选择的房间的keyId
    curRoomConfigMJ:[],         //所有麻将房间的配置
    curRoomConfigPK:[],         //所有扑克房间的配置
    curRoomConfigZP:[],         //所有字牌房间的配置
    curAreaRoomConfig:[],       //所有玩法房间的配置
    CurClicKGameIndex:1,        //当前选择的大玩法



    clearRoomConfigData:function(){
        this.goldRoomId = 0;
        this.curClickPlayType = 0;
        this.curClickRoomkeyId = 0;
        this.curRoomConfigMJ = [];
        this.curRoomConfigPK = [];
        this.curRoomConfigZP = [];
        this.curAreaRoomConfig = [];
        this.CurClicKGameIndex = 1;
    },

    init:function(data){
        // cc.log("GoldRoomConfigModel data =",JSON.stringify(data));
        this.curAreaRoomConfig = data;
        var localRoomConfigCommon = GoldAreaListModel.getlocalRoomConfigCommon();
        // if (localRoomConfigCommon && localRoomConfigCommon.length > 0){
        //     // this.curClickPlayType = localRoomConfigCommon[localRoomConfigCommon.length-1].playType;
        //     this.CurClicKGameIndex = 0;
        // }
        //
        // cc.log("GoldRoomConfigModel:init====",this.curClickPlayType)
        var curRoomConfigPK = [];
        var curRoomConfigZP = [];
        var curRoomConfigMJ = [];
        if (data){
            for (var i = 0; i < data.length; i++) {
                var gameType = data[i].playType;
                if(GameTypeManager.isPK(gameType)){
                    curRoomConfigPK.push(data[i]);
                    this.temp = 1;
                }else if(GameTypeManager.isZP(gameType)){
                    curRoomConfigZP.push(data[i]);
                    this.temp = 3;
                }else if(GameTypeManager.isMJ(gameType)){
                    curRoomConfigMJ.push(data[i]);
                    this.temp = 2;
                }
            }
        }
        this.initRoomConfigPK(curRoomConfigPK);
        this.initRoomConfigZP(curRoomConfigZP);
        this.initRoomConfigMJ(curRoomConfigMJ);
    },

    initRoomConfigPK:function(data){
        // UITools.dealLog("initRoomConfigPK========")
        var pkData = ArrayUtil.clone(data);
        // cc.log("pkData===",JSON.stringify(pkData));
        var index = 0;
        var pkArr = {};
        this.curRoomConfigPK = [];
        while(pkData && pkData.length){
            var curPlayType = 0;
            var curplayerCount = 0;
            for (var i = pkData.length - 1; i >= 0; i--) {
                if (!curPlayType){
                    curPlayType = ClubRecallDetailModel.isDTZWanfa(pkData[i].playType) ? 113 : pkData[i].playType;
                    curplayerCount = pkData[i].playerCount;
                    pkArr = {};
                    pkArr.playType = curPlayType;
                    pkArr.playerCount = curplayerCount;
                    pkArr.gameData = [];
                }
                var nowPlayType = pkData[i].playType;
                nowPlayType = ClubRecallDetailModel.isDTZWanfa(nowPlayType) ? 113 : nowPlayType;
                // cc.log("pkData[i].playType",nowPlayType,curPlayType);
                if (curPlayType == nowPlayType && curplayerCount== pkData[i].playerCount){
                    pkArr.playerCount = pkData[i].playerCount;
                    pkArr.gameData.push(pkData[i]);
                    pkData.splice(i, 1);
                }
            }
            this.curRoomConfigPK.push(pkArr);
            index++;
        }
    },
    initRoomConfigZP:function(data){
        // UITools.dealLog("initRoomConfigZP========")
        var zpData = ArrayUtil.clone(data);
        // cc.log("zpData===",JSON.stringify(zpData));
        var index = 0;
        var zpArr = {};
        this.curRoomConfigZP = [];
        while(zpData && zpData.length){
            var curPlayType = 0;
            var curplayerCount = 0;
            for (var i = zpData.length - 1; i >= 0; i--) {
                if (!curPlayType && !curplayerCount){
                    curPlayType = zpData[i].playType;
                    curplayerCount = zpData[i].playerCount;
                    zpArr = {};
                    zpArr.playType = curPlayType;
                    zpArr.playerCount = curplayerCount;
                    zpArr.gameData = [];
                }
                if (curPlayType == zpData[i].playType && curplayerCount== zpData[i].playerCount){
                    zpArr.playerCount = zpData[i].playerCount;
                    zpArr.gameData.push(zpData[i]);
                    zpData.splice(i, 1);
                }
            }
            this.curRoomConfigZP.push(zpArr);
            index++;
        }
        // cc.log("this.curRoomConfigZP===",JSON.stringify(this.curRoomConfigZP))
    },
    initRoomConfigMJ:function(data){
        // UITools.dealLog("initRoomConfigMJ========")
        var mjData = ArrayUtil.clone(data);
        // cc.log("mjData===",JSON.stringify(mjData));
        var index = 0;
        var mjArr = {};
        this.curRoomConfigMJ = [];
        while(mjData && mjData.length){
            var curPlayType = 0;
            var curplayerCount = 0;
            for (var i = mjData.length - 1; i >= 0; i--) {
                if (!curPlayType && !curplayerCount){
                    curPlayType = mjData[i].playType;
                    curplayerCount = mjData[i].playerCount;
                    mjArr = {};
                    mjArr.playType = curPlayType;
                    mjArr.playerCount = curplayerCount;
                    mjArr.gameData = [];
                }
                if (curPlayType == mjData[i].playType && curplayerCount== mjData[i].playerCount){
                    mjArr.playerCount = mjData[i].playerCount;
                    mjArr.gameData.push(mjData[i]);
                    mjData.splice(i, 1);
                }
            }
            this.curRoomConfigMJ.push(mjArr);
            index++;
        }
        // cc.log("this.curRoomConfigMJ===",JSON.stringify(this.curRoomConfigMJ))
    },

    /**
     * bGame 大玩法 ：扑克 麻将 字牌
     * sGame 跑得快 等
     */
    getCurClicKRoomConfig:function(bGame,sGame){
        var curConfigData = [];
        if (bGame >= 0 && bGame <= 3){
            // cc.log("getCurClicKRoomConfig==",JSON.stringify(GoldAreaListModel.curRoomConfigCommon));
            var curConfigArr = [GoldAreaListModel.localRoomConfigCommon,this.curRoomConfigPK,this.curRoomConfigMJ,this.curRoomConfigZP];
            curConfigData  = curConfigArr[bGame];
        }else if (sGame){
            if(GameTypeManager.isPK(sGame)){
                curConfigData = this.curRoomConfigPK;
            }else if(GameTypeManager.isZP(sGame)){
                curConfigData = this.curRoomConfigZP;
            }else if(GameTypeManager.isMJ(sGame)){
                curConfigData = this.curRoomConfigMJ;
            }else{
                curConfigData = GoldAreaListModel.localRoomConfigCommon;
            }
        }
        return curConfigData;
    },


    getCurClicKGameIndex:function(cGame){
        var game = 0;
        if (cGame){
            if(GameTypeManager.isPK(cGame)){
                game =1;
            }else if(GameTypeManager.isZP(cGame)){
                game = 3;
            }else if(GameTypeManager.isMJ(cGame)){
                game = 2;
            }
        }
        return game;
    },

    reset:function () {
        this.goldRoomId=0;               //当前进入的房间好
        this.clickClubId=0;              //当前选择的当前俱乐部ID
        this.curClickPlayType=0;         //当前选择的玩法PlayType
        this.curClickRoomkeyId=0;        //当前选择的房间的keyId
        this.curRoomConfigMJ=[];         //所有麻将房间的配置
        this.curRoomConfigPK=[];         //所有扑克房间的配置
        this.curRoomConfigZP=[];         //所有字牌房间的配置
        this.curAreaRoomConfig=[];       //所有玩法房间的配置
        this.CurClicKGameIndex=1;        //当前选择的大玩法
    },

    /**
     * 获取最新的数据
     */
    getCurRoomConfig:function(){
        return this.curAreaRoomConfig;
    }

    
}