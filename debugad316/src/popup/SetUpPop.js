/**
 * Created by Administrator on 2016/6/27.
 */
var SetUpPop = BasePopup.extend({

    ctor: function (showExit) {
        this.showExit = showExit || false;
        this._super("res/setup.json");
    },

    selfRender: function () {

        this.Button_20 = this.getWidget("Button_20");
        UITools.addClickEvent(this.Button_20,this,this.onBtn3);

        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        cc.log("PlayerModel.isMusic , PlayerModel.isEffect..." , PlayerModel.isMusic , PlayerModel.isEffect);
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);
        if(LayerManager.isInRoom()){
            this.bgMusic = 2;
        }else{
            this.bgMusic = 1;
        }


        if(this.showExit)
           UITools.addClickEvent(this.Button_20,this,this.onBtn3);
        else
            this.Button_20.visible = false;

    },

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                AudioManager.setEffectsVolume(volume);
            }
        }
    },


    onBtn3:function(){
        AlertPop.show("您确定退出登录吗？",function(){
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

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;
        AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
    },
});

var PHZSetUpPop = BasePopup.extend({

    ctor: function () {
        this._super("res/phzSetPop.json");
    },

    selfRender: function () {
        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        cc.log("PlayerModel.isMusic , PlayerModel.isEffect..." , PlayerModel.isMusic , PlayerModel.isEffect);
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);
        this.bgMusic = 2;

        this.getLocalRecord();//获取本地记录


        this.gnPanel = this.getWidget("Panel_gn");
        this.hmPanel = this.getWidget("Panel_hm");

        this.Button_gn = this.getWidget("Button_gn");
        this.Button_hm = this.getWidget("Button_hm");

        UITools.addClickEvent(this.Button_gn, this, this.onGn);
        UITools.addClickEvent(this.Button_hm, this, this.onHm);
        this.onGn();

        //画面设置界面的逻辑
        //快速吃牌
        var widgetKscp = {"Button_kscp1":1,"Button_kscp2":2,"Label_kscp1":1,"Label_kscp2":2};
        this.addClickEvent(widgetKscp , this.onKscpClick);
        this.displayKscp();

        //开启听牌
        var widgetKqtp = {"Button_kqtp1":1,"Button_kqtp2":2,"Label_kqtp1":1,"Label_kqtp2":2};
        this.addClickEvent(widgetKqtp , this.onKqtpClick);
        this.displaykqtp();

        //语音选择
        var widgetYyxz = {"Button_yyxz1":1,"Button_yyxz2":2,"Button_yyxz3":3,"Button_yyxz4":4,"Button_yyxz5":5,"Label_yyxz1":1,"Label_yyxz2":2,"Label_yyxz3":3,"Label_yyxz4":4,"Label_yyxz5":5};
        this.addClickEvent(widgetYyxz , this.onYyxzClick);
        //根据玩法暂时语音选择按钮 1 邵阳话 2 普通话 3 常德话 4 郴州话 5 耒阳话
        if (PHZRoomModel.wanfa == GameTypeEunmZP.SYBP || PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
            this["Button_yyxz1"].setVisible(true);
            this["Button_yyxz4"].setVisible(false);
            this["Button_yyxz5"].setVisible(false);
            if (this.yyxz>3){
                this.yyxz = 1;
            }
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
            this["Button_yyxz1"].setVisible(false);
            this["Button_yyxz4"].setVisible(true);
            this["Button_yyxz5"].setVisible(false);
            if( this.yyxz == 1 || this.yyxz == 5){
                this.yyxz= 4;
            }
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
            this["Button_yyxz1"].setVisible(false);
            this["Button_yyxz4"].setVisible(false);
            this["Button_yyxz5"].setVisible(true);
            if( this.yyxz == 1 || this.yyxz == 4){
                this.yyxz = 5;
            }
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
            this["Button_yyxz1"].setVisible(false);
            this["Button_yyxz4"].setVisible(false);
            this["Button_yyxz5"].setVisible(false);
            if( this.yyxz == 1 || this.yyxz == 4 || this.yyxz == 5){
                this.yyxz= 3;
            }
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            this["Label_yyxz3"].setString("本地话");
            this["Label_yyxz3"].temp = 6;
            this["Button_yyxz3"].temp = 6;
            if(this.yyxz != 2)this.yyxz = 6;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
            this["Label_yyxz3"].setString("本地话");
            this["Label_yyxz3"].temp = 7;
            this["Button_yyxz3"].temp = 7;
            if(this.yyxz != 2)this.yyxz = 7;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            this["Label_yyxz3"].setString("桂林话");
            this["Label_yyxz3"].temp = 3;
            this["Button_yyxz3"].temp = 3;
            if(this.yyxz != 2)this.yyxz = 3;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
            this["Button_yyxz4"].setVisible(true);
            this["Label_yyxz4"].setString("安化话");
            this["Label_yyxz4"].temp = 4;
            this["Button_yyxz4"].temp = 4;
            if (this.yyxz > 4 || this.yyxz < 2){
                this.yyxz = 4;
            }
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.ZZPH){
            this["Label_yyxz3"].setString("株洲话");
            this["Label_yyxz3"].temp = 8;
            this["Button_yyxz3"].temp = 8;
            if(this.yyxz != 2)this.yyxz = 8;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ){
            this["Label_yyxz3"].setString("本地话");
            this["Label_yyxz3"].temp = 9;
            this["Button_yyxz3"].temp = 9;
            if(this.yyxz != 2)this.yyxz = 9;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            this["Label_yyxz3"].setString("本地话");
            this["Label_yyxz3"].temp = 10;
            this["Button_yyxz3"].temp = 10;
            if(this.yyxz != 2)this.yyxz = 10;
        }
        this.displayYyxz();
        
        //出牌速度
        var widgetCpsd = {"Button_cpsd1":1,"Button_cpsd2":2,"Button_cpsd3":3,"Button_cpsd4":4,"Label_cpsd1":1,"Label_cpsd2":2,"Label_cpsd3":3,"Label_cpsd4":4};
        this.addClickEvent(widgetCpsd , this.onCpsdClick);
        this.displayCpsd();

        //字牌大小
        var widgetZpdx = {"Button_zpdx1":1,"Button_zpdx2":2,"Button_zpdx3":3,"Button_zpdx4":4,"Label_zpdx1":1,"Label_zpdx2":2,"Label_zpdx3":3,"Label_zpdx4":4};
        this.addClickEvent(widgetZpdx , this.onZpdxClick);
        this.displayZpdx();

        //虚线选择
        var widgetXxxz = {"Button_xxxz1":1,"Button_xxxz2":2,"Button_xxxz3":3,"Label_xxxz1":1,"Label_xxxz2":2,"Label_xxxz3":3};
        this.addClickEvent(widgetXxxz , this.onXxxzClick);
        this.displayXxxz();

        //字牌选择
        var widgetZpxz = {"Button_zpxz1":1,"Button_zpxz2":2,"Button_zpxz3":3,"Image_zpxz1":1,"Image_zpxz2":2,"Image_zpxz3":3};
        this.addClickEvent(widgetZpxz , this.onZpxzClick);
        this.displayZpxz();

        this["Button_zpxz" + 2].setVisible(false);/** 去掉第二套字牌选择 */

        //牌面选择
        var widgetpmxz = {"Button_pmxz1":1,"Button_pmxz2":2,"Button_pmxz3":3,"Button_pmxz4":4,"Image_pmxz1":1,"Image_pmxz2":2,"Image_pmxz3":3,"Image_pmxz4":4};
        this.addClickEvent(widgetpmxz , this.onPmxzClick);
        this.displayPmxz();

        //桌面背景
        var widgetZmbj = {"Button_zmbj1":1,"Button_zmbj2":2,"Button_zmbj3":3,"Button_zmbj4":4,"Button_zmbj5":5,
            "Image_zmbj1":1,"Image_zmbj2":2,"Image_zmbj3":3,"Image_zmbj4":4,"Image_zmbj5":5};
        this.addClickEvent(widgetZmbj , this.onZmbjClick);
        this.displayZmbj();

        var widgetIscp = {"CheckBox_changpai":1,"Label_changpai":1};
        this.addClickEvent(widgetIscp , this.onChangPai);
        this["CheckBox_changpai"].setSelected(this.iscp == 1);

        if(PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
            this.getWidget("Panel_zpdx").visible = false;
        }
    },


    onGn: function() {
        this.gnPanel.visible = true;
        this.hmPanel.visible = false;
        this.Button_gn.setBright(false);
        this.Button_hm.setBright(true);
        this.Button_gn.setTouchEnabled(false);
        this.Button_hm.setTouchEnabled(true);
    },

    onHm: function() {
        this.gnPanel.visible = false;
        this.hmPanel.visible = true;
        this.Button_gn.setBright(true);
        this.Button_hm.setBright(false);
        this.Button_gn.setTouchEnabled(true);
        this.Button_hm.setTouchEnabled(false);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalRecord: function () {
        this.kscp = parseInt(this.getLocalItem("sy_phz_kscp"+PHZRoomModel.wanfa)) == 1 ? 1:0;  //1,0
        this.kqtp = (parseInt(this.getLocalItem("sy_phz_kqtp"+PHZRoomModel.wanfa)) == 0 ? 0:1) || PHZSetModel.getDefaultKqtp();  //1,0
        this.yyxz = parseInt(this.getLocalItem("sy_phz_yyxz"+PHZRoomModel.wanfa)) || PHZSetModel.getDefaultYyxz();  //1,2,3
        this.cpsd = this.getLocalItem("sy_phz_cpsd"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultCpsd();  //1,2,3
        this.zpdx = parseInt(this.getLocalItem("sy_phz_zpdx" + PHZRoomModel.wanfa)) || PHZSetModel.getDefaultZpdx();  //1,2,3,4
        this.xxxz = this.getLocalItem("sy_phz_xxxz"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultXxxz() ;  //1,0
        this.zpxz = this.getLocalItem("sy_phz_zpxz"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultZpxz();  //1,2,3
        this.pmxz = this.getLocalItem("sy_phz_pmxz"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultPmxz();  //1,2,3,4
        this.zmbj = this.getLocalItem("sy_phz_zmbj"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultZmbj();  //1,2,3
 
        this.setDefaultAllData();
        this.zpxz = this.zpxz == 3 ? 3 : 1;
    },

    // getDefaultKqtp:function(){
    //     if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
    //         return 1;
    //     }
    //     return 0;
    // },

    setDefaultAllData:function(){
        var setAHPHZ = this.getLocalItem("sy_phz_setAllData_Pop"+PHZRoomModel.wanfa);
        if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ && (!setAHPHZ || setAHPHZ != 1)){
            this.yyxz = 4;//语音选择默认 普通话
            this.cpsd = 3;//出牌速度默认 标准
            this.zpdx = 3;//字牌大小默认 大
            this.zpxz = 3;//字牌字体默认 3
            this.pmxz = 4;//牌面默认     4
            this.zmbj = 1;//桌面默认     1
            this.setLocalItem("sy_phz_setAllData_Pop"+PHZRoomModel.wanfa,1);
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            this.zpdx = PHZSetModel.zpdx;//字牌大小默认 大
            this.zpxz = PHZSetModel.zpxz;//字牌字体默认 3
            this.pmxz = PHZSetModel.pmxz;//牌面默认     4
            this.zmbj = PHZSetModel.zmbj;//桌面默认     2
            this.setLocalItem("sy_phz_setAllData_Model"+PHZRoomModel.wanfa,1);
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ){
            this.zpdx = PHZSetModel.zpdx;//字牌大小默认 标准
            this.zpxz = PHZSetModel.zpxz;//字牌字体默认 1
            this.pmxz = PHZSetModel.pmxz;//牌面默认     4
            this.zmbj = PHZSetModel.zmbj;//桌面默认     1
            this.xxxz = PHZSetModel.xxxz;//虚线选择 高
            this.iscp = PHZSetModel.iscp;// 默认长牌
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
            this.yyxz = PHZSetModel.yyxz;//语音选择默认 普通话2 常德话3 安化话4
            this.cpsd = PHZSetModel.cpsd;//出牌速度默认 标准
            this.zpdx = PHZSetModel.zpdx;//字牌大小默认 中
            this.zpxz = PHZSetModel.zpxz;//字牌字体默认 1
            this.pmxz = PHZSetModel.pmxz;//牌面默认     1
            this.zmbj = PHZSetModel.zmbj;//桌面默认     3
            this.xxxz = PHZSetModel.xxxz;//选择高       标准
            this.iscp = PHZSetModel.iscp;//不要长牌
        }
    },

    onKscpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kscp = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_kscp") != this.kscp){
            PHZSetModel.kscp = this.kscp;
            this.setLocalItem("sy_phz_kscp"+PHZRoomModel.wanfa,this.kscp);
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KSCP);
        }
        //cc.log("this.kscp"+this.kscp);
    },

    displayKscp:function(){
        var values = [1,0];
        //cc.log("this.kscp"+this.kscp);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (this.kscp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onKqtpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        //if (temp == 1) {
        //    FloatLabelUtil.comText("暂未开放");
        //    return
        //}
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kqtp = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_kqtp") != this.kqtp){
            PHZSetModel.kqtp = this.kqtp;
            this.setLocalItem("sy_phz_kqtp"+PHZRoomModel.wanfa,this.kqtp);  //1,0
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KQTP,2);
        }
        //cc.log("this.kqtp"+this.kqtp);
    },

    displaykqtp:function(){
        var values = [1,0];
        //cc.log("this.kqtp"+this.kqtp);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (this.kqtp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onYyxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        for(var i = 1;i <= 5; i++) {
            var btn = this["Button_yyxz" + i];
            if (temp == btn.temp){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.yyxz = temp;
        if (PHZSetModel.getValue("sy_phz_yyxz") != this.yyxz){
            PHZSetModel.yyxz = this.yyxz;
            this.setLocalItem("sy_phz_yyxz"+PHZRoomModel.wanfa,this.yyxz);  //1,0
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_YYXZ);
        }
        //cc.log("this.yyxz"+this.yyxz);
    },

    displayYyxz:function(){
        //cc.log("this.yyxz"+this.yyxz);
        for(var i = 1;i <= 5; i++) {
            var btn = this["Button_yyxz" + i];
            if (this.yyxz == btn.temp) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onCpsdClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [4,3,2,1];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.cpsd = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_cpsd") != this.cpsd){
            PHZSetModel.cpsd = this.cpsd;
            this.setLocalItem("sy_phz_cpsd"+PHZRoomModel.wanfa,this.cpsd);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_CPSD);
        }
        //cc.log("this.cpsd"+this.cpsd);
    },

    displayCpsd:function(){
        var values = [4,3,2,1];
        //cc.log("this.cpsd"+this.cpsd);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (this.cpsd == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onZpdxClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3,4];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zpdx = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_zpdx") != this.zpdx){
            PHZSetModel.zpdx = this.zpdx;
            this.setLocalItem("sy_phz_zpdx"+PHZRoomModel.wanfa,this.zpdx);  //0,1
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ZPDX);
        }
        //cc.log("this.zpdx"+this.zpdx);
    },

    displayZpdx:function(){
        var values = [1,2,3,4];
        //cc.log("this.zpdx"+this.zpdx);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (this.zpdx == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onXxxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_xxxz" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.xxxz = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_xxxz") != this.xxxz){
            PHZSetModel.xxxz = this.xxxz;
            this.setLocalItem("sy_phz_xxxz"+PHZRoomModel.wanfa,this.xxxz);  //0,1
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_XXXZ);
        }
        //cc.log("this.xxxz"+this.xxxz);
    },

    displayXxxz:function(){
        var values = [1,2,3];
        //cc.log("this.xxxz"+this.xxxz);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_xxxz" + i];
            if (this.xxxz == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onZpxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpxz" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zpxz = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_zpxz") != this.zpxz){
            PHZSetModel.zpxz = this.zpxz;
            this.setLocalItem("sy_phz_zpxz"+PHZRoomModel.wanfa,this.zpxz);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ZPXZ);
        }
        //cc.log("this.zpxz===",this.zpxz)
    },

    displayZpxz:function(){
        var values = [1,2,3];
        //cc.log("this.zpxz"+this.zpxz);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpxz" + i];
            if (this.zpxz == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onPmxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3,4];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_pmxz" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.pmxz = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_pmxz") != this.pmxz){
            PHZSetModel.pmxz = this.pmxz;
            this.setLocalItem("sy_phz_pmxz"+PHZRoomModel.wanfa,this.pmxz);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_PMXZ);
        }
    },

    displayPmxz:function(){
        var values = [1,2,3,4];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_pmxz" + i];
            if (this.pmxz == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onZmbjClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3,4,5];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zmbj = values[temp-1];
        //cc.log("this.zmbj"+this.zmbj);
        PHZSetModel.zmbj = this.zmbj;
        this.setLocalItem("sy_phz_zmbj"+PHZRoomModel.wanfa,this.zmbj);  //1,2,3
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE);
    },

    displayZmbj:function(){
        var values = [1,2,3,4,5];
        //cc.log("this.zmbj"+this.zmbj);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (this.zmbj == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onChangPai:function(){
        cc.log("this[CheckBox_changpai].isSelected() =",this["CheckBox_changpai"].isSelected());
        this.iscp = this["CheckBox_changpai"].isSelected()?0:1;
        if (PHZSetModel.getValue("sy_phz_iscp") != this.iscp){
            PHZSetModel.iscp = this.iscp;
            this.setLocalItem("sy_phz_iscp"+PHZRoomModel.wanfa,this.iscp);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ISCP);
        }
    },

    addClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            // cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;

        cc.log("fuck u ::" , AudioManager._bgMusic);
        AudioManager.reloadFromData(this.state1,this.state2,AudioManager._bgMusic || 3);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
        //
        //AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        //sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
    },
});

