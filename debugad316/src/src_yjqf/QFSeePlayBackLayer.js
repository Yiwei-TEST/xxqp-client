/**
 * Created by hujincheng on 2016/7/29.
 * 回放游戏记录
 * @class
 * @extend {Room}
 */
var QFSmallCard = ccui.Widget.extend({
	ctor:function(cardVo){
		this._super();

		this.i = cardVo.i;
		this.t = cardVo.t;
		this.n = cardVo.n;
		this.c = cardVo.c;
		var type = "";
		switch(this.t){
			case 1:type = "fang";break;
			case 2:type = "mei";break;
			case 3:type = "hong";break;
			case 4:type = "hei";break;
			default :type = "hei";
		}
		this._bg = new cc.Sprite("res/res_yjqf/qfSmallCard/"+type+this.n+".png");
		this.addChild(this._bg);
		this._bg.x = this._bg.width/2;
		this._bg.y = this._bg.height/2;
		this.width = this._bg.width;
		this.height = this._bg.height;
	}
});

var QFSeePlayBackLayer = BaseLayer.extend({
	_dt:null,
	_step:0,
	_cardPanel:null,
	_cardW:430,
	_bigCardW:140,
	_cardG:150,
	/**
	 * {Array.<QFBigCard>}
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
		//if(PlayBackModel.list.length!=2){
		//	this.img_qipai.visible = false
		//}
		for(var i=1;i<=3;i++){
			this.getWidget("player"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			this.getWidget("zhunbei"+i).visible = false;
			this.getWidget("small"+i).removeAllChildren(true);
			this.getWidget("handsCardPanel"+i).removeAllChildren(true);
			//if(i>1)
			//	this.getWidget("bt"+i).visible = false;
		}
		PlayBackModel.WuCountList = [];
		PlayBackModel.WuCountList.length = PlayBackModel.step+1;
		PlayBackModel.ShiCountList = [];
		PlayBackModel.ShiCountList.length = PlayBackModel.step+1;
		PlayBackModel.KCountList = [];
		PlayBackModel.KCountList.length = PlayBackModel.step+1;
		this.updateCard(0,false);
		this.Label_27.setString(PlayBackModel.tableId);
		this.lableRoomRound.setString(ClosingInfoModel.ext[4]);
		this.showTime();
		this.onStep();
		this.scheduleUpdate();
		this.Button_30.loadTextureNormal("res/res_yjqf/qfReplay/yjReplay_9.png");
	},

	selfRender:function(){
		for(var i=1;i<=3;i++){
			//if(i>1)
			//	this.getWidget("bt"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			UITools.addClickEvent(this.getWidget("player"+i),this,this.onPlayerInfo);
		}
		//隐藏不需要显示的
		this.paiNumLabel = this.getWidget("Label_paiNum");
		this.paiNumLabel.setString("");

		this.Image_game = this.getWidget("Image_game");
		this.Image_game.visible = false;
		var endScoreStr = "结算：" + QFRoomModel.endScore;
		var exScoreStr =  "奖励：" + QFRoomModel.exScore;

		this.awardLabel = this.getWidget("Label_award");
		this.awardLabel.setString(exScoreStr);
		this.awardLabel.setString("");

		this.jsScoreLabel = this.getWidget("Label_jsScore");
		this.jsScoreLabel.setString(endScoreStr);
		this.jsScoreLabel.setString("");
		this._step = 0;
		this.Button_4 = this.getWidget("replay_l");//后退
		this.Button_6 = this.getWidget("replay_r");//快进
		this.Button_30 = this.getWidget("replay");//暂停
		this._cardPanel1 = ccui.helper.seekWidgetByName(this.root,"handsCardPanel1");
		this._cardPanel2 = ccui.helper.seekWidgetByName(this.root,"handsCardPanel2");
		this._cardPanel3 = ccui.helper.seekWidgetByName(this.root,"handsCardPanel3");
		//this.Panel_37 = this.getWidget("Panel_37");
		//this.Panel_15 = this.getWidget("Panel_15");
		//this.Label_38 = this.getWidget("Label_38");
		this.roomFiveNumLable = this.getWidget("LableFiveNum");//当前牌面5的个数
		this.roomTenNumLable = this.getWidget("LableTenNum");//当前牌面10的个数
		this.roomKNumLable = this.getWidget("LableKNum");//当前牌面K的个数
		//var Button_43 = ccui.helper.seekWidgetByName(this.root,"Button_43");
		//Button_43.visible = false;
		this.Label_84 = this.getWidget("Label_progress_0");
		this.battery = this.getWidget("battery");
		this.netType = this.getWidget("netType");
		this.Button_25 = this.getWidget("btn_exit");
		//this.Label_27 = this.getWidget("Label_27");
		this.Label_39 = this.getWidget("Label_39");//时间
		//this.img_qipai = this.getWidget("Image_7");
		//this.Label_27 = new cc.LabelBMFont("","res/font/font_res_huang1.fnt");
		//this.Label_27.x = this.Panel_37.width*0.32;
		//this.Label_27.y = this.Panel_37.height*0.68;
		//this.Panel_37.addChild(this.Label_27);
		this.Label_27 = this.getWidget("lableRoomId");
		this.lastCardPanel = this.getWidget("Panel_lastCard");//剩余牌层
		UITools.addClickEvent(this.Button_25,this,this.onReturnHome);
		UITools.addClickEvent(this.Button_30,this,this.onPlayOrPause);
		UITools.addClickEvent(this.Button_4,this,this.onFallBack);
		UITools.addClickEvent(this.Button_6,this,this.onFastForward);

		this.lableRoomRound = this.getWidget("lableRoomRound");

		var bg_btn = this.getWidget("Image_64_0");
		var label_hfm = UICtor.cLabel("回放码:" + BaseRoomModel.curHfm,36);
		label_hfm.setAnchorPoint(0.5,1);
		label_hfm.setPosition(bg_btn.width/2,bg_btn.height);
		bg_btn.addChild(label_hfm);
	},

	onPlayerInfo:function(obj){
		this._players[obj.temp].showInfo();
	},

	refreshScore:function(){
		this.roomFiveNumLable.setString(PlayBackModel.WuCountList[this._step] || 0);
		this.roomTenNumLable.setString(PlayBackModel.ShiCountList[this._step] || 0);
		this.roomKNumLable.setString(PlayBackModel.KCountList[this._step] || 0);
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
		
		if(ClubRecallModel.isShowRecord){
			PopupManager.showPopup(PyqHall);
			ClubRecallModel.isShowRecord = false;
		}
        if(PopupManager.getClassByPopup(GoldClubRecordPop)){
            PopupManager.showPopup(GoldClubRecordPop);
        }
        if(PopupManager.getClassByPopup(GoldRecordPop)){
            PopupManager.showPopup(GoldRecordPop);
        }
        if(PopupManager.getClassByPopup(PyqRecordPop)){
            PopupManager.showPopup(PyqRecordPop);
        }
		if(ClubRecallDetailModel.isShowRecord){
			PopupManager.showPopup(ClubPdkRecallDetailPop);
			ClubRecallDetailModel.isShowRecord = false;
		}

	},

	/**
	 * 播放或者暂停
	 */
	onPlayOrPause:function(){
		if(this._step != PlayBackModel.step){
			if(!this.playBackState){
				this.onStop();
				this.Button_30.loadTextureNormal("res/res_yjqf/qfReplay/yjReplay_11.png");
				this.playBackState = !this.playBackState;
			}else{
				this.scheduleUpdate();
				this.Button_30.loadTextureNormal("res/res_yjqf/qfReplay/yjReplay_9.png");
				this.playBackState = !this.playBackState;
			}
		}else{
			this.initData();
			this.Button_30.loadTextureNormal("res/res_yjqf/qfReplay/yjReplay_9.png");
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
				this.Button_30.loadTextureNormal("res/res_yjqf/qfReplay/yjReplay_11.png");
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
				this.Button_30.loadTextureNormal("res/res_yjqf/qfReplay/yjReplay_11.png");
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
			var renshu = PlayBackModel.list.length;
			for (var i = 1; i <= renshu; i++) {
				this._players[i].showMingci();
			}
			this.onshowLastCard();
			this.onStop();
			this.Button_30.loadTextureNormal("res/res_yjqf/qfReplay/yjReplay_11.png");
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
			if(step>1){
				var beforeSeat = PlayBackModel.players[step+(PlayBackModel.list.length-2)].split("_")[0];
				if(beforeSeat == seat || this._step == PlayBackModel.step){
					var jifen = PlayBackModel.WuCountList[this._step-1]*5+PlayBackModel.ShiCountList[this._step-1]*10+PlayBackModel.KCountList[this._step-1]*10;
					this._players[seat]._nJifen =this._players[seat].tempJifen[step]|| this._players[seat]._nJifen +jifen;
					this._players[seat].tempJifen[step]=this._players[seat]._nJifen;
					this._players[seat].refreshAllScore();
					PlayBackModel.WuCountList[this._step] = 0;
					PlayBackModel.ShiCountList[this._step] = 0;
					PlayBackModel.KCountList[this._step] = 0;
				}else{
					this._players[seat]._nJifen =(this._players[seat].tempJifen[step]==undefined)? this._players[seat]._nJifen:this._players[seat].tempJifen[step];
					if (this._players[seat].tempJifen[step]==undefined) {
						this._players[seat].tempJifen[step] = this._players[seat]._nJifen;
						cc.log("fuzhilemei",this._players[seat].tempJifen[step],this._players[seat]._nJifen);
					}
					this._players[seat].refreshAllScore();
				}
				var nextSeat = parseInt(beforeSeat)+1;
				var renshu = PlayBackModel.list.length;
				nextSeat = nextSeat>renshu?nextSeat%renshu : nextSeat;
				if(nextSeat != seat){
					var nextSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,nextSeat);
					this.getWidget("small"+nextSeq).removeAllChildren(true);
					this._players[nextSeat].showStatus(-1);
					nextSeat = nextSeat+1;
					nextSeat = nextSeat>renshu?nextSeat%renshu : nextSeat;
					if(nextSeat != seat){
						var nextSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,nextSeat);
						this.getWidget("small"+nextSeq).removeAllChildren(true);
						this._players[nextSeat].showStatus(-1);
					}
				}
			}
			if(step>1 && fal==true){
				state = true;
				var beforeSeat = PlayBackModel.players[step+(PlayBackModel.list.length-2)].split("_")[0];
				var beforeSeq = this.getPlayerSeq(-1,PlayBackModel.mySeat,beforeSeat);
				this.updateOutCards(PlayBackModel["outCardData"+beforeSeq],beforeSeat,fal,state);//更新上首出过的牌
				cc.log("PlayBackModel.list.length = "+PlayBackModel.list.length)
				if (PlayBackModel.list.length == 3){
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
		this.refreshScore();
	},

	initCard:function(cards,list){
		var handcard = [];
		for(var key in cards){
			var card = QFAI.getCardDef(cards[key]);
			if(card)
				handcard.push(card);
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
			this.getWidget("handsCardPanel"+index).removeAllChildren(true);
			var seq = this.getPlayerSeq(p.userId,PlayBackModel.mySeat, p.seat);
			this._players[p.seat] = new QFCardPlayBack(p,this.root,seq);
			this._players[p.seat].tempJifen =[];
			this.createCard(p, 0);
		}
	},

	updateHandCard:function(cards,list,fal){
		var handcard = [];
		for(var key in cards){
			var card = QFAI.getCardDef(cards[key]);
			if(card)
				handcard.push(card);
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
		}
		if(p.handCardIds.length == 0){
			this._players[p.seat].showMingci();
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
		cc.log(seat,"cards::::::"+JSON.stringify(cards));
		this._lastCardPattern = null;
		this._lastCardTypeData = null;
		var buyao = false;
		var mySeat = PlayBackModel.mySeat;
		if(this.seatSeq[seat] && fal == false){
			var nextSeq = this.getPlayerSeq(-1,mySeat,this.seatSeq[seat][1]);
			this.getWidget("small"+nextSeq).removeAllChildren(true);
			this.getWidget("ybq"+nextSeq).visible = false;
		}
		if(cards && cards.length == 0 && fal == false){
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
		var posEff = cc.p(640 , 250);
		if(seat == PlayBackModel.mySeat){
			seq = 1;
		}else if(seat == this.seatSeq[mySeat][1]){
			seq = this.getPlayerSeq(-1,mySeat,seat);
			posEff = cc.p(1040 , 460);
		}else if(seat == this.seatSeq[mySeat][2]){
			seq = this.getPlayerSeq(-1,mySeat,seat);
			posEff = cc.p(240 , 460);
			if (PlayBackModel.playerLength == 4){
				posEff = cc.p(620 , 550);
			}
		}else{
			seq = this.getPlayerSeq(-1,mySeat,seat);
			posEff = cc.p(240 , 460);
		}
		var handcard = [];
		for(var key in cards){
			handcard.push(QFAI.getCardDef(cards[key]));
		}
		if(!play){
			this._lastCardPattern = QFAI.filterCards(handcard);
			this._lastCardTypeData = QFAI.getCardsType(handcard , this._lastCardTypeData);
			if(!buyao)
				QFRoomSound.letOutSound(this._players[seat].getPlayerVo().userId,this._lastCardTypeData,-1);
			QFRoomEffects.play(this.root,this._lastCardTypeData,posEff);
		}
		var copyCardIds = ArrayUtil.clone(cards);
		var length = copyCardIds.length;
		var initX = 0;
		this.getWidget("small"+seq).removeAllChildren(true);

		if(this._lastCardTypeData && QFAI.BOMB == this._lastCardTypeData.type && cards.length >= 7){

			var xifen = 0;
			if(ClosingInfoModel.intParams[4] == 1){
				xifen = (cards.length-6)*200;
			}else if(ClosingInfoModel.intParams[4] == 2){
				xifen = Math.pow(2,cards.length-6)*100;
			}
			if(PlayBackModel.list.length == 2){
				for(var i = 1; i <= PlayBackModel.list.length; i++) {
					if(seat == i) {
						this._players[i]._nXifen += xifen;
					}else{
						this._players[i]._nXifen -= xifen;
					}
					this._players[i].refreshAllScore();
				}
			}else{
				for(var i = 1; i <= PlayBackModel.list.length; i++) {
					if(seat == i) {
						this._players[i]._nXifen += xifen;
					}else{
						this._players[i]._nXifen -= xifen/2;
					}
					this._players[i].refreshAllScore();
				}
			}
			
		}

		var isBack = true;
		if(PlayBackModel.WuCountList[this._step] === undefined ||
			PlayBackModel.KCountList[this._step] === undefined ||
			PlayBackModel.ShiCountList[this._step] === undefined){
			PlayBackModel.WuCountList[this._step] = PlayBackModel.WuCountList[this._step-1] || 0;
			PlayBackModel.ShiCountList[this._step] = PlayBackModel.ShiCountList[this._step-1] || 0;
			PlayBackModel.KCountList[this._step] = PlayBackModel.KCountList[this._step-1] || 0;
			isBack = false;
		}

		for(var i=0;i<length;i++){
			var smallCard = new QFSmallCard(QFAI.getCardDef(copyCardIds[i]));
			smallCard.anchorX=smallCard.anchorY=0;
			//smallCard.scale = 0.8;
			if(seq == 2){
				smallCard.x = initX-i*48;
				smallCard.setLocalZOrder(length-i);
			}else{
				smallCard.x = initX+i*48;
			}
			smallCard.y = 0;
			if(smallCard.n == 5 && !isBack){
				PlayBackModel.WuCountList[this._step]++;
			}else if(smallCard.n == 10 && !isBack){
				PlayBackModel.ShiCountList[this._step]++;
			}else if(smallCard.n == 13 && !isBack){
				PlayBackModel.KCountList[this._step]++;
			}
			this.getWidget("ybq"+seq).visible = false;
			this.getWidget("small"+seq).addChild(smallCard);
		}
	},

	createCard:function(p,step){
		var cards = p.handCardIds;
		// cc.log("p.handCardIds::"+JSON.stringify(p.handCardIds));
		if(cards.length>0){
			this._players[p.seat].deal(p.handCardIds);
			var ArrayByCardId = [];
			var ArrayCount = -1;
			var cardid = 0;

			for (var i = 0; i < cards.length; i++){
				var card = cards[i];
				if(cardid != card.n){
					cardid = card.n;
					ArrayCount++;
					ArrayByCardId[ArrayCount] = [];
				}
				ArrayByCardId[ArrayCount].push(card);
			}
			var initX = QFRoomModel.CardMidX;
			initX -= (ArrayCount)/2*this._cardG;
			if(p.seat != PlayBackModel.mySeat){
				initX = 50;
			}
			var cardid = 0;
			for (var key in ArrayByCardId) {
				var cardArray = ArrayByCardId[key];
				//cc.log(key+" : "+cardArray.length+initX)
				for (var i = 0; i < cardArray.length; i++) {
					if(p.seat == PlayBackModel.mySeat){
						card = new QFBigCard(cardArray[i]);
					}else{
						card = new QFSmallCard(cardArray[i]);
					}

					//cc.log(key+":"+i+" = "+card.n)
					card.cardId = cardid++;
					card.setLocalZOrder(12-i);

					if(cardArray.length >= 4){
						card._BoomNumber = cardArray.length;
						card.y = QFRoomModel.initCardYLine2+QFRoomModel._cardY1*i;
					}else{
						card.y = QFRoomModel.initCardYLine2+QFRoomModel._cardY2*i;
					}
					card.x = initX;
					//cc.log("card.x = "+card.x+"card.y = "+card.y);
					if(p.seat == PlayBackModel.mySeat){
						this.card1.push(card);
						card.setScale(QFRoomModel._cardScale);
						this._cardPanel1.addChild(card);
					}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][1]){
						this.card2.push(card);
						this._cardPanel2.addChild(card);
						card.y *= 0.45;
					}else if(p.seat == this.seatSeq[PlayBackModel.mySeat][2]){
						this.card3.push(card);
						this._cardPanel3.addChild(card);
						card.y *= 0.45;
					}

					if(i === cardArray.length-1){
						if(p.seat == PlayBackModel.mySeat){
							initX += this._cardG;
						}else{
							initX += card.width-5;
						}

						if(cardArray.length >= 4){
							var sp = new cc.Sprite("res/res_yjqf/images/qfCardCount_"+cardArray.length+".png");
							sp.y = card.height + 20;
							sp.x = card.width/2;
							card.addChild(sp);
							if(p.seat != PlayBackModel.mySeat){
								sp.scale = 0.8;
							}
						}
					}
				}
			}
		}
	},
	reStartSort:function(cards){
		var playType = this.checkPlayType();
		var is3FuPai = playType[0];
		var is4FuPai = playType[1];
		QFExfunc.signTongzi(cards);
		if(is3FuPai){
			//检测地炸
			QFExfunc.signSuperBoom(cards);
		}else if(is4FuPai){
			//检测囍
			QFExfunc.signXi(cards);
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
		var qfWanfas = [113,115,117];
		var qfWanfas1 = [114,116,118];
		var is3FuPai = false;
		var is4FuPai = false;
		if(ArrayUtil.indexOf(qfWanfas, PlayBackModel.wanfa) >= 0) {
			is3FuPai = true;
		}
		if(ArrayUtil.indexOf(qfWanfas1, PlayBackModel.wanfa) >= 0){
			is4FuPai = true;
		}
		return [is3FuPai,is4FuPai];
	},
	onshowLastCard: function () {
		var birdslist = [];
		for (var i = 0; i < PlayBackModel.closingMsg.bird.length; i++) {
			birdslist.push(QFAI.getCardDef(PlayBackModel.closingMsg.bird[i]));
		}
		this.lastCardPanel.removeAllChildren();
		for (var i = 0; i < birdslist.length; i++){
			var card = new QFBigCard(birdslist[i]);
			//card.anchorX = card.anchorY = 0.5;
			card.scale = 0.8;
			card.x = 20+i*60;
			card.y = 20;
			card.setLocalZOrder(i);
			this.lastCardPanel.addChild(card);
		}
	}
});