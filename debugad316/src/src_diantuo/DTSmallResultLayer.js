/**
 * Created by cyp on 2019/10/21.
 */
var DTSmallResultLayer = cc.Layer.extend({
    ctor:function(msgData){
        this._super();

        this.msgData = msgData;

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

        //按分组排下序
        players.sort(function(a,b){
            return a.ext[4] - b.ext[4];
        });

        this.showPlayerItem(players);

        var titleType = 1;
        for(var i = 0;i<players.length;++i){
            if(players[i].seat == DTRoomModel.mySeat){
                titleType = players[i].isHu?1:-1;
            }
        }
        this.addTitleImg(titleType);
    },

    showRuleInfo:function(){
        var str = ClubRecallDetailModel.getDTWanfa(DTRoomModel.intParams,true);

        var label = UICtor.cLabel(str,33);
        label.setAnchorPoint(0,0);
        label.setTextAreaSize(cc.size(750,150));
        label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color(239,145,87));
        label.setPosition(20,5);
        this.addChild(label,1);
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(210);
        this.addChild(grayLayer);

        this.label_info = UICtor.cLabel("2019-9-10 10:35  牌桌号:123456  第1局",33);
        this.label_info.setColor(cc.color(254,233,95));
        this.label_info.setPosition(cc.winSize.width/2 + 550,75);
        this.addChild(this.label_info);

        this.btn_jxyx = new ccui.Button("res/res_diantuo/btn_jixu.png","res/res_diantuo/btn_jixu.png");
        this.btn_jxyx.setPosition(cc.winSize.width/2,75);
        this.addChild(this.btn_jxyx,2);

        this.btn_jxyx.addTouchEventListener(this.onClickBtn,this);

    },

    showPlayerItem:function(players){
        for(var i = 0;i<players.length;++i){
            var item = new DTSmallResultItem();
            item.setPosition(cc.winSize.width/2,cc.winSize.height - 255 - i*192);
            item.setItemData(players[i]);
            this.addChild(item);
        }
    },

    addTitleImg:function(type){
        var img = "res/res_diantuo/biaoti.png";
        if(type < 0){
            img = "res/res_diantuo/biaoti1.png";
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
        var table = "牌桌号:" + DTRoomModel.tableId;
        var jushu = "第" + DTRoomModel.nowBurCount + "局";

        this.label_info.setString(time + "  " + table + "  " + jushu);

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_jxyx){
                PopupManager.remove(this);

                if(DTRoomModel.replay){
                    return;
                }

                if((DTRoomModel.nowBurCount == DTRoomModel.totalBurCount)
                    || (this.msgData.ext[21] == 1) || this.msgData.isBreak){
                    var BigResultLayer = DTRoomModel.getBigResultLayer();
                    var layer = new BigResultLayer(this.msgData);
                    PopupManager.addPopup(layer,1);

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
});

var DTSmallResultItem = cc.Node.extend({
    ctor:function(){
        this._super();

        this.initNode();
    },

    initNode:function(){
        this.itemBg = new cc.Sprite("res/res_diantuo/lan_di.png");
        this.addChild(this.itemBg);

        var headKuang = new cc.Sprite("res/res_diantuo/touxiangkuang.png");
        headKuang.setPosition(120,this.itemBg.height/2 + 15);
        this.itemBg.addChild(headKuang);

        var sten=new cc.Sprite("res/res_diantuo/touxiangkuang.png");
        var clipnode = new cc.ClippingNode();
        clipnode.setStencil(sten);
        clipnode.setAlphaThreshold(0.8);
        this.iconSpr = new cc.Sprite("res/ui/common/default_m.png");
        this.iconSpr.setScale(120/this.iconSpr.width);
        clipnode.addChild(this.iconSpr);
        clipnode.setPosition(headKuang.getPosition());
        this.itemBg.addChild(clipnode);

        this.label_name = UICtor.cLabel("玩家的名字",33);
        this.label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_name.setPosition(headKuang.x,30);
        this.label_name.setTextAreaSize(cc.size(180,36));
        this.itemBg.addChild(this.label_name);

        this.youSpr = new cc.Sprite("res/res_diantuo/you_1_icon.png");
        this.youSpr.setPosition(headKuang.x + 135,this.itemBg.height/2);
        this.itemBg.addChild(this.youSpr);

        var config = ["喜分","罚分","游戏得分","本局得分"];
        this.labelArr = [];
        for(var i = 0;i<config.length;++i){
            var txt = UICtor.cLabel(config[i],42);
            txt.setColor(cc.color(250,242,102));
            txt.setPosition(this.itemBg.width/2 + 240 + i*200,this.itemBg.height/2 + 38);
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

        var bgImg = "res/res_diantuo/lan_di.png";
        if(data.ext[4] == 2){
            bgImg = "res/res_diantuo/hong_di.png";
        }
        this.itemBg.initWithFile(bgImg);

        if(data.ext[3] > 0){
            var youImg = "res/res_diantuo/you_" + data.ext[3] + "_icon.png";
            this.youSpr.initWithFile(youImg);
        }else{
            this.youSpr.setVisible(false);
        }

        var numArr = [0,0,0,0];
        numArr[0] = Number(data.ext[0]) || 0;//喜分
        numArr[1] = Number(data.ext[1]) || 0;//罚分
        numArr[2] = Number(data.ext[2]) || 0;//游戏得分
        numArr[3] = data.point || 0;//本局得分

        for(var i = 0;i<this.labelArr.length;++i){
            this.setNumLabel(this.labelArr[i],numArr[i]);
        }

        this.showLeftCards(data.cards || []);
    },

    showLeftCards:function(ids){
        DTRoomModel.sortIdByValue(ids);
        for(var i = 0;i<ids.length;++i){
            var card = new DTCard(ids[i]);
            card.setScale(0.5);
            card.setPosition(380 + i*27,this.itemBg.height/2);
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
