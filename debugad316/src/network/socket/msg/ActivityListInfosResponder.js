/**
 * Created by zhoufan on 2017/7/13.
 */
var ActivityListInfosResponder = BaseResponder.extend({

    respond:function(message){
        if (SdkUtil.isReview() || SdkUtil.isYYBReview()) {
            return;
        }


    }
})
