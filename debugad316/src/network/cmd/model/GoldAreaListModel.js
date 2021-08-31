/**
 * Created by Administrator on 2016/6/24.
 */
var GoldAreaListModel = {
    clickClubId:0,
    goldAreaList:[],     //所有地区的配置
    goldClubList:[],     //所有的亲友圈的列表
    clickClubRole:0,
    curRoomConfigCommon:[],     //常用玩法房间的配置
    localRoomConfigCommon:[],
    // isGoldRoom:false,


    clearAreaData:function(){
        this.curAreaListConfig = [];
        this.clickClubId = 0;
        // this.isGoldRoom = false;
        this.goldClubList = [];
        this.localRoomConfigCommon = [];

    },

    init:function(data){
        this.goldAreaList = data;
    },

    updateRoomConfigCommon:function(roomData){
        if (roomData){
            var localConfig = UITools.getLocalJsonItem("gold_room_config_common");
            var curRoomConfigCommon = localConfig ?  localConfig : [];
            var data = roomData;
            data.keyId = Number(roomData.keyId);
            data.areaId = Number(roomData.areaId);
            // cc.log("1111111111updateRoomConfigCommon==",JSON.stringify(curRoomConfigCommon))
            if (curRoomConfigCommon && curRoomConfigCommon.length > 0){
                var isAdd= false;
                for (var i = 0; i < curRoomConfigCommon.length; i++) {
                    if (Number(data.keyId) == Number(curRoomConfigCommon[i])){
                        curRoomConfigCommon.splice(i,1);
                        curRoomConfigCommon.unshift(data.keyId +"");
                        isAdd = true;
                    }
                }
                if (!isAdd){
                    if (curRoomConfigCommon.length >= 10){
                        curRoomConfigCommon.splice(0,1);
                    }
                    curRoomConfigCommon.unshift(data.keyId +"");
                }
            } else{
                curRoomConfigCommon = [];
                curRoomConfigCommon.unshift(data.keyId +"")
            }
            // this.localRoomConfigCommon = curRoomConfigCommon;
            // cc.log("222222222updateRoomConfigCommon==",JSON.stringify(curRoomConfigCommon))
            UITools.setLocalJsonItem("gold_room_config_common",curRoomConfigCommon);
        }
    },

    updataRoomConfigCommon:function(data){
        this.localRoomConfigCommon = [];
        this.localRoomConfigCommon = data;
        var curRoomConfigCommon = [];
        for (var i = 0; i < data.length; i++) {
            curRoomConfigCommon.push(data[i].keyId + "")
        }
        // cc.log("updataRoomConfigCommon===",JSON.stringify(this.localRoomConfigCommon))
        UITools.setLocalJsonItem("gold_room_config_common",curRoomConfigCommon);
    },

    getlocalRoomConfigCommon:function(){
        var localConfig = UITools.getLocalJsonItem("gold_room_config_common");
        var curRoomConfigCommon = localConfig ?  localConfig : [];
        return curRoomConfigCommon;
    },

    getAreaData:function(){
        return this.goldAreaList;
    },

    getCommonAreaID:function(){
        var curAreaKeyId = cc.sys.localStorage.getItem("GOLD_AREA_SELECTED");
        if (!curAreaKeyId || curAreaKeyId == ""){
            for(var i = 0;i < this.goldAreaList.length;i++){
                curAreaKeyId = this.goldAreaList[0].keyId;
                break;
            }
        }
        curAreaKeyId = curAreaKeyId || 1;
        // cc.log("getCommonAreaID==",curAreaKeyId)
        return curAreaKeyId;
    },


    /**
     * 是否是俱乐部创建者
     */
    isClubCreater:function(){
        return this.clickClubRole == 1;
    },

    /**
     * 是否是俱乐部管理员
     */
    isClubLeader:function(){
        return this.clickClubRole == 2;
    },

    /**
     * 是否是俱乐部创建者或管理员
     */
    isClubCreaterOrLeader:function(){
        return this.clickClubRole == 1 || this.clickClubRole == 2
    },

    /**
     * 获取我在当前俱乐部的身份
     */
    getCurClubRole:function(){
        return this.clickClubRole;
    },

    /**
     * 是否是俱乐部普通成员
     */
    isClubNormalMember:function(){
        return this.clickClubRole == 90000;
    },
}