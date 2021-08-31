/**
 * Created by Administrator on 2017/2/28.
 */

var WZQCreateRoom = BasePopup.extend({
    ctor:function(){
        this.score = -1;
        this._super("res/wzqCreateRoom.json");
    },

    selfRender:function(){
        var layerBg = this.getWidget("layerBg")
        var btn_create = this.getWidget("Button_create")
        UITools.addClickEvent(btn_create,this,this.onClickCreate);

        var saveWanfa = cc.sys.localStorage.getItem("sy_wanfa_create_room_id");
        //if(saveWanfa){
        //    this.showLayerById(saveWanfa);
        //}

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.UPDATA_CREDIT_NUM,this,this.updateXFNum);

        this.ruleConfig = [
            {title:"局数",type:1,content:["1局"]},//0
            {title:"人数",type:1,content:["2人"]},//1
            {title:"倍率",type:1,content:[]},//1
        ];
        this.defaultConfig = [[0],[0],[0]];
        this.layoutArr = [];
        var contentH = 370;
        for(var i = 0;i<this.ruleConfig.length;++i){
            var layout = new SelectLayout(this.ruleConfig[i].title,this.ruleConfig[i].type,this.ruleConfig[i].col);
            layout.setTag(i*100);
            var height = layout.showItemList(this.ruleConfig[i].content);
            //layout.setChangeHandel(this.changeHandle.bind(this));

            layout.setDefault(this.defaultConfig[i]);

            layout.tempHeight = height;
            contentH += height;
            layerBg.addChild(layout);

            this.layoutArr.push(layout);
        }
        var startY = contentH;
        for(var i = 0;i<this.layoutArr.length;++i){
            this.layoutArr[i].setPosition(290,startY - this.layoutArr[i].tempHeight/2);
            startY -= this.layoutArr[i].tempHeight+38;
        }

        var inputBg = this.getWidget("Image_inputbg");
        UITools.addClickEvent(inputBg,this,this.onClickXF);
        this.Label_xf = this.getWidget("Label_xf");
    },

    onClickXF:function(){
        var mc = new ClubCreditInputPop(9);
        PopupManager.addPopup(mc);
    },

    updateXFNum:function(event){
        var data = event.getUserData();
        this.score = Number(data.num);
        this.Label_xf.setString(this.score)
    },

    getItemByIdx:function(row,col){
        var item = null;
        if(this.layoutArr[row] && this.layoutArr[row].itemArr[col]){
            item = this.layoutArr[row].itemArr[col];
        }
        return item;
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 1;
        var costWay = 1
        var renshu = 2;
        var score = Math.round(this.score*100)
        score = parseInt(score)
        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.WZQ,//玩法ID 1
            costWay, // 支付方式  2
            0,//3
            0,//4
            0,//5
            0,//6
            renshu,//人数 7
            score,//分数 8
        ];
        //cc.log("data.params =",this.score,JSON.stringify(data.params))
        return data;
    },

    onCreate:function(gameType){
        this.clubBagCreate();

        var modeId = ClickClubModel.getCurClubBagModeId();
        //sy.scene.showLoading("正在创建房间");
        //var data = this.curSelectLayer.getSocketRuleData();
        //sySocket.sendComReqMsg(29,[gameType],["0",modeId+"",ClickClubModel.getCurClubId()+""]);
        //SyEventManager.dispatchEvent(SyEvent.CLUB_BAG_FASTJOIN,0);
    },

    onClickCreate:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(this.score == -1){
            FloatLabelUtil.comText("请输入倍率");
            return
        }else if(this.score == 0){
            FloatLabelUtil.comText("倍率不能为0");
            return
        }else if(this.score > 100000){
            FloatLabelUtil.comText("倍率不能大于100000");
            return
        }

        this.isClickCreate = true;
        var data = this.getSocketRuleData();
        SyEventManager.dispatchEvent(SyEvent.CLUB_WZQ_CREATEROOM,[5,data.params]);
    },

    //俱乐部包厢玩法创建
    clubBagCreate:function(){
        //cc.log("===========clubBagCreate==========",ClickClubModel.clickClubId,this.clubData.subId);
        var self = this;
        //if (this.clubData.modeId) {
        //    self.onSaveChoose();
        //}else{
            self.onSaveChoose();
        //}
    },

    onSaveChoose:function(){
        cc.log("============onSaveChoose===========");
        var wanfaList = this.getSocketRuleData().params;
        var wanfas = this.curSelectLayer.getWanfas();
        var that = this;

        var creditParams = [];

        var params = {
            gameType:wanfas[0],
            payType:wanfas[1],
            gameCount:wanfas[2],
            playerCount:wanfas[3],
            modeMsg:wanfaList,
            tableName:this.inputName.getString(),
            descMsg:wanfaList,
            tableMode:wanfaList,
            tableOrder:1,
            userId:PlayerModel.userId,
            subId:that.clubData.subId,
            groupId:that.clubData.clubId,
            creditMsg:creditParams
        }
        if (this.clubData.modeId) {
            params.keyId = this.clubData.modeId;
            params.room = this.clubData.subId;
            NetworkJT.loginReq("groupAction", "updateTableConfig", params, function (data) {
                if (data) {
                    FloatLabelUtil.comText("配置修改成功");
                    var num = data.message || 0;
                    //if (Number(num)){
                        //that.onReleaseBagRoom(num);
                    //}else{
                        SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                    //}
                    SyEventManager.dispatchEvent(SyEvent.CLOSE_CLUB_BAGS);
                    //cc.log("createPJ::"+JSON.stringify(data));
                    PopupManager.remove(that);
                }
            }, function (data) {
                cc.log("createPJ::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });

        }else{
            params.groupName = this.inputName.getString();
            NetworkJT.loginReq("groupAction", "createGroupRoom", params, function (data) {
                if (data) {

                    SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                    SyEventManager.dispatchEvent(SyEvent.CLOSE_CLUB_BAGS);
                    //cc.log("createPJ::"+JSON.stringify(data));
                    FloatLabelUtil.comText("配置玩法成功");
                    PopupManager.remove(that);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });

        }

    },

    saveRuleDataToLocal:function(){
        var ruleData = this.getRuleDataFromSelect();
        var jsonStr = JSON.stringify(ruleData);
        cc.log("============saveRuleDataToLocal===========:" + jsonStr);
        cc.sys.localStorage.setItem("sy_rule_select_" + this.gameType,jsonStr);
    },

    getRuleDataFromSelect:function() {
        var ruleData = [];
        for(var i = 0;i<this.layoutArr.length;++i){
            var rule = [];
            for(var j = 0;j<this.layoutArr[i].itemArr.length;++j){
                rule.push(this.layoutArr[i].itemArr[j].isSelected()?1:0);
            }
            ruleData.push(rule);
        }
        return ruleData;
    },

    //onExit:function(){
    //
    //    this._super();
    //},
});