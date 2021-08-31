/**
 * Created by lww on 2020/5/19.
 */

var GoldRoomAreaListResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("GoldRoomAreaListResponder::"+JSON.stringify(message));
        SyEventManager.dispatchEvent(SyEvent.GOLD_VIEW_REFRESH,message);
        GoldAreaListModel.init(message.list);
        LayerManager.showLayer(LayerFactory.GOLD_LAYER);
    }
})