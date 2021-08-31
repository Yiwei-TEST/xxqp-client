var MainScene = cc.Scene.extend({
	loadingPlaying:null,
	_loading:null,
	_dt:null,
	_gpsDt:null,
	_loadingTime:0,
	_msgdt:0,
	_msgDdiff:60,
	_msgData:null,
	msgPlaying:false,
	ctor:function(){
		this._super();

		//窄屏适配修改，在出新安装包之前，在这里修改下frameSize
		var frameSize = cc.view.getFrameSize();
		if(frameSize.width/frameSize.height < SyConfig.DESIGN_WIDTH/SyConfig.DESIGN_HEIGHT){
			var displayMode = cc.ResolutionPolicy.SHOW_ALL;
			cc.view.setDesignResolutionSize(SyConfig.DESIGN_WIDTH, SyConfig.DESIGN_HEIGHT, displayMode);
		}
	},
	onEnter:function(){
		this._super();
		WXHeadIconManager.clean();
		GameData.isHide = false;
		GameData.isShow = false;
		ServerUtil.initDefaultUrlConf();
		//审核
		if(SyConfig.isIos() && SdkUtil.isReview()){
			var url = SyConfig.LOGIN_URL;
			var reqUrl = SyConfig.REQ_URL;
			if(url.search(/dtz.login.52nmw.cn/) >= 0){
				SyConfig.LOGIN_URL = url.replace(/dtz.login.52nmw.cn/, "dtztest.login.52nmw.cn");
				SyConfig.REQ_URL = reqUrl.replace(/dtz.login.52nmw.cn/, "dtztest.login.52nmw.cn");
			}
			cc.log("LOGIN_URL::"+SyConfig.LOGIN_URL);
		}

		this._dt = 0;
		this._gpsDt = 0;
		this._msgdt = this._msgDdiff;
		sy.scene = this;
		this.loadingPlaying = false;
		this.msgPlaying = false;
		MsgHandler.init();
		var mainlayer = this.mainlayer = new cc.Layer();
		this.addChild(mainlayer);

		var customlayer = this.customlayer = new cc.Layer();
		this.addChild(customlayer);

		//updatelayer.visible = false;

		
		var popuplayer = this.popuplayer = new cc.Layer();
		this.addChild(popuplayer);
		var floatlayer = this.floatlayer = new cc.Layer();
		this.addChild(floatlayer);
		var toplayer = this.toplayer = new cc.Layer();
		this.addChild(toplayer);

		var updatelayer = this.updatelayer = new HallUpdateBaseLayer();
		this.addChild(updatelayer);
		this.updatelayer.onHide();

		sy.socketQueue =  new WebSocketQueue();

		var checkJoinLayer = new CheckJoinRoomLayer();
		this.addChild(checkJoinLayer);

		LayerManager.init(this.mainlayer);
		PopupManager.init(this.popuplayer);
		cc.spriteFrameCache.addSpriteFrames(res.poker_plist);
		cc.spriteFrameCache.addSpriteFrames(res.PDKpoker_plist);
		cc.spriteFrameCache.addSpriteFrames(res.pdk_bigcards_plist);
		cc.spriteFrameCache.addSpriteFrames(res.pdk_midcards_plist);
		cc.spriteFrameCache.addSpriteFrames(res.pdk_smallcards_plist);
		cc.spriteFrameCache.addSpriteFrames(res.ddz_poker_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_zi_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_ln_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_ln_zi_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_oldzi_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_thjzi_plist);
		cc.spriteFrameCache.addSpriteFrames(res.phz_cards_plist);
		// cc.spriteFrameCache.addSpriteFrames(res.xpphz_cards_plist);
		// cc.spriteFrameCache.addSpriteFrames(res.ahphz_cards_plist);
		// cc.spriteFrameCache.addSpriteFrames(res.majiang_oldbg_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_thjbg_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_yellowbg_plist);
		// cc.spriteFrameCache.addSpriteFrames(res.qf_bcard_plist);
		// cc.spriteFrameCache.addSpriteFrames(res.qf_scard_plist);
		//长沙麻将新资源
		cc.spriteFrameCache.addSpriteFrames(res.majiang_xygbg_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_xygzi_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_zi1_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_zi2_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_bg1_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_bg2_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_bg4_plist);
		cc.spriteFrameCache.addSpriteFrames(res.majiang_bg5_plist);



		//cc.spriteFrameCache.addSpriteFrames(res.majiang_plist);
			//cc.spriteFrameCache.addSpriteFrames(res.emoji_plist);
			LayerManager.showLayer(LayerFactory.LOGIN);
		//});
		var self=this;
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyReleased: function(keyCode, event) {
				if (keyCode == 6) {
					SyEventManager.dispatchEvent(SyEvent.REMOVE_POP_ALL);
					AlertPop.show("确定要退出游戏吗？",function(){
						self.exitGame();
					})
				}
			}}, this);
		//进入后台
		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
			GameData.isShow = false;
			if(SdkUtil.isReview()){
				if(LayerManager.isInRoom() && !GameData.isHide){
					sy.socketQueue.stopDeal();
					sySocket.redisconnect();
					GameData.isHide = true;
				}
			}else{
				if(!GameData.isHide){
					sy.socketQueue.stopDeal();
					sySocket.redisconnect();
					GameData.isHide = true;
				}
			}
			cc.director.pause();
		});
		//恢复显示
		cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
			cc.director.resume();
			GameData.isHide = false;
			if(PlayerModel.userId>0 && LayerManager.getCurrentLayer()!=LayerFactory.LOGIN){
				var showLogic = true;
				if (SdkUtil.isReview()) {
					showLogic = (LayerManager.isInRoom() || !sySocket.isOpen());
				}
				if (showLogic) {
					if(!GameData.isShow){
						sySocket.connect(null,12);
						GameData.isShow = true;
					}
				}
			}
			sy.scene.hideLoading();
		});

		//var message = {"closingPlayers":[{"userId":"1621887","name":"vkwuv9338729","leftCardNum":16,"point":0,"totalPoint":0,"boom":0,"winCount":1,"lostCount":0,"maxPoint":0,"totalBoom":0,"cards":[415,313,412,411,410,210,110,109,108,407,306,106,304,104,303,203],"seat":2,"sex":1,"icon":"","isHu":null,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[]},{"userId":"1621497","name":"jin","leftCardNum":16,"point":0,"totalPoint":0,"boom":0,"winCount":0,"lostCount":1,"maxPoint":0,"totalBoom":0,"cards":[214,413,213,113,312,112,311,310,409,209,408,207,406,405,404,403],"seat":1,"sex":1,"icon":"http://wx.qlogo.cn/mmopen/tbIqPFMDiclGcgPH4wO0Hia6mbYGW2d77pgK9Il9iaojsbUqn1gpMCmQtZyewMuaGQDzyr6klMk3AnU3AAiadc43JW75R1tRQCcv/132","isHu":null,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[]}],"bird":[],"birdSeat":[],"isBreak":1,"wanfa":1,"ext":["400564","1621497","2017-03-16 11:09:09","16"]};
		//var responder = new ClosingPhzInfoResponder();
		//responder.respond(message);
		//PopupManager.addPopup(new MJSmallResultPop(message.closingPlayers));
		this.headerIconSprite = new cc.Sprite("res/ui/common/default_m_big.png");
		this.headerIconSprite.anchorX=this.headerIconSprite.anchorY=this.headerIconSprite.x=this.headerIconSprite.y=0;
		this.floatlayer.addChild(this.headerIconSprite);
		this.headerIconSprite.visible = false;
		
		this.paomadeng = new PaoMaDeng();
		this.paomadeng.anchorX=this.paomadeng.anchorY=0;
		this.customlayer.addChild(this.paomadeng,100);
		this.paomadeng.updatePosition(10,915);
		this.paomadeng.visible = false;
		
		SyEventManager.addEventListener(SyEvent.SOCKET_OPENED,this,this.onSocketOpen);
		SyEventManager.addEventListener(SyEvent.DIRECT_JOIN_ROOM,this,this.onDirectToRoom);
		SyEventManager.addEventListener("pyq_invite_get_msg",this,this.onGetInviteMsg);
		SyEventManager.addEventListener(SyEvent.UPFATE_SERVER_TIME,this,this.onUpdateServerTime);
		this.scheduleUpdate();
	},

	onUpdateServerTime:function(event){
		this.curServerTime = event.getUserData()*1000;
		this.schedule(this.updateServerTime,1,cc.REPEAT_FOREVER,0);
	},

	updateServerTime:function(){
		if(this.curServerTime){
			this.curServerTime+=1000;
		}
	},

	getCurServerTime:function(){
		return this.curServerTime;
	},

	onGetInviteMsg:function(event){
		var msg = event.getUserData();
		InviteMsgHandler.handleMsg(msg);
	},

	screenshotHeaderIcon:function(tex,userId,cb,target){
		if(tex){
			this.headerIconSprite.setTexture(tex);
			var self = this;
			setTimeout(function(){
				self.headerIconSprite.visible = true;
				var rt = new cc.RenderTexture(self.headerIconSprite.width, self.headerIconSprite.height);
				rt.begin();
				self.headerIconSprite.visit();
				rt.end();
				var file = WXHeadIconManager.getHeadImg(userId);
				rt.saveToFile(file, cc.IMAGE_FORMAT_JPEG, false);
				self.headerIconSprite.visible = false;
				if(cb && target){
					cb.call(target,WXHeadIconManager.SAVE_SUC);
				}
			},30);
		}else{
			if(cb && target){
				cb.call(target,WXHeadIconManager.SAVE_SUC);
			}
		}
	},

	onDirectToRoom:function(){
		SdkUtil.sdkLog("onDirectToRoom1::"+PlayerModel.urlSchemeRoomId);
		if(PlayerModel.urlSchemeRoomId<=0)
			return;
		if(PlayerModel.userId<=0){
			return FloatLabelUtil.comText("直接进入房间失败，请先登录！");
		}
		if(LayerManager.isInRoom()){
			return FloatLabelUtil.comText("您已有房间，无法加入好友房间");
		}
		sy.scene.showLoading("正在进入房间");
		SdkUtil.sdkLog("onDirectToRoom2::"+PlayerModel.urlSchemeRoomId);
		Network.loginReq("qipai","getServerById",{tableId:PlayerModel.urlSchemeRoomId},function(data){
			var url = data.server.connectHost;
			sySocket.url = url;
			sySocket.connect();
		},function(){
			sySocket.url = PlayerModel.connectHost;
			sySocket.connect();
		})
	},

	onSocketOpen:function(event){
		var data = event.getUserData();
		if(data.roomId==0)
			sy.scene.hideLoading();
		if(data.urlscheme=="fromUrlScheme"&&PlayerModel.isDirect2Room()){//直接进房间
			sySocket.sendComReqMsg(2,[parseInt(PlayerModel.urlSchemeRoomId)]);
			PlayerModel.urlSchemeRoomId = 0;
		}
		if(PlayerModel.gps==null){
			GPSSdkUtil.startLocation();
		}
		if(ActivityModel.isNeedSendMsg()){
			if(!ActivityModel.isBrokeShare && !ActivityModel.isHomeLayerShare){
				ActivityModel.sendActivity([1],"5");
				ActivityModel.setIsSendShareMsg(false);
			}else if (ActivityModel.isHomeLayerShare){
				ActivityModel.setIsSendShareMsg(false);
				//通知服务器分享成功 更新任务进度
				sySocket.sendComReqMsg(1117,[5]);
				ActivityModel.isHomeLayerShare = false;
				Network.loginReq("qipai","share",{action:2},function(data){
	            	var pop = new AwardPop(BeansConfigModel.aloneConfig.share);
		            PopupManager.addPopup(pop);
		        })
			}else{
				ActivityModel.isBrokeShare = false;
				//sySocket.sendComReqMsg(1117,[1]);
			}
		}
		if(SignInModel.isDoubleAward || AwardModel.isSuperRiseAward||SignInModel.isNewDoubleAward||SignInModel.isChouJiangDouble||GoldResultModel.isNeedRiseAward||
			GoldenEggsModel.isGetPacketAgain||NewCarnivalModel.isDoubleTaskAward){
			sySocket.sendComReqMsg(4402)
		}

		if(SignInModel.isDoubleAward) {
			SignInModel.isDoubleAward = false;
			sySocket.sendComReqMsg(1115,[5,SignInModel.curDay+1]);
		}

		if (AwardModel.isSuperRiseAward){
			AwardModel.isSuperRiseAward = false;
			sySocket.sendComReqMsg(1117,[6]);/** 领取奖励通知 **/
		}

		if(SignInModel.isNewDoubleAward) {
			SignInModel.isNewDoubleAward = false;
			sySocket.sendComReqMsg(1117,[8]);/** 加倍领取 **/
		}

		if (GoldResultModel.isNeedRiseAward){
			GoldResultModel.isNeedRiseAward = false;
			GoldResultModel.roomid = Number(GoldResultModel.roomid);
			GoldResultModel.changeGold = Number(GoldResultModel.changeGold);
			sySocket.sendComReqMsg(139,[104,GoldResultModel.roomid,GoldResultModel.changeGold]);/** 小结算领取成功 **/
		}

		if(GoldenEggsModel.isGetPacketAgain){
			GoldenEggsModel.isGetPacketAgain = false;
			var pop = new GoldenEggsPop();
			PopupManager.addPopup(pop);
		}

		if(NewCarnivalModel.isDoubleTaskAward){
			NewCarnivalModel.isDoubleTaskAward = false
			sySocket.sendComReqMsg(1006, [2,12,parseInt(NewCarnivalModel.taskId)]);
		}
	},

	IsPlayByServerId:function(){
		var isPlay = false;
		if (this._msgData && this._msgData.srvno){
			var serverIdPrams = this._msgData.srvno.split(",");
			for(var i = 0;i<serverIdPrams.length;++i){
				if (PlayerModel.serverId == serverIdPrams[i]){
					isPlay = true;
					break;
				}
			}
		}
		return isPlay;
	},

	onUrgentMsgs:function(){
		var url = SdkUtil.COMMON_HTTP_URL + "/Agent/Marquee/index";
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("GET", url);
		xhr.timeout = 12000;
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

		var self = this;
		var onerror = function(){
			xhr.abort();
			//cc.log("==========getUpdateNotice========error=========");
		}
		xhr.onerror = onerror;
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if(xhr.status == 200){
					cc.log("===========getUpdateNotice============" + xhr.responseText);
					var data = JSON.parse(xhr.responseText);
					if(data.code == 0) {
						if (data.data) {
							//cc.log("onUrgentMsgs*************1");
							var dataContent = data.data;
							dataContent.sort(function (tid1, tid2) {
								return dataContent.tid > dataContent.tid;
							});
							var nowData = [];
							var curContent = dataContent[0];
							curContent.endtime = curContent.etime.replace(/-/g, '/');
							curContent.endtime = Date.parse(curContent.endtime);
							curContent.starttime = curContent.btime.replace(/-/g, '/');
							curContent.starttime = Date.parse(curContent.starttime);
							var now = new Date().getTime();
							if (now >= curContent.starttime && now <= curContent.endtime){
								curContent.id = curContent.tid;
								curContent.delay = curContent.diffsec / 1000;
								curContent.type = 3;
								self.msgPlaying = true;
								nowData.push(curContent);
								self._msgData = curContent;
								PaoMaDengModel.init(nowData);
								self.paomadeng.playing = false;
							}
							//cc.log("curContent==========", JSON.stringify(nowData));
						}
					}
				}else{
					onerror.call(self);
				}
			}
		}
		xhr.send();
	},

	exitGame:function(){
		if(SyConfig.isIos()){
			ios_sdk_exit();
		}else{
			SdkUtil.sdkExit();
			cc.director.end();
		}
	},

	update:function(dt){
		this._dt+=dt;
		this._gpsDt += dt;
		this._msgdt += dt;
		if(LayerManager.isInRoom()){
			GvoiceMessageSeq.updateDT(dt);
			IMSdkUtil.gotyePoll();
		}

		if(this._dt>=1){
			this._dt = 0;
			if(!PingClientModel.isSocketClose && PlayerModel.userId){//socket已经关闭，只检测是否有网络断开的弹框
				if(PingClientModel.isNeedReconect(LayerManager.isInRoom())){//错误次数太多，直接重连
					NetErrorPop.show(true);
				}else{
					if(PingClientModel.isNetBad()){//网络不好 给出提示
						PingClientModel.sendMsg(true);
					}else{
						if(PingClientModel.isNeedSendMsg()){
							PingClientModel.sendMsg();
						}
					}
				}
			}

			//cc.log("**********this.msgPlaying",this.msgPlaying)

			//跑马灯检测
			if(!this.paomadeng.playing){
				if(PaoMaDengModel.isHasMsg(LayerManager.isInRoom()) && this.IsPlayByServerId()){
					var curMsg = PaoMaDengModel.getCurrentMsg();
					if(!curMsg){
						this.msgPlaying = false;
						this.paomadeng.stop();
					}else{
						if(PaoMaDengModel.isHasImportMsg() || PaoMaDengModel.isHasUrgentMsg()){
							this.msgPlaying = true;
							this.paomadeng.play(curMsg);
						//}else{
						//	if((curMsg.type==1&&curMsg.delay>0&&PaoMaDengModel.intervalTime<curMsg.delay) || (curMsg.type==0&&LayerManager.isInRoom())
						//		|| LayerManager.isInReplay() ||(curMsg.type==2&&LayerManager.isInRoom()) ){
						//		this.paomadeng.stop();
						//	}else{
						//		if((curMsg.type==0&&!LayerManager.isInRoom()) || curMsg.type==1 || (curMsg.type==2&&!LayerManager.isInRoom()))
						//			this.paomadeng.play(curMsg);
						//	}
						//	PaoMaDengModel.intervalTime += 1;
						}
					}
				}else{
					this.msgPlaying = false;
					this.paomadeng.stop();
				}
			}

			if (this._loadingTime && this._loadingTime > 0){
				//cc.log("this._loadingTime======",this._loadingTime);
				this._loadingTime = this._loadingTime - 1;
				if (this._loadingTime <= 0){
					this.hideLoading();
				}
			}
		}

		if (this._msgdt >= this._msgDdiff){
			this._msgdt = 0;
			this.onUrgentMsgs();
		}

		sy.socketQueue.update(dt);
	},

	showFloatLabel:function(data){
		if(!this._floatLabel){
			this._floatLabel=  new FloatLabel(data);
			this.floatlayer.addChild(this._floatLabel);
		}
		this._floatLabel.pushAll(data);
	},
	
	showLoading:function(str){
		if(this.loadingPlaying)
			return;
		if (str == "正在登录"){
			this._loadingTime = 5;//暂时写成5
		}
		if(!this._loading){
			this._loading = new LoadingCircle(str);
			this.floatlayer.addChild(this._loading);
		}else{
			this._loading.show(str);
		}
	},

	hideLoading:function(){
		if(this._loading && !this.loadingPlaying)	this._loading.hide();
	},
});