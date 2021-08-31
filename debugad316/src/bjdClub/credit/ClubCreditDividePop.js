/**
 * Created by cyp on 2019/5/16.
 */
var ClubCreditDividePop = BasePopup.extend({
    ctor:function(optItem){
        this.optItem = optItem;
        this.defaultValues = [0,0,0,0,0,0,0,0,0,0];

        this._super("res/clubCreditDividePop.json");
    },

    selfRender:function(){

        this.listview_item = this.getWidget("listview_item");
        this.item_opt = this.getWidget("item_opt");
        this.item_opt.setVisible(false);

        this.getConfigData();
    },

    updateListView:function(data){
        this.listview_item.removeAllChildren();
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

        var minValue = data.minValue || 0;
        var maxValue = data.maxValue || 0;
        var preValue = data.preValue || 0;
        var myValue = data.myValue || 0;

        minValue = MathUtil.toDecimal(minValue/100);
        maxValue = MathUtil.toDecimal(maxValue/100);
        preValue = MathUtil.toDecimal(preValue/100);

        var optValue = MathUtil.toDecimal(maxValue - preValue);


        label_idx.setString(idx + 1);
        label_qujian.setString(minValue + "-" + maxValue);
        label_can_opt.setString(optValue);
    },

    getConfigData:function(){
        var self = this;
        NetworkJT.loginReq("groupActionNew", "loadCommissionConfig", {
            userId:PlayerModel.userId ,
            targetUserId:this.optItem.opUserId || 0,
            groupId:ClickClubModel.getCurClubId(),
            sessCode:PlayerModel.sessCode
        }, function (data) {
            //cc.log("=========getConfigData========" + JSON.stringify(data));
            self.updateListView(data.message);

        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    }
});