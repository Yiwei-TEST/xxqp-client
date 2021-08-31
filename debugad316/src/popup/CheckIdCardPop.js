/**
 * Created by Administrator on 2016/6/27.
 */
var CheckIdCardPop = BasePopup.extend({
    ctor: function () {
        this._super("res/checkIdCardPop.json");
    },

    selfRender: function () {

        this.btnTrue = this.getWidget("Button_true");
        UITools.addClickEvent(this.btnTrue, this , this.onTrue);
        this.btnTrue.visible = true;

        var label_tip = this.getWidget("label_tip");
        label_tip.setString("根据文化部《网络游戏管理暂行办法》的相关要求\n请大家使用有效身份证进行实名认证");


        var inputNameImg = this.getWidget("inputName");
        this.inputName = new cc.EditBox(cc.size(450, 86),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputName.setString("");
        this.inputName.x = inputNameImg.width/2;
        this.inputName.y = inputNameImg.height/2;
        this.inputName.setDelegate(this);
        this.inputName.setFont("Arial",40);
        this.inputName.setMaxLength(30);
        this.inputName.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputName.setPlaceHolder("请输入姓名");
        this.inputName.setPlaceholderFont("Arial" , 40);
        inputNameImg.addChild(this.inputName,0);


        var inputIdCardImg = this.getWidget("inputIdCard");
        this.inputIdCard = new cc.EditBox(cc.size(450, 86),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputIdCard.setString("");
        this.inputIdCard.x = inputIdCardImg.width/2;
        this.inputIdCard.y = inputIdCardImg.height/2;
        this.inputIdCard.setDelegate(this);
        this.inputIdCard.setFont("Arial",40);
        //身份证号可能有字母X
        this.inputIdCard.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputIdCard.setMaxLength(30);
        this.inputIdCard.setPlaceHolder("请输入身份证号");
        this.inputIdCard.setPlaceholderFont("Arial" , 40);
        inputIdCardImg.addChild(this.inputIdCard,0);

        this.onSearch();

    },

    onTrue:function(){
        var name = this.inputName.getString();
        var idCard = this.inputIdCard.getString();
        var self =  this;
        if(name){
            if (idCard){
                var msgStr = {realName:""+name,idCard:idCard};
                var msg = JSON.stringify(msgStr);
                NetworkJT.loginReq("user", "editUserMsg", {msg:msg,userId:PlayerModel.userId}, function (data) {
                    if (data) {
                        cc.log("editUserMsg::"+JSON.stringify(data));
                        FloatLabelUtil.comText("实名认证成功");
                        PopupManager.remove(self);
                    }
                }, function (data) {
                    FloatLabelUtil.comText(data.message);
                    //PopupManager.remove(self);
                });
            }else{
                FloatLabelUtil.comText("请输入身份证");
            }
        }else{
            FloatLabelUtil.comText("请输入姓名");
        }
    },

    onSearch:function(){
        var self =  this;
        NetworkJT.loginReq("user", "queryUserMsg", {userId:PlayerModel.userId}, function (data) {
            if (data) {
                cc.log("queryUserMsg::"+JSON.stringify(data));
                if (data.message) {
                    if (data.message.length >= 2) {
                        self.btnTrue.visible = false;
                        self.inputName.setString(data.message[0].msgValue);
                        self.inputIdCard.setString(data.message[1].msgValue);
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            //PopupManager.remove(self);
        });
    }

});
