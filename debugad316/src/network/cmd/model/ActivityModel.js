/**
 * Created by zhoufan on 2017/5/4.
 */
var ActivityModel = {

    hasOpenByPushMsg:false,//记录是否由后台的推送消息打开过 只由推送消息打开一次(打开游戏要弹出 断线重不弹出) 主动打开另当别论
    isSend:false,
    allActivityList:null,
    lastTime : 0,
    isSendShareMsg:false,
    activityId:null, //当前选择的是哪个活动
    isSendCashActivity:false,
    isCashActivityOpen:false,
    isInvitNewPopOpen:false,
    isIntivingNew:false,
    isAutomaticOpen :false,
    wasOlderBackOpen:false,//是否打开过活动
    isOlderBackBtnOpen:false,//按钮是否要显示
    wasNewUserHasGiftOpen:false,//新人有礼
    isNewUserHasGiftBtnOpen:false,//按钮是否要显示
    isBrokeShare:false,//破产界面分享
    isHomeLayerShare:false,//大厅界面分享

    checkActvity: function() {
        if (!this.isSend) {
            this.sendOpenActivityMsg();
            this.isSend = true;
        }
    },

    initActivityList:function(allActivityList){
        this.allActivityList = allActivityList;
        for(var item in allActivityList){
            if (allActivityList[item].id ==24){
                this.isIntivingNew = true;
                SyEventManager.dispatchEvent(SyEvent.OPEN_INTIVE_BTN);
            }
            if(allActivityList[item].id ==25){
                ActivityModel.isOlderBackBtnOpen = true;
                SyEventManager.dispatchEvent(SyEvent.GET_OLDERBACK_BTN);
            }
            if(allActivityList[item].id ==26){
                ActivityModel.isNewUserHasGiftBtnOpen = true;
                SyEventManager.dispatchEvent(SyEvent.GET_NEWUSERHASGIFT_BTN);
            }
        }
    },

    /**
     * 打开活动面板 获取活动列表数据 和 后台当前第一页活动数据
     */
    sendOpenActivityMsg: function(activityPage) {
        ////params参数第0位 表示请求的操作类型 0打开 1领取 strParams参数第0位 表示请求的活动类型 amazingActivitys获取所有精彩活动
        sySocket.sendComReqMsg(1005,[0],[(parseInt(activityPage) || 0) + ""]);//;
    },

    /**
     * 请求打开活动 并且跳转到前端指定的活动页 (包含活动列表数据 和 当前切页数据)
     * @param params
     * @param strParams
     */
    reqOpenOneActivityById:function(activityPageId) {
        if(activityPageId && activityPageId != 0 ){
            var strParams = [];
            strParams.push(0 + "");
            strParams.push((parseInt(activityPageId)|| 0) + "");
            sySocket.sendComReqMsg(1005,[0],strParams);
        }
    },


    //具体活动
    sendActivity:function(params,strParams,isFromHomeLayer){
        var isFromMJHomeLayer = isFromHomeLayer || false;
        var paramsList = params;
        //if(isFromMJHomeLayer){
        //    paramsList = [params[0],1];
        //}
        sySocket.sendComReqMsg(1005,paramsList,strParams);
    },

    setLastTime:function(lastTime){
        this.lastTime = lastTime;
    },

    getLastTime:function(){
        return this.lastTime;
    },

    setIsSendShareMsg:function(isSendShareMsg){
        this.isSendShareMsg = isSendShareMsg;
    },

    isNeedSendMsg:function(){
        return this.isSendShareMsg;
    }

}

