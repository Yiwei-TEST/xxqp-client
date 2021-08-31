/**
 * Created by xf on 2017/8/18.
 */
//转移部分 DTZRoom数据处理的代码过来

/**
 * 判断所有牌应该显示在哪一行(不可以拆开)
 */

var QFExfunc = {

    updateShowMap: function (dtzRoom , cardList) {
        dtzRoom.showCardMap3 = {};//三副牌 保护连续相同牌不拆开
        dtzRoom.showCardMap4 = {};//四副牌
        dtzRoom.line1cardNumber = 0;
        dtzRoom.line2cardNumber = 0;
        cardList = dtzRoom._cards;
        if (QFRoomModel.isProtectedSort()) {
            //cc.log("dtzRoom.firstLineLimit1...", dtzRoom.firstLineLimit);
            for (var index = 0; index < cardList.length; index++) {
                var tCurCard = cardList[index];
                if (this.isOverLine(dtzRoom ,index, tCurCard) == false) {
                    dtzRoom.showCardMap3[tCurCard.i] = 2;
                } else {
                    dtzRoom.showCardMap3[tCurCard.i] = 1;
                }
            }
        } else if (!QFRoomModel.isProtectedSort()) {
            //cc.log("dtzRoom.firstLineLimit2...", dtzRoom.firstLineLimit);
            for (var index = 0; index < cardList.length; index++) {

                if (index > dtzRoom.firstLineLimit) {
                    dtzRoom.showCardMap4[index] = 1;
                } else {
                    dtzRoom.showCardMap4[index] = 2;
                }
            }
        }

        for (var curCardIndex = 0; curCardIndex < cardList.length; curCardIndex++) {
            var card = cardList[curCardIndex];
            var showLine = this.getShowLine(dtzRoom ,card, curCardIndex);
            if (showLine == 1) {
                dtzRoom.line1cardNumber++;
            } else {
                dtzRoom.line2cardNumber++;
            }
        }
        //cc.log("规划后...第一行显示" + dtzRoom.line1cardNumber + "张 第二行显示" + dtzRoom.line2cardNumber + "张");
    },

    /**
     * 当前的这行 加上这个面值的牌 是否会超出这一行显示的上限
     * 如果是四副牌的情况 不适用这种防止拆开牌的策略 避免特殊情况显示超出界面
     */
    isOverLine: function (dtzRoom , index, curCards) {
        //cc.log("QFRoomModel.wanfa..." , QFRoomModel.wanfa);
        var cardValue = curCards.i;
        if (index > dtzRoom.firstLineLimit) {
            return true;
        } else {
            var cardTimes = this.getCardTimes(dtzRoom , cardValue);
            //cc.log("获取"+curCards.i + "的出现次数为" + cardTimes);
            if (dtzRoom.line2cardNumber + cardTimes > dtzRoom.firstLineLimit) {
                //cc.log("该卡牌已经超出");
                return true;
            } else {
                return false;
            }
        }
    },

    /**
     * 是否要显示在第第一行去
     */
    getShowLine: function (dtzRoom , curCards, index) {
        var tCardValue = curCards.i;
        var tCardId = curCards.cardId;
        if (dtzRoom.showCardMap3 != null && dtzRoom.showCardMap3[tCardValue] != null && QFRoomModel.isProtectedSort()) {
            return dtzRoom.showCardMap3[tCardValue];
        } else if (dtzRoom.showCardMap4 != null && dtzRoom.showCardMap4[index] != null && !QFRoomModel.isProtectedSort()) {
            return dtzRoom.showCardMap4[index];
        } else {
            //cc.log("获取卡牌的显示位置异常", tCardValue);
            return 1
        }
    },

    /**
     * 获取某张牌的出现次数
     */
    getCardTimes: function (dtzRoom , cardValue) {
        if (dtzRoom.cardMapData == null) {
            dtzRoom.cardMapData = QFAI.getCardsMap(dtzRoom._cards, false);
        }
        if (dtzRoom.cardMapData != null) {
            var cardMap = dtzRoom.cardMapData.cardMap;
            for (var key in cardMap) {
                key = parseInt(key);//c
                var times = parseInt(cardMap[key].times);
                if (key == cardValue) {
                    return times;
                }
            }
        }
        return 0;
    },

    createAction: function (realX, realY, i, actionType) {
        actionType == actionType || 1;
        var showSpeed = 0.25;
        var moveSpeed = 0.04;
        var beginPosx = realX;
        var beginPosY = realY;
        if (actionType == 1) {
            var actMoveto = cc.moveTo(1, cc.p(beginPosx, beginPosY));
            var showAndHide = cc.callFunc(this.onShowAndHide, this);
            var rep = cc.sequence(actMoveto, showAndHide);
            return rep;
        } else {
            var actMoveto = cc.moveTo(0.1 + i * moveSpeed, cc.p(beginPosx, beginPosY));
            var actRotateBy = cc.rotateBy(0.1 + i * moveSpeed, 2 * 180);
            var actSqwar = cc.spawn(actMoveto);//actRotateBy

            var actopmPrbotCamera = cc.orbitCamera(showSpeed, 1, 0, 0, -90, 0, 0);
            var actPrbotCamera2 = cc.orbitCamera(showSpeed, 1, 0, 90, -90, 0, 0);
            var showAndHide = cc.callFunc(this.onShowAndHide, this);

            var rep = cc.sequence(actSqwar, actopmPrbotCamera, showAndHide, actPrbotCamera2);
            return rep;
        }
    },

    onShowAndHide : function(sender){
        var tPuckObj = sender;
        tPuckObj.varNode.setVisible(true);
        tPuckObj.backNode.setVisible(false);
        tPuckObj.isAction = false;
    },

    getCardsObjOnHand: function(dtzRoom){
        var result = [];
        for (var i = 0; i < dtzRoom._cards.length; i++) {
            result.push(dtzRoom._cards[i]);
        }
        return result;
    },

    //是否已经分组完成
    checkGroupOver:function(){
        var players = QFRoomModel.players;
        var ateam = bteam = 0;
        var hasGrouped = false;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            p.group = QFRoomModel.getPlayerGroup(p);
            if(p.group == 1){
                ateam ++;
            }else if (p.group == 2){
                bteam ++;
            }
        }
        if(ateam == 2 && bteam == 2){
            hasGrouped = true;
        }else{
            hasGrouped = false;
        }
        return hasGrouped
    },

    //新增 开局前显示玩家所有状态
    updatePlayersStates:function(dtzRoom , messageStr){

        //先清理之前的显示
        for(var index = 1 ; index <= 4 ; index ++){
            var iconNode = dtzRoom.getWidget("sIcon_" + index);
            var stateNode = dtzRoom.getWidget("sName_" + index);
            var nameNode = dtzRoom.getWidget("state_" + index);
            var teamNode = dtzRoom.getWidget("team_" + index);

            teamNode.visible = false;
            nameNode.setString("");
            stateNode.setString("");
            if(iconNode.getChildByTag(345)){
                iconNode.removeChildByTag(345);
            }
        }
        //cc.log("msg ..." , JSON.stringify(messageStr));
        for(var curIndex = 0 ; curIndex < messageStr.length ; curIndex ++){
            //cc.log("msg ..." , JSON.stringify(messageStr[curIndex]));
            var curPlayerData = JSON.parse(messageStr[curIndex]);
            var playerId = parseInt(curPlayerData.userId);
            var playerSeat = parseInt(curPlayerData.seat);
            var isReady = parseInt(curPlayerData.ready);

            //cc.log("curPlayerData.userId" , curPlayerData.userId);
            var playerMsg = QFRoomModel.getPlayerVo(playerId);
            var iconUrl = playerMsg.icon;
            var playerName = playerMsg.name;
            var playerTeam = 0;
            if(playerSeat != 0){
                playerTeam = (playerSeat % 2 == 0 ? 2 : 1);
            }

            //显示界面
            var indexN = curIndex + 1;
            var iconNode = dtzRoom.getWidget("sIcon_" + indexN);
            var nameNode = dtzRoom.getWidget("sName_" + indexN);
            var stateNode = dtzRoom.getWidget("state_" + indexN);
            var teamNode = dtzRoom.getWidget("team_" + indexN);
            var teamDesc = "";

            nameNode.setString(playerName);
            if(playerTeam == 0){
                teamNode.visible = false;
            }else if(playerTeam == 1 || playerTeam == 2){
                teamNode.visible = true;
            }
            var defaultimg = (playerMsg.sex==1) ? "res/res_yjqf/images/default_m.png" : "res/res_yjqf/images/default_w.png";
            if(iconNode.getChildByTag(345))
                iconNode.removeChildByTag(345);

            var sprite = new cc.Sprite(defaultimg);
            sprite.setScale(0.96);
            //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
            this.showIcon(sprite,iconNode,iconUrl);
            //状态
            if(playerTeam == 0 ){
                stateNode.setString("选组中");
                stateNode.setColor(cc.color(255 , 0 , 0))
            }else if(isReady == 0 && playerTeam != 0){
                stateNode.setString("已选组");
                stateNode.setColor(cc.color(255 , 228 , 104))
            }else if(isReady != 0 && playerTeam != 0){
                /*                stateNode.setString("已准备");
                 stateNode.setColor(cc.color(0 , 161 , 15))*/
                stateNode.setString("已选组");
                stateNode.setColor(cc.color(255 , 228 , 104))
            }
        }

    },

    showIcon:function(sprite,iconNode,iconUrl){
        if(iconUrl){
            sprite.x = sprite.y = 0;
            try{
                var sten = new cc.Sprite("res/res_yjqf/images/img_14_c.png");
                sten.setScale(0.9);
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 50, y: 80, alphaThreshold: 0.8});
                clipnode.addChild(sprite);
                iconNode.addChild(clipnode,5,345);
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        sprite.setTexture(img);
                        sprite.x = 0;
                        sprite.y = 0;
                    }
                });
            }catch(e){}
        }else{
            sprite.x = 50;
            sprite.y = 80;
            iconNode.addChild(sprite,5,345);
        }

    },

    /**
     * 标记组成筒子的牌
     */
    signTongzi:function(curCards){
        //var repeatCardData = QFAI.getCardsMap(curCards , true);
        //var cardMap = repeatCardData.cardMap;
        //
        ////cardMap[card.c] = {cardValue:card.i ,times: 1, color: card.t, objList: []};
        //for (var key in cardMap) {
        //    key = parseInt(key);//c
        //    var times = parseInt(cardMap[key].times);
        //    var cardMsg = cardMap[key];
        //    //cc.log("比较的单牌" , key , times);
        //    if (times == 3) {
        //        //cc.log("找到筒子 面值为:", cardMsg.cardValue, " 花色为:", cardMsg.color);
        //        for(var index = 0 ; index < cardMsg.objList.length ; index ++ ){
        //            cardMsg.objList[index].tongziSp.visible = cardMsg.objList[index]._isTongzi = true;
        //        }
        //    }else{//可能之前是筒子 打过牌以后拆散了 去掉是筒子的标记
        //        for(var index = 0 ; index < cardMsg.objList.length ; index ++){
        //            cardMsg.objList[index].tongziSp.visible = cardMsg.objList[index]._isTongzi = false;
        //        }
        //    }
        //}
    },


    /**
     * 是否有炸弹被拆散
     * @returns {boolean}
     */
    isBombBreak: function (dtzRoom) {
        var cardsOnHand = this.getCardsObjOnHand(dtzRoom);
        var temp = {};
        var bombi = [];//记录所有的炸弹
        for (var i = 0; i < cardsOnHand.length; i++) {
            var card = cardsOnHand[i];
            if (temp[card.i]) {
                if(card.isSpecialCard() == 0){//炸弹只计算 非筒子 地炸 喜的牌
                    temp[card.i] += 1;
                }
            } else {
                temp[card.i] = 1;
            }
            if (temp[card.i] >= 4){
                bombi.push(card.i);
            }
        }

        if (dtzRoom._curChoiceCardsTypeData != null && dtzRoom._curChoiceCardsTypeData.type >= QFAI.BOMB){
            if(dtzRoom._curChoiceCardsTypeData.type == QFAI.BOMB){
                if(temp[dtzRoom._curChoiceCardsTypeData.value] > dtzRoom._curChoiceCardsTypeData.repeatNum){
                    return true; //这种情况是 玩家选择的炸弹 比他拥有的炸弹数量要少
                }
            }
            return false;
        }

        var isHas = false;
        for (var i = 0; i < dtzRoom._allCards.length; i++) {
            var card = dtzRoom._allCards[i];
            if (ArrayUtil.indexOf(bombi, card.i) >= 0) {
                isHas = true;
                break;
            }
        }
        return isHas;
    },

    /**
     * 增加保护 筒子 地炸 囍 的排序规则 重连/发牌动画
     * @param cardList
     */
    fixSort:function(dtzRoom , showAction, callback){
        if(dtzRoom._cards.length == 0){
            return;
        }
        dtzRoom.cardMapData = QFAI.getCardsMap(dtzRoom._cards);
        
        for(var i = 0; i < dtzRoom._cards.length; i++) {
            dtzRoom._cards[i].visible = false;
            dtzRoom._cardPanel.addChild(dtzRoom._cards[i]);
        }
        //设置具体的显示位置
        var winSize = cc.director.getWinSize();
        var centerX = (winSize.width - dtzRoom._cardW) / 2;
        this.updateShowMap(dtzRoom,dtzRoom._cards);

        function packCardsGroup(cards) {
            var ArrayByCardId = [];
            var ArrayCount = -1;
            var cardid = 0;

            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (cardid != card.n) {
                    cardid = card.n;
                    ArrayCount++;
                    ArrayByCardId[ArrayCount] = [];
                }
                ArrayByCardId[ArrayCount].push(card);
            }
            return ArrayByCardId;
        }

        function displayHandCards(_ArrayByCard){
            var _ArrayByCardId = packCardsGroup(_ArrayByCard)
            var initX = QFRoomModel.CardMidX;
            initX -= (_ArrayByCardId.length-1)/2*dtzRoom._cardG;
            var cardid = 0;

            for (var key in _ArrayByCardId) {
                var cardArray = _ArrayByCardId[key];
                for (var i = 0; i < cardArray.length; i++) {
                    var card = cardArray[i];
                    card.cardId = cardid++;
                    card.setLocalZOrder(12-i);
                    var realX = initX,realY;
                    if(cardArray.length >= 4){
                        card._BoomNumber = cardArray.length;
                        realY = dtzRoom.initCardYLine2+dtzRoom._cardY1*i;
                    }else{
                        realY = dtzRoom.initCardYLine2+dtzRoom._cardY2*i;
                    }

                    card.realX = realX;
                    card.realY = realY;
                    card.x = centerX;//realX;
                    card.y = realY;

                    card.visible = true;
                    card.varNode.visible = false;
                    card.backNode.visible = true;
                    //cc.log("realX="+realX+"realY ="+ realY)
                    if (!showAction) {
                        // var rep = QFExfunc.createAction(realX, realY, i);
                        // var camera = new cc.ActionCamera();
                        // camera.startWithTarget(card);
                        // card.tEye = camera.getEye();
                        // card.isAction = true;
                        // card.curAction = rep;
                        // var callfunc = cc.callFunc(function(){
                        //     callback();
                        // });
                        // card.runAction(cc.sequence(rep,callfunc));
                        card.varNode.visible = true;
                        card.backNode.visible = false;
                        card.x = realX;
                        card.y = realY;
                        if(callback)
                            callback();
                    } else {
                        card.varNode.visible = true;
                        card.backNode.visible = false;
                        card.x = realX;
                        card.y = realY;
                    }
                    //cc.log("i = "+i+"cardArray.length = "+cardArray.length);
                    if(i == cardArray.length-1){
                        initX += dtzRoom._cardG;
                        if(cardArray.length >= 4){
                            if (!card.cardCount) {
                                card.cardCount = new cc.Sprite("res/res_yjqf/images/qfCardCount_" + cardArray.length + ".png");
                                card.cardCount.y = card.height + 20;
                                card.cardCount.x = card.width / 2;
                                card.addChild(card.cardCount);
                            }else{
                                card.cardCount.setTexture("res/res_yjqf/images/qfCardCount_" + cardArray.length + ".png");
                            }
                        }
                    }else if(card.cardCount){
                        card.cardCount.removeFromParent(true);
                        card.cardCount = null;
                    }
                }
            }
        }
        if(!showAction){
            dtzRoom._cards.sort(function (item2, item1) {
                return item1.i - item2.i;
            });
            displayHandCards(dtzRoom._cards);
        }else{
            var initX = 240;
            var initY = 720;
            var mergetime = 0.2; //将牌合并的时间
            var shufftime = 0.06; //牌发下去的时间
            var shuffdis = 500; //牌发下去的距离

            if(QFRoomModel.cutCardid && QFRoomModel.nowBurCount == 1){
                var tmpcard = QFAI.getCardDef(QFRoomModel.cutCardid);
                tmpcard = new QFBigCard(tmpcard);
                tmpcard.setPosition(QFRoomModel.cutPoint, initY);
                dtzRoom.addChild(tmpcard);
                var move = cc.moveTo(0.3, cc.p(cc.winSize.width/2, tmpcard.y));
                var delay1 = cc.delayTime(mergetime*2.5+5*shufftime);
                var callfunc1 = cc.callFunc(function(){
                    tmpcard.setLocalZOrder(100);
                });
                var delay2 = cc.delayTime(5*shufftime);
                var target = dtzRoom._players[QFRoomModel.nextSeat].iconbg;
                var moveto = cc.moveTo(5*shufftime, cc.p(target.x, target.y));
                var delay3 = cc.delayTime(15*shufftime);
                var callfunc2 = cc.callFunc(function(){
                    tmpcard.removeFromParent(true);
                });
                tmpcard.runAction(cc.sequence([move, delay1,callfunc1,delay2,moveto,delay3,callfunc2]));
            }
            var shuffleArray = ArrayUtil.shuffle(dtzRoom._cards);
            var count = 0;
            function batchOutCards(){ //将打乱的牌分批发出去
                count++;
                if (count <= 7) {
                    var tempArray = shuffleArray.slice(0, parseInt(count / 7 * shuffleArray.length));
                    tempArray.sort(function (item2, item1) {
                        return item1.i - item2.i;
                    });
                    displayHandCards(tempArray);
                }
                if(count == 7){
                    callback();
                }
            }

            for (var i = 0; i < 10; i++) {
                var card = new cc.Sprite("res/res_yjqf/qfcutcard/cut_card_3.png");
                card.x = initX;
                card.y = initY;
                dtzRoom.addChild(card);
                initX += 10+parseInt(Math.random() * 15);
                card.setLocalZOrder(i);
                let direct = i%3;
                var actionBy1 = cc.moveTo(mergetime, cc.p(870, initY));
                var delaytime1 = cc.delayTime(mergetime/2);
                var actionBy2 = cc.moveTo(mergetime, cc.p(cc.winSize.width/2, initY));
                var delaytime2 = cc.delayTime((i+11)*shufftime);
                var spawn;
                if(direct == 0){
                    spawn = cc.spawn(cc.moveBy(shufftime,cc.p(0, -1*shuffdis)), cc.fadeOut(shufftime));
                }else if(direct == 1){
                    spawn = cc.spawn(cc.moveBy(shufftime,cc.p(shuffdis, 50)), cc.fadeOut(shufftime));
                }else if(direct == 2){
                    spawn = cc.spawn(cc.moveBy(shufftime,cc.p(-1*shuffdis, 50)), cc.fadeOut(shufftime));
                }
                var callfunc = cc.callFunc(function(sender){
                    // cc.log("sender",JSON.stringify(sender))
                    sender.removeFromParent(true);
                    if(direct == 0)
                        batchOutCards();
                });
                card.runAction(cc.sequence([actionBy1,delaytime1,actionBy2,delaytime2,spawn,callfunc]));
            }
            initX = 1440;
            for (var i = 1; i <= 10; i++) {
                var card = cc.Sprite("res/res_yjqf/qfcutcard/cut_card_3.png");
                card.x = initX;
                card.y = initY;
                dtzRoom.addChild(card);
                initX -= 10+parseInt(Math.random() * 15);
                card.setLocalZOrder(20-i);
                let direct = (20-i)%3;
                var actionBy1 = cc.moveTo(mergetime, cc.p(1050, initY));
                var delaytime1 = cc.delayTime(mergetime/2);
                var actionBy2 = cc.moveTo(mergetime, cc.p(cc.winSize.width/2, initY));
                var delaytime2 = cc.delayTime(i*shufftime);
                if(direct == 0){
                    spawn = cc.spawn(cc.moveBy(shufftime,cc.p(0, -1*shuffdis)), cc.fadeOut(shufftime));
                }else if(direct == 1){
                    spawn = cc.spawn(cc.moveBy(shufftime,cc.p(shuffdis, 50)), cc.fadeOut(shufftime));
                }else if(direct == 2){
                    spawn = cc.spawn(cc.moveBy(shufftime,cc.p(-1*shuffdis, 50)), cc.fadeOut(shufftime));
                }
                var callfunc = cc.callFunc(function(sender){
                    // cc.log("card",JSON.stringify(sender))
                    sender.removeFromParent(true);
                    if(direct == 0)
                        batchOutCards();
                });
                if(i == 1){
                    card.runAction(cc.sequence([actionBy1,delaytime1,actionBy2,delaytime2,cc.callFunc(function(){
                        AudioManager.play("res/res_yjqf/audio/qfSound/sendCardLong.mp3");
                    }),spawn,callfunc]));
                }else{
                    card.runAction(cc.sequence([actionBy1,delaytime1,actionBy2,delaytime2,spawn,callfunc]));
                }
            }
        }
    },

    /**
     * 判断某玩家已经出完牌了(是否已经显示名词)
     * @returns {Array.<CardVo>}
     */
    isPlayerHasNoCard: function(qfRoom , playerSeq){
        var playNode = qfRoom.getWidget("player" + playerSeq);
        if(playNode){
            for(var index = 1 ; index <= 4 ; index ++){
                var mingciNode = ccui.helper.seekWidgetByName(playNode, "mingciSp" + index);
                if(mingciNode && mingciNode.visible == true){
                    //cc.log("玩家" + playerSeq +" 是" + index + "名");
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * 获取玩家手牌数据
     * @returns {Array.<CardVo>}
     */
    getCardsOnHand: function (dtzRoom) {
        var result = [];
        for (var i = 0; i < dtzRoom._cards.length; i++) {
            result.push(dtzRoom._cards[i].getData());
        }
        return result;
    },


    /**
     * 创建一个给标签执行的动作
     * @returns {Array.<CardVo>}
     */
    lableAction:function(x , y){
        var pzLableColor = QFRoomModel._pzLableColor;
        var tjump = cc.jumpTo(1 , cc.p(x , y) , 10 , 2);
        var tchangeColor = cc.sequence(cc.tintTo(0.25 , 255 , 0 , 0) , cc.tintTo(0.25 , 113 , 210 , 146) ,
            cc.tintTo(0.25 , 255 , 0 , 0) , cc.tintTo(0.25 , pzLableColor[0] , pzLableColor[1] , pzLableColor[2]));
        var tAction = cc.spawn(tjump , tchangeColor);
        return tAction;
    },

    updateXifen:function(dtzRoom){
        for(var i=1;i<=dtzRoom._renshu;i++) {
            if(dtzRoom._players[i])
                dtzRoom._players[i].refreshAllScore();
        }
    },
    /**
     * 刷新记录的牌面分数显示
     */
    updateRoomCount:function(dtzRoom){
        //cc.log("刷新界面显示..." , this.roomCurScore)
        //刷新 5 10 k的个数
        if(dtzRoom.roomFiveNumLable != null && dtzRoom.roomTenNumLable != null && dtzRoom.roomKNumLable != null){
            //cc.log("dtzRoom.roomFiveNum",dtzRoom.roomFiveNum,dtzRoom.roomTenNum,dtzRoom.roomKNum,dtzRoom.roomCurScore)
            dtzRoom.roomFiveNumLable.setString(dtzRoom.roomFiveNum+"个");
            dtzRoom.roomTenNumLable.setString(dtzRoom.roomTenNum+"个");
            dtzRoom.roomKNumLable.setString(dtzRoom.roomKNum+"个");
            //dtzRoom.curScoreLable.setString(dtzRoom.roomCurScore +"分");
        }
        //QFRoomModel.aTeamScore = dtzRoom.aTeamAllScore;
        //QFRoomModel.bTeamScore = dtzRoom.bTeamAllScore;
        //QFRoomModel.cTeamScore = dtzRoom.cTeamAllScore;
        //QFRoomModel.aTeamTongziScore = dtzRoom.aTeamTongziScore;
        //QFRoomModel.bTeamTongziScore = dtzRoom.bTeamTongziScore;
        //QFRoomModel.cTeamTongziScore = dtzRoom.cTeamTongziScore;
        //QFRoomModel.aTeamCurScore = dtzRoom.curaTeamScore;
        //QFRoomModel.bTeamCurScore = dtzRoom.curbTeamScore;
        //QFRoomModel.cTeamCurScore = dtzRoom.curcTeamScore;
        for(var i=1;i<=dtzRoom._renshu;i++) {
            if(dtzRoom._players[i])
                dtzRoom._players[i].refreshAllScore();
        }
        //刷新a b组 当局的分数
        //if(dtzRoom.aTeamCurScoreLable != null && dtzRoom.bTeamCurScoreLable != null && dtzRoom.cTeamCurScoreLable != null){
        //    var tAScore = dtzRoom.aTeamCurScoreLable.getString();
        //    var tBScore = dtzRoom.bTeamCurScoreLable.getString();
        //    var tScoreNode = null;
        //    //cc.log("this.curaTeamScore ...this.curbTeamScore ..." , dtzRoom.curaTeamScore + " " + dtzRoom.curbTeamScore +" " + tAScore + " " + tBScore);
        //    if(tAScore != dtzRoom.curaTeamScore){
        //        //执行动作
        //        //cc.log("刷新A组的当局分数为" , dtzRoom.curaTeamScore);
        //        dtzRoom.aTeamCurScoreLable.setString(dtzRoom.curaTeamScore);
        //        tScoreNode = dtzRoom.aTeamCurScoreLable;
        //    }
        //    if(tBScore != dtzRoom.curbTeamScore){
        //        //执行动作
        //        //cc.log("刷新B组的当局分数为" , dtzRoom.curbTeamScore);
        //        dtzRoom.bTeamCurScoreLable.setString(dtzRoom.curbTeamScore);
        //        tScoreNode = dtzRoom.bTeamCurScoreLable;
        //    }
		//
		//
        //    var tCScore = dtzRoom.cTeamCurScoreLable.getString();
        //    if(tCScore != dtzRoom.curcTeamScore){
        //        //执行动作
        //        //cc.log("刷新C组的当局分数为" , dtzRoom.curcTeamScore);
        //        dtzRoom.cTeamCurScoreLable.setString(dtzRoom.curcTeamScore);
        //        tScoreNode = dtzRoom.cTeamCurScoreLable;
        //    }
		//
        //    if(tScoreNode){
        //        //执行动作
        //        //cc.log("分数执行动作...");
        //        var tAction = this.lableAction(tScoreNode.x , tScoreNode.y);
        //        //创建一个变色的动作
        //        tScoreNode.runAction(tAction);
        //    }
        //}
        //刷新 a b组 总的地炸/筒子分 (如果是四副牌模式 这里刷新的是喜总分)
        //if(dtzRoom.aTongziScoreLable != null && dtzRoom.bTongziScoreLable != null && dtzRoom.cTongziScoreLable != null){
        //    var tAtongziScore = dtzRoom.aTongziScoreLable.getString();
        //    var tBtongziScore = dtzRoom.bTongziScoreLable.getString();
        //    var tScoreNode = null;
        //    if(tAtongziScore != dtzRoom.aTeamTongziScore){
        //        dtzRoom.aTongziScoreLable.setString(dtzRoom.aTeamTongziScore);
        //        tScoreNode = dtzRoom.aTongziScoreLable;
        //    }
        //    if(tBtongziScore != dtzRoom.bTeamTongziScore){
        //        dtzRoom.bTongziScoreLable.setString(dtzRoom.bTeamTongziScore);
        //        tScoreNode = dtzRoom.bTongziScoreLable;
        //    }
		//
        //    var tCtongziScore = dtzRoom.cTongziScoreLable.getString();
        //    if(tCtongziScore != dtzRoom.cTeamTongziScore){
        //        dtzRoom.cTongziScoreLable.setString(dtzRoom.cTeamTongziScore);
        //        tScoreNode = dtzRoom.cTongziScoreLable;
        //    }
		//
        //    if(tScoreNode){
        //        //执行动作
        //        var tAction = this.lableAction(tScoreNode.x , tScoreNode.y);
        //        //创建一个变色的动作
        //        tScoreNode.runAction(tAction);
        //    }
        //}

        //刷新a b组的总分
        //if(dtzRoom.aTeamScoreLable != null && dtzRoom.bTeamScoreLable != null && dtzRoom.cTeamScoreLable != null){
        //    var tATeamScore = dtzRoom.aTeamScoreLable.getString();
        //    var tBteamScore = dtzRoom.bTeamScoreLable.getString();
        //    if(tATeamScore != dtzRoom.aTeamAllScore){
        //        dtzRoom.aTeamScoreLable.setString(dtzRoom.aTeamAllScore);
        //    }
        //    if(tBteamScore != dtzRoom.bTeamAllScore){
        //        dtzRoom.bTeamScoreLable.setString(dtzRoom.bTeamAllScore);
        //    }
		//
        //    var tCteamScore = dtzRoom.cTeamScoreLable.getString();
        //    if(tCteamScore != dtzRoom.cTeamAllScore){
        //        dtzRoom.cTeamScoreLable.setString(dtzRoom.cTeamAllScore);
        //    }
        //}
    },

    /**
     * 计算这一圈打出的牌分 和 5 10 K数量
     */
    countCurScoreAndNumber:function(dtzRoom , cardList){
        if(cardList.length < 0){
            return
        }else{
            var roomFiveNum = 0;
            var roomTenNum = 0;
            var roomKNum = 0;
            var roomCurScore = 0;
            for(var index = 0 ; index < cardList.length ; index ++){
                var tCardData = QFAI.getCardDef(cardList[index]);
                //cc.log("tCardData.i..." , tCardData.i);
                if(tCardData.n == 5){
                    roomCurScore += 5;
                    roomFiveNum ++;
                }else if(tCardData.n == 10){
                    roomCurScore += 10;
                    roomTenNum ++;
                }else if(tCardData.n == 13){
                    roomCurScore += 10;
                    roomKNum ++;
                }
            }
            dtzRoom.roomFiveNum =  roomFiveNum;
            dtzRoom.roomTenNum = roomTenNum;
            dtzRoom.roomKNum = roomKNum;
            dtzRoom.roomCurScore = roomCurScore;
        }
        this.updateRoomCount(dtzRoom);
    },

    /**
     * 清空这圈记录的几个数据
     */
    cleanSomeCount:function(dtzRoom){
        dtzRoom.roomKNum = 0;
        dtzRoom.roomFiveNum = 0;
        dtzRoom.roomTenNum = 0;
        dtzRoom.roomCurScore = 0;
        //cc.log("dtzRoom.roomFiveNum",dtzRoom.roomFiveNum,dtzRoom.roomTenNum,dtzRoom.roomKNum,dtzRoom.roomCurScore)
    },

    /**
     * 分组完成 刷新各个玩家的座位
     *
     */
    updatePlayerMsg:function(dtzRoom , messageData){
        dtzRoom.getWidget("LableChoiceTeam").visible = false;

        //cc.log("onUpdatePlayerMsg..." + JSON.stringify(messageData));
        //移除已经显示的四张 选择分组的卡牌
        var curPlayer = null;
        var realSeat = null;

        dtzRoom.choiceSeatBtn2.visible = false;
        dtzRoom.choiceSeatBtn3.visible = false;
        dtzRoom.choiceSeatBtn4.visible = false;

        //首先更新自己的座位 因为其他玩家的实际显示顺序是依赖自己的座位计算的
        for(var seat = 0 ; seat < messageData.length ; seat ++){
            if(messageData[seat] == PlayerModel.userId){
                QFRoomModel.mySeat = seat + 1;//数组下标从1开始的
            }
        }

        for (var i = 0; i < messageData.length; i++) {
            var userId = messageData[i];
            var realSeat = i + 1;
            var teamId = (i % 2 == 0 ) ? 1 : 2;
            for(var j = 0 ; i < QFRoomModel.players.length ; j++) {
                if (QFRoomModel.players[j].userId == userId) {
                    curPlayer = QFRoomModel.players[j];
                    //修改玩家的座位信息
                    curPlayer.seat = realSeat;

                    var seq = dtzRoom.getPlayerSeq(curPlayer.userId, QFRoomModel.mySeat, curPlayer.seat);
                    //cc.log("修正玩家:" + curPlayer.name + "位置改为" + realSeat + "显示的位置为" + seq);
                    dtzRoom._players[realSeat] = new QFCardPlayer(curPlayer, dtzRoom.root, seq, teamId);
                    break;
                }
            }
        }

        for(var index = 1 ; index <= 4 ; index ++){
            var curPlayer = dtzRoom._players[index];
            dtzRoom.getWidget("zhunbei" + curPlayer.seq).visible = false;

            //cc.log("每个玩家的状态 curPlayer._status" , curPlayer._status);
            if(curPlayer._status == 1){
                //cc.log("分组以后 已经准备的玩家 显示已经准备" , index , curPlayer.seq);
                dtzRoom.getWidget("zhunbei" + curPlayer.seq).visible = true;
                curPlayer.showStatus(curPlayer._status);

            }
        }

        //是否显示我自身的准备按钮
        if(dtzRoom._players[QFRoomModel.mySeat]._status == 1){
            dtzRoom.Button_30.visible = false;
        }else{
            dtzRoom.Button_30.visible = true;
        }

    },

};