/**
 * Created by zyq on 2020/8/25.
 */

var GoldenEggsPop = cc.Layer.extend({
    openPacket:false,
    ctor:function(){
        this._super()
        SyEventManager.addEventListener(SyEvent.GOLDEN_EGGS_OPEN,this,this.onOpenPacket);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            },
            onTouchEnded:function(touch,event){
                if(this.openPacket) this.onClose()
            }.bind(this)
        }), this);
        this.initLayer();
    },

    onEnter:function() {
        this._super();
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color(0,0,0,180));
        this.addChild(grayLayer);

        ccs.armatureDataManager.addArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindandan/zajindandan.ExportJson");
        this.jindanAni = new ccs.Armature("zajindandan");
        this.jindanAni.setPosition(cc.winSize.width/2,cc.winSize.height/2-200);
        this.addChild(this.jindanAni);

        ccs.armatureDataManager.addArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindandan2/zajindandan2.ExportJson");
        this.guangAni = new ccs.Armature("zajindandan2");
        this.guangAni.getAnimation().play("Animation1",-1,1);
        this.jindanAni.addChild(this.guangAni,100);

        var jindanBtn = new ccui.Button("res/ui/bjdmj/popup/light_touming.png","","");
        jindanBtn.setContentSize(700,700)
        jindanBtn.y = 200
        jindanBtn.setScale9Enabled(true)
        this.jindanAni.addChild(jindanBtn,10)
        UITools.addClickEvent(jindanBtn, this , this.onSure);

        this.money = new ccui.Text("0元","res/font/bjdmj/mljcy.ttf",56);
        this.money.setPosition(0,254);
        this.money.setColor(cc.color("#ef2807"));
        this.jindanAni.addChild(this.money,10);
        this.money.visible = false
    },
    onSure:function(){
        if(this.openPacket) this.onClose()
        cc.log("onSure",GoldenEggsModel.openData[0],GoldenEggsModel.openType,JSON.stringify(GoldenEggsModel.openData))
        if(GoldenEggsModel.openData){
            sySocket.sendComReqMsg(139, [108,parseInt(GoldenEggsModel.openData[0]),parseInt(GoldenEggsModel.openType)]);
        }
    },

    onOpenPacket:function(event){
        this.openPacket = true
        var money = event.getUserData();
        money = Number(money)
        money = money.toFixed(1)
        ccs.armatureDataManager.addArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindanchuizi/zajindanchuizi.ExportJson");
        var ani = new ccs.Armature("zajindanchuizi");
        ani.setPosition(30,85)
        this.jindanAni.addChild(ani,100);
        ani.getAnimation().setFrameEventCallFunc(function(bone, evt) {
            //cc.log("planeArmature evt..." , evt);
            if(evt == "finish"){
                ani.removeFromParent(true)
                this.guangAni.removeFromParent(true)
                this.jindanAni.getAnimation().play("Animation1",-1,0);
                this.money.visible = true
                this.money.setString(money+"元")

            }
        }.bind(this));
        ani.getAnimation().play("Animation1",-1,0);
    },

    onClose : function(){
        ccs.armatureDataManager.removeArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindandan/zajindandan.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindandan2/zajindandan2.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindanchuizi/zajindanchuizi.ExportJson");
        PopupManager.remove(this)
        if(PopupManager.hasClassByPopup(GoldenEggsInfoPop))PopupManager.remove(GoldenEggsInfoPop)
        var pop = new GoldenEggsInfoPop();
        PopupManager.addPopup(pop);
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
})