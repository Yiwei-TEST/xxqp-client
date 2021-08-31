/**
 * Created by leiwenwen on 2018/10/15.
 */
var PyqChenYuanItem = ccui.Widget.extend({
    ctor:function(data,root,index){
        this.data = data;
        this.parentNode = root;

        this._super();
        this.setContentSize(379, 144);

        var mainPopup=this.mainPopup= UICtor.cPanel(cc.size(379,144),cc.color(0,0,0),0);
        mainPopup.setAnchorPoint(cc.p(0,0));
        mainPopup.setPosition(0,0);
        var Button_role=this.Button_role= UICtor.cBtnBright("res/ui/bjdmj/popup/pyq/cygl/img_cy3.png","res/ui/bjdmj/popup/pyq/cygl/img_cy4.png");
        Button_role.setPosition(192,72);
        mainPopup.addChild(Button_role);
        var Label_role=this.Label_role= new ccui.Text("所有成员","res/font/bjdmj/fznt.ttf",50);
        Label_role.setColor(cc.color("#9d2e2e"));
        Label_role.setPosition(cc.p(0+Button_role.getAnchorPointInPoints().x, 0+Button_role.getAnchorPointInPoints().y));
        Button_role.addChild(Label_role);
        var Label_role_1=this.Label_role_1= new ccui.Text("所有成员","res/font/bjdmj/fznt.ttf",50);
        Label_role_1.setColor(cc.color("#9d2e2e"));
        Label_role_1.setPosition(cc.p(0+Button_role.getAnchorPointInPoints().x, 0+Button_role.getAnchorPointInPoints().y));
        Button_role.addChild(Label_role_1);

        Button_role.setTouchEnabled(false);
        this.addChild(mainPopup);
        this.setData(data)
    },

    //显示数据
    setData:function(roleData){
        if (roleData){
            var roleSize = 50;
            var roleName = roleData.name;
            var color = "9d2e2e";
            if (roleData.name != "所有成员"){
                this.Label_role.y = 110;
                this.Label_role_1.y = 50;
                roleSize = 45;
                roleName = UITools.truncateLabel(roleData.userName,4);
                color = "886032";
            }else{
                this.Label_role.y = 82;
                this.Label_role_1.y = 82;
                roleData.name = "";
            }
            this.Label_role_1.setFontSize(roleSize);
            this.Label_role_1.setString(roleData.name);
            this.Label_role_1.setColor(cc.color(color));
            this.Label_role.setFontSize(roleSize);
            this.Label_role.setString(roleName);
            this.Label_role.setColor(cc.color(color));
        }

    },
    refresh:function(isChoose){
        var isBright = false;
        var color = "886032";
        if (isChoose){
            isBright = true;
            color = "9d2e2e";
        }
        this.Button_role.setBright(isBright);
        this.Label_role.setColor(cc.color(color));
        this.Label_role_1.setColor(cc.color(color));
    },
})