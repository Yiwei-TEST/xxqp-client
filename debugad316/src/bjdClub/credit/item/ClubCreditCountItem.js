/**
 * Created by leiwenwen on 2018/10/15.
 */
/**
 * 赠送统计的小组Item
 */
var ClubCreditCountItem = ccui.Widget.extend({
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
        Image_head.setPosition(cc.p(-500+Image_bg.getAnchorPointInPoints().x, 2+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Image_head);
        var Label_name=this.Label_name= UICtor.cLabel("100",40,cc.size(270,45),cc.color("#6f1816"),1,0);
        Label_name.setPosition(cc.p(-700+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_name);
        var Label_number=this.Label_number= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_number.setPosition(cc.p(-50+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_number);
        var Label_jushu=this.Label_jushu= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_jushu.setPosition(cc.p(170+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_jushu);
        var Label_ratio=this.Label_ratio= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_ratio.setPosition(cc.p(500+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_ratio);
        var Label_teamName=this.Label_teamName= UICtor.cLabel("100",40,cc.size(250,45),cc.color("#6f1816"),0,0);
        Label_teamName.setAnchorPoint(cc.p(0,0.5));
        Label_teamName.setPosition(cc.p(Image_head.x+70, 27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_teamName);
        var Label_teamId=this.Label_teamId= UICtor.cLabel("100",40,cc.size(250,45),cc.color(186,61,51),0,0);
        Label_teamId.setAnchorPoint(cc.p(0,0.5));
        Label_teamId.setPosition(cc.p(Image_head.x+70, -27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_teamId);
        var Label_score=this.Label_score= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_score.setPosition(cc.p(630+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_score);
        var Label_num=this.Label_num= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_num.setPosition(cc.p(400+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_num);


        this.addChild(Panel_21);

        this.setData(data);

        Panel_21.setTouchEnabled(true);
        UITools.addClickEvent(Panel_21,this,this.onTeamDetail);
    },
    //显示数据
    setData:function(data){
        this.opUserId = data.userId;
        //this.userGroup = data.userId || 0;
        this.userGroup = Number(data.userId) || 0;
        var credit = data.commissionCredit || 0;//总赠送分
        credit = MathUtil.toDecimal(credit/100);
        var time = data.commissionCount || 0;//次数
        var num = data.memberCount || 0;//人数
        var teamRadit = this.teamRadit = data.creditCommissionRate || 0;
        var groupRadit = 100 - teamRadit;
        var jushu = data.zjs || 0;//总局数
        if (data.promoterLevel >= 2) {
            var roleName = ClickClubModel.getClubRoleName(10000,data.promoterLevel)
            this.Label_name.setString(roleName);
        } else if (data.promoterLevel == 1) {
            this.Label_name.setString("会长");
        }
        this.Label_teamName.setString(""+data.userName);
        this.Label_teamId.setString(""+data.userId);
        this.Label_number.setString(""+num);
        this.Label_score.setString(""+credit);
        //this.Label_ratio.setString(""+teamRadit + "-"+ groupRadit);
        this.Label_num.setString(""+time);
        this.Label_jushu.setString(""+jushu);
        this.Label_ratio.setString("");
        //this.Label_jushu.setString("");
        this.showIcon(data.headimgurl , 1);
    },

    onTeamDetail: function() {
        //cc.log(" this.userGroup", this.userGroup)
        var data = {};
        data.teamId = this.userGroup;
        ClickCreditTeamModel.init(data);
        this.parentNode.onShowCreditItem(5);
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