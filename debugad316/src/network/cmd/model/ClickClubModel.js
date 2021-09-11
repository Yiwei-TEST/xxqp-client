/**
 * Created by Administrator on 2016/6/24.
 */
var ClickClubModel = {
    clickClubTime:0,            //上次点击俱乐部某条目的时间
    clickClubObj:null,          //俱乐部cell自身
    clickClubId:0,              //当前的俱乐部id
    clickKeyId:0,               //当前俱乐部keyid
    clickClubName:"",           //俱乐部名字
    clickClubRole:90000,            //我在当前俱乐部的身份 0群主 1管理员 2普通成员
    clickClubIsOpenLeaderPay:0, //当前俱乐部是否开启群主支付
    clickClubIsOpenFastCreate:0,//当前俱乐部是否开启快速创房
    clickClubIsOpenCreate:0,    //当前俱乐部是否开启普通玩家创建房间
    clickClubIsAutoCreate:0,    //当前俱乐部是否开启智能创房
    isOpenForbidJoinClub:0,     //当前俱乐部是否开启禁止申请加入
    clickClubMyTeamId:0,        //我在当前俱乐部的分组id
    clickClubImgUrl:"",
    clickClubKsppCount:0, //开启快速匹配的的人数  0 是不开启
    clickClubIsOpenCredit:0, //当前俱乐部是否开启"比赛房"
    clickClubBagModeId:0,              //当前选择的包厢的modeId
    clickClubAllotMode:1, //当前俱乐部比赛房的分成方式1大赢家分成，2参与分成
    promoterLevel:0,            //拉手等级
    payBindId:"",//俱乐部群主的邀请码
    content:"",//俱乐部公告内容
    refuseInvite:"",//是否拒绝接收邀请消息
    tableInvite:"",//是否禁止亲友圈邀请进入房间
    isBanVoiceAndProps:0,    //当前俱乐部是否禁止语音和道具
    autoQuit:0,//当前俱乐部房间为准备踢出房间的时间，默认不踢出
    negativeCredit:0,//是否可负分
    stopCreate:0,//暂停开房
    tableOrder:2,//空桌前后排序
    creditLock:0,//信用分锁定状态
    dismissCount:0,//解散房间次数
    autoLockCredit:0,//下线自动锁分
    switchCoin:-1,//是否开启金币模式0:关闭，1：开启
    groupLevel:0,
    groupUserLevel:0,
    groupExp:0,
    groupUserExp:0,
    qunzhutichu:0,//仅群主踢出设置
    sameIpLimit:0,//修改同ip禁止进入
    openGpsLimit:0,//修改未开GPS禁止进入
    distanceLimit:0,//修改距离过近禁止进入
    limitTableNum:0,//限制显示已开牌桌数量，0为不限制
    privateRoom:0,//是否开启私密房，0：关闭，1：开启
    cdtlj_kjzs:0,//配置的常德拖拉机开局桌数
    fzb_hide:0,//防作弊显示屏蔽
    forbiddenKickOut:0,//踢出限制
    creditWheel:0,//开启转盘

    clearClubData:function(){
        this.clickClubObj = null;
        this.clickClubId = 0;
        this.clickKeyId = 0;
        this.clickClubName = "";
        this.clickClubRole = 90000;
        this.isOpenForbidJoinClub = 0;
        this.clickClubIsOpenLeaderPay = 0;
        this.clickClubIsOpenCreate = 0 ;
        this.clickClubIsOpenFastCreate = 1;
        this.clickClubIsAutoCreate = 0;
        this.clickClubImgUrl = "";
        this.clickClubRooms = 0;
        this.clickClubMembers = 0;
        this.clickClubMyTeamId = 0;
        this.hasNewMsg = false;
        this.clickClubKsppCount = 0;
        this.clickClubIsOpenCredit = 0;
        this.clickClubBagModeId = 0;              //当前选择的包厢的modeId
        this.clickClubAllotMode = 1;
        this.promoterLevel = 0;
        this.payBindId = "";
        this.content = "";
        this.refuseInvite = "";
        this.tableInvite = "0";
        this.isBanVoiceAndProps = 0;
        this.autoQuit = 0;
        this.negativeCredit = 0;
        this.stopCreate = 0;
        this.tableOrder = 2;
        this.creditLock = 0;
        this.dismissCount = 0;
        this.autoLockCredit = 0;
        this.switchCoin = -1;
        this.groupLevel = 0;
        this.groupUserLevel = 0;
        this.groupExp = 0;
        this.groupUserExp = 0;
        this.qunzhutichu = 0;
        this.sameIpLimit = 0;
        this.openGpsLimit = 0;
        this.distanceLimit = 0;
        this.bagHideData = null;
        this.bgType = 1;
        this.limitTableNum = 0;
        this.privateRoom = 0;
        this.cdtlj_kjzs = 0;
        this.fzb_hide = 0;
        this.forbiddenKickOut = 0;
        this.creditWheel =0;
    },

    init:function(data){
        this.clearClubData();
        this.clickClubId = data.groupId;
        this.clickKeyId = data.groupKeyId;
        this.clickClubName = data.groupName;
        this.clickClubRole = data.userRole;
        this.clickClubIsForbideJoinClub = 0;
        this.clickClubIsOpenLeaderPay = 0;
        this.clickClubIsOpenFastCreate = 1;
        this.clickClubIsOpenCreate = 1;
        this.clickClubIsAutoCreate = 0;
        this.clickClubImgUrl = data.masterImg;
        this.clickClubRooms = data.tables;
        this.clickClubMembers = data.currentCount;
        this.clickClubMyTeamId = data.userGroup;
        this.clickClubTime = new Date();
        this.clickClubKsppCount = 0;
        this.clickClubIsOpenCredit = data.creditOpen || 0;
        this.clickClubAllotMode = data.creditAllotMode || 1;
        this.promoterLevel = data.promoterLevel || 0;
        this.payBindId = data.payBindId || "";
        this.content = data.content || "";
        this.refuseInvite = data.refuseInvite || "";
        this.creditLock = data.creditLock || 0;
        if(data.gLevelMsg){
            this.switchCoin = data.gLevelMsg.switchCoin || 0;
            this.groupLevel = data.gLevelMsg.level;
            this.groupUserLevel = data.guLevelMsg.level;
            this.groupExp = data.gLevelMsg.exp;
            this.groupUserExp = data.guLevelMsg.exp;
        }else{
            this.switchCoin = 0;
            this.groupLevel = 0;
            this.groupUserLevel = 0;
            this.groupExp = 0;
            this.groupUserExp = 0;
        }

        var extMsg = {};
        if(data.extMsg){
            extMsg = JSON.parse(data.extMsg);
        }

        if(extMsg.pc){
            this.clickClubIsOpenLeaderPay = (extMsg.pc == "+p3"); //+p3 开启 -p3关闭
        }
        if(extMsg.oq){
            this.clickClubIsOpenFastCreate = (extMsg.oq == "+q"); //+q 开启 -q关闭 别喷前段 我也不知道老李为什么要这么定
        }
        if(extMsg.cr){
            this.clickClubIsOpenCreate = (extMsg.cr == "+r"); //+r 开启 -r关闭 别喷前段 我也不知道老李为什么要这么定
        }
        if(extMsg.ac){
            this.clickClubIsAutoCreate = (extMsg.ac == "+a"); //+a 开启 -a关闭 别喷前段 我也不知道老李为什么要这么定
        }
        if(extMsg.match){
            this.clickClubKsppCount = extMsg.match; //开启快速匹配的人数，0是关闭
        }
        if(extMsg.chat){
            this.isBanVoiceAndProps = extMsg.chat; //1 禁止 0 开启
        }
        if(extMsg.autoQuit){
            this.autoQuit = extMsg.autoQuit;
        }
        if(extMsg.negativeCredit){
            this.negativeCredit = extMsg.negativeCredit;
        }
        if(extMsg.stopCreate){
            this.stopCreate = extMsg.stopCreate;
        }
        if(extMsg.tableOrder){
            this.tableOrder = extMsg.tableOrder;
        }
        if(extMsg.tableInvite){
            this.tableInvite = extMsg.tableInvite;
        }
        if(extMsg.dismissCount){
            this.dismissCount = extMsg.dismissCount;
        }
        if(extMsg.creditLockOffline){
            this.autoLockCredit = extMsg.creditLockOffline;
        }
        if(extMsg.masterDelete){
            this.qunzhutichu = extMsg.masterDelete;
        }

        if(extMsg.sameIpLimit){
            this.sameIpLimit = extMsg.sameIpLimit;
        }

        if(extMsg.openGpsLimit){
            this.openGpsLimit = extMsg.openGpsLimit;
        }

        if(extMsg.distanceLimit){
            this.distanceLimit = extMsg.distanceLimit;
        }

        if(extMsg.backGround){
            this.bgType = extMsg.backGround;
        }
        if(extMsg.tableNum > 0){
            this.limitTableNum = extMsg.tableNum;
        }
        if(extMsg.privateRoom){
            this.privateRoom = extMsg.privateRoom;
        }
        if(extMsg.creditWheel){
            this.creditWheel = extMsg.creditWheel;
        }
        if(extMsg.cdtuolaji){
            this.cdtlj_kjzs = extMsg.cdtuolaji;
        }
        if(extMsg.fzbHide){
            this.fzb_hide = extMsg.fzbHide;
        }

        if(extMsg.forbiddenKickOut){
            this.forbiddenKickOut = extMsg.forbiddenKickOut;
        }

        this.initClubBagModeId();

    },

    getForbiddenKickOut:function(){
        return this.forbiddenKickOut == 1;
    },

    updateForbiddenKickOut:function(num){
        this.forbiddenKickOut = num;
    },

    /**
     * 时间间隔是否足够 （上一次点击某条俱乐部 和 这一次的时间间隔 必须大于 长连接消息的时间间隔）
     */
    timeEnough:function(){
        if(this.clickClubTime){
            var tNewData = new Date();
            return (tNewData - this.clickClubTime > 1000);
        }else{
            return true;
        }

    },

    getCdtljKjzs:function(){
        return this.cdtlj_kjzs;
    },

    setCdtljKjzs:function(num){
        this.cdtlj_kjzs = num;
    },

    getQunZhuTiChu:function(){
        return this.qunzhutichu == 1;
    },

    updateQunZhuTiChu:function(data){
        this.qunzhutichu = data;
    },

    getSameIpLimit:function(){
        return this.sameIpLimit == 1;
    },

    updateSameIpLimit:function(data){
        this.sameIpLimit = data;
    },

    getOpenGpsLimit:function(){
        return this.openGpsLimit == 1;
    },

    updateOpenGpsLimit:function(data){
        this.openGpsLimit = data;
    },

    getDistanceLimit:function(){
        return this.distanceLimit == 1;
    },

    getIsFzbHide:function(){
        return this.fzb_hide == 1;
    },

    updateDistanceLimit:function(data){
        this.distanceLimit = data;
    },

    getIsSwitchCoin:function(){
        return this.switchCoin == 1
    },

    getIsAutoLock:function(){
        return this.autoLockCredit;
    },

    updateIsAutoLock:function(data){
        this.autoLockCredit = data || 0;
    },

    getCreditLock:function(){
        return this.creditLock;
    },

    updateCreditLock:function(data){
        this.creditLock = data || 0;
    },

    //获取群主的邀请码
    getPayBindId:function(){
        return this.payBindId;
    },

    //获取俱乐部公告
    getClubGongGao:function(){
        return this.content;
    },

    getIsForbidInvite:function(){
        return !(this.tableInvite == "1");
    },

    updateIsForbidInvite:function(data){
        this.tableInvite = data || "";
    },

    getIsRefuseInvite:function(){
        return !(this.refuseInvite == "1");
    },

    updateIsRefuseInvite:function(data){
        this.refuseInvite = data || "";
    },

    getIsBanVoiceAndProps:function(){
        return this.isBanVoiceAndProps == "1";
    },

    updateIsBanVoiceAndProps:function(bool){
        this.isBanVoiceAndProps = bool;
    },

    getAutoQuitData:function(){
        return this.autoQuit;
    },

    updateAutoQuitData:function(data){
        this.autoQuit = data;
    },

    getIsNegativeCredit:function(){
        return this.negativeCredit == "1";
    },

    updateNegativeCredit:function(data){
        this.negativeCredit = data;
    },

    getIsPrivateRoom:function(){
        return this.privateRoom == "1";
    },

    updatePrivateRoom:function(data){
        this.privateRoom = data;
    },

    getIsStopCreate:function(){
        return this.stopCreate == "1";
    },

    updateStopCreate:function(data){
        this.stopCreate = data;
    },

    getTableOrder:function(){
        return this.tableOrder;
    },

    updateTableOrder:function(data){
        this.tableOrder = data;
    },

    /**
     * 刷新解散房间限制次数
     */
    updateDismissCount:function(data){
        this.dismissCount = data;
    },

    /**
     * 获取解散房间限制次数
     */
    getDismissCount:function(){
        return this.dismissCount;
    },

    /**
     * 获取当前俱乐部名字
     */
    getCurClubImgUrl:function(){
        cc.log("clickClubImgUrl..." , this.clickClubImgUrl);
        return this.clickClubImgUrl;
    },


    /**
     * 获取当前俱乐部房间数量
     */
    getCurClubRoomsNum:function(){
        return this.clickClubRooms;
    },

    /**
     * 获取当前俱乐部成员数量
     */
    getCurClubMemberNum:function(){
        return this.clickClubMembers;
    },

    updateClubRoomsNum:function(newNumber){
        this.clickClubRooms = newNumber;
        SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_ROOM_NUMBER , {eventClubId:this.getCurClubId()});
    },


    updateClubMembersNum:function(newNumber){
        this.clickClubMembers = newNumber;
        SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_MEMBER_NUMBER, {eventClubId:this.getCurClubId()});
    },

    updateClubName:function(newName){
        this.clickClubName = newName || "";
        SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_NAME, {eventClubId:this.getCurClubId()});
    },


    /**
     * 是否开启群主支付
     * @returns {number}
     */
    getClubIsOpenLeaderPay:function(){
        return this.clickClubIsOpenLeaderPay;
    },

    /**
     * 是否开启快速创房
     */
    getClubIsOpenFastCreate:function(){
        return this.clickClubIsOpenFastCreate;

    },

    getClubIsOpenCreate:function(){
        return this.clickClubIsOpenCreate ;
    },

    getClubIsOpenAutoCreate:function(){
        return this.clickClubIsAutoCreate;
    },

    /**
     * 是否是可邀请可申请模式
     * @param type
     */
    getClubIsOpenForbidJoinClub:function(){
       return this.clickClubIsForbideJoinClub;
    },

    /**
     * 是否是开启“比赛房”
     * @param type
     */
    getClubIsOpenCredit:function(){
        return this.clickClubIsOpenCredit;
    },

    /**
     * 是否是开启“白金豆房”
     * @param type
     */
    getClubIsGold:function(){
        return this.clickClubIsOpenCredit == 2;
    },

    /**
     * 比赛房分成方式
     * @param type
     */
    getClubAllotMode:function(){
        return this.clickClubAllotMode;
    },

    updateIsOpenForbidJoinClub:function(bool){
        this.clickClubIsForbideJoinClub = bool;
    },

    updateIsFastCreateRoomType:function(type){
        this.clickClubIsOpenFastCreate = type;
    },

    updateIsLeaderPay:function(bool){
        this.clickClubIsOpenLeaderPay = bool;
    },

    updateIsOpenCreateRoom:function(bool){
        this.clickClubIsOpenCreate = bool;
    },

    updateIsAutoCreateRoom:function(bool){
        this.clickClubIsAutoCreate = bool;
    },

    updateKsppCount:function(_count){
        this.clickClubKsppCount = _count;
        SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_CHOOSE_PANEL,{eventClubId:this.getCurClubId()});
    },

    /**
     * 获取快速匹配的人数
     */
    getKsppCount:function(){
        return this.clickClubKsppCount || 0;
    },

    /**
     * 获取当前俱乐部条目
     */
    getCurClubItem:function(){
        return this.clickClubObj || null;
    },

    /**
    * 获取当前俱乐部ID
     */
    getCurClubId:function(){
        return this.clickClubId || 0;
    },

    initClubBagModeId:function(){
        var clubLocalList = ClubListModel.getClubLocalData();
        for(var j = 0 ; j < clubLocalList.length; j++){
            if (this.clickClubId == clubLocalList[j].clickId){
                this.clickClubBagModeId = clubLocalList[j].bagModeId;
            }
        }
        //cc.log("clubLocalList",JSON.stringify(clubLocalList));
        cc.log("this.clickClubBagModeId",this.clickClubBagModeId);
    },

    updateBagModeId:function(clickClubId,modeId){
        cc.log("modeId =", modeId);
        this.clickClubBagModeId = String(modeId);
        var clubLocalList = ClubListModel.getClubLocalData();
        for(var j = 0 ; j < clubLocalList.length; j++){
            if (clickClubId == clubLocalList[j].clickId){
                clubLocalList[j].bagModeId = this.clickClubBagModeId;

                //保存常玩的modeId
                clubLocalList[j].cwModes = clubLocalList[j].cwModes || [];
                clubLocalList[j].cwModes.unshift(this.clickClubBagModeId);
                clubLocalList[j].cwModes = ArrayUtil.uniqueArray(clubLocalList[j].cwModes);
                if(clubLocalList[j].cwModes.length > 5){
                    clubLocalList[j].cwModes.length = 5;
                }
            }
        }
        UITools.setLocalJsonItem("Club_Local_Data",clubLocalList);
    },

    /**
     * 获取当前俱乐部选择的包厢的MOdeId
     */
    getCurClubBagModeId:function(){
        return this.clickClubBagModeId || 0;
    },

    /**
     * 获取当前俱乐部选择的包厢的Id
     */
    getCurClubBagId:function(allBagsData){
        var bagId = 0;
        if (allBagsData){
            for(var index = 0 ; index < allBagsData.length; index++){
                var data = allBagsData[index];
                var modeId = data.config.keyId;
                if (this.clickClubBagModeId == modeId) {
                    bagId = data.config.groupId;
                }
            }
        }
        return bagId;
    },

    /**
     * 获取俱乐部keyId
     */
    getCurClubKeyId:function(){
        return this.clickKeyId || 0;
    },

    /**
     * 获取我在当前俱乐部的身份
     */
    getCurClubRole:function(){
        return this.clickClubRole;
    },

    /**
     * 获取当前俱乐部名字
     */
    getCurClubName:function(){
        return this.clickClubName;
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
     * 是否是俱乐部拉手
     */
    isClubAgency:function(){
        return this.clickClubRole == 20000;
    },

    /**
     * 是否是俱乐部4级拉手
     */
    isClubFourAgency:function(){
        //cc.log("this.promoterLevel",this.promoterLevel);
        if (this.isClubAgency()){
            return this.promoterLevel == 4;
        }
    },

    /**
     * 是否是俱乐部某组的组长
     */
    isClubTeamLeader:function(){
        return this.clickClubRole == 10000;
    },

    /**
     * 是否是俱乐部某组组员
     */
    isClubTeamMembers:function(){
        return this.clickClubMyTeamId != 0;
    },

    /**
     * 获取所属的组keyId
     */
    getClubTeamKeyId:function(){
        return this.clickClubMyTeamId;
    },

    /**
     * 是否是俱乐部普通成员
     */
    isClubNormalMember:function(){
        return this.clickClubRole == 90000;
    },

    /**
     * 是否是俱乐部创建者或管理员
     */
    isClubCreaterOrLeader:function(){
        return this.clickClubRole == 1 || this.clickClubRole == 2
    },

    /**
     * 刷新是否该显示消息红点
     */
    updateClubHasNewMsg:function(data){
        this.hasNewMsg = data;
    },

    /**
     * 是否有未读消息
     */
    isClubHasNewMsg:function(){
        return this.hasNewMsg;
    },

    setCurMyCredit: function (newValue) {
        this.myCreditScore = newValue;
    },

    getCurMyCredit:function() {
        return this.myCreditScore || 0;  
    },
    /**
     * 处理传过来的比赛分设置
     */
    dealClubCreditParms:function(_parms){
        var curParms = [];
        if (_parms && _parms.length > 0 && _parms[8]){
            for(var i = 0;i< _parms.length;i++){
                var credit = _parms[i];
                if ((i >= 1 && i <= 4) || i == 7){
                    credit = MathUtil.toDecimal(credit/100);
                }
                curParms.push(credit);
            }
        }else{
            curParms = _parms;
        }
        return curParms;
    },

    getClubRoleName:function(_role,_level){
        var userRole = _role || this.clickClubRole;
        var promoterLevel = _level;
        var allRoleArr = [
            {name:"会长",    userRole:1},
            {name:"管理",  userRole:2},
            {name:"董事",    userRole:5000},
            {name:"主管",    userRole:10000},
            {name:"管理",    userRole:20000},
            {name:"组长",    userRole:30000},
            {name:"成员",    userRole:90000},
        ];
        var allPartnerArr = [
            {name:"合伙人",    promoterLevel:2},
            {name:"合伙人1",    promoterLevel:3},
            {name:"合伙人2",    promoterLevel:4},
            {name:"合伙人2",    promoterLevel:5},
            {name:"合伙人2",    promoterLevel:6},
            {name:"合伙人2",    promoterLevel:7},
            {name:"合伙人2",    promoterLevel:8},
            {name:"合伙人2",    promoterLevel:9},
            {name:"合伙人2",    promoterLevel:10},
        ];
        var name = "";
        for(var j = 0;j < allRoleArr.length;++j){
            if (userRole == allRoleArr[j].userRole){
                if(userRole == 10000){
                    for(var i = 0;i < allPartnerArr.length;++i){
                        if(promoterLevel == allPartnerArr[i].promoterLevel){
                            name = allPartnerArr[i].name;
                            break;
                        }
                    }
                }else{
                    name = allRoleArr[j].name;
                }
                break;
            }
        }
        return name;
    },

    getBagHideData:function() {
        if(this.bagHideData){
            return this.bagHideData;
        }
        var hideData = cc.sys.localStorage.getItem("WANFA_HIDE_DATA_" + this.clickClubId);
        hideData = hideData ? JSON.parse(hideData) : {};
        this.bagHideData = hideData;
        return hideData;
    },

    getBagIsHide:function(configId){
        var hideData = this.getBagHideData();
        if(hideData[configId] == 1){
            return true;
        }
        return false;
    },

    setBagHideData:function(configId,isHide){
        var hideData = this.getBagHideData();
        hideData[configId] = isHide?1:0;
        this.bagHideData = hideData;
        cc.sys.localStorage.setItem("WANFA_HIDE_DATA_" + this.clickClubId,JSON.stringify(hideData));
    },

}