var DTZSetUpPop = BasePopup.extend({
    ctor: function () {
        this._super("res/dtzSetup.json");
    },

    selfRender: function () {

        this.pz = this.getLocalItem("sy_dtz_pz") || 1;

        this["CheckBox_bg1"] = this.getWidget("CheckBox_bg1");
        this["CheckBox_bg1"].addEventListener(this.onClickPz1, this);
        this["CheckBox_bg2"] = this.getWidget("CheckBox_bg2");
        this["CheckBox_bg2"].addEventListener(this.onClickPz2, this);
        this["CheckBox_bg3"] = this.getWidget("CheckBox_bg3");
        this["CheckBox_bg3"].addEventListener(this.onClickPz3, this);

        this.displayPz();

        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);

        if(LayerManager.isInRoom()){
            this.bgMusic = 2;
        }else{
            this.bgMusic = 1;
        }

        this.Button_music = this.getWidget("Button_music");
        this.Button_effect = this.getWidget("Button_effect");
        UITools.addClickEvent(this.Button_music, this, this.onClickYl);
        UITools.addClickEvent(this.Button_effect, this, this.onClickYx);

        //cc.log("stata1"+this.state1 + "this.state2" +this.state2);
        this.updateBtnState();
    },

    updateBtnState:function(){
        this.Button_effect.setBright(this.state2 != 0);
        this.Button_music.setBright(this.state1 != 0);
    },


    onClickYx:function(){
        if(this.Button_effect.isBright()){
            this.state2 = 0;
        }else{
            this.state2 =  PlayerModel.isMusic;
        }
        this.Button_effect.setBright(!this.Button_effect.isBright());
        AudioManager.setEffectsVolume(this.state2);
        this.getWidget("Slider_8").setPercent(this.state2);
    },

    onClickYl:function(){
        if(this.Button_music.isBright()){
            this.state1 = 0;
        }else{
            this.state1 =  PlayerModel.isEffect;
        }
        this.Button_music.setBright(!this.Button_music.isBright());
        AudioManager.setBgVolume(this.state1);
        this.getWidget("Slider_7").setPercent(this.state1);
    },

    displayPz:function(){
        this.getWidget("CheckBox_bg1").setSelected(this.pz==1);
        this.getWidget("CheckBox_bg2").setSelected(this.pz==2);
        this.getWidget("CheckBox_bg3").setSelected(this.pz==3);
        cc.sys.localStorage.setItem("sy_dtz_pz",this.pz);
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE,this.pz);
    },

    onClickPz1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 2
        }
        this.displayPz();
    },

    onClickPz2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 3
        }
        this.displayPz();
    },
    onClickPz3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 1
        }
        this.displayPz();
    },

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                if(this.state1 == 0){
                    this.Button_music.setBright(false);
                }else{
                    this.Button_music.setBright(true);
                }
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                if(this.state2 == 0){
                    this.Button_effect.setBright(false);
                }else{
                    this.Button_effect.setBright(true);
                }
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;
        AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);

    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    getWidget:function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

});

