/**
 * Created by Administrator on 2016/6/27.
 */

var TingPaiResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("TingPaiResponder::"+JSON.stringify(message));
        SyEventManager.dispatchEvent(SyEvent.SHOW_TING_CARDS,{huCards:message.majiangIds});
    }
})