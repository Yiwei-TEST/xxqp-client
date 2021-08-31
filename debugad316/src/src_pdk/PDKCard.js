/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {ccui.Widget}
 */
var PDKCard = ccui.Widget.extend({
	/** @lends Card.prototype */
	_cardVo:null,
	_prefix:null,
	cardId:null,
	_bg:null,
	/**
	 * @construct
	 * @param cardVo {CardVo}
	 */

	ctor:function(prefix,cardVo,cardSize,cardType){
		this._prefix = prefix;
		this._super();
		//背景
		this._cardVo = cardVo;
		var color = cardVo.t;
		var number = cardVo.n;
		var pm = UITools.getLocalItem("sy_pdk_pm") || 3;
		if (cardType || PDKRoomModel.isMoneyRoom()){
			pm = 3;
		}
		var bg_pic = "";
		var backbg_pic = "";
		if (pm == 1 ){
			bg_pic = "#bbt_bcard_"+color+"_"+number+".png";
			backbg_pic = "#b_p.png";
		}else if (pm == 2){
			bg_pic = "#bbt_mcard_"+color+"_"+number+".png";
			backbg_pic = "#m_p.png";
		}else if (pm == 3){
			bg_pic = "#bbt_scard_"+color+"_"+number+".png";
			backbg_pic = "#s_p.png";
		}
		//cc.log("bg_pic =",bg_pic);
		//cc.log("backbg_pic =",backbg_pic);
		var bg = this._bg = new cc.Sprite(bg_pic);
		this.setContentSize(bg.width,bg.height);
		bg.x = bg.width/2;
		bg.y = bg.height/2;
		this.addChild(bg);
		bg.visible =false;

		////
		//var bg = this._bg;
		//增加卡牌背面
		var backbg =  new cc.Sprite(backbg_pic);
		backbg.x = backbg.width/2;
		backbg.y = backbg.height/2;
		backbg.visible = false;
		this.addChild(backbg);


		this.varNode = bg;
		this.backNode = backbg;

		if (cardType){
			bg.visible = true;
		}
	},

	/**
	 * 获取数据模型
	 * @returns {CardVo}
	 */
	getData:function(){
		return this._cardVo;
	},


	refreshCardsType:function(type){
		var bg = "";
		var pic= "";
		var color = this._cardVo.t;
		var number = this._cardVo.n;
		if (type == 1 ){
			bg = "bbt_bcard_"+color+"_"+number+".png";
			pic = "b_p.png";
		}else if (type == 2){
			bg = "bbt_mcard_"+color+"_"+number+".png";
			pic = "m_p.png";
		}else if (type == 3){
			bg = "bbt_scard_"+color+"_"+number+".png";
			pic = "s_p.png";
		}
		var frame = cc.spriteFrameCache.getSpriteFrame(bg);
		this.varNode.setSpriteFrame(frame);
		this.setContentSize(this.varNode.width,this.varNode.height);
		this.varNode.x = this.varNode.width/2;
		this.varNode.y = this.varNode.height/2;
		var frame1 = cc.spriteFrameCache.getSpriteFrame(pic);
		this.backNode.setSpriteFrame(frame1);
		this.setContentSize(this.backNode.width,this.backNode.height);
		this.backNode.x = this.backNode.width/2;
		this.backNode.y = this.backNode.height/2;

		this.refreshBlackCard(type);
	},

});