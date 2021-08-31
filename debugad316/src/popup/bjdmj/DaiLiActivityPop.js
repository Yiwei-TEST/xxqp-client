var DaiLiActivityPop = BasePopup.extend({
    ctor:function(CloseCallBack){

        this.wxhStr = "----";

        if(sy.kefuWxData){
            this.wxhStr = sy.kefuWxData[0];
        }

        this._super("res/DaiLiActivityPop.json");

        if (CloseCallBack){
            this.CloseCallBack = CloseCallBack;
        }
    },

    selfRender:function(){

        var label_wxh = this.getWidget("Label_4");
        label_wxh.setString(this.wxhStr);

        var btn_fuzhi = this.getWidget("btn_fuzhi");
        UITools.addClickEvent(btn_fuzhi,this,this.onClickCopyBtn);
    },

    onClickCopyBtn:function(){
        SdkUtil.sdkPaste(this.wxhStr);
        FloatLabelUtil.comText("复制成功");
    },

    onClose:function(){
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});
