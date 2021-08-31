/**
 * Created by zhoufan on 2016/6/25.
 */
var CreateRoomPop = BasePopup.extend({

    clazz:{},
    isDaiKaiRoom:false,
    localTime:0,

    ctor:function(json){
        this.clazz = {};
        this.hasClickCreateBtn = false;//记录是否点击了创建房间按钮 防止断线重连直接创建房间
        this.isDaiKaiRoom = false;
        json = json || "res/createRoom.json";
        this._super(json);
    },


    /**
     * 通用可选项刷新代码
     */
    onNormolUpdate:function(btnName , txtName , paramName){
        if(btnName && txtName && paramName){
            var btn = this[btnName];
            var txt = this[txtName];
            if(this[paramName] == 1){
                txt.setColor(cc.color(254 , 115 , 34));
                btn.setBright(true);
            }else if(this[paramName] == 0){
                txt.setColor(cc.color(93 , 33 , 7));
                btn.setBright(false);
            }
        }else{
            cc.log("onNormolUpdate error ::" , btnName , txtName , paramName);
        }
    },

    /**
     * 通用可选项点击代码
     * @param btn
     * @param txt
     * @param paramName
     */
    onNormolClick:function(btnName , txtName , paramName){
        if(btnName && txtName && paramName){
            var btn = this[btnName];
            var txt = this[txtName];
            if(btn.isBright()){
                txt.setColor(cc.color(93 , 33 , 7));
                btn.setBright(false);
                this[paramName] = 0;
            }else{
                txt.setColor(cc.color(254 , 115 , 34));
                btn.setBright(true);
                this[paramName] = 1;
            }
        }else{
            cc.log("onNormolClick error ::" , btnName , txtName , paramName);
        }
    },

    /**
     * 打开活动红包界面
     * 双明需求变化 不直接打开红包界面了
     */
    onOpenActivityPop:function(){
        //ActivityModel.reqOpenOneActivityById(9);
        ActivityModel.sendOpenActivityMsg();
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },


    isMJ:function(){
        return (this.json=="res/mjCreateRoom.json");
    },

    isDN:function(){
        return (this.json=="res/dnCreateRoom.json");
    },


    //换皮后启用
    isDTZ:function(){
        return (this.json=="res/DTZcreateRoom.json");
    },


    selfRender:function(){
        cc.log("1111ffffff");
        this.resp = true;
        this.renshu = 0;
        this.leixing = 0;
        this.niao = 0;
        this.heitao3 = 0;
        this.zhuang = 1;
        this.niaoPoint = 0;
        this.showCardNumber = 0;
        this.maxScore = 0;
        this.exScore = 0;
        this.isDark8 = 0;
        this.isRemove67 = 0;
        this.limitScore = 0;
        var btn = this.Button_17 = this.getWidget("Button_17");
        UITools.addClickEvent(btn,this,this.onCreate);
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        //新增送钻石功能
        var btnSendDiamond = this.getWidget("btn_SendDimand");
        if(btnSendDiamond){
            if (SdkUtil.isYYBReview()) {
                btnSendDiamond.visible = false;
            }
            UITools.addClickEvent(btnSendDiamond , this , this.onOpenActivityPop)
        }
    },

    onSuc:function(){
        var command = this.isDaiKaiRoom ? 25 : 1;
        if(this.hasClickCreateBtn == false){
            cc.log("断线重连触发的onSuc 玩家未点击创建按钮");
            return;
        }else{
            this.hasClickCreateBtn = false;
        }
        if(this.isMJ()){
            cc.sys.localStorage.setItem("sy_mj_wanfa",this.wanfa);
            var cla = this.clazz[this.wanfa];
            this.niao = cla.niao;
            this.leixing = cla.leixing;
            this.zhuang = cla.zhuang;
            this.niaoPoint = cla.niaoPoint;
            this.jushu = cla.jushu;
            this.wangNum = cla.wangNum;
            this.dzy = cla.dzy;
            var data = {jushu:this.jushu,wanfa:this.wanfa,niao:this.niao,leixing:this.leixing,zhuang:this.zhuang,niaoPoint:this.niaoPoint,wangNum:this.wangNum,dzy:this.dzy};
            cc.sys.localStorage.setItem("sy_mj_create_room_"+this.wanfa,JSON.stringify(data));
            sySocket.sendComReqMsg(1,[this.jushu,this.wanfa,this.niao,this.leixing,this.zhuang,this.niaoPoint,this.wangNum,this.dzy]);
            return;
        }else if(this.isPHZ()){
            cc.log("创建跑胡子游戏房间...后台为何如此不智能 , " , this.limitScore);
            if(this.wanfa == GameTypeEunmZP.SYBP){
                this.jushu = 10;//后台只配置了10
            }
            if (this.renshu != 2){
                this.choupai = 0;
                this.isDouble = 0;
            }
            if (this.wanfa == GameTypeEunmZP.SYZP && this.renshu == 4){
                this.renshu = 3;
            }
            cc.sys.localStorage.setItem("sy_phz_wanfa",this.wanfa);
            cc.sys.localStorage.setItem("sy_phz_jushu",this.jushu);
            cc.sys.localStorage.setItem("sy_phz_renshu",this.renshu);
            cc.sys.localStorage.setItem("sy_phz_heitao3",this.heitao3);
            cc.sys.localStorage.setItem("sy_phz_fengding",this.showCardNumber);
            cc.sys.localStorage.setItem("sy_phz_costWay" , this.costWay);
            cc.sys.localStorage.setItem("sy_phz_limitScore" , this.limitScore);
            cc.sys.localStorage.setItem("sy_phz_hxwf" , this.hxwf);
            cc.sys.localStorage.setItem("sy_phz_choosehhd" , this.choosehhd);
            cc.sys.localStorage.setItem("sy_phz_chooseklz" , this.chooseklz);
            cc.sys.localStorage.setItem("sy_phz_choupai" , this.choupai);
            cc.sys.localStorage.setItem("sy_phz_autoPlay" , this.autoPlay);
            cc.sys.localStorage.setItem("sy_phz_isDouble" , this.isDouble);
            cc.sys.localStorage.setItem("sy_phz_dScore" , this.dScore);
            cc.sys.localStorage.setItem("sy_phz_doubleNum" , this.doubleNum);

            sySocket.sendComReqMsg(command,[
                this.jushu,this.wanfa,this.niao,this.leixing,this.zhuang,
                this.niaoPoint,this.heitao3,this.renshu,this.showCardNumber,this.costWay ,
                this.limitScore,this.choosehhd,this.chooseklz,this.hxwf,this.choupai,
                0,0,0,0,0,0,0,0,this.autoPlay,this.isDouble,this.dScore,this.doubleNum]);
            return ;
        }else if(this.isPDK()){
            cc.log("创建跑得快游戏房间...." , this.wanfa , this.jushu , this.heitao3 ,this.renshu ,this.showCardNumber , this.costWay);
            cc.sys.localStorage.setItem("sy_pdk_wanfa",this.wanfa);
            cc.sys.localStorage.setItem("sy_pdk_jushu",this.jushu);
            cc.sys.localStorage.setItem("sy_pdk_heitao3",this.heitao3);
            cc.sys.localStorage.setItem("sy_pdk_renshu",this.renshu);
            cc.sys.localStorage.setItem("sy_pdk_showCardNumber",this.showCardNumber);
            cc.sys.localStorage.setItem("sy_pdk_costWay" , this.costWay);
            cc.sys.localStorage.setItem("sy_pdk_hongshi" , this.hongshi);
            cc.sys.localStorage.setItem("sy_pdk_isFanZuoBi" , this.isFanZuoBi);
            cc.sys.localStorage.setItem("sy_pdk_boomwithcard" , this.openBoomWithCard);
            cc.sys.localStorage.setItem("sy_pdk_threefj" , this.threeFj);
            cc.sys.localStorage.setItem("sy_pdk_autoPlay" , this.autoPlay);
            cc.sys.localStorage.setItem("sy_pdk_isDouble" , this.isDouble);
            cc.sys.localStorage.setItem("sy_pdk_dScore" , this.dScore);
            cc.sys.localStorage.setItem("sy_pdk_doubleNum" , this.doubleNum);
            cc.log("this.threeFj=="+this.threeFj);
            //this.openBoomWithCard = this.getLocalItem("sy_pdk_boomwithcard") || 0;
            var allWanfas = command == 25 ? "15,16" : "";
            if(this.renshu == 2){
                //cc.log("人数为2 默认不使用黑桃3限制出牌");
                this.heitao3 = 0;
            }else{
                this.isDouble = 0;
            }

            sySocket.sendComReqMsg(command,[
                this.jushu,this.wanfa,this.niao,
                this.leixing,this.zhuang,this.niaoPoint,
                this.heitao3,this.renshu,this.showCardNumber,
                this.costWay,this.hongshi,this.openBoomWithCard,
                this.threeFj,0,0,0,0,0,0,0,0,this.autoPlay,this.isDouble,this.dScore,this.doubleNum],allWanfas);
            return;
        }else if(this.isDTZ()){
            cc.log("创建打筒子游戏房间...." , this.wanfa , this.maxScore ,this.exScore ,this.isDark8 ,this.isRemove67 , this.isWangTongZi , this.isTuoguan);
            if (this.renshu == 4 && command == 25) {
                sy.scene.hideLoading();
                FloatLabelUtil.comText("暂未开放");
            }else{
                if (this.wanfa == 112){//4人快乐四喜
                    this.isDark8 = 0;
                }
                cc.sys.localStorage.setItem("sy_dtz_cost" , this.costWay);
                cc.sys.localStorage.setItem("sy_dtz_wanfa",this.wanfa);
                cc.sys.localStorage.setItem("sy_dtz_maxScore",this.maxScore);
                cc.sys.localStorage.setItem("sy_dtz_exScore" , this.exScore);
                cc.sys.localStorage.setItem("sy_dtz_isDark8" , this.isDark8);
                cc.sys.localStorage.setItem("sy_dtz_isRemove67" , this.isRemove67);
                cc.sys.localStorage.setItem("sy_dtz_isShowNum" , this.isShowNumber);
                cc.sys.localStorage.setItem("sy_dtz_renshuv2" , this.renshu);
                if (this.renshu == 4) {
                    this.isFirstOut = 0;
                }
                cc.sys.localStorage.setItem("sy_dtz_isFirstOut" , this.isFirstOut);
                cc.sys.localStorage.setItem("sy_dtz_isBida" , this.isBida);
                cc.sys.localStorage.setItem("sy_dtz_isWangTongZi" , this.isWangTongZi);
                cc.sys.localStorage.setItem("sy_dtz_isTuoguan" , this.isTuoguan);
                cc.sys.localStorage.setItem("sy_dtz_isDaiPai" , this.isDaiPai);
                cc.sys.localStorage.setItem("sy_dtz_isFanZuoBi" , this.isFanZuoBi);
                cc.log("this.isWangTongZi..." , this.isWangTongZi);
                sySocket.sendComReqMsg(command,[0 , this.wanfa  , this.costWay , this.maxScore , this.exScore , this.isDark8 , this.isRemove67,
                    this.renshu, this.isShowNumber, this.isFirstOut , this.isBida , this.isWangTongZi , this.isTuoguan ,this.isDaiPai]);
            }
            return;
        }
    },

    getWanfaList:function(idex){
        var wanfaList = [];
        switch (idex){
            case 1:
                wanfaList = [0 , this.wanfa  , this.costWay , this.maxScore , this.exScore , this.isDark8 , this.isRemove67, this.renshu, this.isShowNumber, this.isFirstOut];
                break;
            case 2:
                wanfaList = [this.jushu,this.wanfa,this.niao,this.leixing,this.zhuang,this.niaoPoint,this.heitao3,this.renshu,this.showCardNumber,this.costWay , this.limitScore];
                break;
            case 3:
                wanfaList = [this.jushu,this.wanfa,this.niao,this.leixing,this.zhuang,this.niaoPoint,this.heitao3,this.renshu,this.showCardNumber,this.costWay,this.hongshi];
                break;
            case 4:
                wanfaList = [this.jushu,this.wanfa,this.niao,this.leixing,this.zhuang,this.niaoPoint,this.wangNum,this.dzy];
                break;
        }
        //cc.log("wanfaList.length:::"+wanfaList);
        for(var index = 0 ; index < wanfaList.length ; index++){
            wanfaList[index] = parseInt(wanfaList[index]);
        }
        //cc.log("wanfaList.**:"+wanfaList);
        return wanfaList;
    },

    getWanfas:function(){
        var wanfas = [this.wanfa,this.costWay,this.jushu,this.renshu];
        return wanfas;
    },

    onCreate:function(obj,isAlert){
        this.isDaiKaiRoom = false;
        cc.log("qiefuqiefu",this.jushu,this.wanfa);
        if(this.jushu>0 && this.wanfa>0){
            if(!this.resp)
                return;
            this.hasClickCreateBtn = true;
            this.resp = false;
            sy.scene.showLoading("正在创建房间");
            sySocket.sendComReqMsg(29,[this.wanfa],"0");
        }else{
            return FloatLabelUtil.comText("请选择局数或玩法");
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        this.resp = true;
        if(status==ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("创建房间失败");
        }else if(status==ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onDaiCreate:function(){
        this.isDaiKaiRoom = true;
        var self = this;
        AlertPop.show("代开房间将立即扣除房卡，且消耗不计入抽奖次数，房间24小时未使用将自动解散并退还房卡。确定要代开房间吗？",function(){
            sy.scene.showLoading("正在创建房间");
            self.isCreate = true;
            self.hasClickCreateBtn = true;
            self.onSuc();
        });
    },

    onAACreate:function(){
        this.leixing = 1;
        this.onCreate(this.Button_17,true,true);
    },

    //onDaiKaiList:function(){
    //    Network.loginReq("qipai","exec",{actionType:6,funcType:1},function(data){
    //        if(data){
    //            dkRecordModel.init(data);
    //            var mc = new DaiKaiRoomPop();
    //            PopupManager.open(mc,false);
    //        }
    //    });
    //},

});