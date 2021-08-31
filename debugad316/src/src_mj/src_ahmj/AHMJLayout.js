/**
 * Created by zhoufan on 2016/7/23.
 */

var AHMJLayout = cc.Class.extend({
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
        this.ahmj_gangID = [];
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
            var card = new AHMahjong(MJAI.getDisplayVo(this.direct,3),data[i]);
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
            this.delFromPlace1(mjVo.c,isCsGang);
        }
        this.showFinger();
    },

    GangChuPai:function(mjVo){
        var hasIndex = MJAI.findIndexByMJVoC(this.data3,mjVo.c);
        if (hasIndex < 0) {
            this.ahmj_gangID.push(mjVo);
            this.data3.push(mjVo);
            this.refreshP3(this.data3); 
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
    delFromPlace1:function(id,isCsGang){
        // cc.log("this.data1 =",JSON.stringify(this.data1));
        var del = -1;
        for(var i=0;i<this.data1.length;i++){
            var c = this.data1[i].c;
            if(c == id){
                del = i;
                break;
            }
        }
        if(del<0&&this.direct!=1)
            del = this.data1.length - 1;//有小胡的情况下可能把显示的小胡牌删掉，这里从后面取
        if(del>=0){
            this.data1.splice(del,1);
            var mahjong = this.mahjongs1.splice(del,1);
            if(mahjong.length>0)
                mahjong[0].pushOut();   

            if(!isCsGang){
                this.data1.sort(MJAI.sortMJ);
            }

            this.refreshP1(this.data1);
        }
    },

    sortByHZ:function(){
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
                        var yitiaoIndex = MJAI.getYiTiaoIndexInArray(cards);
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
                        innerObj.huxi = fromSeat;
                        break;
                    }
                }
            }
        }else{
            //用huxi这个已有字段表示被碰的座位号
            this.data2.push({action:action,cards:voArray,huxi:fromSeat});
        }
        //cc.log("this.data2=",JSON.stringify(this.data2));
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

    showXiaoHu:function(ids){
        if(this.direct != 1){
            var data = this.transData(ids,true);
            for(var i=0;i<data.length;i++){
                this.data1[i] = data[i];
            }
            for(;i<this.data1.length;++i){
                this.data1[i] = {};
            }
            this.refreshP1(this.data1);
        }else{
            for(var i = 0;i<this.data1.length;++i){
                var hasFind = false;
                for(var j = 0;j<ids.length;++j){
                    if(ids[j] == this.data1[i].c){
                        var newData = ObjectUtil.deepCopy(this.data1[i]);
                        newData.xiaohu = true;
                        this.data1[i] = newData;
                        hasFind = true;
                    }
                }
                if(!hasFind && this.data1[i].xiaohu){
                    var newData = ObjectUtil.deepCopy(this.data1[i]);
                    newData.xiaohu = false;
                    this.data1[i] = newData;
                }
            }
            this.refreshP1(this.data1);

            for(var i = 0;i<this.mahjongs1.length;++i){
                if(this.mahjongs1[i]._tingList && this.mahjongs1[i]._tingList.length > 0){
                    this.mahjongs1[i].displayTingArrows(this.mahjongs1[i]._tingList,this.mahjongs1[i]._huCardNum);
                }
            }
        }
    },

    hideXiaoHu:function(){
        if(this.direct != 1){
            for(var i = 0;i<this.data1.length;++i){
                this.data1[i] = {};
            }
            this.refreshP1(this.data1);
        }else{
            for(var i = 0;i<this.data1.length;++i){
                if(this.data1[i].xiaohu){
                    var newData = ObjectUtil.deepCopy(this.data1[i]);
                    newData.xiaohu = false;
                    this.data1[i] = newData;
                }

            }
            this.refreshP1(this.data1);
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
     * 胡牌
     * @param ids
     */
    buHua:function(ids,num){
        // cc.log("ids =",JSON.stringify(ids));
        var voArray = MJAI.getVoArray(ids);
        var last = voArray.pop();
        var num = num || 1;
        for (var i = 0; i < num; i++) {
            this.data4.push({action:0,cards:[last.c],huxi:0});    
        }
        this.refreshP4(this.data4,true);
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
        if(del>=0 ){
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
        data1 = this.transData(data1,true,this.direct == 1?isMoPai:false);
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
        if(this.direct!=1){
            var number = MJAI.MJ_NUMBER-this.calcData2Length();
            if(bankerSeat || isMoPai)//庄家、摸牌时多发一张牌
                number+=1;
            for(var i=this.data1.length;i<number;i++){
                this.data1.push({});
            }
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
    getnewDataForTCPFMJ:function(data){
        var newData = [];
        var tempdata =[];//排序用 
        var zhuanPai_index = -1;
        for(var j=0;j<data.length;j++){
            if (data[j].zhuan == 1 && data[j].m != 1 ){
                newData.push(data[j]);
            }
        }

        if(zhuanPai_index == -1){ //
            tempdata = ArrayUtil.clone(data);
            var _wangVo = MJAI.getMJDef(MJRoomModel.ahmj_wangID)
            var first_wang = _wangVo.n + 1;
            if(_wangVo.t !=4 ){
                if(first_wang == 10)first_wang = 1;
            }else{
                if(first_wang == 5)first_wang = 1;
                if(first_wang == 12)first_wang = 9;
            }
            var vo1 = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
            vo1.n = first_wang;
            vo1.zhuan = 1;
            tempdata.push(vo1)
            tempdata.sort(MJAI.sortMJ);
            for(var j=0;j<tempdata.length;j++){
                if (tempdata[j].zhuan == 1 && tempdata[j].m != 1 ){
                    zhuanPai_index = j;
                }
            }
        }
        for(var j=0;j<data.length;j++){
            if (data[j].i == 201 && data[j].m != 1 && data[j].zhuan != 1 && zhuanPai_index != -1){
                newData.splice(zhuanPai_index,0,data[j]);
            }

            if ( data[j].m == 1 || (data[j].zhuan != 1 && data[j].i != 201) || (data[j].zhuan != 1 && zhuanPai_index == -1)){
                newData.push(data[j]);
            }
        }
        return newData;
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
        }else if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            if(MJRoomModel.ahmj_wangID > 0){
                var cardVo = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
                if(MJRoomModel.intParams[4] == 1){//开单王
                    first_wang = cardVo.n;
                }else{//开双王
                    first_wang = cardVo.n + 1;
                    second_wang = cardVo.n - 1;
                    if(first_wang == 10)first_wang = 1;
                    if(second_wang == 0)second_wang = 9;
                }
            }
        }else if(MJRoomModel.isTCPFMJ()){
            if(MJRoomModel.ahmj_wangID > 0){
                var cardVo = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
                var first_wang = cardVo.n + 1;
                if(cardVo.t !=4 ){
                    if(first_wang == 10)first_wang = 1;
                }else{
                    if(first_wang == 5)first_wang = 1;
                    if(first_wang == 12)first_wang = 9;
                }
            }
        }
        var _wangVo = MJAI.getMJDef(MJRoomModel.ahmj_wangID)
        for(var i=0;i<data.length;i++){
            if (MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ || MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
                if (MJRoomModel.ahmj_wangID && MJRoomModel.ahmj_wangID != -1){
                    if (data[i].t ==  _wangVo.t && (data[i].n == first_wang || data[i].n == second_wang)){
                        if (MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ){
                            data[i].wang = 1;
                        }else{
                            data[i].chunwang = 1;
                        }
                    }else if (MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ && MJRoomModel.intParams[4] == 0 && data[i].t == _wangVo.t && data[i].n == _wangVo.n){
                        data[i].zhengwang = 1;
                    }
                }
            }
            if (MJRoomModel.isTCPFMJ()){
                if (data[i].t == _wangVo.t && (data[i].n == first_wang)){
                    data[i].zhuan = 1;
                }
            }
        }

        var newData = [];
        if(MJRoomModel.isTCPFMJ()){
            newData = this.getnewDataForTCPFMJ(data) || data;
        }else if(MJRoomModel.isTCDPMJ()){
            newData = data;
        }else{
            for(var j=0;j<data.length;j++){
                if ((data[j].i == 201 || data[j].wang == 1 || data[j].chunwang == 1) && data[j].m != 1 ){
                    newData.push(data[j]);
                }
            }
            for(var j=0;j<data.length;j++){
                if ( data[j].m == 1 || (data[j].wang != 1 && data[j].chunwang != 1)){
                    newData.push(data[j]);
                }
            }
        }
        //cc.log("data===",JSON.stringify(data));
        // cc.log("newData===",JSON.stringify(newData));
        //test
        //var style = 1;//1 旧麻将 2 新麻将
        this.data1 = newData;
        // cc.log("this.data1 =",JSON.stringify(this.data1));
        var gapMapping = {1:133,2:41,3:66,4:41};
        if (cc.winSize.width > SyConfig.DESIGN_WIDTH && SdkUtil.isLiuHaiPin()){
            gapMapping[1] = (parseInt(cc.winSize.width) - 14*133)/2 / 14  + 133;
        }
        var g=gapMapping[this.direct];
        var initVal=this.p2Mark;
        var correctCoord = function(direct,card,i,zorder,isMopai){
            // cc.log("newData[i].hasOwnProperty(m) =,i>12 =",newData[i].hasOwnProperty("m"),i);
            if(direct==1){
                card.scale = g/133;
                card.setScaleY(g/133 + 0.05);
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
            var isMopai = (this.data1.length%3 == 2 && i > (this.data1.length - 2))? true : false;//有碰牌时摸牌的处理
            correctCoord(this.direct,card,i,zorder,isMopai);
            zorder--;
            newData[i].feiDisplay = 1;
            
            card.refresh(MJAI.getDisplayVo(this.direct,1),newData[i]);
        }
        for(;i<newData.length;i++){
            newData[i].feiDisplay = 1;
            // if (MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ){
            //     if (MJRoomModel.ahmj_wangID && MJRoomModel.ahmj_wangID != -1){
            //         if (newData[i].t ==  MJAI.getMJDef(MJRoomModel.ahmj_wangID).t && (newData[i].n == first_wang || newData[i].n == second_wang)){
            //             newData[i].wang = 1;
            //         }
            //     }
            // }
            var card = new AHMahjong(MJAI.getDisplayVo(this.direct,1),newData[i]);
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
        var teamData = ObjectUtil.deepCopy(data);
        if((MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ())&& MJRoomModel.intParams[4] == 1){
            for (var i = 0; i < data.length; i++) {
                teamData[i].t = teamData[i].n = teamData[i].i = teamData[i].c = 0;
            }
        }

        this.data2 = data;
        this.data2.sort(MJAI.sortPlaceData2);
        var g,initVal;
        var totalCount = this.calcData2Length();
        var modext = totalCount>=13 ? 0 : data.length-1;
        switch (this.direct) {
            case 1:
                g = 95;
                var w = cc.director.getWinSize().width;
                initVal = 15 - (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2;
                if (totalCount >= 14)
                    initVal = (w - (totalCount * g) - (data.length - 1) * 10) / 2;
                if(MJRoomModel.wanfa == GameTypeEunmMJ.TJMJ && MJRoomModel.tjmjXJ_isShow){
                    initVal = 250;
                }
                break;
            case 2:
                g = 48;
                initVal = -40 ;
                break;
            case 3:
                g = 60;
                initVal = 550;
                break;
            case 4:
                g = 48;
                initVal = 440;//-(MJAI.MJ_NUMBER-totalCount-1)*7+modext*15;
                break;
        }
        var zorder = totalCount;
        var count = 0;
        var nowCards = this.mahjongs2.length;
        for(var i=0;i<teamData.length;i++) {
            var innerObject = teamData[i];
            var innerAction = innerObject.action;
            // cc.log("innerAction =",innerAction);
            var innerArray = innerObject.cards;
            // cc.log("innerArray =",JSON.stringify(innerArray));
            if (GameTypeEunmMJ.CXMJ == MJRoomModel.wanfa && innerAction == MJAction.PENG && this.direct == 1){
                MJRoomModel.cxmj_pengMJ.push(innerArray[0]);
            }
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG||innerAction==MJAction.GANG) && (innerArray.length>3 || innerObject.gangVo)){
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
                    card = new AHMahjong(MJAI.getDisplayVo(this.direct,2),innerVo);
                    this.mPanel.addChild(card);
                }
                if(MJRoomModel.isTCDPMJ()){
                    if((innerAction == MJAction.PENG || innerAction == MJAction.GANG) && innerObject.huxi > 0 && j==1){
                        card.showPengDir(innerObject.huxi);
                    }else{
                        card.removePengDir();
                    }
                }else{
                    if(innerAction == MJAction.PENG && innerObject.huxi > 0 && j==1){
                        card.showPengDir(innerObject.huxi);
                    }
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
                        var gang = new AHMahjong(MJAI.getDisplayVo(this.direct,2),gangVo);
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

    refreshP3:function(data){
        // if(MJRoomModel.isTCDPMJ() || MJRoomModel.isTCPFMJ()){
        //     this.diplayP3ForTCGame(data);
        // }else{
            this.diplayP3Normal(data);
        // }

    },
    diplayP3ForTCGame:function(data){
        var teamData = ObjectUtil.deepCopy(data);
        if((MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ())&& MJRoomModel.intParams[4] == 1){
            for (var i = 0; i < data.length; i++) {
                teamData[i].t = teamData[i].n = teamData[i].i = teamData[i].c = 0;
            }
        }
        this.data3 = data;
        var g,initVal;
        switch (this.direct){
            case 1:
                g = 75;
                initVal = 34;
                if(MJRoomModel.renshu ==3){
                    initVal = -40;
                }
                break;
            case 2:
                g = 59;
                initVal = MJRoomModel.renshu ==3?130:g;
                break;
            case 3:
                g = 75;
                initVal = this.oPanel.width-g-34;
                break;
            case 4:
                g = 59;
                initVal = this.oPanel.height-g;
                if(MJRoomModel.renshu ==3){
                    initVal += 80;
                }
                break;
        }
        var zorder = this.data3.length;
        var clearHuImg = false;
        if (this.ahmj_gangID.length ==  3 &&  this.data3[this.data3.length-1].c != this.ahmj_gangID[2].c){
            clearHuImg = true;
            this.ahmj_gangID = [];
        }
        for(var i=0;i<this.mahjongs3.length;i++){
            if (clearHuImg)
                this.mahjongs3[i].removeHuImg();
            this.mahjongs3[i].refresh(MJAI.getDisplayVo(this.direct,3),teamData[i]);
            if(this.direct==2)
                this.mahjongs3[i].setLocalZOrder(zorder);
            zorder--;
        }
        var rowCount = 8;
        if (MJRoomModel.renshu == 2){
            rowCount = 20;
        }else if(MJRoomModel.renshu == 3 && this.direct==1){
            rowCount = 12;
        }
        // cc.log("data =",JSON.stringify(data));
        for(;i<teamData.length;i++){
            var card = new AHMahjong(MJAI.getDisplayVo(this.direct,3),teamData[i]);
            // card.removeHuImg();
            for (var ii = 0;ii < 3;ii++) {
                if (teamData[i] == this.ahmj_gangID[ii]){
                    card.displayHu();
                }
            }
            this.mahjongs3.push(card);
            if(this.direct==1){
                card.x = initVal+(i%rowCount)*g;
            }else if(this.direct==3){
                card.x = initVal-(i%rowCount)*g;
            }else{
                card.x = 0;
                var localNumber = Math.floor(i / rowCount);
                if(this.direct==2)
                    card.x = -28 + localNumber * 100;
                if(this.direct==4)
                    card.x = 58 - localNumber * 100;
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
                    card.y = 50 - localNumber * 85;
                if(this.direct==3){
                    card.y = localNumber * 85;
                    card.setLocalZOrder(5 - localNumber);
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
    /**
     * refresh place3
     * @param data {Array.<MJVo>}
     */
    diplayP3Normal:function(data){
        this.data3 = data;
        var g,initVal;
        switch (this.direct){
            case 1:
                g = 75;
                initVal = 34;
                break;
            case 2:
                g = 59;
                initVal = g;
                break;
            case 3:
                g = 75;
                initVal = this.oPanel.width-g-34;
                break;
            case 4:
                g = 59;
                initVal = this.oPanel.height-g;
                break;
        }
        var zorder = this.data3.length;
        var clearHuImg = false;
        if (this.ahmj_gangID.length ==  3 &&  this.data3[this.data3.length-1].c != this.ahmj_gangID[2].c){
            clearHuImg = true;
            this.ahmj_gangID = [];
        }
        for(var i=0;i<this.mahjongs3.length;i++){
            if (clearHuImg)
                this.mahjongs3[i].removeHuImg();
            this.mahjongs3[i].refresh(MJAI.getDisplayVo(this.direct,3),data[i]);
            if(this.direct==2)
                this.mahjongs3[i].setLocalZOrder(zorder);
            zorder--;
        }
        var rowCount = 8;
        if (MJRoomModel.renshu == 2){
            rowCount = 20;
        }else if(MJRoomModel.renshu == 3 && this.direct==1){
            rowCount = 12;
        }
        // cc.log("data =",JSON.stringify(data));
        for(;i<data.length;i++){
            var card = new AHMahjong(MJAI.getDisplayVo(this.direct,3),data[i]);
            // card.removeHuImg();
            for (var ii = 0;ii < 3;ii++) {
                if (data[i] == this.ahmj_gangID[ii]){
                    card.displayHu();
                }
            }
            this.mahjongs3.push(card);
            if(this.direct==1){
                card.x = initVal+(i%rowCount)*g;
            }else if(this.direct==3){
                card.x = initVal-(i%rowCount)*g;
            }else{
                card.x = 0;
                var localNumber = Math.floor(i / rowCount);
                if(this.direct==2)
                    card.x = -28 + localNumber * 100;
                if(this.direct==4)
                    card.x = 58 - localNumber * 100;
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
                    card.y = 50 - localNumber * 85;
                if(this.direct==3){
                    card.y = localNumber * 85;
                    card.setLocalZOrder(5 - localNumber);
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

    refreshP4: function(data,isBuhua) {
        this.data4 = data;
        var g,initVal;
        var dis = isBuhua?500:0;
        switch (this.direct){
            case 1:
                g = 48;
                initVal=450+ dis;
                break;
            case 2:
                g = 32;
                initVal = 50;
                break;
            case 3:
                g = 48;
                initVal = 500;
                break;
            case 4:
                g = 32;
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
            var card = new AHMahjong(MJAI.getDisplayVo(this.direct,4),vo);
            card.x = initVal+g*i;
            card.y = 0;
            if(this.direct==1){
                card.x = initVal-i*g;
            }else if(this.direct==3){
                card.x = i*g;//initVal-i*g;
            }else{
                card.x = 0;
                if(isBuhua){
                    if(this.direct == 2){
                        card.x = 60;
                    }else if(this.direct == 4){
                        card.x = -60;
                    }
                }
            }
            if(this.direct==4){
                card.setLocalZOrder(zorder);
                card.y = initVal+i*g;
            }else if(this.direct==2){
                card.setLocalZOrder(zorder);
                card.y = initVal+i*g;
            }else{
                card.y = 0;
                if(isBuhua && this.direct == 1){
                    card.y = 100;
                }
                if(this.direct == 3){
                    card.y = -100;
                }
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