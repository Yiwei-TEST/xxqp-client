/**1
 * Created by zhoufan on 2016/6/30.
 */

var QFBigResultPop = BasePopup.extend({

    ctor: function (data) {
        this.data = data;
        //cc.log("大结显示的数据..." , JSON.stringify(this.data));
        var json = "res/qfBigResult.json";
        this._super(json);
    },

    selfRender: function () {

        //先按照名次排序 后台懒得做 那前端自己处理
        this.data.sort(function (user1 , user2){
            var totalPoint1 = parseInt(user1.totalPoint);
            var totalPoint2 = parseInt(user2.totalPoint);
            return  totalPoint1 < totalPoint2;
        });


        this.setData(this.data);

        var btnShare = this.getWidget("btnShare");
        if (btnShare) {
            UITools.addClickEvent(btnShare, this, this.onShare);
        }
        var btnReturn = this.getWidget("btnReturn");
        UITools.addClickEvent(btnReturn, this, this.onToHome);
        var Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(Button_close, this, this.onToHome);

        //房间号
        this.getWidget("Label_roomId").setString(""+QFRoomModel.tableId);
        //玩法 改为局数
        //var save6Desc = QFRoomModel.getSave67Str();
        //var xiWayDesc = QFRoomModel.getXiWayStr();
        //var exScoreDesc = QFRoomModel.getExScoreStr();
        //this.getWidget("Label_wanfa").setString(save6Desc + " " + xiWayDesc + " " + exScoreDesc);
        this.getWidget("Label_wanfa").setString("局数："+ClosingInfoModel.round);
        //时间
        this.getWidget("Label_time").setString(ClosingInfoModel.ext[2]);
        //版本号
        this.getWidget("Label_version").setString(SyVersion.v);

        //俱乐部房间图片标识
        tableType = ClosingInfoModel.ext[8];
        this.Image_jlbRoom = this.getWidget("Image_jlbRoom");
        this.Image_jlbRoom.visible = false;
        if (QFRoomModel.isClubRoom(tableType)){
            this.Image_jlbRoom.visible = true;
        }
        if(QFRoomModel.tableType == 1){//亲友圈房间才可见;
            var Button_fxCard = UICtor.cBtn("res/wzyx/yjBigResult/fxmingpianCard.png");
            btnShare.getParent().addChild(Button_fxCard);
            Button_fxCard.y =  btnShare.y;
            UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
            btnReturn.x += 110;
            btnShare.x +=200 ;
            Button_fxCard.x = btnShare.x-(btnReturn.x-btnShare.x);
        }
        this.getWidget("Label_credit_tip").setString("");
        if (QFRoomModel.isCreditRoom()){
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = QFRoomModel.getCreditType();
            var giveWay = QFRoomModel.getCreditWay();
            var giveNum = QFRoomModel.getCreditGiveNum();
            if (giveType == 1){
                if(!QFRoomModel.getCreditPayWay()){
                    giveStr = giveStr + "固定赠送,";
                }
            }else{
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1){
                if(QFRoomModel.getCreditPayWay()){
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
            this.getWidget("Label_credit_tip").setString("底分:"+QFRoomModel.getCreditScore() + "," + giveStr);
        }else if(QFRoomModel.isClubGoldRoom()){
            this.getWidget("Label_credit_tip").setString(QFRoomModel.getClubGlodCfg());
        }

        if(QFRoomModel.getIsSwitchCoin()) {
            this.btn_result_coin = new ccui.Button("res/ui/bjdmj/popup/pyq/club_btn_jinbijiesuan.png", "res/ui/bjdmj/popup/pyq/club_btn_jinbijiesuan.png");
            this.btn_result_coin.setPosition(btnShare.x-350, btnShare.y);
            this.addChild(this.btn_result_coin);
            UITools.addClickEvent(this.btn_result_coin,this,this.clubCoinResult);
            this.btn_result_coin.setScale(0.8);
        }
    },

    clubCoinResult:function(){
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return
        }

        for(var i = 0;i < this.data.length;i++){
            for(var j = 0;j < ClosingInfoModel.clubResultCoinData.length;j++){
                if(ClosingInfoModel.clubResultCoinData[j].userId == this.data[i].userId){
                    ClosingInfoModel.clubResultCoinData[j].name = this.data[i].name;
                    ClosingInfoModel.clubResultCoinData[j].icon = this.data[i].icon;
                    break;
                }
            }
        }

        var mc = new ClubCoinResultPop(ClosingInfoModel.clubResultCoinData);
        this.addChild(mc,1000);
    },

    onShareCard:function() {
        this.shareCard(QFRoomModel, PlayerModel, ClosingInfoModel.groupLogId);
    },



    //先按照名次排序 后台懒得做 那前端自己处理
    setData:function (data) {
        //先算出本局的排名
        var nowBurCount  = ClosingInfoModel.round;
        for (var i = 0; i < data.length; i++){
            var user = data[i];
            var mingci1 = parseInt(user.ext[2]);
            var ext =  user.ext;
            var allGamesList = ext[1].split(";");
            var scoreList = [0,0,0,0];
            var exScore = 0;
            for (var j = 0; j < allGamesList.length; j++){
                var gamesList = allGamesList[j].split(",");
                scoreList[0] = parseInt(scoreList[0]) + parseInt(gamesList[1]) + parseInt(gamesList[3]);
                scoreList[1] = parseInt(scoreList[1]) + parseInt(gamesList[2]);
                if (j == allGamesList.length - 1){
                    exScore = gamesList[gamesList.length-1];
                }
                scoreList[2] = parseInt(exScore) + parseInt(scoreList[0]);
                scoreList[3] = (scoreList[2]/100).toFixed(0)*100;
            }
            // cc.log("scoreList::::::::::"+scoreList);

            ////显示玩家名次
            this.showMingci( i , mingci1);
            ////显示玩家头像
            this.showIcon(user.icon , i , user.sex);
            ////显示玩家头像
            this.showName(i , user.name, user.userId);
            ////显示玩家分数
            this.showScore(i , scoreList, user.totalPoint, exScore);

            var index = i+1;
            if (QFRoomModel.isCreditRoom()){
                var credit = user.winLoseCredit;
                credit = MathUtil.toDecimal(credit/100);
                this.getWidget("Label_credit"+index).setString(""+credit);//比赛分
                //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+user.ext[10]);//比赛分
                this.getWidget("Image_credit"+index).visible = true;
            }else if(QFRoomModel.isClubGoldRoom()){
                var img_credit = this.getWidget("Image_credit"+index);
                img_credit.visible = true;
                img_credit.setOpacity(0);

                var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
                icon.setScale(0.7);
                icon.setPosition(img_credit.x - 30,img_credit.y);
                img_credit.getParent().addChild(icon);


                var num = user.winLoseCredit;
                if(num > 0)num = "+" + num;

                this.getWidget("Label_credit"+index).setString(num);
            }
        }
        if(data.length == 2){
            var TeamBg1 = this.getWidget("TeamBg1");
            var TeamBg2 = this.getWidget("TeamBg2");
            TeamBg1.x += 100;
            TeamBg2.x += 276;
            this.getWidget("TeamBg3").visible = false;
        }
    },

    //显示玩家名字
    showName:function(i , nameStr, userId){
        var index = i + 1;
        var name = this.getWidget("n" + index);
        name.setString(""+nameStr);
        this.getWidget("userid" + index).setString("ID:"+userId)
        this.getWidget("userid" + index).x+= 25;
        this.getWidget("userid" + index).y+= 3;
    },
    //显示玩家名字
    showScore: function (i, scoreList, jsScore, _exScore) {
        // cc.log("scoreList")
        var index = i + 1;
       // this.getWidget("LabelJsScore" + index).setString("( 系统结算" + jsScore + " )");
        var fnt = "res/font/bmfont_2.fnt";
        var exStr = "";
        var LabelJsScore = new cc.LabelBMFont(exStr + jsScore, fnt);
        var Label_xi =this.getWidget("LabelJsScore" + index);
        LabelJsScore.anchorX = 0;
        LabelJsScore.x = Label_xi.x + 10;
        LabelJsScore.y = Label_xi.y;
        Label_xi.getParent().addChild(LabelJsScore);
        LabelJsScore.scale= 0.9;
       
        var fnt = index == 1 ? "res/font/bmfont_1.fnt" : "res/font/bmfont_2.fnt";
        var exStr = "";
        var LabelXiScore = new cc.LabelBMFont(exStr + scoreList[1], fnt);
        var Label_xi = this.getWidget("Label_xi" + index);
        LabelXiScore.anchorX = 0;
        LabelXiScore.x = Label_xi.x + 25;
        LabelXiScore.y = Label_xi.y;
        Label_xi.getParent().addChild(LabelXiScore);
        LabelXiScore.scale= 0.9;

        fnt = index == 1 ? "res/font/bmfont_1.fnt" : "res/font/bmfont_2.fnt";
        exStr = "";
        var LabelJiScore = new cc.LabelBMFont(exStr + scoreList[3], fnt);
        var Label_ji = this.getWidget("Label_ji" + index);
        LabelJiScore.anchorX = 0;
        LabelJiScore.x = Label_ji.x + 25;
        LabelJiScore.y = Label_ji.y;
        Label_ji.getParent().addChild(LabelJiScore);
        LabelJiScore.scale = 0.9;
        
        var jfStr = _exScore == 0 ? "无" : ""+_exScore;
        this.getWidget("LabelJlScore" + index).setString(jfStr);
        this.getWidget("LabelScore" + index).setString(""+scoreList[0]);
        this.getWidget("LabelallScore" + index).setString(""+scoreList[2]);
        this.getWidget("Label4s5rScore" + index).setString(""+scoreList[3]);
        if (index == 1){
            Label_ji.setColor(cc.color(254,227,0));
            Label_xi.setColor(cc.color(254,227,0));
        }
    },

    //显示玩家名次
    showMingci:function(i , rank){
        var index = i + 1;
        if(index == 1){
            this.getWidget("rank" + index).setVisible(true);
            //this.getWidget("TeamBg" + index).loadTexture("res/res_yjqf/qfSmallResult/imgresult_di2.png");
        }else if(index == 3){
            var tCurWidget = this.getWidget("rank" + index);
            tCurWidget.visible = true;
            var imgPath = "res/res_yjqf/qfSmallResult/imgresult_fuhao.png";
            tCurWidget.loadTexture(imgPath);
        }
    },

    //新增显示玩家头像
    showIcon:function(iconUrl , i ,sex){
        var index = i + 1;
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        cc.log("显示第"+ index +"个玩家的头像" + " url:" + JSON.stringify(iconUrl));
        // if(sex == 1){
        //     this.getWidget("Image_sex" + index).loadTexture("res/res_yjqf/qfSmallResult/sex_man.png");
        // }
        this.getWidget("Image_sex" + index).visible = false;                
        var icon = this.getWidget("PlayerIcon" + index);
        var defaultimg = (sex == 1) ? "res/res_yjqf/images/default_m.png" : "res/res_yjqf/images/default_w.png";
        if (icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 32;
        sprite.y = 35;
        sprite.setScale(0.85);
        icon.addChild(sprite, 5, 345);
        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    //sprite.scale = 0.8;
                }
            });
        }

    },

    sortCardlists: function (vo1, vo2) {
        if(vo1 != null && vo2 != null){
            var item1 = QFAI.getCardDef(vo1);
            var item2 = QFAI.getCardDef(vo2);
            if (item1.i != item2.i) {
                return item1.i - item2.i;
            } else {
                return item1.t - item2.t;
            }
        }
        return false;

    },

    /**
     * 分享战报
     */
    onShare: function () {
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
        obj.tableId = QFRoomModel.tableId;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?userName=' + encodeURIComponent(PlayerModel.name);
        obj.title = "千分   房号:" + QFRoomModel.tableId;
        obj.description = "我已在千分开好房间,纯技术实力的对决！";
        obj.shareType = 0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function () {
            sy.scene.hideLoading();
            SharePop.show(obj);
        }, 500);
    },

    onToHome: function () {
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        PopupManager.removeAll();

        var isClubRoom =  (QFRoomModel.tableType ==1);
        if(isClubRoom ){
            PopupManager.removeClassByPopup(PyqHall);
            var mc = new PyqHall();//先不弹出吧
            PopupManager.addPopup(mc);
        }
    }
});
