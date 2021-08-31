/**
 * Created by Administrator on 2020/6/3.
 */
var XPLPRoom = BaseRoom.extend({
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
        if (XPLPRoomModel.isOpenTuoguan()){
            this.COUNT_DOWN = XPLPRoomModel.intParams[11] == 1?60:XPLPRoomModel.intParams[11];
        }
        this._super(json);
    },

    onRemove:function(){
        if(this.setUpTimeId>=0)
            clearTimeout(this.setUpTimeId);
        this.tingList.length=0;
        this._effectLayout.cleanData();
        BaseRoom.prototype.onRemove.call(this);
        XPLPRoomModel.mineLayout = null;
    },

    getModel:function(){
        return XPLPRoomModel;
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
            if(i<=XPLPRoomModel.renshu){
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
        this.Button_gps = this.getWidget("Button_gps");
        if (SyConfig.HAS_GPS && XPLPRoomModel.renshu >2) {
            if(GPSModel.getGpsData(PlayerModel.userId) == null){
                this.Button_gps.setBright(false);
            }else{
                this.Button_gps.setBright(true);
            }
        } else {
            this.Button_gps.visible = false;
        }
        //this.Button_gps.x = 190;
        //this.Button_gps.y = 680;
        this.Button_75 = this.getWidget("Button_75");//设置
        UITools.addClickEvent(this.Button_75,this,this.onSetUp);

        this.btnInvite.y = 400;
        this.getWidget("label_version").setString(SyVersion.v);
        //this.Button_gps.visible =false;
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
        this.Label_jsq = this.getWidget("Label_jsq");//计时器
        //this.Label_jsq.setString("计时器\n00:00");
        this.Label_jsq.setString("");
        this.roomName_label = new cc.LabelTTF("","Arial",40,cc.size(500, 45));
        this.addChild(this.roomName_label, 10);
        if (XPLPRoomModel.roomName){
            this.roomName_label.setString(XPLPRoomModel.roomName);
            this.roomName_label.setColor(cc.color(214,203,173));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = cc.winSize.width/2 - 840;
            this.roomName_label.y = cc.winSize.height/2 + 300;
        }

        this.Button_ting = this.getWidget("Button_ting");//听牌按钮
        this.updateBgColor();

        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//取消托管按钮
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

        this.Panel_maidian = this.getWidget("Panel_maidian");
        this.Button_1dian = this.getWidget("Button_1dian");
        this.Button_1dian.temp = 1;
        this.Button_2dian = this.getWidget("Button_2dian");
        this.Button_2dian.temp = 2;
        this.Button_bumai = this.getWidget("Button_bumai");
        this.Button_bumai.temp = 0;
        this.Panel_maidian.visible = false;

        UITools.addClickEvent(this.Button_ting,this,this.onShowHuPanel);
        UITools.addClickEvent(this.btn_back,this,this.onBackFromTing);
        UITools.addClickEvent(this.Button_9,this,this.onCheckResult);
        UITools.addClickEvent(this.Button_10,this,this.onJixuFromResult);
        UITools.addClickEvent(this.Panel_20,this,this.onCancelSelect,false);
        UITools.addClickEvent(this.Button_setup1,this,this.onShowSetUp);
        UITools.addClickEvent(this.Button_info,this,this.onRoomInfo);
        UITools.addClickEvent(this.Button_gps,this,this.onGPS);
        UITools.addClickEvent(this.Button_1dian,this,this.onMaiDian);
        UITools.addClickEvent(this.Button_2dian,this,this.onMaiDian);
        UITools.addClickEvent(this.Button_bumai,this,this.onMaiDian);

        this.addCustomEvent("XPLP_GET_MJ",this,this.onGetMajiang);
        this.addCustomEvent(SyEvent.SELECT_MAJIANG,this,this.onSelectMajiang);
        this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS , this,this.updateGpsBtn);
        this.addCustomEvent(SyEvent.ROOM_ROLD_ICON , this,this.setRoldPlayerIcon);
        //this.addCustomEvent(SyEvent.SHOW_HU_CARDS , this,this.onShowHuCardsByTingPai);
        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE,this,this.updateBgColor);
        this.addCustomEvent(SyEvent.SHOW_DESKTTOP_CARDS,this,this.onShowDesktopCards);
        this.addCustomEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS,this,this.onHideDesktopCards);
        this.addCustomEvent(SyEvent.FIND_HU_BY_PUTOUT,this,this.onFindCardsByPutout);
        this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction);
        this.addCustomEvent(SyEvent.DAPAI_TING,this,this.outCardTing);
        this.addCustomEvent(SyEvent.SHOW_TING_CARDS , this,this.onShowAllHuCards);
        this.addCustomEvent(SyEvent.SHOW_HU_CARDS , this,this.onShowHuPanel);
        this.addCustomEvent(SyEvent.HIDE_HU_CARDS , this,this.removeHuPanel);
        //this.addCustomEvent(SyEvent.BSMJ_MAI_DIAN , this,this.StartMaiDian);
        //this.addCustomEvent(SyEvent.BSMJ_MAI_DIAN_FINISH , this,this.finishMaiDian);
        this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);
        this.addCustomEvent(SyEvent.CHANGE_MJ_BG , this,this.changeMjBg);
        this.addCustomEvent(SyEvent.CHANGE_MJ_CARDS , this,this.changeMjzi);

        this.addCustomEvent(SyEvent.BSMJ_SHOWBAOTING , this,this.showBaoTing);
        this.addCustomEvent(SyEvent.BSMJ_BAOTINGCLICK , this,this.baoTingClick);

        this.addCustomEvent(SyEvent.PLAY_CARD_AFTER_XIAOHU,this,this.onXiaoHuPlayCard);

        this.addCustomEvent(SyEvent.ZZMJ_PIAOFEN , this,this.StartPiaoFen);
        this.addCustomEvent(SyEvent.ZZMJ_FINISH_PIAOFEN , this,this.FinishPiaoFen);

        this.addCustomEvent("XPLP_THROW_ERROR" , this,this.fixMyCard);/** 出牌错误补牌 **/

        this.countDownLabel = new cc.LabelBMFont("15","res/font/font_mj3.fnt");
        this.countDownLabel.x = this.jt.width/2+2;
        this.countDownLabel.y = this.jt.height/2+2;
        this.jt.addChild(this.countDownLabel);
        this._effectLayout = new XPLPEffectLayout(this.root, this);

        this.recordBtn.x = 70;
        this.recordBtn.y = 550;
        if(XPLPRoomModel.renshu > 2){
            this.recordBtn.y = 480;
            this.getWidget("Button_52").y = 480;
			if(XPLPRoomModel.renshu === 4){
				this.recordBtn.y = 420;
            	this.getWidget("Button_52").y = 420;
            	this.recordBtn.x = this.getWidget("Button_52").x - 120;
            }
        }

        XPLPRoomModel.isCloseHandCard = false;//关闭锁牌

        //this.getWidget("mPanel1").y = 20;
        // this.getWidget("mPanel1").x = this.getWidget("mPanel1").x - (cc.winSize.width - 1280)/2;

        var huBg = "res/res_mj/res_bsmj/bsmjRoom/img_ting1.png";
        this.Panel_hupai = new cc.Scale9Sprite(huBg,null,cc.rect(10,10,1,1));
        this.Panel_hupai.x = 30;//720;
        this.Panel_hupai.y = 20;//300;
        if(XPLPRoomModel.renshu == 4){
            this.Panel_hupai.y = 180;
        }
        this.Panel_hupai.height = 220;
        this.Panel_hupai.anchorX = this.Panel_hupai.anchorY = 0;
        this.root.addChild(this.Panel_hupai,999);

        this.button_wanfa =  new ccui.Button("res/res_mj/res_bsmj/bsmjRoom/wanfa.png","","");
        this.Panel_20.addChild(this.button_wanfa);
        this.button_wanfa.y = this.Button_setup1.y;
        this.button_wanfa.x = 1710;
        UITools.addClickEvent(this.button_wanfa,this,this.showWanFaImg);
        this.initwanfaImg();
        this.showWanFaImg();

        this.Panel_8.x += 400;
        this.Panel_8.y -= 30;

        this.getWidget("mPanel"+1).x += 220;
        this.getWidget("mPanel"+1).y -= 30; /** 往下压一点手牌 */

        if(XPLPRoomModel.renshu == 4){
            this.getWidget("oPanel"+1).y += 30;
            this.getWidget("oPanel"+1).x -= 30;
            this.getWidget("oPanel"+3).x -= 475;
            this.getWidget("oPanel"+3).y -= 45;
            this.getWidget("oPanel"+2).x += 180;
            this.getWidget("oPanel"+4).x -= 180;

            this.getWidget("Button_cp1").x -= 5;
            this.getWidget("Button_cp1").y += 5;
            this.getWidget("Button_cp2").x += 195;
            this.getWidget("Button_cp2").y += 70;
            this.getWidget("Button_cp3").x -= 125;
            this.getWidget("Button_cp3").y -= 10;
            this.getWidget("Button_cp4").x -= 170;
            this.getWidget("Button_cp4").y += 70;

            this.getWidget("mPanel"+2).y += 65;
            this.getWidget("mPanel"+2).x += 200;

            this.getWidget("mPanel"+4).y -= 30;
            this.getWidget("mPanel"+4).x -= 200;
        }else if(XPLPRoomModel.renshu == 3){
            this.getWidget("oPanel"+3).x -= 45;
            this.getWidget("oPanel"+2).x += 20;
        }else if(XPLPRoomModel.renshu == 2){
            this.getWidget("oPanel"+2).x -= 1305;
            this.getWidget("oPanel"+2).y -= 30;
            this.getWidget("oPanel"+1).x -= 50;
            this.getWidget("oPanel"+1).y += 50;
        }
        this.getWidget("cp1").y = 480;
        this.newUpdateFace();
        //this.adjustInviteBtn();

        this.outTingInfo =[];

        this.Panel_btn.y += 130;
        XPLPRoomModel.guchouSeat = -1;
        cc.spriteFrameCache.addSpriteFrames(res.xplp_cards_plist);

        if(XPLPRoomModel.renshu == 4){
            this.Button_showBg = this.getWidget("Button_showBg");

            for(var i=1;i<=4;i++){
                var btn = this.getWidget("Button_click"+i);
                btn.temp = i;
                UITools.addClickEvent(btn,this,this.onClickBg);
                btn.visible = false;

                var cpBtn = this.getWidget("Button_cp"+i);
                cpBtn.temp = i;
                UITools.addClickEvent(cpBtn,this,this.onCPClickBg);
                cpBtn.visible = false;
            }
            UITools.addClickEvent(this.Button_showBg,this,this.onShowBgClick);
        }
    },

    onCPClickBg:function(btn){
        var index = btn.temp;
        var layout = this.getLayout(index);
        if(layout){
            var data = layout.getPlace3Data();
            if(data.length > 0){
                var localNum = 16;
                var localLength = data.length > localNum ? localNum : data.length;
                for(var i = 0;i < data.length;++i){
                    var card = new XPLPCard(XPLPAI.getDisplayVo(1,4),data[i]);
                    if(localLength / 2 === 0){
                        card.x = 960 + ((1 + localLength) / 2 + i%localNum) * card.scale * card.width + 240;
                    }else{
                        card.x = 960 + ((1 - localLength) / 2 + i%localNum) * card.scale * card.width + 240;
                    }
                    card.y = 540 - Math.floor(i / localNum) * 330;
                    this.Button_showBg.addChild(card);
                }
                this.Button_showBg.visible = true;
            }
        }
    },

    onClickBg:function(btn){
        var index = btn.temp;
        var layout = this.getLayout(index);
        if(layout){
            var data = layout.getPlace2Data();
            if(data.length > 0){
                for(var i = 0;i < data.length;++i){
                    var card = new XPLPCard(XPLPAI.getDisplayVo(1,4),data[i]);
                    if(data.length / 2 === 0){
                        card.x = 960 + ((1 + data.length) / 2 + i) * card.scale * card.width + 240;
                    }else{
                        card.x = 960 + ((1 - data.length) / 2 + i) * card.scale * card.width + 240;
                    }
                    card.y = 540;
                    this.Button_showBg.addChild(card);
                }
                this.Button_showBg.visible = true;
            }
        }
    },

    onShowBgClick:function(){
        this.Button_showBg.visible = false;
        this.Button_showBg.removeAllChildren();
    },

    updateClickCpBg:function(){
        if(XPLPRoomModel.renshu == 4){
            var size = cc.director.getWinSize();
            //var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
            for(var i=1;i<=4;i++){
                var btn = this.getWidget("Button_cp"+i);
                if(btn){
                    var layout = this.getLayout(i);
                    var data = layout.getPlace3Data();
                    if(data.length > 0){
                        btn.visible = true;
                        var offX = 100;
                        var offY = 75;
                        var startWidth = 80;
                        var startHeight = 220;
                        var rowCount = 5;
                        if(i == 1 || i == 3){
                            startWidth = 220;
                            startHeight = 80;
                            rowCount = 6;
                            offX = 75;
                            offY = 75;
                            btn.width = startWidth + (data.length > rowCount ? rowCount : data.length) * offX;
                            btn.height = startHeight + Math.floor((data.length - 1) / rowCount) * offY;
                        }else{
                            btn.width = startWidth + Math.floor((data.length - 1) / rowCount) * offX;
                            btn.height = startHeight + (data.length > rowCount ? rowCount : data.length) * offY;
                        }
                    }else{
                        btn.visible = false;
                    }
                }
            }
        }
    },

    updateClickBg:function(){
        if(XPLPRoomModel.renshu == 4){
            var size = cc.director.getWinSize();
            //var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
            for(var i=1;i<=4;i++){
                var btn = this.getWidget("Button_click"+i);
                if(btn){
                    var layout = this.getLayout(i);
                    var data = layout.getPlace2Data();
                    if(data.length > 0){
                        btn.visible = true;
                        var offX = 50;
                        if(i == 1){
                            if(size.width > SyConfig.DESIGN_WIDTH){
                                offX = 320;
                            }else{
                                offX = 270;
                            }
                        }
                        btn.width = data.length / 3 * offX;
                    }else{
                        btn.visible = false;
                    }
                }
            }
        }
    },

    newUpdateFace:function(){//宽屏适配
        var size = cc.director.getWinSize();
        var tempSize = (size.width - SyConfig.DESIGN_WIDTH)/2;
        var offx = tempSize > 100 ? 50 : tempSize/2;
        if(size.width > SyConfig.DESIGN_WIDTH){
            if(XPLPRoomModel.renshu == 4){
                this.recordBtn.x += tempSize - offx;
                this.getWidget("Button_52").x += tempSize - offx;

                this.getWidget("mPanel"+2).x += tempSize - offx;
                this.getWidget("mPanel"+4).x -= tempSize - offx;

                this.getWidget("Button_click1").y += 20;
                this.getWidget("Button_click1").x -= tempSize - offx - 50;

                this.getWidget("Button_click2").x += tempSize - offx;
                this.getWidget("Button_click4").x -= tempSize - offx;

                this.Panel_hupai.x -= tempSize - offx;

            }else{
                this.recordBtn.x -= tempSize - offx;
                this.getWidget("Button_52").x += tempSize - offx;
            }

            this.Button_ting.x += tempSize - offx;
            this.button_wanfa.x += tempSize - offx;
            this.Button_setup1.x += tempSize - offx;
            this.Image_setup.x += tempSize - offx;
            this.Button_gps -= tempSize - offx;
            this.getWidget("label_version").x -= tempSize - offx;
            this.getWidget("netType").x -= tempSize - offx;
            this.getWidget("Image_19").x -= tempSize - offx;
            this.getWidget("Label_time").x -= tempSize - offx;
            this.Label_info0.x -= tempSize - offx;
            this.roomName_label.x = 120 + offx;

            if(XPLPRoomModel.renshu == 4){
                this.Image_info1.x -= tempSize - offx;
                this.Image_info2.x -= tempSize - offx;
            }else if(XPLPRoomModel.renshu == 2){
                this.Image_info1.x += tempSize - offx;
                this.Image_info2.x -= tempSize - offx;
            }
        }
    },

    fixMyCard:function(event){
        //后台出牌异常 补回缺失的卡
        if(event){
            var message = event.getUserData();
            var params = message.params;
            var action = params[0];
            var id = params[1];
            this.cleanChuPai();
            if(action == 0){
                FloatLabelUtil.comText("吃碰后不能出同张！！！");
                XPLPRoomModel.nextSeat = XPLPRoomModel.mySeat;
                this.showJianTou(XPLPRoomModel.mySeat);
                if(id){
                    this.getLayout(1).fixOutCard(id);
                    this.getLayout(1).moPai(id);
                    if(this.outTingInfo.length > 0){
                        this.outCardTingPai(this.outTingInfo);
                    }
                }
            }
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

    onXiaoHuPlayCard:function(){
        //cc.log("==========onXiaoHuPlayCard==========");
        this.Label_info_mj.setString("");
        var self = this;
        setTimeout(function(){//延时一下，应对开局时createTable消息后到的情况
            XPLPRoomModel.nextSeat = XPLPRoomModel.mySeat;
            XPLPRoomModel.isCloseHandCard = false;//关闭锁牌
            self.getLayout(1).updateCardColor();
        },100);
    },

    showBaoTing:function(event){
        var type = event.getUserData();
        //cc.log("BSMJ showBaoTing **************",type);
        if(XPLPRoomModel.banker == XPLPRoomModel.mySeat){
            this.Label_info_mj.setString("");
        }
        this.showBaoTingBtn(true);
    },

    baoTingClick:function(event){
        var msg = event.getUserData();
        var params = msg.params;
        var seat = params[0];
        var isBool = params[1];
        cc.log(" params = ",params);
        if (this._players[seat]) {
            this._players[seat].BSMJBaoTing(isBool == 1);
        }
        //if(seat == XPLPRoomModel.mySeat){
            this.showBaoTingBtn(false);
        //}
    },

    showBaoTingBtn:function(isBool){
        if(isBool){
            if(!this.baotingNode) {
                this.baotingNode = new cc.Node();
                this.baotingNode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 20);
                this.root.addChild(this.baotingNode,100);

                var btn_hu = new ccui.Button();
                btn_hu.setTouchEnabled(true);
                btn_hu.setPressedActionEnabled(true);
                btn_hu.loadTextures("res/res_phz/xplp/guChou.png","","");
                UITools.addClickEvent(btn_hu,this,this.onOperate);
                btn_hu.temp = 14;
                btn_hu.x = -250;
                btn_hu.y = -60;
                this.baotingNode.addChild(btn_hu);

                var btn_guo = new ccui.Button();
                btn_guo.setTouchEnabled(true);
                btn_guo.setPressedActionEnabled(true);
                btn_guo.loadTextures("res/res_phz/xplp/noGuChou.png","","");
                UITools.addClickEvent(btn_guo,this,this.onOperate);
                btn_guo.temp = 5;
                btn_guo.x = 250;
                btn_guo.y = -60;
                this.baotingNode.addChild(btn_guo);
            }
            this.baotingNode.setVisible(true);
        }else{
            if(this.baotingNode){
                this.baotingNode.setVisible(false);
            }
        }
    },

    onBSMJClickTing:function(){
        sySocket.sendComReqMsg(6102,[1]);
    },

    onBSMJClickGuo:function(){
        sySocket.sendComReqMsg(6102,[2]);
    },

    showWanFaImg:function(){
        this.Image_setup.visible = false;
        this.Button_setup1.setBright(!this.Image_setup.visible);
        if (this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(!this.Panel_20.getChildByName("wanfaImg").isVisible());
        }
    },
    initwanfaImg:function(){
        var wanfaStr = ClubRecallDetailModel.getSpecificWanfa(XPLPRoomModel.intParams);
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
            var bg = UICtor.cS9Img("res/res_mj/res_bsmj/bsmjRoom/xiala.png",cc.rect(5,17,117,5),cc.size(320,bgHeigh));
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
    changeMjBg:function(event){
        var type = event.getUserData();
        cc.log("BSMJ changeMjbg **************",type);
        for(var lay in this.layouts){
            this.layouts[lay].changeMahjongRes(type);
        }
    },
    changeMjzi:function(event){
        var type = event.getUserData();
        cc.log("BSMJ changeMjbg **************",type);
        for(var lay in this.layouts){
            this.layouts[lay].changeMahjongZi(type);
        }
    },


    showPiaoBtn:function(isShow){
        for(var i=1;i<=XPLPRoomModel.renshu;i++){
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
        if(isShow){
            if(!this.piaoBtnNode){
                this.piaoBtnNode = new cc.Node();
                this.piaoBtnNode.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 50);
                this.addChild(this.piaoBtnNode,5);
                var imgArr = ["button_chong0.png","button_chong1.png","button_chong2.png","button_chong3.png","button_chong4.png"];
                var offsetX = 300;//170;
                var startX = -(imgArr.length - 1)/2*offsetX;
                for(var i = 0;i<imgArr.length;++i){
                    var img = "res/res_phz/xplp/" + imgArr[i];
                    var btn = new ccui.Button(img);
                    btn.setTag(i);
                    btn.setScale(0.75);
                    btn.setPosition(startX + offsetX*i,0);
                    UITools.addClickEvent(btn,this,this.onPiaoFen);
                    this.piaoBtnNode.addChild(btn);
                }
            }
            this.piaoBtnNode.setVisible(true);
        }else{
            this.piaoBtnNode && this.piaoBtnNode.setVisible(false);
        }
    },


    onPiaoFen:function(sender){
        //飘分
        var temp = sender.getTag();
        sySocket.sendComReqMsg(2023,[temp]);
    },

    StartPiaoFen:function(message){
        var params = message.getUserData().params;
        this.showPiaoFenPanel();
        // this.isPiaoFenNow = true;
        this.showWaitSelectPiao(true);
    },
    FinishPiaoFen:function(event){
        var message = event.getUserData();
        var params = message.params;
        cc.log("params",params);
        var userId = params[0];
        var p = XPLPRoomModel.getPlayerVo(userId)
        if (params[1] != -1){
            this._players[p.seat].showPiaoFenImg(params[1])
            XPLPRoomSound.actionSound(userId,"chong"+params[1]);
            if (p.seat == XPLPRoomModel.mySeat){
                //this.Panel_piaofen.visible = false;
                this.showPiaoBtn(false);
            }
        }else{
            this.showWaitSelectPiao(true);
        }
        // this.isPiaoFenNow = false;
    },
    showWaitSelectPiao:function(isShow){
        if(isShow){
            if(!this.waitPiaoImg){
                this.waitPiaoImg = new cc.Sprite("res/res_phz/xplp/word_chongfen.png");
                this.waitPiaoImg.setPosition(cc.winSize.width/2 + 50,cc.winSize.height/2 + 120);
                this.addChild(this.waitPiaoImg,4);
            }
            this.waitPiaoImg.setVisible(true);
        }else{
            this.waitPiaoImg && this.waitPiaoImg.setVisible(false);
        }
    },
    showPiaoFenPanel:function() {
        // cc.log("type = ",type);
        for(var i=1;i<=XPLPRoomModel.renshu;i++){
            var mjp = this._players[i];
            if(mjp){
                mjp.startGame();
            }
        }
        this.showPiaoBtn(true);
        //this.Panel_piaofen.visible = true;
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
        for (var i = 0; i < XPLPRoomModel.lzTingResult.length; i++) {
            var putOut = XPLPRoomModel.lzTingResult[i].pushOut;
            if (putOut.i == card.i) {
                var ting = XPLPRoomModel.lzTingResult[i].ting;
                this.onShowHuCards(ting);
                return;
            }
        }
        var data1 = XPLPRoomModel.mineLayout.getPlace1Data();
        var handCards = ArrayUtil.clone(data1);
        var index = XPLPAI.findIndexByMJVoC(handCards,card.c);
        if(index>=0){
            handCards.splice(index,1);
        }
        var hu = new MajiangSmartFilter();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(XPLPRoomModel.getFuType());
        huBean.setJiangLei(XPLPRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(XPLPAI.getJiangDefList(XPLPRoomModel.getJiangConf()));
        var start = new Date().getTime();
        var result = hu.findHuCards(handCards,huBean);
        //cc.log("onFindCardsByPutout cost Time :::::"+(new Date().getTime() - start))
        XPLPRoomModel.lzTingResult.push({ting: result, pushOut: card});
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
        var p = XPLPRoomModel.getPlayerVo(userId);
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
            if(seat == XPLPRoomModel.mySeat && this.bg_CancelTuoguan){
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
        var self = this;
        this.outTingInfo =[];
        //setTimeout(function(){
        if (info){
            for(var j=0;j < info.length; j++){
                if (info[j].majiangId){
                    var list = info[j].tingMajiangIds;
                    var num = 0;
                    for(var lay in self.layouts){
                        num = num + self.layouts[lay].getCardAllNumById(list);
                    }

                    info[j].tingNum =  list.length * 4 - num;
                }
            }
            this.outTingInfo = info;
            this.outCardTingPai(info);
        }
        //},100);
    },

    outCardTingPai:function(info){
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
        XPLPRoomModel.huCards = tingData.huCards || [];
        //if (tingData.isShow){
        this.onShowHuPanel(1);
        //}
    },

    //显示可胡牌层
    onShowHuPanel:function(isShowAllTime){
        var huList = XPLPRoomModel.huCards;
        if (huList && huList.length > 0){
            var scale_num = 0.5;//0.75;
            this.Panel_hupai.removeAllChildren();
            if (isShowAllTime === 1){
                this.Panel_hupai.visible = true;
            }else{
                this.Panel_hupai.visible = !this.Panel_hupai.isVisible();
            }
            if (huList.length > 14){
                this.Panel_hupai.width = 14 * 103*scale_num + 30;
                this.Panel_hupai.height = 500;//180;
            }else{
                this.Panel_hupai.width = huList.length * 103*scale_num + 20;
                this.Panel_hupai.height = 220;//130;
            }
            //听牌的底
            for (var i = 0; i < huList.length; i++) {
                var height = Math.floor(i/14);
                var width = Math.floor(i%14);
                var vo = XPLPAI.getMJDef(huList[i]);
                var card = new XPLPCard(XPLPAI.getDisplayVo(1, 2), vo);
                card.scale = scale_num;
                var size = card.getContentSize();
                card.x = 10 + width * (size.width*scale_num + 2*scale_num);
                card.y = this.Panel_hupai.height - (size.height + 15) * scale_num - height*(size.height + 5)*scale_num;
                this.Panel_hupai.addChild(card,i+1);
                var num = this.getMahjongNumById(vo);
                var paiNumLabel = new cc.LabelTTF("", "Arial", 50);
                paiNumLabel.setString(num);
                paiNumLabel.y = -40;
                paiNumLabel.x = size.width*0.5;
                paiNumLabel.setColor(cc.color(255,255,255));
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
            this.Panel_hupai.visible =false;
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

    updateBgColor:function(){
        var bgTexture = "res/res_phz/roombg/room_bg1.jpg";
        var gameTypeUrl = "res/res_phz/wanfaImg/gametype1_xplp.png";
        if (PHZSetModel.zmbj == 1){
        }else if (PHZSetModel.zmbj == 2){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype2_xplp.png";
            bgTexture = "res/res_phz/roombg/room_bg2.jpg";
        }else if (PHZSetModel.zmbj == 3){
            gameTypeUrl = "res/res_phz/wanfaImg/gametype3_xplp.png";
            bgTexture = "res/res_phz/roombg/room_bg3.jpg";
        }else if (PHZSetModel.zmbj == 4){
            bgTexture = "res/res_phz/roombg/room_bg4.jpg";
        }
        if(!this.Image_phz){
            var gameNameImg = new ccui.ImageView(gameTypeUrl);
            var x = 960;
            var y = 806;//740;
            gameNameImg.setPosition(x, y);
            this.Panel_20.addChild(gameNameImg,2);
            this.Image_phz = gameNameImg;
        }else{
            this.Image_phz.loadTexture(gameTypeUrl);
        }
        this.getWidget("Image_bg").loadTexture(bgTexture);
        this.updateRoomInfo();
    },

    onBackFromTing:function(){
        this.btn_back.visible = false;
        this.Panel_btn.visible = true;
        XPLPRoomModel.isTingSelecting = false;
        XPLPRoomModel.mineLayout.ccCancelTingPai();
        this.Panel_ting.removeAllChildren(true);
        this.Label_ting.visible = this.Panel_ting.visible = false;
    },

    onShowHuCardsByTingPai:function(event){
        var card = event.getUserData();
        var handCards = XPLPRoomModel.mineLayout.getPlace1Data();
        var allMJs = ArrayUtil.clone(handCards);
        var index = XPLPAI.findIndexByMJVoC(allMJs,card.c);
        allMJs.splice(index,1);
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(XPLPRoomModel.getFuType());
        huBean.setJiangLei(XPLPRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(XPLPAI.getJiangDefList(XPLPRoomModel.getJiangConf()));
        var smart = new MajiangSmartFilter();
        var huCards = smart.isHu(allMJs,huBean);
        if(huCards.length>0) {
            this.Panel_ting.removeAllChildren(true);
            var orderNum = 0;
            //this.Label_ting.visible = this.Panel_ting.visible = true;
            this.Label_ting.visible = this.Panel_ting.visible = false;
            for (var i = 0; i < huCards.length; i++) {
                var vo = huCards[i];
                var card = new XPLPCard(XPLPAI.getDisplayVo(1, 4), vo);
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

    onSetUp:function(){
        var mc = new XPLPSetUpPop();
        PopupManager.addPopup(mc);
    },

    //标记 玩家已经显示了头像
    setRoldPlayerIcon: function(event) {
        var seat = event.getUserData();
        var players = XPLPRoomModel.players;
        for(var i=0;i<players.length;i++) {
            var p = players[i];
            if(p.seat ==seat){
                p.isRoladIcon = 1;
            }
        }
    },

    onCheckResult:function(){
        cc.log("this.resultData =",JSON.stringify(this.resultData));
        if(this.resultData){
            var mc = new XPLPSmallResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }
    },

    onJixuFromResult:function(){
        this.Panel_8.visible = false;
        if(XPLPRoomModel.totalBurCount == XPLPRoomModel.nowBurCount || ClosingInfoModel.ext[16] == 1){
            var mc = new XPLPBigResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }else {
            sySocket.sendComReqMsg(3);
        }
    },


    onGPS: function() {
        PopupManager.addPopup(new GpsPop(XPLPRoomModel , 4));
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
        for(var i=0;i<this.hbtns.length;i++){
            if(this.hbtns[i].getChildByTag(321))
                this.hbtns[i].removeChildByTag(321);
        }
    },

    onSelectMajiang:function(event){
        var data = event.getUserData();
        this.resetBtnPanel();
        var action = data.action;
        var ids = data.ids;
        XPLPRoomModel.sendPlayCardMsg(action,ids);
    },

    onCancelSelect:function(){
        if(XPLPRoomModel.mineLayout){
            var mjs = XPLPRoomModel.mineLayout.getMahjongs1();
            for(var i=0;i<mjs.length;i++){
                mjs[i].unselected();
            }
        }
        //if (this.Panel_hupai){
        //    this.Panel_hupai.visible = false;
        //}
    },

    onOver:function(event){
        var data = event.getUserData();
        //消息队列还没播完，结算消息过来了，先缓存下来
        if(PlayMJMessageSeq.sequenceArray.length>0){
            PlayMJMessageSeq.cacheClosingMsg(data);
            return;
        }
        if(XPLPRoomModel.renshu == 4){
            for(var i=1;i<=4;i++){
                var btn = this.getWidget("Button_click"+i);
                btn.visible = false;
            }
        }
        this.showBaoTingBtn(false);
        XPLPRoomModel.isCloseHandCard = false;//关闭锁牌
        XPLPRoomModel.guchouSeat = -1;
        this.tingList.length=0;
        XPLPRoomModel.huCards.length = 0;
        this.Panel_btn.visible = this.btn_back.visible = false;
        var self = this;
        this.resultData = data;
        this.outTingInfo = [];
        this.hideTing();
        this.jt.visible = false;
        var closingPlayers = data.closingPlayers;
        for(var i=0;i<closingPlayers.length;i++){
            var p = closingPlayers[i];
            self._players[p.seat].updatePoint(closingPlayers[i].totalPoint);
            self._players[p.seat].hideGuChou();
            //var seq = XPLPRoomModel.getPlayerSeq(p.userId,XPLPRoomModel.mySeat, p.seat);
            //self.getLayout(seq).tanPai(p.handPais);
            /** 去掉胡牌展示 **/
        }
        var t = 1000;
        this.overTimeout = setTimeout(function(){//延迟弹出结算框
            cc.log("BSMJRoom -------> onOver");
            //self.root.removeChildByTag(XPLPRoomEffects.BAO_TAG);
            var mc = new XPLPSmallResultPop(data);
            PopupManager.addPopup(mc);
            //self.Panel_8.visible = true;
        },t);
    },

    initData:function(){
        cc.log("BSMJRoom----->initData")
        this.roomName_label.setString(XPLPRoomModel.roomName);
        XPLPRoomModel.isCloseHandCard = false;//关闭锁牌
        this.initwanfaImg();
        XPLPRoomModel.guchouSeat = -1;
        BaseRoom.prototype.initData.call(this);
        if(this.overTimeout) {
            clearTimeout(this.overTimeout);
        }
        this.showBaoTingBtn(false);
        PlayMJMessageSeq.clean();
        this.cleanChuPai();
        this.hideTing();
        this.tingList.length=0;
        this.checkHuResult = [];
        this._effectLayout.cleanData();
        this.updateCountDown(this.COUNT_DOWN);
        this.Image_24.setRotation(XPLPRoomModel.jtAngle);
        //this.resetCoordByKanBao();
        this.hideAllBanker();
        this.lastLetOutMJ=this.lastLetOutSeat=0;
        this.Label_info0.setString("房号:"+XPLPRoomModel.tableId);
        this.updateRoomInfo();
        this._players = {};
        var players = XPLPRoomModel.players;
        //cc.log("XPLPRoomModel.players =",JSON.stringify(XPLPRoomModel.players));
        for(var i=1;i<=XPLPRoomModel.renshu;i++){
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
        this.btnReady.visible = true;
        this.btnInvite.visible = (players.length<XPLPRoomModel.renshu);
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = XPLPRoomModel.getPlayerSeq(p.userId,XPLPRoomModel.mySeat, p.seat);
            var cardPlayer = this._players[p.seat] = new XPLPPlayer(p,this.root,seq);
            //cardPlayer.showTrusteeship(parseInt(p.ext[3]));//显示托管字样
            var isMoPai = false;
            if(p.ext.length>0){//长春麻将，听牌了
                if(p.ext[0]==1){
                    XPLPRoomModel.ting(p.seat);
                    this._players[p.seat].tingPai();
                }
                if(p.ext.length>1 && p.ext[1]===1)//是否摸牌
                    isMoPai = true;
            }
            if(!isContinue){
                if(p.status)
                    cardPlayer.onReady();
                if (p.ext[3] != -1 && XPLPRoomModel.ext[9] != 0){
                    cardPlayer.startGame();
                    //this._players[p.seat].showDianNum(p.ext[3]);
                }
            }else{//恢复牌局
                var banker = null;
                //if(p.seat==XPLPRoomModel.nextSeat)
                //    banker= p.seat;
                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.huCards, banker, isMoPai);
                //if (p.ext[3] != -1  && XPLPRoomModel.ext[9] != 0 ){
                //    cc.log("p.seat =",p.seat);
                //    //this._players[p.seat].showDianNum(p.ext[3]);
                //}
                if(p.seat == XPLPRoomModel.mySeat){
                    if(p.ext[5] == -1){//有按钮未选择，重连，显示按钮
                        this.showBaoTingBtn(true);
                    }
                    if(p.ext[6] != 0){//是否箍臭
                        XPLPRoomModel.guchouSeat = p.seat;
                    }
                    if(XPLPRoomModel.intParams[4] == 1 && p.ext[7] == 1){
                        XPLPRoomModel.isCloseHandCard = true;//开启锁牌
                        this.getLayout(1).updateCardColor();
                    }
                }
                if(p.ext[5] > -1){
                    this._players[p.seat].showPiaoFenImg(p.ext[5]);//刷新报听显示
                }

                if(p.outCardIds.length>0){//模拟最后一个人出牌
                    this.lastLetOutMJ = p.outCardIds[0];
                    this.lastLetOutSeat = p.seat;
                    this.getLayout(seq).showFinger(this.lastLetOutMJ);
                }
                if(p.recover.length>0){//恢复牌局的状态重设
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        XPLPRoomModel.banker = p.seat;
                        cardPlayer.isBanker(true);
                    }
                }
                cardPlayer.startGame();
            }
            var isTuoguan = p.ext[4];
            if(p.userId ==PlayerModel.userId){//自己的状态处理
                XPLPRoomModel.isTrusteeship = p.ext[4];
                //this.Image_cover.visible = (XPLPRoomModel.isTrusteeship) ? true : false;
                if(p.status){
                    this.btnReady.visible = false;
                }else{
                    // this.btnInvite.visible = false;
                }
                var tingAct = p.recover.length>2 ? p.recover.splice(2,8) : [];
                var isTingPai = false;
                if(p.handCardIds.length%3==2){
                    //听牌后，如果有牌没出，重连时，需要把这张牌打出来,需要判断能不能胡
                    if(XPLPRoomModel.isTing() || XPLPRoomModel.isHued()){//直接出牌
                        XPLPRoomModel.needAutoLetOutId = p.handCardIds[p.handCardIds.length-1];
                        //XPLPRoomModel.sendPlayCardMsg(0,[XPLPRoomModel.needAutoLetOutId]);
                        if(tingAct.length==0)
                            XPLPRoomModel.chuMahjong(XPLPRoomModel.needAutoLetOutId);
                    }else{//检查是否可以听牌
                        //isTingPai = this.checkTingPai(tingAct,true);
                    }
                }
                //cc.log("isTingPai::"+isTingPai+" selfact::"+tingAct);
                if(!isTingPai)
                    this.refreshButton(tingAct);
                if(XPLPRoomModel.isOpenTuoguan() && this.bg_CancelTuoguan){
                    var isMeTuoguan = XPLPRoomModel.getPlayerIsTuoguan(p);
                    this.bg_CancelTuoguan.visible = isMeTuoguan;
                }
            }
            cardPlayer.updateTuoguan(isTuoguan);
        }
        //IP相同的显示
        if(players.length>1 && XPLPRoomModel.renshu != 2){
            var seats = XPLPRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if (p.userId == PlayerModel.userId && p.handCardIds.length > 0) {
                if(!XPLPRoomModel.isTingHu() || (XPLPRoomModel.isTingHu() && XPLPRoomModel.isTing())) {
                    this.startCheckHu();
                }
            }
        }
        if(isContinue){
            if(XPLPRoomModel.nextSeat)
                this.showJianTou();
            else
                this.showJianTou(-1);
            this.btnInvite.visible = false;
            //if(XPLPRoomModel.isTing() || XPLPRoomModel.isHued()){
            //var myDirect = XPLPRoomModel.getPlayerSeq(PlayerModel.userId,XPLPRoomModel.mySeat, XPLPRoomModel.mySeat);
            //this.layouts[myDirect].csGangPai();
            //}
            //this.Label_info_mj.y = 160;
        }else{
            if (players.length>1 && XPLPRoomModel.renshu != 2 && XPLPRoomModel.nowBurCount == 1)
                PopupManager.addPopup(new GpsPop(XPLPRoomModel , XPLPRoomModel.renshu));

            this.root.removeChildByTag(XPLPRoomEffects.BAO_TAG);
            this.jt.visible = false;
            //this.Label_info_mj.y = 280;
        }

        this.removeHuPanel();
        //if (isContinue || XPLPRoomModel.nowBurCount > 1) {
        //    var time = XPLPRoomModel.getJSQTime();
        //    this.jsqShi = Math.floor(time / 3600);
        //    this.jsqFen = Math.floor((time - this.jsqShi * 3600) / 60);
        //    if (this.jsqFen >= 60) {
        //        this.jsqShi++;
        //        this.jsqFen = 0;
        //    }
        //    this.startTime = new Date().getTime() - (time - this.jsqShi * 3600 - this.jsqFen * 60) * 1000;
        //    var strShi = (this.jsqShi < 10) ? "0" + this.jsqShi : this.jsqShi;
        //    var strFen = (this.jsqFen < 10) ? "0" + this.jsqFen : this.jsqFen;
        //    this.Label_jsq.setString("计时器\n" + strShi + ":" + strFen);
        //    this.startJS = true;
        //    this.Label_jsq.visible = true;
        //}
    },

    StartMaiDian:function(message){
        //cc.log("StartMaiDian::"+JSON.stringify(message));
        this.Panel_maidian.visible = true;
        var params = message.getUserData().params;
        if (params[0] == 1){
            this.Button_2dian.setBright(false);
            this.Button_2dian.setTouchEnabled(false);
        }else{
            this.Button_2dian.setBright(true);
            this.Button_2dian.setTouchEnabled(true);
        }

        //其他3人手上的牌
        for(var i=1;i<=XPLPRoomModel.renshu;i++){
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
    },
    finishMaiDian:function(event){
        this.Panel_maidian.visible = false;
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        var num = params[1];
        this._players[seat].showDianNum(num);
    },
    onMaiDian:function(obj){
        var temp = parseInt(obj.temp);
        cc.log("temp =",temp);
        sySocket.sendComReqMsg(211,[temp]);
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
        //this.onCheckHuByPutOut();
        if(this.isTingPai) {
            this.onCheckHuByBaoTing();
        }
    },

    startCheckTing:function(){
        MJCheckStage.clean();
        XPLPRoomModel.nearestTingResult.length = 0;
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
        var data1 = XPLPRoomModel.mineLayout.getPlace1Data();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(XPLPRoomModel.getFuType());
        huBean.setJiangLei(XPLPRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(XPLPAI.getJiangDefList(XPLPRoomModel.getJiangConf()));
        var hu = new MajiangSmartFilter();
        var result = hu.checkTing(data1, huBean,false,this.checkTingNum,this.curIndex);
        this.curIndex += XPLPAI.LANZHOU_CHECK_NUMS;
        if(this.curIndex >= XPLPAI.MJ.length) {
            this.curIndex = 0;
            this.checkTingNum++;
        }
        if(result.length>0){
            ArrayUtil.merge(result,XPLPRoomModel.nearestTingResult);
        }
        if(this.checkTingNum > data1.length){
            this.isTingPai = false;
            this.Panel_btn.visible = false;
            this.btn_back.visible = true;
            XPLPRoomModel.mineLayout.ccTingPaiByGC();
        }
        //cc.log("onCheckHuByBaoTing cost time:::::::"+(new Date().getTime()-start));
    },

    //出牌检测
    onCheckHuByPutOut:function(){
        if(this.isCheckHu){
            var start = new Date().getTime();
            var huBean = new MajiangHuBean();
            var allMJs = XPLPRoomModel.mineLayout.getPlace1Data();
            if(allMJs.length % 3 == 2){
                allMJs = ArrayUtil.clone(allMJs);
                allMJs.pop();
            }
            huBean.setFuPaiType(XPLPRoomModel.getFuType());
            huBean.setJiangLei(XPLPRoomModel.getJiangLeiConf());
            huBean.setJiangModDefList(XPLPAI.getJiangDefList(XPLPRoomModel.getJiangConf()));
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
                var card = new XPLPCard(XPLPAI.getDisplayVo(1,4),huArray[key]);
                card.x = orderNum*27;
                card.y = 0;
                this.Panel_ting.addChild(card);
                orderNum += 1;
                this.tingList.push(card);
            }
            XPLPRoomModel.setLocalBySmartFitler(huArray);
        }else{
            this.hideTing();
        }
    },


    ////取消托管
    //unTrusteeship:function(){
    //    XPLPRoomModel.isTrusteeship = 0;
    //    //this.Image_cover.visible = false;
    //    sySocket.sendComReqMsg(203,[0]);
    //},
    //
    ////设置是否托管
    //onSetIsTrusteeship:function(event){
    //    var data = event.getUserData(); //[status,seat]
    //    XPLPRoomModel.isTrusteeship = data[0];
    //    if(data[1]==XPLPRoomModel.mySeat){
    //        //this.Image_cover.visible = (XPLPRoomModel.isTrusteeship==1) ? true : false;
    //    }
    //    this._players[data[1]].showTrusteeship(XPLPRoomModel.isTrusteeship);
    //},

    /**
     * 检查听牌
     * @param selfAct
     */
    checkTingPai:function(selfAct,isMoPai){
        if (!XPLPRoomModel.isTingHu()) {
            return false;
        }
        var data1 = XPLPRoomModel.mineLayout.getPlace1Data();
        var isTing = false;
        if(data1.length%3==2 && !XPLPRoomModel.isTing()){
            var huBean = new MajiangHuBean();
            huBean.setFuPaiType(XPLPRoomModel.getFuType());
            huBean.setJiangLei(XPLPRoomModel.getJiangLeiConf());
            huBean.setJiangModDefList(XPLPAI.getJiangDefList(XPLPRoomModel.getJiangConf()));
            var result = XPLPAI.isTingPai(data1,huBean,isMoPai);
            if(result&&result.length>0){
                //将结果缓存下
                //XPLPRoomModel.nearestTingResult = result;
                if(selfAct.length>0){
                    selfAct[7] = 1;
                }else{
                    selfAct = [0,0,0,0,0,0,0,1,0];
                }
                isTing = true;
                this.refreshButton(selfAct);
                if(!XPLPRoomModel.isGuCang()) {
                    XPLPRoomModel.mineLayout.ccTingPai();
                }
            }
        }
        return isTing;
    },

    updateRemain:function(){
        if(this.Image_info2.getChildByTag(999))
            this.Image_info2.removeChildByTag(999);
        //this.Image_info2.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF("剩"+XPLPRoomModel.remain+"张", "", 32);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo("剩",cc.color("#AFD1BA"),32));
        ele1.push(RichLabelVo.createTextVo(XPLPRoomModel.remain+"",cc.color("#f6c143"),32));
        ele1.push(RichLabelVo.createTextVo("张",cc.color("#AFD1BA"),32));
        var label = new RichLabel(cc.size(120,40));
        label.setLabelString(ele1);
        label.x = (this.Image_info2.width-textRenderer.getContentSize().width)/2;
        label.y = 12;
        this.Image_info2.addChild(label,1,999);
        if (XPLPRoomModel.remain == 4) {
            FloatLabelUtil.comText("最后四张");
            //var winSize = cc.director.getWinSize();
            //var last4 = new cc.Sprite("res/res_mj/res_bsmj/bsmjRoom/last4.png");
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
            var me = XPLPRoomModel.getPlayerVo();
            me.status = params[1];
            this.btnReady.visible = false;
            this.btnInvite.visible = (ObjectUtil.size(this._players)<XPLPRoomModel.renshu);
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


    updateRoomInfo:function(){
        XPLPRoomModel.tempNowBurCount = XPLPRoomModel.nowBurCount;
        var color = 1;
        var fontColor = this.getFontColorByBgColor(color);
        this.Label_info_mj.setColor(cc.color(fontColor[1]));
        this.updateRemain();
        this.Label_info_mj.setString("")
        if(this.Image_info1.getChildByTag(999))
            this.Image_info1.removeChildByTag(999);
        //this.Image_info1.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF(XPLPRoomModel.nowBurCount+"/"+XPLPRoomModel.totalBurCount+"局", "", 32);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo(XPLPRoomModel.nowBurCount+"",cc.color(246,193,67),32));
        ele1.push(RichLabelVo.createTextVo("/"+XPLPRoomModel.totalBurCount+"局",cc.color("#AFD1BA"),32));
        var label = new RichLabel(cc.size(300,40),1);
        label.setLabelString(ele1);
        label.x = (this.Image_info1.width-textRenderer.getContentSize().width)/2;
        label.y = 12;
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
        var scale = 0.8;
        var bg = new cc.Scale9Sprite("res/res_mj/res_bsmj/bsmjRoom/img_50.png");
        bg.anchorX=bg.anchorY=0
        bg.setContentSize(totalCount*120*scale+(25*(resultArray.length+1)),333*scale + 60);
        if(bg.width>this.Panel_btn.width){
            bg.x = this.Panel_btn.width-bg.width;
        }else{
            bg.x = this.Panel_btn.width-bg.width-100;
        }
        bg.y = 240;
        var count = 0;

        var tipLabel = new UICtor.cLabel("请点击字牌选择要操作的牌",42);
        tipLabel.setPosition(bg.width/2,bg.height - 20);
        tipLabel.setColor(cc.color.YELLOW);
        bg.addChild(tipLabel,1);

        for(var i=0;i<resultArray.length;i++){
            var chiArr = resultArray[i];
            var initX = (i+1)*25;
            for(var j=0;j<chiArr.length;j++){
                var chiVo = chiArr[j];
                chiVo.se = action;
                if(action==XPLPAction.CHI){
                    chiVo.ids = [chiArr[0].c,chiArr[2].c];
                }else if(action==XPLPAction.XIA_DAN || action == XPLPAction.AN_GANG
                    || action == XPLPAction.GANG || action == XPLPAction.BU_ZHANG || action == 14){
                    var danIds = [];
                    for(var d=0;d<chiArr.length;d++){
                        danIds.push(chiArr[d].c);
                    }
                    chiVo.ids = danIds;
                }else{
                    chiVo.ids = [chiArr[0].c];
                }
                var mahjong = new XPLPCard(XPLPAI.getDisplayVo(1,3),chiVo);
                mahjong.scale=scale;
                mahjong.x = initX+120*scale*count;mahjong.y = 3;
                bg.addChild(mahjong);
                //if(action==XPLPAction.CHI && j==1){
                //    var huang = new cc.Scale9Sprite("res/res_mj/res_bsmj/img_52.png");
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
        this.cleanChuPai();
        switch (temp){
            case XPLPAction.HU:
                XPLPRoomModel.sendPlayCardMsg(1,[]);
                break;
            case XPLPAction.YAO_GANG:
                this.showBaoTingBtn(false);
                XPLPRoomModel.nextSeat = XPLPRoomModel.mySeat;
                XPLPRoomModel.isTingSelecting = true;
                XPLPRoomModel.nearestTingResult.length = 0;
                this.Panel_btn.visible = false;
                //this.btn_back.visible = true;
                //this.findPutOutByTing();
                //this.startCheckTing();
                XPLPRoomModel.sendPlayCardMsg(14,[]);
                break;
            case XPLPAction.PENG:
            case XPLPAction.GANG:
            case XPLPAction.AN_GANG:
            case XPLPAction.BU_ZHANG:
                //cc.log("XPLPAction.GANG==========",XPLPAction.GANG)
                var ids = [];
                var myLayout = this.getLayout(XPLPRoomModel.getPlayerSeq(PlayerModel.userId));
                var allMJs = myLayout.getPlace1Data();
                if(allMJs.length%3==2){//摸牌了，手上的牌和摊开的牌都需要找一遍
                    var result = XPLPAI.getGang(allMJs,myLayout.getPlace2Data());
                    if(result.length>1){
                        this.displaySelectMahjongs(temp,result);
                    }else{
                        var result0 = result[0];
                        for(var i=0;i<result0.length;i++){
                            ids.push(result0[i].c);
                        }
                        XPLPRoomModel.sendPlayCardMsg(temp,ids);
                    }
                }else{//别人出牌,我可以碰、杠
                    var lastVo = XPLPAI.getMJDef(this.lastLetOutMJ);
                    for(var i=0;i<allMJs.length;i++){
                        var vo = allMJs[i];
                        if(vo.t==lastVo.t&&vo.n==lastVo.n)
                            ids.push(vo.c);
                        if(ids.length>=temp)
                            break;
                    }
                    XPLPRoomModel.sendPlayCardMsg(temp,ids);
                }
                break;
            case XPLPAction.GUO:
                this.showBaoTingBtn(false);
                var allButtons = [];
                for(var i=0;i<XPLPRoomModel.selfAct.length;i++){
                    if(XPLPRoomModel.selfAct[i]==1)
                        allButtons.push(i);
                }
                //只有一个听的选择，是前台自己加上去的，点过时，前台自己处理，不给后台发送消息
                if(XPLPRoomModel.selfAct[7]==1&&allButtons.length==1){
                    this.Panel_btn.visible = false;
                    XPLPRoomModel.nextSeat = XPLPRoomModel.mySeat;
                    XPLPRoomModel.selfAct.length=0;
                }else{
                    var allMJs = this.getLayout(XPLPRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
                    var guoParams = (allMJs.length%3==2) ? [1] : [0];
                    ArrayUtil.merge(XPLPRoomModel.selfAct,guoParams);
                    if(obj.hasHu){
                        //Network.logReq("MJRoom::guo click...1");
                        AlertPop.show("当前为可胡牌状态，确定要选择【过】吗？",function(){
                            //Network.logReq("MJRoom::guo click...2");
                            XPLPRoomModel.sendPlayCardMsg(5,guoParams);
                        });
                    }else{
                        //Network.logReq("MJRoom::guo click...3");
                        XPLPRoomModel.sendPlayCardMsg(5,guoParams);
                    }
                }
                break;
            case XPLPAction.CHI:
                var lastVo = XPLPAI.getMJDef(this.lastLetOutMJ);
                var chi = XPLPAI.getChi(XPLPRoomModel.mineLayout.getPlace1Data(),lastVo);
                if(chi.length>1){
                    this.displaySelectMahjongs(XPLPAction.CHI,chi);
                }else{
                    var ids = [];
                    var array = chi[0];
                    for(var i=0;i<array.length;i++){
                        var vo = array[i];
                        if(vo.n!=lastVo.n)
                            ids.push(vo.c);
                    }
                    XPLPRoomModel.sendPlayCardMsg(6,ids);
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
        if(this.Panel_20.getChildByName("wanfaImg")){
            this.Panel_20.getChildByName("wanfaImg").setVisible(false);
        }
        this.cleanChuPai();
        XPLPRoomModel.guchouSeat = -1;
        this.startTime = new Date().getTime();
        this.startJS = true;
        //this.Label_jsq.visible = true;
        this.tingList.length=0;
        this.lastLetOutMJ=this.lastLetOutSeat=0;
        this.updateRoomInfo();
        for(var i=1;i<=XPLPRoomModel.renshu;i++){
            this.getWidget("oPanel"+i).removeAllChildren(true);
            var layout = this.layouts[i];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        this.btnInvite.visible = this.btnReady.visible =false;
        var p = event.getUserData();
        this.showJianTou();
        this.updateCountDown(this.COUNT_DOWN);
        var direct = XPLPRoomModel.getPlayerSeq(PlayerModel.userId,XPLPRoomModel.mySeat,XPLPRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        if(p.banker == XPLPRoomModel.mySeat && XPLPRoomModel.intParams[4] == 1){
            XPLPRoomModel.isCloseHandCard = true;//开启锁牌
            this.getLayout(1).updateCardColor();
        }
        this.hideAllBanker();
        this._players[p.banker].isBanker(true);
        //其他3人手上的牌
        for(var i=1;i<=XPLPRoomModel.renshu;i++){
            if(i != XPLPRoomModel.mySeat){
                var d = XPLPRoomModel.getPlayerSeq("",XPLPRoomModel.mySeat,i);
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

        this.showWaitSelectPiao(false);
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
    refreshButton:function(selfAct){
        cc.log("selfAct =",selfAct);
        XPLPRoomModel.selfAct = selfAct || [];
        if(XPLPRoomModel.selfAct[6] == 1){
            for(var i = 0;i<6;i++){
                this.hbtns[i].visible = false;
            }
            this.showBaoTingBtn(true);
            return;
        }
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
                        if (XPLPRoomModel.isHued()) {
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
            if(selfAct[2] == 1 && selfAct[3] == 1){
                selfAct[3] = 0;//同时有暗杠和明杠只显示一个杠,再在牌型里面筛选选择
            }

            if(selfAct[5] == 1 && selfAct[16] == 1){
                selfAct[16] = 0;//同时有暗补和明补只显示一个补,再在牌型里面筛选选择
            }

            if(hasHu && XPLPRoomModel.intParams[8] == 1) {//有胡必胡不显示过
                for(var i = 0;i<6;i++){
                    this.hbtns[i].visible = false;
                }
                this.hbtns[rIndex].visible = true;
                this.hbtns[rIndex].loadTextureNormal(textureMap[0].t);
                this.hbtns[rIndex].temp = textureMap[0].v;
                this.hbtns[rIndex].hasHu = hasHu;
                return;
            }
            var textureLog = "";
            //过
            this.hbtns[rIndex].visible = true;
            this.hbtns[rIndex].loadTextureNormal("res/res_mj/mjRoom/mj_btn_guo.png");
            this.hbtns[rIndex].temp = 5;
            this.hbtns[rIndex].hasHu = hasHu;

            rIndex++;
            var localStartX = this.hbtns[0].x;//第一个按钮位置
            var offsetX = 320;//按钮间隔
            var localCount = 1;//设置位置的按钮下标
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp==1 && tm){
                    this.hbtns[rIndex].visible = true;
                    this.hbtns[rIndex].loadTextureNormal(tm.t);
                    this.hbtns[rIndex].temp = parseInt(tm.v);

                    this.hbtns[rIndex].x = localStartX - offsetX * localCount;

                    this.showTipCard(this.hbtns[rIndex]);
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

    /**
     * 显示按钮旁边操作的牌
     */
    showTipCard:function(widget){
        if(widget.getChildByTag(321))
            widget.removeChildByTag(321);
        if (this.lastLetOutMJ && this.lastLetOutMJ > 0){
            var lastCard = XPLPAI.getMJDef(this.lastLetOutMJ);
            //cc.log("lastCard==="+JSON.stringify(lastCard))
            var card = this.lastCard = new XPLPCard(XPLPAI.getDisplayVo(1,1),lastCard,null,true);
            var scaleY = 0.75;
            var scaleX = 0.9;
            card.scaleY = scaleY;
            card.scaleX = scaleX;
            card.setAnchorPoint(cc.p(0.5,0));
            card.x = 0;
            card.y = 0;
            widget.addChild(card,1,321);
        }
    },

    /**
     * 将所有出牌面板上的显示层清理掉
     */
    cleanChuPai:function(){
        for(var i=1;i<=XPLPRoomModel.renshu;i++){
            this.getWidget("cp"+i).removeAllChildren(true);
        }
    },

    onGetMajiang:function(event){
        var message = event.getUserData();
        var seat = message.seat;
         cc.log("onGetMajiang nextSeat =",message.seat);
        XPLPRoomModel.nextSeat = seat;
        var selfAct = message.selfAct;//[胡,碰,刚]
        // cc.log("selfAct =",selfAct);
        var ids = message.majiangIds;
        this.showJianTou(seat);
        this.cleanChuPai();
        //this.refreshButton(selfAct);
        var id = ids.length>0 ? ids[0] : 0;
        this.getLayout(XPLPRoomModel.getPlayerSeq("",XPLPRoomModel.mySeat,seat)).moPai(id);
        if(XPLPRoomModel.isGSMJ() || XPLPRoomModel.isGuCang()){
            var isTing = false;
            //if (seat == XPLPRoomModel.mySeat && !XPLPRoomModel.isTing()) {
            //    isTing = this.checkTingPai(selfAct,true);
            //}
            if(!isTing)
                this.refreshButton(selfAct);
            XPLPRoomModel.remain=message.remain;
            if((XPLPRoomModel.isTing(seat) || XPLPRoomModel.isHued(seat)) && seat==XPLPRoomModel.mySeat && id>0){//直接出牌
                XPLPRoomModel.needAutoLetOutId = id;
            }
        }else{
            this.refreshButton(selfAct);
            XPLPRoomModel.remain-=1;
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
    chuPaiAction:function(id,seat,direct,userId){
        this.lastLetOutMJ = id;
        this.lastLetOutSeat = seat;
        if(this.lastLetOutMJ==XPLPRoomModel.needAutoLetOutId)//清理掉自动出牌的值
            XPLPRoomModel.needAutoLetOutId = 0;
        var vo = XPLPAI.getMJDef(id);
        this.showJianTou(-1);
        XPLPRoomSound.letOutSound(userId,vo);
        this.layouts[direct].chuPai(vo);
        //this._players[seat].chuPai(vo);
        XPLPRoomSound.pushOutSound();
        if(seat==XPLPRoomModel.mySeat){
            //没听牌，托管时间到了，后台打出了牌，取消听的状态
            if(!XPLPRoomModel.isTing(seat) && XPLPRoomModel.isTrusteeship){
                XPLPRoomModel.mineLayout.ccCancelTingPai();
            }
            if(!XPLPRoomModel.hasChuPai)
                XPLPRoomModel.hasChuPai = true;
            //this.refreshCheckButtons();
        }

        if(userId == PlayerModel.userId){
            if (!XPLPRoomModel.isHued() && !XPLPRoomModel.isTingHu()) {
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
        this.updateClickCpBg();
    },

    /**
     * 收到出牌消息，前台开始处理
     * @param event
     */
    onLetOutCard:function(event){
        this.updateCountDown(this.COUNT_DOWN);
        var message = event.getUserData();
        cc.log("onLetOutCard message =",JSON.stringify(message));
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

        if(seat==XPLPRoomModel.mySeat){
            if(XPLPRoomModel.tempNowBurCount != XPLPRoomModel.nowBurCount){
                this.updateRoomInfo();
            }
        }
        this.cleanChuPai();
        var direct = XPLPRoomModel.getPlayerSeq(userId,XPLPRoomModel.mySeat,seat);
        //前台自己已经模拟了出牌的消息，后台给过来的出牌消息不处理后续逻辑
        if(seat==XPLPRoomModel.mySeat&&action==0&&ids.length>0&&!simulate){
            if(this.getLayout(1).getOneMahjongOnHand(ids[0])==null) {
                PlayMJMessageSeq.finishPlay();
                return;
            }
        }
        XPLPRoomModel.isTingSelecting=false;
        XPLPRoomModel.lzTingResult.length = 0;
        this.Panel_btn.visible = this.btn_back.visible = false;
        for(var lay in this.layouts){
            this.layouts[lay].hideFinger();
        }
        this.updateRemain();
        switch (action){
            case XPLPAction.CHU_PAI://出牌动作
                //刷新一下玩家状态
                this._players[seat].setPlayerOnLine();
                if(isOtherHasAction==0){
                    var nextSeat = XPLPRoomModel.seatSeq[seat][1];
                    cc.log("XPLPRoomModel.nextSeat =",XPLPRoomModel.nextSeat);
                    XPLPRoomModel.nextSeat = nextSeat;
                }
                if(ids.length>0){
                    this.chuPaiAction(ids[0],seat,direct,userId);
                    XPLPRoomEffects.chuPai(this.getWidget("cp"+direct),XPLPAI.getMJDef(ids[0]),2,XPLPRoomModel.renshu,direct,
                        this.getWidget("oPanel"+direct)
                    );
                }
                break;
            case XPLPAction.HU://胡牌动作
                var lastId = ids[ids.length-1];
                this.layouts[direct].huPai(ids,message.zimo,message.fromSeat);
                //var huArray = message.huArray;
                var prefix = (message.zimo==1) ? "zimo" : "hu";
                XPLPRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
                XPLPRoomSound.actionSound(userId,prefix);
                XPLPRoomModel.hued(seat, {action:(message.zimo==1) ? 0 : 1,cards:[lastId]});
                if(message.fromSeat){
                    var fromDirect = XPLPRoomModel.getPlayerSeq("",XPLPRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].playDianPaoEff();
                    this.layouts[fromDirect].beiPengPai(lastId);
                }

                var loseActionArray = [];
                var zhuangTarget = this._players[seat];
                //var ext = message.ext[1].split(",");
                //if(!XPLPRoomModel.isGuCang()) {
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
            case XPLPAction.GUO://过
                this.showBaoTingBtn(false);
                if(isOtherHasAction == 0)
                    XPLPRoomModel.nextSeat = seat;
                this.showJianTou();
                //点了过，还有可能有需要自动出牌的操作需要做
                if(XPLPRoomModel.needAutoLetOutId>0)
                    XPLPRoomModel.chuMahjong(XPLPRoomModel.needAutoLetOutId);
                break;
            case XPLPAction.XIAO_HU://小胡 六六顺、板板胡等
                //this.layouts[direct].xiaohu(ids);
                //var huArray = message.huArray;
                //XPLPRoomEffects.normalAction(this.root,"btn_cs_xiaohu_"+huArray[0],this.getWidget("cp"+direct));
                break;
            case XPLPAction.YAO_GANG:/** 选了箍臭 **/
                XPLPRoomModel.guchouSeat = seat;
                this.showBaoTingBtn(false);//有人选了箍臭就清除按钮
                this._players[seat].showGuChou(true);
                break;
            case XPLPAction.TING://听牌特殊处理，先出牌，再播听牌动画
                prefix = "ting";
                XPLPRoomModel.ting(seat);
                var self = this;
                this._players[seat].tingPai();
                /* if(XPLPRoomModel.isTrusteeship){//托管状态
                 this._players[seat].unTingPai();
                 }*/
                XPLPRoomEffects.normalAction(self.root,prefix,self.getWidget("cp"+direct));
                XPLPRoomSound.actionSound(userId,prefix);
                if (ids.length>0) {
                    self.chuPaiAction(ids[0],seat,direct,userId);
                }
                //if (seat == XPLPRoomModel.mySeat) {
                //    var vo = XPLPAI.getMJDef(ids[0]);
                //    var huCards = XPLPRoomModel.getTingWithMahjong(vo);
                //    this.onShowHuCards(huCards);
                //}
                XPLPRoomModel.mineLayout.ccCancelTingPai();
                break;
            default://补张、吃、碰、杠牌动作
                //var displayForGang = false;
                var showTing = true;
                var beiPengId = ids[ids.length-1];
                var prefix = "peng";
                if(action==XPLPAction.BU_ZHANG){
                    prefix = "bu";
                    showTing = false;
                }else if(action==XPLPAction.CHI){
                    beiPengId = ids[1];
                    prefix = "chi";
                }else if(ids.length>3 || ids.length==1){
                    prefix = "gang";
                    //长春麻将听牌后的杠牌，还需要显示遮罩
                    //displayForGang = (seat==XPLPRoomModel.mySeat && (XPLPRoomModel.isTing(seat) || XPLPRoomModel.isHued(seat)));//(XPLPRoomModel.wanfa==2&&seat==XPLPRoomModel.mySeat && !XPLPRoomModel.isGang());
                    XPLPRoomModel.gang(seat);
                    showTing = false;
                }
                this.layouts[direct].pengPai(ids,action,message.fromSeat);
                XPLPRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct));
                if(message.fromSeat){
                    var fromDirect = XPLPRoomModel.getPlayerSeq("",XPLPRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].beiPengPai(beiPengId);
                }
                XPLPRoomModel.nextSeat = seat;
                this.showJianTou();
                XPLPRoomSound.actionSound(userId,prefix);

                this.updateClickBg();
                break;
        }
        this.refreshButton(selfAct);
        this.clearTingArrows();
        //this.removeHuPanel();
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
        var allMJs = this.getLayout(XPLPRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
        //重连进来的情况，可能手上已经摸了牌了，把最后一张牌剔除
        if(isReconect && (!XPLPRoomModel.isTingHu() || XPLPRoomModel.isTing()) && XPLPRoomModel.isNeedSmartFitler()) {
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
        if (isReconect && XPLPRoomModel.isTingHu() && !XPLPRoomModel.isTing()) {
            return;
        }
        var start = new Date().getTime();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(XPLPRoomModel.getFuType());
        huBean.setJiangLei(XPLPRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(XPLPAI.getJiangDefList(XPLPRoomModel.getJiangConf()));
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
                var card = new XPLPCard(XPLPAI.getDisplayVo(1,4),list[key]);
                card.x = orderNum*27;
                card.y = 0;
                this.Panel_ting.addChild(card);
                orderNum += 1;
                this.tingList.push(card);
            }
            XPLPRoomModel.setLocalBySmartFitler(list);
            //for(var i=0;i<this.tingList.length;i++){
            //    this.refreshTingNum(this.tingList[i]);
            //}
        }else{
            this.hideTing();
        }
    },

    getAllOutCard:function(){
        var outCards = [];
        for(var i=0;i<XPLPRoomModel.players.length;i++){
            var p = XPLPRoomModel.players[i];
            var seq = XPLPRoomModel.getPlayerSeq(p.userId,XPLPRoomModel.mySeat, p.seat);
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
        var wanfa = "保山麻将";
        var queZi = XPLPRoomModel.renshu + "缺"+(XPLPRoomModel.renshu - XPLPRoomModel.players.length);
        var obj={};
        obj.tableId=XPLPRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+XPLPRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+XPLPRoomModel.tableId+"] "+queZi;

        var youxiName = "保山麻将";
        if(XPLPRoomModel.tableType == 1){
            youxiName = "[亲友圈]保山麻将"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,XPLPRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    onJoin:function(event){
        var p = event.getUserData();
        var seq = XPLPRoomModel.getPlayerSeq(p.userId,XPLPRoomModel.mySeat, p.seat);
        this._players[p.seat] = new XPLPPlayer(p,this.root,seq);
        var me = XPLPRoomModel.getPlayerVo();
        // cc.log()
        this.btnInvite.visible = (ObjectUtil.size(this._players)<XPLPRoomModel.renshu);
        var seats = XPLPRoomModel.isIpSame();
        if(seats.length>0 && XPLPRoomModel.renshu != 2){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
            PopupManager.addPopup(new GpsPop(XPLPRoomModel , XPLPRoomModel.renshu));
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        layout = new XPLPLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    showJianTou:function(seat){
        this.jt.visible = true;
        seat = seat || XPLPRoomModel.nextSeat;
        for(var i=1;i<=4;i++){
            this.getWidget("jt"+i).visible = false;
        }
        if(seat != -1 && seat!=null){
            var seq = XPLPRoomModel.getPlayerSeq("",XPLPRoomModel.mySeat,seat);
            var direct = XPLPRoomModel.getJTSeq(seq);
            var jtSeq = [1,2,3,4];
            if (XPLPRoomModel.renshu == 3){
                jtSeq = [1,2,4];
            }else if(XPLPRoomModel.renshu == 2){
                jtSeq = [1,3];
            }
            var dirLayout = this.getWidget("jt"+jtSeq[direct-1]);
            if(dirLayout){
                dirLayout.visible = true;
            }
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
            XPLPRoomModel.mineLayout = layout;
        }
        this.updateClickBg();
        this.updateClickCpBg();
    },

    findPutOutByTing:function(){
        var start = new Date().getTime();
        var data1 = XPLPRoomModel.mineLayout.getPlace1Data();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(XPLPRoomModel.getFuType());
        huBean.setJiangLei(XPLPRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(XPLPAI.getJiangDefList(XPLPRoomModel.getJiangConf()));
        var hu = new MajiangSmartFilter();
        XPLPRoomModel.nearestTingResult = hu.checkTing(data1, huBean);
        XPLPRoomModel.mineLayout.ccTingPaiByGC();
        //cc.log("findPutOutByTing cost time::"+(new Date().getTime()-start));
    },

});
