/**
 * Created by leiwenwen on 2018/10/15.
 */


var ClubBagCell = ccui.Widget.extend({
    ctor:function(data,root,idx){
        this._super();

        this.data = data;
        this.keyID = 0;
        this.bagKeyID = 0;
        var temp  = this.temp = data.groupId;
        this.root = root;
        this.groupState = 1;

        this.setContentSize(1842, 210);


        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(1842,210),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Button_roombg=this.Button_roombg= UICtor.cS9Img("res/ui/bjdmj/popup/pyq/wanfa/tiao.png",cc.rect(625,0,100,110),cc.size(1842,210));
        Button_roombg.setPosition(921,105);
        Panel_16.addChild(Button_roombg);

        var infoScroll = new ccui.ScrollView();
        infoScroll.setDirection(ccui.ScrollView.DIR_VERTICAL);
        infoScroll.setTouchEnabled(false);
        infoScroll.setContentSize(855,130);
        infoScroll.setPosition(cc.p(-690+Button_roombg.getAnchorPointInPoints().x,-100 + Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(infoScroll);
        this.infoScroll = infoScroll;

        var Label_detail=this.Label_detail= new ccui.Text("","res/font/bjdmj/fznt.ttf",38);
        Label_detail.setColor(cc.color("#5e473b"));
        Label_detail.setTextAreaSize(cc.size(855,0));
        Label_detail.setAnchorPoint(cc.p(0,0.5));
        Label_detail.setPosition(cc.p(0,infoScroll.height/2));
        infoScroll.addChild(Label_detail);

        var openBtn=this.openBtn= UICtor.cBtn("res/ui/bjdmj/popup/pyq/wanfa/guanbi.png");
        openBtn.setPosition(cc.p(400+Button_roombg.getAnchorPointInPoints().x, 0+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(openBtn);

        this.delBtn= UICtor.cBtn("res/ui/bjdmj/popup/pyq/wanfa/shanchu.png");
        this.delBtn.setPosition(cc.p(600+Button_roombg.getAnchorPointInPoints().x, 0+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(this.delBtn);

        var changeBtn=this.changeBtn= UICtor.cBtn("res/ui/bjdmj/popup/pyq/wanfa/xiugai.png");
        changeBtn.setPosition(cc.p(800+Button_roombg.getAnchorPointInPoints().x, 0+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(changeBtn);

        var BitmapLabel_order = this.BitmapLabel_order = new ccui.Text("1","res/font/bjdmj/fznt.ttf",72);
        BitmapLabel_order.setPosition(103,Button_roombg.height/2);
        BitmapLabel_order.setColor(cc.color("#886032"));
        Button_roombg.addChild(BitmapLabel_order);

        var Label_bagName=this.Label_bagName= new ccui.Text("????????????????????????","res/font/bjdmj/fznt.ttf",40);
        Label_bagName.setColor(cc.color("#ba3212"));
        Label_bagName.setTextAreaSize(cc.size(350,45));
        Label_bagName.setAnchorPoint(cc.p(0,0.5));
        Label_bagName.setPosition(cc.p(-690+Button_roombg.getAnchorPointInPoints().x, 65+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(Label_bagName);

        var Label_wanfaType=this.Label_wanfaType= new ccui.Text("????????????","res/font/bjdmj/fznt.ttf",40);
        Label_wanfaType.setColor(cc.color("#ba3212"));
        Label_wanfaType.setAnchorPoint(cc.p(0,0.5));
        Label_wanfaType.setPosition(cc.p(-290+Button_roombg.getAnchorPointInPoints().x, 65+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(Label_wanfaType);

        this.addChild(Panel_16);

        openBtn.temp = temp;
        changeBtn.temp = temp;

        UITools.addClickEvent(openBtn,this,this.onSwitch);
        UITools.addClickEvent(changeBtn,this,this.onChange);
        UITools.addClickEvent(this.delBtn,this,this.onDeleteBag);


        // cc.log("data =",JSON.stringify(data));
        if (data){
            this.keyID = data.keyId;
            this.groupState = data.groupState;
            this.bagKeyID = data.config.keyId;
        }

        this.setData(data,idx);


    },

    //????????????
    setData:function(data,idx){

        this.BitmapLabel_order.setString(idx + 1);

        //?????????????????????
        var createPara = data.config.modeMsg.split(",");
        var gameStr = ClubRecallDetailModel.getGameName(createPara) || "";
        var wanfaStr = ClubRecallDetailModel.getWanfaStr(data.config.modeMsg,true) || "";

        var creditStr = "";
        if (data.config.creditMsg && data.config.creditMsg[0]){
            creditStr = " ?????????";
        }

        this.Label_wanfaType.setString("????????????:" +gameStr);
        this.Label_bagName.setString(""+data.groupName);
        this.Label_detail.setString(wanfaStr + creditStr);

        var contentH = Math.max(this.infoScroll.height,this.Label_detail.height);
        this.infoScroll.setInnerContainerSize(cc.size(this.infoScroll.width,contentH));
        this.Label_detail.setPosition(0,contentH/2);

        if(contentH > this.infoScroll.height){
            var moveH = contentH-this.infoScroll.height;
            var action1 = cc.moveBy(moveH/20,cc.p(0,moveH));
            var action = cc.sequence(action1,action1.reverse()).repeatForever();
            this.Label_detail.runAction(action);
        }

        this.showSwitch()
    },

    showSwitch: function(){
        if (this.groupState == 1){
            this.openBtn.loadTextureNormal("res/ui/bjdmj/popup/pyq/wanfa/guanbi.png",ccui.Widget.LOCAL_TEXTURE);
        }else{
            this.openBtn.loadTextureNormal("res/ui/bjdmj/popup/pyq/wanfa/kaiqi.png",ccui.Widget.LOCAL_TEXTURE);
        }
    },

    /**
     * ????????????
     */
    onSwitch: function(obj){
        var temp = obj.temp;
        var groupState = this.groupState;
        var desc = "";
        if (this.groupState == 0){
            groupState = 1;
            desc = "?????????????????????????????????";
        }else{
            groupState = 0;
            desc = "?????????????????????????????????";
        }
        var self = this;
        AlertPop.show(desc,function() {
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {
                groupName: self.data.groupName, groupMode: 0,
                keyId: self.keyID, groupId: ClickClubModel.clickClubId, groupState: groupState,
                userId: PlayerModel.userId, subId: temp,sessCode:PlayerModel.sessCode
            }, function (data) {
                if (data) {
                    self.groupState = groupState;
                    self.showSwitch();
                    //PopupManager.remove(self.root);
                    SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        })
    },


    /**
     * ??????????????????
     */
    onChange: function(obj){
        var isFakeDesk = false;

        var wanfa = this.data.config.modeMsg.split(",") || [];
        var creditMsg = this.data.config.creditMsg.split(",") || [];
        var goldMsg = this.data.config.goldMsg.split(",") || [];
        var clubData = {modeId:this.bagKeyID,
            clubId:ClickClubModel.getCurClubId(),
            clubRole:ClickClubModel.getCurClubRole(),
            wanfaList:wanfa,
            isLeaderPay:ClickClubModel.getClubIsOpenLeaderPay(),
            subId:obj.temp,
            bagName:this.data.groupName,
            keyId:this.keyID,
            creditMsg:creditMsg,
            goldMsg:goldMsg};


        NetworkJT.loginReq("groupActionNew", "loadFakeTableCount", {
            configId : this.bagKeyID, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode
        }, function (data) {
            if (data) {
                // cc.log("data =",JSON.stringify(data.message.fakeTableCount));
                if(data.message.fakeTableCount > 0){
                    isFakeDesk = true;
                }
                var mc = new MjCreateRoom(clubData,null,isFakeDesk,data.message.fakeTableCount);
                PopupManager.addPopup(mc);
            }
        }, function (data) {
            var mc = new MjCreateRoom(clubData,null,isFakeDesk);
            PopupManager.addPopup(mc);
            // FloatLabelUtil.comText(data.message);
        });

        
        

        
    },

    /**
     * ??????????????????
     */
    onJoinBag: function(obj){
        var temp  = obj.temp;
        if (this.data){
            cc.log("????????????"+temp);
            var index = temp;
            ComReq.comReqGetClubRoomsData([ClickClubModel.getCurClubId(), 1, 100, 1, 1],["" + index ]);
        }
        PopupManager.remove(this.root);
    },

    /**
     * ??????????????????
     * userId	??????id????????????
     * keyId	??????id????????????
     * groupId ??????IDid????????????
     */

    onDeleteBag:function(obj){
        var temp = obj.temp;
        var that = this;
        cc.log("this.bagKeyID=="+this.bagKeyID);
        var desc = "?????????????????????????????????";
        AlertPop.show(desc,function() {
            NetworkJT.loginReq("groupAction", "deleteTableConfig", {userId:PlayerModel.userId,keyId:that.bagKeyID,
                groupId:ClickClubModel.getCurClubId()}, function (data) {
                if (data) {
                    cc.log("deleteBag::"+JSON.stringify(data));
                    FloatLabelUtil.comText("????????????");
                    SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                }
            }, function (data) {
                cc.log("deleteBag::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
        })

    },

})

var ClubBagManagePop = BasePopup.extend({
    show_version:true,
    ctor:function(data){
        this.data = data;
        //cc.log("ClubBagManagePop",JSON.stringify(this.data));
        this._super("res/clubBagManagePop.json");
    },

    selfRender:function(){

        var closeBtn = this.getWidget("close_btn");  // ????????????
        if(closeBtn){
            UITools.addClickEvent(closeBtn,this,this.onClose);
        }

        var Button_add = this.getWidget("Button_add");  // ????????????
        if(Button_add){
            UITools.addClickEvent(Button_add,this,this.onAdd);
        }

        this.ListView_rule = this.getWidget("ListView_rule");

        this.addCustomEvent(SyEvent.UPDATE_CLUB_BAGS,this,this.onRefreshBagsData);
        this.addCustomEvent(SyEvent.CLOSE_CLUB_BAGS,this,this.onClose);
        this.onShowBagItem();

        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("?????????ID:" + ClickClubModel.getCurClubId());

        if(ClickClubModel.isClubCreaterOrLeader()){
            Button_add.x -= 285;
            var btn = ccui.Button("res/ui/bjdmj/popup/pyq/wanfa/btn_bag_order.png");
            btn.setPosition(Button_add.x + 715,Button_add.y);
            Button_add.getParent().addChild(btn,1);
            UITools.addClickEvent(btn,this,this.onClickOrder);


            var renqiDeskBtn = ccui.Button("res/ui/bjdmj/popup/pyq/wanfa/btn_renqiDesk.png");
            renqiDeskBtn.setPosition(Button_add.x - 440, Button_add.y);
            Button_add.getParent().addChild(renqiDeskBtn, 1);
            renqiDeskBtn.visible = false;
            UITools.addClickEvent(renqiDeskBtn, this, function () {
                var pop = new RenqiDeskManergerPop(this.data);
                PopupManager.addPopup(pop);
            });
        }
    },

    onClickOrder:function(){
        var pop = new PyqSetOrderLayer(this.data);
        PopupManager.addPopup(pop);
    },

    onRefreshBagsData: function(event){
        var tData = event.getUserData();
        this.data = tData;
        this.onShowBagItem();
    },

    /**
     * ????????????
     */
    onAdd: function(obj){
        var clubData = {modeId:0,
            clubId:ClickClubModel.getCurClubId(),
            clubRole:ClickClubModel.getCurClubRole(),
            wanfaList:[],
            isLeaderPay:ClickClubModel.getClubIsOpenLeaderPay(),
            subId:0,
            bagName:""};

        var mc = new MjCreateRoom(clubData);
        PopupManager.addPopup(mc);
    },

    //?????????????????????
    onShowBagItem : function(){
        if (this.data){
            this.ListView_rule.removeAllItems();
            for (var i = 0; i < this.data.length ;i++) {
                var bagItem = new ClubBagCell(this.data[i], this,i);
                this.ListView_rule.pushBackCustomItem(bagItem);
            }
        }
    },

    onClose : function(){
        PopupManager.remove(this);
    }

})