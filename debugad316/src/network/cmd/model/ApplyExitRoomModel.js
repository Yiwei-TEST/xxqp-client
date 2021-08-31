/*
var ApplyExitRoomModel = {
	time:null,
	fal:null,
	timeStr:null,
	contentStr:null,

	init:function(message){
		var state = message.params[0];
		this.time = message.params[1];
		this.fal = (state == 0) ? true : false;
		this.timeStr = this.changeTime(this.time);
		this.contentStr =""
		for(var i=0;i<message.strParams.length;i++){
			this.contentStr += message.strParams[i]+"\n";
		}
	},

	changeTime:function(time){
		var f = Math.floor(time/60);
		var m = Math.floor(time-f*60);
		var str = ((f>0) ? f+"分" : "") +m+"秒";
		var timeStr = str+"之后将自动同意";
		return timeStr;
	},
}*/


var ApplyExitRoomModel = {
	time:null,
	fal:null,
	timeStr:null,
	isShow:false,

	init:function(message){
		var state = message.params[0];
		this.time = message.params[1];
		this.fal = (state == 0) ? true : false;
		this.timeStr = this.changeTime(this.time);
		this.array = [];
		for(var i=0;i<message.strParams.length;i++){
			cc.log("解散房间后台下发的玩家状态数据..." , message.strParams[i].split(","));
			this.array.push(message.strParams[i].split(","));
		}
		this.isShow = true;
	},
	reduceTimeBySecond:function(){
		this.time-=1;
		this.time = this.time<0 ? 0 : this.time;
		return this.time;
	},

	getTimeStr:function(){
		var time = this.time;
		var f = Math.floor(time/60);
		var m = Math.floor(time-f*60);
		var str = ((f>0) ? f+"分" : "") +m+"秒";
		var timeStr = str+"之后将自动解散";
		return timeStr;
	},

	changeTime:function(){
		var time = this.time;
		var f = Math.floor(time/60);
		var m = Math.floor(time-f*60);
		var str = ((f>0) ? f+"分" : "") +m+"秒";
		var timeStr = str+"之后将自动解散";
		return timeStr;
	}
}
