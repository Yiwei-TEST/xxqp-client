/**
 * Created by cyp on 2019/3/13.
 */
var BindAccountPop = BasePopup.extend({
 
    ctor:function(){
        this._super("res/BindAccountPop.json");
    },

    selfRender:function(){
        var inputBg1 = this.getWidget("input_bg1");
        var inputBg2 = this.getWidget("input_bg2");
        var inputBg3 = this.getWidget("input_bg3");

        this.btnLogin = this.getWidget("btn_login");
        UITools.addClickEvent(this.btnLogin, this, this.onBind);
        this.txt_1 = this.getWidget("txt_1");
        this.txt_2 = this.getWidget("txt_2");
        
        this.inputBox1 = new cc.EditBox(cc.size(inputBg1.width - 10, inputBg1.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox1.x = inputBg1.width/2;
        this.inputBox1.y = inputBg1.height/2;
        // this.inputBox1.setPlaceholderFontColor(cc.color(139,123,108));
        this.inputBox1.setPlaceHolder("9到16位字母和数字的组合");
        inputBg1.addChild(this.inputBox1,1);
        this.inputBox1.setFont("Arial",40);
        this.inputBox1.setPlaceholderFont("Arial",40);

        this.inputBox2 = new cc.EditBox(cc.size(inputBg2.width - 10, inputBg2.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox2.x = inputBg2.width/2;
        this.inputBox2.y = inputBg2.height/2;
        // this.inputBox2.setPlaceholderFontColor(cc.color(139,123,108));
        this.inputBox2.setPlaceHolder("6到8位字母和数字的组合");
        inputBg2.addChild(this.inputBox2,1);
        this.inputBox2.setFont("Arial",40);
        this.inputBox2.setPlaceholderFont("Arial",40);

        this.inputBox3 = new cc.EditBox(cc.size(inputBg2.width - 10, inputBg2.height), new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox3.x = inputBg3.width / 2;
        this.inputBox3.y = inputBg3.height / 2;
        //this.inputBox3.setPlaceholderFontColor(cc.color(139,123,108));
        this.inputBox3.setPlaceHolder("再次输入密码");

        inputBg3.addChild(this.inputBox3, 1);
        this.inputBox3.setFont("Arial", 40);
        this.inputBox3.setPlaceholderFont("Arial", 40);


    },



    
    onBind: function () {
        var self = this;

            var acAccountStr = this.inputBox1.getString();
            if (acAccountStr.length < 9 || acAccountStr.length > 16) {
                FloatLabelUtil.comText("账号长度只能为9~16字符");
                return;
            } else {
                if (acAccountStr.match(/[^a-zA-Z0-9]+/) != null) {
                    FloatLabelUtil.comText("账号包含非法字符“" + str + "”");
                    return;
                }
            }
            var acPasswordStr = this.inputBox2.getString();
            if (!this.checkPassWord(acPasswordStr)) {
                return;
            }
            var acPasswordAgainStr = this.inputBox3.getString();
            if (acPasswordStr !== acPasswordAgainStr) {
                FloatLabelUtil.comText("两次输入的密码不一样");
                return;
            }
            NetworkJT.loginReq("user", "bindAccount", {
                sessCode: PlayerModel.sessCode,
                userId: PlayerModel.userId,
                account: acAccountStr,
                password: acPasswordStr
            },
            function (data) {
                cc.log("=========bind account========", JSON.stringify(data))
                FloatLabelUtil.comText(data.message);
                PopupManager.remove(self);
                SyEventManager.dispatchEvent("BIND_ACCOUNT_SUCCESS");
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
    
    },

    checkPassWord: function (psdStr) {
        if (psdStr.length < 6 || psdStr.length > 8) {
            FloatLabelUtil.comText("请输入6~8位密码");
            return false;
        }

        var hasNum = false;
        var hasWord = false;
        if (psdStr.match(/[a-zA-Z]+/)) {
            hasWord = true;
        }
        if (psdStr.match(/[0-9]+/)) {
            hasNum = true;
        }

        var str = psdStr.match(/[^a-zA-Z0-9]+/);
        if (str != null) {
            FloatLabelUtil.comText("密码包含非法字符“" + str + "”");
            return false;
        } else {
            if (hasNum && hasWord) {
                return true;
            } else {
                FloatLabelUtil.comText("密码必须有字母和数字");
                return false;
            }
        }
    },

});