/**
 * Created by Administrator on 2017/7/21.
 */
/**
 * 战绩界面详情
 */
//打筒子战绩详情的Item
var ClubDtzRecallDetailItem = ccui.Widget.extend({
    data: null,
    ctor: function (renLength,userId) {
        cc.log("创建每局详情 ...",userId);
        this.checkUserId = userId;
        this._super();
        this.renLength = renLength;
        this.setContentSize(1128, 90);

        var Panel_7=this.Panel_7= UICtor.cPanel(cc.size(1159,141),cc.color(225,205,176),0);
        Panel_7.setAnchorPoint(cc.p(0,0));
        Panel_7.setPosition(0,0);
        var Label_Round=this.Label_Round= UICtor.cLabel("第一局",28,cc.size(0,0),cc.color(129,49,0),1,1);
        Label_Round.setPosition(52,48);
        Label_Round.setLocalZOrder(1);
        Panel_7.addChild(Label_Round);
        var Label_Time=this.Label_Time= UICtor.cLabel("2016-05-15 12:00",25,cc.size(140,80),cc.color(129,49,0),1,1);
        Label_Time.setPosition(178,46);
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
        var Image_25=this.Image_25= UICtor.cImg("res/res_dtz/dtzSmallResult/dipai.png");
        Image_25.setPosition(521,26);
        PanelLoss.addChild(Image_25);
        var Image_37=this.Image_37= UICtor.cImg("res/res_dtz/dtzSmallResult/jiantour.png");
        Image_37.setPosition(293,46);
        PanelLoss.addChild(Image_37);
        var Image_38=this.Image_38= UICtor.cImg("res/res_dtz/dtzSmallResult/jiantoul.png");
        Image_38.setPosition(747,46);
        PanelLoss.addChild(Image_38);
        var Label_Score=this.Label_Score= UICtor.cLabel("积分",30,cc.size(0,0),cc.color(255,111,24),1,1);
        Label_Score.setPosition(801,47);
        Label_Score.setLocalZOrder(1);
        Panel_7.addChild(Label_Score);
        var Label_ScoreValue=this.Label_ScoreValue= UICtor.cLabel("",20,cc.size(0,0),cc.color(255,255,255),0,0);
        Label_ScoreValue.setPosition(902,49);
        Panel_7.addChild(Label_ScoreValue);

        //添加一个拖动框
        var cardlist = this.cardlist =  new ccui.ListView();
        cardlist.setTouchEnabled(true);
        cardlist.setContentSize(cc.size(400 , 90));
        cardlist.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        cardlist.setPosition(320 , 0);
        cardlist.setLocalZOrder(2);
        PanelLoss.addChild(cardlist);

        var huifangBtn = new ccui.Button();
        huifangBtn.loadTextureNormal("res/res_pdk/pdkRecordSmall/seeBack.png");
        huifangBtn.setPosition(1050,49);
        Panel_7.addChild(huifangBtn);

        UITools.addClickEvent(huifangBtn,this,this.onHuiFang);

        this.addChild(Panel_7);

    },

    sortCardlists: function (vo1, vo2) {
        if(vo1 != null && vo2 != null){
            var item1 = DTZAI.getCardDef(vo1);
            var item2 = DTZAI.getCardDef(vo2);
            if (item1.i != item2.i) {
                return item1.i - item2.i;
            } else {
                return item1.t - item2.t;
            }
        }
        return false;

    },

    setData: function (data) {
        //cc.log("每局详情的数据..." , JSON.stringify(data));
        this.data = data;
        this.Label_Round.setString("第" + data.playCount + "局");
        this.Label_Time.setString(data.time.substr(0, 16));

        this.cutCardList = data.cutCardList;
        //显示扑八张
        var offX = 30;
        var beginX = 482;
        var beginY = 12;
        if(data.cutCardList.length != 0){
            data.cutCardList.sort(this.sortCardlists);
        }

        if(data.cutCardList != null && data.cutCardList.length > 0){
            for(var index = 0 ; index < this.cutCardList.length ; index ++){
                var cardMsg = DTZAI.getCardDef(this.cutCardList[index]);
                var cardItem = new DTZBigCard(cardMsg,null,true);
                cardItem.scale = 0.5;
                cardItem.anchorY = 0;
                cardItem.anchorX = 0;
                cardItem.width = cardItem.width * cardItem.scale * 0.3;
                cardItem.height = cardItem.height * cardItem.scale;
                this.cardlist.pushBackCustomItem(cardItem);
            }
            this.Image_25.setLocalZOrder(3);
        }else{
            this.Image_25.setVisible(false);
        }

        var checkTeam = 1;
        for (var index = 0; index < data.playerMsg.length; index++) {//记录要分数的玩家的分组
            if(data.playerMsg[index].userId == this.checkUserId){
                checkTeam = data.playerMsg[index].group;
            }
        }

        //显示分数
        var teamScore = 0;
        //这里应该计算同一组的分数 而不是一个人的分数
        for (var index = 0; index < data.playerMsg.length; index++) {
            if (checkTeam == data.playerMsg[index].group) {
                teamScore += data.playerMsg[index].dtzOrXiScore;//totalPoint //dtzOrXiScore
                cc.log("teamScore ...", teamScore);
            }
        }

        /*
         cc.log("data.playerMsg[0].name" , data.playerMsg[0].name  +" "+ data.playerMsg[0].point +" "+ data.playerMsg[0].totalPoint );
         cc.log("data.playerMsg[1].name" , data.playerMsg[1].name  +" "+ data.playerMsg[1].point  +" "+ data.playerMsg[1].totalPoint );
         cc.log("data.playerMsg[2].name" , data.playerMsg[2].name  +" "+ data.playerMsg[2].point +" "+ data.playerMsg[2].totalPoint );
         cc.log("data.playerMsg[3].name" , data.playerMsg[3].name  +" "+ data.playerMsg[3].point  +" "+ data.playerMsg[3].totalPoint );
         */

        var sign = "+";
        var lableFnt = "res/font/font_res_huang.fnt";
        var lableFnt = teamScore >= 0 ? "res/font/dn_bigResult_font_1.fnt" : "res/font/greeNum_0.fnt";
        if (teamScore >= 0) {
            sign = "+";
        } else {
            sign = "";
        }
        var label = new cc.LabelBMFont(sign + teamScore + "", lableFnt);
        label.x = this.Label_ScoreValue.width / 2;
        label.y = this.Label_ScoreValue.height / 2;
        label.scale = 0.8;
        this.Label_ScoreValue.addChild(label);

    },

    onHuiFang: function () {
        sy.scene.hideLoading();
        for (var i = 0; i < PopupManager.popupList.length; i++) {
            if (PopupManager.popupList[i]["constructor"] == Club3DtzRecallDetailPop) {
                ClubRecallDetailModel.isShowRecord = true;
            }else if (PopupManager.popupList[i]["constructor"] == ClubDtzRecallDetailPop) {
                ClubRecallDetailModel.isShowRecord = true;
            }
        }

        PopupManager.hidePopup(Club3DtzRecallDetailPop);
        PopupManager.hidePopup(ClubDtzRecallDetailPop);
        PopupManager.hidePopup(PyqHall);
        PopupManager.hidePopup(ClubCreditPop);

        var json = LayerFactory.DTZ_REPLAY_THREE;
        if(this.data.playerMsg.length == 4){
            json = LayerFactory.DTZ_REPLAY;
        }
        DTZRoomModel.wanfa = this.data.playType;
        PlayBackModel.init(this.data);
        LayerManager.showLayer(json);
        var layer = LayerManager.getLayer(json);
        layer.initData();
    }
});

