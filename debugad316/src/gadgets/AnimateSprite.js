//
var AnimateSprite = cc.Sprite.extend({
	_repeat:0,
	_delayPerUnit:0,
	_prefix:"",
	_animation:null,
	_cb:null,
	_cbtarget:null,
	_textures:null,
	_isPlayOK:null,
	ctor:function(plist,prefix,delayPerUnit,buildType,picRect){
		this.buildType = buildType || 1;

		if(this.buildType == 1){
			this._prefix = prefix;
			this._delayPerUnit = delayPerUnit || 0.08;
			this._textures = [];
			var firstpng = prefix+"_1.png";
			var frame1 = cc.spriteFrameCache.getSpriteFrame(firstpng);
			if(!frame1){
				cc.spriteFrameCache.addSpriteFrames(plist);
			}
			this._super("#"+firstpng);
			this.buildAnimation();
		}

		if(this.buildType == 2){//第二种创建方式 plist为图片数量 picRect为图片Rect
			this._prefix = prefix;
			this._delayPerUnit = delayPerUnit || 0.08;
			this._textures = [];
			var firstpng = prefix+"_1.png";
			this._super(firstpng);
			this.buildAnimationBySprite(plist , picRect);
		}
	},

	setRepeatTimes:function(value){
		this._repeat = value;
	},

	setCallBack:function(func,_this){
		this._cb = func;
		this._cbtarget = _this;
	},

	reloadTexture:function(plist,prefix,delayPerUnit){
		if(this._animation){
			this._animation.release();
			this._animation = null;
		}
		var firstpng = prefix+"_1.png";
		var frame1 = cc.spriteFrameCache.getSpriteFrame(firstpng);
		if(!frame1){
			cc.spriteFrameCache.addSpriteFrames(plist);
		}
		this._textures.length = 0;
		this._delayPerUnit = delayPerUnit || 0.08;
		this._prefix = prefix;
		this.buildAnimation();
	},

	buildAnimation:function(){
		this._animation = new cc.Animation();
		var frame;
		var i=1;
		while(true) {
			frame = cc.spriteFrameCache.getSpriteFrame(this._prefix+"_"+i+".png");
			if(!frame)
				break;
			this._textures.push(frame);
			this._animation.addSpriteFrame(frame);
			i++;
		}
		this._animation.setDelayPerUnit(this._delayPerUnit);
		this._animation.retain();
	},

	buildAnimationBySprite:function(picNum , picRect){
		this._animation = new cc.Animation();
		var frame;
		var i=1;
		while(true) {
			//frame = cc.spriteFrameCache.getSpriteFrame(this._prefix+"_"+i+".png");
			frame = new cc.SpriteFrame(this._prefix+"_"+i+".png" , picRect);
			if(i > picNum)
				break;
			this._textures.push(frame);
			this._animation.addSpriteFrame(frame);
			i++;
		}
		this._animation.setDelayPerUnit(this._delayPerUnit);
		this._animation.retain();
	},

	play:function(){
		try{
			this._isPlayOK = false;
			var action = cc.animate(this._animation);
			if((this._cb && this._cbtarget) || this._repeat===1){
				action = cc.sequence(action,cc.callFunc(this.finish, this));
			}
			if(this._repeat){
				action = action.repeat(this._repeat);
			}else{
				action = action.repeatForever();
			}
			this.runAction(action);
		}catch(e){}
	},

	getCurrentlyFrame:function(){
		var frame = 1;
		for(var i=0;i<this._textures.length;i++){
			if(this.isFrameDisplayed(this._textures[i])){
				frame = i+1;
				break;
			}
		}
		return frame;
	},

	isPlayOK:function(){
		return this._isPlayOK;
	},

	finish:function(){
		if(this._repeat === 1)
			this._isPlayOK = true;
		if(this._cb && this._cbtarget){
			this._cb.call(this._cbtarget,this);
		}
	},

	stop:function(){
		this.stopAllActions();
	},

	onExit:function(){
		this._textures.length=0;
		if(this._animation){
			this._animation.release();
			this._animation = null;
		}
		this._super();
	}

});