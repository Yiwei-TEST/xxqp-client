var LuckDrawModel = {
	costCards:0,
	turnNum:0,
	loginDays:0,
	awardList:[],
	luckDrawNum:0,
	
	init:function(user){
		this.costCards = user.costCards;
		this.turnNum = user.turnNum;
		this.loginDays = user.loginDays;
		this.awardList = user.awardList;
	},
	
	updataAwardList:function(value){
		this.awardList = value;
	},
	
	updataLuckDrawNum:function(value){
		this.luckDrawNum = value;
	},
	
	updataTurnNum:function(value){
		this.turnNum = value;
	},
	
};

var ShowTipsModel = {
	infoTips:null,
	luckDrawTips:null,
	updataData:function(value){
		if(value.fal == true){
			if(value.index == 1){
				this.infoTips = value.index;
			}else if(value.index == 2){
				this.luckDrawTips = value.index;
			}
		}
		if(value.fal == false){
			if(value.index == 1){
				this.infoTips = null;
			}else if(value.index == 2){
				this.luckDrawTips = null;
			}
		}
	}
}