/**
 * Created by Administrator on 2016/6/27.
 */
var PlayDTZMessageSeq = {

    lastTime:0,
    isPlay:false,
    sequenceArray:[],
    intvalArray:[],
    dt:0,
    closingMsg:null,
    closingMsgHasSend:true,
    currentlyMsg:null,
    beginMsg:null,
    beginMsgHasSend:true,

    /**
     * 缓存 发牌消息(金币场)
     * @param dt
     */
    cacheBeginMsg:function(msg){
        this.beginMsg = msg;
        this.beginMsgHasSend = false;
    },

    getBeginMsg:function(){
        return this.beginMsg;
    },

    /**
     * 缓存住结算的消息
     */
    cacheClosingMsg:function(msg){
        this.closingMsg = msg;
        this.closingMsgHasSend = false;
    },

    updateDT:function(dt){
        this.dt += dt;
        var intval = this.sequenceArray.length>0 ? this.sequenceArray[0].intval : 0.8;
        if(this.dt>=intval) {
            this.dt = 0;
            if (this.isNeedPlay()) {
                this.playNextMessage();
            } else if (this.sequenceArray.length == 0 && this.closingMsg != null && !this.closingMsgHasSend) {
                this.closingMsgHasSend = true;
                SyEventManager.dispatchEvent(SyEvent.OVER_PLAY, this.closingMsg);
            }
        }
    },

    clean:function(){
        this.dt = 0;
        this.lastTime = 0;
        this.isPlay = false;
        this.sequenceArray.length=0;
        this.currentlyMsg = null;
        this.closingMsg = null;
        this.closingMsgHasSend = false;
    },

    /**
     * 播放下一个消息
     */
    playNextMessage:function(){
        if(this.sequenceArray.length>0){
            this.isPlay = true;
            var message = this.sequenceArray.shift();
            this.currentlyMsg = message;
            this.dispatch(message);
        }
    },

    /**
     * 是否还有剩余消息需要播放
     * @returns {boolean}
     */
    isNeedPlay:function(){
        if(this.isPlay || this.sequenceArray.length==0)
            return false;
        return true;
    },

    /**
     * 完成消息播放
     */
    finishPlay:function(){
        this.isPlay = false;
        this.dt = 0;
        //cc.log("finishPlay---------------------");
    },

    /**
     * 收到新消息,如果间隔过短，放入队列
     * @param message
     */
    receive: function(message) {
        var now = new Date().getTime();
        var needUserQue = (DTZRoomModel.is3Ren() || (DTZRoomModel.is2Ren() && DTZRoomModel.isBida()));

        var delay = (needUserQue && message.cardIds.length==0); //(DTZRoomModel.is3Ren() && message.cardIds.length==0);
        if((now-this.lastTime)<600 || this.sequenceArray.length>0 || this.isPlay || delay){
            message.intval = delay ? 1.2 : 0.3;
            this.sequenceArray.push(message);
        }else{
            this.isPlay = true;
            this.dispatch(message);
            this.currentlyMsg = message;
        }
        this.lastTime = now;
    },

    dispatch: function(message) {
        DTZRoomModel.letOutCard(message);
    }
}

