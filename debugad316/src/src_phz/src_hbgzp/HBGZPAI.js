/**
 * Created by Administrator on 2019/11/12.
 */
/**
 * 跑胡子的数据映射
 * @type {{t: number, n: number, i: number, c: number, m:number, g:number, a:number, as:number,se:number,isChi:number,zhe:number,same:number}}
 */
var HBGZPVo = {
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
    same:0, //相同个数是否大于等于3个
    hua:0 //是否是花
};

var HBGZPAction = {
    HU:0,//胡
    PENG:1,//碰
    ZHAO:2,//招
    ZHA:3,//扎
    JIAN:4,//捡 = 吃
    ZIMO:5,//自摸
    HUA:6//滑
};

var HBGZPDisAction = {
    CHUPAI:0,//出牌
    HU:1,//胡牌
    PENG:2,//碰
    ZHAO:3,//招
    ZHA:4,//扎
    PASS:5,//过
    JIAN:6,//吃 = 捡
    HUA:7,//滑
    MOPAI:9,//摸牌
    HAIDIMO:10,//海底摸
    GANGMO:11,//杠摸
    HASACTION:12,//有操作
    DICE:13,//骰子
    HU_ZIMO:1 //自摸胡
};

var HBGZPList = [
    [20,21,22],//上大人 ***  94,95,96
    [17,18,19],//可知礼 ***  91,92,93
    [11,3,12],//化三千  ***  61,62,63
    [13,1,14],//孔乙己  **** 51,52,53
    [7,10,15],//七十土  *** 7172,73
    [8,9,16],//八九子   *** 81,82,83
    [1,2,3],[2,3,4],[3,4,5],[4,5,6],[5,6,7],[6,7,8],[7,8,9],[8,9,10]
];

