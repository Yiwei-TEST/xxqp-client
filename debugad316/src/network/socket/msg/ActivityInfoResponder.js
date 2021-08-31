/**
 * Created by zhoufan on 2017/7/13.
 */
var ActivityInfoResponder = BaseResponder.extend({

    respond:function(message){
        if (SdkUtil.isReview() || SdkUtil.isYYBReview()) {
            return;
        }

        var lastTime = new Date().getTime();
        ActivityModel.setLastTime(lastTime);

    }
})