var PlayQFMessageSeq = {

    lastTime:0,
    isPlay:false,
    sequenceArray:[],
    intvalArray:[],
    dt:0,
    closingMsg:null,
    closingMsgHasSend:true,
    currentlyMsg:null,

    /**
     * 缓存住结算的消息
     */
    cacheClosingMsg:function(msg){
        this.closingMsg = msg;
        this.closingMsgHasSend = false;
    },

    updateDT:function(dt){
        this.dt += dt;
        var intval = this.sequenceArray.length>0 ? this.sequenceArray[0].intval : 0.8;
        if(this.dt>=intval) {
            this.dt = 0;
            if (this.isNeedPlay()) {
                this.playNextMessage();
            } else if (this.sequenceArray.length == 0 && this.closingMsg != null && !this.closingMsgHasSend) {
                this.closingMsgHasSend = true;
                SyEventManager.dispatchEvent(SyEvent.OVER_PLAY, this.closingMsg);
            }
        }
    },

    clean:function(){
        this.dt = 0;
        this.lastTime = 0;
        this.isPlay = false;
        this.sequenceArray.length=0;
        this.currentlyMsg = null;
        this.closingMsg = null;
        this.closingMsgHasSend = false;
    },

    /**
     * 播放下一个消息
     */
    playNextMessage:function(){
        if(this.sequenceArray.length>0){
            this.isPlay = true;
            var message = this.sequenceArray.shift();
            this.currentlyMsg = message;
            this.dispatch(message);
        }
    },

    /**
     * 是否还有剩余消息需要播放
     * @returns {boolean}
     */
    isNeedPlay:function(){
        if(this.isPlay || this.sequenceArray.length==0)
            return false;
        return true;
    },

    /**
     * 完成消息播放
     */
    finishPlay:function(){
        this.isPlay = false;
        this.dt = 0;
        //cc.log("finishPlay---------------------");
    },

    /**
     * 收到新消息,如果间隔过短，放入队列
     * @param message
     */
    receive: function(message) {
        var now = new Date().getTime();
        var needUserQue = true;
        var delay = false;
        if (message.isUpdate){
            delay = true;
        }else{
            delay = (needUserQue && message.cardIds.length==0); //(QFRoomModel.is3Ren() && message.cardIds.length==0);
        }
        if((now-this.lastTime)<600 || this.sequenceArray.length>0 || this.isPlay || delay){
            message.intval = delay ? 1.2 : 0.3;
            if (message.isUpdate) {
                message.intval = 0;
            }
            this.sequenceArray.push(message);
        }else{
            this.isPlay = true;
            this.dispatch(message);
            this.currentlyMsg = message;
        }
        this.lastTime = now;
    },

    dispatch: function(message) {
        if (message.isUpdate){
            PlayQFMessageSeq.finishPlay();
            SyEventManager.dispatchEvent(SyEvent.QF_DEAL_SCORE,message.params);
        }else{
            QFRoomModel.letOutCard(message);
        }
    }
}

/**
 * Created by Administrator on 2016/6/27.
 * 跑得快 出牌消息队列
 */
var PlayPDKMessageSeq = {

    lastTime:0,
    isPlay:false,
    sequenceArray:[],
    intvalArray:[],
    dt:0,
    closingMsg:null,
    closingMsgHasSend:true,
    currentlyMsg:null,
    beginMsg:null,
    beginMsgHasSend:true,

    /**
     * 缓存 发牌消息(金币场)
     * @param dt
     */
    cacheBeginMsg:function(msg){
        this.beginMsg = msg;
        this.beginMsgHasSend = false;
    },

    getBeginMsg:function(){
        return this.beginMsg;
    },

    /**
     * 缓存住结算的消息
     */
    cacheClosingMsg:function(msg){
        this.closingMsg = msg;
        this.closingMsgHasSend = false;
    },

    updateDT:function(dt){
        this.dt += dt;
        var intval = this.sequenceArray.length>0 ? this.sequenceArray[0].intval : 0.8;
        if(this.dt>=intval) {
            this.dt = 0;
            if (this.isNeedPlay()) {
                this.playNextMessage();
            } else if (this.sequenceArray.length == 0 && this.closingMsg != null && !this.closingMsgHasSend) {
                this.closingMsgHasSend = true;
                SyEventManager.dispatchEvent(SyEvent.OVER_PLAY, this.closingMsg);
            }
        }
    },

    clean:function(){
        this.dt = 0;
        this.lastTime = 0;
        this.isPlay = false;
        this.sequenceArray.length=0;
        this.currentlyMsg = null;
        this.closingMsg = null;
        this.closingMsgHasSend = false;
    },

    /**
     * 播放下一个消息
     */
    playNextMessage:function(){
        if(this.sequenceArray.length>0){
            this.isPlay = true;
            var message = this.sequenceArray.shift();
            this.currentlyMsg = message;
            this.dispatch(message);
        }
    },

    /**
     * 是否还有剩余消息需要播放
     * @returns {boolean}
     */
    isNeedPlay:function(){
        if(this.isPlay || this.sequenceArray.length==0)
            return false;
        return true;
    },

    /**
     * 完成消息播放
     */
    finishPlay:function(){
        this.isPlay = false;
        this.dt = 0;
        //cc.log("finishPlay---------------------");
    },

    /**
     * 收到新消息,如果间隔过短，放入队列
     * @param message
     */
    receive: function(message) {
        var now = new Date().getTime();

        var delay = ( message.cardIds.length==0);//是否是"要不起"消息
        if((now-this.lastTime)<600 || this.sequenceArray.length>0 || this.isPlay || delay){
            message.intval = delay ? 0.5 : 0.3;
            this.sequenceArray.push(message);
        }else{
            if(BaseXiPaiModel.isNeedXiPai){
                this.sequenceArray.push(message);
            }else{
                this.isPlay = true;
                this.dispatch(message);
                this.currentlyMsg = message;
            }
        }
        this.lastTime = now;
    },

    dispatch: function(message) {
        //cc.log("播放跑得快下一条消息..." , JSON.stringify(message));
        PDKRoomModel.letOutCard(message);
    }
}

