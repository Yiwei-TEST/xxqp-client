/**
 * Created by zhoufan on 2018/5/12.
 */
var PHZHuBean = cc.Class.extend({

	huxi: 0,
    ishu: false,
    handCards: [],
    valArr: null,
    operateCards: [],


	ctor:function(){
		this.huxi = 0;
		this.ishu = false;
		this.handCards = [];
		this.operateCards = [];
		this.valArr = null;
	},

	getHandCards: function() {
		return this.handCards;
	},

	setHandCards: function(handCards) {
		this.handCards = handCards;
	},

	getValArr: function() {
		return this.valArr;
	},

	setValArr: function(valArr) {
		this.valArr = valArr;
	},

	getOperateCards: function() {
		return this.operateCards;
	},

	setOperateCards: function(operateCards) {
		this.operateCards = operateCards;
	},

	getHuxi: function() {
		return this.huxi;
	},

	setHuxi: function(huxi) {
		this.huxi = huxi;
	},

	isIshu: function() {
		return this.ishu;
	},

    setIshu: function(ishu) {
		this.ishu = ishu;
	}
})
