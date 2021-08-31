/**
 * Created by Administrator on 2017/7/21.
 */
//记录俱乐部战绩一些数据
var ClubRecallModel = {
    data: null,
    isShowRecord: false,
    clubId:0,
    clubRole:0,
    init: function (data) {
        this.data = data;
        this.isShowRecord = false;
        this.clubId = 0;
        this.clubRole = 0;
    },
}
//记录俱乐部战绩详情一些数据
var ClubRecallDetailModel = {
    data: null,
    isShowRecord: false,
    renLength:0,
    init: function (data) {
        this.data = data;
        this.isShowRecord = false;
        this.renLength = 0;
    },

    /**
     * wanfaList 玩法数组
     * isNotGame 不需要显示游戏类型
    *返回玩法
     */

    getWanfaStr:function(wanfaList,isNotGame,isInTabel,isGoldRoom){
        var createPara = wanfaList.split(",");
        // cc.log("createPara", JSON.stringify(createPara));
        var wanfaStr = this.getSpecificWanfa(createPara,isNotGame,isInTabel,isGoldRoom);
        return wanfaStr;
    },

    getSpecificWanfa:function(wanfaList,isNotGame,isInTabel,isGoldRoom){
        //cc.log("wanfaList::getBBTWanfa"+wanfaList);
        var wanfaStr = "";
        var wanfa = wanfaList[1];
        if(this.isPHZWanfa(wanfa)){
            if(wanfa == GameTypeEunmZP.LDFPF){
                wanfaStr = this.getLDFPFWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.CZZP){
                wanfaStr = this.getCZZPWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.LYZP){
                wanfaStr = this.getLYZPWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.ZHZ){
                wanfaStr = this.getZHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.XPPHZ) {
                wanfaStr = this.getXPPHZWanfa(wanfaList, isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.WHZ){
                wanfaStr = this.getWHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.LDS){
                wanfaStr = this.getLDSWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.YZCHZ){
                wanfaStr = this.getYZCHZWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.HYLHQ){
                wanfaStr = this.getHYLHQWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.HYSHK){
                wanfaStr = this.getHYSHKWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.XTPHZ){
                wanfaStr = this.getXTPHZWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.XXGHZ){
                wanfaStr = this.getXXGHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.XXPHZ){
                wanfaStr = this.getXXPHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.AHPHZ) {
                wanfaStr = this.getAHPHZWanfa(wanfaList, isNotGame);
            }else if (wanfa == GameTypeEunmZP.GLZP){
                wanfaStr = this.getGLZPWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.NXPHZ){
                wanfaStr = this.getNXPHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.YJGHZ){
                wanfaStr = this.getYJGHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.ZZPH){
                wanfaStr = this.getZZPHWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.LSZP){
                wanfaStr = this.getLSZPWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.SMPHZ){
                wanfaStr = this.getSMPHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.CDPHZ){
                wanfaStr = this.getCDPHZWanfa(wanfaList,isNotGame,isGoldRoom);
            }else if (wanfa == GameTypeEunmZP.HHHGW){
                wanfaStr = this.getHHHGWWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.AXWMQ){
                wanfaStr = this.getAXWMQWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.HSPHZ){
                wanfaStr = this.getHSPHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.XXEQS){
                wanfaStr = this.getXXEQSWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.NXGHZ){
                wanfaStr = this.getNXGHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.YZLC){
                wanfaStr = this.getYZLCWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.YYWHZ){
                wanfaStr = this.getYYWHZWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.DYBP){
                wanfaStr = this.getDYBPWanfa(wanfaList,isNotGame);
            }else if (wanfa == GameTypeEunmZP.WCPHZ) {
                wanfaStr = this.getWCPHZWanfa(wanfaList, isNotGame);
            }else if (wanfa == GameTypeEunmZP.XPLP) {
                wanfaStr = this.getXPLPWanfa(wanfaList, isNotGame);
            }else if (wanfa == GameTypeEunmZP.JHSWZ){
                wanfaStr = this.getJHSWZWanfa(wanfaList,isNotGame,isGoldRoom);
            }else{
                wanfaStr = this.getPHZWanfa(wanfaList,isNotGame,isGoldRoom);
            }
        }else if(this.isDTZWanfa(wanfa)){
            wanfaStr = this.getDTZWanfa(wanfaList,isNotGame,isGoldRoom);
        }else if(this.isPDKWanfa(wanfa)){
            wanfaStr = this.getPDKWanfa(wanfaList,isNotGame,isGoldRoom);
        }else if(this.isHZMJWanfa(wanfa)){
            wanfaStr = this.getHZMJWanfa(wanfaList,isNotGame,isGoldRoom);
        }else if(this.isBSMJWanfa(wanfa)){
            wanfaStr = this.getBSMJWanfa(wanfaList,isNotGame);
        }else if(this.isZZMJWanfa(wanfa)){
            wanfaStr = this.getZZMJWanfa(wanfaList,isNotGame,isGoldRoom);
        }else if(this.isCSMJWanfa(wanfa)){
            wanfaStr = this.getCSMJWanfa(wanfaList,isNotGame,isInTabel,isGoldRoom);
        }else if(this.isTJMJWanfa(wanfa)){
            wanfaStr = this.getTJMJWanfa(wanfaList,isNotGame);
        }else if(this.isTCMJWanfa(wanfa)){
            wanfaStr = this.getTCMJWanfa(wanfaList,isNotGame);
        }else if(this.isNXMJWanfa(wanfa)){
            wanfaStr = this.getNXMJWanfa(wanfaList,isNotGame);
        }else if(this.isTDHWanfa(wanfa)){
            wanfaStr = this.getTDHWanfa(wanfaList,isNotGame);
        }else if(this.isSYMJWanfa(wanfa)){
            wanfaStr = this.getSYMJWanfa(wanfaList,isNotGame);
        }else if(this.isYZWDMJWanfa(wanfa)){
            wanfaStr = this.getYZWDMJWanfa(wanfaList,isNotGame);
        }else if(this.isAHMJWanfa(wanfa)){
            wanfaStr = this.getAHMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.YJMJ){
            wanfaStr = this.getYJMJWanfa(wanfaList, isNotGame);
        }else if(wanfa == GameTypeEunmMJ.GDCSMJ){
            wanfaStr = this.getGDCSMJWanfa(wanfaList,isNotGame);
        }else if(this.isCXMJWanfa(wanfa)){
            wanfaStr = this.getCXMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.XTSDH){
            wanfaStr = this.getXTSDHWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.DT){
            wanfaStr = this.getDTWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.NSB){
            wanfaStr = this.getNSBWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.YYBS){
            wanfaStr = this.getYYBSWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.CDTLJ){
            wanfaStr = this.getCDTLJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.TCGD){
            wanfaStr = this.getTCGDWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.HSTH){
            wanfaStr = this.getHSTHWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.ERDDZ){
            wanfaStr = this.getERDDZWanfa(wanfaList,isNotGame,isGoldRoom);
        }else if(wanfa == GameTypeEunmPK.QF){
           wanfaStr = this.getQFWanfa(wanfaList,isNotGame);
        }else if (wanfa == GameTypeEunmZP.HBGZP){
            wanfaStr = this.getHBGZPWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.DHMJ){
            wanfaStr = this.getDHMJWanfa(wanfaList, isNotGame);
        }else if(wanfa == GameTypeEunmMJ.KWMJ){
            wanfaStr = this.getKWMJWanfa(wanfaList, isNotGame);
        }else if(wanfa == GameTypeEunmPK.XTBP){
            wanfaStr = this.getXTBPWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.NYMJ){
            wanfaStr = this.getNYMJWanfa(wanfaList, isNotGame);
        }else if(wanfa == GameTypeEunmMJ.TCPFMJ){
            wanfaStr = this.getTCPFMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.TCDPMJ){
            wanfaStr = this.getTCDPMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.DZMJ){
            wanfaStr = this.getDZMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.ZOUMJ){
            wanfaStr = this.getZOUMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.JZMJ){
            wanfaStr = this.getJZMJWanfa(wanfaList,isNotGame);
		}else if(wanfa == GameTypeEunmMJ.YYMJ){
            wanfaStr = this.getYYMJWanfa(wanfaList, isNotGame);
        }else if(wanfa == GameTypeEunmMJ.YYNXMJ){
            wanfaStr = this.getYYNXMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.CQXZMJ){
            wanfaStr = this.getCQXZMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.WZQ){
            wanfaStr = this.getWZQWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmMJ.ZJMJ){
            wanfaStr = this.getZJMJWanfa(wanfaList,isNotGame);
        }else if(wanfa == GameTypeEunmPK.ZZPDK){
            wanfaStr = this.getZZPDKWanfa(wanfaList,isNotGame);
        }

        //cc.log("wanfaStr==="+wanfaStr);
        return wanfaStr;
    },

    getXPLPWanfa:function(wanfaList,isNotGame){
        var gameStr = "溆浦老牌 ";
        var costStr = "";
        if(wanfaList[2] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr += "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var jushuStr = wanfaList[0] +  "局 ";
        var renshuStr = wanfaList[7] +  "人 ";
        var zhuangStr = "";
        if(wanfaList[3] == 1){
            zhuangStr = "庄闲 ";
        }
        var guchouStr = "";
        if(wanfaList[4] == 1){
            guchouStr = "箍臭 ";
        }
        if(wanfaList[5] == 1){
            guchouStr += "吃碰后不出同张 ";
        }
        if(wanfaList[6] == 1){
            guchouStr += "不带花 ";
        }
        if(wanfaList[8] == 1){
            guchouStr += "有胡必胡 ";
        }
        if(wanfaList[15] == 1){
            guchouStr += "只准自摸胡 ";
        }
        if(wanfaList[20] != 0){
            if(wanfaList[20] == 5){
                guchouStr += "可冲分 ";
            }else{
                guchouStr += "必冲" + wanfaList[20] + "分 ";
            }
        }else{
            guchouStr += "不可冲分 ";
        }
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[11] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[11] + "张 ";
            }
            if(wanfaList[12] && wanfaList[12] > 0){
                fanbeiStr = "低于"+wanfaList[13]+"分，翻"+ wanfaList[14] + "倍 ";
            }
            if(wanfaList[22] && wanfaList[21] && wanfaList[22] != 0 && wanfaList[21] != 0){
                fanbeiStr += "低于" + wanfaList[22]  + "分加" +  wanfaList[21] + "分 ";
            }
        }
        var tuoguanStr = "";
        if(wanfaList[9] != 0){
            if(wanfaList[19] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[19] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[19] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr = "不托管 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr = csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr,guchouStr,
            choupaiStr,tuoguanStr, fanbeiStr);
        return allStr;
    },

    getWCPHZWanfa:function(wanfaList,isNotGame){
        var gameStr = "望城跑胡子 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr += "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var jushuStr = wanfaList[0] +  "局 ";
        var renshuStr = wanfaList[7] +  "人 ";
        var zhuangStr = wanfaList[16] == 0 ? "臭牌臭庄 " : "臭牌不臭庄 ";
        var huStr = "30胡"+wanfaList[17]+ "牌 ";
        var zimoStr = wanfaList[18] == 0 ? "自摸不加分 " : "自摸+1牌 ";
        var jiafenStr = "30胡息以上见1+"+wanfaList[19] + "分 ";
        var piaofenStr = wanfaList[20] == 0 ? "不飘 " : "自由飘 ";
        var zuopiaoStr = wanfaList[21] == 0 ? "不坐飘 " : ("坐飘" + wanfaList[21]+" ");
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }
        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr = "不托管 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}{12}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr,huStr,
            zimoStr,jiafenStr,piaofenStr,zuopiaoStr,choupaiStr,tuoguanStr, fanbeiStr);
        return allStr;
    },

    getWZQWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        //if(!isNotGame)infoArr.push("五子棋");
        infoArr.push(wanfaList[0] + "局");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push("倍率"+parseInt(wanfaList[8])/100);
        return infoArr.join(" ");
    },

    getYYMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("益阳麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[28] > 0){
            if(wanfaList[29] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[29] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }else{
            infoArr.push("不托管");
        }

        infoArr.push("抓"+ wanfaList[4] +"鸟");

        if(wanfaList[13] == 0){
            infoArr.push("不封顶");
        }else{
            infoArr.push(wanfaList[13] +"分封顶");
        }

        if(wanfaList[8] == "1")infoArr.push("一字撬有喜");
        if(wanfaList[11] == "1")infoArr.push("一条龙");
        if(wanfaList[16] == "1"){
            infoArr.push("门清");
            if(wanfaList[14] == "1")infoArr.push("门清将将胡接炮");
        }

        if(wanfaList[12] != 0){
            infoArr.push("流局未听牌罚"+ wanfaList[12] +"分");
        }

        if (wanfaList[7] == 2 && wanfaList[19] == 1){
            infoArr.push("低于" + wanfaList[20] + "分翻" + wanfaList[21] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[34] && parseInt(wanfaList[34]) > 0){
            infoArr.push("低于"+ (wanfaList[35] || 10) + "分，加"+wanfaList[34]+"分 ");
        }

        return infoArr.join(" ");
    },


    /***
     *  南县鬼胡子
     * @param wanfaList
     * @param isNotGame
     */

    getNXGHZWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("南县鬼胡子");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付 ");

        infoArr.push(wanfaList[16] == 1?"大卓版":"小卓版");
        if(wanfaList[17] == 1){
            infoArr.push("背靠背");
        }
        if(wanfaList[18] == 1) {
            infoArr.push("手牵手");
        }

        if(wanfaList[7] == 2){
            if(wanfaList[15] > 0)infoArr.push("抽牌" + wanfaList[15] +"张");
            else infoArr.push("不抽底牌");
        }

        var tuoguanStr = "";
        if (wanfaList[8] != 0) {
            if (wanfaList[9] == 1) {
                tuoguanStr = "单局托管";
            } else if (wanfaList[9] == 2) {
                tuoguanStr = "整局托管";
            } else if (wanfaList[9] == 3) {
                tuoguanStr = "三局托管";
            }
        } else {
            tuoguanStr += "不托管";
        }
        infoArr.push(tuoguanStr)

        if (wanfaList[7] == 2 && wanfaList[10] == 1){
            infoArr.push("低于" + wanfaList[11] + "分翻" + wanfaList[12] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[13] && parseInt(wanfaList[13]) > 0){
            infoArr.push("低于"+ (wanfaList[14] || 10) + "分，加"+wanfaList[13]+"分 ");
        }

        return infoArr.join(" ");
    },

    /***
     *  益阳歪胡子
     * @param wanfaList
     * @param isNotGame
     */

    getYYWHZWanfa:function(wanfaList,isNotGame){
        cc.log("wanfaStr===",JSON.stringify(wanfaList));
        var infoArr = [];
        if(!isNotGame)infoArr.push("益阳歪胡子");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付 ");

        infoArr.push(wanfaList[19]+"息");
        infoArr.push(wanfaList[3] == 0 ? "不封顶":("封顶:" + (wanfaList[3]) + "息"));
        if(wanfaList[16] == 1){
            infoArr.push("大小字胡");
        }
        if(wanfaList[17] == 1) {
            infoArr.push("天胡报听");
        }
        if(wanfaList[18] == 1) {
            infoArr.push("名堂");
        }
        if(wanfaList[7] == 2){
            if(wanfaList[15] > 0)infoArr.push("抽牌" + wanfaList[15] +"张");
            else infoArr.push("不抽底牌");
        }
        if(wanfaList[20] == 1) {
            infoArr.push("只可吃摸的牌");
        }
        var tuoguanStr = "";
        if (wanfaList[8] != 0) {
            if (wanfaList[9] == 1) {
                tuoguanStr = "单局托管";
            } else if (wanfaList[9] == 2) {
                tuoguanStr = "整局托管";
            } else if (wanfaList[9] == 3) {
                tuoguanStr = "三局托管";
            }
        } else {
            tuoguanStr += "不托管";
        }
        infoArr.push(tuoguanStr)

        if (wanfaList[7] == 2 && wanfaList[10] == 1){
            infoArr.push("低于" + wanfaList[11] + "分翻" + wanfaList[12] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[13] && parseInt(wanfaList[13]) > 0){
            infoArr.push("低于"+ (wanfaList[14] || 10) + "分，加"+wanfaList[13]+"分 ");
        }

        return infoArr.join(" ");
    },

    getYZLCWanfa:function(wanfaList,isNotGame){
        var gameStr = "永州老戳 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr += "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var jushuStr = wanfaList[0] +  "局 ";
        var renshuStr = wanfaList[7] +  "人 ";
        var zimoStr = wanfaList[17]+"戳 ";
        if(wanfaList[18] == 1){
            zimoStr += "见红加分 ";
        }
        if(wanfaList[19] == 1){
            zimoStr += "起胡2分 ";
        }
        if(wanfaList[20] == 1){
            zimoStr += "红戳4番 ";
        }
        if(wanfaList[21] == 1){
            zimoStr += "番戳 ";
        }
        var choupaiStr = wanfaList[16] == 0?"曲戳 ":"定戳 ";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }
        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr = "不托管 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}",
            gameStr,costStr,jushuStr,
            renshuStr,zimoStr,tuoguanStr,choupaiStr,fanbeiStr);
        return allStr;
    },

    /**
     *  石门跑胡子玩法
     * @param wanfaList
     * @param isNotGame
     * @returns {*|String}
     */
    getSMPHZWanfa:function(wanfaList,isNotGame){
        var gameStr = "石门跑胡子 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr += "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var jushuStr = wanfaList[0] +  "局 ";
        var renshuStr = wanfaList[7] +  "人 ";
        var zhuangStr = wanfaList[15] == 0 ? "随机坐庄 " : "先进房坐庄 ";
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }
        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr += "不托管 ";
        }
        var wanfaStr = "";
        if(wanfaList[18] == 0){
            wanfaStr += "不封顶 ";
        }else{
            wanfaStr += wanfaList[18]+"封顶 ";
        }

        wanfaStr += "底分:"+wanfaList[45]+" ";

        if(wanfaList[17] == 2){
            wanfaStr += "小六八番 ";
        }else if(wanfaList[17] == 1){
            wanfaStr += "大六八番 ";
        }

        wanfaStr += wanfaList[16] == 1 ? "全名堂 " : "土炮胡 ";

        if(wanfaList[16] == 0 && wanfaList[19] == 1){
            wanfaStr += "对子胡 ";
        }

        if(wanfaList[16] == 1 && wanfaList[20] == 1){
            wanfaStr += "团胡 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr,wanfaStr,
            tuoguanStr, choupaiStr,fanbeiStr);
        return allStr;
    },
    /***
     *  湘西2710
     * @param wanfaList
     * @param isNotGame
     */
    getXXEQSWanfa:function(wanfaList,isNotGame){
        var gameStr = "湘西2710 ";

        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }

        var jushuStr = wanfaList[0] + "局 ";
        var renshuStr = wanfaList[7] + "人 ";

        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[11] == 0){
                choupaiStr = "不抽底牌 ";
            }else{
                choupaiStr = "抽牌" + wanfaList[11] + "张 ";
            }
            if(wanfaList[21] > 0){
                fanbeiStr = "低于"+wanfaList[22]+"分，翻"+ wanfaList[23] + "倍 ";
            }
            if(wanfaList[16] && wanfaList[17] && wanfaList[16] != 0 && wanfaList[17] != 0){
                fanbeiStr += "低于" + wanfaList[16]  + "分加" +  wanfaList[17] + "分 ";
            }
        }

        var tuoguanStr = "";
        if(wanfaList[20] != 0){
            if(wanfaList[24] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[24] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[24] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr += "不托管 ";
        }

        var zhuangfenStr = wanfaList[12] == 0 ? "无庄分 " : ("庄分" + wanfaList[12] + " ");

        var wanfaStr = "";
        if(wanfaList[13] == 1){
            wanfaStr += "自摸加1分 ";
        }
        if(wanfaList[14] == 1){
            wanfaStr += "自摸红字加1分 ";
        }
        if(wanfaList[15] == 1){
            wanfaStr += "充分 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangfenStr, wanfaStr,choupaiStr,
            tuoguanStr,fanbeiStr);

        return allStr;
    },

    getCDPHZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var gameStr = "常德跑胡子 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr += "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var jushuStr = wanfaList[0] +  "局 ";
        var renshuStr = wanfaList[7] +  "人 ";
        var zhuangStr = wanfaList[15] == 1 ? "首局随机坐庄 " : "";
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }
        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr += "不托管 ";
        }
        var wanfaStr = "";
        if(wanfaList[18] == 0){
            wanfaStr += "不封顶 ";
        }else{
            wanfaStr += wanfaList[18]+"封顶 ";
        }

        wanfaStr += "底分:"+wanfaList[45]+" ";

        if(wanfaList[17] == 2){
            wanfaStr += "小六八番 ";
        }else if(wanfaList[17] == 1){
            wanfaStr += "大六八番 ";
        }

        if(wanfaList[16] == 1)wanfaStr+="全名堂 ";
        else if(wanfaList[16] == 2)wanfaStr+="红黑点 ";
        else if(wanfaList[16] == 3)wanfaStr += "多红多黑 ";


        if(wanfaList[20] == 1)wanfaStr += "大团圆 ";
        if(wanfaList[19] == 1)wanfaStr += "行行息 ";
        if(wanfaList[21] == 1)wanfaStr += "假行行 ";
        if(wanfaList[22] == 1)wanfaStr += "四七红 ";
        if(wanfaList[31] == 1)wanfaStr += "听胡 ";
        if(wanfaList[32] == 1)wanfaStr += "耍猴 ";
        if(wanfaList[33] == 1)wanfaStr += "海胡 ";
        if(wanfaList[34] == 1)wanfaStr += "背靠背 ";
        if(wanfaList[35] == 1)wanfaStr += "亮张 ";
        if(wanfaList[36] == 1)wanfaStr += "三提五坎 ";

        if(wanfaList[42] == 1)wanfaStr += "天地胡 ";
        if(wanfaList[37] == 1)wanfaStr += "红黑胡 ";
        if(wanfaList[38] == 1)wanfaStr += "点胡 ";
        if(wanfaList[39] == 1)wanfaStr += "大小字胡 ";
        if(wanfaList[40] == 1)wanfaStr += "对子胡 ";
        if(wanfaList[41] == 1)wanfaStr += "黄番 ";


        if (isNotGame){
            gameStr = "";
        }

        if (isGoldRoom){
            costStr = "";
            tuoguanStr = "";
            renshuStr = "";
            jushuStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr,wanfaStr,
            tuoguanStr, choupaiStr,fanbeiStr);
        return allStr;
    },

    getHHHGWWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("怀化红拐弯");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[7] == 2 && wanfaList[3] > 0){
            infoArr.push("抽牌" + wanfaList[3] + "张");
        }

        if(wanfaList[4] == 1)infoArr.push("15胡可自摸");
        if(wanfaList[5] == 1)infoArr.push("自摸加一囤");
        if(wanfaList[6] == 1)infoArr.push("自摸2番");

        if(wanfaList[8] == 1){
            infoArr.push("红拐弯(234)");

            if(wanfaList[9] == 2)infoArr.push("天胡5番");
            else infoArr.push("天胡4番");
            if(wanfaList[10] == 2)infoArr.push("地胡4番");
            else infoArr.push("地胡3番");
            if(wanfaList[11] == 2)infoArr.push("碰碰胡5番");
            else infoArr.push("碰碰胡4番");
            if(wanfaList[12] == 2)infoArr.push("18大5番起");
            else infoArr.push("18大4番起");
            if(wanfaList[13] == 2)infoArr.push("16小5番起");
            else infoArr.push("16小4番起");

            if(wanfaList[14] == 1)infoArr.push("乌胡5番");
            if(wanfaList[15] == 1)infoArr.push("点胡3番");
            if(wanfaList[16] == 1)infoArr.push("海底胡2番");
            if(wanfaList[17] == 1)infoArr.push("红胡2番起");


        }else {
            infoArr.push("红拐弯(468)");

            if(wanfaList[9] == 1)infoArr.push("天胡8番");
            if(wanfaList[10] == 1)infoArr.push("地胡6番");
            if(wanfaList[11] == 1)infoArr.push("碰碰胡8番");
            if(wanfaList[12] == 1)infoArr.push("18大8番起");
            if(wanfaList[13] == 1)infoArr.push("16小8番起");
            if(wanfaList[14] == 1)infoArr.push("乌胡8番");
            if(wanfaList[15] == 1)infoArr.push("点胡6番");
            if(wanfaList[16] == 1)infoArr.push("海底胡6番");
            if(wanfaList[17] == 1)infoArr.push("红胡4番起");
        }



        if(wanfaList[18] > 0){
            if(wanfaList[19] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[19] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[20] == 1){
            infoArr.push("低于" + wanfaList[21] + "分翻" + wanfaList[22] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[23] && parseInt(wanfaList[23]) > 0){
            infoArr.push("低于"+ (wanfaList[23] || 10) + "分，加"+wanfaList[24]+"分 ");
        }

        return infoArr.join(" ");
    },

    getAXWMQWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("安乡偎麻雀");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 2)infoArr.push("小卓版");
        else if(wanfaList[3] == 3)infoArr.push("大卓版");
        else if(wanfaList[3] == 4)infoArr.push("全名堂版");
        else if(wanfaList[3] == 5)infoArr.push("钻石版");
        else infoArr.push("老名堂版");

        if(wanfaList[7] == 2 && wanfaList[4] > 0)infoArr.push("起胡胡息:" + wanfaList[4]);
        if(wanfaList[7] == 2 && wanfaList[5] > 0)infoArr.push("底牌数:" + wanfaList[5]);

        if(wanfaList[6] > 0)infoArr.push("逗:" + wanfaList[6]);

        if(wanfaList[3] == 2 || wanfaList[3] == 3){

            if(wanfaList[11] == 1)infoArr.push("项对");
            if(wanfaList[12] == 1)infoArr.push("飘对");
            if(wanfaList[13] == 1)infoArr.push("龙摆尾");
            if(wanfaList[14] == 1)infoArr.push("全求人");
            if(wanfaList[15] == 1)infoArr.push("活捉小三");
            if(wanfaList[16] == 1)infoArr.push("上下五千年");

        }

        if(wanfaList[18] > 0){
            if(wanfaList[19] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[19] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[20] == 1){
            infoArr.push("低于" + wanfaList[21] + "分翻" + wanfaList[22] +"倍");
        }

        if(wanfaList[7] == 2 && parseInt(wanfaList[23]) > 0){
            infoArr.push("低于"+ (wanfaList[23] || 10) + "分，加"+wanfaList[24]+"分 ");
        }

        return infoArr.join(" ");
    },

    getDHMJWanfa:function(wanfaList,isNotGame){
        var wanfaStr = "尚未配置好";
        if(wanfaList[2] == 1){
            wanfaStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            wanfaStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            wanfaStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            wanfaStr = "";
        }
        wanfaStr = wanfaStr + wanfaList[3] +"人 ";
        wanfaStr = wanfaStr + wanfaList[0] +"局 ";
        if (wanfaList[10] == 1){
            wanfaStr = wanfaStr + "查叫 ";
        }else if (wanfaList[10] == 2){
            wanfaStr = wanfaStr + "查大叫 ";
        }
        if (wanfaList[13] == 1){
            wanfaStr = wanfaStr + "带根，翻屁股 ";
        }
        var tuoguanStr = "";
        if (wanfaList[11] != 0){
            if (wanfaList[12]){
                tuoguanStr = "整局托管 ";
                if (wanfaList[12] == 1){
                    tuoguanStr = "单局托管 ";
                }else  if (wanfaList[12] == 3){
                    tuoguanStr = "三局托管 ";
                }
            }else{
                tuoguanStr = "可托管 ";
            }
        }
        if(wanfaList[3] == 2){
            if(wanfaList[14] == 1){
                wanfaStr = wanfaStr + "低于" + wanfaList[15] + "分翻" + wanfaList[16] +"倍 " ;
            }
            if(wanfaList[17] && parseInt(wanfaList[17]) > 0){
                wanfaStr = wanfaStr + "低于"+ (wanfaList[18] || 10) + "分，加"+wanfaList[17]+"分 ";
            }
        }
        wanfaStr = wanfaStr + tuoguanStr;
        var nameList = ["不买点","买死点上限1","买死点上限2","买点固定1点","买点固定2点"];
        var MaiDianStr = nameList[wanfaList[9]] || "";
        wanfaStr = wanfaStr + MaiDianStr;

        return wanfaStr;
    },

    getKWMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("开王麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 1){
            infoArr.push("大胡不封顶");
        }else{
            infoArr.push("大胡三番封顶");
        }

        if(wanfaList[4] == 1){
            infoArr.push("开单王");
        }else{
            infoArr.push("开双王");
        }

        if(wanfaList[5] > 0){
            infoArr.push("抓" + wanfaList[5] + "鸟");

            if(wanfaList[6] == 1){
                infoArr.push("中鸟翻倍");
            }else{
                infoArr.push("中鸟加分");
            }

        }else{
            infoArr.push("不抓鸟");
        }

        if(wanfaList[8] == 1)infoArr.push("只能自摸胡");

        if(wanfaList[9] == 1)infoArr.push("飘分");

        if (wanfaList[7] == 2 && wanfaList[5] > 0){
            if(wanfaList[18]==1){
                infoArr.push("13579中鸟");
            }else{
                infoArr.push("全中鸟");
            }
        }

        if(wanfaList[10] > 0){
            infoArr.push("坐压" + wanfaList[10] + "分");
        }

        if(wanfaList[11] > 0){
            if(wanfaList[12] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[12] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[13] == 1){
            infoArr.push("低于" + wanfaList[14] + "分翻" + wanfaList[15] +"倍");
        }

        if (wanfaList[7] == 2 && wanfaList[16] && wanfaList[16] != 0){
            infoArr.push("低于" + wanfaList[17] + "分加" + wanfaList[16] +"分");
        }

        return infoArr.join(" ");
    },

    /**
     * 湘潭跑胡子玩法
     * @param wanfaList
     * @param isNotGame
     * @returns {*|String}
     */
    getXTPHZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var gameStr = "湘潭跑胡子 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr += "群主支付 ";
        }
        
        var jushuStr = wanfaList[0] +  "局 ";
        var renshuStr = wanfaList[7] +  "人 ";
        if (isGoldRoom) {
            costStr = "";
            jushuStr = "";
            renshuStr = "";
        }
        var zhuangStr = wanfaList[15] == 0 ? "随机坐庄 " : "先进房坐庄 ";
        var weipaiStr = wanfaList[16] == 1 ? "明偎 " : "暗偎 ";
        var qihuStr = wanfaList[30] + "息起胡 ";
        var StrArr = ["1息1囤 ","3息1囤 "];
        var huxiStr = StrArr[parseInt(wanfaList[13]) - 1];
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }
        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr += "不托管 ";
        }
        if (isGoldRoom) {
            tuoguanStr = "";
        }
        var wanfaStr = "";
        if(wanfaList[11] == 1){
            if(wanfaList[44] == 13){
                wanfaStr += "红黑胡(13红) ";
            }else{
                wanfaStr += "红黑胡(10红) ";
            }
        }
        if(wanfaList[12] == 100){
            wanfaStr += "100分封顶 ";
        }else if(wanfaList[12] == 200){
            wanfaStr += "200分封顶 ";
        }
        if(wanfaList[17] == 1){
            wanfaStr += "2番封顶 ";
        }else if(wanfaList[17] == 2){
            wanfaStr += "4番封顶 ";
        }
        if(wanfaList[17] == 0 && wanfaList[12] == 0){
            wanfaStr += "不封顶 ";
        }
        if(wanfaList[31] == 1){
            wanfaStr += "自摸加番 ";
        }
        if(wanfaList[32] == 1){
            wanfaStr += "一五十 ";
        }
        if(wanfaList[33] == 1){
            wanfaStr += "30胡翻倍 ";
        }
        if(wanfaList[35] == 1){
            wanfaStr += "一点红 ";
        }
        if(wanfaList[36] == 1){
            wanfaStr += "天地胡 ";
        }
        if(wanfaList[37] == 1){
            wanfaStr += "大小字 ";
        }
        if(wanfaList[38] == 1){
            wanfaStr += "碰碰胡 ";
        }
        if(wanfaList[18] == 1){
            wanfaStr += "株洲计分 ";
        }
        if(wanfaList[19] == 1){
            wanfaStr += "自摸加3胡 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr,weipaiStr,
            qihuStr,huxiStr,wanfaStr,tuoguanStr,
            choupaiStr,fanbeiStr);
        return allStr;
    },

    getXPPHZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var infoArr = [];
        if(!isNotGame)infoArr.push("溆浦跑胡子");

        if(!isGoldRoom){
            infoArr.push(wanfaList[7] + "人");
            infoArr.push(wanfaList[0] + "局");
            if(!ClickClubModel.getClubIsGold())
            infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        }

        if(wanfaList[4] == 1){
            infoArr.push("1-2-3");
        }else if(wanfaList[4] == 2){
            infoArr.push("2-4-6");
        }else if(wanfaList[4] == 3){
            infoArr.push("3-6-9");
        }

        if(wanfaList[5] != 0){
            infoArr.push("冲"+wanfaList[5]*2);
        }else{
            infoArr.push("不冲");
        }


        if(wanfaList[6] == 1)infoArr.push("箍臭");

        if(wanfaList[8] > 0){
            if(wanfaList[9] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[9] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }


        if (wanfaList[7] == 2 ){
            if(wanfaList[3] == 0){
                infoArr.push("不抽牌");
            }else{
                infoArr.push("抽" + wanfaList[3] + "张");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[10] == 1){
            infoArr.push("低于" + wanfaList[11] + "分翻" + wanfaList[12] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[14] && parseInt(wanfaList[14]) > 0){
            infoArr.push("低于"+ (wanfaList[13] || 10) + "分，加"+wanfaList[14]+"分 ");
        }

        return infoArr.join(" ");
    },
    /***
     *  宁乡跑胡子
     * @param wanfaList
     * @param isNotGame
     */
    getNXPHZWanfa:function(wanfaList,isNotGame){
        var gameStr = "宁乡跑胡子 ";

        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }

        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var jushuStr = wanfaList[0] + "局 ";
        var renshuStr = wanfaList[7] + "人 ";

        var zhuangStr = wanfaList[15] == 0 ? "随机坐庄 " : "先进房坐庄 ";
        var qihuStr = wanfaList[30] + "息起胡 ";
        var choupaiStr = "";
        var fanbeiStr = "";
        var zimoStr = "不加倍 ";

        if(wanfaList[31] != 0){
            if(parseInt(wanfaList[31]) > 0){
                zimoStr = "加" + wanfaList[31] + "分";
            }else{
                zimoStr = "自摸翻倍";
            }
        }
        var zhaniaoStr = "不扎鸟 ";
        if(wanfaList[34] != 0){
            zhaniaoStr = "扎"+ wanfaList[34] +"鸟 ";
        }
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] > 0){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }

        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr += "不托管 ";
        }

        var wanfaStr = "";
        if(wanfaList[32] == 1){
            wanfaStr += "海底胡 ";
        }
        if(wanfaList[37] == 1){
            wanfaStr += "十六小 ";
        }
        if(wanfaList[37] == 2){
            wanfaStr += "十八小 ";
        }
        if(wanfaList[38] == 1){
            wanfaStr += "加红加小加大 ";
        }
        if(wanfaList[33] == 1){
            wanfaStr += "有胡必胡 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr, qihuStr,
            zimoStr,zhaniaoStr, wanfaStr,
            tuoguanStr, choupaiStr, fanbeiStr);

        return allStr;
    }, 
      /***
     *  汉寿跑胡子
     * @param wanfaList
     * @param isNotGame
     */
        getHSPHZWanfa:function(wanfaList,isNotGame) {
        var gameStr = "汉寿跑胡子 ";

        var costStr = "";
        if (wanfaList[2] == 1) {
            costStr = "AA支付 ";
        } else if (wanfaList[2] == 2) {
            costStr = "房主支付 ";
        } else if (wanfaList[2] == 3) {
            costStr = "群主支付 ";
        }
          if (ClickClubModel.getClubIsGold()) {
              costStr = "";
          }

        var jushuStr = wanfaList[0] + "局 ";
        var renshuStr = wanfaList[7] + "人 ";

        var choupaiStr = "";
        var fanbeiStr = "";
            if (wanfaList[24] > 0) {
                fanbeiStr = "低于" + wanfaList[25] + "分，翻" + wanfaList[26] + "倍 ";
            }
            if (wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0) {
                fanbeiStr += "低于" + wanfaList[46] + "分加" + wanfaList[47] + "分 ";
            }

        var tuoguanStr = "";
        if (wanfaList[23] != 0) {
            if (wanfaList[27] == 1) {
                tuoguanStr = "单局托管 ";
            } else if (wanfaList[27] == 2) {
                tuoguanStr = "整局托管 ";
            } else if (wanfaList[27] == 3) {
                tuoguanStr = "三局托管 ";
            }
        } else {
            tuoguanStr += "不托管 ";
        }

        var wanfaStr = "";
        //wanfaStr += wanfaList[48] +"倍 "
        wanfaStr += "倒分：" + wanfaList[49] + " "
        wanfaStr += wanfaList[50] == 1 ? "单局封顶20分 " : "无封顶 "
        wanfaStr += "底牌" + (wanfaList[14] == 0 ? "19张 " : wanfaList[14] == 1 ? "24张 " : "39张 ")

        if (isNotGame) {
            gameStr = "";
        }

        var allStr = csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}",
            gameStr, costStr, jushuStr,
            renshuStr,wanfaStr,
            tuoguanStr, choupaiStr, fanbeiStr);

        return allStr;
    },

    getYJGHZWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("沅江鬼胡子");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        infoArr.push("封顶:" + (wanfaList[3]) + "息");
        infoArr.push(wanfaList[4] == 1?"可飘":"不可飘");
        infoArr.push("无息平:" + (wanfaList[5] == 1?"有":"没有"));
        infoArr.push("吊吊手:" + (wanfaList[6] == 1?"有":"没有"));

        if(wanfaList[7] == 2){
            if(wanfaList[15] > 0)infoArr.push("埋" + wanfaList[15] +"张");
            else infoArr.push("不埋牌");
        }

        if (wanfaList[7] == 2 && wanfaList[10] == 1){
            infoArr.push("低于" + wanfaList[11] + "分翻" + wanfaList[12] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[13] && parseInt(wanfaList[13]) > 0){
            infoArr.push("低于"+ (wanfaList[14] || 10) + "分，加"+wanfaList[13]+"分 ");
        }

        return infoArr.join(" ");
    },
    
    getHBGZPWanfa: function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("湖北个子牌");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        infoArr.push(wanfaList[22]+"个子起胡");
        infoArr.push(wanfaList[23] == 1 ? "十个花" : "溜花");
        infoArr.push(wanfaList[24] == 0 ? "不跑" : wanfaList[24] == 1 ? "带跑" : "定跑");
        if(wanfaList[24] == 1){
            infoArr.push("跑"+wanfaList[25]+"分");
        }
        if(wanfaList[26] == 1){
            infoArr.push("一炮多响");
        }

        if(wanfaList[8] > 0){
            if(wanfaList[21] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[21] == 2){
                infoArr.push("整局托管");
            }else if(wanfaList[21] == 3){
                infoArr.push("三局托管");
            }
        }else{
            infoArr.push("不托管");
        }

        if (wanfaList[7] == 2 && wanfaList[18] == 1){
            infoArr.push("低于" + wanfaList[19] + "分翻" + wanfaList[20] +"倍");
        }

        if (wanfaList[7] == 2 && wanfaList[27] && wanfaList[27] != 0){
            infoArr.push("低于" + wanfaList[27] + "分加" + wanfaList[28] +"分");
        }

        return infoArr.join(" ");
    },

    getGLZPWanfa:function(wanfaList,isNotGame){
        var gameStr = "桂林跑胡子 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr += "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var renshuStr = wanfaList[7] +"人 ";
        var jushuStr = wanfaList[0] +"局 ";
        var xingStr = wanfaList[10] == 1 ? "跟醒 " : "翻醒 ";
        var qihuStr = wanfaList[41] + "息起胡 ";
        var suanziStr = wanfaList[42] + "胡1子 ";
        var zimoStr = "自摸" + wanfaList[19] + "倍 ";
        if(wanfaList[19] == 1){
            zimoStr = "自摸加1 ";
        }
        var fangpaoStr = "放炮" + wanfaList[12] + "倍 ";
        var wanfaStr = "";
        if (wanfaList[37] == 1) wanfaStr += "重醒 ";
        if (wanfaList[38] == 1) wanfaStr += "上醒 ";
        if (wanfaList[39] == 1) wanfaStr += "中醒 ";
        if (wanfaList[40] == 1) wanfaStr += "下醒 ";
        if(wanfaList[27] != 0){
            if(wanfaList[28] == 2){
                wanfaStr += "整局托管 ";
            }else if(wanfaList[28] == 3){
                wanfaStr += "三局托管 ";
            }else{
                wanfaStr += "单局托管 ";
            }
        }else{
            wanfaStr += "不托管 ";
        }

        wanfaStr += wanfaList[26] == 0 ? "无鬼牌 " : "有鬼牌 ";

        if(wanfaList[7] == 2){
            if (wanfaList[23] == 0) {
                wanfaStr += "不抽牌 ";
            }else{
                wanfaStr += "抽" + wanfaList[23] + "张 ";
            }
            if (wanfaList[29] != 0) {
                wanfaStr += "低于" + wanfaList[30]  + "分翻" +  wanfaList[31] + "倍 ";
            }
            if(wanfaList[33] && wanfaList[35] && wanfaList[33] != 0 && wanfaList[35] != 0){
                wanfaStr += "低于" + wanfaList[35]  + "分加" +  wanfaList[33] + "分";
            }
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}",
            gameStr,costStr,jushuStr,
            renshuStr,xingStr,qihuStr,
            suanziStr,zimoStr,fangpaoStr,
            wanfaStr);
        return allStr;
    },
    getLSZPWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("蓝山字牌");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        // cc.log("wanfaList[10] ==",wanfaList[10]);
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[9] == 3?"群主支付":wanfaList[9] == 2?"房主支付":"AA支付");
        infoArr.push(wanfaList[10] == 1?"飘1/2/3":wanfaList[10] == 2?"飘2/3/5":"不飘");
        if(wanfaList[12] > 0){
            if(wanfaList[16] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[16] == 2){
                infoArr.push("整局托管");
            }else{
                infoArr.push("三局托管");
            }
        }else{
            infoArr.push("不托管");
        }

        if(wanfaList[7] == 2){
            if(wanfaList[11] == 0){
                infoArr.push("不抽牌");
            }else{
                infoArr.push("抽" + wanfaList[11] + "张");
            }
            if (wanfaList[13] != 0) {
                infoArr.push("低于" + wanfaList[14]  + "分翻" +  wanfaList[15] + "倍");
            }
            if(wanfaList[17] && wanfaList[18] && wanfaList[17] != 0 && wanfaList[18] != 0){
                infoArr.push("低于" + wanfaList[18]  + "分加" +  wanfaList[17] + "分");
            }
        }
        return infoArr.join(" ");
    },
    getZZPHWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var infoArr = [];
        if(!isNotGame)infoArr.push("株洲碰胡");

        if(!isGoldRoom){
            infoArr.push(wanfaList[7] + "人");
            infoArr.push(wanfaList[0] + "局");
            if(!ClickClubModel.getClubIsGold())
                infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[9] == 2?"房主支付":"AA支付");
        }

        infoArr.push(wanfaList[4] == 1?"强制胡牌":"不强制");
        infoArr.push(wanfaList[5] == 1?"先进房坐庄":"随机坐庄");
        infoArr.push(wanfaList[6] == 1?"连庄":wanfaList[6] == 2?"中庄x2":"不连庄不中庄");
        if(wanfaList[15] == 1){
            infoArr.push("打乱位置");
        }
        if(wanfaList[16] == 1){
            infoArr.push("无对");
        }
        if(wanfaList[17] == 1){
            infoArr.push("反中庄");
        }
        if(wanfaList[18] == 1){
            if(wanfaList[19]==1){
                infoArr.push("有庄有鸟");
            }else if(wanfaList[19]==2){
                infoArr.push("围鸟");
            }else if(wanfaList[19]==3){
                infoArr.push("围鸟加鸟");
            }else if(wanfaList[19]==4){
                infoArr.push("自由压鸟");
            }
        }
        infoArr.push(wanfaList[20] == 2?"小七对不带坎":"小七对带坎");

        if(!isGoldRoom){
            if(wanfaList[8] > 0){
                if(wanfaList[9] == 1){
                    infoArr.push("单局托管");
                }else if(wanfaList[9] == 2){
                    infoArr.push("整局托管");
                }else{
                    infoArr.push("三局托管");
                }
            }else{
                infoArr.push("不托管");
            }
        }


        if(wanfaList[7] == 2){
            if(wanfaList[3] == 0){
                infoArr.push("不抽牌");
            }else{
                infoArr.push("抽" + wanfaList[3] + "张");
            }

            if(!isGoldRoom){
                if (wanfaList[10] != 0) {
                    infoArr.push("低于" + wanfaList[11]  + "分翻" +  wanfaList[12] + "倍");
                }
                if(wanfaList[13] && wanfaList[14] && wanfaList[13] != 0 && wanfaList[14] != 0){
                    infoArr.push("低于" + wanfaList[13]  + "分加" +  wanfaList[14] + "分");
                }
            }

        }
        return infoArr.join(" ");
    },

    getAHPHZWanfa:function(wanfaList,isNotGame){
        var gameStr = "安化跑胡子 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr += "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr += "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr += "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var jushuStr = wanfaList[0] +  "局 ";
        var renshuStr = wanfaList[7] +  "人 ";
        var zhuangStr = wanfaList[15] == 0 ? "随机坐庄 " : "先进房坐庄 ";
        var StrArr = ["1息1囤 ","3息1囤 "];
        var huxiStr = StrArr[parseInt(wanfaList[13]) - 1];
        var zimoStr = "";
        if(wanfaList[43] == 1){
            zimoStr += "自摸翻倍";
        }
        if(wanfaList[31] == 1){
            zimoStr += "自摸加一囤";
        }
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }
        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr = "不托管 ";
        }
        var difenStr = wanfaList[45] == 1 ? "1分底":"2分底";
        var wanfaStr = "";
        if(wanfaList[41] == 1){
            wanfaStr += "三提五坎 ";
        }
        if(wanfaList[44] == 1){
            wanfaStr += "爬坡 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr,huxiStr,
            zimoStr,wanfaStr,tuoguanStr,
            difenStr,choupaiStr,fanbeiStr);
        return allStr;
    },

    getXXGHZWanfa:function(wanfaList,isNotGame){
        var gameStr = "湘乡告胡子 ";

        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }

        var jushuStr = "满百结算 ";

        var renshuStr = wanfaList[7] + "人 ";

        var zhuangStr = wanfaList[15] == 0 ? "随机坐庄 " : "先进房坐庄 ";
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }

        var datuoArr = ["不打坨 ","","","坨对坨3番 ","坨对坨4番 "];
        var datuoStr = datuoArr[parseInt(wanfaList[28])];

        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }
        }else{
            tuoguanStr = "不托管 ";
        }

        var wanfaStr = "";
        if(wanfaList[11] == 1){
            wanfaStr += "红黑胡 ";
        }
        if(wanfaList[36] == 1){
            wanfaStr += "天地胡 ";
        }
        if(wanfaList[33] == 1){
            wanfaStr += "30胡息 ";
        }
        if(wanfaList[41] == 1){
            wanfaStr += "放炮必胡 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr,datuoStr,
            wanfaStr,tuoguanStr,
            choupaiStr,fanbeiStr);

        return allStr;
    },

    getXXPHZWanfa:function(wanfaList,isNotGame){
        var gameStr = "湘乡跑胡子 ";

        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }

        var jushuStr = wanfaList[0] + "局 ";
        var renshuStr = wanfaList[7] + "人 ";

        var zhuangStr = wanfaList[15] == 0 ? "随机坐庄 " : "先进房坐庄 ";
        var jifenStr = wanfaList[29] == 1 ? "囤数计分":"胡息计分";
        var qihuStr = wanfaList[30] + "息起胡 ";
        var choupaiStr = "";
        var fanbeiStr = "";
        if(wanfaList[7] == 2){//如果是两人
            if(wanfaList[14] == 0){
                choupaiStr = "不抽牌 ";
            }else{
                choupaiStr = "抽" + wanfaList[14] + "张 ";
            }
            if(wanfaList[24] == 1){
                fanbeiStr = "低于"+wanfaList[25]+"分，翻"+ wanfaList[26] + "倍 ";
            }
            if(wanfaList[46] && wanfaList[47] && wanfaList[46] != 0 && wanfaList[47] != 0){
                fanbeiStr += "低于" + wanfaList[46]  + "分加" +  wanfaList[47] + "分 ";
            }
        }

        var tuoguanStr = "";
        if(wanfaList[23] != 0){
            if(wanfaList[27] == 1){
                tuoguanStr = "单局托管 ";
            }else if(wanfaList[27] == 2){
                tuoguanStr = "整局托管 ";
            }else if(wanfaList[27] == 3){
                tuoguanStr = "三局托管 ";
            }
        }else{
            tuoguanStr = "不托管 ";
        }

        var wanfaStr = "";
        if(wanfaList[35] == 1){
            wanfaStr += "一点红 ";
        }
        if(wanfaList[36] == 1){
            wanfaStr += "天地胡 ";
        }
        if(wanfaList[11] == 1){
            wanfaStr += "红黑胡 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var allStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}",
            gameStr,costStr,jushuStr,
            renshuStr,zhuangStr, qihuStr,
            wanfaStr,tuoguanStr, jifenStr,
            choupaiStr,fanbeiStr);

        return allStr;
    },

    getDTZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        //cc.log("wanfaList"+wanfaList);
        var gameStr = "打筒子 ";
        var costStr = "";
        var tWanfa = wanfaList[1];
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var maxScoreStr = wanfaList[3] + "分 ";

        var renshuNum = 0;
        if (tWanfa == 117 || tWanfa == 118 ||tWanfa == 210){
            renshuNum = 2;
        }else if(tWanfa == 115 || tWanfa == 116 || tWanfa == 211) {
            renshuNum = 3;
        }else if(tWanfa == 113 || tWanfa == 114 || tWanfa == 212) {
            renshuNum = 4;
        }
        var renshuStr = renshuNum + "人 ";

        var is3FuPai = (tWanfa == 113 || tWanfa == 115 || tWanfa == 117);
        var isKlsx = (tWanfa==210 || tWanfa==211 || tWanfa==212);
        var is4FuPai = (tWanfa==114 || tWanfa==116 || tWanfa==118  || tWanfa == 210 || tWanfa == 211 || tWanfa == 212);

        var fuPaiStr = "四副牌 ";
        if (is3FuPai){
            fuPaiStr = "三副牌 ";
        }else if (isKlsx){
            fuPaiStr = "快乐四喜 ";
        }
        var rewardStr = "";
        if (wanfaList[4] > 0){
            rewardStr = "奖励分" + wanfaList[4] + " ";
        }

        var darkNUmStr = "";
        if(wanfaList[5] == 1){
            var darkNumber = 8;
            if(is3FuPai){//this.wanfa == 113 || this.wanfa == 115 || this.wanfa == 117
                if(renshuNum == 4){
                    darkNumber = 8;
                }else if(renshuNum == 3){
                    darkNumber = 9;
                }else if(renshuNum == 2){
                    darkNumber = 66;
                }
            }else if(is4FuPai) {
                //四副牌
                if(renshuNum == 4){
                    darkNumber = 8;
                }else if(renshuNum == 3){
                    darkNumber = 52;
                }else if(renshuNum == 2){
                    darkNumber = 96;
                }

                if (isKlsx){
                    //四副牌
                    if(renshuNum == 4){
                        darkNumber = 0;
                    }else if(renshuNum == 3){
                        darkNumber = 44;
                    }else if(renshuNum == 2){
                        darkNumber = 88;
                    }
                }
            }
            if((wanfaList[11] && wanfaList[11] == 1) && is3FuPai && !(renshuNum == 4)){
                darkNumber = darkNumber + 6;
            }
            darkNUmStr = "暗"+darkNumber+"张牌 ";
            if (darkNumber == 0){
                darkNUmStr = "";
            }
        }

        var showCardStr = "";
        if(wanfaList[8] == 1){
            if(renshuNum == 4){
                showCardStr = "记牌器 "
            }else {
                showCardStr = "显示剩余牌 "
            }
        }

        var darkStr = "";
        if(wanfaList[9] == 1){
            darkStr = "随机出头 ";
            if (renshuNum == 4){
                darkStr = "";
            }
        }

        var bidaStr = "";
        if(wanfaList[10] == 1 && !(renshuNum == 3)){//三人默认是有牌必打 没必要显示
            bidaStr = "有牌必打 ";
        }

        var wtzStr = "";
        if(wanfaList[11] == 1){
            wtzStr = "王筒子 ";
        }

        var tuoguanStr = "";
        if(wanfaList[12] != 0){
            tuoguanStr = "可托管 ";
            if (wanfaList[15]){
                tuoguanStr = " 整局托管";
                if (wanfaList[15]==1){
                    tuoguanStr = " 单局托管";
                }
            }
        }

        if (isKlsx){
            wtzStr = "";
        }

        var kedaipai = "";
        if(wanfaList[13] == 1){
            kedaipai = "可带牌 ";
        }else{
            kedaipai = "不可带牌 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        if (isGoldRoom){
            costStr = "";
            tuoguanStr = "";
            renshuStr = "";
        }


        var wanfaStr = csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}{12}",
            gameStr,costStr,renshuStr,maxScoreStr,fuPaiStr,
            rewardStr,darkNUmStr,showCardStr,darkStr,wtzStr,
            bidaStr,tuoguanStr,kedaipai);
        wanfaStr = wanfaStr.replace(/[}。]/g , ' ');
        wanfaStr = wanfaStr.replace( / {2,}/g , ' ');
        return wanfaStr;
    },

    getDYBPWanfa:function(wanfaList,isNotGame){
        var gameStr = "大字剥皮 ";
        var limitScoreStr = "";
        var jushuStr = "局数不限 ";
        var lzStr = "";
        var hhhStr = "";
        var hxwfStr = "";
        if (wanfaList[12] == 1){
            if(wanfaList[10] == 0){
                limitScoreStr = "不封顶 ";
            }else{
                limitScoreStr = wanfaList[10] + "息封顶 ";
            }
            lzStr = "连庄 ";
        }else{
            lzStr = "不可连庄 ";
        }

        if (wanfaList[7] == 2 && wanfaList[29] && wanfaList[29] != 0) {
            lzStr = lzStr + "低于" + wanfaList[30]  + "分,加" +  wanfaList[29] + "分 ";
        }

        if (wanfaList[11] == 1){
            hhhStr += "红黑点 ";
        }
        if (wanfaList[28] == 1){
            hhhStr += "加锤 ";
        }
        if (wanfaList[33] == 1){
            hhhStr += "随机庄家 ";
        }
        hhhStr = hhhStr + (wanfaList[28] == 0 ? "不加锤 " : "加锤 ");
        hhhStr = hhhStr + wanfaList[32] + "息起胡 ";
        if(wanfaList[31] == 1){
            hhhStr = hhhStr + "天地胡加10胡,";
        }else if(wanfaList[31] == 2){
            hhhStr = hhhStr + "天地胡翻倍,";
        }else if(wanfaList[31] == 0){
            hhhStr = hhhStr + "无天地胡,";
        }
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var renshuStr = wanfaList[7] + "人 ";

        var tgStr = "";
        if (wanfaList[23] != 0){
            tgStr = "托管 ";
            if (wanfaList[27]){
                tgStr = " 整局托管";
                if (wanfaList[27]==1){
                    tgStr = " 单局托管";
                }else if (wanfaList[27]==3){
                    tgStr = " 三局托管";
                }
            }
        }

        var doubleStr = "";
        if (wanfaList[24] == 1){
            doubleStr = "低于" + wanfaList[25] + "分翻" + wanfaList[26] +"倍 " ;
        }

        if (isNotGame){
            gameStr = "";
        }

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}",gameStr,costStr,renshuStr,
            jushuStr,hxwfStr,hhhStr,lzStr,limitScoreStr,tgStr,doubleStr);
        return wanfaStr;
    },

    getPHZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var gameStr = "邵阳字牌 ";
        var limitScoreStr = "";
        var jushuStr = wanfaList[0] + "局 ";
        var lzStr = "";
        var hhhStr = "";
        var hxwfStr = "";
        if (wanfaList[1] == GameTypeEunmZP.SYBP){
            gameStr = "邵阳剥皮 ";
            jushuStr = "局数不限 ";
            if(wanfaList[0] == 1){
                jushuStr = "1局 ";
            }
            if (wanfaList[12] == 1){
                if(wanfaList[10] == 0){
                    limitScoreStr = "不封顶 ";
                }else{
                    limitScoreStr = wanfaList[10] + "息 ";
                }
                lzStr = "连庄 ";
            }else{
                lzStr = "不可连庄 ";
            }

            if (wanfaList[7] == 2 && wanfaList[29] && wanfaList[29] != 0) {
                lzStr = lzStr + "低于" + wanfaList[30]  + "分,加" +  wanfaList[29] + "分 ";
            }

            lzStr += (wanfaList[28] == 0 ? "不加锤 " : "加锤 ");

            if (wanfaList[11] == 1){
                hhhStr = "红黑胡 ";
            }
        }else if (wanfaList[1] == GameTypeEunmZP.SYZP){
            hxwfStr = wanfaList[13] + "息1囤 "
        }
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        var renshuStr = wanfaList[7] + "人 ";

        var tgStr = "";
        if (wanfaList[23] != 0){
            tgStr = "托管 ";
            if (wanfaList[27]){
                tgStr = " 整局托管";
                if (wanfaList[27]==1){
                    tgStr = " 单局托管";
                }else if (wanfaList[27]==3){
                    tgStr = " 三局托管";
                }
            }
        }

        var doubleStr = "";
        if (wanfaList[24] == 1){
            doubleStr = "低于" + wanfaList[25] + "分翻" + wanfaList[26] +"倍 " ;
        }

        if (isNotGame){
            gameStr = "";
        }

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}",gameStr,costStr,renshuStr,
            jushuStr,hxwfStr,hhhStr,lzStr,limitScoreStr,tgStr,doubleStr);
        if(isGoldRoom){
            wanfaStr = csvhelper.strFormat("{0}{1}{2}{3}{4}{5}",gameStr,
                hxwfStr,hhhStr,lzStr,limitScoreStr,doubleStr);
        }
        return wanfaStr;
    },

    getWHZWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("岳阳歪胡子");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        infoArr.push(wanfaList[4] == 1?"卡歪":"不卡歪");

        if(wanfaList[6] == 1)infoArr.push("闲家地胡");
        if(wanfaList[3] == 1)infoArr.push("胡>歪");
        if(wanfaList[8] == 1)infoArr.push("庄家地胡");
        if(wanfaList[9] == 1)infoArr.push("首轮随机庄");

        infoArr.push(wanfaList[5] == 3?"埋20张":wanfaList[5] == 2?"埋10张":"不埋牌");
        infoArr.push(wanfaList[10] == 2?"豪分20/30/40":"豪分10/20/30");
        infoArr.push(wanfaList[11] == 2?"名堂80/100/120":"名堂60/80/100");

        if(wanfaList[12] == 1)infoArr.push("飘1/2/4");
        else if(wanfaList[12] == 2)infoArr.push("飘2/3/5");

        if(wanfaList[13] > 0){
            if(wanfaList[17] == 1){
                infoArr.push("单局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[14] == 1){
            infoArr.push("低于" + wanfaList[15] + "分翻" + wanfaList[16] +"倍");
        }

        return infoArr.join(" ");
    },

    getLDSWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var infoArr = [];
        if(!isNotGame)infoArr.push("落地扫");

        if(!isGoldRoom){
            infoArr.push(wanfaList[7] + "人");
            infoArr.push(wanfaList[0] + "局");
            if(!ClickClubModel.getClubIsGold())
                infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        }


        var wangArr = ["无王","单王","双王","三王"];
        if(wangArr[wanfaList[4]]){
            infoArr.push(wangArr[wanfaList[4]]);
        }

        if(wanfaList[5] == 1)infoArr.push("翻醒");
        else infoArr.push("跟醒");

        if(wanfaList[6] == 1)infoArr.push("双醒");
        if(wanfaList[16] == 1)infoArr.push("首局随机庄");

        if(wanfaList[3] == 2)infoArr.push("无王必胡");
        else infoArr.push("放炮必胡");

        if(wanfaList[8] == 2)infoArr.push("600封顶");
        else if(wanfaList[8] == 1)infoArr.push("300封顶");
        else infoArr.push("不封顶");

        if(!isGoldRoom){
            if(wanfaList[9] > 0){
                if(wanfaList[10] == 1){
                    infoArr.push("单局托管");
                }else if(wanfaList[10] == 3){
                    infoArr.push("三局托管");
                }else{
                    infoArr.push("整局托管");
                }
            }

            if (wanfaList[7] == 2 && wanfaList[11] == 1){
                infoArr.push("低于" + wanfaList[12] + "分翻" + wanfaList[13] +"倍");
            }

            if (wanfaList[7] == 2 && wanfaList[14] && wanfaList[14] != 0) {
                infoArr.push("低于" + wanfaList[15]  + "分,加" +  wanfaList[14] + "分 ");
            }
        }

        return infoArr.join(" ");
    },

    getJHSWZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var infoArr = [];
        if(!isNotGame)infoArr.push("江永十五张");

        if(!isGoldRoom){
            infoArr.push(wanfaList[7] + "人");
            infoArr.push(wanfaList[0] + "局");
            if(!ClickClubModel.getClubIsGold())
                infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        }

        if(wanfaList[5] == 1)infoArr.push("翻醒");
        else infoArr.push("跟醒");

        if(wanfaList[8] == 2)infoArr.push("600封顶");
        else if(wanfaList[8] == 1)infoArr.push("300封顶");
        else infoArr.push("不封顶");

        if(!isGoldRoom){
            if(wanfaList[9] > 0){
                if(wanfaList[10] == 1){
                    infoArr.push("单局托管");
                }else if(wanfaList[10] == 3){
                    infoArr.push("三局托管");
                }else{
                    infoArr.push("整局托管");
                }
            }

            if (wanfaList[7] == 2 && wanfaList[11] == 1){
                infoArr.push("低于" + wanfaList[12] + "分翻" + wanfaList[13] +"倍");
            }

            if (wanfaList[7] == 2 && wanfaList[14] && wanfaList[14] != 0) {
                infoArr.push("低于" + wanfaList[15]  + "分,加" +  wanfaList[14] + "分 ");
            }
        }

        return infoArr.join(" ");
    },

    getYZCHZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var infoArr = [];
        if(!isNotGame)infoArr.push("永州扯胡子");

        if(!isGoldRoom){
            infoArr.push(wanfaList[7] + "人");
            infoArr.push(wanfaList[0] + "局");
            if(!ClickClubModel.getClubIsGold())
                infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        }


        var wangArr = ["无王","单王","双王","三王","四王"];
        if(wangArr[wanfaList[4]]){
            infoArr.push(wangArr[wanfaList[4]]);
        }

        if(wanfaList[5] == 1)infoArr.push("翻醒");
        else infoArr.push("跟醒");

        if(wanfaList[6] == 1)infoArr.push("双醒");

        if(wanfaList[3] == 1)infoArr.push("按王限胡");
        else if(wanfaList[3] == 2)infoArr.push("按番限胡");
        else infoArr.push("不限胡");

        if(wanfaList[14] == 18)infoArr.push("18胡起胡");
        else if(wanfaList[14] == 21)infoArr.push("21胡起胡");
        else infoArr.push("15胡起胡");

        if(wanfaList[15] == 1)infoArr.push("红转朱黑");

        if(wanfaList[8] == 3)infoArr.push("800封顶");
        else if(wanfaList[8] == 2)infoArr.push("600封顶");
        else if(wanfaList[8] == 1)infoArr.push("300封顶");
        else infoArr.push("不封顶");

        if(wanfaList[16] > 0){
            infoArr.push("全局" + wanfaList[16] + "封顶");
        }

        if(!isGoldRoom){
            if(wanfaList[9] > 0){
                if(wanfaList[10] == 1){
                    infoArr.push("单局托管");
                }else if(wanfaList[10] == 3){
                    infoArr.push("三局托管");
                }else{
                    infoArr.push("整局托管");
                }
            }

            if (wanfaList[7] == 2 && wanfaList[11] == 1){
                infoArr.push("低于" + wanfaList[12] + "分翻" + wanfaList[13] +"倍");
            }

            if (wanfaList[7] == 2 && wanfaList[17] &&  wanfaList[17] != 0) {
                infoArr.push("低于" + wanfaList[18]  + "分,加" +  wanfaList[17] + "分 ");
            }
        }
        return infoArr.join(" ");
    },

    getHYLHQWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var costStr = "";
        if (wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if (wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else{
            costStr = "群主支付 ";
        }
        costStr = costStr + wanfaList[7] + "人 ";

        costStr = costStr + wanfaList[0] + "局 ";
        if (isGoldRoom) {
            costStr = "";
        }
        var xingStr = "不带醒 ";
        if (wanfaList[10] == 1){
            xingStr = "跟醒 ";
        }else if (wanfaList[10] == 2){
            xingStr = "翻醒 ";
        }
        costStr = costStr + xingStr;

        if (wanfaList[11] == 1) costStr = costStr+"一息一囤 ";
        if (wanfaList[12] == 1) costStr = costStr+"一五十 ";
        if (wanfaList[13] == 1) costStr = costStr+"明偎 ";
        if (wanfaList[14] == 1) costStr = costStr+"红黑点 ";
        if (wanfaList[15] == 1) costStr = costStr+"天胡 ";
        if (wanfaList[16] == 1) costStr = costStr+"地胡 ";
        if (wanfaList[17] == 1) costStr = costStr+"自摸翻倍 ";
        if (wanfaList[18] == 1) costStr = costStr+"放炮包赔 ";
        if (wanfaList[19] == 1) costStr = costStr+"放炮必胡 ";
        if (wanfaList[29] == 1) costStr = costStr+"有胡必胡 ";
        if (wanfaList[30] == 1) costStr = costStr+"底分2分 ";
        if (wanfaList[20] == 1) costStr = costStr+"21张 ";
        if (wanfaList[2] == 1) costStr = costStr+"红黑2番 ";

        costStr = costStr + wanfaList[21] + "胡起胡 ";

        if (wanfaList[22] == 2){
            costStr = costStr + "先进房坐庄 ";
        }else{
            costStr = costStr + "随机坐庄 ";
        }

        var tuoguanStr = "";
        if (wanfaList[24] != 0) {
            tuoguanStr = " 可托管";
            if (wanfaList[25]){
                tuoguanStr = " 整局托管";
                if (wanfaList[25]==1){
                    tuoguanStr = " 单局托管";
                }else  if (wanfaList[25]==3){
                    tuoguanStr = " 三局托管";
                }
            }
        }
        if (isGoldRoom) {
            tuoguanStr = "";
        }
        costStr = costStr + tuoguanStr;

        if (wanfaList[7] == 2 ){
            if (wanfaList[23] != 0) {
                costStr = costStr + " 抽" +  wanfaList[23] + "张";
            }
            if (wanfaList[26] != 0) {
                costStr = costStr + " 小于" + wanfaList[27]  + "分翻" +  wanfaList[28] + "倍";
            }
        }

        if(wanfaList[31] && parseInt(wanfaList[31]) > 0){
            costStr = costStr + " 低于" +(wanfaList[32] || 10) + "分,加"+wanfaList[31]+"分";
        }
        return costStr;
    },
    getHYSHKWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var costStr = "";
        if (wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if (wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else{
            costStr = "群主支付 ";
        }
        
        costStr = costStr + wanfaList[7] + "人 ";

        costStr = costStr + wanfaList[0] + "局 ";
        if (isGoldRoom) {
            costStr = "";
        }
        var xingStr = "不带醒 ";
        if (wanfaList[10] == 1){
            xingStr = "跟醒 ";
        }else if (wanfaList[10] == 2){
            xingStr = "翻醒 ";
        }
        costStr = costStr + xingStr;

        var bihuStr = "";
        if (wanfaList[11] == 1){
            bihuStr = "有胡必胡 ";
        }else if (wanfaList[11] == 2){
            bihuStr = "放炮必胡 ";
        }
        costStr = costStr + bihuStr;
        if (wanfaList[12] == 2){
            costStr = costStr + "放炮2倍 ";
        }else if (wanfaList[12] == 3){
            costStr = costStr + "放炮3倍 ";
        }

        if (wanfaList[13] == 1) costStr = costStr+"海底胡 ";
        if (wanfaList[14] == 1) costStr = costStr+"一五十 ";
        if (wanfaList[15] == 1) costStr = costStr+"飘胡 ";
        if (wanfaList[16] == 1) costStr = costStr+"红黑点 ";
        if (wanfaList[17] == 1) costStr = costStr+"天胡 ";
        if (wanfaList[18] == 1) costStr = costStr+"地胡 ";
        if (wanfaList[19] == 1) costStr = costStr+"自摸翻倍 ";
        if (wanfaList[20] == 1) costStr = costStr+"一点红三倍 ";
        if (wanfaList[21] == 1) costStr = costStr+"可胡示众牌 ";
        if (wanfaList[36] == 1) costStr = costStr+"明偎 ";
        // if (wanfaList[22] == 1) costStr = costStr+"加锤 ";
        // if (wanfaList[32] == 1) costStr = costStr+"底分2分 ";
        // if (wanfaList[33] == 1) costStr = costStr+"低于10分加10分 ";
        if (wanfaList[23] == 1) costStr = costStr+"21张 ";


        costStr = costStr+"底分"+(parseInt(wanfaList[32])+1)+"分 ";
        if (wanfaList[24] == 1){
            costStr = costStr + "10红三倍/13红五倍 ";
        }else if (wanfaList[24] == 2){
            costStr = costStr + "10红三倍多一红+3胡 ";
        }
        if (wanfaList[34] == 1){
            costStr = costStr + "出牌后明龙 ";
        }else if (wanfaList[34] == 2){
            costStr = costStr + "发牌后明龙 ";
        }
        // cc.log("wanfaList[25] =",wanfaList[25]);
        if (wanfaList[25] == 2){
            costStr = costStr + "先进房坐庄 ";
        }else{
            costStr = costStr + "随机坐庄 ";
        }

        var tuoguanStr = "";
        if (wanfaList[27] != 0) {
            tuoguanStr = " 可托管";
            if (wanfaList[28]){
                tuoguanStr = " 整局托管";
                if (wanfaList[28]==1){
                    tuoguanStr = " 单局托管";
                }else if (wanfaList[28]==3){
                    tuoguanStr = " 三局托管";
                }
            }
        }
        if (isGoldRoom) {
            tuoguanStr = "";
        }
        costStr = costStr + tuoguanStr;

        if (wanfaList[7] == 2 ){
            if (wanfaList[26] != 0) {
                costStr = costStr + " 抽" +  wanfaList[26] + "张";
            }
            if (wanfaList[29] != 0) {
                costStr = costStr + " 小于" + wanfaList[30]  + "分翻" +  wanfaList[31] + "倍";
            }
            if(wanfaList[33] && parseInt(wanfaList[33]) > 0){
                costStr = costStr + " 低于"+(wanfaList[35]||10) + "分,加"+wanfaList[33]+"分";
            }
        }
        
        return costStr;
    },
    getLDFPFWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var costStr = "";
        if(!isGoldRoom){
            if (wanfaList[9] == 1){
                costStr = "AA支付 ";
            }else if (wanfaList[9] == 2){
                costStr = "房主支付 ";
            }else{
                costStr = "群主支付 ";
            }
            costStr = costStr + wanfaList[7] + "人 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        // costStr = costStr + wanfaList[7] + "人 ";
        costStr = costStr + wanfaList[13] + "胡起胡";
        var tuoguanStr = "";
        if (wanfaList[23] != 0) {
            tuoguanStr = " 可托管";
            if (wanfaList[36]){
                tuoguanStr = " 整局托管";
                if (wanfaList[36]==1){
                    tuoguanStr = " 单局托管";
                }else if (wanfaList[36]==3){
                    tuoguanStr = " 三局托管";
                }
            }
        }
        if(!isGoldRoom){
            costStr = costStr + tuoguanStr;
        }
        if (wanfaList[27] == 1) {
            costStr = costStr + " 首局随机庄家";
        }
        if (wanfaList[28] == 1) {
            costStr = costStr + " 飘胡";
        }
        if (wanfaList[33] == 1) {
            costStr = costStr + " 放炮必胡";
        }
        if (wanfaList[0] == 1) {
            costStr = costStr + " 200息 一局";
        } else {
            costStr = costStr + " " + wanfaList[10] + "息";
        }
        if (wanfaList[34] == 0) {
            costStr = costStr + " 不打鸟";
        }else if (wanfaList[34] == 1) {
            costStr = costStr + " 胡息打鸟";
        }else if (wanfaList[34] == 2) {
            costStr = costStr + " 打鸟" + wanfaList[35] +"分";
        }else if (wanfaList[34] == 3) {
            costStr = costStr + " 局内打鸟";
        }
        if (wanfaList[7] == 2 ){
            if (wanfaList[29] != 0) {
                costStr = costStr + " 抽" +  wanfaList[29] + "张";
            }
            if (wanfaList[30] != 0) {
                costStr = costStr + " 小于" + wanfaList[31]  + "分翻" +  wanfaList[32] + "倍";
            }
            if (wanfaList[37] && wanfaList[37] != 0) {
                costStr = costStr + " 低于" + wanfaList[38]  + "分,加" +  wanfaList[37] + "分";
            }
        }

        return costStr;
    },
    getLYZPWanfa:function(wanfaList,isNotGame){
        var costStr = "";
        if (wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if (wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else{
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        costStr = costStr + wanfaList[7] + "人 ";

        if (wanfaList[10] == 1){
            costStr = costStr + "举手做声 ";
        }
        if (wanfaList[11] == 1){
            costStr = costStr + "不带无胡 ";
        }else if (wanfaList[11] == 0){
            costStr = costStr + "可无胡 ";
        }
        if (wanfaList[12] == 1){
            costStr = costStr + "不带一点红 ";
        }
        if (wanfaList[13] == 1){
            costStr = costStr + "吃边打边 ";
        } 
        var tuoguanStr = "";
        if (wanfaList[15] != 0) {
            tuoguanStr = " 可托管";
            if (wanfaList[19]){
                tuoguanStr = " 整局托管";
                if (wanfaList[19]==1){
                    tuoguanStr = " 单局托管";
                }else  if (wanfaList[19]==3){
                    tuoguanStr = " 三局托管";
                }
            }
        }
        costStr = costStr + tuoguanStr;

        if (wanfaList[7] == 2 ){
            if (wanfaList[14] != 0) {
                costStr = costStr + " 抽" +  wanfaList[14] + "张";
            }
            if (wanfaList[16] != 0) {
                costStr = costStr + " 小于" + wanfaList[17]  + "分翻" +  wanfaList[18] + "倍";
            }
            if (wanfaList[21] && wanfaList[21] != 0) {
                costStr = costStr + " 低于" + wanfaList[22]  + "分,加" +  wanfaList[21] + "分";
            }
        }
        return costStr;
    },
    getZHZWanfa:function(wanfaList,isNotGame){
        var costStr = "";
        if (wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if (wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else{
            costStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }
        costStr = costStr + wanfaList[7] + "人 ";

        
        if (wanfaList[2] == 2){
            costStr = costStr + "四红起胡 ";
        }else{
            costStr = costStr + "三红起胡 ";
        }
        costStr = costStr + wanfaList[3] + "王 ";
        
        if (wanfaList[4] == 1){
            costStr = costStr + "双合翻倍 ";
        }  
        if (wanfaList[5] == 1){
            costStr = costStr + "大胡10分 ";
        }
        if (wanfaList[6] == 1){
            costStr = costStr + "碰碰胡 ";
        }
        if (wanfaList[8] == 1){
            costStr = costStr + "四碰单吊 ";
        }
        if (wanfaList[10] == 1){
            costStr = costStr + "80分封顶 ";
        }
        if (wanfaList[11] == 1){
            costStr = costStr + "一挂匾 ";
        }
        if (wanfaList[12] == 1){
            costStr = costStr + "十一红 ";
        }
        if (wanfaList[13] == 1){
            costStr = costStr + "满堂红 ";
        }
        if (wanfaList[14] == 1){
            costStr = costStr + "蝴蝶飞 ";
        }
        if (wanfaList[15] == 1){
            costStr = costStr + "板板胡 ";
        }
        if (wanfaList[16] == 1){
            costStr = costStr + "湘阴句句红 ";
        }
        if (wanfaList[16] == 2){
            costStr = costStr + "汨罗句句红 ";
        }
        if (wanfaList[18] == 1){
            costStr = costStr + "随机坐庄 ";
        }
        if (wanfaList[26] == 1){
            costStr = costStr + "蝴蝶不可上手 ";
        }
        if (wanfaList[26] == 2){
            costStr = costStr + "听牌后蝴蝶不可上手 ";
        }
        if (wanfaList[19] == 2){
            costStr = costStr + "闲家胡自己摸的第一张 ";
        }else{
            costStr = costStr + "闲家胡桌面第一张 ";
        }

        var tuoguanStr = "";
        if (wanfaList[20] != 0) {
            tuoguanStr = "可托管 ";
            if (wanfaList[24]){
                tuoguanStr = "整局托管 ";
                if (wanfaList[24]==1){
                    tuoguanStr = "单局托管 ";
                }else if (wanfaList[24]==3){
                    tuoguanStr = "三局托管 ";
                }
            }
        }
        costStr = costStr + tuoguanStr;

        if (wanfaList[7] == 2 ){
            if (wanfaList[25] != 0) {
                costStr = costStr + "抽" +  wanfaList[25] + "张 ";
            }
            if (wanfaList[21] != 0) {
                costStr = costStr + "小于" + wanfaList[22]  + "分翻" +  wanfaList[23] + "倍 ";
            }
        }
        return costStr;
    },
    getCZZPWanfa:function(wanfaList,isNotGame,isGoldRoom) {
        var costStr = "";

        if (!ClickClubModel.getClubIsGold()) {
            if (wanfaList[9] == 1) {
                costStr = "AA支付 ";
            } else if (wanfaList[9] == 2) {
                costStr = "房主支付 ";
            } else {
                costStr = "群主支付 ";
            }
        }
        costStr = costStr + wanfaList[7] + "人 ";
        costStr = costStr + wanfaList[0] + "局 ";
        if (isGoldRoom) {
            costStr = "";
        }
        var huxi = wanfaList[11]==2?6:wanfaList[11]==3?3:9;
        costStr = costStr + huxi + "息起胡";
        var tunStr = " 3息一囤";
        if (wanfaList[10] == 2){
            tunStr = " 1息一囤";
        }
        var fen = wanfaList[10] == 2?1:3;
        costStr = costStr + tunStr;
        var zhuanhuanStr = huxi + "息1囤";
        if (wanfaList[12] == 2){
            zhuanhuanStr = huxi + "息" + huxi/fen + "囤";
        }
        costStr = costStr + " " + zhuanhuanStr;
        var huStr = "";
        if (wanfaList[13] == 2){
            huStr = " 有炮必胡";
        }else if (wanfaList[13] == 3){
            huStr = " 有胡必胡";
        }
        costStr = costStr + huStr;
        var hhd = "";
        if (wanfaList[14] == 2){
            hhd = " 红黑点";
        }else if (wanfaList[14] == 3){
            hhd = " 红黑点2倍";
        }
        costStr  = costStr + hhd;
        if (wanfaList[15] == 1){
            costStr = costStr + " 自摸翻倍";
        }
        if (wanfaList[16] == 1){
            costStr = costStr + " 毛胡";
        }
        if (wanfaList[17] == 1){
            costStr = costStr + " 15张玩法";
        }
        if (wanfaList[18] == 2){
            costStr = costStr + " 飘1/2/3";
        }else if (wanfaList[18] == 3){
            costStr = costStr + " 飘2/3/5";
        }else if (wanfaList[18] == 4){
            costStr = costStr + " 每局飘1";
        }else if (wanfaList[18] == 5){
            costStr = costStr + " 每局飘2";
        }else if (wanfaList[18] == 6){
            costStr = costStr + " 每局飘3";
        }

        if (wanfaList[19] == 1){
            costStr = costStr + " 首局随机坐庄";
        }else if (wanfaList[19] == 2){
            costStr = costStr + " 首局房主坐庄";
        }
        if (wanfaList[20] == 1){
            costStr = costStr + " 出牌后明龙";
        }else if (wanfaList[20] == 2){
            costStr = costStr + " 发牌后明龙";
        }
        var tuoguanStr = "";
        if (wanfaList[21] != 0) {
            tuoguanStr = " 可托管";
            if (wanfaList[25]){
                tuoguanStr = " 整局托管";
                if (wanfaList[25]==1){
                    tuoguanStr = " 单局托管";
                }else  if (wanfaList[25]==3){
                    tuoguanStr = " 三局托管";
                }
            }
        }
        if (isGoldRoom) {
            tuoguanStr = "";
        }
        costStr = costStr + tuoguanStr;

        if (wanfaList[7] == 2 ){
            if (wanfaList[22] != 0) {
                costStr = costStr + " 小于" + wanfaList[23]  + "分翻" +  wanfaList[24] + "倍";
            }
            if (wanfaList[26] != 0){
                costStr = costStr + " 抽" + wanfaList[26] + "张";
            }
            if(wanfaList[27] && parseInt(wanfaList[27]) > 0){
                costStr = costStr + " 低于"+ (wanfaList[28] || 10) + "分，加"+wanfaList[27]+"分";
            }
        }

        

        return costStr;
    },

    getPDKWanfa:function(wanfaList,isNotGame,isGoldRoom){
        // cc.log("getPDKWanfa=============",isGoldRoom)
        var gameStr = "跑得快 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr = "群主支付 ";
        }


        var renshuStr = wanfaList[7] + "人 ";
        var jushuStr = wanfaList[0] + "局 ";
        var zhangDesc = wanfaList[1] + "张 ";
        var nameList = ["","红10(5分) ","红10(10分) ","红10(翻倍) "];
        var hongshiStr = nameList[wanfaList[10]] || "";

        var cardNumStr = "";
        if(wanfaList[8] == 1){
            cardNumStr = "显示剩余牌数 ";
        }

        var feijistr = "";
        if (wanfaList[12] == 0){
            feijistr =  "三张和飞机可以少带接完 ";
        }

        var heiStr = "";
        if(wanfaList[6] == 1 && wanfaList[7] != 2){
            heiStr = "首局必出黑桃三 ";
            if(wanfaList[1] == 11){
                heiStr = "首局必出黑桃六 ";
            }
        }

        var boomWithCard = "";
        if(wanfaList[11] == 3){
            boomWithCard = "四带三 ";
        }else if(wanfaList[11] == 2){
            boomWithCard = "四带二 ";
        }


        var tgStr = "";
        if (wanfaList[21] != 0){
            tgStr = "托管 ";
            if (wanfaList[27]){
                tgStr = "整局托管 ";
                if (wanfaList[27] == 1){
                    tgStr = "单局托管 ";
                }else if (wanfaList[27] == 3){
                    tgStr = "三局托管 ";
                }
            }
        }

        var daniaoStr = "";
        if(wanfaList[28] > 0){
            daniaoStr = "打鸟" + wanfaList[28] + "分 ";
        }
        if(wanfaList[31] > 0){
            if (wanfaList[31] == 1){
                daniaoStr = "每局飘1 ";
            }else if (wanfaList[31] == 2){
                daniaoStr = "每局飘2 ";
            }else if (wanfaList[31] == 3){
                daniaoStr = "飘123 ";
            }else if (wanfaList[31] == 4){
                daniaoStr = "飘235 ";
            }else if (wanfaList[31] == 5){
                daniaoStr = "飘258 ";
            }
        }

        if (wanfaList[25] == 1){
            tgStr = tgStr + "无炸弹 "
        }
        if (wanfaList[26] == 1){
            tgStr = tgStr + "回看 "
        }

        if (wanfaList[29] == 0){
            tgStr = tgStr + "炸弹不可拆 "
        }

        if (wanfaList[30] == 1){
            tgStr = tgStr + "3A算炸弹 "
        }
        var doubleStr = "";
        if (wanfaList[22] == 1){
            doubleStr = "低于" + wanfaList[23] + "分翻" + wanfaList[24] +"倍 " ;
        }
        var morefen = "";
        if(parseInt(wanfaList[7]) == 2 && wanfaList[32] && parseInt(wanfaList[32]) > 0){
            morefen = "低于"+ (wanfaList[33] || 10) + "分，加"+wanfaList[32]+"分";
        }

        if (isNotGame){
            gameStr = "";
        }

        if (isGoldRoom){
            costStr = "";
            morefen = "";
            doubleStr = "";
            tgStr = "";
            jushuStr = "";
            renshuStr = "";
        }

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}{12}{13}",
            gameStr,costStr,renshuStr,jushuStr,
            zhangDesc,hongshiStr,cardNumStr,feijistr,
            heiStr,boomWithCard,tgStr,doubleStr,daniaoStr,morefen);
        return wanfaStr;
    },
    getZZPDKWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("郑州跑得快");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        infoArr.push((17 - wanfaList[2]) + "张");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[9] == 3?"群主支付":wanfaList[9] == 2?"房主支付":"AA支付");
        var nameList = ["","红10(5分)","红10(10分)","红10(翻倍)"];
        infoArr.push(nameList[wanfaList[10]] || "");

        if(wanfaList[3] == 1)  infoArr.push("四带二");
        if(wanfaList[4] == 1)  infoArr.push("四带三");
        if(wanfaList[5] == 1)  infoArr.push("四带一为炸");
        if(wanfaList[13] == 0) {
            infoArr.push("炸弹算10分");
        }else if(wanfaList[13] == 1) {
            infoArr.push("炸弹翻倍");
        }
        if(wanfaList[15] == 1) {
            infoArr.push("2炸封顶");
        }else if(wanfaList[15] == 2) {
            infoArr.push("3炸封顶");
        }else{
            infoArr.push("1炸封顶");
        }
        if(wanfaList[16] == 1)  infoArr.push("三张");
        if(wanfaList[17] == 1)  infoArr.push("三带一");
        if(wanfaList[18] == 1)  infoArr.push("三带两单");
        if(wanfaList[19] == 1)  infoArr.push("三带一对");

        if(wanfaList[6] == 1 && wanfaList[7] != 2){
            if(wanfaList[1] == 11){
                infoArr.push("首局必出黑桃六");
            }else{
                infoArr.push("首局必出黑桃三");
            }
        }
        if(wanfaList[11] == 3){
            infoArr.push("四带三");
        }else if(wanfaList[11] == 2){
            infoArr.push("四带二");
        }
        if(wanfaList[21] > 0){
            if(wanfaList[27] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[27] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if(wanfaList[28] > 0){
            infoArr.push("打鸟" + wanfaList[28] + "分");
        }
        if(wanfaList[31] > 0){
            if (wanfaList[31] == 1){
                infoArr.push("每局飘1");
            }else if (wanfaList[31] == 2){
                infoArr.push("每局飘2");
            }else if (wanfaList[31] == 3){
                infoArr.push("飘123");
            }else if (wanfaList[31] == 4){
                infoArr.push("飘235");
            }else if (wanfaList[31] == 5){
                infoArr.push("飘258");
            }
        }
        if (wanfaList[25] == 1){
            infoArr.push("无炸弹");
        }
        if (wanfaList[26] == 1){
            infoArr.push("回看");
        }

        if (wanfaList[29] == 0){
            infoArr.push("炸弹不可拆");
        }

        if (wanfaList[30] == 1 && wanfaList[2] == 1){
            infoArr.push("3A算炸弹");
        }

        if (wanfaList[22] == 1){
            infoArr.push("低于" + wanfaList[23] + "分翻" + wanfaList[24] +"倍");
        }

        if(parseInt(wanfaList[7]) == 2 && wanfaList[32] && parseInt(wanfaList[32]) > 0){
            infoArr.push("低于"+ (wanfaList[33] || 10) + "分，加"+wanfaList[32]+"分");
        }
        return infoArr.join(" ");

    },
    getXTSDHWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("三打哈");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 1)infoArr.push("双进单出");
        if(wanfaList[4] == 1)infoArr.push("报副留守");
        if(wanfaList[5] == 1)infoArr.push("允许查牌");
        if(wanfaList[6] == 1)infoArr.push("抽六");
        if(wanfaList[8] == 1)infoArr.push("投降需询问");


        if(wanfaList[9] == 1)infoArr.push("60分起叫");
        else if(wanfaList[9] > 1){
            infoArr.push(wanfaList[9] + "分起叫");
        }

        if(wanfaList[12] == 1)infoArr.push("叫分加拍");
        if(wanfaList[11] == 1)infoArr.push("大倒提前结束");
        if(wanfaList[13] == 1)infoArr.push("叫分进档");
        if(wanfaList[18] == 1)infoArr.push("投降进档");

        if(wanfaList[13] == 1 || wanfaList[18] == 1){
            if(wanfaList[21] == 1)infoArr.push("投降6/12/27");
            else infoArr.push("投降3/6/9");
        }

        if(wanfaList[16] == 1)infoArr.push("大倒封顶");
        if(wanfaList[17] == 1)infoArr.push("长沙叫分");
        if(wanfaList[19] == 1)infoArr.push("打完主立即报副");
        if(wanfaList[20] == 1)infoArr.push("去鬼");
        if(wanfaList[22] == 1)infoArr.push("进房自动准备");


        if(wanfaList[10] == 1)infoArr.push("25分小光");
        else infoArr.push("30分小光");

        if(wanfaList[14] > 0){
            if(wanfaList[15] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[15] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        return infoArr.join(" ");
    },
  getXTBPWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("新田包牌");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
      if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 1)infoArr.push("双进单出");
        if(wanfaList[5] == 1)infoArr.push("允许查牌");
        if(wanfaList[16] == 1)infoArr.push("自选加飘");
        if(wanfaList[17] == 1)infoArr.push("可看底");
        if(wanfaList[18] == 1)infoArr.push("可看分");
        if(wanfaList[19] == 1)infoArr.push("可喊来米");
        if(wanfaList[20] == 1)infoArr.push("大倒不封顶");
        if(wanfaList[21] == 1)infoArr.push("投降2倍");

        if(wanfaList[14] > 0){
            if(wanfaList[15] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[15] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        return infoArr.join(" ");
    },

    getYYBSWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("益阳巴十");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[5] == 1)infoArr.push("可查牌");
        if(wanfaList[6] == 1)infoArr.push("抽六");

        if(wanfaList[16] == 2)infoArr.push("带红2");
        else infoArr.push("不带红2");

        if(wanfaList[17] == 3)infoArr.push("反主次数:3");
        else if(wanfaList[17] == 5)infoArr.push("反主次数:5");

        if(wanfaList[18] == 1)infoArr.push("小反130大反160");
        else infoArr.push("小反125大反155");

        if(wanfaList[14] > 0){
            if(wanfaList[15] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[15] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        return infoArr.join(" ");
    },

    getCDTLJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("常德拖拉机");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[5] == 1)infoArr.push("允许查牌");
        if(wanfaList[4] == 1)infoArr.push("四王定庄算十级");

        if(wanfaList[6] > 0){
            infoArr.push(wanfaList[6] + "级封顶");
        }

        if(wanfaList[8] > 0){
            infoArr.push("超时" + wanfaList[9] + "倍");
        }

        return infoArr.join(" ");
    },

    getTCGDWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("桐城掼蛋");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] > 0){
            infoArr.push("底分:" + wanfaList[3]);
        }

        if(wanfaList[11] == 2){
            infoArr.push("红2可单出");
        }else{
            infoArr.push("红2不可单出");
        }

        if(wanfaList[12] == 1)infoArr.push("显示牌数");

        if(wanfaList[13] > 0){
            infoArr.push("报牌" + wanfaList[13] + "张");
        }


        if(wanfaList[9] > 0){
            if(wanfaList[10] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[10] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        return infoArr.join(" ");
    },

    getHSTHWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("衡山同花");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 1)infoArr.push("显示牌数");

        if(wanfaList[4] > 0){
            infoArr.push(wanfaList[4] + "副牌");
        }

        if(wanfaList[5] == 1)infoArr.push("5同奖分");
        if(wanfaList[6] == 1)infoArr.push("沉死分给对手");
        if(wanfaList[8] == 1)infoArr.push("托管必打");

        if(wanfaList[9] > 0){
            if(wanfaList[10] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[10] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[11] == 1){
            infoArr.push("低于" + wanfaList[12] + "分翻" + wanfaList[13] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[14] && parseInt(wanfaList[14]) > 0){
            infoArr.push("低于"+ (wanfaList[15] || 10) + "分，加"+wanfaList[14]+"分 ");
        }

        return infoArr.join(" ");
    },

    getERDDZWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var infoArr = [];
        if(!isNotGame)infoArr.push("二人斗地主");

        if(!isGoldRoom){
            infoArr.push(wanfaList[0] + "局");
            infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        }

        if(wanfaList[3] > 0)infoArr.push(wanfaList[3] + "倍封顶");
        if(wanfaList[4] > 0)infoArr.push("可让" + wanfaList[4] + "张牌");
        if(wanfaList[5] == 1)infoArr.push("三张");
        if(wanfaList[6] == 1)infoArr.push("三带二");
        if(wanfaList[8] == 1)infoArr.push("四带二");

        if(wanfaList[9] == 1)infoArr.push("底牌翻倍");
        if(wanfaList[10] == 1)infoArr.push("不带加倍");
        if(wanfaList[11] == 1)infoArr.push("轮流先叫");

        if(!isGoldRoom){
            if(wanfaList[12] > 0){
                if(wanfaList[13] == 1){
                    infoArr.push("单局托管");
                }else if(wanfaList[13] == 3){
                    infoArr.push("三局托管");
                }else{
                    infoArr.push("整局托管");
                }
            }
        }

        if(!isGoldRoom){
            if (wanfaList[14] == 1){
                infoArr.push("低于" + wanfaList[15] + "分翻" + wanfaList[16] +"倍");
            }
        }

        if(!isGoldRoom){
            if(wanfaList[17] && parseInt(wanfaList[17]) > 0){
                infoArr.push("低于"+ (wanfaList[18] || 10) + "分，加"+wanfaList[17]+"分 ");
            }
        }

        return infoArr.join(" ");
    },

    getQFWanfa:function(wanfaList,isNotGame){
        var infoArr = [];

        if(!isNotGame)infoArr.push("沅江千分");
        infoArr.push(wanfaList[7] + "人");

        if (wanfaList[3]== 2){
            infoArr.push("不留6和7");
        }else{
            infoArr.push("留6和7");
        }

        if (wanfaList[4]== 2){
            infoArr.push("喜分算乘法");
        }else {
            infoArr.push("喜分算加法");
        }

        if (wanfaList[5]== 3){
            infoArr.push("一名奖40分 二名不扣分 末名扣40分");
        }else if(wanfaList[5]== 2){
            infoArr.push("一名奖100分 二名扣30分 末名扣70分");
        }else if(wanfaList[5]== 4){
            infoArr.push("一名奖60分 末名扣60分");
        }else if(wanfaList[5]== 5){
            infoArr.push("一名奖40分 末名扣40分");
        }else {
            infoArr.push("一名奖40分 二名不扣分 末名扣40分");
        }

        if (wanfaList[6]== 2){
            infoArr.push("奖分100");
        }else {
            infoArr.push("奖分200");
        }
        var tuoguanStr = "";
        if (wanfaList[8] != 0) {
            tuoguanStr = "可托管";
            if (wanfaList[9]){
                tuoguanStr = "整局托管";
                if (wanfaList[9]==1){
                    tuoguanStr = "单局托管";
                }
            }
        }
        infoArr.push(tuoguanStr);
        return infoArr.join(" ");
    },
    getDTWanfa:function(wanfaList,isNotGame){
        var infoArr = [];

        if(!isNotGame)infoArr.push("掂坨");

        infoArr.push(wanfaList[7] + "人");
        if(wanfaList[0] >= 100){
            infoArr.push(wanfaList[0] + "分");
        }else{
            infoArr.push(wanfaList[0] + "局");
        }

        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 1)infoArr.push("去掉三四");
        if(wanfaList[4] == 1)infoArr.push("看队友牌");
        if(wanfaList[5] == 1)infoArr.push("随机分组");
        if(wanfaList[6] == 1)infoArr.push("看手牌数");
        if(wanfaList[8] == 1)infoArr.push("不打顺子");
        if(wanfaList[9] == 1)infoArr.push("不打港");
        if(wanfaList[10] == 1)infoArr.push("正五十K分花色");
        if(wanfaList[11] == 1)infoArr.push("仅最后飞机三条可少带");
        if(wanfaList[12] == 1)infoArr.push("炸弹不带王");
        if(wanfaList[13] == 1)infoArr.push("四红四黑");
        if(wanfaList[16] == 1){
            infoArr.push("炸弹有喜");
            if(wanfaList[18] > 0)infoArr.push("天炸喜分:" + wanfaList[18]);
        }

        if(wanfaList[17] > 0){
            infoArr.push("喜分比例1:" + wanfaList[17]);
        }

        if(wanfaList[7] == 4 && wanfaList[19] == 1){
            infoArr.push("一游到达100分,中途解散算分");
        }

        if(wanfaList[20] == 1){
            infoArr.push("中途解散算喜分");
        }

        if(wanfaList[14] > 0){
            if(wanfaList[15] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[15] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        return infoArr.join(" ");
    },

    getNSBWanfa:function(wanfaList,isNotGame){
        var infoArr = [];

        if(!isNotGame)infoArr.push("牛十别");

        infoArr.push(wanfaList[7] + "人");

        infoArr.push(wanfaList[0] + "局");


        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] > 0){
            if(wanfaList[3] == 4)infoArr.push("底分:30/50");
            else infoArr.push("底分:" + wanfaList[3]);
        }

        if(wanfaList[4] == 1)infoArr.push("三带对");
        if(wanfaList[5] == 1)infoArr.push("飞机带连对");
        if(wanfaList[6] == 1)infoArr.push("抓尾分");

        if(wanfaList[8] == 2)infoArr.push("摸队");
        else infoArr.push("铁队");

        if(wanfaList[9] > 0){
            if(wanfaList[10] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[10] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        return infoArr.join(" ");
    },

    getNYMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("宁远麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[28] > 0){
            if(wanfaList[29] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[29] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if(wanfaList[9] == 1){
            infoArr.push("金马翻倍");
        }

        if(wanfaList[5] != 0){
            infoArr.push("允许飘分");
        }

        if(wanfaList[8] == 1){
            infoArr.push("红中为王");
        }

        if(wanfaList[12] == 1){
            infoArr.push("杠翻倍");
        }

        if(wanfaList[13] == 1){
            infoArr.push("王牌可出");
        }

        if(wanfaList[11] == 1){
            infoArr.push("一马全中");
        }else{
            infoArr.push("抓" + wanfaList[10] + "马");
        }

        if(wanfaList[6] == 0){
            infoArr.push("底分" + 1);
        }else{
            infoArr.push("底分" + wanfaList[6]);
        }

        if (wanfaList[7] == 2 && wanfaList[19] == 1){
            infoArr.push("低于" + wanfaList[20] + "分翻" + wanfaList[21] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[34] && parseInt(wanfaList[34]) > 0){
            infoArr.push("低于"+ (wanfaList[35] || 10) + "分，加"+wanfaList[34]+"分 ");
        }

        return infoArr.join(" ");
    },

    getCQXZMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("重庆血战麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 1){
            infoArr.push("自摸加番");
        }else{
            infoArr.push("自摸加底");
        }
        if(wanfaList[4] == 1){
            infoArr.push("点杠花(自摸)");
        }else{
            infoArr.push("点杠花(点炮)");
        }
        if(wanfaList[5] == 1){
            infoArr.push("换四张");
        }else{
            infoArr.push("换三张");
        }

        if(wanfaList[6] == 1){
            infoArr.push("幺九将对");
        }
        if(wanfaList[15] == 1){
            infoArr.push("门清中张");
        }
        if(wanfaList[16] == 1){
            infoArr.push("天地胡");
        }
        if(wanfaList[17] == 1){
            infoArr.push("放牛必须过庄");
        }

        infoArr.push("封顶"+wanfaList[18]+"番");

        if(wanfaList[8] > 0){
            if(wanfaList[12] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[12] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[9] == 1){
            infoArr.push("低于" + wanfaList[10] + "分翻" + wanfaList[11] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[13] && parseInt(wanfaList[13]) > 0){
            infoArr.push("低于"+ (wanfaList[14] || 10) + "分，加"+wanfaList[13]+"分 ");
        }

        return infoArr.join(" ");
    },
    getYYNXMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("南县麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] == 1){
            infoArr.push("海底捞2分");
        }
        if(wanfaList[4] == 1){
            infoArr.push("杠上花2分");
        }
        if(wanfaList[5] == 1){
            infoArr.push("小胡可抢杠胡");
        }
        if(wanfaList[6] == 1){
            infoArr.push("飞鸟");
        }else{
            infoArr.push("平鸟");
        }
        infoArr.push("抓"+wanfaList[8]+"鸟");
        if(wanfaList[7] == 2){
            if(wanfaList[9] == 1){
                infoArr.push("抽1门");
            }
        }

        if(wanfaList[10] > 0){
            if(wanfaList[11] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[11] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[12] == 1){
            infoArr.push("低于" + wanfaList[13] + "分翻" + wanfaList[14] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[15] && parseInt(wanfaList[15]) > 0){
            infoArr.push("低于"+ (wanfaList[16] || 10) + "分，加"+wanfaList[15]+"分 ");
        }

        return infoArr.join(" ");
    },
    
    getDZMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("道州麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] > 0)infoArr.push("抓" + wanfaList[3] + "码");
        if(wanfaList[4] > 0)infoArr.push("坐飘:" + wanfaList[4]);
        if(wanfaList[5] > 0)infoArr.push("底分:" + wanfaList[5]);
        if(wanfaList[6] > 0)infoArr.push("封顶:" + wanfaList[6]);

        if(wanfaList[8] == 1)infoArr.push("可吃");
        else infoArr.push("不可吃");

        if(wanfaList[9] == 1)infoArr.push("仅自摸");
        if(wanfaList[10] == 1)infoArr.push("大道");
        if(wanfaList[11] == 1)infoArr.push("小道");
        if(wanfaList[12] == 1)infoArr.push("混一色");
        if(wanfaList[20] == 1)infoArr.push("外飘");


        if(wanfaList[13] > 0){
            if(wanfaList[14] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[14] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[15] == 1){
            infoArr.push("低于" + wanfaList[16] + "分翻" + wanfaList[17] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[18] && parseInt(wanfaList[18]) > 0){
            infoArr.push("低于"+ (wanfaList[19] || 10) + "分，加"+wanfaList[18]+"分 ");
        }

        return infoArr.join(" ");
    },

    getZOUMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("郑州麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] > 0)infoArr.push("抓" + wanfaList[3] + "码");

        if(wanfaList[4] == 6)infoArr.push("自主选跑1-3");
        else if(wanfaList[4] == 7)infoArr.push("自主选跑1-5");
        else if(wanfaList[4] > 0)infoArr.push("固定跑:" + wanfaList[4]);

        if(wanfaList[5] == 2)infoArr.push("双混");
        else if(wanfaList[5] == 1)infoArr.push("单混");
        else infoArr.push("不带混");

        if(wanfaList[6] == 1)infoArr.push("带风");
        else infoArr.push("不带风");

        if(wanfaList[8] == 1)infoArr.push("七对加倍");

        if(wanfaList[9] == 1)infoArr.push("自摸胡");
        else infoArr.push("点炮胡");

        if(wanfaList[10] == 1)infoArr.push("庄家加底");
        if(wanfaList[11] == 1)infoArr.push("杠上花加倍");
        if(wanfaList[12] == 1)infoArr.push("杠跑");


        if(wanfaList[13] > 0){
            if(wanfaList[14] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[14] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[15] == 1){
            infoArr.push("低于" + wanfaList[16] + "分翻" + wanfaList[17] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[18] && parseInt(wanfaList[18]) > 0){
            infoArr.push("低于"+ (wanfaList[19] || 10) + "分，加"+wanfaList[18]+"分 ");
        }

        return infoArr.join(" ");
    },

    getJZMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("靖州麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[3] > 0){
            infoArr.push("抓" + wanfaList[3] + "鸟");

            if(wanfaList[4] == 2){
                infoArr.push("翻番结算");
            }else{
                infoArr.push("相加结算");

                if(wanfaList[15] >= 1 && wanfaList[15] <= 4){
                    infoArr.push("每鸟加" + wanfaList[15] + "分");
                }else{
                    infoArr.push("每鸟加胡牌分");
                }

            }
        }

        if(wanfaList[5] > 0){
            infoArr.push("抽底:" + wanfaList[5] + "张");
        }

        if(wanfaList[6] > 0){
            infoArr.push("封顶:" + wanfaList[6] + "分");
        }

        if(wanfaList[8] > 0){
            if(wanfaList[9] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[9] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[10] == 1){
            infoArr.push("低于" + wanfaList[11] + "分翻" + wanfaList[12] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[13] && parseInt(wanfaList[13]) > 0){
            infoArr.push("低于"+ (wanfaList[14] || 10) + "分，加"+wanfaList[13]+"分 ");
        }

        return infoArr.join(" ");
    },

    getTCPFMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("桐城跑风麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        if(wanfaList[3] == 1){
            infoArr.push("明跑");
        }else{
            infoArr.push("暗跑");
        }
        if(wanfaList[4] == 1){
            infoArr.push("暗牌玩法");
        }else{
            infoArr.push("明牌玩法");
        }
        if(wanfaList[5] == 0){
            infoArr.push("碰一对");
        }else{
            infoArr.push("一碰到底");
        }
        if(wanfaList[6] == 1){
            infoArr.push("选飘");
        }else if(wanfaList[6] == 2){
            infoArr.push("定飘"+wanfaList[8]+"分");
        }else{
            infoArr.push("不飘");
        }

        if (wanfaList[9] != 0){
            infoArr.push("整局托管");
            if (wanfaList[10] == 1){
                infoArr.push("单局托管");
            }else  if (wanfaList[10] == 3){
                infoArr.push("三局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[11] == 1){
            infoArr.push("低于" + wanfaList[12] + "分翻" + wanfaList[13] +"倍");
        }
        if(wanfaList[7] == 2 && wanfaList[15] && parseInt(wanfaList[15]) > 0){
            infoArr.push("低于"+ (wanfaList[15] || 10) + "分，加"+wanfaList[14]+"分");
        }

        return infoArr.join(" ");
    },
    getTCDPMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("桐城点炮麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        if(wanfaList[3] == 1){
            infoArr.push("可点炮");
        }else{
            infoArr.push("只可自摸");
        }
        if(wanfaList[4] == 1){
            infoArr.push("暗牌玩法");
        }else{
            infoArr.push("明牌玩法");
        }
        if(wanfaList[16] == 1){
            infoArr.push("发财补花");
        }
        if(wanfaList[5] == 0){
            infoArr.push("碰一对");
        }else{
            infoArr.push("一碰到底");
        }
        if(wanfaList[6] == 1){
            infoArr.push("选飘");
        }else if(wanfaList[6] == 2){
            infoArr.push("定飘"+wanfaList[8]+"分");
        }else{
            infoArr.push("不飘");
        }

        if (wanfaList[9] != 0){
            infoArr.push("整局托管");
            if (wanfaList[10] == 1){
                infoArr.push("单局托管");
            }else  if (wanfaList[10] == 3){
                infoArr.push("三局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[11] == 1){
            infoArr.push("低于" + wanfaList[12] + "分翻" + wanfaList[13] +"倍");
        }
        if(wanfaList[7] == 2 && wanfaList[15] && parseInt(wanfaList[15]) > 0){
            infoArr.push("低于"+ (wanfaList[15] || 10) + "分，加"+wanfaList[14]+"分");
        }

        return infoArr.join(" ");
    },
    getNXMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("宁乡麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[41] == 1)infoArr.push("抽40张");
        if(wanfaList[39] == 1)infoArr.push("门清");
        if(wanfaList[40] == 1)infoArr.push("平胡不接炮");
        infoArr.push(wanfaList[9] == 1 ? "全开放" : "半开放");
        infoArr.push(wanfaList[32] == 1 ? "杠四选一" : "杠二选二");
        infoArr.push(wanfaList[3] == 1 ? "中鸟翻倍" : "中鸟加分");
        if(wanfaList[16] == 1)infoArr.push("飘鸟");
        infoArr.push(wanfaList[4] == 0 ? "不抓鸟" : "抓"+wanfaList[4]+"鸟");

        if(wanfaList[28] > 0){
            if(wanfaList[29] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[29] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[19] == 1){
            infoArr.push("低于" + wanfaList[20] + "分翻" + wanfaList[21] +"倍");
        }

        if(wanfaList[31] > 0){
            infoArr.push(wanfaList[31] + "分封顶");
        }

        if(wanfaList[7] == 2 && wanfaList[34] && parseInt(wanfaList[34]) > 0){
            infoArr.push("低于"+ (wanfaList[35] || 10) + "分，加"+wanfaList[34]+"分 ");
        }

        return infoArr.join(" ");
    },

    getTCMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("通城麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[28] > 0){
            if(wanfaList[29] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[29] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if(wanfaList[6] == 0){
            infoArr.push("底分" + 1);
        }else{
            infoArr.push("底分" + wanfaList[6]);
        }

        if(wanfaList[4]=="1")infoArr.push("258将");
        else infoArr.push("乱将");
        if(wanfaList[37]=="1")infoArr.push("有癞");

        if(wanfaList[5] != "0"){
            if(parseInt(wanfaList[5]) > 10){
                infoArr.push("飘"+ (parseInt(wanfaList[5]) % 10) +"分");
            }else{
                infoArr.push("定飘"+ wanfaList[5] +"分");
            }
        }else{
            infoArr.push("不飘分");
        }

        if (wanfaList[7] == 2 && wanfaList[19] == 1){
            infoArr.push("低于" + wanfaList[20] + "分翻" + wanfaList[21] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[34] && parseInt(wanfaList[34]) > 0){
            infoArr.push("低于"+ (wanfaList[35] || 10) + "分，加"+wanfaList[34]+"分 ");
        }

        return infoArr.join(" ");
    },

    getTJMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("桃江麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[28] > 0){
            if(wanfaList[29] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[29] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if(wanfaList[18] == 0){
            infoArr.push("底分" + 1);
        }else{
            infoArr.push("底分" + wanfaList[18]);
        }

        if(wanfaList[25] == 1)infoArr.push("八王玩法");
        else infoArr.push("四王玩法");

        if(wanfaList[5]=="1")infoArr.push("报听");
        else infoArr.push("不报听");
        if(wanfaList[15] == "1")infoArr.push("可吃牌");
        else infoArr.push("不可吃牌");
        if(wanfaList[6] == "1")infoArr.push("豪华七对");
        if(wanfaList[9] == "1")infoArr.push("自摸胡");
        else infoArr.push("不可自摸胡");
        if(wanfaList[16] == "1")infoArr.push("杠后三张牌");
        if(wanfaList[12] == "1")infoArr.push("大进大出");
        if(wanfaList[8] == "1")infoArr.push("双豪华七小对");
        if(wanfaList[11] == "1")infoArr.push("天胡可抢杠");
        else infoArr.push("天胡不可抢杠");

        if(wanfaList[4] > 0){
            infoArr.push("抓" + wanfaList[4] + "鸟");
        }

        if(wanfaList[7] == 2){
            if(wanfaList[17] == 1){
                infoArr.push("鸟必中");
            }
            if(wanfaList[24] == 0){
                infoArr.push("不抽牌");
            }else{
                infoArr.push("抽"+wanfaList[24]+"张");
            }
        }

        if(wanfaList[10] == 1){
            infoArr.push("炮胡3自摸2");
        }else if(wanfaList[10] == 2){
            infoArr.push("炮胡2自摸3");
        }

        if (wanfaList[7] == 2 && wanfaList[19] == 1){
            infoArr.push("低于" + wanfaList[20] + "分翻" + wanfaList[21] +"倍");
        }

        //if(wanfaList[31] > 0){
        //    infoArr.push(wanfaList[31] + "分封顶");
        //}else{
        //    infoArr.push("不封顶");
        //}

        if(wanfaList[7] == 2 && wanfaList[34] && parseInt(wanfaList[34]) > 0){
            infoArr.push("低于"+ (wanfaList[35] || 10) + "分，加"+wanfaList[34]+"分 ");
        }

        return infoArr.join(" ");
    },

    getGDCSMJWanfa: function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("潮汕麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[28] > 0){
            if(wanfaList[29] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[29] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }else{
            infoArr.push("不托管");
        }

        if(wanfaList[22]=="1")infoArr.push("无字");
        if(wanfaList[23] == "1")infoArr.push("无风");

        if(wanfaList[25] == "1")infoArr.push("可吃胡");
        else infoArr.push("不可吃胡");

        if(wanfaList[27] == "1")infoArr.push("10倍不计分");
        if(wanfaList[32] == "1")infoArr.push("跟庄1分");
        if(wanfaList[26] == "1")infoArr.push("流局算杠");
        if(wanfaList[33] == "1")infoArr.push("吃杠杠爆全包");
        if(wanfaList[36] == "1")infoArr.push("连庄");
        if(wanfaList[30] == "1")infoArr.push("有胡必胡");
        if(wanfaList[38] == "1")infoArr.push("马跟杠");

        infoArr.push(wanfaList[31] == 1?"10倍封顶":"不封顶");
        infoArr.push(wanfaList[37] == 1?"翻鬼":"不翻鬼");

        if(wanfaList[4] != 0){
            infoArr.push("奖" + wanfaList[4] + "马");
        }else{
            infoArr.push("不奖马");
        }

        if(wanfaList[39] != 0){
            infoArr.push("买" + wanfaList[39] + "马");
        }else{
            infoArr.push("不买马");
        }

        if (wanfaList[7] == 2 && wanfaList[19] == 1){
            infoArr.push("低于" + wanfaList[20] + "分翻" + wanfaList[21] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[34] && parseInt(wanfaList[34]) > 0){
            infoArr.push("低于"+ (wanfaList[35] || 10) + "分，加"+wanfaList[34]+"分 ");
        }

        return infoArr.join(" ");
    },

    getCSMJWanfa:function(wanfaList,isNotGame,isInTabel,isGoldRoom){

        var infoArr = [];
        if (!isInTabel){
            if(!isNotGame)infoArr.push("长沙麻将");

            if(!isGoldRoom){
                infoArr.push(wanfaList[7] + "人");
                infoArr.push(wanfaList[0] + "局");
                infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
            }
        }
            
        if(wanfaList[6] == 1)infoArr.push("缺一色");
        if(wanfaList[8] == 1)infoArr.push("一枝花");
        if(wanfaList[9] == 1)infoArr.push("六六顺");
        if(wanfaList[10] == 1)infoArr.push("四喜");
        if(wanfaList[11] == 1)infoArr.push("金童玉女");
        if(wanfaList[12] == 1)infoArr.push("节节高");
        if(wanfaList[13] == 1)infoArr.push("三同");
        if(wanfaList[14] == 1)infoArr.push("中途六六顺");
        if(wanfaList[15] == 1)infoArr.push("中途四喜");
        if(wanfaList[17] == 1)infoArr.push("板板胡");
        if(wanfaList[18] == 1)infoArr.push("庄闲算分");

        if(wanfaList[23] == 1)infoArr.push("不可吃");
        if(wanfaList[24] == 1)infoArr.push("只能大胡");
        if(wanfaList[25] == 1)infoArr.push("小胡自摸");
        if(wanfaList[26] == 1)infoArr.push("缺一门");
        if(wanfaList[27] == 1)infoArr.push("假将胡");
        if(wanfaList[30] == 1)infoArr.push("门清");
        if(wanfaList[39] == 1)infoArr.push("门清自摸");
        if(wanfaList[32] == 1)infoArr.push("开四杠");
        if(wanfaList[33] == 1)infoArr.push("起手和中途胡不算鸟分");
        if(wanfaList[37] == 1)infoArr.push("全求人必须吊将");
        if(wanfaList[36] == 1)infoArr.push("杠/补算分");
        if(wanfaList[40] == 1)infoArr.push("中途解散算小胡分");
        if(wanfaList[41] == 1)infoArr.push("小胡自动胡");
        if(wanfaList[42] == 1)infoArr.push("小胡固定2分");
        if(wanfaList[43] == 1)infoArr.push("假将胡可抢放杠");

        if(wanfaList[16] == 1)infoArr.push("自由飘分");
        else if(wanfaList[16] == 2)infoArr.push("飘1分");
        else if(wanfaList[16] == 3)infoArr.push("飘2分");
        else if(wanfaList[16] == 4)infoArr.push("飘3分");
        else infoArr.push("不飘分");

        if(!isGoldRoom){
            if(wanfaList[28] > 0){
                if(wanfaList[29] == 1){
                    infoArr.push("单局托管");
                }else if(wanfaList[29] == 3){
                    infoArr.push("三局托管");
                }else if(wanfaList[29] == 4){
                    infoArr.push("二局托管");
                }else{
                    infoArr.push("整局托管");
                }
            }
        }

        if(wanfaList[4] > 0){
            infoArr.push("抓" + wanfaList[4] + "鸟");

            if(wanfaList[3] == 3)infoArr.push("中鸟加倍");
            else if(wanfaList[3] == 2)infoArr.push("中鸟翻倍");
            else infoArr.push("中鸟加分");

            if(wanfaList[7] == 3){
                if(wanfaList[22] == 1)infoArr.push("四八空鸟");
                else infoArr.push("鸟不落空");
            }

        }

        if(!isGoldRoom){
            if(wanfaList[38] > 0){
                infoArr.push("底分:" + wanfaList[38]);
            }
        }

        if(!isGoldRoom){
            if (wanfaList[7] == 2 && wanfaList[19] == 1){
                infoArr.push("低于" + wanfaList[20] + "分翻" + wanfaList[21] +"倍");
            }
        }

        if(wanfaList[31] > 0){
            infoArr.push(wanfaList[31] + "分封顶");
        }

        if(!isGoldRoom){
            if(wanfaList[7] == 2 && wanfaList[34] && parseInt(wanfaList[34]) > 0){
                infoArr.push("低于"+ (wanfaList[35] || 10) + "分，加"+wanfaList[34]+"分 ");
            }
        }

        return infoArr.join(" ");
    },

    getYJMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("沅江麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[10] == 3?"群主支付":wanfaList[10] == 2?"房主支付":"AA支付");

        infoArr.push("番数上限:" + (wanfaList[2] == 1?"24倍":"无上限"));
        infoArr.push(wanfaList[3] == 1?"有门清":"无门清");
        infoArr.push("抓" + wanfaList[4] + "鸟");
        infoArr.push(wanfaList[5] == 1?"有喜":"没喜");
        infoArr.push(wanfaList[6] == 1?"卡撬":"不卡撬");

        if(wanfaList[7] == 2){
            if(wanfaList[18] > 0)infoArr.push("抽" + wanfaList[18] +"张");
            else infoArr.push("不抽牌");
        }

        if(wanfaList[19] == 1)infoArr.push("码码胡");

        if(wanfaList[11] > 0){
            if(wanfaList[12] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[12] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[13] == 1){
            infoArr.push("低于" + wanfaList[14] + "分翻" + wanfaList[15] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[16] && parseInt(wanfaList[16]) > 0){
            infoArr.push("低于"+ (wanfaList[17] || 10) + "分，加"+wanfaList[16]+"分 ");
        }

        return infoArr.join(" ");
    },

    getYJGHZWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("沅江鬼胡子");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        infoArr.push("封顶:" + (wanfaList[3]) + "息");
        infoArr.push(wanfaList[4] == 1?"可飘":"不可飘");
        infoArr.push("无息平:" + (wanfaList[5] == 1?"有":"没有"));
        infoArr.push("吊吊手:" + (wanfaList[6] == 1?"有":"没有"));

        if(wanfaList[7] == 2){
            if(wanfaList[15] > 0)infoArr.push("埋" + wanfaList[15] +"张");
            else infoArr.push("不埋牌");
        }

        if (wanfaList[7] == 2 && wanfaList[10] == 1){
            infoArr.push("低于" + wanfaList[11] + "分翻" + wanfaList[12] +"倍");
        }

        if(wanfaList[7] == 2 && wanfaList[13] && parseInt(wanfaList[13]) > 0){
            infoArr.push("低于"+ (wanfaList[14] || 10) + "分，加"+wanfaList[13]+"分 ");
        }

        return infoArr.join(" ");
    },

    /**  邵阳麻将玩法 **/
    getSYMJWanfa: function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("邵阳麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        if(wanfaList[5] > 0){
            infoArr.push("抓" + wanfaList[5] + "鸟");
        }

        if(wanfaList[3] == 1)infoArr.push("带风");
        if(wanfaList[6] == 1)infoArr.push("加锤");
        if(wanfaList[4] == 2)infoArr.push("清一色可吃");
        if(wanfaList[4] == 1)infoArr.push("可以吃");
        if(wanfaList[9] == 1)infoArr.push("可抢公杠胡");

        if (wanfaList[7] == 2){
            if(wanfaList[9] == 1){
                if(wanfaList[16] == 1){
                    infoArr.push("抢杠胡算自摸");
                }
            }
        }else if (wanfaList[7] == 3){
            if(wanfaList[12] == 1)infoArr.push("可胡放杠胡");
            if(wanfaList[10] == 2)infoArr.push("抢杠胡承包");
            if(wanfaList[13] == 2)infoArr.push("点杠两家付");
            if(wanfaList[14] == 2)infoArr.push("点杠杠开承包");
            if(wanfaList[15] == 2)infoArr.push("杠后炮两家付");
        }else{
            if(wanfaList[12] == 1)infoArr.push("可胡放杠胡");
            if(wanfaList[10] == 1)infoArr.push("抢杠胡包三家");
            if(wanfaList[13] == 1)infoArr.push("点杠三家付");
            if(wanfaList[14] == 1)infoArr.push("点杠杠开包三家");
            if(wanfaList[15] == 1)infoArr.push("杠后炮三家付");
        }

        if(wanfaList[8] > 0){
            if(wanfaList[21] == 1){
                infoArr.push("单局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[18] == 1){
            infoArr.push("低于" + wanfaList[19] + "分翻" + wanfaList[20] +"倍");
        }

        return infoArr.join(" ");
    },
    getYZWDMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("永州王钓麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        if(wanfaList[3] == 1)infoArr.push("两片");
        if(wanfaList[4] == 1)infoArr.push("抢杠胡");
        if(wanfaList[5] == 1)infoArr.push("七对可胡");
        if(wanfaList[6] == 1)infoArr.push("庄闲分");
        if(wanfaList[9] == 1)infoArr.push("底分2分");
        if(wanfaList[17] == 1)infoArr.push("无筒子");
        if(wanfaList[8] == 1)infoArr.push("碰碰胡x2");
        if(wanfaList[18] == 1)infoArr.push("七对x2");
        if(wanfaList[19] == 1)infoArr.push("清一色x2");
        if(wanfaList[10]<10) {
            infoArr.push(wanfaList[10] + "码");
        }else{
            infoArr.push("数字码");
        }
        if (wanfaList[16]==0){
            infoArr.push("不飘分");
        }else if(wanfaList[16]<4){
            infoArr.push("飘"+wanfaList[16]+"分");
        }else if(wanfaList[16]==4){
            infoArr.push("自由下飘");
        }else{
            infoArr.push("首局定飘");
        }

        if(wanfaList[11] > 0){
            if(wanfaList[12] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[12] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[13] == 1){
            infoArr.push("低于" + wanfaList[15] + "分翻" + wanfaList[14] +"倍");
        }

        if (wanfaList[7] == 2 && wanfaList[20] && wanfaList[20] != 0){
            infoArr.push("低于" + wanfaList[21] + "分加" + wanfaList[20] +"分");
        }

        return infoArr.join(" ");
    },
    getAHMJWanfa:function(wanfaList,isNotGame){
        var infoArr = [];
        if(!isNotGame)infoArr.push("安化麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");

        if(wanfaList[4] == 2){
            infoArr.push("七王");
        }else{
            infoArr.push("四王");
        }

        if(wanfaList[5] == 0){
            infoArr.push("不抓鸟")
        }else{
            infoArr.push("抓"+wanfaList[5]+"鸟")
        }

        if(wanfaList[17] == 1){
            infoArr.push("159中鸟");
        } 
        infoArr.push("底分" +wanfaList[18]+"分");
        if(wanfaList[6] == 1)infoArr.push("庄闲分");
        if(wanfaList[8] == 1)infoArr.push("王代硬");
        if(wanfaList[9] == 1)infoArr.push("一炮多响");

        if(wanfaList[10] > 0){
            if(wanfaList[11] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[11] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[12] == 1){
            infoArr.push("低于" + wanfaList[16] + "分翻" + wanfaList[13] +"倍");
        }

        if (wanfaList[7] == 2 && wanfaList[14] && wanfaList[14] != 0){
            infoArr.push("低于" + wanfaList[15] + "分加" + wanfaList[14] +"分");
        }

        return infoArr.join(" ");
    },
    getCXMJWanfa:function(wanfaList,isNotGame){
        // cc.log("wanfaList =",wanfaList);
        var infoArr = [];
        if(!isNotGame)infoArr.push("楚雄麻将");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        if(wanfaList[4] == 1){
            infoArr.push("放炮");
        }else{
            infoArr.push("自摸");
        }
        if(wanfaList[5] == 1){
            infoArr.push("粘五就算");
        }
        if(wanfaList[8] > 0){
            if(wanfaList[9] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[9] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[10] == 1){
            infoArr.push("低于" + wanfaList[12] + "分翻" + wanfaList[11] +"倍");
        }

        if (wanfaList[7] == 2 && wanfaList[13] && wanfaList[13] != 0){
            infoArr.push("低于" + wanfaList[14] + "分加" + wanfaList[13] +"分");
        }

        return infoArr.join(" ");
    },
    getTDHWanfa:function(wanfaList,isNotGame){

        var infoArr = [];
        if(!isNotGame)infoArr.push("湘阴推倒胡");
        infoArr.push(wanfaList[7] + "人");
        infoArr.push(wanfaList[0] + "局");
        if(!ClickClubModel.getClubIsGold())
        infoArr.push(wanfaList[2] == 3?"群主支付":wanfaList[2] == 2?"房主支付":"AA支付");
        if(wanfaList[11] == 1)infoArr.push("明杠过杠不能再补");
        if(wanfaList[12] == 1)infoArr.push("将将胡必须自摸");
        if(wanfaList[13] == 1)infoArr.push("清一色可吃");
        if(wanfaList[14] == 1)infoArr.push("跟张不点炮");
        if(wanfaList[15] == 1)infoArr.push("将碰胡接炮不算将将胡");
        if(wanfaList[16] == 1)infoArr.push("大胡底分10分");
        if(wanfaList[17] == 1)infoArr.push("80分封顶");

        if(wanfaList[6] == 1)infoArr.push("自由飘分");
        else if(wanfaList[6] == 2)infoArr.push("飘1分");
        else if(wanfaList[6] == 3)infoArr.push("飘2分");
        else if(wanfaList[6] == 4)infoArr.push("飘3分");
        else infoArr.push("不飘分");

        if(wanfaList[10] > 0) infoArr.push("单鸟");

        if(wanfaList[8] > 0){
            if(wanfaList[9] == 1){
                infoArr.push("单局托管");
            }else if(wanfaList[9] == 3){
                infoArr.push("三局托管");
            }else{
                infoArr.push("整局托管");
            }
        }

        if (wanfaList[7] == 2 && wanfaList[3] == 1){
            infoArr.push("低于" + wanfaList[4] + "分翻" + wanfaList[5] +"倍");
        }

        return infoArr.join(" ");
    },

    getZJMJWanfa:function(wanfaList,isNotGame){
        var gameStr = "芷江麻将 ";
        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }

        if (ClickClubModel.getClubIsGold()) {
            costStr = "";
        }

        var renshuStr = wanfaList[7] + "人 ";
        var jushuStr = wanfaList[0] + "局 ";

        var niaoNumStr = "不抓鸟 ";
        if(wanfaList[3] && wanfaList[3] != 0){
            niaoNumStr = "抓"+ wanfaList[3] + "鸟 ";
        }

        var tgStr = "";

        if (wanfaList[8] != 0){
            if (wanfaList[26] == 1){
                tgStr = tgStr + "单局托管 ";
            }else  if (wanfaList[26] == 3){
                tgStr = tgStr + "三局托管 ";
            }else{
                tgStr = tgStr + "整局托管 ";
            }
        }else{
            tgStr = tgStr + "不托管 ";
        }

        if (wanfaList[39] == 1){
            tgStr = tgStr + "将将胡 ";
        }
        if (wanfaList[38] == 1){
            tgStr = tgStr + "板板胡 ";
        }
        if (wanfaList[40] == 1){
            tgStr = tgStr + "荒庄荒杠 ";
        }
        if (wanfaList[41] == 1){
            tgStr = tgStr + "红中癞子 ";
        }
        if (wanfaList[29] == 1){
            tgStr = tgStr + "四红中可胡 ";
        }
        if (wanfaList[42] == 1){
            tgStr = tgStr + "大胡算分 ";
        }
        if (wanfaList[43] == 1){
            tgStr = tgStr + "黑胡 ";
        }

        var doubleStr = "";
        if (wanfaList[7] == 2 && wanfaList[20] == 1){
            doubleStr = "低于" + wanfaList[21] + "分翻" + wanfaList[22] +"倍 " ;
        }

        if(wanfaList[7] == 2 && wanfaList[33] && parseInt(wanfaList[33]) > 0){
            doubleStr = doubleStr + "低于"+ (wanfaList[34] || 10) + "分，加"+wanfaList[33]+"分 ";
        }

        if (isNotGame){
            gameStr = "";
        }

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}",
            gameStr,costStr,renshuStr,jushuStr,
            niaoNumStr,doubleStr,tgStr);
        return wanfaStr;
    },

    getHZMJWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var gameStr = "红中麻将 ";
        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }

        var renshuStr = wanfaList[7] + "人 ";
        var jushuStr = wanfaList[0] + "局 ";

        if(isGoldRoom){
            costStr = renshuStr = jushuStr = "";
        }

        var zhuangStr = "";
        if(wanfaList[5] == 1){
            zhuangStr = "分庄闲 ";
        }

        var khqdStr = "";
        if(wanfaList[6] == 1){
            khqdStr = "可胡七对 ";
        }

        var niaoNumStr = "不抓鸟 ";
        if(wanfaList[3] && wanfaList[3] != 0){
            niaoNumStr = "抓"+ wanfaList[3] + "鸟 ";
        }


        var niaowayStr = "";
        if(wanfaList[19] == 1){
            niaowayStr = "159中鸟 ";
        }

        var niaoStr = "";
        if(wanfaList[12] == 1){
            niaoNumStr = "";
            niaoStr = "一鸟全中 ";
        }
        if(wanfaList[11] == 1){
            niaoNumStr = "";
            niaoStr = "窝窝鸟 ";
        }

        if(wanfaList[13] == 3){
            niaoStr += "中鸟翻倍 ";
        }else{
            niaoStr  = niaoStr + "中鸟+"+wanfaList[13]+"分 ";
        }

        var niaofenStr = "";
        if(wanfaList[14]){
            niaofenStr = "无红中鸟+" + wanfaList[14] + " ";
        }

        var bsjStr = "";
        if(wanfaList[10] == 1){
            bsjStr = "抢杠胡包三家 ";
        }

        var dpdStr = "";
        if(wanfaList[4] == 0){
            dpdStr = "点炮胡 ";
        }

        var ypbhStr = "";
        if(wanfaList[15] == 1){
            ypbhStr = "有炮必胡 ";
        }

        var qghStr = "";
        if(wanfaList[9] == 1){
            qghStr = "抢杠胡 ";
        }

        var tgStr = "";

        if(!isGoldRoom){
            tgStr = "底分:"+ (wanfaList[18]||1)+" ";

            if (wanfaList[8] != 0){
                if (wanfaList[26] == 1){
                    tgStr = tgStr + "单局托管 ";
                }else  if (wanfaList[26] == 3){
                    tgStr = tgStr + "三局托管 ";
                }else{
                    tgStr = tgStr + "整局托管 ";
                }
            }
        }

        if (wanfaList[23] == 1){
            tgStr = tgStr + "无红中自摸+1分 ";
        }
        if (wanfaList[24] == 1){
            tgStr = tgStr + "无红中接炮+1分 ";
        }
        if (wanfaList[25] == 1){
            tgStr = tgStr + "七对、碰碰胡、清一色+1分 ";
        }
        if (wanfaList[27] == 1){
            tgStr = tgStr + "无红中得分翻倍 ";
        }
        if (wanfaList[28] == 1){
            tgStr = tgStr + "自摸算1分 ";
        }
        if (wanfaList[29] == 1){
            tgStr = tgStr + "起手四红中可胡 ";
        }
        if (wanfaList[30] == 1){
            tgStr = tgStr + "不中鸟算全中 ";
        }
        if (wanfaList[31] == 1){
            tgStr = tgStr + "八红中 ";
        }
        if (wanfaList[32] == 1){
            tgStr = tgStr + "自摸必胡 ";
        }
        if (wanfaList[35] == 1){
            tgStr = tgStr + "有红中不可接炮 ";
        }
        if (wanfaList[36] == 1){
            tgStr = tgStr + "不能一炮多响 ";
        }
        if (wanfaList[37] == 1){
            tgStr = tgStr + "中途解散算杠分 ";
        }

        if(!isGoldRoom){
            if(wanfaList[7] == 2 && wanfaList[33] && parseInt(wanfaList[33]) > 0){
                tgStr = tgStr + "低于"+ (wanfaList[34] || 10) + "分，加"+wanfaList[33]+"分 ";
            }
        }

        if(wanfaList[17] == 1)tgStr = tgStr + "自由飘分 ";
        else if(wanfaList[17] == 2)tgStr = tgStr + "首局定飘 ";
        else if(wanfaList[17] >= 3 && wanfaList[17] <= 5){
            tgStr = tgStr + "飘" + (wanfaList[17] - 2) + "分 ";
        }

        var doubleStr = "";

        if(!isGoldRoom){
            if (wanfaList[7] == 2 && wanfaList[20] == 1){
                doubleStr = "低于" + wanfaList[21] + "分翻" + wanfaList[22] +"倍 " ;
            }
        }

        if (isNotGame){
            gameStr = "";
        }

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}{12}{13}{14}{15}",
            gameStr,costStr,renshuStr,jushuStr,
            zhuangStr,khqdStr,bsjStr,dpdStr,
            ypbhStr,qghStr,niaoNumStr,niaowayStr,niaoStr,niaofenStr,doubleStr,tgStr);
        return wanfaStr;
    },

    getZZMJWanfa:function(wanfaList,isNotGame,isGoldRoom){
        var wanfaStr = "";

        if(!isGoldRoom){
            if(wanfaList[2] == 1){
                wanfaStr = "AA支付 ";
            }else if(wanfaList[2] == 2){
                wanfaStr = "房主支付 ";
            }else if(wanfaList[2] == 3){
                wanfaStr = "群主支付 ";
            }
        }

        if (ClickClubModel.getClubIsGold()) {
            wanfaStr = "";
        }

        if(!isGoldRoom){
            wanfaStr = wanfaStr + wanfaList[7] +"人 ";
            wanfaStr = wanfaStr + wanfaList[0] +"局 ";
        }

        if (wanfaList[3] == 1){
            wanfaStr = wanfaStr + "庄闲(算分) ";
        }
        if (wanfaList[4] == 1){
            wanfaStr = wanfaStr + "可胡七对 ";
        }
        if (wanfaList[5] == 1){
            wanfaStr = wanfaStr + "可抢公杠胡 ";
        }
        if (wanfaList[6] == 1){
            wanfaStr = wanfaStr + "抢杠胡包三家 ";
        }
        if (wanfaList[8] == 1){
            wanfaStr = wanfaStr + "有炮必胡 ";
        }
        var tuoguanStr = "";
        if (wanfaList[9] != 0){
            tuoguanStr = "可托管 ";
            if (wanfaList[19]){
                tuoguanStr = "整局托管 ";
                if (wanfaList[19] == 1){
                    tuoguanStr = "单局托管 ";
                }else if (wanfaList[19] == 3){
                    tuoguanStr = "三局托管 ";
                }
            }
        }

        if(!isGoldRoom){
            wanfaStr = wanfaStr + tuoguanStr;
        }

        var piaofenStr = "不飘分 ";
        if (wanfaList[20] > 0 && wanfaList[20]<4){
            piaofenStr = "固定飘" + wanfaList[20] + "分 ";
        }
        if (wanfaList[20]==4){
            piaofenStr = "自由下飘 ";
        }
        if (wanfaList[20]==5){
            piaofenStr = "首局定飘 ";
        }
        wanfaStr = wanfaStr + piaofenStr;
        if (wanfaList[15] == 1){
            wanfaStr = wanfaStr + "点炮胡 ";
        }
        if (wanfaList[17] == 1){
            wanfaStr = wanfaStr + "流局算杠分 ";
        }
        if (wanfaList[18] == 1){
            wanfaStr = wanfaStr + "放杠+3分 ";
        }
        if (wanfaList[24] == 1){
            wanfaStr = wanfaStr + "可吃 ";
        }
        if (wanfaList[23] == 1){
            wanfaStr = wanfaStr + "缺一门 ";
        }
        if (wanfaList[16] == 2){
            wanfaStr = wanfaStr + "先进房坐庄 ";
        }else{
            wanfaStr = wanfaStr + "随机坐庄 ";
        }
        var niaonum = parseInt(wanfaList[10]);
        // cc.log("niaonum =",niaonum);
        if (1 < niaonum && niaonum < 10){
            wanfaStr = wanfaStr + "抓"+niaonum+"鸟 ";
        }else if (niaonum >= 10){
            if(niaonum == 10){
                wanfaStr = wanfaStr + "一鸟全中 ";
            }else if(niaonum == 12){
                wanfaStr = wanfaStr + "胡几抓几 ";
            }
        }else{
            wanfaStr = wanfaStr + "不抓鸟 ";
        }

        if(!isGoldRoom){
            wanfaStr = wanfaStr + "底分"+wanfaList[11]+"分 ";

            if (wanfaList[7] == 2 && wanfaList[12] == 1){
                wanfaStr = wanfaStr + "低于" + wanfaList[13] + "分翻" + wanfaList[14] +"倍 " ;
            }

            if(wanfaList[7] == 2 && wanfaList[21] && parseInt(wanfaList[21]) > 0){
                wanfaStr = wanfaStr + "低于"+ (wanfaList[22] || 10) + "分，加"+wanfaList[21]+"分 ";
            }
        }

        return wanfaStr;
    },

    getBSMJWanfa:function(wanfaList,isNotGame){
        var wanfaStr = "尚未配置好";
        if(wanfaList[2] == 1){
            wanfaStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            wanfaStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            wanfaStr = "群主支付 ";
        }
        if (ClickClubModel.getClubIsGold()) {
            wanfaStr = "";
        }
        wanfaStr = wanfaStr + wanfaList[3] +"人 ";
        wanfaStr = wanfaStr + wanfaList[0] +"局 ";
        if (wanfaList[5] == 1){
            wanfaStr = wanfaStr + "有风 ";
        }
        if (wanfaList[6] == 1){
            wanfaStr = wanfaStr + "一条龙 ";
        }
        if (wanfaList[7] == 1){
            wanfaStr = wanfaStr + "四归一 ";
        }
        if (wanfaList[8] == 1){
            wanfaStr = wanfaStr + "报听 ";
        }
        if (wanfaList[10] == 1){
            wanfaStr = wanfaStr + "查叫 ";
        }else if (wanfaList[10] == 2){
            wanfaStr = wanfaStr + "查大叫 ";
        }
        var tuoguanStr = "";
        if (wanfaList[11] != 0){
            if (wanfaList[12]){
                tuoguanStr = "整局托管 ";
                if (wanfaList[12] == 1){
                    tuoguanStr = "单局托管 ";
                }else  if (wanfaList[12] == 3){
                    tuoguanStr = "三局托管 ";
                }
            }else{
                tuoguanStr = "可托管 ";
            }
        }
        if(wanfaList[3] == 2){
            if(wanfaList[13] == 1){
                wanfaStr = wanfaStr + "低于" + wanfaList[14] + "分翻" + wanfaList[15] +"倍 " ;
            }
            if(wanfaList[16] && parseInt(wanfaList[16]) > 0){
                wanfaStr = wanfaStr + "低于"+ (wanfaList[17] || 10) + "分，加"+wanfaList[16]+"分 ";
            }
        }
        wanfaStr = wanfaStr + tuoguanStr;
        var nameList = [" ","买死点上限1 ","买死点上限2","买活点上限1 ","买活点上限2 ","买活点固定1 "];
        var MaiDianStr = nameList[wanfaList[9]] || "";
        wanfaStr = wanfaStr + MaiDianStr;

        return wanfaStr;
    },

    isPK:function(wanfa){
        return this.isDTZWanfa(wanfa) || this.isQFWanfa(wanfa) || this.isPDKWanfa(wanfa) || this.isSDHWanfa(wanfa)|| this.isDTWanfa(wanfa);
    },

    isDTZWanfa:function(wanfa){
        var isDtz = false ;
        if ((wanfa >= 113 && wanfa <= 118) || (wanfa >= 210 && wanfa <= 212))
            isDtz = true;
        return isDtz;
    },

    isQFWanfa:function(wanfa){
        var isQF = false ;
        if (wanfa == GameTypeEunmPK.QF)
            isQF = true;
        return isQF;
    },

    isPDKWanfa:function(wanfa){
        var isPdk = false ;
        if (wanfa == GameTypeEunmPK.PDKI || wanfa == GameTypeEunmPK.PDKII || wanfa == GameTypeEunmPK.PDK11 || wanfa == GameTypeEunmPK.ZZPDK)
            isPdk = true;
        return isPdk;
    },

    isSDHWanfa:function(wanfa){
        var isSdh= false ;
        if (wanfa == GameTypeEunmPK.XTSDH || wanfa == GameTypeEunmPK.XTBP)
            isSdh = true;
        return isSdh;
    },

    isPHZWanfa:function(wanfa){
        return GameTypeManager.isZP(wanfa);
    },

    isYZLC:function(wanfa){
        var isYzlc = false;
        if(GameTypeEunmZP.YZLC == wanfa){
            isYzlc = true;
        }
        return isYzlc;
    },

    isMJWanfa:function(wanfa){
        return GameTypeManager.isMJ(wanfa);
    },

    isHZMJWanfa:function(wanfa){
        var isHzmj = false ;
        if (wanfa == GameTypeEunmMJ.HZMJ)
            isHzmj = true;
        return isHzmj;
    },

    isBSMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.BSMJ;
    },

    isTJMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.TJMJ;
    },

    isTCMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.TCMJ;
    },

    isNXMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.NXMJ;
    },

    isZZMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.ZZMJ;
    },

    isCSMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.CSMJ;
    },

    isTDHWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.TDH;
    },

    isSYMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.SYMJ;
    },

    isYZWDMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.YZWDMJ;
    },
    isAHMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.AHMJ;
    },
    isCXMJWanfa:function(wanfa){
        return wanfa == GameTypeEunmMJ.CXMJ;
    },
    /**wanfaList 创建房间时传的玩法集合
     * name  玩法名字
     * */
    getGameName:function(wanfaList){
        var wanfa = wanfaList[1];
        var name = this.getGameStr(wanfa);
        return name
    },

    /**wanfaList 创建房间时传的玩法集合
     * name  玩法名字
     * */
    getGameStr:function(wanfa){
        var name = "";
        if(this.isPHZWanfa(wanfa)){
            if (wanfa == GameTypeEunmZP.SYZP){
                name = "邵阳字牌";
            }else if(wanfa == GameTypeEunmZP.SYBP){
                name = "邵阳剥皮";
            }else if(wanfa == GameTypeEunmZP.LDFPF){
                name = "娄底放炮罚";
            }else if(wanfa == GameTypeEunmZP.CZZP){
                name = "郴州字牌";
            }else if(wanfa == GameTypeEunmZP.LYZP){
                name = "耒阳字牌";
            }else if(wanfa == GameTypeEunmZP.ZHZ){
                name = "捉红字";
            }else if(wanfa == GameTypeEunmZP.WHZ){
                name = "岳阳歪胡子";
			}else if(wanfa == GameTypeEunmZP.LDS){
                name = "落地扫";
            }else if(wanfa == GameTypeEunmZP.YZCHZ){
                name = "永州扯胡子";
            }else if(wanfa == GameTypeEunmZP.HYLHQ){                
				name = "衡阳六胡抢";            
			} else if(wanfa == GameTypeEunmZP.HYSHK){                
                name = "衡阳十胡卡";            
            }else if(wanfa == GameTypeEunmZP.XXGHZ){
                name = "湘乡告胡子";
            }else if(wanfa == GameTypeEunmZP.XTPHZ){
                name = "湘潭跑胡子";
            }else if(wanfa == GameTypeEunmZP.XXPHZ){
                name = "湘乡跑胡子";
            }else if(wanfa == GameTypeEunmZP.AHPHZ){
                name = "安化跑胡子";
            }else if(wanfa == GameTypeEunmZP.GLZP){
                name = "桂林字牌";
            }else if(wanfa == GameTypeEunmZP.LSZP){
                name = "蓝山字牌";
            }else if(wanfa == GameTypeEunmZP.NXPHZ){
                name = "宁乡跑胡子";
            }else if(wanfa == GameTypeEunmZP.YJGHZ){
                name = "沅江鬼胡子";
            }else if(wanfa == GameTypeEunmZP.ZZPH){
                name = "株洲碰胡";
            }else if(wanfa == GameTypeEunmZP.SMPHZ){
                name = "石门跑胡子";
            }else if(wanfa == GameTypeEunmZP.CDPHZ){
                name = "常德跑胡子";
            }else if(wanfa == GameTypeEunmZP.HHHGW){
                name = "怀化红拐弯";
            }else if(wanfa == GameTypeEunmZP.AXWMQ){
                name = "安乡偎麻雀";
            }else if(wanfa == GameTypeEunmZP.HSPHZ){
                name = "汉寿跑胡子";
            }else if(wanfa == GameTypeEunmZP.XXEQS){
                name = "湘西2710";
            }else if(wanfa == GameTypeEunmZP.HBGZP){
                name = "湖北个子牌";
            }else if(wanfa == GameTypeEunmZP.NXGHZ){
                name = "南县鬼胡子";
            }else if(wanfa == GameTypeEunmZP.YZLC){
                name = "永州老戳";
            }else if(wanfa == GameTypeEunmZP.YYWHZ){
                name = "益阳歪胡子";
            }else if(wanfa == GameTypeEunmZP.DYBP){
                name = "大字剥皮";
            }else if(wanfa == GameTypeEunmZP.WCPHZ){
                name = "望城跑胡子";
            }else if(wanfa == GameTypeEunmZP.XPLP){
                name = "溆浦老牌";
            }else if(wanfa == GameTypeEunmZP.XPPHZ){
                name = "溆浦跑胡子";
            }else if(wanfa == GameTypeEunmZP.JHSWZ){
                name = "江永十五张";
            }
        }else if(this.isDTZWanfa(wanfa)){
            name = "打筒子";
        }else if(this.isPDKWanfa(wanfa)){
            name = "跑得快";
        }else if(this.isHZMJWanfa(wanfa)){
            name = "红中麻将";
        }else if(this.isBSMJWanfa(wanfa)){
            name = "保山麻将";
        }else if(this.isTJMJWanfa(wanfa)){
            name = "桃江麻将";
        }else if(this.isZZMJWanfa(wanfa)){
            name = "转转麻将";
        }else if(this.isCSMJWanfa(wanfa)){
            name = "长沙麻将";
        }else if(wanfa == GameTypeEunmMJ.DZMJ){
            name = "道州麻将";
        }else if(wanfa == GameTypeEunmMJ.ZOUMJ){
            name = "郑州麻将";
        }else if(wanfa == GameTypeEunmMJ.JZMJ){
            name = "靖州麻将";
        }else if(wanfa == GameTypeEunmMJ.YYNXMJ){
            name = "南县麻将";
        }else if(this.isTDHWanfa(wanfa)){
            name = "湘阴推倒胡";
        }else if(wanfa == GameTypeEunmMJ.YJMJ){
            name = "沅江麻将";
        }else if(wanfa == GameTypeEunmMJ.CXMJ){
            name = "楚雄麻将";
        }else if(wanfa == GameTypeEunmMJ.GDCSMJ){
            name = "潮汕麻将";
        }else if(this.isSYMJWanfa(wanfa)){
            name = "邵阳麻将";
        }else if(this.isYZWDMJWanfa(wanfa)){
            name = "永州王钓麻将";
	    }else if(this.isAHMJWanfa(wanfa)){
            name = "安化麻将";
        }else if(wanfa == GameTypeEunmPK.XTSDH){
            name = "三打哈";
        }else if(wanfa == GameTypeEunmPK.DT){
            name = "掂坨";
        }else if(wanfa == GameTypeEunmPK.NSB){
            name = "牛十别";
        }else if(wanfa == GameTypeEunmPK.YYBS){
            name = "益阳巴十";
        }else if(wanfa == GameTypeEunmPK.CDTLJ){
            name = "常德拖拉机";
        }else if(wanfa == GameTypeEunmPK.TCGD){
            name = "桐城掼蛋";
        }else if(wanfa == GameTypeEunmPK.HSTH){
            name = "衡山同花";
        }else if(wanfa == GameTypeEunmPK.ERDDZ){
            name = "二人斗地主";
        }else if(wanfa == GameTypeEunmPK.QF){
            name = "沅江千分";
        }else if(wanfa == GameTypeEunmZP.HBGZP){
            name = "湖北个子牌";
        }else if(this.isTCMJWanfa(wanfa)){
            name = "通城麻将";
        }else if(this.isNXMJWanfa(wanfa)){
            name = "宁乡麻将";
        }else if(wanfa == GameTypeEunmMJ.KWMJ){
            name = "开王麻将";
        }else if(wanfa == GameTypeEunmMJ.DHMJ){
            name = "德宏麻将";
        }else if(wanfa == GameTypeEunmPK.XTBP){
            name = "新田包牌";
        }else if(wanfa == GameTypeEunmMJ.NYMJ){
            name = "宁远麻将";
        }else if(wanfa == GameTypeEunmMJ.TCPFMJ){
            name = "桐城跑风麻将";
        }else if(wanfa == GameTypeEunmMJ.TCDPMJ){
            name = "桐城点炮麻将";
        }else if(wanfa == GameTypeEunmMJ.YYMJ){
            name = "益阳麻将";
        }else if(wanfa == GameTypeEunmMJ.CQXZMJ){
            name = "重庆血战麻将";
        }else if(wanfa == GameTypeEunmPK.WZQ){
            name = "五子棋";
        }else if(wanfa == GameTypeEunmMJ.ZJMJ){
            name = "芷江麻将";
        }
        return name;
    },

    /**wanfaList 创建房间时传的玩法集合
     * count  几人玩法
     * */
    getPlayerCount:function(wanfaList){
        var wanfa = wanfaList[1];
        var count = 0;

        if(this.isDTZWanfa(wanfa)){
            if (wanfa==117 || wanfa==118 || wanfa == 210){
                count = 2;
            }else if(wanfa == 115 || wanfa == 116 || wanfa == 211) {
                count = 3;
            }else if(wanfa==113 || wanfa==114 || wanfa == 212) {
                count = 4;
            }
        }else if(this.isBSMJWanfa(wanfa)){
            count = wanfaList[3];
        }else{
            count = wanfaList[7];
        }
        return count;
    },

    getDissPlayerStr:function(resultMsg){
        var dissStr = "注：";
        var dissState = resultMsg.dissState;  //0正常结束1是群主解散2是中途玩家申请解散
        if (dissState == 1){
            dissStr = "注：群主解散房间";
        }else if (dissState == 2){
            dissStr = "注：";
            var shenqingStr = "";
            var tongyiStr = "";
            var dissPlayer = resultMsg.dissPlayer.split(",");
            for (var i = 0;i < dissPlayer.length;i++){
                if (i == 0){
                    shenqingStr =  dissPlayer[0];
                }else{
                    tongyiStr = tongyiStr + dissPlayer[i] + " ";
                }

            }
            shenqingStr = "申请解散:" + shenqingStr;
            tongyiStr = "同意解散:" + tongyiStr;
            dissStr = dissStr + shenqingStr + " " + tongyiStr;
        }else if (dissState == 0){
            dissStr = "注：正常打完结束";
        }else if(dissState == 3){
            dissStr = "注：托管解散";
        }else if(dissState == 4){
            dissStr = "注：因玩家";
            var dissPlayer = resultMsg.dissPlayer.split(",");
            var disLimit = resultMsg.creditDissLimit || 0;
            disLimit = MathUtil.toDecimal(disLimit/100);

            for(var i = 0;i<dissPlayer.length;++i){
                var name = dissPlayer[i];
                if(name){
                    if(name.length > 8)name = name.substr(0,8);
                    if(i > 0)dissStr += ";";
                    dissStr += ("【" + dissPlayer[i] + "】");
                }

            }

            dissStr += "比赛分低于" + disLimit + "分，中途解散";
        }
        return dissStr;
    },


    getLocalTime:function(inputTime) {

        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+'\n '+h+':'+minute+':'+second;

        //var now = new Date(time);
        //var year=now.getYear();
        //var month=now.getMonth()+1;
        //var date=now.getDate();
        //var hour=now.getHours();
        //var minute=now.getMinutes();
        //var second=now.getSeconds();
        //return "20"+year+"-"+month+"-"+date+"\n"+hour+":"+minute+":"+second;
    }
}

