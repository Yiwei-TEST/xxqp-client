var AwardModel = {
    isSuperRiseAward: false,
}

var GoldResultModel = {
    isNeedRiseAward: false,
    roomid:"",
    changeGold:0,
    tempLabelStr:"",
    isNeedShowButton:false,

    init:function(goldNum,isAdd){
        var tempLabel = isAdd ? "再得" : "补偿";
        tempLabel += goldNum + "豆";
        GoldResultModel.tempLabelStr = tempLabel;
    },
}

var AwardPop = BasePopup.extend({
    ctor:function(beansNum){
        this.beansNum = beansNum;
        this._super("res/AwardPop.json");
    },

    selfRender:function(){
        // cc.log("this.beansNum =",this.beansNum);
        //ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/awardAni/NewAnimation3.ExportJson");
        this.getWidget("beansNum").setString("x"+this.beansNum);
        //var createAni1 = new ccs.Armature("NewAnimation3");
        //createAni1.getAnimation().play("Animation1",-1,0);
        var self = this;
        this.getWidget("panel").visible = false;
        setTimeout(function(){//延时
            self.getWidget("panel").visible = true;
        },700); 
        //createAni1.setPosition(960,540);
        //this.getWidget("main").addChild(createAni1);
        //this.awardAni = createAni1;

        AudioManager.play("res/audio/get.mp3");
    },

    onClose:function(){
        // ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/douzidonghua/douzidonghua.ExportJson");
        //ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/awardAni/NewAnimation3.ExportJson");
        if (this.CloseCallBack)
            this.CloseCallBack();
    },

    setAwrdImg:function(img,scaleNum){
        var iconNode = this.getWidget("Image_3");
        iconNode.loadTexture(img);
        scaleNum = scaleNum || 1;
        iconNode.setScale(scaleNum);
        // this.awardAni.setPosition(iconNode.width/2,iconNode.height/2);
    },

    setCloseCallBack:function(cb){
        this.CloseCallBack = cb;
    },

    addTipInfo:function(str){
        if(this.tipLabel)this.tipLabel.removeFromParent(true);

        var parent = this.getWidget("panel");
        var btn_close = this.getWidget("close_btn");
        this.tipLabel = new cc.LabelTTF(str,"Arial",36);
        this.tipLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.tipLabel.setPosition(btn_close.x,btn_close.y + 145);
        parent.addChild(this.tipLabel);
    }
});


var PropAwardPop = BasePopup.extend({
    ctor:function(data){
        this.data = data;
        this._super("res/AwardPop.json");
    },

    selfRender:function(){
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/awardAni/NewAnimation3.ExportJson");
        //var createAni1 = new ccs.Armature("NewAnimation3");
        //createAni1.getAnimation().play("Animation1",-1,0);
        var self = this;
        this.panel = this.getWidget("panel")
        this.panel.visible = false;
        setTimeout(function(){//延时
            self.panel.visible = true;
        },700);
        //createAni1.setPosition(960,540);
        //this.getWidget("main").addChild(createAni1);
        //this.awardAni = createAni1;

        AudioManager.play("res/audio/get.mp3");
        this.Image_bg = this.getWidget("Image_bg")
        this.Image_bg.retain()
        this.Image_bg.removeFromParent(true)
        this.loadPropList()
    },

    loadPropList:function(){
        // var length = this.data.length
        // for(var i = 0;i<length;i++){
        //     var itemData = this.data[i].split(":")
        //     var item = this.Image_bg.clone()
        //     this.panel.addChild(item)
        //     item.x = this.panel.width/2+(i-(length-1)/2)*300
        //     var beansNum = ccui.helper.seekWidgetByName(item,"beansNum");
        //     beansNum.setString("x"+itemData[1])
        //     var iconNode = ccui.helper.seekWidgetByName(item,"Image_3");
        //     var path = PropDataMgr.getPropIcon(itemData[0]);
        //     iconNode.loadTexture(path);
        // }
    },

    onClose:function(){
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/awardAni/NewAnimation3.ExportJson");
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});


