/**
 * Created by lww on 2020/5/19.
 */

var BeansConfigListResResponder = BaseResponder.extend({
    respond:function(message){
        cc.log("BeansConfigListResResponder:"+JSON.stringify(message));
        BeansConfigModel.init(message);
        // SyEventManager.dispatchEvent(SyEvent.GOID_AREA_GAMES,message.list);
    }
})