/**
 * 可倒计时 也可顺计时
 */
var TimerLabel = {
	isUpdateTime : false,      // 是否刷新时间
	isFallTime:false, //是否倒计时
	isTimeState:false,//是否比赛开始
	beginTime : 0.0,
	currTime:0.0,
	endTime:0.0,
	init : function(fal){
		this.isUpdateTime = fal;
	},
	
	isStart:function(){
		return this.isUpdateTime;
	},
	
	stop : function(){                               // 停止计时
		this.isUpdateTime = false;
	},
	
//	updateTime : function(){                                      // 刷新计时
//		SyEventManager.dispatchEvent(SyEvent.UPDATE_TIME);
//	},
	
	timeFall:function(value){
		var obj = {};
		var poor = value/1000;
		if(poor <= 0) return "00:00:00";
		var hm = poor;
		var s = parseInt(hm/3600);
		var f = parseInt((hm - s*3600)/60);
		var m = parseInt((hm - s*3600 - f*60));
		s = s < 10 ? ("0"+s) : s;
		f = f < 10 ? ("0"+f) : f;
		m = m < 10 ? ("0"+m) : m;
		obj.s = s;
		obj.f = f;
		obj.m = m;
		return obj;
	},
	
//	isInPopup:function(popName){
//		var result = false;
//		for(var i=0;i<popName.length;i++){
//			if(PopupManager.hasClassByPopup(popName[i])){
//				result = true;
//				break;
//			}
//		}
//		return result;
//	},
	
	serverTime : function(){      // 获取服务器时间
		this.currTime = ServerTimeManager.getServerTime() ;// 服务器时间
		return this.currTime;
	},
	
	dispose : function(){
		this.stop();
	}
};