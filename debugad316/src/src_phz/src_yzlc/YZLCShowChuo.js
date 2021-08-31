/**
 * Created by Administrator on 2020/3/18.
 */
var YZLCSmallResultCell = ccui.Widget.extend({
    ctor:function(data){
        this._super();
        var cards = data.cards;
        this.anchorX=0;
        this.anchorY=0;
        var width = 80;
        var zorder = cards.length;
        if(zorder > 4){
            width = 140;
        }
        this.setContentSize(width,320);
        for(var i=0;i<cards.length;i++){
            zorder--;
            var vo = cards[i];
            var card = new YZLCCard(PHZAI.getDisplayVo(this.direct,3),vo);
            if(i < 4){
                card.x = 6;
                card.y = 40 + i * 39;
            }else{
                card.x = 45;
                card.y = 40 + (i%4) * 39;
            }
            card.scale = 1.6;
            this.addChild(card,zorder);
        }
    }
});
var YZLCShowChuoPop=BasePopup.extend({
    ctor: function (userInfo,cards) {
        var path = "res/yzlcShowChuo.json";
        this.userData = userInfo;
        this.cards = cards;
        this._super(path);
    },

    selfRender: function () {
        this.closeBtn = this.getWidget("Button_close");
        UITools.addClickEvent(this.closeBtn,this,this.onCloseFace);

        for(var i = 0;i < 4;++i){
            var parent = this.getWidget("ListView_"+(i + 1));
            var list = new ccui.ListView();
            //list.setContentSize(800,800);
            list.setTouchEnabled(true);
            list.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
            list.width = 1200;
            list.height = parent.height;
            list.x = parent.x;
            list.y = parent.y;
            //list.setPosition(0,110);
            parent.addChild(list,1);
            if(i === 0){
                this.newListView1 = list;
            }else if(i === 1){
                this.newListView2 = list;
            }else if(i === 2){
                this.newListView3 = list;
            }else{
                this.newListView4 = list;
            }
        }

        for(var i = 0;i < 4;++i){
            if(this.userData[i]){
                this.initNode(i + 1,true);
                var tempCard = this.cards[i] || [];
                this.refreshSingle(i + 1,this.userData[i],tempCard);
            }else{
                this.initNode(i + 1,false);
            }
        }
    },

    initNode:function(index,isBool){
        this.getWidget("name"+index).visible = !!isBool;
        //this.getWidget("ListView_"+index).visible = !!isBool;
        if(index === 2){
            this.newListView2.visible = !!isBool;
        }else if(index === 3){
            this.newListView3.visible = !!isBool;
        }else if(index === 4){
            this.newListView4.visible = !!isBool;
        }else if(index === 1){
            this.newListView1.visible = !!isBool;
        }
        this.getWidget("icon"+index).visible = !!isBool;
        this.getWidget("chuo"+index).visible = !!isBool;
    },

    refreshSingle:function(index,user,cards){
        this.getWidget("name"+index).setString(user.name);
        var defaultimg = "res/res_phz/default_m.png";
        var localNode = this.getWidget("icon"+index);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale=0.95;
        sprite.x = localNode.width / 2;//40;
        sprite.y = localNode.height / 2;//40;
        localNode.addChild(sprite,5,345);
        //sprite.setScale(1.05);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

        var cardsNode = this.newListView1;//this.getWidget("ListView_"+index);
        if(index === 2){
            cardsNode = this.newListView2;
        }else if(index === 3){
            cardsNode = this.newListView3;
        }else if(index === 4){
            cardsNode = this.newListView4;
        }
        var huxi = 0;
        for(var j=0;j<cards.length;j++) {
            var cell = new YZLCSmallResultCell(cards[j]);
            cardsNode.pushBackCustomItem(cell);
            //if(cards[j].huxi > 0){
            //    huxi += cards[j].huxi || 0;
            //}
            if(cards[j].cards){
                huxi += cards[j].cards.length;
            }
        }
        this.getWidget("chuo"+index).setString(huxi+"戳");
    },

    onCloseFace:function(){
        PopupManager.removePopupByList(this);
    },

});
