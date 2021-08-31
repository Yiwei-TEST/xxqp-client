/**
 * Created by zhoufan on 2016/11/8.
 */
var HBGZPLayout = cc.Class.extend({

    initData:function(direct,mPanel,oPanel,banker,isMoPai){
        this.direct = direct;
        this.banker = banker || null;
        this.mPanel = mPanel;
        this.oPanel = oPanel;
        this.data1 = [];
        this.data2 = [];
        this.data3 = [];
        this.JianArray = [];
        this.mahjongs1 = [];
        this.mahjongs2 = [];
        this.mahjongs3 = [];
        this.tiArray = [];
        this.isMoPai = isMoPai || false;
        this.place2x = -1;
        //iphoneX 三人 左上角位置 吃碰跑的牌显示位置调整
        if(SdkUtil.isIphoneX() && direct == 3 && HBGZPRoomModel.is3Ren()){
            //this.mPanel.x = 45;
            //this.oPanel.x = 45;
        }

        if(SdkUtil.isIphoneX() && direct == 2 && HBGZPRoomModel.is2Ren()){
            //this.mPanel.x = 45;
            //this.oPanel.x = 45;
        }

        if(SdkUtil.isIphoneX() && direct == 4 && HBGZPRoomModel.is4Ren()){
            this.mPanel.x = 45;
        }
    },

    /**
     * 出牌操作
     * @param mjVo {PHZVo}
     */
    chuPai:function(mjVo,notTi){
        var isHas = false;
        for(var i=0;i<this.data3.length;i++){
            var vo = this.data3[i];
            if(vo.c==mjVo.c){
                isHas = true;
                break;
            }
        }
        if(!isHas){
            this.data3.push(mjVo);
            //参数2 是为了区分是不是做弃牌操作
            this.refreshP3(this.data3,notTi);
        }
        if(this.direct==1)
            HBGZPMineLayout.delCards([mjVo]);
            //HBGZPMineLayout.delOne(mjVo,true);
    },

    assignInnerObjectByPao:function(innerObject,action,id){
        innerObject.action=action;
        var vo = HBGZPAI.getPHZDef(id);
        for(var j=0;j<innerObject.cards.length;j++){
            innerObject.cards[j].t = vo.t;
            innerObject.cards[j].n = vo.n;
            innerObject.cards[j].c = vo.c;
        }
        innerObject.cards.push(HBGZPAI.getPHZDef(id));
    },

    /**
     * 吃、碰、跑、偎等操作的统一处理
     * @param ids
     * @param action
     * @param direct
     * @param isZaiPao
     */
    chiPai:function(ids,action,direct,isZaiPao){
        var hasInsert = false;
        if(this.data2.length>0){
            if(action==HBGZPDisAction.HUA) {//先招后滑
                for(var i=0;i<this.data2.length;i++){
                    var innerObject = this.data2[i];
                    if(innerObject.action == HBGZPDisAction.ZHAO){//招
                        var vo = innerObject.cards[0];
                        if(vo.c > 0 && vo.n == HBGZPAI.getPHZDef(ids[0]).n){
                            this.assignInnerObjectByPao(innerObject,action,ids[0]);
                            hasInsert = true;
                            break;
                        }
                    }
                }
            }
        }
        if(!hasInsert){
            var voArray = HBGZPAI.getVoArray(ids);
            this.data2.push({action:action,cards:voArray});
        }
        this.refreshP2(this.data2);
    },

    getOneMahjongOnHand:function(id){
        var vo = null
        for(var i=0;i<this.data1.length;i++){
            var c = this.data1[i].c;
            if(c == id){
                vo = this.data1[i];
                break;
            }
        }
        return vo;
    },

    /**
     * 被碰牌的place3需要更新数据,从来源处删除出了的牌
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

    getJianArray:function(){
       return this.JianArray;
    },

    getPlace2CardData:function(){
        var dataArr = [];
        for(var i=0;i<this.data2.length;i++){
            var data = this.data2[i];
            if (data.action==HBGZPDisAction.ZHAO) {
                var cardsVal = data.cards[0].v;
                var cardsIdex = data.cards[0].n;
                if (cardsVal <= 0){
                    for (var j = 0; j < data.cards.length; j++) {
                        if (data.cards[j].v > 0) {
                            cardsVal = data.cards[j].v;
                            cardsIdex = data.cards[j].n;
                            break;
                        }
                    }
                }
                var ptCards = [];
                if (cardsVal > 100){
                    for(var j=4;j<9;j++){
                        var cardsId = j*10 + cardsIdex;
                        ptCards.push(cardsId)
                    }
                }else{
                    for(var j=0;j<5;j++){
                        var cardsId = j*10 + cardsIdex;
                        ptCards.push(cardsId)
                    }
                }
                dataArr.push(this.transData(ptCards));
            }else{
                dataArr.push(data.cards);
            }

        }
        return dataArr;
    },

    getPlace3Data:function(){
        return this.data3;
    },

    getMahjongs1:function(){
        return this.mahjongs1;
    },

    clean:function(){
        if(this.mPanel){
            this.mPanel.removeAllChildren(true);
        }
        if(this.oPanel){
            this.oPanel.removeAllChildren(true);
        }
        if(this.data1){
            this.data1.length=0;
        }
        if(this.data2){
            this.data2.length=0;
        }
        if(this.data3){
            this.data3.length=0;
        }
        if(this.mahjongs1){
            this.mahjongs1.length=0;
        }
        if(this.mahjongs2){
            this.mahjongs2.length=0;
        }
        if(this.mahjongs3){
            this.mahjongs3.length=0;
        }
        if(this.tiArray){
            this.tiArray.length=0;
        }
        this.banker = null;
    },

    /**
     *
     * @param data1 {Array.<PHZVo>}
     * @param data2 {Array.<PHZVo>}
     * @param data3 {Array.<PHZVo>}
     * @param data4 {Array.<PHZVo>}
     */
    refresh:function(data1,data2,data3,data4){
        this.place2x = -1;
        data1 = this.transData(data1);
        data3 = this.transData(data3);
        this.isMoPai = false;
        this.data1 = data1;
        for(var i=0;i<data2.length;i++){
            var data = data2[i];
            if(data.action == HBGZPDisAction.JIAN){
                if(this.JianArray.indexOf(data.cards[0].c) === -1){
                    this.JianArray.push(data.cards[0].c);
                }
            }
            data.cards = this.transData(data.cards);
        }
        this.data2 = data2;
        this.data3 = data3;
        this.refreshP2(data2);
        this.refreshP1(data1);
        this.refreshP3(data3);
    },

    /**
     * 转换前台需要的数据
     * @param ids
     * @param isSort
     * @returns {Array}
     */
    transData:function(ids) {
        var cardIds = [];
        for(var j=0;j<ids.length;j++){
            cardIds.push(HBGZPAI.getPHZDef(ids[j]));
        }
        return cardIds;
    },

    /**
     * refresh place1
     * @param data {Array.<PHZVo>}
     */
    refreshP1:function(data){
    },

    /**
     * refresh place2 左侧已经吃碰跑的牌
     * @param data {Array.<PHZVo>}
     */
    refreshP2:function(data,isOver){
        this.data2 = data;
         cc.log("this.data2======"+JSON.stringify(this.data2));
        var gx = 30 * 1.5;
        var gy = 35 * 1.5;
        var count = 0;
        var nowCards = this.mahjongs2.length;
        for(var i=0;i<data.length;i++){
            var innerObject = data[i];
            var innerAction = innerObject.action;
            if(innerAction == HBGZPDisAction.JIAN || innerAction == HBGZPDisAction.ZHA){//扎或者吃（捡）
                continue;//跳过不显示
            }
            var innerArray = innerObject.cards;
            if (!innerObject.hasOwnProperty("reverse")) {
                innerArray.reverse();
                innerObject.reverse = 1;
            }
            var scale = 0.4;
            var zorder = 0;
            if(innerArray.length === 5){
                gy = 26 * 1.5;
            }
            for(var j=0;j<innerArray.length;j++){
                var card = null;
                var innerVo = innerArray[j];
                if(count<nowCards){
                    card = this.mahjongs2[count];
                    card.refresh(HBGZPAI.getDisplayVo(this.direct,2),innerVo,innerAction);
                }else{
                	card = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,2),innerVo,innerAction);
                    this.mPanel.addChild(card);
                    this.mahjongs2.push(card);
                }
                card.scale = scale;
                if(this.direct==2){
            		card.x = 220 * 1.5-i*gx - i * 5;
            	}else{
                    card.x = i*gx - 30 * 1.5 + i * 5;
            	}
                card.setLocalZOrder(zorder);
                card.y = 104 * 1.5 - j*gy;
                count++;
                zorder++;
            }
        }
        this.place2x = data.length*gx;
    },

    /**
     * refresh place3 右侧已经打出来的牌
     * @param data {Array.<PHZVo>}
     */
    refreshP3:function(data,isQiAni){
        this.data3 = data;

        var offx = 72 * 1.5 + 5;
        var offy = 90 * 1.5;
        var startX = 0;
        var startY = 0;
        var scale = 0.4;
        var maxNumber = 12;//每一行的张数
        var endPos = cc.p(SyConfig.DESIGN_WIDTH,0);
        if(HBGZPRoomModel.renshu == 3){
            if(this.direct != 1){
                maxNumber = 5;
            }
        }else if(HBGZPRoomModel.renshu == 4){
            if(this.direct % 2 == 0){
                maxNumber = 4;
            }else{
                maxNumber = 6;
            }
        }
        switch (this.direct){
            case 2:
                if(HBGZPRoomModel.renshu == 2){
                    offy = -90 * 1.5;
                }else{
                    offy = 85 * 1.5;//90;
                    offx = 72 * 1.5 + 5;
                    startY = (maxNumber - 1) * offy * scale;
                }
                break;
            case 3:
                if(HBGZPRoomModel.renshu == 3){
                    offy = 85 * 1.5;
                    offx = 72 * 1.5 + 5;
                    startY = (maxNumber - 1) * offy * scale;
                }else{
                    offy = -90 * 1.5;
                }
                break;
            case 4:
                offy = 85 * 1.5;
                offx = 72 * 1.5 + 5;
                startY = (maxNumber - 1) * offy * scale;
                break;
        }

        var i=0;
        for(;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].refresh(HBGZPAI.getDisplayVo(this.direct,3),data[i]);
            this.mahjongs3[i].scale = scale;
            if(this.direct == 1 || (HBGZPRoomModel.renshu == 4 && this.direct == 3) || (HBGZPRoomModel.renshu == 2 && this.direct == 2)){
                this.mahjongs3[i].x = (i % maxNumber) * offx * scale + startX;
                this.mahjongs3[i].y = -Math.floor(i / maxNumber) * offy * scale + startY;
            }else{
                if(this.direct == 2){
                    this.mahjongs3[i].x = Math.floor(i / maxNumber) * offx * scale + startX;
                }else{
                    this.mahjongs3[i].x = -Math.floor(i / maxNumber) * offx * scale + startX;
                }
                this.mahjongs3[i].y = -(i % maxNumber) * offy * scale + startY;
            }
        }
        for(;i<data.length;i++) {
            var card = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct, 3), data[i]);
            card.scale = scale;
            if(this.direct == 1 || (HBGZPRoomModel.renshu == 4 && this.direct == 3) || (HBGZPRoomModel.renshu == 2 && this.direct == 2)){
                card.x = (i % maxNumber) * offx * scale + startX;
                card.y = -Math.floor(i / maxNumber) * offy * scale + startY;
            }else{
                if(this.direct == 2){
                    card.x = Math.floor(i / maxNumber) * offx * scale + startX;
                }else{
                    card.x = -Math.floor(i / maxNumber) * offx * scale + startX;
                }
                card.y = -(i % maxNumber) * offy * scale + startY;
            }
            this.mahjongs3.push(card);
            this.oPanel.addChild(card,i);
        }

        if (isQiAni && endPos.x != SyConfig.DESIGN_WIDTH){
            HBGZPRoomEffects.qiPai(endPos);
        }
    },

    changeOutCardTextrue:function(){
        cc.log("changeCardTextrue")
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].refreshCardByOpenTex();
        }
        for(var i=0;i<this.mahjongs2.length;i++){
            this.mahjongs2[i].refreshCardByOpenTex();
        }
    },

    changeOutCardBg:function(){
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].refreshCardBgByOpenTex();
        }
        for(var i=0;i<this.mahjongs2.length;i++){
            this.mahjongs2[i].refreshCardBgByOpenTex();
        }
    },
    /**
     * 去掉某张没出去失败的卡 后台判断出牌异常
     */
    fixOutCard:function(id){
        cc.log(" 刷新出牌 ",id);
        var del = -1;
        var delNodeIndex = -1;

        for(var i=0;i<this.data3.length;i++){
            if(this.data3[i].c == id){
                del = i;
                break;
            }
        }

        if(del >= 0){
            this.data3.splice(del,1);

            for(var i = 0 ; i < this.mahjongs3.length ; i ++ ){
                var cardNode = this.mahjongs3[i];
                if(cardNode && cardNode.getData().c == id){
                    cardNode.removeFromParent(true);
                    delNodeIndex = i;
                    break;
                }
            }
            if(delNodeIndex >= 0){
                this.mahjongs3.splice(delNodeIndex,1);
            }
        }
        cc.log(" 刷新出牌 del,delNodeIndex = ",del," ++++++++  ",delNodeIndex);
        if(del >= 0 || delNodeIndex >= 0){
            this.refreshP3(this.data3);
        }
    },

    //获取自己有没有跑和提的动作
    isPaoTi:function(){
        //var isPt = false;
        //if (this.data2 && this.data2.length > 0){
        //    for(var i=0;i<this.data2.length;i++){
        //        var innerObject = this.data2[i];
        //        if( innerObject.action==PHZAction.PAO || innerObject.action==PHZAction.TI){
        //            isPt = true;
        //            break;
        //        }
        //    }
        //}
        //return isPt;
    }

});