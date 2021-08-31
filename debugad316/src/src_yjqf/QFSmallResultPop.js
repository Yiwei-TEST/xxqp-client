/**
 * Created by zhoufan on 2016/6/30.
 */
var QFSmallResultPop = BasePopup.extend({

    ctor: function (data) {
        this.data = data;
        //cc.log("小结显示的数据..." , JSON.stringify(this.data));
        var json = "res/qfSmallResult.json";
        this._super(json);
    },

    selfRender: function () {
        //先按照名次排序 后台懒得做 那前端自己处理
        ClosingInfoModel.closingPlayers.sort(function (user1 , user2){
            var mingci1 = parseInt(user1.ext[2]);
            var mingci2 = parseInt(user2.ext[2]);
           return  mingci1 > mingci2;
        });

        this.setData(ClosingInfoModel.closingPlayers);

        this.issent = false;

        this.addCustomEvent(SyEvent.SETTLEMENT_SUCCESS,this,this.onSettlement);
        cc.log("添加点击监听...");
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);

        var closeBtn = this.getWidget("close_btn");  // 关闭按钮
        if(closeBtn){
            UITools.addClickEvent(closeBtn,this,this.onOk);
        }

        var jsBtn = this.getWidget("Button_js");  // 解散按钮
        if(jsBtn) {
            UITools.addClickEvent(jsBtn, this, this.onShare);
        }

        if(ClosingInfoModel.closingPlayers.length == 2){
            this.getWidget("Label_42").setString("第二名剩牌 ：");
        }
        //房间号
        this.getWidget("Label_roomId").setString("房间号："+QFRoomModel.tableId);
        //玩法
        var save6Desc = QFRoomModel.getSave67Str();
        var xiWayDesc = QFRoomModel.getXiWayStr();
        var exScoreDesc = QFRoomModel.getExScoreStr();
        this.getWidget("Label_wanfa").setString(save6Desc + " " + xiWayDesc + " " + exScoreDesc);
        //时间
        this.getWidget("Label_time").setString(ClosingInfoModel.ext[2]);
        //版本号
        this.getWidget("Label_version").setString(SyVersion.v);

        //俱乐部房间图片标识
        var tableType = 0;
        tableType = ClosingInfoModel.ext[8];
        this.Image_jlbRoom = this.getWidget("Image_jlbRoom");
        this.Image_jlbRoom.visible = false;
        if (QFRoomModel.isClubRoom(tableType)){
            this.Image_jlbRoom.visible = true;
        }
        //this.listener = SyEventManager.addEventListener(SyEvent.DISAGREE_APPLYEXITROOM,this,this.removePop);
    },
    removePop:function(){
        if(this.listener){
            SyEventManager.removeListener(this.listener);
        }
        PopupManager.remove(this);
    },



    //先按照名次排序 后台懒得做 那前端自己处理
    setData:function (data) {
        var cardList = [];
        //先算出本局的排名
        var nowBurCount  = ClosingInfoModel.round;
        for (var i = 0; i < data.length; i++){
            var user = data[i];
            var mingci1 = parseInt(user.ext[2]);
            var ext =  user.ext;
            var allGamesList = ext[1].split(";");
            var scoreList = [0,0,0,0,0];
            for (var j = 0; j < allGamesList.length; j++){
                var gamesList = allGamesList[j].split(",");
                if (nowBurCount == parseInt(gamesList[0])){
                    scoreList[0] = parseInt(gamesList[1]);
                    scoreList[1] = parseInt(gamesList[2]);
                    scoreList[2] = parseInt(gamesList[3]);
                }
                scoreList[3] = parseInt(scoreList[3]) + parseInt(gamesList[1]) + parseInt(gamesList[3]);
                scoreList[4] = parseInt(scoreList[4]) + parseInt(gamesList[2]);
            }


            ////显示玩家名次
            this.showMingci( i , mingci1);
            ////显示玩家头像
            this.showIcon(user.icon , i , user.sex);
            ////显示玩家头像
            this.showName(i , user.name, user.userId);
            ////显示玩家分数
            if(i == 0){
                QFRoomModel.aTeamTotalXiScore = scoreList[4];
                QFRoomModel.aTeamCurScore = 0;
                QFRoomModel.aTeamTongziScore = 0;
            }else if(i == 1){
                QFRoomModel.bTeamTotalXiScore = scoreList[4];
                QFRoomModel.bTeamCurScore = 0;
                QFRoomModel.bTeamTongziScore = 0;
            }else{
                QFRoomModel.cTeamTotalXiScore = scoreList[4];
                QFRoomModel.cTeamCurScore = 0;
                QFRoomModel.cTeamTongziScore = 0;
            }

            this.showScore(i , scoreList);
            //获得最后一名的剩余牌
            if (i == data.length - 1){
                cardList = user.cards;
                QFRoomModel.cutCardSeat = user.seat;
            }
        }
        if(data.length == 2) {
            this.getWidget("TeamBg3").visible = false;
            this.showPlayer3HandCards(ClosingInfoModel.pdkcutCard);
        }
        //显示最后一名的剩余牌
        this.showLastCard(cardList);
    },

    showPlayer3HandCards:function(handcards){
        handcards.sort(this.sortCardlists);
        var offX = 37;
        for(var cardIndex = 0 ; cardIndex < handcards.length ; cardIndex ++){
            var cardMsg = QFAI.getCardDef(handcards[cardIndex]);
            var cardItem = new QFBigCard(cardMsg);
            cardItem.cardId = cardIndex;
            cardItem.anchorX = 0.5;
            cardItem.anchorY = 0;
            cardItem.scale = 0.8;
            cardItem.x = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 +121+offX*cardIndex+offX*2;
            cardItem.y = 342;
            this.addChild(cardItem);
        }
    },

    showLastCard:function(cardsData){
        cardsData.sort(this.sortCardlists);
        var offX = 30;
        for(var cardIndex = 0 ; cardIndex < cardsData.length ; cardIndex ++){
            var cardMsg = QFAI.getCardDef(cardsData[cardIndex]);
            var cardItem = new QFBigCard(cardMsg);
            cardItem.cardId = cardIndex;
            cardItem.anchorX = 0.5;
            cardItem.anchorY = 0;
            cardItem.scale = 0.5;
            cardItem.x = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 + 370+offX*cardIndex+offX;
            cardItem.y = 218;
            this.addChild(cardItem);
        }

    },

    //显示玩家名字
    showName:function(i , nameStr, userId){
        var index = i + 1;
        var name = this.getWidget("n" + index);
        name.setString(""+nameStr);
        this.getWidget("userid" + index).setString(""+userId);
    },
    //显示玩家分数v
    showScore:function( i, scoreList){
        var index = i + 1;
        for (var j = 0; j < scoreList.length; j++){
            this.getWidget("LabelScore" + index).setString(""+scoreList[0]);
            this.getWidget("LabelXiScore" + index).setString(""+scoreList[1]);
            this.getWidget("LabelMcScore" + index).setString(""+scoreList[2]);
            this.getWidget("LabelLjjfScore" + index).setString(""+scoreList[3]);
            this.getWidget("LabelLjxfScore" + index).setString(""+scoreList[4]);
        }
    },
    //显示玩家名次
    showMingci:function(i , rank){
        var index = i + 1;
        var imgPath = "res/res_yjqf/qfSmallResult/mingci" + index + ".png";
        var tCurWidget = this.getWidget("rank" + index);
        tCurWidget.visible = true;
        tCurWidget.loadTexture(imgPath);
    },

    //新增显示玩家头像
    showIcon:function(iconUrl , i ,sex){
        var index = i + 1;
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        cc.log("显示第"+ index +"个玩家的头像" + " url:" + JSON.stringify(iconUrl));
        var icon = this.getWidget("PlayerIcon" + index);
        var defaultimg = (sex == 1) ? "res/res_yjqf/images/default_m.png" : "res/res_yjqf/images/default_w.png";

        cc.log("iconUrl..." , iconUrl , JSON.stringify(iconUrl).length);

        if (icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 50;
        sprite.y = 50;
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

        //if(iconUrl){
        //    cc.log("加载网络头像");
        //    sprite.x = sprite.y = 0;
        //    try{
        //        var sten = new cc.Sprite("res/res_yjqf/images/img_14_c.png");
        //        sten.setScale(0.75);
        //        var clipnode = new cc.ClippingNode();
        //        clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 30, y: 30, alphaThreshold: 0.8});
        //        clipnode.addChild(sprite);
        //        itemNode.addChild(clipnode,5,345);
        //        var self = this;
        //        cc.loader.loadImg(url, {width: 252, height: 252}, function (error, img) {
        //            if (!error && (LayerManager.getCurrentLayer()==LayerFactory.QF_ROOM)) {
        //                sprite.setTexture(img);
        //                sprite.x = 0;
        //                sprite.y = 0;
        //            }else{
        //                cc.log("QFSmallResult load error")
        //                self._iconUrl = "";
        //            }
        //        });
        //    }catch(e){}
        //}else{
        //    cc.log("直接显示默认头像");
        //    sprite.x = sprite.y = 30;
        //    itemNode.addChild(sprite , 5 , 345);
        //}
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

    onJieSan:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    onOk:function(){
        cc.log("onOk!!!!");
        var data = ClosingInfoModel.closingPlayers;
        // cc.log("ClosingInfoModel.gotoBigResult====="+ClosingInfoModel.gotoBigResult)
        if(parseInt(ClosingInfoModel.gotoBigResult) > 0){
            cc.log("come to show big result popView...");
            PopupManager.remove(this);
            var todayjushu = parseInt(cc.sys.localStorage.getItem("today_jushu"))||0;
            cc.sys.localStorage.setItem("today_jushu",todayjushu+1);
            var mc = new QFBigResultPop(data);
            PopupManager.addPopup(mc);
            return;
        }

        this.issent = true;
        var user = data[data.length - 1];
        var vo = QFRoomModel.getPlayerVoBySeat(user.seat);
        // cc.log(" vo = "+JSON.stringify(vo));
        sySocket.sendComReqMsg(3);

        PopupManager.remove(this);
    },

    onSettlement:function(){
        PopupManager.remove(this);
    },

    update:function(dt){
        this.dt += dt;
        if(this.dt >= 1){
            this.dt = 0;
            if(!this.issent){
                this.start--;
                if(this.start <= 0){
                    this.unscheduleUpdate();
                    this.onOk();
                    return;
                }
                // this.Label_43.setString(this.start+"秒后自动关闭");
            }
        }
    },

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

    onClose:function(){
        this.unscheduleUpdate();
    }
});
