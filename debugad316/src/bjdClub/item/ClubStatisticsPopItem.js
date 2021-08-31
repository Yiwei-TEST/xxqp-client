/**
 * Created by leiwenwen on 2018/10/15.
 */
var ClubStatisticsPopItem = ccui.Widget.extend({
    ctor:function(root){
        this.parentNode = root;

        this._super();
        this.setContentSize(1863, 156);


        var mainPopup=this.mainPopup= UICtor.cPanel(cc.size(1863,156),cc.color(0,0,0),0);
        mainPopup.setAnchorPoint(cc.p(0,0));
        mainPopup.setPosition(0,0);
        var item_qtj=this.item_qtj= UICtor.cPanel(cc.size(1863,156),cc.color(150,200,255),0);
        item_qtj.setAnchorPoint(cc.p(0,0));
        item_qtj.setPosition(0,0);
        mainPopup.addChild(item_qtj);
        var img_qtjBg=this.img_qtjBg= UICtor.cS9Img("res/ui/bjdmj/popup/pyq/statistics/tiao1.png", cc.rect(50,50,50,50),cc.size(1863,156));
        img_qtjBg.setPosition(932,78);
        img_qtjBg.setLocalZOrder(1);
        item_qtj.addChild(img_qtjBg);
        var img_head=this.img_head= UICtor.cImg("res/ui/bjdmj/popup/pyq/renwutouxiang1.png");
        img_head.setPosition(cc.p(-540+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(img_head);
        var Button_unfold=this.Button_unfold= UICtor.cBtnBright("res/ui/bjdmj/popup/pyq/statistics/jia.png","res/ui/bjdmj/popup/pyq/statistics/jian.png");
        Button_unfold.setPosition(cc.p(-840+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(Button_unfold);
        var user_order=this.user_order= UICtor.cLabel("会长",40,cc.size(0,0),cc.color(101,11,12),0,0);
        user_order.setAnchorPoint(cc.p(0,0.5));
        user_order.setPosition(cc.p(-780+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(user_order);
        var user_name=this.user_name= UICtor.cLabel("玩家名字",40,cc.size(0,0),cc.color(101,11,12),0,0);
        user_name.setAnchorPoint(cc.p(0,0.5));
        user_name.setPosition(cc.p(-470+img_qtjBg.getAnchorPointInPoints().x, 27+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(user_name);
        var user_id=this.user_id= UICtor.cLabel("ID：123456",40,cc.size(0,0),cc.color(181,57,46),0,0);
        user_id.setAnchorPoint(cc.p(0,0.5));
        user_id.setPosition(cc.p(-470+img_qtjBg.getAnchorPointInPoints().x, -27+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(user_id);
        var user_status=this.user_status= UICtor.cLabel("8888",40,cc.size(0,0),cc.color(101,11,12),0,0);
        user_status.setAnchorPoint(cc.p(0.6,0.5));
        user_status.setPosition(cc.p(650+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(user_status);
        var user_dyjnum=this.user_dyjnum= UICtor.cLabel("88888",40,cc.size(0,0),cc.color(101,11,12),0,0);
        user_dyjnum.setAnchorPoint(cc.p(0.6,0.5));
        user_dyjnum.setPosition(cc.p(80+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(user_dyjnum);
        var Button_down=this.Button_down= UICtor.cBtn("res/ui/bjdmj/popup/pyq/statistics/chakan.png");
        Button_down.setPosition(cc.p(830+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(Button_down);
        var Image_winNum=this.Image_winNum= UICtor.cS9Img("res/ui/bjdmj/popup/pyq/bisai/heidi1.png", cc.rect(10,10,10,10),cc.size(200,45));
        Image_winNum.setPosition(cc.p(-110+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(Image_winNum);
        var user_winNum=this.user_winNum= UICtor.cLabel("88888",40,cc.size(0,0),cc.color(101,11,12),0,0);
        user_winNum.setAnchorPoint(cc.p(0.6,0.5));
        user_winNum.setPosition(cc.p(0+Image_winNum.getAnchorPointInPoints().x, 0+Image_winNum.getAnchorPointInPoints().y));
        Image_winNum.addChild(user_winNum);
        var user_consume=this.user_consume= UICtor.cLabel("88888",40,cc.size(0,0),cc.color(101,11,12),0,0);
        user_consume.setAnchorPoint(cc.p(0.6,0.5));
        user_consume.setPosition(cc.p(460+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(user_consume);
        var user_renci=this.user_renci= UICtor.cLabel("88888",40,cc.size(0,0),cc.color(101,11,12),0,0);
        user_renci.setAnchorPoint(cc.p(0.6,0.5));
        user_renci.setPosition(cc.p(270+img_qtjBg.getAnchorPointInPoints().x, 0+img_qtjBg.getAnchorPointInPoints().y));
        img_qtjBg.addChild(user_renci);



        Button_down.scale = 0.8;
        Button_unfold.scale = 0.8;

        this.addChild(mainPopup);
        //this.setData(data)
    },

    setItemQglData:function(data){
        var changeLabelParams = [];
        changeLabelParams.push(this.user_name);
        changeLabelParams.push(this.user_id);
        changeLabelParams.push(this.user_order);
        changeLabelParams.push(this.user_consume);
        changeLabelParams.push(this.user_winNum);
        changeLabelParams.push(this.user_status);
        changeLabelParams.push(this.user_dyjnum);
        changeLabelParams.push(this.user_renci);

        this.changeLabelColor(changeLabelParams);

        this.curLevel = this.curLevel ||  0;

        //cc.log("panelItem.curLevel===",JSON.stringify(data));

        if (this.Button_unfold){
            this.Button_unfold.visible = this.isHasData(data.userId);
            this.Button_unfold.x = 57 + this.curLevel * 8;
            this.user_order.x = this.Button_unfold.x + 50;
        }
        if (this.isOpen){
            this.Button_unfold.setBright(false);
        }else{
            this.Button_unfold.setBright(true);
        }
        this.user_order.setString(ClickClubModel.getClubRoleName(data.userRole,data.promoterLevel));

        var idStr = data.userId;
        var nameStr = data.userName;
        this.user_name.setString(UITools.truncateLabel(nameStr,5));
        this.user_id.setString("ID:" + idStr);

        var totalPay = MathUtil.toDecimal((data.totalPay || 0)/100);
        var sumCredit = MathUtil.toDecimal((data.sumCredit || 0)/100);
        this.user_consume.setString("" + totalPay);
        this.user_winNum.setString("" + sumCredit || 0);
        var credit = MathUtil.toDecimal((data.credit || 0)/100);
        this.user_status.setString("" + credit);
        this.user_dyjnum.setString("" + (data.dyjCount || 0));
        this.user_renci.setString("" + (data.zjsCount || 0));

        this.showIcon(this.img_head,data.headimgurl ,data.userId, 1);

        this.itemData = data;
        this.Button_unfold.itemData = data;
        this.Button_down.itemData = this.Image_winNum.itemData = data;
        this.Button_down.temp = 2;
        this.Image_winNum.temp = 2;
        this.Button_unfold.rootPanel = this;
        this.unfoldBtn = this.Button_unfold;

    },

    showIcon: function (imgNode,iconUrl,userId, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if (!SyConfig.IS_HEAD_LOAD){
            var sex = sex || 1;
            var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";
            var spr = imgNode.getChildByName("icon_spr");
            if(!spr){
                spr = new cc.Sprite(defaultimg);
                spr.setName("icon_spr");
                spr.setPosition(imgNode.width/2,imgNode.height/2);
                spr.setScale(100/spr.width);
                imgNode.addChild(spr);
            }
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        spr.setTexture(img);
                        spr.setScale(100/spr.width);
                    }
                });
            }else{
                spr.initWithFile(defaultimg);
            }
        }else{
            WXHeadIconManager.setWxHeadImg(userId,iconUrl,null,null,imgNode,1);
        }
    },

    isHasData: function (curUserId) {
        var isHasData = false;
        if (this.parentNode){
            for (var i = 0; i < this.parentNode.curDataList.length; i++) {
                if (curUserId == this.parentNode.curDataList[i].promoterId) {
                    isHasData = true;
                    break;
                }
            }
        }
        return isHasData;
    },

    changeLabelColor:function(changeLabelParams){
        var roleColorArr = [
            {color:"7400b0",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao1.png",curLevel:1},
            {color:"b40505",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao2.png",curLevel:2},
            {color:"02790a",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao3.png",curLevel:3},
            {color:"5f4628",imgPath:"res/ui/bjdmj/popup/pyq/statistics/tiao4.png",curLevel:4}
        ]

        var color = "7400b0";
        var imgPath = "res/ui/bjdmj/popup/pyq/statistics/tiao1.png";
        for(var j = 0;j < roleColorArr.length ;j++){
            if (this.curLevel == roleColorArr[j].curLevel){
                color = roleColorArr[j].color;
                imgPath = roleColorArr[j].imgPath;
                break;
            }
        }
        if (changeLabelParams){
            for(var i = 0;i < changeLabelParams.length ;i++){
                var label = changeLabelParams[i];
                if (label){
                    label.setColor(cc.color(color));
                }
            }
        }
        this.img_qtjBg.loadTexture(imgPath);
    }
})