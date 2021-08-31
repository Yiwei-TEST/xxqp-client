/**
 * Created by leiwenwen on 2018/10/15.
 */
/**
 * 亲友圈所有小组的item
 */
var ClubCreditHandleItem = ccui.Widget.extend({
    ctor:function(data,root,searchNameOrId){
        this.data = data;
        this.parentNode = root;
        this.searchNameOrId = searchNameOrId || "";

        this._super();
        this.setContentSize(1052, 106);

        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(1052,106),cc.color(126,49,2),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);

        var Image_bg=this.Image_bg= UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        Image_bg.setScale9Enabled(true);
        Image_bg.setContentSize(this.getContentSize());
        Image_bg.setPosition(this.width/2,this.height/2);
        Panel_21.addChild(Image_bg);

        var Image_head=this.Image_head= UICtor.cImg("res/ui/common/default_m.png");
        Image_head.setPosition(cc.p(-380+Image_bg.getAnchorPointInPoints().x, Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Image_head);
        var Label_name=this.Label_name= UICtor.cLabel("100",28,cc.size(200,31),cc.color("#6f1816"),1,0);
        Label_name.setPosition(cc.p(-151+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_name);
        var Label_id=this.Label_id= UICtor.cLabel("100",28,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_id.setPosition(cc.p(70+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_id);
        var inviteBtn=this.inviteBtn= UICtor.cBtn("res/ui/bjdmj/popup/extImg/matchImg_16.png");
        inviteBtn.setPosition(cc.p(364+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        inviteBtn.setLocalZOrder(5);
        Image_bg.addChild(inviteBtn);
        var upgradeBtn=this.upgradeBtn= UICtor.cBtn("res/ui/bjdmj/popup/extImg/matchImg_12.png");
        upgradeBtn.setPosition(cc.p(240+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        upgradeBtn.setLocalZOrder(5);
        Image_bg.addChild(upgradeBtn);

        var deleteBtn=this.deleteBtn= UICtor.cBtn("res/ui/bjdmj/popup/extImg/matchImg_11.png");
        deleteBtn.setPosition(cc.p(240+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        deleteBtn.setLocalZOrder(5);
        Image_bg.addChild(deleteBtn);

        var deleteMemberBtn=this.deleteMemberBtn= UICtor.cBtn("res/ui/bjdmj/popup/extImg/matchImg_21.png");
        deleteMemberBtn.setPosition(cc.p(364+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        deleteMemberBtn.setLocalZOrder(5);
        Image_bg.addChild(deleteMemberBtn);

        //inviteBtn.setScale(0.9);
        //upgradeBtn.setScale(0.9);
        //deleteBtn.setScale(0.9);
        //deleteMemberBtn.setScale(0.9);

        inviteBtn.temp = 3;
        upgradeBtn.temp = 1;
        deleteBtn.temp = 2;
        deleteMemberBtn.temp = 2;

        UITools.addClickEvent(inviteBtn,this,this.inviteUser);
        UITools.addClickEvent(upgradeBtn,this,this.updatePromoter);
        UITools.addClickEvent(deleteBtn,this,this.deletePromoter);
        UITools.addClickEvent(deleteMemberBtn,this,this.deleteMember);


        this.addChild(Panel_21);


        this.setData(data);
    },

    /**
     * 对当前id进行操作
     * 1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部Id
     *4、opType：操作类型：1：发展拉手，2：删除拉手，3：邀请到组，4：进组操作，5：删除小组（开启信用分的俱乐部删除小组接口）
     */
    inviteUser:function(obj){
        var opType = obj.temp;
        var searchNameOrId = this.searchNameOrId || "";
        var self = this;
        NetworkJT.loginReq("groupActionNew", "inviteUser", {
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            targetUserId:searchNameOrId,
            opType:opType
        }, function (data) {
            if (data) {
                if(self.parentNode){
                    //cc.log("inviteUser",JSON.stringify(data));
                    if (self.parentNode.ListView_lashou){
                        self.parentNode.ListView_lashou.removeAllItems();
                    }
                    FloatLabelUtil.comText(data.message);
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });

    },

    /**
     * 对当前id进行操作
     * 1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部Id
     *4、opType：操作类型：1：发展拉手，2：删除拉手，3：邀请到组，4：进组操作，5：删除小组（开启信用分的俱乐部删除小组接口）
     */
    updatePromoter:function(obj){
        var opType = obj.temp;
        var searchNameOrId = this.searchNameOrId || "";
        var self = this;
        NetworkJT.loginReq("groupCreditAction", "updatePromoter", {
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            targetUserId:searchNameOrId,
            opType:opType
        }, function (data) {
            if (data) {
                if(self.parentNode){
                    //cc.log("updatePromoter",JSON.stringify(data));
                    if (self.parentNode.ListView_lashou){
                        self.parentNode.ListView_lashou.removeAllItems();
                    }
                    FloatLabelUtil.comText(data.message);
                }

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });

    },

    /**
     * 对当前id进行操作
     * 1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部Id
     *4、opType：操作类型：1：发展拉手，2：删除拉手，3：邀请到组，4：进组操作，5：删除小组（开启信用分的俱乐部删除小组接口）
     */
    deletePromoter:function(obj){
        var opType = obj.temp;
        var searchNameOrId = this.searchNameOrId || "";
        var self = this;
        var str = "确认删除该拉手以及他所有关联的下级和附属成员?";
        AlertPop.show(str,function() {
            NetworkJT.loginReq("groupCreditAction", "deletePromoter", {
                groupId: ClickClubModel.getCurClubId(),
                userId: PlayerModel.userId,
                sessCode: PlayerModel.sessCode,
                targetUserId: searchNameOrId,
                opType: opType
            }, function (data) {
                if (data) {
                    if (self.parentNode) {
                        //cc.log("deletePromoter",JSON.stringify(data));
                        if (self.parentNode.ListView_lashou) {
                            self.parentNode.ListView_lashou.removeAllItems();
                        }
                        FloatLabelUtil.comText(data.message);
                    }

                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });

        })
    },

    /**
     * 对当前id进行操作
     * 1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部Id
     *4、opType：操作类型：1：发展拉手，2：删除拉手，3：邀请到组，4：进组操作，5：删除小组（开启信用分的俱乐部删除小组接口）
     */
    deleteMember:function(obj){
        var opType = obj.temp;
        var searchNameOrId = this.searchNameOrId || "";
        var self = this;
        var str = "确认删除该成员吗？";
        AlertPop.show(str,function() {
            NetworkJT.loginReq("groupCreditAction", "deletePromoter", {
                groupId: ClickClubModel.getCurClubId(),
                userId: PlayerModel.userId,
                sessCode: PlayerModel.sessCode,
                targetUserId: searchNameOrId,
                opType: opType
            }, function (data) {
                if (data) {
                    if (self.parentNode) {
                        //cc.log("deleteMember",JSON.stringify(data));
                        if (self.parentNode.ListView_lashou) {
                            self.parentNode.ListView_lashou.removeAllItems();
                        }
                        FloatLabelUtil.comText(data.message);
                    }

                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });

        })
    },

    //显示数据
    setData:function(data){
        //this.opUserId = data.userId;
        this.userRole = data.userRole || 0;
        this.Label_name.setString(""+data.userName);
        this.Label_id.setString(""+data.userId);

        this.inviteBtn.visible = data.canInvite;
        this.upgradeBtn.visible = data.canUp;
        this.deleteBtn.visible = data.canDelete;
        this.deleteMemberBtn.visible = data.canDeleteMember;

        this.showIcon(data.headimgurl , 1);

    },

    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = this.Image_head;
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if(icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)) {//头像不同才加载
            if (icon.getChildByTag(345)) {
                icon.removeChildByTag(345);
            }
            var sprite = new cc.Sprite(defaultimg);
            sprite.x = icon.width * 0.5;
            sprite.y = icon.height * 0.5;
            icon.addChild(sprite, 5, 345);
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        if (sprite) {
                            sprite.setTexture(img);
                            icon.curShowIconUrl = iconUrl
                        }
                    }
                });
            }
        }
    }

})