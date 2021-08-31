/**
 * Created by Administrator on 2016/6/27.
 */

var CqxzMjScoreboardResponder = BaseResponder.extend({
    respond:function(message){
        cc.log("CqxzMjScoreboardResponder::"+JSON.stringify(message));
        SyEventManager.dispatchEvent(SyEvent.CQXZMJ_SCOREBOARD,message);
    }
})