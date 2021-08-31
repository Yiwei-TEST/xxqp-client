/**
 * Created by cyp on 2019/5/14.
 */
var PyqInviteListPop = BasePopup.extend({
    ctor:function(inviteType){
        this.inviteType = inviteType;
        this.currPage = 1
        this.nextPage = 1
        this.groupId = ClickClubModel.clickClubId
        this._super("res/pyqInviteListPop.json");
    },

    selfRender:function(){
        this.img_title = this.getWidget("img_title");
        this.img_hylb = this.getWidget("img_hylb");
        this.img_title.visible = !(this.inviteType == 2)
        this.img_hylb.visible = this.inviteType == 2

        this.txt_info = this.getWidget("txt_info");
        this.txt_info.setString("可邀请人数:0人");
        this.btn_invite_all = this.getWidget("btn_invite_all");
        this.txt_info.visible = this.btn_invite_all.visible = !(this.inviteType == 1)
        this.listview_user = this.getWidget("listview_user");
        this.item_list = this.getWidget("item_list");
        this.item_list.setVisible(false);

        this.input_bg1 = this.getWidget("input_bg1");
        this.btn_check1 = this.getWidget("btn_check1");
        this.btn_check1.tempData = 0
        UITools.addClickEvent(this.btn_check1,this,this.onClickSearch);
        this.input_bg1.visible = this.btn_check1.visible = this.inviteType == 1

        this.label_no_data = this.getWidget("label_no_data");
        this.label_no_data.setVisible(true);

        UITools.addClickEvent(this.btn_invite_all,this,this.onClickInviteAll);
        UITools.addClickEvent(this.item_list.getChildByName("btn_invite"),this,this.onClickItemInvite);

        this.addCustomEvent("pyq_invite_get_msg",this,this.onGetInviteMsg);

        var input_bg = this.getWidget("input_bg");
        if(this.inviteType == 1){
            input_bg = this.getWidget("input_bg1");
        }
        this.inputUserIdBox = new cc.EditBox(cc.size(input_bg.width, input_bg.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputUserIdBox.setPosition(input_bg.width/2,input_bg.height/2);
        this.inputUserIdBox.setPlaceHolder("输入玩家ID");
        this.inputUserIdBox.setMaxLength(10);
        this.inputUserIdBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputUserIdBox.setFont("Arial",40);
        this.inputUserIdBox.setPlaceholderFont("Arial",40);
        input_bg.addChild(this.inputUserIdBox,1);
        this.onPrivateList()
    },
    //私密房好友列表
    onPrivateList:function(){
        var btn_check = this.getWidget("btn_check")
        btn_check.tempData = 2
        UITools.addClickEvent(btn_check,this,this.onClickSearch);

        this.labelPage = this.getWidget("label_page");
        this.btn_left_page = this.getWidget("btn_left");
        this.btn_right_page = this.getWidget("btn_right");
        UITools.addClickEvent(this.btn_left_page , this , this.onClickLeftPageBtn);
        UITools.addClickEvent(this.btn_right_page , this , this.onClickRightPageBtn);
    },

    onClickLeftPageBtn:function(){
        if(this.currPage > 1){
            this.nextPage = this.currPage - 1
            var inputStr = this.inputUserIdBox.getString();
            this.senderInviteMsg([this.inviteType,this.nextPage,20],inputStr != ""?[inputStr]:[]);
        }
    },

    onClickRightPageBtn:function(){
        this.nextPage = this.currPage +1
        var inputStr = this.inputUserIdBox.getString();
        this.senderInviteMsg([this.inviteType,this.nextPage,20],inputStr != ""?[inputStr]:[]);
    },

    onClickSearch:function(obj){
        this.inviteType = obj.tempData
        this.getCanInviteList()
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        if(this.inviteType != 1){
            this.getCanInviteList();
        }
    },

    onGetInviteMsg:function(event){
        var msg = event.getUserData();
        //cc.log("=========onGetInviteMsg============" + JSON.stringify(msg));
        if(msg.params[0] == "0"){
            this.updateListView(JSON.parse(msg.strParams[1]));
        }else if(msg.params[0] == "1"){
            FloatLabelUtil.comText("邀请成功");
        }else if(msg.params[0] == "2"){
            //cc.log("=========onGetInviteMsg============" + JSON.stringify(msg));
            var data = JSON.parse(msg.strParams[1])
            var inputStr = this.inputUserIdBox.getString()
            if(inputStr != ""){
                if(data.length > 0){
                    this.showCheckUserInfo(data[0])
                }else{
                    FloatLabelUtil.comText("请输入正确的玩家ID");
                }
            }else{
                if(msg.strParams[0]){
                    this.groupId = msg.strParams[0]
                }
                if(data.length > 0){
                    this.currPage = this.nextPage
                    this.labelPage.setString(this.currPage)
                    this.updateListView(JSON.parse(msg.strParams[1]));
                }
            }
        }else if(msg.params[0] == "3"){
            if(msg.strParams[0]){
                this.groupId = msg.strParams[0]
            }
            for(var i = 0;i<this.inviteListData.length;i++){
                if(this.inviteListData[i].keyId == msg.strParams[1]){
                    this.inviteListData.splice(i,1)
                    break;
                }
            }
            this.updateListView(this.inviteListData);
        }
    },

    getCanInviteList:function(){
        var inputStr = this.inputUserIdBox.getString()
        inputStr = inputStr.replace(/[ ]/g,"")//去掉字符串中的空格
        if(this.inviteType == 2){
            this.senderInviteMsg([this.inviteType,this.currPage,20],inputStr != ""?[inputStr]:[]);
        }else{
            this.senderInviteMsg([this.inviteType],inputStr != ""?[inputStr]:[]);
        }
    },

    senderInviteMsg:function(intParam,strParam){
        //cc.log("senderInviteMsg",JSON.stringify(intParam),JSON.stringify(strParam))
        var tIntParam = intParam || [];
        var tStrParam = strParam || [];
        sySocket.sendComReqMsg(80,tIntParam,tStrParam);
    },

    updateListView:function(data){
        this.listview_user.removeAllChildren();
        this.inviteListData = data;
        if(data.length == 0) this.label_no_data.setVisible(true);
        for(var i = 0;i<data.length;++i){
            var item = this.item_list.clone();
            item.setVisible(false);
            this.setItemData(item,data[i]);
            this.listview_user.pushBackCustomItem(item);
        }
        // this.txt_info.setString("可邀请人数:" + (data.length || 0) + "人");
        this.txt_info.setString("");
        this.label_no_data.setVisible(data.length <=0);
    },

    setItemData:function(item,data){
        var img_head = item.getChildByName("img_head");
        var user_name = item.getChildByName("user_name");
        var label_state = item.getChildByName("label_state");

        user_name.setString(data.name);
        this.showIcon(img_head,data.headimgurl);

        var stateStr = "在线空闲";
        if(data.playingTableId){
            label_state.setColor(cc.color(197,25,11));
            stateStr = "房间中";
            if(data.playType){
                stateStr += ("  " + ClubRecallDetailModel.getGameStr(data.playType));
            }
        }
        if(this.inviteType == 2){
            stateStr = "在线空闲";
            if(data.playingTableId){
                stateStr = "房间中";
                label_state.setColor(cc.color(197,25,11));
                item.getChildByName("btn_invite").visible = false;
            }else{
                if(!data.isOnLine){
                    stateStr = "离线";
                    label_state.setColor(cc.color(88,88,88));
                    item.getChildByName("btn_invite").visible = false;
                }
            }
            var btn_delete = new ccui.Button("res/ui/bjdmj/popup/clubInvite/shanchu.png");
            btn_delete.setPosition(item.width/2 + 250,item.height/2);
            item.addChild(btn_delete);
            var self = this;
            UITools.addClickEvent(btn_delete,this,function(){
                AlertPop.show("确认删除该好友吗？",function(){
                    self.senderInviteMsg([3],[self.groupId+"",data.keyId+""]);
                },function(){});
            });
        }
        label_state.setString(stateStr);
    },

    onClickInviteAll:function(){
        var userIdArr = "";
        for(var i = 0;i<this.inviteListData.length;++i){
            var item = this.listview_user.getItem(i);
            if(item && item.getChildByName("btn_invite").isBright()){
                if(i == this.inviteListData.length-1){
                    userIdArr += this.inviteListData[i].userId;
                }else{
                    userIdArr += this.inviteListData[i].userId+",";
                }
            }
        }
        if(userIdArr.length > 0){
            this.senderInviteMsg([1],[userIdArr]);
            var items = this.listview_user.getItems();
            for(var i = 0;i<items.length;++i){
                var btn = items[i].getChildByName("btn_invite");
                btn.setBright(false);
                btn.setTouchEnabled(false);
            }
        }
    },

    onClickItemInvite:function(sender){
        var idx = this.listview_user.getIndex(sender.getParent());
        var userIdArr = [];
        if(this.inviteListData[idx]){
            userIdArr.push(String(this.inviteListData[idx].userId));
        }
        this.senderInviteMsg([1],userIdArr);
        sender.setBright(false);
        sender.setTouchEnabled(false);
    },
    showCheckUserInfo:function(data){
        if(this.getChildByName("checkUserInfo"))return;
        if(!data){
            return;
        }
        var infoBg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/di1.png");
        infoBg.setContentSize(600,450);
        infoBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        infoBg.setName("checkUserInfo");
        this.addChild(infoBg,10);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true},
        }), infoBg);

        var btn_close = new ccui.Button("res/ui/bjdmj/popup/close2.png");
        btn_close.setPosition(infoBg.width - 30,infoBg.height - 30);
        infoBg.addChild(btn_close);
        UITools.addClickEvent(btn_close,this,function(){
            infoBg.removeFromParent(true);
        });

        var btn_invite = new ccui.Button("res/ui/bjdmj/popup/clubInvite/yaoqing1.png");
        btn_invite.setPosition(infoBg.width/2,110);
        infoBg.addChild(btn_invite);
        UITools.addClickEvent(btn_invite,this,function(){
            this.senderInviteMsg([1],[this.inputUserIdBox.getString()]);
        });

        var headImg = new cc.Sprite("res/ui/bjdmj/hall_img_touxiang_2.png");
        headImg.setPosition(infoBg.width/2-120,infoBg.height/2+60);
        infoBg.addChild(headImg);
        this.showIcon(headImg,data.headimgurl);

        var label_name = new cc.LabelTTF(UITools.truncateLabel(data.name,6),"Arial",40);
        label_name.setPosition(infoBg.width/2-40,infoBg.height/2+90);
        label_name.setColor(cc.color(111,23,24));
        label_name.setAnchorPoint(0,0.5)
        infoBg.addChild(label_name,3);

        var label_id = new cc.LabelTTF("ID:" + data.userId,"Arial",40);
        label_id.setPosition(infoBg.width/2-40,infoBg.height/2+30);
        label_id.setColor(cc.color(111,23,24));
        label_id.setAnchorPoint(0,0.5)
        infoBg.addChild(label_id,3);
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
    onCloseHandler : function(){
        this.removeFromParent(true);
    },
});