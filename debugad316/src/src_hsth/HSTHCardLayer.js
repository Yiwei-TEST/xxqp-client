/**
 * Created by cyp on 2019/11/13.
 */
var HSTHCardLayer = cc.Layer.extend({
    tipIdx:0,//提示开始选择下标
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("HSTH_TIP_CARD",this,this.playCardTishi);

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
        if(type == HSTHTabelType.CreateTable){

            this.cleanAllCards();
            this.showTeamCardTip(false);

            if(this.removeOutTime){//重连消息，清理掉，清牌延时
                clearTimeout(this.removeOutTime);
                this.removeOutTime = null;
            }

            var players = HSTHRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = HSTHRoomModel.getSeqWithSeat(p.seat);
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

        } else if(type == HSTHTabelType.DealCard){
            this.initMyHandCard(data.handCardIds);
            this.showTeamCardTip(false);
        }else if(type == HSTHTabelType.PlayCard){

            if(data.cardType == 0){
                this.allTipsData = null;

                var p = HSTHRoomModel.getPlayerDataByItem("seat",data.seat);
                var seq = HSTHRoomModel.getSeqWithSeat(data.seat);

                if(data.seat == HSTHRoomModel.mySeat){
                    this.initMyHandCard(p.handCardIds);
                }

                if(seq > 1){//回放,或者明牌刷新其他人的手牌
                    this.initOtherHandCard(seq, p.handCardIds);
                }

                //队友出牌，如果自己没有手牌了,刷新自己看到的队友手牌
                var mp = HSTHRoomModel.getPlayerDataByItem("seat",HSTHRoomModel.mySeat);
                if(mp.seat != p.seat && p.ext[6] == mp.ext[6]){
                    if(mp.handCardIds.length == 0){
                        this.initMyHandCard(mp.moldIds);
                    }
                }

                var players = HSTHRoomModel.players;
                for(var i = 0;i<players.length;++i){
                    var p = players[i];
                    var seq = HSTHRoomModel.getSeqWithSeat(p.seat);
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

                HSTHRoomModel.pauseMsg();
                setTimeout(function(){
                    HSTHRoomModel.removeOnePause();
                },300);
            }

        }else if(type == HSTHTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];
            if(seat == HSTHRoomModel.mySeat){
                this.showTuoGuan(tuoguan);
            }
        }else if(type == HSTHTabelType.ShowTeamCard){

            var p = HSTHRoomModel.getPlayerDataByItem("seat",HSTHRoomModel.mySeat);
            if(p && p.moldIds.length > 0){
                this.showTeamCardTip(true);
                this.initMyHandCard(p.moldIds);
            }

        }else if(type == HSTHTabelType.MingPai){
            var players = HSTHRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = HSTHRoomModel.getSeqWithSeat(p.seat);
                if(seq > 1 && p.handCardIds.length > 0){
                    this.initOtherHandCard(seq, p.handCardIds);
                }
            }
        }
    },

    showTeamCardTip:function(isShow){
        if(isShow){
            if(!this.showTeamSpr){
                this.showTeamSpr = new cc.Scale9Sprite("res/res_hsth/jiugonga1.png");
                this.showTeamSpr.setContentSize(375,60);
                this.showTeamSpr.setPosition(cc.winSize.width/2,340);
                this.addChild(this.showTeamSpr,1000);

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

        this.handNode_2 = new cc.Node();
        this.handNode_2.setPosition(cc.winSize.width,cc.winSize.height/2 - 225);
        this.handNode_2.setRotation(-90);
        this.handNode_2.setScale(0.5);
        this.addChild(this.handNode_2);

        this.handNode_3 = new cc.Node();
        this.handNode_3.setPosition(cc.winSize.width/2 - 300,cc.winSize.height);
        this.handNode_3.setRotation(-180);
        this.handNode_3.setScale(0.5);
        this.addChild(this.handNode_3);

        this.handNode_4 = new cc.Node();
        this.handNode_4.setPosition(0,cc.winSize.height/2 - 225);
        this.handNode_4.setRotation(90);
        this.handNode_4.setScale(0.5);
        this.addChild(this.handNode_4);
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

        //点击每列最下面一张牌选中全列
        var idx = this.getTouchCardIdx(touch.getLocation());
        if(this.touchBeginIdx > 0 && this.touchBeginIdx == idx
            && this.myHandCardArr[idx].row == 0){

            for(var i = this.touchBeginIdx - 1;i>=0;--i){
                var card = this.myHandCardArr[i];
                if(card.col == this.myHandCardArr[idx].col){
                    idx = i;
                }else{
                    break;
                }
            }
            this.addTouchCard(this.touchBeginIdx,idx);
        }

        this.addSelectCard();
        this.changeSelectSendMsg();
    },

    changeSelectSendMsg:function(){
        var cardIds = [];
        for(var i = 0;i<this.selectCardArr.length;++i){
            cardIds.push(this.selectCardArr[i].cardId);
        }
        SyEventManager.dispatchEvent("HSTH_Select_Card",cardIds);
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

        var cardData = HSTHRoomModel.handleCards(ids,true);

        var tempCard = new HSTHCard(105);

        var cardWidth = (cc.winSize.width*0.7 - tempCard.width)/(cardData.length - 1);
        cardWidth = Math.min(cardWidth,tempCard.width/3*2);
        var allWidth = cardWidth*(cardData.length - 1) + tempCard.width;
        var startX = cc.winSize.width/2 -allWidth/2;
        var idxCol = 0;

        var t = 0;
        for(var k = 0;k<cardData.length;++k){
            var arr = cardData[k].ids;

            var offSetY = 30;

            for(var i = 0;i<arr.length;++i){
                var card = new HSTHCard(arr[i],false,2);
                card.setAnchorPoint(0.5,0);
                card.col = k;
                card.row = arr.length-1-i;

                var num = arr.length;
                if(num >= 4){
                    card.setTypeState(num,cardData[k].type);
                }

                var pos = cc.p(startX + idxCol * cardWidth + tempCard.width / 2,(arr.length-1-i)*offSetY);
                card.setPosition(pos);
                this.addChild(card, idxCol * 20 + i);

                this.myHandCardArr[t] = card;
                t++;
            }
            idxCol++;
        }
    },

    //回放其他人手牌显示
    initOtherHandCard:function(seq,ids){
        var cardArr = this.otherHandCardArr[seq - 1];
        this.clearCardWithArr(cardArr);

        var cardData = HSTHRoomModel.handleCards(ids,true);

        var tempCard = new HSTHCard(103);

        var cardWidth = (900 - tempCard.width)/(cardData.length - 1);
        cardWidth = Math.min(cardWidth,tempCard.width/3*2);
        var allWidth = cardWidth*(cardData.length - 1) + tempCard.width;
        var idxCol = 0;

        var dir = 1;
        var node = this["handNode_" + seq];

        if(seq == 2){
            dir = -1;
        }

        var startX = -dir*allWidth/2;

        var t = 0;
        for(var k = 0;k<cardData.length;++k){
            var arr = cardData[k].ids;

            var offSetY = 30;

            for(var i = 0;i<arr.length;++i){
                var card = new HSTHCard(arr[i],false,2);
                card.setAnchorPoint(0.5,0);

                var num = arr.length;
                if(num >= 4){
                    card.setTypeState(num,cardData[k].type);
                }

                var zorder = dir*idxCol * 20 + i;
                if(dir == -1)zorder += 500;

                var pos = cc.p(startX + dir*(idxCol * cardWidth + tempCard.width / 2),(arr.length-1-i)*offSetY);
                card.setPosition(pos);
                node.addChild(card,zorder);

                cardArr[t] = card;
                t++;
            }
            idxCol++;
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

    playCardTishi:function(){
        this.resetSelectCardArr();

        var deskCards = HSTHRoomModel.getDeskCards();
        if(deskCards){

            if(!this.allTipsData){
                this.tipIdx = -1;
                var p = HSTHRoomModel.getPlayerDataByItem("seat",HSTHRoomModel.mySeat);
                this.allTipsData = HSTHRoomModel.getTipCardsData(deskCards, p.handCardIds);
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

        HSTHRoomModel.sortIdByNum(data);

        var typeData = HSTHRoomModel.getCardTypeData(data);

        var tempCard = new HSTHCard(306);

        var cardNum = data.length;
        var cardWidth = 42;
        var one_line_num = 14;
        var startX = 0;

        if(seq == 1 || seq == 3){
            startX = -((Math.min(cardNum,one_line_num) - 1)*cardWidth + tempCard.width*0.7)/2;
        }

        for(var i = 0;i<cardNum;++i){
            var card = new HSTHCard(data[i]);
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
            if(cardNum >= 4){
                if((seq == 2 && i == 0) || (seq != 2 && i == cardNum - 1)){
                    card.setTypeState(cardNum,typeData.type);
                }
            }
            this.outCardNodeArr[seq - 1].addChild(card,zorder);
            cardArr[i] = card;

        }

        if(isPlayAction){
            this.outCardNodeArr[seq - 1].setScale(1.5);
            this.outCardNodeArr[seq - 1].runAction(cc.scaleTo(0.2,1));
        }

    },

    sortCards:function(ids,type){
        if(type == 3){
            HSTHRoomModel.sortIdByNum(ids);
        }else{
            HSTHRoomModel.sortIdByValue(ids);
        }

        if(type == 2){
            var wushikArr = [];
            var zhadanArr = [];

            var typeData = {1:[],2:[],3:[],4:[],5:[]};
            for(var i = 0;i<ids.length;++i){
                typeData[HSTHCardID[ids[i]].t].push(ids[i]);
            }

            var allShunzi = [];
            for(var k  = 1;k<5;++k){
                var shunzi = HSTHRoomModel.getAllShunZi(typeData[k]);

                for(var i = 0;i<shunzi.length;++i){
                    allShunzi.push(shunzi[i]);
                }
            }

            //把同花顺从原数组提取出来
            for(var i = 0;i<allShunzi.length;++i){
                for(var j = 0;j<allShunzi[i].length;++j){
                    var id = allShunzi[i][j];

                    for(var t = 0;t<ids.length;++t){
                        if(id == ids[t]){
                            ids.splice(t,1);
                            break;
                        }
                    }
                }
            }


            for(var i = 0;i<ids.length;++i){
                var v = HSTHCardID[ids[i]].v;
                if(v == 5 || v == 10 || v == 13){
                    wushikArr.push(ids[i]);
                    ids.splice(i,1);
                    i--;
                }else{
                    var num = 1;
                    for(var j = i+1;j<ids.length;++j){
                        var v1 = HSTHCardID[ids[j]].v;
                        if(v1 == v){
                            num++;
                        }else break;
                    }
                    if(num >= 4){
                        zhadanArr = zhadanArr.concat(ids.splice(i,num));
                        i--;
                    }
                }
            }

            zhadanArr.reverse();
            for(var i = 0;i<zhadanArr.length;++i){
                ids.unshift(zhadanArr[i]);
            }
            for(var i = 0;i<wushikArr.length;++i){
                ids.unshift(wushikArr[i]);
            }

            for(var i = 0;i<allShunzi.length;++i){
                for(var j = 0;j<allShunzi[i].length;++j){
                    var id = allShunzi[i][j];

                    ids.unshift(id);
                }
            }
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
                this.tgSpr = new cc.Scale9Sprite("res/res_hsth/tgdi.png");
                this.tgSpr.setContentSize(cc.winSize.width,this.tgSpr.height);
                this.tgSpr.setAnchorPoint(0.5,0);
                this.tgSpr.setPosition(cc.winSize.width/2,0);
                this.addChild(this.tgSpr,200);

                this.btn_qxtg = new ccui.Button("res/res_hsth/btn_quxiaotg.png","res/res_hsth/btn_quxiaotg.png");
                this.btn_qxtg.setPosition(this.tgSpr.width/2,225);
                this.tgSpr.addChild(this.btn_qxtg);
                this.btn_qxtg.addTouchEventListener(this.onClickBtn,this);

                var label_tip = UICtor.cLabel("托管中,系统将自动为您打牌",42);
                label_tip.setPosition(this.tgSpr.width/2,135);
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

var HSTHCard = cc.Sprite.extend({
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
        this.initWithFile(path + frameName);

        this.isBeiMian = (frameName == "bg.png");

    },

    setTypeState:function(num,type){

        var str = "";
        var color = cc.color.RED;
        if(type == HSTHCardType.TongHua){
            str = num + "\n" + "同花";
        }else{
            str = num + "\n" + "炸弹";
            color = cc.color.BLUE;
        }

        if(type == HSTHCardType.TongHua){
            var mask = new cc.Sprite("res/pkCommon/cards1/redMask.png");
            mask.setPosition(this.width/2,this.height/2 + 2);
            mask.setOpacity(150);
            this.addChild(mask);
        }

        this.label_num = new ccui.Text(str,"res/font/bjdmj/fzcy.TTF",30);
        this.label_num.setPosition(38, this.height / 2 - 60);
        this.label_num.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_num.setColor(color);
        this.addChild(this.label_num);

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

