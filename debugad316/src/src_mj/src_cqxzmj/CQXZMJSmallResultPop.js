/**
 * Created by zhoufan on 2016/7/27.
 */
var CQXZMJSmallResultCell = ccui.Widget.extend({

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
var CQXZMJSmallResultPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/cqxzmjSmallResult.json");
    },

    createMoldPais: function(widget,user) {
        var moldPais = user.moldPais;
        var count = 0;
        this.moldInitX = 115 + 100;
        var lastX = 0;
        var height = 70;
        user.aGangNum = 0;
        user.mGangNum = 0;
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
                var card = new CQXZMahjong(MJAI.getDisplayVo(1,2),innerVo);
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
                        var gang = new CQXZMahjong(MJAI.getDisplayVo(1,2),gangVo);
                        gang.y += 12;
                        gang.scale = 1;
                        card.addChild(gang,1,333);
                        if (innerAction==MJAction.AN_GANG) {
                            user.aGangNum = user.aGangNum + 1;
                        }else{
                            user.mGangNum = user.mGangNum + 1;
                        }
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
        // cc.log("handPais =",JSON.stringify(handPais));
        var voArray = [];
        var cqxzmjHuPai =[];
        for (var i=0;i<handPais.length;i++) {
            voArray.push(MJAI.getMJDef(handPais[i]));
        }
        if(user.isHu){
            var vo = MJAI.getMJDef(user.isHu);
            // cc.log("user.isHu =",JSON.stringify(user.isHu));
            cqxzmjHuPai.push(vo);
        }
        
        voArray.sort(MJAI.sortMJ);
        var height = 70;
        var localOffx = 0;
        if(this.moldInitX > 215){
            localOffx = 60;
        }
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            var card = new CQXZMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.6;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 0.5) * i + localOffx;
            card.y = height;
            widget.addChild(card);
        }

        if(cqxzmjHuPai.length > 0){
            for (var j = 0; j < cqxzmjHuPai.length; j++) {
                var card = new CQXZMahjong(MJAI.getDisplayVo(1,1),cqxzmjHuPai[j]);
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale - 0.5) * (voArray.length+j) + 60*(j+1);
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

        var dahuConfig = {1:"平胡 0番",2:"对对胡 1番",3:"将对 3番",4:"清一色 2番",5:"七对 2番",6:"龙七对 3番",7:"将七对 3番",8:"全九幺 2番",9:"中张 1番",10:"门清 1番",11:"杠上花 1番",
                12:"杠上炮 1番",13:"抢杠胡 1番",14:"海底胡 1番",15:"海底炮 1番",16:"金钩胡 1番",17:"天胡 3番",18:"地胡 2番",19:"1根 1番",20:"2根 2番",21:"3根 3番",22:"4根 4番"};
        var dahus = user.dahus || [];
        for(var i = 0;i<dahus.length;++i){
            if(dahuConfig[dahus[i]]){
                huStrArr.push(dahuConfig[dahus[i]]);
            }
        }
            
        var pointArr = user.pointArr || [];
        // cc.log("pointArr =",pointArr);
        var pointConfig = {0:"自摸",1:"接炮",2:"点1胡",3:"点2胡",4:"点3胡",5:"查叫",6:"被查叫",7:"暗杠",8:"巴杠",9:"直杠",10:"放杠",11:"转移",12:"退税"};
        for(var i = 0;i<pointArr.length;++i){
            if(pointArr[i]){
                if(i < 7){
                    huStrArr.push(pointConfig[i]);
                }else if(i>10){
                    huStrArr.push(pointConfig[i] + pointArr[i]+ "分");
                }else{
                    huStrArr.push(pointConfig[i] + "x" + pointArr[i]);
                }
            }
        }
        hutxt.setString(""+ huStrArr);
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


        // var isHu = false;
        // if (user.isHu){
        //     isHu = true;
        // }
        // //胡牌
        ccui.helper.seekWidgetByName(widget,"Image_hu").visible = false;

        var isFanPao = false;
        // if (user.fanPao){
        //     isFanPao = true;
        // }
        //点炮
        ccui.helper.seekWidgetByName(widget,"Image_dianpao").visible = isFanPao;
        var hu_rank = ccui.helper.seekWidgetByName(widget,"hu_rank");
        // cc.log("user.ext[0] =",user.ext[0]);
        if(user.ext[0]){
            hu_rank.loadTexture("res/res_mj/res_cqxzmj/cqxzmjSmallResult/"+user.ext[0]+"hu.png");
            hu_rank.visible = true;
        }else{
            hu_rank.visible = false;
        }
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
        return new CQXZMJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
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

        this.label_rule = this.getWidget("label_rule");
        var wanfaStr = "";
        if(this.isReplay){

        }else{
            wanfaStr = ClubRecallDetailModel.getCQXZMJWanfa(MJRoomModel.intParams);
        }
        this.label_rule.setString(wanfaStr);

        this.Panel_niao = this.getWidget("Panel_niao");
        this.niaoNum = 0 ; //中鸟数量
        //显示鸟牌
        this.showBirds();

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



    },

    showBirds: function() {
        var sbirdList = {
            1:[1,5,9],
            2:[1,5,9],
            3:[1,5,9],
            4:[1,5,9]
        };
        //if (MJRoomModel.getIsSZXNiao()){
        //    //sbirdList = {
        ////        1:[1,5,9],
        ////        2:[1,5,9],
        ////        3:[1,5,9],
        ////        4:[1,5,9]
        ////    };
        //}

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
                var card = new CQXZMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.7;
                card.scale = _scale;
                card.x = (size.width * _scale - 1.5) * j + 80;
                card.y = -15;
                this.Panel_niao.addChild(card);
                var idIndex = mj.i%10;
                for(var i=0;i<nowBirdList.length;i++) {
                    if (idIndex == nowBirdList[i] && mj.c <= 108){
                        this.niaoNum = this.niaoNum + 1;
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
        if (ClosingInfoModel.isReplay){
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            return;
        }
            
        var data = this.data;
        // cc.log("data.ext[8] =",data.ext[8]);
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount || data.ext[8] == 1){//最后的结算
            PopupManager.remove(this);
            var mc = new CQXZMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