var PlayWZQMessageSeq = {
    lastTime:0,
    isPlay:false,
    sequenceArray:[],
    intvalArray:[],
    dt:0,
    closingMsg:null,
    closingMsgHasSend:true,
    currentlyMsg:null,

    /**
     * 缓存住结算的消息
     */
    cacheClosingMsg:function(msg){
        this.closingMsg = msg;
        this.closingMsgHasSend = false;
    },

    updateDT:function(dt){
        this.dt += dt;
        var intval = this.sequenceArray.length>0 ? this.sequenceArray[0].intval : 0.8;
        if(this.dt>=intval) {
            this.dt = 0;
            if (this.isNeedPlay()) {
                this.playNextMessage();
            } else if (this.sequenceArray.length == 0 && this.closingMsg != null && !this.closingMsgHasSend) {
                this.closingMsgHasSend = true;
                SyEventManager.dispatchEvent(SyEvent.OVER_PLAY, this.closingMsg);
            }
        }
    },

    clean:function(){
        this.dt = 0;
        this.lastTime = 0;
        this.isPlay = false;
        this.sequenceArray.length=0;
        this.currentlyMsg = null;
        this.closingMsg = null;
        this.closingMsgHasSend = false;
    },

    /**
     * 播放下一个消息
     */
    playNextMessage:function(){
        if(this.sequenceArray.length>0){
            this.isPlay = true;
            var message = this.sequenceArray.shift();
            this.currentlyMsg = message;
            this.dispatch(message);
        }
    },

    /**
     * 是否还有剩余消息需要播放
     * @returns {boolean}
     */
    isNeedPlay:function(){
        if(this.isPlay || this.sequenceArray.length==0)
            return false;
        return true;
    },

    /**
     * 完成消息播放
     */
    finishPlay:function(){
        this.isPlay = false;
        this.dt = 0;
        //cc.log("finishPlay---------------------");
    },

    /**
     * 收到新消息,如果间隔过短，放入队列
     * @param message
     */
    receive: function(message) {
        var now = new Date().getTime();
        var needUserQue = true;
        var delay = false;
        if (message.isUpdate){
            delay = true;
        }else{
            delay = (needUserQue && message.cardIds.length==0); //(QFRoomModel.is3Ren() && message.cardIds.length==0);
        }
        if((now-this.lastTime)<600 || this.sequenceArray.length>0 || this.isPlay || delay){
            message.intval = delay ? 1.2 : 0.3;
            if (message.isUpdate) {
                message.intval = 0;
            }
            this.sequenceArray.push(message);
        }else{
            if(BaseXiPaiModel.isNeedXiPai){
                this.sequenceArray.push(message);
            }else{
                this.isPlay = true;
                this.dispatch(message);
                this.currentlyMsg = message;
            }
        }
        this.lastTime = now;
    },

    dispatch: function(message) {
        if (message.isUpdate){
            PlayWZQMessageSeq.finishPlay();
            //SyEventManager.dispatchEvent(SyEvent.QF_DEAL_SCORE,message.params);
        }else{
            WZQRoomModel.letOutCard(message);
        }
    }
}

var PlayCardResponder = BaseResponder.extend({

    respond:function(message){
        //cc.log("PlayCardResponder::"+JSON.stringify(message));
        var isPDK = (LayerManager.isInPDK());
        var isDTZ = (LayerManager.isInDTZ());
        var isBBT = (LayerManager.getCurrentLayer()==LayerFactory.BBT_ROOM);
        var isDDZ = (LayerManager.isInDDZ());
        var isQF = (LayerManager.getCurrentLayer()==LayerFactory.QF_ROOM);
        var isWZQ = (LayerManager.getCurrentLayer()==LayerFactory.WZQ_ROOM);
        if(isPDK){//跑得快金币场和普通模式都使用消息队列模式
            PlayPDKMessageSeq.receive(message);
        }else if(isQF){
            PlayQFMessageSeq.receive(message);
        }else if(isDTZ){
            PlayDTZMessageSeq.receive(message);
        }else if(isBBT){
            if(message.isPlay == 2){
                PlayBBTMessageSeq.receive(message)
            }else{
                BBTRoomModel.letOutCard(message);
            }
        }else if(isDDZ){
            if(DdzRoomModel.isMoneyRoom()){
                PlayDDZMessageSeq.receive(message);
            }else{
                DdzRoomModel.letOutCard(message);
            }
        }else if(isWZQ){
            WZQRoomModel.letOutCard(message);
        }

        SyEventManager.dispatchTableEvent("PlayCard",message);
    }
})