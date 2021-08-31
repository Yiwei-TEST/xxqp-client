/**
 * Created by zhoufan on 2016/6/30.
 */
var DTZSmallResultPop = BasePopup.extend({

    ctor: function (data) {
        this.data = data;
        cc.log("小结显示的数据..." , JSON.stringify(this.data));
        var json = !this.is4Ren() ? "res/dtz3RenSmallResult.json" : "res/dtzSmallResult.json";
        this._super(json);
    },

    is4Ren: function() {
        return (this.data.length == 4);
    },

    is3Ren: function() {
        return (this.data.length == 3);
    },

    is2Ren: function() {
        return (this.data.length == 2);
    },

    loadExtData: function(userData){
        var index = 0;
        userData.totalFive = parseInt(userData.ext[index]);
        userData.totalTen = parseInt(userData.ext[++index]);
        userData.totalK = parseInt ( userData.ext[++index] );
        userData.totalTongzi = parseInt (userData.ext[++index]);
        userData.totalXi = parseInt (userData.ext[++index]);
        userData.totalxiJacks = parseInt(userData.ext[++index]) ;
        userData.totalxiJackb = parseInt(userData.ext[++index]) ;
        userData.totalSuperBoom = parseInt(userData.ext[++index]);
        userData.isGuan = parseInt (userData.ext[++index]);
        userData.tzA = parseInt(userData.ext[++index]);
        userData.tzK = parseInt (userData.ext[++index]);
        userData.tz2 = parseInt (userData.ext[++index]);
        userData.group = parseInt (userData.ext[++index]);
        userData.mingci = parseInt(userData.ext[++index]);
        ++index;//这位暂时没用到
        ++index;//这位暂时没用到
        userData.tzsKing = parseInt(userData.ext[++index]);
        userData.tzbKing = parseInt(userData.ext[++index]);

        //k,A,2，5-Q喜
        userData.xiK = parseInt(userData.ext[23]) || 0;
        userData.xiA = parseInt(userData.ext[24]) || 0;
        userData.xi2 = parseInt(userData.ext[25]) || 0;
        userData.q5 = parseInt(userData.ext[26]) || 0;

    },

    selfRender: function () {

        if(this.is2Ren()) {
            this.getWidget("thirdTeamBg").visible = false;
            this.getWidget("Image_456").loadTexture("res/res_dtz/dtz3RenSmallResult/dtz3RenSmallResult_2.png");
            this.getWidget("Image_456").x = 150;
            this.getWidget("Image_456").y = 270;
            this.getWidget("btnok").x = 900;
            this.getWidget("xipai_btn").x += 60;
            //this.getWidget("secondTeamBg").y += 5;
        }
        //先按照名次排序 后台懒得做 那前端自己处理
        //统计名次的情况
        this.changeScore = 0;
        this.winTeam = 0;

        for(var i = 0;  i < this.data.length ; i++) {
            this.loadExtData(this.data[i])
        }

        this.data.sort(function (user1 , user2){
           return  user1.mingci > user2.mingci;
        });

        //之后要改为按照开房类型来确定增减的分数
        var guanStatu = 0;
        this.winTeam = this.data[0].group;
        if (this.is4Ren()) {
            if(this.data[0].group == this.data[1].group){
                this.changeScore = DTZRoomModel.wanfa == DTZRoomModel.wanfa3? 120:160;
                guanStatu = 2;//双关
            }else if(this.data.length > 2 && this.data[0].group == this.data[2].group){
                this.changeScore = DTZRoomModel.wanfa == DTZRoomModel.wanfa3? 60:80;
                guanStatu = 1;//单关
            }else{
                guanStatu = 0;//未关
                this.changeScore = 0;
            }
        } else if(this.is3Ren()){
            var changeScoreDef = [100,-40,-60];
            for (var i=0;i<this.data.length;i++) {
                this.data[i].changeScore = changeScoreDef[i];
            }
            guanStatu = 0;
        } else {
            var changeScoreDef = [60,-60];
            for (var i=0;i<this.data.length;i++) {
                this.data[i].changeScore = changeScoreDef[i];
            }
            guanStatu = 0;
        }
        cc.log("名次影响的分数为:" + this.changeScore + "上游组" + this.winTeam);

        this.data.sort(function (user1 , user2){//还原成按照编组排行
            if(user1.group == user2.group){
                return user1.mingci > user2.mingci
            }else{
                return user1.group > user2.group;
            }
        });

        var aScore = 0;
        var bScore = 0;
        var cScore = 0;
        this.aTeamData = {totalFive:0 , totalTen:0 , totalK:0 ,tzsKing:0, tzbKing:0 ,totalTongzi:0 , totalSuperBoom:0 ,totalXi:0 ,
            totalTongziScore: 0 , totalXiScore : 0 ,totalXiSx : 0 ,totalXiScoreSx : 0};
        this.bTeamData = {totalFive:0 , totalTen:0 , totalK:0 ,tzsKing:0, tzbKing:0 ,totalTongzi:0 , totalSuperBoom:0 ,totalXi:0 ,
            totalTongziScore: 0 , totalXiScore : 0 ,totalXiSx : 0 ,totalXiScoreSx : 0};
        this.cTeamData = {totalFive:0 , totalTen:0 , totalK:0 ,tzsKing:0, tzbKing:0, totalTongzi:0 , totalSuperBoom:0 ,totalXi:0 ,
            totalTongziScore: 0 , totalXiScore : 0 ,totalXiSx : 0 ,totalXiScoreSx : 0};

        for(var i = 0;  i < this.data.length ; i++){
            var seq = i+1;
            var user = this.data[i];
            //加载ext中的数据
            this.getWidget("n"+seq).setString(user.name);
            //cc.log("user.group = " , user.group , user.point , user.totalFive , user.totalK , user.totalTen , user.totalSuperBoom , user.totalxiJacks , user.totalxiJackb);
            //cc.log("user.group = " , user.xiK , user.xiA , user.q5);

            var teamIconA = ccui.helper.seekWidgetByName(this.getWidget("PlayerIcon"+ seq), "Image_aTeam");
            var teamIconB = ccui.helper.seekWidgetByName(this.getWidget("PlayerIcon"+ seq), "Image_bTeam");
            if (teamIconA){
                teamIconA.visible = false;
            }if (teamIconB){
                teamIconB.visible = false;
            }
            if(user.group == 1){
                var teamIcon = ccui.helper.seekWidgetByName(this.getWidget("PlayerIcon"+ seq), "Image_aTeam");
                if(teamIcon) {
                    teamIcon.x += 45;
                    teamIcon.y += 45;
                    teamIcon.visible = true
                }
                //ccui.helper.seekWidgetByName(this.getWidget("PlayerIcon"+ seq), "Image_aTeam").visible = true;
                aScore += user.point;
                this.aTeamData.totalFive += user.totalFive;
                this.aTeamData.totalK += user.totalK;
                this.aTeamData.totalTen += user.totalTen;
                this.aTeamData.tzsKing += user.tzsKing;
                this.aTeamData.tzbKing += user.tzbKing;
                this.aTeamData.totalSuperBoom += user.totalSuperBoom;
                this.aTeamData.totalTongzi += user.totalTongzi;
                this.aTeamData.totalXi += user.totalXi + user.totalxiJacks + user.totalxiJackb;
                this.aTeamData.totalXiScore += user.totalXi * 100 + user.totalxiJacks * 200 + user.totalxiJackb * 200;
                this.aTeamData.totalTongziScore += user.tzK * 100 + user.tzA * 200 + user.tz2 * 300 + (user.tzsKing + user.tzbKing) * 400;
                this.aTeamData.totalXiSx += user.xiK + user.xiA + user.xi2 + user.q5;
                this.aTeamData.totalXiScoreSx += user.xiK * 500 + user.xiA * 600 + user.xi2 * 700 + user.q5 * 400;
            } else if (user.group == 3) {
                cScore += user.point;
                this.cTeamData.totalFive += user.totalFive;
                this.cTeamData.totalK += user.totalK;
                this.cTeamData.totalTen += user.totalTen;
                this.cTeamData.tzsKing += user.tzsKing;
                this.cTeamData.tzbKing += user.tzbKing;
                this.cTeamData.totalSuperBoom += user.totalSuperBoom;
                this.cTeamData.totalTongzi += user.totalTongzi;
                this.cTeamData.totalXi += user.totalXi + user.totalxiJacks + user.totalxiJackb;
                this.cTeamData.totalXiScore += user.totalXi * 100 + user.totalxiJacks * 200 + user.totalxiJackb * 200;
                this.cTeamData.totalTongziScore += user.tzK * 100 + user.tzA * 200 + user.tz2 * 300 + (user.tzsKing + user.tzbKing) * 400;
                this.cTeamData.totalXiSx += user.xiK + user.xiA + user.xi2 + user.q5;
                this.cTeamData.totalXiScoreSx += user.xiK * 500 + user.xiA * 600 + user.xi2 * 700 + user.q5 * 400;
            } else{
                var teamIcon = ccui.helper.seekWidgetByName(this.getWidget("PlayerIcon"+ seq), "Image_bTeam");

                if(teamIcon) {
                    teamIcon.x += 45;
                    teamIcon.y += 45;
                    teamIcon.visible = true
                }
                //ccui.helper.seekWidgetByName(this.getWidget("PlayerIcon"+ seq), "Image_bTeam").visible = true;
                bScore += user.point;
                this.bTeamData.totalFive += user.totalFive;
                this.bTeamData.totalK += user.totalK;
                this.bTeamData.totalTen += user.totalTen;
                this.bTeamData.tzsKing += user.tzsKing;
                this.bTeamData.tzbKing += user.tzbKing;
                this.bTeamData.totalSuperBoom += user.totalSuperBoom;
                this.bTeamData.totalTongzi += user.totalTongzi;
                this.bTeamData.totalXi += user.totalXi + user.totalxiJacks + user.totalxiJackb;
                this.bTeamData.totalXiScore += user.totalXi * 100 + user.totalxiJacks * 200 + user.totalxiJackb * 200;
                this.bTeamData.totalTongziScore += user.tzK * 100 + user.tzA * 200 + user.tz2 * 300 + (user.tzsKing + user.tzbKing) * 400;
                this.bTeamData.totalXiSx += user.xiK + user.xiA + user.xi2 + user.q5;
                this.bTeamData.totalXiScoreSx += user.xiK * 500 + user.xiA * 600 + user.xi2 * 700 + user.q5 * 400;
            }

            if(DTZRoomModel.isKlsx()){//快乐四喜特殊处理喜
                this.aTeamData.totalXi = this.aTeamData.totalXiSx;
                this.bTeamData.totalXi = this.bTeamData.totalXiSx;
                this.cTeamData.totalXi = this.cTeamData.totalXiSx;
                this.aTeamData.totalXiScore = this.aTeamData.totalXiScoreSx;
                this.bTeamData.totalXiScore = this.bTeamData.totalXiScoreSx;
                this.cTeamData.totalXiScore = this.cTeamData.totalXiScoreSx;
            }


            if(DTZRoomModel.is4FuPai() && !DTZRoomModel.isKlsx()){//四副牌玩法筒子不算分  DTZRoomModel.wanfa == DTZRoomModel.wanfa4
                this.aTeamData.totalTongziScore = 0;
                this.bTeamData.totalTongziScore = 0;
            }

            //显示玩家关加分
            if (this.is4Ren()) {
                if(user.group == this.winTeam){
                    this.showAddScore(i , this.changeScore , guanStatu);
                }else{
                    this.showAddScore(i , -this.changeScore , guanStatu);
                } 
            } else if(this.is3Ren()){
                this.showAddScore(i , this.data[i].changeScore , guanStatu);
            } else {
                this.showAddScore(i , this.data[i].changeScore , guanStatu);
            }
            //显示玩家头像
            this.showIcon(user.icon , seq , user.sex);
            //显示玩家名次
            this.showMingci( i , user.mingci);
        }

        //显示分数详情
        this.showDetail();

        //显示两组分数
        this.getWidget("LabelScore1").setString(aScore + "");
        this.getWidget("LabelScore2").setString(bScore + "");
        if (this.is3Ren()) {
            this.getWidget("LabelScore3").setString(cScore + "");
        }

        for(;i<this.data.length;i++){
            var seq = i+1;
            this.getWidget("l"+seq).visible = false;
            this.getWidget("n"+seq).visible = false;
            this.getWidget("bm"+seq).visible = false;
            this.getWidget("qg"+seq).visible = false;
        }

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
        if(jsBtn){
            UITools.addClickEvent(jsBtn,this,this.onJieSan);
        }

        //显示玩家剩余手牌
        var data = this.data;
        //cc.log("小结后台下发的所有数据" , JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            cc.log("显示玩家手牌" , i);
            var cardsData = data[i].cards;
            this.showLeftHandCards(i , cardsData);
        }

        //显示扑八张
        cc.log("ClosingInfoModel.cutCard..." , ClosingInfoModel.cutCard.length);
        if(ClosingInfoModel.cutCard.length > 0){
            cc.log("显示八张牌...");
            this.showDarkCards(ClosingInfoModel.cutCard)
        }else{
            this.getWidget("Label_26").visible = false;
            if(this.getWidget("btnok")){
                cc.log("this.getWidget(btnok).x..." , this.getWidget("btnok").x);
                this.getWidget("btnok").x = this.getWidget("btnok").x - 272;
            }
        }

        //版本号
        this.getWidget("Label_version").setString(SyVersion.v);

        //俱乐部房间图片标识
        var tableType = 0;
        tableType = ClosingInfoModel.ext[8];
        if (this.is3Ren()){
            tableType = ClosingInfoModel.ext[9];
        }
        this.Image_jlbRoom = this.getWidget("Image_jlbRoom");
        this.Image_jlbRoom.visible = false;
        if (DTZRoomModel.isClubRoom(tableType)){
            this.Image_jlbRoom.visible = true;
        }

        var xipai_btn = this.getWidget("xipai_btn");
        var self = this;
        UITools.addClickEvent(xipai_btn,this,function(){
            sySocket.sendComReqMsg(4501,[],"");
            PopupManager.remove(self);
            self.onOk();
        });
        // cc.log("PDKRoomModel.creditConfig =",PDKRoomModel.creditConfig);
        if(ClosingInfoModel.gotoBigResult >= 0 || ClosingInfoModel.ext[22] == 1){
            xipai_btn.visible = false;
        }else{
            xipai_btn.visible = DTZRoomModel.creditConfig[10] == 1;
        }
        var xpkf = DTZRoomModel.creditXpkf.toString() || 0;
        this.getWidget("label_xpkf").setString(xpkf);

    },


    //显示名次的分数奖励
    showAddScore:function(index , changeScore , guanStatu){
        index = index + 1;
        var guanSp = null;
        var fatherNode = this.getWidget("addScoreImg" + index);
        cc.log("guanStatu..." , guanStatu , index , changeScore);
        var scorLable = this.getWidget("lableScore" + index);
        scorLable.setTextColor(cc.color(35 , 180 , 69));
        var imgPath ="res/res_dtz/dtzSmallResult/guanJia1.png";
        if(guanStatu >= 1){
            if(changeScore > 0 ){
                imgPath = "res/res_dtz/dtzSmallResult/guanJia" + guanStatu + ".png";
                scorLable.setTextColor(cc.color(255 , 0 , 0));
            }else if(changeScore < 0){
                imgPath = "res/res_dtz/dtzSmallResult/guanJian" + guanStatu + ".png";
                scorLable.setTextColor(cc.color(35 , 180 , 69));
            }
        }else{
            if (!this.is4Ren()) {
                scorLable.y = 62;
            }
            fatherNode.visible = false;
        }
        if (this.is3Ren() || this.is2Ren()) {
            if(changeScore > 0 ){
                scorLable.setTextColor(cc.color(255 , 0 , 0));
            }else if(changeScore < 0){
                scorLable.setTextColor(cc.color(35 , 180 , 69));
            }
        }
        if (this.is4Ren()) {
            scorLable.setString((changeScore / 2) + "分");
        } else {
            scorLable.setString(changeScore + "分");
        }
        fatherNode.loadTexture(imgPath);
    },

    //显示分数详情
    showDetail:function(){
        //AteamData
        var aTeamData = this.aTeamData;
        var bTeamData = this.bTeamData;
        var cTeamData = this.cTeamData;
        var superBoomScoreValue = 400;
        if(DTZRoomModel.isWTZ() && !DTZRoomModel.is4Ren()){
            superBoomScoreValue = 500;
        }

        //a组数量详情
        this.getWidget("fiveNum" + 1).setString("x" + aTeamData.totalFive);
        this.getWidget("tenNum" + 1).setString("x" + aTeamData.totalTen);
        this.getWidget("KNum" + 1).setString("x" + aTeamData.totalK);
        this.getWidget("tongziNum" + 1).setString("x" + aTeamData.totalTongzi);
        this.getWidget("xiNum" + 1).setString("x" + aTeamData.totalXi);
        this.getWidget("superBoomNum" + 1).setString("x" + aTeamData.totalSuperBoom);
        //a组分数详情
        this.getWidget("fiveScore" + 1).setString((aTeamData.totalFive * 5) + "分");
        this.getWidget("tenScore" + 1).setString((aTeamData.totalTen * 10) + "分");
        this.getWidget("KScore" + 1).setString((aTeamData.totalK * 10) + "分");
        this.getWidget("tongziScore" + 1).setString(aTeamData.totalTongziScore + "分");
        this.getWidget("xiScore" + 1).setString((aTeamData.totalXiScore) + "分");
        this.getWidget("superBoomScore" + 1).setString((aTeamData.totalSuperBoom * superBoomScoreValue) + "分");

        //BteamData
        this.getWidget("fiveNum" + 2).setString("x" + bTeamData.totalFive);
        this.getWidget("tenNum" + 2).setString("x" + bTeamData.totalTen);
        this.getWidget("KNum" + 2).setString("x" + bTeamData.totalK);
        this.getWidget("tongziNum" + 2).setString("x" + bTeamData.totalTongzi);
        this.getWidget("xiNum" + 2).setString("x" + bTeamData.totalXi);
        this.getWidget("superBoomNum" + 2).setString("x" + bTeamData.totalSuperBoom);

        //b组分数详情
        this.getWidget("fiveScore" + 2).setString((bTeamData.totalFive * 5) + "分");
        this.getWidget("tenScore" + 2).setString((bTeamData.totalTen * 10) + "分");
        this.getWidget("KScore" + 2).setString((bTeamData.totalK * 10) + "分");
        this.getWidget("tongziScore" + 2).setString(bTeamData.totalTongziScore + "分");
        this.getWidget("xiScore" + 2).setString((bTeamData.totalXiScore) + "分");
        this.getWidget("superBoomScore" + 2).setString((bTeamData.totalSuperBoom * superBoomScoreValue) + "分");

        if (this.is3Ren()) {
            //CteamData
            this.getWidget("fiveNum" + 3).setString("x" + cTeamData.totalFive);
            this.getWidget("tenNum" + 3).setString("x" + cTeamData.totalTen);
            this.getWidget("KNum" + 3).setString("x" + cTeamData.totalK);
            this.getWidget("tongziNum" + 3).setString("x" + cTeamData.totalTongzi);
            this.getWidget("xiNum" + 3).setString("x" + cTeamData.totalXi);
            this.getWidget("superBoomNum" + 3).setString("x" + cTeamData.totalSuperBoom);

            //b组分数详情
            this.getWidget("fiveScore" + 3).setString((cTeamData.totalFive * 5) + "分");
            this.getWidget("tenScore" + 3).setString((cTeamData.totalTen * 10) + "分");
            this.getWidget("KScore" + 3).setString((cTeamData.totalK * 10) + "分");
            this.getWidget("tongziScore" + 3).setString(cTeamData.totalTongziScore + "分");
            this.getWidget("xiScore" + 3).setString((cTeamData.totalXiScore) + "分");
            this.getWidget("superBoomScore" + 3).setString((cTeamData.totalSuperBoom * superBoomScoreValue) + "分");
        }
    },

    //显示玩家名次
    showMingci:function(index , rank){
        index = index + 1;
        var imgPath = "res/res_dtz/dtzSmallResult/mingci" + rank + ".png";
        var rankSp = new cc.Sprite(res["mingci" + rank]);
        var tCurWidget = this.getWidget("rank" + index);
        tCurWidget.loadTexture(imgPath);
        rankSp.x = tCurWidget.width * 0.5;
        rankSp.y = tCurWidget.height * 0.5;

    },

    //新增显示玩家头像
    showIcon:function(iconUrl , index ,sex){
        // if (index == 1){
        //     iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        // }
        cc.log("显示第"+ index +"个玩家的头像" + " url:" + JSON.stringify(iconUrl));
        var url = iconUrl;
        var itemNode = this.getWidget("PlayerIcon" + index);
        var defaultimg = (sex == 1) ? "res/res_dtz/images/default_m.png" : "res/res_dtz/images/default_w.png";
        if(!url){
            url = defaultimg;
        }

        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.7;
        cc.log("iconUrl..." , iconUrl , JSON.stringify(iconUrl).length);

        if(iconUrl){
            cc.log("加载网络头像");
            sprite.x = sprite.y = 0;
            try{
                var sten = new cc.Sprite("res/res_dtz/images/img_14_c.png");
                sten.setScale(0.75);
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 48, y: 48, alphaThreshold: 0.8});
                clipnode.addChild(sprite);
                itemNode.addChild(clipnode,5,345);
                var self = this;

                cc.loader.loadImg(url, {width: 252, height: 252}, function (error, img) {
                    if (!error && (LayerManager.getCurrentLayer()==LayerFactory.DTZ_ROOM || LayerManager.getCurrentLayer()==LayerFactory.DTZ_3REN_ROOM)) {
                        sprite.setTexture(img);
                        sprite.x = 0;
                        sprite.y = 0;
                    }else{
                        cc.log("DTZSmallResult load error")
                        self._iconUrl = "";
                    }
                });
            }catch(e){}
        }else{
            cc.log("直接显示默认头像");
            sprite.x = sprite.y = 48;
            itemNode.addChild(sprite , 5 , 345);
        }
    },

    //暗牌八张
    showDarkCards:function(cardsData){
        cardsData.sort(this.sortCardlists);
        if (!this.is4Ren()) {
            var main2 = this.getWidget("main2");
            if (this.is2Ren()) {
                var mod = 48;
                for(var cardIndex = 0 ; cardIndex < cardsData.length ; cardIndex ++) {
                    var cardMsg = DTZAI.getCardDef(cardsData[cardIndex]);
                    var cardItem = new DTZBigCard(cardMsg);
                    cardItem.scale = 0.5;
                    cardItem.x = 300+(cardIndex%mod)*21;
                    cardItem.y = cardIndex<mod ? 321 : 225;
                    main2.addChild(cardItem);
                }
            } else {
                for(var cardIndex = 0 ; cardIndex < cardsData.length ; cardIndex ++) {
                    var cardMsg = DTZAI.getCardDef(cardsData[cardIndex]);
                    var cardItem = new DTZBigCard(cardMsg);
                    cardItem.scale = 0.5;
                    cardItem.x = 193+cardIndex*21;
                    cardItem.y = 90;
                    main2.addChild(cardItem);
                }
            }
            return;
        }
        var listViewNode = this.getWidget("ListView_DarkCard");
        if(!listViewNode){
            cc.log("未获取到ListView_DarkCard item");
            return;
        }
        var offX = 75;
        for(var cardIndex = 0 ; cardIndex < cardsData.length ; cardIndex ++){
            var cardMsg = DTZAI.getCardDef(cardsData[cardIndex]);
            var cardItem = new DTZBigCard(cardMsg);
            cardItem.cardId = cardIndex;
            cardItem.anchorX = 0.55;
            cardItem.anchorY = 0;

            cardItem.scale = 0.5;
            cardItem.width = offX;
            cardItem.height = cardItem.height * cardItem.scale + 120;
            cardItem.x = -300;
            listViewNode.pushBackCustomItem(cardItem);

        }
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

    showLeftHandCards:function(index , cardsData){
        var indexViewNode = this.getWidget("ListView_"+index);
        var length = cardsData.length;
        cardsData.sort(this.sortCardlists);
        var offX = 50;
        //如果只有十二张 不需要用拖动的方式显示 调整位置使其居中
        var offY = this.is4Ren() ? 90 : 52;

        var beginX = (250 - length * 20) * 0.5;
        for(var cardIndex = 0 ; cardIndex < cardsData.length ; cardIndex ++){
                //cc.log("测试显示玩家剩余手牌..." , cardIndex);
                var cardMsg = DTZAI.getCardDef(cardsData[cardIndex]);
                var cardItem = new DTZBigCard(cardMsg);
                cardItem.cardId = cardIndex;
                cardItem.anchorX = 0.5;
                cardItem.anchorY = 0;
                //cardItem.x = 0 + cardIndex * 10;
                cardItem.scale = 0.5;
                cardItem.width = offX;
                cardItem.height = cardItem.height * cardItem.scale + offY;
                indexViewNode.pushBackCustomItem(cardItem);
                if(length >= 13) {
                    this.getWidget("jiantoul" + index).visible = true;
                    this.getWidget("jiantouR" + index).visible = true;
                }
        }

    },

    onJieSan:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
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

    onOk:function(){
        cc.log("onOk!!!!");
        var data = this.data;
        //var aScore = 0;
        //var bScore = 0;
        //
        ////临时测试代码
        //aScore = ClosingInfoModel.ascore;
        //bScore = ClosingInfoModel.bscore;
        //
        ////附加当前的名次分再判断是否显示大结算
        //if (this.winTeam == 1){
        //    aScore += this.changeScore ;
        //    bScore -= this.changeScore ;
        //}else if (this.winTeam == 2) {
        //    aScore -= this.changeScore ;
        //    bScore += this.changeScore ;
        //}

        //cc.log("aScore .. bScore... DTZRoomModel.needScore..." , aScore , bScore , DTZRoomModel.endScore);

        //aScore >= DTZRoomModel.endScore || bScore >= DTZRoomModel.endScore || DTZRoomModel.endScore == null
        cc.log("ClosingInfoModel.ext[22] =",ClosingInfoModel.ext[22]);
        if(ClosingInfoModel.gotoBigResult >= 0 || ClosingInfoModel.ext[22] == 1){
            cc.log("come to show big result popView...");
            PopupManager.remove(this);
            var mc = new DTZBigResultPop(data);
            PopupManager.addPopup(mc);
            return;
        }

        this.issent = true;
        sySocket.sendComReqMsg(3);
        PopupManager.remove(this);


    },

    onClose:function(){
        this.unscheduleUpdate();
    }
});
