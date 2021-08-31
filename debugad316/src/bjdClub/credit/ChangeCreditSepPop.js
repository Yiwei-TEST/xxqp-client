/**
 * Created by cyp on 2019/5/16.
 */
var ChangeCreditSepPop = BasePopup.extend({
    ctor:function(optItem){
        this.optItem = optItem;
        this.defaultValues = [0,0,0,0,0,0,0,0,0,0];

        this._super("res/changeCreditSepPop.json");
    },

    selfRender:function(){
        cc.log("this.optItem.data",JSON.stringify(this.optItem.data))
        this.title_tip_1 = this.getWidget("title_tip_1");
        this.title_tip_1.x = this.title_tip_1.x - 20
        this.title_tip_2 = this.getWidget("title_tip_2");
        this.title_tip_2.x = this.title_tip_2.x + 60
        this.title_tip_1.setString("您正在对\"" + UITools.truncateLabel(this.optItem.data.teamName,10) + "\"(" +this.optItem.data.userId +")进行赠送分操作");
        this.title_tip_2.setString("");
        this.listview_item = this.getWidget("listview_item");
        this.item_opt = this.getWidget("item_opt");
        this.item_opt.setVisible(false);
        UITools.addClickEvent(this.getWidget("btn_change"),this,this.onClickChangeBtn);
        UITools.addClickEvent(this.getWidget("btn_sure"),this,this.onClickSureBtn);


        this.CheckBox_xipai = this.getWidget("CheckBox_xipai");
        this.CheckBox_xipai.visible = this.optItem.data.xipaiSet == 1;
        this.CheckBox_xipai.setSelected(false);
        if (this.optItem.data.ext && JSON.parse(this.optItem.data.ext).xipaiConfig == "1") {
            this.CheckBox_xipai.setSelected(true);
        }
        this.addCustomEvent("sy_change_credit_radio",this,this.onChangeCredit);

        this.getConfigData(); 
    },

    updateListView:function(data){
        this.listview_item.removeAllChildren();
        this.title_tip_2.setString("当前亲友圈比例 1:" + data.creditRate);
        for(var i = 0;i<data.dataList.length;++i){
            var item = this.item_opt.clone();
            this.setItemWithData(item,data.dataList[i],i);
            this.listview_item.pushBackCustomItem(item);
        }
    },

    setItemWithData:function(item,data,idx){
        item.setVisible(true);
        var label_idx = item.getChildByName("label_idx");
        var label_qujian = item.getChildByName("label_qujian");
        var label_can_opt = item.getChildByName("label_can_opt");
        var btn_change = item.getChildByName("btn_change");
        btn_change.idx = idx;

        var minValue = data.minValue || 0;
        var maxValue = data.maxValue || 0;
        var preValue = data.preValue || 0;
        var myValue = data.myValue || 0;

        minValue = MathUtil.toDecimal(minValue/100);
        maxValue = MathUtil.toDecimal(maxValue/100);
        preValue = MathUtil.toDecimal(preValue/100);
        myValue = MathUtil.toDecimal(myValue/100);

        btn_change.canOpt = MathUtil.toDecimal(maxValue - preValue);

        label_idx.setString(idx + 1);
        label_qujian.setString(minValue + "-" + maxValue);
        label_can_opt.setString("" + btn_change.canOpt);

        this.setItemMyCredit(item,myValue,idx);
    },

    setItemMyCredit:function(item,credit,idx){
        var label_give_self = item.getChildByName("label_give_self");
        this.defaultValues[idx] = credit;

        var data_2 = MathUtil.toDecimal(credit/2);
        var data_3 = MathUtil.toDecimal(credit/3);
        var data_4 = MathUtil.toDecimal(credit/4);
        label_give_self.setString(credit + "(" + data_2 + "," + data_3 + "," + data_4 + ")");
    },

    getConfigData:function(){
        var self = this;
        NetworkJT.loginReq("groupActionNew", "loadCommissionConfig", {
            userId:PlayerModel.userId ,
            targetUserId:this.optItem.opUserId || 0,
            groupId:ClickClubModel.getCurClubId(),
            sessCode:PlayerModel.sessCode,
        }, function (data) {
            cc.log("=========getConfigData========" + JSON.stringify(data));
            self.updateListView(data.message);

        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    updateConfigData:function(values){
        // cc.log("==============updateConfigData=============" + values);
        var self = this;
        var xipaiValue = 0;
        if (this.CheckBox_xipai.isVisible() && this.CheckBox_xipai.isSelected()){
            xipaiValue = 1;
        }
        NetworkJT.loginReq("groupActionNew", "updateCommissionConfig", {
            userId:PlayerModel.userId ,
            targetUserId:this.optItem.opUserId || 0,
            groupId:ClickClubModel.getCurClubId(),
            sessCode:PlayerModel.sessCode,
            values:values,
            xipai:xipaiValue,
        }, function (data) {
            //cc.log("=========updateConfigData========" + JSON.stringify(data));
            if(data.code == 0){
                //SyEventManager.dispatchEvent(SyEvent.UPDATA_CREDIT_RATIO);
                FloatLabelUtil.comText("修改成功");
                self.onCloseHandler();
            }

        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onClickChangeBtn:function(sender){
        var mc = new ClubCreditRatioPop({idx:sender.idx,myRate:sender.canOpt,teamRadit:this.defaultValues[sender.idx]},1);
        PopupManager.addPopup(mc);
    },

    onChangeCredit:function(event){
        var data = event.getUserData();

        var item = this.listview_item.getItem(data.idx);
        if(item){
            this.setItemMyCredit(item,data.credit,data.idx);
        }
    },

    onClickSureBtn:function(){
        var self = this;
        var tip = "确定后该下级将按最新赠送分成值进行分成，是否确定修改？";
        AlertPop.show(tip,function(){
            //cc.log("self.defaultValues===",self.defaultValues);
            if (self.defaultValues){
                for(var i = 0;i < self.defaultValues.length;i++){
                    self.defaultValues[i] = Math.round(self.defaultValues[i]*100);
                }
            }
            var values = self.defaultValues.join(",");
            //cc.log("values===",values);
            self.updateConfigData(values);
        });
    },
});