/**
 * Created by cyp on 2019/6/27.
 * 出牌记录显示层
 */
var CDTLJCardRecordLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("SDH_GET_CARDS_RECORD",this,this.onGetCardsRecord);

        this.initLayer();
    },

    onEnter:function(){
        this._super();

        sySocket.sendComReqMsg(3103);
    },

    initLayer:function(){
        var renshu = CDTLJRoomModel.renshu || 4;

        var grayLayer = new cc.LayerColor(cc.color(0,0,0,180));
        this.addChild(grayLayer);

        var bg = new cc.Scale9Sprite("res/res_cdtlj/image_diban.png");
        bg.setContentSize(cc.size(1392,180*renshu + 12));
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        this.layerBg = bg;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                if(!cc.rectContainsPoint(bg.getBoundingBox(),touch.getLocation())){
                    this.touchOutArea = true;
                }
                return true;
            }.bind(this),
            onTouchEnded:function(touch,event){
                if(!cc.rectContainsPoint(bg.getBoundingBox(),touch.getLocation()) && this.touchOutArea){
                    this.removeFromParent(true);
                }
                this.touchOutArea = false;
            }.bind(this),
        }), this);

        var titleImg = new cc.Sprite("res/res_cdtlj/image_biaoti.png");
        titleImg.setPosition(cc.winSize.width/2,bg.y + bg.height/2 + 45);
        this.addChild(titleImg);

        var imgtopbg = new cc.Scale9Sprite("res/res_cdtlj/image_benjiadi.png");
        imgtopbg.setContentSize(1365,180);
        imgtopbg.setAnchorPoint(0.5,1);
        imgtopbg.setPosition(bg.width/2,bg.height - 10);
        bg.addChild(imgtopbg,1);

        var imgleftbg = new cc.Scale9Sprite("res/res_cdtlj/image_zuobiandi.png");
        imgleftbg.setAnchorPoint(0,0.5);
        imgleftbg.setContentSize(110,bg.height - 33);
        imgleftbg.setPosition(15,bg.height/2 + 6);
        bg.addChild(imgleftbg);

        var iconArr = ["tx_benjia.png","tx_xiajia.png","tx_duijia.png","tx_shangjia.png"];
        if(renshu == 3)iconArr.splice(2,1);
        for(var i = 0;i<iconArr.length;++i){
            var spr = new cc.Sprite("res/res_cdtlj/" + iconArr[i]);
            spr.setPosition(70,bg.height/2 + ((renshu - 1)/2 - i)*172 + 6);
            bg.addChild(spr,2);
        }

        this.icon_zhuang = new cc.Sprite("res/res_cdtlj/iamge_zhuang.png");
        this.icon_zhuang.setAnchorPoint(0.5,1);
        this.layerBg.addChild(this.icon_zhuang,3);
        this.icon_zhuang.setVisible(false);
        this.setZhuangState(1);

        this.cardScroll = new ccui.ScrollView();
        this.cardScroll.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.cardScroll.setContentSize(1230,imgleftbg.height);
        this.cardScroll.setPosition(135,23);
        bg.addChild(this.cardScroll,5);

    },

    onGetCardsRecord:function(event){
        var msg = event.getUserData();

        var data = JSON.parse(msg.strParams[0]);

        data.sort(function(a,b){
            var seqa = CDTLJRoomModel.getSeqWithSeat(a.seat);
            var seqb = CDTLJRoomModel.getSeqWithSeat(b.seat);

            return seqa - seqb;
        });

        this.showCard(data);

        this.icon_zhuang.setVisible(false);
        for(var i = 0;i<data.length;++i){
            if(data[i].seat == CDTLJRoomModel.banker){
                this.icon_zhuang.setVisible(true);
                this.setZhuangState(i);
            }
        }

    },

    setZhuangState:function(idx){
        var renshu = CDTLJRoomModel.renshu || 4;
        this.icon_zhuang.setPosition(12,this.layerBg.height/2 + ((renshu - 1)/2 - idx)*180 + 90);
    },

    showCard:function(data){
        this.cardScroll.removeAllChildren();
        var offsetx1 = 80;
        var offsetx2 = 75;

        for(var p = 0;p<data.length;p++){
            var cardNum = 0;
            var cardArr = data[p].cardArr;
            for(var i = 0;i<cardArr.length;++i){
                var cards = cardArr[i].cards;
                for(var j = 0;j<cards.length;++j){
                    var img = "res/pkCommon/smallCard/s_card_" + cards[j] + ".png";
                    var card = new cc.Sprite(img);
                    card.setPosition(offsetx1*(cardNum+0.5) + i*offsetx2,this.cardScroll.height - p*172 - 93);
                    this.cardScroll.addChild(card);
                    cardNum++;

                    if(CDTLJRoomModel.isZhuPai(cards[j])){
                        var icon_zhu = new cc.Sprite("res/res_cdtlj/img_zhu_flag.png");
                        icon_zhu.setAnchorPoint(0,0);
                        icon_zhu.setPosition(0,2);
                        icon_zhu.setScale(0.6);
                        card.addChild(icon_zhu,1);
                    }
                }

                if(cardArr[i].win){
                    var icon_da = new cc.Sprite("res/res_cdtlj/da.png");
                    icon_da.setPosition(card.x + 45,card.y + 45);
                    this.cardScroll.addChild(icon_da,1);
                }
            }
        }
        var contentWidth = offsetx1*cardNum + offsetx2*i;
        this.cardScroll.setInnerContainerSize(cc.size(Math.max(this.cardScroll.width,contentWidth),this.cardScroll.height));
    },
});

var CDTLJCHSLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("SDH_GET_CARDS_RECORD",this,this.onGetCardsRecord);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }.bind(this),
            onTouchEnded:function(touch,event){
                this.removeFromParent(true);
            }.bind(this),
        }), this);

        this.initLayer();
    },

    onEnter:function(){
        this._super();

        sySocket.sendComReqMsg(3103);
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color(0,0,0,180));
        this.addChild(grayLayer);
    },

    onGetCardsRecord:function(event){
        var msg = event.getUserData();

        var data = JSON.parse(msg.strParams[0]);

        var cardsData = {1:[],2:[],3:[],4:[],5:[],6:[]};

        for(var p = 0;p<data.length;p++){
            var cardArr = data[p].cardArr;
            for(var i = 0;i<cardArr.length;++i){
                var cards = cardArr[i].cards;
                for(var j = 0;j<cards.length;++j){
                    var id = cards[j];
                    var temp = CDTLJCardID[id];
                    var key = temp.t;
                    if(CDTLJRoomModel.isZhuPai(id)){
                        key = 5;
                        if(id == 501 || id == 502)key = 6;
                        if(id%100 == 15 || id%100 == 10)key = 6;
                    }
                    cardsData[key].push(id);
                }
            }
        }

        this.showCards(cardsData)
    },

    showCards:function(cardsData){
        var offsetX = 60;
        var offsetY = 150;
        var row = 1;
        for(var i = 6;i>=1;--i){
            var arr = cardsData[i];
            arr.sort(function(a,b){
                return CDTLJRoomModel.getOrderNum(b) - CDTLJRoomModel.getOrderNum(a);
            });
            var posy = cc.winSize.height - 100 - row*offsetY;
            for(var j = 0;j<arr.length;++j){
                var card = new CDTLJCard(arr[j]);
                card.setScale(0.5);
                card.setPosition(cc.winSize.width*0.2 + j*offsetX,posy);
                this.addChild(card);
            }
            if(arr.length > 0)row++;
        }
    },
});