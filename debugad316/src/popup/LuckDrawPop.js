var LuckDrawPop = BasePopup.extend({
	speed:0,
	DIAL_NUM:12,
	//是否在转
	isTurn:false,
	//需要转的圈数 	
	turnNum:0,
	//当前的所在的索引 	
	index:0,
	//上一个Dial 
	previousDial:null,
	awardAngle:[-330,-150,-270,-90,-30,-210,-300,-120,-60,-180,-240,-360],
	award:[1,1,2,2,5,10,0,0,1,1,1,1],
	awardName:["房卡","房卡","房卡","房卡","房卡","房卡","谢谢参与","谢谢参与","高级剃须刀","植物油5L","香米5KG","30元话费"],

	ctor:function(){
		this._super("res/luckDraw.json");
	},

	selfRender:function(){
		this.initDial();
		this.btn = this.getWidget("start");
		UITools.addClickEvent(this.btn,this,this.onStart);
		this.getWidget("Label_50").setString(LuckDrawModel.costCards);
		var loginDays = this.getWidget("days");
		var label = new cc.LabelBMFont(LuckDrawModel.loginDays+"","res/font/font_res_huang.fnt");
		label.x = loginDays.width/2;
		label.y = loginDays.height/2;
		loginDays.addChild(label);
		this.addCustomEvent(SyEvent.LUCKDRAW_TURNNMU,this,this.stopTurn);
		this.addCustomEvent(SyEvent.LUCKDRAW_AWARD,this,this.updataAward);
	},

	initDial:function(){
		this.getWidget("Image_2").setRotation(0);
		this.updata();
		this.updataAward();
	},

	onStart:function(){
		var self = this;
		if(LuckDrawModel.turnNum <= 0)
			return FloatLabelUtil.comText("幸运轮盘剩余次数不足");
		sy.scene.hideLoading();
		sySocket.sendComReqMsg(11,[2]);
		this.btn.setTouchEnabled(false);
	},

	stopTurn:function(){
		var img = this.getWidget("Image_2");
		var index = LuckDrawModel.luckDrawNum;
		var self = this;
		var value = this.awardAngle[index-1]-3600;
		var a = cc.sequence(cc.rotateTo(4,value,value).easing(cc.easeOut(7.0)),cc.callFunc(function(){
			if(index == 7 || index == 8){
				FloatLabelUtil.comText(self.awardName[index-1]);
			}else{
				AlertPop.showOnlyOk("恭喜您，获得"+self.awardName[index-1]+"x"+self.award[index-1]+"！",function(){
				});
			}
			self.btn.setTouchEnabled(true);
		}));
		img.runAction(a);
		this.updata();
	},

	updata:function(){
		this.getWidget("Label_49").setString(LuckDrawModel.turnNum);
	},

	updataAward:function(){
		var award = LuckDrawModel.awardList;
		for(var i=0;i<3;i++){
			var awardInfo = this.getWidget("Image_25_"+i);
			awardInfo.id = i;
			awardInfo.state = award[i].canGet;
			awardInfo.cards = award[i].award["-1"];
			awardInfo.addTouchEventListener(this.onGet,this);
			ccui.helper.seekWidgetByName(awardInfo, "Image_30").visible = (award[i].canGet == 1) ? true : false;
			ccui.helper.seekWidgetByName(awardInfo, "Image_31").visible = (award[i].canGet == 2) ? true : false;
		}
	},

	onGet:function(obj,type){
		if(type == ccui.Widget.TOUCH_ENDED){
			var cards = obj.cards;
			var state = obj.state;
			var i = obj.id;
			if(state == 1){
				var self = this;
				AlertPop.showOnlyOk("领取成功，获得房卡x"+cards,function(){
					sySocket.sendComReqMsg(11,[3,parseInt(obj.id)]);
				});
			}else{
				return;
			}
		}
	},

})