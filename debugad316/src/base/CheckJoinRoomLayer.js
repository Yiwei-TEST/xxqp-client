/**
 * Created by cyp on 2020/7/7.
 * 娱乐场匹配成功后切服进入房间的监听
 */
var CheckJoinRoomLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        SyEventManager.addEventListener(SyEvent.SOCKET_OPENED,this,this.onSuc);
        SyEventManager.addEventListener(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        SyEventManager.addEventListener(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status==ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status==ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        if(CheckJoinModel.needJoinTable){
            CheckJoinModel.needJoinTable = false;
            this.joinTable();
        }else if(CheckJoinModel.needJoinMatch){
            CheckJoinModel.needJoinMatch = false;
            this.joinMatch();
        }

    },

    //匹配成功加入房间
    joinTable:function(){
        var tableId = CheckJoinModel.tableId;
        cc.log("===CheckJoinRoomLayer===JoinTable===",tableId);
        sySocket.sendComReqMsg(2,[],[String(tableId)],0);
    },

    //切服成功加入匹配
    joinMatch:function(){
        cc.log("===CheckJoinRoomLayer===joinMatch===",CheckJoinModel.playType,CheckJoinModel.matchType,CheckJoinModel.keyId);
        //加入智能匹配

        var strPrams = [];

        if(CheckJoinModel.matchType == 1 && CheckJoinModel.keyId){
            strPrams.push(String(CheckJoinModel.keyId));
        }
        sySocket.sendComReqMsg(137,[Number(CheckJoinModel.playType),CheckJoinModel.matchType],strPrams, 7);
    },
});

var CheckJoinModel = {
    needJoinTable:false,
    needJoinMatch:false,
    tableId:0,
    playType:0,
    keyId:"",
    matchType:0,

    toMatchRoom:function(playType,mathcType,keyId){
        ComReq.comReqChangeSrv([Number(playType)],[],4);
        ComReq.comReqStatisticsClick([],[playType + "|1"]);
        this.needJoinMatch = true;
        this.playType = playType;
        this.keyId = keyId || "";
        this.matchType = mathcType || 2;
    },

    exitMatchRoom:function(){
        sySocket.sendComReqMsg(137,[Number(this.playType),Number(this.matchType)],[], 8);
    },

    //保存加入娱乐场匹配的数据
    saveJoinMatchData:function(){
        var data = {};
        data.playType = this.playType;
        data.matchType = this.matchType;
        data.keyId = this.keyId?Number(this.keyId):"";
        cc.sys.localStorage.setItem("CheckJoinModelData",JSON.stringify(data));
    },

    //获取加入娱乐场匹配的数据
    getJoinMatchData:function(){
        var data = cc.sys.localStorage.getItem("CheckJoinModelData");
        if(data){
            return JSON.parse(data);
        }
        return null;
    },

    enterMatch:function(playType,matchType,keyId){
        cc.log("=======enterMatch======",playType,matchType,keyId);
        this.playType = Number(playType);
        this.matchType = Number(matchType);
        this.keyId = Number(keyId);
        CheckJoinModel.saveJoinMatchData();

        //var callBack = function () {

            var build = MsgHandler.getResBuilder(5002);
            var tableClass = build.builder.build("CreateTableRes");
            var data = new tableClass();

            data.isClientData = true;
            data.matchType = matchType;
            data.wanfa = playType;
            data.renshu = 2;
            data.tableId = 0;
            data.nowBurCount = 0;
            data.totalBurCount = 0;
            data.intParams = [];
            data.players = [];
            data.tableType = 3;
            data.remain = 0;
            data.ext = [0,0,0,0,0,0];
            data.strExt = ["","",""];
            data.goldMsg = "0,0,0";

            CreateTableResponder.prototype.respond(data);

        //}
        //sy.scene.updatelayer.getUpdatePath(playType, callBack);
    },

    backToHall:function(){
        var layerType = LayerFactory.GOLD_LAYER;
        if(!LayerManager.getLayer(LayerFactory.GOLD_LAYER) || CheckJoinModel.matchType == 2){
            layerType = LayerFactory.HOME;
        }
        LayerManager.showLayer(layerType);
    },
}