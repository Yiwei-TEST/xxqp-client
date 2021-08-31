/**
 * Created by leiwenwen on 2018/10/15.
 */
var ClubCreditScoreCell = ccui.Widget.extend({
    ctor:function(data,root){
        this.data = data;
        this.root = root;

        this._super();
        this.setContentSize(1580, 156);

        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(1580,156),cc.color(126,49,2),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);
        var Image_bg=this.Image_bg= UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        Image_bg.setScale9Enabled(true);
        Image_bg.setContentSize(this.getContentSize());
        Image_bg.setPosition(790,78);
        Panel_21.addChild(Image_bg);

        var Label_id=this.Label_id= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_id.setPosition(cc.p(-600+Image_bg.getAnchorPointInPoints().x, -27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_id);
        var Label_time=this.Label_time= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_time.setPosition(cc.p(580+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_time);
        var Label_score=this.Label_score= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_score.setPosition(cc.p(-220+Image_bg.getAnchorPointInPoints().x, 0+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_score);
        var Label_ids=this.Label_ids= UICtor.cLabel("100",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        Label_ids.setPosition(cc.p(170+Image_bg.getAnchorPointInPoints().x, -27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_ids);
        var Label_name=this.Label_name= UICtor.cLabel("100",40,cc.size(200,45),cc.color("#6f1816"),1,0);
        Label_name.setPosition(cc.p(-600+Image_bg.getAnchorPointInPoints().x, 27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_name);
        var Label_names=this.Label_names= UICtor.cLabel("100",40,cc.size(200,45),cc.color("#6f1816"),1,0);
        Label_names.setPosition(cc.p(170+Image_bg.getAnchorPointInPoints().x, 27+Image_bg.getAnchorPointInPoints().y));
        Image_bg.addChild(Label_names);

        this.addChild(Panel_21);

        this.setData(data)
    },

    //显示数据
    setData:function(data){
        this.Label_name.setString(""+data.optUserName);
        this.Label_id.setString(""+data.optUserId);
        var credit =  data.credit || 0;
        credit = MathUtil.toDecimal(credit/100);
        this.Label_score.setString(""+credit);
        this.Label_ids.setString(""+data.userId);
        var name = data.userName || "";
        if (data.createdTime){
            var time = ClubRecallDetailModel.getLocalTime(data.createdTime)
            this.Label_time.setString(""+time);
        }
        this.Label_names.setString(""+name);
    },



})