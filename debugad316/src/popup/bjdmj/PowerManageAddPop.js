
var PowerManageAddPop = BasePopup.extend({
    ctor:function(type){
        this.type = type || 1;
        cc.log("this.type =",this.type);
        this._super("res/powerManageAddPop.json");
    },

    selfRender:function(){

        var Image_6 = this.getWidget("Image_6");
        this.inputNum = new cc.EditBox(cc.size(Image_6.width - 20, Image_6.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputNum.setPosition(Image_6.width / 2, Image_6.height / 2);
        this.inputNum.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputNum.setMaxLength(7);
        this.inputNum.setFont("Arial", 45);
        this.inputNum.setDelegate(this);
        this.inputNum.setPlaceHolder("输入玩家ID");
        if(this.type == 3){
            this.inputNum.setPlaceHolder("输入亲友圈ID");
        }
        this.inputNum.setPlaceholderFont("Arial", 45);
        Image_6.addChild(this.inputNum, 1);


        var btn_add = this.getWidget("Button_add");
        UITools.addClickEvent(btn_add, this, this.onButtonAdd);

        this.setExplain();
    },

    setExplain:function () {
        if (this.type == 1){
            this.getWidget("label_explain").setString("请输入玩家ID为其增加钻石权限");
        }else if(this.type == 2){
            this.getWidget("label_explain").setString("请输入玩家ID为其增加业务员权限");
        }else if(this.type == 3){
            this.getWidget("label_explain").setString("请输入亲友圈ID为其开启比赛房");
        }      
        
    },

    onButtonAdd:function(){
        var Id = this.inputNum.getString();
        if (!Id) {
            FloatLabelUtil.comText("请输入玩家ID");
            return;
        }
        var type_int = parseInt(this.type);
        cc.log("this.type ==",this.type);
        
        var str = "";
        if(type_int == 1){
            str ="是否确认给玩家" + Id + "添加赠送钻石权限?";
        } else if (type_int == 2) {
            str ="是否确认给玩家" + Id + "添加业务员权限?";
        } else if (type_int == 3) {
            str ="是否确认给亲友圈" + Id + "开启比赛房?";
        }
        AlertPop.show(str, function () {
            /*  0号位 ：1请求权限列表，2添加，3删除
                1号位： 权限ID（1：钻石，2：业务员，3：亲友圈）
                2号位： 角色ID或亲友圈ID
                3号位: 查询的页数
            */
            sySocket.sendComReqMsg(4520, [2, type_int, parseInt(Id)]);
        });

        
    },
}); 