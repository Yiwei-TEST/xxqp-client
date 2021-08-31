/**
 * Created by fc on 2018/4/4.
 */
var ComReq = {

	comReqCreateRoom:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(1 , tIntParam , tStrParam);
	},

	/**
	 *  不要
	 */
	comReqGiveUpOutCard:function (){
		sySocket.sendComReqMsg(124 , []);
	},

	/**
	 * 准备
	 */
	comReqReady:function(){
		sySocket.sendComReqMsg(4);
	},

	/**
	 * 解散房间
	 */
	comReqReleaseRoom:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];

		sySocket.sendComReqMsg(7 , tIntParam , tStrParam);
	},

	/**
	 * 离开房间
	 */
	comReqLeaveRoom:function(){
		sySocket.sendComReqMsg(6);
	},

	/**
	 * 开始下一局
	 */
	comReqStartNextGame:function(){
		sySocket.sendComReqMsg(3);
	},

	/**
	 * 取消托管
	 */
	comReqCancelTuoguan:function(){
		sySocket.sendComReqMsg(131);
	},

	/**
	 * 切服消息
	 */
	comReqChangeSrv:function(intParam , strParam,optType){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		var optType = optType || 0;
		sySocket.sendComReqMsg(29 , tIntParam , tStrParam ,optType);
	},

	/**
	 * 加入房间
	 */
	comReqJoinRoom:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(2 , tIntParam , tStrParam);
	},

	/**
	 * 获取大厅消息
	 */
	comReqHomeMsg:function(intParam){
		sySocket.sendComReqMsg(12,intParam);
	},

	/**
	 * 签到
	 */
	comReqSignUp:function(intParam){
		sySocket.sendComReqMsg(15,intParam);
	},


	/**
	 * 刷新GPS定位
	 */
	comReqGpsData:function(intParam, strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(30,tIntParam,tStrParam);
	},

	/**
	 * 请求玩家发送的语音
	 */
	comReqGetAudio:function(intParam, strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(31,tIntParam,tStrParam);
	},

	/**
	 * DTZ 选择座位消息
	 */
	comReqChoiceSeat:function(seat){
		sySocket.sendComReqMsg(120 , [seat])
	},

	/**
	 * DTZ 获取记牌器数据
	 */
	comReqJiPaiQi:function(){
		sySocket.sendComReqMsg(129);
	},

	/**
	 * PHZ 放招
	 */
	comReqFangZhao:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(24,tIntParam , tStrParam);
	},

	/**
	 * BBT 开枪
	 */
	comReqKaiQiang:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(152,tIntParam,tStrParam);
	},

	/**
	 * BBT 抢
	 */
	comReqQiang:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(153,tIntParam,tStrParam);
	},

	/**
	 * BBT 陡
	 */
	comReqBBTDou:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(154,tIntParam,tStrParam);
	},

	/**
	 * BBT 锤
	 */
	comReqBBTChui:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(151,tIntParam,tStrParam);
	},

	/**
	 * 获取俱乐部房间信息
	 */
	comReqGetClubRoomsData:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(95,tIntParam,tStrParam);
	},


	/**
	 * 获取俱乐部包厢配置信息 房间消息
	 */
	comReqGetClubBagsData:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(134,tIntParam,tStrParam);
	},

	/**
	 * 获取俱乐部包厢房间列表
	 */
	comReqGetClubBagRoomsData:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(135,tIntParam,tStrParam);
	},

	/**
	 * 获取俱乐部房间详情
	 */
	comReqClugRoomDetail:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(96 ,tIntParam ,tStrParam);
	},

	/**
	 * 发送消息让后台通知其他房间内玩家请求GPS数据
	 */
	comReqCallPlayerUpdateGps:function(intParam , strParam){
		cc.log("comReqCallPlayerUpdateGps：：" , intParam);
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(250 ,tIntParam ,tStrParam);
	},

	/**
	 * 请求金币场玩法配置
	 */
	comReqMoneyConfig:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(905 , tIntParam , tStrParam);

	},

	/**
	 * 请求比赛场玩法配置
	 */
	comReqMatchConfig:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(100 , tIntParam , tStrParam);
	},


	/**
	 * 请求比赛场历史战绩
	 * 	int数组
	 	0:0 取历史排行（1：页码，2：页大小）
	 	0:1取当前场的排名
	 */
	comReqMatchRecord:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(200 , tIntParam , tStrParam);
	},


	/**
	 * 请求礼品兑奖
	 * 	int数组
	 0:1
	 */
	comReqTaskGift:function(intParam , strParam){
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(300 , tIntParam , tStrParam);
	},

	/**
	
	 * 	str数组 playType|count,playType|count....
	 */
	comReqStatisticsClick:function(intParam , strParam){
		cc.log("comReqStatisticsClick==",JSON.stringify(strParam))
		var tIntParam = intParam || [];
		var tStrParam = strParam || [];
		sySocket.sendComReqMsg(137 , tIntParam , tStrParam, 9);
	}



}