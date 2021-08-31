/**
 * Created by zhoufan on 2016/7/22.6
 */
/**
 * 房间player的数据映射
 * @type {{userId: number, name: string, seat: number, sex: number, icon: string, point: number, status: number, ip: string}}
 */
var RoomPlayerVo = {
    userId:0,
    name:0,
    seat:0,
    sex:0,
    icon:"",
    point:0,
    status:0,
    handCardIds:null,
    outCardIds:null,
    recover:null,
    ip:"",
    outedIds:null,
    moldIds:null,
    moldCards:null,
    huCards:null,
    ext:[]
};
/**
 * 麻将的数据映射
 * @type {{t: number, n: number, i: number, c: number, m: number, g: number, a: number, se: number, ids: Array, dan: number}}
 */
var MJVo = {
    t:0, //花色
    n:0, //数字
    i:0, //大小排序
    c:0, //后台索引,
    m:0, //是否是摸牌
    g:0, //是否是杠
    a:0,  //是否是暗杠
    se:0, //是否用作选牌,
    ids:[],//用作吃牌时的吃牌IDs,
    dan:0,//长春麻将，蛋的数量
    jt:0,//甘肃麻将，胡的牌的箭头显示
    jinDisplay:0,//用作禁牌显示
    tingDisplay:0,//用作听牌显示
    feiDisplay:0,//用作飞牌显示
    huDisplay:0//用作胡牌显示
};

var MJAction = {
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
}

//每次新加的玩法
var NewAddWanfa = {
    TYPE : 1,
}

var WWMajiangConstants = {
    ShiSanYaoVals : [11,19,21,29,31,39,201,211,221,301,311,321,331]
}

var QAConstants = {
    /* 听牌方式 砍报 二报 不吃*/
    TING_KANBAO : 1,
    TING_ERBAO : 2,
    TING_BUCHI : 3,
    /* 张数：0无限制  1八长   2硬八页   3九长  4 硬九页   5三五六页    6 二五七页   7 十一页长    8硬十一页*/
    ZS_NORMAL : 1,
    ZS_BACHANG : 2,
    ZS_YINGBAYE : 3,
    ZS_JIUCHANG : 4,
    ZS_YINGJIUYE : 5,
    ZS_SANWULIUYE : 6,
    ZS_ERWUQIYE : 7,
    ZS_SHIYIYECHANG : 8,
    ZS_YINGSHIYIYE : 9,
    /*将类型： 0任意一对做将 1二五八做将  2四副将*/
    JIANG_NORMAL : 1,
    JIANG_258 :2,
    JIANG_SIFUJIANG : 3,
    /* 花色类型：0无 1花三副 2花四副 3清混 4清缺 5硬混*/
    HUASE_NORMAL : 1,
    HUASE_HUASANFU : 2,
    HUASE_HUASIFU : 3,
    HUASE_QINGHUN : 4,
    HUASE_QINGQUE : 5,
    HUASE_YINGHUN : 6,
    /* 亮站扣类型：0无 1亮四飞一 2 站四飞一 3站八页 4站九飞一 5扣四页 6扣八页*/
    ZLK_NORMAL : 1,
    ZLK_LIANGSIFEIYI : 2,
    ZLK_ZHANSIFEIYI : 3,
    ZLK_ZHANBAYE : 4,
    ZLK_ZHANJIUFEIYI : 5,
    ZLK_KOUSIYE : 6,
    ZLK_KOUBAYE : 7,
    /* 风牌类型： 1不要风(带风 胡牌必须无风 风牌不能碰杠) 2要风（带风 风牌可做将 做砍） 3三风 4六风*/
    FENG_NOFENG : 1,
    FENG_YAOFENG : 2,
    FENG_SANFENG : 3,
    FENG_LIUFENG : 4,
    /* 特殊玩法类型：1硬中五  2悄悄胡  3亮断 */
    YingZhongWu : 1,
    LiangDuan : 3,
    fengZFBVals:[201,211,221,301,311,321,331],
    fengVals:[301,311,321,331],
    shiSanYaoVals:[11,19,21,29,31,39,201,211,221,301,311,321,331]
}


/**
 * 长春麻将下蛋类型
 * @type {{DONG_NAN_XI_BEI: number, ZHONG_FA_BAI: number, YI_YI_YI: number, JIU_JIU_JIU: number, BU_YI_TIAO: number}}
 */
