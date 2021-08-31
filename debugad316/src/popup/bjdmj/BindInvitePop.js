/**22
 * Created by cyp on 2019/4/10.
 */
var BindInvitePop = BasePopup.extend({
    defaultCode:"",
    ctor:function(defaultCode){

        this.defaultCode = defaultCode;

        this._super("res/bindInvitePop.json");

    },

    selfRender:function(){
        var input_bg = this.getWidget("input_bg");

        this.inputCode = new cc.EditBox(cc.size(input_bg.width, input_bg.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputCode.x = input_bg.width/2;
        this.inputCode.y = input_bg.height/2;
        this.inputCode.setFont("Arial",40);
        this.inputCode.setMaxLength(15);
        this.inputCode.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputCode.setPlaceHolder("请输入邀请码");
        this.inputCode.setPlaceholderFont("Arial" , 40);
        input_bg.addChild(this.inputCode,1);

        this.inputCode.setString(this.defaultCode || PlayerModel.payBindId);

        var btn_bind = this.getWidget("btn_bind");

        UITools.addClickEvent(btn_bind,this,this.onClickBindBtn);

    },

    onClickBindBtn:function(){
        cc.log("============onClickBindBtn=============");
        var code = this.inputCode.getString();
        if(!code){
            FloatLabelUtil.comText("请输入邀请码");
            return;
        }
        var self = this;
        var func = function(){
            PlayerModel.payBindId = code+"";
            self.onCloseHandler();
            PlayerModel.isHasBind = false;
            SyEventManager.dispatchEvent("Set_Agent_button");
        }
        var url = "http://agent.kdttd7.cn/api/index/bind_agent?package=jnqp";
        var param = {userId:PlayerModel.userId,payBindId:code,time:new Date().getTime()};
        sy.scene.showLoading("正在检测");
        Network.requestHttp(url,param,func)

        //
        // var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","bindInviteId");
        // Network.sypost(url,"bindInviteId",
        //     {userId:PlayerModel.username,flatId:PlayerModel.username,payBindId:code,pf:PlayerModel.pf},
        //     function(data){
        //         sy.scene.hideLoading();
        //         PlayerModel.payBindId=code+"";
        //         self.onCloseHandler();
        //         FloatLabelUtil.comText("绑定成功");
        //         PlayerModel.isHasBind = false;
        //         SyEventManager.dispatchEvent("Set_Agent_button");
        //     },function(data){
        //         sy.scene.hideLoading();
        //         if(data.code==-2){//已经绑定过
        //             return FloatLabelUtil.comText("已经绑定");
        //         }
        //         if(data.msg){
        //             FloatLabelUtil.comText(data.msg);
        //         }else{
        //             FloatLabelUtil.comText("检测失败");
        //         }
        //     }
        // );
    }
});