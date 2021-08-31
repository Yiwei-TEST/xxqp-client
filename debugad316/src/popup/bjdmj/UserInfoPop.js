/**
 * Created by cyp on 2019/3/11.
 */

var UserInfoPop = BasePopup.extend({

    ctor: function () {
        this._super("res/userInfo.json");
    },

    selfRender: function () {

        //头像
        var imgHead = this.getWidget("img_head");
        var sten=new cc.Sprite("res/ui/bjdmj/popup/popup_img_touxiangkuang_2.png");
        var clipnode = new cc.ClippingNode();
        clipnode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:imgHead.width/2,y:imgHead.height/2,alphaThreshold:0.8});
        var sprite = new cc.Sprite("res/ui/common/testIcon.png");
        sprite.setScale(imgHead.width/sprite.width);
        clipnode.addChild(sprite);
        imgHead.addChild(clipnode,1);

        cc.loader.loadImg(PlayerModel.headimgurl,{width: 252, height:252},function(error, texture){
            if(!error){
                sprite.setTexture(texture);
            }
        });

        this.getWidget("label_name").setString(PlayerModel.name);
        this.getWidget("label_id").setString(PlayerModel.userId);
        this.getWidget("label_zs").setString(PlayerModel.cards);
        this.getWidget("label_sp").setString(PlayerModel.goldUserInfo.gold);

    },




});
