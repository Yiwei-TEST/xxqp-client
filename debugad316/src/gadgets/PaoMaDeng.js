/**
 * @author hjc
 * @date 2016-9-18
 * @version v1.0
 */
var PaoMaDeng = cc.Sprite.extend({
	content:null,
	urgentContent:null,
	bg:null,
	showTarget:0,
	time:0,
	isShow:false,
	playing:false,
	
	ctor:function(){
		this._super();
		var winSize = cc.director.getWinSize();
		this.setContentSize(600, 40);
		this.x = winSize.width/2;
		this.init();
	},

	updatePosition:function(x,y){
		this.Image_44_0.setPosition(x,y);
	},

	init:function(){

		this.content = "";
		this.urgentContent = "";
		this.showTarget = 0;
		this.time = 0;
		this.isShow = false;
		//this.Image_44_0= UICtor.cS9Img("res/ui/bjdmj/hall_img_paomadeng.png", cc.rect(200,10,200,20),cc.size(600,40),ccui.Widget.LOCAL_TEXTURE);
		this.Image_44_0= UICtor.cImg("res/ui/bjdmj/hall_img_paomadeng.png");
		this.Image_44_0.setPosition(0,880);
		this.addChild(this.Image_44_0);
		this.bg = new ccui.ScrollView();
		this.bg.setDirection(ccui.ScrollView.DIR_VERTICAL);
		this.bg.setTouchEnabled(false);
		this.bg.setContentSize(cc.size(800, 42));
		this.bg.setInnerContainerSize(cc.size(800, 42));
		this.bg.anchorX = this.bg.anchorY = 0;
		this.bg.setPosition(70,0);
		this.Image_44_0.addChild(this.bg);
		this.label = UICtor.cLabel("",36);
		this.label.anchorX=0;
		this.label.anchorY=0;
		this.bg.addChild(this.label);
	},

	play:function(msg){
		this.visible = true;
		if(msg.type == 1 || msg.type == 2 ||msg.type==4)
			msg.played+=1;
		this.playing = true;
		var speed = 100;
		this.label.stopAllActions();
		this.label.setPosition(800,0);
		this.label.setString(msg.content);
		var duration = (this.label.width+800)/speed;
		var self = this;
		var delay = msg.delay || 1;
		this.label.runAction(cc.sequence(cc.moveTo(duration,-this.label.width,0),cc.delayTime(delay),cc.callFunc(function(){
			if(msg.type==0)
				PaoMaDengModel.normalIndex=msg.index+1;
			self.playing = false;
			PaoMaDengModel.intervalTime=0;//播完了
		})));
	},

	matchPlay:function(msg){
		this.visible = true;
		if(msg.type == 1 || msg.type == 2 ||msg.type==4)
			msg.played+=1;
		this.playing = true;
		var speed = 100;
		this.label.stopAllActions();
		this.label.setPosition(800,0);
		this.label.setString(msg.content);
		var duration = (this.label.width+800)/speed;
		var self = this;
		var delay = msg.delay || 1;
		this.label.runAction(cc.sequence(cc.moveTo(duration,-this.label.width,0),cc.callFunc(function(){
			self.visible = false
		}),cc.delayTime(delay),cc.callFunc(function(){
			if(msg.type==0)
				PaoMaDengModel.normalIndex=msg.index+1;
			self.playing = false;
			PaoMaDengModel.intervalTime=0;//播完了
		})));
	},

	stop:function(){
		if(this.visible){
			PaoMaDengModel.intervalTime=0;
			this.label.stopAllActions();
			this.playing = false;
			this.visible = false;
		}
	},

	stopNoHide:function(){
		PaoMaDengModel.intervalTime=0;
		this.label.stopAllActions();
		this.label.setString("");
		this.playing = false;
	}
});