/**
 * Created by zhoufan on 2016/7/27.
 */
var ZZMJSmallResultCell = ccui.Widget.extend({

    ctor:function(huUser,paoUser,record){
        this._super();
        var bg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_2.png");
        bg.anchorX=bg.anchorY=0;
        this.addChild(bg);
        var name = UICtor.cLabel(huUser.name, 24, cc.size(200,32), cc.color(109,70,47), 1, 1);
        name.anchorX=name.anchorY=0;
        name.x = 0;
        name.y = (bg.height-name.height)/2;
        bg.addChild(name);

        var fanStr = "";
        var score = record[2];
        if(paoUser) {
            name = UICtor.cLabel(paoUser.name, 24, cc.size(200,32), cc.color(109,70,47), 0, 1);
            name.anchorX=name.anchorY=0;
            name.x = 275;
            name.y = (bg.height-name.height)/2;
            bg.addChild(name);
            fanStr += "点炮没听牌 包3家";

            var scoreLabel = new cc.LabelBMFont("-"+score,"res/font/font_mj1.fnt");
            scoreLabel.anchorX=scoreLabel.anchorY=0;
            scoreLabel.x = 385;
            scoreLabel.y = (bg.height-scoreLabel.height)/2;
            scoreLabel.setScale(0.65);
            bg.addChild(scoreLabel);
        } else {
            fanStr += "自摸吃3家";
            score = score*3;
        }
        //门清
        if (record[4] > 0) {
            fanStr += " 门清";
        }
        //硬将
        if (record[5] > 0) {
            fanStr += " 硬将";
        }
        //杠
        if (record[6] > 0) {
            fanStr += " 杠";
        }

        var scoreLabel = new cc.LabelBMFont("+"+score,"res/font/font_mj2.fnt");
        scoreLabel.anchorX=scoreLabel.anchorY=0;
        scoreLabel.x = 170;
        scoreLabel.y = (bg.height-scoreLabel.height)/2;
        scoreLabel.setScale(0.65);
        bg.addChild(scoreLabel);

        fanStr +="（"+record[3]+"番）";
        name = UICtor.cLabel(fanStr, 24, cc.size(350,0), cc.color(114,92,68), 0, 0);
        name.anchorX=name.anchorY=0;
        name.x = 460;
        name.y = (bg.height-name.height)/2;
        bg.addChild(name);

        this.setContentSize(bg.width,bg.height);
    }

})
var ZZMJSmallResultPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/mjSmallResult.json");
        this.grayLayer.setOpacity(200);
    },

    createMoldPais: function(widget,user) {
        var moldPais = user.moldPais;
        var count = 0;
        this.moldInitX = 115 + 90 + 100;
        var lastX = 0;
        var height = 70;
        for (var i=0;i<moldPais.length;i++) {
            var innerObject = moldPais[i];
            var innerAction = innerObject.action;
            var tempCards = innerObject.cards;
            var innerArray = [];
            for (var ia=0;ia<tempCards.length;ia++) {
                innerArray.push(MJAI.getMJDef(tempCards[ia]));
            }
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG || innerAction==MJAction.GANG) && (innerArray.length>3 || innerObject.gangVo)){
                gangVo = innerArray.pop();
            }
            var actionDiffX = 40;
            for(var j=0;j<innerArray.length;j++){
                var innerVo = innerArray[j];
                var dis = 5;
                if (innerAction==MJAction.AN_GANG) {
                    innerVo.a = 1;
                    dis = 18;
                }
                var card = new ZZMahjong(MJAI.getDisplayVo(1,2),innerVo);
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale + dis) * count;
                card.y = height;
                lastX = card.x;
                widget.addChild(card);

                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        var gang = new ZZMahjong(MJAI.getDisplayVo(1,2),gangVo);
                        gang.y += 12;
                        gang.scale = 1;
                        card.addChild(gang,1,333);
                    }
                }
                count++;
            }
            this.moldInitX = this.moldInitX + actionDiffX;
        }
        this.moldInitX = lastX > 0 ? lastX+60 : this.moldInitX;
    },

    createHandPais: function(widget,user) {
        var handPais = user.handPais;
        var voArray = [];
        for (var i=0;i<handPais.length;i++) {
            voArray.push(MJAI.getMJDef(handPais[i]));
        }
        voArray.sort(MJAI.sortMJ);
        var height = 70;
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            var card = new ZZMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.6;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 0.5) * i;
            card.y = height;
            widget.addChild(card);

            if (user.isHu == voArray[i].c){
                var huImg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_15.png");
                huImg.x = size.width*0.80;
                huImg.y = size.height*0.17;
                card.addChild(huImg,1,5);
            }
        }
    },

    createHuedPais: function(widget,user) {
        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        hutxt.setString("");
        var pointArr = user.pointArr || [];
        var hutxtList = ["胡牌分","鸟分","杠分","庄闲分"];

        var huStr = "";
        for (var i=0;i<hutxtList.length;i++) {
            var huPoint = pointArr[i];
            if (huPoint){
                var huPointStr = huPoint > 0 ? "+" + huPoint : huPoint;
                if (huStr != ""){
                    huStr = huStr + "," + hutxtList[i] + huPointStr;
                }else{
                    huStr = huStr  + hutxtList[i] + huPointStr;
                }

            }
        }
        hutxt.setString(huStr);
    },

    showMoneyIcon:function(label){
        var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
        icon.setAnchorPoint(1,0.5);
        icon.setPosition(-10,label.height/2);
        label.addChild(icon);
    },

    refreshSingle: function(widget,user){
        widget.visible = true;
        var tempName = MJRoomModel.newSubString(user.name,10);
        ccui.helper.seekWidgetByName(widget,"name").setString(tempName);
         ccui.helper.seekWidgetByName(widget,"uid").setString("ID:"+user.userId);
        var pointPanel = ccui.helper.seekWidgetByName(widget,"point");
        // pointPanel.visible = false;
        pointPanel.setString("");

        var pointNum = user.point;

        if(MJRoomModel.isMoneyRoom() || MJRoomModel.isMatchRoom()){
            pointNum = user.totalPoint;
        }

        var fnt = "res/font/font_mj1.fnt";
        if (pointNum>0){
            fnt = "res/font/font_mj2.fnt";
        }
        var point = pointNum>0 ? "+"+pointNum : ""+pointNum;

        var scoreLabel = new cc.LabelBMFont(point,fnt);
        scoreLabel.x = pointPanel.width/2-3;
        scoreLabel.y = pointPanel.height/2-3;
        pointPanel.addChild(scoreLabel);

        if(MJRoomModel.isMoneyRoom() || MJRoomModel.isMatchRoom()){
            this.showMoneyIcon(scoreLabel);
        }


        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[8]);
        cc.log("user.ext[0] =",user.ext[0]);
        if (user.ext[0] > -1){
            ccui.helper.seekWidgetByName(widget,"piaofenImg").loadTexture("res/res_mj/mjSmallResult/biao_piao"+user.ext[0]+".png");
            ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = true;
        }else{
            ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = false;
        }
        //头像
        var spritePanel = ccui.helper.seekWidgetByName(widget,"Image_icon");
        this.showIcon(spritePanel,user.icon);

        this.createMoldPais(widget, user);
        this.createHandPais(widget, user);
        this.createHuedPais(widget, user);

        var isFanPao = false;
        if (user.fanPao){
            isFanPao = true;
        }
        //点炮
        ccui.helper.seekWidgetByName(widget,"Image_dianpao").visible = isFanPao;

        var isHu = false;
        if (user.isHu){
            isHu = true;
        }
        //胡牌
        ccui.helper.seekWidgetByName(widget,"Image_hu").visible = isHu;

    },
    
    showIcon: function(icon,url) {
        //url = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if (!url){
            return;
        }

        var defaultimg = "res/res_mj/mjBigResult/default_m.png";

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var size = icon.getContentSize();
        var sprite = new cc.Sprite(defaultimg);
        var scale = 0.9;
        sprite.setScale(scale);
        sprite.x = size.width*0.5;
        sprite.y = size.height*0.5;
        icon.addChild(sprite,5,345);

        cc.loader.loadImg(url,{width: 75, height:75},function(error, texture){
            if(error==null){
                sprite.setTexture(texture);
            }
        });
    },

    getUserData: function(seat) {
        var user = null;
        for (var i=0;i<this.closingPlayers.length;i++) {
            if (this.closingPlayers[i].seat == seat) {
                user = this.closingPlayers[i];
                break;
            }
        }
        return user;
    },

    createHuCell: function(huRecord) {
        var ext = huRecord.ext;
        var huUser = this.getUserData(ext[0]);
        var paoUser = ext[1] > 0 ? this.getUserData(ext[1]) : null;
        return new ZZMJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        Button_11.visible = false;
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);

        var xipai_btn = this.getWidget("xipai_btn");
        UITools.addClickEvent(xipai_btn,this,function(obj){
            sySocket.sendComReqMsg(4501,[],"");
            this.issent = true;
            PopupManager.remove(this);
            this.onOk(obj);
        });
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount || this.data.ext[18] == 1){
            xipai_btn.visible = false;
        }else{
            xipai_btn.visible = MJRoomModel.creditConfig[10] == 1;
        }
        var xpkf =  MJRoomModel.creditXpkf ? MJRoomModel.creditXpkf.toString() : 0;
        this.getWidget("label_xpkf").setString(xpkf);

        if(MJRoomModel.isMoneyRoom() && !this.isReplay){
            btnok.loadTextureNormal("res/res_mj/mjBigResult/btn_start_another.png");
            Button_11.loadTextureNormal("res/res_mj/mjBigResult/btn_return_hall.png");
            btnok.scale = Button_11.scale = 0.9;
        }

        this.closingPlayers = this.data.closingPlayers;
        this.fuTypeName = this.getFuTypeName();
        // this.huList = {};
        // var huList = this.data.huList;
        // if(huList) {
        //     for (var i = 0; i < huList.length; i++) {
        //         var huRecord = huList[i];
        //         var huUser = this.getUserData(huRecord.ext[0]);
        //         if (!this.huList[huUser.seat]) {
        //             this.huList[huUser.seat] = [];
        //         }
        //         this.huList[huUser.seat].push(huRecord);
        //     }
        // }
        for(var j=1;j<=4;j++) {
            this.getWidget("user"+j).visible = false;
            for(var i=0;i<this.closingPlayers.length;i++){
                var user = this.closingPlayers[i];
                if(user.seat == j) {
                    this.refreshSingle(this.getWidget("user"+j),user);
                    break;
                }
            }
        }
        //var zuizi = MJRoomModel.getZuiZiName(this.data.ext[10]);
        //var wa = MJRoomModel.getHuCountName(this.data.ext[15]);
        //var cp = MJRoomModel.getChiPengName(this.data.ext[11]);
        //var ting = MJRoomModel.getTingHuName(this.data.ext[13]);
        //var jianglei = MJRoomModel.getJiangLeiName(this.data.ext[18]);
        //var gangjiafan = MJRoomModel.getGJFName(this.data.ext[16]);
        //this.getWidget("info").setString(csvhelper.strFormat("{0} {1} {2} {3} {4} {5}",zuizi,wa,cp,ting,jianglei,gangjiafan));
        var qyqID = "";
        if(ClosingInfoModel.ext[0] && ClosingInfoModel.ext[0] != 0){
            qyqID = "亲友圈ID：" + ClosingInfoModel.ext[0] + "  ";
        }

        var label_info = this.getWidget("info");
        var roomId = MJRoomModel.tableId;
        if(ClosingInfoModel.isReplay)roomId = ClosingInfoModel.ext[1];

        var jushuStr = "第" + MJRoomModel.nowBurCount + "/" + MJRoomModel.totalBurCount + "局";
        var roomIdStr = "房间号：" + roomId;
        label_info.setString(qyqID + jushuStr + "  " + roomIdStr);

        if (ClosingInfoModel.isReplay){
            var jushuStr = "第" + MJReplayModel.nowBurCount + "/" + MJReplayModel.totalBurCount + "局";
            var roomIdStr = "房间号：" + roomId;
            label_info.setString(qyqID + jushuStr + "  " + roomIdStr);
        }

        if(MJRoomModel.isMoneyRoom()){
            var str = "底分:" + MJRoomModel.goldMsg[2];
            str += ("  序号:" + roomId);
            label_info.setString(str);
        }

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        this.Panel_niao = this.getWidget("Panel_niao");

        //显示鸟牌
        this.showBirds();

        if (ClosingInfoModel.isReplay){
            this.getWidget("replay_tip").visible =  true;
        }
    },

    showBirds: function() {
        var sbirdList = {
                1:[1,5,9],
                2:[1,5,9],
                3:[1,5,9],
                4:[1,5,9]
            };
    
        var nowBirdList = sbirdList[1];
     
        var birdList = this.data.bird || [];
        if (birdList){
            for(var j=0;j<birdList.length;j++) {
                var id = birdList[j];
                var mj = MJAI.getMJDef(id);
                var card = new ZZMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.7;
                card.scale = _scale;
                card.x = (size.width * _scale + 5) * j + 80;
                card.y = -15;
                this.Panel_niao.addChild(card);
                var idIndex = mj.i%10;
                for(var i=0;i<nowBirdList.length;i++) {
                    if (idIndex == nowBirdList[i] || MJRoomModel.isOneBirdInZZMJ()){
                        var niaoSprite = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_22.png");
                        niaoSprite.x = size.width*0.5;
                        niaoSprite.y = size.height*0.55;
                        niaoSprite.scale = 1.3;
                        card.addChild(niaoSprite, 10);
                        break;
                    }
                }
            }
        }
    },

    getFuTypeName: function() {
        var name = "";
        var type = parseInt(this.data.ext[10]);
        switch (type) {
            case MJFuPaiType.ZFB_JDF:
            case MJFuPaiType.SAN_YAO_ZFB:
            case MJFuPaiType.ZFB_XJF:
                name = "中发白x";
                break;
            case MJFuPaiType.SAN_JIU_ZFBJ:
                name = "中发白鸡x";
                break;
            case MJFuPaiType.HZD_3938:
                name = "38红中带x";
                break;
            case MJFuPaiType.BBD_3231:
                name = "32白板带x";
                break;
            default :
                name = "黑三风x";
                break;
        }
        return name;
    },

    onCheckDesktop:function(){

        if(MJRoomModel.isMoneyRoom() && !this.isReplay){
            if(LayerManager.getLayer(LayerFactory.GOLD_LAYER)){
                LayerManager.showLayer(LayerFactory.GOLD_LAYER);
            }else{
                LayerManager.showLayer(LayerFactory.HOME);
            }
        }

        PopupManager.remove(this);
    },

    onOk:function(obj){
        obj.setTouchEnabled(false);
        if(ClosingInfoModel.isReplay){
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            return;
        }

        var data = this.data;
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount || this.data.ext[18] == 1){//最后的结算
            PopupManager.remove(this);
            var mc = new ZZMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            PopupManager.remove(this);
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    },

    //金币场继续游戏
    moneyRoomStartAnother:function(){
        //var keyId = GoldRoomConfigModel.curClickRoomkeyId;
        //cc.log("GoldRoomConfigModel.curClickRoomkeyId=="+GoldRoomConfigModel.curClickRoomkeyId)
        //this.clickStartAnother = true;
        //ComReq.comReqChangeSrv([] , ["" + keyId],1);

        var data = CheckJoinModel.getJoinMatchData();
        if(data){
            CheckJoinModel.toMatchRoom(data.playType,data.matchType,data.keyId);
        }else{
            PopupManager.remove(this);
            LayerManager.showLayer(LayerFactory.HOME);
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status == ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        sy.scene.hideLoading();
        if(this.clickStartAnother){
            this.clickStartAnother = false;
            var keyId = GoldRoomConfigModel.curClickRoomkeyId;
            var goldRoomId = GoldRoomConfigModel.goldRoomId;
            // cc.log("onSuc===",keyId,goldRoomId);
            sySocket.sendComReqMsg(2,[],[""+keyId,""+goldRoomId],1);
        }
    },
});

