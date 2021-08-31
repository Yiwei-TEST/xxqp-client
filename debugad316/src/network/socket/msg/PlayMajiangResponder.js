/**
 * Created by Administrator on 2016/6/27.
 */
var PlayMJMessageSeq = {

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
            //cc.log("playNextMessage::"+JSON.stringify(message));
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
        var action = message.action;
        var seat = message.seat;
        var delay = (action == MJAction.HU || action == MJAction.CHU_PAI) && (MJRoomModel.isTing(seat) || MJRoomModel.isHued(seat));
        if((now-this.lastTime)<600 || this.sequenceArray.length>0 || this.isPlay || delay){
            var delayTime = MJRoomModel.isGuCang() ? 0.5 : 1.2;
            message.intval = delay ? delayTime : 0.3;
            if (delay && seat == MJRoomModel.mySeat) {
                message.intval = 0.3;
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
            //cc.log("PlayMajiangResponder2::"+JSON.stringify(message));
        }
        this.lastTime = now;
    },

    dispatch: function(message) {
        cc.log("PlayMajiangResponder::"+JSON.stringify(message));
        if(message.hasOwnProperty("dapaiTingpai")){//报听消息
            SyEventManager.dispatchEvent(SyEvent.DA_PAI_TING_PAI_LIST, message);
        }else if (message.hasOwnProperty("action")) {
            MJRoomModel.letOutCard(message);
        } else {
            //补花后摸牌
            if(message.hasOwnProperty("majiangId")){
                MJRoomModel.buHuaMoPai(message);
            }else{
                MJRoomModel.moPai(message);
            }
        }
    }
}
var PlayMajiangResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("PlayMajiangResponder::"+JSON.stringify(message));
        //MJRoomModel.letOutCard(message);
        var time = 4000;
        if(BaseXiPaiModel.isNeedXiPai){
            setTimeout(function(){
                MJRoomModel.letOutCard(message);
            },time);
        }else{
            MJRoomModel.letOutCard(message);
        }
    }
})