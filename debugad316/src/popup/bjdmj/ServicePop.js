/**
 * Created by cyp on 2019/4/11.
 */
var ServicePop = BasePopup.extend({
    ctor:function(){

        this._super("res/kefuPop.json");

    },

    selfRender:function(){

        this.kfwxStr1 = "----";
        this.kfwxStr2 = "----";
        this.kfwxStr3 = "----";

        this.kfQQStr = "973126888";

        if(sy.kefuWxData){
            this.kfwxStr1 = sy.kefuWxData[0];
            this.kfwxStr2 = sy.kefuWxData[1];
            this.kfwxStr3 = sy.kefuWxData[2];
        }

        var info_label = this.getWidget("info_label");
        var btn_copy = this.getWidget("btn_copy");

        var btn_kefu = this.getWidget("btn_kefu");
        UITools.addClickEvent(btn_kefu, this, this.onKeFu);

        info_label.setVisible(false);
        btn_copy.setVisible(false);

        this.webViewNode = new cc.Node();
        this.addChild(this.webViewNode,100);

        var parent = btn_kefu.getParent();
        btn_kefu.setPosition(parent.width/2,parent.height/2 + 20);
        this.getWidget("label_tip").setPosition(parent.width/2,parent.height/2 - 80);
        //this.showKefuInfo();

        this.addCustomEvent(SyEvent.REMOVE_POP_ALL,this,this.onRemoveAllPop);

    },

    showKefuInfo:function(){
        var info_label = this.getWidget("info_label");
        info_label.y = info_label.y -45;
        info_label.setVisible(true);
        info_label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        info_label.x -= 120;
        info_label.y -= 80;

        var infoStr = this.kfwxStr2 + "\n\n" + this.kfwxStr3;

        infoStr += ("\n\n客服QQ:\n" + this.kfQQStr);

        info_label.setString(infoStr);

        var btn_copy = this.getWidget("btn_copy");
        btn_copy.setScale(0.7);
        btn_copy.setVisible(true);
        btn_copy.setPosition(675,350);
        btn_copy.setTag(1);
        UITools.addClickEvent(btn_copy,this,this.onClickCopy);

        var parent = btn_copy.getParent();

        //var btn_copy2 = btn_copy.clone();
        //btn_copy2.setTag(2);
        //btn_copy2.y  = 335;
        //parent.addChild(btn_copy2);

        var btn_copy3 = btn_copy.clone();
        btn_copy3.setTag(3);
        btn_copy3.y  = 230;
        parent.addChild(btn_copy3);

        var btn_copy4 = btn_copy.clone();
        btn_copy4.setTag(4);
        btn_copy4.y  = 100;
        parent.addChild(btn_copy4);
    },

    onRemoveAllPop:function(){
        if (this.webView) {
            SdkUtil.setOrientation(1);
            this.webView.removeFromParent();
            this.webView = null;
        }
        PopupManager.removeAll();
    },

    onClickCopy:function(sender){
        var tag = sender.getTag();
        var str = "";
        if(tag == 1)str = this.kfwxStr1;
        if(tag == 2)str = this.kfwxStr2;
        if(tag == 3)str = this.kfwxStr3;
        if(tag == 4)str = this.kfQQStr;
        cc.log("========onClickCopy=========",str);
        SdkUtil.sdkPaste(str);
        FloatLabelUtil.comText("复制成功");
    },

    onKeFu:function(sender){
        var kefuUrl = SdkUtil.COMMON_HTTP_URL + "/Layim/mobile?";
        if (SyConfig.isAndroid()){
            kefuUrl = "http://bjdqp.firstmjq.club/Layim/mobile?";
        }
        var timeKf = new Date().getTime();
        var sortedParams = {
            "userid": PlayerModel.userId,
            "username":PlayerModel.name,
            "usericon":PlayerModel.headurl,
            "time":timeKf,
            "key":"fgfklfghutrfj52bjdcnfsdfddszhjlimsamcn"
        }

        var paramFinalStr = "";
        var paramStr = "";
        for(var key in sortedParams){
            if (key != "userid"){
                paramFinalStr = paramFinalStr +"|"+sortedParams[key];
            }else{
                paramFinalStr = sortedParams[key];
            }

        }
        sortedParams.sign = md5(paramFinalStr);
        for(var key in sortedParams){
            var str = "";
            if (key == "username"){
                str = key+"="+encodeURIComponent(sortedParams[key]);
            }else{
                str =  key+"="+sortedParams[key];
            }
            paramStr += "&"+str;
        }
        var url = kefuUrl+paramStr;
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            var result = SdkUtil.setOrientation(2);
            if (result == false) {
                SdkUtil.sdkOpenUrl(url);
                return;
            }
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    //cc.log("OnJSCallback:" + url);
                    SdkUtil.setOrientation(1);
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    }
});