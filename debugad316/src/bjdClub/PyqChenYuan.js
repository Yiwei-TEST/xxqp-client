/**
 * Created by cyp on 2019/3/18.
 */
var PyqChenYuan = BasePopup.extend({
    pyqHall:null,
    cyglPageSize:20,
    curQtjRoleArr:[],
    show_version:true,
    ctor:function(pyqHall){

        this.pyqHall = pyqHall;
        this.sqglMsgData = [];
        this.cyglData = [];
        this.xxtzMsgData = [];

        this.searchData = "";

        this.cyglSortType = 1;

        this.targetUserId = 0;

        this.curQtjRoleArr = [];

        this.selectType = 0;
        this.queryUserId = 0;

        this.orderByField = 1;
        this.orderByType = 0;
        this.alertType = 0;
        this._super("res/pyqChenYuan.json");

    },


    selfRender:function(){
        this.membegImgLoad = new RemoteImageLoadQueue();
        this.scheduleUpdate();

        this.btn_cygl = this.getWidget("btn_cygl");
        this.btn_sqgl = this.getWidget("btn_sqgl");
        this.btn_xxtz = this.getWidget("btn_xxtz");
        this.btn_sqgl.setBright(false);
        this.btn_xxtz.setBright(false);

        this.getWidget("item_sqgl").setVisible(false);
        this.getWidget("item_cygl").setVisible(false);
        this.getWidget("item_xxtz").setVisible(false);

        this.panel_cygl = this.getWidget("panel_cygl");
        this.panel_sqgl = this.getWidget("panel_sqgl");
        this.panel_xxtz = this.getWidget("panel_xxtz");

        this.label_page = this.getWidget("label_page");
        this.btn_left_page = this.getWidget("btn_left");
        this.btn_right_page = this.getWidget("btn_right");
        UITools.addClickEvent(this.btn_left_page,this,this.onClickPageBtn);
        UITools.addClickEvent(this.btn_right_page,this,this.onClickPageBtn);

        this.label_page_xxtz = this.getWidget("label_page_xxtz");
        this.btn_left_page_xxtz = this.getWidget("btn_left_xxtz");
        this.btn_right_page_xxtz = this.getWidget("btn_right_xxtz");
        UITools.addClickEvent(this.btn_left_page_xxtz,this,this.onClickXXTZPageBtn);
        UITools.addClickEvent(this.btn_right_page_xxtz,this,this.onClickXXTZPageBtn);

        var inputIdImg = this.inputIdImg = this.getWidget("Image_inputBg");
        this.inputId = new cc.EditBox(cc.size(350, 65),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputId.setPosition(inputIdImg.width/2,inputIdImg.height/2 - 2);
        this.inputId.setDelegate(this);
        this.inputId.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputId.setMaxLength(30);
        this.inputId.setFont("Arial",40);
        this.inputId.setPlaceHolder("输入玩家ID");
        this.inputId.setPlaceholderFont("Arial" , 40);
        this.inputId.setFontColor(cc.color(255,255,255));
        inputIdImg.addChild(this.inputId,1);

        var Button_search_czr = this.getWidget("Button_search_czr");
        Button_search_czr.temp = 2
        var Button_search_cy = this.getWidget("Button_search_cy");
        Button_search_cy.temp = 1
        UITools.addClickEvent(Button_search_czr,this,this.onClickSearchBtn);
        UITools.addClickEvent(Button_search_cy,this,this.onClickSearchBtn);

        var scrollView_cygl = this.getWidget("item_scroll");
        scrollView_cygl.setBounceEnabled(true);

        var scrollView_xxtz = this.getWidget("item_scroll_xxtz");
        scrollView_xxtz.setBounceEnabled(true);

        var red_point = this.btn_sqgl.getChildByName("red_point");
        red_point.setVisible(ClickClubModel.isClubHasNewMsg());

        this.Label_onlineNum = this.getWidget("Label_onlineNum");
        this.Label_onlineNum.setString("");

        UITools.addClickEvent(this.btn_cygl,this,this.onClickTopBtn);
        UITools.addClickEvent(this.btn_sqgl,this,this.onClickTopBtn);
        UITools.addClickEvent(this.btn_xxtz,this,this.onClickTopBtn);

        this.onClickTopBtn(this.btn_cygl);

        var btn_add_player = this.getWidget("btn_add_player");
        var btn_invite_player = this.getWidget("btn_invite_player");
        var btn_kick_player = this.getWidget("btn_kick_player");
        btn_invite_player.visible = false;
        btn_kick_player.visible = ClickClubModel.isClubCreater();
        UITools.addClickEvent(btn_kick_player,this,this.onClickKickPlayer);
        UITools.addClickEvent(btn_add_player,this,this.onClickAddPlayer);
        UITools.addClickEvent(btn_invite_player,this,this.onClickInvitePlayer);

        UITools.addClickEvent(this.getWidget("btn_last_login"),this,this.onClickLastLogin);
        UITools.addClickEvent(this.getWidget("btn_search"),this,this.onClickSearch);

        var inputBg = this.getWidget("input_bg");

        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        this.inputBox = new cc.EditBox(cc.size(inputBg.width - 90, inputBg.height - 20),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = inputBg.width/2 - 40;
        this.inputBox.y = inputBg.height/2;
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputBox.setPlaceHolder("查询成员ID");
        this.inputBox.setPlaceholderFont("",36);
        //this.inputBox.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg.addChild(this.inputBox,1);
        this.inputBox.setFont("",36);

        this.ListView_role = this.getWidget("ListView_role");
        this.ListView_role.visible = true;

        this.item_role = this.getWidget("Button_role");
        this.item_role.visible = false;

        this.addCustomEvent(SyEvent.UPDATE_ROLE_LIST,this,this.updateRoleList);

        var input_bg_hhr = this.getWidget("input_bg_hhr");

        this.inputBox_hhr = new cc.EditBox(cc.size(input_bg_hhr.width - 90, input_bg_hhr.height - 20),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox_hhr.x = input_bg_hhr.width/2 - 40;
        this.inputBox_hhr.y = input_bg_hhr.height/2;
        this.inputBox_hhr.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputBox_hhr.setPlaceHolder("查询合伙人ID");
        this.inputBox_hhr.setPlaceholderFont("",36);
        //this.inputBox_hhr.setPlaceholderFontColor(cc.color(139,123,108));
        input_bg_hhr.addChild(this.inputBox_hhr,1);
        this.inputBox_hhr.setFont("",36);

        this.btn_role_back = this.getWidget("btn_role_back");
        this.btn_role_back.setVisible(false);

        UITools.addClickEvent(this.getWidget("btn_search_hhr"),this,this.onClickSearchHhr);
        UITools.addClickEvent(this.btn_role_back,this,this.onClickRoleBack);

        var curUserid = 0;
        if (!ClickClubModel.isClubCreaterOrLeader()){
            curUserid = PlayerModel.userId;
        }
        //this.getClubMenberListData();
        this.getClubUserListAdmin(curUserid);

        if(ClickClubModel.isClubCreaterOrLeader()){
            this.getClubMessageListData();
            this.getClubInformateListData(1);
        }else{
            this.btn_xxtz.visible = false;
            this.btn_sqgl.setVisible(false);
            btn_add_player.setVisible(false);
        }
        //btn_invite_player.setVisible(!ClickClubModel.isClubNormalMember());

        this.btn_timeSort = this.getWidget("img_px");
        UITools.addClickEvent(this.btn_timeSort,this,this.onSortsClick);

        this.item_xiala = this.getWidget("item_xiala");
        UITools.addClickEvent(this.item_xiala.getChildByName("btn_xiala"),this,this.onClickXialaBtn);

    },

    onClickXialaBtn:function(){
        var pop = new ClubChangeAlertTypePop(this,this.alertType);
        PopupManager.addPopup(pop);
    },

    onClickSearchBtn:function(sender){
        this.queryUserId = this.inputId.getString();
        this.selectType = sender.temp;
        if(this.queryUserId == ""){
            this.selectType = 0;
        }

        this.getClubInformateListData(1);
    },

    onClickXXTZPageBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));


        if(sender == this.btn_left_page_xxtz && this.xxtzPage > 1){
            this.getClubInformateListData(this.xxtzPage - 1);
        }else if(sender == this.btn_right_page_xxtz && this.xxtzPage <= this.allPages){
            this.getClubInformateListData(this.xxtzPage + 1);
        }else{
            FloatLabelUtil.comText("没有更多页数了！");
        }
    },
    onClickPageBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(sender == this.btn_left_page && this.curPage > 1){
            if (this.searchData != ""){
                this.getClubSearchUserList(this.curPage - 1,this.searchData);
            }else{
                this.getClubUserListNextLevel(this.curPage - 1,"",this.targetUserId)
            }

        }else if(sender == this.btn_right_page && this.curPage < 25){
            if (this.searchData != ""){
                this.getClubSearchUserList(this.curPage + 1,this.searchData);
            }else{
                this.getClubUserListNextLevel(this.curPage + 1,"",this.targetUserId)
            }
        }

        //if(sender == this.btn_left_page && this.curPage > 1){
        //    this.getClubMenberListData(this.curPage - 1,this.inputBox.getString());
        //}else if(sender == this.btn_right_page && this.curPage < 25){
        //    this.getClubMenberListData(this.curPage + 1,this.inputBox.getString());
        //}
    },

    update: function(dt) {
        this.membegImgLoad.update(dt);
    },

    changeAlertType:function(alertType){

        var str = "全部";
        var configArr = ["全部","邀请","申请","踢出"];
        if(configArr[alertType]){
            str = configArr[alertType];
        }
        this.item_xiala.getChildByName("label_xiala").setString(str);

        this.alertType = alertType;
        this.getClubInformateListData(1);
    },

    /**
     * 获取通知消息
     */
    getClubInformateListData:function(curPage){
        curPage = curPage || 1;
        var self = this;
        //这协议定的我醉了 身份是0或者1(管理员或者群主)传1给后台 身份是2 传0给后台。我就不能传身份给你么？！
        NetworkJT.loginReq("groupActionNew", "loadGroupUserAlert", {
                groupId:ClickClubModel.getCurClubId(),
                userId:PlayerModel.userId,
                pageNo:curPage,
                sessCode:PlayerModel.sessCode,
                pageSize:20,
                queryUserId:this.queryUserId,
                selectType:this.selectType,
                alertType:this.alertType
            },
            function (data) {
                self.xxtzPage = data.message.pageNo;
                self.cyglData = data.message.list;
                self.label_page_xxtz.setString(curPage);
                self.allPages = data.message.pages;
                self.setXxtzScroll(data?data.message.list:[]);
            }, function (data) {
            });
    },
    
    onClose:function(){
        this.membegImgLoad.stopLoad();
        this.unscheduleUpdate();
        this._super();
    },

    /**
     * 获取申请消息
     */
    getClubMessageListData:function(){
        var self = this;
        //这协议定的我醉了 身份是0或者1(管理员或者群主)传1给后台 身份是2 传0给后台。我就不能传身份给你么？！
        NetworkJT.loginReq("groupAction", "searchGroupReview", {
                groupId:ClickClubModel.getCurClubId(),
                msgType:1,
                userId:PlayerModel.userId},
            function (data) {
                self.setSqglScroll(data?data.message:[]);

                var red_point = self.btn_sqgl.getChildByName("red_point");
                red_point.setVisible(data?(data.message.length > 0):false);

            }, function (data) {
            });
    },


    updateRoleList:function(event){
        var data = event.getUserData();
        var userId = data.userId;
        this.getClubUserListAdmin(userId);
    },

    /**
     * 获取新的成员信息
     */
    getClubUserListAdmin:function(userId,userId_hhr){
        //cc.log("============getClubUserListAdmin===========");

        //我在当前俱乐部的身份 1群主 2管理员 5000董事 10000主管 20000管理 30000组长
        var allRoleArr = [
            {name:"所有成员",userRole:0,userId:0,userName:""},
            {name:"会长",    userRole:1,userId:0,userName:""},
            {name:"管理",  userRole:2,userId:0,userName:""},
            {name:"董事",    userRole:5000,userId:0,userName:""},
            {name:"主管",    userRole:10000,userId:0,userName:""},
            {name:"管理",    userRole:20000,userId:0,userName:""},
            {name:"组长",    userRole:30000,userId:0,userName:""}
        ];
        var curUserId = userId || 0;
        var curRoleArr = [];
        var self = this;
        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            targetUserId:PlayerModel.userId,
            optType:1
        }

        if(userId_hhr){
            params.keyWord = userId_hhr;
        }

        sy.scene.showLoading("获取成员信息");
        NetworkJT.loginReq("groupActionNew", "userListAdmin",params , function (data) {
            sy.scene.hideLoading();
            if (data && data.code == 0 && data.message) {
                //cc.log("*************getClubUserListAdmin************");
                //cc.log("userListAdmin===",JSON.stringify(data));
                var userAdminList = data.message.adminList || [];

                if(userId_hhr && userAdminList.length <= 0){
                    FloatLabelUtil.comText("查询数据为空");
                    return;
                }

                self.ListView_role.removeAllChildren();
                self.curRoleBtnArr = [];

                if (ClickClubModel.isClubCreaterOrLeader() && !userId_hhr){
                    curRoleArr.push(allRoleArr[0]);
                }
                for(var i = 0;i < userAdminList.length;++i){
                    userAdminList[i].name = ClickClubModel.getClubRoleName(userAdminList[i].userRole,userAdminList[i].promoterLevel);
                    curRoleArr.push(userAdminList[i]);
                }

                //cc.log("curRoleArr==",JSON.stringify(curRoleArr))
                var curIndex = 0;
                for(var i = 0;i < curRoleArr.length;i++){
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

                if(userId_hhr){
                    self.btn_role_back.setVisible(true);
                }

                self.curQtjRoleArr = curRoleArr || [];
                self.onClickUserRoleBtn(self.curRoleBtnArr[curIndex]);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });
    },

    onSortsClick:function(){
        var color1 = cc.color.YELLOW;
        var img1 = "res/ui/bjdmj/popup/pyq/tongji/shang.png";
        var img2 = "res/ui/bjdmj/popup/pyq/tongji/xia.png";
        this.orderByType = this.orderByType == 1 ? 2 : 1;
        this.orderByField = 2
        this.btn_timeSort.loadTexture(this.orderByType == 1 ? img2:img1)
        this.btn_timeSort.setColor(color1)
        this.getClubUserListNextLevel(1,"",this.curUserId);
    },

    onClickUserRoleBtn:function(sender){
        for(var i = 0;i<this.curRoleBtnArr.length;i++){
            var btn = this.curRoleBtnArr[i];
            btn.refresh(sender == btn);
        }
        this.orderByField = 1;
        this.orderByType = 0;
        this.btn_timeSort.loadTexture("res/ui/bjdmj/popup/pyq/tongji/xia.png")
        this.btn_timeSort.setColor(cc.color.WHITE)
        var userId = sender.roleData.userId;
        this.curUserId = userId
        this.getClubUserListNextLevel(1,"",userId);
    },
    /**
     * 获取成员信息
     */
    getClubMenberListData:function(curPage , searchNameOrId){
        cc.log("============getClubMenberListData===========");
        var curPage = curPage || 1;
        var searchNameOrId = searchNameOrId || "";
        this.membegImgLoad.stopLoad();
        var self = this;

        var params = {
            groupId:ClickClubModel.getCurClubId(),
            pageNo:curPage,pageSize:this.cyglPageSize,
            keyWord:searchNameOrId,
            userId:PlayerModel.userId,
            orderRule:this.cyglSortType == 1?"desc":"asc"
        }

        sy.scene.showLoading("获取成员信息");
        NetworkJT.loginReq("groupAction", "loadGroupUsers",params , function (data) {
            sy.scene.hideLoading();
            if (data) {
                cc.log("loadGroupUsers::"+JSON.stringify(data));

                if(data.message.list.length > 0){
                    self.curPage = curPage;
                    self.label_page.setString(curPage);
                    self.cyglData = data.message.list;
                }else{
                    FloatLabelUtil.comText("没有更多数据了");
                }
                self.setCyglScroll(self.cyglData);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });
    },

    /**
     * 获取新的成员信息
     */
    getClubUserListNextLevel:function(curPage , searchNameOrId,targetUserId){
        //cc.log("============getClubUserListNextLevel===========",targetUserId);
        //targetUserId = "329230";
        var curPage = curPage || 1;
        var searchNameOrId = searchNameOrId || "";
        var curTargetUserId = targetUserId || "";
        this.membegImgLoad.stopLoad();
        var self = this;

        this.searchData = "";

        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            pageNo:curPage,
            pageSize:this.cyglPageSize,
            keyWord:searchNameOrId,
            userId:PlayerModel.userId,
            targetUserId:curTargetUserId,
            orderByField:this.orderByField,
            orderByType:this.orderByType
            //orderRule:this.cyglSortType == 1?"desc":"asc"
        }

        this.targetUserId = curTargetUserId  || 0 ;
        //sy.scene.showLoading("获取成员信息");
        NetworkJT.loginReq("groupActionNew", "userListNextLevel",params , function (data) {
            //sy.scene.hideLoading();
            if (data && data.code == 0 && data.message) {
                //cc.log("userListNextLevel::"+JSON.stringify(data));
                if(data.message.userList.length > 0){
                    self.cyglData = data.message.userList;
                    self.curPage = curPage;
                    self.label_page.setString(curPage);
                }else{
                    if (curPage == 1){
                        self.cyglData = data.message.userList;
                    }
                    FloatLabelUtil.comText("没有更多数据了");
                }
                self.Label_onlineNum.setString("");
                var onlineNum = data.message.onLineCount || 0;
                var allNum = data.message.totalUserCount || 0;
                if (allNum){
                    self.Label_onlineNum.setString("在线人数："+ onlineNum + "/" + allNum);
                }
                self.setCyglScroll(self.cyglData,curTargetUserId);
            }
        }, function (data) {

            if(data.message && data.message.indexOf("禁止游戏") >= 0){
                AlertPop.showOnlyOk(data.message,function(){
                    PopupManager.remove(self);
                });
                return;
            }

            FloatLabelUtil.comText(data.message);
        });
    },
     /**
     * 显示消息通知信息
     */
    setXxtzScroll:function(data){
        this.xxtzMsgData = data;
        var scrollView = this.getWidget("item_scroll_xxtz");
        var item = this.getWidget("item_xxtz");
        item.setVisible(false);

        this.xxtzItemArr = this.xxtzItemArr || [item];

        var listNum = data.length;
        var spaceH = 165;

        var contentH = Math.max(scrollView.height,spaceH*listNum);
        scrollView.setInnerContainerSize(cc.size(scrollView.width,contentH));

        for(var i = 0;i<listNum;++i){
            var newItem = this.xxtzItemArr[i];
            if(!newItem){
                newItem = item.clone();
                this.xxtzItemArr[i] = newItem;
                scrollView.addChild(newItem);
            }
            newItem.setVisible(true);
            newItem.y = contentH - (i+0.5)*spaceH;
            var user_name = newItem.getChildByName("user_name");
            var user_id = newItem.getChildByName("user_id");
            var img_head = newItem.getChildByName("img_head");
            var user_name_caozuo = newItem.getChildByName("user_name_cazuo");
            var user_name_2 = newItem.getChildByName("user_name_2");
            var user_name_end = newItem.getChildByName("user_name_end");
            //1、userId同意optUserId的邀请，2、optUserId同意userId的申请，3、optUserId踢出userId
            this.showIcon(img_head,data[i].headimgurl);
            user_name.setString(data[i].otpUserName + " (" + data[i].optUserId + ") ");
            user_name_2.setString(data[i].userName + " ("+ data[i].userId + ") ");
            if(data[i].type == 1){
                user_name_caozuo.setString("邀请 ");
                user_name_end.setString("加入亲友圈");
            }else if(data[i].type == 2){
                user_name_caozuo.setString("同意 ");
                user_name_end.setString("申请加入亲友圈");
            }else if(data[i].type == 3){
                user_name_caozuo.setString("踢出 ");
                user_name_end.setString("亲友圈");
            }
            user_name_caozuo.x = user_name.x + user_name.width + 5;
            user_name_2.x = user_name_caozuo.x + user_name_caozuo.width + 5;
            user_name_end.x = user_name_2.x + user_name_2.width + 5;
            var logTime = this.getFormatTime(data[i].createdTime).slice(0,10) + "  " + this.getFormatTime(data[i].createdTime).slice(-9);
            user_id.setString(logTime);
        }

        for(;i<this.xxtzItemArr.length;++i){
            this.xxtzItemArr[i].setVisible(false);
        }

        if(data.length <=0){
            this.showLayerTip(scrollView,"暂无通知消息");
        }else{
            if(scrollView.getChildByName("layerTip")){
                scrollView.removeChildByName("layerTip");
            }
        }
    },


    /**
     * 搜索成员信息
     */
    getClubSearchUserList:function(curPage , searchNameOrId){
        cc.log("============getClubSearchUserList===========");
        var curPage = curPage || 1;
        var searchNameOrId = searchNameOrId || "";
        this.membegImgLoad.stopLoad();
        var self = this;

        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            pageNo:curPage,
            pageSize:this.cyglPageSize,
            keyWord:searchNameOrId,
            userId:PlayerModel.userId
        }

        //sy.scene.showLoading("获取成员信息");
        NetworkJT.loginReq("groupActionNew", "searchUserList",params , function (data) {
            sy.scene.hideLoading();
            if (data && data.code == 0 && data.message) {
                if(data.message.userList.length > 0){
                    self.curPage = curPage;
                    self.label_page.setString(curPage);
                    self.cyglData = data.message.userList;
                }else{
                    FloatLabelUtil.comText("没有更多数据了");
                }
                self.setCyglScroll(self.cyglData);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });
    },

    sortCyglData:function(){
        if(!this.cyglData)return;
        //cc.log("===========sortCyglData=============" + this.cyglSortType);

        var cmpFunc = function(a,b){
            if(a.userRole == 0 || a.userRole == 1 || b.userRole == 0 || b.userRole == 1)return false;
            return a.logTime > b.logTime;
        }
        if(this.cyglSortType == 2){
            cmpFunc = function(a,b){
                if(a.userRole == 0 || a.userRole == 1 || b.userRole == 0 || b.userRole == 1)return false;
                return a.logTime < b.logTime;
            }
        }
        this.cyglData = SortUtil.shellSort(this.cyglData,cmpFunc);
    },

    onClickAddPlayer:function(){
        PopupManager.addPopup(new ClubAddPlayerPop(ClickClubModel.getCurClubId()));
    },

    onClickKickPlayer:function(){
        if (ClickClubModel.isClubCreater()){
            var mc = new ClubKickPlayerPop();
            PopupManager.addPopup(mc);
        }else{
            FloatLabelUtil.comText("没有权限");
        }
    },

    onClickInvitePlayer:function(){
        var obj = {};
        obj.tableId = "123456";
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?num=' + "123456" + '&userId=' + encodeURIComponent(PlayerModel.userId);
        obj.title = "请加入亲友圈ID:"+"["+ClickClubModel.getCurClubId()+"]";
        obj.description = "我创建了一个亲友圈["+ ClickClubModel.getCurClubName()  + "]，诚邀各位牌友加入！";
        obj.shareType = 1;
        //cc.log("obj.title"+ obj.title);
        //cc.log("obj.description"+ obj.description);
        SdkUtil.sdkFeed(obj,true);
    },

    onClickLastLogin:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        this.cyglSortType = this.cyglSortType == 1?2:1;
        this.getClubMenberListData(1,this.inputBox.getString());
    },

    onClickSearch:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        var searchData = this.inputBox.getString();
        if (searchData != ""){
            this.searchData = searchData;
            this.inputBox.setString("");
            this.getClubSearchUserList(1,searchData);
        }
        //this.getClubMenberListData(1,searchData);
    },

    onClickSearchHhr:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        var searchData = this.inputBox_hhr.getString();
        if (searchData != ""){
            this.inputBox_hhr.setString("");
            this.getClubUserListAdmin(0,searchData);
        }
    },

    onClickRoleBack:function(sender){
        this.btn_role_back.setVisible(false);

        var curUserid = 0;
        if (!ClickClubModel.isClubCreaterOrLeader()){
            curUserid = PlayerModel.userId;
        }
        this.getClubUserListAdmin(curUserid);
    },

    onClickTopBtn:function(sender){
        this.btn_cygl.setBright(sender == this.btn_cygl);
        this.btn_sqgl.setBright(sender == this.btn_sqgl);
        this.btn_xxtz.setBright(sender == this.btn_xxtz);

        this.panel_cygl.setVisible(sender == this.btn_cygl);
        this.panel_sqgl.setVisible(sender == this.btn_sqgl);
        this.panel_xxtz.setVisible(sender == this.btn_xxtz);
        if(sender == this.btn_xxtz){
            this.inputId.setString("");
            this.inputId.setPlaceHolder("输入玩家ID");
            this.selectType = 0;
            this.queryUserId = 0;
            //this.getClubInformateListData(1);
            this.changeAlertType(0)
        }
    },

    setCyglScroll:function(data,curTargetUserId){
        var scrollView = this.getWidget("item_scroll");
        var item = this.getWidget("item_cygl");
        item.setVisible(false);

        var listNum = data.length;
        var spaceH = 165;

        var contentH = Math.max(scrollView.height,spaceH*listNum);
        scrollView.setInnerContainerSize(cc.size(scrollView.width,contentH));

        this.cyglItemArr = this.cyglItemArr || [item];
        var allRoleArr = [
            {name:"所有成员",userRole:0},
            {name:"会长",    userRole:1},
            {name:"管理",  userRole:2},
            {name:"董事",    userRole:5000},
            {name:"主管",    userRole:10000},
            {name:"管理",    userRole:20000},
            {name:"组长",    userRole:30000},
            {name:"普通成员",    userRole:90000}
        ];
        for(var i = 0;i<listNum;++i){
            var newItem = this.cyglItemArr[i];
            if(!newItem){
                newItem = item.clone();
                this.cyglItemArr[i] = newItem;
                scrollView.addChild(newItem);
            }
            newItem.setVisible(true);
            newItem.y = contentH - (i+0.5)*spaceH;
            var img_head = newItem.getChildByName("img_head");
            var user_name = newItem.getChildByName("user_name");
            user_name.setTextAreaSize(cc.size(150,user_name.getContentSize().height))
            var user_id = newItem.getChildByName("user_id");
            var user_icon = newItem.getChildByName("user_icon");
            var info_label = newItem.getChildByName("info_label");
            var time_label = newItem.getChildByName("time_label");
            var img_online = newItem.getChildByName("img_online");

            var up_userid = newItem.getChildByName("up_userid");
            var up_username = newItem.getChildByName("up_username");
            var userRole_label = newItem.getChildByName("userRole_label");

            var img_forbid = newItem.getChildByName("img_forbid");
            img_forbid.setVisible(!data[i].userLevel);

            var Button_manage = newItem.getChildByName("Button_manage");
            Button_manage.visible = true;
            if (ClickClubModel.getCurClubRole() > data[i].userRole || PlayerModel.userId == data[i].userId){
                Button_manage.visible = false;
            }
            //cc.log("data[i]",JSON.stringify(data[i]))
            up_userid.setString(data[i].promoterId || "---");
            up_username.setString(UITools.truncateLabel(data[i].preName || "---",6));

            var userRole = data[i].userRole;
            userRole_label.setString(ClickClubModel.getClubRoleName(userRole,data[i].promoterLevel));

            //for(var j = 1; j < allRoleArr.length; ++j){
            //    if (userRole == allRoleArr[j].userRole){
            //        userRole_label.setString(allRoleArr[j].name);
            //        //userRole_label.setFontName("res/font/bjdmj/fzcy.TTF");
            //        //userRole_label.enableOutline(cc.color(147,2,2),0);
            //        break;
            //    }
            //}

            var idStr = data[i].userId;
            var nameStr = data[i].userName;
            if(data[i].hideId){
                idStr = UITools.dealUserId(data[i].userId);
                nameStr = UITools.dealUserName(data[i].userName);
            }
            user_name.setString(nameStr);
            user_id.setString("ID:" + idStr);
            var logTime = this.getFormatTime(data[i].logTime).slice(0,10) + "\n" + this.getFormatTime(data[i].logTime).slice(-9);
            time_label.setString(logTime);

            data[i].curTargetUserId = curTargetUserId;
            Button_manage.tempData = data[i];
            Button_manage.newItem = newItem;
            UITools.addClickEvent(Button_manage,this,this.onClickRoleManage);
            //var userRole = data[i].userRole;//玩家等级 0 群主 1 管理员 2 普通人员
            //if(userRole == 0){
            //    user_icon.visible = true;
            //    user_icon.loadTexture("res/ui/bjdmj/popup/pyq/cygl/huizhang1.png",ccui.Widget.LOCAL_TEXTURE);
            //}else if(userRole == 1){
            //    user_icon.visible = true;
            //    user_icon.loadTexture("res/ui/bjdmj/popup/pyq/cygl/huizhang2.png",ccui.Widget.LOCAL_TEXTURE)
            //}else{
            //    user_icon.visible = false;
            //}

            if(data[i].isOnLine){
                img_online.loadTexture("res/ui/bjdmj/popup/pyq/img_zaixian.png");
            }else{
                img_online.loadTexture("res/ui/bjdmj/popup/pyq/img_lixian.png");
            }

            var img_forbid = newItem.getChildByName("img_forbid");
            img_forbid.setVisible(!data[i].userLevel);

            info_label.setString("");

            this.showIcon(img_head,data[i].headimgurl , 1);

            var btn_info = newItem.getChildByName("btn_info");
            //UITools.addClickEvent(btn_info,this,this.onClickCyglItem);
            //UITools.addClickEvent(newItem,this,this.onClickCyglItem);
            var Panel_myTouch = newItem.getChildByName("Panel_myTouch");
            Panel_myTouch.id = data[i].userId;
            var Panel_upTouch = newItem.getChildByName("Panel_upTouch");
            Panel_upTouch.id = data[i].promoterId;
            UITools.addClickEvent(Panel_myTouch,this,this.onClickTouchById);
            UITools.addClickEvent(Panel_upTouch,this,this.onClickTouchById);
            btn_info.tempData = data[i];
            newItem.tempData = data[i];
        }

        for(;i<this.cyglItemArr.length;++i){
            this.cyglItemArr[i].setVisible(false);
        }
    },
    onClickRoleManage:function(sender){
        var pop = new ClubUserRolePop(sender,this);
        PopupManager.addPopup(pop);
    },

    getFormatTime:function(time){
        var timeStr = "----";
        if(time){
            var data = new Date(time);
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

            timeStr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
        }

        return timeStr;
    },

    setSqglScroll:function(data){
        this.sqglMsgData = data;
        var scrollView = this.getWidget("item_scroll_sqgl");
        var item = this.getWidget("item_sqgl");
        item.setVisible(false);

        this.sqglItemArr = this.sqglItemArr || [item];

        var listNum = data.length;
        var spaceH = 165;

        var contentH = Math.max(scrollView.height,spaceH*listNum);
        scrollView.setInnerContainerSize(cc.size(scrollView.width,contentH));

        for(var i = 0;i<listNum;++i){
            var newItem = this.sqglItemArr[i];
            if(!newItem){
                newItem = item.clone();
                this.sqglItemArr[i] = newItem;
                scrollView.addChild(newItem);
            }
            newItem.setVisible(true);
            newItem.y = contentH - (i+0.5)*spaceH;
            var img_head = newItem.getChildByName("img_head");
            var user_name = newItem.getChildByName("user_name");
            var user_id = newItem.getChildByName("user_id");
            var info_label = newItem.getChildByName("info_label");
            var btn_agree = newItem.getChildByName("btn_agree");
            var btn_refuse = newItem.getChildByName("btn_refuse");
            btn_agree.setTag(1);
            btn_refuse.setTag(2);

            btn_agree.idx = i;
            btn_refuse.idx = i;

            user_name.setString(data[i].userName);
            user_id.setString("ID:" + data[i].userId);
            info_label.setString("推荐人:" + data[i].userName);
            this.showIcon(img_head,data[i].headimgurl);

            UITools.addClickEvent(btn_agree,this,this.onClickSqglItem);
            UITools.addClickEvent(btn_refuse,this,this.onClickSqglItem);
        }

        for(;i<this.sqglItemArr.length;++i){
            this.sqglItemArr[i].setVisible(false);
        }

        if(data.length <=0){
            var red_point = this.btn_sqgl.getChildByName("red_point");
            red_point.setVisible(false);

            this.showLayerTip(scrollView,"暂无申请");
        }
    },

    showLayerTip:function(parent,str){
        parent.removeChildByName("layerTip");

        var tip = new ccui.Text(str,"res/font/bjdmj/fznt.ttf",50);
        tip.setPosition(parent.width/2,parent.height/2);
        tip.setName("layerTip");
        parent.addChild(tip,1);
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
            spr.setScale(106/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            this.membegImgLoad.push(iconUrl, function (img) {
                spr.setTexture(img);
                spr.setScale(106/spr.width);
            });

            //cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
            //    if (!error) {
            //        spr.setTexture(img);
            //        spr.setScale(71/spr.width);
            //    }
            //});
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onClickCyglItem:function(sender){
        //if(ClickClubModel.isClubCreaterOrLeader()){
        //    var pop = new MemberItemPop(sender.tempData,this);
        //    PopupManager.addPopup(pop);
        //}else{
        //    FloatLabelUtil.comText("权限不够");
        //}
    },

    onClickTouchById:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));
        var id = sender.id;
        for(var i = this.curRoleBtnArr.length - 1 ;i >= 0;--i){
            var roleData = this.curRoleBtnArr[i].roleData;
            if (id && id == roleData.userId){
                this.onClickUserRoleBtn(this.curRoleBtnArr[i]);
                break;
            }
        }
    },

    onClickSqglItem:function(sender){
        var tag = sender.getTag();

        var self = this;
        NetworkJT.loginReq("groupActionNew", "responseApply", {
            sessCode:PlayerModel.sessCode,
            userId:PlayerModel.userId,
            msgType:1,
            keyId:this.sqglMsgData[sender.idx].keyId,
            value:tag==1?1:0
        }, function (data) {
            if (data) {
                cc.log("searchGroupInfo::"+JSON.stringify(data));
                self.sqglMsgData.splice(sender.idx,1);
                self.setSqglScroll(self.sqglMsgData);
                if(tag == 1){
                    self.getClubUserListAdmin();
                }
            }
        }, function (data) {
            cc.log("searchGroupInfo::"+JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },

    onClose:function(){
        if(this.sqglMsgData.length <= 0){
            this.pyqHall.updateRedPoint();
        }
    },
});

var MemberItemPop = BasePopup.extend({
    itemData:null,
    parentNode:null,
    ctor:function(data,parentNode){

        this.itemData = data;
        this.parentNode = parentNode;

        this._super("res/memberItemPop.json");
    },

    selfRender:function(){

        var label_name = this.getWidget("label_name");
        var label_id = this.getWidget("label_id");
        var img_head = this.getWidget("img_head");

        var label_info_1 = this.getWidget("label_info_1");
        var label_info_2 = this.getWidget("label_info_2");
        var label_info_3 = this.getWidget("label_info_3");
        var label_info_4 = this.getWidget("label_info_4");



        var idStr = this.itemData.userId;
        var nameStr = this.itemData.userName;
        if(this.itemData.hideId){
            idStr = UITools.dealUserId(this.itemData.userId);
            nameStr = UITools.dealUserName(this.itemData.userName);
        }
        label_name.setString(nameStr);
        label_id.setString("ID:" + idStr);
        label_info_1.setString("推荐人:" + this.itemData.userName);
        this.showIcon(img_head,this.itemData.headimgurl);

        this.btn_mgr = this.getWidget("btn_mgr");
        UITools.addClickEvent(this.btn_mgr,this,this.onClickChangeRole);
        UITools.addClickEvent(this.getWidget("btn_add_bz"),this,this.onClickAddFlag);
        UITools.addClickEvent(this.getWidget("btn_zrqz"),this,this.onClickZrqz);
        UITools.addClickEvent(this.getWidget("btn_delete"),this,this.onClickDelete);
        this.btn_jzyy = this.getWidget("btn_jzyy");
        UITools.addClickEvent(this.btn_jzyy,this,this.onClickFrobid);

        this.updateForbidState(this.itemData.userLevel);
        this.updateRoleState(this.itemData.userRole);

        var input_bg = this.getWidget("input_bg");

        this.inputBox = new cc.EditBox(cc.size(300, 50),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = this.inputBox.width/2;
        this.inputBox.y = input_bg.height/2;
        this.inputBox.setPlaceholderFont("Arial",26);
        this.inputBox.setPlaceHolder("输入备注");
        input_bg.addChild(this.inputBox,1);
        this.inputBox.setFont("Arial",26);

    },

    updateRoleState:function(role){
        this.itemData.userRole = role;
        //this.btn_mgr.setColor(this.itemData.userRole <= 1?cc.color.GRAY:cc.color.WHITE);
        var img_name = "res/ui/bjdmj/popup/pyq/cygl/shewei.png";
        if(this.itemData.userRole <= 1){
            img_name = "res/ui/bjdmj/popup/pyq/cygl/quxiaoguanli.png";
        }
        this.btn_mgr.loadTextureNormal(img_name,ccui.Widget.LOCAL_TEXTURE);
    },

    updateForbidState:function(userLevel){
        this.itemData.userLevel = userLevel;
        this.btn_jzyy.setColor(this.itemData.userLevel == 1?cc.color.WHITE:cc.color.GRAY);
    },

    onClickChangeRole:function(){
        if(this.itemData.userRole == 1){
            this.optUser("downRole","确定撤销该成员的管理职位吗？");
        }else{
            this.optUser("upRole","确定授予该成员管理职位吗？");
        }
    },

    onClickAddFlag:function(){

    },

    onClickFrobid:function(){
        if(this.itemData.userLevel == 1){
            this.optUser("forbid","确定禁止该成员在本亲友圈中进行游戏吗？");
        }else{
            this.optUser("unforbid","确定解除禁止该成员在本亲友圈中进行游戏吗？");
        }
    },

    onClickZrqz:function(){
        this.optUser("giveLeader","确定将亲友圈转让给其他成员吗？");
    },

    onClickDelete:function(){
        this.optUser("delete","确定删除该成员吗？");
    },

    optUser:function(type,tipStr){
        var self = this;
        if(this.itemData.userId == PlayerModel.userId){
            FloatLabelUtil.comText("不可对自己操作");
            return;
        }
        var params = {oUserId:self.itemData.userId ,mUserId:PlayerModel.userId,groupId:self.itemData.groupId};

        var netType = "updateGroupUser";
        if(type == "upRole"){//设为管理
            params.userRole = 1;
        }else if(type == "downRole"){//取消管理
            params.userRole = 2;
        }else if(type == "delete"){//删除成员
            netType = "fire";
        }else if(type == "forbid"){//禁止游戏
            params.userState = 0;
        }else if(type == "unforbid"){//解除禁止
            params.userState = 1;
        }else if(type == "giveLeader"){//转让群主
            params.userRole = 0;
        }

        AlertPop.show(tipStr,function() {
            NetworkJT.loginReq("groupActionNew", netType, params, function (data) {
                if (data) {
                    FloatLabelUtil.comText(data.message);
                    //调用父节点的刷新
                    if(self.parentNode && type != "giveLeader"){
                        self.parentNode.getClubMenberListData();
                    }
                    if(type == "upRole" || type == "downRole"){
                        self.updateRoleState(params.userRole);
                    }
                    if(type == "forbid" || type == "unforbid"){
                        self.updateForbidState(params.userState);
                    }
                    if(type == "delete"){
                        PopupManager.remove(self);
                    }
                    if(type == "giveLeader"){
                        PopupManager.remove(self);
                        PopupManager.removeClassByPopup(PyqChenYuan);
                        SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    }
                }
            }, function (data) {
                cc.log("updateGroupUser::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
        })
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
            spr.setScale(71/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(71/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },
});