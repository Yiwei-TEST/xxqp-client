/**
 * Created by cyp on 2019/11/13.
 */
var ERDDZCardLayer = cc.Layer.extend({
    tipIdx:0,//提示开始选择下标
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("ERDDZ_TIP_CARD",this,this.playCardTishi);
        SyEventManager.addEventListener("ERDDZ_Sort_Card",this,this.onResortCards);

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
        if(type == ERDDZTabelType.CreateTable){

            this.cleanAllCards();
            this.showTeamCardTip(false);
            this.showTuoGuan(false);

            if(this.removeOutTime){//重连消息，清理掉，清牌延时
                clearTimeout(this.removeOutTime);
                this.removeOutTime = null;
            }

            var players = ERDDZRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = ERDDZRoomModel.getSeqWithSeat(p.seat);
                if(seq == 1){
                    this.initMyHandCard(p.handCardIds);
                    this.showTuoGuan(p.ext[3]);

                    if(p.handCardIds.length == 0 && p.moldIds.length > 0){
                        this.showTeamCardTip(true);
                        this.initMyHandCard(p.moldIds);
                    }

                }else if(ERDDZRoomModel.replay){//回放
                    this.initOtherHandCard(seq, p.handCardIds);
                }
                this.setOutCard(seq, p.outCardIds);
            }

        } else if(type == ERDDZTabelType.DealCard){
            this.initMyHandCard(data.handCardIds);
            this.showTeamCardTip(false);
        }else if(type == ERDDZTabelType.PlayCard){

            if(data.cardType == 0){
                this.allTipsData = null;

                var p = ERDDZRoomModel.getPlayerDataByItem("seat",data.seat);
                var seq = ERDDZRoomModel.getSeqWithSeat(data.seat);

                if(data.seat == ERDDZRoomModel.mySeat){
                    this.initMyHandCard(p.handCardIds);
                }

                if(ERDDZRoomModel.replay && (seq > 1)){//回放
                    this.initOtherHandCard(seq, p.handCardIds);
                }

                //队友出牌，如果自己没有手牌了,刷新自己看到的队友手牌
                var mp = ERDDZRoomModel.getPlayerDataByItem("seat",ERDDZRoomModel.mySeat);
                if(mp.seat != p.seat && p.ext[6] == mp.ext[6]){
                    if(mp.handCardIds.length == 0){
                        this.initMyHandCard(mp.moldIds);
                    }
                }

                var players = ERDDZRoomModel.players;
                for(var i = 0;i<players.length;++i){
                    var p = players[i];
                    var seq = ERDDZRoomModel.getSeqWithSeat(p.seat);
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

                ERDDZRoomModel.pauseMsg();
                setTimeout(function(){
                    ERDDZRoomModel.removeOnePause();
                },300);
            }

        }else if(type == ERDDZTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];
            if(seat == ERDDZRoomModel.mySeat){
                this.showTuoGuan(tuoguan);
            }
        }else if(type == ERDDZTabelType.ShowTeamCard){

            var p = ERDDZRoomModel.getPlayerDataByItem("seat",ERDDZRoomModel.mySeat);
            if(p && p.moldIds.length > 0){
                this.showTeamCardTip(true);
                this.initMyHandCard(p.moldIds);
            }

        }else if(type == ERDDZTabelType.MingPai){
            var players = ERDDZRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = ERDDZRoomModel.getSeqWithSeat(p.seat);
                if(seq > 1 && p.handCardIds.length > 0){
                    this.initOtherHandCard(seq, p.handCardIds);
                }
            }
        }else if(type == ERDDZTabelType.SureDiZhu){
            var seat = data.params[0];
            var p = ERDDZRoomModel.getPlayerDataByItem("seat",seat);
            if(seat == ERDDZRoomModel.mySeat){
                this.initMyHandCard(p.handCardIds);
                this.checkDiPai(ERDDZRoomModel.diCards);
            }
        }
    },

    //把刚获取到的底牌突出显示
    checkDiPai:function(ids){
        for(var i = 0;i<ids.length;++i){
            for(var j = 0;j<this.myHandCardArr.length;++j){
                var card = this.myHandCardArr[j];
                if(card.cardId == ids[i] && !card.isSelect){
                    card.isSelect = true;
                    card.y += 40;
                    this.selectCardArr.push(card);
                    break;
                }
            }
        }
    },

    showTeamCardTip:function(isShow){
        if(isShow){
            if(!this.showTeamSpr){
                this.showTeamSpr = new cc.Scale9Sprite("res/res_erddz/jiugonga1.png");
                this.showTeamSpr.setContentSize(375,60);
                this.showTeamSpr.setPosition(cc.winSize.width/2,340);
                this.addChild(this.showTeamSpr);

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
            {pos:cc.p(cc.winSize.width/2,cc.winSize.height/2 - 130),zorder:11},
            {pos:cc.p(cc.winSize.width - 330,cc.winSize.height/2 + 38),zorder:10},
            {pos:cc.p(cc.winSize.width/2,cc.winSize.height - 400),zorder:8},
            {pos:cc.p(330,cc.winSize.height/2 + 38),zorder:9},
        ]
        for(var i = 0;i<4;++i){
            var node = new cc.Node();
            node.setPosition(config[i].pos);
            this.addChild(node,config[i].zorder);
            this.outCardNodeArr.push(node);
        }
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

        if(!this.checkLianDui()){
            this.checkShunZi();
        }

        this.addSelectCard();
        this.changeSelectSendMsg();
    },

    changeSelectSendMsg:function(){
        var cardIds = [];
        for(var i = 0;i<this.selectCardArr.length;++i){
            cardIds.push(this.selectCardArr[i].cardId);
        }
        SyEventManager.dispatchEvent("ERDDZ_Select_Card",cardIds);
        if(ERDDZRoomModel.isMoneyRoom()){
            var typeData2 = ERDDZRoomModel.getCardTypeData(cardIds);
            if(typeData2.type == ERDDZCardType.TianZha){
                this.getParent().roomEffectHandle.showHuoJianAni(this)
            }else{
                if(this.getChildByName("huojian")){
                    this.removeChildByName("huojian");
                }
            }
        }
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

    checkLianDui:function(){
        if(this.touchCardArr.length < 6)return false;

        var lianDuiArr = [];
        var lastV = 0;
        for(var i = 0;i<this.touchCardArr.length - 1;++i){
            var card1 = this.touchCardArr[i];
            var card2 = this.touchCardArr[i+1];
            var v1 = ERDDZCardID[card1.cardId].v;
            var v2 = ERDDZCardID[card2.cardId].v;

            if(v1 > 14 || lastV == v1)continue;

            if(v1 == v2 && ((lastV > 0 && lastV - v1 == 1) || lastV == 0)){
                lianDuiArr.push(card1);
                lianDuiArr.push(card2);
                lastV = v1;
                i++;
            }else if(lianDuiArr.length < 6){
                lianDuiArr = [];
                lastV = 0;
            }else{
                break;
            }
        }

        var ids = [];
        for(var i = 0;i<lianDuiArr.length;++i){
            ids.push(lianDuiArr[i].cardId);
        }

        if(lianDuiArr.length >= 6){
            for(var i = 0;i<this.touchCardArr.length;++i){
                var card = this.touchCardArr[i];
                card.setTouchState(false);
            }
            for(var i = 0;i<lianDuiArr.length;++i){
                lianDuiArr[i].setTouchState(true);
            }
            this.touchCardArr = lianDuiArr;
            return true;
        }
        return false;
    },

    checkShunZi:function(){
        if(this.touchCardArr.length < 5)return false;

        var shunZiArr = [];
        var lastV = 0;
        for(var i = 0;i<this.touchCardArr.length;++i){
            var card = this.touchCardArr[i];
            var v = ERDDZCardID[card.cardId].v;

            if(v > 14 || lastV == v)continue;

            if((lastV > 0 && lastV - v == 1) || lastV == 0){
                shunZiArr.push(card);
                lastV = v;
            }else if(shunZiArr.length < 5){
                shunZiArr = [];
                lastV = 0;
            }else{
                break;
            }
        }

        if(shunZiArr.length >= 5){
            for(var i = 0;i<this.touchCardArr.length;++i){
                var card = this.touchCardArr[i];
                card.setTouchState(false);
            }
            for(var i = 0;i<shunZiArr.length;++i){
                shunZiArr[i].setTouchState(true);
            }
            this.touchCardArr = shunZiArr;
            return true;
        }
        return false;

    },

    addSelectCard:function(){
        for(var i = 0;i<this.touchCardArr.length;++i){
            var card = this.touchCardArr[i];
            card.setTouchState(false);

            if(card.playState != 0)continue;

            if(!card.isSelect){
                card.isSelect = true;
                card.y += 40;
                this.selectCardArr.push(card);
            }else{
                card.isSelect = false;
                card.y -= 40;
                this.deleteArrEle(this.selectCardArr,card);
            }
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
                card.y -= 40;
                card.isSelect = false;
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

    initMyHandCard:function(ids){
        this.tipIdx = 0;
        this.allTipsData = null;

        if(this.isPlayDealCardAni)return;
        this.clearCardWithArr(this.myHandCardArr);
        this.touchCardArr = [];
        this.selectCardArr = [];

        this.sortCards(ids,ERDDZRoomModel.paixuType);

        var cardNum = ids.length;
        var tempCard = new ERDDZCard(105);

        for(var i = 0;i<ids.length;++i){
            var card = new ERDDZCard(ids[i]);
            card.setAnchorPoint(0.5,0);
            var pos = this.getHandCardPos(cardNum,tempCard.width,i);
            card.setPosition(pos);
            this.addChild(card,50 + i);
            this.myHandCardArr[i] = card;
        }
    },

    //回放其他人手牌显示
    initOtherHandCard:function(seq,ids){
        var cardArr = this.otherHandCardArr[seq - 1];
        this.clearCardWithArr(cardArr);

        this.sortCards(ids,1);

        if(seq == 2){

            for(var i = 0;i<ids.length;++i){
                var card = new ERDDZCard(ids[i]);
                card.setAnchorPoint(1,0);
                card.setPosition(cc.winSize.width - (i%18)*30,315 + Math.floor(i/18)*53);
                this.addChild(card,50-i);
                card.setScale(0.5);
                cardArr[i] = card;
            }
        }else if(seq == 3){
            for(var i = 0;i<ids.length;++i){
                var card = new ERDDZCard(ids[i]);
                card.setAnchorPoint(0,1);
                card.setPosition(cc.winSize.width/2 - 530 + (i%9)*40,cc.winSize.height - 23 - Math.floor(i/9)*53);
                this.addChild(card,5);
                card.setScale(0.5);
                cardArr[i] = card;
            }
        }else if(seq == 4){
            for(var i = 0;i<ids.length;++i){
                var card = new ERDDZCard(ids[i]);
                card.setAnchorPoint(0,0);
                card.setPosition((i%18)*30,315 + Math.floor(i/18)*53);
                this.addChild(card,i<18?5:3);
                card.setScale(0.5);
                cardArr[i] = card;
            }

        }
    },

    onResortCards:function(){
        ERDDZRoomModel.paixuType++;
        if(ERDDZRoomModel.paixuType > 2){
            ERDDZRoomModel.paixuType = 1;
        }

        var p = ERDDZRoomModel.getPlayerDataByItem("seat",ERDDZRoomModel.mySeat);
        if(p && p.handCardIds.length > 0){
            this.initMyHandCard(p.handCardIds);
        }
    },

    setCardSelectState:function(card,isSelect){
        if(!card || card.isSelect == isSelect)return;
        card.isSelect = isSelect;
        if(isSelect){
            card.y += 40;
            this.selectCardArr.push(card);
        }else{
            card.y -= 40;
            for(var i = 0;i<this.selectCardArr.length;++i){
                if(card == this.selectCardArr[i]){
                    this.selectCardArr.splice(i,1);
                    break;
                }
            }
        }
    },

    playCardTishi:function(){
        this.resetSelectCardArr();

        var deskCards = ERDDZRoomModel.getDeskCards();
        if(deskCards){
            if(!this.allTipsData){
                this.tipIdx = -1;

                var p = ERDDZRoomModel.getPlayerDataByItem("seat",ERDDZRoomModel.mySeat);
                this.allTipsData = ERDDZRoomModel.getTipCardsData(deskCards, p.handCardIds);
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
        cardWidth = Math.min(cardWidth,120);

        var allWidth = cardWidth*(lineNum - 1) + cwidth;
        var startX = cc.winSize.width/2 -allWidth/2;

        pos.x = startX + idx*cardWidth + cwidth/2;
        pos.y = 0;

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

        ERDDZRoomModel.sortIdByNum(data);

        var tempCard = new ERDDZCard(306);

        var cardNum = data.length;
        var cardWidth = 60;
        var one_line_num = 14;
        var startX = 0;

        if(seq == 1 || seq == 3){
            startX = -((Math.min(cardNum,one_line_num) - 1)*cardWidth + tempCard.width*0.6)/2;
        }

        for(var i = 0;i<cardNum;++i){
            var card = new ERDDZCard(data[i]);
            var zorder = i;
            if(seq == 2){
                card.setAnchorPoint(1,0);
                card.setPosition(startX - (i%one_line_num)*cardWidth, -Math.floor(i/one_line_num)*70);
                zorder = 50 - i%one_line_num;
            } else {
                card.setAnchorPoint(0,0);
                card.setPosition(startX + (i%one_line_num)*cardWidth, - Math.floor(i/one_line_num)*70);
            }
            card.setScale(0.6);
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
            ERDDZRoomModel.sortIdByNum(ids);
        }else{
            ERDDZRoomModel.sortIdByValue(ids);
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
                this.tgSpr = new cc.Scale9Sprite("res/res_erddz/tgdi.png");
                this.tgSpr.setContentSize(cc.winSize.width,this.tgSpr.height + 75);
                this.tgSpr.setAnchorPoint(0.5,0);
                this.tgSpr.setPosition(cc.winSize.width/2,0);
                this.addChild(this.tgSpr,200);

                this.btn_qxtg = new ccui.Button("res/res_erddz/btn_quxiaotg.png","res/res_erddz/btn_quxiaotg.png");
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
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

});

var ERDDZCard = cc.Sprite.extend({
    touchState:false,
    cardId:0,
    playState:0,
    isSelect:false,
    ctor:function(id,is_bei_mian){
        this._super();

        this.refreshCard(id,is_bei_mian);

    },

    refreshCard:function(id,is_bei_mian){
        this.cardId = id;
        var frameName = this.getCardFrameName(is_bei_mian?0:id);
        //var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
        this.initWithFile("res/res_erddz/cards/" + frameName);

        this.isBeiMian = (frameName == "pai_bei.png");

    },

    getCardFrameName:function(id){
        var frameName = "pai_bei.png";
        if(id > 0){
            frameName =  id +".png";
        }
        return frameName;
    },

    setTouchState:function(flag){
        this.touchState = flag;
        var color = cc.color.WHITE;
        if(flag)color = cc.color(120,120,120);
        this.setColor(color);

    },

    showFanPaiAni:function(delay){
        var scaleY = this.scaleY;
        var ancpos = this.getAnchorPoint();
        var action1 = cc.scaleTo(0.2,0,scaleY);
        var action2 = cc.callFunc(function(){
            this.refreshCard(this.cardId,!this.isBeiMian);
            this.setAnchorPoint(ancpos);
        }.bind(this));
        var action3 = cc.scaleTo(0.2,scaleY,scaleY);
        var action = cc.sequence(cc.delayTime(delay || 0),action1,action2,action3);

        this.runAction(action);
    },

});

