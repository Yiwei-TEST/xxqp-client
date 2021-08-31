/**
 * Created by zhoufan on 2017/8/14.5
 */
var MJEffectLayout = cc.Class.extend({

    ctor: function(root, room) {
        this.root = root;
        this.room = room;
        this.jettonEffTimeId = 0;
        this.jettonOtherTimeId = 0;
    },

    /**
     * 清理一些缓存数据
     */
    cleanData:function(){
        if(this.jettonEffTimeId>0){
            clearTimeout(this.jettonEffTimeId);
        }
        if(this.jettonOtherTimeId>0){
            clearTimeout(this.jettonOtherTimeId);
        }
    },

    /**
     * 筹码飞行特效
     * @param loseActionArray
     * @param winActionArray
     * @param zhuangTarget
     */
    runJettonAction:function(loseActionArray,zhuangTarget){
        var self = this;
        var delay = 1000;
        if(loseActionArray.length>0){
            this.jettonOtherTimeId = setTimeout(function(){
                for(var i=0;i<loseActionArray.length;i++){
                    var fromTarget = loseActionArray[i];
                    MJJetton.runEffect(self.root,fromTarget.target,zhuangTarget,fromTarget.point,true);
                }
            },delay);
        }
        //if(winActionArray.length>0){
        //    if(loseActionArray.length>0){
        //        delay += 1200;
        //    }
        //    this.jettonEffTimeId = setTimeout(function(){
        //        for(var i=0;i<winActionArray.length;i++){
        //            var toTarget = winActionArray[i];
        //            MJJetton.runEffect(self.root,zhuangTarget,toTarget,true);
        //        }
        //    },delay);
        //}
    }

})