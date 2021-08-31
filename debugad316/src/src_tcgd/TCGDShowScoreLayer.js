/**
 * Created by cyp on 2019/11/13.
 */
var TCGDShowScoreLayer = cc.Layer.extend({
    ctor:function(layerType){
        this._super();

        SyEventManager.addEventListener("DT_GET_CARDS_RECORD",this,this.onGetCardsRecord);

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

        sySocket.sendComReqMsg(4102,[1]);

    },

    initLayer:function(){
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(180);
        this.addChild(gray);

        this.layerBg = new cc.Scale9Sprite("res/res_tcgd/fenpaiView.png");
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.layerBg);

        var img = "res/res_tcgd/fenpaiTitle.png";
        this.titleSpr = new cc.Sprite(img);
        this.titleSpr.setAnchorPoint(0.5,1);
        this.titleSpr.setPosition(this.layerBg.width/2,this.layerBg.height + 15);
        this.layerBg.addChild(this.titleSpr,1);

        this.btn_close = new ccui.Button("res/ui/bjdmj/popup/close1.png","res/ui/bjdmj/popup/close1.png");
        this.btn_close.setPosition(this.layerBg.width - 23,this.layerBg.height - 23);
        this.layerBg.addChild(this.btn_close,1);

        var txt = UICtor.cLabel("剩余牌分:",40);
        txt.setPosition(this.layerBg.width/2 - 130,this.layerBg.height - 115);
        txt.setColor(cc.color(127,96,50));
        this.layerBg.addChild(txt);

        var scoreBg = new cc.Sprite("res/res_tcgd/FenPaiTxt_di.png");
        scoreBg.setPosition(txt.x + 225,txt.y);
        this.layerBg.addChild(scoreBg);

        this.label_score = UICtor.cLabel("0",40);
        this.label_score.setPosition(scoreBg.width/2,scoreBg.height/2);
        this.label_score.setColor(cc.color(127,96,50));
        scoreBg.addChild(this.label_score);

        this.contentNode = new cc.Node();
        this.layerBg.addChild(this.contentNode);

        this.btn_close.addTouchEventListener(this.onClickBtn,this);

    },

    onGetCardsRecord:function(event) {
        var msg = event.getUserData();
        cc.log("=========onGetCardsRecord=========", msg.strParams[0]);
        var data = JSON.parse(msg.strParams[0]);

        var cfg = {};
        var score = 0;
        for(var i = 0;i<data.length;++i){
            var cards = data[i].cards;
            for(var j = 0;j<cards.length;++j){
                if(!cfg[cards[j]])cfg[cards[j]] = 1;
                else cfg[cards[j]]++;

                if(cards[j] % 100 == 5)score += 5;
                else if(cards[j] % 100 == 10 || cards[j] % 100 == 13)score+= 10;
            }
        }

        this.label_score.setString(String(200 - score));

        this.showCards(cfg);
    },

    showCards:function(cfg){
        this.contentNode.removeAllChildren(true);

        var cards = [
            [405,405,410,410,413,413],
            [305,305,310,310,313,313],
            [205,205,210,210,213,213],
            [105,105,110,110,113,113],
        ];

        for(var i = 0;i<4;++i){
            var startX = 150;
            var startY = 160;
            if(i == 1 || i == 3)startX = 660;
            if(i == 0 || i == 1)startY = 370;
            for (var j = 0; j < cards[i].length; ++j) {
                var id = cards[i][j];
                var card = new TCGDCard(id);
                card.setScale(0.8);
                card.setPosition(startX + j * 60,startY);
                this.contentNode.addChild(card);

                if((cfg[id] == 2) ||(cfg[id] == 1 && j % 2 == 0)){
                    card.setColor(cc.color(120,120,120));
                }
            }
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