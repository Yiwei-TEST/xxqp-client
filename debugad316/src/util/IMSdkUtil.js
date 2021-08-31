var GvoiceMessageSeq = {
	isPlay:false,
	isRecord:false,
	sequenceArray:[],
	currentMsg:null,
	dt:0,

	clean:function(){
		this.dt = 0;
		this.isPlay = false;
		this.isRecord = false;
		this.sequenceArray.length=0;
		this.currentMsg = null;
	},

	startRecord:function(){
		this.isRecord = true;
	},

	stopRecord:function(){
		this.isRecord = false;
	},

	updateDT:function(dt){
		this.dt+=dt;
		if(this.isNeedPlay()){
			this.dt = 0;
			this.playNextMessage();
		}else{
			if(this.dt>=10.1){
				this.dt = 0;
				if(this.isPlay && this.currentMsg){
					var userId = this.currentMsg.strParams[0];
					SyEventManager.dispatchEvent(SyEvent.USER_AUDIO_PLAY_FINISH, userId);
					this.finishPlay();
				}
			}
		}
	},

	clean:function(){
		this.isPlay = false;
		this.sequenceArray.length=0;
	},

	/**
	 * 播放下一个消息
	 */
	playNextMessage:function(){
		if(this.sequenceArray.length>0){
			this.isPlay = true;
			var message = this.sequenceArray.shift();
			//var seat = message.params[0];
			var userId = message.strParams[0];
			var fileId = message.strParams[1];
			if(userId==PlayerModel.userId){
				fileId = "self";
			}
			this.currentMsg = message;
			IMSdkUtil.downloadAudio(fileId);
			//cc.log("playNextMessage::"+JSON.stringify(message));
		}
	},

	getCurrentFileId:function(){
		var fileId = 0;
		if(this.currentMsg!=null)
			fileId = this.currentMsg.strParams[1];
		return fileId;
	},

	getCurrentUserId:function(){
		var userId = 0;
		if(this.currentMsg!=null)
			userId = this.currentMsg.strParams[0];
		return userId;
	},

	/**
	 * 是否还有剩余消息需要播放
	 * @returns {boolean}
	 */
	isNeedPlay:function(){
		if(this.isRecord)
			return false;
		if(this.isPlay || this.sequenceArray.length==0)
			return false;
		return true;
	},

	/**
	 * 完成消息播放
	 */
	finishPlay:function(){
		this.isPlay = false;
	},

	/**
	 * 收到新消息,如果间隔过短，放入队列
	 * @param message
	 */
	receive:function(message){
		this.sequenceArray.push(message);
	}
}
/**
 * 接入语音sdk的util类
 */
