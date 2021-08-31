/**
 * Created by Administrator on 2016/7/9.
 */
var NetErrorPopData = {
    mc:null
}
var NetErrorPop = BasePopup.extend({

    ctor: function (isError) {
        this.iserror = isError || false;
        this.timeId = -1;
        this.connectTime = 0;
        this.connectOverTime = 10;
        this.errorTimes = 0;
        this.errorLinkTimes = 0;
        this.isConnect = false;
        this._super("res/loadingCircle.json");
    },

    selfRender: function () {
        this.Label_35 = this.getWidget("Label_35");
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        //var mc = this.lmc = this.getWidget("Image_7");
        //mc.runAction(cc.rotateTo(3,720,720).repeatForever());

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/loading/loading.ExportJson");
        this.ani = new ccs.Armature("loading");
        this.ani.setPosition(this.root.width/2 ,this.root.height/2+40);
        this.ani.getAnimation().play("Animation1",-1,1);
        this.root.addChild(this.ani);
        

        //重连转圈延时一秒显示
        this.visible = false;
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            self.visible = true;
        })));

        this.setTipStr("网络异常,尝试重连");

        this.reConnect();
        this.scheduleUpdate();
    },

    setTipStr:function(str){
        this.Label_35.setString(str);
    },
    reConnect:function(timing){
        var self = this;
        // if (this.isConnect){
        //     this.visible = true;
        // }
        if(this.iserror){//sockect已经断开
            if(timing){
                if(this.timeId>=0 || !PlayerModel.userId)
                    return;
                SdkUtil.sdkLog("NetErrorPop socket error...try reconnect...1");
                self.errorTimes+=1;
                self.errorLinkTimes+=1;
                if (self.errorLinkTimes > 3){
                    self.errorLinkTimes = 0;
                    SocketErrorModel.updateGameIndex();
                }
                this.timeId = setTimeout(function(){
                    var time = new Date().getTime();
                    time = UITools.formatDetailTime(time,2);
                    var str = (SocketErrorModel._gameIndex + "连接次数" + self.errorTimes +",ID:"+PlayerModel.userId + "\n" + time);
                    self.setTipStr(str);
                    self.timeId = -1;
                    sySocket.connect(null,10);
                    if (self.errorTimes > 8){
                        if (!PopupManager.hasClassByPopup(AlertPop)) {
                            AlertPop.showOnlyOk("重连失败，请重新登录!", function () {
                                sy.socketQueue.stopDeal();
                                self.onSuc();
                                sySocket.redisconnect();
                                PopupManager.removeAll();
                                LayerManager.showLayer(LayerFactory.LOGIN);
                            })
                        }
                        return;
                    }
                },3000);
            }else{
                if(this.timeId >= 0)
                    clearTimeout(this.timeId);
                SdkUtil.sdkLog("NetErrorPop socket error...try reconnect...2");
                this.timeId = -1;
                sySocket.connect(null, 9);
            }
        }
    },

    onSuc:function(){
        // cc.log("onSuc===onSuc==onSuc")
        this.errorTimes=0;
        this.errorLinkTimes = 0;
        SdkUtil.sdkLog("NetErrorPop socket has connect success...");
        sy.scene.hideLoading();
        //if(this.lmc)
        //    this.lmc.stopAllActions();
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/loading/loading.ExportJson");
        clearTimeout(this.timeId);
        this.unscheduleUpdate();
        NetErrorPopData.mc = null;
        PopupManager.remove(this)
    },

    update:function(dt){
        this.connectTime += dt;
        if(this.connectTime >= this.connectOverTime){
            this.isConnect = true;
        }
    }
});
NetErrorPop.show = function(isError){
    if(GameData.conflict)//账号冲突
        return;
    sy.scene.hideLoading();
    var nowmc = PopupManager.getClassByPopup(NetErrorPop)
    if(nowmc){
        if(nowmc.iserror && !isError)
            return;
        nowmc.iserror = isError;
        cc.log("reConnect2")
        nowmc.reConnect(isError);
        return;
    }
    var mc = NetErrorPopData.mc = new NetErrorPop(isError);
    PopupManager.addPopup(mc);

};

NetErrorPop.hide = function(num){
    // cc.log("NetErrorPop.hide",num)
    var nowmc = PopupManager.getClassByPopup(NetErrorPop)
    if (nowmc){
        // cc.log("NetErrorPop.hide===NetErrorPopData.mc==",num)
        nowmc.onSuc();
    }
}