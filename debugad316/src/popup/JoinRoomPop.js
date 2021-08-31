/**
 * Created by Administrator on 2016/6/27.
 */
var JoinRoomPop = BasePopup.extend({

    inputArray:[],
    gameType:1,

    ctor: function (gType) {
        this.inputArray = [];
        this.gameType = gType || 1;
        this._super("res/joinRoom.json");
    },

    selfRender: function () {
        // this.tipImg = this.getWidget("img_tip");
        this.nums = [];
        for(var i=1;i<=6;i++){
            var num = this.getWidget("input_"+i);
            num.setString("");
            this.nums.push(num);
        }
        for(var i=0;i<=9;i++){
            var btn = this.getWidget("btn_"+i);
            btn.temp = i;
            btn.setZoomScale(0);
            UITools.addClickEvent(btn,this,this.onClick);
        }
        this.resp = true;
        var btndel = this.getWidget("btn_del");
        btndel.setZoomScale(0);
        UITools.addClickEvent(btndel,this,this.onDel);
        var btnreset = this.getWidget("btn_reset");
        btnreset.setZoomScale(0);
        UITools.addClickEvent(btnreset,this,this.onReset);
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
    },

    onDel:function(){
        if(this.inputArray.length>0){
            this.nums[this.inputArray.length-1].setString("");
            this.inputArray.pop();
        }
        if(this.inputArray.length == 0){
            // this.tipImg.setVisible(true);
        }
    },

    onReset:function(){
          for(var i=0;i<this.nums.length;i++){
              this.nums[i].setString("");
          }
        this.inputArray.length = 0;
        // this.tipImg.setVisible(true);
    },

    onSuc:function(){
        //sy.scene.hideLoading();
        this.resp = true;
        if(this.inputArray.length==6){
            var roomNum = "";
            for(var i=0;i<this.inputArray.length;i++){
                roomNum+=this.inputArray[i];
            }
            sySocket.sendComReqMsg(2,[parseInt(roomNum),this.gameType]);
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

    onClick:function(obj){
        var temp = obj.temp;
        if(this.inputArray.length<6){
            this.inputArray.push(temp);
            this.nums[this.inputArray.length-1].setString(temp);
            // this.tipImg.setVisible(false);
        }
        if(this.inputArray.length==6){
            if(!this.resp)
                return;
            sy.scene.showLoading("正在进入房间");
            this.resp = false;
            var roomNum = "";
            for(var i=0;i<this.inputArray.length;i++){
                roomNum+=this.inputArray[i];
            }
            var self = this;
            Network.loginReq("qipai","getServerById",{tableId:roomNum},function(data){
                //{"server":{"httpUrl":"http://192.168.1.111:8020/qipai/pdk.do","serverId":1,"connectHost":"ws://192.168.1.111:8020"},"code":0}
                cc.log("getServerById===",JSON.stringify(data))
                self.resp = true;
                var playType = data.server.playType
                //var callBack = function(){
                    var url = data.server.connectHost;
                    if(sySocket.url != url){
                        sySocket.url = url;
                        sySocket.isCrossServer = true;
                        sySocket.disconnect(function(){
                            sySocket.connect(null,7);
                        },7);
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
});