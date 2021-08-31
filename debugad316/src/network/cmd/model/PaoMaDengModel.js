var PaoMaDengModel = {
	normalMsgs:[],
	normalIndex:-1,
	maxNormalIndex:0,
	impMsgs:[],
	intervalTime:0,
	specialMsgs:[],
	urgentMsgs:[],

	isHasMsg:function(){
		return (this.impMsgs.length>0 || this.normalMsgs.length>0 || this.specialMsgs.length>0 || this.urgentMsgs.length>0);
	},

	isHasImportMsg:function(){
		return (this.impMsgs.length>0 && this.impMsgs[0].played==0);
	},

	isHasUrgentMsg:function(){
		return (this.urgentMsgs.length>0 && this.urgentMsgs[0].played==0);
	},

	isPlayImportMsg:function(){
		for(var i=0;i<this.impMsgs.length;i++){
			var msg = this.impMsgs[i];
			if(msg.played<msg.round)
				return true;
		}
		return false;
	},

	isPlaySpecialMsg:function(){
		for(var i=0;i<this.specialMsgs.length;i++){
			var msg = this.specialMsgs[i];
			if(msg.played<msg.round)
				return true;
		}
		return false;
	},

	getCurrentMsg:function(){
		var data = this.normalMsgs;
		if(this.isPlayImportMsg()){
			data = this.impMsgs;
		}else if(this.isPlaySpecialMsg()){
			data = this.specialMsgs;
		}else if(this.isHasUrgentMsg()){
			data = this.urgentMsgs;
		}

		var now = sy.scene.getCurServerTime();
		var retMsg = null;
		if(this.normalIndex>this.maxNormalIndex)
			this.normalIndex = -1;
		for(var i=0;i<data.length;i++){
			var msg = data[i];
			//cc.log("msg.type=="+msg.type);
			if(now>msg.starttime && (msg.endtime<=0 || now<msg.endtime)){
				if(msg.type==1){//重要消息
					if(msg.played<msg.round){
						retMsg = msg;
						break;
					}
				}else if(msg.type==2){//重要消息
					if(msg.played<msg.round){
						retMsg = msg;
						break;
					}
				}else if(msg.type == 3){//紧急消息
					if(i>=this.normalIndex){
						retMsg = msg;
						break;
					}
				}else if(msg.type==4){//比赛消息
					if(msg.played>=msg.round){//将已播放的消息删除
						data.splice(i,1)
						msg = data[i]
					}
					if(msg.played<msg.round){
						retMsg = msg;
						break;
					}
				}else{//普通消息
					if(i>=this.normalIndex){
						retMsg = msg;
						break;
					}
				}
			}
		}
		return retMsg;
	},

	init:function(user){
		//var user = [];
		//user[0] = {"content":"普通跑马灯测试no1 普通跑马灯测试no2","round":2,"delay":0,"id":1,"type":1,"endtime":1556198058864,"starttime":1546198058864};
		//user[1] = {"content":"普通跑马灯测试no1 普通跑马灯测试no2","round":2,"delay":0,"id":1,"type":1,"endtime":1556198058864,"starttime":1546198058864};
		//{"content":"普通跑马灯测试no1","round":5,"delay":0,"id":1,"type":0,"endtime":1505879914000,"starttime":1474334524000}
		//cc.log(JSON.stringify(user));
		this.intervalTime=0;
		this.normalMsgs.length=this.impMsgs.length= this.specialMsgs.length = this.urgentMsgs.length = 0;
		for(var i=0;i<user.length;i++){
			var msg = user[i];
			msg.played = 0;
			if(msg.type == 0){
				msg.index = this.normalMsgs.length;
				this.normalMsgs.push(msg);
			}else if(msg.type==2){
				msg.round =  msg.round || 3;
				msg.intval = 0;
				this.specialMsgs.push(msg);
			}else if(msg.type == 3){
				msg.index = this.urgentMsgs.length;
				this.urgentMsgs.push(msg);
			}else{
				msg.round =  msg.round || 5;
				msg.intval = 0;
				this.impMsgs.push(msg);
			}
		}
		if (this.urgentMsgs && this.urgentMsgs.length > 0){
			this.maxNormalIndex = this.urgentMsgs.length-1;
		}else{
			this.maxNormalIndex = this.normalMsgs.length-1;
		}

	}
}