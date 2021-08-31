/**
 * Created by Administrator on 2017/7/21.
 */


var ClubTeamDetailItem = ccui.Widget.extend({

    ctor:function(data){
        this.data = data;
        this._super();
        this.setContentSize(1244,106);

        var Panel_22=this.Panel_22= UICtor.cPanel(cc.size(1244,106),cc.color(150,200,255),0);
        Panel_22.setAnchorPoint(cc.p(0,0));
        Panel_22.setPosition(0,0);

        var bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/tiao.png");
        bg.setContentSize(1244,106);
        bg.setPosition(Panel_22.width/2,Panel_22.height/2);
        Panel_22.addChild(bg);

        var lbTeamLeaderName=this.lbTeamLeaderName= UICtor.cLabel("名字要六个字么",30,cc.size(300,34),cc.color(115,29,26),0,0);
        lbTeamLeaderName.setAnchorPoint(0,0.5);
        lbTeamLeaderName.setPosition(110,71);
        Panel_22.addChild(lbTeamLeaderName);
        var lballJushu=this.lballJushu= UICtor.cLabel("100",30,cc.size(0,0),cc.color(115,29,26),1,1);
        lballJushu.setPosition(790,53);
        Panel_22.addChild(lballJushu);
        var lbdayingjia=this.lbdayingjia= UICtor.cLabel("100",30,cc.size(0,0),cc.color(115,29,26),0,0);
        lbdayingjia.setPosition(1050,53);
        Panel_22.addChild(lbdayingjia);
        var lbId=this.lbId= UICtor.cLabel("123456",30,cc.size(0,0),cc.color(186,61,51),0,1);
        lbId.setAnchorPoint(0,0.5);
        lbId.setPosition(110,35);
        Panel_22.addChild(lbId);
        var icon=this.icon= UICtor.cImg("res/ui/common/default_m.png");
        icon.setPosition(60,53);
        Panel_22.addChild(icon);
        var Button_37=this.Button_37= UICtor.cBtn("res/ui/bjdmj/X.png");
        Button_37.setPosition(1150,53);
        Panel_22.addChild(Button_37);

        this.masterIcon = UICtor.cImg("res/ui/bjdmj/popup/pyq/xiaozu/xiaozuzhang.png");
        this.masterIcon.setPosition(500,53);
        Panel_22.addChild(this.masterIcon);
        this.masterIcon.setVisible(false);

        this.Button_37.visible = false;
        this.addChild(Panel_22);
        //添加点击事件
        UITools.addClickEvent(this.Button_37, this, this.onClickRemove);//onClick

        //刷新俱乐部显示
        this.setData(this.data);

    },

    setData:function(tData){
        this.lbTeamLeaderName.setString(tData.userName);
        this.lbdayingjia.setString(tData.dyjCount);
        this.lballJushu.setString(tData.zjsCount);
        this.lbId.setString(tData.userId);
        this.curPlayerId = tData.userId;
        UITools.showIcon(tData.headimgurl,this.icon);
        this.masterIcon.setVisible(tData.isMaster);
    },

    showIcon: function (iconUrl) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = this.icon;
        var defaultimg = "res/ui/common/default_m.png"

        if(icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)){//头像不同才加载

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
                        sprite.setTexture(img);
                        icon.curShowIconUrl = iconUrl
                    }
                });
            }
        }
    },

    showOrHideCloseBtn:function(){
        this.Button_37.visible = !this.Button_37.visible
    },

    onClickRemove:function(){
        AlertPop.show("确定移除该成员么？",this.deleteClubMember.bind(this));
    },

    deleteClubMember:function(){
        cc.log("this.curPlayerId::" , this.curPlayerId);
        var self = this;
        NetworkJT.loginReq("groupAction", "fire", {
            groupId:ClickClubModel.getCurClubId(),
            mUserId:PlayerModel.userId ,
            oUserId:this.curPlayerId,
        }, function (data) {
            cc.log("groupAction::fire..." , JSON.stringify(data));
            FloatLabelUtil.comText("删除成员成功");
            SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_MEMBER_NUMBER);
            sy.scene.hideLoading();
        }, function (data) {
            //FloatLabelUtil.comText("删除成员失败");
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });

    },
});

