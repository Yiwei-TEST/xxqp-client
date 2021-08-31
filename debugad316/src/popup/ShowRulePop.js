/**
 * Created by cyp on 2020/5/28.
 * 用于显示玩法规则选项信息
 */
var ShowRulePop = cc.Layer.extend({
    ctor:function(){
        this._super();

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(180);
        this.addChild(grayLayer);

        var layerBg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/di1.png");
        layerBg.setContentSize(cc.winSize.width*0.6,cc.winSize.height*0.6);
        layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(layerBg);

        var img = "res/ui/bjdmj/popup/x.png";
        var btn_close = new ccui.Button(img,img,"");
        btn_close.addTouchEventListener(this.onClickBtn,this);
        btn_close.setPosition(layerBg.width - 30,layerBg.height - 30);
        layerBg.addChild(btn_close);

        var label_title = new cc.LabelTTF("","",60);
        label_title.setColor(cc.color(184,130,108));
        label_title.setPosition(layerBg.width/2,layerBg.height - 50);
        layerBg.addChild(label_title);

        var label_info = new cc.LabelTTF("","",40);
        label_info.setDimensions(cc.size(layerBg.width*0.7,0));
        label_info.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        label_info.setColor(cc.color(184,130,108));
        label_info.setPosition(layerBg.width/2,layerBg.height/2);
        layerBg.addChild(label_info);

        this.btn_close = btn_close;
        this.label_title = label_title;
        this.label_info = label_info;

    },

    setLayerInfo:function(info){
        this.label_info.setString(info || "");
    },

    setLayerTitle:function(title){
        this.label_title.setString(title || "");
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                PopupManager.remove(this);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});