/**
 * Created by zhoufan on 2017/8/11.
 */
var YJMajiangSmartFilter = cc.Class.extend({

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
            //cc.log("isHu cost time::push::"+pushOutVo.i);
            var checkedIndex = MJAI.findIndexByMJVoI(hasChecked,pushOutVo.i);
            if(checkedIndex < 0) {
                hasChecked.push(pushOutVo);
                var result = this.isHu(copy, huBean);
                if (result && result.length > 0) {
                    tingResult.push({ting: result, pushOut: pushOutVo});
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

    isHu:function(handCards, huBean,curIndex){
        if(!handCards){
            return false;
        }
        var hzMjAI = MJAI.ZZ_CHECK_HU_MJ;
        var length = curIndex>=0? curIndex + MJAI.DEFAULT_CHECK_NUMS : hzMjAI.length;
        length = length>hzMjAI.length ? hzMjAI.length : length;
        var curIndex = curIndex || 0;
        var tingCards = [];
        hzMJAILoop:for(var i=curIndex;i<length;i++){
            var cards = [];
            if(handCards.length>0){
                cards = ArrayUtil.clone(handCards);
            }
            cards.push(hzMjAI[i]);
            var huBeanCopy = new YJMajiangHuBean();
            huBeanCopy.setHuVal(hzMjAI[i].i);
            huBeanCopy.setHuId(hzMjAI[i].c);
            if(this.judgeHu(cards,huBeanCopy)){
                var isHas = false;
                TingcardsLoop:for(var j=0;j<tingCards.length;j++){
                    if(hzMjAI[i].i == tingCards[j].i){
                        isHas = true;
                        break TingcardsLoop;
                    }
                }
                if(!isHas) {
                    tingCards.push(hzMjAI[i]);
                }
            }
        }
        return tingCards;
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
            }
        }
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
    check7duizi:function(majiangIds,card_index){
        if(majiangIds.length == 14){
            // 7小对
            var duizi = card_index.getDuiziNum();
            if(duizi == 7){
                return true;
            }
        }
        return false;
    },


    judgeHu:function(handCards,huBean){
        if(!handCards || handCards.length == 0){
            return false;
        }
        var copy = ArrayUtil.clone(handCards);
        if(handCards.length % 3 != 2){
            return false;
        }
        var card_index = new LNMajiangIndexArr();
        this.getMax(card_index,copy);
        if (this.check7duizi(copy, card_index)) {//胡7对
            huBean.setQiXiaoDui(true);
            return true;
        }
        // 拆将
        if(this.chaijiang(huBean,card_index,copy,0) != null){
            return true;
        }else{
            return false;
        }
    },


    // 拆将
    chaijiang: function(huBean,card_index,hasPais){
        var jiangMap = card_index.getJiang(huBean);
        //cc.log("jiangMap==="+JSON.stringify(jiangMap))
        var huList = [];
        for(var valEntry in jiangMap){
            var copy = ArrayUtil.clone(hasPais);
            var list = jiangMap[valEntry];
            var i = 0;
            var isContinue = false;
            var relatedJiangList = [];
            for(var majiang in list){
                i++;
                this.remove(copy,list[majiang]);
                relatedJiangList.push(list[majiang]);
                if(i >= 2){
                    huBean.setJiangVal(list[majiang].i);
                    break;
                }
            }
            if (isContinue) {
                continue;
            }
            //开始拆顺
            var isShunOk = this.chaipai(huBean, copy);
            if (isShunOk) {
                huBean.setHu(true);
                huList.push(huBean);
                break;
            }
        }
        if (huList.length > 0) {
            return huList[0];
        }
        return null;
    },

    chaipai: function(huBean,hasPais){
        if (hasPais.length == 0) {
            return true;
        }
        var hu = this.chaishun(huBean,hasPais);
        if (hu)
            return true;
        return false;
    },

    sortMin:function(hasPais) {
        var compare = function(o1,o2) {
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

    chaishun: function(huBean, hasPais) {
        if(hasPais.length == 0){
            return true;
        }
        this.sortMin(hasPais);
        var minMajiang = hasPais[0];
        var minVal = minMajiang.i;
        var minList = this.getVal(hasPais, minVal);
        if (minList.length >= 3){
            minList = minList.splice(0,3);
            this.removeAll(hasPais,minList);
            return this.chaipai(huBean, hasPais);
        }

        // 做顺子
        var pai1 = minVal;
        if(pai1%10 == 9){
            pai1 = pai1 - 2;

        }else if(pai1%10 == 8){
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
        if(num1.length > 0){
            hasMajiangList.push(num1[0]);
        }
        if(num2.length > 0){
            hasMajiangList.push(num2[0]);
        }
        if(num3.length > 0){
            hasMajiangList.push(num3[0]);
        }

        // 一句话缺少的麻将
        if(num1.length == 0){
            lackList.push(pai1);
        }
        if(num2.length == 0){
            lackList.push(pai2);
        }
        if(num3.length == 0){
            lackList.push(pai3);
        }
        var lackNum = lackList.length;
        if(lackNum > 0){
            huBean.setLackList(lackList);
            return false;
        }else {
            // 可以一句话
            this.removeAll(hasPais,hasMajiangList);
        }
        return this.chaipai(huBean, hasPais);

    }
})
