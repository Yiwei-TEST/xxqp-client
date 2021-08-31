/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {cc.Class}
 */
var WZQPlayer = cc.Class.extend({
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
		cc.log("WZQPlayer",JSON.stringify(vo))
		this._jettons = [];
		//this._teamId = teamId;
		this._teamId = vo.seat;
		this._userId = vo.userId;
		this._status = vo.status;
		this._isBt = false;
		this._iconUrl = "";
		this._playerVo = vo;
		this.seq = seq;
		this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq);
		this.iconbg.temp = vo.seat;
		this.iconbg.visible = true;
		this.root = root;

		this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
		this.cardBg = ccui.helper.seekWidgetByName(this.iconbg,"cardBg");
		if(this.cardBg){
			this.cardN=ccui.helper.seekWidgetByName(this.iconbg,"cardN");
			this.cardBg.visible=false;
		}
		//this.name.setString(vo.name);
		this.setPalyerName(vo.name);
		this.statusTexture = "";
		this.bt = ccui.helper.seekWidgetByName(root,"bt" + seq);

		this.leave = ccui.helper.seekWidgetByName(root,"zl" + seq);
		this.leave.visible = false;

		this.lableWinNumber = ccui.helper.seekWidgetByName(root,"lable_WinNumber" + seq);

		this.Image_scorebg = ccui.helper.seekWidgetByName(root,"Image_scorebg" + seq);
		this.Image_scorebg.visible = false
		this.Image_qi = ccui.helper.seekWidgetByName(root,"Image_qi" + seq);
		this.lableCreditScore = ccui.helper.seekWidgetByName(root,"lableCreditScore" + seq);
		this.Image_qizi = ccui.helper.seekWidgetByName(root,"Image_qizi" + seq);
		var str = WZQRoomModel.nextSeat == this._playerVo.seat ? "heizi.png" : "baizi.png"
		this.Image_qizi.loadTexture("res/res_wzq/"+str)
		this.Image_qizi.visible = false
		this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
		this.fangzhu = ccui.helper.seekWidgetByName(root,"fangzhu" + seq);
		this.fangzhu.visible = vo.ext[2]==1;
		if(this._playerVo.ext[0] != 0)this.showScore()

        //var isCredit = WZQRoomModel.isCreditRoom();
        //
        //if (isCredit){
			//if(WZQRoomModel.getIsSwitchCoin()){
			//	this.showHeadFrame()
			//}else {
			//}
        //}

		//加载额外信息 并且刷新玩家显示
		this.loadPlayerExtData(vo);

		this._cards = [];
		this.showIcon();
		this.refreshAllScore();
	},

	showFangZhu:function(){
		this.fangzhu.visible = true
	},

	showScore:function(score){
		this.Image_scorebg.visible = true;
		score = score || this._playerVo.ext[0]
		var str = score == 1 ? "sai.png" : "qi.png"
		this.Image_qi.loadTexture("res/res_wzq/"+str)
		this.lableCreditScore.setString(WZQRoomModel.intParams[8]/100+"")
	},

	showChessImg:function(chess){
		this.Image_qizi.visible = true;
		var str = WZQRoomModel.nextSeat == this._playerVo.seat ? "heizi.png" : "baizi.png"
		if(chess){
			str = chess == -1 ? "heizi.png" : "baizi.png"
		}
		this.Image_qizi.loadTexture("res/res_wzq/"+str)
	},

	playerQuanAnimation:function( showOrHide ){
		if(this.quanAnimation == null && this.iconbg.getChildByTag(1314) != null){
			cc.log(".. 玩家断线重连了 其实特效还在 不要重复创建");
		}
		this.quanAnimation = this.iconbg.getChildByTag(1314);

		if(this.quanAnimation == null){
			var armatureJson = "res/res_phz/plist/txklq/txklq.ExportJson";
			ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
			this.quanAnimation = new ccs.Armature("txklq");
			this.quanAnimation.getAnimation().play("txlk", -1, -1);
			this.quanAnimation.x = 45;
			this.quanAnimation.y = this.iconbg.height * 0.5;
			this.quanAnimation.setLocalZOrder(5);
			this.quanAnimation.setTag(1314);
			this.iconbg.addChild(this.quanAnimation);
		}else{
			this.quanAnimation.x = 45;
			this.quanAnimation.y = this.iconbg.height * 0.48;
		}
		this.quanAnimation.visible = showOrHide;
	},

	addWinArmature:function(){
		ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/wzq_shengli/shengli.ExportJson");
		var kaishi = new ccs.Armature("shengli");
		kaishi.setPosition(this.iconbg.width/2,250);
		kaishi.getAnimation().play("Animation1",-1,0);
		kaishi.setScale(0.8)
		this.iconbg.addChild(kaishi, 2);
		kaishi.getAnimation().setFrameEventCallFunc(function (bone, evt) {
			if (evt == "finish") {
				kaishi.getAnimation().stop();
				kaishi.removeFromParent(true);
				ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/wzq_shengli/shengli.ExportJson");
			}
		});
	},
	/**
	 * 更新积分
	 * @param point
	 */
	updatePoint:function(point){
		this.point.setString(point);
	},

	showHeadFrame:function(){
		if(this._playerVo.frameId > 0){
			var img = "res/ui/bjdmj/popup/pyq/playerinfo/img_vip_head_frame_"+this._playerVo.frameId+".png"
			this.headFrame = this.iconbg.getChildByName("headFrame")
			if(!this.headFrame){
				this.headFrame = new cc.Sprite();
				this.iconbg.addChild(this.headFrame,20)
				this.headFrame.setPosition(cc.p(this.iconbg.width / 2, this.iconbg.height / 2+20))
				this.headFrame.setName("headFrame")
			}
			this.headFrame.setTexture(img)
		}
	},

	refreshAllScore:function(){
		var team = "";
		if(this._teamId == 1){
			team = "a";
		}else if(this._teamId == 2){
			team = "b";
		}else{
			team = "c";
		}
	},

	refreshAllXiScore:function(){
		var team = "";
		if(this._teamId == 1){
			team = "a";
		}else if(this._teamId == 2){
			team = "b";
		}else{
			team = "c";
		}
		//this.xifen.setString(WZQRoomModel[team+"TeamTongziScore"]);
		//this.zongxifen.setString(WZQRoomModel[team+"TeamTotalXiScore"]);
	},

	loadPlayerExtData: function(message){

		//this._teamId = message.ext[0];
		this.mingci = message.ext[3];
		//this.curzongjifen = message.ext[2];
		//this.isFirstOut = message.ext[3];
		this.isMaster = message.ext[1];
		//this.isTuoguan = message.ext[7];
		//this.updateTuoguan(this.isTuoguan);
		//cc.log("QFCardPlay message.ext..." , message.ext);
		//cc.log("message.ext ... " , message.ext[0] , message.ext[1], message.ext[2] , message.ext[3] , message.ext[4]);
		//cc.log("this.curzongjifen..." , this.curzongjifen);
		//if(this.mingci != null){
		//	this.showNumber(this.mingci);
		//}
		//this.creatorSign.visible = this.isMaster;
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
			//cc.log("当前显示的文字为 " + tName + "宽度为:" + tWidth + "");
			if(tWidth >= 75){
				showName = nameString.substring(0 , curLenght - 1);
				//cc.log("实际显示的文字为:" + showName);
				break;
			}
		}

		this.name.setString(showName);
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

	setTeamId:function (_id){
		this._teamId = _id;
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
		//this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
		//为什么这个在模拟器上会闪退
		var url = this._playerVo.icon;
		var defaultimg = "res/res_wzq/default_m.png";
		if(!url)
			url = defaultimg;
		if(this._iconUrl == url)
			return;
		if(this.iconbg.getChildByTag(345))
			this.iconbg.removeChildByTag(345);
		this._iconUrl = url;
		var sprite = new cc.Sprite(defaultimg);
		if(this._playerVo.icon){
			sprite.x = sprite.y = 0;
			try{
				var scale = 1;
				var sten = new cc.Sprite("res/res_wzq/default_m.png");
				var clipnode = new cc.ClippingNode();
				clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: sprite.width/2+2, y: sprite.height/2, alphaThreshold: scale});
				clipnode.addChild(sprite);
				clipnode.setName("headspr")
				this.iconbg.addChild(clipnode,0,345);
				var self = this;
				cc.loader.loadImg(this._playerVo.icon, {width: 142, height: 143}, function (error, img) {
					if (!error) {
						sprite.setTexture(img);
						sprite.x = 0;
						sprite.y = 0;
						SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,self._playerVo.seat);
					}else{
						self._iconUrl = "";
					}
				});
			}catch(e){}
		}else{
			sprite.setName("headspr")
			SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,this._playerVo.seat);
			sprite.x = sprite.width/2+2;
			sprite.y = sprite.height/2;
			this.iconbg.addChild(sprite,0,345);
		}
	},

	/**
	 * 显示剩余牌数
	 */
	showLastCard:function(){
		if(this.cardBg){
			if(this.cardN){
				this.cardN.setString(this._playerVo.ext[0]);
			}
			//cc.log("WZQRoomModel.isShowCardNumber()..." , WZQRoomModel.isShowCardNumber());
			this.cardBg.visible = WZQRoomModel.isShowCardNumber(); //默认改为隐藏
			//if(this._playerVo.ext[0] == 0){
			//	this.cardBg.visible = false;
			//}
		}
	},

	fastChat:function(data){
		var id = data.id;
		var sprite = null;
		var label = null;
		var content = "";
		//cc.log("data:::"+JSON.stringify(data))
		if(id>0){//快捷聊天
			var array = ChatData.qf_fix_msg;
			content = array[parseInt(id)-1];
		}else{
			if(id<0){//表情
				var armatureJson = "res/plist/faceAM"+data.content+".ExportJson";
				var armatureName = "faceAM"+data.content;
				ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
				var chatArmature = new ccs.Armature(armatureName);
				chatArmature.x = 70;
				chatArmature.y = 50;
				if(this.seq == 2){//最后边的玩家 头像稍微往左边移动些
					chatArmature.x = 30;
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
			label = UICtor.cLabel(content,42,null,cc.color("FF361e06"),0,1);
			sprite = new cc.Scale9Sprite("res/res_yjqf/images/img_chat_4.png",null,cc.rect(30,0,10,64));
			if(this.seq==2){
				sprite.anchorX=1;sprite.anchorY=0;
			}else{
				sprite.anchorX=sprite.anchorY=0;
			}
			sprite.addChild(label);
			var height = (label.height+45)<96 ? 96 : (label.height+45);
			sprite.setContentSize(label.width+30,height);
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
		//cc.log("direct , animationName"  , direct , animationName);
		var renshu = WZQRoomModel.renshu;

		var posx = 55;
		var posy = 65;

		if(animationName == "socialAM7"){//monkey
			posx = 75;
			posy = 60;
		}
		if(animationName == "socialAM4"){//boom
			posx = 60;
			posy = 80;
		}
		if(animationName == "socialAM3"){//ji
			posx = 75;
			posy = 65;
		}
		if(animationName == "socialAM6"){//ice
			posx = 65;
			posy = 85;
		}
		if(animationName == "socialAM5"){//beer
			posx = 75;
			posy = 80;
		}
		if(animationName == "socialAM2"){//fanqie
			posx = 75;
			posy = 80;
		}
		if(animationName == "socialAM1"){//kiss
			posx = 75;
			posy = 70;
		}

		return {x :posx , y:posy};
	},

	playPropArmature:function(temp){
		var armatureName = "socialAM" + temp;
		var armatureJson = "res/plist/" + armatureName + ".ExportJson";
		ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
		var propArmature = new ccs.Armature(armatureName);
		propArmature.x = 65;
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
		var tMap ={"-1":"res/res_yjqf/images/img_35.png","1":"res/res_yjqf/images/img_34.png"};
		var texture = tMap[status];
		var old = this.statusTexture;
		if(status == -1){//要不起
			QFRoomSound.yaobuqi(this._playerVo.userId);
			this.statusImg.visible = true;
			this.statusImg.loadTexture(texture);
			var self = this;
			setTimeout(function(){//延时显示取消托管
                self.statusImg.visible = false;
            },1000);
		}else if(status == 1){
			//this.zbImg.visible = true;
			//this.zbImg.loadTexture(texture);
		}
		this.statusTexture = texture;

	},

	leaveOrOnLine:function(status){
		if(status == 2){
			this.leave.visible = false;
		}else{
			this.leave.visible = true;
		}
	},

	exitRoom:function(){
		this.name.setString("")
		this.iconbg.getChildByName("headspr").removeFromParent(true)
		if(this.iconbg.getChildByTag(345))this.iconbg.getChildByTag(345).removeFromParent(true)
		this.Image_scorebg.visible = false
		if(this.Label_coin) this.Label_coin.setVisible(false)
		if(this.headFrame) this.headFrame.setVisible(false)
		this.fangzhu.visible = false
	},

	updatezongjifen:function(zongjifen){
		//this.zongjifen.setString(zongjifen);
	},

	updatezongjifenByBomb:function(value , showEffect){
		var showEffect = showEffect || false;
		//cc.log("当前玩家分数：" , this._playerVo.ext[4]);
		//if(this._playerVo.zongjifen >= 0){
		//	this.zongjifen.setString(this._playerVo.ext[4]);
		//}else{
		//	this.zongjifen.setString(Math.abs(this._playerVo.ext[4]));
		//}

		//if(showEffect){
		//	//this.playJettonArmature();
		//}

	},

	//playJettonArmature:function(){
	//	if(this.isPlayArmature){
	//		return;
	//	}
	//	this.isPlayArmature = true;
	//	if(!this.jettonArmature){
	//		ccs.armatureDataManager.addArmatureFileInfo(
	//			"res/plist/texiao01.ExportJson");
	//		this.jettonArmature = new ccs.Armature("texiao01");
	//		this.jettonArmature.x = -45;
	//		this.jettonArmature.y = 150;
	//		this.iconbg.addChild(this.jettonArmature,199);
	//		this.jettonArmature.getAnimation().setFrameEventCallFunc(function(bone, evt) {
	//			if(evt == "finish"){
	//				self.isPlayArmature = false;
	//				self.jettonArmature.getAnimation().stop();
	//				self.jettonArmature.visible = false;
	//			}
	//		});
	//	}
	//	this.jettonArmature.visible = true;
	//	var self = this;
	//	this.jettonArmature.getAnimation().play("play",-1,0);
	//	//AudioManager.play("res/audio/dn/jetton.mp3");
	//},

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
		if(number > 0 && number <= 3){
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
		//cc.log("调用清理金币效果...",this._jettons.length);
		for(var i = 0 ; i < this._jettons.length ; i ++){
			this.removeJetton(this._jettons[i]);
		}
		this._jettons.length = 0;
	},

	//最后一个金币 额外执行的动作
	/*playJettonArmature:function(){
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
		AudioManager.play("res/res_dtz/dtzSound/jetton.mp3");
	},*/

	//显示光圈动画

	playerQuanAnimation:function( showOrHide ){
		if(this.quanAnimation == null && this.iconbg.getChildByTag(1314) != null){
			//cc.log(".. 玩家断线重连了 其实特效还在 不要重复创建");
		}

		this.quanAnimation = this.iconbg.getChildByTag(1314);
		if(this.quanAnimation == null){
			this.quanAnimation = new AnimateSprite("res/plist/kuang.plist","kuang",1/8);//20s/60帧
			this.quanAnimation.scale = 3;
			this.quanAnimation.setLocalZOrder(15);
			this.quanAnimation.setTag(1314);
			this.iconbg.addChild(this.quanAnimation);
		}else{
			this.quanAnimation.stop();
		}
		this.quanAnimation.play();
		this.quanAnimation.x = this.iconbg.width * 0.5;
		this.quanAnimation.y = this.iconbg.height * 0.5+2;
		this.quanAnimation.visible = showOrHide;
	}

});