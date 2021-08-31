/**
 * Created by Administrator on 2017/7/21.
 */

/**
 * 群统计弹框
 */
var ClubStatisticsPop = BasePopup.extend({
    cytjCurPage: 1,
    maxCytjItem: 20,
    cytjItemArr: null,
    cytjData: null,
    rankField: 4,
    rankType: 1,
    qtjTime: 0,
    curQtjItemNum: 0,
    curQtjItem: [],
    curRankTargetId: 0,
    show_version:true,
    ctor: function () {
        this.cytjData = [];
        this.dataList = [];
        this.jstjData = null;
        this.curQtjItemNum = 0;
        this.curQtjItem = [];
        this.curRankTargetId = 0;

        this._super("res/clubStatisticsPop.json");//zqHome
    },

    selfRender: function () {

        this.membegImgLoad = new RemoteImageLoadQueue();
        this.scheduleUpdate();


        cc.sys.localStorage.setItem("sy_dn_beginTime", (0));
        cc.sys.localStorage.setItem("sy_dn_endTime", (0));
        cc.sys.localStorage.setItem("sy_dn_singleTime", (0));

        this.panel_switch1 = this.getWidget("panel_switch1");
        this.panel_switch2 = this.getWidget("panel_switch2");
        this.panel_switch3 = this.getWidget("panel_switch3");


        var ListView_qtj = this.ListView_qtj = this.getWidget("ListView_qtj");
        this.item_qtj = this.getWidget("item_qtj");


        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        this.touchPanel = this.getWidget("dataTouchPanel");
        this.touchPanel.setTouchEnabled(true);
        UITools.addClickEvent(this.touchPanel, this, this.onOpenSingleTimePop);


        this.label_begin = this.getWidget("label_begin");
        this.label_end = this.getWidget("label_end");
        this.endTime = this.getWidget("endTime");

        var curBeginTime = this.formartTimeStr(new Date().getTime());
        var curEndTime = this.formartTimeStr(new Date().getTime());
        var curSingleTime = this.formatTime(new Date().getTime());

        this.label_begin.setString(curBeginTime);
        this.label_end.setString(curEndTime);
        this.endTime.setString(curSingleTime);
        this.qtjTime = this.formartTimeStr(new Date().getTime());

        this.label_page = this.getWidget("label_page");
        this.btn_left_page = this.getWidget("btn_left");
        this.btn_right_page = this.getWidget("btn_right");
        UITools.addClickEvent(this.btn_left_page, this, this.onClickPageBtn);
        UITools.addClickEvent(this.btn_right_page, this, this.onClickPageBtn);

        var input_bg222 = this.getWidget("input_bg222");
        UITools.addClickEvent(input_bg222, this, this.onClickChangeTime);

        this.txtAllNumber = this.getWidget("txt_allNum");
        this.txtAllNumber.setColor(cc.color(101,11,12));/***修改字体字号*/

        this.ListView_role = this.getWidget("ListView_role");
        this.ListView_role.visible = true;

        this.item_role = this.getWidget("Button_role");
        this.item_role.visible = false;

        ////排序
        var widgetSort = {
            "txt_sort1": 1, "txt_sort2": 2, "txt_sort3": 3, "txt_sort4": 4, "txt_sort5": 5,
            "img_px1": 1, "img_px2": 2, "img_px3": 3, "img_px4": 4, "img_px5": 5
        };
        this.addDtzClickEvent(widgetSort, this.onClickSort);
        this.txt_sort4.setString("人次");

        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);
        this.addCustomEvent(SyEvent.RESET_SINGLE_TIME, this, this.changeSingleTime);


        var inputBg1 = this.getWidget("input_bg");
        inputBg1.visible = false;
        var inputBg2 = this.getWidget("input_bg_1");

        this.inputBox1 = new cc.EditBox(cc.size(inputBg1.width - 100, inputBg1.height - 10), new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox1.x = inputBg1.width / 2 - 40;
        this.inputBox1.y = inputBg1.height / 2;
        this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputBox1.setPlaceHolder("请输入关键词");
        this.inputBox1.setPlaceholderFont("Arial", 36);
        //this.inputBox.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg1.addChild(this.inputBox1, 1);
        this.inputBox1.setFont("Arial", 36);


        this.inputBox2 = new cc.EditBox(cc.size(inputBg2.width - 100, inputBg2.height - 10), new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox2.x = inputBg2.width / 2 - 40;
        this.inputBox2.y = inputBg2.height / 2;
        this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputBox2.setPlaceHolder("请输入关键词");
        this.inputBox2.setPlaceholderFont("Arial", 36);
        //this.inputBox.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg2.addChild(this.inputBox2, 1);
        this.inputBox2.setFont("Arial", 36);

        ////群统计
        var widgetSearch = {"btn_search": 1, "btn_search_1": 2};
        this.addDtzClickEvent(widgetSearch, this.onClickSearch);

        ////群统计
        var widgetChoose = {"btn_switch1": 1, "btn_switch2": 2, "btn_switch3": 3};
        this.addDtzClickEvent(widgetChoose, this.onClickSwitch);
        this.onClickSwitch(this.btn_switch1);
        this.btn_switch3.visible = ClickClubModel.isClubCreaterOrLeader() || false;

        this.label_ffhj = this.getWidget("label_ffhj");

    },


    onClickSearch: function (sender) {
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            sender.setTouchEnabled(true);
        })));

        if (sender.temp == 1) {
            this.getClubCommissionLog();
        } else {
            this.cytjCurPage = 1;
            this.getRankData(this.cytjCurPage, this.rankField, this.rankType);
        }

    },

    cleanUpItemData: function () {
        this.item_qtj.isLoadData = false;
        this.item_qtj.temp = 0;
        this.item_qtj.hideItemArr = [];
        this.item_qtj.showItemArr = [];
        this.item_qtj.curLevel = 1;
        this.item_qtj.isOpen = true;
        this.item_qtj.visible = true;
        this.dataList = [];
        this.jstjData = null;
        this.curQtjItemNum = 0;
        this.curQtjItem = [];
    },

    onClickSort: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1, 2, 3, 4, 5];

        var color1 = cc.color.YELLOW;
        var color2 = cc.color.WHITE;


        var img1 = "res/ui/bjdmj/popup/pyq/tongji/shang.png";
        var img2 = "res/ui/bjdmj/popup/pyq/tongji/xia.png";

        for (var i = 1; i <= values.length; i++) {
            var txt_sort = this["txt_sort" + i];
            var sortImg = txt_sort.getChildByName("img_px" + i);
            if (temp == i) {
                if (txt_sort.isUp == 0 || txt_sort.isUp == 1) {
                    txt_sort.isUp = 2;
                    sortImg.loadTexture(img2);
                } else if (txt_sort.isUp == 2) {
                    txt_sort.isUp = 1;
                    sortImg.loadTexture(img1);
                }
                this.rankField = temp;
                this.rankType = txt_sort.isUp;
                //cc.log("txt_sort.isUp==",txt_sort.isUp,this.rankField,this.rankType)
            } else {
                txt_sort.isUp = 1;
                sortImg.loadTexture(img2);
            }
            sortImg.setColor(temp == i ? color1 : color2);
        }

        this.getRankData(this.cytjCurPage, this.rankField, this.rankType);
    },

    onClickSwitch: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1, 2, 3];
        for (var i = 1; i <= values.length; i++) {
            var panel = this.getWidget("panel_switch" + i);
            if (i != temp) {
                this["btn_switch" + i].setBright(false);
                panel.visible = false;
            } else {
                panel.visible = true;
                this["btn_switch" + i].setBright(true);
            }
        }

        this.inputBox1.setString("");
        this.inputBox2.setString("");


        cc.sys.localStorage.setItem("sy_dn_beginTime", (0));
        cc.sys.localStorage.setItem("sy_dn_endTime", (0));
        cc.sys.localStorage.setItem("sy_dn_singleTime", (0));

        var curBeginTime = this.formartTimeStr(new Date().getTime());
        var curEndTime = this.formartTimeStr(new Date().getTime());
        var curSingleTime = this.formatTime(new Date().getTime());

        this.label_begin.setString(curBeginTime);
        this.label_end.setString(curEndTime);
        this.endTime.setString(curSingleTime);
        this.qtjTime = this.formartTimeStr(new Date().getTime());

        if (temp == 3) {
            this.getGamesCount();
        } else if (temp == 2) {
            this.getClubUserListAdmin()
        } else if (temp == 1) {
            this.getClubCommissionLog();
        }
    },

    /**
     * 获取下级信息
     */
    getClubUserListAdmin: function (userId) {
        cc.log("============getClubUserListAdmin===========");
        //我在当前俱乐部的身份 1群主 2管理员 5000董事 10000主管 20000管理 30000组长
        var allRoleArr = [
            {name: "所有成员", userRole: 0, userId: 0, userName: ""},
            {name: "会长", userRole: 1, userId: 0, userName: ""},
            {name: "管理", userRole: 2, userId: 0, userName: ""},
            {name: "董事", userRole: 5000, userId: 0, userName: ""},
            {name: "主管", userRole: 10000, userId: 0, userName: ""},
            {name: "管理", userRole: 20000, userId: 0, userName: ""},
            {name: "组长", userRole: 30000, userId: 0, userName: ""}
        ];
        var curUserId = userId || 0;
        var curRoleArr = [];
        var self = this;
        var params = {
            sessCode: PlayerModel.sessCode,
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            targetUserId: PlayerModel.userId
        }
        this.curRoleBtnArr = [];
        this.isFirst = true;
        sy.scene.showLoading("正在获取统计数据");
        NetworkJT.loginReq("groupActionNew", "userListAdmin", params, function (data) {
            sy.scene.hideLoading();
            if (data && data.code == 0 && data.message) {
                //cc.log("userListAdmin===",JSON.stringify(data));
                self.ListView_role.removeAllChildren();
                var userAdminList = data.message.adminList || [];
                curRoleArr.push(allRoleArr[0]);
                for (var i = 0; i < userAdminList.length; ++i) {
                    userAdminList[i].name = ClickClubModel.getClubRoleName(userAdminList[i].userRole,userAdminList[i].promoterLevel);
                    curRoleArr.push(userAdminList[i]);
                }
                //cc.log("curRoleArr==",JSON.stringify(curRoleArr))
                var curIndex = 0;
                for (var i = 0; i < curRoleArr.length; i++) {
                    var item = new PyqChenYuanItem(curRoleArr[i]);
                    item.setTouchEnabled(true);
                    self.ListView_role.pushBackCustomItem(item);
                    item.roleData = curRoleArr[i];
                    item.temp = i;
                    UITools.addClickEvent(item,self,self.onClickUserRoleBtn);
                    self.curRoleBtnArr[i] = item;
                    if (curUserId == curRoleArr[i].userId){
                        curIndex = i;
                    }
                }
                self.onClickUserRoleBtn(self.curRoleBtnArr[curIndex]);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });
    },

    onClickUserRoleBtn: function (sender) {
        for(var i = 0;i<this.curRoleBtnArr.length;i++){
            var btn = this.curRoleBtnArr[i];
            btn.refresh(sender == btn);
        }
        this.curRankTargetId = sender.roleData.userId || 0;
        if (this.isFirst) {
            this.isFirst = false;
            this.txt_sort4.isUp = 1;
            this.onClickSort(this.txt_sort4);
        } else {
            this.cytjCurPage = 1;
            this.getRankData(this.cytjCurPage, this.rankField, this.rankType);
        }
    },


    onClickPageBtn: function (sender) {
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            sender.setTouchEnabled(true);
        })));

        if (sender == this.btn_left_page && this.cytjCurPage > 1) {
            this.getRankData(this.cytjCurPage - 1, this.rankField, this.rankType);
        } else if (sender == this.btn_right_page && this.cytjCurPage < 25) {
            this.getRankData(this.cytjCurPage + 1, this.rankField, this.rankType);
        }
    },

    changeSearchTime: function (event) {
        var data = event.getUserData();
        var beginTime = this.formartTimeStr(data.beginTime);
        var endTime = this.formartTimeStr(data.endTime);

        this.label_begin.setString(beginTime);
        this.label_end.setString(endTime);

        cc.sys.localStorage.setItem("sy_dn_beginTime", (data.beginTime));
        cc.sys.localStorage.setItem("sy_dn_endTime", (data.endTime));

        this.getRankData(this.cytjCurPage, this.rankField, this.rankType);
    },

    changeSingleTime: function (event) {
        var data = event.getUserData();

        var endTime = this.formartTimeStr(data.endTime);

        var endSingleTime = this.formatTime(data.endTime);

        this.endTime.setString(endSingleTime);

        this.qtjTime = endTime;

        cc.sys.localStorage.setItem("sy_dn_singleTime", (data.endTime));
        this.getClubCommissionLog();
    },

    getGamesCount: function () {
        var self = this;
        sy.scene.showLoading("正在获取局数统计数据");
        NetworkJT.loginReq("groupActionNew", "loadTableCount", {
            sessCode: PlayerModel.sessCode,
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId
        }, function (data) {
            if (data) {
                //cc.log("===========getGamesCount=============="+JSON.stringify(data));
                sy.scene.hideLoading();
                self.jstjData = data.message.list;
                self.setJstjScroll(data.message.list);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });

    },

    setJstjScroll: function (data) {
        var scrollView = this.getWidget("scroll_zsxh");
        var item = this.getWidget("item_zsxh");

        var listNum = data.length + 1;

        var spaceH = 165;
        var contentH = Math.max(scrollView.height, spaceH * (listNum));
        scrollView.setInnerContainerSize(cc.size(scrollView.width, contentH));

        var panel = this.getWidget("panel_switch3");
        panel.getChildByName("label_no_data").setVisible(data.length <= 0);
        // cc.log("panelItem.curLevel111",JSON.stringify(data))
        var sum = 0;
        var zxhSum = 0;
        for (var i = 0; i < listNum; ++i) {
            var newItem = item;
            if (i > 0) {
                newItem = item.clone();
                scrollView.addChild(newItem);
            }
            newItem.y = contentH - (i + 0.5) * spaceH;
            newItem.visible = true;

            var label_time = newItem.getChildByName("time_label");
            var label_js = newItem.getChildByName("zsxh_label");
            var label_zxh = newItem.getChildByName("zxh_label");

            if (i == listNum - 1) {
                label_time.setString("合计");
                label_js.setString(sum);
                label_zxh.setString(zxhSum);
            } else {
                label_time.setString(data[i].ctime);
                label_js.setString(data[i].c || 0);
                label_zxh.setString(data[i].decDiamond || 0);

                sum += parseInt(data[i].c);
                zxhSum += parseInt(data[i].decDiamond);
            }
        }
    },

    getRankData: function (page, rankField, rankType) {
        page = page || 1;
        rankField = rankField || 1;
        rankType = rankType || 1;

        //cc.log("getRankData==========", page, rankField, rankType)
        //sy.scene.showLoading("正在获取统计数据");
        var self = this;
        var params = {
            sessCode: PlayerModel.sessCode,
            userId: PlayerModel.userId,
            startDate: self.label_begin.getString(),
            endDate: self.label_end.getString(),
            rankField: rankField,
            rankType: rankType,//1升序，2降序
            groupId: ClickClubModel.getCurClubId(),
            pageNo: page,
            pageSize: this.maxCytjItem,
            queryUserId: this.inputBox2.getString()
        }

        //13、排行统计
        //   接口：rankList
        //   参数：
        //groupId
        //   userId 自己的id
        //   startDate 日期，格式：20190801
        //   endDate 日期，格式：20190801
        //   rankField 1输赢信用分，2赠送分，3赠送次数，4总局数，5大赢家数，6总消耗
        //   rankType  1降序，2升序
        //   pageNo
        //   pageSize

        //targetId 查看的人的id,左边点击查看人
        //optType 查询类型：1所有成员，2指定人查询
        //   数据：
        //selfWinCredit 输赢信用分
        //   selfCommissionCredit 赠送分
        //   selfCommissionCount 赠送次数
        //   selfZjsCount 总局数
        //   selfDyjCount 大赢家数
        //   selfTotalPay 总消耗

        var curTargetId = this.curRankTargetId || 0;
        params.targetId = curTargetId;
        var curOptType = 1;
        if (curTargetId) {
            curOptType = 2;
        }
        params.optType = curOptType;
        NetworkJT.loginReq("groupActionNew", "rankList", params, function (data) {
            sy.scene.hideLoading();
            if (data) {
                //cc.log("=========rankList=============" + JSON.stringify(data));
                var tempData = data.message.dataList;
                var label_no_data = self.panel_switch2.getChildByName("label_no_data");
                label_no_data.setVisible(false);
                if (tempData.length > 0) {
                    self.cytjData = tempData;
                    self.cytjCurPage = page;
                    self.label_page.setString(page);
                } else {
                    if (page == 1) {
                        self.cytjData = [];
                        label_no_data.setVisible(true);
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                    }
                }
                self.txtAllNumber.setString("参与人数：" + (data.message.total || 0));
                self.setCytjScroll(self.cytjData);
                var Panel_info = self.panel_switch2.getChildByName("Panel_info");
                var Label_syf = Panel_info.getChildByName("Label_syf");
                var Label_cc = Panel_info.getChildByName("Label_cc");
                var Label_yj = Panel_info.getChildByName("Label_yj");
                var Label_zsf = Panel_info.getChildByName("Label_zsf");
                var Label_zscs = Panel_info.getChildByName("Label_zscs");

                Label_zsf.setVisible(ClickClubModel.isClubCreaterOrLeader());

                var txt_tip = ccui.helper.seekWidgetByName(self.panel_switch2, "txt_tip");
                if(params.targetId > 0){
                    txt_tip.setString("ID:" + params.targetId);
                }else{
                    txt_tip.setString("");
                }

                if (data.message.sumData){
                    var selfCommissionCredit = MathUtil.toDecimal((data.message.sumData.selfCommissionCredit || 0)/100);
                    var selfWinCredit = MathUtil.toDecimal((data.message.sumData.selfWinCredit || 0)/100);
                    Label_syf.setString(""+(selfWinCredit || 0));
                    Label_cc.setString(""+(data.message.sumData.selfZjsCount || 0));
                    Label_yj.setString(""+(data.message.sumData.selfDyjCount || 0));
                    Label_zsf.setString(""+ selfCommissionCredit);
                    Label_zscs.setString(""+(data.message.sumData.selfCommissionCount || 0));
                }else{
                    Label_syf.setString("0");
                    Label_cc.setString("0");
                    Label_yj.setString("0");
                    Label_zsf.setString("0");
                    Label_zscs.setString("0");
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });

    },

    setCytjScroll: function (data) {
        var scrollView = this.getWidget("scroll_cytj");
        var item = this.getWidget("item_cygl");
        item.getChildByName("label_idx").setFontName("res/font/bjdmj/fzcy.TTF");

        this.cytjItemArr = this.cytjItemArr || [item];

        var spaceH = 165;
        var contentH = Math.max(scrollView.height, spaceH * (data.length));
        scrollView.setInnerContainerSize(cc.size(scrollView.width, contentH));

        for (var i = 0; i < data.length; ++i) {
            var newItem = this.cytjItemArr[i];
            if (!newItem) {
                newItem = item.clone();
                this.cytjItemArr[i] = newItem;
                scrollView.addChild(newItem);
            }
            newItem.y = contentH - (i + 0.5) * spaceH;
            newItem.visible = true;
            //selfWinCredit 输赢信用分
            //   selfCommissionCredit 赠送分
            //   selfCommissionCount 赠送次数
            //   selfZjsCount 总局数
            //   selfDyjCount 大赢家数
            //   selfTotalPay 总消耗
            var img_head = ccui.helper.seekWidgetByName(newItem, "img_head");
            var user_name = ccui.helper.seekWidgetByName(newItem, "user_name");
            var user_id = ccui.helper.seekWidgetByName(newItem, "user_id");
            var jf_num = ccui.helper.seekWidgetByName(newItem, "jf_num");
            var cc_num = ccui.helper.seekWidgetByName(newItem, "cc_num");
            var dyj_num = ccui.helper.seekWidgetByName(newItem, "dyj_num");

            var bsf_num = ccui.helper.seekWidgetByName(newItem, "bsf_num");
            var zscs_num = ccui.helper.seekWidgetByName(newItem, "zscs_num");
            var label_idx = ccui.helper.seekWidgetByName(newItem, "label_idx");
            label_idx.setString((this.cytjCurPage - 1)*20 + i + 1);

            this.showIcon(img_head, data[i].headimgurl,data[i].userId);


            user_name.setString(UITools.truncateLabel(data[i].userName, 5));
            user_id.setString(data[i].userId);

            var selfCommissionCredit = MathUtil.toDecimal((data[i].selfCommissionCredit || 0) / 100);
            jf_num.setString("" + selfCommissionCredit);

            //jf_num.setString(data[i].selfCommissionCredit || 0);
            cc_num.setString(data[i].selfZjsCount || 0);
            dyj_num.setString(data[i].selfDyjCount || 0);

            var selfWinCredit = MathUtil.toDecimal((data[i].selfWinCredit || 0) / 100);
            bsf_num.setString("" + selfWinCredit);
            bsf_num.setColor(cc.color(217,23,37));
            zscs_num.setString(data[i].selfCommissionCount || 0);


        }

        for (; i < this.cytjItemArr.length; ++i) {
            this.cytjItemArr[i].setVisible(false);
        }
    },

    getClubCommissionLog: function () {

        var self = this;
        var qtjTime = this.qtjTime || "20190801";
        var params = {
            sessCode: PlayerModel.sessCode,
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            dataDate: "" + qtjTime
        }
        sy.scene.showLoading("正在群统计数据");
        NetworkJT.loginReq("groupActionNew", "commissionLog", params, function (data) {
            sy.scene.hideLoading();
            if (data && data.code == 0 && data.message) {
                //cc.log("commissionLog::"+JSON.stringify(data));
                self.ListView_qtj.removeAllItems();
                self.cleanUpItemData();
                self.dataList = data.message.dataList;
                self.curDataList = data.message.dataList;
                var rootUserId = data.message.rootId;
                self.dealDataList(rootUserId);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });
    },

    dealDataList: function (rootUserId) {
        var rootUserId = rootUserId || PlayerModel.userId;
        this.curTag = 1;
        for (var i = 0; i < this.curDataList.length; i++) {
            //cc.log("PlayerModel.userId==",PlayerModel.userId,this.curDataList[i].userId)
            if (rootUserId == this.curDataList[i].userId) {
                this.item_qtj.isLoadData = true;
                this.setItemQglData(this.item_qtj, this.curDataList[i]);
                this.curDataList.splice(i, 1);
                break;
            }
        }
        this.curQtjItemNum = this.curQtjItem.length;
        this.remainDataList(rootUserId, this.item_qtj, this.item_qtj);
    },


    remainDataList: function (curUserId, curItem, upItem) {
        var nowUserId = curUserId || PlayerModel.userId;
        for (var i = this.curDataList.length - 1; i >= 0; i--) {
            if (nowUserId == this.curDataList[i].promoterId) {
                this.changeNum = this.changeNum + 1;
                var item = this.showQtjItem(this.curDataList[i], curItem, upItem);
                curItem.showItemArr.push(item);
                this.updateCurQtjItem(item);
                this.curDataList.splice(i, 1);
            }
        }

    },

    isHasData: function (curUserId) {
        var isHasData = false;
        for (var i = 0; i < this.curDataList.length; i++) {
            if (curUserId == this.curDataList[i].promoterId) {
                isHasData = true;
                break;
            }
        }
        return isHasData;
    },

    getCurItemHideArr: function (curItem) {
        var hideItemArr = null;
        var itemUserIdArr = [];
        var curQtjItem = ArrayUtil.clone(this.curQtjItem);
        if (curItem.itemData && curItem.itemData.userId) {
            itemUserIdArr.push(curItem.itemData.userId);
        }
        if (curItem.hideItemArr && curItem.hideItemArr.length > 0 && this.curQtjItemNum != curQtjItem.length) {

        } else {
            if (itemUserIdArr && itemUserIdArr.length > 0) {
                hideItemArr = [];
                var curItemUserIdArr = [];
                var fib = function (userIdArr) {
                    //cc.log("dataList.length==",curQtjItem.length,userIdArr.length);
                    if (curQtjItem.length <= 0 || userIdArr.length <= 0) {
                        return hideItemArr;
                    }
                    curItemUserIdArr = [];
                    for (var i = userIdArr.length - 1; i >= 0; i--) {
                        for (var j = curQtjItem.length - 1; j >= 0; j--) {
                            if (userIdArr[i] == curQtjItem[j].itemData.promoterId) {
                                curItemUserIdArr.push(curQtjItem[j].itemData.userId);
                                hideItemArr.push(curQtjItem[j]);
                                curQtjItem.slice(j, 1);
                            }
                        }
                    }
                    return fib(curItemUserIdArr);
                }
                //cc.log(fib(itemUserIdArr));

                return fib(itemUserIdArr);
            }
        }
    },

    updateCurQtjItem: function (curItem) {
        if (curItem) {
            this.curQtjItem.push(curItem);
        }
    },

    showQtjItem: function (data, curItem, upItem) {
        var item = new ClubStatisticsPopItem(this);
        item.hideItemArr = [];
        item.showItemArr = [];
        item.isOpen = false;
        item.curLevel = 1;
        if (curItem && curItem.curLevel) {
            item.curLevel = curItem.curLevel + 1;
            if (item.curLevel > 4) {
                item.curLevel = 1;
            }
        }
        item.isLoadData = false;
        item.upItem = curItem || null;
        item.downItemArr = [];
        item.temp = 1;
        item.setItemQglData(data);
        var indexItem = this.ListView_qtj.getIndex(curItem);
        if (indexItem >= 0) {
            indexItem = indexItem + 1;
            this.ListView_qtj.insertCustomItem(item, indexItem);
        } else {
            this.ListView_qtj.pushBackCustomItem(item);
        }
        UITools.addClickEvent(item.Button_unfold,this,this.onClickUnfold);
        UITools.addClickEvent(item.Button_down,this,this.onClickCheckDown);
        return item;
    },

    onClickUnfold: function (sender) {
        var rootPanel = sender.rootPanel;
        this.changeNum = 0;
        var changePm = 1;
        if (rootPanel.isLoadData) {
            if (!sender.isBright()) {
                var hideItemArr = this.getCurItemHideArr(rootPanel) || rootPanel.hideItemArr;
                for (var j = 0; j < hideItemArr.length; j++) {
                    var hideItem = hideItemArr[j];
                    if (hideItem) {
                        hideItem.unfoldBtn.setBright(true);
                        hideItem.setContentSize(0, 0);
                        hideItem.visible = false;
                    }
                }
                rootPanel.isOpen = false;
                sender.setBright(true);
                this.changeNum = hideItemArr.length;
                changePm = -1;
            } else {
                for (var i = 0; i < rootPanel.showItemArr.length; i++) {
                    var showItem = rootPanel.showItemArr[i];
                    if (showItem) {
                        var curWidth = this.item_qtj.width || 0;
                        var curHeight = this.item_qtj.height || 0;
                        showItem.setContentSize(curWidth, curHeight);
                        showItem.visible = true;
                    }
                }
                rootPanel.isOpen = true;
                sender.setBright(false);
                this.changeNum = rootPanel.showItemArr.length;
            }
        } else {
            rootPanel.isOpen = true;
            rootPanel.isLoadData = true;
            sender.setBright(false);
            this.curQtjItemNum = this.curQtjItem.length;
            this.remainDataList(sender.itemData.userId, rootPanel, rootPanel.upItem);
        }
        var percent = this.GetScrollViewPercent(this.ListView_qtj,this.changeNum * changePm * this.item_qtj.height);
        this.ListView_qtj.refreshView();
        if (rootPanel.temp){
            this.ListView_qtj.jumpToPercentVertical(percent);
        }
    },


    //获取滚动层当前位置的百分比
    GetScrollViewPercent :function (scrollView,changeH) {
        if (scrollView == null){
            return 0
        }
        var size = scrollView.getInnerContainerSize();//内容区大小
        var inner = scrollView.getInnerContainer();
        var pos = inner.getPosition();
        var listSize = scrollView.getContentSize();//列表可见区域大小
        var percent = 100;//顶部是100，底部是0，所以用100去减偏移量只移动左下角，所以最大偏移量 = 总高度 - 列表可见区域
        var changeH = changeH || 0;
        if (size.height - listSize.height > 0){
            percent = 100 - Math.abs((pos.y - changeH)/ (size.height - listSize.height + changeH) * 100);
        }
        //cc.log("GetScrollViewPercent===",pos.y,size.height,listSize.height,percent,this.innerY4,changeH);
        return percent
    },

    setItemQglData:function(panelItem,data){
        var newItem = panelItem.getChildByName("img_qtjBg");
        var img_head = newItem.getChildByName("img_head");
        var user_name = newItem.getChildByName("user_name");
        var user_id = newItem.getChildByName("user_id");
        var Button_unfold = newItem.getChildByName("Button_unfold");
        var userRole_label = newItem.getChildByName("user_order");
        var user_consume = newItem.getChildByName("user_consume");
        var Image_winNum = newItem.getChildByName("Image_winNum");
        var user_winNum = Image_winNum.getChildByName("user_winNum");
        var user_status = newItem.getChildByName("user_status");
        var Button_down = newItem.getChildByName("Button_down");
        var user_dyjnum = newItem.getChildByName("user_dyjnum");
        var user_renci = newItem.getChildByName("user_renci");

        if(data.userId == PlayerModel.userId){
            this.label_ffhj.setString("负分合计:" + MathUtil.toDecimal((data.sumNegativeCredit || 0)/100));
        }

        var changeLabelParams = [];
        changeLabelParams.push(user_name);
        changeLabelParams.push(user_id);
        changeLabelParams.push(userRole_label);
        changeLabelParams.push(user_consume);
        changeLabelParams.push(user_winNum);
        changeLabelParams.push(user_status);
        changeLabelParams.push(user_dyjnum);
        changeLabelParams.push(user_renci);
        newItem.curLevel = panelItem.curLevel;
        this.changeLabelColor(newItem,changeLabelParams);

        panelItem.curLevel = panelItem.curLevel ||  0;

        //cc.log("panelItem.curLevel===",JSON.stringify(data));

        if (Button_unfold){
            Button_unfold.visible = this.isHasData(data.userId);
            Button_unfold.x = 57 + panelItem.curLevel * 8;
            userRole_label.x = Button_unfold.x + 50;
        }
        if (this.isOpen){
            Button_unfold.setBright(true);
        }else{
            Button_unfold.setBright(false);
        }
        userRole_label.setString(ClickClubModel.getClubRoleName(data.userRole,data.promoterLevel));

        var idStr = data.userId;
        var nameStr = data.userName;
        user_name.setString(UITools.truncateLabel(nameStr,5));
        user_id.setString("ID:" + idStr);

        var totalPay = MathUtil.toDecimal((data.totalPay || 0)/100);
        var sumCredit = MathUtil.toDecimal((data.sumCredit || 0)/100);
        user_consume.setString("" + totalPay);
        user_winNum.setString("" + sumCredit || 0);
        var credit = MathUtil.toDecimal((data.credit || 0)/100);
        user_status.setString("" + credit);
        user_dyjnum.setString("" + (data.dyjCount || 0));
        user_renci.setString("" + (data.zjsCount || 0));

        this.showIcon(img_head,data.headimgurl ,data.userId, 1);
        panelItem.itemData = data;
        Button_unfold.itemData = data;
        Button_down.itemData = Image_winNum.itemData = data;
        Button_down.temp = 2;
        Image_winNum.temp = 2;
        Button_unfold.rootPanel = panelItem;
        panelItem.unfoldBtn = Button_unfold;
        UITools.addClickEvent(Button_unfold,this,this.onClickUnfold);
        UITools.addClickEvent(Button_down,this,this.onClickCheckDown);
    },

    changeLabelColor:function(newItem,changeLabelParams){
        var roleColorArr = [
            {color:"7400b0",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao1.png",curLevel:1},
            {color:"b40505",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao2.png",curLevel:2},
            {color:"02790a",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao3.png",curLevel:3},
            {color:"5f4628",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao4.png",curLevel:4}
        ]

        var color = "7400b0";
        var imgPath = "res/ui/bjdmj/popup/pyq/statistics/tiao1.png";
        for(var j = 0;j < roleColorArr.length ;j++){
            if (newItem.curLevel == roleColorArr[j].curLevel){
                color = roleColorArr[j].color;
                imgPath = roleColorArr[j].imgPath;
                break;
            }
        }
        if (changeLabelParams){
            for(var i = 0;i < changeLabelParams.length ;i++){
                var label = changeLabelParams[i];
                if (label){
                    label.setColor(cc.color(color));
                }
            }
        }
        newItem.loadTexture(imgPath);
    },

    showIcon: function (imgNode,iconUrl,userId, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if (!SyConfig.IS_HEAD_LOAD) {
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
        }else{
            WXHeadIconManager.setWxHeadImg(userId,iconUrl,null,null,imgNode,1);
        }

    },

    onClickCheckDown:function(sender){
        var pop = new ClubStatisticsDownPop(sender.itemData,this ,sender.temp);
        PopupManager.addPopup(pop);
    },

    update: function(dt) {
        this.membegImgLoad.update(dt);
    },

    onOpenSingleTimePop:function(){
        var endTime = this.getLocalItem("sy_dn_singleTime") || 0;
        var mc = new ClubSingleTimePop(this  , endTime,3);
        PopupManager.addPopup(mc);
    },

    onClickChangeTime:function(){
        var beginTime = this.getLocalItem("sy_dn_beginTime") || 0;
        var endTime = this.getLocalItem("sy_dn_endTime") || 0;
        var mc = new ClubChoiceTimePop(this , beginTime , endTime,3);
        PopupManager.addPopup(mc);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    formartTimeStr:function(shijianchuo){
        var time = new Date(shijianchuo);

        var y = time.getFullYear();
        var m = time.getMonth()+1;
        m = m < 10 ? "0" + m : "" + m;
        var d = time.getDate();
        d = d < 10 ? "0" + d : "" + d;

        //var h = time.getHours();
        //var mm = time.getMinutes();
        //var s = time.getSeconds();
        return y+m+d;
    },

    formatTime:function(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        return this.add0(m)+'月'+this.add0(d)+'日'
    },


    add0:function(m){
        return m<10?'0'+m:m+'';
    },

    addDtzClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            //cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    onClose:function(){
        this.membegImgLoad.stopLoad();
        this.unscheduleUpdate();
        this._super();
    }

});

