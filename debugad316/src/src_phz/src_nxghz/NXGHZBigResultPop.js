/**
 * Created by zhoufan on 2016/12/2.
 */
var NXGHZBigResultPop = BasePopup.extend({
    user:null,
    isDaiKai:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        var json = "res/phzBigResult.json";
        this.json = json;
        this._super(json);
    },

    refreshSingle:function(widget,user){
        this.user=user;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        var idPanel = ccui.helper.seekWidgetByName(widget,"id");
        if (idPanel)
            idPanel.setString("ID："+user.userId);


        var label1 = ccui.helper.seekWidgetByName(widget, "Label_47_0_1");
        var label2 = ccui.helper.seekWidgetByName(widget, "Label_47_0_2");
        var label3 = ccui.helper.seekWidgetByName(widget, "Label_47_0_3");
        var label4 = ccui.helper.seekWidgetByName(widget, "Label_47_0_4");

        var num1 = ccui.helper.seekWidgetByName(widget, "l2");
        var num2 = ccui.helper.seekWidgetByName(widget, "l3");
        var num3 = ccui.helper.seekWidgetByName(widget, "l4");
        var num4 = ccui.helper.seekWidgetByName(widget, "l5");

        //label1.visible = label2.visible = label3.visible = label4.visible = false;
        //num1.visible = num2.visible = num3.visible = num4.visible = false;

        //var dahuName = ["项项息","无息平报听","对子胡","黑胡","黑对子胡","一点朱","十三火","十四火","十五火","九对半",
        //    "大字胡","小字胡","海底","天胡","报听","内圆","外圆","吊吊手"];

        //var typeData = [];

        var dahuNum = 0;

        var countsArr = user.dahuCounts || [];
        for(var i = 0;i<countsArr.length;++i){
            if(countsArr[i] > 0){
                dahuNum += countsArr[i];
            }
        }

        if(PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ){
            label3.visible = label4.visible = false
            num3.visible = num4.visible = false
            label2.setString("大胡次数")
            num1.setString(user.winCount || 0)
            num2.setString(dahuNum || 0)
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            label4.visible = false
            num4.visible = false
            label2.setString("最高胡息")
            label3.setString("最高积分")
            num1.setString(user.winCount || 0)
            num2.setString(user.maxPoint || 0)
            num3.setString(user.zhuaHao || 0)
        }

        //var parent = label1.getParent();

        //var list = new ccui.ListView();
        //list.setContentSize(300,220);
        //list.setTouchEnabled(true);
        //list.setPosition(0,110);
        //parent.addChild(list,1);

        //for(var i = 0;i<typeData.length;++i){
        //    var item = new ccui.Widget();
        //    item.setContentSize(200,40);
        //
        //    var label_name = new cc.LabelTTF(typeData[i].name,"res/font/bjdmj/fznt.ttf",40);
        //    label_name.setColor(cc.color(108,70,34));
        //    label_name.setPosition(110,item.height/2);
        //    item.addChild(label_name);
        //
        //    var label_num = new cc.LabelTTF(String(typeData[i].num),"res/font/bjdmj/fznt.ttf",40);
        //    label_num.setColor(cc.color(127,78,2));
        //    label_num.setPosition(230,item.height/2);
        //    item.addChild(label_num);
        //
        //    list.pushBackCustomItem(item);
        //}

        var label_difen = ccui.helper.seekWidgetByName(widget,"Label_difen");
        var img_credit = ccui.helper.seekWidgetByName(widget,"Image_credit");
        label_difen.setString("");
        img_credit.setVisible(false);
        if (PHZRoomModel.isCreditRoom()){
            var credit = user.winLoseCredit || 0;
            credit = MathUtil.toDecimal(credit/100)
            img_credit.visible = true;

            var fnt = "res/res_phz/phzBigResult/phz_jsj_font.fnt";
            if(parseInt(credit)<0){
                fnt = "res/res_phz/phzBigResult/phz_js_font.fnt";
            }
            var label = new cc.LabelBMFont(credit,fnt);
            label.x = label_difen.width/2;
            label.y = label_difen.height/2;
            label_difen.addChild(label);
            label.setString(credit+"")
        }else if(PHZRoomModel.isClubGoldRoom()){
            img_credit.visible = true;
            img_credit.loadTexture("res/res_gold/goldPyqHall/img_13.png");

            var num = user.winLoseCredit;

            var fnt = "res/res_phz/phzBigResult/phz_jsj_font.fnt";
            if(num < 0){
                fnt = "res/res_phz/phzBigResult/phz_js_font.fnt";
            }
            if(num > 0)num = "+" + num;

            var label = new cc.LabelBMFont("" + num,fnt);
            label.setAnchorPoint(0,0.5);
            label.x = 70;
            label.y = label_difen.height/2;
            label_difen.addChild(label);

        }

        var totalPoint = user.totalPoint || 0;

        ccui.helper.seekWidgetByName(widget,"l1").visible = false;
        ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;

        var pointTotal = ccui.helper.seekWidgetByName(widget,"p5");
        var fnt = "res/res_phz/phzBigResult/phz_jsj_font.fnt";
        if(parseInt(totalPoint)<0){
        	fnt = "res/res_phz/phzBigResult/phz_js_font.fnt";
        }

        var label = new cc.LabelBMFont(totalPoint,fnt);
        label.x = pointTotal.width*0.45;
        label.y = pointTotal.height*0.48;
        pointTotal.addChild(label);
        label.setString(totalPoint+"")

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_phz/default_m.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.9;
        sprite.x = 55;
        sprite.y = 55;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 70, height: 70}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    //sprite.scale = 1.05;
                    //sprite.x = 42;
                    //sprite.y = 38;
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

        var players = this.data.closingPlayers || [];

        var max = 0;
        var omax = 0;
        var min = 65535;
        for(var i=0;i<players.length;i++){
            var d = players[i];
            if(d.winCount >= max)
                max = d.winCount;

            if (d.totalPoint >= omax) {
                omax = d.totalPoint;
            }
            if (d.totalPoint <= min) {
                min = d.totalPoint;
            }
        }

        // cc.log("phz计算出的结算最大分和最小分..." , min , omax);
        for(var i=0;i<players.length;i++){
            var d = players[i];
            d.dyj = 0;
            d.zdyj = 0;

            if (d.totalPoint == omax && omax > 0)
                d.zdyj = 1;
            if (d.totalPoint == min)
                d.isMin = 1;

            this.refreshSingle(this.getWidget("user"+(i+1)),players[i]);
        }
        var startX = 1200 - this.getWidget("user1").width/2;
        if(players.length == 3){
            this.getWidget("user4").visible = false;
            this.getWidget("user1").x = startX - 700;
            this.getWidget("user2").x = startX ;
            this.getWidget("user3").x = startX + 700;
        }else if(players.length == 2){
            this.getWidget("user3").visible = false;
            this.getWidget("user4").visible = false;
            this.getWidget("user1").x = startX - 450;
            this.getWidget("user2").x = startX + 450;
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
        var resultMsg = null;
        if (resultMsg){
            this.resultMsg = JSON.parse(resultMsg);
            if (this.resultMsg.dissState){
                Button_dissolution.visible = true;
            }
            cc.log("this.resultMsg"+JSON.stringify(this.resultMsg));
        }
        if (PHZRoomModel.roomName){
            this.getWidget("Label_roomname").setString(PHZRoomModel.roomName);
            this.getWidget("groupid").setString("亲友圈ID:" + ClosingInfoModel.ext[13]);
        }else{
            this.getWidget("Label_roomname").visible = false;
            this.getWidget("groupid").visible = false;
            btn_start_another.setVisible(false);
        }



        if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            this.getWidget("ext2").setString("益阳歪胡子");
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ){
            this.getWidget("ext2").setString("南县鬼胡子");
        }
        this.getWidget("ext3").setString(ClosingInfoModel.ext[2]);
        this.getWidget("ext4").setString("局数:"+ClosingInfoModel.ext[5]);

        this.getWidget("ext5").setString("");
        if (PHZRoomModel.isCreditRoom()){
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = PHZRoomModel.getCreditType();
            var giveWay = PHZRoomModel.getCreditWay();
            var giveNum = PHZRoomModel.getCreditGiveNum();
            if (giveType == 1){
                if(!PHZRoomModel.getCreditPayWay()){
                   giveStr = giveStr + "固定赠送,";
                }
            }else{
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1){
                if(PHZRoomModel.getCreditPayWay()){
                    giveStr = giveStr + "AA赠送,";
                }else{
                    giveStr = giveStr + "大赢家,";
                }
            }else{
                giveStr = giveStr + "所有赢家,";
            }
            if (giveType == 1){
                giveStr = giveStr + giveNum;
            }else{
                giveStr = giveStr + giveNum + "%";
            }

            this.getWidget("ext5").setString("底分:"+PHZRoomModel.getCreditScore() +"," + giveStr);
        }else if(PHZRoomModel.isClubGoldRoom()){
            this.getWidget("ext5").setString(PHZRoomModel.getClubGlodCfg());
        }else{
            var strLabel = this.getWidget("ext5");
            strLabel.setAnchorPoint(0,1);
            strLabel.setPosition(strLabel.x - 90,strLabel.y + 90);
            strLabel.ignoreContentAdaptWithSize(false);
            strLabel.setSize(480, 200);
            strLabel.setString("玩法:"+PHZRoomModel.getWanFaDesc());
        }

        this.getWidget("ext1").setString("房间号:"+ClosingInfoModel.ext[0]);
        this.getWidget("version").setString(SyVersion.v);
        var Button_fxCard = this.getWidget("Button_fxCard");
        Button_fxCard.visible = false;
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        if( PHZRoomModel.tableType == 1&&ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = false;
            Button_fxCard.scaleX= 0.9;
            Button_21.scaleX= 0.9;
            Button_20.scaleX= 0.9;
            Button_49.scaleX= 0.9;

        }else{

        }

        if(PHZRoomModel.getIsSwitchCoin()){
            var btn_coin_result = this.getWidget("btn_coin_result")
            btn_coin_result.visible = true;
            UITools.addClickEvent(btn_coin_result,this,this.clubCoinResult);
        }else{
            this.getWidget("btn_coin_result").visible = false;
        }
    },

    clubCoinResult:function(){
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return
        }

        for(var i = 0;i < this.data.closingPlayers.length;i++){
            for(var j = 0;j < ClosingInfoModel.clubResultCoinData.length;j++){
                if(ClosingInfoModel.clubResultCoinData[j].userId == this.data.closingPlayers[i].userId){
                    ClosingInfoModel.clubResultCoinData[j].name = this.data.closingPlayers[i].name;
                    ClosingInfoModel.clubResultCoinData[j].icon = this.data.closingPlayers[i].icon;
                    break;
                }
            }
        }

        var mc = new ClubCoinResultPop(ClosingInfoModel.clubResultCoinData);
        this.addChild(mc,1000);
    },

    onShareCard:function() {
        this.shareCard(PHZRoomModel, this.data, ClosingInfoModel.groupLogId);
    },
    /**
     * 分享战报
     */
    onShare:function(){
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height,cc.Texture2D.PIXEL_FORMAT_RGBA8888,gl.DEPTH24_STENCIL8_OES);
        if (!texture)
            return;
        texture.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
        var renshu = (this.isDaiKai) ? dkResultModel.data.resList.length : PHZRoomModel.renshu;
        var str = (renshu==3) ? "3人房" : "4人房";
        var obj={};
        var tableId = (this.isDaiKai) ? dkResultModel.data.tableId : PHZRoomModel.tableId;
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
            var isClubRoom =  (PHZRoomModel.tableType ==1);
            if(isClubRoom ){
                PopupManager.removeClassByPopup(PyqHall);
                var mc = new PyqHall();//先不弹出吧
                PopupManager.addPopup(mc);
            }
    	}
    },

    onDissolution:function(){
        var mc = new PHZDissolutionPop(this.resultMsg.dissPlayer,this.data);
        PopupManager.addPopup(mc);
    },


    onCopy:function(){
        var str = "";
        str = str + "房间号:"+PHZRoomModel.tableId + "\n";
        str = str + PHZRoomModel.getName(PHZRoomModel.wanfa) + " 局数:"+ClosingInfoModel.round + "\n";
        for(var i=0;i<this.data.length;i++){
            var totalPoint = 0;
            if (this.bigResultIsBP()){
                totalPoint = this.data[i].bopiPoint;
            }else{
                totalPoint = this.data[i].totalPoint;
            }
            var playerStr = this.data[i].name + " ID:" + this.data[i].userId + " " + totalPoint;
            str = str + playerStr + "\n"
        }
        SdkUtil.sdkPaste(str);
        cc.log("当前复制的字符串为:",str);
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = PHZRoomModel.wanfa;
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

var PHZDissolutionPop = BasePopup.extend({

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
        var defaultimg = (user.sex == 1) ? "res/ui/dtz/images/default_m.png" : "res/ui/dtz/images/default_w.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.95;
        sprite.x = 40;
        sprite.y = 40;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
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
