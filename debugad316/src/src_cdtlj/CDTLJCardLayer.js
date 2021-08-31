/**
 * Created by cyp on 2019/6/24.
 */
var CDTLJCardLayer = cc.Layer.extend({
    tipIdx:0,//提示开始选择下标
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("CDTLJ_TIP_CARD",this,this.playCardTishi);

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
        if(type == CDTLJTabelType.CreateTable){

            this.cleanAllCards();

            if(this.removeOutTime){//重连消息，清理掉，清牌延时
                clearTimeout(this.removeOutTime);
                this.removeOutTime = null;
            }

            var players = CDTLJRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = CDTLJRoomModel.getSeqWithSeat(p.seat);
                if(seq == 1){
                    this.initMyHandCard(p.handCardIds);
                    this.showTuoGuan(p.ext[3]);
                }else if(CDTLJRoomModel.replay){//回放
                    this.initOtherHandCard(seq, p.handCardIds);
                }
                this.setOutCard(seq, p.outCardIds);
            }

            //抢庄和反主亮牌
            if(CDTLJRoomModel.remain == 1 && CDTLJRoomModel.qzSeat > 0){
                var seq = CDTLJRoomModel.getSeqWithSeat(CDTLJRoomModel.qzSeat);
                this.setOutCard(seq,CDTLJRoomModel.qzCards);
            }

            //不是第一个出牌
            if(CDTLJRoomModel.nextSeat == CDTLJRoomModel.mySeat && CDTLJRoomModel.remain == 4){
                var p = CDTLJRoomModel.getPlayerDataByItem("seat",CDTLJRoomModel.mySeat);
                var firstCards = CDTLJRoomModel.getFirstCards();
                if(firstCards.length > 0){
                    var data = CDTLJRoomModel.handCardsCanPlay(p.handCardIds,firstCards);
                    this.setCardPlayState(data);
                }
            }

        }else if(type == CDTLJTabelType.DealCard) {
            this.showDealCardAni(data.handCardIds);
        }else if(type == CDTLJTabelType.JiaoFen){

            if(data.params[0] == 1 || data.params[0] == 2){
                var seat = data.params[1];
                var seq = CDTLJRoomModel.getSeqWithSeat(seat);
                for(var i = 1;i<=4;++i){
                    if(i == seq)this.setOutCard(seq,CDTLJRoomModel.qzCards,true);
                    else this.setOutCard(i,[]);
                }

                //最后一个反主，让反主显示的牌停留一秒
                if(data.params[2] == 0){
                    CDTLJRoomModel.pauseMsg();
                    setTimeout(function(){
                        CDTLJRoomModel.removeOnePause();
                    },1000);
                }
            }

        }else if(type == CDTLJTabelType.DingZhuang){
            var seat = data.strParams[0];
            var ids = CDTLJRoomModel.getPlayerDataByItem("seat",seat).handCardIds;
            if(seat == CDTLJRoomModel.mySeat){
                this.initMyHandCard(ids);
            }else if(CDTLJRoomModel.replay){
                var seq = CDTLJRoomModel.getSeqWithSeat(seat);
                this.initOtherHandCard(seq,ids);
            }

            //清掉抢主和反主显示的牌
            for(var i = 1;i<=4;++i){
                this.setOutCard(i,[]);
            }

        }else if(type == CDTLJTabelType.PlayCard){
            if(data.seat == CDTLJRoomModel.mySeat){
                var p = CDTLJRoomModel.getPlayerDataByItem("seat",data.seat);
                this.initMyHandCard(p.handCardIds);
            }
            var seq = CDTLJRoomModel.getSeqWithSeat(data.seat);

            if(CDTLJRoomModel.replay && (seq > 1)){//回放刷新其他人的手牌
                var p = CDTLJRoomModel.getPlayerDataByItem("seat",data.seat);
                this.initOtherHandCard(seq, p.handCardIds);
            }

            if(data.cardType == 100){
                this.playMaiPaiAni(seq);
            }else{
                this.setOutCard(seq, data.cardIds,true);
            }
            //不是第一个出牌
            if(data.nextSeat == CDTLJRoomModel.mySeat && !data.isClearDesk){
                var p = CDTLJRoomModel.getPlayerDataByItem("seat",CDTLJRoomModel.mySeat);
                var firstCards = CDTLJRoomModel.getFirstCards();
                if(firstCards.length > 0){
                    var data = CDTLJRoomModel.handCardsCanPlay(p.handCardIds,firstCards);
                    this.setCardPlayState(data);
                }
            }

            //打完一轮后比较大小
            if(data.isClearDesk){
                this.showDaAni(data.nextSeat);
            }

        }else if(type == CDTLJTabelType.XuanZhu){
            var players = CDTLJRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = CDTLJRoomModel.getSeqWithSeat(p.seat);
                if(seq == 1){
                    this.initMyHandCard(p.handCardIds);
                }
            }
        }else if(type == CDTLJTabelType.ChangeTuoGuan){
            var seat = data.params[0];
            var tuoguan = data.params[1];
            if(seat == CDTLJRoomModel.mySeat){
                this.showTuoGuan(tuoguan);
            }
        }
    },

    //比较大小显示效果
    showDaAni:function(seat){
        for(var i = 0;i<4;++i){
            var arr = this.outCardArr[i];
            var s_seat = CDTLJRoomModel.getSeatWithSeq(i+1);
            if(s_seat == seat){
                for(var j = 0;j<arr.length;++j){
                    arr[j].showDaIcon(true);
                }
                break;
            }
        }

        this.removeOutTime = setTimeout(function(){
            for(var i = 0;i<4;++i){
                var arr = this.outCardArr[i];
                this.clearCardWithArr(arr);
            }
        }.bind(this),1500);

        CDTLJRoomModel.pauseMsg();
        setTimeout(function(){
            CDTLJRoomModel.removeOnePause();
        },2000);
    },

    initLayer:function(){
        this.outCardNodeArr = [];
        var config = [
            {pos:cc.p(cc.winSize.width/2,cc.winSize.height/2 - 75),zorder:10},
            {pos:cc.p(cc.winSize.width - 225,cc.winSize.height/2 + 60),zorder:9},
            {pos:cc.p(cc.winSize.width/2,cc.winSize.height - 330),zorder:8},
            {pos:cc.p(225,cc.winSize.height/2 + 60),zorder:9},
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
        SyEventManager.dispatchEvent("CDTLJ_Select_Card",cardIds);
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
                card.y += 45;
                this.selectCardArr.push(card);
            }else{
                card.isSelect = false;
                card.y -= 45;
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
                card.y -= 45;
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

    showDealCardAni:function(ids){
        this.isPlayDealCardAni = true;
        this.clearCardWithArr(this.myHandCardArr);

        var tempCard = new CDTLJCard(105);

        var delay = 0;
        for(var i = 0;i<ids.length;++i){
            var card = new CDTLJCard(ids[i],true);
            card.setAnchorPoint(0.5,0);
            card.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            this.addChild(card,50 + i);
            this.myHandCardArr[i] = card;

            var pos = this.getHandCardPos(ids.length,tempCard.width,i);
            var action = cc.sequence(cc.delayTime(delay),cc.moveTo(0.2,pos),cc.callFunc(function(node){
                node.refreshCard(node.cardId,false);
                node.setAnchorPoint(0.5,0);
            }));
            delay += 0.2;
            card.runAction(action);
        }

        CDTLJRoomModel.pauseMsg();
        setTimeout(function(){
            this.isPlayDealCardAni = false;
            this.initMyHandCard(ids);
            CDTLJRoomModel.removeOnePause();
        }.bind(this),4300);
    },

    initMyHandCard:function(ids){
        this.tipIdx = 0;
        if(this.isPlayDealCardAni)return;
        this.clearCardWithArr(this.myHandCardArr);
        this.touchCardArr = [];
        this.selectCardArr = [];

        this.sortCards(ids);

        var cardNum = ids.length;
        var tempCard = new CDTLJCard(105);

        for(var i = 0;i<ids.length;++i){
            var card = new CDTLJCard(ids[i]);
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

        this.sortCards(ids);

        if(seq == 2){

            for(var i = 0;i<ids.length;++i){
                var card = new CDTLJCard(ids[i]);
                card.setAnchorPoint(1,0);
                card.setPosition(cc.winSize.width - (i%18)*30,390 + Math.floor(i/18)*53);
                this.addChild(card,50-i);
                card.setScale(0.4);
                cardArr[i] = card;
            }
        }else if(seq == 3){
            for(var i = 0;i<ids.length;++i){
                var card = new CDTLJCard(ids[i]);
                card.setAnchorPoint(0,1);
                card.setPosition(cc.winSize.width/2 - 460 + (i%10)*30,cc.winSize.height - 23 - Math.floor(i/10)*53);
                this.addChild(card,5);
                card.setScale(0.4);
                cardArr[i] = card;
            }
        }else if(seq == 4){
            for(var i = 0;i<ids.length;++i){
                var card = new CDTLJCard(ids[i]);
                card.setAnchorPoint(0,0);
                card.setPosition((i%18)*30,390 + Math.floor(i/18)*53);
                this.addChild(card,i<18?5:3);
                card.setScale(0.4);
                cardArr[i] = card;
            }

        }
    },

    setCardSelectState:function(card,isSelect){
        if(card.isSelect == isSelect)return;
        card.isSelect = isSelect;
        if(isSelect){
            card.y += 45;
            this.selectCardArr.push(card);
        }else{
            card.y -= 45;
            for(var i = 0;i<this.selectCardArr.length;++i){
                if(card == this.selectCardArr[i]){
                    this.selectCardArr.splice(i,1);
                    break;
                }
            }
        }
    },

    setCardPlayState:function(data){
        for(var i = 0;i<this.myHandCardArr.length;++i){
            var card = this.myHandCardArr[i];
            var state = data[card.cardId];
            card.playState = state;

            if(state == 1) {
                card.setColor(cc.color(180, 180, 180));
                this.setCardSelectState(card,true);
            }else if(state == -1){
                card.setColor(cc.color(120,120,120));
                this.setCardSelectState(card,false);
            }
        }
        this.changeSelectSendMsg();
    },

    playCardTishi:function(){
        var firstCards = CDTLJRoomModel.getFirstCards();
        if(firstCards.length == 0)return;

        this.resetSelectCardArr();

        if(this.selectCardArr.length == firstCards.length)return;

        var kexuanArr = [];
        var kexuanIds = [];
        for(var i = this.myHandCardArr.length - 1;i>=0;--i){
            var card = this.myHandCardArr[i];
            if(card.playState == 0){
                kexuanArr.push(card);
                kexuanIds.push(card.cardId);
            }
        }

        var step = 1;

        //拖拉机或对子如果有可选的牌的话，设置提示移动数为2
        if(CDTLJRoomModel.isDuizi(firstCards) || CDTLJRoomModel.isTuolaji(firstCards)){
            var data_my = CDTLJRoomModel.checkCardsType(kexuanIds);
            var data_other = CDTLJRoomModel.checkCardsType(firstCards);

            for (var key in data_other) {
                var arr_other = data_other[key];
                var arr_my = data_my[key];

                if (arr_other.length == 1) {

                    var hasDui =false;
                    for(var i = 0;i<arr_my.length;++i){
                        if(arr_my[i].type == CDTLJCardType.Dui || arr_my[i].type == CDTLJCardType.TuoLaji){
                            hasDui = true;
                        }
                    }

                    if(hasDui)step = 2;

                    break;
                }
            }
        }

        var idx = 0;
        if(this.tipIdx>=0 && this.tipIdx < kexuanArr.length){
            idx = this.tipIdx;
            this.tipIdx += step;
            if(this.tipIdx >= kexuanArr.length){
                this.tipIdx = 0;
            }
        }

        var num = 0;
        while(true){
            var card = kexuanArr[idx];
            if(this.selectCardArr.length < firstCards.length){
                if(card.playState == 0)this.setCardSelectState(card,true);
            }else{
                break;
            }

            idx++;
            if(idx >= kexuanArr.length){
                idx = 0;
            }

            num++;
            if(num >= kexuanArr.length){
                break;
            }
        }
        this.changeSelectSendMsg();
    },

    getHandCardPos:function(num,cwidth,idx){
        var pos = cc.p(0,0);

        var maxLineNum = 29;
        var lineNum = Math.min(maxLineNum,num);

        var cardWidth = (cc.winSize.width - cwidth)/(lineNum - 1);
        cardWidth = Math.min(cardWidth,86);

        var allWidth = cardWidth*(lineNum - 1) + cwidth;
        var startX = cc.winSize.width/2 -allWidth/2;

        pos.x = startX + idx*cardWidth + cwidth/2;
        pos.y = 83;

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

    playMaiPaiAni:function(seq){
        var posArr = [cc.p(cc.winSize.width/2,150),cc.p(cc.winSize.width - 150,cc.winSize.height/2 + 150),
            cc.p(cc.winSize.width/2,cc.winSize.height - 150),cc.p(150,cc.winSize.height/2 + 150)];
        for(var i = 0;i<8;++i){
            var card = new CDTLJCard(0);
            card.setPosition(posArr[seq - 1]);
            card.setAnchorPoint(0.5,0);
            card.setScale(0.2);
            this.addChild(card,10);
            var action = cc.sequence(
                cc.spawn(cc.moveTo(0.3,cc.winSize.width/2,cc.winSize.height/2 + 75),cc.scaleTo(0.3,0.5),cc.rotateTo(0.3,-35 + i*10)),
                cc.delayTime(0.5),cc.fadeOut(0.2), cc.callFunc(function(node){
                node.removeFromParent(true);
            }));
            card.runAction(action);
        }

    },

    setOutCard:function(seq,data,isPlayAction){
        var cardArr = this.outCardArr[seq - 1];
        this.clearCardWithArr(cardArr);

        var tempCard = new CDTLJCard(306);

        var cardNum = data.length;
        var cardWidth = 42;
        var one_line_num = 14;
        var startX = 0;

        if(seq == 1 || seq == 3){
            startX = -((Math.min(cardNum,one_line_num) - 1)*cardWidth + tempCard.width*0.5)/2;
        }

        for(var i = 0;i<cardNum;++i){
            var card = new CDTLJCard(data[i]);
            var zorder = i;
            if(seq == 2){
                card.setAnchorPoint(1,0);
                card.setPosition(startX - (i%one_line_num)*cardWidth, -Math.floor(i/one_line_num)*60);
                zorder = 50 - i%one_line_num;
            } else {
                card.setAnchorPoint(0,0);
                card.setPosition(startX + (i%one_line_num)*cardWidth, - Math.floor(i/one_line_num)*60);
            }
            card.setScale(0.5);
            this.outCardNodeArr[seq - 1].addChild(card,zorder);
            cardArr[i] = card;

        }

        if(isPlayAction){
            this.outCardNodeArr[seq - 1].setScale(1.5);
            this.outCardNodeArr[seq - 1].runAction(cc.scaleTo(0.2,1));
        }

    },

    sortCards:function(ids){
        ids.sort(function(a,b){
            return CDTLJRoomModel.getOrderNum(b) - CDTLJRoomModel.getOrderNum(a);
        });
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
                this.tgSpr = new cc.Scale9Sprite("res/res_cdtlj/tgdi.png");
                this.tgSpr.setContentSize(cc.winSize.width,this.tgSpr.height);
                this.tgSpr.setAnchorPoint(0.5,0);
                this.tgSpr.setPosition(cc.winSize.width/2,83);
                this.addChild(this.tgSpr,200);

                this.btn_qxtg = new ccui.Button("res/res_cdtlj/btn_quxiaotg.png","res/res_cdtlj/btn_quxiaotg.png");
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

var CDTLJCard = cc.Sprite.extend({
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
        this.initWithFile("res/pkCommon/cards/" + frameName);

        this.isBeiMian = (frameName == "sdh_card_pai_bei.png");

        this.showZhuIcon(CDTLJRoomModel.isZhuPai(id) && !is_bei_mian);

    },

    getCardFrameName:function(id){
        var frameName = "sdh_card_pai_bei.png";
        if(id > 0){
            frameName =  "sdh_card_"+ id +".png";
        }
        return frameName;
    },

    showZhuIcon:function(isShow){
        var spr = this.getChildByName("zhu_icon");
        if(isShow){
            if(!spr){
                spr = new cc.Sprite("res/res_cdtlj/img_zhu_flag.png");
                spr.setName("zhu_icon");
                spr.setAnchorPoint(0,0);
                spr.setPosition(4,8);
                this.addChild(spr,1);
            }
            spr.setVisible(true);
        }else{
            spr && spr.setVisible(false);
        }
    },

    showDaIcon:function(isShow){
        var spr = this.getChildByName("da_icon");
        if(isShow){
            if(!spr){
                spr = new cc.Sprite("res/res_cdtlj/da.png");
                spr.setName("da_icon");
                spr.setScale(1.5);
                spr.setPosition(this.width - 60,this.height - 60);
                this.addChild(spr,1);
            }
            spr.setVisible(true);

            spr.setRotation(-90);
            spr.setScale(1);
            spr.runAction(cc.spawn(cc.rotateTo(0.3,0),cc.scaleTo(0.3,1.5)));

        }else{
            spr && spr.setVisible(false);
        }
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

