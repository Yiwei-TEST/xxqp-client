/**
 * Created by zhoufan on 2017/7/13.
 */
var ClosingMjInfoResponder = BaseResponder.extend({

    respond:function(message){
        // cc.log("ClosingMjInfoResponder::"+JSON.stringify(message));
        var players = message.closingPlayers;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!LoginData.isLoadIcon()){//屏蔽头像加载
                p.icon = "";
                cc.log("head icon has blocked, now icon url is::"+ p.icon);
            }
            if(WXHeadIconManager.isRemoteHeadImg(p.icon)){
                p.icon = WXHeadIconManager.replaceUrl(p.icon);
                if(WXHeadIconManager.hasLocalHeadImg(p.userId)){
                    p.icon = WXHeadIconManager.getHeadImgPath(p.userId);
                }
            }
            p.winLoseCredit = Number(p.winLoseCredit) + Number(p.commissionCredit);
        }
        ClosingInfoModel.ext = message.ext;
        ClosingInfoModel.isReplay = false;
        ClosingInfoModel.closingPlayers = message.closingPlayers;
        ClosingInfoModel.cutCard = message.cutCard || [];
        ClosingInfoModel.groupLogId = message.groupLogId || 0;
        var wanfa = message.wanfa;
        // cc.log("message.isBreak =",JSON.stringify(message.isBreak));
        // cc.log("message.wanfa =",JSON.stringify(message.wanfa));
        if(message.isBreak){
            if(wanfa==GameTypeEunmMJ.ZZMJ){
                var mc = new ZZMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa== GameTypeEunmMJ.HZMJ) {
                var mc = new HZMJSmallResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa== GameTypeEunmMJ.ZJMJ) {
                var mc = new HZMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa == GameTypeEunmMJ.DZMJ || wanfa == GameTypeEunmMJ.ZOUMJ){
                var mc = new HZMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa== GameTypeEunmMJ.CXMJ || wanfa== GameTypeEunmMJ.AHMJ || wanfa== GameTypeEunmMJ.KWMJ
            || wanfa== GameTypeEunmMJ.TCPFMJ || wanfa== GameTypeEunmMJ.TCDPMJ || wanfa == GameTypeEunmMJ.YYNXMJ){
                var mc = new AHMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa== GameTypeEunmMJ.BSMJ || wanfa== GameTypeEunmMJ.DHMJ ){
                var mc = new BSMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa== GameTypeEunmMJ.YJMJ){
                var mc = new YJMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa == GameTypeEunmMJ.TJMJ || wanfa == GameTypeEunmMJ.TCMJ || wanfa == GameTypeEunmMJ.GDCSMJ
                || wanfa == GameTypeEunmMJ.NXMJ|| wanfa == GameTypeEunmMJ.NYMJ || wanfa== GameTypeEunmMJ.YYMJ
                || wanfa== GameTypeEunmMJ.JZMJ){
                var mc = new CSMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa == GameTypeEunmMJ.TDH || wanfa == GameTypeEunmMJ.CSMJ){
                var mc = new CSMJSmallResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa == GameTypeEunmMJ.SYMJ){
                var mc = new SYMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa == GameTypeEunmMJ.YZWDMJ){
                var mc = new YZWDMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(wanfa == GameTypeEunmMJ.CQXZMJ){
                var mc = new CQXZMJBigResultPop(message);
                PopupManager.addPopup(mc);
            }else if(GameTypeEunmZP.XPLP == wanfa){
                if(PopupManager.hasClassByPopup(XPLPSmallResultPop)){
                    PopupManager.removeClassByPopup(XPLPSmallResultPop);
                }
                mc = new XPLPBigResultPop(message);
                PopupManager.addPopup(mc);
            }
        }else{
            SyEventManager.dispatchEvent(SyEvent.OVER_PLAY,message);
        }
    }
})
