/**
 * Created by zhoufan on 2016/8/17.2
 */
var MJHaiDiPop = BasePopup.extend({

    ctor: function () {
        this._super("res/mjHaiDi.json");
    },

    selfRender:function(){
        var btn_yao = this.getWidget("btn_yao");
        var btn_guo = this.getWidget("btn_guo");
        UITools.addClickEvent(btn_yao,this,this.onYao);
        UITools.addClickEvent(btn_guo,this,this.onGuo);
        this.addCustomEvent(SyEvent.CS_HAIDI,this,this.onCSHaidi);
        this.addCustomEvent(SyEvent.GET_MAJIANG,this,this.onCloseEvent);
    },

    onCSHaidi:function(event){
        var message = event.getUserData();
        if(message.params[0] == 0){
            this.onCloseEvent();
        }
    },

    onCloseEvent:function(){
        PopupManager.remove(this);
    },

    onYao:function(){
        sySocket.sendComReqMsg(215,[10]);
    },

    onGuo:function(){
        sySocket.sendComReqMsg(215,[22]);
    }
});