/**
 * Created by cyp on 2019/11/13.
 */
var TCGDCardLayer = cc.Layer.extend({
    tipIdx:0,//提示开始选择下标
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("TCGD_TIP_CARD",this,this.playCardTishi);

        this.myHandCardArr = [];
        this.outCardArr = [];
        for(var i = 0;i<4;++i){
            this.outCardArr[i] = [];
        }
        this.otherHandCardArr = [];
        for(var i = 0;i<4;++i){
            this.otherHandCardArr[i] = [];
        }
        this.touchCardArr = [];
        this.selectCardArr = [];

        this.tiQuHandIds = [];//保存提取的手牌牌,二维数组
        this.norHandIds = [];//保存未被提取的牌

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:this.onTouchBegan.bind(this),
            onTouchMoved:this.onTouchMoved.bind(this),
            onTouchEnded:this.onTouchEnded.bind(this),
            onTouchCancelled:this.onTouchCancelled.bind(this)
        }),this);

        this.initLayer();

    },

    cleanAllCards:function(){
        if(!this.isPlayDealCardAni){
            this.clearCardWithArr(this.myHandCardArr);
        }
        for(var i = 0;i<4;++i){
            this.clearCardWithArr(this.otherHandCardArr[i]);
        }
        for(var i = 0;i<4;++i){
            this.clearCardWithArr(this.outCardArr[i]);
        }
    },

    handleTableData:function(type,data){
        if(type == TCGDTabelType.CreateTable){

            this.cleanAllCards();
            this.showTeamCardTip(false);
            this.allTipsData = null;

            if(this.removeOutTime){//重连消息，清理掉，清牌延时
                clearTimeout(this.removeOutTime);
                this.removeOutTime = null;
            }

            var players = TCGDRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = TCGDRoomModel.getSeqWithSeat(p.seat);
                if(seq == 1){
                    this.initMyHandCard(p.handCardIds);
                    this.showTuoGuan(p.ext[3]);

                    if(p.handCardIds.length == 0 && p.moldIds.length > 0){
                        this.showTeamCardTip(true);
                        this.initMyHandCard(p.moldIds);
                    }

                }else{//回放,或者明牌
                    this.initOtherHandCard(seq, p.handCardIds);
                }
                this.setOutCard(seq, p.outCardIds);
            }

        } else if(type == TCGDTabelType.DealCard){
            this.playDealCardAni(data.handCardIds);
            this.showTeamCardTip(false);
        }else if(type == TCGDTabelType.PlayCard){

            if(data.cardType == 0){
                this.allTipsData = null;

                var p = TCGDRoomModel.getPlayerDataByItem("seat",data.seat);
                var seq = TCGDRoomModel.getSeqWithSeat(data.seat);

                if(data.seat == TCGDRoomModel.mySeat){
                    this.initMyHandCard(p.handCardIds);
                }

                if(seq > 1){//回放,或者明牌刷新其他人的手牌
                    this.initOtherHandCard(seq, p.handCardIds);
                }

                //队友出牌，如果自己没有手牌了,刷新自己看到的队友手牌
                var mp = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
                if(mp.seat != p.seat && p.ext[6] == mp.ext[6]){
                    if(mp.handCardIds.length == 0){
                        this.initMyHandCard(mp.moldIds);
                    }
                }

                var players = TCGDRoomModel.players;
                for(var i = 0;i<players.length;++i){
                    var p = players[i];
                    var seq = TCGDRoomModel.getSeqWithSeat(p.seat);
                    this.setOutCard(seq, p.outCardIds, p.outCardIds.length > 0);
                }
            }

            if(data.isClearDesk){
                this.removeOutTime = setTimeout(function(){
                    for(var i = 0;i<4;++i){
                        var arr = this.outCardArr[i];
                        this.clearCardWithArr(arr);
                    }
                }.bind(this),200);

                TCGDRoomModel.pauseMsg();
                setTimeout(function(){
                    TCGDRoomModel.removeOnePause();
                },300);
            }

        }else if(type == TCGDTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];
            if(seat == TCGDRoomModel.mySeat){
                this.showTuoGuan(tuoguan);
            }
        }else if(type == TCGDTabelType.ShowTeamCard){

            var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
            if(p && p.moldIds.length > 0){
                this.showTeamCardTip(true);
                this.initMyHandCard(p.moldIds);
            }

        }else if(type == TCGDTabelType.MingPai){
            var players = TCGDRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = TCGDRoomModel.getSeqWithSeat(p.seat);
                if(seq > 1 && p.handCardIds.length > 0){
                    this.initOtherHandCard(seq, p.handCardIds);
                }
            }
        }
    },

    showTeamCardTip:function(isShow){
        if(isShow){
            if(!this.showTeamSpr){
                this.showTeamSpr = new cc.Scale9Sprite("res/res_tcgd/jiugonga1.png");
                this.showTeamSpr.setContentSize(375,60);
                this.showTeamSpr.setPosition(cc.winSize.width/2,340);
                this.addChild(this.showTeamSpr,200);

                var label = UICtor.cLabel("队友的手牌",42);
                label.setColor(cc.color.YELLOW);
                label.setPosition(this.showTeamSpr.width/2,this.showTeamSpr.height/2);
                this.showTeamSpr.addChild(label);
            }
            this.showTeamSpr.setVisible(true);
        }else{
            this.showTeamSpr && this.showTeamSpr.setVisible(false);
        }
    },

    initLayer:function(){
        this.outCardNodeArr = [];
        var config = [
            {pos:cc.p(cc.winSize.width/2,cc.winSize.height/2 + 38),zorder:11},
            {pos:cc.p(cc.winSize.width - 330,cc.winSize.height/2 + 38),zorder:10},
            {pos:cc.p(cc.winSize.width/2,cc.winSize.height - 330),zorder:8},
            {pos:cc.p(330,cc.winSize.height/2 + 38),zorder:9},
        ]
        for(var i = 0;i<4;++i){
            var node = new cc.Node();
            node.setPosition(config[i].pos);
            this.addChild(node,config[i].zorder);
            this.outCardNodeArr.push(node);
        }

        this.addOptCardBtn();
    },

    addOptCardBtn:function(){
        var img = "res/res_tcgd/btn_lp.png";
        this.btn_paixu = new ccui.Button(img,img);
        this.btn_paixu.setPosition(cc.winSize.width - 120,40);
        this.addChild(this.btn_paixu);

        img = "res/res_tcgd/btn_pts.png";
        this.btn_shunzi = new ccui.Button(img,img);
        this.btn_shunzi.setPosition(this.btn_paixu.x - 240,this.btn_paixu.y);
        this.addChild(this.btn_shunzi);

        img = "res/res_tcgd/btn_tonghuashun.png";
        this.btn_tonghuashun = new ccui.Button(img,img);
        this.btn_tonghuashun.setPosition(this.btn_shunzi.x - 240,this.btn_paixu.y);
        this.addChild(this.btn_tonghuashun);

        img = "res/res_tcgd/btn_tq.png";
        this.btn_tq = new ccui.Button(img,img);
        this.btn_tq.setPosition(this.btn_tonghuashun.x - 240,this.btn_paixu.y);
        this.addChild(this.btn_tq);

        img = "res/res_tcgd/btn_hf.png";
        this.btn_hf = new ccui.Button(img,img);
        this.btn_hf.setPosition(this.btn_tq.x - 240,this.btn_paixu.y);
        this.addChild(this.btn_hf);

        this.btn_paixu.addTouchEventListener(this.onClickBtn,this);
        this.btn_shunzi.addTouchEventListener(this.onClickBtn,this);
        this.btn_tonghuashun.addTouchEventListener(this.onClickBtn,this);
        this.btn_tq.addTouchEventListener(this.onClickBtn,this);
        this.btn_hf.addTouchEventListener(this.onClickBtn,this);
    },

    onTouchBegan:function(touch,event){
        if(this.isTouchBegin || this.isPlayDealCardAni || this.isTuoguan)return false;

        var pos = touch.getLocation();
        this.touchBeginIdx = this.getTouchCardIdx(pos);

        this.addTouchCard(this.touchBeginIdx,this.touchBeginIdx);

        this.isTouchBegin = true;

        return true;
    },

    onTouchMoved:function(touch,event){
        if(this.touchBeginIdx < 0)return;

        var idx = this.getTouchCardIdx(touch.getLocation());

        this.addTouchCard(this.touchBeginIdx,idx);
    },

    onTouchEnded:function(touch,event){
        this.isTouchBegin = false;
        if(this.touchBeginIdx < 0){
            this.resetSelectCardArr();
        }
        this.addSelectCard();
        this.changeSelectSendMsg();
    },

    changeSelectSendMsg:function(){
        var cardIds = [];
        for(var i = 0;i<this.selectCardArr.length;++i){
            cardIds.push(this.selectCardArr[i].cardId);
        }
        SyEventManager.dispatchEvent("TCGD_Select_Card",cardIds);

        var canTiQu = this.selectCardArr.length == 5;
        this.btn_tq.setTouchEnabled(canTiQu);
        this.btn_tq.setBright(canTiQu);
    },

    onTouchCancelled:function(touch,event){
        this.isTouchBegin = false;
        this.resetTouchCard();
        this.resetSelectCardArr();
    },

    addTouchCard:function(idx1,idx2){
        if(idx1 < 0 || idx2 < 0)return;

        this.resetTouchCard();

        var bidx = Math.min(idx1,idx2);
        var eidx = Math.max(idx1,idx2);

        for(var i = bidx;(i<=eidx) && (i<this.myHandCardArr.length);++i){
            var card = this.myHandCardArr[i];
            if(card && !card.touchState && card.playState == 0){
                card.setTouchState(true);
                this.touchCardArr.push(card);
            }
        }
    },

    addSelectCard:function(){
        for(var i = 0;i<this.touchCardArr.length;++i){
            var card = this.touchCardArr[i];
            card.setTouchState(false);

            if(card.playState != 0)continue;

            if(!card.isSelect){
                card.y += 15;
                this.selectCardArr.push(card);
            }else{
                card.y -= 15;
                this.deleteArrEle(this.selectCardArr,card);
            }
            card.setSelectState(!card.isSelect);
        }
        this.touchCardArr = [];
    },

    deleteArrEle:function(arr,ele){
        for(var i = 0;i<arr.length;++i){
            if(arr[i] == ele){
                arr.splice(i,1);
                break;
            }
        }
    },

    resetTouchCard:function(){
        for(var i = 0;i<this.touchCardArr.length;++i){
            var card = this.touchCardArr[i];
            card.setTouchState(false);
        }
        this.touchCardArr = [];
    },

    resetSelectCardArr:function(){
        var remainCards = [];
        for(var i = 0;i<this.selectCardArr.length;++i){
            var card = this.selectCardArr[i];
            if(card.playState == 0){
                card.y -= 15;
                card.setSelectState(false);
                card.setTouchState(false);
            }else{
                remainCards.push(card);
            }
        }
        this.selectCardArr = remainCards;
    },

    getTouchCardIdx:function(pos){
        var idx = -1;
        for(var i = this.myHandCardArr.length - 1;i>=0;--i){
            var card = this.myHandCardArr[i];
            var rect = card.getBoundingBox();
            if(cc.rectContainsPoint(rect,pos)){
                idx = i;
                break;
            }
        }
        return idx;
    },

    checkTiQuCards:function(ids){
        var newIds = ObjectUtil.deepCopy(ids);
        TCGDRoomModel.sortIdByValue(newIds);

        for(var i = 0;i<this.tiQuHandIds.length;++i){
            TCGDRoomModel.sortIdByValue(this.tiQuHandIds[i]);
            var hasNum = 0;
            var t = 0;
            for(var j = 0;j<this.tiQuHandIds[i].length;++j){
                for(;t<newIds.length;++t){
                    if(this.tiQuHandIds[i][j] == newIds[t]){
                        hasNum++;
                        break;
                    }
                }
            }

            if(hasNum == this.tiQuHandIds[i].length){

                for(var j = 0;j<this.tiQuHandIds[i].length;++j){
                    for(var t = 0;t<newIds.length;++t){
                        if(this.tiQuHandIds[i][j] == newIds[t]){
                            newIds.splice(t,1);
                            break;
                        }
                    }
                }

            }else{
                this.tiQuHandIds.splice(i,1);
                i--;
            }
        }

        this.norHandIds = newIds;
    },

    playDealCardAni:function(ids){
        this.isPlayDealCardAni = true;
        this.clearCardWithArr(this.myHandCardArr);

        var tempCard = new TCGDCard(105);

        var allCol = 9;

        var cardWidth = (cc.winSize.width*0.7 - tempCard.width)/(allCol - 1);
        cardWidth = Math.min(cardWidth,tempCard.width);
        var allWidth = cardWidth*(allCol - 1) + tempCard.width;
        var startX = cc.winSize.width/2 -allWidth/2;

        var delay = 0;
        for(var i = 0;i<ids.length;++i){
            var card = new TCGDCard(ids[i],true,2);
            card.setAnchorPoint(0.5,0);
            card.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 75);
            this.addChild(card,500 - i);
            this.myHandCardArr[i] = card;

            var pos = cc.p(startX + (Math.floor(i/3)) * cardWidth + tempCard.width / 2,78 + (i%3)*90);
            card.flag = (Math.floor(i/3) + 1)*5 - (i%3);
            var action = cc.sequence(cc.delayTime(delay),cc.moveTo(0.1,pos),cc.callFunc(function(node){
                node.refreshCard(node.cardId,false);
                if(node.cardId == 303)node.setColor(cc.color.RED);
                node.setAnchorPoint(0.5,0);
                node.setLocalZOrder(node.flag);
            }));
            delay += 0.1;
            card.runAction(action);
        }

        TCGDRoomModel.pauseMsg();
        setTimeout(function(){
            this.isPlayDealCardAni = false;
            this.initMyHandCard(ids);
            TCGDRoomModel.removeOnePause();
        }.bind(this),2800);

    },

    initMyHandCard:function(ids){
        this.tipIdx = 0;
        this.allTipsData = null;

        if(this.isPlayDealCardAni)return;
        this.clearCardWithArr(this.myHandCardArr);
        this.touchCardArr = [];
        this.selectCardArr = [];

        this.checkTiQuCards(ids);

        var cardNumData = TCGDRoomModel.getCardNumData(ids);

        var tempCard = new TCGDCard(105);

        if(TCGDRoomModel.paixuType == 2){

            var allCol = 0;

            var tempData = {};
            this.sortCards(this.norHandIds,1);
            for(var i = 0;i<this.norHandIds.length;++i){
                var v = TCGDCardID[this.norHandIds[i]].v;
                if(!tempData[v]){
                    tempData[v] = [this.norHandIds[i]];
                    allCol++;
                }else{
                    tempData[v].unshift(this.norHandIds[i]);
                }
            }

            var k = 20;
            for(var i = 0;i<this.tiQuHandIds.length;++i){
                this.sortCards(this.tiQuHandIds[i],1);
                tempData[k] = [];
                for(var j = 0;j<this.tiQuHandIds[i].length;++j){
                    tempData[k].unshift(this.tiQuHandIds[i][j]);
                }
                allCol++;
                k++;
            }

            var cardWidth = (cc.winSize.width*0.7 - tempCard.width)/(allCol - 1);
            cardWidth = Math.min(cardWidth,tempCard.width);
            var allWidth = cardWidth*(allCol - 1) + tempCard.width;
            var startX = cc.winSize.width/2 -allWidth/2;
            var idxCol = 0;

            var t = 0;
            for(var k = 25;k >= 3;k--){
                var arr = tempData[k];
                if(!arr)continue;

                var offSetY = 90;
                if(arr.length > 3){
                    offSetY = 300/arr.length;
                }
                for(var i = 0;i<arr.length;++i){
                    var card = new TCGDCard(arr[i],false,2);
                    card.setAnchorPoint(0.5,0);

                    var num = cardNumData[TCGDCardID[arr[i]].v];
                    if(num >= 4)card.showNum(num,true);

                    var pos = cc.p(startX + idxCol * cardWidth + tempCard.width / 2,78 + (arr.length-1-i)*offSetY);
                    card.setPosition(pos);
                    this.addChild(card, idxCol * 8 + i);

                    this.myHandCardArr[t] = card;
                    t++;
                }
                idxCol++;
            }



        }else{

            var tempIds = [];
            for(var i = 0;i<this.tiQuHandIds.length;++i){
                this.sortCards(this.tiQuHandIds[i],1);
                tempIds = this.tiQuHandIds[i].concat(tempIds);
            }
            this.sortCards(this.norHandIds,1);
            tempIds = tempIds.concat(this.norHandIds);

            for(var i = 0;i<tempIds.length;++i){
                var card = new TCGDCard(tempIds[i]);
                card.setAnchorPoint(0.5,0);

                var num = cardNumData[TCGDCardID[tempIds[i]].v];
                if(num >= 4)card.showNum(num,true);

                var pos = this.getHandCardPos(tempIds.length, tempCard.width, i);
                card.setPosition(pos);
                this.addChild(card, 50 + i);

                this.myHandCardArr[i] = card;
            }

        }

        var canHufu = this.tiQuHandIds.length > 0;
        this.btn_hf.setTouchEnabled(canHufu);
        this.btn_hf.setBright(canHufu);

        this.btn_tq.setTouchEnabled(false);
        this.btn_tq.setBright(false);

        this.checkThsState();
    },

    //回放其他人手牌显示
    initOtherHandCard:function(seq,ids){
        var cardArr = this.otherHandCardArr[seq - 1];
        this.clearCardWithArr(cardArr);

        this.sortCards(ids,1);

        if(seq == 2){

            for(var i = 0;i<ids.length;++i){
                var card = new TCGDCard(ids[i]);
                card.setAnchorPoint(1,0);
                card.setPosition(cc.winSize.width - (i%18)*30,315 + Math.floor(i/18)*53);
                this.addChild(card,50-i);
                card.setScale(0.5);
                cardArr[i] = card;
            }
        }else if(seq == 3){
            for(var i = 0;i<ids.length;++i){
                var card = new TCGDCard(ids[i]);
                card.setAnchorPoint(0,1);
                card.setPosition(cc.winSize.width/2 - 530 + (i%12)*30,cc.winSize.height - 23 - Math.floor(i/12)*53);
                this.addChild(card,5);
                card.setScale(0.5);
                cardArr[i] = card;
            }
        }else if(seq == 4){
            for(var i = 0;i<ids.length;++i){
                var card = new TCGDCard(ids[i]);
                card.setAnchorPoint(0,0);
                card.setPosition((i%18)*30,315 + Math.floor(i/18)*53);
                this.addChild(card,i<18?5:3);
                card.setScale(0.5);
                cardArr[i] = card;
            }

        }
    },

    onResortCards:function(){
        TCGDRoomModel.paixuType++;
        if(TCGDRoomModel.paixuType > 2){
            TCGDRoomModel.paixuType = 1;
        }

        var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
        if(p && p.handCardIds.length > 0){
            this.initMyHandCard(p.handCardIds);
        }
    },

    setCardSelectState:function(card,isSelect){
        if(!card || card.isSelect == isSelect)return;
        card.setSelectState(isSelect);
        if(isSelect){
            card.y += 15;
            this.selectCardArr.push(card);
        }else{
            card.y -= 15;
            for(var i = 0;i<this.selectCardArr.length;++i){
                if(card == this.selectCardArr[i]){
                    this.selectCardArr.splice(i,1);
                    break;
                }
            }
        }
    },

    onGetShunZi:function(){
        var allShunZi = TCGDRoomModel.getAllShunZi(this.norHandIds);

        for (var i = 0; i < this.tiQuHandIds.length; ++i) {
            var data = TCGDRoomModel.getCardTypeData(this.tiQuHandIds[i]);
            if(data.type == TCGDCardType.ShunZi){
                allShunZi.push(this.tiQuHandIds[i]);
            }
        }

        this.idxPts = this.idxPts || 0;
        if(this.idxPts >= allShunZi.length)this.idxPts = 0;

        if(allShunZi.length > 0){
            this.resetSelectCardArr();

            var ids = allShunZi[this.idxPts];

            for(var i = 0;i<ids.length;++i){
                for(var j = 0;j<this.myHandCardArr.length;++j){
                    var card = this.myHandCardArr[j];
                    if(card.cardId == ids[i] && !card.isSelect){
                        this.setCardSelectState(card,true);
                        break;
                    }
                }
            }

            this.changeSelectSendMsg();
        }

        this.idxPts++;

    },

    //判断是否还有同花顺
    hasTongHuaShun:function(){
        var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);

        var typeData = {1:[],2:[],3:[],4:[],5:[]};

        var hongArr = [];
        for(var i = 0;i< p.handCardIds.length;++i){
            var id = p.handCardIds[i];
            if(id == 315){
                hongArr.push(id);
            }else{
                typeData[TCGDCardID[id].t].push(id);
            }
        }

        var allShunzi = [];
        for(var k  = 1;k<5;++k){
            var shunzi = TCGDRoomModel.getAllShunZi(typeData[k].concat(hongArr));

            for(var i = 0;i<shunzi.length;++i){
                allShunzi.push(shunzi[i]);
            }
        }

        return allShunzi.length > 0;
    },

    checkThsState:function(){
        var hasTonghuaShun = this.hasTongHuaShun();

        this.btn_tonghuashun.setBright(hasTonghuaShun);
        this.btn_tonghuashun.setTouchEnabled(hasTonghuaShun);
    },

    onGetTongHuaShun:function(){
        var typeData = {1:[],2:[],3:[],4:[],5:[]};

        var hongArr = [];
        for(var i = 0;i<this.norHandIds.length;++i){
            var id = this.norHandIds[i];
            if(id == 315){
                hongArr.push(id);
            }else{
                typeData[TCGDCardID[id].t].push(id);
            }
        }

        var allShunzi = [];
        for(var k  = 1;k<5;++k){
            var shunzi = TCGDRoomModel.getAllShunZi(typeData[k].concat(hongArr));

            for(var i = 0;i<shunzi.length;++i){
                allShunzi.push(shunzi[i]);
            }
        }

        for (var i = 0; i < this.tiQuHandIds.length; ++i) {
            var data = TCGDRoomModel.getCardTypeData(this.tiQuHandIds[i]);
            if(data.type == TCGDCardType.TongHuaShun){
                allShunzi.push(this.tiQuHandIds[i]);
            }
        }

        this.idxThs = this.idxThs || 0;
        if(this.idxThs >= allShunzi.length)this.idxThs = 0;

        if(allShunzi.length > 0){
            this.resetSelectCardArr();

            var ids = allShunzi[this.idxThs];

            for(var i = 0;i<ids.length;++i){
                for(var j = 0;j<this.myHandCardArr.length;++j){
                    var card = this.myHandCardArr[j];
                    if(card.cardId == ids[i] && !card.isSelect){
                        this.setCardSelectState(card,true);
                        break;
                    }
                }
            }

            this.changeSelectSendMsg();
        }

        this.idxThs++;
    },

    onTiQuCard:function(){
        if(this.selectCardArr.length == 5){
            var ids = [];
            for(var i = 0;i<this.selectCardArr.length;++i){
                ids.push(this.selectCardArr[i].cardId);
            }
            this.tiQuHandIds.push(ids);

            var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
            if(p && p.handCardIds.length > 0){
                this.initMyHandCard(p.handCardIds);
            }

            this.changeSelectSendMsg();
        }
    },

    onHuFuCard:function(){
        if(this.tiQuHandIds.length > 0){
            this.tiQuHandIds.length -= 1;

            var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
            if(p && p.handCardIds.length > 0){
                this.initMyHandCard(p.handCardIds);
            }
        }
    },

    playCardTishi:function(){
        this.resetSelectCardArr();

        var deskCards = TCGDRoomModel.getDeskCards();
        if(deskCards){
            if(!this.allTipsData){
                this.tipIdx = -1;

                var p = TCGDRoomModel.getPlayerDataByItem("seat",TCGDRoomModel.mySeat);
                this.allTipsData = TCGDRoomModel.getTipCardsData(deskCards, p.handCardIds);
            }

            this.tipIdx++;
            if(this.tipIdx >= this.allTipsData.length){
                this.tipIdx = 0;
            }

            if(this.allTipsData.length > 0 && this.allTipsData[this.tipIdx]){
                for(var i = 0;i<this.allTipsData[this.tipIdx].length;++i){
                    for(var j = 0;j<this.myHandCardArr.length;++j){
                        var card = this.myHandCardArr[j];
                        if(card.cardId == this.allTipsData[this.tipIdx][i] && !card.isSelect){
                            this.setCardSelectState(card,true);
                            break;
                        }
                    }
                }
            }
        }

        this.changeSelectSendMsg();
    },

    getHandCardPos:function(num,cwidth,idx){
        var pos = cc.p(0,0);

        var maxLineNum = 29;
        var lineNum = Math.min(maxLineNum,num);

        var cardWidth = (cc.winSize.width - cwidth)/(lineNum - 1);
        cardWidth = Math.min(cardWidth,70);

        var allWidth = cardWidth*(lineNum - 1) + cwidth;
        var startX = cc.winSize.width/2 -allWidth/2;

        pos.x = startX + idx*cardWidth + cwidth/2;
        pos.y = 78;

        if(num > maxLineNum){
            var extWidth = cwidth + (num - maxLineNum - 1)*cardWidth;
            if(idx < num - maxLineNum){
                pos.x = cc.winSize.width/2 + allWidth/2 - extWidth + idx*cardWidth + cwidth/2;
                pos.y += 180;
            }else{
                pos.x = startX + (idx + maxLineNum - num)*cardWidth + cwidth/2;
            }
        }

        return pos;
    },

    setOutCard:function(seq,data,isPlayAction){
        var cardArr = this.outCardArr[seq - 1];
        this.clearCardWithArr(cardArr);

        var typeData = TCGDRoomModel.getCardTypeData(data);
        var deskCardType = TCGDRoomModel.getDeskCardsType();
        TCGDRoomModel.lianDuiOrFeiji(typeData,deskCardType);
        TCGDRoomModel.sortIdByZuanPai(data,typeData.tiArr,typeData.isA2);
        if(seq == 2)data.reverse();

        var tempCard = new TCGDCard(306);

        var cardNum = data.length;
        var cardWidth = 42;
        var one_line_num = 14;
        var startX = 0;

        if(seq == 1 || seq == 3){
            startX = -((Math.min(cardNum,one_line_num) - 1)*cardWidth + tempCard.width*0.7)/2;
        }

        for(var i = 0;i<cardNum;++i){
            var card = new TCGDCard(data[i]);
            var zorder = i;
            if(seq == 2){
                card.setAnchorPoint(1,0);
                card.setPosition(startX - (i%one_line_num)*cardWidth, -Math.floor(i/one_line_num)*70);
                zorder = 50 - i%one_line_num;
            } else {
                card.setAnchorPoint(0,0);
                card.setPosition(startX + (i%one_line_num)*cardWidth, - Math.floor(i/one_line_num)*70);
            }
            card.setScale(0.7);
            this.outCardNodeArr[seq - 1].addChild(card,zorder);
            cardArr[i] = card;

        }

        if(isPlayAction){
            this.outCardNodeArr[seq - 1].setScale(1.5);
            this.outCardNodeArr[seq - 1].runAction(cc.scaleTo(0.2,1));
        }

    },

    sortCards:function(ids,type){
        if(type == 2){
            TCGDRoomModel.sortIdByNum(ids);
        }else{
            TCGDRoomModel.sortIdByValue(ids);
        }
    },

    clearCardWithArr:function(arr){
        for(var i = 0;i<arr.length;++i){
            arr[i].removeFromParent(true);
        }
        arr.length = 0;
    },

    showTuoGuan:function(isTuoGuan){
        this.isTuoguan = isTuoGuan;
        if(isTuoGuan){
            if(!this.tgSpr){
                this.tgSpr = new cc.Scale9Sprite("res/res_tcgd/tgdi.png");
                this.tgSpr.setContentSize(cc.winSize.width,this.tgSpr.height);
                this.tgSpr.setAnchorPoint(0.5,0);
                this.tgSpr.setPosition(cc.winSize.width/2,75);
                this.addChild(this.tgSpr,200);

                this.btn_qxtg = new ccui.Button("res/res_tcgd/btn_quxiaotg.png","res/res_tcgd/btn_quxiaotg.png");
                this.btn_qxtg.setPosition(this.tgSpr.width/2,150);
                this.tgSpr.addChild(this.btn_qxtg);
                this.btn_qxtg.addTouchEventListener(this.onClickBtn,this);

                var label_tip = UICtor.cLabel("托管中,系统将自动为您打牌",42);
                label_tip.setPosition(this.tgSpr.width/2,60);
                label_tip.setColor(cc.color.YELLOW);
                this.tgSpr.addChild(label_tip);

            }else{
                this.tgSpr.setVisible(true);
            }

        }else{
            this.tgSpr && this.tgSpr.setVisible(false);
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_qxtg){
                sySocket.sendComReqMsg(131);
            }else if(sender == this.btn_paixu){
                this.onResortCards();
            }else if(sender == this.btn_shunzi){
                this.onGetShunZi();
            }else if(sender == this.btn_tonghuashun){
                this.onGetTongHuaShun();
            }else if(sender == this.btn_tq){
                this.onTiQuCard();
            }else if(sender == this.btn_hf){
                this.onHuFuCard();
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

});

