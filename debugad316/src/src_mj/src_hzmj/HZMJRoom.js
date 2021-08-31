/**
 * Created by zhoufan on 2016/7/22.1
 */
var HZMJRoom = BaseRoom.extend({
    layouts:{},
    initCoords:{},
    COUNT_DOWN:15,

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
            this.COUNT_DOWN = MJRoomModel.intParams[8];
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

        if (SyConfig.HAS_GPS && MJRoomModel.renshu >2 && !MJRoomModel.isMoneyRoom()) {
            if(GPSModel.getGpsData(PlayerModel.userId) == null){
                this.Button_gps.setBright(false);
            }else{
                this.Button_gps.setBright(true);
            }
        } else {
            this.Button_gps.visible = false;
        }
        this.getWidget("label_version").setString(SyVersion.v);

        this.Button_tuichu = this.getWidget("Button_tuichu");
        this.Button_tuichu.visible= true;
        UITools.addClickEvent(this.Button_tuichu,this,this.onLeave)
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
        this.roomName_label = new cc.LabelTTF("","Arial",40);
        this.roomName_label.setAnchorPoint(0.5,0.5);
        this.addChild(this.roomName_label, 10);

        this.roomName_label.setString(MJRoomModel.roomName || "");
        this.roomName_label.setColor(cc.color(214, 203, 173));
        this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.roomName_label.x = cc.winSize.width / 2;
        this.roomName_label.y = cc.winSize.height / 2 -100;


        if(MJRoomModel.isMatchRoom()){
            var str = "挑战赛白金豆:" + MJRoomModel.strParams[1];
            var label_bjd = new cc.LabelTTF(str,"",40);
            label_bjd.setColor(cc.color(214,203,173));
            label_bjd.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 270);
            this.addChild(label_bjd,1);
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

        this.addCustomEvent(SyEvent.PIAO_FEN,this,this.onPiaoFen);
        this.addCustomEvent(SyEvent.SELECT_PIAO_FEN,this,this.onSelectPiaoFen);
        this.addCustomEvent(SyEvent.BISAI_XIPAI, this, this.NeedXipai);

        this.addCustomEvent("XIPAI_CLEAR_NODE", this, this.clearXiPai);
        
        this.countDownLabel = new cc.LabelBMFont("15","res/font/font_mj3.fnt");
        this.countDownLabel.x = this.jt.width/2+2;
        this.countDownLabel.y = this.jt.height/2+2;
        this.jt.addChild(this.countDownLabel);
        this._effectLayout = new MJEffectLayout(this.root, this);

        this.recordBtn.x = 70;
        this.recordBtn.y = 550;
        if(MJRoomModel.renshu > 2){
            this.recordBtn.y = 470;
        }
        var huBg = "res/res_mj/mjRoom/img_ting2.png";
        this.Panel_hupai = new cc.Scale9Sprite(huBg,null,cc.rect(40,30,40,30));
        this.Panel_hupai.x = 330;
        this.Panel_hupai.y = 240;
        this.Panel_hupai.height = 220;
        this.root.addChild(this.Panel_hupai,4);

        var gameNameImg = new cc.Sprite("res/res_mj/res_hzmj/hzmjRoom/hzmj.png");
        var x = 960;
        var y = 740;
        gameNameImg.setPosition(x, y);
        this.Panel_20.addChild(gameNameImg,2);

        this.getWidget("mPanel1").y = 20;

        this.Panel_8.x += 400;
        this.Panel_8.y -= 30;

        if(MJRoomModel.renshu == 4){
            this.getWidget("oPanel"+3).y -= 10;
            this.getWidget("oPanel"+1).y -= 20;
            this.getWidget("oPanel"+2).y -= 120;
            this.getWidget("oPanel"+3).x += 80;
            this.getWidget("oPanel"+2).x += 80;
            this.getWidget("oPanel"+4).x -= 80;
            this.getWidget("oPanel"+1).x -= 60;
        }else if(MJRoomModel.renshu == 3){
            this.getWidget("oPanel"+2).y -= 120;
            this.getWidget("oPanel"+2).x += 130;
            this.getWidget("oPanel"+3).x -= 130;
            this.getWidget("oPanel"+1).x -= 60;
        }else if(MJRoomModel.renshu == 2){
            this.getWidget("oPanel"+2).x += 150;
            this.getWidget("oPanel"+2).y -= 30;
            this.getWidget("oPanel"+1).x -= 20;
            this.getWidget("oPanel"+1).y -= 20;
        }
        
        this.button_wanfa =  new ccui.Button("res/res_mj/mjRoom/wanfa.png","","");
        this.Panel_20.addChild(this.button_wanfa);
        this.button_wanfa.y = this.Button_setup1.y;
        this.button_wanfa.x = 1710;
        UITools.addClickEvent(this.button_wanfa,this,this.showWanFaImg);
        this.initwanfaImg();

        if(MJRoomModel.isMoneyRoom()){
            this.button_wanfa.setVisible(false);
        }else{
            // this.showWanFaImg();
        }

        this.newUpdateFace();
        //this.adjustInviteBtn();
        this.Panel_20.getChildByName("Label_info_mj").setVisible(false);
        if(!MJRoomModel.isMoneyRoom()){
            this.Panel_20.getChildByName("Image_info1").setVisible(false);
            this.Panel_20.getChildByName("Image_info2").setVisible(false);
        }

        this.actionNodeArr = [];
        for (var i = 0; i < MJRoomModel.renshu; i++) {
            var actionNode = new cc.Node();
            this.root.addChild(actionNode);
            var mPanel = this.getWidget("mPanel"+(i+1));
            actionNode.setPosition(mPanel.x,mPanel.y);
            this.actionNodeArr.push(actionNode);
        }

        if(MJRoomModel.isMoneyRoom()){
            this.Button_ting.addTouchEventListener(this.onClickTingBtn,this);
        }
        // this.actionNode = new cc.Node();
        // this.root.addChild(this.actionNode);
        // this.actionNode.setPosition(this.getWidget("mPanel1").x,this.getWidget("mPanel1").y);
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjchi/btmjchi.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjgang/btmjgang.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjhu/btmjhu.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjpeng/btmjpeng.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjting/btmjting.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCMjActionAni/mjshandian/mjshandian.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCMjActionAni/mjpengpai/mjpengpai.ExportJson");
    },
    onClickTingBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);

            this.Panel_hupai.setVisible(true);

        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            this.Panel_hupai.setVisible(false);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);

            this.Panel_hupai.setVisible(false);
        }
    },

    newUpdateFace:function(){//宽屏适配
        var size = cc.director.getWinSize();
        var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
        var offx = tempSize > 100 ? 50 : tempSize/2;
        if(size.width > SyConfig.DESIGN_WIDTH){
            //this.getWidget("Image_info0").x -= tempSize - offx;
            //this.getWidget("Image_info1").x -= tempSize - offx;
            //this.getWidget("Image_info2").x -= tempSize - offx;
            //this.recordBtn.x -= tempSize - offx;
            //this.Button_ting.x += tempSize - offx;
            //this.getWidget("Button_52").x += tempSize - offx;
            //this.button_wanfa.x += tempSize - offx;
            //this.Button_setup1.x += tempSize - offx;
            //this.Image_setup.x += tempSize - offx;
            //this.Button_gps -= tempSize - offx;
            //this.getWidget("label_version").x += tempSize - offx;
            //this.getWidget("netType").x += tempSize - offx;
            //this.getWidget("Image_19").x += tempSize - offx;
            //this.getWidget("Label_time").x += tempSize - offx;
            //this.roomName_label.x = 120 + offx;
            this.getWidget("Label_info0").x -= tempSize - offx;
            this.getWidget("label_version").x -= tempSize - offx;
            this.getWidget("Label_time").x -= tempSize - offx;
            this.getWidget("netType").x -= tempSize - offx;
            this.getWidget("Image_19").x -= tempSize - offx;
            this.recordBtn.x -= tempSize - offx;
            // this.Button_ting.x -= tempSize - offx;
            this.getWidget("Button_52").x += tempSize - offx;
            this.button_wanfa.x += tempSize - offx;
            this.Button_setup1.x += tempSize - offx;
            this.Image_setup.x += tempSize - offx;
            this.Button_gps -= tempSize - offx;

            // this.roomName_label.x -= tempSize - offx;

            this.getWidget("mPanel1").x += tempSize;
            
        }
    },

    //微信邀请按钮统一换资源，增加亲友圈邀请按钮
    adjustInviteBtn:function(){
        var img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";
        var btn_wx_invite = this.btnInvite;
        btn_wx_invite.loadTextureNormal(img_wx);
        btn_wx_invite.visible = false;
        // cc.log("this.btnInvite====",this.btnInvite.x);
        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName){
            var offsetX = 370;
            var offsetY = 370;
            this.btn_qyq_back = new ccui.Button(img_back,"","");
            this.btn_qyq_back.setPosition(btn_wx_invite.width/2 - 2*offsetX,btn_wx_invite.height/2);
            UITools.addClickEvent(this.btn_qyq_back,this,this.onBackToPyqHall);
            // btn_wx_invite.addChild(this.btn_qyq_back);

            if(BaseRoomModel.curRoomData.strParams[4] == 1){
                img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
            }
            this.btn_qyq_invite = new ccui.Button(img_qyq,"","");
            this.btn_qyq_invite.visible = ClickClubModel.getIsForbidInvite();
            this.btn_qyq_invite.setPosition(btn_wx_invite.width/2 - offsetX,btn_wx_invite.height/2);
            UITools.addClickEvent(this.btn_qyq_invite,this,this.onShowInviteList);
            // btn_wx_invite.addChild(this.btn_qyq_invite);
            if(!ClubRecallDetailModel.isDTZWanfa(BaseRoomModel.curRoomData.wanfa)){
                btn_wx_invite.setPosition(btn_wx_invite.x + (offsetX),offsetY);
            }else{
                this.btn_qyq_invite.setPosition(btn_wx_invite.width/2,185);
                this.btn_qyq_back.setPosition(btn_wx_invite.width/2,319);
                btn_wx_invite.setPositionY(btn_wx_invite.y - 65);
            }
        }

    },

    showWanFaImg:function(){
        this.Image_setup.visible = false;
        this.Button_setup1.setBright(!this.Image_setup.visible);
        if (this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(!this.Panel_20.getChildByName("wanfaImg").isVisible());
        }
    },
    initwanfaImg:function(){
        var wanfaStr = ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams,false,true,MJRoomModel.isMoneyRoom());

        if(MJRoomModel.isMatchRoom()){
            wanfaStr = wanfaStr.replace(/ .*支付/,"");
        }

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
            wanfa_label.setName("wanfa_label");
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
        var string = "不抓鸟";
        if (MJRoomModel.intParams[3] == 8){
            string = "一鸟全中";
        }else if (MJRoomModel.intParams[3] != 0){
            string = "抓" + MJRoomModel.intParams[3] + "鸟";
        }
        string = string + ",中鸟+" + MJRoomModel.intParams[13] + "分";
        string = string + ",无红中中鸟+" + MJRoomModel.intParams[14];
        if (MJRoomModel.intParams[7] == 2 && MJRoomModel.intParams[20] == 1){
            string = string+ ",低于" + MJRoomModel.intParams[21] + "分翻" + MJRoomModel.intParams[22] +"倍";
        }else{
            string = string + ",不翻倍";
        }
        return string;
    },
    showPiaoBtn:function(isShow){
        this.Button_tuichu.visible = false;
        for(var i=1;i<=MJRoomModel.renshu;i++){
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
        if(isShow){
            if(!this.piaoBtnNode){
                this.piaoBtnNode = new cc.Node();
                this.piaoBtnNode.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 100);
                this.addChild(this.piaoBtnNode,5);
                var imgArr = ["bupiao.png","1fen.png","2fen.png","3fen.png"];
                var offsetX = 300;//170;
                var startX = -(imgArr.length - 1)/2*offsetX;
                for(var i = 0;i<imgArr.length;++i){
                    var img = "res/res_mj/mjRoom/" + imgArr[i];
                    var btn = new ccui.Button(img);
                    btn.setTag(i);
                    //btn.setScale(0.6);
                    btn.setPosition(startX + offsetX*i,0);
                    UITools.addClickEvent(btn,this,this.onClickPiaoFenBtn);
                    this.piaoBtnNode.addChild(btn);
                }
            }
            this.piaoBtnNode.setVisible(true);
        }else{
            this.piaoBtnNode && this.piaoBtnNode.setVisible(false);
        }

        if(MJRoomModel.isMoneyRoom()){
            this.moneyRoomShowLeaveBtn(false);
            this.moneyRoomShowWaitAni(false);
        }
    },

    showWaitSelectPiao:function(isShow){
        this.Button_tuichu.visible = false;
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

    onPiaoFen:function(){
        cc.log("=============onPiaoFen=============");
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
        }
        this.piaofenTime = setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
            this.showPiaoBtn(true);
        }.bind(this),100);
    },

    onSelectPiaoFen:function(event){
        var msg = event.getUserData();
        if(this._players[msg.params[0]]){
            this._players[msg.params[0]].showPiaoFenImg(msg.params[1]);
        }
        if(msg.params[0] == MJRoomModel.mySeat){
            this.showPiaoBtn(false);
            this.showWaitSelectPiao(true);
        }
    },

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
        cc.log("==========onCSHaidi==========");
        var message = event.getUserData();
        if(message.params[0] == 1){
            var pop = new MJHaiDiPop();
            PopupManager.addPopup(pop);
        }
    },

    //长沙麻将杠牌消息
    onCSGang:function(event){
        var message = event.getUserData();

        var acts = CsMjGangModel.gangActs;
        var isHas = false;
        for(var i=0;i<acts.length;i++){
            var act = acts[i];
            if(act.selfAct && act.selfAct.length>0){
                isHas = true;
            }
        }

        var delay = 0;
        if(message.reconnect != 1){
            if(message.dice > 0){
                this.playSaiziAni(parseInt(message.dice/10),message.dice%10);
                delay = 1400;
            }
        }

        if((message.dice > 0) && (message.reconnect != 1)){
            this.csGangMoPai(message.seat);
        }

        if(isHas){
            if(delay == 0){
                PopupManager.addPopup(new MJGangPop());
            }else{
                setTimeout(function(){
                    PopupManager.addPopup(new MJGangPop());
                },delay);
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
        cc.log("==========delayGangMoPai===========",id);
        this.runAction(cc.sequence(cc.delayTime(delay),cc.callFunc(function(){
            this.getLayout(1).moPai(id);
        }.bind(this))));
    },

    playSaiziAni:function(num1,num2){
        cc.log("=========playSaiziAni==========");
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
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjchi/btmjchi.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjgang/btmjgang.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjhu/btmjhu.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjpeng/btmjpeng.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/YLCMjButtonAni/btmjting/btmjting.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/YLCMjActionAni/mjshandian/mjshandian.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/YLCMjActionAni/mjpengpai/mjpengpai.ExportJson");
        this._super();
    },

    onSetUp:function(){
        var mc = new MjSetUpPop(true,false);
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
                    info[j].tingMajiangIds = ArrayUtil.uniqueArray(info[j].tingMajiangIds);
                    var list = info[j].tingMajiangIds;
                    if (list && list.length == 1 && list[0] == 201){
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

                    if(MJRoomModel.intParams[31]){
                        info[j].tingNum += 4;//八红中选项
                    }
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
            this.onShowHuPanel(1);
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
            this.Button_ting.visible = true;
            var scale_num = 1;
            this.Panel_hupai.removeAllChildren();
            if (isShowAllTime === 1){
                this.Panel_hupai.visible = true;
            }else{
                this.Panel_hupai.visible = !this.Panel_hupai.isVisible();
            }

            if ((huList.length == 1 && huList[0] == 201) || huList.length > 9){
                this.Panel_hupai.width = 9 * 90*scale_num+ (9-1)*30+60+100;
                this.Panel_hupai.height = 420;
                this.Panel_hupai.setAnchorPoint(0,0);
            }else{
                this.Panel_hupai.width = huList.length * 90*scale_num+ (huList.length-1)*30+60+100;
                // cc.log("this.Panel_hupai.width =",this.Panel_hupai.width);
                this.Panel_hupai.height = 210;
                this.Panel_hupai.setAnchorPoint(0,0);
            }

            if (huList.length == 1 && huList[0] == 201){
                huList = [];
                for (var i = 1; i <= 27; i++) {
                    huList.push(i);
                }
                huList.push(201);
            }
            var totalNum = 0;
            for (var i = 0; i < huList.length; i++) {
                var height = Math.floor(i/9);
                var width = Math.floor(i%9);
                var vo = MJAI.getMJDef(huList[i]);
                var card = new HZMahjong(MJAI.getDisplayVo(1, 2), vo);
                card.scale = scale_num;
                var size = card.getContentSize();
                card.x = 30+width * ((90+30)*scale_num)+100;
                card.y = 50 * scale_num + height*(size.height + 70)*scale_num;
                this.Panel_hupai.addChild(card,i+1);
                var num = this.getMahjongNumById(vo);
                totalNum += num;
                var paiNumLabel = new cc.LabelTTF("", "Arial", 30);
                paiNumLabel.setString(num + "张");
                paiNumLabel.y = -20;
                paiNumLabel.x = size.width*0.5;
                paiNumLabel.setColor(cc.color("f0ff6a"));
                card.addChild(paiNumLabel);
            }
            var totalNumLabel = new cc.LabelTTF("", "Arial", 50);
            totalNumLabel.setString(""+totalNum);
            totalNumLabel.y = 140;
            totalNumLabel.x = 70;
            totalNumLabel.setColor(cc.color("f0ff6a"));
            this.Panel_hupai.addChild(totalNumLabel);

            var ziLabel = new cc.LabelTTF("", "Arial", 50);
            ziLabel.setString("张");
            ziLabel.y = 90;
            ziLabel.x = 70;
            ziLabel.setColor(cc.color("f0ff6a"));
            this.Panel_hupai.addChild(ziLabel);
        }else{
            this.Button_ting.visible = false;
            this.Panel_hupai.removeAllChildren();
            this.Panel_hupai.visible =false;
        }
    },

    //移除可胡牌层
    removeHuPanel:function(){
        if (this.Panel_hupai){
            this.Panel_hupai.removeAllChildren();
            this.Panel_hupai.visible = false;
            this.Button_ting.visible = false;
        }
    },

    getMahjongNumById:function(vo){
        var num = 4;

        if(vo.i == 201 && MJRoomModel.intParams[31]){
            num = 8;//八红中选项
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
                var card = new HZMahjong(MJAI.getDisplayVo(1, 4), vo);
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
            var mc = new HZMJSmallResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }
    },

    onJixuFromResult:function(){
        this.Panel_8.visible = false;
        if(MJRoomModel.totalBurCount == MJRoomModel.nowBurCount || (ClosingInfoModel.ext[27] == 1)){
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

        if(MJRoomModel.isMoneyRoom()){
            var isShow = !this.itemBtnBg;
            this.showMoneyRoomItemBtn(isShow);
            return;
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

    showMoneyRoomItemBtn:function(isShow){
        if(isShow){
            if(!this.itemBtnBg){
                var btnImgArr = ["guize","shezhi"];
                var itemHeight = 120;

                this.itemBtnBg = new cc.Scale9Sprite("res/res_mj/mjRoomSetPop/item_bg.png");
                this.itemBtnBg.setContentSize(this.itemBtnBg.width,itemHeight*btnImgArr.length + 40);
                this.itemBtnBg.setAnchorPoint(0.8,1);
                this.itemBtnBg.setPosition(this.Button_setup1.x,this.Button_setup1.y - 60);
                this.Button_setup1.getParent().addChild(this.itemBtnBg);

                for(var i = 0;i<btnImgArr.length;++i){
                    var img = "res/res_mj/mjRoomSetPop/" + btnImgArr[i] + ".png";
                    var btn = new ccui.Button(img,img,"");
                    btn.setPosition(this.itemBtnBg.width/2,this.itemBtnBg.height - itemHeight*(i+0.5) - 20);
                    btn.addTouchEventListener(this.onClickItemBtn,this);
                    btn.setName(btnImgArr[i]);
                    this.itemBtnBg.addChild(btn);

                    if(i > 0){
                        var line = new cc.Sprite("res/res_mj/mjRoomSetPop/line.png");
                        line.setPosition(btn.x,btn.y + itemHeight/2);
                        this.itemBtnBg.addChild(line);
                    }
                }

                var self = this;
                var action = cc.sequence(cc.delayTime(10),cc.callFunc(function(node){
                    node.removeFromParent(true);
                    self.itemBtnBg = null;
                    self.Button_setup1.setBright(true);
                }));
                this.itemBtnBg.runAction(action);
            }
        }else if(this.itemBtnBg){
            this.itemBtnBg.removeFromParent(true);
            this.itemBtnBg = null;
        }

        this.Button_setup1.setBright(!isShow);
    },

    onClickItemBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            var name = sender.getName();

            if(name == "guize"){
                var pop = new ShowRulePop();
                pop.setLayerInfo(ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams,0,1,MJRoomModel.isMoneyRoom()));
                PopupManager.addPopup(pop);
            }else if(name == "shezhi"){
                this.onSetUp();
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
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
            var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
            self.getLayout(seq).tanPai(p.handPais);
        }


        var t1 = 100;
        this.overNiaoTimeout = setTimeout(function(){//延迟弹出结算框
            self.showNiaoPanel(data);
        },t1);

        var t = 2000;
        this.overTimeout = setTimeout(function(){//延迟弹出结算框
            //self.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            if(MJRoomModel.isMoneyRoom()){
                var mc = new GoldResult_MJ(data);
            }else{
                var mc = new HZMJSmallResultPop(data);
            }
            PopupManager.addPopup(mc);
            self.Panel_8.visible = true;
        },t);
        //if(MJRoomModel.overNiaoIds.length>0) {
        //    setTimeout(function () {
        //        MJRoomEffects.niaoAction(data, self.root);
        //    }, 1500);
        //}
    },

    initData:function(){
        this.roomName_label.setString(MJRoomModel.roomName);
        this.initwanfaImg();
        BaseRoom.prototype.initData.call(this);
        if(this.overTimeout) {
            clearTimeout(this.overTimeout);
        }

        if(this.overNiaoTimeout) {
            clearTimeout(this.overNiaoTimeout);
        }

        if (PopupManager.getClassByPopup(HZMJSmallResultPop)) {
            PopupManager.removePopup(HZMJSmallResultPop);
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

        if(MJRoomModel.isMoneyRoom()){
            this.Label_info0.setString("序号:"+MJRoomModel.tableId);
        }

        if(this.bg_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
        }

        this.updateRoomInfo();
        this._players = {};
        var players = MJRoomModel.players;
        for(var i=1;i<=MJRoomModel.renshu;i++){
            this.getWidget("player"+i).visible = false;
            this.getWidget("cp"+i).visible = false;
            this.getWidget("oPanel"+i).removeAllChildren(true);
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
        this.cleanButtonAni();
        this.btnReady.visible = this.Button_tuichu.visible = true;
        this.Button_tuichu.x = 710;
        this.btnReady.x = 1210;
        if (MJRoomModel.nowBurCount > 1) {
            // this.btnReady.visible = this.Button_tuichu.visible = false;
            this.Button_tuichu.visible = false;
        }
        this.setInviteBtnState();
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
            var cardPlayer = this._players[p.seat] = new MJPlayer(p,this.root,seq);
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

            var point = -1;
            if(MJRoomModel.intParams[17] > 0){
                point = p.ext[3];
            }
            if(point >= 0){
                cardPlayer.showPiaoFenImg(point);
            }else{
                cardPlayer.hidePiaoFenImg();
            }

            if(!isContinue && p.seat == MJRoomModel.mySeat && point >= 0 && MJRoomModel.intParams[17] == 1){
                this.showWaitSelectPiao(true);
            }

            if(!isContinue){
                if(p.status)
                    cardPlayer.onReady();
            }else{//恢复牌局
                this.Panel_20.getChildByName("Label_info_mj").setVisible(true);
                this.Panel_20.getChildByName("Image_info1").setVisible(true);
                this.Panel_20.getChildByName("Image_info2").setVisible(true);
                var banker = null;
                //if(p.seat==MJRoomModel.nextSeat)
                //    banker= p.seat;
                this.Button_tuichu.visible = false;
                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.huCards, banker, isMoPai);
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
            }
            var isTuoguan = p.ext[4];
            if(p.userId ==PlayerModel.userId){//自己的状态处理
                MJRoomModel.isTrusteeship = p.ext[3];
                //this.Image_cover.visible = (MJRoomModel.isTrusteeship) ? true : false;
                if(p.status){
                    this.Button_tuichu.x = 960;
                    this.btnReady.visible = false;
                }else{
                    // this.btnInvite.visible = false;
                    if (!this.Button_tuichu.visible)
                        this.btnReady.x = 960;
                }
                var tingAct = p.recover.length>2 ? p.recover.splice(2,8) : [];
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
                if(!isTingPai)
                    this.refreshButton(tingAct);

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
            if(MJRoomModel.nextSeat)
                this.showJianTou();
            else
                this.showJianTou(-1);
            this.btnInvite.visible = false;
            this.Button_tuichu.visible = false;
        }else{
            if (players.length>1 && MJRoomModel.renshu != 2 && MJRoomModel.nowBurCount == 1 && !MJRoomModel.isMoneyRoom())
                PopupManager.addPopup(new GpsPop(MJRoomModel , MJRoomModel.renshu));

            this.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            this.jt.visible = false;
        }
        this.removeHuPanel();

        if(MJRoomModel.isMoneyRoom()){
            this.moneyRoomInitData();
        }
    },

    moneyRoomInitData:function(){
        this.btnInvite.setVisible(false);
        this.btnReady.setVisible(false);

        var isShow = (MJRoomModel.players.length<MJRoomModel.renshu);
        this.moneyRoomShowLeaveBtn(isShow);
        this.moneyRoomShowWaitAni(isShow);
    },

    moneyRoomShowLeaveBtn:function(isShow){
        if(isShow){
            if(!this.btn_leave){
                var img = "res/ui/bjdmj/back_qyq_hall.png";
                this.btn_leave = new ccui.Button(img,"","");
                this.btn_leave.setPosition(cc.winSize.width/2,cc.winSize.height/3);
                this.addChild(this.btn_leave,1);
                UITools.addClickEvent(this.btn_leave,this,this.onLeave);
            }
            this.btn_leave.setVisible(true);
        }else if(this.btn_leave){
            this.btn_leave.setVisible(false);
        }
    },

    moneyRoomShowWaitAni:function(isShow){
        if(isShow){
            if(!this.waitAni){
                ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/gold_zzpp/NewAnimation2.ExportJson");
                this.waitAni = new ccs.Armature("NewAnimation2");
                this.waitAni.setPosition(cc.winSize.width/2,cc.winSize.height/2);
                this.addChild(this.waitAni,1);
                this.waitAni.getAnimation().play("Animation1",-1,1);
            }

        }else if(this.waitAni){
            this.waitAni.removeFromParent(true);
            this.waitAni = null;
        }
    },

    //对局门票显示
    moneyRoomShowTiket:function(isShow,num,delayRemove){
        if(isShow){
            if(!this.imgTiket){
                this.imgTiket = new cc.Sprite("res/res_mj/common/gold_mp.png");
                this.imgTiket.setAnchorPoint(1,0.5);
                this.imgTiket.setPosition(cc.winSize.width,cc.winSize.height/4);
                this.addChild(this.imgTiket,1);

                var label = new cc.LabelBMFont(num,"res/font/gold_mp.fnt");
                label.setPosition(this.imgTiket.width*0.68,this.imgTiket.height*0.85);
                this.imgTiket.addChild(label,1);

                var self = this;
                if(delayRemove){
                    var action = cc.sequence(cc.delayTime(3),cc.callFunc(function(node){
                        node.removeFromParent(true);
                        self.imgTiket = null;
                    }));
                    this.imgTiket.runAction(action);
                }
            }
        }else if(this.imgTiket){
            this.imgTiket.removeFromParent(true);
            this.imgTiket = null;
        }
    },

    showNiaoPanel:function(data){
        //cc.log("showNiaoPanel=====",JSON.stringify(data))
        var sbirdList = {
            1:[1,5,9],
            2:[2,6],
            3:[3,7],
            4:[4,8]
        };
        if (MJRoomModel.is159Bird()){
            sbirdList = {
                1:[1,5,9],
                2:[1,5,9],
                3:[1,5,9],
                4:[1,5,9]
            };
        }
        var mainseq = data.catchBirdSeat || 0;
        var nowSeq = 0;
        if (mainseq){
            nowSeq =  MJRoomModel.getPlayerSeq("", mainseq, MJRoomModel.mySeat);
        }
        var nowBirdList = [];
        if (nowSeq && nowSeq >= 1 && nowSeq <= 4){
            nowBirdList = sbirdList[nowSeq];
        }
        var listSize = this.Panel_niaoPai.getContentSize();
        var birdList = data.bird || [];

        //用于不中鸟算全中的判断
        var iszhongniao = false;
        for(var i = 0;i<birdList.length;++i){
            var vo = MJAI.getMJDef(birdList[i]);
            var idIndex = vo.i%10;
            for(var j=0;j<nowBirdList.length;j++) {
                if (idIndex == nowBirdList[j] || vo.i == 201 || MJRoomModel.isOneBird()){
                    iszhongniao = true;
                    break;
                }
            }
            if(iszhongniao)break;
        }

        if (birdList && birdList.length > 0){
            for(var i = 0;i < birdList.length; i++) {
                var diff2 = Math.ceil(i / 2);
                var diff1 = Math.floor(i % 2) ? 1 : -1;
                var vo = MJAI.getMJDef(birdList[i]);
                var card = new HZMahjong(MJAI.getDisplayVo(1, 1), vo);
                var size = card.getContentSize();
                card.x = -listSize.width*0.2 + (size.width + 40) * diff1 * diff2  + diff1*80;
                card.y = 0;
                this.Panel_niaoPai.addChild(card, i + 1);
                var idIndex = vo.i%10;
                for(var j=0;j<nowBirdList.length;j++) {
                    if (idIndex == nowBirdList[j] || vo.i == 201 || MJRoomModel.isOneBird() || (MJRoomModel.intParams[30] && !iszhongniao)){
                        var niaoKuang = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_22.png");
                        niaoKuang.x = size.width*0.5;
                        niaoKuang.y = size.height*0.5;
                        niaoKuang.scale = 1.8;
                        card.addChild(niaoKuang, 5);

                        var niaoSprite = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_25.png");
                        niaoSprite.x = size.width*0.25;
                        niaoSprite.y = size.height*0.85;
                        //niaoSprite.setRotation(-45);
                        card.addChild(niaoSprite, 10);
                        break;
                    }
                }
            }
            var znSprite = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_24.png");
            znSprite.x = listSize.width*0.5 + 70;
            znSprite.y = listSize.height*0.5;
            //znSprite.scale = 1.52;
            this.Panel_niaoPai.addChild(znSprite, 5);
        }

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
            this.cleanButtonAni();
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
                var card = new HZMahjong(MJAI.getDisplayVo(1,4),huArray[key]);
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
        var textRenderer =  new cc.LabelTTF("剩 "+MJRoomModel.remain+" 张", "", 40);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo("剩 ",cc.color("#84c7d5"),40));
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.remain+"",cc.color("#fff29a"),40));
        ele1.push(RichLabelVo.createTextVo(" 张",cc.color("#84c7d5"),40));
        var label = new RichLabel(cc.size(200,40));
        label.setLabelString(ele1);
        label.x = (this.Image_info2.width-textRenderer.getContentSize().width)/2;
        label.y = 5;
        this.Image_info2.addChild(label,1,999);
        if (MJRoomModel.remain == 4) {
            FloatLabelUtil.comText("最后四张");
            //var winSize = cc.director.getWinSize();
            //var last4 = new cc.Sprite("res/res_mj/mjRoom/last4.png");
            //last4.x = winSize.width/2+42;
            //last4.y = winSize.height/2;
            //this.root.addChild(last4,9999);
            //last4.runAction(cc.sequence(cc.delayTime(3),cc.fadeOut(2),cc.callFunc(function() {
            //    last4.removeFromParent(true);
            //})));
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
            this.Button_tuichu.x = 960
            this.setInviteBtnState();
        }

        if(MJRoomModel.isMoneyRoom()){
            this.btnInvite.visible = false;
        }
    },

    getFontColorByBgColor:function(bgColor){
        var bgColor = parseInt(bgColor);
        var fontColor = [];
        switch (bgColor){
            case 1:
                fontColor = cc.color("#5ec3a9");
                break;
            case 2:
                fontColor = cc.color("#5ec3a9");
                break;
            case 3:
                fontColor = cc.color("#5ec3a9");
                break;
            default:
                fontColor = cc.color("#5ec3a9");
                break;
        }
        return fontColor;
    },


    updateRoomInfo:function(color){
        var color = color || this.bgColor;
        var fontColor = this.getFontColorByBgColor(color);
        // cc.log("fontColor =",JSON.stringify(fontColor));
        this.getWidget("Label_time").setColor(fontColor);
        this.Label_info0.setColor(fontColor);
        this.getWidget("label_version").setColor(fontColor);
        this.updateRemain();

        // var wanfaStr = ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams,0,1,MJRoomModel.isMoneyRoom());

        // if(MJRoomModel.isMatchRoom()){
        //     wanfaStr = wanfaStr.replace(/ .*支付/,"");
        // }

        this.Label_info_mj.setString("");
        this.Image_info1.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF("第 "+MJRoomModel.nowBurCount+"/"+MJRoomModel.totalBurCount+" 局", "", 40);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo("第 ", cc.color("#84c7d5"),40));
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.nowBurCount+"/"+MJRoomModel.totalBurCount,cc.color("#fff29a"),40));
        ele1.push(RichLabelVo.createTextVo(" 局", cc.color("#84c7d5"),40));

        if(MJRoomModel.isMoneyRoom()){
            ele1 = [];
            ele1.push(RichLabelVo.createTextVo("底分:",cc.color("73a8d7"),40));
            ele1.push(RichLabelVo.createTextVo(MJRoomModel.goldMsg[2],cc.color("#d3dc6f"),40));
        }

        var label = new RichLabel(cc.size(300,40),1);
        label.setLabelString(ele1);
        label.x = (this.Image_info1.width-textRenderer.getContentSize().width)/2;
        label.y = 5;
        this.Image_info1.addChild(label,1,999);
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
                chiVo.se = action;
                if(action==MJAction.CHI){
                    chiVo.ids = [chiArr[0].c,chiArr[2].c];
                }else if(action==MJAction.XIA_DAN){
                    var danIds = [];
                    for(var d=0;d<chiArr.length;d++){
                        danIds.push(chiArr[d].c);
                    }
                    chiVo.ids = danIds;
                }else{
                    chiVo.ids = [chiArr[0].c];
                }
                var mahjong = new HZMahjong(MJAI.getDisplayVo(1,3),chiVo);
                mahjong.scale=scale;
                mahjong.x = initX+75*scale*count;mahjong.y = 3;
                bg.addChild(mahjong);
                //if(action==MJAction.CHI && j==1){
                //    var huang = new cc.Scale9Sprite("res/res_mj/img_52.png");
                //    huang.setContentSize(52*scale,76);
                //    huang.x = 26;huang.y=38;
                //    mahjong.addChild(huang);
                //}
                count++;
            }
        }
        this.Panel_btn.addChild(bg,1,123);
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
            case MJAction.HU:
                MJRoomModel.sendPlayCardMsg(1,[]);
                break;
            case MJAction.TING:
                MJRoomModel.nextSeat = MJRoomModel.mySeat;
                MJRoomModel.isTingSelecting = true;
                MJRoomModel.nearestTingResult.length = 0;
                this.Panel_btn.visible = false;
                this.cleanButtonAni();
                this.btn_back.visible = true;
                this.findPutOutByTing();
                //this.startCheckTing();
                break;
            case MJAction.PENG:
            case MJAction.GANG:
            case MJAction.AN_GANG:
            case MJAction.BU_ZHANG:
                //cc.log("MJAction.GANG==========",MJAction.GANG)
                var ids = [];
                var myLayout = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId));
                var allMJs = myLayout.getPlace1Data();
                if(allMJs.length%3==2){//摸牌了，手上的牌和摊开的牌都需要找一遍
                    var result = MJAI.getGang(allMJs,myLayout.getPlace2Data());
                    if(result.length>1){
                        this.displaySelectMahjongs(temp,result);
                    }else{
                        var result0 = result[0];
                        for(var i=0;i<result0.length;i++){
                            ids.push(result0[i].c);
                        }
                        MJRoomModel.sendPlayCardMsg(temp,ids);
                    }
                }else{//别人出牌,我可以碰、杠
                    var lastVo = MJAI.getMJDef(this.lastLetOutMJ);
                    for(var i=0;i<allMJs.length;i++){
                        var vo = allMJs[i];
                        if(vo.t==lastVo.t&&vo.n==lastVo.n)
                            ids.push(vo.c);
                        if(ids.length>=temp)
                            break;
                    }
                    MJRoomModel.sendPlayCardMsg(temp,ids);
                }
                break;
            case MJAction.GUO:
                var allButtons = [];
                for(var i=0;i<MJRoomModel.selfAct.length;i++){
                    if(MJRoomModel.selfAct[i]==1)
                        allButtons.push(i);
                }
                //只有一个听的选择，是前台自己加上去的，点过时，前台自己处理，不给后台发送消息
                if(MJRoomModel.selfAct[7]==1&&allButtons.length==1){
                    this.Panel_btn.visible = false;
                    this.cleanButtonAni();
                    MJRoomModel.nextSeat = MJRoomModel.mySeat;
                    MJRoomModel.selfAct.length=0;
                }else{
                    var allMJs = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
                    var guoParams = (allMJs.length%3==2) ? [1] : [0];
                    ArrayUtil.merge(MJRoomModel.selfAct,guoParams);
                    if(obj.hasHu){
                        //Network.logReq("MJRoom::guo click...1");
                        AlertPop.show("当前为可胡牌状态，确定要选择【过】吗？",function(){
                            //Network.logReq("MJRoom::guo click...2");
                            MJRoomModel.sendPlayCardMsg(5,guoParams);
                        });
                    }else{
                        //Network.logReq("MJRoom::guo click...3");
                        MJRoomModel.sendPlayCardMsg(5,guoParams);
                    }
                }
                break;
            case MJAction.CHI:
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
    startGame:function(event){
        //this.Label_info_mj.y = 160;
        this.Panel_20.getChildByName("Label_info_mj").setVisible(true);
        this.Panel_20.getChildByName("Image_info1").setVisible(true);
        this.Panel_20.getChildByName("Image_info2").setVisible(true);
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
        this.btnInvite.visible = this.btnReady.visible = this.Button_tuichu.visible =false;
        var p = event.getUserData();
        this.showJianTou();
        this.updateCountDown(this.COUNT_DOWN);
        var direct = MJRoomModel.getPlayerSeq(PlayerModel.userId,MJRoomModel.mySeat,MJRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[],null,null,true);
        this.hideAllBanker();
        this._players[p.banker].isBanker(true);
        //其他3人手上的牌
        for(var i=1;i<=MJRoomModel.renshu;i++){
            if(i != MJRoomModel.mySeat){
                var d = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,i);
                var iseat = (i==p.banker) ? i : null;
                this.initCards(d,[],[],[],[],iseat,null,true);
            }
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
        var isTing = false;
        //if(p.handCardIds.length%3==2)
        //    isTing = this.checkTingPai(p.selfAct,true);
        if(!isTing)
            this.refreshButton(p.selfAct);

        this.showPiaoBtn(false);
        this.showWaitSelectPiao(false);
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
            this.piaofenTime = null;
        }

        // var self = this;
        // setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
        if(this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(false);
        }
        this.Panel_niaoPai.removeAllChildren();
        // },100);

        if(MJRoomModel.isMoneyRoom()){
            this.moneyRoomShowTiket(true,MJRoomModel.goldMsg[0],true);

            this.moneyRoomShowLeaveBtn(false);
            this.moneyRoomShowWaitAni(false);
        }
    },

    NeedXipai: function () {
        this.Panel_niaoPai.removeAllChildren(true);
        this.Panel_8.visible = false;
        this.Panel_20.getChildByName("Label_info_mj").setVisible(false);
        for (var i = 1; i <= MJRoomModel.renshu; i++) {
            this.getWidget("cp" + i).visible = false;
            this.getWidget("oPanel" + i).removeAllChildren(true);
            this.getWidget("mPanel" + i).visible = false;
            var layout = this.layouts[i];
            if (layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        this.Panel_hupai.visible = false;
        this.xipaiAni();
        this.addTipLabel();
    },

    addTipLabel:function(){
        if(BaseXiPaiModel.isNeedXiPai){
            var nameList = BaseXiPaiModel.nameList || [];
            var LabelStr = "";
            for(var i = 0;i < nameList.length;++i){
                if(nameList[i]){
                    if(LabelStr == ""){
                        LabelStr += nameList[i]
                    }else{
                        LabelStr += "、" + nameList[i];
                    }
                }

            }
            if(LabelStr != ""){
                if(!this.tipLabelStr){
                    this.tipLabelStr = new cc.LabelTTF("", "", 45);
                    this.tipLabelStr.x = 960;
                    this.tipLabelStr.y = 620;
                    this.addChild(this.tipLabelStr,100);
                }
                this.tipLabelStr.visible = true;
                this.tipLabelStr.setString("玩家 "+LabelStr+" 正在洗牌");
            }
        }
    },

    clearXiPai:function(){
        if (this.actionnode) {
            this.actionnode.removeAllChildren();
            delete this.actionnode;
        }
        if (this.actionnode2) {
            this.actionnode2.removeAllChildren();
            delete this.actionnode2;
        }
        if (this.getChildByName("caishendao")) {
            this.removeChildByName("caishendao");
        }
        if(this.tipLabelStr){
            this.tipLabelStr.visible = false;
        }
        for (var i = 1; i <= MJRoomModel.renshu; i++) {
            this.getWidget("mPanel" + i).visible = true;
        }
        if(BaseXiPaiModel.isNeedXiPai){
            PlayMJMessageSeq.playNextMessage();
        }
        BaseXiPaiModel.isNeedXiPai = false;
    },

    xipaiAni: function () {
        if (this.actionnode) {
            this.actionnode.removeAllChildren();
        }
        this.actionnode = new cc.Node();
        this.addChild(this.actionnode, 10);
        this.actionnode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 300);

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/jnqp/jnqp.ExportJson");
        var ani = new ccs.Armature("jnqp");
        ani.setAnchorPoint(0.5, 0.5);
        ani.setPosition(cc.winSize.width / 2 - 50, cc.winSize.height / 2 + 300);
        ani.getAnimation().play("Animation1");
        ani.setName("caishendao")
        this.addChild(ani);
        for (var index = 0; index < 15; index++) {
            var back_card = new cc.Sprite("res/res_mj/mjRoom/action_card1.png");
            back_card.scale = 1.2;
            back_card.setPosition(cc.winSize.width / 2 - 80, 500);
            this.actionnode.addChild(back_card);
            var action = this.xipaiAction(index)
            back_card.setRotation(-60)
            back_card.runAction(action);
        }
    },

    xipaiAction: function (index, type) {
        var self = this;
        var action = cc.sequence(
            cc.delayTime(0.1 * index),
            cc.spawn(cc.moveTo(0.15, 600, cc.winSize.height / 2 - 300), cc.rotateTo(0.15, 0)),
            cc.moveTo(0.1, -500 + 70 * index, cc.winSize.height / 2 - 300),
            cc.callFunc(function () {
                if (index == 14) {
                    self.actionnode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 500);
                    self.xipaiAni2();
                }
            })
        );
        return action;
    },

    xipaiAni2: function () {
        if (this.actionnode2) {
            this.actionnode2.removeAllChildren();
        }
        this.actionnode2 = new cc.Node();
        this.addChild(this.actionnode2, 10);
        this.actionnode2.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 300);
        for (var index = 0; index < 15; index++) {
            var back_card = new cc.Sprite("res/res_mj/mjRoom/action_card1.png");
            back_card.scale = 1.2;
            back_card.setPosition(cc.winSize.width / 2 - 80, 500);
            this.actionnode2.addChild(back_card);
            var action = this.xipaiAction2(index)
            back_card.setRotation(-60)
            back_card.runAction(action);
        }

    },

    xipaiAction2: function (index, type) {
        var self = this;
        var action = cc.sequence(
            cc.delayTime(0.1 * index),
            cc.spawn(cc.moveTo(0.15, 600, cc.winSize.height / 2 - 300), cc.rotateTo(0.15, 0)),
            cc.moveTo(0.1, -500 + 70 * index, cc.winSize.height / 2 - 300),
            cc.callFunc(function () {
                if (index == 14) {
                    self.actionnode2.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 460);
                }
            }),
            cc.delayTime(0.2),
            cc.callFunc(function () {
                if (index == 14) {
                    self.actionnode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 400);
                    self.actionnode2.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 360);
                }
            }),
            cc.delayTime(0.2),
            cc.callFunc(function () {
                if (index == 14) {
                    self.actionnode.removeAllChildren();
                    self.actionnode2.removeAllChildren();
                    sySocket.sendComReqMsg(3);
                    self.clearXiPai();
                }
            })
        );
        return action;
    },
    //refreshXiaoHu:function(xiaohu){
    //    this.Image_xiaohu.visible = false;
    //    if(xiaohu && xiaohu.length>0){
    //        for(var i=0;i<xiaohu.length;i++){
    //            if(xiaohu[i]==1){
    //                this.Image_xiaohu.visible = true;
    //                this.Button_xiaohu.loadTextureNormal("res/res_mj/btn_cs_xiaohu_"+(i+1)+".png");
    //                break;
    //            }
    //        }
    //    }
    //},
    /**
     *
     * @param selfAct {Array.<number>}
     */
    cleanButtonAni:function(){
        for (var k = 0; k < this.hbtns.length; k++) {
            if(this.hbtns[k].getChildByName("buttonAni")){
                this.hbtns[k].removeChildByName("buttonAni");
            }
        }
    },
    refreshButtonForYLC:function(selfAct){
        if(selfAct.length>0){
            this.resetBtnPanel();
            this.Panel_btn.visible = true;
            var textureMap = {
                0:{t:"res/res_mj/mjRoom/mj_btn_hu.png",v:1},
                1:{t:"res/res_mj/mjRoom/mj_btn_peng.png",v:2},
                2:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:3},
                3:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:4},
                4:{t:"res/res_mj/mjRoom/mj_btn_chi.png",v:6},
                5:{t:"res/res_mj/mjRoom/mj_btn_hu.png",v:1},
                7:{t:"res/res_mj/mjRoom/mj_btn_ting.png",v:21}
            };
            var aniResMap ={
                0:{t:"btmjhu"},
                1:{t:"btmjpeng"},
                2:{t:"btmjgang"},
                3:{t:"btmjgang"},
                4:{t:"btmjchi"},
                5:{t:"btmjhu"},
                7:{t:"btmjting"}
            };
            var rIndex=0;
            var hasHu = false;
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
                    if(selfAct[i] == 1) {
                        btnCount++;
                    }
                }
            }
            if(btnCount <= 0) {
                this.Panel_btn.visible = false;
                this.cleanButtonAni();
                return;
            }
            var textureLog = "";
            //过
            this.hbtns[rIndex].visible = true;
            this.hbtns[rIndex].loadTextureNormal("res/res_mj/mjRoom/ylc_mjguo.png");
            this.hbtns[rIndex].temp = 5;
            this.hbtns[rIndex].hasHu = hasHu;
            rIndex++;
            var localStartX = this.hbtns[0].x;//第一个按钮位置
            var offsetX = 250;//按钮间隔
            var localCount = 1;//设置位置的按钮下标
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp==1 && tm){
                    this.hbtns[rIndex].visible = true;
                    this.hbtns[rIndex].temp = parseInt(tm.v);
                    this.hbtns[rIndex].x = localStartX - offsetX * localCount;
                    var armature = new ccs.Armature(aniResMap[i].t);
                    armature.getAnimation().play("Animation1", -1, -1);
                    this.hbtns[rIndex].addChild(armature);
                    armature.x = this.hbtns[rIndex].width/2;
                    armature.y = this.hbtns[rIndex].height/2 - 30;
                    armature.setName("buttonAni");
                    ++localCount;
                    rIndex++;
                    textureLog+=tm.t+",";
                }
            }
            for(;rIndex<6;rIndex++){
                this.hbtns[rIndex].visible = false;
            }
            if (selfAct[0] == 1){
                var mineHandCards = MJRoomModel.mineLayout.getPlace1Data();
                //有炮必胡
                if ((mineHandCards.length%3 == 1) && (MJRoomModel.intParams[15] == 1)){
                    this.hbtns[0].visible = false;
                }
            }
        }
    },
    refreshButtonForNormal:function(selfAct){
        if(selfAct.length>0){
            this.resetBtnPanel();
            this.Panel_btn.visible = true;
            var textureMap = {
                0:{t:"res/res_mj/mjRoom/mj_btn_hu.png",v:1},
                1:{t:"res/res_mj/mjRoom/mj_btn_peng.png",v:2},
                2:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:3},
                3:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:4},
                4:{t:"res/res_mj/mjRoom/mj_btn_chi.png",v:6},
                5:{t:"res/res_mj/mjRoom/mj_btn_hu.png",v:1},
                7:{t:"res/res_mj/mjRoom/mj_btn_ting.png",v:21}
            };
            var rIndex=0;
            var hasHu = false;
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
            //if(btnCount == 1 && selfAct[7] == 1){//只有听牌按钮时不显示过
            //    this.hbtns[rIndex].visible = false;
            //}
            rIndex++;
            var localStartX = this.hbtns[0].x;//第一个按钮位置
            var offsetX = 250;//按钮间隔
            var localCount = 1;//设置位置的按钮下标
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp==1 && tm){
                    this.hbtns[rIndex].visible = true;
                    this.hbtns[rIndex].loadTextureNormal(tm.t);
                    this.hbtns[rIndex].temp = parseInt(tm.v);
                    this.hbtns[rIndex].x = localStartX - offsetX * localCount;
                    ++localCount;
                    //this.lastBtnX = this.hbtns[rIndex].x;
                    rIndex++;
                    textureLog+=tm.t+",";
                }
            }
            //this.hbtns[rIndex].visible = true;
            //this.hbtns[rIndex].loadTextureNormal("res/res_mj/img_4.png");
            //this.hbtns[rIndex].temp = 5;
            for(;rIndex<6;rIndex++){
                this.hbtns[rIndex].visible = false;
            }
            if (selfAct[0] == 1){
                var mineHandCards = MJRoomModel.mineLayout.getPlace1Data();
                //有炮必胡
                if ((mineHandCards.length%3 == 1) && (MJRoomModel.intParams[15] == 1)){
                    this.hbtns[0].visible = false;
                }
            }
        }
    },
    refreshButton:function(selfAct){
        // cc.log("selfAct =",JSON.stringify(selfAct));
        MJRoomModel.selfAct = selfAct || [];
        if(MJRoomModel.isMoneyRoom()){
            this.refreshButtonForYLC(selfAct);
        }else{
            this.refreshButtonForNormal(selfAct);
        }
    },

    onGetMajiang:function(event){
        var message = event.getUserData();
        var seat = message.seat;
        MJRoomModel.nextSeat = seat;
        var selfAct = message.selfAct;//[胡,碰,刚]
        var ids = message.majiangIds;
        this.showJianTou(seat);
        //this.refreshButton(selfAct);
        var id = ids.length>0 ? ids[0] : 0;
        this.getLayout(MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat)).moPai(id);
        if(MJRoomModel.isGSMJ() || MJRoomModel.isGuCang()){
            var isTing = false;
            //if (seat == MJRoomModel.mySeat && !MJRoomModel.isTing()) {
            //    isTing = this.checkTingPai(selfAct,true);
            //}
            if(!isTing)
                this.refreshButton(selfAct);
            MJRoomModel.remain=message.remain;
            if((MJRoomModel.isTing(seat) || MJRoomModel.isHued(seat)) && seat==MJRoomModel.mySeat && id>0){//直接出牌
                MJRoomModel.needAutoLetOutId = id;
            }
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
    chuPaiAction:function(id,seat,direct,userId,endPos){
        cc.log("chuPaiAction endPos = ",JSON.stringify(endPos));
        this.lastLetOutMJ = id;
        this.lastLetOutSeat = seat;
        if(this.lastLetOutMJ==MJRoomModel.needAutoLetOutId)//清理掉自动出牌的值
            MJRoomModel.needAutoLetOutId = 0;
        var vo = MJAI.getMJDef(id);
        this.showJianTou(-1);
        MJRoomSound.letOutSound(userId,vo);
        this.layouts[direct].chuPai(vo,null,endPos);
        if(MJRoomModel.isMoneyRoom() && direct==1){

        }else{
            this._players[seat].chuPai(vo);
        }
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
        this.cleanButtonAni();
        for(var lay in this.layouts){
            this.layouts[lay].hideFinger();
        }
        this.updateRemain();
        switch (action){
            case MJAction.CHU_PAI://出牌动作
                //刷新一下玩家状态
                this._players[seat].setPlayerOnLine();
                if(isOtherHasAction==0){
                    var nextSeat = MJRoomModel.seatSeq[seat][1];
                    MJRoomModel.nextSeat = nextSeat;
                }
                if(ids.length>0){
                    this.chuPaiAction(ids[0],seat,direct,userId,message.endPos);
                }
                break;
            case MJAction.HU://胡牌动作
                var lastId = ids[ids.length-1];
                this.layouts[direct].huPai(ids,message.zimo,message.fromSeat);
                //var huArray = message.huArray;
                var prefix = (message.zimo==1) ? "zimo" : "hu";
                if(MJRoomModel.isMoneyRoom()){
                    MJRoomEffects.normalActionForYLC(this.root,prefix,this.getWidget("cp"+direct),direct);
                }else{
                    MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
                }
                MJRoomSound.actionSound(userId,prefix);
                MJRoomModel.hued(seat, {action:(message.zimo==1) ? 0 : 1,cards:[lastId]});
                cc.log("message.fromSeat =",message.fromSeat);
                if(message.fromSeat){
                    var fromDirect = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].playDianPaoEff();
                    this.layouts[fromDirect].beiPengPai(lastId);
                }

                var loseActionArray = [];
                var zhuangTarget = this._players[seat];
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
                //this.layouts[direct].xiaohu(ids);
                //var huArray = message.huArray;
                //MJRoomEffects.normalAction(this.root,"btn_cs_xiaohu_"+huArray[0],this.getWidget("cp"+direct));
                break; 
            case MJAction.TING://听牌特殊处理，先出牌，再播听牌动画
                prefix = "ting";
                MJRoomModel.ting(seat);
                var self = this;
                this._players[seat].tingPai();
               /* if(MJRoomModel.isTrusteeship){//托管状态
                    this._players[seat].unTingPai();
                }*/
                if(MJRoomModel.isMoneyRoom()){
                    MJRoomEffects.normalActionForYLC(this.root,prefix,this.getWidget("cp"+direct),direct);
                }else{
                    MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
                }
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
                if(MJRoomModel.isMoneyRoom()){
                    MJRoomEffects.normalActionForYLC(this.root,prefix,this.getWidget("cp"+direct),direct);
                }else{
                    MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
                }
                if(message.fromSeat){
                    var fromDirect = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].beiPengPai(beiPengId);
                }
                MJRoomModel.nextSeat = seat;
                this.showJianTou();
                MJRoomSound.actionSound(userId,prefix);
                break;
        }
        if(MJRoomModel.isMoneyRoom() && seat == MJRoomModel.mySeat){
            this.Panel_hupai.setVisible(false);
        }
        this.refreshButton(selfAct);
        this.clearTingArrows();
        // this.removeHuPanel();
        PlayMJMessageSeq.finishPlay();
    },

    refreshTingNum:function(card){
        var num = 4;

        if(card._cardVo.i == 201 && MJRoomModel.intParams[31]){
            num = 8;//八红中选项
        }

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
                var card = new HZMahjong(MJAI.getDisplayVo(1,4),list[key]);
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
        var wanfa = "红中麻将";
        var queZi = MJRoomModel.renshu + "缺"+(MJRoomModel.renshu - MJRoomModel.players.length);
        var obj={};
        obj.tableId=MJRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+MJRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+MJRoomModel.tableId+"] "+queZi;

        var youxiName = "红中麻将";
        if(MJRoomModel.tableType == 1){
            youxiName = "[亲友圈]红中麻将"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,MJRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    onJoin:function(event){
        var p = event.getUserData();
        var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
        this._players[p.seat] = new MJPlayer(p,this.root,seq);
        var me = MJRoomModel.getPlayerVo();
        this.setInviteBtnState();
        var seats = MJRoomModel.isIpSame();
        if(seats.length>0  && MJRoomModel.renshu != 2 && !MJRoomModel.isMoneyRoom()){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
            PopupManager.addPopup(new GpsPop(MJRoomModel , MJRoomModel.renshu));
        }

        if(MJRoomModel.isMoneyRoom()){
            this.btnInvite.visible = false;

            var isShow = (ObjectUtil.size(this._players)<MJRoomModel.renshu);
            this.moneyRoomShowLeaveBtn(isShow);
        }
    },

    setInviteBtnState:function(){
        // this.btnInvite.visible = (MJRoomModel.players.length < MJRoomModel.renshu);
        this.btnInvite.visible = false;;

        if(MJRoomModel.isMatchRoom()){
            this.btnInvite.setVisible(false);
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        if(MJRoomModel.isMoneyRoom()){
            layout = new HZMJ_YLCLayout();
        }else{
            layout = new HZMJLayout();
        }
        this.layouts[direct] = layout;
        return layout;
    },

    showJianTou:function(seat){
        this.jt.visible = true;
        seat = seat || MJRoomModel.nextSeat;
        for(var i=1;i<=4;i++){
            this.getWidget("jt"+i).visible = false;
        }
        if(seat != -1 && seat!=null && seat > 0){
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
    initCards:function(direct,p1Mahjongs,p2Mahjongs,p3Mahjongs,p4Mahjongs,bankerSeat,isMoPai,showAction){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),this.getWidget("hPanel"+direct),this.actionNodeArr[direct-1],showAction);
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
