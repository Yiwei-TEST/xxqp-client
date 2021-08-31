var KefunewPop = BasePopup.extend({
	ctor:function(){
		this._super("res/kefunewPop.json");
	},
	
	selfRender:function(){
		sySocket.sendComReqMsg(1009, [0]);
		this.Label_wx = this.getWidget("Label_wx");
		var btn_copy = this.getWidget("btn_copy");
		UITools.addClickEvent(btn_copy, this, this.onClickCopy);
	},

	setWx: function (param) {
		this.Label_wx.setString(param.strParams[0]);
	},

	onClickCopy: function () {
		SdkUtil.sdkPaste(this.Label_wx.getString());
		FloatLabelUtil.comText("复制成功");
	},
});
