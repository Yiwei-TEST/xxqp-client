/**
 * Created by zyq on 2020/1/7.
 */

var ActivityPop = BasePopup.extend({
    ctor: function (bOpen) {
        this.bOpen = bOpen
        this._super("res/ActivityPop.json");
    },

    selfRender: function () {
        var grayLayer = new cc.LayerColor(cc.color(0,0,0,180));
        this.addChild(grayLayer);
        grayLayer.setLocalZOrder(-1)
        this.hour = 21;
        this.min = 59;
        this.sec = 59;
        this.bgImg = this.getWidget("layerBg");
        this.timeText = this.getWidget("Label_time");
        this.timeText.setString("00:00:00")
        this.setData(this.bOpen);
        UITools.addClickEvent(this.getWidget("btn_share"), this, this.onClickHblxBtn);
    },

    setData:function(bOpen){
        if(bOpen){
            this.timeText.setString("正式开启")
            var Label_tip = this.getWidget("Label_tip");
            Label_tip.setString("")
            this.getWidget("btn_share").visible = false
            this.unscheduleAllCallbacks();
        }else{
            this.getWidget("btn_share").visible = true
            this.schedule(this.updateTime,1,cc.REPEAT_FOREVER,0);
        }
    },

    updateTime:function(dt){
        var serverDate = sy.scene.getCurServerTime()
        var date = new Date(serverDate)
        //var date = new Date()
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        hour = this.hour-hour
        min = this.min-min
        sec = this.sec-sec
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min = "0" + min;
        if(sec < 10)sec = "0" + sec;
        this.timeText.setString(hour+":"+min+":"+sec)
    },

    onClickHblxBtn:function(){
        SyEventManager.dispatchEvent(SyEvent.NEW_YEAR_ACTIVITY_HBLX);
    },

    onExit:function(){
        this.unscheduleAllCallbacks();
        this._super();
    },
})


var ActivityNoticePop = BasePopup.extend({
    ctor: function () {
        this._super("res/ActivityNoticePop.json");
    },

    selfRender: function () {
        UITools.addClickEvent(this.getWidget("btn_share"), this, this.onClickHblxBtn);
    },

    onClickHblxBtn:function(){
        SyEventManager.dispatchEvent(SyEvent.NEW_YEAR_ACTIVITY_HBLX);
    },
})