/**
 * Created by cyp on 2019/5/14.
 */
var PyqAllotListPop = BasePopup.extend({
    ctor:function(root){
        this.root = root;
        this.curRoleArr = root.curRoleArr || [];
        this.curUserId = 0;
        //cc.log("this.curRoleArr==",JSON.stringify(this.curRoleArr))
        this._super("res/pyqAllotListPop.json");
    },

    selfRender:function(){

        //this.txt_info = this.getWidget("txt_info");
        //this.txt_info.setString("可邀请人数:0人");


        this.listview_user = this.getWidget("listview_user");
        this.item_list = this.getWidget("item_list");
        this.item_list.setVisible(false);
        var btnTrue = this.getWidget("btnTrue");
        var Image_kuang = this.item_list.getChildByName("Image_kuang");
        Image_kuang.visible = false;

        this.label_no_data = this.getWidget("label_no_data");
        this.label_no_data.setVisible(false);
        this.item_list.setTouchEnabled(true);


        UITools.addClickEvent(btnTrue,this,this.onClickTrue);


        var input_bg = this.getWidget("input_bg");

        this.inputBox = new cc.EditBox(cc.size(input_bg.width - 90, input_bg.height - 10),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = input_bg.width/2 - 40;
        this.inputBox.y = input_bg.height/2;
        this.inputBox.setPlaceholderFont("Arial",40);
        this.inputBox.setPlaceHolder("输入ID");
        input_bg.addChild(this.inputBox,1);
        this.inputBox.setFont("Arial",40);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

        this.btn_search = this.getWidget("btn_search");

        UITools.addClickEvent(this.btn_search , this , this.onClickClubSearch);

    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.showAllotListData();
    },

    showAllotListData:function(){
        for(var i = 0;i < this.curRoleArr.length;i++){
            if (this.curRoleArr[i] && this.curRoleArr[i].userRole != 0){
                var item = this.item_list.clone();
                item.setVisible(true);
                this.setItemData(item,this.curRoleArr[i]);
                this.listview_user.pushBackCustomItem(item);
                item.allotData = this.curRoleArr[i];
                UITools.addClickEvent(item,this,this.onClickItemInvite);
            }
        }
    },

    onClickClubSearch:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));
        cc.log("=========onClickClubSearch===========")
        var userid  = this.inputBox.getString();
        if (userid && userid != ""){
            this.getClubUserListAdmin(0,userid);
        }

    },

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

                for(var i = 0;i < userAdminList.length;++i){
                    userAdminList[i].name = ClickClubModel.getClubRoleName(userAdminList[i].userRole,userAdminList[i].promoterLevel);
                    curRoleArr.push(userAdminList[i]);
                }

                self.listview_user.removeAllItems();

                for(var i = 0;i<curRoleArr.length;++i){
                    var item = self.item_list.clone();
                    item.setVisible(true);
                    self.setItemData(item,curRoleArr[i]);
                    self.listview_user.pushBackCustomItem(item);
                    item.allotData = curRoleArr[i];
                    UITools.addClickEvent(item,self,self.onClickItemInvite);
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });
    },

    setItemData:function(item,data){
        var user_name = item.getChildByName("user_name");
        var user_id = item.getChildByName("user_id");
        var user_role = item.getChildByName("user_role");

        var nameStr = data.userName || "";
        nameStr = UITools.truncateLabel(nameStr,5);
        user_name.setString(nameStr);
        user_id.setString(data.userId || "");

        user_role.setString(data.name || "");

        var btn_invite = item.getChildByName("btn_invite");
        btn_invite.setBright(false);
        btn_invite.setTouchEnabled(false);
    },

    onClickItemInvite:function(sender){
        var items = this.listview_user.getItems();
        for(var i = 0;i<items.length;++i){
            var Image_kuang = items[i].getChildByName("Image_kuang");
            Image_kuang.visible = false;

            var btn_invite = items[i].getChildByName("btn_invite");
            btn_invite.setBright(false);
            btn_invite.setTouchEnabled(false);
        }

        var Image_kuang = sender.getChildByName("Image_kuang");
        Image_kuang.visible = true;

        var btn_invite = sender.getChildByName("btn_invite");
        btn_invite.setBright(true);
        btn_invite.setTouchEnabled(false);

        this.curUserId = sender.allotData.userId || 0;

    },

    onClickTrue:function(){
        if (this.curUserId){
            PopupManager.remove(this);
            SyEventManager.dispatchEvent(SyEvent.CLUB_ALLOT_USER,{userId:this.curUserId});
        }else{
            FloatLabelUtil.comText("未选择邀请人");
        }
    }

});