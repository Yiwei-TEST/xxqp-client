/**
 * Created by leiwenwen on 2018/10/15.
 */
/**
 * 亲友圈所有小组的item
 */
var ClubCreditTeamCell = ccui.Widget.extend({
    ctor:function(data,root,index,configCount,viewTeamUser,myRate){
        this.data = data;
        this.parentNode = root;
        this.myRate = myRate || 100;

        this.configCount = configCount || 0;
        this.viewTeamUser = viewTeamUser || 0;

        this._super();
        this.setContentSize(1580, 156);

        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(1580,156),cc.color(126,49,2),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);
        var Image_bg=this.Image_bg= UICtor.cS9Img("res/ui/bjdmj/popup/pyq/tiao.png",cc.rect(50,50,50,50),cc.size(1580,156));
        Image_bg.setPosition(790,78);
        Panel_21.addChild(Image_bg);
        var Image_head=this.Image_head= UICtor.cImg("res/ui/common/default_m.png");
        Image_head.setPosition(cc.p(-500+Image_bg.getAnchorPointInPoints().x, Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Image_head);
        var Label_name=this.Label_name= UICtor.cLabel("100",40,cc.size(200,45),cc.color("#6f1816"),0,0);
        Label_name.setPosition(cc.p(-630+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_name);
        var Label_id=this.Label_id= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_id.setPosition(cc.p(-100+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_id);
        var Label_score=this.Label_score= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_score.setPosition(cc.p(130+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_score);
        // var Button_ratio = this.Button_ratio = UICtor.cBtn("res/ui/bjdmj/popup/pyq/bisai/chakanxiaji.png");
        var Button_ratio = this.Button_ratio = UICtor.cBtn("res/ui/bjdmj/popup/pyq/bisai/jifenguanli.png");
        Button_ratio.scale = 0.8;
        Button_ratio.setPosition(cc.p(640+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Button_ratio);
        var Label_ratio=this.Label_ratio= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_ratio.setPosition(cc.p(400+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_ratio);
        var Label_teamName=this.Label_teamName= UICtor.cLabel("100",40,cc.size(270,45),cc.color(126,49,2),0,0);
        Label_teamName.setAnchorPoint(cc.p(0,0.5));
        Label_teamName.setPosition(cc.p(Image_head.x+70, 27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_teamName);
        var Label_teamId=this.Label_teamId= UICtor.cLabel("100",40,cc.size(270,45),cc.color(186,61,51),0,0);
        Label_teamId.setAnchorPoint(cc.p(0,0.5));
        Label_teamId.setPosition(cc.p(Image_head.x+70, -27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_teamId);


        this.addChild(Panel_21);

        //if (!this.parentNode.isClubCreaterOrLeader){
        //    Button_ratio.visible = false;
        //}


        Panel_21.setTouchEnabled(true);
        // UITools.addClickEvent(Button_ratio,this,this.onOpenRatio);
        // UITools.addClickEvent(Panel_21,this,this.onTeamDetail);
        UITools.addClickEvent(Panel_21,this,this.onOpenRatio);
        UITools.addClickEvent(Button_ratio,this,this.onTeamDetail);

        this.setData(data)
    },

    onTeamDetail: function() {
        if (this.viewTeamUser){
            var data = {};
            data.teamId = this.opUserId;
            ClickCreditTeamModel.init(data);
            this.parentNode.onShowCreditItem(1,true);
        }
    },

    onOpenRatio: function(obj) {
        //var mc = new ClubCreditRatioPop(this);
        //PopupManager.addPopup(mc);

        //var pop = new ChangeCreditSepPop(this);
        //PopupManager.addPopup(pop);
        ClickCreditTeamModel.setCurTeamId(this.opUserId)
        SyEventManager.dispatchEvent(SyEvent.CLUB_CHECK_DOWN_TEAM);
    },

    //显示数据
    setData:function(data){
        // cc.log("显示数据setData====",JSON.stringify(data));
        this.opUserId = data.userId;
        this.userGroup = data.userGroup || 0;
        this.userGroup = Number(this.userGroup);
        var score = data.sumCredit || 0;
        score = MathUtil.toDecimal(score/100);
        var teamRadit = this.teamRadit = data.creditCommissionRate || 0;
        var groupRadit = this.myRate - teamRadit;
        this.Label_name.setString(""+ClickClubModel.getClubRoleName(data.userRole,data.promoterLevel));
        this.Label_teamName.setString(""+data.name);
        this.Label_teamId.setString(""+data.userId);
        this.Label_id.setString(""+data.memberCount);
        this.Label_score.setString(""+score);
        this.Label_ratio.setString(""+teamRadit + "/"+ groupRadit);

        if(data.ext && JSON.parse(data.ext).commissionConfig == "1"){
            this.Label_ratio.setString("已设置");
        }
        //this.Label_ratio.setString("");
        //cc.log("this.userGroup",this.userGroup)
        this.Button_ratio.visible = true;
        this.Panel_21.setTouchEnabled(false);
        if (data.canSet){
            this.Panel_21.setTouchEnabled(true);
        }

        //cc.log("this.configCount",this.configCount,data.ownConfigCount)
        //var stateStr = "未设置";
        //if (data.ownConfigCount && data.ownConfigCount >= this.configCount){
        //    stateStr = "已设置";
        //}
        //this.Label_ratio.setString("" +stateStr);

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
            sprite.x = icon.width/2;
            sprite.y = icon.height/2;
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