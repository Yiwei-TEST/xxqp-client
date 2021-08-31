/**
 * 俱乐部零钱包弹框
 */
var lingQianPop = BasePopup.extend({

    ctor:function(){
        
        this._super("res/lingQianPop.json");
    },

    selfRender:function(){

        this.Label_weitiqu = this.getWidget("Label_weitiqu");
        this.Label_zuori = this.getWidget("Label_zuori");

        this.Button_xiangqing = this.getWidget("Button_xiangqing");
        UITools.addClickEvent(this.Button_xiangqing, this, function () {
            var pop = new lingQianDetailPop();
            PopupManager.addPopup(pop);
        });
        this.Button_save = this.getWidget("Button_save");
        UITools.addClickEvent(this.Button_save, this, function () {
            var pop = new lingQianOpratePop(3,this.restScore);
            PopupManager.addPopup(pop);
        });
        this.Button_tiqu = this.getWidget("Button_tiqu");
        UITools.addClickEvent(this.Button_tiqu, this, function () {
            var pop = new lingQianOpratePop(2,this.restScore);
            PopupManager.addPopup(pop);
        });
       this.getData();

       this.addCustomEvent("lingqian_updateMyCredit", this, this.UpdateMyCredit);

    },

    getData:function () {
        var self = this;
        NetworkJT.loginReq("groupActionNew", "opCreditPurse", {
            groupId: ClickClubModel.getCurClubId(),
            mUserId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            msgType: "getInfo"
        }, function (data) {
            if (data) {
                cc.log("opCreditPurse::" + JSON.stringify(data));
                var creditPurse = MathUtil.toDecimal(data.message.creditPurse / 100);
                self.Label_weitiqu.setString(creditPurse);
                var creditYesterday = MathUtil.toDecimal(data.message.creditYesterday / 100);
                self.Label_zuori.setString(creditYesterday);
                self.restScore = creditPurse;
            }
        }, function () {
            FloatLabelUtil.comText("加载钱包数据失败");
            sy.scene.hideLoading();
        });
    },
    UpdateMyCredit: function (event) {
        var tData = event.getUserData();
        var creditPurse = MathUtil.toDecimal(tData / 100);
        this.Label_weitiqu.setString(creditPurse);
        this.restScore = creditPurse;
    }
});

/**
 * 俱乐部手动添加玩家弹框
 */
var lingQianOpratePop = BasePopup.extend({

    ctor: function (type, restScore){
        this.type = type;
        this.msgType = type == 3 ? "save" :"draw";
        this.restScore = restScore;
        cc.log("this.restScore", this.restScore);
        this._super("res/lingQianOpratePop.json");
    },

    selfRender:function(){
        this.getWidget("tittle").loadTexture("res/ui/bjdmj/popup/pyq/lingqian/tittle"+this.type + ".png");
        var inputIdCardImg = this.getWidget("Image_8");
        var str = (this.msgType == "save") ? "请输入存储数额" : "请输入提取数额";
        var pos = cc.p(inputIdCardImg.width / 2, inputIdCardImg.height / 2);
        var size = cc.size(483, 89);
        this.inputId = new cc.EditBox(size, new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/lingqian/bg4.png"));
        this.inputId.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputId.setPlaceHolder(str);
        this.inputId.setPosition(pos);
        inputIdCardImg.addChild(this.inputId, 0);

        this.btn_qb = this.getWidget("Button_14");
        UITools.addClickEvent(this.btn_qb, this, this.onAllScore);


        this.Button_sure = this.getWidget("Button_sure");
        UITools.addClickEvent(this.Button_sure, this, this.getAllScore);

        this.Button_cancel = this.getWidget("Button_cancel");
        UITools.addClickEvent(this.Button_cancel, this, this.onCancle);
    },

    onAllScore: function () {
        if (this.msgType == "save") {
            this.inputId.setString(ClickClubModel.getCurMyCredit());
        } else {
            this.inputId.setString(this.restScore);
        }
    },


    getAllScore: function () {
        //请求后台获取所有分数
        var self = this;
        var getScore = this.inputId.getString();
        cc.log("getScore::", getScore);
        if (getScore == "" || !this.isNumber(getScore)) {
            FloatLabelUtil.comText("输入的必须为正数");
            return
        }
        getScore = Math.floor(getScore * 100);
        cc.log("getScore =", getScore);
        NetworkJT.loginReq("groupActionNew", "opCreditPurse", {
            msgType: this.msgType,
            mUserId: PlayerModel.userId,
            groupId: ClickClubModel.getCurClubId(),
            sessCode: PlayerModel.sessCode,
            creditPurse: getScore || 0,
        }, function (data) {
            if (data) {
                if (self) {
                    cc.log("opCreditPurse:: ", JSON.stringify(data));
                    FloatLabelUtil.comText("操作成功");
                    SyEventManager.dispatchEvent("lingqian_updateMyCredit", data.message);
                    PopupManager.remove(self);
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            PopupManager.remove(self);
        });
    },

    isNumber:function (num){
        var reg = /^\d+(?=\.{0,1}\d+$|$)/;
        if(reg.test(num)) return true;
        return false;  
    },

    isNumberOrCharacter: function (_string) {
        var charecterCount = 0;
        for (var i = 0; i < _string.length; i++) {
            var character = _string.substr(i, 1);
            var temp = character.charCodeAt();
            if (48 <= temp && temp <= 57) {

            } else if (temp == 88) {
                charecterCount += 1;
            } else if (temp == 120) {
                charecterCount += 1;
            } else {
                return false;
            }
        }
        if (charecterCount <= 1) {
            return true
        }
    },

    onCancle: function () {
        PopupManager.remove(this);
    },
});

var lingQianDetailPop = BasePopup.extend({

    ctor: function () {
        this._super("res/lingQianDetailPop.json");
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
        this.defaultBeginTime = UITools.getLocalItem("sy_credit_beginTime") || tBegin;
        this.defaultendTime = UITools.getLocalItem("sy_credit_endTime") || tBegin;

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
        var beginTime = UITools.getLocalItem("sy_credit_beginTime") || 0;
        var endTime = UITools.getLocalItem("sy_credit_endTime") || 0;
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

        NetworkJT.loginReq("groupActionNew", "creditLogList", {
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            pageNo: page,
            pageSize: 20,
            targetId: PlayerModel.userId,
            selectType: 6,
            startDate: startDate,
            endDate: endDate,
            fullQLType:1
        }, function (data) {
            if (data) {
                cc.log("============getUserDetailScore===========" + JSON.stringify(data));
                var isShow = false;
                if (data.message.dataList.length > 0) {//获取当前页 有数据的情况
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

                self.refreshUserDetailList(data.message.dataList);

                var zongji = data.message.sumCredit || 0;
                zongji = MathUtil.toDecimal(zongji / 100);
                self.label_zongji.setString("合计：" + zongji);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshUserDetailList: function (data) {
        this.ListView_mumber.removeAllChildren();
        for (var i = 0; i < data.length; ++i) {
            var item = new CreditScoreDetailItem();
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

        cc.sys.localStorage.setItem("sy_credit_beginTime", (this.beginTime));
        cc.sys.localStorage.setItem("sy_credit_endTime", (this.endTime));

        this.curRankPage = 1;
        this.getData();
    
    },
});