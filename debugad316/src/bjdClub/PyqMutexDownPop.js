/**
 * Created by leiwenwen on 2019/3/16.
 */
var PyqMutexDownPop = BasePopup.extend({
    ctor:function(root,data){
        this.root = root;
        this.poolId = data.keyId;
        this.userIds = null;
        this.mutexData = data || null;
        this._super("res/mutexDownPop.json");
    },

    selfRender:function(){


        var Label_title = this.getWidget("Label_title");
        var str = "";
        if (this.mutexData){
            str = this.mutexData.name || "";
        }
        Label_title.setString(str);

        var addBtn = this.getWidget("Button_add");
        addBtn.temp = 3;
        var reduceBtn = this.getWidget("Button_reduce");
        reduceBtn.temp = 4;
        var findBtn1 = this.getWidget("Button_find1");
        findBtn1.temp = 1;
        var findBtn2 = this.getWidget("Button_find2");
        findBtn1.temp = 2;

        this.ScrollView_m = this.getWidget("ScrollView_di");
        this.ScrollView_m.setBounceEnabled(true);

        // this.scrollItem = ccui.helper.seekWidgetByName(this.ScrollView_m,"Image_mutex");
        // this.scrollItem.retain();
        // this.scrollItem.setVisible(false);


        var inputBg1 = this.getWidget("Image_input1");
        this.inputBox1 = new cc.EditBox(cc.size(inputBg1.width - 165, inputBg1.height - 15),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox1.x = inputBg1.width/2 - 75;
        this.inputBox1.y = inputBg1.height/2;
        this.inputBox1.setPlaceholderFont("",40);
        this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox1.setPlaceHolder("输入ID查找");
        inputBg1.addChild(this.inputBox1,1);
        this.inputBox1.setFont("",40);


        var inputBg2 = this.getWidget("Image_input2");
        this.inputBox2 = new cc.EditBox(cc.size(inputBg2.width - 165, inputBg2.height - 15),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox2.x = inputBg2.width/2 - 75;
        this.inputBox2.y = inputBg2.height/2;
        this.inputBox2.setPlaceholderFont("",40);
        this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox2.setPlaceHolder("输入ID查找");
        inputBg2.addChild(this.inputBox2,1);
        this.inputBox2.setFont("",40);


        this.Panel_info = this.getWidget("Panel_info");
        this.Panel_info.visible = false;

        UITools.addClickEvent(findBtn1,this,this.getMutexData);
        UITools.addClickEvent(findBtn2,this,this.searchMember);
        UITools.addClickEvent(addBtn,this,this.onClick);
        UITools.addClickEvent(reduceBtn,this,this.onClick);

        var closeBtn = this.getWidget("close_btn");  // 关闭按钮
        if(closeBtn){
            UITools.addClickEvent(closeBtn,this,this.onClose);
        }

        this.getMutexData(2);
    },

    setAddInfoUi:function(user){
        this.Panel_info.visible = true;
        var Image_head = this.Panel_info.getChildByName("Image_head");
        var Label_id = Image_head.getChildByName("Label_id");
        var Label_name = Image_head.getChildByName("Label_name");
        var userName = UITools.dealNameLength(user.userName,6);
        Label_id.setString("" + user.userId);
        Label_name.setString("" + userName);
        this.showIcon(Image_head,user.headimgurl);
        this.userIds = user.userId;
    },

    showIcon: function (spr,iconUrl, sex) {
        // iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";
        if (spr.getChildByTag(345)) {
            spr.removeChildByTag(345);
        }
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = spr.width * 0.5;
        sprite.y = spr.height * 0.5;
        spr.addChild(sprite, 5, 345);
        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.setScale(120/spr.width);
                }
            });
        }else{
            sprite.initWithFile(defaultimg);
        }
    },

    searchMember:function(){
        this.Panel_info.visible = false;
        cc.log("============searchMember===========");
        var searchId = this.inputBox2.getString();
        if(!searchId)return;
        var params = {
            groupId:ClickClubModel.getCurClubId(),
            optType:2,
            keyWord:searchId,
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode
        }
        var self = this;
        NetworkJT.loginReq("groupActionNew", "loadGroupUserList",params , function (data) {
            if (data) {
                if(data.message.list.length > 0){
                    cc.log("searchMember==",JSON.stringify(data))
                    var user = data.message.list[0];
                    self.setAddInfoUi(user);
                }else{
                    FloatLabelUtil.comText("未找到该ID的玩家");
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    getMutexData:function(_optType,_userId){
        var _optType = 2;
        var _userId = _userId || null;
        var params = {
            groupId:ClickClubModel.getCurClubId(),
            pageNo:1,
            pageSize:5000,
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            optType :_optType//1、互斥池列表，2、单个互斥池成员列表
        }
        params.poolId = this.poolId;
        if (_optType == 2){
            var userId = this.inputBox1.getString();
            if (userId && userId != ""){
                params.queryUserId = userId;
            }
        }
        var self = this;
        NetworkJT.loginReq("groupActionNew", "loadGroupRejectPool",params , function (data) {
            if (data) {
                cc.log("getMutexData==",JSON.stringify(data));
                if(data.message.dataList && data.message.dataList.length > 0){
                    self.showScrollItem(data.message.dataList);
                }else{
                    if(_userId){
                        FloatLabelUtil.comText("未找到该ID的互斥池");
                    }else{
                        self.showScrollItem([]);
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    updateMutexData:function(_optType){
        var _optType = _optType || 1;
        var params = {
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            optType :_optType //1：新建互斥池，2：删除互斥池，3：增加成员，4：删除成员
        }
        params.poolId = this.poolId;
        if (_optType == 3){
            params.userIds = this.userIds;
            if (!params.userIds){
                FloatLabelUtil.comText("添加前请先输入查询玩家ID");
                return
            }
        }else{
            params.userIds = this.getChooseIds();
            if (!params.userIds){
                FloatLabelUtil.comText("请先选择需要移除的玩家ID");
                return
            }
        }

        var self = this;
        NetworkJT.loginReq("groupActionNew", "updateGroupRejectPool",params , function (data) {
            if (data) {
                cc.log("updateGroupRejectPool==",JSON.stringify(data));
                if(data.message){
                    self.inputBox1.setString("");
                    self.inputBox2.setString("");
                    self.Panel_info.visible = false;
                    self.userIds = null;
                    self.getMutexData();
                    FloatLabelUtil.comText(data.message);
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    showScrollItem:function(data){
        this.ScrollView_m.removeAllChildren();
        var itemNum = Math.floor(data.length/2) + 1;
        var spaceW = 394;
        var spaceH = 160;
        var contentH = Math.max(this.ScrollView_m.height,itemNum*(spaceH + 25) + 10);
        this.ScrollView_m.setInnerContainerSize(cc.size(this.ScrollView_m.width,contentH));

        this.mutexData = [];
        for(var i = 0;i < data.length;++i) {
            var newItem = new HuChiUser();
            newItem.data = data[i];
            this.mutexData.push(newItem);
            newItem.x =  Math.floor(i%2) * (spaceW + 220) + spaceW/2 + 10;
            newItem.y =  contentH - Math.floor(i/2) * (spaceH + 25) - 10 - spaceH/2;
            newItem.setUserData(data[i],true);
            this.ScrollView_m.addChild(newItem);
        }
    },

    getChooseIds:function(){
        var userIds = "";
        for(var i = 0;i < this.mutexData.length;++i) {
            var newItem = this.mutexData[i];
            if (newItem.chooseBtn && newItem.chooseBtn.isChoose){
                if (userIds == ""){
                    userIds = newItem.data.userId;
                }else{
                    userIds = userIds + "," + newItem.data.userId;
                }
            }
        }
        return userIds;
    },

    onClick:function(obj){
        var optType = obj.temp;
        this.updateMutexData(optType)
    },

    onClose:function(){
        SyEventManager.dispatchEvent("MUTEX_UPDATa");
        PopupManager.remove(this);
    }

})