//打筒子3人和2人的战绩详情
var Club3DtzRecallDetailPop = BasePopup.extend({
    ctor: function (data) {
        this.data = data;
        this._super("res/clubDtz3RecallDetailPop.json");
    },

    selfRender: function () {
        //加载玩家点击的那条记录数据
        var playLog = this.data.playLog;
        this.playerList = [];
        var resList = playLog[playLog.length-1].resList;

        for(var i=0;i< resList.length;i++){
            //cc.log("resList[i]"+JSON.stringify(resList[i]));
            this.playerList.push(JSON.parse(resList[i]));
        }
        this.totalNode = this.getWidget("totalMsg");
        this.roomIdlable = this.getWidget("Label_14");
        this.timelable = this.getWidget("Label_15");
        this.scoreLable1 = this.getWidget("scoreLable1");
        this.scoreLable2 = this.getWidget("scoreLable2");
        this.scoreLable3 = this.getWidget("scoreLable3");
        this.exScoreNode = this.getWidget("roomExScore");
        this.ImageWin = ccui.helper.seekWidgetByName(this.totalNode, "ImageWin");
        this.ImageLoss = ccui.helper.seekWidgetByName(this.totalNode, "ImageLoss");

        this.shareBtn = this.getWidget("Button_Share");
        //this.returnBtn = this.getWidget("Button_Back");
        //
        //
        //UITools.addClickEvent(this.returnBtn, this, this.onToHome);
        UITools.addClickEvent(this.shareBtn, this, this.onSharePicture);


        //显示时间和房间号
        this.roomIdlable.setString(playLog[0].tableId);
        this.timelable.setString(playLog[playLog.length-1].time);
        //判断以谁的ID来显示战绩数据 如果包含自己 就显示自己 不包含就显示服务器传下来的第一个玩家
        this.checkUserId = this.playerList[0].userId || 0;
        for(var index = 0 ; index < this.playerList.length; index++){
            if(this.playerList[index].userId == PlayerModel.userId){
                this.checkUserId = PlayerModel.userId;
            }
        }

        for (var i = 1;i <= 3;i++){
            this.getWidget("name_" + i).setString("");
            this.getWidget("id_" + i).setString("");
        }

        var myBoom = 0;
        //显示总输赢分
        if (this.playerList.length > 0){
            for(var i = 0;i < this.playerList.length;i++) {
                var playerList = this.playerList;
                var index = i + 1;
                var iconNode = this["icon_" + index] = ccui.helper.seekWidgetByName(this.totalNode, "icon_" + index);
                this.addScoreLable(playerList[i].boom, this.getWidget("scoreLable" + index));
                //显示名字
                var realName = this.getPalyerCanSeeName(playerList[i].name, 100, 25);
                this.getWidget("name_" + index).setString(realName);
                this.getWidget("id_" + index).setString("ID:" + playerList[i].userId);
                this.showIcon(playerList[i].icon, index, playerList[i].sex);
                if (playerList[i].userId == PlayerModel.userId) {
                    myBoom = playerList[i].boom;
                }
            }
        }


        for (var i = 1;i <= 3;i++){
            this["scoreLable"+i].setString("");
        }

        //判断胜负
        if (myBoom >= 0) { //胜利
            this.ImageWin.visible = true;
        } else {        //失
            this.ImageLoss.visible = true;
        }

        //显示每局的详情
        this.listView = this.getWidget("ListView_6");

        for (var i = 0; i < playLog.length; i++) {
            var item = new ClubDtzRecallDetailItem(playLog[i].playerMsg.length , this.checkUserId);
            item.setData(playLog[i]);
            this.listView.pushBackCustomItem(item);
        }

        //时间数据
        this.Label_timeData = this.getWidget("Label_timeData");
        //玩法数据
        this.Label_wanfaData = this.getWidget("Label_wanfaData");
        //解散数据
        this.Label_dissData = this.getWidget("Label_dissData");

        var resultMsg = JSON.parse(this.data.resultMsg);
        var modeMsg = JSON.parse(this.data.modeMsg);

        var createTimeStr = resultMsg.createTime || "";
        this.Label_timeData.setString("创建时间："+createTimeStr);

        var wanfaStr = ClubRecallDetailModel.getWanfaStr(modeMsg.ints);
        this.Label_wanfaData.setString(wanfaStr);

        var dissPlayerStr = ClubRecallDetailModel.getDissPlayerStr(resultMsg)
        this.Label_dissData.setString(dissPlayerStr);
    },

    addScoreLable:function(score , fatherNode){

        //显示分数
        var lableFnt = score >= 0 ? "res/font/dn_bigResult_font_1.fnt" : "res/font/greeNum_0.fnt";
        var sign = score >= 0 ? "+" : "";
        var label = new cc.LabelBMFont(sign + score + "", lableFnt);

        label.x = fatherNode.width / 2 - label.width * 0.5 + 20;
        label.y = fatherNode.height / 2 - label.height * 0.5 ;
        label.scale = 0.8;
        fatherNode.addChild(label);
    },

    showIcon: function (iconUrl, index, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        //cc.log("战绩 显示第" + index + "个玩家的头像" + " url:" + JSON.stringify(iconUrl));
        var url = iconUrl;
        //var icon = this.getWidget("icon_" + index);
        var icon = this["icon_" + index];

        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if (icon.getChildByTag(345)) {
            icon.removeChildByTag(345);
        }

        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 0;
        sprite.y = 0;
        sprite.setScale(0.6);
        icon.addChild(sprite, 5, 345);
        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.scale = 0.6;
                }
            });
        }
    },
    //设置名字的方法 (限制长度)
    getPalyerCanSeeName: function (nameString, width, fontSize) {
        //nameString = "我1想lm试试中文";
        var length = nameString.length;
        var tlableForSize = null;
        var showName = nameString;
        var tName = null;
        var tWidth = 0;

        for (var curLenght = 2; curLenght <= length; curLenght++) {
            tName = nameString.substring(0, curLenght);
            tlableForSize = new cc.LabelTTF(tName, "Arial", fontSize);
            tWidth = tlableForSize.width;
            //cc.log("当前显示的文字为 " + tName + "宽度为:" + tWidth + "");
            if (tWidth >= width) {
                showName = nameString.substring(0, curLenght - 1);
                cc.log("实际显示的文字为:" + showName);
                break;
            }
        }
        return showName;
    },


    //onToHome: function () {
    //    LayerManager.showLayer(LayerFactory.HOME);
    //    PopupManager.remove(this);
    //    PopupManager.removeAll();
    //},

    //战绩分享
    onSharePicture: function () {
        this.listView.visible = false;
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
            self.listView.visible = true;
        }, 500);

    },

});
//打筒子4人的战绩详情
var ClubDtzRecallDetailPop = BasePopup.extend({
    ctor: function (data) {
        this.data = data;
        //cc.log(" " + JSON.stringify(this.data));
        this._super("res/clubDtzRecallDetailPop.json");

    },

    selfRender: function () {
        //加载玩家点击的那条记录数据
        var playLog = this.data.playLog;
        this.playerList = [];
        this.playerData = null;
        var resList = playLog[playLog.length-1].resList;
        var playerMsg = playLog[playLog.length-1].playerMsg;
        for(var i=0;i< resList.length;i++){
            cc.log("resList[i]"+JSON.stringify(resList[i]));
            this.playerList.push(JSON.parse(resList[i]));
        }
        //加载玩家点击的那条记录数据
        this.totalNode = this.getWidget("totalMsg");
        this.roomIdlable = this.getWidget("Label_14");
        this.timelable = this.getWidget("Label_15");
        this.scoreLable1 = this.getWidget("scoreLable1");
        this.scoreLable2 = this.getWidget("scoreLable2");
        this.exScoreNode = this.getWidget("roomExScore");
        this.ImageWin = ccui.helper.seekWidgetByName(this.totalNode, "ImageWin");
        this.ImageLoss = ccui.helper.seekWidgetByName(this.totalNode, "ImageLoss");

        this.shareBtn = this.getWidget("Button_Share");
        //this.returnBtn = this.getWidget("Button_Back");


        //UITools.addClickEvent(this.returnBtn, this, this.onToHome);
        UITools.addClickEvent(this.shareBtn, this, this.onSharePicture);

        //显示时间和房间号
        this.roomIdlable.setString(playLog[0].tableId);
        this.timelable.setString(playLog[playLog.length-1].time);

        //重组玩家列表
        var myGroup = -1;
        for(var i = 0;i < playerMsg.length;i++) {
            if (playerMsg[i].userId == PlayerModel.userId) {
                myGroup = playerMsg[i].group;
            }
        }
        if(myGroup == -1){
            myGroup = playerMsg[0].group;
        }

        var winPlayer = [];
        var lossPlayer = [];
        var sortedPalyer = [];
        var myTeamScore = 0;
        var otherTeamScore = 0;
        //判断以谁的ID来显示战绩数据 如果包含自己 就显示自己 不包含就显示服务器传下来的第一个玩家
        this.checkUserId = this.playerList[0].userId || 0;
        for(var index = 0 ; index < this.playerList.length; index++){
            if(this.playerList[index].userId == PlayerModel.userId){
                this.checkUserId = PlayerModel.userId;
            }
        }


        //cc.log("playerMsg.length===="+playerMsg.length)
        ////对后台下发的玩家数据进行排序处理 第一个玩家为我自身
        //var playerMsgLast = playerMsg[playerMsg.length-1]
        //
        //cc.log("playLog.length"+playLog.length)
        //cc.log("playLog[0]===="+JSON.stringify(playLog[0]))
        for (var index = 0; index < playerMsg.length; index++) {
            var tPlayer = playerMsg[index];
            if (tPlayer.group == myGroup) {
                winPlayer.push(tPlayer);
                myTeamScore += tPlayer.totalPoint;
            } else {
                lossPlayer.push(tPlayer);
                otherTeamScore += tPlayer.totalPoint;
            }

        }
        sortedPalyer = winPlayer.concat(lossPlayer);
        this.playerData = sortedPalyer;

        this.scoreLable1.setString(myTeamScore);
        this.scoreLable2.setString(otherTeamScore);


        for(var i = 0;i < this.playerData.length;i++) {
            var index = i + 1;
            var iconNode = this["icon_" + index] = ccui.helper.seekWidgetByName(this.totalNode, "icon_" + index);
            //显示名字
            var realName = this.getPalyerCanSeeName(this.playerData[i].name, 100, 25);
            this.getWidget("name_" + index).setString(realName);
            this.getWidget("id_" + index).setString("ID:" + this.playerData[i].userId);

            //分组标记
            if (this.playerData[i].group == 1) {
                ccui.helper.seekWidgetByName(iconNode, "ateam_" + index).visible = true;
                ccui.helper.seekWidgetByName(iconNode, "bteam_" + index).visible = false;
            } else {
                ccui.helper.seekWidgetByName(iconNode, "ateam_" + index).visible = false;
                ccui.helper.seekWidgetByName(iconNode, "bteam_" + index).visible = true;
            }
            //显示头像
            this.showIcon(this.playerData[i].icon, index, this.playerData[i].sex);
        }

        var addExScoreTeam = playerMsg[0].winGroup;//如果是中途解散 -1 牌面分相同 0
        var roomExScore = 0;
        if (playerMsg[0]) {
            roomExScore = playerMsg[0].jiangli;
        }


        ////显示房间附加分
        if (roomExScore != null && roomExScore != 0 && (addExScoreTeam == 1 || addExScoreTeam == 2)) {

            var label = new cc.LabelBMFont(roomExScore + "", "res/font/dn_bigResult_font_1.fnt");
            label.x = this.exScoreNode.width / 2;
            label.y = this.exScoreNode.height / 2;
            label.scale = 0.6;
            this.exScoreNode.addChild(label);

            if(addExScoreTeam == myGroup){
                label.x = label.x - 40;
            }else{
                label.x = label.x + 40;
            }

        }

        //最终得分
        var offScore = 0;
        if (this.playerList.length > 0){
            for(var i = 0;i < this.playerList.length;i++) {
                var playerList = this.playerList;
                cc.log("playerList[i].boom::" , playerList[i].boom);
                if (playerList[i].userId == this.checkUserId) {
                    offScore = playerList[i].boom;
                }
            }
        }

        if (offScore > 0 || ( offScore == 0 && myTeamScore > otherTeamScore)) { //胜利
            this.ImageWin.visible = true;
            this.scoreLable1.setColor(cc.color(255, 111, 24));
            this.scoreLable2.setColor(cc.color(65, 167, 31));
        } else {        //失
            this.ImageLoss.visible = true;
            this.scoreLable2.setColor(cc.color(255, 111, 24));
            this.scoreLable1.setColor(cc.color(65, 167, 31));
        }
        var scoreStr = "";
        var lableFnt = null;
        if (offScore >= 0) {
            scoreStr = "+" + offScore + "";
            lableFnt = "res/font/dn_bigResult_font_1.fnt";
        } else {
            scoreStr = offScore + "";
            lableFnt = "res/font/greeNum_0.fnt";
        }
        //显示分差
        cc.log("scoreStr::" , scoreStr);
        this.winScoreLable = ccui.helper.seekWidgetByName(this.totalNode, "lableOffScore");
        var label = new cc.LabelBMFont(scoreStr, lableFnt);
        label.x = this.winScoreLable.width / 2;
        label.y = this.winScoreLable.height / 2;
        label.scale = 0.8;
        this.winScoreLable.addChild(label);


        //显示每局的详情
        this.listView = this.getWidget("ListView_6");

        cc.log("checkUserId::" , this.checkUserId);
        for (var i = 0; i < playLog.length; i++) {
            var item = new ClubDtzRecallDetailItem(playLog[i].playerMsg.length , this.checkUserId);
            item.setData(playLog[i]);
            this.listView.pushBackCustomItem(item);
        }

        //时间数据
        this.Label_timeData = this.getWidget("Label_timeData");
        //玩法数据
        this.Label_wanfaData = this.getWidget("Label_wanfaData");
        //解散数据
        this.Label_dissData = this.getWidget("Label_dissData");

        var resultMsg = JSON.parse(this.data.resultMsg);
        var modeMsg = JSON.parse(this.data.modeMsg);

        var createTimeStr = resultMsg.createTime || "";
        this.Label_timeData.setString("创建时间："+createTimeStr);

        var wanfaStr = ClubRecallDetailModel.getWanfaStr(modeMsg.ints);
        this.Label_wanfaData.setString(wanfaStr);

        var dissPlayerStr = ClubRecallDetailModel.getDissPlayerStr(resultMsg)
        this.Label_dissData.setString(dissPlayerStr);
    },

    showIcon: function (iconUrl, index, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        //cc.log("战绩 显示第" + index + "个玩家的头像" + " url:" + JSON.stringify(iconUrl));
        var url = iconUrl;
        //var icon = this.getWidget("icon_" + index);
        var icon = this["icon_" + index];

        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if (icon.getChildByTag(345)) {
            icon.removeChildByTag(345);
        }

        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 0;
        sprite.y = 0;
        sprite.setScale(0.6);
        icon.addChild(sprite, 5, 345);
        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.scale = 0.6;
                }
            });
        }
    },

    //设置名字的方法 (限制长度)
    getPalyerCanSeeName: function (nameString, width, fontSize) {
        //nameString = "我1想lm试试中文";
        var length = nameString.length;
        var tlableForSize = null;
        var showName = nameString;
        var tName = null;
        var tWidth = 0;

        for (var curLenght = 2; curLenght <= length; curLenght++) {
            tName = nameString.substring(0, curLenght);
            tlableForSize = new cc.LabelTTF(tName, "Arial", fontSize);
            tWidth = tlableForSize.width;
            //cc.log("当前显示的文字为 " + tName + "宽度为:" + tWidth + "");
            if (tWidth >= width) {
                showName = nameString.substring(0, curLenght - 1);
                cc.log("实际显示的文字为:" + showName);
                break;
            }
        }
        return showName;
    },


    onToHome: function () {
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        PopupManager.removeAll();
    },

    //战绩分享
    onSharePicture: function () {
        this.listView.visible = false;
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
            self.listView.visible = true;
        }, 500);

    },

});






