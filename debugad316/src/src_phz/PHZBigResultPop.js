/**
 * Created by zhoufan on 2016/12/2.
 */
var PHZBigResultPop = BasePopup.extend({
    user:null,
    isDaiKai:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        var json = "res/phzBigResult.json";
        this.json = json;
        this._super(json);
    },

    bigResultIsBP:function(){
        return PHZRoomModel.wanfa == GameTypeEunmZP.SYBP;
    },
    bigResultIsLDFPF:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF;
    },
    bigResultIsCZZP:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.CZZP;
    },
    bigResultIsZHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.ZHZ;
    },
    bigResultIsXTPHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ;
    },
    bigResultIsXXGHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ;
    },
    bigResultIsXXPHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ;
    },
    bigResultIsAHPHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ;
    },
    bigResultIsGLZP:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.GLZP;
    },
    bigResultIsNXPHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ;
    },
    bigResultIsSMPHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ;
    },
    bigResultIsHSPHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ;
    },
    bigResultIsXXEQS:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS;
    },
    bigResultIsWCPHZ:function() {
        return PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ;
    },
    refreshSingle:function(widget,user){
        this.user=user;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        var idPanel = ccui.helper.seekWidgetByName(widget,"id");
        if (idPanel)
            idPanel.setString("ID："+user.userId);

        //玩家身上 ext 0胡次数 1自摸 2提 3跑
        ccui.helper.seekWidgetByName(widget,"l2").setString(""+user.strExt[0]);//胡牌次数
        ccui.helper.seekWidgetByName(widget,"l3").setString(""+user.strExt[1]);//自摸次数
        ccui.helper.seekWidgetByName(widget,"l4").setString(""+user.strExt[2]);//提牌次数
        ccui.helper.seekWidgetByName(widget,"l5").setString(""+user.strExt[3]);//跑牌次数
        if (this.bigResultIsBP() || PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK || PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
            var chuiNumb = user.strExt[10];
            // cc.log("chuiNumb = ",chuiNumb);
            if (chuiNumb!=-1){
                var pngUrl ="res/res_phz/img_chui"+chuiNumb+".png";
                var chuiImg = new cc.Sprite(pngUrl);
                // chuiImg.anchorX = chuiImg.anchorY = 0;
                chuiImg.x = 0;
                chuiImg.y = 15;
                ccui.helper.seekWidgetByName(widget,"Image_k1").addChild(chuiImg,10);
            }
        }
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            var label1 = ccui.helper.seekWidgetByName(widget,"Label_47_0_1");
            var label2 = ccui.helper.seekWidgetByName(widget,"Label_47_0_2");
            var label3 = ccui.helper.seekWidgetByName(widget,"Label_47_0_3");
            var label4 = ccui.helper.seekWidgetByName(widget,"Label_47_0_4");

            var num1 = ccui.helper.seekWidgetByName(widget,"l2");
            var num2 = ccui.helper.seekWidgetByName(widget,"l3");
            var num3 = ccui.helper.seekWidgetByName(widget,"l4");
            var num4 = ccui.helper.seekWidgetByName(widget,"l5");

            num1.setString(user.winCount);
            num2.setString(user.strExt[0]);
            num3.setString(user.strExt[1]);

            label2.setString("名堂次数");
            label3.setString("飘分输赢");

            label1.y -= 10;
            label2.y -= 30;
            label3.y -= 50;

            num1.y = label1.y;
            num2.y = label2.y;
            num3.y = label3.y;

            label4.visible = false;
            num4.visible = false;
        }if(PHZRoomModel.wanfa == GameTypeEunmZP.XPPHZ){
            var label = ccui.helper.seekWidgetByName(widget,"Label_47_0");
            var label1 = ccui.helper.seekWidgetByName(widget,"Label_47_0_1");
            var label2 = ccui.helper.seekWidgetByName(widget,"Label_47_0_2");
            var label3 = ccui.helper.seekWidgetByName(widget,"Label_47_0_3");
            var label4 = ccui.helper.seekWidgetByName(widget,"Label_47_0_4");

            var num = ccui.helper.seekWidgetByName(widget,"l1");
            var num1 = ccui.helper.seekWidgetByName(widget,"l2");
            var num2 = ccui.helper.seekWidgetByName(widget,"l3");
            var num3 = ccui.helper.seekWidgetByName(widget,"l4");
            var num4 = ccui.helper.seekWidgetByName(widget,"l5");

            label1.setString("平胡次数");
            label3.setString("点炮次数");

            label1.y = label.y;
            label2.y += 10;
            label3.y -= 50;

            num1.y = label1.y;
            num2.y = label2.y;
            num3.y = label3.y;

            num1.setString(user.strExt[0]);
            num2.setString(user.strExt[1]);
            num3.setString(user.strExt[2]);
            label.visible = label4.visible = false;
            num4.visible = false;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
            var label3 = ccui.helper.seekWidgetByName(widget,"Label_47_0_3");
            label3.setString("倾牌次数");
            ccui.helper.seekWidgetByName(widget,"l1").setVisible(false);
            ccui.helper.seekWidgetByName(widget,"Label_47_0").setVisible(false);
        }

        if (this.bigResultIsLDFPF()){
            if (PHZRoomModel.intParams[34] == 3  ){
                ccui.helper.seekWidgetByName(widget,"Label_47_0_4").setString("打鸟分数");
                ccui.helper.seekWidgetByName(widget,"l5").setString(""+user.strExt[12]);//跑牌次数
            }
            if (PHZRoomModel.intParams[34] == 2  ){
                ccui.helper.seekWidgetByName(widget,"Label_47_0_4").setString("打鸟分数");
                ccui.helper.seekWidgetByName(widget,"l5").setString(""+PHZRoomModel.intParams[35]);//跑牌次数
            }
            if (PHZRoomModel.intParams[34] != 0){
                ccui.helper.seekWidgetByName(widget, "Label_47_0_4").visible = false;
                ccui.helper.seekWidgetByName(widget, "l5").visible = false;
                if (user.strExt[12] && user.strExt[12] != 0){
                    ccui.helper.seekWidgetByName(widget,"Image_dn").visible=true;
                    ccui.helper.seekWidgetByName(widget, "Label_47_0_4").visible = true;
                    ccui.helper.seekWidgetByName(widget, "l5").visible = true;
                }
            }
        }
        if (this.bigResultIsZHZ()){
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0_4").visible = false;
            ccui.helper.seekWidgetByName(widget,"l5").visible = false;
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0_1").setString("单局最高");
            ccui.helper.seekWidgetByName(widget,"Label_47_0_2").setString("大胡次数");
            ccui.helper.seekWidgetByName(widget,"Label_47_0_3").setString("小胡次数");
        }

        var label_difen = ccui.helper.seekWidgetByName(widget,"Label_difen");
        var img_credit = ccui.helper.seekWidgetByName(widget,"Image_credit");
        label_difen.setString("");
        img_credit.setVisible(false);
        if (PHZRoomModel.isCreditRoom()){

            var credit = user.winLoseCredit;

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
            label.setString(credit + "");
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

        var totalPoint = "";
        var totalHuxi = "";
        var totalPointStr = "";
        if(this.bigResultIsXXGHZ()){/** 湘乡告胡子 **/
            if (PHZRoomModel.intParams[28] != 0){
                var node = ccui.helper.seekWidgetByName(widget,"Image_dn");
                var res = user.strExt[10] == 1 ? "res/res_phz/phzBigResult/dajie_datuo.png" : "res/res_phz/phzBigResult/dajie_budatuo.png";
                node.loadTexture(res);
                node.visible=true;
            }
            totalHuxi = totalHuxi + user.allHuxi;//user.totalPoint;
            if (user.finalPoint > 0) {
                totalPointStr = "+" + user.finalPoint;//user.totalPoint;
            } else {
                totalPointStr = totalPointStr + user.finalPoint;//user.totalPoint;
            }
            totalPoint = user.finalPoint;//user.totalPoint;

        }else if(this.bigResultIsGLZP()){/** 桂林字牌 **/
            totalHuxi = totalHuxi + user.totalPoint;
            if (user.totalPoint > 0) {
                totalPointStr = "+" + user.totalPoint;
            } else {
                totalPointStr = totalPointStr + user.totalPoint;
            }
            totalPoint = user.totalPoint;
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
        }else if(this.bigResultIsXXPHZ()){/** 湘乡跑胡子 **/
            totalHuxi = totalHuxi + user.allHuxi;//user.totalPoint;
            if (user.finalPoint > 0) {
                totalPointStr = "+" + user.finalPoint;//user.totalPoint;
            } else {
                totalPointStr = totalPointStr + user.finalPoint;//user.totalPoint;
            }
            totalPoint = user.finalPoint;//user.totalPoint;
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
        }else if(this.bigResultIsXTPHZ()){/** 湘潭跑胡子 **/
            totalHuxi = totalHuxi + user.allHuxi;//user.totalPoint;
            if (user.finalPoint > 0) {
                totalPointStr = "+" + user.finalPoint;//user.totalPoint;
            } else {
                totalPointStr = totalPointStr + user.finalPoint;//user.totalPoint;
            }
            totalPoint = user.finalPoint;//user.totalPoint;
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
        }else if(this.bigResultIsAHPHZ()){/** 安化跑胡子 **/
            totalHuxi = totalHuxi + user.allHuxi;//user.totalPoint;
            if (user.finalPoint > 0) {
                totalPointStr = "+" + user.finalPoint;//user.totalPoint;
            } else {
                totalPointStr = totalPointStr + user.finalPoint;//user.totalPoint;
            }
            totalPoint = user.finalPoint;//user.totalPoint;
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
        }else if (this.bigResultIsBP() || PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
            totalHuxi = totalHuxi + user.totalPoint;
            if (user.bopiPoint > 0){
                totalPointStr = "+" + user.bopiPoint;
            }else{
                totalPointStr = totalPointStr + user.bopiPoint;
            }
            totalPoint = user.bopiPoint;

            if(PHZRoomModel.isMatchRoom()){
                totalHuxi = user.bopiPoint;
                if (user.totalPoint > 0){
                    totalPointStr = "+" + user.totalPoint;
                }else{
                    totalPointStr = user.totalPoint;
                }
            }

            //ccui.helper.seekWidgetByName(widget,"Image_48").visible = true;
        }else if(this.bigResultIsLDFPF()) {
            totalHuxi = "" + user.allHuxi;
            if (user.totalPoint > 0) {
                totalPointStr = "+" + user.totalPoint;
            } else {
                totalPointStr = totalPointStr + user.totalPoint;
            }
            totalPoint = user.totalPoint;
            //ccui.helper.seekWidgetByName(widget,"Image_48").visible = true;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ || PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
            totalHuxi = "" + user.allHuxi;
            if (user.totalPoint > 0){
                totalPointStr = "+" + user.totalPoint;
            }else{
                totalPointStr = totalPointStr + user.totalPoint;
            }
            totalPoint = user.totalPoint;
        }else if(this.bigResultIsSMPHZ() || PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW || PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){/** 石门跑胡子 **/
            totalHuxi = totalHuxi + user.allHuxi;//user.totalPoint;
            if (user.finalPoint > 0) {
                totalPointStr = "+" + user.finalPoint;//user.totalPoint;
            } else {
                totalPointStr = totalPointStr + user.finalPoint;//user.totalPoint;
            }
            totalPoint = user.finalPoint;//user.totalPoint;
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
        }else if(this.bigResultIsXXEQS()) {
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0_3").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0_4").visible = false;
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"l4").visible = false;
            ccui.helper.seekWidgetByName(widget,"l5").visible = false;
            ccui.helper.seekWidgetByName(widget,"l2").setString(""+user.strExt[0]);
            ccui.helper.seekWidgetByName(widget,"l3").setString(""+user.strExt[1]);
            totalHuxi = "";
            if (user.totalPoint > 0){
                totalPointStr = "+" + user.totalPoint;
            }else{
                totalPointStr = totalPointStr + user.totalPoint;
            }
            totalPoint = user.totalPoint;
        }else if(this.bigResultIsWCPHZ()) {
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
            var label2 = ccui.helper.seekWidgetByName(widget, "Label_47_0_2");
            var label3 = ccui.helper.seekWidgetByName(widget, "Label_47_0_3");
            var label4 = ccui.helper.seekWidgetByName(widget, "Label_47_0_4");

            var num1 = ccui.helper.seekWidgetByName(widget, "l2");
            var num2 = ccui.helper.seekWidgetByName(widget, "l3");
            var num3 = ccui.helper.seekWidgetByName(widget, "l4");
            var num4 = ccui.helper.seekWidgetByName(widget, "l5");
            label4.visible = false
            num4.visible = false
            label2.setString("最高胡息")
            label3.setString("最高积分")
            num1.setString(user.strExt[0] || 0)
            num2.setString(user.strExt[1] || 0)
            num3.setString(user.strExt[2] || 0)
            if (user.totalPoint > 0){
                totalPointStr = "+" + user.totalPoint;
            }else{
                totalPointStr = totalPointStr + user.totalPoint;
            }
            totalPoint = user.totalPoint;
        }else{
            totalHuxi = "";
            if (user.totalPoint > 0){
                totalPointStr = "+" + user.totalPoint;
            }else{
                totalPointStr = totalPointStr + user.totalPoint;
            }
            totalPoint = user.totalPoint;
        }
        ccui.helper.seekWidgetByName(widget,"l1").setString(""+totalHuxi);//总胡息
        if(this.bigResultIsNXPHZ() || this.bigResultIsHSPHZ()){
            ccui.helper.seekWidgetByName(widget,"l1").visible = false;
            ccui.helper.seekWidgetByName(widget,"Label_47_0").visible = false;
        }

        var pointTotal = ccui.helper.seekWidgetByName(widget,"p5");
        var fnt = "res/res_phz/phzBigResult/phz_jsj_font.fnt";
        if(parseInt(totalPoint)<0){
            fnt = "res/res_phz/phzBigResult/phz_js_font.fnt";
        }
        //cc.log("totalPointStr========="+totalPointStr);
        var label = new cc.LabelBMFont(totalPointStr,fnt);
        label.x = pointTotal.width*0.5;
        label.y = pointTotal.height*0.5;
        pointTotal.addChild(label);
        label.setString(totalPointStr+"")

        if(PHZRoomModel.isMatchRoom()){
            label.x += 50;
            this.showMoneyIcon(label);
        }

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_phz/default_m.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.9;
        sprite.x = 50;
        sprite.y = 50;
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

    showMoneyIcon:function(label){
        var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
        icon.setAnchorPoint(1,0.5);
        icon.setPosition(-10,label.height/2);
        label.addChild(icon);
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

            if(this.bigResultIsBP() || PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
                if(d.bopiPoint <= min){
                    min = d.bopiPoint;
                }
                if(d.bopiPoint >= omax){
                    omax = d.bopiPoint;
                }
            }else{
                if(d.totalPoint >= omax){
                    omax = d.totalPoint;
                }
                if(d.totalPoint <= min){
                    min = d.totalPoint;
                }
            }
            //cc.log("phz打结算分数..." , d.totalPoint , d.bopiPoint)
        }

        // cc.log("phz计算出的结算最大分和最小分..." , min , omax);
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            d.dyj = 0;
            d.zdyj = 0;
            if(this.bigResultIsBP() || PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
                if(d.bopiPoint == omax && omax>0)
                    d.zdyj = 1;
                if(d.bopiPoint == min)
                    d.isMin = 1;
            }else{
                if(d.totalPoint == omax && omax>0)
                    d.zdyj = 1;
                if(d.totalPoint == min)
                    d.isMin = 1;
            }
            this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i]);
        }
        var startX = 1200 - this.getWidget("user1").width/2;
        if(this.data.length == 3){
            this.getWidget("user4").visible = false;
            this.getWidget("user1").x = startX - 700;
            this.getWidget("user2").x = startX ;
            this.getWidget("user3").x = startX + 700;
        }else if(this.data.length == 2){
            this.getWidget("user3").visible = false;
            this.getWidget("user4").visible = false;
            this.getWidget("user1").x = startX -450;
            this.getWidget("user2").x = startX +450;
        }
        var Button_20 = this.getWidget("Button_20");
        Button_20.visible = false;
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
                // Button_dissolution.visible = true;
            }
            // cc.log("this.resultMsg"+JSON.stringify(this.resultMsg));
        }
        if (PHZRoomModel.roomName){
            this.getWidget("Label_roomname").setString(PHZRoomModel.roomName);
            if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                this.getWidget("groupid").setString("亲友圈ID:" + ClosingInfoModel.ext[10]);
            }else{
                this.getWidget("groupid").setString("亲友圈ID:" + ClosingInfoModel.ext[13]);
            }
        }else{
            this.getWidget("Label_roomname").visible = false;
            this.getWidget("groupid").visible = false;
            btn_start_another.setVisible(false);
        }

        if(PHZRoomModel.isMatchRoom()){
            btn_start_another.setVisible(false);
            btn_return_hall.setPosition(btn_start_another.getPosition());
            this.getWidget("groupid").visible = false;
        }


        var ext3 = ClosingInfoModel.ext[3];
        var str = "";
        var dtimes = 0;
        var dScore = 0;
        var extStr2 = PHZRoomModel.getName(ext3);
        this.getWidget("ext2").setString(extStr2);
        this.getWidget("ext3").setString(ClosingInfoModel.ext[2]);
        this.getWidget("ext4").setString("");
        if (ClosingInfoModel.round){
            this.getWidget("ext4").setString("局数:"+ClosingInfoModel.round);
        }

        this.getWidget("ext5").setString("");
        if (PHZRoomModel.isCreditRoom()) {
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = PHZRoomModel.getCreditType();
            var giveWay = PHZRoomModel.getCreditWay();
            var giveNum = PHZRoomModel.getCreditGiveNum();
            if (giveType == 1) {
                giveStr = giveStr + "固定赠送,";
            } else {
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1) {
                if(PHZRoomModel.getCreditPayWay()){
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

            this.getWidget("ext5").setString("底分:" + PHZRoomModel.getCreditScore() + "," + giveStr);
        }else if(PHZRoomModel.isClubGoldRoom()){
            this.getWidget("ext5").setString(PHZRoomModel.getClubGlodCfg());
        }else{
            var strLabel = this.getWidget("ext5");
            strLabel.setAnchorPoint(0,1);
            strLabel.setPosition(strLabel.x - 90,strLabel.y + 90);
            strLabel.ignoreContentAdaptWithSize(false);
            strLabel.setSize(480, 200);

            var wanfaStr = PHZRoomModel.getWanFaDesc();

            if(PHZRoomModel.isMatchRoom()){
                wanfaStr = wanfaStr.replace(/,.*支付/,"");
            }

            strLabel.setString("玩法:"+ wanfaStr);
        }
        str = str + "房间号:"+ClosingInfoModel.ext[0];
        this.getWidget("ext1").setString(str);
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
        cc.log("CLUB_RESULT_COIN3",JSON.stringify(ClosingInfoModel.clubResultCoinData))
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
        this.shareCard(PHZRoomModel, this.data, ClosingInfoModel.groupLogId);
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
            if (this.bigResultIsBP() || PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
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
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            groupId = ClosingInfoModel.ext[10];
        }
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
        var defaultimg = "res/res_phz/default_m.png" ;
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.95;
        sprite.x = 60;
        sprite.y = 60;
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
