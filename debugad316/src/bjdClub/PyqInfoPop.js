/**
 * Created by zyq on 2019/11/8.
 */

var PyqInfoPop = BasePopup.extend({
    ctor:function(clubData,levelData){
        this.clubData = clubData
        this.levelData = levelData
        this._super("res/pyqInfoPop.json");
    },

    selfRender:function(){
        if(ClickClubModel.getIsSwitchCoin()){
            this.clubBgType = cc.sys.localStorage.getItem("sy_club_bg_type"+ClickClubModel.getCurClubId()) || 1;
        }else{
            this.clubBgType = cc.sys.localStorage.getItem("sy_club_bg_type") || 1;
        }
        this.clubZbType = cc.sys.localStorage.getItem("zuozitype") || 1;

        this.select_kuang_1 = this.getWidget("select_kuang_1");
        this.select_kuang_2 = this.getWidget("select_kuang_2");

        var btn_tips = this.getWidget("btn_tips");
        UITools.addClickEvent(btn_tips,this,this.onClickTipsBtn);

        this.ScrollView_bg = this.getWidget("ScrollView_bg");
        this.ScrollView_bg.setScrollBarEnabled(false)

        this.setData()
        this.loadBgList()

        this.btn_zb_1 = this.getWidget("btn_zb_1");
        this.btn_zb_2 = this.getWidget("btn_zb_2");

        this.btn_zb_1.setTag(1);
        this.btn_zb_2.setTag(2);

        UITools.addClickEvent(this.btn_zb_1,this,this.onClickZbChange);
        UITools.addClickEvent(this.btn_zb_2,this,this.onClickZbChange);

        this.updateBgBtnState(this.clubBgType);
        this.updateZbBtnState();
    },

    loadBgList:function() {
        var item_bg = ccui.helper.seekWidgetByName(this.ScrollView_bg, "item_btn_bg");
        item_bg.retain()
        item_bg.removeFromParent(true)
        var spaceW = 300;
        var contentW = Math.max(item_bg.width, spaceW * this.levelData.length);
        this.ScrollView_bg.setInnerContainerSize(cc.size(contentW,item_bg.height));

        for (var i = 0; i < this.levelData.length; i++) {
            var item = item_bg.clone();
            this.ScrollView_bg.addChild(item);
            item.x = (i+0.5)*spaceW;
            item.loadTextures("res/ui/bjdmj/popup/pyq/bg/img_set_bg_"+ (i+1) +".png","","")
            item.setTag(i+1)
            UITools.addClickEvent(item,this,this.onClickBgChange);


            var bgList = this.levelData[ClickClubModel.groupLevel-1].bgList;//可解锁的背景索引
            bgList = bgList.split(",")
            var bgimgIdx = bgList[i]
            if(bgimgIdx != i+1){
                item.setTouchEnabled(false)
                var grayLayer = new cc.LayerColor(cc.color(0,0,0,120),item.getContentSize().width,item.getContentSize().height);
                item.addChild(grayLayer);
                var lockImg = new ccui.ImageView("res/ui/bjdmj/popup/pyq/img_suo.png");
                lockImg.setPosition(item.getContentSize().width/2 - 50,item.getContentSize().height/2)
                lockImg.setAnchorPoint(1,0.5)
                item.addChild(lockImg);
                var lockFunc = function(){
                    for(var j = ClickClubModel.groupLevel; j<this.levelData.length;j++){
                        var bgList1 = this.levelData[j].bgList.split(",")
                        var bBreak = false;
                        for(var k = 0;k < bgList1.length;k++){
                            if(i+1 == bgList1[k]){
                                var lockLabel = UICtor.cLabel(this.levelData[j].level+"级解锁",36);
                                lockLabel.setPosition(item.getContentSize().width/2-30,item.getContentSize().height/2)
                                lockLabel.setAnchorPoint(0,0.5)
                                item.addChild(lockLabel);
                                bBreak = true;
                                break;
                            }
                        }
                        if(bBreak) break;
                    }
                }.bind(this);
                lockFunc();
            }
        }
    },
    
    setData:function() {
        var txt_qyqmc = this.getWidget("txt_qyqmc");
        var txt_qyqdj = this.getWidget("txt_qyqdj");
        var txt_qyqrs = this.getWidget("txt_qyqrs");
        var txt_qyqid = this.getWidget("txt_qyqid");
        var txt_xydj = this.getWidget("txt_xydj");
        txt_qyqmc.setString(ClickClubModel.getCurClubName())
        txt_qyqdj.setString(ClickClubModel.groupLevel+"级")
        txt_qyqrs.setString(ClickClubModel.getCurClubMemberNum())
        txt_qyqid.setString(ClickClubModel.getCurClubId())
        txt_xydj.setString(this.levelData[ClickClubModel.groupLevel-1].exp != 0 ? ClickClubModel.groupExp+"/"+this.levelData[ClickClubModel.groupLevel-1].exp :"无")
    },

    onClickBgChange:function(sender){
        if(this.clubBgType == sender.getTag())return;

        this.clubBgType = sender.getTag();

        this.updateBgBtnState(this.clubBgType);

        SyEventManager.dispatchEvent("Change_Club_Bg",this.clubBgType);
    },

    onClickZbChange:function(sender){
        if(this.clubZbType == sender.getTag())return;

        this.clubZbType = sender.getTag();

        this.updateZbBtnState();

        SyEventManager.dispatchEvent("Change_Club_Zb",this.clubZbType);
    },

    updateBgBtnState:function(tag){
        var bgItem = this.ScrollView_bg.getChildByTag(tag)
        if(bgItem){
            this.select_kuang_1.setPosition(bgItem.getPosition());
        }
    },

    updateZbBtnState:function(){
        if(this["btn_zb_" + this.clubZbType]){
            this.select_kuang_2.setPosition(this["btn_zb_" + this.clubZbType].getPosition());
        }
    },

    onClickTipsBtn:function(){
        var pop = new ClubTipsPop(1);
        PopupManager.addPopup(pop,9);
    },

    onClose:function(){
        if(ClickClubModel.getIsSwitchCoin()){
            cc.sys.localStorage.setItem("sy_club_bg_type"+ClickClubModel.getCurClubId(),this.clubBgType);
        }else{
            cc.sys.localStorage.setItem("sy_club_bg_type",this.clubBgType);
        }
        cc.sys.localStorage.setItem("zuozitype",this.clubZbType);
    },
})