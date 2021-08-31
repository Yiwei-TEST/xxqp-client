/**
 * Created by leiwenwen on 2018/10/15.
 */
var ClubRuleManagePop = BasePopup.extend({
    show_version:true,
    ctor:function(allBagsData,modeId){
        this.allBagsData = allBagsData || [];
        this.modeId = modeId || 0;
        this._super("res/clubRuleManagePop.json");
    },

    selfRender:function(){
        var closeBtn = this.getWidget("close_btn");  // 前往大厅
        if(closeBtn){
            UITools.addClickEvent(closeBtn,this,this.onClose);
        }

        var Button_start = this.getWidget("Button_start");  // 现在开局
        if(Button_start){
            UITools.addClickEvent(Button_start,this,this.onStart);
        }

        var Button_join = this.getWidget("Button_join");  // 快速加入
        if(Button_join){
            UITools.addClickEvent(Button_join,this,this.onBagJoin);
        }

        this.ruleListView = this.getWidget("ListView_rule");//所有玩法的list

        this.addCustomEvent(SyEvent.UPDATE_CLUB_BAGS,this,this.onRefreshBagsData);
        this.addCustomEvent(SyEvent.CLOSE_CLUB_BAGS,this,this.onClose);

        this.btn_all = this.getWidget("btn_all");
        this.btn_pk = this.getWidget("btn_pk");
        this.btn_mj = this.getWidget("btn_mj");
        this.btn_zp = this.getWidget("btn_zp");
        this.btn_cw = this.getWidget("btn_cw");

        this.btn_pk.setBright(false);
        this.btn_mj.setBright(false);
        this.btn_zp.setBright(false);
        this.btn_cw.setBright(false);

        this.btn_all.tempData = "ALL";
        this.btn_pk.tempData = "PK";
        this.btn_mj.tempData = "MJ";
        this.btn_zp.tempData = "ZP";
        this.btn_cw.tempData = "CW";


        this.showBtnItem(this.btn_all);

        UITools.addClickEvent(this.btn_all,this,this.onClickItemBtn);
        UITools.addClickEvent(this.btn_pk,this,this.onClickItemBtn);
        UITools.addClickEvent(this.btn_mj,this,this.onClickItemBtn);
        UITools.addClickEvent(this.btn_zp,this,this.onClickItemBtn);
        UITools.addClickEvent(this.btn_cw,this,this.onClickItemBtn);

        this.onShowBagItem();

        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        this.btn_create_wzq = this.getWidget("btn_create_wzq");
        UITools.addClickEvent(this.btn_create_wzq,this,this.onClickWZQCreateBtn);
        this.btn_create_wzq.visible = false;//!ClickClubModel.getClubIsGold()
        this.btn_join_wzq = this.getWidget("btn_join_wzq");
        UITools.addClickEvent(this.btn_join_wzq,this,this.onClickWZQJoinBtn);
        this.btn_join_wzq.visible = false;//!ClickClubModel.getClubIsGold()
    },

    onClickWZQCreateBtn:function(){
        var mc = new WZQCreateRoom();
        PopupManager.addPopup(mc);
    },

    onClickWZQJoinBtn:function(){
        var mc = new PyqCheckRoomPop(2);
        this.addChild(mc,9);
    },

    showBtnItem:function(btn){
        if(this.curItemBtn){
            this.curItemBtn.setBright(false);
            var txt = this.curItemBtn.getChildByName("txt");
            txt.setColor(cc.color("#886032"));
        }
        btn.setBright(true);

        var txt = btn.getChildByName("txt");
        txt.setColor(cc.color("#b43802"));

        this.curItemBtn = btn;
    },

    onClickItemBtn:function(sender){
        if(sender == this.curItemBtn)return;
        this.showBtnItem(sender);

        this.onShowBagItem();

    },

    onRefreshBagsData: function(event){
        var tData = event.getUserData();
        this.data = tData;
        this.onShowBagItem();
    },

    //显示所有的包厢
    onShowBagItem : function(){
        var type = this.curItemBtn.tempData;
        this.ruleListView.removeAllChildren();
        var idx = 0;

        if(type == "CW"){

            var cwModes = [];
            var clubLocalList = UITools.getLocalJsonItem("Club_Local_Data");
            for(var j = 0 ; j < clubLocalList.length; j++){
                if (ClickClubModel.getCurClubId() == clubLocalList[j].clickId){
                    cwModes = clubLocalList[j].cwModes || [clubLocalList[j].bagModeId];
                }
            }

            for(var i = 0;i<cwModes.length;++i){
                for(var index = 0;index < this.allBagsData.length;++index){
                    var data = this.allBagsData[index];
                    var groupState = data.groupState;
                    if(cwModes[i] == data.config.keyId && groupState && parseInt(groupState)){
                        var ruleItem = new ClubRuleItem(data , this,idx);
                        this.ruleListView.pushBackCustomItem(ruleItem);
                        idx++;
                    }
                }
            }
            return;
        }

        for(var index = 0 ; index < this.allBagsData.length ; index++){
            var data = this.allBagsData[index];
            var groupState = data.groupState;
            if (groupState && parseInt(groupState)){

                var createPara = data.config.modeMsg.split(",");
                var wanfa = createPara[1];

                var isShow = true;

                if(type == "PK"){
                    isShow = GameTypeManager.isPK(wanfa);
                }else if(type == "ZP"){
                    isShow = GameTypeManager.isZP(wanfa);
                }else if(type == "MJ"){
                    isShow = GameTypeManager.isMJ(wanfa);
                }
                if(isShow){
                    var ruleItem = new ClubRuleItem(data , this,idx);
                    this.ruleListView.pushBackCustomItem(ruleItem);
                    idx++;
                }
            }
        }
    },


    /**
    * 刷新所有玩法按钮的状态
    * */
    refreshClubRuleChoose: function(modeId){
        var items = this.ruleListView.getItems();
        this.modeId = modeId;
        for(var index = 0 ; index < items.length ; index++){
            var item = items[index];
            item.showBtnState(modeId);
            item.updateWanfaTip(this.modeId)
        }
    },

    onBagJoin : function(sender){

        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        SyEventManager.dispatchEvent(SyEvent.CLUB_BAG_FASTJOIN,3);
    },

    onStart : function(sender){

        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        SyEventManager.dispatchEvent(SyEvent.CLUB_BAG_CREATE);
    },

    onClose : function(){
        PopupManager.remove(this);
    }

})