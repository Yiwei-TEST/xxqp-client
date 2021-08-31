/**
 * Created by cyp on 2019/4/9.
 */
var PlayerMsgPop = BasePopup.extend({
    homeLayer:null,
    ctor:function(parent){

        this.homeLayer = parent;

        this._super("res/playerMsgPop.json");
    },

    selfRender:function(){
        this.list_view = this.getWidget("list_view_msg");
        this.list_item = this.getWidget("list_item");
        this.noMsg = this.getWidget("label_no_data");

        UITools.addClickEvent(this.list_item.getChildByName("btn_agree"),this,this.onClickAgree);
        UITools.addClickEvent(this.list_item.getChildByName("btn_refuse"),this,this.onClickRefuse);

        this.getClubMessageListData();
    },

    /**
     * 获取消息数据
     */
    getClubMessageListData:function(){
        var self = this;
        NetworkJT.loginReq("groupAction", "searchGroupReview", {
                msgType:0,
                userId:PlayerModel.userId},
            function (data) {
                if (data) {
                    cc.log("searchGroupReview::"+JSON.stringify(data));
                    self.refeshMessageList(data);
                }
            }, function (data) {
                cc.log("searchGroupReview::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
    },

    refeshMessageList:function(data){

        var menberDataList = data.message;
        var oData  = data.data;

        this.list_view.removeAllChildren();

        if(!menberDataList){
            this.noMsg.visible = true;
            return;
        }

        this.noMsg.visible = (menberDataList.length == 0);

        for(var index = 0 ; index < menberDataList.length; index++){
            var item = this.list_item.clone();
            item.setVisible(true);
            this.setItemData(item,menberDataList[index],oData[index]);
            this.list_view.pushBackCustomItem(item);
        }

    },

    setItemData:function(item,data,oData){
        this.reviewMode = data.reviewMode || 0;
        item.getChildByName("club_id").setString("亲友圈ID:"+data.groupId);
        item.getChildByName("club_name").setString("亲友圈名:"+data.groupName);
        item.getChildByName("user_id").setString("邀请人ID:" + data.currentOperator);
        var str = "邀请您加入亲友圈";
        if(data.reviewMode == 3){
            str = "邀请您进入小组";
        }
        item.getChildByName("user_tip").setString(str);
        item.getChildByName("btn_agree").tempData = data;
        item.getChildByName("btn_refuse").tempData = data;
        var headimgurl = null;
        if (oData && oData.headimgurl){
            headimgurl = oData.headimgurl;
        }
        this.showIcon(item.getChildByName("head_img"),headimgurl , 1);
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
            spr.setScale(160/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(160/spr.width);
                }
            });
        }
    },

    onClickAgree:function(sender){
        this.applyMsgOpt(sender.tempData,1);
    },

    onClickRefuse:function(sender){
        this.applyMsgOpt(sender.tempData,0);
    },

    applyMsgOpt:function(data,type){
        cc.log("=========applyMsgOpt=========",data.reviewMode,type);
        //if (data.reviewMode == 3){
            var self = this;
            NetworkJT.loginReq("groupActionNew", "responseInvite", {
                groupId:ClickClubModel.getCurClubId(),
                userId:PlayerModel.userId,
                sessCode:PlayerModel.sessCode,
                keyId:data.keyId,
                respType:type//=进组操作的类型：1：同意，其他：拒绝
            }, function (data) {
                if (data) {
                    self.getClubMessageListData();
                }
            }, function (data) {
                cc.log("searchGroupInfo::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
        //}else {
        //    var self = this;
        //    NetworkJT.loginReq("groupAction", "responseGroupReview", {
        //        userId: PlayerModel.userId,
        //        msgType: 0,
        //        value: type,
        //        keyId: data.keyId,
        //        reviewMode: data.reviewMode
        //    }, function (data) {
        //        if (data) {
        //            self.getClubMessageListData();
        //        }
        //    }, function (data) {
        //        cc.log("searchGroupInfo::" + JSON.stringify(data));
        //        FloatLabelUtil.comText(data.message);
        //    });
        //}
    },

    onClose:function(){
        if(this.list_view.getItems().length <= 0){
            this.homeLayer.updateMsgRed();
        }
    },
});