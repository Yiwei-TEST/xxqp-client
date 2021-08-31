/**
 * Created by Administrator on 2020/6/3.
 */

var XPLPAction = {
    CHU_PAI:0,
    HU:1,
    PENG:2,
    GANG:3,
    AN_GANG:4,
    GUO:5,
    CHI:6,
    BU_ZHANG:7,
    XIAO_HU:8,
    MO_PAI:9,
    MO_HAI_DI:10,
    MO_GANG_PAI:11,
    XIA_DAN:20,
    TING:21,
    HIDE_XIAOHU:24,//长沙麻将隐藏小胡牌消息
    BAI_JIAO:8,
    ALL_JIN_PAI:13,//涨死 手上全是禁牌
    HUIPAI_TING:8,//会牌 报听
    ZZ_TING:21,//卡二条 闲家起手报听
    SHUAIPAI:15,//张掖甩牌
    HP_TINGPAI:15,//会牌二报听听牌
    CHI_TING:16,//秦安吃听
    CHI_TING_JCHS:15,//金昌滑水
    TIAN_TING:16,//静宁打经天听
    JQMJ_SHUAIPAI:16,//酒泉三报甩牌
    LZEB_BUHUA:16,//兰州二报补花
    BAO_TING:25,//宁乡麻将通知起手报听
    YIDIANHONG:19,//一点红
    YAO_GANG:14,//芷江麻将摇杠(明杠)
    YAO_ANGANG:15,//芷江麻将摇杠(暗杠)
};

var XPLPDanType = {
    DONG_NAN_XI_BEI:1,
    ZHONG_FA_BAI:2,
    YI_YI_YI:3,
    JIU_JIU_JIU:4,
    BU_YI_TIAO:-1
}

