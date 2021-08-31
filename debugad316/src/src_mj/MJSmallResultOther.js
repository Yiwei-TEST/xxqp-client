/**
 * Created by Administrator on 2019/11/23.1
 */

var MJSmallResultOtherPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/gdcsmjDipai.json");
    },

    selfRender: function () {
        var Image_title = this.getWidget("Image_title");
        Image_title.loadTexture("res/res_mj/mjSmallResult/title_syp.png");

        var Panel_dipai = this.getWidget("Panel_dipai");
        var num = 17;//21
        for(var i = 0;i < this.data.leftCards.length;++i){
            var vo = MJAI.getMJDef(this.data.leftCards[i]);
            var scale = 0.9;//0.75;
            var card = new Mahjong(MJAI.getDisplayVo(1,3),vo);
            var width = 75;
            var height = 80;
            card.x = 26 + width * (i % num)*scale;
            card.y = 440 - height * Math.floor(i / num)*scale;
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

