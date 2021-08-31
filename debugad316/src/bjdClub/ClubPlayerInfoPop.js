/**
 * Created by zyq on 2019/11/9.
 */

var ClubPlayerInfoPop = BasePopup.extend({
    ctor: function (clubData,levelData) {
        this.clubData = clubData
        this.levelData = levelData
        this.clubHeadFrameType = 1;
        this._super("res/clubPlayerInfoPop.json");
    },

    selfRender:function(){
        this.clubHeadFrameType = cc.sys.localStorage.getItem("Change_Club_Head_Frame") || 1;
        cc.log("Change_Club_Head_Frame",cc.sys.localStorage.getItem("Change_Club_Head_Frame"))
        var honorArr = ["富农","财主","富豪","大富翁","子爵","伯爵","侯爵","公爵"]
        var txt_honor = this.getWidget("txt_honor");
        txt_honor.setString(honorArr[ClickClubModel.groupUserLevel-1])
        var txt_exp = this.getWidget("txt_exp");
        txt_exp.setString(this.levelData[ClickClubModel.groupUserLevel-1].exp != 0 ? ClickClubModel.groupUserExp + "/"+ this.levelData[ClickClubModel.groupUserLevel-1].exp:"无")

        this.btn_tips = this.getWidget("btn_tips");
        UITools.addClickEvent(this.btn_tips,this,this.onClickTipsBtn);

        this.ScrollView_frame = this.getWidget("ScrollView_frame");

        this.img_using = new cc.Sprite("res/ui/bjdmj/popup/pyq/playerinfo/img_using.png");
        this.ScrollView_frame.addChild(this.img_using);

        this.loadHeadFrame()
        this.updateHeadFrameState(this.clubHeadFrameType);
    },

    loadHeadFrame: function () {
        var item_frame = ccui.helper.seekWidgetByName(this.ScrollView_frame,"item_btn_frame");
        item_frame.retain()
        item_frame.removeFromParent(true)
        var spaceW = 240;
        var spaceH = 225;
        var lengthW = Math.ceil(this.levelData.length/2)
        var contentW = Math.max(this.ScrollView_frame.width, spaceW * lengthW);
        this.ScrollView_frame.setInnerContainerSize(cc.size(contentW,this.ScrollView_frame.height));
        for(var i = 0;i<this.levelData.length;i++){
            var item = item_frame.clone()
            this.ScrollView_frame.addChild(item)
            item.x = (i%lengthW+0.5)*spaceW;
            item.y = this.ScrollView_frame.height-(Math.floor(i/lengthW)+0.5)*spaceH
            item.loadTextures("res/ui/bjdmj/popup/pyq/playerinfo/img_vip_head_frame_"+ this.levelData[i].level +".png","","")
            item.setTag(i+1)
            UITools.addClickEvent(item,this,this.onClickHeadFrameChange);

            var headimgList = this.levelData[ClickClubModel.groupUserLevel-1].headimgList;//可解锁的头像框索引
            headimgList = headimgList.split(",")
            if(headimgList[i] != i+1){
                item.setTouchEnabled(false)
                var grayLayer = new cc.LayerColor(cc.color(0,0,0,120),item.width,item.height);
                item.addChild(grayLayer);
                var lockImg = new ccui.ImageView("res/ui/bjdmj/popup/pyq/img_suo.png");
                lockImg.setPosition(item.width/2,item.height/2)
                item.addChild(lockImg);
            }
        }
    },

    onClickHeadFrameChange:function(sender){
        if(this.clubHeadFrameType == sender.getTag())return;

        this.clubHeadFrameType = sender.getTag();

        this.updateHeadFrameState(this.clubHeadFrameType);
    },

    updateHeadFrameState:function(tag){
        var frameItem = this.ScrollView_frame.getChildByTag(tag)
        if(frameItem){
            this.img_using.x = frameItem.x
            this.img_using.y = frameItem.y
        }
    },

    onClose:function(){
        cc.sys.localStorage.setItem("Change_Club_Head_Frame",this.clubHeadFrameType);
        var params = {optType:3,userId:PlayerModel.userId,groupId:ClickClubModel.getCurClubId(),frameId:this.clubHeadFrameType,sessCode:PlayerModel.sessCode};
        NetworkJT.loginReq("groupActionNew", "updateGroupUser", params, function (data) {
            if (data) {

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onClickTipsBtn:function(){
        var pop = new ClubTipsPop(2);
        PopupManager.addPopup(pop,9);
    }
})