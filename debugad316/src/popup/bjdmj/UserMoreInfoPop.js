/**
 * Created by lww on 2019/3/11.
 */

var UserMoreInfoPop = BasePopup.extend({

    ctor: function () {
        this._super("res/userMoreInfo.json");
    },

    selfRender: function () {

        this.addCustomEvent(SyEvent.UPDATE_NAME_CHANGE,this,this.showUserData);

        this.membegImgLoad = new RemoteImageLoadQueue();
        this.scheduleUpdate();

        //头像
        var imgHead = this.imgHead = this.getWidget("img_head");
        var sexWidgets = {"Button_sex1":1,"label_sex1":1,"Button_sex2":2,"label_sex2":2};
        this.addMoreClickEvent(sexWidgets,this.onChooseSex);

        var name_btn = this.getWidget("name_btn");
        UITools.addClickEvent(name_btn,this,this.onChangeName);

        var realname_btn = this.realname_btn = this.getWidget("realname_btn");
        UITools.addClickEvent(realname_btn,this,this.onCheckID);

        var bind_btn = this.bind_btn = this.getWidget("bind_btn");
        UITools.addClickEvent(bind_btn,this,this.onBindPhone);

        var password_btn = this.getWidget("password_btn");
        password_btn.temp = 1;
        UITools.addClickEvent(password_btn,this,this.onPassWord);

        var closePsBtn = this.getWidget("closePsBtn");
        closePsBtn.temp = 2;
        UITools.addClickEvent(closePsBtn,this,this.onPassWord);

        //自定义头像
        var upload_btn = this.getWidget("upload_btn");
        UITools.addClickEvent(upload_btn,this,this.onUpLoadHead);

        //打开选择图片的界面
        var upLocalBtn = this.getWidget("local_btn");
        upLocalBtn.temp = 1;
        UITools.addClickEvent(upLocalBtn,this,this.onCloseIconMask);

        var gb_btn = this.getWidget("gb_btn");
        gb_btn.temp = 2;
        UITools.addClickEvent(gb_btn,this,this.onCloseIconMask);

        var upTrueBtn = this.getWidget("upTrueBtn");
        UITools.addClickEvent(upTrueBtn,this,this.onUpTrue);

        var psTrueBtn = this.getWidget("psTrueBtn");
        UITools.addClickEvent(psTrueBtn,this,this.onChangePs);

        this.ScrollView_icon = this.getWidget("ScrollView_icon");
        this.ScrollView_icon.setBounceEnabled(false);
        this.scrollIconItem = ccui.helper.seekWidgetByName(this.ScrollView_icon,"iconItem");
        this.scrollIconItem.retain();
        this.scrollIconItem.setVisible(false);

        this.label_realname = this.getWidget("label_realname");
        this.label_realname.setString("未设置");

        this.iconMask = this.getWidget("IconMask");
        this.iconMask.visible = false;

        this.passMask = this.getWidget("passMask");
        this.passMask.visible = false;

        var input_name = this.getWidget("input_name");
        this.inputBox1 = new cc.EditBox(cc.size(input_name.width - 20, 72),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox1.x = input_name.width/2;
        this.inputBox1.y = input_name.height/2;
        this.inputBox1.setPlaceholderFont("Arial",45);
        this.inputBox1.setPlaceHolder("请输入名字");
        this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        input_name.addChild(this.inputBox1,1);
        this.inputBox1.setFont("Arial",45);


        var input_pwbg1 = this.getWidget("input_pwbg1");
        this.inputOldPw = new cc.EditBox(cc.size(input_pwbg1.width - 20, 72),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputOldPw.x = input_pwbg1.width/2;
        this.inputOldPw.y = input_pwbg1.height/2;
        this.inputOldPw.setPlaceholderFont("Arial",45);
        this.inputOldPw.setPlaceHolder("请输入原密码");
        this.inputOldPw.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        input_pwbg1.addChild(this.inputOldPw,1);
        this.inputOldPw.setFont("Arial",45);

        var input_pwbg2 = this.getWidget("input_pwbg2");
        this.inputPw = new cc.EditBox(cc.size(input_pwbg2.width - 20, 72),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputPw.x = input_pwbg2.width/2;
        this.inputPw.y = input_pwbg2.height/2;
        this.inputPw.setPlaceholderFont("Arial",45);
        this.inputPw.setPlaceHolder("请输入新密码");
        this.inputPw.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        input_pwbg2.addChild(this.inputPw,1);
        this.inputPw.setFont("Arial",45);

        this.showUserData();
        this.initScrollView();

    },


    showUserData:function(){
        cc.log("***************************showUserData",PlayerModel.phoneNum)
        this.showIcon(this.imgHead,PlayerModel.headimgurl,1);
        this.headimgurl = PlayerModel.headimgurl;
        this.getWidget("label_name").setString("");
        this.inputBox1.setString(PlayerModel.name);
        this.curName = PlayerModel.name;
        this.getWidget("label_password").setString("已设置");
        this.getWidget("label_id").setString(PlayerModel.userId);
        this.getWidget("label_bind").setString(PlayerModel.phoneNum ? "已绑定" : "未设置");
        this.bind_btn.loadTextureNormal(PlayerModel.phoneNum ? "res/ui/bjdmj/popup/userMoreInfo/userInfo_12.png" : "res/ui/bjdmj/popup/userMoreInfo/userInfo_2.png");
        this.displaySex();
        this.onSearch();
    },

    showIcon: function (imgNode,iconUrl, sex) {
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";
        var spr = imgNode.getChildByName("icon_spr");
        if(!spr){
            spr = new cc.Sprite(defaultimg);
            spr.setName("icon_spr");
            spr.setPosition(imgNode.width/2,imgNode.height/2);
            spr.setScale(imgNode.width/spr.width -0.1);
            imgNode.addChild(spr);
        }
        if (iconUrl) {
            this.membegImgLoad.push(iconUrl, function (img) {
                spr.setTexture(img);
                spr.setScale(imgNode.width/spr.width -0.1);
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onSearch:function(){
        var self =  this;
        NetworkJT.loginReq("user", "queryUserMsg", {userId:PlayerModel.userId}, function (data) {
            if (data) {
                cc.log("queryUserMsg::"+JSON.stringify(data));
                if (data.message) {
                    if (data.message.length >= 2) {
                        self.label_realname.setString("已设置");
                        self.realname_btn.visible = false;
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            //PopupManager.remove(self);
        });
    },

    initScrollView:function(){
        this.curIconBtnArr = [];
        var icomLength = 30;
        var roomItemWidth = this.scrollIconItem.width;
        var roomItemHeight = this.scrollIconItem.height;
        var tempW = roomItemWidth + 30;
        var tempH = roomItemHeight + 10;
        var ScrollH = Math.floor(icomLength/4 + 1) * (tempH) + 15;
        var contentH = Math.max(this.ScrollView_icon.height,ScrollH);
        this.ScrollView_icon.setInnerContainerSize(cc.size(this.ScrollView_icon.width,contentH));
        var startY = contentH - roomItemHeight/2 -10;
        var startX = roomItemWidth/2 + 30;

        for(var i = 0;i < icomLength;++i){
            var iconItem = this.scrollIconItem.clone();
            var iconSelectImg = iconItem.getChildByName("iconSelectImg");
            iconSelectImg.visible = false;
            iconItem.rTemp = i + 1;
            var headimgurl = "res/res_icon/" + iconItem.rTemp + ".png";
            iconItem.rHeadimgurl= headimgurl;
            this.showIcon(iconItem,headimgurl,1);
            this.curIconBtnArr[i] = iconItem;
            UITools.addClickEvent(iconItem, this , this.onClickItemIcon);
            iconItem.setVisible(true);
            iconItem.x = startX + Math.floor(i%4) * tempW;
            iconItem.y = startY - Math.floor(i/4) * tempH;
            this.ScrollView_icon.addChild(iconItem);
        }

    },

    onClickItemIcon:function(obj){
        for(var i = 0;i< this.curIconBtnArr.length;++i) {
            var item = this.curIconBtnArr[i];
            var isBright = false;
            if (obj.rTemp == item.rTemp){
                isBright = true;
            }
            var iconSelectImg = item.getChildByName("iconSelectImg");
            iconSelectImg.visible = isBright;
        }
        this.chooseImgurl = obj.rHeadimgurl;
    },

    onChangeInfo:function(status){
        //status 1性别 2名字 3 头像 4 修改密码
        // var headimgurl = PlayerModel.headimgurl;
        var sex = this.getWidget("Button_sex1").isBright() ? 1 : 2;
        var headimgurl = this.headimgurl;
        var name = this.inputBox1.getString();
        var params = {
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
        }
        if (status == 1){
            params.sex = sex;
            if (sex == PlayerModel.sex){
                return;
            }
        }else if (status == 2){
            if (name == PlayerModel.name){
                FloatLabelUtil.comText("修改失败,昵称没有改变!");
                return;
            }else if(name==""){
                FloatLabelUtil.comText("修改失败,昵称不能为空!");
                return;
            }
            params.nickName = name;
        }else if (status == 3){
            params.headimgurl = headimgurl;
        }else if (status == 4){
            var pw = this.inputPw.getString();
            var oldPw = this.inputOldPw.getString();
            if(oldPw == ""){
                FloatLabelUtil.comText("修改失败,原密码不能为空!");
                return;
            }else if (pw == ""){
                FloatLabelUtil.comText("修改失败,新密码不能为空!");
                return;
            }
            params.pw  = pw;
            params.oldPw  = oldPw;
        }
        cc.log("params===",params)
        var self = this;
        NetworkJT.loginReq("user", "updateUser", params, function (data) {
            if (data) {
                cc.log("updateUser::"+JSON.stringify(data));
                FloatLabelUtil.comText("修改成功");
                PlayerModel.name = name;
                PlayerModel.sex = sex;
                SyEventManager.dispatchEvent(SyEvent.UPDATE_NAME_CHANGE);
                // self.showUserData();
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onChooseSex:function(obj){
        var temp = obj.temp;
        for(var i = 1;i <= 2;++i){
            var isChoose = temp == i;
            this.getWidget("Button_sex"+i).setBright(isChoose);
            this.getWidget("label_sex"+i).setColor(isChoose ? cc.color(21,158,179) : cc.color(168,135,90));
        }
        this.onChangeInfo(1);
    },

    displaySex:function(){
        var temp = PlayerModel.sex || 1;
        for(var i = 1;i <= 2;++i){
            var isChoose = temp == i;
            this.getWidget("Button_sex"+i).setBright(isChoose);
            this.getWidget("label_sex"+i).setColor(isChoose ? cc.color(21,158,179) : cc.color(168,135,90));
        }
    },

    onChangeName:function(){
        this.onChangeInfo(2);
    },

    onCheckID:function(){
        var pop = new CheckIdCardPop();
        PopupManager.addPopup(pop);
    },

    onBindPhone:function () {
        cc.log("PlayerModel.phoneNum===",PlayerModel.phoneNum)
        if(!PlayerModel.phoneNum){
            var mc = new PhoneLoginPop(2);
            PopupManager.addPopup(mc);
        }else{
            var mc = new PhoneLoginPop(5);
            PopupManager.addPopup(mc);
        }
    },

    onPassWord:function(obj){
        this.passMask.visible = obj.temp == 1;
    },

    onUpLoadHead:function(){
        var url = "http://bjdqp.firstmjq.club/Upload/index?";
        var playType = 1060;
        var plat = "plat=" + playType;
        var id = "&id=" + PlayerModel.userId;
        var t = "&time=" + Math.round(new Date().getTime()/1000).toString();
        var key = "fgfklfghutrfj52bjdcnfsdfddszhjlimsamcn";
        var sign = "&sign=" + Base64.encode(md5(Math.round(new Date().getTime()/1000).toString()  + "|" + PlayerModel.userId + "|" + playType + "|" + key));
        url = url + plat + id + t + sign;
        SdkUtil.sdkOpenUrl(url);

        // var url = "http://bjdqp.firstmjq.club/Upload/index?";
        // var playType = 1060;
        // var plat = "plat=" + playType;
        // var id = "&id=" + PlayerModel.userId;
        // var t = "&time=" + Math.round(new Date().getTime()/1000).toString();
        // var key = "fgfklfghutrfj52bjdcnfsdfddszhjlimsamcn";
        // var sign = "&sign=" + Base64.encode(md5(Math.round(new Date().getTime()/1000).toString()  + "|" + PlayerModel.userId + "|" + playType + "|" + key));
        // url = url + plat + id + t + sign;
        // SdkUtil.sdkOpenUrl(url);
    },




    update: function(dt) {
        this.membegImgLoad.update(dt);
    },

    onUpTrue:function(){
        this.headimgurl = this.chooseImgurl;
        this.onChangeInfo(3);
    },

    onChangePs:function(){
        this.onChangeInfo(4);
    },

    onCloseIconMask:function(obj){
        this.iconMask.visible = obj.temp == 1;
    },

    onCloseHandler:function(){
        this.membegImgLoad.stopLoad();
        this.unscheduleUpdate();
        PopupManager.remove(this);
    }



});
