/**
 * Created by zhoufan on 2016/11/10.
 */
//跑胡子前台消息队列
var PlayPHZMessageSeq = {

    lastTime:0,
    isPlay:false,
    sequenceArray:[],
    intvalArray:[],
    dt:0,
    closingMsg:null,
    closingMsgHasSend:true,
    currentlyMsg:null,

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
        var intval = this.sequenceArray.length>0 ? this.sequenceArray[0].intval : 0.6;
        if(this.dt>=intval){
            // cc.log("intval =",intval);
            this.dt = 0;
            if(this.isNeedPlay()){
                //cc.log("PlayPHZMessageSeq::"+intval);
                this.playNextMessage();
            }else if(this.sequenceArray.length==0 && this.closingMsg!=null && !this.closingMsgHasSend){
                this.closingMsgHasSend = true;
                SyEventManager.dispatchEvent(SyEvent.OVER_PLAY,this.closingMsg);
            }
        }
    },

    clean:function(){
        this.dt = 0;
        this.lastTime = 0;
        this.isPlay = false;
        this.sequenceArray.length=0;
        this.currentlyMsg = null;
    },

    /**
     * 播放下一个消息
     */
    playNextMessage:function(){
        if(this.sequenceArray.length>0){
            var message = this.sequenceArray.shift();

            if(message.tingType == 1){
                SyEventManager.dispatchEvent(SyEvent.SHOW_TING_CARDS,{huCards:message.majiangIds});
                return;
            }else if(message.tingType == 2){
                SyEventManager.dispatchEvent(SyEvent.DAPAI_TING,message);
                return;
            }
            if(message.isZZPH_refreshScore_5100){
                SyEventManager.dispatchEvent(SyEvent.ZZPH_REFRESH_SCORE,message);
                return;
            }

            this.isPlay = true;
            this.currentlyMsg = message;
            PHZRoomModel.letOutCard(message);
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
    },

    /**
     * 收到新消息,如果间隔过短，放入队列
     * @param message
     */
    receive:function(message){
        var now = new Date().getTime();
        // cc.log("now =",now);
        if((now-this.lastTime)<1000 || this.sequenceArray.length>0 || this.isPlay || message.actType==1){
            // cc.log("receiveMessage::"+JSON.stringify(message));
            var actType = message.actType;
            //message.intval = (actType==1) ? 2 : 1.5;
            // var stop_intval = PHZSetModel.cpsd?0.4 + (PHZSetModel.cpsd-1)*0.10:0.4;
            var stop_intval = 0.4;
            // cc.log("stop_intval =",stop_intval);
            message.intval = (actType==1) ? stop_intval : 0.6;
            if(actType==0){
                var action = message.action;
                if (action == 16){
                    message.intval = stop_intval;
                }
                if (message.seat == PHZRoomModel.mySeat){
                    if( action==PHZAction.CHI || action==PHZAction.PENG
                        || action==PHZAction.GUO || action==PHZAction.HU){//玩家的主动操作，直接展示
                        message.intval = 0.01;
                    }
                }else{
                    if( action==PHZAction.CHI || action==PHZAction.PENG
                        || action==PHZAction.GUO || action==PHZAction.HU){//玩家的主动操作，直接展示
                        message.intval = 0.01;
                        if (action==PHZAction.HU){
                            message.intval = 0.5;
                        }
                    }
                }
            }else{
                var action = message.action;
                if(actType==1){//系统摸牌,在过的操作之后，那么直接展示
                    if(this.currentlyMsg && this.currentlyMsg.action==PHZAction.GUO){
                        message.intval = 0.6;
                        if (action == PHZAction.MO_PAI){
                            message.intval = stop_intval;
                        }
                    }
                }else{//玩家出牌,直接展示
                    message.intval = 0.01;
                }
            }
            // cc.log("intval::"+message.intval+" msg::"+JSON.stringify(message));
            this.sequenceArray.push(message);
        }else{
            if(BaseXiPaiModel.isNeedXiPai){
                this.sequenceArray.push(message);
            }else{
                this.isPlay = true;
                PHZRoomModel.letOutCard(message);
                this.currentlyMsg = message;
            }
            // cc.log("letOutCard::"+JSON.stringify(message));
        }
        // cc.log("intval::"+message.intval+" msg::"+JSON.stringify(message));
        this.lastTime = now;
    },

    receiveTingMsg:function(type,message){
        message.tingType = type;
        message.intval = 0;
        this.sequenceArray.push(message);
    },

    receiveZZPHMsg:function(message){
        message.intval = 0;
        message.isZZPH_refreshScore_5100 = true;
        this.sequenceArray.push(message);
    },

}
var PlayPaohuziResponder = BaseResponder.extend({

    respond:function(message){
        //cc.log("PlayPaohuziResponder::"+JSON.stringify(message));
        //PHZRoomModel.letOutCard(message);
        PlayPHZMessageSeq.receive(message);
    }
})