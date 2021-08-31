/**
 * Created by leiwenwen on 2020/8/11.
 */
var WebSocketQueue = cc.Class.extend({

    ctor: function() {
        this._dealerQueue = [];
        this._isLoading = false;
        this._dt = 5;
        this._url = null;
    },

    /**
     * scheduler
     * @param dt
     */
    update: function(dt) {
        this._dt += dt;
        if (this._dt >= 3) {
            if (this._dealerQueue.length > 0) {
                this._dt = 0;
                this.startDeal();
            }
        }
    },

    /**
     * 将所有请求的数据加入队列
     * @param sockrt
     */
    push: function(sockrt) {
        cc.log("this._dealerQueue================");
        this._dealerQueue.push(sockrt);
        if (this._dealerQueue.length == 1){
            this._dt = 5;
        }
    },

    /**
     * 开始处理请求
     */
    startDeal: function() {
       //cc.log("startDeal================",this._dealerQueue.length)
        if (this._dealerQueue.length > 0) {
            var currently = this._dealerQueue.shift();
            var code = currently.code;
            var tag = currently.tag;
            var self = this;
            //cc.log("currently=======",JSON.stringify(currently));
            if (code == 1){
                var jsonParams = currently.jsonParams;
                sySocket.reconnect(jsonParams,tag);
            }else if (code == 2){
                // self.stopDeal();
                var callback = currently.callback;
                sySocket.redisconnect(callback,tag);
            }
        }
    },


    /**
     * 停止处理请求
     */
    stopDeal: function() {
        //只有存在未完成的load任务的时候，才做标记
        this._isLoading = false;
        this._dealerQueue.length = 0;
    }
});