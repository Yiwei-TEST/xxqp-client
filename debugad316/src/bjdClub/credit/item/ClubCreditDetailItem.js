/**
 * Created by leiwenwen on 2018/10/15.
 */
/**
 * 赠送统计的小组成员的item
 */
var ClubCreditDetailItem = ccui.Widget.extend({
    ctor:function(data,root,index){
        this.data = data;
        this.parentNode = root;

        this._super();
        this.setContentSize(1580, 156);

        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(1580,156),cc.color(126,49,2),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);

        var Image_bg=this.Image_bg= UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        Image_bg.setScale9Enabled(true);
        Image_bg.setContentSize(this.getContentSize());
        Image_bg.setPosition(this.width/2,this.height/2);
        Panel_21.addChild(Image_bg);

        var Image_head=this.Image_head= UICtor.cImg("res/ui/common/default_m.png");
        Image_head.setPosition(cc.p(-700+Image_bg.getAnchorPointInPoints().x, Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Image_head);
        var Label_id=this.Label_id= UICtor.cLabel("100",40,cc.size(250,45),cc.color(186,61,51),0,0);
        Label_id.setAnchorPoint(0,0.5);
        Label_id.setPosition(cc.p(Image_head.x + 70, -27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_id);
        var Label_name=this.Label_name= UICtor.cLabel("100",40,cc.size(270,45),cc.color("#6f1816"),0,0);
        Label_name.setAnchorPoint(0,0.5);
        Label_name.setPosition(cc.p(Image_head.x + 70, 28+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_name);
        var Label_num=this.Label_num= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_num.setPosition(cc.p(-50 + Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_num);
        var Label_give=this.Label_give= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_give.setPosition(cc.p(420+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_give);

        this.label_winlose = UICtor.cLabel("0",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.label_winlose.setPosition(cc.p(630+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(this.label_winlose);

        var Label_jushu=this.Label_jushu= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_jushu.setPosition(cc.p(-300+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_jushu);

        var Label_upId=this.Label_upId= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_upId.setPosition(cc.p(200+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_upId);



        this.addChild(Panel_21);



        this.setData(data)
    },

    //显示数据
    setData:function(data){
        var totalCredit = data.commissionCredit || 0;//赠送分
        totalCredit = MathUtil.toDecimal(totalCredit/100);
        var jushu = data.zjs || 0;//总局数
        var time = data.commissionCount || 0;//赠送次数
        this.Label_name.setString(""+data.userName);
        this.Label_id.setString(""+data.userId);
        this.Label_num.setString(""+time); //赠送次数
        this.Label_give.setString(""+totalCredit);
        this.Label_jushu.setString(""+jushu);
        this.Label_upId.setString(""+data.promoterId);
        var winlose = data.winLoseCredit || 0;
        this.label_winlose.setString(MathUtil.toDecimal(winlose/100));
        this.showIcon(data.headimgurl , 1);
    },

    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = this.Image_head;
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
    }
})