var HBGZPAI = {
    PHZ: [
        {sIndex:0,t: 0, n: 0, i: 0, c: 0, v: 0,hua: 0 },
        {sIndex:52, t: 1, n: 1, i: 1, c: 1, v: 1,hua: 1 },//乙
        {sIndex:54,t: 1, n: 2, i: 2, c: 2, v: 2,hua: 0 },
        {sIndex:62, t: 1, n: 3, i: 3, c: 3, v: 3,hua: 1 },
        {sIndex:64, t: 1, n: 4, i: 4, c: 4, v: 4,hua: 0 },
        {sIndex:65, t: 1, n: 5, i: 5, c: 5, v: 5,hua: 1 },
        {sIndex:66, t: 1, n: 6, i: 6, c: 6, v: 6,hua: 0 },
        {sIndex:71, t: 1, n: 7, i: 7, c: 7, v: 7,hua: 1 },
        {sIndex:81, t: 1, n: 8, i: 8, c: 8, v: 8,hua: 0 },
        {sIndex:82, t: 1, n: 9, i: 9, c: 9, v: 9,hua: 1 },
        {sIndex:72, t: 1, n: 10, i: 10, c: 10, v: 10,hua: 0 },
        {sIndex:52, t: 1, n: 1, i: 1, c: 11, v: 1,hua: 1 },
        {sIndex:54, t: 1, n: 2, i: 2, c: 12, v: 2,hua: 0 },
        {sIndex:62, t: 1, n: 3, i: 3, c: 13, v: 3,hua: 1 },
        {sIndex:64, t: 1, n: 4, i: 4, c: 14, v: 4,hua: 0 },
        {sIndex:65, t: 1, n: 5, i: 5, c: 15, v: 5,hua: 1 },
        {sIndex:66, t: 1, n: 6, i: 6, c: 16, v: 6,hua: 0 },
        {sIndex:71, t: 1, n: 7, i: 7, c: 17, v: 7,hua: 1 },
        {sIndex:81, t: 1, n: 8, i: 8, c: 18, v: 8,hua: 0 },
        {sIndex:82, t: 1, n: 9, i: 9, c: 19, v: 9,hua: 1 },
        {sIndex:72, t: 1, n: 10, i: 10, c: 20, v: 10,hua: 0 },
        {sIndex:52, t: 1, n: 1, i: 1, c: 21, v: 1,hua: 0 },
        {sIndex:54, t: 1, n: 2, i: 2, c: 22, v: 2,hua: 0 },
        {sIndex:62, t: 1, n: 3, i: 3, c: 23, v: 3,hua: 0 },
        {sIndex:64, t: 1, n: 4, i: 4, c: 24, v: 4,hua: 0 },
        {sIndex:65, t: 1, n: 5, i: 5, c: 25, v: 5,hua: 0 },
        {sIndex:66, t: 1, n: 6, i: 6, c: 26, v: 6,hua: 0 },
        {sIndex:71, t: 1, n: 7, i: 7, c: 27, v: 7,hua: 0 },
        {sIndex:81, t: 1, n: 8, i: 8, c: 28, v: 8,hua: 0 },
        {sIndex:82, t: 1, n: 9, i: 9, c: 29, v: 9,hua: 0 },
        {sIndex:72, t: 1, n: 10, i: 10, c: 30, v: 10,hua: 0 },
        {sIndex:52, t: 1, n: 1, i: 1, c: 31, v: 1,hua: 0 },
        {sIndex:54, t: 1, n: 2, i: 2, c: 32, v: 2,hua: 0 },
        {sIndex:62, t: 1, n: 3, i: 3, c: 33, v: 3,hua: 0 },
        {sIndex:64, t: 1, n: 4, i: 4, c: 34, v: 4,hua: 0 },
        {sIndex:65, t: 1, n: 5, i: 5, c: 35, v: 5,hua: 0 },
        {sIndex:66, t: 1, n: 6, i: 6, c: 36, v: 6,hua: 0 },
        {sIndex:71, t: 1, n: 7, i: 7, c: 37, v: 7,hua: 0 },
        {sIndex:81, t: 1, n: 8, i: 8, c: 38, v: 8,hua: 0 },
        {sIndex:82, t: 1, n: 9, i: 9, c: 39, v: 9,hua: 0 },
        {sIndex:72, t: 1, n: 10, i: 10, c: 40, v: 10,hua: 0 },
        {sIndex:52, t: 1, n: 1, i: 1, c: 41, v: 1,hua: 0 },
        {sIndex:54, t: 1, n: 2, i: 2, c: 42, v: 2,hua: 0 },
        {sIndex:62, t: 1, n: 3, i: 3, c: 43, v: 3,hua: 0 },
        {sIndex:64, t: 1, n: 4, i: 4, c: 44, v: 4,hua: 0 },
        {sIndex:65, t: 1, n: 5, i: 5, c: 45, v: 5,hua: 0 },
        {sIndex:66, t: 1, n: 6, i: 6, c: 46, v: 6,hua: 0 },
        {sIndex:71, t: 1, n: 7, i: 7, c: 47, v: 7,hua: 0 },
        {sIndex:81, t: 1, n: 8, i: 8, c: 48, v: 8,hua: 0 },
        {sIndex:82, t: 1, n: 9, i: 9, c: 49, v: 9,hua: 0 },
        {sIndex:72, t: 1, n: 10, i: 10, c: 50, v: 10,hua: 0 },

        {sIndex:61, t: 1, n: 11, i: 11, c: 51, v: 101,hua: 0},//化
        {sIndex:63, t: 1, n: 12, i: 12, c: 52, v: 102,hua: 0},//千
        {sIndex:51, t: 1, n: 13, i: 13, c: 53, v: 103,hua: 0},//孔
        {sIndex:53, t: 1, n: 14, i: 14, c: 54, v: 104,hua: 0},//己
        {sIndex:73, t: 1, n: 15, i: 15, c: 55, v: 105,hua: 0},//土
        {sIndex:83, t: 1, n: 16, i: 16, c: 56, v: 106,hua: 0},//子

        {sIndex:61, t: 1, n: 11, i: 11, c: 57, v: 101,hua: 0},//化
        {sIndex:63, t: 1, n: 12, i: 12, c: 58, v: 102,hua: 0},//千
        {sIndex:51, t: 1, n: 13, i: 13, c: 59, v: 103,hua: 0},//孔
        {sIndex:53, t: 1, n: 14, i: 14, c: 60, v: 104,hua: 0},//己
        {sIndex:73, t: 1, n: 15, i: 15, c: 61, v: 105,hua: 0},//土
        {sIndex:83, t: 1, n: 16, i: 16, c: 62, v: 106,hua: 0},//子

        {sIndex:61, t: 1, n: 11, i: 11, c: 63, v: 101,hua: 0},//化
        {sIndex:63, t: 1, n: 12, i: 12, c: 64, v: 102,hua: 0},//千
        {sIndex:51, t: 1, n: 13, i: 13, c: 65, v: 103,hua: 0},//孔
        {sIndex:53, t: 1, n: 14, i: 14, c: 66, v: 104,hua: 0},//己
        {sIndex:73, t: 1, n: 15, i: 15, c: 67, v: 105,hua: 0},//土
        {sIndex:83, t: 1, n: 16, i: 16, c: 68, v: 106,hua: 0},//子

        {sIndex:61, t: 1, n: 11, i: 11, c: 69, v: 101,hua: 0},//化
        {sIndex:63, t: 1, n: 12, i: 12, c: 70, v: 102,hua: 0},//千
        {sIndex:51, t: 1, n: 13, i: 13, c: 71, v: 103,hua: 0},//孔
        {sIndex:53, t: 1, n: 14, i: 14, c: 72, v: 104,hua: 0},//己
        {sIndex:73, t: 1, n: 15, i: 15, c: 73, v: 105,hua: 0},//土
        {sIndex:83, t: 1, n: 16, i: 16, c: 74, v: 106,hua: 0},//子

        {sIndex:61, t: 1, n: 11, i: 11, c: 75, v: 101,hua: 0},//化
        {sIndex:63, t: 1, n: 12, i: 12, c: 76, v: 102,hua: 0},//千
        {sIndex:51, t: 1, n: 13, i: 13, c: 77, v: 103,hua: 0},//孔
        {sIndex:53, t: 1, n: 14, i: 14, c: 78, v: 104,hua: 0},//己
        {sIndex:73, t: 1, n: 15, i: 15, c: 79, v: 105,hua: 0},//土
        {sIndex:83, t: 1, n: 16, i: 16, c: 80, v: 106,hua: 0},//子

        {sIndex:91, t: 1, n: 17, i: 21, c: 81, v: 201,hua: 0},//可
        {sIndex:92, t: 1, n: 18, i: 22, c: 82, v: 202,hua: 0},//知
        {sIndex:93, t: 1, n: 19, i: 23, c: 83, v: 203,hua: 0},//礼
        {sIndex:94, t: 1, n: 20, i: 26, c: 84, v: 204,hua: 0},//上
        {sIndex:95, t: 1, n: 21, i: 27, c: 85, v: 205,hua: 0},//大
        {sIndex:96, t: 1, n: 22, i: 28, c: 86, v: 206,hua: 0},//人

        {sIndex:91, t: 1, n: 17, i: 21, c: 87, v: 201,hua: 0},//可
        {sIndex:92, t: 1, n: 18, i: 22, c: 88, v: 202,hua: 0},//知
        {sIndex:93, t: 1, n: 19, i: 23, c: 89, v: 203,hua: 0},//礼
        {sIndex:94, t: 1, n: 20, i: 26, c: 90, v: 204,hua: 0},//上
        {sIndex:95, t: 1, n: 21, i: 27, c: 91, v: 205,hua: 0},//大
        {sIndex:96, t: 1, n: 22, i: 28, c: 92, v: 206,hua: 0},//人

        {sIndex:91, t: 1, n: 17, i: 21, c: 93, v: 201,hua: 0},//可
        {sIndex:92, t: 1, n: 18, i: 22, c: 94, v: 202,hua: 0},//知
        {sIndex:93, t: 1, n: 19, i: 23, c: 95, v: 203,hua: 0},//礼
        {sIndex:94, t: 1, n: 20, i: 26, c: 96, v: 204,hua: 0},//上
        {sIndex:95, t: 1, n: 21, i: 27, c: 97, v: 205,hua: 0},//大
        {sIndex:96, t: 1, n: 22, i: 28, c: 98, v: 206,hua: 0},//人

        {sIndex:91, t: 1, n: 17, i: 21, c: 99, v: 201,hua: 0},//可
        {sIndex:92, t: 1, n: 18, i: 22, c: 100, v: 202,hua: 0},//知
        {sIndex:93, t: 1, n: 19, i: 23, c: 101, v: 203,hua: 0},//礼
        {sIndex:94, t: 1, n: 20, i: 26, c: 102, v: 204,hua: 0},//上
        {sIndex:95, t: 1, n: 21, i: 27, c: 103, v: 205,hua: 0},//大
        {sIndex:96, t: 1, n: 22, i: 28, c: 104, v: 206,hua: 0},//人

        {sIndex:91, t: 1, n: 17, i: 21, c: 105, v: 201,hua: 0},//可
        {sIndex:92, t: 1, n: 18, i: 22, c: 106, v: 202,hua: 0},//知
        {sIndex:93, t: 1, n: 19, i: 23, c: 107, v: 203,hua: 0},//礼
        {sIndex:94, t: 1, n: 20, i: 26, c: 108, v: 204,hua: 0},//上
        {sIndex:95, t: 1, n: 21, i: 27, c: 109, v: 205,hua: 0},//大
        {sIndex:96, t: 1, n: 22, i: 28, c: 110, v: 206,hua: 0}//人
    ],

    /**
     * @param direct
     * @param place
     * @returns {HBGZPDisplayVo}
     */
    getDisplayVo:function(direct,place){
        return {direct:direct,place:place};
    },

    getVoArray:function(ids){//手牌值转成对象
        var voArray = [];
        for(var i=0;i<ids.length;i++){
            voArray.push(this.getPHZDef(ids[i]));
        }
        return voArray;
    },

    sortPHZ:function(vo1,vo2){
        if(vo2.t==vo1.t){
            return vo1.n-vo2.n;
        }
        return vo1.t-vo2.t;
    },

    sortPHZMaxToMin:function(vo1,vo2){
        if(vo2.t==vo1.t){
            return vo2.n-vo1.n;
        }
        return vo2.t-vo1.t;
    },

    sortPHZBySIndex:function(vo1,vo2){
        return vo1.sIndex - vo2.sIndex;
    },

    getPHZByVal:function(val){
        var res = null;
        for(var i=0;i<this.PHZ.length;i++){
            var card = this.PHZ[i];
            if(card.v == val){
                res = card;
                break;
            }
        }
        if(res==null){
            cc.log("getPHZDef not found::"+val);
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
     * 返回 {n : number}对象
     * @param voArray
     */
    countVoByNumber:function(voArray){//
        var result = {};
        voArray = voArray || [];
        for(var i = 0;i < voArray.length;++i){
            if(result[voArray[i].n] == undefined){
                result[voArray[i].n] = 0;
            }
            ++result[voArray[i].n];
        }
        return result;
    },

    /**
     * 根据张数获得 {n:number}中的对象
     * @param result
     * @param num
     * @returns {Array}
     */
    getAllNumber:function(result,num,JianArr){
        var resultArr = [];
        result = result || {};
        for(var val in result){
            if(result[val] == num && !this.isJianCard(val,JianArr)){
                resultArr.push(parseInt(val));
            }
        }
        return resultArr;
    },

    /***
     *  是不是捡牌
     * @param n
     * @param JianArr
     * @returns {boolean}
     */
    isJianCard:function(n,JianArr){
        JianArr = JianArr || [];
        for(var i = 0;i < JianArr.length;++i){
            if(HBGZPAI.getPHZDef(JianArr[i]).n == n){
                return true;
            }
        }
        return false;
    },

    /**
     * 根据n值获得牌
     * @param voCardArr
     * @param nArr
     * @returns {Array}
     */
    getCardByN:function(voCardArr,nArr){
        voCardArr = voCardArr || [];
        nArr = nArr || [];
        var idsArr = [];
        for(var i = 0;i < nArr.length;++i){
            var tempArr = [];
            for(var j = 0;j < voCardArr.length;++j){
                if(voCardArr[j].n == nArr[i]){
                    tempArr.push(voCardArr[j]);
                }
            }
            if(tempArr.length > 0){
                if(tempArr.length === 1){//单张特殊处理
                    idsArr.push(tempArr[0]);
                }else{
                    idsArr.push(tempArr);
                }
            }
        }
        return idsArr;
    },

    getAllCard:function(voArray){
        //var voArray = this.getVoArray(ids);
        var result = this.countVoByNumber(voArray);
        var resultArr = [];
        for(var i = 5;i > 0;--i){
            var temp = this.getAllNumber(result,i);
            if(temp.length > 0){
                resultArr.push(temp);
            }
        }
        var idsArr = [];
        for(var i = 0;i < resultArr.length;++i){
            var tempIds = this.getCardByN(voArray,resultArr[i]);
            idsArr.push(tempIds);
        }
        return idsArr;
    },

    /**
     * 把手牌转化成列
     * @param voArray
     * @returns {Array}
     */
    sortHandsVo:function(voArray){
        return this.getAllCard(voArray);
    },

    voArrayChangeHx:function(ids){
        var data = [];
        for(var i = 0;i < Math.ceil(ids.length / 3);++i){
            data.push(ids.slice(i*3,(i+1)*3));
        }
        return data;
    },

    /**
     * 检查是不是顺子
     * @param ids
     * @param num
     * @returns {boolean}
     */
    checkStraight:function(ids,num){
        for(var i = 0;i < HBGZPList.length;++i){
            var count = 0;
            for(var j = 0;j < ids.length;++j){
                var index = HBGZPList[i].indexOf(ids[j]);
                if(index === -1){
                    break;
                }
                ++count;
            }
            if(count === ids.length || count === num){
                return true;
            }
        }
        return false;
    },

    /**
     * 是不是红牌
     * @param voCard
     * @returns {boolean}
     */
    isRedCard:function(voCard){
        var cardArr = [3,5,7,17,18,19,20,21,22];
        return cardArr.indexOf(voCard.n) !== -1;
    },

    /**
     * 找顺子
     * @param voArray
     * @param isTwo
     * @returns {*}
     */
    findStraight:function(voArray,isTwo){
        for(var i = 0;i < voArray.length;++i){
            for(var j = i + 1;j < voArray.length;++j){
                var tempArr = [voArray[i].n,voArray[j].n];
                if(isTwo && this.checkStraight(tempArr,2)){
                    return [voArray[i],voArray[j]];
                }
                for(var k = j + 1;k < voArray.length;++k){
                    var tempArr = [voArray[i].n,voArray[j].n,voArray[k].n];
                    if(!isTwo && this.checkStraight(tempArr,3)){
                        return [voArray[i],voArray[j],voArray[k]];
                    }
                }
            }
        }
        if(isTwo){
            if(voArray.length < 5){
                return voArray.slice(0);
            }else{
                return [voArray[0],voArray[1],voArray[2],voArray[3]];
            }
        }
        return [];
    },

    /**
     * 找所有的顺子
     * @param voArray
     * @param isTwo 是不是张相连的两张
     * @returns {Array}
     */
    findAllStraight:function(voArray,isTwo){
        var temp = [];
        var result = [];
        while (temp.length != voArray.length){
            temp = this.findStraight(voArray,isTwo);
            if(temp.length == 0){
                break;
            }else{
                result.push(temp);
            }
            for(var j = 0;j < temp.length;++j){
                var index = voArray.indexOf(temp[j]);
                if(index != -1){
                    voArray.splice(index,1);
                }
            }
            temp = [];
        }
        return result;
    },

    /**
     * 三维数组转化成二维
     * @param arr
     * @returns {Array}
     */
    addArray:function(arr){
        var result = [];
        for(var i = 0;i < arr.length;++i){
            for(var j = 0;j < arr[i].length;++j){
                if(Array.isArray(arr[i][j])){
                    result.push(arr[i][j].slice(0));
                }else{
                    result.push(arr[i].slice(0));
                    break;
                }
            }
        }
        return result;
    },

    /**
     * 是否包含上大人或者可知礼
     * @param voArray  被包含数组
     * @param allVoArray  检测数组
     * @returns {boolean}
     */
    isContains:function(voArray,allVoArray){
        var count = [0,0,0];
        for(var i = 0;i < voArray.length;++i){
            for(var j = 0;j < allVoArray.length;++j){
                if(allVoArray[j].n == voArray[i]){
                    ++count[i];
                    break;
                }
            }
        }
        return count[0] === count[1] && count[2] === count[1] && count[0] === 1;
    },

    /**
     * 统计每列牌单个牌的胡息
     * @param voArray
     * @returns {number}
     */
    countHuxi:function(voArray,isNoCount){
        var zi = 0;
        for(var i = 0;i < voArray.length;++i){
            if(voArray[i].n === 1 || voArray[i].n === 9){
                if(voArray[i].hua === 1){
                    zi += 1;
                }
            }else if(voArray[i].n === 3 || voArray[i].n === 7){
                if(voArray[i].hua === 1){
                    zi += 2;
                }else{
                    zi += 1;
                }
            }else if(voArray[i].n === 5){
                if(voArray[i].hua === 1){
                    zi += 4;
                }else{
                    zi += 2;
                }
            }
        }
        if(!isNoCount){//是否统计上大人，可知礼
            if(this.isContains([17,18,19],voArray)){
                zi += 1;
            }
            if(this.isContains([20,21,22],voArray)){
                zi += 1;
            }
        }
        return zi;
    },

    /**
     * 统计不同列特殊组合的胡息
     * @param voArray
     * @param jianArr
     * @returns {number}
     */
    countSpecialHuxi:function(voArray,jianArr){
        var result = this.countVoByNumber(voArray);
        var sdrArr = [0,0,0];
        var kzlArr = [0,0,0];
        for(var i = 0;i < voArray.length;++i){
            //if(jianArr.indexOf(voArray[i].c) !== -1){//如果是捡牌
            //    continue;
            //}
            if((voArray[i].n == 17 || voArray[i].n == 18 ||voArray[i].n == 19) && result[voArray[i].n] < 3){
                ++kzlArr[voArray[i].n%17];
            }
            if((voArray[i].n == 20 || voArray[i].n == 21 ||voArray[i].n == 22) && result[voArray[i].n] < 3){
                ++sdrArr[voArray[i].n%20];
            }
        }
        var zi = 0;
        if(sdrArr.length === 3){
            if(this.isArrayEqual([2,2,2],sdrArr)){
                zi += 2;
            }else if(this.isArrayEqual([2,2,1],sdrArr) || this.isArrayEqual([2,1,1],sdrArr) || this.isArrayEqual([1,1,1],sdrArr)){
                zi += 1;
            }
        }
        if(kzlArr.length === 3){
            if(this.isArrayEqual([2,2,2],kzlArr)){
                zi += 2;
            }else if(this.isArrayEqual([2,2,1],kzlArr) || this.isArrayEqual([2,1,1],kzlArr) || this.isArrayEqual([1,1,1],kzlArr)){
                zi += 1;
            }
        }
        return zi;
    },

    /**
     * 数组相等
     * @param voArray  数组A
     * @param allVoArray  数组B
     * @returns {boolean}
     */
    isArrayEqual:function(voArray,allVoArray){
        voArray.sort(function (a,b) {
            return a - b;
        });
        allVoArray.sort(function (a,b) {
            return a - b;
        });
        return JSON.stringify(voArray) === JSON.stringify(allVoArray);
    },

    /**
     * 统计每列牌的总胡息
     * @param selectType
     * @returns {number}
     */
    countAllHuxi:function(selectType){//计算手上的子数
        var mergeArr = this.addArray(selectType);
        var zi = 0;
        for(var i = 0;i < mergeArr.length;++i){//计算多个
            if(i < mergeArr.length - 1){
                this.sameCardHuxi(mergeArr[i]);
            }
            zi += this.countHuxi(mergeArr[i]);//只计算单个组合上大人、可知礼
        }
        return zi;
    },

    sameCardHuxi:function(mergeArr){
        var zi = 0;
        var voArray = mergeArr[0];
        if(mergeArr.length === 5){
            if(this.isRedCard(voArray)){
                zi += 5;
            }else{
                zi += 3;
            }
        }else if(mergeArr.length === 4){
            if(this.isRedCard(voArray)){
                zi += 4;
            }else{
                zi += 2;
            }
        }else if(mergeArr.length === 3){
            if(this.isRedCard(voArray)){
                zi += 2;
            }else{
                zi += 1;
            }
        }
        return zi;
    },

    /**
     * 获得手牌总胡息
     * @param voArray
     * @returns {*|number}
     */
    getAllHuxi:function (voArray,jianArr) {
        var result = this.countVoByNumber(voArray);
        var zi = this.countHuxi(voArray,true);
        //cc.log(" ******************** ");
        //cc.log(" 第一次计算 zi = ",zi);
        for(var i = 3;i < 6;++i){
            var temp = this.getAllNumber(result, i);
            for(var j = 0;j < temp.length;++j){
                if(HBGZPAI.isJianCard(temp[j],jianArr)){
                    continue;
                }
                var cards = this.getCardByNumber(temp[j],voArray);
                zi += this.sameCardHuxi(cards);
            }
        }
        //cc.log(" ****** 第二次计算 zi = ",zi);
        zi += this.countSpecialHuxi(voArray,jianArr);
        //cc.log(" ******  最后一次 计算 zi = ",zi);
        return zi;
    },

    merageArrayMore:function(mergeArr,twoArray,idArray){
        idArray = idArray || [];
        twoArray = twoArray || [];
        var localArray = mergeArr.slice(0);
        //for(var i = 0;i < twoArray.length;++i){
        //    var nVal = twoArray[i][0].n;
        //    var tempArray = specialList[nVal];
        //    if(!tempArray){
        //        continue;
        //    }
        //    for(var j = i + 1;j < twoArray.length;++j){
        //        if(tempArray.indexOf(twoArray[j][0].n) !== -1){
        //            ArrayUtil.merge(twoArray[j],localArray[i]);
        //            localArray.splice(idArray[j],1);
        //            localArray[i].sort(this.sortPHZBySIndex);//特殊牌型排序
        //        }
        //    }
        //}
        for(var i = 0;i < twoArray.length;++i){
            var nVal = twoArray[i][0].n;
            var tempArray = specialList[nVal];
            if(!tempArray){
                continue;
            }
            for(var j = twoArray.length - 1;j > 0;--j){
                if(tempArray.indexOf(twoArray[j][0].n) !== -1){
                    ArrayUtil.merge(twoArray[j],localArray[idArray[i]]);
                    localArray.splice(idArray[j],1);
                    localArray[i].sort(this.sortPHZBySIndex);//特殊牌型排序
                    break;
                }
            }
        }
        mergeArr = localArray.slice(0);
    },

    merageArray:function(twoArray,oneArray){
        oneArray = oneArray || [];
        twoArray = twoArray || [];
        for(var i = 0;i < twoArray.length;++i){
            if(!twoArray[i][0]){
                continue;
            }
            var nVal = twoArray[i][0].n;
            var tempArray = specialList[nVal];
            if(!tempArray){
                continue;
            }
            for(var j = 0;j < oneArray.length;){
                if(tempArray.indexOf(oneArray[j].n) !== -1){
                    twoArray[i].push(oneArray[j]);
                    oneArray.splice(j,1);
                }else{
                    ++j;
                }
            }
            //twoArray.sort(this.sortPHZ);//从大到小排序
            twoArray[i].sort(this.sortPHZBySIndex);//特殊牌型排序
            if(oneArray.length == 0){
                return;
            }
        }
    },

    sortHandsByHxVo:function(voArray){
        var selectType = this.getAllCard(voArray);//分类成三位数组[[[A][A]],[B]]
        var mergeArr = HBGZPAI.addArray(selectType);//合并成二维[[A],[B]]
        var isSanpai = !Array.isArray(selectType[selectType.length - 1][0]);//有散牌
        /***
         *  新增相连的多个放到一起
         */
        var twoArray = [];
        var idArray = [];
        for(var i = 0;i < mergeArr.length;++i){
            if(mergeArr[i].length === 2 && (isSanpai && i != mergeArr.length - 1)){
                twoArray.push(mergeArr[i]);
                idArray.push(i);
            }
        }
        //if(twoArray.length > 2){
        //    this.merageArrayMore(mergeArr,twoArray,idArray);
        //}
        if(isSanpai){//是否有散牌
            var lastIndex = mergeArr.length - 1;
            var lastCard = mergeArr[lastIndex];
            this.merageArray(twoArray,lastCard);
            lastCard.sort(this.sortPHZBySIndex);//特殊牌型排序
            var straightArr = HBGZPAI.findAllStraight(lastCard);
            if(straightArr && straightArr.length > 0){//是否有顺子
                for(var i = 0;i < straightArr.length;++i){
                    if(straightArr[i] && straightArr[i].length > 0){
                        mergeArr.push(straightArr[i]);
                    }
                    for(var j = 0;j < straightArr[i].length;++j){//删除找到的顺子
                        var index = lastCard.indexOf(straightArr[i][j]);
                        if(index != -1){
                            lastCard.splice(index,1);
                        }
                    }
                }
            }
            straightArr = this.findAllStraight(lastCard,true);//相连的牌和散牌
            mergeArr.splice(lastIndex,1);//删除最后一组
            for(var i = 0;i < straightArr.length;++i){//合并成多组
                if(straightArr[i] && straightArr[i].length > 0){
                    straightArr[i].sort(this.sortPHZBySIndex);
                    mergeArr.push(straightArr[i]);
                }
            }
        }
        return mergeArr;
    },

    isHasWater:function(shuipai,num){
        var result = {};
        if(shuipai){
            for(var i=0;i<shuipai.length;i++) {
                var innerArray = shuipai[i].cards;
                if(num !== 4 && num !== 5 && (shuipai[i].action == 2 && shuipai[i].action == 3)){//找碰了的、找招了的
                    continue;
                }
                for (var j = 0; j < innerArray.length; j++) {
                    if(!result[innerArray[j].n]){
                        result[innerArray[j].n] = [];
                    }
                    result[innerArray[j].n].push(innerArray[j].c);
                }
            }
        }
        return result;
    },

    getSameCardByNumber:function(handCards,jianArray,id,num,shuipai){
        num = num || 5;//默认是全部
        var vo = this.getPHZDef(id);
        id = id || 0;
        var isSelf = this.isSelfMoPai(handCards,HBGZPRoomModel.localZhaCount);
        var ids = [];//返回的
        var otherIds = [];
        var temp = [];
        var result = {};
        for (var i = 0; i < handCards.length; ++i) {
            var data = handCards[i].getData();
            if (data) {
                if(jianArray.indexOf(data.c) === -1){/** 捡牌判断 */
                    if(!isSelf){//别人出牌
                        if(vo && vo.n == data.n && temp.length < num){
                            temp.push(data.c);
                        }
                    }
                    //else{//自己摸牌
                        if(!result[data.n]){
                            result[data.n] = {n:0,cards:[]};
                            otherIds.push(result[data.n]);
                        }
                        ++result[data.n].n;
                        result[data.n].cards.push(data.c);
                    //}
                }
            }
        }
        var shuipaiResult = this.isHasWater(shuipai,num);
        if(isSelf){
            for(var i = 0; i < otherIds.length; ++i){
                if((num === 5 && otherIds[i].n === 5)){//自己滑
                   ids.push(otherIds[i].cards.slice(0,5));
                } else if(num === 4 && otherIds[i].n === 4){//自己观
                   ids.push(otherIds[i].cards.slice(0,4));
                }
                if((num === 5 || num === 4) && otherIds[i].n === 1){
                    var tempVo = this.getPHZDef(otherIds[i].cards[0]);
                    if(shuipaiResult[tempVo.n] && shuipaiResult[tempVo.n].length === num - 1){
                        ids.push(otherIds[i].cards);
                    }
                }
            }
        }else{
            if(temp.length > 0){
                ids.push(temp);
            }else{
                for(var i = 0; i < otherIds.length; ++i) {
                    if ((num === 5 && otherIds[i].n === 5)) {//自己滑
                        ids.push(otherIds[i].cards.slice(0, 5));
                    } else if (num === 4 && otherIds[i].n >= 4) {//自己观
                        ids.push(otherIds[i].cards.slice(0, 4));
                    }
                }
            }
        }
        return ids;
    },

    isSelfMoPai:function(handCards,zhaCount){
        var cardCount = 0;
        for (var i = 0; i < handCards.length; ++i) {
            var data = handCards[i];
            if (data && data.getData()) {
                ++cardCount;
            }
        }
        if(zhaCount % 3 === 1){
            return cardCount > 0 && cardCount % 3 === 0;
        }else if(zhaCount % 3 === 2){
            return cardCount > 0 && cardCount % 3 === 1;
        }else{
            return cardCount > 0 && cardCount % 3 === 2;
        }
    },

    getJianArray:function(data2){
        data2 = data2 || [];
        var jianArr = [];
        for(var i = 0;i < data2.length;++i){
            if(data2[i].action == HBGZPDisAction.JIAN){
                for(var j = 0;j < data2[i].cards.length;++j){
                    jianArr.push(data2[i].cards[j].c);
                }
            }
        }
        return jianArr;
    },

    /**
     *  手牌排序
     * @param ids
     */
    sortVal:function(ids){
        ids.sort(function (a,b) {
            if(HBGZPAI.getPHZDef(a).n === HBGZPAI.getPHZDef(b).n){
                return a - b;
            }
            return  HBGZPAI.getPHZDef(a).n - HBGZPAI.getPHZDef(b).n;
        });
    },


    /***
     * 获取所有打牌听牌
     * @param voArray
     */
   getAllHuList:function(voArray){
       voArray = voArray || [];
       voArray.sort(HBGZPAI.sortPHZ);
       var temp = {};
       var result = [];

       var special = HBGZPAI.countVoByNumber(voArray);
       if(Object.keys(special).length >= 80){
           var testArray = voArray.slice(0);
           if(HBGZPRoomModel.localZhaCount > 0){
               var valArr4 = HBGZPAI.getAllNumber(result,4,HBGZPRoomModel.JianArray);
               var valArr5 = HBGZPAI.getAllNumber(result,5,HBGZPRoomModel.JianArray);
               for(var j = 0;j < valArr5.length;++j){
                   valArr4.push(valArr5[j]);
               }
               this.deleteAllZha(null,testArray,null,valArr4,HBGZPRoomModel.localZhaCount);
           }
           var huList = this.isCanHu(testArray,true);
           if(huList.length > 5){//剩余牌超过五张
               return [];
           }
       }

       for(var i = 0;i < voArray.length;++i){
           var vo = voArray[i];
           if(!temp[vo.n]){
               temp[vo.n] = 1;
               var cards = this.getHuList(voArray,i);
               if(cards && cards.length > 0) {
                   var obj = {};
                   obj.n = vo.n;
                   obj.cards = cards;
                   result.push(obj);
               }
           }
       }
       return result;
   },

    /***
     * 获取胡牌列表
     * @param voArray  手牌
     * @param index 要删除手牌下标
     * @returns {Array}
     */
    getHuList:function(voArray,index){
        var zhaCount = HBGZPRoomModel.localZhaCount || 0;
        var temp = voArray.slice(0);
        if(HBGZPRoomModel.nextSeat === HBGZPRoomModel.mySeat && index){
            temp.splice(index, 1);//删除一张
        }
        var huList = [];
        for (var i = 0; i < 22; ++i) {
            var temp2 = temp.slice(0);
            temp2.push(localID[i]);
            temp2.sort(this.sortPHZ);
            if(zhaCount > 0) {
                var result = HBGZPAI.countVoByNumber(voArray);
                var valArr4 = HBGZPAI.getAllNumber(result,4,HBGZPRoomModel.JianArray);
                var valArr5 = HBGZPAI.getAllNumber(result,5,HBGZPRoomModel.JianArray);
                for(var j = 0;j < valArr5.length;++j){
                    valArr4.push(valArr5[j]);
                }
                this.deleteAllZha(i,temp2,huList,valArr4,zhaCount);
                //this.getAllZhaCount(i,temp2,huList,valArr4,zhaCount);
            }else{
                if(this.deleteKou(temp2)){
                    if(huList.indexOf(i + 1) === -1){
                        if(this.isHasHuxi(HBGZPRoomModel.myOutHuxi,temp2)){
                            huList.push(i + 1);
                        }
                    }
                }
            }
        }
        return huList;
    },

    /***
     * 是否胡息够
     * @param localHuxi
     * @param voArray
     * @returns {boolean}
     */
    isHasHuxi:function(localHuxi,voArray){
        var allHuxi = localHuxi + HBGZPAI.countHuxi(voArray,true);
        if(allHuxi >= HBGZPRoomModel.intParams[22]){
            return true;
        }else{
            var kanArr = this.findAllKan(voArray);
            for(var i = 0;i < kanArr.length;++i){
                if(!HBGZPAI.isJianCard(kanArr[i],HBGZPRoomModel.JianArray)){
                    if(redArr.indexOf(kanArr[i]) !== -1){
                        allHuxi += 2;
                    }else{
                        allHuxi += 1;
                    }
                }
                this.deleteCardByNumber(kanArr[i],voArray,3);
            }
            for(var j = 0;j < HBGZPList.length;){
                if(this.isHasStaright(HBGZPList[j],voArray)){
                    for(var k = 0;k < HBGZPList[j].length;++k){
                        this.deleteCardByNumber(HBGZPList[j][k],voArray,1);
                    }
                    if(j === 0 || j === 1){
                        allHuxi += 1;
                    }
                }else{
                    ++j;
                }
            }
            return allHuxi >= HBGZPRoomModel.intParams[22];
        }
    },

    /**
     * 根据n值排序
     * @param ids
     */
    sortVal:function(ids) {
        ids.sort(function (a,b) {
            if(HBGZPAI.getPHZDef(a).n === HBGZPAI.getPHZDef(b).n){
                return a - b;
            }
            return  HBGZPAI.getPHZDef(a).n - HBGZPAI.getPHZDef(b).n;
        });
    },

    /**
     * 删除口子
     * @param voArray
     * @returns {boolean}
     */
    deleteKou:function(voArray){
        var obj = {};
        for(var m = 0;m < voArray.length;++m){
            var tempArr = voArray.slice(0);
            var nVal = tempArr[m].n;
            if(obj[nVal]){
                continue;
            }
            obj[nVal] = 1;
            this.deleteCardByNumber(nVal,tempArr,1);
            var temp = newPHZ[nVal];//找关联的牌
            var isSpecial = this.isJianCard(nVal,HBGZPRoomModel.JianArray);
            for(var n = 0;n < temp.length;++n){
                if(this.isSame(temp[n],tempArr) && (!isSpecial || (isSpecial && temp[n] !== nVal))){//手牌里有关联的牌（去掉捡牌组对子）
                    var aaArr = tempArr.slice(0);
                    this.deleteCardByNumber(temp[n],aaArr,1);
                    if(this.isCanHu(aaArr).length === 0){
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /**
     * 找相同n值的牌
     * @param n
     * @param voArray
     * @returns {boolean}
     */
    isSame:function(n,voArray) {
        voArray = voArray || [];
        for(var i = 0;i < voArray.length;++i){
            if(n === voArray[i].n){
                return true;
            }
        }
        return false;
    },

    findAllKan:function(voArray){
        var result = HBGZPAI.countVoByNumber(voArray);
        var kanArr = HBGZPAI.getAllNumber(result,3,HBGZPRoomModel.JianArray);//去掉坎
        var zhaArr = HBGZPAI.getAllNumber(result,4,HBGZPRoomModel.JianArray);//去掉未扎的牌
        var huaArr = HBGZPAI.getAllNumber(result,5,HBGZPRoomModel.JianArray);//去掉未滑的牌
        for(var m = 0;m < 5;++m){
            if(zhaArr[m]){
                kanArr.push(zhaArr[m]);
            }
            if(huaArr[m]){
                kanArr.push(huaArr[m]);
            }
        }
        return kanArr;
    },

    /**
     * 是否能胡
     * @param voArray
     * @returns {boolean}
     */
    isCanHu:function(voArray,isNotClose){
        voArray.sort(HBGZPAI.sortPHZ);
        //var kanArr = this.findAllKan(voArray);
        //for(var i = 0;i < kanArr.length;++i){
        //    this.deleteCardByNumber(kanArr[i],voArray,3);
        //}
        //for(var j = 0;j < HBGZPList.length;){
        //    if(this.isHasStaright(HBGZPList[j],voArray)){
        //        for(var k = 0;k < HBGZPList[j].length;++k){
        //            this.deleteCardByNumber(HBGZPList[j][k],voArray,1);
        //        }
        //    }else{
        //        ++j;
        //    }
        //}
        var result = HBGZPAI.countVoByNumber(voArray);
        for(var valStr in result){
            var nVal = parseInt(valStr);
            if(!this.isSame(nVal,voArray)){//如果没有这张牌,跳过此次循环
                continue;
            }
            var isClear = this.deleteCardByNumber(nVal,voArray,3);
            if(!isClear){
                var nArray = this.getLocalIndex(nVal);
                var count = 0;
                for(var i = 0;i < nArray.length;++i){
                    if(this.isHasStaright(nArray[i],voArray)){
                        for(var j = 0;j < nArray[i].length;++j){
                            this.deleteCardByNumber(nArray[i][j],voArray,1);
                        }
                    }else{
                        ++count;
                    }
                }
                if(!isNotClose){
                    if(count === nArray.length){//所有组合都组不上
                        return voArray;
                    }
                }
            }
        }
        return voArray;
    },

    getLocalIndex:function(nVal){
        var temp = [];
        for(var i = 0;i < HBGZPList.length;++i){
            if(HBGZPList[i].indexOf(nVal) !== -1){
                temp.push(HBGZPList[i]);
            }
        }
        return temp;
    },


    isInclude:function(voArray) {
        var count = 0;
        for(var i = 0;i < HBGZPList.length;++i){
            count = 0;
            for(var j = 0;j < voArray.length;++j){
                if(HBGZPList[i].indexOf(voArray[j].n) === -1){
                    break;
                }else{
                    ++count;
                }
            }
            if(count === 2){
                return true;
            }
        }
        return false;
    },

    /**
     * 有没有顺子
     * @param nArray
     * @param voArray
     * @returns {boolean}
     */
    isHasStaright:function(nArray,voArray) {
        var temp = {};
        for(var i = 0;i < nArray.length;++i){
            temp[nArray[i]] = 0;
            for(var j = 0;j < voArray.length;++j){
                if(temp[nArray[i]] === 0 && nArray[i] == voArray[j].n){
                    temp[nArray[i]] = 1;
                }
            }
        }
        return temp[nArray[0]] === temp[nArray[1]] && temp[nArray[1]] === temp[nArray[2]] && temp[nArray[0]] === 1;
    },


    /**
     * 根据n值在voArray中获得num张
     * @param n
     * @param voArray
     * @param num
     */
    getCardByNumber:function(n,voArray,num) {
        num = num || 5;//默认找五张
        var result = [];
        for(var i = 0;i < voArray.length;++i){
            if(n === voArray[i].n && num > result.length){
                result.push(voArray[i]);
            }
        }
        return result;
    },

    /**
     * 根据n值在voArray中删除num张
     * @param n
     * @param voArray
     * @param num
     */
    deleteCardByNumber:function(n,voArray,num) {
        num = num || 1;//默认删一个
        var localResult = HBGZPAI.countVoByNumber(voArray);
        for(var i = 0;i < voArray.length;){
            if(n === voArray[i].n){// && num > 0
                if(localResult[n] < num){//如果张数不够，不删除
                    return false;
                }
                //cards.splice(i,1);
                //--num;
                //if(num === 0){
                //    break;
                //}
                voArray.splice(i,num);
                return true;
            }else{
                ++i;
            }
        }
    },

    /**
     *  从m个数中取n个数
     * @param mArr  被挑选数组
     * @param n   mArr.size()
     * @param outLen  取值（输出）长度
     * @param startIndex  开始下标
     * @param m         挑选长度
     * @param nArr      挑选数组
     * @param arrIndex  挑选的值放到第几位开始
     * @param func
     */
    computeAllChoices:function(mArr,n,outLen,startIndex,m,nArr,arrIndex,allWay) {
        if(m == 0) {
            var temp = [];
            for (var i = 0; i < outLen; i++)
            {
                temp.push(nArr[i]);
            }
            allWay.push(temp);
            return;
        }

        var endIndex = n - m;
        for(var i=startIndex; i<=endIndex; i++) {
            nArr[arrIndex] = mArr[i];
            HBGZPAI.computeAllChoices(mArr, n, outLen, i+1, m-1, nArr, arrIndex+1,allWay);
        }
    },

    getAllZhaCount:function(i,ids,huList,zhaArr,zhaCount) {
        zhaArr = zhaArr || [];
        if(zhaCount == 0 || zhaArr.length == 0){
            return [];
        }
        // zhaArr = [0,2,8,6];
        // zhaCount = 3;
        //var result = [[],[],[],[],[],[],[]];
        for(var i = 0;i < zhaArr.length;++i){
            if(zhaCount === 1){
                //result[zhaCount].push([zhaArr[i]]);
                this.newDeleteZha(i,ids,huList,[zhaArr[i]]);
            }
            for(var j = i + 1;j < zhaArr.length;++j){
                if(zhaCount === 2){
                    //result[zhaCount].push([zhaArr[i],zhaArr[j]]);
                    this.newDeleteZha(i,ids,huList,[zhaArr[i],zhaArr[j]]);
                }
                for(var k = j + 1;k < zhaArr.length;++k){
                    if(zhaCount === 3){
                        //result[zhaCount].push([zhaArr[i],zhaArr[j],zhaArr[k]]);
                        this.newDeleteZha(i,ids,huList,[zhaArr[i],zhaArr[j],zhaArr[k]]);
                    }
                    for(var m = k + 1;m < zhaArr.length;++m){
                        if(zhaCount === 4){
                            //result[zhaCount].push([zhaArr[i],zhaArr[j],zhaArr[k],zhaArr[m]]);
                            this.newDeleteZha(i,ids,huList,[zhaArr[i],zhaArr[j],zhaArr[k],zhaArr[m]]);
                        }
                        for(var n = m + 1;n < zhaArr.length;++n){
                            if(zhaCount === 5){
                                //result[zhaCount].push([zhaArr[i],zhaArr[j],zhaArr[k],zhaArr[m],zhaArr[n]]);
                                this.newDeleteZha(i,ids,huList,[zhaArr[i],zhaArr[j],zhaArr[k],zhaArr[m],zhaArr[n]]);
                            }
                            for(var l = n + 1;l < zhaArr.length;++l){
                                if(zhaCount === 6){
                                    //result[zhaCount].push([zhaArr[i],zhaArr[j],zhaArr[k],zhaArr[m],zhaArr[n],zhaArr[l]]);
                                    this.newDeleteZha(i,ids,huList,[zhaArr[i],zhaArr[j],zhaArr[k],zhaArr[m],zhaArr[n],zhaArr[l]]);
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    newDeleteZha:function(i,ids,huList,zhaArr){
        var temp = zhaArr.slice(0);
        var huxi = 0;
        for(var index = 0;index < zhaArr.length;++index){
            this.deleteCardByNumber(zhaArr[index],temp,4);
            if(redArr.indexOf(zhaArr[index]) !== -1){
                huxi += 4;
            }else{
                huxi += 2;
            }
        }
        if(this.deleteKou(temp)){
            if(huList.indexOf(i + 1) === -1){
                if(this.isHasHuxi(HBGZPRoomModel.myOutHuxi + huxi,temp)){
                    huList.push(i + 1);
                }
            }
        }
    },

    deleteAllZha:function(i,ids,huList,zhaArr,zhaCount) {
        var mArr = zhaArr.slice(0);
        var nArr = [];
        for(var k = 0;k < zhaCount;++k){
            nArr.push(0);
        }
        var allWay = [];
        this.computeAllChoices(mArr,mArr.length, zhaCount, 0, nArr.length, nArr, 0,allWay);

        if(i === null && huList === null){//这两个值不传，不检测胡牌
            return;
        }
        for(var m = 0;m < allWay.length;++m){
            var temp = ids.slice(0);
            var huxi = 0;
            for(var n = 0;n < allWay[m].length;++n){
                this.deleteCardByNumber(allWay[m][n],temp,4);
                if(redArr.indexOf(allWay[m][n])){
                    huxi += 4;
                }else{
                    huxi += 2;
                }
            }
            if(this.deleteKou(temp)){
                if(huList.indexOf(i + 1) === -1){
                    if(this.isHasHuxi(HBGZPRoomModel.myOutHuxi + huxi,temp)){
                        huList.push(i + 1);
                    }
                }
            }
        }
    }
};

var redArr = [3,5,7,17,18,19,20,21,22];

var localID = [
    {t: 1, n: 1, i: 1, c: 1, v: 1,hua: 1 },//乙
    {t: 1, n: 2, i: 2, c: 2, v: 2,hua: 0 },
    {t: 1, n: 3, i: 3, c: 3, v: 3,hua: 1 },
    {t: 1, n: 4, i: 4, c: 4, v: 4,hua: 0 },
    {t: 1, n: 5, i: 5, c: 5, v: 5,hua: 1 },
    {t: 1, n: 6, i: 6, c: 6, v: 6,hua: 0 },
    {t: 1, n: 7, i: 7, c: 7, v: 7,hua: 1 },
    {t: 1, n: 8, i: 8, c: 8, v: 8,hua: 0 },
    {t: 1, n: 9, i: 9, c: 9, v: 9,hua: 1 },
    {t: 1, n: 10, i: 10, c: 10, v: 10,hua: 0 },
    {t: 1, n: 11, i: 11, c: 51, v: 101,hua: 0},//化
    {t: 1, n: 12, i: 12, c: 52, v: 102,hua: 0},//千
    {t: 1, n: 13, i: 13, c: 53, v: 103,hua: 0},//孔
    {t: 1, n: 14, i: 14, c: 54, v: 104,hua: 0},//己
    {t: 1, n: 15, i: 15, c: 55, v: 105,hua: 0},//土
    {t: 1, n: 16, i: 16, c: 56, v: 106,hua: 0},//子
    {t: 1, n: 17, i: 21, c: 81, v: 201,hua: 0},//可
    {t: 1, n: 18, i: 22, c: 82, v: 202,hua: 0},//知
    {t: 1, n: 19, i: 23, c: 83, v: 203,hua: 0},//礼
    {t: 1, n: 20, i: 26, c: 84, v: 204,hua: 0},//上
    {t: 1, n: 21, i: 27, c: 85, v: 205,hua: 0},//大
    {t: 1, n: 22, i: 28, c: 86, v: 206,hua: 0}//人
];

var specialList = {
    //1:[1,13,14],//孔乙己
    //13:[13,1,14],//孔乙己
    //14:[14,1,13],//孔乙己
    //3:[3,11,12],//化三千
    //11:[11,3,12],//化三千
    //12:[12,3,11],//化三千
    //7:[7,10,15],//七十土
    //10:[10,7,15],//七十土
    //15:[15,7,10],//七十土
    //8:[8,9,16],//八九子
    //9:[9,8,16],//八九子
    //16:[16,8,9],//八九子
    //17:[17,18,19],//可知礼
    //18:[18,17,19],//可知礼
    //19:[19,17,18],//可知礼
    //20:[20,21,22],//上大人
    //21:[21,20,22],//上大人
    //22:[22,20,21],//上大人
    //2:[2],
    //4:[4],
    //5:[5],
    //6:[6]
    1:[13,14],//孔乙己
    13:[1,14],//孔乙己
    14:[1,13],//孔乙己
    3:[11,12],//化三千
    11:[3,12],//化三千
    12:[3,11],//化三千
    7:[10,15],//七十土
    10:[7,15],//七十土
    15:[7,10],//七十土
    8:[9,16],//八九子
    9:[8,16],//八九子
    16:[8,9],//八九子
    17:[18,19],//可知礼
    18:[17,19],//可知礼
    19:[17,18],//可知礼
    20:[21,22],//上大人
    21:[20,22],//上大人
    22:[20,21]//上大人
    //2:[2],
    //4:[4],
    //5:[5],
    //6:[6]
};

var newPHZ = {
    1:[1,2,3,13,14],
    2:[1,2,3,4],
    3:[1,2,3,4,5,11,12],
    4:[2,3,4,5,6],
    5:[3,4,5,6,7],
    6:[4,5,6,7,8],
    7:[5,6,7,8,9,10,15],
    8:[6,7,8,9,10,16],
    9:[7,8,9,10,16],
    10:[7,8,9,10,15],
    11:[3,11,12],
    12:[3,11,12],
    13:[1,13,14],
    14:[1,13,14],
    15:[7,10,15],
    16:[8,9,16],
    17:[17,18,19],
    18:[17,18,19],
    19:[17,18,19],
    20:[20,21,22],
    21:[20,21,22],
    22:[20,21,22]
};