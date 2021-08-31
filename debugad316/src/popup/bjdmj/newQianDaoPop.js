/**
 * Created by Administrator on 2020/7/16.
 */
var NewQianDaoPop = BasePopup.extend({

    ctor: function () {
        this._super("res/newQianDao.json");
    },

    selfRender: function () {
        this.Button_ljlq = this.getWidget("Button_ljlq");
        this.Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(this.Button_ljlq,this,this.onOk);
        UITools.addClickEvent(this.Button_close,this,this.onClose);

        this.Label_temp = this.getWidget("Label_tip");

        sySocket.sendComReqMsg(1117,[7]);/** 查询当前看广告剩余次数接口 **/

        this.addCustomEvent("NEW_QIAODAO_JLCS",this,this.updateLJLQCS);
    },

    updateLJLQCS:function(event){/** 领取奖励次数 */
    var msg = event.getUserData();
        var hasAward = msg.params[0];
        this.Label_temp.setString("当前剩余"+hasAward+"次");
    },

    onClose:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        if (SyConfig.IS_LOAD_AD){
            SdkUtil.byAdvertytoApp("945308403",0,2);
        }else if (SyConfig.IS_LOAD_AD_NEW){
            SdkUtil.byAdvertytoApp("945326635",0,2);
        }
        PopupManager.remove(this);
    },

});