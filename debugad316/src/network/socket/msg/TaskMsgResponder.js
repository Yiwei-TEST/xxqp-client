/**
 * Created by zyq on 2020/9/16.
 */

var TypeTaskInfoResponder = BaseResponder.extend({
    respond: function (message) {
        cc.log("TypeTaskInfoResponder::"+JSON.stringify(message));
        TaskInfoModel.init(message)
    }
});

var RefreshTaskProcessResponder = BaseResponder.extend({
    respond: function (message) {
        cc.log("RefreshTaskProcessResponder::"+JSON.stringify(message));
        TaskInfoModel.refreshTaskProcess(message)
    }
});

