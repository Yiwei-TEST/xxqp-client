/**
 * Created by zhoufan on 2016/11/7.
 */
var YZLCRoom = BaseLayer.extend({ //BaseLayer BaseRoom
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
        this.lastLetOutMJ = [];
        this.lastLetOutSeat = 0;
        this._dt = 0;
        this._loacationDt = 0;
        this._countDown = PHZRoomModel.getNewTuoguanTime() || this.COUNT_DOWN;
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

        this.localShuiArr = {};
    },

    isForceRemove:function(){
        return true;
    },

    onRemove:function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.phz_cards_plist);
        cc.spriteFrameCache.addSpriteFrames(res.phz_cards_plist);
        PHZRoomModel.mineRoot = null;
        this.isShowReadyBtn = true;
        //this.fingerArmature.getAnimation().stop();
        this.unscheduleUpdate();
        this._players=null;
    },

    selfRender:function(){
        PHZSetModel.init();

        //cc.log("phzRoom begin");
        //BaseRoom.prototype.selfRender.call(this);
        var bgMusic = 2;
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,bgMusic);

        WXHeadIconManager.loadedIconListInRoom = [];
        this.timeDirect = 1;
        this.isShowAlert = false;
        this.isShowReadyBtn = true;
        // cc.log("PHZRoomModel.renshu..." , PHZRoomModel.renshu);
        for(var i=1;i<=6;i++){
            if(i<=PHZRoomModel.renshu){
                var p = this.getWidget("player"+i);
                var icon = this.getWidget("icon"+i);
                //UITools.addClickEvent(icon,this,this.onPlayerInfo);
                /*if (PHZRoomModel.is3Ren()) {
                 var icon = this.getWidget("icon"+i);
                 UITools.addClickEvent(icon,this,this.onPlayerInfo);
                 }*/
                UITools.addClickEvent(p,this,this.onPlayerInfo);
            }
        }
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

        if(PHZRoomModel.intParams[7] < 4){
            this.Label_info.setAnchorPoint(0,1);
            this.Label_info.setPosition(this.Label_info.x - 185,this.Label_info.y + 15);
            this.Label_info.ignoreContentAdaptWithSize(false);
            this.Label_info.setSize(360, 200);
        }else{
            this.Label_info.setAnchorPoint(0,1);
            this.Label_info.setPosition(this.Label_info.x,this.Label_info.y + 15);
            this.Label_info.ignoreContentAdaptWithSize(false);
            this.Label_info.setSize(360, 200);
        }

        if (PHZRoomModel.is4Ren()) {
            //this.Label_remain = new cc.LabelBMFont("","res/font/font_res_phz2.fnt");
            //this.Label_remain.x = this.fapai.width/2;
            //this.Label_remain.y = this.fapai.height/2+7;
            //this.fapai.addChild(this.Label_remain);
            this.Button_7 = this.getWidget("Button_7");//????????????
            this.Button_6 = this.getWidget("Button_6");//????????????
            UITools.addClickEvent(this.Button_7,this,this.onLeave);
            UITools.addClickEvent(this.Button_6,this,this.onBreak);
            //this.battery = this.getWidget("battery");//??????
            this.Image_set = this.getWidget("Image_set");
            this.Button_sset = this.getWidget("Button_sset");//????????????
            UITools.addClickEvent(this.Button_sset,this,this.onShowSet);
        } else {
            //this.battery = new cc.Sprite("res/ui/phz/pp/power.png");//this.getWidget("battery");//??????
            //this.battery.anchorX = 0;
            //this.battery.x = 5;
            //this.battery.y = 16;
            //this.getWidget("batteryBg").addChild(this.battery);
        }

        this.getWidget("label_version").setString(SyVersion.v);
        this.Label_batteryPer = this.getWidget("Label_batteryPer");
        this.roomName_label = new cc.LabelTTF("","Arial",36,cc.size(500, 30));
        this.Panel_20.addChild(this.roomName_label);
        if (PHZRoomModel.roomName){
            this.roomName_label.setString(PHZRoomModel.roomName);
            this.roomName_label.setColor(cc.color(255,255,255));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = 960;
            this.roomName_label.y = cc.winSize.height/2 + 210;
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

        this.Button_52.x = this.Button_53.x = (cc.winSize.width - SyConfig.DESIGN_WIDTH) /2 + 1834;
        //this.Button_52.y = 180;
        //this.Button_53.y = 100;

        this.Button_ready = this.getWidget("Button_ready");//??????
        this.Button_invite = this.getWidget("Button_invite");//????????????
        this.Button_ready.setLocalZOrder(4);
        this.Button_invite.setLocalZOrder(4);
        if(!(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName)){
            this.Button_invite.setScale(1.2);
        }
        //this.Button_sset = this.getWidget("Button_sset");//????????????
        this.yuyin = this.getWidget("yuyin");//????????????
        this.Image_hdx = this.getWidget("Image_hdx");//??????????????????
        this.Image_hdx.visible = false;
        this.netType = this.getWidget("netType");//????????????
        if((PHZRoomModel.renshu == 2 || PHZRoomModel.renshu == 3)){
            this.Button_qihu = this.getWidget("Button_qihu");
            this.Button_qihu.visible = false;
            UITools.addClickEvent(this.Button_qihu,this,this.sendQiHu);
        }



        // iphonex ?????????????????????????????????
        var disXForIphoneX  = 0;
        if (SdkUtil.isLiuHaiPin())
        {
            disXForIphoneX = 90;
        }
        if (PHZRoomModel.renshu != 4){
            this.getWidget("Panel_left").x = (SyConfig.DESIGN_WIDTH - cc.winSize.width)/2 +this.getWidget("Panel_left").x;
            this.getWidget("Panel_right").x = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 +this.getWidget("Panel_right").x;
            this.getWidget("mPanel1").y = 400;
        }
        if (PHZRoomModel.renshu == 2){
            this.getWidget("oPanel1").x =   (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 + SyConfig.DESIGN_WIDTH - disXForIphoneX;
            this.getWidget("oPanel2").x = this.getWidget("sPanel2").x = this.getWidget("mPanel2").x = (SyConfig.DESIGN_WIDTH -cc.winSize.width)/2 + disXForIphoneX;

        }else if (PHZRoomModel.renshu == 3){
            this.getWidget("oPanel1").x =  this.getWidget("oPanel2").x = this.getWidget("sPanel2").x
                = this.getWidget("mPanel2").x = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 + SyConfig.DESIGN_WIDTH - disXForIphoneX;
            this.getWidget("oPanel3").x = this.getWidget("sPanel3").x = this.getWidget("mPanel3").x = (SyConfig.DESIGN_WIDTH -cc.winSize.width)/2 + disXForIphoneX;
        }

        if (PHZRoomModel.renshu == 4){
            this.getWidget("player4").y -= 45;
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
        this.Button_p5f.temp = 5;

        this.Panel_chui = this.getWidget("Panel_chui");//
        this.Panel_chui.visible = false;
        this.Button_bc = this.getWidget("Button_bc");//
        this.Button_bc.temp = 0;
        this.Button_chui = this.getWidget("Button_chui");//
        this.Button_chui.temp = 1;
        UITools.addClickEvent(this.Button_bc,this,this.onChui);
        UITools.addClickEvent(this.Button_chui,this,this.onChui);

        this.Panel_datuo = this.getWidget("Panel_datuo");//
        this.Panel_datuo.visible = false;
        this.Button_bdt = this.getWidget("Button_bdt");//
        this.Button_bdt.temp = 2;
        this.Button_dt = this.getWidget("Button_dt");//
        this.Button_dt.temp = 1;
        UITools.addClickEvent(this.Button_bdt,this,this.onSelectDatuo);
        UITools.addClickEvent(this.Button_dt,this,this.onSelectDatuo);

        //this.Image_set = this.getWidget("Image_set");

        //UITools.addClickEvent(this.Button_sset,this,this.onShowSet);
        //UITools.addClickEvent(this.Panel_20,this,this.onCancelSelect,false);

        UITools.addClickEvent(this.Button_invite,this,this.onInvite);
        UITools.addClickEvent(this.Button_ready,this,this.onReady);
        //UITools.addClickEvent(this.Button_7,this,this.onLeave);

        //UITools.addClickEvent(this.Button_6,this,this.onBreak);
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
        // this.addCustomEvent(SyEvent.LDFPF_REPORT_DANIAO , this,this.ReportDaNiao);
        this.addCustomEvent(SyEvent.LDFPF_QIHU , this,this.OnQiHu);
        this.addCustomEvent(SyEvent.CZZP_PIAOFEN , this,this.CZZP_PiaoFen);
        this.addCustomEvent(SyEvent.CZZP_FINISH_PIAOFEN , this,this.CZZP_FinishPiaoFen);
        this.addCustomEvent(SyEvent.SYBP_CHUI , this,this.SYBP_StartChui);
        this.addCustomEvent(SyEvent.SYBP_FINISH_CHUI , this,this.SYBP_FinishChui);
        this.addCustomEvent(SyEvent.HYSHK_KHSZP , this,this.HYSHK_KehuShizhongpai);

        this.addCustomEvent(SyEvent.PIAO_FEN,this,this.onWHZPiaoFen);
        this.addCustomEvent(SyEvent.SELECT_PIAO_FEN,this,this.onWHZSelectPiaoFen);


        this.addCustomEvent(SyEvent.UPDATE_SET_KSCP , this,this.updateSetKscp);
        //this.addCustomEvent(SyEvent.UPDATE_SET_KQTP , this,this.updateSetKqtp);
        this.addCustomEvent(SyEvent.UPDATE_SET_YYXZ , this,this.updateSetYyxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_CPSD , this,this.updateSetCpsd);
        this.addCustomEvent(SyEvent.UPDATE_SET_ZPDX , this,this.updateSetZpdx);
        this.addCustomEvent(SyEvent.UPDATE_SET_XXXZ , this,this.updateSetXxxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_ZPXZ , this,this.updateSetZpxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_PMXZ , this,this.updateSetPmxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_ISCP , this,this.updateSetIscp);

        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBgColor);

        this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);

        this.addCustomEvent(SyEvent.PHZ_CLEAN_SPANEL , this,this.cleanSPanel);

        this.addCustomEvent(SyEvent.SHOW_TING_CARDS , this,this.onShowAllHuCards);
        this.addCustomEvent(SyEvent.DAPAI_TING,this,this.outCardTing);
        this.addCustomEvent(SyEvent.SHOW_TING,this,this.showTing);

        this.addCustomEvent("UPDATA_SHOUPAI",this,this.updateHands);

        /**
         * ???????????????????????????
         */
        this.addCustomEvent(SyEvent.XXGHZ_DATUO,this,this.ShowDatuo);
        this.addCustomEvent(SyEvent.XXGHZ_DATUO_STATE,this,this.UpdateDatuoState);

        this.addCustomEvent(SyEvent.UPDATA_CLUB_TABLE_COIN,this,this.onUpdateClubTableCoin);

        this.addCustomEvent(SyEvent.BISAI_XIPAI, this, this.NeedXipai);
        this.addCustomEvent("XIPAI_CLEAR_NODE", this, this.clearXiPai);
        this.addCustomEvent("YZLC_UPDATE_CHUPAI",this,this.updateChuPaiBtn);

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
        this.countDownLabel = new cc.LabelBMFont("15","res/res_phz/font_phz_countdown.fnt");
        this.countDownLabel.x = this.Image_time.width/2;
        this.countDownLabel.y = this.Image_time.height/2+8;
        this.Image_time.addChild(this.countDownLabel);

        this.Panel_tingPai = this.getWidget("Panel_tingPai");//?????????

        this.Panel_shouzhi = this.getWidget("Panel_shouzhi");
        this.fingerAni();//??????????????????
        this.Panel_shouzhi.visible = false;
        PHZRoomModel.mineRoot = this;

        // var Label_11 = 

        this.calcTime();
        this.calcWifi();
        this.scheduleUpdate();
        //cc.log("phzRoom selfRenderOver");

        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//??????????????????
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            this.bg_CancelTuoguan.setLocalZOrder(100);
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

        this.btn_Gps = this.getWidget("btn_Gps");
        //if(SyConfig.HAS_GPS && PHZRoomModel.renshu > 2){
        //     this.btn_Gps.visible = true;
        //}else{
        //     this.btn_Gps.visible = false;
        //}
        //if(GPSModel.getGpsData(PlayerModel.userId) == null){
        //    this.btn_Gps.setBright(false);
        //    this.btn_Gps.setTouchEnabled(false);
        //}else{
        //    this.btn_Gps.setBright(true);
        //    this.btn_Gps.setTouchEnabled(true);
        //}
        //if (SdkUtil.isReview()){
        //    this.btn_Gps.visible = false;
        //}
        UITools.addClickEvent(this.btn_Gps ,this,this.onGpsPop);

        this.jiesanBtn = this.getWidget("btn_jiesan");//????????????
        UITools.addClickEvent(this.jiesanBtn ,this,this.onJieSan);
        this.tuichuBtn = this.getWidget("btn_tuichu");//????????????
        UITools.addClickEvent(this.tuichuBtn ,this,this.onTuiChu);

        this.jiesanBtn.visible = true;
        this.tuichuBtn.visible = false;
        this.tuichuBtn.setLocalZOrder(4);

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
        //IphoneX????????????
        //var vSize = cc.view.getVisibleSize();
        //if (PlayerModel.userId==120153) {
        //    setInterval(function() {
        //        FloatLabelUtil.comText("ipx::"+SdkUtil.isIphoneX()+" vSize::"+vSize.width+"_"+vSize.height);
        //    },2000);
        //}
        if (SdkUtil.isIphoneX()){
            this.getWidget("minePanel").y += 30;
        }
        this.cleanSPanel();

        this.adjustInviteBtn();

        if(BaseRoomModel.isBanVoiceAndProps()){
            this.recordBtn.setVisible(false);
        }
        var img = "res/res_phz/yzlc/btn_lookChuo.png";
        this.showChuoBtn = new ccui.Button(img);
        UITools.addClickEvent(this.showChuoBtn,this,this.onShowChuo);
        this.showChuoBtn.x = 75;
        this.showChuoBtn.y = 600;
        this.addChild(this.showChuoBtn,1);
        this.showChuoBtn.visible = false;

        UITools.addClickEvent(this.Panel_20,this,this.hideCard);
    },

    updateHands:function(event){
        var data = event.getUserData();
        var cards = data.params ? data.params : null;
        var wanfa = (BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.wanfa) ? BaseRoomModel.curRoomData.wanfa : 0;
        // cc.log("updateHands===",cards,wanfa,ClubRecallDetailModel.isPDKWanfa(wanfa));
        if (cards && cards.length > 0 && wanfa == GameTypeEunmZP.YZLC){
            // cc.log("cards====",JSON.stringify(cards));
            var allcardIds = [];
            for(var index = 0 ; index < cards.length ; index ++){
                allcardIds.push(parseInt(cards[index]));
            }
            YZLCMineLayout.initData(allcardIds,this.getWidget("minePanel"));
        }
    },

    onShowChuo:function(){
        var cards = {};
        var players = PHZRoomModel.players;
        for(var i = 0;i < PHZRoomModel.renshu;++i){
            var direct = PHZRoomModel.getPlayerSeq(players[i].userId,players[i].seat);
            var temp = this.getLayout(direct).getPlace2Data() || [];
            cards[i] = temp;
        }
        var mc = new YZLCShowChuoPop(players,cards);
        PopupManager.addPopup(mc);
    },

    showChuPaiBtn:function(isBool){
         if(!this.yzlcChuPaiBtn){
             var normal = "res/res_phz/yzlc/btn_2.png";
             var unNormal = "res/res_phz/yzlc/btn_5.png";
             var btn = new ccui.Button(normal,unNormal,unNormal);
             btn.setPosition(1750,650);
             //btn.scale = 0.9;
             UITools.addClickEvent(btn,this,this.onChuPaiClick);
             this.yzlcChuPaiBtn = btn;
             this.addChild(btn,1);
         }
        if(!this.tishiBtn){
            var normal = "res/res_phz/yzlc/btn_3.png";
            var btn = new ccui.Button(normal);
            btn.setPosition(1750,500);
            UITools.addClickEvent(btn,this,this.onTiShiClick);
            this.tishiBtn = btn;
            this.addChild(btn,1);
        }
        this.tishiBtn.visible = !!isBool && (this.lastLetOutSeat !== PHZRoomModel.mySeat && this.lastLetOutSeat !== 0);
        this.yzlcChuPaiBtn.visible = !!isBool;
        //YZLCMineLayout.initSelectList();/** ???????????????????????? **/
        this.tishiArray = [];
        this.tishiIndex = -1;
        /***
         * ?????????????????????????????????????????????????????????????????????
         */
        if(this.lastLetOutMJ && this.lastLetOutSeat !== PHZRoomModel.mySeat && !!isBool){
            var lastData = PHZAI.getVoArray(this.lastLetOutMJ);
            var resultData = YZLCMineLayout.getCurVoArray();
            this.tishiArray = PHZAI.findAllCard(lastData,resultData);
        }
    },

    updateChuPaiBtn:function(event){
        if(this.yzlcChuPaiBtn) {
            var list = YZLCMineLayout.getSelectList();
            //cc.log(" ???????????????????????? ",list);
            //cc.log(" ???????????? ",this.lastLetOutMJ);
            var result = PHZAI.compareCardType(list,this.lastLetOutMJ,this.lastLetOutSeat === PHZRoomModel.mySeat);
            //cc.log(" ????????????????????? result = ",result);
            this.yzlcChuPaiBtn.enabled = result;
        }
    },

    onTiShiClick:function(){
        if(this.tishiArray.length > 0) {
            ++this.tishiIndex;
            this.tishiIndex %= this.tishiArray.length;
            if(this.tishiArray[this.tishiIndex] && this.tishiArray[this.tishiIndex].length > 0){
                YZLCMineLayout.setSelectList(this.tishiArray[this.tishiIndex]);
                this.updateChuPaiBtn();
            }
        }else{
            YZLCMineLayout.initSelectList();
        }
    },

    hideCard:function(){
        this.tishiIndex = -1;
        YZLCMineLayout.initSelectList();
    },

    onChuPaiClick:function(){
         var ids = YZLCMineLayout.getSelectList();
         if(ids && ids.length > 0){
             PHZRoomModel.sendPlayCardMsg(0,ids);
             YZLCMineLayout.initSelectList();
         }
    },

    //???????????????????????????
    onUpdateClubTableCoin:function(event){
        var message = event.getUserData();
        var data = JSON.parse(message.strParams[0]);
        for(var i = 0; i<data.length; i++){
            var userId = data[i].userId;
            var p = PHZRoomModel.getPlayerVo(userId);
            if(this._players[p.seat]){
                this._players[p.seat].updateClubTableCoin(data[i].coin);
            }
        }
    },

    onSelectDatuo:function(obj){
        var temp = obj.temp;
        sySocket.sendComReqMsg(2100,[temp]);
    },

    ShowDatuo:function(event){
        this.tuichuBtn.visible = false;
        this.Panel_datuo.visible = true;
    },

    UpdateDatuoState:function(event){
        var message = event.getUserData();
        var params = message.params;
        //params[0]=??????id
        //params[1]=??????????????????
        var userId = params[0];
        var p = PHZRoomModel.getPlayerVo(userId);
        if (p.seat == PHZRoomModel.mySeat){
            this.Panel_datuo.visible = false;
        }
        this._players[p.seat].showDaTuoImg(params[1]);
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
        var pop = new PyqInviteListPop();
        this.addChild(pop);
    },

    onChui:function(obj){
        var temp = obj.temp;
        sySocket.sendComReqMsg(2025,[temp]);
    },
    HYSHK_KehuShizhongpai:function(message){
        // cc.log("message")
        var params = message.getUserData().params;
        var lastId = params[1];
        var lastVo = PHZAI.getPHZDef(lastId);
        var lastDirect = PHZRoomModel.getPlayerSeq(0, params[0]);
        // if (params[0] != PHZRoomModel.nextSeat){ 
        this.showShizhongpai(this.getWidget("cp"+lastDirect),lastVo,lastId,PHZRoomModel.renshu,lastDirect)
        // }
        this.kehushizhong = true;
    },
    showShizhongpai:function(root,phzVo,actType,renshu,seq){
        root.visible = true;
        var paiType = PHZSetModel.zpxz==3?3:1;
        var endScale = 1.3;
        var kuangText = "#big_face_1.png";
        if (paiType == 2){
            kuangText = "#big_face_2.png";
        }
        if(phzVo.c == 0){
            kuangText = "#cards_back.png";
        }
        var per = (actType==1) ? 0.24 : 0.19;
        var kuang =  new cc.Sprite(kuangText);
        var endPosX = 0;
        var endPosY = 0;
        if(renshu==4){
            endPosX = 200;
            endPosY = 81;
        }else{
            endPosX = 200;
            endPosY = 121;
        }
        kuang.x = 33;
        kuang.y = -120;
        PHZRoomModel.isSelfOutCard = false;
        var endPos = cc.p(endPosX , endPosY);
        kuang.scale=0.1;
        root.addChild(kuang);
        var png = "cards_back.png";
        if(phzVo.c>0){
            var t = phzVo.t==1 ? "s" : "b";
            var paiType = PHZSetModel.zpxz==3?3:1;
            png = "big_cards" + paiType + "_" + phzVo.n + t + ".png";
            // png = this.getPaiPngurl(phzVo);
            var bg1 = cc.Sprite("#"+png);
            bg1.x = kuang.width/2;
            bg1.y = kuang.height*per;
            bg1.setFlippedY(-180);
            bg1.setFlippedX(-180);
            bg1.scale = 0.8;
            kuang.addChild(bg1);
            var bg = cc.Sprite("#"+png);
            bg.x = kuang.width/2;
            bg.y = kuang.height*(1-per);
            bg.scale = 0.8;
            kuang.addChild(bg);
        }

        var time = 0.1;
        //var time = 0.08 + (PHZSetModel.cpsd-1)*0.03;
        kuang.runAction(cc.sequence(cc.spawn(cc.scaleTo(time,endScale,endScale),cc.MoveTo(time,endPos))));

        kuang.setName("shizhongpai")
    },
    SYBP_StartChui:function(message){
        var params = message.getUserData().params;
        // cc.log("StartChui::"+JSON.stringify(params));
        //??????3???????????????
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            var mjp = this._players[i];
            if(mjp){
                mjp.startGame();
                mjp.showDaNiaoType();
            }
        }
        this.showChuiPanel();
    },
    SYBP_FinishChui:function(message){
        var message = message.getUserData();
        var params = message.params;
        cc.log("params",params);
        var userId = params[0];
        var p = PHZRoomModel.getPlayerVo(userId)
        this._players[p.seat].hideDaNiaoType();
        if (p.seat == PHZRoomModel.mySeat){
            this.Panel_chui.visible = false;
        }
        this._players[p.seat].showChuiImg(params[1])
    },
    showChuiPanel:function(){
        this.tuichuBtn.visible = false;
        this.Panel_chui.visible = true;
    },
    CZZP_PiaoFen:function(message){
        var params = message.getUserData().params;
        cc.log("StartPiaoFen::"+JSON.stringify(params));
        var self = this;
        setTimeout(function(){//??????????????????????????????createTable?????????????????????
            for(var i=1;i<=PHZRoomModel.renshu;i++){
                var mjp = self._players[i];
                if(mjp){
                    mjp.startGame();
                    mjp.showDaNiaoType();
                }
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
                self.showPiaoFenPanel(PHZRoomModel.intParams[10]);
            }else {
                self.showPiaoFenPanel(params[0]);
            }
        },100);
    },
    CZZP_FinishPiaoFen:function(event){
        if (this.tuichuBtn.visible){
            for(var i=1;i<=PHZRoomModel.renshu;i++){
                var mjp = this._players[i];
                if(mjp)
                    mjp.startGame();
            }
            this.tuichuBtn.visible = false;
        }

        var message = event.getUserData();
        var params = message.params;
        cc.log("params",params);
        if(this.yzlcChuPaiBtn){
            this.yzlcChuPaiBtn.opacity = 0;
        }

        if(this.tishiBtn){
            this.tishiBtn.opacity = 0;
        }
        var userId = params[0];
        var p = PHZRoomModel.getPlayerVo(userId)
        this._players[p.seat].hideDaNiaoType();
        if (p.seat == PHZRoomModel.mySeat){
            this.Panel_piaofen.visible = false;
        }
        this._players[p.seat].showPiaoFenImg(params[1])
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
        var p = PHZRoomModel.getPlayerVo(userId)
        this._players[p.seat].showQiHuImg();
        // cc.log("p.seat == PHZRoomModel.mySeat = ",p.seat == PHZRoomModel.mySeat);
        if (p.seat == PHZRoomModel.mySeat){
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
        sySocket.sendComReqMsg(131);
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
            if(seat == PHZRoomModel.mySeat && this.bg_CancelTuoguan){
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
        //return;
        cc.log("checkTingList===============>")
        if (PHZRoomModel.nextSeat == PHZRoomModel.mySeat || isTrue){
            var voArray = ArrayUtil.clone(this.getcheckHuIdArr());
            var sourceArray = ArrayUtil.clone(YZLCMineLayout.getCurVoArray());

            var arr = [];
            //?????????????????????
            var needCheckArray = [];
            for(var i=0;i<sourceArray.length;i++){
                if (sourceArray[i]) {
                    arr.push(sourceArray[i].v);
                }
            }
            //???????????????????????????
            var newArr = ArrayUtil.uniqueArray(arr);
            for(var i=0;i < newArr.length;i++) {
                for (var j = 0; j < sourceArray.length; j++) {
                    if (newArr[i] == sourceArray[j].v) {
                        needCheckArray.push(sourceArray[j]);
                        break;
                    }
                }
            }
            this.tingList = [];
            //??????????????????????????????????????????
            for (var i = 0; i < needCheckArray.length; i++) {
                for (var j = 0; j < sourceArray.length; j++){
                    if (needCheckArray[i].c == sourceArray[j].c) {
                        var handArray = ArrayUtil.clone(sourceArray);
                        handArray.splice(j, 1);
                        var tingCards = sourceArray[j];
                        this.checkHu(handArray,voArray,tingCards)
                    }
                }
            }
            //??????????????????
            if (YZLCMineLayout){
                var arr = YZLCMineLayout.cards;
                this.hideHandsTingImg();
                for(var j=0;j<this.tingList.length;j++) {
                    if (arr && arr.length > 0) {
                        for (var i = 0; i < arr.length; i++) {
                            var curCardVo = arr[i].getData();
                            if (this.tingList[j].v == curCardVo.v){
                                arr[i]._cardVo.isTing = true;
                                arr[i].showTingImg(true);
                            }
                        }
                    }
                }
            }
        }
    },


    hideHandsTingImg:function() {
        // cc.log("hideHandsTingImg===============>")
        var arr = YZLCMineLayout.cards;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i]._cardVo){
                arr[i]._cardVo.isTing = false;
            }
            arr[i].showTingImg(false);
        }
    },

    //??????????????????
    dealCardData:function(event) {
        var data = event.getUserData();
        var sourceArray = ArrayUtil.clone(YZLCMineLayout.getCurVoArray());
        for(var j=0;j<sourceArray.length;j++){
            if (data.c == sourceArray[j].c){
                sourceArray.splice(j, 1);
                break;
            }
        }
        //cc.log("sourceArray============"+JSON.stringify(sourceArray));
        this.checkHu(sourceArray);
    },

    //??????????????????????????????
    getcheckHuIdArr:function() {
        var checkIdArr = [];
        var allOutArr = [];
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            //????????????????????????
            if (this.layouts[i]) {
                var arr = this.layouts[i].getPlace2CardData();
                if (arr && arr.length > 0) {
                    for (var j = 0; j < arr.length; j++) {
                        allOutArr.push(arr[j])
                    }
                }
                var arr1 = this.layouts[i].getPlace3Data();
                if (arr1 && arr1.length > 0){
                    allOutArr.push(arr1)
                }
            }

        }
        //cc.log("allOutArr==="+JSON.stringify(allOutArr));
        //?????????????????????
        if (YZLCMineLayout){
            var arr = YZLCMineLayout.getHandCardData();
            if (arr && arr.length > 0){
                for(var i=0;i<arr.length;i++){
                    allOutArr.push(arr[i])
                }
            }
        }
        var voArray = [];
        for(var i=1;i<=80;i++){
            voArray.push(PHZAI.getPHZDef(i));
        }

        for(var i=0;i<voArray.length;i++){
            var isPush = true;
            for(var j=0;j<allOutArr.length;j++) {
                for(var k=0;k<allOutArr[j].length;k++) {
                    if (voArray[i].c == allOutArr[j][k].c){
                        isPush = false;
                    }
                }
            }
            if (isPush){
                checkIdArr.push(voArray[i]);
            }
        }

        checkIdArr.sort(function (card1 , card2){
            return  card1.v > card2.v;
        });

        var isLastCard = null;
        var finalArr = [];
        for(var i=0;i< checkIdArr.length;i++){
            if (!isLastCard || isLastCard.v != checkIdArr[i].v){
                isLastCard = checkIdArr[i];
                finalArr.push(checkIdArr[i]);
            }
        }
        //
        return finalArr
    },

    /** ???????????????????????????????????????????????????
     * return ??????????????????????????????????????????
     */
    getPaoTiCards:function(cards) {
        var cardArr = null;
        //????????????????????????
        if (this.layouts && this.layouts[1]) {
            var arr = this.layouts[1].getPlace2Data();
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    var innerObject = arr[i];
                    if( innerObject.action==PHZAction.WEI || innerObject.action==PHZAction.PENG){
                        if (cards.v == innerObject.cards[0].v) {
                            this.isSelfMo = false;
                            //?????????????????????wei
                            if (this.lastLetOutSeat == PHZRoomModel.mySeat && innerObject.action==PHZAction.WEI){
                                this.isSelfMo = true;
                            }
                            //?????????????????????????????????
                            var huxi = 0;
                            if (innerObject.action==PHZAction.PENG){
                                if (cards.v > 100){
                                    huxi = 3;
                                }else{
                                    huxi = 1;
                                }
                            }else if(innerObject.action==PHZAction.WEI){
                                if (cards.v > 100){
                                    huxi = 6;
                                }else{
                                    huxi = 3;
                                }
                            }
                            this.outCardHuxi = PHZRoomModel.myOutHuxi - huxi;
                            cardArr = [];
                            for (var j = 0; j < innerObject.cards.length; j++) {
                                cardArr.push(innerObject.cards[j]);
                            }
                            cardArr.push(cards);
                            return cardArr;
                        }
                    }
                }
            }
        }
        return cardArr
    },

    /**
     * ??????1??????????????????
     * ??????2??????
     * ??????3???????????????
     * **/
    getHuList:function(_voArray,_handCards,_isPaoHu,_tingCards) {
        var repeatCheckArr = []; //?????????????????????????????????(???????????????????????????????????????)
        var outCardHuxi = PHZRoomModel.myOutHuxi;
        //cc.log("outCardHuxi..   ",outCardHuxi)
        var needDui = false;
        var isPaoHu = _isPaoHu;
        //????????????????????????????????????
        if (this.layouts[1]){
            needDui = this.layouts[1].isPaoTi();
        }

        for(var i=0;i<_voArray.length;i++){
            this.isSelfMo = true;
            var isNeedDui = needDui;
            var tools = new PaohuziTool();
            var sourceArray = ArrayUtil.clone(_handCards);
            //???????????????????????? ???????????????????????? ????????? ???
            var cards = _voArray[i]//{t:2,n:7,i:17,c:47,v:107}//_voArray[i];
            this.outCardHuxi = outCardHuxi;
            var ptCards = this.getPaoTiCards(cards);
            //cc.log("this.outCardHuxi..   ",this.outCardHuxi)
            var isRepeatCheck = false;
            if (ptCards && isPaoHu){
                for(var j=0;j<ptCards.length;j++){
                    sourceArray.push(ptCards[j]);
                }
            }else{
                this.outCardHuxi = PHZRoomModel.myOutHuxi;
                sourceArray.push(cards);
            }
            outCardHuxi = this.outCardHuxi;
            //cc.log("outCardHuxi...   ",outCardHuxi)
            // cc.log("_voArray[i]========="+JSON.stringify(_voArray[i]));
            // cc.log("_handCards========="+JSON.stringify(_handCards));
            // cc.log("sourceArray========="+JSON.stringify(sourceArray));
            var handCardBean = tools.getPaohuziHandCardBean(sourceArray);
            var arr = handCardBean.getIndexArr();
            //?????????4??????
            var index3 = arr.getPaohzCardIndex(3);
            if (index3 != null) {
                var checkLength = 0;
                if (!isPaoHu){
                    checkLength = 1;  //?????????????????????????????????????????????????????????
                }
                var list = index3.getValList();
                if (list.length > checkLength){
                    isNeedDui = true;
                }
                if (isPaoHu){
                    for(var j=0;j<list.length;j++){
                        if (cards.v == parseInt(list[j])){
                            isRepeatCheck = true;
                        }
                    }
                }
            }
            var result = tools.isHu(handCardBean, cards, this.isSelfMo, outCardHuxi, isNeedDui, isPaoHu);
            // cc.log("result========="+JSON.stringify(result));
            var isTingPaiNoHuxi = false;
            var qihuHuxi = 10;

            var allhuxi = result.huxi + outCardHuxi;
            // cc.log("allhuxi =",allhuxi,"qihuHuxi =",qihuHuxi);
            var bool_tingpai = isTingPaiNoHuxi? result.isHu1 && (allhuxi >= qihuHuxi || allhuxi == 0) : result.isHu1 && (allhuxi >= qihuHuxi);
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
                // cc.log("PHZRoomModel.isChiBianDaBian =",PHZRoomModel.isChiBianDaBian);
                if (PHZRoomModel.isChiBianDaBian){
                    var redCardsNum = this.getRedCardsNum();
                    if (cards.n == 2 || cards.n == 7 || cards.n == 10){
                        redCardsNum = redCardsNum + 1;
                    }
                    if (bool_tingpai){
                        var isYdh = PHZRoomModel.intParams[12] == 0?redCardsNum == 1:false;
                        var isWh = PHZRoomModel.intParams[11] == 0?allhuxi == 0:false;
                        if (redCardsNum >= 12 || redCardsNum == 0 || isYdh || isWh){
                            bool_tingpai = true;
                        }else {
                            bool_tingpai = false;
                        }
                    }
                }
            }
            // cc.log("bool_tingpai========="+JSON.stringify(bool_tingpai));
            // cc.log("cards.v========="+JSON.stringify(cards.v));
            if (bool_tingpai){
                var isPush = true;
                // cc.log("this.huList========="+JSON.stringify(this.huList));
                for(var j=0;j<this.huList.length;j++){
                    if (this.huList[j].v == cards.v){
                        isPush = false;
                    }
                }
                // cc.log("isPush========="+JSON.stringify(isPush));
                if (isPush){
                    this.huList.push(cards);
                    if (_tingCards){
                        this.tingList.push(_tingCards);
                        break;
                    }
                }
                // cc.log("this.huList========="+JSON.stringify(this.huList));
            }else{
                if (isPaoHu && ((ptCards && ptCards.length > 0 ) || isRepeatCheck)){
                    repeatCheckArr.push(cards);
                }
            }
        }
        if (repeatCheckArr && repeatCheckArr.length > 0){
            //cc.log("repeatCheckArr-----------"+repeatCheckArr.length)
            this.getHuList(repeatCheckArr,_handCards,false,_tingCards);
        }

    },
    //????????????????????????????????????????????????
    getRedCardsNum:function(){
        var redCardsNum = 0;
        //?????????
        var arr = this.layouts[1].getPlace2Data();
        // cc.log("arr =",JSON.stringify(arr));
        if (arr && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                var innerObject = arr[i];
                for (var j = 0; j < innerObject.cards.length; j++) {
                    if (innerObject.cards[j].n == 2 || innerObject.cards[j].n == 7 ||innerObject.cards[j].n == 10){
                        redCardsNum++;
                    }
                }
            }
        }

        var handCards = YZLCMineLayout.getCurVoArray();
        if (handCards&& handCards.length>0){
            for (var i = 0; i < handCards.length; i++) {

                if (handCards[i].n == 2 || handCards[i].n == 7 ||handCards[i].n == 10){
                    redCardsNum++;
                }

            }
        }
        // cc.log("handCards =",JSON.stringify(handCards));

        return redCardsNum;

    },
    //????????????
    checkHu:function(handCards,voArray,tingCards) {
        //if (PHZSetModel.kqtp && PHZRoomModel.wanfa != GameTypeEunmZP.WHZ && PHZRoomModel.wanfa != GameTypeEunmZP.LDS
        //    && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP){
        //    this.huList = [];
        //    if (voArray){
        //        this.getHuList(voArray,handCards,true,tingCards);
        //    }else{
        //        var voArray = ArrayUtil.clone(this.getcheckHuIdArr());
        //        this.getHuList(voArray,handCards,true);
        //        this.showTingPai(this.huList);
        //    }
        //}
    },

    //???????????????
    cleanTingPanel:function(){
        if(this.Panel_tingPai)
            this.Panel_tingPai.removeAllChildren();
    },

    onShowAllHuCards:function(event){
        //cc.log("event =",JSON.stringify(event));
        var tingData = event.getUserData();
        var huList = tingData.huCards || [];
        huList.sort(function(a,b){
            var t1 = a>40?1:0;var t2 = b>40?1:0;
            var n1 = a>80?11:a%10;var n2 = b>80?11:b%10;
            if(n1 == 0)n1 = 10;if(n2 == 0)n2 = 10;
            return (t1*100+n1) - (t2*100+n2);
        });
        this.showTingPai(huList);
    },
    showTing:function(event){
        var tingData = event.getUserData();
        var huList = tingData || [];
        this.showTingPai(huList);
    },
    //??????????????????????????????
    outCardTing:function(event){
        //if(PlayPHZMessageSeq.sequenceArray.length > 0){//?????????????????????????????????????????????????????????????????????
        //    cc.log("=========outCardTing======delay=====");
        //    this.delayOutCardTingData = event;
        //    return;
        //}
        //
        //var data = event.getUserData();
        //var info = data.info;
        //// cc.log("info",JSON.stringify(info));
        //YZLCMineLayout.outCardTingPai(info);
        //this.outTingInfo = info;
        //this.CanClealTingImg = false;
    },

    //??????????????????
    showTingPai:function(huList){
        //if (huList && huList.length > 0 ){
        //    this.cleanTingPanel();
        //    this.Panel_tingPai.visible = true;
        //    var tingBgImgHeight = 60;
        //    var diffHeight = 50;
        //    tingBgImgHeight = Math.floor((huList.length-1)/3)*diffHeight + tingBgImgHeight;
        //
        //    //????????????
        //    var tingBg = cc.spriteFrameCache.getSpriteFrame("cards_listencard_di_tingpai.png");
        //    var tingBgImg = new cc.Scale9Sprite(tingBg,null,cc.rect(5,5,165,45));
        //    tingBgImg.anchorX= 0.5;
        //    tingBgImg.anchorY= 0.5;
        //    tingBgImg.x = 50;
        //    tingBgImg.y = 50;
        //    tingBgImg.width = 200;
        //    tingBgImg.height = tingBgImgHeight;
        //    this.Panel_tingPai.addChild(tingBgImg);
        //
        //    //???????????????
        //    var tingImg = new cc.Sprite("#cards_listencard_zi_tingpai.png");
        //    //tingImg.x = 50;
        //    tingImg.anchorY= 0;
        //    tingImg.x = tingBgImg.width*0.5;
        //    tingImg.y = tingBgImgHeight + 5;
        //    tingBgImg.addChild(tingImg);
        //
        //    //????????????
        //    for(var j=0;j<huList.length;j++){
        //        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ ) {
        //            var id = huList[j] % 10 == 0 ? 10 : huList[j] % 10;
        //            var size = huList[j] > 40 ? "b" : "s";
        //        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
        //            var id = huList[j] % 10 == 0 ? 10 : huList[j] % 10;
        //            var size = huList[j] > 40 ? "b" : "s";
        //
        //            if(huList[j] > 80){
        //                id = huList[j];
        //            }
        //
        //        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
        //            var cardVo = PHZAI.getPHZByVal(huList[j]);
        //            var id = cardVo.n;
        //            var size = cardVo.v > 100 ? "b":"s";
        //        } else{
        //            var id = huList[j].n;
        //            var size = huList[j].v > 100 ? "b":"s";
        //        }
        //        var listencardPath = "#cards_listencard_"+id+size+".png";
        //        var x = Math.floor(j%3)*60 + 40;
        //        var y = -Math.floor(j/3)*48 + tingBgImgHeight -30;
        //        var paiImg = new cc.Sprite(listencardPath);
        //        paiImg.x = x;
        //        paiImg.y = y;
        //        tingBgImg.addChild(paiImg);
        //    }
        //}else{
        //    this.Panel_tingPai.visible = false;
        //}
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

    //????????????
    startGameAni:function(){
        var cardNum = 10;
        var tunX = 640;
        var tunY = 625;
        var scale = 1;
        if (PHZRoomModel.renshu == 4){
            tunX = 575;
            tunY = 440;
            scale = 0.7;
        }
        for (var i=0;i<cardNum;i++) {
            var tun = new cc.Sprite("res/res_phz/pp/card.png");
            tun.x = tunX;
            tun.y = tunY;
            tun.scale = scale;
            this.addChild(tun, 1, i);
            this.startGameCardAni(tun,i,1)
        }

        for (var i=0;i<cardNum;i++) {
            var tun = new cc.Sprite("res/res_phz/pp/card.png");
            tun.x = tunX;
            tun.y = tunY;
            tun.scale = scale;
            this.addChild(tun, 1, i);
            this.startGameCardAni(tun,i,-1)
        }

        AudioManager.play("res/res_phz/phzSound/fapai.mp3");

        //var soundNode =  new cc.Node();
        //this.addChild(soundNode);
        //var delayTime = 1;
        //var times = 10;
        //var action = cc.sequence(
        //    cc.callFunc(function(){
        //        AudioManager.play("res/audio/phz/fapai.mp3");
        //    }),
        //    cc.delayTime(delayTime)
        //)
        //action = action.repeat(times);
        //soundNode.runAction(action)
    },
    startGameCardAni:function(obj,i,idex){
        var delayTime = 0.05;
        var moveByTime = 0.1;
        var moveByDis = 580;
        var action = cc.sequence(cc.delayTime(delayTime*i),cc.moveBy(moveByTime , cc.p(moveByDis*idex,0)),
            cc.callFunc(function(){
                obj.removeFromParent();
            })
        )
        obj.runAction(action)
    },

    onCardsort:function(){
        if ( PHZRoomModel.sortCardWay == 0){
            PHZRoomModel.sortCardWay = 1;
        }else{
            PHZRoomModel.sortCardWay = 0;
        }
        if (YZLCMineLayout){
            YZLCMineLayout.onCardsort();
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

    /*
     getModel:function(){

     return PHZRoomModel;
     },

     getLabelTime:function(){
     this.getWidget("Label_11");
     },
     */
    onGpsPop:function(){
        if(PHZRoomModel.renshu > 2){
            PopupManager.addPopup(new GpsPop(PHZRoomModel , PHZRoomModel.renshu));
        }
    },

    onShowSet:function(){
        //this.Image_set.visible = !this.Image_set.visible;
        //if(this.Image_set.visible){
        //    this.Button_sset.loadTextures("res/ui/phz/phzRoom/btn_33.png", "res/ui/phz/phzRoom/btn_33.png");
        //}else{
        //    this.Button_sset.loadTextures("res/ui/phz/phzRoom/btn_32.png", "res/ui/phz/phzRoom/btn_32.png");
        //}
    },

    updateGpsBtn:function(){
        //if(this.btn_Gps){
        //    if(GPSModel.getGpsData(PlayerModel.userId) == null){
        //        this.btn_Gps.setBright(false);
        //        this.btn_Gps.setTouchEnabled(false);
        //    }else{
        //        this.btn_Gps.setBright(true);
        //        this.btn_Gps.setTouchEnabled(true);
        //    }
        //}
    },

    //?????? ???????????????????????????
    setRoldPlayerIcon:function(event) {

        var seat = event.getUserData();
        var players = PHZRoomModel.players;
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
        /*        var mc = new ChatPop("res/phzChat.json");
         PopupManager.addPopup(mc);*/
        var mc = new ChatPop();
        PopupManager.addPopup(mc);
    },

    /**
     * ????????????
     */
    onFastChat:function(event){
        var data = event.getUserData();
        var userId = data.userId;
        var p = PHZRoomModel.getPlayerVo(userId);
        this._players[p.seat].fastChat(data);
        cc.log("phz onFastChat" ,userId , p.seat );
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
            this.netType.loadTexture("res/ui/common/net_" + type + ".png");
        }
        if (PHZRoomModel.is4Ren()) {
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
        var mc = new PHZSetUpPop();
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
                //GPSSdkUtil.startLocation();
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
            AudioManager.play("res/audio/phz/timeup_alarm.mp3");
        }
    },

    onChangeStauts:function(event){
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        this._players[seat].onReady();
        if(seat == PHZRoomModel.mySeat){
            this.Button_ready.visible = false;
            this.tuichuBtn.x = 960;
            this.fapai.visible = this.Label_remain.visible = false;//true;
        }
    },

    onOver:function(event){
        this.localShuiArr = {};
        this.showChuPaiBtn(false);
        this.isShowReadyBtn = false;
        var data = event.getUserData();
        this.message = data;
        this.cleanTingPanel();
        //this.cleanChuPai();//????????????
        PHZRoomModel.isChiBianDaBian = false;
        //??????????????????????????????????????????????????????????????????
        if(PlayPHZMessageSeq.sequenceArray.length>0){
            PlayPHZMessageSeq.cacheClosingMsg(data);
            return;
        }

        for(var index = 0 ; index < PHZRoomModel.renshu ; index ++){
            if(this._players[index]){
                this._players[index].playerQuanAnimation(false);
            }
        }

        //this.refreshOptCardOnOver();

        this.btnPanel.visible = false;
        //this.cleanChuPai();
        this.Image_time.visible=false;
        //this.fingerArmature.visible=false;
        this.Panel_shouzhi.visible = false;

        //?????????????????????
        var self = this;
        var t = 800;//1300;
        var t1 = 300;//800;//?????????????????????????????????????????????
        PHZRoomModel.isStart = false;
        this.showSparePaiTimeOutHandle = setTimeout(function() {//????????????????????????????????????
            if (!PHZRoomModel.isStart){
                self.showSparePai(ClosingInfoModel);
            }
        },t1);

        this.showResultTimeOutHandle = setTimeout(function(){//?????????????????????
            self.isShowReadyBtn = true;
            for(var i=0;i<data.length;i++){
                self._players[data[i].seat].updatePoint(data[i].totalPoint);
                self._players[data[i].seat].hidePiaoFenImg();
                self._players[data[i].seat].hideQiHuImg();
            }
            var mc = new YZLCSmallResultPop(data);
            PopupManager.addPopup(mc);
            var obj = HongBaoModel.getOneMsg();
            if(obj){
                var mc = new HongBaoPop(obj.type,obj.data);
                PopupManager.addPopup(mc);
            }
        },t);
    },

    showDipai:function(valArr){//????????????????????????
        this.cleanChuPai();//????????????
        var self = this;
        var dipai = ClosingInfoModel.leftCards;
        ArrayUtil.merge(dipai,valArr);
        var localIndex = 0;
        this.schedule(function(){
            var vo = PHZAI.getPHZDef(valArr[localIndex]);
            var localX = (localIndex % 10 - 4.5) * 70;
            var localY =  - Math.floor(localIndex / 10) * 80;
            var kuang = YZLCRoomEffects.createGLZPCard(self.getWidget("cpZhuangLastCard"),vo,dipai.indexOf(valArr[localIndex]) === -1);
            if(localIndex < 5){
                kuang.y = localY;
                var seq = cc.moveTo(0.1,localX,localY);
                kuang.runAction(seq);
            }else{
                kuang.x = localX;
                kuang.y = localY;
            }
            if(PHZRoomModel.intParams[7] == 4){
                kuang.setPositionX(-50);
            }
            ++localIndex;
        },0.12, valArr.length - 1,0);
    },

    //????????????????????????????????????????????????????????????
    refreshOptCardOnOver:function(){
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
            for(var i = 2;i<=4;++i){
                var layout = this.layouts[i];
                layout && layout.refreshP2(layout.data2,true);
            }
        }
    },

    initGameBtn:function(){
        if (PHZRoomModel.getFangZhu(PHZRoomModel.getPlayerVo(PlayerModel.userId)) == 1 || PHZRoomModel.isStart || PHZRoomModel.nowBurCount > 1 ){
            if (PHZRoomModel.isStart || PHZRoomModel.nowBurCount > 1){
                this.tuichuBtn.visible = false;
                this.Button_ready.x = 960;
            }else{
                if (PHZRoomModel.isClubRoom(PHZRoomModel.tableType)){
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
            //this.jiesanBtn.setBright(false);
            //this.jiesanBtn.setTouchEnabled(false);
            this.tuichuBtn.visible = true;
            this.tuichuBtn.x = 720;
            this.Button_ready.x = 1200;
        }
    },

    initData:function(){
        this.roomName_label.setString(PHZRoomModel.roomName);
        this.Label_info.setString(PHZRoomModel.getWanFaDesc());
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

        this.Panel_piaofen.visible = false;

        this.guoChiVals = [];
        this.lastLetOutMsg = null;

        //this.startGameAni();//????????????
        this.hideAllBanker();
        this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        this._countDown = PHZRoomModel.getNewTuoguanTime();
        //this.updateCountDown(this._countDown);
        PlayPHZMessageSeq.clean();
        if (PHZRoomModel.is3Ren()  || PHZRoomModel.is2Ren()) {
            this.fapai.removeAllChildren();
        }
        this.lastMoPHZ = this.lastLetOutSeat = 0;
        this.lastLetOutMJ = [];
        this.Label_fh.setString("??????:"+PHZRoomModel.tableId);
        this.updateRoomInfo();
        this.initGameBtn();

        this._players = {};
        var players = PHZRoomModel.players;
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            //if(this.isShowReadyBtn){
            // this.getWidget("player"+i).visible = false;
            this.getWidget("oPanel"+i).removeAllChildren(true);
            this.getWidget("mPanel"+i).removeAllChildren(true);
            var layout = this.layouts[i];
            if(layout)//?????????????????????????????????
                layout.clean();
            //}
        }
        //if(GameTypeEunmZP.GLZP == PHZRoomModel.wanfa || GameTypeEunmZP.LSZP == PHZRoomModel.wanfa){
        //    this.getWidget("cpZhuangLastCard").removeAllChildren(true);
        //}
        var isContinue = false;
        var isMoPai = false;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!isContinue){
                isContinue = (p.handCardIds.length>0 || p.outedIds.length>0 || p.moldCards.length>0);//
                if(p.ext[3]==PHZRoomModel.mySeat)
                    isContinue = true;
            }
        }
        YZLCMineLayout.setRoot(this.getWidget("minePanel"));
        if(!isContinue)
            YZLCMineLayout.clean();
        this.btnPanel.visible = false;
        this.Button_ready.visible = true;
        this.fapai.visible = this.Label_remain.visible = false;
        this.Button_invite.visible = (players.length<PHZRoomModel.renshu);
        //??????????????????????????????
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!isContinue){
            }else {//????????????
                if(p.outCardIds.length>1) {//???????????????????????????
                    var lastId = p.outCardIds.slice(1);
                    this.lastLetOutMJ = lastId;
                }
            }
        }
        var handCards = [];
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = PHZRoomModel.getPlayerSeq(p.userId,p.seat);
            if (this._players[p.seat]){
                this._players[p.seat].hideQiHuImg();
            }

            var cardPlayer = this._players[p.seat] = new PHZPlayer(p,this.root,seq);
            cardPlayer.isShowFangZhao(p.ext[1]);
            if(!isContinue){
                if(p.status && !p.ext[9])
                    cardPlayer.onReady();
            }else{//????????????
                if ((PHZRoomModel.renshu == 2 || PHZRoomModel.renshu == 3) && PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                    if (p.seat == PHZRoomModel.mySeat){
                        if (this.Button_qihu){
                            this.Button_qihu.visible = true;
                        }
                    }
                }

                // cc.log("p.ext[11] =",p.ext[11]);
                if (p.ext[11] && p.ext[11] == 1){//?????????????????????
                    cardPlayer.showQiHuImg();
                    if (p.seat == PHZRoomModel.mySeat){
                        if (this.Button_qihu){
                            this.Button_qihu.visible = false;
                        }
                    }
                }
                var banker = null;
                if (seq == 1){
                    handCards = ArrayUtil.clone(p.handCardIds);
                }
                if(p.seat==PHZRoomModel.nextSeat)
                    banker= p.seat;

                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.moldCards,banker,isMoPai);

                if(p.outCardIds.length>1){//???????????????????????????
                    var lastId = p.outCardIds.slice(1);
                    var lastVo = PHZAI.getVoArray(lastId);
                    var lastDirect = PHZRoomModel.getPlayerSeq(p.userId, p.seat);
                    this.lastLetOutMJ = lastId;
                    this.lastLetOutSeat = p.seat;
                    //this.layouts[lastDirect].chuPai(lastVo);
                    if (p.seat != PHZRoomModel.nextSeat){
                        YZLCRoomEffects.chuPai(this.getWidget("cp"+lastDirect),lastVo,p.outCardIds[0],PHZRoomModel.renshu,lastDirect,this.getWidget("oPanel"+lastDirect));
                    }
                }

                this.Button_sort.visible = false;
                this.showChuoBtn.visible = true;/** ???????????? **/

                if(p.recover.length>0){//???????????????????????????
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        PHZRoomModel.banker = p.seat;
                        cardPlayer.isBanker(true);
                    }
                    if(p.recover.length>2 && p.userId==PlayerModel.userId){
                        this.refreshButton(p.recover.slice(2));
                    }
                }
                cardPlayer.startGame();
            }
            if (PHZRoomModel.isAutoPlay() && PHZRoomModel.getPlayerIsTuoguan(p)){
                cardPlayer.updateTuoguan(true)
            }
            if(p.userId ==PlayerModel.userId){//?????????????????????
                this.guoChiVals = p.intExts;
                // cc.log("========guoChiVals===========" + this.guoChiVals);
                if(p.status){
                    this.tuichuBtn.x = 960;
                    this.Button_ready.visible = false;
                    if(isContinue)
                        this.fapai.visible = this.Label_remain.visible = false;//true;
                }

                //???????????????????????? ??????????????????
                if(this.bg_CancelTuoguan){
                    var isMeTuoguan = PHZRoomModel.getPlayerIsTuoguan(p);
                    cc.log("???????????????????????????????????????..."  , isMeTuoguan);
                    this.bg_CancelTuoguan.visible = isMeTuoguan;
                }
            }
        }
        // cc.log("this._players[i] =",JSON.stringify(this._players));
        //?????????????????????
        var voArray = [];
        for(var i=0;i<handCards.length;i++){
            voArray.push(PHZAI.getPHZDef(handCards[i]));
        }
        if (voArray.length > 0 ){
            this.hideHandsTingImg();
            //this.checkHu(voArray);
        }

        if(isContinue){
            if(PHZRoomModel.timeSeat)
                this.showJianTou(null,true);
            this.Button_invite.visible = false;
            SyEventManager.dispatchEvent("YZLC_UPDATE_CHUPAI");
            PHZRoomModel.isStart = true;
        }
        //IP???????????????
        if(players.length>1){
            var seats = PHZRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }

        // this.getRedCardsNum();
    },

    updateRemain:function(){
        //if (PHZRoomModel.is4Ren()) {
        //    this.Label_remain.setString(""+PHZRoomModel.remain);
        //} else {
        //    var remain = PHZRoomModel.remain;
        //    this.Label_remain.setString("??????"+remain+"???");
        //    var paiDun = this.fapai.getChildrenCount();
        //    if (paiDun == 0 && remain > 0) {
        //        for (var i=0;i<remain;i++) {
        //            var dun = new cc.Sprite("res/ui/phz/pp/card.png");
        //            dun.x = this.fapai.width/2;
        //            dun.y = 35+i*0.5
        //            this.fapai.addChild(dun, 1, (this.tag_paidun+i));
        //        }
        //    } else {
        //        if (paiDun > remain) {
        //            for (var i=paiDun;i>remain;i--) {
        //                this.fapai.removeChildByTag((this.tag_paidun+(i-1)));
        //            }
        //        }
        //    }
        //}
    },

    updateRoomInfo:function(){
        if(this.label_payType){
            this.label_payType.setString("????????????");
            if(PHZRoomModel.getCostFangShi() == 1){
                this.label_payType.setString("AA??????");
            }else if(PHZRoomModel.getCostFangShi() == 3){
                this.label_payType.setString("????????????");
            }
        }

        if(this.lable_GameName){
            if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
                this.lable_GameName.setString("????????????");
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
                this.lable_GameName.setString("????????????")
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                this.lable_GameName.setString("???????????????")
            }
        }

        if(this.lable_renshu){
            this.lable_renshu.setString(PHZRoomModel.renshu + "???");
        }


        this.Label_jushu.setString(csvhelper.strFormat("???{0}/{1}???",PHZRoomModel.nowBurCount,PHZRoomModel.totalBurCount));
        if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP || PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF || PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ){
            this.Label_jushu.setString("???"+PHZRoomModel.nowBurCount+"???");
        }
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
        switch (temp){
            case PHZAction.HU:
                PHZRoomModel.sendPlayCardMsg(temp,[]);
                break;
            case PHZAction.PENG:
                var isHu = obj.state;
                if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ)isHu = false;//???????????????????????????
                if(isHu){
                    AlertPop.show("?????????????????????????????????????????????",function(){
                        PHZRoomModel.sendPlayCardMsg(temp,[]);
                    },function(){});
                }else{
                    PHZRoomModel.sendPlayCardMsg(temp,[]);
                }
                break;
            case PHZAction.GUO:
                var guoParams = [];
                if(this.lastLetOutMJ && Array.isArray(this.lastLetOutMJ)){
                    guoParams = this.lastLetOutMJ.slice(0);
                }
                ArrayUtil.merge(PHZRoomModel.selfAct,guoParams);
                cc.log(" ?????????????????? ",JSON.stringify(guoParams));
                var isHu = obj.state;
                var self = this;
                if(isHu){
                    AlertPop.show("?????????????????????????????????????????????",function(){
                        //if(PHZRoomModel.selfAct && PHZRoomModel.selfAct[4]){//???????????????
                        //    self.guoChiVals.push(PHZAI.getPHZDef(self.lastLetOutMJ).v);
                        //}
                        PHZRoomModel.sendPlayCardMsg(temp,guoParams);
                    },function(){});
                }else{

                    //if(PHZRoomModel.selfAct && PHZRoomModel.selfAct[4]){//???????????????
                    //    self.guoChiVals.push(PHZAI.getPHZDef(self.lastLetOutMJ).v);
                    //}

                    PHZRoomModel.sendPlayCardMsg(temp,guoParams);
                }
                break;
            case PHZAction.CHI:
                //var self = this;
                //var isHu = obj.state;
                //if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ)isHu = false;//???????????????????????????
                //if(isHu){
                //    AlertPop.show("?????????????????????????????????????????????",function(){
                //        self.chooseChi()
                //    },function(){});
                //}else{
                //    self.chooseChi()
                //}
                break;
            case PHZAction.PAO:
                //PHZRoomModel.sendPlayCardMsg(PHZAction.PAO,[this.lastLetOutMJ]);
                break;
            case PHZAction.WEI:
                //PHZRoomModel.sendPlayCardMsg(PHZAction.WEI,[]);
                break;
            case PHZAction.TI:
                //var result = this.getLiuCards();
                //if(result.length > 1){
                //    this.displayLiuSelect(result);
                //}else{
                //    var data = [];
                //    for(var i = 0;i<result.length;++i){
                //        for(var j = 0;j<result[i].length;++j){
                //            data.push(result[i][j].c);
                //            break;
                //        }
                //    }
                //    PHZRoomModel.sendPlayCardMsg(PHZAction.TI,data);
                //}
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                //???????????????????????????
                //PHZRoomModel.sendPlayCardMsg(temp,[]);
                break;
        }
    },

    chooseChi:function(){
        if(this.btnPanel.getChildByTag(this.tag_chi_select))
            return;
        var sourceArray = YZLCMineLayout.getCurVoArray();
        var lastMJ = PHZAI.getPHZDef(this.lastLetOutMJ);
        lastMJ.isChi=1;
        //?????????????????????????????????????????????????????????????????????????????????????????????????????????
        sourceArray.unshift(lastMJ);
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            var data = PHZAI.getChiNoFilter(sourceArray,lastMJ);
            data = this.checkGuoChi(data);
            var result = {selectTimes:0,data:data};
        }else{
            var result = PHZAI.getChi(sourceArray,lastMJ);
        }

        if(result.data.length>0){//????????????
            if (PHZSetModel.kscp && result.data.length == 1){
                this.getChiSelect(sourceArray,result.data,result.selectTimes,0);
            }else{
                this.displayChiSelect(sourceArray,result.data,result.selectTimes,0);
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
        var bg = UICtor.cS9Img("res/res_phz/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,260));
        var initX = (bg.width-65*result.length-(result.length-1)*5)/2;
        var lastMJVo = PHZAI.getPHZDef(this.lastLetOutMJ);
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
            var innerbg = new UICtor.cImg("res/res_phz/chipai_single.png");
            innerbg.setTouchEnabled(true);
            innerbg.scale = 1.2;
            var clickbg = new UICtor.cImg("res/res_phz/chipai_click.png");
            clickbg.scale = 1.2;
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= false;
            var passArray = [];
            for(var j=0;j<array.length;j++){
                var phz = new YZLCCard(PHZAI.getDisplayVo(1,2),array[j]);
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
            var chiOrBiTex = curTime<1 ? "res/res_phz/chi-chi.png" : "res/res_phz/chi-bi.png";
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
                            bg.x = data2.x - data.itemObj.width/2 -30;;
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
            var data = PHZAI.getPHZDef(this.lastLetOutMJ);
            tempCards[data.v] = [data];
        }
        if(this.lastLetOutMsg && this.lastLetOutMsg.actType == 0
            && this.lastLetOutMsg.action != PHZAction.GUO){
            tempCards = {};
        }

        var handCards = YZLCMineLayout.cards;
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
        var bg = UICtor.cS9Img("res/ui/phz/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,260));
        var initX = (bg.width-65*result.length-(result.length-1)*5)/2;

        for(var i=0;i<result.length;i++){
            var array = result[i];

            var innerbg = new UICtor.cS9Img("res/ui/phz/chipai_single.png",cc.rect(15,50,15,50),cc.size(57,240));
            innerbg.setTouchEnabled(true);

            var clickbg = new UICtor.cS9Img("res/ui/phz/chipai_click.png",cc.rect(15,50,15,50),cc.size(57,240));
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= false;
            var passArray = [];
            for(var j=0;j<array.length;j++){
                var phz = new YZLCCard(PHZAI.getDisplayVo(1,2),array[j]);
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
        PHZRoomModel.sendPlayCardMsg(PHZAction.TI,sender.passArray);
    },


    /**
     * ????????????????????????
     * @param cardsArray
     * @param result ????????????????????????id????????????
     * @param needTimes ?????????????????????
     * @param curTime ?????????????????????
     */
    getChiSelect:function(cardsArray,result,needTimes,curTime){
        var lastMJVo = PHZAI.getPHZDef(this.lastLetOutMJ);
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
        var passArray = obj.passArray;
        var cardsArray = obj.cardsArray;
        var needTimes = obj.needTimes;
        var curTime = obj.curTime;
        this.temp_chi_select_map[curTime] = passArray;
        if(curTime>=needTimes){//?????????????????????????????????????????????
            PHZRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
        }else{
            var nextCardsArray = [];
            for(var i=0;i<cardsArray.length;i++){
                var vo = cardsArray[i];
                if(ArrayUtil.indexOf(passArray,vo.c)<0)
                    nextCardsArray.push(vo);
            }
            var result = PHZAI.getChi(nextCardsArray,PHZAI.getPHZDef(this.lastLetOutMJ));
            if(result.data.length>0){
                this.temp_chi_select_map = {};
                var sourceArray = YZLCMineLayout.getCurVoArray();
                var lastMJ = PHZAI.getPHZDef(this.lastLetOutMJ);
                lastMJ.isChi=1;
                //?????????????????????????????????????????????????????????????????????????????????????????????????????????
                sourceArray.unshift(lastMJ);
                var result1 = PHZAI.getChi(sourceArray,lastMJ);
                this.displayChiSelect(sourceArray,result1.data,result1.needTimes,0);
            }else{
                PHZRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
            }
        }
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
        var passArray = obj.passArray;
        var cardsArray = obj.cardsArray;
        var needTimes = obj.needTimes;
        var curTime = obj.curTime;
        obj.clickbg.visible = true;
        // cc.log("curTime =",curTime);
        // cc.log("this.lastSelectChiBg[curTime] =",this.lastSelectChiBg[curTime]);
        if (this.lastSelectChiBg && this.lastSelectChiBg[curTime]){
            if (this.lastSelectChiBg[curTime].clickbg != obj.clickbg)
                this.lastSelectChiBg[curTime].clickbg.visible = false;
        }
        this.lastSelectChiBg[curTime] = {clickbg:obj.clickbg,time:curTime};
        // this.lastSelectChiBg{btn:obj,time:curTime};
        this.temp_chi_select_map[curTime] = passArray;
        if(curTime>=needTimes){//?????????????????????????????????????????????
            this.lastSelectChiBg = {};
            PHZRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
        }else{
            var nextCardsArray = [];
            for(var i=0;i<cardsArray.length;i++){
                var vo = cardsArray[i];
                if(ArrayUtil.indexOf(passArray,vo.c)<0)
                    nextCardsArray.push(vo);
            }
            var result = PHZAI.getChi(nextCardsArray,PHZAI.getPHZDef(this.lastLetOutMJ));
            if(result.data.length>0){
                this.displayChiSelect(nextCardsArray,result.data,needTimes,(curTime+1));
            }else{
                this.lastSelectChiBg = {};
                PHZRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
            }
        }
    },

    /**
     * ???????????????????????????
     */
    hideAllBanker:function(){
        for(var key in this._players){
            this._players[key].isBanker(false);
            if(PHZRoomModel.renshu==4){
                this._players[key].isShuXing(false);
            }

        }
    },

    /**
     * ????????????,???DealInfoResponder??????
     * @param event
     */
    startGame:function(event){
        this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        PlayPHZMessageSeq.clean();
        if (PHZRoomModel.is3Ren() || PHZRoomModel.is2Ren()) {
            this.fapai.removeAllChildren();
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                // cc.log("11111111111111111111111111111111======>")
                this.Button_qihu.visible = true
            }
        }
        //this.startGameAni();
        PHZRoomModel.isStart = true;
        this.jiesanBtn.visible = true;
        this.jiesanBtn.setBright(true);
        this.jiesanBtn.setTouchEnabled(true);
        this.tuichuBtn.visible = false;
        this.lastMoPHZ=this.lastLetOutSeat=0;
        this.lastLetOutMJ = [];
        this.updateRoomInfo();
        if(this.root.getChildByTag(3003))
            this.root.removeChildByTag(3003);
        for(var i=1;i<=PHZRoomModel.renshu;i++){
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
        /***
         *  ??????????????????
         * @type {boolean}
         */
        this.fapai.visible = this.Label_remain.visible = false;//true;
        var p = event.getUserData();
        //?????????????????????
        this.hideAllBanker();

        //?????????????????????
        var voArray = [];
        for(var i=0;i<p.handCardIds.length;i++){
            voArray.push(PHZAI.getPHZDef(p.handCardIds[i]));
        }

        this._countDown = PHZRoomModel.getNewTuoguanTime();
        //this.updateCountDown(this._countDown);
        var direct = PHZRoomModel.getPlayerSeq(PlayerModel.userId,PHZRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        this._players[p.banker].isBanker(true);
        this.Button_sort.visible = false;
        this.showJianTou(PHZRoomModel.nextSeat,true);
        if (p.xiaohu[1] == PHZRoomModel.mySeat){
            this.Button_sort.visible = false;
        }
        this.showChuoBtn.visible = true;
        SyEventManager.dispatchEvent("YZLC_UPDATE_CHUPAI");

        ////??????3???????????????
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            if(i != PHZRoomModel.mySeat){
                var d = PHZRoomModel.getPlayerSeq("",i);
                var iseat = (i==p.banker) ? i : null;
                this.initCards(d,[],[],[],[],iseat);
            }
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }

        this.refreshButton(p.selfAct);

        this.guoChiVals = [];

        this.Panel_piaofen.visible = false;
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

    NeedXipai: function () {
        this.hideAllBanker();
        this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        YZLCMineLayout.clean();
        if (PHZRoomModel.is3Ren() || PHZRoomModel.is2Ren()) {
            this.fapai.removeAllChildren();
        }

        if(this.yzlcChuPaiBtn){
            this.yzlcChuPaiBtn.opacity = 0;
        }

        if(this.tishiBtn){
            this.tishiBtn.opacity = 0;
        }

        for (var i = 1; i <= PHZRoomModel.renshu; i++) {
            this.getWidget("oPanel" + i).removeAllChildren(true);
            this.getWidget("mPanel" + i).removeAllChildren(true);
            var layout = this.layouts[i];
            if (layout)//?????????????????????????????????
                layout.clean();
        }
        this.getWidget("minePanel").visible = false;
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
                        LabelStr += "???" + nameList[i];
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
                this.tipLabelStr.setString("?????? "+LabelStr+" ????????????");
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
        if(this.tipLabelStr){
            this.tipLabelStr.visible = false;
        }
        if(this.yzlcChuPaiBtn){
            this.yzlcChuPaiBtn.opacity = 255;
        }

        if(this.tishiBtn){
            this.tishiBtn.opacity = 255;
        }
        for (var i = 1; i <= PHZRoomModel.renshu; i++) {
            this.getWidget("mPanel" + i).visible = true;
            this.getWidget("oPanel" + i).visible = true;
        }
        this.getWidget("minePanel").visible = true;
        if(BaseXiPaiModel.isNeedXiPai){
            PlayPHZMessageSeq.playNextMessage();
        }
        BaseXiPaiModel.isNeedXiPai = false;
    },

    xipaiAni: function () {
        this.actionnode = new cc.Node();
        this.addChild(this.actionnode, 10);
        this.actionnode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 300);
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/jnqp/jnqp.ExportJson");
        var ani = new ccs.Armature("jnqp");
        ani.setAnchorPoint(0.5, 0.5);
        ani.setPosition(-50, 600);
        ani.getAnimation().play("Animation1", -1, 1);
        this.actionnode.addChild(ani);
        for (var index = 0; index < 11; index++) {
            var back_card = new cc.Sprite("res/res_phz/action_card.png");
            back_card.scale = 0.8;
            back_card.setPosition(-300, 0);
            this.actionnode.addChild(back_card);
            back_card.setLocalZOrder(-index);

            var action = this.xipaiAction(index, 1)
            back_card.runAction(action);
        }

        for (var j = 0; j < 11; j++) {
            var back_card2 = new cc.Sprite("res/res_phz/action_card.png");
            back_card2.scale = 0.8;
            back_card2.setPosition(300, 0);
            this.actionnode.addChild(back_card2);
            back_card2.setLocalZOrder(-j);

            var action = this.xipaiAction(j, 2)
            back_card2.runAction(action);
        }
    },

    xipaiAction: function (index, type) {
        var self = this;
        var end_x = type == 2 ? 300 : -300;
        var action = cc.sequence(
            cc.delayTime(0.1 * index),
            cc.moveTo(0.3, end_x, 600 - 60 * index),
            cc.moveTo(0.2, end_x, 200),
            cc.moveTo(0.1, 0, 300),
            cc.callFunc(function () {
                if (index == 10) {
                    self.actionnode.removeAllChildren();
                    sySocket.sendComReqMsg(3);
                    self.clearXiPai();
                }
            })
        );
        return action;
    },
    /**
     * ????????????????????????????????????????????????????????????
     * @param selfAct {Array.<number>}
     */
    refreshButton:function(selfAct){
        cc.log("==========refreshButton===============",selfAct);
        PHZRoomModel.selfAct = selfAct || [];
        this.btnPanel.removeAllChildren(true);
        if(selfAct.length>0){
            this.btnPanel.visible = true;
            var btnDatas = [];
            var textureMap = {
                0:{t:"res/res_phz/act_button/hu.png",v:1}
            };

            var isShowBtn = true;
            var isHu = false;
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp == 1 && i == 0){
                    isHu = true;
                }
                if (tm && temp == 1) {
                    btnDatas.push(tm);
                }
            }

            if(btnDatas.length>0 && isShowBtn){
                //????????????????????????????????????????????????????????????????????????btnDatas?????????
                var isShowGuo = true;
                var cards = YZLCMineLayout.getCurVoArray();
                if(cards.length === 0 && isHu) {/** ????????????????????????????????? */
                    btnDatas = [textureMap[0]];
                    isShowGuo = false;
                }
                isShowGuo && btnDatas.push({t:"res/res_phz/act_button/guo.png",v:5});
                var w = 225;//118
                var g = 20;
                var len = btnDatas.length;
                var initX = 1350;
                var cardX = 0;
                for(var i=0;i<len;i++){
                    var btnData = btnDatas[i];
                    var btn = new ccui.Button();
                    btn.anchorX=btn.anchorY=0;
                    btn.anchorY = 0.5;
                    btn.loadTextureNormal(btnData.t);
                    btn.temp = btnData.v;
                    btn.x = initX - (len-i-1)*w - w/2 - (len-i-1)*g;
                    btn.y = 150;
                    btn.state = isHu;
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
            var lastCard = PHZAI.getPHZDef(this.lastLetOutMJ);
            //cc.log("lastCard==="+JSON.stringify(lastCard))
            var phz = this.lastCard = new YZLCCard(PHZAI.getDisplayVo(1,1),lastCard,null,true);
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
        for(var i=1;i<=PHZRoomModel.renshu;i++){
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
        var message = event.getUserData();
         cc.log("onLetOutCard message = ",JSON.stringify(message));
        var userId = message.userId;
        var seat = message.seat;
        var action = message.action;
        var ids = message.phzIds;
        var actType = message.actType;
        var timeSeat = message.timeSeat;
        var simulate = message.simulate || false;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ || PHZRoomModel.wanfa == GameTypeEunmZP.LDS
            || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            if (this.CanClealTingImg && message.seat == PHZRoomModel.mySeat){
                // cc.log("this.hideHandsTingImg =======================>");
                this.hideHandsTingImg();
                this.outTingInfo = [];
            }
            this.CanClealTingImg = true;
        }else{
            if (message.seat == PHZRoomModel.mySeat && ids.length!= 0){
                this.hideHandsTingImg();
            }
        }

        //this.cleanSPanel();
        //????????????????????????????????????????????????????????????????????????????????????????????????
        if(seat==PHZRoomModel.mySeat&&actType==2&&action==0&&ids.length>0&&!simulate){
            if (!YZLCMineLayout.isHasHardCard(ids[0])){
                this.showJianTou(timeSeat);
                this.delayLetOut(seat,action,ids);
                return;
            }
        }

        //????????????????????????????????????????????????
        if (seat==PHZRoomModel.mySeat){
            this.btnPanel.visible = false;
        }

        var isCleanChuPai = false;
        //if(action == PHZAction.GUO || action == PHZAction.HU)isCleanChuPai = false;
        //?????????????????????????????????????????????????????????????????????????????????
        if(this.lastLetOutSeat>0 && seat==this.lastLetOutSeat && action == 2)isCleanChuPai = true;
        var selfAct = message.selfAct;
        // cc.log("===========onLetOutCard======isCleanChuPai===" + isCleanChuPai);
        isCleanChuPai && this.cleanChuPai();


        var lastMoPHZ = this.lastMoPHZ;
        var self = this;

        var isOutCard = true;
        //?????????????????????????????????????????????????????????????????????
        if(lastMoPHZ>0 && this.lastLetOutSeat>0 && actType!=0) {
            isOutCard = false;
            this.showOutCardTimeOutHandle = setTimeout(function(){self.onLetOutPai(message)},150);
        }
        if (isOutCard){
            // cc.log("=============onLetOutCard=======3======");
            this.onLetOutPai(message);
        }

    },

    /**
     * ???????????????????????????????????????,????????????????????????????????????
     * @param message
     */
    onLetOutPai:function(message){
        this.lastLetOutMsg = message;
        cc.log("=============onLetOutPai=============",JSON.stringify(message));
        cc.log(" layout ",Object.keys(this.layouts).length);
        // cc.log("=============this.kehushizhong=============",this.kehushizhong);
        this._countDown = PHZRoomModel.getNewTuoguanTime();
        //this.updateCountDown(this._countDown);
        //var message = event.getUserData();
        var userId = message.userId;
        var seat = message.seat;
        var action = message.action;
        var selfAct = message.selfAct;
        var ids = message.phzIds;
        var direct = PHZRoomModel.getPlayerSeq(userId,seat);
        var actType = message.actType;
        var nextSeat = message.nextSeat;
        var huxi = message.huxi;
        var isZaiPao = message.isZaiPao;
        var isChongPao = message.isChongPao;//??????
        var timeSeat = message.timeSeat;


        PHZRoomModel.timeSeat = timeSeat;
        var simulate = message.simulate || false;
        if(!simulate && (huxi > 0) && action != 20) {
            // cc.log("this._players =",JSON.stringify(this._players));
            this._players[seat].updateHuXi(huxi);
        }

        var self = this;
        if(actType==0&&action==PHZAction.GUO){
            //noting to do
        }else{
            this.lastMoPHZ = (actType!=0 && ids.length>0) ? ids[0] : 0;
        }
        var isFinish = false;

        if(actType!=0){//???????????? actType1????????? 2?????????
            if(ids.length>0 && (action === 2 || action === 21 || action === 4)){
                isFinish = true;
                var cardTransData = [];
                for(var i=0;i<ids.length;i++){
                    cardTransData.push(PHZAI.getPHZDef(ids[i]));
                }
                var isTuoguan = PHZRoomModel.isAutoPlay();
                if(isTuoguan && seat === PHZRoomModel.mySeat){
                    this.cleanChuPai();
                }
                if(action === 2 || action === 4){
                    //???????????????????????????????????????
                    this.lastLetOutMJ = ids;
                    this.lastLetOutSeat = seat;
                    if(actType==1 && (seat==PHZRoomModel.mySeat || (seat == PHZRoomModel.bankerSeat && PHZRoomModel.mySeat == PHZRoomModel.sxSeat))
                        || isTuoguan){
                        for(var i=0;i<cardTransData.length;i++){
                            var isBool = false;
                            if(i == cardTransData.length - 1){
                                isBool = true;
                            }
                            YZLCMineLayout.delOne(cardTransData[i],isBool);
                            //this.getLayout(direct).chuPai(cardTransData[i]);
                        }

                    }

                    var soundPrefix = PHZAI.findCardType(cardTransData);
                    if(soundPrefix != "" && soundPrefix != null){
                        if(isChongPao != 1){/** ??????????????????????????? **/
                            PHZRoomSound.yzlcLetOutSound(userId,soundPrefix,cardTransData.length !== 1);
                        }
                    }

                    // cc.log("=============onLetOutPai=======1======",actType,action,direct,JSON.stringify(cardTransData));
                    YZLCRoomEffects.chuPai(this.getWidget("cp"+direct),cardTransData,actType,PHZRoomModel.renshu,direct,
                        self.getWidget("oPanel"+direct),function(){
                            self.finishLetOut(seat,action,ids);
                            if(soundPrefix != "" && soundPrefix != null && isChongPao == 1){
                                PHZRoomSound.yzlcLetOutSound(userId,"da",true);
                            }
                        },isChongPao
                    );
                }
                var delayTime = 0;
                if(isZaiPao == 1){
                    if(action == 21){
                        this.localShuiArr[direct] = {action:action,huxi:huxi,ids:ids};
                        delayTime = 500;
                        if(PHZRoomModel.renshu === 3){
                            delayTime = 750;
                        }else if(PHZRoomModel.renshu === 4){
                            delayTime = 1000;
                        }
                    }
                    setTimeout(function(){
                        var layout = self.getLayout(direct);
                        layout.chiPai(ids,action,huxi);
                        if(action == 21) {
                            self.finishLetOut(seat,action,ids);
                        }
                    },delayTime);

                    //if(Object.keys(this.layouts).length === PHZRoomModel.renshu
                    //    && Object.keys(this.localShuiArr).length==PHZRoomModel.renshu){
                    //    for(var val in this.localShuiArr){
                    //        var temp = this.localShuiArr[val];
                    //        var layout = this.getLayout(parseInt(val));
                    //        layout.chiPai(temp.ids,temp.action,temp.huxi);
                    //    }
                    //    this.localShuiArr = {};
                    //}
                }
            }
        }else{//????????????
            PHZRoomModel.currentAction = (seat==PHZRoomModel.mySeat) ? action : 0;
            if(action==PHZAction.HU){//?????????
                this.btnPanel.visible = false;
                YZLCRoomEffects.huPai(this.root,direct,PHZRoomModel.renshu);
                var soundPrefix = "hu";
                PHZRoomSound.yzlcLetOutSound(userId,soundPrefix,true);
            }
        }

        if(actType == 20){
            YZLCRoomEffects.normalAction("pass",this.root,direct,PHZRoomModel.renshu,userId);
        }

        if(action!=PHZAction.LONG_BU_ZI){
            if (action == PHZAction.GUO && seat != PHZRoomModel.mySeat){

            }else{
                this.refreshButton(selfAct);
            }
        }

        if(action!=PHZAction.HU){
            PHZRoomModel.nextSeat = nextSeat;
            if(timeSeat)
                this.showJianTou();
        }

        if(!isFinish && !simulate){
            this.delayLetOut(seat,action,ids);
        }
    },

    onGetWangPai:function(message,voArray){
        var userId = message.userId;
        var selfAct = message.selfAct;
        var seat = message.seat;
        var direct = PHZRoomModel.getPlayerSeq(userId,seat);
        var vo = voArray.shift();
        YZLCRoomEffects.chuPai(this.getWidget("cp"+direct),vo,1,PHZRoomModel.renshu,direct,this.getWidget("oPanel"+direct));
        if(seat==PHZRoomModel.mySeat){
            YZLCMineLayout.handleLongBuZi(vo);
        }
        PHZRoomSound.letOutSound(userId,vo);
        YZLCMineLayout.outCardTingPai(this.outTingInfo);
        var self = this;
        if(voArray.length>0){
            setTimeout(function(){
                self.cleanChuPai();
                self.onGetWangPai(message,voArray);
            },1000);
        }else{
            if(seat==PHZRoomModel.mySeat)
                this.refreshButton(selfAct);
            setTimeout(function(){
                self.cleanChuPai();
                PlayPHZMessageSeq.finishPlay();
            },1000);
        }
    },

    fixMyCard:function(event){
        //?????????????????? ??????????????????
        if(event){
            var message = event.getUserData();
            var params = message.params;
            var id = params[0];
            cc.log("????????????????????????.." , id);
            if(this.lastMoPHZ == id){
                this.cleanChuPai();
                this.lastMoPHZ = 0
            }
            this.getLayout(1).fixOutCard(id);
            YZLCMineLayout.addOne(id);
        }
    },

    hideAction:function(){
        this.resetChiSelect();
        this.btnPanel.removeAllChildren(true);
    },

    delayLetOut:function(seat,action,ids){
        var self = this;
        self.finishLetOut(seat,action,ids);
        //setTimeout(function(){self.finishLetOut(seat,action,ids)},100);
    },

    finishLetOut:function(seat,action,ids){
        //if(seat==PHZRoomModel.mySeat) {//?????????????????????????????????????????????????????????
        //    var toId = ids.length>0 ? ids[0] : 0;
        //    PHZRoomModel.sendPlayCardMsg(9, [action,toId]);
        //}
        PlayPHZMessageSeq.finishPlay();
    },

    onLongBuZi:function(message,voArray){
        var userId = message.userId;
        var selfAct = message.selfAct;
        var seat = message.seat;
        var direct = PHZRoomModel.getPlayerSeq(userId,seat);
        var vo = voArray.shift();
        YZLCRoomEffects.chuPai(this.getWidget("cp"+direct),vo,1,PHZRoomModel.renshu,direct,this.getWidget("oPanel"+direct));
        if(seat==PHZRoomModel.mySeat)
            YZLCMineLayout.handleLongBuZi(vo);
        var self = this;
        if(voArray.length>0){
            setTimeout(function(){
                self.cleanChuPai();
                self.onLongBuZi(message,voArray);
            },1000);
        }else{
            this.refreshButton(selfAct);
            setTimeout(function(){
                self.cleanChuPai();
                self.finishLetOut(seat,message.action,message.phzIds);
            },1000);
        }
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
        var wanfa = PHZRoomModel.getName(PHZRoomModel.wanfa);

        var wanfaDesc = PHZRoomModel.getWanFaDesc();

        var playerNum = " "+ PHZRoomModel.renshu + "???" + (PHZRoomModel.renshu - PHZRoomModel.players.length);

        var obj={};
        obj.tableId=PHZRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+PHZRoomModel.tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title=wanfa+'   ??????:'+PHZRoomModel.tableId + playerNum;
        var clubStr = "";
        if (PHZRoomModel.isClubRoom(PHZRoomModel.tableType)){
            clubStr = "[?????????]";
        }
        obj.description = clubStr + csvhelper.strFormat("???????????????{0}??????{1}", PHZRoomModel.renshu, wanfaDesc);
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
        var p =PHZRoomModel.getPlayerVo(userId);
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
        var p =PHZRoomModel.getPlayerVo(userId);
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
        var seq = PHZRoomModel.getPlayerSeq(p.userId,p.seat);
        this._players[p.seat] = new PHZPlayer(p,this.root,seq);
        this.Button_invite.visible = (ObjectUtil.size(this._players)<PHZRoomModel.renshu);
        var seats = PHZRoomModel.isIpSame();
        if(seats.length>0){
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
        this._players[data[0]].leaveOrOnLine(data[1]);
    },

    /**
     * ????????????
     * @param event
     */
    onExitRoom:function(event){
        var p = event.getUserData();
        this._players[p.seat].exitRoom();
        delete this._players[p.seat];
        var seats = PHZRoomModel.isIpSame();
        this.Button_invite.visible = (ObjectUtil.size(this._players)<PHZRoomModel.renshu);
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
        for(var i=0;i<PHZRoomModel.players.length;i++){
            var p = PHZRoomModel.players[i];
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
        layout = new YZLCLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    /**
     * ???????????????????????????
     * @param seat
     */
    showJianTou:function(seat,isTing){
        seat = seat || PHZRoomModel.timeSeat;
        //cc.log("seat========"+seat);
        //cc.log("PHZRoomModel.timeSeat========"+PHZRoomModel.timeSeat);
        //cc.log("PHZRoomModel.nextSeat========"+PHZRoomModel.nextSeat);
        if(seat > 0){
            this.Image_time.visible = true;
            //????????????
            // if (PHZRoomModel.is4Ren()) {
            //     this.Image_time.visible = false;
            // }
            var direct = PHZRoomModel.getPlayerSeq("",seat);
            this.timeDirect = direct;
            var coords = null;
            if(PHZRoomModel.renshu==4){
                coords = {1:{x:0,y:220},2:{x:0,y:220},3:{x:0,y:220},4:{x:0,y:220}};
            }else if(PHZRoomModel.renshu==3){
                coords = {1:{x:200 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:190},2:{x:1600 + (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,y:800},3:{x:200 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:800}};
            }else{
                coords = {1:{x:200 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:190},2:{x:200 + (SyConfig.DESIGN_WIDTH-cc.winSize.width)/2,y:800}};
            }
            var coord = coords[direct];
            this.Image_time.x = coord.x;
            this.Image_time.y = coord.y;

            for(var index = 1 ; index <= PHZRoomModel.renshu ; index ++) {
                if (this._players[index]) {
                    this._players[index].playerQuanAnimation(index == seat);
                }
            }
        }
        //??????????????????????????????Id
        PHZRoomModel.setTouchCard(0);
        /***
         *  ?????????????????????
         * @type {boolean}
         */
        this.Panel_shouzhi.visible = false;//seat == PHZRoomModel.mySeat;//PHZRoomModel.isShowFinger();
        this.Image_hdx.visible = false;//seat == PHZRoomModel.mySeat;//PHZRoomModel.isShowFinger();
        this.showChuPaiBtn(seat == PHZRoomModel.mySeat && PHZRoomModel.selfAct[0] != 1);
        if (PHZRoomModel.isShowFinger()) {
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
            YZLCMineLayout.initData(p1Mahjongs,this.getWidget("minePanel"));
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
        var p = PHZRoomModel.getPlayerVo(userId);
        var fromPlayer = this._players[p.seat];
        var targetPlayer = this._players[seat];
        if(fromPlayer._playerVo.userId != targetPlayer._playerVo.userId) {
            var url = "res/ui/emoji/prop" + content + ".png";
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
    updateSetYyxz:function(){
        //???????????????
    },
    updateSetCpsd:function(){
        //???????????????
    },
    updateSetZpdx:function(){
        if (YZLCMineLayout){
            YZLCMineLayout.changeHandCardSize();
        }
        if (this.lastCard) {
            //this.showTipCard()
        }
    },
    updateSetXxxz:function(){
        this.Image_hdx.y = 340;
        PHZSetModel.cardTouchend = 318;
        if (PHZSetModel.xxxz == 1){
            this.Image_hdx.y = 360;
            PHZSetModel.cardTouchend = 338;
        }
    },
    updateSetZpxz:function(){
        cc.log("updateSetZpxz")
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            if (this.layouts[i]){
                this.layouts[i].changeOutCardTextrue()
            }
        }
        if (YZLCMineLayout){
            YZLCMineLayout.changeHandCardTextrue();
        }
        if (YZLCRoomEffects){
            YZLCRoomEffects.refreshCardByOpenTex()
        }
        if (this.lastCard){
            this.lastCard.refreshCardByOpenTex();
        }
    },
    updateSetPmxz:function(){
        cc.log("updateSetPmxz")
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            if (this.layouts[i]){
                this.layouts[i].changeOutCardBg()
            }
        }
        if (YZLCMineLayout){
            YZLCMineLayout.changeHandCardBg();
        }
        if (YZLCRoomEffects){
            YZLCRoomEffects.refreshCardBgByOpenTex()
        }
        if (this.lastCard){
            this.lastCard.refreshCardBgByOpenTex();
        }
    },
    updateSetIscp:function(){
        if (YZLCMineLayout){
            YZLCMineLayout.setCardOffY();
        }
    },
    updateBgColor:function(){
        var bgTexture = "res/res_phz/roombg/room_bg1.jpg";
        var gameTypeUrl = "";
        var ldfpf_qihuType ="";
        var ldfpf_manbaiType ="";
        // cc.log("PHZRoomModel.wanfa =",PHZRoomModel.wanfa)
        var wanfaUrl = "";
        if (PHZRoomModel.wanfa == GameTypeEunmZP.YZLC){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_yzlc.png";
        }else{
            this.Image_phzdetail.visible = false;
            this.Image_manbai.visible = true;
            this.Image_qihu.visible = true;
        }
        // var wanfaUrl = PHZRoomModel.wanfa == GameTypeEunmZP.SYBP ? "res/ui/phz/pp/wanfa1_1.png" : "res/ui/phz/pp/wanfa2_1.png";
        if (PHZSetModel.zmbj == 1){
            this.roomName_label.setColor(cc.color(214,203,173));
        }else if (PHZSetModel.zmbj == 2 || PHZSetModel.zmbj == 5){
            if (PHZRoomModel.wanfa == GameTypeEunmZP.YZLC){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_yzlc.png";
            }
            // wanfaUrl = PHZRoomModel.wanfa == GameTypeEunmZP.SYBP ? "res/ui/phz/pp/wanfa1_2.png" : "res/ui/phz/pp/wanfa2_2.png";
            bgTexture = "res/res_phz/roombg/room_bg2.jpg";
            if (PHZSetModel.zmbj == 5){
                bgTexture = "res/res_phz/roombg/room_bg5.jpg";
            }
            this.roomName_label.setColor(cc.color(204,204,204));
        }else if (PHZSetModel.zmbj == 3){
            if (PHZRoomModel.wanfa == GameTypeEunmZP.YZLC){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_yzlc.png";
            }
            bgTexture = "res/res_phz/roombg/room_bg3.jpg";
            this.roomName_label.setColor(cc.color(97,76,56));
        }else if (PHZSetModel.zmbj == 4){
            bgTexture = "res/res_phz/roombg/room_bg4.jpg";
            this.roomName_label.setColor(cc.color(214,203,173));
        }
        if(gameTypeUrl){
            this.Image_phz.loadTexture(gameTypeUrl);
        }else{
            this.Image_phz.visible = false;
        }
        if(wanfaUrl){
            this.Image_phzdetail.loadTexture(wanfaUrl);
        }else{
            this.Image_phzdetail.visible = false;
        }

        this.Panel_20.setBackGroundImage(bgTexture);
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
        for(var n=0;n<PHZRoomModel.renshu;n++) {
            var i = n + 1;
            var sPanel = this.getWidget("sPanel" + i);
            sPanel.removeAllChildren(true);
        }
    },

    //????????????????????????????????????
    cleanomPanel:function(){
        for(var n=0;n<PHZRoomModel.renshu;n++) {
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
        for(var n=0;n<PHZRoomModel.renshu;n++) {
            var onePlayerVo = ClosingInfoModel.closingPlayers[n];
            var oneCards = onePlayerVo.cards;//???????????????id???
            //var oneCards  = oneCards1[n];
            var cardVo = PHZAI.getVoArray(oneCards);//????????????
            var zorder = cardVo.length;
            var result = PHZAI.sortHandsVo(cardVo);
            for (var i = 0; i < result.length; i++) {
                var seat = onePlayerVo.seat;
                //var seat = n+1;
                var seq = PHZRoomModel.getPlayerSeq("", seat);
                var cardArray = result[i];
                for (var j = 0; j < cardArray.length; j++) {
                    if(seq!=1) {
                        var scale = 0.9;
                        var card = new PHZCard(PHZAI.getDisplayVo(seq, 2), cardArray[j]);
                        var sPanel = this.getWidget("sPanel" + seq);
                        sPanel.addChild(card, zorder);
                        card.scale = scale;
                        var gx = 48*scale;
                        var gy = 50*scale;
                        if(PHZRoomModel.renshu>3){
                            if(seq!=3){
                                card.x = (seq == 2) ? -190 +  i * gx : 350 - i * gx;
                            }else{
                                card.x = 350 - i * gx;
                            }
                            card.y = -20+j * gy;
                        }else{
                            card.x = (seq == 2) ? -210 + i * gx : 350 - i * gx;
                            if (PHZRoomModel.renshu == 2){
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