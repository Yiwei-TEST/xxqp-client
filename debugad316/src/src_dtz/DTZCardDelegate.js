/**
 * Created by xiaofu on 2017/8/31.
 */
var DTZCardDelegate = {
    dealTouchBegin: function (dtzRoom ,touch, event) {
        var touchPoint = null;
        if (SdkUtil.is316Engine()){
            touchPoint = touch.getTouchBeganPosition();
        }else{
            touchPoint = touch.getLocation();
        }
        dtzRoom._touchBeganX = touchPoint.x;
        dtzRoom._startX = touchPoint.x;
        var length = dtzRoom._cards.length;
        dtzRoom._startId = -1;
        dtzRoom._currentlyMoveId = -1;
        dtzRoom._touchBeginLine = 1;

        var shouldClean = false;
        if(shouldClean){
            dtzRoom.onCancelSelect()
            return false
        }else{

        }

        var hasTouchFirstLineCard = false

        for (var i = 0 ; i < length; i++) {
            var card = dtzRoom._cards[i];
            if (this.hitTest(card,touchPoint)) {
                if (hasTouchFirstLineCard) {
                    if (card.getLine() == 1) {
                        continue;
                    }
                }
                dtzRoom._startId = card.cardId;
                dtzRoom._currentlyMoveId = card.cardId;
                dtzRoom._touchBeginLine = card.getLine();
                cc.log("当前选中的为 第" + dtzRoom._touchBeginLine + "行的卡牌");
                if (dtzRoom._touchBeginLine == 2) {
                    hasTouchFirstLineCard = true;
                }
            }
        }
        if (dtzRoom._startId >= 0) {
            dtzRoom._cards[dtzRoom._startId].touched();
            return true;
        }
        return false;
    },

    hitTest: function (target,point){
        if (SdkUtil.is316Engine()){
            return target.hitTest(point,cc.Camera.getVisitingCamera(),null);
        }else{
            return target.hitTest(point);
        }
    },

    dealTouchMove: function (dtzRoom ,touch, event) {
        var touchPoint = null;
        if (SdkUtil.is316Engine()){
            touchPoint = touch.getTouchMovePosition();
        }else{
            touchPoint = touch.getLocation();
        }
        dtzRoom._isLeft2Right = (touchPoint.x > dtzRoom._startX);
        dtzRoom._isLeft2RightWithBegan = (touchPoint.x > dtzRoom._touchBeganX);
        dtzRoom._startX = touchPoint.x;
        var length = dtzRoom._cards.length;
        var lineBeginCardId = 0;
        var lineEndCardId = 0;
        var checkRank = this.getCheckRank(dtzRoom);
        lineBeginCardId = checkRank.lineBeginCardId;
        lineEndCardId = checkRank.lineEndCardId;

        var endedId = -1;
        for (var i = lineBeginCardId; i <= lineEndCardId; i++) {
            var card = dtzRoom._cards[i];
            if (this.hitTest(card,touchPoint)) {
                if (card.cardId > endedId)
                    endedId = card.cardId;
            }
        }

        if (endedId < 0) {
            if (dtzRoom._isLeft2Right) {
                if(dtzRoom._isLeft2Right){
                    var rightCardX = dtzRoom._cards[lineEndCardId].x;
                    if(touchPoint.x > rightCardX + 100){
                        endedId = lineEndCardId
                    }
                }

            } else {
                if (touchPoint.x < dtzRoom._cards[0].x){
                    endedId = lineBeginCardId;
                }

            }
            cc.log("endedId..." , endedId);
            if (endedId < 0)
                return;
        }
        cc.log("cur move endedId " , endedId , lineBeginCardId , lineEndCardId);
        for (var i = lineBeginCardId; i <= lineEndCardId; i++) {
            var card = dtzRoom._cards[i];
            if (dtzRoom._isLeft2Right) {
                if (card.cardId >= dtzRoom._currentlyMoveId && card.cardId <= endedId) {
                    if (card.cardId == dtzRoom._startId && this.hitTest(card,touchPoint) && card.isEnable()) {
                        //noting to do
                    } else {
                        dtzRoom._currentlyMoveId = card.cardId;
                        card.onTouchMove(dtzRoom._isLeft2Right);
                    }
                }
            } else {
                if (card.cardId >= endedId && card.cardId <= dtzRoom._currentlyMoveId) {
                    if (card.cardId == endedId && this.hitTest(card,touchPoint) && card.isEnable()) {
                        //noting to do
                    } else {
                        dtzRoom._currentlyMoveId = card.cardId;
                        card.onTouchMove(dtzRoom._isLeft2Right);
                    }
                }
            }
        }
    },

    dealTouchEnded: function (dtzRoom ,touch, event) {
        dtzRoom._allCards = [];
        var touchPoint = null;
        if (SdkUtil.is316Engine()){
            touchPoint = touch.getTouchEndPosition();
        }else{
            touchPoint = touch.getLocation();
        }

        var lineBeginCardId = 0;
        var lineEndCardId = 0;
        var checkRank = this.getCheckRank(dtzRoom);
        lineBeginCardId = checkRank.lineBeginCardId;
        lineEndCardId = checkRank.lineEndCardId;

        var length = dtzRoom._cards.length;
        var endedId = -1;
        for (var i = lineBeginCardId; i <= lineEndCardId; i++) {
            var card = dtzRoom._cards[i];
            if (this.hitTest(card,touchPoint)) {
                if (card.cardId > endedId)
                    endedId = card.cardId;
            }
        }
        if (endedId < 0) {
            endedId = dtzRoom._currentlyMoveId;
        }

        for (var i = lineBeginCardId; i <= lineEndCardId; i++) {
            var card = dtzRoom._cards[i];
            if (dtzRoom._isLeft2RightWithBegan) {
                if (card.cardId >= dtzRoom._startId && card.cardId <= endedId)
                    card.touched();
            } else {
                if (card.cardId >= endedId && card.cardId <= dtzRoom._startId)
                    card.touched();
            }
        }
        var allCards = [];
        var allCardsObj = [];
        for (var i = 0; i < dtzRoom._cards.length; i++) {
            var card = dtzRoom._cards[i];
            card.clearDirect();
            if (card.isTouched()) {
                card.selectAction();
            }
            card.untouched();
            if (card.isSelected()) {
                allCards.push(card.getData());
                card.i = card.getData().i;
                card.t = card.getData().t;
                card.c = card.getData().c;
                allCardsObj.push(card);
            }
        }
        dtzRoom._allCards = allCards;
        dtzRoom._curChoiceCards = allCardsObj;
        /**
         * 1 单张 2 对子
         * 3 三张不带牌 4 三张带牌
         * 5 顺子 6 连对
         * 7 飞机 (不带牌) 8 飞机 (带牌)
         * 9 筒子 10 各种炸弹 11 超级炸弹
         */
        var tCardsData = DTZAI.getCardsType(allCardsObj , dtzRoom._lastCardTypeData);
        dtzRoom._curChoiceCardsTypeData = tCardsData;
        dtzRoom.isCanLetOut();
        AudioManager.play("res/audio/common/audio_card_click.mp3");
    },

    /**
     * 获取当前点击卡牌所处行的检测id范围
     *
     * @param isTouch
     */
    getCheckRank:function(dtzRoom){
        var lineBeginCardId = 0;
        var lineEndCardId = 0;
        var length = dtzRoom._cards.length;
        if(dtzRoom._touchBeginLine == 2){
            lineBeginCardId = 0;
            lineEndCardId = dtzRoom.line2cardNumber - 1;

        }else if(dtzRoom._touchBeginLine == 1){
            lineBeginCardId = dtzRoom.line2cardNumber;
            lineEndCardId = length - 1;
        }

        return {lineBeginCardId : lineBeginCardId , lineEndCardId : lineEndCardId};
    },

}