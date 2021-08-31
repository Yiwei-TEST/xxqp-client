/**
 * Created by Administrator on 2016/6/27.
 */
var ClubCreditRatioPop = BasePopup.extend({

    ctor: function (fRoot,optType) {
        this.optType = optType
        this.fRoot = fRoot;

        this.myRate = MathUtil.toDecimal(this.fRoot.myRate || 100);
        this.TeamRatio = MathUtil.toDecimal(this.fRoot.teamRadit || 0);
        this.GroupRatio = MathUtil.toDecimal(this.myRate - this.TeamRatio);
        this.teamKeyId = this.fRoot.opUserId || 0;
        this.teamStr = "";

        cc.log("ClubCreditRatioPop==",this.myRate);
        this._super("res/clubCreditRatioPop.json");
    },

    selfRender: function () {

        for(var i=0;i<=9;i++){
            var btn = this.getWidget("Button_num"+i);
            btn.temp = i;
            UITools.addClickEvent(btn,this,this.onClick);
        }

        this.btnd = this.getWidget("Button_num10");
        this.btnd.temp = ".";
        UITools.addClickEvent(this.btnd,this,this.onClick);
        if(this.optType == 1){
            this.btnd.visible = true;
        }else if(this.optType == 2){
            this.btnd.visible = false;
        }

        var btnreset = this.getWidget("Button_num11");
        UITools.addClickEvent(btnreset,this,this.onReset);

        this.Labal_ratio1 = this.getWidget("Labal_ratio1");
        this.Labal_ratio2 = this.getWidget("Labal_ratio2");


        this.btnTrue = this.getWidget("btnTrue");
        UITools.addClickEvent(this.btnTrue,this,this.onTrue);

        //var clearBtn = this.getWidget("Button_clear");
        //clearBtn.visible = false;
        //UITools.addClickEvent(clearBtn,this,this.onClear);

        this.initRadio();

    },

    initRadio:function(){
        //this.teamStr = ""+this.TeamRatio;
        this.Labal_ratio1.setString(""+this.GroupRatio);
        this.Labal_ratio2.setString(""+this.TeamRatio);
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

    onClick:function(obj){
        var temp = obj.temp;
        var teamStr = this.teamStr + "" + temp ;
        var notError = true;
        if (this.isNumberOrCharacter(teamStr) && teamStr.length >= 2 && Number(teamStr) == 0){
            notError = false;
        }
        if (notError && this.validationNumber(teamStr,2)){
            this.teamStr = this.teamStr + "" + temp;
            //this.teamStr = this.teamStr  + temp;
        }else{
            //FloatLabelUtil.comText("输入的必须为整数或者小数最多两位");
            return;
        }
        if (Number(this.teamStr) > this.myRate){
            if(Number(temp) <= this.myRate){
                this.teamStr = temp;
            }else{
                this.teamStr = this.myRate;
            }
        }
        var num = Number(this.teamStr);
        this.TeamRatio = MathUtil.toDecimal(num);
        this.GroupRatio = MathUtil.toDecimal(this.myRate - num);
        //cc.log("onClick======",this.TeamRatio,this.GroupRatio);
        this.initRadio();
    },

    /**
     * 获取小组信息
     * 1、userId：调用接口的用户id
     *2、sessCode：调用接口的用户sessCode
     *3、groupId：俱乐部Id
     */
    onChangeRatio:function(){
        var self = this;
        NetworkJT.loginReq("groupCreditAction", "updateCommissionRate", {
            userId:PlayerModel.userId ,
            targetUserId:self.teamKeyId,
            groupId:ClickClubModel.getCurClubId(),
            commissionRate:self.TeamRatio,
            sessCode:PlayerModel.sessCode,
        }, function (data) {
            if (data) {
                if(self){
                    SyEventManager.dispatchEvent(SyEvent.UPDATA_CREDIT_RATIO);
                    FloatLabelUtil.comText("修改成功");
                    PopupManager.remove(self);
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            PopupManager.remove(self);
        });
    },

    onReset:function(){
        //this.initRadio();
        this.teamStr = "";
        var myRate = this.fRoot.myRate || 100;
        var TeamRatio = this.fRoot.teamRadit || 0;
        var GroupRatio = myRate - TeamRatio;
        this.Labal_ratio1.setString("" + GroupRatio);
        this.Labal_ratio2.setString("" + TeamRatio);
    },

    onTrue:function(){
        //this.onChangeRatio();
        SyEventManager.dispatchEvent("sy_change_credit_radio",{idx:this.fRoot.idx,credit:this.TeamRatio});
        PopupManager.remove(this);
    },

    onClear:function(){

    },

});