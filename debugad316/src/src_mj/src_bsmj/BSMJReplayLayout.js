/**
 * Created by zhoufan on 2016/7/23.
 */

var BSMJReplayLayout = cc.Class.extend({

    initData:function(direct,mPanel,oPanel,hPanel,seat){
        if (MJReplayModel.renshu == 2 && direct == 2){
            direct = 3;
        }
        if (MJReplayModel.renshu == 3 && direct == 3){
            direct = 4;
        }
        this.direct = direct;
        this.seat = seat || null;
        this.mPanel = mPanel;
        this.oPanel = oPanel;
        this.hPanel = hPanel;
        this.data1 = [];
        this.data2 = [];
        this.data3 = [];
        this.data4 = [];
        this.mahjongs1 = [];
        this.mahjongs2 = [];
        this.mahjongs3 = [];
        this.mahjongsBaijiao = [];
    },

    /**
     *
     * @param id {number}
     */
    moPai:function(id){
        var mjVo = id>0 ? MJAI.getMJDef(id) : {};
        mjVo.m = 1;
        this.data1.push(mjVo);
        this.refreshP1(this.data1);
    },

    /**
     * 箭头
     */
    showFinger:function(id){
        var lastMahjong = this.mahjongs3[this.mahjongs3.length-1];
        if(!lastMahjong)
            return;
        if(id && lastMahjong.getData().c!=id)
            return;
        var finger = this.oPanel.getChildByTag(777);
        if(!finger){
            finger = new cc.Sprite("res/res_mj/mjRoom/finger.png");
            finger.anchorX=finger.anchorY=0;
            this.oPanel.addChild(finger,1000,777);
        }
        finger.setLocalZOrder(1000);
        finger.x = lastMahjong.x+lastMahjong.width/2;
        if(this.direct==1||this.direct==3)
            finger.x -=30;
        if(this.direct==2||this.direct==4)
            finger.x -=32;
        var initY = lastMahjong.y+lastMahjong.height/2;
        //if(this.direct==1||this.direct==3)
        //    initY+=0;
        //if(this.direct==2||this.direct==4)
        //    initY+=0;
        finger.y = initY;
        finger.visible = true;
        finger.stopAllActions();
        finger.runAction(cc.sequence(cc.moveTo(0.8,finger.x,initY+20),cc.moveTo(0.5,finger.x,initY)).repeatForever());
    },

    getData2WithClone:function(data){
        var result=[];
        for(var i=0;i<data.length;i++){
            var innerObject = data[i];//{action:1,cards:[{t:4,n:10,i:202,c:207,dan:0}],danType:1}
            var cloneObject = {};
            cloneObject.action = innerObject.action;
            var cards = ArrayUtil.clone(innerObject.cards);
            for(var j=0;j<cards.length;j++){
                var card = cards[j];//{t:4,n:10,i:202,c:207,dan:0}
                var clonedCard = {};
                for(var key in card){
                    clonedCard[key] = card[key];
                }
                cards[j] = clonedCard;
            }
            cloneObject.cards = cards;
            cloneObject.danType = innerObject.danType;
            cloneObject.huxi = innerObject.huxi;
            cloneObject.temp = innerObject.temp;
            result.push(cloneObject);
        }
        return result;
    },

    findBaoPai:function(){
        //for(var i=0;i<this.mahjongs1.length;i++){
        //    this.mahjongs1[i].BaoPaiDisplay();
        //}
        //for(var i=0;i<this.mahjongs2.length;i++) {
        //    this.mahjongs2[i].BaoPaiDisplay();
        //}
        //for(var i=0;i<this.mahjongs3.length;i++){
        //    this.mahjongs3[i].BaoPaiDisplay();
        //}
    },


    xiaohu:function(ids){
        this.oPanel.removeAllChildren(true);
        var data = [];
        for(var j=0;j<ids.length;j++){
            data.push(MJAI.getMJDef(ids[j]));
        }
        data.sort(MJAI.sortMJ);
        var g,initVal;
        switch (this.direct){
            case 1:
                g = 36;
                initVal = (this.oPanel.width-data.length*g)/2;
                //initVal = data.length>13 ? -40 : -30;
                break;
            case 2:
                g = 25;
                initVal = (this.oPanel.height-data.length*g)/2;
                //initVal = data.length>13 ? 50 : 65;
                break;
            case 3:
                g = 36;
                initVal = data.length*g+(this.oPanel.width-data.length*g)/2;
                //initVal = data.length>13 ? 431 : 450;
                break;
            case 4:
                g = 25;
                initVal = data.length*g+(this.oPanel.height-data.length*g)/2;
                //initVal = data.length>13 ? 380 : 370;
                break;
        }
        var zorder = data.length;
        for(var i=0;i<data.length;i++){
            var card = new BSMahjong(MJAI.getDisplayVo(this.direct,3),data[i]);
            if(this.direct==1){
                card.x = initVal+i*g;
            }else if(this.direct==3){
                card.x = initVal-i*g;
            }else if(this.direct==2){
                card.x = 0;
            }else{
                card.x = 30;
            }
            if(this.direct==4){
                card.setLocalZOrder(i);
                card.y = initVal-i*g;
            }else if(this.direct==2){
                card.setLocalZOrder(zorder);
                card.y = initVal+i*g;
            }else{
                card.y = 42;
                if(this.direct==3)
                    card.y = 0;
            }
            this.oPanel.addChild(card);
            card.xiaoHu();
            zorder--;
        }
    },

    /**
     *
     * @param mjVo {MJVo}
     */
    chuPai:function(mjVo,isCsGang){
        isCsGang = isCsGang || false;
        this.data3.push(mjVo);
        this.refreshP3(this.data3);
        if(!isCsGang)
            this.delFromPlace1(mjVo.c);
        this.showFinger();
    },

    hideFinger:function(){
        var finger = this.oPanel.getChildByTag(777);
        if(finger){
            finger.stopAllActions();
            finger.visible = false;
        }
    },

    /**
     * 删除place1的麻将
     * @param id
     */
    delFromPlace1:function(id){
        var del = -1;
        for(var i=0;i<this.data1.length;i++){
            var c = this.data1[i].c;
            if(c == id){
                del = i;
                break;
            }
        }
        if(del>=0){
            this.data1.splice(del,1);
            var mahjong = this.mahjongs1.splice(del,1);
            if(mahjong.length>0)
                mahjong[0].pushOut();
            this.data1.sort(MJAI.sortMJ);
            this.refreshP1(this.data1);
            this.refreshBaiJiaoCards(this.data2);
        }
    },

    /**
     * 碰、杠操作
     * @param ids
     */
    pengPai:function(ids,action,fromSeat,isZimo){
        var voArray = MJAI.getVoArray(ids);
        var vo0 = voArray[0];
        var isZimo = isZimo || -1;
        if((action==MJAction.GANG||action==MJAction.BU_ZHANG) && ids.length==1){//先碰后杠
            for(var i=0;i<this.data2.length;i++){
                var innerObj = this.data2[i];
                if(innerObj.action==MJAction.PENG){
                    var curVo0 = innerObj.cards[0];
                    if(curVo0.t==vo0.t&&curVo0.n==vo0.n){
                        innerObj.cards.push(vo0);
                        innerObj.action = action;
                        break;
                    }
                }
            }
        }else{
            if(isZimo != 1 && fromSeat>0){
                this.data2.push({action: action, cards: voArray,huxi: fromSeat});
            }else {
                this.data2.push({action: action, cards: voArray});
            }
        }
        this.refreshP2(this.data2);
        if(action == MJAction.HU){
            this.refreshBaiJiaoCards(this.data2);
        }
        if(action!=MJAction.AN_GANG && action!=MJAction.BU_ZHANG && action != MJAction.CHI
            && ids.length>1)
            ids.pop();
        //if(action==MJAction.BU_ZHANG&&ids.length>3&&fromSeat)//补张在手上有三个，别人打来一个时，需要踢出最后一个
        //    ids.pop();
        if(this.direct!=1&&this.data1.length<=1){
            this.refreshP1(this.data1);
            return;
        }

        if(isZimo == 1){
            for (var i = 0; i < ids.length; i++) {
                this.delFromPlace1(ids[i]);
            }
        }

        if(fromSeat<0){//特殊处理替换鸟的逻辑 不需要删除place1的牌
            //noting to do
        }else {
            if(action != MJAction.HU) {
                for (var i = 0; i < ids.length; i++) {
                    this.delFromPlace1(ids[i]);
                }
            }
        }
    },

    showJinCards:function(ids){
        var jinArray = [];
        for(var i=0;i<ids.length;i++){
            jinArray.push(MJAI.getMJDefByI(ids[i]));
        }
        for(var i=0;i<this.data1.length;i++){
            var cardVo = this.data1[i];
            var index = MJAI.findIndexByMJVoI(jinArray, cardVo.i);
            if (index >= 0) {
                cardVo.jinDisplay = 1;
            }
        }
        this.refreshP1(this.data1);
    },

    onRemoveJinPaiTag:function(ids){
        var jinArray = [];
        for(var i=0;i<ids.length;i++){
            jinArray.push(MJAI.getMJDefByI(ids[i]));
        }
        for(var i=0;i<this.data1.length;i++){
            var cardVo = this.data1[i];
            var index = MJAI.findIndexByMJVoI(jinArray, cardVo.i);
            if (index < 0) {
                cardVo.jinDisplay = 0;
            }
        }
        this.refreshP1(this.data1);
    },




    showBaiJiaoCards:function(ids){
        var cards = MJAI.getVoArray(ids);
        this.data2.push({action:8,cards:cards});
        for(var i=0;i<ids.length;i++) {
            this.delFromPlace1(ids[i]);
        }
        this.refreshBaiJiaoCards(this.data2);
    },


    refreshBaiJiaoCards:function(data) {
        var totalCount = this.data2.length;
        var initVal =  this.baijiaoMark;
        var zorder = totalCount;
        var count = 0;
        var nowCards = this.mahjongsBaijiao.length;
        for (var i = 0; i < data.length; i++) {
            var innerObject = data[i];
            var innerAction = innerObject.action;
            var innerArray = innerObject.cards;
            var paoSeat = innerObject.huxi || 0;
            for (var j = 0; j < innerArray.length; j++) {
                var card = null;
                var innerVo = innerArray[j];
                if(paoSeat > 0 && innerAction == MJAction.HU){
                    var paoSeq = MJRoomModel.getPlayerSeq("", MJReplayModel.mySeat, paoSeat);
                    innerVo.jt = MJRoomModel.getPaoJianTou(paoSeq);
                }
                if (innerAction == MJAction.BAI_JIAO || innerAction == MJAction.HU ) {
                    var mod = 1;
                    if (count < nowCards) {
                        card = this.mahjongsBaijiao.shift();
                        card.refresh(MJAI.getDisplayVo(this.direct, 2), innerVo);
                    } else {
                        card = new BSMahjong(MJAI.getDisplayVo(this.direct, 2), innerVo);
                        this.mPanel.addChild(card);
                    }
                    this.mahjongsBaijiao.push(card);
                    var gapMapping = {1:64,2:33,3:42,4:33};
                    var g = gapMapping[this.direct];
                    if(this.direct==1) {
                        card.x = initVal + count * g + 10 * mod;
                        card.y = 0;
                    }
                    if(this.direct==2) {
                        card.y = initVal + count * g + 18 * mod;
                        card.x = 0;
                        card.setLocalZOrder(zorder);
                    }
                    if(this.direct==3) {
                        card.x = initVal - count * g - 18 * mod;
                        card.y = 0;
                    }
                    if(this.direct==4) {
                        card.x = 0;
                        card.y = initVal - count * g - 18 * mod;
                        card.setLocalZOrder(count+1);
                    }
                    if (innerAction == MJAction.BAI_JIAO && !card.getChildByTag(10000)) {
                        this.onAddBaiZi(card);
                    }
                    count++;
                    zorder--;
                }
            }
        }
    },

    onAddBaiZi: function (card) {
        var png = "res/res_mj/mjRoom/bai_down.png";
        if(this.direct == 2 || this.direct == 4){
            png = "res/res_mj/mjRoom/bai_left.png";
        }
        var baiBg = new cc.Sprite(png);
        var initX = 0;
        var initY = 0;
        var flipX = 0;
        var flipY = 0;
        if(this.direct == 1){
            initX = card.width/2;
            initY = card.height+baiBg.height/2 - 8;
        }else if(this.direct == 2){
            initX = -baiBg.width/2;
            initY = card.height/2;
            flipX = 180;
        }else if(this.direct == 3){
            initX = card.width/2 - 7;
            initY = -baiBg.height/2 + 7;
            flipY = 180;
        }else if(this.direct == 4){
            initX = card.width + baiBg.width/2 ;
            initY = card.height/2;
        }
        baiBg.setPosition(initX,initY);
        baiBg.setFlippedX(flipX);
        baiBg.setFlippedY(flipY);
        var baiZi = new cc.Sprite("res/res_mj/mjRoom/bai.png");
        initY = baiBg.height/2;
        if(this.direct == 1){
            initX = baiBg.width/2 - 1;
        }else if(this.direct == 2){
            initX = baiBg.width/2-2;
        }else if(this.direct == 3){
            initX = baiBg.width/2-2;
            initY = baiBg.height/2 - 3;
        }else if(this.direct == 4){
            initX = baiBg.width/2 + 2;
        }
        baiZi.setPosition(initX,initY);
        baiBg.addChild(baiZi);
        card.addChild(baiBg,1,10000);
    },


    huPai:function(isZiMo,fromSeat,fromMJ){
        var last = null;
        if (isZiMo) {
            last = this.data1[this.data1.length-1];
            this.delFromPlace1(last.c);
        } else if (fromMJ) {
            last = MJAI.getMJDef(fromMJ);
        }
        if (last) {
            var isHas = false;
            for (var i=0;i<this.data4.length;i++) {
                var cards = this.data4[i].cards;
                if (last.c == cards[0]) {
                    isHas = true;
                    break;
                }
            }
            if (!isHas) {
                this.data4.push({action:isZiMo ? 1 : 0,cards:[last.c],huxi:fromSeat});
                this.refreshP4(this.data4);
            }
        }
        return last;
    },

    /**
     * 被碰牌的place3需要更新数据
     * @param id {number}
     */
    beiPengPai:function(id){
        var del = -1;
        for(var i=0;i<this.data3.length;i++){
            if(this.data3[i].c == id){
                del = i;
                break;
            }
        }
        if(del>=0){
            this.data3.splice(del,1);

            //长沙麻将有可能会打两张牌出去，被操作的可能是前面一张，这时要调整下后面牌的位置
            for(var i = this.mahjongs3.length - 1;i >= del + 1;--i){
                this.mahjongs3[i].setPosition(this.mahjongs3[i-1].getPosition());
            }

            var mahjong = this.mahjongs3.splice(del,1);
            if(mahjong.length>0)
                mahjong[0].pushOut();
        }
    },

    getPlace1Data:function(){
        return this.data1;
    },

    getPlace2Data:function(){
        return this.data2;
    },

    getMahjongs1:function(){
        return this.mahjongs1;
    },

    clean:function(){
        this.mPanel.removeAllChildren(true);
        this.oPanel.removeAllChildren(true);
        this.hPanel.removeAllChildren(true);
        this.mahjongs1.length=0;
        this.mahjongs2.length=0;
        this.mahjongs3.length=0;
        this.mahjongsBaijiao.length = 0;
    },


    refreshByCurData:function(data1,data2,data3){
        this.mahjongs1.length=this.mahjongs2.length=this.mahjongs3.length=this.mahjongsBaijiao.length = 0;
        this.mPanel.removeAllChildren(true);
        this.oPanel.removeAllChildren(true);
        this.refreshP2(this.getData2WithClone(data2));
        this.refreshP1(ArrayUtil.clone(data1));
        this.refreshP3(ArrayUtil.clone(data3));
        this.refreshBaiJiaoCards(this.getData2WithClone(data2));
    },

    /**
     *
     * @param data1 {Array.<MJVo>}
     * @param data2 {Array.<MJVo>}
     * @param data3 {Array.<MJVo>}
     * @param data4 {Array.<MJVo>}
     */
    refresh:function(data1,data2,data3,data4){
        data1 = this.transData(data1,true);
        data2 = this.transData(data2,false);
        data3 = this.transData(data3,false);
        this.data1 = data1;
        this.data2 = data2;
        this.data3 = data3;
        this.refreshP2(data2);
        this.refreshP1(data1);
        this.refreshP3(data3);
        this.refreshBaiJiaoCards(data2);
    },

    /**
     * 转换前台需要的数据
     * @param ids
     * @param isSort
     * @returns {Array}
     */
    transData:function(ids,isSort) {
        var cardIds = [];
        for(var j=0;j<ids.length;j++){
            cardIds.push(MJAI.getMJDef(ids[j]));
        }
        if(isSort && cardIds.length>0){
            cardIds.sort(MJAI.sortMJ);
        }
        return cardIds;
    },

    handleWithPlace2:function(innerObject){
        var voArray = innerObject.cards;
        var isBuYiTiao = innerObject.huxi<0;
        var result = [];
        if(isBuYiTiao){
            innerObject.danType = MJDanType.BU_YI_TIAO;
        }else{
            innerObject.danType = MJAI.findDanType(voArray);
        }
        for(var i=0;i<voArray.length;i++){
            var vo = MJAI.getMJDef(voArray[i].c);
            if(isBuYiTiao || (vo.t!=1||vo.n!=1)){
                var isHas = false;
                for(var j=0;j<result.length;j++){
                    if(result[j].n==vo.n && result[j].t==vo.t){
                        result[j].dan += 1;
                        isHas = true;
                        break;
                    }
                }
                if(!isHas){
                    vo.dan = 1;
                    result.push(vo);
                }
            }else{
                result.push(vo);
            }
        }
        return result;
    },

    changeMahjongRes:function(){
        for(var i=0;i<this.mahjongs1.length;i++){
            this.mahjongs1[i].diplay();
        }
        for(var i=0;i<this.mahjongs2.length;i++){
            this.mahjongs2[i].diplay();
        }
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].diplay();
        }
    },

    /**
     * refresh place1
     * @param data {Array.<MJVo>}
     */
    refreshP1:function(data){

        var newData = data;

        this.data1 = newData;

        var gapMapping = {1:133,2:57,3:72,4:57};//{1:88,2:40,3:50,4:40};
        var g=gapMapping[this.direct];
        var initVal=this.p2Mark;
        var correctCoord = function(direct,card,i,zorder,isMopai){
            var scale = 0.9;
            card.scale = scale;
            if(direct==1){
                card.x = initVal+i*g * scale;
                card.setLocalZOrder(1);
            }else if(direct==3){
                card.x = initVal-i*g * scale;
            }else{
                card.x = (direct==4) ? -8 : 0;
            }
            if(direct==4){
                card.y = initVal-i*g * scale;
            }else if(direct==2) {
                card.y = initVal+i*g * scale;
                card.setLocalZOrder(zorder);
            }else{
                card.y = 0;
            }
            if(newData[i].hasOwnProperty("m") || i>12 || isMopai){//摸牌的处理
                if(direct==1)
                    card.x += 20;
                if(direct==2)
                    card.y += 35;
                if(direct==3)
                    card.x -= 16;
                if(direct==4)
                    card.y -= 35;
            }
            var maxX = cc.winSize.width - g/2;
            if(card.x > maxX && direct == 1){
                card.y += 100;
                card.x -= g*2;
            }

            card.initCoord();
        }
        var place = (this.direct==1) ? 1 : 3;
        var zorder = this.data1.length;
        for(var i=0;i<this.mahjongs1.length;i++){
            var card = this.mahjongs1[i];
            correctCoord(this.direct,card,i,zorder);
            zorder--;
            card.refresh(MJAI.getDisplayVo(this.direct,place),newData[i]);
        }
        for(;i<newData.length;i++){
            var card ;
            if(MJReplayModel.wanfa == GameTypeEunmMJ.AHMJ){
                card = new CSMahjong(MJAI.getDisplayVo(this.direct,place),newData[i]);
            }else{
                card = new BSMahjong(MJAI.getDisplayVo(this.direct,place),newData[i]);
            }
            this.mahjongs1.push(card);
            var isMopai = (this.data1.length%3 == 2 && i > (this.data1.length - 2))? true : false;//有碰牌时摸牌的处理
            correctCoord(this.direct,card,i,zorder,isMopai);
            zorder--;
            this.mPanel.addChild(card);
        }
        if(this.direct==1)
            this.baijiaoMark = data.length < 2 ? initVal + g + 20 : card.x + g;
        if(this.direct==2)
            this.baijiaoMark = data.length < 2 ? initVal + g : card.y + g;
        if(this.direct==3)
            this.baijiaoMark = data.length < 2 ? initVal - g : card.x - g;
        if(this.direct==4)
            this.baijiaoMark = data.length < 2 ? initVal - g : card.y - g;
    },

    /**
     * refresh place2
     * @param data {Array.<MJVo>}
     */
    refreshP2:function(data){
        this.data2 = data;
        this.data2.sort(MJAI.sortPlaceData2);
        var g,initVal;
        var isHasData2 = false;
        switch (this.direct){
            case 1:
                g = 95;
                initVal = 60;
                break;
            case 2:
                g = 48;
                initVal = -80;
                break;
            case 3:
                g = 60;
                initVal = (data.length==0) ? 555 : 565;
                break;
            case 4:
                g = 48;
                initVal = 580 - (MJAI.MJ_NUMBER-this.data2.length-1)*7;
                break;
        }
        var zorder = this.data2.length;
        var count = 0;
        var lastX = 0;
        var lastY = 0;
        var nowCards = this.mahjongs2.length;
        for(var i=0;i<data.length;i++) {
            var innerObject = data[i];
            var innerAction = innerObject.action;
            var innerArray = innerObject.cards;
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG||innerAction==MJAction.GANG) && (innerArray.length>3 || innerObject.temp)){
                if(innerObject.temp){
                    gangVo = innerObject.temp;
                }else {
                    gangVo = innerArray.pop();
                    innerObject.temp = gangVo;
                }
            }
            var mod = i;
            for(var j=0;j<innerArray.length;j++) {
                var card = null;
                var innerVo = innerArray[j];
                if (innerAction==MJAction.AN_GANG) {
                    innerVo.a = 1;
                }
                if (innerAction != MJAction.BAI_JIAO && innerAction != MJAction.HU) {
                    isHasData2 = true;
                    if (count < nowCards) {
                        card = this.mahjongs2.shift();
                        card.refresh(MJAI.getDisplayVo(this.direct, 2), innerVo);
                    } else {
                        card = new BSMahjong(MJAI.getDisplayVo(this.direct, 2), innerVo);
                        this.mPanel.addChild(card);
                    }
                    if(innerAction == MJAction.PENG && innerObject.huxi > 0 && j==1){
                        card.showPengDir(innerObject.huxi,true);
                    }
                    this.mahjongs2.push(card);
                    //处理下坐标,每束牌需要隔开显示
                    if (this.direct == 1) {
                        card.x = initVal + count * g + 10 * mod;
                    } else if (this.direct == 3) {
                        card.x = initVal - count * g - 10 * mod;
                    } else {
                        card.x = 0;
                    }
                    if (this.direct == 2) {
                        card.y = initVal + count * g + 15 * mod;
                        card.setLocalZOrder(zorder);
                    } else if (this.direct == 4) {
                        card.y = initVal - count * g - 15 * mod;
                    } else {
                        card.y = 0;
                    }
                    lastX = card.x;
                    lastY = card.y;
                    //杠的牌需要放一张牌到上面去
                    if (gangVo && j == 1) {
                        var gang = new BSMahjong(MJAI.getDisplayVo(this.direct, 2), gangVo);
                        if (this.direct == 1)
                            gang.y = 20;
                        if (this.direct == 2)
                            gang.y += 12;
                        if (this.direct == 3)
                            gang.y += 12;
                        if (this.direct == 4)
                            gang.y += 12;
                        card.addChild(gang);
                    }
                    zorder--;
                    count++;
                }
            }
        }
        if(this.direct==1)
            this.p2Mark = isHasData2 ? lastX+120 : initVal;
        if(this.direct==2)
            this.p2Mark = isHasData2 ? lastY+85 : initVal+this.data2.length*5;
        if(this.direct==3)
            this.p2Mark = isHasData2 ? lastX-85 : initVal;
        if(this.direct==4)
            this.p2Mark = isHasData2 ? lastY-90 : initVal;
    },

    /**
     * refresh place3
     * @param data {Array.<MJVo>}
     */
    refreshP3:function(data){
        this.data3 = data;
        var g,initVal;
        switch (this.direct){
            case 1:
                g = 75;//50;
                initVal = 34;
                break;
            case 2:
                g = 59;//39;
                initVal = g;
                break;
            case 3:
                g = 75;//50;
                initVal = this.oPanel.width-g-34;
                break;
            case 4:
                g = 59;//39;
                initVal = this.oPanel.height-g;
                break;
        }
        var zorder = this.data3.length;
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].refresh(MJAI.getDisplayVo(this.direct,3),data[i]);
            if(this.direct==2)
                this.mahjongs3[i].setLocalZOrder(zorder);
            zorder--;
        }
        var rowCount = 8;
        if (MJReplayModel.renshu == 2){
            rowCount = 20;
        }else if (MJReplayModel.renshu == 3 && this.direct==1){
            rowCount = 15;
        }
        for(;i<data.length;i++){
            var card = new BSMahjong(MJAI.getDisplayVo(this.direct,3),data[i]);
            this.mahjongs3.push(card);
            var scale = 0.9;
            card.scale = scale;
            if(this.direct==1){
                card.x = initVal+(i%rowCount)*g * scale;
            }else if(this.direct==3){
                card.x = initVal-(i%rowCount)*g * scale;
            }else{
                card.x = 0;
                var localNumber = Math.floor(i / rowCount);
                if(this.direct==2)
                    card.x = -28 + localNumber * 88;
                if(this.direct==4)
                    card.x = 58 - localNumber * 88;
            }
            if(this.direct==4){
                card.setLocalZOrder(i);
                card.y = initVal-(i%rowCount)*g * scale;
            }else if(this.direct==2){
                card.setLocalZOrder(zorder);
                card.y = initVal+(i%rowCount)*g * scale;
            }else{
                card.y = 0;
                var localNumber = Math.floor(i / rowCount);
                if(this.direct==1)
                    card.y = 50 - localNumber * 75;
                if(this.direct==3){
                    card.y = localNumber * 75;
                    card.setLocalZOrder(5 - localNumber);
                }
            }
            this.oPanel.addChild(card);
            zorder--;
        }
    },

    refreshP4: function(data) {
        this.data4 = data;
        var g,initVal;
        switch (this.direct){
            case 1:
                g = 30;
                initVal=0;
                break;
            case 2:
                g = 20;
                initVal = this.p2Mark;
                break;
            case 3:
                g = 30;
                initVal = 500;
                break;
            case 4:
                g = 20;
                initVal = this.p2Mark;
                break;
        }
        this.hPanel.removeAllChildren(true);
        var zorder = this.data3.length;
        for(var i=0;i<data.length;i++) {
            var innerObject = data[i];
            var vo = MJAI.getMJDef(innerObject.cards[0]);
            var huRecord = MJReplayModel.getHuRecordById(this.seat,vo.c);
            if (huRecord && huRecord.ext[1] > 0) {
                var paoSeq = MJRoomModel.getPlayerSeq("", MJReplayModel.mySeat, huRecord.ext[1]);
                vo.jt = MJRoomModel.getPaoJianTou(paoSeq);
            }
            var scale = 0.9;
            var card = new BSMahjong(MJAI.getDisplayVo(this.direct,4),vo);
            card.x = initVal+g*i;
            card.y = 0;
            card.scale = scale;
            if(this.direct==1){
                card.x = initVal+i*g * scale;
            }else if(this.direct==3){
                card.x = initVal-i*g * scale;
            }else{
                card.x = 0;
            }
            if(this.direct==4){
                card.setLocalZOrder(i);
                card.y = initVal-i*g *scale;
            }else if(this.direct==2){
                card.setLocalZOrder(zorder);
                card.y = initVal+i*g * scale;
            }else{
                card.y = 0;
            }
            this.hPanel.addChild(card);
            zorder--;
        }
    }
});