var DTZClickRecordModel = {
	roomId:0,
	tims:0,
	playData:[],
	winorLoss:0,
	team1Score:0,
	team2Score:0,
	team3Score:0,
	offScore:0,
	roomExScore:0,
	addExScoreTeam:0,


	init:function(curData){
		if(curData){
			this.roomId = curData.roomId;
			this.times = curData.times;
			this.playData = curData.playData;
			this.winorLoss = curData.winorLoss;
			this.team1Score = curData.team1Score;
			this.team2Score = curData.team2Score;
			this.team3Score = curData.team3Score;
			this.offScore = curData.offScore;
			this.roomExScore = curData.roomExScore;
			this.addExScoreTeam = curData.addExScoreTeam;
			cc.log("打印记录的玩家点击的那一条战绩..." , JSON.stringify(curData));
		}
	}
}