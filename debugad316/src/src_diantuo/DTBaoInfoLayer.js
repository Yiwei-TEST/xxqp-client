/**
 * Created by cyp on 2019/10/22.
 */
var DTBaoInfoLayer = cc.Layer.extend({
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
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(180);
        this.addChild(gray);

        this.layerBg = new cc.Scale9Sprite("res/res_diantuo/tusi_box.png");
        //this.layerBg.setContentSize(900,530);
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.layerBg);

        this.btn_close = new ccui.Button("res/ui/bjdmj/popup/close1.png","res/ui/bjdmj/popup/close1.png");
        this.btn_close.setPosition(this.layerBg.width - 60,this.layerBg.height - 23);
        this.layerBg.addChild(this.btn_close,1);

        var offsetX = 420;
        var offsetY = 100;
        var startX = this.layerBg.width/2 - 1.5*offsetX;
        var startY = this.layerBg.height - 100;
        for(var i = 0;i<DTBaoConfig.length;++i){
            var di = ccui.Button("res/res_diantuo/tusi_di.png","res/res_diantuo/tusi_di.png");
            di.setPosition(startX + offsetX*(i%4),startY - offsetY*(Math.floor(i/4)));
            di.addTouchEventListener(this.onClickBtn,this);
            di.idx = i;
            this.layerBg.addChild(di);

            var label_txt = UICtor.cLabel(DTBaoConfig[i].txt,36);
            label_txt.setColor(cc.color(161,91,91));
            label_txt.setPosition(di.width/2,di.height/2);
            di.addChild(label_txt);
        }

        this.btn_close.addTouchEventListener(this.onClickBtn,this);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                this.removeFromParent(true);
            }else{
                sySocket.sendComReqMsg(9,[200 + sender.idx],[]);
                this.removeFromParent(true);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },
});

var DTBaoConfig = [
    {txt:"你方便出吗?"}, {txt:"你打还是我打?"}, {txt:"打他不?"}, {txt:"可以接不?"},
    {txt:"我来要,你别管"}, {txt:"你接,我不要了"}, {txt:"不好打就让他们打"}, {txt:"快点出牌啊,我快睡着了"},
    {txt:"你有小王吗?"}, {txt:"你有大王吗?"}, {txt:"你要什么?"}, {txt:"你打什么?"},
    {txt:"你通了吗?"}, {txt:"我打5炸"}, {txt:"我打6炸"}, {txt:"我打掂坨"},
    {txt:"我打正掂坨"}, {txt:"不好意思,接电话去了"}, {txt:"我有"}, {txt:"没有"},
    {txt:"可以"}, {txt:"不可以"}, {txt:"打他"}, {txt:"算下分"},
    {txt:"我打花牌"}, {txt:"我打分牌"}, {txt:"我打炸弹"}, {txt:"我要单牌"},
    {txt:"我要对子"}, {txt:"我要三带"}, {txt:"我要连对"}, {txt:"我要飞机"},
    {txt:"我要顺子"}, {txt:"我通了,你随意"}, {txt:"我需要你空接我"}, {txt:"你按自己的牌出"},
]

