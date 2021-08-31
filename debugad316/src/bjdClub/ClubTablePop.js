/**
 * Created by cyp on 2019/3/29.
 * 点击俱乐部房间弹出的弹窗
 */

var ClubTablePop = BasePopup.extend({
    tableData:null,
    tableBtn:null,
    ctor:function(tableData,btn,dataType){

        this.tableData = tableData; 
        cc.log("tableData =", JSON.stringify(tableData));
        this.tableBtn = btn;
        this.dataType = dataType;

        this._super("res/clubTablePop.json");
    },

    selfRender:function(){
        var mainPopup = this.getWidget("mainPopup");

        this.btn_yq = this.getWidget("btn_yq");
        this.btn_jiesan = this.getWidget("btn_jiesan");

        UITools.addClickEvent(this.btn_yq,this,this.onClickInvite);
        UITools.addClickEvent(this.btn_jiesan,this,this.onClickJiesan);

        if(!ClickClubModel.isClubCreaterOrLeader()){
            this.btn_jiesan.setVisible(false);
            this.btn_yq.setPositionX(this.btn_yq.getParent().width/2);
        }
        this.btn_yq.setVisible(false);
        this.btn_jiesan.setPositionX(this.btn_jiesan.getParent().width/2);

        var pos = this.tableBtn.convertToWorldSpace(cc.p(0,0));
        pos.x = Math.min(pos.x,1200);
        mainPopup.setPosition(pos);

        if(this.dataType == 1){
            this.setLayerWithBagData();
        }else{
            this.setLayerWithTableData();
        }

    },

    setLayerWithTableData:function(){
        var tableId = this.getWidget("table_id");
        var name_label = this.getWidget("gameName");
        var label_info = this.getWidget("label_info");
        tableId.setString("房间号:" + this.tableData.tableId);

        if(ClickClubModel.getIsFzbHide()
            && (this.tableData.playType == GameTypeEunmPK.CDTLJ || this.tableData.playType == GameTypeEunmPK.XTSDH)
            && !ClickClubModel.isClubCreater()){
            tableId.setString("房间号:******");
        }

        var gameName = ClubRecallDetailModel.getGameStr(this.tableData.playType);
        name_label.setString(gameName);

        // var wanfaCfg = null;
        
        var wanfaCfg = null;
        if (this.dataType && this.dataType != 1) {
            for (var i = 0; i < this.dataType.length; ++i) {
                if (this.tableData.configId == this.dataType[i].config.keyId) {
                    wanfaCfg = this.dataType[i].config.modeMsg;
                }
            }
        }
        
        

        var wanfaStr = "";
        if(wanfaCfg){
            wanfaStr = ClubRecallDetailModel.getWanfaStr(wanfaCfg);
        }

        if(this.tableData.type == 2){
            wanfaStr += " 比赛房";
        }

        label_info.setString(wanfaStr);
    },

    setLayerWithBagData:function(){
        this.btn_jiesan.setVisible(false);

        var tableId = this.getWidget("table_id");
        var name_label = this.getWidget("gameName");
        var label_info = this.getWidget("label_info");

        tableId.setString("");

        var creditStr = "";
        if (this.tableData.config.creditMsg && this.tableData.config.creditMsg[0]){
            creditStr = " 比赛房";
        }

        //显示游戏和房间
        var createPara = this.tableData.config.modeMsg.split(",");
        var gameStr = ClubRecallDetailModel.getGameName(createPara);
        // cc.log("this.tableData.config.modeMsg =", JSON.stringify(this.tableData.config.modeMsg));
        var wanfaStr = ClubRecallDetailModel.getWanfaStr(this.tableData.config.modeMsg,true);

        name_label.setString(gameStr);
        label_info.setString(wanfaStr + creditStr);
    },

    onClickJiesan:function(){
        var roomId = this.tableData.tableId;
        var keyid = this.tableData.keyId;
        cc.log("roomId"+roomId+"keyid"+keyid);

        var self = this;
        AlertPop.show("确定要解散该房间吗？",function(){
            sySocket.sendComReqMsg(7,[],[roomId+"",keyid+""]);

            self.onCloseHandler();
        });
    },

    onClickInvite:function(){
        FloatLabelUtil.comText("暂未开放");
    },
});
