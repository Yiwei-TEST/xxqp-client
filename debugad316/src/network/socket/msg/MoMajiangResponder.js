/**
 * Created by Administrator on 2016/6/27.
 */
var MoMajiangResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("MoMajiangResponder::"+JSON.stringify(message));
        MJRoomModel.moPai(message);
        if(typeof HBGZPRoomModel !== "undefined"){
            HBGZPRoomModel.moPai(message);
        }
        if(typeof XPLPRoomModel !== "undefined"){
            XPLPRoomModel.moPai(message);
        }
    }
})