var MjSetUpPop = BasePopup.extend({
    ctor: function (isCSMJ,isYuyan) {
        var path = "res/mjSetup.json";
        if(isCSMJ){
            path = "res/csmjSetup.json";
        }
        this.isCSMJ = !!isCSMJ;
        this.isYuyan = !!isYuyan;
        this._super(path);
    },

    selfRender: function () {

        this.pp = parseInt(this.getLocalItem("sy_mj_pp"+MJRoomModel.wanfa))||this.getLocalItem("sy_mj_pp") || 3;
        this.pm = parseInt(this.getLocalItem("sy_mj_pm"+MJRoomModel.wanfa))||this.getLocalItem("sy_mj_pm") || 2;
        this.pz = parseInt(this.getLocalItem("sy_mj_pz"+MJRoomModel.wanfa))||this.getLocalItem("sy_mj_pz") || 2;

        if(this.isCSMJ && this.isYuyan){
            if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ){
                this.yuyan = parseInt(this.getLocalItem("sy_mj_yuyan"+MJRoomModel.wanfa)) || 2;
            }else{
                this.yuyan = parseInt(this.getLocalItem("sy_mj_yuyan"+MJRoomModel.wanfa))||this.getLocalItem("sy_mj_yuyan") || 1;
            }
        }

        this["CheckBox_bg1"] = this.getWidget("CheckBox_bg1");
        this["CheckBox_bg1"].addEventListener(this.onClickPz1, this);
        this["CheckBox_bg2"] = this.getWidget("CheckBox_bg2");
        this["CheckBox_bg2"].addEventListener(this.onClickPz2, this);
        this["CheckBox_bg3"] = this.getWidget("CheckBox_bg3");
        this["CheckBox_bg3"].addEventListener(this.onClickPz3, this);
        this["CheckBox_pm1"] = this.getWidget("CheckBox_pm1");
        this["CheckBox_pm1"].addEventListener(this.onClickPm1, this);
        this["CheckBox_pm2"] = this.getWidget("CheckBox_pm2");
        this["CheckBox_pm2"].addEventListener(this.onClickPm2, this);
        this["CheckBox_pm3"] = this.getWidget("CheckBox_pm3");
        // this["CheckBox_pm3"].visible = false;
        this["CheckBox_pm3"].addEventListener(this.onClickPm3, this);
        this["CheckBox_pp1"] = this.getWidget("CheckBox_pp1");
        this["CheckBox_pp1"].addEventListener(this.onClickPp1, this);
        this["CheckBox_pp2"] = this.getWidget("CheckBox_pp2");
        this["CheckBox_pp2"].addEventListener(this.onClickPp2, this);
        this["CheckBox_pp3"] = this.getWidget("CheckBox_pp3");
        this["CheckBox_pp3"].addEventListener(this.onClickPp3, this);
        // this["CheckBox_pp3"].visible = false;

        if(this.isCSMJ){
            this["CheckBox_yy1"] = this.getWidget("CheckBox_yy1");
            this["CheckBox_yy1"].addEventListener(this.onClickYuyan1, this);
            this["CheckBox_yy2"] = this.getWidget("CheckBox_yy2");
            this["CheckBox_yy2"].addEventListener(this.onClickYuyan2, this);
            this["CheckBox_yy3"] = this.getWidget("CheckBox_yy3");
            this["CheckBox_yy3"].addEventListener(this.onClickYuyan3, this);
            this.btn_yy1 =  ccui.helper.seekWidgetByName(this["CheckBox_yy1"],"yuyan");
            this.btn_yy2 =  ccui.helper.seekWidgetByName(this["CheckBox_yy2"],"yuyan");
            this.btn_yy3 =  ccui.helper.seekWidgetByName(this["CheckBox_yy3"],"yuyan");
            this.btn_yy1.temp = 1;
            this.btn_yy2.temp = 2;
            this.btn_yy3.temp = 3;
            UITools.addClickEvent(this.btn_yy1,this,this.onClickYuyan);
            UITools.addClickEvent(this.btn_yy2,this,this.onClickYuyan);
            UITools.addClickEvent(this.btn_yy3,this,this.onClickYuyan);
            this.displayYuyan();
            if(!this.isYuyan){
                this.getWidget("Panel_yuyan").visible = false;
            }

            this["CheckBox_pp4"] = this.getWidget("CheckBox_pp4");
            this["CheckBox_pp4"].addEventListener(this.onClickPp4, this);
            this["CheckBox_pp5"] = this.getWidget("CheckBox_pp5");
            this["CheckBox_pp5"].addEventListener(this.onClickPp5, this);
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ){
            this["CheckBox_yy3"].setVisible(false);
        }

        this.displayPz();
        this.displayPm();
        this.displayPp();


        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);

        if(LayerManager.isInRoom()){
            this.bgMusic = 2;
        }else{
            this.bgMusic = 1;
        }

        this.Button_music = this.getWidget("Button_music");
        this.Button_effect = this.getWidget("Button_effect");
        UITools.addClickEvent(this.Button_music, this, this.onClickYl);
        UITools.addClickEvent(this.Button_effect, this, this.onClickYx);

        //cc.log("stata1"+this.state1 + "this.state2" +this.state2);
        this.updateBtnState();
    },

    updateBtnState:function(){
        this.Button_effect.setBright(this.state2 != 0);
        this.Button_music.setBright(this.state1 != 0);
    },


    onClickYx:function(){
        if(this.Button_effect.isBright()){
            this.state2 = 0;
        }else{
            this.state2 =  PlayerModel.isMusic;
        }
        this.Button_effect.setBright(!this.Button_effect.isBright());
        AudioManager.setEffectsVolume(this.state2);
        this.getWidget("Slider_8").setPercent(this.state2);
    },

    onClickYl:function(){
        if(this.Button_music.isBright()){
            this.state1 = 0;
        }else{
            this.state1 =  PlayerModel.isEffect;
        }
        this.Button_music.setBright(!this.Button_music.isBright());
        AudioManager.setBgVolume(this.state1);
        this.getWidget("Slider_7").setPercent(this.state1);
    },

    onClickYuyan:function(obj){
        var temp = obj.temp;
        if(temp == this.yuyan){
            if(temp == 1){
                this.yuyan = 2;
            }else if(temp == 2){
                this.yuyan = 3;
            }else{
                this.yuyan = 1;
            }
        }else{
            this.yuyan = parseInt(temp);
        }
        this.displayYuyan();
    },

    updateBtn:function(){
        this.btn_yy1.setBright(!(this.yuyan == 1));
        this.btn_yy2.setBright(!(this.yuyan == 2));
        this.btn_yy3.setBright(!(this.yuyan == 3));
    },

    displayYuyan:function(){
        this.updateBtn();
        this.getWidget("CheckBox_yy1").setSelected(this.yuyan==1);
        this.getWidget("CheckBox_yy2").setSelected(this.yuyan==2);
        this.getWidget("CheckBox_yy3").setSelected(this.yuyan==3);
        cc.sys.localStorage.setItem("sy_mj_yuyan"+MJRoomModel.wanfa,this.yuyan);
    },

    displayPz:function(){
        this.getWidget("CheckBox_bg1").setSelected(this.pz==1);
        this.getWidget("CheckBox_bg2").setSelected(this.pz==2);
        this.getWidget("CheckBox_bg3").setSelected(this.pz==3);
        cc.sys.localStorage.setItem("sy_mj_pz"+MJRoomModel.wanfa,this.pz);
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE,this.pz);
    },

    displayPm:function(){
        this.getWidget("CheckBox_pm1").setSelected(this.pm==1);
        this.getWidget("CheckBox_pm2").setSelected(this.pm==2);
        this.getWidget("CheckBox_pm3").setSelected(this.pm==3);
        cc.sys.localStorage.setItem("sy_mj_pm"+MJRoomModel.wanfa,this.pm);
        SyEventManager.dispatchEvent(SyEvent.CHANGE_MJ_CARDS,this.pm);
    },
    displayPp:function(){
        this.getWidget("CheckBox_pp1").setSelected(this.pp==1);
        this.getWidget("CheckBox_pp2").setSelected(this.pp==2);
        this.getWidget("CheckBox_pp3").setSelected(this.pp==3);
        if(this.isCSMJ){
            this.getWidget("CheckBox_pp4").setSelected(this.pp==4);
            this.getWidget("CheckBox_pp5").setSelected(this.pp==5);
        }
        cc.sys.localStorage.setItem("sy_mj_pp"+MJRoomModel.wanfa,this.pp);
        SyEventManager.dispatchEvent(SyEvent.CHANGE_MJ_BG,this.pp);
    },

    onClickYuyan1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.yuyan = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.yuyan = 2
        }
        this.displayYuyan();
    },

    onClickYuyan2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.yuyan = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.yuyan = 3
        }
        this.displayYuyan();
    },

    onClickYuyan3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.yuyan = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.yuyan = 1
        }
        this.displayYuyan();
    },


    onClickPz1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 2
        }
        this.displayPz();
    },

    onClickPz2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 3
        }
        this.displayPz();
    },
    onClickPz3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 1
        }
        this.displayPz();
    },

    onClickPm1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pm = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pm = 2
        }
        this.displayPm();
    },
    onClickPm2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pm = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pm = 3
        }
        this.displayPm();
    },
    onClickPm3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pm = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pm = 1
        }
        this.displayPm();
    },
    onClickPp1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 2
        }
        this.displayPp();
    },
    onClickPp2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 3
        }
        this.displayPp();
    },
    onClickPp3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 4
        }
        this.displayPp();
    },
    onClickPp4:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 4
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 5
        }
        this.displayPp();
    },
    onClickPp5:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 5
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 1
        }
        this.displayPp();
    },
    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                if(this.state1 == 0){
                    this.Button_music.setBright(false);
                }else{
                    this.Button_music.setBright(true);
                }
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                if(this.state2 == 0){
                    this.Button_effect.setBright(false);
                }else{
                    this.Button_effect.setBright(true);
                }
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;
        AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);

    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    getWidget:function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

});
var TCPFMjSetUpPop = BasePopup.extend({
    ctor: function () {
        var path = "res/tcpfmjSetup.json";
        this._super(path);
    },

    selfRender: function () {

        this.pp = parseInt(this.getLocalItem("sy_mj_pp"+MJRoomModel.wanfa))||this.getLocalItem("sy_mj_pp") || this.getDefaultCardBg();
        this.pm = parseInt(this.getLocalItem("sy_mj_pm"+MJRoomModel.wanfa))||this.getLocalItem("sy_mj_pm") || this.getDefaultCardFront();
        this.pz = parseInt(this.getLocalItem("sy_mj_pz"+MJRoomModel.wanfa))||this.getLocalItem("sy_mj_pz") || this.getDefaultBg();
        this.yuyan = parseInt(this.getLocalItem("tc_mj_yuyan"+MJRoomModel.wanfa))|| 2;

        this["CheckBox_bg1"] = this.getWidget("CheckBox_bg1");
        this["CheckBox_bg1"].addEventListener(this.onClickPz1, this);
        this["CheckBox_bg2"] = this.getWidget("CheckBox_bg2");
        this["CheckBox_bg2"].addEventListener(this.onClickPz2, this);
        this["CheckBox_bg3"] = this.getWidget("CheckBox_bg3");
        this["CheckBox_bg3"].addEventListener(this.onClickPz3, this);
        this["CheckBox_pm1"] = this.getWidget("CheckBox_pm1");
        this["CheckBox_pm1"].addEventListener(this.onClickPm1, this);
        this["CheckBox_pm2"] = this.getWidget("CheckBox_pm2");
        this["CheckBox_pm2"].addEventListener(this.onClickPm2, this);
        this["CheckBox_pm3"] = this.getWidget("CheckBox_pm3");
        // this["CheckBox_pm3"].visible = false;
        this["CheckBox_pm3"].addEventListener(this.onClickPm3, this);
        this["CheckBox_pp1"] = this.getWidget("CheckBox_pp1");
        this["CheckBox_pp1"].addEventListener(this.onClickPp1, this);
        this["CheckBox_pp2"] = this.getWidget("CheckBox_pp2");
        this["CheckBox_pp2"].addEventListener(this.onClickPp2, this);
        this["CheckBox_pp3"] = this.getWidget("CheckBox_pp3");
        this["CheckBox_pp3"].addEventListener(this.onClickPp3, this);
        // this["CheckBox_pp3"].visible = false;

        this["CheckBox_yy1"] = this.getWidget("CheckBox_yy1");
        this["CheckBox_yy1"].addEventListener(this.onClickYuyan1, this);
        this["CheckBox_yy2"] = this.getWidget("CheckBox_yy2");
        this["CheckBox_yy2"].addEventListener(this.onClickYuyan2, this);

        this.btn_yy1 =  ccui.helper.seekWidgetByName(this["CheckBox_yy1"],"yuyan");
        this.btn_yy2 =  ccui.helper.seekWidgetByName(this["CheckBox_yy2"],"yuyan");
        this.btn_yy1.temp = 1;
        this.btn_yy2.temp = 2;
        UITools.addClickEvent(this.btn_yy1,this,this.onClickYuyan);
        UITools.addClickEvent(this.btn_yy2,this,this.onClickYuyan);
        this.displayYuyan();

        this.displayPz();//背景
        this.displayPm();//牌面
        this.displayPp();//牌背


        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);

        if(LayerManager.isInRoom()){
            this.bgMusic = 2;
        }else{
            this.bgMusic = 1;
        }

        this.Button_music = this.getWidget("Button_music");
        this.Button_effect = this.getWidget("Button_effect");
        UITools.addClickEvent(this.Button_music, this, this.onClickYl);
        UITools.addClickEvent(this.Button_effect, this, this.onClickYx);

        //cc.log("stata1"+this.state1 + "this.state2" +this.state2);
        this.updateBtnState();
    },

    updateBtn:function(){
        this.btn_yy1.setBright(!(this.yuyan == 1));
        this.btn_yy2.setBright(!(this.yuyan == 2));
    },

    getDefaultBg:function(){
        var bg = 2;
        return bg;
    },

    getDefaultCardFront:function(){
        var pm = 1;
        return pm;
    },

    getDefaultCardBg:function(){
        return 1;
    },

    updateBtnState:function(){
        this.Button_effect.setBright(this.state2 != 0);
        this.Button_music.setBright(this.state1 != 0);
    },

    onClickYx:function(){
        if(this.Button_effect.isBright()){
            this.state2 = 0;
        }else{
            this.state2 =  PlayerModel.isMusic;
        }
        this.Button_effect.setBright(!this.Button_effect.isBright());
        AudioManager.setEffectsVolume(this.state2);
        this.getWidget("Slider_8").setPercent(this.state2);
    },

    onClickYl:function(){
        if(this.Button_music.isBright()){
            this.state1 = 0;
        }else{
            this.state1 =  PlayerModel.isEffect;
        }
        this.Button_music.setBright(!this.Button_music.isBright());
        AudioManager.setBgVolume(this.state1);
        this.getWidget("Slider_7").setPercent(this.state1);
    },

    displayPz:function(){
        this.getWidget("CheckBox_bg1").setSelected(this.pz==1);
        this.getWidget("CheckBox_bg2").setSelected(this.pz==2);
        this.getWidget("CheckBox_bg3").setSelected(this.pz==3);
        cc.sys.localStorage.setItem("sy_mj_pz"+MJRoomModel.wanfa,this.pz);
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE,this.pz);
    },

    displayPm:function(){
        this.getWidget("CheckBox_pm1").setSelected(this.pm==1);
        this.getWidget("CheckBox_pm2").setSelected(this.pm==2);
        this.getWidget("CheckBox_pm3").setSelected(this.pm==3);
        cc.sys.localStorage.setItem("sy_mj_pm"+MJRoomModel.wanfa,this.pm);
        SyEventManager.dispatchEvent(SyEvent.CHANGE_MJ_CARDS,this.pm);
    },
    displayPp:function(){
        this.getWidget("CheckBox_pp1").setSelected(this.pp==1);
        this.getWidget("CheckBox_pp2").setSelected(this.pp==2);
        this.getWidget("CheckBox_pp3").setSelected(this.pp==3);
        cc.sys.localStorage.setItem("sy_mj_pp"+MJRoomModel.wanfa,this.pp);
        SyEventManager.dispatchEvent(SyEvent.CHANGE_MJ_BG,this.pp);
    },
    displayYuyan:function(){
        this.updateBtn();
        this.getWidget("CheckBox_yy1").setSelected(this.yuyan==1);
        this.getWidget("CheckBox_yy2").setSelected(this.yuyan==2);
        cc.sys.localStorage.setItem("tc_mj_yuyan"+MJRoomModel.wanfa,this.yuyan);
    },
    onClickYuyan:function(obj){
        var temp = obj.temp;
        if(temp == this.yuyan){
            if(temp == 1){
                this.yuyan = 2;
            }else if(temp == 2){
                this.yuyan = 1;
            }
        }else{
            this.yuyan = parseInt(temp);
        }
        this.displayYuyan();
    },
    onClickYuyan1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.yuyan = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.yuyan = 2
        }
        this.displayYuyan();
    },

    onClickYuyan2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.yuyan = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.yuyan = 1
        }
        this.displayYuyan();
    },

    onClickPz1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 2
        }
        this.displayPz();
    },

    onClickPz2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 3
        }
        this.displayPz();
    },
    onClickPz3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 1
        }
        this.displayPz();
    },

    onClickPm1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pm = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pm = 2
        }
        this.displayPm();
    },
    onClickPm2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pm = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pm = 3
        }
        this.displayPm();
    },
    onClickPm3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pm = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pm = 1
        }
        this.displayPm();
    },
    onClickPp1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 2
        }
        this.displayPp();
    },
    onClickPp2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 3
        }
        this.displayPp();
    },
    onClickPp3:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pp = 3
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pp = 1
        }
        this.displayPp();
    },
    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                if(this.state1 == 0){
                    this.Button_music.setBright(false);
                }else{
                    this.Button_music.setBright(true);
                }
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                if(this.state2 == 0){
                    this.Button_effect.setBright(false);
                }else{
                    this.Button_effect.setBright(true);
                }
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;
        AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);

    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    getWidget:function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

});
var HBGZPSetUpPop = BasePopup.extend({

    ctor: function () {
        this._super("res/hbgzpSetPop.json");
    },

    selfRender: function () {
        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);
        this.bgMusic = 2;

        this.getLocalRecord();//获取本地记录


        this.gnPanel = this.getWidget("Panel_gn");
        this.hmPanel = this.getWidget("Panel_hm");

        this.Button_gn = this.getWidget("Button_gn");
        this.Button_hm = this.getWidget("Button_hm");

        UITools.addClickEvent(this.Button_gn, this, this.onGn);
        UITools.addClickEvent(this.Button_hm, this, this.onHm);
        this.onGn();

        //画面设置界面的逻辑
        //快速吃牌
        var widgetKscp = {"Button_kscp1":1,"Button_kscp2":2,"Label_kscp1":1,"Label_kscp2":2};
        this.addClickEvent(widgetKscp , this.onKscpClick);
        this.displayKscp();

        //开启听牌
        var widgetKqtp = {"Button_kqtp1":1,"Button_kqtp2":2,"Label_kqtp1":1,"Label_kqtp2":2};
        this.addClickEvent(widgetKqtp , this.onKqtpClick);
        this.displaykqtp();

        //语音选择
        var widgetYyxz = {"Button_yyxz1":1,"Button_yyxz2":2,"Button_yyxz3":3,"Button_yyxz4":4,"Button_yyxz5":5,"Label_yyxz1":1,"Label_yyxz2":2,"Label_yyxz3":3,"Label_yyxz4":4,"Label_yyxz5":5};
        this.addClickEvent(widgetYyxz , this.onYyxzClick);
        //根据玩法暂时语音选择按钮 1 邵阳话 2 普通话 3 常德话 4 郴州话 5 耒阳话
        this["Button_yyxz2"].setVisible(true);
        this["Button_yyxz1"].setVisible(false);
        this["Button_yyxz3"].setVisible(false);
        this["Button_yyxz4"].setVisible(false);
        this["Button_yyxz5"].setVisible(false);
        this["Label_yyxz2"].setString("湖北话");
        this.yyxz = 2;
        this["Button_yyxz2"].temp = 2;
        this.displayYyxz();

        //出牌速度
        var widgetCpsd = {"Button_cpsd1":1,"Button_cpsd2":2,"Button_cpsd3":3,"Button_cpsd4":4,"Label_cpsd1":1,"Label_cpsd2":2,"Label_cpsd3":3,"Label_cpsd4":4};
        this.addClickEvent(widgetCpsd , this.onCpsdClick);
        this.displayCpsd();

        //字牌大小
        var widgetZpdx = {"Button_zpdx1":1,"Button_zpdx2":2,"Button_zpdx3":3,"Label_zpdx1":1,"Label_zpdx2":2,"Label_zpdx3":3};
        this.addClickEvent(widgetZpdx , this.onZpdxClick);
        this.displayZpdx();

        //桌面背景
        var widgetZmbj = {"Button_zmbj1":1,"Button_zmbj2":2,"Button_zmbj3":3,"Button_zmbj4":4,"Button_zmbj5":5,
            "Image_zmbj1":1,"Image_zmbj2":2,"Image_zmbj3":3,"Image_zmbj4":4,"Image_zmbj5":5};
        this.addClickEvent(widgetZmbj , this.onZmbjClick);
        this.displayZmbj();
    },


    onGn: function() {
        this.gnPanel.visible = true;
        this.hmPanel.visible = false;
        this.Button_gn.setBright(false);
        this.Button_hm.setBright(true);
        this.Button_gn.setTouchEnabled(false);
        this.Button_hm.setTouchEnabled(true);
    },

    onHm: function() {
        this.gnPanel.visible = false;
        this.hmPanel.visible = true;
        this.Button_gn.setBright(true);
        this.Button_hm.setBright(false);
        this.Button_gn.setTouchEnabled(true);
        this.Button_hm.setTouchEnabled(false);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalRecord: function () {
        this.kscp = parseInt(this.getLocalItem("hbgzp_kscp"+GameTypeEunmZP.HBGZP)) == 1 ? 1:0;  //1,0
        this.kqtp = (parseInt(this.getLocalItem("hbgzp_kqtp"+GameTypeEunmZP.HBGZP)) == 0 ? 0:1) || HBGZPSetModel.getDefaultKqtp();  //1,0
        this.yyxz = parseInt(this.getLocalItem("hbgzp_yyxz"+GameTypeEunmZP.HBGZP)) || HBGZPSetModel.getDefaultYyxz();  //1,2,3
        this.cpsd = this.getLocalItem("hbgzp_cpsd"+GameTypeEunmZP.HBGZP) || HBGZPSetModel.getDefaultCpsd();  //1,2,3
        this.zpdx = parseInt(this.getLocalItem("sy_phz_zpdx"+GameTypeEunmZP.HBGZP)) || HBGZPSetModel.getDefaultZpdx();  //1,2,3
        this.zmbj = this.getLocalItem("hbgzp_zmbj"+GameTypeEunmZP.HBGZP) || HBGZPSetModel.getDefaultZmbj();  //1,2,3
    },

    onKscpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kscp = values[temp-1];
        if (HBGZPSetModel.getValue("hbgzp_kscp") != this.kscp){
            HBGZPSetModel.kscp = this.kscp;
            this.setLocalItem("hbgzp_kscp"+HBGZPRoomModel.wanfa,this.kscp);
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KSCP);
        }
    },

    displayKscp:function(){
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (this.kscp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onKqtpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kqtp = values[temp-1];
        if (HBGZPSetModel.getValue("hbgzp_kqtp") != this.kqtp){
            HBGZPSetModel.kqtp = this.kqtp;
            this.setLocalItem("hbgzp_kqtp"+GameTypeEunmZP.HBGZP,this.kqtp);
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KQTP,2);
        }
    },

    displaykqtp:function(){
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (this.kqtp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onYyxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        for(var i = 1;i <= 5; i++) {
            var btn = this["Button_yyxz" + i];
            if (temp == btn.temp){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.yyxz = temp;
        if (HBGZPSetModel.getValue("hbgzp_yyxz") != this.yyxz){
            HBGZPSetModel.yyxz = this.yyxz;
            this.setLocalItem("hbgzp_yyxz"+HBGZPRoomModel.wanfa,this.yyxz);  //1,0
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_YYXZ);
        }
    },

    displayYyxz:function(){
        for(var i = 1;i <= 5; i++) {
            var btn = this["Button_yyxz" + i];
            if (this.yyxz == btn.temp) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onCpsdClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [4,3,2,1];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.cpsd = values[temp-1];
        if (HBGZPSetModel.getValue("hbgzp_cpsd") != this.cpsd){
            HBGZPSetModel.cpsd = this.cpsd;
            this.setLocalItem("hbgzp_cpsd"+HBGZPRoomModel.wanfa,this.cpsd);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_CPSD);
        }
    },

    displayCpsd:function(){
        var values = [4,3,2,1];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (this.cpsd == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onZpdxClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zpdx = values[temp-1];
        if (HBGZPSetModel.getValue("hbgzp_zpdx") != this.zpdx){
            HBGZPSetModel.zpdx = this.zpdx;
            this.setLocalItem("hbgzp_zpdx"+HBGZPRoomModel.wanfa,this.zpdx);  //0,1
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ZPDX);
        }
        //cc.log("this.zpdx"+this.zpdx);
    },

    displayZpdx:function(){
        var values = [1,2,3];
        //cc.log("this.zpdx"+this.zpdx);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (this.zpdx == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onZmbjClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3,4,5];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zmbj = values[temp-1];
        HBGZPSetModel.zmbj = this.zmbj;
        this.setLocalItem("hbgzp_zmbj"+HBGZPRoomModel.wanfa,this.zmbj);  //1,2,3
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE);
    },

    displayZmbj:function(){
        var values = [1,2,3,4,5];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (this.zmbj == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    addClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            // cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;

        AudioManager.reloadFromData(this.state1,this.state2,AudioManager._bgMusic || 3);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
    }
});

