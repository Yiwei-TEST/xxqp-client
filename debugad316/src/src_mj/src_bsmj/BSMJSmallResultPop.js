/**
 * Created by zhoufan on 2016/7/27.
 */
var BSMJSmallResultCell = ccui.Widget.extend({

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
var BSMJSmallResultPop = BasePopup.extend({

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
                innerArray.push(MJAI.getMJDef(tempCards[ia]));
            }
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG || innerAction==MJAction.GANG) && (innerArray.length>3 || innerObject.gangVo)){
                gangVo = innerArray.pop();
            }
            var actionDiffX = 5;
            for(var j=0;j<innerArray.length;j++){
                var innerVo = innerArray[j];
                if (innerAction==MJAction.AN_GANG) {
                    innerVo.a = 1;
                }
                var card = new BSMahjong(MJAI.getDisplayVo(1,2),innerVo);
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale - 0.5) * count;
                card.y = height;
                lastX = card.x;
                widget.addChild(card);

                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        var gang = new BSMahjong(MJAI.getDisplayVo(1,2),gangVo);
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
        var localOffx = 0;
        if(this.moldInitX > 215){
            localOffx = 60;
        }
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            var card = new BSMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.6;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 0.5) * i + localOffx;
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
        cc.log("user.dahus = ",JSON.stringify(user.dahus));
        cc.log("user.totalFan = ",user.totalFan);
        var dahus = user.dahus;
        var fan = user.totalFan;
        var hupai_string = "";
        if (dahus.length>0) {
            for (var i=0;i<dahus.length;i++) {
                if (dahus[i] == 0){
                    hupai_string +=  "大对子 ";
                }else if (dahus[i] == 1){
                    hupai_string +=  "字一色 ";
                }else if (dahus[i] == 2){
                    hupai_string +=  "清一色 ";
                }else if (dahus[i] == 3){
                    hupai_string +=  "门清 ";
                }else if (dahus[i] == 4){
                    if(MJRoomModel.wanfa == GameTypeEunmMJ.BSMJ || (this.isReplay && MJReplayModel.wanfa == GameTypeEunmMJ.BSMJ)){
                        hupai_string +=  "卡绝张 ";
                    }
                }else if (dahus[i] == 5){
                    hupai_string +=  "7小对 ";
                }else if (dahus[i] == 6){
                    hupai_string +=  "龙爪背 ";
                }else if (dahus[i] == 7){
                    hupai_string +=  "杠上花 ";
                }else if (dahus[i] == 8){
                    hupai_string +=  "抢杠胡 ";
                }else if (dahus[i] == 9){
                    hupai_string +=  "杠上炮 ";
                }else if (dahus[i] == 10){
                    hupai_string +=  "";//"全求人 ";
                }else if (dahus[i] == 11){
                    hupai_string +=  "四归一 ";
                }else if (dahus[i] == 12){
                    hupai_string +=  "天胡 ";
                }else if (dahus[i] == 13){
                    hupai_string +=  "地胡 ";
                }else if (dahus[i] == 14){
                    hupai_string +=  "十老头 ";
                }else if (dahus[i] == 15){
                    hupai_string +=  "双杠上花 ";
                }else if (dahus[i] == 16){
                    hupai_string += "报听 ";
                }else if (dahus[i] == 17){
                    hupai_string +=  "一条龙 ";
                }else if (dahus[i] == 18){
                    hupai_string +=  "三杠上花 ";
                }
            }
        }
        if (user.totalFan && user.totalFan > 0){
            hupai_string += "（"+fan+"番）" ;
        }
        if(user.ext && user.ext[1]){
            if(user.ext[1] > 0){
                hupai_string +=(" 杠分+" + user.ext[1] + " ");
            }else if(user.ext[1] < 0){
                hupai_string +=(" 杠分" + user.ext[1] + " ");
            }
        }

        if(user.isHu && (MJRoomModel.wanfa == GameTypeEunmMJ.DHMJ || (this.isReplay && MJReplayModel.wanfa == GameTypeEunmMJ.DHMJ))){//胡牌的人显示根
            if(this.data.ext && this.data.ext[14]){
                if(parseInt(this.data.ext[14]) > 0){
                    hupai_string +=(" " + this.data.ext[14] + "根 ");
                }
            }
        }

        hutxt.setString(hupai_string);
    },

    refreshSingle: function(widget,user){
        widget.visible = true;
        var tempName = MJRoomModel.newSubString(user.name,10);
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
        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[22]);

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

        cc.log("MJRoomModel.ext[9] =",MJRoomModel.ext[9]);
        cc.log("user.birdPoint =",user.birdPoint);

        var showMaidian = MJRoomModel.ext[9] != 0 ;
        var img_maidian = ccui.helper.seekWidgetByName(widget,"Image_maidian");
        img_maidian.visible = showMaidian;
        img_maidian.x -= 60;
        if (user.birdPoint == 0){
            img_maidian.loadTexture("res/res_mj/mjSmallResult/img_bumai.png");
        }else if (user.birdPoint != -1){
            img_maidian.loadTexture("res/res_mj/mjSmallResult/img_"+user.birdPoint+"dian.png");
        }
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
        return new BSMJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        var Label_niao = this.getWidget("Label_niao");
        Label_niao.visible = false;
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);

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
        var zuizi = MJRoomModel.getZuiZiName(this.data.ext[10]);
        var wa = MJRoomModel.getHuCountName(this.data.ext[15]);
        var cp = MJRoomModel.getChiPengName(this.data.ext[11]);
        var ting = MJRoomModel.getTingHuName(this.data.ext[13]);
        var jianglei = MJRoomModel.getJiangLeiName(this.data.ext[18]);
        var gangjiafan = MJRoomModel.getGJFName(this.data.ext[16]);
        //this.getWidget("info").setString(csvhelper.strFormat("{0} {1} {2} {3} {4} {5}",zuizi,wa,cp,ting,jianglei,gangjiafan));

        var qyqID = "";
        if(ClosingInfoModel.ext[0] && ClosingInfoModel.ext[0] != 0){
            qyqID = "亲友圈ID：" + ClosingInfoModel.ext[0] + "  ";
        }

        var jushuStr = "第" + MJRoomModel.nowBurCount + "/" + MJRoomModel.totalBurCount + "局";
        var roomIdStr = "房间号：" + MJRoomModel.tableId;
        this.getWidget("info").setString(qyqID + jushuStr + "  " + roomIdStr);

        if (ClosingInfoModel.isReplay){
            var jushuStr = "第" + MJReplayModel.nowBurCount + "/" + MJReplayModel.totalBurCount + "局";
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
            if(MJRoomModel.wanfa == GameTypeEunmMJ.BSMJ){
                wanfaStr = ClubRecallDetailModel.getBSMJWanfa(MJRoomModel.intParams);
            }
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
    },

    showBirds: function() {
        var sbirdList = {
            1:[1,5,9],
            2:[2,6],
            3:[3,7],
            4:[4,8]
        };
        if (MJRoomModel.is159Bird()){
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
            nowSeq =  MJRoomModel.getPlayerSeq("", mainseq, MJRoomModel.mySeat);
        }
        var nowBirdList = [];
        if (nowSeq && nowSeq >= 1 && nowSeq <= 4){
            nowBirdList = sbirdList[nowSeq];
        }

        var birdList = this.data.bird || [];
        if (birdList){
            for(var j=0;j<birdList.length;j++) {
                var id = birdList[j];
                var mj = MJAI.getMJDef(id);
                var card = new BSMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.5;
                card.scale = _scale;
                card.x = (size.width * _scale - 1.5) * j + 80;
                this.Panel_niao.addChild(card);
                var idIndex = mj.i%10;
                for(var i=0;i<nowBirdList.length;i++) {
                    if (idIndex == nowBirdList[i] || mj.i == 201 || MJRoomModel.isOneBird()){
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
        if(ClosingInfoModel.isReplay || !LayerManager.isInMJ()){
            if (ClosingInfoModel.isReplay){
                LayerManager.showLayer(LayerFactory.HOME);
            }
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        cc.log("data.ext[13] =",data.ext[13]);
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount || (data.ext[13] == 1)){//最后的结算
            PopupManager.remove(this);
            var mc = new BSMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

