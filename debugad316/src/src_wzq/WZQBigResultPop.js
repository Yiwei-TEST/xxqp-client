/**
 * Created by zhoufan on 2016/6/30.
 */
var WZQBigResultPop = PKBigResultPop.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        this._super("res/wzqBigResult.json");
    },

    refreshSingle:function(widget,user){
        this.user=user;
        var namestr = UITools.truncateLabel(user.name,5);
        ccui.helper.seekWidgetByName(widget,"n").setString(namestr);
        ccui.helper.seekWidgetByName(widget,"u").setString(""+user.userId);

        var pointTotal = ccui.helper.seekWidgetByName(widget,"pointTotal");
        var Image_sign = ccui.helper.seekWidgetByName(widget,"Image_sign");
        var imgStr = ClosingInfoModel.ext[8] == 1 ? "sai.png":"qi.png"
        cc.log("user.ext[8]",ClosingInfoModel.ext[8])
        Image_sign.loadTexture("res/res_wzq/"+imgStr)

        var fnt = "res/font/dn_bigResult_font_1.fnt";
        if(parseInt(user.totalPoint)<0)
            fnt = "res/font/dn_bigResult_font_2.fnt";
        var winlose = ccui.helper.seekWidgetByName(widget,"winlose");
        var count = user.winCount >= 0 ?  "+"+user.winCount : "-"+user.lostCount
        var label = new cc.LabelBMFont(count,fnt);
        label.x = winlose.width/2;
        label.y = winlose.height/2-20;
        label.setScale(1.5);
        winlose.addChild(label);
        var totalPoint = user.totalPoint > 0 ? ("+"+parseInt(user.totalPoint)/100) : parseInt(user.totalPoint)/100
        label = new cc.LabelBMFont(totalPoint+"",fnt);
        label.x = pointTotal.width/2;
        label.y = pointTotal.height/2+10;
        label.setScale(1.5);
        pointTotal.addChild(label);
        //ccui.helper.seekWidgetByName(widget,"dyj").visible = (user.dyj==1);
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/ui/common/default_m.png" ;
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 63;
        sprite.y = 63
        sprite.setScale(0.95);

        icon.addChild(sprite,5,345);
        // user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.y = 63;
                    sprite.x = 63;
                    //sprite.scale=0.8;
                }
            });
        }


        var sexIcon = ccui.helper.seekWidgetByName(widget,"sex");
        if(user.sex == 1){
            sexIcon.loadTexture("res/res_pdk/pdkBigResult/pdkHome_14.png")
        }else{
            sexIcon.loadTexture("res/res_pdk/pdkBigResult/pdkHome_15.png")
        }

        if(user.userId == ClosingInfoModel.ext[1]){
            var fangzhu = new cc.Sprite("res/res_pdk/pdkSmallResult/fangzhu.png");
            fangzhu.anchorX=fangzhu.anchorY=0;
            fangzhu.x = -19;fangzhu.y=21;
            icon.addChild(fangzhu,10);
        }

        //增加最高分和最低分的显示
        var MaxOrMin = ccui.helper.seekWidgetByName(widget,"MaxOrMin");
        cc.log("user.totalPoin ， this.maxPoint , this.minPoint" , user.totalPoint , this.maxPoint , this.minPoint);
        if(user.totalPoint == this.maxPoint){ // && this.maxPoint != 0
            MaxOrMin.visible = true;
            MaxOrMin.loadTexture("res/res_pdk/pdkBigResult/pdkBigResult_2.png");
        }else if(user.totalPoint == this.minPoint){
            MaxOrMin.visible = true;
            MaxOrMin.loadTexture("res/res_pdk/pdkBigResult/pdkBigResult_1.png");
        }

    },

    selfRender: function () {

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        var max = 0;
        var min = 65535;
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            if(d.totalPoint >= max)
                max = d.totalPoint;
            if(d.totalPoint <= min)
                min = d.totalPoint;
        }
        this.maxPoint = max;
        this.minPoint = min;
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            d.dyj = 0;
            if(d.totalPoint == max)
                d.dyj = 1;
            this.refreshSingle(this.getWidget("player"+(i+1)),this.data[i]);

        }

        var Button_20 = this.getWidget("btnfx");
        UITools.addClickEvent(Button_20,this,this.onShare);
        var Button_21 = this.getWidget("btnok");
        UITools.addClickEvent(Button_21,this,this.onToHome);


        var btn_start_another = this.getWidget("btn_start_another");
        btn_start_another.visible = false;
        UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);

        //显示部分房间信息

         var tableDesc = ClosingInfoModel.ext[1];
        var timeDesc = ClosingInfoModel.ext[3];
        this.getWidget("Label_wanfa").setString("五子棋  2人");
        this.getWidget("Label_version").setString(SyVersion.v);


        var elements = [];
        elements.push(RichLabelVo.createTextVo("房号:",cc.color("7D2E00"),36));
        elements.push(RichLabelVo.createTextVo(tableDesc+"  ",cc.color("ff6f18"),36));
        elements.push(RichLabelVo.createTextVo("时间:",cc.color("7D2E00"),36));
        elements.push(RichLabelVo.createTextVo(timeDesc+"  ",cc.color("ff6f18"),36));
        var richLabel = new RichLabel(cc.size(1558,0),3);
        richLabel.setLabelString(elements);
        richLabel.x = richLabel.y =10;
        this.getWidget("Panel_22").addChild(richLabel);


        //显示俱乐部ID
        var clubIdLabel = this.getWidget("Label_clubId");
        clubIdLabel.setString("");
        var clubId = ClosingInfoModel.ext[12] || 0;
        if (clubId){
            clubIdLabel.setString("亲友圈ID:"+clubId);
        }

        //}

        //this.getWidget("Label_score").setString("");

        var wfStr = "";

        this.getWidget("Label_wanfa2").setString(""+wfStr);
        var Button_fxCard = this.getWidget("Button_fxCard");
        Button_fxCard.visible = false;
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        if( WZQRoomModel.tableType == 1&&ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = false;
            Button_fxCard.scaleX= 0.9;
            Button_21.scaleX= 0.9;
            Button_20.scaleX= 0.9;
        }else{
            //Button_21.x= 386+640;
            //Button_20.x= 0+640;
        }
    },
    onShareCard:function() {
        this.shareCard(WZQRoomModel, this.data, ClosingInfoModel.groupLogId);
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

        var obj={};
        obj.tableId=WZQRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userName='+encodeURIComponent(PlayerModel.name);
        obj.title="跑得快   房号:"+WZQRoomModel.tableId;
        obj.description="我已开好房间,纯技术实力的对决,一起跑得快！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    },

    getModel:function(){
        return WZQRoomModel;
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = WZQRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[12];
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
