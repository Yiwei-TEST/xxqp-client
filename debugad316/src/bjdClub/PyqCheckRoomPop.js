/**
 * Created by cyp on 2019/9/16.
 */

var PyqCheckRoomPop = BasePopup.extend({
    inputStr:"",
    inputArray:[],
    ctor:function(type){
        this.type = type
        this._super("res/pyqCheckInputPop.json");
    },

    selfRender:function(){
        for(var i=0;i<=9;i++){
            var btn = this.getWidget("btn"+i);
            btn.temp = i;
            UITools.addClickEvent(btn,this,this.onClick);
        }


        this.btnd = this.getWidget("btnd");
        this.btnd.temp = "del";
        this.btnd.visible = true;
        UITools.addClickEvent(this.btnd,this,this.onClick);

        this.btn_reset = this.getWidget("btnr");
        this.btn_reset.temp = "reset";
        UITools.addClickEvent(this.btn_reset,this,this.onClick);

        this.inputNum = this.getWidget("inputNum");
        this.inputNum.setString("");

        this.btn_check_room = this.getWidget("btn_check_room");
        this.btn_check_user = this.getWidget("btn_check_user");

        UITools.addClickEvent(this.btn_check_room,this,this.onClickCheckRoom);
        UITools.addClickEvent(this.btn_check_user,this,this.onClickCheckUser);

        this.btn_check_room.visible = this.type == 1
        this.btn_check_user.visible = this.type == 1

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        this.onShow()
    },

    onShow:function(){
        if(this.type == 2){
            this.inputTip = this.getWidget("inputTip");
            this.inputTip.setString("请输入房间ID")
        }
    },

    onClick:function(obj){
        var temp = obj.temp;

        if(temp == "del"){
            if(this.inputStr.length > 0){
                this.inputStr = this.inputStr.substr(0,this.inputStr.length - 1);
            }
        }else if(temp == "reset"){
            this.inputStr = "";
        }else if(this.inputStr.length < 10){
            this.inputStr += String(temp);
        }
        if(this.type == 2){
            if(this.inputStr.length==6){
                sy.scene.showLoading("正在加入");
                var self = this;
                Network.loginReq("qipai","getServerById",{tableId:this.inputStr},function(data){
                    //{"server":{"httpUrl":"http://192.168.1.111:8020/qipai/pdk.do","serverId":1,"connectHost":"ws://192.168.1.111:8020"},"code":0}
                    //cc.log("getServerById===",JSON.stringify(data))
                    self.resp = true;
                    var playType = data.server.playType
                    //var callBack = function(){
                        var url = data.server.connectHost;
                        if(sySocket.url != url){
                            sySocket.url = url;
                            sySocket.isCrossServer = true;
                            sySocket.disconnect(function(){
                                sySocket.connect(null,3);
                            },3);
                        }else{
                            self.onSuc();
                        }
                    //}

                    //if (playType){
                    //    sy.scene.updatelayer.getUpdatePath(playType,callBack);
                    //}
                },function(){
                    sy.scene.hideLoading();
                    self.resp = true;
                    //FloatLabelUtil.comText("加入房间失败");
                })
            }
        }
        this.inputNum.setString("" + this.inputStr);
    },

    onSuc:function(){
        //sy.scene.hideLoading();
        this.resp = true;
        if(this.inputStr.length==6){
            sySocket.sendComReqMsg(2,[parseInt(this.inputStr),1]);
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        this.resp = true;
        if(status==ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("加入房间失败");
        }else if(status==ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onClickCheckRoom:function(){
        var tableId = this.inputStr;
        if(tableId){
            ComReq.comReqGetClubBagRoomsData([ClickClubModel.getCurClubId(),2],[tableId]);
        }

    },

    onClickCheckUser:function(){
        var userId = this.inputStr;
        if(userId){
            ComReq.comReqGetClubBagRoomsData([ClickClubModel.getCurClubId(),3],[userId]);
        }
    },

    onCloseHandler : function(){
        this.removeFromParent(true);
    },
});
