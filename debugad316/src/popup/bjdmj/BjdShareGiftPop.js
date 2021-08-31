/**
 * Created by cyp on 2019/4/24.
 */
var BjdShareGiftPop = BasePopup.extend({
    ctor:function(){
        this._super("res/bjdShareGiftPop.json");
    },

    selfRender:function(){
        this.root.setLocalZOrder(1);
        var grayLayer = new cc.LayerColor(cc.color(0,0,0,180));
        this.addChild(grayLayer);

        var shareBtn = this.getWidget("btn_share");
        UITools.addClickEvent(shareBtn,this,this.onClickShareBtn);

        if(BeansConfigModel.aloneConfig){
            this.getWidget("beansNum").setString("x"+BeansConfigModel.aloneConfig.share);
        }
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
        ShareDailyModel.isFromShareDaily = true;
        
        SdkUtil.sdkFeed(obj,true);
        ActivityModel.isHomeLayerShare = true;
        var url = "http://bjdqp.firstmjq.club/agent/player/shareTaskCallback/wx_plat/mjqz?";
        var resultUrl = Network.getWebUrl(url);
        // cc.log("resultUrl =",JSON.stringify(resultUrl));
        if (resultUrl){
            Network.onSendShareSuccess(resultUrl);
        }
        // Network.loginReq("qipai","share",{action:2},function(data){
        //     var pop = new AwardPop(BeansConfigModel.aloneConfig.share);
        //     PopupManager.addPopup(pop);
        // })

        
        //Network.loginReq("qipai","share",{action:2},function(data){
        //    FloatLabelUtil.comText("分享成功！恭喜您获得：钻石x"+data.diamond+"!");
        //})
    }
});
