/**
 * Created by Administrator on 2020/3/17.
 */
var YZLCLayout = cc.Class.extend({

    initData:function(direct,mPanel,oPanel,banker,isMoPai){
        this.direct = direct;
        this.banker = banker || null;
        this.mPanel = mPanel;
        this.oPanel = oPanel;
        this.data1 = [];
        this.data2 = [];
        this.data3 = [];
        this.mahjongs1 = [];
        this.mahjongs2 = [];
        this.mahjongs3 = [];
        this.tiArray = [];
        this.isMoPai = isMoPai || false;
        this.place2x = -1;
        //iphoneX 三人 左上角位置 吃碰跑的牌显示位置调整
        if(SdkUtil.isIphoneX() && direct == 3 && PHZRoomModel.is3Ren()){
            this.mPanel.x = 45;
            this.oPanel.x = 45;
        }

        if(SdkUtil.isIphoneX() && direct == 2 && PHZRoomModel.is2Ren()){
            this.mPanel.x = 45;
            this.oPanel.x = 45;
        }

        if(SdkUtil.isIphoneX() && direct == 4 && PHZRoomModel.is4Ren()){
            this.mPanel.x = 45;
        }
    },

    /**
     * 出牌操作
     * @param mjVo {PHZVo}
     */
    chuPai:function(mjVo,notTi){
        //var isHas = false;
        //for(var i=0;i<this.data3.length;i++){
        //    var vo = this.data3[i];
        //    if(vo.c==mjVo.c){
        //        isHas = true;
        //        break;
        //    }
        //}
        //if(!isHas){
        //    this.data3.push(mjVo);
        //    //参数2 是为了区分是不是做弃牌操作
        //    this.refreshP3(this.data3,notTi);
        //}
        //if(this.direct==1)
        //    YZLCMineLayout.delOne(mjVo,true);
    },

    assignInnerObjectByPao:function(innerObject,action,id){
        innerObject.action=action;
        var vo = PHZAI.getPHZDef(id);
        for(var j=0;j<innerObject.cards.length;j++){
            innerObject.cards[j].t = vo.t;
            innerObject.cards[j].n = vo.n;
            innerObject.cards[j].c = vo.c;
        }
        innerObject.cards.push(PHZAI.getPHZDef(id));
    },

    /**
     * 吃、碰、跑、偎等操作的统一处理
     * @param ids
     * @param action
     */
    chiPai:function(ids,action,huxi){
        var voArray = PHZAI.getVoArray(ids);
        var isHas = false;
        if(this.data2 && this.data2.length > 0){
            for(var i = 0;i < this.data2.length;++i){
                var temp = this.data2[i];
                if(JSON.stringify(voArray) === JSON.stringify(temp.cards)){
                    isHas = true;
                    break;
                }
            }
        }
        if(!isHas){
            this.data2.push({action:action,cards:voArray,huxi:huxi});/** 保存戳子 **/
        }
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

    getPlace2CardData:function(){
        var dataArr = [];
        for(var i=0;i<this.data2.length;i++){
            var data = this.data2[i];
            if (data.action==PHZAction.PAO || data.action==PHZAction.TI) {
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
                    for(var j=4;j<8;j++){
                        var cardsId = j*10 + cardsIdex;
                        ptCards.push(cardsId)
                    }
                }else{
                    for(var j=0;j<4;j++){
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
        this.mPanel.removeAllChildren(true);
        this.oPanel.removeAllChildren(true);
        this.data1.length=0;
        this.data2.length=0;
        this.data3.length=0;
        this.mahjongs1.length=0;
        this.mahjongs2.length=0;
        this.mahjongs3.length=0;
        this.tiArray.length=0;
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
            cardIds.push(PHZAI.getPHZDef(ids[j]));
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
        // cc.log("this.data2======"+JSON.stringify(this.data2));
        /***
         *  去掉下水牌界面展示
         */
        //var gx = 39;
        //var gy = 40;
        //var count = 0;
        //var nowCards = this.mahjongs2.length;
        //for(var i=0;i<data.length;i++){
        //    var innerObject = data[i];
        //    var innerAction = innerObject.action;
        //    var innerArray = innerObject.cards;
        //    if (!innerObject.hasOwnProperty("reverse")) {
        //        innerArray.reverse();
        //        innerObject.reverse = 1;
        //    }
        //    var zorder = innerArray.length;
        //    for(var j=0;j<innerArray.length;j++){
        //        var card = null;
        //        var innerVo = innerArray[j];
        //        switch (innerAction){
        //            case PHZAction.WEI://偎
        //                if(PHZRoomModel.wanfa==38){
        //                    if(this.direct==1){
        //                        innerVo.as = 1;
        //                    }else{
        //                        innerVo.a = 1;
        //                    }
        //                }else{
        //                    innerVo.a = 0;
        //                    innerVo.as = 0;
        //                    if(j<2)
        //                        innerVo.a=1;
        //                }
        //                break;
        //            case PHZAction.CHOU_WEI://臭偎
        //                innerVo.a = 0;
        //                innerVo.as = 0;
        //                if(j<2)
        //                    innerVo.a=1;
        //                break;
        //            case PHZAction.TI://提
        //            case 11:
        //            case 18://岳阳歪胡子的起手4张溜，全部扑牌不显示
        //                innerVo.a = 0;
        //                innerVo.as = 0;
        //                if(j<3)
        //                    innerVo.a=1;
        //                break;
        //            case PHZAction.CHI://吃
        //                if(j==2)
        //                    innerVo.zhe=1;
        //                break;
        //            case PHZAction.PAO://跑
        //                innerVo.as = innerVo.a = innerVo.zhe = 0;
        //                break;
        //        }
        //        if(count<nowCards){
        //            card = this.mahjongs2[count];
        //            card.refresh(PHZAI.getDisplayVo(this.direct,2),innerVo,innerAction);
        //        }else{
        //            card = new YZLCCard(PHZAI.getDisplayVo(this.direct,2),innerVo,innerAction);
        //            this.mPanel.addChild(card);
        //            this.mahjongs2.push(card);
        //        }
        //        if(this.direct==2 && PHZRoomModel.renshu != 2){
        //            card.x = 158-i*gx;
        //        }else{
        //            card.x = i*gx;
        //        }
        //        card.setLocalZOrder(zorder);
        //        card.y = j*gy;
        //        count++;
        //        zorder--;
        //
        //        //cc.log("card.y",card.y,card.x)
        //    }
        //}
        //this.place2x = data.length*gx;
    },

    /**
     * refresh place3 右侧已经打出来的牌
     * @param data {Array.<PHZVo>}
     */
    refreshP3:function(data,isQiAni){
        //this.data3 = data;
        /***
         *  去掉出的牌界面展示
         */
        //var g = 39;
        //var initVal = 0;
        //if(PHZRoomModel.renshu==4){
        //    initVal=(this.direct==3 || this.direct==4) ? 0 : 308;
        //}else if(PHZRoomModel.renshu==3){
        //    initVal=(this.direct==3) ? 0 : 308;
        //}else{
        //    initVal=(this.direct==2) ? 0 : 308;
        //}
        //for(var i=0;i<this.mahjongs3.length;i++){
        //    this.mahjongs3[i].refresh(PHZAI.getDisplayVo(this.direct,3),data[i]);
        //}
        //var maxLength = 40;
        //var endPos = cc.p(1280,0);
        //for(;i<data.length;i++){
        //    var card = new YZLCCard(PHZAI.getDisplayVo(this.direct,3),data[i]);
        //    this.mahjongs3.push(card);
        //    if(PHZRoomModel.renshu==4){
        //        if(this.direct == 3 || this.direct == 4 || this.direct == 2){
        //            if (this.direct == 2){
        //                if(i<5){
        //                    card.x = initVal-i*g;
        //                }else{
        //                    card.x = initVal-(i-5)*g;
        //                    card.y = -47;
        //                }
        //            }else{
        //                if(i<5){
        //                    card.x = initVal+i*g;
        //                }else{
        //                    card.x = initVal+(i-5)*g;
        //                    card.y = -47;
        //                }
        //
        //            }
        //        }else{
        //            //if(i<5){
        //            card.x = initVal-i*g;
        //            //}else{
        //            //    card.x = initVal-(i-5)*g;
        //            //    card.y = 47;
        //            //}
        //        }
        //    }else if(PHZRoomModel.renshu==3){
        //        if(this.direct==3){
        //            if(i<5){
        //                card.x = initVal+i*g;
        //            }else{
        //                card.x = initVal+(i-5)*g;
        //                card.y = 47;
        //            }
        //        }else{
        //            if(i<5){
        //                card.x = initVal-i*g;
        //            }else{
        //                card.x = initVal-(i-5)*g;
        //                card.y = 47;
        //            }
        //        }
        //    }else if(PHZRoomModel.renshu==2){
        //        if (PHZRoomModel.wanfa == PHZGameTypeModel.ZHZ || PHZRoomModel.wanfa == PHZGameTypeModel.HYLHQ || PHZRoomModel.wanfa == PHZGameTypeModel.HYSHK
        //            || PHZRoomModel.wanfa == PHZGameTypeModel.LDS || PHZRoomModel.wanfa == PHZGameTypeModel.YZCHZ){
        //            if(this.direct==2){
        //                if(i<8){
        //                    card.x = initVal+i*g;
        //                }else if(i<16){
        //                    card.x = initVal+(i-8)*g;
        //                    card.y = 47;
        //                }else{
        //                    card.x = initVal+(i-16)*g;
        //                    card.y = 94;
        //                }
        //            }else{
        //                if(i<8){
        //                    card.x = initVal-i*g;
        //                }else if(i<16){
        //                    card.x = initVal-(i-8)*g;
        //                    card.y = 47;
        //                }else{
        //                    card.x = initVal-(i-16)*g;
        //                    card.y = 94;
        //                }
        //            }
        //        }else{
        //            if(this.direct==2){
        //                if(i<5){
        //                    card.x = initVal+i*g;
        //                }else{
        //                    card.x = initVal+(i-5)*g;
        //                    card.y = 47;
        //                }
        //            }else{
        //                if(i<5){
        //                    card.x = initVal-i*g;
        //                }else{
        //                    card.x = initVal-(i-5)*g;
        //                    card.y = 47;
        //                }
        //            }
        //        }
        //    }
        //
        //    if (i == data.length -1 ){
        //        endPos.x = card.x;
        //        endPos.y = card.y;
        //    }
        //    if(PHZRoomModel.renshu==4){
        //        this.oPanel.addChild(card,i);
        //    }else{
        //        this.oPanel.addChild(card,maxLength-i);
        //    }
        //}
        //
        //if (isQiAni && endPos.x != 1280){
        //    PHZRoomEffects.qiPai(endPos);
        //}
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
                    delNodeIndex = i;
                    break;
                }
            }
            if(delNodeIndex >= 0){
                this.mahjongs3.splice(delNodeIndex,1);
            }
        }

        if(del >= 0 || delNodeIndex >= 0){
            this.refreshP3(this.data3);
        }
    },

    //获取自己有没有跑和提的动作
    isPaoTi:function(){
        var isPt = false;
        if (this.data2 && this.data2.length > 0){
            for(var i=0;i<this.data2.length;i++){
                var innerObject = this.data2[i];
                if( innerObject.action==PHZAction.PAO || innerObject.action==PHZAction.TI){
                    isPt = true;
                    break;
                }
            }
        }
        return isPt;
    }

});