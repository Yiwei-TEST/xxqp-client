/**
 * Created by zhoufan on 2017/8/11.4
 */
var MajiangIndex = cc.Class.extend({
    majiangValMap:{},
    valList:[],
    ctor:function(){
        this.majiangValMap = {};
        this.valList = [];
    },

    addMajiang:function(val,majiangs) {
        if (!this.majiangValMap) {
            this.majiangValMap = {};
        }
        this.majiangValMap[val] = majiangs;
    },

    addVal:function(val) {
        if (!this.valList) {
            this.valList = [];
        }
        this.valList.push(val);
    },

    getMajiangValMap:function(){
        return this.majiangValMap;
    },

    getLength:function() {
        return this.valList.length;
    }
});

var MajiangIndexArr = cc.Class.extend({

    a:[],

    ctor:function(){
        this.a = [];
    },

    addMajiangIndex:function(count,majiangList,val){
        if(!this.a[count]){
            this.a[count] = new MajiangIndex();
        }
        this.a[count].addMajiang(val,majiangList);
        this.a[count].addVal(val);
    },

    getJiang:function(huBean) {
        var jiangList = huBean.getJiangModDefList();
        var map = {};
        for (var i = 0; i < this.a.length; i++) {
            if(2 <= i + 1){
                var majiangIndex = this.a[i];
                if (majiangIndex) {
                    //硬将将类玩法，必须指定的牌才能做将
                    if (huBean.isYingJiangLei() && jiangList != null && jiangList.length > 0) {
                        for(var key in majiangIndex.getMajiangValMap()){
                            if (ArrayUtil.indexOf(jiangList,key) >= 0) {
                                map[key] = majiangIndex.getMajiangValMap()[key];
                            }
                        }
                    } else {
                        for(var key in majiangIndex.getMajiangValMap()){
                            map[key] = majiangIndex.getMajiangValMap()[key];
                        }
                    }
                }
            }
        }
        return map;
    },

    // 牌的张数大于2的 (对子数)
    getDuiziNum:function(){
        var num = 0;
        for (var i = 1; i < this.a.length; i++) {
            var majiangIndex = this.a[i];
            if(!majiangIndex){
                continue;
            }
            if(i == 3){
                num += majiangIndex.getLength() * 2;
            }else{
                num += majiangIndex.getLength();

            }
        }
        return num;
    },

    getMajiangIndex: function(index) {
        var majiangIndex = this.a[index];
        return majiangIndex;
    }
})
