
/**
 *  服务器时间管理类
 * 
 */	
var ServerTimeManager = {
	serverTime : null,	
	localTime : null,
	
	/**
	 * 更新服务器时间
	 * 
	 */	
	update : function(value){
		this.localTime = new Date().getTime();
		this.serverTime = value;
	},	
	
	/**
	 * 获取当前服务器时间(毫秒)
	 * 
	 */	
	getServerTime : function(){
		var time = new Date().getTime();
		return time - this.localTime + this.serverTime;
	},
};