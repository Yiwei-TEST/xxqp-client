/**
 * Created by zhoufan on 2016/11/7.
 */
/**
 * 跑胡子的数据映射
 * @type {{t: number, n: number, i: number, c: number, m:number, g:number, a:number, as:number,se:number,isChi:number,zhe:number,same:number}}
 */
var ZHZVo = {
    t:0, //大小类型(贰、二)
    n:0, //数字
    i:0, //大小排序
    c:0, //后台索引,
    m:0, //是否是摸牌
    g:0, //是否是杠
    a:0,  //暗杠，这个值为1，那么只显示牌背
    as:0, //暗杠自己显示的情况,这个值为1，显示成透明牌背
    se:0, //是否用作选牌
    isChi:0,
    zhe:0,//是否需要显示遮罩层
    same:0 //相同个数是否大于等于3个
};

var ZHZAction = {
    HU:1,
    PENG:2,
    WEI:3,
    TI:4,
    GUO:5,
    CHI:6,
    PAO:7,
    KAN:8,
    MO_PAI:9,
    CHOU_WEI:10,
    LONG_BU_ZI:11,
    WANG_BU_ZI:16,
}

var ZHZ2710List = [2,7,10];

var ZHZAI = {
    PHZ:[
        {t:0,n:0,i:0,c:0,v:0},
        {t:1,n:1,i:1,c:1,v:1},
        {t:1,n:2,i:2,c:2,v:2},
        {t:1,n:3,i:3,c:3,v:3},
        {t:1,n:4,i:4,c:4,v:4},
        {t:1,n:5,i:5,c:5,v:5},
        {t:1,n:6,i:6,c:6,v:6},
        {t:1,n:7,i:7,c:7,v:7},
        {t:1,n:8,i:8,c:8,v:8},
        {t:1,n:9,i:9,c:9,v:9},
        {t:1,n:10,i:10,c:10,v:10},
        {t:1,n:1,i:1,c:11,v:1},
        {t:1,n:2,i:2,c:12,v:2},
        {t:1,n:3,i:3,c:13,v:3},
        {t:1,n:4,i:4,c:14,v:4},
        {t:1,n:5,i:5,c:15,v:5},
        {t:1,n:6,i:6,c:16,v:6},
        {t:1,n:7,i:7,c:17,v:7},
        {t:1,n:8,i:8,c:18,v:8},
        {t:1,n:9,i:9,c:19,v:9},
        {t:1,n:10,i:10,c:20,v:10},
        {t:1,n:1,i:1,c:21,v:1},
        {t:1,n:2,i:2,c:22,v:2},
        {t:1,n:3,i:3,c:23,v:3},
        {t:1,n:4,i:4,c:24,v:4},
        {t:1,n:5,i:5,c:25,v:5},
        {t:1,n:6,i:6,c:26,v:6},
        {t:1,n:7,i:7,c:27,v:7},
        {t:1,n:8,i:8,c:28,v:8},
        {t:1,n:9,i:9,c:29,v:9},
        {t:1,n:10,i:10,c:30,v:10},
        {t:1,n:1,i:1,c:31,v:1},
        {t:1,n:2,i:2,c:32,v:2},
        {t:1,n:3,i:3,c:33,v:3},
        {t:1,n:4,i:4,c:34,v:4},
        {t:1,n:5,i:5,c:35,v:5},
        {t:1,n:6,i:6,c:36,v:6},
        {t:1,n:7,i:7,c:37,v:7},
        {t:1,n:8,i:8,c:38,v:8},
        {t:1,n:9,i:9,c:39,v:9},
        {t:1,n:10,i:10,c:40,v:10},
        {t:2,n:1,i:11,c:41,v:101},
        {t:2,n:2,i:12,c:42,v:102},
        {t:2,n:3,i:13,c:43,v:103},
        {t:2,n:4,i:14,c:44,v:104},
        {t:2,n:5,i:15,c:45,v:105},
        {t:2,n:6,i:16,c:46,v:106},
        {t:2,n:7,i:17,c:47,v:107},
        {t:2,n:8,i:18,c:48,v:108},
        {t:2,n:9,i:19,c:49,v:109},
        {t:2,n:10,i:20,c:50,v:110},
        {t:2,n:1,i:11,c:51,v:101},
        {t:2,n:2,i:12,c:52,v:102},
        {t:2,n:3,i:13,c:53,v:103},
        {t:2,n:4,i:14,c:54,v:104},
        {t:2,n:5,i:15,c:55,v:105},
        {t:2,n:6,i:16,c:56,v:106},
        {t:2,n:7,i:17,c:57,v:107},
        {t:2,n:8,i:18,c:58,v:108},
        {t:2,n:9,i:19,c:59,v:109},
        {t:2,n:10,i:20,c:60,v:110},
        {t:2,n:1,i:11,c:61,v:101},
        {t:2,n:2,i:12,c:62,v:102},
        {t:2,n:3,i:13,c:63,v:103},
        {t:2,n:4,i:14,c:64,v:104},
        {t:2,n:5,i:15,c:65,v:105},
        {t:2,n:6,i:16,c:66,v:106},
        {t:2,n:7,i:17,c:67,v:107},
        {t:2,n:8,i:18,c:68,v:108},
        {t:2,n:9,i:19,c:69,v:109},
        {t:2,n:10,i:20,c:70,v:110},
        {t:2,n:1,i:11,c:71,v:101},
        {t:2,n:2,i:12,c:72,v:102},
        {t:2,n:3,i:13,c:73,v:103},
        {t:2,n:4,i:14,c:74,v:104},
        {t:2,n:5,i:15,c:75,v:105},
        {t:2,n:6,i:16,c:76,v:106},
        {t:2,n:7,i:17,c:77,v:107},
        {t:2,n:8,i:18,c:78,v:108},
        {t:2,n:9,i:19,c:79,v:109},
        {t:2,n:10,i:20,c:80,v:110},
        {t:2,n:11,i:81,c:81,v:0},
        {t:2,n:11,i:82,c:82,v:0},
        {t:2,n:11,i:83,c:83,v:0},
        {t:2,n:11,i:84,c:84,v:0}
    ],

    getVoArray:function(ids){
        var voArray = [];
        for(var i=0;i<ids.length;i++){
            voArray.push(PHZAI.getPHZDef(ids[i]));
        }
        return voArray;
    },

    getPHZVDef:function(id){
        var res = null;
        for(var i=0;i<this.PHZ.length;i++){
            var card = this.PHZ[i];
            if(card.v == id){
                res = card;
                break;
            }
        }
        if(res==null){
            cc.log("getPHZDef not found::"+id);
        }else{
            var realRes = {};//需要克隆一个，不然对该对象做操作会有引用的问题
            for(var key in res){
                realRes[key] = res[key];
            }
            return realRes;
        }
        return res;
    },

    getPHZDef:function(id){
        var res = null;
        for(var i=0;i<this.PHZ.length;i++){
            var card = this.PHZ[i];
            if(card.c == id){
                res = card;
                break;
            }
        }
        if(res==null){
            cc.log("getPHZDef not found::"+id);
        }else{
            var realRes = {};//需要克隆一个，不然对该对象做操作会有引用的问题
            for(var key in res){
                realRes[key] = res[key];
            }
            return realRes;
        }
        return res;
    },

    /**
     * @param direct
     * @param place
     * @returns {MJDisplayVo}
     */
    getDisplayVo:function(direct,place){
        return {direct:direct,place:place};
    },

    sortPHZ:function(vo1,vo2){
        if(vo2.t==vo1.t){
            return vo1.n-vo2.n;
        }
        return vo1.t-vo2.t;
    },

    sortPHZByN:function(vo1,vo2){
        return vo1.n-vo2.n;
    },

    /**
     * 把手牌显示成有规则的10束牌
     * @param voArray
     * @returns {Array}
     */
    sortHandsVo:function(voArray){
        voArray.sort(this.sortPHZ);
        var array4 = [];
        var array3 = [];
        var array2 = [];
        var arrays = [];
        var array123 = [];
        var array123big = [];
        var array2710 = [];
        var array2710big = [];
        var array2nosame = [];
        var arrays2 = [];
        var arrays2S = [];
        var array2710double = [];
        var array2710bigdouble = [];
        var array1 = [];
        var array1Single = [];
        var linkedMap = new SimpleLinkedMap();
        for(var i=0;i<voArray.length;i++){
            var vo = voArray[i];
            var prefix = vo.t+"_"+vo.n;
            if(!linkedMap.containsKey(prefix)){
                linkedMap.put(prefix,[vo]);
            }else{
                var sameArray = linkedMap.get(prefix);
                sameArray.push(vo);
                linkedMap.put(prefix,sameArray);
                if(sameArray.length>=3){
                    for(var s=0;s<sameArray.length;s++){
                        sameArray[s].same = 1;
                    }
                }
            }
        }
        //查找2个或者2个以上相同的
        var vals = linkedMap.getValues();
        for(var i=0;i<vals.length;i++){
            var val = vals[i];
            if(val.length==4)
                array4.push(val);
            if(val.length==3)
                array3.push(val);
            if(val.length==2)
                array2.push(val);
            if(val.length==1){
                array1.push(val);
                array1Single.push(val[0]);
            }
        }
        var delFromArray1 = [];
        var delFromArray1Fuc = function(id){
            for(var i=0;i<array1.length;i++){
                if(array1[i][0].c==id){
                    array1.splice(i,1);
                    array1Single.splice(i,1);
                    break;
                }
            }
        };
        //查找一二三
        var find2710Func = function(array,n){
            for(var i=0;i<array.length;i++){
                if(array[i].n==n)
                    return false;
            }
            return true;
        }
        
        var small123 = [];
        var big123 = [];
        for(var i=0;i<array1Single.length;i++){
        	var vo = array1Single[i];
        	if(vo.t==1 && (vo.n==1||vo.n==2||vo.n==3) && find2710Func(small123,vo))
        		small123.push(vo);
        	if(vo.t==2 && (vo.n==1||vo.n==2||vo.n==3) && find2710Func(big123,vo))
        		big123.push(vo);
        }
        if(small123.length==3){
        	ArrayUtil.merge([small123[2].c,small123[1].c,small123[0].c],delFromArray1);
        	array123.push([small123[2],small123[1],small123[0]]);
        }
        if(big123.length==3){
        	ArrayUtil.merge([big123[2].c,big123[1].c,big123[0].c],delFromArray1);
        	array123big.push([big123[2],big123[1],big123[0]]);
        }
        for(var i=0;i<delFromArray1.length;i++){
        	delFromArray1Fuc(delFromArray1[i]);
        }
        //查找二七十
        delFromArray1.length=0;
        var small2710 = [];
        var big2710 = [];
        for(var i=0;i<array1Single.length;i++){
            var vo = array1Single[i];
            if(vo.t==1 && (vo.n==2||vo.n==7||vo.n==10) && find2710Func(small2710,vo))
                small2710.push(vo);
            if(vo.t==2 && (vo.n==2||vo.n==7||vo.n==10) && find2710Func(big2710,vo))
                big2710.push(vo);
        }
        if(small2710.length==3){
            ArrayUtil.merge([small2710[2].c,small2710[1].c,small2710[0].c],delFromArray1);
            array2710.push([small2710[2],small2710[1],small2710[0]]);
        }
        if(big2710.length==3){
            ArrayUtil.merge([big2710[2].c,big2710[1].c,big2710[0].c],delFromArray1);
            array2710big.push([big2710[2],big2710[1],big2710[0]]);
        }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        //从单个中查找顺子
        delFromArray1.length=0;
        for(var i=0;i<array1Single.length;i++){
        	var vo = array1Single[i];
        	var vo1 = array1Single[i+1];
        	var vo2 = array1Single[i+2];
        	if(vo1&&vo2&&vo.t==vo1.t&&vo1.t==vo2.t&&(vo2.n-vo.n)==2){
        		ArrayUtil.merge([vo2.c,vo1.c,vo.c],delFromArray1);
        		arrays.push([vo2,vo1,vo]);
        		i+=2;
        	}
        }
        for(var i=0;i<delFromArray1.length;i++){
        	delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //把剩下的单个插到相同的3个或者2个中去
        var insertToArrayFunc = function(sourceArray,vo){
            for(var i=0;i<sourceArray.length;i++){
                var sourceArr = sourceArray[i];
                if(sourceArr[0].n==vo.n){
                    sourceArr.push(vo);
                    delFromArray1.push(vo.c);
                    return true;
                }
            }
        }
        // for(var i=0;i<array1Single.length;i++){
        //     var single = array1Single[i];
        //     if(insertToArrayFunc(array2,single))
        //         continue;
        // }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        var array1SingleClone = ArrayUtil.clone(array1Single);
        array1SingleClone.sort(this.sortPHZByN);
        //再查找单个中大小N一样的情况，如大五小五
        // for(var i=0;i<array1SingleClone.length;i++){
        //     var vo = array1SingleClone[i];
        //     var vo1 = array1SingleClone[i+1];
        //     if(vo1&&vo.t!=vo1.t&&vo.n==vo1.n){
        //         ArrayUtil.merge([vo1.c,vo.c],delFromArray1);
        //         array2nosame.push([vo1,vo]);
        //         i+=1;
        //     }
        // }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //再查找2张牌的顺子
        for(var i=0;i<array1Single.length;i++){
            var vo = array1Single[i];
            var vo1 = array1Single[i+1];
            if(vo1&&vo.t==vo1.t&&(vo1.n-vo.n)==1){
                ArrayUtil.merge([vo1.c,vo.c],delFromArray1);
                arrays2.push([vo1,vo]);
                i+=1;
            }
        }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //再查找二七十中有两张单牌的顺子
        var doubel2710 = [];
        var bigdoubel2710 = [];
        for(var i=0;i<array1Single.length;i++){
        	var vo = array1Single[i];
        	if(vo.t==1 && (vo.n==2||vo.n==7||vo.n==10) && find2710Func(doubel2710,vo))
        		doubel2710.push(vo);
        	if(vo.t==2 && (vo.n==2||vo.n==7||vo.n==10) && find2710Func(bigdoubel2710,vo))
        		bigdoubel2710.push(vo);
        }
        if(doubel2710.length==2){
        	ArrayUtil.merge([doubel2710[1].c,doubel2710[0].c],delFromArray1);
        	array2710double.push([doubel2710[1],doubel2710[0]]);
        }
        if(bigdoubel2710.length==2){
        	ArrayUtil.merge([bigdoubel2710[1].c,bigdoubel2710[0].c],delFromArray1);
        	array2710bigdouble.push([bigdoubel2710[1],bigdoubel2710[0]]);
        }
        for(var i=0;i<delFromArray1.length;i++){
        	delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //再查找2张牌间隔的顺子
        for(var i=0;i<array1Single.length;i++){
        	var vo = array1Single[i];
        	var vo1 = array1Single[i+1];
        	if(vo1&&vo.t==vo1.t&&(vo1.n-vo.n)==2){
        		ArrayUtil.merge([vo1.c,vo.c],delFromArray1);
        		arrays2S.push([vo1,vo]);
        		i+=1;
        	}
        }
        for(var i=0;i<delFromArray1.length;i++){
        	delFromArray1Fuc(delFromArray1[i]);
        }
        var result = [];
        ArrayUtil.merge(array4,result);
        ArrayUtil.merge(array3,result);
        ArrayUtil.merge(array2,result);
        ArrayUtil.merge(arrays,result);
        ArrayUtil.merge(array123,result);
        ArrayUtil.merge(array123big,result);
        ArrayUtil.merge(array2710,result);
        ArrayUtil.merge(array2710big,result);
        ArrayUtil.merge(array2nosame,result);
        ArrayUtil.merge(arrays2,result);
        ArrayUtil.merge(array2710double,result);
        ArrayUtil.merge(array2710bigdouble,result);
        ArrayUtil.merge(arrays2S, result);
        // this.sortArray(result,true);
        if(result.length+array1.length>11){
            var except = 10-result.length;
            for(var i=0;i<except;i++){
                var lastArray = [[array1[0][0]]];
                ArrayUtil.merge(lastArray,result);
                array1.shift();
            }
            var lastArray = [[]];
            for(var i=0;i<array1.length;i++){
                lastArray[0].push(array1[i][0])
            }
            ArrayUtil.merge(lastArray,result);
        }else{
            ArrayUtil.merge(array1,result);
        }
        this.sortArray(result,true);

        return result;
    },
    sortHandsByHxVo:function(voArray){
        voArray.sort(this.sortPHZ);
        var newCardArray = ArrayUtil.clone(voArray);
        var array4 = [];
        var array4big = [];
        var array3 = [];
        var array3big = [];
        var array2 = [];
        var arrays = [];
        var array123 = [];
        var array123big = [];
        var array2710 = [];
        var array2710big = [];
        var array2nosame = [];
        var arrays2 = [];
        var arrays2S = [];
        var array2710double = [];
        var array2710bigdouble = [];
        var array1 = [];
        var array1Single = [];
        var linkedMap = new SimpleLinkedMap();
        for(var i=0;i<voArray.length;i++){
            var vo = voArray[i];
            var prefix = vo.t+"_"+vo.n;
            if(!linkedMap.containsKey(prefix)){
                linkedMap.put(prefix,[vo]);
            }else{
                var sameArray = linkedMap.get(prefix);
                sameArray.push(vo);
                linkedMap.put(prefix,sameArray);
                if(sameArray.length>=3){
                    for(var s=0;s<sameArray.length;s++){
                        sameArray[s].same = 1;
                    }
                }
            }
        }

        //cc.log("newCardArray^^^^^^^^^"+JSON.stringify(newCardArray));

        var delFromnewCardArrayFuc = function(id){
            for(var i=0;i<newCardArray.length;i++){
                if(newCardArray[i].c==id){
                    newCardArray.splice(i,1);
                    break;
                }
            }
        };

        //查找2个或者2个以上相同的
        var vals = linkedMap.getValues();
        for(var i=0;i<vals.length;i++){
            var val = vals[i];
            if(val.length==4){
                if (val[0].t == 1){
                    array4.push(val);
                }else{
                    array4big.push(val);
                }
            }
            if(val.length==3){
                if (val[0].t == 1){
                    array3.push(val);
                }else{
                    array3big.push(val);
                }
            }
        }
        for(var i=0;i<array4.length;i++){
            for(var j=0;j<array4[i].length;j++){
                delFromnewCardArrayFuc(array4[i][j].c);
            }
        }
        for(var i=0;i<array3.length;i++){
            for(var j=0;j<array3[i].length;j++){
                delFromnewCardArrayFuc(array3[i][j].c);
            }
        }

        for(var i=0;i<array4big.length;i++){
            for(var j=0;j<array4big[i].length;j++){
                delFromnewCardArrayFuc(array4big[i][j].c);
            }
        }
        for(var i=0;i<array3big.length;i++){
            for(var j=0;j<array3big[i].length;j++){
                delFromnewCardArrayFuc(array3big[i][j].c);
            }
        }

        var arraybig1 = [];
        var arraybig2 = [];
        var arraybig3 = [];
        var arraybig7 = [];
        var arraybig10 = [];

        var arraysmall1 = [];
        var arraysmall2 = [];
        var arraysmall3 = [];
        var arraysmall7 = [];
        var arraysmall10 = [];
        for(var i=0;i<newCardArray.length;i++){
            if(newCardArray[i].n == 1){
                if (newCardArray[i].t == 1){
                    arraysmall1.push(newCardArray[i])
                }else if(newCardArray[i].t == 2){
                    arraybig1.push(newCardArray[i]);
                }
            }else if(newCardArray[i].n == 2){
                if (newCardArray[i].t == 1){
                    arraysmall2.push(newCardArray[i])
                }else if(newCardArray[i].t == 2){
                    arraybig2.push(newCardArray[i]);
                }
            }else if(newCardArray[i].n == 3){
                if (newCardArray[i].t == 1){
                    arraysmall3.push(newCardArray[i])
                }else if(newCardArray[i].t == 2){
                    arraybig3.push(newCardArray[i]);
                }
            }else if(newCardArray[i].n == 7){
                if (newCardArray[i].t == 1){
                    arraysmall7.push(newCardArray[i])
                }else if(newCardArray[i].t == 2){
                    arraybig7.push(newCardArray[i]);
                }
            }else if(newCardArray[i].n == 10){
                if (newCardArray[i].t == 1){
                    arraysmall10.push(newCardArray[i])
                }else if(newCardArray[i].t == 2){
                    arraybig10.push(newCardArray[i]);
                }
            }
        }
        var delFromNewArray = [];
        //查找大123和大2710
        for(var i=0;i<arraybig2.length;i++){
            for(var j=0;j<arraybig1.length;j++){
                for(var k=0;k<arraybig3.length;k++){
                    if (arraybig2[i].n == 2 && arraybig1[j].n == 1 && arraybig3[k].n == 3){
                        array123big.push([arraybig3[k],arraybig2[i],arraybig1[j]]);
                        delFromNewArray.push(arraybig1[j]);
                        delFromNewArray.push(arraybig2[i]);
                        delFromNewArray.push(arraybig3[k]);
                        arraybig2.splice(i,1);
                        arraybig1.splice(j,1);
                        arraybig3.splice(k,1);
                        i = -1;
                    }
                }
            }
        }
        for(var i=0;i<arraybig2.length;i++){
            for(var j=0;j<arraybig7.length;j++){
                for(var k=0;k<arraybig10.length;k++){
                    if (arraybig2[i].n == 2 && arraybig7[j].n == 7 && arraybig10[k].n == 10){
                        array2710big.push([arraybig10[k],arraybig7[j],arraybig2[i]]);
                        delFromNewArray.push(arraybig2[i]);
                        delFromNewArray.push(arraybig7[j]);
                        delFromNewArray.push(arraybig10[k]);
                        arraybig2.splice(i,1);
                        arraybig7.splice(j,1);
                        arraybig10.splice(k,1);
                        i = -1;
                    }
                }
            }
        }

        for(var i=0;i<delFromNewArray.length;i++){
            delFromnewCardArrayFuc(delFromNewArray[i].c);
        }
        delFromNewArray.length=0;

        //找小的123 ，2710
        for(var i=0;i<arraysmall2.length;i++){
            for(var j=0;j<arraysmall1.length;j++){
                for(var k=0;k<arraysmall3.length;k++){
                    if (arraysmall2[i].n == 2 && arraysmall1[j].n == 1 && arraysmall3[k].n == 3){
                        array123.push([arraysmall3[k],arraysmall2[i],arraysmall1[j]]);
                        delFromNewArray.push(arraysmall1[i]);
                        delFromNewArray.push(arraysmall2[j]);
                        delFromNewArray.push(arraysmall3[k]);
                        arraysmall2.splice(i,1);
                        arraysmall1.splice(j,1);
                        arraysmall3.splice(k,1);
                        i = -1;
                    }
                }
            }
        }
        //cc.log("arraysmall2.length==="+arraysmall2.length)
        //cc.log("arraysmall7.length==="+arraysmall7.length)
        //cc.log("arraysmall10.length==="+arraysmall10.length)
        for(var i=0;i<arraysmall2.length;i++){
            //cc.log("******2")
            for(var j=0;j<arraysmall7.length;j++){
                //cc.log("******3")
                for(var k=0;k<arraysmall10.length;k++){
                    //cc.log("******4")
                    if (arraysmall2[i].n == 2 && arraysmall7[j].n == 7 && arraysmall10[k].n == 10){
                        array2710.push([arraysmall10[k],arraysmall7[j],arraysmall2[i]]);
                        delFromNewArray.push(arraysmall2[i]);
                        delFromNewArray.push(arraysmall7[j]);
                        delFromNewArray.push(arraysmall10[k]);
                        arraysmall2.splice(i,1);
                        arraysmall7.splice(j,1);
                        arraysmall10.splice(k,1);
                        i = -1;
                        //cc.log("arraysmall2.length*****"+arraysmall2.length)
                        //cc.log("arraysmall7.length*****"+arraysmall7.length)
                        //cc.log("arraysmall10.length*****"+arraysmall10.length)
                    }
                }
            }
        }

        for(var i=0;i<delFromNewArray.length;i++){
            delFromnewCardArrayFuc(delFromNewArray[i].c);
        }
        delFromNewArray.length=0;


        var linkedMap1 = new SimpleLinkedMap();
        for(var i=0;i<newCardArray.length;i++){
            var vo = newCardArray[i];
            var prefix = vo.t+"_"+vo.n;
            if(!linkedMap1.containsKey(prefix)){
                linkedMap1.put(prefix,[vo]);
            }else{
                var sameArray = linkedMap1.get(prefix);
                sameArray.push(vo);
                linkedMap1.put(prefix,sameArray);
                if(sameArray.length>=3){
                    for(var s=0;s<sameArray.length;s++){
                        sameArray[s].same = 1;
                    }
                }
            }
        }

        var vals1 = linkedMap1.getValues();
        for(var i=0;i<vals1.length;i++){
            var val = vals1[i];
            if(val.length==2)
                array2.push(val);
            if(val.length==1){
                array1.push(val);
                array1Single.push(val[0]);
            }
        }

        //cc.log("newCardArray===="+JSON.stringify(newCardArray));

        var delFromArray1 = [];
        var delFromArray1Fuc = function(id){
            for(var i=0;i<array1.length;i++){
                if(array1[i][0].c==id){
                    array1.splice(i,1);
                    array1Single.splice(i,1);
                    break;
                }
            }
        };
        ////查找一二三
        var find2710Func = function(array,n){
            for(var i=0;i<array.length;i++){
                if(array[i].n==n)
                    return false;
            }
            return true;
        }

        //从单个中查找顺子
        delFromArray1.length=0;
        for(var i=0;i<array1Single.length;i++){
            var vo = array1Single[i];
            var vo1 = array1Single[i+1];
            var vo2 = array1Single[i+2];
            if(vo1&&vo2&&vo.t==vo1.t&&vo1.t==vo2.t&&(vo2.n-vo.n)==2){
                ArrayUtil.merge([vo2.c,vo1.c,vo.c],delFromArray1);
                arrays.push([vo2,vo1,vo]);
                i+=2;
            }
        }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //把剩下的单个插到相同的3个或者2个中去
        var insertToArrayFunc = function(sourceArray,vo){
            for(var i=0;i<sourceArray.length;i++){
                var sourceArr = sourceArray[i];
                if(sourceArr[0].n==vo.n){
                    sourceArr.push(vo);
                    delFromArray1.push(vo.c);
                    return true;
                }
            }
        }
        // for(var i=0;i<array1Single.length;i++){
        //     var single = array1Single[i];
        //     if(insertToArrayFunc(array2,single))
        //         continue;
        // }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //再查找二七十中有两张单牌的顺子
        var doubel2710 = [];
        var bigdoubel2710 = [];
        for(var i=0;i<array1Single.length;i++){
            var vo = array1Single[i];
            if(vo.t==1 && (vo.n==2||vo.n==7||vo.n==10) && find2710Func(doubel2710,vo))
                doubel2710.push(vo);
            if(vo.t==2 && (vo.n==2||vo.n==7||vo.n==10) && find2710Func(bigdoubel2710,vo))
                bigdoubel2710.push(vo);
        }
        if(doubel2710.length==2){
            ArrayUtil.merge([doubel2710[1].c,doubel2710[0].c],delFromArray1);
            array2710double.push([doubel2710[1],doubel2710[0]]);
        }
        if(bigdoubel2710.length==2){
            ArrayUtil.merge([bigdoubel2710[1].c,bigdoubel2710[0].c],delFromArray1);
            array2710bigdouble.push([bigdoubel2710[1],bigdoubel2710[0]]);
        }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //再查找2张牌的顺子
        for(var i=0;i<array1Single.length;i++){
            var vo = array1Single[i];
            var vo1 = array1Single[i+1];
            if(vo1&&vo.t==vo1.t&&(vo1.n-vo.n)==1){
                ArrayUtil.merge([vo1.c,vo.c],delFromArray1);
                arrays2.push([vo1,vo]);
                i+=1;
            }
        }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        var array1SingleClone = ArrayUtil.clone(array1Single);
        array1SingleClone.sort(this.sortPHZByN);
        // //再查找单个中大小N一样的情况，如大五小五
        // for(var i=0;i<array1SingleClone.length;i++){
        //     var vo = array1SingleClone[i];
        //     var vo1 = array1SingleClone[i+1];
        //     if(vo1&&vo.t!=vo1.t&&vo.n==vo1.n){
        //         ArrayUtil.merge([vo1.c,vo.c],delFromArray1);
        //         array2nosame.push([vo1,vo]);
        //         i+=1;
        //     }
        // }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        delFromArray1.length=0;
        //再查找2张牌间隔的顺子
        for(var i=0;i<array1Single.length;i++){
            var vo = array1Single[i];
            var vo1 = array1Single[i+1];
            if(vo1&&vo.t==vo1.t&&(vo1.n-vo.n)==2){
                ArrayUtil.merge([vo1.c,vo.c],delFromArray1);
                arrays2S.push([vo1,vo]);
                i+=1;
            }
        }
        for(var i=0;i<delFromArray1.length;i++){
            delFromArray1Fuc(delFromArray1[i]);
        }
        var result = [];
        ArrayUtil.merge(array4big,result);
        ArrayUtil.merge(array4,result);
        ArrayUtil.merge(array3big,result);
        ArrayUtil.merge(array123big,result);
        ArrayUtil.merge(array2710big,result);
        ArrayUtil.merge(array3,result);
        ArrayUtil.merge(array123,result);
        ArrayUtil.merge(array2710,result);
        ArrayUtil.merge(array2,result);
        ArrayUtil.merge(arrays,result);
        ArrayUtil.merge(array2710bigdouble,result);
        ArrayUtil.merge(array2710double,result);
        ArrayUtil.merge(array2nosame,result);
        ArrayUtil.merge(arrays2,result);
        ArrayUtil.merge(arrays2S, result);
        if(result.length+array1.length>11){
            var except = 10-result.length;
            for(var i=0;i<except;i++){
                var lastArray = [[array1[0][0]]];
                ArrayUtil.merge(lastArray,result);
                array1.shift();
            }
            var lastArray = [[]];
            for(var i=0;i<array1.length;i++){
                lastArray[0].push(array1[i][0])
            }
            ArrayUtil.merge(lastArray,result);
        }else{
            ArrayUtil.merge(array1,result);
        }
        return result;
    },


    insertToResult:function(delFromArray1,array1Single,result){
    	delFromArray1.length=0;
    	for(var i=0;i<array1Single.length;i++){
    		var isBan = true;
    		var isCoord = -1;
    		var singleVo = array1Single[i];
    		for(var j=0;j<result.length;j++){
    			if(result[j].length==2){
    				var vo = result[j][0];
    				var vo1 = result[j][1];
    				if(vo.t!=vo1.t&&vo.n==vo1.n){
    					if((ArrayUtil.indexOf([2,7,10],singleVo.n)>=0)){
    						if(((ArrayUtil.indexOf([2,7,10],vo.n)>=0) && result[j][0].t==singleVo.t) || ((ArrayUtil.indexOf([2,7,10],vo1.n)>=0)  && result[j][1].t==singleVo.t)){
    							isBan = false;
    							result[j].push(singleVo);
    							ArrayUtil.merge([singleVo.c],delFromArray1);
    							break;
    						}
    					}
    					if(((Math.abs(vo.n-singleVo.n)<=2) && vo.t==singleVo.t) || ((Math.abs(vo1.n-singleVo.n)<=2) && vo1.t==singleVo.t)){
    						isBan = false;
    						result[j].push(singleVo);
    						ArrayUtil.merge([singleVo.c],delFromArray1);
    						break;
    					}
    				}
    			}
    		}
    	}
    	return delFromArray1;
    },
    
    getHuXiCardSort:function(result){
    	var findHuXi = [];
    	for(var i=0;i<result.length;i++){
    		var voArray = result[i];
    		var isHuXi1 = [1,2,3];
    		var isHuXi2 = [2,7,10];
    		for(var j=0;j<voArray.length;j++){
    			var vo = voArray[j];
    			var isHas123 = ArrayUtil.indexOf(isHuXi1,vo.n);
    			var isHas2710 = ArrayUtil.indexOf(isHuXi2,vo.n);
    			if(isHas123>=0){
    				isHuXi1.splice(isHas123,1);
    			}
    			if(isHas2710>=0){
    				isHuXi2.splice(isHas2710,1);
    			}
    		}
    		if(isHuXi1.length==0 || isHuXi2.length==0){
    			result.splice(i,1);
    			findHuXi.push(voArray);
    		}
    	}
    	this.sortArray(findHuXi,true);
    	ArrayUtil.merge(result, findHuXi);
    	return findHuXi;
    },

    /**
     * 跑胡子吃牌规则,不过滤摆牌
     * @param PHZOnHands
     * @param lastPHZ
     * @param isUniq
     * @returns {Array}
     */
    getChiNoFilter:function(PHZOnHands,lastPHZ,isUniq){
        isUniq = isUniq || false;
        var t = lastPHZ.t;
        var n = lastPHZ.n;
        var l = PHZOnHands.length;
        var start = n-2;start=start<1?1:start;
        var end = n+2;end=end>10?10:end;
        var array = [];
        //顺子
        for(var i=start;i<=n;i++){
            var temp =i+2;
            if(temp>end){
                break;
            }else{
                var sArray = [];
                for(var s=i;s<=temp;s++){
                    sArray.push({t:t,n:s});
                }
                array.push(sArray);
            }
        }
        // //2大一小或者2小一大
        // array.push([{t:1,n:n},{t:2,n:n},{t:2,n:n}]);
        // array.push([{t:1,n:n},{t:1,n:n},{t:2,n:n}]);
        if(n==2){
            array.push([{t:t,n:n},{t:t,n:7},{t:t,n:10}]);
        }else if(n==7){
            array.push([{t:t,n:2},{t:t,n:n},{t:t,n:10}]);
        }else if(n==10){
            array.push([{t:t,n:2},{t:t,n:7},{t:t,n:n}]);
        }
        var result = [];
        if(array.length>0){
            var totalIds=[];
            arrayloop:for(var i=0;i<array.length;i++){
                var temp = array[i];
                var voArray = [];
                var idArray = [];
                tempLoop:for(var j=0;j<temp.length;j++){
                    var innerObject = temp[j];
                    var innert = parseInt(innerObject.t);
                    var innern = parseInt(innerObject.n);
                    mjLoop:for(var m=0;m<l;m++){
                        var vo = PHZOnHands[m];
                        if(vo.t==innert&&vo.n==innern&&idArray.indexOf(vo.c)<0&&totalIds.indexOf(vo.c)<0){//选进去了必须剔除掉
                            voArray.push(this.getPHZDef(vo.c));
                            idArray.push(vo.c);
                            break mjLoop;
                        }
                    }
                }
                if(voArray.length==3){
                    if(isUniq)
                        ArrayUtil.merge(idArray,totalIds);
                    result.push(voArray);
                }
            }
        }
        return result;
    },

    /**
     *
     * //手牌有三张相同的不能拆开去吃牌
     //手牌有要吃的那张牌，如果无法将手牌中的目标牌凑成一束牌，则无法吃那张牌

     //吃牌时手牌中所有能凑成一束牌的牌型都需要给玩家展示任玩家选择
     //吃的这张牌如果手上正好有，那么手上的这张牌也必须摆出去
     * @param PHZOnHands {Array.<PHZVo>}
     * @param lastPHZ {PHZVo}
     */
    getChi:function(PHZOnHands,lastPHZ){
        var t = lastPHZ.t;
        var n = lastPHZ.n;
        var l = PHZOnHands.length;
        var result = this.getChiNoFilter(PHZOnHands,lastPHZ);
        cc.log("result =",JSON.stringify(result));
        //手上是否有和吃的牌一样花色的牌
        var sameWithLastPHZArray = [];
        var countMap = {};
        var moreThreeArray = [];
        //var isSingleChi = false;
        for(var m=0;m<l;m++) {
            var vo = PHZOnHands[m];
            if(!vo.isChi){
                if (vo.t == t && vo.n == n)
                    sameWithLastPHZArray.push(vo);
                var prefix = vo.t+"_"+vo.n;
                if(!countMap[prefix]){
                    countMap[prefix] = [vo];
                }else{
                    countMap[prefix].push(vo);
                }
                if(countMap[prefix].length >=3)
                    moreThreeArray.push(prefix);
            }
        }
        var isInThreeArray = function(vo){
            var prefix = vo.t+"_"+vo.n;
            return (ArrayUtil.indexOf(moreThreeArray,prefix)>=0);
        }
        var self = this;
        var isHasOtherEnable = function(sortedVoArray){
            var exceptArray = [];
            for(var i=0;i<sortedVoArray.length;i++){
                exceptArray.push(sortedVoArray[i].c);
            }
            var copyOnHands = [];
            for(var m=0;m<l;m++) {
                var vo = PHZOnHands[m];
                if(ArrayUtil.indexOf(exceptArray,vo.c)<0)//把现在这句话排除掉
                    copyOnHands.push(vo);
            }
            return self.getChiNoFilter(copyOnHands,lastPHZ);
        }
        var finalResult = [];
        for(var i=0;i<result.length;i++){
            var innerArray = result[i];
            var isHasThree = false;
            var sameCount = 0;
            for(var j=0;j<innerArray.length;j++){
                var innervo = innerArray[j];
                // if(isInThreeArray(innervo))
                //     isHasThree = false;
                // if(innervo.t==t&&innervo.n==n&&innervo.c!=lastPHZ.c)
                if(innervo.t==t&&innervo.n==n)
                    sameCount++;
            }
            // cc.log("sameCount==="+sameCount);
            // cc.log("sameWithLastPHZArray.length------"+sameWithLastPHZArray.length);
            //cc.log("sameWithLastPHZArray==="+JSON.stringify(sameWithLastPHZArray));
            //从小到大排序
            if(!isHasThree){//已有的三个一样的牌不能被拆散
                if(sameWithLastPHZArray.length>0){//其中有一个是当前吃的牌的花色
                    if(sameCount>=sameWithLastPHZArray.length){
                        finalResult.push(innerArray);
                    }else{
                        //二次筛选结果
                        var tempSecondVoArray = ArrayUtil.clone(innerArray);
                        secondWhileLoop:while(true){
                            var secondResult = isHasOtherEnable(tempSecondVoArray);
                            for(var wi=0;wi<secondResult.length;wi++){
                                ArrayUtil.merge(secondResult[wi],tempSecondVoArray);
                            }
                            if(secondResult.length<=0)
                                break secondWhileLoop;
                        }
                        // cc.log("innerArray::"+JSON.stringify(innerArray));
                        //如果手上有当前要吃的牌，那么手上相同的牌需要全部都可以吃出去
                        var needSameCount = sameWithLastPHZArray.length;
                        //二次筛选结果中与当前吃的牌相同的个数
                        var secondSameCount = 0;
                        //把innerArray本身排除
                        tempSecondVoArray = tempSecondVoArray.splice(3,tempSecondVoArray.length);
                        // cc.log("tempSecondVoArray::"+JSON.stringify(tempSecondVoArray));
                        //遍历二次筛选结果
                        while(tempSecondVoArray.length>0){
                            var secondResArray = tempSecondVoArray.splice(0,3);
                            var ishasThree=false;
                            secondResArrayLoop:for(var sea=0;sea<secondResArray.length;sea++){
                                var vo = secondResArray[sea];
                                if(isInThreeArray(vo)){//在三个中的需要踢掉
                                    ishasThree=true;
                                    break secondResArrayLoop;
                                }
                            }
                            if(!ishasThree){
                                for(var sea=0;sea<secondResArray.length;sea++){
                                    var vo = secondResArray[sea];
                                    if(vo.t==lastPHZ.t&&vo.n==lastPHZ.n&&vo.c!=lastPHZ.c)
                                        secondSameCount++;
                                }
                            }
                        }
                        //isSingleChi = (secondSameCount == 0);
                        // cc.log("needSameCount::"+needSameCount+" sameCount::"+sameCount+" secondSameCount::"+secondSameCount);
                        // if((sameCount+secondSameCount)>=needSameCount){//最终有二次筛选的结果，那么当前的结果是符合要求的
                            finalResult.push(innerArray);
                        // }
                    }
                }else{
                    //isSingleChi = true;
                    finalResult.push(innerArray);
                }
            }
        }
        //isSingleChi = sameWithLastPHZArray.length == 0 ? true : isSingleChi;
        return {selectTimes:0,data:finalResult};
    },
    
    //牌面最底层的字牌排序
    sortArray:function(result){
		var sortForBig = function(r1,r2){
			var r5 = r1[r1.length-1].t;
			var r6 = r2[r2.length-1].t;
            if (r5>r6){
                return true;
            }
            return false;
			// if(r3>r4){
			// 	return true;
			// }else{
			// 	if(r3==r4 && r5>r6) return true;
			// 	else return false;
			// }
		}
        var sorForNum = function(r1,r2){
            var r3 = r1[r1.length-1].n;
            var r4 = r2[r2.length-1].n;
            var r5 = r1[r1.length-1].t;
            var r6 = r2[r2.length-1].t;
            if(r5 == r6 && r3>r4){
                return true;
            }else{
                return false;
            }          
        }
        result.sort(sortForBig);
        result.sort(sorForNum);
    }
}