/**
 * 接入SDK的util类
 */
var SdkUtil = {
	SHARE_URL:"https://jmnlra.id/sqwjkyyslv",
	SHARE_ROOM_URL:"https://jmnlra.id/sqwjkyyslv",
	//SHARE_CAED_URL:"http://dtztest.gm.52nmw.cn/pdkuposa/d9/", //测试服gm.dtz.klwgame.com
	SHARE_CAED_URL:"https://jmnlra.id/sqwjkyyslv", //正式服
	COMMON_HTTP_URL:"https://ieqppa.id/doupjfhjis", //正式服
	isIosAudit:0,
	payType:"",
	fcNewParams:null,

	isWeiXinLogin: function() {
		var access_token = cc.sys.localStorage.getItem("weixin_auto_login_data");
		return (access_token != null && access_token != "");
	},

	hasXianLiao: function() {
		return SyConfig.XLPF ? true : false;
	},

	isReview:function(){
		if(SyConfig.isIos()){
			//var now = new Date().getTime();
			return false;//(SyConfig.VERSION_CODE=="2.0.3");
		}else{
			return false;
		}
	},

	hasDTalk: function() {
		if (SyConfig.isIos()) {
			return (SyConfig.VERSION_CODE=="1.0.5" || SyConfig.hasOwnProperty("XLPF"));
		} else {
			return SyConfig.hasOwnProperty("HAS_DTALK");
		}
	},

	isIphoneX: function() {
		//var iphone = SyConfig.isIos() ? ios_sdk_osinfo() : "";
		//return (iphone=="iPhone10,3" || iphone=="iPhone10,6");
		return (sy.is_iPhoneX == 1);
	},

	isLiuHaiPin:function () {
		var size = cc.view.getFrameSize();
		return size.width/size.height >2;
	},
	 
	isIosReviewVersion:function(){
		return false;
		//return (SyConfig.isIos() && !LoginData.isCnUser() && PlayerModel.getLocalLoginLevel() < 30);
	},

	isYYBReview:function(){
		return false;
		//return (SyConfig.isAndroid() && LoginData.versionCode=="118");
	},

	is316Engine:function(){
		return cc.ENGINE_VERSION.indexOf("16") >= 0;
	},

	getPackageName:function(){
		if(!SyConfig.PACKAGE_NAME)
			return "com.cb.dtz";
		return SyConfig.PACKAGE_NAME;
	},

	sdkPaste:function(string){
		if(SyConfig.isSdk()==false) return;
		if(SyConfig.isAndroid()){
			jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkPaste", "(Ljava/lang/String;)V", string);
		}else if(SyConfig.isIos()){
			ios_sdk_paste(string);
		}
	},

	/**
	 * 检查root及开发者选项是否开启
	 * @returns {number}
	 */
	sdkRootCheck:function(checkType){
		var result = 0;
		if(SyConfig.isSdk()==false) return;
		if(SyConfig.isAndroid() && SyConfig.hasOwnProperty("ROOT_CHECK")){
			result = jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkRootCheck", "(Ljava/lang/String;)V", checkType);
		}
		return result;
	},

	/**
	 * SDK登录
	 */
	sdkLogin:function(){
		if(SyConfig.isSdk()==false) return;
		if (this.hasXianLiao()) {
			SyConfig.PF = SyConfig.WXPF;
		}
		if(SyConfig.isAndroid()){
			jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkLogin", "()V");
		}else if(SyConfig.isIos()){
			ios_sdk_login();
		}
	},

	sdkXLLogin:function(){
		SdkUtil.sdkLog("sdkXLLogin...");
		if(SyConfig.isSdk()==false) return;
		SyConfig.PF = SyConfig.XLPF;
		if(SyConfig.isAndroid()){
			jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkXLLogin", "()V");
		}else if(SyConfig.isIos()){
			ios_sdk_login("xianliao");
		}
	},

	/**
	 * 登录回调
	 * @param json {code:""}
	 */
	sdkLogincb:function(json){
		setTimeout(function(){
			if(SyConfig.isWX()){
				var params = JSON.parse(json);
				if (params.hasOwnProperty("isXL")) {
					SdkUtil.sdkLog("xian liao login callback...");
					XLHelper.xl_first_login(params);
				} else {
					SdkUtil.sdkLog("wei xin login callback...");
					WXHelper.first_login(json);
				}
			}
		},10);
	},

	sdkGetTJDServer:function(host, port){
		if(SyConfig.isSdk()==false) return;
		var params = {};
		params.host = host;
		params.port = port;
		if(SyConfig.isAndroid()){
			var json = jsb.reflection.callStaticMethod("net/sy599/common/TJDHelper", "getIp", "(Ljava/lang/String;)Ljava/lang/String;",JSON.stringify(params));
		} else {
			var json = ios_sdk_getTJDServer(JSON.stringify(params));
		}
		this.sdkLog("sdkGetTJDServer1::"+json);
		try{
			var obj = JSON.parse(json);
		}catch(e){
			this.sdkLog("json::"+e);
		}
		this.sdkLog("sdkGetTJDServer2::"+json);
		return obj;
	},

	isExitsFunction: function(funcName) {
		try {
			if (typeof(eval(funcName)) == "function") {
				return true;
			}
		} catch(e) {}
		return false;
	},

	sdkGetLoginParams:function(){
		if(SyConfig.isSdk()==false) return '{}';
		if(SyConfig.isAndroid()){
			return jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "getLoginParams", "()Ljava/lang/String;");
		}else if(SyConfig.isIos()){
			if(this.isExitsFunction("ios_sdk_getLoginParams")){
				var lp =  ios_sdk_getLoginParams();
				return lp;
			}
		}
		return "{}";
	},
	/**
	 * sdk提交玩家数据
	 */
	sdkSubmitData:function(){
		if(SyConfig.isSdk()==false) return;
		var subJson = '{"flatId":"1111",';
		subJson += '"name":"'+PlayerModel.username+'",';
		subJson += '"uid":"'+PlayerModel.userId+'",';
		subJson += '"serverName":"test",';
		subJson += '"serverId":1}';
		if(SyConfig.isAndroid()){
			jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkSubmitData", "(Ljava/lang/String;)V", subJson);
		}else if(SyConfig.isIos()){
			if(this.isExitsFunction("ios_sdk_gotyeLogin")){
				ios_sdk_gotyeLogin(subJson);
			}
		}
	},

	/**
	 * 去浏览器打开链接
	 * @param url
	 */
	sdkOpenUrl: function(url) {
		if(SyConfig.isIos() ){
			ios_sdk_openUrl(url);
		}else{
			cc.Application.getInstance().openURL(url);
		}
	},



	/**
	 * SDK支付
	 * @param itemId
	 */
	sdkPay:function(num,id,agencyUserId){
		//if(SyConfig.isSdk()==false) return;
		var self = this;
		//var payType="tonglian";//SyConfig.isIos()?"weixin":"tonglian";
		var payType = SdkUtil.isReview()?"apple":this.payType; //"webzyfdtz";
		sy.scene.showLoading("正在发起支付");
		var sekey = "mwFLeKLzNoL46dDn0vE2";
		var pname = encodeURIComponent(this.getPackageName());
		var param = {
			flat_id:PlayerModel.username,   //游客传userName weixin传openId
			server_id:1,
			p:PlayerModel.pf,
			itemid:id,
			total_fee:num,
			payType:payType,
			k:"",
			c:"",
			pname:pname,
			visitor:0  //0微信 1游客
		};
		if(agencyUserId>0){
			param.agencyUserId = agencyUserId;
		}
		SdkUtil.sdkLog("===>start pay::"+JSON.stringify(param));
		param.k = md5(param.flat_id+param.server_id+param.p+param.itemid+sekey);
		Network.gameReq("ovali_com", param,
			function(data){
				if(payType!="apple")sy.scene.hideLoading();
				SdkUtil.sdkLog("===>ovali_com resp::"+JSON.stringify(data));
				if(data.code==0){
					if(data.hasOwnProperty("url")==false){
						cc.log("获取订单返回没有url参数");
						SdkUtil.sdkLog("获取订单返回没有url参数");
						return;
					}
					data.url.payType=payType;
					var str="";
					switch(payType){
						case "apple":
							str=JSON.stringify(data.url);
							if(SyConfig.isIos()){
								self.cacheOrderId=data.url.order_id;
								ios_sdk_applepay(str);
							}
							break;
						case "weixin":
							str=JSON.stringify(data.url);
							if(SyConfig.isAndroid()){
								jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkPay",  "(Ljava/lang/String;)V", str);
							}else if(SyConfig.isIos()){
								ios_sdk_pay(str);
							}
							break;
						case "aibei":
							var transId=data.url.transId;
							str="transid="+transId+"&appid=3005638180";
							if(SyConfig.isAndroid()){
								jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkPay",  "(Ljava/lang/String;)V", str);
							}else{
							}
							break;
						case "futong":
						case "futongnmw":
						case "tonglian"	:
							if(payType=="tonglian"){
								var backStr=data.url;
								backStr=backStr.substr(1,backStr.length-2);
								data.url=JSON.parse(backStr);
								data.url.payType=payType;
							}
							str=JSON.stringify(data.url);
							if(SyConfig.isAndroid()){
								//SdkUtil.getFutongWeixinUrl(data.url);
								jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkPay",  "(Ljava/lang/String;)V", str);
							}else if(SyConfig.isIos()){
								ios_sdk_pay(str);
							}
							break;
						case "webzyfdtz":
							var webUrl = data.url.pay_info;
							SdkUtil.sdkOpenUrl(webUrl);
							break;
						default:
							var webUrl = data.url.pay_info;
							SdkUtil.sdkOpenUrl(webUrl);
							break;
					}
				}else{
					return FloatLabelUtil.comText("获取支付订单失败");
				}
			},function(data){
				SdkUtil.sdkLog("===>ovali_com error::"+JSON.stringify(data));
				sy.scene.hideLoading();
				self.cacheOrderId = "";
				return FloatLabelUtil.comText("获取支付订单失败");
			}
		);
	},

	getFutongWeixinUrl:function(wftUrl){
		sy.scene.showLoading("正在调用微信客户端");
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("GET", wftUrl);
		xhr.timeout = 12000;
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
		var self = this;
		var onerror = function(){
			xhr.abort();
			if(self._onErr)	self._onErr("");
			cc.log("NetWork error:status:"+xhr.status);
			sy.scene.hideLoading();
			return FloatLabelUtil.comText("调用微信支付失败");
		}
		xhr.onerror = onerror;
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				sy.scene.hideLoading();
				if(xhr.status == 200){
					var str=xhr.responseText;
					cc.log(str);
					var url=str.substr(str.lastIndexOf('location.href="weixin')+15,str.length);
					url=url.substr(0,url.indexOf('";'));
					cc.Application.getInstance().openURL(url);
					SdkUtil.sdkLog("===>url::"+url);
				}else{
					return FloatLabelUtil.comText("调用微信支付失败");
				}
			}
		}

		xhr.send(wftUrl);
	},


	/**
	 * 苹果支付完成，请求后台发房卡
	 */
	cacheOrderId:"",//这个需要缓存下，发给后台做参考
	applePaycb:function(receiptData){
		var self = this;
		setTimeout(function(){
			var obj={};
			obj.receipt_data=encodeURIComponent(receiptData);
			obj.order_id=self.cacheOrderId;
			Network.payReq("apple", obj,
				function(data){
					sy.scene.hideLoading();
					if(data.code==0){
						if(self.isExitsFunction("ios_sdk_showAlert")){
							var alertObj = {title:"支付结果",msg:"支付成功"};
							ios_sdk_showAlert(JSON.stringify(alertObj));
						}
					}
				},function(data){
					sy.scene.hideLoading();
					cc.log("applePaycb error::"+JSON.stringify(data));
					//var alertObj = {title:"支付结果",msg:"支付失败 code:"+data.code};
					//ios_sdk_showAlert(JSON.stringify(alertObj));
					self.applePaycb(receiptData);
				}
			);
		},10);
	},

	applePayProcess:function(){
		sy.scene.hideLoading();
	},

	sdkFeed:function(obj,isActivity){
		//将url修正成应用宝的url，不然链接参数接了两个问号有冲突
		//obj.callURL = this.SHARE_URL;
		if(!isActivity){
			obj.callURL = this.SHARE_URL;
		}
		if (!obj.hasOwnProperty("tableId")) {
			obj.tableId = "";
		} else {
			obj.tableId += "";
		}
		var str=JSON.stringify(obj);
		cc.log(str);
		if(SyConfig.isSdk()==false) return;
		if(SyConfig.isAndroid()){
			jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkFeed",  "(Ljava/lang/String;)V", str);
		}else if(SyConfig.isIos()){
			ios_sdk_share(str);
		}
	},

	sdkFeedcb:function(jsonStr){
		var json = JSON.parse(jsonStr);
		if(ShareDailyModel.isFromShareDaily){
			ShareDailyModel.isFromShareDaily = false;
			if(json.code==0){
				// if(!ActivityModel.isHomeLayerShare){
				ActivityModel.setIsSendShareMsg(true);
				// }
				if (ShareDailyModel.isNewShareDaily){
					ShareDailyModel.isNewShareDaily = false;
					var url = "http://bjdqp.firstmjq.club/agent/player/shareTaskCallback/wx_plat/mjqz?";
					var resultUrl = Network.getWebUrl(url);
					if (resultUrl){
						Network.onSendShareSuccess(resultUrl);
					}
				}
				if(!ActivityModel.isBrokeShare && !ActivityModel.isHomeLayerShare ){
					Network.loginReq("qipai","share",{action:2},function(data){
						var pop = new AwardPop(data.diamond);
	            		PopupManager.addPopup(pop);
						// FloatLabelUtil.comText("分享成功！恭喜您获得：白金豆x"+data.diamond+"!");
					})
				}
			}
		}
	},

	sdkLog:function(str){
		if(SyConfig.isSdk()==false){
			cc.log(str);
			return;
		}
		if(SyConfig.isAndroid()){
			jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkLog",  "(Ljava/lang/String;)V", str);
		}else{
			//if(this.isExitsFunction("ios_sdk_log")){
			//	return ios_sdk_log(str);
			//}else{
			cc.log(str);
			//}
		}
	},
	sdkExit:function(){
		if(SyConfig.isSdk()==false)return;
		if(SyConfig.isAndroid()){
			jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "onExit",  "()V");
		}else{

		}
	},
	/**
	 * 电量
	 * @returns {Number}
	 */
	getBatteryNum:function(){
		if(SyConfig.isSdk()==false)return 50;
		if(SyConfig.isAndroid()){
			//SdkUtil.sdkLog("battery:"+jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "batteryNum",  "()I"));
			return jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "batteryNum",  "()I");
		}else if(SyConfig.isIos()){
			if(this.isExitsFunction("ios_sdk_battery")){
				return ios_sdk_battery();
			}
		}
		return 0;
	},

	/*
	 * setOrientation
	 */
	setOrientation: function(orientation) {
		var ret = -1;
		if(SyConfig.isAndroid()){
			ret = jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "setOrientation",  "(I)I", orientation);
		}
		if (ret == 0) {
			var width = 0;
			var height = 0;
			if (orientation == 1) {
				width = SyConfig.DESIGN_WIDTH;
				height = SyConfig.DESIGN_HEIGHT
			} else if (orientation == 2) {
				width = SyConfig.DESIGN_HEIGHT;
				height = SyConfig.DESIGN_WIDTH;
			}

			var frameSize = cc.view.getFrameSize();
			var displayMode = cc.ResolutionPolicy.FIXED_HEIGHT;
			if(orientation == 1 && frameSize.height/frameSize.width < SyConfig.DESIGN_WIDTH/SyConfig.DESIGN_HEIGHT){
				displayMode = cc.ResolutionPolicy.SHOW_ALL;
			}else if(orientation == 2 && frameSize.width/frameSize.height <  SyConfig.DESIGN_WIDTH/SyConfig.DESIGN_HEIGHT){
				displayMode = cc.ResolutionPolicy.SHOW_ALL;
			}
			cc.view.setFrameSize(frameSize.height, frameSize.width);
			cc.view.setDesignResolutionSize(width, height, displayMode);
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 信号类型
	 * 1 wifi
	 * 2 2g
	 * 3 3g
	 * 4 4g
	 */
	getNetworkType:function(){
		if(SyConfig.isSdk()==false)return 1;
		if(SyConfig.isAndroid()){
			return jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "getNetworkType",  "()I");
		}else if(SyConfig.isIos()){
			if(this.isExitsFunction("ios_sdk_nettype")){
				return ios_sdk_nettype();
			}
		}
		return 0;
	},

	isAppInstalled: function(packageName) {
        if (SyConfig.isAndroid()) {
            var ret = jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "isAppInstalled", "(Ljava/lang/String;)I", packageName);
            return ret == 1;
        }
	},

    startDownApp: function(url, newVersionCode, msg) {
        if (SyConfig.isAndroid()) {
            var params = {
                "url": url,
                "message": "正在下载游戏...",
                "newVersionCode": newVersionCode,
                "appName": "bjd_hj"
            }
            return jsb.reflection.callStaticMethod("net/sy599/olupdate/OnlineUpdateHelper", "downloadApk", "(Ljava/lang/String;)V", JSON.stringify(params));
        }
    },

	startOtherApp: function(pkg, val) {
        if (SyConfig.isAndroid() ) {
            jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "startOtherApp", "(Ljava/lang/String;Ljava/lang/String;)V", pkg, val);
        }
	},

    /**
    * id:广告定位id ;orientation:0横屏1竖屏;
    * adType:1是签到
    */
	byAdvertytoApp: function(id,orientation, adType) {
	    cc.log("byAdvertytoApp===",id,orientation,adType)
	    var adId = id;
	    var curOrientation = orientation || 0;
	    var adType = adType || 1;
        if ((SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW) && SyConfig.isAndroid()) {
           jsb.reflection.callStaticMethod("net/sy599/wmad/config/TTAdManagerHolder", "loadAd", "(Ljava/lang/String;II)V",adId,curOrientation,adType);
        }
    },

    byAdvertycb:function(adType){
        cc.log("byAdvertycb====",adType)
        if (adType){
            var curAdType = Number(adType);
            if (curAdType == 1){
				SignInModel.isDoubleAward = true;
            }else if(curAdType == 2){
				AwardModel.isSuperRiseAward = true;
			}else if(curAdType == 3){
				SignInModel.isNewDoubleAward = true;
			}else if(curAdType == 4){
				SignInModel.isChouJiangDouble = true;
			}else if(curAdType == 5){
				GoldResultModel.isNeedRiseAward = true;
			}else if(curAdType == 6){
				//QueQiaoConfigModel.isHasPlayEnd = true;
			}else if(curAdType == 7){
				GoldenEggsModel.isGetPacketAgain = true;
			}else if(curAdType == 8){
				NewCarnivalModel.isDoubleTaskAward = true;
			}
        }

    },

    upOpenAd:function(){
        if (this.fcNewParams && this.fcNewParams.isSplash) {
           jsb.reflection.callStaticMethod("net/sy599/push/Cocos2dxLocalStorage", "saveSettingNote", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V","bjdgq", "isOpenad","CLOSE");
        }
    },

    initNewFcParams:function(){
        if (SyConfig.IS_FC_PARAMS && SyConfig.isAndroid()) {
           var json = jsb.reflection.callStaticMethod("net/sy599/push/Cocos2dxLocalStorage", "getNewFcParams", "()Ljava/lang/String;");
           try{
                var obj = JSON.parse(json);
            }catch(e){
                this.sdkLog("json::"+e);
            }
           this.fcNewParams = obj;
           cc.log("initNewFcParams====",JSON.stringify(obj))
        }
    }

}