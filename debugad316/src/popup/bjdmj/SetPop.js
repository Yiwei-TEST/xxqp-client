/**
 * Created by cyp on 2019/3/12.
 */
var SetPop = BasePopup.extend({
    bgMusic:1,
    ctor:function(){
        this._super("res/SetPop.json");
    },

    selfRender:function(){
        this.btn_yinyue = this.getWidget("btn_yy");
        this.btn_yinxiao = this.getWidget("btn_yx");

        UITools.addClickEvent(this.btn_yinyue, this, this.onClickYinYue);
        UITools.addClickEvent(this.btn_yinxiao, this, this.onClickYinXiao);
        UITools.addClickEvent(this.getWidget("btn_swich"), this, this.onClickQieHuan);

        UITools.addClickEvent(this.getWidget("btn_check"), this, this.onClickCheck);

        var btn_cancel_bind = this.getWidget("btn_cancel_bind");
        var btn_change_bind = this.getWidget("btn_change_bind");

        UITools.addClickEvent(btn_cancel_bind,this,this.onClickCancelBind);
        UITools.addClickEvent(btn_change_bind,this,this.onClickChangeBind);
        UITools.addClickEvent(this.getWidget("Button_report"), this, this.onClickReportBtn);

        this.setBtnTexture(this.btn_yinyue,PlayerModel.isMusic);
        this.setBtnTexture(this.btn_yinxiao,PlayerModel.isEffect);

        this.panelHall = this.getWidget("panel_hall");
        this.panelRoom = this.getWidget("panel_room");

        if(LayerManager.isInRoom()){
            this.bgMusic = 2;
            this.panelHall.setVisible(false);
            this.panelRoom.setVisible(true);
        }else{
            this.bgMusic = 1;
            this.panelHall.setVisible(true);
            this.panelRoom.setVisible(false);
        }

        this.getWidget("label_version").setString("版本：" + SyVersion.v);
        this.getWidget("label_version_1").setString("版本：" + SyVersion.v);

        //UITools.addClickEvent(this.getWidget("label_version"),this,this.onTest);

    },

    onClickReportBtn:function(){
        //var mc = new ReportPop();
        //PopupManager.addPopup(mc);
        this.onKeFu()
    },

    onClickCancelBind:function(){
        if(PlayerModel.phoneNum){
            var mc = new PhoneLoginPop(5);
            PopupManager.addPopup(mc);
        }else{
            FloatLabelUtil.comText("暂未绑定手机号");
        }
    },

    onClickChangeBind:function(){
        if(PlayerModel.phoneNum){
            var mc = new PhoneLoginPop(6);
            PopupManager.addPopup(mc);
        }else{
            FloatLabelUtil.comText("暂未绑定手机号");
        }
    },

    onClickQieHuan:function(){
        AlertPop.show("您确定退出登录吗？",function(){
            cc.sys.localStorage.setItem("gold_room_config_common","");
            cc.sys.localStorage.setItem("GOLD_AREA_SELECTED","");
            GoldAreaListModel.clearAreaData();
            GoldRoomConfigModel.clearRoomConfigData();
            GoldenEggsModel.clean()
            NewCarnivalModel.clean()
            cc.sys.localStorage.setItem("LastLoginType","");
            PopupManager.removeAll();
            WXHelper.cleanCache();//清除掉微信的值
            XLHelper.xl_cleanCache();//清除掉闲聊的值
            var userInfo = cc.sys.localStorage;
            userInfo.removeItem("pdkFlatId");//游客账号
            WXHeadIconManager.clean();
            AudioManager.stop_bg();
            NetErrorPopData.mc = null;
            PingClientModel.reset();
            PlayerModel.clear();
            sy.socketQueue.stopDeal();
            sySocket.redisconnect();
            LayerManager.dispose();//ui
            LayerManager.showLayer(LayerFactory.LOGIN);
            IMSdkUtil.gotyeExit();
        });
    },

    onClickCheck:function(){
        var mc = new AgreementPop();
        PopupManager.addPopup(mc);
    },

    onClickYinYue:function(sender){
        var newState = sender.state >0?0:50;
        this.setBtnTexture(sender,newState);

        AudioManager.isMusic = PlayerModel.isMusic = newState;
        if(AudioManager.isMusic){
            cc.audioEngine.resumeMusic();
        }else{
            cc.audioEngine.pauseMusic();
        }
    },

    onClickYinXiao:function(sender){
        var newState = sender.state >0?0:50;
        this.setBtnTexture(sender,newState);

        AudioManager.isEffects = PlayerModel.isEffect = newState;
    },

    setBtnTexture:function(btn,state){
        var res1 = "res/ui/bjdmj/popup/shezhi/popup_btn_on.png";
        var res2 = "res/ui/bjdmj/popup/shezhi/popup_btn_off.png";
        btn.loadTextureNormal(state?res1:res2);
        btn.state = state;
    },

    onClose:function(){
        var state1 = this.btn_yinyue.state;
        var state2 = this.btn_yinxiao.state;
        AudioManager.reloadFromData(state1,state2,this.bgMusic);
        sySocket.sendComReqMsg(10,[state1,state2,state1,state2,this.bgMusic]);
    },

    onTest:function(){
        cc.log("====onTest====")
        var newVersionCode = 1;
        var downUrl = "https://testcdncfgh5.52bjd.com/pack/apk/bjdqipaiyule_200110.apk";
        if (!SdkUtil.isAppInstalled("cn.limsam.ddzyx")) {
            // 下载
            SdkUtil.startDownApp(downUrl, newVersionCode)
        } else {
            // 运行
            SdkUtil.startOtherApp("cn.limsam.ddzyx")
        }
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
                this.addChild(webView,99);
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