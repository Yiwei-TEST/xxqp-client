/**
 * Created by zhoufan on 2016/7/28.
 */
var ZZMJBigResultPop = BasePopup.extend({
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
        ccui.helper.seekWidgetByName(widget,"df").setString("底分:"+ClosingInfoModel.ext[19]);
        //var pointMax = ccui.helper.seekWidgetByName(widget,"point");//p1胡牌次数
        //var fnt = user.totalPoint>0 ? "res/font/font_mj2.fnt" : "res/font/font_mj1.fnt";
        //var label = new cc.LabelBMFont(user.totalPoint+"",fnt);
        //label.x = pointMax.width/2;
        //label.y = pointMax.height/2;
        //pointMax.addChild(label);
        var hpCount = 0;
        var jpCount = 0;
        var ggCount = 0;
        var agCount = 0;
        if (user.actionCount){
            hpCount = user.actionCount[0] || 0;
            jpCount = user.actionCount[1] || 0;
            ggCount = user.actionCount[2] || 0;
            agCount = user.actionCount[3] || 0;
        }

        var localPosArr = [480,400,320,240];//[475,405,335,255,185]
        var showStringArr = ["胡牌次数","点炮次数","公杠次数","暗杠次数"];
        var widgetName = ["Label_78","Label_78_0","Label_78_1","Label_78_2","Label_78_3","Label_78_4"];
        var widgetLabel = ["Label_zm","Label_zm_0","Label_zm_1","Label_zm_2","Label_zm_3","Label_zm_4"];
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

        ccui.helper.seekWidgetByName(widget,"Label_zm").setString(hpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_0").setString(jpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_1").setString(ggCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_2").setString(agCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_3").visible =false;
        ccui.helper.seekWidgetByName(widget,"Label_78_3").visible =false;


        // ccui.helper.seekWidgetByName(widget,"Label_zm_2_3").setString(user.totalPoint+"");
        // ccui.helper.seekWidgetByName(widget,"Label_df").setString(user.totalPoint*ClosingInfoModel.ext[19]);
        //if(user.sex == 1) {
        //    ccui.helper.seekWidgetByName(widget,"Image_32").loadTexture("res/ui/gansu_mj/mjBigResult/mjBigResult_11.png");
        //}
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

        if (user.zdyj == 1) {
            ccui.helper.seekWidgetByName(widget,"Image_dyj").visible = true;
            ccui.helper.seekWidgetByName(widget,"Image_fh").visible = false;
        }
        if (user.dfh == 1) {
            ccui.helper.seekWidgetByName(widget,"Image_fh").visible = true;
            ccui.helper.seekWidgetByName(widget,"Image_dyj").visible = false;
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
        }
    },

    selfRender: function () {

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }
        var jushuStr = MJRoomModel.nowBurCount + "/" + MJRoomModel.totalBurCount;
        this.getWidget("jushu").setString(jushuStr);

        this.getWidget("wanfa_2").setString("转转麻将");

        this.getWidget("roomid").setString("" + MJRoomModel.tableId);

        var btn_start_another = this.getWidget("btn_start_another");
        UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);

        if (MJRoomModel.roomName){
            this.getWidget("Label_roomname").setString(MJRoomModel.roomName);
        }else{
            this.getWidget("Label_roomname").visible = false;
            btn_start_another.setVisible(false);
        }
        this.closingPlayers = this.data.closingPlayers;
        var max = 0;
        var min = 0;
        for(var i=0;i<4;i++){
            var seq = i+1;
            this.getWidget("user"+seq).visible = false;
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
            var user = this.closingPlayers[i];
            if(user.totalPoint >= max)
                max = user.totalPoint;
            if(user.totalPoint <= min)
                min = user.totalPoint;
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
        var Button_fxCard = this.getWidget("Button_fxCard");
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        Button_fxCard.visible = false;
        if(MJRoomModel.tableType == 1 && ClosingInfoModel.groupLogId){//亲友圈房间才可见;
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
        if (MJRoomModel.isDouble() && MJRoomModel.renshu == 2){
            var dtimes = MJRoomModel.getDoubleNum();
            var dScore = MJRoomModel.getDScore();
            wfStr = wfStr + "小于"+ dScore +"分" + " 翻" + dtimes + "倍";
        }
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
            if (ClosingInfoModel.ext[4] == GameTypeEunmMJ.ZZMJ){
                wanfaStr = this.getSpecificWanfa(MJRoomModel.intParams);
            }
        }
        this.getWidget("Label_wf").setString("" + wanfaStr);
    },

    //显示具体玩法
    getSpecificWanfa:function(wanfaList) {
        cc.log("wanfaList =",JSON.stringify(wanfaList));
        var wanfaStr = "";
        if(wanfaList[2] == 1){
            wanfaStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            wanfaStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            wanfaStr = "群主支付 ";
        }
        wanfaStr = wanfaStr + wanfaList[7] +"人 ";
        wanfaStr = wanfaStr + wanfaList[0] +"局 ";
        if (wanfaList[3] == 1){
            wanfaStr = wanfaStr + "庄闲(算分) ";
        }
        if (wanfaList[4] == 1){
            wanfaStr = wanfaStr + "可胡七对 ";
        }
        if (wanfaList[5] == 1){
            wanfaStr = wanfaStr + "可抢公杠胡 ";
        }
        if (wanfaList[6] == 1){
            wanfaStr = wanfaStr + "抢杠胡包三家 ";
        }
        if (wanfaList[8] == 1){
            wanfaStr = wanfaStr + "有炮必胡 ";
        }
        if (wanfaList[15] == 1){
            wanfaStr = wanfaStr + "点炮胡 ";
        }
        if (wanfaList[17] == 1){
            wanfaStr = wanfaStr + "流局算杠分 ";
        }
        var piaofenStr = "不飘分 ";
        if (wanfaList[20] > 0 && wanfaList[20]<4){
            piaofenStr = "固定飘" + wanfaList[20] + "分 ";
        }
        if (wanfaList[20]==4){
            piaofenStr = "自由下飘 ";
        }
        if (wanfaList[20]==5){
            piaofenStr = "首局定飘 ";
        }
        wanfaStr = wanfaStr + piaofenStr;
        
        if (wanfaList[18] == 1){
            wanfaStr = wanfaStr + "放杠+3分 ";
        }
        if (wanfaList[16] == 2){
            wanfaStr = wanfaStr + "先进房坐庄 ";
        }else{
            wanfaStr = wanfaStr + "随机坐庄 ";
        }
        var niaonum = parseInt(wanfaList[10]);
        // cc.log("niaonum =",niaonum);
        if (1 < niaonum && niaonum < 10){
            wanfaStr = wanfaStr + "抓"+niaonum+"鸟 ";
        }else if (niaonum >= 10){
            if(niaonum == 10){
                wanfaStr = wanfaStr + "一鸟全中 ";
            }else if(niaonum == 12){
                wanfaStr = wanfaStr + "胡几抓几 ";
            }
        }else{
            wanfaStr = wanfaStr + "不抓鸟 ";
        }
        wanfaStr = wanfaStr + "底分"+wanfaList[11]+"分 ";
        
        if (wanfaList[7] == 2 && wanfaList[12] == 1){
            wanfaStr = wanfaStr + "低于" + wanfaList[13] + "分翻" + wanfaList[14] +"倍 " ;
        }
        
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
