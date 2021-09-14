/**
 * 俱乐部邀请弹框
 */
var ClubZhuanPanPop = BasePopup.extend({

    ctor:function(parentNode){
        this.isAni = false;
        this.choujiangCishu = 0;
        this.curClubId = ClickClubModel.getCurClubId();
        this.curClubRole = ClickClubModel.getCurClubRole();
        this.curClubName = ClickClubModel.getCurClubName();
        this.parentNode = parentNode;
        this._super("res/zhuanpanPop.json");
    },

    selfRender:function(){
        var self = this;
        this.scoreArr = [888,388,188,18,5.8,1.8,8.8,88,0]
        this.btn_zhuanpan = this.getWidget("Button_chgoujiang");
        UITools.addClickEvent(this.btn_zhuanpan, this , this.onZhuanPan);

        this.zhuanpan = this.getWidget("zhuanpan");

        NetworkJT.loginReq("groupActionNew", "creditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 1
        }, function (data) {
            if (data) {
                cc.log("data =",JSON.stringify(data));
                self.getWidget("Label_20").setString("再玩"+data.message.needPlayCount+"局可获得1次抽奖机会")
                self.choujiangCishu = data.message.wheelCount;
                self.getWidget("Label_19").setString("剩余"+data.message.wheelCount+"次")
                self.getWidget("poolScore").setString(data.message.creditPool/100);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });

        if(this.curClubRole == 1){
            this.getWidget("Panel_qunzhu").visible =true;
            this.inputBox = new cc.EditBox(cc.size(300, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/pyqCheckInputPop/numbg.png"));
            this.inputBox.x = 120;
            this.inputBox.y = 30;
            this.inputBox.setPlaceHolder("输入积分");
            //this.inputBox.setPlaceholderFontColor(cc.color(255,255,255));
            this.inputBox.setMaxLength(12);
            this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
            this.inputBox.setFont("Arial",45);
            this.inputBox.setPlaceholderFont("Arial",45);
            this.getWidget("Panel_qunzhu").addChild(this.inputBox)
        }else{
            this.getWidget("Panel_qunzhu").visible =false;
        }

        var btn_jia = this.getWidget("Button_jia");
        btn_jia.temp = 1;
        var btn_jian = this.getWidget("Button_jian");
        btn_jian.temp = -1;

        UITools.addClickEvent(btn_jia,this,this.changeScore);
        UITools.addClickEvent(btn_jian,this,this.changeScore);

        var btn_dajiang = this.getWidget("Button_dajiang");
        UITools.addClickEvent(btn_dajiang,this,function () {
            AlertPop.show("确定开启大奖嘛？",function(){
                self.onDaJiang()
            },function(){});
        });

        var btn_xq = this.getWidget("Button_xq");
        UITools.addClickEvent(btn_xq,this,function () {
            var pop = new zhuanpanDetailPop();
            PopupManager.addPopup(pop);
        });
    },
    
    onDaJiang:function () {
        var self=this;

        NetworkJT.loginReq("groupActionNew", "setCreditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 2,
        }, function (data) {
            if (data) {
                FloatLabelUtil.comText("大奖开启成功！");
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    changeScore:function (sender) {
        var self=this;
        var score = this.inputBox.getString();
        score = score *  sender.temp * 100;

        NetworkJT.loginReq("groupActionNew", "setCreditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 1,
            credit:score
        }, function (data) {
            if (data) {
                cc.log("data =",JSON.stringify(data));
                FloatLabelUtil.comText("分数设置成功！");
                self.getWidget("poolScore").setString(data.message/100);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

   onZhuanPan:function () {
       if(this.isAni){
           FloatLabelUtil.comText("请等抽奖结束后再次抽奖");
           return;
       }

       this.zhuanpan.setRotation(0);
       var self = this;
       NetworkJT.loginReq("groupActionNew", "creditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 2
        }, function (data) {
            if (data) {
                cc.log("data.message =",JSON.stringify(data));
                var rotate = 0;
                for (var index = 0; index < self.scoreArr.length; index++) {
                    if(data.message/100 == self.scoreArr[index]){
                        rotate = (9-index)* 40 - MathUtil.mt_rand(10,30);
                    }
                }
                self.choujiangCishu -= 1;
                self.getWidget("Label_19").setString("剩余"+self.choujiangCishu+"次")

                self.showAni(rotate);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
   },

   showAni:function (rotate) {
       
       var self = this;
    //    cc.log("rotate =",rotate);
       this.isAni = true;
       this.zhuanpan.runAction(cc.sequence(
                        cc.rotateBy(1,360),
                        cc.rotateBy(1,360),
                        cc.rotateBy(1,rotate),
                        cc.callFunc(function () {
							self.isAni = false;;
					}, this)));
   },
});

var zhuanpanDetailPop = BasePopup.extend({

    ctor: function () {
        this._super("res/zhuanpanDetailPop.json");
    },

    selfRender: function () {
        this.lbDataPage = this.getWidget("lbDataPage");
        this.ListView_mumber = this.getWidget("ListView_mumber");
        this.lbNoData = this.getWidget("labelNoData");
        this.label_zongji = this.getWidget("label_zongji");
        //选择日期
        this.dataTouchPanel = this.getWidget("dataTouchPanel");
        UITools.addClickEvent(this.dataTouchPanel, this, this.onOpenChoiceTimePop);
        this.lbbeginTime = this.getWidget("beginTime");
        this.lbendTime = this.getWidget("endTime");
        //打开选择时间界面
        var tBegin = new Date();
        this.defaultBeginTime = UITools.getLocalItem("sy_zhuanpan_beginTime") || tBegin;
        this.defaultendTime = UITools.getLocalItem("sy_zhuanpan_endTime") || tBegin;

        this.beginTime = this.defaultBeginTime;
        this.endTime = this.defaultendTime;
        this.lbbeginTime.setString(this.formatTime(this.beginTime));
        this.lbendTime.setString(this.formatTime(this.endTime));
        this.curRankPage = 1;

        var btnRankLeft = this.getWidget("btnDataLeft");
        if (btnRankLeft) {
            UITools.addClickEvent(btnRankLeft, this, this.onDetailUpPage);
        }

        var btnRankRight = this.getWidget("btnDataRight");
        if (btnRankRight) {
            UITools.addClickEvent(btnRankRight, this, this.onDetailDownPage);
        }

        this.getData();

        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);

    },

    /**
     * 排行榜上翻
     */
    onDetailUpPage: function () {
        var detailPage = this.curRankPage;
        if (this.curRankPage > 1) {
            this.curRankPage -= 1;
        } else {
            //FloatLabelUtil.comText("没有更多数据了");
            return;
        }
        //cc.log("获取上一页数据" , detailPage);
        this.getData();
    },
    /**
     * 排行榜下翻
     */
    onDetailDownPage: function () {
        this.curRankPage += 1;
        this.getData();
    },
    onOpenChoiceTimePop: function () {
        var beginTime = UITools.getLocalItem("sy_zhuanpan_beginTime") || 0;
        var endTime = UITools.getLocalItem("sy_zhuanpan_endTime") || 0;
        var mc = new ClubChoiceTimePop(this, beginTime, endTime, 3 );
        PopupManager.addPopup(mc);
    },

    formatTime: function (shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        //cc.log("shijianchuo ..." , shijianchuo);
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        return this.add0(m) + '月' + this.add0(d) + '日'
    },

    add0: function (m) {
        return m < 10 ? '0' + m : m + "";
    },

    formatDataToSever: function (time, isEnd) {
        var time = new Date(time);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        if (m < 10) m = "0" + m;
        if (d < 10) d = "0" + d;

        var ret = y + "-" + m + "-" + d;
        if (isEnd) ret += " 23:59:59";
        else ret += " 00:00:00";
        return ret;
    },

    getData:function () {
        var self = this;
        page = this.curRankPage;

        var startDate = this.formatDataToSever(this.beginTime);
        var endDate = this.formatDataToSever(this.endTime, true);

        NetworkJT.loginReq("groupActionNew", "loadCreditWheelLog", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: page,
            pageSize: 20,
            startDate: startDate,
            endDate: endDate,
        }, function (data) {
            if (data) {
                cc.log("============getUserDetailScore===========" + JSON.stringify(data));
                var isShow = false;
                if (data.message.list.length > 0) {//获取当前页 有数据的情况
                    self.curRankPage =  page;
                    self.lbDataPage.setString("" + self.curRankPage);
                    self.ListView_mumber.removeAllChildren();
                } else {
                    if (page == 1) {
                        isShow = true;
                        self.curRankPage = page;
                        self.lbDataPage.setString("" + self.curRankPage);
                        self.ListView_mumber.removeAllChildren();
                    } else {
                        FloatLabelUtil.comText("没有更多数据了");
                        return;
                    }
                }
                self.lbNoData.visible = isShow;

                self.refreshUserDetailList(data.message.list);

                // var zongji = data.message.sumCredit || 0;
                // zongji = MathUtil.toDecimal(zongji / 100);
                // self.label_zongji.setString("合计：" + zongji);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshUserDetailList: function (data) {
        this.ListView_mumber.removeAllChildren();
        for (var i = 0; i < data.length; ++i) {
            var item = new zhuanpanDetailItem();
            data[i].curCredit = data[i].curCreditPurse;
            if(data[i].type == 6){
                data[i].credit *= -1;
            }
            item.setData(data[i]);
            this.ListView_mumber.pushBackCustomItem(item);
        }
    },


    changeSearchTime: function (event) {
        var data = event.getUserData();
        var beginTime = data.beginTime;
        var endTime = data.endTime;

        this.lbbeginTime.setString(this.formatTime(beginTime));
        this.lbendTime.setString(this.formatTime(endTime));
        this.beginTime = beginTime;
        this.endTime = endTime;
        var rankParams = {};
        rankParams.beginTime = this.beginTime;
        rankParams.endTime = this.endTime;
        rankParams.pageNo = this.curRankPage;

        cc.sys.localStorage.setItem("sy_zhuanpan_beginTime", (this.beginTime));
        cc.sys.localStorage.setItem("sy_zhuanpan_endTime", (this.endTime));

        this.curRankPage = 1;
        this.getData();
    
    },
});

var zhuanpanDetailItem = ccui.Widget.extend({
    ctor:function(){
        this._super();
        this.setContentSize(1260, 156);


        var itemBg = UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        itemBg.setScale9Enabled(true);
        itemBg.setContentSize(this.getContentSize());
        itemBg.setPosition(this.width/2,this.height/2);
        this.addChild(itemBg);
        this.itemBg = itemBg;

        this.scoreLabel= UICtor.cLabel("0",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.scoreLabel.setPosition(800,itemBg.height/2);
        itemBg.addChild(this.scoreLabel);


        this.labelOptName= UICtor.cLabel("玩家比较长的名字看看",40,cc.size(300,45),cc.color("#6f1816"),1,0);
        this.labelOptName.setPosition(120,itemBg.height/2);
        itemBg.addChild(this.labelOptName);

        this.labelOptId= UICtor.cLabel("(ID:12345678)",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.labelOptId.setPosition(420,itemBg.height/2);
        itemBg.addChild(this.labelOptId);

        this.timeLabel= UICtor.cLabel("2019-05-06\n18:04",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.timeLabel.setPosition(itemBg.width - 180,itemBg.height/2);
        itemBg.addChild(this.timeLabel);
    },

    setData:function(data){
        var score = data.credit || 0 ;
        score = MathUtil.toDecimal(score/100);
        score = score * -1;
        if(score > 0)score = "+" + score;

        this.scoreLabel.setString(score);
        var curCredit = data.curCredit || 0;
        curCredit = MathUtil.toDecimal(curCredit/100);
        
        this.timeLabel.setString(this.formatTime(data.createdTime));

        this.labelOptId.setString("(ID:" + data.userId + ")");
        this.labelOptName.setString(data.userName);
    },

    formatTime:function(timeStr){
        var data = new Date(timeStr);
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        var day = data.getDate();

        var hour = data.getHours();
        var min = data.getMinutes();
        var sec = data.getSeconds();

        if(month < 10)month = "0" + month;
        if(day < 10)day = "0" + day;
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min = "0" + min;
        if(sec < 10)sec = "0" + sec;

        var str = year + "-" + month + "-" + day + "\n" + hour + ":" + min;
        return str;
    },
});