var MJDanType = {
    DONG_NAN_XI_BEI:1,
    ZHONG_FA_BAI:2,
    YI_YI_YI:3,
    JIU_JIU_JIU:4,
    BU_YI_TIAO:-1
}

var MJFuPaiType = {
    FENG_SAN_YAO: 1,
    FENG_SAN_JIU: 2,
    FENG_SAN_ZFB: 3,
    FENG_SAN_YAOJIU: 4,
    FENG_SAN_YAO_ZFB: 5,
    FENG_SAN_JIU_ZFB: 6,
    ZFB_JDF:7,
    SAN_YAO_ZFB:8,
    FENG_JDF:9,
    SAN_JIU_ZFBJ:10,
    FENG_JDK:11,
    HZD_3938:12,
    BBD_3231:13,
    ZFB_XJF:14
}

var MJJiangType = {
    JIANG_NONE: 1,
    JIANG_147: 2,
    JIANG_258: 3,
    JIANG_369: 4
}


var MJJiangLeiType = {
    YING_JIANG_258: 1,
    RUAN_JIANG_258: 2,
    JIANG_LEI_NONE: 3,
    YING_JIANG_369: 4,
    RUAN_JIANG_369: 5
}

//乱将 147将 258将 369将
var LZEBJiangLeiType = {
    JIANG_LEI_NONE: 1,
    YING_JIANG_147: 2,
    YING_JIANG_258: 3,
    YING_JIANG_369: 4
}


/**
 * 麻将的展示数据
 * @type {{direct: number, place: number}}
 */
var MJDisplayVo = {
    direct:0,
    place:0
}

/**
 *
 * @type {{curPutOutVo: vo, curCheckNum: number,curCheckResult:Array,curHandCards:Array,hasCheckedPutOut:Array,checkHuMJAI:Array,needPushOutVo:Array,clean:Function}}
 */
var MJCheckStage = {
    curPutOutVo:null,
    curCheckNum:0,
    curCheckResult:[],
    curHandCards:[],
    hasCheckedPutOut:[],
    checkHuMJAI:[],
    needPushOutVo:[]
}

MJCheckStage.clean = function(){
    MJCheckStage.curPutOutVo = null;
    MJCheckStage.curCheckNum = 0;
    MJCheckStage.curCheckResult.length = 0;
    MJCheckStage.curCheckResult.length = 0;
    MJCheckStage.curHandCards.length = 0;
    MJCheckStage.hasCheckedPutOut.length = 0;
    MJCheckStage.checkHuMJAI.length = 0;
    MJCheckStage.needPushOutVo.length = 0;
}

