/**
 * Created by Administrator on 2017/7/21.
 */


var ClubTeamItem = ccui.Widget.extend({

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

        var lbTeamName=this.lbTeamName= UICtor.cLabel("群组的名字要长一点",30,cc.size(240,34),cc.color(115,29,26),1,0);
        lbTeamName.setAnchorPoint(cc.p(0.5,0.5));
        lbTeamName.setPosition(430,53);
        Panel_22.addChild(lbTeamName);
        var icon=this.icon= UICtor.cImg("res/ui/common/default_m.png");
        icon.setPosition(60,53);
        Panel_22.addChild(icon);
        var lbTeamLeaderName=this.lbTeamLeaderName= UICtor.cLabel("名字要六个字么",28,cc.size(200,34),cc.color(115,29,26),0,0);
        lbTeamLeaderName.setAnchorPoint(cc.p(0,0.5));
        lbTeamLeaderName.setPosition(cc.p(50+icon.x, 18+icon.y));
        Panel_22.addChild(lbTeamLeaderName);
        var lbTeamLeaderName_0=this.lbTeamLeaderName_0= UICtor.cLabel("ID:123456",28,cc.size(0,0),cc.color(186,61,51),0,1);
        lbTeamLeaderName_0.setAnchorPoint(cc.p(0,0.5));
        lbTeamLeaderName_0.setPosition(cc.p(50+icon.x, -18+icon.y));
        Panel_22.addChild(lbTeamLeaderName_0);
        var lbrenshu=this.lbrenshu= UICtor.cLabel("1",28,cc.size(0,0),cc.color(115,29,26),1,0);
        lbrenshu.setPosition(650,53);
        Panel_22.addChild(lbrenshu);
        var lbjushu=this.lbjushu= UICtor.cLabel("100",28,cc.size(0,0),cc.color(115,29,26),0,0);
        lbjushu.setPosition(850,53);
        Panel_22.addChild(lbjushu);
        var lbjuBigWinner=this.lbjuBigWinner= UICtor.cLabel("100",28,cc.size(0,0),cc.color(115,29,26),0,0);
        lbjuBigWinner.setPosition(1050,53);
        Panel_22.addChild(lbjuBigWinner);
        var Button_Delete=this.Button_Delete= UICtor.cBtn("res/ui/bjdmj/X.png");
        Button_Delete.setPosition(1150,53);
        Panel_22.addChild(Button_Delete);


        this.Button_Delete.visible = false;
        this.Panel_22.setTouchEnabled(true);
        this.addChild(Panel_22);
        //添加点击事件
        UITools.addClickEvent(this.Button_Delete, this, this.onClickRemove);//onClick
        UITools.addClickEvent(this.Panel_22 , this , this.clubTeamDetail);

        //刷新俱乐部显示
        this.setData(this.data);
    },


    onClickRemove:function(){
        AlertPop.show("确定删除该小组和小组内所有成员么？",this.deleteClubTeam.bind(this))
    },

    deleteClubTeam:function(){

        var self = this;
        NetworkJT.loginReq("groupAction", "updateGroupTeam", {
            mUserId:PlayerModel.userId ,
            keyId:this.teamKeyId,
            teamName:"deleteTeam",
            msgType:"delete"
        }, function (data) {
            cc.log("updateGroupTeam..." , JSON.stringify(data));
            FloatLabelUtil.comText("删除小组成功");
            SyEventManager.dispatchEvent(SyEvent.CLUB_DELETE_TEAM_SUC ,{teamKeyId : self.teamKeyId});
            sy.scene.hideLoading();
        }, function (data) {
                FloatLabelUtil.comText(data.message);
                sy.scene.hideLoading();
        });
    },

    clubTeamDetail:function(){
        cc.log("click club Team item ");
        //直接显示界面在界面里去获取数据
        SyEventManager.dispatchEvent(SyEvent.OPEN_TEAM_DETAIL ,{teamKeyId : this.teamKeyId});
        //PopupManager.addPopup(new ClubTeamDetailPop(this.teamKeyId));
    },

    setData:function(itemData){
        var tData = itemData;
        this.teamName = itemData.teamName;
        this.teamKeyId = itemData.userGroup;
        this.leaderName = itemData.name;
        this.renshu = itemData.userCount;
        cc.log("ClubTeamItem setData::" , this.teamKeyId);
        this.lbTeamName.setString(itemData.teamName);
        this.lbTeamLeaderName.setString(itemData.name);
        this.lbrenshu.setString(itemData.userCount);
        this.lbjushu.setString(itemData.zjsCount);
        this.lbjuBigWinner.setString(itemData.dyjCount);
        this.lbTeamLeaderName_0.setString("ID:"+itemData.userId);

        this.showIcon(itemData.headimgurl);
    },

    showIcon: function (iconUrl) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = iconUrl;
        //var icon = this.getWidget("icon_" + index);
        var icon = this.icon;
        var defaultimg = "res/ui/common/default_m.png";

        if(icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)){//头像不同才加载

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

    getTeamKeyId:function(){
        return this.teamKeyId || 0;
    },

    showOrHideCloseBtn:function(){
        this.Button_Delete.visible = !this.Button_Delete.visible
    },
});

