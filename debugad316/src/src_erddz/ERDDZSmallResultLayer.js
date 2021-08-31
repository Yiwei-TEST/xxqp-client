/**
 * Created by cyp on 2019/11/13.
 */
var ERDDZSmallResultLayer = cc.Layer.extend({
    ctor:function(msgData){
        this._super();

        this.msgData = msgData;

        SyEventManager.addEventListener(SyEvent.SOCKET_OPENED,this,this.onSuc);
        SyEventManager.addEventListener(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        SyEventManager.addEventListener(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
        this.setLayerWithData();
        this.showRuleInfo();
        this.setInfoData();
    },

    setLayerWithData:function(){
        if(!this.msgData)return;

        var players = this.msgData.closingPlayers || [];

        this.showPlayerItem(players);

        var titleType = 1;
        for(var i = 0;i<players.length;++i){
            if(players[i].seat == ERDDZRoomModel.mySeat){
                titleType = players[i].isHu?1:-1;
            }
        }
        this.addTitleImg(titleType);
        this.showBeiShuInfo(players[0].ext || []);

        if(ERDDZRoomModel.isMoneyRoom() && !ERDDZRoomModel.replay){
            this.showMoneyRoomBtn();
        }
    },

    showBeiShuInfo:function(ext){
        var itemArr = [];

        if(ext[3] == 1)itemArr.push("春天2倍");
        if(ext[3] == 2)itemArr.push("反春天2倍");
        if(ext[4] > 1)itemArr.push("炸弹" + ext[4] + "倍");
        if(ext[5] > 1)itemArr.push("抢地主" + ext[5] + "倍");
        if(ext[6] > 1)itemArr.push("底牌" + ext[6] + "倍");
        if(ext[7] > 1)itemArr.push("加倍" + ext[7] + "倍");
        if(ext[8] > 1)itemArr.push("让牌" + ext[8] + "倍");

        if(ERDDZRoomModel.isMoneyRoom()){
            itemArr.push("底分:" + ERDDZRoomModel.goldMsg[2]);
        }

        var label = UICtor.cLabel(itemArr.join("  "),50);
        label.setColor(cc.color.YELLOW);
        label.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 100);
        this.addChild(label,1);

    },

    showRuleInfo:function(){
        var str = ClubRecallDetailModel.getERDDZWanfa(ERDDZRoomModel.intParams,true,ERDDZRoomModel.isMoneyRoom());

        var label = UICtor.cLabel(str,33);
        label.setAnchorPoint(0,0);
        label.setTextAreaSize(cc.size(750,150));
        label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color(239,145,87));
        label.setPosition(20,5);
        this.addChild(label,1);

        this.label_rule = label;
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(210);
        this.addChild(grayLayer);

        this.label_info = UICtor.cLabel("2019-9-10 10:35  牌桌号:123456  第1局",33);
        this.label_info.setColor(cc.color(254,233,95));
        this.label_info.setPosition(cc.winSize.width/2 + 550,75);
        this.addChild(this.label_info);

        this.btn_jxyx = new ccui.Button("res/res_erddz/btn_jixu.png","res/res_erddz/btn_jixu.png");
        this.btn_jxyx.setPosition(cc.winSize.width/2 + 50,75);
        this.addChild(this.btn_jxyx,2);

        this.btn_jxyx.addTouchEventListener(this.onClickBtn,this);

        this.btn_xipai = new ccui.Button("res/res_erddz/xipai.png", "res/res_erddz/xipai.png");
        this.btn_xipai.setPosition(cc.winSize.width / 2 - 280, 75);
        this.addChild(this.btn_xipai, 2);
        if ((ERDDZRoomModel.nowBurCount == ERDDZRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)) {
            this.btn_xipai.visible = false;
        }else{
            this.btn_xipai.visible = ERDDZRoomModel.creditConfig[10] == 1;
        }
        var bisaiImg = new cc.Sprite("res/ui/bjdmj/popup/pyq/sai.png");
        bisaiImg.setPosition(175, 70);
        this.btn_xipai.addChild(bisaiImg);


        var label_xpkf = UICtor.cLabel(ERDDZRoomModel.creditXpkf,50);
        label_xpkf.setAnchorPoint(0,0.5);
        label_xpkf.setPosition(200,70);
        this.btn_xipai.addChild(label_xpkf);

        this.btn_xipai.addTouchEventListener(this.onClickBtn, this);
    },

    showMoneyRoomBtn:function(){
        var img = "res/ui/common/common_btn_return.png";
        this.btn_to_hall = new ccui.Button(img,img);
        this.btn_to_hall.setPosition(cc.winSize.width/2 - 870,cc.winSize.height - 75);
        this.addChild(this.btn_to_hall);
        this.btn_to_hall.addTouchEventListener(this.onClickBtn,this);

    },

    showPlayerItem:function(players){
        for(var i = 0;i<players.length;++i){
            var item = new ERDDZSmallResultItem();
            item.setPosition(cc.winSize.width/2,cc.winSize.height - 255 - i*192);
            item.setItemData(players[i]);
            this.addChild(item);
        }
    },

    addTitleImg:function(type){
        var img = "res/res_erddz/biaoti.png";
        if(type < 0){
            img = "res/res_erddz/biaoti1.png";
        }
        var title = new cc.Sprite(img);
        title.setScale(0.7);
        title.setPosition(cc.winSize.width/2,cc.winSize.height - 75);
        this.addChild(title,1);
    },

    setInfoData:function(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var hour = date.getHours();
        var min = date.getMinutes();

        if(month < 10)month = "0" + month;
        if(day < 10)day = "0" + day;
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min = "0" + min;

        var time = year + "-" + month + "-" + day + " " + hour + ":" + min;
        var table = "牌桌号:" + ERDDZRoomModel.tableId;

        if(ERDDZRoomModel.isMoneyRoom()){
            table = "序号:" + ERDDZRoomModel.tableId;
        }

        var jushu = "第" + ERDDZRoomModel.nowBurCount + "局";

        this.label_info.setString(time + "  " + table + "  " + jushu);

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_jxyx){

                if(ERDDZRoomModel.isMoneyRoom()){
                    this.moneyRoomStartAnother();
                    return;
                }

                PopupManager.remove(this);

                if(ERDDZRoomModel.replay){
                    return;
                }

                if((ERDDZRoomModel.nowBurCount == ERDDZRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)){
                    var BigResultLayer = ERDDZRoomModel.getBigResultLayer();
                    var layer = new BigResultLayer(this.msgData);
                    PopupManager.addPopup(layer);

                }else{
                    sySocket.sendComReqMsg(3);
                }
            }else if(sender == this.btn_to_hall){
                LayerManager.showLayer(LayerFactory.HOME);
                if(LayerManager.getLayer(LayerFactory.GOLD_LAYER)){
                    LayerManager.showLayer(LayerFactory.GOLD_LAYER);
                }
                PopupManager.remove(this);
            }else if(sender == this.btn_xipai){
                sySocket.sendComReqMsg(4501, [], "");
                PopupManager.remove(this);
                if((ERDDZRoomModel.nowBurCount == ERDDZRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)){
                    var BigResultLayer = ERDDZRoomModel.getBigResultLayer();
                    var layer = new BigResultLayer(this.msgData);
                    PopupManager.addPopup(layer);

                }else{
                    sySocket.sendComReqMsg(3);
                }
            }
        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
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

var ERDDZSmallResultItem = cc.Node.extend({
    ctor:function(){
        this._super();

        this.initNode();
    },

    initNode:function(){
        this.itemBg = new cc.Sprite("res/res_erddz/lan_di.png");
        this.addChild(this.itemBg);

        var headKuang = new cc.Sprite("res/res_erddz/touxiangkuang.png");
        headKuang.setPosition(120,this.itemBg.height/2 + 15);
        this.itemBg.addChild(headKuang);

        var sten=new cc.Sprite("res/res_erddz/touxiangkuang.png");
        var clipnode = new cc.ClippingNode();
        clipnode.setStencil(sten);
        clipnode.setAlphaThreshold(0.8);
        this.iconSpr = new cc.Sprite("res/ui/common/default_m.png");
        this.iconSpr.setScale(120/this.iconSpr.width);
        clipnode.addChild(this.iconSpr);
        clipnode.setPosition(headKuang.getPosition());
        this.itemBg.addChild(clipnode);

        this.icon_dz = new cc.Sprite("res/res_erddz/icon_dz.png");
        this.icon_dz.setPosition(headKuang.x - headKuang.width/2 + this.icon_dz.width/2,
            headKuang.y + headKuang.height/2 - this.icon_dz.height/2);
        this.itemBg.addChild(this.icon_dz,2);

        this.label_name = UICtor.cLabel("玩家的名字",33);
        this.label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_name.setPosition(headKuang.x,30);
        this.label_name.setTextAreaSize(cc.size(180,36));
        this.itemBg.addChild(this.label_name);

        var config = ["本局得分"];
        this.labelArr = [];
        for(var i = 0;i<config.length;++i){
            var txt = UICtor.cLabel(config[i],42);
            txt.setColor(cc.color(250,242,102));
            txt.setPosition(this.itemBg.width - 250,this.itemBg.height/2 + 38);
            this.itemBg.addChild(txt);

            var label = UICtor.cLabel("+100",42);
            label.setColor(cc.color(250,242,102));
            label.setPosition(txt.x,this.itemBg.height/2 - 38);
            this.itemBg.addChild(label);

            this.labelArr.push(label);
        }
    },

    setItemData:function(data){
        this.label_name.setString(data.name);
        this.showIcon(data.icon);

        var bgImg = "res/res_erddz/lan_di.png";
        if(data.seat == ERDDZRoomModel.mySeat){
            bgImg = "res/res_erddz/hong_di.png";
        }
        this.itemBg.initWithFile(bgImg);

        if(data.boom != 1){
            this.icon_dz.initWithFile("res/res_erddz/icon_nm.png");
        }

        this.setNumLabel(this.labelArr[0],data.point || 0);

        if(ERDDZRoomModel.isMoneyRoom()){
            this.setNumLabel(this.labelArr[0],data.totalPoint || 0);
            this.showMoneyIcon(this.labelArr[0]);
        }

        this.showLeftCards(data.cards || []);
    },

    showMoneyIcon:function(label){
        var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
        icon.setAnchorPoint(1,0.5);
        icon.setPosition(-10,label.height/2);
        label.addChild(icon);
    },

    showLeftCards:function(ids){
        ERDDZRoomModel.sortIdByValue(ids);
        for(var i = 0;i<ids.length;++i){
            var card = new ERDDZCard(ids[i]);
            card.setScale(0.45);
            card.setPosition(300 + i*45,this.itemBg.height/2);
            this.itemBg.addChild(card);
        }
    },

    setNumLabel:function(label,num,str){
        var color = cc.color(36,195,238);
        if(num > 0){
            num = "+" + num;
            color = cc.color(250,242,102);
        }

        if(str) num = str + num;

        label.setString(num);
        label.setColor(color);
    },

    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        if (iconUrl) {
            var self = this;
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    self.iconSpr.setTexture(img);
                    self.iconSpr.setScale(120/self.iconSpr.width);
                }
            });
        }else{
            this.iconSpr.initWithFile(defaultimg);
        }
    },
});
