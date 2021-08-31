/**
 * Created by Administrator on 2020/8/27 0027.
 */
var UserIconPop = BasePopup.extend({
    ctor:function(){

    },

    getImgNode:function(imgNode){
        var spr = imgNode.getChildByName("icon_spr");
        return spr;
    },

    /**
     *
     * @param imgNode 父节点
     * @param iconUrl 头像路径
     * @param localIndexID 道具头像框id
     * @param isNeedShow 是否显示道具头像框
     * @param sex 性别
     */
    showIcon: function (imgNode,iconUrl,localIndexID,isNeedShow, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var spr = imgNode.getChildByName("icon_spr");
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";
        if(!spr){
            spr = new cc.Sprite(defaultimg);
            spr.setName("icon_spr");
            spr.setPosition(imgNode.width/2,imgNode.height/2);
            spr.setScale(imgNode.width/spr.width -0.1);
            imgNode.addChild(spr);
        }
        spr.visible = true;
        if(this.url == iconUrl && this.url){

        }else{
            if (iconUrl) {
                var self = this;
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        spr.setTexture(img);
                        spr.setScale(imgNode.width/spr.width - 0.1);
                        self.url = iconUrl;
                    }
                });
            }else{
                spr.initWithFile(defaultimg);
                this.url = defaultimg;
            }
        }

        // if(!!isNeedShow){
        //     UserLocalDataModel.setOtherUserIconVisible(spr,localIndexID);
        // }
    },
});