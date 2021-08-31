/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {cc.Class}
 */
var CardPlayer = cc.Class.extend({
	/** @lends CardPlayer.prototype */
	_cards:null,

	/**
	 * {RoomPlayerVo}
	 */
	_playerVo:null,

	_isBt:false,
	_iconUrl:"",
	_teamId:0,
	_userId:0,
	_isNoCards:false,
	/**
	 *
	 * @param name {RoomPlayerVo}
	 * @param root {Object}
	 */
	ctor:function(vo , root , seq , teamId){
		this._jettons = [];
		this._teamId = teamId;
		this._userId = vo.userId;
		this._status = vo.status;
		this._isBt = false;
		this.isTuoguan = false;
		this._iconUrl = "";
		this._playerVo = vo;
		this.seq = seq;
		this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq);
		this.iconbg.temp = vo.seat;
		this.iconbg.visible = true;
		this.root = root;
		this.zanliIcon = ccui.helper.seekWidgetByName(root , "zl" + seq);
		//this.tuoguanSp = ccui.helper.seekWidgetByName(root , "tuoguanSp" + seq);
		this.tuoguanSp = ccui.helper.seekWidgetByName(this.iconbg , "tuoguanSp");
		if(this.tuoguanSp){
			this.tuoguanSp.visible = false;
		}

		this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
		this.cardBg = ccui.helper.seekWidgetByName(this.iconbg,"cardBg");
		if(this.cardBg){
			this.cardN=ccui.helper.seekWidgetByName(this.iconbg,"cardN");
			this.cardBg.visible=false;
		}
		//this.name.setString(vo.name);
		this.setPalyerName(vo.name);
		this.imgGray = this.getPalyerWidget("imgGray"+seq);
		this.imgGray.visible = false;
		this.statusImg = ccui.helper.seekWidgetByName(root,"ybq" + seq);
		this.zbImg = ccui.helper.seekWidgetByName(root,"zhunbei" + seq);
		this.statusTexture = "";
		this.bt = ccui.helper.seekWidgetByName(root,"bt" + seq);
		this.point = ccui.helper.seekWidgetByName(root,"lableScore" + seq);
		this.leave = ccui.helper.seekWidgetByName(root,"zl" + seq);
		this.leave.visible = false;
		this.yybg = ccui.helper.seekWidgetByName(root,"yy" + seq);
		this.yyts = ccui.helper.seekWidgetByName(root,"yyts" + seq);
		this.yybg.visible = false;

		this.lableWinNumber = ccui.helper.seekWidgetByName(root,"lable_WinNumber" + seq);
		this.jiahaoImg = ccui.helper.seekWidgetByName(root,"jiahaoImg" + seq).visible = false;
		this.creatorSign = this.getPalyerWidget("CreaterSignImg" + seq);
		if(this.creatorSign){
			this.creatorSign.visible = false;
		}



		//分组icon
		this.aTeamIcon = this.getPalyerWidget("teamIcon1");
		this.bTeamIcon = this.getPalyerWidget("teamIcon2");

		//加载额外信息 并且刷新玩家显示
		this.loadPlayerExtData(vo);

		if(DTZRoomModel.isMoneyRoom() || DTZRoomModel.isMatchRoom()){
			this.updatePoint(this.coinNum);
		}else{
			this.updatePoint(vo.point);
		}

		//ip相同提示
		this.ipSame = ccui.helper.seekWidgetByName(root,"ipSame"+seq);
		this.ipSame.visible = false;

		this._cards = [];
		this.showIcon();

		if (SdkUtil.isIphoneX()) {
			if (DTZRoomModel.is3Ren() && seq == 3) {
				this.iconbg.x = 100;
			}
			if (DTZRoomModel.is4Ren() && seq == 4) {
				this.iconbg.x = 100;
			}
		}

		this.creditScore = ccui.helper.seekWidgetByName(root,"lableCreditScore"+seq);
		if (this.creditScore){
			this.creditScore.setString("");
		}
		var isCredit = DTZRoomModel.isCreditRoom();
		if (isCredit){
			var creditNum = DTZRoomModel.getCreditNum(this._playerVo);
			this.creditScore.setString("赛:"+creditNum);
		}

		if(DTZRoomModel.isClubGoldRoom()){
			this.creditScore.setString("豆:"+UITools.moneyToStr(vo.gold));
		}
	},

	//刷新玩家的托管状态
	updateTuoguan:function(isTuoguan){
		if(this.tuoguanSp && isTuoguan != null){
			cc.log("刷新托管状态的显示" , isTuoguan);
			this.tuoguanSp.visible = isTuoguan;
			this.isTuoguan = isTuoguan;
		}
	},

	//IP相同显示
	isIpSame:function(visible){
		if(!DTZRoomModel.isMoneyRoom() && !DTZRoomModel.isMatchRoom()){
			this.ipSame.visible = visible;
		}else{
			this.ipSame.visible = false;
		}
	},

	loadPlayerExtData: function(message){

		this._teamId = message.ext[0];
		this.mingci = message.ext[1];
		this.curPoint = message.ext[2];
		this.isFirstOut = message.ext[3];
		this.isMaster = message.ext[4];
		this.isTuoguan = message.ext[7];
		if(DTZRoomModel.isMoneyRoom() || DTZRoomModel.isMatchRoom()){
			this.coinNum = message.ext[8];
			cc.log("this.coinNum..." , this.coinNum);
		}
		this.updateTuoguan(this.isTuoguan);
		cc.log("DtzCardPlay message.ext..." , message.ext);
		//cc.log("message.ext ... " , message.ext[0] , message.ext[1], message.ext[2] , message.ext[3] , message.ext[4]);
		//cc.log("this.curPoint..." , this.curPoint);
		if(this.mingci != null){
			this.showNumber(this.mingci);
		}
		if (DTZRoomModel.is4Ren()) {
			this.aTeamIcon.visible = (this._teamId == 1);
			this.bTeamIcon.visible = (this._teamId == 2);
		}
		if(!DTZRoomModel.isMoneyRoom() || !DTZRoomModel.isMatchRoom()){
			this.creatorSign.visible = this.isMaster;
		}else{
			this.creatorSign.visible = false;
		}

	},

	setPalyerName: function(nameString){
		//nameString = "我1想lm试试中文";
		var length = nameString.length;
		var tlableForSize = null;
		var showName = nameString;
		var tName = nameString;
		var tWidth = 0;

		for (var curLenght = 2 ; curLenght <= length ; curLenght ++) {
			tName = nameString.substring(0 , curLenght);
			tlableForSize = new cc.LabelTTF(tName ,"Arial" , 24);
			tWidth = tlableForSize.width;
			if(tWidth >= 75){
				showName = nameString.substring(0 , curLenght - 1);
				break;
			}
		}

		var nameStr = showName;
		nameStr = UITools.truncateLabel(nameStr,3);
		this.name.setString(nameStr);
	},

	getPalyerWidget: function(widgetName){
		return ccui.helper.seekWidgetByName(this.iconbg, widgetName);
	},

	getUserId: function(){
		return this._playerVo.userId;
	},

	getTeamId:function (){
		return this._teamId;
	},

	showInfo: function(){
		var mc = new PlayerInfoPop(this._playerVo);
		PopupManager.addPopup(mc);
	},

	/**
	 * @returns {RoomPlayerVo}
	 */
	getPlayerVo:function(){
		return this._playerVo;
	},

	showIcon:function(){
		// this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
		//为什么这个在模拟器上会闪退
		var url = this._playerVo.icon;
		var defaultimg = (this._playerVo.sex==1) ? "res/res_dtz/images/default_m.png" : "res/res_dtz/images/default_w.png";
		if(!url)
			url = defaultimg;
		if(this._iconUrl == url)
			return;
		if(this.iconbg.getChildByTag(345))
			this.iconbg.removeChildByTag(345);
		this._iconUrl = url;
		var sprite = new cc.Sprite(defaultimg);
		sprite.setScale(0.95);
		if(this._playerVo.icon){
			sprite.x = sprite.y = 0;
			try{
				//FloatLabelUtil.comText("step 222222222");
				var scale = 0.75;
				var sten = new cc.Sprite("res/res_dtz/images/img_14_c.png");
				sten.setScale(scale);
				var clipnode = new cc.ClippingNode();
				clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 78, y: 131, alphaThreshold: scale});
				clipnode.addChild(sprite);
				//FloatLabelUtil.comText("step 3333333333");
				this.iconbg.addChild(clipnode,5,345);
				var self = this;
				cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
					if (!error) {
						sprite.setTexture(img);
						sprite.x = 0;
						sprite.y = 0;
						SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,self._playerVo.seat);
					}else{
						cc.log("DTZCardPalyers loadImg error");
						self._iconUrl = "";
					}
				});
			}catch(e){}
		}else{
			//sprite.x = sprite.y = 53;
			SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,this._playerVo.seat);
			sprite.x = 78;
			sprite.y = 128;
			this.iconbg.addChild(sprite,5,345);
		}

		// if(DTZRoomModel.isMoneyRoom()){
		// 	UserLocalDataModel.setOtherUserIconVisible(sprite,null,-0.11);
		// }
	},


	/**
	 * 显示剩余牌数
	 */
	showLastCard:function(){
		if(this.cardBg){
			if(this.cardN){
				this.cardN.setString(this._playerVo.ext[6]);
			}
			cc.log("DTZRoomModel.isShowCardNumber()..." , DTZRoomModel.isShowCardNumber());
			this.cardBg.visible = DTZRoomModel.isShowCardNumber(); //默认改为隐藏
			if(this._playerVo.ext[6] == 0){
				this.cardBg.visible = false;
			}
		}
	},

	fastChat:function(data){
		var id = data.id;
		var sprite = null;
		var label = null;
		var content = "";
		if(id>0){//快捷聊天
			var array = ChatData.dtz_fix_msg;
			content = array[parseInt(id)-1];
		}else{
			if(id<0){//表情
				var armatureJson = "res/plist/faceAM"+data.content+".ExportJson";
				var armatureName = "faceAM"+data.content;
				ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
				var chatArmature = new ccs.Armature(armatureName);
				chatArmature.x = 105;
				chatArmature.y = 75;
				if(this.seq == 2){//最后边的玩家 头像稍微往左边移动些
					chatArmature.x = 45;
				}
				this.iconbg.addChild(chatArmature,22);
				var musicName = "res/audio/fixMsg/emoticon_"+data.content+".mp3";
				AudioManager.play(musicName);
				chatArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
					if (evt == "finish") {
						chatArmature.getAnimation().stop();
						chatArmature.removeFromParent(true);
						//ccs.armatureDataManager.removeArmatureFileInfo(armatureJson);
					}
				});
				chatArmature.getAnimation().play(armatureName, -1, 0);
			}else{
				content = data.content;
			}
		}
		if(content){
			var coords = {1:{x:-50,y:-20},2:{x:50,y:-20},3:{x:-50,y:-20},4:{x:-50,y:-20}};
			var coord = coords[this.seq];
			label = UICtor.cLabel(content,48,null,cc.color("FF361e06"),0,1);
			sprite = new cc.Scale9Sprite("res/res_dtz/images/img_chat_4.png",null,cc.rect(10,10,10,96));
			if(this.seq==2){
				sprite.anchorX=1;sprite.anchorY=0;
			}else{
				sprite.anchorX=sprite.anchorY=0;
			}
			sprite.addChild(label);
			var height = (label.height+45)<96 ? 96 : (label.height+45);
			sprite.setContentSize(label.width+45,height);
			label.x = sprite.width/2;label.y = sprite.height/2;
			this.iconbg.addChild(sprite,20);
			sprite.opacity=0;sprite.x = this.yybg.x+coord.x;sprite.y=this.yybg.y+coord.y;
		}
		if(sprite){
			var self = this;
			if(label){
				label.runAction(cc.sequence(cc.fadeTo(0.3,255),cc.delayTime(2.5),cc.fadeTo(0.8,0)));
			}
			var action = cc.sequence(cc.fadeTo(0.3,255),cc.delayTime(2.5),cc.fadeTo(0.8,0),cc.callFunc(function(){
				self.iconbg.removeChild(sprite);
			}));
			sprite.runAction(action);
		}
	},

	startSpeak:function(){
		if(this.yybg.visible)
			return;
		this.yybg.visible = true;
		this.yybg.setOpacity(0);
		this.yyts.runAction(cc.fadeTo(0.8,255));
		this.yybg.runAction(cc.fadeTo(0.8,255));
	},

	stopSpeak:function(){
		var self = this;
		var action = cc.sequence(cc.fadeTo(0.8,0),cc.callFunc(function(){
			self.yybg.visible = false;
		}))
		this.yyts.runAction(cc.fadeTo(0.8,0));
		this.yybg.runAction(action);
	},

	getAnimationPos:function(direct , animationName){
		cc.log("direct , animationName"  , direct , animationName);
		var renshu = DTZRoomModel.renshu;

		var posx = 55;
		var posy = 65;

		if(animationName == "socialAM7"){//monkey
			posx = 45;
			posy = 50;
		}
		if(animationName == "socialAM4"){//boom
			posx = 40;
			posy = 80;
		}
		if(animationName == "socialAM3"){//ji
			posx = 55;
			posy = 65;
		}
		if(animationName == "socialAM6"){//ice
			posx = 45;
			posy = 85;
		}
		if(animationName == "socialAM5"){//beer
			posx = 50;
			posy = 80;
		}
		if(animationName == "socialAM2"){//fanqie
			posx = 55;
			posy = 80;
		}
		if(animationName == "socialAM1"){//kiss
			posx = 50;
			posy = 70;
		}

		return {x :posx , y:posy};
	},

	playPropArmature:function(temp){
		var armatureName = "socialAM" + temp;
		var armatureJson = "res/plist/" + armatureName + ".ExportJson";
		ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
		var propArmature = new ccs.Armature(armatureName);
		propArmature.x = 55;
		propArmature.y = 55;
		propArmature.anchorX = propArmature.anchorY = 0.5;

		if(this.seq == 4 || this.seq == 5 || this.seq == 6 || this.seq == 7 || this.seq == 8){
			if(temp == 6 || temp == 7) {
				propArmature.y = 30;
				propArmature.x = 50;
			}
		}

		//调整部分特效的播放速度
		if(temp == 5  || temp == 1){//酒杯 和 亲吻 的播放速度放慢
			propArmature.getAnimation().setSpeedScale(0.60);
		}

		if(temp == 7){
			propArmature.setScale(0.7);
		}
		if(temp == 4){
			propArmature.x = 45;
		}

		var posMsg = this.getAnimationPos(this.seq , armatureName);
		propArmature.x = posMsg.x;
		propArmature.y = posMsg.y;

		this.iconbg.addChild(propArmature,100);
		propArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
			if (evt == "finish") {
				propArmature.getAnimation().stop();
				propArmature.removeFromParent(true);
			}
		});
		var musicName = "res/audio/fixMsg/prop"+temp+".mp3";
		AudioManager.play(musicName);
		propArmature.getAnimation().play(armatureName, -1, 0);
	},

	/**
	 * 显示player的状态 准备、要不起
	 */
	showStatus:function(status){
		var tMap ={"-1":"res/res_dtz/images/img_35.png","1":"res/res_dtz/images/img_34.png"};
		var texture = tMap[status];
		var old = this.statusTexture;
		if(status == -1){//要不起
			DTZRoomSound.yaobuqi(this._playerVo.userId);
			this.statusImg.visible = true;
			this.statusImg.loadTexture(texture);
		}else if(status == 1){
			//特殊处理收到准备 隐藏要不起
			this.zbImg.visible = true;
			this.statusImg.visible = false;
			this.zbImg.loadTexture(texture);
		}
		this.statusTexture = texture;

	},

	leaveOrOnLine:function(status){
		if(status == 2){
			this.leave.visible = false;
		}else{
			this.leave.visible = true;
			var texture = (status==1) ? "res/res_dtz/images/img_dx.png" : "res/res_dtz/images/img_zl.png";
			this.leave.loadTexture(texture);
			this.leave.scale = 0.95;
		}
	},

	hideLeaveSp:function(){
		//非托管情况下
		if(this.leave && this.leave.visible && !this.isTuoguan){
			this.leave.visible = false
		}
	},


	setTrusteeship:function(status){
		if(status == 1){//比赛场托管
			this.leave.visible = true;
			var texture = "res/ui/images/match58.png";
			this.leave.loadTexture(texture);
		}else{
			this.leave.visible = false;
		}
	},

	/**
	 * 报停
	 */
	baoting:function(){
		if(this._isBt)
			return;
		if(this.seq != 1){
			var animate = this.bt.getChildByTag(123);
			animate.stop();
			animate.play();
			this.bt.visible = true;
		}
		this._isBt = true;
		DTZRoomModel.baoting(this._playerVo.seat);
		var self = this;
		setTimeout(function(){DTZRoomSound.baoting(self._playerVo.userId)},1000);
	},

	exitRoom:function(){
		this.iconbg.visible = false;
		this.statusImg.visible = false;
		this.zbImg.visible = false;
	},

	updatePoint:function(point){
		cc.log("cur point ..." , point);
		if(DTZRoomModel.isMatchRoom()){
			if(point >= 0){
				this.point.setString(point);
			}else{
				this.point.setString("-" + Math.abs(point));
			}
		}else if(DTZRoomModel.isMoneyRoom()){
			if(point>= 0 && point < 1000000){
				this.point.setString(point);
			}else if(point < 0){
				this.point.setString("-" + Math.abs(point));
			}else{
				this.point.setString(DTZRoomModel.moneyToStr(point));
			}
		}else{
			if(point >= 0){
				this.point.setString("+" + point);
			}else{
				this.point.setString("-" + Math.abs(point));
			}
		}
	},

	updatePointByBomb:function(value , showEffect){
		if(DTZRoomModel.isMoneyRoom() || DTZRoomModel.isMatchRoom()){//金币场 玩家身上的金币数在游戏过程中不发生改变
			return;
		}
		var showEffect = showEffect || false;
		cc.log("当前玩家分数：" , this._playerVo.point , value);
		this._playerVo.point += value;
		if(this._playerVo.point >= 0){
			this.point.setString("+" + this._playerVo.point);
		}else{
			this.point.setString("-" + Math.abs(this._playerVo.point));
		}

		if(showEffect){
			//this.playJettonArmature();
		}

	},

	playJettonArmature:function(){
		if(this.isPlayArmature){
			return;
		}
		this.isPlayArmature = true;
		if(!this.jettonArmature){
			ccs.armatureDataManager.addArmatureFileInfo(
				"res/plist/texiao01.ExportJson");
			this.jettonArmature = new ccs.Armature("texiao01");
			this.jettonArmature.x = -45;
			this.jettonArmature.y = 150;
			this.iconbg.addChild(this.jettonArmature,199);
			this.jettonArmature.getAnimation().setFrameEventCallFunc(function(bone, evt) {
				if(evt == "finish"){
					self.isPlayArmature = false;
					self.jettonArmature.getAnimation().stop();
					self.jettonArmature.visible = false;
				}
			});
		}
		this.jettonArmature.visible = true;
		var self = this;
		this.jettonArmature.getAnimation().play("play",-1,0);
		//AudioManager.play("res/audio/dn/jetton.mp3");
	},

	/**
	 * 拥有的牌
	 * @returns {null}
	 */
	getCards:function(){
		return this._cards;
	},

	deal:function(cards){
		this._cards = cards;
		this.sort();
	},

	sort:function(){
		//var length = this._cards.length;
		var s1 = function(c1,c2){
			var n1 = c1.i;
			var n2 = c2.i;
			if(n1 == n2){
				var t1 = c1.t;
				var t2 = c2.t;
				return t2-t1;
			}else{
				return n2-n1;
			}
		}
		this._cards.sort(s1);
	},

	/**
	 * 显示名次
	 */
	showNumber:function(number){
		if(number >= 4 || number <= 0){
			for(var index = 1 ; index <= 4 ; index++){
				this.getPalyerWidget("mingciSp" + index).visible = false;
			}
			return;
		}
		this._isNoCards = true;//标记为已经出完牌了
		//this.mingciSp.visible = true;
		if(number > 0 && number <= 4){
			this.getPalyerWidget("mingciSp" + number).visible = true;
		}
		//ccui.helper.seekWidgetByName(this.root, "mingciSp" + number).visible = true;
	},

	/**
	 * 影藏名次
	 */
	hideNumber:function(){
		this._isNoCards = false;//标记为未出完牌
		this.lableWinNumber.visible = false;
		for(var index = 1 ; index <= 4 ; index ++){
			this.getPalyerWidget("mingciSp" + index).visible = false
		}
	},

	/**
	 * 准备
	 */
	onReady:function(){
		sySocket.sendComReqMsg(4);
	},


	//增加金币飞行特效的部分接口
	getContainer:function(){
		return this.iconbg;
	},

	pushJettonData:function(jetton){
		this._jettons.push(jetton);
	},

	shiftJettonData:function(){
		var jetton = this._jettons.shift();
		this.removeJetton(jetton);
	},

	removeJetton:function(jetton){
		cc.pool.putInPool(jetton);
		this.root.removeChild(jetton);
	},

	getJettonCount:function(){
		return this._jettons.length;
	},

	cleanJettonData:function(){
		cc.log("调用清理金币效果...",this._jettons.length);
		for(var i = 0 ; i < this._jettons.length ; i ++){
			this.removeJetton(this._jettons[i]);
		}
		this._jettons.length = 0;
	},

	//最后一个金币 额外执行的动作
	playJettonArmature:function(){
		if(this.isPlayArmature){
			return;
		}
	/*	this.isPlayArmature = true;
		if(!this.jettonArmature){
			ccs.armatureDataManager.addArmatureFileInfo(
				"res/plist/texiao01.ExportJson");
			this.jettonArmature = new ccs.Armature("texiao01");
			this.jettonArmature.x = -45;
			this.jettonArmature.y = 150;
			this.iconbg.addChild(this.jettonArmature,199);
			this.jettonArmature.getAnimation().setFrameEventCallFunc(function(bone, evt) {
				if(evt == "finish"){
					self.isPlayArmature = false;
					self.jettonArmature.getAnimation().stop();
					self.jettonArmature.visible = false;
				}
			});
		}
		this.jettonArmature.visible = true;
		var self = this;
		this.jettonArmature.getAnimation().play("play",-1,0);*/
		AudioManager.play("res/res_dtz/dtzSound/jetton.mp3");
	},

	//显示光圈动画

	playerQuanAnimation:function( showOrHide ){
		if(this.quanAnimation == null && this.iconbg.getChildByTag(1314) != null){
			cc.log(".. 玩家断线重连了 其实特效还在 不要重复创建");
		}

		this.quanAnimation = this.iconbg.getChildByTag(1314);

		if(this.quanAnimation == null){
			this.quanAnimation = new AnimateSprite("res/plist/dtz_quan.plist","dtz_quan",1/10);//20s/60帧
			this.quanAnimation.x = this.iconbg.width * 0.5;
			this.quanAnimation.y = this.iconbg.height * 0.5 - 1;
			this.quanAnimation.play();
			this.quanAnimation.setLocalZOrder(5);
			this.quanAnimation.setTag(1314);
			this.quanAnimation.scale = 1.5;
			// if(DTZRoomModel.isMoneyRoom() || DTZRoomModel.isMatchRoom()){
			// 	this.quanAnimation.setScale(0.98);
			// }
			this.iconbg.addChild(this.quanAnimation);
		}else{
			this.quanAnimation.stop();
			this.quanAnimation.play();
			this.quanAnimation.x = this.iconbg.width * 0.5;
			this.quanAnimation.y = this.iconbg.height * 0.5 - 1;
		}
		this.quanAnimation.visible = showOrHide;
	}

});