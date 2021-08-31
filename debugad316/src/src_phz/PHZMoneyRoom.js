/**
 * Created by zhoufan on 2016/11/7.
 */
var PHZMoneyRoom = BaseLayer.extend({ //BaseLayer BaseRoom
    layouts:{},
    tag_btn_chi:601,
    tag_btn_other:501,
    tag_chi_select:343,
    _loacationDt:0,
    tag_paidun:666,
    temp_chi_data:{},
    temp_chi_select_map:{},
    COUNT_DOWN: 9,
    showSparePaiTimeOutHandle:null,
    showResultTimeOutHandle:null,
    checkTingTimeOutHandle:null,

    ctor:function(json){
        this.layouts = {};
        this.temp_chi_data = {};
        this.temp_chi_select_map = {};
        this.lastLetOutMJ = 0;
        this.lastLetOutSeat = 0;
        this._dt = 0;
        this._loacationDt = 0;
        this._countDown = PHZRoomModel.getTuoguanTime();//this.COUNT_DOWN;
        this._timedt = 0;
        this.lastBtnX = 0;
        this.CanClealTingImg = true;
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){//落地扫替换下王牌的资源
            var replaceFrameArr = ["big_cards1_11b.png","big_cards3_11b.png",
                "cards_listencard_81b.png","phz_cphua.png","small_cards1_11b.png","small_cards3_11b.png"];
            for (var i = 0; i < replaceFrameArr.length; ++i) {
                cc.spriteFrameCache.removeSpriteFrameByName(replaceFrameArr[i]);
                var frame = new cc.Sprite("res/res_phz/ldswp/" + replaceFrameArr[i]).getSpriteFrame();
                cc.spriteFrameCache.addSpriteFrame(frame, replaceFrameArr[i]);
            }
        }

        this._super(json);
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
        //cc.log("phzRoom begin");
        //BaseRoom.prototype.selfRender.call(this);
        var bgMusic = 3;
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,bgMusic);

    	WXHeadIconManager.loadedIconListInRoom = [];
        this.timeDirect = 1;
    	this.isShowAlert = false;
    	this.isShowReadyBtn = true;
        cc.log("PHZRoomModel.renshu..." , PHZRoomModel.renshu);
        for(var i=1;i<=6;i++){
            if(i<=PHZRoomModel.renshu){
                var p = this.getWidget("player"+i);
                var icon = this.getWidget("icon"+i);
                var kuang = this.getWidget("kuang"+i);
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

        this.Image_qihu = this.getWidget("Image_qihu");
        this.Image_qihu.x = this.Image_qihu.x - 100;

        this.btnPanel = this.getWidget("btnPanel");
        this.Image_time = this.getWidget("Image_time");
        if(this.Image_time){
            this.Image_time.visible = false;
        }
        this.fapai = this.getWidget("fapai");
        this.Label_remain = this.getWidget("Label_remain");
        this.Label_info = this.getWidget("Label_info");//房间信息
        //this.Label_info.setString(PHZRoomModel.getWanFaDesc());
        //this.Label_info.setAnchorPoint(0,1);
        //this.Label_info.setPosition(this.Label_info.x - 185,this.Label_info.y + 15);
        //this.Label_info.ignoreContentAdaptWithSize(false);
        // this.Label_info.setSize(500, 200);
        if(((PHZRoomModel.wanfa==GameTypeEunmZP.LDS||PHZRoomModel.wanfa==GameTypeEunmZP.JHSWZ) && PHZRoomModel.intParams[7] < 4)){
            this.Label_info.setAnchorPoint(0,1);
            this.Label_info.setPosition(this.Label_info.x - 185,this.Label_info.y + 15);
            this.Label_info.ignoreContentAdaptWithSize(false);
            this.Label_info.setSize(500, 200);
        }else if(((PHZRoomModel.wanfa==GameTypeEunmZP.LDS||PHZRoomModel.wanfa==GameTypeEunmZP.JHSWZ) && PHZRoomModel.intParams[7] == 4)){
            this.Label_info.setAnchorPoint(0,1);
            this.Label_info.setPosition(this.Label_info.x,this.Label_info.y + 15);
            this.Label_info.ignoreContentAdaptWithSize(false);
            this.Label_info.setSize(500, 200);
        }
        if(this.Label_info){
            this.Label_info.visible = false;
        }
        var versionNode = this.getWidget("label_version");
        if(versionNode){
            versionNode.setString(SyVersion.v);
            versionNode.visible = false;
        }
        this.Button_qihu = this.getWidget("Button_qihu");
        if(this.Button_qihu){
            this.Button_qihu.visible = false;
        }
        //if (PHZRoomModel.is4Ren()) {
        //    //this.Label_remain = new cc.LabelBMFont("","res/font/font_res_phz2.fnt");
        //    //this.Label_remain.x = this.fapai.width/2;
        //    //this.Label_remain.y = this.fapai.height/2+7;
        //    //this.fapai.addChild(this.Label_remain);
        //    this.Button_7 = this.getWidget("Button_7");//退出房间
        //    this.Button_6 = this.getWidget("Button_6");//解散房间
        //    UITools.addClickEvent(this.Button_7,this,this.onLeave);
        //    UITools.addClickEvent(this.Button_6,this,this.onBreak);
        //    //this.battery = this.getWidget("battery");//电量
        //    this.Image_set = this.getWidget("Image_set");
        //    this.Button_sset = this.getWidget("Button_sset");//设置面板
        //    UITools.addClickEvent(this.Button_sset,this,this.onShowSet);
        //} else {
        //    //this.battery = new cc.Sprite("res/ui/phz/pp/power.png");//this.getWidget("battery");//电量
        //    //this.battery.anchorX = 0;
        //    //this.battery.x = 5;
        //    //this.battery.y = 16;
        //    //this.getWidget("batteryBg").addChild(this.battery);
        //}

        this.Label_batteryPer = this.getWidget("Label_batteryPer");

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
        this.Button_ready = this.getWidget("Button_ready");//准备
        this.Button_invite = this.getWidget("Button_invite");//邀请好友
        //this.Button_sset = this.getWidget("Button_sset");//设置面板
        this.yuyin = this.getWidget("yuyin");//语音提示
        this.Image_hdx = this.getWidget("Image_hdx");//滑动出牌的线
        this.Image_hdx.visible = false;
        this.netType = this.getWidget("netType");//网络类型

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
        this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);
        this.addCustomEvent(SyEvent.FIX_OUT_CARD , this, this.fixMyCard);
        this.addCustomEvent(SyEvent.PHZ_HIDE_ACTION , this, this.hideAction);
        this.addCustomEvent(SyEvent.PHZ_DEAL_CARD , this,this.dealCardData);
        this.addCustomEvent(SyEvent.PHZ_CLEAN_TING , this,this.cleanTingPanel);
        this.addCustomEvent(SyEvent.PHZ_HIDE_TING , this,this.hideTingPaiPanel);

        this.addCustomEvent(SyEvent.DAPAI_TING,this,this.outCardTing);

        this.addCustomEvent(SyEvent.UPDATE_SET_KSCP , this,this.updateSetKscp);
        this.addCustomEvent(SyEvent.UPDATE_SET_KQTP , this,this.updateSetKqtp);
        this.addCustomEvent(SyEvent.UPDATE_SET_YYXZ , this,this.updateSetYyxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_CPSD , this,this.updateSetCpsd);
        this.addCustomEvent(SyEvent.UPDATE_SET_ZPDX , this,this.updateSetZpdx);
        this.addCustomEvent(SyEvent.UPDATE_SET_XXXZ , this,this.updateSetXxxz);
        this.addCustomEvent(SyEvent.UPDATE_SET_ZPXZ , this,this.updateSetZpxz);
        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBgColor);
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

        this.btn_Gps.visible = false;

        this.button_wanfa = new ccui.Button("res/res_phz/guize.png","","");
        this.button_wanfa.x = this.btn_Gps.x;
        this.button_wanfa.y = this.btn_Gps.y;
        this.button_wanfa.anchorX = this.btn_Gps.anchorX;
        this.button_wanfa.anchorY = this.btn_Gps.anchorY;
        this.getWidget("Panel_btn").addChild(this.button_wanfa,999);

        //UITools.addClickEvent(this.btn_Gps ,this,this.onGpsPop);
        UITools.addClickEvent(this.button_wanfa,this,this.showWanFaImg);
        this.initwanfaImg();
        //this.showWanFaImg();

        this.jiesanBtn = this.getWidget("btn_jiesan");//解散房间
        UITools.addClickEvent(this.jiesanBtn ,this,this.onJieSan);
        this.tuichuBtn = this.getWidget("btn_tuichu");//退出房间
        UITools.addClickEvent(this.tuichuBtn ,this,this.onTuiChu);

        this.jiesanBtn.visible = true;
        this.tuichuBtn.visible = true;

        this.tuichuBtn.x = 960;
        this.tuichuBtn.y -= 50;

        this.initGameBtn();

        if (PHZRoomModel.renshu == 2){
            this.getWidget("sPanel2").x += 600;
            this.getWidget("sPanel2").y += 320;
        }else if (PHZRoomModel.renshu == 3){
            this.getWidget("sPanel2").x += 550;
            this.getWidget("sPanel3").x += 150;
            this.getWidget("sPanel3").y += 320;
            this.getWidget("sPanel2").y += 320;
        }

        //this.btn_Gps.visible = true;

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
        this.dealMoneyView();
        this.playOrRemoveWaitingAnm();
        SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});//发送消息关闭假的假的匹配界面
    },

    showWanFaImg:function(){
        var nbtnWidget = this.getWidget("Panel_btn");
        if (nbtnWidget.getChildByName("wanfaImg")){
            var isBool = nbtnWidget.getChildByName("wanfaImg").isVisible();
            nbtnWidget.getChildByName("wanfaImg").setVisible(!isBool);
        }
    },

    //对局门票显示
    moneyRoomShowTiket:function(isShow,num,delayRemove){
        if(isShow){
            if(!this.imgTiket){
                this.imgTiket = new cc.Sprite("res/res_phz/gold_mp.png");
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

    getWanFaDesc:function(){
        var wanfaStr = "";
        if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
            if(PHZRoomModel.intParams[7] == 2) {
                if (PHZRoomModel.intParams[14] == 0) {
                    wanfaStr += "不抽牌,";
                } else {
                    wanfaStr += "抽" + PHZRoomModel.intParams[14] + "张,";
                }
                if (PHZRoomModel.intParams[24] != 0) {
                    wanfaStr += "小于" + PHZRoomModel.intParams[25]  + "分翻" +  PHZRoomModel.intParams[26] + "倍,";
                }
                if (PHZRoomModel.intParams[29] && PHZRoomModel.intParams[29] != 0) {
                    wanfaStr += "低于" + PHZRoomModel.intParams[30]  + "分加" +  PHZRoomModel.intParams[29] + "分,";
                }
            }
            wanfaStr += (PHZRoomModel.intParams[28] == 0 ? "不加锤," : "加锤,");

            if (PHZRoomModel.intParams[11] == 1){
                wanfaStr += "红黑胡,";
            }

            var otherStr = "";
            if (PHZRoomModel.wanfaKlz == 1){
                otherStr = "可连庄,";
                if(PHZRoomModel.limitScore == 0){
                    otherStr = "不封顶,";
                }else{
                    otherStr += PHZRoomModel.limitScore + "息";
                }
            }else{
                otherStr = "不可连庄,";
            }
            wanfaStr += otherStr;
        }
        return wanfaStr;
    },

    initwanfaImg:function(){
        //var wanfaStr = this.getWanFaDesc();
        var wanfaStr = ClubRecallDetailModel.getSpecificWanfa(PHZRoomModel.intParams,true,true,true);
        var wanfaArr = wanfaStr.split(" ");
        wanfaStr = wanfaStr.replace(/ /g,"\n");
        var nbtnWidget = this.getWidget("Panel_btn");
        var bgHeigh = 20 + wanfaArr.length * 38;
        if (nbtnWidget.getChildByName("wanfaImg")){
            var wanfa_bg = nbtnWidget.getChildByName("wanfaImg");
            wanfa_bg.setContentSize(cc.size(340,bgHeigh));
            wanfa_bg.setPosition(this.button_wanfa.x,this.button_wanfa.y - wanfa_bg.height/2-40);
            wanfa_bg.getChildByName("wanfa_label").setString(wanfaStr);
            wanfa_bg.getChildByName("wanfa_label").y = wanfa_bg.height/2-20;
            wanfa_bg.getChildByName("wanfa_label").setContentSize(cc.size(340,wanfa_bg.height));
        }else{
            var bg = UICtor.cS9Img("res/res_phz/xiala.png",cc.rect(5,17,117,5),cc.size(340,bgHeigh));
            bg.setPosition(this.button_wanfa.x,this.button_wanfa.y - bg.height/2-40);
            bg.setName("wanfaImg");
            bg.visible = false;
            nbtnWidget.addChild(bg,201);

            var wanfa_label = new cc.LabelTTF("","Arial",34,cc.size(340, bg.height));
            bg.addChild(wanfa_label, 10);
            wanfa_label.setString(wanfaStr);
            wanfa_label.setName("wanfa_label")
            wanfa_label.setColor(cc.color(255,255,255));
            wanfa_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            wanfa_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            wanfa_label.setPosition(bg.width/2,bg.height/2 - 20);
        }

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
         cc.log(" ******************** info",JSON.stringify(info));
        PHZMineLayout.outCardTingPai(info);
        this.outTingInfo = info;
        this.CanClealTingImg = false;
    },

    updatePlayTuoguan:function(event){
        var data = event.getUserData();
        cc.log("updatePlayTuoguan..." , data);
        //data = data.split(",");
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
            if(seat == PHZRoomModel.mySeat && this.bg_CancelTuoguan){
                this.bg_CancelTuoguan.visible = isTuoguan;
            }
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
        return checkIdArr
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
        var needDui = false;
        var isPaoHu = _isPaoHu;
        var isSelfMo = true;
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

            //cc.log("voArray[i]========="+JSON.stringify(voArray[i]));
            //cc.log("sourceArray========="+JSON.stringify(sourceArray));
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
            var result = tools.isHu(handCardBean, cards,  this.isSelfMo, outCardHuxi, isNeedDui, isPaoHu);
            //cc.log(isPaoHu+"result========="+JSON.stringify(result));

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

            if (bool_tingpai){//result.isHu1 && result.huxi + outCardHuxi >= qihuHuxi
                var isPush = true;
                for(var j=0;j<this.huList.length;j++){
                    if (this.huList[j].v == cards.v){
                        isPush = false;
                    }
                }
                if (isPush){
                    this.huList.push(cards);
                    if (_tingCards){
                        this.tingList.push(_tingCards);
                        break;
                    }
                }
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

    //检测胡牌
    checkHu:function(handCards,voArray,tingCards) {
        //if (PHZSetModel.kqtp){
        //    this.huList = [];
        //    var voArray = ArrayUtil.clone(this.getcheckHuIdArr());
        //    this.getHuList(voArray,handCards,true);
        //    //cc.log("this.huList======"+JSON.stringify(this.huList))
        //    this.showTingPai(this.huList);
        //}
        if (PHZSetModel.kqtp && PHZRoomModel.wanfa != GameTypeEunmZP.WHZ && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ
            && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP
            && PHZRoomModel.wanfa != GameTypeEunmZP.HHHGW){
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

    //处理手牌数据
    checkTingList:function(isTrue) {
        //return;
        //cc.log("checkTingList===============>")
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

    //清除听牌层
    cleanTingPanel:function(){
        if(this.Panel_tingPai)
            this.Panel_tingPai.removeAllChildren();
    },
    //显示听牌内容
    showTingPai:function(huList){
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
            tingBgImg.x = 200;
            tingBgImg.y = 50;
            tingBgImg.width = 200;
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
                if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                    var id = huList[j] % 10 == 0 ? 10 : huList[j] % 10;
                    var size = huList[j] > 40 ? "b" : "s";
                    if(huList[j] > 80){
                        id = huList[j];
                    }
                }
                var id = huList[j].n;
                var size = huList[j].v > 100 ? "b":"s";
                var listencardPath = "#cards_listencard_"+id+size+".png";
                var x = Math.floor(j%3)*75 + 50;
                var y = -Math.floor(j/3)*72 + tingBgImgHeight -45;
                var paiImg = new cc.Sprite(listencardPath);
                paiImg.x = x;
                paiImg.y = y;
                tingBgImg.addChild(paiImg);
            }
        }
    },

    //开局动画
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
        if (PHZMineLayout){
            PHZMineLayout.onCardsort();
        }
        cc.log("点击手牌排序")
    },

    onJieSan:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    onTuiChu:function(){
        if(BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.isClientData){
            CheckJoinModel.exitMatchRoom();
        }else{
            sySocket.sendComReqMsg(6);
        }
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
        this.Image_set.visible = !this.Image_set.visible;
        if(this.Image_set.visible){
            this.Button_sset.loadTextures("res/ui/phz/phzRoom/btn_33.png", "res/ui/phz/phzRoom/btn_33.png");
        }else{
            this.Button_sset.loadTextures("res/ui/phz/phzRoom/btn_32.png", "res/ui/phz/phzRoom/btn_32.png");
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
/*        var mc = new ChatPop("res/phzChat.json");
        PopupManager.addPopup(mc);*/
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
            if(this._countDown >= 0){
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
            //this.tuichuBtn.x = 640;
            this.tuichuBtn.visible = true;
            this.fapai.visible = this.Label_remain.visible = true;
        }
    },

    onOver:function(event){
    	this.isShowReadyBtn = false;
        var data = event.getUserData();
        this.message = data;
        this.cleanTingPanel();
        //消息队列还没播完，结算消息过来了，先缓存下来
        if(PlayPHZMessageSeq.sequenceArray.length>0){
        	PlayPHZMessageSeq.cacheClosingMsg(data);
        	return;
        }
        this.bg_CancelTuoguan.visible = false;
        for(var index = 0 ; index < PHZRoomModel.renshu ; index ++){
            if(this._players[index]){
                this._players[index].playerQuanAnimation(false);
            }
        }

        this.refreshOptCardOnOver();

        if((PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ)
            && PHZRoomModel.intParams[5] == 1){//翻醒效果
            var xingId = ClosingInfoModel.ext[9];
            PHZRoomEffects.showZhuangLastCard(this.getWidget("cpZhuangLastCard"),PHZAI.getPHZDef(xingId));
        }

        for(var i=0;i<data.length;i++){
    		if(PHZRoomModel.wanfa==GameTypeEunmZP.SYZP){
    			if(data[i].point == 0){
    				PHZRoomEffects.huangzhuang(this.root);
    				PHZRoomSound.actionSound(PlayerModel.userId,"huang");
    				break;
    			}
    		}else if(PHZRoomModel.wanfa==GameTypeEunmZP.SYBP && PHZRoomModel.remain==0 && ClosingInfoModel.fanTypes.length==0){
    			if(data[i].point == 0){
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
        var t = 1300;
        var t1 = 800;//延时展示其他玩家的剩余牌的时间
        this.showSparePaiTimeOutHandle = setTimeout(function() {//延时展示其他玩家的剩余牌
            self.showSparePai(ClosingInfoModel);
        },t1);
        this.showResultTimeOutHandle = setTimeout(function(){//延迟弹出结算框
        	self.isShowReadyBtn = true;
            for(var i=0;i<data.length;i++){
                self._players[data[i].seat].updatePoint(data[i].totalPoint);
            }
            //if(PDKRoomModel.isMoneyRoom()){
                var mc = new GoldResult_PHZ(data,false,PHZRoomModel.tableId);
            //}
            //var mc = new PHZSmallResultPop(data);
            //var mc = new PHZBigResultPop(data);
            PopupManager.addPopup(mc);
            var obj = HongBaoModel.getOneMsg();
            if(obj){
            	var mc = new HongBaoPop(obj.type,obj.data);
            	PopupManager.addPopup(mc);
            }
            //显示其他玩家手上剩余的牌
            //this.showSparePai(ClosingInfoModel);
            //for(var n=0;n<PHZRoomModel.renshu;n++) {
            //    var onePlayerVo = ClosingInfoModel.closingPlayers[n];
            //    var oneCards = onePlayerVo.cards;//剩余的牌的id值
            //    var cardVo = PHZAI.getVoArray(oneCards);//剩余的牌
            //    var zorder = cardVo.length;
            //    var result = PHZAI.sortHandsVo(cardVo);
            //    for (var i = 0; i < result.length; i++) {
            //        var seat = onePlayerVo.seat;
            //        var seq = PHZRoomModel.getPlayerSeq("", seat);
            //        var cardArray = result[i];
            //        for (var j = 0; j < cardArray.length; j++) {
            //        	if(seq!=1) {
            //            	var card = new PHZCard(PHZAI.getDisplayVo(seq, 2), cardArray[j]);
            //            	var mPanel = self.getWidget("mPanel" + seq);
            //            	mPanel.addChild(card, zorder);
            //            	if(PHZRoomModel.renshu>3){
            //            		if(seq!=3){
            //            			card.x = (seq == 2) ? -200 + i * 32 : 370 - i * 32;
            //            		}else{
            //            			card.x = 480 + i * 32;
            //            		}
            //            		card.y = 138-j * 37;
            //            	}else{
            //            		card.x = (seq == 2) ? -250 + i * 32 : 400 - i * 32;
            //            		card.y = 150-j * 37;
            //            	}
            //            	zorder--;
            //        	}
            //        }
            //    }
            //}
        },t);
    },

    //落地扫和永州扯胡子结算时把倾和啸显示出来
    refreshOptCardOnOver:function(){
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
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
                this.Button_ready.x = 640;
            }else{
                if (PHZRoomModel.isClubRoom(PHZRoomModel.tableType)){
                    this.Button_ready.x = 800;
                    this.tuichuBtn.visible = true;
                    //this.tuichuBtn.x = 480;
                }else{
                    this.tuichuBtn.visible = false;
                    this.Button_ready.x = 640;
                }
            }
            this.jiesanBtn.setBright(true);
            this.jiesanBtn.setTouchEnabled(true);
        }else{
            this.jiesanBtn.setBright(false);
            this.jiesanBtn.setTouchEnabled(false);
            this.tuichuBtn.visible = true;
            //this.tuichuBtn.x = 480;
            this.Button_ready.x = 800;
        }
        if (PHZRoomModel.isMoneyRoom()){
            this.jiesanBtn.visible = false;
        }
    },

    initData:function(){
    	sy.scene.hideLoading();
        //清除延时
        if(this.showSparePaiTimeOutHandle){
            clearTimeout(this.showSparePaiTimeOutHandle);
            this.showSparePaiTimeOutHandle = null;
        }

        if(this.checkTingTimeOutHandle){
            clearTimeout(this.checkTingTimeOutHandle);
            this.checkTingTimeOutHandle = null;
        }

        if(this.showResultTimeOutHandle){
            clearTimeout(this.showResultTimeOutHandle);
            this.showResultTimeOutHandle = null;
        }
        //this.startGameAni();//测试动画
        this.initwanfaImg();
    	this.hideAllBanker();
    	this.cleanChuPai();
        this.cleanTingPanel();
        this.cleanSPanel();
        this.updateCountDown(PHZRoomModel.getTuoguanTime());//this.COUNT_DOWN);
        PlayPHZMessageSeq.clean();
        if (PHZRoomModel.is3Ren() || PHZRoomModel.is2Ren()) {
            this.fapai.removeAllChildren();
        }
        this.lastMoPHZ = this.lastLetOutMJ = this.lastLetOutSeat = 0;
        this.Label_fh.setString("序号:"+PHZRoomModel.tableId);
        this.updateRoomInfo();
        this.initGameBtn();
        this._players = {};
        var players = PHZRoomModel.players;
        for(var i=1;i<=4;i++){
        	if(this.isShowReadyBtn){
                var player = this.getWidget("player"+i);
                if(player){
                    player.visible = false;
                }
                var oPanel = this.getWidget("oPanel"+i);
                if(oPanel){
                    oPanel.removeAllChildren(true);
                }
                var mPanel = this.getWidget("mPanel"+i);
                if(mPanel){
                    mPanel.removeAllChildren(true);
                }
        		var layout = this.layouts[i];
        		if(layout)//清理掉上一次的牌局数据
        			layout.clean();
        	}
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
        if(!isContinue && this.isShowReadyBtn)
            PHZMineLayout.clean();
        this.btnPanel.visible = false;
        this.Button_ready.visible = this.isShowReadyBtn;
        this.fapai.visible = this.Label_remain.visible = false;
        this.Button_invite.visible = (players.length<PHZRoomModel.renshu);
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
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = PHZRoomModel.getPlayerSeq(p.userId,p.seat);
            var cardPlayer = this._players[p.seat] = new PHZPlayer(p,this.root,seq);
            cardPlayer.isShowFangZhao(p.ext[1]);
            if(!isContinue){
                if(p.status)
                    cardPlayer.onReady();
            }else{//恢复牌局
                var banker = null;
                if (seq == 1){
                    handCards = ArrayUtil.clone(p.handCardIds);
                }
                if(p.seat==PHZRoomModel.nextSeat)
                    banker= p.seat;
                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.moldCards,banker,isMoPai);
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
                this.Button_sort.visible = true;

                if(PHZRoomModel.wanfa!=36 && PHZRoomModel.renshu==4 && p.ext[3]==p.seat
                    && PHZRoomModel.wanfa != GameTypeEunmZP.LDS&& PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ){
                	cardPlayer.isShuXing(true);
                    if (p.ext[2] == PHZRoomModel.mySeat){
                        this.Button_sort.visible = false;
                    }
                }


                if(p.recover.length>0){//恢复牌局的状态重设
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        PHZRoomModel.banker = p.seat;
                        cardPlayer.isBanker(true);
                    }
                    if(p.recover.length>2 && p.userId==PlayerModel.userId){
                    	if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                            this.refreshButton(p.recover.splice(2));
                        }else{
                            this.refreshButton(p.recover.splice(2,7));
                        }
                    }
                }
                cardPlayer.startGame();
            }
            if(p.userId ==PlayerModel.userId){//自己的状态处理
                if(p.status){
                    //this.tuichuBtn.x = 640;
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
        if(isContinue){
            if(PHZRoomModel.timeSeat)
                this.showJianTou();
            this.Button_invite.visible = false;
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

        //转化成牌的格式
        var voArray = [];
        for(var i=0;i<handCards.length;i++){
            voArray.push(PHZAI.getPHZDef(handCards[i]));
        }
        if (voArray.length > 0 ){
            this.hideHandsTingImg();
            this.checkHu(voArray);
        }
        this.dealMoneyView();
        this.playOrRemoveWaitingAnm();
    },

    /**
     * 点击取消托管
     */
    onCancelTuoguan:function(){
        sySocket.sendComReqMsg(131);
    },

    /**
     * 处理金币场模式
     */
    dealMoneyView:function(){
        var isMoneyRoom = PHZRoomModel.isMoneyRoom();
        if(isMoneyRoom){
            cc.log("当前是金币场房间！！！！");
            this.btnStopMoneyRoom = this.getWidget("btnStopMoneyRoom");
            if(!this.tempLable3){
                var label = new cc.LabelTTF("", "res/font/bjdmj/fznt.ttf", 50);
                label.setColor(cc.color(128,21,6));
                //var label = new cc.LabelBMFont(user.point+"",fnt);
                label.anchorX = 0;
                if(PHZRoomModel.renshu == 4){
                    label.x = 1120;
                    label.y = 900;
                    this.Panel_20.addChild(label,0);
                }else{
                    label.x = this.button_wanfa.x - 110;
                    label.y = this.button_wanfa.y - 100;
                    this.getWidget("Panel_btn").addChild(label,0);
                }
                this.tempLable3 = label;
            }
            //this.lableRoomId = this.getWidget("lableRoomId");
            this.tempLable3.setString("底分:" + (PHZRoomModel.goldMsg[2] || 0));
            //this.lableRoomId.setString(PHZRoomModel.getMoneyRoomBeilv() +"倍");

            this.Label_jushu.setString(SyVersion.v);
            //this.Label_jushu.visible = this.Label_fh.visible = this.Label_info.visible = false;


            //我也是醉了 又改回来
            //var tgTime = PHZRoomModel.getTuoguanTime();
            //var tgTime = 120;
            //this.countDownLabel = new cc.LabelAtlas(tgTime + "", "res/font/yxjsqnumber.png", 40, 52, '0');
            //this.countDownLabel.scale = 0.85;
            //this.countDownLabel.anchorX = 0.5;
            //this.countDownLabel.visible = false;
            //this.addChild(this.countDownLabel);

            //if(this.btnStopMoneyRoom){
            //    UITools.addClickEvent(this.btnStopMoneyRoom , this , this.onLeave);
            //}
        }else{

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

    /**
     * 增加等待好友动画
     */
    playOrRemoveWaitingAnm:function(){
        if(!PHZRoomModel.isMoneyRoom()){
            return
        }
        //双明要影藏一万个东西 决定放到列表里
        var showOrHideNode = [];
        //showOrHideNode.push(this.getWidget("Image_phz"));
        showOrHideNode.push(this.getWidget("Button_52"));//聊天
        showOrHideNode.push(this.getWidget("Button_53"));//语音
        showOrHideNode.push(this.getWidget("Button_sset"));//设置按钮
        showOrHideNode.push(this.getWidget("Image_databg"));
        showOrHideNode.push(this.getWidget("LableTime"));
        showOrHideNode.push(this.getWidget("Image_jg1"));
        showOrHideNode.push(this.getWidget("Image_jg2"));
        showOrHideNode.push(this.getWidget("batteryBg"));
        showOrHideNode.push(this.getWidget("Label_batteryPer"));
        showOrHideNode.push(this.getWidget("Label_remain"));
        //showOrHideNode.push(this.getWidget("Label_info"));
        //showOrHideNode.push(this.getWidget("tempLable3"));
        //showOrHideNode.push(this.getWidget("lableRoomId"));
        showOrHideNode.push(this.fapai);
        //showOrHideNode.push(this.btn_Gps);
        showOrHideNode.push(this.Button_75);
        showOrHideNode.push(this.recordBtn);//真.录音按钮


        var alwaysHideNode = [];
        alwaysHideNode.push(this.Button_invite);
        //alwaysHideNode.push(this.tuichuBtn);
        alwaysHideNode.push(this.Button_ready);
        alwaysHideNode.push(this.jiesanBtn);
        alwaysHideNode.push(this.getWidget("Image_phzdetail"));
        this.Button_75.x = this.jiesanBtn.x;

        for(var index = 0; index < alwaysHideNode.length ; index++){
            if(alwaysHideNode[index]){
                alwaysHideNode[index].visible = false;
            }
        }

        //人数不够 未开始的情况下
        if(PHZRoomModel.players.length < PHZRoomModel.renshu){
            if(this.waitAnimation == null){
                if(PHZRoomModel.isMoneyRoom()){
                    //ccs.armatureDataManager.addArmatureFileInfo(
                    //    "res/plist/dengren0.png",
                    //    "res/plist/dengren0.plist",
                    //    "res/plist/dengren.ExportJson");
                    //this.waitAnimation = new ccs.Armature("dengren");
                    //this.waitAnimation.x = 673;
                    //this.waitAnimation.y = 336;
                    //
                    //this.root.addChild(this.waitAnimation,99);
                    //this.waitAnimation.getAnimation().play("dengren",-1,1);
                    //if(this.btnStopMoneyRoom){
                    //    this.btnStopMoneyRoom.visible = true;
                    //}
                    ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/gold_zzpp/NewAnimation2.ExportJson");
                    this.waitAnimation = new ccs.Armature("NewAnimation2");
                    this.waitAnimation.x = 940;
                    this.waitAnimation.y = 660;
                    this.root.addChild(this.waitAnimation,99);
                    this.waitAnimation.getAnimation().play("Animation1",-1,1);
                    if(this.btnStopMoneyRoom){
                        this.btnStopMoneyRoom.visible = true;
                    }

                    if (this.iconbg){
                        this.iconbg.visible = true;
                    }
                }
            }

            for(var index = 0 ; index < showOrHideNode.length; index++){
                if(showOrHideNode[index]){
                    cc.log("影藏部分node...");
                    showOrHideNode[index].visible = false;
                }
            }
        }else{//移除已有的动画
            if(this.waitAnimation){
                this.waitAnimation.removeFromParent();
                this.waitAnimation = null;
            }
            for(var index = 0 ; index < showOrHideNode.length; index++){
                if(showOrHideNode[index]){
                    showOrHideNode[index].visible = true;
                }
            }
            if(this.btnStopMoneyRoom){
                this.btnStopMoneyRoom.visible = false;
            }
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
                        cc.log("updateRemain remove::"+i);
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
        }

        if(this.lable_GameName){
            if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
                this.lable_GameName.setString("邵阳剥皮");
            }else{
                this.lable_GameName.setString("邵阳字牌")
            }
        }

        if(this.lable_renshu){
            this.lable_renshu.setString(PHZRoomModel.renshu + "人");
        }
    	//if(PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
    	//	this.Label_jushu.setString(csvhelper.strFormat("第{0}/{1}局",PHZRoomModel.nowBurCount,PHZRoomModel.totalBurCount));
    	//}else if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
         //   this.Label_jushu.setString("第"+PHZRoomModel.nowBurCount+"局");
    	//}
        this.updateRemain();
    },

    /**
     * 吃、碰、杠等操作的统一处理
     * @param obj
     * @param isAlert
     */
    onPengPai:function(obj,isAlert){
        //isAlert = isAlert || false;
        var temp = obj.temp;
        switch (temp){
            case PHZAction.HU:
                PHZRoomModel.sendPlayCardMsg(temp,[]);
                break;
            case PHZAction.PENG:
                PHZRoomModel.sendPlayCardMsg(temp,[]);
                break;
            case PHZAction.GUO:
                var guoParams = [this.lastLetOutMJ];
                ArrayUtil.merge(PHZRoomModel.selfAct,guoParams);
                var isHu = obj.state;
                if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ)isHu = false;//落地扫不要确定弹窗
                if(isHu){
                    AlertPop.show("当前为可胡牌状态，确定要过吗？",function(){
                        PHZRoomModel.sendPlayCardMsg(temp,guoParams);
                    },function(){});
                }else{
                    PHZRoomModel.sendPlayCardMsg(temp,guoParams);
                }
                break;
            case PHZAction.CHI:
                if(this.btnPanel.getChildByTag(this.tag_chi_select))
                    return;
                var sourceArray = PHZMineLayout.getCurVoArray();
                var lastMJ = PHZAI.getPHZDef(this.lastLetOutMJ);
                lastMJ.isChi=1;
                //把桌面上面的最后出的一张牌放到数组的第一个，保证第一次筛选就把它选进去
                sourceArray.unshift(lastMJ);
                var result = PHZAI.getChi(sourceArray,lastMJ);
                if(result.data.length>0){//吃的选择
                    //cc.log("result.selectTimes=="+result.selectTimes);
                    //cc.log("result.data=="+JSON.stringify(result.data));
                    //cc.log("result.isSingleChi==="+result.isSingleChi);
                    if (PHZSetModel.kscp && result.data.length == 1){
                        this.getChiSelect(sourceArray,result.data,result.selectTimes,0);
                    }else{
                        this.displayChiSelect(sourceArray,result.data,result.selectTimes,0);
                    }

                }
                break;
            case PHZAction.PAO:
                PHZRoomModel.sendPlayCardMsg(PHZAction.PAO,[this.lastLetOutMJ]);
                break;
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
        //var width = 120+(result.length-1)*120;
        //var bg = UICtor.cS9Img("res/res_phz/chipai_bg.png",cc.rect(50,50,5,5),cc.size(width,390));
        //var initX = 25;
        //var lastMJVo = PHZAI.getPHZDef(this.lastLetOutMJ);
    	//for(var i=0;i<result.length;i++){
    	//	var array = result[i];
    	//	var first = array[0];
    	//	if(lastMJVo.t!=first.t || lastMJVo.n!=first.n){
    	//		var firstIndex = -1;
    	//		for(var a=0;a<array.length;a++){
    	//			if(array[a].t==lastMJVo.t&&array[a].n==lastMJVo.n&&firstIndex<0){
    	//				firstIndex=a;
    	//			}
    	//		}
    	//		if(firstIndex>=0){
    	//			array[0] = array[firstIndex];
    	//			array[firstIndex] = first;
    	//		}
    	//	}
    	//	array.reverse();
    	//	var innerbg = new UICtor.cImg("res/ui/phz/chipai_single.png");
    	//	innerbg.setTouchEnabled(true);
    	//	var passArray = [];
    	//	for(var j=0;j<array.length;j++){
    	//		var phz = new PHZCard(PHZAI.getDisplayVo(1,2),array[j]);
         //       var scale = 0.8;
    	//		//phz.scale=scale;
    	//		phz.x = (innerbg.width-phz.width*scale)/2;
    	//		phz.y = 10 + j * phz.height * scale;
    	//		innerbg.addChild(phz);
    	//		passArray.push(array[j].c);
    	//	}
    	//	innerbg.x = innerbg.width/2+initX+i*114;
    	//	innerbg.y = bg.height/2-22;
    	//	bg.addChild(innerbg);
    	//	var chiOrBiTex = curTime<1 ? "res/ui/phz/chi-chi.png" : "res/ui/phz/chi-bi.png";
    	//	var chiOrBi = new cc.Sprite(chiOrBiTex);
    	//	chiOrBi.x = innerbg.width/2;
    	//	chiOrBi.y = bg.height-chiOrBi.height-28;
    	//	innerbg.addChild(chiOrBi);
    	//	passArray.reverse();
    	//	innerbg.passArray = passArray;
    	//	innerbg.cardsArray = cardsArray;
    	//	innerbg.needTimes = needTimes;
    	//	innerbg.curTime = curTime;
    	//	UITools.addClickEvent(innerbg,this,this.onSelectChiCard);
    	//}
    	//var preData = (ObjectUtil.size(this.temp_chi_data)>0) ? this.temp_chi_data[curTime-1] : null;
    	//var preTag = preData ? preData.tag : this.tag_chi_select;
    	//var curTag = this.tag_chi_select+curTime;
    	//if(preTag==(curTag-1) && this.btnPanel.getChildByTag(curTag)){
    	//	this.btnPanel.removeChildByTag(curTag,true);
    	//	if(this.btnPanel.getChildByTag(curTag+1))//删除当前比的下一层比框
    	//		this.btnPanel.removeChildByTag((curTag+1),true);
    	//}
    	//bg.x = preData ? preData.x-bg.width/2 : this.btnPanel.getChildByTag(this.tag_btn_chi).x+55;
    	//bg.y = 240;
    	//this.temp_chi_data[curTime] = {x:bg.x-bg.width/2,tag:curTag};
    	//this.btnPanel.addChild(bg,1,curTag);

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
            innerbg.scale = 1.2;
            var clickbg = new UICtor.cImg("res/res_phz/chipai_click.png");
            clickbg.scale = 1.2;
            bg.addChild(clickbg);
            clickbg.setName("clickbg");
            clickbg.visible= false;
            var passArray = [];
            for(var j=0;j<array.length;j++){
                var phz = new PHZCard(PHZAI.getDisplayVo(1,2),array[j]);
                var scale = 0.8;
                // phz.scale=scale;
                phz.x = (innerbg.width-phz.width*scale)/2;
                phz.y = 10 + j * phz.height * scale;
                innerbg.addChild(phz);
                passArray.push(array[j].c);
            }
            clickbg.x = innerbg.width/2+initX+i*114;
            clickbg.y = bg.height/2-22;
            innerbg.x = innerbg.width/2+initX+i*114;
            innerbg.y = bg.height/2-22;
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
        return ids;
    },

    /**
     * 点击选择吃牌的回调
     * @param obj
     */
    onSelectChiCard:function(obj){
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
                this.displayChiSelect(nextCardsArray,result.data,needTimes,(curTime+1));
            }else{
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
        if (PHZRoomModel.is3Ren() || PHZRoomModel.is2Ren()) {
            this.fapai.removeAllChildren();
        }

        var isMoneyRoom = PHZRoomModel.isMoneyRoom();
        if(isMoneyRoom){//金币场 在人数没有显示完全的时候 要把开始游戏消息缓存下来
            if(ObjectUtil.size(this._players) < PHZRoomModel.renshu){
                PlayPHZMessageSeq.cacheBeginMsg(message);
                cc.log("金币场 如果玩家加入房间消息没处理完 缓存住开始游戏消息！！");
                return;
            }
            this.moneyRoomShowTiket(true,PHZRoomModel.goldMsg[0],true);
        }
        this.bg_CancelTuoguan.visible = false;
        this.jiesanBtn.visible = true;
        this.jiesanBtn.setBright(true);
        this.jiesanBtn.setTouchEnabled(true);
        this.playOrRemoveWaitingAnm();
        //this.startGameAni();
        this.tuichuBtn.visible = false;
        this.lastMoPHZ=this.lastLetOutMJ=this.lastLetOutSeat=0;
        this.updateRoomInfo();

        if (this.root.getChildByTag(3003))
            this.root.removeChildByTag(3003);//MJRoomEffects.WANG_TAG
        for(var i=1;i<=PHZRoomModel.renshu;i++){
            this.getWidget("oPanel"+i).removeAllChildren(true);
            this.getWidget("mPanel"+i).removeAllChildren(true);
            if(this._players[i]){
                this._players[i].playerQuanAnimation(false);
            }
            var layout = this.layouts[i];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        this.Button_invite.visible = this.Button_ready.visible =false;
        this.fapai.visible = this.Label_remain.visible = true;
        var p = event.getUserData();
        //cc.log("p.xiaohu[0]..." , p.xiaohu);
        PHZRoomEffects.showZhuangLastCard(this.getWidget("cpZhuangLastCard"),PHZAI.getPHZDef(p.xiaohu[0]),p.banker);
        //转化成牌的格式
        var voArray = [];
        for(var i=0;i<p.handCardIds.length;i++){
            voArray.push(PHZAI.getPHZDef(p.handCardIds[i]));
        }
        if (voArray.length > 0 ){
            this.checkHu(voArray);
        }
        this.showJianTou(PHZRoomModel.nextSeat);
        this._countDown = PHZRoomModel.getTuoguanTime();
        this.updateCountDown(this._countDown);
        var direct = PHZRoomModel.getPlayerSeq(PlayerModel.userId,PHZRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        this.hideAllBanker();
        this._players[p.banker].isBanker(true);
        this.Button_sort.visible = true;
        if (p.xiaohu[1] == PHZRoomModel.mySeat){
            this.Button_sort.visible = false;
        }
        if(PHZRoomModel.renshu==4 && PHZRoomModel.wanfa!=36){
        	this._players[p.xiaohu[1]].isShuXing(true);
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
    },

    /**
     * 收到后台的消息，刷新自己的可操作按钮列表
     * @param selfAct {Array.<number>}
     */
    refreshButton:function(selfAct){
        PHZRoomModel.selfAct = selfAct || [];
        if(selfAct.length>0){
            this.btnPanel.visible = true;
            this.btnPanel.removeAllChildren(true);
            var btnDatas = [];
            var textureMap = {
                0:{t:"res/res_phz/act_button/hu.png",v:1},1:{t:"res/res_phz/act_button/peng.png",v:2},
                4:{t:"res/res_phz/act_button/chi.png",v:6},5:{t:"res/res_phz/act_button/pao.png",v:7}};
            if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                textureMap[7] = {t:"res/res_phz/wangdiao.png",v:15};
                textureMap[8] = {t:"res/res_phz/wangchuang.png",v:16};
                textureMap[9] = {t:"res/res_phz/wangzha.png",v:19};
                textureMap[10] = {t:"res/res_phz/wangzha.png",v:20};
                textureMap[11] = {t:"res/res_phz/wangchuang.png",v:18};
                textureMap[12] = {t:"res/res_phz/wangdiao.png",v:17};
            }
            var aniResMap ={
                1:{t:"bthu"},
                2:{t:"btpeng"},
                5:{t:"btguo"},
                6:{t:"btchi"},
                7:{t:"bthu"},
                15:{t:"btwangdiao"},
                16:{t:"btwangchuang"},
                17:{t:"btwangdiao"},
                18:{t:"btwangchuang"},
                19:{t:"wangzha"},
                20:{t:"wangzha"},
            };
            var isShowBtn = true;
            var isHu = false;
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp == 1 && (i==2 || i==3 || i==6)){
                    isShowBtn = false;
                }
                if(temp == 1 && i == 0){
                    isHu = true;
                }
                if (tm && temp == 1) {
                    btnDatas.push(tm);
                }
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
                    btn.loadTextureNormal("res/res_phz/act_button/guo.png");
                    ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCPHZButtonAni/"+aniResMap[btnData.v].t+"/"
                        +aniResMap[btnData.v].t+".ExportJson");
                    var armature = new ccs.Armature(aniResMap[btnData.v].t);
                    armature.getAnimation().play("Animation1", -1, -1);
                    btn.addChild(armature);
                    armature.x = btn.width/2;
                    armature.y = btn.height/2 - 30;
                    armature.setName("buttonAni");
                    btn.temp = btnData.v;
                    btn.x = initX - (len-i-1)*w - w/2 - (len-i-1)*g;
                    btn.y = -50 + 100;
                    btn.state = isHu;
                    UITools.addClickEvent(btn,this,this.onPengPai);
                    var tag = (i==0) ? this.tag_btn_chi : this.tag_btn_other;
                    this.btnPanel.addChild(btn,0,tag);
                    if (i == 0){
                        cardX = btn.x;
                    }
                }
                this.lastCardX = cardX;
                //this.showTipCard();
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
            phz.numberImg.y -= 8
            ;
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
        this._countDown = PHZRoomModel.getTuoguanTime();
        this.updateCountDown(this._countDown);
        var message = event.getUserData();
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
            this._players[seat].updateHuXi(huxi);
            PHZRoomModel.remain = message.remain;
            this.updateRemain();
        }
        if (seat==PHZRoomModel.mySeat){
            PHZRoomModel.myOutHuxi = huxi;
        }

        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
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

        //前台自己已经模拟了出牌的消息，后台给过来的出牌消息不处理后续逻辑
        if(seat==PHZRoomModel.mySeat&&actType==2&&action==0&&ids.length>0&&!simulate){
            this.showJianTou(timeSeat);
            this.delayLetOut(seat,action,ids);
            return;
        }
        this.btnPanel.visible = false;

        var isCleanChuPai = true;
        if(action == PHZAction.GUO || action == PHZAction.HU)isCleanChuPai = false;
        //庄家第一手出牌，闲家提，不清理出牌
        if(this.lastLetOutSeat>0&&action==PHZAction.TI && seat!=this.lastLetOutSeat)isCleanChuPai = false;
        var selfAct = message.selfAct;
        //落地扫王闯等刷操作按钮的消息，不清理出牌
        if((PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) && action == PHZAction.MO_PAI
            && (selfAct[7] || selfAct[8] || selfAct[9] || selfAct[10] || selfAct[11] || selfAct[12])){
            isCleanChuPai = false;
        }
        // cc.log("===========onLetOutCard======isCleanChuPai===" + isCleanChuPai);
        isCleanChuPai && this.cleanChuPai();

        //系统摸的牌，在下次有出牌动作时再放到出牌的位置
        if(this.lastMoPHZ>0 && this.lastLetOutSeat>0 && (actType!=0 || (actType==0&&action==PHZAction.TI))) {
            var notTi = true;
            if (actType==0&&action==PHZAction.TI){
                notTi = false;
            }
            this.layouts[PHZRoomModel.getPlayerSeq("", this.lastLetOutSeat)].chuPai(PHZAI.getPHZDef(this.lastMoPHZ),notTi);
        }

        if(actType==0&&action==PHZAction.GUO){
            //noting to do
        }else{
            this.lastMoPHZ = (actType!=0 && ids.length>0) ? ids[0] : 0;
        }
        var isFinish = false;
        //-----------
        if(actType == 2){
            this._players[seat].hideLeaveSp();
        }
        if(action == PHZAction.PENG || action == PHZAction.CHI || action == PHZAction.HU || action == PHZAction.GUO){
            this._players[seat].hideLeaveSp();
        }
        //-----------
        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){//落地扫王闯之类的胡牌操作特殊处理下
            if(action >= 15 && action <= 20)action = PHZAction.HU;
        }
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
                if(actType==2 && seat==PHZRoomModel.mySeat || actType == 4){
                	PHZMineLayout.delOne(cardTransData[0],true);
                }
                var self = this;
                PHZRoomEffects.chuPai(this.getWidget("cp"+direct),cardTransData[0],actType,PHZRoomModel.renshu,direct,
                    this.getWidget("oPanel"+direct),function(){
                        self.finishLetOut(seat,action,ids);
                    }
                );
                PHZRoomSound.letOutSound(userId,cardTransData[0]);
            }
        }else{//特殊动作
            if(action==PHZAction.GUO && seat!=PHZRoomModel.mySeat){
                //noting to do
            }else{
                this.resetChiSelect();
            }
            PHZRoomModel.currentAction = (seat==PHZRoomModel.mySeat) ? action : 0;
            if(action==PHZAction.LONG_BU_ZI){//龙补字
                isFinish = true;
                this.onLongBuZi(message,PHZAI.getVoArray(ids));
            }else if(action == PHZAction.LDS_MO_WANG){
                isFinish = true;
                this.lastLetOutMJ = ids[0];
                this.onGetWangPai(message,PHZAI.getVoArray(ids));
            }else if(action==PHZAction.HU){//胡牌了
                this.btnPanel.visible = false;
                // PHZRoomEffects.huPai(this.root,direct,PHZRoomModel.renshu);
                var soundPrefix = "hu";
                PHZRoomEffects.normalActionForYLC(soundPrefix,this.root,direct,PHZRoomModel.renshu);
                PHZRoomSound.actionSound(userId,soundPrefix);
            }else{//其他动作，如偎、跑、碰、吃等
                //增加延迟播放
                if(ids.length>0){
                        isFinish = true;
                        var self = this;
                        //这里需要把这2个值记下来，在动画播放完后，防止this上面的这2个值已经被后面的消息覆盖掉了
                        var lastLetOutMJ = self.lastLetOutMJ;
                        var lastLetOutSeat = self.lastLetOutSeat;
                        PHZRoomEffects.chiAnimate(ids,this.root,direct,function(){
                            if(ArrayUtil.indexOf(ids,lastLetOutMJ) >= 0){//需要把出牌人出的牌移除
                                var pSeat = PHZRoomModel.getPlayerSeq("",lastLetOutSeat);
                                var tempLayout = self.layouts[pSeat];
                                tempLayout.beiPengPai(lastLetOutMJ);
                            }
                            self.layouts[direct].chiPai(ids,action,direct,isZaiPao);
                            self.finishLetOut(seat,action,ids);
                            if (action==PHZAction.TI && seat == PHZRoomModel.mySeat){
                                //cc.log("action....  ",action)
                                //cc.log("seat....  ",PHZRoomModel.mySeat,seat);
                                var sourceArray = ArrayUtil.clone(PHZMineLayout.getCurVoArray());
                                self.checkHu(sourceArray);
                            }

                            self.checkTingTimeOutHandle = setTimeout(function(){
                                if (seat == PHZRoomModel.mySeat && PHZRoomModel.wanfa != GameTypeEunmZP.WHZ
                                    && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.YZCHZ
                                    && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP && PHZRoomModel.wanfa != GameTypeEunmZP.HHHGW) {
                                    self.checkTingList();
                                }
                            },0);
                        },action);
                        for(var i=0;i<ids.length;i++) {
                            PHZMineLayout.delOne(PHZAI.getPHZDef(ids[i]),(i==ids.length-1),isZaiPao);
                        }
                }

            }
            var prefixMap = {2:"peng",3:"wei",4:"ti",6:"chi",7:"pao",10:"chouwei"};
            if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                prefixMap[3] = "sao";
                prefixMap[10] = "guosao";
                prefixMap[4] = "saochuan";
                prefixMap[7] = "kaizhao";
            }else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
                prefixMap[3] = "xiao";
                prefixMap[10] = "xiao";
                prefixMap[4] = "qin";
            }
            var prefix = prefixMap[action];
            if(prefix){
            	PHZRoomEffects.normalActionForYLC(prefix,this.root,direct,PHZRoomModel.renshu);
            	if(action==PHZAction.PAO && isChongPao){
                    prefix = "chongpao";
                    if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                        prefix = "chongzhao";
                    }
                }
                PHZRoomSound.actionSound(userId,prefix);
            }
        }

        if(action!=PHZAction.LONG_BU_ZI)
            this.refreshButton(selfAct);

        if(action!=PHZAction.HU){
            PHZRoomModel.nextSeat = nextSeat;
            if(timeSeat)
                this.showJianTou();
        }

        if(simulate){
            PHZRoomModel.sendPlayCardMsg(0,[ids[0]]);
        }

        if(!isFinish && !simulate)
        	this.delayLetOut(seat,action,ids);
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


        var wanfaDesc = this.getWanFaDesc();

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
        }
        obj.shareType=1;
        ShareDTPop.show(obj);
    },

    /**
     * 暂离房间
     */
    onLeave:function(){
        sySocket.sendComReqMsg(6);
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
        if(PHZRoomModel.isMoneyRoom()){
            if(p.userId == PlayerModel.userId){
                PHZRoomModel.mySeat = p.seat;//修正错误的mySeat值
            }
        }
        var seq = PHZRoomModel.getPlayerSeq(p.userId,p.seat);
        this._players[p.seat] = new PHZPlayer(p,this.root,seq);
        this.Button_invite.visible = (ObjectUtil.size(this._players)<PHZRoomModel.renshu);
        var seats = PHZRoomModel.isIpSame();
        if(seats.length>0 && PHZRoomModel.renshu != 2){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }
        this.playOrRemoveWaitingAnm();
        //如果人数已经足够 判断是否缓存了开始消息
        if(PHZRoomModel.isMoneyRoom() && ObjectUtil.size(this._players) >= PHZRoomModel.renshu){
            var beginMsg = PlayPHZMessageSeq.getBeginMsg();
            if(beginMsg){
                cc.log("玩家数量未显示完毕 执行缓存的开始游戏消息");
                this.startGame(beginMsg);
            }
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
        for (var key in this._players) {
            if (ArrayUtil.indexOf(seats, key) < 0) {
                this._players[key].isIpSame(false);
            }
        }
        this.playOrRemoveWaitingAnm();
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
        layout = new PHZLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    /**
     * 展示倒计时和出牌者
     * @param seat
     */
    showJianTou:function(seat){
        seat = seat || PHZRoomModel.timeSeat;
        //cc.log("seat========"+seat);
        //cc.log("PHZRoomModel.timeSeat========"+PHZRoomModel.timeSeat);
        //cc.log("PHZRoomModel.nextSeat========"+PHZRoomModel.nextSeat);
        if(seat > 0){
            this.Image_time.visible = true;
            //隐藏闹钟
            if (PHZRoomModel.is4Ren()) {
                this.Image_time.visible = false;
            }
            var direct = PHZRoomModel.getPlayerSeq("",seat);
            this.timeDirect = direct;
            var coords = null;
            //if(PHZRoomModel.renshu==4){
            //	coords = {1:{x:100,y:220},2:{x:935,y:453},3:{x:510,y:530},4:{x:300,y:453}};
            //}else{
            //	coords = {1:{x:100,y:133},2:{x:1085,y:525},3:{x:100,y:525}};
            //}
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
        //清理最后点击的那张牌Id
        PHZRoomModel.setTouchCard(0);
        this.Panel_shouzhi.visible = PHZRoomModel.isShowFinger();
        if (PHZRoomModel.isShowFinger()) {
            this.cleanTingPanel();
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
    initCards:function(direct,p1Mahjongs,p2Mahjongs,p3Mahjongs,extMahjongs,seat,isMoPai){
        this.Image_hdx.visible = true;
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),seat,isMoPai);
        layout.refresh(p1Mahjongs,p2Mahjongs,p3Mahjongs,extMahjongs);
        if(direct==1){
            PHZMineLayout.initData(p1Mahjongs,this.getWidget("minePanel"));
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
        if (this.Panel_tingPai){
            var tingType = 0;
            if (event){
                tingType = event.getUserData();
            }
            this.Panel_tingPai.visible = (PHZSetModel.kqtp == 1);
            if (PHZSetModel.kqtp){
                if (tingType == 2 && PHZRoomModel.wanfa != GameTypeEunmZP.LDS && PHZRoomModel.wanfa != GameTypeEunmZP.JHSWZ){
                    this.checkTingList();
                    var sourceArray = ArrayUtil.clone(PHZMineLayout.getCurVoArray());
                    this.checkHu(sourceArray);
                }
            }
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
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
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
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_3.png";
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
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_yzchz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype2_7.png";
                wanfaUrl = "res/res_phz/wanfaImg/"+PHZRoomModel.intParams[21]+"hqh_2.png";
            }
            bgTexture = "res/res_phz/roombg/room_bg2.jpg";
            if (PHZSetModel.zmbj == 5){
                bgTexture = "res/res_phz/roombg/room_bg5.jpg";
            }
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
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_4.png";
                wanfaUrl = "res/res_phz/wanfaImg/10hqh_3.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_5.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_hyshk.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDS){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_lds.png";
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
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_xxphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_xtphz.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_lszp.png";
            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){

            }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
                gameTypeUrl = "res/res_phz/wanfaImg/gametype3_7.png";
                wanfaUrl = "res/res_phz/wanfaImg/"+PHZRoomModel.intParams[21]+"hqh_3.png";
            }
            bgTexture = "res/res_phz/roombg/room_bg3.jpg";
        }else if (PHZSetModel.zmbj == 4){
            bgTexture = "res/res_phz/roombg/room_bg4.jpg";
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
            var mPanel = this.getWidget("sPanel" + i);
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
                        var mPanel = this.getWidget("sPanel" + seq);
                        mPanel.addChild(card, zorder);
                        card.scale = scale;
                        var gx = 39*scale;
                        var gy = 40*scale;
                        if(PHZRoomModel.renshu>3){
                            if(seq!=3){
                                card.x = (seq == 2) ? -190 +  i * gx : 350 - i * gx;
                            }else{
                                card.x = 350 - i * gx;
                            }
                            card.y = -20+j * gy;
                        }else{
                            card.x = (seq == 2) ? -210 + i * gx : 350 - i * gx;
                            card.y = 20 + j * gy;
                        }
                        zorder--;
                    }
                }
            }
        }
    }

});