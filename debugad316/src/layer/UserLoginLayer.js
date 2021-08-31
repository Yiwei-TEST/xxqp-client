//
var UserLoginLayer = BasePopup.extend({
	model:null,
	textInput:null,
	registerMc:null,
	loginMc:null,
	login_username:null,
	login_psd:null,
	register_username:null,
	register_psd:null,
	register_psd_again:null,
	btnRegister:null,
	btnLogin:null,
	btnServer:null,
	ctor:function(){
		//this.touchClose=false;
		this._super("res/loginPanel.json");
		//this.setContentSize(535, 530);
		return true;
	},
	selfRender:function(){
		//this.x=400;
		//this.y=250;
		this.registerMc=ccui.helper.seekWidgetByName(this.root, "Panel_register");
		this.loginMc=ccui.helper.seekWidgetByName(this.root, "Panel_login");
		var try_btn = ccui.helper.seekWidgetByName(this.root, "Button_try");
		try_btn.visible = false;
		UITools.addClickEvent(try_btn,this,this.tryFuc);
		var login_btn = ccui.helper.seekWidgetByName(this.root, "Button_login");
		UITools.addClickEvent(login_btn,this,this.login);
		login_btn.x = 270;
		// login_btn.x = this.loginMc.width/2;
		var btnRegister= ccui.helper.seekWidgetByName(this.root, "Button_register");
		UITools.addClickEvent(btnRegister,this,this.regisger);
		btnRegister.visible = !!SyConfig.DEBUG;
		var btnServer= ccui.helper.seekWidgetByName(this.root, "Button_server");
		UITools.addClickEvent(btnServer,this,this.server);
		var u=cc.sys.localStorage.getItem("login_u");
		var psd=cc.sys.localStorage.getItem("login_psd");
		var visiterU=cc.sys.localStorage.getItem("u");
		var visiterPsd=cc.sys.localStorage.getItem("psd");
		this.login_username=this.setEditBox("点击输入账号","",292,300,this.loginMc);
		this.login_psd=this.setEditBox("点击输入密码","",292,153,this.loginMc);
		this.login_psd.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
		if(u&&psd){
			this.login_username.setString(u);
			this.login_psd.setString(psd);
		}else if(visiterU&&visiterPsd){
			this.login_username.setString(visiterU);
			this.login_psd.setString(visiterPsd);
		}

		var Image_name = this.registerMc.getChildByName("Image_name");
		var Image_19 = this.registerMc.getChildByName("Image_19");
		var Image_21 = this.registerMc.getChildByName("Image_21");
		var Image_20 = this.registerMc.getChildByName("Image_20");
		this.register_playername=this.setEditBox("点击输入昵称","",226,40,Image_name);
		this.register_username=this.setEditBox("点击输入账号 6-17位","",226,40,Image_19);
		this.register_psd=this.setEditBox("6位以上字母和数字组合","",226,40,Image_21);
		this.register_psd_again=this.setEditBox("6位以上字母和数字组合","",226,40,Image_20);
		this.register_psd.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
		this.register_psd_again.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);

		var okRegister= ccui.helper.seekWidgetByName(this.root, "Button_okRegister");
		UITools.addClickEvent(okRegister,this,this.toRegister);
		var backBtn= ccui.helper.seekWidgetByName(this.root, "Button_back");
		UITools.addClickEvent(backBtn,this,this.onBack);
		this.model=new LoginModel();
		this.showType(0);
	},

	onBack:function(){
		this.showType(0);
	},

	setEditBox:function(holder,str,_x,_y,_parent){
		var textf=new cc.EditBox(cc.size(452, 81),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
		textf.x=_x;
		textf.y=_y;
		_parent.addChild(textf);
		textf.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
		textf.setPlaceHolder(holder);
		textf.setString(str);
		textf.setFontColor(cc.color("#ffffff"));
		textf.setFont("Arial",40);
		textf.setPlaceholderFont("Arial",40);
		textf.maxLength=17;
		return textf;
	},
	
	login:function(){
		cc.log("login");
		this.model.login(this.login_username.getString(), this.login_psd.getString(),"");
	},
	tryFuc:function(){
		cc.log("try");
		this.model.tryLogin();
	},
	regisger:function(){
		cc.log("register");
		this.showType(1);
		this.register_username.setString("");
		this.register_psd.setString("");
		this.register_psd_again.setString("");
	},
	server:function(){
		cc.log("server");
		var pop = new ServicePop();
		PopupManager.addPopup(pop);
		//AlertPop.showOnlyOk("问题反馈，请联系：\n\n客服电话：4008388629\n客服QQ：2939450050\n客服邮箱：csxunyoukefu@qq.com");
	},
	toRegister:function(){
		cc.log("toregisger",this.register_username.getString(),this.register_playername.getString());
		this.model.register(this.register_username.getString(), this.register_psd.getString(), this.register_psd_again.getString(),this.register_playername.getString());
	},
	showType:function(type){
		if(type==0){
			this.registerMc.visible=false;
			this.loginMc.visible=true;
			this.getWidget("Image_title").loadTexture("res/ui/loginPanel/login_title_zhanghaodenglu.png")
		}else{
			this.registerMc.visible=true;
			this.loginMc.visible=false;
			this.getWidget("Image_title").loadTexture("res/ui/loginPanel/login_title_zhucezhanghao.png")
		}
	}
});
var LoginModel=cc.Class.extend({

	login:function(username,psd,c,onError){
		if(username==""){
			this.msg("登录失败","账号不能为空");
			return;
		}
		if(psd==""){
			this.msg("登录失败","密码不能为空");
			return;
		}
		var pattern = /^\w+$/i;
		var arr = username.match(pattern);
		var arr2 = psd.match(pattern);
		if(!arr){
			this.msg("登录失败","账号错误");
			return;
		}

		if(!arr2){
			this.msg("登录失败","密码错误");
			return;
		}

		if(onError){
			sy.login.realLogin({u:username,c:c,ps:psd,visitor:true},onError);
		}else{
			sy.login.realLogin({u:username,c:c,ps:psd,visitor:true});
		}
		
	},
	register:function(username,psd,psd2,playerName){
		if(username==""){
			this.msg("注册失败","账号不能为空");
			return;
		}
		if(psd==""){
			this.msg("注册失败","密码不能为空");
			return;
		}
		if(psd2!=psd){
			this.msg("注册失败","两次输入密码不一致");
			return;
		}

		if(playerName==""){
			this.msg("注册失败","昵称不能为空");
			return;
		}

		if(username.length<6||username.length>17){
			this.msg("注册失败","账号长度必须为6-17位");
			return;
		}
		if(psd.length<6||psd.length>17){
			this.msg("注册失败","密码长度必须为6-17位");
			return;
		}

		var pattern = /^\w+$/i;
		var arr = username.match(pattern);
		var arr2 = psd.match(pattern);
		if(!arr){
			this.msg("注册失败","账号只能包含字母数字和下划线");
			return;
		}

		if(!arr2){
			this.msg("注册失败","密码只能包含字母数字和下划线");
			return;
		}
		sy.scene.showLoading("正在注册");
		var secret = "mwFLeKLzNoL46dDn0vE2";
		var time=new Date().getTime();
		var c;
		var sign = "";
//		if(LoginData.h5params.c){
//			c=LoginData.h5params.c
//		}else{
			c="";
		//}
		sign += username;
		sign += psd;
		sign += time;
		sign += "self";
		sign+=c;
		sign+=secret;

		var params = {};
		var androidParams=JSON.parse(SdkUtil.sdkGetLoginParams());
		for(var key in androidParams){
			params[key]=androidParams[key];
		}
		var deviceCode = params.deviceCode || 0;
		var headimgurl = "res/res_icon/" + (Math.floor(Math.random()* 30) + 1) + ".png";
		var k = md5(sign);
		var self=this;
		Network.loginReq(//10001
				"user","register",{
					u:username,ps:psd,p:"self",c:c,t:time,k:k,nickName:""+playerName,
					headimgurl:headimgurl,deviceCode:deviceCode},
				function(obj){
					cc.log(obj.code);
					sy.scene.hideLoading();
					if(!obj.user){
						AlertPop.showOnlyOk("注册失败,返回user参数为空");
					}else{
						AlertPop.showOnlyOk("注册成功",function(){
							GameConfig.isRegist = false;
							cc.sys.localStorage.setItem("login_u",username);
							cc.sys.localStorage.setItem("login_psd",psd);
							self.login(obj.user.username,psd,c);
						});
					}
				},
				function(obj){
					sy.scene.hideLoading();
					if(obj.code){
						AlertPop.showOnlyOk("注册失败,"+obj.msg);
					}else{
						AlertPop.showOnlyOk("网络错误，请检查网络后重试");
					}

				}
		);
	},
	tryLogin:function(){
		var c;
		var u;
		var psd;
		u=cc.sys.localStorage.getItem("u");
		psd=cc.sys.localStorage.getItem("psd");
//		if(LoginData.h5params.c){
//			c=LoginData.h5params.c
//		}else{
			c="";
		//}
		cc.log("u:"+u+",psd:"+psd+" c:"+c);
		var self=this;
		if(u&&psd){
			this.login(u,psd,c,function(){
				cc.sys.localStorage.removeItem("u");
				cc.sys.localStorage.removeItem("psd");
				cc.log("登录失败");
				self.tryLogin();
			});
			return;
		}
		
		
		sy.scene.showLoading("正在为您注册账号");
		var secret = "mwFLeKLzNoL46dDn0vE2";
		var time=new Date().getTime();
		
		var sign = "";
		sign += time;
		sign += "self";
		sign+=c;
		sign+=secret;

		var k = md5(sign);
		var self=this;
		Network.loginReq(//10001
				"user","register",{p:"self",c:c,t:time,k:k},
				function(obj){
					cc.log(obj.code);
					sy.scene.hideLoading();
					if(!obj.user){
						AlertPop.showOnlyOk("注册失败,返回user参数为空");
					}else{
						cc.sys.localStorage.setItem("u",obj.user.username);
						cc.sys.localStorage.setItem("psd",obj.password);
						self.login(obj.user.username,obj.password,c);
					}
				},
				function(obj){
					sy.scene.hideLoading();
					if(obj.code){
						if(obj.code==4){
							AlertPop.showOnlyOk("注册失败，签名错误");
						}else{
							AlertPop.showOnlyOk("注册失败,"+obj.msg);
						}
						
					}else{
						AlertPop.showOnlyOk( "网络错误，请检查网络后重试 ");
					}

				}
		);
	},
	msg:function(title,str){
		AlertPop.showOnlyOk( str, function(){

		});
	}
});
