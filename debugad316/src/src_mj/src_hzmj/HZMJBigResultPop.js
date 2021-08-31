/**
 * Created by zhoufan on 2016/7/28.//2
 */
var HZMJBigResultPop = BasePopup.extend({
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

        var zmCount = 0;
        var jpCount = 0;
        var fpCount = 0;
        var niaoCount = 0;
        if (user.actionCount){
            zmCount = user.actionCount[0] || 0;
            jpCount = user.actionCount[1] || 0;
            fpCount = user.actionCount[2] || 0;
            niaoCount = user.actionCount[5] || 0;
            
        }

        var localPosArr = [480,400,320,240];//[475,405,335,255,185]
        var widgetName = ["Label_78","Label_78_0","Label_78_1","Label_78_2","Label_78_3","Label_78_4"];
        var widgetLabel = ["Label_zm","Label_zm_0","Label_zm_1","Label_zm_2","Label_zm_3","Label_zm_4"];
        var showStringArr = ["自摸次数","接炮次数","放炮次数","中鸟次数"];
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

        // cc.log("user.actionCount =",JSON.stringify(user.actionCount));
        ccui.helper.seekWidgetByName(widget,"Label_zm").setString(zmCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_0").setString(jpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_1").setString(fpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_2").setString(niaoCount+"");
        
        
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

        if(MJRoomModel.isMatchRoom()){
            ccui.helper.seekWidgetByName(widget,"Label_78_2_0").visible = false;
            this.showMoneyIcon(this.Label_point);
        }


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

        var img_credit = ccui.helper.seekWidgetByName(widget,"Image_credit");
        var label_credit = ccui.helper.seekWidgetByName(widget,"Label_credit");
        img_credit.setVisible(false);
        label_credit.setString("");
        if (MJRoomModel.isCreditRoom()) {
            var credit = user.winLoseCredit;
            credit = MathUtil.toDecimal(credit / 100);
            //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+credit);//比赛分
            //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+user.ext[10]);//比赛分
            img_credit.visible = true;
            //pointPanel.y = pointPanel.y + 15;

            var Label_credit = new cc.LabelBMFont("" + credit, fontPath);
            Label_credit.x = pointPanel.width / 2;
            Label_credit.y = -pointPanel.height / 2 - 10;
            pointPanel.addChild(Label_credit);
        }else if(MJRoomModel.isClubGoldRoom()){
            img_credit.visible = true;
            img_credit.loadTexture("res/res_gold/goldPyqHall/img_13.png");

            var num = user.winLoseCredit;
            if(num > 0)num = "+" + num;

            var Label_credit = new cc.LabelBMFont("" + num, fontPath);
            Label_credit.x = pointPanel.width / 2;
            Label_credit.y = -pointPanel.height / 2 - 10;
            pointPanel.addChild(Label_credit);

        }else{
            pointPanel.y = pointPanel.y - 20;
            ccui.helper.seekWidgetByName(widget,"Label_78_2_0").y = ccui.helper.seekWidgetByName(widget,"Label_78_2_0").y-20;
        }
    },

    showMoneyIcon:function(label){
        var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
        icon.setAnchorPoint(1,0.5);
        icon.setPosition(-10,label.height/2);
        label.addChild(icon);
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

        if (MJRoomModel.roomName){
            var string = "";
            string = MJRoomModel.roomName + "   亲友圈ID：" + ClosingInfoModel.ext[0];
            this.getWidget("Label_roomname").setString(string);
        }else{
            this.getWidget("Label_roomname").visible = false;
            btn_start_another.setVisible(false);
        }
        var jushuStr = MJRoomModel.nowBurCount + "/" + MJRoomModel.totalBurCount;
        this.getWidget("jushu").setString(jushuStr);

        var name = ClubRecallDetailModel.getGameStr(MJRoomModel.wanfa);
        this.getWidget("wanfa_2").setString(name);

        this.getWidget("roomid").setString("" + MJRoomModel.tableId);

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
        Button_20.visible = false;
        UITools.addClickEvent(Button_20,this,this.onShare);
        var Button_21 = this.getWidget("Button_21");
        UITools.addClickEvent(Button_21,this,this.onToHome);

        if(MJRoomModel.isMatchRoom()){
            btn_start_another.setVisible(false);
            this.getWidget("Label_roomname").setString(MJRoomModel.roomName || "");
            Button_21.setPosition(btn_start_another.getPosition());
        }

        var Button_fxCard = this.getWidget("Button_fxCard");
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        Button_fxCard.visible = false;
        if(MJRoomModel.tableType == 1 && ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = false;
        }

        var wfStr = "";
        this.getWidget("Label_double").setString(""+wfStr);
        this.getWidget("Label_score").setString("");

        if (MJRoomModel.isCreditRoom()){
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = MJRoomModel.getCreditType();
            var giveWay = MJRoomModel.getCreditWay();
            var giveNum = MJRoomModel.getCreditGiveNum();
            if (giveType == 1){
                 if(!MJRoomModel.getCreditPayWay()){
                   giveStr = giveStr + "固定赠送,";
                }
            }else{
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1){
                if(MJRoomModel.getCreditPayWay()){
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
            this.getWidget("Label_score").setString("底分:"+MJRoomModel.getCreditScore() + "," + giveStr);
        }

        if(MJRoomModel.isClubGoldRoom()){
            this.getWidget("Label_score").setString(MJRoomModel.getClubGlodCfg());
        }

        var wanfaStr = "";
        if (ClosingInfoModel.ext){
            if (ClosingInfoModel.ext[4] == GameTypeEunmMJ.HZMJ){
                wanfaStr = ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams);
            }else if(ClosingInfoModel.ext[4] == GameTypeEunmMJ.ZJMJ){
                wanfaStr = ClubRecallDetailModel.getZJMJWanfa(MJRoomModel.intParams);
            }
        }
        this.getWidget("Label_wf").setString("" + wanfaStr);

        if(MJRoomModel.getIsSwitchCoin()){
            var btn_coin_result = this.getWidget("btn_coin_result");
            btn_coin_result.visible = true;
            UITools.addClickEvent(btn_coin_result,this,this.clubCoinResult);
        }else{
            this.getWidget("btn_coin_result").visible = false;
        }
    },

    clubCoinResult:function(){
        cc.log("CLUB_RESULT_COIN3",JSON.stringify(ClosingInfoModel.clubResultCoinData))
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return
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

    //显示具体玩法
    getSpecificWanfa:function(wanfaList) {
        var gameStr = "红中麻将 ";

        var costStr = "";

                var zhuangStr = "";
        if(wanfaList[5] == 1){
            zhuangStr = "分庄闲 ";
        }

        var khqdStr = "";
        if(wanfaList[6] == 1){
            khqdStr = "可胡七对 ";
        }

        var niaoNumStr = "不抓鸟 ";
        if(wanfaList[3] && wanfaList[3] != 0){
            niaoNumStr = "抓"+ wanfaList[3] + "鸟 ";
        }


        var niaowayStr = "";
        if(wanfaList[19] == 1){
            niaowayStr = "159中鸟 ";
        }

        var niaoStr = "";
        if(wanfaList[12] == 1){
            niaoNumStr = "";
            niaoStr = "一鸟全中 ";
        }
        niaoStr  = niaoStr + "中鸟+"+wanfaList[13]+"分 ";
        var niaofenStr = "";
        if(wanfaList[14]){
            niaofenStr = "无红中鸟+" + wanfaList[14] + " ";
        }

        var bsjStr = "";
        if(wanfaList[10] == 1){
            bsjStr = "抢杠胡包三家 ";
        }

        var dpdStr = "";
        if(wanfaList[4] == 0){
            dpdStr = "点炮胡 ";
        }

        var ypbhStr = "";
        if(wanfaList[15] == 1){
            ypbhStr = "有炮必胡 ";
        }

        var qghStr = "";
        if(wanfaList[9] == 1){
            qghStr = "抢杠胡 ";
        }

        var tgStr = "";
        if (wanfaList[8] == 1){
            tgStr = "单局托管 ";
            if (wanfaList[26] == 2){
                tgStr = "整局托管 ";
            }
        }
        if (wanfaList[23] == 1){
            tgStr = tgStr + "无红中自摸+1分 ";
        }
        if (wanfaList[24] == 1){
            tgStr = tgStr + "无红中接炮+1分 ";
        }
        if (wanfaList[25] == 1){
            tgStr = tgStr + "七对、碰碰胡、清一色+1分 ";
        }
        if (wanfaList[27] == 1){
            tgStr = tgStr + "无红中得分翻倍 ";
        }
         if (wanfaList[28] == 1){
            tgStr = tgStr + "自摸算1分 ";
        }
        var doubleStr = "";
        if (wanfaList[7] == 2 && wanfaList[20] == 1){
            doubleStr = "低于" + wanfaList[21] + "分翻" + wanfaList[22] +"倍 " ;
        }

        var credit = "";
        gameStr = "";

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}{12}{13}",
            gameStr,costStr,
            zhuangStr,khqdStr,bsjStr,dpdStr,
            ypbhStr,qghStr,tgStr,niaoNumStr,niaowayStr,niaoStr,doubleStr,credit);
        return wanfaStr;
    },

    onShareCard:function() {
        this.shareCard(MJRoomModel, PlayerModel, ClosingInfoModel.groupLogId);
    },

    /**
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
        var tableId = (this.isDaiKai) ? dkResultModel.data.tableId : MJRoomModel.tableId;
        obj.tableId=MJRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+MJRoomModel.tableId+'userName='+encodeURIComponent(PlayerModel.name);
        obj.title='麻将   房号:'+MJRoomModel.tableId;
        obj.description="我已开好房间，【麻将】三缺一，就等你了！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            ShareDTPop.show(obj);
        },500);
    },

    onToHome:function(){
        if(MJRoomModel.isMatchRoom()){
            LayerManager.showLayer(LayerFactory.GOLD_LAYER);
            PopupManager.remove(this);
            PopupManager.removeAll();
            return;
        }

        if(this.isDaiKai){
            dkRecordModel.isShowRecord = false;
            PopupManager.remove(this);
        }else{
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();

            var isClubRoom =  (MJRoomModel.tableType ==1);
            if(isClubRoom ){
                PopupManager.removeClassByPopup(PyqHall);
                var mc = new PyqHall();//先不弹出吧
                PopupManager.addPopup(mc);
            }
        }
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = MJRoomModel.wanfa;
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
