/**
 * Created by zhoufan on 2018/5/12.
 */
var PaohuziIndex = cc.Class.extend({

    phzValMap: {},
    valList :[],

    ctor: function() {
        this.phzValMap = {};
        this.valList = [];
    },

    addPaohz: function(val, majiangs) {
        this.phzValMap[val] = majiangs;
    },

    /**
     * 符合的麻将值list
     *
     * @return
     */
    getValList: function() {
        return this.valList;
    },

//	public List<PaohzCard> getPhzs() {
//		List<PaohzCard> phzs = new ArrayList<>();
//		if (phzValMap != null) {
//			for (Entry<Integer, List<PaohzCard>> entry : phzValMap.entrySet()) {
//				phzs.addAll(entry.getValue());
//			}
//		}
//		return phzs;
//	}

    /**
     * 符合的麻将值的长度
     *
     * @return
     */
    getLength: function() {
        return this.valList.length;
    },

    setValList: function(valList) {
        this.valList = valList;
    },

    addVal: function(val) {
        this.valList.push(val);
    },

    getPaohzValMap: function() {
        return this.phzValMap;
    },

    getPaohzList: function() {
        var list = [];
        for (var key in this.phzValMap) {
            //list = ArrayUtil.clone(this.phzValMap[key]);
            for (var key1 in this.phzValMap[key]) {
                list.push(this.phzValMap[key][key1]);
            }
        }
        return list;
    },

    setPhzValMap: function(majiangValMap) {
        this.phzValMap = majiangValMap;
    }

})