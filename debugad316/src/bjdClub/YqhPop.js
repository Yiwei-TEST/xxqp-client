/**
 * Created by cyp on 2019/3/13.
 */
var YqhPop = BasePopup.extend({
    ctor:function(){
        this._super("res/yqhPop.json");
    },

    selfRender:function(){
        var layerBg = this.getWidget("layerBg");
        this.inputBox = new cc.EditBox(cc.size(400, 80),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.setString("");
        this.inputBox.x = layerBg.width/2 -135;
        this.inputBox.y = layerBg.height/2 + 125;
        this.inputBox.setPlaceholderFont("res/font/bjdmj/fznt.ttf",42);
        this.inputBox.setPlaceHolder("请输入亲友圈ID");
        this.inputBox.setMaxLength(14);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        layerBg.addChild(this.inputBox,1);
        this.inputBox.setFont("res/font/bjdmj/fznt.ttf",42);

        UITools.addClickEvent(this.getWidget("btn_join"),this,this.onClickJoin);

        var btn_create = this.getWidget("btn_create");
        UITools.addClickEvent(btn_create,this,this.onClickCreate);
        btn_create.setVisible(PlayerModel.canCreateClub);

        this.labelTip = this.getWidget("label_tip");
        this.labelTip.setString("");

        var label_info = this.getWidget("label_info");
        label_info.setString("仅代理可以创建亲友圈\n" +
            "成为代理请联系客服微信");
    },

    onClickJoin:function(){
        cc.log("==============onClickJoin===============");

        var groupId = this.inputBox.getString();

        if(!groupId){
            FloatLabelUtil.comText("请输入亲友圈ID");
            return;
        }

        NetworkJT.loginReq("groupActionNew", "applyJoinGroup", {
            sessCode:PlayerModel.sessCode,
            groupId:groupId,
            userId:PlayerModel.userId
        }, function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);
            }
        }, function (data) {
            cc.log("onCreate::"+JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },

    onClickCreate:function(){
        //告知后台 创建俱乐部
        var self = this;
        var name = PlayerModel.userId;
        NetworkJT.loginReq("groupActionNew", "createGroup", {
            sessCode:PlayerModel.sessCode,
            groupName: name,
            userId:PlayerModel.userId,
        }, function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);
                PopupManager.remove(self);
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },
});

var YqhSqPop = BasePopup.extend({
    ctor:function(){
        this._super("res/yqhSqPop.json");
    },

    selfRender:function(){
        UITools.addClickEvent(this.getWidget("btn_sure"),this,this.onClickSure);
        UITools.addClickEvent(this.getWidget("btn_cancel"),this,this.onClickCancel);

        this.getWidget("pyq_name").setString("新人群");
        this.getWidget("qz_name").setString("新人盟主");

        var imgHead = this.getWidget("img_head");

        var sten=new cc.Sprite("res/ui/bjdmj/popup/kuang2.png");
        var clipnode = new cc.ClippingNode();
        clipnode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:imgHead.width/2,y:imgHead.height/2,alphaThreshold:0.8});
        var sprite = new cc.Sprite("res/ui/common/testIcon.png");
        sprite.setScale(imgHead.width/sprite.width);
        clipnode.addChild(sprite);
        imgHead.addChild(clipnode,1);

        cc.loader.loadImg(PlayerModel.headimgurl,{width: 252, height:252},function(error, texture){
            if(!error){
                sprite.setTexture(texture);
            }
        });


    },

    onClickSure:function(){
        this.onCloseHandler();
    },

    onClickCancel:function(){
        this.onCloseHandler();
    },
});