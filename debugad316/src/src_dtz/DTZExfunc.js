/**
 * Created by xf on 2017/8/18.
 */
//转移部分 DTZRoom数据处理的代码过来

/**
 * 判断所有牌应该显示在哪一行(不可以拆开)
 */

var DTZExfunc = {

    updateShowMap: function (dtzRoom , cardList) {
        dtzRoom.showCardMap3 = {};//三副牌 保护连续相同牌不拆开
        dtzRoom.showCardMap4 = {};//四副牌
        dtzRoom.line1cardNumber = 0;
        dtzRoom.line2cardNumber = 0;
        cardList = dtzRoom._cards;
        if (DTZRoomModel.isProtectedSort()) {
            //cc.log("dtzRoom.firstLineLimit1...", dtzRoom.firstLineLimit);
            for (var index = 0; index < cardList.length; index++) {
                var tCurCard = cardList[index];
                if (this.isOverLine(dtzRoom ,index, tCurCard) == false) {
                    dtzRoom.showCardMap3[tCurCard.i] = 2;
                } else {
                    dtzRoom.showCardMap3[tCurCard.i] = 1;
                }
            }
        } else if (!DTZRoomModel.isProtectedSort()) {
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
        //cc.log("DTZRoomModel.wanfa..." , DTZRoomModel.wanfa);
        var cardValue = curCards.i;
        if (index > dtzRoom.firstLineLimit) {
            return true;
        } else {
            var cardTimes = this.getCardTimes(dtzRoom , cardValue);
            //cc.log("获取"+curCards.i + "的出现次数为" + cardTimes);
            if (dtzRoom.line2cardNumber + cardTimes > dtzRoom.firstLineLimit && DTZRoomModel.is3FuPai()) {
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
        if (dtzRoom.showCardMap3 != null && dtzRoom.showCardMap3[tCardValue] != null && DTZRoomModel.isProtectedSort()) {
            return dtzRoom.showCardMap3[tCardValue];
        } else if (dtzRoom.showCardMap4 != null && dtzRoom.showCardMap4[index] != null && !DTZRoomModel.isProtectedSort()) {
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
            dtzRoom.cardMapData = DTZAI.getCardsMap(dtzRoom._cards, false);
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
        var players = DTZRoomModel.players;
        var ateam = bteam = 0;
        var hasGrouped = false;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            p.group = DTZRoomModel.getPlayerGroup(p);
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
        if(!DTZRoomModel.is4Ren()){
            cc.log("非四人模式不需要调用");
            return;
        }
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
        cc.log("msg ..." , JSON.stringify(messageStr));
        for(var curIndex = 0 ; curIndex < messageStr.length ; curIndex ++){
            //cc.log("msg ..." , JSON.stringify(messageStr[curIndex]));
            var curPlayerData = JSON.parse(messageStr[curIndex]);
            var playerId = parseInt(curPlayerData.userId);
            var playerSeat = parseInt(curPlayerData.seat);
            var isReady = parseInt(curPlayerData.ready);

            //cc.log("curPlayerData.userId" , curPlayerData.userId);
            var playerMsg = DTZRoomModel.getPlayerVo(playerId);
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
                if(playerTeam == 1){
                    teamDesc = "A组";
                    teamNode.loadTexture("res/res_dtz/dtzRoom/a.png");
                }else{
                    teamDesc = "B组";
                    teamNode.loadTexture("res/res_dtz/dtzRoom/b.png");
                }
            }
            var defaultimg = (playerMsg.sex==1) ? "res/res_dtz/images/default_m.png" : "res/res_dtz/images/default_w.png";
            if(iconNode.getChildByTag(345))
                iconNode.removeChildByTag(345);

            var sprite = new cc.Sprite(defaultimg);
            sprite.setScale(0.96);
            //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
            this.showIcon(sprite,iconNode,iconUrl)
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
                var sten = new cc.Sprite("res/res_dtz/images/img_14_c.png");
                sten.setScale(0.9);
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 75, y: 120, alphaThreshold: 0.8});
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
            sprite.x = 75;
            sprite.y = 120;
            iconNode.addChild(sprite,5,345);
        }

    },

    /**
     * 标记组成筒子的牌
     */
    signTongzi:function(curCards){
        var repeatCardData = DTZAI.getCardsMap(curCards , true);
        var cardMap = repeatCardData.cardMap;

        //cardMap[card.c] = {cardValue:card.i ,times: 1, color: card.t, objList: []};
        for (var key in cardMap) {
            key = parseInt(key);//c
            var times = parseInt(cardMap[key].times);
            var cardMsg = cardMap[key];
            //cc.log("比较的单牌" , key , times);
            if (times == 3) {
                //cc.log("找到筒子 面值为:", cardMsg.cardValue, " 花色为:", cardMsg.color);
                for(var index = 0 ; index < cardMsg.objList.length ; index ++ ){
                    cardMsg.objList[index].tongziSp.visible = cardMsg.objList[index]._isTongzi = true;
                }
            }else{//可能之前是筒子 打过牌以后拆散了 去掉是筒子的标记
                for(var index = 0 ; index < cardMsg.objList.length ; index ++){
                    cardMsg.objList[index].tongziSp.visible = cardMsg.objList[index]._isTongzi = false;
                }
            }
        }
    },

    /**
     * 标记组成地炸的牌
     *
     * @param cards
     */
    signSuperBoom:function(curCards){
        if(DTZRoomModel.is4FuPai()){  //四副牌玩法没有地炸 直接return
            return;
        }

        var mapData = DTZAI.getCardsMap(curCards , false);
        var cardMap = mapData.cardMap;

        for (var key in cardMap) {
            key = parseInt(key);
            var times = parseInt(cardMap[key].times);
            var objList = cardMap[key].objList;
            //大于8才可能是地炸
            if(times >= 8){
                var isSuperBoom = true;
                var colorMapData = DTZAI.getCardsMap(objList , true);
                var superBoomObjList = [];
                var colorMap = colorMapData.cardMap;
                var colorNum = 0;

                for (var key in colorMap) {
                    var times = parseInt(colorMap[key].times);
                    if(times < 2){//任何一种颜色的出现次数不能小于2
                        isSuperBoom = false;
                        //cc.log("有同色卡少于两张");
                    }else{
                        superBoomObjList.push(colorMap[key].objList[times - 2]);
                        superBoomObjList.push(colorMap[key].objList[times - 1]);
                    }
                    colorNum++;
                }

                if(colorNum < 4){
                    isSuperBoom = false;
                    //cc.log("没有集齐四种颜色");
                }

                //cc.log("superBoomObjList.length..." , superBoomObjList.length)
                for (var index = 0 ; index < superBoomObjList.length  ; index ++){
                    superBoomObjList[index].superBoomSp.visible = superBoomObjList[index]._isSuperBoom = isSuperBoom; //显示地炸的特殊标识
                }

                if(isSuperBoom){
                    for (var indexOrg = 0 ; indexOrg < objList.length ; indexOrg ++) {//优先显示地炸
                        //if(objList[indexOrg]._isSuperBoom){
                        objList[indexOrg].tongziSp.visible = objList[indexOrg]._isTongzi = false;
                        //}
                    }
                }else{//否则去掉地炸标识
                    for (var indexOrg = 0 ; indexOrg < objList.length ; indexOrg ++) {//优先显示地炸
                        objList[indexOrg].superBoomSp.visible = objList[indexOrg]._isSuperBoom = false;
                    }
                }

                if(isSuperBoom){
                    //cc.log("找到地炸！");
                    //return objList;
                }
            }else{
                for (var indexOrg = 0 ; indexOrg < objList.length ; indexOrg ++) {//
                    objList[indexOrg].superBoomSp.visible = objList[indexOrg]._isSuperBoom = false;
                }
            }
        }
    },

    /**
     * 标记喜
     */
    signXi:function(curCards){
        //
        if(DTZRoomModel.is3FuPai()){  //三副牌玩法没有喜 直接return
            return;
        }

        var repeatCardData = DTZAI.getCardsMap(curCards , true);
        var cardMap = repeatCardData.cardMap;

        //cardMap[card.c] = {cardValue:card.i ,times: 1, color: card.t, objList: []};
        for (var key in cardMap) {
            key = parseInt(key);//c
            var times = parseInt(cardMap[key].times);
            var cardMsg = cardMap[key];
            //cc.log("比较的单牌" , key , times);
            if (times == 4) {
                //cc.log("找到喜 面值为:", cardMsg.cardValue, " 花色为:", cardMsg.color);
                for(var index = cardMsg.objList.length - 1 ; index >= 0 ; index -- ){
                    if(cardMsg.objList[index]._isSuperBoom == false){
                        cardMsg.objList[index].xiSp.visible = cardMsg.objList[index]._isXi = true;
                    }
                }
            }else{//可能之前是喜 打过牌以后拆散了 去掉是喜的标记
                for(var index = 0 ; index < cardMsg.objList.length ; index ++){
                    cardMsg.objList[index].xiSp.visible = cardMsg.objList[index]._isXi = false;
                }
            }
        }
    },

    /**
     * 是否有筒子被拆散
     */
    isTongziBreak:function(dtzRoom){
        if(dtzRoom._curChoiceCardsTypeData != null && dtzRoom._curChoiceCardsTypeData.type == DTZAI.TONGZI){
            return false;
        }

        for (var i = 0; i < dtzRoom._curChoiceCards.length; i++) {
            var card = dtzRoom._curChoiceCards[i];
            if(card.tongziSp.visible == true){
                return true;
            }
        }
    },

    /**
     * 是否有地炸被拆散
     */
    isSuperBoomBreak:function(dtzRoom){
        if(dtzRoom._curChoiceCardsTypeData != null && dtzRoom._curChoiceCardsTypeData.type == DTZAI.SUPERBOOM){
            return false;
        }

        for (var i = 0; i < dtzRoom._curChoiceCards.length; i++) {
            var card = dtzRoom._curChoiceCards[i];
            if(card.superBoomSp.visible == true){
                return true;
            }
        }

    },

    /**
     * 是否有喜被拆散
     */
    isXiBreak:function(dtzRoom){
        if(dtzRoom._curChoiceCardsTypeData != null && dtzRoom._curChoiceCardsTypeData.type == DTZAI.XI){
            return false;
        }

        for (var i = 0; i < dtzRoom._curChoiceCards.length; i++) {
            var card = dtzRoom._curChoiceCards[i];
            if(card.xiSp.visible == true){
                return true;
            }
        }
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

        if (dtzRoom._curChoiceCardsTypeData != null && dtzRoom._curChoiceCardsTypeData.type >= DTZAI.BOMB){
            if(dtzRoom._curChoiceCardsTypeData.type == DTZAI.BOMB){
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
     * 增加保护 筒子 地炸 囍 的排序规则
     * @param cardList
     */
    fixSort:function(dtzRoom , showAction){
        var cards = dtzRoom._cards;
        dtzRoom.cardMapData = DTZAI.getCardsMap(dtzRoom._cards);
        dtzRoom._cards.sort(function (item2, item1) {
            if (item1.i != item2.i) {
                return item2.i - item1.i;
            } else {
                if( (item2.isSpecialCard() != item1.isSpecialCard()) ){
                    return item2.isSpecialCard() - item1.isSpecialCard()
                }else{
                    return item2.t - item1.t;
                }
            }
        });

        //设置具体的显示位置
        var winSize = cc.director.getWinSize();
        var centerX = (winSize.width - dtzRoom._cardW) / 2;
        var centerY = (winSize.height) / 2;
        //var initX = (winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2;
        var initX = dtzRoom.initX;
        this.updateShowMap(dtzRoom,dtzRoom._cards);

        var offX = 0;
        if(dtzRoom.line2cardNumber < dtzRoom.firstLineLimit){
            offX = (dtzRoom.firstLineLimit - dtzRoom.line2cardNumber - 1) * dtzRoom._cardG * 0.5;
            initX = initX + offX;
            //cc.log("修正显示位置...");
        }

        cc.log("修正显示位置...",dtzRoom.initCardYLine1,dtzRoom.initCardYLine2);

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.cardId = i;
            card.setLocalZOrder(i);
            card.setLine(2);

            var cardSize = card.getContentSize();
            var cardWidth = cardSize.width * card.scale;
            var cardHeight = cardSize.height * card.scale;
            var realX = initX + (i + 1) * dtzRoom._cardG * card.scale + cardWidth * 0.5;
            var realY = dtzRoom.initCardYLine2;

            var showLine = DTZExfunc.getShowLine(dtzRoom , card , i);

            if(showLine == 1){
                realX = initX + (i - dtzRoom.line2cardNumber + 1) * dtzRoom._cardG * card.scale + cardWidth * 0.5;
                realY = dtzRoom.initCardYLine1;
                card.setLocalZOrder(-1);
                card.setLine(1);
            }
            card.realX = realX;
            card.realY = realY;
            card.x = centerX;
            card.y = realY;
            dtzRoom._cardPanel.addChild(card);
            // cc.log("realY =",realY);
            card.varNode.visible = false;
            card.backNode.visible = true;
            //var rep = this.createAction(realX, realY, i);
            var rep = this.createAction(realX , realY , i);
            if (showAction) {
                var camera = new cc.ActionCamera();
                camera.startWithTarget(card);
                card.tEye = camera.getEye();
                card.isAction = true;
                card.curAction = rep;
                card.runAction(rep);
            } else {
                card.varNode.visible = true;
                card.backNode.visible = false;
                card.x = realX;
                card.y = realY;
            }
        }
    },

    /**
     * 判断某玩家已经出完牌了(是否已经显示名词)
     * @returns {Array.<CardVo>}
     */
    isPlayerHasNoCard: function(dtzRoom , playerSeq){
        var playNode = dtzRoom.getWidget("player" + playerSeq);
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
        var pzLableColor = DTZRoomModel._pzLableColor;
        var tjump = cc.jumpTo(1 , cc.p(x , y) , 10 , 2);
        var tchangeColor = cc.sequence(cc.tintTo(0.25 , 255 , 0 , 0) , cc.tintTo(0.25 , 113 , 210 , 146) ,
            cc.tintTo(0.25 , 255 , 0 , 0) , cc.tintTo(0.25 , pzLableColor[0] , pzLableColor[1] , pzLableColor[2]));
        var tAction = cc.spawn(tjump , tchangeColor);
        return tAction;
    },

    /**
     * 刷新记录的牌面分数显示
     */
    updateRoomCount:function(dtzRoom){
        //cc.log("刷新界面显示..." , this.roomCurScore)
        //刷新 5 10 k的个数
        if(dtzRoom.roomFiveNumLable != null && dtzRoom.roomTenNumLable != null && dtzRoom.roomKNumLable != null){
            dtzRoom.roomFiveNumLable.setString(dtzRoom.roomFiveNum);
            dtzRoom.roomTenNumLable.setString(dtzRoom.roomTenNum);
            dtzRoom.roomKNumLable.setString(dtzRoom.roomKNum);
            dtzRoom.curScoreLable.setString(dtzRoom.roomCurScore +"分");
        }

        //刷新a b组 当局的分数
        if(dtzRoom.aTeamCurScoreLable != null && dtzRoom.bTeamCurScoreLable != null){
            var tAScore = dtzRoom.aTeamCurScoreLable.getString();
            var tBScore = dtzRoom.bTeamCurScoreLable.getString();
            var tScoreNode = null;
            //cc.log("this.curaTeamScore ...this.curbTeamScore ..." , dtzRoom.curaTeamScore + " " + dtzRoom.curbTeamScore +" " + tAScore + " " + tBScore);
            if(tAScore != dtzRoom.curaTeamScore){
                //执行动作
                //cc.log("刷新A组的当局分数为" , dtzRoom.curaTeamScore);
                dtzRoom.aTeamCurScoreLable.setString(dtzRoom.curaTeamScore);
                tScoreNode = dtzRoom.aTeamCurScoreLable;
            }
            if(tBScore != dtzRoom.curbTeamScore){
                //执行动作
                //cc.log("刷新B组的当局分数为" , dtzRoom.curbTeamScore);
                dtzRoom.bTeamCurScoreLable.setString(dtzRoom.curbTeamScore);
                tScoreNode = dtzRoom.bTeamCurScoreLable;
            }

            if (DTZRoomModel.is3Ren()) {
                var tCScore = dtzRoom.cTeamCurScoreLable.getString();
                if(tCScore != dtzRoom.curcTeamScore){
                    //执行动作
                    //cc.log("刷新C组的当局分数为" , dtzRoom.curcTeamScore);
                    dtzRoom.cTeamCurScoreLable.setString(dtzRoom.curcTeamScore);
                    tScoreNode = dtzRoom.cTeamCurScoreLable;
                }
            }

            if(tScoreNode){
                //执行动作
                //cc.log("分数执行动作...");
                var tAction = this.lableAction(tScoreNode.x , tScoreNode.y);
                //创建一个变色的动作
                tScoreNode.runAction(tAction);
            }
        }
        //刷新 a b组 总的地炸/筒子分 (如果是四副牌模式 这里刷新的是喜总分)
        if(dtzRoom.aTongziScoreLable != null && dtzRoom.bTongziScoreLable != null){
            var tAtongziScore = dtzRoom.aTongziScoreLable.getString();
            var tBtongziScore = dtzRoom.bTongziScoreLable.getString();
            var tScoreNode = null;
            if(tAtongziScore != dtzRoom.aTeamTongziScore){
                dtzRoom.aTongziScoreLable.setString(dtzRoom.aTeamTongziScore);
                tScoreNode = dtzRoom.aTongziScoreLable;
            }
            if(tBtongziScore != dtzRoom.bTeamTongziScore){
                dtzRoom.bTongziScoreLable.setString(dtzRoom.bTeamTongziScore);
                tScoreNode = dtzRoom.bTongziScoreLable;
            }

            if (DTZRoomModel.is3Ren()) {
                var tCtongziScore = dtzRoom.cTongziScoreLable.getString();
                if(tCtongziScore != dtzRoom.cTeamTongziScore){
                    dtzRoom.cTongziScoreLable.setString(dtzRoom.cTeamTongziScore);
                    tScoreNode = dtzRoom.cTongziScoreLable;
                }
            }

            if(tScoreNode){
                //执行动作
                var tAction = this.lableAction(tScoreNode.x , tScoreNode.y);
                //创建一个变色的动作
                tScoreNode.runAction(tAction);
            }
        }

        //刷新a b组的总分
        if(dtzRoom.aTeamScoreLable != null && dtzRoom.bTeamScoreLable != null){
            var tATeamScore = dtzRoom.aTeamScoreLable.getString();
            var tBteamScore = dtzRoom.bTeamScoreLable.getString();
            if(tATeamScore != dtzRoom.aTeamAllScore){
                dtzRoom.aTeamScoreLable.setString(dtzRoom.aTeamAllScore);
            }
            if(tBteamScore != dtzRoom.bTeamAllScore){
                dtzRoom.bTeamScoreLable.setString(dtzRoom.bTeamAllScore);
            }

            if (DTZRoomModel.is3Ren()) {
                var tCteamScore = dtzRoom.cTeamScoreLable.getString();
                if(tCteamScore != dtzRoom.cTeamAllScore){
                    dtzRoom.cTeamScoreLable.setString(dtzRoom.cTeamAllScore);
                }
            }
        }
    },

    /**
     * 计算这一圈打出的牌分 和 5 10 K数量
     */
    countCurScoreAndNumber:function(dtzRoom , cardList){
        if(cardList.length < 0){
            return
        }else{
            for(var index = 0 ; index < cardList.length ; index ++){
                var tCardData = DTZAI.getCardDef(cardList[index]);
                //cc.log("tCardData.i..." , tCardData.i);
                if(tCardData.i == 5){
                    dtzRoom.roomCurScore += 5;
                    dtzRoom.roomFiveNum ++;
                }else if(tCardData.i == 10){
                    dtzRoom.roomCurScore += 10;
                    dtzRoom.roomTenNum ++;
                }else if(tCardData.i == 13){
                    dtzRoom.roomCurScore += 10;
                    dtzRoom.roomKNum ++;
                }
            }
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
    },

    /**
     * 分组完成 刷新各个玩家的座位
     *
     */
    updatePlayerMsg:function(dtzRoom , messageData){
        dtzRoom.getWidget("LableChoiceTeam").visible = false;
        dtzRoom.setPlayerReayStateVisible(false);

        cc.log("onUpdatePlayerMsg..." + JSON.stringify(messageData));
        //移除已经显示的四张 选择分组的卡牌
        var curPlayer = null;
        var realSeat = null;

        dtzRoom.choiceSeatBtn2.visible = false;
        dtzRoom.choiceSeatBtn3.visible = false;
        dtzRoom.choiceSeatBtn4.visible = false;

        //首先更新自己的座位 因为其他玩家的实际显示顺序是依赖自己的座位计算的
        for(var seat = 0 ; seat < messageData.length ; seat ++){
            if(messageData[seat] == PlayerModel.userId){
                DTZRoomModel.mySeat = seat + 1;//数组下标从1开始的
            }
        }

        for (var i = 0; i < messageData.length; i++) {
            var userId = messageData[i];
            var realSeat = i + 1;
            var teamId = (i % 2 == 0 ) ? 1 : 2;
            for(var j = 0 ; i < DTZRoomModel.players.length ; j++) {
                if (DTZRoomModel.players[j].userId == userId) {
                    curPlayer = DTZRoomModel.players[j];
                    //修改玩家的座位信息
                    curPlayer.seat = realSeat;

                    var seq = dtzRoom.getPlayerSeq(curPlayer.userId, DTZRoomModel.mySeat, curPlayer.seat);
                    cc.log("修正玩家:" + curPlayer.name + "位置改为" + realSeat + "显示的位置为" + seq);
                    dtzRoom._players[realSeat] = new CardPlayer(curPlayer, dtzRoom.root, seq, teamId);
                    break;
                }
            }
        }

        for(var index = 1 ; index <= 4 ; index ++){
            var curPlayer = dtzRoom._players[index];
            dtzRoom.getWidget("zhunbei" + curPlayer.seq).visible = false;

            cc.log("每个玩家的状态 curPlayer._status" , curPlayer._status);
            if(curPlayer._status == 1){
                cc.log("分组以后 已经准备的玩家 显示已经准备" , index , curPlayer.seq);
                dtzRoom.getWidget("zhunbei" + curPlayer.seq).visible = true;
                curPlayer.showStatus(curPlayer._status);

            }
        }

        //是否显示我自身的准备按钮
        if(dtzRoom._players[DTZRoomModel.mySeat]._status == 1){
            dtzRoom.Button_30.visible = false;
        }else{
            dtzRoom.Button_30.visible = true;
        }

    },

};