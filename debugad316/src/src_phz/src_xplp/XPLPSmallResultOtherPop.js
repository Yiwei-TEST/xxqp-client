/**
 * Created by Administrator on 2020/6/19.
 */
var XPLPCountCardPop = BasePopup.extend({

    ctor: function (leftCards,isReplay) {
        this.leftCards = leftCards || [];
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/gdcsmjDipai.json");
    },

    selfRender: function () {
        var Image_title = this.getWidget("Image_title");
        Image_title.loadTexture("res/res_mj/mjSmallResult/title_syp.png");

        var Panel_dipai = this.getWidget("Panel_dipai");
        var num = 15;//21
        var width = 103 + 16;
        var height = 333 + 100;
        var localList = [
            1,2,3,4,5,6,7,8,9,201,
            10,11,12,13,14,15,16,17,18,205,
            19,20,21,22,23,24,25,26,27,209
        ];
        for(var i = 0;i < localList.length;++i){
            var vo = XPLPAI.getMJDef(localList[i]);
            var scale = 0.65;
            var card = new XPLPCard(XPLPAI.getDisplayVo(1,2),vo);
            card.x = 26 + width * (i % num)*scale;
            card.y = 320 - height * Math.floor(i / num)*scale;
            card.scale = scale;
            var localNum = this.getMahjongNumById(vo);
            var paiNumLabel = new cc.LabelTTF("", "Arial", 50);
            paiNumLabel.setString(localNum);
            paiNumLabel.y = -40;
            paiNumLabel.x = width*0.5 - 10;
            paiNumLabel.setColor(cc.color(255,255,255));
            card.addChild(paiNumLabel);
            Panel_dipai.addChild(card);
        }
        var btnClose = this.getWidget("btn_close");
        UITools.addClickEvent(btnClose,this,this.onCloseClick);
    },

    getMahjongNumById:function(vo){
        var countNum = 0;
        for(var i = 0;i < this.leftCards.length;++i){
            var tempVo = XPLPAI.getMJDef(this.leftCards[i]);
            if(tempVo.n == vo.n && tempVo.t == vo.t){
                ++countNum;
            }
        }
        return countNum;
    },

    onCloseClick:function(){
        PopupManager.remove(this);
    }
});

var XPLPSmallResultOtherPop = BasePopup.extend({

    ctor: function (leftCards) {
        this.leftCards = leftCards || [];
        this.isHu = false;
        this.huSeat = 0;
        this._super("res/gdcsmjDipai.json");
    },

    selfRender: function () {
        var Image_title = this.getWidget("Image_title");
        Image_title.loadTexture("res/res_mj/mjSmallResult/title_syp.png");

        var Panel_dipai = this.getWidget("Panel_dipai");
        var num = 16;
        var width = 103 + 16;
        var height = 333 + 20;
        var localList = this.leftCards;
        for(var i = 0;i < localList.length;++i){
            var vo = XPLPAI.getMJDef(localList[i]);
            var scale = 0.6;
            var card = new XPLPCard(XPLPAI.getDisplayVo(1,2),vo);
            card.x = 35 + width * (i % num)*scale;
            card.y = 360 - height * Math.floor(i / num)*scale;
            card.scale = scale;
            Panel_dipai.addChild(card);
        }
        var btnClose = this.getWidget("btn_close");
        UITools.addClickEvent(btnClose,this,this.onCloseClick);
    },

    onCloseClick:function(){
        PopupManager.remove(this);
    }
});

