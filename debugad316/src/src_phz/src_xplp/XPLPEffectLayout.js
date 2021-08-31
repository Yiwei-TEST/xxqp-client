/**
 * Created by Administrator on 2020/6/3.
 */
var XPLPEffectLayout = cc.Class.extend({

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
    }

})