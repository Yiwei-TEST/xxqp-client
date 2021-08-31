/**
 * Created by Administrator on 2019/12/5.
 */
var HBGZPBigResultPop = BasePopup.extend({
    user:null,
    isDaiKai:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        var json = "res/hbgzpBigResult.json";
        this.json = json;
        this._super(json);
    },

    refreshSingle:function(widget,user){
        this.user=user;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget,"Image_dn").visible = user.dyj === 1;//大赢家(暂时去掉)
        var idPanel = ccui.helper.seekWidgetByName(widget,"uid");
        if (idPanel)
            idPanel.setString("ID："+user.userId);

        ccui.helper.seekWidgetByName(widget,"id").setString("");

        var label1 = ccui.helper.seekWidgetByName(widget,"Label_47_0_1");
        var label2 = ccui.helper.seekWidgetByName(widget,"Label_47_0_2");
        var label3 = ccui.helper.seekWidgetByName(widget,"Label_47_0_3");
        var label4 = ccui.helper.seekWidgetByName(widget,"Label_47_0_4");

        label1.setString("胡牌次数");
        label2.setString("点炮次数");
        label3.setString("自摸次数");
        label4.setString("单局最高胡数");

        var allScore = parseInt(user.strExt[1]) + parseInt(user.strExt[0]);

        //玩家身上 ext 0胡次数 1自摸 2提 3跑
        ccui.helper.seekWidgetByName(widget,"l2").setString(""+allScore);//胡牌次数
        ccui.helper.seekWidgetByName(widget,"l3").setString(""+user.strExt[2]);//点炮次数
        ccui.helper.seekWidgetByName(widget,"l4").setString(""+user.strExt[0]);//自摸次数
        ccui.helper.seekWidgetByName(widget,"l5").setString(""+user.strExt[6]);//单局最高点数

        var label_difen = ccui.helper.seekWidgetByName(widget,"Label_difen");
        var img_credit = ccui.helper.seekWidgetByName(widget,"Image_credit");
        label_difen.setString("");
        img_credit.setVisible(false);
        if (HBGZPRoomModel.isCreditRoom()){
            var credit =user.winLoseCredit;
            credit = MathUtil.toDecimal(credit/100);
            label_difen.setString(""+credit);//比赛分
            img_credit.visible = true;
        }

        if(HBGZPRoomModel.isClubGoldRoom()){
            img_credit.visible = true;
            img_credit.loadTexture("res/res_gold/goldPyqHall/img_13.png");

            var num = user.winLoseCredit;
            if(num > 0)num = "+" + num;
            label_difen.setString("" + num);
        }

        var totalPointStr = "";
        if (user.totalPoint > 0){
            totalPointStr = "+" + user.totalPoint;
        }else{
            totalPointStr = totalPointStr + user.totalPoint;
        }
        var totalPoint = user.totalPoint;
        ccui.helper.seekWidgetByName(widget,"l1").setString("");//总胡息
        ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;//隐藏总胡息

        var pointTotal = ccui.helper.seekWidgetByName(widget,"p5");
        var fnt = "res/res_phz/phzBigResult/phz_jsj_font.fnt";
        if(parseInt(totalPoint)<0){
            fnt = "res/res_phz/phzBigResult/phz_js_font.fnt";
        }

        var label = new cc.LabelBMFont(totalPointStr,fnt);
        label.x = pointTotal.width*0.45 + 60;
        label.y = pointTotal.height*0.48 + 5;
        pointTotal.addChild(label);
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_phz/res_hbgzp/smallResult/default_m.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.9;
        sprite.x = 60;
        sprite.y = 60;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 120, height: 120}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }
        var fzImg = ccui.helper.seekWidgetByName(widget,"Image_fz");//房主图片
        fzImg.visible = false;
        if(!this.isDaiKai){
            if(user.userId==ClosingInfoModel.ext[1]){
                fzImg.visible = true;
            }
        }
    },


    selfRender: function () {
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        var max = 0;
        var omax = 0;
        var min = 65535;
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            if(d.winCount >= max)
                max = d.winCount;

            if(d.totalPoint >= omax){
                omax = d.totalPoint;
            }
            if(d.totalPoint <= min){
                min = d.totalPoint;
            }
        }

        // cc.log("phz计算出的结算最大分和最小分..." , min , omax);
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            d.dyj = 0;
            d.zdyj = 0;

            if(d.totalPoint == omax && omax>0)
                d.zdyj = 1;
            if(d.totalPoint == min)
                d.isMin = 1;

            this.refreshSingle(this.getWidget("user"+(i+1)),d);
        }
        if(this.data.length == 3){
            this.getWidget("user4").visible = false;
            this.getWidget("user1").x = this.getWidget("user1").x + 50;
            this.getWidget("user2").x = this.getWidget("user3").x - 202;
            this.getWidget("user3").x = this.getWidget("user4").x - 50;
        }else if(this.data.length == 2){
            this.getWidget("user3").visible = false;
            this.getWidget("user4").visible = false;
            this.getWidget("user1").x = this.getWidget("user2").x - 150;
            this.getWidget("user2").x = this.getWidget("user3").x + 150;
        }
        var Button_20 = this.getWidget("Button_20");
        UITools.addClickEvent(Button_20,this,this.onShare);
        var Button_21 = this.getWidget("Button_21");
        UITools.addClickEvent(Button_21,this,this.onToHome);

        var Button_49 = this.getWidget("Button_49"); //复制总成绩
        UITools.addClickEvent(Button_49,this,this.onCopy);

        var btn_return_hall = this.getWidget("btn_return_hall");
        UITools.addClickEvent(btn_return_hall,this,this.onToHome);

        var btn_start_another = this.getWidget("btn_start_another");
        UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);


        var Button_dissolution = this.getWidget("Button_dissolution");
        Button_dissolution.visible = false;
        UITools.addClickEvent(Button_dissolution,this,this.onDissolution);

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }
        var resultMsg = ClosingInfoModel.ext[9] || [];
        if (resultMsg){
            this.resultMsg = JSON.parse(resultMsg);
            if (this.resultMsg.dissState){
                Button_dissolution.visible = true;
            }
            cc.log("this.resultMsg"+JSON.stringify(this.resultMsg));
        }
        if (HBGZPRoomModel.roomName){
            this.getWidget("Label_roomname").setString(HBGZPRoomModel.roomName);
            this.getWidget("groupid").setString("亲友圈ID:" + ClosingInfoModel.ext[13]);
        }else{
            this.getWidget("Label_roomname").visible = false;
            this.getWidget("groupid").visible = false;
            btn_start_another.setVisible(false);
        }


        var ext3 = ClosingInfoModel.ext[3];
        var str = "";
        var extStr2 = "湖北个子牌";
        this.getWidget("ext2").setString(extStr2);
        this.getWidget("ext3").setString(ClosingInfoModel.ext[2]);
        this.getWidget("ext4").setString("");
        if (ClosingInfoModel.round){
            this.getWidget("ext4").x -= 15;
            this.getWidget("ext4").setString("局数:"+ClosingInfoModel.round);
        }

        this.getWidget("ext5").setString("");
        if (HBGZPRoomModel.isCreditRoom()) {
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = HBGZPRoomModel.getCreditType();
            var giveWay = HBGZPRoomModel.getCreditWay();
            var giveNum = HBGZPRoomModel.getCreditGiveNum();
            if (giveType == 1) {
                if(!HBGZPRoomModel.getCreditPayWay()){
                   giveStr = giveStr + "固定赠送,";
                }
            } else {
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1) {
                if(HBGZPRoomModel.getCreditPayWay()){
                    giveStr = giveStr + "AA赠送,";
                }else{
                    giveStr = giveStr + "大赢家,";
                }
            } else {
                giveStr = giveStr + "所有赢家,";
            }
            if (giveType == 1) {
                giveStr = giveStr + giveNum;
            } else {
                giveStr = giveStr + giveNum + "%";
            }

            this.getWidget("ext5").setString("底分:" + HBGZPRoomModel.getCreditScore() + "," + giveStr);
        }else if(HBGZPRoomModel.isClubGoldRoom()){
            this.getWidget("ext5").setString(HBGZPRoomModel.getClubGlodCfg());
        }else{
            var strLabel = this.getWidget("ext5");
            //strLabel.setAnchorPoint(0,1);
            //strLabel.setPosition(strLabel.x - 90,strLabel.y + 90);
            //strLabel.ignoreContentAdaptWithSize(false);
            //strLabel.setSize(480, 200);
            strLabel.setString("玩法:"+HBGZPRoomModel.getWanFaDesc());
        }
        str = str + "房间号:"+ClosingInfoModel.ext[0];
        this.getWidget("ext1").setString(str);
        this.getWidget("version").setString(SyVersion.v);
        var Button_fxCard = this.getWidget("Button_fxCard");
        Button_fxCard.visible = false;
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        if(HBGZPRoomModel.tableType == 1&&ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = false;
            Button_fxCard.scaleX= 0.9;
            Button_21.scaleX= 0.9;
            Button_20.scaleX= 0.9;
            Button_49.scaleX= 0.9;

        }

        if(HBGZPRoomModel.getIsSwitchCoin()){
            var btn_coin_result = this.getWidget("btn_coin_result");
            if(btn_coin_result){
                btn_coin_result.visible = true;
                UITools.addClickEvent(btn_coin_result,this,this.clubCoinResult);
            }
        }else{
            if(this.getWidget("btn_coin_result")){
                this.getWidget("btn_coin_result").visible = false;
            }
        }
    },

    clubCoinResult:function(){
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return
        }

        for(var i = 0;i < this.data.length;i++){
            for(var j = 0;j < ClosingInfoModel.clubResultCoinData.length;j++){
                if(ClosingInfoModel.clubResultCoinData[j].userId == this.data[i].userId){
                    ClosingInfoModel.clubResultCoinData[j].name = this.data[i].name;
                    ClosingInfoModel.clubResultCoinData[j].icon = this.data[i].icon;
                    break;
                }
            }
        }

        var mc = new ClubCoinResultPop(ClosingInfoModel.clubResultCoinData);
        this.addChild(mc,1000);
    },

    onShareCard:function() {
        this.shareCard(HBGZPRoomModel, this.data, ClosingInfoModel.groupLogId);
    },
    /**
     * 分享战报
     */
    onShare:function(){
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height);
        if (!texture)
            return;
        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
        var renshu = (this.isDaiKai) ? dkResultModel.data.resList.length : HBGZPRoomModel.renshu;
        var str = (renshu==3) ? "3人房" : "4人房";
        var obj={};
        var tableId = (this.isDaiKai) ? dkResultModel.data.tableId : HBGZPRoomModel.tableId;
        obj.tableId=tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title='跑胡子   '+str+' 房号:'+tableId;
        obj.description="我已开好房间，【跑胡子】二缺一，就等你了！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    },

    onToHome:function(){
        if(this.isDaiKai){
            dkRecordModel.isShowRecord = false;
            PopupManager.remove(this);
        }else{
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();
            var isClubRoom =  (HBGZPRoomModel.tableType ==1);
            if(isClubRoom ){
                PopupManager.removeClassByPopup(PyqHall);
                var mc = new PyqHall();//先不弹出吧
                PopupManager.addPopup(mc);
            }
        }
    },

    onDissolution:function(){
        var mc = new HBGZPDissolutionPop(this.resultMsg.dissPlayer,this.data);
        PopupManager.addPopup(mc);
    },


    onCopy:function(){
        var str = "";
        str = str + "房间号:"+HBGZPRoomModel.tableId + "\n";
        str = str + HBGZPRoomModel.getName(HBGZPRoomModel.wanfa) + " 局数:"+ClosingInfoModel.round + "\n";
        for(var i=0;i<this.data.length;i++){
            var totalPoint = 0;
            totalPoint = this.data[i].totalPoint;
            var playerStr = this.data[i].name + " ID:" + this.data[i].userId + " " + totalPoint;
            str = str + playerStr + "\n"
        }
        SdkUtil.sdkPaste(str);
        cc.log("当前复制的字符串为:",str);
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = HBGZPRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[13];
        var modeId = 0;

        var clubLocalList = UITools.getLocalJsonItem("Club_Local_Data");
        for(var j = 0 ; j < clubLocalList.length; j++){
            if (groupId == clubLocalList[j].clickId){
                modeId = clubLocalList[j].bagModeId;
            }
        }
        cc.log("============qyqStartAnother============",groupId,modeId);
        if(groupId > 0 && modeId > 0){
            this.clickStartAnother = true;
            this.groupId = groupId;
            this.modeId = modeId;
            sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , ["0",modeId+"",groupId+""]);
        }else{
            FloatLabelUtil.comText("未找到对应包厢ID,请返回大厅");
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status == ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        sy.scene.hideLoading();
        if(this.clickStartAnother){
            this.clickStartAnother = false;
            if (PlayerModel.clubTableId == 0){
                sySocket.sendComReqMsg(1, [],[this.groupId+"",1 + "","1",this.modeId+""]);
            }else{
                sySocket.sendComReqMsg(2,[parseInt(PlayerModel.clubTableId),1,1,0,Number(this.groupId)],[this.modeId+""]);
            }
        }
    },

});

var HBGZPDissolutionPop = BasePopup.extend({

    ctor: function (dissPlayer,data) {
        this.dissPlayer = dissPlayer || [];
        this.data = data || [];
        this._super("res/phzDissolutionPop.json");
    },

    selfRender: function () {
        var dissPlayer = this.dissPlayer.split(",");
        var true_btn = this.getWidget("true_btn");
        UITools.addClickEvent(true_btn, this, this.onTrue);

        for(var i=1;i<=4;i++){
            var Image_player = this.getWidget("Image_player"+i);
            Image_player.visible = false;
        }

        if (dissPlayer){
            for(var i = 0;i < dissPlayer.length;i++){
                for(var j = 0;j < this.data.length;j++){
                    if (dissPlayer[i] == this.data[j].userId){
                        this.showPlayerinfo(this.getWidget("Image_player"+(i+1)),this.data[j]);
                    }
                }
            }
        }

    },
    showPlayerinfo:function(widget,user){
        widget.visible = true;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget,"uid").setString("ID:"+user.userId);
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_phz/res_hbgzp/smallResult/default_m.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.95;
        sprite.x = 60;
        sprite.y = 60;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 120, height: 120}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }
    },

    onTrue:function(){
        PopupManager.remove(this);
    }
});
