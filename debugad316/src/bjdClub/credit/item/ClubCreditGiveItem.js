/**
 * Created by leiwenwen on 2018/10/15.
 */
var ClubCreditGiveCell = ccui.Widget.extend({
    ctor:function(data,index,root){
        this.data = data;
        this.index = index;
        this.root = root;

        this._super();
        this.setContentSize(1052, 106);

        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(1052,106),cc.color(126,49,2),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);

        var Image_bg=this.Image_bg= UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        Image_bg.setScale9Enabled(true);
        Image_bg.setContentSize(this.getContentSize());
        Image_bg.setPosition(this.width/2,this.height/2);
        Panel_21.addChild(Image_bg);

        this.label_rank = UICtor.cLabel("1",36,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.label_rank.setPosition(cc.p(-450+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(this.label_rank);

        var Image_rank=this.Image_rank= UICtor.cImg("res/ui/bjdmj/popup/pyq/bisai/1.png");
        Image_rank.setPosition(cc.p(-450+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Image_rank,1);

        var Image_icon=this.Image_icon= UICtor.cImg("res/ui/bjdmj/popup/extImg/icon.png");
        Image_icon.setPosition(cc.p(-290+Image_bg.getAnchorPointInPoints().x, Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Image_icon);
        var Label_name=this.Label_name= UICtor.cLabel("爱吃鱼的猫",28,cc.size(150,31),cc.color("#6f1816"),1,0);
        Label_name.setPosition(cc.p(-100+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_name);
        var Label_id=this.Label_id= UICtor.cLabel("123456",28,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_id.setPosition(cc.p(90+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_id);
        var Label_give=this.Label_give= UICtor.cLabel("100",28,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_give.setPosition(cc.p(356+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_give);

        this.addChild(Panel_21);

        this.Image_rank.visible = false;

        this.setData(data);

    },

    //显示数据
    setData:function(data){
        if(this.index <= 3){
            this.Image_rank.visible = true;
            this.Image_rank.loadTexture("res/ui/bjdmj/popup/pyq/bisai/"+this.index + ".png");
        }
        this.label_rank.setString(this.index);
        this.Label_name.setString(""+data.userName);
        this.Label_id.setString(""+data.userId);
        var dataValue = data.dataValue || 0;//赠送分
        dataValue = MathUtil.toDecimal(dataValue/100);
        this.Label_give.setString(""+dataValue);

        this.showIcon(data.headimgurl);
    },

    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = this.Image_icon;
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if(icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)) {//头像不同才加载
            if (icon.getChildByTag(345)) {
                icon.removeChildByTag(345);
            }

            var sprite = new cc.Sprite(defaultimg);
            sprite.x = icon.width * 0.5;
            sprite.y = icon.height * 0.5;
            icon.addChild(sprite, 5, 345);
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                            if (sprite) {
                                sprite.setTexture(img);
                                icon.curShowIconUrl = iconUrl
                            }
                    }
                });
            }
        }
    },
})
