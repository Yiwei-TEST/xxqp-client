/**
 * Created by zhoufan on 2016/7/22.
 */
var AHMJRoom = BaseRoom.extend({
    layouts:{},
    initCoords:{},
    COUNT_DOWN:15,
    HAIDI_MEIHU:999,
    

    ctor:function(json){
        this.layouts = {};
        this.tingList = [];
        this.initCoords = {};
        this.lastLetOutMJ = 0;
        this.lastLetOutSeat = 0;
        this.setUpTimeId = -1;
        this.jsqFen = 0;
        this.jsqShi = 0;

        if (MJRoomModel.isOpenTuoguan()){
            this.COUNT_DOWN = MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ?MJRoomModel.intParams[8]:MJRoomModel.intParams[10];
        }
        this._super(json);
    },

    onRemove:function(){
        if(this.setUpTimeId>=0)
            clearTimeout(this.setUpTimeId);
        this.tingList.length=0;
        this._effectLayout.cleanData();
        BaseRoom.prototype.onRemove.call(this);
        MJRoomModel.mineLayout = null;
    },

    getModel:function(){
        return MJRoomModel;
    },

    getLabelTime:function(){
        return this.getWidget("Label_time");
    },

    getChatJSON:function(){
        return "res/chat.json";
    },

    selfRender:function(){
        BaseRoom.prototype.selfRender.call(this);
        this.hbtns = [];
        for(var i=1;i<=6;i++){
            if(i<=MJRoomModel.renshu){
                var p = this.getWidget("player"+i);
                this.initCoords[i] = {x: p.x,y: p.y};
                UITools.addClickEvent(p,this,this.onPlayerInfo);
            }
            var hbtn = this.getWidget("hbtn"+i);
            this.hbtns.push(hbtn);
            UITools.addClickEvent(hbtn,this,this.onOperate);
        }
        this.Image_24 = this.getWidget("Image_24");
        this.jt = this.getWidget("jt");
        this.jt1= this.getWidget("jt1");
        this.jt2= this.getWidget("jt2");
        this.jt3= this.getWidget("jt3");
        this.jt4= this.getWidget("jt4");
        this.jt.visible = false;
        this.Image_info1 = this.getWidget("Image_info1");
        this.Image_info2 = this.getWidget("Image_info2");
        this.Label_info_mj = this.getWidget("Label_info_mj");
        this.Label_info0 = this.getWidget("Label_info0");//房号
        this.Panel_btn = this.getWidget("Panel_btn");//按钮panel
        //this.Button_setup = this.getWidget("Button_setup");
        this.Button_setup1 = this.getWidget("Button_setup1");
        this.Image_setup = this.getWidget("Image_setup");
        this.Panel_20 = this.getWidget("Panel_20");
        this.Button_info = this.getWidget("Button_info");
        this.Button_gps = this.getWidget("Button_gps");
         this.getWidget("mPanel1").y = 20;

        if (SyConfig.HAS_GPS && MJRoomModel.renshu >2) {
            if(GPSModel.getGpsData(PlayerModel.userId) == null){
                this.Button_gps.setBright(false);
            }else{
                this.Button_gps.setBright(true);
            }
        } else {
            this.Button_gps.visible = false;
        }
        this.getWidget("label_version").setString(SyVersion.v);


        this.Panel_piaofen = this.getWidget("Panel_piaofen");//飘分panel
        this.Panel_piaofen.visible = false;
        this.Button_bp = this.getWidget("Button_bp");//不飘分按钮
        this.Button_bp.temp = 0;
        this.Button_p1f = this.getWidget("Button_p1f");//飘1分按钮
        this.Button_p1f.temp = 1;
        this.Button_p2f = this.getWidget("Button_p2f");//飘2分
        this.Button_p2f.temp = 2;
        this.Button_p3f = this.getWidget("Button_p3f");//飘3分
        this.Button_p3f.temp = 3;
        this.Button_p4f = this.getWidget("Button_p4f");//飘3分
        this.Button_p4f.temp = 4;
        UITools.addClickEvent(this.Button_bp,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p1f,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p2f,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p3f,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p4f,this,this.onPiaoFen);


        // this.Button_gps.visible =true;
        //this.Button_gps.x = 190;
        //this.Button_gps.y = 680;
        this.Label_ting = this.getWidget("Label_ting");//听牌
        this.Panel_ting = this.getWidget("Panel_ting");//听的牌面
        this.Label_ting.visible = this.Panel_ting.visible = false;
        this.Panel_ting.removeAllChildren(true);
        this.Panel_8 = this.getWidget("Panel_8");
        this.Panel_8.visible = false;
        this.Button_9 = this.getWidget("Button_9");//小结详情
        this.Button_10 = this.getWidget("Button_10");//继续按钮
        this.btn_back = this.getWidget("btn_back");
        this.Main = this.getWidget("Panel_20");
        this.bgColor = cc.sys.localStorage.getItem("sy_mj_pz"+MJRoomModel.wanfa)||cc.sys.localStorage.getItem("sy_mj_pz") || 2;
        this.Label_jsq = this.getWidget("Label_jsq");//计时器
        //this.Label_jsq.setString("计时器\n00:00");
        this.Label_jsq.setString("");
        this.btnInvite.y = 400;
        this.roomName_label = new cc.LabelTTF("","Arial",32,cc.size(500, 40));
        this.addChild(this.roomName_label, 10);
        if (MJRoomModel.roomName){
            this.roomName_label.setString(MJRoomModel.roomName);
            this.roomName_label.setColor(cc.color(214,203,173));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = cc.winSize.width/2 - 840;
            this.roomName_label.y = cc.winSize.height/2 + 300;
        }

        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//取消托管按钮
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

        this.Button_ting = this.getWidget("Button_ting");//听牌按钮


        this.Panel_niaoPai = this.getWidget("Panel_niaoPai");//结算时鸟牌显示
        this.Button_75 = this.getWidget("Button_75");//设置
        UITools.addClickEvent(this.Button_75,this,this.onSetUp);

        this.updateBgColor(this.bgColor);
        UITools.addClickEvent(this.Button_ting,this,this.onShowHuPanel);
        UITools.addClickEvent(this.btn_back,this,this.onBackFromTing);
        UITools.addClickEvent(this.Button_9,this,this.onCheckResult);
        UITools.addClickEvent(this.Button_10,this,this.onJixuFromResult);
        UITools.addClickEvent(this.Panel_20,this,this.onCancelSelect,false);
        UITools.addClickEvent(this.Button_setup1,this,this.onShowSetUp);
        UITools.addClickEvent(this.Button_info,this,this.onRoomInfo);
        UITools.addClickEvent(this.Button_gps,this,this.onGPS);
        this.addCustomEvent(SyEvent.GET_MAJIANG,this,this.onGetMajiang);
        this.addCustomEvent(SyEvent.SELECT_MAJIANG,this,this.onSelectMajiang);
        this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS , this,this.updateGpsBtn);
        this.addCustomEvent(SyEvent.ROOM_ROLD_ICON , this,this.setRoldPlayerIcon);
        //this.addCustomEvent(SyEvent.SHOW_HU_CARDS , this,this.onShowHuCardsByTingPai);
        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE,this,this.changeBgColor);
        this.addCustomEvent(SyEvent.SHOW_DESKTTOP_CARDS,this,this.onShowDesktopCards);
        this.addCustomEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS,this,this.onHideDesktopCards);
        this.addCustomEvent(SyEvent.FIND_HU_BY_PUTOUT,this,this.onFindCardsByPutout);
        this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction)
        this.addCustomEvent(SyEvent.DAPAI_TING,this,this.outCardTing);
        this.addCustomEvent(SyEvent.SHOW_TING_CARDS , this,this.onShowAllHuCards);
        this.addCustomEvent(SyEvent.SHOW_HU_CARDS , this,this.onShowHuPanel);
        this.addCustomEvent(SyEvent.HIDE_HU_CARDS , this,this.removeHuPanel);
        this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);
        this.addCustomEvent(SyEvent.CHANGE_MJ_BG , this,this.changeMjBg);
        this.addCustomEvent(SyEvent.CHANGE_MJ_CARDS , this,this.changeMjzi);
        this.addCustomEvent(SyEvent.MJ_HIDE_ACTION , this,this.hideAction);

        this.addCustomEvent(SyEvent.PLAY_CARD_AFTER_XIAOHU,this,this.onXiaoHuPlayCard);
        this.addCustomEvent(SyEvent.CS_HAIDI,this,this.onCSHaidi);
        this.addCustomEvent(SyEvent.CS_GANG_MAJIANG,this,this.onCSGang);
        this.addCustomEvent(SyEvent.CXMJ_GANG_ID,this,this.CXMJ_gang);
        this.addCustomEvent(SyEvent.CXMJ_CHOOSE_GANG,this,this.showCXMJ_chooseGang);
        this.addCustomEvent(SyEvent.TCPFMJ_BUHUA , this,this.TCPFMJ_BuHua);
        this.addCustomEvent(SyEvent.TCPFMJ_PAOFENG , this,this.TCPFMJ_PaoFeng);
        this.addCustomEvent(SyEvent.ZZMJ_PIAOFEN , this,this.StartPiaoFen);
        this.addCustomEvent(SyEvent.ZZMJ_FINISH_PIAOFEN , this,this.FinishPiaoFen);
        this.addCustomEvent(SyEvent.YYNXMJ_BAOTING , this,this.YYNXMJ_baoting);
        this.addCustomEvent(SyEvent.YYNXMJ_HAIDI , this,this.YYNXMJ_haidi);
        this.addCustomEvent(SyEvent.KWMJ_FENGDONG,this,this.KWMJ_fengdong);
        this.addCustomEvent(SyEvent.KWMJ_BAOTING,this,this.KWMJ_baoting);

        this.countDownLabel = new cc.LabelBMFont("15","res/font/font_mj3.fnt");
        this.countDownLabel.x = this.jt.width/2-1;
        this.countDownLabel.y = this.jt.height/2-3;
        this.jt.addChild(this.countDownLabel);
        this._effectLayout = new MJEffectLayout(this.root, this);

        this.recordBtn.x = 70;
        this.recordBtn.y = 550;
        if(MJRoomModel.renshu > 2){
            this.recordBtn.y = 470;
        }

        var huBg = "res/res_mj/mjRoom/img_ting1.png";
        this.Panel_hupai = new cc.Scale9Sprite(huBg,null,cc.rect(10,10,1,1));
        this.Panel_hupai.x = 720;
        this.Panel_hupai.y = 300;
        this.Panel_hupai.height = 220;
        this.root.addChild(this.Panel_hupai,4);

        var roomFile = "res/res_mj/res_ahmj/ahmjRoom/ahmj.png";
        if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ)
            roomFile = "res/res_mj/res_ahmj/cxmjRoom/cxmj.png";
        else  if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ)
            roomFile = "res/res_mj/res_ahmj/kwmjRoom/kwmj.png";
        if(MJRoomModel.isTCPFMJ())
            roomFile = "res/res_mj/res_ahmj/tcmjRoom/tcpfmj.png";
        if(MJRoomModel.isTCDPMJ())
            roomFile = "res/res_mj/res_ahmj/tcmjRoom/tcdpmj.png";
        if(MJRoomModel.isYYNXMJ())
            roomFile = "res/res_mj/res_ahmj/yynxmjRoom/yynxmj.png";
        var gameNameImg = new cc.Sprite(roomFile);
        var x = 960;
        var y = 740;
        gameNameImg.setPosition(x, y);
        this.root.addChild(gameNameImg,2);

        //this.getWidget("mPanel1").y = 10;

        this.button_wanfa =  new ccui.Button("res/res_mj/mjRoom/wanfa.png","","");
        this.Panel_20.addChild(this.button_wanfa);
        this.button_wanfa.y = this.Button_setup1.y;
        this.button_wanfa.x = 1710;
        UITools.addClickEvent(this.button_wanfa,this,this.showWanFaImg);
        this.initwanfaImg();
        this.showWanFaImg();

        this.button_fengDong =  new ccui.Button("res/res_mj/res_ahmj/kwmjRoom/feng.png","","");
        this.Panel_20.addChild(this.button_fengDong);
        this.Button_52 = this.getWidget("Button_52");//聊天按钮位置
        if(MJRoomModel.renshu == 2){
            this.button_fengDong.y = this.Button_52.y - 150;
            this.button_fengDong.x =  this.Button_52.x;
        }else{
            this.button_fengDong.y =  this.button_wanfa.y;
            this.button_fengDong.x =  1580;
        }
        UITools.addClickEvent(this.button_fengDong,this,this.send_KWMJ_fengdong);
        this.button_fengDong.visible = MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ;

        this.Panel_8.x += 400;
        this.Panel_8.y -= 30;

        if(MJRoomModel.renshu == 4){
            this.getWidget("oPanel"+3).y -= 10;
            this.getWidget("oPanel"+1).y -= 20;
            this.getWidget("oPanel"+2).y -= 120;
            this.getWidget("oPanel"+3).x += 80;
            this.getWidget("oPanel"+2).x += 130;
            this.getWidget("oPanel"+4).x -= 130;
            this.getWidget("oPanel"+1).x -= 60;
        }else if(MJRoomModel.renshu == 3){
            this.getWidget("oPanel"+1).x -= 150;
            this.getWidget("oPanel"+1).y -= 20;
            this.getWidget("oPanel"+3).x -= 5;
            this.getWidget("oPanel"+2).x -= 30;
        }else if(MJRoomModel.renshu == 2){
            this.getWidget("oPanel"+2).x += 150;
            this.getWidget("oPanel"+2).y -= 30;
            this.getWidget("oPanel"+1).x -= 20;
            this.getWidget("oPanel"+1).y -= 20;
        }



        this.newUpdateFace();
        // this.showCXMJ_chooseGang();
        //this.adjustInviteBtn();
    },

    KWMJ_fengdong:function(){
        this.button_fengDong.visible = false;
    },
    KWMJ_baoting:function(message){
        var data = message.getUserData();
        var seat =data.params[0];
        this._players[seat].setTingState(true);
        if(seat == MJRoomModel.mySeat)
            this.Panel_btn.visible = false;
    },
    YYNXMJ_haidi:function(message){
        var data = message.getUserData();
        var userId = data.params[1];
        var seat = data.params[0];
        var direct = MJRoomModel.getPlayerSeq(userId,MJRoomModel.mySeat,seat);
        if(!this.getChildByTag(this.HAIDI_MEIHU + direct)) {
            var act = new cc.Sprite("res/res_mj/res_ahmj/yynxmjRoom/btn_meihu.png");
            act.x = this.getWidget("cp" + direct).x + this.getWidget("cp" + direct).width / 2;
            act.y = this.getWidget("cp" + direct).y + this.getWidget("cp" + direct).width / 2;
            this.addChild(act, 1000, this.HAIDI_MEIHU + direct);
        }
    },
    YYNXMJ_baoting:function(message) {
        var data = message.getUserData();
        this.refreshButton(data.params)
    },

    onPiaoFen:function(obj){
        //飘分
        var temp = obj.temp;
        sySocket.sendComReqMsg(2023,[temp]);
    },
    StartPiaoFen:function(message){
        var params = message.getUserData().params;  
        var self = this;
        setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
            self.showPiaoFenPanel();
        },100);
        this.showWaitSelectPiao(true);
    },
    FinishPiaoFen:function(event){
        var message = event.getUserData();
        var params = message.params;
        // cc.log("params",params);
        var userId = params[0];
        var p = MJRoomModel.getPlayerVo(userId)
        if (params[1] != -1){
            this._players[p.seat].showPiaoFenImg(params[1])
            if (p.seat == MJRoomModel.mySeat){
                this.Panel_piaofen.visible = false;
            }
        }else{
            this.showWaitSelectPiao(true);
        }
        // this.isPiaoFenNow = false;
    },
    showPiaoFenPanel:function() {
        // cc.log("type = ",type);
        for(var i=1;i<=MJRoomModel.renshu;i++){
            var mjp = this._players[i];
            if(mjp){
                mjp.startGame();
            } 
        }
        this.Panel_piaofen.visible = true;
        if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            this.Button_p3f.visible = false;
            this.Button_p1f.x = 210;
            this.Button_p2f.x = 650;
        }
    },
    hideAction:function() {
        this.Panel_btn.visible = false;
    },
    showWaitSelectPiao:function(isShow){
        if(isShow){
            if(!this.waitPiaoImg){
                this.waitPiaoImg = new cc.Sprite("res/res_mj/mjRoom/word_piaofen.png");
                this.waitPiaoImg.setPosition(cc.winSize.width/2 + 50,cc.winSize.height/2 + 120);
                this.addChild(this.waitPiaoImg,4);
            }
            this.waitPiaoImg.setVisible(true);
        }else{
            this.waitPiaoImg && this.waitPiaoImg.setVisible(false);
        }
    },
    TCPFMJ_BuHua:function(message){
        var data = message.getUserData();
        var seat = data.params[0];
        var player = MJRoomModel.getPlayerVoBySeat(seat)
        var userId = player.userId;
        var prefix= "tcpfmj_buhua";
        var direct = MJRoomModel.getPlayerSeq(userId,MJRoomModel.mySeat,seat);
        MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
        var id = [data.params[1]];
        this.layouts[direct].buHua(id);
        if(MJRoomModel.mySeat == seat){
            this.layouts[direct].delFromPlace1(data.params[1]);
        }else{
            MJRoomModel.remain -= 1;
        }
        prefix = "buhua";
        MJRoomSound.actionSound(userId,prefix);
        this.updateRemain();

    },
    TCPFMJ_PaoFeng:function (message) {
        var data = message.getUserData();
        // cc.log("data =",JSON.stringify(data));
        this._players[data.params[0]].setPaoFengImg_TCPFMJ(data.params[1]);
        var player = MJRoomModel.getPlayerVoBySeat(data.params[0])
        var userId = player.userId;
        var prefix = "paofeng";
        if(data.params[1] == 1){
            setTimeout(function () {
                MJRoomSound.actionSound(userId,prefix);   
            },500)
        }
    },

    newUpdateFace:function(){//宽屏适配
        var size = cc.director.getWinSize();
        var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
        var offx = tempSize > 100 ? 50 : tempSize/2;
        if(size.width > SyConfig.DESIGN_WIDTH){
            this.getWidget("Image_info0").x -= tempSize - offx;
            this.getWidget("Image_info1").x -= tempSize - offx;
            this.getWidget("Image_info2").x -= tempSize - offx;
            this.recordBtn.x -= tempSize - offx;
            this.Button_ting.x += tempSize - offx;
            this.getWidget("Button_52").x += tempSize - offx;
            this.button_wanfa.x += tempSize - offx;
            this.Button_setup1.x += tempSize - offx;
            this.Image_setup.x += tempSize - offx;
            this.Button_gps -= tempSize - offx;
            this.getWidget("label_version").x += tempSize - offx;
            this.getWidget("netType").x += tempSize - offx;
            this.getWidget("Image_19").x += tempSize - offx;
            this.getWidget("Label_time").x += tempSize - offx;
            this.roomName_label.x = 120 + offx;
            this.button_fengDong.x += tempSize - offx;
        }
    },

    //微信邀请按钮统一换资源，增加亲友圈邀请按钮
    adjustInviteBtn:function(){
        var img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";
        var btn_wx_invite = this.btnInvite;
        btn_wx_invite.loadTextureNormal(img_wx);
        cc.log("this.btnInvite====",this.btnInvite.x);
        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName){
            var offsetX = 350;
            var offsetY = 390;
            this.btn_qyq_back = new ccui.Button(img_back,"","");
            this.btn_qyq_back.setPosition(btn_wx_invite.width/2 - 2*offsetX,btn_wx_invite.height/2);
            UITools.addClickEvent(this.btn_qyq_back,this,this.onBackToPyqHall);
            btn_wx_invite.addChild(this.btn_qyq_back);

            if(BaseRoomModel.curRoomData.strParams[4] == 1){
                img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
            }
            this.btn_qyq_invite = new ccui.Button(img_qyq,"","");
            this.btn_qyq_invite.visible = ClickClubModel.getIsForbidInvite();
            this.btn_qyq_invite.setPosition(btn_wx_invite.width/2 - offsetX,btn_wx_invite.height/2);
            UITools.addClickEvent(this.btn_qyq_invite,this,this.onShowInviteList);
            btn_wx_invite.addChild(this.btn_qyq_invite);
            if(!ClubRecallDetailModel.isDTZWanfa(BaseRoomModel.curRoomData.wanfa)){
                btn_wx_invite.setPosition(btn_wx_invite.x + (offsetX),offsetY);
            }else{
                this.btn_qyq_invite.setPosition(btn_wx_invite.width/2,185);
                this.btn_qyq_back.setPosition(btn_wx_invite.width/2,319);
                btn_wx_invite.setPositionY(btn_wx_invite.y - 65);
            }
        }

    },

    send_KWMJ_fengdong:function(){
        AlertPop.show("确定选择封东吗？", function () {
            sySocket.sendComReqMsg(2061,[]);
        });
    },

    KWMJ_baoting:function(message){
        cc.log("message =",JSON.stringify(message));
        var data = message.getUserData();
        var seat =data.params[0];
        this._players[seat].setTingState(true);
        if(seat == MJRoomModel.mySeat)
            this.Panel_btn.visible = false;
    },
    KWMJ_fengdong:function(){
        this.button_fengDong.visible = false;
    },

    showWanFaImg:function(){
        this.Image_setup.visible = false;
        this.Button_setup1.setBright(!this.Image_setup.visible);
        if (this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(!this.Panel_20.getChildByName("wanfaImg").isVisible());
        }
    },
    initwanfaImg:function(){
        var wanfaStr = ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams);
        var wanfaArr = wanfaStr.split(" ");
        wanfaStr = wanfaStr.replace(/ /g,"\n");
        var bgHeigh = 20 + wanfaArr.length * 40;
        if (this.Panel_20.getChildByName("wanfaImg")){
            var wanfa_bg = this.Panel_20.getChildByName("wanfaImg");
            wanfa_bg.setContentSize(cc.size(320,bgHeigh));
            wanfa_bg.setPosition(1710,this.button_wanfa.y - wanfa_bg.height/2-40);
            wanfa_bg.getChildByName("wanfa_label").setString(wanfaStr);
            wanfa_bg.getChildByName("wanfa_label").y = wanfa_bg.height/2-10;
            wanfa_bg.getChildByName("wanfa_label").setContentSize(cc.size(320,wanfa_bg.height));
        }else{
            var bg = UICtor.cS9Img("res/res_mj/mjRoom/xiala.png",cc.rect(5,17,117,5),cc.size(320,bgHeigh));
            bg.setPosition(1710,this.button_wanfa.y - bg.height/2-40);
            bg.setName("wanfaImg");
            bg.visible = false;
            this.Panel_20.addChild(bg,201);
            var wanfa_label = new cc.LabelTTF("","Arial",32,cc.size(320, bg.height));
            bg.addChild(wanfa_label, 10);
            wanfa_label.setString(wanfaStr);
            wanfa_label.setName("wanfa_label")
            wanfa_label.setColor(cc.color(255,255,255));
            wanfa_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            wanfa_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            wanfa_label.setPosition(bg.width/2+10,bg.height/2 - 10);
        }
        var size = cc.director.getWinSize();
        if(size.width > SyConfig.DESIGN_WIDTH) {
            var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
            var offx = tempSize > 100 ? 50 : tempSize/2;
            this.Panel_20.getChildByName("wanfaImg").x += (size.width - SyConfig.DESIGN_WIDTH)/2 - offx;
        }
    },
    getWanFaLabelString:function(){
        var string = "中鸟加分";
        if (MJRoomModel.intParams[3] == 2){
            string = "中鸟翻倍"
        }else if (MJRoomModel.intParams[3] == 2){
            string = "中鸟加倍"
        }
        string = string+",抓" + MJRoomModel.intParams[4]+"鸟";
        if (MJRoomModel.intParams[16] == 0){
            string = string + ",不飘分";
        }else if (MJRoomModel.intParams[16] == 1){
            string = string + ",自由飘分";
        }else{
            string = string + ",飘" + MJRoomModel.intParams[16] + "分";
        }
        if (MJRoomModel.intParams[7] == 2 && MJRoomModel.intParams[19] == 1){
            string = string+ ",低于" + MJRoomModel.intParams[20] + "分翻" + MJRoomModel.intParams[21] +"倍";
        }else{
            string = string + ",不翻倍";
        }
        return string;
    },
    showPiaoBtn:function(isShow){
        if(isShow){
            if(!this.piaoBtnNode){
                this.piaoBtnNode = new cc.Node();
                this.piaoBtnNode.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 50);
                this.addChild(this.piaoBtnNode,5);
                var imgArr = ["bupiao.png","1fen.png","2fen.png","3fen.png"];
                var offsetX = 170;
                var startX = -(imgArr.length - 1)/2*offsetX;
                for(var i = 0;i<imgArr.length;++i){
                    var img = "res/res_mj/mjRoom/" + imgArr[i];
                    var btn = new ccui.Button(img);
                    btn.setTag(i);
                    btn.setScale(0.6);
                    btn.setPosition(startX + offsetX*i,0);
                    UITools.addClickEvent(btn,this,this.onClickPiaoFenBtn);
                    this.piaoBtnNode.addChild(btn);
                }
            }
            this.piaoBtnNode.setVisible(true);
        }else{
            this.piaoBtnNode && this.piaoBtnNode.setVisible(false);
        }
    },

    showWaitSelectPiao:function(isShow){
        if(isShow){
            if(!this.waitPiaoImg){
                this.waitPiaoImg = new cc.Sprite("res/res_mj/mjRoom/word_piaofen.png");
                this.waitPiaoImg.setPosition(cc.winSize.width/2 + 50,cc.winSize.height/2);
                this.addChild(this.waitPiaoImg,4);
            }
            this.waitPiaoImg.setVisible(true);
        }else{
            this.waitPiaoImg && this.waitPiaoImg.setVisible(false);
        }
    },

    // onPiaoFen:function(){
    //     cc.log("=============onPiaoFen=============");
    //     if(this.piaofenTime){
    //         clearTimeout(this.piaofenTime);
    //     }
    //     this.piaofenTime = setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
    //         this.showPiaoBtn(true);
    //     }.bind(this),100);
    // },

    // onSelectPiaoFen:function(event){
    //     var msg = event.getUserData();
    //     if(this._players[msg.params[0]]){
    //         this._players[msg.params[0]].setPiaofen(msg.params[1]);
    //     }
    //     if(msg.params[0] == MJRoomModel.mySeat){
    //         this.showPiaoBtn(false);
    //         this.showWaitSelectPiao(true);
    //     }
    // },

    onClickPiaoFenBtn:function(sender){
        sySocket.sendComReqMsg(201,[sender.getTag()]);
    },

    onXiaoHuPlayCard:function(){
        cc.log("==========onXiaoHuPlayCard==========");
        setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
            MJRoomModel.csmjIsOptXiaoHu = true;
            MJRoomModel.nextSeat = MJRoomModel.mySeat;
        },100);
    },

    //长沙麻将海底牌消息
    onCSHaidi:function(event){
        cc.log("==========onHZHaidi==========");
        var message = event.getUserData();
        if(message.params[0] == 1){
            var pop = new MJHaiDiPop();
            PopupManager.addPopup(pop);
        }
    },

    //长沙麻将杠牌消息
    onCSGang:function(event){
        var message = event.getUserData();
        // cc.log("message =",JSON.stringify(message));
        var acts = CsMjGangModel.gangActs;
        var isHas = false;
        var direct = MJRoomModel.getPlayerSeq(message.userId,MJRoomModel.mySeat,message.seat);
        for(var i=0;i<acts.length;i++){
            var act = acts[i];
            var vo = MJAI.getMJDef(act.majiangId);
            if (act.selfAct[0] == 1)
                this.refreshButton(act.selfAct);
            this.layouts[direct].GangChuPai(vo);
        }

        if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            this.showKWMJGang(message.seat);
        }

        // var delay = 0;
        // if(message.reconnect != 1){
        //     if(message.dice > 0){
        //         this.playSaiziAni(parseInt(message.dice/10),message.dice%10);
        //         delay = 1400;
        //     }
        // }

        if((message.dice > 0) && (message.reconnect != 1)){
            this.csGangMoPai(message.seat);
        }

 
    },

    showKWMJGang:function(seat){
        if(this.KWMJGangTime){
            clearTimeout(this.KWMJGangTime);
        }
        if(this.KWMJGang_Panel){
            this.KWMJGang_Panel.removeAllChildren();
            this.KWMJGang_Panel.removeFromParent();
            this.KWMJGang_Panel = null;
        }
        var acts = CsMjGangModel.gangActs;
        // cc.log("acts =",JSON.stringify(acts));
        if(acts.length > 0){
            var bg = new cc.Scale9Sprite("res/res_mj/mjRoom/img_ting1.png");
            this.KWMJGang_Panel = bg;
            this.Panel_20.addChild(bg,2145);
            this.KWMJGang_Panel.width = 350;
            this.KWMJGang_Panel.height = 220;
            this.KWMJGang_Panel.setAnchorPoint(0.5,0.5);
            this.KWMJGang_Panel.x = 960;
            this.KWMJGang_Panel.y = 510;
            var hasHu = false;
            var isDelay = false;
            for(var i = 0;i<acts.length;++i){
                var id = parseInt(acts[i].majiangId);
                var card = new AHMahjong(MJAI.getDisplayVo(1, 1), MJAI.getMJDef(id));
                card.x = i * 170 + 20;
                card.y = 5;
                this.KWMJGang_Panel.addChild(card);
                if(acts[i].selfAct[0] || acts[i].selfAct[17]){
                    hasHu = true;
                }
                if(acts[i].selfAct.length == 0){
                    isDelay = true;
                }
            }

            if(isDelay && !hasHu){
                var self = this;
                this.KWMJGangTime = setTimeout(function(){
                    if(self.KWMJGang_Panel){
                        self.KWMJGang_Panel.removeAllChildren();
                        self.KWMJGang_Panel.removeFromParent();
                        self.KWMJGang_Panel = null;
                    }
                },3000);
            }
        }
    },

    csGangMoPai:function(seat){
        var acts = CsMjGangModel.gangActs;

        if(seat == MJRoomModel.mySeat){
            var playIds = [];

            var delay = 0;
            for(var i = 0;i<acts.length;++i){
                var id = acts[i].majiangId;
                var selfAct = acts[i].selfAct;
                if(!(selfAct && selfAct.length > 0 && (selfAct[2] || selfAct[3] || selfAct[5] || selfAct[16]))){
                    playIds.push(id);//有杠和补的操作就不打出去，否则打出去
                }
                this.delayGangMoPai(id,delay);
                delay += 0.5;
            }

            for(var i = 0;i<playIds.length;++i){
                this.delayPlayChuPai(playIds[i],CsMjGangModel.seat,1,null,delay,true);
                delay += 0.5;
            }
        }else{
            var seq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat);
            for(var i = 0;i<acts.length;++i){
                this.getLayout(seq).moPai(acts[i].majiangId);
            }
        }
    },

    delayGangMoPai:function(id,delay){
        // cc.log("==========delayGangMoPai===========",id);
        this.runAction(cc.sequence(cc.delayTime(delay),cc.callFunc(function(){
            this.getLayout(1).moPai(id);
        }.bind(this))));
    },

    playSaiziAni:function(num1,num2){
        // cc.log("=========playSaiziAni==========");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/saiziani/baijindao_mjq_touzi.ExportJson");


        var contentNode = this.getChildByName("saiziContentNode");
        contentNode && contentNode.removeFromParent(true);
        contentNode = new cc.Node();
        contentNode.setName("saiziContentNode");
        contentNode.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 30);
        this.addChild(contentNode,100);

        var saizi_1 = new cc.Sprite("res/res_mj/mjRoom/saizi/Dice1_00" + num1 + ".png");
        var saizi_2 = new cc.Sprite("res/res_mj/mjRoom/saizi/Dice2_00" + num2 + ".png");
        saizi_1.setPosition(-saizi_1.width/2,5);
        saizi_2.setPosition(saizi_2.width/2,-5);
        saizi_1.visible = saizi_2.visible = false;
        contentNode.addChild(saizi_1);
        contentNode.addChild(saizi_2);

        var saiziAni = new ccs.Armature("baijindao_mjq_touzi");
        saiziAni.setPosition(0,-100);
        saiziAni.getAnimation().play("touzi",-1,0);
        saiziAni.setScale(0.7);
        contentNode.addChild(saiziAni);

        saiziAni.runAction(cc.scaleTo(0.4,1));
        saiziAni.runAction(cc.moveTo(0.4,cc.p(0,0)));
        saiziAni.runAction(cc.sequence(cc.delayTime(0.4),cc.callFunc(function(node){
            node.removeFromParent(true);
        })));

        var action = cc.sequence(cc.delayTime(0.4),cc.show());
        saizi_1.runAction(action);
        saizi_2.runAction(action.clone());

        contentNode.runAction(cc.sequence(cc.delayTime(1.4),cc.callFunc(function(node){
            node.removeFromParent(true);
        })));

    },

    onExit:function(){

        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/saiziani/baijindao_mjq_touzi.ExportJson");

        this._super();
    },

    onSetUp:function(){
        var mc = null;
        if(MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()){
            mc = new TCPFMjSetUpPop();
        }else{
            mc = new MjSetUpPop();
        }
        PopupManager.addPopup(mc);
    },

    changeMjBg:function(event){
        var type = event.getUserData();
        for(var lay in this.layouts){
            this.layouts[lay].changeMahjongRes(type);
        }
    },
    changeMjzi:function(event){
        var type = event.getUserData();
        for(var lay in this.layouts){
            this.layouts[lay].changeMahjongZi(type);
        }
    },
    /**
     * 点击取消托管
     */
    onCancelTuoguan:function(){
        sySocket.sendComReqMsg(210,[0]);
    },


    //通过打出去的牌找出可以胡的牌
    onFindCardsByPutout:function(event){
        var card = event.getUserData();
        for (var i = 0; i < MJRoomModel.lzTingResult.length; i++) {
            var putOut = MJRoomModel.lzTingResult[i].pushOut;
            if (putOut.i == card.i) {
                var ting = MJRoomModel.lzTingResult[i].ting;
                this.onShowHuCards(ting);
                return;
            }
        }
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var handCards = ArrayUtil.clone(data1);
        var index = MJAI.findIndexByMJVoC(handCards,card.c);
        if(index>=0){
            handCards.splice(index,1);
        }
        var hu = new MajiangSmartFilter();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var start = new Date().getTime();
        var result = hu.findHuCards(handCards,huBean);
        //cc.log("onFindCardsByPutout cost Time :::::"+(new Date().getTime() - start))
        MJRoomModel.lzTingResult.push({ting: result, pushOut: card});
        this.onShowHuCards(result);
    },

    /**
     * 传说中的互动表情
     */
    runPropAction:function(event){
        //seat 接收者的座位号  userId表示发送者的userId  content表示道具的索引值
        var data = event.getUserData();
        //cc.log("data========",JSON.stringify(data));
        var userId = data.userId;
        var seat = data.seat;
        var content = data.content;
        var p = MJRoomModel.getPlayerVo(userId);
        var fromPlayer = this._players[p.seat];
        var targetPlayer = this._players[seat];
        if(fromPlayer._playerVo.userId != targetPlayer._playerVo.userId) {
            var url = "res/res_mj/chat/prop" + content + ".png";
            var prop = new cc.Sprite(url);
            var initX = fromPlayer.getContainer().x;
            var initY = fromPlayer.getContainer().y;
            var x = initX - 20;
            var y = initY - 50;

            prop.setPosition(x, y);
            this.root.addChild(prop,2000);
            initX = targetPlayer.getContainer().x;
            initY = targetPlayer.getContainer().y;
            var targetX = initX - 20;
            var targetY = initY - 50;

            var action = cc.sequence(cc.moveTo(0.3, targetX, targetY), cc.callFunc(function () {
                targetPlayer.playPropArmature(content);
                prop.removeFromParent(true);
            }));
            prop.runAction(action);
        }else{
            targetPlayer.playPropArmature(content);
        }
    },


    updatePlayTuoguan:function(event){
        var data = event.getUserData();
        //cc.log("updatePlayTuoguan===",JSON.stringify(data));
        if(data.length >= 2){
            //var userId = data[0];
            var seat = data[0];
            var isTuoguan = data[1];
            cc.log("seat , isTuoguan" , seat , isTuoguan);
            var player = this._players[seat];
            if(player){
                player.updateTuoguan(isTuoguan);
            }else{
                cc.log("!!!!!!!未获取到player");
            }
            if(seat == MJRoomModel.mySeat && this.bg_CancelTuoguan){
                this.bg_CancelTuoguan.visible = isTuoguan;
            }
            var gap = 5;
            if (data[2] && (data[2] > (this._countDown - gap) || data[2] < (this._countDown - gap))){
                this._countDown = data[2] || 90;
                ////刷新时间显示
                //if(this.countDownLabel){
                //    this.updateCountDown(this._countDown);
                //}
            }

        }
    },

    //出哪些牌可以听哪些牌
    outCardTing:function(event){
        var data = event.getUserData();
        var info = data.info;
        if (info){
            for(var j=0;j < info.length; j++){
                if (info[j].majiangId){
                    var list = info[j].tingMajiangIds;
                    if (list && list.length == 1 && list[0] == 201&& !MJRoomModel.isTCPFMJ() && !MJRoomModel.isTCDPMJ()){
                        list = [];
                        for (var i = 1; i <= 27; i++) {
                            list.push(i);
                        }
                        list.push(201);
                    }
                    var num = 0;
                    for(var lay in this.layouts){
                        num = num + this.layouts[lay].getCardAllNumById(list);
                    }

                    info[j].tingNum =  list.length * 4 - num;
                }
            }
        }

        for(var lay in this.layouts){
            if (lay == 1) {
                this.layouts[lay].outCardTingPai(info);
            }
        }
    },

    //清理可听牌箭头
    clearTingArrows:function(){
        for(var lay in this.layouts){
            if (lay == 1) {
                this.layouts[lay].clearTingArrows();
            }
        }
    },

    //显示可以胡牌的牌
    onShowAllHuCards:function(event){
        var tingData = event.getUserData();
        MJRoomModel.huCards = tingData.huCards || [];
        cc.log("tingData.huCards =",JSON.stringify(tingData.huCards));
        // if (tingData.isShow){
        var self = this;
        if(MJRoomModel.tcpfmj_touAni){
            setTimeout(function(){
                self.onShowHuPanel(1);
            },3000)
        }else{
            this.onShowHuPanel(1);
        }
        // }
    },

    //显示可胡牌层
    onShowHuPanel:function(isShowAllTime){
        // if (this.Panel_hupai){
        //     this.Panel_hupai.visible = !this.Panel_hupai.isVisible();
        //     return
        // }
        var huList = MJRoomModel.huCards;
        // cc.log("isShowAllTime =",isShowAllTime);
        // this.removeHuPanel();
        if (huList && huList.length > 0){
            var scale_num = 0.75;
            this.Panel_hupai.removeAllChildren();
            if (isShowAllTime === 1){
                this.Panel_hupai.visible = true;
            }else{
                this.Panel_hupai.visible = !this.Panel_hupai.isVisible();
            }

            if ((huList.length == 1 && huList[0] == 201 && !MJRoomModel.isTCDPMJ()  && !MJRoomModel.isTCPFMJ()) || huList.length > 14){
                this.Panel_hupai.width = 14 * 90*scale_num + 20;
                this.Panel_hupai.height = 180;
            }else{
                this.Panel_hupai.width = huList.length * 100*scale_num + 20;
                this.Panel_hupai.height = 130;
            }
            if (huList.length == 1 && huList[0] == 201 && !MJRoomModel.isTCDPMJ()  && !MJRoomModel.isTCPFMJ()){
                huList = [];
                for (var i = 1; i <= 27; i++) {
                    huList.push(i);
                }
                huList.push(201);
            }
            //听牌的底


            // var num = Math.ceil(huList.length/4);
            // //添加一个拖动框

            // var scrollViewHeight = 150 - 10;
            // var huCradsList =  new ccui.ScrollView();
            // huCradsList.setTouchEnabled(true);
            // huCradsList.setContentSize(cc.size(400 ,scrollViewHeight));
            // huCradsList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
            // huCradsList.setPosition(0 , 0);
            // // this.Panel_hupai.addChild(huCradsList);
            // huCradsList.setColor(cc.color(60,60,60));
            // huCradsList.jumpToTop();
            // huCradsList.setBounceEnabled(true);
            // huCradsList.setInnerContainerSize(cc.size(this.Panel_hupai.width , num*140));
            // if (huList.length <= 5){
            //     huCradsList.setTouchEnabled(false);
            // }
            // var listSize = huCradsList.getInnerContainerSize();
            // if (huList.length>5){
            //     this.Panel_hupai.width = 370 + (huList.length - 5)*60;
            // }
            for (var i = 0; i < huList.length; i++) {
                var height = Math.floor(i/14);
                var width = Math.floor(i%14);
                var vo = MJAI.getMJDef(huList[i]);
                var card = new AHMahjong(MJAI.getDisplayVo(1, 2), vo);
                card.scale = scale_num;
                var size = card.getContentSize();
                card.x = 10 + width * (size.width*scale_num + 2*scale_num);
                card.y = this.Panel_hupai.height - (size.height + 15) * scale_num - height*(size.height + 5)*scale_num;
                this.Panel_hupai.addChild(card,i+1);
                var num = this.getMahjongNumById(vo);
                var paiNumLabel = new cc.LabelTTF("", "Arial", 40);
                paiNumLabel.setString(num);
                paiNumLabel.y = 15;
                paiNumLabel.x = size.width*0.5;
                paiNumLabel.setColor(cc.color(0,0,0));
                if(MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()){
                    paiNumLabel.setColor(cc.color(168,70,19));
                }
                card.addChild(paiNumLabel);
            }
        }else{
            this.Panel_hupai.removeAllChildren();
            this.Panel_hupai.visible =false;
        }
    },

    //移除可胡牌层
    removeHuPanel:function(){
        if (this.Panel_hupai){
            this.Panel_hupai.removeAllChildren();
            this.Panel_hupai.visible = false;
        }
    },

    getMahjongNumById:function(vo){
        var num = 4;
        // if (MJRoomModel.ahmj_wangID == )
        if (MJRoomModel.ahmj_wangID != -1){
            var cardVo = MJAI.getMJDef(MJRoomModel.ahmj_wangID);
            if (cardVo.n == vo.n){
                num = 3;
            }
        }
        
        var appearNum = 0;
        for(var lay in this.layouts){
            appearNum = appearNum + this.layouts[lay].getCardNumById(vo);
        }
        num = num - appearNum;
        return num;
    },


    //桌面有点击的那张牌时需置灰
    onShowDesktopCards:function(event){
        var card = event.getUserData();
        for(var lay in this.layouts){
            this.layouts[lay].onShowDesktopSameCards(card);
        }
    },

    onHideDesktopCards:function(){
        for(var lay in this.layouts){
            this.layouts[lay].onRemoveLastSameCards();
        }
    },


    updateBgColor:function(color){
        var color = parseInt(color);
        switch (color){
            case 1:
                this.getWidget("Image_bg").loadTexture("res/res_mj/common/bbglv.jpg");
                break;
            case 2:
                this.getWidget("Image_bg").loadTexture("res/res_mj/common/bbgqianlan.jpg");
                break;
            case 3:
                this.getWidget("Image_bg").loadTexture("res/res_mj/common/bbglan.jpg");
                break;
        }
        this.bgColor = color;
        this.updateRoomInfo(color);
    },

    changeBgColor:function(event){
        var temp = event.getUserData();
        this.updateBgColor(temp);
    },

    onBackFromTing:function(){
        this.btn_back.visible = false;
        this.Panel_btn.visible = true;
        MJRoomModel.isTingSelecting = false;
        MJRoomModel.mineLayout.ccCancelTingPai();
        this.Panel_ting.removeAllChildren(true);
        this.Label_ting.visible = this.Panel_ting.visible = false;
    },

    onShowHuCardsByTingPai:function(event){
        var card = event.getUserData();
        var handCards = MJRoomModel.mineLayout.getPlace1Data();
        var allMJs = ArrayUtil.clone(handCards);
        var index = MJAI.findIndexByMJVoC(allMJs,card.c);
        allMJs.splice(index,1);
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var smart = new MajiangSmartFilter();
        var huCards = smart.isHu(allMJs,huBean);
        if(huCards.length>0) {
            this.Panel_ting.removeAllChildren(true);
            var orderNum = 0;
            //this.Label_ting.visible = this.Panel_ting.visible = true;
            this.Label_ting.visible = this.Panel_ting.visible = false;
            for (var i = 0; i < huCards.length; i++) {
                var vo = huCards[i];
                var card = new AHMahjong(MJAI.getDisplayVo(1, 4), vo);
                card.x = orderNum * 27;
                card.y = 0;
                this.Panel_ting.addChild(card);
                orderNum += 1;
                this.tingList.push(card);
            }
        }
    },

    updateGpsBtn:function(){
        if(this.Button_gps){
            this.Button_gps.setBright(true);
        }
    },

    //标记 玩家已经显示了头像
    setRoldPlayerIcon: function(event) {
        var seat = event.getUserData();
        // cc.log("setRoldPlayerIcon seat =",seat);
        var players = MJRoomModel.players;
        for(var i=0;i<players.length;i++) {
            var p = players[i];
            if(p.seat ==seat){
                p.isRoladIcon = 1;
            }
        }
    },

    onCheckResult:function(){
        if(this.resultData){
            var mc = new AHMJSmallResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }
    },

    onJixuFromResult:function(){
        this.Panel_8.visible = false;
        var isBreak = MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ?(ClosingInfoModel.ext[10] == 1):(ClosingInfoModel.ext[9] == 1);
        if(MJRoomModel.totalBurCount == MJRoomModel.nowBurCount || isBreak){
            var mc = new HZMJBigResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }else {
            sySocket.sendComReqMsg(3);
        }
    },


    onGPS: function() {
        PopupManager.addPopup(new GpsPop(MJRoomModel , 4));
    },

    onRoomInfo: function() {
        var mc = new MJRoomInfoPop();
        PopupManager.addPopup(mc);
    },

    onShowSetUp:function(obj,fromTimeOut){
        var self = this;
        if (this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(false);
        }
        if(!fromTimeOut&&this.setUpTimeId>=0){
            clearTimeout(this.setUpTimeId);
            this.setUpTimeId=-1;
        }
        if(!this.Image_setup.visible){
            if(fromTimeOut)
                return;
            this.Image_setup.visible = true;
            this.setUpTimeId = setTimeout(function(){
                self.onShowSetUp(obj,true);
            },10000);
        }else{
            this.Image_setup.visible = false;
        }
        this.Button_setup1.setBright(!this.Image_setup.visible);
    },

    onPlayerInfo:function(obj){
        this._players[obj.temp].showInfo();
    },

    resetBtnPanel:function(){
        for(var i=0;i<100;i++){
            if(!this.Panel_btn.getChildByTag((123+i)))
                break;
            this.Panel_btn.removeChildByTag((123+i));
        }
    },

    onSelectMajiang:function(event){
        var data = event.getUserData();
        this.resetBtnPanel();
        var action = data.action;
        var ids = data.ids;
        MJRoomModel.sendPlayCardMsg(action,ids);
    },

    onCancelSelect:function(){
        if(MJRoomModel.mineLayout){
            var mjs = MJRoomModel.mineLayout.getMahjongs1();
            for(var i=0;i<mjs.length;i++){
                mjs[i].unselected();
            }
        }
        // if (this.Panel_hupai){
        //     this.Panel_hupai.visible = false;
        // }
    },

    onOver:function(event){
        var data = event.getUserData();
        //消息队列还没播完，结算消息过来了，先缓存下来
        if(PlayMJMessageSeq.sequenceArray.length>0){
            PlayMJMessageSeq.cacheClosingMsg(data);
            return;
        }
        MJRoomModel.cxmj_pengMJ = [];
        this.tingList.length=0;
        MJRoomModel.huCards.length = 0;
        var self = this;
        this.resultData = data;
        this.hideTing();
        this.jt.visible = false;
        var closingPlayers = data.closingPlayers;
        for(var i=0;i<closingPlayers.length;i++){
            var p = closingPlayers[i];
            self._players[p.seat].updatePoint(closingPlayers[i].totalPoint);
            this._players[p.seat].setPaoFengImg_TCPFMJ(0);
            var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
            self.getLayout(seq).tanPai(p.handPais);
        }

        if (data.bird && data.bird.length>0){
            var t1 = 100;
            this.overNiaoTimeout = setTimeout(function(){//延迟弹出结算框
                self.showNiaoPanel(data);
            },t1);
        }
            
        if(this.KWMJGangTime){
            clearTimeout(this.KWMJGangTime);
        }

        if(this.KWMJGang_Panel){
            this.KWMJGang_Panel.removeAllChildren();
            this.KWMJGang_Panel.removeFromParent();
            this.KWMJGang_Panel = null;
        }

        var t = 2000;
        this.overTimeout = setTimeout(function(){//延迟弹出结算框
            //self.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            var mc = new AHMJSmallResultPop(data);
            PopupManager.addPopup(mc);
            self.Panel_8.visible = true;
        },t);
        this.removeWangCards();
    
        //if(MJRoomModel.overNiaoIds.length>0) {
        //    setTimeout(function () {
        //        MJRoomEffects.niaoAction(data, self.root);
        //    }, 1500);
        //}
    },

    initData:function(){
        this.removeWangCards();
        this.roomName_label.setString(MJRoomModel.roomName);
        this.initwanfaImg();
        BaseRoom.prototype.initData.call(this);
        if(this.overTimeout) {
            clearTimeout(this.overTimeout);
        }

        if(this.overNiaoTimeout) {
            clearTimeout(this.overNiaoTimeout);
        }

        this.Panel_niaoPai.removeAllChildren(true);
        this.showPiaoBtn(false);
        this.showWaitSelectPiao(false);

        PlayMJMessageSeq.clean();
        this.hideTing();
        this.tingList.length=0;
        this.checkHuResult = [];
        this._effectLayout.cleanData();
        this.updateCountDown(this.COUNT_DOWN);
        this.Image_24.setRotation(MJRoomModel.jtAngle);
        //this.resetCoordByKanBao();
        this.hideAllBanker();
        this.lastLetOutMJ=this.lastLetOutSeat=0;
        this.Label_info0.setString("房号:"+MJRoomModel.tableId);
        this.updateRoomInfo();
        this._players = {};
        var players = MJRoomModel.players;
        for(var i=1;i<=MJRoomModel.renshu;i++){
            this.getWidget("player"+i).visible = false;
            this.getWidget("cp"+i).visible = false;
            this.getWidget("oPanel"+i).removeAllChildren(true);
            if(this.getChildByTag(this.HAIDI_MEIHU+i))
                this.removeChildByTag(this.HAIDI_MEIHU+i);
            var layout = this.layouts[i];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        var isContinue = false;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!isContinue)
                isContinue = (p.handCardIds.length>0 || p.outedIds.length>0 || p.moldCards.length>0);
        }
        this.Panel_btn.visible = this.Panel_8.visible = this.btn_back.visible = false;
        this.btnReady.visible = true;
        this.btnInvite.visible = (players.length<MJRoomModel.renshu);
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
            var cardPlayer = this._players[p.seat] = new AHMJPlayer(p,this.root,seq);
            cardPlayer.showTrusteeship(parseInt(p.ext[3]));//显示托管字样
            var isMoPai = false;
            if(p.ext.length>0){//长春麻将，听牌了
                if(p.ext[0]==1){
                    MJRoomModel.ting(p.seat);
                    this._players[p.seat].tingPai();
                }
                // cc.log("p.ext[1] =",p.ext[1]);
                // cc.log("p.ext[2] =",JSON.stringify(p.ext[2]));
                if(p.ext.length>1 && p.ext[1]===1)//是否摸牌
                    isMoPai = true;
            }

            // var point = -1;
            // if((MJRoomModel.wanfa == GameTypeEunmMJ.HZMJ && MJRoomModel.ext[15] == 1)
            //     || (MJRoomModel.wanfa == GameTypeEunmMJ.TDH && MJRoomModel.ext[8] == 1)){
            //     point = p.ext[3];
            // }
            // cardPlayer.setPiaofen(point);
            // if(!isContinue && p.seat == MJRoomModel.mySeat && point >= 0){
            //     this.showWaitSelectPiao(true);
            // }

            if(!isContinue){
                if(p.status)
                    cardPlayer.onReady();
            }else{//恢复牌局
                var banker = null;
                //if(p.seat==MJRoomModel.nextSeat)
                //    banker= p.seat;


                // MJRoomModel.csmjIsOptXiaoHu = false;
                // if(MJRoomModel.ext[17] == 0){
                //     MJRoomModel.csmjIsOptXiaoHu = true;
                // }
                // cc.log("moldCards =",JSON.stringify(moldCards));
                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.huCards, banker, isMoPai);
                // if(seq == 1 && p.intExts && p.intExts.length > 0){
                //     this.getLayout(1).showXiaoHu(p.intExts);
                // }

                if(p.outCardIds.length>0){//模拟最后一个人出牌
                    this.lastLetOutMJ = p.outCardIds[0];
                    this.lastLetOutSeat = p.seat;
                    this.getLayout(seq).showFinger(this.lastLetOutMJ);
                }
                if(p.recover.length>0){//恢复牌局的状态重设
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        MJRoomModel.banker = p.seat;
                        cardPlayer.isBanker(true);
                    }
                }
                cardPlayer.startGame();

                if(p.ext[6] && p.seat == MJRoomModel.mySeat){
                    this.button_fengDong.visible = false;
                }

                if (MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()){
                    if(p.ext[6] && MJRoomModel.isTCPFMJ()){
                        cardPlayer.setPaoFengImg_TCPFMJ(p.ext[6]);
                    }

                    if(p.ext[8]){
                        // cc.log("p.ext[8] =",p.ext[8]);
                        var direct = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat,p.seat);
                        var arr = [];
                        if(MJRoomModel.ahmj_wangID == 201){
                            arr.push(201+i);
                        }else{
                            arr.push(205+i);
                        }
                        this.layouts[direct].buHua(arr,p.ext[8]);    
                    }
                }

            }
            var isTuoguan = p.ext[3];
            if(p.userId ==PlayerModel.userId){//自己的状态处理
                MJRoomModel.isTrusteeship = p.ext[3];
                //this.Image_cover.visible = (MJRoomModel.isTrusteeship) ? true : false;
                if(p.status){
                    this.btnReady.visible = false;
                }else{
                    // this.btnInvite.visible = false;
                }
                var tingAct = p.recover.splice(2) || [];
                var isTingPai = false;
                if(p.handCardIds.length%3==2){
                    //听牌后，如果有牌没出，重连时，需要把这张牌打出来,需要判断能不能胡
                    if(MJRoomModel.isTing() || MJRoomModel.isHued()){//直接出牌
                        MJRoomModel.needAutoLetOutId = p.handCardIds[p.handCardIds.length-1];
                        //MJRoomModel.sendPlayCardMsg(0,[MJRoomModel.needAutoLetOutId]);
                        if(tingAct.length==0)
                            MJRoomModel.chuMahjong(MJRoomModel.needAutoLetOutId);
                    }else{//检查是否可以听牌
                        //isTingPai = this.checkTingPai(tingAct,true);
                    }
                }
                //cc.log("isTingPai::"+isTingPai+" selfact::"+tingAct);
                if(!isTingPai){
                    var self = this;
                    if(MJRoomModel.tcpfmj_touAni){
                        setTimeout(function(){
                            self.refreshButton(tingAct);
                        },3000)
                    }else{
                        this.refreshButton(tingAct);
                    }
                }

                //判断是否需要显示 取消托管按钮
                // cc.log("判断是否要显示取消托管按钮... " , MJRoomModel.isOpenTuoguan());
                if(MJRoomModel.isOpenTuoguan() && this.bg_CancelTuoguan){
                    var isMeTuoguan = MJRoomModel.getPlayerIsTuoguan(p);;
                    this.bg_CancelTuoguan.visible = isMeTuoguan;

                }
            }
            cardPlayer.updateTuoguan(isTuoguan);
        }
        //IP相同的显示
        if(players.length>1 && MJRoomModel.renshu != 2){
            var seats = MJRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if (p.userId == PlayerModel.userId && p.handCardIds.length > 0) {
                if(!MJRoomModel.isTingHu() || (MJRoomModel.isTingHu() && MJRoomModel.isTing())) {
                    this.startCheckHu();
                }
            }
        }
        if(isContinue){
            if(MJRoomModel.ext[4] && MJRoomModel.ext[4] > 0){
                var vo = MJAI.getMJDef(MJRoomModel.ext[4]);
                this.removeWangCards();
                this.showLiangWangAni(MJRoomModel.ext[4]);
            }
            if(MJRoomModel.nextSeat)
                this.showJianTou();
            else
                this.showJianTou(-1);
            this.btnInvite.visible = false;
        }else{
            //if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ){
                if (players.length>1 && MJRoomModel.renshu != 2 && MJRoomModel.nowBurCount == 1)
                    PopupManager.addPopup(new GpsPop(MJRoomModel , MJRoomModel.renshu));
            //}

            this.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            this.jt.visible = false;
        }
        this.removeHuPanel();
    },

    showCXMJ_chooseGang:function(){
        if(this.CXMJGang_Panel){
            this.CXMJGang_Panel.removeAllChildren();
            this.CXMJGang_Panel.removeFromParent();
            this.CXMJGang_Panel = null;
        }

        var bg = new cc.Scale9Sprite("res/res_mj/mjRoom/img_ting1.png");
        this.CXMJGang_Panel = bg;
        this.Panel_20.addChild(bg,2145);
        this.CXMJGang_Panel.width = 280;
        this.CXMJGang_Panel.height = 150;
        this.CXMJGang_Panel.setAnchorPoint(0.5,0.5);
        this.CXMJGang_Panel.x = 640;
        this.CXMJGang_Panel.y = 340;

        var btn_siTong = new ccui.Button();
        btn_siTong.setTouchEnabled(true);
        btn_siTong.setPressedActionEnabled(true);
        btn_siTong.loadTextures("res/res_mj/res_ahmj/cxmjRoom/button_siTong.png","","");
        UITools.addClickEvent(btn_siTong,this,this.onCXMJchooseGang);
        btn_siTong.x = 60;
        btn_siTong.y = 70;
        btn_siTong.temp = 1004;
        this.CXMJGang_Panel.addChild(btn_siTong);

        var btn_wuTongTong = new ccui.Button();
        btn_wuTongTong.setTouchEnabled(true);
        btn_wuTongTong.setPressedActionEnabled(true);
        btn_wuTongTong.loadTextures("res/res_mj/res_ahmj/cxmjRoom/button_wuTong.png","","");
        UITools.addClickEvent(btn_wuTongTong,this,this.onCXMJchooseGang);
        btn_wuTongTong.x = 220;
        btn_wuTongTong.y = 70;
        btn_wuTongTong.temp = 1005;
        this.CXMJGang_Panel.addChild(btn_wuTongTong);
    },
    onCXMJchooseGang:function(obj){
        // cc.log("obj.temp=",obj.temp);
        sySocket.sendComReqMsg(2045,[obj.temp]);
    },
    showNiaoPanel:function(data){
        this.Panel_niaoPai.removeAllChildren();
        this.Panel_niaoPai.setPosition(960,540);

        var birdList = data.bird;
        var birdSeat = data.birdSeat;

        var iszimo = true;
        var hasXiaohu = false;
        for(var i = 0;i<data.closingPlayers.length;++i){
            if(data.closingPlayers[i].fanPao)iszimo = false;
            if(data.closingPlayers[i].xiaohus && data.closingPlayers[i].xiaohus.length > 0)hasXiaohu = true;
        }
        if(hasXiaohu)iszimo = true;

        var showSeatArr = [];
        for(var i = 0;i<data.closingPlayers.length;++i){
            if(MJRoomModel.renshu == 2 && (GameTypeEunmMJ.KWMJ == MJRoomModel.wanfa || MJRoomModel.isYYNXMJ())){
                showSeatArr.push(data.closingPlayers[i].seat);
            }else{
               if(iszimo || data.closingPlayers[i].fanPao || data.closingPlayers[i].isHu){
                    showSeatArr.push(data.closingPlayers[i].seat);
                } 
            } 
        }

        var birdData = [[],[],[],[]];
        for(var i = 0;i<birdList.length;++i){
            var seat = birdSeat[i] || 0;
            var dir = 1;
            if(seat == 0){
                if(MJRoomModel.renshu == 3)dir = 3;
                if(MJRoomModel.renshu == 2)dir = 4;
            }else{
                var seq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat);
                var dirArr = [1,2,3,4];
                if(MJRoomModel.renshu == 3)dirArr = [1,2,4];
                if(MJRoomModel.renshu == 2)dirArr = [1,3];
                dir = dirArr[seq - 1];
            }
            if(dir >= 1 && dir <= 4){
                birdData[dir-1].push({id:birdList[i],seat:seat});
            }

        }

        var offsetX = 150;
        var offsetY = 140;
        for(var i = 0;i<birdData.length;++i){
            var dirBird = birdData[i];
            var startX = -offsetX/2;
            var startY = -offsetY/2;
            if(i == 0)startX -= (dirBird.length - 1)/2*offsetX;
            if(i == 1)startX += 700;
            if(i == 2)startX += (dirBird.length - 1)/2*offsetX;
            if(i == 3)startX -= 700;

            if(i == 0)startY -= 360;
            if(i == 1)startY += dirBird.length > 3?offsetY/2:0;
            if(i == 2)startY += 360;
            if(i == 3)startY += dirBird.length > 3?offsetY/2:0;

            var pos = cc.p(0,0);
            for(var j = 0;j<dirBird.length;++j){
                if(i == 0){
                    pos.x = startX + j*offsetX;
                    pos.y = startY;
                }
                if(i == 1){
                    pos.x = startX - (j%3)*offsetX;
                    pos.y = startY - Math.floor(j/3)*offsetY;
                }
                if(i == 2){
                    pos.x = startX - j*offsetX;
                    pos.y = startY;
                }
                if(i == 3){
                    pos.x = startX + (j%3)*offsetX;
                    pos.y = startY - Math.floor(j/3)*offsetY;
                }

                var vo = MJAI.getMJDef(dirBird[j].id);
                var card = new AHMahjong(MJAI.getDisplayVo(1, 1), vo);
                if(ArrayUtil.indexOf(showSeatArr,dirBird[j].seat) >= 0){
                    card._bg.setColor(cc.color.YELLOW);
                }
                this.Panel_niaoPai.addChild(card, 6);
                card.runAction(cc.moveTo(0.3,pos));
            }
        }

        var znSprite = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_24.png");
        znSprite.setPosition(0,50);
        this.Panel_niaoPai.addChild(znSprite, 5);

    },

    updateCountDown:function(number){
        this._countDown = number;
        var countDown = (this._countDown<10) ? "0"+this._countDown : ""+this._countDown;
        this.countDownLabel.setString(countDown);
        //if(this.jt.visible&&this._countDown>=0&&this._countDown<=3){
        //    AudioManager.play("res/audio/common/timerEffect.mp3");
        //}
    },

    update:function(dt){
        this._dt += dt;
        PlayMJMessageSeq.updateDT(dt);
        if(this._dt>=1){
            this.updateJSQ();
            this._dt = 0;
            if(this._countDown >= 0 && this.countDownLabel  && !ApplyExitRoomModel.isShow){
                this.updateCountDown(this._countDown);
                this._countDown--;
            }
            this._timedt+=1;
            if(this._timedt%60==0)
                this.calcTime();
            if(this._timedt>=180){
                this._timedt = 0;
                this.calcWifi();
            }
        }
        this.onCheckHuByPutOut();
        if(this.isTingPai) {
            this.onCheckHuByBaoTing();
        }
    },

    startCheckTing:function(){
        MJCheckStage.clean();
        MJRoomModel.nearestTingResult.length = 0;
        this.isTingPai = true;
        this.checkTingNum = 0;
        this.curIndex = 0;
    },

    startCheckHu:function(){
        this.isCheckHu = true;
        this.curIndex = 0;
        this.checkHuResult.length = 0;
    },

    //听牌
    onCheckHuByBaoTing:function(){
        var start = new Date().getTime();
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var hu = new MajiangSmartFilter();
        var result = hu.checkTing(data1, huBean,false,this.checkTingNum,this.curIndex);
        this.curIndex += MJAI.LANZHOU_CHECK_NUMS;
        if(this.curIndex >= MJAI.MJ.length) {
            this.curIndex = 0;
            this.checkTingNum++;
        }
        if(result.length>0){
            ArrayUtil.merge(result,MJRoomModel.nearestTingResult);
        }
        if(this.checkTingNum > data1.length){
            this.isTingPai = false;
            this.Panel_btn.visible = false;
            this.btn_back.visible = true;
            MJRoomModel.mineLayout.ccTingPaiByGC();
        }
        //cc.log("onCheckHuByBaoTing cost time:::::::"+(new Date().getTime()-start));
    },

    //出牌检测
    onCheckHuByPutOut:function(){
        if(this.isCheckHu){
            var start = new Date().getTime();
            var huBean = new MajiangHuBean();
            var allMJs = MJRoomModel.mineLayout.getPlace1Data();
            if(allMJs.length % 3 == 2){
                allMJs = ArrayUtil.clone(allMJs);
                allMJs.pop();
            }
            huBean.setFuPaiType(MJRoomModel.getFuType());
            huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
            huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
            var smart = new MajiangSmartFilter();
            var list = smart.findHuCards(allMJs,huBean,false,this.curIndex);
            if(list.length > 0) {
                ArrayUtil.merge(list, this.checkHuResult);
            }
            this.isCheckHu = false;
            this.onShowHuCards(this.checkHuResult);
        }
    },


    onShowHuCards:function(huArray){
        this.Panel_ting.removeAllChildren(true);
        this.tingList.length=0;
        if(huArray.length>0){
            this.Panel_ting.removeAllChildren(true);
            var orderNum = 0;
            this.Label_ting.visible = this.Panel_ting.visible = false;
            //this.Label_ting.visible = this.Panel_ting.visible = true;
            for(var key in huArray){
                var vo = huArray[key];
                //vo.tingDisplay = 1;
                var card = new AHMahjong(MJAI.getDisplayVo(1,4),huArray[key]);
                card.x = orderNum*27;
                card.y = 0;
                this.Panel_ting.addChild(card);
                orderNum += 1;
                this.tingList.push(card);
            }
            MJRoomModel.setLocalBySmartFitler(huArray);
        }else{
            this.hideTing();
        }
    },


    ////取消托管
    //unTrusteeship:function(){
    //    MJRoomModel.isTrusteeship = 0;
    //    //this.Image_cover.visible = false;
    //    sySocket.sendComReqMsg(203,[0]);
    //},
    //
    ////设置是否托管
    //onSetIsTrusteeship:function(event){
    //    var data = event.getUserData(); //[status,seat]
    //    MJRoomModel.isTrusteeship = data[0];
    //    if(data[1]==MJRoomModel.mySeat){
    //        //this.Image_cover.visible = (MJRoomModel.isTrusteeship==1) ? true : false;
    //    }
    //    this._players[data[1]].showTrusteeship(MJRoomModel.isTrusteeship);
    //},

    /**
     * 检查听牌
     * @param selfAct
     */
    checkTingPai:function(selfAct,isMoPai){
        if (!MJRoomModel.isTingHu()) {
            return false;
        }
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var isTing = false;
        if(data1.length%3==2 && !MJRoomModel.isTing()){
            var huBean = new MajiangHuBean();
            huBean.setFuPaiType(MJRoomModel.getFuType());
            huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
            huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
            var result = MJAI.isTingPai(data1,huBean,isMoPai);
            if(result&&result.length>0){
                //将结果缓存下
                //MJRoomModel.nearestTingResult = result;
                if(selfAct.length>0){
                    selfAct[7] = 1;
                }else{
                    selfAct = [0,0,0,0,0,0,0,1,0];
                }
                isTing = true;
                this.refreshButton(selfAct);
                if(!MJRoomModel.isGuCang()) {
                    MJRoomModel.mineLayout.ccTingPai();
                }
            }
        }
        return isTing;
    },

    updateRemain:function(){
        this.Image_info2.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF("剩"+MJRoomModel.remain+"张", "", 32);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo("剩",cc.color("#AFD1BA"),32));
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.remain+"",cc.color("#f6c143"),32));
        ele1.push(RichLabelVo.createTextVo("张",cc.color("#AFD1BA"),32));
        var label = new RichLabel(cc.size(120,40));
        label.setLabelString(ele1);
        label.x = (this.Image_info2.width-textRenderer.getContentSize().width)/2;
        label.y = 24;
        this.Image_info2.addChild(label,1,999);
        if (MJRoomModel.remain == 4) {
            //var winSize = cc.director.getWinSize();
            //var last4 = new cc.Sprite("res/res_mj/res_ahmj/ahmjRoom/last4.png");
            //last4.x = winSize.width/2+42;
            //last4.y = winSize.height/2;
            //this.root.addChild(last4,9999);
            //last4.runAction(cc.sequence(cc.delayTime(3),cc.fadeOut(2),cc.callFunc(function() {
            //    last4.removeFromParent(true);
            //})));
            FloatLabelUtil.comText("最后四张");
        }
    },

    onChangeStauts:function(event){
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        this._players[seat].onReady();
        if(seat == this.getModel().mySeat){
            var me = MJRoomModel.getPlayerVo();
            me.status = params[1];
            this.btnReady.visible = false;
            this.btnInvite.visible = (ObjectUtil.size(this._players)<MJRoomModel.renshu);
        }
    },

    getFontColorByBgColor:function(bgColor){
        var bgColor = parseInt(bgColor);
        var fontColor = [];
        switch (bgColor){
            case 1:
                fontColor = ["#fcdd31","#4fda9b"];
                break;
            case 2:
                fontColor = ["#fbdd31","#3cf1ef"];
                break;
            case 3:
                fontColor = ["#f6ff4e","#6e4114"];
                break;
            default :
                fontColor = ["#fcdd31","#4fda9b"];
                break;
        }
        return fontColor;
    },


    updateRoomInfo:function(color){
        var color = color || this.bgColor;
        var fontColor = this.getFontColorByBgColor(color);
        this.Label_info_mj.setColor(cc.color(fontColor[1]));
        this.updateRemain();
        var zuizi = MJRoomModel.getZuiZiName(MJRoomModel.getFuType());
        //var wa = MJRoomModel.getHuCountName(MJRoomModel.getHuCountConf());
        var jifen = MJRoomModel.getJiFenName(MJRoomModel.getJiFenConf());
        var cp = MJRoomModel.getChiPengName(MJRoomModel.getChiPengConf());
        var ting = MJRoomModel.getTingHuName(MJRoomModel.getTingHuConf());
        var jianglei = MJRoomModel.getJiangLeiName(MJRoomModel.getJiangLeiConf());
        var gangjiafan = MJRoomModel.getKeXuanName(1);
        //this.Label_info_mj.setString(csvhelper.strFormat("{0} {1} {2} {3} {4} {5}",zuizi,cp,jianglei,ting,jifen,gangjiafan));
        this.Label_info_mj.setString("")
        this.Image_info1.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF(MJRoomModel.nowBurCount+"/"+MJRoomModel.totalBurCount+"局", "", 32);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.nowBurCount+"",cc.color(246,193,67),32));
        ele1.push(RichLabelVo.createTextVo("/"+MJRoomModel.totalBurCount+"局",cc.color("#AFD1BA"),32));
        var label = new RichLabel(cc.size(300,40),1);
        label.setLabelString(ele1);
        label.x = (this.Image_info1.width-textRenderer.getContentSize().width)/2;
        label.y = 24;
        this.Image_info1.addChild(label,1,999);
    },

    displaySelectMahjongsForCXMJ:function(action,resultArray){
        if(this.Panel_btn.getChildByTag(123))
            this.Panel_btn.removeChildByTag(123);
        //服务器只发了一张牌 但是要画四张牌 自己添加数据
        if(action == MJAction.GANG){
            for (var i = 0; i < resultArray.length; i++) {
                if(resultArray[i].length == 1){
                    for (var j = 0; j < 3; j++) {
                        resultArray[i].push(resultArray[i][0]);
                    }
                }
            }
        }
        // cc.log("resultArray =",JSON.stringify(resultArray));
        var totalCount = 0;
        for(var i=0;i<resultArray.length;i++){
            totalCount += resultArray[i].length;
        }
        var scale = 1;
        var bg = new cc.Scale9Sprite("res/res_mj/mjRoom/img_50.png");
        bg.anchorX=bg.anchorY=0
        bg.setContentSize(totalCount*75*scale+(25*(resultArray.length+1)),136*scale + 60);
        if(bg.width>this.Panel_btn.width){
            bg.x = this.Panel_btn.width-bg.width;
        }else{
            bg.x = this.Panel_btn.width-bg.width-100;
        }
        bg.y = 240;
        var count = 0;

        var tipLabel = new UICtor.cLabel("请点击麻将选择要操作的牌",42);
        tipLabel.setPosition(bg.width/2,bg.height - 20);
        tipLabel.setColor(cc.color.YELLOW);
        bg.addChild(tipLabel,1);

        for(var i=0;i<resultArray.length;i++){
            var chiArr = resultArray[i];
            var initX = (i+1)*25;
            for(var j=0;j<chiArr.length;j++){
                var chiVo = chiArr[j];
                chiVo.se = chiVo.se || action;
                if(action==MJAction.CHI){
                    chiVo.ids = [chiArr[0].c,chiArr[2].c];
                }else if(action==MJAction.XIA_DAN || action == MJAction.AN_GANG || action == MJAction.BU_ZHANG || action == 14) {
                    var danIds = [];
                    for (var d = 0; d < chiArr.length; d++) {
                        danIds.push(chiArr[d].c);
                    }
                    chiVo.ids = danIds;
                }else if(action == MJAction.GANG) {
                    var danIds = [];
                    chiVo.ids = [chiArr[0].c];
                }else{
                    chiVo.ids = [chiArr[0].c];
                }
                var mahjong = new AHMahjong(MJAI.getDisplayVo(1,3),chiVo);
                mahjong.scale=scale;
                mahjong.x = initX+75*scale*count;mahjong.y = 3;
                bg.addChild(mahjong);
                if(action==MJAction.CHI && j==1){
                    mahjong._bg.setColor(cc.color.YELLOW);
                }
                count++;
            }
        }
        this.Panel_btn.addChild(bg,1,123);
    },
    /**
     * 吃、杠牌等操作需要选择时的展示
     * @param action
     * @param resultArray {Array.<Array.<MJVo>>}
     * @param totalCount
     */
    displaySelectMahjongs:function(action,resultArray){
        if(this.Panel_btn.getChildByTag(123))
            this.Panel_btn.removeChildByTag(123);
        var totalCount = 0;
        for(var i=0;i<resultArray.length;i++){
            totalCount += resultArray[i].length;
        }
        var scale = 1;
        var bg = new cc.Scale9Sprite("res/res_mj/mjRoom/img_50.png");
        bg.anchorX=bg.anchorY=0;
        bg.setContentSize(totalCount*75*scale+(25*(resultArray.length+1)),136*scale + 60);
        if(bg.width>this.Panel_btn.width){
            bg.x = this.Panel_btn.width-bg.width;
        }else{
            bg.x = this.Panel_btn.width-bg.width-100;
        }
        bg.y = 240;
        var count = 0;

        var tipLabel = new UICtor.cLabel("请点击麻将选择要操作的牌",42);
        tipLabel.setPosition(bg.width/2,bg.height - 20);
        tipLabel.setColor(cc.color.YELLOW);
        bg.addChild(tipLabel,1);

        for(var i=0;i<resultArray.length;i++){
            var chiArr = resultArray[i];
            var initX = (i+1)*25;
            for(var j=0;j<chiArr.length;j++){
                var chiVo = chiArr[j];
                chiVo.se = chiVo.se || action;
                if(action==MJAction.CHI){
                    chiVo.ids = [chiArr[0].c,chiArr[2].c];
                }else if(action==MJAction.XIA_DAN || action == MJAction.AN_GANG
                    || action == MJAction.GANG || action == MJAction.BU_ZHANG || action == 14) {
                    var danIds = [];
                    for (var d = 0; d < chiArr.length; d++) {
                        danIds.push(chiArr[d].c);
                    }
                    chiVo.ids = danIds;
                }else{
                    chiVo.ids = [chiArr[0].c];
                }
                var mahjong = new AHMahjong(MJAI.getDisplayVo(1,3),chiVo);
                mahjong.scale=scale;
                mahjong.x = initX+75*scale*count;mahjong.y = 3;
                bg.addChild(mahjong);
                if(action==MJAction.CHI && j==1){
                    mahjong._bg.setColor(cc.color.YELLOW);
                }
                count++;
            }
        }
        this.Panel_btn.addChild(bg,1,123);
    },

    CXMJ_gang:function(message){
        // cc.log("message =",JSON.stringify(message));
        var data = message.getUserData();
        var strParams = data.strParams;
        // cc.log("strParams =",JSON.stringify(strParams));
        this.cxmj_gangMJ = [];
        var intarr = [];
        var arr = strParams[0].split(";");
        // cc.log("arr =",JSON.stringify(arr));
        for (var i = 0;i<arr.length;i++){
            intarr.push(arr[i].split(","));
        }
        // cc.log("intarr =",JSON.stringify(intarr));
        for (var i = 0;i<intarr.length;i++){
            this.cxmj_gangMJ[i] = [];
            for (var j =0;j < intarr[i].length;j++){
                this.cxmj_gangMJ[i].push(MJAI.getMJDef(intarr[i][j]));
            }
        }
        // cc.log("this.cxmj_gangMJ =",JSON.stringify(this.cxmj_gangMJ));
    },
    /**
     * 吃碰杠胡操作
     * @param obj
     * @param isAlert
     */
    onOperate:function(obj,isAlert){
        isAlert = isAlert || false;
        var self =this;
        var temp = obj.temp;
        switch (temp){
            case 98:
                MJRoomModel.sendPlayCardMsg(98,[]);
                break;
            case MJAction.HU:
                MJRoomModel.sendPlayCardMsg(1,[]);
                break;
            case MJAction.TING:
                MJRoomModel.nextSeat = MJRoomModel.mySeat;
                MJRoomModel.isTingSelecting = true;
                MJRoomModel.nearestTingResult.length = 0;
                this.Panel_btn.visible = false;
                this.btn_back.visible = true;
                this.findPutOutByTing();
                //this.startCheckTing();
                break;
            case MJAction.PENG:
            case MJAction.GANG:
            case MJAction.AN_GANG:
            case MJAction.BU_ZHANG:
                //cc.log("MJAction.GANG==========",MJAction.GANG)
                var optFunc = function(){
                    var ids = [];
                    var myLayout = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId));
                    var allMJs = myLayout.getPlace1Data();
                    if(allMJs.length%3==2 || (MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ && temp != MJAction.PENG)){//摸牌了，手上的牌和摊开的牌都需要找一遍
                        var result = MJAI.getGang(allMJs,myLayout.getPlace2Data(),obj.temp1?obj.temp1:temp);
                        if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ)
                            result = this.cxmj_gangMJ || result;
                        if(result.length>1){
                            if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ){
                                this.displaySelectMahjongsForCXMJ(obj.temp1?obj.temp1:temp,result);
                            }else{
                                this.displaySelectMahjongs(obj.temp1?obj.temp1:temp,result);
                            }
                        }else{
                            var result0 = result[0];
                            for(var i=0;i<result0.length;i++){
                                ids.push(result0[i].c);
                            }
                            MJRoomModel.sendPlayCardMsg(obj.temp1?obj.temp1:temp,ids);
                        }
                    }else{//别人出牌,我可以碰、杠
                        var lastVo = MJAI.getMJDef(this.lastLetOutMJ);
                        if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ && temp != MJAction.PENG )
                            lastVo = this.cxmj_gangMJ || lastVo;

                        for(var i=0;i<allMJs.length;i++){
                            var vo = allMJs[i];
                            if(vo.t==lastVo.t&&vo.n==lastVo.n)
                                ids.push(vo.c);
                            if(ids.length>=temp)
                                break;
                        }
                        MJRoomModel.sendPlayCardMsg(temp,ids);
                    }
                }.bind(this);

                var optName = "碰";
                if(temp == MJAction.GANG || temp == MJAction.AN_GANG){
                    optName = "杠";
                }else if(temp == MJAction.BU_ZHANG){
                    optName = "补";
                }
                if(obj.hasHu && !MJRoomModel.isTCPFMJ()){
                    AlertPop.show("当前为可胡牌状态，确定要选择【" + optName + "】吗？", function () {
                        optFunc();
                    });
                }else{
                    optFunc();
                }

                break;
            case MJAction.GUO:
                var allButtons = [];
                for(var i=0;i<MJRoomModel.selfAct.length;i++){
                    if(MJRoomModel.selfAct[i]==1)
                        allButtons.push(i);
                }

                var allMJs = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
                var guoParams = (allMJs.length % 3 == 2) ? [1] : [0];
                ArrayUtil.merge(MJRoomModel.selfAct, guoParams);
                if (obj.hasHu && !MJRoomModel.isTCPFMJ()) {
                    //Network.logReq("MJRoom::guo click...1");
                    AlertPop.show("当前为可胡牌状态，确定要选择【过】吗？", function () {
                        //Network.logReq("MJRoom::guo click...2");
                        MJRoomModel.sendPlayCardMsg(5, guoParams);
                    });
                }else if(obj.hasXiaohu){
                    AlertPop.show("当前可以小胡，确定要选择【过】吗？", function () {
                        MJRoomModel.sendPlayCardMsg(5, guoParams);
                    });
                } else {
                    //Network.logReq("MJRoom::guo click...3");
                    MJRoomModel.sendPlayCardMsg(5, guoParams);
                }

                break;
            case MJAction.CHI:
                var chiFunc = function(){
                    var lastVo = MJAI.getMJDef(this.lastLetOutMJ);
                    var chi = MJAI.getChi(MJRoomModel.mineLayout.getPlace1Data(),lastVo);

                    if(chi.length>1){
                        this.displaySelectMahjongs(MJAction.CHI,chi);
                    }else{
                        var ids = [];
                        var array = chi[0];
                        for(var i=0;i<array.length;i++){
                            var vo = array[i];
                            if(vo.n!=lastVo.n)
                                ids.push(vo.c);
                        }
                        MJRoomModel.sendPlayCardMsg(6,ids);
                    }
                }.bind(this);

                if(obj.hasHu){
                    AlertPop.show("当前为可胡牌状态，确定要选择【吃】吗？", function () {
                        chiFunc();
                    });
                }else{
                    chiFunc();
                }
                break;
            case MJAction.XIAO_HU:
                var ids = [obj.flag];
                MJRoomModel.sendPlayCardMsg(8,ids);
                break;
        }
    },

    hideAllBanker:function(){
        for(var key in this._players){
            this._players[key].isBanker(false);
        }
    },
    updateJSQ:function(){
        //if(!this.startJS) return;
        //var newTime =  new Date().getTime();
        //if((newTime-this.startTime)<60*1000)
        //    return;
        //this.startTime =newTime;
        //this.jsqFen ++;
        //if(this.jsqFen>=60){
        //    this.jsqShi ++;
        //    this.jsqFen = 0;
        //}
        //var strShi = (this.jsqShi<10)?"0"+this.jsqShi:this.jsqShi;
        //var strFen = (this.jsqFen<10)?"0"+this.jsqFen:this.jsqFen;
        //this.Label_jsq.setString("计时器\n"+strShi+":"+strFen);
    },
    showTouZiAni:function(dealDice) {
        MJRoomModel.tcpfmj_touAni = true;
        // dealDice = 11;
        var secondNum = dealDice%10; // 第二个点数取个位数
        var firstNum = Math.floor(dealDice/10) ;// 第一个点数取十位数
        var numPic1 = new cc.Sprite("res/res_mj/res_ahmj/tcmjRoom/touzi_0_"+firstNum+".png");
        this.addChild(numPic1,100,9998);
        numPic1.setPosition(930,540);
        var numPic2 = new cc.Sprite("res/res_mj/res_ahmj/tcmjRoom/touzi_0_"+secondNum+".png");
        this.addChild(numPic2,100,9997);
        numPic2.setPosition(1020,540)
        numPic1.visible = numPic2.visible = false;

        var self = this;

        var callBack = function () {
            numPic1.visible = numPic2.visible = true;
            setTimeout(function(){
                self.removeChildByTag(9998);
                self.removeChildByTag(9997);
                for (var i = 1; i <= MJRoomModel.renshu; i++) {
                    self.getWidget("mPanel"+i).visible = true;     
                }
                MJRoomModel.tcpfmj_touAni = false;
                self.showLiangWangAni(MJRoomModel.ahmj_wangID,true);
            },2000)
        }
        var shuffleAni = new AnimateSprite("res/plist/tcmj_touzi.plist","tcmj_touz",1/18);
        shuffleAni.x = 735;
        shuffleAni.y = 720;
        shuffleAni.setCallBack(function(){
            self.removeChildByTag(999);
            callBack();
            callBack = null;
        },this);
        shuffleAni.play();
        AudioManager.play("res/res_mj/audio/tcmj/shaizi.mp3");
        shuffleAni.runAction(cc.moveBy(1,cc.p(300,-255)))
        this.addChild(shuffleAni,100,999);
    },

    startGame:function(event){
        //this.Label_info_mj.y = 160;
        if (MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ)
            this.button_fengDong.visible = true;
        MJRoomModel.cxmj_pengMJ = [];
        if(this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(false);
        }
        this.Panel_niaoPai.removeAllChildren();
        this.startTime = new Date().getTime();
        this.startJS = true;
        //this.Label_jsq.visible = true;
        this.tingList.length=0;
        this.lastLetOutMJ=this.lastLetOutSeat=0;
        this.updateRoomInfo();
        for(var i=1;i<=MJRoomModel.renshu;i++){
            this.getWidget("oPanel"+i).removeAllChildren(true);
            var layout = this.layouts[i];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        this.btnInvite.visible = this.btnReady.visible =false;
        var p = event.getUserData();
        // cc.log(" p =",JSON.stringify(p));
        // cc.log(" p.laiZiVal =",JSON.stringify(p.laiZiVal));
        var isShowTouziAni = p.dealDice && p.dealDice > 10
        if(p.laiZiVal){
            this.removeWangCards();
            if(!MJRoomModel.isTCPFMJ() || !isShowTouziAni)
                this.showLiangWangAni(p.laiZiVal,true);
            MJRoomModel.ahmj_wangID = p.laiZiVal;  
        }
        this.showJianTou();
        this.updateCountDown(this.COUNT_DOWN);
        var direct = MJRoomModel.getPlayerSeq(PlayerModel.userId,MJRoomModel.mySeat,MJRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        if(MJRoomModel.isTCPFMJ() && isShowTouziAni){
            for (var i = 1; i <= MJRoomModel.renshu; i++) {
                this.getWidget("mPanel"+i).visible = false;     
            }
            this.showTouZiAni(p.dealDice);
        }
        this.hideAllBanker();
        this._players[p.banker].isBanker(true);
        //其他3人手上的牌
        for(var i=1;i<=MJRoomModel.renshu;i++){
            if(i != MJRoomModel.mySeat){
                var d = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,i);
                var iseat = (i==p.banker) ? i : null;
                this.initCards(d,[],[],[],[],iseat);
            }
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
        var isTing = false;
        //if(p.handCardIds.length%3==2)
        //    isTing = this.checkTingPai(p.selfAct,true);
        if(!isTing){
            var self = this;
            if(MJRoomModel.tcpfmj_touAni){
                setTimeout(function(){
                    self.refreshButton(p.selfAct);
                },3000)
            }else{
                this.refreshButton(p.selfAct);
            }
        }

        MJRoomModel.csmjIsOptXiaoHu = false;
        this.showPiaoBtn(false);
        this.showWaitSelectPiao(false);
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
            this.piaofenTime = null;
        }
    },

    removeWangCards:function () {
        if(this.wang_card){
            this.wang_card.removeFromParent();
            this.wang_card = null;
        }
        
        if (this.chunwang_card1){
            this.chunwang_card1.removeFromParent();
            this.chunwang_card1 = null;
        }
        if(this.chunwang_card2){
            this.chunwang_card2.removeFromParent();
            this.chunwang_card2 = null;
        }
    },

    showZhuanPai:function(id,isShowAni){
        var vo = MJAI.getMJDef(id);
        var first_wang = vo.n + 1;
        if(vo.t !=4 ){
            if(first_wang == 10)first_wang = 1;
        }else{
            if(first_wang == 5)first_wang = 1;
            if(first_wang == 12)first_wang = 9;
        }
        var vo1 = MJAI.getMJDef(id);
        vo1.n = first_wang;
        vo1.zhuan = 1;
        if(isShowAni){
            var actionVo = new AHMahjong(MJAI.getDisplayVo(1, 1), vo);
            actionVo.y = 600;
            actionVo.x = 960;
            actionVo.setAnchorPoint(0.5,0);
            actionVo.setScale(1.15);
            this.Panel_20.addChild(actionVo,999);
            var self = this;
            var action = cc.sequence(cc.delayTime(0.5),cc.scaleTo(0.5,0,0),cc.delayTime(0.2),cc.callFunc(function(){
                actionVo.visible = false;
                actionVo.removeFromParent();
                self.createZhuanPai(vo1);
            }));
            actionVo.runAction(action);
        }else{
            this.createZhuanPai(vo1);
        }
    },

    createZhuanPai:function(vo1){
        if(this.wang_card){
            this.wang_card.removeFromParent();
            this.wang_card = null;
        }
        this.wang_card = new AHMahjong(MJAI.getDisplayVo(1, 1), vo1);
        this.wang_card.y = 530;
        this.wang_card.x = 1060;
        this.wang_card.scale = 0.6;
        this.Panel_20.addChild(this.wang_card,999);
    },
    /**
     *
     * @param selfAct {Array.<number>}
     */
    showLiangWangAni:function(id,isShowAni){
        if(MJRoomModel.isTCPFMJ()){
            if(!MJRoomModel.tcpfmj_touAni)
                this.showZhuanPai(id,isShowAni);
        }else{
            this.showWangPai(id);
        }
    },
    showWangPai:function (id) {
        var vo = MJAI.getMJDef(id);
        if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            if(MJRoomModel.intParams[4] == 1){
                vo.chunwang = 1;
            }else{
                vo.zhengwang = 1;
                var first_wang = vo.n + 1;
                var second_wang = vo.n - 1;
                if(first_wang == 10)first_wang = 1;
                if(second_wang == 0)second_wang = 9;

                var vo1 = MJAI.getMJDef(id);
                vo1.n = first_wang;
                vo1.chunwang = 1;
                var vo2 = MJAI.getMJDef(id);
                vo2.n = second_wang;
                vo2.chunwang = 1;
                this.chunwang_card1 = new AHMahjong(MJAI.getDisplayVo(1, 1), vo1);
                this.chunwang_card1.y = 530;
                this.chunwang_card1.x = 787;
                this.chunwang_card1.scale = 0.6;
                this.Panel_20.addChild(this.chunwang_card1,999);

                this.chunwang_card2 = new AHMahjong(MJAI.getDisplayVo(1, 1), vo2);
                this.chunwang_card2.y = 530;
                this.chunwang_card2.x = 705;
                this.chunwang_card2.scale = 0.6;
                this.Panel_20.addChild(this.chunwang_card2,999);
            }
        }
        this.wang_card = new AHMahjong(MJAI.getDisplayVo(1, 1), vo);
        this.wang_card.y = 530;
        this.wang_card.x = 1060;
        this.wang_card.scale = 0.6;
        this.Panel_20.addChild(this.wang_card,999);
    },

    refreshButton:function(selfAct){
        // cc.log("selfAct =",JSON.stringify(selfAct));
        MJRoomModel.selfAct = selfAct?selfAct.slice(0):[];
        if(selfAct.length>0){
            this.resetBtnPanel();
            this.Panel_btn.visible = true;
            var textureMap = {
                0:{t:"res/res_mj/mjRoom/mj_btn_hu.png",v:1},
                1:{t:"res/res_mj/mjRoom/mj_btn_peng.png",v:2},
                2:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:3},
                3:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:4},
                4:{t:"res/res_mj/mjRoom/mj_btn_chi.png",v:6},
                5:{t:"res/res_mj/mjRoom/mj_btn_bu.png",v:7},
                6:{t:"res/res_mj/mjRoom/qys.png",v:8},
                7:{t:"res/res_mj/mjRoom/bbh.png",v:8},
                8:{t:"res/res_mj/mjRoom/yzh.png",v:8},
                9:{t:"res/res_mj/mjRoom/llx.png",v:8},
                10:{t:"res/res_mj/mjRoom/dsx.png",v:8},
                11:{t:"res/res_mj/mjRoom/jtyy.png",v:8},
                12:{t:"res/res_mj/mjRoom/jjg.png",v:8},
                13:{t:"res/res_mj/mjRoom/st.png",v:8},
                14:{t:"res/res_mj/mjRoom/ztsx.png",v:8},
                15:{t:"res/res_mj/mjRoom/ztllx.png",v:8},
                16:{t:"res/res_mj/mjRoom/mj_btn_bu.png",v:7,v1:14},
                17:{t:"res/res_mj/mjRoom/mj_btn_zimo.png",v:1}
            };
            if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ || MJRoomModel.isYYNXMJ()){
                textureMap = {
                    0:{t:"res/res_mj/mjRoom/mj_btn_hu.png",v:1},
                    1:{t:"res/res_mj/mjRoom/mj_btn_peng.png",v:2},
                    2:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:3},
                    3:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:4},
                    4:{t:"res/res_mj/mjRoom/mj_btn_chi.png",v:6},
                    5:{t:"res/res_mj/mjRoom/mj_btn_ting.png",v:98},
                }
            }
            var rIndex=0;
            var hasHu = false;
            var hasXiaohu = false;
            var btnCount = 0;
            for(var i=0;i<selfAct.length;i++) {
                var temp = selfAct[i];
                var tm = textureMap[i];
                if (temp == 1) {
                    if(tm && parseInt(tm.v)==1) {
                        if (MJRoomModel.isHued()) {
                            selfAct[i] = 0;
                        }else {
                            hasHu=true;
                        }
                    }
                    if(tm && tm.v == 8){
                        hasXiaohu = true;
                    }
                    if(selfAct[i] == 1) {
                        btnCount++;
                    }
                }
            } 
            if(btnCount <= 0) {
                this.Panel_btn.visible = false;
                return;
            }
            var textureLog = "";
            //过
            this.hbtns[rIndex].visible = true;
            this.hbtns[rIndex].loadTextureNormal("res/res_mj/mjRoom/mj_btn_guo.png");
            this.hbtns[rIndex].temp = 5;
            this.hbtns[rIndex].hasHu = hasHu;
            this.hbtns[rIndex].hasXiaohu = hasXiaohu;
            // if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ && (selfAct[2] == 1 || selfAct[3] == 1)){
            //    this.hbtns[rIndex].visible = false;
            // }

            var offsetX = 300;

            if(selfAct[2] == 1 && selfAct[3] == 1){
                selfAct[3] = 0;//同时有暗杠和明杠只显示一个杠,再在牌型里面筛选选择
            }

            if(selfAct[5] == 1 && selfAct[16] == 1){
                selfAct[16] = 0;//同时有暗补和明补只显示一个补,再在牌型里面筛选选择
            }

            rIndex++;
            if (selfAct[0] == 1){
                for(var i=selfAct.length-1;i>=0;i--){
                // for(var i=0;i<selfAct.length;i++){
                    var temp = selfAct[i];
                    var tm = textureMap[i];
                    if(temp==1 && tm){
                        this.hbtns[rIndex].visible = true;
                        this.hbtns[rIndex].setPositionX(this.hbtns[0].x - rIndex*offsetX);
                        this.hbtns[rIndex].loadTextureNormal(tm.t);
                        this.hbtns[rIndex].temp = parseInt(tm.v);

                        this.hbtns[rIndex].temp1 = tm.v1?parseInt(tm.v1):null;

                        this.hbtns[rIndex].flag = i;
                        this.hbtns[rIndex].hasHu = hasHu;
                        //this.lastBtnX = this.hbtns[rIndex].x;
                        rIndex++;
                        textureLog+=tm.t+",";
                    }
                }
            }else{
                for(var i=0;i<selfAct.length;i++){
                    var temp = selfAct[i];
                    var tm = textureMap[i];
                    if(temp==1 && tm){
                        this.hbtns[rIndex].visible = true;
                        this.hbtns[rIndex].setPositionX(this.hbtns[0].x - rIndex*offsetX);
                        this.hbtns[rIndex].loadTextureNormal(tm.t);
                        this.hbtns[rIndex].temp = parseInt(tm.v);

                        this.hbtns[rIndex].temp1 = tm.v1?parseInt(tm.v1):null;

                        this.hbtns[rIndex].flag = i;
                        this.hbtns[rIndex].hasHu = hasHu;
                        //this.lastBtnX = this.hbtns[rIndex].x;
                        rIndex++;
                        textureLog+=tm.t+",";
                    }
                }
            }
            
            for(;rIndex<6;rIndex++){
                this.hbtns[rIndex].visible = false;
            }
        }
    },

    onGetMajiang:function(event){
        if(this.CXMJGang_Panel){
            this.CXMJGang_Panel.removeAllChildren();
            this.CXMJGang_Panel.removeFromParent();
            this.CXMJGang_Panel = null;
        }
        var message = event.getUserData();
        var seat = message.seat;
        MJRoomModel.nextSeat = seat;
        var selfAct = message.selfAct;//[胡,碰,刚]
        var ids = message.majiangIds;
        this.showJianTou(seat);
        //this.refreshButton(selfAct);
        var id = ids.length>0 ? ids[0] : 0;
        this.getLayout(MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat)).moPai(id);
        if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ || MJRoomModel.isYYNXMJ()){
            MJRoomModel.remain=message.remain;
            this.refreshButton(selfAct);
        }else{
            this.refreshButton(selfAct);
            MJRoomModel.remain-=1;
        }
        this.updateRemain();
        PlayMJMessageSeq.finishPlay();
    },

    /**
     * 出牌统一处理
     * @param id
     * @param seat
     * @param direct
     * @param userId
     */
    chuPaiAction:function(id,seat,direct,userId,isCsGang){
        this.lastLetOutMJ = id;
        this.lastLetOutSeat = seat;
        if(this.lastLetOutMJ==MJRoomModel.needAutoLetOutId)//清理掉自动出牌的值
            MJRoomModel.needAutoLetOutId = 0;
        var vo = MJAI.getMJDef(id);
        this.showJianTou(-1);
        MJRoomSound.letOutSound(userId,vo);
        this.layouts[direct].chuPai(vo,isCsGang);
        this._players[seat].chuPai(vo);
        MJRoomSound.pushOutSound();
        if(seat==MJRoomModel.mySeat){
            //没听牌，托管时间到了，后台打出了牌，取消听的状态
            if(!MJRoomModel.isTing(seat) && MJRoomModel.isTrusteeship){
                MJRoomModel.mineLayout.ccCancelTingPai();
            }
            if(!MJRoomModel.hasChuPai)
                MJRoomModel.hasChuPai = true;
            //this.refreshCheckButtons();
        }

        if(userId == PlayerModel.userId){
            if (!MJRoomModel.isHued() && !MJRoomModel.isTingHu()) {
                this.startCheckHu();
            }
        }else{
            //var len = this.layouts[direct].mahjongs3.length;
            //var ting = this.layouts[direct].mahjongs3[len-1];
            //for(var i=0;i<this.tingList.length;i++){
            //    if(this.tingList[i]._cardVo.i == ting._cardVo.i){
            //        this.refreshTingNum(this.tingList[i]);
            //    }
            //}
        }
    },

    delayPlayChuPai:function(id,seat,direct,userId,delay,isCsGang){
        cc.log("===========delayPlayChuPai==========",id);
        if(delay > 0){
            this.runAction(cc.sequence(cc.delayTime(delay),cc.callFunc(function(){
                this.chuPaiAction(id,seat,direct,userId,isCsGang);
            }.bind(this))));
        }else{
            this.chuPaiAction(id,seat,direct,userId,isCsGang);
        }
    },

    /**
     * 收到出牌消息，前台开始处理
     * @param event
     */
    onLetOutCard:function(event){
        this.updateCountDown(this.COUNT_DOWN);
        var message = event.getUserData();
        var userId = message.userId;
        var seat = message.seat;
        var action = message.action;
        var selfAct = message.selfAct;
        var ids = message.majiangIds;
        var simulate = message.simulate;
        var ext = message.ext;
        var isOtherHasAction = 0;
        if(ext && ext.length>0)
            isOtherHasAction = parseInt(ext[0]);
        var direct = MJRoomModel.getPlayerSeq(userId,MJRoomModel.mySeat,seat);
        //前台自己已经模拟了出牌的消息，后台给过来的出牌消息不处理后续逻辑
        if(seat==MJRoomModel.mySeat&&action==0&&ids.length>0&&!simulate){
            if(this.getLayout(1).getOneMahjongOnHand(ids[0])==null) {
                PlayMJMessageSeq.finishPlay();
                return;
            }
        }
        MJRoomModel.isTingSelecting=false;
        MJRoomModel.lzTingResult.length = 0;
        this.Panel_btn.visible = this.btn_back.visible = false;
        for(var lay in this.layouts){
            this.layouts[lay].hideFinger();
        }
        // this.updateRemain();

        if(action == 14){
            action = 7;//这个是暗补，但还是和补张一样用
        }

        switch (action){
            case MJAction.CHU_PAI://出牌动作
                //刷新一下玩家状态
                this._players[seat].setPlayerOnLine();
                if(isOtherHasAction==0){
                    var nextSeat = MJRoomModel.seatSeq[seat][1];
                    MJRoomModel.nextSeat = nextSeat;
                }
                //长沙麻将开杠有可能出多张牌
                if(ids.length == 1){
                    this.chuPaiAction(ids[0],seat,direct,userId);
                }else if(ids.length > 1){
                    var delay = 1.4;
                    for(var i = 0;i<ids.length;++i){
                        this.delayPlayChuPai(ids[i],seat,direct,userId,delay);
                        delay += 0.5;
                    }
                }
                break;
            case MJAction.HU://胡牌动作
                var lastId = ids[ids.length-1];
                this.layouts[direct].huPai(ids,message.zimo,message.fromSeat);
                //var huArray = message.huArray;
                var prefix = (message.zimo==1) ? "zimo" : "hu";
                MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
                MJRoomSound.actionSound(userId,prefix);
                //if(prefix=="hu" && this.lastLetOutSeat>0){
                //    var lastseq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,this.lastLetOutSeat);
                //    MJRoomEffects.normalAction(this.root,"dianpao",this.getWidget("cp"+lastseq),[],userId);
                //}
                //if(direct==1) {
                //    this.layouts[direct].csGangPai();
                //}
                MJRoomModel.hued(seat, {action:(message.zimo==1) ? 0 : 1,cards:[lastId]});
                if(message.fromSeat){
                    var fromDirect = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].playDianPaoEff();
                    this.layouts[fromDirect].beiPengPai(lastId);
                }

                var loseActionArray = [];
                var zhuangTarget = this._players[seat];
                //var ext = message.ext[1].split(",");
                //if(!MJRoomModel.isGuCang()) {
                //    var score = parseInt(ext[2]);
                //    if (message.fromSeat) {
                //        loseActionArray.push({target: this._players[message.fromSeat], point: score});
                //        this._players[seat].changeSPoint(score);
                //        this._players[message.fromSeat].changeSPoint(-score);
                //    } else {
                //        this._players[seat].changeSPoint(score * 3);
                //        for (var key in this._players) {
                //            if (key != seat) {
                //                //this._players[key].changeSPoint(-score);
                //                //loseActionArray.push({target: this._players[key], point: score});
                //            }
                //        }
                //    }
                //    this._effectLayout.runJettonAction(loseActionArray, zhuangTarget);
                //}
                break;
            case MJAction.GUO://过
                if(isOtherHasAction == 0)
                    MJRoomModel.nextSeat = seat;
                this.showJianTou();
                //点了过，还有可能有需要自动出牌的操作需要做
                if(MJRoomModel.needAutoLetOutId>0)
                    MJRoomModel.chuMahjong(MJRoomModel.needAutoLetOutId);
                break;
            case MJAction.XIAO_HU://小胡 六六顺、板板胡等

                this.layouts[direct].showXiaoHu(ids);
                MJRoomEffects.normalAction(this.root,message.huArray[0],this.getWidget("cp"+direct));

                break;
            case MJAction.HIDE_XIAOHU://隐藏显示的小胡牌
                this.layouts[direct].hideXiaoHu();
                break;
            case MJAction.TING://听牌特殊处理，先出牌，再播听牌动画
                prefix = "ting";
                MJRoomModel.ting(seat);
                var self = this;
                this._players[seat].tingPai();
                /* if(MJRoomModel.isTrusteeship){//托管状态
                 this._players[seat].unTingPai();
                 }*/
                MJRoomEffects.normalAction(self.root,prefix,self.getWidget("cp"+direct));
                MJRoomSound.actionSound(userId,prefix);
                if (ids.length>0) {
                    self.chuPaiAction(ids[0],seat,direct,userId);
                }
                //if (seat == MJRoomModel.mySeat) {
                //    var vo = MJAI.getMJDef(ids[0]);
                //    var huCards = MJRoomModel.getTingWithMahjong(vo);
                //    this.onShowHuCards(huCards);
                //}
                MJRoomModel.mineLayout.ccCancelTingPai();
                break;
            default://补张、吃、碰、杠牌动作
                //var displayForGang = false;
                var showTing = true;
                var beiPengId = ids[ids.length-1];
                var prefix = "peng";
                if(action==MJAction.BU_ZHANG){
                    prefix = "bu";
                    showTing = false;
                }else if(action==MJAction.CHI){
                    beiPengId = ids[1];
                    prefix = "chi";
                }else if(ids.length>3 || ids.length==1){
                    prefix = "gang";
                    //长春麻将听牌后的杠牌，还需要显示遮罩
                    //displayForGang = (seat==MJRoomModel.mySeat && (MJRoomModel.isTing(seat) || MJRoomModel.isHued(seat)));//(MJRoomModel.wanfa==2&&seat==MJRoomModel.mySeat && !MJRoomModel.isGang());
                    MJRoomModel.gang(seat);
                    showTing = false;
                }
                this.layouts[direct].pengPai(ids,action,message.fromSeat);
                if (MJRoomModel.mySeat == seat && action == MJAction.PENG){
                    var voArray = MJAI.getVoArray(ids);
                    MJRoomModel.cxmj_pengMJ.push(voArray[0]);
                }
                MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct));
                if(message.fromSeat){
                    var fromDirect = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].beiPengPai(beiPengId);
                }
                MJRoomModel.nextSeat = seat;
                this.showJianTou();
                MJRoomSound.actionSound(userId,prefix);
                break;
        }
        this.refreshButton(selfAct);
        if(action != MJAction.XIAO_HU && action != MJAction.HIDE_XIAOHU){
            this.clearTingArrows();
        }
        // this.removeHuPanel();
        PlayMJMessageSeq.finishPlay();
    },

    refreshTingNum:function(card){
        var num = 4;
        var allOutCards = this.getAllOutCard();
        for(var i=0;i<allOutCards.length;i++){
            if(card._cardVo.i == allOutCards[i].i){
                num -= 1;
            }
        }
        if(num>0){
            card.tingpaiSprite.visible = true;
            card.tingpaiLab.setString(num);
            card.shadeSprite.visible = false;
        }else{
            card.tingpaiSprite.visible = false;
            card.shadeSprite.visible = true;
        }
    },

    hideTing: function() {
        this.Label_ting.visible = this.Panel_ting.visible = false;
    },

    /**
     * 显示可以胡的牌
     */
    smartFitlerMayHuPai:function(isReconect){
        var allMJs = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
        //重连进来的情况，可能手上已经摸了牌了，把最后一张牌剔除
        if(isReconect && (!MJRoomModel.isTingHu() || MJRoomModel.isTing()) && MJRoomModel.isNeedSmartFitler()) {
            if(allMJs.length%3==2) {
                allMJs = ArrayUtil.clone(allMJs);
                allMJs.pop();
            }
        }
        if(allMJs.length%3!=1) {
            //cc.log("no need to smartFitlerMayHuPai...");
            return;
        }
        //重连进来时，如果是报听胡，没报听的情况，不提示胡牌
        if (isReconect && MJRoomModel.isTingHu() && !MJRoomModel.isTing()) {
            return;
        }
        var start = new Date().getTime();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var smart = new MajiangSmartFilter();
        var list = smart.isHu(allMJs,huBean);
        //cc.log("smartFitlerMayHuPai cost time::"+(new Date().getTime()-start));
        this.Panel_ting.removeAllChildren(true);
        this.tingList.length=0;
        if(list.length>0){
            this.Panel_ting.removeAllChildren(true);
            var orderNum = 0;
            //this.Label_ting.visible = this.Panel_ting.visible = true;
            this.Label_ting.visible = this.Panel_ting.visible = false;
            for(var key in list){
                var vo = list[key];
                //vo.tingDisplay = 1;
                var card = new AHMahjong(MJAI.getDisplayVo(1,4),list[key]);
                card.x = orderNum*27;
                card.y = 0;
                this.Panel_ting.addChild(card);
                orderNum += 1;
                this.tingList.push(card);
            }
            MJRoomModel.setLocalBySmartFitler(list);
            //for(var i=0;i<this.tingList.length;i++){
            //    this.refreshTingNum(this.tingList[i]);
            //}
        }else{
            this.hideTing();
        }
    },

    getAllOutCard:function(){
        var outCards = [];
        for(var i=0;i<MJRoomModel.players.length;i++){
            var p = MJRoomModel.players[i];
            var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
            var layout = this.getLayout(seq);
            if(p.userId == PlayerModel.userId && layout.getPlace1Data().length>0){
                ArrayUtil.merge(layout.getPlace1Data(),outCards);
            }
            if(layout.gangPai.length>0){
                ArrayUtil.merge(layout.gangPai,outCards);
            }
            if(layout.getPlace2Data().length>0){
                ArrayUtil.merge(layout.getPlace2Data(),outCards);
            }
            if(layout.getPlace3Data().length>0){
                ArrayUtil.merge(layout.getPlace3Data(),outCards);
            }
        }
        return outCards;
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "安化麻将";

        if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ){
            wanfa = "楚雄麻将";
        }else if(MJRoomModel.wanfa == GameTypeEunmMJ.KWMJ){
            wanfa = "开王麻将";
        }else if(MJRoomModel.isTCPFMJ()){
            wanfa = "桐城跑风麻将";
        }else if(MJRoomModel.isTCDPMJ()){
            wanfa = "桐城点炮麻将";
        }

        var queZi = MJRoomModel.renshu + "缺"+(MJRoomModel.renshu - MJRoomModel.players.length);
        var obj={};
        obj.tableId=MJRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+MJRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+MJRoomModel.tableId+"] "+queZi;

        var youxiName = wanfa;
        if(MJRoomModel.tableType == 1){
            youxiName = "[亲友圈]" + wanfa;
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,MJRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    onJoin:function(event){
        var p = event.getUserData();
        var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
        this._players[p.seat] = new AHMJPlayer(p,this.root,seq);
        var me = MJRoomModel.getPlayerVo();
        this.btnInvite.visible = (ObjectUtil.size(this._players)<MJRoomModel.renshu);

        if (MJRoomModel.renshu != 2){
            var seats = MJRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
            //if(MJRoomModel.wanfa == GameTypeEunmMJ.CXMJ){
                PopupManager.addPopup(new GpsPop(MJRoomModel , MJRoomModel.renshu));
            //}
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        layout = new AHMJLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    showJianTou:function(seat){
        this.jt.visible = true;
        seat = seat || MJRoomModel.nextSeat;
        for(var i=1;i<=4;i++){
            this.getWidget("jt"+i).visible = false;
        }
        if(seat != -1 && seat!=null){
            var seq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat);
            var direct = MJRoomModel.getJTSeq(seq);
            var jtSeq = [1,2,3,4];
            if (MJRoomModel.renshu == 3){
                jtSeq = [1,2,4];
            }else if(MJRoomModel.renshu == 2){
                jtSeq = [1,3];
            }
            //cc.log("direct===",direct)
            this.getWidget("jt"+jtSeq[direct-1]).visible = true;
        }
    },

    /**
     *
     * @param direct
     * @param p1Mahjongs {Array.<MJVo>}
     * @param p2Mahjongs {Array}
     * @param p3Mahjongs {Array.<MJVo>}
     * @param anMahjongs {Array}
     * @param bankerSeat {number}
     * @param isMoPai {Boolean}
     */
    initCards:function(direct,p1Mahjongs,p2Mahjongs,p3Mahjongs,p4Mahjongs,bankerSeat,isMoPai){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),this.getWidget("hPanel"+direct));
        layout.refresh(p1Mahjongs,p2Mahjongs,p3Mahjongs,p4Mahjongs,bankerSeat,isMoPai);
        if(direct==1){
            MJRoomModel.mineLayout = layout;
        }
    },

    findPutOutByTing:function(){
        var start = new Date().getTime();
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var hu = new MajiangSmartFilter();
        MJRoomModel.nearestTingResult = hu.checkTing(data1, huBean);
        MJRoomModel.mineLayout.ccTingPaiByGC();
        //cc.log("findPutOutByTing cost time::"+(new Date().getTime()-start));
    },

});
