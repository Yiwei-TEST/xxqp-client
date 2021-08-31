/**
 * 卡牌的数据映射
 * @type {{t: number, n: number, i: number, c: number}}
 */
var CardVo = {
    t: 0,//花色
    n: 0,//数字
    i: 0, //大小排序
    c: 0 //后台索引
};

/**
 * 牌型
 * @type {{type: number, sortedCards: Array.<CardVo>, length: number, minIndex: number, maxIndex: number, planeCount: number, maxCount: number}}
 */
var CardPattern = {
    type: 0,//牌型
    sortedCards: [],//排序好了的牌
    length: 0,//牌的数量
    minIndex: 0,//最小的牌(针对飞机)
    maxIndex: 0,//最大数量牌的大小
    planeCount: 0,//飞机的个数
    maxCount: 0//同样的牌最大的数量
}

var DTZAI = {
    SINGLE: 1,//单张
    PAIR: 2,//对子
    THREE: 3,//三个不带 333
    THREEWithCard: 4,//三个带 333 带 45
    SHUNZI: 5,//顺子 34567
    LIANDUI: 6,//连对  33 44 55
    PLANE: 7,//飞机不带翅膀 333444
    PLANEWithCard: 8, //飞机带翅膀 333444555
    BOMB: 9,//炸弹 3333
    TONGZI: 10,//筒子 333同色
    XI: 11,// 喜
    SUPERBOOM: 12,//地炸 33 黑33 红33 梅33 方



    /**
     * 1 单张 2 对子
     * 3 三张不带牌 4 三张带牌
     * 5 顺子 6 连对
     * 7 飞机 (不带牌) 8 飞机 (带牌)
     * 9 各种炸弹 10 筒子  11 超级炸弹
     */


    MAX_CARD: 16,

    CARDS: [
        //方片
        {t: 1, n: 2, i: 15, c: 115},
        {t: 1, n: 1, i: 14, c: 114},
        {t: 1, n: 3, i: 3, c: 103},
        {t: 1, n: 4, i: 4, c: 104},
        {t: 1, n: 5, i: 5, c: 105},
        {t: 1, n: 6, i: 6, c: 106},
        {t: 1, n: 7, i: 7, c: 107},
        {t: 1, n: 8, i: 8, c: 108},
        {t: 1, n: 9, i: 9, c: 109},
        {t: 1, n: 10, i: 10, c: 110},
        {t: 1, n: 11, i: 11, c: 111},
        {t: 1, n: 12, i: 12, c: 112},
        {t: 1, n: 13, i: 13, c: 113},
        //梅花
        {t: 2, n: 2, i: 15, c: 215},
        {t: 2, n: 1, i: 14, c: 214},
        {t: 2, n: 3, i: 3, c: 203},
        {t: 2, n: 4, i: 4, c: 204},
        {t: 2, n: 5, i: 5, c: 205},
        {t: 2, n: 6, i: 6, c: 206},
        {t: 2, n: 7, i: 7, c: 207},
        {t: 2, n: 8, i: 8, c: 208},
        {t: 2, n: 9, i: 9, c: 209},
        {t: 2, n: 10, i: 10, c: 210},
        {t: 2, n: 11, i: 11, c: 211},
        {t: 2, n: 12, i: 12, c: 212},
        {t: 2, n: 13, i: 13, c: 213},
        //红桃
        {t: 3, n: 2, i: 15, c: 315},
        {t: 3, n: 1, i: 14, c: 314},
        {t: 3, n: 3, i: 3, c: 303},
        {t: 3, n: 4, i: 4, c: 304},
        {t: 3, n: 5, i: 5, c: 305},
        {t: 3, n: 6, i: 6, c: 306},
        {t: 3, n: 7, i: 7, c: 307},
        {t: 3, n: 8, i: 8, c: 308},
        {t: 3, n: 9, i: 9, c: 309},
        {t: 3, n: 10, i: 10, c: 310},
        {t: 3, n: 11, i: 11, c: 311},
        {t: 3, n: 12, i: 12, c: 312},
        {t: 3, n: 13, i: 13, c: 313},
        //黑桃
        //{t:4,n:1,i:14},
        {t: 4, n: 2, i: 15, c: 415},
        {t: 4, n: 1, i: 14, c: 414},
        {t: 4, n: 3, i: 3, c: 403},
        {t: 4, n: 4, i: 4, c: 404},
        {t: 4, n: 5, i: 5, c: 405},
        {t: 4, n: 6, i: 6, c: 406},
        {t: 4, n: 7, i: 7, c: 407},
        {t: 4, n: 8, i: 8, c: 408},
        {t: 4, n: 9, i: 9, c: 409},
        {t: 4, n: 10, i: 10, c: 410},
        {t: 4, n: 11, i: 11, c: 411},
        {t: 4, n: 12, i: 12, c: 412},
        {t: 4, n: 13, i: 13, c: 413},
        //大小王
        {t:4,n:16,i:16 ,c:16},
        {t:4,n:17,i:17 ,c:17}
    ],

    /**
     * 获取牌的定义对象
     * @param id
     * @returns {CardVo}
     */
    getCardDef: function (id) {
        var res = null;
        for (var i = 0; i < this.CARDS.length; i++) {
            var card = this.CARDS[i];
            if (card.c == id) {
                res = card;
                break;
            }
        }
        if(res == null){
            cc.log("getCardDef is null " + "ID：" + id);
        }
        return res;
    },

    /**
     * 洗牌
     * @returns {Array.<CardVo>}
     */
    shuffle: function () {
        var cards = ArrayUtil.shuffle(ArrayUtil.clone(this.CARDS));
        return cards;
    },

    /**
     * 按大小排序
     * @param card1 {CardVo}
     * @param card2 {CardVo}
     * @private
     * @return {number}
     */
    _sortByIndex: function (card1, card2) {
        return card1.i - card2.i;
    },

    /**
     * 获得牌型的对象
     * @param type 牌型
     * @param sortedCards 排序好了的牌
     * @param length 牌的数量
     * @param maxIndex 最大的牌
     * @param maxCount 相同牌的最大数量
     * @param minIndex 最小的牌(针对飞机)
     * @param planeCount 飞机的个数
     * @returns {CardPattern}
     * @private
     */
    _newCardPattern: function (type, sortedCards, maxIndex, maxCount, needMaxIndex, minIndex, planeCount) {
        if (maxIndex > needMaxIndex)
            return {
                type: type,
                sortedCards: sortedCards,
                length: sortedCards.length,
                maxIndex: maxIndex,
                minIndex: minIndex,
                planeCount: planeCount,
                maxCount: maxCount
            };
        return null;
    },

    /**
     * 筛选牌型
     * @param selectedCards {Array.<CardVo>}
     * @param currentlyCards {Array.<CardVo>}
     * @param lastCards {CardPattern}
     * @return {CardPattern}
     */
    filterCards: function (selectedCards, currentlyCards, lastCards) {
        currentlyCards = currentlyCards || [];
        var length = selectedCards.length;
        if (length == 0)
            return null;
        selectedCards.sort(this._sortByIndex);
        var maxNeedIndex = lastCards ? lastCards.maxIndex : 0;
        //单张
        if (length == 1) {
            if (DTZRoomModel.mySeat) {
                if (DTZRoomModel.isNextSeatBt() && currentlyCards.length > 0) {
                    if (selectedCards[0].i == currentlyCards[0].i)
                        return this._newCardPattern(this.SINGLE, selectedCards, selectedCards[0].i, 1, maxNeedIndex);
                } else {
                    return this._newCardPattern(this.SINGLE, selectedCards, selectedCards[0].i, 1, maxNeedIndex);
                }
            } else {
                if (PlayBackModel.isNextSeatBt() && currentlyCards.length > 0) {
                    if (selectedCards[0].i == currentlyCards[0].i)
                        return this._newCardPattern(this.SINGLE, selectedCards, selectedCards[0].i, 1, maxNeedIndex);
                } else {
                    return this._newCardPattern(this.SINGLE, selectedCards, selectedCards[0].i, 1, maxNeedIndex);
                }
            }
        }
        var firstCard = selectedCards[0];
        var lastCard = selectedCards[length - 1];
        var temp = {};
        var maxCount = 1;//同数字牌的数量
        var numberCount = 0;//不同数字的牌的数量
        for (var i = 0; i < length; i++) {
            var card = selectedCards[i];
            if (temp[card.i]) {
                temp[card.i] += 1;
                if (parseInt(temp[card.i]) > maxCount)
                    maxCount = parseInt(temp[card.i]);
            } else {
                numberCount++;
                temp[card.i] = 1;
            }
        }
        //顺子 必须5张起，最大只能到A
        if (length >= 5 && maxCount == 1 && lastCard.i <= 14) {
            if ((lastCard.i - firstCard.i) == (length - 1) && (!lastCards || length == lastCards.length))
                return this._newCardPattern(this.SHUNZI, selectedCards, lastCard.i, maxCount, maxNeedIndex);
        }
        var pairCount = 0;//连对数量
        var planeCount = 0;//三个带数量
        var maxIndex = 0;//最大的一张牌
        var planeMinCard = 100;
        var planeMaxCard = 0;
        var planeArray = [];
        for (var key in temp) {
            var tempKey = parseInt(key);
            var tempVal = parseInt(temp[key]);
            if (tempVal == 2)
                pairCount++;
            if (tempVal >= 3)
                planeArray.push(tempKey);
            if (tempVal == maxCount && tempKey > maxIndex)
                maxIndex = tempKey;
        }
        //对子or连对
        if (length % 2 == 0 && maxCount == 2) {
            //对子
            if (numberCount == 1 && (!lastCards || lastCards.length == 2))
                return this._newCardPattern(this.PAIR, selectedCards, lastCard.i, maxCount, maxNeedIndex);
            //连对
            if (pairCount == numberCount && (lastCard.i - firstCard.i) == (numberCount - 1) && (!lastCards || lastCards.length == length))
                return this._newCardPattern(this.PAIR, selectedCards, lastCard.i, maxCount, maxNeedIndex);
        }
        //炸弹
        if (maxCount == 4 && length == 4) {
            if (!lastCards || lastCards.type != DTZAI.BOMB)
                maxNeedIndex = 0;
            if (length == maxCount)
                return this._newCardPattern(this.BOMB, selectedCards, lastCard.i, maxCount, maxNeedIndex);
        }
        //三个带
        if (maxCount == 3 || maxCount == 4) {
            if (length == maxCount && currentlyCards.length == 3) {//仅3个
                //if(!lastCards)
                return this._newCardPattern(this.THREE, selectedCards, maxIndex, maxCount, maxNeedIndex);
            }
            if (length == 4 && currentlyCards.length == 4) {//3带1
                //if(!lastCards)
                return this._newCardPattern(this.THREE, selectedCards, maxIndex, maxCount, maxNeedIndex);
            }
            if (length == 5) {//3带2
                if (!lastCards || lastCards.length == length)
                    return this._newCardPattern(this.THREE, selectedCards, maxIndex, maxCount, maxNeedIndex);
            }
            if (planeArray.length > 1) {//飞机带翅膀
                maxNeedIndex = 0;
                planeArray = ArrayUtil.sortNumerically(planeArray);
                var planeLength = planeArray.length;
                var planeLengthj = planeLength - 1;
                var realPlaneArray = [];
                for (var i = 0; i < planeLength; i++) {//这里需要排除JJJQQQ带777的情况
                    var next = i + 1;
                    var cVal = parseInt(planeArray[i]);
                    var nVal = parseInt(planeArray[next]);
                    if ((i < planeLengthj) && Math.abs(cVal - nVal) == 1) {
                        planeMinCard = (cVal < planeMinCard) ? cVal : planeMinCard;
                        planeMaxCard = (nVal > planeMaxCard) ? nVal : planeMaxCard;
                        if (ArrayUtil.indexOf(realPlaneArray, cVal) < 0)
                            realPlaneArray.push(cVal);
                        if (ArrayUtil.indexOf(realPlaneArray, nVal) < 0)
                            realPlaneArray.push(nVal);
                    }
                }
                if (planeMinCard < 100 && planeMaxCard > 0)
                    planeCount = planeMaxCard - planeMinCard + 1;
                var mod = 0;
                if (currentlyCards.length < planeCount * 5) {
                    var planeCeil = Math.ceil(length / 5);
                    if (planeCeil < planeCount)
                        mod = planeCeil;
                } else {
                    mod = (length % 5 == 0) ? length / 5 : mod;
                }
                if (planeCount >= 2) {
                    if (mod < planeCount && mod >= 2)//JJJQQQ带101010的情况
                        planeCount = mod;
                    if (planeCount < realPlaneArray.length) {
                        realPlaneArray = ArrayUtil.sortNumerically(realPlaneArray);
                        planeMinCard = realPlaneArray[realPlaneArray.length - planeCount];
                        planeMaxCard = realPlaneArray[realPlaneArray.length - 1];
                    }
                    if (length % 5 == 0 || (currentlyCards.length < planeCount * 5 && currentlyCards.length == length)) {
                        if (!lastCards || lastCards.length == length)
                            return this._newCardPattern(this.PLANE, selectedCards, planeMaxCard, maxCount, maxNeedIndex, planeMinCard, planeCount);
                    }
                }
            }
        }
        return null;
    },

    /**
     * 是否为有序的数字数组
     * @param array {Array.<number>}
     * @private
     */
    _isSequence: function (array) {
        var length = array.length;
        if (length < 2)  return true;
        var start = array[0];
        var end = start + length - 1;
        var count = 0;
        for (var i = start; i < end; i++) {
            if (array[count] == i)
                count++;
        }
        return (count == length);
    },

    /**
     * 查找连对或者顺子
     * @param cards {Array.<CardVo>}
     * @param seqs {Array.<number>}
     * @param type {number}
     * @return {Array.<number>}
     * @private
     */
    _findShunzi: function (cards, seqs, type) {
        var max = (type == this.SHUNZI) ? 1 : 2;
        var temp = {};
        for (var i = 0; i < seqs.length; i++) {
            var seq = seqs[i];
            for (var j = 0; j < cards.length; j++) {
                var card = cards[j];
                if (card.i == seq) {
                    var t = temp[seq];
                    if (t) {
                        if (t.length < max)
                            temp[seq].push(j);
                    } else
                        temp[seq] = [j];
                }
            }
        }
        var result = [];
        var count = 0;
        for (var key in temp) {
            if (temp[key].length == max) {
                count++;
                ArrayUtil.merge(temp[key], result);
            }
        }
        result = (count == seqs.length) ? result : [];
        return result;
    },

    /**
     * 查找单张
     * @param numberMapping {Object}
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @param findTimes {number}
     * @private
     */
    _autoSingle: function (numberMap, cardsOnHand, lastHand, findTimes) {
        var result = [];
        var length = cardsOnHand.length;
        var maxIndex = DTZRoomModel.promptCardPattern ? DTZRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        if (DTZRoomModel.isNextSeatBt()) {//下家报停的情况
            for (var i = 0; i < length; i++) {
                var card = cardsOnHand[i];
                if (card.i > maxIndex) {
                    result.push(i);
                    break;
                }
            }
        } else {
            var seqs = [];
            for (var key in numberMap) {
                key = parseInt(key);
                var val = parseInt(numberMap[key]);
                var bool = key > maxIndex;
                if (findTimes == 1) {
                    if (val == 1 && bool)
                        seqs.push(key);
                } else {
                    if (val >= 1 && val < 4 && bool)
                        seqs.push(key);
                }
            }
            if (seqs.length > 0) {
                seqs = ArrayUtil.sortNumerically(seqs);
                var number = seqs[0];//拿出第一个
                for (var i = 0; i < cardsOnHand.length; i++) {
                    var card = cardsOnHand[i];
                    if (card.i == number && result.length == 0) {
                        result.push(i);
                        break;
                    }
                }
            } else {
                if (findTimes == 1)
                    return this._autoSingle(numberMap, cardsOnHand, lastHand, 2);
            }
        }
        return result;
    },

    /**
     * 查找单个对子
     * @param numberMapping {Object}
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @param findTimes {number}
     * @private
     */
    _autoPair: function (numberMap, cardsOnHand, lastHand, findTimes) {
        var maxIndex = DTZRoomModel.promptCardPattern ? DTZRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        var seqs = [];
        for (var key in numberMap) {
            key = parseInt(key);
            var val = parseInt(numberMap[key]);
            var bool = key > maxIndex;
            if (findTimes == 1) {
                if (val == 2 && bool)
                    seqs.push(key);
            } else {
                if (val >= 2 && val < 4 && bool)
                    seqs.push(key);
            }
        }
        var result = [];
        if (seqs.length > 0) {
            var filter = [];
            seqs = ArrayUtil.sortNumerically(seqs);
            for (var i = 0; i < seqs.length; i++) {
                var seq = seqs[i];
                if (findTimes == 1) {
                    var last = seq - 1;
                    var next = seq + 1;
                    if (ArrayUtil.indexOf(seqs, last) < 0 && ArrayUtil.indexOf(seqs, next) < 0) {//排除连对
                        filter.push(seq);
                        break;
                    }
                } else {
                    filter.push(seq);
                    break;
                }
            }
            if (filter.length == 0 && findTimes == 1)
                return this._autoPair(numberMap, cardsOnHand, lastHand, 2);
            if (filter.length > 0) {
                var number = filter[0];//拿出第一个
                for (var i = 0; i < cardsOnHand.length; i++) {
                    var card = cardsOnHand[i];
                    if (card.i == number && result.length < 2) {
                        result.push(i);
                    }
                }
            }
        } else {
            if (findTimes == 1)
                return this._autoPair(numberMap, cardsOnHand, lastHand, 2);
        }
        return result;
    },

    /**
     * 通用查找对子、连对、顺子的提示方法
     * @param number {number}
     * @param numberMapping {Object}
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @private
     */
    _autoSequence: function (number, numberMap, cardsOnHand, lastHand) {
        var result = [];
        var seqs = [];
        for (var key in numberMap) {
            key = parseInt(key);
            if (parseInt(numberMap[key]) >= number) {
                seqs.push(key);
            }
        }
        if (seqs.length > 0) {
            var maxIndex = DTZRoomModel.promptCardPattern ? DTZRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
            var type = (number == 2) ? this.PAIR : this.SHUNZI;
            var sequence = lastHand.length / number;//有几对牌
            var start = maxIndex - sequence + 2;//算出最小开始的数字,考虑了连对的情况
            var end = 14;
            for (var i = start; i <= end; i++) {
                if ((i + sequence - 1) <= end) {//这里要判断连对是否越界
                    var seqArray = [];
                    for (var j = 0; j < sequence; j++) {
                        seqArray.push(i + j);
                    }
                    result = this._findShunzi(cardsOnHand, seqArray, type);
                    if (result.length > 0)
                        break;
                } else {
                    break;
                }
            }
        }
        return result;
    },

    /**
     * 查找三个带
     * @param numberMapping {Object}
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @private
     */
    _autoThree: function (numberMap, cardsOnHand, lastHand) {
        var result = [];
        var seqs = [];
        var noSingles = [];
        var maxIndex = DTZRoomModel.promptCardPattern ? DTZRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        for (var key in numberMap) {
            key = parseInt(key);
            if (parseInt(numberMap[key]) == 3 && key > maxIndex) {
                seqs.push(key);
            }
            if (parseInt(numberMap[key]) > 1)
                noSingles.push(key);
        }
        if (seqs.length > 0) {
            seqs = ArrayUtil.sortNumerically(seqs);
            var number = seqs[0];//拿出第一个
            for (var i = 0; i < cardsOnHand.length; i++) {
                var card = cardsOnHand[i];
                if (card.i == number) {
                    result.push(i);
                }
            }
            var filterFunc = function (findTimes) {
                for (var i = (cardsOnHand.length - 1); i >= 0; i--) {
                    if (ArrayUtil.indexOf(result, i) < 0 && result.length < 5) {
                        if (findTimes == 1) {
                            if (ArrayUtil.indexOf(noSingles, cardsOnHand[i].i) < 0) {
                                result.push(i);
                            }
                        } else {
                            result.push(i);
                        }
                    }
                }
                if (result.length < 5 && findTimes == 1) {
                    filterFunc(2);
                }
            }
            filterFunc(1);
        }
        return result;
    },

    /**
     * 查找炸弹
     * @param numberMapping {Object}
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @private
     */
    _autoBomb: function (numberMap, cardsOnHand, lastHand) {
        var result = [];
        var seqs = [];
        var maxIndex = 0;
        if (lastHand || DTZRoomModel.promptCardPattern)
            maxIndex = DTZRoomModel.promptCardPattern ? DTZRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        for (var key in numberMap) {
            key = parseInt(key);
            if (parseInt(numberMap[key]) >= 4) {
                if (lastHand) {
                    if (key > maxIndex)
                        seqs.push(key);
                } else {
                    seqs.push(key);
                }
            }
        }
        if (seqs.length > 0) {
            seqs = ArrayUtil.sortNumerically(seqs);
            var number = seqs[0];//拿出第一个
            for (var i = 0; i < cardsOnHand.length; i++) {
                var card = cardsOnHand[i];
                if (card.i == number) {
                    result.push(i);
                }
            }
        }
        return result;
    },

    /**
     * 查找三个带
     * @param numberMapping {Object}
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @private
     */
    _autoPlane: function (numberMap, cardsOnHand, lastHand) {
        var result = [];
        var planeArray = [];
        for (var key in numberMap) {
            key = parseInt(key);
            if (parseInt(numberMap[key]) >= 3 && key > lastHand.minIndex) {
                planeArray.push(key);
            }
        }
        if (planeArray.length > 0) {
            planeArray = ArrayUtil.sortNumerically(planeArray);
            var planeMinCard = 100;
            var planeMaxCard = 0;
            var planeLength = planeArray.length;
            var planeLengthj = planeLength - 1;
            var planeCount = 0;
            var realPlaneArray = [];
            for (var i = 0; i < planeLength; i++) {//这里需要排除JJJQQQ带777的情况
                var next = i + 1;
                var cVal = parseInt(planeArray[i]);
                var nVal = parseInt(planeArray[next]);
                if ((i < planeLengthj) && Math.abs(cVal - nVal) == 1) {
                    planeMinCard = (cVal < planeMinCard) ? cVal : planeMinCard;
                    planeMaxCard = (nVal > planeMaxCard) ? nVal : planeMaxCard;
                    if (ArrayUtil.indexOf(realPlaneArray, cVal) < 0)
                        realPlaneArray.push(cVal);
                    if (ArrayUtil.indexOf(realPlaneArray, nVal) < 0)
                        realPlaneArray.push(nVal);
                }
            }
            if (planeMinCard < 100 && planeMaxCard > 0)
                planeCount = planeMaxCard - planeMinCard + 1;
            if (planeCount >= lastHand.planeCount) {
                realPlaneArray = ArrayUtil.sortNumerically(realPlaneArray);
                var tempMap = {};
                for (var p = 0; p < lastHand.planeCount; p++) {
                    for (var i = 0; i < cardsOnHand.length; i++) {
                        var card = cardsOnHand[i];
                        if (card.i == realPlaneArray[p]) {
                            if (tempMap[i]) {
                                tempMap[i] += 1;
                            } else {
                                tempMap[i] = 1;
                            }
                            if (parseInt(tempMap[i]) <= 3)
                                result.push(i);
                        }
                    }
                }
                for (var i = (cardsOnHand.length - 1); i >= 0; i--) {//三带二
                    if (ArrayUtil.indexOf(result, i) < 0 && result.length < (lastHand.planeCount * 5)) {
                        result.push(i)
                    }
                }
            }


        }
        return result;
    },

    /**
     * 智能提示
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @return {Array.<number>}
     */
    autoFilter: function (cardsOnHand, lastHand, findTimes) {
        findTimes = findTimes || 1;
        if (!lastHand) {
            return [cardsOnHand.length - 1];
        } else {
            var result = [];
            var type = lastHand.type;
            if (type == this.KING) {
                return result;
            }
            var length = cardsOnHand.length;
            var temp = {};
            for (var i = 0; i < length; i++) {
                var card = cardsOnHand[i];
                if (temp[card.i]) {
                    temp[card.i] += 1;
                } else {
                    temp[card.i] = 1;
                }
            }
            switch (type) {
                case this.SINGLE:
                    result = this._autoSingle(temp, cardsOnHand, lastHand, findTimes);
                    break;
                case this.PAIR:
                    if (lastHand.length == 2) {//单个对子的提示
                        result = this._autoPair(temp, cardsOnHand, lastHand, findTimes);
                    } else {
                        result = this._autoSequence(2, temp, cardsOnHand, lastHand);
                    }
                    break;
                case this.THREE:
                    result = this._autoThree(temp, cardsOnHand, lastHand);
                    break;
                case this.BOMB:
                    result = this._autoBomb(temp, cardsOnHand, lastHand);
                    break;
                case this.SHUNZI:
                    result = this._autoSequence(1, temp, cardsOnHand, lastHand);
                    break;
                case this.PLANE:
                    result = this._autoPlane(temp, cardsOnHand, lastHand);
                    break;
            }
            if (type != this.BOMB && result.length == 0) {
                result = this._autoBomb(temp, cardsOnHand);
            }
            return result;
        }
    },

    //////////////////////////////////////Add by xiaofu
    /**
     * 排序卡组
     *
     */
    sortCardsObj: function (item1, item2) {
        if (item1.i != item2.i) {
            return item2.i - item1.i;
        } else {
            return item2.t - item1.t;
        }
    },

    /**
     * 遍历检测是否包含筒子牌
     */
    isContainTongzi: function(cardList){
        var hasTongzi = false;
        for(var index = 0 ; index < cardList.length ; index ++){
            if(cardList[index]._isTongzi){
                cc.log("含有筒子牌");
                return hasTongzi = true
            }
        }
        return hasTongzi;
    },

    /**
     * 是否含有特殊牌
     */
    isContainSpecial:function (cardList){
        var hasSpecial = false;
        for(var index = 0 ; index < cardList.length ; index ++){
            if(cardList[index]._isTongzi || cardList[index]._isSuperBoom || cardList[index]._isXi){
                cc.log("含有筒子牌");
                return hasSpecial = true
            }
        }
        return hasSpecial;
    },

    /**
     * 返回当前查询卡组中 不是筒子的卡牌
     * specialType    1 筒子 2 囍 3 地炸  0 普通
     */
    getCardsByIsOrNotSpecail: function (cardList , specialType){
        var tChoiceCards = [];
        for(var index = 0 ; index < cardList.length ; index ++){
            if(cardList[index].isSpecialCard() == specialType){
                tChoiceCards.push(cardList[index]);
            }
        }
        return tChoiceCards;
    },

    /**
     * 返回牌里 面值重复最多的牌 (重复次数 面值大小)
     * @curCards 卡组
     * @difColor 是否考虑花色
     */
    getCardsRepeatData: function (curCards, difColor) {
        var length = curCards.length;
        var cardMap = {};
        var maxSameCardTimes = 0;
        var maxSameCardValue = 0;
        var maxSameCardColor = 0;
        if (difColor) {//考虑花色的
            for (var i = 0; i < length; i++) {
                var card = curCards[i];
                if (cardMap[card.c] && cardMap[card.c].color === card.t) {
                    var times = cardMap[card.c].times += 1;
                    cardMap[card.c].objList.push(card);
                    //cc.log("面值 花色 次数", card.i , card.t , cardMap[card.c].times);
                    if (times > maxSameCardTimes) {
                        maxSameCardTimes = times;
                        maxSameCardValue = card.i;
                        maxSameCardColor = card.t;
                        cc.log("面值 花色 次数", card.i , card.t , cardMap[card.c].times);
                    }
                } else {
                    cardMap[card.c] = {cardValue:card.i ,times: 1, color: card.t, objList: []};
                    cardMap[card.c].objList.push(card);
                }
            }
        } else {
            for (var i = 0; i < length; i++) {
                var card = curCards[i];
                if (cardMap[card.i]) {
                    var times = cardMap[card.i].times += 1;
                    if (times > maxSameCardTimes) {
                        maxSameCardTimes = times;
                        maxSameCardValue = card.i;
                    }
                } else {
                    cardMap[card.i] = {times: 1};
                }
            }
        }
        cc.log("返回的同牌数据为:值 次数 颜色:" + maxSameCardValue +" "+ maxSameCardTimes  + " " + maxSameCardColor);
        return {repValue: maxSameCardValue, repTimes: maxSameCardTimes, repColor: maxSameCardColor};
    },

    /**
     * 获取顺子封顶值 根据三副牌四副牌玩法 以及 是否勾选王筒子
     * mode 飞机or连对 飞机和连对的上限改为不一样
     */

    getMaxSerialValue:function(mode){
        var maxSerialValue = DTZRoomModel.is3FuPai() ? 15 : 18;
        if(mode == DTZAI.LIANDUI){
            maxSerialValue = DTZRoomModel.is3FuPai() ? 15 : 18;
            if(DTZRoomModel.is3FuPai() && DTZRoomModel.isWTZ()){
                maxSerialValue = 18
            }
            if(DTZRoomModel.isKlsx()){
                maxSerialValue = 15;
            }
            return maxSerialValue;
        }else if(mode == DTZAI.PLANE || mode == DTZAI.PLANEWithCard){
            maxSerialValue = DTZRoomModel.is3FuPai()?15 : 16;
            if(DTZRoomModel.is3FuPai() && DTZRoomModel.isWTZ()){
                maxSerialValue = 16;
            }
            if(DTZRoomModel.isKlsx()){
                maxSerialValue = 15;
            }
            return maxSerialValue;
        }
        return maxSerialValue;


    },

    /**
     * 检测是否符合单排顺子规则
     * curCards 牌组
     * minNumber 最少需要多少张牌
     * 该牌型已屏蔽 不信你搜索这个方法
     */
    isSerialModle: function (curCards, minNumber) {
        curCards.sort(DTZAI.sortCardsObj);
        var length = curCards.length;
        //检测数量
        if (length < minNumber) {
            return {isSerial: false, serialSize: 0, serialBeginValue: 0};
        }
        //检测最大面值 顺子只能到A 不能到2 四副牌可以到2
        var maxSerial = this.getMaxSerialValue(); //DTZRoomModel.is3FuPai() ? 15 : 18 ;
        if (curCards[0].i >= maxSerial) {
            return {isSerial: false, serialSize: 0, serialBeginValue: 0};
        }

        for (var index = 0; index < length - 1; index++) {
            var curCard = curCards[index];
            var nextCard = curCards[index + 1];
            if (curCard.i - nextCard.i != 1) {//差值超过1就不是顺子
                return {isSerial: false, serialSize: 0, serialBeginValue: 0};
            }
        }
        return {isSerial: true, serialSize: curCards.length, serialBeginValue: curCards[length - 1].i};
    },

    /**
     * 检测是否符合连对规则
     * curCards 牌组
     * minNumber 最少需要多少张牌
     *
     * 加入面值为15(黑红梅方2)不能算于连续数组的判断
     */
    isDoubleSerialModle: function (curCards, minNumber) {
        curCards.sort(DTZAI.sortCardsObj);
        var length = curCards.length;
        //检测数量
        if (length < minNumber || length % 2 != 0) {
            return {isDoubleSerial: false, doubleSerialSize: 0, doubleSerialBeginValue: 0};
        }
        //检测最大面值 顺子只能到A 不能到2
        var maxSerial = this.getMaxSerialValue(DTZAI.LIANDUI); //DTZRoomModel.is3FuPai() ? 15 : 18 ;
        if (curCards[0].i >= maxSerial) {
            return {isDoubleSerial: false, doubleSerialSize: 0, doubleSerialBeginValue: 0};
        }

        for (var index = 0; index < length - 1; index++) {
            var curCard = curCards[index];
            var nextCard = curCards[index + 1];
            if (index % 2 == 0) {
                if (curCard.i != nextCard.i) {
                    return {isDoubleSerial: false, doubleSerialSize: 0, doubleSerialBeginValue: 0};
                }
            } else {
                if (curCard.i - nextCard.i != 1) {
                    return {isDoubleSerial: false, doubleSerialSize: 0, doubleSerialBeginValue: 0};
                }
            }
        }
        return {
            isDoubleSerial: true,
            doubleSerialSize: curCards.length / 2,
            doubleSerialBeginValue: curCards[length - 1].i
        };
    },

    /**
     * 检测是否符合喜牌规则
     */
    isXiModle: function(curCards){
        cc.log("检测这个牌是不是喜...");
        if(curCards == null || curCards.length != 4){
            return {
                isXi : false,
                xiValue : 0,
                xiColor : 0
            }
        }
        var repeatCardData = DTZAI.getCardsMap(curCards , true);
        var maxValueWithColor = repeatCardData.maxSameCardValue;
        var maxTimesWithColor = repeatCardData.maxSameCardTimes;
        var maxColorWithColor = repeatCardData.maxSameCardColor;

        cc.log("maxTimesWithColor ... curCards.length" , maxTimesWithColor , curCards.length);

        if (maxTimesWithColor == 4 && curCards.length == 4) { //同面值 同花色 筒子
            return {
                isXi : true,
                xiValue : maxValueWithColor,
                xiColor : maxColorWithColor
            }
        } else {
            return {
                isXi : false,
                xiValue : 0,
                xiColor : 0
            }
        }
    },

    /**
     * 检测是否符合炸弹规则
     */
    isBoomModle: function (curCards) {
        var length = curCards.length;

        var repeatCardDataNoColor = DTZAI.getCardsMap(curCards , false);
        var maxValue = repeatCardDataNoColor.maxSameCardValue;
        var maxTimes = repeatCardDataNoColor.maxSameCardTimes;
        if (maxTimes == length) {//是炸弹
            var tisSuperBoom = false;
            if (length == 8) {//考虑地炸的情况
                tisSuperBoom = true;
                var cardMap = {};
                var colorLength = 0;
                for (var i = 0; i < length; i++) {
                    var card = curCards[i];
                    if (cardMap[card.c] && cardMap[card.c].color == card.t) {
                        cardMap[card.c].times += 1;
                        colorLength ++;
                    } else {
                        cardMap[card.c] = { times: 1, color: card.t};
                    }
                }
                //检查是否四种花色齐全 且数量都为2
                if (colorLength != 4) {
                    cc.log("没有集齐四种花色");
                    tisSuperBoom = false;
                }
                for (var key in cardMap) {
                    key = parseInt(key);
                    var times = parseInt(cardMap[key].times);
                    if (times != 2) { //
                        tisSuperBoom = false;
                    }
                }

            }
            return {
                isBoom: true,
                boomValue: maxValue,
                boomTimes: maxTimes,
                isSuperBoom: tisSuperBoom
            };
        }
        return {isBoom: false, boomValue: 0, boomTimes: 0, isSuperBoom: tisSuperBoom};
    },

    /**
     * 检测是否符合三张带牌规则
     */
    isThiredModle: function (curCards) {
        var length = curCards.length;
        if (length <= 3) {
            return {isThiredCard: false, thiredValue: 0};
        }

        var repeatCardDataNoColor = DTZAI.getCardsMap(curCards , false);
        var maxValue = repeatCardDataNoColor.maxSameCardValue;
        var maxTimes = repeatCardDataNoColor.maxSameCardTimes;

        if (maxTimes >= 3 && length <= 5 && length > 3 && maxValue < 16  && DTZRoomModel.isOpenDaiPai()) {//大小王也不允许带牌了 DTZRoomModel.is3FuPai()
            return {isThiredCard: true, thiredValue: maxValue};
        }
        return {isThiredCard: false, thiredValue: 0};


    },

    /**
     * 检测是否符合飞机带牌规则
     *
     * 要考虑检测优先级
     */
    isPlaneModle: function (curCards , lastCardsType) {
        if(lastCardsType != null){
            cc.log("这次检测是考虑优先级为" + lastCardsType.type + "的牌型");
        }

        var isConcerLastCards = false;
        var length = curCards.length;
        var cardMap = {};
        if (length < 6) {
            return {isPlane: false, planeMaxValue: 0, planeNums: 0, withCards: false};
        }

        if(lastCardsType != null && (lastCardsType.type == DTZAI.PLANEWithCard || lastCardsType.type == DTZAI.PLANE)){
            isConcerLastCards = true;
        }

        for (var i = 0; i < length; i++) {
            var card = curCards[i];
            if (cardMap[card.i]) {
                cardMap[card.i].times += 1;
            } else {
                cardMap[card.i] = {times: 1};
            }
        }

        var thiredTimesCard = [];
        for (var key in cardMap) {
            key = parseInt(key);
            var times = parseInt(cardMap[key].times);
            if (times >= 3) {
                thiredTimesCard.push({thiredValue: key})
            }
        }

        thiredTimesCard.sort(function (item1, item2) {
            return item2.thiredValue - item1.thiredValue;
        });

        //检测出现了三次的牌 是否有连续的情况 （考虑 777666 带 3334)也属于飞机 (3334445555)要识别成333444555带5 (666777 带 7777) (333444 带 9999)
        var maxSerial = this.getMaxSerialValue(DTZAI.PLANE); // DTZRoomModel.is3FuPai() ? 15 : 18;

        //检测连续的最大次数 记录连续的起始值大小
        //终值
        var maxSerialtimes = 1;
        var maxSerialBeginValue = 0;
        var serialRepeatCardValue = []; //连续的重复牌面值

        //临时值
        var serialTimes = 1;
        var serialBeginValue = 0;
        var tSerialRepeatCardValue = [];

        for(var i = 0; i < thiredTimesCard.length ; i++){
            serialTimes = 1;
            serialBeginValue = 0;
            tSerialRepeatCardValue = [];

            for (var index = i; index < thiredTimesCard.length - 1; index++) {
                var curCard = thiredTimesCard[index];
                var nextCard = thiredTimesCard[index + 1];
                serialBeginValue = curCard.thiredValue;
                cc.log("curCard , nextCard ... " , curCard.thiredValue , nextCard.thiredValue);
                if (curCard.thiredValue == nextCard.thiredValue + 1 && (curCard.thiredValue < maxSerial)) {//排除三个2 不能用于飞机 是连续的
                    serialTimes++;
                    //记录符合连续规则的牌的面值 (同一个值不能插入两次)
                    if (tSerialRepeatCardValue.length == 0) {
                        tSerialRepeatCardValue.push(curCard.thiredValue);
                        tSerialRepeatCardValue.push(nextCard.thiredValue);
                    } else {
                        tSerialRepeatCardValue.push(nextCard.thiredValue);
                    }
                    serialBeginValue = nextCard.thiredValue;

                    cc.log("serialTimes ... , maxSerial" ,serialTimes , maxSerialtimes);
                    if(serialTimes > maxSerialtimes){
                        serialRepeatCardValue = tSerialRepeatCardValue;
                        maxSerialtimes = serialTimes;
                        maxSerialBeginValue = serialBeginValue;
                        cc.log("记录最新的 连续情况" ,maxSerialtimes + " " +  maxSerialBeginValue);
                    }

                }else{
                    cc.log("到此不再连续了");
                    if(serialTimes > maxSerialtimes){
                        maxSerialtimes = serialTimes;
                        maxSerialBeginValue = serialBeginValue;
                        serialRepeatCardValue = tSerialRepeatCardValue;
                        cc.log("到此不再连续了 记录最大的连续值..." + maxSerialtimes + "起始值为" + maxSerialBeginValue);
                    }
                    break;
                }
            }
        }
        serialTimes = maxSerialtimes;

        //检测数量是否匹配
        var checkNumber = function (threeTimes, number) {
            for (var times = threeTimes; times > 0; times--) {
                if (number > (times * 3) && number <= (times * 3 + times * 2))
                    return times
            }
            return false;
        };

        cc.log("连续的三张次数为..." + serialTimes + "起始值为..." + maxSerialBeginValue);
        for(var index = 0 ; index < serialRepeatCardValue.length ; index++){
            cc.log("当前记录的连续出现三张的情况为：" , serialRepeatCardValue[index]);
        }


        //考虑优先级
        if(isConcerLastCards){
            var toSerialeNum = lastCardsType.serialNum;
            if(toSerialeNum > serialTimes){ //上家的连续飞机次数 比当前选出的牌的连续次数要大
                cc.log("上家的连续飞机次数 比当前选出的牌的连续次数要大");
            }
            if( length > (toSerialeNum * 3) && length <= (toSerialeNum * 3 + toSerialeNum * 2)  && serialTimes >= toSerialeNum && DTZRoomModel.isOpenDaiPai()){ //符合上一副牌的规则 && DTZRoomModel.is3FuPai()
                cc.log("考虑上家的牌型 ...当前牌型解析为 连续"+ toSerialeNum + "个三张" + "起始三张的值为" + serialRepeatCardValue[0] - toSerialeNum + 1 );
                return {
                    isPlane: true,
                    planeBeginValue: serialRepeatCardValue[0] - toSerialeNum + 1,
                    planeNums: toSerialeNum,
                    withCards: true
                    };
            }else if(length === (toSerialeNum * 3) && serialTimes == toSerialeNum){
                return {
                    isPlane: true,
                    planeBeginValue: serialRepeatCardValue[serialRepeatCardValue.length - 1],
                    planeNums: toSerialeNum,
                    withCards: false
                }
            }else {//考虑优先级的情况 如果不符合上一副牌的比对规则 就返回不符合牌型规则 虽然实际上它可能是飞机或者飞机带牌
                return {
                    isPlane: false,
                    planeBeginValue: 0,
                    planeNums: 0,
                    withCards: false
                };
            }
        }
        //不考虑优先级 //连续的三张 出现两次以上就是飞机
        else if (serialTimes >= 2) {

            var realSerialNum = checkNumber(serialTimes, length); //实际有几个三张用来带牌 3334445555 实际应该为333444555带5
            if (length == serialTimes * 3) {  // 未带牌
                return {
                        isPlane: true,
                        planeBeginValue: serialRepeatCardValue[serialRepeatCardValue.length - 1],
                        planeNums: serialTimes,
                        withCards: false
                    };
            } else if (realSerialNum && DTZRoomModel.isOpenDaiPai()) {  // 是否符合 带牌的数量规则 DTZRoomModel.is3FuPai()
                return {
                    isPlane: true,
                    planeBeginValue: serialRepeatCardValue[0] - realSerialNum + 1, //应对3334445555 应该解读为444555带3335
                    planeNums: realSerialNum,
                    withCards: true
                };
            } else {
                return {
                    isPlane: false,
                    planeBeginValue: 0,
                    planeNums: 0,
                    withCards: false
                };
            }
        } else {
            return {
                isPlane: false,
                planeBeginValue: 0,
                planeNums: 0,
                withCards: false
            };
        }
    },


    /**
     * 类型 面值(顺子 连对 飞机 就是最小的起始牌面值) 连续的次数(顺子 连对 飞机) 重复牌的最次数(炸弹) 重复牌的花色(筒子)
     * @param type
     * @param value
     * @param serialNum
     * @param repeatNum
     * @param repeatColor
     * @returns {*}
     *
     */
    getCardPattern: function (type, value, serialNum, repeatNum, repeatColor, length) {
        return {
            type: type,
            value: value,
            serialNum: serialNum,
            repeatNum: repeatNum,
            repeatColor: repeatColor,
            length: length,
        };
    },

    /**
     * 获取牌形 (打筒子)
     * 1 单张 2 对子
     * 3 三张不带牌 4 三张带牌
     * 5 顺子 6 连对
     * 7 飞机 (不带牌) 8 飞机 (带牌)
     * 9 筒子 10 各种炸弹 11 超级炸弹
     *
     * curCards 需要检测的牌
     * lastCardsType 一些特殊情况 需要影响检测优先级(目前只有飞机情况特殊)
     * 例如444555666 上家的牌如果是444555 需要被检测为 555666带444
     *               上家的牌如果是333444555 需要被检测为 444555666飞机不带牌
     * return {type , value , serialNum , repeatNum , repeatColor} 类型 面值(顺子 连对 飞机 就是最小的起始牌面值) 连续的次数(顺子 连对 飞机) 重复牌的最次数(炸弹) 重复牌的花色(筒子)
     */
    getCardsType: function (curCards , lastCardsType) {
        if(curCards == null){
            return null
        }
        var length = curCards.length;
        if (length == 0) {
            DTZAI.getCardPattern(0, 0, 0, 0, 0, 0);
        }

        if (length == 1) {
            //return {type:DTZAI.SINGLE , value:curCards[0].i };
            return DTZAI.getCardPattern(DTZAI.SINGLE, curCards[0].i, 0, 0, 0 ,length);
        }
        if (length == 2) {
            var repeatCardDataNoColor = DTZAI.getCardsMap(curCards , false);
            var maxValue = repeatCardDataNoColor.maxSameCardValue;
            var maxTimes = repeatCardDataNoColor.maxSameCardTimes;

            if (maxTimes == 2) {
                return DTZAI.getCardPattern(DTZAI.PAIR, maxValue, 0, 0, 0 , length);
            }
        }
        if (length == 3) { //只可能是筒子 或者 三张(不带牌)
            var repeatCardData = DTZAI.getCardsMap(curCards , true);
            var repeatCardDataNoColor = DTZAI.getCardsMap(curCards , false);

            var maxValueWithColor = repeatCardData.maxSameCardValue;
            var maxTimesWithColor = repeatCardData.maxSameCardTimes;
            var maxColorWithColor = repeatCardData.maxSameCardColor;

            var maxValue = repeatCardDataNoColor.maxSameCardValue;
            var maxTimes = repeatCardDataNoColor.maxSameCardTimes;
            //cc.log("三张的牌 数量有..." ,"不同色:" + maxTimes ,"同色:" + maxTimesWithColor) ;

            if (maxTimesWithColor == 3) { //同面值 同花色 筒子
                return DTZAI.getCardPattern(DTZAI.TONGZI, maxValueWithColor, 0, maxTimesWithColor, maxColorWithColor,length);
            } else if (maxTimes == 3) {
                return DTZAI.getCardPattern(DTZAI.THREE, maxValue, 0, 0, 0,length);
            }
        }
        if (length >= 4) { // 顺子 连队 炸 三张带 飞机 飞机带  都有可能

            var isSerialData = DTZAI.isSerialModle(curCards, 5);
            if (isSerialData.isSerial) {
                //return DTZAI.getCardPattern(DTZAI.SHUNZI, isSerialData.serialBeginValue, isSerialData.serialSize, 0, 0,length);
                //打筒子去掉顺子的牌型
                cc.log("不在有顺子牌型")
            }

            var isDoubleSerialData = DTZAI.isDoubleSerialModle(curCards, 4);
            if (isDoubleSerialData.isDoubleSerial) {
                return DTZAI.getCardPattern(DTZAI.LIANDUI, isDoubleSerialData.doubleSerialBeginValue, isDoubleSerialData.doubleSerialSize, 0, 0,length);
            }

            var isXiData = DTZAI.isXiModle(curCards);
            if(isXiData.isXi && DTZRoomModel.is4FuPai()){ //四副牌才有喜
                return DTZAI.getCardPattern(DTZAI.XI, isXiData.xiValue, 0, 0, isXiData.xiColor,length);
            }

            var isBoomData = DTZAI.isBoomModle(curCards);
            if (isBoomData.isBoom) {
                if (isBoomData.isSuperBoom && DTZRoomModel.is3FuPai()) {//三副牌才有地炸
                    return DTZAI.getCardPattern(DTZAI.SUPERBOOM, isBoomData.boomValue, 0, 0, 0,length);
                }
                return DTZAI.getCardPattern(DTZAI.BOMB, isBoomData.boomValue, 0, isBoomData.boomTimes, 0,length);
            }

            var isThiredData = DTZAI.isThiredModle(curCards);
            if (isThiredData.isThiredCard && DTZRoomModel.isOpenDaiPai() ) {//三副牌才可以带牌 && DTZRoomModel.is3FuPai()
                return DTZAI.getCardPattern(DTZAI.THREEWithCard, isThiredData.thiredValue,0,0,0,length);
            }

            var isPlaneData = DTZAI.isPlaneModle(curCards , lastCardsType);
            if (isPlaneData.isPlane) {
                if (isPlaneData.withCards && DTZRoomModel.isOpenDaiPai()) {//三副牌才可以带牌  && DTZRoomModel.is3FuPai()
                    return DTZAI.getCardPattern(DTZAI.PLANEWithCard, isPlaneData.planeBeginValue, isPlaneData.planeNums,0,0, length);
                } else {
                    return DTZAI.getCardPattern(DTZAI.PLANE, isPlaneData.planeBeginValue, isPlaneData.planeNums,0,0, length);
                }
            }
        }
        return DTZAI.getCardPattern(0, 0, 0, 0, 0, length);
    },


    /**
     * 通过牌组生成 cardmap 记录每个面值的牌出现的次数
     * @curCards
     * @difColor
     *
     * return cardMap maxSameCardValue  maxSameCardTimes //返回归类过的cardMap ,出现次数最多的面值 , 出现次数最多的数量
     */
    getCardsMap: function (curCards, difColor) {
        var length = curCards.length;
        var cardMap = {};
        var maxSameCardTimes = 0;
        var maxSameCardValue = 0;
        var maxSameCardColor = 0;
        difColor = difColor || false;
        if (difColor) {//考虑花色的
            for (var i = 0; i < length; i++) {
                var card = curCards[i];
                if (cardMap[card.c] && cardMap[card.c].color === card.t) {
                    var times = cardMap[card.c].times += 1;
                    cardMap[card.c].objList.push(card);
                    //cc.log("面值 花色 次数", card.i , card.t , cardMap[card.c].times);
                    if (times > maxSameCardTimes) {
                        maxSameCardTimes = times;
                        maxSameCardValue = card.i;
                        maxSameCardColor = card.t;
                    }
                } else {
                    cardMap[card.c] = {cardValue:card.i ,times: 1, color: card.t, objList: []};
                    cardMap[card.c].objList.push(card);
                }
            }
        } else {
            for (var i = 0; i < length; i++) {
                var card = curCards[i];
                if (cardMap[card.i]) {
                    var times = cardMap[card.i].times += 1;
                    cardMap[card.i].objList.push(card);
                    if (times > maxSameCardTimes) {
                        maxSameCardValue = card.i;
                        maxSameCardTimes = times;
                    }
                } else {
                    cardMap[card.i] = {times: 1, objList: []};
                    cardMap[card.i].objList.push(card);
                }
            }
        }
        return {cardMap:cardMap, maxSameCardValue:maxSameCardValue, maxSameCardTimes:maxSameCardTimes , maxSameCardColor:maxSameCardColor};
    },


    //从自己的牌中 选出符合某规则的牌型 (未完成 先改为4人游戏 有牌型筛选已经可以正常游戏 提示后期规则明朗在做)

    /**
     * 在牌组中选出大于某规则的单牌
     * @curCards
     * @number
     * @isGetFirstCard
     */
    getSingle: function (curCards, value , isGetFirstCard) {
        cc.log("找比" + value + "大的单牌");
        var isGetFirstCard = isGetFirstCard || false;
        var mapData = this.getCardsMap(curCards);
        var cardMap = mapData.cardMap;
        var maxValue = mapData.maxSameCardValue;
        var maxTimes = mapData.maxSameCardTimes;

        var result = [];
        var length = curCards.length;

        if (length == 1) {
            if (curCards[0].i > value){
                result.push(curCards[0]);
                return result;
            }
        }

        var searchRank = isGetFirstCard ? 1: 3;
        cc.log("查找单排的张数限制..." , searchRank);
        //先从只出现过一次的牌中查询 依次往下查找
        for (var curFindType = 1; curFindType <= searchRank; curFindType++) {
            for (var key in cardMap) {
                key = parseInt(key);
                var times = parseInt(cardMap[key].times);
                //cc.log("查询的顺序..." , key + " " + times);
                if ( key > value ) {
                    var objLength = cardMap[key].objList.length;
                    var noTongziCardList = this.getCardsByIsOrNotSpecail(cardMap[key].objList , 0);
                    if(noTongziCardList.length == curFindType){
                        result.push(noTongziCardList[0]);
                        return result;
                    }
                }
            }
        }
        return result
    },

    /**
     * 在牌组中选出大于某规则的对子
     * @curCards 牌组
     * @value 面值
     * @isGetFirstCard
     */
    getPair: function (curCards, value , isGetFirstCard) {
        cc.log("找比" + value + "大的对子");
        var isGetFirstCard = isGetFirstCard || false;
        var length = curCards.length;
        var result = [];
        if (length < 2) {
            return result;
        }
        var mapData = this.getCardsMap(curCards);
        var cardMap = mapData.cardMap;
        var maxValue = mapData.maxSameCardValue;
        var maxTimes = mapData.maxSameCardTimes;
        if (maxTimes < 2) { //连出现过两次的牌都木有
            return result;
        }

        var searchRank = isGetFirstCard ? 2 : 3;

        //先从对子中查找 依次往下查找
        for (var curFindType = 2; curFindType <= searchRank; curFindType++) {
            for (var key in cardMap) {
                key = parseInt(key);
                var times = parseInt(cardMap[key].times);
                if ( key > value) {
                    var noTongziCardList = this.getCardsByIsOrNotSpecail(cardMap[key].objList , 0);
                    if(noTongziCardList.length == curFindType ){
                        var objLength = noTongziCardList.length;
                        result.push(noTongziCardList[0]);
                        result.push(noTongziCardList[1]);
                        return result;
                    }
                }
            }
        }
        return result;
    },


    /**
     * 在牌组中选出大于某规则的三张
     * @curCards 牌组
     * @value 面值
     * @isGetFirstCard
     */
    getThird: function (curCards, value , isGetFirstCard) {
        cc.log("找比" + value + "大的三张");
        var isGetFirstCard = isGetFirstCard || false;
        var length = curCards.length;
        var result = [];
        if (length < 3) {
            return result;
        }
        var mapData = this.getCardsMap(curCards);
        var cardMap = mapData.cardMap;
        var maxValue = mapData.maxSameCardValue;
        var maxTimes = mapData.maxSameCardTimes;
        if (maxTimes < 3) { //连出现过三次的牌都木有
            cc.log("连出现过三次的牌都没有")
            return result;
        }
        //先从对子中查找 依次往下查找


        for (var curFindType = 3; curFindType <= maxTimes; curFindType++) {
            for (var key in cardMap) {
                key = parseInt(key);
                var times = parseInt(cardMap[key].times);

                if ( key > value) {
                    cc.log("find thired cards...");
                    var objLength = cardMap[key].objList.length;
                    var objList = cardMap[key].objList;
                    var cardData = this.getCardsType(objList);
                    //新增规则 遍历该炸弹中不包含筒子 地炸 喜
                    if(this.isContainSpecial(objList)){
                        objList = this.getCardsByIsOrNotSpecail(objList , 0);//获取当前卡组中不是特殊的卡牌
                        cc.log("搜寻炸弹中 获取不是特殊牌的数量为:", objList.length );

                        cardData = this.getCardsType(objList);
                    }
                    if(cardData.type == DTZAI.THREE && cardData.value > value){
                        for(var index = 0 ; index < objList.length ; index++){
                            var tCard = objList[index];
                            result.push(tCard);
                        }
                        return result;
                    }
                }
            }
        }
       //}
        return result;
    },

    /**
     * 递归
     *
     * 在牌组中选出大于某规则的顺子
     * @curCards 牌组
     * @value 顺子起始值
     * @serialSize 顺子长度
     */
    getShunzi: function(curCards , value , serialSize){
        cc.log("找比从" + value + "开始,连续"+ serialSize + "张 大的顺子");
        var length = curCards.length;
        var result = [];
        var beginCardValue = 0;
        var curSearchValue = 0;
        var curSerailNum = 0;
        if (length < serialSize) {
            return result;
        }

        //顺子到顶
        curSearchValue = beginCardValue = value + 1;
        if(beginCardValue + serialSize > 15){
            return result;
        }

        var mapData = this.getCardsMap(curCards);
        var cardMap = mapData.cardMap;
        var maxValue = mapData.maxSameCardValue;
        var maxTimes = mapData.maxSameCardTimes;
        for (var key in cardMap) {
            key = parseInt(key);
            var times = parseInt(cardMap[key].times);
            if (key == curSearchValue) {
                var noTongziCardList = this.getCardsByIsOrNotSpecail(cardMap[key].objList , 0);
                if(noTongziCardList.length >= 1) {
                    var objLength = noTongziCardList.length;
                    result.push(noTongziCardList[objLength - 1]);
                    curSerailNum ++;
                    curSearchValue ++;
                    if(curSerailNum == serialSize){
                        //找全整个顺子
                        return result;
                    }
                }
            }
        }

        if(result.length < serialSize){
            return this.getShunzi(curCards , value + 1 , serialSize);
        }

    },


    /**
     * 递归
     *
     * 在牌组中选出大于某规则的连对
     * @curCards 牌组
     * @value 连对起始值
     * @serialSize 连对长度
     */
    getLiandui: function(curCards , value , serialSize){
        cc.log("找比从" + value + "开始,连续"+ serialSize + "张 大的连对");
        var length = curCards.length;
        var result = [];
        var beginCardValue = 0;
        var curSearchValue = 0;
        var curSerailNum = 0;
        if (length < 2 * serialSize) {
            return result;
        }

        //顺子到顶
        curSearchValue = beginCardValue = value + 1;
        var maxSerial = this.getMaxSerialValue(DTZAI.LIANDUI); // DTZRoomModel.is3FuPai() ? 15 : 18;
        if(beginCardValue + serialSize > maxSerial){
            return result;
        }

        var mapData = this.getCardsMap(curCards , false);
        var cardMap = mapData.cardMap;
        var maxValue = mapData.maxSameCardValue;
        var maxTimes = mapData.maxSameCardTimes;
        for (var key in cardMap) {

            key = parseInt(key);
            var times = parseInt(cardMap[key].times);
            cc.log("key ,times ", key , times);
            if (key == curSearchValue && times >= 2) {
                //增加新规则 选中的连对不能包含筒子
                var noTongziCardList = this.getCardsByIsOrNotSpecail(cardMap[key].objList , 0);
                cc.log("noTongziCardList ... " , noTongziCardList.length , curSearchValue);
                if(noTongziCardList.length >= 2 && noTongziCardList.length <= 3){
                    var objLength = noTongziCardList.length;
                    result.push(noTongziCardList[objLength - 1]);
                    result.push(noTongziCardList[objLength - 2]);
                    curSerailNum ++;
                    curSearchValue ++;
                    cc.log("curSerailNum == serialSize" , curSerailNum , serialSize)
                    if(curSerailNum == serialSize){//找全整个顺子
                        return result;
                    }
                }
            }
        }
        cc.log("result.length < serialSize" , result.length , serialSize);
        if(curSerailNum < serialSize){
            return this.getLiandui(curCards , value + 1 , serialSize);
        }
    },

    /**
     * 递归
     *
     * 在牌组中选出大于某规则的飞机
     * @curCards 牌组
     * @value 飞机起始值
     * @serialSize 飞机长度
     */
    getPlane: function(curCards , value , serialSize){
        cc.log("找比从" + value + "开始,连续"+ serialSize + "张 大的飞机");
        var length = curCards.length;
        var result = [];
        var beginCardValue = 0;
        var curSearchValue = 0;
        var curSerailNum = 0;
        if (length < 3 * serialSize) {
            cc.log("牌的数量不足以 对付飞机");
            return result;
        }

        //顺子到顶
        curSearchValue = beginCardValue = value + 1;
        var maxSerial = this.getMaxSerialValue(DTZAI.PLANE); // DTZRoomModel.is3FuPai() ? 15 : 18;
        if(beginCardValue + serialSize > maxSerial){
            cc.log("没有找到符合条件的飞机..." , result);
            return result;
        }

        var mapData = this.getCardsMap(curCards);
        var cardMap = mapData.cardMap;
        var maxValue = mapData.maxSameCardValue;
        var maxTimes = mapData.maxSameCardTimes;
        for (var key in cardMap) {
            key = parseInt(key);
            var times = parseInt(cardMap[key].times);

            if (key == curSearchValue && times >= 3) {
                var noTongziCardList = this.getCardsByIsOrNotSpecail(cardMap[key].objList , 0);
                if(noTongziCardList.length == 3){//必须等于三 防止拆开炸弹
                    var objLength = cardMap[key].objList.length;
                    result.push(cardMap[key].objList[0]);
                    result.push(cardMap[key].objList[1]);
                    result.push(cardMap[key].objList[2]);
                    curSerailNum ++;
                    curSearchValue ++;
                    if(curSerailNum == serialSize){
                        //找全整个飞机
                        cc.log("找到整个飞机");
                        return result;
                    }
                }
            }
        }
        //cc.log("result.length , serialSize" , result.length ,curSerailNum , serialSize);
        if(curSerailNum < serialSize){
            return this.getPlane(curCards , value + 1 , serialSize);
        }
    },


    /**
     * 在牌组中选出大于当前规则的炸弹
     * @curCards 牌组
     * @boomValue 面值
     * @boomNumber 组成炸弹的个数
     */
    getBoom: function (curCards, boomValue, boomNumber) {
        cc.log("找大于" + boomNumber + "个" + boomValue + "的炸弹...");
        var length = curCards.length;
        var result = [];
        var mapData = this.getCardsMap(curCards , false);
        var cardMap = mapData.cardMap;
        boomNumber = boomNumber > 4 ? boomNumber : 4;
        var minBoom = null;
        var minBoomObjList = null;
        //找出比当前规则大的炸弹
        var minValue = 100;
        var minNumber = 100;
        for (var key in cardMap) {
            key = parseInt(key);
            var times = parseInt(cardMap[key].times);
            var objList = cardMap[key].objList;
            var cardData = this.getCardsType(objList);

            //新增规则 遍历该炸弹中不包含筒子
            if(this.isContainSpecial(objList)){
                objList = this.getCardsByIsOrNotSpecail(objList , 0);//获取当前卡组中不是筒子的卡牌
                cc.log("搜寻炸弹中 获取不是特殊牌的数量为:", objList.length );

                cardData = this.getCardsType(objList);
            }

            if (cardData.type = DTZAI.BOMB && ((cardData.value > boomValue && cardData.repeatNum == boomNumber) ||
                    (cardData.repeatNum > boomNumber))) {
                cc.log("找到符合条件的炸弹", cardData.value, minValue, cardData.repeatNum , minNumber);
                if (minNumber > cardData.repeatNum || (minNumber == cardData.repeatNum && minValue > cardData.value)) {//记录最小的炸弹 (炸弹牌数越小炸弹越小
                    minNumber = cardData.repeatNum;
                    minValue = cardData.value;
                    minBoomObjList = objList
                    cc.log("记录最小的炸弹..." , cardData.value ,cardData.repeatNum );
                }
            }
        }
        if (minBoomObjList) {
            return minBoomObjList;
        }
        return result;
    },

    /**
     * 在牌组中选出大于当前规则的筒子
     * @curCards 牌组
     * @tongziValue
     * @tongziColor
     */
    getTongzi: function (curCards, tongziValue, tongziColor) {
        var length = curCards.length;
        var result = [];

        var mapData = this.getCardsMap(curCards , true);
        var cardMapColor = mapData.cardMap;

        var minTongzi = null;
        tongziValue = tongziValue || 0;
        tongziColor = tongziColor || 0;
        var minValue = 100;

        for (var key in cardMapColor) {
            key = parseInt(key);
            var times = parseInt(cardMapColor[key].times);
            var color = parseInt(cardMapColor[key].color);
            var cardValue = parseInt(cardMapColor[key].cardValue);
            var objList = cardMapColor[key].objList;
            //cc.log("遍历同花色同面值的卡牌...",cardValue , times , color);
            if(times == 3){
                var cardData = this.getCardsType(objList);
                //cc.log("相同花色出现三次的卡组..." ,cardData.type , cardData.value , cardData.repeatColor);
                if(( cardData.value > tongziValue) ||
                    ( cardData.value == tongziValue && cardData.repeatColor > tongziColor && (DTZRoomModel.is3FuPai() || DTZRoomModel.isKlsx()))){
                    if ( minValue > cardData.value) {//记录最小的筒子
                        minValue = cardData.value;
                        minTongzi = cardMapColor[key];
                        cc.log("找到最小的筒子..." , minValue , cardData.repeatColor);
                    }
                }

            }
        }
        if (minTongzi) {
            return this.getCardsByIsOrNotSpecail(minTongzi.objList , 1);
            //return minTongzi.objList;
        }
        return result;
    },

    /**
     * 在牌组中选出大于当前规则的喜
     */
    getXi: function(curCards, xiValue, xiColor){
        cc.log("找大于:" + xiValue + " 色值为:" + xiColor + "的喜...");
        var length = curCards.length;
        var result = [];
        if(DTZRoomModel.is3FuPai()){//三副牌没有喜
            return result;
        }

        var mapData = this.getCardsMap(curCards , true);
        var cardMapColor = mapData.cardMap;

        var minXi = null;
        xiValue = xiValue || 0;
        xiColor = xiColor || 0;
        var minValue = 100;

        for (var key in cardMapColor) {
            key = parseInt(key);
            var times = parseInt(cardMapColor[key].times);
            var color = parseInt(cardMapColor[key].color);
            var cardValue = parseInt(cardMapColor[key].cardValue);
            var objList = cardMapColor[key].objList;

            if(times == 4){
                cc.log("找到出现四次的同色同面值牌了...");
                var cardData = this.getCardsType(objList);
                if(( cardData.value > xiValue) ||
                    ( cardData.value == xiValue && cardData.repeatColor > xiColor)){
                    if ( minValue > cardData.value) {//记录最小的筒子
                        minValue = cardData.value;
                        minXi = cardMapColor[key];
                        cc.log("找到最小的喜..." , minValue , cardData.repeatColor);
                    }
                }

            }
        }
        if (minXi) {
            return this.getCardsByIsOrNotSpecail(minXi.objList , 2);
        }
        return result;

    },

    /**
     * 在牌组中选出大于当前规则的地炸
     * @curCards 牌组
     * @superboomValue
     */
    getSuperBoom: function (curCards, superboomValue) {

        var length = curCards.length;
        var result = [];
        if(length < 8){
            return result;
        }

        if(DTZRoomModel.is4FuPai()){//四副牌没有地炸
            return result;
        }

        var mapData = this.getCardsMap(curCards , false);
        var cardMap = mapData.cardMap;

        for (var key in cardMap) {
            key = parseInt(key);
            var times = parseInt(cardMap[key].times);
            var objList = cardMap[key].objList;
            var superBoomObj = [];
            //大于8才可能是地炸
            if(times >= 8 && key > superboomValue){
                var isSuperBoom = true;
                var colorMapData = this.getCardsMap(objList , true);
                var colorMap = colorMapData.cardMap;
                var colorNum = 0;

                for (var key in colorMap) {
                    var times = parseInt(colorMap[key].times);
                    if(times < 2){//任何一种颜色的出现次数不能小于2
                        isSuperBoom = false;
                        cc.log("有同色卡少于两张");
                    }else{
                        var tCardList = this.getCardsByIsOrNotSpecail(colorMap[key].objList , 3);
                        if(tCardList.length == 2){
                            for(var index = 0 ; index < tCardList.length ; index ++){
                                superBoomObj.push(tCardList[index]);

                            }
                        }

                        //superBoomObj.push(colorMap[key].objList[0]);
                        //superBoomObj.push(colorMap[key].objList[1]);
                    }
                    colorNum++;

                }
                cc.log("colorNum!!!!!!!!!!!" , colorNum);
                if(colorNum < 4){
                    isSuperBoom = false;
                    cc.log("没有集齐四种颜色");
                }
                if(isSuperBoom){
                    cc.log("找到地炸！")
                    return superBoomObj;
                }
            }
        }

        //如果是四副牌添加 王炸的判断

        return result;
    },

    /**
     * 上面的get系列函数 为此服务
     * 获取当前能打得起某个牌型的牌
     * @curCards 上家的牌
     * @myCards 自己的手牌
     *
     */
    autoGetCards :function (curCards , myCards , cardsData){
        var result = [];
        var curCardsData = null;
        if(curCards == null && cardsData == null){
            return result;
        }

        if(cardsData){
            curCardsData = cardsData;
            cc.log("记录的");
        }else{
            curCardsData = DTZAI.getCardsType(curCards);
            cc.log("解析的" + JSON.stringify(curCards));
        }

        cc.log("当前比较的牌的数据..." , JSON.stringify(curCardsData));
        var tResult = [];
        if(curCardsData.type == 0){
            cc.log("当前牌型异常...");
            return tResult;
        }

        switch (curCardsData.type){
            case DTZAI.SINGLE:
                tResult = DTZAI.getSingle(myCards , curCardsData.value);
                break;
            case DTZAI.PAIR:
                tResult = DTZAI.getPair(myCards , curCardsData.value);
                break;
            case DTZAI.THREE:
            case DTZAI.THREEWithCard:
                tResult = DTZAI.getThird(myCards , curCardsData.value);
                break;
            case DTZAI.SHUNZI:
                tResult = DTZAI.getShunzi(myCards , curCardsData.value ,curCardsData.serialNum);
                break;
            case DTZAI.LIANDUI:
                tResult = DTZAI.getLiandui(myCards , curCardsData.value ,curCardsData.serialNum);
                break;
            case DTZAI.PLANE:
            case DTZAI.PLANEWithCard:
                tResult = DTZAI.getPlane(myCards , curCardsData.value ,curCardsData.serialNum);
                break;
            case DTZAI.BOMB:
                tResult = DTZAI.getBoom(myCards , curCardsData.value ,curCardsData.repeatNum);
                break;
            case DTZAI.TONGZI:
                tResult = DTZAI.getTongzi(myCards , curCardsData.value , curCardsData.repeatColor);
                break;
            case DTZAI.XI:
                tResult = DTZAI.getXi(myCards , curCardsData.value , curCardsData.repeatColor);
                break;
            case DTZAI.SUPERBOOM:
                tResult = DTZAI.getSuperBoom(myCards , curCardsData.value);
                break;
            default :
                tResult = [];
                break;
        }
        if(tResult == null){
            cc.log("我日 为什么tResult == null 了？！！！！！！！！！！！！！！！！！！！");
        }
        cc.log("初步查找相同牌型的结果:" , tResult.length , curCardsData.type);
        //相同牌型要不起的时候 考虑筒子和地炸
        if(tResult.length == 0 && curCardsData.type < DTZAI.BOMB ){
            cc.log("没有找到相同牌型的牌 转而去查找炸弹...");
            //先找炸弹
            tResult = DTZAI.getBoom(myCards , 0 , 0);
            if(tResult.length == 0){
                //找筒子
                tResult = DTZAI.getTongzi(myCards , 0 , 0);
                if(tResult.length == 0){
                    if(DTZRoomModel.is3FuPai()){
                        //找地炸
                        tResult = DTZAI.getSuperBoom(myCards , 0);
                    }else if(DTZRoomModel.is4FuPai()){
                        //找喜
                        tResult = DTZAI.getXi(myCards , 0 , 0);
                    }
                }
            }
        }

        //未找到比当前牌打的炸弹 转而去寻找类型碾压的牌 比如三副牌中  地炸>筒子>炸弹 四副牌 喜>筒子>炸弹
        if(tResult.length == 0 && curCardsData.type == DTZAI.BOMB ){
            //先找筒子
            cc.log("来找筒子啦...");
            tResult = DTZAI.getTongzi(myCards , 0 , 0);
            if(tResult.length == 0){
                if(DTZRoomModel.is3FuPai()){
                    //找地炸
                    tResult = DTZAI.getSuperBoom(myCards , 0);
                }else if(DTZRoomModel.is4FuPai()){
                    //找喜
                    tResult = DTZAI.getXi(myCards , 0 , 0);
                }
            }
        }
        //未找到比当前牌大的筒子 转而去寻找地炸
        if(tResult.length == 0 && curCardsData.type == DTZAI.TONGZI ){
            if(DTZRoomModel.is3FuPai()){
                //找地炸
                tResult = DTZAI.getSuperBoom(myCards , 0);
            }else if(DTZRoomModel.is4FuPai()){
                //找喜
                cc.log("上副牌是筒子 寻找可以打起筒子的喜牌");
                tResult = DTZAI.getXi(myCards , 0 , 0);
            }
        }

        return tResult;
    },

    /**
     * 获取无限制 提示出牌
     * 当前轮到我出首牌
     */
    autoGetUnlimitCards: function(myCards){
        //首先判断 所有首牌能否一次出完
        var tResult = [];

        var tNewMyCardList = [];
        for(var index = 0 ; index < myCards.length ; index++){
            tNewMyCardList.push(myCards[index]);
        }
       var curCardsData = DTZAI.getCardsType(tNewMyCardList);//这个方法会修改传进去的数组 所以使用备份的tNewCardList

        if(curCardsData.type != 0){//可以一次出完
            cc.log("可以一次出完...类型为:" + curCardsData.type + " 值为:" , curCardsData.value);
            for(var index = 0 ; index < myCards.length ; index++){
                tResult.push(myCards[index]);
            }
            return tResult;
        }else{
            //尝试找单牌
            tResult = DTZAI.getSingle(myCards , 0 , true);
            if(tResult.length != 0){
                return tResult;
            }
            //尝试找对子
            tResult = DTZAI.getPair(myCards , 0 , true);
            if(tResult.length != 0){
                return tResult;
            }

            //尝试找三张
            tResult = DTZAI.getThird(myCards , 0 , true);
            if(tResult.length != 0){
                return tResult;
            }

            //尝试找连对
            tResult = DTZAI.getLiandui(myCards , 0 , 2);
            if(tResult.length != 0){
                return tResult;
            }

            //尝试找飞机
            tResult = DTZAI.getPlane(myCards , 0 , 2);
            if(tResult.length != 0){
                return tResult;
            }

            //尝试找炸弹
            tResult = DTZAI.getBoom(myCards , 0 , 4);
            if(tResult.length != 0){
                return tResult;
            }


            tResult = DTZAI.getTongzi(myCards , 0 , 0);
            if(tResult.length != 0){
                return tResult;
            }


            if(DTZRoomModel.is3FuPai()){
                tResult = DTZAI.getSuperBoom(myCards , 0);
                if(tResult.length != 0){
                    return tResult;
                }
            }

            if(DTZRoomModel.is4FuPai()){
                tResult = DTZAI.getXi(myCards , 0 , 0);
                if(tResult.length != 0){
                    return tResult;
                }
            }

        }
        return tResult;

    },

    /**
     * 飞机牌的特殊处理
     *  某些情况 例如 上家打 333444XXXX 下家打 444555666 应该解读为 555666带444 不能解析为飞机不带牌
     *  只有在最初出牌的玩家打出的是飞机牌 而且 我的当前上家打出的也是飞机牌的情况下 处理为这种逻辑
     */
    specialgetCardsType:function (curCards , myCards , cardsData , firstPlaneValue , firstPlaneSerailNum){

    }
};