var BaseCmd = cc.Class.extend({
	
	/**
	 * 发送网络消息
	 * @param command
	 * @param param
	 * @param sucesscb
	 */
	execute:function(command, param, sucesscb, failcb){
		Network.gameReq(command, param,
			function(data){
				this.onComResponse(data);
				this.onSuccess(data); 
				if(sucesscb)	
					sucesscb(data);
			}.bind(this),
			function(data){
				this.onError(data);
				if(failcb)	
					failcb(data);
			}.bind(this));
	},
	
	/**
	 * 通用数据响应处理
	 * @param data
	 */
	onComResponse:function(data){
		var updateObj = {};

	},
	
	/**
	 * 通讯成功后的回调,子类覆盖后在这里处理model数据更新
	 * @param data
	 */
	onSuccess:function(data){
		throw new Error("BaseCmd's subclass must override function onSuccess");
	},
	
	/**
	 * 响应失败后的回调
	 * @param data
	 */
	onError:function(data){
		
	}
})

