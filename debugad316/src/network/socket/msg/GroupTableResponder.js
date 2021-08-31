/**
 * Created by cyp on 2019/8/28.
 */
var GroupTableResponder = BaseResponder.extend({

    respond:function(message){
        //cc.log("GroupTableResponder::"+JSON.stringify(message));
        SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ROOMS,message);
    },


});

var HeadImgResponder = BaseResponder.extend({

    respond:function(message){
        //cc.log("HeadImgResponder::"+JSON.stringify(message));
        SyEventManager.dispatchEvent("GET_HEAD_IMG",message);
    },

})