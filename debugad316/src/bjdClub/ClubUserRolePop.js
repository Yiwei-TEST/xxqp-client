/**
 * 修改俱乐部角色权限
 */
var ClubUserRolePop = BasePopup.extend({

    ctor:function(root,pyqCy){
        this.pyqCy = pyqCy;
        this.tempData = root.tempData;
        this.newItem = root.newItem;
        this.curUserId = this.tempData.userId;
        this.curUserRole = this.tempData.userRole;
        this.curTargetUserId = this.tempData.curTargetUserId;//当前操作的ID
        this.curRoleArr = this.pyqCy.curQtjRoleArr || [];
        this._super("res/clubUserRolePop.json");
    },

    selfRender:function(){


        this.ListView_role = this.getWidget("ListView_role");
        this.ListView_role.visible = true;

        this.mianPopup = this.getWidget("mianPopup");
        this.item_role = this.getWidget("Button_role");
        this.item_role.visible = false;

        this.showRoleList();

        this.addCustomEvent(SyEvent.CLUB_ALLOT_USER,this,this.onSendAllotUser);

    },

    /**
     * 显示所有权限操作按钮
     */
    showRoleList:function(){
        var allRoleArr = [
            {name:"会长",    userRole:1},
            {name:"管理",  userRole:2},
            //{name:"董事",    userRole:5000},
            {name:"合伙人",    userRole:10000},
            //{name:"管理",    userRole:20000},
            //{name:"组长",    userRole:30000},
            {name:"成员",    userRole:90000},
            {name:"踢出成员",    userRole:-1},
            {name:"撤销管理",    userRole:-2},
            {name:"分配邀请人",    userRole:-3},
            {name:"降为成员",    userRole:-4},
            {name:"禁止游戏",    userRole:-5}
        ];

        //var specialArr = [{name:"撤销副会长",    userRole:-2}];

        var alterRoleArr = [
            {roleArr:"2,10000,-3,-4,-1,-5",userRole:1},
            {roleArr:"10000,-3,-4,-1,-5",    userRole:2},
            {roleArr:"10000",  userRole:5000},
            {roleArr:"10000,-1",    userRole:10000},
            {roleArr:"30000",    userRole:20000},
        ];

        var myRole = ClickClubModel.clickClubRole;

        var roleArr = [];
        if (myRole == 1 && this.curUserRole == 2){
            roleArr = [-2];
        }
        //找出我可以操作的数组
        for(var i = 0;i < alterRoleArr.length;++i){
            if (myRole == alterRoleArr[i].userRole){
                cc.log("myRole",JSON.stringify(myRole))
                var curRoleArr = alterRoleArr[i].roleArr.split(",");
                for(var j = 0;j < curRoleArr.length; ++j) {
                    roleArr.push(curRoleArr[j])
                }
                break;
            }
        }

        if (myRole != 1 && myRole != 2 && myRole != 90000 && myRole != 30000 && myRole < this.curUserRole){
            roleArr.push(-4);
        }

        if(myRole == 10000 && ClickClubModel.promoterLevel == 2 && ClickClubModel.promoterLevel < this.tempData.promoterLevel){
            //一级合伙人有权限禁止其下级玩家的是否进入亲友圈游戏
            roleArr.push(-5);
        }

        //对普通成员没有降为成员
        for(var i = roleArr.length-1;i >= 0; i--) {
            if (this.curUserRole == 90000 && roleArr[i] == -4){
                roleArr.splice(i,1);
                break;
            }
        }
        //对副会长没有分配邀请人
        for(var i = roleArr.length-1;i >= 0; i--) {
            if (this.curUserRole == 2 && roleArr[i] == -3){
                roleArr.splice(i,1);
                break;
            }
        }
        //对合伙人没有设为合伙人
        for(var i = roleArr.length-1;i >= 0; i--) {
            if (this.curUserRole == 10000 && roleArr[i] == 10000){
                roleArr.splice(i,1);
                break;
            }
        }

        //让可操作的数组转化为文字 并去掉自己
        var roleNum = 0;
        for(var i = 0;i < roleArr.length; ++i) {
            if(roleArr[i] == 2 && this.curUserRole != 90000){
                continue;
            }
            //cc.log("roleArr[i]====",roleArr[i])
            for(var j = 0;j < allRoleArr.length;++j){
                if (roleArr[i] != this.curUserRole && roleArr[i] == allRoleArr[j].userRole){
                    var item = this.item_role.clone();
                    item.setTouchEnabled(true);
                    item.setVisible(true);
                    this.setItemRoleData(item,allRoleArr[j]);
                    this.ListView_role.pushBackCustomItem(item);
                    item.roleData = allRoleArr[j];
                    UITools.addClickEvent(item,this,this.onChangeUserRole);
                    roleNum = roleNum + 1;
                }
            }
        }
        if (roleNum >= 7){
            roleNum = 7;
        }

        this.mianPopup.setContentSize(this.mianPopup.width,roleNum * 118 + 10);

        this.ListView_role.setContentSize(this.mianPopup.width,this.mianPopup.height- 15)
        //cc.log("roleArr.length",roleArr.length,roleArr)
        if (roleNum <= 0 ){
            this.visible = false;
        }else{
            this.visible = true;
        }

    },

    setItemRoleData:function(item,roleData){
        var roleName = roleData.name;
        var Label_role = item.getChildByName("Label_role");
        if (roleData.userRole == -1 || roleData.userRole == -2 || roleData.userRole == -3 || roleData.userRole == -4){
            Label_role.setString(roleName);
        }else if (roleData.userRole == -5){
            this.updateForbidState(Label_role);
            //Label_role.setString(roleName);
        }else{
            Label_role.setString("设为"+roleName);
        }

    },

    onChangeUserRole:function(sender){
        var userRole = sender.roleData.userRole;
        //cc.log("userRole===",userRole)
        if (userRole == -1){
            this.onDeleteUser(sender);
        }else if (userRole == -3 || userRole == -4){
            this.onRefreshUserRole(sender);
        }else if (userRole == -5){
            //if(this.tempData.userLevel == 1){
            //    this.optUser(sender,"forbid","确定禁止该成员在本亲友圈中进行游戏吗？");
            //}else{
            //    this.optUser(sender,"unforbid","确定解除禁止该成员在本亲友圈中进行游戏吗？");
            //}

            var pop = new ClubOptForbidGamePop(this.tempData);
            PopupManager.addPopup(pop);

        }else{
            //cc.log("userRole===",userRole)
           this.onUpdateUserRole(sender);
        }
    },

    onSendAllotUser:function(event){
        var data = event.getUserData();
        var self = this;
        var fromId = data.userId || 0;
        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            targetId:fromId,
            fromId:this.curUserId,
            optType:1
        };

        //cc.log("params===",JSON.stringify(params))

        NetworkJT.loginReq("groupActionNew", "modifyRelation",params , function (data) {
            if (data && data.code == 0 && data.message) {
                //cc.log("modifyRelation===",JSON.stringify(data));
                FloatLabelUtil.comText("设置成功");
                SyEventManager.dispatchEvent(SyEvent.UPDATE_ROLE_LIST,{userId:self.curTargetUserId});
                PopupManager.remove(self);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        })
    },

    onUpdateUserRole:function(sender){
        var userRole = sender.roleData.userRole;
        var userName = "设为"+sender.roleData.name;
        if (userRole == -2){
            userRole = 90000;
            userName = sender.roleData.name;
        }
        var str = "确认将该成员"+userName+"吗?";
        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            targetUserId:this.curUserId,
            userRole:userRole
        };
        cc.log("params",JSON.stringify(params))
        var self = this;
        AlertPop.show(str,function() {
            NetworkJT.loginReq("groupActionNew", "updateUserRole",params , function (data) {
                if (data && data.code == 0 && data.message) {
                    //cc.log("updateUserRole===",JSON.stringify(data));
                    FloatLabelUtil.comText("设置成功");
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_ROLE_LIST,{userId:self.curTargetUserId});
                    PopupManager.remove(self);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            })
        })

    },


    onRefreshUserRole:function(sender) {
        var userRole = sender.roleData.userRole;
        var userName = "设为" + sender.roleData.name;
        var str = "确认将该成员" + userName + "吗?";
        if (userRole == -3) {
            var pop = new PyqAllotListPop(this);
            PopupManager.addPopup(pop);
            return
        } else {
            str = "确认将该角色" + userName + "吗?";
        }

        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            targetId:this.curUserId,
            optType:2
        };
        //
        //groupId
        //userId 自己的id
        //optType 操作类型：1、分配邀请人，2、降为成员
        //fromId  把fromId分配给targetId
        //targetId  将targetId降为成员
        //
        var self = this;
        AlertPop.show(str,function() {
            NetworkJT.loginReq("groupActionNew", "modifyRelation",params , function (data) {
                if (data && data.code == 0 && data.message) {
                    cc.log("modifyRelation===",JSON.stringify(data));
                    FloatLabelUtil.comText("设置成功");
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_ROLE_LIST,{userId:self.curTargetUserId});
                    PopupManager.remove(self);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            })
        })
    },

    onDeleteUser:function(sender){
        var str = "确认将该成员踢出吗?";
        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            targetUserId:this.curUserId
        };
        var self = this;
        AlertPop.show(str,function() {
            NetworkJT.loginReq("groupActionNew", "deleteUser",params , function (data) {
                if (data && data.code == 0 && data.message) {
                    //cc.log("deleteUser===",JSON.stringify(data));
                    FloatLabelUtil.comText("踢出成功");
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_ROLE_LIST,{userId:self.curTargetUserId});
                    PopupManager.remove(self);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            })
        })
    },

    optUser:function(sender,type,tipStr){
        var self = this;
        var params = {targetId:self.tempData.userId ,userId:PlayerModel.userId,groupId:ClickClubModel.getCurClubId(),sessCode:PlayerModel.sessCode};
        var netType = "updateGroupUser";

        params.optType = 1;
        if(type == "forbid"){//禁止游戏
            params.userState = 0;
        }else if(type == "unforbid"){//解除禁止
            params.userState = 1;
        }

        //cc.log("updateGroupUser::"+JSON.stringify(params));
        AlertPop.show(tipStr,function() {
            NetworkJT.loginReq("groupActionNew", netType, params, function (data) {
                if (data) {
                    FloatLabelUtil.comText(data.message);
                    if(type == "forbid" || type == "unforbid"){
                        self.tempData.userLevel = params.userState;
                        var label = sender.getChildByName("Label_role");
                        self.updateForbidState(label);
                    }
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        })
    },

    updateForbidState:function(sender){
        //sender.setString(this.tempData.userLevel == 1?"禁止游戏":"允许游戏");
        sender.setString("解/禁游戏");
        var img_forbid = this.newItem.getChildByName("img_forbid");
        img_forbid.setVisible(!this.tempData.userLevel);
    }
});

//操作玩家禁止或允许游戏的界面
var ClubOptForbidGamePop = cc.Layer.extend({
    ctor:function(data){
        this._super();

        this.optData = data;

        this.initLayer();
        this.setLayerWithData();
    },

    setLayerWithData:function(){
        if(!this.optData)return;

        this.label_name.setString(this.optData.userName);
        this.label_id.setString(this.optData.userId);
        this.showIcon(this.img_head,this.optData.headimgurl);

        if(this.optData.userRole == 2 || this.optData.userRole == 90000){//管理员或普通成员
            this.check_box_2.setVisible(false);
            this.check_box_1.setPositionY((this.check_box_1.y + this.check_box_2.y)/2);
        }

    },

    initLayer:function(){
        var layerBg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/di1.png");
        layerBg.setContentSize(cc.size(1050,750));
        layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(layerBg);

        var img = "res/ui/bjdmj/popup/x.png";
        var btn_close = new ccui.Button(img,"","");
        btn_close.setPosition(layerBg.width - 23,layerBg.height - 23);
        layerBg.addChild(btn_close);
        UITools.addClickEvent(btn_close,this,this.onClickCloseBtn);

        var label_title = UICtor.cLabel("玩家解/禁游戏",60);
        label_title.setColor(cc.color(100,10,10));
        label_title.setPosition(layerBg.width/2,layerBg.height - 75);
        layerBg.addChild(label_title);

        var img_head = new cc.Sprite("res/ui/common/default_w.png");
        img_head.setPosition(layerBg.width/2 - 120,layerBg.height/2 + 150);
        layerBg.addChild(img_head);

        var label_name = UICtor.cLabel("玩家的名字",45);
        label_name.setTextAreaSize(cc.size(450,50));
        label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        label_name.setColor(cc.color(100,10,10));
        label_name.setAnchorPoint(0,0.5);
        label_name.setPosition(img_head.x + 75,img_head.y + 30);
        layerBg.addChild(label_name);

        var label_id = UICtor.cLabel("ID:1234567",45);
        label_id.setColor(cc.color(100,10,10));
        label_id.setAnchorPoint(0,0.5);
        label_id.setPosition(label_name.x,img_head.y - 30);
        layerBg.addChild(label_id);

        var img = "res/ui/bjdmj/popup/pyq/cygl/jinzhi.png";
        var btn_jinzhi = new ccui.Button(img,"","");
        btn_jinzhi.setPosition(layerBg.width/2 - 240,120);
        layerBg.addChild(btn_jinzhi);

        var img = "res/ui/bjdmj/popup/pyq/cygl/yunxuyouxi.png";
        var btn_yunxu = new ccui.Button(img,"","");
        btn_yunxu.setPosition(layerBg.width/2 + 240,120);
        layerBg.addChild(btn_yunxu);

        var check_box_1 = new SelectBox(1,"操作该玩家");
        check_box_1.setPosition(layerBg.width/2 - 120,layerBg.height/2);
        check_box_1.itemBtn.setContentSize(cc.size(300,120));
        layerBg.addChild(check_box_1);
        check_box_1.setSelected(true);

        var check_box_2 = new SelectBox(1,"操作该玩家\n及下级所有成员");
        check_box_2.setPosition(layerBg.width/2 - 120,layerBg.height/2 - 120);
        check_box_2.itemBtn.setContentSize(cc.size(300,120));
        check_box_2.itemLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        layerBg.addChild(check_box_2);

        check_box_1.addChangeCb(this,this.onSelectBox);
        check_box_2.addChangeCb(this,this.onSelectBox);

        UITools.addClickEvent(btn_jinzhi,this,this.onClickJinzhiBtn);
        UITools.addClickEvent(btn_yunxu,this,this.onClickYunxuBtn)

        this.label_name = label_name;
        this.label_id = label_id;
        this.img_head = img_head;

        this.check_box_1 = check_box_1;
        this.check_box_2 = check_box_2;
    },

    onClickJinzhiBtn:function(){
        var tipStr = "确定禁止该成员在亲友圈中进行游戏吗？";

        if(this.check_box_2.isSelected()){
            tipStr = "确定禁止该成员及下级所有成员在亲友圈中进行游戏吗？";
        }

        this.optUser("forbid",tipStr);
    },

    onClickYunxuBtn:function(){
        var tipStr = "确定允许该成员在亲友圈中进行游戏吗？";

        if(this.check_box_2.isSelected()){
            tipStr = "确定允许该成员及下级所有成员在亲友圈中进行游戏吗？";
        }

        this.optUser("unforbid",tipStr);
    },

    onSelectBox:function(item){
        if(item == this.check_box_1)this.check_box_2.setSelected(false);
        if(item == this.check_box_2)this.check_box_1.setSelected(false);
    },

    onClickCloseBtn:function(){
        PopupManager.remove(this);
    },

    optUser:function(type,tipStr){
        var self = this;
        var params = {targetId:self.optData.userId ,userId:PlayerModel.userId,groupId:ClickClubModel.getCurClubId(),sessCode:PlayerModel.sessCode};
        var netType = "updateGroupUser";

        params.optType = 1;
        if(type == "forbid"){//禁止游戏
            params.userState = 0;
        }else if(type == "unforbid"){//解除禁止
            params.userState = 1;
        }

        params.stateType = 0;//对个人
        if(this.check_box_2.isSelected()){
            params.stateType = 1;//对个人及下级
        }

        //cc.log("updateGroupUser::"+JSON.stringify(params));
        AlertPop.show(tipStr,function() {
            NetworkJT.loginReq("groupActionNew", netType, params, function (data) {
                if (data) {
                    FloatLabelUtil.comText(data.message);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_ROLE_LIST,{userId:self.optData.curTargetUserId});
                    PopupManager.remove(self);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        })
    },

    showIcon: function (spr,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(120/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});


