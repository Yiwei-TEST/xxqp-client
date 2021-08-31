/**
 * Created by zhoufan on 2016/6/30.
 */
var DTZBigResultPop = BasePopup.extend({
    user: null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        var json = "res/dtzBigResult.json";
        if (data.length <4) {
            if(DTZRoomModel.isWTZ()){
                json = "res/dtz3WTZRenBigResult.json";//王筒子二外做一个界面
            }else if(DTZRoomModel.isKlsx()){
                json = "res/dtz3RenBigResultSx.json";
            }else{
                json = "res/dtz3RenBigResult.json";
            }
        }else{
            if (DTZRoomModel.isKlsx()){
                json = "res/dtzBigResultSx.json";
            }
        }

        this._super(json);
    },

    is2Ren: function() {
        return (this.data.length==2);
    },

    is3Ren: function() {
        return (this.data.length==3);
    },

    is4Ren: function() {
        return (this.data.length==4);
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

    refreshTeamData: function (widget, user, teamId) {
        //cc.log("refreshTeamData...", JSON.stringify(user));
        var specielScore = 0; //三副牌是地炸分 四副牌是喜分
        var tAllTongziScore = 0; //记算筒子的总分
        this.user = user;
        var nameWidth = this.is4Ren() ? 75 : 135;
        var realName1 = this.getPalyerCanSeeName(user.name1, nameWidth, 20);
        ccui.helper.seekWidgetByName(widget, "name_1").setString(realName1);
        if (this.is4Ren()) {
            var realName2 = this.getPalyerCanSeeName(user.name2, nameWidth, 20);
            ccui.helper.seekWidgetByName(widget, "name_2").setString(realName2);
        }
        //ccui.helper.seekWidgetByName(widget,"uid").setString("UID:"+user.userId);

        var superBoomScore = 400;
        if(DTZRoomModel.isWTZ()){
            superBoomScore = 500;
        }

        //显示牌局 筒子详情
        if (DTZRoomModel.is3FuPai()) {
            tAllTongziScore += user.tzK * 100;
            tAllTongziScore += user.tzA * 200;
            tAllTongziScore += user.tz2 * 300;
            if(DTZRoomModel.isWTZ()){//如果开启了王筒子玩法
                tAllTongziScore += (user.tzsKing + user.tzbKing) * 400;
            }
            if (user.superBoom != null && user.superBoom > 0) {
                specielScore += user.superBoom * superBoomScore;
            }
        } else {
            specielScore += user.xi * 100;
            specielScore += user.xiKingS * 200;
            specielScore += user.xiKingB * 200;
            if (DTZRoomModel.isKlsx()){
                specielScore = 0;
                specielScore += user.tzKSx * 100;
                specielScore += user.tzASx * 200;
                specielScore += user.tz2Sx * 300;
                specielScore += user.q5 * 400;
                specielScore += user.xiK * 500;
                specielScore += user.xiA * 600;
                specielScore += user.xi2 * 700;
            }
        }

        //各种 总分
        ccui.helper.seekWidgetByName(widget, "tongziScore" + teamId).setString(specielScore + "分");
        ccui.helper.seekWidgetByName(widget, "cardScore" + teamId).setString(user.point - specielScore - tAllTongziScore + "分");
        if (this.is4Ren()) {
            ccui.helper.seekWidgetByName(widget, "totalScore" + teamId).setString(user.point + "分");
        } else {
            var point = user.point > 0 ? "+"+user.point : ""+user.point;
            var totalScoreLabel = ccui.helper.seekWidgetByName(widget, "totalScore" + teamId);
            if (user.point < 0) {
                totalScoreLabel.setFntFile("res/font/font_dtz_2.fnt");
            }
            totalScoreLabel.setString(point);
            var winlosePoint = user.winlosePoint > 0 ? "+"+user.winlosePoint : ""+user.winlosePoint;
            var winloseScoreLabel = ccui.helper.seekWidgetByName(widget, "winloseScore" + teamId);
            if (user.winlosePoint < 0) {
                winloseScoreLabel.setFntFile("res/font/font_dtz_2.fnt");
            }
            winloseScoreLabel.setString(winlosePoint);


            var level  =  Math.floor(user.winlosePoint/100);
            var levelStr = "";
            var updownLevelLable = ccui.helper.seekWidgetByName(widget, "updownLevel" + teamId);
            var isCredit = DTZRoomModel.isCreditRoom();
            if (isCredit) {
                var creditImgPath = "res/res_dtz/dtzBigResult/img_23.png";

                var creditImg = new cc.Sprite(creditImgPath);
                creditImg.setPosition(cc.p(-38, 18));
                updownLevelLable.addChild(creditImg);

                var credit = user.winLoseCredit;
                credit = MathUtil.toDecimal(credit / 100);
                updownLevelLable.setString(credit);

                updownLevelLable.y = updownLevelLable.y + 8;
                winloseScoreLabel.y = winloseScoreLabel.y + 18;
            }else if(DTZRoomModel.isClubGoldRoom()){

                var creditImgPath = "res/res_gold/goldPyqHall/img_13.png";

                var creditImg = new cc.Sprite(creditImgPath);
                creditImg.setScale(0.7);
                creditImg.setPosition(cc.p(-38, 18));
                updownLevelLable.addChild(creditImg)

                var credit = user.winLoseCredit;
                updownLevelLable.setString(credit);

                updownLevelLable.y = updownLevelLable.y + 8;
                winloseScoreLabel.y = winloseScoreLabel.y + 18;

            }else{
                if (level > 0){
                    levelStr = "（正"+level+"级）";
                }else if (level < 0){
                    levelStr = "（负"+Math.abs(level)+"级）";
                }
                updownLevelLable.setString(levelStr);
            }
        }
        user.paimian = user.point - specielScore - tAllTongziScore;

        //轮次
        this.getWidget("roundNum" + teamId).setString(ClosingInfoModel.round + "局");

        /*
         var superBoom = user.totalSuperBoom;
         cc.log("superBoom" + user.totalSuperBoom);
         if(superBoom != null){
         tongziScore += superBoom * 400
         }
         */

        //筒子 或者 喜 详情
        if (DTZRoomModel.is3FuPai()) {
            ccui.helper.seekWidgetByName(widget, "KTongziNum" + teamId).setString((user.tzK) + "");
            ccui.helper.seekWidgetByName(widget, "ATongziNum" + teamId).setString((user.tzA) + "");
            ccui.helper.seekWidgetByName(widget, "2TongziNum" + teamId).setString((user.tz2) + "");
            if(DTZRoomModel.isWTZ()){
                ccui.helper.seekWidgetByName(widget, "WTongziNum" + teamId).setString((user.tzsKing + user.tzbKing) + "");
            }

            ccui.helper.seekWidgetByName(widget, "KScore" + teamId).setString((user.tzK * 100) + "分");
            ccui.helper.seekWidgetByName(widget, "AScore" + teamId).setString((user.tzA * 200) + "分");
            ccui.helper.seekWidgetByName(widget, "2Score" + teamId).setString((user.tz2 * 300) + "分");
            if(DTZRoomModel.isWTZ()){
                ccui.helper.seekWidgetByName(widget, "WScore" + teamId).setString(((user.tzsKing + user.tzbKing) * 400) + "分");
            }

        } else {
            ccui.helper.seekWidgetByName(widget, "KTongziNum" + teamId).setString((user.xi) + "");
            ccui.helper.seekWidgetByName(widget, "ATongziNum" + teamId).setString((user.xiKingS) + "");
            ccui.helper.seekWidgetByName(widget, "2TongziNum" + teamId).setString((user.xiKingB) + "");

            ccui.helper.seekWidgetByName(widget, "KScore" + teamId).setString((user.xi * 100) + "分");
            ccui.helper.seekWidgetByName(widget, "AScore" + teamId).setString((user.xiKingS * 200) + "分");
            ccui.helper.seekWidgetByName(widget, "2Score" + teamId).setString((user.xiKingB * 200) + "分");

            if (DTZRoomModel.isKlsx()){
                var sxPanel = ccui.helper.seekWidgetByName(widget, "Panel_txScore" + teamId);
                if (sxPanel){
                    sxPanel.visible = true;
                    ccui.helper.seekWidgetByName(sxPanel, "KtzNum" + teamId).setString("K筒"+100 + "x" + user.tzKSx);
                    ccui.helper.seekWidgetByName(sxPanel, "AtzNum" + teamId).setString("A筒"+200 + "x" + user.tzASx);
                    ccui.helper.seekWidgetByName(sxPanel, "2tzNum" + teamId).setString("2筒"+300 + "x" + user.tz2Sx);

                    ccui.helper.seekWidgetByName(sxPanel, "KXiNum" + teamId).setString("K喜"+500 + "x" + user.xiK);
                    ccui.helper.seekWidgetByName(sxPanel, "AXiNum" + teamId).setString("A喜"+600 + "x" + user.xiA);
                    ccui.helper.seekWidgetByName(sxPanel, "2XiNum" + teamId).setString("2喜"+700 + "x" + user.xi2);

                    ccui.helper.seekWidgetByName(sxPanel, "5QXiNum" + teamId).setString((user.q5) + "");
                    ccui.helper.seekWidgetByName(sxPanel, "5QXiSore" + teamId).setString(400 + "分");
                }

            }
        }

        //显示分数
        if (this.is4Ren()) {
            var pointMax = ccui.helper.seekWidgetByName(widget, "teamScore");
            var font = user.point >= 0 ? "res/font/dn_bigResult_font_1.fnt" : "res/font/greeNum_0.fnt";
            var label = new cc.LabelBMFont(user.point + "", font);
            label.x = pointMax.width / 2;
            label.y = pointMax.height / 2 + 11;
            label.scale = 1.05;
            pointMax.addChild(label);


            //打了几轮
            var roundNum = ccui.helper.seekWidgetByName(widget, "roundNum" + teamId);
            label = new cc.LabelBMFont(ClosingInfoModel.round + "", "res/font/font_res_huang.fnt");
            label.scale = 1.5;
            label.x = roundNum.width / 2;
            label.y = roundNum.height / 2 + 18;
        }
        //roundNum.addChild(label);
    },

    loadExtData: function (userData) {
        cc.log("userData.ext..." , userData.ext);
        var index = 0;
        userData.totalFive = parseInt(userData.ext[index]);
        userData.totalTen = parseInt(userData.ext[++index]);
        userData.totalK = parseInt(userData.ext[++index]);
        userData.totalTongzi = parseInt(userData.ext[++index]);
        userData.totalXi = parseInt(userData.ext[++index]);
        userData.totalxiJacks = parseInt(userData.ext[++index]);
        userData.totalxiJackb = parseInt(userData.ext[++index]);
        userData.totalSuperBoom = parseInt(userData.ext[++index]);
        userData.isGuan = parseInt(userData.ext[++index]);
        userData.tzA = parseInt(userData.ext[++index]);
        userData.tzK = parseInt(userData.ext[++index]);
        userData.tz2 = parseInt(userData.ext[++index]);
        userData.group = parseInt(userData.ext[++index]);
        userData.mingci = parseInt(userData.ext[++index]);
        ++index;//这位暂时没用到
        ++index;//这位暂时没用到
        userData.tzsKing = parseInt(userData.ext[++index]);
        userData.tzbKing = parseInt(userData.ext[++index]);


    },

    selfRender: function () {

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        cc.log("bigResult selfRender...");

        for (var i = 0; i < this.data.length; i++) {
            this.loadExtData(this.data[i])
        }
        if (this.is2Ren()) {
            this.getWidget("CteamBg").visible = false;
        }
        //按照队伍排序
        this.data.sort(function (user1, user2) {
            return user1.group > user2.group;
        });

        //四人比赛分
        var creditScore = 0;

        if (this.data.match) {
            cc.log("send 15 comder...");
            sySocket.sendComReqMsg(15, [], "");
        } else {

            var btn_start_another = this.getWidget("btn_start_another");
            UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);

            //this.getWidget("ext1").setString("房号 " + ClosingInfoModel.ext[0]);
            //this.getWidget("ext2").setString(csvhelper.strFormat("跑得快 {0}张", ClosingInfoModel.ext[3]));
            //this.getWidget("ext3").setString(ClosingInfoModel.ext[2]);
            if (DTZRoomModel.roomName){
                this.getWidget("Label_roomname").setString(DTZRoomModel.roomName);
            }else{
                this.getWidget("Label_roomname").visible = false;
                btn_start_another.setVisible(false);
            }

            this.titleImgBg = this.getWidget("titleBg");
            if (this.titleImgBg == null) {
                cc.log("未获取到大结算标题背景图node...");
            }
            if (DTZRoomModel.is4Ren()) {
                if (DTZRoomModel.wanfa == DTZRoomModel.wanfa4) {
                    //修改大结算界面分数标题背景图...
                    this.titleImgBg.loadTexture("res/res_dtz/dtzBigResult/newTitle.png");
                }
                if (DTZRoomModel.isKlsx()){
                    this.titleImgBg.loadTexture("res/res_dtz/dtzBigResult/title_2.png");
                }
            } else {
                if (DTZRoomModel.is4FuPai()) {
                    this.titleImgBg.loadTexture("res/res_dtz/dtz3RenBigResult/dtz3RenBigResult_3.png");
                    if (DTZRoomModel.isKlsx()){
                        this.titleImgBg.loadTexture("res/res_dtz/dtzBigResult/title_1.png");
                    }
                }
            }

            var max = 0;
            for (var i = 0; i < this.data.length; i++) {
                var d = this.data[i];
                if (d.totalPoint >= max)
                    max = d.totalPoint;
            }

            var aTeamData = {paimian: 0, tzK: 0, tzA: 0, tz2: 0, tzsKing:0, tzbKing:0, point: 0, xi: 0,
                xiKingS: 0, xiKingB: 0, superBoom: 0, tzKSx: 0, tzASx: 0, tz2Sx: 0, xiK: 0, xiA: 0, xi2: 0, q5: 0};
            var bTeamData = {paimian: 0, tzK: 0, tzA: 0, tz2: 0, tzsKing:0, tzbKing:0, point: 0, xi: 0,
                xiKingS: 0, xiKingB: 0, superBoom: 0, tzKSx: 0, tzASx: 0, tz2Sx: 0, xiK: 0, xiA: 0, xi2: 0, q5: 0};
            var cTeamData = {paimian: 0, tzK: 0, tzA: 0, tz2: 0, tzsKing:0, tzbKing:0, point: 0, xi: 0,
                xiKingS: 0, xiKingB: 0, superBoom: 0, tzKSx: 0, tzASx: 0, tz2Sx: 0, xiK: 0, xiA: 0, xi2: 0, q5: 0};
            var aScore = 0;
            var bScore = 0;
            var cScore = 0;
            var offTeamScore = 0;

            //记录各组分数详情
            for (var i = 0; i < this.data.length; i++) {

                //cc.log("玩家信息...", JSON.stringify(this.data[i]));
                var teamId = this.data[i].group;
                cc.log("teamId....", this.data[i].group);

                if (teamId == 1) {
                    cc.log("记录A组的结算信息");
                    if (aTeamData.name1 == null) {
                        aTeamData.name1 = this.data[i].name;
                    } else {
                        aTeamData.name2 = this.data[i].name;
                    }
                    aTeamData.tzK += this.data[i].tzK;
                    aTeamData.tzA += this.data[i].tzA;
                    aTeamData.tz2 += this.data[i].tz2;
                    aTeamData.tzsKing += this.data[i].tzsKing;
                    aTeamData.tzbKing += this.data[i].tzbKing;
                    aTeamData.xi += this.data[i].totalXi;
                    aTeamData.xiKingS += this.data[i].totalxiJacks;
                    aTeamData.xiKingB += this.data[i].totalxiJackb;
                    aTeamData.point += this.data[i].totalPoint;
                    aTeamData.superBoom += this.data[i].totalSuperBoom;
                    aTeamData.winlosePoint = this.data[i].boom;
                    aScore += this.data[i].totalPoint;
                    aTeamData.credit = this.data[i].ext[27];
                    aTeamData.winLoseCredit = this.data[i].winLoseCredit;
                    aTeamData.tzKSx += parseInt(this.data[i].ext[10]) || 0;
                    aTeamData.tzASx += parseInt(this.data[i].ext[9]) || 0;
                    aTeamData.tz2Sx += parseInt(this.data[i].ext[11]) || 0;
                    aTeamData.xiK += parseInt(this.data[i].ext[23]) || 0;
                    aTeamData.xiA += parseInt(this.data[i].ext[24]) || 0;
                    aTeamData.xi2 += parseInt(this.data[i].ext[25]) || 0;
                    aTeamData.q5 += parseInt(this.data[i].ext[26]) || 0;
                } else if (teamId == 3) {
                    if (cTeamData.name1 == null) {
                        cTeamData.name1 = this.data[i].name;
                    } else {
                        cTeamData.name2 = this.data[i].name;
                    }
                    cTeamData.tzK += this.data[i].tzK;
                    cTeamData.tzA += this.data[i].tzA;
                    cTeamData.tz2 += this.data[i].tz2;
                    cTeamData.tzsKing += this.data[i].tzsKing;
                    cTeamData.tzbKing += this.data[i].tzbKing;
                    cTeamData.xi += this.data[i].totalXi;
                    cTeamData.xiKingS += this.data[i].totalxiJacks;
                    cTeamData.xiKingB += this.data[i].totalxiJackb;
                    cTeamData.point += this.data[i].totalPoint;
                    cTeamData.superBoom += this.data[i].totalSuperBoom;
                    cTeamData.winlosePoint = this.data[i].boom;
                    cScore += this.data[i].totalPoint;
                    cTeamData.credit = this.data[i].ext[27];
                    cTeamData.winLoseCredit = this.data[i].winLoseCredit;
                    cTeamData.tzKSx += parseInt(this.data[i].ext[10]) || 0;
                    cTeamData.tzASx += parseInt(this.data[i].ext[9]) || 0;
                    cTeamData.tz2Sx += parseInt(this.data[i].ext[11]) || 0;
                    cTeamData.xiK += parseInt(this.data[i].ext[23]) || 0;
                    cTeamData.xiA += parseInt(this.data[i].ext[24]) || 0;
                    cTeamData.xi2 += parseInt(this.data[i].ext[25]) || 0;
                    cTeamData.q5 += parseInt(this.data[i].ext[26]) || 0;
                } else {
                    cc.log("记录B组的结算信息");
                    if (bTeamData.name1 == null) {
                        bTeamData.name1 = this.data[i].name;
                    } else {
                        bTeamData.name2 = this.data[i].name;
                    }
                    bTeamData.tzK += this.data[i].tzK;
                    bTeamData.tzA += this.data[i].tzA;
                    bTeamData.tz2 += this.data[i].tz2;
                    bTeamData.tzsKing += this.data[i].tzsKing;
                    bTeamData.tzbKing += this.data[i].tzbKing;
                    bTeamData.xi += this.data[i].totalXi;
                    bTeamData.xiKingS += this.data[i].totalxiJacks;
                    bTeamData.xiKingB += this.data[i].totalxiJackb;
                    bTeamData.point += this.data[i].totalPoint;
                    bTeamData.superBoom += this.data[i].totalSuperBoom;
                    bTeamData.winlosePoint = this.data[i].boom;
                    bScore += this.data[i].totalPoint;
                    bTeamData.credit = this.data[i].ext[27];
                    bTeamData.winLoseCredit = this.data[i].winLoseCredit;
                    bTeamData.tzKSx += parseInt(this.data[i].ext[10]) || 0;
                    bTeamData.tzASx += parseInt(this.data[i].ext[9]) || 0;
                    bTeamData.tz2Sx += parseInt(this.data[i].ext[11]) || 0;
                    bTeamData.xiK += parseInt(this.data[i].ext[23]) || 0;
                    bTeamData.xiA += parseInt(this.data[i].ext[24]) || 0;
                    bTeamData.xi2 += parseInt(this.data[i].ext[25]) || 0;
                    bTeamData.q5 += parseInt(this.data[i].ext[26]) || 0;
                }

                //显示头像
                //var icon = ccui.helper.seekWidgetByName(widget,"icon");
                var user = this.data[i];
                // if (i==0){
                //     user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
                // }
                var icon = this.getWidget("playerIcon" + (i + 1));
                var defaultimg = (user.sex == 1) ? "res/res_dtz/images/default_m.png" : "res/res_dtz/images/default_w.png";
                if (icon.getChildByTag(345))
                    icon.removeChildByTag(345);
                var sprite = new cc.Sprite(defaultimg);
                sprite.x = 60;
                sprite.y = 60;
                sprite.setScale(0.7);
                icon.addChild(sprite, 5, 345);
                if (user.icon) {
                    cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
                        if (!error) {
                            sprite.setTexture(img);
                            sprite.scale = 0.8;
                        }
                    });
                }
                if (user.userId == PlayerModel.userId){
                    //creditScore = user.ext[27];
                    creditScore= user.winLoseCredit;
                    // creditScore = user.winLoseCredit;
                }
            }

            this.refreshTeamData(this.getWidget("AteamBg"), aTeamData, 1);
            this.refreshTeamData(this.getWidget("BteamBg"), bTeamData, 2);
            if (this.is3Ren()) {
                this.refreshTeamData(this.getWidget("CteamBg"), cTeamData, 3);
            }
            //改为使用牌面分判断输赢
            cc.log("aTeamData.paimian , bTeamData.paimian", aTeamData.paimian, bTeamData.paimian + "获得奖励分的组为：" + ClosingInfoModel.gotoBigResult);
/*          var winTeam = 0;
            var addExScoreTeam = ClosingInfoModel.gotoBigResult;
            if(aTeamData.paimian != bTeamData.paimian){
                winTeam = aTeamData.paimian > bTeamData.paimian ? 1 : 2;
            }else{//牌面分数相同的极端情况 胜负根据总分的大小判断 如果总分也他喵的相同，那就A组胜B组负 两组都不加附加分
                winTeam = aTeamData.point >= bTeamData.point ? 1 : 2;
            }*/

            //改为使用总分判断胜负
            var winTeam = 0;
            var addExScoreTeam = ClosingInfoModel.gotoBigResult;
            if(aTeamData.point != bTeamData.point){
                winTeam = aTeamData.point >= bTeamData.point ? 1 : 2;
            }else{//牌面分数相同的极端情况 胜负根据总分的大小判断 如果总分也他喵的相同，那就A组胜B组负 两组都不加附加分
                winTeam = aTeamData.paimian > bTeamData.paimian ? 1 : 2;
            }

            //计算附加分应该加载哪一组上
            var teamNode = null;
            var exScoreNode = null;
            var totalScoreNode = null;
            var teamNode1 = null;
            var exScoreNode1 = null;
            var totalScoreNode1 = null;
            var exScore = DTZRoomModel.exScore;
            if (DTZRoomModel.is4Ren()) {
                if (addExScoreTeam == 1 && DTZRoomModel.exScore != 0) {
                    teamNode = this.getWidget("AteamBg");
                    exScoreNode = ccui.helper.seekWidgetByName(teamNode, "exRoomScore");
                    totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "teamScore");
                    aScore += DTZRoomModel.exScore;

                } else if (addExScoreTeam == 2 && DTZRoomModel.exScore != 0) {
                    teamNode = this.getWidget("BteamBg");
                    exScoreNode = ccui.helper.seekWidgetByName(teamNode, "exRoomScore");
                    totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "teamScore");
                    bScore += DTZRoomModel.exScore;
                }
            } else {
                cc.log("addExScoreTeam::"+addExScoreTeam);
                switch (parseInt(addExScoreTeam)) {
                    case 1:
                        teamNode = this.getWidget("AteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore1");
                        break;
                    case 2:
                        teamNode = this.getWidget("BteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore2");
                        break;
                    case 3:
                        teamNode = this.getWidget("CteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore3");
                        break;
                    case 12:
                        teamNode = this.getWidget("AteamBg");
                        teamNode1 = this.getWidget("BteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore1");
                        totalScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "totalScore2");
                        exScore = exScore/2;
                        if(DTZRoomModel.is2Ren()){
                            exScore = 0;
                        }
                        break;
                    case 13:
                        teamNode = this.getWidget("AteamBg");
                        teamNode1 = this.getWidget("CteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore1");
                        totalScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "totalScore3");
                        exScore = exScore/2;
                        if(DTZRoomModel.is2Ren()){
                            exScore = 0;
                        }
                        break;
                    case 23:
                        teamNode = this.getWidget("BteamBg");
                        teamNode1 = this.getWidget("CteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore2");
                        totalScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "totalScore3");
                        exScore = exScore/2;
                        if(DTZRoomModel.is2Ren()){
                            exScore = 0;
                        }
                        break;
                    case 123:
                        exScoreNode = totalScoreNode =null;
                        break;
                }
                if (teamNode) {
                    exScoreNode = ccui.helper.seekWidgetByName(teamNode, "exRoomScore");
                }
                if (teamNode1) {
                    exScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "exRoomScore");
                }
            }
            if(exScoreNode != null && totalScoreNode != null && exScore > 0){
                cc.log("显示附加分数...1");
                var label = new cc.LabelBMFont("+" + exScore, "res/font/dn_bigResult_font_1.fnt");
                label.scale = 0.5;
                label.x = exScoreNode.width / 2;
                label.y = exScoreNode.height / 2;
                exScoreNode.addChild(label);
                if(!DTZRoomModel.is4Ren()) {
                    totalScoreNode.y += 12;
                }
                totalScoreNode.y += 0;
            }

            if(exScoreNode1 != null && totalScoreNode1 != null  && exScore > 0){
                cc.log("显示附加分数...2");
                var label = new cc.LabelBMFont("+" + exScore, "res/font/dn_bigResult_font_1.fnt");
                label.scale = 0.5;
                label.x = exScoreNode1.width / 2;
                label.y = exScoreNode1.height / 2;
                exScoreNode1.addChild(label);
                if(!DTZRoomModel.is4Ren()) {
                    totalScoreNode1.y += 12;
                }
                totalScoreNode1.y += 0;
            }



            if (this.is4Ren()) {
                //加入四舍五入
                var tNewAscore = UITools.dealScore(aScore);
                var tNewBscore = UITools.dealScore(bScore);
                offTeamScore = Math.abs(tNewAscore - tNewBscore);
                var tDesc = (aScore >= bScore) ? "A组赢总分:" : "B组赢总分:";
                this.getWidget("LabelDescWin").setString(tDesc);
            }else{
                offTeamScore = Math.abs(aScore - bScore);
            }

            this.getWidget("winScore").setString("赢：" + offTeamScore + "分");

            //if (winTeam == 1) {
            //    //修改AB组的显示图标
            //    this.getWidget("AteamTitle").loadTexture("res/res_dtz/dtzSmallResult/a.png");
            //    this.getWidget("BteamTitle").loadTexture("res/res_dtz/dtzBigResult/Bloss.png");
            //    this.getWidget("AteamState").loadTexture("res/res_dtz/dtzSmallResult/win.png");
            //    this.getWidget("BTeamState").loadTexture("res/res_dtz/dtzSmallResult/loss.png");
            //} else if (winTeam == 2) {
            //    //修改AB组的显示图标
            //    this.getWidget("AteamTitle").loadTexture("res/res_dtz/dtzBigResult/Aloss.png");
            //    this.getWidget("BteamTitle").loadTexture("res/res_dtz/dtzSmallResult/b.png");
            //    this.getWidget("AteamState").loadTexture("res/res_dtz/dtzSmallResult/loss.png");
            //    this.getWidget("BTeamState").loadTexture("res/res_dtz/dtzSmallResult/win.png");
            //}
            var aTeamNode = this.getWidget("AteamTitle");
            var bTeamNode = this.getWidget("BteamTitle");
            if(aTeamNode){
                aTeamNode.loadTexture("res/res_dtz/dtzSmallResult/a.png");
                aTeamNode.y = aTeamNode.y - aTeamNode.height * 0.5;
            }
            if(bTeamNode){
                bTeamNode.loadTexture("res/res_dtz/dtzSmallResult/b.png");
                bTeamNode.y = bTeamNode.y - bTeamNode.height * 0.5
            }
            if (this.is4Ren()) {
                this.getWidget("AteamState").visible = false;
                this.getWidget("BTeamState").visible = false;
                //修正AB分组标签的位置
                this.getWidget("aTeamIcon1").x += 60;
                this.getWidget("aTeamIcon1").y += 60;
                this.getWidget("aTeamIcon2").x += 60;
                this.getWidget("aTeamIcon2").y += 60;
                this.getWidget("bTeamIcon1").x += 60;
                this.getWidget("bTeamIcon1").y += 60;
                this.getWidget("bTeamIcon2").x += 60;
                this.getWidget("bTeamIcon2").y += 60;
                var fnt = "res/font/font_res_huang.fnt";
                var tNode = this.getWidget("lableWinScore");
                var label = new cc.LabelBMFont("+" + offTeamScore, "res/font/font_res_huang.fnt");
                label.scale = 1.2;
                label.x = tNode.width / 2;
                label.y = tNode.height / 2;
                tNode.addChild(label);

                var updownLevelLable = this.getWidget("updownLevel");
                var level  =  Math.floor(offTeamScore/100);
                var levelStr = "";

                var isCredit = DTZRoomModel.isCreditRoom();
                if (isCredit) {
                    var creditImgPath = "res/res_dtz/dtzBigResult/img_23.png";
                    var creditImg = new cc.Sprite(creditImgPath);
                    creditImg.setPosition(cc.p(-30, 15));
                    updownLevelLable.addChild(creditImg);
                    var credit = creditScore;
                    credit = MathUtil.toDecimal(credit / 100);
                    updownLevelLable.setString(credit);
                }else if(DTZRoomModel.isClubGoldRoom()){

                    var creditImgPath = "res/res_gold/goldPyqHall/img_13.png";

                    var creditImg = new cc.Sprite(creditImgPath);
                    creditImg.setScale(0.7);
                    creditImg.setPosition(cc.p(-30, 15));
                    updownLevelLable.addChild(creditImg);

                    var credit = creditScore;
                    credit = MathUtil.toDecimal(credit / 100);
                    updownLevelLable.setString(credit);
                }else{
                    if (level > 0){
                        levelStr = "（正"+level+"级）";
                    }else if (level < 0){
                        levelStr = "（负"+Math.abs(level)+"级）";
                    }
                    updownLevelLable.setString(levelStr);
                }
            }
            //a组赢
            //b组输

            var Button_20 = this.getWidget("Button_20");
            if (Button_20) {
                UITools.addClickEvent(Button_20, this, this.onShare);
            }
            var Button_21 = this.getWidget("Button_21");
            UITools.addClickEvent(Button_21, this, this.onToHome);
            var Buton_Out = this.getWidget("close_btn");
            UITools.addClickEvent(Buton_Out, this, this.onToHome);

            //显示房间信息
            var tableIdDesc = "";
            var wanfaDesc = "";
            var zhifuDesc = "";
            var timeDesc = "";
            var endScoreDesc = "";
            var exScoreDesc = "";
            if (this.isDaiKai){

                var createPara = dkResultModel.data.createPara.split(",");
                cc.log("createPara(((((",createPara);
                if (createPara[1] == 113 || createPara[1] == 115 || createPara[1] == 117){
                    wanfaDesc = "三副牌 ";
                }else if (createPara[1] == 114 || createPara[1] == 116 || createPara[1] == 118){
                    wanfaDesc = "四副牌 ";
                }
                endScoreDesc = createPara[3] + "分";
                exScoreDesc = createPara[4] + "分";
                tableIdDesc = dkResultModel.data.tableId;
                timeDesc = dkResultModel.data.time;
                zhifuDesc = "AA支付";
                if (createPara[2] == 2){
                    zhifuDesc = "房主支付";
                }else if (createPara[2] == 3) {
                    zhifuDesc = "群主支付";
                }
            }else{
                tableIdDesc = DTZRoomModel.tableId;
                wanfaDesc = DTZRoomModel.is3FuPai() ? "三副牌" : "四副牌";
                if (DTZRoomModel.isKlsx()){
                    wanfaDesc = "快乐四喜";
                }
                zhifuDesc = "房主支付";
                if (DTZRoomModel.getCostFangShi() == 1){
                    zhifuDesc = "AA支付";
                }else if (DTZRoomModel.getCostFangShi() == 3) {
                    zhifuDesc = "群主支付";
                }
                //zhifuDesc = DTZRoomModel.costFangFei <= 20 ? "AA支付" : "房主支付";
                //if (this.is2Ren()) {
                //    zhifuDesc = DTZRoomModel.costFangFei <= 30 ? "AA支付":"房主支付";
                //}
                timeDesc = ClosingInfoModel.ext[2];
                endScoreDesc = DTZRoomModel.endScore + "分";
                exScoreDesc = DTZRoomModel.exScore + "分";
            }
            this.getWidget("Label_RoomId").setString(tableIdDesc);
            this.getWidget("Label_wanfa").setString(wanfaDesc);
            this.getWidget("Label_endScore").setString(endScoreDesc);
            this.getWidget("Label_EndAddScore").setString(exScoreDesc);
            this.getWidget("Label_pay").setString(zhifuDesc);
            this.getWidget("Label_time").setString(timeDesc);
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
            //显示俱乐部ID
            var clubIdLabel = this.getWidget("Label_clubId");
            clubIdLabel.setString("");
            var clubId = ClosingInfoModel.ext[12] || 0;
            if(DTZRoomModel.is3Ren()){
                clubId = ClosingInfoModel.ext[13] || 0;
            }
            if (clubId){
                clubIdLabel.setString("亲友圈ID:"+clubId);
            }

            this.dealCreDitData();
            
        }

        this.dealKlsxUI();
        var Button_fxCard = this.getWidget("Button_fxCard");
        Button_fxCard.visible = false;
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        if( DTZRoomModel.tableType == 1&&ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = true;
            Button_fxCard.scaleX= 0.9;
            Button_21.scaleX= 0.9;
            Button_20.scaleX= 0.9;
        }else{
            //Button_21.x= -77+640;
            //Button_20.x= 380+640;
        }
    },
    onShareCard:function() {
        this.shareCard(DTZRoomModel, this.data, ClosingInfoModel.groupLogId);
    },

    dealKlsxUI: function () {
        var isKlsx = DTZRoomModel.isKlsx();
        var hideParms = [];
        if (isKlsx){
            if(DTZRoomModel.is4Ren()){
                for (var i = 1; i <= 2; i++) {
                    hideParms.push(this.getWidget("KScore"+i));
                    hideParms.push(this.getWidget("AScore"+i));
                    hideParms.push(this.getWidget("2Score"+i));
                    hideParms.push(this.getWidget("KTongziNum"+i));
                    hideParms.push(this.getWidget("ATongziNum"+i));
                    hideParms.push(this.getWidget("2TongziNum"+i));
                }
            }else{
                for (var i = 1; i <= 3; i++) {
                    hideParms.push(this.getWidget("KScore"+i));
                    hideParms.push(this.getWidget("AScore"+i));
                    hideParms.push(this.getWidget("2Score"+i));
                    hideParms.push(this.getWidget("KTongziNum"+i));
                    hideParms.push(this.getWidget("ATongziNum"+i));
                    hideParms.push(this.getWidget("2TongziNum"+i));
                    if(DTZRoomModel.isWTZ()){
                        hideParms.push(this.getWidget("WTongziNum"+i));
                    }
                }
            }

        }

        for (var i = 0 ; i < hideParms.length ; i++) {
            var obj = hideParms[i];
            if (obj){
                obj.visible = false;
            }
        }

    },

    dealCreDitData: function () {
        var isCredit = DTZRoomModel.isCreditRoom();
        if (isCredit){
            var imgPath = "res/res_dtz/dtzBigResult/img_22.png";

            this.Image_jlbRoom.visible = true;
            this.Image_jlbRoom.loadTexture(imgPath);


            this.getWidget("LabelEndReward").x = this.getWidget("LabelEndReward").x - 225;
            this.getWidget("Label_EndAddScore").x = this.getWidget("Label_EndAddScore").x - 225;

            //底分
            var score = DTZRoomModel.getCreditScore();
            var scoreLabel = new cc.LabelTTF("底分:"+score,"Arial",33);
            scoreLabel.setColor(cc.color(128,51,6));
            scoreLabel.setPosition(cc.p(1050,270));
            this.addChild(scoreLabel,10);

            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = DTZRoomModel.getCreditType();
            var giveWay = DTZRoomModel.getCreditWay();
            var giveNum = DTZRoomModel.getCreditGiveNum();
            if (giveType == 1){
                if(!DTZRoomModel.getCreditPayWay()){
                    giveStr = giveStr + "固定赠送,";
                }
            }else{
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1){
                if(DTZRoomModel.getCreditPayWay()){
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
            var giveLabel = new cc.LabelTTF(giveStr,"Arial",33);
            giveLabel.setColor(cc.color(128,51,6));
            giveLabel.setPosition(cc.p(1050,314));
            this.addChild(giveLabel,10);
        }else if(DTZRoomModel.isClubGoldRoom()){
            var imgPath = "res/res_dtz/dtzBigResult/img_22.png";

            this.Image_jlbRoom.visible = true;
            this.Image_jlbRoom.loadTexture(imgPath);


            this.getWidget("LabelEndReward").x = this.getWidget("LabelEndReward").x - 225;
            this.getWidget("Label_EndAddScore").x = this.getWidget("Label_EndAddScore").x - 225;

            var giveLabel = new cc.LabelTTF(DTZRoomModel.getClubGlodCfg(),"Arial",33);
            giveLabel.setColor(cc.color(128,51,6));
            giveLabel.setPosition(cc.p(1050,314));
            this.addChild(giveLabel,10);
        }
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
        obj.tableId = DTZRoomModel.tableId;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?userName=' + encodeURIComponent(PlayerModel.name);
        obj.title = "打筒子   房号:" + DTZRoomModel.tableId;
        obj.description = "我已在快乐打筒子开好房间,纯技术实力的对决,一起打筒子！";
        obj.shareType = 0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function () {
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        }, 500);
    },

    onToHome: function () {
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        PopupManager.removeAll();

        var isClubRoom =  (DTZRoomModel.tableType ==1);
        if(isClubRoom ){
            PopupManager.removeClassByPopup(PyqHall);
            var mc = new PyqHall();//先不弹出吧
            PopupManager.addPopup(mc);
        }

    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = DTZRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[12];

        if(DTZRoomModel.is3Ren()){
            groupId = ClosingInfoModel.ext[13];
        }

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
