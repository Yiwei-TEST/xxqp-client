/**
 * Created by cyp on 2019/11/13.
 */
var NSBCardLayer = cc.Layer.extend({
    tipIdx:0,//提示开始选择下标
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("NSB_TIP_CARD",this,this.playCardTishi);
        SyEventManager.addEventListener("NSB_Sort_Card",this,this.onResortCards);
        SyEventManager.addEventListener("NSB_Get_WuShiK",this,this.onGetWuShiK);
        SyEventManager.addEventListener("NSB_Get_ZhaDan",this,this.onGetZhaDan);
        SyEventManager.addEventListener("NSB_Get_TongHuaShun",this,this.onGetTongHuaShun);

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
        if(type == NSBTabelType.CreateTable){

            this.cleanAllCards();
            this.showTeamCardTip(false);

            if(this.removeOutTime){//重连消息，清理掉，清牌延时
                clearTimeout(this.removeOutTime);
                this.removeOutTime = null;
            }

            var players = NSBRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
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

        } else if(type == NSBTabelType.DealCard){
            this.initMyHandCard(data.handCardIds);
            this.showTeamCardTip(false);
        }else if(type == NSBTabelType.PlayCard){

            if(data.cardType == 0){
                var p = NSBRoomModel.getPlayerDataByItem("seat",data.seat);
                var seq = NSBRoomModel.getSeqWithSeat(data.seat);

                if(data.seat == NSBRoomModel.mySeat){
                    this.initMyHandCard(p.handCardIds);
                }

                if(seq > 1){//回放,或者明牌刷新其他人的手牌
                    this.initOtherHandCard(seq, p.handCardIds);
                }

                //队友出牌，如果自己没有手牌了,刷新自己看到的队友手牌
                var mp = NSBRoomModel.getPlayerDataByItem("seat",NSBRoomModel.mySeat);
                if(mp.seat != p.seat && p.ext[6] == mp.ext[6]){
                    if(mp.handCardIds.length == 0){
                        this.initMyHandCard(mp.moldIds);
                    }
                }

                var players = NSBRoomModel.players;
                for(var i = 0;i<players.length;++i){
                    var p = players[i];
                    var seq = NSBRoomModel.getSeqWithSeat(p.seat);
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

                NSBRoomModel.pauseMsg();
                setTimeout(function(){
                    NSBRoomModel.removeOnePause();
                },300);
            }

        }else if(type == NSBTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];
            if(seat == NSBRoomModel.mySeat){
                this.showTuoGuan(tuoguan);
            }
        }else if(type == NSBTabelType.ShowTeamCard){

            var p = NSBRoomModel.getPlayerDataByItem("seat",NSBRoomModel.mySeat);
            if(p && p.moldIds.length > 0){
                this.showTeamCardTip(true);
                this.initMyHandCard(p.moldIds);
            }

        }else if(type == NSBTabelType.MingPai){
            var players = NSBRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                if(seq > 1 && p.handCardIds.length > 0){
                    this.initOtherHandCard(seq, p.handCardIds);
                }
            }
        }
    },

    showTeamCardTip:function(isShow){
        if(isShow){
            if(!this.showTeamSpr){
                this.showTeamSpr = new cc.Scale9Sprite("res/res_nsb/jiugonga1.png");
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
            {pos:cc.p(cc.winSize.width/2,cc.winSize.height - 330),zorder:8},
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
        this.addSelectCard();
        this.changeSelectSendMsg();
    },

    changeSelectSendMsg:function(){
        var cardIds = [];
        for(var i = 0;i<this.selectCardArr.length;++i){
            cardIds.push(this.selectCardArr[i].cardId);
        }
        SyEventManager.dispatchEvent("NSB_Select_Card",cardIds);
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

        if(this.isPlayDealCardAni)return;
        this.clearCardWithArr(this.myHandCardArr);
        this.touchCardArr = [];
        this.selectCardArr = [];

        this.sortCards(ids,NSBRoomModel.paixuType);

        var cardNum = ids.length;
        var tempCard = new NSBCard(105);

        for(var i = 0;i<ids.length;++i){
            var card = new NSBCard(ids[i]);
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
                var card = new NSBCard(ids[i]);
                card.setAnchorPoint(1,0);
                card.setPosition(cc.winSize.width - (i%18)*30,315 + Math.floor(i/18)*53);
                this.addChild(card,50-i);
                card.setScale(0.5);
                cardArr[i] = card;
            }
        }else if(seq == 3){
            for(var i = 0;i<ids.length;++i){
                var card = new NSBCard(ids[i]);
                card.setAnchorPoint(0,1);
                card.setPosition(cc.winSize.width/2 - 530 + (i%12)*30,cc.winSize.height - 23 - Math.floor(i/12)*53);
                this.addChild(card,5);
                card.setScale(0.5);
                cardArr[i] = card;
            }
        }else if(seq == 4){
            for(var i = 0;i<ids.length;++i){
                var card = new NSBCard(ids[i]);
                card.setAnchorPoint(0,0);
                card.setPosition((i%18)*30,315 + Math.floor(i/18)*53);
                this.addChild(card,i<18?5:3);
                card.setScale(0.5);
                cardArr[i] = card;
            }

        }
    },

    onResortCards:function(){
        NSBRoomModel.paixuType++;
        if(NSBRoomModel.paixuType > 3){
            NSBRoomModel.paixuType = 1;
        }

        var p = NSBRoomModel.getPlayerDataByItem("seat",NSBRoomModel.mySeat);
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

    onGetWuShiK:function(){
        var wuArr = [];
        var shiArr = [];
        var kArr = [];
        for(var i = 0;i<this.myHandCardArr.length;++i){
            var card = this.myHandCardArr[i];
            if(NSBCardID[card.cardId].v == 5){
                wuArr.push(card);
            }else if(NSBCardID[card.cardId].v == 10){
                shiArr.push(card);
            }else if(NSBCardID[card.cardId].v == 13){
                kArr.push(card);
            }
        }

        this.idxWu = this.idxWu || 0;
        this.idxShi = this.idxShi || 0;
        this.idxK = this.idxK || 0;

        if(this.idxK >= kArr.length)this.idxK = 0;
        if(this.idxWu >= wuArr.length)this.idxWu = 0;
        if(this.idxShi >= shiArr.length)this.idxShi = 0;


        if(wuArr.length > 0 && shiArr.length > 0 && kArr.length > 0){
            this.resetSelectCardArr();

            this.setCardSelectState(wuArr[this.idxWu],true);
            this.setCardSelectState(shiArr[this.idxShi],true);
            this.setCardSelectState(kArr[this.idxK],true);

            this.changeSelectSendMsg();
        }

        this.idxK++;
        if(this.idxK >= kArr.length)this.idxShi++;
        if(this.idxShi >= shiArr.length)this.idxWu++;
    },

    onGetZhaDan:function(){
        var zhadanArr = [];

        var wangArr = [];
        for(var i = 0;i<this.myHandCardArr.length;++i){
            var card = this.myHandCardArr[i];
            if(NSBCardID[card.cardId].t == 5){
                wangArr.push(card);
            }
        }
        if(wangArr.length == 4){
            zhadanArr.push(wangArr);
        }

        for(var i = 0;i<this.myHandCardArr.length;++i){
            var card = this.myHandCardArr[i];
            var newArr = [card];
            for(var j = i+1;j<this.myHandCardArr.length;++j){
                var card1 = this.myHandCardArr[j];
                if(NSBCardID[card.cardId].v == NSBCardID[card1.cardId].v){
                    newArr.push(card1);
                }else{
                    break;
                }
            }
            if(newArr.length >= 4){
                zhadanArr.push(newArr);
            }
            i += (newArr.length - 1);
        }

        this.idxZd = this.idxZd || 0;
        if(this.idxZd >= zhadanArr.length)this.idxZd = 0;

        if(zhadanArr.length > 0){
            this.resetSelectCardArr();

            var arr = zhadanArr[this.idxZd];

            for(var i = 0;i<arr.length;++i){
                this.setCardSelectState(arr[i],true);
            }

            this.changeSelectSendMsg();
        }

        this.idxZd++;

    },

    onGetTongHuaShun:function(){
        var typeData = {1:[],2:[],3:[],4:[],5:[]};
        for(var i = 0;i<this.myHandCardArr.length;++i){
            var card = this.myHandCardArr[i];

            typeData[NSBCardID[card.cardId].t].push(card.cardId);
        }

        var allShunzi = [];
        for(var k  = 1;k<5;++k){
            var shunzi = NSBRoomModel.getAllShunZi(typeData[k]);

            for(var i = 0;i<shunzi.length;++i){
                allShunzi.push(shunzi[i]);
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


    playCardTishi:function(){
        this.resetSelectCardArr();

        var deskCards = NSBRoomModel.getDeskCards();
        if(deskCards){
            var p = NSBRoomModel.getPlayerDataByItem("seat",NSBRoomModel.mySeat);
            var tipCards = NSBRoomModel.getTipCardsData(deskCards, p.handCardIds);
            if(tipCards){
                for(var i = 0;i<tipCards.length;++i){
                    for(var j = 0;j<this.myHandCardArr.length;++j){
                        var card = this.myHandCardArr[j];
                        if(card.cardId == tipCards[i] && !card.isSelect){
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

        NSBRoomModel.sortIdByNum(data);

        var tempCard = new NSBCard(306);

        var cardNum = data.length;
        var cardWidth = 42;
        var one_line_num = 14;
        var startX = 0;

        if(seq == 1 || seq == 3){
            startX = -((Math.min(cardNum,one_line_num) - 1)*cardWidth + tempCard.width*0.7)/2;
        }

        for(var i = 0;i<cardNum;++i){
            var card = new NSBCard(data[i]);
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
        if(type == 3){
            NSBRoomModel.sortIdByNum(ids);
        }else{
            NSBRoomModel.sortIdByValue(ids);
        }

        if(type == 2){
            var wushikArr = [];
            var zhadanArr = [];

            var typeData = {1:[],2:[],3:[],4:[],5:[]};
            for(var i = 0;i<ids.length;++i){
                typeData[NSBCardID[ids[i]].t].push(ids[i]);
            }

            var allShunzi = [];
            for(var k  = 1;k<5;++k){
                var shunzi = NSBRoomModel.getAllShunZi(typeData[k]);

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
                var v = NSBCardID[ids[i]].v;
                if(v == 5 || v == 10 || v == 13){
                    wushikArr.push(ids[i]);
                    ids.splice(i,1);
                    i--;
                }else{
                    var num = 1;
                    for(var j = i+1;j<ids.length;++j){
                        var v1 = NSBCardID[ids[j]].v;
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
                this.tgSpr = new cc.Scale9Sprite("res/res_nsb/tgdi.png");
                this.tgSpr.setContentSize(cc.winSize.width,this.tgSpr.height);
                this.tgSpr.setAnchorPoint(0.5,0);
                this.tgSpr.setPosition(cc.winSize.width/2,75);
                this.addChild(this.tgSpr,200);

                this.btn_qxtg = new ccui.Button("res/res_nsb/btn_quxiaotg.png","res/res_nsb/btn_quxiaotg.png");
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

var NSBCard = cc.Sprite.extend({
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
        this.initWithFile("res/pkCommon/cards1/" + frameName);

        this.isBeiMian = (frameName == "bg.png");

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

});

