/**
 * 整包更新
 */
var OnlineUpdateUtil = {

	/**
	 * 获取当前版本的versioncode
	 * @returns
	 */
	getVersionCode:function(){
		if(!SyConfig.isSdk()){
			return -1;
		}
		var versionCode = -1;
		if(SyConfig.isAndroid()) {
			versionCode = jsb.reflection.callStaticMethod(
				"net/sy599/olupdate/OnlineUpdateHelper",
				"getVersionCode",
				"()I");
		}else if(SyConfig.isIos() && SdkUtil.isExitsFunction("ios_sdk_getVersion")){
			versionCode = ios_sdk_getVersion();
			cc.log("getVersionCode::"+versionCode);
		}
		return versionCode;
	},
	
	/**
	 * 开始下载新版本的apk
	 */
	downloadApk:function(){
		if(SyConfig.isIos()){
			ios_sdk_openUrl("itms-apps://itunes.apple.com/app/id1182847417");
		}else{
			jsb.reflection.callStaticMethod(
					"net/sy599/olupdate/OnlineUpdateHelper",
					"downloadApk", "(Ljava/lang/String;I)V", LoginData.apkurl, LoginData.apkvc);
		}
	}
}