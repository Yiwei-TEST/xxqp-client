var HBGZPSmallResultCell = ccui.Widget.extend({
    ctor:function(data,isShow,isNoChange){//isNoChange 表示cards数组中的值是否已经getPHZDef转化，默认未转化
        this._super();
        var action = data.action;
        var cards = data.cards;
        this.anchorX=0;
        this.anchorY=0;
        this.setContentSize(34*1.5,200*1.5);
        if(isShow){
            var resStr = null;
            if(action == 2){
                resStr = "res/res_phz/res_hbgzp/smallResult/dui.png";
            }else if(action == 3){
                resStr = "res/res_phz/res_hbgzp/smallResult/zhao.png";
            }else if(action == 4){
                resStr = "res/res_phz/res_hbgzp/smallResult/guan.png";
            }else if(action == 7){
                resStr = "res/res_phz/res_hbgzp/smallResult/hua.png";
            }else if(action == 8){
                resStr = "res/res_phz/res_hbgzp/smallResult/kan.png";
            }else if(action == 0){
                if(cards.length === 3){
                    resStr = "res/res_phz/res_hbgzp/smallResult/ju.png";
                }else if(cards.length === 2){
                    resStr = "res/res_phz/res_hbgzp/smallResult/kou.png";
                }
            }

            if(resStr){
                var header = new cc.Sprite(resStr);
                header.x = 26 * 1.5;
                header.y = 185 * 1.5;
                this.addChild(header);
            }
        }
        var scale = 0.35;
        for(var i=0;i<cards.length;i++){
            var vo = !!isNoChange ? cards[i] : HBGZPAI.getPHZDef(cards[i]);
            var card = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,3),vo);
            card.scale = scale;
            card.x = 15;
            card.y = 125 *1.5 - i * 45;
            this.addChild(card);
        }
    }
});

