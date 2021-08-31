/**
 * Created by zhoufan on 2017/10/27.
 */
var DTZCardNoteCell = cc.Sprite.extend({

    ctor: function(cardVo, number) {
        this._super();
        var width = 42;
        this.setContentSize(width,150);
        var n = cardVo.n;
        switch (n) {
            case 1:
                n = "A";
                break;
            case 11:
                n = "J";
                break;
            case 12:
                n = "Q";
                break;
            case 13:
                n = "K";
                break;
            case 16:
                n = "小";
                break;
            case 17:
                n = "大";
                break;
        }
        var hColor = cardVo.n<16 ? cc.color("#cec0ba") : cc.color("#ffe468");
        var huase = UICtor.cLabel(n+"",30,cc.size(width,34),hColor,1,1);
        huase.x = this.width/2;
        huase.y = 123;
        this.addChild(huase);

        if (cardVo.n < 16) {
            var huaseImg = new cc.Sprite("res/res_dtz/dtzCardNote/type_"+cardVo.t+".png");
            huaseImg.x = width/2;
            huaseImg.y = 75;
            this.addChild(huaseImg);
        } else {
            var huase = UICtor.cLabel("王",30,cc.size(width,34),hColor,1,1);
            huase.x = width/2;
            huase.y = 75;
            this.addChild(huase);
        }

        var numberLabel = UICtor.cLabel(number,30,cc.size(width,34),cc.color("#84ce9a"),1,1);
        numberLabel.x = width/2;
        numberLabel.y = 24;
        this.addChild(numberLabel);
    }
})
var DTZCardNote = BasePopup.extend({

    ctor: function(data) {
        this.data = data;
        this._super("res/dtzCardNote.json");
    },

    removeCardById: function(cardArray, id) {
        for (var i=0;i<cardArray.length;i++) {
            if (cardArray[i].c == id) {
                cardArray.splice(i,1);
                break;
            }
        }
    },

    sortCardlists: function (vo1, vo2) {
        if(vo1 != null && vo2 != null){
            if (vo1.i != vo2.i) {
                return vo2.i - vo1.i;
            } else {
                return vo2.t - vo1.t;
            }
        }
        return false;

    },

    selfRender: function() {
        var Button_7 = this.getWidget("Button_7");
        UITools.addClickEvent(Button_7,this,this.onReturn);
        var sourceCard = ArrayUtil.clone(DTZAI.CARDS);
        var fuNumber = DTZRoomModel.is3FuPai() ? 3 : 4;
        for (var i=1;i<fuNumber;i++) {
            ArrayUtil.merge(DTZAI.CARDS, sourceCard);
        }
        var me = DTZRoomModel.getPlayerVo();
        if (me) {
            var removeWithMe = [];
            for (var seat in this.data) {
                var cardArray = this.data[seat];
                for (var i=0;i<cardArray.length;i++) {
                    var singleArray = cardArray[i];
                    if (seat == me.seat) {
                        ArrayUtil.merge(singleArray, removeWithMe);
                    }
                    for (var j=0;j<singleArray.length;j++) {
                        this.removeCardById(sourceCard, singleArray[j]);
                    }
                }
            }
            var handCardIds = me.handCardIds;
            if (handCardIds.length > 0) {
                for (var i=0;i<handCardIds.length;i++) {
                    var id = handCardIds[i].c;
                    if (ArrayUtil.indexOf(removeWithMe, id) < 0) {
                        this.removeCardById(sourceCard, handCardIds[i].c);
                    }
                }
            }
        }
        sourceCard.sort(this.sortCardlists);
        var finalData = {};
        var finalSortedData = [];
        for (var i=0;i<sourceCard.length;i++) {
            var cardVo = sourceCard[i];
            if (cardVo.n >= 3 && cardVo.n <= 4) {
                continue;
            }
            if (fuNumber == 3 && cardVo.n > 15) {
                continue;
            }
            if (finalData[cardVo.c]) {
                finalData[cardVo.c].number = finalData[cardVo.c].number+1;
            }else {
                finalData[cardVo.c] = {vo:cardVo, number:1};
                finalSortedData.push(finalData[cardVo.c]);
            }
        }
        var cardNoteContainer = this.getWidget("Image_1");
        for (var count in finalSortedData) {
            var cardData = finalSortedData[count];
            var note = new DTZCardNoteCell(cardData.vo, cardData.number);
            //cc.log("count==========",count)
            var gap = 41;
            //if (count > 15) {
            //    gap = 42;
            //}
            note.x = 21+count*gap;
            note.y = 75;
            cardNoteContainer.addChild(note);
        }
        var dataIndex = 0;
        var maxX = 1650;
        for (var seat in this.data) {
            var container = this.getWidget("cardContainer"+seat);
            var cardArray = this.data[seat];
            var totalCount = 0;
            var cardIndex = 0;
            var isNewline = false;
            for (var i=0;i<cardArray.length;i++) {
                var singleArray = cardArray[i];
                //还未换行的情况下，计算换行
                if (!isNewline) {
                    var calcCount = totalCount;
                    for (var j=0;j<singleArray.length;j++) {
                        var cardMsg = DTZAI.getCardDef(singleArray[j]);
                        if (cardMsg != null) {
                            calcCount++;
                        }
                    }
                    var rightmostX = 60+calcCount*24+cardIndex*52;
                    isNewline = (rightmostX >= maxX);
                    if (isNewline) {
                        totalCount = 0;
                        cardIndex = 0;
                    }
                }
                for (var j=0;j<singleArray.length;j++) {
                    var cardMsg = DTZAI.getCardDef(singleArray[j]);
                    if (cardMsg != null) {
                        var cardItem = new DTZBigCard(cardMsg);
                        cardItem.anchorX = 0.5;
                        cardItem.anchorY = 0;
                        cardItem.scale = 0.48;
                        cardItem.x = 60+totalCount*24+cardIndex*52;
                        cardItem.y = isNewline ? 6 : 40;
                        container.addChild(cardItem);
                        totalCount++;
                    }
                }
                if (singleArray[0] > 0) {
                    cardIndex++;
                }
            }
            var user = this.getWidget("user"+seat);
            var name = ccui.helper.seekWidgetByName(user,"name");
            var seatVo = DTZRoomModel.getPlayerVoBySeat(seat);
            if (seatVo == null) {
                continue;
            }
            name.setString(seatVo.name);
            this.showIcon(seatVo.icon,seat, seatVo.sex);
            dataIndex++;
        }
        for (;dataIndex<4;dataIndex++) {
            var user = this.getWidget("user"+(dataIndex+1));
            this.getWidget("cardContainer"+(dataIndex+1)).visible = false;
            var name = ccui.helper.seekWidgetByName(user,"name");
            name.visible = false;
        }
    },

    showIcon:function(iconUrl , index ,sex){
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = iconUrl;
        var itemNode = this.getWidget("user" + index);
        var defaultimg = (sex == 1) ? "res/res_dtz/images/default_m.png" : "res/res_dtz/images/default_w.png";
        if(!url){
            url = defaultimg;
        }

        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.7;
        if(iconUrl){
            sprite.x = sprite.y = 0;
            try{
                var sten = new cc.Sprite("res/res_dtz/images/img_14_c.png");
                sten.setScale(0.75);
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 52, y: 52, alphaThreshold: 0.8});
                clipnode.addChild(sprite);
                itemNode.addChild(clipnode,5,345);
                cc.loader.loadImg(url, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        sprite.setTexture(img);
                        sprite.x = 0;
                        sprite.y = 0;
                    }
                });
            }catch(e){}
        }else{
            sprite.x = sprite.y = 52;
            itemNode.addChild(sprite , 5 , 345);
        }
    },

    onReturn: function() {
        PopupManager.remove(this);
    }
})
