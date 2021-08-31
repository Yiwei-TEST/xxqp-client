/**
 * Created by admin on 2017/7/26.
 */
var PDKClickRecordModel = {
    roomId:0,
    tims:0,
    playData:[],
    winorLoss:0,
    index:0,
    playerType:0,


    init:function(curData){
        if(curData){
            this.roomId = curData.roomId;
            this.times = curData.times;
            this.playData = curData.playData;
            this.winorLoss = curData.winorLoss;
            this.index = curData.index;
            this.playerType = curData.playerType;

            cc.log("PDK 或者 PHZ 玩家点击的那一条战绩..." , JSON.stringify(curData));
        }
    }
}