/**
 * Created by cyp on 2020/1/16.
 * 亲友圈牌桌数据预处理
 */
var PyqDataHandler = cc.Class.extend({
    localTableData:{},
    handleServerData:function(tables){
        this.localTableData = {};
        for(var i = 0;i<tables.length;++i){
            var item = tables[i];
            this.localTableData[Number(item.tableId)] = item;
        }
    },

    removeTableId:function(tableId){
        delete this.localTableData[tableId];
    },

    getItemData:function(tableId){
        return this.localTableData[tableId];
    },

    //判断两个牌桌数据是否一样
    isDataSame:function(data1,data2){
        if(Number(data1.tableId) != Number(data2.tableId))return false;
        if(data1.notStart != data2.notStart)return false;
        if(data1.currentCount != data2.currentCount)return false;
        if(data1.members.length != data2.members.length)return false;
        if(data1.playedBureau != data2.playedBureau)return false;

        for(var i = 0;i<data1.members.length;++i){
            if(Number(data1.members[i].userId) != Number(data2.members[i].userId))return false;
            if(data1.members[i].isOnLine != data2.members[i].isOnLine)return false;
        }

        return true;
    },
});