/**
 * 通用飘字
 * @author zhoufan
 * @date 2014年10月29日
 * @version v1.0
 */
var FloatLabel = cc.Sprite.extend({
	labeltag:0,
	schedule:false,
	_needPush:[],
	_nowIndex:0,
	_maxFrame:3,
	_nowFrame:0,
	_scheduleFrame:0,

	ctor:function(){
		this._super();
		var winSize = cc.director.getWinSize();
		this.setContentSize(800, 60);
		this.x = winSize.width/2;
		this._maxFrame = 5;
		this._nowFrame = this._maxFrame;
		this._scheduleFrame = 0;
	},

	pushAll:function(data){
		this._scheduleFrame = 0;
		if(!this.schedule){
			this.schedule = true;
			this.scheduleUpdate();
		}
		this._needPush = ArrayUtil.merge(data, this._needPush);
	},

	update:function(){
		if(this._needPush.length <= 0){
			this._scheduleFrame++;
			if(this._scheduleFrame >= 900){
				this.schedule = false;
				this.unscheduleUpdate();
			}
			return;
		}
		this._nowFrame++;
		if(this._nowFrame >= this._maxFrame){
			if(this._nowIndex == this._needPush.length){
				this._nowFrame = this._maxFrame;
				this._needPush.length = 0;
				this._nowIndex = 0;
			}else{
				var data = this._needPush[this._nowIndex];
				this.push(data);
				this._nowIndex++;
				this._nowFrame = 0;
			}
		}
	},

	push:function(data){
		var winSize = cc.director.getWinSize();
		var size = 52;//data.size || 48;
		var sizeHeight = size+6;
		var bg = new cc.Sprite("res/ui/common/common_img_float_bg.png");
		bg.anchorX=bg.anchorY=0.5;
		var label = CustomText.create(data.text, size, cc.size(1000, sizeHeight), data.color, cc.TEXT_ALIGNMENT_CENTER);
		bg.x = this.width/2;
		bg.addChild(label);
		label.scale = 2;
		label.x = bg.width/2;
		label.y = bg.height/2;
		var _this = this;
		var nowtag = _this.labeltag;
		bg.y = data.hasOwnProperty("y") ? data.y : winSize.height/2;
		if(_this.labeltag > 0){
			var last = _this.getChildByTag(_this.labeltag-1);
			if(last)	bg.y = last.y-bg.height;
		}
		this.addChild(bg,0,this.labeltag);
		var finish = cc.callFunc(function(){
			if(_this.labeltag > 0){
				var last = _this.getChildByTag(_this.labeltag-1);
				var move = (last && last.y<=180) ? 42 : 32
				//把已有的往上移动
				for(var i=0;i<_this.labeltag;i++){
					var child = _this.getChildByTag(i);
					if(child)	child.y+=move;
				}
			}
		}, this, null);
		var dispose = cc.callFunc(function(){
			_this.removeChild(_this.getChildByTag(nowtag),true);
		}, this, null);
		var seq = cc.sequence(
				cc.scaleTo(1/16,1,1),
				finish,
				cc.delayTime(1),
				cc.callFunc(function(){
					bg.runAction(cc.fadeTo(1,0));
				}),
				cc.fadeTo(1,0),
				dispose
		);
		label.runAction(seq);
		this.labeltag++;
	},

	cleanData:function(){
		this._needPush.length = 0;
		this._nowIndex = 0;
		this.removeAllChildren(true);
	}

});

var FloatLabelUtil = {

	/**
	 * 通用飘字
	 * @param txt 文本内容
	 * @param color 颜色 【ColorUtil.WHITE】
	 */
	comText:function(data,color,size){
		if(!data)return;
		var result = [];
		color = color || cc.color("#ffea00");
		var obj={text:data,color:color,size:size,type:2};
		result.push(obj);
		sy.scene.showFloatLabel(result);
	}
}