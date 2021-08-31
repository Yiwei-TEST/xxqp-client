/**
 * Created by zhoufan on 2017/10/27.
 */
var QFCardNoteCell = cc.Sprite.extend({

    ctor: function(cardVo, number) {
        this._super();
        var width = 27.5;
        this.setContentSize(width,100);
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
        var huase = UICtor.cLabel(n+"",20,cc.size(width,23),hColor,1,1);
        huase.x = this.width/2;
        huase.y = 82;
        this.addChild(huase);

        var numberLabel = UICtor.cLabel(number,20,cc.size(width,23),cc.color("#84ce9a"),1,1);
        numberLabel.x = width/2;
        numberLabel.y = 16;
        this.addChild(numberLabel);
    }
})
var QFCardNote = BasePopup.extend({

    ctor: function(data) {
        this.data = data;
        this._super("res/qfCardNote.json");
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
        var sourceCard = ArrayUtil.clone(QFAI.CARDS);
        var fuNumber = 3;
        for (var i=1;i<fuNumber;i++) {
            ArrayUtil.merge(QFAI.CARDS, sourceCard);
        }
        var me = QFRoomModel.getPlayerVo();
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
            if (cardVo.n > 15) {
                continue;
            }
            if (QFRoomModel.isSave67 != 1 &&(cardVo.n >= 6 && cardVo.n <= 7)) {
                continue;
            }
            if (finalData[cardVo.i]) {
                finalData[cardVo.i].number = finalData[cardVo.i].number+1;
            }else {
                finalData[cardVo.i] = {vo:cardVo, number:1};
                finalSortedData.push(finalData[cardVo.i]);
            }
        }
        var cardNoteContainer = this.getWidget("Image_1");
        for (var count in finalSortedData) {
            var cardData = finalSortedData[count];
            var note = new QFCardNoteCell(cardData.vo, cardData.number);
            var gap = count<=1 ? 26 : 27.15;
            if (count > 15) {
                gap = 27.2;
            }
            note.x = 14+count*gap;
            note.y = 50;
            cardNoteContainer.addChild(note);
        }
        var maxX = 1100;
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
                        var cardMsg = QFAI.getCardDef(singleArray[j]);
                        if (cardMsg != null) {
                            calcCount++;
                        }
                    }
                    var rightmostX = 40+calcCount*18+cardIndex*35;
                    isNewline = (rightmostX >= maxX);
                    if (isNewline) {
                        totalCount = 0;
                        cardIndex = 0;
                    }
                }
                for (var j=0;j<singleArray.length;j++) {
                    var cardMsg = QFAI.getCardDef(singleArray[j]);
                    if (cardMsg != null) {
                        var cardItem = new QFBigCard(cardMsg);
                        cardItem.anchorX = 0.5;
                        cardItem.anchorY = 0;
                        cardItem.scale = 0.48;
                        cardItem.x = 40+totalCount*18+cardIndex*35;
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
            var seatVo = QFRoomModel.getPlayerVoBySeat(seat);
            if (seatVo == null) {
                name.visible = false;
                //container.visible = false;
                continue;
            }
            name.setString(seatVo.name);
            this.showIcon(seatVo.icon,seat, seatVo.sex);
        }
        for (var dataIndex = 3;dataIndex<4;dataIndex++) {
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
        var defaultimg = (sex == 1) ? "res/res_yjqf/images/default_m.png" : "res/res_yjqf/images/default_w.png";
        if(!url){
            url = defaultimg;
        }

        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.7;
        if(iconUrl){
            sprite.x = sprite.y = 0;
            try{
                var sten = new cc.Sprite("res/res_yjqf/images/img_14_c.png");
                sten.setScale(0.75);
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 35, y: 35, alphaThreshold: 0.8});
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
            sprite.x = sprite.y = 35;
            itemNode.addChild(sprite , 5 , 345);
        }
    },

    onReturn: function() {
        PopupManager.remove(this);
    }
})
