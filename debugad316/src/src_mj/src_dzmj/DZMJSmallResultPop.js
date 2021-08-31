/**
 * Created by zhoufan on 2016/7/27.
 */
var DZMJSmallResultCell = ccui.Widget.extend({

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
        var score = record[2]
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
var DZMJSmallResultPop = BasePopup.extend({

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
        this.moldInitX = 115 + 50 + 100;
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
                var card = new HZMahjong(MJAI.getDisplayVo(1,2),innerVo);
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
                        var gang = new HZMahjong(MJAI.getDisplayVo(1,2),gangVo);
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

    sortMJ:function(ids,isHu){

        var wangV = this.data.ext[15];

        var num = this.data.ext[16] || 0;

        var vo = null;
        for(var i in MJAI.MJ){
            if(MJAI.MJ[i].i == wangV){
                vo = ObjectUtil.deepCopy(MJAI.MJ[i]);
                break;
            }
        }

        if(num > 0){
            for(var i = 0;i<ids.length;++i){
                if(ids[i].i == 201 && num > 0){
                    ids[i].tiCard = true;
                    num--;
                }
            }
        }


        var seqs = [2,3,1,4];
        ids.sort(function(mj1,mj2){

            var t1 = seqs[mj1.t-1];
            var t2 = seqs[mj2.t-1];

            var n1 = mj1.n;
            var n2 = mj2.n;

            if(wangV < 100 && isHu > 0){
                if(mj1.i == 201 && mj1.tiCard){
                    t1 = seqs[vo.t - 1];
                    n1 = vo.n;
                }
                if(mj2.i == 201 && mj2.tiCard){
                    t2 = seqs[vo.t - 1];
                    n2 = vo.n;
                }
            }

            if(mj1.i == wangV)t1 = 0;
            if(mj2.i == wangV)t2 = 0;

            if(t1 != t2)return t1 - t2;
            else return n1 - n2;

        });
    },

    createHandPais: function(widget,user) {
        var handPais = user.handPais;
        var voArray = [];

        var huVo = null;
        for (var i=0;i<handPais.length;i++) {
            var vo = MJAI.getMJDef(handPais[i]);

            if(vo.i == this.data.ext[15]){
                vo.wang = 1;
            }

            if(vo.c == user.isHu){
                huVo = vo;
            }else{
                voArray.push(vo);
            }
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
            voArray.sort(MJAI.sortMJ);
        }else{
            this.sortMJ(voArray,user.isHu);
        }

        if(huVo)voArray.push(huVo);

        var height = 70;
        var localOffx = 0;
        if(this.moldInitX > 265){
            localOffx = 60;
        }
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            var card = new HZMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
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
                card.x += 30;
            }
        }
    },

    createHuedPais: function(widget,user) {

        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        hutxt.x += 70;

        var pointArr = user.pointArr || [];
        var pointNameArr = ["胡牌分:","鸟分:","杠分:","坐飘:","外飘:"];

        if(MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
            pointNameArr[3] = "跑分:";
        }

        var itemArr = [];
        for (var i=0;i<pointArr.length;i++) {
            var point = pointArr[i];
            if(pointNameArr[i] && point){
                if(point > 0)point = "+" + point;
                itemArr.push(pointNameArr[i] + point);
            }
        }

        var dahus = user.dahus || [];
        var dahuConfig = {
            1:"门清", 2:"有一套", 3:"有两套", 4:"全求人", 5:"混一色",6: "混一色", 7:"清一色",
            8:"清一色",9:"碰碰胡", 10:"碰碰胡", 11:"风一色", 12:"七巧对", 13:"七巧对",14:"龙巧对",
            15:"龙巧对", 16:"小道", 17:"大道",18:"单王爪",19:"单王爪王",20:"双王爪",21:"双王爪王",
            22:"四王到位",23:"四归一",24:"王归位",25:"一条龙",26:"十三浪",30:"抢杠胡",31:"杠上花",
            32:"风一色",33:"七风到位",34:"双王归位",35:"三王归位",36:"四王归位",37:"四归一x2",38:"四归一x3"
        };

        if(MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
            dahuConfig[12] = dahuConfig[13] = "七小对";
        }

        for(var i = 0;i<dahus.length;++i){
            if(dahuConfig[dahus[i]]){
                itemArr.push(dahuConfig[dahus[i]]);
            }
        }

        if(MJRoomModel.wanfa != GameTypeEunmMJ.ZOUMJ){
            if(pointArr[0]){
                itemArr.push("底分:"+this.data.ext[18]);
            }
        }

        hutxt.setString(itemArr.join(" "));
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

        var intParams = this.isReplay?MJReplayModel.intParams:MJRoomModel.intParams;

        var piaofenImg = ccui.helper.seekWidgetByName(widget,"piaofenImg");
        if (user.ext && user.ext[0] >= 0 && intParams[20] == 1){
            var img = "res/res_mj/mjSmallResult/biao_piao"+user.ext[0]+".png";
            piaofenImg.loadTexture(img);
            piaofenImg.visible = true;
        }else{
            piaofenImg.visible = false;
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
            if(user.ext[0] >= 0 && intParams[4] > 0){
                img = "res/res_mj/res_dzmj/imgPao/img_pao_" + user.ext[0] + ".png";
                piaofenImg.loadTexture(img);
                piaofenImg.visible = true;
            }else{
                piaofenImg.visible = false;
            }
        }

        this.createMoldPais(widget, user);
        this.createHandPais(widget, user);
        this.createHuedPais(widget, user);
    },

    showWangPai:function(){
        var labelNiao = this.getWidget("Label_niao");
        labelNiao.x += 150;
        this.Panel_niao.x += 150;
        labelNiao.setVisible(false);

        var labelWang = new cc.LabelTTF("王霸:","",45);
        labelWang.setColor(cc.color(245,237,159));
        labelWang.setPosition(labelNiao.x - 150,labelNiao.y);
        labelNiao.getParent().addChild(labelWang);

        var vo = null;
        for(var i in MJAI.MJ){
            if(MJAI.MJ[i].i == this.data.ext[15]){
                vo = ObjectUtil.deepCopy(MJAI.MJ[i]);
                break;
            }
        }
        if(this.data.ext[15] > 0 && vo){
            vo.wang = 1;
            var card = new HZMahjong(MJAI.getDisplayVo(1, 1), vo);
            card.setScale(0.5);
            card.setPosition(labelWang.width,-30);
            labelWang.addChild(card);
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
            var vo = null;
            for(var i in MJAI.MJ){
                if(MJAI.MJ[i].i == this.data.ext[26]){
                    vo = ObjectUtil.deepCopy(MJAI.MJ[i]);
                    break;
                }
            }
            if(this.data.ext[26] > 0 && vo){
                vo.wang = 1;
                var card = new HZMahjong(MJAI.getDisplayVo(1, 1), vo);
                card.setScale(0.5);
                card.setPosition(labelWang.width + 80,-30);
                labelWang.addChild(card);
            }

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
        return new DZMJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);

        var xipai_btn = this.getWidget("xipai_btn");
        UITools.addClickEvent(xipai_btn, this, function () {
            sySocket.sendComReqMsg(4501, [], "");
            this.issent = true;
            PopupManager.remove(this);
            this.onOk();
        });
        if (MJRoomModel.nowBurCount == MJRoomModel.totalBurCount
            || (MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ && this.data.ext[27] == 1)) {
            xipai_btn.visible = false;
        } else {
            xipai_btn.visible = MJRoomModel.creditConfig[10] == 1;
        }
        var xpkf =  MJRoomModel.creditXpkf ? MJRoomModel.creditXpkf.toString() : 0;
        this.getWidget("label_xpkf").setString(xpkf);

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


        this.label_rule = this.getWidget("label_rule");

        var intParams = this.isReplay?MJReplayModel.intParams:MJRoomModel.intParams;

        var wanfaStr = ClubRecallDetailModel.getDZMJWanfa(intParams);
        if(MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ){
            wanfaStr = ClubRecallDetailModel.getZOUMJWanfa(intParams);
        }

        this.label_rule.setString(this.isReplay?"":wanfaStr);


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

        this.showWangPai();
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

        //用于不中鸟算全中的判断
        var iszhongniao = false;
        for(var i = 0;i<birdList.length;++i){
            var vo = MJAI.getMJDef(birdList[i]);
            var idIndex = vo.i%10;
            for(var j=0;j<nowBirdList.length;j++) {
                if (idIndex == nowBirdList[j] || vo.i == 201 || MJRoomModel.isOneBird()){
                    iszhongniao = true;
                    break;
                }
            }
            if(iszhongniao)break;
        }

        if (birdList){
            for(var j=0;j<birdList.length;j++) {
                var id = birdList[j];
                var mj = MJAI.getMJDef(id);
                var card = new HZMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.7;
                card.scale = _scale;
                card.x = (size.width * _scale + 5) * j + 80;
                card.y = -15;
                this.Panel_niao.addChild(card);
                var idIndex = mj.i%10;
                for(var i=0;i<nowBirdList.length;i++) {
                    if (idIndex == nowBirdList[i] || mj.i == 201 || MJRoomModel.isOneBird() || (MJRoomModel.intParams[30] && !iszhongniao)){
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
        // cc.log("data.ext[27] =",data.ext[27]);
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount
            || (MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ && data.ext[27] == 1)
            || (MJRoomModel.wanfa == GameTypeEunmMJ.ZOUMJ && data.ext[25] == 1)){//最后的结算
            PopupManager.remove(this);
            var mc = new HZMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

