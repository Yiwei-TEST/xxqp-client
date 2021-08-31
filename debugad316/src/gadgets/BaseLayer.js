/**
 * 用于游戏场景类的全屏显示层的基类
 */
var BaseLayer = cc.Layer.extend({
    layerName:"",
    json:"",
    moreFiles:[],
    root:null,
    showCount:0,
    lStatus:-1,
    RESUME:1,
    STOP:2,
    resumeForever:false,
    renderFinish:false,
    _customEvents:null,

    ctor:function(json,moreFiles){
        this._super();
        this.showCount = 0;
        this.json = json;
        this.layerName = json;
        this.moreFiles = moreFiles;
        this.resumeForever = false;
        this.renderFinish = false;
        this._customEvents = {};
        this.loadComplete();
    },

    getName:function(){
        return this.layerName;
    },

    isForceRemove:function(){
        return false;
    },

    loadComplete : function(){
        this.root = ccs.uiReader.widgetFromJsonFile(this.json);
        this.root.setPosition((cc.winSize.width - this.root.width)/2,(cc.winSize.height - this.root.height)/2);
        this.addChild(this.root);
        this.selfRender();
        this.renderFinish = true;
    },

    /**
     * UI层的操作
     */
    selfRender:function(){
        throw new Error("subclass must override function selfRender");
    },

    addCustomEvent:function(eventType,target,cb){
        if(!this._customEvents[eventType]){
            var listener = SyEventManager.addEventListener(eventType, target, cb);
            this._customEvents[eventType] = listener;
        }
    },

    removeEvents:function(events){
        var types = TypeUtil.isArray(events) ? events : [events];
        for (var i = 0; i < types.length; i++) {
            var et = types[i];
            var listener = this._customEvents[et];
            if(listener){
                SyEventManager.removeListener(listener);
                this._customEvents[et] = null;
            }
        }
    },

    removeAllEvents:function(){
        var events = [];
        for(var key in this._customEvents){
            events.push(key);
        }
        this.removeEvents(events);
    },

    getWidget : function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

    onShow:function(){
    },

    onHide:function(){
    },

    onRemove:function(){
    }
});