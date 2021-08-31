/**
 * Created by Administrator on 2020/6/3.
 */
var XPLPSmallResultCell = ccui.Widget.extend({
    ctor:function(huUser,paoUser,record){
        this._super();
        var bg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_2.png");
        bg.anchorX=bg.anchorY=0;
        this.addChild(bg);
        var name = UICtor.cLabel(huUser.name, 32, cc.size(200,40), cc.color(109,70,47), 1, 1);
        name.anchorX=name.anchorY=0;
        name.x = 0;
        name.y = (bg.height-name.height)/2;
        bg.addChild(name);

        var fanStr = "";
        var score = record[2];
        if(paoUser) {
            name = UICtor.cLabel(paoUser.name, 32, cc.size(200,40), cc.color(109,70,47), 0, 1);
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
var XPLPSmallResultPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/mjSmallResult.json");
    },

    createMoldPais: function(widget,user) {
        var moldPais = user.moldPais;
        var count = 0;
        this.moldInitX = 115 + 100;
        var lastX = 0;
        var height = 70;
        for (var i=0;i<moldPais.length;i++) {
            var innerObject = moldPais[i];
            var innerAction = innerObject.action;
            var tempCards = innerObject.cards;
            var innerArray = [];
            for (var ia=0;ia<tempCards.length;ia++) {
                innerArray.push(XPLPAI.getMJDef(tempCards[ia]));
            }
            var gangVo = null;
            if((innerAction==XPLPAction.AN_GANG || innerAction==XPLPAction.GANG) && (innerArray.length>3 || innerObject.gangVo)){
                gangVo = innerArray.pop();
            }
            var actionDiffX = 5;
            for(var j=0;j<innerArray.length;j++){
                var innerVo = innerArray[j];
                if (innerAction==XPLPAction.AN_GANG) {
                    innerVo.a = 1;
                }
                var card = new XPLPCard(XPLPAI.getDisplayVo(1,2),innerVo);
                var size = card.getContentSize();
                var _scale = 0.55;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale - 0.5) * count;
                card.y = height - 60;
                lastX = card.x;
                widget.addChild(card);

                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        var gang = new XPLPCard(XPLPAI.getDisplayVo(1,2),gangVo);
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
            voArray.push(XPLPAI.getMJDef(handPais[i]));
        }
        voArray.sort(XPLPAI.sortMJ);
        var height = 70;
        var localOffx = 0;
        if(this.moldInitX > 215){
            localOffx = 60;
        }
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            var card = new XPLPCard(XPLPAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.55;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 0.5) * i + localOffx;
            card.y = height - 60;
            widget.addChild(card);

            if (user.isHu == voArray[i].c){
                var newScale = 2;
                var huImg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_15.png");
                huImg.scale = newScale;
                huImg.x = size.width*0.80 - huImg.width + 15;
                huImg.y = size.height*0.17 - 60 + huImg.height;
                card.addChild(huImg,1,5);
            }
        }
    },

    createHuedPais: function(widget,user) {
        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        hutxt.setString("");
        //var pointArr = user.pointArr || [];
        //cc.log("user.dahus = ",JSON.stringify(user.dahus));
        //cc.log("user.totalFan = ",user.totalFan);
        //var dahus = user.dahus;
        //var fan = user.totalFan;
        //var hupai_string = "";
        //if(user.ext && user.ext[1]){
        //    if(user.ext[1] > 0){
        //        hupai_string +=(" 杠分+" + user.ext[1] + " ");
        //    }else if(user.ext[1] < 0){
        //        hupai_string +=(" 杠分" + user.ext[1] + " ");
        //    }
        //}
        //
        //hutxt.setString(hupai_string);
    },

    refreshSingle: function(widget,user){
        widget.visible = true;
        var tempName = XPLPRoomModel.newSubString(user.name,10);
        ccui.helper.seekWidgetByName(widget,"name").setString(tempName);

        ccui.helper.seekWidgetByName(widget,"uid").setString("ID:"+user.userId);
        //分数
        var pointLabel = ccui.helper.seekWidgetByName(widget,"point");
        var color = "67d4fc";
        if (user.point>0){
            color = "ff6648";
        }
        var point = user.point>0 ? "+"+user.point : ""+user.point;
        pointLabel.setString(""+point);
        pointLabel.setColor(cc.color(color+""));

        //庄家
        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[7]);

        //头像
        var spritePanel = ccui.helper.seekWidgetByName(widget,"Image_icon");
        this.showIcon(spritePanel,user.icon);


        var isHu = false;
        if (user.isHu){
            isHu = true;
        }
        //胡牌
        ccui.helper.seekWidgetByName(widget,"Image_hu").visible = isHu;

        var isFanPao = false;
        if (user.fanPao){
            isFanPao = true;
        }
        //点炮
        ccui.helper.seekWidgetByName(widget,"Image_dianpao").visible = isFanPao;

        this.createMoldPais(widget, user);
        this.createHandPais(widget, user);
        this.createHuedPais(widget, user);

        cc.log("XPLPRoomModel.ext[9] =",XPLPRoomModel.ext[9]);
        cc.log("user.birdPoint =",user.birdPoint);

        if (user.ext[0] > -1){
            ccui.helper.seekWidgetByName(widget,"piaofenImg").loadTexture("res/res_phz/xplp/chong"+user.ext[0]+".png");
            ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = true;
        }else{
            ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = false;
        }

        //var showMaidian = XPLPRoomModel.ext[9] != 0 ;
        var img_maidian = ccui.helper.seekWidgetByName(widget,"Image_maidian");
        img_maidian.visible = false;
        //img_maidian.x -= 60;
        //if (user.birdPoint == 0){
        //    img_maidian.loadTexture("res/res_mj/mjSmallResult/img_bumai.png");
        //}else if (user.birdPoint != -1){
        //    img_maidian.loadTexture("res/res_mj/mjSmallResult/img_"+user.birdPoint+"dian.png");
        //}
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
        return new XPLPSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        var Label_niao = this.getWidget("Label_niao");
        Label_niao.visible = false;
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        Button_11.visible = false;/** 去掉返回桌面 **/
        //UITools.addClickEvent(Button_11,this,this.onCheckDesktop);

        this.closingPlayers = this.data.closingPlayers;
        this.huList = {};
        var huList = this.data.huList;
        if(huList) {
            for (var i = 0; i < huList.length; i++) {
                var huRecord = huList[i];
                var huUser = this.getUserData(huRecord.ext[0]);
                if (!this.huList[huUser.seat]) {
                    this.huList[huUser.seat] = [];
                }
                this.huList[huUser.seat].push(huRecord);
            }
        }
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
        var zuizi = XPLPRoomModel.getZuiZiName(this.data.ext[10]);
        var wa = XPLPRoomModel.getHuCountName(this.data.ext[15]);
        var cp = XPLPRoomModel.getChiPengName(this.data.ext[11]);
        var ting = XPLPRoomModel.getTingHuName(this.data.ext[13]);
        var jianglei = XPLPRoomModel.getJiangLeiName(this.data.ext[18]);
        var gangjiafan = XPLPRoomModel.getGJFName(this.data.ext[16]);
        //this.getWidget("info").setString(csvhelper.strFormat("{0} {1} {2} {3} {4} {5}",zuizi,wa,cp,ting,jianglei,gangjiafan));

        var qyqID = "";
        if(ClosingInfoModel.ext[0] && ClosingInfoModel.ext[0] != 0){
            qyqID = "亲友圈ID：" + ClosingInfoModel.ext[0] + "  ";
        }

        var jushuStr = "第" + XPLPRoomModel.nowBurCount + "/" + XPLPRoomModel.totalBurCount + "局";
        var roomIdStr = "房间号：" + XPLPRoomModel.tableId;
        this.getWidget("info").setString(qyqID + jushuStr + "  " + roomIdStr);

        if (ClosingInfoModel.isReplay){
            var jushuStr = "第" + XPLPReplayModel.nowBurCount + "/" + XPLPReplayModel.totalBurCount + "局";
            var roomIdStr = "房间号：" + ClosingInfoModel.ext[1];
            this.getWidget("info").setString(qyqID + jushuStr + "  " + roomIdStr);
        }

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        this.Panel_niao = this.getWidget("Panel_niao");

        this.label_rule = this.getWidget("label_rule");
        var wanfaStr = "";
        if(this.isReplay){

        }else{
            wanfaStr = ClubRecallDetailModel.getXPLPWanfa(XPLPRoomModel.intParams);
        }
        this.label_rule.setString(wanfaStr);

        //if(this.label_rule.getAutoRenderSize().height < 80){
        //    this.label_rule.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //    this.label_rule.setPositionY(this.label_rule.y + 10);
        //}

        //显示鸟牌
        this.showBirds();
        if (ClosingInfoModel.isReplay){
            this.getWidget("replay_tip").visible =  true;
        }

        var Button_yupai = this.getWidget("Button_yupai");
        UITools.addClickEvent(Button_yupai,this,this.onShowMoreResult);
        Button_yupai.visible = true;
    },

    onShowMoreResult:function(){
        var mc = new XPLPSmallResultOtherPop(this.data.leftCards);
        PopupManager.addPopup(mc);
    },

    showBirds: function() {
        var sbirdList = {
            1:[1,5,9],
            2:[2,6],
            3:[3,7],
            4:[4,8]
        };
        if (XPLPRoomModel.is159Bird()){
            sbirdList = {
                1:[1,5,9],
                2:[1,5,9],
                3:[1,5,9],
                4:[1,5,9]
            };
        }

        var mainseq = this.data.catchBirdSeat || 0;
        var nowSeq = 0;
        if (mainseq){
            nowSeq =  XPLPRoomModel.getPlayerSeq("", mainseq, XPLPRoomModel.mySeat);
        }
        var nowBirdList = [];
        if (nowSeq && nowSeq >= 1 && nowSeq <= 4){
            nowBirdList = sbirdList[nowSeq];
        }

        var birdList = this.data.bird || [];
        if (birdList){
            for(var j=0;j<birdList.length;j++) {
                var id = birdList[j];
                var mj = XPLPAI.getMJDef(id);
                var card = new XPLPCard(XPLPAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.5;
                card.scale = _scale;
                card.x = (size.width * _scale - 1.5) * j + 80;
                this.Panel_niao.addChild(card);
                var idIndex = mj.i%10;
                for(var i=0;i<nowBirdList.length;i++) {
                    if (idIndex == nowBirdList[i] || mj.i == 201 || XPLPRoomModel.isOneBird()){
                        var niaoSprite = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_22.png");
                        niaoSprite.x = size.width*0.5;
                        niaoSprite.y = size.height*0.55;
                        niaoSprite.scale = 1.2;
                        card.addChild(niaoSprite, 10);
                        break;
                    }
                }
            }
        }

    },

    onCheckDesktop:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInXPLP()){
            if(PopupManager.getClassByPopup(XPLPReplay)){
                PopupManager.removeClassByPopup(XPLPReplay);
            }
            if (ClosingInfoModel.isReplay){
                LayerManager.showLayer(LayerFactory.HOME);
            }
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        cc.log("data.ext[13] =",data.ext[13]);
        if(XPLPRoomModel.nowBurCount == XPLPRoomModel.totalBurCount || (data.ext[16] == 1)){//最后的结算
            PopupManager.remove(this);
            var mc = new XPLPBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

