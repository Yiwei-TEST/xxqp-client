/**
 * Created by zhoufan on 2016/1/9.
 */
var BaseResponder = cc.Class.extend({

    respond:function(message){
        throw new Error("BaseResponder sub class must override function respond.....");
    }
})