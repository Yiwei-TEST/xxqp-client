
var YJMJSmallResultPop = BasePopup.extend({

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
            if((innerAction==MJAction.AN_GANG || innerAction==MJAction.GANG || innerAction==MJAction.BU_ZHANG) && (innerArray.length>3 || innerObject.gangVo)){
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
                var card = new YJMahjong(MJAI.getDisplayVo(1,2),innerVo);
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
                        var gang = new YJMahjong(MJAI.getDisplayVo(1,2),gangVo);
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
        var handPais = user.cards;
        var voArray = [];
        var huVo = null;
        for (var i=0;i<handPais.length;i++) {
            var vo = MJAI.getMJDef(handPais[i]);

            if (user.isHu == vo.c) {//如果是胡的那张牌
                huVo = vo;
                continue;
            }

            voArray.push(vo);
        }
        voArray.sort(MJAI.sortMJ);

        if(huVo)voArray.push(huVo);

        var height = 70;
        var localOffx = 0;
        if(this.moldInitX > 265){
            localOffx = 60;
        }
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;

            var card = new YJMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
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

                card.x += 20;
            }
        }
    },

    createHuedPais: function(widget,user) {

        var infoArr = [];

        var gangInfo = user.gangInfos;//0暗杠次数 1摸杠次数 2接杠次数 3放杠次数

        if(gangInfo[0] > 0)infoArr.push({img:"icon_ag",num:gangInfo[0]});
        if(gangInfo[1] > 0)infoArr.push({img:"icon_mg",num:gangInfo[1]});
        if(gangInfo[2] > 0)infoArr.push({img:"icon_jg",num:gangInfo[2]});
        if(gangInfo[3] > 0)infoArr.push({img:"icon_fg",num:gangInfo[3]});

        //一字撬
        if(user.cards.length<=2 && this.data.ext[13] == 1){
            infoArr.push({img:"icon_yzqyx",num:1});
        }

        //var dahuCfg = ["碰碰胡","将将胡","清一色","七小对","豪华七小对","双豪华七小对","三豪华七小对","杠爆","抢杠胡","海底捞",
        //    "一条龙", "门清","天胡","一字撬","报听","码码胡"];

        user.dahus = user.dahus || [];

        for(var i = 0;i<user.dahus.length;++i){
            var id = user.dahus[i];
            if(id >= 0 && id <= 15){
                infoArr.push({img:"dahu_" + id,num:1});
            }
        }
        var birdSeat = this.data.birdSeat || [];
        var bird = this.data.bird || [];

        if(ArrayUtil.indexOf(birdSeat,user.seat)>=0){
            infoArr.push({img:"icon_zn",num:1});
        }

        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        hutxt.setString("");

        var myBirdArr = [];
        for(var i = 0;i<birdSeat.length;++i){
            if(birdSeat[i] == user.seat){
                myBirdArr.push(bird[i]);
            }
        }

        var posX = 80;
        for(var i = 0;i<infoArr.length;++i){
            var img = infoArr[i].img;
            var num = infoArr[i].num;

            var img_spr = new cc.Sprite("res/res_yjmj/yjmjRoom/" + img + ".png");
            img_spr.setAnchorPoint(0,0.5);
            img_spr.setPosition(posX,40);
            img_spr.setScale(1.5);
            hutxt.addChild(img_spr);

            posX += (img_spr.width + 10);


            if(img == "icon_zn"){
                img_spr.setPosition(1340,140);
                var startX = img_spr.x - 25 - (myBirdArr.length - 1)/2*35;
                for(var t = 0;t<myBirdArr.length;++t){
                    var mj = MJAI.getMJDef(myBirdArr[t]);
                    var card = new YJMahjong(MJAI.getDisplayVo(1, 1), mj);
                    card.setScale(0.5);
                    card.setPosition(startX + t*90,img_spr.y - 150);
                    hutxt.addChild(card);
                }
            }

            if(num > 1){
                var label = new cc.LabelTTF("x" + num,"Arial",24);
                label.setAnchorPoint(0,0.5);
                label.setPosition(posX,img_spr.y);
                label.setColor(cc.color("FF5400"));
                hutxt.addChild(label);

                posX += (label.width + 10);
            }
            posX += 10;
        }

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
        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[8]);

        //头像
        var spritePanel = ccui.helper.seekWidgetByName(widget,"Image_icon");
        this.showIcon(spritePanel,user.icon);


        var isHu = false;
        if (user.isHu){
            isHu = true;
        }
        //胡牌
        ccui.helper.seekWidgetByName(widget,"Image_hu").visible = isHu;

        var isFanPao = this.data.fangPaoSeat == user.seat;

        //点炮
        ccui.helper.seekWidgetByName(widget,"Image_dianpao").visible = isFanPao;


        ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = false;

        user.moldPais = [];

        if(user.mGang){
            for(var i = 0;i<user.mGang.length;++i){
                user.moldPais.push({action:MJAction.GANG,cards:user.mGang[i].cards});
            }
        }

        if(user.aGang){
            for(var i = 0;i<user.aGang.length;++i){
                user.moldPais.push({action:MJAction.AN_GANG,cards:user.aGang[i].cards});
            }
        }

        if(user.jGang){
            for(var i = 0;i<user.jGang.length;++i){
                user.moldPais.push({action:MJAction.GANG,cards:user.jGang[i].cards});
            }
        }

        if(user.pengs){
            for(var i = 0;i<user.pengs.length-2;i+=3){
                var cards = [user.pengs[i],user.pengs[i+1],user.pengs[i+2]];
                if(cards[0] && cards[1] && cards[2]){
                    user.moldPais.push({action:MJAction.PENG,cards:cards});
                }
            }
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

    onShowMoreResult:function(){
        var mc = new MJSmallResultOtherPop(this.data);
        PopupManager.addPopup(mc);
    },

    selfRender: function () {
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);
        var Button_yupai = this.getWidget("Button_yupai");
        UITools.addClickEvent(Button_yupai,this,this.onShowMoreResult);
        Button_yupai.visible = true;
        this.closingPlayers = this.data.closingPlayers;

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

        this.label_rule = this.getWidget("label_rule");
        var wanfaStr = "";
        if(this.isReplay){
            wanfaStr = ClubRecallDetailModel.getYJMJWanfa(ClosingInfoModel.intParams);
        }else{
            wanfaStr = ClubRecallDetailModel.getYJMJWanfa(MJRoomModel.intParams);
        }
        this.label_rule.setString(wanfaStr);

        //if(this.label_rule.getAutoRenderSize().height < 80){
        //    this.label_rule.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //    this.label_rule.setPositionY(this.label_rule.y + 10);
        //}

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

        //this.Panel_niao = this.getWidget("Panel_niao");

        //this.showLeftCards(this.data.leftCards || []);
        this.getWidget("Label_niao").visible = false;

        if (ClosingInfoModel.isReplay){
            var txt_hf = this.getWidget("replay_tip");
            txt_hf.setPosition(1086,657);
            txt_hf.visible =  true;
        }
    },

    showBirds: function() {
        var birdList = this.data.bird || [];
        for (var j = 0; j < birdList.length; j++) {
            var id = birdList[j];
            var mj = MJAI.getMJDef(id);
            var card = new YJMahjong(MJAI.getDisplayVo(1, 2), mj);
            var size = card.getContentSize();
            var _scale = 0.7;
            card.scale = _scale;
            card.x = -(size.width * _scale + 5) * j;
            card.y = -15;
            this.Panel_niao.addChild(card);
        }
    },

    showLeftCards:function(data){
        var txt = this.getWidget("Label_niao");
        txt.x += 15;
        txt.setString("剩余牌:");

        var list = new ccui.ListView();
        list.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        list.setContentSize(900,280);
        list.setPosition(30,0);
        this.Panel_niao.addChild(list,1);

        var tip_spr = new cc.Sprite("res/res_yjmj/yjmjRoom/jt_next.png");
        tip_spr.setPosition(list.x + list.width + 20,list.y + list.height/2);
        this.Panel_niao.addChild(tip_spr);

        for (var j = 0; j < data.length; j++) {

            var item = new ccui.Widget();
            item.setAnchorPoint(0,0);
            item.setContentSize(60,70);

            var vo = MJAI.getMJDef(data[j]);
            var card = new YJMahjong(MJAI.getDisplayVo(1, 2), vo);
            card.scale = 0.5;
            item.addChild(card);

            list.pushBackCustomItem(item);
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
        cc.log("data.ext[17] =",data.ext[17]);
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount || (data.ext[17] == 1)){//最后的结算
            PopupManager.remove(this);
            var mc = new YJMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

