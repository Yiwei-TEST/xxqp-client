var SignInModel = {
    isQianDao: false,
    isDoubleAward:false,
    isNewDoubleAward:false,
    init:function(curDay){
        this.curDay = parseInt(curDay);
    }
}

var SignInPop = BasePopup.extend({
    ctor:function(CloseCallBack){

        this._super("res/SignInLayer.json");

        if (CloseCallBack){
            this.CloseCallBack = CloseCallBack;
        }
    },

    selfRender:function(){
        // cc.log("BeansConfigModel.signInData =",JSON.stringify(BeansConfigModel.signInData[0]));
        //ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/douzidonghua/douzidonghua.ExportJson");

        var normal_beansNum7 = ccui.helper.seekWidgetByName(this.getWidget("day7"),"normal_beansNum");
        var fnt = "res/font/dn_bigResult_font_1.fnt";
        normal_beansNum7.setString("");
        var label = new cc.LabelBMFont(BeansConfigModel.signInData[6].goldNum,fnt);
        normal_beansNum7.addChild(label);

        for (var i = 1; i <= 7; i++) {
            var Button_qiandao = ccui.helper.seekWidgetByName(this.getWidget("day"+i),"Button_qiandao");
            if (SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW){
                UITools.addClickEvent(Button_qiandao,this,function (){
                    if (SyConfig.IS_LOAD_AD){
                        SdkUtil.byAdvertytoApp("945308402",0,1);
                    }else if (SyConfig.IS_LOAD_AD_NEW){
                        SdkUtil.byAdvertytoApp("945326633",0,1);
                    }
                });
            }else{
                UITools.addClickEvent(Button_qiandao,this,function (){
                    sySocket.sendComReqMsg(1115,[3,SignInModel.curDay+1]);
                });
            }
            if(BeansConfigModel.signInData && i<7){
                var normal_beansNum = ccui.helper.seekWidgetByName(this.getWidget("day"+i),"normal_beansNum");
                normal_beansNum.setString("x"+BeansConfigModel.signInData[i-1].goldNum)
            }
            var curDay = SignInModel.curDay;
            if(i<=curDay){
                ccui.helper.seekWidgetByName(this.getWidget("day"+i),"yiqiandao").visible = true;
            }
            if(i == SignInModel.curDay+1 && !SignInModel.isQianDao){
                Button_qiandao.visible = true;
                //var createAni1 = new ccs.Armature("douzidonghua");
                //createAni1.getAnimation().play("Animation1",-1,1);
                //createAni1.setPosition(130,167);
                //Button_qiandao.addChild(createAni1);
            }
        }

        var doubleBtn = this.getWidget("double_btn");
        doubleBtn.temp = 2;
        var normalBtn = this.getWidget("normal_btn");
        normalBtn.temp = 1;
        UITools.addClickEvent(doubleBtn,this,this.getAward);
        UITools.addClickEvent(normalBtn,this,this.getAward);
        doubleBtn.visible = normalBtn.visible = (SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW) ? true : false;
        SyEventManager.addEventListener(SyEvent.REFRESH_QIANDAO,this,this.refresh);
    },

    getAward:function(obj){
        obj.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            obj.setTouchEnabled(true);
        })));
        if(SignInModel.isQianDao){
            FloatLabelUtil.comText("今日已签到!");
            return
        }
        var temp = obj.temp || 1;
//        cc.log("getAward===",temp);
        if (temp == 1){
            sySocket.sendComReqMsg(1115,[3,SignInModel.curDay+1]);
        }else if(temp == 2){
            if (SyConfig.IS_LOAD_AD){
                SdkUtil.byAdvertytoApp("945308402",0,1);
            }else if (SyConfig.IS_LOAD_AD_NEW){
                SdkUtil.byAdvertytoApp("945326633",0,1);
            }
        }
    },

    refresh:function(event){
        var data = event.getUserData();
        for (var i = 1; i <= 7; i++) {
            var Button_qiandao = ccui.helper.seekWidgetByName(this.getWidget("day"+i),"Button_qiandao");
            Button_qiandao.visible = false;
            var yiqiandao = ccui.helper.seekWidgetByName(this.getWidget("day"+i),"yiqiandao");
            yiqiandao.visible = false;
            if(i<=data[0]){
                yiqiandao.visible = true;
            }
        }
        if(data[1]){
            PopupManager.removeClassByPopup(SignInPop)
            var pop = new AwardPop(data[1]);
            PopupManager.addPopup(pop);
        }
    },

    onClose:function(){
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/douzidonghua/douzidonghua.ExportJson");
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});
