/**
 * Created by mayn on 2019/5/8.
 */
var CreditScoreUserItem = ccui.Widget.extend({
    ctor:function(){
        this._super();
        this.setContentSize(1580, 156);

        var itemBg = UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        itemBg.setScale9Enabled(true);
        itemBg.setContentSize(this.getContentSize());
        itemBg.setPosition(this.width/2,this.height/2);
        this.addChild(itemBg);

        this.imgHead = UICtor.cImg("res/ui/common/default_m.png");
        this.imgHead.setPosition(90,itemBg.height/2);
        itemBg.addChild(this.imgHead);

        this.nameLabel= UICtor.cLabel("玩家的名字长一点看看",40,cc.size(300,45),cc.color("#6f1816"),0,0);
        this.nameLabel.setAnchorPoint(0,0.5);
        this.nameLabel.setPosition(this.imgHead.x + 70,itemBg.height/2 + 27);
        itemBg.addChild(this.nameLabel);

        this.idLabel= UICtor.cLabel("12345678",40,cc.size(0,0),cc.color(186,61,51),0,0);
        this.idLabel.setAnchorPoint(0,0.5);
        this.idLabel.setPosition(this.nameLabel.x,itemBg.height/2 - 27);
        itemBg.addChild(this.idLabel);

        this.scoreLabel= UICtor.cLabel("12345678",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.scoreLabel.setPosition(itemBg.width/2 - 170,itemBg.height/2);
        itemBg.addChild(this.scoreLabel);

        this.upPlayerNameLabel = UICtor.cLabel("----",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.upPlayerNameLabel.setPosition(itemBg.width/2 + 200,itemBg.height/2+27);
        itemBg.addChild(this.upPlayerNameLabel);

        this.upPlayerIdLabel = UICtor.cLabel("----",40,cc.size(0,0),cc.color(186,61,51),0,0);
        this.upPlayerIdLabel.setPosition(itemBg.width/2 + 200,itemBg.height/2-27);
        itemBg.addChild(this.upPlayerIdLabel);

        this.detailBtn= UICtor.cBtn("res/ui/bjdmj/popup/pyq/bisai/mingxi.png");
        this.detailBtn.setPosition(itemBg.width - 150,itemBg.height/2);
        itemBg.addChild(this.detailBtn);

        UITools.addClickEvent(this.detailBtn,this,this.onClickDetailBtn);

    },

    setData:function(data){
        this.itemData = data;
        // cc.log("setData",JSON.stringify(data))
        this.nameLabel.setString(data.userName);
        this.idLabel.setString("ID:" + data.userId);

        var credit = data.credit || 0;
        credit = MathUtil.toDecimal(credit/100);
        this.scoreLabel.setString(credit);
        this.showIcon(this.imgHead,data.headimgurl);

        //var upIds = "";
        //if(data.teamLeaderId){
        //    upIds+=("组长:" + data.teamLeaderId);
        //}
        //if(data.preUserId){
        //    if(upIds){
        //        upIds += "\n";
        //    }
        //    upIds += ("上级:" + data.preUserId);
        //}
        //if(!upIds)upIds = "----";
        this.upPlayerIdLabel.setString(data.promoterId != 0|| data.promoterId != "" ? data.promoterId:"---");

        var preName = data.preName && data.preName != ""?data.preName:"---"
        this.upPlayerNameLabel.setString(UITools.truncateLabel(preName,6));

    },

    showIcon: function (imgNode,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        var spr = imgNode.getChildByName("icon_spr");
        if(!spr){
            spr = new cc.Sprite(defaultimg);
            spr.setName("icon_spr");
            spr.setPosition(imgNode.width/2,imgNode.height/2);
            spr.setScale(100/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(100/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onClickDetailBtn:function(){
        // cc.log("this.itemData =", JSON.stringify(this.itemData));
        var mc = new clubScoreMingXiPop(this.itemData);
        PopupManager.addPopup(mc);
        // if(this.itemData){
        //     SyEventManager.dispatchEvent("Show_Credit_User_Detail",this.itemData);
        // }
    }
});

var CreditScoreDetailItem = ccui.Widget.extend({
    ctor:function(){
        this._super();
        this.setContentSize(1580, 156);


        var itemBg = UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        itemBg.setScale9Enabled(true);
        itemBg.setContentSize(this.getContentSize());
        itemBg.setPosition(this.width/2,this.height/2);
        this.addChild(itemBg);
        this.itemBg = itemBg;

        this.scoreLabel= UICtor.cLabel("0",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.scoreLabel.setPosition(120,itemBg.height/2);
        itemBg.addChild(this.scoreLabel);

        this.remainScore= UICtor.cLabel("0",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.remainScore.setPosition(430,itemBg.height/2);
        itemBg.addChild(this.remainScore);

        this.labelType= UICtor.cLabel("增减分",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.labelType.setPosition(800,itemBg.height/2 + 40);
        itemBg.addChild(this.labelType);

        this.labelOptName= UICtor.cLabel("玩家比较长的名字看看",40,cc.size(300,45),cc.color("#6f1816"),1,0);
        this.labelOptName.setPosition(800,itemBg.height/2);
        itemBg.addChild(this.labelOptName);

        this.labelOptId= UICtor.cLabel("(ID:12345678)",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.labelOptId.setPosition(800,itemBg.height/2 - 40);
        itemBg.addChild(this.labelOptId);

        this.wanfaName= UICtor.cLabel("娄底放炮罚的玩法",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.wanfaName.setPosition(itemBg.width/2 + 300,itemBg.height/2);
        itemBg.addChild(this.wanfaName);

        this.timeLabel= UICtor.cLabel("2019-05-06\n18:04",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.timeLabel.setPosition(itemBg.width - 180,itemBg.height/2);
        itemBg.addChild(this.timeLabel);
    },

    setData:function(data){
        var score = data.credit || 0 ;
        score = MathUtil.toDecimal(score/100);
        if(score > 0)score = "+" + score;
        this.scoreLabel.setString(score);
        var curCredit = data.curCredit || 0;
        curCredit = MathUtil.toDecimal(curCredit/100);
        this.remainScore.setString(curCredit);
        var strLabel = "输赢分";
        if(data.type == 1){
            strLabel = "转移比赛分";
        }else if(data.type == 2 || data.type == 5){
            strLabel = "赠送分";
        }else if(data.type == 4){
            strLabel = "洗牌分";
        } else if (data.type == 6) {
            strLabel = "零钱包";
        }
        this.labelType.setString(strLabel);
        this.timeLabel.setString(this.formatTime(data.createdTime));
        this.wanfaName.setString(data.roomName || "----");

        if(data.optUserId){
            this.labelOptId.setString("(ID:" + data.optUserId + ")");
            this.labelOptName.setString(data.userName);
        }else{
            this.labelOptName.setVisible(false);
            this.labelOptId.setVisible(false);
            this.labelType.setPositionY(this.itemBg.height/2);
        }
    },

    formatTime:function(timeStr){
        var data = new Date(timeStr);
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        var day = data.getDate();

        var hour = data.getHours();
        var min = data.getMinutes();
        var sec = data.getSeconds();

        if(month < 10)month = "0" + month;
        if(day < 10)day = "0" + day;
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min = "0" + min;
        if(sec < 10)sec = "0" + sec;

        var str = year + "-" + month + "-" + day + "\n" + hour + ":" + min;
        return str;
    },
});


var clubScoreMingXiPop = BasePopup.extend({

    ctor:function (data) {
        this.data = data;
        this.selectScoreType = 0;
        this.curRankPage = 1;
        this._super("res/clubScoreMingXiPop.json");
    },

    selfRender:function () {
        var widgetShaixuan = { "Button_shaixuan_1": 1, "Button_shaixuan_2": 2, "Button_shaixuan_3": 3, "Button_shaixuan_4": 4, "Button_shaixuan_5": 5, "Button_shaixuan_6": 6, "Button_shaixuan_7": 7 };
        this.addClickEvent(widgetShaixuan, this.onShaixuanClick);
        this.setShaixuanBtnEnabled(1)
        this.getWidget("Button_shaixuan_6").visible = false;

        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbNoData = this.getWidget("labelNoData");

        this.ListView_Winner = this.getWidget("ListView_mumber");

        this.lbbeginTime = this.getWidget("beginTime");
        this.lbendTime = this.getWidget("endTime");

        //选择日期
        this.dataTouchPanel = this.getWidget("dataTouchPanel");
        this.dataTouchPanel.setTouchEnabled(true);
        UITools.addClickEvent(this.dataTouchPanel, this, this.onOpenChoiceTimePop);
        //打开选择时间界面
        var tBegin = new Date();
        this.defaultBeginTime = UITools.getLocalItem("sy_credit_beginTime") || tBegin;
        this.defaultendTime = UITools.getLocalItem("sy_credit_endTime") || tBegin;
        this.endTimeSingle = UITools.getLocalItem("sy_credit_endTimeSingle") || tBegin;

        this.beginTime = this.defaultBeginTime;
        this.endTime = this.defaultendTime;
        this.lbbeginTime.setString(this.formatTime(this.beginTime));
        this.lbendTime.setString(this.formatTime(this.endTime));

        var btnRankLeft = this.getWidget("btnDataLeft");
        if (btnRankLeft) {
            UITools.addClickEvent(btnRankLeft, this, this.onDetailUpPage);
        }

        var btnRankRight = this.getWidget("btnDataRight");
        if (btnRankRight) {
            UITools.addClickEvent(btnRankRight, this, this.onDetailDownPage);
        }

        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);

        this.showScoreDetail();
    },


    showScoreDetail: function () {
        // cc.log("obj =", JSON.stringify(obj));
        if (this.data && this.data.userRole > 2) {
            this.getWidget("Button_shaixuan_5").visible = false;
        }

        if (this.data && this.data.ext && JSON.parse(this.data.ext).xipaiConfig == "1") {
            this.getWidget("Button_shaixuan_5").visible = true;
        }

        if (this.data && (this.data.userRole == 1 || this.data.userRole == 10000)) {
            this.getWidget("Button_shaixuan_7").visible = true;
        } else {
            this.getWidget("Button_shaixuan_7").visible = false;
        }

        this.setDetailUserInfo(this.data);
        this.getUserDetailScore(1, this.curUserTargetId);
    },

    //查询单个玩家的比赛分明细
    getUserDetailScore: function (page, targetId) {
        var self = this;
        page = page || this.curRankPage;

        var startDate = this.formatDataToSever(this.beginTime);
        var endDate = this.formatDataToSever(this.endTime, true);

        NetworkJT.loginReq("groupActionNew", "creditLogList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: page,
            pageSize: 20,
            targetId: targetId,
            selectType: this.selectScoreType,
            startDate: startDate,
            endDate: endDate
        }, function (data) {
            if (data) {
                cc.log("============getUserDetailScore===========" + JSON.stringify(data));
                var isShow = false;

                if (data.message.dataList.length > 0) {//获取当前页 有数据的情况
                    self.curRankPage = self.chooseRankPage = page;
                    self.lbDataPage.setString("" + self.curRankPage);
                    self.ListView_Winner.removeAllChildren();
                } else {
                    if (page == 1) {
                        isShow = true;
                        self.curRankPage = self.chooseRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_Winner.removeAllChildren();
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                        return;
                    }
                }
                self.showLbNoData(isShow);

                self.refreshUserDetailList(data.message.dataList);

                var zongji = data.message.sumCredit || 0;
                zongji = MathUtil.toDecimal(zongji / 100);
                self.getWidget("label_zongji").setString("合计：" + zongji);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshUserDetailList: function (data) {
        this.ListView_Winner.removeAllChildren();
        for (var i = 0; i < data.length; ++i) {
            var item = new CreditScoreDetailItem();
            item.setData(data[i]);
            this.ListView_Winner.pushBackCustomItem(item);
        }
    },

    changeSearchTime: function (event) {
        var data = event.getUserData();
        var beginTime = data.beginTime;
        var endTime = data.endTime;

        this.lbbeginTime.setString(this.formatTime(beginTime));
        this.lbendTime.setString(this.formatTime(endTime));
        this.beginTime = beginTime;
        this.endTime = endTime;
        var rankParams = {};
        rankParams.beginTime = this.beginTime;
        rankParams.endTime = this.endTime;
        rankParams.pageNo = this.curRankPage;

        cc.sys.localStorage.setItem("sy_credit_beginTime", (this.beginTime));
        cc.sys.localStorage.setItem("sy_credit_endTime", (this.endTime));

        this.getUserDetailScore(1, this.curUserTargetId);

    },

    setDetailUserInfo: function (obj) {
        var headItem = this.getWidget("Image_user_1");
        var imgHead = headItem.getChildByName("Image_head");
        var userName = headItem.getChildByName("Label_myName");
        var userId = headItem.getChildByName("Label_myId");
        this.showUserDetailIcon(imgHead, obj ? obj.headimgurl : PlayerModel.headimgurl);
        userName.setString(obj ? obj.userName : PlayerModel.name);
        this.curUserTargetId = obj ? obj.userId : PlayerModel.userId;
        userId.setString(this.curUserTargetId);
    },

    showUserDetailIcon: function (imgNode, iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        var spr = imgNode.getChildByName("icon_spr");
        if (!spr) {
            spr = new cc.Sprite(defaultimg);
            spr.setName("icon_spr");
            spr.setPosition(imgNode.width / 2, imgNode.height / 2);
            spr.setScale(imgNode.width / spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, { width: 252, height: 252 }, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(imgNode.width / spr.width);
                }
            });
        } else {
            spr.initWithFile(defaultimg);
        }
    },

    //显示暂无数据提示
    showLbNoData: function (_bool) {
        this.lbNoData.visible = _bool;
    },

    addClickEvent: function (widgets, selector) {
        for (var key in widgets) {
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget, this, selector);
        }
    },

    setShaixuanBtnEnabled: function (temp) {
        for (var i = 1; i <= 7; i++) {
            if (i == temp) {
                this["Button_shaixuan_" + i].setEnabled(false);
            } else {
                this["Button_shaixuan_" + i].setEnabled(true);
            }
        }
    },

    onShaixuanClick: function (obj) {
        for (var i = 1; i <= 7; i++) {
            if (obj.temp == i) {
                this["Button_shaixuan_" + i].setEnabled(false);
            } else {
                this["Button_shaixuan_" + i].setEnabled(true);
            }
        }
        this.updateSelectType(obj.temp - 1)
    },

    updateSelectType: function (type) {
        if (this.selectScoreType != type) {
            this.selectScoreType = type;
            //this.setXialaType(type);
            this.getUserDetailScore(1, this.curUserTargetId);
        }
    },

    onOpenChoiceTimePop: function () {
        var beginTime = UITools.getLocalItem("sy_credit_beginTime") || 0;
        var endTime = UITools.getLocalItem("sy_credit_endTime") || 0;
        var mc = new ClubChoiceTimePop(this, beginTime, endTime, 3);
        PopupManager.addPopup(mc);
    },

    formatDataToSever: function (time, isEnd) {
        var time = new Date(time);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        if (m < 10) m = "0" + m;
        if (d < 10) d = "0" + d;

        var ret = y + "-" + m + "-" + d;
        if (isEnd) ret += " 23:59:59";
        else ret += " 00:00:00";
        return ret;
    },

    formatTime: function (shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        //cc.log("shijianchuo ..." , shijianchuo);
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        return this.add0(m) + '月' + this.add0(d) + '日'
    },

    add0: function (m) {
        return m < 10 ? '0' + m : m + "";
    },

    /**
     * 排行榜下翻
     */
    onDetailDownPage: function () {
        var detailPage = this.curRankPage + 1;
        //cc.log("获取下一页数据" , detailPage);
        var rankParams = {};
        rankParams.beginTime = this.beginTime;
        rankParams.endTime = this.endTime;
        rankParams.pageNo = detailPage;
        this.getUserDetailScore(detailPage, this.curUserTargetId);
    },

    /**
     * 排行榜上翻
     */
    onDetailUpPage: function () {
        var detailPage = this.curRankPage;
        if (this.curRankPage > 1) {
            detailPage = this.curRankPage - 1;
        } else {
            //FloatLabelUtil.comText("没有更多数据了");
            return;
        }
        //cc.log("获取上一页数据" , detailPage);
        var rankParams = {};
        rankParams.beginTime = this.beginTime;
        rankParams.endTime = this.endTime;
        rankParams.pageNo = detailPage;
        this.getUserDetailScore(detailPage, this.curUserTargetId);
    },

})