/**
 * Created by hujincheng on 2016/7/29.
 * 回放游戏记录
 * @class
 * @extend {Room}
 */
var DTZReplay = BaseLayer.extend({
	_dt:null,
	_step:0,
	_cardPanel:null,
	_cardW:430,
	_bigCardW:140,
	_cardG:67,
	/**
	 * {Array.<DTZBigCard>}
	 */
	_players:null,
	_lastCardPattern:null,
	seatSeq:{},
	outCards:{},
	handCards:{},
	card1:[],
	card2:[],
	card3:[],
	card4:[],
	outCard1:[],
	outCard2:[],
	outCard3:[],
	outCard4:[],
	playBackState:false,
	cardMaxLength:22,
	_cardH:130 *0.55,


	ctor:function(json){
		this._players = {};
		this.playBackState = false;
		this._dt = 0;
		this._step = 0;
		this.card1 = [];
		this.card2 = [];
		this.card3 = [];
		this.card4 = [];
		this.outCard1 = [];
		this.outCard2 = [];
		this.outCard3 = [];
		this.outCard4 = [];
		this.seatSeq = PlayBackModel.seatSeq;
		cc.log("json===",json)
		this._super(json);
	},

	/**
	 * 初始化房间数据
	 */
	initData:function(){
		this.playBackState = false;
		this._step = 0;
		this.card1 = [];
		this.card2 = [];
		this.card3 = [];
		this.card4 = [];
		this.outCard1 = [];
		this.outCard2 = [];
		this.outCard3 = [];
		this.outCard4 = [];
		this.seatSeq = PlayBackModel.seatSeq;
		this.roomName_label.setString(PlayBackModel.roomName);
		//if(PlayBackModel.list.length!=2){
		//	this.img_qipai.visible = false
		//}
		for(var i=1;i<=4;i++){
			this.getWidget("player"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			this.getWidget("small"+i).removeAllChildren(true);
			this.getWidget("cardPanel"+i).removeAllChildren(true);
			//if(i>1)
			//	this.getWidget("bt"+i).visible = false;
		}
		this.updateCard(0,false);
		this.Label_27.setString(PlayBackModel.tableId);
		this.showTime();
		this.onStep();
		this.scheduleUpdate();
		this.Button_30.loadTextureNormal("res/ui/replay/playback3.png");
	},

	selfRender:function(){
		for(var i=1;i<=4;i++){
			//if(i>1)
			//	this.getWidget("bt"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			UITools.addClickEvent(this.getWidget("player"+i),this,this.onPlayerInfo);
		}
		this._step = 0;
		this.Button_4 = this.getWidget("Button_4");//后退
		this.Button_6 = this.getWidget("Button_6");//快进
		this.Button_30 = this.getWidget("Button_30");//暂停
		var cardPanel1 = this._cardPanel1 = ccui.helper.seekWidgetByName(this.root,"cardPanel1");
		var cardPanel2 = this._cardPanel2 = ccui.helper.seekWidgetByName(this.root,"cardPanel2");
		var cardPanel3 = this._cardPanel3 = ccui.helper.seekWidgetByName(this.root,"cardPanel3");
		var cardPanel4 = this._cardPanel4 = ccui.helper.seekWidgetByName(this.root,"cardPanel4");
		this.Panel_37 = this.getWidget("Panel_37");
		//this.Panel_15 = this.getWidget("Panel_15");
		//this.Label_38 = this.getWidget("Label_38");

		var Button_43 = ccui.helper.seekWidgetByName(this.root,"Button_43");
		Button_43.visible = false;
		this.Label_84 = this.getWidget("Label_84");
		this.battery = this.getWidget("battery");
		this.netType = this.getWidget("netType");
		this.Button_25 = this.getWidget("Button_25");
		//this.Label_27 = this.getWidget("Label_27");
		this.Label_39 = this.getWidget("Label_39");//时间
		//this.img_qipai = this.getWidget("Image_7");
		this.Label_27 = new cc.LabelBMFont("","res/font/font_res_huang1.fnt");
		this.Label_27.scale = 1.3;
		this.Label_27.x = this.Panel_37.width*0.25;
		this.Label_27.y = this.Panel_37.height*0.6;
		this.Panel_37.addChild(this.Label_27);
		UITools.addClickEvent(this.Button_25,this,this.onReturnHome);
		UITools.addClickEvent(this.Button_30,this,this.onPlayOrPause);
		UITools.addClickEvent(this.Button_4,this,this.onFallBack);
		UITools.addClickEvent(this.Button_6,this,this.onFastForward);

		this.roomName_label = new cc.LabelTTF(PlayBackModel.roomName,"Arial",39,cc.size(750, 45));
		this.addChild(this.roomName_label, 10);
		this.roomName_label.setString(PlayBackModel.roomName);
		this.roomName_label.setColor(cc.color(255,255,255));
		this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
		this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		this.roomName_label.x = cc.winSize.width/2;
		this.roomName_label.y = cc.winSize.height/2 + 105;

		var bg_btn = this.getWidget("Image_18");
		var label_hfm = UICtor.cLabel("回放码:" + BaseRoomModel.curHfm,36);
		label_hfm.setAnchorPoint(0.5,1);
		label_hfm.setPosition(bg_btn.width/2,bg_btn.height);
		bg_btn.addChild(label_hfm);
	},

	onPlayerInfo:function(obj){
		this._players[obj.temp].showInfo();
	},

	/**
	 * 解散
	 */
	onReturnHome:function(){
		var layer = LayerFactory.HOME;
		if(LayerManager.getCurrentLayer() != layer){
			this.onStop();
			LayerManager.showLayer(layer);
		}
		if(TotalRecordModel.isShowRecord){
			var mc = new TotalRecordPop(TotalRecordModel.data);
			PopupManager.addPopup(mc);
			TotalRecordModel.isShowRecord = false;
		}

		if(ClubRecallDetailModel.isShowRecord){
			var mc = null;
			if (ClubRecallDetailModel.renLength == 4){
				PopupManager.showPopup(ClubDtzRecallDetailPop);
			}else{
				PopupManager.showPopup(Club3DtzRecallDetailPop);
			}
			if ( mc ){
				PopupManager.open(mc,true);
				ClubRecallDetailModel.isShowRecord = false;
			}
		}
	},

	/**
	 * 播放或者暂停
	 */
	onPlayOrPause:function(){
		if(this._step != PlayBackModel.step){
			if(!this.playBackState){
				this.onStop();
				this.Button_30.loadTextureNormal("res/ui/replay/playback5.png");
				this.playBackState = !this.playBackState;
			}else{
				this.scheduleUpdate();
				this.Button_30.loadTextureNormal("res/ui/replay/playback3.png");
				this.playBackState = !this.playBackState;
			}
		}else{
			this.initData();
			this.Button_30.loadTextureNormal("res/ui/replay/playback3.png");
			this.playBackState = false;
		}
	},

	/**
	 * 后退
	 */
	onFallBack:function(){
		if(this._step == 0){
			FloatLabelUtil.comText("无法再后退！");
		}else{
			this.updateCard(this._step,true);
			this._step--;
			this.onStep();
			if(!this.playBackState){
				this.onStop();
				this.Button_30.loadTextureNormal("res/ui/replay/playback5.png");
				this.playBackState = !this.playBackState;
			}
		}
	},

	/**
	 * 快进
	 */
	onFastForward:function(){
		if(this._step == PlayBackModel.step){
			this.onStop();
			return FloatLabelUtil.comText("无法再快进！");
		}else{
			this._step++;
			this.onStep();
			this.updateCard(this._step,false);
			if(!this.playBackState){
				this.onStop();
				this.Button_30.loadTextureNormal("res/ui/replay/playback5.png");
				this.playBackState = !this.playBackState;
			}
			if(this._step == PlayBackModel.step){
				this.onChangeBtnStauts();
				return FloatLabelUtil.comText("记录结束！");
			}

		}
	},

	/**
	 * 播放完成改变按钮状态
	 * @param event
	 */
	onChangeBtnStauts:function(){
		if(this._step == PlayBackModel.step){
			this.onStop();
			this.Button_30.loadTextureNormal("res/ui/replay/playback5.png");
			this.playBackState = false;
		}
	},

	showTime:function(){
		this.Label_39.setString(PlayBackModel.time);
	},

	onStop:function(){
		this.unscheduleUpdate();
	},

	onStep:function(){
		this.Label_84.setString("进度："+this._step+"/"+PlayBackModel.step);
	},

	update:function(dt){
		this._dt += dt;
		if(this._dt>=2){
			this._dt = 0;
			if(PlayBackModel.step == 0){
				this.onChangeBtnStauts();
				isOver = true;
				FloatLabelUtil.comText("记录结束！");
				return;
			}
			this._step++;
			var isOver = false;
			if(this._step == PlayBackModel.step){
				this.onChangeBtnStauts();
				isOver = true;
				FloatLabelUtil.comText("记录结束！");
			}
			this.onStep();
			//刷新玩家牌
			this.updateCard(this._step,false);
		}
	},

	getPlayerSeq:function(userId,ownSeat,seat){
		if(userId == PlayerModel.userId)
			return 1;
		var seqArray = this.seatSeq[ownSeat];
		var seq = ArrayUtil.indexOf(seqArray,seat)+1;
		return seq;
	},

	updateCard:function(step,fal){
		PlayBackModel.setData(step,fal);
		var state = false;
		if(step == 0){
			for(var i=0;i<PlayBackModel.list.length;i++){
				var seq = this.getPlayerSeq(PlayBackModel.list[i].userId,PlayBackModel.mySeat, PlayBackModel.list[i].seat);
				this.initCard(PlayBackModel["cardData"+seq],PlayBackModel.list[i]);
			}
		}else{
			var seat = PlayBackModel.players[step+(PlayBackModel.list.length-1)].split("_")[0];
			var curSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,seat);
			for(var i=0;i<PlayBackModel.list.length;i++){
				if(PlayBackModel.list[i].seat == seat){
					this.updateHandCard(PlayBackModel["cardData"+curSeq],PlayBackModel.list[i],fal);
				}
			}
			this.updateOutCards(PlayBackModel["outCardData"+curSeq],seat,fal,state);//更新出过的牌
			if(step>1 && fal==true){
				state = true;
				var beforeSeat = PlayBackModel.players[step+(PlayBackModel.list.length-2)].split("_")[0];
				var beforeSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,beforeSeat);
				this.updateOutCards(PlayBackModel["outCardData"+beforeSeq],beforeSeat,fal,state);//更新上首出过的牌
				if (PlayBackModel.list.length == 4){
					if  (step > 2){

						var beforeSeat = PlayBackModel.players[step+(PlayBackModel.list.length-3)].split("_")[0];
						var beforeSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,beforeSeat);
						this.updateOutCards(PlayBackModel["outCardData"+beforeSeq],beforeSeat,fal,state,true);//更新上首出过的牌
						if  (step > 3){
							var nextSeat = PlayBackModel.players[step].split("_")[0];
							var nextSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,nextSeat);
							this.updateOutCards(PlayBackModel["outCardData"+nextSeq],nextSeat,fal,state,true);//更新下首出过的牌
						}
					}
				}else{
					if(step>2 && PlayBackModel.list.length>2){
						var nextSeat = PlayBackModel.players[step].split("_")[0];
						var nextSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,nextSeat);
						this.updateOutCards(PlayBackModel["outCardData"+nextSeq],nextSeat,fal,state,true);//更新下首出过的牌
					}
				}
			}
		}
		for (var i = 0; i < PlayBackModel.list.length; i++) {
			var seat = PlayBackModel.list[i].seat;
			var state = PlayBackModel.tgState[seat][step];
			this._players[seat].updateTuoguan(state);
		}
	},

	initCard:function(cards,list){
		var handcard = [];
		for(var key in cards){
			handcard.push(DTZAI.getCardDef(cards[key]));
		}
		var p = list;
		p.handCardIds = handcard;
		//p.handCardIds = [
		//	{"t":1,"n":1,"i":14,"c":101},{"t":1,"n":1,"i":14,"c":101},
		//	{"t":1,"n":1,"i":14,"c":101},{"t":1,"n":1,"i":14,"c":101},
		//	{"t":2,"n":1,"i":14,"c":201},{"t":2,"n":1,"i":14,"c":201},
		//	{"t":3,"n":1,"i":14,"c":301},{"t":3,"n":1,"i":14,"c":301},
		//	{"t":3,"n":1,"i":14,"c":301},{"t":4,"n":1,"i":14,"c":401},
		//	{"t":4,"n":1,"i":14,"c":401},{"t":2,"n":1,"i":14,"c":201},
		//	{"t":4,"n":1,"i":14,"c":401},{"t":2,"n":12,"i":12,"c":212}
		//];
		//cc.log("p.handCardIds::"+JSON.stringify(p.handCardIds));
		p.ip = "xxx";
		if(this.card1.length == 0 || this.card2.length == 0 || this.card3.length == 0 || (PlayBackModel.playerLength == 4 && this.card4.length == 0)){
			var index = this.getPlayerSeq(list.userId,PlayBackModel.mySeat, list.seat);
			this.getWidget("cardPanel"+index).removeAllChildren(true);
			var seq = this.getPlayerSeq(p.userId,PlayBackModel.mySeat, p.seat);
			var cardPlayBack = this._players[p.seat] = new DZTReplayPlayer(p,this.root,seq);
			this.createCard(p, 0);
		}
	},

	updateHandCard:function(cards,list,fal){
		var p = list;
		var handcard = [];
		for(var key in cards){
			handcard.push(DTZAI.getCardDef(cards[key]));
		}
		var p = list;
		p.handCardIds = handcard;
		if(p.seat == PlayBackModel.mySeat){
			this._cardPanel1.removeAllChildren(true);
			this.card1 = [];
		}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][1]){
			this._cardPanel2.removeAllChildren(true);
			this.card2 = [];
		}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][2]){
			this._cardPanel3.removeAllChildren(true);
			this.card3 = [];
		}else{
			this._cardPanel4.removeAllChildren(true);
			this.card4 = [];
		}
		this.createCard(p);
		//if(handcard.length == 1){
		//	this._players[p.seat].baoting();
		//}else{
		//	this._players[p.seat]._isBt = false;
		//	if(p.seat != PlayBackModel.mySeat){
		//		this._players[p.seat].bt.visible = false;
		//	}
		//}
	},

	updateOutCards:function(cards,seat,fal,state,play){
		//cc.log("cards::::::"+cards);
		this._lastCardPattern = null;
		this._lastCardTypeData = null;
		var buyao = false;
		var mySeat = PlayBackModel.mySeat;
		if(fal == false){
			var nextSeq = this.getPlayerSeq(-1,mySeat,this.seatSeq[seat][1]);
			this.getWidget("small"+nextSeq).removeAllChildren(true);
			this.getWidget("ybq"+nextSeq).visible = false;
		}
		if(cards.length == 0 && fal == false){
			buyao = true;
			this._players[seat].showStatus(-1);
			var curSeq = this.getPlayerSeq(-1,mySeat,seat);
			this.getWidget("small"+curSeq).removeAllChildren(true);
			return;
		}else if(fal == true && !state){
			var curSeq = this.getPlayerSeq(-1,mySeat,seat);
			this.getWidget("small"+curSeq).removeAllChildren(true);
			this.getWidget("ybq"+curSeq).visible = false;
			return;
		}
		if(cards.length == 0 && fal == true){
			buyao = true;
			var curSeq = this.getPlayerSeq(-1,mySeat,seat);
			this.getWidget("small"+curSeq).removeAllChildren(true);
			this.getWidget("ybq"+curSeq).visible = true;
			return;
		}
		AudioManager.play("res/audio/common/audio_card_out.mp3");
		var seq = 1;
		var posEff = cc.p(960 , 375);
		if(seat == PlayBackModel.mySeat){
			seq = 1;
		}else if(seat == this.seatSeq[mySeat][1]){
			seq = this.getPlayerSeq(-1,mySeat,seat);
			posEff = cc.p(1570 , 690);
		}else if(seat == this.seatSeq[mySeat][2]){
			seq = this.getPlayerSeq(-1,mySeat,seat);
			posEff = cc.p(360 , 690);
			if (PlayBackModel.playerLength == 4){
				posEff = cc.p(930 , 775);
			}
		}else{
			seq = this.getPlayerSeq(-1,mySeat,seat);
			posEff = cc.p(360 , 690);
		}
		var handcard = [];
		for(var key in cards){
			handcard.push(DTZAI.getCardDef(cards[key]));
		}
		if(!play){
			this._lastCardPattern = DTZAI.filterCards(handcard,null,null,null);
			this._lastCardTypeData = DTZAI.getCardsType(handcard , this._lastCardTypeData);
			if(!buyao)
				DTZRoomSound.letOutSound(this._players[seat].getPlayerVo().userId,this._lastCardTypeData,-1);
			DTZRoomEffects.play(this.root,this._lastCardTypeData,posEff);
		}
		var copyCardIds = ArrayUtil.clone(cards);
		length = copyCardIds.length;
		var smallW = this._bigCardW*0.6;
		if(seq == 1){
			initX = (800 - (smallW+30*(length-1)))/2;
		}else if(seq == 2) {
			initX = (800-smallW);
			copyCardIds.reverse();
		}else{
			initX = 0;
		}
		this.getWidget("small"+seq).removeAllChildren(true);
		for(var i=0;i<length;i++){
			var smallCard = new SmallCard(DTZAI.getCardDef(copyCardIds[i]));
			smallCard.anchorX=smallCard.anchorY=0;
			smallCard.scale = 0.8;
			if(seq == 2){
				smallCard.x = initX-i*45;
				smallCard.setLocalZOrder(length-i);
			}else{
				smallCard.x = initX+i*45;
			}
			smallCard.y = 0;
			this.getWidget("ybq"+seq).visible = false;
			this.getWidget("small"+seq).addChild(smallCard);
		}
	},

	createCard:function(p,step){
		var cards = p.handCardIds;
		//cc.log("p.handCardIds::"+JSON.stringify(p.handCardIds));
		if(cards.length>0){
			this._players[p.seat].deal(p.handCardIds);
			var winSize = cc.director.getWinSize();
			var centerX = (winSize.width - this._cardW)/2;
			var initX = 0;
			if (cards.length < 16){
				initX = (winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2;
			}
			for(var i=0;i<cards.length;i++){
				var card = new DTZBigCard(cards[i],null,true);
				card.cardId = i;
				card.anchorX = 0;
				card.anchorY  = 0;
				var realX = initX+i*this._cardG;
				card.x = realX;
				card.y = 0;
				var scale = 1;
				if(p.seat == PlayBackModel.mySeat){
					this.card1.push(card);
					this._cardPanel1.addChild(card);
				}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][1]){
					this.card2.push(card);
					this._cardPanel2.addChild(card);
				}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][2]){
					this.card3.push(card);
					this._cardPanel3.addChild(card);
				}else{
					this.card4.push(card);
					this._cardPanel4.addChild(card);
				}
				//if(step == 0)
					//card.letOutAnimate(realX);
			}
			if(p.seat == PlayBackModel.mySeat){
				var length = this.card1.length;
				if(length>0) {
					this.reStartSort(this.card1);
					for (var i = 0; i < length; i++) {
						this.card1[i].x = initX + Math.floor(i % this.cardMaxLength) * this._cardG;
						this.card1[i].y = Math.floor(i / this.cardMaxLength) * this._cardH;
						this.card1[i].setLocalZOrder(this.card1.length - Math.floor(i/this.cardMaxLength));
					}
				}
			} else if(p.seat == this.seatSeq[PlayBackModel.mySeat][1]){
				scale = 0.4;
				if (cards.length < 10) {
					initX = 180;
				}else if (cards.length < 18) {
					initX = 100;
				}
				var length = this.card2.length;
				if(length>0) {
					this.reStartSort(this.card2);
					for (var i = 0; i < length; i++) {
						this.card2[i].x = initX + Math.floor(i % this.cardMaxLength)*  scale * this._cardG;
						this.card2[i].y = Math.floor(i / this.cardMaxLength) *  scale * this._cardH;
						this.card2[i].setScale(scale);
						this.card2[i].setLocalZOrder(this.card2.length - Math.floor(i/this.cardMaxLength));
					}
				}
			}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][2]){
				scale = 0.4;
				if (cards.length < 10) {
					initX = 100;
				}else if (cards.length < 18) {
					initX = 50;
				}
				var length = this.card3.length;
				if(length>0) {
					this.reStartSort(this.card3);
					for (var i = 0; i < length; i++) {
						this.card3[i].x = initX + Math.floor(i % this.cardMaxLength)*  scale * this._cardG;
						this.card3[i].y = Math.floor(i / this.cardMaxLength) *  scale * this._cardH;
						this.card3[i].setScale(scale);
						this.card3[i].setLocalZOrder(this.card3.length - Math.floor(i/this.cardMaxLength));
					}
				}
			}else{
				scale = 0.4;
				if (cards.length < 10) {
					initX = 100;
				}else if (cards.length < 18) {
					initX = 50;
				}
				var length = this.card4.length;
				if(length>0) {
					this.reStartSort(this.card4);
					for (var i = 0; i < length; i++) {
						this.card4[i].x = initX + Math.floor(i % this.cardMaxLength)*  scale * this._cardG;
						this.card4[i].y = Math.floor(i / this.cardMaxLength) *  scale * this._cardH;
						this.card4[i].setScale(scale);
						this.card4[i].setLocalZOrder(this.card4.length - Math.floor(i/this.cardMaxLength));
					}
				}

			}

			//if(step != 0 && p.handCardIds.length>0){
			//	if(p.seat == PlayBackModel.mySeat){
			//		var length = this.card1.length;
			//		if(length>0){
			//			for(var i=0;i<length;i++){
			//				this.card1[i].x = realX = initX+Math.floor(i%this.cardMaxLength)*this._cardG;
			//				this.card1[i].y = Math.floor(i/this.cardMaxLength)*this._cardH;
			//			}
			//		}
			//	}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][1]){
			//		var length = this.card2.length;
			//		if(length>0){
			//			for(var i=0;i<length;i++){
            //
			//				this.card2[i].x = realX = initX+Math.floor(i%this.cardMaxLength)*this._cardG;
			//				this.card2[i].y = Math.floor(i/this.cardMaxLength)*this._cardH;
            //
			//				//this.card2[i].x = realX = initY+i*20;
			//				//this.card2[i].cardId = i;
			//			}
			//		}
			//	}else{
			//		var length = this.card3.length;
			//		if(length>0){
			//			for(var i=0;i<length;i++){
			//				this.card3[i].x = realX = initX+Math.floor(i%this.cardMaxLength)*this._cardG;
			//				this.card3[i].y = Math.floor(i/this.cardMaxLength)*this._cardH;
            //
			//				//this.card3[i].x = realX = initY+i*20;
			//				//this.card3[i].cardId = i;
			//			}
			//		}
			//	}
			//}
		}
	},
	reStartSort:function(cards){
		var playType = this.checkPlayType();
		var is3FuPai = playType[0];
		var is4FuPai = playType[1];
		DTZExfunc.signTongzi(cards);
		if(is3FuPai){
			//检测地炸
			DTZExfunc.signSuperBoom(cards);
		}else if(is4FuPai){
			//检测囍
			DTZExfunc.signXi(cards);
		}
		cards.sort(function (item2, item1) {
			if (item1.i != item2.i) {
				return item2.i - item1.i;
			} else {
				if( (item2.isSpecialCard() != item1.isSpecialCard()) ){
					return item2.isSpecialCard() - item1.isSpecialCard()
				}else{
					return item2.t - item1.t;
				}
			}
		});
	},
	checkPlayType:function(){
		var dtzWanfas = [113,115,117];
		var dtzWanfas1 = [114,116,118,210,211,212];
		var is3FuPai = false;
		var is4FuPai = false;
		if(ArrayUtil.indexOf(dtzWanfas, PlayBackModel.wanfa) >= 0) {
			is3FuPai = true;
		}
		//if(ArrayUtil.indexOf(dtzWanfas1, PlayBackModel.wanfa) >= 0){
		//	is4FuPai = true;
		//}
		if(this.is4FuPai(PlayBackModel.wanfa)){
			is4FuPai = true;
		}
		return [is3FuPai,is4FuPai];
	},

	is4FuPai: function(wanfa) {
		var tWanfa = wanfa || 0;
		return (tWanfa==114 || tWanfa==116 || tWanfa==118  || tWanfa == 210 || tWanfa == 211 || tWanfa == 212);
	},

});