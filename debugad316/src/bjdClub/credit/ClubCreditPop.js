/**
 * Created by leiwenwen on 2018/10/15.
 */
var ClubCreditPop = BasePopup.extend({
    show_version: true,
    ctor: function (data) {
        this.data = data;
        this.clubBagList = {};
        this.selectScoreType = 0;
        this.orderByField = 1;
        this.orderByType = 2;
        this._super("res/clubCreditPop.json");
    },

    selfRender: function () {

        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        cc.sys.localStorage.setItem("sy_credit_beginTime", (0));
        cc.sys.localStorage.setItem("sy_credit_endTime", (0));
        cc.sys.localStorage.setItem("sy_credit_endTimeSingle", (0));

        this.isClubCreaterOrLeader = ClickClubModel.isClubCreaterOrLeader();
        this.isClubTeamLeader = ClickClubModel.isClubTeamLeader();
        this.isClubAgency = ClickClubModel.isClubAgency();
        this.isClubFourAgency = ClickClubModel.isClubFourAgency();

        var closeBtn = this.getWidget("close_btn");  // 前往大厅
        if (closeBtn) {
            UITools.addClickEvent(closeBtn, this, this.onClose);
        }

        var find_btn = this.findBtn = this.getWidget("find_btn");  // 快速查找
        if (find_btn) {
            UITools.addClickEvent(find_btn, this, this.onFind);
        }

        this.returnBtn = this.getWidget("Button_return")
        UITools.addClickEvent(this.returnBtn, this, this.onReturn);

        this.lbNoData = this.getWidget("labelNoData");
        this.lbNoData.visible = false;

        //当前选中的页签
        this.findId = 0;
        //排行榜当前页码 , 最大页码
        this.curRankPage = 1;
        //排行榜当前页码 , 最大页码
        this.chooseRankPage = 1;
        this.date = 0;//当前是第几天的战绩 1今天 2昨天 3前天
        this.maxRankPageSize = 20; //当前最多显示多少条数据
        this.returnOne = 0;//是不是请求多个数据
        this.condition = "2,4,5";//2 正常结束 , 3未开局被解散, 4中途解散
        this.maxPageSize = 20;//每页最多显示多少条
        this.searchTableId = 0; //通过桌号id查找
        this.searchUserId = 0; //通过玩家id查找
        this.isPositive = 1;//1上分-1下分
        this.Operation = 0;//0不区分查询人1查询操作人2查询被操作人

        this.btnList = [];//需要显示的页签列表

        this.isOnly = 0;//是不是0不是1是仅自己

        this.allotMode = ClickClubModel.getClubAllotMode();

        this.chooseBtnIdnex = 0;//当前选择的切页 1是小组 2是附属成员 3是发展拉手

        this.findBtnIdnex = 0;//当前选择的切页 0是没有查找 1是查找成员 2是查找拉手
        this.searchStr = 0;//当前搜索的内容

        this.returnList = [];   //记录返回的列表

        var myName = this.getWidget("Label_myName");
        //myName.setString(""+ClickClubModel.getCurClubName());
        myName.setString(PlayerModel.name);


        var myId = this.getWidget("Label_myId");
        var idStr = ClickClubModel.getCurClubId();

        //cc.log("idStr=="+idStr);
        if (!this.isClubCreaterOrLeader) {
            idStr = this.dealUserId(idStr);
        }
        //myId.setString("ID:"+idStr);
        myId.setString("ID:" + PlayerModel.userId);

        this.icon = this.getWidget("Image_head");
        //this.showIcon(ClickClubModel.getCurClubImgUrl());
        this.showIcon(PlayerModel.headimgurl);

        this.ListView_Winner = this.getWidget("ListView_Winner");
        this.ListView_credit = this.getWidget("ListView_credit");
        this.ListView_mumber = this.getWidget("ListView_mumber");

        //选择日期
        this.dataTouchPanel = this.getWidget("dataTouchPanel");
        //选择某一天
        this.dataTouchPanel1 = this.getWidget("dataTouchPanel1");
        //选择今天昨天前天
        this.Image_dateBg = this.getWidget("Image_dateBg");
        //总数
        this.lbAllGmaes = this.getWidget("lbAllGmaes");
        //切换页码
        this.pageBg = this.getWidget("pageBg");

        //上分下分背景图
        this.Image_scoreBg = this.getWidget("Image_scoreBg");


        this.Image_myLeadTeam = this.getWidget("Image_myLeadTeam");//显示所属小组信息的背脊图
        this.Image_myLeadTeam.visible = false;


        this.Panel_found = this.getWidget("Panel_found");
        this.btn_szbsyj = this.getWidget("Button_szbsyj");
        UITools.addClickEvent(this.btn_szbsyj, this, this.onSzbsyj)

        this.findDownTeamBtn = this.getWidget("findDownTeamBtn");
        this.findDownTeamBtn.visible = false;
        //UITools.addClickEvent(this.findDownTeamBtn , this , this.onFindDownTeam);

        //查看操作人和被操作人
        var widgetOperation = { "operation_btn": 1, "operationed_btn": 2 };
        this.addDtzClickEvent(widgetOperation, this.onOperationClick);

        ////是否选择随机先出
        var widgetScore = { "btn_shangfen": 1, "btn_xiafen": -1 };
        this.addDtzClickEvent(widgetScore, this.onScoreClick);

        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbDataPage.setString("1");

        var btnRankLeft = this.getWidget("btnDataLeft");
        if (btnRankLeft) {
            UITools.addClickEvent(btnRankLeft, this, this.onDetailUpPage);
        }

        var btnRankRight = this.getWidget("btnDataRight");
        if (btnRankRight) {
            UITools.addClickEvent(btnRankRight, this, this.onDetailDownPage);
        }


        //今天昨天前天底图
        for (var i = 1; i <= 3; i++) {
            this["btn_day" + i] = this.getWidget("btn_day" + i);
        }
        //今天昨天前天文字
        var widgetsDate = { "btn_day1": 1, "btn_day2": 2, "btn_day3": 3 };
        this.addClickEvent(widgetsDate, this.onDateClick);

        this.touchPanel = this.getWidget("dataTouchPanel");
        this.touchPanel.setTouchEnabled(true);
        UITools.addClickEvent(this.touchPanel, this, this.onOpenChoiceTimePop);
        this.openChoiceTime = this.getWidget("btnOpenChoiceTime");
        if (this.openChoiceTime) {
            UITools.addClickEvent(this.openChoiceTime, this, this.onOpenChoiceTimePop)
        }

        this.dataTouchPanel1.setTouchEnabled(true);
        UITools.addClickEvent(this.dataTouchPanel1, this, this.onOpenSingleTimePop);

        this.Image_xhtjBg = this.getWidget("Image_xhtjBg");

        //显示自己的比赛分 和所有人的比赛分
        this.lbMyscore = this.getWidget("lbMyscore");
        this.lbAllscore = this.getWidget("lbAllscore");
        this.lbMyscore.setString("我的比赛分:0");
        this.lbAllscore.setString("总比赛分:0");

        if (SdkUtil.isIphoneX()) {
            this.lbMyscore.y += 15;
            this.lbAllscore.y += 15;
        }

        this.lbbeginTime = this.getWidget("beginTime");
        this.lbendTime = this.getWidget("endTime");
        this.endTimeLabel = this.getWidget("endTimeLabel");


        //打开选择时间界面
        var tBegin = new Date();
        this.defaultBeginTime = UITools.getLocalItem("sy_credit_beginTime") || tBegin;
        this.defaultendTime = UITools.getLocalItem("sy_credit_endTime") || tBegin;
        this.endTimeSingle = UITools.getLocalItem("sy_credit_endTimeSingle") || tBegin;

        this.beginTime = this.defaultBeginTime;
        this.endTime = this.defaultendTime;
        this.lbbeginTime.setString(this.formatTime(this.beginTime));
        this.lbendTime.setString(this.formatTime(this.endTime));
        this.endTimeLabel.setString(this.formatTime(this.endTimeSingle));



        var inputIdImg = this.inputIdImg = this.getWidget("inputNumberBg");
        this.inputIdImgPos = inputIdImg.getPosition();
        this.inputName = new cc.EditBox(cc.size(270, 70), new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputName.setPosition(inputIdImg.width / 2, inputIdImg.height / 2);
        this.inputName.setDelegate(this);
        this.inputName.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputName.setMaxLength(30);
        this.inputName.setFont("Arial", 40);
        this.inputName.setPlaceHolder("成员ID");
        this.inputName.setPlaceholderFont("Arial", 40);
        this.inputName.setFontColor(cc.color(255, 255, 255));
        inputIdImg.addChild(this.inputName, 1);


        var inputRoomImg = this.inputRoomImg = this.getWidget("inputRoomBg");
        this.inputRoom = new cc.EditBox(cc.size(270, 70), new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputRoom.setPosition(inputRoomImg.width / 2, inputRoomImg.height / 2);
        this.inputRoom.setDelegate(this);
        this.inputRoom.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputRoom.setMaxLength(30);
        this.inputRoom.setFont("Arial", 40);
        this.inputRoom.setPlaceHolder("房间ID");
        this.inputRoom.setPlaceholderFont("Arial", 40);
        this.inputRoom.setFontColor(cc.color(255, 255, 255));
        inputRoomImg.addChild(this.inputRoom, 1);
        this.inputRoom.setTouchEnabled(true);


        var inputIdImg1 = this.inputIdImg1 = this.getWidget("inputNumberBg1");
        this.inputName1 = new cc.EditBox(cc.size(270, 70), new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputName1.setPosition(inputIdImg1.width / 2, inputIdImg1.height / 2);
        this.inputName1.setDelegate(this);
        this.inputName1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputName1.setFont("Arial", 40);
        this.inputName1.setFontColor(cc.color(255, 255, 255));
        this.inputName1.setMaxLength(30);
        this.inputName1.setPlaceHolder("成员ID");
        this.inputName1.setPlaceholderFont("Arial", 40);
        inputIdImg1.addChild(this.inputName1, 0);

        var CheckBox_only = this.CheckBox_only = this.getWidget("CheckBox_only");
        CheckBox_only.addEventListener(this.onCheckBoxOnly, this);
        CheckBox_only.setSelected(false);


        this.Panel_spread = this.getWidget("Panel_spread");//显示拉手的界面
        this.Panel_fzls = this.getWidget("Panel_fzls");//附属成员的界面
        this.Panel_fzls.visible = false;
        this.ListView_lashou = this.getWidget("ListView_lashou");//显示附属成员

        this.Panel_tips = this.getWidget("Panel_tips");//显示提示弹框
        this.Panel_tips.visible = false;
        this.labelTips = this.getWidget("labelTips");//显示提示内容
        var ruleBtn = this.getWidget("ruleBtn");//提示按钮

        UITools.addClickEvent(ruleBtn, this, this.onRule);
        UITools.addClickEvent(this.Panel_tips, this, this.onRule);
        this.showRuleText();

        var foundBtn = this.getWidget("foundBtn");//查询
        UITools.addClickEvent(foundBtn, this, this.onFoundBtn);


        //小组，附属成员 发展拉手
        var widgetChoose = { "chooseBtn1": 1, "chooseBtn2": 2, "chooseBtn3": 3 };
        this.addDtzClickEvent(widgetChoose, this.onChooseClick);
        //this.onChooseClick(this.chooseBtn1,false);

        var resfile1 = "xiaozu1.png";
        var resfile2 = "xiaozu2.png";
        if (ClickClubModel.isClubCreaterOrLeader()) {
            resfile1 = "xiaozu1.png";
            resfile2 = "xiaozu2.png";
        } else if (ClickClubModel.isClubTeamLeader()) {
            resfile1 = "hehuoren1_1.png";
            resfile2 = "hehuoren1_2.png";
        } else if (ClickClubModel.promoterLevel >= 1 && ClickClubModel.promoterLevel <= 4) {
            resfile1 = "hehuoren" + (Number(ClickClubModel.promoterLevel) + 1) + "_1.png";
            resfile2 = "hehuoren" + (Number(ClickClubModel.promoterLevel) + 1) + "_2.png";
        }
        resfile1 = "res/ui/bjdmj/popup/pyq/bisai/" + resfile1;
        resfile2 = "res/ui/bjdmj/popup/pyq/bisai/" + resfile2;
        this.chooseBtn1.loadTextures(resfile1, resfile1, resfile2);

        this.showChooseBtn();

        //分成方式
        var widgetWays = { "txtWay1": 1, "btnWay1": 1, "txtWay2": 2, "btnWay2": 2 };
        this.addDtzClickEvent(widgetWays, this.onWaysClick);
        this.displayWays(this.allotMode == 1 ? this.btnWay1 : this.btnWay2);

        //排序方式
        var widgetSorts = { "img_px1": 1, "img_px2": 2 };
        this.addDtzClickEvent(widgetSorts, this.onSortsClick);
        this.img_px1.visible = this.img_px2.visible = false;
        this.img_px1.isUp = 1;

        //排序方式
        var widgetSorts = { "img_sort_1": 1, "img_sort_2": 2 };
        this.addDtzClickEvent(widgetSorts, this.onSortsClick);
        this.img_sort_1.visible = this.img_sort_2.visible = false;
        this.img_sort_1.isUp = 1;
        this.img_sort_2.isUp = 1;

        this.findmember_btn = this.getWidget("findmember_btn");//查询成员
        this.finddown_btn = this.getWidget("finddown_btn");//查询下级

        //查询成员查询下级
        var widgetfinds = { "findmember_btn1": 1, "findmember_btn2": 2 };
        this.addDtzClickEvent(widgetfinds, this.onFindMenber);

        this.panel_score_detail = this.getWidget("panel_score_detail");
        this.xialaItem = ccui.helper.seekWidgetByName(this.panel_score_detail, "item_xiala");
        //this.xialaItem.visible = true;
        this.zongjiItem = ccui.helper.seekWidgetByName(this.panel_score_detail, "item_zongji");
        this.zongjiItem.getChildByName("label_zongji").setString("合计：0");
        UITools.addClickEvent(this.xialaItem.getChildByName("btn_xiala"), this, this.onClickXialaBtn);
        // this.addCustomEvent("Show_Credit_User_Detail", this, this.onShowUserDetail);

        var img1 = "res/ui/bjdmj/popup/pyq/bisai/chakan1.png";
        var img2 = "res/ui/bjdmj/popup/pyq/bisai/chakan2.png";
        this.checkNegativePlayerBox = new ccui.CheckBox(img2, img2, img1, null, null, ccui.Widget.LOCAL_TEXTURE);
        this.checkNegativePlayerBox.setPosition(450, 370);
        this.checkNegativePlayerBox.addEventListener(this.selectNegativeBox, this);
        this.panel_score_detail.addChild(this.checkNegativePlayerBox);
        this.checkNegativePlayerBox.setVisible(false);

        var dispr = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/bisai/fenchendi.png");
        dispr.setContentSize(460, 73);
        dispr.setPosition(this.checkNegativePlayerBox.width / 2, this.checkNegativePlayerBox.height / 2);
        this.checkNegativePlayerBox.addChild(dispr, -1);

        this.shaixuanItem = ccui.helper.seekWidgetByName(this.panel_score_detail, "Panel_shaixuan");
        // 零钱包 服务端需要的参数是6 只能多创建一个按钮
        var widgetShaixuan = { "Button_shaixuan_1": 1, "Button_shaixuan_2": 2, "Button_shaixuan_3": 3, "Button_shaixuan_4": 4, "Button_shaixuan_5": 5, "Button_shaixuan_6": 6, "Button_shaixuan_7": 7 };
        this.addDtzClickEvent(widgetShaixuan, this.onShaixuanClick);
        this.setShaixuanBtnEnabled(1)
        this.getWidget("Button_shaixuan_6").visible = false;

        // if (ClickClubModel.getCurClubRole() > 2) {
        //     this.getWidget("Button_shaixuan_5").visible = false;
        // }


        this.hideNodeParams = [];
        this.hideNodeParams.push(this.findBtn);
        this.hideNodeParams.push(this.inputIdImg);
        this.hideNodeParams.push(this.inputRoomImg);
        this.hideNodeParams.push(this.dataTouchPanel);
        this.hideNodeParams.push(this.dataTouchPanel1);
        this.hideNodeParams.push(this.Image_dateBg);
        this.hideNodeParams.push(this.lbAllGmaes);
        this.hideNodeParams.push(this.pageBg);
        this.hideNodeParams.push(this.Image_scoreBg);
        this.hideNodeParams.push(this.operation_btn);
        this.hideNodeParams.push(this.operationed_btn);
        this.hideNodeParams.push(this.lbMyscore);
        this.hideNodeParams.push(this.lbAllscore);
        this.hideNodeParams.push(this.CheckBox_only);
        this.hideNodeParams.push(this.Panel_spread);
        this.hideNodeParams.push(this.findmember_btn1);
        this.hideNodeParams.push(this.findmember_btn2);
        this.hideNodeParams.push(this.Panel_found);
        this.hideNodeParams.push(this.findDownTeamBtn);
        this.hideNodeParams.push(this.Image_xhtjBg);


        var removeBtnList = [1, 2, 7];
        if (ClickClubModel.getIsSwitchCoin() && ClickClubModel.isClubCreaterOrLeader()) {
            removeBtnList = [1, 2];//暂时去掉赠送排行
        }
        if (ClickClubModel.isClubNormalMember()) {
            removeBtnList = [0, 1, 2, 4, 6, 7];//暂时去掉赠送排行
        }
        //else if (this.isClubTeamLeader || this.isClubAgency){
        //    removeBtnList = [2];
        //}

        for (var i = 0; i < 8; i++) {
            var index = i + 1;
            var btn_credit = this.getWidget("btn_credit_" + index);
            btn_credit.temp = index;
            this.btnList.push(btn_credit);
            UITools.addClickEvent(btn_credit, this, this.onBtnListClick);

        }
        for (var i = 0; i < removeBtnList.length; ++i) {
            this.ListView_credit.removeChild(this.btnList[removeBtnList[i]]);
        }

        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);
        this.addCustomEvent(SyEvent.RESET_SINGLE_TIME, this, this.changeSingleTime);
        this.addCustomEvent(SyEvent.UPDATA_CREDIT_RATIO, this, this.updateCreditRatio);
        this.addCustomEvent(SyEvent.CLUB_CHECK_DOWN_TEAM, this, this.onFindDownTeam);


        var parent = this.getWidget("Image_spread");

        this.item_radio_xiala = this.xialaItem.clone();
        this.item_radio_xiala.setPosition(-100, 410);
        this.item_radio_xiala.setVisible(true);
        parent.addChild(this.item_radio_xiala);
        UITools.addClickEvent(this.item_radio_xiala.getChildByName("btn_xiala"), this, this.onClickRadioXialaBtn);

    },

    displaySorts: function () {
        var values = [1, 2];
        var color1 = cc.color.YELLOW;
        var color2 = cc.color.WHITE;
        var img1 = "res/ui/bjdmj/popup/pyq/tongji/shang.png";
        var img2 = "res/ui/bjdmj/popup/pyq/tongji/xia.png";

        for (var i = 1; i <= values.length; i++) {
            var txt_sort = this.getWidget("menber_px" + i);
            var sortImg = txt_sort.getChildByName("img_px" + i);
            if (this.orderByField == i) {
                if (this.orderByType == 1) {
                    sortImg.isUp = 1;
                    sortImg.loadTexture(img1);
                } else if (this.orderByType == 2) {
                    sortImg.isUp = 2;
                    sortImg.loadTexture(img2);
                }
            } else {
                sortImg.isUp = 0;
                sortImg.loadTexture(img2);
            }
            sortImg.setColor(this.orderByField == i ? color1 : color2);
        }
        this.getTeamUserListData("");
    },

    onSortsClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1, 2];

        var color1 = cc.color.YELLOW;
        var color2 = cc.color.WHITE;


        var img1 = "res/ui/bjdmj/popup/pyq/tongji/shang.png";
        var img2 = "res/ui/bjdmj/popup/pyq/tongji/xia.png";

        for (var i = 1; i <= values.length; i++) {
            var sortImg = null
            if (this.findId == 1 || this.findId == 7) {
                var txt_sort = this.getWidget("menber_px" + i);
                sortImg = txt_sort.getChildByName("img_px" + i);
            } else if (this.findId == 5) {
                sortImg = this.getWidget("img_sort_" + i);
            }
            if (sortImg == null) return
            if (temp == i) {
                if (sortImg.isUp == 0 || sortImg.isUp == 1) {
                    sortImg.isUp = 2;
                    sortImg.loadTexture(img2);
                } else if (sortImg.isUp == 2) {
                    sortImg.isUp = 1;
                    sortImg.loadTexture(img1);
                }
                this.orderByField = temp;
                this.orderByType = sortImg.isUp;
            } else {
                sortImg.isUp = 0;
                sortImg.loadTexture(img2);
            }
            sortImg.setColor(temp == i ? color1 : color2);
        }
        if (this.findId == 1 || this.findId == 7) {
            this.getTeamUserListData();
        } else if (this.findId == 5) {
            this.getCreditCountData("", this.curRankPage)
        }
    },

    selectNegativeBox: function (sender) {
        this.getDetailUserList(1);
    },

    changeClubRadio: function (radio) {

        if (!ClickClubModel.isClubCreater()) {
            FloatLabelUtil.comText("只有会长才能修改");
            return;
        }
        var self = this;
        var str = "修改后分成区间赠送分的设置保持原有设置,请谨慎操作";
        AlertPop.show(str, function () {
            self.updateCreditRate(radio);
        });
    },

    onClickRadioXialaBtn: function () {
        if (!ClickClubModel.isClubCreater()) {
            FloatLabelUtil.comText("只有会长才能修改");
            return;
        }

        var idxArr = [1, 10, 100];
        var pop = new ClubChangeRadioPop(this, ArrayUtil.indexOf(idxArr, this.selectType));
        PopupManager.addPopup(pop);
    },

    setSelectRateIdx: function (idx) {
        this.selectType = idx;

        this.item_radio_xiala.getChildByName("label_xiala").setString("1:" + idx);

    },

    updateCreditRate: function (rate) {
        //cc.log("==============updateCreditRate=============" + rate);
        var self = this;
        NetworkJT.loginReq("groupActionNew", "updateGroupCreditRate", {
            userId: PlayerModel.userId,
            groupId: ClickClubModel.getCurClubId(),
            sessCode: PlayerModel.sessCode,
            creditRate: rate,
        }, function (data) {
            //cc.log("=========updateCreditRate========" + JSON.stringify(data));
            if (data.code == 0) {
                FloatLabelUtil.comText("修改成功");
                self.setSelectRateIdx(rate);
            }

        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onEnterTransitionDidFinish: function () {
        this._super();
        if (ClickClubModel.isClubNormalMember()) {
            //cc.log("this.findId==",this.findId)
            this.onBtnListClick(this.getWidget("btn_credit_6"));
        } else {
            this.onBtnListClick(this.getWidget("btn_credit_1"));
        }
    },

    onLingQianXiangQing:function () {
        var self = this;
        setTimeout(function () {
            self.onBtnListClick(self.getWidget("btn_credit_6"));
        },100)
        
    },
    showScoreDetail: function (type, obj) {
        this.panel_score_detail.visible = true;

        var headItem = ccui.helper.seekWidgetByName(this.panel_score_detail, "Image_user_1");
        var title_6 = ccui.helper.seekWidgetByName(this.panel_score_detail, "Panel_title_6");
        var title_7 = ccui.helper.seekWidgetByName(this.panel_score_detail, "Panel_title_7");

        headItem.visible = (type == 2);
        title_6.visible = (type == 1);
        title_7.visible = (type == 2);
        this.xialaItem.visible = false;
        this.shaixuanItem.visible = (type == 2);
        this.getWidget("Button_shaixuan_5").visible = false;
        if (obj && obj.userRole > 2) {
            this.getWidget("Button_shaixuan_5").visible = false;
        }

        if (obj && obj.ext && JSON.parse(obj.ext).xipaiConfig == "1") {
            this.getWidget("Button_shaixuan_5").visible = true;
        }

        if (obj && (obj.userRole == 1 || obj.userRole == 10000)) {
            this.getWidget("Button_shaixuan_7").visible = true;
        }else{
            this.getWidget("Button_shaixuan_7").visible = false;
        }

        
        this.zongjiItem.visible = (type == 2);
        this.dataTouchPanel.visible = (type == 2);

        //this.setXialaType(0);

        this.pageBg.visible = true;
        this.checkNegativePlayerBox.setVisible(type == 1);
        this.checkNegativePlayerBox.setSelected(false);
        if (type == 1) {
            this.findmember_btn1.visible = true;
            this.inputIdImg.visible = true;
            this.inputName.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
            this.inputName.setPlaceHolder("昵称或ID");
        }
        if (type == 2) {
            this.findmember_btn1.visible = false;
            this.inputIdImg.visible = false;
            //this.Image_dateBg.visible = true;
            this.date = 1;
            this.showDateClick();
        }
        if (type == 1) {
            this.getDetailUserList(1);
        } else {
            this.setDetailUserInfo(obj);
            this.getUserDetailScore(1, this.curUserTargetId);
        }

        this.curMingxiType = type;
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
        //cc.log("obj.temp============",obj.temp);
        //this.getUserDetailScore(1,this.curUserTargetId);
    },

    setDetailUserInfo: function (obj) {
        var headItem = ccui.helper.seekWidgetByName(this.panel_score_detail, "Image_user_1");
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

    onShowUserDetail: function (event) {
        var obj = event.getUserData();
        this.showScoreDetail(2, obj);
    },

    onClickXialaBtn: function () {
        var pop = new ClubCreditScoreTypePop(this, this.selectScoreType);
        PopupManager.addPopup(pop);
    },

    setXialaType: function (type) {
        this.selectScoreType = type;
        var str = "全部";
        var configArr = ["全部", "转移比赛分", "赠送分", "输赢分", "洗牌分"];
        if (configArr[type]) {
            str = configArr[type];
        }
        this.xialaItem.getChildByName("label_xiala").setString(str);
    },

    updateSelectType: function (type) {
        if (this.selectScoreType != type) {
            this.selectScoreType = type;
            //this.setXialaType(type);
            this.getUserDetailScore(1, this.curUserTargetId);
        }
    },

    //查询比赛分明细的玩家列表数据
    getDetailUserList: function (page, keyWord) {
        var self = this;
        page = page || this.curRankPage;
        NetworkJT.loginReq("groupActionNew", "userListForLogDetail", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: page,
            pageSize: this.maxPageSize,
            keyWord: keyWord || "",
            creditOrder: this.checkNegativePlayerBox.isSelected() ? 1 : 0
        }, function (data) {
            if (data) {
                cc.log("============getDetailUserList===========" + JSON.stringify(data));
                var isShow = false;

                if (data.message.userList.length > 0) {//获取当前页 有数据的情况
                    self.curRankPage = self.chooseRankPage = page;
                    self.lbDataPage.setString("" + self.curRankPage);
                    self.ListView_Winner.removeAllChildren();
                } else {
                    if (self.curRankPage == page) {
                        isShow = true;
                        self.ListView_Winner.removeAllChildren();
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                        return;
                    }
                }
                self.showLbNoData(isShow);

                self.refreshDetailUserList(data.message.userList);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
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
            pageSize: this.maxPageSize,
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
                self.zongjiItem.getChildByName("label_zongji").setString("合计：" + zongji);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshDetailUserList: function (data) {
        this.ListView_Winner.removeAllChildren();
        for (var i = 0; i < data.length; ++i) {
            var item = new CreditScoreUserItem();
            item.setData(data[i]);
            this.ListView_Winner.pushBackCustomItem(item);
        }
    },

    refreshUserDetailList: function (data) {
        this.ListView_Winner.removeAllChildren();
        for (var i = 0; i < data.length; ++i) {
            var item = new CreditScoreDetailItem();
            item.setData(data[i]);
            this.ListView_Winner.pushBackCustomItem(item);
        }
    },

    //根据不同的权限显示操作按钮
    showChooseBtn: function () {
        var values = [1, 2, 3];
        for (var i = 1; i <= values.length; i++) {
            this["chooseBtn" + i].visible = false;
        }

        //this.chooseBtn1.visible = false;
        //if (this.isClubCreaterOrLeader){
        //    this.chooseBtn1.visible = true;
        //    //this.chooseBtn2.visible = true;
        //}else if (this.isClubTeamLeader || this.isClubAgency){
        //    this.chooseBtn1.visible = true;
        //    //this.chooseBtn2.visible = true;
        //    this.chooseBtn3.visible = true;
        //    //if (this.isClubFourAgency){
        //    //    this.chooseBtn1.visible = false;
        //    //}
        //}
        //this.chooseBtn2.visible = false;

        var temp = 1;
        for (var i = 1; i <= values.length; i++) {
            if (i != temp) {
                this["chooseBtn" + i].setBright(false);
            } else {
                this["chooseBtn" + i].setBright(true);
            }
        }
    },

    updateCreditRatio: function () {
        var btn_credit = this.getWidget("btn_credit_1");
        btn_credit.temp = 1;
        this.onBtnListClick(btn_credit);
    },

    editBoxEditingDidBegin: function (editBox) {
        this.inputName.setString("");
        this.inputRoom.setString("");
        //暂时想不通这个editBox为什么没东西
        //cc.log("editBox " + editBox.getName() + " DidBegin !");
    },

    dealUserId: function (id) {
        var idStr = id.toString();
        var str = "";
        for (var i = 0; i < idStr.length; i++) {
            if (i == 0 || i == idStr.length - 1) {
                str = str + idStr[i];
            } else {
                str = str + "*";
            }
        }
        //cc.log("dealUserId",str);
        return str;
    },


    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = this.icon;
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if (icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)) {//头像不同才加载
            if (icon.getChildByTag(345)) {
                icon.removeChildByTag(345);
            }

            var sprite = new cc.Sprite(defaultimg);
            sprite.x = icon.width * 0.5;
            sprite.y = icon.height * 0.5;
            icon.addChild(sprite, 5, 345);
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, { width: 252, height: 252 }, function (error, img) {
                    if (!error) {
                        sprite.setTexture(img);
                        icon.curShowIconUrl = iconUrl
                    }
                });
            }
        }
    },

    //快速查询
    onFind: function () {
        if (this.findId == 1) {
            this.onShowCreditItem(1);
        } else if (this.findId == 2) {
            this.onShowCreditItem(2);
        } else if (this.findId == 3) {
            this.onShowCreditItem(3);
        } else if (this.findId == 5) {
            //this.onShowCreditItem(5);
            this.onSearchCreditDetailData();
        }
    },


    //显示不同界面的数据
    onBtnListClick: function (obj) {
        var temp = obj.temp;
        //if (this.findId == temp){
        //    return
        //}
        this.returnList = [];
        this.returnBtn.visible = false
        this.getWidget("Panel_title").visible = false;
        this.getWidget("Panel_title5_1").visible = false;
        this.getWidget("Panel_title6").visible = false;
        this.panel_score_detail.visible = false;
        this.inputName.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputName.setPlaceHolder("成员ID");
        this.inputIdImg.setPosition(this.inputIdImgPos);
        this.orderByField = 1;
        this.orderByType = 2;
        for (var i = 1; i <= 5; i++) {
            var Panel_title = this.getWidget("Panel_title" + i);
            if (i != temp) {
                Panel_title.visible = false;
            } else {
                Panel_title.visible = true;
            }
            //if(temp == 5 && this.isClubTeamLeader){
            //    this.getWidget("Panel_title5_1").visible = true;
            //    Panel_title.visible = false;
            //}
        }

        this.setBtnState(temp);

        for (var index = 0; index < this.hideNodeParams.length; index++) {
            if (this.hideNodeParams[index]) {
                this.hideNodeParams[index].visible = false;
            }
        }

        this.beginTime = this.defaultBeginTime;
        this.endTime = this.defaultendTime;
        this.endTimeSingle = this.defaultendTime;
        this.lbbeginTime.setString(this.formatTime(this.beginTime));
        this.lbendTime.setString(this.formatTime(this.endTime));
        this.endTimeLabel.setString(this.formatTime(this.endTimeSingle));

        this.inputName.setString("");
        this.inputRoom.setString("");
        this.inputName1.setString("");
        this.searchTableId = 0; //通过桌号id查找
        this.searchUserId = 0; //通过玩家id查找
        this.curRankPage = this.chooseRankPage = 1; //当前第几页
        this.Operation = 0;//操作人
        this.CheckBox_only.setSelected(false);
        this.isOnly = 0;//是不是仅自己
        this.lbDataPage.setString("" + this.curRankPage);

        ClickCreditTeamModel.clearTeamData(null);
        this.Panel_found.visible = true;
        this.btn_szbsyj.visible = false;
        /**
        * 1是成员管理2战绩查询3赠送排行4操作日志
        * **/
        if (temp == 1) {
            this.lbMyscore.visible = true;
            if (this.isClubCreaterOrLeader || this.isClubTeamLeader || this.isClubAgency) {
                this.lbAllscore.visible = true;
            }
            this.pageBg.visible = true;
            //this.pageBg.x = 374;
            //this.findBtn.visible = true;
            this.inputIdImg.visible = true;
            this.Panel_spread.visible = true;
            this.findmember_btn1.visible = true;
            this.findmember_btn2.visible = false;
            this.btn_szbsyj.visible = true;
            //if (this.isClubCreaterOrLeader || this.isClubTeamLeader || this.isClubAgency) {
            //    this.findmember_btn2.visible = true;
            //}
            //if (this.isClubFourAgency){
            //    this.findmember_btn2.visible = false;
            //}
        } else if (temp == 2) {
            this.findBtn.visible = true;
            this.inputIdImg.visible = true;
            this.inputRoomImg.visible = true;
            this.lbAllGmaes.visible = false;//暂时屏蔽
            this.pageBg.visible = true;
            //this.Image_dateBg.visible = true;
            this.dataTouchPanel.visible = true;
            this.lbAllGmaes.setString("总条数:0");
            //this.pageBg.x = 254;
            this.date = 1;
            this.showDateClick();

            //this.inputIdImg.setPositionX(this.inputIdImgPos.x - 140);
        } else if (temp == 3) {
            this.findBtn.visible = true;
            this.inputIdImg.visible = true;
            this.dataTouchPanel.visible = true;
            this.lbAllGmaes.visible = true;
            this.pageBg.visible = true;
            //this.pageBg.x = 304;
            this.lbAllGmaes.setString("总赠送分:0")
        } else if (temp == 4) {
            this.Image_scoreBg.visible = true;
            this.operation_btn.visible = true;
            this.operationed_btn.visible = true;
            this.inputIdImg.visible = true;
            this.dataTouchPanel1.visible = true;
            //this.Image_dateBg.visible = true;
            this.pageBg.visible = true;
            //this.pageBg.x = 334;
            this.date = 1;
            if (this.isClubCreaterOrLeader) {
                this.CheckBox_only.visible = true;
            }
            this.showDateClick();
            //this.inputIdImg.setPositionX(this.inputIdImgPos.x - 140);
        } else if (temp == 5) {
            for (var i = 1; i <= 2; i++) {
                this["img_sort_" + i].loadTexture("res/ui/bjdmj/popup/pyq/tongji/xia.png")
                this["img_sort_" + i].setColor(cc.color.WHITE)
            }
            this.orderByField = 1;
            this.orderByType = 0;
            //this.Image_dateBg.visible = true;
            this.dataTouchPanel1.visible = true;
            this.lbAllGmaes.visible = true;
            this.lbAllGmaes.setString("总赠送分:0");
            this.date = 1;
            this.showDateClick();
            //if(this.isClubTeamLeader){
            this.pageBg.visible = true;
            //this.pageBg.x = 304;
            this.inputIdImg.visible = true;
            this.findBtn.visible = true;

            //}
        } else if (temp == 6) {
            if (!ClickClubModel.isClubNormalMember()) {
                this.showScoreDetail(1);
            } else {
                this.showScoreDetail(2);
            }
        } else if (temp == 7) {
            this.lbMyscore.visible = true;
            if (this.isClubCreaterOrLeader || this.isClubTeamLeader || this.isClubAgency) {
                this.lbAllscore.visible = true;
            }
            this.pageBg.visible = true;
            //this.pageBg.x = 374;
            //this.findBtn.visible = true;
            this.inputIdImg.visible = true;
            this.Panel_spread.visible = true;
            this.findmember_btn2.x = this.findmember_btn1.x;
            this.findmember_btn1.visible = false;
            this.findmember_btn2.visible = true;
        } else if (temp == 8) {
            this.pageBg.visible = true;
            this.dataTouchPanel.visible = true;
            this.operationed_btn.visible = true;
            this.inputIdImg.visible = true;
            this.Image_xhtjBg.visible = true
        }

        this.onShowCreditItem(temp);
    },

    setBtnState: function (temp) {
        //cc.log("temp:;;"+temp)
        var items = this.ListView_credit.getItems();
        for (var i = 0; i < items.length; i++) {
            var j = items[i].temp;
            if (temp == j) {
                items[i].setBright(true);
                items[i].getChildByName("txt").setColor(cc.color("#b53802"));
            } else {
                items[i].setBright(false);
                items[i].getChildByName("txt").setColor(cc.color("#885f31"));
            }
        }
    },

    //上分和下分查询
    onScoreClick: function (obj) {
        var temp = obj.temp;
        var values = [1, -1];

        this.getWidget("btn_shangfen").setBright(temp == 1);
        this.getWidget("btn_xiafen").setBright(temp == -1);

        this.getScoreListData(temp);
    },

    //显示当前页的选择
    onShowCreditItem: function (temp, isTeamDeatail) {
        var userId = this.inputName.getString();
        var roomId = this.inputRoom.getString();
        var isTeamDeatail = isTeamDeatail || null;
        this.searchStr = "";
        this.Image_myLeadTeam.visible = false;
        this.searchTableId = roomId; //通过桌号id查找
        this.searchUserId = userId; //通过玩家id查找
        this.ListView_Winner.removeAllItems();
        this.findId = temp;
        this.findBtnIdnex = 0;
        var teamId = ClickCreditTeamModel.getCurTeamId();
        var data = [];
        if ((userId && userId != "") || (roomId && roomId != "")) {
            this.curRankPage = this.chooseRankPage = 1;
        }
        if (isTeamDeatail) {
            this.curRankPage = this.chooseRankPage = 1;
        }
        if (temp == 1) {
            if (isTeamDeatail) {
                //this.img_px1.visible = this.img_px2.visible = true;
                this.displaySorts();
                //this.getTeamUserListData("", 1);
            } else {
                this.onChooseClick(this.chooseBtn1);
            }
        } else if (temp == 2) {
            this.getCreditRecordData(this.curRankPage)
        } else if (temp == 3) {
            var rankParams = {};
            rankParams.beginTime = this.beginTime;
            rankParams.endTime = this.endTime;
            rankParams.pageNo = this.curRankPage;
            this.getRankListData(rankParams)
        } else if (temp == 4) {
            this.onScoreClick(this.getWidget("btn_shangfen"));
        } else if (temp == 5) {
            if (teamId != null) {
                this.curRankPage = this.chooseRankPage = 1; //当前第几页
                this.lbDataPage.setString("" + this.curRankPage);
                this.getCreditDetailData(teamId, this.curRankPage);
            } else {
                this.getCreditCountData("", this.curRankPage);
            }
        } else if (temp == 7) {
            if (isTeamDeatail) {
                //this.img_px1.visible = this.img_px2.visible = true;
                this.displaySorts();
                //this.getTeamUserListData("", 1);
            } else {
                this.onChooseClick(this.chooseBtn1, temp);
            }
        } else if (temp == 8) {
            this.getWidget("Panel_title6").visible = true;
            this.getGroupExpLogData(this.curRankPage)
        }

        if (temp == 1 || temp == 7) {
            this.ListView_Winner.visible = false;
            this.ListView_mumber.visible = true;
        } else {
            this.ListView_Winner.visible = true;
            this.ListView_mumber.visible = false;
        }
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
        var teamId = ClickCreditTeamModel.getCurTeamId();
        var userId = this.inputName.getString();
        // cc.log("this.findBtnIdnex ", this.findBtnIdnex)
        // cc.log("teamId ", teamId)
        
        //if (userId && userId != ""){
        //    detailPage = 1;
        //}
        if (this.findId == 1 || this.findId == 7) {
            if (this.findBtnIdnex == 1) {
                this.onSearchMember(this.searchStr, detailPage)
            } else if (this.findBtnIdnex == 2 || this.findBtnIdnex == 3) {
                this.getTeamListData(userId, detailPage);
            } else {
                if (this.findId == 1){
                    // if (teamId) {
                        this.getTeamUserListData(userId, detailPage);
                    // } else {
                    //     this.getTeamListData(userId, detailPage);
                    // }
                }else{
                    // if (teamId) {
                    //     this.getTeamUserListData(userId, detailPage);
                    // } else {
                        this.getTeamListData(userId, detailPage);
                    // }
                }
            }
        } else if (this.findId == 2) {
            this.getCreditRecordData(detailPage)
        } else if (this.findId == 3) {
            this.getRankListData(rankParams);
        } else if (this.findId == 4) {
            this.getScoreListData(this.isPositive, detailPage);
        } else if (this.findId == 5) {
            var teamId = ClickCreditTeamModel.getCurTeamId();
            if (teamId != null) {
                this.getCreditDetailData(teamId, detailPage);
            } else {
                this.getCreditCountData("", detailPage);
            }
            //if (teamId != null){
            //    this.getCreditDetailData(userId,detailPage);
            //}else{
            //    if (!ClickClubModel.isClubCreaterOrLeader() && !this.isClubTeamLeader){
            //        this.getCreditDetailData("");
            //    }else{
            //        this.getCreditCountData("",detailPage);
            //    }
            //}
            //this.getCreditCountData("",detailPage);
        } else if (this.findId == 6) {
            if (this.curMingxiType == 1) {
                this.getDetailUserList(detailPage);
            } else if (this.curMingxiType == 2) {
                this.getUserDetailScore(detailPage, this.curUserTargetId);
            }
        } else if (this.findId == 8) {
            this.getGroupExpLogData(detailPage)
        }
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
        var teamId = ClickCreditTeamModel.getCurTeamId();
        var userId = this.inputName.getString();
        //cc.log("this.findBtnIdnex ",this.findBtnIdnex )
        if (this.findId == 1 || this.findId == 7) {
            //if (this.chooseBtnIdnex == 1){
            //    this.getTeamListData(userId,detailPage);
            //}else if (this.chooseBtnIdnex == 2){
            //    this.getTeamUserListData(userId,detailPage);
            //}
            if (this.findBtnIdnex == 1) {
                this.onSearchMember(this.searchStr, detailPage)
            } else if (this.findBtnIdnex == 2 || this.findBtnIdnex == 3) {
                this.getTeamUserListData(userId, detailPage);
            } else {
                if (this.findId == 1) {
                    // if (teamId) {
                    this.getTeamUserListData(userId, detailPage);
                    // } else {
                    //     this.getTeamListData(userId, detailPage);
                    // }
                } else {
                    // if (teamId) {
                    // } else {
                        this.getTeamListData(userId, detailPage);
                    // }
                }

                

                //if (this.chooseBtnIdnex == 1){
                //    this.getTeamListData(userId,detailPage);
                //}else if (this.chooseBtnIdnex == 2){
                //    this.getTeamUserListData(userId,detailPage);
                //}
            }
        } else if (this.findId == 2) {
            this.getCreditRecordData(detailPage)
        } else if (this.findId == 3) {
            this.getRankListData(rankParams);
        } else if (this.findId == 4) {
            this.getScoreListData(this.isPositive, detailPage);
        } else if (this.findId == 5) {
            var teamId = ClickCreditTeamModel.getCurTeamId();
            if (teamId != null) {
                this.getCreditDetailData(teamId, detailPage);
            } else {
                this.getCreditCountData("", detailPage);
            }

            //var teamId = ClickCreditTeamModel.getCurTeamId();
            //if (teamId != null){
            //    this.getCreditDetailData(userId,detailPage);
            //}else{
            //    if (!ClickClubModel.isClubCreaterOrLeader() && !this.isClubTeamLeader){
            //        this.getCreditDetailData("");
            //    }else{
            //        this.getCreditCountData();
            //    }
            //}
            //this.getCreditCountData("",detailPage)
        } else if (this.findId == 6) {
            if (this.curMingxiType == 1) {
                this.getDetailUserList(detailPage);
            } else if (this.curMingxiType == 2) {
                this.getUserDetailScore(detailPage, this.curUserTargetId);
            }
        } else if (this.findId == 8) {
            this.getGroupExpLogData(detailPage)
        }
    },

    onOpenChoiceTimePop: function () {
        var beginTime = UITools.getLocalItem("sy_credit_beginTime") || 0;
        var endTime = UITools.getLocalItem("sy_credit_endTime") || 0;
        var mc = new ClubChoiceTimePop(this, beginTime, endTime, this.findId == 6 ? 3 : 0);
        PopupManager.addPopup(mc);
    },

    onOpenSingleTimePop: function () {
        var endTime = this.endTimeSingle || 0;
        var mc = new ClubSingleTimePop(this, endTime, 3);
        PopupManager.addPopup(mc);
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
        if (this.findId == 2) {
            this.getCreditRecordData(this.curRankPage)
        } else if (this.findId == 6) {
            // this.getUserDetailScore(1, this.curUserTargetId);
            //this.showScoreDetail(2);
        } else if (this.findId == 5) {
            this.getCreditCountData("", this.curRankPage)
        } else if (this.findId == 8) {
            this.getGroupExpLogData(this.curRankPage)
        } else {
            this.getRankListData(rankParams)
        }
    },

    changeSingleTime: function (event) {
        var data = event.getUserData();
        this.endTimeLabel.setString(this.formatTime(data.endTime));
        this.endTimeSingle = data.endTime;
        cc.sys.localStorage.setItem("sy_credit_endTimeSingle", (this.endTimeSingle));
        if (this.findId == 5) {
            this.getCreditCountData("", this.curRankPage)
        } else {
            this.getScoreListData(this.isPositive, this.curRankPage, this.Operation);
        }
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

    //选择第几天
    onDateClick: function (obj) {
        var clickId = parseInt(obj.temp);
        if (this.date == 0 || this.date != clickId) {
            var values = [1, 2, 3];
            for (var i = 1; i <= values.length; i++) {
                if (i != clickId) {
                    this["btn_day" + i].setBright(false);
                }
            }
            var btn = this["btn_day" + clickId];
            btn.setBright(true);
            this.date = clickId;
            //cc.log("点击了第"+clickId+"天");
            this.curRankPage = this.chooseRankPage = 1; //当前第几页
            this.lbDataPage.setString("" + this.curRankPage);
            if (this.findId == 2) {
                this.getCreditRecordData(this.curRankPage);
            } else if (this.findId == 4) {
                this.getScoreListData(this.isPositive, this.curRankPage);
            } else if (this.findId == 5) {
                //var teamId = ClickCreditTeamModel.getCurTeamId();
                //if (teamId != null){
                //    this.getCreditDetailData();
                //}else{
                //    if (!ClickClubModel.isClubCreaterOrLeader() && !this.isClubTeamLeader){
                //        this.getCreditDetailData("");
                //    }else{
                //        this.getCreditCountData();
                //    }
                //}
                this.getCreditCountData("", this.curRankPage)
            } else if (this.findId == 6) {
                this.getUserDetailScore(1, this.curUserTargetId);
            }
        }

    },

    showDateClick: function () {
        //cc.log("this.date=="+this.date)
        var values = [1, 2, 3];
        for (var i = 1; i <= values.length; i++) {
            if (this.date == i) {
                this["btn_day" + i].setBright(true);
            } else {
                this["btn_day" + i].setBright(false);
            }
        }
    },

    //刷新当前的比赛分界面
    updateMeMberListData: function () {
        this.getTeamUserListData();
    },

    onReturn: function (obj) {
        this.returnList.pop();
        if (this.returnList.length > 0) {
            var teamId = this.returnList[this.returnList.length - 1]
            ClickCreditTeamModel.setCurTeamId(teamId)
            if(this.findId == 1){
                this.onShowCreditItem(this.findId, true);
            } else {
                this.onFindDownTeam();
            }

            // this.onFindDownTeam();
        } else {
            obj.visible = false;
            ClickCreditTeamModel.clearTeamData(null);       
            if (this.findId == 1) {
                this.onShowCreditItem(this.findId);
            } else {
                this.getTeamListData();
            }
            // this.getTeamListData();
        }
    },

    /**
     * 获取小组信息
     * 1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部Id
     */
    getTeamListData: function (searchNameOrId, curPage) {
        var page = curPage || this.chooseRankPage;
        var userId = "";
        if (searchNameOrId != "") {
            userId = this.inputName.getString();
        }
        var searchNameOrId = userId || "";
        page = page || this.curRankPage;
        var self = this;
        self.Image_myLeadTeam.visible = false;
        var teamId = ClickCreditTeamModel.getCurTeamId();
        if(this.findId == 1 || this.findId == 7){
            teamId = null;
        }
        NetworkJT.loginReq("groupActionNew", "teamList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: page,
            pageSize: this.maxPageSize,
            keyWord: searchNameOrId,
            targetUserId: teamId
        }, function (data) {
            if (data) {
                if (self) {
                    //cc.log("getTeamListData",JSON.stringify(data));
                    var isShow = false;
                    //self.findDownTeamBtn.visible = false;
                    if (data.message.teamList.length > 0) {//获取当前页 有数据的情况
                        isShow = false;
                        self.curRankPage = self.chooseRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_mumber.removeAllChildren();
                    } else {
                        if (self.curRankPage == page) {
                            isShow = true;
                            self.ListView_mumber.removeAllChildren();
                        } else {
                            FloatLabelUtil.comText("没有更多数据了");
                            return;
                        }
                    }
                    self.showLbNoData(isShow);

                    var selectIdx = data.message.creditRate;
                    self.setSelectRateIdx(selectIdx);

                    var configCount = data.message.configCount;
                    var viewTeamUser = data.message.viewTeamUser;
                    var myRate = data.message.myRate;//自己设置比例的最大值
                    //cc.log("ClickClubModel.getCurClubRole()",ClickClubModel.getCurClubRole())
                    if (ClickClubModel.isClubNormalMember()) {
                        self.getWidget("Panel_title").visible = true;
                        self.getWidget("Panel_title1").visible = false;
                        self.refreshMemberList(data.message.teamList);
                    } else {
                        if (teamId && teamId != PlayerModel.userId) {
                            if (self.returnList.length > 0) {
                                if (teamId != self.returnList[self.returnList.length - 1]) {
                                    self.returnList.push(teamId);
                                }
                            } else {
                                self.returnList.push(teamId);
                            }
                            self.returnBtn.visible = true;
                        }
                        self.getWidget("Panel_title").visible = false;
                        self.getWidget("Panel_title1").visible = true;
                        if (self.findId == 7) {
                            self.refreshAllotList(data.message.teamList, configCount, viewTeamUser, myRate);
                        } else {
                            self.refreshTeamList(data.message.teamList, configCount, viewTeamUser, myRate);
                        }
                    }

                    if (data.message) {
                        var myScore = data.message.myCredit || 0;
                        var allScore = data.message.totalCredit || 0;
                        myScore = MathUtil.toDecimal(myScore / 100);
                        allScore = MathUtil.toDecimal(allScore / 100);
                        self.lbMyscore.setString("我的比赛分:" + myScore);
                        self.lbAllscore.setString("总比赛分:" + allScore);
                    }
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshTeamList: function (teamDataList, configCount, viewTeamUser, myRate) {
        if (!teamDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.ListView_mumber.removeAllItems();
        for (var index = 0; index < teamDataList.length; index++) {
            var teamItem = new ClubCreditTeamCell(teamDataList[index], this, index, configCount, viewTeamUser, myRate);
            this.ListView_mumber.pushBackCustomItem(teamItem);
        }
    },

    refreshAllotList: function (allotDataList, configCount, viewTeamUser, myRate) {
        if (!allotDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.ListView_mumber.removeAllItems();
        for (var index = 0; index < allotDataList.length; index++) {
            var allotItem = new ClubCreditAllotCell(allotDataList[index], this, index, configCount, viewTeamUser, myRate);
            this.ListView_mumber.pushBackCustomItem(allotItem);
        }
    },

    refreshMemberList: function (menberDataList) {
        if (!menberDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.ListView_mumber.removeAllItems();
        for (var index = 0; index < menberDataList.length; index++) {
            var memberItem = new ClubCreditMemberCell(menberDataList[index], this, index);
            this.ListView_mumber.pushBackCustomItem(memberItem);
        }
    },


    /**
     * 获取附属成员信息
     * 1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部Id
     */
    getTeamUserListData: function (searchNameOrId, curPage) {
        var page = curPage || this.chooseRankPage;
        var userId = "";
        if (searchNameOrId != "") {
            userId = this.inputName.getString();
        }
        var searchNameOrId = userId || "";
        page = page || this.curRankPage;
        var self = this;
        var teamId = ClickCreditTeamModel.getCurTeamId();
        if(this.findId == 1 || this.findId == 7){
            teamId = null;
        }
        NetworkJT.loginReq("groupActionNew", "teamUserList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: page,
            pageSize: this.maxPageSize,
            keyWord: searchNameOrId,
            targetUserId: teamId,
            orderByField: this.orderByField,//排序字段：1身份，2信用分
            orderByType: 3, //排序规则：//1升序，2降序
        }, function (data) {
            if (data) {
                if (self) {
                    //cc.log("getTeamUserListData",JSON.stringify(data));
                    var isShow = false;
                    self.getWidget("Panel_title").visible = true;
                    self.getWidget("Panel_title1").visible = false;
                    //self.findDownTeamBtn.visible = true;
                    if (data.message.userList.length > 0) {//获取当前页 有数据的情况
                        isShow = false;
                        self.curRankPage = self.chooseRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_mumber.removeAllChildren();
                    } else {
                        if (self.curRankPage == page) {
                            isShow = true;
                            self.ListView_mumber.removeAllChildren();
                        } else {
                            FloatLabelUtil.comText("没有更多数据了");
                            return;
                        }
                    }
                    self.showLbNoData(isShow);

                    self.refreshTeamUserList(data.message.userList);
                    // self.returnList.push(teamId);
                    if (teamId && teamId != PlayerModel.userId) {
                        if (self.returnList.length > 0) {
                            if (teamId != self.returnList[self.returnList.length - 1]) {
                                self.returnList.push(teamId);
                            }
                        } else {
                            self.returnList.push(teamId);
                        }
                        self.returnBtn.visible = true;
                    }
                    if (self.findId != 1)
                        self.returnBtn.visible = true;

                    if (data.message) {
                        var myScore = data.message.myCredit || 0;
                        var allScore = data.message.totalCredit || 0;
                        myScore = MathUtil.toDecimal(myScore / 100);
                        allScore = MathUtil.toDecimal(allScore / 100);
                        self.lbMyscore.setString("我的比赛分:" + myScore);
                        self.lbAllscore.setString("总比赛分:" + allScore);
                    }
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshTeamUserList: function (menberDataList) {
        if (!menberDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.ListView_mumber.removeAllItems();
        for (var index = 0; index < menberDataList.length; index++) {
            var memberItem = new ClubCreditMemberCell(menberDataList[index], this, index);
            this.ListView_mumber.pushBackCustomItem(memberItem);
        }
    },

    //消耗统计
    getGroupExpLogData: function (curPage) {
        var self = this
        var startDate = this.formatDataToSever(this.beginTime);
        var endDate = this.formatDataToSever(this.endTime, true);
        var page = curPage || this.curRankPage;
        var targetId = this.inputName.getString();//查询ID
        if (targetId == "") targetId = 0;
        NetworkJT.loginReq("groupActionNew", "loadGroupExpLog", {
            userId: PlayerModel.userId,
            groupId: ClickClubModel.getCurClubId(),
            pageNo: page,
            pageSize: this.maxPageSize,
            targetId: "" + targetId,
            sessCode: PlayerModel.sessCode,
            startDate: startDate,
            endDate: endDate,
        }, function (data) {
            if (data) {

                if (self) {
                    var isShow = false;
                    if (data.message.logList.length > 0) {//获取当前页 有数据的情况
                        isShow = false;
                        self.curRankPage = self.chooseRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_Winner.removeAllChildren();
                    } else {
                        if (self.curRankPage == page) {
                            isShow = true;
                            self.ListView_Winner.removeAllChildren();
                        } else {
                            FloatLabelUtil.comText("没有更多数据了");
                            return;
                        }
                    }

                    self.showLbNoData(isShow);
                    self.refreshGroupExpLog(data.message)
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        })
    },

    refreshGroupExpLog: function (message) {
        if (!message) {
            return;
        }

        this.getWidget("Label_xhtj_dqyy").setString("当前拥有:" + message.totalCredit / 100)
        this.getWidget("Label_xhtj_wjyy").setString("玩家拥有:" + message.masterCredit / 100)
        this.getWidget("Label_xhtj_xh").setString("消耗:" + message.consumeCredit / 100)

        this.ListView_Winner.removeAllItems();
        for (var i = 0; i < message.logList.length; i++) {
            var expItem = new ClubCreditConsumeCell(message.logList[i], this);
            this.ListView_Winner.pushBackCustomItem(expItem);
        }
    },

    /**
     * 获取上，下分信息
     * 1、userId：调用接口的用户id
     2、groupId：俱乐部id
     3、sessCode：调用接口的用户sessCode
     4、pageNo：当前页码
     5、pageSize：分页规则
     6、isPositive：0所有数据，1上分数据，-1下分数据
     7、keyWord：按用户id查找
     */
    getScoreListData: function (_idnex, curPage, operation) {
        var page = curPage || this.curRankPage;
        var idnex = _idnex || 1;
        var self = this;
        var date = this.date || 1;
        //cc.log("_idnex"+_idnex);
        this.isPositive = _idnex;
        var operations = operation || this.Operation;
        var userId = this.inputName.getString();//查询ID
        var isOnly = this.isOnly;
        if (isOnly) {
            userId = PlayerModel.userId;
        }

        var startDate = this.formatDataToSever(this.endTimeSingle);
        var endDate = this.formatDataToSever(this.endTimeSingle, true);

        NetworkJT.loginReq("groupActionNew", "loadCreditLog", {
            groupId: ClickClubModel.getCurClubId(),
            pageNo: page,
            pageSize: this.maxPageSize,
            keyWord: "" + userId,
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            isPositive: "" + idnex,
            //dateType:""+date,
            startDate: startDate,
            endDate: endDate,
            selectType: "" + operations
        }, function (data) {
            if (data) {
                if (self) {
                    var isShow = false;
                    if (data.message.list.length > 0) {//获取当前页 有数据的情况
                        isShow = false;
                        self.curRankPage = self.chooseRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_Winner.removeAllChildren();
                    } else {
                        if (self.curRankPage == page) {
                            isShow = true;
                            self.ListView_Winner.removeAllChildren();
                        } else {
                            FloatLabelUtil.comText("没有更多数据了");
                            return;
                        }
                    }

                    self.Operation = operations;
                    self.showLbNoData(isShow);
                    self.refreshScoreList(data.message.list, _idnex);
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshScoreList: function (scoreDataList, _idnex) {
        if (!scoreDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        var do_score = this.getWidget("do_score");
        var do_dname = this.getWidget("do_dname");
        var do_name = this.getWidget("do_name");
        var do_time = this.getWidget("do_time");
        if (_idnex == 1) {
            do_name.setString("操作人");
            do_dname.setString("被操作人");
            do_score.setString("操作分数");
            do_time.setString("操作时间");
        } else {
            do_name.setString("操作人");
            do_dname.setString("被操作人");
            do_score.setString("操作分数");
            do_time.setString("操作时间");
        }
        this.ListView_Winner.removeAllItems();
        for (var index = 0; index < scoreDataList.length; index++) {
            var memberItem = new ClubCreditScoreCell(scoreDataList[index], this, index);
            this.ListView_Winner.pushBackCustomItem(memberItem);
        }

    },

    /**
     * 老李要 20180123这样的日期 不要时间戳 喵了个咪
     */
    dealTimeToServer: function (shijianchuo) {
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + this.add0(m) + this.add0(d);
    },

    //参数dataTypes增加类型：creditCommisionCount：佣金，dyjCountCredit：信用分大赢家
    getRankListData: function (rankParams) {
        if (rankParams) {
            var pageNo = rankParams.pageNo || 1;
            var curBeginTime = rankParams.beginTime;
            var curEndTime = rankParams.endTime;
            var rankType = "creditCommisionCount";
        }

        var self = this;
        var userId = this.inputName.getString();
        var opGroupId = ClickClubModel.getCurClubId();
        NetworkJT.loginReq("dataAction", "loadGroupDataRank", {
            startDate: this.dealTimeToServer(curBeginTime),
            endDate: this.dealTimeToServer(curEndTime),
            dataCode: "group" + opGroupId,
            dataTypes: rankType,
            pageNo: pageNo,
            pageSize: this.maxRankPageSize,
            returnOne: this.returnOne,
            dataTypeSum: rankType,
            userIdKey: "" + userId
        }, function (data) {
            if (data) {
                //cc.log("getRankListData::"+JSON.stringify(data));
                var isShow = false;
                if (data[rankType].length > 0) {//获取当前页 有数据的情况
                    self.ListView_Winner.removeAllChildren();
                    var dataTypeSumValue = data.dataTypeSumValue || 0;
                    dataTypeSumValue = MathUtil.toDecimal(dataTypeSumValue / 100);
                    self.lbAllGmaes.setString("总赠送数:" + dataTypeSumValue);
                    self.curRankPage = self.chooseRankPage = data.pageNo || 1;
                    self.lbDataPage.setString(self.curRankPage);
                    isShow = false;

                } else {
                    if (self.curRankPage == pageNo) {
                        self.ListView_Winner.removeAllChildren();
                        isShow = true;
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                        isShow = false;
                    }
                }
                self.showLbNoData(isShow);

                for (var index = 0; index < data[rankType].length; index++) {
                    var rankItem = new ClubCreditGiveCell(data[rankType][index], (self.curRankPage - 1) * self.maxRankPageSize + index + 1, self);
                    self.ListView_Winner.pushBackCustomItem(rankItem);
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });


    },


    /**
     * 获取战绩数据
     * 增加参数：tableType  -1：全部，0：非比赛房，1：正常房 2：比赛房
     */
    getCreditRecordData: function (detailPage) {
        var self = this;
        sy.scene.showLoading("正在获取战绩数据");
        //var date = this.date;
        var page = detailPage;

        var startDate = this.formatDataToSever(this.beginTime);
        var endDate = this.formatDataToSever(this.endTime, true);
        NetworkJT.loginReq("groupActionNew", "loadTablePlayLogs", {
            sessCode: PlayerModel.sessCode,
            groupId: ClickClubModel.getCurClubId(),
            //queryDate:date,  //当前日期
            pageNo: page,  //当前页数
            pageSize: this.maxPageSize,
            condition: "" + this.condition,  //2 正常结束 , 3未开局被解散, 4中途解散
            queryUserId: this.searchUserId,
            queryTableId: this.searchTableId,
            userId: PlayerModel.userId,
            tableType: "" + 2,
            startDate: startDate,
            endDate: endDate,
            playLogsTag: 2
        }, function (data) {
            if (data) {
                sy.scene.hideLoading();
                var isShow = false;
                //cc.log("loadTablePlayLogs",JSON.stringify(data))
                if (data.message.list.length > 0) {//获取当前页 有数据的情况
                    isShow = false;
                    self.curRankPage = self.chooseRankPage = page;
                    self.lbDataPage.setString("" + self.curRankPage);
                    self.ListView_Winner.removeAllChildren();
                } else {
                    if (self.curRankPage == page) {
                        isShow = true;
                        self.ListView_Winner.removeAllChildren();
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                        return;
                    }
                }

                self.showLbNoData(isShow);

                self.updateAllGmaesStr(data.message.tables);
                for (var index = 0; index < data.message.list.length; index++) {
                    var listData = data.message.list[index];
                    var detailItem = new ClubCreditRecordCell(listData, index + 1, self);
                    self.ListView_Winner.pushBackCustomItem(detailItem);
                }
            }
        }, function (data) {
            sy.scene.hideLoading();
            FloatLabelUtil.comText("获取战绩数据失败");
        });


    },

    /**接口：groupAction!groupTeamCreditCommission
     *1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部id
     *4、dateType：时间：1：今天，2：昨天，3：前天
     * 返回：小组信用分佣金记录
     */
    getCreditCountData: function (searchNameOrId, curPage) {
        var searchNameOrId = searchNameOrId || "";
        var page = curPage || this.chooseRankPage;
        page = page || this.curRankPage;
        var self = this;
        //var date = this.date || 1;
        var startDate = this.formatDataToSever(this.endTimeSingle);
        var endDate = this.formatDataToSever(this.endTimeSingle, true);
        NetworkJT.loginReq("groupActionNew", "loadCreditCommissionLog", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            //dateType:""+date,
            pageNo: page,
            pageSize: this.maxPageSize,
            startDate: startDate,
            endDate: endDate,
            orderByType: 3,
            orderByField: this.orderByField
        }, function (data) {
            if (data) {
                if (self) {
                    self.getWidget("Panel_title5_1").visible = false;
                    self.getWidget("Panel_title5").visible = true;
                    var isShow = false;
                    cc.log("groupTeamCreditCommission", JSON.stringify(data))
                    if (data.message.dataList.length > 0) {//获取当前页 有数据的情况
                        isShow = false;
                        self.curRankPage = self.chooseRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_Winner.removeAllChildren();
                    } else {
                        if (self.curRankPage == page) {
                            isShow = true;
                            self.ListView_Winner.removeAllChildren();
                        } else {
                            FloatLabelUtil.comText("没有更多数据了");
                            return;
                        }
                    }
                    self.showLbNoData(isShow);
                    self.refreshCreditCountList(data.message.dataList);
                    if (data.message) {
                        var total = data.message.totalCommissionCredit || 0;
                        total = MathUtil.toDecimal(total / 100);
                        self.lbAllGmaes.setString("总赠送分:" + total);
                    }
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshCreditCountList: function (teamDataList) {
        if (!teamDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.ListView_Winner.removeAllItems();
        for (var index = 0; index < teamDataList.length; index++) {
            var teamItem = new ClubCreditCountItem(teamDataList[index], this, index);
            this.ListView_Winner.pushBackCustomItem(teamItem);
        }
    },


    /**接口：groupAction!groupTeamUserCreditCommission
     *1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部id
     *4、dateType：时间：1：今天，2：昨天，3：前天
     *5、userGroup：小组id
     *6、pageNo：第xx页
     *7、pageSize：分页条数
     *8、keyWord：成员探索关键词
     * 返回：小组成员信用分佣金记录
     */
    getCreditDetailData: function (teamId, curPage) {
        //var userId = searchNameOrId || this.inputName.getString();
        var searchNameOrId = 0;
        if (teamId) {
            searchNameOrId = teamId;
        }
        var self = this;
        var date = this.date || 1;
        var page = curPage || this.chooseRankPage;
        var startDate = this.formatDataToSever(this.endTimeSingle);
        var endDate = this.formatDataToSever(this.endTimeSingle, true);
        page = page || this.curRankPage;
        NetworkJT.loginReq("groupActionNew", "loadCreditCommissionLogByUser", {
            groupId: ClickClubModel.getCurClubId(),
            pageSize: this.maxPageSize,
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            //dateType:""+date,
            targetId: "" + searchNameOrId,
            pageNo: page,
            startDate: startDate,
            endDate: endDate
        }, function (data) {
            if (data) {
                if (self) {
                    self.getWidget("Panel_title5_1").visible = true;
                    self.getWidget("Panel_title5").visible = false;
                    var isShow = false;
                    if (data.message.dataList.length > 0) {//获取当前页 有数据的情况
                        isShow = false;
                        self.curRankPage = self.chooseRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_Winner.removeAllChildren();
                    } else {
                        if (self.curRankPage == page) {
                            isShow = true;
                            self.ListView_Winner.removeAllChildren();
                        } else {
                            FloatLabelUtil.comText("没有更多数据了");
                            return;
                        }
                    }
                    self.showLbNoData(isShow);

                    self.refreshCreditDetailList(data.message.dataList);

                    //var isShow = true;
                    //cc.log("loadCreditCommissionLogByUser",JSON.stringify(data))
                    //self.ListView_Winner.removeAllChildren();
                    //if(data.message && data.message.dataList) {//获取当前页 有数据的情况
                    //    isShow = false;
                    //    self.refreshCreditDetailList(data.message.dataList);
                    //}else{
                    //    FloatLabelUtil.comText("无赠送分记录");
                    //    return
                    //}
                    //self.showLbNoData(isShow);

                    //var teamId = ClickCreditTeamModel.getCurTeamId();
                    //if (teamId != null){
                    //    self.pageBg.visible = true;
                    //    self.pageBg.x = 304;
                    //    self.inputIdImg.visible = true;
                    //    self.findBtn.visible = true;
                    //    self.getWidget("Panel_title5_1").visible = true;
                    //    self.getWidget("Panel_title5").visible = false;
                    //}
                    //
                    if (data.message) {
                        var total = data.message.totalCommissionCredit || 0;
                        total = MathUtil.toDecimal(total / 100);
                        self.lbAllGmaes.setString("总赠送分:" + total);
                    }
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },


    refreshCreditDetailList: function (teamDataList) {
        if (!teamDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.ListView_Winner.removeAllItems();
        for (var index = 0; index < teamDataList.length; index++) {
            var teamItem = new ClubCreditDetailItem(teamDataList[index], this, index);
            this.ListView_Winner.pushBackCustomItem(teamItem);
        }
    },


    /**接口：groupAction!groupTeamUserCreditCommission
     *1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部id
     *4、dateType：时间：1：今天，2：昨天，3：前天
     *5、userGroup：小组id
     *6、pageNo：第xx页
     *7、pageSize：分页条数
     *8、keyWord：成员探索关键词
     * 返回：小组成员信用分佣金记录
     */
    onSearchCreditDetailData: function () {
        var searchNameOrId = this.inputName.getString() || "";
        var self = this;
        var date = this.date || 1;
        var startDate = this.formatDataToSever(this.endTimeSingle);
        var endDate = this.formatDataToSever(this.endTimeSingle, true);
        NetworkJT.loginReq("groupActionNew", "searchCreditCommissionLog", {
            groupId: ClickClubModel.getCurClubId(),
            //pageSize:this.maxPageSize,
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            //dateType:""+date,
            targetId: "" + searchNameOrId,
            startDate: startDate,
            endDate: endDate,
        }, function (data) {
            if (data) {
                if (self) {
                    self.getWidget("Panel_title5_1").visible = true;
                    self.getWidget("Panel_title5").visible = false;
                    var isShow = true;
                    cc.log("searchCreditCommissionLog", JSON.stringify(data))
                    self.ListView_Winner.removeAllChildren();
                    if (data.message && data.message.data) {//获取当前页 有数据的情况
                        isShow = false;
                        self.refreshCreditFindDetailList(data.message.data);
                    } else {
                        FloatLabelUtil.comText("无赠送分记录");
                        return
                    }
                    self.showLbNoData(isShow);

                    //var teamId = ClickCreditTeamModel.getCurTeamId();
                    //if (teamId != null){
                    //    self.pageBg.visible = true;
                    //    self.pageBg.x = 304;
                    //    self.inputIdImg.visible = true;
                    //    self.findBtn.visible = true;
                    //    self.getWidget("Panel_title5_1").visible = true;
                    //    self.getWidget("Panel_title5").visible = false;
                    //}
                    //
                    //if (data.message){
                    //    var total = data.message.totalCommissionCredit || 0;
                    //    self.lbAllGmaes.setString("总赠送分:"+total);
                    //}
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshCreditFindDetailList: function (teamDataList) {
        if (!teamDataList) {
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.ListView_Winner.removeAllItems();
        for (var index = 0; index < 1; index++) {
            var teamItem = new ClubCreditDetailItem(teamDataList, this, index);
            this.ListView_Winner.pushBackCustomItem(teamItem);
        }
    },


    updateAllGmaesStr: function (_num) {
        this.lbAllGmaes.setString("总条数:" + _num)
    },

    //显示暂无数据提示
    showLbNoData: function (_bool) {
        this.lbNoData.visible = _bool;
    },

    onFindDownTeam: function (obj) {
        this.findBtnIdnex = 3;
        this.inputName.setString("");
        this.getTeamListData("", 1);
    },

    //操作和被操作人查询
    onOperationClick: function (obj) {
        var temp = obj.temp;
        var values = [1, 2];
        this.Operation = temp;
        this.isOnly = 0;
        this.CheckBox_only.setSelected(false);
        if (this.findId == 8) {
            this.getGroupExpLogData(this.curRankPage, this.Operation)
        } else {
            this.getScoreListData(this.isPositive, this.curRankPage, this.Operation);
        }
    },

    //请求中途解散的数据
    onCheckBoxOnly: function (obj, type) {
        this.isOnly = 0;
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.isOnly = 1;
            this.Operation = 0;
            this.inputName.setString("");
        }
        if (this.findId == 4) {
            this.getScoreListData(this.isPositive, this.curRankPage);
        } else if (this.findId == 8) {

        }
    },

    showRuleText: function () {
        var str = "比赛房管理界面规则：" +
            "\n1、群主在设定下级分成时优先确定好选择分成模式（大赢家分成，参与分成）；" +
            "\n2、大赢家分成模式：由牌局的大赢家所对应的上级拉手或组长然后一级一级往上找上级最终到群主，每一级都按上级给下级的赠送分成设定值来进行赠送分的分配；" +
            "\n3、参与分成模式：在牌局中所有参与的成员找到对应上级拉手或组长然后各自一级级往上找上级最终到群主，每一级都按上级给下级的赠送分设定值来进行赠送分的分配；" +
            "\n4、群主、组长以及各级拉手需要对自己的下级进行按包厢玩法单独设定分成值，各级所拥有的可分配赠送分为上级设定值；" +
            "\n5、群主、管理员、组长以及各级拉手和普通成员可通过ID查询成员来给玩家上分，除群主和管理员外其他人只能查出自己关系链的成员包括上级和下级；" +
            "\n6、除群主管理员外其他组长、各级拉手以及普通成员都只开放上分功能，不能给玩家下分；" +
            "\n7、群主、组长以及各级拉手可通过ID查询自己下级信息，可单独对其进行分成设定；" +
            "\n8、在发展拉手页签中通过id查询出对应玩家后，若本身为自己组的成员则可以升级为拉手，若不在该亲友圈中需先拉人进组，若已经为自己的下级拉手则可删除拉手的操作；"
        this.labelTips.setString("" + str);
    },

    //查询提示
    onRule: function () {
        if (this.Panel_tips.isVisible()) {
            this.Panel_tips.visible = false;
        } else {
            this.Panel_tips.visible = true;
        }
    },

    //查询拉手
    onFoundBtn: function () {
        var userId = this.inputName1.getString();
        this.onSearchUser(userId);
    },

    onFindMenber: function (obj) {
        var temp = obj.temp;
        var userId = this.inputName.getString();
        if (userId && userId != "") {
            this.findBtnIdnex = temp;
            //this.findDownTeamBtn.visible = false;
            ClickCreditTeamModel.clearTeamData(null);
            //this.img_px1.visible = this.img_px2.visible = false;
            if (temp == 1) {
                if (this.findId == 6) {
                    this.getDetailUserList(1, this.inputName.getString());
                } else {
                    this.onSearchMember(userId, 1);
                }
            } else if (temp == 2) {
                this.getTeamListData(userId, 1);
            }
        }
    },

    /**
     * mode:1//查询拉手，
     */
    onSearchUser: function (userId) {
        var searchNameOrId = userId || "";
        var self = this;
        //cc.log("searchNameOrId",searchNameOrId)
        this.ListView_lashou.removeAllItems();
        NetworkJT.loginReq("groupActionNew", "searchUser", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            targetUserId: searchNameOrId,
            mode: 1
        }, function (data) {
            if (data && data.message) {
                //cc.log("searchUser",JSON.stringify(data))
                for (var index = 0; index < 1; index++) {
                    var teamItem = new ClubCreditHandleItem(data.message, self, searchNameOrId);
                    self.ListView_lashou.pushBackCustomItem(teamItem);
                }
                self.Image_myLeadTeam.visible = false;
                if (data.message.superior) {
                    self.Image_myLeadTeam.visible = true;
                    self.showMyLeaderTeam(data.message.superior)
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    /**
     * mode:/2查询成员
     */
    onSearchMember: function (userId, curPage) {
        var searchNameOrId = userId || "";
        var self = this;
        var page = curPage || this.chooseRankPage;
        page = page || this.curRankPage;
        //cc.log("searchNameOrId",searchNameOrId)
        this.ListView_lashou.removeAllItems();
        NetworkJT.loginReq("groupActionNew", "searchUser", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            keyWord: searchNameOrId,
            pageNo: page,  //当前页数
            pageSize: this.maxPageSize,
            mode: 2
        }, function (data) {
            if (data && data.message) {
                self.searchStr = searchNameOrId;
                cc.log("onSearchMember", JSON.stringify(data))
                self.getWidget("Panel_title").visible = true;
                self.getWidget("Panel_title1").visible = false;
                var isShow = false;
                if (data.message.dataList.length > 0) {//获取当前页 有数据的情况
                    isShow = false;
                    self.curRankPage = self.chooseRankPage = page;
                    self.lbDataPage.setString("" + self.curRankPage);
                    self.ListView_mumber.removeAllChildren();
                } else {
                    if (self.curRankPage == page) {
                        isShow = true;
                        self.ListView_mumber.removeAllChildren();
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                        return;
                    }
                }
                self.showLbNoData(isShow);

                if (data.message.dataList) {
                    for (var index = 0; index < data.message.dataList.length; index++) {
                        var dataList = data.message.dataList[index];
                        var memberItem = new ClubCreditMemberCell(dataList, self, index);
                        self.ListView_mumber.pushBackCustomItem(memberItem);
                    }
                }
                var isShow = true;
                if (data.message) {
                    isShow = false;
                }
                self.showLbNoData(isShow);
                self.Image_myLeadTeam.visible = false;
                if (data.message.superior) {
                    self.Image_myLeadTeam.visible = true;
                    self.showMyLeaderTeam(data.message.superior)
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },


    showMyLeaderTeam: function (superior) {
        if (superior) {
            this.getWidget("Label_teamName_0").setString("" + superior.userId);
            this.getWidget("Label_teamerName_0").setString("" + superior.userName);
        }
    },

    onChooseClick: function (obj, btn_temp) {
        var temp = obj.temp;
        var values = [1, 2, 3];
        for (var i = 1; i <= values.length; i++) {
            if (i != temp) {
                this["chooseBtn" + i].setBright(false);
            } else {
                this["chooseBtn" + i].setBright(true);
            }
        }
        this.Image_myLeadTeam.visible = false;
        this.Panel_fzls.visible = false;
        this.ListView_lashou.visible = false;
        this.ListView_lashou.removeAllItems();
        this.ListView_mumber.visible = false;
        this.getWidget("Panel_title").visible = false;
        this.getWidget("Panel_title1").visible = false;
        this.Panel_found.visible = true;
        this.inputName.setString("");
        this.inputName1.setString("");
        this.chooseRankPage = this.curRankPage = 1;
        if (temp == 1) {
            ClickCreditTeamModel.clearTeamData(null);
            this.ListView_mumber.visible = true;
            this.getWidget("Panel_title1").visible = true;
            if (btn_temp && btn_temp == 7) {
                this.getTeamListData();
            } else {
                this.onShowCreditItem(1, true);

            }
        } else if (temp == 2) {
            this.ListView_mumber.visible = true;
            this.getWidget("Panel_title").visible = true;
            this.getTeamUserListData();
        } else if (temp == 3) {
            ClickCreditTeamModel.clearTeamData(null);
            this.Panel_fzls.visible = true;
            this.ListView_lashou.visible = true;
            this.Panel_found.visible = false;
            this.showLbNoData(false);
        }
        this.chooseBtnIdnex = temp;
        this.findBtnIdnex = 0;
    },

    //设置团队预警
    onSzbsyj: function () {
        NetworkJT.loginReq("groupActionNew", "groupWarnList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: 1,
            pageSize: 10,
            keyWord: "",
        }, function (data) {
            if (data) {
                // cc.log("data =", JSON.stringify(data));
                PopupManager.addPopup(new MatchScoreWarningPop(data.message));
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },
    //修改分成
    changeAllotMode: function (temp) {
        var self = this;
        if (temp != self.allotMode) {
            NetworkJT.loginReq("groupActionNew", "updateAllotMode", {
                groupId: ClickClubModel.getCurClubId(),
                userId: PlayerModel.userId,
                sessCode: PlayerModel.sessCode,
                mode: temp
            }, function (data) {
                if (data) {
                    //cc.log("updateAllotMode",JSON.stringify(data));
                    //cc.log("temp",temp)
                    self.allotMode = temp;
                    var values = [1, 2];
                    for (var i = 1; i <= values.length; i++) {
                        if (i != temp) {
                            self["btnWay" + i].setBright(false);
                        } else {
                            self["btnWay" + i].setBright(true);
                        }
                    }
                    self.displayWays();
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        }
    },

    onWaysClick: function (obj) {
        var temp = obj.temp;
        var self = this;
        var str = "";
        if (temp == 1) {
            str = "修改分成模式为大赢家分成，确定修改吗？确定后需通知所有组长以及拉手及时修改赠送分成设置";
        } else {
            str = "修改分成模式为参与分成，确定修改吗？确定后需通知所有组长以及拉手及时修改赠送分成设置";
        }

        if (temp != this.allotMode) {
            AlertPop.show(str, function () {
                self.changeAllotMode(temp);
            });
        }
    },

    displayWays: function () {
        var values = [1, 2];
        for (var i = 1; i <= values.length; i++) {
            if (this.allotMode != values[i - 1]) {
                this["btnWay" + i].setBright(false);
            } else {
                this["btnWay" + i].setBright(true);
            }
        }
        if (!ClickClubModel.isClubCreater()) {
            for (var i = 1; i <= values.length; i++) {
                this["btnWay" + i].visible = false;
                if (this.allotMode == values[i - 1]) {
                    this["btnWay" + i].visible = true;
                }
            }

        }
    },


    addClickEvent: function (widgets, selector, defaultState) {
        var btnState = defaultState || false;
        for (var key in widgets) {
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget, this, selector);
            widget.setBright(btnState)
        }
    },

    addDtzClickEvent: function (widgets, selector) {
        for (var key in widgets) {
            var widget = this[key] = this.getWidget(key);
            //cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget, this, selector);
        }
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

    onClose: function () {
        PopupManager.remove(this);
    }

})