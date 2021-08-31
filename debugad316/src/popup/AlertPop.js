/**
 * Created by Administrator on 2016/6/27.
 */
var AlertPop = BasePopup.extend({

    ctor: function (content,okcb,cancelcb,btnType,tipStr) {
        this.data = content;
        this.okcb = okcb || null;
        this.cancelcb = cancelcb || null;
		this.btnType = btnType || 1;
		cc.log(tipStr);
		this.tipStr = tipStr || "";
        this._super("res/alertPop.json");
    },

    selfRender: function () {
        this.Button_36 = this.getWidget("Button_36");
        this.Button_37 = this.getWidget("Button_37");
		this.Button_close = this.getWidget("close_btn");
		this.Button_close.visible = false;
        this.getWidget("Label_35").setString(this.data);
        UITools.addClickEvent(this.Button_36,this,this.onOk);
        UITools.addClickEvent(this.Button_37,this,this.onCancel);
		UITools.addClickEvent(this.Button_close,this,this.onClosePop);
		cc.log("this.btnType ..." , this.btnType);
		if(this.btnType == 2){//解散界面要显示特殊的按钮
			this.Button_36.loadTextureNormal("res/ui/common/btnJiesan.png");
			this.Button_37.loadTextureNormal("res/ui/common/btnContinue.png");
		}

		if(typeof MJRoomModel !== "undefined" && MJRoomModel.wanfa == GameTypeEunmMJ.TJMJ){
			this.Button_close.visible = true;
		}

		this.getWidget("Label_36").setString(this.tipStr);
    },

	onClosePop:function(){
		PopupManager.remove(this);
	},

    onOk:function(){
        if(this.okcb)
            this.okcb();
        PopupManager.remove(this);
    },

    onCancel:function(){
        if(this.cancelcb)
            this.cancelcb();
        PopupManager.remove(this);
    }
});

var AlertPopRichText = BasePopup.extend({

	_richElements:null,
	ctor:function(json,content,richElements,okcb,cancelcb,isApply,isDisplay,time){
		this._richElements = richElements;
		this.data = content;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this.isApply = isApply;
		this.isDisplay = isDisplay;
		this.time = time || null;
		this._super(json);
	},

	selfRender: function () {
		this.Button_36 = this.getWidget("Button_36");
		this.Button_37 = this.getWidget("Button_37");
		this.getWidget("close_btn").visible = false;
		this.str = this.getWidget("Label_35");
		this.str.setString(this.data);
		this.str.setSize(480,35);
		this.str.setPosition(305,340);
		if(!this.isDisplay && this.isApply){
			this.isHide();
		}
		UITools.addClickEvent(this.Button_36,this,this.onOk);
		UITools.addClickEvent(this.Button_37,this,this.onCancel);
		var scrollView = new ccui.ScrollView();
		scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
		scrollView.setTouchEnabled(true);
		scrollView.jumpToTop();
		scrollView.setBounceEnabled(true);
		scrollView.setContentSize(cc.size(480, 210));
		scrollView.setInnerContainerSize(cc.size(480, 480));
		scrollView.anchorX = scrollView.anchorY = 0;
		scrollView.setPosition(400, 295);//235
		this.addChild(scrollView);
		var richText = UICtor.cLabel("",30,cc.size(480,460),cc.color(129,71,49),0,0);
		richText.anchorX = richText.anchorY = 0;
		richText.setPosition(0,35);
		richText.setString(this._richElements);
		scrollView.addChild(richText);
		if(this.time && this.time>0){
			this.str.setPosition(305,145);
			scrollView.setContentSize(cc.size(480, 200));
			scrollView.setPosition(400,285);
			richText.setPosition(0,0);
			this.scheduleUpdate();
		}
	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		if(!this.isApply){
			PopupManager.remove(this);
		}else{
			this.isHide();
		}
	},

	onCancel:function(){
		if(this.cancelcb)
			this.cancelcb();
		if(!this.isApply){
			PopupManager.remove(this);
		}else{
			this.isHide();
		}
	},

	isHide:function(){
		this.Button_36.visible = false;
		this.Button_37.visible = false;
	},

	update:function(dt){
		this.time -= dt;
		if(this.time<=0){
			this.unscheduleUpdate();
			PopupManager.remove(this);
		}else{
			this.str.setString(ApplyExitRoomModel.changeTime(this.time));
		}
	}
});

