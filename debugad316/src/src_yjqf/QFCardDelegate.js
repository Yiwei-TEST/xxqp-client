/**
 * Created by xiaofu on 2017/8/31.
 */
var QFCardDelegate = {

    dealTouchBegin: function (dtzRoom ,touch, event) {
        var touchPoint = touch.getLocation();
        dtzRoom._touchBeganX = touchPoint.x;
        dtzRoom._startX = touchPoint.x;
        var length = dtzRoom._cards.length;
        dtzRoom._startId = -1;
        dtzRoom._currentlyMoveId = -1;
        dtzRoom._touchBeginLine = 1;
        for (var i = 0 ; i < length; i++) {
            var card = dtzRoom._cards[i];
            if (this.hitTest(card,touchPoint)) {
                dtzRoom._startId = card.cardId;
                if(card._BoomNumber >= 4){
                    dtzRoom.onCancelSelect();
                    for (var j = 0; j < dtzRoom._cards.length; j++) {
                        var tmpCard = dtzRoom._cards[j];
                        if(card.n == tmpCard.n){
                            tmpCard.touched();
                        }
                    }
                }else{
                    for(var key in dtzRoom._curChoiceCards){
                        var tmpCard = dtzRoom._curChoiceCards[key];
                        if(tmpCard._BoomNumber >= 4){
                            dtzRoom.onCancelSelect();
                            break;
                        }
                    }
                }
                card.touched();
                return true;
            }
        }
        return true;
    },

    dealTouchMove: function (dtzRoom ,touch, event) {
        var touchPoint = touch.getLocation();
        var _curChoiceIsBoomb = false;
        for (var j = 0; j < dtzRoom._cards.length; j++) {
            var tmpCard = dtzRoom._cards[j];
            if(tmpCard._BoomNumber >= 4 && tmpCard._touched){
                _curChoiceIsBoomb = true;
                break;
            }
        }

        for (var i = 0; i < dtzRoom._cards.length; i++) {
            var card = dtzRoom._cards[i];
            if (this.hitTest(card,touchPoint)) {
                // card.touched();
                if(_curChoiceIsBoomb && card._BoomNumber >= 4){
                    for (var j = 0; j < dtzRoom._cards.length; j++) {
                        var tmpCard = dtzRoom._cards[j];
                        if(card.n == tmpCard.n){
                            tmpCard.touched();
                        }else{
                            tmpCard.untouched();
                        }
                    }
                }else if(!_curChoiceIsBoomb && card._BoomNumber < 4){
                    card.touched();
                }
                break;
            }
        }
    },

    dealTouchEnded: function (dtzRoom ,touch, event) {
        dtzRoom._allCards = [];
        var touchPoint = touch.getLocation();
        var lineBeginCardId = 0;
        var lineEndCardId = 0;
        var checkRank = this.getCheckRank(dtzRoom);
        lineBeginCardId = checkRank.lineBeginCardId;
        lineEndCardId = checkRank.lineEndCardId;

        var _curChoiceIsBoomb = false;
        for (var j = 0; j < dtzRoom._cards.length; j++) {
            var tmpCard = dtzRoom._cards[j];
            if(tmpCard._BoomNumber >= 4 && tmpCard._touched){
                _curChoiceIsBoomb = true;
                break;
            }
        }

        for (var i = 0; i < dtzRoom._cards.length; i++) {
            var card = dtzRoom._cards[i];
            if (this.hitTest(card,touchPoint)) {
                // card.touched();
                if(_curChoiceIsBoomb && card._BoomNumber >= 4){
                    for (var j = 0; j < dtzRoom._cards.length; j++) {
                        var tmpCard = dtzRoom._cards[j];
                        if(card.n == tmpCard.n){
                            tmpCard.touched();
                        }else{
                            tmpCard.untouched();
                        }
                    }
                }else if(!_curChoiceIsBoomb && card._BoomNumber < 4){
                    card.touched();
                }
                break;
            }
        }

        //for (var i = 0; i < dtzRoom._cards.length; i++) {
        //    var card = dtzRoom._cards[i];
        //    if(card.isTouched() && card._BoomNumber >= 4){
        //        for (var j = 0; j < dtzRoom._cards.length; j++) {
        //            var tmpCard = dtzRoom._cards[j];
        //            if(card.n == tmpCard.n){
        //                tmpCard.touched();
        //            }
        //        }
        //    }
        //}
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
        var tCardsData = QFAI.getCardsType(allCardsObj , dtzRoom._lastCardTypeData);
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


    hitTest: function (target,point){
        if (SdkUtil.is316Engine()){
            return target.hitTest(point,cc.Camera.getVisitingCamera(),null);
        }else{
            return target.hitTest(point);
        }
    }

}