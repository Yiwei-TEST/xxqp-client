/**
 * Created by zyq on 2020/9/14.
 */

var NewGuidePop = cc.Layer.extend({
    drawWidth:0,
    drawHeight:0,
    ctor:function() {
        this._super()
        this.touchLayer = cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:this.onTouchBegan.bind(this),
            onTouchEnded:this.onTouchEnded.bind(this)
        }), this);

        this.clipNode = new cc.ClippingNode();
        this.clipNode.setInverted(true)
        this.addChild(this.clipNode);
        var grayLayer = new cc.LayerColor(cc.color(0,0,0,180));
        this.clipNode.addChild(grayLayer);
    },

    initDrawNode:function(width,height,pos,callBack){
        this.drawWidth = width
        this.drawHeight = height
        this.callBack = callBack || null
        var rect = [];
        rect[0] = cc.p(0, 0);
        rect[1] = cc.p(width, 0);
        rect[2] = cc.p(width, height);
        rect[3] = cc.p(0, height);
        var white = cc.color.WHITE;
        this.pStencil = new cc.DrawNode();
        this.pStencil.drawPolygon(rect,4,white,0,white)
        this.pStencil.setContentSize(width,height)
        this.pStencil.setPosition(pos)
        this.clipNode.setStencil(this.pStencil)
    },

    addArmature:function(filePath,fileName,animName,pos){
        ccs.armatureDataManager.addArmatureFileInfo(filePath);
        var ani = new ccs.Armature(fileName);
        ani.setPosition(pos);
        ani.getAnimation().play(animName,-1,1);
        this.addChild(ani,10);
    },

    onTouchBegan: function(touch,event){
        var pos = touch.getLocation();
        var rect = this.pStencil.getBoundingBox();
        if(cc.rectContainsPoint(rect,pos)){
            this.touchLayer.setSwallowTouches(false)
        }else{
            this.touchLayer.setSwallowTouches(true)
        }
        return true
    },

    onTouchEnded:function(touch,event){
        var pos = touch.getLocation();
        var rect = this.pStencil.getBoundingBox();
        if(cc.rectContainsPoint(rect,pos)&&!this.touchLayer.isSwallowTouches()) {
            if(this.callBack)this.callBack()
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
})
