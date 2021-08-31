/**
 * Created by zhoufan on 2015/8/22.
 * @class
 * @extend {Room}
 */
var PDKRoom = BaseRoom.extend({//Room
	/** @lends PDKRoom.prototype */

	//----------------------------------------------------------------//
	_cardPanel:null,
	_cardW:275,
	_cardG:75,//65
	/**
	 * {Array.<BigCard>}
	 */
	_cards:[],
	_allCards:[],
	_cCardPattern:null,
	_lastCardPattern:null,
	_lastLetOutSeat:0,
	_touchedCards:null,
	_touchListener:null,
	_startId:null,
	_currentlyMoveId:null,
	_startX:null,
	_touchBeganX:null,
	_isLeft2Right:false,
	_isLeft2RightWithBegan:false,
	_players:null,
	seatSeq:{},
	_letOutButtonTouchable:null,

	//----------------------------------------------------------------//
	_statusMap:null,
	_dt:null,
	_countDown:null,
	_timedt:null,
	COUNT_DOWN: 10,
	showTuoGuanTimeOutHandle:null,
	isSamallOver:false,

	ctor:function(){
		this._statusMap = {};
		this._dt = 0;

		this._timedt = 0;
		this._loacationDt = 0;
		this.showTuoGuanTimeOutHandle = null;
		this.isSamallOver = false;
		this._super(LayerFactory.PDK_ROOM);

		// cc.log("PDKRoomModel.intParams[21] =",PDKRoomModel.intParams[21]);
		if (PDKRoomModel.isAutoPlay()){
			this._countDown = PDKRoomModel.intParams[21] ==1?60:PDKRoomModel.intParams[21];
		}else{
			this._countDown = this.COUNT_DOWN;
		}
		this._letOutButtonTouchable = true;
		this._cards = [];
		this._allCards = [];
		this._touchedCards = [];
		this._players = {};
		this.seatSeq = PDKRoomModel.seatSeq;
		this._huikanData = [];
	},

	/**
	 * 初始化房间数据//
	 */
	initData:function(){
		//cc.log("initData...");
		//this.Image_qiepai.visible = false;
		var hongshiDesc = ClubRecallDetailModel.getPDKWanfa(PDKRoomModel.intParams);
		if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK){
			hongshiDesc = ClubRecallDetailModel.getZZPDKWanfa(PDKRoomModel.intParams);
		}

		this.roomName_label.setString(PDKRoomModel.roomName);

		if(PDKRoomModel.isMatchRoom()){
			this.roomName_label.setString(PDKRoomModel.roomName + "\n挑战白金豆:" + PDKRoomModel.strParams[1]);
			hongshiDesc = hongshiDesc.replace(/ .*支付/,"");
		}
		hongshiDesc = hongshiDesc.replace(/ /g, "/");
		this.getWidget("Label_hongshi").setString(hongshiDesc);

		PlayPDKMessageSeq.clean();
		this.seatSeq = PDKRoomModel.seatSeq;
		sy.scene.hideLoading();
		//this.Label_38.setString(PDKRoomModel.wanfa+"张玩法");
		//this.Button_qiepai.visible = false;
		this.Image_40.visible = false;
		this.Image_baodan.visible = false;
		if (PDKRoomModel.nowBurCount == 1){
			this.isSamallOver = false;
		}
		if(this.labelRand){
			this.labelRand.setString(PDKRoomModel.nowBurCount + "/" + PDKRoomModel.totalBurCount);
		}
		if(this.bg_CancelTuoguan){
			this.bg_CancelTuoguan.visible = false;
		}
		if(this.showTuoGuanTimeOutHandle){
			clearTimeout(this.showTuoGuanTimeOutHandle);
			this.showTuoGuanTimeOutHandle = null;
		}

		this.showDaNiaoState(0);
		// this.showWaitSelectPiao(false);
		if(PDKRoomModel.ext[25] == 0){
			var xiPaiBtnNode = this.getChildByName("xiPaiBtnNode");
			if (xiPaiBtnNode) {
				xiPaiBtnNode.removeFromParent(true);
				xiPaiBtnNode = null;
			}
		}
		this._players = {};
		var players = PDKRoomModel.players;
		for(var i=1;i<=3;i++){
			this.getWidget("player"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			this.getWidget("small"+i).removeAllChildren(true);
			if(i>1)
				this.getWidget("bt"+i).visible = false;
		}
		if(this._cards.length>0){//清理掉上一局的牌
			for(var i=0;i<this._cards.length;i++){
				this._cardPanel.removeChild(this._cards[i]);
			}
			this._cards.length=0;
		}
		if(this._cardPanelAni){//清理掉开局动画的牌
			this._cardPanelAni.removeAllChildren();
		}
		this._lastCardPattern = null;
		this.btnBreak.visible = this.Button_4.visible = false;

		this.Button_30.x = 1200;
		this.Button_tuichu.x = 670;
		this.Button_30.visible = this.Button_tuichu.visible = true;
		

		if(this.countDownLabel && PDKRoomModel.isAutoPlay()){
			this._countDown = PDKRoomModel.getTuoguanTime();
		}

		var isContinue = false;//是否是恢复牌局
		var isDaniao = false;
		var isPiaofen = false;
		for(var i=0;i<players.length;i++){
			var p = players[i];
			isContinue = (p.handCardIds.length>0 || p.outCardIds.length>0);
			if(PDKRoomModel.intParams[31] == 1 &&p.ext[15] < 0){
				isPiaofen = true;
			}
			if(PDKRoomModel.intParams[28] == 1 && p.ext[14] < 0){
				isDaniao = true;
			}
			if(isContinue)
				break;
		}
		// cc.log("isContinue =", isContinue);
		for(var i=0;i<players.length;i++){
			var isYbq = false;
			var p = players[i];
			var seq = this.getPlayerSeq(p.userId,PDKRoomModel.mySeat, p.seat);
			var cardPlayer = this._players[p.seat] = new PDKCardPlayer(p,this.root,seq);
			// cc.log("p.ext[15] =",p.ext[15]);
			if(p.ext[15] > -1){
				if(p.seat == PDKRoomModel.mySeat){
					this.Panel_piaofen.visible =false;
				}
				cardPlayer.showPiaoFenImg(p.ext[15]);
			}
			if(p.ext[14] > 0){
				cardPlayer.showDaNiaoImg(true);
			}
			if(PDKRoomModel.ext[25] == 1 && p.seat == PDKRoomModel.mySeat){
				if(p.ext[14] < 0){
					this.showDaNiaoState(1);
				}else{
					this.showDaNiaoState(2);
				}
			}

			if(PDKRoomModel.ext[25] == 3 && !isDaniao && !isPiaofen){
				if(PDKRoomModel.intParams[34] == 1){
					this.showWaitSelectPiao(false);
					if(p.seat == PDKRoomModel.mySeat){
						if(p.ext[16] < 0){
							this.showXiPaiBtn();
						}else{
							this.showXiPaiWaitString();
						}
					}
				}
			}
			if(!isContinue){
				var isShowStatus = PDKRoomModel.intParams[31]>0?PDKRoomModel.nowBurCount == 1:true;
				if(p.status && isShowStatus){
					cardPlayer.showStatus(p.status);
				}
			}else{//恢复牌局
				this.isDaNiao = this.isPiaoFen = false;
				if(p.outCardIds.length>0){//模拟最后一个人出牌
					if(p.userId == PlayerModel.userId && PDKRoomModel.nextSeat== p.seat){
						this._lastCardPattern = null;
					}else{
						var cardTransData = [];
						for(var j=0;j<p.outCardIds.length;j++){
							cardTransData.push(PDKAI.getCardDef(p.outCardIds[j]));
						}
						this._lastCardPattern = PDKAI.filterCards(cardTransData);
						if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK)
							this._lastCardPattern = PDKAI.filterCardsForZZPDK(cardTransData);
						if(p.recover.length >= 4){
							//连对牌型 后台传的连对数值(5)和前段的数值(3)不一致，那前段只在炸弹带牌和三带这类有误差的牌型上做修正类型即可
							if(this._lastCardPattern.type == PDKAI.BOMBWITHCARD || this._lastCardPattern.type == PDKAI.THREE){
								var curCardType = p.recover[3];
								this.fixCardType(curCardType);
							}
						}
					}

					this._lastLetOutSeat = p.seat;
					p.ext[1]+=p.outCardIds.length;
					// cc.log("this._lastLetOutSeat =, p.seat = ",this._lastLetOutSeat,p.seat);

					// cc.log("p.outCardIds = ",JSON.stringify(p.outCardIds));
					this.letOutCards(p.outCardIds,p.seat);

					//为什么出牌人的保单状态不考虑？
					if(p.recover.length > 2){
						if(p.recover[1]==1){
							cardPlayer.baoting();
						}
					}

				}else{
					cc.log("p.recover value ..." , p.recover);
					if(p.recover.length>0){//恢复牌局的状态重设
						if(p.recover[0]==0){
							cardPlayer.showStatus(-1);
							if(p.userId == PlayerModel.userId && PDKRoomModel.nextSeat== p.seat){//要不起，轮到我出牌，需要通知后台
								isYbq = true;
								this.sendPlayCardMsg(0,[]);
							}
						}
						if(p.recover[1]==1){
							cc.log("p.recover[1]..." , p.seat , cardPlayer.seq);
							cardPlayer.baoting();
						}

						cardPlayer.leaveOrOnLine(p.recover[2]);
					}
				}
				cardPlayer.showLastCard();
			}
			if (PDKRoomModel.isAutoPlay() && PDKRoomModel.getPlayerIsNowTuoguan(p)){
				cardPlayer.updateTuoguan(true)
			}
			if(p.userId ==PlayerModel.userId){//自己的状态处理
				if(p.handCardIds.length>0){
					this.Button_30.visible = this.Button_tuichu.visible = false;
					this.btnBreak.visible = this.Button_4.visible = (!isYbq && PDKRoomModel.nextSeat==PDKRoomModel.mySeat);
					this._players[PDKRoomModel.mySeat].deal(p.handCardIds);
					this.initCards(p.handCardIds);
				}else{

				}
				if(p.status){
					this.Button_tuichu.x = 960;
					this.Button_30.visible = false;
				}

				//判断是否需要显示 取消托管按钮
				if(this.bg_CancelTuoguan){
					var isMeTuoguan = PDKRoomModel.getPlayerIsNowTuoguan(p);
					cc.log("断线重连判断是否是托管状态..."  , isMeTuoguan);
					this.bg_CancelTuoguan.visible = isMeTuoguan;
				}
			}
		}
		this.isStart = false;
		if(isContinue){
			this.showJianTou(PDKRoomModel.nextSeat);
			this.isStart = true;
			this.Button_30.visible = this.Button_tuichu.visible = false;
			if(PDKRoomModel.isNextSeatBt()){
				this.Image_baodan.visible = true;
			};
		}
		this.setInviteBtnState();
		if(this.labelRoomId){
			this.labelRoomId.setString(PDKRoomModel.tableId);
		}
		//IP相同的显示
		if(players.length>1 && PDKRoomModel.renshu != 2){
			var seats = PDKRoomModel.isIpSame();
			if(seats.length>0){
				for(var i=0;i<seats.length;i++) {
					this._players[seats[i]].isIpSame(true);
				}
			}
		}

		if (this.isDaNiao || this.isPiaoFen || this.isStart ){
			this.Button_30.visible = false;
			this.Button_tuichu.visible = false
		}
		if (PDKRoomModel.nowBurCount > 1) {
			this.Button_tuichu.visible = false
			this.Button_30.x = 960;
		}
		this.isCanLetOut()
	},

	showWaitSelectPiao:function(isShow){
		this.Button_tuichu.visible = false;
		if(isShow){
			if(!this.waitPiaoImg){
				this.waitPiaoImg = new cc.Sprite("res/res_pdk/pdkRoom/word_piaofen.png");
				this.waitPiaoImg.setPosition(cc.winSize.width/2 + 50,cc.winSize.height/2 + 180);
				this.addChild(this.waitPiaoImg,4);
			}
			this.waitPiaoImg.setVisible(true);
		}else{
			this.waitPiaoImg && this.waitPiaoImg.setVisible(false);
		}
	},

	showDaNiaoState:function(type){
		this.Button_tuichu.visible = false;
		var daNiaoNode = this.getChildByName("daNiaoNode");
		if(daNiaoNode){
			daNiaoNode.removeFromParent(true);
			daNiaoNode = null;
		}
		if(type == 1 || type == 2){
			daNiaoNode = new cc.Node();
			daNiaoNode.setName("daNiaoNode");
			daNiaoNode.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 100);
			this.addChild(daNiaoNode,100);

			if(type == 1){
				var btn1 = new ccui.Button("res/res_pdk/pdkRoom/btn_dn.png");
				btn1.setPosition(250,0);
				btn1.flag = 1;
				UITools.addClickEvent(btn1,this,this.onClickDaNiaoBtn);
				daNiaoNode.addChild(btn1);

				var btn2 = new ccui.Button("res/res_pdk/pdkRoom/btn_bdn.png");
				btn2.setPosition(-250,0);
				btn2.flag = 0;
				UITools.addClickEvent(btn2,this,this.onClickDaNiaoBtn);
				daNiaoNode.addChild(btn2);
			}else if(type == 2){
				var tipLabel = new cc.LabelTTF("等待其他玩家选择打鸟","Arial",54);
				tipLabel.setPosition(0,0);
				tipLabel.setColor(cc.color.BLUE);
				daNiaoNode.addChild((tipLabel));
			}
		}
	},

	onClickDaNiaoBtn:function(sender){
		sySocket.sendComReqMsg(214,[sender.flag]);
	},

	onDaNiao:function(event){
		this.Button_tuichu.visible = false;
		
		this.isDaNiao = true;
		// cc.log("this.isDaNiao1111 =",this.isDaNiao);
		var msg = event.getUserData();
		if(msg.params[0] == 1){
			this.showDaNiaoState(1);
		}else if(msg.params[0] == 2){
			if(this._players[msg.params[1]] && msg.params[2] > 0){
				this._players[msg.params[1]].showDaNiaoImg(true);
			}
			if(msg.params[1] == PDKRoomModel.mySeat){
				this.showDaNiaoState(2);
			}
		}
	},

	isForceRemove:function(){
		return true;
	},

	/**
	 * button名称定义
	 */
	BTN_READY:"BTN_READY",
	BTN_INVITE:"BTN_INVITE",
	BTN_BREAK:"BTN_BREAK",
	BTN_SETUP:"BTN_SETUP",
	BTN_LEAVE:"BTN_LEAVE",
	BTN_CHAT:"BTN_CHAT",
	BTN_YUYIN:"BTN_YUYIN",
	NET_TYPE:"NET_TYPE",
	BATTERY:"BATTERY",
	/**
	 // * 获取指定按钮的名字
	 // * @param wName
	 // */
	getWidgetName:function(wName){
		var name = "";
		switch(wName){
			case this.BTN_READY:
				name = "Button_30";
				break;
			case this.BTN_INVITE:
				name = "Button_17";
				break;
			case this.BTN_BREAK:
				name = "Button_6";
				break;
			case this.BTN_SETUP:
				name = "Button_75";
				break;
			case this.BTN_LEAVE:
				name = "Button_7";
				break;
			case this.BTN_CHAT:
				name = "Button_42";
				break;
			case this.BTN_YUYIN:
				name = "Button_40";
				break;
			case this.NET_TYPE:
				name = "netType";
				break;
			case this.BATTERY:
				name = "battery";
				break;
		}
		return name;
	},

	selfRender:function(){
		//Room.prototype.selfRender.call(this);
		BaseRoom.prototype.selfRender.call(this);//这里面可能会有部分不兼容的控件名
		//------------------------------------------------------------------------//
		//cc.log("PDKRoom selfRender...");
		for(var i=1;i<=3;i++){
			if(i>1)
				this.getWidget("bt"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			UITools.addClickEvent(this.getWidget("player"+i),this,this.onPlayerInfo);
			UITools.addClickEvent(this.getWidget("icon"+i),this,this.onPlayerInfo);
		}
		this.yuyin.visible = false;
		this.Image_40 = this.getWidget("Image_40");//闹钟
		this.Label_56 = this.getWidget("Label_56");//第几局
		this.Button_4 = this.getWidget("Button_4")//提示;
		//this.Button_4.scaleX = 1.2;
		this.Button_30 = this.getWidget("Button_30");//准备
		this.Button_sset = this.getWidget("Button_sset");
		UITools.addClickEvent(this.Button_sset,this,this.onZhanKai)
		this.btnBreak.visible = this.Button_4.visible = false;
		//this.btnBreak.scaleX = 1.2;
		this.Button_17 = this.getWidget("Button_17");//邀请微信好友
		this.Button_17.visible = false;
		this.Button_tuichu = this.getWidget("Button_tuichu");
		UITools.addClickEvent(this.Button_tuichu, this, function () {
			sySocket.sendComReqMsg(6);
		});

		this.Button_tuichu.visible = true;

		this.Label_27 = this.getWidget("Label_27");
		this.Label_39 = this.getWidget("Panel_time");//时间
		this.labelTime = this.getWidget("LableTime");
		this.Button_40 =this.getWidget("Button_40");//语音按钮
		this.Button_42 =this.getWidget("Button_42");//快捷聊天
		this.Button_huikan = this.getWidget("Button_huikan"); // 回看按钮
		this.Button_huikan.visible = false;
		if (PDKRoomModel.intParams[26] == 1){
			this.Button_huikan.visible = true;
		}
		UITools.addClickEvent(this.Button_42,this,this.onChat);
		var cardPanel = this._cardPanel = ccui.helper.seekWidgetByName(this.root,"cardPanel");
		if (SdkUtil.is316Engine()) {
			cardPanel.setTouchEnabled(true);
			cardPanel.addTouchEventListener(this.onTouchCardPanel,this);
		}else{
			this._touchListener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: this.onTouchBegan.bind(this),
				onTouchMoved: this.onTouchMoved.bind(this),
				onTouchEnded: this.onTouchEnded.bind(this)
			});
			cc.eventManager.addListener(this._touchListener, cardPanel);
		}
		//cc.eventManager.addListener(this._touchListener, cardPanel);

		this._cardPanelAni = this.getWidget("cardPanelAni");
		this.getWidget("label_version").setString(SyVersion.v);
		//------------------------------------------------------------------------//

		this.Image_qiepai = this.getWidget("Image_qiepai");
		this.Image_baodan = this.getWidget("Image_baodan");
		this.uidText = this.getWidget("uid1");
		this.Panel_37 = this.getWidget("Panel_fh");
		this.labelRand = this.getWidget("labelRand");
		this.labelRoomId = this.getWidget("labelRoomId");
		//this.wanfaImg = this.getWidget("Image_wanfa");
		this.Panel_36 = this.getWidget("Panel_jushu");
		this.Panel_15 = this.getWidget("Panel_15");
		this.Label_38 = this.getWidget("Label_38");
		this.battery = this.getWidget("battery");
		this.netType = this.getWidget("netType");
		//this.Button_qiepai = this.getWidget("Button_qiepai");
		// cc.log("PDKRoomModel.roomName =",PDKRoomModel.roomName);
		this.roomName_label = new cc.LabelTTF("","Arial",39,cc.size(750, 0));
		this.addChild(this.roomName_label, 10);
		if (PDKRoomModel.roomName){
			this.roomName_label.setString(PDKRoomModel.roomName);
			this.roomName_label.setColor(cc.color(255,255,255));
			this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
			this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
			this.roomName_label.x = cc.winSize.width/2;
			this.roomName_label.y = cc.winSize.height/2 + 405;
		}

		// label.setString();
		this.getWidget("Label_hongshi").visible = false;
		var wanfaBtn = this.getWidget("Button_wanfa");
		UITools.addClickEvent(wanfaBtn,this,function () {
			this.getWidget("Label_hongshi").visible = !this.getWidget("Label_hongshi").visible;
		})
		
		this.btn_Gps = this.getWidget("btn_Gps");
		if(SyConfig.HAS_GPS && PDKRoomModel.renshu > 2){
			this.btn_Gps.visible = true;
		}else{
			this.btn_Gps.visible = false;
		}
		if(GPSModel.getGpsData(PlayerModel.userId) == null){
			this.btn_Gps.setBright(false);
			//this.btn_Gps.setTouchEnabled(false);
		}else{
			this.btn_Gps.setBright(true);
			this.btn_Gps.setTouchEnabled(true);
		}
		if (SdkUtil.isReview()){
			this.btn_Gps.visible = false;
		}

		UITools.addClickEvent(this.btn_Gps ,this,this.onGpsPop);
		UITools.addClickEvent(this.Panel_15,this,this.onCancelSelect,false);
		UITools.addClickEvent(this.btnBreak,this,this.onPlayCard);
		UITools.addClickEvent(this.Button_4,this,this.onPlayTip);
		UITools.addClickEvent(this.Button_17,this,this.onInvite);
		UITools.addClickEvent(this.Button_30,this,this.onReady);
		UITools.addClickEvent(this.Button_huikan,this,this.openHuiKanPanel);
		//cc.log(".........PDKRoom addClickEvent");

		this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction);
		this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS,this,this.updateGpsBtn);
		this.addCustomEvent(SyEvent.ROOM_ROLD_ICON,this,this.setRoldPlayerIcon);
		this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBgColor);
		this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);
		this.addCustomEvent(SyEvent.CHANGE_PDK_CARDS , this,this.changePDKcards);
		this.addCustomEvent(SyEvent.PDK_DESK_HUIKAN , this,this.OnDeskHuiKan);
		this.addCustomEvent(SyEvent.BISAI_XIPAI , this,this.NeedXipai);
		this.addCustomEvent("LDFPF_KAIJUXIPAI", this, this.showXiPaiBtn);
        this.addCustomEvent("LDFPF_FINISH_KAIJUXIPAI", this, this.FiNiShXiPai);

		this.addCustomEvent(SyEvent.PDK_DA_NIAO , this,this.onDaNiao);
		this.addCustomEvent(SyEvent.PDK_PIAOFEN , this,this.StartPiaoFen);
		this.addCustomEvent(SyEvent.PDK_FINISH_PIAOFEN , this,this.FinishPiaoFen);

		this.countDownLabel = new cc.LabelBMFont("30","res/font/font_res_tu.fnt");
		this.countDownLabel.x = this.Image_40.width/2;
		this.countDownLabel.y = this.Image_40.height/2 - 2;
		this.countDownLabel.scale = 1.4;
		this.Image_40.addChild(this.countDownLabel);
		this.calcTime();
		this.calcWifi();
		this.scheduleUpdate();

		this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//取消托管按钮
		this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
		if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
			this.bg_CancelTuoguan.visible = false;
			this.bg_CancelTuoguan.setLocalZOrder(100);
			UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
		}
		if (SdkUtil.isIphoneX()) {
			this.getWidget("player3").x += 30;
			this.btn_Gps.x += 15;
			this.getWidget("small3").x += 30;
		}
		var type = UITools.getLocalItem("sy_pdk_pz") || 2;
		this.showBgColor(type);


		var huBg = "res/ui/common/img_ting1.png";
		this.Panel_huikan = new cc.Scale9Sprite(huBg,null,cc.rect(10,10,1,1));
		this.Panel_huikan.x = 1200;
		this.Panel_huikan.y = 645;
		this.Panel_huikan.width = 900;
		this.Panel_huikan.height = 450;
		this.root.addChild(this.Panel_huikan,4);
		this.Panel_huikan.visible =false


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
		this.Button_p8f = this.getWidget("Button_p8f");//飘5分
		this.Button_p8f.temp = 8;
		UITools.addClickEvent(this.Button_bp,this,this.onPiaoFen);
		UITools.addClickEvent(this.Button_p1f,this,this.onPiaoFen);
		UITools.addClickEvent(this.Button_p2f,this,this.onPiaoFen);
		UITools.addClickEvent(this.Button_p3f,this,this.onPiaoFen);
		UITools.addClickEvent(this.Button_p5f,this,this.onPiaoFen);
		UITools.addClickEvent(this.Button_p8f,this,this.onPiaoFen);

	},

	onPiaoFen:function(obj){
		//飘分
		var temp = obj.temp;
		sySocket.sendComReqMsg(2021,[temp]);
	},

	StartPiaoFen:function(message){
		this.Button_tuichu.visible = false;
		var params = message.getUserData().params;
		this.showPiaoFenPanel(params[0]);
		this.showWaitSelectPiao(true);
	},
	FinishPiaoFen:function(event){
		for(var i=1;i<=3;i++){
			this.getWidget("ybq"+i).visible = false;
		}
		var message = event.getUserData();
		var params = message.params;
		// cc.log("params",params);
		var userId = params[0];
		var p = PDKRoomModel.getPlayerVo(userId)
		if (params[1] != -1){
			this._players[p.seat].showPiaoFenImg(params[1])
			if (p.seat == PDKRoomModel.mySeat){
				this.Panel_piaofen.visible = false;
			}
		}else{
			this.showWaitSelectPiao(true);
		}
	},

	showPiaoFenPanel:function(type) {
		for(var i=1;i<=3;i++){
			this.getWidget("ybq"+i).visible = false;
		}
		this.Button_tuichu.visible = false;
		this.Panel_piaofen.visible = true;
		// cc.log("type===",type)

		var btnArr = [this.Button_bp,this.Button_p1f,this.Button_p2f,this.Button_p3f,this.Button_p5f,this.Button_p5f];
		if (type==3){//飘1/2/3
			this.Button_p1f.x = 485;
			this.Button_p2f.x = 813;
			this.Button_p3f.x = 1141;
			this.Button_p5f.visible = false;
			this.Button_p8f.visible = false;
		}else if (type==4) {//飘2/3/5
			this.Button_p2f.x = 485;
			this.Button_p3f.x = 813;
			this.Button_p5f.x = 1141;
			this.Button_p1f.visible = false;
			this.Button_p8f.visible = false;
		}else if (type==5) {//飘2/5/8
			this.Button_p2f.x = 485;
			this.Button_p5f.x = 813;
			this.Button_p8f.x = 1141;
			this.Button_p1f.visible = false;
			this.Button_p3f.visible = false;
		}
	},

	OnDeskHuiKan:function(message){
		var data = message.getUserData();
		if (data.strParams[0].length > 1){
			this._huikanData = JSON.parse(data.strParams);
			this.showHuiKanCards();
		}
		// cc.log("OnDeskHuiKan==>this._huikanData =",JSON.stringify(this._huikanData));

	},
	showHuiKanCards:function(){
		// cc.log("OnDeskHuiKan==>this._huikanData2 =",JSON.stringify(this._huikanData));
		this.Panel_huikan.removeAllChildren();
		var _cardW = 275;
		var pm = UITools.getLocalItem("sy_pdk_pm") || 3;
		if (pm == 2){
			_cardW = 264;
			//this.btnBreak.y = this.Button_4.y = 327;
		}else if (pm == 3) {
			_cardW = 300;
			//this.btnBreak.y = this.Button_4.y = 327;
		}else if (pm == 1) {
			_cardW = 275;
			//this.btnBreak.y = this.Button_4.y = 350;
		}

		for (var i = 0; i < this._huikanData.length; i++) {
			var ids = this._huikanData[i].cards;
			var cardIds = [];
			for (var j = 0; j < ids.length; j++) {
				cardIds.push(PDKAI.getCardDef(ids[j]));
			}
			this._huikanData[i].cards = cardIds;
		}

		for (var i = 0; i < this._huikanData.length; i++) {
			var cards = this._huikanData[i].cards;
			var name = this._huikanData[i].name;
			name = UITools.truncateLabel(name,4);
			for (var j = 0; j < cards.length; j++) {
				var card = new PDKBigCard(cards[j]);
				card.scale = 0.3;
				card.x = this.Panel_huikan.width - (_cardW*0.3/2)*j -40;
				card.y = (this.Panel_huikan.height - 55) - (this._huikanData.length - 1 -i) * 100;
				card.varNode.visible = true;
				card.backNode.visible = false;
				card.setLocalZOrder(16-j);
				this.Panel_huikan.addChild(card);
				if (j == cards.length - 1){
					var nameLabel = new cc.LabelTTF("", "Arial", 22);
					nameLabel.setString(name);
					nameLabel.y = 130;
					nameLabel.x = -50;
					nameLabel.scale = 3;
					nameLabel.anchorX = 1;
					nameLabel.setColor(cc.color(255,255,255));
					card.addChild(nameLabel);
				}
			}
		}
	},
	openHuiKanPanel:function () {
		if (this._huikanData.length == 0){
			return
		}
		this.Panel_huikan.visible = !this.Panel_huikan.isVisible();
	},

	updateBgColor:function(event){
		var type = event.getUserData();
		this.showBgColor(type);
	},

	changePDKcards:function(event){
		// cc.log("PDKRoom -> changePDKcards ***")
		var type = event.getUserData();
		if (this._cards.length > 0){
			for(var i=0;i<this._cards.length;i++){
				this._cards[i].refreshCardsType(type)
			}
		}
		var winSize = cc.director.getWinSize();
		var centerX = (winSize.width - this._cardW)/2;
		var maxCard = PDKRoomModel.isWanfa15()?15:16;
		var isHongshi = PDKRoomModel.isHongShi();
		var pm = UITools.getLocalItem("sy_pdk_pm") || 3;
		if (pm == 2){
			this._cardW = 264;
			//this.btnBreak.y = this.Button_4.y = 327;
		}else if (pm == 3) {
			this._cardW = 300;
			//this.btnBreak.y = this.Button_4.y = 327;
		}else if (pm == 1) {
			this._cardW = 275;
			//this.btnBreak.y = this.Button_4.y = 350;
		}
		//var initX = (winSize.width - (this._cardW+this._cardG*(this._cards.length-1)))/2;
		//for(var i=0;i<this._cards.length;i++){
		//	var card = this._cards[i];
		//	var realX = initX+i*this._cardG;
		//	card.x = realX;
		//}
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
			cc.log("seat , isTuoguan" , seat , isTuoguan);
			var player = this._players[seat];
			if(player){
				player.updateTuoguan(isTuoguan);
			}else{
				cc.log("!!!!!!!未获取到player");
			}
			if(seat == PDKRoomModel.mySeat && this.bg_CancelTuoguan){
				if (isTuoguan){
					this.showTuoGuanTimeOutHandle = setTimeout(function(){//需要延时显示取消托管
						self.bg_CancelTuoguan.visible = isTuoguan;
					},2000);
				}else{
					self.bg_CancelTuoguan.visible = isTuoguan;
				}
			}
		}
	},

	//更新背景图和 更新字体颜色
	showBgColor: function (_type) {
		//绿色背景1蓝色背景2紫色背景3
		// cc.log("_type =",_type);
		var bgTexture = "res/res_pdk/pdkRoom/Bgc2.jpg";
		if (_type == 1){
			bgTexture = "res/res_pdk/pdkRoom/Bgc1.jpg";
			// this.getWidget("Label_hongshi").setColor(cc.color(73,178,191));
			this.roomName_label.setColor(cc.color(90,78,45));
		}else if (_type == 2){
			bgTexture = "res/res_pdk/pdkRoom/Bgc2.jpg";
			// this.getWidget("Label_hongshi").setColor(cc.color(70,140,51));
			this.roomName_label.setColor(cc.color(214,203,173));
		}else if (_type == 3){
			bgTexture = "res/res_pdk/pdkRoom/Bgc3.jpg";
			// this.getWidget("Label_hongshi").setColor(cc.color(176,137,94));
			this.roomName_label.setColor(cc.color(90,78,45));
		}
		this.Panel_15.setBackGroundImage(bgTexture);
	},

	setRadioBtnImg:function(){
		this.audioBtnImg = "res/res_pdk/pdkRoom/pdkRoom_4.png";
		this.btnUntouchImg = "res/res_pdk/pdkRoom/pdkRoom_5.png";
	},


	//标记 玩家已经显示了头像
	setRoldPlayerIcon:function(event) {
		var seat = event.getUserData();
		cc.log("修改玩家是否已经绘制完头像" , seat);
		var players = PDKRoomModel.players;
		for(var i=0;i<players.length;i++) {
			var p = players[i];
			if(p.seat ==seat){
				p.isRoladIcon = 1;
			}
		}
	},

	updateGpsBtn:function(){
		//if(this.btn_Gps){
		//	if(GPSModel.getGpsData(PlayerModel.userId) == null){
		//		this.btn_Gps.setBright(false);
		//		//this.btn_Gps.setTouchEnabled(false);
		//	}else{
		//		this.btn_Gps.setBright(true);
		//		this.btn_Gps.setTouchEnabled(true);
		//	}
		//}
	},

	onZhanKai:function(){
		var mc = new PDKRoomSetPop();
		PopupManager.addPopup(mc);
	},

	onPlayerInfo:function(obj){
		this._players[obj.temp].showInfo();
	},

	onChat:function(){
		var mc = new ChatPop();
		PopupManager.addPopup(mc);

		// this.xipaiAni();
	},

	onQiePai:function(){
		sySocket.sendComReqMsg(22,[]);
	},

	onGpsPop:function(){
		PopupManager.addPopup(new GpsPop(PDKRoomModel , 3));
	},

	runPropAction:function(event){
		//seat 接收者的座位号  userId表示发送者的userId  content表示道具的索引值
		var data = event.getUserData();
		var userId = data.userId;
		var seat = data.seat;
		var content = data.content;
		cc.log("content..." , content);
		var p = PDKRoomModel.getPlayerVo(userId);
		var fromPlayer = this._players[p.seat];
		var targetPlayer = this._players[seat];
		if(fromPlayer._playerVo.userId != targetPlayer._playerVo.userId) {
			var url = "res/ui/emoji/prop" + content + ".png";
			var prop = new cc.Sprite(url);
			var initX = fromPlayer.getContainer().x;
			var initY = fromPlayer.getContainer().y;
			var x = initX;
			var y = initY;
			prop.setPosition(x, y);
			this.root.addChild(prop,2000);
			initX = targetPlayer.getContainer().x;
			initY = targetPlayer.getContainer().y;
			var targetX = initX;
			var targetY = initY - 40;
			cc.log("fromPlayer._playerVo.seat... " , p.seat , targetX , targetY);
			var action = cc.sequence(cc.moveTo(0.3, targetX, targetY), cc.callFunc(function () {
				targetPlayer.playPropArmature(content);
				prop.removeFromParent(true);
			}));
			prop.runAction(action);
		}else{
			targetPlayer.playPropArmature(content);
		}
	},

	onCancelSelect:function(){
		var isHas = false;
		for(var i=0;i<this._cards.length;i++){
			if(this._cards[i].isEnable()){
				isHas = true;
				break;
			}
		}
		if(!isHas){
			this.unSelectAllCards();
			this._allCards.length=0;
			this.isCanLetOut();
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
	 * 状态改变
	 * @param event
	 */
	onChangeStauts:function(event){
		var message = event.getUserData();
		var params = message.params;
		var seat = params[0];
		var status = params[1];
		cc.log("改变该座位玩家状态..." , seat);
		this._players[seat].showStatus(status);
		if(seat == PDKRoomModel.mySeat){
			this.Button_30.visible = /*this.Button_qiepai.visible =*/false;
			this.Button_tuichu.x = 960;
			this.setInviteBtnState();
		}
	},

	setInviteBtnState:function(){
		// this.Button_17.visible = (PDKRoomModel.players.length < PDKRoomModel.renshu);
		this.Button_17.visible =false;

		if(PDKRoomModel.isMatchRoom()){
			this.Button_17.visible = false;
		}
	},

	unSelectAllCards:function(){
		for(var i=0;i<this._cards.length;i++){
			var card = this._cards[i];
			if(card.isSelected())
				card.unselected();
		}
	},

	enableAllCards:function(){
		for(var i=0;i<this._cards.length;i++){
			this._cards[i].enableAction();
		}
	},

	/**
	 * 当前牌局结束
	 * @param event
	 */
	onOver:function(event){
		this.isStart = false;
		this.isSamallOver = true;
		var data = event.getUserData();
		if(PlayPDKMessageSeq.sequenceArray.length>0){
			PlayPDKMessageSeq.cacheClosingMsg(data);
			return;
		}

		for(var i=0;i<data.length;i++){
			this.letOutCards(data[i].cards,data[i].seat,true);
		}
		this.btnBreak.visible = this.Button_4.visible = false;
		this.Image_40.visible = /*this.Image_qiepai.visible =*/ false;
		this.Panel_huikan.visible = false;
		this._huikanData = [];
		var self = this;
		setTimeout(function(){//延迟弹出结算框
			for(var i=1;i<=3;i++){
				self.getWidget("small"+i).removeAllChildren(true);
				self.getWidget("ybq"+i).visible = false;
			}
			for(var i=0;i<data.length;i++){
				self._players[data[i].seat].updatePoint(data[i].totalPoint);
				self._players[data[i].seat].hidePiaoFenImg();
			}
			self.cleanCardsData();
			var mc = new PDKSmallResultPop(data);
			PopupManager.addPopup(mc);
		},500);
	},
	cleanCardsData:function(){
		this._cCardPattern = null;
		this._allCards =[];
	},
	onTouchCardPanel:function(obj,type) {
		if (type == ccui.Widget.TOUCH_BEGAN){
			this.isTuoguan = false;
			this.isTuoguan = PDKCardDelegate.dealTouchBegin(this , obj , type);
		}else if(type == ccui.Widget.TOUCH_MOVED && this.isTuoguan){
			PDKCardDelegate.dealTouchMove(this , obj , type);
		}else if(type == ccui.Widget.TOUCH_ENDED && this.isTuoguan){
			PDKCardDelegate.dealTouchEnded(this , obj , type);
		}else if(type == ccui.Widget.TOUCH_CANCELED && this.isTuoguan){
			PDKCardDelegate.dealTouchEnded(this , obj , type);
		}
		if(type == ccui.Widget.TOUCH_ENDED && !this.isTuoguan){
			this.onCancelSelect();
		}
	},
	/**
	 * 修正前端错误的出牌类型
	 */
	fixCardType:function(cardType){
		if(this._lastCardPattern){
			if(this._lastCardPattern.type != cardType){
				cc.log("修正_lastCardPattern.type：", this._lastCardPattern.type  , cardType);
				this._lastCardPattern.type = cardType;//强行赋值！
			}
		}
	},

	clearDesk:function(){
		for(var i=1;i<=3;i++){
			this.getWidget("small"+i).removeAllChildren(true);
			this.getWidget("ybq"+i).visible = false;
		}
	},
	/**
	 * 收到出牌消息，前台开始处理
	 * @param event
	 */
	onLetOutCard:function(event){
		var message = event.getUserData();
		var simulate = message.simulate || false;
		var seat = message.seat;
		var cardIds = message.cardIds || [];
		var isPlay = message.isPlay || 0;

		cc.log("message =",JSON.stringify(message));
		//var isAuto = false;
		//if (PDKRoomModel.autoPlayCards && message.cardType == PDKRoomModel.autoPlayCards.cardType){
		//	isAuto =  cardIds.sort().toString() == PDKRoomModel.autoPlayCards.cardIds.sort().toString();
		//}
		//
		//
		////前台自己已经模拟了出牌的消息，后台给过来的出牌消息不处理后续逻辑
		//if(seat == PDKRoomModel.mySeat && isPlay == 2 && cardIds.length > 0 && !simulate && isAuto){
		//	PlayPDKMessageSeq.finishPlay();
		//	return;
		//}

		this._countDown = PDKRoomModel.getTuoguanTime();
		for(var i=1;i<=3;i++){
			this.getWidget("ybq"+i).visible = false;
		}
		var self = this;
		var buyao = false;
		var isclearDesk = message.isClearDesk;
		//服务器通知清桌子
		if (isclearDesk===1){
			this.clearDesk();
		}
		if(seat == PDKRoomModel.mySeat){//我自己出牌了，清理掉选择的牌
			this._allCards.length = 0;
			this.enableAllCards();
		}
		if(message.cardIds.length==0){//要不起
			buyao = true;
			this._players[seat].showStatus(-1);
			var overSeq = this.getPlayerSeq(-1,PDKRoomModel.mySeat,seat);
			this.getWidget("small"+overSeq).removeAllChildren(true);
		}else{
			//已经出牌了
			this._players[seat].hideLeaveSp();
			var ids = message.cardIds;
			var cardTransData = [];
			var handsTransData = [];//解决最后一手牌特殊牌型bug
			for(var i=0;i<ids.length;i++){
				cardTransData.push(PDKAI.getCardDef(ids[i]));
			}
			//修复最后一手出三张 前端未识别出牌型的问题
			//是最后一手牌 话说这种东西后台传下来不好么 非要前段用剩余牌数判断 问题是剩余牌数也只在短线重连的时候传 做金币场的时候必改之！不改？必杀之！
			if(seat == PDKRoomModel.mySeat){
				this._lastCardPattern = PDKAI.filterCards(cardTransData,this.getCardsOnHand());
				if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK)
					this._lastCardPattern = PDKAI.filterCardsForZZPDK(cardTransData,this.getCardsOnHand());
			}else{
				if(this._players[seat].getPlayLastCardsNum() == cardTransData.length){
					handsTransData = ArrayUtil.clone(cardTransData);
					this._lastCardPattern = PDKAI.filterCards(cardTransData,handsTransData);
					if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK)
						this._lastCardPattern = PDKAI.filterCardsForZZPDK(cardTransData,handsTransData);
				}else{//保留原来的逻辑
					this._lastCardPattern = PDKAI.filterCards(cardTransData);
					if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK)
						this._lastCardPattern = PDKAI.filterCardsForZZPDK(cardTransData);
				}
			}
			// cc.log("this._lastCardPattern =",JSON.stringify(this._lastCardPattern));
			if(this._lastCardPattern){
				if (this._lastCardPattern.type == PDKAI.BOMBWITHCARD || this._lastCardPattern.type == PDKAI.THREE){
					this.fixCardType(message.cardType);
				}
			}

			this._lastLetOutSeat = seat;
			if (seat != PDKRoomModel.mySeat)
				PDKRoomEffects.play(this.root,this._lastCardPattern);
			//if(this._lastCardPattern && this._lastCardPattern.type==AI.BOMB)
			//	PDKRoomEffects.bomb(this._players,this.root,seat);
			//cc.log("lastCardPattern::"+JSON.stringify(this._lastCardPattern));
		}
		//报停
		if(message.isBt){
			this._players[seat].baoting();
			if(PDKRoomModel.isNextSeatBt()){
				this.Image_baodan.visible = true;
			}
		}
		//下个出牌的位置
		var nextSeat = this.seatSeq[seat][1];
		if(nextSeat == PDKRoomModel.mySeat){//轮到我出牌了
			if(message.isLet===1){
				this.Button_4.visible = this.btnBreak.visible = true;
				if(this._lastLetOutSeat == PDKRoomModel.mySeat)//转了一圈了
					this._lastCardPattern = null;
				var selectedCards = ArrayUtil.clone(this.getCardsOnHand());
				var result = PDKAI.filterCards(selectedCards,this.getCardsOnHand(),this._lastCardPattern);
				if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK)
					result = PDKAI.filterCardsForZZPDK(selectedCards,this.getCardsOnHand(),this._lastCardPattern);
				// cc.log("result =",JSON.stringify(result));
				if(result){
					this.smartLetOut();
				}else{
					this.smartLetOut();
				}
				this.showJianTou(nextSeat);
			}else{//我也要不起
				setTimeout(function(){
					//self._players[PDKRoomModel.mySeat].showStatus(-1);
					self.sendPlayCardMsg(0,[]);
					self.letOutCards([],PDKRoomModel.mySeat);
					self.showJianTou(self.seatSeq[PDKRoomModel.mySeat][1]);
				},100);
				this.Button_4.visible = this.btnBreak.visible = false;
			}
		}else{
			this.showJianTou(nextSeat);
			this.Button_4.visible = this.btnBreak.visible = false;
		}
		if(!buyao){// && seat != PDKRoomModel.mySeat
			PDKRoomSound.letOutSound(message.userId,this._lastCardPattern);
		}
		this.letOutCards(message.cardIds,message.seat);
		PlayPDKMessageSeq.finishPlay();
	},

	onTouchBegan: function (touch, event) {
		return PDKCardDelegate.dealTouchBegin(this, touch , event);
	},

	onTouchMoved: function (touch, event) {
		return PDKCardDelegate.dealTouchMove(this, touch , event);
	},

	onTouchEnded: function (touch, event) {
		return PDKCardDelegate.dealTouchEnded(this, touch , event);
	},

	changeLetOutButton:function(isTouch){
		if(isTouch == this._letOutButtonTouchable)
			return;
		this._letOutButtonTouchable = isTouch;
		if(isTouch){
			this.btnBreak.setTouchEnabled(true);
			this.btnBreak.loadTextureNormal("res/res_pdk/pdkRoom/btn_2.png");
		}else{
			this.btnBreak.setTouchEnabled(false);
			this.btnBreak.loadTextureNormal("res/res_pdk/pdkRoom/btn_5.png");
		}
	},

	isCanLetOut:function(){
		//cc.log("isCanLetOut1::"+JSON.stringify(this._lastCardPattern));
		this._cCardPattern = PDKAI.filterCards(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
		if(GameTypeEunmPK.ZZPDK == PDKRoomModel.wanfa)
			this._cCardPattern = PDKAI.filterCardsForZZPDK(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
		//cc.log("isCanLetOut2::"+JSON.stringify(this._cCardPattern));
		if(this._lastCardPattern && this._cCardPattern && this._cCardPattern.type != this._lastCardPattern.type && this._cCardPattern.type != PDKAI.BOMB)
			this._cCardPattern = null;


		// 炸弹不可拆 如果拆了炸弹 无法出牌
		/**
		 * 四带三的特殊处理
		 * 如果上家是三带 或者 炸弹带 必须类型相同才可以打
		 */
		if((this._lastCardPattern && this._cCardPattern &&
			(this._lastCardPattern.type == PDKAI.BOMBWITHCARD || this._lastCardPattern.type == PDKAI.THREE)
			&& (this._cCardPattern.type != this._cCardPattern.type))){
			this.changeLetOutButton(false);
			return;
		}

		// cc.log("isCanLetOut3::"+JSON.stringify(this._cCardPattern));
		this.changeLetOutButton((this._cCardPattern!=null));


		if(this._allCards.length <= 0){
			PDKRoomModel.prompt(null);
			this.changeLetOutButton(false);
		}
		//把选中的牌全部取消了,提示的数据也需要清掉
	},

	getModel: function () {
		return PDKRoomModel;
	},

	getLabelTime: function () {
		return this.getWidget("LableTime");//时间;
	},

	/**
	 * 初始化卡牌
	 * @param cards {Array.<CardVo>}
	 */
	initCards:function(cards,isclear){
		// cc.log("initCards....",JSON.stringify(cards));
		if (isclear){
			this.getWidget("small"+1).removeAllChildren(true);
		}
		if(this._cards.length>0){//清理掉上一局的牌
			for(var i=0;i<this._cards.length;i++){
				this._cardPanel.removeChild(this._cards[i]);
			}
			this._cards.length=0;
		}
		if(this._cardPanelAni){//清理掉开局动画的牌
			this._cardPanelAni.removeAllChildren();
		}
		if(this._cards.length == 0){
			var winSize = cc.director.getWinSize();
			var centerX = (winSize.width - this._cardW)/2;
			var maxCard = PDKRoomModel.isWanfa15()?15:16;
			var isHongshi = PDKRoomModel.isHongShi();
			var offX = 60;
			if(cards.length > 1){
				offX =  (cards.length - 1) / maxCard ;//手牌位置稍微往右移动一点
			}else{
				offX = 0;
			}
			var pm = UITools.getLocalItem("sy_pdk_pm") || 3;
			if (pm == 2){
				this._cardW = 264;
				//this.btnBreak.y = this.Button_4.y = 327;
			}else if (pm == 3) {
				this._cardW = 300;
				//this.btnBreak.y = this.Button_4.y = 327;
			}else if (pm == 1) {
				this._cardW = 275;
				//this.btnBreak.y = this.Button_4.y = 350;
			}
			cc.log("this._cardW===",this._cardW,cc.winSize.width);
			this._cardG = (cc.winSize.width - this._cardW)/(maxCard - 1) - 5;
			var initX = (cc.winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2;
			//var initX = (1280 - cc.winSize.width)/2;
			//this.convertToNodeSpace()
			this._cardPanel.setContentSize(cc.winSize.width,this._cardPanel.height);

			for(var i=0;i<cards.length;i++){
				var card = new PDKBigCard(cards[i]);
				card.cardId = i;
				card.anchorX=card.anchorY=0;
				var realX = initX+i*this._cardG;
				card.x = realX;
				//card.x = centerX;
				card.y = -5;
				this._cardPanel.addChild(card);
				this._cards.push(card);
				card.varNode.visible = true;
				card.backNode.visible = false;
				if (isHongshi && cards[i].n == 10 && cards[i].t == 3){
					var sprite = new cc.Sprite("res/res_pdk/pdkRoom/img_xiabiao.png");
					sprite.x = 27;
					sprite.y = 27;
					card.addChild(sprite);
				}
			}
			//this._cardPanel.visible = true;
		}
	},
	onShowAndHide : function(sender){
		var tPuckObj = sender;
		tPuckObj.varNode.setVisible(true);
		tPuckObj.backNode.setVisible(false);
		tPuckObj.isAction = false;
	},

	createAction: function (realX, realY, i, length) {
		var self = this;
		var showSpeed = 0.25;
		var moveSpeed = 0.04;
		var beginPosx = realX;
		var beginPosY = realY;

		var actMoveto = cc.moveTo(0.1 + i * moveSpeed, cc.p(beginPosx, beginPosY));
		var actSqwar = cc.spawn(actMoveto);//actRotateBy

		var actopmPrbotCamera = cc.orbitCamera(showSpeed, 1, 0, 0, -90, 0, 0);
		var actPrbotCamera2 = cc.orbitCamera(showSpeed, 1, 0, 90, -90, 0, 0);
		var showAndHide = cc.callFunc(this.onShowAndHide, this);
		var removeCardAni = cc.callFunc(function(){
			if(self._cardPanelAni && i == length -1){//清理掉上一局的牌
				self._cardPanelAni.removeAllChildren();
				self._cardPanel.visible = true;
			}
		});

		//var rep = cc.sequence(actSqwar, actopmPrbotCamera, showAndHide, actPrbotCamera2,removeCardAni);
		var rep = cc.sequence(actSqwar, showAndHide,removeCardAni);
		return rep;
	},


	getPlayerSeq:function(userId,ownSeat,seat){
		if(userId == PlayerModel.userId)
			return 1;
		var seqArray = this.seatSeq[ownSeat];
		var seq = ArrayUtil.indexOf(seqArray,seat)+1;
		return seq;
	},

	/**
	 *
	 * @returns {Array.<CardVo>}
	 */
	getCardsOnHand:function(){
		var result = [];
		for(var i=0;i<this._cards.length;i++){
			result.push(this._cards[i].getData());
		}
		return result;
	},

	letOutCards:function(cardIds,seat,isOver){
		// cc.log("cardIds =",JSON.stringify(cardIds));
		// cc.log("isOver =",JSON.stringify(isOver));
		// cc.log("seat =",JSON.stringify(seat));
		if(!isOver){
			if(cardIds.length!=0 ) {
				var nextSeq = this.getPlayerSeq(-1,PDKRoomModel.mySeat,this.seatSeq[seat][1]);
				this.getWidget("small"+nextSeq).removeAllChildren(true);
			}
		}else{
			if(cardIds.length>0){
				var overSeq = this.getPlayerSeq(-1,PDKRoomModel.mySeat,seat);
				this.getWidget("small"+overSeq).removeAllChildren(true);
			}
		}
		if(cardIds.length==0)
			return;
		AudioManager.play("res/audio/common/audio_card_out.mp3");
		var seq = 1;
		if(seat == PDKRoomModel.mySeat){//自己出牌
			var cards = this._cards;
			for(var n=0;n<cardIds.length;n++){
				for(var i=0;i<cards.length;i++){
					var card = cards[i];
					if(card.getData().c == cardIds[n]){
						this._cardPanel.removeChild(card);
						this._cards.splice(i,1);
						break;
					}
				}
			}
			var winSize = cc.director.getWinSize();
			var length = this._cards.length;
			var maxCard = PDKRoomModel.isWanfa15()?15:16;
			var offX = 60;
			if(cards.length > 1){
				offX = 60 * (cards.length - 1)/maxCard ;//手牌位置稍微往右移动一点
			}else{
				offX = 0;
			}

			var pm = UITools.getLocalItem("sy_pdk_pm") || 3;
			if (pm == 2){
				this._cardW = 264;
				//this.btnBreak.y = this.Button_4.y = 327;
			}else if (pm == 3) {
				this._cardW = 300;
				//this.btnBreak.y = this.Button_4.y = 327;
			}else if (pm == 1) {
				this._cardW = 275;
				//this.btnBreak.y = this.Button_4.y = 350;
			}

			var initX = (winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2;
			for(var i=0;i<length;i++){
				this._cards[i].x = initX+i*this._cardG;
				this._cards[i].cardId = i;
			}
		}else{
			seq = this.getPlayerSeq(-1,PDKRoomModel.mySeat,seat);

			var playerVo=PDKRoomModel.getPlayerVoBySeat(seat);
			if(playerVo!=null){
				if(!isOver){
					playerVo.ext[1]-=cardIds.length;
				}
				if(this._players[seat]){
					this._players[seat].showLastCard();
				}
			}

		}
		var copyCardIds = ArrayUtil.clone(cardIds);
		var offX = 55;
		var smallCardScale = 0.65;
		length = copyCardIds.length;
		var smallW = this._cardW * smallCardScale;
		if(seq == 1){
			initX = (800 - (smallW+offX*(length-1)))/2;
		}else if(seq == 2) {
			initX = (800-smallW);
			copyCardIds.reverse();
		}else{
			initX = 0;
		}
		this.getWidget("small"+seq).removeAllChildren(true);
		for(var i=0;i<length;i++){
			var smallCard = new SmallCard(PDKAI.getCardDef(copyCardIds[i]) , 2);
			smallCard.anchorX=smallCard.anchorY=0;
			smallCard.scale = smallCardScale;
			if(seq == 2){
				smallCard.x = initX - i*offX;
				smallCard.setLocalZOrder(length-i);
			}else{
				smallCard.x = initX + i*offX;
			}
			smallCard.y = 0;
			this.getWidget("small"+seq).addChild(smallCard);
		}
	},

	/**
	 * 发送出牌消息
	 * @param type
	 * @param allCards
	 */
	sendPlayCardMsg:function(type,allCards){
		var build = MsgHandler.getBuilder("proto/PlayCardReqMsg.txt");
		var msgType = build.msgType;
		var builder = build.builder;
		var PlayCardReq = builder.build("PlayCardReq");
		var cardIds = [];
		for(var i=0;i<allCards.length;i++){
			cardIds.push(allCards[i].c);
		}
		var msg = new PlayCardReq();
		msg.cardIds = cardIds;
		msg.cardType = type;
		sySocket.send(msg,msgType);
		//if (this.getCardsOnHand() && this.getCardsOnHand().length == 1){
		//	msg.isBt = 1;
		//}
		//PDKRoomModel.simulateLetOutCard(msg);
	},

	/**
	 * 是否有炸弹被拆散
	 * @returns {boolean}
	 */
	isBombBreak:function(){
		if(this._cCardPattern.type == PDKAI.BOMB)
			return false;
		var cardsOnHand = this.getCardsOnHand();
		var temp = {};
		var bombi = [];
		for(var i=0;i<cardsOnHand.length;i++){
			var card = cardsOnHand[i];
			if(temp[card.i]){
				temp[card.i] += 1;
			}else{
				temp[card.i] = 1;
			}
			if(temp[card.i]==4 || (temp[card.i]==3 && PDKRoomModel.intParams[30] == 1 && card.i == 14))
				bombi.push(card.i);
		}
		var isHas = false;
		for(var i=0;i<this._allCards.length;i++){
			var card = this._allCards[i];
			if(ArrayUtil.indexOf(bombi,card.i) >= 0){
				isHas = true;
				break;
			}
		}
		return isHas;
	},

	isHasHei3Frist:function() {
		var isCanOut = true;
		var allCards = this._cards ? this._cards.length : 0;
		//cc.log("****************1")
		if (PDKRoomModel.isHei3Frist() && PDKRoomModel.nowBurCount == 1 && (PDKRoomModel.isWanfa15() && allCards == 15 || !PDKRoomModel.isWanfa15() && allCards == 16)) {
			var isHasHei3 = false;
			//cc.log("****************2")
			for (var i = 0; i < this._cards.length; i++) {
				var card = this._cards[i];
				if (card && card._cardVo && card._cardVo.c == 403){
					//cc.log("****************3")
					isHasHei3 = true;
				}
			}
			if (isHasHei3){
				//cc.log("****************4")
				isCanOut = false;
				for (var i = 0; i < this._allCards.length; i++) {
					var card = this._allCards[i];
					if (403 == card.c){
						//cc.log("****************5")
						isCanOut = true;
						break;
					}
				}
			}else{
				isCanOut = true;
			}
		}
		return isCanOut;
	},

	//11张玩法首局必出黑桃6
	isHasHei6Frist:function() {
		var isCanOut = true;
		var allCards = this._cards ? this._cards.length : 0;
		//cc.log("****************1")
		if (PDKRoomModel.isHei3Frist() && PDKRoomModel.nowBurCount == 1 && allCards == 11) {
			var isHasHei6 = false;
			//cc.log("****************2")
			for (var i = 0; i < this._cards.length; i++) {
				var card = this._cards[i];
				if (card && card._cardVo && card._cardVo.c == 406){
					//cc.log("****************3")
					isHasHei6 = true;
				}
			}
			if (isHasHei6){
				//cc.log("****************4")
				isCanOut = false;
				for (var i = 0; i < this._allCards.length; i++) {
					var card = this._allCards[i];
					if (406 == card.c){
						//cc.log("****************5")
						isCanOut = true;
						break;
					}
				}
			}else{
				isCanOut = true;
			}
		}
		return isCanOut;
	},

	checkCardIsOnHand:function(){
		var handcards = this.getCardsOnHand();
		var cardIsOnHand = false;
		if(this._allCards.length > 0){
			for (var i = 0; i < this._allCards.length; i++) {
				cardIsOnHand = false;
				for (var j = 0; j < handcards.length; j++) {
					if(this._allCards[i].c == handcards[j].c){
						cardIsOnHand = true;
					}
				}
			}
		}
		return cardIsOnHand;
	},

	/**
	 * 出牌动作
	 */
	onPlayCard:function(obj,bombBreak){
		// cc.log("this._cCardPattern.type =",JSON.stringify(this._cCardPattern.type));
		// cc.log("this._allCards =",JSON.stringify(this._allCards));
		var self = this;
		if (!this.isHasHei3Frist() && !this.isSamallOver){
			FloatLabelUtil.comText("开房第一局出的牌必须包含黑桃三");
			return;
		}
		if(PDKRoomModel.wanfa == 11){
			if (!this.isHasHei6Frist()){
				FloatLabelUtil.comText("开房第一局出的牌必须包含黑桃六");
				return;
			}
		}

		var cardIsOnHand = this.checkCardIsOnHand();
		//如果手中没有出的牌 重新选牌
		if(!cardIsOnHand){
			// this.smartLetOut();
			this._allCards = [];
			for(var i = 0;i<this._cards.length;i++){
				if(this._cards[i]._selected){
					this._allCards.push(this._cards[i]._cardVo);
				}
			}
		}
		if(this._cCardPattern){
			if(!bombBreak && this.isBombBreak()){
				AlertPop.show("炸弹被拆散，确定出牌吗？",function(){self.onPlayCard(obj,true);});
				return;
			}
			this.sendPlayCardMsg(this._cCardPattern.type,this._allCards);
		}else{//有可能提前选择了牌，再次筛选一次
			if(this._allCards.length>0){
				this._cCardPattern = PDKAI.filterCards(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
				if(GameTypeEunmPK.ZZPDK == PDKRoomModel.wanfa)
					this._cCardPattern = PDKAI.filterCardsForZZPDK(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
				if(this._cCardPattern){
					if(!bombBreak && this.isBombBreak()){
						AlertPop.show("炸弹被拆散，确定出牌吗？",function(){self.onPlayCard(obj,true);});
						return;
					}
					this.sendPlayCardMsg(this._cCardPattern.type,this._allCards);
				}
			}
		}


		//前端模拟出牌
		this.OutCardsSelf()
	},

	_sortByBiger:function(card1,card2){
		return card2.i-card1.i;
	},

	OutCardsSelf:function(){
		// cc.log("this._cCardPattern =",JSON.stringify(this._cCardPattern));
		var cardIds = [];
		if (this._cCardPattern.type == PDKAI.THREE || this._cCardPattern.type == PDKAI.PLANE || this._cCardPattern.type == PDKAI.BOMBWITHCARD){
			for(var i=0;i<this._cCardPattern.sortedCards.length;i++){
				cardIds.push(this._cCardPattern.sortedCards[i].c);
			}
		}else{
			var tempArr = ArrayUtil.clone(this._allCards)
			// cc.log("tempArr =",JSON.stringify(tempArr));
			tempArr.sort(this._sortByBiger);
			for(var i=0;i<tempArr.length;i++){
				cardIds.push(tempArr[i].c);
			}
		}
		this.btnBreak.visible = this.Button_4.visible = false;
		this.letOutCards(cardIds,PDKRoomModel.mySeat);
		var nextSeat = this.seatSeq[PDKRoomModel.mySeat][1];
		this.showJianTou(nextSeat);
		//PDKRoomSound.letOutSound(PlayerModel.userId,this._cCardPattern);
		PDKRoomEffects.play(this.root,this._cCardPattern);
	},

	smartLetOut:function(){
		var result = [];
		var allCards = [];
		//下家报停，单张的情况
		if(PDKRoomModel.isNextSeatBt() && this._lastCardPattern && this._lastCardPattern.type==PDKAI.SINGLE){
			var resultbt = PDKAI.autoFilter(this.getCardsOnHand(), this._lastCardPattern,2);
			if(resultbt.length==1){
				result.push(0);
			}else if(resultbt.length>1){
				result = resultbt;
			}
		}else {
			if(!this._lastCardPattern || this._lastCardPattern.type!=PDKAI.THREE) {
				result = PDKAI.autoFilter(this.getCardsOnHand(), this._lastCardPattern,2);
				if (result.length > 0) {
					for (var i = 0; i < result.length; i++) {
						allCards.push(this._cards[result[i]].getData());
					}
					var selectedCards = ArrayUtil.clone(allCards);
					this._cCardPattern = PDKAI.filterCards(selectedCards, this.getCardsOnHand(), this._lastCardPattern);
					if(PDKRoomModel.wanfa == GameTypeEunmPK.ZZPDK)
						this._cCardPattern = PDKAI.filterCardsForZZPDK(selectedCards, this.getCardsOnHand(), this._lastCardPattern);
					if(this._cCardPattern){
						if(this._cCardPattern.maxCount>=4&&this._cCardPattern.type!=PDKAI.BOMB){//防止3个带最后把炸弹带出去了
							result.length = 0;
						}else{
							PDKRoomModel.prompt(this._cCardPattern);
							var resultNext = PDKAI.autoFilter(this.getCardsOnHand(), this._lastCardPattern,2);
							//只有唯一可以出的牌
							if (resultNext.length > 0)
								result.length = 0;
							else{
								//cc.log("只有唯一可以出的牌");
							}
						}
					}else{
						result.length = 0;
					}
				}
			}
		}

		if(result.length>0){
			this.unSelectAllCards();
			allCards.length=0;
			for (var i = 0; i < this._cards.length; i++) {
				var card = this._cards[i];
				if (ArrayUtil.indexOf(result, i) >= 0) {
					card.selectAction();
					allCards.push(card.getData());
				} else {
					card.disableAction();
				}
			}
			this._allCards = allCards;
		}
		if(this._allCards.length==0){
			for (var i = 0; i < this._cards.length; i++) {
				var card = this._cards[i];
				if(card.isSelected())
					this._allCards.push(card.getData());
			}
		}
		this.isCanLetOut();
		PDKRoomModel.prompt(null);
	},

	/**
	 * 提示动作
	 */
	onPlayTip:function(){
		var result = PDKAI.autoFilter(this.getCardsOnHand(),this._lastCardPattern,1);
		if(PDKRoomModel.isNextSeatBt() && this._lastCardPattern && this._lastCardPattern.type==PDKAI.SINGLE){
			result = PDKAI.autoFilter(this.getCardsOnHand(),this._lastCardPattern,2);
		}

		//没下个牌的提醒了，或者已经提示到了炸弹，停止往下搜索
		if(PDKRoomModel.promptCardPattern && (result.length==0 || PDKRoomModel.promptCardPattern.type == PDKAI.BOMB)){
			PDKRoomModel.prompt(null);
			this.onPlayTip();
			return;
		}
		//先把现在选中的牌取消
		this.unSelectAllCards();
		var allCards = [];
		for(var i=0;i<result.length;i++){
			var card = this._cards[result[i]];
			card.selectAction();
			if(card.isSelected())
				allCards.push(card.getData());
		}
		this._allCards = allCards;
		this._cCardPattern = PDKAI.filterCards(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
		if(GameTypeEunmPK.ZZPDK == PDKRoomModel.wanfa)
			this._cCardPattern = PDKAI.filterCardsForZZPDK(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
		PDKRoomModel.prompt(this._cCardPattern);
		this.isCanLetOut();
	},

	/**
	 * 邀请
	 */
	onInvite:function(){

		var playerNum = " "+ PDKRoomModel.renshu + "缺" + (PDKRoomModel.renshu - PDKRoomModel.players.length);
		var obj={};
		obj.tableId=PDKRoomModel.tableId;
		obj.userName=PlayerModel.username;
		obj.callURL=SdkUtil.SHARE_ROOM_URL+'?num='+PDKRoomModel.tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
		obj.title='跑得快   房号：'+ PDKRoomModel.tableId + playerNum;
		var cardNum = "";
		if(PDKRoomModel.isShowCardNumber()){
			cardNum = ",显示剩余牌数";
		}
		var heitao = PDKRoomModel.intParams[6];
		var heiStr = "";
		if(heitao == 1 && PDKRoomModel.renshu == 3){
			heiStr = ",首局必出黑桃三";
			if(PDKRoomModel.wanfa == 11){
				heiStr = ",首局必出黑桃六";
			}
		}

		var zhangDesc = "16张";
		if(PDKRoomModel.wanfa == 15){
			zhangDesc = "15张"
		}
		if(PDKRoomModel.wanfa == 11){
			zhangDesc = "11张"
		}

		var clubStr = "";
		if (PDKRoomModel.isClubRoom(PDKRoomModel.tableType)){
			clubStr = "[亲友圈]";
		}
		var hongshiStr = PDKRoomModel.getHongShiName();
		obj.description= clubStr + csvhelper.strFormat("{0}人,{1},{2}局{3}{4},{5}。",PDKRoomModel.renshu,zhangDesc,PDKRoomModel.totalBurCount,cardNum,heiStr,hongshiStr);
		obj.shareType=1;
		ShareDTPop.show(obj);
	},

	/**
	 * 有人加入房间
	 * @param event
	 */
	onJoin:function(event){
		var p = event.getUserData();
		// cc.log("p.seat , p.userId" , p.seat , p.userId);
		var seq = this.getPlayerSeq(p.userId,PDKRoomModel.mySeat, p.seat);
		this._players[p.seat] = new PDKCardPlayer(p,this.root,seq);
		this.setInviteBtnState();
		var seats = PDKRoomModel.isIpSame();
		if(seats.length>1 && PDKRoomModel.renshu != 2){
			for(var i=0;i<seats.length;i++) {
				this._players[seats[i]].isIpSame(true);
			}
		}
	},

	onExitRoom:function(event){
		var p = event.getUserData();
		this._players[p.seat].exitRoom();
		delete this._players[p.seat];
		var seats = PDKRoomModel.isIpSame();
		this.setInviteBtnState();
		for (var key in this._players) {
			if (ArrayUtil.indexOf(seats, key) < 0) {
				this._players[key].isIpSame(false);
			}
		}
	},


	/**
	 * 牌局开始
	 * @param event
	 */
	startGame:function(event){
		var xiPaiBtnNode = this.getChildByName("xiPaiBtnNode");
		if(xiPaiBtnNode){
			xiPaiBtnNode.removeFromParent(true);
			xiPaiBtnNode = null;
		}
		this.cleanCardsData();
		this.isStart = true;
		this.isDaNiao = this.isPiaoFen = false;
		//this.Image_qiepai.visible = (PDKRoomModel.renshu==2);
		var p = event.getUserData();
		this._players[PDKRoomModel.mySeat].deal(p.handCardIds);
		this._countDown = PDKRoomModel.getTuoguanTime();
		// cc.log("p.handCardIds =",JSON.stringify(p.handCardIds));
		this.showJianTou();
		this._lastCardPattern = null;
		this._lastLetOutSeat = 0;
		
		this.btnBreak.visible = this.Button_4.visible = (PDKRoomModel.nextSeat == PDKRoomModel.mySeat);
		this.Button_17.visible = this.Button_30.visible = this.Image_baodan.visible = this.Button_tuichu.visible= false;
		this.initCards(p.handCardIds);

		for(var i=1;i<=3;i++){
			if(i>1)
				this.getWidget("bt"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			if(this._players[i]!=null){
				this._players[i].showLastCard();
			}
			this.getWidget("small"+i).removeAllChildren(true);
		}
		this.showDaNiaoState(0);
		this.showWaitSelectPiao(false);
	},

	showXiPaiBtn:function () {
		this.showWaitSelectPiao(false);

		var daNiaoNode = this.getChildByName("daNiaoNode");
		if(daNiaoNode){
			daNiaoNode.removeFromParent(true);
			daNiaoNode = null;
		}
        this.Button_tuichu.visible = false;
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

	showXiPaiWaitString:function () {
        this.Button_tuichu.visible = false;
		var daNiaoNode = this.getChildByName("daNiaoNode");
		if(daNiaoNode){
			daNiaoNode.removeFromParent(true);
			daNiaoNode = null;
		}
		
		var xiPaiBtnNode = this.getChildByName("xiPaiBtnNode");
        if (xiPaiBtnNode) {
			xiPaiBtnNode.removeAllChildren();
			var tipLabel = new cc.LabelTTF("等待其他玩家选择洗牌","Arial",54);
			tipLabel.setPosition(0,-100);
			tipLabel.setColor(cc.color.BLUE);
			xiPaiBtnNode.addChild((tipLabel));	
        }else{
			xiPaiBtnNode = new cc.Node();
			xiPaiBtnNode.setName("xiPaiBtnNode");
			xiPaiBtnNode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 20);
			this.addChild(xiPaiBtnNode, 100);

			var tipLabel = new cc.LabelTTF("等待其他玩家选择洗牌","Arial",54);
			tipLabel.setPosition(0,-100);
			tipLabel.setColor(cc.color.BLUE);
			xiPaiBtnNode.addChild((tipLabel));	
		}

        
		
	},
    onClickXiPaiBtn: function (sender) {
        sySocket.sendComReqMsg(4505, [sender.flag]);
    },
    FiNiShXiPai:function (event) {
        var message = event.getUserData();
		var userId = message.params[0];
		var p = PDKRoomModel.getPlayerVo(userId)
        if (p.seat == PDKRoomModel.mySeat) {
            this.showXiPaiWaitString();
        }

    },

	NeedXipai:function(){
		this.Image_40.visible = false;
		this.Image_baodan.visible = false;
		for (var i = 1; i <= 3; i++) {
			this.getWidget("ybq" + i).visible = false;
			this.getWidget("small" + i).removeAllChildren(true);
			if (i > 1)
				this.getWidget("bt" + i).visible = false;
			this.getWidget("small"+i).visible = false;
		}
		this._cardPanel.visible = false;
		this.btnBreak.visible = this.Button_4.visible = false;
		this.btnBreak.setOpacity(0);
		this.Button_4.setOpacity(0);
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
	xipaiAni:function () {
		var xiPaiBtnNode = this.getChildByName("xiPaiBtnNode");
		if(xiPaiBtnNode){
			xiPaiBtnNode.removeFromParent(true);
			xiPaiBtnNode = null;
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
			var back_card = new cc.Sprite("res/res_pdk/pdkRoom/action_card.png");
			back_card.scale = 0.6;
			back_card.setPosition(-300,0);
			this.actionnode.addChild(back_card);
			back_card.setLocalZOrder(-index);

			var action = this.xipaiAction(index,1)
			back_card.runAction(action);
		}

		for (var j = 0; j < 11; j++) {
			var back_card2 = new cc.Sprite("res/res_pdk/pdkRoom/action_card.png");
			back_card2.scale = 0.6;
			back_card2.setPosition(300,0);
			this.actionnode.addChild(back_card2);
			back_card2.setLocalZOrder(-j);

			var action = this.xipaiAction(j,2)
			back_card2.runAction(action);
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
		for (var i = 1; i <= PDKRoomModel.renshu; i++) {
			this.getWidget("small" + i).visible = true;
		}
		this._cardPanel.visible = true;
		this.btnBreak.setOpacity(255);
		this.Button_4.setOpacity(255);
		if(BaseXiPaiModel.isNeedXiPai){
			PlayPDKMessageSeq.playNextMessage();
		}
		BaseXiPaiModel.isNeedXiPai = false;
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
				if (index == 10 && type == 2){
					self.actionnode.removeAllChildren();  
					PopupManager.removeClassByPopup(PDKSmallResultPop);
					self.clearXiPai();
                }
            })
        );
        return action;
	},
	/**
	 * 闹钟上面的箭头
	 * @param seat
	 */
	showJianTou:function(seat){
		this.Image_40.visible = true;
		seat = seat || PDKRoomModel.nextSeat;
		for(var i=1;i<=3;i++){
			this.getWidget("tip"+i).visible = false;
		}
		this.getWidget("tip"+this.getPlayerSeq("",PDKRoomModel.mySeat,seat)).visible = true;
		this.showTouguanTime(this._countDown, seat);
	},

	showTouguanTime: function (_time, seat){
		var coords = null;
		if (PDKRoomModel.renshu == 3) {
			coords = { 1: { x: 220 + (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2, y: 650 }, 2: { x: 1600 + (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2, y: 850 }, 3: { x: 350 + (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2, y: 850 } };
		} else {
			coords = { 1: { x: 220 + (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2, y: 650 }, 2: { x: 1600 + (SyConfig.DESIGN_WIDTH - cc.winSize.width) / 2, y: 850 } };
		}
		var direct = this.getPlayerSeq("", PDKRoomModel.mySeat, seat);
		cc.log("direct =", direct);
		var coord = coords[direct];
		this.Image_40.x = coord.x;
		this.Image_40.y = coord.y;


		var countDown = (_time<10) ? "0"+_time : ""+_time;
		this.countDownLabel.setString(countDown);
	},


	onShow:function(){
		this._dt = 0;
		this._timedt = 0;
		this.calcTime();
		this.scheduleUpdate();
	},

	onHide:function(){
		this.unscheduleUpdate();
	},

	calcTime:function(){
		var date = new Date();
		var hours = date.getHours().toString();
		hours = hours.length < 2 ? "0"+hours : hours;
		var minutes = date.getMinutes().toString();
		minutes = minutes.length < 2 ? "0"+minutes : minutes;
		var time = hours+":"+minutes;
		if(this.labelTime){
			this.labelTime.setString(time);
		}
	},

	getNetTypePNG:function(type){
		return "res_pdk/pdkRoom/net_"+type+".png";
	},

	update:function(dt){
		this._dt += dt;
		PlayPDKMessageSeq.updateDT(dt);
		this._loacationDt += dt;

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
				var countDown = (this._countDown<10) ? "0"+this._countDown : ""+this._countDown
				this.countDownLabel.setString(countDown);
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
	}

});