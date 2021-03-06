/**
 * Created by zhoufan on 2016/7/22.
 */
var YJMJRoom = BaseRoom.extend({
    layouts:{},
    initCoords:{},
    COUNT_DOWN:15,
    BIRD_CARD_TAG:666,
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
        this.Label_info0 = this.getWidget("Label_info0");//??????
        this.Panel_btn = this.getWidget("Panel_btn");//??????panel
        //this.Button_setup = this.getWidget("Button_setup");
        this.Button_setup1 = this.getWidget("Button_setup1");
        this.Image_setup = this.getWidget("Image_setup");
        this.Panel_20 = this.getWidget("Panel_20");
        this.Button_info = this.getWidget("Button_info");
        this.Button_gps = this.getWidget("Button_gps");

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

        // this.Button_gps.visible =true;
        //this.Button_gps.x = 190;
        //this.Button_gps.y = 680;
        this.Label_ting = this.getWidget("Label_ting");//??????
        this.Panel_ting = this.getWidget("Panel_ting");//????????????
        this.Label_ting.visible = this.Panel_ting.visible = false;
        this.Panel_ting.removeAllChildren(true);
        this.Panel_8 = this.getWidget("Panel_8");
        this.Panel_8.visible = false;
        this.Button_9 = this.getWidget("Button_9");//????????????
        this.Button_10 = this.getWidget("Button_10");//????????????
        this.btn_back = this.getWidget("btn_back");
        this.Main = this.getWidget("Panel_20");
        this.bgColor = cc.sys.localStorage.getItem("sy_mj_pz"+MJRoomModel.wanfa)||cc.sys.localStorage.getItem("sy_mj_pz") || 1;
        this.Label_jsq = this.getWidget("Label_jsq");//?????????
        //this.Label_jsq.setString("?????????\n00:00");
        this.Label_jsq.setString("");
        this.btnInvite.y = 400;
        // this.btnInvite.setScale(1.2);
        this.roomName_label = new cc.LabelTTF("","Arial",32,cc.size(500, 40));
        this.roomName_label.setAnchorPoint(0,0.5);
        this.addChild(this.roomName_label, 10);
        if (MJRoomModel.roomName){
            this.roomName_label.setString(MJRoomModel.roomName);
            this.roomName_label.setColor(cc.color(214,203,173));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = cc.winSize.width/2 - 1120;
            this.roomName_label.y = cc.winSize.height/2 + 340;
        }
        
        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//??????????????????
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

        this.Button_ting = this.getWidget("Button_ting");//????????????


        this.Panel_niaoPai = this.getWidget("Panel_niaoPai");//?????????????????????
        this.Button_75 = this.getWidget("Button_75");//??????
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

        this.countDownLabel = new cc.LabelBMFont("15","res/font/font_mj3.fnt");
        this.countDownLabel.x = this.jt.width/2 + 2;
        this.countDownLabel.y = this.jt.height/2 + 2;
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

        var gameNameImg = new cc.Sprite("res/res_mj/res_yjmj/yjmjRoom/yjmj.png");
        var x = 960;
        var y = 740;
        gameNameImg.setPosition(x, y);
        this.Panel_20.addChild(gameNameImg,2);

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

        // this.wanfa_Label = new cc.LabelTTF("","Arial",34);
        // this.wanfa_Label.setColor(cc.color(181,151,83));
        // this.wanfa_Label.setPosition(640,300);
        // this.wanfa_Label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        // this.wanfa_Label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        // this.Panel_20.addChild(this.wanfa_Label);
        // this.wanfa_Label.setString(this.getWanFaLabelString());
        this.getWidget("mPanel1").y = 20;
        
        this.button_wanfa =  new ccui.Button("res/res_mj/mjRoom/wanfa.png","","");
        this.Panel_20.addChild(this.button_wanfa);
        this.button_wanfa.y = this.Button_setup1.y;
        this.button_wanfa.x = 1710;
        UITools.addClickEvent(this.button_wanfa,this,this.showWanFaImg);
        this.initwanfaImg();
        this.showWanFaImg();

        this.newUpdateFace();
        //this.adjustInviteBtn();
        this.Panel_20.getChildByName("Label_info_mj").setVisible(false);
        this.Panel_20.getChildByName("Image_info1").setVisible(false);
        this.Panel_20.getChildByName("Image_info2").setVisible(false);
    },

    newUpdateFace:function(){//????????????
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

            this.roomName_label.x -= tempSize - offx;

            this.getWidget("mPanel1").x += tempSize;
            
        }
    },

    //???????????????????????????????????????????????????????????????
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

    onGuoByHaidi:function(event){
        cc.log("=========ttttttttttttttt====onGuoByHaidi=====");
        //{"userId":"120074","majiangIds":[],"action":13,"seat":2,"selfAct":[],"fromSeat":null,"zimo":null,"huArray":[],"xiaohu":[]}
        var message = event.getUserData();
        this.refreshButton(message.selfAct);
        var userId = message.userId;
        var seat = message.seat;
        var direct = MJRoomModel.getPlayerSeq(userId,MJRoomModel.mySeat,seat);
        if(!this.getChildByTag(this.HAIDI_MEIHU + direct)) {
            var act = new cc.Sprite("res/res_mj/res_yjmj/yjmjRoom/btn_meihu.png");
            act.x = this.getWidget("cp" + direct).x + this.getWidget("cp" + direct).width / 2;
            act.y = this.getWidget("cp" + direct).y + this.getWidget("cp" + direct).width / 2;
            this.addChild(act, 1000, this.HAIDI_MEIHU + direct);
        }
        PlayMJMessageSeq.finishPlay();
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
        var string = "?????????";
        if (MJRoomModel.intParams[3] == 8){
            string = "????????????";
        }else if (MJRoomModel.intParams[3] != 0){
            string = "???" + MJRoomModel.intParams[3] + "???";
        }
        string = string + ",??????+" + MJRoomModel.intParams[13] + "???";
        string = string + ",???????????????+" + MJRoomModel.intParams[14];
        if (MJRoomModel.intParams[7] == 2 && MJRoomModel.intParams[20] == 1){
            string = string+ ",??????" + MJRoomModel.intParams[21] + "??????" + MJRoomModel.intParams[22] +"???";
        }else{
            string = string + ",?????????";
        }
        return string;
    },
    showPiaoBtn:function(isShow){
        for(var i=1;i<=MJRoomModel.renshu;i++){
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
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

    onPiaoFen:function(){
        cc.log("=============onPiaoFen=============");
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
        }
        this.piaofenTime = setTimeout(function(){//??????????????????????????????createTable?????????????????????
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
        setTimeout(function(){//??????????????????????????????createTable?????????????????????
            MJRoomModel.csmjIsOptXiaoHu = true;
            MJRoomModel.nextSeat = MJRoomModel.mySeat;
        },100);
    },

    //???????????????????????????
    onCSHaidi:function(event){
        cc.log("==========onCSHaidi==========");
        var message = event.getUserData();
        if(message.params[0] == 1){
            var pop = new MJHaiDiPop();
            PopupManager.addPopup(pop);
        }
    },

    //????????????????????????
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
                    playIds.push(id);//??????????????????????????????????????????????????????
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
     * ??????????????????
     */
    onCancelTuoguan:function(){
        sySocket.sendComReqMsg(210,[0]);
    },


    //??????????????????????????????????????????
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
     * ????????????????????????
     */
    runPropAction:function(event){
        //seat ?????????????????????  userId??????????????????userId  content????????????????????????
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
                cc.log("!!!!!!!????????????player");
            }
            if(seat == MJRoomModel.mySeat && this.bg_CancelTuoguan){
                this.bg_CancelTuoguan.visible = isTuoguan;
            }
            var gap = 5;
            if (data[2] && (data[2] > (this._countDown - gap) || data[2] < (this._countDown - gap))){
                this._countDown = data[2] || 90;
                ////??????????????????
                //if(this.countDownLabel){
                //    this.updateCountDown(this._countDown);
                //}
            }

        }
    },

    //??????????????????????????????
    outCardTing:function(event){
        var data = event.getUserData();
        var info = data.info;
        if (info){
            for(var j=0;j < info.length; j++){
                if (info[j].majiangId){
                    info[j].tingMajiangIds = ArrayUtil.uniqueArray(info[j].tingMajiangIds);
                    var list = info[j].tingMajiangIds;
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

    //?????????????????????
    clearTingArrows:function(){
        for(var lay in this.layouts){
            if (lay == 1) {
                this.layouts[lay].clearTingArrows();
            }
        }
    },

    //????????????????????????
    onShowAllHuCards:function(event){
        var tingData = event.getUserData();
        MJRoomModel.huCards = tingData.huCards || [];
        cc.log("tingData.huCards =",JSON.stringify(tingData.huCards));
        // if (tingData.isShow){
            this.onShowHuPanel(1);
        // }
    },

    //??????????????????
    onShowHuPanel:function(isShowAllTime){

        var huList = MJRoomModel.huCards;

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
                var card = new YJMahjong(MJAI.getDisplayVo(1, 2), vo);
                card.scale = scale_num;
                var size = card.getContentSize();
                card.x = 30+width * ((90+30)*scale_num)+100;
                card.y = 50 * scale_num + height*(size.height + 70)*scale_num;
                this.Panel_hupai.addChild(card,i+1);
                var num = this.getMahjongNumById(vo);
                totalNum += num;
                var paiNumLabel = new cc.LabelTTF("", "Arial", 30);
                paiNumLabel.setString(num + "???");
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
            ziLabel.setString("???");
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

    //??????????????????
    removeHuPanel:function(){
        if (this.Panel_hupai){
            this.Panel_hupai.removeAllChildren();
            this.Panel_hupai.visible = false;
            this.Button_ting.visible = false;
        }
    },

    getMahjongNumById:function(vo){
        var num = 4;

        var appearNum = 0;
        for(var lay in this.layouts){
            appearNum = appearNum + this.layouts[lay].getCardNumById(vo);
        }
        num = num - appearNum;
        return num;
    },


    //???????????????????????????????????????
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
                var card = new YJMahjong(MJAI.getDisplayVo(1, 4), vo);
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

    //?????? ???????????????????????????
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
            var mc = new YJMJSmallResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }
    },

    onJixuFromResult:function(){
        this.Panel_8.visible = false;
        if(MJRoomModel.totalBurCount == MJRoomModel.nowBurCount || (ClosingInfoModel.ext[17] == 1)){
            var mc = new YJMJBigResultPop(this.resultData);
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
        //??????????????????????????????????????????????????????????????????
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
            self.getLayout(seq).tanPai(p.cards);
        }

        if(data.bird.length > 0){
            this.showBirdCard(data.bird);
        }

        var t = 2000;
        this.overTimeout = setTimeout(function(){//?????????????????????
            //self.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            var mc = new YJMJSmallResultPop(data);
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
        this.Label_info0.setString("??????:"+MJRoomModel.tableId);
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
            if(layout)//?????????????????????????????????
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
            var cardPlayer = this._players[p.seat] = new MJPlayer(p,this.root,seq);
            cardPlayer.showTrusteeship(parseInt(p.ext[3]));//??????????????????
            var isMoPai = false;

            this._players[p.seat].setTingState(p.ext[2] == 1);
            if (p.ext[2] == 1) {//?????????
                MJRoomModel.ting(p.seat);
            }
            if (MJRoomModel.nextSeat == p.seat) {//????????????
                isMoPai = true;
            }

            if(!isContinue){
                if(p.status)
                    cardPlayer.onReady();
            }else{//????????????
                this.Panel_20.getChildByName("Label_info_mj").setVisible(true);
                this.Panel_20.getChildByName("Image_info1").setVisible(true);
                this.Panel_20.getChildByName("Image_info2").setVisible(true);
                var banker = null;
                //if(p.seat==MJRoomModel.nextSeat)
                //    banker= p.seat;
                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.huCards, banker, isMoPai);
                if(p.outCardIds.length>0){//???????????????????????????
                    this.lastLetOutMJ = p.outCardIds[0];
                    this.lastLetOutSeat = p.seat;
                    this.getLayout(seq).showFinger(this.lastLetOutMJ);
                }
                if(p.recover.length>0){//???????????????????????????
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        MJRoomModel.banker = p.seat;
                        cardPlayer.isBanker(true);
                    }
                }

                var totalLength = p.ext[3];
                if(p.recover.length <= 2 && totalLength%3==2 && MJRoomModel.remain < MJRoomModel.renshu){
                    var direct = MJRoomModel.getPlayerSeq(p.userId, MJRoomModel.mySeat, p.seat);
                    var act = new cc.Sprite("res/res_mj/res_yjmj/yjmjRoom/btn_meihu.png");
                    act.x = this.getWidget("cp" + direct).x + this.getWidget("cp" + direct).width / 2;
                    act.y = this.getWidget("cp" + direct).y + this.getWidget("cp" + direct).width / 2;
                    this.addChild(act, 1000, this.HAIDI_MEIHU + direct);
                    if (p.userId == PlayerModel.userId) {
                        MJRoomModel.sendPlayCardMsg(13, []);
                    }
                }


                cardPlayer.startGame();
            }
            var isTuoguan = p.ext[4];
            if(p.userId ==PlayerModel.userId){//?????????????????????
                MJRoomModel.isTrusteeship = p.ext[5];
                //this.Image_cover.visible = (MJRoomModel.isTrusteeship) ? true : false;
                if(p.status){
                    this.btnReady.visible = false;
                }else{
                    // this.btnInvite.visible = false;
                }

                if(p.ext[2]==1){//?????????
                    MJRoomModel.mineLayout.yjmjTingPai();
                }

                var tingAct = p.recover.length>2 ? p.recover.splice(2,8) : [];
                var isTingPai = false;
                if(p.handCardIds.length%3==2){
                    //????????????????????????????????????????????????????????????????????????,????????????????????????
                    if(MJRoomModel.isTing() || MJRoomModel.isHued()){//????????????
                        MJRoomModel.needAutoLetOutId = p.handCardIds[p.handCardIds.length-1];
                        //MJRoomModel.sendPlayCardMsg(0,[MJRoomModel.needAutoLetOutId]);
                        if(tingAct.length==0)
                            MJRoomModel.chuMahjong(MJRoomModel.needAutoLetOutId);
                    }else{//????????????????????????
                        //isTingPai = this.checkTingPai(tingAct,true);
                    }
                }
                //cc.log("isTingPai::"+isTingPai+" selfact::"+tingAct);
                if(!isTingPai)
                    this.refreshButton(tingAct);

                //???????????????????????? ??????????????????
                // cc.log("???????????????????????????????????????... " , MJRoomModel.isOpenTuoguan());
                if(MJRoomModel.isOpenTuoguan() && this.bg_CancelTuoguan){
                    var isMeTuoguan = MJRoomModel.getPlayerIsTuoguan(p);;
                    this.bg_CancelTuoguan.visible = isMeTuoguan;

                }
            }
            cardPlayer.updateTuoguan(isTuoguan);
        }
        //IP???????????????
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
        }else{
            if (players.length>1 && MJRoomModel.renshu != 2 && MJRoomModel.nowBurCount == 1)
                PopupManager.addPopup(new GpsPop(MJRoomModel , MJRoomModel.renshu));

            this.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            this.jt.visible = false;
        }
        this.removeHuPanel();
    },

    showBirdCard:function(cards){

        var listSize = this.Panel_niaoPai.getContentSize();

        for (var i = 0; i < cards.length; i++) {
            var diff2 = Math.ceil(i / 2);
            var diff1 = Math.floor(i % 2) ? 1 : -1;
            var vo = MJAI.getMJDef(cards[i]);
            var card = new YJMahjong(MJAI.getDisplayVo(1, 1), vo);
            var size = card.getContentSize();
            card.x = -listSize.width * 0.2 + (size.width + 15) * diff1 * diff2 + diff1 * 80 - 20;
            card.y = 0;
            this.Panel_niaoPai.addChild(card, i + 1);

            var znSprite = new cc.Sprite("res/res_mj/mjSmallResult_24.png");
            znSprite.x = listSize.width*0.5 + 50;
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

    //??????
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

    //????????????
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
                var card = new YJMahjong(MJAI.getDisplayVo(1,4),huArray[key]);
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


    ////????????????
    //unTrusteeship:function(){
    //    MJRoomModel.isTrusteeship = 0;
    //    //this.Image_cover.visible = false;
    //    sySocket.sendComReqMsg(203,[0]);
    //},
    //
    ////??????????????????
    //onSetIsTrusteeship:function(event){
    //    var data = event.getUserData(); //[status,seat]
    //    MJRoomModel.isTrusteeship = data[0];
    //    if(data[1]==MJRoomModel.mySeat){
    //        //this.Image_cover.visible = (MJRoomModel.isTrusteeship==1) ? true : false;
    //    }
    //    this._players[data[1]].showTrusteeship(MJRoomModel.isTrusteeship);
    //},

    /**
     * ????????????
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
                //??????????????????
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
        var textRenderer =  new cc.LabelTTF("??? "+MJRoomModel.remain+" ???", "", 40);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo("??? ",cc.color("#73a8d7"),40));
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.remain+"",cc.color("#d3dc6f"),40));
        ele1.push(RichLabelVo.createTextVo(" ???",cc.color("#73a8d7"),40));
        var label = new RichLabel(cc.size(200,40));
        label.setLabelString(ele1);
        label.x = (this.Image_info2.width-textRenderer.getContentSize().width)/2;
        label.y = 5;
        this.Image_info2.addChild(label,1,999);
        if (MJRoomModel.remain == 4) {
            //var winSize = cc.director.getWinSize();
            //var last4 = new cc.Sprite("res/res_mj/mjRoom/last4.png");
            //last4.x = winSize.width/2+42;
            //last4.y = winSize.height/2;
            //this.root.addChild(last4,9999);
            //last4.runAction(cc.sequence(cc.delayTime(3),cc.fadeOut(2),cc.callFunc(function() {
            //    last4.removeFromParent(true);
            //})));
            FloatLabelUtil.comText("????????????");
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
                fontColor = cc.color(97,192,187);
                break;
            case 2:
                fontColor = cc.color(40,166,109);
                break;
            case 3:
                fontColor = cc.color(98,144,184);
                break;
            default :
                fontColor = cc.color(98,144,184);
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
        this.Label_info_mj.setString(ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams,0,1));
        this.Image_info1.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF("??? "+MJRoomModel.nowBurCount+"/"+MJRoomModel.totalBurCount+" ???", "", 40);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo("??? ",cc.color("73a8d7"),40));
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.nowBurCount+"/"+MJRoomModel.totalBurCount,cc.color("#d3dc6f"),40));
        ele1.push(RichLabelVo.createTextVo(" ???",cc.color("#73a8d7"),40));
        var label = new RichLabel(cc.size(300,40),1);
        label.setLabelString(ele1);
        label.x = (this.Image_info1.width-textRenderer.getContentSize().width)/2;
        label.y = 5;
        this.Image_info1.addChild(label,1,999);
    },

    /**
     * ?????????????????????????????????????????????
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

        var tipLabel = new UICtor.cLabel("????????????????????????????????????",42);
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
                var mahjong = new YJMahjong(MJAI.getDisplayVo(1,3),chiVo);
                mahjong.scale=scale;
                mahjong.x = initX+75*scale*count;mahjong.y = 3;
                bg.addChild(mahjong);
                //if(action==MJAction.CHI && j==1){
                //    var huang = new cc.Scale9Sprite("res/res_mj/mjRoom/img_52.png");
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
     * ??????????????????
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
            case 14:
                MJRoomModel.nextSeat = MJRoomModel.mySeat;
                MJRoomModel.isTingSelecting = true;
                MJRoomModel.selfAct.length=0;
                MJRoomModel.mineLayout.yjmjTingPai();
                MJRoomModel.sendPlayCardMsg(14,[]);
                break;
            case MJAction.PENG:
            case MJAction.GANG:
            case 15://?????????????????????????????????
            case MJAction.AN_GANG:
            case MJAction.BU_ZHANG:
                //cc.log("MJAction.GANG==========",MJAction.GANG)

                var doFunc = function(){

                    var ids = [];
                    var myLayout = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId));
                    var allMJs = myLayout.getPlace1Data();
                    if(allMJs.length%3==2|| (MJRoomModel.remain <= MJRoomModel.renshu && (temp == MJAction.AN_GANG || temp == MJAction.GANG))){
                        //????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????
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
                    }else{//????????????,??????????????????
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

                }.bind(this);

                if(obj.hasHu){
                    var optStr = "???";
                    if(temp == MJAction.PENG)optStr = "???";
                    AlertPop.show("?????????????????????????????????????????????" + optStr +"?????????",function(){
                        doFunc();
                    });
                }else{
                    doFunc();
                }

                break;
            case MJAction.GUO:
                var allButtons = [];
                for(var i=0;i<MJRoomModel.selfAct.length;i++){
                    if(MJRoomModel.selfAct[i]==1)
                        allButtons.push(i);
                }
                //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                if(MJRoomModel.selfAct[7]==1&&allButtons.length==1){
                    this.Panel_btn.visible = false;
                    MJRoomModel.nextSeat = MJRoomModel.mySeat;
                    MJRoomModel.selfAct.length=0;
                }else{
                    var playType = (MJRoomModel.remain < MJRoomModel.renshu) ? 13 : 5;
                    var allMJs = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
                    var guoParams = (allMJs.length%3==2) ? [1] : [0];
                    ArrayUtil.merge(MJRoomModel.selfAct,guoParams);
                    if(obj.hasHu){
                        //Network.logReq("MJRoom::guo click...1");
                        AlertPop.show("?????????????????????????????????????????????????????????",function(){
                            //Network.logReq("MJRoom::guo click...2");
                            MJRoomModel.sendPlayCardMsg(playType,guoParams);
                        });
                    }else{
                        //Network.logReq("MJRoom::guo click...3");
                        MJRoomModel.sendPlayCardMsg(playType,guoParams);
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
        //this.Label_jsq.setString("?????????\n"+strShi+":"+strFen);
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
            if(layout)//?????????????????????????????????
                layout.clean();
        }
        this.btnInvite.visible = this.btnReady.visible =false;
        var p = event.getUserData();
        this.showJianTou();
        this.updateCountDown(this.COUNT_DOWN);
        var direct = MJRoomModel.getPlayerSeq(PlayerModel.userId,MJRoomModel.mySeat,MJRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        this.hideAllBanker();
        this._players[p.banker].isBanker(true);
        //??????3???????????????
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
        if(!isTing)
            this.refreshButton(p.selfAct);

        this.showPiaoBtn(false);
        this.showWaitSelectPiao(false);
        if(this.piaofenTime){
            clearTimeout(this.piaofenTime);
            this.piaofenTime = null;
        }

        //???????????????????????????????????????
        if(p.baoting)MJRoomModel.nextSeat = 0;

        // var self = this;
        // setTimeout(function(){//??????????????????????????????createTable?????????????????????
        if(this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(false);
        }
        this.Panel_niaoPai.removeAllChildren();
        // },100);
        

    },

    //refreshXiaoHu:function(xiaohu){
    //    this.Image_xiaohu.visible = false;
    //    if(xiaohu && xiaohu.length>0){
    //        for(var i=0;i<xiaohu.length;i++){
    //            if(xiaohu[i]==1){
    //                this.Image_xiaohu.visible = true;
    //                this.Button_xiaohu.loadTextureNormal("res/res_mj/mjRoom/btn_cs_xiaohu_"+(i+1)+".png");
    //                break;
    //            }
    //        }
    //    }
    //},
    /**
     *
     * @param selfAct {Array.<number>}
     */
    refreshButton:function(selfAct){
        cc.log("selfAct =",JSON.stringify(selfAct));
        //selfAct = [0,0,0,1,0,0,1]  0??? 1??? 2?????? 3?????? 4?????? 5?????? 6??????
        MJRoomModel.selfAct = selfAct || [];

        //???????????????????????????????????????????????????
        if(selfAct[2] == 1 && selfAct[3] == 1) {
            selfAct = ObjectUtil.deepCopy(selfAct);
            selfAct[3] = 0;
        }

        if(selfAct.length>0){
            this.resetBtnPanel();
            this.Panel_btn.visible = true;
            var textureMap = {
                0:{t:"res/res_mj/mjRoom/mj_btn_hu.png",v:1},
                1:{t:"res/res_mj/mjRoom/mj_btn_peng.png",v:2},
                2:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:3},
                3:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:4},
                4:{t:"res/res_mj/mjRoom/mj_btn_gang.png",v:7},
                6:{t:"res/res_mj/mjRoom/mj_btn_ting.png",v:14}
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
            //???
            this.hbtns[rIndex].visible = true;
            this.hbtns[rIndex].loadTextureNormal("res/res_mj/mjRoom/mj_btn_guo.png");
            this.hbtns[rIndex].temp = 5;
            this.hbtns[rIndex].hasHu = hasHu;
            //if(btnCount == 1 && selfAct[7] == 1){//?????????????????????????????????
            //    this.hbtns[rIndex].visible = false;
            //}
            rIndex++;
            var localStartX = this.hbtns[0].x;//?????????????????????
            var offsetX = 250;//????????????
            var localCount = 1;//???????????????????????????
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp==1 && tm){
                    this.hbtns[rIndex].visible = true;
                    this.hbtns[rIndex].loadTextureNormal(tm.t);
                    this.hbtns[rIndex].temp = parseInt(tm.v);
                    this.hbtns[rIndex].hasHu = hasHu;
                    //this.lastBtnX = this.hbtns[rIndex].x;
                    this.hbtns[rIndex].x = localStartX - offsetX * localCount;
                    ++localCount;
                    rIndex++;
                    textureLog+=tm.t+",";
                }
            }

            for(;rIndex<6;rIndex++){
                this.hbtns[rIndex].visible = false;
            }
        }
    },

    onGetMajiang:function(event){
        var message = event.getUserData();
        var seat = message.seat;
        MJRoomModel.nextSeat = seat;
        var selfAct = message.selfAct;//[???,???,???]
        var ids = message.majiangIds;
        this.showJianTou(seat);
        //this.refreshButton(selfAct);
        var id = ids.length>0 ? ids[0] : 0;
        this.getLayout(MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat)).moPai(id);
        if(selfAct.length == 0 && message.remain < MJRoomModel.renshu){
            this.showJianTou(-1);
            if(message.userId == PlayerModel.userId){
                MJRoomModel.sendPlayCardMsg(13,[]);
            }
        }
        this.refreshButton(selfAct);
        MJRoomModel.remain-=1;
        this.updateRemain();
        PlayMJMessageSeq.finishPlay();
    },

    /**
     * ??????????????????
     * @param id
     * @param seat
     * @param direct
     * @param userId
     */
    chuPaiAction:function(id,seat,direct,userId){
        this.lastLetOutMJ = id;
        this.lastLetOutSeat = seat;
        if(this.lastLetOutMJ==MJRoomModel.needAutoLetOutId)//???????????????????????????
            MJRoomModel.needAutoLetOutId = 0;
        var vo = MJAI.getMJDef(id);
        this.showJianTou(-1);
        MJRoomSound.letOutSound(userId,vo);
        this.layouts[direct].chuPai(vo);
        this._players[seat].chuPai(vo);
        MJRoomSound.pushOutSound();
        if(seat==MJRoomModel.mySeat){
            //????????????????????????????????????????????????????????????????????????
            if(!MJRoomModel.isTing(seat) && MJRoomModel.isTrusteeship){
                MJRoomModel.mineLayout.yjmjCancelTingPai();
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
     * ???????????????????????????????????????
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

        if(action == 13){//?????????
            this.onGuoByHaidi(event);
            return;
        }

        if(ext && ext.length>0)
            isOtherHasAction = parseInt(ext[0]);
        var direct = MJRoomModel.getPlayerSeq(userId,MJRoomModel.mySeat,seat);
        //????????????????????????????????????????????????????????????????????????????????????????????????
        if(seat==MJRoomModel.mySeat&&action==0&&ids.length>0&&!simulate){
            if(this.getLayout(1).getOneMahjongOnHand(ids[0])==null) {
                PlayMJMessageSeq.finishPlay();
                return;
            }
        }
        MJRoomModel.isTingSelecting=false;
        MJRoomModel.lzTingResult.length = 0;

        if(action == 14 && direct != 1){
            //??????????????????????????????????????????
        }else{
            this.Panel_btn.visible = this.btn_back.visible = false;
        }

        for(var lay in this.layouts){
            this.layouts[lay].hideFinger();
        }

        //?????????????????????????????????????????????
        if(selfAct[0] == 1 && MJRoomModel.remain < MJRoomModel.renshu){
            if(this.getChildByTag(this.HAIDI_MEIHU + 1))
                this.removeChildByTag(this.HAIDI_MEIHU + 1);
        }

        cc.log("=========letoutcard===========",action,isOtherHasAction,seat);

        this.updateRemain();
        switch (action){
            case MJAction.CHU_PAI://????????????
                //????????????????????????
                this._players[seat].setPlayerOnLine();
                if(isOtherHasAction==0){
                    var nextSeat = MJRoomModel.seatSeq[seat][1];
                    MJRoomModel.nextSeat = nextSeat;
                }
                if(ids.length>0 && !simulate){
                    this.chuPaiAction(ids[0],seat,direct,userId);
                }
                break;
            case MJAction.HU://????????????
                var lastId = ids[ids.length-1];
                this.layouts[direct].huPai(ids,message.zimo,message.fromSeat);
                //var huArray = message.huArray;
                var prefix = (message.zimo==1) ? "zimo" : "hu";
                MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
                MJRoomSound.actionSound(userId,prefix);
                if(prefix=="hu" && this.lastLetOutSeat>0){
                    var lastseq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,this.lastLetOutSeat);
                    MJRoomEffects.normalAction(this.root,"dianpao",this.getWidget("cp"+lastseq),[],userId);
                }

                if(message.fromSeat){
                    var fromDirect = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].beiPengPai(lastId);
                }

                break;
            case MJAction.GUO://???
                if(isOtherHasAction == 0)
                    MJRoomModel.nextSeat = seat;
                this.showJianTou();
                //???????????????????????????????????????????????????????????????
                if(MJRoomModel.needAutoLetOutId>0)
                    MJRoomModel.chuMahjong(MJRoomModel.needAutoLetOutId);
                break;
            case MJAction.XIAO_HU://?????? ????????????????????????
                //this.layouts[direct].xiaohu(ids);
                //var huArray = message.huArray;
                //MJRoomEffects.normalAction(this.root,"btn_cs_xiaohu_"+huArray[0],this.getWidget("cp"+direct));
                break; 
            case 14://???????????????????????????????????????????????????
                prefix = "ting";
                MJRoomModel.ting(seat);
                var self = this;
                this._players[seat].setTingState(true);

                MJRoomEffects.normalAction(self.root,prefix,self.getWidget("cp"+direct));
                MJRoomSound.actionSound(userId,prefix);
                setTimeout(function(){
                    if(ids.length>0){
                        self.chuPaiAction(ids[0],seat,direct,userId);
                    }
                    if(seat==MJRoomModel.mySeat){
                        self.layouts[direct].yjmjGangPai();
                    }
                },500);
                break;
            default://?????????????????????????????????
                //var displayForGang = false;
                var showTing = true;
                var beiPengId = ids[ids.length-1];
                var prefix = "peng";
                if(action==MJAction.BU_ZHANG){
                    prefix = "gang";
                    showTing = false;
                }else if(action==MJAction.CHI){
                    beiPengId = ids[1];
                    prefix = "chi";
                }else if(ids.length>3 || ids.length==1){
                    prefix = "gang";
                    //??????????????????????????????????????????????????????
                    //displayForGang = (seat==MJRoomModel.mySeat && (MJRoomModel.isTing(seat) || MJRoomModel.isHued(seat)));//(MJRoomModel.wanfa==2&&seat==MJRoomModel.mySeat && !MJRoomModel.isGang());
                    MJRoomModel.gang(seat);
                    showTing = false;
                }
                this.layouts[direct].pengPai(ids,action,message.fromSeat);
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

        if(action == 14 && direct != 1){
            //??????????????????????????????????????????
        }else{
            this.refreshButton(selfAct);
        }

        this.clearTingArrows();
        // this.removeHuPanel();
        PlayMJMessageSeq.finishPlay();
    },

    refreshTingNum:function(card){
        var num = 4;

        if(card._cardVo.i == 201 && MJRoomModel.intParams[31]){
            num = 8;//???????????????
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
     * ?????????????????????
     */
    smartFitlerMayHuPai:function(isReconect){
        var allMJs = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
        //?????????????????????????????????????????????????????????????????????????????????
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
        //???????????????????????????????????????????????????????????????????????????
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
                var card = new YJMahjong(MJAI.getDisplayVo(1,4),list[key]);
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
     * ??????
     */
    onInvite:function(){
        var wanfa = "????????????";
        var queZi = MJRoomModel.renshu + "???"+(MJRoomModel.renshu - MJRoomModel.players.length);
        var obj={};
        obj.tableId=MJRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+MJRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  ??????['+MJRoomModel.tableId+"] "+queZi;

        var youxiName = "????????????";
        if(MJRoomModel.tableType == 1){
            youxiName = "[?????????]????????????"
        }
        obj.description=csvhelper.strFormat("{0} {1}???",youxiName,MJRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    onJoin:function(event){
        var p = event.getUserData();
        var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
        this._players[p.seat] = new MJPlayer(p,this.root,seq);
        var me = MJRoomModel.getPlayerVo();
        this.btnInvite.visible = (ObjectUtil.size(this._players)<MJRoomModel.renshu);
        var seats = MJRoomModel.isIpSame();
        if(seats.length>0 && MJRoomModel.renshu != 2){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
            PopupManager.addPopup(new GpsPop(MJRoomModel , MJRoomModel.renshu));
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        layout = new YJMJLayout();
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
