/**
 * 俱乐部邀请弹框
 */
var ClubInvitePop = BasePopup.extend({

    ctor:function(parentNode){
        this.curClubId = ClickClubModel.getCurClubId();
        this.curClubRole = ClickClubModel.getCurClubRole();
        this.curClubName = ClickClubModel.getCurClubName();
        this.parentNode = parentNode;
        this._super("res/clubInvitePop.json");
    },

    selfRender:function(){
        this.btnIShare = this.getWidget("btnIShare");
        this.btnAddPlayer = this.getWidget("btnAddPlayer");
        this.btnInputClub = this.getWidget("btnInputClub");
        this.btnTeamManager = this.getWidget("btnTeamManage");
        this.msgRedPoint = this.getWidget("redPoint");
        this.msgRedPoint.visible = (ClickClubModel.isClubHasNewMsg())

        //小组管理
        this.btnTeam = this.getWidget("btnTeam");


        UITools.addClickEvent(this.btnIShare, this , this.onShare);
        UITools.addClickEvent(this.btnAddPlayer, this , this.onShowAddPop);
        UITools.addClickEvent(this.btnInputClub, this , this.onShowInputPop);
        UITools.addClickEvent(this.btnTeamManager , this , this.showMessageList);
        UITools.addClickEvent(this.btnTeam , this , this.onTeamManager);

    },

    onShare:function(){
        var wanfa = "打筒子";
        var obj = {};
        obj.tableId = "123456";
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?num=' + "123456" + '&userId=' + encodeURIComponent(PlayerModel.userId);
        obj.title = "请加入亲友圈ID:"+"["+this.curClubId+"]";
        obj.description = "我创建了一个亲友圈["+ this.curClubName  + "]，诚邀各位牌友加入！";
        obj.shareType = 1;
        cc.log("obj.title"+ obj.title);
        cc.log("obj.description"+ obj.description);
        SdkUtil.sdkFeed(obj);
        PopupManager.remove(this);
    },

    onShowAddPop:function(){
        //var isForbit = true;
        //if (isForbit){
        //    AlertPop.showOnlyOk("功能正在优化，敬请期待", function(){
        //
        //    });
        //    return;
        //}
        PopupManager.addPopup(new ClubAddPlayerPop(this.curClubId , this.parentNode));
        PopupManager.remove(this);
    },

    onShowInputPop:function(){
        if(this.curClubRole != 0){
            FloatLabelUtil.comText("不是会长无法使用该功能");
            return;
        }else{
            PopupManager.addPopup(new ClubInputClubPop(this.curClubId , this.parentNode));
            PopupManager.remove(this);
        }
    },


    showMessageList:function(){
        if(ClickClubModel.getCurClubId() == 0){
            FloatLabelUtil.comText("当前未选择亲友圈");
            return;
        }
        var mc = new MessagePop(this);
        PopupManager.addPopup(mc);
        PopupManager.remove(this);
    },

    onTeamManager:function(){
        if(ClickClubModel.isClubCreaterOrLeader()){
            PopupManager.addPopup(new ClubTeamPop())
        }else if(ClickClubModel.isClubTeamLeader()){//直接显示我所在分组的详情
            PopupManager.addPopup(new ClubTeamDetailPop(ClickClubModel.getClubTeamKeyId()));
        }
        PopupManager.remove(this);
    },

});

/**
 * 俱乐部手动添加玩家弹框
 */
