/**
 * Created by Administrator on 2020/4/18.
 */
var DYBPMineLayout = {
    root:null,
    cards:[],
    coords:[],
    curSortedData:null,
    cardOffX:98,
    //cardOffY:78,
    cardOffY:96,
    bgStartY:-18,

    setRoot:function(root){
        this.root = root;
    },

    getCardOffX:function(){
        var w = PHZSetModel.zpdx == 1 ? 114 : 132; //75
        // if (PHZSetModel.zpdx == 3 || PHZSetModel.zpdx == 4){
        w = w *1.25;
        // }
        // var w = PHZSetModel.zpdx == 1?75 * 1.2:87 * 1.25; //75

        return w
    },

    initData:function(ids,root){
        this.cards.length=0;
        this.coords.length=0;
        this.root = root;
        this.curSortedData = null;
        root.removeAllChildren(true);
        var voArray = [];
        for(var i=0;i<ids.length;i++){
            voArray.push(PHZAI.getPHZDef(ids[i]));
        }
        var local = this.getFromLocal(ids);
        if(local && local.tableId==PHZRoomModel.tableId&&local.jushu==PHZRoomModel.nowBurCount){
            if(local.isSame){
                this.display([],local.voCards);
            }else{
                this.display(voArray);
            }
        }else{
            this.display(voArray);
        }
    },

    clean:function(){
        this.curSortedData = null;
        this.cards = [];
        this.cards.length=0;
        if (this.root){
            this.root.removeAllChildren(true);
        }
    },

    reSortAndDisplay:function(phzVo,toIndex,isInsert,toIndexOfY){
        var fromArray = null;
        var fromIndex = -1;
        var toIndexOfY = toIndexOfY || 0;
        for(var i=0;i<this.curSortedData.length;i++){
            var sortedData = this.curSortedData[i];
            for(var j=0;j<sortedData.length;j++){
                if(sortedData[j].c==phzVo.c){
                    fromIndex = i;
                    fromArray = sortedData;
                    break;
                }
            }
        }
        if(fromArray){
            var del = -1;
            for(var i=0;i<fromArray.length;i++){
                if(fromArray[i].c==phzVo.c){
                    del = i;
                    break;
                }
            }
            if(del>=0)
                fromArray.splice(del,1);
            if(toIndex>=0){
                if(isInsert){
                    this.curSortedData = this.inSertArray(this.curSortedData,toIndex,[phzVo]);
                }else{
                    if(toIndexOfY > 0){
                        this.curSortedData[toIndex].splice(toIndexOfY , 0 , phzVo);
                    }else{
                        this.curSortedData[toIndex].push(phzVo);//这里默认是插入到这一列的最上面的位置 优化为插入到具体的位置
                    }
                }
            }
            if(fromArray.length==0){
                if(toIndex<fromIndex && isInsert){
                    this.curSortedData.splice((fromIndex+1),1);
                }else{
                    this.curSortedData.splice(fromIndex,1);
                }
            }
            if(toIndex==-1)//往数组最后一位添加
                this.curSortedData.push([phzVo]);
            if(toIndex==-2)
                this.curSortedData.unshift([phzVo]);
            //this.display([],this.curSortedData);
        }
    },


    /**
     * 获取一张卡牌
     */
    getCardByCvalue:function(cValue){
        if(cValue == null){
            cc.log("getCardByCvalue param error!" , cValue);
        }

        for(var index = 0 ; index < this.cards.length ; index++){
            var tCard = this.cards[index];
            if(tCard.getData().c == cValue){
                return tCard;
            }
        }
        return null;

    },

    /**
     * createCopyOne
     */

    reSetCardPos:function(){
        var result = this.curSortedData;
        this.saveToLocal(this.curSortedData);
        var winSize = cc.director.getWinSize();
        var w = this.getCardOffX();
        var initX = (winSize.width - w*result.length)/2;

        var count = 0;
        this.coords.length=0;
        var tMyCardNode = null;
        var hasCardDoAnimation = false;
        var newCardlist = [];
        var needFixPosCardList = [];
        for(var i=0;i<result.length;i++){
            var array = result[i];
            var zorder = array.length;
            var tCurcount = array.length;
            var tcardList = [];//这一列card
            for(var j=0;j<array.length;j++){
                tcardList = [];
                var expectPosX = initX+i*w;
                var expectPosY = this.bgStartY+j*this.cardOffY;
                tMyCardNode = this.getCardByCvalue(array[j].c);
                if(tMyCardNode){
                    newCardlist.push(tMyCardNode);
                    tcardList.push(tMyCardNode);
                    tMyCardNode.realX = expectPosX;
                    tMyCardNode.realY = expectPosY;
                    tMyCardNode.realZorder = zorder;
                    tMyCardNode.realIndexX = i;//第几列
                    if(tMyCardNode.x != expectPosX || tMyCardNode.y != expectPosY){
                        hasCardDoAnimation = true;
                        needFixPosCardList.push(tMyCardNode);
                    }else{
                        tMyCardNode.initCoord();
                        tMyCardNode.setCardIndex(i);
                        tMyCardNode.setLocalZOrder(zorder);
                    }
                }
                count++;
                zorder--;
            }
            this.coords.push({x:tMyCardNode.realX,y:tMyCardNode.realY,i:i,count:tCurcount,cardList:tcardList});
        }

        //if(needFixPosCardList.length == 0){//没有卡牌需要执行动作
        //    if(PHZMineLayout.isLocked()){
        //        PHZMineLayout.unlockCard();
        //    }
        //}

        //刷新需要修正位置的node
        for(var index = 0 ; index < needFixPosCardList.length; index++){
            var fixPosNode = needFixPosCardList[index];
            fixPosNode.isLastOne = (index == (needFixPosCardList.length - 1));
            fixPosNode.stopAllActions();
            this.fixCardAni(fixPosNode);
            //fixPosNode.runAction(cc.sequence(cc.moveTo(0.15 , fixPosNode.realX , fixPosNode.realY),cc.callFunc(function(target){
            //    target.initCoord();
            //    target.setCardIndex(target.realIndexX);
            //    target.setLocalZOrder(target.realZorder);
            //    if(target.isLastOne){//最后一个卡牌移动完动作 则放开操作锁
            //        //if(PHZMineLayout.isLocked()){
            //        //    PHZMineLayout.unlockCard();
            //        //}
            //    }
            //})));
        }
        //要重新刷新this.cards 否则下次display的时候就蜜汁刷新了。
        this.cards = newCardlist;
    },

    fixCardAni:function(fixPosNode){
        fixPosNode.runAction(cc.sequence(cc.moveTo(0.15 , fixPosNode.realX , fixPosNode.realY),cc.callFunc(function(target){
            target.initCoord();
            target.setCardIndex(target.realIndexX);
            target.setLocalZOrder(target.realZorder);
            if(target.isLastOne){//最后一个卡牌移动完动作 则放开操作锁
                //if(PHZMineLayout.isLocked()){
                //    PHZMineLayout.unlockCard();
                //}
            }
        })));
    },

    /**
     * 插入位置
     * @param replaceArray
     * @param fromIndex
     * @param toIndex
     */
    inSertArray:function(replaceArray,Index,array){
        var arrayIndexBefore = [];
        var arrayIndexAfter = [];
        for(var i=0;i<replaceArray.length;i++){
            if(i<=Index){
                arrayIndexBefore.push(replaceArray[i]);
            }else{
                arrayIndexAfter.push(replaceArray[i]);
            }
        }
        arrayIndexBefore.push(array);
        return ArrayUtil.merge(arrayIndexAfter, arrayIndexBefore);
    },

    handleLongBuZi:function(phzVo){
        this.curSortedData.push([phzVo]);
        var dataVo = [];
        var len = this.curSortedData.length;
        for(var i=0;i<len;i++){
            var vo = this.curSortedData[i];
            for(var j=0;j<vo.length;j++){
                dataVo.push(vo[j]);
            }
        }
        this.curSortedData = PHZAI.sortHandsVo(dataVo);
        this.display([],this.curSortedData);
    },

    saveToLocal:function(cards){
        var object = {};
        object.tableId = PHZRoomModel.tableId;
        object.jushu = PHZRoomModel.nowBurCount;
        var transCards = [];
        var sameIndexArray = [];
        for(var i=0;i<cards.length;i++){
            var innerArray = cards[i];
            var temp = [];
            for(var j=0;j<innerArray.length;j++){
                var card = innerArray[j];
                temp.push(card.c);
                if(card.same==1)
                    sameIndexArray.push(card.c);
            }
            transCards.push(temp);
        }
        object.cards = transCards;
        object.sames = sameIndexArray;
        // cc.log("saveToLocal::"+JSON.stringify(object));
        cc.sys.localStorage.setItem("sy_phz_hand_cards",JSON.stringify(object));
    },

    getFromLocal:function(ids){
        var data = cc.sys.localStorage.getItem("sy_phz_hand_cards");
        if(data){
            try{
                data = JSON.parse(data);
                var cards = data.cards;
                var sames = data.sames;
                var voCards = [];
                var localLen = 0;
                var cardLen = 0;
                for(var i=0;i<cards.length;i++){
                    var cardA = cards[i];
                    var cardB = [];
                    cardLen+=cardA.length;
                    for(var k=0;k<cardA.length;k++){
                        var obj = PHZAI.getPHZDef(cardA[k])
                        if(ArrayUtil.indexOf(sames,cardA[k])>-1){
                            obj.same = 1;
                        }
                        cardB.push(obj);
                        if(ArrayUtil.indexOf(ids,cardA[k])>=0)
                            localLen++;
                    }
                    voCards.push(cardB);
                }
                data.voCards = voCards;
                data.isSame = (cardLen==ids.length && localLen==ids.length);
            }catch(e){
                data = null;
            }
        }
        return data;
    },

    /**
     *
     * @param voArray {Array<PHZVo>}
     */
    display:function(voArray,sortedData,isReDisPlay){
        // if (PHZSetModel.zpdx == 4){
        //     this.cardOffY = 96;
        //     this.bgStartY = -10;
        // }else{
        //     this.cardOffY = 78;
        //     this.bgStartY = -18;
        // }
        this.cardOffY = 140;
        this.bgStartY = -10;
        if (PHZSetModel.iscp == 1){
            this.cardOffY = this.cardOffY + 10;
        }

        var result = sortedData ? sortedData : this.curSortedData;
        if(!result){
            // if (PHZRoomModel.sortCardWay == 1){
            //     result = PHZAI.sortHandsByHxVo(voArray);
            // }else{
            result = PHZAI.sortHandsVo(voArray);
            // }
        }

        this.curSortedData = result;
        // cc.log("this.curSortedData =",JSON.stringify(this.curSortedData));
        this.saveToLocal(this.curSortedData);
        var winSize = cc.director.getWinSize();
        //var w = PHZSetModel.zpdx == 1 ? 87 : 75; //75
        var w = this.getCardOffX();
        //var offheight = 78; //68
        var initX = (winSize.width - w*result.length)/2;
        var count = 0;
        this.coords.length=0;
        var nowCards = this.cards.length;
        //cc.log("this.curSortedData.......  ",JSON.stringify(this.curSortedData));
        for(var i=0;i<result.length;i++){
            var array = result[i];
            var zorder = array.length;
            for(var j=0;j<array.length;j++){
                var card = null;
                // cc.log("array[j]==="+JSON.stringify(array[j]))
                if(count<nowCards){
                    card = this.cards.shift();
                    card.refresh(PHZAI.getDisplayVo(1,1),array[j]);
                    card.setLocalZOrder(zorder);
                }else{
                    card = new DYBPCard(PHZAI.getDisplayVo(1,1),array[j]);
                    this.root.addChild(card,zorder);
                }

                if (PHZRoomModel.sxSeat == PHZRoomModel.mySeat){
                    card.graySmallCard();
                }
                if(isReDisPlay){
                    this.moveCardAni(card,initX,w,i,j);
                    //card.stopAllActions();
                    //card.runAction(cc.sequence(cc.moveTo(0.15 , initX+i*w , -18+j*this.cardOffY),cc.callFunc(function(target,data){
                    //    target.initCoord();
                    //    target.setCardIndex(i);
                    //})));
                }else{
                    //card.stopAllActions();
                    card.realX = initX+i*w;
                    card.x = initX+i*w;
                    //card.y = -18+j*this.cardOffY;
                    card.y = this.bgStartY+j*this.cardOffY;
                    card.initCoord();
                    card.setCardIndex(i);
                }

                this.cards.push(card);
                //card.initCoord();
                //card.setScale(0.90);
                count++;
                zorder--;
            }
            this.coords.push({x:initX+i*w,y:this.bgStartY+j*this.cardOffY,i:i});
        }
    },

    //特殊处理 防止i不是当前的i
    moveCardAni:function(card,initX,w,i,j){
        card.stopAllActions();
        card.runAction(cc.sequence(cc.moveTo(0.15 , initX+i*w , this.bgStartY+j*this.cardOffY),cc.callFunc(function(target,data){
            target.initCoord();
            target.setCardIndex(i);
        })));
    },


    getCurVoArray:function(){
        var voArray = [];
        for(var i=0;i<this.cards.length;i++){
            voArray.push(this.cards[i].getData());
        }
        return voArray;
    },

    onCardsort:function(){
        cc.log("点击手牌排序")
        var voArray = [];
        voArray = this.getCurVoArray();
        this.clean();
        this.display(voArray);
    },

    changeHandCardTextrue:function(){
        cc.log("changeHandCardTextrue")
        for(var i=0;i<this.cards.length;i++){
            if (this.cards[i]){
                this.cards[i].refreshCardByOpenTex();
            }
        }
    },
    changeHandCardBg:function(){
        for(var i=0;i<this.cards.length;i++){
            if (this.cards[i]){
                this.cards[i].refreshCardBgByOpenTex();
            }
        }
    },
    setCardOffY:function(){
        // cc.log("点击手牌排序")
        var voArray = [];
        voArray = this.getCurVoArray();
        this.clean();
        this.display(voArray);
    },
    changeHandCardSize:function(){
        var voArray = [];
        voArray = this.getCurVoArray();
        this.clean();
        this.display(voArray);
        cc.log("changeHandCardSize")
    },


    /**
     * 用于放招时还原手牌
     * @param curSortedData
     */
    restoreCard:function(curSortedData){
        curSortedData = JSON.parse(curSortedData);
        this.display([],curSortedData);
    },

    /**
     * 补回一张卡牌
     */
    addOne:function(id){
        for(var i=0;i<this.cards.length;i++){
            var card = this.cards[i];
            if(card.getData().c == id){
                cc.log("这张牌前段还存在 不用补回");
                //return;
            }
        }
        cc.log("addOne..." , id);
        this.curSortedData.push([PHZAI.getPHZDef(id)]);//异常情况 直接补在单独一列
        this.display([],this.curSortedData,true);
    },

    /**
     * 移除一张牌
     * @param vo 单张牌的数据vo
     * @param needDisplay 是否刷新显示层，删除单个时，一般传入true，批量删除时，在删除最后一张牌时再传入true，一次性刷新显示层，节省性能
     */
    delOne:function(vo,needDisplay,isZaiPao){
        //cc.log("needDisplay.. ",needDisplay);
        var del = -1;
        for(var i=0;i<this.cards.length;i++){
            var card = this.cards[i];
            if(card.getData().c==vo.c){
                del = i;
                card.removeFromParent(true);
                break;
            }
        }
        //cc.log("delOne.. this.curSortedData.......  ",JSON.stringify(this.curSortedData));
        if(del>=0){
            this.cards.splice(del,1);
            sortedLoop:for(var i=0;i<this.curSortedData.length;i++){
                var array = this.curSortedData[i];
                var index = -1;
                innerLoop:for(var j=0;j<array.length;j++){
                    if(array[j].c==vo.c){
                        index = j;
                        break innerLoop;
                    }
                }
                if(index>=0){
                    array.splice(index,1);
                    if(array.length==0)
                        this.curSortedData.splice(i,1);
                    if(needDisplay || isZaiPao)
                        this.display([],this.curSortedData,true);
                    break sortedLoop;
                }
            }
        }
    },
    //获取手牌数据
    getHandCardData:function(){
        return this.curSortedData
    },

    CardsChangeGray:function(params){
        // cc.log("params =",params);
        // var data = JSON.parse(params);
        for (var i = 0; i < params.length; i++) {
            for(var index = 0 ; index < this.cards.length ; index++){
                var tCard = this.cards[index];
                // cc.log("tCard.getData().c =,params[i] =",tCard.getData().c,params[i]);
                if(tCard.getData().c == params[i]){
                    tCard.setGrayColor();
                }
            }
        }
    },

    outCardTingPai:function(info){
        var pushOutArray = info || [];
        // cc.log("pushOutArray =",JSON.stringify(pushOutArray));
        for(var i=0;i<this.cards.length;i++){
            var mahjongs = this.cards[i];
            var curVo = mahjongs.getData();
            for(var j=0;j < pushOutArray.length; j++){
                if (pushOutArray[j].majiangId && curVo.c == pushOutArray[j].majiangId){
                    mahjongs.displayTingArrows(pushOutArray[j].tingMajiangIds);
                }
            }
        }
    },

    isHasHardCard:function(id){
        if (id){
            for(var i=0;i<this.cards.length;i++){
                var card = this.cards[i];
                //cc.log("isHasHardCard=========",card.getData().c,id)
                if(card.getData().c == id){
                    return true;
                }
            }
        }
        return false;
    }
}