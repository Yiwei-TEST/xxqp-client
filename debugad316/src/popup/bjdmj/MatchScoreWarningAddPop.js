
var MatchScoreWarningAddPop = BasePopup.extend({
    ctor:function(type,isOpen,userId){
        this.type = type || 1;
        this.isOpen = isOpen || 0;
        this.userId = userId || "";
        this._super("res/MatchScoreWarningAddPop.json");
    },

    selfRender:function(){
        var Image_6 = this.getWidget("Image_6");
        this.inputNum = new cc.EditBox(cc.size(Image_6.width - 20, Image_6.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputNum.setPosition(Image_6.width / 2, Image_6.height / 2);
        this.inputNum.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputNum.setMaxLength(7);
        this.inputNum.setFont("Arial", 45);
        this.inputNum.setDelegate(this);
        this.inputNum.setPlaceHolder("请输入玩家ID");
        if(this.type == 2){
            this.inputNum.setPlaceHolder("请输入预警分");
            this.inputNum.setMaxLength(10);
        }
        this.inputNum.setPlaceholderFont("Arial", 45);
        Image_6.addChild(this.inputNum, 1);


        var btn_confirm = this.getWidget("Button_confirm");
        UITools.addClickEvent(btn_confirm, this, this.onButtonAdd);

        var btn_cancel = this.getWidget("Button_cancel");
        UITools.addClickEvent(btn_cancel, this, this.onCloseHandler);

        this.setExplain();
    },

    setExplain:function () {
        if (this.type == 1){
            this.getWidget("label_explain").setString("添加成员");
        }else if(this.type == 2){
            this.getWidget("label_explain").setString("预警分");
        }     
    },

    onButtonAdd:function(){
        var Id = this.inputNum.getString();
        if (!Id) {
            if (type_int == 1){
                FloatLabelUtil.comText("请输入玩家ID");
            }else{
                FloatLabelUtil.comText("请输入预警分数");
            }
            return;
        }
        var type_int = parseInt(this.type);
        // cc.log("this.type ==",this.type);
        cc.log("this.isOpen ==",this.isOpen);

        var str = "";
        if(type_int == 1){
            var self = this;
            NetworkJT.loginReq("groupActionNew", "addGroupWarn", {
                groupId: ClickClubModel.getCurClubId(),
                userId: PlayerModel.userId, 
                sessCode: PlayerModel.sessCode,
                targetUserId:Id,
            }, function (data) {
                if (data) {
                    if (data.message.groupWarnList.length > 0) {//获取当前页 有数据的情况
                        SyEventManager.dispatchEvent(SyEvent.MATCHSCOREWARNING_ADD_USER, data.message.groupWarnList[0]);
                        FloatLabelUtil.comText("添加成员成功");
                        PopupManager.remove(self);
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                    }
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        } else if (type_int == 2) {
            var self = this;
            NetworkJT.loginReq("groupActionNew", "updateGroupWarn", {
                groupId: ClickClubModel.getCurClubId(),
                userId: PlayerModel.userId,
                sessCode: PlayerModel.sessCode,
                targetUserId: this.userId,
                warnScore: Id,
                warnSwitch: this.isOpen,
            }, function (data) {
                if (data) {
                    if (data.message.groupWarnList.length > 0) {//获取当前页 有数据的情况
                        SyEventManager.dispatchEvent(SyEvent.MATCHSCOREWARNING_MODIFY_WARNINGSCORE, data.message.groupWarnList[0]);
                        FloatLabelUtil.comText("预警分修改成功");
                        PopupManager.remove(self);
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                    }
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            }); 
        }
    },
}); 