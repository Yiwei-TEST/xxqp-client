//
var MajiangSmartFilter = cc.Class.extend({

    ctor:function(){
    },

    checkTing:function(handCards,huBean){
        var length = handCards.length;
        var curCount = 0;
        var tingResult = [];
        var hasChecked = [];
        while(curCount<length){
            var copy = ArrayUtil.clone(handCards);
            var pushOut = copy.splice(curCount,1);
            var pushOutVo = pushOut[0];
            var checkedIndex = MJAI.findIndexByMJVoI(hasChecked,pushOutVo.i);
            if(checkedIndex < 0) {
                hasChecked.push(pushOutVo);
                var result = this.isHu(copy, huBean);
                if (result /*&& result.length > 0*/) {
                    tingResult.push({/*ting: result, */pushOut: pushOutVo});
                }
            }
            curCount++;
        }
        return tingResult;
    },

    remove: function(list,mjVo){
        for(var i=0;i<list.length;i++){
            if(mjVo.c == list[i].c){
                list.splice(i,1);
                i--;
                break;
            }
        }
    },

    removeAll: function(list,removeList) {
        for (var i=0;i<removeList.length;i++) {
            this.remove(list,removeList[i]);
        }
    },

    hasSameId: function(vo, handCards) {
        var isHas = false;
        var length = handCards.length;
        for (var key=0;key<length;key++) {
            if(handCards[key].c == vo.c) {
                isHas = true;
                break;
            }
        }
        return isHas;
    },

    simpleJudgeHu: function(handCards, mjVo) {
        var hu = false;
        if (MJRoomModel.isFuPaiVo(mjVo) || MJRoomModel.isFeiPaiVo(mjVo)) {
            return true;
        }
        for (var i=0;i<handCards.length;i++) {
            var handVo = handCards[i];
            if(handVo.t==mjVo.t && handVo.n==mjVo.n) {
                hu = true;
                break;
            }
        }
        if (!hu) {
            if(mjVo.t!=4) {
                var shun = this.getChi(handCards, mjVo);
                if (shun) {
                    hu = true;
                }
            }
        }
        return hu;
    },

    getChi:function(MJOnHands,lastMJ){
        var t = lastMJ.t;
        var n = lastMJ.n;
        var l = MJOnHands.length;
        var start = n-2;start=start<1?1:start;
        var end = n+2;end=end>9?9:end;
        var array = [];
        for(var i=start;i<=n;i++){
            var temp =i+2;
            if(temp>end){
                break;
            }else{
                var sArray = [];
                for(var s=i;s<=temp;s++){
                    sArray.push(s);
                }
                var tempVal = ArrayUtil.indexOf(sArray,n);
                if(tempVal==0){
                    tempVal = sArray[0];
                    sArray[0] = sArray[1];
                    sArray[1] = tempVal;
                }else if(tempVal==2){
                    tempVal = sArray[1];
                    sArray[1] = sArray[2];
                    sArray[2] = tempVal;
                }
                array.push(sArray);
            }
        }
        if(array.length>0){
            arrayloop:for(var i=0;i<array.length;i++){
                    var temp = array[i];
                    var voArray = [];
                    tempLoop:for(var j=0;j<temp.length;j++){
                        var tv = parseInt(temp[j]);
                        if(tv==n){
                            voArray.push(MJAI.copyMJDef(lastMJ));
                        }else{
                            mjLoop:for(var m=0;m<l;m++){
                                var vo = MJOnHands[m];
                                if(vo.t==t&&vo.n==tv){
                                    voArray.push(MJAI.copyMJDef(vo));
                                    break mjLoop;
                                }
                            }
                        }
                    }
                    if(voArray.length==3)
                        return true;
                }
        }
        return false;
    },

    findHuCards:function(handCards, huBean,curIndex){
        if(!handCards){
            return false;
        }
        var hzMjAI = [];
        var filter = [];
        for (var i = 0; i < MJAI.MJ.length; i++) {
            var vo = MJAI.MJ[i];
            if (ArrayUtil.indexOf(filter, vo.i) < 0 && vo.c != 0) {
                var mjDef = MJAI.MJ[i];
                var sameCount = 1;
                while (sameCount < 4 && this.hasSameId(mjDef, handCards)) {
                    var nextC = mjDef.t == 4 ? 1 : 27;
                    var tempDef = MJAI.getMJDef(mjDef.c + nextC);
                    if (tempDef != null) {
                        mjDef = tempDef;
                    }
                    sameCount++;
                }
                if (this.simpleJudgeHu(handCards, mjDef)) {
                    hzMjAI.push(mjDef);
                }
                filter.push(vo.i);
            }
        }
        //var length = curIndex>=0? curIndex + MJAI.LANZHOU_CHECK_NUMS : hzMjAI.length;
        //length = length>hzMjAI.length ? hzMjAI.length : length;
        //var curIndex = curIndex || 0;
        var tingCards = [];
        hzMJAILoop:for(var i=0;i<hzMjAI.length;i++){
            var cards = [];
            if(handCards.length>0){
                cards = ArrayUtil.clone(handCards);
            }
            cards.push(hzMjAI[i]);
            huBean.setHuVal(hzMjAI[i].i);
            if(this.judgeHu(cards,huBean)){
                var isHas = false;
                TingcardsLoop:for(var j=0;j<tingCards.length;j++){
                    if(hzMjAI[i].i == tingCards[j].i){
                        isHas = true;
                        break TingcardsLoop;
                    }
                }
                if(!isHas){
                    tingCards.push(hzMjAI[i]);
                }
            }
        }
        return tingCards;
    },

    isHu:function(handCards, huBean){
        var cards = ArrayUtil.clone(handCards);
        cards.push(MJAI.SIGOYI_CARD);
        return this.judgeHu(cards,huBean);
    },

    getVal:function(copy,val) {
        var hongzhong = [];
        for(var i=0;i<copy.length;i++){
            var majiang = copy[i];
            if(majiang.i == val){
                hongzhong.push(majiang);
            }
        }
        return hongzhong;
    },

    //7小对
    check7duizi: function (majiangIds, card_index, apMajiangNum) {
        if (MJRoomModel.intParams[1] == GameTypeEunmMJ.ZZMJ && MJRoomModel.intParams[4] != 1){
            return false;
        }
        if (majiangIds.length == 14) {
            // 7小对
            var duizi = card_index.getDuiziNum();
            if (duizi == 7) {
                return true;
            }

        } else if (majiangIds.length + apMajiangNum == 14) {
            if (apMajiangNum == 0) {
                return false;
            }
            var index0 = card_index.getMajiangIndex(0);
            var index2 = card_index.getMajiangIndex(2);
            var lackNum = index0 != null ? index0.getLength() : 0;
            lackNum += index2 != null ? index2.getLength() : 0;

            if (lackNum <= apMajiangNum) {
                return true;
            }

            if (lackNum == 0) {
                lackNum = 14 - majiangIds.length;
                if (lackNum == apMajiangNum) {
                    return true;
                }
            }

        }
        return false;
    },


    /**
     *
     * 具体胡牌
     *
     * @param hu
     * @param majiangIds
     */
    judgeHu:function(handCards,huBean){
        if(!handCards || handCards.length == 0){
            return false;
        }
        var copy = ArrayUtil.clone(handCards);
        if(handCards.length % 3 != 2){
            return false;
        }
        var apList = this.dropApMajiang(copy);
        var card_index = new MajiangIndexArr();
        this.getMax(card_index,copy);
        var isHu = this.chaijiang(huBean, card_index, copy, apList.length, huBean.getHuVal());
        if (isHu != null) {
            huBean.setHu(true);
			return true;
        } else {
            var copy1 = ArrayUtil.clone(handCards);
            if (copy1.length % 3 != 2) {
                copy1.push(MJAI.SIGOYI_CARD);
            }
            var apList1 = this.dropApMajiang(copy1);
            //检测7对
            if (this.check7duizi(copy1, card_index, apList1.length)) {
                //7对也需要检测硬将
                if (huBean.isYingJiangLei()) {
                    var jiangMap = card_index.getJiang(huBean);
                    if (ObjectUtil.size(jiangMap) > 0) {
                        if (ObjectUtil.size(jiangMap) == 1) {
                            var isDanDiao = false;
                            for (var jiangList in jiangMap) {
                                if (ObjectUtil.size(jiangMap) == 2 && huBean.getHuVal() != null && jiangList[0].getVal() == huBean.getHuVal().i) {
                                    isDanDiao = true;
                                    break;
                                }
                            }
                            if (isDanDiao) {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                }
                huBean.setHu(true);
                return true;
            }
        }
        return false;
    },

    dropApMajiang: function (copy) {
        var apMajiangs = [];
        var indexs = [];
        for (var i = 0; i < copy.length; i++) {
            if (copy[i].i == 1000) {
                indexs.push(i);
                apMajiangs.push(copy[i]);
            }
        }
        ArrayUtil.sortNumerically(indexs);
        for (var i = indexs.length - 1; i >= 0; i--) {
            copy.splice(indexs[i],1);
        }
        return apMajiangs;
    },

    // 得到最大相同数
    getMax:function(card_index,list){
        var majiangMap = {};
        for(var i=0;i<list.length;i++){
            var majiang = list[i];
            var count = null;
            if(majiangMap[majiang.i]){
                count = majiangMap[majiang.i];
            }else{
                count = [];
                majiangMap[majiang.i] = count;
            }
            count.push(majiang);
        }
        for (var majiangVal in majiangMap) {
            var majiangList = majiangMap[majiangVal];
            switch (majiangList.length) {
                case 1:
                    card_index.addMajiangIndex(0, majiangList, majiangVal);
                    break;
                case 2:
                    card_index.addMajiangIndex(1, majiangList, majiangVal);
                    break;
                case 3:
                    card_index.addMajiangIndex(2, majiangList, majiangVal);
                    break;
                case 4:
                    card_index.addMajiangIndex(3, majiangList, majiangVal);
                    break;
                case 5:
                    card_index.addMajiangIndex(4, majiangList, majiangVal);
                    break;
            }
        }
    },


    /**
     * 尝试补飞牌
     * @param needAddCount 需要补的飞牌数量
     * @param huBean 胡牌对象
     * @param copy 拆顺前的手牌
     * @param feiList 所有飞牌
     * @param hasPais 无复制的手牌
     * @return
     */
    tryBuFei: function (needAddCount, huBean, copy, fuList, feiList, hasPais, shunXu) {
        var copyClone = ArrayUtil.clone(copy);
        var feiListClone = ArrayUtil.clone(feiList);
        var fuListClone = [];
        var isNeedBuFu = this.isNeedBuFu(huBean.getFuPaiType());
        if (isNeedBuFu) {
            fuListClone = ArrayUtil.clone(fuList);
        }
        var isShunOk = false;
        if ((feiListClone.length + fuListClone.length + huBean.getApMajiangCount()) >= needAddCount) {
            var hasBuFei1 = false;
            //可以补副牌的情况，尝试把所有副牌和飞牌都补一次
            if (isNeedBuFu) {
                needAddCount = feiListClone.length + fuListClone.length;
            }
            if(huBean.getApMajiangCount() > 0) {
                needAddCount += huBean.getApMajiangCount();
            }
            var count = 0;
            while (count < needAddCount) {
                count++;
                //尝试补顺
                this.chaishunLack(huBean, copyClone, shunXu);// 默认按顺序拆顺
                //都拆完了，break
                if (isNeedBuFu && copyClone.length == 0) {
                    break;
                }
                var lackList = huBean.getLackList();
                var feiRemoveIndex = -1;
                var hasBuFei = false;
                for (var i = 0; i < lackList.length; i++) {
                    if (feiRemoveIndex < 0) {
                        feiRemoveIndex = MJAI.findIndexByMJVoI(feiListClone, lackList[i]);
                        if (feiRemoveIndex >= 0 && huBean.isFei1(lackList[i])) {
                            hasBuFei1 = true;
                        }
                    }
                }
                if (feiRemoveIndex >= 0) {
                    hasBuFei = true;
                    var removeFei = feiListClone.splice(feiRemoveIndex,1)[0];
                    copyClone.push(removeFei);
                } else {
                    if (lackList.length == 1 && huBean.isFei1(lackList[0])) {
                        hasBuFei1 = true;
                    }
                }
                var hasBuFu = false;
                //尝试补副牌，条件是飞牌没补上，或者缺少的牌有2张或者2张以上时
                if (isNeedBuFu && (feiRemoveIndex < 0 || lackList.length > 2)) {
                    var fuRemoveIndex = -1;
                    for (var i = 0; i < lackList.length; i++) {
                        if (fuRemoveIndex < 0) {
                            fuRemoveIndex = MJAI.findIndexByMJVoI(fuListClone, lackList[i]);
                        }
                    }
                    if (fuRemoveIndex >= 0) {
                        hasBuFu = true;
                        var removeFu = fuListClone.splice(fuRemoveIndex,1)[0];
                        copyClone.push(removeFu);
                    }
                }
                //cc.log("==========="+huBean.getApMajiangCount()+"    "+JSON.stringify(huBean.getHasMajiangs()))
                if((!hasBuFei && !hasBuFu)  && huBean.getHasMajiangs() != null && huBean.getHasMajiangs().length == 2 && huBean.getApMajiangCount() > 0) {// 如果当前补顺缺一张  则补万能牌
                    this.removeAll(copyClone,huBean.getHasMajiangs());
                    huBean.setHasMajiangs(null);
                    huBean.changeApMajiangCount(-1);
                }
            }
            isShunOk = this.chaipai(huBean, copyClone);
            if (isShunOk) {
                //将最终的飞牌list和手牌list重新赋值
                feiList.length = 0;
                ArrayUtil.merge(feiListClone, feiList);
                hasPais.length = 0;
                ArrayUtil.merge(copyClone, hasPais);
                if (isNeedBuFu) {
                    fuList.length = 0;
                    ArrayUtil.merge(fuListClone, fuList);
                }
            } else {
                //补一万一筒一条胡不了，尝试补九万九筒九条
                if (huBean.getFuPaiType() == MJFuPaiType.FENG_SAN_JIU
                    && hasBuFei1 && huBean.isHasBuFei1() && !huBean.isNeedBuFei9()) {
                    huBean.setNeedBuFei9(true);
                    return this.tryBuFei(needAddCount, huBean, copy, fuList, feiList, hasPais, true);
                }
            }
        }
        return isShunOk;
    },



    /**
     * 可以补副牌的嘴子种类
     * @param fuType
     * @return
     */
    isNeedBuFu: function (fuType) {
        return (fuType == MJFuPaiType.SAN_JIU_ZFBJ || fuType == MJFuPaiType.HZD_3938 || fuType == MJFuPaiType.BBD_3231);
    },

    /**
     * 是否拆倒顺
     * 对于飞牌或者副牌为幺的情况  拆倒顺
     * 对于飞牌或者副牌为九的情况  拆顺顺
     * @param fuType
     * @return
     */
    isNeedChaiShunXu: function (fuType) {
        return (fuType == MJFuPaiType.HZD_3938 || fuType == MJFuPaiType.FENG_SAN_JIU_ZFB || fuType == MJFuPaiType.FENG_SAN_JIU/* || fuType == MJFuPaiType.FENG_SAN_YAOJIU*/);
    },

    // 拆将
    chaijiang: function (originHuBean, card_index, hasPais, hzCount, huMajiangVal) {
        var jiangMap = card_index.getJiang(originHuBean);
        var huList = [];
        for (var valEntry in jiangMap) {
            var copy = ArrayUtil.clone(hasPais);
            var huBean = new MajiangHuBean();
            huBean.setHuVal(originHuBean.getHuVal());
            huBean.setApMajiangCount(hzCount);
            huBean.setFuPaiType(originHuBean.getFuPaiType());
            huBean.setJiangLei(originHuBean.getJiangLei());
            huBean.setJiangModDefList(originHuBean.getJiangModDefList());
            var list = jiangMap[valEntry];
            var i = 0;
            var isContinue = false;
            for (var majiang in list) {
                i++;
                this.remove(copy, list[majiang]);
                if (i >= 2) {
                    huBean.setJiangVal(list[majiang].i);
                    //单调一张将
                    if (list.length == 2 && huBean.getHuVal() != null && huBean.getJiangVal() == huBean.getHuVal()) {
                        //如果是硬将玩法，不能单调将
                        if (huBean.isYingJiangLei()) {
                            isContinue = true;
                        }
                    }
                    break;
                }
            }
            if (isContinue) {
                continue;
            }
            //首先将副牌和飞牌筛选出来
            var fuList = [];
            var feiList = [];
            var copyLength = copy.length;
            for (var mk = 0; mk < copyLength; mk++) {
                var mjVo = copy[mk];
                if (MJRoomModel.isFuPaiVo(mjVo)) {
                    fuList.push(mjVo);
                }
                if (MJRoomModel.isFeiPaiVo(mjVo)) {
                    feiList.push(mjVo);
                }
            }
            //cc.log("fuList::"+JSON.stringify(fuList))
            //cc.log("feiList::"+JSON.stringify(feiList));
            //把副牌和飞牌拿出去
            this.removeAll(copy, fuList);
            this.removeAll(copy, feiList);
            //将飞牌按伴章的多少来排序
//			Collections.sort(feiList,new FeiPaiPriorityCompare(copy));
            //clone一份手牌出来备用
            var copyClone = ArrayUtil.clone(copy);
            var apMajiangCount = huBean.getApMajiangCount();
            huBean.setApMajiangCount(0);// 第一次拆顺剔除万能牌和飞牌 副牌
            //cc.log("手牌2222===="+MJAI.voArrayToString(copy))
            //开始拆顺
            var isShunOk = this.chaipai(huBean, copy);
            //cc.log("isShunOk:::::::::"+isShunOk)
            if(hzCount > 0) {
                huBean.setApMajiangCount(hzCount);
            }
            var needAddCount = 0;
            if (!isShunOk) {
                huBean.setHasBuFei1(false);
                var shunMod = (copy.length + huBean.getApMajiangCount())% 3;
                //发现拆不完
                //1.本身就胡不了，
                //2.需要补3-shunMod张飞牌进去，那么尝试补3-shunMod张飞牌
                needAddCount = 3 - shunMod;
                if (needAddCount > 0) {
                    var huBeanCopy = new MajiangHuBean();
                    huBeanCopy.setHuVal(huBean.getHuVal());
                    huBeanCopy.setFuPaiType(huBean.getFuPaiType());
                    huBeanCopy.setJiangLei(huBean.getJiangLei());
                    huBeanCopy.setApMajiangCount(huBean.getApMajiangCount());
                    huBeanCopy.setJiangModDefList(huBean.getJiangModDefList());
                    isShunOk = this.tryBuFei(needAddCount, huBean, copyClone, fuList, feiList, copy, this.isNeedChaiShunXu(huBean.getFuPaiType()));
                    if (!isShunOk && this.isNeedChaiShunXu(huBean.getFuPaiType())) {
                        isShunOk = this.tryBuFei(needAddCount, huBeanCopy, copyClone, fuList, feiList, copy, false);//如果是拆顺顺  没成功  则再拆倒顺一次
                        if(isShunOk)
                            huBean.setApMajiangCount(huBeanCopy.getApMajiangCount());
                    }else if (!isShunOk && (huBean.getFuPaiType() == MJFuPaiType.BBD_3231 || huBean.getFuPaiType() == MJFuPaiType.FENG_SAN_YAOJIU)) {
                        isShunOk = this.tryBuFei(needAddCount, huBeanCopy, copyClone, fuList, feiList, copy, true);//如果是拆顺顺  没成功  则再拆倒顺一次
                        if(isShunOk)
                            huBean.setApMajiangCount(huBeanCopy.getApMajiangCount());
                    }
                }
                if (apMajiangCount > 0 && !isShunOk) {
                    huBean.setApMajiangCount(apMajiangCount);
                    isShunOk = this.chaipai(huBean, copy);
                }
            }
            //开始拆副
            var isFuOk = false;
            if (isShunOk) {
                ArrayUtil.merge(fuList, copy);
                ArrayUtil.merge(feiList, copy);
                isFuOk = this.chaiFu(fuList, feiList, huBean, copy);
            }
            if (isShunOk && isFuOk) {
                huBean.setHu(true);
                huList.push(huBean);
            }
        }

        // 可以有多种胡法
        if (huList.length > 0) {
            return huList[0];
        }
        if (hzCount > 0) {// 加入癞子牌后 赖子牌凑将(只有报听时判断)
            if(originHuBean.isYingJiangLei()) // 硬将类不能胡
                return null;
            else {
                return this.huAp(originHuBean, hasPais, hzCount, huMajiangVal);
            }
        }

        return null;
    },

    huAp:function(originHuBean,hasPais,hzCount,huMajiangVal) {
        var huList = this.huApList(originHuBean, hasPais, hzCount, huMajiangVal);
        if (huList.length > 0) {
            if (huList.length == 1) {
                // 只能胡一张牌当将
                var huBean = huList[0];
                return huBean;
            }
            return huList[0];
        }
        return null;
    },

    huApList:function(originHuBean,hasPais, hzCount,huMajiangVal) {
        var huList = [];
        if (hzCount > 0) {
            var tryMajiangList = [];
            for (var i = 0; i < hasPais.length; i++) {
                var majiang = hasPais[i];
                if (ArrayUtil.indexOf(tryMajiangList, majiang.i) >= 0) {
                    continue;
                }
                var huBean = new MajiangHuBean();
                huBean.setHuVal(huMajiangVal);
                var copy = ArrayUtil.clone(hasPais);
                huBean.setApMajiangCount(hzCount);
                huBean.setFuPaiType(originHuBean.getFuPaiType());
                huBean.setJiangModDefList(originHuBean.getJiangModDefList());
                tryMajiangList.push(majiang.i);

                var isJiang = true;
                if (isJiang) {
                    huBean.changeApMajiangCount(-1);
                    this.remove(copy, majiang);
                }
                //首先将副牌和飞牌筛选出来
                var fuList = [];
                var feiList = [];
                var copyLength = copy.length;
                for (var mk = 0; mk < copyLength; mk++) {
                    var mjVo = copy[mk];
                    if (MJRoomModel.isFuPaiVo(mjVo)) {
                        fuList.push(mjVo);
                    }
                    if (MJRoomModel.isFeiPaiVo(mjVo)) {
                        feiList.push(mjVo);
                    }
                }
                //把副牌和飞牌拿出去
                this.removeAll(copy, fuList);
                this.removeAll(copy, feiList);
                //clone一份手牌出来备用
                var copyClone = ArrayUtil.clone(copy);
                var isShunOk = this.chaipai(huBean, copy);
                var needAddCount = 0;
                if (!isShunOk) {
                    huBean.setHasBuFei1(false);
                    var shunMod = copy.length % 3;
                    //发现拆不完
                    //1.本身就胡不了，
                    //2.需要补3-shunMod张飞牌进去，那么尝试补3-shunMod张飞牌
                    needAddCount = 3 - shunMod;
                    if (needAddCount > 0) {
                        isShunOk = this.tryBuFei(needAddCount, huBean, copyClone, fuList, feiList, copy, this.isNeedChaiShunXu(huBean.getFuPaiType()));
                    }
                }
                //开始拆副
                var isFuOk = false;
                if (isShunOk) {
                    ArrayUtil.merge(fuList, copy);
                    ArrayUtil.merge(feiList, copy);
                    isFuOk = this.chaiFu(fuList, feiList, huBean, copy);
                }
                if (isShunOk && isFuOk) {
                    huBean.setHu(true);
                    huList.push(huBean);
                }
            }
        }
        return huList;

    },

    // 拆牌
    chaipai: function (huBean, hasPais) {
        if (hasPais.length == 0) {
            return true;
        }
        var hu = this.chaishun(huBean, hasPais);
        if (hu)
            return true;
        return false;
    },

    sortMin: function (hasPais) {
        var compare = function (o1, o2) {
            if (o1.i < o2.i) {
                return -1;
            }
            if (o1.i > o2.i) {
                return 1;
            }
            return 0;
        };
        hasPais.sort(compare);
    },

    sortMax: function (hasPais) {
        var compare = function (o1, o2) {
            if (o1.i < o2.i) {
                return 1;
            }
            if (o1.i > o2.i) {
                return -1;
            }
            return 0;
        };
        hasPais.sort(compare);
    },

    /**
     * 副牌优先级排序
     * @author zhoufan
     *
     */
//private static class FuPaiPriorityCompare implements Comparator<List<Integer>> {
//
//    private List<Majiang> fuList;
//
//public FuPaiPriorityCompare(List<Majiang> fuList) {
//    this.fuList = fuList;
//}
//
//private int findFuCount(List<Integer> def) {
//    List<Integer> existList = new ArrayList<>();
//    for (Majiang mj : fuList) {
//        if (def.contains(mj.getVal()) && !existList.contains(mj.getVal())) {
//            existList.add(mj.getVal());
//        }
//    }
//    return existList.size();
//}

    /**
     * 找出相同多的副牌
     * @param def
     * @return
     */
//findSameFuCount(def) {
//    var countMap = new HashMap<>();
//    for (Majiang mj : fuList) {
//        if (!countMap.containsKey(mj.getVal())) {
//            countMap.put(mj.getVal(), new ArrayList<Majiang>());
//        }
//        countMap.get(mj.getVal()).add(mj);
//    }
//
//    List<Map.Entry<Integer, List<Majiang>>> entryList = new ArrayList<Map.Entry<Integer, List<Majiang>>>(countMap.entrySet());
//    Collections.sort(entryList,
//        new Comparator<Map.Entry<Integer, List<Majiang>>>() {
//        public int compare(Map.Entry<Integer, List<Majiang>> entry1,
//            Map.Entry<Integer, List<Majiang>> entry2) {
//            return entry2.getValue().size()-entry1.getValue().size();
//        }
//    });
//    int index = 0;
//    for (Map.Entry<Integer, List<Majiang>> entry : entryList) {
//        Majiang mj = entry.getValue().get(0);
//        if (def.contains(mj.getVal())) {
//            index = entry.getValue().size();
//            break;
//        }
//    }
//    return index;
//}

//@Override
//public int compare(List<Integer> def1, List<Integer> def2) {
//    int sameCount1 = findSameFuCount(def1);
//    int sameCount2 = findSameFuCount(def2);
//    if (sameCount1 == sameCount2) {
//        int count1 = findFuCount(def1);
//        int count2 = findFuCount(def2);
//        return count2-count1;
//    }
//    return sameCount2-sameCount1;
//}
//}

//private static class FeiPaiPriorityCompare implements Comparator<Majiang> {
//
//    private List<Majiang> hasPais;
//
//public FeiPaiPriorityCompare(List<Majiang> hasPais) {
//    this.hasPais = hasPais;
//}
//
//private int getShun(Majiang mj1) {
//    int pai1 = mj1.getVal();
//    int shunCount = 0;
//    if(pai1 < 200) {
//        int exact = new Double(Math.floor(pai1/10)).intValue() * 10;
//        int mod = pai1 % 10;
//        int start = mod - 2;
//        start = start < 1 ? 1 : start;
//        int end = mod + 2;
//        end = end > 9 ? 9 : end;
//        List<List<Integer>> allEnableArray = new ArrayList<>();
//        for (int i=start;i<=mod;i++) {
//            int temp = i + 2;
//            if (temp > end) {
//                break;
//            } else {
//                List<Integer> sArray = new ArrayList<>();
//                for(int s=i;s<=temp;s++){
//                    int mjVal = s+exact;
//                    if(mjVal != pai1) {
//                        sArray.add(mjVal);
//                    }
//                }
//                allEnableArray.add(sArray);
//            }
//        }
//        //List<Majiang> num1 = QipaiTool.getVal(hasPais, pai1);
//        for (List<Integer> shun : allEnableArray) {
//            List<Majiang> num2 = QipaiTool.getVal(hasPais, shun.get(0));
//            List<Majiang> num3 = QipaiTool.getVal(hasPais, shun.get(1));
//            if(!num2.isEmpty() && !num3.isEmpty()) {
//                shunCount += 1;
//            }
//        }
//    }
//    return shunCount;
//}
//
//public int compare(Majiang mj1, Majiang mj2) {
//    int count1 = getShun(mj1);
//    int count2 = getShun(mj2);
//    return count2-count1;
//}
//}

    /**
     * 移除副牌坎子
     * @param list
     * @param fuList
     * @param feiList
     * @param hasPais
     */
    chaiFuKanRemove: function (list, fuList, feiList, hasPais) {
        var listCopy = ArrayUtil.clone(list);
        var removeList = list.splice(0, 3);
        var copy = ArrayUtil.clone(fuList);
        this.removeAll(copy, listCopy);
        if (copy.length + feiList.length < removeList.length * 2) {
            this.removeAll(fuList, removeList);
            this.removeAll(hasPais, removeList);
        }
    },

    /**
     * 有3张一样的副牌，如果和其他的飞牌副牌不够组合成 合适的一组副牌，那么直接当坎子拆掉
     * @param fuList
     * @param feiList
     * @param huBean
     * @param hasPais
     */
    chaiFuKan: function (fuList, feiList, huBean, hasPais) {
        var countMap = {};
        for (var i = 0; i < fuList.length; i++) {
            var mj = fuList[i];
            if (!countMap[mj.i]) {
                countMap[mj.i] = [];
            }
            countMap[mj.i].push(mj);
        }
        //先拆4个的
        for (var key in countMap) {
            var list = countMap[key];
            if (list.length > 3) {
                this.chaiFuKanRemove(list, fuList, feiList, hasPais);
            }
        }
        //再拆3个的
        for (var key in countMap) {
            var list = countMap[key];
            if (list.length == 3) {
                this.chaiFuKanRemove(list, fuList, feiList, hasPais);
            }
        }
    },

//public static List<List<Integer>> filterDef(List<Majiang> fuList, List<Majiang> feiList, MjiangHu huBean) {
//    int defSize = MajiangConstants.getFuPaiSize(huBean.getFuPaiType());
//    int maxChai = new Double(Math.ceil((fuList.size()+feiList.size())/defSize)).intValue();
//    List<List<List<Integer>>> paiLie = MajiangConstants.getFuPaiArrange(maxChai, huBean.getFuPaiType());
//    List<List<Integer>> result = null;
//    for (List<List<Integer>> def : paiLie) {
//        List<Map<Integer, Majiang>> allFuPais = new ArrayList<>();
//        List<Majiang> fuListClone = new ArrayList<>(fuList);
//        List<Majiang> feiListClone = new ArrayList<>(feiList);
//        for (int i=0;i<3;i++) {
//            if (fuListClone.size() + feiListClone.size() < defSize) {
//                break;
//            }
//            for (List<Integer> defVals : def) {
//                //副牌还有时，对于不包含已有副牌的def，先过滤掉
//                if(fuListClone.size() > 0 && i < 2) {
//                    boolean isFuInDef = false;
//                    for (Majiang fumj : fuListClone) {
//                        if(!isFuInDef && defVals.contains(fumj.getVal())) {
//                            isFuInDef = true;
//                        }
//                    }
//                    if (!isFuInDef) {
//                        continue;
//                    }
//                }
//                Map<Integer, Majiang> currently = new HashMap<>();
//                //尽可能的组合更多副牌
//                for(int defVal : defVals){
//                    for(Majiang mj : fuListClone) {
//                        if (mj.getVal() == defVal
//                            && !currently.containsKey(defVal) && currently.size() < defVals.size()) {
//                            currently.put(defVal, mj);
//                        }
//                    }
//                }
//                //第二遍循环，再用飞牌补
//                if (i > 0) {
//                    List<Majiang> feiListCopy = new ArrayList<>(feiListClone);
//                    while(feiListCopy.size() > 0 && currently.size() < defSize) {//用飞牌补齐一副牌
//                        Majiang firstFeiPai = feiListCopy.remove(0);
//                        //飞牌的val有可能重复，id也有可能和已有的基础副牌重复，所以用id+10000做key
//                        currently.put((firstFeiPai.getId()+10000), firstFeiPai);
//                    }
//                }
//                if (currently.size() == defSize && allFuPais.size() < maxChai) {//组成了一副牌
//                    //将基础副牌和飞牌从list中移除掉
//                    for(Majiang mj : currently.values()){
//                        if (fuListClone.contains(mj)) {
//                            fuListClone.remove(mj);
//                        } else if(feiListClone.contains(mj)) {
//                            feiListClone.remove(mj);
//                        }
//                    }
//                    allFuPais.add(currently);
//                }
//            }
//        }
//        if(allFuPais.size() == maxChai) {
//            result = def;
//            break;
//        }
//    }
//    return result;
//}

    getMaxSizeFuPai: function (fuPais) {
        if (fuPais == null || fuPais.length == 0) {
            return null;
        }
        var majiangMap = {};
        for (var i = 0; i < fuPais.length; i++) {
            var majiang = fuPais[i];
            var count = null;
            if (majiangMap[majiang.i]) {
                count = majiangMap[majiang.i];
            } else {
                count = [];
                majiangMap.put(majiang.i, count);
            }
            count.push(majiang);
        }
        var maxSize = 0;
        var maxVal = 0;
        for (var entry in majiangMap) {
            if (majiangMap[entry].length > maxSize) {
                maxSize = majiangMap[entry].length;
                maxVal = majiangMap[entry];
            }
        }
        return majiangMap[maxVal][0];
    },

    /**
     * 获取当前副牌可选的排列
     * @param arrange
     * @param fuType
     * @param fuPais
     * @return
     */
    getFuPaiArrangeByCurFuPai: function (arrange, fuType, fuPais) {
        var copyFuPais = ArrayUtil.clone(fuPais);
        var arrangeFuPais = [];
        for (var i = 0; i < arrange.length; i++) {
            var groupMj = [];
            for (var j = 1; j <= 3; j++) {
                var mj = this.getMaxSizeFuPai(copyFuPais);
                if (mj != null && groupMj.length < 3 && ArrayUtil.indexOf(groupMj, mj.i) < 0) {
                    groupMj.push(mj.i);
                    this.remove(copyFuPais, mj);
                }
            }
            this.getFuPaiArrange(copyFuPais, groupMj, fuType);
            ArrayUtil.sortNumerically(groupMj);
            arrangeFuPais.push(groupMj);
        }
        return arrangeFuPais;
    },

    getFuPaiArrange: function (copyFuPais, groupMjVals, fuType) {
        if (groupMjVals.length == 3) {
            return groupMjVals;
        } else {
            var fuPaiVals = 3;//MajiangConstants.getFuPai(fuType);
            for (var fuPaiVal = 0; i < fuPaiVals; i++) {
                if (!groupMjVals.contains(fuPaiVal) && groupMjVals.length < 3) {
                    groupMjVals.push(fuPaiVal);
                    for (var j = 0; j < copyFuPais.length; j++) {
                        var mj = copyFuPais[j];
                        if (mj.i == fuPaiVal) {// 手牌
                            copyFuPais.splice(j, 1);
                            j--;
                            break;
                        }
                    }
                }
            }
            return groupMjVals;
        }
    },

    /**
     * 拆副牌
     * @param fuList
     * @param feiList
     * @param huBean
     * @param hasPais
     * @param needJiang258
     * @return
     */
    chaiFu: function (fuList, feiList, huBean, hasPais) {
        this.chaiFuKan(fuList, feiList, huBean, hasPais);
        var finalFuPais = [];
        var defSize = 3;
        var maxChai = Math.ceil((fuList.length + feiList.length + huBean.getApMajiangCount()) / defSize);
        if (maxChai <= 0) {
            return true;
        }
        if((fuList.length+feiList.length+huBean.getApMajiangCount()) % defSize != 0) {
            return false;
        }
        var paiLie = MJAI.getFuPaiArrange(maxChai, huBean.getFuPaiType());
        for (var p in paiLie) {
            var def = paiLie[p];
            var allFuPais = [];
            var fuListClone = ArrayUtil.clone(fuList);
            var feiListClone = ArrayUtil.clone(feiList);
            //这里用枚举的副牌遍历3次
            //第1次不用飞牌补，优先使用基础副牌组合；
            //第2次优先已有副牌组合飞牌；
            //第3次直接使用飞牌补齐。
            var tryTimes = maxChai < 3 ? 3 : maxChai;
            var huBeanCopy = new MajiangHuBean();
            huBeanCopy.setApMajiangCount(huBean.getApMajiangCount());
            for (var i = 0; i <= tryTimes; i++) {
                if (fuListClone.length + feiListClone.length + huBeanCopy.getApMajiangCount() < defSize) {
                    break;
                }
                for (var j in def) {
                    var defVals = def[j];
                    //副牌还有时，对于不包含已有副牌的def，先过滤掉
                    if (fuListClone.length > 0 && i < 2) {
                        var isFuInDef = false;
                        for (var k in fuListClone) {
                            var fumj = fuListClone[k];
                            if (!isFuInDef && ArrayUtil.indexOf(defVals, fumj.i) >= 0) {
                                isFuInDef = true;
                            }
                        }
                        if (!isFuInDef) {
                            continue;
                        }
                    }
                    var currently = {};
                    //尽可能的组合更多副牌
                    for (var l in defVals) {
                        var defVal = defVals[l];
                        for (var m in fuListClone) {
                            var mj = fuListClone[m];
                            if (mj.i == defVal && !currently[defVal] && ObjectUtil.size(currently) < defVals.length) {
                                currently[defVal] = mj;
                            }
                        }
                    }
                    //第二遍循环，再用飞牌补
                    if (i > 0) {
                        var feiListCopy = ArrayUtil.clone(feiListClone);
                        while (feiListCopy.length > 0 && ObjectUtil.size(currently) < defSize) {//用飞牌补齐一副牌
                            var firstFeiPai = feiListCopy.splice(0, 1);
                            firstFeiPai = firstFeiPai[0];
                            //飞牌的val有可能重复，id也有可能和已有的基础副牌重复，所以用id+10000做key
                            currently[firstFeiPai.c + 10000] = firstFeiPai;
                        }
                    }
                    if ((ObjectUtil.size(currently) == defSize || (ObjectUtil.size(currently) + huBeanCopy.getApMajiangCount() >= defSize)) && allFuPais.length < maxChai) {//组成了一副牌
                        //将基础副牌和飞牌从list中移除掉
                        var needApNum = defSize - ObjectUtil.size(currently);
                        if(needApNum > 0) {
                            huBeanCopy.changeApMajiangCount(-needApNum);
                            for(var num = 0; num < needApNum; num++) {
                                currently[MJAI.SIGOYI_CARD.i] = MJAI.SIGOYI_CARD;
                            }
                        }
                        for (var c in currently) {
                            var mj = currently[c];
                            this.remove(fuListClone, mj);
                            this.remove(feiListClone, mj);
                        }
                        allFuPais.push(currently);
                    }
                }
            }
            if (allFuPais.length == maxChai) {
                finalFuPais = allFuPais;
                break;
            }
        }
        if (finalFuPais.length > 0) {
            for (var k in finalFuPais) {
                var fuPaiMap = finalFuPais[k];
                for (var j in fuPaiMap) {
                    this.remove(hasPais, fuPaiMap[j]);
                }
            }
            //cc.log("finalFuPais::"+JSON.stringify(finalFuPais));
            huBean.setFuCount(finalFuPais.length);
        }
        return this.chaipai(huBean, hasPais);
    },

    isNeedChaiShunByMax: function(fuType) {
        return (fuType == MJFuPaiType.FENG_SAN_YAO || fuType == MJFuPaiType.FENG_SAN_YAOJIU || fuType == MJFuPaiType.FENG_SAN_YAO_ZFB || fuType == MJFuPaiType.SAN_YAO_ZFB || fuType == MJFuPaiType.BBD_3231);
    },

    /**
     * @param huBean
     * @param hasPais
     * @param shunXu true按顺序拆顺  false按倒序拆顺
     * @return
     */
    chaishunLack: function (huBean, hasPais, shunXu) {
        if (hasPais.length == 0) {
            return true;
        }
        if (shunXu) {
            this.sortMin(hasPais);
        }else {
            this.sortMax(hasPais);
        }
        var minMajiang = hasPais[0];
        var minVal = minMajiang.i;
        var minList = this.getVal(hasPais, minVal);
        if (minList.length >= 3) {
            minList = minList.splice(0, 3);
            // 先拆坎子
            this.removeAll(hasPais, minList);
            return this.chaishunLack(huBean, hasPais, shunXu);
        }
        // 做顺子
        var pai1 = minVal;
        var pai0 = pai1;
        var pai0_1 = pai0;
        var pai1Mod = pai1 % 10;
        var pai1T = Math.floor(pai1 / 10);
        if (pai1T > 3) {
            return false;
        }
        if (shunXu) {
            if(pai1Mod == 9){
                pai1 = pai1 - 2;

            }else if(pai1Mod == 8){
                pai1 = pai1 - 1;
            }
            if (pai1%10 >= 2) {
                pai0 = pai1 - 1;
            }

            if (pai0 % 10 >= 2) {
                pai0_1 = pai0 - 1;
            }
            var pai2 = pai1 + 1;
            var pai3 = pai2 + 1;
            var pai4 = pai3 + 1;
        } else {
            if(pai1Mod == 1){
                pai1 = pai1 + 2;

            }else if(pai1Mod == 2){
                pai1 = pai1 + 1;
            }
            if (pai1%10 <= 8) {
                pai0 = pai1 + 1;
            }
            if (pai0 % 10 <= 8) {
                pai0_1 = pai0 + 1;
            }
            var pai2 = pai1 - 1;
            var pai3 = pai2 - 1;
            var pai4 = pai3 - 1;
        }
        var lackList = [];
        var num0_1 = this.getVal(hasPais, pai0_1);
        var num0 = this.getVal(hasPais, pai0);
        var num1 = this.getVal(hasPais, pai1);
        var num2 = this.getVal(hasPais, pai2);
        var num3 = this.getVal(hasPais, pai3);
        var num4 = this.getVal(hasPais, pai4);
        var hasMajiangList = [];
        if (num1.length > 0) {
            hasMajiangList.push(num1[0]);
        }
        if (num2.length > 0) {
            hasMajiangList.push(num2[0]);
        }
        if (num3.length > 0) {
            hasMajiangList.push(num3[0]);
        }

        var hasFeiPai = false;
        var hasFuPai = false;
        var isNeedBuFu = this.isNeedBuFu(huBean.getFuPaiType());
        if (num0_1.length == 0 && ArrayUtil.indexOf(lackList,pai0_1) >= 0 && hasMajiangList.length == 1) {// 只有一张牌的时候加上卡张的那张
            lackList.push(pai0_1);
            hasFeiPai = MJRoomModel.isFeiPaiVo(MJAI.getMJDefByI(pai0_1));
            if (isNeedBuFu) {
                hasFuPai = MJRoomModel.isFeiPaiVo(MJAI.getMJDefByI(pai0_1));
            }
        }
        if (num0.length == 0) {
            lackList.push(pai0);
            hasFeiPai = MJRoomModel.isFeiPaiVo(MJAI.getMJDefByI(pai0));
            if (isNeedBuFu) {
                hasFuPai = MJRoomModel.isFuPaiVo(MJAI.getMJDefByI(pai0));
            }
        }
        if (num1.length == 0) {
            lackList.push(pai1);
            if (!hasFeiPai) {
                hasFeiPai = MJRoomModel.isFeiPaiVo(MJAI.getMJDefByI(pai1));
            }
            if (isNeedBuFu && !hasFuPai) {
                hasFuPai = MJRoomModel.isFuPaiVo(MJAI.getMJDefByI(pai1));
            }
        }
        if (num2.length == 0) {
            lackList.push(pai2);
            if (!hasFeiPai) {
                hasFeiPai = MJRoomModel.isFeiPaiVo(MJAI.getMJDefByI(pai2));
            }
            if (isNeedBuFu && !hasFuPai) {
                hasFuPai = MJRoomModel.isFuPaiVo(MJAI.getMJDefByI(pai2));
            }
        }
        if (num3.length == 0) {
            lackList.push(pai3);
            if (!hasFeiPai) {
                hasFeiPai = MJRoomModel.isFeiPaiVo(MJAI.getMJDefByI(pai3));
            }
            if (isNeedBuFu && !hasFuPai) {
                hasFuPai = MJRoomModel.isFuPaiVo(MJAI.getMJDefByI(pai3));
            }
        }
        var sameHuaSe = 0;
        if ((hasFeiPai || (isNeedBuFu && hasFuPai)) && lackList.length <= 1) {
            for (var i = 0; i < hasPais.length; i++) {
                var hasPai = hasPais[i];
                if (hasPai.t == MJAI.getMJDefByI(pai1).t) {
                    sameHuaSe++;
                }
            }
        }
        huBean.setHasMajiangs(hasMajiangList);
        //如果补过一万一条一筒，且不能胡，下一次尝试先拆小顺，再尝试补九万九条九筒
        var tryBufei9 = (huBean.isFei1(pai0) && huBean.isHasBuFei1() && huBean.isNeedBuFei9());
        //需要先补飞牌的情况
        if (!tryBufei9 && (hasMajiangList.length != 3 || (hasFeiPai && sameHuaSe % 3 != 0 && (num4.length > 0 || num3.length == 3)))) {
            huBean.setLackList(lackList);
            if (hasMajiangList.length == 3 && sameHuaSe % 3 == 2 && huBean.isFei1(pai0)) {
                huBean.setHasBuFei1(true);
            }
            return false;
        } else if (isNeedBuFu && (hasMajiangList.length != 3 || (hasFuPai && sameHuaSe % 3 != 0 && (num4.length > 0 || num3.length == 3)))) {
            huBean.setLackList(lackList);
            return false;
        } else {
            if(hasMajiangList.length < 3 && (hasMajiangList.length + huBean.getApMajiangCount() >= 3)) {
                huBean.changeApMajiangCount(hasMajiangList.length - 3);
            } else if (hasMajiangList.length != 3) {
                return false;
            }
            this.removeAll(hasPais, hasMajiangList);
            return this.chaishunLack(huBean, hasPais,shunXu);
        }
    },
    /**
     * 拆顺
     *
     * @param hasPais
     * @return
     */
    chaishun: function (huBean, hasPais) {
        if (hasPais.length == 0) {
            return true;
        }
        this.sortMin(hasPais);
        var minMajiang = hasPais[0];
        var minVal = minMajiang.i;
        var minList = this.getVal(hasPais, minVal);
        if (minList.length >= 3) {
            minList = minList.splice(0, 3);
            // 先拆坎子
            this.removeAll(hasPais, minList);
            return this.chaipai(huBean, hasPais);
        }

        // 做顺子
        var pai1 = minVal;
        if (pai1 % 10 == 9) {
            pai1 = pai1 - 2;

        } else if (pai1 % 10 == 8) {
            pai1 = pai1 - 1;
        }
        var pai2 = pai1 + 1;
        var pai3 = pai2 + 1;

        var lackList = [];
        var num1 = this.getVal(hasPais, pai1);
        var num2 = this.getVal(hasPais, pai2);
        var num3 = this.getVal(hasPais, pai3);

        // 找到一句话的麻将
        var hasMajiangList = [];
        if (num1.length > 0) {
            hasMajiangList.push(num1[0]);
        }
        if (num2.length > 0) {
            hasMajiangList.push(num2[0]);
        }
        if (num3.length > 0) {
            hasMajiangList.push(num3[0]);
        }

        // 一句话缺少的麻将
        if (num1.length == 0) {
            lackList.push(pai1);
        }
        if (num2.length == 0) {
            lackList.push(pai2);
        }
        if (num3.length == 0) {
            lackList.push(pai3);
        }
        var lackNum = lackList.length;
        //cc.log("chaishun.lackList=============="+JSON.stringify(lackList))
        //cc.log("chaishun.hasMajiangList=============="+JSON.stringify(hasMajiangList))
        if (lackNum > 0) {
            var count = this.getVal(hasPais, hasMajiangList[0].i);
            if (count.length == 2 && huBean.getApMajiangCount() > 0) {
                huBean.changeApMajiangCount(-1);
                this.removeAll(hasPais,count);
            } else if (huBean.getApMajiangCount() >= lackNum) {
                // 如果有红中则补上
                huBean.changeApMajiangCount(-lackNum);
                this.removeAll(hasPais,hasMajiangList);
            } else {
                huBean.setLackList(lackList);
                return false;
            }
        } else {
            // 可以一句话
            //if (huBean.getApMajiangCount() > 0) {
            //    var count1 = this.getVal(hasPais, hasMajiangList[0].i);
            //    var count2 = this.getVal(hasPais, hasMajiangList[1].i);
            //    var count3 = this.getVal(hasPais, hasMajiangList[2].i);
            //    if (count1.length >= 2 && (count2.length == 1 || count3.length == 1)) {
            //        var copy = ArrayUtil.clone(hasPais);
            //        this.removeAll(copy,count1);
            //        var huBeanCopy = new MajiangHuBean();
            //        huBeanCopy.setHuVal(huBean.getHuVal());
            //        huBeanCopy.setFuPaiType(huBean.getFuPaiType());
            //        huBeanCopy.setJiangLei(huBean.getJiangLei());
            //        huBeanCopy.setJiangModDefList(huBean.getJiangModDefList());
            //        huBeanCopy.changeApMajiangCount(-1);
            //        if (this.chaipai(huBeanCopy, copy)) {
            //            huBean.setHuVal(huBeanCopy.getHuVal());
            //            huBean.setFuPaiType(huBeanCopy.getFuPaiType());
            //            huBean.setJiangLei(huBeanCopy.getJiangLei());
            //            huBean.setJiangModDefList(huBeanCopy.getJiangModDefList());
            //            huBean.changeApMajiangCount(-1);
            //            return true;
            //        }
            //    }
            //}
            this.removeAll(hasPais, hasMajiangList);
        }
        return this.chaipai(huBean, hasPais);
    },

    hasFeiPai:function(feiListClone,pai1T){
        for(var i =0;i<feiListClone.length;i++){
            if(pai1T == feiListClone[i].t && feiListClone[i].t < 4 && feiListClone[i].n == 1){
                return true;
            }
        }
        return false;
    },


});