var XPLPSetUpPop = BasePopup.extend({

    ctor: function () {
        this._super("res/hbgzpSetPop.json");
    },

    selfRender: function () {
        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);
        this.bgMusic = 2;

        this.getLocalRecord();//获取本地记录

        this.gnPanel = this.getWidget("Panel_gn");
        this.hmPanel = this.getWidget("Panel_hm");

        this.Button_gn = this.getWidget("Button_gn");
        this.Button_hm = this.getWidget("Button_hm");

        UITools.addClickEvent(this.Button_gn, this, this.onGn);
        UITools.addClickEvent(this.Button_hm, this, this.onHm);
        this.onGn();

        //画面设置界面的逻辑
        //快速吃牌
        var widgetKscp = {"Button_kscp1":1,"Button_kscp2":2,"Label_kscp1":1,"Label_kscp2":2};
        this.addClickEvent(widgetKscp , this.onKscpClick);
        this.displayKscp();

        //开启听牌
        var widgetKqtp = {"Button_kqtp1":1,"Button_kqtp2":2,"Label_kqtp1":1,"Label_kqtp2":2};
        this.addClickEvent(widgetKqtp , this.onKqtpClick);
        this.displaykqtp();

        //语音选择
        var widgetYyxz = {"Button_yyxz1":1,"Button_yyxz2":2,"Button_yyxz3":3,"Button_yyxz4":4,"Button_yyxz5":5,"Label_yyxz1":1,"Label_yyxz2":2,"Label_yyxz3":3,"Label_yyxz4":4,"Label_yyxz5":5};
        this.addClickEvent(widgetYyxz , this.onYyxzClick);
        //根据玩法暂时语音选择按钮 1 邵阳话 2 普通话 3 常德话 4 郴州话 5 耒阳话
        this["Button_yyxz2"].setVisible(true);
        this["Button_yyxz1"].setVisible(false);
        this["Button_yyxz3"].setVisible(true);
        this["Button_yyxz4"].setVisible(false);
        this["Button_yyxz5"].setVisible(false);
        this["Label_yyxz2"].setString("普通话");
        this["Label_yyxz3"].setString("本地话");
        this.yyxz = PHZSetModel.yyxz == 2 ? 2 : 3;
        this["Button_yyxz2"].temp = 2;
        this["Button_yyxz3"].temp = 3;
        this.displayYyxz();

        //出牌速度
        var widgetCpsd = {"Button_cpsd1":1,"Button_cpsd2":2,"Button_cpsd3":3,"Button_cpsd4":4,"Label_cpsd1":1,"Label_cpsd2":2,"Label_cpsd3":3,"Label_cpsd4":4};
        this.addClickEvent(widgetCpsd , this.onCpsdClick);
        this.displayCpsd();

        //字牌大小
        var widgetZpdx = {"Button_zpdx1":1,"Button_zpdx2":2,"Button_zpdx3":3,"Label_zpdx1":1,"Label_zpdx2":2,"Label_zpdx3":3};
        this.addClickEvent(widgetZpdx , this.onZpdxClick);
        this.displayZpdx();

        //桌面背景
        var widgetZmbj = {"Button_zmbj1":1,"Button_zmbj2":2,"Button_zmbj3":3,"Button_zmbj4":4,"Button_zmbj5":5,
            "Image_zmbj1":1,"Image_zmbj2":2,"Image_zmbj3":3,"Image_zmbj4":4,"Image_zmbj5":5};
        this.addClickEvent(widgetZmbj , this.onZmbjClick);
        this.displayZmbj();
    },


    onGn: function() {
        this.gnPanel.visible = true;
        this.hmPanel.visible = false;
        this.Button_gn.setBright(false);
        this.Button_hm.setBright(true);
        this.Button_gn.setTouchEnabled(false);
        this.Button_hm.setTouchEnabled(true);
    },

    onHm: function() {
        this.gnPanel.visible = false;
        this.hmPanel.visible = true;
        this.Button_gn.setBright(true);
        this.Button_hm.setBright(false);
        this.Button_gn.setTouchEnabled(true);
        this.Button_hm.setTouchEnabled(false);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalRecord: function () {
        this.kscp = PHZSetModel.kqtp;//parseInt(this.getLocalItem("sy_phz_kscp"+GameTypeEunmZP.XPLP)) == 1 ? 1:0;  //1,0
        this.kqtp = PHZSetModel.kqtp;//(parseInt(this.getLocalItem("sy_phz_kqtp"+GameTypeEunmZP.XPLP)) == 0 ? 0:1) || PHZSetModel.getDefaultKqtp();  //1,0
        this.yyxz = PHZSetModel.yyxz;//parseInt(this.getLocalItem("sy_phz_yyxz"+GameTypeEunmZP.XPLP)) || PHZSetModel.getDefaultYyxz();  //1,2,3
        this.cpsd = PHZSetModel.cpsd;//this.getLocalItem("sy_phz_cpsd"+GameTypeEunmZP.XPLP) || PHZSetModel.getDefaultCpsd();  //1,2,3
        this.zpdx = PHZSetModel.zpdx;//parseInt(this.getLocalItem("sy_phz_zpdx"+GameTypeEunmZP.XPLP)) || PHZSetModel.getDefaultZpdx();  //1,2,3
        this.zmbj = PHZSetModel.zmbj;//this.getLocalItem("sy_phz_zmbj"+GameTypeEunmZP.XPLP) || PHZSetModel.getDefaultZmbj();  //1,2,3
    },

    onKscpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kscp = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_kscp") != this.kscp){
            PHZSetModel.kscp = this.kscp;
            this.setLocalItem("sy_phz_kscp"+PHZRoomModel.wanfa,this.kscp);
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KSCP);
        }
    },

    displayKscp:function(){
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (this.kscp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onKqtpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kqtp = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_kqtp") != this.kqtp){
            PHZSetModel.kqtp = this.kqtp;
            this.setLocalItem("sy_phz_kqtp"+GameTypeEunmZP.XPLP,this.kqtp);
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KQTP,2);
        }
    },

    displaykqtp:function(){
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (this.kqtp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onYyxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        for(var i = 1;i <= 5; i++) {
            var btn = this["Button_yyxz" + i];
            if (temp == btn.temp){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.yyxz = temp == 2 ? 2 : 3;
        //if (PHZSetModel.getValue("sy_phz_yyxz") != this.yyxz){
            PHZSetModel.yyxz = this.yyxz;
            this.setLocalItem("sy_phz_yyxz"+PHZRoomModel.wanfa,this.yyxz);  //1,0
            //SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_YYXZ);
        //}
    },

    displayYyxz:function(){
        for(var i = 1;i <= 5; i++) {
            var btn = this["Button_yyxz" + i];
            if (this.yyxz == btn.temp) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onCpsdClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [4,3,2,1];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.cpsd = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_cpsd") != this.cpsd){
            PHZSetModel.cpsd = this.cpsd;
            this.setLocalItem("sy_phz_cpsd"+PHZSetModel.wanfa,this.cpsd);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_CPSD);
        }
    },

    displayCpsd:function(){
        var values = [4,3,2,1];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (this.cpsd == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onZpdxClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zpdx = values[temp-1];
        if (PHZSetModel.getValue("sy_phz_zpdx") != this.zpdx){
            PHZSetModel.zpdx = this.zpdx;
            this.setLocalItem("sy_phz_zpdx"+PHZSetModel.wanfa,this.zpdx);  //0,1
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ZPDX);
        }
        //cc.log("this.zpdx"+this.zpdx);
    },

    displayZpdx:function(){
        var values = [1,2,3];
        //cc.log("this.zpdx"+this.zpdx);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (this.zpdx == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onZmbjClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3,4,5];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zmbj = values[temp-1];
        PHZSetModel.zmbj = this.zmbj;
        this.setLocalItem("sy_phz_zmbj"+PHZSetModel.wanfa,this.zmbj);  //1,2,3
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE);
    },

    displayZmbj:function(){
        var values = [1,2,3,4,5];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (this.zmbj == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    addClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            // cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;

        AudioManager.reloadFromData(this.state1,this.state2,AudioManager._bgMusic || 3);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
    }
});


var WZQSetUpPop = BasePopup.extend({

    ctor: function () {
        this._super("res/wzqSetPop.json");
    },

    selfRender: function () {
        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        cc.log("PlayerModel.isMusic , PlayerModel.isEffect..." , PlayerModel.isMusic , PlayerModel.isEffect);
        var slider1 = this.getWidget("Slider_yy");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_yx");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);
        this.bgMusic = 2;

        //this.getLocalRecord();//获取本地记录

        var btn_tuichu = this.getWidget("btn_tuichu");
        UITools.addClickEvent(btn_tuichu, this, this.onClickReturn);
    },

    onClickReturn:function(){
        sySocket.sendComReqMsg(6);
        PopupManager.remove(this);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalRecord: function () {
        this.setDefaultAllData();
    },

    //addClickEvent:function(widgets , selector){
    //    for(var key in widgets){
    //        var widget = this[key] = this.getWidget(key);
    //        // cc.log("key ..." , widgets , key)
    //        widget.temp = parseInt(widgets[key]);
    //        UITools.addClickEvent(widget,this,selector);
    //    }
    //},

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;

        AudioManager.reloadFromData(this.state1,this.state2,AudioManager._bgMusic || 3);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
        //
        //AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        //sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
    },
});