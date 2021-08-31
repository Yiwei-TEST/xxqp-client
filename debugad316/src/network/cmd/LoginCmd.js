var LoginCmd = BaseCmd.extend({
	
	//登录
	login:function(params,sucesscb,failcb){
		this.execute(1,params,sucesscb,failcb);
	},

	onSuccess:function(data){

	},
	
	onError:function(data){
		
	}
})
LoginCmd.singleton = null;
LoginCmd.getInst = function(){
	if(!LoginCmd.singleton){
		LoginCmd.singleton = new LoginCmd();
	}
	return LoginCmd.singleton;
}