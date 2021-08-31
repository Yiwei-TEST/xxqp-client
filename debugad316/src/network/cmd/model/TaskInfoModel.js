/**
 * Created by zyq on 2020/9/16.
 */

var TaskInfoModel = {
    taskInfos:[],
    extParam:[],
    extParamStr:[],
    taskType:0,
    refreshTaskData:[],
    init:function(message){
        this.taskType = message.taskType
        this.taskInfos = message.taskInfos
        this.extParam = message.extParam
        this.extParamStr = message.extParamStr
        if(message.taskType == 12){//新人狂欢
            NewCarnivalModel.init()
            var pop = new NewCarnivalPop();
            PopupManager.addPopup(pop);
        }
    },

    refreshTaskProcess:function(message){
        this.refreshTaskData = message
        if(message.taskType == 12){//新人狂欢
            NewCarnivalModel.refreshTaskProcess(message)
        }
    },

}
