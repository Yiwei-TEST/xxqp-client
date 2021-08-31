/**
 * Created by cyp on 2019/5/14.
 */
var PyqBeInvitePop = BasePopup.extend({
    ctor:function(){

        this.msgDataArr = [];

        this._super("res/pyqBeInvitePop.json");
    },

    selfRender:function(){
        this.listview_user = this.getWidget("listview_user");
        this.btn_item = this.getWidget("btn_item");
        this.btn_item.setVisible(false);
        this.btn_close = this.getWidget("btn_close");

        this.btn_refuse_all = this.getWidget("btn_refuse_all");
        this.btn_refuse = this.getWidget("btn_refuse");
        this.btn_join = this.getWidget("btn_join");

        UITools.addClickEvent(this.btn_item,this,this.onClickItemBtn);
        UITools.addClickEvent(this.btn_refuse_all,this,this.onClickRefuseAllBtn);
        UITools.addClickEvent(this.btn_refuse,this,this.onClickRefuseBtn);
        UITools.addClickEvent(this.btn_join,this,this.onClickJoinBtn);
        UITools.addClickEvent(this.btn_close,this,this.onClickCloseBtn);

        this.addCustomEvent("pyq_invite_get_msg",this,this.onGetInviteMsg);

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        this.getWidget("item_txt_1").setString("");
    },

    addOneMsg:function(msg){
        var data = JSON.parse(msg.strParams[0]);
        this.checkMsg(data);
        this.msgDataArr.unshift(data);
        if(this.msgDataArr.length > 5)this.msgDataArr.length = 5;
        var item = this.btn_item.clone();
        this.setItemData(item,data);
        if(this.listview_user.getItems().length == 5){
            this.listview_user.removeLastItem();
        }
        this.listview_user.insertCustomItem(item,0);
        this.setContentData(0);

    },

    //把之前相同房间号的旧的邀请消息删除掉
    checkMsg:function(data){
        for(var i = 0;i<this.msgDataArr.length;++i){
            if(data.tableId == this.msgDataArr[i].tableId){
                this.msgDataArr.splice(i,1);
                this.listview_user.removeItem(i);
                break;
            }
        }
    },

    setItemData:function(item,data){
        item.setVisible(true);
        var img_head = item.getChildByName("img_head");
        img_head.setVisible(false);
        var label_name = item.getChildByName("label_name");
        var label_id = item.getChildByName("label_id");
        // this.showIcon(img_head,data.icon);
        // label_name.setString(data.name);
        label_name.setString(data.tableName);
        // label_id.setString("ID:" + data.userId);

    },

    setContentData:function(idx){
        var items = this.listview_user.getItems();
        this.curItemIdx = idx;
        for(var i = 0;i<items.length;++i){
            items[i].setBright(i == idx);
        }
        var data = this.msgDataArr[idx];
        var label_tip = this.getWidget("label_tip");
        var label_bag_name = this.getWidget("label_bag_name");
        var label_club_name = this.getWidget("label_club_name");
        var label_wanfa = this.getWidget("label_wanfa");
        // label_tip.setString(data.name + "邀请您加入亲友圈房间(房间号:" + data.tableId + ")");
        label_tip.setString("邀请您加入亲友圈房间(房间号:" + data.tableId + ")");
        label_bag_name.setString(data.tableName);
        label_club_name.setString(data.groupName + "(ID:" + data.groupId + ")");

        var tableMsg = JSON.parse(data.tableMsg);
        var gameId = tableMsg.ints.split(",")[1];
        var gameName = ClubRecallDetailModel.getGameStr(gameId);
        var wanfaStr = ClubRecallDetailModel.getWanfaStr(tableMsg.ints);
        var creditMsg = data.creditMsg;
        var params = creditMsg?creditMsg.split(",") : [];
        if(params[0] == 1){
            wanfaStr += " 比赛房";
        }
        label_wanfa.setString(gameName + " " +  wanfaStr);

        for(var i = 0;i<3;++i){
            var player = this.getWidget("player_" + (i+1));
            if(i<data.members.length){
                player.setVisible(true);
                var player_name = player.getChildByName("Label_myName");
                var player_id = player.getChildByName("Label_myId");
                var player_icon = player.getChildByName("Image_head");
                // player_name.setString(data.members[i].userName);
                // player_id.setString("ID:" + data.members[i].userId);
                // this.showIcon(player_icon,data.members[i].headimgurl);
                player.setVisible(false);
            }else{
                player.setVisible(false);
            }
        }

    },

    onGetInviteMsg:function(event){
        var msg = event.getUserData();
        cc.log("=========onGetInviteMsg============" + JSON.stringify(msg));
        if(msg.params[0] == "100"){
            this.addOneMsg(msg);
        }
    },

    onClickItemBtn:function(sender){
        var idx = this.listview_user.getIndex(sender);
        this.setContentData(idx);
    },

    onClickRefuseAllBtn:function(){
        this.onCloseHandler();
        this.setCloseInviteTime();
    },

    onClickRefuseBtn:function(){
        var items = this.listview_user.getItems();
        if(items.length > 1){
            this.listview_user.removeItem(this.curItemIdx);
            this.msgDataArr.splice(this.curItemIdx,1);
            this.setContentData(0);
        }else{
            this.onCloseHandler();
            this.setCloseInviteTime();
        }
    },

    onClickJoinBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(this.msgDataArr[this.curItemIdx]){
            this.tableId = this.msgDataArr[this.curItemIdx].tableId;
            sy.scene.showLoading("正在进入房间");
            this.isClickJoinBtn = true;
            var tableMsg = JSON.parse(this.msgDataArr[this.curItemIdx].tableMsg)
            //cc.log("===========onClickJoinBtn===========" + JSON.stringify(tableMsg.type));

            //var callBack = function(){
                sySocket.sendComReqMsg(29 , [0] , this.tableId + "");
            //}.bind(this);
            //sy.scene.updatelayer.getUpdatePath(tableMsg.type,callBack);
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status == ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        sy.scene.hideLoading();
        if(this.isClickJoinBtn == true){
            this.isClickJoinBtn = false;
            sySocket.sendComReqMsg(2,[parseInt(this.tableId),1]);
        }
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
            spr.setScale(imgNode.width/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(imgNode.width/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onClickCloseBtn:function(){
        PopupManager.remove(this);
        this.setCloseInviteTime();
    },

    //主动关闭邀请弹窗设置关闭时间，用于判断关闭后一段时间内弹邀请弹窗
    setCloseInviteTime:function(){
        var closeTime = new Date().getTime();
        cc.sys.localStorage.setItem("sy_close_invite_pop_time",closeTime);
    },
});

var InviteMsgHandler = {
    handleMsg:function(msg){
        cc.log("==========InviteMsgHandler======handleMsg=======" + JSON.stringify(msg));
        var isShowInvitePop = this.checkCloseInviteTime();

        if(PopupManager.hasClassByPopup(PyqBeInvitePop))isShowInvitePop = false;

        if(isShowInvitePop && msg.params[0] == 100){
            var pop = new PyqBeInvitePop();
            pop.addOneMsg(msg);
            PopupManager.addPopup(pop);
        }
    },

    checkCloseInviteTime:function(){
        var nowTime = new Date().getTime();
        var closeTime = cc.sys.localStorage.getItem("sy_close_invite_pop_time");
        if(closeTime && (nowTime - closeTime < 30000)){
            return false;
        }
        return true;
    },
}