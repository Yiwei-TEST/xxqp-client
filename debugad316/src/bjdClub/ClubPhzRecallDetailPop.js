/**
 * Created by Administrator on 2017/7/21.
 */
/**
 * 战绩界面详情
 */
//跑胡子详情的弹框
var ClubPhzRecallDetailPop = BasePopup.extend({
    ctor: function (data) {
        this.data = data;
        this._super("res/clubPhzRecallDetailPop.json");
        //cc.log("战绩详情页面... this.data" , this.data);
    },

    selfRender: function () {

        //显示选中的那一栏信息
        var playLog = this.data.playLog;
        this.playerList = [];
        this.playerData = null;
        var playerMsg = playLog[playLog.length-1].playerMsg;
        for(var i=0;i< playerMsg.length;i++){
            //cc.log("playerMsg[i]"+JSON.stringify(playerMsg[i]));
            this.playerList.push(playerMsg[i]);
        }

        this.roomIdlable = this.getWidget("Label_14");
        this.timelable = this.getWidget("Label_15");

        //显示时间和房间号
        this.roomIdlable.setString(playLog[0].tableId);
        this.timelable.setString(playLog[playLog.length-1].time);


        this.ImageWin = this.getWidget("ImageWin");
        this.totalMsg = this.getWidget("totalMsg");
        var labelIndex = new cc.LabelBMFont( 1 + "", "res/font/font_res_dn1.fnt");
        labelIndex.x = this.ImageWin.x;
        labelIndex.y = this.ImageWin.y;
        this.totalMsg.addChild(labelIndex);

        //判断以谁的ID来显示战绩数据 如果包含自己 就显示自己 不包含就显示服务器传下来的第一个玩家
        this.checkUserId = this.playerList[0].userId || 0;
        for(var index = 0 ; index < this.playerList.length; index++){
            if(this.playerList[index].userId == PlayerModel.userId){
                this.checkUserId = PlayerModel.userId;
            }
        }

        this.getWidget("roomExScore").visible = false;

        for (var i = 1; i <= 4; i++) {
            this.getWidget("name_" + i).setString("");
            this.getWidget("id_" + i).setString("");
            this.getWidget("Label_Score" + i).setString("");
        }

        var modeMsg = JSON.parse(this.data.modeMsg);
        var createPara = modeMsg.ints.split(",");
        var wanfa = createPara[1];
        for (var index = 1; index <= this.playerList.length; index++) {
            var curPlayer = this.playerList[index - 1];
            this.getWidget("name_" + index).setString(curPlayer.name);
            this.getWidget("id_" + index).setString("ID:"+curPlayer.userId);
            this.getWidget("Label_Score" + index).setString("总分:" + curPlayer.totalPoint);

            if(wanfa == GameTypeEunmZP.SYBP){
                if(curPlayer.bopiPoint)
                    this.getWidget("Label_Score" + index).setString("总分:" + curPlayer.bopiPoint);//bopiPoint
                else
                    this.getWidget("Label_Score" + index).setString("总分:" + 0);
            }else{
                this.getWidget("Label_Score" + index).setString("总分:" + curPlayer.totalPoint);
            }
        }

        this.list = this.getWidget("ListView_6");
        for(var i=0;i<playLog.length;i++){
            var item = new ClubPhzRecallDetailItem(playLog[i].playerMsg.length, this.checkUserId);
            item.setData(playLog[i]);
            this.list.pushBackCustomItem(item);
        }


        //时间数据
        this.Label_timeData = this.getWidget("Label_timeData");
        //玩法数据
        this.Label_wanfaData = this.getWidget("Label_wanfaData");
        //解散数据
        this.Label_dissData = this.getWidget("Label_dissData");

        var resultMsg = JSON.parse(this.data.resultMsg);

        var createTimeStr = resultMsg.createTime || "";
        this.Label_timeData.setString("创建时间："+createTimeStr);

        var wanfaStr = ClubRecallDetailModel.getWanfaStr(modeMsg.ints);
        this.Label_wanfaData.setString(wanfaStr);

        var dissPlayerStr = ClubRecallDetailModel.getDissPlayerStr(resultMsg);
        this.Label_dissData.setString(dissPlayerStr);

        this.shareBtn = this.getWidget("Button_Share");
        //this.returnBtn = this.getWidget("Button_Back");
        //UITools.addClickEvent(this.returnBtn, this, this.onToHome);
        UITools.addClickEvent(this.shareBtn, this, this.onSharePicture);

    },

    onToHome: function () {
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        PopupManager.removeAll();
    },

    //战绩分享
    onSharePicture: function () {
        this.list.visible = false;
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height);
        if (!texture)
            return;
        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
        var obj = {};
        obj.tableId = 1;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?userId=' + encodeURIComponent(PlayerModel.userId);
        obj.title = ""
        obj.description = "";
        obj.shareType = 0;
        sy.scene.showLoading("正在截取屏幕");
        var self = this;
        setTimeout(function () {
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
            self.list.visible = true;
        }, 500);

    },

});
//跑胡子详情的弹框的Item
var ClubPhzRecallDetailItem = ccui.Widget.extend({
    data:null,
    ctor:function(renLength , checkUserId){
        this._super();
        this.renLength = renLength;
        this.checkUserId = checkUserId;
        this.setContentSize(1138,90);

        var Panel_7=this.Panel_7= UICtor.cPanel(cc.size(1159,141),cc.color(225,205,176),0);
        Panel_7.setAnchorPoint(cc.p(0,0));
        Panel_7.setPosition(0,0);
        var Label_Round=this.Label_Round= UICtor.cLabel("第一局",28,cc.size(0,0),cc.color(129,49,0),1,1);
        Label_Round.setPosition(82,48);
        Label_Round.setLocalZOrder(1);
        Panel_7.addChild(Label_Round);
        var Label_Time=this.Label_Time= UICtor.cLabel("2016-05-15 12:00",25,cc.size(0,0),cc.color(129,49,0),1,1);
        Label_Time.setPosition(288,50);
        Label_Time.setLocalZOrder(1);
        Panel_7.addChild(Label_Time);
        var PanelWin=this.PanelWin= UICtor.cPanel(cc.size(1138,90),cc.color(225,205,176),255);
        PanelWin.setAnchorPoint(cc.p(0,0));
        PanelWin.setPosition(1,1);
        Panel_7.addChild(PanelWin);
        var PanelLoss=this.PanelLoss= UICtor.cPanel(cc.size(1138,90),cc.color(240,224,200),255);
        PanelLoss.setAnchorPoint(cc.p(0,0));
        PanelLoss.setPosition(1,1);
        Panel_7.addChild(PanelLoss);
        var Button_9=this.Button_9= UICtor.cBtn("res/res_pdk/pdkRecordSmall/seeBack.png");
        Button_9.setPosition(1037,44);
        PanelLoss.addChild(Button_9);
        var Label_Score=this.Label_Score= UICtor.cLabel("积分",30,cc.size(0,0),cc.color(255,111,24),1,1);
        Label_Score.setPosition(741,47);
        Label_Score.setLocalZOrder(1);
        Panel_7.addChild(Label_Score);
        var Label_ScoreValue=this.Label_ScoreValue= UICtor.cLabel("",20,cc.size(0,0),cc.color(255,255,255),0,0);
        Label_ScoreValue.setPosition(847,49);
        Panel_7.addChild(Label_ScoreValue);

        this.Button_9.setTouchEnabled(true);
        this.addChild(Panel_7);
    },

    setData:function(data){
        this.data = data;

        /*		this.Label_8.setString("房号："+data.tableId);*/
        this.Label_Round.setString("第"+data.playCount+"局");
        this.Label_Time.setString(data.time.substr(0,16));
        for(var i=1;i<=this.renLength;i++){
            var pdata = data.playerMsg[i-1];
            /*			this["p"+i+"_l1"].setString(pdata.name);
             this["p"+i+"_l2"].setString("本局："+pdata.point);
             this["p"+i+"_l3"].setString("累计："+pdata.totalPoint);*/
        }

        var score = data.playerMsg[0].point;
        for(var index = 0 ; index < data.playerMsg.length; index++){
            if(data.playerMsg[index].userId == this.checkUserId){
                score = data.playerMsg[index].point
                break;
            }
        }
        var sign = score >= 0? "+" : "";
        var lableFnt = score >= 0 ? "res/font/dn_bigResult_font_1.fnt" : "res/font/greeNum_0.fnt";
        var label = new cc.LabelBMFont(sign + score + "", lableFnt);
        label.x = this.Label_ScoreValue.width / 2;
        label.y = this.Label_ScoreValue.height / 2;
        label.scale = 0.8;
        this.Label_ScoreValue.addChild(label);

        UITools.addClickEvent(this.Button_9,this,this.onHuiFang);
    },

    onHuiFang:function(){
        sy.scene.hideLoading();
        for (var i = 0; i < PopupManager.popupList.length; i++) {
            if (PopupManager.popupList[i]["constructor"] == ClubPhzRecallDetailPop) {
                ClubRecallDetailModel.isShowRecord = true;
            }
        }
        //PopupManager.removeAll();
        PopupManager.hidePopup(ClubCreditPop);
        PopupManager.hidePopup(ClubPhzRecallDetailPop);
        PopupManager.hidePopup(PyqHall);
        //cc.log("this.renLength.::::::::="+this.renLength)
       if(ClubRecallDetailModel.isPHZWanfa(this.data.playType)) {
            PHZRePlayModel.init(this.data);
            var layerName = LayerFactory.PHZ_REPLAY;
            if (PHZRePlayModel.players.length > 3){
               layerName = LayerFactory.PHZ_REPLAY_MORE;
            }else if (PHZRePlayModel.players.length == 2){
               layerName = LayerFactory.PHZ_REPLAY_LESS;
            }

            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(this.data.playType == GameTypeEunmZP.HBGZP){
           HBGZPRePlayModel.init(this.data);
           var layerName = LayerFactory.HBGZP_REPLAY;
           if (HBGZPRePlayModel.players.length > 3){
               layerName = LayerFactory.HBGZP_REPLAY_MORE;
           }else if (HBGZPRePlayModel.players.length == 2){
               layerName = LayerFactory.HBGZP_REPLAY_LESS;
           }
           LayerManager.showLayer(layerName);
           var layer = LayerManager.getLayer(layerName);
           layer.initData();
       }
    }
});





