/**
 * Created by cyp on 2019/3/13.
 */
var PhoneLoginPop = BasePopup.extend({
    phoneNum:0,
    timeCount:0,
    ctor:function(layerType){

        this.layerType = layerType || 1;

        this._super("res/PhoneLoginPop.json");
    },

    selfRender:function(){
        var inputBg1 = this.getWidget("input_bg1");
        var inputBg2 = this.getWidget("input_bg2");
        this.imgTitle = this.getWidget("img_title");
        this.btnLogin = this.getWidget("btn_login");
        this.txt_1 = this.getWidget("txt_1");
        this.txt_2 = this.getWidget("txt_2");
        this.btnZhmm = this.getWidget("btn_zhmm");
        this.btnKszc = this.getWidget("btn_kszc");
        this.btnKszc.setVisible(false);

        UITools.addClickEvent(this.btnLogin,this,this.onClickLogin);
        UITools.addClickEvent(this.btnZhmm,this,this.onClickZhmm);
        //UITools.addClickEvent(this.btnKszc,this,this.onClickKszc);

        this.label_count = this.getWidget("label_count");
        this.label_count.setVisible(false);
        var Label_62 = this.getWidget("Label_62");
        if(BeansConfigModel.aloneConfig && BeansConfigModel.aloneConfig.bingDingNum){
            Label_62.setString("绑定成功奖励白金豆"+BeansConfigModel.aloneConfig.bingDingNum);
        }
        this.inputBox1 = new cc.EditBox(cc.size(inputBg1.width - 10, inputBg1.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox1.x = inputBg1.width/2;
        this.inputBox1.y = inputBg1.height/2;
        //this.inputBox1.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg1.addChild(this.inputBox1,1);
        this.inputBox1.setFont("Arial",40);
        this.inputBox1.setPlaceholderFont("Arial",40);

        this.inputBox2 = new cc.EditBox(cc.size(inputBg2.width - 10, inputBg2.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox2.x = inputBg2.width/2;
        this.inputBox2.y = inputBg2.height/2;
        //this.inputBox2.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg2.addChild(this.inputBox2,1);
        this.inputBox2.setFont("Arial",40);
        this.inputBox2.setPlaceholderFont("Arial",40);

        this.setLayerType(this.layerType);
    },

    countTime:function(time){
        this.timeCount = time;

        if(time > 0){
            this.label_count.setVisible(true);
            this.btnZhmm.setVisible(false);
            this.stopActionByTag(1134);
            var action = cc.sequence(cc.callFunc(function(){
                this.timeCount--;
                if(this.timeCount > 0){
                    this.label_count.setString("(" + this.timeCount + "s)");
                }else{
                    this.label_count.setVisible(false);
                    var typeArr = [1,2,4,7,8];
                    if(ArrayUtil.indexOf(typeArr,this.layerType) >= 0){
                        this.btnZhmm.setVisible(true);
                    }
                }
            }.bind(this)),cc.delayTime(1)).repeat(parseInt(time));
            action.setTag(1134);
            this.runAction(action);
        }

    },

    onClickLogin:function(){
        if(this.layerType == 1){
            this.phoneLogin(this.inputBox1.getString(),this.inputBox2.getString());
        }else if(this.layerType == 2){
            this.verifyCode("bind",this.inputBox2.getString());
        }else if(this.layerType == 3){
            this.uploadPassword(this.inputBox1.getString(),this.inputBox2.getString(),this.phoneNum);
        }else if(this.layerType == 4){
            this.verifyCode("forget_pwd",this.inputBox2.getString());
        }else if(this.layerType == 5 || this.layerType == 6){
            this.verifyPhonePw(this.inputBox2.getString());
        }else if(this.layerType == 7){
            this.verifyCode("unbind",this.inputBox2.getString());
        }else if(this.layerType == 8){
            this.verifyCode("change_bind",this.inputBox2.getString());
        }

    },

    onClickZhmm:function(){
        if(this.layerType == 1){
            this.setLayerType(4);
        }else{
            this.getYzm();
        }
    },



    onClickKszc:function(){
        this.setLayerType(2);
    },

    getYzm:function(){
        if(this.layerType == 2){
            this.getVerifyCode("bind",this.inputBox1.getString());
        }else if(this.layerType == 4){
            this.getVerifyCode("forget_pwd",this.inputBox1.getString());
        }else if(this.layerType == 7){
            this.getVerifyCode("unbind",this.inputBox1.getString());
        }else if(this.layerType == 8){
            this.getVerifyCode("change_bind",this.inputBox1.getString());
        }
    },

    setLayerType:function(type){

        this.layerType = type;

        this.timeCount = 0;

        this.inputBox1.setString("");
        this.inputBox2.setString("");
        this.inputBox1.setTouchEnabled(true);
        this.inputBox2.setTouchEnabled(true);

        var titleRes = "shoujidenglu.png";
        var btnLoginRes = "xiayibu.png";
        var btnZhmmRes = "phone_login_zhaohuimima.png";
        var txtRes1 = "账号：";
        var txtRes2 = "密码：";
        if(type == 1){//手机登录
            btnLoginRes = "phone_login_btn_login.png";

            this.inputBox1.setPlaceHolder("请输入手机号");
            this.inputBox1.setMaxLength(11);
            this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.inputBox2.setPlaceHolder("请输入密码");
            this.inputBox2.setMaxLength(50);
            this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
            this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);

            this.inputBox1.setString(PhoneLoginModel.getPhone() || "");
            this.inputBox2.setString(PhoneLoginModel.getPhonePassword() || "");
        }else if(type == 2){//手机注册
            titleRes = "phone_login_shoujizhuce.png";
            txtRes2 = "验证码：";
            btnZhmmRes = "phone_login_huoquyanzhengma.png";

            this.inputBox1.setPlaceHolder("请输入手机号");
            this.inputBox1.setMaxLength(11);
            this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.inputBox2.setPlaceHolder("请输入验证码");
            this.inputBox2.setMaxLength(10);
            this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.btnKszc.setVisible(false);

        }else if(type == 3){//输入密码
            titleRes = "phone_login_shurumima.png";
            txtRes1 = "密码：";
            txtRes2 = "确定密码：";

            this.inputBox1.setPlaceHolder("请输入密码");
            this.inputBox1.setMaxLength(50);
            this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
            this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);

            this.inputBox2.setPlaceHolder("请再次输入密码");
            this.inputBox2.setMaxLength(50);
            this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
            this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);

            this.btnZhmm.setVisible(false);
            this.btnKszc.setVisible(false);

        }else if(type == 4){//忘记密码
            titleRes = "phone_login_wangjimima.png";
            txtRes2 = "验证码：";
            btnZhmmRes = "phone_login_huoquyanzhengma.png";

            this.inputBox1.setPlaceHolder("请输入手机号");
            this.inputBox1.setMaxLength(11);
            this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.inputBox2.setPlaceHolder("请输入验证码");
            this.inputBox2.setMaxLength(10);
            this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.btnKszc.setVisible(false);
            this.btnZhmm.setVisible(true);
        }else if(type == 5 || type == 6){//取消绑定,和修改绑定验证密码界面
            titleRes = type == 5?"phone_login_quxiaobangding.png":"phone_login_xiugaibangding.png";
            this.inputBox1.setPlaceHolder("请输入手机号");
            this.inputBox1.setMaxLength(11);
            this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
            this.inputBox1.setString(PlayerModel.phoneNum);
            this.inputBox1.setTouchEnabled(false);

            this.inputBox2.setPlaceHolder("请输入原密码");
            this.inputBox2.setMaxLength(50);
            this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
            this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);

            this.btnZhmm.setVisible(false);
            this.btnKszc.setVisible(false);
        }else if(type == 7){//取消绑定，验证验证码界面
            titleRes = "phone_login_quxiaobangding.png";
            txtRes2 = "验证码：";
            btnZhmmRes = "phone_login_huoquyanzhengma.png";

            this.inputBox1.setPlaceHolder("请输入手机号");
            this.inputBox1.setMaxLength(11);
            this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
            this.inputBox1.setString(PlayerModel.phoneNum);
            this.inputBox1.setTouchEnabled(false);

            this.inputBox2.setPlaceHolder("请输入验证码");
            this.inputBox2.setMaxLength(10);
            this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.btnKszc.setVisible(false);
            this.btnZhmm.setVisible(true);
        }else if(type == 8){//修改绑定
            titleRes = "phone_login_xiugaibangding.png";
            txtRes2 = "验证码：";
            btnZhmmRes = "phone_login_huoquyanzhengma.png";

            this.inputBox1.setPlaceHolder("请输入手机号");
            this.inputBox1.setMaxLength(11);
            this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.inputBox2.setPlaceHolder("请输入验证码");
            this.inputBox2.setMaxLength(10);
            this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
            this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

            this.btnKszc.setVisible(false);
            this.btnZhmm.setVisible(true);
        }
        this.getWidget("label_tip").visible = (this.layerType == 3);
        this.imgTitle.loadTexture("res/ui/bjdmj/popup/phoneLogin/" + titleRes);
        this.txt_1.setString(txtRes1);
        this.txt_2.setString(txtRes2);
        this.btnLogin.loadTextureNormal("res/ui/bjdmj/popup/phoneLogin/" + btnLoginRes);
        this.btnZhmm.loadTextureNormal("res/ui/bjdmj/popup/phoneLogin/" + btnZhmmRes);
    },

    phoneLogin:function(phoneNum,pwd){
        if(!phoneNum){
            FloatLabelUtil.comText("请输入手机号");
            return;
        }
        if(!pwd){
            FloatLabelUtil.comText("请输入密码");
            return;
        }

        sy.login.realLogin({u:phoneNum,c:"",ps:pwd,phoneLogin:true});
    },

    //获取短信验证码
    getVerifyCode:function(type,phoneStr){

        var params = {};
        params.userId = PlayerModel.userId;
        params.phoneNum = phoneStr;//手机号

        var functionName = "getVerifyCode";
        if(type == "bind"){//绑定手机，获取验证码
            params.functionType = 1;
        }else if(type == "change_bind"){//更改绑定，获取验证码
            params.functionType = 2;
        }else if(type == "unbind"){//解除绑定,获取验证码
            functionName = "getVerifyCode1";
        }else if(type == "forget_pwd"){//忘记密码，获取验证码
            functionName = "getVerifyCode2";
        }

        var self = this;
        Network.loginReq(
            "user",functionName,params,
            function(data){
                self.phoneNum = phoneStr;
                self.countTime(60);
            },
            function(data){
                if (data.message){
                    FloatLabelUtil.comText(""+data.message);
                }
            }
        );

    },

    //验证短信验证码
    verifyCode:function(type,codeStr){

        if(!codeStr){
            FloatLabelUtil.comText("请输入验证码");
            return;
        }

        var codeType = 1;//1：绑定2：解绑，3：更改绑定，4：忘记密码（不需要传userId和sessCode字段或传空字符串）

        if(type == "bind"){//绑定手机
            codeType = 1;
        }else if(type == "change_bind"){//更改绑定
            codeType = 3;
        }else if(type == "unbind"){//解除绑定
            codeType = 2;
        }else if(type == "forget_pwd"){//忘记密码
            codeType = 4;
        }

        var params = {};
        params.userId = PlayerModel.userId;
        params.verifyCode = codeStr;//验证码
        params.codeType = codeType;
        var self = this;
        if (codeStr && codeStr != ""){
            Network.loginReq(
                "user","verifyCode",params,
                function(data){
                    
                    if (data.message){
                        FloatLabelUtil.comText(""+data.message);
                    }
                    if(type == "bind" || type == "forget_pwd"){
                        self.setLayerType(3);
                    }else if(type == "unbind"){
                        PlayerModel.phoneNum = 0;
                        self.onCloseHandler();
                    }else if(type == "change_bind"){
                        self.setLayerType(3);
                    }
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_NAME_CHANGE);
                },
                function(data){
                    
                    if (data.message){
                        FloatLabelUtil.comText(""+data.message);
                    }
                }
            );
        }
    },

    //验证密码(解绑和更改绑定前先验证密码)
    verifyPhonePw:function(passwordStr){
        var params = {};
        params.userId = PlayerModel.userId;
        params.password = passwordStr;//密码
        var self = this;
        if (passwordStr){
            Network.loginReq(
                "user","verifyPhonePw",params,
                function(data){
                    
                    if (data.message){
                        FloatLabelUtil.comText(""+data.message);
                    }
                    if(self.layerType == 5){
                        self.setLayerType(7);
                    }else if(self.layerType == 6){
                        self.setLayerType(8);
                    }
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_NAME_CHANGE);
                },
                function(data){
                    if (data.message){
                        FloatLabelUtil.comText(""+data.message);
                    }
                }
            );
        }else{
            FloatLabelUtil.comText("密码不能为空");
        }
    },

    //验证成功后上传passworld
    uploadPassword:function(passwordStr,passwordRepStr,phoneNum){
        if(!passwordStr){
            FloatLabelUtil.comText("密码不能为空");
            return;
        }
        if(passwordStr != passwordRepStr){
            FloatLabelUtil.comText("两次的密码不一致");
            return;
        }
        //if(!this.isNumberOr_Letter(passwordStr)){
        //    FloatLabelUtil.comText("密码格式错误");
        //    return;
        //}

        var params = {};
        params.userId = PlayerModel.userId;
        params.password = passwordStr;//密码
        params.phoneNum = phoneNum;//手机号
        var self = this;
        Network.loginReq(
            "user", "uploadPassword", params,
            function (data) {
                
                PhoneLoginModel.setPhone(phoneNum);
                PhoneLoginModel.setPhonePassword(passwordStr);
                PlayerModel.phoneNum = phoneNum;

                if (data.message) {
                    FloatLabelUtil.comText(data.message);
                }
                SyEventManager.dispatchEvent(SyEvent.UPDATE_NAME_CHANGE);
                self.onCloseHandler();
            },
            function (data) {
                
                if(data.code == 1340){
                    PhoneLoginModel.setPhone(phoneNum);
                    PhoneLoginModel.setPhonePassword(passwordStr);
                    PlayerModel.phoneNum = phoneNum;

                    var pop = new AwardPop(BeansConfigModel.aloneConfig.bingDingNum || 3000);
                    PopupManager.addPopup(pop);

                    self.onCloseHandler();
                }
                if (data.message) {
                    FloatLabelUtil.comText("" + data.message);
                }
            }
        );

    },

    isNumberOr_Letter:function(s){
        var regu = "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,8}$"
        var re = new RegExp(regu)
        if (re.test(s)) {
            return true;
        }else{
            return false;
        }
    },
});