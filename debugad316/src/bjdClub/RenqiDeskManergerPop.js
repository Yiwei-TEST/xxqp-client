/**
 * Created by leiwenwen on 2018/10/15.
 */

var RenqiDeskManergerPop = BasePopup.extend({
    show_version:true,
    ctor:function(data){
        this.data = data;
        this.pageNo = 1;
        //cc.log("ClubBagManagePop",JSON.stringify(this.data));
        this._super("res/renqiDeskManergerPop.json");
    },

    selfRender:function(){

        var closeBtn = this.getWidget("close_btn");  // 前往大厅
        if(closeBtn){
            UITools.addClickEvent(closeBtn,this,this.onClose);
        }

        var Button_add = this.getWidget("Button_add");  // 前往大厅
        if(Button_add){
            UITools.addClickEvent(Button_add,this,this.onAdd);
        }  
        this.deskItem = this.getWidget("item");
        this.deskItem.visible = false;
        var btn_delete = this.deskItem.getChildByName("btn_delete");
        btn_delete.setVisible(true);
        UITools.addClickEvent(btn_delete, this, this.onDeleteDesk);


        var CheckBox_17 = this.deskItem.getChildByName("CheckBox_17");
        CheckBox_17.setVisible(true);
        UITools.addClickEvent(CheckBox_17, this, this.onCheckBoxShow);
        this.ListView_desk = this.getWidget("ListView_desk");

        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbDataPage.setString("1");

        var btnRankLeft = this.getWidget("btnDataLeft");
        if (btnRankLeft) {
            UITools.addClickEvent(btnRankLeft, this, this.onDetailUpPage);
        }

        var btnRankRight = this.getWidget("btnDataRight");
        if (btnRankRight) {
            UITools.addClickEvent(btnRankRight, this, this.onDetailDownPage);
        }



        this.onShowDeskItem();
    },

    onDetailUpPage: function () {
        var pageNo = this.pageNo - 1;
        if(pageNo > 0){
            this.pageNo = pageNo;
            this.onShowDeskItem();
        }else{
            return;
        }
    },

    onDetailDownPage: function () {
        this.pageNo += 1;
        
        this.onShowDeskItem();

    },

    onCheckBoxShow: function (sender) {
        NetworkJT.loginReq("groupAction", "fakeTableList", {
            opType: 3,
            groupId: ClickClubModel.clickClubId,
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            keyId: sender.keyId,
        }, function (data) {
            if (data) {
                FloatLabelUtil.comText("操作成功");
            }
        }, function (data) {
            // cc.log("data", JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },

    onDeleteDesk: function (sender) {
        var self = this;
        NetworkJT.loginReq("groupAction", "fakeTableList", {
            opType: 2,
            groupId: ClickClubModel.clickClubId,
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode,
            keyId: sender.keyId,
        }, function (data) {
            if (data) {
                FloatLabelUtil.comText("删除玩法成功");
                self.onShowDeskItem();
            }
        }, function (data) {
            // cc.log("data", JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },
    /**
     * 添加玩法
     */
    onAdd: function(obj){
        var clubData = {modeId:0,
            clubId:ClickClubModel.getCurClubId(),
            clubRole:ClickClubModel.getCurClubRole(),
            wanfaList:[],
            isLeaderPay:ClickClubModel.getClubIsOpenLeaderPay(),
            subId:0,
            bagName:""};

        var mc = new MjCreateRoom(clubData,null,true);
        PopupManager.addPopup(mc);
    },

    //显示所有的包厢
    onShowDeskItem : function(){
        var self = this;
        NetworkJT.loginReq("groupAction", "fakeTableList", {
            opType: 1, 
            pageNo: self.pageNo,
            pageSize: 100, 
            groupId: ClickClubModel.clickClubId, 
            userId: PlayerModel.userId,
            sessCode: PlayerModel.sessCode
        }, function (data) {
            if (data) {
                // cc.log("data =",JSON.stringify(data));
                if(data.list.length >0){
                    self.pageNo = data.pageNo;
                    self.lbDataPage.setString(self.pageNo);
                    self.refreshDeskList(data.list);
                }else{
                    self.pageNo = data.pageNo - 1;
                    FloatLabelUtil.comText("没有更多数据了");
                }
               
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshDeskList:function (list) {
        cc.log("list = ", JSON.stringify(list));
        this.ListView_desk.removeAllChildren();
        var self = this;
        var offY = 70;
        var beginPosY = Math.max(offY * list.length, 370);
        for (var index = 0; index < list.length; index++) { //data["message"].length
            // var tPos = cc.p(beginPosX, beginPosY - index * offY);
            var tTeamItem = this.deskItem.clone();
            tTeamItem.visible =true;
            tTeamItem.getChildByName("btn_delete").keyId = list[index].keyId;
            tTeamItem.getChildByName("CheckBox_17").keyId = list[index].keyId;
            self.setData(tTeamItem,list[index]);
            this.ListView_desk.pushBackCustomItem(tTeamItem);
        }
    },
    setData:function(item,data) {
        var Label_gameType = ccui.helper.seekWidgetByName(item, "Label_gameType");
        Label_gameType.setString(ClubRecallDetailModel.getGameStr(data.gameType));
        var Label_tableName = ccui.helper.seekWidgetByName(item, "Label_tableName");
        Label_tableName.setString(data.tableName);
        var Label_jushu = ccui.helper.seekWidgetByName(item, "Label_jushu");
        Label_jushu.setString(data.overCount);

        var CheckBox_17 = ccui.helper.seekWidgetByName(item, "CheckBox_17");
        CheckBox_17.setSelected(!data.hiding);

    },
    onClose : function(){
        PopupManager.remove(this);
    }

})