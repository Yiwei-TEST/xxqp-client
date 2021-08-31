var ChangYongGameModel = {

    wanfaList: JSON.parse(cc.sys.localStorage.getItem("Bjd_always_game")) || [1001,2001,3001],//常用玩法数据 iconId

    addWanfa:function(iconId){
        if(this.wanfaList.length < 6)
            this.wanfaList.push(parseInt(iconId));
        // cc.log("this.wanfaList =",JSON.stringify(this.wanfaList));
    },

    removeWanfa:function(iconId){
        // cc.log("iconId =",iconId);
        var index = ArrayUtil.indexOf(this.wanfaList,parseInt(iconId));
        if(index > -1 && this.wanfaList.length > 1){
            this.wanfaList.splice(index,1);
        }
        // cc.log("this.wanfaList =",JSON.stringify(this.wanfaList));
    },

    reset:function(){
        this.wanfaList = [];
    },
};

var ChangYongPop = BasePopup.extend({
    ctor:function(){
        this._super("res/changYongPop.json");
    },

    selfRender:function(){
        this.scrollHallItem = this.getWidget("roomButton");
        this.scrollHallItem.retain();
        this.scrollHallItem.removeFromParent(true);

        this.Image_1 = this.getWidget("Image_1");

        this.Button_set = this.getWidget("Button_set");
        UITools.addClickEvent(this.Button_set, this, this.OnButtonset);

        
        this.getIconData();

        this.initGameButton();
    },

    OnButtonset:function(){
        var mc = new ChangYongSetPop();
        PopupManager.addPopup(mc);
        if(PopupManager.getClassByPopup(ChangYongPop)){
            PopupManager.removeClassByPopup(ChangYongPop)
        }
    },

    getIconData:function(){
        this.iconData = [];
        if(GoldHallModle && GoldHallModle.iconList){
            for (var i = 0; i < GoldHallModle.iconList.length; i++) {
                var buttonMsg = GoldHallModle.iconList[i].extMsg.split(",")
                for (var j = 0; j < ChangYongGameModel.wanfaList.length; j++) {
                    if (ChangYongGameModel.wanfaList[j] == buttonMsg[0]){
                        this.iconData.push(GoldHallModle.iconList[i]);
                    }
                }
            }
        }
    },
    initGameButton:function(){
        if(this.iconData.length>0){
            var roomItemWidth = this.scrollHallItem.width;
            var roomItemHeight = this.scrollHallItem.height;
            var tempW = roomItemWidth + 50;
            var tempH = roomItemHeight + 30;    
            var startY = roomItemHeight + 240;
            var startX = roomItemWidth/2 + 50;
            var idx = 1;
            var posIndex = 0;
            for(var i = 0;i < this.iconData.length;++i){
                var newItem = this.scrollHallItem.clone();
                UITools.addClickEvent(newItem, this, this.onClickItemHall);
                newItem.buttonMsg = this.iconData[i].extMsg.split(",");
                newItem.playType = this.iconData[i].playTypes.split(",");
                newItem.keyId = this.iconData[i].keyId;
                newItem.type = this.iconData[i].type;
                this.updateItemHallUI(newItem);
                newItem.x = startX + Math.floor(posIndex%4) * tempW;
                newItem.y = startY -  Math.floor(posIndex/4) * tempH;
                this.Image_1.addChild(newItem);
                idx++;
                posIndex++;
                if(i == this.iconData.length-1){
                    this.Button_set.x = startX + Math.floor(posIndex%4) * tempW;
                    this.Button_set.y = startY -  Math.floor(posIndex/4) * tempH;
                }
            }
        }
    },
    updateItemHallUI:function(item){
        // var roomButton = item.getChildByName("roomButton"); //按钮
        var room_gameImg = item.getChildByName("room_gameImg"); // 玩法图片
        var ButtonBg = "";
        if(GameTypeManager.isPK(item.playType[0])){
            ButtonBg="res/ui/bjdmj/bjdHomeLayer/roomButton/puke.png"
        }else if(GameTypeManager.isZP(item.playType[0])){
            ButtonBg="res/ui/bjdmj/bjdHomeLayer/roomButton/zipai.png"
        }else if(GameTypeManager.isMJ(item.playType[0])){
            ButtonBg="res/ui/bjdmj/bjdHomeLayer/roomButton/majiang.png"
        }
        item.loadTextureNormal(ButtonBg);

        var gameImg = "res/ui/bjdmj/bjdHomeLayer/roomButton/"+item.buttonMsg[0]+".png";
        room_gameImg.loadTexture(gameImg);
   },

   onClickItemHall:function(item){
        if(item.type == 2){
            //智能匹配前判断切服
            CheckJoinModel.toMatchRoom(item.playType,2);
        }else{
            sySocket.sendComReqMsg(137 , [] , [] , 2);
            if(SignInModel.isQianDao == false && (!SyConfig.IS_LOAD_AD || !SyConfig.IS_LOAD_AD_NEW)){
                var pop = new SignInPop();
                PopupManager.addPopup(pop);
            }
            sySocket.sendComReqMsg(137 , [] , ""+item.keyId , 6);
        }

        if(PopupManager.getClassByPopup(ChangYongPop)){
            PopupManager.removeClassByPopup(ChangYongPop)
        }
   },

    onClose:function(){
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});

var ChangYongSetPop = BasePopup.extend({
    ctor:function(){
        this._super("res/changYongSetPop.json");
    },

    selfRender:function(){
        this.normalItem = this.getWidget("Button_normal");
        this.normalItem.retain();
        this.normalItem.removeFromParent(true);

        this.Image_7 = this.getWidget("Image_7");

        this.allGameItem = this.getWidget("Button_game");
        this.allGameItem.retain();
        this.allGameItem.removeFromParent(true);

        this.ScrollView_allgame = this.getWidget("ScrollView_allgame");
        // this.ScrollView_allgame.scrollsToTop = NO;
        this.refreshNormalButton();
        this.refreshAllGameButton();
    },

    refreshNormalButton:function(){
        this.iconData = [];
        if(GoldHallModle && GoldHallModle.iconList){
            for (var i = 0; i < GoldHallModle.iconList.length; i++) {
                var buttonMsg = GoldHallModle.iconList[i].extMsg.split(",")
                for (var j = 0; j < ChangYongGameModel.wanfaList.length; j++) {
                    if (ChangYongGameModel.wanfaList[j] == buttonMsg[0]){
                        this.iconData.push(GoldHallModle.iconList[i]);
                    }
                }
            }
        }
        this.Image_7.removeAllChildren();
        if(this.iconData){
            var roomItemWidth = this.normalItem.width;
            var roomItemHeight = this.normalItem.height;
            var tempW = roomItemWidth + 20;
            var tempH = roomItemHeight + 10;    
            var startY = this.Image_7.height - roomItemHeight + 5;
            var startX = roomItemWidth/2 + 5;
            var posIndex = 0;
            for(var i = 0; i < this.iconData.length; i++){
                var newItem = this.normalItem.clone();
                UITools.addClickEvent(newItem, this, this.onClickNormalGameButton);
                newItem.buttonMsg = this.iconData[i].extMsg.split(",");
                newItem.playType = this.iconData[i].playTypes.split(",");
                this.updateItemNormalUI(newItem);
                newItem.x = startX;
                newItem.y = startY -  Math.floor(posIndex) * tempH;
                this.Image_7.addChild(newItem);
                posIndex++;
            }
        }
    },
   
    refreshAllGameButton:function(){
        this.ScrollView_allgame.removeAllChildren();
        if(GoldHallModle && GoldHallModle.iconList){
            var roomItemWidth = this.allGameItem.width;
            var roomItemHeight = this.allGameItem.height;
            var tempW = roomItemWidth + 20;
            var tempH = roomItemHeight + 30;    
            var ScrollH = Math.floor(GoldHallModle.iconList.length/2 + 1) * (tempH) + 15; 
            var contentH = Math.max(this.ScrollView_allgame.height,ScrollH);
            this.ScrollView_allgame.setInnerContainerSize(cc.size(this.ScrollView_allgame.width,contentH));
            var startY = contentH - roomItemHeight +50;
            var startX = roomItemWidth/2+10;
            var posIndex = 0;
            for(var i = 0;i < GoldHallModle.iconList.length;++i){
                var newItem = this.allGameItem.clone();
                UITools.addClickEvent(newItem, this, this.onClickAllGameButton);
                newItem.buttonMsg = GoldHallModle.iconList[i].extMsg.split(",");
                newItem.playType = GoldHallModle.iconList[i].playTypes.split(",");
                this.updateItemHallUI(newItem);
                newItem.x = startX + Math.floor(posIndex%2) * tempW;
                newItem.y = startY -  Math.floor(posIndex/2) * tempH;
                this.ScrollView_allgame.addChild(newItem);
                posIndex++;
            }
        }
    },

    updateItemNormalUI:function(item){
        var gameLabel = item.getChildByName("Label_game"); // 玩法图片
        var GameName = ClubRecallDetailModel.getGameStr(item.playType[0]);
        gameLabel.setString(GameName);
   },

    updateItemHallUI:function(item){
        var gameLabel = item.getChildByName("Label_game"); // 玩法图片
        var GameName = ClubRecallDetailModel.getGameStr(item.playType[0]);
        gameLabel.setString(GameName);
        for (var i = 0; i < ChangYongGameModel.wanfaList.length; i++) {
            if(parseInt(item.buttonMsg[0]) == ChangYongGameModel.wanfaList[i]){
                item.setBright(false);
                item.setTouchEnabled(false);
            }
        }
   },

    onClickNormalGameButton:function(item){
        ChangYongGameModel.removeWanfa(item.buttonMsg[0]);
        this.refreshAllGameButton();
        this.refreshNormalButton();
   },
   onClickAllGameButton:function(item){
        if(ChangYongGameModel.wanfaList.length == 6){
            FloatLabelUtil.comText("已达到常用玩法上限");
        }else{
            ChangYongGameModel.addWanfa(item.buttonMsg[0]);
            this.refreshNormalButton();
            this.refreshAllGameButton();
        }
        
   },

    onClose:function(){
        if (this.CloseCallBack)
            this.CloseCallBack();
        var mc = new ChangYongPop();
        PopupManager.addPopup(mc);
        cc.sys.localStorage.setItem("Bjd_always_game",JSON.stringify(ChangYongGameModel.wanfaList));
    },
});