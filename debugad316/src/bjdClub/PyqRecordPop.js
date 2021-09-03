/**
 * Created by mayn on 2019/8/1.
 */
var PyqRecordPop = BasePopup.extend({
    clubPage:1,
    maxClubItem:10,
    clubRecordData:null,
    show_version:true,
    ctor:function(){
        this._super("res/pyqRecordPop.json");

    },

    onEnter:function(){
        this._super();
        this.getClubRecordData();
    },

    selfRender:function(){
        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        this.clubjush = this.getWidget("total_jushu_num");
        this.clubjush.setString("共0局");

        this.clubzongfen = this.getWidget("total_score");
        this.clubzongfen.setString("总分:0");

        //if(!ClickClubModel.isClubCreaterOrLeader()){
        //    this.clubjush.setVisible(false);
        //}

        this.panel_detail_club = this.getWidget("Panel_detail_club");
        this.panel_detail_club.setVisible(false);

        this.btn_back_club = this.getWidget("btn_back_club");
        UITools.addClickEvent(this.btn_back_club , this , this.onClickClubBack);

        this.isSelecZtjs = false;
        this.btn_ztjs = this.getWidget("btn_ztjs");
        this.btn_ztjs.setBright(false);
        UITools.addClickEvent(this.btn_ztjs , this , this.onClickZtjsBtn);

        this.isSelf = 1;
        this.btn_isSelf = this.getWidget("isSelf");
        //this.btn_isSelf.getChildByName("select").setBright(true);
        UITools.addClickEvent(this.btn_isSelf , this , this.onClickIsSelf);
        this.btn_isSelf.visible = !ClickClubModel.isClubNormalMember();

        this.labelPage = this.getWidget("label_page");
        this.btn_left_page = this.getWidget("btn_left");
        this.btn_right_page = this.getWidget("btn_right");
        UITools.addClickEvent(this.btn_left_page , this , this.onClickLeftPageBtn);
        UITools.addClickEvent(this.btn_right_page , this , this.onClickRightPageBtn);

        var check_input_bg = this.getWidget("check_input_bg")
        this.inputBox = new cc.EditBox(cc.size(300, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = check_input_bg.width/2 + 85;
        this.inputBox.y = check_input_bg.height/2 - 2;
        this.inputBox.setPlaceHolder("输入回放码");
        //this.inputBox.setPlaceholderFontColor(cc.color(255,255,255));
        this.inputBox.setMaxLength(12);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox.setFont("Arial",45);
        this.inputBox.setPlaceholderFont("Arial",45);
        check_input_bg.addChild(this.inputBox,1);

        var inputBg1 = this.getWidget("input_bg");
        var inputBg2 = this.getWidget("input_bg1");

        this.inputRoomIdBox = new cc.EditBox(cc.size(250, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputRoomIdBox.setPosition(this.inputRoomIdBox.width/2 + 10,inputBg1.height/2 - 2);
        this.inputRoomIdBox.setPlaceHolder("输入房号");
        this.inputRoomIdBox.setMaxLength(10);
        this.inputRoomIdBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputRoomIdBox.setFont("Arial",40);
        this.inputRoomIdBox.setPlaceholderFont("Arial",40);
        inputBg1.addChild(this.inputRoomIdBox,1);

        this.inputUserIdBox = new cc.EditBox(cc.size(250, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputUserIdBox.setPosition(this.inputRoomIdBox.width/2 + 10,inputBg2.height/2 - 2);
        this.inputUserIdBox.setPlaceHolder("输入玩家ID");
        this.inputUserIdBox.setMaxLength(10);
        this.inputUserIdBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputUserIdBox.setFont("Arial",40);
        this.inputUserIdBox.setPlaceholderFont("Arial",40);
        inputBg2.addChild(this.inputUserIdBox,1);

        this.listview_zj = this.getWidget("listview_zj");
        this.listview_info = this.getWidget("listview_info");

        this.item_zj = this.getWidget("item_zj");
        this.item_zj.setVisible(false);

        this.detailItemClub = this.getWidget("info_item");
        this.detailItemClub.setVisible(false);

        this.btn_check = this.getWidget("btn_check");
        UITools.addClickEvent(this.btn_check, this , this.onClickCheckBtn);

        this.btn_search_room = ccui.helper.seekWidgetByName(inputBg1,"btn_search");
        this.btn_search_id = ccui.helper.seekWidgetByName(inputBg2,"btn_search");

        UITools.addClickEvent(this.btn_search_room , this , this.onClickClubSearchRoom);
        UITools.addClickEvent(this.btn_search_id , this , this.onClickClubSearchId);


        this.touchPanel = this.getWidget("dataTouchPanel");
        this.touchPanel.setTouchEnabled(true);
        UITools.addClickEvent(this.touchPanel , this , this.onOpenChoiceTimePop);

        this.lbbeginTime = this.getWidget("beginTime");
        this.lbendTime = this.getWidget("endTime");

        var tBegin = new Date();
        this.beginTime = tBegin;
        this.endTime = tBegin;

        this.lbbeginTime.setString(UITools.formatTime(this.beginTime));
        this.lbendTime.setString(UITools.formatTime(this.endTime));

        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);

        this.dayBtnArr = [];
        for(var i = 0;i<3;++i){
            this.dayBtnArr[i] = this.getWidget("btn_day_" + (i+1));
            this.dayBtnArr[i].tempData = i+1;
            UITools.addClickEvent(this.dayBtnArr[i] , this , this.onClickSelectDay);
            if(i > 0){
                this.dayBtnArr[i].setBright(false);
            }
        }
        this.clubDayType = 1;

        this.isSelecWzq = false;
        // this.btn_wzq = this.getWidget("btn_wzq");
        // this.btn_wzq.setBright(false);
        // UITools.addClickEvent(this.btn_wzq , this , this.onClickWzqBtn);
    },

    onClickSelectDay:function(sender){
        if(sender.tempData == this.clubDayType)return;

        this.clubDayType = sender.tempData;

        for(var i = 0;i<3;++i){
            this.dayBtnArr[i].setBright(sender == this.dayBtnArr[i]);
        }

        this.clubPage = 1;
        this.getClubRecordData(1,this.inputRoomIdBox.getString(),this.inputUserIdBox.getString());
    },

    changeSearchTime:function(event){
        var data = event.getUserData();

        this.beginTime = new Date(data.beginTime);
        this.endTime = new Date(data.endTime);
        this.lbbeginTime.setString(UITools.formatTime(this.beginTime));
        this.lbendTime.setString(UITools.formatTime(this.endTime));

        this.getClubRecordData(1,this.inputRoomIdBox.getString(),this.inputUserIdBox.getString());
    },

    formatDataToSever:function(time,isEnd){
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        if(m<10)m = "0" + m;
        if(d<10)d = "0" + d;

        var ret = y + "-" + m + "-" + d;
        if(isEnd)ret += " 23:59:59";
        else ret += " 00:00:00";

        cc.log("=========formatDataToSever=========" + ret);
        return ret;
    },

    onOpenChoiceTimePop:function(){
        var mc = new ClubChoiceTimePop(this , this.beginTime , this.endTime,3);
        PopupManager.addPopup(mc);
    },

    onClickIsSelf:function(){
        this.isSelf = !!this.isSelf ? 0 : 1;
        var res = this.isSelf ? "res/ui/createRoom/createroom_btn_fang_1.png" : "res/ui/createRoom/createroom_btn_fang_2.png";
        this.btn_isSelf.getChildByName("select").loadTexture(res)
        this.clubPage = 1;
        this.getClubRecordData(1,this.inputRoomIdBox.getString(),this.inputUserIdBox.getString());
    },

    onClickCheckBtn:function(){
        cc.log("=============onClickCheckBtn==============");
        var code = this.inputBox.getString();
        if(!code){
            FloatLabelUtil.comText("请输入回放码");
            return;
        }
        this.getLogWithCode(code);
    },

    onClickClubSearchRoom:function(){
        //var role = ClickClubModel.getCurClubRole();
        //if(role != 0 && role != 1){
        //    FloatLabelUtil.comText("只有管理员以上权限才能查询");
        //    return;
        //}

        this.clubPage = 1;
        this.getClubRecordData(1,this.inputRoomIdBox.getString(),0);
    },

    onClickClubSearchId:function(){
        //var role = ClickClubModel.getCurClubRole();
        //if(role != 0 && role != 1){
        //    FloatLabelUtil.comText("只有管理员以上权限才能查询");
        //    return;
        //}

        this.clubPage = 1;
        this.getClubRecordData(1,0,this.inputUserIdBox.getString());
    },

    getLogWithCode:function(code){
        Network.loginReq("qipai","getPlayBackLog",{logId:code, userId:PlayerModel.userId}, function(data){
            if(data){
                // cc.log("=========getLogWithCode==========" + JSON.stringify(data));
                if(data.playLog && data.playLog.length>0){
                    this.showClubDetailZhanji(this.handleDetailData(data));
                }else{
                    FloatLabelUtil.comText("没有该回放码的战绩");
                }
            }
        }.bind(this),function(data){
            //cc.log("=======getLogWithCode======error====" + JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },

    onClickLeftPageBtn:function(){
        if(this.clubPage > 1){
            this.getClubRecordData(this.clubPage - 1,this.inputRoomIdBox.getString(),this.inputUserIdBox.getString());
        }
    },

    onClickRightPageBtn:function(){
        this.getClubRecordData(this.clubPage + 1,this.inputRoomIdBox.getString(),this.inputUserIdBox.getString());
    },

    onClickClubBack:function(){
        this.panel_detail_club.setVisible(false);
    },

    onClickZtjsBtn:function(){
        this.isSelecZtjs = !this.isSelecZtjs;
        this.btn_ztjs.setBright(this.isSelecZtjs);

        this.clubPage = 1;
        this.getClubRecordData(1,this.inputRoomIdBox.getString(),this.inputUserIdBox.getString());
    },

    onClickWzqBtn:function(){
        this.isSelecWzq = !this.isSelecWzq;
        // this.btn_wzq.setBright(this.isSelecWzq);

        this.clubPage = 1;
        this.getClubRecordData(1,this.inputRoomIdBox.getString(),this.inputUserIdBox.getString());
    },

    /**
     * 获取俱乐部战绩数据
     */
    getClubRecordData:function(page,roomId,userId){
        page = page || 1;
        roomId = roomId || 0;
        userId = userId || 0;

        //var role = ClickClubModel.getCurClubRole();
        //if(role != 0 && role != 1){
        //    roomId = 0;
        //    userId = 0;
        //}
        var self = this;
        sy.scene.showLoading("正在获取战绩数据");
        NetworkJT.loginReq("groupActionNew", "loadTablePlayLogs", {groupId:ClickClubModel.getCurClubId(),
            //queryDate:1,  //当前日期
            pageNo:page,  //当前页数
            pageSize:this.maxClubItem,
            condition:this.isSelecZtjs?1:0,
            queryUserId:userId,
            queryTableId:roomId,
            startDate:this.formatDataToSever(this.beginTime),
            endDate:this.formatDataToSever(this.endTime,true),
            sessCode:PlayerModel.sessCode,
            isSelf:self.isSelf,
            userId:PlayerModel.userId,
            playLogsTag:1,
            playType:this.isSelecWzq ? GameTypeEunmPK.WZQ : 0
        }, function (data) {
            // cc.log("==========getClubRecordData============="+JSON.stringify(data));
            if (data) {
                sy.scene.hideLoading();
                ClubRecallModel.init(data);
                ClubRecallModel.clubId = ClickClubModel.getCurClubId();
                ClubRecallModel.clubRole = ClickClubModel.getCurClubRole();

                var label_no_data = self.getWidget("label_no_data");

                if(data.message.list.length > 0){
                    self.clubPage = page;
                    self.labelPage.setString(page);
                    label_no_data.setVisible(false);

                    self.clubjush.setString("共" + (data.message.tables || 0) + "局");
                }else{
                    if(self.clubPage == page){
                        label_no_data.setVisible(true);
                    }else{
                        FloatLabelUtil.comText("没有更多数据了");
                        return;
                    }
                }
                self.setPyqZjLayer(data);
            }
        }, function (data) {
            sy.scene.hideLoading();
            FloatLabelUtil.comText("获取战绩数据失败");
        });


    },

    getClubDetailData:function(idx){
        cc.log("请求战绩详情---------"+this.index)
        var tableNo = this.clubRecordData[idx].tableNo;
        var self = this;
        sy.scene.showLoading("正在获取战绩详情数据");
        NetworkJT.loginReq("groupActionNew", "loadTableRecord", {
            tableNo:tableNo,
            sessCode:PlayerModel.sessCode,
            userId:PlayerModel.userId,
            isClub:1,
            recordTag:1
        }, function (data) {
            sy.scene.hideLoading();
            if (data) {
                cc.log("==========getClubDetailData========"+JSON.stringify(data));

                ClubRecallDetailModel.init(data);

                self.showClubDetailZhanji(self.handleClubDetailData(data),tableNo);

            }
        }, function (data) {
            cc.log("getUserPlayLog::"+JSON.stringify(data));
            sy.scene.hideLoading();
            FloatLabelUtil.comText("获取战绩详情数据失败");
        });

    },

    handleDetailData:function(data){
        var retData = {};

        retData.gameName = ClubRecallDetailModel.getGameStr(data.playLog[0].playType);

        if(data.playLog[0].playType == GameTypeEunmZP.LDFPF){
            retData.jushu = data.playLog.length;
        }else{
            retData.jushu = data.playLog.length + "/" + data.playLog[0].totalCount;
        }
        // cc.log("data.playLog.length =",data.playLog.length);
        // cc.log("data.playLog[0].maxPlayerCount =",data.playLog[0].maxPlayerCount);
        retData.reshu = data.playLog[0].maxPlayerCount;
        retData.time_day = data.playLog[0].time.substr(0,11);
        retData.time_sec = data.playLog[0].time.substr(11,20);
        retData.players = [];
        retData.scoreItems = [];

        var idArr = [];
        for(var i = 0;i<data.playLog[0].playerMsg.length;++i){
            retData.players.push(data.playLog[0].playerMsg[i].name);
            idArr.push(data.playLog[0].playerMsg[i].userId);
        }


        for(var i = 0;i<data.playLog.length;++i){
            var info = {};
            info.time = data.playLog[i].time.substr(11,20);
            info.scores = [];
            var msgArr = data.playLog[i].playerMsg;
            for(var j = 0;j<msgArr.length;++j){
                var idx = j;
                for(var t = 0;t<idArr.length;++t){
                    if(idArr[t] == msgArr[j].userId){
                        idx = t;
                        break;
                    }
                }
                info.scores[idx] = msgArr[j].point;
            }

            info.tempData = data.playLog[i];
            retData.scoreItems.push(info);
        }

        // cc.log("data.playLog[0].generalExt =", JSON.stringify(data.playLog[0].generalExt));
        if (data.playLog[0].generalExt){
            var intParams = JSON.parse(data.playLog[0].generalExt).intParams;
            retData.wanfaStr = ClubRecallDetailModel.getWanfaStr(intParams);
        }
        return retData;
    },

    handleClubDetailData:function(data){
        var retData = this.handleDetailData(data);
        retData.room_id = data.playLog[0].tableId;
        retData.gameName = ClubRecallDetailModel.getGameStr(data.playLog[0].playType);

        var detailInfoStr = "";

        var resultMsg = JSON.parse(data.resultMsg);
        var modeMsg = JSON.parse(data.modeMsg);
        var createTimeStr = resultMsg.createTime || "";

        var dissPlayerStr = ClubRecallDetailModel.getDissPlayerStr(resultMsg);

        var wanfaStr = ClubRecallDetailModel.getWanfaStr(modeMsg.ints);

        detailInfoStr += ("创建时间:" + createTimeStr);
        detailInfoStr += ("\n" + dissPlayerStr);


        var creditMsg = "";
        if(data.playLog[0].generalExt){
            var ext = JSON.parse(data.playLog[0].generalExt);
            var msgArr = [];
            if(ext.creditMsg){
                msgArr = ext.creditMsg.split(",");
            }
            if(msgArr[0] == 1){
                var cyzdScore = MathUtil.toDecimal((msgArr[1] || 0)/100);
                var tczdScore = MathUtil.toDecimal((msgArr[2] || 0)/100);
                var zscsScore = MathUtil.toDecimal((msgArr[7] || 0)/100);
                var zsfsScore = MathUtil.toDecimal((msgArr[4] || 0)/100);
                var bsdfScore = MathUtil.toDecimal((msgArr[3] || 0)/100);
                var qzbdScore = MathUtil.toDecimal((msgArr[9] || 0)/100);

                creditMsg += ("参与最低:"+cyzdScore);
                creditMsg += ("  踢出最低:"+tczdScore);

                if(msgArr[10] != 0){
                    creditMsg += ("  比赛底分:"+bsdfScore);
                    creditMsg += ("\n赠送分数:"+zsfsScore);
                    creditMsg += ("  AA赠送");
                }else{
                    creditMsg += ("  赠送初始:"+zscsScore);
                    creditMsg += ("\n赠送分数:"+zsfsScore);
                    creditMsg += ("  群主保底:"+qzbdScore);
                    creditMsg += ("  比赛底分:"+bsdfScore);
                }
            }
        }

        retData.infoStr = detailInfoStr;
        retData.wanfaStr = wanfaStr;
        retData.creditMsg = creditMsg;

        return retData;
    },

    setPyqZjLayer:function(dataInfo){
        var  data = dataInfo.message.list;
        var  totalPoint = dataInfo.message.totalPoint;
        // cc.log("PyqZj data =",JSON.stringify(data));
        this.clubRecordData = data;

        this.listview_zj.removeAllItems();

        var totalScore = 0;
        for(var i = 0;i<data.length;++i){
            var newItem = this.item_zj.clone();
            newItem.setVisible(true);
            this.listview_zj.pushBackCustomItem(newItem);

            newItem.tempData = i;
            var label_idx = newItem.getChildByName("label_idx");
            var btn_xq = newItem.getChildByName("btn_xq");
            var label_room_id = newItem.getChildByName("label_room_id");
            var label_wanfa = newItem.getChildByName("label_wanfa");
            var label_time = newItem.getChildByName("label_time");
            var label_ztjs = newItem.getChildByName("label_ztjs");
            btn_xq.tempData = i;
            UITools.addClickEvent(btn_xq,this,this.onClickPyqXq);

            var dissStr = "正常结束";
            if (data[i].currentState == 2){
                dissStr = "正常结束";
            }else if (data[i].currentState == 3){
                dissStr = "未开局被解散";
            }else if (data[i].currentState == 4){
                var jushu = data[i].playedBureau;
                dissStr = "中途解散\n" + "(第"+ jushu +"局)";
            }else if(data[i].currentState == 5){
                dissStr = "托管解散";
            }
            label_ztjs.setString(dissStr);
            label_idx.setString(i+1);
            label_room_id.setString(data[i].tableId || "");
            label_wanfa.setString(ClubRecallDetailModel.getGameStr(data[i].playType) + "\n" + data[i].roomName);
            if(data[i].playType == GameTypeEunmPK.WZQ){
                label_wanfa.setString(ClubRecallDetailModel.getGameStr(data[i].playType));
            }
            label_time.setString(data[i].overTime);

            var icon_fz = newItem.getChildByName("icon_fz");
            icon_fz.setVisible(false);

            cc.log("data[i]===",JSON.stringify(data[i]));
            var nameArr = data[i].players.split(",");
            var scoreArr = data[i].point.split(",");
            var winArr = data[i].isWinner.split(",");
            var creditArr = data[i].winLoseCredit.split(",");
            var commissionCreditArr = data[i].commissionCredit.split(",");
            for(var j = 0;j<4;++j){
                var label_name = newItem.getChildByName("label_name_" + (j + 1));
                var label_score = label_name.getChildByName("label_score");
                var label_credit = label_name.getChildByName("label_credit");
                label_name.visible = label_score.visible = (j < nameArr.length);
                label_name.setString(nameArr[j] || "");
                var score = parseInt(scoreArr[j] || 0)
                if(data[i].playType == GameTypeEunmPK.WZQ){
                    score = score/100
                }
                this.setLabelScore(label_score,score);
                var credit = Number(creditArr[j]) + Number(commissionCreditArr[j]);
                this.setLabelScore(label_credit,MathUtil.toDecimal(credit/100) || 0);

                if(nameArr[j] == PlayerModel.name){
                    totalScore += parseInt(scoreArr[j] || 0);
                }

                if(nameArr.length < 4){
                    var offsety = (4 - nameArr.length)*38/2;
                    label_name.y -= offsety;
                }

                if(j == data[i].masterNameIndex && label_name.visible){
                    icon_fz.setVisible(true);
                    icon_fz.y = label_name.y;
                }
            }

        }
        this.clubzongfen.setString("总分:" + totalPoint);
    },

    showClubDetailZhanji:function(data,tableNo){
        this.panel_detail_club.setVisible(true);
        // cc.log("data.reshu =",data.reshu);
        ccui.helper.seekWidgetByName(this.panel_detail_club,"gameName").setString(data.gameName);
        ccui.helper.seekWidgetByName(this.panel_detail_club,"reshu").setString(data.reshu + "人");
        ccui.helper.seekWidgetByName(this.panel_detail_club,"jushu").setString(data.jushu);
        if(data.room_id){
            ccui.helper.seekWidgetByName(this.panel_detail_club,"label_room_id").setString("房间号:" + data.room_id);
        }else{
            ccui.helper.seekWidgetByName(this.panel_detail_club,"label_room_id").setString(data.time_day);
        }
        ccui.helper.seekWidgetByName(this.panel_detail_club,"time_sec").setString(data.time_sec);
        ccui.helper.seekWidgetByName(this.panel_detail_club,"label_detail_info").setString(data.infoStr || "");

        var btn_config = ccui.helper.seekWidgetByName(this.panel_detail_club,"btn_table_config");
        btn_config.wanfaStr = data.wanfaStr;
        btn_config.creditMsg = data.creditMsg;
        UITools.addClickEvent(btn_config,this,this.onClickConfigBtn);

        var btn_zsxq = ccui.helper.seekWidgetByName(this.panel_detail_club,"btn_zsxq");
        btn_zsxq.setVisible(ClickClubModel.isClubCreaterOrLeader());
        UITools.addClickEvent(btn_zsxq,this,this.onClickZsxqBtn);

        if(tableNo){
            btn_zsxq.tableNo = tableNo;
        }else{
            btn_zsxq.tableNo = null;
            btn_zsxq.setVisible(false);
        }

        var label_total = ccui.helper.seekWidgetByName(this.panel_detail_club,"label_total");
        label_total.setVisible(!data.infoStr);

        for(var i = 1;i<=4;++i){
            var nameLabel = ccui.helper.seekWidgetByName(this.panel_detail_club,"playerName" + i);
            if(i<=data.players.length){
                nameLabel.setString(data.players[i-1]);
            }else{
                nameLabel.setString("");
            }
        }

        this.listview_info.removeAllItems();

        var totalScores = [0,0,0,0];

        for(var i = 0;i<data.scoreItems.length;++i){
            var newItem = this.detailItemClub.clone();
            newItem.setVisible(true);
            newItem.getChildByName("index_label").setString(i+1);
            newItem.getChildByName("time_label").setString(data.scoreItems[i].time);
            var btn_fx = ccui.helper.seekWidgetByName(newItem,"btn_fenxiang");
            var btn_lx = ccui.helper.seekWidgetByName(newItem,"btn_luxiang");
            UITools.addClickEvent(btn_fx, this , this.onClickItemFx);
            UITools.addClickEvent(btn_lx, this , this.onClickItemLx);
            if(data.scoreItems[i].tempData.playType == GameTypeEunmPK.WZQ){
                btn_lx.visible = false
            }
            btn_fx.code = data.scoreItems[i].tempData.id;
            btn_lx.tempData = data.scoreItems[i].tempData;
            for(var j = 1;j<=4;++j){
                var numStr = (j<=data.players.length)?data.scoreItems[i].scores[j-1]:"";
                if(numStr != "" && data.scoreItems[i].tempData.playType == GameTypeEunmPK.WZQ){
                    numStr = parseInt(numStr)/100
                }
                this.setLabelScore(newItem.getChildByName("score_" + j), numStr);
                totalScores[j-1] += (data.scoreItems[i].scores[j-1] || 0);
            }
            this.listview_info.pushBackCustomItem(newItem);
        }

        for(var i = 1;i<=4;++i){
            if(i<=data.players.length){
                this.setLabelScore(label_total.getChildByName("score" + i),totalScores[i-1]);
            }else{
                label_total.getChildByName("score" + i).setString("");
            }
        }

    },

    onClickConfigBtn:function(sender){
        var configArr = [];
        configArr.push(sender.wanfaStr);
        // cc.log("onClickConfigBtn =============>");
        if(sender.creditMsg){
            configArr.push(sender.creditMsg);
        }

        var pop = new ShowClubConfigPop(configArr);
        PopupManager.addPopup(pop);
    },

    onClickZsxqBtn:function(sender){
        var pop = new ShowGiveDetailPop(sender.tableNo);
        PopupManager.addPopup(pop);
    },

    onClickItemFx:function(sender){
        cc.log("=============onClickItemFx==============" + sender.code);
        this.shareHuifangCode(sender.code);
    },

    onClickItemLx:function(sender){
        cc.log("=============onClickItemLx==============" + sender.tempData.playType);
        var hfData = sender.tempData;

        //var callBack = function(){
            PopupManager.hidePopup(PyqRecordPop);
            if(PopupManager.getClassByPopup(PyqHall)){
                PopupManager.hidePopup(PyqHall);
            }
            this.playHuifang(hfData);
        //}.bind(this);

        //sy.scene.updatelayer.getUpdatePath(hfData.playType,callBack);

    },

    setLabelScore:function(label,score){
        var scoreStr = score>0?("+" + score):("" + score);
        label.setString(scoreStr);
        var color = score>0?cc.color(201,44,29):cc.color(44,94,179);
        label.setColor(color);
    },

    onClickPyqXq:function(sender){
        var newTime = new Date().getTime();
        if(this.clickTime && ((newTime - this.clickTime) < 300)){
            return;
        }
        this.clickTime = newTime;

        this.getClubDetailData(sender.tempData);

    },

    shareHuifangCode:function(code){
        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        var content = "战绩回放码:" + code + ",分享玩家:" + PlayerModel.name;
        var tip = "可在游戏内战绩界面输入回放码查看战绩";
        obj.title=content;
        obj.pyq=tip;
        obj.description=tip;
        obj.shareType=1;
        ShareDTPop.show(obj);
    },

    playHuifang:function(hfData){
        // cc.log("==========playHuifang=========" + JSON.stringify(hfData));
        BaseRoomModel.curHfm = hfData.id;
        if(GameTypeManager.isMJ(hfData.playType)){
            MJReplayModel.init(hfData);
            var LayerName = LayerFactory.NEW_MJ_REPLAY;
            if(MJReplayModel.renshu == 3) {
                LayerName = LayerFactory.NEW_MJ_REPLAY_THREE;
            } else if(MJReplayModel.renshu == 2){
                LayerName = LayerFactory.NEW_MJ_REPLAY_TWO;
            }
            LayerManager.showLayer(LayerName);
            var layer = LayerManager.getLayer(LayerName);
            layer.initData();
            return;
        }
        if(hfData.playType == 15 || hfData.playType == 16 || hfData.playType == 11 || hfData.playType == GameTypeEunmPK.ZZPDK){
            PlayBackModel.init(hfData,false);
            PDKRoomModel.renshu = ClosingInfoModel.closingPlayers.length;
            LayerManager.showLayer(LayerFactory.PDK_REPLAY);
            var layer = LayerManager.getLayer(LayerFactory.PDK_REPLAY);
            layer.initData();
        }else if(hfData.playType == 190){
            PlayBackModel.init(hfData);
            LayerManager.showLayer(LayerFactory.QF_REPLAY);
            var layer = LayerManager.getLayer(LayerFactory.QF_REPLAY);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmZP.SYBP
            || hfData.playType == GameTypeEunmZP.SYZP
            || hfData.playType == GameTypeEunmZP.LDFPF
            || hfData.playType == GameTypeEunmZP.LYZP
            || hfData.playType == GameTypeEunmZP.CZZP
            || hfData.playType == GameTypeEunmZP.ZHZ
            || hfData.playType == GameTypeEunmZP.WHZ
            || hfData.playType == GameTypeEunmZP.LDS
            || hfData.playType == GameTypeEunmZP.YZCHZ
            || hfData.playType == GameTypeEunmZP.HYLHQ
            || hfData.playType == GameTypeEunmZP.HYSHK
            || hfData.playType == GameTypeEunmZP.XXGHZ
            || hfData.playType == GameTypeEunmZP.XXPHZ
            || hfData.playType == GameTypeEunmZP.XTPHZ
            || hfData.playType == GameTypeEunmZP.AHPHZ
            || hfData.playType == GameTypeEunmZP.GLZP
            || hfData.playType == GameTypeEunmZP.NXPHZ
            || hfData.playType == GameTypeEunmZP.YJGHZ
            || hfData.playType == GameTypeEunmZP.ZZPH
            || hfData.playType == GameTypeEunmZP.LSZP
            || hfData.playType == GameTypeEunmZP.HSPHZ
            || hfData.playType == GameTypeEunmZP.SMPHZ
            || hfData.playType == GameTypeEunmZP.XXEQS
            || hfData.playType == GameTypeEunmZP.NXGHZ
            || hfData.playType == GameTypeEunmZP.CDPHZ
            || hfData.playType == GameTypeEunmZP.AXWMQ
            || hfData.playType == GameTypeEunmZP.HHHGW
            || hfData.playType == GameTypeEunmZP.YYWHZ
            || hfData.playType == GameTypeEunmZP.YZLC
            || hfData.playType == GameTypeEunmZP.WCPHZ
            || hfData.playType == GameTypeEunmZP.JHSWZ
            || hfData.playType == GameTypeEunmZP.DYBP){
            PHZRePlayModel.init(hfData);
            var layerName = LayerFactory.PHZ_REPLAY;
            if (PHZRePlayModel.players.length > 3){
                layerName = LayerFactory.PHZ_REPLAY_MORE;
            }else if (PHZRePlayModel.players.length == 2){
                layerName = LayerFactory.PHZ_REPLAY_LESS;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmZP.XPPHZ){
            PHZRePlayModel.init(hfData);
            var layerName = LayerFactory.XPPHZ_REPLAY;
            if (PHZRePlayModel.players.length == 2){
                layerName = LayerFactory.XPPHZ_REPLAY_LESS;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmZP.HBGZP){
            HBGZPRePlayModel.init(hfData);
            var layerName = LayerFactory.HBGZP_REPLAY;
            if (HBGZPRePlayModel.players.length > 3){
                layerName = LayerFactory.HBGZP_REPLAY_MORE;
            }else if (HBGZPRePlayModel.players.length == 2){
                layerName = LayerFactory.HBGZP_REPLAY_LESS;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmZP.XPLP){
            XPLPReplayModel.init(hfData);
            var layerName = LayerFactory.XPLP_REPLAY;
            if (XPLPReplayModel.players.length > 3){
                layerName = LayerFactory.XPLP_REPLAY_MORE;
            }else if (XPLPReplayModel.players.length == 2){
                layerName = LayerFactory.XPLP_REPLAY_LESS;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.BSMJ || hfData.playType == GameTypeEunmMJ.DHMJ){
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.BSMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.BSMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.BSMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.YZWDMJ){
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.YZWDMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.YZWDMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.YZWDMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.HZMJ || hfData.playType == GameTypeEunmMJ.DZMJ 
            || hfData.playType == GameTypeEunmMJ.ZJMJ || hfData.playType == GameTypeEunmMJ.ZOUMJ){
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.HZMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.HZMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.HZMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.CQXZMJ){
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.CQXZMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.CQXZMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.CQXZMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType==GameTypeEunmMJ.AHMJ || hfData.playType==GameTypeEunmMJ.CXMJ || hfData.playType==GameTypeEunmMJ.KWMJ
            || hfData.playType==GameTypeEunmMJ.TCPFMJ || hfData.playType==GameTypeEunmMJ.TCDPMJ || hfData.playType == GameTypeEunmMJ.YYNXMJ) {
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.AHMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.AHMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.AHMJ_REPLAY_THREE;
            }
            // cc.log("MJReplayModel.players.length===",MJReplayModel.players.length)
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.YJMJ){
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.YJMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.YJMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.YJMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.CSMJ || hfData.playType == GameTypeEunmMJ.TDH || hfData.playType == GameTypeEunmMJ.TJMJ
            || hfData.playType == GameTypeEunmMJ.GDCSMJ || hfData.playType == GameTypeEunmMJ.TCMJ || hfData.playType == GameTypeEunmMJ.NXMJ
            || hfData.playType == GameTypeEunmMJ.NYMJ|| hfData.playType == GameTypeEunmMJ.YYMJ || hfData.playType == GameTypeEunmMJ.JZMJ){
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.CSMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.CSMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.CSMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.ZZMJ){
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.ZZMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.ZZMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.ZZMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if (ClubRecallDetailModel.isDTZWanfa(hfData.playType)){
            PlayBackModel.init(hfData);
            var layerName = LayerFactory.DTZ_REPLAY_THREE;
            if(PlayBackModel.players.length == 4){
                layerName = LayerFactory.DTZ_REPLAY;
            }
            //DTZRoomModel.wanfa = hfData.playType;
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(hfData.playType == GameTypeEunmMJ.SYMJ){/** 添加邵阳麻将回放 **/
            MJReplayModel.init(hfData);
            var layerName = LayerFactory.SYMJ_REPLAY;
            if (MJReplayModel.players.length == 2){
                layerName = LayerFactory.SYMJ_REPLAY_TWO;
            }else if (MJReplayModel.players.length == 3){
                layerName = LayerFactory.SYMJ_REPLAY_THREE;
            }
            LayerManager.showLayer(layerName);
            var layer = LayerManager.getLayer(layerName);
            layer.initData();
        }else if(ClubRecallDetailModel.isSDHWanfa(hfData.playType)){
            SDHReplayMgr.runReplay(hfData);
        }else if(hfData.playType == GameTypeEunmPK.DT){
            DTReplayMgr.runReplay(hfData);
        }else if(hfData.playType == GameTypeEunmPK.NSB){
            NSBReplayMgr.runReplay(hfData);
        }else if(hfData.playType == GameTypeEunmPK.YYBS){
            YYBSReplayMgr.runReplay(hfData);
        }else if(hfData.playType == GameTypeEunmPK.TCGD){
            TCGDReplayMgr.runReplay(hfData);
        }else if(hfData.playType == GameTypeEunmPK.HSTH){
            HSTHReplayMgr.runReplay(hfData);
        }else if(hfData.playType == GameTypeEunmPK.ERDDZ){
            ERDDZReplayMgr.runReplay(hfData);
        }else if(hfData.playType == GameTypeEunmPK.CDTLJ){
            CDTLJReplayMgr.runReplay(hfData);
        }
    },
});

var ShowClubConfigPop = cc.Layer.extend({
    configArr:null,
    ctor:function(configArr){
        this._super();

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }.bind(this),
            onTouchEnded:function(touch,event){
                if(!cc.rectContainsPoint(this.layerBg.getBoundingBox(),touch.getLocation())){
                    PopupManager.remove(this);
                }
            }.bind(this)
        }), this);

        this.configArr = configArr || [];

        this.showConfig();

    },

    showConfig:function(){
        this.layerBg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/di1.png");
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.layerBg.setContentSize(cc.size(900,450));
        this.addChild(this.layerBg);

        var labelsArr = [];

        var labelsH = 30;
        for(var i = 0;i<this.configArr.length;++i){
            var label = new ccui.Text(this.configArr[i],"res/font/bjdmj/fznt.ttf",40);
            label.setTextAreaSize(cc.size(800,0));
            label.setColor(cc.color(110,25,22));
            label.setAnchorPoint(0.5,0);
            this.layerBg.addChild(label);

            labelsH += (label.height + 30);

            labelsArr.push(label);
        }

        if(labelsH > this.layerBg.height){
            this.layerBg.setContentSize(this.layerBg.width,labelsH);
        }

        var offsetH = 0;
        for(var i = 0;i<labelsArr.length;++i){
            offsetH += (labelsArr[i].height + 20);
            labelsArr[i].setPosition(this.layerBg.width/2,this.layerBg.height - offsetH);
        }

    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});

var ShowGiveDetailPop = cc.Layer.extend({
    ctor:function(tableNo){
        this._super();

        this.tableNo = tableNo;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            },
        }), this);

        this.initLayer();

        this.getZsxqData(this.tableNo);
    },

    initLayer:function(){
        var bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/dadi.png");
        bg.setContentSize(960,675);
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        this.layerBg = bg;

        var btn_close = new ccui.Button("res/ui/bjdmj/popup/x.png");
        btn_close.setPosition(bg.width - 23,bg.height - 23);
        bg.addChild(btn_close);
        UITools.addClickEvent(btn_close,this,this.onClickCloseBtn);

        var txtArr = ["赠送人","获赠人","赠送分"];

        for(var i = 0;i<txtArr.length;++i){
            var label = UICtor.cLabel(txtArr[i],40);
            label.setColor(cc.color.BLACK);
            label.setPosition(120 + i*360,bg.height - 70);
            bg.addChild(label);
        }

        this.itemScorll = new ccui.ScrollView();
        this.itemScorll.setContentSize(bg.width,bg.height - 130);
        this.itemScorll.setPosition(0,10);
        bg.addChild(this.itemScorll);



    },

    showUserItem:function(data){
        var itemH = 130;
        var contentH = Math.max(data.length * itemH,this.itemScorll.height);
        this.itemScorll.setInnerContainerSize(cc.size(this.itemScorll.width,contentH));
        for(var i = 0;i<data.length;++i){
            var item = new GiveDetailItem();
            item.setItemWithData(data[i]);
            item.setPosition(this.itemScorll.width/2,contentH - (i+0.5)*itemH);
            this.itemScorll.addChild(item);
        }
    },

    onClickCloseBtn:function(){
        PopupManager.remove(this);
    },

    getZsxqData:function(tableNo){
        var self = this;
        NetworkJT.loginReq("groupActionNew", "loadCommissionDetailForTable", {groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId ,groupTableId:tableNo,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                self.showUserItem(data.message.dataList);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});

var GiveDetailItem = cc.Node.extend({
    ctor:function(){
        this._super();

        this.initNode();
    },

    initNode:function(){
        var bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/tiao.png");
        bg.setContentSize(900,120);
        bg.setPosition(this.width/2,this.height/2);
        this.addChild(bg);

        var img_head1 = new cc.Sprite("res/ui/bjdmj/popup/pyq/renwutouxiang1.png");
        img_head1.setPosition(75,bg.height/2);
        bg.addChild(img_head1);

        var label_name1 = UICtor.cLabel("玩家的名字",36);
        label_name1.setTextAreaSize(cc.size(210,40));
        label_name1.setColor(cc.color(101,11,12));
        label_name1.setAnchorPoint(0,0.5);
        label_name1.setPosition(img_head1.x + 60,bg.height/2 + 23);
        bg.addChild(label_name1);

        var label_id1 = UICtor.cLabel("ID:1234567",36);
        label_id1.setColor(cc.color(101,11,12));
        label_id1.setAnchorPoint(0,0.5);
        label_id1.setPosition(label_name1.x,bg.height/2 - 23);
        bg.addChild(label_id1);


        var img_head2 = new cc.Sprite("res/ui/bjdmj/popup/pyq/renwutouxiang1.png");
        img_head2.setPosition(bg.width/2 - 15,bg.height/2);
        bg.addChild(img_head2);

        var label_name2 = UICtor.cLabel("玩家的名字",36);
        label_name2.setTextAreaSize(cc.size(210,40));
        label_name2.setColor(cc.color(101,11,12));
        label_name2.setAnchorPoint(0,0.5);
        label_name2.setPosition(img_head2.x + 60,bg.height/2 + 23);
        bg.addChild(label_name2);

        var label_id2 = UICtor.cLabel("ID:1234567",36);
        label_id2.setColor(cc.color(101,11,12));
        label_id2.setAnchorPoint(0,0.5);
        label_id2.setPosition(label_name2.x,bg.height/2 - 23);
        bg.addChild(label_id2);

        var label_score = UICtor.cLabel("1234567",36);
        label_score.setPosition(bg.width - 90,bg.height/2);
        label_score.setColor(cc.color(101,11,12));
        bg.addChild(label_score);

        this.img_head1 = img_head1;
        this.img_head2 = img_head2;

        this.label_name1 = label_name1;
        this.label_name2 = label_name2;

        this.label_id1 = label_id1;
        this.label_id2 = label_id2;

        this.lable_score = label_score;
    },

    setItemWithData:function(data){
        this.label_name1.setString(data.userName1);
        this.label_id1.setString("ID:" + data.userId1);

        this.label_name2.setString(data.userName2);
        this.label_id2.setString("ID:" + data.userId2);

        this.showIcon(this.img_head1,data.headimgurl1);
        this.showIcon(this.img_head2,data.headimgurl2);

        var credit = MathUtil.toDecimal((data.credit || 0)/100);
        this.lable_score.setString(credit);
    },

    showIcon: function (spr,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";
        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(100/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
            spr.setScale(100/spr.width);
        }
    },
});


