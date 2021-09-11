/**
 * 俱乐部邀请弹框
 */
var ClubZhuanPanPop = BasePopup.extend({

    ctor:function(parentNode){
        this.isAni = false;
        this.choujiangCishu = 0;
        this.curClubId = ClickClubModel.getCurClubId();
        this.curClubRole = ClickClubModel.getCurClubRole();
        this.curClubName = ClickClubModel.getCurClubName();
        this.parentNode = parentNode;
        this._super("res/zhuanpanPop.json");
    },

    selfRender:function(){
        var self = this;
        this.scoreArr = [888,388,188,18,5.8,1.8,8.8,88,0]
        this.btn_zhuanpan = this.getWidget("Button_chgoujiang");
        UITools.addClickEvent(this.btn_zhuanpan, this , this.onZhuanPan);

        this.zhuanpan = this.getWidget("zhuanpan");

        NetworkJT.loginReq("groupActionNew", "creditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 1
        }, function (data) {
            if (data) {
                cc.log("data =",JSON.stringify(data));
                self.getWidget("Label_20").setString("再玩"+data.message.needPlayCount+"局可获得1次抽奖机会")
                self.choujiangCishu = data.message.wheelCount;
                self.getWidget("Label_19").setString("剩余"+data.message.wheelCount+"次")
                self.getWidget("poolScore").setString(data.message.creditPool/100);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });

        if(this.curClubRole == 1){
            this.getWidget("Panel_qunzhu").visible =true;
            this.inputBox = new cc.EditBox(cc.size(300, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/pyqCheckInputPop/numbg.png"));
            this.inputBox.x = 120;
            this.inputBox.y = 30;
            this.inputBox.setPlaceHolder("输入积分");
            //this.inputBox.setPlaceholderFontColor(cc.color(255,255,255));
            this.inputBox.setMaxLength(12);
            this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
            this.inputBox.setFont("Arial",45);
            this.inputBox.setPlaceholderFont("Arial",45);
            this.getWidget("Panel_qunzhu").addChild(this.inputBox)
        }else{
            this.getWidget("Panel_qunzhu").visible =false;
        }

        var btn_jia = this.getWidget("Button_jia");
        btn_jia.temp = 1;
        var btn_jian = this.getWidget("Button_jian");
        btn_jian.temp = -1;

        UITools.addClickEvent(btn_jia,this,this.changeScore);
        UITools.addClickEvent(btn_jian,this,this.changeScore);

        var btn_dajiang = this.getWidget("Button_dajiang");
        UITools.addClickEvent(btn_dajiang,this,function () {
            AlertPop.show("确定开启大奖嘛？",function(){
                        self.onDaJiang()
            },function(){});
        });
    },
    
    onDaJiang:function () {
        var self=this;

        NetworkJT.loginReq("groupActionNew", "setCreditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 2,
        }, function (data) {
            if (data) {
                FloatLabelUtil.comText("大奖开启成功！");
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    changeScore:function (sender) {
        var self=this;
        var score = this.inputBox.getString();
        score = score *  sender.temp * 100;

        NetworkJT.loginReq("groupActionNew", "setCreditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 1,
            credit:score
        }, function (data) {
            if (data) {
                cc.log("data =",JSON.stringify(data));
                FloatLabelUtil.comText("分数设置成功！");
                self.getWidget("poolScore").setString(data.message/100);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

   onZhuanPan:function () {
       if(this.isAni){
           FloatLabelUtil.comText("请等抽奖结束后再次抽奖");
           return;
       }

       this.zhuanpan.setRotation(0);
       var self = this;
       NetworkJT.loginReq("groupActionNew", "creditWheel", {
            groupId : this.curClubId, 
            userId: PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            opType: 2
        }, function (data) {
            if (data) {
                cc.log("data.message =",JSON.stringify(data));
                var rotate = 0;
                for (var index = 0; index < self.scoreArr.length; index++) {
                    if(data.message/100 == self.scoreArr[index]){
                        rotate = (9-index)* 40 - MathUtil.mt_rand(10,30);
                    }
                }
                self.choujiangCishu -= 1;
                self.getWidget("Label_19").setString("剩余"+self.choujiangCishu+"次")

                self.showAni(rotate);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
   },

   showAni:function (rotate) {
       
       var self = this;
    //    cc.log("rotate =",rotate);
       this.isAni = true;
       this.zhuanpan.runAction(cc.sequence(
                        cc.rotateBy(1,360),
                        cc.rotateBy(1,360),
                        cc.rotateBy(1,rotate),
                        cc.callFunc(function () {
							self.isAni = false;;
					}, this)));
   },
});
