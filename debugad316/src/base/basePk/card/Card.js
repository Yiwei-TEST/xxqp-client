/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {ccui.Widget}
 */
var Card = ccui.Widget.extend({
	/** @lends Card.prototype */
	_cardVo:null,
	_prefix:null,
	cardId:null,
	_bg:null,
	varNode:null,
	backNode:null,
	touchAction:false,
	/**
	 * @construct
	 * @param cardVo {CardVo}
	 */
	ctor:function(prefix,cardVo,cardType){
		var cardType = cardType || 1;
		this._prefix = prefix;
		this._super();
		//背景
		this._cardVo = cardVo;
		var color = cardVo.t;
		var number = cardVo.n;

		var bg = null;
		//cc.log("加载卡牌..." , "#nmw_bcard_" + color + "_" + number + ".png");
		if(cardType == 1){
			bg = this._bg = new cc.Sprite("#nmw_bcard_" + color + "_" + number + ".png");
		}else if(cardType == 2){
			//bg = this._bg = new cc.Sprite("#nmw_bcard_" + color + "_" + number + ".png");
			bg = this._bg = new cc.Sprite("#bbt_scard_"+color+"_"+number+".png"); //pdk卡牌资源
		}


		this.setContentSize(bg.width,bg.height);
		bg.x = bg.width/2;
		bg.y = bg.height/2;
		bg.visible = true;
		this.bg = bg;
		this.addChild(bg);
	},

	/**
	 * 获取数据模型
	 * @returns {CardVo}
	 */
	getData:function(){
		return this._cardVo;
	},

});