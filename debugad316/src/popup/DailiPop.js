/**
 * Created by cyp on 2019/4/24.
 */

var DailiPop = BasePopup.extend({
    ctor:function(){

        this.wxhStr = "bjdqpkf888";

        this._super("res/dailiPop.json");
    },

    selfRender:function(){

        var label_wxh = this.getWidget("label_wxh");
        label_wxh.setString(this.wxhStr);

        var btn_copy = this.getWidget("btn_copy");
        UITools.addClickEvent(btn_copy,this,this.onClickCopyBtn);
    },

    onClickCopyBtn:function(){
        SdkUtil.sdkPaste(this.wxhStr);
        FloatLabelUtil.comText("复制成功");
    },
});