var HBGZPSmallResultPop=BasePopup.extend({
    pointInfo:null,
    isRePlay:null,
    ctor: function (data,isRePlay) {
        this.data = data;
        this.isRePlay = isRePlay;
        var path = "res/hbgzpSmallResult.json";
        this._super(path);
    },

    selfRender: function () {
        var isHuang = false;
        this.winUserId = 0;
        this.data.sort(function (user1 , user2){
            var point1 = parseInt(user1.point);
            var point2 = parseInt(user2.point);
            return  point1 < point2;
        });
        var myPoint = 0;
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].seat == HBGZPRoomModel.mySeat){
                myPoint = this.data[i].point;
            }
        }

        for(var i=0;i<this.data.length;i++){
            if(this.data[i].point>0){
                break;
            }else if(this.data[i].point==0){
                isHuang = true;
                break;
            }
        }

        var startX = 960 - this.getWidget("user1").width/2;
        if(this.data.length==3){
            this.getWidget("user4").visible = false;
            this.getWidget("user2").x = startX - 550;
            this.getWidget("user3").x = startX;
            this.getWidget("user1").x = startX + 550;
        }else if(this.data.length==2){
            this.getWidget("user4").visible = false;
            this.getWidget("user3").visible = false;
            this.getWidget("user1").x = startX - 300;
            this.getWidget("user2").x = startX + 300;
        }

        var huSeat = -1;
        for(var i=0;i<this.data.length;i++){
            this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
            if(ClosingInfoModel.huSeat == this.data[i].seat){
                huSeat = i;
            }
        }

        var leftCards = ClosingInfoModel.leftCards;

        var dipaiPanel = this.getWidget("Panel_shengyu");

        var numCount = 41;
        var scaleNum = 0.35;

        for(var i=0;i<leftCards.length;i++){
            var vo = HBGZPAI.getPHZDef(leftCards[i]);
            if (i == 0){
                vo.ishu = true;
            }
            var card = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,3),vo);
            card.scale = scaleNum;
            card.setAnchorPoint(0,1);
            var offX = 82 * 1.5;
            var offY = card.getContentSize().height * scaleNum + 4;
            var numY = Math.floor(i/numCount);
            var numX = i%numCount;
            card.x = 6 + numX * offX * scaleNum + 9;
            card.y = 76 * 1.5 - offY * numY - 11;
            dipaiPanel.addChild(card);
        }

        var btn_jixu = this.getWidget("btn_jixu");
        var btn_share = this.getWidget("btn_share");
        UITools.addClickEvent(btn_share,this,this.onShare);
        UITools.addClickEvent(btn_jixu,this,this.onOk);

        //版本号  SyVersion.v

        if(this.getWidget("Label_time")){
            this.getWidget("Label_time").setString(ClosingInfoModel.ext[2]);//(hours+":"+minutes);
        }

        this.getWidget("Label_roomid").setString("房间号:"+HBGZPRoomModel.tableId);

        this.getWidget("Label_jushu").setString(HBGZPRoomModel.totalBurCount - HBGZPRoomModel.nowBurCount);
    },

    refreshSingle:function(widget,user){
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget, "id").setString("UID:" + user.userId);
        var defaultimg = "res/res_phz/res_hbgzp/smallResult/default_m.png";
        var icon = ccui.helper.seekWidgetByName(widget, "icon");
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale=0.95;
        sprite.x = icon.x;
        sprite.y = icon.y;
        widget.addChild(sprite,5,345);

        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 120, height: 120}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

        var point = ccui.helper.seekWidgetByName(widget,"localPoint");//当前分数

        var zongjiTip = ccui.helper.seekWidgetByName(widget,"zongjiTip");//总计
        var huTip = ccui.helper.seekWidgetByName(widget,"huTip");//胡牌
        var paoTip = ccui.helper.seekWidgetByName(widget,"paoTip");//跑分
        var hushuTip = ccui.helper.seekWidgetByName(widget,"hushu");//胡数
        var paopaiTip = ccui.helper.seekWidgetByName(widget,"paopaiTip");//跑牌

        var huPng = ccui.helper.seekWidgetByName(widget,"Image_hu");//胡牌PNG
        var paoPng = ccui.helper.seekWidgetByName(widget,"Image_pao");//放炮PNG

        var paofen = ccui.helper.seekWidgetByName(widget,"paofen");//跑几分tag
        var tagIndex = parseInt(user.strExt[10]||"0");
        if(tagIndex > 0){
            paofen.loadTexture("res/res_phz/res_hbgzp/tag"+tagIndex+".png");
            paofen.visible = true;
        }

        if(user.strExt[7] == 2 || user.strExt[7] == 3){
            huPng.visible = true;
            if(user.strExt[7] == 3){
                huPng.loadTexture("res/res_phz/res_hbgzp/smallResult/zimo.png");
            }
        }else if(user.strExt[7] == 1){
            paoPng.visible = true;
        }

        this.showHandCard(ccui.helper.seekWidgetByName(widget,"Panel_card"),user);//显示手牌

        zongjiTip.visible = false;
        huTip.visible = false;
        paoTip.visible = false;
        hushuTip.visible = false;
        paopaiTip.visible = false;

        if (parseInt(user.point) > 0){
            point.setString(""+user.point);
            point.setColor(cc.color(12,240,36));
            var zongjiLabel = ccui.helper.seekWidgetByName(widget,"zongjiLabel");
            var paopaiLabel = ccui.helper.seekWidgetByName(widget,"paopaiLabel");
            var hushuLabel= ccui.helper.seekWidgetByName(widget,"hushuLabel");
            zongjiLabel.setString(""+user.point);
            hushuLabel.setString(""+ClosingInfoModel.huxi);
            if(ClosingInfoModel.intParams[23] === 2){
                hushuTip.y = 50 * 1.5;
                zongjiTip.y = 50 * 1.5;
            }else{
                paopaiTip.visible = true;
            }
            this.addPaopai(huTip,paopaiLabel);
            zongjiTip.visible = true;
            huTip.visible = true;
            paoTip.visible = true;
            hushuTip.visible = true;
            if(ClosingInfoModel.huCard){//有胡的牌
                var vo = HBGZPAI.getPHZDef(ClosingInfoModel.huCard);
                var huCard = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,3),vo);
                huCard.setAnchorPoint(0,0);
                huCard.x = 55 * 1.5;
                huCard.y = -3;
                huCard.scale = 0.35;
                huTip.addChild(huCard);
            }
        }else{
            point.setString(""+user.point);
            point.setColor(cc.color(217,25,28));
        }
    },

    addPaopai:function(widget,paopaiLabel){
        var nArr = [1,3,5,7,9];
        var count = 0;
        var dianshu = 0;
        this.paoCards = this.paoCards || [];
        for(var i = 0;i < this.paoCards.length;++i){
            if(this.paoCards[i] > 0){
                var vo = HBGZPAI.getPHZDef(nArr[i]);
                var paoCard = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,3),vo);
                paoCard.setAnchorPoint(0,0);
                paoCard.x = 145 * 1.5 + count * 25 * 1.5;
                paoCard.y = 0;
                paoCard.scale = 0.35;
                if(this.paoCards[i] == 2){//添加个数显示
                    var geshu = new cc.Sprite("res/res_phz/res_hbgzp/smallResult/er.png");
                    geshu.setAnchorPoint(0.5,1);
                    geshu.y = 12 * 1.5;
                    geshu.x = 30 * 1.5;
                    geshu.scale = 2.8;
                    paoCard.addChild(geshu);
                }
                widget.addChild(paoCard);
                ++count;
                dianshu += this.paoCards[i];
            }
        }
        paopaiLabel.setString(""+dianshu);
    },

    showHandCard:function(widget,user){
        var data = [];
        for(var i=0;i<ClosingInfoModel.allCardsCombo.length;i++){
            if(ClosingInfoModel.allCardsCombo[i].seat == user.seat){
                data = ClosingInfoModel.allCardsCombo[i].phzCard.slice(0);
               break;
            }
        }
        if(user.strExt[7] == 2 || user.strExt[7] == 3){
            this.paoCards = [0,0,0,0,0];//1,3,5,7,9
        }
        var huaArr = [1,11,3,13,5,15,7,17,9,19];
        for(var i=0;i<data.length;i++){
            if(data[i].cards.length > 5){
                var tempArray = HBGZPAI.sortHandsByHxVo(HBGZPAI.getVoArray(data[i].cards));
                var localLen = data.length - 1 + tempArray.length;
                while(localLen > 8){
                    var resultLen = tempArray.length - 1;
                    var len = resultLen - 1;
                    ArrayUtil.merge(tempArray[resultLen],tempArray[len]);
                    tempArray.splice(resultLen,1);
                    --localLen;
                }
                for(var t = 0;t<tempArray.length;++t){
                    var cell = new HBGZPSmallResultCell({action:0,cards:tempArray[t]},ClosingInfoModel.huSeat == user.seat,true);
                    widget.pushBackCustomItem(cell);
                }
            }else{
                var cell = new HBGZPSmallResultCell(data[i],ClosingInfoModel.huSeat == user.seat);
                widget.pushBackCustomItem(cell);
            }
            if(user.strExt[7] == 2 || user.strExt[7] == 3){//是胡牌的人
                for(var j = 0;j < data[i].cards.length;++j){
                    if(huaArr.indexOf(data[i].cards[j]) !== -1){//有花牌
                        switch(data[i].cards[j]%10){
                            case 1:
                                ++this.paoCards[0];
                                break;
                            case 3:
                                ++this.paoCards[1];
                                break;
                            case 5:
                                ++this.paoCards[2];
                                break;
                            case 7:
                                ++this.paoCards[3];
                                break;
                            case 9:
                                ++this.paoCards[4];
                                break;
                        }
                    }
                }
            }
        }
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
            if(PopupManager.getClassByPopup(HBGZPReplay)){
                PopupManager.removeClassByPopup(HBGZPReplay);
            }
            PopupManager.remove(this);
            return;
        }
        if(HBGZPRoomModel.nowBurCount == HBGZPRoomModel.totalBurCount){//最后的结算
            PopupManager.remove(this);
            var mc = new HBGZPBigResultPop(this.data);
            PopupManager.addPopup(mc);
        }else{
            if (HBGZPRoomModel.isStart){
                PopupManager.remove(this);
                sySocket.sendComReqMsg(3);
            }else{
                sySocket.sendComReqMsg(3);
            }
        }
    },

    onShare:function(){
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height);
        if (!texture)
            return;
        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
        var renshu = HBGZPRoomModel.renshu;
        var str = renshu + "人房";
        var obj={};
        var tableId = HBGZPRoomModel.tableId;
        obj.tableId=tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title='湖北个子牌   '+str+' 房号:'+tableId;
        obj.description="我已开好房间，【湖北个子牌】二缺一，就等你了！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    }
});

