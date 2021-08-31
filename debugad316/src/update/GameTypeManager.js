//Ⅰ、Ⅱ、Ⅲ、Ⅳ、Ⅴ、Ⅵ、Ⅶ、Ⅷ、Ⅸ、Ⅹ

//字牌
var GameTypeEunmZP = {
    SYZP:32,    //邵阳字牌
    SYBP:33,    //邵阳剥皮
    WHZ:228,    //岳阳歪胡子
    LDS:229,    //落地扫
    YZCHZ:230,  //永州扯胡子
    HYSHK:194,  //衡阳十胡卡
    ZHZ:196,    //捉红字
    LYZP:197,   //耒阳字牌
    CZZP:198,   //郴州字牌
    LDFPF:199,  //娄底放炮罚
    HYLHQ:226,  //衡阳六胡抢
    XTPHZ:235,  //湘潭跑胡子
    XXGHZ:236,  //湘乡告胡子
    XXPHZ:237,  //湘乡跑胡子
    AHPHZ:238,  //安化跑胡子
    NXPHZ:246,  //宁乡跑胡子
    GLZP:245, //桂林字牌
    LSZP:192,//蓝山字牌
    HBGZP:247,//湖北个子牌
    ZZPH:250,//株洲碰胡
    YJGHZ:39,//沅江鬼胡子
    SMPHZ:300,  //石门跑胡子
    HSPHZ:249,  //汉寿跑胡子
    CDPHZ:53,   //常德跑胡子
    HHHGW:252,   //怀化红拐弯
    XXEQS:800,  //湘西2710
    NXGHZ:801,  //南县鬼胡子
    YZLC:301,   //永州老戳
    YYWHZ:802,  //益阳歪胡子
    DYBP:803,   //大余剥皮
    WCPHZ:266,//望城跑胡子
    AXWMQ:254,//安乡偎麻雀
    XPLP:805,//溆浦老牌
    XPPHZ:521,//溆浦碰胡子
    JHSWZ:281,//江永十五张
}
//麻将
var GameTypeEunmMJ = {
    AHMJ:4,     //安化麻将
    ZZMJ:220,   //转转麻将
    HZMJ:221,   //红中麻将
    CSMJ:222,   //长沙麻将
    JZMJ:270,   //靖州麻将
    BSMJ:225,   //保山麻将
    TDH:227,    //推倒胡麻将
    SYMJ:223,   //邵阳麻将
    YZWDMJ:193,  //王钓麻将

    GDCSMJ:261,//广东潮汕麻将
    TJMJ:260,//桃江麻将
    YJMJ:6,//沅江麻将
    CXMJ:191,//楚雄麻将
    TCMJ:262,//通城麻将
    NXMJ:248,//宁乡麻将
    KWMJ:189,//开王麻将
    DHMJ:239,//德宏麻将
    NYMJ:263,//宁远麻将
    TCPFMJ:188,//桐城跑风麻将
    TCDPMJ:187,//桐城点炮麻将
    DZMJ:251,//道州麻将
	YYMJ:265,//益阳麻将	
    YYNXMJ:186,//南县麻将
    CQXZMJ:185,//重庆血战麻将
    ZOUMJ:253,//郑州麻将
    ZJMJ:804,//芷江麻将
}
//扑克
var GameTypeEunmPK = {
    PDKI:15,    //15张跑得快
    PDKII:16,   //16张跑得快
    PDK11:11,   //11张跑的快
    XTSDH:231,  //湘潭三打哈
    XTBP:256,   //新田包牌
    DT:232,     //掂坨
    NSB:255,    //牛十别
    YYBS:257,   //益阳巴十
    TCGD:258,   //桐城掼蛋
    HSTH:259,   //衡山同花
    ERDDZ:264,  //二人斗地主
    CDTLJ:271,  //常德拖拉机
    ZZPDK:184,  //郑州跑的快

    DTZI:113,
    DTZII:114,
    DTZIII:115,
    DTZIV:116,
    DTZV:117,
    DTZVI:118,
    DTZVII:210,
    DTZVIII:211,
    DTZIX:212,

    QF:190,//沅江千分
    WZQ:1000,//五子棋

}


