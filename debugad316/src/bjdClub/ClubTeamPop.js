/**
 * Created by Administrator on 2017/7/21.
 */

/**
 * 修改俱乐部弹框
 */
var ClubTeamPop = BasePopup.extend({

    ctor:function(){
        this._super("res/clubTeamPop.json");//zqHome
    },

    selfRender:function(){
        //当前页码 , 最大页码
        this.rankParams = {};
        this.curRankPage = 1;
        this.rankMaxPage = 1;
        this.maxRankPageSize = 10; //当前最多显示多少条数据
        this.returnOne = 0;//是不是请求多个数据
        this.rankType = "";//请求多个数据的rankType

        this.teamViewList = this.getWidget("ListView_Team");
        /**
         * 时间相关控件
         */
        this.touchPanel = this.getWidget("dataTouchPanel");
        this.openChoiceTime = this.getWidget("btnOpenChoiceTime");
        this.lbbeginTime = this.getWidget("beginTime");
        this.lbendTime = this.getWidget("endTime");
        this.touchPanel.setTouchEnabled(true);

        this.totleNum = this.getWidget("totleNum");
        this.totleWinner = this.getWidget("totleWinner");

        this.activeTime = this.getWidget("activeTime");
        this.lbNoData = this.getWidget("labelNoData");


        this.pageBg = this.getWidget("pageBg");//翻页层
        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbDataPage.setString("1");
        var btnImport = this.getWidget("btnImport");
        var btnInvite = this.getWidget("btnInvite");


        UITools.addClickEvent(this.touchPanel , this , this.onOpenChoiceTimePop);
        UITools.addClickEvent(this.openChoiceTime , this , this.onOpenChoiceTimePop);
        //this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);
        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);


        var btnInviteTeamManager = this.getWidget("btnCreate");
        var btnDeleteTeam = this.getWidget("btnDelte");
        if(btnInviteTeamManager && btnDeleteTeam){
            if (!ClickClubModel.isClubCreater()){
                btnInviteTeamManager.visible = false;
                btnDeleteTeam.visible = false;
            }
            UITools.addClickEvent(btnInviteTeamManager, this , this.onTeamInvite);
            UITools.addClickEvent(btnDeleteTeam, this , this.onTeamDelete);
        }


        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());


        this.addCustomEvent(SyEvent.CLUB_DELETE_TEAM_SUC , this , this.removeTeamItemById);
        this.addCustomEvent(SyEvent.CLUB_CREATE_TEAM_SUC , this, this.updateTeamDatas);
        this.addCustomEvent(SyEvent.OPEN_TEAM_DETAIL , this , this.openDetailPop);


        //以当前时间 或者上一次的查看时间来获取数据
        var tBegin = new Date();
        this.defaultBeginTime = tBegin;
        this.defaultendTime = tBegin;

        this.beginTime = this.defaultBeginTime;
        this.endTime = this.defaultendTime ;
        this.rankParams.beginTime = this.beginTime;
        this.rankParams.endTime = this.endTime;
        this.lbbeginTime.setString(UITools.formatTime(this.beginTime));
        this.lbendTime.setString(UITools.formatTime(this.endTime));

       var img_bg2 = this.getWidget("img_bg2");
       var lbtitleName = img_bg2.getChildByName("lbtitleName");
       var lballJushu = img_bg2.getChildByName("lballJushu");
       var lbwinner = img_bg2.getChildByName("lbwinner");
       this.renshu_sort = lbtitleName.getChildByName("renshu_sort");
       this.jushu_sort = lballJushu.getChildByName("jushu_sort");
       this.winner_sort = lbwinner.getChildByName("winner_sort");
        var button = [this.renshu_sort,this.jushu_sort,this.winner_sort];
        for(var i = 0;i < button.length;++i){
            UITools.addClickEvent(button[i], this , this.onClickSortBtn);
        }
        this.curSortBtn = this.renshu_sort;
        this.isDown = true;
        this.updateSortBtnState();

        var tdateParams = {};
        tdateParams.pageNo = 1;
        tdateParams.beginTime = this.beginTime;
        tdateParams.endTime = this.endTime;
        this.getTeamData(tdateParams);
        //this.showByData(this.teamData);
    },

    onClickSortBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(sender == this.curSortBtn){
            this.isDown = !this.isDown;
        }else{
            this.curSortBtn = sender;
            this.isDown = !this.curSortBtn.getChildByName("icon").isFlippedY();
        }
        this.updateSortBtnState();
        this.getTeamData(this.rankParams);
    },

    updateSortBtnState:function(){
        var color1 = cc.color.YELLOW;
        var color2 = cc.color.WHITE;

        var btnArr = [this.renshu_sort,this.jushu_sort,this.winner_sort];

        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].getChildByName("icon").setColor(this.curSortBtn == btnArr[i]?color1:color2);
            if(this.curSortBtn == btnArr[i]){
                var img = "res/ui/bjdmj/popup/pyq/tongji/xia.png";
                if(!this.isDown)img = "res/ui/bjdmj/popup/pyq/tongji/shang.png";
                this.curSortBtn.getChildByName("icon").loadTexture(img);
            }
        }

    },

    onOpenChoiceTimePop:function(){
        var mc = new ClubChoiceTimePop(this , this.rankParams.beginTime , this.rankParams.endTime,3);
        PopupManager.addPopup(mc);
    },

    changeSearchTime:function(event){
        cc.log("event::" , event);
        var data = event.getUserData();
        //如果当前还打开了俱乐部分组详情界面 那这里不用处理该消息
        //if(PopupManager.hasClassByPopup(ClubTeamDetailPop)){
        //    return; //任何地方修改了时间区间 其他界面都要重新加载内容
        //}


        this.beginTime = data.beginTime;
        this.endTime = data.endTime;
        cc.sys.localStorage.setItem("sy_team_beginTime",(this.beginTime));
        cc.sys.localStorage.setItem("sy_team_endTime",(this.endTime));
        this.lbbeginTime.setString(UITools.formatTime(this.beginTime));
        this.lbendTime.setString(UITools.formatTime(this.endTime));
        this.rankParams.beginTime = this.beginTime;
        this.rankParams.endTime = this.endTime;
        this.rankParams.pageNo = 1;
        this.teamViewList.removeAllChildren();

        this.getTeamData(this.rankParams)
    },

    getTeamData:function(dateParam){
        //cc.log("重新获取俱乐部分组数据");
        if(dateParam){
            var pageNo = dateParam.pageNo;
            var curBeginTime = dateParam.beginTime;
            var curEndTime = dateParam.endTime;
        }
        cc.log("curBeginTime ..."  ,pageNo , this.maxRankPageSize);

        sy.scene.showLoading("正在获取小组数据");
        var self = this;
        NetworkJT.loginReq("groupAction", "loadGroupTeams", {
            userGroup:0 ,
            groupId:ClickClubModel.getCurClubId(),
            startDate:UITools.dealTimeToServer(curBeginTime) ,
            endDate : UITools.dealTimeToServer(curEndTime),
            zjs:1,
            dyj:1
        }, function (data) {
            if (data) {
                cc.log("loadGroupTeams::"+JSON.stringify(data));
                sy.scene.hideLoading();
                self.showByData(data);
                //self.totleNum.setString(data.dyjCount0 || 0);
                //self.totleWinner.setString(data.zjsCount0 || 0);
                //if(self.teamViewList){
                //    if(data["message"].length > 0){//获取当前页 有数据的情况
                //        self.teamViewList.removeAllChildren();
                //        self.lbNoData.visible = false;
                //    }else{
                //        self.lbNoData.visible = true;
                //    }
                //
                //    for(var index = 0 ; index < data["message"].length ; index ++){
                //        var tTeamItem = new ClubTeamItem(data["message"][index]);
                //        cc.log("插入分组item");
                //        self.teamViewList.pushBackCustomItem(tTeamItem);
                //    }
                //}
            }
        }, function (data) {
            FloatLabelUtil.comText("加载分组失败");
            sy.scene.hideLoading();
        });
    },

    showByData:function(data){
        this.totleNum.setString(data.zjsTotal || 0);
        this.totleWinner.setString(data.dyjTotal || 0);
        if(this.teamViewList){
            if(data["message"].length > 0){//获取当前页 有数据的情况
                this.teamViewList.removeAllChildren();
                this.lbNoData.visible = false;
            }else{
                this.lbNoData.visible = true;
            }

            var listArr = data["message"];
            if(this.curSortBtn == this.renshu_sort){//人数
                listArr.sort(function(a,b){
                    return parseInt(a.userCount) - parseInt(b.userCount);
                });
            }else if(this.curSortBtn == this.jushu_sort){//总局数
                listArr.sort(function(a,b){
                    return parseInt(a.zjsCount) - parseInt(b.zjsCount);
                });
            }else if(this.curSortBtn == this.winner_sort){//大赢家
                listArr.sort(function(a,b){
                    return parseInt(a.dyjCount) - parseInt(b.dyjCount);
                });
            }

            if(this.isDown){
                listArr.reverse();
            }

            for(var index = 0 ; index < listArr.length ; index ++){
                var tTeamItem = new ClubTeamItem(listArr[index]);
                this.teamViewList.pushBackCustomItem(tTeamItem);
            }
        }
    },


    openDetailPop:function(event){
        var tTeamKeyId = event.getUserData().teamKeyId;
        PopupManager.addPopup(new ClubTeamDetailPop(tTeamKeyId, this.beginTime ,this.endTime));
    },

    updateTeamDatas:function(){
        //cc.log("重新获取俱乐部分组数据");
        this.rankParams.beginTime = this.beginTime;
        this.rankParams.endTime = this.endTime;
        this.rankParams.pageNo = 1;
        this.teamViewList.removeAllChildren();

        this.getTeamData(this.rankParams)
    },

    onTeamInvite:function(){
        PopupManager.addPopup(new ClubCreateTeamPop());
    },

    onTeamDelete:function(){
        for(var index = 0;  index < this.teamViewList.getItems().length ; index++){
            var tItemNode = this.teamViewList.getItem(index);
            if(tItemNode){
                tItemNode.showOrHideCloseBtn();
            }
        }
    },

    removeTeamItemById:function(event){
        var data = event.getUserData();
        var teamId = data.teamKeyId;
        if(teamId){
            for(var index = 0;  index < this.teamViewList.getItems().length ; index++){
                var tItemNode = this.teamViewList.getItem(index);
                if(tItemNode){
                    if(tItemNode.getTeamKeyId() == teamId){
                        this.teamViewList.removeItem(index);
                        return;
                    }
                }
            }
        }
    },

});

