var MissionInfoResResponder = BaseResponder.extend({
    respond:function(message){
        cc.log("MissionInfoResResponder:"+JSON.stringify(message));
        if(PopupManager.getClassByPopup(MissionPop)){
         	  // PopupManager.showPopup(PyqHall);
         	PopupManager.getClassByPopup(MissionPop).RefreshStatus(message.missionState);
        }
    }
})