/**
 * Created by xiaofu on 2017/8/31.
 */
var PDKCardDelegate = {

    dealTouchBegin: function (pdkRoom ,touch, event) {
        var touchPoint = null;
        if (SdkUtil.is316Engine()){
            touchPoint = touch.getTouchBeganPosition();
        }else{
            touchPoint = touch.getLocation();
        }
        pdkRoom._touchBeganX = touchPoint.x;
        pdkRoom._startX = touchPoint.x;
        var length = pdkRoom._cards.length;
        pdkRoom._startId = -1;
        pdkRoom._currentlyMoveId = -1;
        for(var i=0;i<length;i++){
            var card = pdkRoom._cards[i];
            if(this.hitTest(card,touchPoint)){
                if(card.cardId>pdkRoom._startId){
                    pdkRoom._startId = card.cardId;
                    pdkRoom._currentlyMoveId = card.cardId;
                }
            }
        }
        if(pdkRoom._startId>=0){
            pdkRoom._cards[pdkRoom._startId].touched();
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

    dealTouchMove: function (pdkRoom ,touch, event) {
        var touchPoint = null;
        if (SdkUtil.is316Engine()){
            touchPoint = touch.getTouchMovePosition();
        }else{
            touchPoint = touch.getLocation();
        }
        pdkRoom._isLeft2Right = (touchPoint.x>pdkRoom._startX);
        pdkRoom._isLeft2RightWithBegan = (touchPoint.x>pdkRoom._touchBeganX);
        pdkRoom._startX = touchPoint.x;
        var length = pdkRoom._cards.length;
        var endedId = -1;
        for(var i=0;i<length;i++){
            var card = pdkRoom._cards[i];
            if(this.hitTest(card,touchPoint)){
                if(card.cardId > endedId)
                    endedId = card.cardId;
            }
        }
        if(endedId < 0){
            if(pdkRoom._isLeft2Right){
                if(touchPoint.x>(pdkRoom._cards[length-1].x+100))//过滤掉边缘
                    endedId = PDKAI.MAX_CARD-1;
            }else{
                if(touchPoint.x<pdkRoom._cards[0].x)
                    endedId = 0;
            }
            if(endedId<0)
                return;
        }
        for(var i=0;i<length;i++){
            var card = pdkRoom._cards[i];
            if(pdkRoom._isLeft2Right){
                if(card.cardId>=pdkRoom._currentlyMoveId && card.cardId<=endedId){
                    if(card.cardId==pdkRoom._startId && this.hitTest(card,touchPoint) && card.isEnable()){
                        //noting to do
                    }else{
                        pdkRoom._currentlyMoveId = card.cardId;
                        card.onTouchMove(pdkRoom._isLeft2Right);
                    }
                }
            }else{
                if(card.cardId>=endedId && card.cardId<=pdkRoom._currentlyMoveId){
                    if(card.cardId==endedId && this.hitTest(card,touchPoint) && card.isEnable()){
                        //noting to do
                    }else{
                        pdkRoom._currentlyMoveId = card.cardId;
                        card.onTouchMove(pdkRoom._isLeft2Right);
                    }
                }
            }
        }
    },

    dealTouchEnded: function (pdkRoom ,touch, event) {
        pdkRoom._allCards.length = 0;
        var touchPoint = null;
        if (SdkUtil.is316Engine()){
            touchPoint = touch.getTouchEndPosition();
        }else{
            touchPoint = touch.getLocation();
        }
        var length = pdkRoom._cards.length;
        var endedId = -1;
        for(var i=0;i<length;i++){
            var card = pdkRoom._cards[i];
            if(this.hitTest(card,touchPoint)){
                if(card.cardId > endedId)
                    endedId = card.cardId;
            }
        }

        //是否单击
        var hasSelectCards = false;
        for(var i=0;i<length;i++) {
            var card = pdkRoom._cards[i];
            if(card.isSelected()){
                hasSelectCards = true;
                break;
            }
        }

        if(endedId < 0){
            endedId = pdkRoom._isLeft2RightWithBegan ? PDKAI.MAX_CARD-1 : 0;
        }
        for(var i=0;i<length;i++){
            var card = pdkRoom._cards[i];
            if(pdkRoom._isLeft2RightWithBegan){
                if(card.cardId>=pdkRoom._startId && card.cardId<=endedId)
                    card.touched();
            }else{
                if(card.cardId>=endedId && card.cardId<=pdkRoom._startId)
                    card.touched();
            }
        }
        var allCards = [];
        for (var i = 0; i < pdkRoom._cards.length; i++) {
            var card = pdkRoom._cards[i];
            card.clearDirect();
            if(card.isTouched()){
                card.selectAction();
            }
            card.untouched();
            if(card.isSelected())
                allCards.push(card.getData());
        }



        if(!hasSelectCards) {
            var removeCards = this.filterOutCards(allCards);
            for (var i = 0; i < removeCards.length; i++) {
                for (var j = 0; j < pdkRoom._cards.length; j++) {
                    var card = pdkRoom._cards[j];
                    if (card._cardVo.c == removeCards[i].c) {
                        card.selectAction();
                    }
                }
            }
        }

        var chooseCards = [];
        for (var i = 0; i < pdkRoom._cards.length; i++) {
            var card = pdkRoom._cards[i];
            card.clearDirect();
            if(card.isTouched()){
                card.selectAction();
            }
            card.untouched();
            if(card.isSelected())
                chooseCards.push(card.getData());
        }

        pdkRoom._allCards = chooseCards;

        pdkRoom.isCanLetOut();
        AudioManager.play("res/audio/common/click_cards.mp3");
    },


    //shunZiCondition : function(firstCard,lastCard,length,numberCount){
    //    return (((lastCard.i - firstCard.i) == 4 && length<=8 ) ||    //5顺
    //    ((lastCard.i - firstCard.i) == 5 && length <= 9 && numberCount == 6) ||  //6顺
    //    ((lastCard.i - firstCard.i) == 6 && length <= 10 && numberCount == 7) || //7顺
    //    ((lastCard.i - firstCard.i) == 7 && length <= 12 && numberCount == 8) || //8顺
    //    ((lastCard.i - firstCard.i) == 8 && length <= 14 && numberCount == 9) || //9顺
    //    ((lastCard.i - firstCard.i) == 9 && length <= 16 && numberCount == 10)|| //10
    //    ((lastCard.i - firstCard.i) == 10 && length <= 16 && numberCount == 11)|| //11
    //    ((lastCard.i - firstCard.i) == 11 && length <= 16 && numberCount == 12));
    //},

    ////筛选顺子
    //filterShunZi:function(selectedCards){
    //    selectedCards.sort(PDKAI._sortByIndex);
    //    var length = selectedCards.length;
    //    var firstCard = selectedCards[0];
    //    var lastCard =  selectedCards[length-1];
    //    var temp = {};
    //    var maxCount = 1;//同数字牌的数量
    //    var numberCount = 0;//不同数字的牌的数量
    //    var maxTimesCardId = 0;//出现次数最多的牌的大小
    //    for(var i=0;i<length;i++){
    //        var card = selectedCards[i];
    //        if(temp[card.i]){
    //            temp[card.i] += 1;
    //            if(parseInt(temp[card.i]) > maxCount){
    //                maxCount = parseInt(temp[card.i]);
    //                maxTimesCardId = card.i;
    //            }
    //        }else{
    //            numberCount++;
    //            temp[card.i] = 1;
    //        }
    //    }
    //    var removeCards = [];
    //    if(numberCount>=5 && length>=5 && lastCard.i <= 14 && this.shunZiCondition(firstCard,lastCard,length,numberCount)){
    //        if(maxCount>=1 && maxCount<4){
    //            var indexI = [];
    //            for(var cardI in temp){
    //                if(temp[cardI]==2 || temp[cardI]==3){
    //                    indexI.push(cardI);
    //                }
    //            }
    //            for(var i=0;i<selectedCards.length;i++){
    //                for(var j=0;j<indexI.length;j++) {
    //                    if (selectedCards[i].i == indexI[j]) {
    //                        var card = selectedCards.splice(i, 1);
    //                        ArrayUtil.merge(card,removeCards);
    //                    }
    //                }
    //            }
    //        }
    //    }
    //    return removeCards;
    //},


    filterFeiJi:function(selectedCards){
        selectedCards.sort(PDKAI._sortByIndex);
        var length = selectedCards.length;
        var threeList = [];
        var threeLianListResult =[];
        var attachcards=[];
        var temp = {};
        var isEnter = false;
        for(var i=0;i<length;i++){
            var card = selectedCards[i];
            if(temp[card.i]){
                temp[card.i] += 1;
            }else{
                temp[card.i] = 1;
            }
        }
        for(var cardI in temp){
            if(temp[cardI]>=3 ){
                threeList.push(parseInt(cardI));
            }
        }

        for(var i=threeList.length-1;i>=0;i--){
            var threeLianList = [];
            threeLianList.push(threeList[i]);
            for (var j = i; j >= 1; j--) {
                if(threeList[j] == threeList[j -1]+1){
                    threeLianList.push(threeList[j -1]);
                }else{
                    break;
                }
            }
            if(threeLianList.length>=2 && threeLianList.length > threeLianListResult.length){
                threeLianListResult = threeLianList;
            }
        }

        var removeCards = [];
        if(threeLianListResult.length > 0){
            for(var i=0;i<selectedCards.length;i++){
                for (var j = 0; j < threeLianListResult.length; j++) {
                    if(selectedCards[i].i == threeLianListResult[j]){
                        if(temp[selectedCards[i].i] >3){
                            removeCards.push(selectedCards[i]);
                            temp[selectedCards[i].i]-=1;
                        }
                        break;
                    }
                }
            }
            for(var cardI in temp){
                if(temp[cardI]==1 ){
                    attachcards.push(parseInt(cardI));
                }
            }
            for(var cardI in temp){
                if(temp[cardI]==2 ){
                    for(var i=0;i<temp[cardI];i++){
                        attachcards.push(parseInt(cardI));
                    }
                }
            }
            for(var cardI in temp){
                if(temp[cardI]==3 ){
                    var isContain = false;
                    for(var i=0;i<threeLianListResult.length;i++){
                        if(threeLianListResult[i] == parseInt(cardI)){
                            isContain = true;
                            break;
                        }
                    }
                    if(isContain){

                    }else{
                        for(var i=0;i<temp[cardI];i++){
                            attachcards.push(parseInt(cardI));
                        }
                    }
                }
            }
            if(attachcards.length > threeLianListResult.length*2){
                var _removeCards=[];
                for (var j = threeLianListResult.length*2; j < attachcards.length; j++) {
                    _removeCards.push(attachcards[j]);
                }
                for(var i=0;i<selectedCards.length;i++){
                    for (var j = 0; j < _removeCards.length; j++) {
                        if(selectedCards[i].i == _removeCards[j]){
                            removeCards.push(selectedCards[i]);
                            _removeCards.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            isEnter = true;
        }
        // }else if(threeList.length > 0){
        //     for(var i=0;i<selectedCards.length;i++){
        //         if(selectedCards[i].i == threeList[0]){
        //             if(temp[selectedCards[i].i] >3){
        //                 removeCards.push(selectedCards[i]);
        //                 temp[selectedCards[i].i]-=1;
        //             }
        //             break;
        //         }
        //     }
        //     for(var cardI in temp){
        //         if(temp[cardI]==1 ){
        //             attachcards.push(parseInt(cardI));
        //         }
        //     }
        //     for(var cardI in temp){
        //         if(temp[cardI]==2 ){
        //             for(var i=0;i<temp[cardI];i++){
        //                 attachcards.push(parseInt(cardI));
        //             }
        //         }
        //     }
        //     for(var cardI in temp){
        //         if(temp[cardI]==3 ){
        //             if(parseInt(cardI) != threeList[0]){
        //                 for(var i=0;i<temp[cardI];i++){
        //                     attachcards.push(parseInt(cardI));
        //                 }
        //             }
        //         }
        //     }
        //     if(attachcards.length > 2){
        //         var _removeCards=[];
        //         for (var j = 2; j < attachcards.length; j++) {
        //             _removeCards.push(attachcards[j]);
        //         }
        //         for(var i=0;i<selectedCards.length;i++){
        //             for (var j = 0; j < _removeCards.length; j++) {
        //                 if(selectedCards[i].i == _removeCards[j]){
        //                     removeCards.push(selectedCards[i]);
        //                     _removeCards.splice(j, 1);
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        //     isEnter = true;
        // }
        var args = [];
        args[0] = isEnter;
        args[1] = removeCards;
        return args;
    },
    filterThreeattach:function(selectedCards){
        selectedCards.sort(PDKAI._sortByIndex);
        var length = selectedCards.length;
        var threeList = [];
        var attachcards=[];
        var temp = {};
        var isEnter = false;
        for(var i=0;i<length;i++){
            var card = selectedCards[i];
            if(temp[card.i]){
                temp[card.i] += 1;
            }else{
                temp[card.i] = 1;
            }
        }
        for(var cardI in temp){
            if(temp[cardI]>=3 && temp[cardI]!=4){
                threeList.push(parseInt(cardI));
            }
        }
        var removeCards = [];
        if(threeList.length > 0){
            for(var i=0;i<selectedCards.length;i++){
                if(selectedCards[i].i == threeList[0]){
                    if(temp[selectedCards[i].i] >3){
                        removeCards.push(selectedCards[i]);
                        temp[selectedCards[i].i]-=1;
                    }
                    break;
                }
            }
            for(var cardI in temp){
                if(temp[cardI]==1 ){
                    attachcards.push(parseInt(cardI));
                }
            }
            for(var cardI in temp){
                if(temp[cardI]==2 ){
                    for(var i=0;i<temp[cardI];i++){
                        attachcards.push(parseInt(cardI));
                    }
                }
            }
            for(var cardI in temp){
                if(temp[cardI]==3 ){
                    if(parseInt(cardI) != threeList[0]){
                        for(var i=0;i<temp[cardI];i++){
                            attachcards.push(parseInt(cardI));
                        }
                    }
                }
            }
            if(attachcards.length > 2){
                var _removeCards=[];
                for (var j = 2; j < attachcards.length; j++) {
                    _removeCards.push(attachcards[j]);
                }
                for(var i=0;i<selectedCards.length;i++){
                    for (var j = 0; j < _removeCards.length; j++) {
                        if(selectedCards[i].i == _removeCards[j]){
                            removeCards.push(selectedCards[i]);
                            _removeCards.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            isEnter = true;
        }
        var args = [];
        args[0] = isEnter;
        args[1] = removeCards;
        return args;
    },

  //筛选连对
    filterLianDui:function(selectedCards){
        selectedCards.sort(PDKAI._sortByIndex);
        var length = selectedCards.length;
        var doubleList = [];
        var doubleLianListResult =[];
        var temp = {};
        var isEnter = false;

        for(var i=0;i<length;i++){
            var card = selectedCards[i];
            if(temp[card.i]){
                temp[card.i] += 1;
            }else{
                temp[card.i] = 1;
            }
        }
        for(var cardI in temp){
            if(temp[cardI]>=2 ){
                doubleList.push(parseInt(cardI))
            }
        }
        for(var i=doubleList.length-1;i>=0;i--){
            var doubleLianList = [];
            doubleLianList.push(doubleList[i]);
            for (var j = i; j >= 1; j--) {
                if(doubleList[j] == doubleList[j -1]+1){
                    doubleLianList.push(doubleList[j -1]);
                }else{
                    break;
                }
            }
            if(doubleLianList.length>=2 && doubleLianList.length > doubleLianListResult.length){
                doubleLianListResult = doubleLianList;
            }
        }

        var removeCards = [];
        if(doubleLianListResult.length > 0){
            for(var i=0;i<selectedCards.length;i++){
                var isFind = false;
                for (var j = 0; j < doubleLianListResult.length; j++) {
                    if(selectedCards[i].i == doubleLianListResult[j]){
                        isFind = true;
                        if(temp[selectedCards[i].i] >2){
                            removeCards.push(selectedCards[i]);
                            temp[selectedCards[i].i]-=1;
                        }
                        break;
                    }
                }
                if(isFind){

                }else{
                    removeCards.push(selectedCards[i]);
                }
            }
            //if(removeCards.length > 0){
                isEnter = true;
            //}
        }
      
        var args = [];
        args[0] = isEnter;
        args[1] = removeCards;
        return args;
    },

    //筛选顺子
    filterShunZi:function(selectedCards){
        selectedCards.sort(PDKAI._sortByIndex);
        var length = selectedCards.length;
        var singleList = [];
        var singLianListResult =[];
        var temp = {};
        var isEnter = false;
        for(var i=0;i<length;i++){
            var card = selectedCards[i];
            if(temp[card.i]){
                temp[card.i] += 1;
            }else{
                temp[card.i] = 1;
                if(card.i < 15){
                    singleList.push(card.i);
                }
            }
        }
        for(var i=singleList.length-1;i>=0;i--){
            var singleLianList = [];
            singleLianList.push(singleList[i]);
            for (var j = i; j >= 1; j--) {
                if(singleList[j] == singleList[j -1]+1){
                    singleLianList.push(singleList[j -1]);
                }else{
                    break;
                }
            }
            if(singleLianList.length>=5 && singleLianList.length > singLianListResult.length){
                singLianListResult = singleLianList;
            }
        }
        var removeCards = [];
        if(singLianListResult.length > 0){
            for(var i=0;i<selectedCards.length;i++){
                var isFind = false;
                for (var j = 0; j < singLianListResult.length; j++) {
                    if(selectedCards[i].i == singLianListResult[j]){
                        isFind = true;
                        if(temp[selectedCards[i].i] >1){
                            removeCards.push(selectedCards[i]);
                            temp[selectedCards[i].i]-=1;
                        }
                        break;
                    }
                }
                if(isFind){

                }else{
                    removeCards.push(selectedCards[i]);
                }
            }
        //if(removeCards.length > 0){
            isEnter = true;
        //}            
        }

        var args = [];
        args[0] = isEnter;
        args[1] = removeCards;
        return args;

    },


     filterBomb:function(selectedCards){
        selectedCards.sort(PDKAI._sortByIndex);
        var length = selectedCards.length;
        var FourList = [];
        var FourListResult =[];
        var temp = {};
        var isEnter = false;
        for(var i=0;i<length;i++){
            var card = selectedCards[i];
            if(temp[card.i]){
                temp[card.i] += 1;
            }else{
                temp[card.i] = 1;
            }
        }
       for(var cardI in temp){
           if(temp[cardI]==4){
               FourList.push(parseInt(cardI));
           }
       }
       var removeCards = [];
       if(FourList.length > 0 ){
            FourListResult.push(FourList[0]);
            
            if(FourListResult.length > 0){
                for(var i=0;i<selectedCards.length;i++){
                    var isFind = false;
                    for (var j = 0; j < FourListResult.length; j++) {
                        if(selectedCards[i].i == FourListResult[j]){
                            isFind = true;
                            break;
                        }
                    }
                    if(isFind){

                    }else{
                        removeCards.push(selectedCards[i]);
                    }
                }
            }
            //if(removeCards.length > 0){
                isEnter = true;
            //}
       }
        var args = [];
        args[0] = isEnter;
        args[1] = removeCards;
        return args;
    },



    filterOutCards:function(selectedCards)
    {   
        // var zhadan = this.filterBomb(selectedCards);
        var feiji = this.filterFeiJi(selectedCards);
        var shunzi = this.filterShunZi(selectedCards);
        var threeattah = this.filterThreeattach(selectedCards);
        var liandui = this.filterLianDui(selectedCards);
        // var tipType = zhadan[0]?1:feiji[0]?2:shunzi[0]?3:threeattah[0]?4:5;
        var tipType = feiji[0]?2:shunzi[0]?3:threeattah[0]?4:5;
        // cc.log("tipeType =",tipType);
        // if (tipType == 1){
        //     return zhadan[1];
        // }else 
        if (tipType == 2){
            return feiji[1];
        }else if (tipType == 3){
            return shunzi[1];
        }else if (tipType == 4){
            return threeattah[1];
        }else{
            return liandui[1];
        }
    },
}