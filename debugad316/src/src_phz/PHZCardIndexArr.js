/**
 * Created by zhoufan on 2018/5/12.
 */
var PaohzCardIndexArr = cc.Class.extend({

    a: [],

    ctor: function() {
        this.a = [];
    },

    addPaohzCardIndex: function(count, majiangList, val) {
        if (!this.a[count]) {
            this.a[count] = new PaohuziIndex();
        }
        this.a[count].addPaohz(val, majiangList);
        this.a[count].addVal(val);
    },

    /**
     * 根据牌的张数得到牌
     *
     * @param size
     *            张数
     * @return
     */
    getPaohzCardMap: function(size) {
        var map = {};
        for (var i = 0; i < this.a.length; i++) {
            if (size <= i + 1) {
                var majiangIndex = this.a[i];
                if (majiangIndex != null) {
                    for (var key in majiangIndex.getPaohzCardMap()) {
                        map[key] = majiangIndex.getPaohzValMap()[key];
                    }
                }
            }
        }
        return map;
    },


    getDuizis: function() {
        var list = [];
        for (var i = 0; i < this.a.length; i++) {
            if (2 <= i + 1) {
                var index = this.a[i];
                if (index != null) {
                    for (var key in index.getPaohzValMap()) {
                        var mapVal = index.getPaohzValMap()[key];
                        var val = mapVal[0].i;
                        if (ArrayUtil.indexOf(PHZ2710List, val) < 0) {
                            list.splice(0, 0, mapVal);
                        } else {
                            list.push(mapVal);
                        }
                    }
                }
            }

        }
        return list;
    },

    /**
     * 牌的张数大于2的 (对子数)
     *
     * @return
     */
    getDuiziNum: function() {
        var num = 0;
        for (var i = 1; i < this.a.length; i++) {
            var majiangIndex = this.a[i];
            if (majiangIndex == null) {
                continue;
            }
            if (i == 3) {
                num += majiangIndex.getLength() * 2;
            } else {
                num += majiangIndex.getLength();

            }
        }
        return num;
    },

    /**
     * 牌的张数大于3的 (刻字数)
     *
     * @return
     */
    getKeziNum: function() {
        var num = 0;
        for (var i = 2; i < this.a.length; i++) {
            var majiangIndex = this.a[i];
            if (majiangIndex == null) {
                continue;
            }
            num += majiangIndex.getLength();

        }
        return num;
    },

    getKeziList: function() {
        var list = [];
        for (var i = 2; i < this.a.length; i++) {
            var majiangIndex = this.a[i];
            if (majiangIndex == null) {
                continue;
            }
            for (var j=0;j<majiangIndex.getPaohzList().length;j++) {
                list.push(majiangIndex.getPaohzList()[j]);
            }
        }
        return list;
    },

    /**
     * 得到牌
     *
     * @param index
     *            0一张 , 1 二张 , 2 三张 , 3 四张
     * @return
     */
    getPaohzCardIndex: function(index) {
        var majiangIndex = this.a[index];
        return majiangIndex;
    },

    getA: function() {
        return this.a;
    },

    tostr: function() {
        //var i = 0;
        //var str = "";
        //for (var majiang : this.a) {
        //    if (majiang == null) {
        //        continue;
        //    }
        //    str += i + "  " + JacksonUtil.writeValueAsString(majiang.getValList()) + " -->" + JacksonUtil.writeValueAsString(majiang.getPaohzValMap()) + "\n";
        //    i++;
        //}
        //return str;
    }

})