var TCGDCard = cc.Sprite.extend({
    touchState:false,
    cardId:0,
    playState:0,
    isSelect:false,
    ctor:function(id,is_bei_mian,paiType){
        this._super();

        this.paiType = paiType;

        this.refreshCard(id,is_bei_mian);

    },

    refreshCard:function(id,is_bei_mian){
        this.cardId = id;
        var frameName = this.getCardFrameName(is_bei_mian?0:id);
        //var frame = cc.spriteFrameCache.getSpriteFrame(frameName);

        var path = "res/pkCommon/cards1/";
        if(this.paiType == 2){
            path = "res/res_tcgd/cards1/";
        }
        this.initWithFile(path + frameName);

        this.isBeiMian = (frameName == "bg.png");

        this.showZuanIcon(!this.isBeiMian && id == 315);

    },

    showZuanIcon:function(isShow){
        if(isShow){
            if(!this.icon_zuan){
                this.icon_zuan = new cc.Sprite("res/res_tcgd/icon_zuan.png");
                this.icon_zuan.setPosition(35,this.height/2 + 8);
                if(this.paiType == 2){
                    this.icon_zuan.setPosition(72,177);
                }
                this.addChild(this.icon_zuan);
            }
            this.icon_zuan.setVisible(true);
        }else{
            this.icon_zuan && this.icon_zuan.setVisible(false);
        }
    },

    showNum:function(num,isShow){
        if(isShow){
            if(!this.label_num){
                this.label_num = UICtor.cLabel(num,36);
                this.label_num.setPosition(35,this.height/2 - 45);
                this.label_num.setColor(cc.color.RED);
                this.addChild(this.label_num);
            }
            this.label_num.setVisible(true);
        }else{
            this.label_num && this.label_num.setVisible(false);
        }
    },

    getCardFrameName:function(id){
        var frameName = "bg.png";
        if(id > 0){
            frameName =  ""+ id +".png";
        }
        return frameName;
    },

    setTouchState:function(flag){
        this.touchState = flag;
        var color = cc.color.WHITE;
        if(flag)color = cc.color(120,120,120);
        this.setColor(color);

    },

    setSelectState:function(flag){
        this.isSelect = flag;
        var color = cc.color.WHITE;
        if(flag)color = cc.color(160,160,160);
        this.setColor(color);

    },

});

