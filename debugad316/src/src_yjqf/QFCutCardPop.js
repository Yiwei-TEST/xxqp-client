/**
 * Created by zhoufan on 2016/11/21.
 */

var CutCardPop = BasePopup.extend({

    cards: [],
    cardNumber: 0,
    cardScale: 0.9,

    ctor: function (isView) {
        this.cards = [];
        this.cardNumber = 0;
        this.isView = isView || false;
        this.isTouchMoved = false;
        this.cutPoint = 27;
        this.jiantouMaxX = 1650
        this._super("res/cutCardPop.json");
    },

    selfRender: function () {
        this.jiantou = this.getWidget("jiantou");
        this.Panel_8 = this.getWidget("Panel_8");
        this.Image_11 = this.getWidget("Image_11");
        this.btnqp = this.getWidget("btnqp");
        this.getWidget("Image_13").visible = false;
        if (this.isView) {
            this.btnqp.visible = false;
            this.Image_11.loadTexture("res/res_yjqf/qfcutcard/img_qiepai_2.png");
            this.jiantou.visible = false;
        } else {
            this.jiantou.addTouchEventListener(this.onJianTouMove, this);
            this.Panel_8.addTouchEventListener(this.onTouchMove, this);
            UITools.addClickEvent(this.btnqp, this, this.onQiePai);
        }
        var max = QFRoomModel.isSave67 == 2 ? 132 : 108;
        var gap = QFRoomModel.isSave67 == 2 ? 11.4 : 14;
        this.jiantou.x = 150 + gap * this.cutPoint;
        for (var i = 0; i < max; i++) {
            var texture = (i < this.cutPoint) ? "res/res_yjqf/qfcutcard/cut_card_4.png" : "res/res_yjqf/qfcutcard/cut_card_3.png";
            var card = new cc.Sprite(texture);
            card.anchorX = card.anchorY = 0;
            card.x = i * gap;
            this.Panel_8.addChild(card);
            this.cards.push(card);
            card.setScale(this.cardScale);
        }
        this.addCustomEvent(SyEvent.PDK_QIE_PAI, this, this.onProg);
        this.calcTime = 5;
        this.isSend = false;
        // this.btnqp.setTitleText("切牌");
        // this.btnqp.visible = false;
        this.root.visible = false;
        //var plist = "res/plist/cutcard_eff.plist";
        //var fileName = "cutcard_eff";
        //var unit = 1 / 9;
        //var cutcardAnimation = new AnimateSprite(plist, fileName, unit);
        //this.addChild(cutcardAnimation, 1);
        //var that = this;
        //cutcardAnimation.x = SyConfig.DESIGN_WIDTH/2;
        //cutcardAnimation.y = SyConfig.DESIGN_HEIGHT/2;
        //cutcardAnimation.stop();
        //cutcardAnimation.setRepeatTimes(1);
        //cutcardAnimation.setCallBack(function () {
        //    that.root.visible = true;
        //    cutcardAnimation.removeFromParent(true);
        //    // that.schedule(that.onSecond, 1);
        //}, this);
        //cutcardAnimation.play();


        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/xipai_puku/xipai_puku.ExportJson");
        var cutcardAnimation = new ccs.Armature("xipai_puku");
        this.addChild(cutcardAnimation, 1);
        cutcardAnimation.x = cc.winSize.width/2;
        cutcardAnimation.y = SyConfig.DESIGN_HEIGHT/2;
        var that = this;
        cutcardAnimation.getAnimation().setMovementEventCallFunc(function (bone, evt) {
            if (evt == 1) {
                that.root.visible = true;
                cutcardAnimation.getAnimation().stop();
                cutcardAnimation.removeFromParent(true);
            }
        });
        cutcardAnimation.getAnimation().play("puke_xp",-1,0);
    },

    onSecond: function () {
        // this.calcTime -= 1;
        // if (this.calcTime >= 0)
        //     this.btnqp.setTitleText("切牌[" + this.calcTime + "]");
        // if (this.calcTime <= 0 && !this.isSend) {
        //     this.onQiePai();
        // }
    },

    onProg: function (event) {
        var data = event.getUserData();
        cc.log("onResave onProg : " + JSON.stringify(data));
        if (data[3] == 0) {
            if (this.isView) {
                var maxX = 0;
                this.cutPoint = data[2];
                for (var i = 0; i < this.cards.length; i++) {
                    var card = this.cards[i];
                    if (i < data[2]) {
                        card.setTexture("res/res_yjqf/qfcutcard/cut_card_4.png");
                        if (card.x > maxX)
                            maxX = card.x;
                    } else {
                        card.setTexture("res/res_yjqf/qfcutcard/cut_card_3.png")
                    }
                }
                var max = 150 + maxX + 20;
                max = max < 160 ? 160 : max;
                max = max > this.jiantouMaxX ? this.jiantouMaxX : max;
                this.jiantou.x = max;
            }
        } else {
            this.onQiePai(data[4]);
        }
    },

    onQiePai: function (cardc) {
        // cc.log(" onQiePai cardc = " + cardc);
        if (this.isSend) {
            return;
        }

        var card = QFAI.getCardDef(cardc);
        if (card)
            QFRoomModel.cutCardid = card.c;
        else if (!this.isView) {
            var id = 0;
            while (true) {
                var rand = Math.floor(Math.random() * QFAI.CARDS.length);
                card = QFAI.CARDS[rand];
                if (QFRoomModel.isSave67 == 2) {
                    if ((card.n >= 1 && card.n <= 2) || (card.n >= 5 && card.n <= 13)) {
                        id = card.c;
                        break;
                    }
                } else {
                    if ((card.n >= 1 && card.n <= 2) || card.n == 5 || (card.n >= 8 && card.n <= 13)) {
                        id = card.c;
                        break;
                    }
                }
            }
            var self = this;
            setTimeout(function () {
                sySocket.sendComReqMsg(121, [self.cardNumber, 1, id]);//发送切牌完毕
            }, 500);
            cc.log("发送切牌完毕 card.id = " + id);

            QFRoomModel.cutCardid = id;
        }

        // sySocket.sendComReqMsg(3);
        this.isSend = true;
        // this.unschedule(this.onSecond);
        QFRoomModel.cutCardSeat = 0;

        if (card && QFRoomModel.nowBurCount == 1) {
            var tmpCard = this.cards[this.cutPoint]||this.cards[this.cards.length-1];
            QFRoomModel.cutPoint = tmpCard.x;
            PopupManager.remove(this);
        } else {
            PopupManager.remove(this);
        }
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/xipai_puku/xipai_puku.ExportJson");
    },

    moveJiantou: function (targetX) {
        targetX = targetX < 160 ? 160 : targetX;
        targetX = targetX > this.jiantouMaxX ? this.jiantouMaxX : targetX;
        this.jiantou.x = targetX;
        this.cardNumber = 0;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if ((card.x + 150) < targetX && targetX != 160) {
                this.cardNumber += 1;
                card.setTexture("res/res_yjqf/qfcutcard/cut_card_4.png")
            } else {
                card.setTexture("res/res_yjqf/qfcutcard/cut_card_3.png")
            }
        }
    },

    onTouchMove: function (obj, type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            var touchPoint = this.Panel_8.getTouchBeganPosition();
            this.TouchBeganX = touchPoint.x;
            // cc.log(" this.TouchBeganX = " + this.TouchBeganX);
            this.moveJiantou(this.TouchBeganX);
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            var touchPoint = this.Panel_8.getTouchMovePosition();
            // cc.log(" touchPoint.x = " + touchPoint.x);
            var detelx = touchPoint.x - this.TouchBeganX;
            var targetX = this.jiantou.x + detelx;
            this.moveJiantou(targetX);
            this.TouchBeganX = touchPoint.x;
            this.isTouchMoved = true;
        } else if (type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED) {
            this.TouchBeganX = null;
            cc.log("send msg/ this.cardNumber = " + this.cardNumber);
            this.cutPoint = this.cardNumber;
            // this.onCD();
            sySocket.sendComReqMsg(121, [this.cardNumber, 0, 0]);
        }
    },

    onJianTouMove: function (obj, type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            this.isTouchMoved = false;
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            var touchPoint = this.jiantou.getTouchMovePosition();
            var targetX = touchPoint.x;
            this.moveJiantou(targetX);
            this.isTouchMoved = true;
        } else if (type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED) {
            if (this.isTouchMoved) {
                this.cutPoint = this.cardNumber;
                // this.onCD();
                sySocket.sendComReqMsg(121, [this.cardNumber, 0, 0]);
                //this.cardNumber = 0;
            }
        }
    },
    onCD: function () { //避免同时发送切牌消息阻塞
        // if (!this.scheduleNode) {
        //     this.scheduleNode = new cc.Node();
        //     this.addChild(this.scheduleNode);
        // }
        // this.scheduleNode.stopAllActions();
        // this.unschedule(this.onSecond);
        // var delay = cc.delayTime(0.5);
        // var that = this;
        // var callfunc = cc.callFunc(function () {
        //     that.schedule(that.onSecond, 1);
        // });
        // this.scheduleNode.runAction(cc.sequence(delay, callfunc));
    }
});
