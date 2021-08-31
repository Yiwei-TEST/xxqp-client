
var GoldenEggsInfoPop = BasePopup.extend({
    ctor: function () {
        this._super("res/goldenEggsInfoPop.json");
    },

    selfRender: function () {
        //SyEventManager.addEventListener(SyEvent.GOLDEN_EGGS_INVITE,this,this.initInvite);
        this.addCustomEvent(SyEvent.GOLDEN_EGGS,this,this.updateData);
        this.initdata()
        this.initPacket()
        this.updateData()
    },

    initdata:function(){
        this.grayLayer.setOpacity(180);

        var inputIdImg = this.getWidget("Image_inputbg");
        this.inputId = new cc.EditBox(cc.size(inputIdImg.width, inputIdImg.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputId.x = inputIdImg.width/2;
        this.inputId.y = inputIdImg.height/2;
        this.inputId.setFontColor(cc.color("#eaa87d"));
        this.inputId.setPlaceholderFontColor(cc.color("#eaa87d"));
        this.inputId.setFont("res/font/bjdmj/mljcy.ttf",30);
        this.inputId.setMaxLength(30);
        this.inputId.setPlaceHolder("输入邀请到的新用户ID");
        this.inputId.setPlaceholderFont("res/font/bjdmj/mljcy.ttf" , 30);
        this.inputId.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        inputIdImg.addChild(this.inputId,0);

        var Button_sure = this.getWidget("Button_sure");
        UITools.addClickEvent(Button_sure, this , this.onSure);

        this.Button_duihuan = this.getWidget("Button_duihuan");
        UITools.addClickEvent(this.Button_duihuan, this , this.onExchange);

        var Button_share = this.getWidget("Button_share");
        UITools.addClickEvent(Button_share, this , this.onShare);

        var Label_tip_7 = this.getWidget("Label_tip_7");
        Label_tip_7.setString("红包有效期："+this.getEndDate())

        this.ListView_info = this.getWidget("ListView_info");
        this.item_info = this.getWidget("item_info");
        this.item_info.retain()
        this.item_info.removeFromParent(true)
    },

    getEndDate:function(){
        var startDate = GoldenEggsModel.goldenEggsData[0][0]
        startDate = UITools.insertStr(UITools.insertStr(startDate,4,"-"),7,"-")
        var dateTime = new Date(startDate)
        dateTime = dateTime.setDate(dateTime.getDate() + 14);
        dateTime = new Date(dateTime);
        var y = dateTime.getFullYear();
        var m = dateTime.getMonth()+1;
        var d = dateTime.getDate();
        return y+"年"+m+"月"+d+"日"
    },

    onExchange:function(){
        sySocket.sendComReqMsg(139, [110]);
        this.Button_duihuan.visible = false
        if(LayerManager._currentLayer.getName() == LayerFactory.BJD_HOME && LayerManager._currentLayer.btn_golden){
            LayerManager._currentLayer.btn_golden.removeFromParent(true)
        }
        //if(SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW) {/** 如果是可以看视频的包 **/
        //var pop = new NewDuiHuanTipPop();
        //    PopupManager.addPopup(pop);
        //}else{
        //    var pop = new DuiHuanTipPop();
        //    PopupManager.addPopup(pop);
        //}
    },

    initPacket:function(){
        var goldenEggsData = GoldenEggsModel.goldenEggsData
        for(var i = 0;i<7;i++) {
            if (goldenEggsData[i]) {
                var Label_money = this.getWidget("Label_money_" + (i + 1));
                Label_money.setString("")
                var Button_packet = this.getWidget("Button_packet_" + (i + 1));
                UITools.addClickEvent(Button_packet, this , this.onPacket);
                Button_packet.setTouchEnabled(false)
                Button_packet.data = []
                Button_packet.data = goldenEggsData[i]
                Button_packet.data.push(0)
                if (goldenEggsData[i][1] == 1) {
                    Button_packet.loadTextures("res/res_activity/goldeneggs/goldenEggsInfoPop/img_yilingqu.png","","")
                    Label_money.setString(goldenEggsData[i][4]+"元")
                } else if (goldenEggsData[i][1] == -1) {
                    Button_packet.loadTextures("res/res_activity/goldeneggs/goldenEggsInfoPop/img_hongbao_1.png","","")
                }else if (goldenEggsData[i][1] == 0){
                    Button_packet.setTouchEnabled(true)
                }
                var Button_lingqu = this.getWidget("Button_lingqu_" + (i + 1));
                Button_lingqu.data = []
                Button_lingqu.data = goldenEggsData[i]
                UITools.addClickEvent(Button_lingqu, this , this.onGetAgain);
                if (goldenEggsData[i][2] == 0) {
                    Button_packet.loadTextures("res/res_activity/goldeneggs/goldenEggsInfoPop/img_yiguoqi.png", "", "")
                    Button_lingqu.openType = 1
                    Button_lingqu.visible = true
                    Button_lingqu.loadTextures("res/res_activity/goldeneggs/goldenEggsInfoPop/btn_buling.png", "", "")
                } else if (goldenEggsData[i][3] == 0) {
                    Button_lingqu.openType = 2
                    Button_lingqu.visible = true
                    Button_lingqu.loadTextures("res/res_activity/goldeneggs/goldenEggsInfoPop/btn_chongling.png", "", "")
                } else {
                    Button_lingqu.visible = false
                }
            }
        }
    },

    onGetAgain:function(obj){
        GoldenEggsModel.openData = obj.data
        GoldenEggsModel.openType = obj.openType

        if(SyConfig.isIos()){
            var pop = new GoldenEggsPop();
            PopupManager.addPopup(pop);
        }else{
            if(SyConfig.IS_LOAD_AD){
                SdkUtil.byAdvertytoApp("945308403",0,7);
            }else if (SyConfig.IS_LOAD_AD_NEW){
                if(obj.openType == 1){
                    SdkUtil.byAdvertytoApp("945459250",0,7);
                }else if(obj.openType == 2){
                    SdkUtil.byAdvertytoApp("945409934",0,7);
                }
            }
        }
    },

    onPacket:function(obj){
        GoldenEggsModel.openData = obj.data
        GoldenEggsModel.openType = 0
        var pop = new GoldenEggsPop();
        PopupManager.addPopup(pop);
    },

    initInvite:function(){
        this.inputId.setString("");
        this.inputId.setPlaceHolder("输入邀请到的新用户ID");
        var Label_tip_9 = this.getWidget("Label_tip_9");
        Label_tip_9.visible = GoldenEggsModel.inviteData && GoldenEggsModel.inviteData.length == 0
        this.ListView_info.removeAllChildren()
        var inviteData = GoldenEggsModel.inviteData
        this.Button_duihuan.setEnabled(GoldenEggsModel.isCanExchange)

        for(var index in inviteData){
            var item_info = this.item_info.clone()
            this.ListView_info.pushBackCustomItem(item_info);
            var sten=new cc.Sprite("res/huodong_qixi/rank/head_mask.png");
            var clipnode = new cc.ClippingNode();
            clipnode.setPosition(40,item_info.height/2);
            clipnode.setStencil(sten);
            clipnode.setAlphaThreshold(0.8);
            var iconSpr = new cc.Sprite("res/ui/common/default_m.png");
            iconSpr.setScale(60/iconSpr.width);
            clipnode.addChild(iconSpr);
            item_info.addChild(clipnode,1);
            this.showIcon(inviteData[index].headimg,iconSpr);
            var Label_name = ccui.helper.seekWidgetByName(item_info,"Label_name");
            Label_name.setString(UITools.truncateLabel(inviteData[index].name,4))
            var Label_detail = ccui.helper.seekWidgetByName(item_info,"Label_detail");
            if(inviteData[index].jushu >= 10){
                Label_detail.setString("邀请注册成功加0.2元")
            }else{
                Label_detail.setString("参与娱乐场局数"+inviteData[index].jushu+"/10")
            }

        }
    },

    updateData:function(){
        var totalMoney = Number(GoldenEggsModel.totalMoney) || 0
        totalMoney =  totalMoney%1 == 0 ? parseInt(totalMoney):totalMoney.toFixed(1)
        var Label_tip_1 = this.getWidget("Label_tip_1");
        Label_tip_1.setString("已累计"+totalMoney+"元还差")
        var Label_tip_3 = this.getWidget("Label_tip_3");
        var money = Number(10-GoldenEggsModel.totalMoney)||0
        money = money>0?money:0
        money =  money%1 == 0 ? parseInt(money):money.toFixed(1)
        Label_tip_3.setString(""+money)
        var Label_totalmoney = this.getWidget("Label_totalmoney");
        Label_totalmoney.setString(""+totalMoney)
        this.initInvite()
    },

    onSure:function(){
        var userId = parseInt(this.inputId.getString());
        if(userId > 0) {
            sySocket.sendComReqMsg(139, [107,userId]);
        }else{
            FloatLabelUtil.comText("请输入正确的玩家ID");
        }
    },

    showIcon: function (iconUrl, iconSpr) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if (iconUrl) {
            var self = this;
            cc.loader.loadImg(iconUrl, {width: 60, height: 60}, function (error, img) {
                if (!error) {
                    iconSpr.setTexture(img);
                    iconSpr.setScale(60/iconSpr.width);
                    self.url = iconUrl;
                }
            });
        }else{
            iconSpr.initWithFile(defaultimg);
        }
    },

    onShare:function(){
        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        var content = ShareDailyModel.getFeedContent();
        obj.title=content;
        obj.pyq=content;
        obj.description=content;
        obj.shareType=1;
        if (content=="" && SyConfig.hasOwnProperty("HAS_PNG_SHARE")) {//
            obj.shareType=0;
            obj.png = "res/feed/feed.jpg";
        }
        SharePop.show(obj,true);
    },
});






