/**
 * Created by zhoufan on 2016/7/27.
 */
var AHMJSmallResultCell = ccui.Widget.extend({

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
var AHMJSmallResultPop = BasePopup.extend({

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
                var card = new AHMahjong(MJAI.getDisplayVo(1,2),innerVo);
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
                        var gang = new AHMahjong(MJAI.getDisplayVo(1,2),gangVo);
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
        var ahmjHuPai = [];
        for (var i=0;i<handPais.length;i++) {
            var vo = MJAI.getMJDef(handPais[i]);
            if(MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ){
                if(user.isHu == vo.c){//如果是胡的那张牌
                    ahmjHuPai = vo;
                    continue;
                }
            }
            voArray.push(vo);
        }
        if((MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ() || MJRoomModel.isYYNXMJ())&& user.isHu){
            var vo = MJAI.getMJDef(user.isHu);
            ahmjHuPai.push(MJAI.getMJDef(user.isHu));
        }
        if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            for (var j = 0; j < user.xiaohus.length; j++) {
                var vo = MJAI.getMJDef(user.xiaohus[j]);
                ahmjHuPai.push(vo);
            }
        }
        voArray.sort(MJAI.sortMJ);
        var first_wang = 0;
        var second_wang = 0;
        var wangID = -1;
        var intParams = [];

        var now_wanfa = this.isReplay?MJReplayModel.wanfa:MJRoomModel.wanfa;
        if (now_wanfa == GameTypeEunmMJ.AHMJ || now_wanfa == GameTypeEunmMJ.TCPFMJ || now_wanfa == GameTypeEunmMJ.KWMJ){
            if(this.isReplay){
                intParams = MJReplayModel.intParams;
                wangID = MJReplayModel.ahmj_wangID;
            }else{
                intParams = MJRoomModel.intParams;
                wangID = MJRoomModel.ahmj_wangID;
            }
        }
        // cc.log("now_wanfa =",now_wanfa,"wangID =",wangID,"intParams =",JSON.stringify(intParams));
        if (now_wanfa == GameTypeEunmMJ.AHMJ ){
            if (wangID && wangID != -1){
                var cardVo = MJAI.getMJDef(wangID);
                if (intParams[4] == 1){//四王
                    first_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;
                }else{
                    if (intParams[4] == 2){//七王
                        first_wang = (cardVo.n )>9?(cardVo.n + 1)%9:cardVo.n ;;
                        second_wang = (cardVo.n + 1)>9?(cardVo.n + 1)%9:cardVo.n + 1;;
                    }
                }
            }
        }else if(now_wanfa == GameTypeEunmMJ.KWMJ){
            if(wangID && wangID != -1){
                var cardVo = MJAI.getMJDef(wangID);
                if(intParams[4] == 1){//开单王
                    first_wang = cardVo.n;
                }else{//开双王
                    first_wang = cardVo.n + 1;
                    second_wang = cardVo.n - 1;
                    if(first_wang == 10)first_wang = 1;
                    if(second_wang == 0)second_wang = 9;
                }
            }
        }else if(now_wanfa == GameTypeEunmMJ.TCPFMJ){
            if(wangID && wangID != -1){
                var cardVo = MJAI.getMJDef(wangID);
                first_wang = cardVo.n + 1;
                if(cardVo.t !=4 ){
                    if(first_wang == 10)first_wang = 1;
                }else{
                    if(first_wang == 5)first_wang = 1;
                    if(first_wang == 12)first_wang = 9;
                }

            }
        }

        var height = 70;
        var localOffx = 0;
        if(this.moldInitX > 215){
            localOffx = 20;
        }
        var _wangVo = MJAI.getMJDef(wangID);
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            if (now_wanfa == GameTypeEunmMJ.AHMJ || now_wanfa == GameTypeEunmMJ.KWMJ){
                if (wangID && wangID != -1){
                    if (voArray[i].t ==  _wangVo.t && (voArray[i].n == first_wang || voArray[i].n == second_wang)){
                        if (now_wanfa == GameTypeEunmMJ.AHMJ){
                            voArray[i].wang = 1;
                        }else{
                            voArray[i].chunwang = 1;
                        }
                    }else if (now_wanfa == GameTypeEunmMJ.KWMJ && intParams[4] == 0 && voArray[i].t == _wangVo.t && voArray[i].n == _wangVo.n){
                        voArray[i].zhengwang = 1;
                    }
                }
            }else if(now_wanfa == GameTypeEunmMJ.TCPFMJ){
                if (voArray[i].t == _wangVo.t && (voArray[i].n == first_wang)){
                    voArray[i].zhuan = 1;
                }
            }

            var card = new AHMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.6;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 0.5) * i + localOffx;
            card.y = height;        
            widget.addChild(card);

            if (user.isHu == voArray[i].c && now_wanfa != GameTypeEunmMJ.KWMJ && now_wanfa != GameTypeEunmMJ.TCPFMJ && now_wanfa != GameTypeEunmMJ.TCDPMJ
                && now_wanfa != GameTypeEunmMJ.YYNXMJ){
                var huImg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_15.png");
                huImg.x = size.width*0.80;
                huImg.y = size.height*0.17;
                card.addChild(huImg,1,5);
            }

            if(MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ || MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ || MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()
                || MJRoomModel.isYYNXMJ()){
                if(ahmjHuPai.length > 0){
                    for (var j = 0; j < ahmjHuPai.length; j++) {
                        var card = new AHMahjong(MJAI.getDisplayVo(1,1),ahmjHuPai[j]);
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
            }
        }

        if(MJRoomModel.isTCDPMJ() || MJRoomModel.isTCPFMJ()){
            this.createBuHuaCard(widget,user);
        }
    },

    createBuHuaCard:function(widget,user){
        // cc.log("user.pointArr =",JSON.stringify(user.pointArr));
        if(user.pointArr[1] > 0){
            var vo = MJAI.getMJDef(205);
            var card = new AHMahjong(MJAI.getDisplayVo(1,1),vo);
            var size = card.getContentSize();
            var _scale = 0.4;
            card.scale = _scale;
            card.x = 1425;
            card.y = 60;
            widget.addChild(card);
            var label = new cc.LabelTTF("","Arial",40,cc.size(80, 50));
            widget.addChild(label);
            label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            label.setString("x"+user.pointArr[1]);
            label.x = 1510;
            label.y = 83;
        }
    },

    createHuedPais: function(widget,user) {
        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        hutxt.x += 70;
        hutxt.setString("");
        var pointArr = user.pointArr || [];
        var hutxtList = ["鸟"];
        var huStrArr = [];
        
        // cc.log("pointArr =",JSON.stringify(pointArr));
        if (MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ ){
            var huPoint = pointArr[0];
            if (huPoint > 0){
                huStrArr.push("中" + huPoint + "鸟");
            }  
           var zhuangxianScore = pointArr[1];
            if (zhuangxianScore != 0){
                if(zhuangxianScore>0){
                    huStrArr.push("庄闲分+"+zhuangxianScore);
                }else{
                    huStrArr.push("庄闲分"+zhuangxianScore);
                }
            } 
        }
        

        var dahuConfig = {0:"硬庄",1:"清一色",2:"七小对",3:"杠上花",4:"抢杠胡",5:"杠上炮",
            6:"3王",7:"4王",8:"6王",9:"7王"};
        var dahus = user.xiaohus || [];
        if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ || MJReplayModel.wanfa == GameTypeEunmMJ.CXMJ){
            dahuConfig = {1:"自摸",2:"门清",3:"碰碰胡",4:"清一色",5:"小七对",
            6:"龙七对",7:"双龙七对",8:"杠上花",9:"双杠上花",10:"五梅花",11:"双杠五梅花"};
            dahus = user.dahus || [];
        }else if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            dahuConfig = {1:"平胡",2:"无王无将",3:"缺一色",4:"一枝花",5:"天胡",
            6:"碰碰胡",7:"将将胡",8:"七小对",9:"清一色",10:"海底捞月",11:"海底炮",
            12:"杠上花",13:"抢杠胡",14:"杠上炮",15:"报听",16:"无王",17:"四王",18:"六王",19:"六王",20:"六王",21:"黑天胡",22:"豪华七小对"};
            dahus = user.dahus || [];
        }else if(MJRoomModel.isTCPFMJ()){
            dahuConfig = {1:"平胡",2:"十三烂",3:"全九幺",4:"碰碰胡",5:"七小对"};
            dahus = user.dahus || [];
        }else if(MJRoomModel.isTCDPMJ()){
            dahuConfig = {1:"平胡",2:"七小对",3:"豪华七小对",4:"超豪华七小对",5:"超超豪华七小对",6:"抢杠胡"};
            dahus = user.dahus || [];
        }else if(MJRoomModel.isYYNXMJ()){
            dahuConfig = {1:"门清",2:"平胡",3:"碰碰胡",4:"将将胡",5:"清一色",6:"七小对",7:"豪华七小对",8:"双豪华七小对",9:"三豪华七小对",10:"报听",11:"全球人",
                12:"",13:"杠上花",14:"海底捞",15:"抢杠胡",16:"海底中鸟"};
            dahus = user.dahus || [];
        }
        for(var i = 0;i<dahus.length;++i){
            if(dahuConfig[dahus[i]]){
                huStrArr.push(dahuConfig[dahus[i]]);
            }
        }

        if (MJRoomModel.isTCDPMJ() || MJRoomModel.isYYNXMJ() || (MJRoomModel.isTCPFMJ() && pointArr[0] > 0)){
            var pointConfig = {1:"补花",2:"杠牌",3:"跑风"};
            if(MJRoomModel.isTCDPMJ()){
                pointConfig = {1:"补花",2:"放杠",3:"暗杠",4:"回头杠",5:"接杠"};
            }else if(MJRoomModel.isYYNXMJ()){
                pointConfig = {1:"明杠",2:"暗杠",3:"接杠"};
            }
            for(var i = 1;i<pointArr.length;++i){
                if(pointArr[i]){
                    if(MJRoomModel.isTCDPMJ()){
                        if(i == 1){
                            if(pointArr[0] > 0)
                                huStrArr.push(pointConfig[i] + pointArr[i]+"分");    
                        }else{
                            huStrArr.push(pointConfig[i] + pointArr[i]+"分");
                        }
                    }else{
                        huStrArr.push(pointConfig[i] + pointArr[i]+"分");
                    }
                }
            }
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            if(MJRoomModel.intParams[10] > 0){
                huStrArr.push("坐压" + MJRoomModel.intParams[10] + "分");
            }
            var huPoint = pointArr[0];
            if (huPoint > 0){
                huStrArr.push("中" + huPoint + "鸟");
            }
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
        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[6]);

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

        
        if(user.ext && (MJRoomModel.isTCPFMJ()||MJRoomModel.isTCDPMJ() || MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ)){
            if(user.ext[0] >= 0){
                ccui.helper.seekWidgetByName(widget,"piaofenImg").loadTexture("res/res_mj/mjSmallResult/biao_piao"+user.ext[0]+".png");
                ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = true;
            }else{
                ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = false;
            }
        }else{
            ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = false;
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
        return new AHMJSmallResultCell(huUser, paoUser, ext);
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


        this.label_rule = this.getWidget("label_rule");
        var wanfaStr = "";
        if(this.isReplay){

        }else{
            wanfaStr = ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams);
        }
        this.label_rule.setString(wanfaStr);

        if(this.label_rule.getAutoRenderSize().height < 80){
            this.label_rule.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.label_rule.setPositionY(this.label_rule.y + 10);
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
      
        if(MJRoomModel.wanfa == GameTypeEunmMJ.AHMJ || MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            this.AHMJShowBirdsInHand();
        }

        if (ClosingInfoModel.isReplay){
            this.getWidget("replay_tip").visible =  true;
        }
    },
    AHMJShowBirdsInHand: function(){
        var birdList = this.data.bird || [];
        var birdSeat = this.data.birdSeat || [];

        var birdData = [[],[],[],[]];
        for(var i = 0;i<birdList.length;++i){
            var seat = birdSeat[i] || 0;

            var dir = 1;
            if(seat == 0){
                if(MJRoomModel.renshu == 3)dir = 3;
                if(MJRoomModel.renshu == 2)dir = 4;
            }else{
                var seq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat);
                var dirArr = [1,2,3,4];
                if(MJRoomModel.renshu == 3)dirArr = [1,2,4];
                if(MJRoomModel.renshu == 2)dirArr = [1,3];
                dir = dirArr[seq - 1];
            }
            if(dir >= 1 && dir <= 4){
                birdData[dir-1].push({id:birdList[i],seat:seat});
            }
        }

        var _scale = 0.6;
        this.birdsNum = [];
        for(var i = 0;i<birdData.length;++i) {
            var dirBird = birdData[i];
            for (var j = 0; j < dirBird.length; ++j) {
                var vo = MJAI.getMJDef(dirBird[j].id);
                var card = new AHMahjong(MJAI.getDisplayVo(1, 1), vo);
                var size = card.getContentSize();
                card.scale = _scale;
                card.x = 1660 - (j + 1) * (size.width * _scale - 0.5);
                card.y = 75;
                if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
                    _scale = 0.4;
                    card.scale = _scale;
                    card.x = 1660 - (j%3 + 1) * (size.width * _scale - 0.5);
                    card.y = 40 + 80 * Math.floor((j/3));
                }
                var niao = cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_25.png");
                niao.setAnchorPoint(0,0.5);
                niao.x = 0;
                niao.y = size.height - 8;
                if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
     
                }else{
                    card.addChild(niao);
                }
                var userWidget = this.getWidget("user"+dirBird[j].seat);
                if(userWidget){
                   userWidget.addChild(card);
                }
            }
        }
    },
    showBirds: function() {
        this.Panel_niao.visible = true;
        if (MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ)
            this.Panel_niao.visible = false;

        if(MJRoomModel.wanfa == GameTypeEunmMJ.TCPFMJ){
            this.getWidget("Label_niao").setString("钻牌");
            var vo = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
            var first_wang = vo.n + 1;
            if(vo.t !=4 ){
                if(first_wang == 10)first_wang = 1;
            }else{
                if(first_wang == 5)first_wang = 1;
                if(first_wang == 12)first_wang = 9;
            }

            var vo1 = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
            vo1.n = first_wang;
            vo1.zhuan = 1;
            card = new AHMahjong(MJAI.getDisplayVo(1, 1), vo1);
            var size = card.getContentSize();
            card.scale = 0.6;
            card.y = -30;
            card.x = 20;
            this.Panel_niao.addChild(card,999);
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            var vo = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
            vo.zhengwang = 1;
            var card = new AHMahjong(MJAI.getDisplayVo(1, 1), vo);
            var size = card.getContentSize();
            card.scale = 0.6;
            card.x = 870;
            card.y = -25;
            this.Panel_niao.addChild(card,999);
        }

        var sbirdList = {
            1:[1,5,9],
            2:[2,6],
            3:[3,7],
            4:[4,8]
        };
        if (this.isReplay?MJReplayModel.is159Bird():MJRoomModel.is159Bird()){
            sbirdList = {
                1:[1,5,9],
                2:[1,5,9],
                3:[1,5,9],
                4:[1,5,9]
            };
        }

        if(MJRoomModel.isYYNXMJ() && MJRoomModel.intParams[6] == 2){
            if(MJRoomModel.renshu == 2){
                sbirdList = {
                    1:[1,3,5,7,9],
                    2:[1,3,5,7,9],
                    3:[1,3,5,7,9],
                    4:[1,3,5,7,9]
                };
            }else if(MJRoomModel.renshu == 3){
                sbirdList = {
                    1:[1,4,7],
                    2:[1,4,7],
                    3:[1,4,7],
                    4:[1,4,7]
                };
            }else{
                sbirdList = {
                    1:[1,5,9],
                    2:[1,5,9],
                    3:[1,5,9],
                    4:[1,5,9]
                };
            }
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
                var card = new AHMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.7;
                card.scale = _scale;
                card.x = (size.width * _scale - 1.5) * j + 40;
                card.y = -40;
                this.Panel_niao.addChild(card);
                var idIndex = mj.i%10;
                for(var i=0;i<nowBirdList.length;i++) {
                    if(MJRoomModel.isYYNXMJ()){
                        if (idIndex == nowBirdList[i]){
                            var niaoSprite = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_22.png");
                            niaoSprite.x = size.width*0.5;
                            niaoSprite.y = size.height*0.55;
                            niaoSprite.scale = 1.2;
                            card.addChild(niaoSprite, 10);
                            break;
                        }
                    }else{
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
        var isBreak = MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ?(data.ext[10] == 1):(data.ext[9] == 1);
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount || isBreak){//最后的结算
            PopupManager.remove(this);
            var mc = new AHMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

