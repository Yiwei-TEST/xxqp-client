/**
 * Created by cyp on 2019/10/22.
 */
var DTShowScoreLayer = cc.Layer.extend({
    layerType:1,//1是显示已得分牌，2是显示玩家报分牌
    ctor:function(layerType){
        this._super();

        SyEventManager.addEventListener("DT_GET_CARDS_RECORD",this,this.onGetCardsRecord);

        this.layerType = layerType || 1;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
    },

    onEnter:function(){
        this._super();

        if(this.layerType == 1){
            sySocket.sendComReqMsg(4102,[1]);
        }else if(this.layerType == 2){
            sySocket.sendComReqMsg(4102,[2]);
        }
    },

    initLayer:function(){
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(180);
        this.addChild(gray);

        this.layerBg = new cc.Scale9Sprite("res/res_diantuo/score_bg.png");
        this.layerBg.setContentSize(1350,800);
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.layerBg);

        var img = "res/res_diantuo/score_title_2.png";
        if(this.layerType == 2){
            img = "res/res_diantuo/score_title_1.png";
        }
        this.titleSpr = new cc.Sprite(img);
        this.titleSpr.setAnchorPoint(0.5,1);
        this.titleSpr.setPosition(this.layerBg.width/2,this.layerBg.height + 15);
        this.layerBg.addChild(this.titleSpr,1);

        this.btn_close = new ccui.Button("res/ui/bjdmj/popup/close1.png","res/ui/bjdmj/popup/close1.png");
        this.btn_close.setPosition(this.layerBg.width - 23,this.layerBg.height - 23);
        this.layerBg.addChild(this.btn_close,1);

        this.contentNode = new cc.Node();
        this.layerBg.addChild(this.contentNode);

        this.btn_close.addTouchEventListener(this.onClickBtn,this);
    },

    onGetCardsRecord:function(event) {
        var msg = event.getUserData();
        cc.log("=========onGetCardsRecord=========", msg.strParams[0]);
        var data = JSON.parse(msg.strParams[0]);

        var cfg = [];
        for(var i = 0;i<data.length;++i){
            var seat = data[i].seat;
            var p = DTRoomModel.getPlayerDataByItem("seat",seat);
            if(p){
                var item = {};
                item.name = p.name;
                item.icon = p.icon;
                item.cards = data[i].cards;
                cfg.push(item);
            }
        }
        this.showCards(cfg);
    },

    showCards:function(data){
        this.contentNode.removeAllChildren(true);

        var offsetY = 180;
        var startY = this.layerBg.height/2 + 1.5*offsetY - 15;
        for(var i = 0;i<data.length;++i){
            var itemBg = new cc.Scale9Sprite("res/res_diantuo/score_di.png");
            itemBg.setContentSize(1275,170);
            itemBg.setPosition(this.layerBg.width/2,startY - offsetY*i);
            this.contentNode.addChild(itemBg);

            var headKuang = new cc.Sprite("res/res_diantuo/touxiangkuang.png");
            headKuang.setPosition(90,itemBg.height/2 + 15);
            itemBg.addChild(headKuang);

            var sten=new cc.Sprite("res/res_diantuo/touxiangkuang.png");
            var clipnode = new cc.ClippingNode();
            clipnode.setStencil(sten);
            clipnode.setAlphaThreshold(0.8);
            var iconSpr = new cc.Sprite("res/ui/common/default_m.png");
            iconSpr.setScale(120/iconSpr.width);
            clipnode.addChild(iconSpr);
            clipnode.setPosition(headKuang.getPosition());
            itemBg.addChild(clipnode);

            this.showIcon(iconSpr,data[i].icon);

            var label_name = UICtor.cLabel(data[i].name,33);
            label_name.setColor(cc.color(150,30,10));
            label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            label_name.setPosition(headKuang.x,20);
            label_name.setTextAreaSize(cc.size(180,36));
            itemBg.addChild(label_name);

            for(var j = 0;j<data[i].cards.length;++j){
                var card = new DTCard(data[i].cards[j]);
                card.setScale(0.6);
                card.setPosition(240 + j*41,itemBg.height/2);
                itemBg.addChild(card);
            }
        }
    },

    showIcon: function (iconSpr,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        if (iconUrl) {
            var self = this;
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    iconSpr.setTexture(img);
                    iconSpr.setScale(120/iconSpr.width);
                }
            });
        }else{
            iconSpr.initWithFile(defaultimg);
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                this.removeFromParent(true);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },
});