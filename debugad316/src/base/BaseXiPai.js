/**
 * Created by Administrator on 2020/11/24 0016.
 */
var BaseXiPaiModel = {
    isNeedXiPai:false,//是否需要洗牌
    nameList:[],//洗牌玩家名字数组

    clearData:function(){
        this.isNeedXiPai = false;
        this.nameList = [];
        this.isXiPai = false;
    },

    isContinue:function(message){
        var players = message.players || [];
        var isContinue = false;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(p && !isContinue)
                isContinue = (p.handCardIds.length>0 || p.outedIds.length>0 || p.moldCards.length>0);
        }
        return isContinue;
    },
};