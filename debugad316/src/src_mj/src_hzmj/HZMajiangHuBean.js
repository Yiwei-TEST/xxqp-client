/**
 * Created by zhoufan on 2017/8/11.//1
 */
var HZMajiangHuBean = cc.Class.extend({

    fuPaiType: 0,
    jiangLei: 0,
    fuCount: 0,
    jiangModDefList: [],
    jiangVal: 0,
    huVal:0,
    ishu:false,
    lackList: [],
    needBuFei9:false,
    hasMajiangList:[],
    isQixiaodui:false,

    ctor: function() {
        this.jiangModDefList = [];
        this.fuPaiType = 0;
        this.jiangLei = 0;
        this.fuCount = 0;
        this.jiangVal = 0;
        this.huVal = 0;
        this.huId = 0;
        this.ishu = false;
        this.lackList = [];
        this.hasBuFei1 = false;
        this.needBuFei9 = false;
        this.relatedHuList = [];
        this.isfilterBaiJiao = false;
    },

    setIsFilterBaiJiao: function(val) {
        this.isfilterBaiJiao = val;
    },

    getIsFilterBaiJiao: function() {
        return this.isfilterBaiJiao;
    },

    cleanRelatedHuList:function(){
        this.relatedHuList.length = 0;
    },

    setRelatedHuList: function(relatedHuList, huBean, isShunzi) {
        var huVal = huBean.getHuVal();
        var huId = huBean.getHuId();
        var relatedHuListCloned = ArrayUtil.clone(relatedHuList);
        for(var i=0;i<relatedHuList.length;i++) {
            if (isShunzi) {
                if (relatedHuList[i].i == huVal) {
                    relatedHuListCloned.splice(i,1);
                    break;
                }
            } else {
                if (relatedHuList[i].c == huId) {
                    relatedHuListCloned.splice(i,1);
                    break;
                }
            }
        }
        ArrayUtil.merge(relatedHuListCloned,this.relatedHuList);
    },

    getRelatedHuList: function() {
        return this.relatedHuList;
    },

    isNeedBuFei9: function() {
        return this.needBuFei9;
    },

    setNeedBuFei9: function(needBuFei9) {
        this.needBuFei9 = needBuFei9;
    },

    isFei1: function(mjVal) {
        return (mjVal==11 || mjVal==21 || mjVal==31);
    },

    isHasBuFei1: function() {
        return this.hasBuFei1;
    },

    setHasBuFei1: function(hasBuFei1) {
        this.hasBuFei1 = hasBuFei1;
    },

    getLackList: function() {
        return this.lackList;
    },

    setLackList: function(val) {
        this.lackList = val;
    },

    isHu: function() {
        return this.ishu;
    },

    setHu: function(isHu) {
        this.ishu = isHu;
    },

    isQiXiaoDui: function() {
        return this.isQixiaodui;
    },

    setQiXiaoDui: function(isQixiaodui) {
        this.isQixiaodui = isQixiaodui;
    },

    getHuVal: function() {
        return this.huVal;
    },

    setHuVal: function(huVal) {
        this.huVal = huVal;
    },

    getHuId: function() {
        return this.huId;
    },

    setHuId: function(huVal) {
        this.huId = huVal;
    },

    getJiangLei: function() {
        return this.jiangLei;
    },

    setJiangLei: function(jiangLei) {
        this.jiangLei = jiangLei;
    },

    getJiangModDefList: function() {
        return this.jiangModDefList;
    },

    setJiangModDefList: function(jiangModDefList) {
        this.jiangModDefList = jiangModDefList;
    },

    getFuCount: function() {
        return this.fuCount;
    },

    setFuCount: function(fuCount) {
        this.fuCount = fuCount;
    },

    getJiangVal: function() {
        return this.jiangVal;
    },

    setJiangVal: function(jiangVal) {
        this.jiangVal = jiangVal;
    },

    getFuPaiType: function() {
        return this.fuPaiType;
    },

    setFuPaiType: function(fuPaiType) {
        this.fuPaiType = fuPaiType;
    },

    isYingJiangLei: function() {
        return (this.jiangLei == MJJiangLeiType.YING_JIANG_258 || this.jiangLei == MJJiangLeiType.YING_JIANG_369);
    }
})
