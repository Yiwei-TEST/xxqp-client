/**
 * Created by zhoufan on 2016/11/8.
 */
var HBGZPMineLayout = {
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
        var w = 85;
        //if(HBGZPSetModel.zpxz == 2){
            if(HBGZPSetModel.zpdx == 1){
                w = 73*1;
            }else if(HBGZPSetModel.zpdx == 2){
                w = 73 * 1.05;
            }else{
                w = 73 *1.1;
            }
        //}else{
        //    if(HBGZPSetModel.zpdx == 1){
        //        w = 0.8 * 85;
        //    }else if(HBGZPSetModel.zpdx == 2){
        //        w = 0.9 * 85;
        //    }else{
        //        w = 85;
        //    }
        //}
        return w;
    },

    initData:function(ids,root){
        this.cards.length=0;
        this.coords.length=0;
        this.root = root;
        this.curSortedData = null;
        for(var i = 1;i < 10;++i){
            ccui.helper.seekWidgetByName(this.root,"handcard"+i).removeAllChildren(true);
        }
        //root.removeAllChildren(true);
        var voArray = [];//HBGZPAI.getVoArray(ids);
        var jianArr = HBGZPRoomModel.JianArray || [];
        for(var i = 0;i < ids.length;++i){
            var vo = HBGZPAI.getPHZDef(ids[i]);
            if(jianArr && jianArr.length > 0){
                if(jianArr.indexOf(vo.c) !== -1){
                   vo.isJian = 1;
                }
            }
            voArray.push(vo);
        }
        this.display(voArray);
        //var voArray = HBGZPAI.getVoArray(ids);
        //var local = this.getFromLocal(ids);
        //if(local && local.tableId==HBGZPRoomModel.tableId&&local.jushu==HBGZPRoomModel.nowBurCount){
        //	if(local.isSame){
        //        cc.log(" ****+++*******++++****** ");
        //		this.display([],local.voCards);
        //	}else{
        //		this.display(voArray);
        //	}
        //}else{
        //	this.display(voArray);
        //}
    },

    clean:function(){
        this.curSortedData = null;
        this.cards = [];
        this.cards.length=0;
        //if (this.root){
        //    this.root.removeAllChildren(true);
        //}
        if(this.root){
            for(var i = 1;i < 10;++i){
                ccui.helper.seekWidgetByName(this.root,"handcard"+i).removeAllChildren(true);
            }
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


    findIndex:function(nArray){
        for(var i = 0;i < 9;++i){
            if(!this.curSortedData[i] || this.curSortedData[i].length === 0){
                continue;
            }
            for(var j = 0;j < this.curSortedData[i].length;++j){
                if(nArray.indexOf(this.curSortedData[i][j].n) !== -1 && this.curSortedData[i].length < 6){//如果n值相同，优先插入
                    HBGZPRoomModel.lastMoPaiToIndex = i + 1;
                    return;
                }
            }
        }
    },

    handleLongBuZi:function(phzVo,isMostSort){
        //cc.log(" 当前的 this.curSortedData = ",JSON.stringify(this.curSortedData));
        //cc.log(" phzVo = ",JSON.stringify(phzVo));
        HBGZPRoomModel.lastMoPaiToIndex = 0;
        HBGZPRoomModel.lastMoPaiFromIndex = 0;

        if(isMostSort){
            this.findIndex([phzVo.n]);//找相同牌
            if(HBGZPRoomModel.lastMoPaiToIndex === 0){//没找到
                if(specialList[phzVo.n]){//是需要找的牌
                    this.findIndex(specialList[phzVo.n]);
                }
            }
        }

        for(var i = 8;i > 0;--i){
            if(this.curSortedData[i].length < 6){
                var temp = [phzVo];
                ArrayUtil.merge(this.curSortedData[i],temp);
                this.curSortedData[i] = temp.slice(0);
                if(isMostSort){
                    HBGZPRoomModel.lastMoPaiFromIndex = i + 1;
                }
                break;
            }
        }

        this.updateCard();
    },

    saveToLocal:function(cards){
    	var object = {};
    	object.tableId = HBGZPRoomModel.tableId;
    	object.jushu = HBGZPRoomModel.nowBurCount;
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
    	 cc.log("saveToLocal::"+JSON.stringify(object));
    	cc.sys.localStorage.setItem("sy_hbgzp_hand_cards",JSON.stringify(object));
    },

    getFromLocal:function(ids){
        var data = cc.sys.localStorage.getItem("sy_hbgzp_hand_cards");
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
                        var obj = HBGZPAI.getPHZDef(cardA[k]);
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
     * 同列换位置
     * @param vo 选中的牌
     * @param row 第几列
     * @param index 第几张
     */
    changeCardPos:function(vo,row,index){
        cc.log(" 第几张 index = ",index);
        if(this.curSortedData[row - 1] && this.curSortedData[row - 1].length >= 2 && index > -1 && index < 6){//至少两张
            var localIndex = this.findCardVal(vo,this.curSortedData[row - 1]);
            if(localIndex > -1){//找到位置
               this.curSortedData[row - 1] = this.arrayChangePos(localIndex,index,this.curSortedData[row - 1]);//重新赋值
            }
        }
    },

    /**
     * 插入位置
     * @param local
     * @param index
     * @param voArray
     * @returns {Array.<T>|string|Blob|ArrayBuffer|*|{ownProperties}}
     */
    arrayChangePos:function(local,index,voArray){
        var arr = voArray.slice(0);
        var temp = arr[local];
        if(local < index){//从下往上
            for(var i = local;i < index;++i){
                arr[i] = arr[i+1];
            }
            arr[index] = temp;
        }else{//从上往下
            temp = arr[local];
            for(var i = local;i > index;--i){
                arr[i] = arr[i - 1];
            }
            arr[index] = temp;
        }
        return arr;
    },

    findCardVal:function(vo,voArray){//找到下标
        voArray = voArray || [];
        var localIndex = -1;
        for(var i = 0;i < voArray.length;++i){
            if(voArray[i].c === vo.c && voArray[i].n === vo.n){
                localIndex = i;
                break;
            }
        }
        return localIndex;
    },

    /***
     * 插牌处理
     * @param vo
     * @param fromIndex
     * @param toIndex
     */
    insertCard:function(vo,fromIndex,toIndex){
        //cc.log(" 从 fromIndex = ",fromIndex);
        //cc.log(" 到 toIndex = ",toIndex);
        //cc.log(" 找到的节点的位置 this.curSortedData = ",JSON.stringify(this.curSortedData));
        if(this.curSortedData[fromIndex - 1] && this.curSortedData[toIndex - 1]){
            //cc.log(" 当前的牌 vo = ",JSON.stringify(vo));
            var index = -1;//this.curSortedData[fromIndex-1].indexOf(vo);
            for(var i = 0;i < this.curSortedData[fromIndex-1].length;++i){
                if(this.curSortedData[fromIndex-1][i].c == vo.c){
                    index = i;
                    break;
                }
            }
            this.tingTempId = 0;
            this.tingListCard = [];
            if(index !== -1){
                this.curSortedData[fromIndex-1].splice(index,1);

                var iii = 0;
                for(var j=0;j<this.cards.length;j++){//删除当前的牌
                    var card = this.cards[j];
                    if(card.getData().c==vo.c){
                        vo.isTing = card.getData().isTing;
                        this.tingListCard = card._tingList.slice(0);
                        this.tingTempId = vo.c;
                        card.removeFromParent(true);
                        this.cards.splice(j,1);
                        iii = j;
                        break;
                    }
                }

                var temp = [];
                if(this.curSortedData[toIndex-1].length === 0){
                    temp.push(vo);
                }else{
                    //var localInsert = -1;
                    //for(var k = this.curSortedData[toIndex-1].length - 1;k > 0;--k){
                    //    var cardData = this.curSortedData[toIndex-1][k];
                    //    if(vo.sIndex < cardData.sIndex){//找插入位置
                    //        localInsert = k;
                    //    }
                    //}
                    //for(var k = 0;k < this.curSortedData[toIndex-1].length;++k){
                    //    var cardData = this.curSortedData[toIndex-1][k];
                    //    if(temp.indexOf(vo) === -1 && localInsert === k){
                    //        temp.push(vo);
                    //    }
                    //    temp.push(cardData);
                    //}
                    //if(localInsert === -1){
                    //    temp.push(vo);
                    //}
                    var isInsert = false;
                    if(this.curSortedData[toIndex-1].length > 0){
                        for(var k = 0;k < this.curSortedData[toIndex-1].length;++k){
                            var cardData = this.curSortedData[toIndex-1][k];
                            if(!isInsert && temp.indexOf(vo) === -1 && vo.sIndex <= cardData.sIndex){
                                temp.push(vo);
                                isInsert = true;
                            }
                            temp.push(cardData);
                        }
                    }
                    if(!isInsert){
                        temp.push(vo);
                    }
                }
                this.curSortedData[toIndex-1] = temp.slice(0);//替换插入后的值
            }
        }
        this.updateCard();
    },

    updateCard:function(){
        var localY = 333;
        var offY = 110;

        var result = this.curSortedData;

       var count = 0;

        var nowCards = [];
        for(var i=0;i < 9;i++){
            var array = result[i];
            var panel = ccui.helper.seekWidgetByName(this.root,"handcard"+(i+1));
            if(array && array.length > 0){
                for(var j=0;j<array.length;j++){
                    var card = this.getCardByCvalue(array[j].c);
                    var direct = HBGZPAI.getDisplayVo(1,1);
                    if(card){
                        card = this.cards.shift();
                        card.refresh(direct,array[j]);
                        card.setLocalZOrder(j);
                    }else{
                        card = new HBGZPCard(direct,array[j]);
                        panel.addChild(card,j);
                        if(array[j].c === this.tingTempId && HBGZPRoomModel.nextSeat == HBGZPRoomModel.mySeat){
                            card.displayTingArrows(this.tingListCard.slice(0));
                            this.tingListCard = [];
                            this.tingTempId = 0;
                        }
                    }
                    card.x = 69 - card.width / 2;
                    if(array.length > 4){//超过四张
                        card.y = localY - offY * (4 / array.length) * j;
                    }else{
                        card.y = localY - offY * (4 - array.length + j);
                    }
                    card.initCoord();
                    card.setCardIndex(i + 1);
                    nowCards.push(card);
                    ++count;
                }
            }
            this.coords.push({x:panel.x,y:panel.y,i:i + 1});
        }
        this.cards = nowCards;
    },

    displayCards:function(voArray,sortedData,isReDisPlay){
        this.cardOffY = 86;
        this.bgStartY = -40;
        var result = sortedData ? sortedData : this.curSortedData;
        if(!result){
            result = HBGZPAI.sortHandsByHxVo(voArray);
            this.curSortedData = [];
            for(var i = 0;i < 9;++i){//确保是九列数据
                if(result[i] && result[i].length > 0){
                    this.curSortedData.push(result[i]);
                }else{
                    this.curSortedData.push([]);
                }
            }
            if(result.length > 9){
                while(result.length > 9){
                    var resultLen = result.length - 1;
                    var len = this.curSortedData.length - 1;
                    ArrayUtil.merge(result[resultLen],this.curSortedData[len]);
                    result.splice(resultLen,1);
                }
            }
        }

        //this.curSortedData = result;
        //cc.log(" 开始游戏的 this.curSortedData = ",JSON.stringify(this.curSortedData));

        //this.curSortedData = result;
        this.saveToLocal(this.curSortedData);
        var winSize = cc.director.getWinSize();
        var w = this.getCardOffX();
        var initX = (winSize.width - w*result.length)/2;
        var count = 0;
        this.coords.length=0;
        var nowCards = this.cards.length;
        //cc.log("this.curSortedData.......  ",JSON.stringify(this.curSortedData));

        var localY = 333;//222;
        var offY = 110;//73;
        for(var i=0;i < 9;i++){
            var array = result[i];
            var panel = ccui.helper.seekWidgetByName(this.root,"handcard"+(i+1));
            if(array && array.length > 0){
                for(var j=0;j<array.length;j++){
                    var card = null;
                    if(count<nowCards){
                        card = this.cards.shift();
                        card.refresh(HBGZPAI.getDisplayVo(1,1),array[j]);
                        card.setLocalZOrder(j);
                    }else{
                        card = new HBGZPCard(HBGZPAI.getDisplayVo(1,1),array[j]);
                        panel.addChild(card,j);
                    }
                    card.x = 69 - card.width / 2;
                    if(array.length > 4){
                        card.y = localY - offY * j * (4 / array.length);
                    }else{
                        card.y = localY - offY * (4 - array.length + j);
                    }
                    if(isReDisPlay) {
                        this.moveCardAni(card, initX, w, i, j);
                    }else {
                        card.initCoord();
                        card.setCardIndex(i + 1);
                    }
                    this.cards.push(card);
                }
            }
            this.coords.push({x:panel.x,y:panel.y,i:i + 1});
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


    getCurVoArray:function(){
        var voArray = [];
        for(var i=0;i<this.cards.length;i++){
            voArray.push(this.cards[i].getData());
        }
        return voArray;
    },

    onCardsort:function(){
        cc.log("点击手牌排序");
        var voArray = [];
        voArray = this.getCurVoArray();
        this.clean();
        this.display(voArray);
    },

    changeHandCardTextrue:function(){
        cc.log("changeHandCardTextrue");
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


    ///**
    // * 用于放招时还原手牌
    // * @param curSortedData
    // */
    //restoreCard:function(curSortedData){
    //    curSortedData = JSON.parse(curSortedData);
    //    this.display([],curSortedData);
    //},

    /**
     * 补回一张卡牌
     */
    addOne:function(id){
        var isHas = false;
        for(var i=0;i<this.cards.length;i++){
            var card = this.cards[i];
            if(card.getData().c == id){
                cc.log("这张牌前段还存在 不用补回");
                isHas = true;
            }
        }
        //cc.log("addOne..." , id);
        //this.curSortedData.push([HBGZPAI.getPHZDef(id)]);//异常情况 直接补在单独一列
        //this.display([],this.curSortedData,true);
        if(!isHas){//如果没找到，补一张
            var vo = HBGZPAI.getPHZDef(id);
            vo.isJian = HBGZPRoomModel.JianArray.indexOf(id) !== -1 ? 1 : 0;
            this.handleLongBuZi(vo);
        }
    },

    delCards:function(voArray) {
        //cc.log(" 进来删除牌 ", JSON.stringify(voArray));
        for(var i=0;i<voArray.length;i++){
            for(var j=0;j<this.cards.length;j++){
                var card = this.cards[j];
                if(card.getData().c==voArray[i].c){
                    //cc.log(" 找到删除节点 ",j);
                    card.removeFromParent(true);
                    this.cards.splice(j,1);
                    break;
                }
            }
        }

        for(var i=0;i<voArray.length;i++){
            for(var j=0;j<this.curSortedData.length;j++){
                for(var k = 0;k < this.curSortedData[j].length;){
                    if(this.curSortedData[j][k].c == voArray[i].c){
                        //cc.log(" 找到删除牌值 ",j);
                        this.curSortedData[j].splice(k,1);
                    }else{
                        ++k;
                    }
                }
            }
        }

        this.updateCard();
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

    clearTingPai:function(){
        for(var i=0;i<this.cards.length;i++){
            var mahjongs = this.cards[i];
            mahjongs.showTingImg(false);
        }
    },

    outCardTingPai:function(info){
        var pushOutArray = info || [];
        //cc.log(" 打牌听牌 pushOutArray =",JSON.stringify(pushOutArray));
        var cards = [];
        for(var i=0;i<this.cards.length;i++){
            var mahjongs = this.cards[i];
            var curVo = mahjongs.getData();
            for(var j=0;j < pushOutArray.length; j++){
                var tempArr = pushOutArray[j].tingMajiangIds.slice(0);
                if (pushOutArray[j].majiangId && curVo.v == pushOutArray[j].majiangId && !curVo.hua){
                    cards.push(curVo.n);
                    mahjongs.displayTingArrows(tempArr);
                }else if(pushOutArray[j].majiangId < 0 && pushOutArray[j].majiangId && curVo.v == -pushOutArray[j].majiangId && curVo.hua){
                    cards.push(pushOutArray[j].majiangId);
                    mahjongs.displayTingArrows(tempArr);
                }
            }
        }
        if(cards.length > 0){
            this.saveCurrData(cards);
        }
    },

    saveCurrData:function(cards){
         for(var i = 0;i < this.curSortedData.length;++i){
             for(var j = 0;j < this.curSortedData[i].length;++j){
                 if(this.curSortedData[i][j].hua){
                     this.curSortedData[i][j].isTing = cards.indexOf(-this.curSortedData[i][j].n) !== -1;
                 }else{
                     this.curSortedData[i][j].isTing = cards.indexOf(this.curSortedData[i][j].n) !== -1;
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