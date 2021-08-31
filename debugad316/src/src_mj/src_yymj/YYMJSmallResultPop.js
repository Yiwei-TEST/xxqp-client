/**
 * Created by Administrator on 2020/4/7.
 */
var YYMJSmallResultCell = ccui.Widget.extend({

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
var YYMJSmallResultPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/mjSmallResult.json");
    },

    createMoldPais: function(widget,user) {
        var moldPais = user.moldPais;
        // cc.log("moldPais =",JSON.stringify(moldPais));
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
            var actionDiffX = 40;
            for(var j=0;j<innerArray.length;j++){
                var innerVo = innerArray[j];
                var dis = 5;
                if (innerAction==MJAction.AN_GANG) {
                    innerVo.a = 1;
                    dis = 18;
                }
                var card = new CSMahjong(MJAI.getDisplayVo(1,2),innerVo);
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale+dis) * count;
                card.y = height;
                lastX = card.x;
                widget.addChild(card);

                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        var gang = new CSMahjong(MJAI.getDisplayVo(1,2),gangVo);
                        gang.y += 20;
                        gang.scale = 1;
                        card.addChild(gang,1,333);
                    }
                }
                count++;
            }
            this.moldInitX = this.moldInitX + actionDiffX;
            //     cc.log("this.moldInitX =",this.moldInitX);
        }
        this.moldInitX = lastX > 0 ? lastX+60 : this.moldInitX;
    },

    createHandPais: function(widget,user) {
        var handPais = user.handPais;
        var voArray = [];
        var tjmjHuPai = null;
        for (var i=0;i<handPais.length;i++) {
            var vo = MJAI.getMJDef(handPais[i]);
            if(user.isHu == vo.c){//如果是胡的那张牌
                tjmjHuPai = vo;
                continue;
            }
            voArray.push(vo);
        }
        voArray.sort(MJAI.sortMJ);
        var height = 70;
        var localOffx = 0;
        var otherOffx = 0;
        if(this.moldInitX > 215){
            localOffx = 60;
            otherOffx = 20;
        }
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            var card = new CSMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.6;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 5) * i + localOffx;
            card.y = height;
            widget.addChild(card);

            var id1 = -1;
            var id2 = -1;
            if(user.isHu > 1000){//长沙麻将胡两张的胡牌
                id1 = parseInt(user.isHu/1000);
                id2 = user.isHu % 1000;
            }else{
                id1 = user.isHu;
            }

            var id3 = -1;var id4 = -1;
            if(user.totalFan > 1000){//长沙麻将开4杠可以胡4张牌，借用这个字段传另外两张胡牌
                id3 = parseInt(user.totalFan/1000);
                id4 = user.totalFan % 1000;
            }else{
                id3 = user.totalFan;
            }

            //cc.log("=======ttttttttttttttt======111===",user.isHu,user.totalFan,id1,id2,id3,id4);

            if (voArray[i].c == id1 || voArray[i].c == id2 || voArray[i].c == id3 || voArray[i].c == id4){
                var huImg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_15.png");
                huImg.x = size.width*0.80;
                huImg.y = size.height*0.17;
                card.addChild(huImg,1,5);
            }

            if(tjmjHuPai){
                var card = new CSMahjong(MJAI.getDisplayVo(1,1),tjmjHuPai);
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale - 0.5) * voArray.length + localOffx + otherOffx;
                card.y = height;
                widget.addChild(card);

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

        var huStrArr = [];

        var dahuConfig = {0:"碰碰胡",1:"将将胡",2:"七小对",3:"清一色",4:"豪华七小对",
            5:"双豪华七小对",6:"杠爆",7:"门清",8:"报听",9:"抢杠胡",10:"天胡",
            11:"一字撬",12:"一条龙",13:"平胡",14:"三豪华七小对",15:"海底",18:"喜分",
            19:"罚分"};
        var dahus = user.dahus || [];

        for (var i = 0; i < dahus.length; ++i) {
            if (dahuConfig[dahus[i]]) {
                if(dahus[i] == 19){
                    var fafen = user.ext[11];
                    if(fafen < 0){
                        huStrArr.push("罚分 "+fafen);
                    }
                }else if(dahus[i] == 18){
                    if(user.ext[10] > 0){
                        huStrArr.push("喜分 +"+user.ext[10]);
                    }else if(user.ext[10] < 0){
                        huStrArr.push("喜分 "+user.ext[10]);
                    }
                }else{
                    huStrArr.push(dahuConfig[dahus[i]]);
                }
            }
        }

        if(user.birdPoint > 0 && ArrayUtil.indexOf(this.showNiaoSeatArr,user.seat) >= 0){
            huStrArr.push("中" + user.birdPoint + "鸟");
        }

        if (user.ext[0] > 0){
            huStrArr.push("飘" + user.ext[0] + "分");
        }

        if(user.ext[3] && user.ext[3] > 0){
            huStrArr.push("明杠+" + user.ext[3]);
        }

        if(user.ext[4] && user.ext[4] > 0){
            huStrArr.push("暗杠+" + user.ext[4]);
        }

        if(user.ext[5] && user.ext[5] > 0){
            huStrArr.push("点杠+" + user.ext[5]);
        }

        if(user.ext[7] && user.ext[7] < 0){
            huStrArr.push("明杠" + user.ext[7]);
        }

        if(user.ext[8] && user.ext[8] < 0){
            huStrArr.push("暗杠" + user.ext[8]);
        }

        if(user.ext[9] && user.ext[9] < 0){
            huStrArr.push("点杠" + user.ext[9]);
        }

        if(huStrArr.length > 9){
            huStrArr.splice(9,0,"\n");
            hutxt.y -= 10;
        }
        hutxt.setString(huStrArr.join(" "));
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
        return new YYMJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);
        var Button_yupai = this.getWidget("Button_yupai");
        UITools.addClickEvent(Button_yupai,this,this.onShowMoreResult);
        Button_yupai.visible = false;
        this.closingPlayers = this.data.closingPlayers;
        this.label_rule = this.getWidget("label_rule");
        var wanfaStr = "";
        if(this.isReplay){

        }else{
            if(MJRoomModel.wanfa == GameTypeEunmMJ.YYMJ){
                wanfaStr = ClubRecallDetailModel.getYYMJWanfa(MJRoomModel.intParams);
            }
        }
        this.label_rule.setString(wanfaStr);

        var iszimo = true;
        var hasXiaohu = false;
        for(var i = 0;i<this.closingPlayers.length;++i){
            if(this.closingPlayers[i].fanPao)iszimo = false;
            if(this.closingPlayers[i].xiaohus && this.closingPlayers[i].xiaohus.length > 0)hasXiaohu = true;
        }
        if(hasXiaohu)iszimo = true;

        this.gdcsMjHuSeat = 0;

        var showSeatArr = [];
        for(var i = 0;i<this.closingPlayers.length;++i){
            if(iszimo || this.closingPlayers[i].fanPao || this.closingPlayers[i].isHu){
                showSeatArr.push(this.closingPlayers[i].seat);
            }
            if(this.closingPlayers[i].isHu){
                this.gdcsMjHuSeat = this.closingPlayers[i].seat;
            }
        }
        this.showNiaoSeatArr = showSeatArr;

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

        //显示鸟牌
        this.showBirds();
    },

    onShowMoreResult:function(){
        var mc = new MJSmallResultOtherPop(this.data);
        PopupManager.addPopup(mc);
    },

    showBirds: function() {
        var birdList = this.data.birdAttr || [];
        if (birdList){
            for(var j=0;j<birdList.length;j++) {
                var id = birdList[j].mjId;
                var mj = MJAI.getMJDef(id);
                var card = new CSMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.7;
                card.scale = _scale;
                card.x = (size.width * _scale + 8) * j + 80;
                card.y = -20;
                if(birdList[j].awardSeat > 0){
                    card._bg.setColor(cc.color.YELLOW);
                }
                this.Panel_niao.addChild(card);
            }
        }
    },

    onCheckDesktop:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay){
            if (ClosingInfoModel.isReplay){
                LayerManager.showLayer(LayerFactory.HOME);
            }
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount
            || (MJRoomModel.wanfa == GameTypeEunmMJ.YYMJ && data.ext[24] == 1)
            || data.isBreak){//最后的结算
            PopupManager.remove(this);
            var mc = new CSMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

