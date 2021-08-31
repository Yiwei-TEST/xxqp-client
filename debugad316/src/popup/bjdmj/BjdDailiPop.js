/**
 * Created by cyp on 2019/4/24.
 */

var BjdDailiPop = BasePopup.extend({
    ctor:function(){

        this.wxhStr = "----";

        if(sy.kefuWxData){
            this.wxhStr = sy.kefuWxData[0];
        }

        this._super("res/bjdDailiPop.json");
    },

    selfRender:function(){

        this.webViewNode = new cc.Node();
        this.addChild(this.webViewNode,100);

        var label_wxh = this.getWidget("label_wxh");
        label_wxh.setString("");

        var btn_copy = this.getWidget("btn_copy");
        btn_copy.loadTextureNormal("res/ui/bjdmj/popup/btn_kefu.png");
        btn_copy.setScale(1.3);
        btn_copy.y += 150;
        UITools.addClickEvent(btn_copy,this,this.onClickCopyBtn);
    },

    onClickCopyBtn:function(){
        //SdkUtil.sdkPaste(this.wxhStr);
        //FloatLabelUtil.comText("复制成功");
        this.onKeFu();
    },

    onKeFu:function(){
        var kefuUrl = "http://bjdqp.firstmjq.club/Layim/mobile?";
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
                paramFinalStr= paramFinalStr +"|"+sortedParams[key];
            }else{
                paramFinalStr= sortedParams[key];
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
        var url = kefuUrl + paramStr;
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
