/**
 * Created by cyp on 2019/3/19.
 */
var PyqSet = BasePopup.extend({
    layerType:1,
    show_version:true,
    ctor:function(layerType){

        this.layerType = layerType || 1;

        this.clubBgType = cc.sys.localStorage.getItem("sy_club_bg_type") || 1;

        this._super("res/pyqSet.json");
    },

    selfRender:function(){
        this.panel_1 = this.getWidget("panel_1");
        this.panel_2 = this.getWidget("panel_2");
        this.panel_3 = this.getWidget("panel_3");

        this.panel_2.setVisible(false);
        this.panel_3.setVisible(false);
        this.panel_1.setVisible(this.layerType == 1);

        UITools.addClickEvent(this.getWidget("btn_xggg"),this,this.onClickChangeGg);
        UITools.addClickEvent(this.getWidget("btn_xgmc"),this,this.onClickChangeName);
        UITools.addClickEvent(this.getWidget("btn_szxhw"),this,this.onClickXhw);
        UITools.addClickEvent(this.getWidget("btn_guanbi"),this,this.onClickGuanbi);
        this.getWidget("btn_gps_limit").temp = 1;
        this.getWidget("btn_guanbi_gps").temp = 2;
        UITools.addClickEvent(this.getWidget("btn_gps_limit"),this,this.onClickGpsLimit);
        UITools.addClickEvent(this.getWidget("btn_guanbi_gps"),this,this.onClickGpsLimit);

        this.getWidget("btn_gps_limit").visible = ClickClubModel.isClubCreaterOrLeader();

        //是否选择禁止
        var widgetForbit = {"btn_forbit_ip" : 7, "btn_forbit_gps" : 8 ,"btn_forbit_distance":9,"btn_fzb_hide":103};
        this.addDtzClickEvent(widgetForbit , this.onClickForbit);
        this.btn_fzb_hide.visible = false;

        this.btn_bg_1 = this.getWidget("btn_bg_1");
        this.btn_bg_2 = this.getWidget("btn_bg_2");
        this.btn_bg_3 = this.getWidget("btn_bg_3");

        this.btn_bg_1.setTag(1);
        this.btn_bg_2.setTag(2);
        this.btn_bg_3.setTag(3);

        UITools.addClickEvent(this.btn_bg_1,this,this.onClickBgChange);
        UITools.addClickEvent(this.btn_bg_2,this,this.onClickBgChange);
        UITools.addClickEvent(this.btn_bg_3,this,this.onClickBgChange);

        this.updateBgBtnState();

        this.btn_auto_room = this.getWidget("btn_auto_room");
        this.btn_refuse_invite = this.getWidget("btn_refuse_invite");
        this.btn_allow_yuyin = this.getWidget("btn_allow_yuyin");
        this.btn_allow_negative = this.getWidget("btn_allow_negative");
        this.btn_pause_create_room = this.getWidget("btn_pause_create_room");
        this.btn_empty_order = this.getWidget("btn_empty_order");
        this.btn_jiesan = this.getWidget("btn_jiesan");
        this.btn_tuichu = this.getWidget("btn_tuichu");
        this.btn_forbid_invite = this.getWidget("btn_forbid_invite");/** 新加亲友圈邀请设置 **/
        this.btn_forbid_invite = this.getWidget("btn_forbid_invite");
        this.btn_allow_private = this.getWidget("btn_allow_private");
        this.btn_allow_private.visible = false;

        var nameArr = ["btn_no_tichu","btn_tichu_2","btn_tichu_3","btn_tichu_5"];
        this.btnAutoTimeArr = [];
        for(var i = 0;i<nameArr.length;++i){
            var btn = this.getWidget(nameArr[i]);
            UITools.addClickEvent(btn,this,this.onClickAutoTimeBtn);
            this.btnAutoTimeArr[i] = btn;
        }

        if(ClickClubModel.getCurClubRole() != 0){
            this.btn_jiesan.loadTextureNormal("res/ui/bjdmj/popup/pyq/shezhi/jiesanwodefangjian.png",ccui.Widget.LOCAL_TEXTURE);
        }

        UITools.addClickEvent(this.btn_auto_room,this,this.onClickAutoRoom);
        UITools.addClickEvent(this.btn_refuse_invite,this,this.onClickRefuseInvite);
        UITools.addClickEvent(this.btn_allow_yuyin,this,this.onChangeVioiceAndProps);
        UITools.addClickEvent(this.btn_allow_negative,this,this.onChangeNegativeCredit);
        UITools.addClickEvent(this.btn_pause_create_room,this,this.onClickPauseCreateRoom);
        UITools.addClickEvent(this.btn_empty_order,this,this.onClickEmptyOrder);
        UITools.addClickEvent(this.btn_jiesan,this,this.onClickJiesan);
        UITools.addClickEvent(this.btn_tuichu,this,this.onClickTuichu);
        UITools.addClickEvent(this.btn_forbid_invite,this,this.onClickForbidInvite);
        UITools.addClickEvent(this.btn_allow_private,this,this.onChangePrivate);

        this.btn_xxzdsf = this.getWidget("btn_xxzdsf");
        UITools.addClickEvent(this.btn_xxzdsf,this,this.onClickXxzdsf);

        var input_bg1 = this.getWidget("input_bg1");
        var input_bg2 = this.getWidget("input_bg2");

        this.inputBox1 = new cc.EditBox(cc.size(input_bg1.width - 20, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox1.x = input_bg1.width/2;
        this.inputBox1.y = input_bg1.height/2;
        this.inputBox1.setPlaceholderFont("Arial",36);
        this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputBox1.setPlaceHolder("请输入亲友圈名称");
        input_bg1.addChild(this.inputBox1,1);
        this.inputBox1.setFont("Arial",36);

        this.inputBox1.setString(ClickClubModel.getCurClubName());

        this.inputBox2 = new cc.EditBox(cc.size(input_bg2.width - 16, input_bg2.height - 16),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox2.x = input_bg2.width/2;
        this.inputBox2.y = input_bg2.height/2;
        this.inputBox2.setDelegate(this);
        this.inputBox2.setPlaceholderFont("Arial",36);
        this.inputBox2.setPlaceHolder("请输入亲友圈公告");
        input_bg2.addChild(this.inputBox2,1);
        this.inputBox2.setFont("Arial",36);

        this.inputBox2.setString(ClickClubModel.getClubGongGao());

        var bg_kjzs_input = this.getWidget("bg_kjzs_input");
        bg_kjzs_input.visible = this.getWidget("txt_cdtlj_kjzs").visible = false;
        this.box_kjzs = new cc.EditBox(cc.size(bg_kjzs_input.width - 20, bg_kjzs_input.height - 15),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.box_kjzs.x = bg_kjzs_input.width/2;
        this.box_kjzs.y = bg_kjzs_input.height/2;
        this.box_kjzs.setDelegate(this);
        this.box_kjzs.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.box_kjzs.setMaxLength(4);
        this.box_kjzs.setPlaceHolder("输入桌数");
        bg_kjzs_input.addChild(this.box_kjzs,1);
        this.box_kjzs.setFont("Arial",36);

        var countSet = this.panel_1.getChildByName("countSet");
        this.select_button1 = countSet.getChildByName("select_button1");
        this.select_button2 = countSet.getChildByName("select_button2");
        UITools.addClickEvent(this.select_button1,this,this.onClickSelectCountBtn);
        UITools.addClickEvent(this.select_button2,this,this.onClickSelectCountBtn);
        var input_count = countSet.getChildByName("input_count");
        this.input_countBox = new cc.EditBox(cc.size(input_count.width - 16, input_count.height - 16),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.input_countBox.x = input_count.width/2;
        this.input_countBox.y = input_count.height/2;
        this.input_countBox.setPlaceholderFont("Arial",36);
        this.input_countBox.setString("1");
        this.input_countBox.setDelegate(this);
        input_count.addChild(this.input_countBox,1);
        this.input_count = input_count;
        this.input_countBox.setFont("Arial",36);
        this.input_countBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);

        if(!ClickClubModel.isClubCreaterOrLeader()){
            this.inputBox1.setTouchEnabled(false);
            this.inputBox2.setTouchEnabled(false);
        }

        if(ClickClubModel.getDismissCount() != "0"){
            this.input_countBox.setString(ClickClubModel.getDismissCount());
        }

        var contentNode = new cc.Node();
        contentNode.setPosition(this.panel_1.convertToNodeSpace(cc.p(cc.winSize.width/2 + 460,100)));
        this.panel_1.addChild(contentNode,10);

        var tipBg = new cc.Scale9Sprite("res/ui/bjdmj/di.png");
        tipBg.setContentSize(cc.size(450,150));
        tipBg.setPosition(-230,80);
        tipBg.setVisible(false);
        contentNode.addChild(tipBg,1);

        var str = "整局牌桌每人限定可发起解散次数，达到上限后不可再发起解散";
        var tipLabel = new ccui.Text(str,"res/font/bjdmj/fznt.ttf",36);
        tipLabel.setTextAreaSize(cc.size(tipBg.width-40,tipBg.height-20));
        tipLabel.setColor(cc.color(129,49,0));
        tipLabel.setPosition(tipBg.width/2,tipBg.height/2);
        tipBg.addChild(tipLabel);

        var tipBtn = UICtor.cBtn("res/ui/bjdmj/popup/pyq/bisai/wenhao.png");
        UITools.addClickEvent(tipBtn,this,function(){
            tipBg.setVisible(!tipBg.isVisible());
        });
        tipBtn.setPosition(-240,180);
        contentNode.addChild(tipBtn);

        var layerBg = this.getWidget("layerBg");
        layerBg.addTouchEventListener(function(){
            tipBg.setVisible(false);//背景上注册关闭事件
        },this);

        var img = "res/ui/bjdmj/popup/pyq/shezhi/di.png";
        var btn_qztc = new ccui.Button(img,img,"");
        btn_qztc.ignoreContentAdaptWithSize(false);
        btn_qztc.setScale9Enabled(true);
        btn_qztc.setContentSize(360,100);
        btn_qztc.setOpacity(0);
        btn_qztc.setPosition(this.btn_allow_negative.x,this.btn_xxzdsf.y);
        this.panel_1.addChild(btn_qztc);

        UITools.addClickEvent(btn_qztc,this,this.onClickQztc);

        var img1 = "res/ui/createRoom/createroom_btn_fang_1.png";
        var img2 = "res/ui/createRoom/createroom_btn_fang_2.png";
        var box_qztc = new ccui.CheckBox(img2,img2,img1,null,null,ccui.Widget.LOCAL_TEXTURE);
        box_qztc.setPosition(60,btn_qztc.height/2);
        box_qztc.setTouchEnabled(false);
        btn_qztc.addChild(box_qztc);

        this.box_qztc = box_qztc;

        var label_qztc = new cc.LabelTTF("仅群主踢出","res/font/bjdmj/fznt.ttf",45);
        label_qztc.setPosition(btn_qztc.width/2 + 25,btn_qztc.height/2);
        label_qztc.setColor(cc.color(110,70,10));
        btn_qztc.addChild(label_qztc);


        if(ClickClubModel.isClubCreaterOrLeader()){
            this.btn_refuse_invite.y -= 30;
            this.btn_forbid_invite.y -= 45;
            this.btn_allow_yuyin.y -= 60;
            this.btn_empty_order.y -= 75;

            var btn = ccui.Button("res/ui/bjdmj/popup/pyq/btn_hcmd.png");
            btn.setPosition(this.btn_empty_order.x,this.btn_empty_order.y + 100);
            this.panel_1.addChild(btn,1);
            UITools.addClickEvent(btn,this,this.onClickHuChiBtn);
        }

        var Button_jsSet = this.getWidget("Button_jsSet");
        UITools.addClickEvent(Button_jsSet,this,this.onClicJsSet);

        this.CheckBox_jsSet = this.getWidget("CheckBox_jsSet");
        this.updateCheckBoxJsSet(ClickClubModel.getForbiddenKickOut());

        this.updateBtnState(0);
        this.updateSelectTimeBtn();
        this.updateSelectCountBtn();//刷新限制解散房间次数按钮
        this.setCdtljZsState();
    },

    onClicJsSet:function(){
        var param = ClickClubModel.getForbiddenKickOut() ? 0 : 1;

        var self = this;

        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }

        NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
            optType:14,groupId:ClickClubModel.getCurClubId(),userId:PlayerModel.userId , forbiddenKickOut:param,
            sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                ClickClubModel.updateForbiddenKickOut(param);
                self.updateCheckBoxJsSet(param ? true : false);
            }
        }, function (data) {
            FloatLabelUtil.comText("修改失败");
        });
    },

    updateCheckBoxJsSet:function(isBool){
        var img1 = "res/ui/createRoom/createroom_btn_fang_1.png";
        var img2 = "res/ui/createRoom/createroom_btn_fang_2.png";
        this.CheckBox_jsSet.loadTexture(isBool ? img1 : img2);
    },

    onClickHuChiBtn:function(){
        var pop = new PyqSetHuChiLayer();
        PopupManager.addPopup(pop);
    },

    onClickQztc:function(){
        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("权限不足");
            return;
        }

        var self = this;
        var desc = "";

        var param = 0;
        if(ClickClubModel.getQunZhuTiChu()){
            desc = "关闭仅群主踢出";
        }else{
            desc = "开启后仅会长和管理员可踢出成员";
            param = 1;
        }

        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId(),groupId:ClickClubModel.getCurClubId(),
                optType:6,userId:PlayerModel.userId , masterDelete:param,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    //cc.log("updateGroupInfo::"+JSON.stringify(data));
                    ClickClubModel.updateQunZhuTiChu(param);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(10);
                }
            }, function (data) {
                var str = "修改失败";
                if(data && data.message){
                    str = data.message;
                }
                FloatLabelUtil.comText(str);
            });
        })
    },

    //下线自动锁分
    onClickXxzdsf:function(){
        var self = this;
        var desc = "";

        var param = 0;
        if(ClickClubModel.getIsAutoLock() == 1){
            desc = "关闭下线自动锁分";
        }else{
            desc = "开启下线自动锁分";
            param = 1;
        }

        if(!ClickClubModel.isClubCreater()){
            FloatLabelUtil.comText("会长才可修改");
            return;
        }

        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId(),groupId:ClickClubModel.getCurClubId(),
                optType:5,userId:PlayerModel.userId , creditLockOffline:param,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    //cc.log("updateGroupInfo::"+JSON.stringify(data));
                    ClickClubModel.updateIsAutoLock(param);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(9);
                }
            }, function (data) {
                var str = "修改失败";
                if(data && data.message){
                    str = data.message;
                }
                FloatLabelUtil.comText(str);
            });
        })
    },

    /**
     * 设置解散房间次数
     * @param sender
     */
    onClickSelectCountBtn:function(sender){
        if(this.local_selectBtn == sender){
            return;
        }
        var num = 0;
        if(sender == this.select_button2)
            num = parseInt(this.input_countBox.getString());//限制
        this.onClickDismissCount(num,sender);
    },

    /**
     * 刷新勾选按钮
     */
    updateSelectCountBtn:function(){
        var num = ClickClubModel.getDismissCount();
        var index = num == 0 ? 0 : 1;
        var resList = ["res/ui/createRoom/createroom_btn_fang_1.png","res/ui/createRoom/createroom_btn_fang_2.png"];
        this.select_button1.getChildByName("btn_click").loadTexture(resList[index]);
        this.select_button2.getChildByName("btn_click").loadTexture(resList[1 - index]);
        var isCreator = ClickClubModel.isClubCreaterOrLeader();
        this.input_countBox.setTouchEnabled(!!index && isCreator);
        this.input_count.setOpacity(!!index && isCreator? 255 : 50);
        this.local_selectBtn = index == 0 ? this.select_button1 : this.select_button2;
    },

    onClickDismissCount:function(num,sender){

        var self = this;

        var param = 0;
        if(ClickClubModel.getDismissCount() == 0){
            param = parseInt(num);
        }

        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }

        NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
            optType:3,groupId:ClickClubModel.getCurClubId(),userId:PlayerModel.userId , dismissCount:param,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                ClickClubModel.updateDismissCount(param);
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                self.updateSelectCountBtn();
                self.local_selectBtn = sender;
            }
        }, function (data) {
            FloatLabelUtil.comText("修改失败");
        });
    },



    onClickPauseCreateRoom:function(){
        var self = this;
        var desc = "";

        var param = "0";
        if(ClickClubModel.getIsStopCreate()){
            desc = "解除暂停开房";
        }else{
            desc = "开启暂停开房";
            param = "1";
        }

        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }

        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
                userId:PlayerModel.userId , stopCreate:param,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    //cc.log("updateGroupInfo::"+JSON.stringify(data));
                    ClickClubModel.updateStopCreate(param);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(6);
                }
            }, function (data) {
                FloatLabelUtil.comText("修改失败");
            });
        })
    },

    onClickEmptyOrder:function(){
        var self = this;
        var desc = "";

        var param = "2";
        if(ClickClubModel.getTableOrder() == 1){
            desc = "将空牌桌显示在开局牌桌之前";
        }else{
            desc = "将空牌桌显示在开局牌桌之后";
            param = "1";
        }

        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }

        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
                userId:PlayerModel.userId , tableOrder:param,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    cc.log("updateGroupInfo::"+JSON.stringify(data));
                    ClickClubModel.updateTableOrder(param);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(7);
                }
            }, function (data) {
                FloatLabelUtil.comText("修改失败");
            });
        })
    },

    updateBgBtnState:function(){
        for(var i = 1;i<=3;++i){
            this["btn_bg_" + i].setOpacity(this.clubBgType == i?80:255);
        }
    },

    onClickBgChange:function(sender){
        if(this.clubBgType == sender.getTag())return;

        this.clubBgType = sender.getTag();

        this.updateBgBtnState();

        SyEventManager.dispatchEvent("Change_Club_Bg",this.clubBgType);
    },

    onClose:function(){
        cc.sys.localStorage.setItem("sy_club_bg_type",this.clubBgType);
    },

    onClickAutoRoom:function(){
        var self = this;
        var desc = "";
        var openOrClose = "-a";
        if(ClickClubModel.getClubIsOpenAutoCreate()){
            desc = "确定关闭智能补房吗？";
        }else{
            desc = "确定开启智能补房吗？";
            openOrClose = "+a";
        }

        if(ClickClubModel.isClubNormalMember()){
            FloatLabelUtil.comText("权限不够");
            return;
        }
        var tipStr = "注：开启智能补房后系统将在亲友圈空闲房间低于2间时自动创建2间房";
        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
                userId:PlayerModel.userId , autoConfig:openOrClose,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    cc.log("updateGroupInfo::"+JSON.stringify(data));
                    if(openOrClose == "-a"){
                        FloatLabelUtil.comText("关闭智能开房成功");
                        ClickClubModel.updateIsAutoCreateRoom(0);
                    }else{
                        FloatLabelUtil.comText("开启智能开房成功");
                        ClickClubModel.updateIsAutoCreateRoom(1);
                    }
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(1);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        },null,1,tipStr)
    },

    /**
     * 禁止当前亲友圈邀请
     */
    onClickForbidInvite:function(){
        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }
        var self = this;
        var state = "0";
        if(ClickClubModel.getIsForbidInvite()){
            desc = "确定禁止亲友圈邀请进入房间吗？";
            state = "1";
        }else{
            desc = "确定允许亲友圈邀请进入房间吗？";
        }
        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
                userId:PlayerModel.userId , tableInvite:state,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    cc.log("updateGroupInfo::"+JSON.stringify(data));
                    ClickClubModel.updateIsForbidInvite(state);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(8);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        });
    },

    onClickRefuseInvite:function(){
        var self = this;
        var state = "0";
        if(ClickClubModel.getIsRefuseInvite()){
            desc = "确定接收当前亲友圈邀请您进入房间的消息吗？";
            state = "1";
        }else{
            desc = "确定屏蔽当前亲友圈邀请您进入房间的消息吗？";
        }
        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupAction", "setGroupIsRefuseInvite", {gid:ClickClubModel.getCurClubId() ,uid:PlayerModel.userId , status:state}, function (data) {
                if (data) {
                    cc.log("setGroupIsRefuseInvite::"+JSON.stringify(data));
                    ClickClubModel.updateIsRefuseInvite(state);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(3);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        });
    },

    onClickJiesan:function(){
        var self = this;
        var params = {groupId:ClickClubModel.getCurClubId() ,oUserId:PlayerModel.userId};
        var tipStr = "将一键解散所有您创建的未开局房间，确定操作吗？"
        if(ClickClubModel.getCurClubRole() == 0){
            tipStr = "确定一键解散亲友圈中所有未开局的房间吗？";
            params.all = "all";
        }

        AlertPop.show(tipStr,function(){
            NetworkJT.loginReq("groupAction", "dissTable", params, function (data) {
                if (data) {
                    if(data.count != 0){
                        PopupManager.remove(self);
                        SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    }
                    FloatLabelUtil.comText(data.message);
                }
            }, function (data) {
                cc.log("dissTable::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
        });

    },

    onClickTuichu:function(){
        var self = this;
        if(ClickClubModel.getCurClubRole() == 0){
            AlertPop.show("解散亲友圈后无法恢复，确定吗？",function(){
                NetworkJT.loginReq("groupAction", "dissGroup", {keyId:ClickClubModel.getCurClubKeyId() ,userId:PlayerModel.userId}, function (data) {
                    if (data) {
                        cc.log("dissGroup::"+JSON.stringify(data));
                        FloatLabelUtil.comText(data.message);
                        PopupManager.remove(self);
                        if(ClubListModel.orgData.length <= 1){
                            PopupManager.removeAll();
                        }else{
                            SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                        }
                    }
                }, function (data) {
                    cc.log("dissGroup::"+JSON.stringify(data));
                    FloatLabelUtil.comText(data.message);
                });
            })
        }else{
            AlertPop.show("确定要退出亲友圈吗？",function(){
                NetworkJT.loginReq("groupAction", "exitGroup", {
                    userId:PlayerModel.userId,
                    groupId:ClickClubModel.getCurClubId(),
                }, function (data) {
                    if (data) {
                        FloatLabelUtil.comText(data.message);
                        PopupManager.remove(self);
                        if(ClubListModel.orgData.length <= 1){
                            PopupManager.removeAll();
                        }else{
                            SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                        }
                    }
                }, function (data) {
                    cc.log("searchGroupInfo::"+JSON.stringify(data));
                    FloatLabelUtil.comText(data.message);
                });
            })
        }
    },

    onChangeVioiceAndProps:function(){
        var self = this;
        var desc = "";

        var openOrClose = "0";
        if(ClickClubModel.getIsBanVoiceAndProps()){
            desc = "允许后游戏内能发送语音和道具，确定允许吗？";
        }else{
            desc = "禁止后游戏内不能发送语音和道具，确定禁止吗？";
            openOrClose = "1";
        }

        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }

        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
                userId:PlayerModel.userId , chatConfig:openOrClose,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    //cc.log("updateGroupInfo::"+JSON.stringify(data));
                    ClickClubModel.updateIsBanVoiceAndProps(Number(openOrClose));
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(4);
                }
            }, function (data) {
                FloatLabelUtil.comText("修改失败");
            });
        })
    },

    onChangeAutoQuit:function(num){
        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }
        var self = this;
        NetworkJT.loginReq("groupAction", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
            userId:PlayerModel.userId , autoQuit:String(num),sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                //cc.log("updateGroupInfo::"+JSON.stringify(data));
                ClickClubModel.updateAutoQuitData(num);
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                self.updateSelectTimeBtn();
            }
        }, function (data) {
            FloatLabelUtil.comText("修改失败");
        });
    },

    onClickAutoTimeBtn:function(sender){
        if(sender.isBright())return;

        var num = 0;
        if(sender == this.btnAutoTimeArr[1])num = 60;//180;
        else if(sender == this.btnAutoTimeArr[2])num = 180;//300;
        else if(sender == this.btnAutoTimeArr[3])num = 300;//600;

        this.onChangeAutoQuit(num);
    },

    updateSelectTimeBtn:function(){
        var num = ClickClubModel.getAutoQuitData();
        var idx = 0;
        if(num == 60)idx = 1;
        else if(num == 180)idx = 2;
        else if(num == 300)idx = 3;

        for(var i = 0;i<this.btnAutoTimeArr.length;++i){
            this.btnAutoTimeArr[i].setBright(i == idx);
            this.btnAutoTimeArr[i].getChildByName("select").setSelected(i == idx);
        }
    },
    
    onChangePrivate:function(){
        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("会长和管理才可修改");
            return;
        }
        var isAllow = "0";
        if(ClickClubModel.getIsPrivateRoom()){
            desc = "确定关闭私密房吗";
        }else{
            desc = "确定开启私密房吗";
            isAllow = "1";
        }
        var self = this;
        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {privateRoom:isAllow,optType:12,groupId:ClickClubModel.getCurClubId(),
                userId:PlayerModel.userId,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    ClickClubModel.updatePrivateRoom(isAllow);
                    self.updateBtnState(12);
                    FloatLabelUtil.comText("修改成功");
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        })
    },

    onChangeNegativeCredit:function(){
        if(!ClickClubModel.isClubCreater()){
            FloatLabelUtil.comText("会长才可修改");
            return;
        }

        var isAllow = "0";
        if(ClickClubModel.getIsNegativeCredit()){
            desc = "确定不允许成员负比赛分吗";
        }else{
            desc = "确定允许成员负比赛分吗";
            isAllow = "1";
        }

        //if(!ClickClubModel.isClubCreaterOrLeader()){
        //    FloatLabelUtil.comText("群主和管理员才可修改");
        //    return;
        //}

        var self = this;
        AlertPop.show(desc,function(){
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
                userId:PlayerModel.userId , negativeCredit:isAllow,sessCode:PlayerModel.sessCode}, function (data) {
                if (data) {
                    //cc.log("updateGroupInfo::"+JSON.stringify(data));
                    ClickClubModel.updateNegativeCredit(isAllow);
                    SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    self.updateBtnState(5);
                }
            }, function (data) {
                FloatLabelUtil.comText("修改失败");
            });
        })
    },

    updateBtnState:function(type){
        if(type == 1 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/zhineng1.png";
            if(ClickClubModel.getClubIsOpenAutoCreate()){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/zhineng2.png";
            }
            this.btn_auto_room.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 2 || type == 0){
            if(ClickClubModel.getCurClubRole() == 0){
                //this.btn_tuichu.setColor(cc.color.GRAY);
                //this.btn_tuichu.setTouchEnabled(false);
            }else{
                this.btn_tuichu.setColor(cc.color.WHITE);
                this.btn_tuichu.setTouchEnabled(true);
            }
        }
        if(type == 3 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/yaoqing1.png";
            if(ClickClubModel.getIsRefuseInvite()){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/yaoqing2.png";
            }
            this.btn_refuse_invite.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_refuse_invite.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 4 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/biaoqing1.png";
            if(ClickClubModel.getIsBanVoiceAndProps()){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/biaoqing2.png";
            }
            this.btn_allow_yuyin.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_allow_yuyin.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 5 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/fufen2.png";
            if(ClickClubModel.getIsNegativeCredit()){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/fufen1.png";
            }
            this.btn_allow_negative.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_allow_negative.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 6 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/zanting2.png";
            if(ClickClubModel.getIsStopCreate()){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/zanting1.png";
            }
            this.btn_pause_create_room.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_pause_create_room.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 7 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/kongzhuo1.png";
            if(ClickClubModel.getTableOrder() == 1){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/kongzhuo2.png";
            }
            this.btn_empty_order.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_empty_order.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 8 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/yun1.png";
            if(ClickClubModel.getIsForbidInvite() == 1){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/yun2.png";
            }
            this.btn_forbid_invite.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_forbid_invite.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 9 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/xxzdsf2.png";
            if(ClickClubModel.getIsAutoLock() == 1){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/xxzdsf1.png";
            }
            this.btn_xxzdsf.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_xxzdsf.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
        if(type == 10 || type == 0){
            this.box_qztc.setSelected(ClickClubModel.getQunZhuTiChu());
        }
        if(type == 12 || type == 0){
            var resfile = "res/ui/bjdmj/popup/pyq/shezhi/kaiqisimifang2.png";
            if(ClickClubModel.getIsPrivateRoom() == 1){
                resfile = "res/ui/bjdmj/popup/pyq/shezhi/kaiqisimifang1.png";
            }
            this.btn_allow_private.loadTextureNormal(resfile,ccui.Widget.LOCAL_TEXTURE);
            this.btn_allow_private.loadTexturePressed(resfile,ccui.Widget.LOCAL_TEXTURE);
        }
    },

    onClickChangeGg:function(){
        var content = this.inputBox2.getString();

        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("权限不够");
            return;
        }

        if(!content){
            FloatLabelUtil.comText("请输入公告内容");
            return;
        }

        NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {content:content,optType:1,groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId  ,subId:0,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                cc.log("updateGroupInfo::"+JSON.stringify(data));
                FloatLabelUtil.comText("修改成功");
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onClickChangeName:function(){
        var name = this.inputBox1.getString();

        if(!ClickClubModel.isClubCreaterOrLeader()){
            FloatLabelUtil.comText("权限不够");
            return;
        }

        if(!name){
            FloatLabelUtil.comText("亲友圈名称不能为空");
            return;
        }
        if(name == ClickClubModel.getCurClubName()){
            FloatLabelUtil.comText("亲友圈名称未更改");
            return;
        }

        NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {groupName:name,optType:2,groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId  ,subId:0,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                cc.log("updateGroupInfo::"+JSON.stringify(data));
                FloatLabelUtil.comText("修改成功");
                ClickClubModel.updateClubName(name);
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });

    },

    onClickXhw:function(){
        //this.panel_2.setVisible(true);
        FloatLabelUtil.comText("暂未开放");
    },

    onClickGuanbi:function(){
        this.panel_2.setVisible(false);
    },

    onClickGpsLimit:function(obj){
        var temp = obj.temp;
        this.displayForbitBtn();
        if (temp == 1){
            this.panel_3.setVisible(true);
        }else{
            this.panel_3.setVisible(false);
        }

    },

    addDtzClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    onClickForbit:function(obj){

        var params = {
            keyId:ClickClubModel.getCurClubKeyId() ,
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId ,
            sessCode:PlayerModel.sessCode
        }
        var state = 0;
        var temp = params.optType = obj.temp || 7;
        if (obj.isBright()){
            state = 0;
            obj.setBright(false);
        }else{
            state = 1;
            obj.setBright(true);
        }
        if (temp == 8){
            params.openGpsLimit = state;
        }else if (temp == 9) {
            params.distanceLimit = state;
        }else if(temp == 103){
            params.fzbHide = state;
        }else{
            params.sameIpLimit = state;
        }
        var self = this;
        NetworkJT.loginReq("groupActionNew", "updateGroupInfo", params, function (data) {
            if (data) {
                //ClickClubModel.updateDismissCount(param);
                FloatLabelUtil.comText("修改成功");
                self.displayForbitBtn(obj,state);
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);

            }
        }, function (data) {
            FloatLabelUtil.comText("修改失败");
        });
    },

    setCdtljZsState:function(){
        var num = ClickClubModel.getCdtljKjzs();
        this.box_kjzs.setString(num);
    },

    onChangeCdtljZs:function(num){
        var params = {
            keyId:ClickClubModel.getCurClubKeyId() ,
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId ,
            sessCode:PlayerModel.sessCode
        }
        params.optType = 102;
        params.cdtuolaji = num;

        var self = this;
        NetworkJT.loginReq("groupActionNew", "updateGroupInfo", params, function (data) {
            if (data) {
                FloatLabelUtil.comText("修改成功");
                ClickClubModel.setCdtljKjzs(num);
                self.setCdtljZsState();
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);

            }
        }, function (data) {
            FloatLabelUtil.comText("修改失败");
        });
    },

    displayForbitBtn:function(obj,state){
        if (obj){
            //var path = "res/ui/createRoom/gou2.png";
            //if (state){
            //    path = "res/ui/createRoom/gou1.png";
            //}
            //obj.loadTextureNormal(path)
            obj.setBright(state==1);
            if (state == 1 && obj.temp == 9){
                this.getWidget("btn_forbit_gps").setBright(true);
            }else if (state == 0 && obj.temp == 8){
                this.getWidget("btn_forbit_distance").setBright(false);
            }
        }else{
            //var path1 = ClickClubModel.getSameIpLimit() ? "res/ui/createRoom/gou1.png" : "res/ui/createRoom/gou2.png";
            //var path2 = ClickClubModel.getOpenGpsLimit() ? "res/ui/createRoom/gou1.png" : "res/ui/createRoom/gou2.png";
            //var path3 = ClickClubModel.getDistanceLimit() ? "res/ui/createRoom/gou1.png" : "res/ui/createRoom/gou2.png";
            //cc.log("displayForbitBtn=======",ClickClubModel.getSameIpLimit(),ClickClubModel.getOpenGpsLimit(),ClickClubModel.getDistanceLimit())
            this.getWidget("btn_forbit_ip").setBright(ClickClubModel.getSameIpLimit());
            this.getWidget("btn_forbit_gps").setBright(ClickClubModel.getOpenGpsLimit());
            this.getWidget("btn_forbit_distance").setBright(ClickClubModel.getDistanceLimit());
            this.getWidget("btn_fzb_hide").setBright(ClickClubModel.getIsFzbHide());
        }
    },

    /**
     * This method is called when an edit box gains focus after keyboard is shown.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidBegin: function (sender) {

    },

    /**
     * This method is called when an edit box loses focus after keyboard is hidden.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidEnd: function (sender) {
        if(sender == this.box_kjzs){
            var nowNum = this.box_kjzs.getString();
            var oldNum = ClickClubModel.getCdtljKjzs();
            var nowNum = Number(nowNum);
            if(oldNum != nowNum){
                this.onChangeCdtljZs(nowNum);
            }
        }
    },

    /**
     * This method is called when the edit box text was changed.
     * @param {cc.EditBox} sender
     * @param {String} text
     */
    editBoxTextChanged: function (sender, text) {
        if(sender == this.input_countBox) {//如果是限制次数的输入框
            var last = text.substring(text.length - 1,text.length);
            var num = last.charCodeAt();
            if(num < 48 || num > 57){
                last = text.substring(0,text.length - 1);
                if(last == ""){
                    last = "1";
                }
                sender.setString(last);
            }
        }else if(sender == this.box_kjzs){
            var last = text.substring(text.length - 1,text.length);
            var num = last.charCodeAt();
            if(num < 48 || num > 57){
                last = text.substring(0,text.length - 1);
                sender.setString(last);
            }
        }
    },

    /**
     * This method is called when the return button was pressed or the outside area of keyboard was touched.
     * @param {cc.EditBox} sender
     */
    editBoxReturn: function (sender) {
        if(sender == this.input_countBox){//如果是限制次数的输入框
            var num = sender.getString();
            if(parseInt(num) == 0 || num == ""){
                FloatLabelUtil.comText(" 限制次数不能为0或不填！！！ ");
                sender.setString("1");
            }else{
                NetworkJT.loginReq("groupActionNew", "updateGroupInfo", {keyId:ClickClubModel.getCurClubKeyId() ,
                    optType:3,groupId:ClickClubModel.getCurClubId(),userId:PlayerModel.userId , dismissCount:parseInt(num),sessCode:PlayerModel.sessCode}, function (data) {
                    if (data) {
                        ClickClubModel.updateDismissCount(parseInt(num));
                        SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                    }
                }, function (data) {
                    FloatLabelUtil.comText("修改失败");
                });
            }
        }
    }
});