// 溆浦老牌牌 11 条  21 筒 31 万
var XPLPAI = {
    MJ_NUMBER:13,
    LANZHOU_CHECK_NUMS:20,
    DEFAULT_CHECK_NUMS:20,
    BAIJIAO_CHECK_NUMS:27,
    NOFENG_CHECK_NUMS:14,
    SIGOYI_CARD : {t:0,n:0,i:1000,c:0},
    XPLPList:[
        {t:0,n:0,i:0,c:0},
        {t:1,n:1,i:11,c:1},
        {t:1,n:2,i:12,c:2},
        {t:1,n:3,i:13,c:3},
        {t:1,n:4,i:14,c:4},
        {t:1,n:5,i:15,c:5},
        {t:1,n:6,i:16,c:6},
        {t:1,n:7,i:17,c:7},
        {t:1,n:8,i:18,c:8},
        {t:1,n:9,i:19,c:9},
        {t:2,n:1,i:21,c:10},
        {t:2,n:2,i:22,c:11},
        {t:2,n:3,i:23,c:12},
        {t:2,n:4,i:24,c:13},
        {t:2,n:5,i:25,c:14},
        {t:2,n:6,i:26,c:15},
        {t:2,n:7,i:27,c:16},
        {t:2,n:8,i:28,c:17},
        {t:2,n:9,i:29,c:18},
        {t:3,n:1,i:31,c:19},
        {t:3,n:2,i:32,c:20},
        {t:3,n:3,i:33,c:21},
        {t:3,n:4,i:34,c:22},
        {t:3,n:5,i:35,c:23},
        {t:3,n:6,i:36,c:24},
        {t:3,n:7,i:37,c:25},
        {t:3,n:8,i:38,c:26},
        {t:3,n:9,i:39,c:27},
        {t:1,n:1,i:11,c:28},
        {t:1,n:2,i:12,c:29},
        {t:1,n:3,i:13,c:30},
        {t:1,n:4,i:14,c:31},
        {t:1,n:5,i:15,c:32},
        {t:1,n:6,i:16,c:33},
        {t:1,n:7,i:17,c:34},
        {t:1,n:8,i:18,c:35},
        {t:1,n:9,i:19,c:36},
        {t:2,n:1,i:21,c:37},
        {t:2,n:2,i:22,c:38},
        {t:2,n:3,i:23,c:39},
        {t:2,n:4,i:24,c:40},
        {t:2,n:5,i:25,c:41},
        {t:2,n:6,i:26,c:42},
        {t:2,n:7,i:27,c:43},
        {t:2,n:8,i:28,c:44},
        {t:2,n:9,i:29,c:45},
        {t:3,n:1,i:31,c:46},
        {t:3,n:2,i:32,c:47},
        {t:3,n:3,i:33,c:48},
        {t:3,n:4,i:34,c:49},
        {t:3,n:5,i:35,c:50},
        {t:3,n:6,i:36,c:51},
        {t:3,n:7,i:37,c:52},
        {t:3,n:8,i:38,c:53},
        {t:3,n:9,i:39,c:54},
        {t:1,n:1,i:11,c:55},
        {t:1,n:2,i:12,c:56},
        {t:1,n:3,i:13,c:57},
        {t:1,n:4,i:14,c:58},
        {t:1,n:5,i:15,c:59},
        {t:1,n:6,i:16,c:60},
        {t:1,n:7,i:17,c:61},
        {t:1,n:8,i:18,c:62},
        {t:1,n:9,i:19,c:63},
        {t:2,n:1,i:21,c:64},
        {t:2,n:2,i:22,c:65},
        {t:2,n:3,i:23,c:66},
        {t:2,n:4,i:24,c:67},
        {t:2,n:5,i:25,c:68},
        {t:2,n:6,i:26,c:69},
        {t:2,n:7,i:27,c:70},
        {t:2,n:8,i:28,c:71},
        {t:2,n:9,i:29,c:72},
        {t:3,n:1,i:31,c:73},
        {t:3,n:2,i:32,c:74},
        {t:3,n:3,i:33,c:75},
        {t:3,n:4,i:34,c:76},
        {t:3,n:5,i:35,c:77},
        {t:3,n:6,i:36,c:78},
        {t:3,n:7,i:37,c:79},
        {t:3,n:8,i:38,c:80},
        {t:3,n:9,i:39,c:81},
        {t:1,n:1,i:11,c:82},
        {t:1,n:2,i:12,c:83},
        {t:1,n:3,i:13,c:84},
        {t:1,n:4,i:14,c:85},
        {t:1,n:5,i:15,c:86},
        {t:1,n:6,i:16,c:87},
        {t:1,n:7,i:17,c:88},
        {t:1,n:8,i:18,c:89},
        {t:1,n:9,i:19,c:90},
        {t:2,n:1,i:21,c:91},
        {t:2,n:2,i:22,c:92},
        {t:2,n:3,i:23,c:93},
        {t:2,n:4,i:24,c:94},
        {t:2,n:5,i:25,c:95},
        {t:2,n:6,i:26,c:96},
        {t:2,n:7,i:27,c:97},
        {t:2,n:8,i:28,c:98},
        {t:2,n:9,i:29,c:99},
        {t:3,n:1,i:31,c:100},
        {t:3,n:2,i:32,c:101},
        {t:3,n:3,i:33,c:102},
        {t:3,n:4,i:34,c:103},
        {t:3,n:5,i:35,c:104},
        {t:3,n:6,i:36,c:105},
        {t:3,n:7,i:37,c:106},
        {t:3,n:8,i:38,c:107},
        {t:3,n:9,i:39,c:108},
        {t:2,n:4,i:24,c:1004},
        {t:2,n:5,i:25,c:1005},
        //东南西北风
        {t:4,n:1,i:301,c:109},
        {t:4,n:1,i:301,c:110},
        {t:4,n:1,i:301,c:111},
        {t:4,n:1,i:301,c:112},
        {t:4,n:2,i:311,c:113},
        {t:4,n:2,i:311,c:114},
        {t:4,n:2,i:311,c:115},
        {t:4,n:2,i:311,c:116},
        {t:4,n:3,i:321,c:117},
        {t:4,n:3,i:321,c:118},
        {t:4,n:3,i:321,c:119},
        {t:4,n:3,i:321,c:120},
        {t:4,n:4,i:331,c:121},
        {t:4,n:4,i:331,c:122},
        {t:4,n:4,i:331,c:123},
        {t:4,n:4,i:331,c:124},
        //中发白
        {t:4,n:9,i:201,c:201},
        {t:4,n:9,i:201,c:202},
        {t:4,n:9,i:201,c:203},
        {t:4,n:9,i:201,c:204},
        {t:4,n:10,i:211,c:205},
        {t:4,n:10,i:211,c:206},
        {t:4,n:10,i:211,c:207},
        {t:4,n:10,i:211,c:208},
        {t:4,n:11,i:221,c:209},
        {t:4,n:11,i:221,c:210},
        {t:4,n:11,i:221,c:211},
        {t:4,n:11,i:221,c:212}
    ],

    DEFAULT_CHECK_HU_MJ:[
        {t:1,n:1,i:11,c:1},
        {t:1,n:2,i:12,c:2},
        {t:1,n:3,i:13,c:3},
        {t:1,n:4,i:14,c:4},
        {t:1,n:5,i:15,c:5},
        {t:1,n:6,i:16,c:6},
        {t:1,n:7,i:17,c:7},
        {t:1,n:8,i:18,c:8},
        {t:1,n:9,i:19,c:9},
        {t:2,n:1,i:21,c:10},
        {t:2,n:2,i:22,c:11},
        {t:2,n:3,i:23,c:12},
        {t:2,n:4,i:24,c:13},
        {t:2,n:5,i:25,c:14},
        {t:2,n:6,i:26,c:15},
        {t:2,n:7,i:27,c:16},
        {t:2,n:8,i:28,c:17},
        {t:2,n:9,i:29,c:18},
        {t:3,n:1,i:31,c:19},
        {t:3,n:2,i:32,c:20},
        {t:3,n:3,i:33,c:21},
        {t:3,n:4,i:34,c:22},
        {t:3,n:5,i:35,c:23},
        {t:3,n:6,i:36,c:24},
        {t:3,n:7,i:37,c:25},
        {t:3,n:8,i:38,c:26},
        {t:3,n:9,i:39,c:27},
        //东南西北风
        {t:4,n:1,i:301,c:112},
        {t:4,n:2,i:311,c:116},
        {t:4,n:3,i:321,c:120},
        {t:4,n:4,i:331,c:124},
        //中发白
        {t:4,n:9,i:201,c:201},
        {t:4,n:10,i:211,c:208},
        {t:4,n:11,i:221,c:212}
    ],

    NOFENG_CHECK_HU_MJ:[
        {t:1,n:1,i:11,c:1},
        {t:1,n:2,i:12,c:2},
        {t:1,n:3,i:13,c:3},
        {t:1,n:4,i:14,c:4},
        {t:1,n:5,i:15,c:5},
        {t:1,n:6,i:16,c:6},
        {t:1,n:7,i:17,c:7},
        {t:1,n:8,i:18,c:8},
        {t:1,n:9,i:19,c:9},
        {t:2,n:1,i:21,c:10},
        {t:2,n:2,i:22,c:11},
        {t:2,n:3,i:23,c:12},
        {t:2,n:4,i:24,c:13},
        {t:2,n:5,i:25,c:14},
        {t:2,n:6,i:26,c:15},
        {t:2,n:7,i:27,c:16},
        {t:2,n:8,i:28,c:17},
        {t:2,n:9,i:29,c:18},
        {t:3,n:1,i:31,c:19},
        {t:3,n:2,i:32,c:20},
        {t:3,n:3,i:33,c:21},
        {t:3,n:4,i:34,c:22},
        {t:3,n:5,i:35,c:23},
        {t:3,n:6,i:36,c:24},
        {t:3,n:7,i:37,c:25},
        {t:3,n:8,i:38,c:26},
        {t:3,n:9,i:39,c:27}
    ],

    ZZ_CHECK_HU_MJ:[
        {t:1,n:1,i:11,c:1},
        {t:1,n:2,i:12,c:2},
        {t:1,n:3,i:13,c:3},
        {t:1,n:4,i:14,c:4},
        {t:1,n:5,i:15,c:5},
        {t:1,n:6,i:16,c:6},
        {t:1,n:7,i:17,c:7},
        {t:1,n:8,i:18,c:8},
        {t:1,n:9,i:19,c:9},
        {t:2,n:1,i:21,c:10},
        {t:2,n:2,i:22,c:11},
        {t:2,n:3,i:23,c:12},
        {t:2,n:4,i:24,c:13},
        {t:2,n:5,i:25,c:14},
        {t:2,n:6,i:26,c:15},
        {t:2,n:7,i:27,c:16},
        {t:2,n:8,i:28,c:17},
        {t:2,n:9,i:29,c:18}
    ],

    danPatterns:[],

    //四风蛋
    danPatterns4:[
        //东南西北
        {type:1,pat:[{t:4,n:1},{t:4,n:2},{t:4,n:3},{t:4,n:4}]},
        //中发白
        {type:2,pat:[{t:4,n:9},{t:4,n:10},{t:4,n:11}]},
        //三个一
        {type:3,pat:[{t:1,n:1},{t:2,n:1},{t:3,n:1}]},
        //三个九
        {type:4,pat:[{t:1,n:9},{t:2,n:9},{t:3,n:9}]}
    ],

    //三风蛋
    danPatterns3:[
        //东南西北
        {type:1,pat:[{t:4,n:1},{t:4,n:2},{t:4,n:3}]},
        {type:1,pat:[{t:4,n:1},{t:4,n:2},{t:4,n:4}]},
        {type:1,pat:[{t:4,n:2},{t:4,n:3},{t:4,n:4}]},
        {type:1,pat:[{t:4,n:1},{t:4,n:3},{t:4,n:4}]},
        //中发白
        {type:2,pat:[{t:4,n:9},{t:4,n:10},{t:4,n:11}]},
        //三个一
        {type:3,pat:[{t:1,n:1},{t:2,n:1},{t:3,n:1}]},
        //三个九
        {type:4,pat:[{t:1,n:9},{t:2,n:9},{t:3,n:9}]}
    ],

    initFengDanPattern:function(feng){
        this.danPatterns = feng==3 ? this.danPatterns3 : this.danPatterns4;
    },

    isExistInDan:function(cards,curVo){
        var result = false;
        for(var i=0;i<cards.length;i++){
            var card = cards[i];
            if(card.t==curVo.t&&card.n==curVo.n){
                result = true
                break;
            }
        }
        return result;
    },

    isYiTiao:function(mjVo){
        return (mjVo.t==1&&mjVo.n==1);
    },

    getYiTiaoIndexInArray:function(voArray){
        var index = -1;
        for(var i=0;i<voArray.length;i++){
            var vo = voArray[i];
            if(this.isYiTiao(vo)){
                index = i;
                break;
            }
        }
        return index;
    },

    getVoArray:function(ids){
        var voArray = [];
        for(var i=0;i<ids.length;i++){
            voArray.push(this.getMJDef(ids[i]));
        }
        return voArray;
    },

    /**
     * 按大小排序
     * @param mj1 {MJVo}
     * @param mj2 {MJVo}
     * @private
     * @return {number}
     */
    sortMJ:function(mj1,mj2){
        if (!mj1.c || !mj2.c) {
            return -1;
        }

        if (XPLPRoomModel.isGSMJ() || XPLPRoomModel.isGuCang()) {
            if (XPLPRoomModel.isFuPaiVo(mj2) && !XPLPRoomModel.isFuPaiVo(mj1)) {
                return 1;
            }
            if (XPLPRoomModel.isFuPaiVo(mj1) && !XPLPRoomModel.isFuPaiVo(mj2)) {
                return -1;
            }
            if (XPLPRoomModel.isFeiPaiVo(mj1) && XPLPRoomModel.isFeiPaiVo(mj2)) {
                //noting to do
            }else {
                if (XPLPRoomModel.isFeiPaiVo(mj2) && !XPLPRoomModel.isFuPaiVo(mj1)) {
                    return 1;
                }
                if (XPLPRoomModel.isFeiPaiVo(mj1) && !XPLPRoomModel.isFuPaiVo(mj2)) {
                    return -1;
                }
            }
        }else if(XPLPRoomModel.isHuiPai() || XPLPRoomModel.isHSMJ() || XPLPRoomModel.isJNMJ() || XPLPRoomModel.isJQTJ() || XPLPRoomModel.isLZFJ()){
            if (XPLPRoomModel.isHuiPaiVo(mj1) && !XPLPRoomModel.isHuiPaiVo(mj2)) {
                return -1;
            }else if (!XPLPRoomModel.isHuiPaiVo(mj1) && XPLPRoomModel.isHuiPaiVo(mj2)) {
                return 1;
            }
        }
        var seqs = [2,3,1,4];
        var seq1 = seqs[mj1.t-1];
        var seq2 = seqs[mj2.t-1];
        if (seq2==seq1) {
            return mj1.n-mj2.n;
        }
        //if(mj2.t==4)
        //    return 1;
        //if(mj1.t==4)
        //    return -1;
        return seq1-seq2;
    },

    //风牌飞牌放最后面
    sortCheckTing:function(mj1,mj2){
        if (!mj1.c || !mj2.c) {
            return -1;
        }
        if (XPLPRoomModel.isFuPaiVo(mj2) && !XPLPRoomModel.isFuPaiVo(mj1)) {
            return -1;
        }
        if (XPLPRoomModel.isFuPaiVo(mj1) && !XPLPRoomModel.isFuPaiVo(mj2)) {
            return 1;
        }
        if (XPLPRoomModel.isFeiPaiVo(mj1) || XPLPRoomModel.isFeiPaiVo(mj2)) {
            return -1;
        }else {
            if (XPLPRoomModel.isFeiPaiVo(mj2) && !XPLPRoomModel.isFuPaiVo(mj1)) {
                return -1;
            }
            if (XPLPRoomModel.isFeiPaiVo(mj1) && !XPLPRoomModel.isFuPaiVo(mj2)) {
                return 1;
            }
        }
        var seqs = [4,2,3,1];
        var seq1 = seqs[mj1.t-1];
        var seq2 = seqs[mj2.t-1];
        if (seq2==seq1) {
            return mj1.n-mj2.n;
        }
        //if(mj2.t==4)
        //    return 1;
        //if(mj1.t==4)
        //    return -1;
        return seq1-seq2;
    },

    sortPlaceData2:function(inner1,inner2){
        if(inner1.action==XPLPAction.XIA_DAN && inner2.action==XPLPAction.XIA_DAN){
            if(inner2.huxi==-1)
                return -1;
            return 0;
        }
        var seq = {};
        seq[XPLPAction.XIA_DAN] = 1;
        seq[XPLPAction.AN_GANG] = 2;
        seq[XPLPAction.GANG] = 3;
        seq[XPLPAction.PENG] = 4;
        seq[XPLPAction.CHI] = 5;
        seq[XPLPAction.BAI_JIAO] = 6;
        var seq1 = seq[inner1.action];
        var seq2 = seq[inner2.action];
        return seq1-seq2;
    },

    /**
     * @param direct
     * @param place
     * @returns {MJDisplayVo}
     */
    getDisplayVo:function(direct,place){
        return {direct:direct,place:place};
    },

    /**
     * 通过i找到正确的index
     * @param voArray
     * @param i
     * @returns {number}
     */
    findIndexByMJVoI: function(voArray, i) {
        var index = -1;
        for (var j=0;j<voArray.length;j++) {
            if (voArray[j].i == i) {
                index = j;
                break;
            }
        }
        return index;
    },

    /**
     * 通过c找到正确的index
     * @param voArray
     * @param c
     * @returns {number}
     */
    findIndexByMJVoC: function(voArray, c) {
        var index = -1;
        if (c == 0){
            return index;
        }
        for (var j=0;j<voArray.length;j++) {
            if (voArray[j].c == c) {
                index = j;
                break;
            }
        }
        return index;
    },

    isSameVo: function(mjVo1, mjVo2) {
        return (mjVo1.t==mjVo2.t && mjVo1.n==mjVo2.n);
    },

    getMJDefByI: function(mjVoI) {
        var res = null;
        for(var i=0;i<this.XPLPList.length;i++){
            var card = this.XPLPList[i];
            if(card.i == mjVoI){
                res = card;
                break;
            }
        }
        if(res != null) {
            return this.getMJDef(res.c);
        }
        return null;
    },

    getMJDef:function(id){
        var res = null;
        for(var i=0;i<this.XPLPList.length;i++){
            var card = this.XPLPList[i];
            if(card.c == id){
                res = card;
                break;
            }
        }
        if(res==null){
            cc.log("getMJDef not found::"+id);
        }else{
            var realRes = {};//需要克隆一个，不然对该对象做操作会有引用的问题
            for(var key in res){
                realRes[key] = res[key];
            }
            return realRes;
        }
        return res;
    },

    isContainArray:function(arr,allArray){
        arr = arr || [];
        allArray = allArray || [];
        for(var i = 0;i < allArray.length;++i){
            var temp = JSON.stringify(allArray[i]);
            if(JSON.stringify(arr) == temp){
                return true;
            }
        }
        return false;
    },

    copyMJDef:function(mjVo) {
        var realRes = {};//需要克隆一个，不然对该对象做操作会有引用的问题
        for(var key in mjVo){
            realRes[key] = mjVo[key];
        }
        return realRes;
    },

    getMJBynVal:function(MJOnHands,nVal){
        MJOnHands = MJOnHands || [];
        for(var i = 0;i < MJOnHands.length;++i){
            if(MJOnHands[i].n == nVal && MJOnHands[i].t == 4){
                return this.copyMJDef(MJOnHands[i]);
            }
        }
    },

    /**
     *
     * @param MJOnHands {Array.<MJVo>}
     * @param lastMJ {MJVo}
     */
    getChi:function(MJOnHands,lastMJ){
        var first_wang = 0;
        var second_wang = 0;
        if (XPLPRoomModel.wanfa == GameTypeEunmMJ.AHMJ){
            if (XPLPRoomModel.ahmj_wangID && XPLPRoomModel.ahmj_wangID != -1){
                var cardVo = XPLPAI.getMJDef(XPLPRoomModel.ahmj_wangID);
                if (XPLPRoomModel.intParams[4] == 1){//四王
                    first_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;
                }else{
                    if (XPLPRoomModel.intParams[4] == 2){//七王
                        first_wang = (cardVo.n )>9?(cardVo.n )%9:cardVo.n ;;
                        second_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;;
                    }
                }
            }
        }else if(XPLPRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            if(XPLPRoomModel.ahmj_wangID > 0){
                var cardVo = XPLPAI.getMJDef(XPLPRoomModel.ahmj_wangID);
                if(XPLPRoomModel.intParams[4] == 1){//开单王
                    first_wang = cardVo.n;
                }else{//开双王
                    first_wang = cardVo.n + 1;
                    second_wang = cardVo.n - 1;
                    if(first_wang == 10)first_wang = 1;
                    if(second_wang == 0)second_wang = 9;
                }
            }
        }

        /** 增加额外的吃牌 **/
        if(lastMJ && lastMJ.t == 4 && lastMJ.n >= 9){
            var tempArr = [];
            if(lastMJ.n == 9){
                tempArr.push(this.getMJBynVal(MJOnHands,10));
                tempArr.push(this.getMJBynVal(MJOnHands,11));
            }else if(lastMJ.n == 10){
                tempArr.push(this.getMJBynVal(MJOnHands,9));
                tempArr.push(this.getMJBynVal(MJOnHands,11));
            }else if(lastMJ.n == 11){
                tempArr.push(this.getMJBynVal(MJOnHands,10));
                tempArr.push(this.getMJBynVal(MJOnHands,9));
            }
            return [tempArr];
        }

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
                    if ((s != first_wang && s!= second_wang) || lastMJ.t != XPLPAI.getMJDef(XPLPRoomModel.ahmj_wangID).t )
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
        var result = [];
        if(array.length>0){
            arrayloop:
                for(var i=0;i<array.length;i++){
                    var temp = array[i];
                    var voArray = [];
                    tempLoop:for(var j=0;j<temp.length;j++){
                        var tv = parseInt(temp[j]);
                        if(tv==n){
                            voArray.push(this.copyMJDef(lastMJ));
                        }else{
                            mjLoop:for(var m=0;m<l;m++){
                                var vo = MJOnHands[m];
                                if(vo.t==t&&vo.n==tv){
                                    voArray.push(this.copyMJDef(vo));
                                    break mjLoop;
                                }
                            }
                        }
                    }
                    if(voArray.length==3)
                        result.push(voArray);
                }
        }
        return result;
    },

    getChiByJN:function(MJOnHands,lastMJ,jingCards){
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
        var result = [];
        if(array.length>0){
            arrayloop:for(var i=0;i<array.length;i++) {
                var temp = array[i];
                var voArray = [];
                tempLoop:for (var j = 0; j < temp.length; j++) {
                    var tv = parseInt(temp[j]);
                    if (tv == n) {
                        voArray.push(this.copyMJDef(lastMJ));
                    } else {
                        mjLoop:for (var m = 0; m < l; m++) {
                            var vo = MJOnHands[m];
                            if (vo.t == t && vo.n == tv) {
                                voArray.push(this.copyMJDef(vo));
                                break mjLoop;
                            }
                        }
                    }
                }
                if (voArray.length == 3)
                    result.push(voArray);
            }
            //带经吃
            if(jingCards.length > 0 && XPLPRoomModel.getDaiJingChiByPL()) {
                var hasCheck = [];
                var count = 0;
                arrayloop:for (var i = 0; i < array.length; i++) {
                    var temp = array[i];
                    for (var j = 0; j < temp.length; j++) {
                        var tv = parseInt(temp[j]);
                        if(ArrayUtil.indexOf(hasCheck,tv) >= 0 ){
                            continue;
                        }
                        var voArray = [];
                        voArray.push(this.copyMJDef(jingCards[0]));
                        voArray.push(this.copyMJDef(lastMJ));
                        if(jingCards.length >= 2 && count == 0){
                            j--;
                            count++;
                            voArray.push(this.copyMJDef(jingCards[1]));
                        }else if(tv!=n){
                            hasCheck.push(tv);
                            for (var m = 0; m < l; m++) {
                                var vo = MJOnHands[m];
                                if (vo.t == t && vo.n == tv && vo.i != jingCards[0].i) {
                                    voArray.push(this.copyMJDef(vo));
                                    break;
                                }
                            }
                        }
                        if (voArray.length == 3 && ArrayUtil.indexOf(result,voArray) < 0) {
                            var chi = ArrayUtil.clone(voArray);
                            result.push(chi);
                        }
                    }
                }
            }
        }
        return result;
    },

    getGang:function(allMJs,place2MJs,action){
        var result = [];
        var tempMap = {};

        allMJs = ObjectUtil.deepCopy(allMJs);

        for (var i = 0; i < allMJs.length; i++) {
            var vo = allMJs[i];
            var prefix = vo.t + "_" + vo.n;
            if (tempMap[prefix]) {
                tempMap[prefix].push(vo);
            } else {
                tempMap[prefix] = [vo];
            }
            if (tempMap[prefix].length > 3)
                result.push(tempMap[prefix]);
        }
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                var gang = result[i];
                for (var j = 0; j < gang.length; j++) {
                    if((action == XPLPAction.GANG) || (action == XPLPAction.AN_GANG)){
                        gang[j].se = XPLPAction.AN_GANG;
                    }else{
                        gang[j].se = 14;//暗补
                    }
                    var index = XPLPAI.findIndexByMJVoC(allMJs, gang[j].c);
                    if (index >= 0) {
                        allMJs.splice(index, 1);
                    }
                }
            }
        }

        //第二次杠或补张时，去除掉已经杠或补的牌
        var tempMap2 = {};
        var tempArr = [];
        for (var i = 0; i < place2MJs.length; i++) {
            var vo = place2MJs[i];
            var prefix = vo.t + "_" + vo.n;
            if (tempMap2[prefix]) {
                tempMap2[prefix].push(vo);
            } else {
                tempMap2[prefix] = [vo];
            }
            if (tempMap2[prefix].length > 3)
                tempArr.push(tempMap2[prefix]);
        }
        if(tempArr.length > 0){
            for (var i = 0; i < tempArr.length; i++) {
                var gang = tempArr[i];
                for (var j = 0; j < gang.length; j++) {
                    var index = XPLPAI.findIndexByMJVoC(place2MJs, gang[j].c);
                    if (index >= 0) {
                        place2MJs.splice(index, 1);
                    }
                }
            }
        }

        //排除掉已经吃的牌
        var needMjs = [];
        for(var i = 2;i<place2MJs.length;++i){
            if(place2MJs[i].i == place2MJs[i-1].i && place2MJs[i].i == place2MJs[i-2].i) {
                needMjs.push(place2MJs[i - 2]);
                needMjs.push(place2MJs[i - 1]);
                needMjs.push(place2MJs[i]);
                i+=2;
            }
        }

        allMJs = needMjs.concat(allMJs);
        var tempMap = {};
        var result2 = [];
        for(var i=0;i<allMJs.length;i++){
            var vo = allMJs[i];
            var prefix = vo.t+"_"+vo.n;
            //未摆叫禁牌不能杠(可以暗杠)
            if(vo.jinDisplay && ArrayUtil.indexOf(XPLPRoomModel.tingSeats, XPLPRoomModel.mySeat) < 0){
                continue;
            }
            if(tempMap[prefix]){
                tempMap[prefix].push(vo);
            }else{
                tempMap[prefix] = [vo];
            }
            if(tempMap[prefix].length>3)
                result2.push(tempMap[prefix]);
        }

        for (var i = 0; i < result2.length; i++) {
            var gang = result2[i];
            for (var j = 0; j < gang.length; j++) {
                gang[j].se = action;
            }
        }

        return result.concat(result2);
    },

    arrangeSelect : function(data,target, k, allResult) {
        var copyData;
        var copyTarget;
        if(target.length == k) {
            allResult.push(target);
        }
        for(var i=0; i<data.length; i++) {
            copyData = ArrayUtil.clone(data);
            copyTarget = ArrayUtil.clone(target);
            copyTarget.push(copyData[i]);
            copyData.splice(i,1);
            this.arrangeSelect(copyData, copyTarget, k, allResult);
        }
    },

    fuPaiMap: {
        1:[
            [301,311,321],
            [301,321,331],
            [301,311,331],
            [311,321,331]
        ],
        2:[
            [201,211,221]
        ],
        3:[
            [201,211,221],//中发白
            [201,221,11],//中白一
            [201,211,11],//中发一
            [211,221,11]//发白一
        ],
        4:[
            [18,28,38],//八条八筒八万
            [18,38,201],//八条八万红中
            [18,28,201],//八条八筒红中
            [28,38,201]//八筒八万红中
        ],
        5:[
            [12,22,32],//二条二筒二万
            [12,32,221],//二条二万白板
            [12,22,221],//二条二筒白板
            [22,32,221]//二筒二万白板
        ]
    },

    arrangeHSFMap:{},
    arrangeZFBMap:{},
    arrangeZFBJMap:{},
    arrange3839Map:{},
    arrange3231Map:{},

    initData: function() {
        //黑三风的排列
        for(var i=1;i<=4;i++) {
            var paiLie = [];
            this.arrangeSelect(this.fuPaiMap[1],[],i,paiLie);
            this.arrangeHSFMap[i] = paiLie;

            var paiLie1 = [];
            this.arrangeSelect(this.fuPaiMap[3],[],i,paiLie1);
            this.arrangeZFBJMap[i] = paiLie1;

            var paiLie2 = [];
            this.arrangeSelect(this.fuPaiMap[4],[],i,paiLie2);
            this.arrange3839Map[i] = paiLie2;

            var paiLie3 = [];
            this.arrangeSelect(this.fuPaiMap[5],[],i,paiLie3);
            this.arrange3231Map[i] = paiLie3;
        }
        var paiLie = [];
        this.arrangeSelect(this.fuPaiMap[2],[],1,paiLie);
        this.arrangeZFBMap[1] = paiLie;
    },
}
