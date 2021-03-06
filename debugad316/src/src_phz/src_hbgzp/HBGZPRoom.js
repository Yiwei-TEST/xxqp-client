/**
 * Created by zhoufan on 2016/11/7.
 */
var HBGZPRoom = BaseLayer.extend({ //BaseLayer BaseRoom
    layouts:{},
    tag_btn_chi:601,
    tag_btn_liu:602,
    tag_btn_other:501,
    tag_chi_select:343,
    _loacationDt:0,
    tag_paidun:666,
    temp_chi_data:{},
    temp_chi_select_map:{},
    COUNT_DOWN: 9,
    showSparePaiTimeOutHandle:null,
    showResultTimeOutHandle:null,
    showOutCardTimeOutHandle:null,
    checkTingTimeOutHandle:null,
    showTuoGuanTimeOutHandle:null,

    ctor:function(json){

        this.layouts = {};
        this.temp_chi_data = {};
        this.temp_chi_select_map = {};
        this.lastLetOutMJ = 0;
        this.lastLetOutSeat = 0;
        this._dt = 0;
        this._loacationDt = 0;
        this._countDown = HBGZPRoomModel.intParams[8] || 30;
        this._timedt = 0;
        this.lastBtnX = 0;
        this.showTuoGuanTimeOutHandle = null;
        this._super(json);
        this.isChiBianDaBian = false;
        this.lastSelectChiBg ={};

        this.outTingInfo =[];
        this.CanClealTingImg = true;

        this.guoChiVals = [];

        this.kehushizhong = false;
    },

    isForceRemove:function(){
        return true;
    },

    onRemove:function(){
        this.hbgzpGuanArray = [];
        HBGZPRoomModel.mineRoot = null;
        this.isShowReadyBtn = true;
        //this.fingerArmature.getAnimation().stop();
        this.unscheduleUpdate();
        this._players=null;
    },

    selfRender:function(){
        HBGZPSetModel.init();

        var bgMusic = 2;
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,bgMusic);

        WXHeadIconManager.loadedIconListInRoom = [];
        this.timeDirect = 1;
        this.isShowAlert = false;
        this.isShowReadyBtn = true;
        for(var i=1;i<=6;i++){
            if(i<=HBGZPRoomModel.renshu){
                var p = this.getWidget("player"+i);
                var icon = this.getWidget("icon"+i);
                UITools.addClickEvent(p,this,this.onPlayerInfo);
            }
        }
        this.Image_phzBg = this.getWidget("Image_bg");//???????????????
        this.Panel_20 = this.getWidget("Panel_20");//??????
        this.Image_phz = this.getWidget("Image_phz");//???????????????
        this.Image_phzdetail = this.getWidget("Image_phzdetail");
        this.Image_manbai = this.getWidget("Image_manbai");
        this.Image_qihu = this.getWidget("Image_qihu");
        this.btnPanel = this.getWidget("btnPanel");
        this.Image_time = this.getWidget("Image_time");
        this.Image_time.visible = false;
        this.fapai = this.getWidget("fapai");
        this.Label_remain = this.getWidget("Label_remain");
        this.Label_info = this.getWidget("Label_info");//????????????

        this.Label_info.visible = false;

        if (HBGZPRoomModel.intParams[7] == 4) {
            this.Button_7 = this.getWidget("Button_7");//????????????
            this.Button_6 = this.getWidget("Button_6");//????????????
            UITools.addClickEvent(this.Button_7,this,this.onLeave);
            UITools.addClickEvent(this.Button_6,this,this.onBreak);
            //this.battery = this.getWidget("battery");//??????
            this.Image_set = this.getWidget("Image_set");
            this.Button_sset = this.getWidget("Button_sset");//????????????
            UITools.addClickEvent(this.Button_sset,this,this.onShowSet);
        }

        this.getWidget("label_version").setString(SyVersion.v);
        this.Label_batteryPer = this.getWidget("Label_batteryPer");
        this.roomName_label = new cc.LabelTTF("","Arial",40,cc.size(500, 50));
        this.Panel_20.addChild(this.roomName_label, 2);
        if (HBGZPRoomModel.roomName){
            this.roomName_label.setString(HBGZPRoomModel.roomName);
            this.roomName_label.setColor(cc.color(255,255,255));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = 850 * 1.5;
            this.roomName_label.y = cc.winSize.height - 30;
        }

        this.battery = new cc.Sprite("res/res_phz/tx_battery_full.png");//this.getWidget("battery");//??????
        this.battery.anchorX = 0;
        this.battery.x = 8;
        this.battery.y = 18.5;
        this.getWidget("batteryBg").addChild(this.battery);
        this.Label_jushu = this.getWidget("Label_jushu");
        this.Label_fh = this.getWidget("Label_fh");
        this.label_payType = this.getWidget("Label_payType");
        this.lable_GameName = this.getWidget("Label_gameName");
        this.lable_renshu = this.getWidget("Label_renshu");
        this.Label_11 = this.getWidget("Label_11");//??????
        this.Button_75 = this.getWidget("Button_75");//??????
        this.Button_52 = this.getWidget("Button_52");//????????????
        this.Button_53 = this.getWidget("Button_53");//??????

        this.button_wanfa =  new ccui.Button("res/res_phz/res_hbgzp/wanfa.png","","");
        this.Panel_20.addChild(this.button_wanfa);
        this.button_wanfa.y = this.Label_11.y - 30;
        this.button_wanfa.x = this.Label_11.x + 120;
        if(HBGZPRoomModel.renshu === 4){
            this.button_wanfa.y = 1015;
            this.button_wanfa.x = 1485;
        }
        UITools.addClickEvent(this.button_wanfa,this,this.showWanFaImg);
        this.initwanfaImg();
        this.showWanFaImg();

        this.Button_ready = this.getWidget("Button_ready");//??????
        this.Button_invite = this.getWidget("Button_invite");//????????????
        if(!(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName)){
            this.Button_invite.setScale(1.2);
        }
        //this.Button_sset = this.getWidget("Button_sset");//????????????
        this.yuyin = this.getWidget("yuyin");//????????????
        this.Image_hdx = this.getWidget("Image_hdx");//??????????????????
        this.Image_hdx.visible = false;
        this.netType = this.getWidget("netType");//????????????
        if((HBGZPRoomModel.renshu == 2 || HBGZPRoomModel.renshu == 3)){
            this.Button_qihu = this.getWidget("Button_qihu");
            this.Button_qihu.visible = false;
            UITools.addClickEvent(this.Button_qihu,this,this.sendQiHu);
        }

        this.Panel_daniao = this.getWidget("Panel_daniao");//??????panel
        this.Panel_daniao.visible = false;
        this.Button_bdn = this.getWidget("Button_bdn");//???????????????
        this.Button_bdn.temp = 0;
        this.Button_dn20 = this.getWidget("Button_dn20");//??????20?????????
        this.Button_dn20.temp = 20;
        this.Button_dn50 = this.getWidget("Button_dn50");//??????50???
        this.Button_dn50.temp = 50;
        this.Button_dn100 = this.getWidget("Button_dn100");//??????100???
        this.Button_dn100.temp = 100;
        this.Button_dn = this.getWidget("Button_dn");//????????????
        this.Button_dn.temp = 1;

        UITools.addClickEvent(this.Panel_20,this,this.onCloseOperateFace);/** ???????????????????????????????????????????????? **/
        UITools.addClickEvent(this.Button_bdn,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn20,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn50,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn100,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn,this,this.onDaNiao);


        this.Panel_piaofen = this.getWidget("Panel_piaofen");//??????panel
        this.Panel_piaofen.visible = false;
        this.Button_bp = this.getWidget("Button_bp");//???????????????
        this.Button_bp.temp = 0;
        this.Button_p1f = this.getWidget("Button_p1f");//???1?????????
        this.Button_p1f.temp = 1;
        this.Button_p2f = this.getWidget("Button_p2f");//???2???
        this.Button_p2f.temp = 2;
        this.Button_p3f = this.getWidget("Button_p3f");//???3???
        this.Button_p3f.temp = 3;
        this.Button_p5f = this.getWidget("Button_p5f");//???5???
        this.Button_p5f.visible = false;
        UITools.addClickEvent(this.Button_bp,this,this.onPaoFen);
        UITools.addClickEvent(this.Button_p1f,this,this.onPaoFen);
        UITools.addClickEvent(this.Button_p2f,this,this.onPaoFen);
        UITools.addClickEvent(this.Button_p3f,this,this.onPaoFen);

        this.Panel_chui = this.getWidget("Panel_chui");//
        this.Panel_chui.visible = false;
        this.Button_bc = this.getWidget("Button_bc");//
        this.Button_bc.temp = 0;
        this.Button_chui = this.getWidget("Button_chui");//
        this.Button_chui.temp = 1;
        UITools.addClickEvent(this.Button_bc,this,this.onChui);
        UITools.addClickEvent(this.Button_chui,this,this.onChui);


        UITools.addClickEvent(this.Button_invite,this,this.onInvite);
        UITools.addClickEvent(this.Button_ready,this,this.onReady);

        UITools.addClickEvent(this.Button_75,this,this.onSetUp);
        UITools.addClickEvent(this.Button_52,this,this.onChat);

        this.addCustomEvent(SyEvent.JOIN_ROOM,this,this.onJoin);
        this.addCustomEvent(SyEvent.EXIT_ROOM,this,this.onExitRoom);
        this.addCustomEvent(SyEvent.START_PLAY,this,this.startGame);
        this.addCustomEvent(SyEvent.LET_OUT_CARD,this,this.onLetOutCard);
        this.addCustomEvent(SyEvent.OVER_PLAY,this,this.onOver);
        this.addCustomEvent(SyEvent.PLAYER_STATUS_CHANGE,this,this.onChangeStauts);
        this.addCustomEvent(SyEvent.ONLINE_OFFLINE_NOTIFY,this,this.onOnline);
        this.addCustomEvent(SyEvent.FANGZHAO,this,this.onFangZhao);
        this.addCustomEvent(SyEvent.ROOM_FAST_CHAT,this,this.onFastChat);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_START,this,this.onStartSpeak);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_FINISH,this,this.onStopSpeak);
        this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction);
        this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS , this,this.updateGpsBtn);
        this.addCustomEvent(SyEvent.ROOM_ROLD_ICON , this,this.setRoldPlayerIcon);
        this.addCustomEvent(SyEvent.FIX_OUT_CARD , this, this.fixMyCard);
        this.addCustomEvent(SyEvent.PHZ_HIDE_ACTION , this, this.hideAction);
        this.addCustomEvent(SyEvent.PHZ_DEAL_CARD , this,this.dealCardData);
        this.addCustomEvent(SyEvent.PHZ_CLEAN_TING , this,this.cleanTingPanel);
        this.addCustomEvent(SyEvent.PHZ_HIDE_TING , this,this.hideTingPaiPanel);
        this.addCustomEvent(SyEvent.LDFPF_DANIAO , this,this.StartDaNiao);
        this.addCustomEvent(SyEvent.LDFPF_FINISH_DANIAO , this,this.FinishDaNiao);
        this.addCustomEvent(SyEvent.LDFPF_QIHU , this,this.OnQiHu);

        this.addCustomEvent(SyEvent.UPDATE_SET_KSCP , this,this.updateSetKscp);
        this.addCustomEvent(SyEvent.UPDATE_SET_KQTP , this,this.updateSetKqtp);
        this.addCustomEvent(SyEvent.UPDATE_SET_YYXZ , this,this.updateSetYyxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_CPSD , this,this.updateSetCpsd);
        this.addCustomEvent(SyEvent.UPDATE_SET_ZPDX , this,this.updateSetZpdx);
        this.addCustomEvent(SyEvent.UPDATE_SET_XXXZ , this,this.updateSetXxxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_ZPXZ , this,this.updateSetZpxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_PMXZ , this,this.updateSetPmxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_ISCP , this,this.updateSetIscp);

        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBgColor);

        this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);
        this.addCustomEvent(SyEvent.FIX_OUT_CARD_ERROR , this, this.fixMyCardError);
        this.addCustomEvent(SyEvent.PHZ_CLEAN_SPANEL , this,this.cleanSPanel);

        this.addCustomEvent(SyEvent.SHOW_TING_CARDS , this,this.onShowAllHuCards);
        this.addCustomEvent(SyEvent.DAPAI_TING,this,this.outCardTing);
        this.addCustomEvent(SyEvent.SHOW_TING,this,this.showTing);

        this.addCustomEvent(SyEvent.HBGZP_MO_PAI,this,this.onGetMajiang);
        this.addCustomEvent(SyEvent.HBGZP_PAOFEN,this,this.showPaoFenPanel);
        this.addCustomEvent(SyEvent.HBGZP_PAOFEN_STATE,this,this.paofenSelect);

        this.addCustomEvent(SyEvent.UPDATA_CLUB_TABLE_COIN,this,this.onUpdateClubTableCoin);

        if(!SdkUtil.isReview()){
            this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
            var progbg = this.getWidget("progbg");
            this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/ui/common/img_audio_2.png"));
            this.progCycle.x = progbg.width/2;
            this.progCycle.y = progbg.height/2;
            this.progCycle.setPercentage(0);
            progbg.addChild(this.progCycle);
            var recordBtn = this.recordBtn = new RecordAudioButton(this.yuyin,this.progCycle,"res/res_phz/voiceNormal.png","res/res_phz/voiceNormal.png");
            recordBtn.x = this.Button_53.x;
            recordBtn.y = this.Button_53.y;
            this.root.addChild(recordBtn,900);
            //if(IMSdkUtil.isTecent())
            recordBtn.setBright(IMSdkUtil.isReady());
        }
        //cc.log("phz selfRender 2")
        this.Button_53.visible = false;
        this.countDownLabel = new cc.LabelBMFont("15","res/font/font_phz_countdown.fnt");
        this.countDownLabel.x = this.Image_time.width/2;
        this.countDownLabel.y = this.Image_time.height/2+8;
        this.countDownLabel.setScale(1.5);
        this.Image_time.addChild(this.countDownLabel);

        this.Panel_tingPai = this.getWidget("Panel_tingPai");//?????????

        this.Panel_shouzhi = this.getWidget("Panel_shouzhi");
        this.fingerAni();//??????????????????
        this.Panel_shouzhi.visible = false;
        HBGZPRoomModel.mineRoot = this;

        this.calcTime();
        this.calcWifi();
        this.scheduleUpdate();

        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//??????????????????
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            this.bg_CancelTuoguan.setLocalZOrder(100);
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

        this.btn_Gps = this.getWidget("btn_Gps");
        if(SyConfig.HAS_GPS && HBGZPRoomModel.renshu > 2){
            this.btn_Gps.visible = true;
        }else{
            this.btn_Gps.visible = false;
        }

        UITools.addClickEvent(this.btn_Gps ,this,this.onGpsPop);

        this.jiesanBtn = this.getWidget("btn_jiesan");//????????????
        UITools.addClickEvent(this.jiesanBtn ,this,this.onJieSan);
        this.tuichuBtn = this.getWidget("btn_tuichu");//????????????
        UITools.addClickEvent(this.tuichuBtn ,this,this.onTuiChu);

        this.jiesanBtn.visible = true;
        this.tuichuBtn.visible = false;

        this.initGameBtn();

        this.btn_Gps.visible = true;

        if (SdkUtil.isReview()){
            this.btn_Gps.visible = false;
        }
        this.Button_sort = this.getWidget("Button_sort");//??????????????????
        this.Button_sort.visible = false;
        this.Button_sort.scale = 0.9;
        UITools.addClickEvent(this.Button_sort ,this,this.onCardsort);

        this.initSetData();

        if (SdkUtil.isIphoneX()){
            this.getWidget("minePanel").y += 30;
        }
        this.cleanSPanel();

        this.adjustInviteBtn();

        if(BaseRoomModel.isBanVoiceAndProps()){
            this.recordBtn.setVisible(false);
        }
    },

    //???????????????????????????
    onUpdateClubTableCoin:function(event){
        var message = event.getUserData();
        var data = JSON.parse(message.strParams[0])
        for(var i = 0; i<data.length; i++){
            var userId = data[i].userId;
            var p = HBGZPRoomModel.getPlayerVo(userId);
            if(this._players[p.seat]){
                this._players[p.seat].updateClubTableCoin(data[i].coin);
            }
        }
    },

    showWanFaImg:function(){
        //this.Image_setup.visible = false;
        //this.Button_setup1.setBright(!this.Image_setup.visible);
        if (this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(!this.Panel_20.getChildByName("wanfaImg").isVisible());
        }
    },
    initwanfaImg:function(){
        var wanfaStr = ClubRecallDetailModel.getSpecificWanfa(HBGZPRoomModel.intParams);
        var wanfaArr = wanfaStr.split(" ");
        wanfaStr = wanfaStr.replace(/ /g,"\n");
        var bgHeigh = 20 + wanfaArr.length * 40;
        var localX = this.Label_11.x + 120;
        if(HBGZPRoomModel.renshu === 4){
            localX = 1485;
        }
        if (this.Panel_20.getChildByName("wanfaImg")){
            var wanfa_bg = this.Panel_20.getChildByName("wanfaImg");
            wanfa_bg.setContentSize(cc.size(320,bgHeigh));
            wanfa_bg.setPosition(localX,this.button_wanfa.y - wanfa_bg.height/2-30);
            wanfa_bg.getChildByName("wanfa_label").setString(wanfaStr);
            wanfa_bg.getChildByName("wanfa_label").y = wanfa_bg.height/2-15;
            wanfa_bg.getChildByName("wanfa_label").setContentSize(cc.size(300,wanfa_bg.height));
        }else{
            var bg = UICtor.cS9Img("res/res_phz/xiala.png",cc.rect(5,17,117,5),cc.size(320,bgHeigh));
            bg.setPosition(localX,this.button_wanfa.y - bg.height/2-30);
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
            wanfa_label.setPosition(bg.width/2+15,bg.height/2 - 15);
        }
    },

    onGetMajiang:function(event){
        var message = event.getUserData();
        //var delayTime = HBGZPRoomModel.is2Ren() ? 100 : 1;
        var self = this;
        //setTimeout(function(){
            var seat = message.seat;
            //HBGZPRoomModel.nextSeat = seat;
            //self.lastLetOutMJ = 0;
            //self.lastLetOutSeat = 0;
            if(self.lastLetOutMJ !== 0 || (self.lastLetOutMJ == 0 && HBGZPRoomModel.nextSeat == seat)){//????????????????????????  self.lastLetOutSeat != 0
                HBGZPRoomModel.nextSeat = seat;
                self.showJianTou(seat);
            }
            var selfAct = message.selfAct;
            var ids = message.majiangIds;
            //self.showJianTou(seat);
            var id = ids.length>0 ? ids[0] : 0;
            if(id > 0 && HBGZPRoomModel.mySeat == seat){
                var vo = HBGZPAI.getPHZDef(id);
                HBGZPMineLayout.handleLongBuZi(vo,true);
                HBGZPRoomModel.lastMoPaiId = id;
            }
            if(selfAct.length > 0){
                var len = selfAct.length;
                HBGZPRoomModel.localZhaCount = selfAct[len - 1] || 0;
                selfAct.splice(len - 1,1);
            }
            HBGZPRoomModel.remain -= 1;
            self.updateRemain();
            if(seat==HBGZPRoomModel.mySeat){
                self.refreshButton(selfAct);
                var localHuxi = HBGZPAI.getAllHuxi(HBGZPMineLayout.getCurVoArray(),HBGZPRoomModel.JianArray);
                self._players[seat].updateHuXi((HBGZPRoomModel.myOutHuxi||0) + localHuxi);
                //if(!self._players[seat].isTuoguan){
                //    setTimeout(function(){
                //        self.checkHu(HBGZPMineLayout.getCurVoArray());
                //    },10);
                //}
            }
            PlayPHZMessageSeq.finishPlay();
        //},delayTime);
    },


    //???????????????????????????????????????????????????????????????
    adjustInviteBtn:function(){
        var img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";
        var btn_wx_invite = this.getWidget("Button_invite");
        btn_wx_invite.loadTextureNormal(img_wx);

        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName) {
            var offsetX = 400;
            this.btn_qyq_back = new ccui.Button(img_back, "", "");
            this.btn_qyq_back.setPosition(btn_wx_invite.width / 2 - 2 * offsetX, btn_wx_invite.height / 2);
            UITools.addClickEvent(this.btn_qyq_back, this, this.onBackToPyqHall);
            btn_wx_invite.addChild(this.btn_qyq_back);

            if(BaseRoomModel.curRoomData.strParams[4] == 1){
                img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
            }
            this.btn_qyq_invite = new ccui.Button(img_qyq, "", "");
            this.btn_qyq_invite.visible = ClickClubModel.getIsForbidInvite();
            this.btn_qyq_invite.setPosition(btn_wx_invite.width / 2 - offsetX, btn_wx_invite.height / 2);
            UITools.addClickEvent(this.btn_qyq_invite, this, this.onShowInviteList);
            btn_wx_invite.addChild(this.btn_qyq_invite);

            btn_wx_invite.setPositionX(btn_wx_invite.x + (offsetX));

        }
    },

    onBackToPyqHall:function(){
        var pop = new PyqHall();
        pop.setBackBtnType(2);
        PopupManager.addPopup(pop);
    },

    onShowInviteList:function(){
        var inviteType = 0
        if(BaseRoomModel.curRoomData.strParams[4] == 1) inviteType = 2
        var pop = new PyqInviteListPop(inviteType);
        this.addChild(pop);
    },

    onChui:function(obj){
        var temp = obj.temp;
        sySocket.sendComReqMsg(2025,[temp]);
    },

    showChuiPanel:function(){
        this.tuichuBtn.visible = false;
        this.Panel_chui.visible = true;
    },

    showPaoFenPanel:function (event) {
        var message = event.getUserData();
        var params = message.params;
        this.tuichuBtn.visible = false;
        if(HBGZPRoomModel.intParams[24] != 0){
            this.Panel_piaofen.visible = true;
            if(HBGZPRoomModel.intParams[24] == 1){
                if(params[0] == 0){
                    this.Panel_piaofen.visible = false;
                }else{
                    this.setButtonList([true,params[0] >= 1,params[0] >= 2,params[0] == 3]);
                }
            }else{
                this.setButtonList([params[0] <= 0,params[0] <= 1,params[0] <= 2,params[0] <= 3]);
            }
        }
    },

    setButtonList:function(listArray){
        this.Button_bp.setBright(listArray[0]);
        this.Button_bp.setEnabled(listArray[0]);
        this.Button_p1f.setBright(listArray[1]);
        this.Button_p1f.setEnabled(listArray[1]);
        this.Button_p2f.setBright(listArray[2]);
        this.Button_p2f.setEnabled(listArray[2]);
        this.Button_p3f.setBright(listArray[3]);
        this.Button_p3f.setEnabled(listArray[3]);
    },

    paofenSelect:function(event){
        var message = event.getUserData();
        var params = message.params;
        var userId = params[0];
        var type = parseInt(params[1]);
        var p = HBGZPRoomModel.getPlayerVo(userId);
        if (p.seat == HBGZPRoomModel.mySeat){
            this.Panel_piaofen.visible = false;
        }
        if(type > 0){
            this._players[p.seat].showDaTuoImg(type,true);
        }
    },

    onPaoFen:function(obj){//??????
        var temp = obj.temp;
        sySocket.sendComReqMsg(2301,[temp]);
    },

    showWaitSelectPiao:function(isShow){
        if(isShow){
            if(!this.waitPiaoImg){
                this.waitPiaoImg = new cc.Sprite("res/ui/mj/csmjRoom/word_piaofen.png");
                this.waitPiaoImg.setPosition(cc.winSize.width/2 + 50,cc.winSize.height/2);
                this.addChild(this.waitPiaoImg,4);
            }
            this.waitPiaoImg.setVisible(true);
        }else{
            this.waitPiaoImg && this.waitPiaoImg.setVisible(false);
        }
    },

    StartDaNiao:function(message){
        var params = message.getUserData().params;
        cc.log("StartDaNiao::"+JSON.stringify(params));
        var self = this;
        setTimeout(function(){//??????????????????????????????createTable?????????????????????
            //??????3???????????????
            for(var i=1;i<=HBGZPRoomModel.renshu;i++){
                var mjp = self._players[i];
                if(mjp){
                    mjp.startGame();
                    // mjp.showDaNiaoType();
                }
            }
            self._players[HBGZPRoomModel.mySeat].showDaNiaoType();
            self.showDaNiaoPanel(params[0]);
        },100);
    },
    showDaNiaoPanel:function (type) {
        this.tuichuBtn.visible = false;
        this.Panel_daniao.visible = true;
        if (type==1 || type==2){//????????????
            this.Button_dn.visible = true;
            this.Button_dn20.visible = false;
            this.Button_dn50.visible = false;
            this.Button_dn100.visible = false;
            this.Button_bdn.x = 640;
        }else if (type==3) {//????????????
            this.Button_dn.visible = false;
            this.Button_dn20.visible = true;
            this.Button_dn50.visible = true;
            this.Button_dn100.visible = true;
            this.Button_bdn.x = 135;
        }
    },
    FinishDaNiao:function(event){
        if (this.tuichuBtn.visible){
            for(var i=1;i<=HBGZPRoomModel.renshu;i++){
                var mjp = this._players[i];
                if(mjp)
                    mjp.startGame();
            }
            this.tuichuBtn.visible = false;
        }

        var message = event.getUserData();
        var params = message.params;
        // cc.log("params",params);
        var userId = params[0];
        var p = HBGZPRoomModel.getPlayerVo(userId)
        this._players[p.seat].hideDaNiaoType();
        if (p.seat == HBGZPRoomModel.mySeat){
            this.Panel_daniao.visible = false;
        }
        if(params[1]> 0)
            this._players[p.seat].showDaNiaoImg( )

    },

    sendQiHu:function() {
        AlertPop.show("???????????????????????????????????????",function(){
            sySocket.sendComReqMsg(2014,[]);
        });
    },
    OnQiHu:function(event){
        var message = event.getUserData();
        var params = message.params;
        // cc.log("params===>OnQiHu",params);
        var userId = params[0];
        var p = HBGZPRoomModel.getPlayerVo(userId)
        this._players[p.seat].showQiHuImg();
        // cc.log("p.seat == HBGZPRoomModel.mySeat = ",p.seat == HBGZPRoomModel.mySeat);
        if (p.seat == HBGZPRoomModel.mySeat){
            this.btnPanel.removeAllChildren(true);
            if (this.Button_qihu){
                this.Button_qihu.visible = false;
            }
        }
    },
    onDaNiao:function(obj){
        //??????
        // ????????????????????? [a,b]
        // a ???????????? ???????????? 0 ?????? 1??? b ??????????????????
        var temp = obj.temp;
        // if (temp == 1 ){// ???????????? ???????????? ????????????
        sySocket.sendComReqMsg(2032,[temp]);
        // }else if (temp == 0 ){// ??????????????? ?????????0
        //     sySocket.sendComReqMsg(2032,[0,0]);
        // }else {// ???????????? ????????????
        //     sySocket.sendComReqMsg(2032,[0,temp]);
        // }
    },
    /**
     * ??????????????????
     */
    onCancelTuoguan:function(){
        sySocket.sendComReqMsg(210);
    },

    updatePlayTuoguan:function(event){
        var data = event.getUserData();
        // cc.log("updatePlayTuoguan..." , data);
        //data = data.split(",");
        var self = this;
        if(data.length >= 2){
            //var userId = data[0];
            var seat = data[0];
            var isTuoguan = data[1];
            // cc.log("seat , isTuoguan" , seat , isTuoguan);
            var player = this._players[seat];
            if(player){
                player.updateTuoguan(isTuoguan);
            }else{
                cc.log("!!!!!!!????????????player");
            }
            if(seat == HBGZPRoomModel.mySeat && this.bg_CancelTuoguan){
                if (isTuoguan){
                    this.showTuoGuanTimeOutHandle = setTimeout(function(){//????????????????????????
                        self.bg_CancelTuoguan.visible = isTuoguan;
                    },2000);
                }else{
                    self.bg_CancelTuoguan.visible = isTuoguan;
                }
            }
        }
    },
    //??????????????????
    checkTingList:function(isTrue) {
        //cc.log("checkTingList===============>")
        if (HBGZPRoomModel.nextSeat == HBGZPRoomModel.mySeat || isTrue) {
            //this.tingList = [];
            //this.tingList = HBGZPAI.getAllHuList(HBGZPMineLayout.getCurVoArray());
            if(this.tingList.length === 0){
                return;
            }
            HBGZPMineLayout.outCardTingPai(this.tingList);
        }
    },


    hideHandsTingImg:function() {
        // cc.log("hideHandsTingImg===============>")
        var arr = HBGZPMineLayout.cards;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i]._cardVo){
                arr[i]._cardVo.isTing = false;
            }
            arr[i].showTingImg(false);
        }
    },

    //??????????????????
    dealCardData:function(event) {
        //var data = event.getUserData();
        //var sourceArray = ArrayUtil.clone(PHZMineLayout.getCurVoArray());
        //for(var j=0;j<sourceArray.length;j++){
        //    if (data.c == sourceArray[j].c){
        //        sourceArray.splice(j, 1);
        //        break;
        //    }
        //}
        ////cc.log("sourceArray============"+JSON.stringify(sourceArray));
        //this.checkHu(sourceArray);
    },


    //????????????
    checkHu:function(handCards) {
        if (HBGZPSetModel.kqtp){
            var cards = HBGZPAI.getAllHuList(handCards);
            this.tingList = cards;
            if(cards.length > 0){
                if(HBGZPRoomModel.nextSeat !== HBGZPRoomModel.mySeat){
                    this.huList = cards[0].cards;
                    this.showTingPai(this.huList);
                } else{
                    this.checkTingList();
                    //HBGZPMineLayout.outCardTingPai(cards);
                }
            }
        }
    },

    //???????????????
    cleanTingPanel:function(){
        if(this.Panel_tingPai)
            this.Panel_tingPai.removeAllChildren();
    },

    onShowAllHuCards:function(event){
        //cc.log(" onShowAllHuCards event =",JSON.stringify(event));
        //var tingData = event.getUserData();
        //var huList = tingData.huCards || [];
        //HBGZPAI.sortVal(huList);
        //this.showTingPai(huList);
    },
    showTing:function(event){
        var tingData = event.getUserData();
        var huList = tingData[0] || [];
        this.showTingPai(huList);
    },

    //??????????????????????????????
    outCardTing:function(event){
        if(PlayPHZMessageSeq.sequenceArray.length > 0){//?????????????????????????????????????????????????????????????????????
            cc.log("=========outCardTing======delay=====");
            this.delayOutCardTingData = event;
            return;
        }

        var resultData = this.countAllCard();

        var data = event.getUserData();
        var info = data.info || [];
         cc.log("info",JSON.stringify(info));
        for(var i = 0;i < info.length;++i){
            var cards = info[i].tingMajiangIds;
            for(var j = 0;j < cards.length;){
                var numCard = cards[j];
                if(numCard > 0){
                    numCard = HBGZPAI.getPHZByVal(numCard).n;
                }
                if(!resultData[numCard]){
                    cards.splice(j,1);
                }else{
                    ++j;
                }
            }
        }

        if(info[0] && info[0].majiangId == 0){
            this.showTingPai(info[0].tingMajiangIds);
        }else{
            HBGZPMineLayout.outCardTingPai(info);
            this.outTingInfo = info;
            this.CanClealTingImg = false;
        }
    },

    //??????????????????
    showTingPai:function(huList){
        //cc.log(" ???????????? huList =",JSON.stringify(huList));
        if (huList && huList.length > 0 ){
            this.cleanTingPanel();
            this.Panel_tingPai.visible = true;
            var tingBgImgHeight = 45 * 1.5;
            var diffHeight = 37 * 1.5;
            tingBgImgHeight = Math.floor((huList.length-1)/5)*diffHeight + tingBgImgHeight;

            //????????????
            var tingBg = cc.spriteFrameCache.getSpriteFrame("cards_listencard_di_tingpai.png");
            var tingBgImg = new cc.Scale9Sprite(tingBg,null,cc.rect(5,5,180 * 1.5,45 * 1.5));//210
            tingBgImg.anchorX= 0.5;
            tingBgImg.anchorY= 1;
            tingBgImg.x = 110;//950 * 1.5 + (cc.winSize.width-SyConfig.DESIGN_WIDTH)/2;
            tingBgImg.y = 265;
            tingBgImg.width = 180 * 1.5;
            tingBgImg.height = tingBgImgHeight + 8;
            this.Panel_tingPai.addChild(tingBgImg);

            //???????????????
            var tingImg = new cc.Sprite("#cards_listencard_zi_tingpai.png");
            //tingImg.x = 50;
            tingImg.anchorY= 0;
            tingImg.x = tingBgImg.width*0.5;
            tingImg.y = tingBgImgHeight + 12;
            tingBgImg.addChild(tingImg);

            var scale = 0.35;
            //????????????
            for(var j=0;j<huList.length;j++){
                var isHua = false;

                var numCard = huList[j];
                if(numCard < 0){
                    numCard = Math.abs(huList[j]);
                    isHua = true;
                }
                var cardVo = HBGZPAI.getPHZByVal(numCard);
                var nVal = cardVo.n;
                var png = "res/res_phz/res_hbgzp/cards/hbgzp_card2_"+nVal + ".png";
                if(isHua){
                    png = "res/res_phz/res_hbgzp/cards/hbgzp_card2_"+nVal+"_1"+ ".png";
                }
                var paiImg = new cc.Sprite(png);
                var x = Math.floor(j%5)*30 + 30;
                var y = -Math.floor(j/5)*35 * 1.5 + tingBgImgHeight - 25 * 1.5 + 5;
                paiImg.scale = scale;
                paiImg.x = x * 1.5;
                paiImg.y = y;
                tingBgImg.addChild(paiImg);
            }
        }else{
            this.Panel_tingPai.visible = false;
        }
    },

    //????????????
    fingerAni:function(){
        var tishi = new cc.Sprite("res/res_phz/img_shouzi1.png");
        tishi.x = 115;
        tishi.y = 175;
        tishi.scale = 0.6;
        this.Panel_shouzhi.addChild(tishi, 1);

        var jiantou = new cc.Sprite("res/res_phz/img_shouzi3.png");
        jiantou.x = 100;
        jiantou.y = 100;
        jiantou.scale = 0.6;
        this.Panel_shouzhi.addChild(jiantou, 1);
        var action = cc.sequence(cc.fadeTo(0.5,255),cc.delayTime(0.8),cc.fadeTo(0.5,50));
        jiantou.runAction(cc.repeatForever(action));

        var shouzi = new cc.Sprite("res/res_phz/img_shouzi2.png");
        shouzi.x = 62;
        shouzi.y = 25;
        shouzi.scale = 0.6;
        jiantou.addChild(shouzi, 1);

        var action1 = cc.sequence(cc.moveBy(0.5,cc.p(75,65)),cc.delayTime(0.8),cc.moveBy(0.5,cc.p(-75,-65)));
        shouzi.runAction(cc.repeatForever(action1));
    },

    onCardsort:function(){
        if ( HBGZPRoomModel.sortCardWay == 0){
            HBGZPRoomModel.sortCardWay = 1;
        }else{
            HBGZPRoomModel.sortCardWay = 0;
        }
        if (HBGZPMineLayout){
            HBGZPMineLayout.onCardsort();
        }
        cc.log("??????????????????")
    },

    onJieSan:function(){
        AlertPop.show("???????????????????????????????????????????????????????????????",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    onTuiChu:function(){
        sySocket.sendComReqMsg(6);
    },

    onGpsPop:function(){
        if(HBGZPRoomModel.renshu > 2){
            PopupManager.addPopup(new GpsPop(HBGZPRoomModel , HBGZPRoomModel.renshu));
        }
    },

    onShowSet:function(){
        this.Image_set.visible = !this.Image_set.visible;
        if(this.Image_set.visible){
            this.Button_sset.loadTextures("res/res_phz/phzRoom/btn_33.png", "res/res_phz/phzRoom/btn_33.png");
        }else{
            this.Button_sset.loadTextures("res/res_phz/phzRoom/btn_32.png", "res/res_phz/phzRoom/btn_32.png");
        }
    },

    updateGpsBtn:function(){
    },

    //?????? ???????????????????????????
    setRoldPlayerIcon:function(event) {

        var seat = event.getUserData();
        var players = HBGZPRoomModel.players;
        for(var i=0;i<players.length;i++) {
            var p = players[i];
            if(p.seat ==seat){
                p.isRoladIcon = 1;
            }
        }
    },

    /**
     * sdk????????????????????????????????????
     */
    onRadioReady:function(event){
        var useful = event.getUserData();
        if(useful){
            this.recordBtn.setBright(true);
        }else{
            this.recordBtn.setBright(false);
        }
    },

    onPlayerInfo:function(obj){
        if (obj && obj.temp){
            this._players[obj.temp].showInfo();
        }

    },

    onChat:function(){
        var mc = new ChatPop();
        PopupManager.addPopup(mc);
    },

    /**
     * ????????????
     */
    onFastChat:function(event){
        var data = event.getUserData();
        var userId = data.userId;
        var p = HBGZPRoomModel.getPlayerVo(userId);
        this._players[p.seat].fastChat(data);
    },

    calcTime:function(){
        var date = new Date();
        var hours = date.getHours().toString();
        hours = hours.length < 2 ? "0"+hours : hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length < 2 ? "0"+minutes : minutes;
        if(this.Label_11){
            this.Label_11.setString(hours+":"+minutes);
        }

    },

    calcWifi:function(){
        var type = SdkUtil.getNetworkType();
        if(!type || type==0){
            this.netType.visible = false;
        }else{
            this.netType.loadTexture("res/ui/otherImg/net_" + type + ".png");
        }
        if (HBGZPRoomModel.intParams[7] == 4) {
            var batteryNum = Math.ceil(SdkUtil.getBatteryNum()/100*43);
            this.Label_batteryPer.setString(SdkUtil.getBatteryNum()+"%");
            this.battery.setTextureRect(cc.rect(0, 0, batteryNum, 17));
        } else {
            var batteryNum = Math.ceil(SdkUtil.getBatteryNum()/100*43);
            this.Label_batteryPer.setString(SdkUtil.getBatteryNum()+"%");
            this.battery.setTextureRect(cc.rect(0, 0, batteryNum, 17));
        }
    },

    onSetUp:function(){
        var mc = new HBGZPSetUpPop();
        PopupManager.addPopup(mc);

        //var mc = new PHZSetPop();
        //PopupManager.addPopup(mc);
    },

    update:function(dt){
        this._dt += dt;
        this._loacationDt += dt;
        PlayPHZMessageSeq.updateDT(dt);

        if(PlayPHZMessageSeq.sequenceArray.length == 0 && this.delayOutCardTingData){
            this.outCardTing(this.delayOutCardTingData);
            this.delayOutCardTingData = null;
        }

        if(this._loacationDt >= 2){
            this._loacationDt = 0;
            if(GPSModel.getGpsData(PlayerModel.userId) == null){
                //cc.log("dtzRoom::update=====>startLocation");
                GPSSdkUtil.startLocation();
            }
        }

        if(this._dt>=1){
            this._dt = 0;
            if(this._countDown >= 0  && !ApplyExitRoomModel.isShow){
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
    },

    updateCountDown:function(number){
        this._countDown = number;
        //var countDown = (this._countDown<10) ? "0"+this._countDown : ""+this._countDown
        this.countDownLabel.setString(this._countDown+"");
        if(this.Image_time.visible && this._countDown>=0 && this._countDown==3 && this.timeDirect == 1){
            AudioManager.play("res/res_phz/phzSound/timeup_alarm.mp3");
        }
    },

    onChangeStauts:function(event){
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        this._players[seat].onReady();
        if(seat == HBGZPRoomModel.mySeat){
            this.Button_ready.visible = false;
            this.tuichuBtn.x = SyConfig.DESIGN_WIDTH/2;
            this.fapai.visible = this.Label_remain.visible = true;
        }
    },

    onOver:function(event){
        this.lastLetOutMJ = 0;
        this.hbgzpGuanArray = [];
        HBGZPRoomModel.JianArray = [];
        this.isShowReadyBtn = false;
        var data = event.getUserData();
        this.message = data;
        this.cleanTingPanel();
        HBGZPRoomModel.isChiBianDaBian = false;
        //??????????????????????????????????????????????????????????????????
        if(PlayPHZMessageSeq.sequenceArray.length>0){
            PlayPHZMessageSeq.cacheClosingMsg(data);
            return;
        }

        for(var index = 0 ; index < HBGZPRoomModel.renshu ; index ++){
            if(this._players[index]){
                this._players[index].playerQuanAnimation(false);
            }
        }

        this.btnPanel.visible = false;
        //this.cleanChuPai();
        this.Image_time.visible=false;
        //this.fingerArmature.visible=false;
        this.Panel_shouzhi.visible = false;

        //?????????????????????
        var self = this;
        var t = 1300;
        //var t1 = 800;//?????????????????????????????????????????????
        HBGZPRoomModel.isStart = false;
        //this.showSparePaiTimeOutHandle = setTimeout(function() {//????????????????????????????????????
        //    if (!HBGZPRoomModel.isStart){
        //        self.showSparePai(ClosingInfoModel);
        //    }
        //},t1);
        this.showResultTimeOutHandle = setTimeout(function(){//?????????????????????
            self.isShowReadyBtn = true;
            for(var i=0;i<data.length;i++){
                self._players[data[i].seat].updatePoint(data[i].totalPoint);
                self._players[data[i].seat].hidePiaoFenImg();
                self._players[data[i].seat].hideQiHuImg();
                self._players[data[i].seat].hideDaTuoImg();
            }
            var mc = new HBGZPSmallResultPop(data);
            //var mc = new PHZBigResultPop(data);
            PopupManager.addPopup(mc);
            var obj = HongBaoModel.getOneMsg();
            if(obj){
                var mc = new HongBaoPop(obj.type,obj.data);
                PopupManager.addPopup(mc);
            }
        },t);
    },

    initGameBtn:function(){
        if (HBGZPRoomModel.getFangZhu(HBGZPRoomModel.getPlayerVo(PlayerModel.userId)) == 1 || HBGZPRoomModel.isStart || HBGZPRoomModel.nowBurCount > 1 ){
            if (HBGZPRoomModel.isStart || HBGZPRoomModel.nowBurCount > 1){
                this.tuichuBtn.visible = false;
                this.Button_ready.x = 960;
            }else{
                if (HBGZPRoomModel.isClubRoom(HBGZPRoomModel.tableType)){
                    this.Button_ready.x = 1200;
                    this.tuichuBtn.visible = true;
                    this.tuichuBtn.x = 720;
                }else{
                    this.tuichuBtn.visible = false;
                    this.Button_ready.x = 960;
                }
            }
            this.jiesanBtn.setBright(true);
            this.jiesanBtn.setTouchEnabled(true);
        }else{
            this.tuichuBtn.visible = true;
            this.tuichuBtn.x = 720;
            this.Button_ready.x = 1200;
        }
    },

    initData:function(){
        if(!this.hbgzpGuanArray){
            this.hbgzpGuanArray = [];
        }
        this.roomName_label.setString(HBGZPRoomModel.roomName);
        if(this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(false);
        }
        sy.scene.hideLoading();
        //????????????
        if(this.showSparePaiTimeOutHandle){
            clearTimeout(this.showSparePaiTimeOutHandle);
            this.showSparePaiTimeOutHandle = null;
        }

        if(this.showResultTimeOutHandle){
            clearTimeout(this.showResultTimeOutHandle);
            this.showResultTimeOutHandle = null;
        }

        if(this.showOutCardTimeOutHandle){
            clearTimeout(this.showOutCardTimeOutHandle);
            this.showOutCardTimeOutHandle = null;
        }

        if(this.checkTingTimeOutHandle){
            clearTimeout(this.checkTingTimeOutHandle);
            this.checkTingTimeOutHandle = null;
        }

        if(this.bg_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
        }

        if(this.showTuoGuanTimeOutHandle){
            clearTimeout(this.showTuoGuanTimeOutHandle);
            this.showTuoGuanTimeOutHandle = null;
        }

        //this.Panel_piaofen.visible = false;
        //this.showWaitSelectPiao(false);

        this.guoChiVals = [];
        this.lastLetOutMsg = null;
        HBGZPRoomModel.JianArray = [];

        //this.hideAllBanker();
        this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        this._countDown = HBGZPRoomModel.intParams[8] || 30;
        //this.updateCountDown(this._countDown);
        PlayPHZMessageSeq.clean();
        //if (HBGZPRoomModel.intParams[7] == 3  || HBGZPRoomModel.intParams[7] == 2) {
            this.fapai.removeAllChildren();
        //}
        this.lastMoPHZ = this.lastLetOutMJ = this.lastLetOutSeat = 0;
        this.Label_fh.setString("??????:"+HBGZPRoomModel.tableId);
        this.updateRoomInfo();
        this.initGameBtn();
        this._players = {};
        var players = HBGZPRoomModel.players;
        for(var i=1;i<=HBGZPRoomModel.renshu;i++){
            this.getWidget("oPanel"+i).removeAllChildren(true);
            this.getWidget("mPanel"+i).removeAllChildren(true);
            var layout = this.layouts[i];
            if(layout)//?????????????????????????????????
                layout.clean();
        }
        var isContinue = false;
        var isMoPai = false;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!isContinue){
                isContinue = (p.handCardIds.length>0 || p.outedIds.length>0 || p.moldCards.length>0);//
                if(p.ext[3]==HBGZPRoomModel.mySeat)
                    isContinue = true;
            }
        }
        HBGZPMineLayout.setRoot(this.getWidget("minePanel"));
        if(!isContinue)
            HBGZPMineLayout.clean();
        this.btnPanel.visible = false;
        this.Button_ready.visible = true;
        this.fapai.visible = this.Label_remain.visible = false;
        this.Button_invite.visible = (players.length<HBGZPRoomModel.renshu);

        var handCards = [];
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = HBGZPRoomModel.getPlayerSeq(p.userId,HBGZPRoomModel.mySeat,p.seat);
            if (this._players[p.seat]){
                this._players[p.seat].hideQiHuImg();
            }

            var cardPlayer = this._players[p.seat] = new HBGZPPlayer(p,this.root,seq);
            if(!isContinue){
                if(p.status && !p.ext[9])
                    cardPlayer.onReady();
            }else{//????????????
                if (p.ext[11] && p.ext[11] == 1){//?????????????????????
                    cardPlayer.showQiHuImg();
                    if (p.seat == HBGZPRoomModel.mySeat){
                        if (this.Button_qihu){
                            this.Button_qihu.visible = false;
                        }
                    }
                }else{
                    if(p.seat==HBGZPRoomModel.mySeat){
                        HBGZPRoomModel.localZhaCount = p.ext[6] || 0;
                    }
                }
                var banker = null;
                if (seq == 1){
                    handCards = ArrayUtil.clone(p.handCardIds);
                }
                if(p.seat==HBGZPRoomModel.nextSeat)
                    banker= p.seat;

                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.moldCards,banker,isMoPai);

                if(p.outCardIds.length>0){//???????????????????????????
                    if (p.seat != HBGZPRoomModel.nextSeat){
                        this.lastLetOutMJ = p.outCardIds[0];
                        this.lastLetOutSeat = p.seat;
                        var lastVo = HBGZPAI.getPHZDef(this.lastLetOutMJ);
                        var lastDirect = HBGZPRoomModel.getPlayerSeq(p.userId,HBGZPRoomModel.mySeat, p.seat);
                        HBGZPRoomEffects.chuPai(this.getWidget("cp"+lastDirect),lastVo,p.outCardIds[0],HBGZPRoomModel.renshu,lastDirect,this.getWidget("oPanel"+lastDirect));
                    }
                }
                //this.Button_sort.visible = true;

                if(p.seat==HBGZPRoomModel.mySeat){
                    var localHuxi = HBGZPAI.getAllHuxi(HBGZPMineLayout.getCurVoArray(),HBGZPRoomModel.JianArray);
                    this._players[p.seat].updateHuXi((p.ext[7]||0) + localHuxi);
                    HBGZPRoomModel.myOutHuxi = p.ext[7];//?????????????????????
                }else{
                    this._players[p.seat].updateHuXi(p.ext[7]||0);
                }

                if(p.recover.length>0){//???????????????????????????
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        HBGZPRoomModel.banker = p.seat;
                        //cardPlayer.isBanker(true);
                    }
                    if(p.recover.length>2 && p.userId==PlayerModel.userId){
                        this.refreshButton(p.recover.splice(2,7));
                    }
                }
                cardPlayer.startGame();
            }
            if (HBGZPRoomModel.intParams[8] != 0 && HBGZPRoomModel.getPlayerIsTuoguan(p)){
                cardPlayer.updateTuoguan(true)
            }
            if(p.userId ==PlayerModel.userId){//?????????????????????
                this.guoChiVals = p.intExts;
                // cc.log("========guoChiVals===========" + this.guoChiVals);
                if(p.status){
                    this.tuichuBtn.x = SyConfig.DESIGN_WIDTH/2;
                    this.Button_ready.visible = false;
                    if(isContinue)
                        this.fapai.visible = this.Label_remain.visible = true;
                }else{
                    this.tuichuBtn.x = SyConfig.DESIGN_WIDTH/2 - 240;
                }

                //???????????????????????? ??????????????????
                if(this.bg_CancelTuoguan){
                    var isMeTuoguan = HBGZPRoomModel.getPlayerIsTuoguan(p);
                    cc.log("???????????????????????????????????????..."  , isMeTuoguan);
                    this.bg_CancelTuoguan.visible = isMeTuoguan;
                }
            }
        }

        ////?????????????????????
        //var voArray = [];
        //for(var i=0;i<handCards.length;i++){
        //    voArray.push(HBGZPAI.getPHZDef(handCards[i]));
        //}
        //if (voArray.length > 0 ){
        //    this.hideHandsTingImg();
        //    this.checkHu(voArray);
        //}

        if(isContinue){
            if(HBGZPRoomModel.nextSeat)
                this.showJianTou(HBGZPRoomModel.nextSeat);
            this.Button_invite.visible = false;
            HBGZPRoomModel.isStart = true;
        }
        //IP???????????????
        if(players.length>1 && HBGZPRoomModel.renshu != 2){
            var seats = HBGZPRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }
    },

    countAllCard:function(){
        var data = {
            "-1":2,
            "-3":2,
            "-5":2,
            "-7":2,
            "-9":2,
            "1":3,
            "2":5,
             "3":3,"4":5,"5":3,"6":5,"7":3,"8":5,"9":3,
        "10":5,"11":5,"12":5,"13":5,"14":5,"15":5,"16":5,
        "17":5,"18":5,"19":5,"20":5,"21":5,"22":5};

        var myCards = HBGZPMineLayout.getCurVoArray();
        for(var i = 0;i < myCards.length;++i){
            if(myCards[i].hua){
                this.deleteObjByN(data,-myCards[i].n);
            }else{
                this.deleteObjByN(data,myCards[i].n);
            }
        }

        for(var i=1;i<=HBGZPRoomModel.renshu;i++){
            var seq = HBGZPRoomModel.getPlayerSeq("",HBGZPRoomModel.mySeat,i);
            var layout = this.getLayout(seq);
            var data2 = layout.getPlace2Data() || [];
            for(var m = 0;m < data2.length;++m){
                var cards = data2[m].cards;
                for(var n = 0;n < cards.length;++n){
                    if(cards[n].hua){
                        this.deleteObjByN(data,-cards[n].n);
                    }else{
                        this.deleteObjByN(data,cards[n].n);
                    }
                }
            }
            var data3 = layout.getPlace3Data() || [];
            for(var j = 0;j < data3.length;++j){
                if(data3[j].hua){
                    this.deleteObjByN(data,-data3[j].n);
                }else{
                    this.deleteObjByN(data,data3[j].n);
                }
            }
        }

        return data;
    },

    deleteObjByN:function(data,nVal,num){
        data = data || {};
        num = num || 1;
        if(!data[nVal]){
            return;
        }
        for(var valStr in data){
            if(valStr == nVal){
                data[valStr] -= num;
                if(data[valStr] == 0){
                    delete data[valStr];
                }
                return;
            }
        }
    },

    updateRemain:function(){
        var remain = HBGZPRoomModel.remain;
        this.Label_remain.setString(""+remain);
        var paiDun = this.fapai.getChildrenCount();
        remain = 5;//????????????
        if (paiDun == 0 && remain > 0) {
            for (var i=0;i<remain;i++) {
                var dun = new cc.Sprite("res/res_phz/res_hbgzp/card_bg.png");
                dun.x = this.fapai.width/2;
                dun.y = 52+i*0.5;
                dun.scale = 0.5;
                dun.rotation = 90;
                this.fapai.addChild(dun, 1, (this.tag_paidun+i));
            }
        } else {
            if (paiDun > remain) {
                for (var i=paiDun;i>remain;i--) {
                    this.fapai.removeChildByTag((this.tag_paidun+(i-1)));
                }
            }
        }
    },

    updateRoomInfo:function(){
        if(this.label_payType){
            this.label_payType.setString("????????????");
            if(HBGZPRoomModel.getCostFangShi() == 1){
                this.label_payType.setString("AA??????");
            }else if(HBGZPRoomModel.getCostFangShi() == 3){
                this.label_payType.setString("????????????");
            }
        }

        if(this.lable_renshu){
            this.lable_renshu.setString(HBGZPRoomModel.renshu + "???");
        }


        this.Label_jushu.setString(csvhelper.strFormat("???{0}/{1}???",HBGZPRoomModel.nowBurCount,HBGZPRoomModel.totalBurCount));

        this.updateRemain();
    },

    /**
     * ???????????????????????????????????????
     * @param obj
     * @param isAlert
     */
    onPengPai:function(obj,isAlert){
        //isAlert = isAlert || false;
        // this.kehushizhong = false;
        var temp = obj.temp;
        this.cleanChuPai();
        var ids = [];
        switch (temp){
            case HBGZPDisAction.HU:
                HBGZPRoomModel.sendPlayCardMsg(temp,[]);
                break;
            case HBGZPDisAction.ZHAO://???
                ids = HBGZPAI.getSameCardByNumber(HBGZPMineLayout.cards,HBGZPRoomModel.JianArray,this.lastLetOutMJ,3,this.getLayout(1).getPlace2Data());
                if(ids.length === 1){
                    HBGZPRoomModel.sendPlayCardMsg(temp,ids[0]);
                }else{
                    this.displayOperateSelect(ids,4,HBGZPDisAction.ZHAO);
                }
                //cc.log(" ????????? = ",ids[0]);
                break;
            case HBGZPDisAction.ZHA://???
                //HBGZPRoomModel.sendPlayCardMsg(temp,[]);
                ids = HBGZPAI.getSameCardByNumber(HBGZPMineLayout.cards,HBGZPRoomModel.JianArray,0,4);
                if(!this.hbgzpGuanArray){
                    this.hbgzpGuanArray = [];
                }
                var data = this.hbgzpGuanArray || [];//??????????????????
                if(data.length > 0){
                    for(var j = 0;j < ids.length;){
                        var vo = HBGZPAI.getPHZDef(ids[j][0]);
                        if(data.indexOf(vo.n) !== -1){
                            ids.splice(j,1);
                        }else{
                            ++j;
                        }
                    }
                }
                if(ids.length === 1){
                    var vo = HBGZPAI.getPHZDef(ids[0][0]);
                    if(data.indexOf(vo.n) === -1){
                        data.push(vo.n);
                    }
                    this.hbgzpGuanArray = data;
                    HBGZPRoomModel.sendPlayCardMsg(temp,[]);
                }else{
                    this.displayOperateSelect(ids,4,HBGZPDisAction.ZHA);
                }
                //cc.log(" ????????? = ",ids[0]);
                //cc.log(" ????????? = ",JSON.stringify(ids));
                break;
            case HBGZPDisAction.PENG:
                ids = HBGZPAI.getSameCardByNumber(HBGZPMineLayout.cards,HBGZPRoomModel.JianArray,this.lastLetOutMJ,2);
                if(ids.length === 1){
                    HBGZPRoomModel.sendPlayCardMsg(temp,ids[0]);
                }else{
                    HBGZPRoomModel.sendPlayCardMsg(temp,ids[0]);
                }
                //cc.log(" ????????? = ",ids[0]);
                break;
            case HBGZPDisAction.HUA:
                    //HBGZPRoomModel.sendPlayCardMsg(temp,[]);
                ids = HBGZPAI.getSameCardByNumber(HBGZPMineLayout.cards,HBGZPRoomModel.JianArray,this.lastLetOutMJ,5,this.getLayout(1).getPlace2Data());
                if(ids.length === 1){
                    HBGZPRoomModel.sendPlayCardMsg(temp,ids[0]);
                }else{
                    this.displayOperateSelect(ids,5,HBGZPDisAction.HUA);
                }
                //cc.log(" ????????? = ",ids[0]);
                break;
            case HBGZPDisAction.PASS:
                var allButtons = [];
                for(var i=0;i<HBGZPRoomModel.selfAct.length;i++){
                    if(HBGZPRoomModel.selfAct[i]==1)
                        allButtons.push(i);
                }
                var isSelf = HBGZPAI.isSelfMoPai(HBGZPMineLayout.cards,HBGZPRoomModel.localZhaCount);
                var guoParams = isSelf ? [1] : [0];
                ArrayUtil.merge(HBGZPRoomModel.selfAct,guoParams);
                if(obj.state){
                    AlertPop.show("?????????????????????????????????????????????????????????",function(){
                        HBGZPRoomModel.sendPlayCardMsg(5,guoParams);
                    });
                }else{
                    HBGZPRoomModel.sendPlayCardMsg(5,guoParams);
                }
                break;
            case HBGZPDisAction.JIAN:
                HBGZPRoomModel.sendPlayCardMsg(temp,[]);
                break;
            case HBGZPAction.HU_ZIMO:
                HBGZPRoomModel.sendPlayCardMsg(temp,[]);
                break;
        }
    },

    /**
     * ???????????????????????????
     * @param idsArray ???????????????????????????id????????????
     * @param num ????????????
     * @param action ??????
     */
    displayOperateSelect:function(idsArray,num,action){
        var btnFace = this.btnPanel.getChildByTag(957);
        //if(btnFace && btnFace.visible && action === HBGZPDisAction.ZHA){
        //    HBGZPRoomModel.sendPlayCardMsg(action,[]);
        //    return;
        //}
        var width = 120+(idsArray.length-1)*65*1.2*1.5;
        var bg = UICtor.cS9Img("res/res_phz/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,230*1.5));
        var initX = (bg.width-65*idsArray.length*1.5-(idsArray.length-1)*5)/2*1.5;
        var scale = 0.35;
        for(var i=0;i<idsArray.length;i++){
            var array = idsArray[i];
            var innerbg = new UICtor.cImg("res/res_phz/chipai_single.png");
            innerbg.setTouchEnabled(true);
            innerbg.scale = 1.2;
            var clickbg = new UICtor.cImg("res/res_phz/chipai_click.png");
            clickbg.scale = 1.2;
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= true;
            for(var j=0;j<num;j++){
                var voData = HBGZPAI.getPHZDef(array[0]);
                if(action === HBGZPDisAction.ZHA){
                    voData = HBGZPAI.getPHZDef(array[j]);
                }
                var phz = new HBGZPCard(HBGZPAI.getDisplayVo(1,3),voData);
                phz.scale = scale;
                phz.x = -3 + (innerbg.width-phz.width*scale)/2;
                phz.y = 7 + j * phz.height * scale;
                innerbg.addChild(phz,num - j);
            }
            clickbg.x = innerbg.width/2+initX+i*(59+17)*1.5;
            clickbg.y = bg.height/2;
            innerbg.x = innerbg.width/2+initX+i*(59+17)*1.5;
            innerbg.y = bg.height/2;
            bg.addChild(innerbg);

            innerbg.idArray = array;
            innerbg.action = action;
            innerbg.clickbg = clickbg;
            UITools.addClickEvent(innerbg,this,this.onSelectOperate);
        }
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/4;
        this.btnPanel.addChild(bg,1,957);
        this.btnPanel.visible = true;
    },

    onCloseOperateFace:function(){
        if(this.btnPanel.getChildByTag(957))
            this.btnPanel.removeChildByTag(957);
    },

    onSelectOperate:function(obj){
        var idArray = obj.idArray;
        var action = obj.action;
        obj.clickbg.visible = true;
        HBGZPRoomModel.sendPlayCardMsg(action,idArray);
        if(action === HBGZPDisAction.ZHA){
            var vo = HBGZPAI.getPHZDef(idArray[0]);
            if(!this.hbgzpGuanArray){
                this.hbgzpGuanArray = [];
            }
            var data = this.hbgzpGuanArray || [];
            if(data.indexOf(vo.n) === -1){
                data.push(vo.n);
                this.hbgzpGuanArray = data;
            }
        }
    },


    checkGuoChi:function(result){
        //?????????????????????????????????
        for(var i = 0;i<result.length;++i){
            var temp = result[i];
            for(var j = 0;j<temp.length;++j){
                if(temp[j].c == this.lastLetOutMJ){
                    var t = temp.splice(j,1);
                    temp.unshift(t[0]);
                    break;
                }
            }
        }

        var ret = [];
        for(var i = 0;i<result.length;++i){
            var isDel = false;

            var v1 = result[i][1].v;
            var v2 = result[i][2].v;
            for(var j = 0;j<this.guoChiVals.length;++j){
                var tempArr = [v1,v2,this.guoChiVals[j]];
                tempArr.sort(function(a,b){return a-b});
                if((tempArr[1] - tempArr[0] == 1) && (tempArr[0] + tempArr[2] == tempArr[1]*2)){
                    isDel = true;
                    break;
                }
            }

            if(!isDel)ret.push(result[i]);
        }
        return ret;
    },

    /**
     * ???????????????????????????
     */
    resetChiSelect:function(){
        this.temp_chi_data = {};
        this.temp_chi_select_map = {};
        var bg = this.btnPanel.getChildByTag(this.tag_chi_select)
        if(bg){
            bg.removeAllChildren(true);
            bg.removeFromParent(true);
        }
    },

    /**
     * ????????????????????????
     * @param cardsArray
     * @param result ????????????????????????id????????????
     * @param needTimes ?????????????????????
     * @param curTime ?????????????????????
     */
    displayChiSelect:function(cardsArray,result,needTimes,curTime){
        if (curTime == 0){
            this.lastSelectChiBg =  {};
        }
        var width = 80+(result.length-1)*65*1.2;
        var bg = UICtor.cS9Img("res/res_phz/phzRoom/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,260));
        var initX = (bg.width-65*result.length-(result.length-1)*5)/2;
        var lastMJVo = HBGZPAI.getPHZDef(this.lastLetOutMJ);
        for(var i=0;i<result.length;i++){
            var array = result[i];
            var first = array[0];
            if(lastMJVo.t!=first.t || lastMJVo.n!=first.n){
                var firstIndex = -1;
                for(var a=0;a<array.length;a++){
                    if(array[a].t==lastMJVo.t&&array[a].n==lastMJVo.n&&firstIndex<0){
                        firstIndex=a;
                    }
                }
                if(firstIndex>=0){
                    array[0] = array[firstIndex];
                    array[firstIndex] = first;
                }
            }
            array.reverse();
            var innerbg = new UICtor.cImg("res/res_phz/phzRoom/chipai_single.png");
            innerbg.setTouchEnabled(true);
            innerbg.scale = 1.2;
            var clickbg = new UICtor.cImg("res/res_phz/phzRoom/chipai_click.png");
            clickbg.scale = 1.2;
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= false;
            var passArray = [];
            for(var j=0;j<array.length;j++){
                var phz = new HBGZPCard(HBGZPAI.getDisplayVo(1,2),array[j]);
                var scale = 0.5;
                // phz.scale=scale;
                phz.x = (innerbg.width-phz.width*scale)/2;
                phz.y = 7 + j * phz.height * scale;
                innerbg.addChild(phz);
                passArray.push(array[j].c);
            }
            clickbg.x = innerbg.width/2+initX+i*(59+17);
            clickbg.y = bg.height/2-15;
            innerbg.x = innerbg.width/2+initX+i*(59+17);
            innerbg.y = bg.height/2-15;
            bg.addChild(innerbg);
            var chiOrBiTex = curTime<1 ? "res/res_phz/phzRoom/chi-chi.png" : "res/res_phz/phzRoom/chi-bi.png";
            var chiOrBi = new cc.Sprite(chiOrBiTex);
            chiOrBi.x = innerbg.width/2;
            chiOrBi.y = bg.height-chiOrBi.height-40;
            innerbg.addChild(chiOrBi);
            passArray.reverse();
            innerbg.passArray = passArray;
            innerbg.cardsArray = cardsArray;
            innerbg.needTimes = needTimes;
            innerbg.curTime = curTime;
            innerbg.clickbg = clickbg;
            UITools.addClickEvent(innerbg,this,this.onSelectChiCard);
        }
        var preData = (ObjectUtil.size(this.temp_chi_data)>0) ? this.temp_chi_data[curTime-1] : null;
        var preTag = preData ? preData.tag : this.tag_chi_select;
        var curTag = this.tag_chi_select+curTime;
        if(preTag==(curTag-1) && this.btnPanel.getChildByTag(curTag)){
            this.btnPanel.removeChildByTag(curTag,true);
            if(this.btnPanel.getChildByTag(curTag+1))//?????????????????????????????????
                this.btnPanel.removeChildByTag((curTag+1),true);
            this.lastSelectChiBg[curTime] = null;
        }

        bg.x = preData ? preData.x-bg.width/2 : this.btnPanel.getChildByTag(this.tag_btn_chi).x+55;
        bg.y = 240;
        this.temp_chi_data[curTime] = {x:bg.x-bg.width/2,tag:curTag,itemCount:result.length,itemObj:bg};
        this.btnPanel.addChild(bg,1,curTag);
        if (curTime == 1 && preData){
            bg.x = bg.x - 30;
        }

        if (curTime == 2 && preData){
            bg.x = bg.x + 30;
        }
        //??????????????????11?????????????????????
        var itemCount = 0;
        for(var i=0;i<= curTime ;i++){
            var data = this.temp_chi_data[i];
            if (data && data.itemCount){
                itemCount = itemCount + data.itemCount;
            }
        }
        //cc.log("itemCount",itemCount)
        if (itemCount > 10 && curTime > 1){
            for(var i=0;i<= curTime ;i++){
                var data = this.temp_chi_data[i];
                if (data && data.itemObj){
                    if ( i == 0){
                        data.itemObj.x = this.btnPanel.getChildByTag(this.tag_btn_chi).x+55;
                    }else{
                        var data2 = this.temp_chi_data[i - 1];
                        data.itemObj.x = data2.x - data.itemObj.width/2;
                        //test
                        if (i == 1){
                            bg.x = data2.x - data.itemObj.width/2 -30;
                        }
                    }
                    data.itemObj.x = data.itemObj.x + 270;
                }
            }
        }else{
            for(var i=0;i<= curTime ;i++){
                var data = this.temp_chi_data[i];
                if (data && data.itemObj){
                    if ( i == 0){
                        data.itemObj.x = this.btnPanel.getChildByTag(this.tag_btn_chi).x+55;
                    }else{
                        var data2 = this.temp_chi_data[i - 1];
                        data.itemObj.x = data2.x - data.itemObj.width/2;
                        //test
                        if (i == 1){
                            bg.x = data2.x - data.itemObj.width/2 -30;;
                        }

                    }
                }
            }
        }
    },

    getLiuCards:function(){
        var result = [];

        var tempCards = {};

        if(this.lastLetOutMJ){
            var data = HBGZPAI.getPHZDef(this.lastLetOutMJ);
            tempCards[data.v] = [data];
        }
        if(this.lastLetOutMsg && this.lastLetOutMsg.actType == 0){
            tempCards = {};
        }

        var handCards = HBGZPMineLayout.cards;
        for (var i = 0; i < handCards.length; ++i) {
            var data = handCards[i].getData();
            if (!tempCards[data.v]) {
                tempCards[data.v] = [data];
            } else {
                tempCards[data.v].push(data);
            }
        }

        var moldCards = this.getLayout(1).getPlace2Data();
        for (var i = 0; i < moldCards.length; ++i) {
            var cards = moldCards[i].cards;
            if (moldCards[i].action == PHZAction.WEI) {
                for (var j = 0; j < cards.length; ++j) {
                    if(cards[j].a == 1)cards[j].a = 0;
                    if (!tempCards[cards[j].v]) {
                        tempCards[cards[j].v] = [cards[j]];
                    } else {
                        tempCards[cards[j].v].push(cards[j]);
                    }
                }
            }
        }
        for(var key in tempCards){
            if(tempCards[key] && tempCards[key].length == 4){
                result.push(tempCards[key]);
                if(tempCards[key][0].c == this.lastLetOutMJ){
                    result = [tempCards[key]];
                    break;
                }
            }
        }
        return result;
    },

    displayLiuSelect:function(result){

        var width = 80+(result.length-1)*65*1.2;
        var bg = UICtor.cS9Img("res/res_phz/phzRoom/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,260));
        var initX = (bg.width-65*result.length-(result.length-1)*5)/2;

        for(var i=0;i<result.length;i++){
            var array = result[i];

            var innerbg = new UICtor.cS9Img("res/res_phz/phzRoom/chipai_single.png",cc.rect(15,50,15,50),cc.size(57,240));
            innerbg.setTouchEnabled(true);

            var clickbg = new UICtor.cS9Img("res/res_phz/phzRoom/chipai_click.png",cc.rect(15,50,15,50),cc.size(57,240));
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= false;
            var passArray = [];
            for(var j=0;j<array.length;j++){
                var phz = new HBGZPCard(HBGZPAI.getDisplayVo(1,2),array[j]);
                var scale = 0.5;
                // phz.scale=scale;
                phz.x = (innerbg.width-phz.width*scale)/2;
                phz.y = 10 + j * phz.height * scale;
                innerbg.addChild(phz);
                if(j == 0)passArray.push(array[j].c);
            }
            clickbg.x = innerbg.x = innerbg.width/2+initX+i*(59+17);
            clickbg.y = innerbg.y = bg.height/2;

            bg.addChild(innerbg);

            innerbg.passArray = passArray;
            innerbg.clickbg = clickbg;
            UITools.addClickEvent(innerbg,this,this.onSelectLiuCard);
        }
        bg.x = 960;
        var optBtn = this.btnPanel.getChildByTag(this.tag_btn_liu);
        if(optBtn)bg.x = optBtn.x+55;
        bg.y = 240;

        this.btnPanel.removeChildByTag(1122);
        this.btnPanel.addChild(bg,1,1122);

    },

    onSelectLiuCard:function(sender){
        sender.clickbg.visible = true;
        HBGZPRoomModel.sendPlayCardMsg(PHZAction.TI,sender.passArray);
    },


    /**
     * ????????????????????????
     * @param cardsArray
     * @param result ????????????????????????id????????????
     * @param needTimes ?????????????????????
     * @param curTime ?????????????????????
     */
    getChiSelect:function(cardsArray,result,needTimes,curTime){
        var lastMJVo = HBGZPAI.getPHZDef(this.lastLetOutMJ);
        for(var i=0;i<result.length;i++){
            var array = result[i];
            var first = array[0];
            if(lastMJVo.t!=first.t || lastMJVo.n!=first.n){
                var firstIndex = -1;
                for(var a=0;a<array.length;a++){
                    if(array[a].t==lastMJVo.t&&array[a].n==lastMJVo.n&&firstIndex<0){
                        firstIndex=a;
                    }
                }
                if(firstIndex>=0){
                    array[0] = array[firstIndex];
                    array[firstIndex] = first;
                }
            }
            array.reverse();
            var innerbg = {};
            var passArray = [];
            for(var j=0;j<array.length;j++){
                passArray.push(array[j].c);
            }
            passArray.reverse();
            innerbg.passArray = passArray;
            innerbg.cardsArray = cardsArray;
            innerbg.needTimes = needTimes;
            innerbg.curTime = curTime;
            this.onGetChiCard(innerbg);
            //UITools.addClickEvent(innerbg,this,this.onSelectChiCard);
        }

    },

    /**
     * ???????????????????????????
     * @param obj
     */
    onGetChiCard:function(obj){
        //var passArray = obj.passArray;
        //var cardsArray = obj.cardsArray;
        //var needTimes = obj.needTimes;
        //var curTime = obj.curTime;
        //this.temp_chi_select_map[curTime] = passArray;
        //if(curTime>=needTimes){//?????????????????????????????????????????????
        //    HBGZPRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
        //}else{
        //    var nextCardsArray = [];
        //    for(var i=0;i<cardsArray.length;i++){
        //        var vo = cardsArray[i];
        //        if(ArrayUtil.indexOf(passArray,vo.c)<0)
        //            nextCardsArray.push(vo);
        //    }
        //    var result = PHZAI.getChi(nextCardsArray,PHZAI.getPHZDef(this.lastLetOutMJ));
        //    if(result.data.length>0){
        //        this.temp_chi_select_map = {};
        //        var sourceArray = PHZMineLayout.getCurVoArray();
        //        var lastMJ = PHZAI.getPHZDef(this.lastLetOutMJ);
        //        lastMJ.isChi=1;
        //        //?????????????????????????????????????????????????????????????????????????????????????????????????????????
        //        sourceArray.unshift(lastMJ);
        //        var result1 = PHZAI.getChi(sourceArray,lastMJ);
        //        this.displayChiSelect(sourceArray,result1.data,result1.needTimes,0);
        //    }else{
        //        HBGZPRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
        //    }
        //}
    },


    /**
     * ?????????????????????????????????ids
     * @param curTime
     * @returns {Array}
     */
    getRealChiIdsArray:function(curTime){
        var ids = [];
        for(var key in this.temp_chi_select_map){
            var time = parseInt(key);
            if(time<=curTime){
                ArrayUtil.merge(this.temp_chi_select_map[key],ids);
            }
        }
        cc.log("ids =",JSON.stringify(ids));
        return ids;
    },

    /**
     * ???????????????????????????
     * @param obj
     */
    onSelectChiCard:function(obj){
        //var passArray = obj.passArray;
        //var cardsArray = obj.cardsArray;
        //var needTimes = obj.needTimes;
        //var curTime = obj.curTime;
        //obj.clickbg.visible = true;
        //// cc.log("curTime =",curTime);
        //// cc.log("this.lastSelectChiBg[curTime] =",this.lastSelectChiBg[curTime]);
        //if (this.lastSelectChiBg && this.lastSelectChiBg[curTime]){
        //    if (this.lastSelectChiBg[curTime].clickbg != obj.clickbg)
        //        this.lastSelectChiBg[curTime].clickbg.visible = false;
        //}
        //this.lastSelectChiBg[curTime] = {clickbg:obj.clickbg,time:curTime};
        //// this.lastSelectChiBg{btn:obj,time:curTime};
        //this.temp_chi_select_map[curTime] = passArray;
        //if(curTime>=needTimes){//?????????????????????????????????????????????
        //    this.lastSelectChiBg = {};
        //    HBGZPRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
        //}else{
        //    var nextCardsArray = [];
        //    for(var i=0;i<cardsArray.length;i++){
        //        var vo = cardsArray[i];
        //        if(ArrayUtil.indexOf(passArray,vo.c)<0)
        //            nextCardsArray.push(vo);
        //    }
        //    var result = PHZAI.getChi(nextCardsArray,PHZAI.getPHZDef(this.lastLetOutMJ));
        //    if(result.data.length>0){
        //        this.displayChiSelect(nextCardsArray,result.data,needTimes,(curTime+1));
        //    }else{
        //        this.lastSelectChiBg = {};
        //        HBGZPRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
        //    }
        //}
    },

    /**
     * ???????????????????????????
     */
    hideAllBanker:function(){
        for(var key in this._players){
            this._players[key].isBanker(false);
            if(HBGZPRoomModel.renshu==4){
                this._players[key].isShuXing(false);
            }

        }
    },

    /**
     * ????????????,???DealInfoResponder??????
     * @param event
     */
    startGame:function(event){
        if(this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(false);
        }
        this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        PlayPHZMessageSeq.clean();
        //if (HBGZPRoomModel.intParams[7] == 3 || HBGZPRoomModel.intParams[7] == 2) {
            this.fapai.removeAllChildren();
        //}

        HBGZPRoomModel.isStart = true;
        this.jiesanBtn.visible = true;
        this.jiesanBtn.setBright(true);
        this.jiesanBtn.setTouchEnabled(true);
        this.tuichuBtn.visible = false;
        this.lastMoPHZ=this.lastLetOutMJ=this.lastLetOutSeat=0;
        HBGZPRoomModel.localZhaCount = 0;
        this.updateRoomInfo();
        if(this.root.getChildByTag(3003))
            this.root.removeChildByTag(3003);
        for(var i=1;i<=HBGZPRoomModel.renshu;i++){
            this.getWidget("oPanel"+i).removeAllChildren(true);
            this.getWidget("mPanel"+i).removeAllChildren(true);
            if(this._players[i]){
                this._players[i].playerQuanAnimation(false);
                this._players[i].hideQiHuImg();
                this._players[i].hideDaNiaoType();
            }
            var layout = this.layouts[i];
            if(layout)//?????????????????????????????????
                layout.clean();
        }
        this.Button_invite.visible = this.Button_ready.visible =false;
        this.fapai.visible = this.Label_remain.visible = true;
        var p = event.getUserData();

        //?????????????????????
        //this.hideAllBanker();
        //?????????????????????
        var voArray = [];
        for(var i=0;i<p.handCardIds.length;i++){
            voArray.push(HBGZPAI.getPHZDef(p.handCardIds[i]));
        }

        this._countDown = HBGZPRoomModel.intParams[8] || 30;
        var direct = HBGZPRoomModel.getPlayerSeq(PlayerModel.userId,HBGZPRoomModel.mySeat,HBGZPRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        //this._players[p.banker].isBanker(true);
        //this.Button_sort.visible = true;
        HBGZPRoomModel.nextSeat = p.nextSeat;
        HBGZPRoomModel.remain = p.remain;
        this.showJianTou(HBGZPRoomModel.nextSeat);
        this.updateRemain();
        //if (p.xiaohu[1] == HBGZPRoomModel.mySeat){
            this.Button_sort.visible = false;
        //}

        this.hbgzpGuanArray = [];

        ////??????3???????????????
        for(var i=1;i<=HBGZPRoomModel.renshu;i++){
            if(i != HBGZPRoomModel.mySeat){
                var d = HBGZPRoomModel.getPlayerSeq("",HBGZPRoomModel.mySeat,i);
                var iseat = (i==p.banker) ? i : null;
                this.initCards(d,[],[],[],[],iseat);
            }else{
                var localHuxi = HBGZPAI.getAllHuxi(HBGZPMineLayout.getCurVoArray(),HBGZPRoomModel.JianArray);
                this._players[i].updateHuXi(localHuxi);
            }
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
        this.refreshButton(p.selfAct);

        this.guoChiVals = [];

        this.Panel_piaofen.visible = false;
        this.showWaitSelectPiao(false);
        // cc.log("========startGame============",this.piaofenTime);
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
            this.piaofenTime = null;
        }

        //var self = this;
        //setTimeout(function(){
        //    if (voArray.length > 0 ){
        //        self.checkHu(voArray);
        //    }
        //},1);
    },

    /**
     * ????????????????????????????????????????????????????????????
     * @param selfAct {Array.<number>}
     */
    refreshButton:function(selfAct){
        cc.log("==========refreshButton===============",selfAct);
        HBGZPRoomModel.selfAct = selfAct || [];
        this.btnPanel.removeAllChildren(true);
        if(selfAct.length>0){
            this.btnPanel.visible = true;
            if (HBGZPRoomModel.sxSeat == HBGZPRoomModel.mySeat){
                this.btnPanel.visible = false;
            }
            var textureMap = {
                0:{t:"res/res_phz/res_hbgzp/bt_hu.png",v:1,index:6},
                1:{t:"res/res_phz/res_hbgzp/bt_peng.png",v:2,index:2},
                2:{t:"res/res_phz/res_hbgzp/bt_zhao.png",v:3,index:3},
                3:{t:"res/res_phz/res_hbgzp/bt_zha.png",v:4,index:4},
                4:{t:"res/res_phz/res_hbgzp/bt_chi.png",v:6,index:1},
                5:{t:"res/res_phz/res_hbgzp/bt_zimo.png",v:1,index:7},
                6:{t:"res/res_phz/res_hbgzp/bt_hua.png",v:7,index:5}
               };

            var hasHu = false;
            var btnCount = 0;
            var btnDatas = [];
            for(var i=0;i<selfAct.length;i++) {
                var temp = selfAct[i];
                var tm = textureMap[i];
                if (temp == 1) {
                    btnDatas.push(tm);
                    if(tm && parseInt(tm.v)==1) {
                        if (HBGZPRoomModel.isHued()) {
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
                this.btnPanel.visible = false;
                return;
            }

            var isShowBtn = true;

            if(btnDatas.length>0 && isShowBtn){
                var temp = [];
                temp.push({t:"res/res_phz/res_hbgzp/bt_qi.png",v:5,index:0});//????????????
                for(var i = 0;i < btnDatas.length;++i){
                    temp.push(btnDatas[i]);
                }
               btnDatas = temp.slice(0);
               btnDatas.sort(function(a,b){
                    return a.index - b.index;
               });
                var w = 177;
                var g = 30;
                var len = btnDatas.length;
                var initX = 1275;
                var cardX = 0;
                for(var i=0;i<len;i++){
                    var btnData = btnDatas[i];
                    var btn = new ccui.Button();
                    btn.anchorX=btn.anchorY=0;
                    btn.anchorY = 0.5;
                    btn.loadTextureNormal(btnData.t);
                    btn.temp = btnData.v;
                    btn.x = initX - (len-i-1)*w - w/2 - (len-i-1)*g;
                    if(i == len - 1 && btnData.v === 7 && (btnDatas[i - 1].v === 1 && selfAct[5] === 1)){//??????????????????,???????????????????????????
                        btn.x += 85 * 1.5;
                    }
                    btn.y = 50 * 1.5;
                    btn.state = hasHu;
                    UITools.addClickEvent(btn,this,this.onPengPai);
                    var tag = (btnData.v == 6) ? this.tag_btn_chi : this.tag_btn_other;

                    if(btnData.v == 4)tag = this.tag_btn_liu;

                    this.btnPanel.addChild(btn,0,tag);
                    if (i == 0){
                        cardX = btn.x;
                    }
                }
                this.lastCardX = cardX;
            }
        }
    },

    /**
     * ??????????????????????????????
     */
    showTipCard:function(){
        if(this.btnPanel.getChildByTag(321))
            this.btnPanel.removeChildByTag(321);
        if (this.lastLetOutMJ && this.lastLetOutMJ > 0){
            var lastCard = HBGZPAI.getPHZDef(this.lastLetOutMJ);
            //cc.log("lastCard==="+JSON.stringify(lastCard))
            var phz = this.lastCard = new HBGZPCard(HBGZPAI.getDisplayVo(1,1),lastCard,null,true);
            var scaleY = 0.75;
            var scaleX = 0.9;
            phz.scaleY = scaleY;
            phz.scaleX = scaleX;
            phz.numberImg.scaleY = 1/scaleY;
            phz.numberImg.scaleX = 1/scaleX;
            phz.numberImg.y -= 8;
            phz.setAnchorPoint(cc.p(1,0));
            phz.x = this.lastCardX - 5;
            phz.y = 0;
            this.btnPanel.addChild(phz,1,321);
        }
    },

    /**
     * ?????????????????????????????????????????????
     */
    cleanChuPai:function(){
        for(var i=1;i<=HBGZPRoomModel.renshu;i++){
            this.getWidget("cp"+i).removeAllChildren(true);
        }
    },

    /**
     * ????????????
     */
    cancelFangZhao:function(){
        this.cleanChuPai();
        this.lastMoPHZ=0;
    },

    /**
     * ???????????????????????????????????????,???PlayPaohuziResponder??????
     * @param event
     */
    onLetOutCard:function(event){
        this.updateCountDown(this.COUNT_DOWN);
        //HBGZPRoomModel.nextSeat = 0;
        //this.showJianTou(0);//????????????
        var message = event.getUserData();
        var userId = message.userId;
        var seat = message.seat;
        var action = message.action;
        var selfAct = message.selfAct;
        var ids = message.majiangIds;
        var simulate = message.simulate;
        var ext = message.ext;
        var isOtherHasAction = 0;
        this.cleanChuPai();
        if (seat==HBGZPRoomModel.mySeat) {//????????????
            this.Panel_shouzhi.visible = false;
            this.Image_hdx.visible = false;
        }

        if(!simulate) {
            if (seat!=HBGZPRoomModel.mySeat){
                this._players[seat].updateHuXi(message.xiaohu[0]||0);
            }else{
                var temp = message.xiaohu[0]||0;
                if(HBGZPRoomModel.myOutHuxi < temp){
                    HBGZPRoomModel.myOutHuxi = temp;
                }
            }
        }

        var isHasOperate = true;
        for(var i = 0;i < selfAct.length;++i){
            if(selfAct[i] == 1){
                isHasOperate = false;
                break;
            }
        }

        if(ext && ext.length>0)
            isOtherHasAction = parseInt(ext[0]);
        var direct = HBGZPRoomModel.getPlayerSeq(userId,HBGZPRoomModel.mySeat,seat);
        //????????????????????????????????????????????????????????????????????????????????????????????????
        if(seat==HBGZPRoomModel.mySeat&&action==0&&ids.length>0&&!simulate){
            if(HBGZPMineLayout.isHasHardCard(ids[0])==null) {
                PlayPHZMessageSeq.finishPlay();
                return;
            }
        }

        //????????????????????????????????????????????????
        if (seat==PHZRoomModel.mySeat){
            this.btnPanel.visible = false;
        }

        if(action == 0 && ids.length > 0){
            this.layouts[direct].chuPai(HBGZPAI.getPHZDef(ids[0]),true);
        }

        HBGZPRoomModel.isTingSelecting=false;
        HBGZPRoomModel.lzTingResult.length = 0;

        var self = this;
        this.updateRemain();
        switch (action){
            case HBGZPDisAction.CHUPAI://????????????
                if(isOtherHasAction==0){
                    var nextSeat = HBGZPRoomModel.seatSeq[seat][1];
                    HBGZPRoomModel.nextSeat = nextSeat;
                }
                if(ids.length>0){
                    HBGZPMineLayout.delCards([HBGZPAI.getPHZDef(ids[0])]);
                    HBGZPRoomEffects.chuPai(this.getWidget("cp"+direct),HBGZPAI.getPHZDef(ids[0]),2,HBGZPRoomModel.renshu,direct,
                        self.getWidget("oPanel"+direct),function(){
                            if(seat==HBGZPRoomModel.mySeat){
                                var voArray = HBGZPMineLayout.getCurVoArray();
                                var localHuxi = HBGZPAI.getAllHuxi(voArray,HBGZPRoomModel.JianArray);
                                self._players[seat].updateHuXi((HBGZPRoomModel.myOutHuxi||0) + localHuxi);
                                if(HBGZPRoomModel.lastMoPaiId !== ids[0] && HBGZPRoomModel.lastMoPaiToIndex !== HBGZPRoomModel.lastMoPaiFromIndex){//????????????????????????
                                    if(HBGZPRoomModel.JianArray.indexOf(HBGZPRoomModel.lastMoPaiId) === -1){//????????????
                                        HBGZPMineLayout.insertCard(HBGZPAI.getPHZDef(HBGZPRoomModel.lastMoPaiId),HBGZPRoomModel.lastMoPaiFromIndex,HBGZPRoomModel.lastMoPaiToIndex);
                                    }
                                }
                                HBGZPRoomModel.lastMoPaiId = 0;
                                HBGZPRoomModel.lastMoPaiFromIndex = 0;
                                HBGZPRoomModel.lastMoPaiToIndex = 0;
                                self.hideHandsTingImg();//????????????
                                //HBGZPMineLayout.clearTingPai();//????????????
                            }
                            PlayPHZMessageSeq.finishPlay();
                        }
                    );
                    this.tempLastLetOutMJ = this.lastLetOutMJ;//?????????????????????
                    this.lastLetOutMJ = ids[0];
                    this.lastLetOutSeat = seat;
                    PHZRoomSound.hbgzpLetOutSound(userId,HBGZPAI.getPHZDef(ids[0]).n);
                    //this.showJianTou(seat);
                    var index = HBGZPRoomModel.JianArray.indexOf(ids[0]);//????????????????????????
                    HBGZPRoomModel.localJianVo = null;
                    if(index !== -1){
                        HBGZPRoomModel.JianArray.splice(index,1);
                    }
                }
                break;
            case HBGZPDisAction.HU://????????????
                var soundPrefix = "hu";
                HBGZPRoomEffects.huPai(this.root,direct,HBGZPRoomModel.renshu);
                PHZRoomSound.hbgzpLetOutSound(userId,soundPrefix);
                break;
            case HBGZPDisAction.PASS://???
                if(isOtherHasAction == 0 && HBGZPRoomModel.renshu === 2){
                    HBGZPRoomModel.nextSeat = seat;
                    this.showJianTou(seat);
                }
                ////???????????????????????????????????????????????????????????????
                //if(HBGZPRoomModel.needAutoLetOutId>0)
                //    HBGZPRoomModel.chuMahjong(HBGZPRoomModel.needAutoLetOutId);
                break;
            case HBGZPDisAction.ZHA://???
                if(isOtherHasAction == 0){
                    HBGZPRoomModel.nextSeat = seat;
                }
                this.onCloseOperateFace();//???????????????
                this.showJianTou(seat);
                PHZRoomSound.hbgzpLetOutSound(userId,"guan");
                HBGZPRoomEffects.normalAction("zha",this.root,direct,HBGZPRoomModel.renshu);
                if(seat === HBGZPRoomModel.mySeat){
                    this.hideHandsTingImg();//????????????
                    if(HBGZPRoomModel.lastMoPaiId && HBGZPRoomModel.lastMoPaiToIndex !== HBGZPRoomModel.lastMoPaiFromIndex){//????????????????????????
                        if(HBGZPRoomModel.JianArray.indexOf(HBGZPRoomModel.lastMoPaiId) === -1){//????????????
                            HBGZPMineLayout.insertCard(HBGZPAI.getPHZDef(HBGZPRoomModel.lastMoPaiId),HBGZPRoomModel.lastMoPaiFromIndex,HBGZPRoomModel.lastMoPaiToIndex);
                            //HBGZPMineLayout.updateCard();
                        }
                    }
                    //setTimeout(function(){
                    //    self.checkHu(voArray);
                    //},10);
                }
                break;
            case HBGZPDisAction.JIAN://??? = ???
                if(isOtherHasAction == 0){
                    HBGZPRoomModel.nextSeat = seat;
                }
                var lastLetOutMJ = this.lastLetOutMJ;
                var lastLetOutSeat = this.lastLetOutSeat || seat;
                if(ArrayUtil.indexOf(ids,lastLetOutMJ) >= 0){//?????????????????????????????????
                    var pSeat = HBGZPRoomModel.getPlayerSeq("",HBGZPRoomModel.mySeat,lastLetOutSeat);
                    this.layouts[pSeat].beiPengPai(lastLetOutMJ);
                }
                var vo = HBGZPAI.getPHZDef(ids[0]);
                if(vo && HBGZPRoomModel.mySeat == seat){
                    vo.isJian = 1;
                    HBGZPRoomModel.JianArray.push(ids[0]);
                    HBGZPRoomModel.localJianVo = vo;
                    HBGZPMineLayout.handleLongBuZi(vo);
                }
                this.showJianTou(seat);
                PHZRoomSound.hbgzpLetOutSound(userId,"jian");
                HBGZPRoomEffects.normalAction("chi",this.root,direct,HBGZPRoomModel.renshu);
                if(seat==HBGZPRoomModel.mySeat){
                    this.hideHandsTingImg();//????????????
                    var voArray = HBGZPMineLayout.getCurVoArray();
                    var localHuxi = HBGZPAI.getAllHuxi(voArray,HBGZPRoomModel.JianArray);
                    this._players[seat].updateHuXi((HBGZPRoomModel.myOutHuxi||0) + localHuxi);
                    //setTimeout(function(){
                    //    self.checkHu(voArray);
                    //},10);
                }
                break;
            default://?????????????????????????????????
                var prefix = "peng";
                if(action==HBGZPDisAction.PENG){
                    prefix = "peng";
                }else if(action==HBGZPDisAction.ZHAO){
                    prefix = "zhao";
                }else if(action==HBGZPDisAction.HUA){
                    prefix = "hua";
                }
                PHZRoomSound.hbgzpLetOutSound(userId,prefix);
                HBGZPRoomEffects.normalAction(prefix,this.root,direct,HBGZPRoomModel.renshu);
                if(this.lastLetOutMJ !== 0) {
                    HBGZPRoomModel.nextSeat = seat;
                    this.showJianTou(seat);
                }
                if(ids.length>0){
                    //??????????????????2????????????????????????????????????????????????this????????????2??????????????????????????????????????????
                    var lastLetOutMJ = self.lastLetOutMJ;
                    var lastLetOutSeat = self.lastLetOutSeat || seat;
                    var nowBurCount = HBGZPRoomModel.nowBurCount;
                    HBGZPRoomEffects.chiAnimate(ids,this.root,direct,function(){
                        //???????????????????????????????????? ?????????????????????
                        if (nowBurCount == HBGZPRoomModel.nowBurCount) {
                            if(ArrayUtil.indexOf(ids,lastLetOutMJ) >= 0){//?????????????????????????????????
                                // cc.log("lastLetOutSeat =",lastLetOutSeat);
                                var pSeat = HBGZPRoomModel.getPlayerSeq("",HBGZPRoomModel.mySeat,lastLetOutSeat);
                                self.layouts[pSeat].beiPengPai(lastLetOutMJ);
                            }
                            self.layouts[direct].chiPai(ids,action,direct,false);
                        }
                        PlayPHZMessageSeq.finishPlay();
                        //self.finishLetOut(seat,action,ids);
                    },action,nowBurCount);
                    var needDel = [];
                    for(var i=0;i<ids.length;i++) {
                        needDel.push(HBGZPAI.getPHZDef(ids[i]));
                    }
                    HBGZPMineLayout.delCards(needDel);
                    if(seat==HBGZPRoomModel.mySeat){
                        this.hideHandsTingImg();//????????????
                        var voArray = HBGZPMineLayout.getCurVoArray();
                        var localHuxi = HBGZPAI.getAllHuxi(voArray,HBGZPRoomModel.JianArray);
                        this._players[seat].updateHuXi((HBGZPRoomModel.myOutHuxi||0) + localHuxi);
                        //setTimeout(function(){
                        //    self.checkHu(voArray);
                        //},10);
                    }
                }
                break;
        }
        if(seat==HBGZPRoomModel.mySeat){
            var isSelf = HBGZPAI.isSelfMoPai(HBGZPMineLayout.cards,HBGZPRoomModel.localZhaCount);//????????????????????????
            if(!isSelf && this.lastLetOutMJ !== 0){
                HBGZPMineLayout.clearTingPai();//????????????
            }
        }
        if(this.lastLetOutMJ !== 0 || action === 5){
            this.refreshButton(selfAct);
        }
        PlayPHZMessageSeq.finishPlay();

    },

    fixMyCardError:function(event){
        //?????????????????? ??????????????????
        if(event){
            this.fixMyCard(event);
            FloatLabelUtil.comText("???????????????????????????????????????");
        }
    },

    fixMyCard:function(event){
        //?????????????????? ??????????????????
        if(event){
            var message = event.getUserData();
            var params = message.params;
            var id = params[0];
            this.cleanChuPai();
            if(this.tempLastLetOutMJ == 0){
                this.lastLetOutMJ = 0;
            }
            HBGZPRoomModel.nextSeat = HBGZPRoomModel.mySeat;
            this.showJianTou(HBGZPRoomModel.mySeat);
            this.getLayout(1).fixOutCard(id);
            HBGZPMineLayout.addOne(id);
            if(this.tempLastLetOutMJ == 0){
                this.lastLetOutMJ = 0;
                if(this.outTingInfo.length > 0){
                    HBGZPMineLayout.outCardTingPai(this.outTingInfo);
                    this.CanClealTingImg = false;
                }
            }
        }
    },

    hideAction:function(){
        this.resetChiSelect();
        this.btnPanel.removeAllChildren(true);
    },

    delayLetOut:function(seat,action,ids){
        var self = this;
        //self.finishLetOut(seat,action,ids);
        //setTimeout(function(){self.finishLetOut(seat,action,ids)},100);
    },

    finishLetOut:function(seat,action,ids){
        //if(seat==HBGZPRoomModel.mySeat) {//?????????????????????????????????????????????????????????
        //    var toId = ids.length>0 ? ids[0] : 0;
        //    HBGZPRoomModel.sendPlayCardMsg(9, [action,toId]);
        //}
        PlayPHZMessageSeq.finishPlay();
    },

    /**
     * ??????
     */
    onReady:function(){
        sySocket.sendComReqMsg(4);
    },

    /**
     * ??????
     */
    onInvite:function(){
        var wanfa = "???????????????";
        //var payTypeDesc = "????????????";
        //if(HBGZPRoomModel.getCostFangShi() == 1){
        //    payTypeDesc = "AA??????";
        //}else if(HBGZPRoomModel.getCostFangShi() == 3){
        //    payTypeDesc = "????????????";
        //}

        var wanfaDesc = HBGZPRoomModel.getWanFaDesc();

        var playerNum = " "+ HBGZPRoomModel.renshu + "???" + (HBGZPRoomModel.renshu - HBGZPRoomModel.players.length);

        var obj={};
        obj.tableId=HBGZPRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+HBGZPRoomModel.tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title=wanfa+'   ??????:'+HBGZPRoomModel.tableId + playerNum;
        var clubStr = "";
        if (HBGZPRoomModel.isClubRoom(HBGZPRoomModel.tableType)){
            clubStr = "[?????????]";
        }
        obj.description=clubStr + csvhelper.strFormat("??????????????????{0}??????{1}",HBGZPRoomModel.totalBurCount ,wanfaDesc);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    /**
     * ????????????
     */
    onLeave:function(){
        sySocket.sendComReqMsg(6);
    },

    /**
     * ??????
     */
    onBreak:function(){
        AlertPop.show("???????????????????????????????????????????????????????????????",function(){
            sySocket.sendComReqMsg(7);
        },null,2)
    },

    /**
     * ??????????????????
     * @param event
     */
    onStartSpeak:function(event){
        var userId = event.getUserData();
        var p =HBGZPRoomModel.getPlayerVo(userId);
        if(p){
            this._players[p.seat].startSpeak();
        }
    },

    /**
     * ???????????????
     * @param event
     */
    onStopSpeak:function(event){
        var userId = event.getUserData();
        var p =HBGZPRoomModel.getPlayerVo(userId);
        if(p){
            this._players[p.seat].stopSpeak();
        }
    },

    /**
     * ?????????????????????JoinTableResponder??????
     * @param event
     */
    onJoin:function(event){
        var p = event.getUserData();
        var seq = HBGZPRoomModel.getPlayerSeq(p.userId,HBGZPRoomModel.mySeat,p.seat);
        this._players[p.seat] = new HBGZPPlayer(p,this.root,seq);
        this.Button_invite.visible = (ObjectUtil.size(this._players)<HBGZPRoomModel.renshu);
        var seats = HBGZPRoomModel.isIpSame();
        if(seats.length>0 && HBGZPRoomModel.renshu != 2){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }
    },

    /**
     * ????????????????????????
     * @param event
     */
    onOnline:function(event){
        var data = event.getUserData();
        //this._players[data[0]].leaveOrOnLine(data[1]);
    },

    /**
     * ????????????
     * @param event
     */
    onExitRoom:function(event){
        var p = event.getUserData();
        this._players[p.seat].exitRoom();
        delete this._players[p.seat];
        var seats = HBGZPRoomModel.isIpSame();
        this.Button_invite.visible = (ObjectUtil.size(this._players)<HBGZPRoomModel.renshu);
        for (var key in this._players) {
            if (ArrayUtil.indexOf(seats, key) < 0) {
                this._players[key].isIpSame(false);
            }
        }
    },

    /*
     * ??????
     * */
    onFangZhao:function(event){
        cc.log("?????????????????????...");
        var msg = event.getUserData();
        for(var i=0;i<HBGZPRoomModel.players.length;i++){
            var p = HBGZPRoomModel.players[i];
            if(p.userId == msg.userId){
                this._players[p.seat].isShowFangZhao(msg.fangzhao);
            }
        }
    },

    /**
     * ?????????????????????layout??????
     * @param direct
     * @returns {*}
     */
    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        layout = new HBGZPLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    /**
     * ???????????????????????????
     * @param seat
     */
    showJianTou:function(seat,isTing){
        seat = seat || HBGZPRoomModel.nextSeat;
        //cc.log("seat========"+seat);
        //cc.log("HBGZPRoomModel.timeSeat========"+HBGZPRoomModel.timeSeat);
        cc.log("HBGZPRoomModel.nextSeat========"+HBGZPRoomModel.nextSeat);
        if(seat > 0){
            this.Image_time.visible = true;
            var direct = HBGZPRoomModel.getPlayerSeq("",HBGZPRoomModel.mySeat,seat);
            this.timeDirect = direct;
            var coords = null;
            if(HBGZPRoomModel.renshu==4){
                coords = {1:{x:0,y:220},2:{x:0,y:220},3:{x:0,y:220},4:{x:0,y:220}};
                //coords = {1:{x:100 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:80},2:{x:1085 + (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,y:525},3:{x:300 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:600},4:{x:100 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:525}};
            }else if(HBGZPRoomModel.renshu==3){
                //coords = {1:{x:100 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:90},2:{x:985 + (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,y:525},3:{x:250 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:525}};
                coords = {1:{x:200 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:190},2:{x:1600 + (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,y:800},3:{x:200 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:800}};
            }else{
                //coords = {1:{x:100 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:100},2:{x:1085 + (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,y:525}};
                coords = {1:{x:200 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:190},2:{x:1600 + (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,y:800}};
            }
            var coord = coords[direct];
            this.Image_time.x = coord.x;
            this.Image_time.y = coord.y;

            for(var index = 1 ; index <= HBGZPRoomModel.renshu ; index ++) {
                if (this._players[index]) {
                    this._players[index].playerQuanAnimation(index == seat);
                }
            }
        }
        //??????????????????????????????Id
        HBGZPRoomModel.setTouchCard(0);
        this.Panel_shouzhi.visible = HBGZPRoomModel.isShowFinger();
        this.Image_hdx.visible = HBGZPRoomModel.isShowFinger();
        if (HBGZPRoomModel.isShowFinger() && this.lastLetOutMJ != 0) {
            //cc.log("cleanTingPanel....  ")
            this.cleanTingPanel();
        }
    },

    /**
     * ?????????layout???????????????
     * @param direct
     * @param p1Mahjongs
     * @param p2Mahjongs
     * @param p3Mahjongs
     * @param extMahjongs
     */
    initCards:function(direct,p1Mahjongs,p2Mahjongs,p3Mahjongs,extMahjongs,seat,isMoPai){
        //this.Image_hdx.visible = true;
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),seat,isMoPai);
        layout.refresh(p1Mahjongs,p2Mahjongs,p3Mahjongs,extMahjongs);
        if(direct==1){
            //this.getWidget("minePanel").y = 21;
            var jianArr = HBGZPAI.getJianArray(p2Mahjongs);
            HBGZPRoomModel.JianArray = jianArr || [];
            HBGZPMineLayout.initData(p1Mahjongs,this.getWidget("minePanel"));
        }
    },

    /**
     * ????????????????????????
     */
    runPropAction:function(event){
        //seat ?????????????????????  userId??????????????????userId  content????????????????????????
        var data = event.getUserData();
        var userId = data.userId;
        var seat = data.seat;
        var content = data.content;
        var p = HBGZPRoomModel.getPlayerVo(userId);
        var fromPlayer = this._players[p.seat];
        var targetPlayer = this._players[seat];
        if(fromPlayer._playerVo.userId != targetPlayer._playerVo.userId) {
            var url = "res/ui/dtz/chat/prop" + content + ".png";
            var prop = new cc.Sprite(url);
            var initX = fromPlayer.getContainer().x;
            var initY = fromPlayer.getContainer().y;
            var x = initX + 40;
            var y = initY + 40;

            prop.setPosition(x, y);
            this.root.addChild(prop,2000);
            initX = targetPlayer.getContainer().x;
            initY = targetPlayer.getContainer().y;
            var targetX = initX + 40;
            var targetY = initY + 40;

            var action = cc.sequence(cc.moveTo(0.3, targetX, targetY), cc.callFunc(function () {
                targetPlayer.playPropArmature(content);
                prop.removeFromParent(true);
            }));
            prop.runAction(action);
        }else{
            targetPlayer.playPropArmature(content);
        }
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    initSetData:function(){
        this.updateSetKscp();
        //this.updateSetKqtp();
        this.updateSetYyxz();
        this.updateSetCpsd();
        //this.updateSetZpdx();
        this.updateSetXxxz();
        //this.updateSetZpxz();
        this.updateBgColor();
    },
    updateSetKscp:function(){
        //???????????????
        //???????????????chenck
    },
    updateSetKqtp:function(event){
        var tingType = 0;
        if (event){
            tingType = event.getUserData();
        }
        if (HBGZPSetModel.kqtp){
            if (tingType == 2){
                this.checkTingList();
            }
        }else{
            this.cleanTingPanel();
            this.hideHandsTingImg();
        }
        if (this.Panel_tingPai) {
            this.Panel_tingPai.visible = (HBGZPSetModel.kqtp == 1);
        }
        //???????????????
    },
    updateSetYyxz:function(){
        //???????????????
    },
    updateSetCpsd:function(){
        //???????????????
    },
    updateSetZpdx:function(){
        if (HBGZPMineLayout){
            HBGZPMineLayout.changeHandCardSize();
        }
        if (this.lastCard) {
            this.showTipCard()
        }
    },
    updateSetXxxz:function(){
        //this.Image_hdx.y = 320;
        //HBGZPSetModel.cardTouchend = 318;
        //if (HBGZPSetModel.xxxz == 1){
        //    this.Image_hdx.y = 360;
        //    HBGZPSetModel.cardTouchend = 338;
        //}
    },
    updateSetZpxz:function(){
        for(var i=1;i<=HBGZPRoomModel.renshu;i++){
            if (this.layouts[i]){
                this.layouts[i].changeOutCardTextrue()
            }
        }
        if (HBGZPMineLayout){
            HBGZPMineLayout.changeHandCardTextrue();
        }
        if (HBGZPRoomEffects){
            HBGZPRoomEffects.refreshCardByOpenTex()
        }
        if (this.lastCard){
            this.lastCard.refreshCardByOpenTex();
        }
    },
    updateSetPmxz:function(){
        for(var i=1;i<=HBGZPRoomModel.renshu;i++){
            if (this.layouts[i]){
                this.layouts[i].changeOutCardBg()
            }
        }
        if (HBGZPMineLayout){
            HBGZPMineLayout.changeHandCardBg();
        }
        if (HBGZPRoomEffects){
            HBGZPRoomEffects.refreshCardBgByOpenTex()
        }
        if (this.lastCard){
            this.lastCard.refreshCardBgByOpenTex();
        }
    },
    updateSetIscp:function(){
        if (HBGZPMineLayout){
            HBGZPMineLayout.setCardOffY();
        }
    },
    updateBgColor:function(){
        var bgTexture = "res/res_phz/roombg/room_bg1.jpg";
        var gameTypeUrl = "";
        var ldfpf_qihuType ="";
        var ldfpf_manbaiType ="";
        var wanfaUrl = "";
        gameTypeUrl = "res/res_phz/wanfaImg/gametype1_hbgzp.png";
        if (HBGZPSetModel.zmbj == 1){
            this.roomName_label.setColor(cc.color(214,203,173));
        }else if (HBGZPSetModel.zmbj == 2 || HBGZPSetModel.zmbj == 5){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype2_hbgzp.png";
            bgTexture = "res/res_phz/roombg/room_bg2.jpg";
            if (HBGZPSetModel.zmbj == 5){
                bgTexture = "res/res_phz/roombg/room_bg5.jpg";
            }
            this.roomName_label.setColor(cc.color(204,204,204));
        }else if (HBGZPSetModel.zmbj == 3){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype3_hbgzp.png";
            bgTexture = "res/res_phz/roombg/room_bg3.jpg";
            this.roomName_label.setColor(cc.color(97,76,56));
        }else if (HBGZPSetModel.zmbj == 4){
            bgTexture = "res/res_phz/roombg/room_bg4.jpg";
            this.roomName_label.setColor(cc.color(214,203,173));
        }
        if(gameTypeUrl){
            this.Image_phz.loadTexture(gameTypeUrl);
            this.Image_phz.setScale(1.5);
        }else{
            this.Image_phz.visible = false;
        }
        if(wanfaUrl){
            this.Image_phzdetail.loadTexture(wanfaUrl);
        }else{
            this.Image_phzdetail.visible = false;
        }

        //this.Panel_20.setBackGroundImage(bgTexture);
        this.Image_phzBg.loadTexture(bgTexture);
        this.Image_manbai.loadTexture(ldfpf_manbaiType);
        this.Image_qihu.loadTexture(ldfpf_qihuType);
    },
    /**
     * isIphoneX ??????????????????
     * * **/
    upMoveHandCard:function(diffY){
        this.getWidget("minePanel").y  = this.getWidget("minePanel").y + diffY;
    },

    /**
     * ???????????????
     * * **/
    hideTingPaiPanel:function(){
        this.Panel_tingPai.visible = false;
    },
    //???????????????????????????
    cleanSPanel:function(){
        for(var n=0;n<HBGZPRoomModel.renshu;n++) {
            var i = n + 1;
            var sPanel = this.getWidget("sPanel" + i);
            sPanel.removeAllChildren(true);
        }
    },

    //????????????????????????????????????
    cleanomPanel:function(){
        for(var n=0;n<HBGZPRoomModel.renshu;n++) {
            var i = n + 1;
            var sPanel = this.getWidget("oPanel" + i);
            var mPanel = this.getWidget("mPanel" + i);
            sPanel.removeAllChildren(true);
            mPanel.removeAllChildren(true);
        }
    },
    //????????????????????????????????????
    showSparePai:function(ClosingInfoModel){
        //var oneCards1 = [];
        //oneCards1[0] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        //oneCards1[1] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        //oneCards1[2] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        //oneCards1[3] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        for(var n=0;n<HBGZPRoomModel.renshu;n++) {
            var onePlayerVo = ClosingInfoModel.closingPlayers[n];
            var oneCards = onePlayerVo.cards;//???????????????id???
            //var oneCards  = oneCards1[n];
            var cardVo = HBGZPAI.getVoArray(oneCards);//????????????
            var zorder = cardVo.length;
            var result = HBGZPAI.sortHandsVo(cardVo);
            for (var i = 0; i < result.length; i++) {
                var seat = onePlayerVo.seat;
                //var seat = n+1;
                var seq = HBGZPRoomModel.getPlayerSeq("",HBGZPRoomModel.mySeat,seat);
                var cardArray = result[i];
                for (var j = 0; j < cardArray.length; j++) {
                    if(seq!=1) {
                        var scale = 0.9;
                        var card = new HBGZPCard(HBGZPAI.getDisplayVo(seq, 2), cardArray[j]);
                        var sPanel = this.getWidget("sPanel" + seq);
                        sPanel.addChild(card, zorder);
                        card.scale = scale;
                        var gx = 39*scale;
                        var gy = 40*scale;
                        if(HBGZPRoomModel.renshu>3){
                            if(seq!=3){
                                card.x = (seq == 2) ? -190 +  i * gx : 350 - i * gx;
                            }else{
                                card.x = 350 - i * gx;
                            }
                            card.y = -20+j * gy;
                        }else{
                            card.x = (seq == 2) ? -210 + i * gx : 350 - i * gx;
                            if (HBGZPRoomModel.renshu == 2){
                                card.x = 350 - i * gx;
                            }
                            card.y = 20 + j * gy;
                        }
                        zorder--;
                    }
                }
            }
        }
    }

});
