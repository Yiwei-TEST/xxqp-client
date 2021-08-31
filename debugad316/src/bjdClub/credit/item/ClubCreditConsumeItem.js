/**
 * 亲友圈所有小组的item
 */
var ClubCreditConsumeCell = ccui.Widget.extend({
    ctor:function(data,root){
        this.data = data;
        this.parentNode = root;

        this._super();
        this.setContentSize(1580, 156);

        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(1580,156),cc.color(126,49,2),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);
        var Image_bg=this.Image_bg= UICtor.cS9Img("res/ui/bjdmj/popup/pyq/tiao.png",cc.rect(50,50,50,50),cc.size(1580,156));
        Image_bg.setPosition(790,78);
        Panel_21.addChild(Image_bg);

        var Label_name_bczr=this.Label_name_bczr= UICtor.cLabel("100",40,cc.size(200,45),cc.color("#6f1816"),1,0);
        Label_name_bczr.setPosition(cc.p(-700+Image_bg.getAnchorPointInPoints().x, Image_bg.getAnchorPointInPoints().y+27));
        Image_bg.addChild(Label_name_bczr);
        Label_name_bczr.setAnchorPoint(cc.p(0,0.5))

        var Label_id_bczr=this.Label_id_bczr= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        Label_id_bczr.setPosition(cc.p(-700+Image_bg.getAnchorPointInPoints().x, Image_bg.getAnchorPointInPoints().y-27));
        Image_bg.addChild(Label_id_bczr);
        Label_id_bczr.setAnchorPoint(cc.p(0,0.5))

        var Label_credit=this.Label_credit= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_credit.setPosition(cc.p(-200+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_credit);

        var Label_qyqexp=this.Label_qyqexp= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_qyqexp.setPosition(cc.p(200+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_qyqexp);

        var Label_time=this.Label_time= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),1,1);
        Label_time.setPosition(cc.p(550+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_time);

        this.addChild(Panel_21);
        this.setData(data)
    },

    //显示数据
    setData:function(data){
        this.Label_name_bczr.setString(""+this.data.userName)
        this.Label_id_bczr.setString("ID:"+this.data.userId)
        this.Label_credit.setString(""+parseInt(this.data.credit/100))
        this.Label_qyqexp.setString(""+this.data.exp)
        this.Label_time.setString(""+ UITools.formatDetailTime(this.data.createdTime))
    },
})