AlertPopRichText.show = function(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel){
	var layer = new AlertPopRichText(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel);
	PopupManager.open(layer);
	return layer;
}

AlertPopRichText.showOnlyOk = function(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel){
	var mc = new AlertPopRichText(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel);
	mc.Button_37.visible = false;
	mc.Button_36.x -= 152;
	PopupManager.addPopup(mc);
}


var ServicePop = BasePopup.extend({

	ctor: function (json,content1,content2,okcb,cancelcb) {
		this.data1 = content1;
		this.data2 = content2;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this._super(json);
		cc.log("ServicePop json" , json);
	},

	selfRender: function () {
		this.Button_36 = this.getWidget("Button_36");
		this.Button_37 = this.getWidget("Button_37");
		this.Button_9 = this.getWidget("Button_9");
		this.Button_9.temp=1;
		this.Button_10 = this.getWidget("Button_10");
		if(this.Button_10) {
			this.Button_10.temp = 2;
			UITools.addClickEvent(this.Button_10,this,this.onCopy);
		}
		this.Label_35 = this.getWidget("Label_35");
		this.Label_35.setString(this.data1);
		this.Label_36 = this.getWidget("Label_36");
		if(this.Label_36 ) {
			this.Label_36.setString(this.data2);
		}
		this.Button_copy = this.getWidget("Button_copy");
		if(this.Button_copy){
			this.Button_copy.temp = 1;
			UITools.addClickEvent(this.Button_copy,this,this.onCopy);
		}

		UITools.addClickEvent(this.Button_36,this,this.onOk);
		UITools.addClickEvent(this.Button_37,this,this.onCancel);
		UITools.addClickEvent(this.Button_9,this,this.onCopy);

	},

	onCopy:function(obj){
		var temp = obj.temp;
		if(temp==1){
			SdkUtil.sdkPaste(this.Label_35.getString());
		}else {
			SdkUtil.sdkPaste(this.Label_36.getString());
		}
		FloatLabelUtil.comText("复制成功");
	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		PopupManager.remove(this);
	},

	onCancel:function(){
		if(this.cancelcb)
			this.cancelcb();
		PopupManager.remove(this);
	}
});

ServicePop.showOnlyOk = function(json,content1,content2,okcb){
	var mc = new ServicePop(json,content1,content2,okcb);
	mc.Button_37.visible = false;
	mc.Button_36.x -= 155;
	PopupManager.addPopup(mc);
}

AlertPop.show = function(content,okcb,cancelcb,btnType,tipStr){
    var mc = new AlertPop(content,okcb,cancelcb,btnType,tipStr);
    PopupManager.addPopup(mc);
}

AlertPop.showOnlyOk = function(content,okcb){
    var mc = new AlertPop(content,okcb);
    mc.Button_37.visible = false;
    mc.Button_36.x  = (mc.Button_36.x + mc.Button_37.x)/2;
    PopupManager.addPopup(mc);
}


AlertPop.showMacthTip = function(data,okcb,cancelcb){
	var mc = new MacthTipPop(data,okcb,cancelcb);
	PopupManager.addPopup(mc);
}

var OnlineUpdatePop = BasePopup.extend({

	ctor: function (content,okcb,cancelcb) {
		this.data = content;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this._super("res/alertPop.json");
	},

	selfRender: function () {
		this.Button_36 = this.getWidget("Button_36");
		this.Button_37 = this.getWidget("Button_37");
		this.getWidget("Label_35").setString(this.data);
		UITools.addClickEvent(this.Button_36,this,this.onOk);
		UITools.addClickEvent(this.Button_37,this,this.onCancel);
	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		PopupManager.remove(this);
	},

	onCancel:function(){
		if(this.cancelcb)
			this.cancelcb();
		PopupManager.remove(this);
	}
});

OnlineUpdatePop.showOnlyOk = function(content,okcb){
	var mc = new OnlineUpdatePop(content,okcb);
	mc.Button_37.visible = false;
	mc.Button_36.x -= 155;
	PopupManager.addPopup(mc);
}
