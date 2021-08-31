/**
 * Created by zhoufan on 2016/6/24.
 */
var LayerFactory = {
    ROOM:"res/dtzRoom.json",
    PYQ_HALL:"res/pyqHall.json",
    PDK_ROOM:"res/pdkRoom.json",
    PDK_MONEY_ROOM:"res/pdkMoneyRoom.json",
    PDK_GOLD_ROOM:"res/pdkGoldRoom.json",
    DTZ_ROOM:"res/dtzRoom.json",
    DTZ_MONEY_ROOM:"res/dtzMoney3RenRoom.json",
    DTZ_3REN_ROOM:"res/dtz3RenRoom.json",
    PHZ_ROOM_MORE:"res/phzRoomMore.json",
    PHZ_ROOM_LESS:"res/phzRoom2Ren.json",
    PHZ_MONEY_ROOM:"res/phzMoneyRoom.json",
    PHZ_MONEY_ROOM_MORE:"res/phzMoneyRoomMore.json",
    PHZ_MONEY_ROOM_THREE:"res/phzMoneyRoomThree.json",
    PHZ_REPLAY:"res/phzReplay.json",
    PHZ_REPLAY_MORE:"res/phzReplayMore.json",
    PHZ_REPLAY_LESS:"res/phzReplayLess.json",
    MJ_ROOM:"res/mjRoom.json",
    PHZ_ROOM:"res/phzRoom.json",
    HOME:"res/bjdHome.json",
    BJD_HOME:"res/bjdHome.json",
    LOGIN:"res/login.json",
    PDK_REPLAY:"res/pdkReplay.json",
    DTZ_REPLAY:"res/dtzReplay.json",
    DTZ_REPLAY_THREE:"res/dtz3RenReplay.json",
    XPPHZ_ROOM_LESS:"res/xpphzRoom2Ren.json",
    XPPHZ_ROOM:"res/xpphzRoom.json",
    XPPHZ_REPLAY:"res/xpphzReplay.json",
    XPPHZ_REPLAY_LESS:"res/xpphzReplayLess.json",

    BSMJ_ROOM:"res/bsmjRoom.json",
    BSMJ_ROOM_TWO:"res/bsmjRoomTwo.json",
    BSMJ_ROOM_THREE:"res/bsmjRoomThree.json",
    BSMJ_REPLAY:"res/bsmjReplay.json",
    BSMJ_REPLAY_TWO:"res/bsmjReplayTwo.json",
    BSMJ_REPLAY_THREE:"res/bsmjReplayThree.json",
    HZMJ_ROOM:"res/hzmjRoom.json",
    HZMJ_ROOM_TWO:"res/hzmjRoomTwo.json",
    HZMJ_ROOM_THREE:"res/hzmjRoomThree.json",
    HZMJ_REPLAY:"res/hzmjReplay.json",
    HZMJ_REPLAY_TWO:"res/hzmjReplayTwo.json",
    HZMJ_REPLAY_THREE:"res/hzmjReplayThree.json",
    CSMJ_ROOM:"res/csmjRoom.json",
    CSMJ_ROOM_TWO:"res/csmjRoomTwo.json",
    CSMJ_ROOM_THREE:"res/csmjRoomThree.json",
    AHMJ_ROOM:"res/ahmjRoom.json",
    AHMJ_ROOM_TWO:"res/ahmjRoomTwo.json",
    AHMJ_ROOM_THREE:"res/ahmjRoomThree.json",
    ZZMJ_ROOM:"res/zzmjRoom.json",
    ZZMJ_ROOM_TWO:"res/zzmjRoomTwo.json",
    ZZMJ_ROOM_THREE:"res/zzmjRoomThree.json",
    TJMJ_ROOM:"res/tjmjRoom.json",
    TJMJ_ROOM_TWO:"res/tjmjRoomTwo.json",
    TJMJ_ROOM_THREE:"res/tjmjRoomThree.json",
    ZHZ_ROOM_MORE:"res/zhzRoomMore.json",
    ZHZ_ROOM_LESS:"res/zhzRoom2Ren.json",
    ZHZ_ROOM:"res/zhzRoom.json",
    AHPHZ_ROOM:"res/ahphzRoom.json",
    AHPHZ_ROOM_LESS:"res/ahphzRoom2Ren.json",
    SYMJ_ROOM:"res/symjRoom.json",
    SYMJ_ROOM_TWO:"res/symjRoomTwo.json",
    SYMJ_ROOM_THREE:"res/symjRoomThree.json",
    SYMJ_REPLAY:"res/symjReplay.json",
    SYMJ_REPLAY_TWO:"res/symjReplayTwo.json",
    SYMJ_REPLAY_THREE:"res/symjReplayThree.json",
    CQXZMJ_ROOM:"res/cqxzmjRoom.json",
    CQXZMJ_ROOM_TWO:"res/cqxzmjRoomTwo.json",
    CQXZMJ_ROOM_THREE:"res/cqxzmjRoomThree.json",
    CQXZMJ_REPLAY:"res/cqxzmjReplay.json",
    CQXZMJ_REPLAY_TWO:"res/cqxzmjReplayTwo.json",
    CQXZMJ_REPLAY_THREE:"res/cqxzmjReplayThree.json",
    YZWDMJ_ROOM_TWO:"res/yzwdmjRoomTwo.json",
    YZWDMJ_ROOM_THREE:"res/yzwdmjRoomThree.json",
    YZWDMJ_ROOM:"res/yzwdmjRoom.json",
    YZWDMJ_REPLAY:"res/yzwdmjReplay.json",
    YZWDMJ_REPLAY_TWO:"res/yzwdmjReplayTwo.json",
    YZWDMJ_REPLAY_THREE:"res/yzwdmjReplayThree.json",
    YZCHZ_ROOM:"res/yzchzRoom.json",
    YZCHZ_ROOM_LESS:"res/yzchzRoom2Ren.json",
    YJGHZ_ROOM:"res/yjghzRoom.json",
    YJGHZ_ROOM_LESS:"res/yjghzRoom2Ren.json",
    ZZMJ_REPLAY:"res/zzmjReplay.json",
    ZZMJ_REPLAY_TWO:"res/zzmjReplayTwo.json",
    ZZMJ_REPLAY_THREE:"res/zzmjReplayThree.json",
    CSMJ_REPLAY:"res/csmjReplay.json",
    CSMJ_REPLAY_TWO:"res/csmjReplayTwo.json",
    CSMJ_REPLAY_THREE:"res/csmjReplayThree.json",
    QF_ROOM:"res/qfRoom.json",
    QF_REPLAY:"res/qfReplay.json",
    YJMJ_ROOM:"res/yjmjRoom.json",
    YJMJ_ROOM_TWO:"res/yjmjRoomTwo.json",
    YJMJ_ROOM_THREE:"res/yjmjRoomThree.json",
    ZZPH_ROOM_MORE:"res/zzphRoomMore.json",
    ZZPH_ROOM_LESS:"res/zzphRoom2Ren.json",
    ZZPH_ROOM:"res/zzphRoom.json",
    HBGZP_ROOM:"res/hbgzpRoom.json",
    HBGZP_ROOM_MORE:"res/hbgzpRoomMore.json",
    HBGZP_ROOM_LESS:"res/hbgzpRoom2Ren.json",
    XPLP_ROOM:"res/xplpRoom.json",
    XPLP_ROOM_MORE:"res/xplpRoomMore.json",
    XPLP_ROOM_LESS:"res/xplpRoomLess.json",
    XPLP_REPLAY:"res/xplpReplay.json",
    XPLP_REPLAY_MORE:"res/xplpReplayMore.json",
    XPLP_REPLAY_LESS:"res/xplpReplayLess.json",
    HBGZP_REPLAY:"res/hbgzpReplay.json",
    HBGZP_REPLAY_MORE:"res/hbgzpReplayMore.json",
    HBGZP_REPLAY_LESS:"res/hbgzpReplayLess.json",
    AHMJ_REPLAY:"res/ahmjReplay.json",
    AHMJ_REPLAY_TWO:"res/ahmjReplayTwo.json",
    AHMJ_REPLAY_THREE:"res/ahmjReplayThree.json",
    YJMJ_REPLAY:"res/yjmjReplay.json",
    YJMJ_REPLAY_TWO:"res/yjmjReplayTwo.json",
    YJMJ_REPLAY_THREE:"res/yjmjReplayThree.json",
    XXEQS_ROOM_LESS:"res/xxeqsRoom2Ren.json",
    XXEQS_ROOM:"res/xxeqsRoom.json",
    NXGHZ_ROOM_LESS:"res/nxghzRoom2Ren.json",
    NXGHZ_ROOM:"res/nxghzRoom.json",
    WZQ_ROOM:"res/wzqRoom.json",
    WCPHZ_ROOM:"res/wcphzRoom.json",
    WCPHZ_ROOM_LESS:"res/wcphzRoom2Ren.json",

    GOLD_LAYER:"res/goldConfigLayer.json",

    NEW_MJ_ROOM:"res/mjRoom.json",
    NEW_MJ_ROOM_TWO:"res/mjRoomTwo.json",
    NEW_MJ_ROOM_THREE:"res/mjRoomThree.json",
    NEW_MJ_REPLAY:"res/mjReplay.json",
    NEW_MJ_REPLAY_TWO:"res/mjReplayTwo.json",
    NEW_MJ_REPLAY_THREE:"res/mjReplayThree.json",

    buildInst:function(name){
        var layer = null;
        cc.log("name =",name);
        switch (name){
            case this.ROOM:
                layer = new DTZRoom(name);
                break;
            case this.DTZ_ROOM:
                layer = new DTZRoom(name);
                break;
            case this.DTZ_3REN_ROOM:
                layer = new DTZRoom(name);
                break;
            //case this.DTZ_MONEY_ROOM:
            //    layer = new DTZMoneyRoom(name);
            //    break;
            case this.PDK_ROOM:
                layer = new PDKRoom();
                break;
            //case this.PDK_MONEY_ROOM:
            //    layer = new PDKMoneyRoom();
            //    break;
            //case this.PDK_GOLD_ROOM:
            //    layer = new PDKGoldRoom();
            //    break;
            case this.HOME:
                layer = new BjdHomeLayer();
                break;
            case this.BJD_HOME:
                layer = new BjdHomeLayer();
                break;
            case this.LOGIN:
                layer = new LoginLayer();
                break;
            case this.PDK_REPLAY:
            	layer = new PDKReplay();
            	break;
            case this.DTZ_REPLAY_THREE:
            case this.DTZ_REPLAY:
                layer = new DTZReplay(name);
                break;
            case this.PHZ_ROOM:
            case this.PHZ_ROOM_MORE:
            case this.PHZ_ROOM_LESS:
                if(PHZRoomModel.wanfa == GameTypeEunmZP.YZLC){
                    layer = new YZLCRoom(name);
                }else if(PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
                    layer = new DYBPRoom(name);
                }else{
                    layer = new PHZRoom(name);
                }
                break;
            case this.XPPHZ_ROOM:
            case this.XPPHZ_ROOM_LESS:
                layer = new XPPHZRoom(name);
                break;
            case this.XPPHZ_REPLAY:
            case this.XPPHZ_REPLAY_LESS:
                layer = new XPPHZReplay(name);
                break;
            case this.YZCHZ_ROOM:
            case this.YZCHZ_ROOM_LESS:
                layer = new YZCHZRoom(name);
                break;
            case this.YJGHZ_ROOM:
            case this.YJGHZ_ROOM_LESS:
                layer = new YJGHZRoom(name);
                break;
            case this.ZHZ_ROOM:
            case this.ZHZ_ROOM_MORE:
            case this.ZHZ_ROOM_LESS:
                layer = new ZHZRoom(name);
                break;
            case this.AHPHZ_ROOM:
            case this.AHPHZ_ROOM_LESS:
                layer = new AHPHZRoom(name);
                break;
            //case this.PHZ_MONEY_ROOM:
            //case this.PHZ_MONEY_ROOM_MORE:
            //case this.PHZ_MONEY_ROOM_THREE:
            //    layer = new PHZMoneyRoom(name);
            //    break;
            case this.ZZPH_ROOM_LESS:
            case this.ZZPH_ROOM:
            case this.ZZPH_ROOM_MORE:
                layer = new ZZPHRoom(name);
                break;
            case this.PHZ_REPLAY:
            case this.PHZ_REPLAY_MORE:
            case this.PHZ_REPLAY_LESS:
                if(PHZRePlayModel.playType == GameTypeEunmZP.YJGHZ || PHZRePlayModel.playType == GameTypeEunmZP.NXGHZ || PHZRePlayModel.playType == GameTypeEunmZP.YYWHZ){
                    layer = new YJGHZReplay(name);
                }else if(PHZRePlayModel.playType == GameTypeEunmZP.YZLC){
                    layer = new YZLCReplay(name);
                }else{
                    layer = new PHZReplay(name);
                }
                break;
            case this.HBGZP_ROOM:
            case this.HBGZP_ROOM_MORE:
            case this.HBGZP_ROOM_LESS:
                layer = new HBGZPRoom(name);
                break;
            case this.XPLP_ROOM:
            case this.XPLP_ROOM_MORE:
            case this.XPLP_ROOM_LESS:
                layer = new XPLPRoom(name);
                break;
            case this.XPLP_REPLAY:
            case this.XPLP_REPLAY_MORE:
            case this.XPLP_REPLAY_LESS:
                layer = new XPLPReplay(name);
                break;
            case this.HBGZP_REPLAY:
            case this.HBGZP_REPLAY_MORE:
            case this.HBGZP_REPLAY_LESS:
                layer = new HBGZPReplay(name);
                break;
            case this.BSMJ_ROOM:
            case this.BSMJ_ROOM_TWO:
            case this.BSMJ_ROOM_THREE:
                layer = new BSMJRoom(name);
                break;
            case this.BSMJ_REPLAY:
            case this.BSMJ_REPLAY_TWO:
            case this.BSMJ_REPLAY_THREE:
                layer = new BSMJReplay(name);
                break;
            case this.HZMJ_ROOM:
            case this.HZMJ_ROOM_TWO:
            case this.HZMJ_ROOM_THREE:
                if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ
                    || MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
                    layer = new DZMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.ZJMJ){
                    layer = new ZJMJRoom(name);
                }else{
                    layer = new HZMJRoom(name);
                }
                break;
            case this.YJMJ_ROOM:
            case this.YJMJ_ROOM_TWO:
            case this.YJMJ_ROOM_THREE:
                layer = new YJMJRoom(name);
                break;
            case this.CSMJ_ROOM:
            case this.CSMJ_ROOM_TWO:
            case this.CSMJ_ROOM_THREE:
                if(MJRoomModel.wanfa == GameTypeEunmMJ.YYMJ){
                    layer = new YYMJRoom(name);
                }else{
                    layer = new CSMJRoom(name);
                }
                break;
            case this.CSMJ_REPLAY:
            case this.CSMJ_REPLAY_TWO:
            case this.CSMJ_REPLAY_THREE:
                layer = new CSMJReplay(name);
                break;
            case this.AHMJ_ROOM:
            case this.AHMJ_ROOM_TWO:
            case this.AHMJ_ROOM_THREE:
                layer = new AHMJRoom(name);
                break;
            case this.HZMJ_REPLAY:
            case this.HZMJ_REPLAY_TWO:
            case this.HZMJ_REPLAY_THREE:
                layer = new HZMJReplay(name);
                break;
            case this.AHMJ_REPLAY:
            case this.AHMJ_REPLAY_TWO:
            case this.AHMJ_REPLAY_THREE:
                layer = new AHMJReplay(name);
                break;
            case this.YJMJ_REPLAY:
            case this.YJMJ_REPLAY_TWO:
            case this.YJMJ_REPLAY_THREE:
                layer = new YJMJReplay(name);
                break;
            case this.ZZMJ_REPLAY:
            case this.ZZMJ_REPLAY_TWO:
            case this.ZZMJ_REPLAY_THREE:
                layer = new ZZMJReplay(name);
                break;
            case this.ZZMJ_ROOM:
            case this.ZZMJ_ROOM_TWO:
            case this.ZZMJ_ROOM_THREE:
                layer = new ZZMJRoom(name);
                break;
            case this.TJMJ_ROOM:
            case this.TJMJ_ROOM_TWO:
            case this.TJMJ_ROOM_THREE:
                layer = new TJMJRoom(name);
                break;
            case this.SYMJ_ROOM:
            case this.SYMJ_ROOM_TWO:
            case this.SYMJ_ROOM_THREE:
                layer = new SYMJRoom(name);
                break;
            case this.CQXZMJ_ROOM:
            case this.CQXZMJ_ROOM_TWO:
            case this.CQXZMJ_ROOM_THREE:
                layer = new CQXZMJRoom(name);
                break;
            case this.SYMJ_REPLAY:
            case this.SYMJ_REPLAY_TWO:
            case this.SYMJ_REPLAY_THREE:
                layer = new SYMJReplay(name);
                break;
            case this.CQXZMJ_REPLAY:
            case this.CQXZMJ_REPLAY_TWO:
            case this.CQXZMJ_REPLAY_THREE:
                layer = new CQXZMJReplay(name);
                break;
            case this.YZWDMJ_ROOM_TWO:
            case this.YZWDMJ_ROOM_THREE:
            case this.YZWDMJ_ROOM:
                layer = new YZWDMJRoom(name);
                break;
            case this.QF_ROOM:
                layer = new QFRoom(name);
                break;
            case this.QF_REPLAY:
                layer = new QFSeePlayBackLayer(name);
                break;
            case this.YZWDMJ_REPLAY:
            case this.YZWDMJ_REPLAY_TWO:
            case this.YZWDMJ_REPLAY_THREE:
                layer = new YZWDMJReplay(name);
                break;
            case this.XXEQS_ROOM:
            case this.XXEQS_ROOM_LESS:
                layer = new XXEQSRoom(name);
                break;
            case this.NXGHZ_ROOM:
            case this.NXGHZ_ROOM_LESS:
                layer = new NXGHZRoom(name);
                break;
            case this.WZQ_ROOM:
                layer = new WZQRoom(name);
                break;
            case this.WCPHZ_ROOM:
            case this.WCPHZ_ROOM_LESS:
                layer = new WCPHZRoom(name);
                break;
            case this.NEW_MJ_ROOM:
            case this.NEW_MJ_ROOM_TWO:
            case this.NEW_MJ_ROOM_THREE:
                if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ
                    || MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
                    layer = new DZMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.ZJMJ){
                    layer = new ZJMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.HZMJ){
                    layer = new HZMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.BSMJ || MJRoomModel.wanfa == GameTypeEunmMJ.DHMJ){
                    layer = new BSMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.TJMJ){
                    layer = new TJMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ || MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ ||
                    MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ || MJRoomModel.wanfa == GameTypeEunmMJ.TCDPMJ ||
                    MJRoomModel.wanfa == GameTypeEunmMJ.TCPFMJ || MJRoomModel.wanfa == GameTypeEunmMJ.YYNXMJ){
                    layer = new AHMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.YJMJ){
                    layer = new YJMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.YZWDMJ){
                    layer = new YZWDMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.SYMJ){
                    layer = new SYMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.CQXZMJ){
                    layer = new CQXZMJRoom(name);
                }else if(MJRoomModel.wanfa == GameTypeEunmMJ.ZZMJ){
                    layer = new ZZMJRoom(name);
                }else{
                    layer = new CSMJRoom(name);
                }
                break;
            case this.NEW_MJ_REPLAY:
            case this.NEW_MJ_REPLAY_TWO:
            case this.NEW_MJ_REPLAY_THREE:
                if(MJReplayModel.playType == GameTypeEunmMJ.DZMJ || MJReplayModel.playType == GameTypeEunmMJ.ZOUMJ
                    || MJReplayModel.playType == GameTypeEunmMJ.ZJMJ || MJReplayModel.playType == GameTypeEunmMJ.HZMJ){
                    layer = new HZMJReplay(name);
                }else if(MJReplayModel.playType == GameTypeEunmMJ.BSMJ || MJReplayModel.playType == GameTypeEunmMJ.DHMJ){
                    layer = new BSMJReplay(name);
                }else if(MJReplayModel.playType == GameTypeEunmMJ.AHMJ || MJReplayModel.playType == GameTypeEunmMJ.CXMJ ||
                    MJReplayModel.playType == GameTypeEunmMJ.KWMJ || MJReplayModel.playType == GameTypeEunmMJ.TCDPMJ ||
                    MJReplayModel.playType == GameTypeEunmMJ.TCPFMJ || MJReplayModel.playType == GameTypeEunmMJ.YYNXMJ){
                    layer = new AHMJReplay(name);
                }else if(MJReplayModel.playType == GameTypeEunmMJ.YJMJ){
                    layer = new YJMJReplay(name);
                }else if(MJReplayModel.playType == GameTypeEunmMJ.YZWDMJ){
                    layer = new YZWDMJReplay(name);
                }else if(MJReplayModel.playType == GameTypeEunmMJ.SYMJ){
                    layer = new SYMJReplay(name);
                }else if(MJReplayModel.playType == GameTypeEunmMJ.CQXZMJ){
                    layer = new CQXZMJReplay(name);
                }else if(MJReplayModel.playType == GameTypeEunmMJ.ZZMJ){
                    layer = new ZZMJReplay(name);
                }else{
                    layer = new CSMJReplay(name);
                }
                break;
            //case this.GOLD_LAYER:
            //    layer = new GoldConfigLayer();
            //    break;
        }

        if(name == "SDH_ROOM" || name == "XTBP_ROOM"){
            var layerClass = SDHRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "DT_ROOM"){
            var layerClass = DTRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "NSB_ROOM"){
            var layerClass = NSBRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "YYBS_ROOM"){
            var layerClass = YYBSRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "TCGD_ROOM"){
            var layerClass = TCGDRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "HSTH_ROOM"){
            var layerClass = HSTHRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "ERDDZ_ROOM"){
            var layerClass = ERDDZRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "CDTLJ_ROOM"){
            var layerClass = CDTLJRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        return layer;
    }
}

