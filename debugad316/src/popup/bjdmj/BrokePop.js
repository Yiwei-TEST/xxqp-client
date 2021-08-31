var BrokePop = BasePopup.extend({
    ctor:function(num){
        this.brokeNum = num;
        this._super("res/BrokePop.json");
    },

    selfRender:function(){
        var shareBtn = this.getWidget("shareBtn");
        UITools.addClickEvent(shareBtn,this,this.onClickShareBtn);
        var lingquBtn = this.getWidget("lingquBtn");
        UITools.addClickEvent(lingquBtn,this,this.onClicklingquBtn);
        lingquBtn.setBright(true);
        lingquBtn.setTouchEnabled(true);
        if(BeansConfigModel.aloneConfig){
            this.getWidget("beansNum").setString(BeansConfigModel.aloneConfig.broke+"豆!");
            this.getWidget("giveBeansNum").setString(BeansConfigModel.aloneConfig.brokeShare);
        }
        this.getWidget("broke_num").setString(this.brokeNum+1);
    },
    onClicklingquBtn:function(){
        sySocket.sendComReqMsg(1117,[4]);
    },
    onClickShareBtn:function(){
        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        var content = "";
        obj.title=content;
        obj.pyq=content;
        obj.description=content;
        obj.shareType=0;
        obj.png = "res/feed/feed.jpg";
        obj.session = 1;
        ActivityModel.isBrokeShare = true;
        sySocket.sendComReqMsg(1117,[1]);
        SdkUtil.sdkFeed(obj,true);
    },
    getBrokeBeans:function(){
        var lingquBtn = this.getWidget("lingquBtn");
        lingquBtn.setBright(false);
        lingquBtn.setTouchEnabled(false);
    },
    onClose:function(){
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});

var NewBrokePop = BasePopup.extend({
    ctor:function(num){
        this.brokeNum = num;
        this._super("res/NewBrokePop.json");
    },

    selfRender:function(){
        var shareBtn = this.getWidget("shareBtn");
        UITools.addClickEvent(shareBtn,this,this.onClickShareBtn);
        var lingquBtn = this.getWidget("lingquBtn");
        UITools.addClickEvent(lingquBtn,this,this.onClicklingquBtn);
        lingquBtn.setBright(true);
        lingquBtn.setTouchEnabled(true);

        this.getWidget("broke_num").setString(this.brokeNum+1);
    },
    onClicklingquBtn:function(){
        if (SyConfig.IS_LOAD_AD){
            SdkUtil.byAdvertytoApp("945308403",0,3);
        }else if (SyConfig.IS_LOAD_AD_NEW){
            SdkUtil.byAdvertytoApp("945326640",0,3);
        }
        PopupManager.remove(this);
    },
    onClickShareBtn:function(){
        sySocket.sendComReqMsg(1117,[4]);
        PopupManager.remove(this);
    },
    getBrokeBeans:function(){
        var lingquBtn = this.getWidget("lingquBtn");
        lingquBtn.setBright(false);
        lingquBtn.setTouchEnabled(false);
    },
    onClose:function(){
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});

