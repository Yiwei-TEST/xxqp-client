/**
 * 卡牌的数据映射
 * @type {{t: number, n: number, i: number, c: number}}
 */
var CardVo = {
    t:0,//花色
    n:0,//数字
    i:0, //大小排序
    c:0 //后台索引
};

/**
 * 牌型
 * @type {{type: number, sortedCards: Array.<CardVo>, length: number, minIndex: number, maxIndex: number, planeCount: number, maxCount: number}}
 */
var CardPattern = {
    type:0,//牌型
    sortedCards:[],//排序好了的牌
    length:0,//牌的数量
    minIndex:0,//最小的牌(针对飞机)
    maxIndex:0,//最大数量牌的大小
    planeCount:0,//飞机的个数
    maxCount:0//同样的牌最大的数量
}

var PDKAI = {
    SINGLE:1,//单张
    PAIR:2,//对子
    THREE:3,//三个带
    BOMB:4,//炸弹
    SHUNZI:5,//顺子
    PLANE:6,//飞机带翅膀
    KING:7,//大小王炸弹
    BOMBWITHCARD:8,//跑得快


    MAX_CARD:17,

    CARDS:[
        //方片
        {t:1,n:1,i:14,c:114},
        //{t:1,n:2,i:15},
        {t:1,n:3,i:3,c:103},
        {t:1,n:4,i:4,c:104},
        {t:1,n:5,i:5,c:105},
        {t:1,n:6,i:6,c:106},
        {t:1,n:7,i:7,c:107},
        {t:1,n:8,i:8,c:108},
        {t:1,n:9,i:9,c:109},
        {t:1,n:10,i:10,c:110},
        {t:1,n:11,i:11,c:111},
        {t:1,n:12,i:12,c:112},
        {t:1,n:13,i:13,c:113},
        //梅花
        {t:2,n:1,i:14,c:214},
        //{t:2,n:2,i:15},
        {t:2,n:3,i:3,c:203},
        {t:2,n:4,i:4,c:204},
        {t:2,n:5,i:5,c:205},
        {t:2,n:6,i:6,c:206},
        {t:2,n:7,i:7,c:207},
        {t:2,n:8,i:8,c:208},
        {t:2,n:9,i:9,c:209},
        {t:2,n:10,i:10,c:210},
        {t:2,n:11,i:11,c:211},
        {t:2,n:12,i:12,c:212},
        {t:2,n:13,i:13,c:213},
        //红桃
        {t:3,n:1,i:14,c:314},
        //{t:3,n:2,i:15},
        {t:3,n:3,i:3,c:303},
        {t:3,n:4,i:4,c:304},
        {t:3,n:5,i:5,c:305},
        {t:3,n:6,i:6,c:306},
        {t:3,n:7,i:7,c:307},
        {t:3,n:8,i:8,c:308},
        {t:3,n:9,i:9,c:309},
        {t:3,n:10,i:10,c:310},
        {t:3,n:11,i:11,c:311},
        {t:3,n:12,i:12,c:312},
        {t:3,n:13,i:13,c:313},
        //黑桃
        //{t:4,n:1,i:14},
        {t:4,n:2,i:15,c:415},
        {t:4,n:3,i:3,c:403},
        {t:4,n:4,i:4,c:404},
        {t:4,n:5,i:5,c:405},
        {t:4,n:6,i:6,c:406},
        {t:4,n:7,i:7,c:407},
        {t:4,n:8,i:8,c:408},
        {t:4,n:9,i:9,c:409},
        {t:4,n:10,i:10,c:410},
        {t:4,n:11,i:11,c:411},
        {t:4,n:12,i:12,c:412},
        {t:4,n:13,i:13,c:413}
        //大小王
        //{t:5,n:14,i:14},
        //{t:5,n:15,i:15}
    ],

    /**
     * 获取牌的定义对象
     * @param id
     * @returns {CardVo}
     */
    getCardDef:function(id){
        var res = null;
        for(var i=0;i<this.CARDS.length;i++){
            var card = this.CARDS[i];
            if(card.c == id){
                res = card;
                break;
            }
        }
        return res;
    },

    /**
     * 洗牌
     * @returns {Array.<CardVo>}
     */
    shuffle:function(){
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
    _sortByIndex:function(card1,card2){
        return card1.i-card2.i;
    },
    _sortByBiger:function(card1,card2){
        return card2.i-card1.i;
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
    _newCardPattern:function(type,sortedCards,maxIndex,maxCount,needMaxIndex,minIndex,planeCount){
        if(maxIndex>needMaxIndex)
            return {type:type,sortedCards:sortedCards,length:sortedCards.length,maxIndex:maxIndex,minIndex:minIndex,planeCount:planeCount,maxCount:maxCount};
        return null;
    },

    /**
     * 筛选牌型
     * @param selectedCards {Array.<CardVo>}
     * @param currentlyCards {Array.<CardVo>}
     * @param lastCards {CardPattern}
     * @return {CardPattern}
     */
    filterCards:function(selectedCards,currentlyCards,lastCards){
        currentlyCards = currentlyCards || [];
        var length = selectedCards.length;
        if(length==0)
            return null;
        selectedCards.sort(this._sortByIndex);
        var maxNeedIndex = lastCards ? lastCards.maxIndex : 0;
        var lastType = lastCards ? lastCards.type : null;
        // cc.log("selectedCards =",JSON.stringify(selectedCards));
        if (PDKRoomModel.intParams && PDKRoomModel.intParams[29] == 0){//炸弹不可拆
            var selectedCardstemp = {};
            for(var i=0;i<length;i++){
                var card = selectedCards[i];
                if(selectedCardstemp[card.i]){
                    selectedCardstemp[card.i] += 1;
                }else{
                    selectedCardstemp[card.i] = 1;
                }
            }
            var currentlyCardstemp = {};
            for(var i=0;i<currentlyCards.length;i++){
                var card = currentlyCards[i];
                if(currentlyCardstemp[card.i]){
                    currentlyCardstemp[card.i] += 1;
                }else{
                    currentlyCardstemp[card.i] = 1;
                }
            }      
            // cc.log("selectedCards.length =",JSON.stringify(selectedCards.length));
            // cc.log("PDKRoomModel.intParams[11] =",PDKRoomModel.intParams[11]);

            for(var cardI in selectedCardstemp){
                if (PDKRoomModel.intParams[30] == 1){
                    if(cardI == 14 && currentlyCardstemp[cardI] == 3 && (selectedCardstemp[cardI] < 3 || selectedCards.length > 3)){
                        return null;
                    }
                }
                if(selectedCardstemp[cardI] < 4 || selectedCards.length > (4 + parseInt(PDKRoomModel.intParams[11]))){
                    if(currentlyCardstemp[cardI] && currentlyCardstemp[cardI] == 4){
                        return null;
                    }
                }
            }   
        }
        //单张//
        if(length == 1){
            if(PDKRoomModel.mySeat){
                if(PDKRoomModel.isNextSeatBt() && currentlyCards.length>0){
                    if(selectedCards[0].i == currentlyCards[0].i)
                        return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }else{
                    return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }
            }else{
                if(PlayBackModel.isNextSeatBt() && currentlyCards.length>0){
                    if(selectedCards[0].i == currentlyCards[0].i)
                        return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }else{
                    return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }
            }
        }
        var firstCard = selectedCards[0];
        var lastCard =  selectedCards[length-1];
        var temp = {};
        var maxCount = 1;//同数字牌的数量
        var numberCount = 0;//不同数字的牌的数量
        var maxTimesCardId = 0;//出现次数最多的牌的大小
        for(var i=0;i<length;i++){
            var card = selectedCards[i];
            if(temp[card.i]){
                temp[card.i] += 1;
                if(parseInt(temp[card.i]) > maxCount){
                    maxCount = parseInt(temp[card.i]);
                    maxTimesCardId = card.i;
                }
            }else{
                numberCount++;
                temp[card.i] = 1;
            }
        }
        //顺子 必须5张起，最大只能到A
        if(length>=5 && maxCount==1 && lastCard.i <= 14){
            if((lastCard.i-firstCard.i) == (length-1) && (!lastCards || length==lastCards.length))
                return this._newCardPattern(this.SHUNZI,selectedCards,lastCard.i,maxCount,maxNeedIndex);
        }
        var pairCount = 0;//连对数量
        var planeCount = 0;//三个带数量
        var maxIndex = 0;//最大的一张牌
        var planeMinCard = 100;
        var planeMaxCard = 0;
        var planeArray = [];
        for(var key in temp){
            var tempKey = parseInt(key);
            var tempVal = parseInt(temp[key]);
            if(tempVal == 2)
                pairCount++;
            if(tempVal >= 3)
                planeArray.push(tempKey);
            if (tempVal == maxCount && tempKey > maxIndex)
                maxIndex = tempKey;
        }
        //对子or连对
        if(length%2 == 0 && maxCount==2){
            //对子
            if(numberCount == 1 && (!lastCards || lastCards.length==2))
                return this._newCardPattern(this.PAIR,selectedCards,lastCard.i,maxCount,maxNeedIndex);
            //连对
            if(pairCount==numberCount && (lastCard.i-firstCard.i) == (numberCount-1) && (!lastCards || lastCards.length==length))
                return this._newCardPattern(this.PAIR,selectedCards,lastCard.i,maxCount,maxNeedIndex);
        }
        //炸弹
        if(maxCount == 4 && length==4 || (PDKRoomModel.intParams && PDKRoomModel.intParams[30] == 1 && maxCount == 3 && firstCard.i == 14)) {
            if(!lastCards || lastCards.type!=PDKAI.BOMB)
                maxNeedIndex = 0;
            if (length == maxCount)
                return this._newCardPattern(this.BOMB, selectedCards, lastCard.i, maxCount,maxNeedIndex);
        }

        //四张带牌
        //这里如果开启了四张带牌 并且轮到我出首牌 或者 上手牌也是炸弹带排的牌型 则优先识别为炸弹带牌
        //如果手牌不足 可以以少打多
        cc.log("lastType...::" , lastType , maxCount);
        if((lastType == null || lastType == PDKAI.BOMBWITHCARD) && PDKRoomModel.isOpenBoomWithCard()){
            if (maxCount == 4 && length > 4 && length <= 4 + PDKRoomModel.isOpenBoomWithCard()) {
                if(lastType == null) {
                    cc.log("是首牌炸弹带牌排型：：", maxTimesCardId, length);
                    return this._newCardPattern(this.BOMBWITHCARD, selectedCards, maxTimesCardId, length, 0);
                }else if(lastType == PDKAI.BOMBWITHCARD){
                    if(selectedCards.length == currentlyCards.length){//最后一手的情况 可以以少打多
                        if(selectedCards.length <= lastCards.length && maxTimesCardId > lastCards.maxIndex){
                            cc.log("是炸弹带牌排型以少打多：：", maxTimesCardId, length);
                            return this._newCardPattern(this.BOMBWITHCARD, selectedCards, maxTimesCardId, length, 0);
                        }
                    }else{
                        if(selectedCards.length == lastCards.length && maxTimesCardId > lastCards.maxIndex){
                            cc.log("是炸弹带牌排型压牌：：", maxTimesCardId, length);
                            return this._newCardPattern(this.BOMBWITHCARD, selectedCards, maxTimesCardId, length, 0);
                        }
                    }
                }
            }
        }

        //cc.log("PDKRoomModel.isLessThreeFj()=="+PDKRoomModel.isLessThreeFj())

        //三个带
        if((maxCount == 3 || (maxCount == 4 && lastType != PDKAI.BOMBWITHCARD)) ){  
            var sanzhangArr = [];
            var danpaiArr = [];
            // cc.log("planeArray =",JSON.stringify(planeArray));
            // 客户端模拟出牌三带二排序
            var tempArr = ArrayUtil.clone(selectedCards);
            for (var k = 0; k < planeArray.length; k++) {
                for (var i = 0; i < selectedCards.length; i++) {
                    if (selectedCards[i].i == planeArray[k]){
                        sanzhangArr.push(selectedCards[i]);
                        for (var j = 0; j < tempArr.length; j++) {
                            if (tempArr[j].i == planeArray[k]){
                                tempArr.splice(j,1);
                            }
                        }
                    }
                }
            }
            sanzhangArr.sort(this._sortByBiger);
            danpaiArr = tempArr.sort(this._sortByIndex);
            for (var j = 0; j < danpaiArr.length; j++) {
                sanzhangArr.push(danpaiArr[j])
            }
            // cc.log("sanzhangArr =",JSON.stringify(sanzhangArr));
            if(length == maxCount && currentlyCards.length==3){//仅3个
                //if(!lastCards)
                return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }
            if((length == 4 || length == 3 && PDKRoomModel.isLessThreeFj()) && currentlyCards.length==4){//3带1
                //if(!lastCards)
                return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }
            if(((length >= 3 && length <= 5) && PDKRoomModel.isLessThreeFj()) && currentlyCards.length==5){//3带2
                //if(!lastCards)
                return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }
            if(length == 5){//3带2
                if(!lastCards || lastCards.length==length)
                    return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }
            if(planeArray.length>1){//飞机带翅膀
                maxNeedIndex = 0;
                planeArray = ArrayUtil.sortNumerically(planeArray);
                var planeLength = planeArray.length;
                var planeLengthj = planeLength-1;
                var realPlaneArray = [];
                for(var i=0;i<planeLength;i++){//这里需要排除JJJQQQ带777的情况
                    var next = i+1;
                    var cVal = parseInt(planeArray[i]);
                    var nVal = parseInt(planeArray[next]);
                    if((i<planeLengthj) && Math.abs(cVal-nVal) == 1){
                        if (i>1){
                            if((i<planeLengthj) && Math.abs(planeArray[next]-planeArray[i-1]) == 2){
                                planeMinCard = (cVal<planeMinCard) ? cVal : planeMinCard;
                                planeMaxCard = (nVal>planeMaxCard) ? nVal : planeMaxCard;
                                if(ArrayUtil.indexOf(realPlaneArray,cVal)<0)
                                    realPlaneArray.push(cVal);
                                if(ArrayUtil.indexOf(realPlaneArray,nVal)<0)
                                    realPlaneArray.push(nVal);
                            }
                        }else{
                            planeMinCard = (cVal<planeMinCard) ? cVal : planeMinCard;
                            planeMaxCard = (nVal>planeMaxCard) ? nVal : planeMaxCard;
                            if(ArrayUtil.indexOf(realPlaneArray,cVal)<0)
                                realPlaneArray.push(cVal);
                            if(ArrayUtil.indexOf(realPlaneArray,nVal)<0)
                                realPlaneArray.push(nVal);
                        }
                    }
                }
                // cc.log("planeMaxCard ="+planeMaxCard,"planeMinCard="+planeMinCard);
                if(planeMinCard<100 && planeMaxCard>0)
                    planeCount = planeMaxCard-planeMinCard+1;
                var mod = 0;
                if(currentlyCards.length<planeCount*5){
                    var planeCeil = Math.ceil(length/5);
                    if(planeCeil<planeCount)
                        mod = planeCeil;
                }else{
                    mod = (length%5==0) ? length/5 : mod;
                }
                if(planeCount>=2){
                    if(mod<planeCount && mod>=2)//JJJQQQ带101010的情况
                        planeCount=mod;
                    if(planeCount<realPlaneArray.length){
                        realPlaneArray = ArrayUtil.sortNumerically(realPlaneArray);
                        planeMinCard = realPlaneArray[realPlaneArray.length-planeCount];
                        planeMaxCard = realPlaneArray[realPlaneArray.length-1];
                    }
                    sanzhangArr = [];
                    danpaiArr = [];
                    cc.log("realPlaneArray =",JSON.stringify(realPlaneArray));
                    // 客户端模拟出牌三带二排序
                    var tempArr = ArrayUtil.clone(selectedCards);
                    for (var k = 0; k < realPlaneArray.length; k++) {
                        for (var i = 0; i < selectedCards.length; i++) {
                            if (selectedCards[i].i == realPlaneArray[k]){
                                sanzhangArr.push(selectedCards[i]);
                                for (var j = 0; j < tempArr.length; j++) {
                                    if (tempArr[j].i == realPlaneArray[k]){
                                        tempArr.splice(j,1);
                                    }
                                }
                            }
                        }
                    }
                    sanzhangArr.sort(this._sortByBiger);
                    cc.log("sanzhangArr =",JSON.stringify(sanzhangArr));

                    danpaiArr = tempArr.sort(this._sortByIndex);
                    for (var j = 0; j < danpaiArr.length; j++) {
                        sanzhangArr.push(danpaiArr[j])
                    }
                    // cc.log("danpaiArr =",JSON.stringify(danpaiArr));

                    // cc.log("currentlyCards.length=="+currentlyCards.length);
                    // cc.log("length=="+length);
                    // cc.log("planeCount*5=="+planeCount*5);
                    if (((sanzhangArr.length < planeCount*5 ||  danpaiArr.length == 0) && sanzhangArr.length == currentlyCards.length)  || sanzhangArr.length == planeCount*5){
                        if(length%5==0 || (currentlyCards.length<planeCount*5 && (currentlyCards.length==length || (PDKRoomModel.isLessThreeFj() && currentlyCards.length >= length)))){
                            if(!lastCards || (lastCards.length==length || (PDKRoomModel.isLessThreeFj() && currentlyCards.length >= length)))
                                return this._newCardPattern(this.PLANE, sanzhangArr, planeMaxCard, maxCount, maxNeedIndex,planeMinCard,planeCount);
                        }
                    }
                        
                }
            }
        }

        return null;
    },

    filterCardsForZZPDK:function(selectedCards,currentlyCards,lastCards){
        currentlyCards = currentlyCards || [];
        var length = selectedCards.length;
        if(length==0)
            return null;
        selectedCards.sort(this._sortByIndex);
        var maxNeedIndex = lastCards ? lastCards.maxIndex : 0;
        var lastType = lastCards ? lastCards.type : null;
        // cc.log("selectedCards =",JSON.stringify(selectedCards));
        if (PDKRoomModel.intParams && PDKRoomModel.intParams[29] == 0){//炸弹不可拆
            var selectedCardstemp = {};
            for(var i=0;i<length;i++){
                var card = selectedCards[i];
                if(selectedCardstemp[card.i]){
                    selectedCardstemp[card.i] += 1;
                }else{
                    selectedCardstemp[card.i] = 1;
                }
            }
            var currentlyCardstemp = {};
            for(var i=0;i<currentlyCards.length;i++){
                var card = currentlyCards[i];
                if(currentlyCardstemp[card.i]){
                    currentlyCardstemp[card.i] += 1;
                }else{
                    currentlyCardstemp[card.i] = 1;
                }
            }      
            // cc.log("selectedCards.length =",JSON.stringify(selectedCards.length));
            // cc.log("PDKRoomModel.intParams[11] =",PDKRoomModel.intParams[11]);

            for(var cardI in selectedCardstemp){
                if (PDKRoomModel.intParams[30] == 1){
                    if(cardI == 14 && currentlyCardstemp[cardI] == 3 && (selectedCardstemp[cardI] < 3 || selectedCards.length > 3)){
                        return null;
                    }
                }
                if(selectedCardstemp[cardI] < 4 || selectedCards.length > (4 + parseInt(PDKRoomModel.intParams[11]))){
                    if(currentlyCardstemp[cardI] && currentlyCardstemp[cardI] == 4){
                        return null;
                    }
                }
            }   
        }
        //单张//
        if(length == 1){
            if(PDKRoomModel.mySeat){
                if(PDKRoomModel.isNextSeatBt() && currentlyCards.length>0){
                    if(selectedCards[0].i == currentlyCards[0].i)
                        return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }else{
                    return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }
            }else{
                if(PlayBackModel.isNextSeatBt() && currentlyCards.length>0){
                    if(selectedCards[0].i == currentlyCards[0].i)
                        return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }else{
                    return this._newCardPattern(this.SINGLE,selectedCards,selectedCards[0].i,1,maxNeedIndex);
                }
            }
        }
        var firstCard = selectedCards[0];
        var lastCard =  selectedCards[length-1];
        var temp = {};
        var maxCount = 1;//同数字牌的数量
        var numberCount = 0;//不同数字的牌的数量
        var maxTimesCardId = 0;//出现次数最多的牌的大小
        for(var i=0;i<length;i++){
            var card = selectedCards[i];
            if(temp[card.i]){
                temp[card.i] += 1;
                if(parseInt(temp[card.i]) > maxCount){
                    maxCount = parseInt(temp[card.i]);
                    maxTimesCardId = card.i;
                }
            }else{
                numberCount++;
                temp[card.i] = 1;
            }
        }
        //顺子 必须5张起，最大只能到A
        if(length>=5 && maxCount==1 && lastCard.i <= 14){
            if((lastCard.i-firstCard.i) == (length-1) && (!lastCards || length==lastCards.length))
                return this._newCardPattern(this.SHUNZI,selectedCards,lastCard.i,maxCount,maxNeedIndex);
        }
        var pairCount = 0;//连对数量
        var planeCount = 0;//三个带数量
        var maxIndex = 0;//最大的一张牌
        var planeMinCard = 100;
        var planeMaxCard = 0;
        var planeArray = [];
        for(var key in temp){
            var tempKey = parseInt(key);
            var tempVal = parseInt(temp[key]);
            if(tempVal == 2)
                pairCount++;
            if(tempVal >= 3)
                planeArray.push(tempKey);
            if (tempVal == maxCount && tempKey > maxIndex)
                maxIndex = tempKey;
        }
        //对子or连对
        if(length%2 == 0 && maxCount==2){
            //对子
            if(numberCount == 1 && (!lastCards || lastCards.length==2))
                return this._newCardPattern(this.PAIR,selectedCards,lastCard.i,maxCount,maxNeedIndex);
            //连对
            if(pairCount==numberCount && (lastCard.i-firstCard.i) == (numberCount-1) && (!lastCards || lastCards.length==length))
                return this._newCardPattern(this.PAIR,selectedCards,lastCard.i,maxCount,maxNeedIndex);
        }
        //炸弹
        if(maxCount == 4 && length==4 || (PDKRoomModel.intParams && PDKRoomModel.intParams[30] == 1 && maxCount == 3 && firstCard.i == 14)) {
            if(!lastCards || lastCards.type!=PDKAI.BOMB)
                maxNeedIndex = 0;
            if (length == maxCount)
                return this._newCardPattern(this.BOMB, selectedCards, lastCard.i, maxCount,maxNeedIndex);
        }

        // cc.log("maxCount =",maxCount);
        // cc.log("length =",length);
        //炸弹
        if(maxCount == 4 && length==5 && (PDKRoomModel.intParams && PDKRoomModel.intParams[5] == 1)) {
            if(!lastCards || lastCards.type!=PDKAI.BOMB)
                maxNeedIndex = 0;
            return this._newCardPattern(this.BOMB, selectedCards, lastCard.i, maxCount,maxNeedIndex);
        }

        //四张带牌
        //这里如果开启了四张带牌 并且轮到我出首牌 或者 上手牌也是炸弹带排的牌型 则优先识别为炸弹带牌
        //如果手牌不足 可以以少打多
        // cc.log("lastType...::" , lastType , maxCount);
        // cc.log("PDKRoomModel.isOpenBoomWithCard() =",PDKRoomModel.isOpenBoomWithCard());
        if((lastType == null || lastType == PDKAI.BOMBWITHCARD) && PDKRoomModel.isOpenBoomWithCard()){
            if (maxCount == 4 && length > 4 && length <= 4 + PDKRoomModel.isOpenBoomWithCard()) {
                if(lastType == null) {
                    cc.log("是首牌炸弹带牌排型：：", maxTimesCardId, length);
                    return this._newCardPattern(this.BOMBWITHCARD, selectedCards, maxTimesCardId, length, 0);
                }else if(lastType == PDKAI.BOMBWITHCARD){
                    if(selectedCards.length == currentlyCards.length){//最后一手的情况 可以以少打多
                        if(selectedCards.length <= lastCards.length && maxTimesCardId > lastCards.maxIndex){
                            cc.log("是炸弹带牌排型以少打多：：", maxTimesCardId, length);
                            return this._newCardPattern(this.BOMBWITHCARD, selectedCards, maxTimesCardId, length, 0);
                        }
                    }else{
                        if(selectedCards.length == lastCards.length && maxTimesCardId > lastCards.maxIndex){
                            cc.log("是炸弹带牌排型压牌：：", maxTimesCardId, length);
                            return this._newCardPattern(this.BOMBWITHCARD, selectedCards, maxTimesCardId, length, 0);
                        }
                    }
                }
            }
        }

        //cc.log("PDKRoomModel.isLessThreeFj()=="+PDKRoomModel.isLessThreeFj())

        //三个带
        if((maxCount == 3 || (maxCount == 4 && lastType != PDKAI.BOMBWITHCARD)) ){
            var sanzhangArr = [];
            var danpaiArr = [];
            // cc.log("planeArray =",JSON.stringify(planeArray));
            // 客户端模拟出牌三带二排序
            var tempArr = ArrayUtil.clone(selectedCards);
            for (var k = 0; k < planeArray.length; k++) {
                for (var i = 0; i < selectedCards.length; i++) {
                    if (selectedCards[i].i == planeArray[k]){
                        sanzhangArr.push(selectedCards[i]);
                        for (var j = 0; j < tempArr.length; j++) {
                            if (tempArr[j].i == planeArray[k]){
                                tempArr.splice(j,1);
                            }
                        }
                    }
                }
            }
            sanzhangArr.sort(this._sortByBiger);
            danpaiArr = tempArr.sort(this._sortByIndex);
            for (var j = 0; j < danpaiArr.length; j++) {
                sanzhangArr.push(danpaiArr[j])
            }
            i
            // cc.log("sanzhangArr =",JSON.stringify(sanzhangArr));
            // cc.log("danpaiArr =",JSON.stringify(danpaiArr));
            if(length == 3 && PDKRoomModel.intParams[16] == 0){
                return null;
            }
            if(length == 4 && PDKRoomModel.intParams[17] == 0){
                return null;
            }
            if(length == 5 && danpaiArr[1] &&  danpaiArr[0].i != danpaiArr[1].i && PDKRoomModel.intParams[18] == 0){
                return null;
            }
            if(length == 5 && danpaiArr[1] && danpaiArr[0].i == danpaiArr[1].i && PDKRoomModel.intParams[19] == 0){
                return null;
            }
            if(length == maxCount && (currentlyCards.length==3 || PDKRoomModel.intParams[16] == 1)){//仅3个
                if(!lastCards || lastCards.length==length)
                    return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }
            if((length == 4 || length == 3 && PDKRoomModel.isLessThreeFj()) && currentlyCards.length==4){//3带1
                //if(!lastCards)
                return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }

            if((length == 4 && PDKRoomModel.intParams[17] == 1)){
                if(!lastCards || lastCards.length==length)
                    return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }

            if(((length >= 3 && length <= 5) && PDKRoomModel.isLessThreeFj()) && currentlyCards.length==5){//3带2
                //if(!lastCards)
                return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
            }
            if(length == 5){//3带2
                if(!lastCards || lastCards.length==length)
                    return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);

                if(danpaiArr[1] && danpaiArr[0].i != danpaiArr[1].i && PDKRoomModel.intParams[18] == 1){
                    if(!lastCards || lastCards.length==length)
                        return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
                }
                if(danpaiArr[1] && danpaiArr[0].i == danpaiArr[1].i && PDKRoomModel.intParams[19] == 1){
                    if(!lastCards || lastCards.length==length)
                        return this._newCardPattern(this.THREE, sanzhangArr, maxIndex, maxCount,maxNeedIndex);
                }
            }
            if(planeArray.length>1){//飞机带翅膀
                maxNeedIndex = 0;
                planeArray = ArrayUtil.sortNumerically(planeArray);
                var planeLength = planeArray.length;
                var planeLengthj = planeLength-1;
                var realPlaneArray = [];
                for(var i=0;i<planeLength;i++){//这里需要排除JJJQQQ带777的情况
                    var next = i+1;
                    var cVal = parseInt(planeArray[i]); 
                    var nVal = parseInt(planeArray[next]);
                    if((i<planeLengthj) && Math.abs(cVal-nVal) == 1){
                        if (i>1){
                            if((i<planeLengthj) && Math.abs(planeArray[next]-planeArray[i-1]) == 2){
                                planeMinCard = (cVal<planeMinCard) ? cVal : planeMinCard;
                                planeMaxCard = (nVal>planeMaxCard) ? nVal : planeMaxCard;
                                if(ArrayUtil.indexOf(realPlaneArray,cVal)<0)
                                    realPlaneArray.push(cVal);
                                if(ArrayUtil.indexOf(realPlaneArray,nVal)<0)
                                    realPlaneArray.push(nVal);
                            }
                        }else{
                            planeMinCard = (cVal<planeMinCard) ? cVal : planeMinCard;
                            planeMaxCard = (nVal>planeMaxCard) ? nVal : planeMaxCard;
                            if(ArrayUtil.indexOf(realPlaneArray,cVal)<0)
                                realPlaneArray.push(cVal);
                            if(ArrayUtil.indexOf(realPlaneArray,nVal)<0)
                                realPlaneArray.push(nVal);
                        }
                    }
                }
                // cc.log("planeMaxCard ="+planeMaxCard,"planeMinCard="+planeMinCard);
                if(planeMinCard<100 && planeMaxCard>0)
                    planeCount = planeMaxCard-planeMinCard+1;
                var mod = 0;
                if(currentlyCards.length<planeCount*5){
                    var planeCeil = Math.ceil(length/5);
                    if(planeCeil<planeCount)
                        mod = planeCeil;
                }else{
                    mod = (length%5==0) ? length/5 : mod;
                }
                if(planeCount>=2){
                    if(mod<planeCount && mod>=2)//JJJQQQ带101010的情况
                        planeCount=mod;
                    if(planeCount<realPlaneArray.length){
                        realPlaneArray = ArrayUtil.sortNumerically(realPlaneArray);
                        planeMinCard = realPlaneArray[realPlaneArray.length-planeCount];
                        planeMaxCard = realPlaneArray[realPlaneArray.length-1];
                    }
                    sanzhangArr = [];
                    danpaiArr = [];
                    // cc.log("realPlaneArray =",JSON.stringify(realPlaneArray));
                    // 客户端模拟出牌三带二排序
                    var tempArr = ArrayUtil.clone(selectedCards);
                    for (var k = 0; k < realPlaneArray.length; k++) {
                        for (var i = 0; i < selectedCards.length; i++) {
                            if (selectedCards[i].i == realPlaneArray[k]){
                                sanzhangArr.push(selectedCards[i]);
                                for (var j = 0; j < tempArr.length; j++) {
                                    if (tempArr[j].i == realPlaneArray[k]){
                                        tempArr.splice(j,1);
                                    }
                                }
                            }
                        }
                    }
                    sanzhangArr.sort(this._sortByBiger);
                    // cc.log("sanzhangArr =",JSON.stringify(sanzhangArr));

                    danpaiArr = tempArr.sort(this._sortByIndex);
                    for (var j = 0; j < danpaiArr.length; j++) {
                        sanzhangArr.push(danpaiArr[j])
                    }
                    // cc.log("danpaiArr =",JSON.stringify(danpaiArr));
                    if(PDKRoomModel.intParams[16] == 0 && length == planeCount * 3){
                        return null;
                    }

                    if(PDKRoomModel.intParams[17] == 0 && length == planeCount * 4){
                        return null;
                    }
                    if(PDKRoomModel.intParams[19] == 0 && PDKRoomModel.intParams[18] == 0 && length == planeCount * 5){
                        return null;
                    }
                    if(PDKRoomModel.intParams[18] == 0 && length == planeCount * 5){
                        if(danpaiArr[1] && danpaiArr[0].i != danpaiArr[1].i || danpaiArr[2].i != danpaiArr[3].i){
                             return null;
                        }
                    }
                    if(PDKRoomModel.intParams[19] == 0 && length == planeCount * 5){
                        if(danpaiArr[1] && danpaiArr[0].i == danpaiArr[1].i || danpaiArr[2].i == danpaiArr[3].i){
                             return null;
                        }
                    }
                    // cc.log("currentlyCards.length=="+currentlyCards.length);
                    // cc.log("length=="+length);
                    // cc.log("planeCount*5=="+planeCount*5);
                    if (((sanzhangArr.length < planeCount*5 || danpaiArr.length == 0) && sanzhangArr.length == currentlyCards.length)  || sanzhangArr.length == planeCount*5){
                        if(length%5==0 || (currentlyCards.length<planeCount*5 && (currentlyCards.length==length || (PDKRoomModel.isLessThreeFj() && currentlyCards.length >= length)))){
                            if(!lastCards || (lastCards.length==length || (PDKRoomModel.isLessThreeFj() && currentlyCards.length >= length)))
                                if(!lastCards || lastCards.length==length)
                                    return this._newCardPattern(this.PLANE, sanzhangArr, planeMaxCard, maxCount, maxNeedIndex,planeMinCard,planeCount);
                        }
                    }
                    
                    if(PDKRoomModel.intParams[16] == 1 && length == planeCount * 3){
                        if(!lastCards || lastCards.length==length)
                            return this._newCardPattern(this.PLANE, sanzhangArr, planeMaxCard, maxCount, maxNeedIndex,planeMinCard,planeCount);
                    }
                    if(PDKRoomModel.intParams[17] == 1 && length == planeCount * 4){
                        if(!lastCards || lastCards.length==length)
                            return this._newCardPattern(this.PLANE, sanzhangArr, planeMaxCard, maxCount, maxNeedIndex,planeMinCard,planeCount);
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
    _isSequence:function(array){
        var length = array.length;
        if(length < 2)  return true;
        var start = array[0];
        var end = start+length-1;
        var count = 0;
        for(var i=start;i<end;i++){
            if(array[count] == i)
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
    _findShunzi:function(cards,seqs,type){
        var max = (type == this.SHUNZI) ? 1 : 2;
        var temp = {};
        for(var i=0;i<seqs.length;i++){
            var seq = seqs[i];
            for(var j=0;j<cards.length;j++){
                var card = cards[j];
                if(card.i == seq){
                    var t = temp[seq];
                    if(t){
                        if(t.length < max)
                            temp[seq].push(j);
                    }else
                        temp[seq] = [j];
                }
            }
        }
        var result = [];
        var count = 0;
        for(var key in temp){
            if(temp[key].length == max){
                count++;
                ArrayUtil.merge(temp[key],result);
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
    _autoSingle:function(numberMap,cardsOnHand,lastHand,findTimes){
        var result = [];
        var length = cardsOnHand.length;
        var maxIndex = PDKRoomModel.promptCardPattern ? PDKRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        if(PDKRoomModel.isNextSeatBt()){//下家报停的情况
            for(var i=0;i<length;i++){
                var card = cardsOnHand[i];
                if(card.i > maxIndex){
                    result.push(i);
                    break;
                }
            }
        }else{
            var seqs = [];
            for(var key in numberMap){
                key = parseInt(key);
                var val = parseInt(numberMap[key]);
                var bool = key>maxIndex;
                if(findTimes==1){
                    if(val==1 && bool)
                        seqs.push(key);
                }else{
                    if(val>=1 && val<4 && bool)
                        seqs.push(key);
                }
            }
            if(seqs.length>0){
                seqs = ArrayUtil.sortNumerically(seqs);
                var number = seqs[0];//拿出第一个
                for(var i=0;i<cardsOnHand.length;i++){
                    var card = cardsOnHand[i];
                    if(card.i == number && result.length==0){
                        result.push(i);
                        break;
                    }
                }
            }else{
                if(findTimes==1)
                    return this._autoSingle(numberMap,cardsOnHand,lastHand,2);
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
    _autoPair:function(numberMap,cardsOnHand,lastHand,findTimes){
        var maxIndex = PDKRoomModel.promptCardPattern ? PDKRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        var seqs = [];
        for(var key in numberMap){
            key = parseInt(key);
            var val = parseInt(numberMap[key]);
            var bool = key>maxIndex;
            if(findTimes==1){
                if(val==2 && bool)
                    seqs.push(key);
            }else{
                if(val>=2 && val<4 && bool)
                    seqs.push(key);
            }
        }
        var result = [];
        if(seqs.length>0){
            var filter = [];
            seqs = ArrayUtil.sortNumerically(seqs);
            for(var i=0;i<seqs.length;i++){
                var seq = seqs[i];
                if(findTimes==1){
                    var last = seq-1;
                    var next = seq+1;
                    if(ArrayUtil.indexOf(seqs,last)<0 && ArrayUtil.indexOf(seqs,next)<0){//排除连对
                        filter.push(seq);
                        break;
                    }
                }else{
                    filter.push(seq);
                    break;
                }
            }
            if(filter.length==0 && findTimes==1)
                return this._autoPair(numberMap,cardsOnHand,lastHand,2);
            if(filter.length>0){
                var number = filter[0];//拿出第一个
                for(var i=0;i<cardsOnHand.length;i++){
                    var card = cardsOnHand[i];
                    if(card.i == number && result.length<2){
                        result.push(i);
                    }
                }
            }
        }else{
            if(findTimes==1)
                return this._autoPair(numberMap,cardsOnHand,lastHand,2);
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
    _autoSequence:function(number,numberMap,cardsOnHand,lastHand){
        var result = [];
        var seqs = [];
        for(var key in numberMap){
            key = parseInt(key);
            if(parseInt(numberMap[key]) >= number){
                seqs.push(key);
            }
        }
        if(seqs.length > 0){
            var maxIndex = PDKRoomModel.promptCardPattern ? PDKRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
            var type = (number==2) ? this.PAIR : this.SHUNZI;
            var sequence = lastHand.length/number;//有几对牌
            var start = maxIndex-sequence+2;//算出最小开始的数字,考虑了连对的情况
            var end = 14;
            for(var i=start;i<=end;i++){
                if((i+sequence-1) <= end){//这里要判断连对是否越界
                    var seqArray = [];
                    for(var j=0;j<sequence;j++){
                        seqArray.push(i+j);
                    }
                    result = this._findShunzi(cardsOnHand,seqArray,type);
                    if(result.length > 0)
                        break;
                }else{
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
    _autoThree:function(numberMap,cardsOnHand,lastHand){
        if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK){
            return this._autoThreeForZZPDK(numberMap,cardsOnHand,lastHand);
        }else{
            return this._autoThreeForPDK(numberMap,cardsOnHand,lastHand);
        }
    },
    _autoThreeForPDK:function(numberMap,cardsOnHand,lastHand){
        var result = [];
        var seqs = [];
        var noSingles = [];
        var maxIndex = PDKRoomModel.promptCardPattern ? PDKRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        for(var key in numberMap){
            key = parseInt(key);
            if(parseInt(numberMap[key]) == 3 && key>maxIndex){
                if (key == 14 && PDKRoomModel.intParams[30] == 1){

                }else{
                    seqs.push(key);
                }
            }
            if(parseInt(numberMap[key]) > 1)
                noSingles.push(key);
        }
        if(seqs.length > 0){
            seqs = ArrayUtil.sortNumerically(seqs);
            var number = seqs[0];//拿出第一个
            for(var i=0;i<cardsOnHand.length;i++){
                var card = cardsOnHand[i];
                if(card.i == number){
                    result.push(i);
                }
            }
            var filterFunc = function(findTimes){
                for(var i=(cardsOnHand.length-1);i>=0;i--){
                    if(ArrayUtil.indexOf(result,i) < 0 && result.length<5){
                        if(findTimes==1){
                            if(ArrayUtil.indexOf(noSingles,cardsOnHand[i].i) < 0){
                                result.push(i);
                            }
                        }else{
                            result.push(i);
                        }
                    }
                }
                if(result.length<5 && findTimes==1){
                    filterFunc(2);
                }
            }
            filterFunc(1);
        }
        return result;
    },
    _autoThreeForZZPDK:function(numberMap,cardsOnHand,lastHand){
        var result = [];
        var seqs = [];
        var noSingles = [];
        var maxIndex = PDKRoomModel.promptCardPattern ? PDKRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        for(var key in numberMap){
            key = parseInt(key);
            if(parseInt(numberMap[key]) == 3 && key>maxIndex){
                if (key == 14 && PDKRoomModel.intParams[30] == 1){

                }else{
                    seqs.push(key);
                }
            }
            if(parseInt(numberMap[key]) > 1)
                noSingles.push(key);
        }
        // cc.log("seqs =",JSON.stringify(seqs));
        // cc.log("noSingles =",JSON.stringify(noSingles));
        if(seqs.length > 0){
            seqs = ArrayUtil.sortNumerically(seqs);
            var number = seqs[0];//拿出第一个
            for(var i=0;i<cardsOnHand.length;i++){
                var card = cardsOnHand[i];
                if(card.i == number){
                    result.push(i);
                }
            }
            var filterFunc = function(findTimes){
                for(var i=(cardsOnHand.length-1);i>=0;i--){
                    if(ArrayUtil.indexOf(result,i) < 0 && result.length<lastHand.length){
                        if(findTimes==1){
                            if(PDKRoomModel.intParams[18] == 0 && PDKRoomModel.intParams[19] == 1){
                                if(!ArrayUtil.indexOf(noSingles,cardsOnHand[i].i) < 0){
                                    result.push(i);
                                }
                            }else{
                                if(ArrayUtil.indexOf(noSingles,cardsOnHand[i].i) < 0){
                                    result.push(i);
                                }
                            }
                            
                        }else{
                            result.push(i);
                        }
                    }
                }
                if(result.length<lastHand.length && findTimes==1){
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
    _autoBomb:function(numberMap,cardsOnHand,lastHand){
        var result = [];
        var seqs = [];
        var maxIndex = 0;
        if(lastHand || PDKRoomModel.promptCardPattern)
            maxIndex = PDKRoomModel.promptCardPattern ? PDKRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        for(var key in numberMap){
            key = parseInt(key);
            if(parseInt(numberMap[key]) >= 4 || (PDKRoomModel.intParams[30] == 1 && key == 14)){
                if(lastHand){
                    if(key>maxIndex)
                        seqs.push(key);
                }else{
                    seqs.push(key);
                }
            }
        }
        if(seqs.length > 0){
            seqs = ArrayUtil.sortNumerically(seqs);
            var number = seqs[0];//拿出第一个
            for(var i=0;i<cardsOnHand.length;i++){
                var card = cardsOnHand[i];
                if(card.i == number){
                    result.push(i);
                }
            }
        }
        return result;
    },


    /**
     * 查找炸弹带牌
     * @param numberMapping {Object}
     * @param cardsOnHand {Array.<CardVo>}
     * @param lastHand {CardPattern}
     * @private
     * 暂时也走炸弹的逻辑
     */
    _autoBombWithCard:function(numberMap,cardsOnHand,lastHand){
        var result = [];
        var seqs = [];
        var maxIndex = 0;
        if(lastHand || PDKRoomModel.promptCardPattern)
            maxIndex = PDKRoomModel.promptCardPattern ? PDKRoomModel.promptCardPattern.maxIndex : lastHand.maxIndex;
        for(var key in numberMap){
            key = parseInt(key);
            if(parseInt(numberMap[key]) >= 4){
                if(lastHand){
                    if(key>maxIndex)
                        seqs.push(key);
                }else{
                    seqs.push(key);
                }
            }
        }
        if(seqs.length > 0){
            seqs = ArrayUtil.sortNumerically(seqs);
            var number = seqs[0];//拿出第一个
            for(var i=0;i<cardsOnHand.length;i++){
                var card = cardsOnHand[i];
                if(card.i == number){
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
    _autoPlane:function(numberMap,cardsOnHand,lastHand){
        var result = [];
        var planeArray = [];
        for(var key in numberMap){
            key = parseInt(key);
            if(parseInt(numberMap[key]) >= 3 && key>lastHand.minIndex){
                planeArray.push(key);
            }
        }
        if(planeArray.length > 0){
            planeArray = ArrayUtil.sortNumerically(planeArray);
            var planeMinCard = 100;
            var planeMaxCard = 0;
            var planeLength = planeArray.length;
            var planeLengthj = planeLength-1;
            var planeCount = 0;
            var realPlaneArray = [];
            for(var i=0;i<planeLength;i++){//这里需要排除JJJQQQ带777的情况
                var next = i+1;
                var cVal = parseInt(planeArray[i]);
                var nVal = parseInt(planeArray[next]);
                if((i<planeLengthj) && Math.abs(cVal-nVal) == 1){
                    planeMinCard = (cVal<planeMinCard) ? cVal : planeMinCard;
                    planeMaxCard = (nVal>planeMaxCard) ? nVal : planeMaxCard;
                    if(ArrayUtil.indexOf(realPlaneArray,cVal)<0)
                        realPlaneArray.push(cVal);
                    if(ArrayUtil.indexOf(realPlaneArray,nVal)<0)
                        realPlaneArray.push(nVal);
                }
            }
            if(planeMinCard<100 && planeMaxCard>0)
                planeCount = planeMaxCard-planeMinCard+1;
            if(planeCount >= lastHand.planeCount){
                realPlaneArray = ArrayUtil.sortNumerically(realPlaneArray);
                var tempMap = {};
                for(var p=0;p<lastHand.planeCount;p++){
                    for(var i=0;i<cardsOnHand.length;i++){
                        var card = cardsOnHand[i];
                        if(card.i == realPlaneArray[p]){
                            if(tempMap[i]){
                                tempMap[i] += 1;
                            }else{
                                tempMap[i] = 1;
                            }
                            if(parseInt(tempMap[i])<=3)
                                result.push(i);
                        }
                    }
                }
                for(var i=(cardsOnHand.length-1);i>=0;i--){//三带二
                    if(ArrayUtil.indexOf(result,i) < 0 && result.length<(lastHand.planeCount*5)){
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
    autoFilter:function(cardsOnHand,lastHand,findTimes){
        findTimes = findTimes || 1;
        if(!lastHand){
            return [cardsOnHand.length-1];
        }else{
            var result = [];
            var type = lastHand.type;
            if(type == this.KING){
                return result;
            }
            var length = cardsOnHand.length;
            var temp = {};
            for(var i=0;i<length;i++){
                var card = cardsOnHand[i];
                if(temp[card.i]){
                    temp[card.i] += 1;
                }else{
                    temp[card.i] = 1;
                }
            }
            // cc.log("temp =",JSON.stringify(temp));
            // cc.log("cardsOnHand =",JSON.stringify(cardsOnHand));
            // cc.log("lastHand =",JSON.stringify(lastHand));
            switch (type){
                case this.SINGLE:
                    result = this._autoSingle(temp,cardsOnHand,lastHand,findTimes);
                    break;
                case this.PAIR:
                    if(lastHand.length==2){//单个对子的提示
                        result = this._autoPair(temp,cardsOnHand,lastHand,findTimes);
                    }else{
                        result = this._autoSequence(2,temp,cardsOnHand,lastHand);
                    }
                    break;
                case this.THREE:
                    result = this._autoThree(temp,cardsOnHand,lastHand);
                    break;
                case this.BOMB:
                    result = this._autoBomb(temp,cardsOnHand,lastHand);
                    break;
                case this.SHUNZI:
                    result = this._autoSequence(1,temp,cardsOnHand,lastHand);
                    break;
                case this.PLANE:
                    result = this._autoPlane(temp,cardsOnHand,lastHand);
                    break;
                case this.BOMBWITHCARD:
                    result = this._autoBombWithCard(temp,cardsOnHand,lastHand);
                    break;
            }
            if(type != this.BOMB && result.length == 0){
                result = this._autoBomb(temp,cardsOnHand);
            }
            return result;
        }
    }
}