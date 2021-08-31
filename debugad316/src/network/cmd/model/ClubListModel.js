/**
 * Created by Administrator on 2016/6/24.
 */
var ClubListModel = {
    clubDataList:[],
    orgData : null,
    clubLocalList:[],


    clearClubData:function(){
        this.clubDataList = [];
        this.orgData = null;
        this.clubLocalList = [];
    },

    init:function(clubDataList){
        this.clearClubData();
        if(clubDataList == null){
            return;
        }
        this.orgData = clubDataList;
        if(clubDataList.length > 0){
            for(var index = 0 ; index < clubDataList.length; index++){
                var formatData = this.dealOneClubData(clubDataList[index]);
                this.clubDataList.push(formatData)
            }
            this.dealClubLocalData();
        }else{
            //cc.log("没有俱乐部...");
        }

    },

    dealOneClubData:function(itemData){
        //cc.log("clubitemData..." , JSON.stringify(itemData));
        var formatData = {};
        //俱乐部号+人数
        formatData.clickId = itemData.groupId;
        formatData.keyId = itemData.groupKeyId;
        formatData.groupName = itemData.groupName;
        formatData.userRole = itemData.userRole;
        formatData.clubImgUrl = itemData.masterImg;
        formatData.clubRoomNum = itemData.tables;
        formatData.clubMemberNum = itemData.currentCount;
        //开关类数据
        formatData.isOpenForbidJoinClub = (itemData.groupMode == 1); //0 可邀请可申请 1只可邀请其他玩家 拒绝申请加入
        formatData.isOpenLeaderPay  = 0; //默认是关闭的  群主支付
        formatData.isOpenCreateRoom = 1; //默认是开启的  成员创房
        formatData.isOpenFastCreate = 1; //默认是开启的  快速创房
        formatData.isAutoCreateRoom = 0; //默认是关闭的  智能开房
        formatData.ksppCount = 0; //默认是关闭的  其他是人数
        formatData.extMsg = {};
        formatData.isOpenCredit = 0;//默认是关闭的  1是开启

        if(itemData.extMsg){
            formatData.extMsg = JSON.parse(itemData.extMsg);
        }
        //cc.log("this.extMsg..." , JSON.stringify(formatData.extMsg));
        if(formatData.extMsg.pc != null){
            formatData.isOpenLeaderPay = (formatData.extMsg.pc == "+p3"); //+p3 开启 -p3关闭
        }
        if(formatData.extMsg.cr != null){
            formatData.isOpenCreateRoom = (formatData.extMsg.cr == "+r"); //+r 开启 -r关闭 别喷前段 我也不知道老李为什么要这么定
            //cc.log("this.isOpenCreateRoom..." , formatData.isOpenCreateRoom);
        }
        if(formatData.extMsg.oq != null){
            formatData.isOpenFastCreate = (formatData.extMsg.oq == "+q"); //+q 开启 -q关闭 别喷前段 我也不知道老李为什么要这么定
            //cc.log("this.isOpenFastCreate..." , formatData.isOpenFastCreate);
        }
        if(formatData.extMsg.ac != null){
            formatData.isAutoCreateRoom = (formatData.extMsg.ac == "+a"); //+a 开启 -a关闭 别喷前段 我也不知道老李为什么要这么定
            //cc.log("this.isAutoCreateRoom..." , formatData.isAutoCreateRoom);
        }

        if(formatData.extMsg.match != null){
            formatData.ksppCount = formatData.extMsg.match; //+a 开启 -a关闭 别喷前段 我也不知道老李为什么要这么定
            //cc.log("formatData.extMsg.match..." , formatData.extMsg.match);
        }

        if(itemData.creditOpen != null){
            formatData.isOpenCredit = itemData.creditOpen;
        }
        return formatData;
    },

    getClubDataById:function(clubId){
        for(var index = 0 ; index < this.clubDataList.length; index++){
            var tClubData = this.clubDataList[index];
            if(clubId == tClubData.clickId){
                return tClubData;
            }
        }
        return null;
    },

    getClubDataByIndex:function(tParamIndex){
        if(tParamIndex < 0 || tParamIndex > this.clubDataList.length){
            return null;
        }else{
            return this.clubDataList[tParamIndex];
        }

    },

    getClubListLength:function(){
        return this.clubDataList.length;
    },

    dealClubLocalData:function(){
        var oldLocalData = UITools.getLocalJsonItem("Club_Local_Data");
        var newLocalData = [];
        for(var i = 0 ; i < this.clubDataList.length; i++){
            var clubId = this.clubDataList[i].clickId;
            var modeId = 0;
            var cwModes = [];
            for(var j = 0 ; j < oldLocalData.length; j++){
                if (clubId == oldLocalData[j].clickId){
                    modeId = oldLocalData[j].bagModeId;
                    cwModes = oldLocalData[j].cwModes || [];
                }
            }
            newLocalData[i] = {};
            newLocalData[i].clickId = clubId;
            newLocalData[i].bagModeId = modeId;//包厢MODEID
            newLocalData[i].cwModes = cwModes;
            //newLocalData[i].wanfa = 0;//包厢MODEID
        }

        this.clubLocalList = newLocalData;
        UITools.setLocalJsonItem("Club_Local_Data",newLocalData);

        //var newLocalData1 = UITools.getLocalJsonItem("Club_Local_Data");
        //cc.log("newLocalData",JSON.stringify(newLocalData1));
        //cc.log("this.clubLocalList",JSON.stringify(this.clubLocalList));
    },

    getClubLocalData:function(){
        return this.clubLocalList;
    },

}