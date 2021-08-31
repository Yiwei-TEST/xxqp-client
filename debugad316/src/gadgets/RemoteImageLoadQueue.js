/**
 * Created by zhoufan on 2018/1/6.
 */
var RemoteImageLoadQueue = cc.Class.extend({

    ctor: function() {
        this._loaderQueue = [];
        this._isLoading = false;
        this._isStop = false;
        this._dt = 0;
    },

    /**
     * scheduler
     * @param dt
     */
    update: function(dt) {
        this._dt += dt;
        if (this._dt >= 0.2) {
            this._dt = 0;
            if (this._loaderQueue.length > 0) {
                if (!this._isLoading) {
                    this.startLoad();
                }
            }
        }
    },

    /**
     * 将所有头像逐一放入队列
     * @param remoteUrl
     * @param finishCallBack
     */
    push: function(remoteUrl, finishCallBack) {
        this._loaderQueue.push({url:remoteUrl, callback:finishCallBack});
        this._dt = 0;
    },

    /**
     * 开始加载
     */
    startLoad: function() {
        if (!this._isLoading && !this._isStop && this._loaderQueue.length > 0) {
            this._isLoading = true;
            var currently = this._loaderQueue.shift();
            var self = this;
            cc.loader.loadImg(currently.url, {width: 252, height: 252}, function (error, img) {
                if (!self._isStop) {
                    if (!error) {
                        currently.callback(img);
                    }
                } else {
                    self._isStop = false;
                }
                self._isLoading = false;
            });
        }
    },

    /**
     * 停止加载
     */
    stopLoad: function() {
        //只有存在未完成的load任务的时候，才做标记
        if (this._isLoading) {
            this._isStop = true;
        }
        this._loaderQueue.length = 0;
    }
});