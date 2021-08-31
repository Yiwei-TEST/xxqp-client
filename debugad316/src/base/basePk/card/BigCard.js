/**
 * Created by zhoufan on 2015/8/22.
 * @class
 * @extend {cc.Class}
 */
var BigCard = Card.extend({
	/** @lends BigCard.prototype */
	_selected:null,
	_touched:null,
	_direct:null,
	isAction:false,
	initCardYLine1 : 150,
	initCardYLine2 : 50,
	i:0,
	t:0,
	c:0,
	n:0,
	/**
	 * @construct
	 * @param cardVo {CardVo}
	 */
	ctor:function(cardVo,cardType){
		this._selected = false;
		this._touched = false;
		this._super("bigcard" , cardVo , cardType);

		this.i = cardVo.i;
		this.t = cardVo.t;
		this.n = cardVo.n;
		this.c = cardVo.c;

		this.touchLayer = UICtor.cS9Img("res/res_dtz/images/pokerbg.png",cc.rect(0,30,110,3),cc.size(140,194));
		this.touchLayer.anchorX=this.touchLayer.anchorY=0;
		this.addChild(this.touchLayer);
		this.touchLayer.visible = false;
		this._direct = null;

		//临时的处理
		var bg = this._bg;

		// 小付 增加筒子的特殊显示
		this.tongziSp = new cc.Sprite(res.test_png);
		this.tongziSp.setScale(1);
		this.tongziSp.x =  bg.width / 2 - 52;
		this.tongziSp.y = bg.height / 2.5;
		this.tongziSp.visible = false;
		this.addChild(this.tongziSp);

		// 增加地炸的标识
		this.superBoomSp = new cc.Sprite(res.test_png);
		this.superBoomSp.setScale(1.2);
		this.superBoomSp.x =  bg.width / 2 - 52;
		this.superBoomSp.y = bg.height / 2.5;
		this.superBoomSp.visible = false;
		this.addChild(this.superBoomSp);

		//增加卡牌背面
		var backbg =  new cc.Sprite("#p.png");
		backbg.x = backbg.width/2;
		backbg.y = backbg.height/2;
		backbg.visible = false;
		this.addChild(backbg);

		this.varNode = bg;
		this.backNode = backbg;
		this.setTouchEnabled(true);
		this.setSwallowTouches(false);//让点击事件向下传递 因为这个卡牌的点击事件只有选择分组的时候用到了
		this.addTouchEventListener(this.touchEvent, this)

	},

	disableAction:function(){
		this.touchLayer.visible = true;
	},

	enableAction:function(){
		this.touchLayer.visible = false;
	},

	isEnable:function(){
		return this.touchLayer.visible;
	},

	onTouchMove:function(boolean){
		if(this._direct == null || this._direct!=boolean){
			this._direct = boolean;
			this.touchLayer.visible = !this.touchLayer.visible;
		}
	},
	touched:function(){
		this._touched = true;
	},

	untouched:function(){
		this._touched = false;
		this.touchLayer.visible = false;
	},

	isTouched:function(){
		return this._touched;
	},

	/**
	 * 选中
	 */
	selected:function(){
		if(!this._selected){
			this.y += 20;
			this._selected = true;
		}
	},

	/**
	 * 取消选中
	 */
	unselected:function(){
		if(this._selected && this.isAction == false){
			if(this.y >= this.initCardYLine1){
				this.y = this.initCardYLine1;
			}else{
				this.y = this.initCardYLine2;
			}
			this._selected = false;
		}
	},

	/**
	 * 选择动作
	 */
	selectAction:function(){
		if(this._selected){
			this.unselected();
		}else{
			this.selected();
		}
	},

	clearDirect:function(){
		this._direct = null;
	},

	isSelected:function(){
		return this._selected;
	},

	letOutAnimate:function(x , y){
		this.runAction(cc.moveTo(1,x,this.y));
	},

	fixHeight:function(){
		if(this.isAction == false){
			if(this.y >= this.initCardYLine1){
				this.y = this.initCardYLine1;
			}else{
				this.y = this.initCardYLine2;
			}
			this._selected = false;
		}
	},

	/**
	 *
	 * 设置点击后的响应方法
	 * @param sender
	 * @param type
	 */

	setTouchUpFunc:function(fuc){
		this.touchUpFunc = fuc;
	},

	touchEvent: function (sender, type) {
		switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				//cc.log("Touch Down");
				break;

			case ccui.Widget.TOUCH_MOVED:
				//cc.log("Touch Move");
				break;

			case ccui.Widget.TOUCH_ENDED:
				if(this.touchUpFunc){
					this.touchUpFunc(sender , this.tag);
				}
				break;

			case ccui.Widget.TOUCH_CANCELED:
				//cc.log("Touch Cancelled");
				break;

			default:
				break;
		}
	}

});