var IMSdkUtil = {
	gotyeRoomId:0,
	gotyeLoginSuc:false,

	isCall:function(){
		return (SyConfig.isSdk() && !SdkUtil.isReview());
	},

	isTecent:function(){
		return ((SyConfig.isAndroid()&&SyConfig.HAS_GPS) || (SyConfig.isIos()&&SyConfig.VERSION_CODE=="1.1.0"));
	},

	gotyeExit:function(){
		this.gotyeRoomId = 0;
		this.gotyeLoginSuc = false;
		this.gotyeLogout();
	},

	gotyePoll:function(){
		if(!this.isCall())return false;
		ios_sdk_poll();
	},

	gotyeLogin:function(){
		if(!this.isCall())return false;
		var subJson = '{"flatId":"1111",';
		subJson += '"name":"'+PlayerModel.username+'",';
		subJson += '"uid":"'+PlayerModel.userId+'",';
		subJson += '"serverName":"test",';
		subJson += '"serverId":1}';
		ios_sdk_gotyeLogin(subJson);
	},

	gotyeLogout:function(){
	},

	/**
	 * 发送语音前，请求语音服务器的允许
	 * @param roomId
	 */
	sdkApplyMessageKey:function(roomId){
		if(!this.isCall())return;
		if(this.isReady()){
			cc.log("sdkApplyMessageKey has ready,no need to apply again...");
			return;
		}
		ios_sdk_enterRoom(roomId);
	},

	sdkLoginOutRoom:function(){
	},

	/**
	 * 开始录制语音
	 */
	startAudioRecord:function(){
		if(!this.isCall())return;
		GvoiceMessageSeq.startRecord();
		AudioManager.pause_bg();
		AudioManager.setEffectsVolume(0);
		ios_sdk_startTalk("");
	},

	/**
	 * 结束录制语音
	 * @param isCancel
	 */
	stopAudioRecord:function(isCancel){
		if(!this.isCall())return;
		var param = {};
		param.isCancel = isCancel ? 1 : 0;
		param.isSelfPlay = 1;
		AudioManager.resume_bg();
		AudioManager.setEffectsVolume(PlayerModel.isEffect/100);
		var jsonStr = JSON.stringify(param);
		ios_sdk_stopTalk(jsonStr);
		GvoiceMessageSeq.stopRecord();
	},

	/**
	 * 下载语音
	 * @param fileId
	 */
	downloadAudio:function(fileId){
		if(!this.isCall())return;
		ios_sdk_downAudio(fileId);
	},

	isReady:function(){
		return this.gotyeLoginSuc;
	},

	/**
	 * 语音是否准备好了，由sdk调用
	 * true:登入房间。已经好了
	 * false:网络断开，不能使用
	 */
	onRadioState:function(boo){
		GvoiceMessageSeq.clean();
		this.gotyeLoginSuc = true;
		SyEventManager.dispatchEvent(SyEvent.USER_AUDIO_READY, boo);
	},

	/**
	 * 登录成功回调
	 */
	gotyeLoginCb:function(){
	},

/*	/!**
	 * 上传完毕回调
	 * @param param
	 *!/
	uploadAudioCb:function(param){
		var obj=JSON.parse(param);
		sySocket.sendComReqMsg(31,[],[obj.fileId]);
	},*/

	/**
	 * 打筒子专用语音 队内人员才听得到 应后台要求换个协议ID
	 * @param param
	 */
	uploadAudioCb:function(param){
		var obj=JSON.parse(param);
		var code = 31;
		//if(LayerManager.getCurrentLayer() === LayerFactory.DTZ_ROOM){
		//	code = 126;
		//}
		sySocket.sendComReqMsg(code,[],[obj.fileId]);
	},

	/**
	 * 播放自己的语音回调，放入消息队列
	 */
	playSelfAudioCb:function(){
		GvoiceMessageSeq.receive({params:[0],strParams:[PlayerModel.userId,"self"]});
	},

	onUserAudioPlayStart:function(param){
		try{
			SdkUtil.sdkLog("游戏收到start消息:"+param);
			AudioManager.pause_bg();
			AudioManager.setEffectsVolume(0);
			var obj=JSON.parse(param);
			var fileId = obj.fileId;
			var userId = PlayerModel.userId;
			if(fileId==GvoiceMessageSeq.getCurrentFileId()){
				userId = GvoiceMessageSeq.getCurrentUserId();
			}
			SyEventManager.dispatchEvent(SyEvent.USER_AUDIO_PLAY_START, userId);
		}catch(e){
			SdkUtil.sdkLog(e.toString());
		}
	},
	onUserAudioPlayFinish:function(param){
		try{
			AudioManager.resume_bg();
			AudioManager.setEffectsVolume(PlayerModel.isEffect/100);
			SdkUtil.sdkLog("游戏收到finishi消息:"+param);
			var obj=JSON.parse(param);
			var filePath = obj.filePath;
			var userId = PlayerModel.userId;
			if(filePath.indexOf("syGvoiceAudio")<0){
				userId = GvoiceMessageSeq.getCurrentUserId();
			}
			SyEventManager.dispatchEvent(SyEvent.USER_AUDIO_PLAY_FINISH, userId);
			GvoiceMessageSeq.finishPlay();
		}catch(e){
			SdkUtil.sdkLog(e.toString());
		}
	}
}