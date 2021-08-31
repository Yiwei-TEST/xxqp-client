/**
 * Created by Administrator on 2020/3/17.
 */
var YZLCMineLayout = {
    root:null,
    cards:[],
    coords:[],
    curSortedData:null,
    cardOffX:98,
    //cardOffY:78,
    cardOffY:96,
    bgStartY:0,//-18,
    localStartPos:null,

    setRoot:function(root){
        this.root = root;
        this.root.setTouchEnabled(true);
        this.root.height = 750;
        this.root.y = 3;
        this.root.addTouchEventListener(this.onTouchHandler,this.root);
    },

    onTouchHandler:function(obj,type){
        var isMyTurn = PHZRoomModel.timeSeat==PHZRoomModel.mySeat;
        if(!isMyTurn){
            return;
        }
        if(type == ccui.Widget.TOUCH_BEGAN){
            var locationInNode = this.getTouchBeganPosition();
            //cc.log(" 点击的位置！！！！ ",JSON.stringify(locationInNode));
            YZLCMineLayout.localStartPos = locationInNode;
            YZLCMineLayout.getCardByPos();
        }else if(type == ccui.Widget.TOUCH_MOVED){
            var endPos = this.getTouchMovePosition();
            //cc.log(" 移动的位置！！！！ ",JSON.stringify(endPos));
            YZLCMineLayout.getCardByPos(endPos);
        }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
        }
    },

    getCardOffX:function(){
        var w = PHZSetModel.zpdx == 1 ? 114 : 132;
        if (PHZSetModel.zpdx == 3 || PHZSetModel.zpdx == 4 ){
            w = w *1.1;
        }
        return w;
    },

    getCardOffXForYZCHZ:function(){
        // cc.log("cc.winSize.width/1280 =",cc.winSize.width/1280 + 0.05*cc.winSize.width/1280);
        var w = PHZSetModel.zpdx == 1 ? 75.5 : 87; //75
        if (PHZSetModel.zpdx == 3 || PHZSetModel.zpdx == 4 ){
            w = w * (cc.winSize.width/1280 +0.06*(cc.winSize.width/1280));
        }
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

        //刷新需要修正位置的node
        for(var index = 0 ; index < needFixPosCardList.length; index++){
            var fixPosNode = needFixPosCardList[index];
            fixPosNode.isLastOne = (index == (needFixPosCardList.length - 1));
            fixPosNode.stopAllActions();
            this.fixCardAni(fixPosNode);
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
        //this.curSortedData = PHZAI.sortHandsVo(dataVo);
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
                /***  去掉一坎牌的置灰 ***/
                //if(card.same==1)
                //    sameIndexArray.push(card.c);
            }
            transCards.push(temp);
        }
        object.cards = transCards;
        object.sames = sameIndexArray;
        cc.log("saveToLocal::"+JSON.stringify(object));
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
                        if(ArrayUtil.indexOf(sames,cardA[k])>-1){/***  去掉一坎牌的置灰 ***/
                            //obj.same = 1;
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


    displayCards:function(voArray,sortedData,isReDisPlay){
        if (PHZSetModel.zpdx == 4){
            this.cardOffY = 118;
            this.bgStartY = 8;//-10;
        }else{
            this.cardOffY = 110;
            this.bgStartY = 0;//-18;
        }
        if (PHZSetModel.iscp == 1){
            this.cardOffY = this.cardOffY + 10;
        }
        var result = sortedData ? sortedData : this.curSortedData;
        if(!result){
            result = PHZAI.yzlcSortHandsVo(voArray);
        }
        this.curSortedData = result;
        this.saveToLocal(this.curSortedData);
        var winSize = cc.director.getWinSize();
        var w = this.getCardOffX();

        var initX = (winSize.width - w*result.length)/2;
        var count = 0;
        this.coords.length=0;
        var nowCards = this.cards.length;
        for(var i=0;i<result.length;i++){
            var array = result[i];
            var zorder = array.length;
            for(var j=0;j<array.length;j++){
                var card = null;
                if(count<nowCards){
                    card = this.cards.shift();
                    card.refresh(PHZAI.getDisplayVo(1,1),array[j]);
                    card.setLocalZOrder(zorder);
                }else{
                    card = new YZLCCard(PHZAI.getDisplayVo(1,1),array[j]);
                    this.root.addChild(card,zorder);
                }

                if (PHZRoomModel.sxSeat == PHZRoomModel.mySeat){
                    card.graySmallCard();
                }
                if(isReDisPlay){
                    this.moveCardAni(card,initX,w,i,j);
                }else{
                    card.realX = initX+i*w;
                    card.x = initX+i*w;
                    card.y = this.bgStartY+j*this.cardOffY;
                    card.initCoord();
                    card.setCardIndex(i);
                }

                this.cards.push(card);
                count++;
                zorder--;
            }
            this.coords.push({x:initX+i*w,y:this.bgStartY+j*this.cardOffY,i:i});
        }
        //cc.log(" 所有牌的位置！！！ ",JSON.stringify(this.coords));
    },

    getCardByPos:function(endPos){
        var needCards = [];
        var pos = this.localStartPos;
         if(pos){
             //cc.log(" pos = ",JSON.stringify(pos));
             //cc.log(" endPos = ",JSON.stringify(endPos));
             var initY = 110;
             if (PHZSetModel.zpdx == 4){
                 initY = 118;
             }
             if (PHZSetModel.iscp == 1){
                 initY = initY + 10;
             }
             var initX = this.getCardOffX();

             var minX = pos.x;
             var maxX = 0;
             var minY = pos.y;
             var maxY = 0;
             if(endPos){
                 minX = Math.min(pos.x,endPos.x);
                 maxX = Math.max(pos.x,endPos.x);
                 minY = Math.min(pos.y,endPos.y);
                 maxY = Math.max(pos.y,endPos.y);

                 if(maxY - minY < initY - 30){//滑动小于一张牌,结束
                      return;
                 }
             }

             //cc.log(" minX = ",minX);
             //cc.log(" maxX = ",maxX);

             for(var i = 0;i < this.cards.length;++i){
                 //cc.log(" this.cards[i].x = ",this.cards[i].x);
                 //cc.log(" this.cards[i].y = ",this.cards[i].y);
                 //cc.log(" this.cards[i].width = ",this.cards[i].width);
                 //cc.log(" this.cards[i].height = ",this.cards[i].height);
                 var scale = this.cards[i].scale;
                 if(!endPos){
                     if(this.cards[i].x <= pos.x && (this.cards[i].x + initX * scale > pos.x)){//先找列
                         needCards.push(this.cards[i]);
                         //this.cards[i].setSelected(true);
                         //ids.push(i);
                     }
                 }else{
                     //if(!(this.cards[i].x > maxX || (this.cards[i].x + initX * scale < minX))){//先找列
                     if(this.cards[i].x <= maxX && (this.cards[i].x + initX * scale > maxX)
                     &&(this.cards[i].x <= minX && (this.cards[i].x + initX * scale > minX))){
                         needCards.push(this.cards[i]);
                         this.cards[i].setSelected(true);
                         //ids.push(i);
                     }
                     //else{
                     //    this.cards[i].setSelected(false);
                     //}
                 }
             }
             //cc.log(" needCards.length = ",needCards.length);

             for(var i = 0;i < needCards.length;++i){
                 var isBool = needCards[i].getSelected();
                 var scale = needCards[i].scale;
                 var height = needCards[i].height;
                 if(endPos){
                     if(i === 0){
                         if(!(needCards[i].y + height * scale < minY || needCards[i].y > maxY)){
                             needCards[i].setSelected(true);
                         }else{
                             needCards[i].setSelected(false);
                         }
                     }else{
                         if(!(needCards[i - 1].y + height * scale > maxY || needCards[i].y + height * scale < minY)){
                             needCards[i].setSelected(true);
                         }else{
                             needCards[i].setSelected(false);
                         }
                     }
                 }else{
                     if(i === 0){
                         if(needCards[i].y <= pos.y && (needCards[i].y + height * scale > pos.y)){
                             needCards[i].setSelected(!isBool);
                         }
                     }else{
                         if(needCards[i - 1].y + height * scale <= pos.y && (needCards[i].y + height * scale > pos.y)){
                             needCards[i].setSelected(!isBool);
                         }
                     }
                 }
             }
         }
    },

    /**
     *
     * @param voArray {Array<PHZVo>}
     */
    display:function(voArray,sortedData,isReDisPlay){
        this.displayCards(voArray,sortedData,isReDisPlay);
    },

    //特殊处理 防止i不是当前的i
    moveCardAni:function(card,initX,w,i,j){
        card.stopAllActions();
        card.runAction(cc.sequence(cc.moveTo(0.05, initX+i*w , this.bgStartY+j*this.cardOffY),cc.callFunc(function(target,data){
            target.initCoord();
            target.setCardIndex(i);
        })));
    },

    getSelectList:function(){
        var cArray = [];
        for(var i=0;i<this.cards.length;i++){
            if(this.cards[i].getSelected()){
                var data = this.cards[i].getData();
                cArray.push(data.c);
            }
        }
        return cArray;
    },

    initSelectList:function(){
        for(var i=0;i<this.cards.length;i++){
            this.cards[i].setSelected(false);
        }
    },

    setSelectList:function(ids){
        this.initSelectList();
        ids = ids || [];
        if(ids.length === 0){
            return;
        }
        for(var i=0;i<this.cards.length;i++){
            var temp = this.cards[i].getData();
            if(ids.indexOf(temp.c) !== -1){
                this.cards[i].setSelected(true);
            }
        }
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
        cc.log("changeHandCardTextrue")
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

    ChiBianChangeCards:function(params,type){
        // cc.log("params =",params);
        // var data = JSON.parse(params);
        for (var i = 0; i < params.length; i++) {
            for(var index = 0 ; index < this.cards.length ; index++){
                var tCard = this.cards[index];
                // cc.log("tCard.getData().c =,params[i] =",tCard.getData().c,params[i]);
                if(tCard.getData().c == params[i]){
                    if (type == 2){
                        tCard.setGrayColor();
                    }else if(type == 1){
                        tCard.setNormalColor();
                    }
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