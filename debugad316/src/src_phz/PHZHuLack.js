/**
 * Created by zhoufan on 2018/5/12.
 */
var PaohuziHuLack = cc.Class.extend({

    lackVal: [],
    isNeedDui1: false,
    hongzhongNum: 0,
    isHu1: false,
    huxi: 0,
    fail2710Val: null,
    // 胡牌时的牌组
    phzHuCards: null,
    // 跑胡或者提胡
    paohuAction: 0,
    paohuList: [],
    // 胡牌时检查的牌
    checkCard: null,
    // 是否是自己摸的牌
    isSelfMo1: false,

    ctor: function() {
        this.lackVal = [];
        this.isNeedDui1 = false;
        this.hongzhongNum = 0;
        this.isHu1 = false;
        this.huxi = 0;
        this.fail2710Val = null;
        this.phzHuCards = null;
        this.paohuAction = 0;
        this.paohuList = [];
        this.checkCard = null;
        this.isSelfMo1 = false;
    },

    clone: function() {
        var o = new PaohuziHuLack();
        o.setSelfMo(this.isSelfMo1);
        o.setCheckCard(this.checkCard);
        o.setHongzhongNum(this.hongzhongNum);
        o.setHuxi(this.huxi);
        o.setNeedDui(this.isNeedDui1);
        if (this.phzHuCards != null) {
            o.setPhzHuCards(ArrayUtil.clone(this.phzHuCards));
        }
        if (this.fail2710Val != null) {
            o.setFail2710Val(ArrayUtil.clone(this.fail2710Val));
        }
        if (this.paohuList != null) {
            o.setPaohuList(ArrayUtil.clone(this.paohuList));
        }
        return o;
    },

    getCheckCard: function() {
        return this.checkCard;
    },

    setCheckCard: function(checkCard) {
        this.checkCard = checkCard;
    },

    isSelfMo: function() {
        return this.isSelfMo1;
    },

    setSelfMo: function(isSelfMo) {
        this.isSelfMo1 = isSelfMo;
    },

    getPaohuAction: function() {
        return this.paohuAction;
    },

    setPaohuAction: function(action) {
        this.paohuAction = action;
    },

    getPaohuList: function() {
        return this.paohuList;
    },

    setPaohuList: function(paohuList) {
        this.paohuList = paohuList;
    },

    addLack: function(val) {
        this.lackVal.push(val);
    },

    addAllLack: function(vallist) {
        this.lackVal.addAll(vallist);
    },

    getLackVal: function() {
        return this.lackVal;
    },

    setLackVal: function(lackVal) {
        this.lackVal = lackVal;
    },

    getHongzhongNum: function() {
        return this.hongzhongNum;
    },

    changeHongzhong: function(count) {
        this.hongzhongNum += count;
    },

    setHongzhongNum: function(hongzhongNum) {
        this.hongzhongNum = hongzhongNum;
    },

    isNeedDui: function() {
        return this.isNeedDui1;
    },

    setNeedDui: function(isNeedDui) {
        this.isNeedDui1 = isNeedDui;
    },

    isHu: function() {
        return this.isHu1;
    },

    setHu: function(isHu) {
        this.isHu1 = isHu;
    },

    getHuxi: function() {
        return this.huxi;
    },

    changeHuxi: function(huxi) {
        this.huxi += huxi;
    },

    setHuxi: function(huxi) {
        this.huxi = huxi;
    },

    getFail2710Val: function() {
        return this.fail2710Val;
    },

    isHasFail2710Val: function(val) {
        // cc.log("val =",JSON.stringify(val));
        var isVal = false;
        if (val % 100 != 2) {
            return true;
        }
        if (this.fail2710Val == null) {
            return false;
        }
        if (ArrayUtil.indexOf(this.fail2710Val,val) >= 0){
            isVal = true;
        }
        return isVal;
    },

    addFail2710Val: function(fail2710Val) {
        if (this.fail2710Val == null) {
            this.fail2710Val = [];
        }
        //cc.log("fail2710Val==="+JSON.stringify(fail2710Val))
        this.fail2710Val.push(fail2710Val);
    },

    getPhzHuCards: function() {
        return this.phzHuCards;
    },

    setPhzHuCards: function(phzHuCards) {
        this.phzHuCards = phzHuCards;
    },

    addPhzHuCards: function(action, cards, huxi) {
        if (this.phzHuCards == null) {
            this.phzHuCards = [];
        }
        var type = new CardTypeHuxi();
        type.setCardIds(cards);
        type.setAction(action);
        type.setHux(huxi);
        this.phzHuCards.push(type);
    },

    setFail2710Val: function(fail2710Val) {
        this.fail2710Val = fail2710Val;
    },

    copy: function(copy) {
        this.setHuxi(copy.getHuxi());
        this.setPhzHuCards(copy.getPhzHuCards());
    },

//protected PaohuziHuLack clone() {
//    PaohuziHuLack o = null;
//    try {
//        o = (PaohuziHuLack) super.clone();
//        if (phzHuCards != null) {
//            o.setPhzHuCards(new ArrayList<>(phzHuCards));
//
//        }
//        if (fail2710Val != null) {
//            o.setFail2710Val(new ArrayList<>(fail2710Val));
//
//        }
//        if (paohuList != null) {
//            o.setPaohuList(new ArrayList<>(paohuList));
//
//        }
//    } catch (Exception e) {
//        e.printStackTrace();
//        LogUtil.e("PaohuziHuLack clone err", e);
//    }
//
//    return o;
//}
})