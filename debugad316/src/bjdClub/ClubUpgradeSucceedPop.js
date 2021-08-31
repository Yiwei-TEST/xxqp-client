
var ClubUpgradeSucceedPop = BasePopup.extend({
    ctor:function(data){
        this.data = data;
        this._super("res/clubUpgradeSucceedPop.json");
    },

    selfRender:function(){
        this.root.setLocalZOrder(1);
        var grayLayer = new cc.LayerColor(cc.color(0,0,0,180));
        this.addChild(grayLayer);

        var sureBtn = this.getWidget("btn_sure");
        UITools.addClickEvent(sureBtn,this,this.onClickSureBtn);

        var close_btn = this.getWidget("close_btn");
        UITools.addClickEvent(close_btn,this,this.onClickSureBtn);

        var Image_jinbi = this.getWidget("Image_jinbi");
        Image_jinbi.setVisible(false)
        Image_jinbi.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(function(sender){
            sender.setVisible(true)
        })))

        var Label_jinbi = this.getWidget("Label_jinbi");
        Label_jinbi.setString(this.data[1]+"金币")

        var Image_honor = this.getWidget("Image_honor");
        Image_honor.loadTexture("res/ui/bjdmj/popup/pyq/img_honor_"+this.data[0]+".png")
    },

    onClickSureBtn:function(){
        var groupId = this.data[2]
        if(!groupId){
            groupId = ClickClubModel.getCurClubId()
        }
        NetworkJT.loginReq("groupActionNew", "awardLevelUp", {userId:PlayerModel.userId,sessCode:PlayerModel.sessCode,groupId:groupId,level:this.data[0]}, function (data) {
            if (data) {
                cc.log("升级成功！")
            }
        }, function (data) {
        });
        SyEventManager.dispatchEvent(SyEvent.CLUB_Level_LOG);

        this.onCloseHandler();
    },
});
