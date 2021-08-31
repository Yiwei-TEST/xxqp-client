var PhoneLoginModel = {
	phone:null,
	phonePassword:null,
	
	init:function(){
		this.phone = cc.sys.localStorage.getItem("login_phone_u");
		this.phonePassword = cc.sys.localStorage.getItem("login_phone_psd");
        //
		//cc.log("this.phone==",this.phone);
		//cc.log("this.phonePassword==",this.phonePassword);
	},

	clean:function(){
		this.phone = null;
		this.phonePassword = null;
	},

	getPhone:function(){
		return this.phone;
	},

	getPhonePassword:function(){
		return this.phonePassword;
	},


	setPhone:function(_phone){
		this.phone = _phone;
		cc.sys.localStorage.setItem("login_phone_u", _phone);

	},

	setPhonePassword:function(_password){
		this.phonePassword = _password;
		cc.sys.localStorage.setItem("login_phone_psd", _password);
	},
}