/**
 * Created by zhoufan on 2016/6/24.
 */
var CreateTableResponder = BaseResponder.extend({

    loaderList:[],
    message:null,

    respond:function(message){
        this.message = message;
        cc.log("CreateTableResponder::"+JSON.stringify(message));
        //sy.scene.hideLoading();
        PopupManager.removeAll();
        var players = message.players;
        var loaderList = this.loaderList = [];
        // UserLocalDataModel.usePhotoMsg = {};//每次开始游戏重置头像框信息
        for(var i=0;i<players.length;i++){
            // cc.log("player.handcardsId =",JSON.stringify(players[i].handCardIds));
            var p = players[i];
            p.icon = WXHeadIconManager.replaceUrl(p.icon);
            var userId = p.userId;
            // UserLocalDataModel.usePhotoMsg[userId] = p.usePhoto;
            var icon = p.icon;
            if(SyConfig.isIos()){
                if(WXHeadIconManager.isRemoteHeadImg(icon)){
                    var hasLocal = WXHeadIconManager.hasLocalHeadImg(userId);
                    if(hasLocal)
                        p.icon = WXHeadIconManager.getHeadImgPath(userId);
                    //if(WXHeadIconManager.isHeadImgRefresh(userId,icon) || !hasLocal){
                    //    if(!WXHeadIconManager.hasLoaded(userId))
                    //        loaderList.push({userId:userId,icon:icon});
                    //}else{
                    //    p.icon = WXHeadIconManager.getHeadImgPath(userId);
                    //}
                }
            }
        }


        GPSModel.clean();
        GPSSdkUtil.startLocation();
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(p.gps)
                GPSModel.updateGpsData(p.userId, p.gps);
        }

        if(loaderList.length>0){
            this.loadIcon();
        }else{
            this.isNeedLoadJsList(message);
        }
        // var bool = PHZRoomModel
        if(message.fromOverPop == 1){//从结算弹框过来的createtable消息，重新再发个准备消息过去，防止createtable和deal消息先后顺序不对
            sySocket.sendComReqMsg(4);
        }
        GPSModel.calcDistance(PlayerModel.userId);

        cc.sys.localStorage.setItem("PLAY_TYPE",message.wanfa);
    },

    isNeedLoadJsList:function(message){
        var self = this;
        //var gameType = message.wanfa;
        //if (GameTypeManager.isLoadJsList(gameType)){
        //    this.toRoom(message)
        //}else{
            //var callBack = function(){
                self.toRoom(message);
            //}
            //sy.scene.updatelayer.getUpdatePath(gameType,callBack);
        //}
    },

    toRoom:function(message){
        var wanfa = message.wanfa;
        //cc.log("创建房间成功 wafa ... " , wanfa);
        BaseRoomModel.curRoomData = message;
        LayerManager.inRoom = true;

        //娱乐场房间去掉房间名称的显示
        if(BaseRoomModel.isGoldRoom()){
            message.roomName = "";
        }

        if(GameTypeManager.isMJ(wanfa)){
            MJRoomModel.init(message);
            var LayerName = LayerFactory.NEW_MJ_ROOM;
            if(message.renshu == 3) {
                LayerName = LayerFactory.NEW_MJ_ROOM_THREE;
            } else if(message.renshu == 2){
                LayerName = LayerFactory.NEW_MJ_ROOM_TWO;
            }
            LayerManager.showLayer(LayerName);
            var layer = LayerManager.getLayer(LayerName);
            layer.initData();
        }else{
            switch (wanfa){
                case GameTypeEunmPK.DTZI:
                case GameTypeEunmPK.DTZII://打筒子
                case GameTypeEunmPK.DTZIII:
                case GameTypeEunmPK.DTZIV:
                case GameTypeEunmPK.DTZV:
                case GameTypeEunmPK.DTZVI:
                case GameTypeEunmPK.DTZVII:
                case GameTypeEunmPK.DTZVIII:
                case GameTypeEunmPK.DTZIX:
                    DTZRoomModel.init(message);
                    var layerName = DTZRoomModel.is4Ren() ? LayerFactory.DTZ_ROOM : LayerFactory.DTZ_3REN_ROOM;
                    if (DTZRoomModel.isMoneyRoom()){
                        layerName = LayerFactory.DTZ_MONEY_ROOM;
                    }
                    LayerManager.showLayer(layerName);
                    var layer = LayerManager.getLayer(layerName);
                    layer.initData();
                    break;
                case GameTypeEunmPK.PDKI:
                case GameTypeEunmPK.PDKII://跑得快
                case GameTypeEunmPK.PDK11:
                case GameTypeEunmPK.ZZPDK:
                    PDKRoomModel.init(message);
                    var layerName = LayerFactory.PDK_ROOM;
                    if(PDKRoomModel.isMoneyRoom()){
                        layerName = LayerFactory.PDK_GOLD_ROOM;
                    }else if(PDKRoomModel.isGoldMatchRoom()){
                        layerName = LayerFactory.PDK_MONEY_ROOM;
                    }
                    LayerManager.showLayer(layerName);
                    var layer = LayerManager.getLayer(layerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.SYZP://邵阳字牌
                case GameTypeEunmZP.LDFPF://娄底放炮罚
                case GameTypeEunmZP.SYBP://邵阳剥皮
                case GameTypeEunmZP.CZZP://郴州字牌
                case GameTypeEunmZP.LYZP://耒阳字牌
                case GameTypeEunmZP.WHZ://岳阳歪胡子
                case GameTypeEunmZP.LDS://落地扫
                case GameTypeEunmZP.HYLHQ://衡阳六胡抢
                case GameTypeEunmZP.HYSHK://衡阳十胡卡
                case GameTypeEunmZP.XTPHZ://湘潭跑胡子
                case GameTypeEunmZP.XXGHZ://湘乡告胡子
                case GameTypeEunmZP.XXPHZ://湘乡跑胡子
                case GameTypeEunmZP.GLZP://桂林字牌
                case GameTypeEunmZP.NXPHZ://宁乡跑胡子
                case GameTypeEunmZP.LSZP://蓝山字牌
                case GameTypeEunmZP.SMPHZ://石门跑胡子
                case GameTypeEunmZP.CDPHZ://常德跑胡子
                case GameTypeEunmZP.HHHGW://怀化红拐弯
                case GameTypeEunmZP.HSPHZ://汉寿跑胡子
                case GameTypeEunmZP.YZLC://永州老戳
                case GameTypeEunmZP.DYBP://大宇剥皮
                case GameTypeEunmZP.AXWMQ://安乡偎麻雀
                case GameTypeEunmZP.JHSWZ://江永十五张
                    PHZRoomModel.init(message);
                    var LayerName = LayerFactory.PHZ_ROOM_MORE;
                    if (message.renshu==3){
                        LayerName = LayerFactory.PHZ_ROOM;
                    }else if (message.renshu==2){
                        LayerName = LayerFactory.PHZ_ROOM_LESS;
                    }
                    if(PHZRoomModel.isMoneyRoom()){
                        if(message.renshu==4){
                            LayerName = LayerFactory.PHZ_MONEY_ROOM_MORE;
                        }else if(message.renshu==3){
                            LayerName = LayerFactory.PHZ_MONEY_ROOM_THREE;
                        }else{
                            LayerName = LayerFactory.PHZ_MONEY_ROOM;
                        }
                    }
                    //cc.log("LayerName========"+LayerName)
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.XPPHZ:
                    PHZRoomModel.init(message);
                    var LayerName = LayerFactory.XPPHZ_ROOM;
                    if (message.renshu==2){
                        LayerName = LayerFactory.XPPHZ_ROOM_LESS;
                    }
                    // cc.log("LayerName========"+LayerName)
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.XPLP://徐浦老牌
                    XPLPRoomModel.init(message);
                    var LayerName = LayerFactory.XPLP_ROOM_MORE;
                    if (message.renshu==2){
                        LayerName = LayerFactory.XPLP_ROOM_LESS;
                    }else if(message.renshu==3){
                        LayerName = LayerFactory.XPLP_ROOM;
                    }
                    // cc.log("LayerName========"+LayerName)
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.XXEQS://湘西2710
                    PHZRoomModel.init(message);
                    var LayerName = LayerFactory.XXEQS_ROOM;
                    if (message.renshu==2){
                        LayerName = LayerFactory.XXEQS_ROOM_LESS;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.NXGHZ://南县鬼胡子
                case GameTypeEunmZP.YYWHZ://益阳歪胡子
                    PHZRoomModel.init(message);
                    var LayerName = LayerFactory.NXGHZ_ROOM;

                    if (message.renshu==2){
                        LayerName = LayerFactory.NXGHZ_ROOM_LESS;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.YZCHZ://永州扯胡子
                    PHZRoomModel.init(message);
                    LayerName = LayerFactory.YZCHZ_ROOM;
                    if (message.renshu==2){
                        LayerName = LayerFactory.YZCHZ_ROOM_LESS;
                    }
                    // cc.log("LayerName========"+LayerName)
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.HBGZP://湖北个子牌
                    HBGZPRoomModel.init(message);
                    var LayerName = LayerFactory.HBGZP_ROOM_MORE;
                    if (message.renshu==2){
                        LayerName = LayerFactory.HBGZP_ROOM_LESS;
                    }else if(message.renshu==3){
                        LayerName = LayerFactory.HBGZP_ROOM;
                    }
                    // cc.log("LayerName========"+LayerName)
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.ZHZ://捉红字
                    PHZRoomModel.init(message);
                    var LayerName = LayerFactory.ZHZ_ROOM_MORE;
                    if (message.renshu==3){
                        LayerName = LayerFactory.ZHZ_ROOM;
                    }else if (message.renshu==2){
                        LayerName = LayerFactory.ZHZ_ROOM_LESS;
                    }
                    //cc.log("LayerName========"+LayerName)
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.AHPHZ://安化跑胡子
                    PHZRoomModel.init(message);
                    LayerName = LayerFactory.AHPHZ_ROOM;
                    if (message.renshu==2){
                        LayerName = LayerFactory.AHPHZ_ROOM_LESS;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.WCPHZ://安化跑胡子
                    PHZRoomModel.init(message);
                    LayerName = LayerFactory.WCPHZ_ROOM;
                    if (message.renshu==2){
                        LayerName = LayerFactory.WCPHZ_ROOM_LESS;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.YJGHZ://鬼胡子
                    PHZRoomModel.init(message);
                    var LayerName = LayerFactory.YJGHZ_ROOM;

                    if (message.renshu==2){
                        LayerName = LayerFactory.YJGHZ_ROOM_LESS;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmZP.ZZPH://株洲碰胡
                    PHZRoomModel.init(message);
                    LayerName = LayerFactory.ZZPH_ROOM;
                    if (message.renshu==2){
                        LayerName = LayerFactory.ZZPH_ROOM_LESS;
                    }else if (message.renshu==4){
                        LayerName = LayerFactory.ZZPH_ROOM_MORE;
                    }
                    //cc.log("LayerName========"+LayerName)
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.ZZMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.ZZMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.ZZMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.ZZMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.HZMJ:
                case GameTypeEunmMJ.DZMJ:
                case GameTypeEunmMJ.ZOUMJ:
                case GameTypeEunmMJ.ZJMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.HZMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.HZMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.HZMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.BSMJ:
                case GameTypeEunmMJ.DHMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.BSMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.BSMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.BSMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.CSMJ:
                case GameTypeEunmMJ.TDH:
                case GameTypeEunmMJ.GDCSMJ:
                case GameTypeEunmMJ.TCMJ:
                case GameTypeEunmMJ.NXMJ:
                case GameTypeEunmMJ.NYMJ:
                case GameTypeEunmMJ.YYMJ:
                case GameTypeEunmMJ.JZMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.CSMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.CSMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.CSMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.TJMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.TJMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.TJMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.TJMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.AHMJ:
                case GameTypeEunmMJ.CXMJ:
                case GameTypeEunmMJ.KWMJ:
                case GameTypeEunmMJ.TCDPMJ:
                case GameTypeEunmMJ.TCPFMJ:
                case GameTypeEunmMJ.YYNXMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.AHMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.AHMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.AHMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.SYMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.SYMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.SYMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.SYMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.CQXZMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.CQXZMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.CQXZMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.CQXZMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.YJMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.YJMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.YJMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.YJMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmMJ.YZWDMJ:
                    MJRoomModel.init(message);
                    var LayerName = LayerFactory.YZWDMJ_ROOM;
                    if(message.renshu == 3) {
                        LayerName = LayerFactory.YZWDMJ_ROOM_THREE;
                    } else if(message.renshu == 2){
                        LayerName = LayerFactory.YZWDMJ_ROOM_TWO;
                    }
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData();
                    break;
                case GameTypeEunmPK.XTSDH:
                case GameTypeEunmPK.XTBP:
                    SDHRoomModel.init(message);

                    var layerName = "SDH_ROOM";
                    if(wanfa == GameTypeEunmPK.XTBP){
                        layerName = "XTBP_ROOM";
                    }
                    var layer = LayerManager.showLayer(layerName);
                    layer.handleTableData("CreateTable",message);
                    break;
                case GameTypeEunmPK.QF:
                    var curLayerName = LayerManager.getCurrentLayer();
                    QFRoomModel.init(message);
                    var LayerName = LayerFactory.QF_ROOM;
                    LayerManager.showLayer(LayerName);
                    var layer = LayerManager.getLayer(LayerName);
                    layer.initData(curLayerName == LayerFactory.LOGIN);
                    break;
                case GameTypeEunmPK.WZQ:
                    cc.log("WZQRoomModel",JSON.stringify(message))
                    WZQRoomModel.init(message);
                    var layerName = LayerFactory.WZQ_ROOM;
                    LayerManager.showLayer(layerName);
                    var layer = LayerManager.getLayer(layerName);
                    layer.initData();
                    break;
                case GameTypeEunmPK.DT:
                    DTRoomModel.init(message);
                    var layer = LayerManager.showLayer("DT_ROOM");
                    layer.handleTableData("CreateTable",message);
                    break;
                case GameTypeEunmPK.NSB:
                    NSBRoomModel.init(message);
                    var layer = LayerManager.showLayer("NSB_ROOM");
                    layer.handleTableData("CreateTable",message);
                    break;
                case GameTypeEunmPK.YYBS:
                    YYBSRoomModel.init(message);
                    var layer = LayerManager.showLayer("YYBS_ROOM");
                    layer.handleTableData(YYBSTabelType.CreateTable,message);
                    break;
                case GameTypeEunmPK.TCGD:
                    TCGDRoomModel.init(message);
                    var layer = LayerManager.showLayer("TCGD_ROOM");
                    layer.handleTableData(TCGDTabelType.CreateTable,message);
                    break;
                case GameTypeEunmPK.HSTH:
                    HSTHRoomModel.init(message);
                    var layer = LayerManager.showLayer("HSTH_ROOM");
                    layer.handleTableData(HSTHTabelType.CreateTable,message);
                    break;
                case GameTypeEunmPK.ERDDZ:
                    ERDDZRoomModel.init(message);
                    var layer = LayerManager.showLayer("ERDDZ_ROOM");
                    layer.handleTableData(ERDDZTabelType.CreateTable,message);
                    break;
                case GameTypeEunmPK.CDTLJ:
                    CDTLJRoomModel.init(message);
                    var layer = LayerManager.showLayer("CDTLJ_ROOM");
                    layer.handleTableData(CDTLJTabelType.CreateTable,message);
                    break;
            }
        }

        IMSdkUtil.sdkApplyMessageKey("");


    },

    loadIcon:function(){
        if(this.loaderList.length<=0){
            this.isNeedLoadJsList(this.message);
            return;
        }
        var obj = this.loaderList.pop();
        WXHeadIconManager.saveFile(obj.userId,obj.icon,this.loadIcon,this);
        cc.log("weixinIconMsg..." , JSON.stringify(obj.icon));
    }
})
