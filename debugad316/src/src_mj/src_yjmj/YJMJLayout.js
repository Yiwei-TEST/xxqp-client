 /**
 * Created by zhoufan on 2016/7/23.
 */

var YJMJLayout = cc.Class.extend({
	gangPai:[],
    initData:function(direct,mPanel,oPanel,hPanel){
        if (MJRoomModel.renshu == 2 && direct == 2){
            direct = 3;
        }
        if (MJRoomModel.renshu == 3 && direct == 3){
            direct = 4;
        }
        this.direct = direct;
        this.mPanel = mPanel;
        this.oPanel = oPanel;
        this.hPanel = hPanel;
        this.mPanel.setBackGroundColorOpacity(0);
        this.oPanel.setBackGroundColorOpacity(0);
        this.hPanel.setBackGroundColorOpacity(0);
        this.data1 = [];
        this.data2 = [];
        this.data3 = [];
        this.data4 = [];
        this.gangPai = [];
        this.mahjongs1 = [];
        this.mahjongs2 = [];
        this.mahjongs3 = [];
    },

    changeMahjongRes:function(type){
        for(var i=0;i<this.mahjongs1.length;i++){
           this.mahjongs1[i].changeSkin(type);
        }
        for(var i=0;i<this.mahjongs2.length;i++){
            this.mahjongs2[i].changeSkin(type);
        }
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].changeSkin(type);
        }
    },
    changeMahjongZi:function(type){
        for(var i=0;i<this.mahjongs1.length;i++){
            this.mahjongs1[i].changeZi(type);
        }
        for(var i=0;i<this.mahjongs2.length;i++){
            this.mahjongs2[i].changeZi(type);
        }
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].changeZi(type);
        }
    },

    ccTingPai:function(){
        //cc.log("ccTingPai::"+JSON.stringify(MJRoomModel.nearestTingResult));
        var pushOutArray = MJRoomModel.getTingAllPushOutVoArray();
        for(var i=0;i<this.mahjongs1.length;i++){
            var mahjongs = this.mahjongs1[i];
            var curVo = mahjongs.getData();
            mahjongs.onDisplayByTingPai(false);
            for(var j=0;j<pushOutArray.length;j++){
                var pushVo = pushOutArray[j];
                if(curVo.t==pushVo.t&&curVo.n==pushVo.n) {
                    mahjongs.onDisplayByTingPai(true);
                }
            }
        }
    },

     yjmjTingPai:function(){
         //cc.log("ccTingPai::"+JSON.stringify(MJRoomModel.nearestTingResult));
         var pushOutArray = MJRoomModel.getTingAllPushOutVoArray();
         for(var i=0;i<this.mahjongs1.length;i++){
             var mahjongs = this.mahjongs1[i];
             var curVo = mahjongs.getData();
             var isHas = false;
             for(var j=0;j<pushOutArray.length;j++){
                 var pushVo = pushOutArray[j];
                 if(curVo.t==pushVo.t&&curVo.n==pushVo.n)
                     isHas = true;
             }
             if(!isHas){
                 this.mahjongs1[i].csGang();
             }
         }
     },

     yjmjCancelTingPai:function(){
         for(var i=0;i<this.mahjongs1.length;i++){
             this.mahjongs1[i].cancelCsGang();
         }
     },

     yjmjGangPai:function(){
         for(var i=0;i<this.mahjongs1.length;i++){
             this.mahjongs1[i].csGang();
         }
     },

    ccTingPaiByGC:function(array){
        var pushOutArray = array || MJRoomModel.getTingAllPushOutVoArray();
        for(var i=0;i<this.mahjongs1.length;i++){
            var mahjongs = this.mahjongs1[i];
            var curVo = mahjongs.getData();
            mahjongs.onDisplayTingPaiByGC(false);
            var index = MJAI.findIndexByMJVoI(pushOutArray, curVo.i);
            if(index < 0){
                mahjongs.onDisplayTingPaiByGC(true);
            }
        }
    },

    ccCancelTingPai:function(){
        for(var i=0;i<this.mahjongs1.length;i++){
            this.mahjongs1[i].cancelTingPai();
        }
    },


    //显示所有可听牌的箭头
    outCardTingPai:function(info){
        var pushOutArray = info || [];
        for(var i=0;i<this.mahjongs1.length;i++){
            var mahjongs = this.mahjongs1[i];
            var curVo = mahjongs.getData();
            for(var j=0;j < pushOutArray.length; j++){
                if (pushOutArray[j].majiangId && curVo.c == pushOutArray[j].majiangId){
                    var num = pushOutArray[j].tingNum;
                    mahjongs.displayTingArrows(pushOutArray[j].tingMajiangIds,num);
                }
            }
        }
    },


    //获取当前可听牌的总张数
    getCardAllNumById:function(list){
        var num = 0;
        for(var i = 0;i< list.length; i++){
            var vo = MJAI.getMJDef(list[i]);
            num = num + this.getCardNumById(vo);
        }
        return num;
    },

    //清除听牌的箭头
    clearTingArrows:function(){
        for(var i=0;i<this.mahjongs1.length;i++){
            this.mahjongs1[i].removeTingArrows();
        }
    },

    //获取当前牌的个数
    getCardNumById:function(vo){
        var num = 0;
        for(var i=0;i<this.mahjongs1.length;i++){
            var mahjongs = this.mahjongs1[i];
            var curVo = mahjongs.getData();
            if (curVo.i == vo.i){
                num = num +1;
            }
        }
        for(var i=0;i<this.mahjongs2.length;i++){
            var mahjongs = this.mahjongs2[i];
            var curVo = mahjongs.getData();
            if (curVo.i == vo.i){
                num = num +1;
            }
        }
        for(var i=0;i<this.mahjongs3.length;i++){
            var mahjongs = this.mahjongs3[i];
            var curVo = mahjongs.getData();
            if (curVo.i == vo.i){
                num = num +1;
            }
        }
        return num;
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
            finger.x -=23;
        if(this.direct==2||this.direct==4)
            finger.x -=16;
        var initY = lastMahjong.y+lastMahjong.height/2;
        if(this.direct==1||this.direct==3)
            initY-=10;
        //if(this.direct==2||this.direct==4)
        //    initY+=0;
        finger.y = initY;
        finger.visible = true;
        finger.stopAllActions();
        finger.runAction(cc.sequence(cc.moveTo(0.8,finger.x,initY+20),cc.moveTo(0.5,finger.x,initY)).repeatForever());
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
            var card = new YJMahjong(MJAI.getDisplayVo(this.direct,3),data[i]);
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
        var hasIndex = MJAI.findIndexByMJVoC(this.data3,mjVo.c);
        if (hasIndex < 0) {
            this.data3.push(mjVo);
            this.refreshP3(this.data3);
            if(!isCsGang)
                this.delFromPlace1(mjVo.c);
        }
        this.showFinger();
    },

    getCardPos:function(id){
        var point = cc.p(0,0);
        for(var i=0;i<this.mahjongs1.length;i++){
            var cardVo = this.mahjongs1[i]._cardVo;
            if(cardVo.c == id){
                point.x = this.mahjongs1[i].initX;
                point.y = 80;
                break;
            }
        }
        return point;
    },

    hideFinger:function(){
        var finger = this.oPanel.getChildByTag(777);
        if(finger){
            finger.stopAllActions();
            finger.visible = false;
        }
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
        if(del<0&&this.direct!=1)
            del = 0;
        if(del>=0){
            this.data1.splice(del,1);
            var mahjong = this.mahjongs1.splice(del,1);
            if(mahjong.length>0)
                mahjong[0].pushOut();
            //if(!MJRoomModel.isYJMJ()){
                this.data1.sort(MJAI.sortMJ);
            //}else{
            //    this.sortByYJ();
            //}
            this.refreshP1(this.data1);
        }
    },

    sortByYJ:function(){
        if(this.data1.length==0)
            return;
        var tempArray = [];
        //var emptyArray = [];
        var hzArray = [];
        for(var i=0;i<this.data1.length;i++){
            var vo = this.data1[i];
            if(vo.t!=4){
                tempArray.push(vo);
                //emptyArray[i] = null;
            }else{
                var prev = this.data1[i-1];
                var next = this.data1[i+1];
                //emptyArray[i] = vo;
                hzArray.push({prevData:prev,selfData:vo,nextData:next});
            }
        }
        tempArray.sort(MJAI.sortMJ);
        var insertArray = function(hzObject){
            var insertIndex = -1;
            for(var i=0;i<tempArray.length;i++){
                var temp = tempArray[i];
                var prev = hzObject.prevData;
                if(prev && temp.c==prev.c){
                    insertIndex = i+1;
                    break;
                }
            }
            if(insertIndex<0){
                for(var i=0;i<tempArray.length;i++){
                    var temp = tempArray[i];
                    var next = hzObject.nextData;
                    if(next && temp.c==next.c){
                        insertIndex = i;
                        break;
                    }
                }
            }
            if(insertIndex>=0){
                tempArray.splice(insertIndex,0,hzObject.selfData);
            }
        }
        for(var i=0;i<hzArray.length;i++){
            insertArray(hzArray[i]);
        }
        if(tempArray.length!=this.data1.length){
            for(var j=0;j<hzArray.length;j++){
                var push = hzArray[j];
                for(var i=0;i<tempArray.length;i++){
                    if(push&&tempArray[i].c==push.selfData.c)
                        push = null;
                }
                if(push)
                    tempArray.push(push.selfData);
            }
        }
        //for(var i=0;i<tempArray.length;i++){
        //    for(var j=0;j<emptyArray.length;j++){
        //        var empty = emptyArray[j];
        //        if(empty==null){
        //            emptyArray[j] = tempArray[i];
        //            break;
        //        }
        //    }
        //}
        this.data1 = tempArray;
    },

    /**
     * 碰、杠操作
     * @param ids
     */
    pengPai:function(ids,action,fromSeat){
        var voArray = MJAI.getVoArray(ids);
        var hasInsert = false;
        var vo0 = voArray[0];
        if(action==MJAction.XIA_DAN && ids.length==1){//补蛋，需要特殊处理下
            if(MJAI.isYiTiao(vo0)){//一条特殊处理
                for(var i=0;i<this.data2.length;i++){
                    var innerObj = this.data2[i];
                    if(innerObj.danType==MJDanType.BU_YI_TIAO){
                        innerObj.cards.push(vo0);
                        hasInsert = true;
                        break;
                    }
                }
                if(!hasInsert)
                    this.data2.push({action:action,cards:voArray,huxi:-1});
            }else{
                var curType = MJAI.findDanType(voArray);
                //找到已有的下了蛋的类型，将补蛋的这张牌放进去
                for(var i=0;i<this.data2.length;i++){
                    var innerObj = this.data2[i];
                    if(innerObj.danType==curType){
                        var cards = innerObj.cards;
                        var isExist = MJAI.isExistInDan(cards,vo0);
                        cards.push(vo0);
                        //如果已有的下了的蛋内含有一条，需要把一条踢出去
                        var yitiaoIndex = MJAI.getYiTiaoIndexInArray (cards);
                        if(yitiaoIndex>=0&&!isExist){
                            var delArray = cards.splice(yitiaoIndex,1);
                            this.pengPai([delArray[0].c],action,-1);
                        }
                        break;
                    }
                }
            }
        }else if((action==MJAction.GANG||action==MJAction.BU_ZHANG) && ids.length==1){//先碰后杠
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
            this.data2.push({action:action,cards:voArray,huxi:fromSeat});
        }
        this.refreshP2(this.data2);
        if(action==MJAction.CHI){
            ids.splice(1,1);
        }else if(action==MJAction.XIA_DAN){
            //noting to do
        }else{
            if(action!=MJAction.AN_GANG && action!=MJAction.BU_ZHANG
                && ids.length>1)
                ids.pop();
            if(action==MJAction.BU_ZHANG&&ids.length>3&&fromSeat)//补张在手上有三个，别人打来一个时，需要踢出最后一个
                ids.pop();
        }
        if(this.direct!=1&&this.data1.length<=1){
            this.refreshP1(this.data1);
            return;
        }
        if(fromSeat<0){//特殊处理替换鸟的逻辑 不需要删除place1的牌
            //noting to do
        }else{
            for(var i=0;i<ids.length;i++) {
                this.delFromPlace1(ids[i]);
            }
        }
    },

    onShanDianOK: function() {
        this.oPanel.removeChildByTag(999);
    },

    playDianPaoEff: function() {
        var mahjong = this.mahjongs3[this.mahjongs3.length-1];
        var shandian = new AnimateSprite("res/plist/shandian.plist","shandian",1/15);
        shandian.anchorX=shandian.anchorY=0;
        shandian.x = mahjong.x;
        shandian.y = mahjong.y;
        switch (this.direct) {
            case 1:
                shandian.x -= 85;
                shandian.y -= 50;
                break;
            case 2:
                shandian.x -= 75;
                shandian.y -= 50;
                break;
            case 3:
                shandian.x -= 85;
                shandian.y -= 50;
                break;
            case 4:
                shandian.x -= 75;
                shandian.y -= 50;
                break;
        }
        shandian.setCallBack(this.onShanDianOK,this);
        shandian.setRepeatTimes(1);
        shandian.play();
        this.oPanel.addChild(shandian,1000,999);
    },

    /**
     * 胡牌
     * @param ids
     */
    huPai:function(ids,isZiMo,fromSeat){
        var voArray = MJAI.getVoArray(ids);
        var last = voArray.pop();
        this.data4.push({action:isZiMo ? 1 : 0,cards:[last.c],huxi:fromSeat});
        this.refreshP4(this.data4);
        if (isZiMo) {
            this.delFromPlace1(last.c);
        }
    },

    /**
     * 结束后，把所有牌展示出来
     * @param ids
     */
    tanPai:function(ids){
        var voArray = MJAI.getVoArray(ids);
        var last = voArray.pop();
        voArray.sort(MJAI.sortMJ);
        voArray.push(last);
        this.data2.push({action:MJAction.HU,cards:voArray});
        this.refreshP2(this.data2);
        for(var i=0;i<ids.length;i++) {
            this.delFromPlace1(ids[i]);
        }
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
            var mahjong = this.mahjongs3.splice(del,1);
            if(mahjong.length>0)
                mahjong[0].pushOut();
        }
    },

    getPlace1Data:function(){
        return this.data1;
    },

    getPlace2Data:function(){
        var voArray = [];
        for(var i=0;i<this.data2.length;i++){
            var innerObject = this.data2[i];
            for(var j=0;j<innerObject.cards.length;j++){
                voArray.push(innerObject.cards[j]);
            }
        }
        return voArray;
    },

    getPlace2SourceData:function(){
        return this.data2;
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
        this.hPanel.removeAllChildren(true);
        this.mahjongs1.length=0;
        this.mahjongs2.length=0;
        this.mahjongs3.length=0;
        this.banker = null;
    },

    /**
     * 计算摆下来的牌的真实长度
     * @returns {number}
     */
    calcData2Length:function(){
        var length = 0;
        for(var i=0;i<this.data2.length;i++){
            var innerObject = this.data2[i];
            var action = innerObject.action;
            var cards = innerObject.cards;
            switch (action){
                case MJAction.XIA_DAN:
                    if(cards.length>=3 && innerObject.huxi>=0){
                        length+=3;
                    }
                    break;
                case MJAction.AN_GANG:
                case MJAction.GANG:
                case MJAction.BU_ZHANG:
                    length+=3;
                    break;
                default :
                    length+=cards.length;
                    break;
            }
        }
        return length;
    },

    /**
     *
     * @param data1 {Array.<MJVo>}
     * @param data2 {Array.<MJVo>}
     * @param data3 {Array.<MJVo>}
     * @param bankerSeat {number}
     * @param isMoPai {Boolean}
     */
    refresh:function(data1,data2,data3,data4,bankerSeat,isMoPai){
        data1 = this.transData(data1,true,isMoPai);
        data3 = this.transData(data3,false);
        this.data1 = data1;
        this.data2 = data2;
        this.gangPai = [];
        for(var i=0;i<data2.length;i++){
            var data = data2[i];
            data.cards = this.transData(data.cards,false);
        }
        this.data2 = data2;
        this.data3 = data3;
        this.refreshP2(data2);
        //除开方向1，其他方向的牌是没有ID的，通过已经摆下来的牌的数量和是否摸牌来决定手上有多少张牌
        if(this.direct!=1&&this.data1.length==0){
            var number = MJAI.MJ_NUMBER-this.calcData2Length();
            for(var i=0;i<number;i++){
                this.data1.push({});
            }
            if(bankerSeat || isMoPai)//庄家、摸牌时多发一张牌
                this.data1.push({});
        }
        this.refreshP1(data1);
        this.refreshP3(data3);
        data4 = ArrayUtil.clone(data4);
        this.refreshP4(data4);
    },

    /**
     * 转换前台需要的数据
     * @param ids
     * @param isSort
     * @param isMoPai
     * @returns {Array}
     */
    transData:function(ids,isSort,isMoPai) {
        var cardIds = [];
        for(var j=0;j<ids.length;j++){
            cardIds.push(MJAI.getMJDef(ids[j]));
        }
        if(isSort && cardIds.length>0){
            var moVo = null;
            if(isMoPai){
                moVo = cardIds.pop();
                moVo.m=1;
            }
            cardIds.sort(MJAI.sortMJ);
            if(moVo)
                cardIds.push(moVo);
        }
        return cardIds;
    },

    /**
     * refresh place1
     * @param data {Array.<MJVo>}
     */
    refreshP1:function(data){
        var first_wang = 0;
        var second_wang = 0;
        if (MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ){
            if (MJRoomModel.ahmj_wangID && MJRoomModel.ahmj_wangID != -1){
                var cardVo = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
                if (MJRoomModel.intParams[4] == 1){//四王
                    first_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;
                }else{
                    if (MJRoomModel.intParams[4] == 2){//七王
                        first_wang = (cardVo.n )>9?(cardVo.n )%9:cardVo.n ;
                        second_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;
                    }
                }
            }
        }else if(MJRoomModel.wanfa == GameTypeEunmMJ.TJMJ){
            if (MJRoomModel.tjmj_dipaiID && MJRoomModel.tjmj_tianpaiID){
                var cardVo = MJAI.getMJDef(MJRoomModel.tjmj_tianpaiID);
                first_wang = (cardVo.n )>9?(cardVo.n )%9:cardVo.n ;
            }
        } else if(MJRoomModel.wanfa == GameTypeEunmMJ.GDCSMJ){
            if (MJRoomModel.gdcsmj_dipaiID && MJRoomModel.gdcsmj_tianpaiID){
                var cardVo = MJAI.getMJDef(MJRoomModel.gdcsmj_tianpaiID);
                first_wang = cardVo;
            }
        }

        for(var i=0;i<data.length;i++){
            if (MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ){
                if (MJRoomModel.ahmj_wangID && MJRoomModel.ahmj_wangID != -1){
                    if (data[i].t ==  MJAI.getMJDef(MJRoomModel.ahmj_wangID).t && (data[i].n == first_wang || data[i].n == second_wang)){
                        data[i].wang = 1;
                    }
                }
            } else if (MJRoomModel.wanfa == GameTypeEunmMJ.TJMJ){
                if (MJRoomModel.tjmj_dipaiID && MJRoomModel.tjmj_tianpaiID){
                    if (data[i].t ==  MJAI.getMJDef(MJRoomModel.tjmj_tianpaiID).t && (data[i].n == first_wang)){
                        data[i].wang = 1;
                    }
                }
                if(MJRoomModel.tjmjTing) {
                    data[i].openTing = 1;
                    if(data.length % 3 == 2){
                        if(i == data.length - 1){
                            data[i].openTing = 0;//最后一张不锁
                        }else{
                            data[i].tingDisplay = 0;//其他牌不显示听牌数量
                        }
                    }
                }
            }else if (MJRoomModel.wanfa == GameTypeEunmMJ.GDCSMJ){
                if (MJRoomModel.gdcsmj_dipaiID && MJRoomModel.gdcsmj_tianpaiID){
                    if (data[i].t ==  MJAI.getMJDef(MJRoomModel.gdcsmj_tianpaiID).t && (data[i].i == first_wang.i)){
                        data[i].wang = 1;
                    }
                }
            }
        }

        var newData = [];
        for(var j=0;j<data.length;j++){
            if (data[j].i == 201 && data[j].m != 1){
                newData.push(data[j]);
            }
        }
        for(var j=0;j<data.length;j++){
            if (data[j].i != 201 || data[j].m == 1){
                newData.push(data[j]);
            }
        }
        //cc.log("data===",JSON.stringify(data));
        // cc.log("newData===",JSON.stringify(newData));
        //test
        //var style = 1;//1 旧麻将 2 新麻将
        this.data1 = newData;
        var gapMapping = {1:133,2:41,3:58,4:41};//{1:88,2:34,3:44,4:34};
        //if (cc.winSize.width > SyConfig.DESIGN_WIDTH && SdkUtil.isLiuHaiPin()){
        //    gapMapping[1] = (parseInt(cc.winSize.width) - 14*133)/2 / 14  + 133;
        //}
        // cc.log("gapMapping[1] = ",gapMapping[1]);
        var g=gapMapping[this.direct];
        var initVal=this.p2Mark;
        var correctCoord = function(direct,card,i,zorder,isMopai){
            // cc.log("newData[i].hasOwnProperty(m) =,i>12 =",newData[i].hasOwnProperty("m"),i);
            if(direct==1){
                //card.scale = 0.95;
                //card.scale = g/133;
                //card.setScaleY(g/133 + 0.05);
                card.x = initVal+i*(g+1);
                card.setLocalZOrder(1);
            }else if(direct==3){
                card.x = initVal-i*g;
            }else{
                card.x = (direct==4) ? 20 : 0;
            }
            if(direct==4){
                card.y = initVal-i*g;
            }else if(direct==2) {
                card.y = initVal+i*g;
                card.setLocalZOrder(zorder);
            }else{
                card.y = 0;
            }
            if(newData[i].hasOwnProperty("m") || i>12 || isMopai){//摸牌的处理
                if(direct==1)
                    card.x += 30;
                if(direct==2)
                    card.y += 35;
                if(direct==3)
                    card.x -= 16;
                if(direct==4)
                    card.y -= 35;
            }
            card.initCoord();
        }
        var zorder = this.data1.length;
        for(var i=0;i<this.mahjongs1.length;i++){
            var card = this.mahjongs1[i];
            correctCoord(this.direct,card,i,zorder);
            zorder--;
            newData[i].feiDisplay = 1;
            card.refresh(MJAI.getDisplayVo(this.direct,1),newData[i]);
        }
        for(;i<newData.length;i++){
            newData[i].feiDisplay = 1;
            var card = new YJMahjong(MJAI.getDisplayVo(this.direct,1),newData[i]);
            this.mahjongs1.push(card);
            var isMopai = (this.data1.length%3 == 2 && i > (this.data1.length - 2))? true : false;//有碰牌时摸牌的处理
            correctCoord(this.direct,card,i,zorder,isMopai);
            zorder--;
            this.mPanel.addChild(card);
        }
    },

    /**
     *
     * @param voArray
     * @param type
     */
    handleWithPlace2:function(innerObject){
        var voArray = innerObject.cards;
        var isBuYiTiao = innerObject.huxi<0;
        var resultArray = [];
        if(isBuYiTiao){//设置下蛋的类型
            innerObject.danType = MJDanType.BU_YI_TIAO;
        }else{
            innerObject.danType = MJAI.findDanType(voArray);
        }
        for(var i=0;i<voArray.length;i++){
            var vo = MJAI.getMJDef(voArray[i].c);
            if(isBuYiTiao || (vo.t!=1||vo.n!=1)){//一条补蛋；且正常的下蛋中，排除一条
                var isHas = false;
                for(var j=0;j<resultArray.length;j++){
                    var innerMJVo = resultArray[j];
                    if(innerMJVo.t==vo.t&&innerMJVo.n==vo.n){
                        innerMJVo.dan += 1;
                        isHas = true;
                        break;
                    }
                }
                if(!isHas){
                    vo.dan = 1;
                    resultArray.push(vo);
                }
            }else{
                resultArray.push(vo);
            }
        }

        return resultArray;
    },

    /**
     * refresh place2
     * @param data {Array.<MJVo>}
     */
    refreshP2:function(data){
        this.data2 = data;
        this.data2.sort(MJAI.sortPlaceData2);
        var g,initVal;
        var totalCount = this.calcData2Length();
        var modext = totalCount>=13 ? 0 : data.length-1;
        switch (this.direct) {
            case 1:
                g = 94;
                var w = cc.director.getWinSize().width;
                initVal = 15 - (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 ;
                // if (totalCount >= 14)
                    // initVal = (w - (totalCount * g) - (data.length - 1) * 10) / 2;
                break;
            case 2:
                g = 46;
                initVal = -40 ;
                break;
            case 3:
                g = 64;
                initVal = 550;
                break;
            case 4:
                g = 46;
                initVal = 440;
                break;
        }
        var zorder = totalCount;
        var count = 0;
        var nowCards = this.mahjongs2.length;
        for(var i=0;i<data.length;i++) {
            var innerObject = data[i];
            var innerAction = innerObject.action;
            var innerArray = innerObject.cards;
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG||innerAction==MJAction.GANG ||innerAction==MJAction.BU_ZHANG) && (innerArray.length>3 || innerObject.gangVo)){
                if(innerObject.gangVo){
                    gangVo = innerObject.gangVo;
                }else {
                    gangVo = innerArray.pop();
                    innerObject.gangVo = gangVo;
                }
            }
            if(innerAction==MJAction.XIA_DAN){
                innerArray = this.handleWithPlace2(innerObject);
            }
            var mod = i;
            for(var j=0;j<innerArray.length;j++){
                var card = null;
                var innerVo = innerArray[j];
                if(innerAction==MJAction.AN_GANG)
                    innerVo.a = 1;
                if(count<nowCards){
                    card = this.mahjongs2.shift();
                    card.refresh(MJAI.getDisplayVo(this.direct,2),innerVo);
                }else{
                    card = new YJMahjong(MJAI.getDisplayVo(this.direct,2),innerVo);
                    this.mPanel.addChild(card);
                }

                if(innerAction == MJAction.PENG && innerObject.huxi > 0 && j==1){
                    card.showPengDir(innerObject.huxi);
                }

                this.mahjongs2.push(card);
                //处理下坐标,每束牌需要隔开显示
                if(this.direct==1){
                    card.scale = 0.9;
                    card.x = initVal+count*g*0.9+10*mod;
                }else if(this.direct==3) {
                    card.x = initVal-count*g-10*mod;
                }else{
                    card.x = 0;
                }
                if(this.direct==2){
                    card.y = initVal+count*g+18*mod;
                    card.setLocalZOrder(zorder);
                }else if(this.direct==4){
                    card.y = initVal-count*g-18*mod;
                    card.x = -20;
                }else if(this.direct==3) {
                    card.y = 0;
                } else {
                    card.y = 0;
                }
                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        //if(innerAction==MJAction.AN_GANG && this.direct!=1)
                        //    gangVo.a = 1;
                        var gang = new YJMahjong(MJAI.getDisplayVo(this.direct,2),gangVo);
                        if(this.direct==1)
                            gang.y = 20;
                        if(this.direct==2)
                            gang.y += 15;
                        if(this.direct==3)
                            gang.y += 12;
                        if(this.direct==4)
                            gang.y += 15;
                        gang.scale = 1;
                        card.addChild(gang,1,333);
                    }
                }
                zorder--;
                count++;
            }
        }
        if(this.direct==1)
            this.p2Mark = data.length>0 ? card.x+g+11 : initVal;
        if(this.direct==2)
            this.p2Mark = data.length>0 ? card.y+g+23 : initVal+totalCount*5;
        if(this.direct==3)
            this.p2Mark = data.length>0 ? card.x-g-15 : initVal;
        if(this.direct==4)
            this.p2Mark = data.length>0 ? card.y-g-35 : initVal;
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
                g = 64;
                initVal = MJRoomModel.renshu ==2? 34 + 360:34+20;
                break;
            case 2:
                g = 46;
                initVal = g - 80;
                break;
            case 3:
                g = 64;
                initVal = MJRoomModel.renshu ==2?this.oPanel.width-g-530:this.oPanel.width-g-35;
                break;
            case 4:
                g = 46;
                initVal = this.oPanel.height-g +80;
                break;
        }
        var zorder = this.data3.length;
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].refresh(MJAI.getDisplayVo(this.direct,3),data[i]);
            if(this.direct==2)
                this.mahjongs3[i].setLocalZOrder(zorder);
            zorder--;
        }
        var rowCount = 10;
        // if (MJRoomModel.renshu == 2){
        //     rowCount = 20;
        // }else if(MJRoomModel.renshu == 3 && this.direct==1){
        //     rowCount = 12;
        // }

        for(;i<data.length;i++){
            var card = new CSMahjong(MJAI.getDisplayVo(this.direct,3),data[i]);
            this.mahjongs3.push(card);
            if(this.direct==1){
                card.x = initVal+(i%rowCount)*g;
            }else if(this.direct==3){
                card.x = initVal-(i%rowCount)*g;
            }else{
                card.x = 0;
                var localNumber = Math.floor(i / rowCount);
                if(this.direct==2)
                    card.x = 120 - localNumber * 76;
                if(this.direct==4)
                    card.x = -100 + localNumber * 76;
            }
            if(this.direct==4){
                card.setLocalZOrder(i);
                card.y = initVal-(i%rowCount)*g;
            }else if(this.direct==2){
                card.setLocalZOrder(zorder);
                card.y = initVal+(i%rowCount)*g;
            }else{
                card.y = 0;
                var localNumber = Math.floor(i / rowCount);
                if(this.direct==1)
                    card.y = -110 + localNumber * 72;
                card.setLocalZOrder(5 - localNumber);
                if(this.direct==3){
                    card.y = 130 - localNumber * 72;
                    card.setLocalZOrder(5 + localNumber);
                }
            }
            this.oPanel.addChild(card);
            zorder--;
        }
        if(this.direct==1)
            this.chuPaiMark = card ? card.x : initVal;
        if(this.direct==2)
            this.chuPaiMark = card ? card.y : initVal;
        if(this.direct==3)
            this.chuPaiMark = card ? card.x : initVal;
        if(this.direct==4)
            this.chuPaiMark = card ? card.y : initVal;
    },

    refreshP4: function(data) {
        this.data4 = data;
        var g,initVal;
        switch (this.direct){
            case 1:
                g = 30;
                initVal=450;
                break;
            case 2:
                g = 20;
                initVal = 50;
                break;
            case 3:
                g = 30;
                initVal = 500;
                break;
            case 4:
                g = 20;
                initVal = 50;
                break;
        }
        this.hPanel.removeAllChildren(true);
        var zorder = this.data4.length;
        for(var i=0;i<data.length;i++) {
            var innerObject = data[i];
            var innerAction = innerObject.action;
            var paoSeat = innerObject.huxi;
            var vo = MJAI.getMJDef(innerObject.cards[0]);
            if (this.direct != 1 && innerAction == 1) {//自摸
                vo.a = 1;
            } else { //放炮
                //需要显示箭头
                if (innerAction != 1) {
                    var paoSeq = MJRoomModel.getPlayerSeq("", MJRoomModel.mySeat, paoSeat);
                    vo.jt = MJRoomModel.getPaoJianTou(paoSeq);
                }
            }
            vo.huDisplay = 1;
            var card = new YJMahjong(MJAI.getDisplayVo(this.direct,4),vo);
            card.x = initVal+g*i;
            card.y = 0;
            if(this.direct==1){
                card.x = initVal-i*g;
            }else if(this.direct==3){
                card.x = i*g;//initVal-i*g;
            }else{
                card.x = 0;
            }
            if(this.direct==4){
                card.setLocalZOrder(zorder);
                card.y = initVal+i*g;
            }else if(this.direct==2){
                card.setLocalZOrder(zorder);
                card.y = initVal+i*g;
            }else{
                card.y = 0;
            }
            this.hPanel.addChild(card);
            zorder--;
        }
    },

    onShowDesktopSameCards:function(card){
        for (var i = 0; i < this.mahjongs3.length; i++) {
            var cardVo = this.mahjongs3[i]._cardVo;
            if (cardVo.i == card.i) {
                this.mahjongs3[i].displayGreyBg();
            } else {
                this.mahjongs3[i].removeGreyBg();
            }
        }
        for (var i = 0; i < this.mahjongs2.length; i++) {
            var cardVo = this.mahjongs2[i]._cardVo;
            if (cardVo.i == card.i) {
                this.mahjongs2[i].displayGreyBg();
            } else {
                this.mahjongs2[i].removeGreyBg();
            }
        }
    },

    onRemoveLastSameCards:function(){
        for (var i = 0; i < this.mahjongs3.length; i++) {
            this.mahjongs3[i].removeGreyBg();
        }
        for (var i = 0; i < this.mahjongs2.length; i++) {
            this.mahjongs2[i].removeGreyBg();
        }
    }


});