// 麻将子 11 条  21 筒 31 万
var MJAI = {
    MJ_NUMBER:13,
    LANZHOU_CHECK_NUMS:20,
    DEFAULT_CHECK_NUMS:20,
    BAIJIAO_CHECK_NUMS:27,
    NOFENG_CHECK_NUMS:14,
    SIGOYI_CARD : {t:0,n:0,i:1000,c:0},
    MJ:[
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

        if (MJRoomModel.isGSMJ() || MJRoomModel.isGuCang()) {
            if (MJRoomModel.isFuPaiVo(mj2) && !MJRoomModel.isFuPaiVo(mj1)) {
                return 1;
            }
            if (MJRoomModel.isFuPaiVo(mj1) && !MJRoomModel.isFuPaiVo(mj2)) {
                return -1;
            }
            if (MJRoomModel.isFeiPaiVo(mj1) && MJRoomModel.isFeiPaiVo(mj2)) {
                //noting to do
            }else {
                if (MJRoomModel.isFeiPaiVo(mj2) && !MJRoomModel.isFuPaiVo(mj1)) {
                    return 1;
                }
                if (MJRoomModel.isFeiPaiVo(mj1) && !MJRoomModel.isFuPaiVo(mj2)) {
                    return -1;
                }
            }
        }else if(MJRoomModel.isHuiPai() || MJRoomModel.isHSMJ() || MJRoomModel.isJNMJ() || MJRoomModel.isJQTJ() || MJRoomModel.isLZFJ()){
            if (MJRoomModel.isHuiPaiVo(mj1) && !MJRoomModel.isHuiPaiVo(mj2)) {
                return -1;
            }else if (!MJRoomModel.isHuiPaiVo(mj1) && MJRoomModel.isHuiPaiVo(mj2)) {
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
        if (MJRoomModel.isFuPaiVo(mj2) && !MJRoomModel.isFuPaiVo(mj1)) {
            return -1;
        }
        if (MJRoomModel.isFuPaiVo(mj1) && !MJRoomModel.isFuPaiVo(mj2)) {
            return 1;
        }
        if (MJRoomModel.isFeiPaiVo(mj1) || MJRoomModel.isFeiPaiVo(mj2)) {
            return -1;
        }else {
            if (MJRoomModel.isFeiPaiVo(mj2) && !MJRoomModel.isFuPaiVo(mj1)) {
                return -1;
            }
            if (MJRoomModel.isFeiPaiVo(mj1) && !MJRoomModel.isFuPaiVo(mj2)) {
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
        if(inner1.action==MJAction.XIA_DAN && inner2.action==MJAction.XIA_DAN){
            if(inner2.huxi==-1)
                return -1;
            return 0;
        }
        var seq = {};
        seq[MJAction.XIA_DAN] = 1;
        seq[MJAction.AN_GANG] = 2;
        seq[MJAction.GANG] = 3;
        seq[MJAction.PENG] = 4;
        seq[MJAction.CHI] = 5;
        seq[MJAction.BAI_JIAO] = 6;
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
        for(var i=0;i<this.MJ.length;i++){
            var card = this.MJ[i];
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
        for(var i=0;i<this.MJ.length;i++){
            var card = this.MJ[i];
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

    /**
     *
     * @param MJOnHands {Array.<MJVo>}
     * @param lastMJ {MJVo}
     */
    getChi:function(MJOnHands,lastMJ){
        var first_wang = 0;
        var second_wang = 0;
        if (MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ){
            if (MJRoomModel.ahmj_wangID && MJRoomModel.ahmj_wangID != -1){
                var cardVo = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
                if (MJRoomModel.intParams[4] == 1){//四王
                    first_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;
                }else{
                    if (MJRoomModel.intParams[4] == 2){//七王
                        first_wang = (cardVo.n )>9?(cardVo.n )%9:cardVo.n ;;
                        second_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;;
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
                    if ((s != first_wang && s!= second_wang) || lastMJ.t != MJAI.getMJDef(MJRoomModel.ahmj_wangID).t )
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
            if(jingCards.length > 0 && MJRoomModel.getDaiJingChiByPL()) {
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
                    if((action == MJAction.GANG) || (action == MJAction.AN_GANG)){
                        gang[j].se = MJAction.AN_GANG;
                    }else{
                        gang[j].se = 14;//暗补
                    }
                    var index = MJAI.findIndexByMJVoC(allMJs, gang[j].c);
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
                    var index = MJAI.findIndexByMJVoC(place2MJs, gang[j].c);
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
            if(vo.jinDisplay && ArrayUtil.indexOf(MJRoomModel.tingSeats, MJRoomModel.mySeat) < 0){
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

    /**
     *
     * @param voArray {Array.<MJVo>}
     */
    findDanType:function(voArray){
        var patterns = this.danPatterns;
        var mjVo = voArray[0];
        var type = 0;
        patternsLoop:for(var i=0;i<patterns.length;i++){
            var pattern = patterns[i].pat;
            patternLoop:for(var j=0;j<pattern.length;j++){
                var pat = pattern[j];
                if(pat.t==mjVo.t && pat.n==mjVo.n){
                    type = patterns[i].type;
                    break patternLoop;
                }
            }
            if(type!=0)
                break patternsLoop;
        }
        return type;
    },

    /**
     *
     * @param data1
     * @param huBean
     * @returns {*}
     */
    isTingPai:function(data1,huBean,isMoPai){
        var a = new Date().getTime();
        var hu = new MajiangSmartFilter();
        var list = hu.checkTing(data1,huBean,isMoPai);
        cc.log("isTingPai cost time::"+(new Date().getTime()-a));
        return list;
    },

    isTingPaiLNMJ: function(data1,huBean,copy) {
        var a = new Date().getTime();
        var hu = new LNMajiangSmartFilter();
        var list = hu.checkTing(data1,huBean,copy);
        cc.log("isTingPai cost time::"+(new Date().getTime()-a));
        return list;
    },

    isHu:function(handCards,huBean){
        var hu = new LNMajiangSmartFilter();
        var length = handCards.length;
        var curCount = 0;
        var hasChecked = [];
        var list = false;
        while(curCount<length){
            var copy = ArrayUtil.clone(handCards);
            var pushOut = copy.splice(curCount,1);
            var pushOutVo = pushOut[0];
            var checkedIndex = MJAI.findIndexByMJVoI(hasChecked,pushOutVo.i);
            if(checkedIndex < 0) {
                hasChecked.push(pushOutVo);
                list = hu.judgeHu(copy,huBean);
                if(list){
                    return true;
                }
            }
            curCount++;
        }
        return false;
    },

    isBaiPaiLNMJ:function(baiArray,huArray){
        var hu = new LNMajiangSmartFilter();
        var huBeanCopy = new MajiangHuBean();
        var array = [];
        for(var j=0;j<huArray.length;j++) {
            var cardArray = [];
            var huCard = huArray[j].huMjAI;
            cardArray = ArrayUtil.clone(baiArray);
            cardArray.push(huCard);
            huBeanCopy.setHuVal(huArray[j].huMjAI.i);
            var list = hu.judgeHu(cardArray, huBeanCopy);
            if(list){
                array.push(huCard);
            }
        }
        return array;
    },

    getMjOnBaseFu: function(type) {
        switch (type) {
            case MJFuPaiType.FENG_SAN_YAO:
            case MJFuPaiType.FENG_SAN_JIU:
            case MJFuPaiType.FENG_SAN_ZFB:
            case MJFuPaiType.FENG_SAN_YAOJIU:

                break;
        }
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

    getFuPaiArrange: function(arrange, fuType) {
        var list = [];
        switch (fuType) {
            case MJFuPaiType.ZFB_JDF:
            case MJFuPaiType.SAN_YAO_ZFB://中发白只有一种组合
            case MJFuPaiType.ZFB_XJF:
                list = this.arrangeZFBMap[1];
                break;
            case MJFuPaiType.SAN_JIU_ZFBJ:
                list = this.arrangeZFBJMap[arrange];
                break;
            case MJFuPaiType.HZD_3938:
                list = this.arrange3839Map[arrange];
                break;
            case MJFuPaiType.BBD_3231:
                list = this.arrange3231Map[arrange];
                break;
            default :
                list = this.arrangeHSFMap[arrange];
                break;
        }
        return list;
    },

    getJiangDefList: function(jiang) {
        var list = [];
        switch (jiang) {
            case MJJiangType.JIANG_NONE:
                break;
            case MJJiangType.JIANG_147:
                list = [11,21,31,14,24,34,17,27,37];
                break;
            case MJJiangType.JIANG_258:
                list = [12,22,32,15,25,35,18,28,38];
                break;
            case MJJiangType.JIANG_369:
                list = [13,23,33,16,26,36,19,29,39];
                break;
        }
        return list;
    },

    /**
     * 将IndexsArray中存在的TargetArray元素删除
     * @param IndexsArray {Array.<MJVo>}
     * @param TargetArray
     * @returns {*}
     */
    delIndexsArrayInTarget:function(IndexsArray,TargetArray){
        var indexs = [];
        for (var i = 0; i < IndexsArray.length; i++) {
            for (var j = 0; j < TargetArray.length; j++) {
                if (TargetArray[j].c == IndexsArray[i].c) {
                    if (ArrayUtil.indexOf(indexs, j) < 0)
                        indexs.push(j);
                }
            }
        }
        ArrayUtil.sortNumerically(indexs);
        for (var j = indexs.length - 1; j >= 0; j--) {
            TargetArray.splice(indexs[j], 1);
        }
        return TargetArray;
    },

    /**
     * 通用的mjVo打印
     * @param voArray
     * @returns {string}
     */
    voArrayToString: function(voArray) {
        var cloned = ArrayUtil.clone(voArray);
        //cloned.sort(this.sortMJ);
        var string = "";
        for (var i=0;i<cloned.length;i++) {
            var mjVo = cloned[i];
            string += mjVo.i+",";
        }
        string = string.substr(0,string.length-1);
        return string;
    },
}
