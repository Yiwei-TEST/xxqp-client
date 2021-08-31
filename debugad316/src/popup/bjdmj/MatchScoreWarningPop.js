var MatchScoreWarningItem = ccui.Widget.extend({
    ctor: function () {
        this._super();
        this.root = ccs.uiReader.widgetFromJsonFile("res/MatchScoreWarningItem.json");
        this.addChild(this.root);
        this.setContentSize(this.root.getContentSize().width, this.root.getContentSize().height + 10);

        this.Image_head = ccui.helper.seekWidgetByName(this.root,"headImg");

        var Button_delete = ccui.helper.seekWidgetByName(this.root, "Button_delete");
        UITools.addClickEvent(Button_delete,this,this.onDelete);

        this.Button_modify = ccui.helper.seekWidgetByName(this.root, "Button_modify");
        UITools.addClickEvent(this.Button_modify, this, this.onModify);
        
        this.warningSwitch = ccui.helper.seekWidgetByName(this.root, "warningSwitch");
        UITools.addClickEvent(this.warningSwitch, this, this.onSwitch);

        this.waringScore = ccui.helper.seekWidgetByName(this.root, "waringScore");

        SyEventManager.addEventListener(SyEvent.MATCHSCOREWARNING_MODIFY_WARNINGSCORE, this, this.modifyScore);
        
    },

    modifyScore:function(message){
        var data = message.getUserData();
        if (parseInt(data.userId) == parseInt(this.userId)){
            this.waringScore.setString(data.warnScore);
        }
    },

    onModify:function(){
        var isOpen = this.warningSwitch.isSelected() ? 1 : 0;
        // cc.log("isopen =", isOpen);
        if (!isOpen) {
            return;
        }
        PopupManager.addPopup(new MatchScoreWarningAddPop(2,isOpen,this.userId));
    },

    onSwitch:function(){
        var self = this;
        var isOpen = this.warningSwitch.isSelected()?0:1;
        this.Button_modify.setEnabled(isOpen);
        NetworkJT.loginReq("groupActionNew", "updateGroupWarn", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            targetUserId: this.userId,
            warnScore: this.waringScore.getString(),
            warnSwitch: isOpen,
        }, function (data) {
            if (data) {
                if (data.message) {//获取当前页 有数据的情况
                    cc.log("data.message =", JSON.stringify(data.message));
                } else {
                    FloatLabelUtil.comText("没有更多数据了");
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        }); 
        
    },
    setItemWithData:function(data){
        this.userId = data.userId;
        ccui.helper.seekWidgetByName(this.root, "name").setString(data.name);
        ccui.helper.seekWidgetByName(this.root, "ID").setString(data.userId);
        ccui.helper.seekWidgetByName(this.root, "teamScore").setString(data.sumCredit/100);
        ccui.helper.seekWidgetByName(this.root, "waringScore").setString(data.warnScore || 0);
        var string = data.status == 1 ? "res/ui/MatchScoreWarningPop/fengjin.png" : "res/ui/MatchScoreWarningPop/zc.png"
        ccui.helper.seekWidgetByName(this.root, "Image_type").loadTexture(string);
        
        this.warningSwitch.setSelected(data.warnSwitch || 0)
        this.Button_modify.setEnabled(data.warnSwitch || 0);
        this.showIcon(data.headimgurl,1);
    },

    onDelete:function(){
        var self = this;
        NetworkJT.loginReq("groupActionNew", "deleteGroupWarn", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            targetUserId: this.userId,
        }, function (data) {
            if (data) {
                if (data.message) {//获取当前页 有数据的情况
                    SyEventManager.dispatchEvent(SyEvent.MATCHSCOREWARNING_DELETE_USER, data.message);
                } else {
                    FloatLabelUtil.comText("没有更多数据了");
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        }); 
    },

    deleData:function(data){
        var MatchScoreWarningPop = PopupManager.getClassByPopup(MatchScoreWarningPop)
        if (MatchScoreWarningPop) {
            MatchScoreWarningPop.deleteGroupUser(data.message)
        }
    },

    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = this.Image_head;
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if (icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)) {//头像不同才加载
            var sprite = new cc.Sprite(defaultimg);
            sprite.x = icon.width * 0.5;
            sprite.y = icon.height * 0.5;
            icon.addChild(sprite, 5, 345);
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, { width: 252, height: 252 }, function (error, img) {
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
})
var MatchScoreWarningPop = BasePopup.extend({
    ctor:function(data){
        this.itemData = data.groupWarnList || [];
        this.curPage = data.pageNo || 1;
        this.pageSize = data.pageSize || 1;
        this._super("res/MatchScoreWarningPop.json");
    },

    selfRender:function(){
        PopupManager.getClassByPopup(MatchScoreWarningPop)
        var Image_13 = this.getWidget("Image_13");
        this.inputNum = new cc.EditBox(cc.size(Image_13.width - 20, Image_13.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputNum.setPosition(Image_13.width / 2, Image_13.height / 2);
        this.inputNum.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputNum.setMaxLength(7);
        this.inputNum.setFont("Arial", 45);
        this.inputNum.setDelegate(this);
        this.inputNum.setPlaceHolder("输入ID快速查找");
        this.inputNum.setPlaceholderFont("Arial", 45);
        Image_13.addChild(this.inputNum, 1);

        var Button_find = this.getWidget("Button_find");
        UITools.addClickEvent(Button_find,this,this.onFind);


        var Button_add = this.getWidget("Button_add");
        UITools.addClickEvent(Button_add, this, function () {
            PopupManager.addPopup(new MatchScoreWarningAddPop(1));
        });

        this.btn_pageRight = this.getWidget("btnDataRight");
        this.btn_pageRight.temp = 1;
        UITools.addClickEvent(this.btn_pageRight, this, this.onFlipPage);

        this.btn_pageLeft = this.getWidget("btnDataLeft");
        this.btn_pageLeft.temp = -1;
        UITools.addClickEvent(this.btn_pageLeft, this, this.onFlipPage);

        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbDataPage.setString(this.curPage);
        this.ListView_mumber = this.getWidget("ListView_mumber");

        this.showItem();

        SyEventManager.addEventListener(SyEvent.MATCHSCOREWARNING_ADD_USER, this, this.addGroupUser);
        SyEventManager.addEventListener(SyEvent.MATCHSCOREWARNING_DELETE_USER, this, this.deleteGroupUser);
    },

    onFlipPage: function (obj) {
        if (this.curPage + obj.temp < 1){
            return;
        }
        var self = this; 
        NetworkJT.loginReq("groupActionNew", "groupWarnList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: this.curPage + obj.temp,
            pageSize: 10,
            keyWord: "",
        }, function (data) {
            if (data) {
                if (data.message.groupWarnList.length > 0) {//获取当前页 有数据的情况
                    // cc.log("data.message =",JSON.stringify(data.message));
                    self.itemData = data.message.groupWarnList;
                    self.showItem();
                    self.lbDataPage.setString(data.message.pageNo);
                } else {
                    FloatLabelUtil.comText("没有更多数据了");
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });    
    },

    deleteGroupUser:function(message){
        var data = message.getUserData();
        for (var i = 0; i < this.itemData.length; i++) {
            if (data.groupId == ClickClubModel.getCurClubId() && this.itemData[i].userId == data.targetUserId){
                this.itemData.splice(i, 1);
            }
        }
        this.showItem();
    },

    addGroupUser: function (message){
        var data = message.getUserData();
        this.itemData.unshift(data);
        this.showItem();
    },

    showItem:function(){
        this.ListView_mumber.removeAllChildren();
        for (var i = 0; i < this.itemData.length; i++) {
            var item = new MatchScoreWarningItem();
            item.setItemWithData(this.itemData[i]);
            this.ListView_mumber.pushBackCustomItem(item);
        }
    },

    onFind:function(){
        var self = this;    
        NetworkJT.loginReq("groupActionNew", "groupWarnList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: 1,
            pageSize: 10,
            keyWord: this.inputNum.getString(),
        }, function (data) {
            if (data) {
                if (data.message.groupWarnList.length > 0) {//获取当前页 有数据的情况
                    // cc.log("data.message =", JSON.stringify(data.message));
                    self.showItem();
                    for (var i = 0; i < data.message.groupWarnList.length; i++) {
                        var item = new MatchScoreWarningItem();
                        item.setItemWithData(data.message.groupWarnList[i]);
                        self.ListView_mumber.pushBackCustomItem(item);
                    }
                    self.lbDataPage.setString(data.message.pageNo);
                } else {
                    FloatLabelUtil.comText("没有更多数据了");
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });    
    },
}); 