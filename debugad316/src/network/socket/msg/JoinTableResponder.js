/**
 * Created by Administrator on 2016/6/27.
 */
var JoinTableResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("JoinTableResponder::"+JSON.stringify(message));
        //{"player":{"userId":"111","name":"test111","seat":1,"sex":1,"icon":"123","point":0,"handCardIds":[],"outCardIds":[]},"nextSeat":null}
        var wanfa = message.wanfa;
        var p = message.player;
        if(WXHeadIconManager.isRemoteHeadImg(p.icon)){
            p.icon = WXHeadIconManager.replaceUrl(p.icon);
            if(WXHeadIconManager.hasLocalHeadImg(p.userId)){
                p.icon = WXHeadIconManager.getHeadImgPath(p.userId);
            }
        }
        switch (wanfa) {
            case GameTypeEunmPK.DTZI:
            case GameTypeEunmPK.DTZII://打筒子
            case GameTypeEunmPK.DTZIII:
            case GameTypeEunmPK.DTZIV:
            case GameTypeEunmPK.DTZV:
            case GameTypeEunmPK.DTZVI:
            case GameTypeEunmPK.DTZVII:
            case GameTypeEunmPK.DTZVIII:
            case GameTypeEunmPK.DTZIX:
                DTZRoomModel.join(message.player);
                break;
            case GameTypeEunmPK.PDKI:
            case GameTypeEunmPK.PDKII://跑得快
            case GameTypeEunmPK.PDK11:
            case GameTypeEunmPK.ZZPDK:
                PDKRoomModel.join(message.player);
                break;
            case GameTypeEunmZP.SYZP://邵阳字牌
            case GameTypeEunmZP.SYBP://邵阳剥皮
            case GameTypeEunmZP.LDFPF://放炮罚
            case GameTypeEunmZP.CZZP://郴州字牌
            case GameTypeEunmZP.LYZP://耒阳字牌
            case GameTypeEunmZP.ZHZ://捉红字
            case GameTypeEunmZP.WHZ://岳阳歪胡子
            case GameTypeEunmZP.LDS://落地扫
            case GameTypeEunmZP.YZCHZ://永州扯胡子
            case GameTypeEunmZP.HYLHQ://衡阳六胡抢
            case GameTypeEunmZP.HYSHK://衡阳十胡卡
            case GameTypeEunmZP.XTPHZ://湘潭跑胡子
            case GameTypeEunmZP.XXGHZ://湘乡告胡子
            case GameTypeEunmZP.XXPHZ://湘乡跑胡子
            case GameTypeEunmZP.AHPHZ://安化跑胡子
            case GameTypeEunmZP.GLZP://桂林字牌
            case GameTypeEunmZP.YJGHZ://沅江鬼胡子
            case GameTypeEunmZP.ZZPH://株洲碰胡
            case GameTypeEunmZP.NXPHZ://宁乡跑胡子
            case GameTypeEunmZP.LSZP://蓝山字牌
            case GameTypeEunmZP.SMPHZ://石门跑胡子
            case GameTypeEunmZP.CDPHZ://常德跑胡子
            case GameTypeEunmZP.HHHGW://怀化红拐弯
            case GameTypeEunmZP.HSPHZ://汉寿跑胡子
            case GameTypeEunmZP.XXEQS://湘西2710
            case GameTypeEunmZP.NXGHZ://南县鬼胡子
            case GameTypeEunmZP.YZLC://永州老戳
            case GameTypeEunmZP.YYWHZ://益阳歪胡子
            case GameTypeEunmZP.DYBP://大宇剥皮
            case GameTypeEunmZP.WCPHZ://望城跑胡子
            case GameTypeEunmZP.AXWMQ:
            case GameTypeEunmZP.XPPHZ:
            case GameTypeEunmZP.JHSWZ://江永十五张
                PHZRoomModel.join(message.player);
                break;
            case GameTypeEunmZP.XPLP://徐浦老牌
                XPLPRoomModel.join(message.player);
                break;
            case GameTypeEunmZP.HBGZP://湖北个子牌
                HBGZPRoomModel.join(message.player);
                break;
            case GameTypeEunmMJ.ZZMJ:
            case GameTypeEunmMJ.HZMJ:
            case GameTypeEunmMJ.DZMJ:
            case GameTypeEunmMJ.ZOUMJ:
            case GameTypeEunmMJ.BSMJ:
            case GameTypeEunmMJ.CSMJ:
            case GameTypeEunmMJ.SYMJ:
            case GameTypeEunmMJ.TDH:
            case GameTypeEunmMJ.YZWDMJ:
            case GameTypeEunmMJ.AHMJ:
            case GameTypeEunmMJ.TJMJ:
            case GameTypeEunmMJ.CXMJ:
            case GameTypeEunmMJ.GDCSMJ:
            case GameTypeEunmMJ.YJMJ:
            case GameTypeEunmMJ.TCMJ:
            case GameTypeEunmMJ.NXMJ:
  			case GameTypeEunmMJ.KWMJ:
            case GameTypeEunmMJ.DHMJ:
            case GameTypeEunmMJ.NYMJ:
            case GameTypeEunmMJ.TCPFMJ:
            case GameTypeEunmMJ.TCDPMJ:
            case GameTypeEunmMJ.YYNXMJ:
            case GameTypeEunmMJ.CQXZMJ:
            case GameTypeEunmMJ.YYMJ:
            case GameTypeEunmMJ.JZMJ:
            case GameTypeEunmMJ.ZJMJ:
                MJRoomModel.join(message.player);
                break;
            case GameTypeEunmPK.QF:
                QFRoomModel.join(message.player);
                break;
            case GameTypeEunmPK.WZQ:
                WZQRoomModel.join(message.player);
                break;
        }

        SyEventManager.dispatchTableEvent("JoinTable",message);

    }
})