var ClubAddPlayerPop = BasePopup.extend({

    ctor:function(clubId , parentNode){
        this.curClubId = clubId;
        this.parentNode = parentNode;
        this._super("res/clubAddPlayerPop.json");
    },

    selfRender:function(){
        this.btnAdd = this.getWidget("btnAdd");
        this.btnSearch = this.getWidget("btnSearch");
        this.playerIcon = this.getWidget("icon");
        this.playerName = this.getWidget("lbName");

        UITools.addClickEvent(this.btnAdd, this , this.onInvite);
        UITools.addClickEvent(this.btnSearch, this , this.onSearch);
        var inputIdImg = this.getWidget("inputBg");
        this.inputId = new cc.EditBox(cc.size(330, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputId.setString("");
        this.inputId.x = inputIdImg.width/2;
        this.inputId.y = inputIdImg.height/2;
        //this.inputId.setFontColor(cc.color("7D2E00"));
        this.inputId.setDelegate(this);
        this.inputId.setFont("Arial",40);
        this.inputId.setMaxLength(30);
        this.inputId.setPlaceHolder("输入玩家ID");
        this.inputId.setPlaceholderFont("Arial" , 40);
        this.inputId.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        inputIdImg.addChild(this.inputId,0);
        this.playerIcon.visible = false;

        this.btnSearch.visible = !this.playerIcon.visible;
        this.btnAdd.visible = this.playerIcon.visible;


    },

    onShowPlayer:function(playData){
        if(playData == null){
            return;
        }
        var tplayData = playData;
        if(this.playerIcon){
            this.playerIcon.visible = true;
            this.playerName.setString(tplayData.userName);
            this.showIcon(tplayData.headimgurl);

            this.btnSearch.visible = !this.playerIcon.visible;
            this.btnAdd.visible = this.playerIcon.visible;
        }
    },

    showIcon: function (iconUrl) {

        var icon = this.playerIcon;
        var defaultimg ="res/ui/common/default_m.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var sprite = new cc.Sprite(defaultimg);
        sprite.setScale(120/sprite.width);
        sprite.setPosition(icon.width/2,icon.height/2);
        icon.addChild(sprite,5,345);

        if(iconUrl){
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.setScale(120 / sprite.width);
                }
            });
        }
    },

    onSearch:function(){
        var userId = this.inputId.getString();
        var self =  this;
        if( parseInt(userId) > 0){
            NetworkJT.loginReq("groupAction", "loadUserBase", {userIds:userId}, function (data) {
                cc.log("loadUserBase..." , JSON.stringify(data));
                if (data && data.message.length > 0) {
                    self.onShowPlayer(data.message[0]);
                }else{
                    FloatLabelUtil.comText("玩家不存在");
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        }else{
            FloatLabelUtil.comText("请输入正确的玩家ID");
        }
    },

    onInvite:function(){

        //if(!ClickClubModel.isClubCreaterOrLeader()){
        //    this.inviteUser();
        //    return;
        //}

        var userId = this.inputId.getString();
        userId = userId.replace(/\s/g,"");
        var self =  this;
        if(parseInt(userId) > 0){
            NetworkJT.loginReq("groupActionNew", "inviteUser", {
                sessCode:PlayerModel.sessCode,
                targetUserId:userId,
                userId:PlayerModel.userId ,
                groupId:ClickClubModel.getCurClubId() ,
                //checked:"checked"  //是否需要玩家同意(传了就不需要)
            }, function (data) {
                cc.log("inviteJoinGroup..." , JSON.stringify(data));
                if (data ) {
                    //FloatLabelUtil.comText("添加成功");
                    FloatLabelUtil.comText("邀请成功");
                    //ClickClubModel.updateClubMembersNum(ClickClubModel.getCurClubMemberNum() + 1);
                    PopupManager.remove(self);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
                PopupManager.remove(self);
            });
        }
    },

    //拉手和小组长调用这个邀请人
    inviteUser:function(){
        var self = this;
        NetworkJT.loginReq("groupActionNew", "inviteUser", {
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            targetUserId:this.inputId.getString(),
            opType:3
        }, function (data) {
            if (data) {
                FloatLabelUtil.comText("邀请成功");
                PopupManager.remove(self);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });

    },
});


/**
 * 俱乐部导入弹框
 */
var ClubInputClubPop = BasePopup.extend({

    ctor:function(clubId , parentNode){
        this.curClubId = clubId;
        this.parentNode = parentNode;
        this._super("res/clubInputPlayersFromClub.json");
    },

    selfRender:function(){
        this.btnInput = this.getWidget("btnInput");
        this.clubListView = this.getWidget("lvClubList");
        UITools.addClickEvent(this.btnInput, this , this.onInput);
        this.getMyClubList();
        this.fromClubId = 0;
    },

    getMyClubList:function(){
        var self = this;
        NetworkJT.loginReq("groupAction", "loadGroups", {mUserId:PlayerModel.userId , pageNo:1 , pageSize:20 , userRole:0}, function (data) {
            if (data) {
                //cc.log("loadGroups::"+JSON.stringify(data));
                var isOne = false;
                var num = 0;
                for(var index = 0 ; index < data.groups.length; index++){
                    if(data.groups[index].groupId != self.curClubId){
                        num = num + 1;
                    }
                }
                if (num == 1){
                    isOne = true;
                }
                for(var index = 0 ; index < data.groups.length; index++){
                    if(data.groups[index].groupId != self.curClubId){
                        var clubItem = new MyClubItem(data.groups[index] , self.curClubId , self ,isOne);
                        self.clubListView.pushBackCustomItem(clubItem);
                    }
                }
            }
        }, function (data) {
            cc.log("getClubListData::"+JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },

    fixShow:function(){
        var allItems = this.clubListView.getItems();
        for(var index = 0 ; index < allItems.length ; index++){
            var tCurNode =  allItems[index];
            if(tCurNode && tCurNode.Panel_16){
                tCurNode.Panel_16.setBackGroundImage("res/ui/dtzjulebu/julebu/clubListCellBg2.png");
            }
        }
    },

    loadClub:function(fromClubId){
        this.fromClubId = fromClubId;
    },

    onInput:function(){
        var self = this;
        NetworkJT.loginReq("groupAction", "copyGroups", {mUserId:PlayerModel.userId , fromGroupId:this.fromClubId , toGroupId:ClickClubModel.getCurClubId() , userRole:0}, function (data) {
            if (data) {
                cc.log("copyGroups::"+JSON.stringify(data));
                ClickClubModel.updateClubMembersNum(data.total);
                FloatLabelUtil.comText(data.message);
                PopupManager.remove(self);
            }
        }, function (data) {
            cc.log("copyGroups::"+JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
            PopupManager.remove(self);
        });
    },
});

/**
 * 俱乐部小组导入弹框
 */
var ClubTeamInputClubPop = BasePopup.extend({

    ctor:function(clubId , parentNode){
        this.curClubId = clubId;
        this.parentNode = parentNode;
        this._super("res/clubInputPlayersFromTeam.json");
    },

    selfRender:function(){
        this.btnInput = this.getWidget("btnInput");
        this.clubListView = this.getWidget("lvClubList");
        UITools.addClickEvent(this.btnInput, this , this.onInput);
        this.getMyClubList();
        this.fromClubId = 0;
        this.fromGroupbId = 0;
    },

    getMyClubList:function(){
        var self = this;
        NetworkJT.loginReq("groupAction", "loadGroups", {
            mUserId:PlayerModel.userId ,
            pageNo:1 ,
            pageSize:20 ,
            userRole:10,
            isTeamGroup:1,
        }, function (data) {
            if (data) {
                cc.log("loadGroups::"+JSON.stringify(data));
                var isOne = false;
                var num = 0;
                for(var index = 0 ; index < data.groups.length; index++){
                    if(data.groups[index].groupId != self.curClubId){
                        num = num + 1;
                    }
                }
                if (num == 1){
                    isOne = true;
                }
                cc.log("self.curClubId",self.curClubId)
                for(var index = 0 ; index < data.groups.length; index++){
                    if(data.groups[index].groupId != self.curClubId){
                        var clubItem = new MyClubTeamItem(data.groups[index] , self.curClubId , self ,isOne);
                        self.clubListView.pushBackCustomItem(clubItem);
                    }
                }
            }
        }, function (data) {
            cc.log("getClubListData::"+JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },

    fixShow:function(){
        var allItems = this.clubListView.getItems();
        for(var index = 0 ; index < allItems.length ; index++){
            var tCurNode =  allItems[index];
            if(tCurNode && tCurNode.Panel_16){
                tCurNode.Panel_16.setBackGroundImage("res/ui/dtzjulebu/julebu/clubListCellBg2.png");
            }
        }
    },

    loadClub:function(fromClubId,fromGroupbId){
        this.fromClubId = fromClubId;
        this.fromGroupbId = fromGroupbId;
    },

    onInput:function(){
        var self = this;
        NetworkJT.loginReq("groupAction", "copyGroups", {
            mUserId:PlayerModel.userId ,
            fromGroupId:this.fromClubId ,
            toGroupId:ClickClubModel.getCurClubId() ,
            userRole:0,
            userGroup:this.fromGroupbId,
        }, function (data) {
            if (data) {
                cc.log("copyGroups::"+JSON.stringify(data));
                ClickClubModel.updateClubMembersNum(data.total);
                FloatLabelUtil.comText(data.message);
                PopupManager.remove(self);
            }
        }, function (data) {
            cc.log("copyGroups::"+JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
            PopupManager.remove(self);
        });
    },
});


/**
 * 玩家拥有的俱乐部item
 */
var MyClubItem = ccui.Widget.extend({
    ctor:function(data , clubId , parentNode,isOne){
        this.data = data;
        this.parentNode = parentNode;
        this.curClubId = clubId;
        this.messageKeyId = this.data.keyId;
        this._super();
        this.setContentSize(730, 60);

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(730,60),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var clubId=this.clubId= UICtor.cLabel("10086",26,cc.size(190,36),cc.color(135,47,16),0,1);
        clubId.setAnchorPoint(cc.p(0,0.5));
        clubId.setPosition(71,30);
        Panel_16.addChild(clubId);
        var clubName=this.clubName= UICtor.cLabel("亲友圈名字",26,cc.size(0,0),cc.color(135,47,16),0,1);
        clubName.setPosition(364,31);
        Panel_16.addChild(clubName);
        var lbNumber=this.lbNumber= UICtor.cLabel("2",26,cc.size(0,0),cc.color(135,47,16),0,1);
        lbNumber.setPosition(596,33);
        Panel_16.addChild(lbNumber);

        Panel_16.setBackGroundImage("res/ui/dtzjulebu/julebu/clubListCellBg2.png");


        this.addChild(Panel_16);
        //添加点击事件
        this.Panel_16.setTouchEnabled(true);
        UITools.addClickEvent(this.Panel_16, this, this.onClick);
        if (isOne){
            this.onClick();
        }

        //Button_7
        this.setData(this.data);
    },

    onClick:function(){
        //cc.log("点击俱乐部消息...");
        this.parentNode.fixShow();
        this.parentNode.loadClub(this.data.groupId);
        this.Panel_16.setBackGroundImage("res/ui/dtzjulebu/julebu/clubListCellBg1.png");
    },

    setData:function(){
        this.clubName.setString(this.data.groupName);
        this.clubId.setString("ID:" + this.data.groupId);
        this.lbNumber.setString(this.data.currentCount);
    },

});


/**
 * 玩家拥有的俱乐部小组item
 */
var MyClubTeamItem = ccui.Widget.extend({
    ctor:function(data , clubId , parentNode,isOne){
        this.data = data;
        this.parentNode = parentNode;
        this.curClubId = clubId;
        this.messageKeyId = this.data.keyId;
        this._super();
        this.setContentSize(730, 60);

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(730,60),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var clubId=this.clubId= UICtor.cLabel("10086",26,cc.size(190,36),cc.color(135,47,16),0,1);
        clubId.setAnchorPoint(cc.p(0,0.5));
        clubId.setPosition(71,30);
        Panel_16.addChild(clubId);
        var clubName=this.clubName= UICtor.cLabel("亲友圈名字",26,cc.size(0,0),cc.color(135,47,16),0,1);
        clubName.setPosition(314,31);
        Panel_16.addChild(clubName);

        var teamName=this.teamName= UICtor.cLabel("小组名",26,cc.size(0,0),cc.color(135,47,16),0,1);
        teamName.setPosition(485,33);
        Panel_16.addChild(teamName);

        var lbNumber=this.lbNumber= UICtor.cLabel("2",26,cc.size(0,0),cc.color(135,47,16),0,1);
        lbNumber.setPosition(666,33);
        Panel_16.addChild(lbNumber);

        Panel_16.setBackGroundImage("res/ui/dtzjulebu/julebu/clubListCellBg2.png");


        this.addChild(Panel_16);
        //添加点击事件
        this.Panel_16.setTouchEnabled(true);
        UITools.addClickEvent(this.Panel_16, this, this.onClick);
        if (isOne){
            this.onClick();
        }

        //Button_7
        this.setData(this.data);
    },

    onClick:function(){
        //cc.log("点击俱乐部消息...");
        this.parentNode.fixShow();
        this.parentNode.loadClub(this.data.groupId,this.data.descMsg);
        this.Panel_16.setBackGroundImage("res/ui/dtzjulebu/julebu/clubListCellBg1.png");
    },

    setData:function(){
        this.clubName.setString(this.data.groupName);
        this.clubId.setString("ID:" + this.data.groupId);
        this.lbNumber.setString(this.data.currentCount);
        this.teamName.setString(this.data.extMsg);
    },

});