var PyqPifuPop = cc.Layer.extend({
    ctor:function(){
        this._super();

        this.clubBgType = cc.sys.localStorage.getItem("sy_club_bg_type") || 1;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(150);
        this.addChild(grayLayer);

        var bg = new cc.Sprite("res/ui/bjdmj/popup/di2.png");
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        var title = new cc.Sprite("res/ui/bjdmj/popup/pyq/title_pifu.png");
        title.setPosition(bg.width/2,bg.height - 45);
        bg.addChild(title,1);

        var img = "res/ui/bjdmj/popup/x.png";
        var btn_close = new ccui.Button(img,img,"");
        btn_close.setPosition(bg.width - 45,bg.height - 45);
        btn_close.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(btn_close,1);
        this.btn_Close = btn_close;

        this.btnArr = [];
        var offsetX = 375;
        var offsetY = 180;
        for(var i = 0;i<8;++i){
            var img = "res/ui/bjdmj/popup/pyq/bg/img_set_bg_" + (i + 1) + ".png";
            var btn = new ccui.Button(img,img,"");
            btn.setTag(i+1);
            btn.setPosition(bg.width/2 + (i%3 - 1)*offsetX,bg.height/2 - (Math.floor(i/3) - 1)*offsetY);
            btn.addTouchEventListener(this.onClickBtn,this);
            bg.addChild(btn);
            this.btnArr.push(btn);
        }

        this.select_kuang = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/select_kuang.png");
        this.select_kuang.setContentSize(this.btnArr[0].width + 20,this.btnArr[0].height + 20);
        bg.addChild(this.select_kuang,1);

        this.updateBgBtnState();
    },

    onClickBgChange:function(sender){
        if(this.clubBgType == sender.getTag())return;

        this.clubBgType = sender.getTag();

        this.updateBgBtnState();

        SyEventManager.dispatchEvent("Change_Club_Bg",this.clubBgType);
    },

    updateBgBtnState:function(){
        var btn = this.btnArr[this.clubBgType - 1];
        if(btn){
            this.select_kuang.setPosition(btn.getPosition());
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_Close){
                PopupManager.remove(this);
            }else{
                this.onClickBgChange(sender);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClose:function(){
        cc.sys.localStorage.setItem("sy_club_bg_type",this.clubBgType);
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});

var PyqNewPifuPop = BasePopup.extend({
    ctor:function(pyqLevel,levelData){
        this.pyqLevel = pyqLevel
        this.levelData = levelData
        this._super("res/pyqNewPifuPop.json");

    },

    selfRender:function(){
        if(ClickClubModel.getIsSwitchCoin()){
            this.clubBgType = cc.sys.localStorage.getItem("sy_club_bg_type"+ClickClubModel.getCurClubId()) || 1;
        }else{
            this.clubBgType = cc.sys.localStorage.getItem("sy_club_bg_type") || 1;
        }

        this.clubZbType = cc.sys.localStorage.getItem("zuozitype") || 1;

        this.btn_zb_1 = this.getWidget("btn_zb_1");
        this.btn_zb_2 = this.getWidget("btn_zb_2");

        this.btn_zb_1.setTag(1);
        this.btn_zb_2.setTag(2);

        UITools.addClickEvent(this.btn_zb_1,this,this.onClickZbChange);
        UITools.addClickEvent(this.btn_zb_2,this,this.onClickZbChange);

        this.select_kuang_1 = this.getWidget("select_kuang_1");
        this.select_kuang_2 = this.getWidget("select_kuang_2");

        this.ScrollView_bg = this.getWidget("ScrollView_bg")
        this.ScrollView_bg.setScrollBarEnabled(false)
        this.loadBgList()

        this.updateBgBtnState(this.clubBgType);
        this.updateZbBtnState();
    },

    loadBgList:function() {
        var item_bg = ccui.helper.seekWidgetByName(this.ScrollView_bg, "item_btn_bg");
        item_bg.retain()
        item_bg.removeFromParent(true)
        var spaceW = 300;
        var contentW = Math.max(this.ScrollView_bg.width, spaceW * this.levelData.length);
        this.ScrollView_bg.setInnerContainerSize(cc.size(contentW,this.ScrollView_bg.height));

        for (var i = 0; i < this.levelData.length; i++) {
            var item = item_bg.clone();
            this.ScrollView_bg.addChild(item);
            item.x = (i+0.5)*spaceW;
            item.loadTextures("res/ui/bjdmj/popup/pyq/bg/img_set_bg_"+ (i+1) +".png","","");
            item.setTag(i+1)
            UITools.addClickEvent(item,this,this.onClickBgChange);
            if(this.pyqLevel < this.levelData[i].level){
                item.setTouchEnabled(false)
                var grayLayer = new cc.LayerColor(cc.color(0,0,0,120),item.getContentSize().width,item.getContentSize().height);
                item.addChild(grayLayer);
                var lockImg = new ccui.ImageView("res/ui/bjdmj/popup/pyq/img_suo.png");
                lockImg.setPosition(item.getContentSize().width/2 - 50,item.getContentSize().height/2)
                lockImg.setAnchorPoint(1,0.5)
                item.addChild(lockImg);
                var lockLabel = UICtor.cLabel(this.levelData[i].level+"级解锁",36);
                lockLabel.setPosition(item.getContentSize().width/2-30,item.getContentSize().height/2)
                lockLabel.setAnchorPoint(0,0.5)
                item.addChild(lockLabel);
            }
        }
    },

    onClickBgChange:function(sender){
        if(this.clubBgType == sender.getTag())return;

        this.clubBgType = sender.getTag();

        this.updateBgBtnState(this.clubBgType);

        SyEventManager.dispatchEvent("Change_Club_Bg",this.clubBgType);
    },

    onClickZbChange:function(sender){
        if(this.clubZbType == sender.getTag())return;

        this.clubZbType = sender.getTag();

        this.updateZbBtnState();

        SyEventManager.dispatchEvent("Change_Club_Zb",this.clubZbType);
    },

    updateBgBtnState:function(tag){
        var bgItem = this.ScrollView_bg.getChildByTag(tag)
        if(bgItem){
            this.select_kuang_1.setPosition(bgItem.getPosition());
        }
    },

    updateZbBtnState:function(){
        if(this["btn_zb_" + this.clubZbType]){
            this.select_kuang_2.setPosition(this["btn_zb_" + this.clubZbType].getPosition());
        }
    },

    onClose:function(){
        if(ClickClubModel.getIsSwitchCoin()){
            cc.sys.localStorage.setItem("sy_club_bg_type"+ClickClubModel.getCurClubId(),this.clubBgType);
        }else{
            cc.sys.localStorage.setItem("sy_club_bg_type",this.clubBgType);
        }
        cc.sys.localStorage.setItem("zuozitype",this.clubZbType);
    },
});
