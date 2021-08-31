/**
 * Created by Administrator on 2020/6/3.
 */
var XPLPBigResultPop = BasePopup.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai;
        this._super("res/mjBigResult.json");
    },

    refreshSingle:function(widget,user){
        widget.visible = true;
        this.user=user;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget,"id").setString("ID:"+user.userId);

        var birdSeat = this.data.birdSeat || [];
        //var niaoNum = birdSeat[user.seat] || 0;
        cc.log("refreshSingle user.actionCount",JSON.stringify(user.actionCount));
        var zmCount = 0;
        var dpCount = 0;
        var ggCount = 0;
        var agCount = 0;
        var mdCount = 0;
        if (user.actionCount){
            zmCount = user.actionCount[0] || 0;
            dpCount = user.actionCount[1] || 0;
            ggCount = user.actionCount[2] || 0;
            agCount = user.actionCount[3] || 0;
            mdCount = user.birdPoint || 0;
        }

        var localPosArr = [475,405,335,255,185];
        var widgetName = ["Label_78","Label_78_0","Label_78_1","Label_78_2","Label_78_3","Label_78_4"];
        var widgetLabel = ["Label_zm","Label_zm_0","Label_zm_1","Label_zm_2","Label_zm_3","Label_zm_4"];
        var showStringArr = ["胡牌次数","点炮次数","公杠次数","暗杠次数","买点次数"];
        showStringArr = ["","点炮次数","","自摸次数",""];
        for(var i = 0;i<6;++i){
            if(localPosArr[i]){
                ccui.helper.seekWidgetByName(widget,widgetName[i]).y = localPosArr[i];
                ccui.helper.seekWidgetByName(widget,widgetLabel[i]).y = localPosArr[i];
                ccui.helper.seekWidgetByName(widget,widgetName[i]).setString(showStringArr[i]);
            }else{
                ccui.helper.seekWidgetByName(widget,widgetName[i]).visible = false;
                ccui.helper.seekWidgetByName(widget,widgetLabel[i]).visible = false;
            }
        }

        ccui.helper.seekWidgetByName(widget,"Label_zm").setString("");//胡的次数
        ccui.helper.seekWidgetByName(widget,"Label_zm_0").setString(dpCount+"");//点炮次数
        ccui.helper.seekWidgetByName(widget,"Label_zm_1").setString("");//公杠次数
        ccui.helper.seekWidgetByName(widget,"Label_zm_2").setString(zmCount+"");//胡牌次数
        ccui.helper.seekWidgetByName(widget,"Label_zm_3").setString("");//买点


        var pointPanel = ccui.helper.seekWidgetByName(widget,"Panel_point");
        var fontPath = "res/font/font_point_2.fnt";
        var totalPoint = user.totalPoint;
        var png = "res/res_mj/mjBigResult/mjSmallResult_6.png";
        if (totalPoint >= 0){
            totalPoint = "+" + totalPoint;
            fontPath = "res/font/font_point_1.fnt";
            png = "res/res_mj/mjBigResult/mjSmallResult_5.png";
        }
        widget.setBackGroundImage(png);

        this.Label_point = new cc.LabelBMFont("" + totalPoint,fontPath);
        this.Label_point.x = pointPanel.width/2;
        this.Label_point.y = pointPanel.height/2 + 2;
        pointPanel.addChild(this.Label_point);

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_mj/mjBigResult/default_m.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 60;
        sprite.y = 60;
        icon.addChild(sprite,5,345);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 120, height: 120}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = 60;
                    sprite.y = 60;
                }
            });
        }
        var Image_fh = ccui.helper.seekWidgetByName(widget,"Image_fh");
        var Image_dyj = ccui.helper.seekWidgetByName(widget,"Image_dyj");
        Image_fh.visible = false;
        Image_dyj.visible = false;
        if (user.zdyj == 1) {
            Image_dyj.visible = true;
        }
        if (user.dfh == 1) {
            Image_fh.visible = true;
        }

        ccui.helper.seekWidgetByName(widget,"Image_credit").visible = false;
        ccui.helper.seekWidgetByName(widget,"Label_credit").setString("");
        if (XPLPRoomModel.isCreditRoom()){
            var credit = user.winLoseCredit;
            credit = MathUtil.toDecimal(credit/100);
            //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+credit);//比赛分
            //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+user.ext[10]);//比赛分
            ccui.helper.seekWidgetByName(widget,"Image_credit").visible = true;
            var Label_credit = new cc.LabelBMFont("" + credit,fontPath);
            Label_credit.x = pointPanel.width/2;
            Label_credit.y = -pointPanel.height/2 - 10;
            pointPanel.addChild(Label_credit);

        }else{
            pointPanel.y = pointPanel.y - 20;
            ccui.helper.seekWidgetByName(widget,"Label_78_2_0").y = ccui.helper.seekWidgetByName(widget,"Label_78_2_0").y-20;
        }
    },

    clubCoinResult:function(){
        cc.log("CLUB_RESULT_COIN3",JSON.stringify(ClosingInfoModel.clubResultCoinData));
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return;
        }

        for(var i = 0;i < this.closingPlayers.length;i++){
            for(var j = 0;j < ClosingInfoModel.clubResultCoinData.length;j++){
                if(ClosingInfoModel.clubResultCoinData[j].userId == this.closingPlayers[i].userId){
                    ClosingInfoModel.clubResultCoinData[j].name = this.closingPlayers[i].name;
                    ClosingInfoModel.clubResultCoinData[j].icon = this.closingPlayers[i].icon;
                    break;
                }
            }
        }

        var mc = new ClubCoinResultPop(ClosingInfoModel.clubResultCoinData);
        this.addChild(mc,1000);
    },

    selfRender: function () {
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);


        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        var btn_start_another = this.getWidget("btn_start_another");
        UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);

        if (XPLPRoomModel.roomName){
            var string = "";
            string = XPLPRoomModel.roomName + "   亲友圈ID：" + ClosingInfoModel.ext[0];
            this.getWidget("Label_roomname").setString(string);
        }else{
            this.getWidget("Label_roomname").visible = false;
            btn_start_another.setVisible(false);
        }
        var jushuStr = XPLPRoomModel.nowBurCount + "/" + XPLPRoomModel.totalBurCount;
        this.getWidget("jushu").setString(jushuStr);

        this.getWidget("wanfa_2").setString("溆浦老牌");

        this.getWidget("roomid").setString("" + XPLPRoomModel.tableId);

        this.closingPlayers = this.data.closingPlayers;
        var max = 0;
        var min = 0;
        for(var i=0;i<4;i++){
            var seq = i+1;
            this.getWidget("user"+seq).visible = false;
        }
        for(var i=0;i<this.closingPlayers.length;i++){
            var user = this.closingPlayers[i];
            if(user.totalPoint >= max)
                max = user.totalPoint;
            if(user.totalPoint <= min)
                min = user.totalPoint;
        }

        var startX = 960 - this.getWidget("user1").width/2;
        if(this.closingPlayers.length==3){
            this.getWidget("user4").visible = false;
            this.getWidget("user2").x = startX - 550;
            this.getWidget("user3").x = startX;
            this.getWidget("user1").x = startX + 550;
        }else if(this.closingPlayers.length==2){
            this.getWidget("user4").visible = false;
            this.getWidget("user3").visible = false;
            this.getWidget("user1").x = startX - 300;
            this.getWidget("user2").x = startX + 300;
        }

        for(var i=0;i<this.closingPlayers.length;i++){
            var seq = i+1;
            var user = this.closingPlayers[i];
            if (user.totalPoint == max) {
                user.zdyj = 1;
            }
            if (user.totalPoint == min) {
                user.dfh = 1;
            }
            this.refreshSingle(this.getWidget("user"+seq),user);
        }

        var timeStr = ClosingInfoModel.ext[3];
        this.getWidget("time_2").setString(timeStr);

        var Button_20 = this.getWidget("Button_20");
        UITools.addClickEvent(Button_20,this,this.onShare);
        var Button_21 = this.getWidget("Button_21");
        UITools.addClickEvent(Button_21,this,this.onToHome);

        var Button_fxCard = this.getWidget("Button_fxCard");
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        Button_fxCard.visible = false;
        if(XPLPRoomModel.tableType == 1 && ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = false;
            //var Button_fxCard = UICtor.cBtn("res/res_mj/mjBigResult/mjBigResult_fxCard.png");
            //Button_20.getParent().addChild(Button_fxCard);
            //Button_fxCard.y =  Button_20.y;
            //UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
            //Button_21.x += 50;
            //Button_20.x +=172 ;
            //Button_fxCard.x = Button_20.x-(Button_21.x-Button_20.x);
        }

        var wfStr = "";
        if (XPLPRoomModel.isDouble() && XPLPRoomModel.renshu == 2){
            var dtimes = XPLPRoomModel.getDoubleNum();
            var dScore = XPLPRoomModel.getDScore();
            wfStr = wfStr + "小于"+ dScore +"分" + " 翻" + dtimes + "倍";
        }
        this.getWidget("Label_double").setString(""+wfStr);


        this.getWidget("Label_score").setString("");
        if (XPLPRoomModel.isCreditRoom()){
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = XPLPRoomModel.getCreditType();
            var giveWay = XPLPRoomModel.getCreditWay();
            var giveNum = XPLPRoomModel.getCreditGiveNum();
            if (giveType == 1){
                if(!XPLPRoomModel.getCreditPayWay()){
                   giveStr = giveStr + "固定赠送,";
                }
            }else{
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1){
                if(XPLPRoomModel.getCreditPayWay()){
                    giveStr = giveStr + "AA赠送,";
                }else{
                    giveStr = giveStr + "大赢家,";
                }
            }else{
                giveStr = giveStr + "所有赢家,";
            }
            if (giveType == 1){
                giveStr = giveStr + giveNum;
            }else{
                giveStr = giveStr + giveNum + "%";
            }
            this.getWidget("Label_score").setString("底分:"+XPLPRoomModel.getCreditScore() + "," + giveStr);
        }

        if(XPLPRoomModel.getIsSwitchCoin()){
            var btn_coin_result = this.getWidget("btn_coin_result");
            btn_coin_result.visible = true;
            UITools.addClickEvent(btn_coin_result,this,this.clubCoinResult);
        }else{
            this.getWidget("btn_coin_result").visible = false;
        }

        var wanfaStr = "";
        if (ClosingInfoModel.ext){
                wanfaStr = ClubRecallDetailModel.getXPLPWanfa(XPLPRoomModel.intParams);
        }
        this.getWidget("Label_wf").setString("" + wanfaStr);
    },

    onShareCard:function() {
        this.shareCard(XPLPRoomModel, PlayerModel, ClosingInfoModel.groupLogId);
    },

    /**`
     * 分享战报
     */
    onShare:function(){
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

        var obj={};
        var tableId = (this.isDaiKai) ? dkResultModel.data.tableId : XPLPRoomModel.tableId;
        obj.tableId=XPLPRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+XPLPRoomModel.tableId+'userName='+encodeURIComponent(PlayerModel.name);
        obj.title='麻将   房号:'+XPLPRoomModel.tableId;
        obj.description="我已开好房间，【麻将】三缺一，就等你了！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            ShareDTPop.show(obj);
        },500);
    },

    onToHome:function(){
        if(this.isDaiKai){
            dkRecordModel.isShowRecord = false;
            PopupManager.remove(this);
        }else{
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();

            var isClubRoom =  (XPLPRoomModel.tableType ==1);
            if(isClubRoom ){
                PopupManager.removeClassByPopup(PyqHall);
                var mc = new PyqHall();//先不弹出吧
                PopupManager.addPopup(mc);
            }
        }
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = XPLPRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[0];
        var modeId = 0;

        var clubLocalList = UITools.getLocalJsonItem("Club_Local_Data");
        for(var j = 0 ; j < clubLocalList.length; j++){
            if (groupId == clubLocalList[j].clickId){
                modeId = clubLocalList[j].bagModeId;
            }
        }
        cc.log("============qyqStartAnother============",groupId,modeId);
        if(groupId > 0 && modeId > 0){
            this.clickStartAnother = true;
            this.groupId = groupId;
            this.modeId = modeId;
            sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , ["0",modeId+"",groupId+""]);
        }else{
            FloatLabelUtil.comText("未找到对应包厢ID,请返回大厅");
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status == ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        sy.scene.hideLoading();
        if(this.clickStartAnother){
            this.clickStartAnother = false;
            if (PlayerModel.clubTableId == 0){
                sySocket.sendComReqMsg(1, [],[this.groupId+"",1 + "","1",this.modeId+""]);
            }else{
                sySocket.sendComReqMsg(2,[parseInt(PlayerModel.clubTableId),1,1,0,Number(this.groupId)],[this.modeId+""]);
            }
        }
    },
});
