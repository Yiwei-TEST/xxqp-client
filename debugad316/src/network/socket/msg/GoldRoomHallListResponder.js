/**
 * Created by lww on 2020/5/19.
 */
var GoldHallModle = {
	iconList:[],

	initData:function (data) {
		this.iconList = data.list;
	},
}

var GoldRoomHallListResponder = BaseResponder.extend({
    respond:function(message){
        // cc.log("GoldRoomHallListResponder::"+JSON.stringify(message));
        // cc.log("message.keyId::",message.list[0].keyId);
        GoldHallModle.initData(message);
		SyEventManager.dispatchEvent("Get_Gold_Room_Hall_Data",message);
    }
})