var GoldenEggsModel = {
    goldenEggsParams:null,
    goldenEggsData:[],
    showIcon:false,
    date:null,
    inviteData:[],
    totalMoney:0,
    isGetPacketAgain:false,
    openData:null,
    openType:0,
    curDate:null,
    isCanExchange:false,
    isShowEggIcon:false,
    init:function(data){
        this.goldenEggsParams = data.params;
        this.isShowIcon()
        if(!this.isShowEggIcon)return
        var strParams0 = JSON.parse(data.strParams[0])
        var inviteData = JSON.parse(data.strParams[1])
        this.getInviteData(inviteData)
        this.getTotalMoney(data.strParams[2])
        this.date = strParams0.date.split(",")
        this.getGoldenEggsData(strParams0)
        this.curDate = this.formatTime()
        for(var i = 0;i<this.goldenEggsData.length;i++){
            if(this.curDate == this.goldenEggsData[i][0]){
                if(this.goldenEggsData[i][1] == 0){
                    this.openData = []
                    this.openData = this.goldenEggsData[i]
                    this.openType = 0
                    var pop = new GoldenEggsPop();
                    PopupManager.addPopup(pop);
                }
                break
            }
        }
        this.isShowExchange()
        //cc.log("goldenEggsData",JSON.stringify(this.goldenEggsData))
        //cc.log("inviteData",JSON.stringify(this.inviteData))
    },

    getInviteData:function(inviteData){
        this.inviteData = []
        for( var item in inviteData){
            this.inviteData.push(inviteData[item])
        }
    },

    getTotalMoney:function(money){
        var money = Number(money)
        this.totalMoney = money.toFixed(1)
        if(this.totalMoney >10){
            this.totalMoney = 10
        }
    },

    getGoldenEggsData:function(strParams){
        var data = []
        for( var item in strParams){
            if(item == "date") continue
            var itemData = []
            itemData.push(item)
            var p = strParams[item].split(",")
            for(var i = 0;i< p.length;i++){
                itemData.push(p[i])
            }
            data.push(itemData)
        }
        var goldenEggsData = []
        for(var i = 0;i<this.date.length;i++){
            for(var j = 0;j<data.length;j++){
                if(this.date[i] == data[j][0]){
                    goldenEggsData.push(data[j])
                    break
                }
            }
        }
        this.goldenEggsData = goldenEggsData
    },

    isShowIcon:function(){
        if(this.goldenEggsParams)
            this.isShowEggIcon = this.goldenEggsParams[0] == 1
        var loginIds = cc.sys.localStorage.getItem("sy_get_login_id");
        if(loginIds){
            if(loginIds != PlayerModel.userId){
                this.isShowEggIcon = false
            }
        }else{
            cc.sys.localStorage.setItem("sy_get_login_id",PlayerModel.userId);
        }
    },

    isShowExchange:function(){
        if(this.totalMoney >= 10){
            this.isCanExchange = true
        }
    },

    formatTime:function() {
        var serverDate = sy.scene.getCurServerTime()
        var date = new Date(serverDate)
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        return y+this.add0(m)+this.add0(d)
    },

    add0:function(m){
        return m<10?'0'+m:m+'';
    },

    clean:function(){
        this.goldenEggsData = []
        this.goldenEggsParams = []
        this.isShowEggIcon = false
    }
}

var NewCarnivalModel = {
    openedGift:[],
    giftInfo:[],
    giftList:[],
    isDoubleTaskAward:false,
    taskId:0,
    newCarnivalGuide:false,
    isShowRedPoint:false,
    taskInfos:[],
    init:function(){
        if(TaskInfoModel.extParamStr[0]){
            this.openedGift = TaskInfoModel.extParamStr[1].split(",")
        }
        this.giftInfo = []
        var split = TaskInfoModel.extParamStr[1].split(",")
        for(var i = 0;i<split.length;i++){
            this.giftInfo.push(split[i].split("_"))
        }
        cc.log("this.giftInfo",JSON.stringify(this.giftInfo))
        this.giftList = []
        var taskInfos = []
        for(var j = 0;j<TaskInfoModel.taskInfos.length;j++){
            var isTask = true
            for(var i = 0;i<this.giftInfo.length;i++){
                if(this.giftInfo[i][0] == TaskInfoModel.taskInfos[j].taskId){
                    isTask = false
                    this.giftList.push(TaskInfoModel.taskInfos[j])
                }
            }
            if(isTask){
                taskInfos.push(TaskInfoModel.taskInfos[j])
            }
        }
        this.taskInfosSort(taskInfos)
    },

    taskInfosSort:function(taskInfos){//排序：已领取的放最后
        function compare(num1,num2){
            if(num1.state == 2 || num2.state == 2){
                return num1.state>=2
            }else{
                return num2.state-num1.state
            }
        }
        taskInfos.sort(compare)
        this.taskInfos = taskInfos
        cc.log("this.taskInfos",JSON.stringify(this.taskInfos))
    },

    refreshTaskProcess:function(){
        this.isShowRedPoint = false
        if(TaskInfoModel.refreshTaskData.state == 1){
            this.isShowRedPoint = true
        }

        for(var i = 0;i<TaskInfoModel.taskInfos.length;i++) {
            if (TaskInfoModel.taskInfos[i].taskId == TaskInfoModel.refreshTaskData.taskId) {
                TaskInfoModel.taskInfos[i].state = TaskInfoModel.refreshTaskData.state
            }
            if(TaskInfoModel.taskInfos[i].state == 1){
                this.isShowRedPoint = true
            }
        }
        var taskIndex = 0
        for(var i = 0;i<NewCarnivalModel.taskInfos.length;i++) {
            if (this.taskInfos[i].taskId == TaskInfoModel.refreshTaskData.taskId) {
                this.taskInfos[i].state = TaskInfoModel.refreshTaskData.state
                taskIndex = 2
                break
            }
        }
        for(var i = 0;i<NewCarnivalModel.giftList.length;i++) {
            if (this.giftList[i].taskId == TaskInfoModel.refreshTaskData.taskId) {
                this.giftList[i].state = TaskInfoModel.refreshTaskData.state
                taskIndex = 1
                break
            }
        }
        this.taskInfosSort(this.taskInfos)
        SyEventManager.dispatchEvent(SyEvent.NEW_CARNIVAL_REFRESH,taskIndex);
    },
    clean:function(){
        this.isShowRedPoint = false
        TaskInfoModel.taskInfos = []
        this.taskInfos = []
        this.giftList = []
    }
}