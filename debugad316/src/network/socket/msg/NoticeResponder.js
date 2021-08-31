/**
 * Created by Administrator on 2016/7/13.
 */
var NoticeResponder = BaseResponder.extend({

    respond:function(message){
        var mc = new NoticePop(message);
        PopupManager.addPopup(mc);
    }
})