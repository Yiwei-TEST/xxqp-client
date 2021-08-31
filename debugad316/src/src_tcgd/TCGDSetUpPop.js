/**
 * Created by cyp on 2019/11/13.
 */
var TCGDSetUpPop = BasePopup.extend({
    ctor: function () {
        this._super("res/dtSetup.json");
    },

    selfRender: function () {

        this.pz = this.getLocalItem("sy_tcgd_pz") || 1;
        this.pm = this.getLocalItem("sy_tcgd_pm") || 3;

        this.bgBtnArr = [];
        for(var i = 0;i<4;++i){
            var btn = this.getWidget("btn_bg_" + (i+1));
            btn.pz = i+1;
            UITools.addClickEvent(btn, this, this.onSelectBg);
            this.bgBtnArr[i] = btn;
        }
        this.img_select = this.getWidget("img_select");

        this.pmBoxArr = [];
        for(var i = 0;i<3;++i){
            var box = this.getWidget("CheckBox_pm" + (i+1));
            box.pm = i+1;
            box.addEventListener(this.onSelectPm, this);
            this.pmBoxArr[i] = box;
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
        for(var i = 0;i<this.bgBtnArr.length;++i){
            if(this.bgBtnArr[i].pz == this.pz){
                this.img_select.setPosition(this.bgBtnArr[i].getPosition());
            }
        }
        cc.sys.localStorage.setItem("sy_tcgd_pz",this.pz);
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE,this.pz);
    },

    displayPm:function(){
        for(var i = 0;i<this.pmBoxArr.length;++i){
            this.pmBoxArr[i].setSelected(this.pmBoxArr[i].pm == this.pm);
        }
        cc.sys.localStorage.setItem("sy_tcgd_pm",this.pm);
        SyEventManager.dispatchEvent("change_tcgd_pm",this.pm);
    },

    onSelectBg:function(sender){
        if(sender.pz == this.pz)return;

        this.pz = sender.pz;
        this.displayPz();
    },


    onSelectPm:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pm = obj.pm;
            this.displayPm();
        } else if(type == ccui.CheckBox.EVENT_UNSELECTED){
            obj.setSelected(true);
        }
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
