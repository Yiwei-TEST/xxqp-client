/**
 * Created by leiwenwen on 2018/10/15.
 */
/**
 * 成员界面的item
 */
var ClubCreditMemberCell = ccui.Widget.extend({
    ctor:function(data,root,index){
        this.data = data;
        this.parentNode = root;

        this._super();
        this.setContentSize(1580, 156);

        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(1580,156),cc.color(126,49,2),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);
        var Image_bg=this.Image_bg= UICtor.cS9Img("res/ui/bjdmj/popup/pyq/tiao.png",cc.rect(50,50,50,50),cc.size(1580,156));
        Image_bg.setPosition(790,78);
        Panel_21.addChild(Image_bg);
        var Image_head=this.Image_head= UICtor.cImg("res/ui/common/default_m.png");
        Image_head.setPosition(cc.p(-700+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Image_head);
        var Label_name=this.Label_name= UICtor.cLabel("爱吃鱼的猫",40,cc.size(200,45),cc.color("#6f1816"),0,0);
        Label_name.setAnchorPoint(0,0.5);
        Label_name.setPosition(cc.p(Image_head.x + 70, 27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_name);
        var Label_id=this.Label_id= UICtor.cLabel("100",40,cc.size(0,0),cc.color(186,61,51),0,0);
        Label_id.setAnchorPoint(0,0.5);
        Label_id.setPosition(cc.p(Label_name.x, -27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_id);
        var Label_score=this.Label_score= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_score.setPosition(cc.p(-30+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_score);

        var Label_role=this.Label_role= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_role.setPosition(cc.p(-300+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_role);

        var upPlayerNameLabel = this.upPlayerNameLabel= UICtor.cLabel("000",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        upPlayerNameLabel.setPosition(cc.p(200+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y+27));
        Image_bg.addChild(upPlayerNameLabel);

        var upPlayerIdLabel = this.upPlayerIdLabel= UICtor.cLabel("000",40,cc.size(0,0),cc.color(186,61,51),0,0);
        upPlayerIdLabel.setPosition(cc.p(200+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y-27));
        Image_bg.addChild(upPlayerIdLabel);

        var Button_reduce=this.Button_reduce= UICtor.cBtn("res/ui/bjdmj/popup/pyq/bisai/jianshaojifen.png");
        Button_reduce.setPosition(cc.p(410+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Button_reduce);
        var Button_add=this.Button_add= UICtor.cBtn("res/ui/bjdmj/popup/pyq/bisai/zengjiajifen.png");
        Button_add.setPosition(cc.p(650+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Button_add);


        this.addChild(Panel_21);
        Panel_21.setTouchEnabled(true);
        UITools.addClickEvent(Panel_21, this, this.onTeamDetail);


        Button_reduce.visible = false;
        Button_add.visible = false;


        Button_reduce.temp = 1;
        UITools.addClickEvent(Button_reduce,this,this.onChange);
        Button_add.temp = 2;
        UITools.addClickEvent(Button_add,this,this.onChange);

        this.setData(data);

    },

    onTeamDetail: function () {
        if (this.userRole != 90000 && this.userRole != 2){
            var data = {};
            data.teamId = this.opUserId;
            ClickCreditTeamModel.init(data);
            // this.parentNode.onShowCreditItem(1, true);
            var mc = new clubChengYuanPop();
            PopupManager.addPopup(mc);
        }
    },

    upDateCreditNum: function(data) {
        //var data = event.getUserData();
        var temp = data.temp || 0;
        var num = data.num || 0;
        var numStr = Number(num);
        if (temp == 5){
            this.onHttpChange(""+numStr);
        }else if (temp == 6){
            this.onHttpChange("-"+numStr);
        }
    },

    //显示数据
    setData:function(data){
        this.opUserId = data.userId;
        this.userRole = data.userRole;
        //0不能操作 1可以上下分 2只可以上分 3只可以下分 ----这个参数有点无敌，很贴心
        var opType = data.opType || 0;
        var score = data.credit || 0;
        score = MathUtil.toDecimal(score/100);
        this.Label_name.setString(""+data.userName);
        this.Label_id.setString("ID:"+data.userId);
        this.Label_score.setString(""+score);
        this.showIcon(data.headimgurl , 1);
        this.headimgurl = data.headimgurl;
        cc.log("opType:::"+opType)

        this.Label_role.setString(""+ClickClubModel.getClubRoleName(data.userRole,data.promoterLevel));
        this.upPlayerIdLabel.setString(data.promoterId != 0|| data.promoterId != "" ? data.promoterId:"---");
        
        var preName = data.preName && data.preName != ""?data.preName:"---"
        this.upPlayerNameLabel.setString(UITools.truncateLabel(preName,6));

        if (opType == 1) {
            this.Button_reduce.visible = true;
            this.Button_add.visible = true;
        }else if (opType == 2) {
            this.Button_reduce.visible = false;
            this.Button_add.visible = true;
        }else if (opType == 3) {
            this.Button_reduce.visible = false;
            this.Button_add.visible = true;
        }else{
            this.Button_reduce.visible = false;
            this.Button_add.visible = false;
        }

        if (ClickClubModel.isClubCreaterOrLeader()){
            this.Button_add.visible = this.Button_reduce.visible = true;
        }else{
            // this.Button_add.visible = this.Button_reduce.visible = parseInt(data.promoterId) == parseInt(PlayerModel.userId);
        }

    },

    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = this.Image_head;
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if(icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)) {//头像不同才加载
            if (icon.getChildByTag(345)) {
                icon.removeChildByTag(345);
            }

            var sprite = new cc.Sprite(defaultimg);
            sprite.x = icon.width * 0.5;
            sprite.y = icon.height * 0.5;
            icon.addChild(sprite, 5, 345);
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        if (sprite) {
                            sprite.setTexture(img);
                            icon.curShowIconUrl = iconUrl
                        }
                    }
                });
            }
        }
    },

    //temp 5 加 6 减
    onInputNumber: function(temp) {
        var mc = new ClubCreditInputPop(temp,this);
        PopupManager.addPopup(mc);
    },


    onChange: function (obj) {
        var temp = obj.temp;
        if (temp == 2){
            this.onInputNumber(5);
        }else{
            this.onInputNumber(6);
        }
    },
    /**
    *1、credit：修改的信用分值，正数代表增加，负数代表减少
     2、sessCode：调用接口的用户sessCode
    * **/
    onHttpChange:function(num){
        var self = this;

        NetworkJT.loginReq("groupActionNew", "updateCredit", {
            destUserId:self.opUserId ,
            userId:PlayerModel.userId,
            groupId:ClickClubModel.getCurClubId(),
            credit:num,
            sessCode:PlayerModel.sessCode
        }, function (data) {
            if (data) {
                var score = data.message.credit || 0;
                FloatLabelUtil.comText("操作成功");
                //调用父节点的刷新
                if(self.parentNode){
                    var userId = self.parentNode.inputName.getString() || "";
                    //cc.log("userId",userId);
                    //Image_myLeadTeam
                    if (userId && userId != ""){
                        self.parentNode.onSearchMember(userId);
                    }else{
                        if ( ClickClubModel.isClubNormalMember()){
                            self.parentNode.getTeamListData();
                        }else{
                            self.parentNode.updateMeMberListData();
                        }

                    }
                }


            }
        }, function (data) {
            //FloatLabelUtil.comText("操作失败");
            FloatLabelUtil.comText(data.message);
        });

    },
})

var clubChengYuanPop = BasePopup.extend({
    ctor: function (userId) {
        this.allotMode = ClickClubModel.getClubAllotMode();
        this.initUserId = userId || null;
        //排行榜当前页码 , 最大页码
        this.curRankPage = 1;
        //排行榜当前页码 , 最大页码
        this.chooseRankPage = 1;

        this.findBtnIdnex = 0;

        this._super("res/clubChengYuanPop.json")
    },

    selfRender: function () {
        this.ListView_mumber = this.getWidget("ListView_mumber");
        //分成方式
        var widgetWays = { "txtWay1": 1, "btnWay1": 1, "txtWay2": 2, "btnWay2": 2 };
        this.addClickEvent(widgetWays, this.onWaysClick);
        this.displayWays(this.allotMode == 1 ? this.btnWay1 : this.btnWay2);

        var ruleBtn = this.getWidget("ruleBtn");//提示按钮
        UITools.addClickEvent(ruleBtn, this, this.onRule);

        this.Panel_tips = this.getWidget("Panel_tips");//显示提示弹框
        this.Panel_tips.visible = false;
        this.labelTips = this.getWidget("labelTips");//显示提示内容
        UITools.addClickEvent(this.Panel_tips, this, this.onRule);

        this.findmember_btn1 = this.getWidget("findmember_btn1");
        UITools.addClickEvent(this.findmember_btn1, this, this.onFindMenber);

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

        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbNoData = this.getWidget("labelNoData");

        this.lbMyscore = this.getWidget("lbMyscore");
        this.lbAllscore = this.getWidget("lbAllscore");


        UITools.addClickEvent(this.getWidget("btn_xiala"), this, this.onClickRadioXialaBtn);

        var btnRankLeft = this.getWidget("btnDataLeft");
        if (btnRankLeft) {
            UITools.addClickEvent(btnRankLeft, this, this.onDetailUpPage);
        }

        var btnRankRight = this.getWidget("btnDataRight");
        if (btnRankRight) {
            UITools.addClickEvent(btnRankRight, this, this.onDetailDownPage);
        }

        this.btn_szbsyj = this.getWidget("Button_szbsyj");
        this.btn_szbsyj.visible = false;
        UITools.addClickEvent(this.btn_szbsyj, this, this.onSzbsyj)

        this.initRuleText();

        if(this.initUserId){
            this.findBtnIdnex = 1;
            this.onSearchMember(this.initUserId,1);
        }else{
            this.getTeamUserListData("");
        }

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

    initRuleText: function () {
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

        NetworkJT.loginReq("groupActionNew", "teamUserList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: page,
            pageSize: 20,
            keyWord: searchNameOrId,
            targetUserId: teamId,
            orderByField: 1,//排序字段：1身份，2信用分
            orderByType: 3, //排序规则：//1升序，2降序
        }, function (data) {
            if (data) {
                if (self) {
                    //cc.log("getTeamUserListData",JSON.stringify(data));
                    var isShow = false;
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
            pageSize: 20,
            mode: 2
        }, function (data) {
            if (data && data.message) {
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
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    addClickEvent: function (widgets, selector) {
        for (var key in widgets) {
            var widget = this[key] = this.getWidget(key);
            //cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget, this, selector);
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

    //查询提示
    onRule: function () {
        if (this.Panel_tips.isVisible()) {
            this.Panel_tips.visible = false;
        } else {
            this.Panel_tips.visible = true;
        }
    },

    onFindMenber: function () {
        var userId = this.inputName.getString();
        if (userId && userId != "") {
            //this.findDownTeamBtn.visible = false;
            ClickCreditTeamModel.clearTeamData(null);
            var mc = new clubChengYuanPop(userId);
            PopupManager.addPopup(mc);
            // this.getTeamListData(userId, 1);
        }
    },

    //显示暂无数据提示
    showLbNoData: function (_bool) {
        this.lbNoData.visible = _bool;
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

    /**
 * 排行榜下翻
 */
    onDetailDownPage: function () {
        var detailPage = this.curRankPage + 1;
        //cc.log("获取下一页数据" , detailPage);
        var userId = this.inputName.getString();
        if (this.findBtnIdnex == 1) {
            this.onSearchMember(this.initUserId, detailPage)
        }else {
            this.getTeamUserListData(userId, detailPage);
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
        var userId = this.inputName.getString();
        //cc.log("this.findBtnIdnex ",this.findBtnIdnex )
        if (this.findBtnIdnex == 1) {
            this.onSearchMember(this.initUserId, detailPage)
        }else {
            this.getTeamUserListData(userId, detailPage);
        }
    },

    //刷新当前的比赛分界面
    updateMeMberListData: function () {
        this.getTeamUserListData();
    },
})