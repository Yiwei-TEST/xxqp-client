/**
 * Created by zyq on 2019/12/18.
 */

var ReportPop = BasePopup.extend({
    ctor:function(){
        this._super("res/ReportPop.json");
    },

    selfRender:function(){
        UITools.addClickEvent(this.getWidget("btn_sure"), this, this.onClickSureBtn);
        UITools.addClickEvent(this.getWidget("btn_cancel"), this, this.onClickCancelBtn);

        var input_bg = this.getWidget("heidi_dizhi");
        //var input_bg = this.getWidget("heidi_neirong");
        this.emailBox = new cc.EditBox(cc.size(input_bg.width, 85),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.emailBox.x = input_bg.width/2;
        this.emailBox.y = input_bg.height/2;
        this.emailBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.emailBox.setPlaceholderFont("Arial",42);
        this.emailBox.setPlaceHolder("请输入您的邮箱");
        input_bg.addChild(this.emailBox,1);
        this.emailBox.setFont("Arial",42);

        var input_bg = this.getWidget("heidi_neirong");
        this.contentBox = new cc.EditBox(cc.size(input_bg.width-10, input_bg.height-10),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.contentBox.x = input_bg.width/2;
        this.contentBox.y = input_bg.height/2;
        this.contentBox.setPlaceholderFont("Arial",42);
        this.contentBox.setPlaceHolder("请输入举报内容");
        input_bg.addChild(this.contentBox,1);
        this.contentBox.setFont("Arial",42);

    },

    onClickSureBtn:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var email = "&email="+this.emailBox.getString()
        var content = "&content="+this.contentBox.getString()

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/Agent/player/userReport/wx_plat/mjqz?"
        url = url + char_id + rand + t + email + content + sign
        var self = this
        Network.sypost(url,"",{type:"GET"},function(data){
            FloatLabelUtil.comText(data.msg);
            self.onCloseHandler()
        }, function(data){
            FloatLabelUtil.comText(data.msg);
        })
    },

    onClickCancelBtn:function(){
        this.onCloseHandler()
    }
})
