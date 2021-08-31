var BeansConfigModel = {

	signInData:null,
	dailyTask:null,
	challengeTask:null,
	aloneConfig:null,
	showMissionRedPoint:false,
	slzContent:[],//赛龙舟活动数据
	playNum:0,//当天金币场对局数
	goldNum:0,//龙舟活动获得的金币总数
	isDWActive:false,//是不是端午活动
	showDWSLZRedPoint:false,//龙舟活动
	init:function(data){
		this.signInData = data.sign;
		this.aloneConfig = data.aloneConfig;
	}
}