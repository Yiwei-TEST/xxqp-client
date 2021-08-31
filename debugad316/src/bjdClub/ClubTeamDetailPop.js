var ClubTeamDetailPop = BasePopup.extend({

    ctor:function(teamKeyId , beginTime , endTime){
        var tBegin = new Date();
        this.teamKeyId = teamKeyId;
        this.defaultBeginTime = beginTime || tBegin;
        this.defaultendTime = endTime || tBegin;
        this.rankParams = {};
        this._super("res/clubTeamDetailManagePop.json");//zqHome
    },

    selfRender:function(){
        //cc.sys.localStorage.setItem("sy_team_beginTime",(0));
        //cc.sys.localStorage.setItem("sy_team_endTime",(0));

        //当前页码 , 最大页码
        this.curRankPage = 1;
        this.rankMaxPage = 1;
        this.maxRankPageSize = 10; //当前最多显示多少条数据
        this.returnOne = 0;//是不是请求多个数据
        this.rankType = "";//请求多个数据的rankType

        this.rankViewList = this.getWidget("ListView_Winner");
        /**
         * 时间相关控件
         */
        this.touchPanel = this.getWidget("dataTouchPanel");
        this.openChoiceTime = this.getWidget("btnOpenChoiceTime");
        this.lbbeginTime = this.getWidget("beginTime");
        this.lbendTime = this.getWidget("endTime");
        this.touchPanel.setTouchEnabled(true);

        //组长信息
        this.lbName = this.getWidget("lbName");
        this.lbTeamRenshu = this.getWidget("Label_62");
        this.totleNum = this.getWidget("totleNum");
        this.totleWinner = this.getWidget("totleWinner");
        this.teamIcon = this.getWidget("teamIcon");

        this.activeTime = this.getWidget("activeTime");
        this.lbNoData = this.getWidget("labelNoData");


        this.pageBg = this.getWidget("pageBg");//翻页层
        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbDataPage.setString("1");
        var btnRankLeft = this.getWidget("btnDataLeft");
        var btnRankRight = this.getWidget("btnDataRight");
        var btnImport = this.getWidget("btnImport");
        var btnInvite = this.getWidget("btnInvite");
        var btnDelete = this.getWidget("btnDelete");
        var btnImportTeam = this.getWidget("btnImportTeam");

        UITools.addClickEvent(btnRankLeft , this , this.onRankUpPage);
        UITools.addClickEvent(btnRankRight , this , this.onRankDownPage);
        UITools.addClickEvent(this.touchPanel , this , this.onOpenChoiceTimePop);

        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);
        this.addCustomEvent(SyEvent.UPDATE_CLUB_MEMBER_NUMBER , this , this.onRefreshCurPage);

        if(ClickClubModel.isClubTeamLeader()){//组长才有的导入和邀请玩家的功能
            btnImport.visible =  btnInvite.visible = btnDelete.visible = btnImportTeam.visible = true;
            UITools.addClickEvent(btnImport , this , this.onOpenImportPop);
            UITools.addClickEvent(btnImportTeam , this , this.onOpenImportTeamPop);
            UITools.addClickEvent(btnInvite , this , this.onOpenInvitePop);
            UITools.addClickEvent(btnDelete, this , this.onMemberDelete);
        }else{
            btnImport.visible =  btnInvite.visible = btnDelete.visible  = btnImportTeam.visible = false;
        }

        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        //以当前时间 或者上一次的查看时间来获取数据
        this.beginTime = this.defaultBeginTime;
        this.endTime = this.defaultendTime ;
        this.lbbeginTime.setString(UITools.formatTime(this.beginTime));
        this.lbendTime.setString(UITools.formatTime(this.endTime));
        this.rankParams = {};
        this.rankParams.pageNo = 1;
        this.rankParams.beginTime = this.beginTime;
        this.rankParams.endTime = this.endTime;
        this.getRankData(this.rankParams)
    },

    /**
     * 刷新当前页面
     */
    onRefreshCurPage:function(){
        this.getRankData(this.rankParams)
    },

    /**
     * 上翻
     */
    onRankUpPage:function(){
        var curPage = Math.max(this.curRankPage - 1 , 1);
        cc.log("获取上一页数据" , curPage , this.rankMaxPage);
        if(curPage == this.curRankPage){
            return;
        }
        this.rankParams.pageNo = curPage;
        this.getRankData(this.rankParams);
    },

    /**
     * 下翻
     */
    onRankDownPage:function(){
        var curPage = Math.min(this.curRankPage + 1 , 99999);
        cc.log("获取下一页数据" , curPage , 99999);
        if(curPage == this.curRankPage){
            return;
        }
        this.rankParams.pageNo = curPage;
        this.getRankData(this.rankParams)
    },

    onOpenImportPop:function(){
        PopupManager.addPopup(new ClubInputClubPop());

    },

    onOpenImportTeamPop:function(){
        PopupManager.addPopup(new ClubTeamInputClubPop(ClickClubModel.getCurClubId() , this));

    },

    onOpenInvitePop:function(){
        //var isForbit = true;
        //if (isForbit){
        //    AlertPop.showOnlyOk("功能正在优化，敬请期待", function(){
        //
        //    });
        //    return;
        //}
        PopupManager.addPopup(new ClubAddPlayerPop(true));
    },

    onMemberDelete:function(){
        for(var index = 0;  index < this.rankViewList.getItems().length ; index++){
            var tItemNode = this.rankViewList.getItem(index);
            if(tItemNode){
                tItemNode.showOrHideCloseBtn();
            }
        }
    },

    /**
     * 加载数据 显示列表
     */
    getRankData:function(dateParam){
        if(dateParam){
            var pageNo = dateParam.pageNo;
            var curBeginTime = dateParam.beginTime;
            var curEndTime = dateParam.endTime;
        }
        cc.log("curBeginTime ..."  ,pageNo , this.maxRankPageSize);

        sy.scene.showLoading("正在获取小组详细数据");
        var self = this;
        NetworkJT.loginReq("groupAction", "loadGroupTeamUsers", {
            groupId:ClickClubModel.getCurClubId(),
            userGroup:this.teamKeyId,
            startDate:UITools.dealTimeToServer(curBeginTime) ,
            endDate : UITools.dealTimeToServer(curEndTime),
            pageNo:pageNo ,
            pageSize:this.maxRankPageSize ,
            zjs:1,
            dyj:1,
            allZjs:1,
            allDyj:1,
        }, function (data) {
            if (data) {
                cc.log("loadGroupTeamUsers::"+JSON.stringify(data));
                var tdata = data.message;
                sy.scene.hideLoading();
                self.totleNum.setString(tdata.allZjs || 0);// = this.getWidget("totleNum");
                self.totleWinner.setString(tdata.allDyj || 0); // = this.getWidget("totleWinner");

                self.lbName.setString(tdata["master"].userName);
                UITools.showIcon(tdata["master"].headimgurl,self.teamIcon);
                if(self.rankViewList){
                    if(tdata["list"].length > 0){//获取当前页 有数据的情况
                        self.lbTeamRenshu.setString(tdata["list"].length)
                        self.rankViewList.removeAllChildren();
                        self.curRankPage = tdata.pageNo || 1;
                        self.lbDataPage.setString(self.curRankPage);

                        self.lbNoData.visible = false;

                    }else{
                        if(pageNo == 1){
                            //FloatLabelUtil.comText("当前时间区间没有数据");
                            self.lbNoData.visible = true;
                        }else{
                            FloatLabelUtil.comText("没有更多数据了");
                            self.lbNoData.visible = false;
                        }
                    }

                    //把组长数据放到第一位
                    for(var i = 0;i<tdata["list"].length;++i){
                        if(tdata["list"][i].userId == tdata["master"].userId){
                            if(i!=0){
                                var temp = tdata["list"].splice(i,1);
                                temp[0].isMaster = true;
                                tdata["list"].unshift(temp[0]);
                            }else{
                                tdata["list"][0].isMaster = true;
                            }
                            break;
                        }
                    }

                    for(var index = 0 ; index < tdata["list"].length ; index ++){
                        var rankItem = new ClubTeamDetailItem(tdata["list"][index]);
                        self.rankViewList.pushBackCustomItem(rankItem);
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText("获取小组详细数据失败");
            sy.scene.hideLoading();
        });

    },


    onOpenChoiceTimePop:function(){
        var beginTime = this.beginTime;
        var endTime = this.endTime;
        var mc = new ClubChoiceTimePop(this , beginTime , endTime,3);
        PopupManager.addPopup(mc);
    },


    changeSearchTime:function(event){
        var data = event.getUserData();
        var beginTime = data.beginTime;
        var endTime = data.endTime;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.lbbeginTime.setString(UITools.formatTime(beginTime));
        this.lbendTime.setString(UITools.formatTime(endTime));
        this.rankParams.beginTime = this.beginTime;
        this.rankParams.endTime = this.endTime;
        this.rankParams.pageNo = 1;
        this.rankViewList.removeAllChildren();

        this.getRankData(this.rankParams)
    },


});

