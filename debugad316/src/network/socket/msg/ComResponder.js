/**
 * Created by zhoufan on 2016/1/9.
 */
var ComResponder = BaseResponder.extend({
	respond:function(message) {
		var code = message.code;
		// cc.log("ComResponder::"+JSON.stringify(message));
		cc.log("ComResponder code::",code);

		switch (code) {
			case 2000://长链接登录成功回调
				if (message.strParams.length > 0) {
					var obj = JSON.parse(message.strParams[0]);
					SyEventManager.dispatchEvent(SyEvent.SOCKET_LOGIN_SUCCESS, obj);
				}
				//用http方便后台获取ip
				Network.startIpReq();
				break;
			case 2001://长链接登录异常回调
				//登录异常提示
				sy.scene.hideLoading();
				if (message.strParams.length > 0) {
					var obj = JSON.parse(message.strParams[0]);
					if(obj.code){
						if(obj.code==2017){//版本过低，退出游戏重新进
							AlertPop.showOnlyOk(obj.msg,function(){
								if(cc.sys.os == cc.sys.OS_IOS){
									ios_sdk_exit();
								}else{
									cc.director.end();
								}
							});
						}else if (obj.code==2018) {
							WXHelper.cleanCache();
							//AlertPop.showOnlyOk("登录失败，请重新尝试!");
						}else{
							AlertPop.showOnlyOk(obj.msg);
						}
					}else{
						AlertPop.showOnlyOk("登录失败，请重新尝试!");
					}
				}
				break;
			case 0://通用提示
				if(message.strParams.length>0){
					FloatLabelUtil.comText(message.strParams[0]);
				}
				break;
			case 1:
				if (NetErrorPopData.mc){
					NetErrorPopData.mc.onSuc()
				}
				if(PopupManager.hasClassByPopup(AlertPop)){
					PopupManager.removeClassByPopup(AlertPop);
				}
				if(message.strParams.length==0 && message.strParams.length==0) return
				if(message.strParams[7]){
					SyEventManager.dispatchEvent(SyEvent.UPFATE_SERVER_TIME,message.strParams[7]);
				}
				SyEventManager.dispatchEvent("XIPAI_CLEAR_NODE");
				sySocket.isCrossServer = false;
				IMSdkUtil.gotyeRestoreFinish = true;
				PingClientModel.connectSuc();

				//是否开放可以创建亲友圈
				PlayerModel.canCreateClub = message.params[9] == 1;
				//是否开放赠送钻石
				PlayerModel.canZszs = message.params[10] == 1;
                /** 是否开放业务员权限 **/
				PlayerModel.isAgenter = message.params[13] == 1;
				/** 是否已经绑定 **/
				PlayerModel.isHasBind = message.params[12] == 0;
				PlayerModel.canPowerManage = message.params[11] == 1;
				SyEventManager.dispatchEvent("Set_Agent_button");

				if(message.strParams[11]){//是否在娱乐场匹配数据
					var temp = message.strParams[11].split("|");
					CheckJoinModel.enterMatch(Number(temp[0]),Number(temp[1]),Number(temp[2]));
				}else{
					if(LayerManager.isInRoom() && BaseRoomModel.curRoomData
						&& BaseRoomModel.curRoomData.isClientData
						&& !CheckJoinModel.needJoinTable && !CheckJoinModel.needJoinMatch){
						CheckJoinModel.backToHall();
					}
					//娱乐场切后台牌局结束需要退出
					var roomId = parseInt(message.strParams[0]);
					if(roomId == 0 && LayerManager.isInRoom() && BaseRoomModel.curRoomData
						&& BaseRoomModel.curRoomData.tableType ==3
						&& !CheckJoinModel.needJoinTable && !CheckJoinModel.needJoinMatch){
						CheckJoinModel.backToHall();
					}
				}

				var urlScheme = "";
				var roomId = 0;
				var matchRoomId = 0;
				var matchTime = 0;
				GameData.channelId = message.strParams[5] || 0;
				var headimgurl = message.strParams[10];
				PlayerModel.headimgurl = headimgurl;
				SyEventManager.dispatchEvent(SyEvent.UPDATE_NAME_CHANGE);
				if(message.strParams.length>0){
					roomId = parseInt(message.strParams[0]);
					matchRoomId = parseInt(message.strParams[3]);
					PlayerModel.correctCoin(message.strParams[9]);
					if(LayerManager.getCurrentLayer() == LayerFactory.HOME){
						sySocket.sendComReqMsg(137 , [] , [] , 5);
						// LayerManager.getCurrentLayerObj().onGoldUpdate();
					}
					if (matchRoomId || parseInt(matchRoomId) > 0){
						if(PopupManager.hasClassByPopup(MacthTipPop)){
							SyEventManager.dispatchEvent(SyEvent.REMOVE_MATCH_LOADING,{});
							//PopupManager.removeClassByPopup(MacthTipPop);
						}
						if(PopupManager.hasClassByPopup(PyqHall)){
							PopupManager.removeClassByPopup(PyqHall);
						}
						if (message.params[8]){
							matchTime = message.params[8];
						}
						var matchData = {};
						matchData.matchClubId = matchRoomId;
						matchData.matchTime = matchTime;
						var mc = new PyqHall();
						PopupManager.addPopup(mc);
					}else if(roomId > 0){
						sySocket.sendComReqMsg(1,[]);
					}else if(roomId==0){
						if(LayerManager.isInRoom()){//可能还在房间里面或者登陆界面
							if(PopupManager.hasClassByPopup(AlertPop)){
								PopupManager.removeClassByPopup(AlertPop);
							}
							if(LayerManager.isInDTZ() && DTZRoomSetPop && PopupManager.hasClassByPopup(DTZRoomSetPop)){
								PopupManager.removeClassByPopup(DTZRoomSetPop);
							}
							if(PopupManager.hasClassByPopup(AlertPopRichText)){
								PopupManager.removeClassByPopup(AlertPopRichText);
							}
							SyEventManager.dispatchEvent(SyEvent.DISAGREE_APPLYEXITROOM);
							if(PopupManager.hasClassByPopup(ApplyExitRoomPop)){
								PopupManager.removeClassByPopup(ApplyExitRoomPop);
							}

							if((LayerManager.isInDTZ() && !DTZRoomModel.isMoneyRoom()  && !DTZRoomModel.isMatchRoom()) ||
								(LayerManager.isInPDK() && !PDKRoomModel.isMoneyRoom() && !PDKRoomModel.isMatchRoom() && !PDKRoomModel.isGoldMatchRoom()) ||
								(LayerManager.isInPHZ() && !PHZRoomModel.isMoneyRoom()) || (LayerManager.isInHBGZP() &&
								!HBGZPRoomModel.isMoneyRoom()) || (LayerManager.isInXPLP() &&
								!XPLPRoomModel.isMoneyRoom())){//非金币场模式才提示
								// FloatLabelUtil.comText("您的房间已解散");
								LayerManager.showLayer(LayerFactory.HOME);
							}
						}else if(LayerManager.getCurrentLayer()==LayerFactory.LOGIN){//防止在登录界面卡死的情况
							LayerManager.showLayer(LayerFactory.HOME);
						}
					}
					var setup = message.strParams[1];
					if(setup){
						setup = setup.split(",");
						var setup0 = parseInt(setup[0])==0 ? 0 : 50;
						var setup1 = parseInt(setup[1])==0 ? 0 : 50;
						PlayerModel.isMusic = setup[2] ? parseInt(setup[2]) : setup0;
						PlayerModel.isEffect = setup[3] ? parseInt(setup[3]) : setup1;
						var bgMusic = PlayerModel.musicType = setup[4] ? parseInt(setup[4]) : 2;
						if(LayerManager.isInRoom()){
							bgMusic = 2;
							if (LayerManager.isInPHZ()){
								bgMusic = 3;
							}


						}else{
							bgMusic = 1;

						}
						AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,bgMusic);
					}
					urlScheme = message.strParams[2];
				}
				SyEventManager.dispatchEvent(SyEvent.SOCKET_OPENED,{urlscheme:urlScheme,roomId:roomId});
				if(message.params.length>0){
					var param0 = message.params[0];
					var param1 = message.params[3];
					cc.log("当前的钻石 ， 金币" , param0 , param1);
					PlayerModel.correctCards(param0);
					PlayerModel.correctCoin(param1);
				}
				if(message.strParams[6]){
					PlayerModel.correctClubCoin(message.strParams[6]);
				}
				if(message.strParams[12]){
					var tempData = message.strParams[12];
					if(typeof tempData == "string"){
						tempData = JSON.parse(tempData);
					}
					PlayerModel.otherDataObj = tempData;
				}
				break;
			case 2://牌桌上的成员状态改变
				SyEventManager.dispatchEvent(SyEvent.PLAYER_STATUS_CHANGE,message);
				SyEventManager.dispatchTableEvent("ChangeState",message);
				break;
			case 213:/** 溆浦老牌出牌错误 **/
				SyEventManager.dispatchEvent("XPLP_THROW_ERROR",message);
				break;
			//case 214:/** 永州老抽出牌错误 **/
			//	SyEventManager.dispatchEvent("YZLC_THROW_ERROR",message);
			//	break;
			case 3://错误提示
				sy.scene.hideLoading();
				if(message.params.length>0){
					var param0 = message.params[0];
					var param1 = message.strParams[0];
					if(param0==1){//账号冲突
						GameData.conflict = true;
						if (!param1 || param1 == GameData.channelId){
							AlertPop.showOnlyOk("帐号冲突，请重新登录！",function(){
								sy.scene.exitGame();
							})
						}
						return;
					}else if(param0==2){//登录自动进入房间失败
						LayerManager.showLayer(LayerFactory.HOME);
					}else if(param0==3){//checkcode错误
						NetErrorPop.show(true);
					}else if(param0==4){//通用弹框错误
						if(message.strParams.length>0) {
							AlertPop.showOnlyOk(message.strParams[0]);
							return;
						}
					}else if(param0==97){//取消快速匹配界面
						var stateParams = [0];
						SyEventManager.dispatchEvent(SyEvent.CLUB_SHOW_MATCH_TIP,stateParams);
					}else if(param0==100){
						AlertPop.showOnlyOk(message.strParams[0]);
					}else if(param0 > 99){
						//掉线情况 打牌人的手牌
						SyEventManager.dispatchEvent(SyEvent.REFRESH_HANDLES,message.params);
					}
				}else{ //李周说要这么弄
					SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
				}

				if(message.strParams.length>0){
					if(message.strParams[0] == "白金豆不足"){
						AlertPop.show("您的白金豆不足\n是否去商城兑换白金豆",function(){
							if(PlayerModel.payBindId){
								var popLayer = new ShopPop(3);
								PopupManager.addPopup(popLayer);
							}else{
								var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
								PopupManager.addPopup(pop);
							}
						});
					}else{
						FloatLabelUtil.comText(message.strParams[0]);
					}
				}
				break;
			case 4://解散房间的提醒
				if(!LayerManager.isInRoom()){
					cc.log("玩家已经不再房间了 不在清理弹出框 也不在构建弹出框！！！！！！！！！！！！！！");
					return;
				}
				if(PopupManager.hasClassByPopup(AlertPopRichText))
					PopupManager.removeClassByPopup(AlertPopRichText);

				if(PopupManager.hasClassByPopup(ApplyExitRoomPop))
					PopupManager.removeClassByPopup(ApplyExitRoomPop);

				var isPHZ = (LayerManager.isInPHZ());
				var isPDK = (LayerManager.getCurrentLayer()==LayerFactory.PDK_ROOM);
				var isDTZ = (LayerManager.getCurrentLayer()==LayerFactory.DTZ_ROOM);
                var isHBGZP = (LayerManager.isInHBGZP());
				var isXPLP = (LayerManager.isInXPLP());
				var isInMJ = (LayerManager.isInMJ());
				var isInSYMJ = (LayerManager.isInSYMJ());
				var isInYZWDMJ = (LayerManager.isInYZWDMJ());
				var gameType = -1;//1 打筒子 2 跑胡子 3跑得快
				if(isPHZ){
					gameType = 2;
				}else if(isPDK){
					gameType = 3;
				}else if(isDTZ){
					gameType = 1;
				}else if(isInMJ){
					gameType = 221;
				}else if(isInSYMJ){
					gameType = 223;
				}else if(isInYZWDMJ){
					gameType = 193;
				}else if(isHBGZP){
					gameType = 247;
				}else if(isXPLP){
					gameType = 805;
				}
				SyEventManager.dispatchEvent(SyEvent.DISAGREE_APPLYEXITROOM);
				ApplyExitRoomModel.init(message);
				var mc = new ApplyExitRoomPop(gameType);
				//PopupManager.addPopup(mc);
				sy.scene.floatlayer.addChild(mc);

				break;
			case 5://确认解散房间
				var wanfa = message.params[0];
				var isClubRoom = message.params[1];
				var curCount = 1;
				if(message.params.length >= 3){
					curCount = message.params[2];
				}
				cc.log("curCount..." , curCount);
				SyEventManager.dispatchEvent(SyEvent.DISAGREE_APPLYEXITROOM);
				if(PopupManager.hasClassByPopup(ApplyExitRoomPop)){
					PopupManager.removeClassByPopup(ApplyExitRoomPop);
				}
				//是否是挑战赛房间
				var isSoloRoom = (message.strParams[0] == 4);

				if(PopupManager.hasClassByPopup(AlertPop)){
					PopupManager.removeClassByPopup(AlertPop);
				}

				if(ClubRecallDetailModel.isPDKWanfa(wanfa) && PopupManager.hasClassByPopup(PDKRoomSetPop)){
					PopupManager.removeClassByPopup(PDKRoomSetPop);
				}

				if(ClubRecallDetailModel.isDTZWanfa(wanfa) && PopupManager.hasClassByPopup(DTZRoomSetPop)){
					PopupManager.removeClassByPopup(DTZRoomSetPop);
				}

				if(ClubRecallDetailModel.isPHZWanfa(wanfa) && PopupManager.hasClassByPopup(PHZSetUpPop)){
					PopupManager.removeClassByPopup(PHZSetUpPop);
				}

				if(ClubRecallDetailModel.isQFWanfa(wanfa) && PopupManager.hasClassByPopup(QFRoomSetPop)){
					PopupManager.removeClassByPopup(QFRoomSetPop);
				}

				if(ClubRecallDetailModel.isYZLC(wanfa) && PopupManager.hasClassByPopup(YZLCShowChuoPop)){
					PopupManager.removeClassByPopup(YZLCShowChuoPop);
				}

				var isReleaseFromRoom = (LayerManager.getCurrentLayer() != LayerFactory.HOME);//是否是从房间内请求解散

				if(isSoloRoom){
					LayerManager.showLayer(LayerFactory.GOLD_LAYER);
				}else{
					LayerManager.showLayer(LayerFactory.HOME);
				}

				if(isClubRoom > 0 && isReleaseFromRoom == false  ){//wan
					SyEventManager.dispatchEvent(SyEvent.CLUB_DELETE_ONE, {});
					//cc.log("从俱乐部直接解散 刷新即可...");
				}else if(isClubRoom > 0 && curCount == 0 && isReleaseFromRoom && message.params[0] != GameTypeEunmZP.ZZPH && message.params[0] != GameTypeEunmPK.QF){//是从俱乐部大厅解散的 直接刷新即可
					PopupManager.removeClassByPopup(PyqHall);
					var mc = new PyqHall();
					PopupManager.addPopup(mc);
					//cc.log("从俱乐部房间内解散 直接打开俱乐部界面...");
				}

				IMSdkUtil.sdkLoginOutRoom();
				GPSModel.hasClickGpsBtn = false;
				break;

			case 6://有人不同意解散
				SyEventManager.dispatchEvent(SyEvent.DISAGREE_APPLYEXITROOM);
				if(PopupManager.hasClassByPopup(ApplyExitRoomPop))
					PopupManager.removeClassByPopup(ApplyExitRoomPop);
				var userId = message.strParams[0];
				var name = message.strParams[1];
				if(PlayerModel.userId != userId){
					AlertPop.showOnlyOk(name+" 不同意解散房间！")
				}
				SyEventManager.dispatchEvent(SyEvent.SHOW_ZHANKAI);
				break;
			case 7://快捷聊天
				if(message.params[2]>0){
					var seat = message.params[2];
					var userId= message.strParams[0];
					var content = message.strParams[1];
					SyEventManager.dispatchEvent(SyEvent.DOUNIU_INTERACTIVE_PROP, {seat: seat, userId: userId, content: content});
				}else {
					var id = message.params[0];
					var userId = message.strParams[0];
					var content = "";
					if (id > 0) {
						if (LayerManager.isInDTZ()) {
							DTZRoomSound.fixMsg(userId, id);
						}else if(LayerManager.isInPDK()){
							PDKRoomSound.fixMsg(userId , id);
						}else if(LayerManager.isInPHZ()){
							PHZRoomSound.fixMsg(userId,id);
						}else if(LayerManager.isInHBGZP()){
							PHZRoomSound.hbgzpFixMsg(userId,id);
						}else if(LayerManager.isInMJ()){
							MJRoomSound.fixMsg(userId,id);
						}else if (LayerManager.getCurrentLayer() == LayerFactory.QF_ROOM) {
							QFRoomSound.fixMsg(userId,id);
						}
					} else {
						content = message.strParams[1];
					}
					SyEventManager.dispatchEvent(SyEvent.ROOM_FAST_CHAT, {id: id, userId: userId, content: content});
				}
				break;
			case 8://离线状态通知
				SyEventManager.dispatchEvent(SyEvent.ONLINE_OFFLINE_NOTIFY , message.params);
				SyEventManager.dispatchTableEvent("ChangeOnLine",message.params);
				break;
			case 9://结算确认消息
				SyEventManager.dispatchEvent(SyEvent.SETTLEMENT_SUCCESS);
				break;
			case 10://房卡更新
				var value = message.params[0];
				PlayerModel.updateCards(value);
				break;
			case 11://幸运抽奖
				var data = {};
				if(message.params && message.strParams){
					data.turnNum = message.params[0];
					data.loginDays = message.params[1];
					data.costCards = message.strParams[0];
					data.awardList = JSON.parse(message.strParams[1]);
					LuckDrawModel.init(data);
				}
				var mc = new LuckDrawPop();
				PopupManager.addPopup(mc);
				break;
			case 12://抽奖转盘数值
				if(message.params){
					LuckDrawModel.updataLuckDrawNum(message.params[0]);
					LuckDrawModel.updataTurnNum(message.params[1]);
				}
				SyEventManager.dispatchEvent(SyEvent.LUCKDRAW_TURNNMU);
				break;
			case 13://领取登录奖励
				if(message.params){
					if(message.params[0] == 1){
						if(message.strParams){
							LuckDrawModel.updataAwardList(JSON.parse(message.strParams));
						}
					}
				}
				SyEventManager.dispatchEvent(SyEvent.LUCKDRAW_AWARD);
				break;
			case 14://退出房间
				var wanfa = message.params[0];
				// cc.log("玩家退出房间" , message.strParams[0]);
				if(ClubRecallDetailModel.isPDKWanfa(wanfa) && PopupManager.hasClassByPopup(PDKRoomSetPop)){
					PopupManager.removeClassByPopup(PDKRoomSetPop);
				}

				SyEventManager.dispatchEvent(SyEvent.REMOVE_SET_POP);
				var userId = message.strParams[0];
				var isGold = (Number(message.strParams[1]) == 3);
				// var isHavaGoldRoomData = GoldRoomConfigModel.curAreaRoomConfig.length > 0;
				//是否是挑战赛房间
				var isSolo = (Number(message.strParams[1]) == 4);
				var isClubRoom = message.params[3] || 0;
				var isPDK = (LayerManager.isInPDK());
				var isPHZ = LayerManager.isInPHZ();
				var isMJ = (LayerManager.isInMJ());
				var isHBGZP = LayerManager.isInHBGZP();
				var isWZQ = LayerManager.isInWZQ();
				if(userId == PlayerModel.userId){
					GPSModel.hasClickGpsBtn = false;
					// if (isHavaGoldRoomData && (isGold || isSolo)){
						// LayerManager.showLayer(LayerFactory.GOLD_LAYER);
					// }else{
						LayerManager.showLayer(LayerFactory.HOME);
						// cc.log("isClubRoom.." , isClubRoom);
						if(isClubRoom && isClubRoom > 0){//是俱乐部房间
							if(!PopupManager.hasClassByPopup(PyqHall)){
								var mc = new PyqHall();
								PopupManager.addPopup(mc);
							}
						}
						IMSdkUtil.sdkLoginOutRoom();
					// }
				}else{
					if(isPHZ){
						PHZRoomModel.exitRoom(userId);
					}else if(isHBGZP){
						HBGZPRoomModel.exitRoom(userId);
					}else if(isPDK){
						if(PopupManager.hasClassByPopup(PDKRoomSetPop)){
							PopupManager.removeClassByPopup(PDKRoomSetPop);
						}
						PDKRoomModel.exitRoom(userId);
					}else if(isMJ){
						MJRoomModel.exitRoom(userId);
					}else if(isWZQ){
						WZQRoomModel.exitRoom(userId);
					}else{
						(typeof DTZRoomModel !== "undefined") && DTZRoomModel.exitRoom(userId);
					}
					SyEventManager.dispatchTableEvent("ExitTable",userId);
				}

				break;
			case 15://服务器重启
				//AlertPop.showOnlyOk(message.strParams[0]);
				break;
			case 16://战绩
				break;
			case 17://弹出 海底选择框
				SyEventManager.dispatchEvent(SyEvent.CS_HAIDI,message);
				break;
			case 60://刷新玩家信息
				var headimgurl = message.strParams[0];
				PlayerModel.headimgurl = headimgurl;
				SyEventManager.dispatchEvent(SyEvent.UPDATE_NAME_CHANGE);
				break;
			case 61://娱乐场匹配超时离开匹配推送

				var str = "由于长时间未匹配到玩家由于长时间未匹配到玩家,确认是否继续等待,取消请自行选择场次进行匹配";
				AlertPop.show(str,function(){
					CheckJoinModel.toMatchRoom(CheckJoinModel.playType,CheckJoinModel.matchType,CheckJoinModel.keyId);
				},function(){
					CheckJoinModel.backToHall();
				});

				break;
			case 62://娱乐场匹配成功,需要切服
				var data = JSON.parse(message.strParams[0]);
				ServerUtil.smartChooseSocketUrl(data);
				CheckJoinModel.needJoinTable = true;
				CheckJoinModel.tableId = data.tabelId || 0;
				break;
			case 63://娱乐场加入匹配成功推送
				var playType = message.params[0];
				var matchType = message.params[1];
				var keyId = message.strParams[0] || "";
				CheckJoinModel.enterMatch(playType,matchType,keyId);
				break;
			case 64://娱乐场退出匹配成功
				CheckJoinModel.backToHall();
				break;
			case 235://潮汕麻将最后一圈锁牌
				SyEventManager.dispatchEvent(SyEvent.GDCSMJ_LASTCIRCLE,message);
				break;
			case 236://通城麻将通知飘分
				SyEventManager.dispatchEvent(SyEvent.TCMJ_STARTPIAOFEN,message);
				break;
			case 237://通城麻将飘分结束
				SyEventManager.dispatchEvent(SyEvent.TCMJ_PIAOFENEND,message);
				break;
			case 239://娱乐场挑战赛返回配置数据
				SyEventManager.dispatchEvent("GET_TZS_CFG",message);
				break;
			case 18://抽奖增加红点提醒\消息增加红点提醒
				if(ArrayUtil.indexOf(message.params, 1) >= 0){//1代表新消息
					var value = {fal:true,index:1};
					ShowTipsModel.updataData(value)
					SyEventManager.dispatchEvent(SyEvent.NEW_TIPS,value);
				}
				if(ArrayUtil.indexOf(message.params, 2) >= 0){//2代表可抽奖
					var value = {fal:true,index:2};
					ShowTipsModel.updataData(value)
					SyEventManager.dispatchEvent(SyEvent.NEW_TIPS,value);
				}
				break;
			case 19://即时通讯
				//if(message.strParams[0]){
					cc.log("code 19 =",JSON.stringify(message));
					PaoMaDengModel.init(JSON.parse(message.strParams[0]));
				//}
				break;
			case 20://比赛场等待界面
				break;
			case 21://比赛场链接
				var matchId = parseInt(message.strParams[0]);
				var matchUrl = message.strParams[1];
				if(matchId>0){
					if(matchId>0 && matchUrl){
						if(sySocket.url != matchUrl){
							sySocket.url = matchUrl;
							sySocket.isCrossServer = true;
							sySocket.disconnect(function(){
								sySocket.connect();
							});
						}else{
							sySocket.sendComReqMsg(1,[]);
						}
					}
				}
				break;
			case 22://有人下注了
				//[5,3]
				SyEventManager.dispatchEvent(SyEvent.DOUNIU_XIA_ZHU,message.params);
				break;
			case 24://有人抢庄了
				//[5,1]
				SyEventManager.dispatchEvent(SyEvent.DOUNIU_ZHUANG_RECEIVE,message.params);
				break;
			case 25://放弃庄家
				//SyEventManager.dispatchEvent(SyEvent.DOUNIU_QI_ZHUANG,message.params);
				break;
			case 27://亮牌
				SyEventManager.dispatchEvent(SyEvent.DOUNIU_LIANG_PAI,message.params[0]);
				break;
			case 28://推送放招数据
				var data = {};
				data.userId = message.strParams[0];
				data.fangzhao = parseInt(message.strParams[1]);
				PHZRoomModel.setFangZhao(data);
				break;
			case 29://推送放招弹框
				PHZRoomModel.isShowFangZhao(message.params[0]);
				break;
			case 30://没有听牌不允许放招
				//cc.log("没有听牌不允许放招",JSON.stringify(message))
				PHZRoomModel.isShowChongPao()
				break;
			case 31://代开房间
				break;
			case 35://创建房间和加入房间的链接
				var strParams = JSON.parse(message.strParams[0])
				ServerUtil.smartChooseSocketUrl(strParams);
				SyEventManager.dispatchEvent(SyEvent.GOLD_MATCH_JOIN_ROOM,strParams);
				break;
			case 36://更新定位信息
				var userId = message.strParams[0];
				var gps = message.strParams[1];
				var fzId = message.strParams[2];//房主ID
				var nowBurCount = 0;
				if(userId == PlayerModel.userId){
					PlayerModel.gps = gps;
				}else{
					var curLayer = LayerManager.getCurrentLayer();
					switch (curLayer){
						case LayerFactory.DTZ_ROOM:
							DTZRoomModel.updateGPS(userId,gps);
							break;
						case LayerFactory.PHZ_ROOM:
						case LayerFactory.PHZ_ROOM_MORE:
						case LayerFactory.PHZ_ROOM_LESS:
							nowBurCount = PHZRoomModel.nowBurCount;
							PHZRoomModel.updateGPS(userId,gps);
							break;
						case LayerFactory.PDK_ROOM:
							PDKRoomModel.updateGPS(userId , gps);
							break;
					}
				}
				GPSModel.updateGpsData(userId,gps,true);
				cc.log("gps::"+JSON.stringify(message.strParams));
				break;
			case 37://语音消息 某个玩家录制了语音 后台推送给我 播放该语音
				//var seat = message.params[0];
				//var userId = message.strParams[0];
				//var fileId = message.strParams[1];
				GvoiceMessageSeq.receive(message);
				break;
			case 56://亲友圈比赛分刷新
				SyEventManager.dispatchEvent(SyEvent.UPDATA_CLUB_CREDIT,message);
				break;
			case 57://亲友圈金币刷新
				//cc.log("UPDATA_CLUB_COIN1",JSON.stringify(message))
				PlayerModel.coin = message.strParams[0]
				SyEventManager.dispatchEvent(SyEvent.UPDATA_CLUB_COIN,message.strParams[0]);
				break;
			case 58://牌桌金币刷新
				//cc.log("UPDATA_CLUB_TABLE_COIN1",JSON.stringify(message))
				SyEventManager.dispatchEvent(SyEvent.UPDATA_CLUB_TABLE_COIN,message);
				break;
			case 59://结算金币
				ClosingInfoModel.clubResultCoinData = JSON.parse(message.strParams[0])
				//cc.log("CLUB_RESULT_COIN1",JSON.stringify(message))
				break;
			case 80://亲友圈邀请功能推送
				SyEventManager.dispatchEvent("pyq_invite_get_msg",message);
				break;
			case 81:
				SyEventManager.dispatchEvent(SyEvent.DI_DIZHU_PAI,message.params[0]);
				break;
			case 84:
				SyEventManager.dispatchEvent(SyEvent.UPDATE_BEI_SHU,message.params[0]);
				break;
			case 87:
				SyEventManager.dispatchEvent(SyEvent.CHUN_TIAN,message.params[0]);
				break;
			case 95:
				//字符串数组下标1为数据类型（小于0包厢列表，等于0（默认）当前俱乐部的房间及玩法信息，大于0该包厢的房间及玩法信息）
				var strParams = message.strParams;
				var jsonData = JSON.parse(strParams);
				if (jsonData.room != 0 ){
					SyEventManager.dispatchEvent(SyEvent.GET_CLUB_BAGS,message);
				}else{
					SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ROOMS,message.strParams);
				}
				break;
			case 96:
				SyEventManager.dispatchEvent(SyEvent.CLUB_ROOM_DETAILPOP,message);
				//PopupManager.addPopup(new ClubRoomDetailPop());
				break;
			case 97:
				var matchClubId = parseInt(message.strParams[0]);
				if (matchClubId > 0){
					SyEventManager.dispatchEvent(SyEvent.CLUB_SHOW_MATCH_TIP,message.params);
				}
				break;
			case 100:
				break;
			case 107://比赛场人数变动
				break;
			case 114:
				var fal = parseInt(message.strParams[5]);//1表示未签到
				var temp = parseInt(message.strParams[6]);//1表示在房间里
				if(temp != 1 && !SdkUtil.isReview()) {
					if(ShareDailyModel.hasOpenByPushMsg == false){
						ShareDailyModel.hasOpenByPushMsg = true;
						ActivityModel.sendOpenActivityMsg();
					}
				}
				break;
			case 115:
				SyEventManager.dispatchEvent(SyEvent.QIANDAO,message.params);
				break;
			case 119: //代开房主主动解散房间成功
				SyEventManager.dispatchEvent(SyEvent.DAIKAI_REFRESH);
				break;
			case 120: //开始分组
				var isRoomLayer = (LayerManager.isInDTZ());
				if(isRoomLayer){
					var roomLayer = LayerManager.getCurrentLayerObj();
					roomLayer.onChoiceTeam(message.params);
					cc.log("choiceTeam::"+JSON.stringify(message));
				}
				break;
			case 121: //有玩家选择了分组
				var isRoomLayer = (LayerManager.isInDTZ());
				if(isRoomLayer){
					var roomLayer = LayerManager.getCurrentLayerObj();
					roomLayer.onPlayerChoiceTeamCard(message.params);
					cc.log("playerChoiceTeamCard::"+JSON.stringify(message));
				}
				break;
			case 122: //后台推送分组完成
				var isRoomLayer = (LayerManager.isInDTZ());
				if(isRoomLayer){
					var roomLayer = LayerManager.getCurrentLayerObj();
					roomLayer.onUpdatePlayerMsg(message.params);
					cc.log("onUpdatePlayerMsg::"+JSON.stringify(message));
				}

				//沅江麻将闲家报听后庄家可出牌
				if(MJRoomModel.wanfa == GameTypeEunmMJ.YJMJ){
					MJRoomModel.nextSeat = MJRoomModel.mySeat;
				}
				break;
			case 123: //一圈结束 三家要不起 一家(一组)获得分 清空当前牌局积分
				var isRoomLayer = (LayerManager.isInDTZ());
				if(isRoomLayer){
					SyEventManager.dispatchEvent(SyEvent.DTZ_DEAL_SCORE,message.params);
				}
				break;
			case 124: //不出牌
				if(LayerManager.isInDTZ()){
					var roomLayer = LayerManager.getCurrentLayerObj();
					roomLayer.resGiveUp();
				}
				break;
			case 125: //设置玩家头像名次
				var isRoomLayer = (LayerManager.isInDTZ());
				if(isRoomLayer){
					var roomLayer = LayerManager.getCurrentLayerObj();
					roomLayer.showWinNumber(message.params);
				}
				break;
			case 128://显示玩家状态
				cc.log("后台推送显示玩家状态...");
				var isRoomLayer = (LayerManager.isInDTZ());
				if(isRoomLayer && DTZRoomModel.is4Ren()){
					cc.log("后台发送显示玩家的数据为:" , JSON.stringify(message.strParams))
					var roomLayer = LayerManager.getCurrentLayerObj();
					roomLayer.showPlayersStates(message.strParams);
				}
				break;
			case 130:
				var noteData = JSON.parse(message.strParams);
				PopupManager.addPopup(new DTZCardNote(noteData));
				break;
			case 132://玩家托管状态发生改变
				//cc.log("UPDATE_TUOGUAN",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.UPDATE_TUOGUAN,message.params);
				//var noteData = JSON.parse(message.strParams);
				//PopupManager.addPopup(new DTZCardNote(noteData));
				SyEventManager.dispatchTableEvent("ChangeTuoGuan",message);
				break;
			case 133://二次托管
				//cc.log("UPDATE_TUOGUAN_TIME",JSON.stringify(message));
				//SyEventManager.dispatchEvent(SyEvent.UPDATE_TUOGUAN_TIME,message.params);
				break;
			case 134:
				//cc.log("*************1")
				//字符串数组下标1为数据类型（小于0包厢列表，等于0（默认）当前俱乐部的房间及玩法信息，大于0该包厢的房间及玩法信息）
				var strParams = message.strParams;
				var jsonData = JSON.parse(strParams);
				if (jsonData.room != 0 ){
					SyEventManager.dispatchEvent(SyEvent.GET_CLUB_BAGS,message);
				}
				break;
			case 135:
				//cc.log("*************2")
				//字符串数组下标1为数据类型（小于0包厢列表，等于0（默认）当前俱乐部的房间及玩法信息，大于0该包厢的房间及玩法信息）
				var strParams = message.strParams;
				var jsonData = JSON.parse(strParams);
				if (jsonData.room != 0 ){
					SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ROOMS,message);
				}
				break;
			case 200://推送可飘分的状态
				SyEventManager.dispatchEvent(SyEvent.PIAO_FEN,message);
				break;
			case 201://推送玩家选择飘分
				SyEventManager.dispatchEvent(SyEvent.SELECT_PIAO_FEN,message);
				break;
			case 210:///** 托管推送 */
				//0是座位1是否托管（1是0否）2倒计时时间3.是否是自己托管（1是0否）
				var params = message.params;
				SyEventManager.dispatchEvent(SyEvent.UPDATE_TUOGUAN,message.params);
				break;
			case 212:///** 保山麻将买点通知 */
				cc.log("ComResponder::"+JSON.stringify(message));
				MJRoomModel.StartMaiDian(message);
				break;
			case 211:///** 保山麻将广播玩家买了多少点 */
				cc.log("ComResponder::"+JSON.stringify(message));
				MJRoomModel.finishMaidian(message);
				break;
			case 214://跑的快推送打鸟
				SyEventManager.dispatchEvent(SyEvent.PDK_DA_NIAO,message);
				break;
			case 215: /** 加锤选择回应 */
			SyEventManager.dispatchEvent(SyEvent.SYMJ_JIACHUI_STATE,message);
				break;
			case 216:/** 加锤推送 */
			SyEventManager.dispatchEvent(SyEvent.SYMJ_JIACHUI,message);
				break;
			case 230: /** 桃江麻将通知 */
			SyEventManager.dispatchEvent(SyEvent.TJMJ_Ting,message);
				break;
			case 231:/**  桃江麻将回应 */
			SyEventManager.dispatchEvent(SyEvent.TJMJ_Ting_STATE,message);
				break;
			case 238:/**  获取娱乐场亲友圈列表数据 */
				SyEventManager.dispatchEvent(SyEvent.GOLD_PYQ_LIST,message);
				break;
			case 251:/**后台通知所有桌上玩家 请求GPS数据**/
			cc.log("收到广发通知 发起GPSSDK定位请求!!!!!!!!!!!!");
				GPSSdkUtil.startLocation();
				break;
			case 300:///** 礼品兑换列表 */
				break;
			case 301://前端出牌 但是后台检测异常 补回那张牌
				//var fixCardId = JSON.parse(message.strParams);
				var fixCardId = JSON.parse(message.params);
				SyEventManager.dispatchEvent(SyEvent.FIX_OUT_CARD,message);
				cc.log("后台下发 修正出牌错误的ID:" , fixCardId);
				break;
			case 305:/** 益阳麻将锁牌操作 **/
				SyEventManager.dispatchEvent("YYMJ_DINGPAI_CLOSE",message);
				break;
			case 3011://前端出牌 但是后台检测异常 补回那张牌
				var fixCardId = JSON.parse(message.params);
				SyEventManager.dispatchEvent(SyEvent.FIX_OUT_CARD_ERROR,message);
				cc.log("提示等待其他玩家操作:" , fixCardId);
				break;
			case 400://服务器推送，前端隐藏操作
				SyEventManager.dispatchEvent(SyEvent.PHZ_HIDE_ACTION,message);
				break;
			case 306://长沙麻将别人操作小胡后，通知庄家可出牌
				SyEventManager.dispatchEvent(SyEvent.PLAY_CARD_AFTER_XIAOHU,message);
				break;
			case 903:
				var value = message.strParams[1];
				cc.log("刷新金币..." , message.strParams[0] , message.strParams[1]);
				PlayerModel.correctCoin(value);
				break;
			case 904://牌桌刷新玩家娱乐场金币
				SyEventManager.dispatchEvent("Ylc_Gold_Change",message);
				break;
			//后台应允打开金币场大厅界面
			case 905:
				cc.log("comresp 905");
				SyEventManager.dispatchEvent(SyEvent.GOTO_MONEY_HOME,{});
				break;
			case 906:
				break;
			case 1015://获取礼券
				// if(message.params[0] == 0){
				// 	var pop = new AwardPop(message.params[1]);
				// 	pop.setAwrdImg("res/ui/bjdmj/popup/shopRes/quan_max.png",1.8);
				// 	var str = "礼券可去兑换商城兑换话费等商品";
				// 	pop.addTipInfo(str);
				// 	PopupManager.addPopup(pop,99);
				// }
				break;
			case 1016://端午集粽子活动数据返回
				SyEventManager.dispatchEvent("HUODONG_JZZ_GET_DATA",message);
				break;
			case 1100://金币场 匹配失败
				sy.scene.hideLoading();
				FloatLabelUtil.comText("积分场匹配失败");
				SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING , {});
				break;
			case 1101://金币场 正在匹配
				//sy.scene.showLoading("正在匹配玩家...");
				break;
			case 1103://金币场相关提示
				//已经没用了
				break;
			case 1104:
				//cc.log("创建多个房间成功 刷新当前的俱乐部信息 和俱乐部房间列表");
				SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST,message.params);
				break;
			case 1107://收到俱乐部邀请信息刷新红点
				SyEventManager.dispatchEvent(SyEvent.UPDATE_BE_INVITE_RED,message.params);
				break;
			case 1019://七夕排行榜领取奖励返回
				SyEventManager.dispatchEvent("Qixi_Rank_Reward_Back",message);
				break;
			case 1020://七夕排行榜活动返回排行榜数据
				SyEventManager.dispatchEvent("Qixi_Get_Rank_Data",message);
				break;
			case 1021://七夕活动推送收集倒七的个数
				if(BaseRoomModel.curRoomData){
					BaseRoomModel.curRoomData.getQiNum = message.params[0];
				}
				break;
			case 1907:
				//获取金币场商品配置
				//cc.log("获取金币场配置1907...", JSON.stringify(message.params));
				var msgType = message.params[0];
				if(msgType == 1){//获取金币场 金币兑换钻石配置表
					SyEventManager.dispatchEvent(SyEvent.GOLD_EXCHANGE_LIST,message.strParams);
				}else if(msgType == 2){
					FloatLabelUtil.comText("兑换成功")
					PlayerModel.goldUserInfo.gold = Number(message.strParams[1])
					PlayerModel.cards = Number(message.strParams[2])
					SyEventManager.dispatchEvent(SyEvent.PLAYER_PRO_UPDATE,{});
				}
				//if(msgType == 0 &&configType == 0 ){//获取金币场 金币兑换钻石配置表
				//	SyEventManager.dispatchEvent(SyEvent.GET_DIAMONDTOMONEY_ITEMS,message.strParams);
				//}else if(msgType == 0 && configType == 1){// 获取金币场 钻石兑换金币配置表
				//	SyEventManager.dispatchEvent(SyEvent.GET_MONEYTODIAMOND_ITEMS,message.strParams);
				//}else if(msgType == 1 && configType == 0){
				//	SyEventManager.dispatchEvent(SyEvent.BUY_MONEY_ITEMS,message.strParams);
				//}else if(msgType == 1 && configType == 1){
				//	SyEventManager.dispatchEvent(SyEvent.BUY_DIAMOND_ITEM,message.strParams);
				//}
				break;
			case 1908:
				break;
			case 2013://跑的快回看消息
				cc.log("ComResponder::2013"+JSON.stringify(message));
				PDKRoomModel.OnDeskHuiKan(message);
				break;
			case 2014://娄底放炮罚弃胡
				cc.log("ComResponder::2014"+JSON.stringify(message));
				PHZRoomModel.OnQiHu(message);
				break;
			case 2015://郴州字牌通知飘分
				cc.log("ComResponder::2015"+JSON.stringify(message));
				PHZRoomModel.StartPiaoFen(message);
				break;
			case 2016://郴州字牌完成飘分
				cc.log("ComResponder::2016"+JSON.stringify(message));
				PHZRoomModel.FinishPiaoFen(message);
				break;
			case 2017://耒阳字牌吃边置灰手牌
				cc.log("ComResponder::2017"+JSON.stringify(message));
				PHZRoomModel.LYZP_ChiBianChangeCards(message);
				break;
			case 2018://耒阳字牌吃边打边
				cc.log("ComResponder::2018"+JSON.stringify(message));
				PHZRoomModel.LYZP_ChiBianDaBian(message.params[0]);
			case 2019://耒阳字牌吃边打边和放招同时触发
				cc.log("ComResponder::2019"+JSON.stringify(message));
				PHZRoomModel.LYZP_ChiBianDaBianAndFangzhao(message.params[0]);
				break;
			case 2200://沅江鬼胡子过吃取消的门子推送
				SyEventManager.dispatchEvent("GUO_CHI_CANCEL",message);
				break;
			case 2020://捉红字吃牌后手牌置灰
				cc.log("ComResponder::2020"+JSON.stringify(message));
				PHZRoomModel.ZHZ_CardsChangeGray(message);
				break;
			case 2021://跑的快通知飘分
				cc.log("ComResponder::2021"+JSON.stringify(message));
				PDKRoomModel.StartPiaoFen(message);
				break;
			case 2022://跑的快完成飘分
				cc.log("ComResponder::2022"+JSON.stringify(message));
				PDKRoomModel.FinishPiaoFen(message);
				break;
			case 2023://转转麻将开始飘分
				cc.log("ComResponder::2023"+JSON.stringify(message));
				MJRoomModel.StartPiaoFen(message);
				break;
			case 2024://转转麻将完成飘分
				cc.log("ComResponder::2024"+JSON.stringify(message));
				MJRoomModel.FinishPiaoFen(message);
				break;
			case 2025://邵阳剥皮通知锤
				cc.log("ComResponder::2025"+JSON.stringify(message));
				PHZRoomModel.SYBP_StartChui(message);
				break;
			case 2026://邵阳剥皮完成锤
				cc.log("ComResponder::2026"+JSON.stringify(message));
				PHZRoomModel.SYBP_FinishChui(message);
				break;
			case 2027://衡阳十胡卡 可胡示众牌
				cc.log("ComResponder::2027"+JSON.stringify(message));
				PHZRoomModel.HYSHK_KehuShizhongpai(message);
				break;
			case 2030://蓝山字牌 开始飘分
				cc.log("ComResponder::2030"+JSON.stringify(message));
				PHZRoomModel.StartPiaoFen(message);
				break;
			case 2031://蓝山字牌 结束飘分
				cc.log("ComResponder::2031"+JSON.stringify(message));
				PHZRoomModel.FinishPiaoFen(message);
				break;
			case 2032://娄底放炮罚通知打鸟
				cc.log("ComResponder::2032"+JSON.stringify(message));
				PHZRoomModel.StartDaNiao(message);
				break;
			case 2033://娄底放炮罚通知结束打鸟
				cc.log("ComResponder::2033"+JSON.stringify(message));
				PHZRoomModel.FinishDaNiao(message);
				break;
			case 2050://亲友圈玩家升级推送
				SyEventManager.dispatchEvent(SyEvent.CLUB_UPGRADE_SUCCESSED,message);
				break;
			case 2100: /** 打坨选择回应 */
			    SyEventManager.dispatchEvent(SyEvent.XXGHZ_DATUO_STATE,message);
				break;
			case 2101:/** 打坨推送 */
			    SyEventManager.dispatchEvent(SyEvent.XXGHZ_DATUO,message);
				break;
			case 2301: /** 湖北个子牌通知跑分 */
			SyEventManager.dispatchEvent(SyEvent.HBGZP_PAOFEN,message);
				break;
			case 2302:/** 湖北个子牌跑分反馈 */
			SyEventManager.dispatchEvent(SyEvent.HBGZP_PAOFEN_STATE,message);
				break;
			case 2303:/**湘西2710过牌数据*/
				SyEventManager.dispatchEvent(SyEvent.XXEQS_GUOPAI,message);
				break;
			case 2305:/**益阳歪胡子第一局神牌数据*/
			SyEventManager.dispatchEvent(SyEvent.YYWHZ_SHENPAI,message);
				break;
			case 2306:/**益阳歪胡子胡牌显示腰牌数据*/
			SyEventManager.dispatchEvent(SyEvent.YYWHZ_YAOPAI,message);
				break;
			case 3100:
				SyEventManager.dispatchTableEvent("JiaoFen",message);
				break;
			case 3101:
				SyEventManager.dispatchTableEvent("XuanZhu",message);
				break;
			case 3102:
				SyEventManager.dispatchTableEvent("DingZhuang",message);
				break;
			case 3103://三打哈查询出牌记录返回
				SyEventManager.dispatchEvent("SDH_GET_CARDS_RECORD",message);
				break;
			case 3104://选择留守花色
				SyEventManager.dispatchTableEvent("XuanLiuShou",message);
				break;
			case 3105://投降消息推送
				SyEventManager.dispatchTableEvent("TouXiang",message);
				break;
			case 3106://益阳巴十确定队友消息
				SyEventManager.dispatchTableEvent("YYBS_ZDY",message);
				break;
			case 3107://常德拖拉机抽底牌消息
				SyEventManager.dispatchTableEvent("CDTLJ_CDP",message);
				break;
			case 3117://新田包牌飘分
				SyEventManager.dispatchTableEvent("PiaoFen",message);
				break;
			case 4100://掂坨选独战
				SyEventManager.dispatchTableEvent("XuanDuZhan",message);
				break;
			case 4101://掂坨分组
				SyEventManager.dispatchTableEvent("FenZu",message);
				break;
			case 4102://掂坨查询得分和报分
				SyEventManager.dispatchEvent("DT_GET_CARDS_RECORD",message);
				break;
			case 4103://掂坨看队友牌
				SyEventManager.dispatchTableEvent("ShowTeamCard",message);
				break;
			case 4104://掂坨出单报王
				SyEventManager.dispatchTableEvent("BaoWang",message);
				break;
			case 4200://牛十别明牌
				SyEventManager.dispatchTableEvent("MingPai",message);
				break;
			case 1121://千分切牌
				SyEventManager.dispatchEvent(SyEvent.PDK_QIE_PAI,message.params);
				break;
			case 2041://一圈结束 三家要不起 一家(一组)获得分 清空当前牌局积分
				var isRoomLayer = (LayerManager.isInQF());
				if(isRoomLayer){
					if (message.params && message.params[4] == 0){
						message.isUpdate = true;
						PlayQFMessageSeq.receive(message);
					}else{
						SyEventManager.dispatchEvent(SyEvent.QF_DEAL_SCORE,message.params);
					}
					//PlayQFMessageSeq.receive(message);
					//cc.log("onDealScore::"+JSON.stringify(message));
				}
				break;
			case 2042://千分设置玩家头像名次
				var isRoomLayer = (LayerManager.isInQF());
				if(isRoomLayer){
					var roomLayer = LayerManager.getCurrentLayerObj();
					roomLayer.showWinNumber(message.params);
				}
				break;
			case 2043://
				var noteData = JSON.parse(message.strParams);
				PopupManager.addPopup(new QFCardNote(noteData));
				break;
			case 2044://楚雄麻将 杠牌ID
				// cc.log("2044 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.CXMJ_GANG_ID,message);
				break;
			case 2045://
				// cc.log("2044 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.CXMJ_CHOOSE_GANG,message);
				break;
			case 2061://
				// cc.log("2044 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.KWMJ_FENGDONG,message);
				break;
			case 2062://
				// cc.log("2044 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.KWMJ_BAOTING,message);
				break;
			case 2063://闲家有操作
				// cc.log("2044 message = ",JSON.stringify(message));
				// SyEventManager.dispatchEvent(SyEvent.KWMJ_XIANJIA_OPERATE,message);
				MJRoomModel.mj_xianjia_oprete = true;
				break;
			case 2064://闲家操作完毕
				// cc.log("2044 message = ",JSON.stringify(message));
				// SyEventManager.dispatchEvent(SyEvent.KWMJ_XIANJIA_FINISH_OPERATE,message);
				MJRoomModel.mj_xianjia_oprete = false;
				break;
			case 2065://开王麻将借子开杠
				// cc.log("2044 message = ",JSON.stringify(message));
				// SyEventManager.dispatchEvent(SyEvent.KWMJ_XIANJIA_FINISH_OPERATE,message);
				AlertPop.show("确定借子开杠吗？", function () {
					//Network.logReq("MJRoom::guo click...2");
					sySocket.sendComReqMsg(2065,[1]);
				},function () {
					//Network.logReq("MJRoom::guo click...2");
					sySocket.sendComReqMsg(2065,[0]);
				});
				break;
			case 5100://株洲碰胡子 分数刷新
				// cc.log("2044 message = ",JSON.stringify(message));
				PlayPHZMessageSeq.receiveZZPHMsg(message);
				break;
			case 5101://株洲碰胡子 五福通知
				// cc.log("2044 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.ZZPH_WUFU,message);
				break;
			case 5102://株洲碰胡子 五福报警
				// cc.log("2044 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.ZZPH_WUFU_BAOJING,message);
				break;
			case 5103://株洲碰胡子 打鸟
				// cc.log("5103 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.ZZPH_DANIAO_START,message);
				break;
			case 5104://株洲碰胡子 广播打鸟
				// cc.log("5104 message = ",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.ZZPH_DANIAO_UPDATE,message);
				break;
			case 5105://株洲碰胡子 换位置
				SyEventManager.dispatchEvent(SyEvent.ZZPH_SEAT_EXCHANGE,message);
				break;
			case 6100://推倒胡自动摸打状态改变推送
				SyEventManager.dispatchEvent("Zdmd_Change",message);
				break;
			case 6101://保山麻将报听
				SyEventManager.dispatchEvent(SyEvent.BSMJ_SHOWBAOTING,message);
				break;
			case 6102://保山麻将报听反馈
				SyEventManager.dispatchEvent(SyEvent.BSMJ_BAOTINGCLICK,message);
				break;
			case 6103://德宏麻将杠牌刷新底牌
				SyEventManager.dispatchEvent(SyEvent.DHMJ_GANGDIPAI,message);
				break;
			case 2070://桐城跑风麻将补封
				SyEventManager.dispatchEvent(SyEvent.TCPFMJ_BUHUA,message);
				break;
			case 2071://桐城跑风麻将跑风
				SyEventManager.dispatchEvent(SyEvent.TCPFMJ_PAOFENG,message);
				break;
			case 2080://南县麻将报听
				SyEventManager.dispatchEvent(SyEvent.YYNXMJ_BAOTING,message);
				break;
			case 2081://南县麻将海底
				SyEventManager.dispatchEvent(SyEvent.YYNXMJ_HAIDI,message);
				break;
			case 2082://重庆血战麻将通知换张
				SyEventManager.dispatchEvent(SyEvent.CQXZMJ_START_HUANZHANG,message);
				break;
			case 2083://重庆血战麻成功换张
				SyEventManager.dispatchEvent(SyEvent.CQXZMJ_SUCESS_HUANZHANG,message);
				break;
			case 2084://重庆血战麻将结束换张
				SyEventManager.dispatchEvent(SyEvent.CQXZMJ_FINISH_HUANZHANG,message);
				break;
			case 2085://重庆血战麻将通知定缺
				SyEventManager.dispatchEvent(SyEvent.CQXZMJ_START_DINGQUE,message);
				break;
			case 2086://重庆血战麻成功定缺
				SyEventManager.dispatchEvent(SyEvent.CQXZMJ_SUCESS_DINGQUE,message);
				break;
			case 2087://重庆血战麻将结束定缺
				SyEventManager.dispatchEvent(SyEvent.CQXZMJ_FINISH_DINGQUE,message);
				break;
			case 410://桐城跑风麻将跑风
				SyEventManager.dispatchEvent(SyEvent.MJ_HIDE_ACTION,message);
				break;
			case 4133://桐城掼蛋显示红桃3
				SyEventManager.dispatchTableEvent("ShowHong3",message);
				break;
			case 4134://桐城掼蛋换位置
				SyEventManager.dispatchTableEvent("SwitchSeat",message);
				break;
			case 4140://二人斗地主叫地主
				SyEventManager.dispatchTableEvent("JiaoDiZhu",message);
				break;
			case 4141://二人斗地主抢地主
				SyEventManager.dispatchTableEvent("QiangDiZhu",message);
				break;
			case 4142://二人斗地主确定地主
				SyEventManager.dispatchTableEvent("SureDiZhu",message);
				break;
			case 4143://二人斗地主选让牌
				SyEventManager.dispatchTableEvent("RangPai",message);
				break;
			case 4144://二人斗地主选加倍
				SyEventManager.dispatchTableEvent("JiaBei",message);
				break;
			case 50://益阳麻将海底牌显示
				SyEventManager.dispatchEvent("YYMJ_HAIDI",message);
				break;
			case 4201://五子棋提示选分
				SyEventManager.dispatchEvent(SyEvent.CLUB_WZQ_SELECT_SCORE_TYPE);
				break;
			case 4202://五子棋选分
				SyEventManager.dispatchEvent(SyEvent.CLUB_WZQ_SELECT_SCORE,message);
				break;
			case 1114://签到
				// SignInModel.init(message.strParams[2]);
				// if(message.strParams[3] == "1"){
				// 	if(message.strParams[0] == "1"){
				// 		SignInModel.isQianDao = false;
				// 	}else{
				// 		SignInModel.isQianDao = true;
				// 	}
				// 	var pop = new SignInPop();
        		// 	PopupManager.addPopup(pop);
				// }else if(message.strParams[0] == "1" && message.strParams[1] == "0"){
				// 	SignInModel.isQianDao = false;
				// }else{
				// 	if(message.strParams[0] == "0"){
				// 		SignInModel.isQianDao = true;
				// 	}
				// }
				// if(SignInModel.isQianDao == false && (SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW)
				// 	&& !PopupManager.getClassByPopup(PyqHall)){
		        //     var pop = new SignInPop();
		        //     PopupManager.addPopup(pop);
		        // }
				break;
			case 1115://签到成功
				// cc.log(" message =",JSON.stringify(message));
				SignInModel.init(message.params[0]);
				SignInModel.isQianDao = true;
				SyEventManager.dispatchEvent(SyEvent.REFRESH_QIANDAO,message.params);
				break;
			case 1116://破产补助
				// cc.log(" message =",JSON.stringify(message));
				// if(SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW){/** 如果是可以看视频的包 **/
				// 	var pop = new NewBrokePop(message.params[0]);
				// 	PopupManager.addPopup(pop);
				// }else{
				// 	var pop = new BrokePop(message.params[0]);
				// 	PopupManager.addPopup(pop);
				// }
				break;
			case 1118://破产补助分享成功
				var pop = new AwardPop(BeansConfigModel.aloneConfig.brokeShare);
            	PopupManager.addPopup(pop);
				break;
			case 1119://破产补助领取成功
				// var pop = new AwardPop(BeansConfigModel.aloneConfig.broke);
            	// PopupManager.addPopup(pop);
            	// if(PopupManager.getClassByPopup(BrokePop)){
		        //  	  // PopupManager.showPopup(PyqHall);
		        //  	PopupManager.getClassByPopup(BrokePop).getBrokeBeans()
		        // }
				break;
			case 1127:/***  可以看视频的破产补助领取成功  ***/
				var pop = new AwardPop(message.params[0]);
				PopupManager.addPopup(pop);
				break;
			case 1136://砸金蛋数据
				GoldenEggsModel.init(message)
				SyEventManager.dispatchEvent(SyEvent.GOLDEN_EGGS,message);
				break;
			case 1132:/***  小结算能不能看视频  ***/
				GoldResultModel.isNeedShowButton = true;
				GoldResultModel.init(message.params[0],message.params[1] == 2);
					break;
			case 1133:/***  小结算看视频领取成功  ***/
				var pop = new AwardPop(message.params[0]);
					PopupManager.addPopup(pop);
					break;
			case 1134://砸金蛋返回
				GoldenEggsModel.getTotalMoney(message.strParams[2])
				GoldenEggsModel.getGoldenEggsData(JSON.parse(message.strParams[1]))
				SyEventManager.dispatchEvent(SyEvent.GOLDEN_EGGS_OPEN,message.strParams[0]);
				break;
			case 1135://砸金蛋邀请信息
				var strParams = JSON.parse(message.strParams[0])
				GoldenEggsModel.getInviteData(strParams)
				SyEventManager.dispatchEvent(SyEvent.GOLDEN_EGGS_INVITE,strParams);
				break;
			case 1120://兑换提示
				// if(SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW) {/** 如果是可以看视频的包 **/
				// 	var pop = new NewDuiHuanTipPop();
				// 	PopupManager.addPopup(pop);
				// }else{
				// 	var pop = new DuiHuanTipPop();
				// 	PopupManager.addPopup(pop);
				// }
				break;
			case 1122://任务领取奖励成功
				if(PopupManager.getClassByPopup(MissionPop)){
		         	PopupManager.getClassByPopup(MissionPop).MissionFinish(message.params[0]);
		        }
				break;
			case 1123://任务红点通知
				SyEventManager.dispatchEvent(SyEvent.MISSION_STATUS,message.params);
				BeansConfigModel.showMissionRedPoint = message.params[0] ==1;
				break;
			case 1124://送龙舟任务红点通知
				SyEventManager.dispatchEvent("DW_SLZ_EVENT_STATUS",message);
				BeansConfigModel.showDWSLZRedPoint = message.params[0] ==1;
				break;
			case 1151://送龙舟任务领取奖励成功
				SyEventManager.dispatchEvent("DW_SLZ_GET_SUCCESS",message);
				break;
			case 1152:// 发送邀请返回消息
			    FloatLabelUtil.comText("邀请发送成功");
				break;
			case 1153:// 同意邀请返回消息
				FloatLabelUtil.comText("同意邀请成功");
				break;
			case 1154:// 七夕活动领取成功
				//var mc = new QixiAwardPop(message.params[0],message.params[1]);
				//PopupManager.addPopup(mc);
				break;
			case 1155:// 刷新邀请小红点
				//SyEventManager.dispatchEvent("QXQQHD_UPDATE_REDPOINT",message);
				//var params = message.params;
				//var index = parseInt(params[0]);
				//var index2 = parseInt(params[1]);
				//QueQiaoConfigModel.newRedPoint = index > 0 || index2 > 0;
				break;
			case 6000:
				SyEventManager.dispatchEvent(SyEvent.GOLD_MATCH_UPDATE_NUMBER,message.params);
				break;
			case 6001://比赛场结算界面
				// if(message.params[0] == 2||message.params[1] == 2){//大结算
				// 	setTimeout(function() {//延迟弹出结算框
				// 		if(PopupManager.hasClassByPopup(GoldMatchSmallResultPop)){
				// 			PopupManager.removeClassByPopup(GoldMatchSmallResultPop);
				// 		}
				// 		if(PopupManager.hasClassByPopup(GoldMatchWaitResultPop)){
				// 			PopupManager.removeClassByPopup(GoldMatchWaitResultPop);
				// 		}
				// 		LayerManager.showLayer(LayerFactory.HOME);
				// 		var mc = new GoldMatchBigResultPop(message);
				// 		PopupManager.addPopup(mc);
				// 	},4000);
				// }
				// if(message.params[6] == 1){//等待晋级//
				// 	setTimeout(function() {//延迟弹出结算框
				// 		if(PopupManager.hasClassByPopup(GoldMatchSmallResultPop)){
				// 			var mc = new GoldMatchWaitResultPop(message);
				// 			PopupManager.addPopup(mc);
				// 		}
				// 	},3000);
				// }
				// if(message.params[0] == 3){//等待晋级
				// 	var mc = new GoldMatchWaitResultPop(message);
				// 	PopupManager.addPopup(mc);
				// }
				// if(message.params[0] != 2&&message.params[1] != 2 &&message.params[6] != 1){//更新小结算数据
				// 	GoldMatchRoomModel.goldMatchParams = message.params
				// 	SyEventManager.dispatchEvent(SyEvent.GOLD_MATCH_UPDATE_RESULT_STATE);
				// }
				break;
			case 6002://赛前推送 开赛前等待界面
				if(LayerManager.isInRoom()){
					if(PopupManager.hasClassByPopup(GoldMatchTipPop)){
						return
					}
					var mc = new GoldMatchTipPop(JSON.parse(message.strParams[1]));
					PopupManager.addPopup(mc);
				}else{
					if(PopupManager.hasClassByPopup(GoldSignUpPop)){
						return
					}
					var mc = new GoldMatchNoticePop(JSON.parse(message.strParams[1]));
					PopupManager.addPopup(mc);
				}
				break;
			case 6003:
				if(!LayerManager.isInRoom()) {
					var data = JSON.parse(message.strParams)
					var mc = PopupManager.getClassByPopup(GoldSignUpPop)
					if (!mc) {
						var mc = new GoldSignUpPop(data);
						PopupManager.addPopup(mc);
					}
					mc.uptateData(data)
				}
				break;
			case 6004:
				// var ranks = message.strParams[0].split(":")
				// GoldMatchRoomModel.goldMatchRanks = ranks
				// SyEventManager.dispatchEvent(SyEvent.GOLD_MATCH_UPDATE_RANK,ranks);
				break;
			case 6005:
				var data = JSON.parse(message.strParams)
				var mc = PopupManager.getClassByPopup(GoldSignUpPop)
				if(!mc){
					mc = new GoldSignUpPop(data);
					PopupManager.addPopup(mc);
				}
				break;
			case 6006:
				var str = message.strParams[0]
				AlertPop.showOnlyOk(str);
				var playingId = message.strParams[1]
				SyEventManager.dispatchEvent(SyEvent.GOLD_MATCH_FLOW,playingId);
				break;
			case 1111: /** 兑换商城礼券接口 **/
				SyEventManager.dispatchEvent("DHSC_GIFT_NUMBER",message.strParams);
				break;
			case 1125://签到领取奖励成功
				var mc = new AwardPop(1000);
				PopupManager.addPopup(mc);
				break;
			case 1126://签到领取次数
				SyEventManager.dispatchEvent("NEW_QIAODAO_JLCS",message);
				break;
			case 1128://收到累计奖励数据
				SyEventManager.dispatchEvent("Recive_Chou_Jiang_Data",message);
				break;
			case 1129://累计局数刷新
				SyEventManager.dispatchEvent("Update_LeiJi_Win_Num",message);
				break;
			case 1130://领取看视频后累计奖励返回
				SyEventManager.dispatchEvent("Get_Guan_Kan_Reward",message);
				break;
			case 4205://溆浦跑胡子 箍臭返回结果
				SyEventManager.dispatchEvent("XPPHZ_GUCHOU",message);
				break;
			case 4300://返回自己当前的手牌(目前在跑得快上实行)
				// cc.log("message",JSON.stringify(message));
				SyEventManager.dispatchEvent("UPDATA_SHOUPAI",message);
				break;
			case 1139:/** 等级经验数据 **/
				//SyEventManager.dispatchEvent("Get_User_lvExp_Data",message);
				// cc.log(" 经验等级数据 message.params = ",message.params);
				// if(message.params[2] > 0 && message.params[1] > 0){//是否升级
				// 	var mc = PopupManager.getClassByPopup(UserRewardPop);
				// 	UserRewardModel.endLv = message.params[1];
				// 	//if(mc){
				// 	//	mc.setCallFunc(mc.initLvData);
				// 	//}else{
				// 	//	mc = new UserRewardPop([],true);
				// 	//	PopupManager.addPopup(mc,2);
				// 	//}
				// 	if(mc){
				// 		mc.initLvData();
				// 	}
				// }
				break;
			case 1131:/** 个人数据 **/
				// if(message && message.params){
				// 	if(message.params[0] == 2){
				// 		UserLocalDataModel.saveUserIconIndex(message.strParams[0]);
				// 	}
				// }
				// SyEventManager.dispatchEvent("Get_User_myself_Data",message);
				break;
			case 1161://兑换道具返回
			    SyEventManager.dispatchEvent("Exchange_Prop_Back",message);
				break;
			case 1162://获得和消耗道具推送
				if(message.params[0] == 1){//获得道具
					var arr = message.strParams || [];
					if(arr.length > 0){
						var pop = new PropAwardPop(message.strParams);
						PopupManager.addPopup(pop,99);
						//var mc = PopupManager.getClassByPopup(UserRewardPop);
						//if(mc){
						//	UserRewardModel.getDataMsg.push(arr);
						//}else{
						//	mc = new UserRewardPop(arr);
						//	PopupManager.addPopup(mc,2);
						//}
					}
				}
				break;
			case 4401:
				SyEventManager.dispatchEvent(SyEvent.NEW_CARNIVAL_ICON);
				break;
			case 4503://通知开始洗牌
				BaseXiPaiModel.nameList = message.strParams || [];
				BaseXiPaiModel.isNeedXiPai = true && BaseXiPaiModel.nameList.length > 0;
				SyEventManager.dispatchEvent(SyEvent.BISAI_XIPAI,message);
				break;
			case 4520://查询权限
				// cc.log("message =",JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.REFRESH_USERDATA_POWERMANAGE, message);
				break;
			case 4521://添加权限
				// cc.log("message =", JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.ADD_USERDATA_POWERMANAGE, message);
				break;
			case 4522://删除权限
				// cc.log("message =", JSON.stringify(message));
				SyEventManager.dispatchEvent(SyEvent.DELETE_USERDATA_POWERMANAGE, message);
				break;
			case 6012:
				for(var i = 0;i<message.params.length;i++){
					if(message.params[i] == 12){
						NewCarnivalModel.isShowRedPoint = true
						SyEventManager.dispatchEvent(SyEvent.NEW_CARNIVAL_REFRESH);
					}
				}
				break;
			case 1141://钻石赠送功能推送
				SyEventManager.dispatchEvent("Zszs_Back",message);
				break;
			case 620://跑胡子拿到GM数据
				// cc.log("ComResponder::620" + JSON.stringify(message));
				PHZRoomModel.setGmData(message);
				break;
			case 8005://
				// cc.log("ComResponder::620" + JSON.stringify(message));
				if(PopupManager.getClassByPopup(KefunewPop)){
					PopupManager.getClassByPopup(KefunewPop).setWx(message)
				}
				break;
			case 4504:
				SyEventManager.dispatchEvent(SyEvent.LDFPF_KAIJUXIPAI, message);
				break;
			case 4506:
				SyEventManager.dispatchEvent(SyEvent.LDFPF_FINISH_KAIJUXIPAI, message);
				break;
		}
	}
})