var MissionBoardResResponder = BaseResponder.extend({
    respond:function(message){
        cc.log("MissionBoardResResponder:"+JSON.stringify(message));
        for (var i = 0; i < message.aTag.length; i++) {
        	if(message.aTag[i].tag == 1){
        		BeansConfigModel.dailyTask = message.aTag[i].missionRes;
        	}else if(message.aTag[i].tag == 2){
        		BeansConfigModel.challengeTask = message.aTag[i].missionRes;
        	}
        }

        if(PopupManager.getClassByPopup(MissionPop)){
            for (var i = 0; i < message.aTag.length; i++) {
                PopupManager.getClassByPopup(MissionPop).RefreshStatus(message.aTag[i]);
            }
        }else{
            var mc = new MissionPop();
            PopupManager.addPopup(mc);
        }
    }
})

var ActivityLZResResponder = BaseResponder.extend({
    respond:function(message){
        cc.log(" 收到赛龙舟数据 ActivityLZResResponder:"+JSON.stringify(message));

        BeansConfigModel.slzContent = message.content || [];
        BeansConfigModel.playNum = message.playNum || 0;
        BeansConfigModel.goldNum = message.goldNum || 0;

    }
})