var GameTypeManager = {
    hasLoadGameTypes:[],
    MjDetail:[
        {
            gameType:[GameTypeEunmMJ.CSMJ,GameTypeEunmMJ.TDH,GameTypeEunmMJ.TJMJ,GameTypeEunmMJ.GDCSMJ,GameTypeEunmMJ.YZWDMJ,
                GameTypeEunmMJ.SYMJ,GameTypeEunmMJ.ZZMJ,GameTypeEunmMJ.BSMJ,GameTypeEunmMJ.YJMJ,GameTypeEunmMJ.HZMJ,
                GameTypeEunmMJ.AHMJ,GameTypeEunmMJ.CXMJ,GameTypeEunmMJ.TCMJ,GameTypeEunmMJ.NXMJ,GameTypeEunmMJ.KWMJ,
                GameTypeEunmMJ.DHMJ,GameTypeEunmMJ.NYMJ,GameTypeEunmMJ.TCPFMJ,GameTypeEunmMJ.TCDPMJ,GameTypeEunmMJ.DZMJ,
                GameTypeEunmMJ.CQXZMJ,GameTypeEunmMJ.YYNXMJ,GameTypeEunmMJ.YYMJ,GameTypeEunmMJ.JZMJ,GameTypeEunmMJ.ZJMJ,GameTypeEunmMJ.ZOUMJ
            ],
            projectPath:"res/project_mj.manifest",
            jsListPath:"src/src_mj/jsList.js"
        },
    ],

    ZpDetail:[
        {
            gameType:[GameTypeEunmZP.SYZP,GameTypeEunmZP.SYBP,GameTypeEunmZP.WHZ,GameTypeEunmZP.LDS,GameTypeEunmZP.YZCHZ,GameTypeEunmZP.HYSHK,
                GameTypeEunmZP.ZHZ,GameTypeEunmZP.LYZP,GameTypeEunmZP.CZZP,GameTypeEunmZP.LDFPF,GameTypeEunmZP.HYLHQ,GameTypeEunmZP.XTPHZ,
                GameTypeEunmZP.XXGHZ,GameTypeEunmZP.XXPHZ,GameTypeEunmZP.AHPHZ,GameTypeEunmZP.NXPHZ,GameTypeEunmZP.GLZP,GameTypeEunmZP.LSZP,
                GameTypeEunmZP.HBGZP,GameTypeEunmZP.ZZPH,GameTypeEunmZP.YJGHZ,GameTypeEunmZP.SMPHZ,GameTypeEunmZP.HSPHZ,GameTypeEunmZP.CDPHZ,
                GameTypeEunmZP.XXEQS,GameTypeEunmZP.NXGHZ,GameTypeEunmZP.YZLC,GameTypeEunmZP.HHHGW,GameTypeEunmZP.YYWHZ,GameTypeEunmZP.DYBP,
                GameTypeEunmZP.WCPHZ,GameTypeEunmZP.AXWMQ,GameTypeEunmZP.XPLP,GameTypeEunmZP.JHSWZ],
            projectPath:"res/project_phz.manifest",
            jsListPath:"src/src_phz/jsList.js"
        }
    ],

    PkDetail:[
        {
            gameType:[GameTypeEunmPK.PDKI,GameTypeEunmPK.PDKII,GameTypeEunmPK.PDK11,GameTypeEunmPK.ZZPDK],
            projectPath:"res/project_pdk.manifest",
            jsListPath:"src/src_pdk/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.XTSDH,GameTypeEunmPK.XTBP],
            projectPath:"res/project_sdh.manifest",
            jsListPath:"src/src_sdh/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.DT],
            projectPath:"res/project_diantuo.manifest",
            jsListPath:"src/src_diantuo/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.NSB],
            projectPath:"res/project_nsb.manifest",
            jsListPath:"src/src_nsb/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.YYBS],
            projectPath:"res/project_yybs.manifest",
            jsListPath:"src/src_yybs/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.TCGD],
            projectPath:"res/project_tcgd.manifest",
            jsListPath:"src/src_tcgd/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.HSTH],
            projectPath:"res/project_hsth.manifest",
            jsListPath:"src/src_hsth/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.ERDDZ],
            projectPath:"res/project_erddz.manifest",
            jsListPath:"src/src_erddz/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.CDTLJ],
            projectPath:"res/project_cdtlj.manifest",
            jsListPath:"src/src_cdtlj/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.DTZI,GameTypeEunmPK.DTZII,GameTypeEunmPK.DTZIII,GameTypeEunmPK.DTZIV,GameTypeEunmPK.DTZV,GameTypeEunmPK.DTZVI
                ,GameTypeEunmPK.DTZVII,GameTypeEunmPK.DTZVIII,GameTypeEunmPK.DTZIX],
            projectPath:"res/project_dtz.manifest",
            jsListPath:"src/src_dtz/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.QF],
            projectPath:"res/project_yjqf.manifest",
            jsListPath:"src/src_yjqf/jsList.js"
        },
        {
            gameType:[GameTypeEunmPK.WZQ],
            projectPath:"res/project_wzq.manifest",
            jsListPath:"src/src_wzq/jsList.js"
        },
    ],

    isZP:function(_type){
        var ret = false;
        for(var key in GameTypeEunmZP){
            if(GameTypeEunmZP[key] == _type){
                ret = true;
                break;
            }
        }
        return ret;
    },

    isMJ:function(_type){
        var ret = false;
        for(var key in GameTypeEunmMJ){
            if(GameTypeEunmMJ[key] == _type){
                ret = true;
                break;
            }
        }
        return ret;
    },

    isPK:function(_type){
        var ret = false;
        for(var key in GameTypeEunmPK){
            if(GameTypeEunmPK[key] == _type){
                ret = true;
                break;
            }
        }
        return ret;
    },

    getGameInfo:function(_type){
        var info = null;
        if (!_type){
            return info;
        }
        if (this.isZP(_type)){
            if (this.ZpDetail){
                for (var i = 0;i < this.ZpDetail.length && !info;i++){
                    var zpData = this.ZpDetail[i];
                    for (var j = 0;j < zpData.gameType.length && !info;j++){
                        if (_type == zpData.gameType[j]){
                            info = zpData;
                        }
                    }
                }
            }
        }else if (this.isMJ(_type)){
            if (this.MjDetail){
                for (var i = 0;i < this.MjDetail.length && !info;i++){
                    var mjData = this.MjDetail[i];
                    for (var j = 0;j < mjData.gameType.length && !info;j++){
                        if (_type == mjData.gameType[j]){
                            info = mjData;
                        }
                    }
                }
            }
        }else if (this.isPK(_type)){
            if (this.PkDetail){
                for (var i = 0;i < this.PkDetail.length && !info;i++){
                    var pkData = this.PkDetail[i];
                    for (var j = 0;j < pkData.gameType.length && !info;j++){
                        if (_type == pkData.gameType[j]){
                            info = pkData;
                        }
                    }
                }
            }
        }
        return info;
    },

    pushLoadGametype : function(_gameType){
        this.hasLoadGameTypes.push(_gameType);
    },

    isLoadJsList : function(_gameType){
        var _gameType = _gameType || 0;
        if (ArrayUtil.indexOf(this.hasLoadGameTypes,_gameType) != -1){
            return true
        }
        return false
    },

    clearData : function(){

    },
};