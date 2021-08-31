/**
 * Created by Administrator on 2016/6/27.
 */
var ClubAgentProceedPop = BasePopup.extend({

    ctor: function (index,fRoot) {
        this.fRoot = fRoot;
        this.inputStr = "";
        this.index = index || 0;
        this.maxValue = this.fRoot.maxValue || 0;
        this.configId = this.fRoot.configId || 0;
        this._super("res/clubAgentProceedPop.json");
    },

    selfRender: function () {
        for(var i=0;i<=9;i++){
            var btn = this.getWidget("btn"+i);
            btn.temp = i;
            UITools.addClickEvent(btn,this,this.onClick);
        }

        this.btnd = this.getWidget("btnd");
        this.btnd.temp = ".";
        this.btnd.visible = false;
        UITools.addClickEvent(this.btnd,this,this.onClick);

        this.inputNum = this.getWidget("inputNum");
        this.inputNum.setString("");

        this.inputTip = this.getWidget("inputTip");
        this.inputTip1 = this.getWidget("inputTip1");

        var btnreset = this.getWidget("btnr");
        UITools.addClickEvent(btnreset,this,this.onReset);

        this.btnTrue = this.getWidget("btnTrue");
        UITools.addClickEvent(this.btnTrue,this,this.onTrue);

        this.showInputTip();

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
        if (this.inputStr && this.inputStr != ""){
            SyEventManager.dispatchEvent(SyEvent.UPDATA_AGENt_PROCE,{num:this.inputStr,configId:this.configId});
        }
        PopupManager.remove(this);
    },

    showInputTip:function(){
        var value = this.fRoot.myValue || 0;
        this.inputTip.setString("可分配赠送分："+value);
    },

    onReset:function(){
        this.inputNum.setString("");
        this.inputStr = "";
    },


    onClick:function(obj){
        var temp = obj.temp;
        this.inputStr = this.inputStr + temp;
        var num = Number(this.inputStr);
        if (num > this.maxValue){
            this.inputStr = this.maxValue;
        }
        this.inputNum.setString("" + this.inputStr);
    }
});