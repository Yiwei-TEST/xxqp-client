/**
 * Created by Administrator on 2016/6/27.
 */
var ClubCreditInputPop = BasePopup.extend({

    ctor: function (index,fRoot,bPoint) {
        this.bPoint = bPoint;//是否去掉小数点
        this.fRoot = fRoot;
        this.inputStr = "";
        this.index = index || 0;
        this._super("res/clubCreditInputPop.json");
    },

    selfRender: function () {

        for(var i=0;i<=9;i++){
            var btn = this.getWidget("btn"+i);
            btn.temp = i;
            UITools.addClickEvent(btn,this,this.onClick);
        }


        this.btnd = this.getWidget("btnd");
        this.btnd.temp = ".";
        UITools.addClickEvent(this.btnd,this,this.onClick);
        this.btnd.visible = !this.bPoint

        this.inputNum = this.getWidget("inputNum");
        this.inputNum.setString("");

        this.inputTip = this.getWidget("inputTip");

        this.userData = this.getWidget("userData");
        this.userData.visible = false;

        if(this.index == 5 || this.index == 6){
            if(!this.fRoot){
                return;
            }
            this.userData.visible = true;
            this.showIcon(this.fRoot.headimgurl,1);
            this.userData.getChildByName("Label_myName").setString(this.fRoot.Label_name.string);
            this.userData.getChildByName("Label_myId").setString(this.fRoot.Label_id.string);
            this.userData.getChildByName("Label_myScore").setVisible(true);
            this.userData.getChildByName("Label_myScore").setString("比赛分:" +this.fRoot.Label_score.string);
            
        }else{
            this.inputTip.y += 100;
            this.getWidget("Image_bg").y += 100;
            this.userData.getChildByName("Label_myScore").setVisible(false);
        }

        var btnreset = this.getWidget("btnr");
        UITools.addClickEvent(btnreset,this,this.onReset);

        this.btnTrue = this.getWidget("btnTrue");
        UITools.addClickEvent(this.btnTrue,this,this.onTrue);

        this.showInputTip();

    },

    showIcon: function (iconUrl, sex) {
        var icon = this.userData.getChildByName("Image_head");
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if(icon.curShowIconUrl == null || (icon.curShowIconUrl != iconUrl)) {//头像不同才加载
            if (icon.getChildByTag(345)) {
                icon.removeChildByTag(345);
            }

            var sprite = new cc.Sprite(defaultimg);
            sprite.x = icon.width * 0.5;
            sprite.y = icon.height * 0.5;
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
    },

    //最多保留两位小数
    isNumberOr_Letter:function(str){
        var regu = "/^(-?\d+)(\.\d{1,2})?$/";
        var re = new RegExp(regu)
        if (re.test(str)) {
            return true;
        }else{
            return false;
        }
    },


    validationNumber:function(value, num) {
        var regu = /^[0-9]+\.?[0-9]*$/;
        var notError = true;
        if (value != "") {
            if (!regu.test(value)) {
                notError = false;
            } else {
                if (num == 0) {
                    if (value.indexOf('.') > -1) {
                        notError = false;
                    }
                }
                if (value.indexOf('.') > -1) {
                    if (value.split('.')[1].length > num) {
                        notError = false;
                    }
                }
            }
        }
        return notError;
    },

    /**
     * ---------------------
     *作者：o向阳花o
     *来源：CSDN
     *原文：https://blog.csdn.net/w_han__/article/details/78048757
     *版权声明：本文为博主原创文章，转载请附上博文链接！
     **/
    isNumberOrCharacter: function(_string) {
        var charecterCount = 0;
        for(var i=0; i < _string.length; i++){
            var character = _string.substr(i,1);
            var temp = character.charCodeAt();
            if (48 <= temp && temp <= 57){

            }else if(temp == 88){
                charecterCount += 1;
            }else if(temp == 120){
                charecterCount += 1;
            }else{
                return false;
            }
        }
        if(charecterCount <= 1){
            return true
        }
    },

    onTrue:function(){
        if (this.index == 5 || this.index == 6){
            if (this.fRoot){
                var num = Math.round(this.inputStr * 100);
                this.fRoot.upDateCreditNum({temp:this.index,num:num})
            }
        }else{
            SyEventManager.dispatchEvent(SyEvent.UPDATA_CREDIT_NUM,{temp:this.index,num:this.inputStr});
        }
        PopupManager.remove(this);
    },

    showInputTip:function(){
        var str = "";
        if (this.index == 1){
            str = "请输入最低比赛分";
        }else if (this.index == 2){
            str = "请输入最低踢出分";
        }else if (this.index == 3){
            str = "请输入赠送分";
        }else if (this.index == 4){
            str = "请输入底分";
        }else if (this.index == 5){
            str = "请输入增加的比赛分";
        }else if (this.index == 6){
            str = "请输入减少的比赛分";
        }else if (this.index == 7){
            str = "请输入赠送初始分";
        }else if (this.index == 8){
            str = "请输入倍数";
        }else if (this.index == 9){
            str = "请输入倍率";
        }else if (this.index == 31){
            str = "赠送区间1";
        }else if (this.index == 32){
            str = "保底值1";
        }else if (this.index == 33){
            str = "赠送区间2";
        }else if (this.index == 34){
            str = "保底值2";
        }else if (this.index == 35){
            str = "保底值3";
        }else if (this.index == 36){
            str = "请输入洗牌扣分";
        }
        this.inputTip.setString(""+str);
    },

    onReset:function(){
        this.inputNum.setString("");
        this.inputStr = "";
    },


    onClick:function(obj){
        var temp = obj.temp;
        var inputStr = this.inputStr + temp;

        var notError = true;
        if (this.isNumberOrCharacter(inputStr) && inputStr.length >= 2 && Number(inputStr) == 0){
            notError = false;
        }
        if (notError && this.validationNumber(inputStr,2)){
            this.inputStr = this.inputStr + temp;
            this.inputNum.setString("" + this.inputStr);
        //}else{
        //    FloatLabelUtil.comText("输入的必须为整数或者小数最多两位");
        }

    }
});