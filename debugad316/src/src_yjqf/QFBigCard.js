/**1
 * Created by zhoufan on 2015/8/22.
 * @class
 * @extend {cc.Class}
 */
var QFBigCard = QFCard.extend({
	/** @lends QFBigCard.prototype */
	_selected:null,
	_touched:null,
	_direct:null,
	isAction:false,
	initCardYLine1 : 95,
	initCardYLine2 : 15,
	clickMoveHigh : 36,
	cardLine:0,
	_BoomNumber:0,
	_isTongzi:false,
	_isSuperBoom:false,
	_isXi:false,
	i:0,
	t:0,
	c:0,
	n:0,
	/**
	 * @construct
	 * @param cardVo {CardVo}
	 */
	ctor:function(cardVo,cardType){
		this.cardType = cardType || 1;
		this._selected = false;
		this._touched = false;
		this._super("bigcard",cardVo ,cardType);

		this.i = cardVo.i;
		this.t = cardVo.t;
		this.n = cardVo.n;
		this.c = cardVo.c;
		if(this.n == 5 && QFRoomModel.isSave67 != 1){
			this.i = 7;
			this._cardVo.i = 7;
		}

		this.initCardYLine1 = QFRoomModel.initCardYLine1;
		this.initCardYLine2 = QFRoomModel.initCardYLine2;

		if(this.cardType == 1){
			this.touchLayer = UICtor.cS9Img("res/res_yjqf/images/pokerbg.png",cc.rect(0,30,110,3),cc.size(this._bg.width,this._bg.height)); //140 194
		}else if(this.cardType == 2){
			this.touchLayer = UICtor.cS9Img("res/res_yjqf/images/pokerbg.png",cc.rect(0,30,110,3),cc.size(140,194));
		}
		this.touchLayer.anchorX=this.touchLayer.anchorY=0;
		this.addChild(this.touchLayer);
		this.touchLayer.visible = false;
		this._direct = null;

		//
		var bg = this._bg;
		//增加卡牌背面
		var backbg =  new cc.Sprite("res/res_yjqf/qfcutcard/cut_card_3.png");
		backbg.x = backbg.width/2;
		backbg.y = backbg.height/2;
		backbg.visible = false;
		this.addChild(backbg);


		this.varNode = bg;
		this.backNode = backbg;

		//// 小付 增加筒子的特殊显示
		//this.tongziSp = new cc.Sprite(res.tongzi_png);
		//this.tongziSp.setScale(bg.width * bg.scale / this.tongziSp.width);
		//this.tongziSp.x =  bg.width * 0.5;
		//this.tongziSp.y = bg.height * 0.5;
		//this.tongziSp.visible = false;
		//this.varNode.addChild(this.tongziSp);
        //
		//// 增加地炸的标识
		//this.superBoomSp = new cc.Sprite(res.dizha_png);
		//this.superBoomSp.setScale(bg.width * bg.scale / this.superBoomSp.width);
		//this.superBoomSp.x =  bg.width * 0.5;
		//this.superBoomSp.y = bg.height * 0.5;
		//this.superBoomSp.visible = false;
		//this.varNode.addChild(this.superBoomSp);
        //
		//// 增加囍的标识
		//this.xiSp = new cc.Sprite(res.xi_png);
		//this.xiSp.setScale(bg.width * bg.scale / this.xiSp.width);
		//this.xiSp.x = bg.width * 0.5;
		//this.xiSp.y = bg.height * 0.5;
		//this.xiSp.visible = false;
		//this.varNode.addChild(this.xiSp);

		this.setTouchEnabled(true)
		this.setSwallowTouches(false);//让点击事件向下传递 因为这个卡牌的点击事件只有选择分组的时候用到了
		this.addTouchEventListener(this.touchEvent, this)

	},

	setLine:function( showLine ){
		this.cardLine = showLine;
	},

	getLine:function (){
	    return this.cardLine;
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
		this.touchLayer.visible = true;
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
			this._selected = true;
			if(this._BoomNumber < 4 || (this._BoomNumber >= 4 && this.y == this.initCardYLine2)){
				var sp = this.getChildByTag(778);
				if(sp){
					sp.removeFromParent(true);
				}
				var h = this.height;
				if(this._BoomNumber >= 4){
					h += (QFRoomModel._cardY1-1)*(this._BoomNumber - 1);
				}

				var sp = new cc.Scale9Sprite("res/res_yjqf/images/qfSelectedCard.png", cc.rect(0, 0, 146, 150), cc.rect(40, 40, 60, 60));
				sp.width = this.width;
				sp.height = h;
				sp.anchorX = 0;
				sp.anchorY = 0;
				this.addChild(sp);
				sp.setTag(778);
			}
		}
	},

	/**
	 * 取消选中
	 */
	unselected:function(){
		if(this._selected && this.isAction == false){
			this._selected = false;
			var sp = this.getChildByTag(778);
			if(sp){
				sp.removeFromParent(true);
			}
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
		//if(this._selected != ((this.y != this.initCardYLine1) && (this.y != this.initCardYLine2))){
		//	cc.log("卡牌的是否已选取状态异常...",this._selected ,this.y , ((this.y != this.initCardYLine1) && (this.y != this.initCardYLine2)));
		//}
		return this._selected;
	},

	letOutAnimate:function(x , y){
		this.runAction(cc.moveTo(1,x,this.y));
	},

	fixHeight:function(){
		if(this.isAction == false){
			//if(this.y >= this.initCardYLine1){
			//	this.y = this.initCardYLine1;
			//}else{
			//	this.y = this.initCardYLine2;
			//}
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
	},

	/**
	 * 是否是特殊组合牌
	 */
	isSpecialCard:function(){
		if(this._isTongzi || this._isSuperBoom || this._isXi){
			var tType = 1;
			if(this._isTongzi)
				tType = 1;
			if (this._isSuperBoom)
			    tType = 3;
			if (this._isXi)
				tType = 2;
			return tType;
		}else{
			return 0;
		}

	},
});