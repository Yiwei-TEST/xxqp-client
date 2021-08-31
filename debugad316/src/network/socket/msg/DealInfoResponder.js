/**
 * Created by Administrator on 2016/6/27.
 */
var DealInfoResponder = BaseResponder.extend({

    respond:function(message){
        //cc.log("DealInfoResponder..." , message.gameType , JSON.stringify(message));
        var gameType = message.gameType;
        if(gameType == 8){          //打筒子
            DTZRoomModel.dealCard(message);
        }else if(gameType == 1 || gameType == GameTypeEunmPK.ZZPDK){    //跑得快
            PDKRoomModel.dealCard(message);
        }else if(gameType == 4 || gameType == GameTypeEunmZP.YJGHZ || gameType == GameTypeEunmZP.NXGHZ || gameType == GameTypeEunmZP.YYWHZ){    //跑胡子
            PHZRoomModel.dealCard(message);
        }else if(gameType==190){
            QFRoomModel.dealCard(message);
        }else if(gameType==GameTypeEunmZP.HBGZP){
            HBGZPRoomModel.dealCard(message);
        }else if(gameType==GameTypeEunmZP.XPLP){
            XPLPRoomModel.dealCard(message);
        }else if(gameType==GameTypeEunmZP.WZQ){
            WZQRoomModel.dealCard(message);
        }else{
            (typeof MJRoomModel !== "undefined") && MJRoomModel.dealCard(message);
        }

        SyEventManager.dispatchTableEvent("DealCard",message);

        //亲友圈豆子结算房间统一显示房费
        UITools.showTiketInRoom();
    }
})