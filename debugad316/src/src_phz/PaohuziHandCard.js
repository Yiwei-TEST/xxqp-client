/**
 * Created by zhoufan on 2018/5/16.
 */
var PaohuziHandCard = cc.Class.extend({

    ctor: function() {

    },

    getOperateCards: function() {
        return this.operateCards;
    },

    setOperateCards: function(operateCards) {
        this.operateCards = operateCards;
    },

    getInoperableCards: function() {
        return this.inoperableCards;
    },

    setInoperableCards: function(inoperableCards) {
        this.inoperableCards = inoperableCards;
    },

    getIndexArr: function() {
        return this.indexArr;
    },

    setIndexArr: function(indexArr) {
        this.indexArr = indexArr;
    },

    getHandCards: function() {
        return this.handCards;
    },

    setHandCards: function(handCards) {
        this.handCards = handCards;
    },

    isCanoperateCard: function(card) {
        var index2 = this.indexArr.getPaohzCardIndex(2);
        var index3 = this.indexArr.getPaohzCardIndex(3);
        if (index2 != null && index2.getPaohzValMap()[card.v]) {
            return false;
        }
        if (index3 != null && index3.getPaohzValMap()[card.v]) {
            return false;
        }
        return true;
    }

})
