/**
 * Created by zhoufan on 2016/11/7.
 */
var PHZRoom = BaseLayer.extend({ //BaseLayer BaseRoom
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
        this.lastActType = 0;
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

        if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            //桂林字牌替换牌底的资源
            var cardsFrameArr = ["big_face_1.png","big_face1.png","big_face2.png",
                "big_face3.png","big_face4.png","big_half_face_1.png",
                "big_half_face_2.png","big_half_face_3.png","big_half_face_4.png",
                "big_half_face1_1.png","big_half_face1_2.png","big_half_face1_3.png",
                "big_half_face1_4.png","big_half_face2_1.png","big_half_face2_2.png",
                "big_half_face2_3.png","big_half_face2_4.png","small_half_back.png",
                "small_half_face_1.png","small_half_face_2.png","small_half_face_3.png",
                "small_half_face_4.png","small_half_face1_1.png","small_half_face1_2.png",
                "small_half_face1_3.png","small_half_face1_4.png","small_half_face2_1.png",
                "small_half_face2_2.png","small_half_face2_3.png","small_half_face2_4.png"
            ];
            for (var i = 0; i < cardsFrameArr.length; ++i) {
                cc.spriteFrameCache.removeSpriteFrameByName(cardsFrameArr[i]);
                var frame = new cc.Sprite("res/res_phz/glzpCard/" + cardsFrameArr[i]).getSpriteFrame();
                cc.spriteFrameCache.addSpriteFrame(frame, cardsFrameArr[i]);
            }
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){//落地扫替换下王牌的资源
            var replaceFrameArr = ["big_cards1_11b.png","big_cards3_11b.png",
                "cards_listencard_81b.png","phz_cphua.png","small_cards1_11b.png","small_cards3_11b.png"];
            for (var i = 0; i < replaceFrameArr.length; ++i) {
                cc.spriteFrameCache.removeSpriteFrameByName(replaceFrameArr[i]);
                var frame = new cc.Sprite("res/res_phz/ldswp/" + replaceFrameArr[i]).getSpriteFrame();
                cc.spriteFrameCache.addSpriteFrame(frame, replaceFrameArr[i]);
            }
        }

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
        this.Panel_20 = this.getWidget("Panel_20");//背景
        this.Image_phz = this.getWidget("Image_phz");//跑胡子玩法
        this.Image_phzdetail = this.getWidget("Image_phzdetail");
        this.Image_phzdetail.x = this.Image_phzdetail.x - 110;
        this.Image_manbai = this.getWidget("Image_manbai");
        this.Image_manbai.x = this.Image_manbai.x - 100;
        this.Image_qihu = this.getWidget("Image_qihu");
        this.Image_qihu.x = this.Image_qihu.x - 100;

        this.btnPanel = this.getWidget("btnPanel");
        // this.btnPanel.y += 0;
        this.Image_time = this.getWidget("Image_time");
        this.Image_time.visible = false;
        this.fapai = this.getWidget("fapai");
        this.Label_remain = this.getWidget("Label_remain");
        this.Label_info = this.getWidget("Label_info");//房间信息
        this.getWidget("Panel_btn").visible = true;//房间信息
        
        if(PHZRoomModel.wanfa==GameTypeEunmZP.XTPHZ || PHZRoomModel.wanfa==GameTypeEunmZP.XXPHZ || PHZRoomModel.wanfa==GameTypeEunmZP.XXGHZ
            || PHZRoomModel.wanfa==GameTypeEunmZP.LDFPF|| PHZRoomModel.wanfa==GameTypeEunmZP.LYZP|| PHZRoomModel.wanfa==GameTypeEunmZP.YZCHZ
            || (PHZRoomModel.wanfa==GameTypeEunmZP.LDS && PHZRoomModel.intParams[7] < 4)
            || (PHZRoomModel.wanfa==GameTypeEunmZP.JHSWZ && PHZRoomModel.intParams[7] < 4)
            || (PHZRoomModel.wanfa==GameTypeEunmZP.SYBP && PHZRoomModel.intParams[7] < 4)
            ||  PHZRoomModel.wanfa==GameTypeEunmZP.AHPHZ
            || (PHZRoomModel.wanfa==GameTypeEunmZP.GLZP && PHZRoomModel.intParams[7] < 4)
            ||  PHZRoomModel.wanfa==GameTypeEunmZP.NXPHZ
            ||  PHZRoomModel.wanfa==GameTypeEunmZP.SMPHZ
	        ||  PHZRoomModel.wanfa==GameTypeEunmZP.HSPHZ
            ||  PHZRoomModel.wanfa==GameTypeEunmZP.CDPHZ
            || PHZRoomModel.wanfa==GameTypeEunmZP.HHHGW
            || PHZRoomModel.wanfa==GameTypeEunmZP.AXWMQ){
            // this.Label_info.setAnchorPoint(0,1);
            // this.Label_info.setPosition(this.Label_info.x - 185,this.Label_info.y + 15);
            // this.Label_info.ignoreContentAdaptWithSize(false);
            // this.Label_info.setSize(500, 200);
        }else if((PHZRoomModel.wanfa==GameTypeEunmZP.LDS && PHZRoomModel.intParams[7] == 4)
            || (PHZRoomModel.wanfa==GameTypeEunmZP.JHSWZ && PHZRoomModel.intParams[7] == 4)
            || (PHZRoomModel.wanfa==GameTypeEunmZP.SYBP && PHZRoomModel.intParams[7] == 4)
            || (PHZRoomModel.wanfa==GameTypeEunmZP.GLZP && PHZRoomModel.intParams[7] == 4)){
            // this.Label_info.setAnchorPoint(0,1);
            // this.Label_info.setPosition(this.Label_info.x,this.Label_info.y + 15);
            // this.Label_info.ignoreContentAdaptWithSize(false);
            // this.Label_info.setSize(500, 200);
        }

        if (PHZRoomModel.is4Ren()) {
            //this.Label_remain = new cc.LabelBMFont("","res/font/font_res_phz2.fnt");
            //this.Label_remain.x = this.fapai.width/2;
            //this.Label_remain.y = this.fapai.height/2+7;
            //this.fapai.addChild(this.Label_remain);
            this.Button_7 = this.getWidget("Button_7");//退出房间
            this.Button_6 = this.getWidget("Button_6");//解散房间
            UITools.addClickEvent(this.Button_7,this,this.onLeave);
            UITools.addClickEvent(this.Button_6,this,this.onBreak);
            //this.battery = this.getWidget("battery");//电量
        } else {
            //this.battery = new cc.Sprite("res/res_phz/pp/power.png");//this.getWidget("battery");//电量
            //this.battery.anchorX = 0;
            //this.battery.x = 5;
            //this.battery.y = 16;
            //this.getWidget("batteryBg").addChild(this.battery);
        }

        this.getWidget("label_version").setString(SyVersion.v);
        this.Label_batteryPer = this.getWidget("Label_batteryPer");
        this.roomName_label = new cc.LabelTTF("","Arial",36,cc.size(0, 0));
        this.Panel_20.addChild(this.roomName_label);

        this.roomName_label.setString(PHZRoomModel.roomName || "");
        this.roomName_label.setColor(cc.color(255, 255, 255));
        this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.roomName_label.x = 960;
        this.roomName_label.y = cc.winSize.height / 2 + 310;

        this.battery = new cc.Sprite("res/res_phz/tx_battery_full.png");//this.getWidget("battery");//电量
        this.battery.anchorX = 0;
        this.battery.x = 8;
        this.battery.y = 18.5;
        this.getWidget("batteryBg").addChild(this.battery);
        this.Label_jushu = this.getWidget("Label_jushu");
        this.Label_fh = this.getWidget("Label_fh");
        this.label_payType = this.getWidget("Label_payType");
        this.lable_GameName = this.getWidget("Label_gameName");
        this.lable_renshu = this.getWidget("Label_renshu");
        this.Label_11 = this.getWidget("Label_11");//时间
        this.Button_75 = this.getWidget("Button_75");//设置
        this.Button_52 = this.getWidget("Button_52");//快捷聊天
        this.Button_53 = this.getWidget("Button_53");//语音

        this.Button_52.y =  400;
        this.Button_52.x = this.Button_53.x = (cc.winSize.width - SyConfig.DESIGN_WIDTH) /2 + 1834;

        this.Button_ready = this.getWidget("Button_ready");//准备
        this.Button_invite = this.getWidget("Button_invite");//邀请好友
        if(!(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName)){
            this.Button_invite.setScale(1.2);
        }
        //this.Button_sset = this.getWidget("Button_sset");//设置面板
        this.yuyin = this.getWidget("yuyin");//语音提示
        this.Image_hdx = this.getWidget("Image_hdx");//滑动出牌的线
        this.Image_hdx.visible = false;
        this.netType = this.getWidget("netType");//网络类型
        if((PHZRoomModel.renshu == 2 || PHZRoomModel.renshu == 3)){
            this.Button_qihu = this.getWidget("Button_qihu");
            this.Button_qihu.visible = false;
            UITools.addClickEvent(this.Button_qihu,this,this.sendQiHu);
        }

        

        // iphonex 防止刘海遮住弃牌和吃牌
        var disXForIphoneX  = 0;
        if (SdkUtil.isLiuHaiPin())
        {
            disXForIphoneX = 90;
        }
        if (PHZRoomModel.renshu != 4){
            this.getWidget("Panel_left").x = (SyConfig.DESIGN_WIDTH - cc.winSize.width)/2 +this.getWidget("Panel_left").x;
            this.getWidget("Panel_right").x = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 +this.getWidget("Panel_right").x;
            // this.getWidget("mPanel1").y = 400;
        }
        if (PHZRoomModel.renshu == 2){
            this.getWidget("oPanel1").x =   (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 + SyConfig.DESIGN_WIDTH - disXForIphoneX;
            this.getWidget("oPanel2").x += (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2;
            this.getWidget("sPanel2").x += (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2;
            this.getWidget("mPanel2").x += (SyConfig.DESIGN_WIDTH -cc.winSize.width)/2;
            if(PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                this.btnPanel.x += (cc.winSize.width - SyConfig.DESIGN_WIDTH) / 2;
                this.getWidget("Panel_btn").x += (cc.winSize.width - SyConfig.DESIGN_WIDTH) / 2;
            }
        }else if (PHZRoomModel.renshu == 3){
            this.getWidget("oPanel1").x =  this.getWidget("oPanel2").x = this.getWidget("sPanel2").x
            = this.getWidget("mPanel2").x = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 + SyConfig.DESIGN_WIDTH - disXForIphoneX;
            this.getWidget("oPanel3").x = this.getWidget("sPanel3").x = this.getWidget("mPanel3").x = (SyConfig.DESIGN_WIDTH -cc.winSize.width)/2 + disXForIphoneX;
        }


        this.Panel_daniao = this.getWidget("Panel_daniao");//打鸟panel
        this.Panel_daniao.visible = false;
        this.Button_bdn = this.getWidget("Button_bdn");//不打鸟按钮
        this.Button_bdn.temp = 0;
        this.Button_dn20 = this.getWidget("Button_dn20");//打鸟20分按钮
        this.Button_dn20.temp = 20;
        this.Button_dn50 = this.getWidget("Button_dn50");//打鸟50分
        this.Button_dn50.temp = 50;
        this.Button_dn100 = this.getWidget("Button_dn100");//打鸟100分
        this.Button_dn100.temp = 100;
        this.Button_dn = this.getWidget("Button_dn");//打鸟按钮
        this.Button_dn.temp = 1;


        UITools.addClickEvent(this.Button_bdn,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn20,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn50,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn100,this,this.onDaNiao);
        UITools.addClickEvent(this.Button_dn,this,this.onDaNiao);


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
        this.Button_p5f = this.getWidget("Button_p5f");//飘5分
        this.Button_p5f.temp = 5;
        UITools.addClickEvent(this.Button_bp,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p1f,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p2f,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p3f,this,this.onPiaoFen);
        UITools.addClickEvent(this.Button_p5f,this,this.onPiaoFen);

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

        this.addCustomEvent(SyEvent.PHZ_CLEAN_SPANEL , this,this.cleanSPanel);

        this.addCustomEvent(SyEvent.SHOW_TING_CARDS , this,this.onShowAllHuCards);
        this.addCustomEvent(SyEvent.DAPAI_TING,this,this.outCardTing);
        this.addCustomEvent(SyEvent.SHOW_TING,this,this.showTing);
        this.addCustomEvent("UPDATA_SHOUPAI",this,this.updateHands);

        this.addCustomEvent(SyEvent.BISAI_XIPAI , this,this.NeedXipai);
        this.addCustomEvent("XIPAI_CLEAR_NODE", this, this.clearXiPai);
        this.addCustomEvent("LDFPF_KAIJUXIPAI", this, this.showXiPaiBtn);
        this.addCustomEvent("LDFPF_FINISH_KAIJUXIPAI", this, this.FiNiShXiPai);
        /**
         * 湘乡告胡子添加打坨
         */
        this.addCustomEvent(SyEvent.XXGHZ_DATUO,this,this.ShowDatuo);
        this.addCustomEvent(SyEvent.XXGHZ_DATUO_STATE,this,this.UpdateDatuoState);

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
            recordBtn.visible = false;
        }
        //cc.log("phz selfRender 2")
        this.Button_53.visible = false;
        this.countDownLabel = new cc.LabelBMFont("15","res/res_phz/font_phz_countdown.fnt");
        this.countDownLabel.x = this.Image_time.width/2;
        this.countDownLabel.y = this.Image_time.height/2+8;
        this.Image_time.addChild(this.countDownLabel);

        //ccs.armatureDataManager.addArmatureFileInfo(
        //    "res/plist/finger0.png",
        //    "res/plist/finger0.plist",
        //    "res/plist/finger.ExportJson");
        //this.fingerArmature = new ccs.Armature("finger");
        //this.fingerArmature.x = 1100;
        //this.fingerArmature.y = 308;
        //this.root.addChild(this.fingerArmature,199);
        //this.fingerArmature.getAnimation().play("Animation2",-1,1);
        //this.fingerArmature.visible = false;

        this.Panel_tingPai = this.getWidget("Panel_tingPai");//听牌层

        this.Panel_shouzhi = this.getWidget("Panel_shouzhi");
        this.fingerAni();//创建手指动画
        this.Panel_shouzhi.visible = false;
        PHZRoomModel.mineRoot = this;

        // var Label_11 = 

        this.calcTime();
        this.calcWifi();
        this.scheduleUpdate();
        //cc.log("phzRoom selfRenderOver");

        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//取消托管按钮
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            this.bg_CancelTuoguan.setLocalZOrder(100);
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

        this.btn_Gps = this.getWidget("btn_Gps");
        if(SyConfig.HAS_GPS && PHZRoomModel.renshu > 2){
             this.btn_Gps.visible = false;
        }else{
             this.btn_Gps.visible = false;
        }
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

        this.jiesanBtn = this.getWidget("btn_jiesan");//解散房间
        UITools.addClickEvent(this.jiesanBtn ,this,this.onJieSan);

        if(PHZRoomModel.isMoneyRoom()){
            this.jiesanBtn.loadTextureNormal("res/res_phz/guize.png");
        }

        this.tuichuBtn = this.getWidget("btn_tuichu");//退出房间
        UITools.addClickEvent(this.tuichuBtn ,this,this.onTuiChu);

        this.jiesanBtn.visible = true;
        this.tuichuBtn.visible = false;

        this.initGameBtn();

        this.btn_Gps.visible = false;

        if (SdkUtil.isReview()){
            this.btn_Gps.visible = false;
        }
        this.Button_sort = this.getWidget("Button_sort");//更换手牌排序
        this.Button_sort.visible = false;
        this.Button_sort.scale = 0.9;
        UITools.addClickEvent(this.Button_sort ,this,this.onCardsort);

        this.initSetData();
        //IphoneX特殊操作
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

        
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF && PHZRoomModel.renshu == 2){
            this.panel_roomInfo = this.getWidget("Panel_roomInfo");
            this.panel_roomInfo.visible = false;
            var btn_roomInfo = this.getWidget("Button_roomInfo");
            UITools.addClickEvent(btn_roomInfo,this,function () {
                this.panel_roomInfo.visible = !this.panel_roomInfo.isVisible();
            })

            this.Panel_btn = this.getWidget("Panel_btn");
            this.Button_out = this.getWidget("Button_out");
            this.Button_out.temp = -1;
            this.Button_in = this.getWidget("Button_in");
            this.Button_in.temp = 1;
            this.Panel_btn.visible = false;
            UITools.addClickEvent(this.Button_in, this, this.onZkBtn);
            UITools.addClickEvent(this.Button_out, this, this.onZkBtn);
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF) {
                this.Button_out.x += (cc.winSize.width - SyConfig.DESIGN_WIDTH) / 2;
                this.Button_in.x += (cc.winSize.width - SyConfig.DESIGN_WIDTH) / 2;
            }
            this.btn_Gps.visible = false;
        }

        this.gmButton = new ccui.Button("res/res_phz/redPoint.png", "res/res_phz/red_dot.png", "");
        this.gmButton.setPosition(1890, 900);
        this.gmButton.scale = 1.7;
        this.gmButton.visible = false;
        this.addChild(this.gmButton);
        UITools.addClickEvent(this.gmButton, this, this.onGmButton);
        this.addCustomEvent(SyEvent.PHZ_REFRESH_GM_DATA, this, this.refreshGmData)
    },
    //显示听牌内容
    onGmButton: function () {
        // 听牌的底
        if (!this.gmBgImg) {
            var gmBg = cc.spriteFrameCache.getSpriteFrame("cards_listencard_di_tingpai.png");
            var gmBgImg = this.gmBgImg = new cc.Scale9Sprite(gmBg, null, cc.rect(5, 5, 165, 45));
            gmBgImg.anchorX = 1;
            gmBgImg.anchorY = 1;
            gmBgImg.x = 1880;
            gmBgImg.y = 950;
            gmBgImg.width = 930;
            gmBgImg.height = 300;
            this.addChild(gmBgImg, 999);
        } else {
            this.gmBgImg.visible = !this.gmBgImg.visible;
        }
        if (PHZRoomModel.getGmChoiceCard()) {
            this.showGmChoiceCard(PHZRoomModel.getGmChoiceCard());
        }
    },

    refreshGmData: function () {
        if (!this.gmBgImg) {
            var gmBg = cc.spriteFrameCache.getSpriteFrame("cards_listencard_di_tingpai.png");
            var gmBgImg = this.gmBgImg = new cc.Scale9Sprite(gmBg, null, cc.rect(5, 5, 165, 45));
            gmBgImg.anchorX = 1;
            gmBgImg.anchorY = 1;
            gmBgImg.x = 1880;
            gmBgImg.y = 950;
            gmBgImg.width = 930;
            gmBgImg.height = 300;
            this.addChild(gmBgImg, 999);
            this.gmBgImg.visible = false;
        }
        this.gmBgImg.removeAllChildren();
        this.gmChoiceCard = null;
        var tipLabel = new cc.LabelTTF("选中的牌", "Arial", 60);
        tipLabel.setFontSize(32);
        tipLabel.setPosition(cc.p(510, 38))
        this.gmBgImg.addChild(tipLabel);
        if (PHZRoomModel.getGmChoiceCard()) {
            this.showGmChoiceCard(PHZRoomModel.getGmChoiceCard());
        }
        var sendButton = new ccui.Button("res/ui/common/btn_confirm.png", "res/ui/common/btn_confirm.png", "");
        sendButton.scale = 0.7;
        sendButton.setPosition(cc.p(795, 38));
        sendButton.visible = false;
        UITools.addClickEvent(sendButton, this, this.OngmSendButoon)
        this.gmBgImg.addChild(sendButton);
        var paiIdList = PHZRoomModel.getGmData();
        this.gmBtnArr = [];
        if (paiIdList && paiIdList.length > 0) {
            //听牌的字
            for (var j = 1; j < 21; j++) {
                var id = j > 10 ? j - 10 : j;
                var size = j > 10 ? "b" : "s";
                var listencardPath = "res/res_phz/gmBtns/cards_listencard_" + id + size + ".png";
                var x = Math.floor((j - 1) % 10) * 90 + 60;
                var y = -Math.floor((j - 1) / 10) * 105 + 180 + 75;
                var paiButton = new ccui.Button(listencardPath, listencardPath, "");
                paiButton.id = id;
                paiButton.size = size;
                paiButton.num = 0;
                paiButton.x = x;
                paiButton.y = y;
                var numLabel = new cc.LabelTTF("0", "Arial", 50);
                numLabel.setName("numLabel")
                numLabel.setFontSize(26);
                numLabel.setPosition(cc.p(30, -15))
                paiButton.addChild(numLabel);
                UITools.addClickEvent(paiButton, this, this.onGmPaiButoon)
                this.gmBgImg.addChild(paiButton);
                this.gmBtnArr.push(paiButton);
            }
            // cc.log("paiIdList =", JSON.stringify(paiIdList));
            // 
            for (var i = 0; i < paiIdList.length; i++) {
                var id = paiIdList[i].n;
                var size = paiIdList[i].v > 100 ? "b" : "s";
                for (let k = 0; k < this.gmBtnArr.length; k++) {
                    if (id == this.gmBtnArr[k].id && size == this.gmBtnArr[k].size) {
                        this.gmBtnArr[k].num += 1;
                        this.gmBtnArr[k].getChildByName("numLabel").setString(this.gmBtnArr[k].num);
                    }
                }
            }
        }
    },

    showGmChoiceCard: function (paiVo) {
        // cc.log("paiVo =", JSON.stringify(paiVo));
        var id = paiVo.n;
        var size = paiVo.v > 100 ? "b" : "s";
        var cardPath = "res/res_phz/gmBtns/cards_listencard_" + id + size + ".png";
        cc.log("cardPath =", JSON.stringify(cardPath));
        if (!this.gmChoiceCard) {
            this.gmChoiceCard = new cc.Sprite(cardPath);
            this.gmChoiceCard.setPosition(cc.p(645, 38));
            this.gmChoiceCard.id = paiVo.c;
            this.gmBgImg.addChild(this.gmChoiceCard);
        } else {
            this.gmChoiceCard.id = paiVo.c;
            this.gmChoiceCard.setTexture(cardPath);
        }
    },

    OngmSendButoon: function () {
        if (!this.gmChoiceCard) {
            FloatLabelUtil.comText("请选择一张牌");
        } else {
            sySocket.sendComReqMsg(610, [this.gmChoiceCard.id]);
        }
    },

    onGmPaiButoon: function (obj) {
        if (obj.num == 0) {
            return;
        }
        var paivo = null;
        var paiIdList = PHZRoomModel.getGmData();
        for (var i = 0; i < paiIdList.length; i++) {
            var id = paiIdList[i].n;
            var size = paiIdList[i].v > 100 ? "b" : "s";
            if (id == obj.id && size == obj.size) {
                paivo = paiIdList[i];
            }
        }
        if (paivo){
            this.showGmChoiceCard(paivo)
            this.OngmSendButoon();
        }
    },

    onZkBtn: function (obj) {
        var temp = obj.temp;
        this.Panel_btn.visible = temp == -1;
        this.Button_out.visible = temp == 1;
        this.Button_in.visible = temp == -1;
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
        //params[0]=玩家id
        //params[1]=打坨倍数的值
        var userId = params[0];
        var p = PHZRoomModel.getPlayerVo(userId);
        if (p.seat == PHZRoomModel.mySeat){
            this.Panel_datuo.visible = false;
        }
        this._players[p.seat].showDaTuoImg(params[1]);
    },

    //微信邀请按钮统一换资源，增加亲友圈邀请按钮
    adjustInviteBtn:function(){
        var img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";
        var btn_wx_invite = this.getWidget("Button_invite");
        btn_wx_invite.visible = false;
        btn_wx_invite.loadTextureNormal(img_wx);

        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.roomName) {
            var offsetX = 400;
            this.btn_qyq_back = new ccui.Button(img_back, "", "");
            this.btn_qyq_back.setPosition(btn_wx_invite.width / 2 - 2 * offsetX, btn_wx_invite.height / 2);
            UITools.addClickEvent(this.btn_qyq_back, this, this.onBackToPyqHall);
            // btn_wx_invite.addChild(this.btn_qyq_back);

            if(BaseRoomModel.curRoomData.strParams[4] == 1){
                img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
            }
            this.btn_qyq_invite = new ccui.Button(img_qyq, "", "");
            this.btn_qyq_invite.visible = ClickClubModel.getIsForbidInvite();
            // this.btn_qyq_invite.setPosition(btn_wx_invite.width / 2 - offsetX, btn_wx_invite.height / 2);
            this.btn_qyq_invite.setPosition(btn_wx_invite.x, btn_wx_invite.y);
            UITools.addClickEvent(this.btn_qyq_invite, this, this.onShowInviteList);
            // this.root.addChild(this.btn_qyq_invite);

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
        //其他3人手上的牌
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
        // cc.log("StartPiaoFen::"+JSON.stringify(params));
        var self = this;
        setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
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
        var userId = params[0];
        var p = PHZRoomModel.getPlayerVo(userId)
        this._players[p.seat].hideDaNiaoType();
        if (p.seat == PHZRoomModel.mySeat){
            this.Panel_piaofen.visible = false;    
        }
        this._players[p.seat].showPiaoFenImg(params[1])
    },
    showPiaoFenPanel:function (type) {
        // cc.log("type = ",type);
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
            type = type+1;
        }
        this.tuichuBtn.visible = false;
        this.Panel_piaofen.visible = true;
        var resStr = "res/res_phz/phzRoom/3fen.png";
        this.Button_p3f.temp = 3;
        if (type==2){//飘1/2/3
            this.Button_p1f.visible = true;
            this.Button_p2f.x = 678;
            this.Button_p3f.x = 1020;
            this.Button_p5f.visible = false;
            if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                resStr = "res/res_phz/phzRoom/4fen.png";
                this.Button_p3f.temp = 4;
            }

        }else if (type==3) {//飘2/3/5
            this.Button_p1f.visible = false;
            this.Button_p2f.x = 345;
            this.Button_p3f.x = 678;
            this.Button_p5f.visible = true;
        }
        this.Button_p3f.loadTextures(resStr,"","");

    },
    onPiaoFen:function(obj){
        //飘分
        var temp = obj.temp;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            sySocket.sendComReqMsg(201,[temp]);
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
            sySocket.sendComReqMsg(2030,[temp]);
        }else{
            sySocket.sendComReqMsg(2015,[temp]);
        }
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

    onWHZPiaoFen:function(){
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
        }
        this.piaofenTime = setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
            this.showPiaoFenPanel(PHZRoomModel.intParams[12] + 1);
        }.bind(this),100);
    },

    onWHZSelectPiaoFen:function(event){
        var msg = event.getUserData();
        if(this._players[msg.params[0]]){
            this._players[msg.params[0]].showPiaoFenImg(msg.params[1]);
        }
        if(msg.params[0] == PHZRoomModel.mySeat){
            this.Panel_piaofen.visible = false;
            this.showWaitSelectPiao(true);
        }
    },

    StartDaNiao:function(message){
        var params = message.getUserData().params;
        var self = this;
        setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
            //其他3人手上的牌
            for(var i=1;i<=PHZRoomModel.renshu;i++){
                var mjp = self._players[i];
                if(mjp){
                    mjp.startGame();
                    mjp.showDaNiaoType();
                } 
            }
            // self._players[PHZRoomModel.mySeat].showDaNiaoType();
            self.showDaNiaoPanel(params[0]);
        },100); 
    },
    showDaNiaoPanel:function (type) {
        this.tuichuBtn.visible = false;
        this.Panel_daniao.visible = true;
        if (type==1 || type==2){//胡息打鸟
            this.Button_dn.visible = true;
            this.Button_dn20.visible = false;
            this.Button_dn50.visible = false;
            this.Button_dn100.visible = false;
            this.Button_bdn.x = 160;
        }else if (type==3) {//局内打鸟
            this.Button_dn.visible = false;
            this.Button_dn20.visible = true;
            this.Button_dn50.visible = true;
            this.Button_dn100.visible = true;
            this.Button_bdn.x = 26;
        }
    },
    FinishDaNiao:function(event){
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
        // cc.log("params",params);
        var userId = params[0];
        var p = PHZRoomModel.getPlayerVo(userId)
        this._players[p.seat].hideDaNiaoType();
        if (p.seat == PHZRoomModel.mySeat){
            this.Panel_daniao.visible = false;    
        }
        if(params[1]> 0)
            this._players[p.seat].showDaNiaoImg( )

    },
    // ReportDaNiao:function(event){
    //     var message = event.getUserData();
    //     var params = message.params;
    //     // cc.log("params",params);
    //     var userId = params[0];
    //     var type = params[1];
    //     var p = PHZRoomModel.getPlayerVo(userId)
    //     this._players[p.seat].hideDaNiaoType();
    //     if (params[2] && params[2] != 0){
    //         this._players[p.seat].showDaNiaoImg()
    //     }else{
    //         this._players[p.seat].hideDaNiaoImg()
    //     }
    // },
    sendQiHu:function() {
        AlertPop.show("是否弃胡，弃胡后将不可胡牌",function(){
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
        //打鸟
        // 传给服务器数据 [a,b]
        // a 胡息打鸟 分数打鸟 0 不打 1打 b 局内打鸟分数
        var temp = obj.temp;
        // if (temp == 1 ){// 胡息打鸟 分数打鸟 选择打鸟
            sySocket.sendComReqMsg(2032,[temp]);
        // }else if (temp == 0 ){// 选择不打鸟 全部传0
        //     sySocket.sendComReqMsg(2032,[0,0]);
        // }else {// 局内打鸟 选择分数
        //     sySocket.sendComReqMsg(2032,[0,temp]);
        // }
    },
    /**
     * 点击取消托管
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
                cc.log("!!!!!!!未获取到player");
            }
            if(seat == PHZRoomModel.mySeat && this.bg_CancelTuoguan){
                if (isTuoguan){
                    // this.delayLetOut(seat,0,[11]);
                    this.showTuoGuanTimeOutHandle = setTimeout(function(){//延时显示取消托管
                        self.bg_CancelTuoguan.visible = isTuoguan;
                    },1500);
                }else{
                    self.bg_CancelTuoguan.visible = isTuoguan;
                }
            }
        }
    },
    //处理手牌数据
    checkTingList:function(isTrue) {
        //return;
        cc.log("checkTingList===============>")
        if (PHZRoomModel.nextSeat == PHZRoomModel.mySeat || isTrue){
            var voArray = ArrayUtil.clone(this.getcheckHuIdArr());
            var sourceArray = ArrayUtil.clone(PHZMineLayout.getCurVoArray());
            var arr = [];
            //筛选出重复的牌
            var needCheckArray = [];
            for(var i=0;i<sourceArray.length;i++){
                if (sourceArray[i]) {
                    arr.push(sourceArray[i].v);
                }
            }
            //获取需要便利的手牌
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
            //获取自己的手牌中可听牌的列表
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
            //显示听牌列表
            if (PHZMineLayout){
                var arr = PHZMineLayout.cards;
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
        var arr = PHZMineLayout.cards;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i]._cardVo){
                arr[i]._cardVo.isTing = false;
            }
            arr[i].showTingImg(false);
        }
    },

    //处理手牌数据
    dealCardData:function(event) {
        var data = event.getUserData();
        var sourceArray = ArrayUtil.clone(PHZMineLayout.getCurVoArray());
        for(var j=0;j<sourceArray.length;j++){
            if (data.c == sourceArray[j].c){
                sourceArray.splice(j, 1);
                break;
            }
        }
        //cc.log("sourceArray============"+JSON.stringify(sourceArray));
        this.checkHu(sourceArray);
    },

    //获取需要遍历的牌数组
    getcheckHuIdArr:function() {
        var checkIdArr = [];
        var allOutArr = [];
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            //获取已经碰吃的牌
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
        //获取自己的手牌
        if (PHZMineLayout){
            var arr = PHZMineLayout.getHandCardData();
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

    /** 获得检测的牌是否自己已经碰或者偎了
     * return 返回当前检测的牌和自己碰的牌
     */
    getPaoTiCards:function(cards) {
        var cardArr = null;
        //获取已经碰吃的牌
        if (this.layouts && this.layouts[1]) {
            var arr = this.layouts[1].getPlace2Data();
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    var innerObject = arr[i];
                    if( innerObject.action==PHZAction.WEI || innerObject.action==PHZAction.PENG){
                        if (cards.v == innerObject.cards[0].v) {
                            this.isSelfMo = false;
                            //自己自摸并且是wei
                            //cc.log("this.lastLetOutSeat..",this.lastLetOutSeat)
                            //cc.log("PHZRoomModel.mySeat..",PHZRoomModel.mySeat)
                            //cc.log("innerObject.action..",innerObject.action)
                            if (this.lastLetOutSeat == PHZRoomModel.mySeat && innerObject.action==PHZAction.WEI){
                                this.isSelfMo = true;
                            }
                            if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ && PHZRoomModel.nextSeat == PHZRoomModel.mySeat && innerObject.action==PHZAction.WEI){
                                this.isSelfMo = true;
                            }
                            if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ && PHZRoomModel.nextSeat == PHZRoomModel.mySeat && innerObject.action==PHZAction.WEI){
                                this.isSelfMo = true;
                            }
                            //减去当前操作的牌的胡息
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
     * 参数1需要检测的牌
     * 参数2手牌
     * 参数3是不是跑胡
     * **/
    getHuList:function(_voArray,_handCards,_isPaoHu,_tingCards) {
        var repeatCheckArr = []; //跑提等动作需要重新检测(包括桌面上和手上组成跑提的)
        var outCardHuxi = PHZRoomModel.myOutHuxi;
        //cc.log("outCardHuxi..   ",outCardHuxi)
        var needDui = false;
        var isPaoHu = _isPaoHu;
        //检测桌面上有没有跑湖人提
        if (this.layouts[1]){
            needDui = this.layouts[1].isPaoTi();
        }

        for(var i=0;i<_voArray.length;i++){ 
            this.isSelfMo = true;
            var isNeedDui = needDui;
            var tools = new PaohuziTool();
            var sourceArray = ArrayUtil.clone(_handCards);
            //加入检测的这张牌 是否和桌面上的牌 组成跑 提
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
            //手上有4个的
            var index3 = arr.getPaohzCardIndex(3);
            if (index3 != null) {
                var checkLength = 0;
                if (!isPaoHu){
                    checkLength = 1;  //不是跑胡需要排除包括检测的这张牌的跑提
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
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                qihuHuxi = PHZRoomModel.intParams[13];
                isTingPaiNoHuxi = PHZRoomModel.intParams[28]==1;
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
                qihuHuxi = PHZRoomModel.intParams[11] == 2?6:PHZRoomModel.intParams[11]==3?3:9;
                isTingPaiNoHuxi = PHZRoomModel.intParams[16]==1;
            } 
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
                isTingPaiNoHuxi = PHZRoomModel.intParams[11]==0;
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
                qihuHuxi = PHZRoomModel.intParams[21];
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
                isTingPaiNoHuxi = PHZRoomModel.intParams[15]==1;
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ){
                qihuHuxi = 15;
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
                qihuHuxi = 15;
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ){
                qihuHuxi = PHZRoomModel.intParams[30];
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
                qihuHuxi = PHZRoomModel.intParams[30];
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                qihuHuxi = PHZRoomModel.intParams[41];
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ){
                qihuHuxi = PHZRoomModel.intParams[30];
            }
             if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
                qihuHuxi = 6;
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ){
                qihuHuxi = PHZRoomModel.intParams[30];
            }
            if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ || PHZRoomModel.wanfa==GameTypeEunmZP.CDPHZ){
                qihuHuxi = 15;
            }

            if (PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ){
                qihuHuxi = 15;
            }
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
    //获得自己手牌和吃碰牌中红牌的数量
    getRedCardsNum:function(){  
        var redCardsNum = 0;
        //吃碰牌
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

        var handCards = PHZMineLayout.getCurVoArray();
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
    //检测胡牌
    checkHu:function(handCards,voArray,tingCards) {
        if (PHZSetModel.kqtp && PHZRoomModel.wanfa != GameTypeEunmZP.WHZ && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ
            && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP
            && PHZRoomModel.wanfa != GameTypeEunmZP.HHHGW && PHZRoomModel.wanfa != GameTypeEunmZP.AXWMQ){
            this.huList = [];
            if (voArray){
                this.getHuList(voArray,handCards,true,tingCards);
            }else{
                var voArray = ArrayUtil.clone(this.getcheckHuIdArr());
                this.getHuList(voArray,handCards,true);
                this.showTingPai(this.huList);
            }
        }
    },

    //清除听牌层
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
        //cc.log("huList showTing=",JSON.stringify(huList));
        this.showTingPai(huList);
    },
    //出哪些牌可以听哪些牌
    outCardTing:function(event){
        if(PlayPHZMessageSeq.sequenceArray.length > 0){//如果打牌消息还没播完，延时处理显示打牌听牌消息
            cc.log("=========outCardTing======delay=====");
            this.delayOutCardTingData = event;
            return;
        }

        var data = event.getUserData();
        var info = data.info;
        // cc.log("info",JSON.stringify(info));
        PHZMineLayout.outCardTingPai(info);
        this.outTingInfo = info;
        this.CanClealTingImg = false;
    },

    //显示听牌内容
    showTingPai:function(huList){
         // cc.log("huList =",JSON.stringify(huList));
        if (huList && huList.length > 0 ){
            this.cleanTingPanel();
            this.Panel_tingPai.visible = true;
            var tingBgImgHeight = 85;
            var diffHeight = 75;
            tingBgImgHeight = Math.floor((huList.length-1)/3)*diffHeight + tingBgImgHeight;

            //听牌的底
            var tingBg = cc.spriteFrameCache.getSpriteFrame("cards_listencard_di_tingpai.png");
            var tingBgImg = new cc.Scale9Sprite(tingBg,null,cc.rect(5,5,165,45));
            tingBgImg.anchorX= 0.5;
            tingBgImg.anchorY= 0.5;
            var disXForIphoneX = 0;
            if (SdkUtil.isLiuHaiPin()) {
                disXForIphoneX = 90;
            }
            tingBgImg.x = 0 - (cc.winSize.width - SyConfig.DESIGN_WIDTH) / 2 + disXForIphoneX;
            // tingBgImg.x = 210 ;
            tingBgImg.y = 50;
            tingBgImg.width = 250;
            tingBgImg.height = tingBgImgHeight;
            this.Panel_tingPai.addChild(tingBgImg);

            //听牌的图片
            var tingImg = new cc.Sprite("#cards_listencard_zi_tingpai.png");
            //tingImg.x = 50;
            tingImg.anchorY= 0;
            tingImg.x = tingBgImg.width*0.5;
            tingImg.y = tingBgImgHeight + 5;
            tingBgImg.addChild(tingImg);

            //听牌的字
            for(var j=0;j<huList.length;j++){
                if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ || PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW
                    || PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ) {
                    var id = huList[j] % 10 == 0 ? 10 : huList[j] % 10;
                    var size = huList[j] > 40 ? "b" : "s";
                }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                    var id = huList[j] % 10 == 0 ? 10 : huList[j] % 10;
                    var size = huList[j] > 40 ? "b" : "s";
                    if(huList[j] > 80){
                        id = huList[j];
                    }
                }else if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                    var cardVo = PHZAI.getPHZByVal(huList[j]);
                    var id = cardVo.n;
                    var size = cardVo.v > 100 ? "b":"s";
                } else{
                    var id = huList[j].n;
                    var size = huList[j].v > 100 ? "b":"s";
                }
                var listencardPath = "#cards_listencard_"+id+size+".png";
                var x = Math.floor(j%3)*75 + 50;
                var y = -Math.floor(j/3)*72 + tingBgImgHeight - 45;
                var paiImg = new cc.Sprite(listencardPath);
                paiImg.x = x;
                paiImg.y = y;
                tingBgImg.addChild(paiImg);
            }
        }else{
            this.Panel_tingPai.visible = false;
        }
    },

    //开局动画
    fingerAni:function(){
        var tishi = new cc.Sprite("res/res_phz/img_shouzi1.png");
        tishi.x = 115;
        tishi.y = 175;
        // tishi.scale = 0.6;
        this.Panel_shouzhi.addChild(tishi, 1);

        var jiantou = new cc.Sprite("res/res_phz/img_shouzi3.png");
        jiantou.x = 100;
        jiantou.y = 100;
        // jiantou.scale = 0.6;
        this.Panel_shouzhi.addChild(jiantou, 1);
        var action = cc.sequence(cc.fadeTo(0.5,255),cc.delayTime(0.8),cc.fadeTo(0.5,50));
        jiantou.runAction(cc.repeatForever(action));

        var shouzi = new cc.Sprite("res/res_phz/img_shouzi2.png");
        shouzi.x = 62;
        shouzi.y = 25;
        // shouzi.scale = 0.6;
        jiantou.addChild(shouzi, 1);

        var action1 = cc.sequence(cc.moveBy(0.5,cc.p(75,65)),cc.delayTime(0.8),cc.moveBy(0.5,cc.p(-75,-65)));
        shouzi.runAction(cc.repeatForever(action1));
    },

    //开局动画
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
        //        AudioManager.play("res/res_phz/phzSound/fapai.mp3");
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
        if (PHZMineLayout){
            PHZMineLayout.onCardsort();
        }
        cc.log("点击手牌排序")
    },

    onJieSan:function(){
        if(PHZRoomModel.isMoneyRoom()){
            var pop = new ShowRulePop();
            pop.setLayerInfo(ClubRecallDetailModel.getSpecificWanfa(PHZRoomModel.intParams,0,1,true));
            PopupManager.addPopup(pop);
        }else{
            AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
                sySocket.sendComReqMsg(7);
            })
        }
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

    //标记 玩家已经显示了头像
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
     * sdk调用，当语音使用状态改变
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
     * 快捷聊天
     */
    onFastChat:function(event){
        var data = event.getUserData();
        var userId = data.userId;
        var p = PHZRoomModel.getPlayerVo(userId);
        this._players[p.seat].fastChat(data);
        // cc.log("phz onFastChat" ,userId , p.seat );
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
            this.battery.setTextureRect(cc.rect(0, 0, batteryNum, 22));
        } else {
            var batteryNum = Math.ceil(SdkUtil.getBatteryNum()/100*43);
            this.Label_batteryPer.setString(SdkUtil.getBatteryNum()+"%");
            this.battery.setTextureRect(cc.rect(0, 0, batteryNum, 22));
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
        if(seat == PHZRoomModel.mySeat){
            this.Button_ready.visible = false;
            this.tuichuBtn.x = 960;
            this.fapai.visible = this.Label_remain.visible = true;
        }
    },

    onOver:function(event){
        this.isShowReadyBtn = false;
        var data = event.getUserData();
        this.message = data;
        this.cleanTingPanel();
        PHZRoomModel.isChiBianDaBian = false;
        PHZRoomModel.nextSeat = 0;
        //消息队列还没播完，结算消息过来了，先缓存下来
        if(PlayPHZMessageSeq.sequenceArray.length>0){
            PlayPHZMessageSeq.cacheClosingMsg(data);
            return;
        }
        
        for(var index = 0 ; index < PHZRoomModel.renshu ; index ++){
            if(this._players[index]){
                this._players[index].playerQuanAnimation(false);
            }
        }

        this.refreshOptCardOnOver();

        if((PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ)
            && PHZRoomModel.intParams[5] == 1){//翻醒效果
            var xingId = ClosingInfoModel.ext[9];
            PHZRoomEffects.showZhuangLastCard(this.getWidget("cpZhuangLastCard"),PHZAI.getPHZDef(xingId));
        }

        var addTime = 0;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            // cc.log("ClosingInfoModel.ext[25] =",JSON.stringify(ClosingInfoModel.ext[25]));
            if(ClosingInfoModel.ext[25] > 0){
                var strArr = ClosingInfoModel.ext[25] + "," + ClosingInfoModel.ext[27];
                var valArr = PHZRoomModel.getCardsByString(strArr);
                addTime = valArr.length * 600 + (valArr.length + ClosingInfoModel.leftCards.length) * 120;
                var localIndex = 0;
                this.scheduleOnce(function(){
                    PHZRoomSound.actionSound(PHZPlayer.userId,"fanxing");
                },0.5);
                var label = UICtor.cLabel("",32,cc.size(200,200),cc.color(38,218,230),1,1);
                label.setAnchorPoint(0,0.5);
                label.x = 180;
                label.y = 400;
                this.getWidget("cpZhuangLastCard").addChild(label);
                var num = 0;
                var numArr = PHZRoomModel.getCardsByString(ClosingInfoModel.ext[28]);
                var self = this;
                this.schedule(function(){
                    var vo = PHZAI.getPHZDef(valArr[localIndex]);
                    var kuang = PHZRoomEffects.createGLZPCard(self.getWidget("cpZhuangLastCard"),vo);
                    kuang.setPositionY(300);
                    if(PHZRoomModel.intParams[7] == 4){
                        kuang.setPositionX(-50);
                    }
                    var seq = cc.sequence(cc.spawn(cc.moveTo(0.2,kuang.x+20,400),
                        cc.callFunc(function(){
                            num += (numArr[localIndex] || 0);
                            label.setString((num%10) + " 醒");
                        })),
                        cc.delayTime(0.2),cc.fadeTo(0.1,255),cc.callFunc(function(){
                        ++localIndex;
                        if(localIndex == valArr.length){
                            label.setString((num%10) + " 醒  共"+ num + "醒");
                            self.showDipai(valArr);
                        }
                    }));
                    kuang.runAction(seq);
                },0.6 * valArr.length, valArr.length - 1,0.2);
            }
        }

        for(var i=0;i<data.length;i++){
            if(PHZRoomModel.wanfa==GameTypeEunmZP.SYZP){
                if(data[i].point == 0){
                    PHZRoomEffects.huangzhuang(this.root);
                    PHZRoomSound.actionSound(PlayerModel.userId,"huang");
                    break;
                }
            }else if(PHZRoomModel.wanfa==GameTypeEunmZP.SYBP){
                if(data[i].point < 0){
                    PHZRoomEffects.huangzhuang(this.root);
                    PHZRoomSound.actionSound(PlayerModel.userId,"huang");
                    break;
                }
            }else if(PHZRoomModel.wanfa==34 && ClosingInfoModel.fanTypes.length==0){
                if(data[i].point < 0){
                    PHZRoomEffects.huangzhuang(this.root);
                    PHZRoomSound.actionSound(PlayerModel.userId,"huang");
                    break;
                }
            }else if(PHZRoomModel.wanfa==36 && ClosingInfoModel.fanTypes.length==0){
                if(data[i].point == 0){
                    PHZRoomEffects.huangzhuang(this.root);
                    PHZRoomSound.actionSound(PlayerModel.userId,"huang");
                    break;
                }
            }else if(PHZRoomModel.wanfa==38 && ClosingInfoModel.fanTypes.length==0 && PHZRoomModel.remain==0){
                PHZRoomEffects.huangzhuang(this.root);
                PHZRoomSound.actionSound(PlayerModel.userId,"huang");
                break;
            }
        }
        this.btnPanel.visible = false;
        //this.cleanChuPai();
        this.Image_time.visible=false;
        //this.fingerArmature.visible=false;
        this.Panel_shouzhi.visible = false;

        //清理听牌的显示
        var self = this;
        var t = 1100;
        var t1 = 500;//延时展示其他玩家的剩余牌的时间
        PHZRoomModel.isStart = false;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){//暂时去掉手牌展示
            t = 2000 + addTime;
        }else{
            this.showSparePaiTimeOutHandle = setTimeout(function() {//延时展示其他玩家的剩余牌
                if (!PHZRoomModel.isStart){
                    if(PHZRoomModel.nowBurCount == ClosingInfoModel.ext[5]){
                        self.showSparePai(ClosingInfoModel);
                    }
                }
            },t1);
        }
        if ((PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ || PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK) && PHZRoomModel.intParams[10] == 2){
            PHZRoomEffects.chuPai(this.getWidget("cp"+1),PHZAI.getPHZDef(ClosingInfoModel.ext[25]),ClosingInfoModel.ext[25],PHZRoomModel.renshu,1,this.getWidget("oPanel"+1));
            // PHZRoomEffects.chuPai(this.getWidget("cp"+1),lastVo,p.outCardIds[0],PHZRoomModel.renshu,1,this.getWidget("oPanel"+1));
        }
        this.showResultTimeOutHandle = setTimeout(function(){//延迟弹出结算框
            self.isShowReadyBtn = true;
            for(var i=0;i<data.length;i++){
                if (self._players[data[i].seat]){
                    if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF) {
                        self._players[data[i].seat].updatePoint(data[i].allHuxi);
                    } else {
                        self._players[data[i].seat].updatePoint(data[i].totalPoint);
                    }
                    //self._players[data[i].seat].hidePiaoFenImg();
                    self._players[data[i].seat].hideQiHuImg();
                }
            }


            if (PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ) {
                var mc = new AXWMQSmallResultPop(data);
            } else {
                var mc = new PHZSmallResultPop(data);
            }
            self.cleanChuPai();
            self.cleanTingPanel();
            self.cleanSPanel();
            if(PHZRoomModel.nowBurCount == ClosingInfoModel.ext[5]){
                PHZMineLayout.clean();
                self.cleanomPanel();
            }
            //var mc = new PHZBigResultPop(data);
            PopupManager.addPopup(mc);

            PHZRoomEffects.cleanhuPai(self.root);
            var obj = HongBaoModel.getOneMsg();
            if(obj){
                var mc = new HongBaoPop(obj.type,obj.data);
                PopupManager.addPopup(mc);
            }
        },t);
    },

    showDipai:function(valArr){//桂林字牌显示底牌
        this.cleanChuPai();//清除出牌
        var self = this;
        var dipai = ClosingInfoModel.leftCards;
        ArrayUtil.merge(dipai,valArr);
        var localIndex = 0;
        this.schedule(function(){
            var vo = PHZAI.getPHZDef(valArr[localIndex]);
            var localX = (localIndex % 10 - 4.5) * 110;
            var localY = 200 - Math.floor(localIndex / 10) * 120;
            var kuang = PHZRoomEffects.createGLZPCard(self.getWidget("cpZhuangLastCard"),vo,dipai.indexOf(valArr[localIndex]) === -1);
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

    //落地扫和永州扯胡子结算时把倾和啸显示出来
    refreshOptCardOnOver:function(){
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
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
                    this.tuichuBtn.x = 670;
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
            this.tuichuBtn.x = 670;
            this.Button_ready.x = 1200;
        }
    },

    initData:function(){
        this.roomName_label.setString(PHZRoomModel.roomName);
        PHZRoomEffects.cleanhuPai(this.root);

        var wanfaStr = PHZRoomModel.getWanFaDesc();

        if(PHZRoomModel.isMatchRoom()){
            wanfaStr = wanfaStr.replace(/,.*支付/,"");
        }

        this.Label_info.setString(wanfaStr);
        sy.scene.hideLoading();
        //清除延时
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

        if (PopupManager.getClassByPopup(PHZSmallResultPop)) {
            PopupManager.removePopup(PHZSmallResultPop);
        }

        if(PHZRoomModel.isMoneyRoom()){
            for(var i = 1;i<=4;++i){
                var item = ccui.helper.seekWidgetByName(this.root,"player"+i);
                item && item.setVisible(false);
            }
        }

        this.Panel_piaofen.visible = false;
        this.showWaitSelectPiao(false);

        this.guoChiVals = [];
        this.lastLetOutMsg = null;

        //this.startGameAni();//测试动画
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
        this.lastMoPHZ = this.lastLetOutMJ = this.lastLetOutSeat = this.lastActType =  0;
        this.updateRoomInfo();
        this.initGameBtn();
        var players = PHZRoomModel.players;

        for(var k in this._players){
            this._players[k].clean();
        }

        this.axwmqShowDlz(PHZRoomModel.ext[2]);

        this._players = {};
        
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            //if(this.isShowReadyBtn){
                // this.getWidget("player"+i).visible = false;
                this.getWidget("oPanel"+i).removeAllChildren(true);
                this.getWidget("mPanel"+i).removeAllChildren(true);
                var layout = this.layouts[i];
                if(layout)//清理掉上一次的牌局数据
                    layout.clean();
            //}
        }
        if(GameTypeEunmZP.GLZP == PHZRoomModel.wanfa || GameTypeEunmZP.LSZP == PHZRoomModel.wanfa){
            this.getWidget("cpZhuangLastCard").removeAllChildren(true);
        }
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
        PHZMineLayout.setRoot(this.getWidget("minePanel"));
        if(!isContinue)
            PHZMineLayout.clean();
        this.btnPanel.visible = false;
        this.Button_ready.visible = true;
        this.fapai.visible = this.Label_remain.visible = false;
        this.setInviteBtnState();
        //得到最后一个人的出牌
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!isContinue){
            }else {//恢复牌局
                if(p.outCardIds.length>1) {//模拟最后一个人出牌
                    var lastId = p.outCardIds[1];
                    this.lastLetOutMJ = lastId;
                }
            }
        }
        var handCards = [];
        var isDaNiaoZhong = false;
        var isAllPlayerReady = true;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = PHZRoomModel.getPlayerSeq(p.userId, p.seat);
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF) {
                if (PHZRoomModel.intParams[34] != 0) {
                    // cc.log("p.ext[12] =",p.ext[12]);
                    if (p.ext[12] == -1) {
                        isDaNiaoZhong = true;
                    }
                }
            }
            if(!p.status){
                isAllPlayerReady = false;
            }
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = PHZRoomModel.getPlayerSeq(p.userId,p.seat);
            if (this._players[p.seat]){
                this._players[p.seat].hideQiHuImg();
            }

            var cardPlayer = this._players[p.seat] = new PHZPlayer(p,this.root,seq);
            cardPlayer.isShowFangZhao(p.ext[1]);
            // cc.log("p.ext[8] =",p.ext[8]);
            if(PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                if (p.seat == PHZRoomModel.mySeat) {
                    if (p.ext[13]) {
                        this.gmButton.visible = true;
                    }else{
                        this.gmButton.visible = false;
                    }
                }
                cc.log("isAllPlayerReady =",isAllPlayerReady);
                if(isAllPlayerReady){
                    if(PHZRoomModel.intParams[34]!=0){
                        // cc.log("p.ext[12] =",p.ext[12]);
                        if(p.ext[12] != -1){
                            cardPlayer.hideDaNiaoType();
                            cc.log("p.ext[12] =",p.ext[12]);
                            if (p.ext[12] > 0){
                                cardPlayer.showDaNiaoImg();
                            }
                            if (p.seat == PHZRoomModel.mySeat){
                                this.Panel_daniao.visible = false;
                                this.tuichuBtn.visible = false;
                            }
                        }else{
                            cardPlayer.showDaNiaoType("daniao");
                        }
                    }else{
                        cardPlayer.hideDaNiaoType();
                    }

                    if (PHZRoomModel.intParams[39] != 0) {
                        if(p.ext[14] > -1){
                            cardPlayer.hideDaNiaoType();
                            if (p.seat == PHZRoomModel.mySeat){
                                var xiPaiBtnNode = this.getChildByName("xiPaiBtnNode");
                                if (xiPaiBtnNode) {
                                    xiPaiBtnNode.removeFromParent(true);
                                    xiPaiBtnNode = null;
                                }
                                this.tuichuBtn.visible = false;
                            }
                        }else{
                            if (PHZRoomModel.intParams[34] != 0) {
                                if (p.ext[12] != -1) {
                                    // cc.log("isDaNiaoZhong =",isDaNiaoZhong);
                                    if (!isDaNiaoZhong)
                                        cardPlayer.showDaNiaoType("xipai");
                                }
                            }else{
                                if (!isDaNiaoZhong)
                                    cardPlayer.showDaNiaoType("xipai");
                            }
                        }
                    }
                }
                if(isContinue){
                    cardPlayer.hideDaNiaoType();
                }
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.CZZP) {
                // cc.log("p.ext[8] =",p.ext[8]);
                if (p.ext[8] != -1) {
                    if (p.ext[12] != -1) {
                        cardPlayer.showPiaoFenImg(p.ext[12]);
                        if (p.seat == PHZRoomModel.mySeat) {
                            this.tuichuBtn.visible = false;
                            this.Panel_piaofen.visible = false;
                        }
                    } else if (PHZRoomModel.intParams[18] != 1 && p.ext[12] == -1) {    
                        cardPlayer.showDaNiaoType();
                        if (p.seat == PHZRoomModel.mySeat)
                            this.showPiaoFenPanel(PHZRoomModel.intParams[18]);
                    } else {
                        if (p.seat == PHZRoomModel.mySeat)
                            this.Panel_piaofen.visible = false;
                        cardPlayer.hideDaNiaoType();
                    }
                }
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LSZP) {
                // cc.log("p.ext[8] =",p.ext[8]);
                if (PHZRoomModel.intParams[10] != 0) {
                    if (p.ext[4] != -1) {
                        cardPlayer.showPiaoFenImg(p.ext[4]);
                        if (p.seat == PHZRoomModel.mySeat) {
                            this.tuichuBtn.visible = false;
                            this.Panel_piaofen.visible = false;
                        }
                    } else{    
                        // cardPlayer.showDaNiaoType();
                        // if (p.seat == PHZRoomModel.mySeat)
                        //     this.showPiaoFenPanel(PHZRoomModel.intParams[10]);
                    }
                }
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                var point = -1;
                if(PHZRoomModel.intParams[12] > 0){
                    point = p.ext[8];
                }
                cardPlayer.showPiaoFenImg(point);
                if(!isContinue && p.seat == MJRoomModel.mySeat && point >= 0){
                    this.showWaitSelectPiao(true);
                }
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
                // cc.log("p.ext[13] = ",p.ext[13]);
                if (p.ext[13] == 1 && p.seat == PHZRoomModel.mySeat){
                    PHZRoomModel.isChiBianDaBian = true;
                }else if(p.seat == PHZRoomModel.mySeat){
                    PHZRoomModel.isChiBianDaBian = false;
                }
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
                // cc.log("p.ext[8] = ",p.ext[8]);
                if (p.ext[8] > -1){
                    cardPlayer.hideDaNiaoType();
                    cardPlayer.showChuiImg(p.ext[8]);
                    if (p.seat == PHZRoomModel.mySeat){
                        this.tuichuBtn.visible =false;
                        this.Panel_chui.visible = false;
                    }
                }else if(p.ext[8] == -1){
                    cardPlayer.showDaNiaoType();
                    if (p.seat == PHZRoomModel.mySeat){
                        this.showChuiPanel();
                    }
                } 
            }
            if(!isContinue){
                if(p.status && !p.ext[9])
                    cardPlayer.onReady();
            }else{//恢复牌局
                if ((PHZRoomModel.renshu == 2 || PHZRoomModel.renshu == 3) && PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                    if (p.seat == PHZRoomModel.mySeat){
                        if (this.Button_qihu){
                            this.Button_qihu.visible = true;
                        }
                        // cc.log("p.ext[13] =", p.ext[13]);
                        
                    }
                }
                
                // cc.log("p.ext[11] =",p.ext[11]);
                if (p.ext[11] && p.ext[11] == 1){//弃胡图片的显示
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
                //获得数醒方位
                if(PHZRoomModel.wanfa!=36 && PHZRoomModel.renshu==4 && p.ext[3]==p.seat
                    && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ){
                    cardPlayer.isShuXing(true);
                    if (p.ext[2] == PHZRoomModel.mySeat){
                        this.Button_sort.visible = false;
                    }
                }
                // cc.log("p.handCardIds =", JSON.stringify(p.handCardIds));
                // cc.log("p.handCardIds =", p.handCardIds.length);
                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.moldCards,banker,isMoPai,p.strExts);

                if(p.outCardIds.length>1){//模拟最后一个人出牌
                    var lastId = p.outCardIds[1];
                    var lastVo = PHZAI.getPHZDef(lastId);
                    var lastDirect = PHZRoomModel.getPlayerSeq(p.userId, p.seat);
                    this.lastLetOutMJ = lastId;
                    this.lastLetOutSeat = p.seat;
                    //this.layouts[lastDirect].chuPai(lastVo);
                    if (p.seat != PHZRoomModel.nextSeat){
                        PHZRoomEffects.chuPai(this.getWidget("cp"+lastDirect),lastVo,p.outCardIds[0],PHZRoomModel.renshu,lastDirect,this.getWidget("oPanel"+lastDirect));
                    }
                }
                // cc.log("p.shiZhongCard = ",p.shiZhongCard);
                if(p.shiZhongCard && p.shiZhongCard != 0){//模拟最后一个人出牌
                    var lastId = p.shiZhongCard;
                    var lastVo = PHZAI.getPHZDef(lastId);
                    var lastDirect = PHZRoomModel.getPlayerSeq(p.userId, p.seat);
                    if (p.seat != PHZRoomModel.nextSeat){
                        PHZRoomEffects.chuPai(this.getWidget("cp"+lastDirect),lastVo,lastId,PHZRoomModel.renshu,lastDirect,this.getWidget("oPanel"+lastDirect));
                    }
                }

                this.Button_sort.visible = true;
                // cc.log("p.recover =",JSON.stringify(p.recover));
                if(p.recover.length>0){//恢复牌局的状态重设
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        PHZRoomModel.banker = p.seat;
                        cardPlayer.isBanker(true);
                    }
                    if(p.recover.length>2 && p.userId==PlayerModel.userId){
                        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                            this.refreshButton(p.recover.splice(2));
                        }else{
                            this.refreshButton(p.recover.splice(2,7));
                        }
                    }
                }
                cardPlayer.startGame();
            }
            if (PHZRoomModel.isAutoPlay() && PHZRoomModel.getPlayerIsTuoguan(p)){
                cardPlayer.updateTuoguan(true)
            }
            if(p.userId ==PlayerModel.userId){//自己的状态处理
                this.guoChiVals = p.intExts;
                // cc.log("========guoChiVals===========" + this.guoChiVals);
                if(p.status){
                    this.tuichuBtn.x = 960;
                    this.Button_ready.visible = false;
                    if(isContinue)
                        this.fapai.visible = this.Label_remain.visible = true;
                }

                //判断是否需要显示 取消托管按钮
                if(this.bg_CancelTuoguan){
                    var isMeTuoguan = PHZRoomModel.getPlayerIsTuoguan(p);
                    cc.log("断线重连判断是否是托管状态..."  , isMeTuoguan);
                    this.bg_CancelTuoguan.visible = isMeTuoguan;
                }
            }
        }
        // cc.log("this._players[i] =",JSON.stringify(this._players));
        //转化成牌的格式
        var voArray = [];
        for(var i=0;i<handCards.length;i++){
            voArray.push(PHZAI.getPHZDef(handCards[i]));
        }
        if (voArray.length > 0 ){
            this.hideHandsTingImg();
            this.checkHu(voArray);
        }

        if(isContinue){
            if(PHZRoomModel.timeSeat)
                this.showJianTou(null,true);
            this.Button_invite.visible = false;
            // this.btn_qyq_invite.visible = false;
            PHZRoomModel.isStart = true;
        }
        //IP相同的显示
        if(players.length>1 && PHZRoomModel.renshu != 2){
            var seats = PHZRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }

        // this.getRedCardsNum();

        if(PHZRoomModel.isMoneyRoom()){
            this.moneyRoomInitData();
        }
    },

    moneyRoomInitData:function(){
        this.Button_invite.setVisible(false);
        this.Button_ready.setVisible(false);
        this.tuichuBtn.setVisible(false);

        var isShow = (PHZRoomModel.players.length<PHZRoomModel.renshu);
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
                this.imgTiket = new cc.Sprite("res/res_phz/gold_mp.png");
                this.imgTiket.setAnchorPoint(1,0.5);
                this.imgTiket.setPosition(cc.winSize.width,cc.winSize.height/6);
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

    //安乡偎麻雀显示逗溜子
    axwmqShowDlz:function(num){
        if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ
            && PHZRoomModel.intParams[6] > 0){
            if(!this.label_dlz){
                this.label_dlz = new ccui.Text("","res/font/bjdmj/fzcy.TTF",40);
                this.label_dlz.setPosition(cc.winSize.width/2,cc.winSize.height - 90);
                this.addChild(this.label_dlz,1);
            }
            this.label_dlz.setString("逗溜子:" + num);
        }else{
            this.label_dlz && this.label_dlz.removeFromParent();
        }
    },

    updateRemain:function(){
        if (PHZRoomModel.is4Ren()) {
            this.Label_remain.setString(""+PHZRoomModel.remain);
        } else {
            var remain = PHZRoomModel.remain;
            this.Label_remain.setString("剩余"+remain+"张");
            var paiDun = this.fapai.getChildrenCount();
            if (paiDun == 0 && remain > 0) {
                for (var i=0;i<remain;i++) {
                    var dun = new cc.Sprite("res/res_phz/card.png");
                    dun.x = this.fapai.width/2;
                    dun.y = 46+i*0.5
                    this.fapai.addChild(dun, 1, (this.tag_paidun+i));
                }
            } else {
                if (paiDun > remain) {
                    for (var i=paiDun;i>remain;i--) {
                        this.fapai.removeChildByTag((this.tag_paidun+(i-1)));
                    }
                }
            }
        }
    },

    updateRoomInfo:function(){
        if(this.label_payType){
            this.label_payType.setString("房主支付");
            if(PHZRoomModel.getCostFangShi() == 1){
                this.label_payType.setString("AA支付");
            }else if(PHZRoomModel.getCostFangShi() == 3){
                this.label_payType.setString("群主支付");
            }

            if(PHZRoomModel.isMoneyRoom()){
                this.label_payType.setString("");
            }
        }

        if(this.lable_GameName){
            if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
                this.lable_GameName.setString("邵阳剥皮");
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
                this.lable_GameName.setString("邵阳字牌")
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                this.lable_GameName.setString("娄底放炮罚")
            }
        }

        if(this.lable_renshu){
            this.lable_renshu.setString(PHZRoomModel.renshu + "人");
        }

        this.Label_fh.setString("房号:"+PHZRoomModel.tableId);

        this.Label_jushu.setString(csvhelper.strFormat("第{0}/{1}局",PHZRoomModel.nowBurCount,PHZRoomModel.totalBurCount));
        if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP || PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF || PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ){
            this.Label_jushu.setString("第"+PHZRoomModel.nowBurCount+"局");
        }

        if(PHZRoomModel.isMoneyRoom()){
            this.Label_jushu.setString("底分:" + PHZRoomModel.goldMsg[2]);
            this.Label_fh.setString("序号:"+PHZRoomModel.tableId);
        }

        this.updateRemain();
    },

    /**
     * 吃、碰、杠等操作的统一处理
     * @param obj
     * @param isAlert
     */
    onPengPai:function(obj,isAlert){
        //isAlert = isAlert || false;
        // this.kehushizhong = false;
        // obj.setTouchEnabled(false);
        // setTimeout(function () {
        //     if(obj && obj.isVisible()){
        //         obj.setTouchEnabled(true);
        //     }
        // }, 1000);

        var temp = obj.temp;
        switch (temp){
            case PHZAction.HU:
                PHZRoomModel.sendPlayCardMsg(temp,[]);
                break;
            case PHZAction.PENG:
                var isHu = obj.state;
                if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ)isHu = false;//落地扫不要确定弹窗
                if(isHu){
                    AlertPop.show("当前为可胡牌状态，确定要碰吗？",function(){
                        PHZRoomModel.sendPlayCardMsg(temp,[]);
                    },function(){});
                }else{
                    PHZRoomModel.sendPlayCardMsg(temp,[]);
                }
                break;
            case PHZAction.GUO:
                var guoParams = [this.lastLetOutMJ];
                ArrayUtil.merge(PHZRoomModel.selfAct,guoParams);
                var isHu = obj.state;
                var self = this;
                if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ)isHu = false;//落地扫不要确定弹窗
                if(isHu){
                    AlertPop.show("当前为可胡牌状态，确定要过吗？",function(){
                        if(PHZRoomModel.selfAct && PHZRoomModel.selfAct[4]){//过吃的牌值
                            self.guoChiVals.push(PHZAI.getPHZDef(self.lastLetOutMJ).v);
                        }
                        PHZRoomModel.sendPlayCardMsg(temp,guoParams);
                    },function(){});
                }else{
                    if(PHZRoomModel.selfAct && PHZRoomModel.selfAct[4]){//过吃的牌值
                        self.guoChiVals.push(PHZAI.getPHZDef(self.lastLetOutMJ).v);
                    }
                    PHZRoomModel.sendPlayCardMsg(temp,guoParams);
                }
                break;
            case PHZAction.CHI:
                var self = this;
                var isHu = obj.state;
                if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ)isHu = false;//落地扫不要确定弹窗
                if(isHu){
                    AlertPop.show("当前为可胡牌状态，确定要吃吗？",function(){
                        self.chooseChi()
                    },function(){});
                }else{
                    self.chooseChi()
                }
                break;
            case PHZAction.PAO:
                PHZRoomModel.sendPlayCardMsg(PHZAction.PAO,[this.lastLetOutMJ]);
                break;
            case PHZAction.WEI:
                PHZRoomModel.sendPlayCardMsg(PHZAction.WEI,[]);
                break;
            case PHZAction.TI:
                if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
                    //安乡偎麻雀可胡牌不胡选啫加息
                    AlertPop.show("当前可以胡牌，确定要下次胡牌吗？",function(){
                        PHZRoomModel.sendPlayCardMsg(4,[]);
                    },function(){});
                    return;
                }

                var result = this.getLiuCards();
                if(result.length > 1){
                    this.displayLiuSelect(result);
                }else{
                    var data = [];
                    for(var i = 0;i<result.length;++i){
                        for(var j = 0;j<result[i].length;++j){
                            data.push(result[i][j].c);
                            break;
                        }
                    }
                    PHZRoomModel.sendPlayCardMsg(PHZAction.TI,data);
                }
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                //落地扫的王闯等操作
                PHZRoomModel.sendPlayCardMsg(temp,[]);
                break;
        }
    },

    chooseChi:function(){
        if(this.btnPanel.getChildByTag(this.tag_chi_select))
            return;
        var sourceArray = PHZMineLayout.getCurVoArray();
        var lastMJ = PHZAI.getPHZDef(this.lastLetOutMJ);
        lastMJ.isChi=1;
        //把桌面上面的最后出的一张牌放到数组的第一个，保证第一次筛选就把它选进去
        sourceArray.unshift(lastMJ);
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) {
            var data = PHZAI.getChiNoFilter(sourceArray, lastMJ);
            data = this.checkGuoChi(data);
            var result = {selectTimes: 0, data: data};
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
            var data = PHZAI.getChiNoFilter(sourceArray, lastMJ);
            var result = {selectTimes: 0, data: data};
        }else{
            var result = PHZAI.getChi(sourceArray,lastMJ);
        }

        if(result.data.length>0){//吃的选择
            if (PHZSetModel.kscp && result.data.length == 1){
                this.getChiSelect(sourceArray,result.data,result.selectTimes,0);
            }else{
                this.displayChiSelect(sourceArray,result.data,result.selectTimes,0);
            }
        }
    },

    checkGuoChi:function(result){
        //把被吃的那张牌放第一个
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
     * 重置吃牌选择的显示
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
     * 显示选择吃的界面
     * @param cardsArray
     * @param result 筛选出来可以吃的id二维数组
     * @param needTimes 需要选择的次数
     * @param curTime 当前选择的次数
     */
    displayChiSelect:function(cardsArray,result,needTimes,curTime){
        if (curTime == 0){
            this.lastSelectChiBg =  {};
        }
        var width = 120+(result.length-1)*120;
        var bg = UICtor.cS9Img("res/res_phz/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,390));
        var initX = 25;
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
            innerbg.setScale9Enabled(true);
            innerbg.setContentSize(innerbg.width,innerbg.height + 20);
            innerbg.scale = 1.2;
            var clickbg = new UICtor.cImg("res/res_phz/chipai_click.png");
            clickbg.setScale9Enabled(true);
            clickbg.setContentSize(clickbg.width,clickbg.height + 20);
            clickbg.scale = 1.2;
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= false;
            var passArray = [];
            for(var j=0;j<array.length;j++){
                var phz = new PHZCard(PHZAI.getDisplayVo(1,2),array[j]);
                var scale = 1;
                // phz.scale=scale;
                phz.x = (innerbg.width-phz.width*scale)/2;
                phz.y = 10 + j * phz.height * scale;
                innerbg.addChild(phz);
                passArray.push(array[j].c);
            }
            clickbg.x = innerbg.width/2+initX+i*114;
            clickbg.y = bg.height/2-10;
            innerbg.x = innerbg.width/2+initX+i*114;
            innerbg.y = bg.height/2-10;
            bg.addChild(innerbg);
            var chiOrBiTex = curTime<1 ? "res/res_phz/chi-chi.png" : "res/res_phz/chi-bi.png";
            var chiOrBi = new cc.Sprite(chiOrBiTex);
            chiOrBi.x = innerbg.width/2;
            chiOrBi.y = bg.height-chiOrBi.height-90;
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
            if(this.btnPanel.getChildByTag(curTag+1))//删除当前比的下一层比框
                this.btnPanel.removeChildByTag((curTag+1),true);
                this.lastSelectChiBg[curTime] = null;
        }

        bg.x = preData ? preData.x-bg.width/2 : this.btnPanel.getChildByTag(this.tag_btn_chi).x+82; 
        bg.y = 360;
        this.temp_chi_data[curTime] = {x:bg.x-bg.width/2,tag:curTag,itemCount:result.length,itemObj:bg};
        this.btnPanel.addChild(bg,1,curTag);
        if (curTime == 1 && preData){
            bg.x = bg.x - 45;
        }

        if (curTime == 2 && preData){
            bg.x = bg.x + 45;
        }
        //特殊处理大于11个吃选择的情况
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
                        data.itemObj.x = this.btnPanel.getChildByTag(this.tag_btn_chi).x+82;
                    }else{
                        var data2 = this.temp_chi_data[i - 1];
                        data.itemObj.x = data2.x - data.itemObj.width/2;
                        //test
                        if (i == 1){
                            bg.x = data2.x - data.itemObj.width/2 -45;
                        }
                    }
                    data.itemObj.x = data.itemObj.x + 170;
                }
            }
        }else{
            for(var i=0;i<= curTime ;i++){
                var data = this.temp_chi_data[i];
                if (data && data.itemObj){
                    if ( i == 0){
                        data.itemObj.x = this.btnPanel.getChildByTag(this.tag_btn_chi).x+82;
                    }else{
                        var data2 = this.temp_chi_data[i - 1];
                        data.itemObj.x = data2.x - data.itemObj.width/2;
                        //test
                        if (i == 1){
                            bg.x = data2.x - data.itemObj.width/2 -45;
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

        var handCards = PHZMineLayout.cards;
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
        var bg = UICtor.cS9Img("res/res_phz/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,260));
        var initX = (bg.width-65*result.length-(result.length-1)*5)/2;

        for(var i=0;i<result.length;i++){
            var array = result[i];

            var innerbg = new UICtor.cS9Img("res/res_phz/chipai_single.png",cc.rect(15,50,15,50),cc.size(57,240));
            innerbg.setTouchEnabled(true);

            var clickbg = new UICtor.cS9Img("res/res_phz/chipai_click.png",cc.rect(15,50,15,50),cc.size(57,240));
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= false;
            var passArray = [];
            for(var j=0;j<array.length;j++){
                var phz = new PHZCard(PHZAI.getDisplayVo(1,2),array[j]);
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
     * 显示选择吃的界面
     * @param cardsArray
     * @param result 筛选出来可以吃的id二维数组
     * @param needTimes 需要选择的次数
     * @param curTime 当前选择的次数
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
     * 点击选择吃牌的回调
     * @param obj
     */
    onGetChiCard:function(obj){
        var passArray = obj.passArray;
        var cardsArray = obj.cardsArray;
        var needTimes = obj.needTimes;
        var curTime = obj.curTime;
        this.temp_chi_select_map[curTime] = passArray;
        if(curTime>=needTimes){//只有一个选择，直接发送吃的消息
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
                var sourceArray = PHZMineLayout.getCurVoArray();
                var lastMJ = PHZAI.getPHZDef(this.lastLetOutMJ);
                lastMJ.isChi=1;
                //把桌面上面的最后出的一张牌放到数组的第一个，保证第一次筛选就把它选进去
                sourceArray.unshift(lastMJ);
                var result1 = PHZAI.getChi(sourceArray,lastMJ);
                this.displayChiSelect(sourceArray,result1.data,result1.needTimes,0);
            }else{
                PHZRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
            }
        }
    },


    /**
     * 获取每次吃的内容的最终ids
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
        // cc.log("ids =",JSON.stringify(ids));
        var sourceArray = PHZMineLayout.getCurVoArray();
        var lastMJ = PHZAI.getPHZDef(this.lastLetOutMJ);
        lastMJ.isChi = 1;
        //把桌面上面的最后出的一张牌放到数组的第一个，保证第一次筛选就把它选进去
        sourceArray.unshift(lastMJ);
        ids = PHZAI.findSameCardsShorterLine(ids,sourceArray);
        return ids;
    },

    /**
     * 点击选择吃牌的回调
     * @param obj
     */
    onSelectChiCard:function(obj){
        // obj.setTouchEnabled(false);
        // setTimeout(function () {
        //     if(obj){
        //         obj.setTouchEnabled(true);
        //     }
        // }, 1000);
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
        if(curTime>=needTimes){//只有一个选择，直接发送吃的消息
            this.lastSelectChiBg = {};
            // this.getRealChiIdsArray(curTime)
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
                // this.getRealChiIdsArray(curTime)
                PHZRoomModel.sendPlayCardMsg(6,this.getRealChiIdsArray(curTime));
            }
        }
    },

    /**
     * 隐藏所有的庄家显示
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
     * 牌局开始,由DealInfoResponder驱动
     * @param event
     */
    startGame:function(event){
        this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        if(PopupManager.hasClassByPopup(PHZSmallResultPop)){
            PopupManager.removeClassByPopup(PHZSmallResultPop);
        }

        PlayPHZMessageSeq.clean();
        if (PHZRoomModel.is3Ren() || PHZRoomModel.is2Ren()) {
            this.fapai.removeAllChildren();
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                // cc.log("11111111111111111111111111111111======>")
                    this.Button_qihu.visible = true
                }
        }

        //this.startGameAni();
        cc.log("2222222222222222222222222222222222222222222222222222222222222");

        PHZRoomModel.isStart = true;
        this.jiesanBtn.visible = true;
        this.jiesanBtn.setBright(true);
        this.jiesanBtn.setTouchEnabled(true);
        this.tuichuBtn.visible = false;
        this.lastMoPHZ = this.lastLetOutMJ = this.lastLetOutSeat = this.lastActType = 0;
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
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        this.Button_invite.visible = this.Button_ready.visible = false;
        this.fapai.visible = this.Label_remain.visible = true;
        var p = event.getUserData();
        //获得数醒的方位
        this.hideAllBanker();
        if(PHZRoomModel.renshu==4 && (PHZRoomModel.wanfa==GameTypeEunmZP.SYBP || PHZRoomModel.wanfa==GameTypeEunmZP.GLZP)){
            this._players[p.xiaohu[1]].isShuXing(true);
        }
        
        //转化成牌的格式
        var voArray = [];
        for(var i=0;i<p.handCardIds.length;i++){
            voArray.push(PHZAI.getPHZDef(p.handCardIds[i]));
        }

        this._countDown = PHZRoomModel.getNewTuoguanTime();
        //this.updateCountDown(this._countDown);
        var direct = PHZRoomModel.getPlayerSeq(PlayerModel.userId,PHZRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        /** 庄家摸牌 */
        PHZRoomEffects.showZhuangLastCard(this.getWidget("cpZhuangLastCard"),PHZAI.getPHZDef(p.xiaohu[0]),p.banker);
        if((GameTypeEunmZP.XXGHZ == PHZRoomModel.wanfa || GameTypeEunmZP.XXPHZ == PHZRoomModel.wanfa
        || GameTypeEunmZP.XTPHZ == PHZRoomModel.wanfa || GameTypeEunmZP.AHPHZ == PHZRoomModel.wanfa
        || GameTypeEunmZP.GLZP == PHZRoomModel.wanfa || GameTypeEunmZP.NXPHZ == PHZRoomModel.wanfa || GameTypeEunmZP.HSPHZ == PHZRoomModel.wanfa)
            ){//&& (PHZRoomModel.banker == PHZRoomModel.mySeat)
            PHZRoomSound.letOutSound(PlayerModel.userId,PHZAI.getPHZDef(p.xiaohu[0]));
        }

        this._players[p.banker].isBanker(true);
        this.Button_sort.visible = true;
        this.showJianTou(PHZRoomModel.nextSeat,true);
        if (p.xiaohu[1] == PHZRoomModel.mySeat){
            this.Button_sort.visible = false;
        }

        ////其他3人手上的牌
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
        this.showWaitSelectPiao(false);
        // cc.log("========startGame============",this.piaofenTime);
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
            this.piaofenTime = null;
        }

        var self = this;
        setTimeout(function(){
            if (voArray.length > 0 ){
                self.checkHu(voArray);
            }
        },1);

        if(PHZRoomModel.isMoneyRoom()){
            this.moneyRoomShowTiket(true,PHZRoomModel.goldMsg[0],true);

            this.moneyRoomShowLeaveBtn(false);
            this.moneyRoomShowWaitAni(false);
        }
    },

    showXiPaiBtn:function () {
        for (var i = 1; i <= PHZRoomModel.renshu; i++) {
            var mjp = this._players[i];
            if (mjp) {
                mjp.startGame();
                mjp.showDaNiaoType("xipai");
            }
        }
        this.tuichuBtn.visible = false;
        var xiPaiBtnNode = this.getChildByName("xiPaiBtnNode");
        if (xiPaiBtnNode) {
            xiPaiBtnNode.removeFromParent(true);
            xiPaiBtnNode = null;
        }

        xiPaiBtnNode = new cc.Node();
        xiPaiBtnNode.setName("xiPaiBtnNode");
        xiPaiBtnNode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 20);
        this.addChild(xiPaiBtnNode, 100);


        var btn1 = new ccui.Button("res/res_phz/xipaiBtn.png");
        btn1.setPosition(350, 0);
        btn1.flag = 1;
        UITools.addClickEvent(btn1, this, this.onClickXiPaiBtn);
        xiPaiBtnNode.addChild(btn1);

        var btn2 = new ccui.Button("res/res_phz/buxipaiBtn.png");
        btn2.setPosition(-350, 0);
        btn2.flag = 0;
        UITools.addClickEvent(btn2, this, this.onClickXiPaiBtn);
        xiPaiBtnNode.addChild(btn2);
    },
    onClickXiPaiBtn: function (sender) {
        sySocket.sendComReqMsg(4505, [sender.flag]);
    },
    FiNiShXiPai:function (event) {
        var message = event.getUserData();
        cc.log("message =",JSON.stringify(message));
        if (message.params[0] == PHZRoomModel.mySeat) {
            var xiPaiBtnNode = this.getChildByName("xiPaiBtnNode");
            if (xiPaiBtnNode) {
                xiPaiBtnNode.removeFromParent(true);
                xiPaiBtnNode = null;
            }
        }
        var userId = PHZRoomModel.getPlayerUserIdBySeat(message.params[0]);
        var p = PHZRoomModel.getPlayerVo(userId)
        this._players[p.seat].hideDaNiaoType();
    },
    NeedXipai:function(){
        this.hideAllBanker();
        this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        PHZMineLayout.clean();
        if (PHZRoomModel.is3Ren() || PHZRoomModel.is2Ren()) {
            this.fapai.removeAllChildren();
        }

        for (var i = 1; i <= PHZRoomModel.renshu; i++) {
            this.getWidget("oPanel" + i).removeAllChildren(true);
            this.getWidget("mPanel" + i).removeAllChildren(true);
            this.getWidget("mPanel" + i).visible = false;
            this.getWidget("oPanel" + i).visible = false;
            var layout = this.layouts[i];
            if (layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        this.getWidget("minePanel").visible = false;
		this.xipaiAni();
        this.addTipLabel();
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
    
    xipaiAni:function () {
        if (this.actionnode){
            return;
        }
		this.actionnode = new cc.Node();
		this.addChild(this.actionnode,10);
        this.actionnode.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 300);
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/jnqp/jnqp.ExportJson");
        var ani = new ccs.Armature("jnqp");
        ani.setAnchorPoint(0.5, 0.5);
        ani.setPosition(-50, 600);
        ani.getAnimation().play("Animation1", -1, 1);
        this.actionnode.addChild(ani);
		for (var index = 0; index < 11; index++) {
			var back_card = new cc.Sprite("res/res_phz/action_card.png");
			back_card.scale = 0.8;
			back_card.setPosition(-300,0);
			this.actionnode.addChild(back_card);
			back_card.setLocalZOrder(-index);

			var action = this.xipaiAction(index,1)
			back_card.runAction(action);
		}

		for (var j = 0; j < 11; j++) {
			var back_card2 = new cc.Sprite("res/res_phz/action_card.png");
			back_card2.scale = 0.8;
			back_card2.setPosition(300,0);
			this.actionnode.addChild(back_card2);
			back_card2.setLocalZOrder(-j);

			var action = this.xipaiAction(j,2)
			back_card2.runAction(action);
		}
	},

	xipaiAction:function(index,type){
		var self = this;
		var end_x = type == 2?300:-300;
        var action = cc.sequence(
			cc.delayTime(0.1*index),
			cc.moveTo(0.3,end_x,600-60*index),
			cc.moveTo(0.2,end_x,200),
			cc.moveTo(0.1,0,300),
			cc.callFunc(function () {
                if(index == 10){
                    self.actionnode.removeAllChildren();  
                    self.clearXiPai();
                }
            })
        );
        return action;
	},
    // /**
    //  * 收到后台的消息，刷新自己的可操作按钮列表
    //  * @param selfAct {Array.<number>}
    //  */
    refreshButton:function(selfAct){
        cc.log("==========refreshButton===============",selfAct);
        PHZRoomModel.selfAct = selfAct || [];
        this.btnPanel.removeAllChildren(true);
        if(selfAct.length>0){
            this.btnPanel.visible = true;
            if (PHZRoomModel.sxSeat == PHZRoomModel.mySeat){
                this.btnPanel.visible = false;
            }
            var btnDatas = [];
            var textureMap = {
                0:{t:"res/res_phz/act_button/hu.png",v:1},2:{t:"res/res_phz/act_button/wai.png",v:3},3:{t:"res/res_phz/act_button/liu.png",v:4},1:{t:"res/res_phz/act_button/peng.png",v:2},
                4:{t:"res/res_phz/act_button/chi.png",v:6}};

            if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                textureMap[7] = {t:"res/res_phz/wangdiao.png",v:15};
                textureMap[8] = {t:"res/res_phz/wangchuang.png",v:16};
                textureMap[9] = {t:"res/res_phz/wangzha.png",v:19};
                textureMap[10] = {t:"res/res_phz/wangzha.png",v:20};
                textureMap[11] = {t:"res/res_phz/wangchuang.png",v:18};
                textureMap[12] = {t:"res/res_phz/wangdiao.png",v:17};
            }

            if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
                textureMap[3] = {t:"res/res_phz/axwmq/btn_zhe_1.png",v:4};
            }

            var isShowBtn = true;
            var isHu = false;
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp == 1 && (i==2 || i==3 || i==6)){
                    isShowBtn = false;
                    if((PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) && (i == 2 || i == 3)){
                        isShowBtn = true;
                    }
                    if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ && i == 3){
                        isShowBtn = true;
                    }
                }
                if(temp == 1 && i == 0){
                    isHu = true;
                }
                if (tm && temp == 1) {
                    btnDatas.push(tm);
                }
            }

            if(btnDatas.length > 0 && btnDatas[0].v >= 15 && btnDatas[0].v <= 20){
                btnDatas.reverse();
            }

            if(btnDatas.length>0 && isShowBtn){
                //除了娄底放炮罚放炮胡牌不需要过之外，其他把过放到btnDatas里面去
                var isShowGuo = true;
                if((PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) && isHu){//落地扫无王必胡和放炮必胡
                    if(PHZRoomModel.intParams[3] == 2){
                        var hasWangPai = false;
                        var cards = PHZMineLayout.getCurVoArray();
                        for(var i = 0;i<cards.length;++i){
                            if(cards[i].n == 11)hasWangPai = true;
                        }
                        if(!hasWangPai)isShowGuo = false;

                    } else if(PHZRoomModel.intParams[3] == 1){
                        if(this.lastLetOutMsg){
                            if(this.lastLetOutMsg.actType == 2 && this.lastLetOutMsg.seat != PHZRoomModel.mySeat)isShowGuo = false;
                        }else{
                            for(var i = 0;i<PHZRoomModel.players.length;++i){
                                var p = PHZRoomModel.players[i];
                                if(p.outCardIds.length > 1 && p.seat != PHZRoomModel.mySeat && p.outCardIds[0] == 2){
                                    isShowGuo = false;
                                }
                            }
                        }
                    }
                }
                if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP && isHu) {//桂林字牌有胡不显示过
                    btnDatas = [textureMap[0]];
                    isShowGuo = false;
                }
                isShowGuo && btnDatas.push({t:"res/res_phz/act_button/guo.png",v:5});
                var w = 225;//118
                var g = 20;
                var winSize = cc.director.getWinSize();
                var len = btnDatas.length;
                var initX = 1695;
                var cardX = 0;
                for(var i=0;i<len;i++){
                    var btnData = btnDatas[i];
                    var btn = new ccui.Button();
                    btn.anchorX=btn.anchorY=0;
                    btn.anchorY = 0.5;
                    btn.loadTextureNormal(btnData.t);
                    btn.temp = btnData.v;
                    btn.x = initX - (len-i-1)*w - w/2 - (len-i-1)*g;
                    btn.y = -50 + 100;
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
                // this.showTipCard()
            }
        }
    },

    /**
     * 显示按钮旁边操作的牌
     */
    showTipCard:function(){
        if(this.btnPanel.getChildByTag(321))
            this.btnPanel.removeChildByTag(321);
        if (this.lastLetOutMJ && this.lastLetOutMJ > 0){
            var lastCard = PHZAI.getPHZDef(this.lastLetOutMJ);
            //cc.log("lastCard==="+JSON.stringify(lastCard))
            var phz = this.lastCard = new PHZCard(PHZAI.getDisplayVo(1,1),lastCard,null,true);
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
     * 将所有出牌面板上的显示层清理掉
     */
    cleanChuPai:function(){
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            this.getWidget("cp"+i).removeAllChildren(true);
        }
    },

    /**
     * 取消放招
     */
    cancelFangZhao:function(){
        this.cleanChuPai();
        this.lastMoPHZ=0;
    },

    /**
     * 收到出牌消息，前台开始处理,由PlayPaohuziResponder驱动
     * @param event
     */
    onLetOutCard:function(event){
        var message = event.getUserData();
        // cc.log("onLetOutCard message = ",JSON.stringify(message));
        var userId = message.userId;
        var seat = message.seat;
        var action = message.action;
        var ids = message.phzIds;
        var actType = message.actType;
        var timeSeat = message.timeSeat;
        var simulate = message.simulate || false;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ || PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.GLZP
            || PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW || PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
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
        //前台自己已经模拟了出牌的消息，后台给过来的出牌消息不处理后续逻辑
        if(seat==PHZRoomModel.mySeat&&actType==2&&action==0&&ids.length>0&&!simulate){
            if (!PHZMineLayout.isHasHardCard(ids[0])){
                this.showJianTou(timeSeat);
                this.delayLetOut(seat,action,ids);
                return;
            }
        }

        //暂时没想通为什么这么写，先注释掉
        if (seat==PHZRoomModel.mySeat){
            this.btnPanel.visible = false;
        }

        var isCleanChuPai = true;
        if(action == PHZAction.GUO || action == PHZAction.HU)isCleanChuPai = false;
        //庄家第一手出牌，闲家提，不清理出牌
        if(this.lastLetOutSeat>0&&action==PHZAction.TI && seat!=this.lastLetOutSeat)isCleanChuPai = false;
        var selfAct = message.selfAct;
        //落地扫王闯等刷操作按钮的消息，不清理出牌
        if((PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) && action == PHZAction.MO_PAI
            && (selfAct[7] || selfAct[8] || selfAct[9] || selfAct[10] || selfAct[11] || selfAct[12])){
            isCleanChuPai = false;
        }
        // cc.log("===========onLetOutCard======isCleanChuPai===" + isCleanChuPai);
        isCleanChuPai && this.cleanChuPai();

        var lastMoPHZ = this.lastMoPHZ;
        var self = this;

        var isOutCard = true;
        //系统摸的牌，在下次有出牌动作时再放到出牌的位置
        if(lastMoPHZ>0 && this.lastLetOutSeat>0 && (actType!=0 || (actType==0&&action==PHZAction.TI))) {
            var notTi = true;
            if (actType==0&&action==PHZAction.TI){
                notTi = false;
            }
            cc.log("actType =",actType);
            var cardVo = PHZAI.getPHZDef(lastMoPHZ);
            if (this.lastActType == 2){
                cardVo.isOutBySelf = true;
            }
            this.layouts[PHZRoomModel.getPlayerSeq("", this.lastLetOutSeat)].chuPai(cardVo,notTi);
            if (notTi){
                isOutCard = false;
                this.showOutCardTimeOutHandle = setTimeout(function(){self.onLetOutPai(message)},150);
            }
        }
        if (isOutCard){
            // cc.log("=============onLetOutCard=======3======");
            this.onLetOutPai(message);
        }

    },
    /**
     * 收到出牌消息，前台开始处理,这里是处理弃牌之后的逻辑
     * @param message
     */
    onLetOutPai:function(message){
        this.lastLetOutMsg = message;
         cc.log("=============onLetOutPai=============",JSON.stringify(message));
        // cc.log("=============this.kehushizhong=============",this.kehushizhong);0
        this._countDown = PHZRoomModel.getNewTuoguanTime();
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
        var isChongPao = message.isChongPao;//重跑
        var timeSeat = message.timeSeat;
        PHZRoomModel.timeSeat = timeSeat;
        var simulate = message.simulate || false;

        if(!simulate) {
            // cc.log("this._players =",JSON.stringify(this._players));
            this._players[seat].updateHuXi(huxi);
            PHZRoomModel.remain = message.remain;
            this.updateRemain();
        }
        if (seat==PHZRoomModel.mySeat){
           PHZRoomModel.myOutHuxi = huxi;
        }

        var tempAction = action;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.GLZP|| PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ){//落地扫王闯之类的胡牌操作特殊处理下
            if(action >= 15 && action <= 20)action = PHZAction.HU;
        }

        var self = this;
        if(actType==0&&action==PHZAction.GUO){
            //noting to do
        }else{
            this.lastMoPHZ = (actType!=0 && ids.length>0) ? ids[0] : 0;
        }

        var isFinish = false;

        if(actType!=0){//出牌动作 actType1为摸牌 2为出牌
            if(ids.length>0){
                isFinish = true;
                var cardTransData = [];
                for(var i=0;i<ids.length;i++){
                    cardTransData.push(PHZAI.getPHZDef(ids[i]));
                }
                //出牌的时候存一下最后一张牌
                this.lastLetOutMJ = ids[0];
                this.lastLetOutSeat = seat;
                this.lastActType = actType;
                var isTuoguan = PHZRoomModel.isAutoPlay();
                if(actType==2 && (seat==PHZRoomModel.mySeat || (seat == PHZRoomModel.bankerSeat && PHZRoomModel.mySeat == PHZRoomModel.sxSeat))
                || isTuoguan){
                    PHZMineLayout.delOne(cardTransData[0],true);
                }
                var localCard = cardTransData[0];
                if(PHZRoomModel.intParams[36] == 0 && PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK && (action == PHZAction.WEI || action == PHZAction.TI)){//没有选择明偎
                    localCard = {c:0};
                }
                // cc.log("=============onLetOutPai=======1======",actType,action,direct,JSON.stringify(cardTransData));
                PHZRoomEffects.chuPai(this.getWidget("cp"+direct),localCard,actType,PHZRoomModel.renshu,direct,
                    self.getWidget("oPanel"+direct),function(){
                        self.finishLetOut(seat,action,ids);
                    }
                );
                if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                    var numCount = 0;
                    this.schedule(function(){
                        PHZRoomSound.letOutSound(userId,cardTransData[numCount]);
                        ++numCount;
                    },0.1,cardTransData.length - 1,0);
                }else{
                    PHZRoomSound.letOutSound(userId,cardTransData[0]);
                }

                this.checkGrayCard();
            }
        }else{//特殊动作
            if(action==PHZAction.GUO && seat!=PHZRoomModel.mySeat ){
                //noting to do
            }else{
                this.resetChiSelect();
            }
            PHZRoomModel.currentAction = (seat==PHZRoomModel.mySeat) ? action : 0;
            if(action==PHZAction.LONG_BU_ZI) {//龙补字
                isFinish = true;
                this.onLongBuZi(message, PHZAI.getVoArray(ids));
            }else if(action == PHZAction.LDS_MO_WANG){
                isFinish = true;
                this.lastLetOutMJ = ids[0];
                this.onGetWangPai(message,PHZAI.getVoArray(ids));
            }else if(action==PHZAction.HU){//胡牌了
                this.btnPanel.visible = false;
                PHZRoomEffects.huPai(this.root,direct,PHZRoomModel.renshu);
                var soundPrefix = "hu";
                if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                    if(tempAction == 16){
                        soundPrefix = "zimo";
                    }else if(tempAction == 17){
                        soundPrefix = "pao";
                    }
                }else{
                    if(tempAction == 15 || tempAction == 17)soundPrefix = "wangdiao";
                    if(tempAction == 16 || tempAction == 18)soundPrefix = "wangchuang";
                    if(tempAction == 19 || tempAction == 20)soundPrefix = "wangzha";
                }
                PHZRoomSound.actionSound(userId,soundPrefix);
            }else{//其他动作，如偎、跑、碰、吃等
                //增加延迟播放
                if(ids.length>0 && (action==4||!this.kehushizhong)){
                     this.kehushizhong  = false;
                        isFinish = true;
                        var self = this;
                        //这里需要把这2个值记下来，在动画播放完后，防止this上面的这2个值已经被后面的消息覆盖掉了
                        var lastLetOutMJ = self.lastLetOutMJ;
                        var lastLetOutSeat = self.lastLetOutSeat || seat;
                        var nowBurCount = PHZRoomModel.nowBurCount;
                        PHZRoomEffects.chiAnimate(ids,this.root,direct,function(){
                            //只有局数是当前局的时候， 才更新最终显示
                            if (nowBurCount == PHZRoomModel.nowBurCount) {
                                if(ArrayUtil.indexOf(ids,lastLetOutMJ) >= 0){//需要把出牌人出的牌移除
                                    // cc.log("lastLetOutSeat =",lastLetOutSeat);
                                    var pSeat = PHZRoomModel.getPlayerSeq("",lastLetOutSeat);
                                    self.layouts[pSeat].beiPengPai(lastLetOutMJ);
                                }
                                self.layouts[direct].chiPai(ids,action,direct,isZaiPao);
                                if ((action==PHZAction.TI || (action==PHZAction.PAO && isChongPao)) && seat == PHZRoomModel.mySeat){
                                    var sourceArray = ArrayUtil.clone(PHZMineLayout.getCurVoArray());
                                    self.checkHu(sourceArray);
                                }
                                if(seat==PHZRoomModel.mySeat){
                                    self.checkGrayCard();
                                }
                                self.checkTingTimeOutHandle = setTimeout(function(){
                                    if (seat == PHZRoomModel.mySeat && PHZRoomModel.wanfa != GameTypeEunmZP.WHZ
                                        && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ
                                        && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP && PHZRoomModel.wanfa != GameTypeEunmZP.HHHGW
                                        && PHZRoomModel.wanfa != GameTypeEunmZP.AXWMQ) {
                                        self.checkTingList();
                                    }
                                },0);
                            }
                            self.finishLetOut(seat,action,ids);
                        },action,nowBurCount);
                        for(var i=0;i<ids.length;i++) {
                            PHZMineLayout.delOne(PHZAI.getPHZDef(ids[i]),(i==ids.length-1),isZaiPao);
                        }
                }
            }
            var prefixMap = {2:"peng",3:"wei",4:"ti",6:"chi",7:"pao",10:"chouwei"};
            if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                prefixMap[3] = "wai";
                prefixMap[4] = "liu";
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                prefixMap[3] = "xiao";
                prefixMap[10] = "xiao";
                prefixMap[4] = "qin";
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                prefixMap[3] = "sao";
                prefixMap[10] = "guosao";
                prefixMap[4] = "saochuan";
                prefixMap[7] = "kaizhao";
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
                prefixMap[4] = "zhe";
            }
            var prefix = prefixMap[action];
            if(prefix){
                PHZRoomEffects.normalAction(prefix,this.root,direct,PHZRoomModel.renshu);
                if(action==PHZAction.PAO && isChongPao)
                    prefix = "chongpao";
                PHZRoomSound.actionSound(userId,prefix);
            }
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

        if(simulate){
            PHZRoomModel.sendPlayCardMsg(0,[ids[0]]);
        }

        if(!isFinish && !simulate && (action==4||!this.kehushizhong))
            this.delayLetOut(seat,action,ids);

        if(this.kehushizhong){
            PlayPHZMessageSeq.finishPlay();
            this.cleanChuPai();
        }
        this.kehushizhong = false;
    },

    onGetWangPai:function(message,voArray){
        var userId = message.userId;
        var selfAct = message.selfAct;
        var seat = message.seat;
        var direct = PHZRoomModel.getPlayerSeq(userId,seat);
        var vo = voArray.shift();
        PHZRoomEffects.chuPai(this.getWidget("cp"+direct),vo,1,PHZRoomModel.renshu,direct,this.getWidget("oPanel"+direct));
        if(seat==PHZRoomModel.mySeat){
            PHZMineLayout.handleLongBuZi(vo);
        }
        PHZRoomSound.letOutSound(userId,vo);
        PHZMineLayout.outCardTingPai(this.outTingInfo);
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
        //后台出牌异常 补回缺失的卡
        if(event){
            var message = event.getUserData();
            var params = message.params;
            var id = params[0];
            cc.log("补回刚打出去的卡.." , id);
            if(this.lastMoPHZ == id){
                this.cleanChuPai();
                this.lastMoPHZ = 0
            }
            this.getLayout(1).fixOutCard(id);
            PHZMineLayout.addOne(id);
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
        if(seat==PHZRoomModel.mySeat) {//这里延迟给后台响应，保证出牌速度别太快
            var toId = ids.length>0 ? ids[0] : 0;
            PHZRoomModel.sendPlayCardMsg(9, [action,toId]);
        }
        PlayPHZMessageSeq.finishPlay();
    },

    onLongBuZi:function(message,voArray){
        var userId = message.userId;
        var selfAct = message.selfAct;
        var seat = message.seat;
        var direct = PHZRoomModel.getPlayerSeq(userId,seat);
        var vo = voArray.shift();
        PHZRoomEffects.chuPai(this.getWidget("cp"+direct),vo,1,PHZRoomModel.renshu,direct,this.getWidget("oPanel"+direct));
        if(seat==PHZRoomModel.mySeat)
            PHZMineLayout.handleLongBuZi(vo);
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
     * 准备
     */
    onReady:function(){
        sySocket.sendComReqMsg(4);
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = PHZRoomModel.getName(PHZRoomModel.wanfa);
        //var payTypeDesc = "房主支付";
        //if(PHZRoomModel.getCostFangShi() == 1){
        //    payTypeDesc = "AA支付";
        //}else if(PHZRoomModel.getCostFangShi() == 3){
        //    payTypeDesc = "群主支付";
        //}


        var wanfaDesc = PHZRoomModel.getWanFaDesc();

        var playerNum = " "+ PHZRoomModel.renshu + "缺" + (PHZRoomModel.renshu - PHZRoomModel.players.length);

        var obj={};
        obj.tableId=PHZRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+PHZRoomModel.tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title=wanfa+'   房号:'+PHZRoomModel.tableId + playerNum;
        var clubStr = "";
        if (PHZRoomModel.isClubRoom(PHZRoomModel.tableType)){
            clubStr = "[亲友圈]";
        }
        if(PHZRoomModel.wanfa==GameTypeEunmZP.SYZP){
            obj.description=clubStr + csvhelper.strFormat("邵阳字牌，{0}局，{1}",PHZRoomModel.totalBurCount ,wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.SYBP){
            obj.description=clubStr + csvhelper.strFormat("邵阳剥皮，{0}人，{1}",PHZRoomModel.renshu  , wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.LDFPF) {
            obj.description = clubStr + csvhelper.strFormat("娄底放炮罚，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.CZZP) {
            obj.description = clubStr + csvhelper.strFormat("郴州字牌，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.LYZP) {
            obj.description = clubStr + csvhelper.strFormat("耒阳字牌，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.XTPHZ) {
            obj.description = clubStr + csvhelper.strFormat("湘潭跑胡子，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.XXPHZ) {
            obj.description = clubStr + csvhelper.strFormat("湘乡跑胡子，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.XXGHZ) {
            obj.description = clubStr + csvhelper.strFormat("湘乡告胡子，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.AHPHZ) {
            obj.description = clubStr + csvhelper.strFormat("安化跑胡子，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.GLZP) {
            obj.description = clubStr + csvhelper.strFormat("桂林字牌，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.NXPHZ) {
            obj.description = clubStr + csvhelper.strFormat("宁乡跑胡子，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.SMPHZ) {
            obj.description = clubStr + csvhelper.strFormat("石门跑胡子，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }else if(PHZRoomModel.wanfa==GameTypeEunmZP.HSPHZ) {
            obj.description = clubStr + csvhelper.strFormat("汉寿跑胡子，{0}人，{1}", PHZRoomModel.renshu, wanfaDesc);
        }
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    /**
     * 暂离房间
     */
    onLeave:function(){
        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.isClientData){
            CheckJoinModel.exitMatchRoom();
        }else{
            sySocket.sendComReqMsg(6);
        }
    },

    /**
     * 解散
     */
    onBreak:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        },null,2)
    },

    /**
     * 开始播放语音
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
     * 语音播完了
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
     * 有成员加入，由JoinTableResponder驱动
     * @param event
     */
    onJoin:function(event){
        var p = event.getUserData();
        var seq = PHZRoomModel.getPlayerSeq(p.userId,p.seat);
        this._players[p.seat] = new PHZPlayer(p,this.root,seq);
        this.setInviteBtnState();
        var seats = PHZRoomModel.isIpSame();
        if(seats.length>0 && PHZRoomModel.renshu != 2){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }

        if(PHZRoomModel.isMoneyRoom()){
            this.Button_invite.setVisible(false);
        }
    },

    setInviteBtnState:function(){
        this.Button_invite.visible = false;
        // this.btn_qyq_invite.visible = (PHZRoomModel.players.length < PHZRoomModel.renshu);
        if(PHZRoomModel.isMatchRoom()){
            this.Button_invite.visible = false;
        }
    },

    /**
     * 在线或者离线状态
     * @param event
     */
    onOnline:function(event){
        var data = event.getUserData();
        this._players[data[0]].leaveOrOnLine(data[1]);
    },

    /**
     * 退出房间
     * @param event
     */
    onExitRoom:function(event){
        var p = event.getUserData();
        this._players[p.seat].exitRoom();
        delete this._players[p.seat];
        var seats = PHZRoomModel.isIpSame();
        this.setInviteBtnState();
        for (var key in this._players) {
            if (ArrayUtil.indexOf(seats, key) < 0) {
                this._players[key].isIpSame(false);
            }
        }
    },
    
    /*
     * 放招
     * */
    onFangZhao:function(event){
        cc.log("收到放招的消息...");
        var msg = event.getUserData();
        for(var i=0;i<PHZRoomModel.players.length;i++){
            var p = PHZRoomModel.players[i];
            if(p.userId == msg.userId){
                this._players[p.seat].isShowFangZhao(msg.fangzhao);
            }
        }
    },

    /**
     * 获取某个位置的layout实例
     * @param direct
     * @returns {*}
     */
    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
            layout = new HYSHKLayout();
        }else{
            layout = new PHZLayout();
        }
        this.layouts[direct] = layout;
        return layout;
    },

    /**
     * 展示倒计时和出牌者
     * @param seat
     */
    showJianTou:function(seat,isTing){
        seat = seat || PHZRoomModel.timeSeat;
        // cc.log("seat =", seat);
        // cc.log("PHZRoomModel.timeSeat =", PHZRoomModel.timeSeat);
        //cc.log("seat========"+seat);
        //cc.log("PHZRoomModel.timeSeat========"+PHZRoomModel.timeSeat);
        //cc.log("PHZRoomModel.nextSeat========"+PHZRoomModel.nextSeat);
        if(seat > 0){
            this.Image_time.visible = true;
            //隐藏闹钟
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
                if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF)
                    coords = { 1: { x: 40+(SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2, y: 190 }, 2: { x: 50 + (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2, y: 900 } };
            }
            var coord = coords[direct];
            this.Image_time.x = coord.x;
            this.Image_time.y = coord.y;

            for(var index = 1 ; index <= PHZRoomModel.renshu ; index ++) {
                if (this._players[index]) {
                    this._players[index].playerQuanAnimation(index == seat);
                }
            }
        }else{
            this.Image_time.visible = false;
        }
        //清理最后点击的那张牌Id
        PHZRoomModel.setTouchCard(0);
        this.Panel_shouzhi.visible = PHZRoomModel.isShowFinger();
        this.Image_hdx.visible = PHZRoomModel.isShowFinger();
        if (PHZRoomModel.isShowFinger()) {
            //cc.log("cleanTingPanel....  ")
            this.cleanTingPanel();
        }

        if (isTing && PHZRoomModel.wanfa != GameTypeEunmZP.WHZ && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ
            && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP
            && PHZRoomModel.wanfa != GameTypeEunmZP.HHHGW && PHZRoomModel.wanfa != GameTypeEunmZP.AXWMQ){
            this.checkTingList();
        }
        //this.fingerArmature.visible = PHZRoomModel.isShowFinger();


    },

    /**
     * 初始化layout和自己的牌
     * @param direct
     * @param p1Mahjongs
     * @param p2Mahjongs
     * @param p3Mahjongs
     * @param extMahjongs
     */
    initCards:function(direct,p1Mahjongs,p2Mahjongs,p3Mahjongs,extMahjongs,seat,isMoPai,strExts){
        //this.Image_hdx.visible = true;
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),seat,isMoPai);
        layout.refresh(p1Mahjongs,p2Mahjongs,p3Mahjongs,extMahjongs,strExts);
        if(direct==1){
            PHZMineLayout.initData(p1Mahjongs,this.getWidget("minePanel"));
            this.checkGrayCard();
        }
    },

    //岳阳歪胡子吃牌后手里剩下相同的牌和能组成一句话的牌不能打出
    //碰和歪的牌手里还有不能打出
    checkGrayCard:function(){
        if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            var moldCards = this.getLayout(1).getPlace2Data();
            if(moldCards){
                var tempCards = [];
                for(var i = 0;i< moldCards.length;++i){
                    var cards = moldCards[i].cards;
                    if(moldCards[i].action == PHZAction.CHI){
                        tempCards.push({t:cards[2].t,n:cards[2].n});
                        var temp = (cards[0].n + cards[1].n + cards[2].n)/3;
                        if(parseInt(temp) == temp){
                            if(temp > cards[2].n){
                                tempCards.push({t:cards[2].t,n:temp+2});
                            }else if(temp < cards[2].n){
                                tempCards.push({t:cards[2].t,n:temp-2});
                            }
                        }
                    }else if(moldCards[i].action == PHZAction.PENG || moldCards[i].action == PHZAction.WEI){
                        tempCards.push({t:cards[0].t,n:cards[0].n});
                    }
                }
                var cards = PHZMineLayout.cards;
                for(var i = 0;i<cards.length;++i){
                    var data = cards[i].getData();
                    for(var j = 0;j<tempCards.length;++j){
                        if(data.t == tempCards[j].t && data.n == tempCards[j].n){
                            cards[i].setGrayCanMove();
                            break;
                        }
                    }
                }
            }
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){

            var players = PHZRoomModel.players;

            var moldIds = [];
            for(var i = 0;i<players.length;++i){
                if(players[i].seat == PHZRoomModel.mySeat){
                    moldIds = players[i].moldIds || [];
                    break;
                }
            }

            //吃的牌手上还有不能打出
            var moldCards = this.getLayout(1).getPlace2Data();
            if(moldCards){
                for(var i = 0;i< moldCards.length;++i){
                    var cards = moldCards[i].cards;
                    if(moldCards[i].action == PHZAction.CHI){
                        moldIds.push(cards[2].v);
                    }
                }
            }

            if(moldIds.length > 0){
                var cards = PHZMineLayout.cards;
                for(var i = 0;i<cards.length;++i){
                    var data = cards[i].getData();
                    for(var j = 0;j<moldIds.length;++j){
                        if(data.v == moldIds[j]){
                            cards[i].setGrayCanMove();
                            break;
                        }
                    }
                }
            }

        }
    },

    /**
     * 传说中的互动表情
     */
    runPropAction:function(event){
        //seat 接收者的座位号  userId表示发送者的userId  content表示道具的索引值
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
        //this.updateSetKqtp();
        this.updateSetYyxz();
        this.updateSetCpsd();
        //this.updateSetZpdx();
        this.updateSetXxxz();
        //this.updateSetZpxz();
        this.updateBgColor();
    },
    updateSetKscp:function(){
        //暂时不需要
        //暂时不需要chenck
    },
    updateSetKqtp:function(event){
        var tingType = 0;
        if (event){
            tingType = event.getUserData();
        }
        if (PHZSetModel.kqtp){
            if (tingType == 2 && PHZRoomModel.wanfa != GameTypeEunmZP.WHZ && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ
                && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP
                && PHZRoomModel.wanfa != GameTypeEunmZP.HHHGW && PHZRoomModel.wanfa != GameTypeEunmZP.AXWMQ){
                this.checkTingList();
                var sourceArray = ArrayUtil.clone(PHZMineLayout.getCurVoArray());
                this.checkHu(sourceArray);
            }
        }else{
            this.cleanTingPanel();
            this.hideHandsTingImg();
        }
        if (this.Panel_tingPai) {
            this.Panel_tingPai.visible = (PHZSetModel.kqtp == 1);
        }
        //暂时不需要
    },
    updateSetYyxz:function(){
        //暂时不需要
    },
    updateSetCpsd:function(){
        //暂时不需要
    },
    updateSetZpdx:function(){
        if (PHZMineLayout){
            PHZMineLayout.changeHandCardSize();
        }
        if (this.lastCard) {
            this.showTipCard()
        }
    },
    updateSetXxxz:function(){

        this.Image_hdx.y = 580;
        PHZSetModel.cardTouchend = 565;
        if (PHZSetModel.xxxz == 2) {
            this.Image_hdx.y = 620;
            PHZSetModel.cardTouchend = 605;
        } else if (PHZSetModel.xxxz == 3) {
            this.Image_hdx.y = 660;
            PHZSetModel.cardTouchend = 645;
        }

        // this.Image_hdx.y = 620;
        // PHZSetModel.cardTouchend = 605;
        // if (PHZSetModel.xxxz == 1){
        //     this.Image_hdx.y = 690;
        //     PHZSetModel.cardTouchend = 675;
        // }
    },
    updateSetZpxz:function(){
        // cc.log("updateSetZpxz")
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            if (this.layouts[i]){
                this.layouts[i].changeOutCardTextrue()
            }
        }
        if (PHZMineLayout){
            PHZMineLayout.changeHandCardTextrue();
        }
        if (PHZRoomEffects){
            PHZRoomEffects.refreshCardByOpenTex()
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
        if (PHZMineLayout){
            PHZMineLayout.changeHandCardBg();
        }
        if (PHZRoomEffects){
            PHZRoomEffects.refreshCardBgByOpenTex()
        }
        if (this.lastCard){
            this.lastCard.refreshCardBgByOpenTex();
        }
    },
    updateSetIscp:function(){
        if (PHZMineLayout){
            PHZMineLayout.setCardOffY();
        }
    },
    updateBgColor:function(){
        var bgTexture = "res/res_phz/roombg/room_bg1.jpg";
        var gameTypeUrl = "";
        var ldfpf_qihuType ="";
        var ldfpf_manbaiType ="";
        // cc.log("PHZRoomModel.wanfa =",PHZRoomModel.wanfa)
        var wanfaUrl = "";
        if (PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1.png";
            this.Image_phzdetail.visible = true;
            wanfaUrl = "res/res_phz/wanfaImg/wanfa1_1.png";
            if(PHZRoomModel.intParams[0] == 1){
                wanfaUrl = "res/res_phz/wanfaImg/bpyj_1.png";
            }
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_1.png";
            this.Image_phzdetail.visible = true;
            wanfaUrl = "res/res_phz/wanfaImg/wanfa2_1.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_4.png";
            this.Image_phzdetail.visible = true;
            wanfaUrl = "res/res_phz/wanfaImg/10hqh_1.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_5.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_hyshk.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDS){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_lds.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_jhswz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_xxghz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_xxphz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_ahphz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_glzp.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_nxphz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_hsphz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_xtphz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_lszp.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_smphz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_cdphz.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_hhhgw.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_axwmq.png";
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
            this.Image_manbai.visible = true;
            this.Image_qihu.visible = true;
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_yzchz.png";
            var huxi = PHZRoomModel.intParams[14] || 15;
            ldfpf_qihuType = "res/res_phz/wanfaImg/" + huxi + "_hqh_1.png";

            var fengding = "bfd";
            if(PHZRoomModel.intParams[8] == 1)fengding = "300fd";
            if(PHZRoomModel.intParams[8] == 2)fengding = "600fd";
            if(PHZRoomModel.intParams[8] == 3)fengding = "800fd";
            ldfpf_manbaiType = "res/res_phz/wanfaImg/" + fengding + "_1.png";

        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype1_7.png";
            wanfaUrl = "res/res_phz/wanfaImg/"+PHZRoomModel.intParams[21]+"hqh_1.png";
        }else{
            this.Image_phzdetail.visible = false;
            this.Image_manbai.visible = true;
            this.Image_qihu.visible = true;
            if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype1_2.png";
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + PHZRoomModel.intParams[13] + "hqh_1.png";
                ldfpf_manbaiType = "res/res_phz/wanfaImg/mbjs_1.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype1_3.png";
                var huxi = PHZRoomModel.intParams[11] == 2?6:PHZRoomModel.intParams[11] == 3?3:9;
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + huxi + "xqh_1.png";
                var huxizhuanhuan = PHZRoomModel.intParams[10] == 2?1:3;
                ldfpf_manbaiType = "res/res_phz/wanfaImg/"+ huxizhuanhuan + "xyt_1.png";
            }
        }
        // var wanfaUrl = PHZRoomModel.wanfa == GameTypeEunmZP.SYBP ? "res/res_phz/wanfaImg/wanfa1_1.png" : "res/res_phz/wanfaImg/wanfa2_1.png";
        if (PHZSetModel.zmbj == 1){
            this.roomName_label.setColor(cc.color(214,203,173));
        }else if (PHZSetModel.zmbj == 2 || PHZSetModel.zmbj == 5){
            if (PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2.png";
                wanfaUrl = "res/res_phz/wanfaImg/wanfa1_2.png"
                if(PHZRoomModel.intParams[0] == 1){
                    wanfaUrl = "res/res_phz/wanfaImg/bpyj_2.png";
                }
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_1.png";
                wanfaUrl = "res/res_phz/wanfaImg/wanfa2_2.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_2.png";
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + PHZRoomModel.intParams[13] + "hqh_2.png";
                ldfpf_manbaiType = "res/res_phz/wanfaImg/mbjs_2.png"
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_3.png";
                var huxi = PHZRoomModel.intParams[11] == 2?6:PHZRoomModel.intParams[11] == 3?3:9;
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + huxi + "xqh_2.png";
                var huxizhuanhuan = PHZRoomModel.intParams[10] == 2?1:3;
                ldfpf_manbaiType = "res/res_phz/wanfaImg/"+ huxizhuanhuan + "xyt_2.png"
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_4.png";
                wanfaUrl = "res/res_phz/wanfaImg/10hqh_2.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_5.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_hyshk.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDS){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_lds.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_jhswz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_xxghz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_ahphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_glzp.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_nxphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_hsphz.png";
            } else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_xxphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_xtphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_lszp.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_smphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_cdphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_hhhgw.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_axwmq.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
                this.Image_manbai.visible = true;
                this.Image_qihu.visible = true;

                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_yzchz.png";
                var huxi = PHZRoomModel.intParams[14] || 15;
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + huxi + "_hqh_2.png";

                var fengding = "bfd";
                if(PHZRoomModel.intParams[8] == 1)fengding = "300fd";
                if(PHZRoomModel.intParams[8] == 2)fengding = "600fd";
                if(PHZRoomModel.intParams[8] == 3)fengding = "800fd";
                ldfpf_manbaiType = "res/res_phz/wanfaImg/" + fengding + "_2.png";

            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_7.png";
                wanfaUrl = "res/res_phz/wanfaImg/"+PHZRoomModel.intParams[21]+"hqh_2.png";
            }
            // wanfaUrl = PHZRoomModel.wanfa == GameTypeEunmZP.SYBP ? "res/res_phz/wanfaImg/wanfa1_2.png" : "res/res_phz/wanfaImg/wanfa2_2.png";
            bgTexture = "res/res_phz/roombg/room_bg2.jpg";
            if (PHZSetModel.zmbj == 5){
                bgTexture = "res/res_phz/roombg/room_bg5.jpg";
            }
            this.roomName_label.setColor(cc.color(204,204,204));
        }else if (PHZSetModel.zmbj == 3){
            if (PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3.png";
                wanfaUrl = "res/res_phz/wanfaImg/wanfa1_3.png";
                if(PHZRoomModel.intParams[0] == 1){
                    wanfaUrl = "res/res_phz/wanfaImg/bpyj_3.png";
                }
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_1.png";
                wanfaUrl = "res/res_phz/wanfaImg/wanfa2_3.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_2.png";
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + PHZRoomModel.intParams[13] + "hqh_3.png";
                ldfpf_manbaiType = "res/res_phz/wanfaImg/mbjs_3.png"
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_3.png";
                var huxi = PHZRoomModel.intParams[11] == 2?6:PHZRoomModel.intParams[11] == 3?3:9;
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + huxi + "xqh_3.png";
                var huxizhuanhuan = PHZRoomModel.intParams[10] == 2?1:3;
                ldfpf_manbaiType = "res/res_phz/wanfaImg/"+ huxizhuanhuan + "xyt_3.png"
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_4.png";
                wanfaUrl = "res/res_phz/wanfaImg/10hqh_3.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_5.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_hyshk.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_jhswz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_xxghz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_ahphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_glzp.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_nxphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_hsphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_smphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_cdphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_hhhgw.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_axwmq.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_xxphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_xtphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_lszp.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
                this.Image_manbai.visible = true;
                this.Image_qihu.visible = true;

                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_yzchz.png";
                var huxi = PHZRoomModel.intParams[14] || 15;
                ldfpf_qihuType = "res/res_phz/wanfaImg/" + huxi + "_hqh_3.png";

                var fengding = "bfd";
                if(PHZRoomModel.intParams[8] == 1)fengding = "300fd";
                if(PHZRoomModel.intParams[8] == 2)fengding = "600fd";
                if(PHZRoomModel.intParams[8] == 3)fengding = "800fd";
                ldfpf_manbaiType = "res/res_phz/wanfaImg/" + fengding + "_3.png";

            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_7.png";
                wanfaUrl = "res/res_phz/wanfaImg/"+PHZRoomModel.intParams[21]+"hqh_3.png";
            }
            // wanfaUrl = PHZRoomModel.wanfa == GameTypeEunmZP.SYBP ? "res/res_phz/wanfaImg/wanfa1_3.png" : "res/res_phz/wanfaImg/wanfa2_3.png";
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
        this.Image_phz.visible = false;

        this.Panel_20.setBackGroundImage(bgTexture);
        this.Image_manbai.loadTexture(ldfpf_manbaiType);
        this.Image_qihu.loadTexture(ldfpf_qihuType);
    },
    /**
     * isIphoneX 手牌坐标上移
     * * **/
    upMoveHandCard:function(diffY){
        this.getWidget("minePanel").y  = this.getWidget("minePanel").y + diffY;
    },

    /**
     * 隐藏听牌层
     * * **/
    hideTingPaiPanel:function(){
        this.Panel_tingPai.visible = false;
    },
    //清除显示剩余牌的层
    cleanSPanel:function(){
        for(var n=0;n<PHZRoomModel.renshu;n++) {
            var i = n + 1;
            var sPanel = this.getWidget("sPanel" + i);
            sPanel.removeAllChildren(true);
        }
    },

    //特殊情况服务器推送刷新手牌
    updateHands:function(event){
        var data = event.getUserData();
        // cc.log("updateHands data =",JSON.stringify(data));
        var cards = data.params ? data.params : null;
        var wanfa = (BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.wanfa) ? BaseRoomModel.curRoomData.wanfa : 0;
        // cc.log("updateHands===",cards,wanfa,ClubRecallDetailModel.isPDKWanfa(wanfa));
        if (cards && cards.length > 0 && wanfa == GameTypeEunmZP.CZZP){
            // cc.log("cards====",JSON.stringify(cards));
            PHZMineLayout.initData(cards,this.getWidget("minePanel"));
            this.checkGrayCard();
        }
    },
    //清除显示碰吃和打出去的牌
    cleanomPanel:function(){
        for(var n=0;n<PHZRoomModel.renshu;n++) {
            var i = n + 1;
            var sPanel = this.getWidget("oPanel" + i);
            var mPanel = this.getWidget("mPanel"+i);
            sPanel.removeAllChildren(true);
            mPanel.removeAllChildren(true);
        }
    },
    //显示其他玩家手上剩余的牌
    showSparePai:function(ClosingInfoModel){
        //var oneCards1 = [];
        //oneCards1[0] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        //oneCards1[1] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        //oneCards1[2] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        //oneCards1[3] = [36,22,16,8,59,47,78,27,6,12,26,37,2,61,33,13,35,38,48,32];
        for(var n=0;n<PHZRoomModel.renshu;n++) {
            var onePlayerVo = ClosingInfoModel.closingPlayers[n];
            var oneCards = onePlayerVo.cards;//剩余的牌的id值
            //var oneCards  = oneCards1[n];
            var cardVo = PHZAI.getVoArray(oneCards);//剩余的牌
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