/**
 * Created by Administrator on 2017/7/6.//
 */
var PDKRoomSetPop = BasePopup.extend({
    ctor:function(){
        this._super("res/pdkRoomSetPop.json");
    },

    selfRender:function(){
        this.Button_9 = this.getWidget("Button_9");//退出房间
        this.Button_8 = this.getWidget("Button_8");//解散房间
        this.Button_10 =this.getWidget("Button_10");//设置
        UITools.addClickEvent(this.Button_9,this,this.onLeave);
        UITools.addClickEvent(this.Button_10,this,this.onSetUp);
        UITools.addClickEvent(this.Button_8,this,this.onBreak);

        this.addCustomEvent(SyEvent.REMOVE_SET_POP , this,this.onRemove);
    },

    onSetUp:function(){
        if (LayerManager.isInPDK()){
            var mc = new PDKSetUpPop();
            PopupManager.addPopup(mc);
        }else{
            var mc = new SetUpPop();
            PopupManager.addPopup(mc);
        }

    },

    /**
     * 解散
     */
    onBreak:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    /**
     * 暂离房间
     */
    onLeave:function(){
        cc.log("===onLeave===");
        sySocket.sendComReqMsg(6);
    },

    onRemove:function(){
        PopupManager.remove(this);
    },

})

var PDKSetUpPop = BasePopup.extend({
    ctor: function () {
        this._super("res/pdkSetup.json");
    },

    selfRender: function () {

        this.pz = this.getLocalItem("sy_pdk_pz") || 2;
        this.pm = this.getLocalItem("sy_pdk_pm") || 2;

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
        this["CheckBox_pm3"].addEventListener(this.onClickPm3, this);

        if(PDKRoomModel.isMoneyRoom()){
            this.getWidget("Panel_pm set").setVisible(false);
            this["CheckBox_bg3"].visible = false;

            var bg1 = "res/res_pdk/pdkSetup/gold_set_1.png";
            var bg2 = "res/res_pdk/pdkSetup/gold_set_2.png"

            this["CheckBox_bg1"].loadTextureBackGround(bg1);
            this["CheckBox_bg1"].loadTextureBackGroundSelected(bg1);

            this["CheckBox_bg2"].loadTextureBackGround(bg2);
            this["CheckBox_bg2"].loadTextureBackGroundSelected(bg2);

            if(this.pz == 3)this.pz = 1;
        }

        this.displayPz();
        this.displayPm();


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
        cc.sys.localStorage.setItem("sy_pdk_pz",this.pz);
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE,this.pz);
    },

    displayPm:function(){
        this.getWidget("CheckBox_pm1").setSelected(this.pm==1);
        this.getWidget("CheckBox_pm2").setSelected(this.pm==2);
        this.getWidget("CheckBox_pm3").setSelected(this.pm==3);
        cc.sys.localStorage.setItem("sy_pdk_pm",this.pm);
        SyEventManager.dispatchEvent(SyEvent.CHANGE_PDK_CARDS,this.pm);
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