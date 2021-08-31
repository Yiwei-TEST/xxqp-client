/**
 * Created by lww on 2020/5/19.
 */

var GoldRoomConfigListResponder = BaseResponder.extend({
    respond:function(message){
        cc.log("GoldRoomConfigListResponder::"+JSON.stringify(message));
        if (message && message.code == 4){
            SyEventManager.dispatchEvent(SyEvent.GOLD_UPDATE_CONFIG_COMMON,message.list);
        }else if (message && message.code == 6){
            GoldRoomConfigModel.init(message.list);
            LayerManager.showLayer(LayerFactory.GOLD_LAYER);
            // SyEventManager.dispatchEvent(SyEvent.GOID_AREA_GAMES,message.list);
        }else{
            GoldRoomConfigModel.init(message.list);
            SyEventManager.dispatchEvent(SyEvent.GOID_AREA_GAMES,message.list);
        }
    }
})