var LayerManager = {

    init:function(root){
        this._layerMap = {};
        this._currentLayer = null;
        this.inRoom = false;
        this._root = root;
    },

    getLayer:function(name){
        return this._layerMap[name];
    },

    getCurrentLayer:function(){
        if(this._currentLayer)
            return this._currentLayer.getName();
        return "";
    },

    getCurrentLayerObj:function(){
        if(this._currentLayer)
            return this._currentLayer;
        return null;
    },

    isInReplay:function(){
        var layers = [LayerFactory.PDK_REPLAY,LayerFactory.DTZ_REPLAY_THREE,LayerFactory.DTZ_REPLAY,LayerFactory.DTZ_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInRoom:function(){
        return this.inRoom;
    },

    isInMJ: function() {
        if(this.inRoom && GameTypeManager.isMJ(BaseRoomModel.curRoomData.wanfa)){
            return true;
        }
        return false;
    },

    isInBSMJ: function() {
        var layers = [LayerFactory.BSMJ_ROOM,LayerFactory.BSMJ_ROOM_TWO,LayerFactory.BSMJ_ROOM_THREE];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInHZMJ: function() {
        var layers = [LayerFactory.HZMJ_ROOM,LayerFactory.HZMJ_ROOM_TWO,LayerFactory.HZMJ_ROOM_THREE];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInSYMJ: function() {
        var layers = [LayerFactory.SYMJ_ROOM, LayerFactory.SYMJ_ROOM_TWO, LayerFactory.SYMJ_ROOM_THREE];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInCQXZMJ: function() {
        var layers = [LayerFactory.CQXZMJ_ROOM, LayerFactory.CQXZMJ_ROOM_TWO, LayerFactory.CQXZMJ_ROOM_THREE];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInYZWDMJ: function() {
        var layers = [LayerFactory.YZWDMJ_ROOM_TWO,LayerFactory.YZWDMJ_ROOM_THREE,LayerFactory.YZWDMJ_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInDTZ: function() {
        var layers = [LayerFactory.DTZ_ROOM,LayerFactory.DTZ_3REN_ROOM,LayerFactory.DTZ_MONEY_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInPDK:function(){
        var layers = [LayerFactory.PDK_ROOM , LayerFactory.PDK_MONEY_ROOM,LayerFactory.PDK_GOLD_ROOM];
        return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
    },

    isInPHZ:function(){
        var layers = [LayerFactory.PHZ_ROOM , LayerFactory.PHZ_ROOM_MORE , LayerFactory.PHZ_MONEY_ROOM , LayerFactory.PHZ_MONEY_ROOM_MORE,LayerFactory.PHZ_ROOM_LESS,
            LayerFactory.YZCHZ_ROOM_LESS,LayerFactory.YZCHZ_ROOM,LayerFactory.AHPHZ_ROOM_LESS,LayerFactory.AHPHZ_ROOM,LayerFactory.YJGHZ_ROOM,LayerFactory.PHZ_MONEY_ROOM_THREE
            ,LayerFactory.YJGHZ_ROOM_LESS,LayerFactory.ZZPH_ROOM,LayerFactory.ZZPH_ROOM_LESS,LayerFactory.ZZPH_ROOM_MORE,LayerFactory.WCPHZ_ROOM_LESS,LayerFactory.WCPHZ_ROOM,
            LayerFactory.ZHZ_ROOM_MORE,LayerFactory.ZHZ_ROOM_LESS,LayerFactory.ZHZ_ROOM];
        return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
    },

    isInHBGZP:function(){
        var layers = [LayerFactory.HBGZP_ROOM , LayerFactory.HBGZP_ROOM_MORE ,LayerFactory.HBGZP_ROOM_LESS];
        return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
    },

    isInXPLP:function(){
        var layers = [LayerFactory.XPLP_ROOM , LayerFactory.XPLP_ROOM_MORE ,LayerFactory.XPLP_ROOM_LESS];
        return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
    },

    isInWZQ:function(){
    var layers = [LayerFactory.WZQ_ROOM];
    return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
},

    isInDDZ:function(){
        var layers = [LayerFactory.DDZ_ROOM,LayerFactory.DDZ_MONEY_ROOM];
        return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
    },

    isInQF: function() {
        var layers = [LayerFactory.QF_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    addLayer:function(name){
        var scene = this._layerMap[name];
        if(!scene){
            scene = LayerFactory.buildInst(name);
            this._layerMap[name] = scene;
            this._root.addChild(scene);
        }
        return this._layerMap[name];
    },

    showLayer:function(name) {
        if(this._currentLayer) {
            if(name == this._currentLayer.getName()){
                return this._currentLayer;
            }
            if(this._currentLayer.isForceRemove()){
                cc.log("this._currentLayer.getName()..." , this._currentLayer.getName());
                this.removeLayer(this._currentLayer.getName());
            }else{
                this._currentLayer.visible = false;
                this._currentLayer.onHide();
            }
        }
        var layer = this._layerMap[name];
        if(!layer) {
            layer = this.addLayer(name);
        } else {
            layer.visible = true;
            layer.onShow();
        }

        if(name == LayerFactory.BJD_HOME || name == LayerFactory.LOGIN
            || name == LayerFactory.GOLD_LAYER){
            this.inRoom = false;
        }

        this._currentLayer = layer;
        if(sy.scene.paomadeng){
            if(name==LayerFactory.ROOM || name == LayerFactory.BJD_HOME){
                sy.scene.paomadeng.updatePosition(10,915);
            }else if(name==LayerFactory.PHZ_ROOM || name==LayerFactory.PHZ_ROOM_MORE  || name==LayerFactory.PHZ_MONEY_ROOM || LayerFactory.PHZ_MONEY_ROOM_MORE
                || name == LayerFactory.PHZ_ROOM_LESS || name ==LayerFactory.YZCHZ_ROOM || name ==LayerFactory.YZCHZ_ROOM_LESS
                || name ==LayerFactory.AHPHZ_ROOM || name ==LayerFactory.AHPHZ_ROOM_LESS|| name ==LayerFactory.WCPHZ_ROOM || name ==LayerFactory.WCPHZ_ROOM_LESS){
                sy.scene.paomadeng.updatePosition(50,960);
            }else if(name == LayerFactory.DTZ_MONEY_ROOM){
                sy.scene.paomadeng.updatePosition(50,580);
            }else if (name == LayerFactory.PDK_MONEY_ROOM) {
                sy.scene.paomadeng.updatePosition(50,640);
            }else if (name == LayerFactory.LOGIN) {
                sy.scene.paomadeng.updatePosition(10,550)
            }else{
                sy.scene.paomadeng.updatePosition(150,915);
            }
            var curMsg = PaoMaDengModel.getCurrentMsg();
            if((curMsg&&curMsg.type == 0 && this.isInRoom()) || this.isInReplay()){
                sy.scene.paomadeng.stop();
            }
        }

        SyEventManager.dispatchEvent("Switch_Main_Layer");

        return layer;
    },

    /**
     * 移除场景
     * @param name
     */
    removeLayer:function(name) {
        var layer = this._layerMap[name];
        if(layer){
            layer.removeAllEvents();
            layer.onRemove();
            this._root.removeChild(layer);
            layer = null;
            delete this._layerMap[name];
        }else{
            cc.log("LayerManager removeLayer::未找到layer..." , name);
        }
    },

    dispose:function(){
        var layers = [];
        for(var key in this._layerMap){
            layers.push(key);
        }
        for(var i=0;i<layers.length;i++){
            this.removeLayer(layers[i]);
        }
        this._currentLayer=null;
    	this._layerMap = {};
    }
}