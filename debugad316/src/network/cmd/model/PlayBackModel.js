/**
 * Created by zhoufan on 2016/7/23.
 */
/**
 * 卡牌的数据映射
 * @type {{userId: number, name: string, seat: number, sex: number, icon: string, point: number, status: number, ip: string}}
 * {"userId":"1000077858","name":"vkxou1090074","sex":1,"icon":"","point":0,"outCardIds":[],"status":1,"recover":[],"ip":"192.168.1.126","outedIds":[],"moldIds":[],"angangIds":[],"nextSeat":null,"wanfa":16,"remain":null,"handCardIds":[306,413,308,109,110,303,111,114,314,214,104,311,407,207,103,113],"seat":2,"nextSeat":3,"gameType":1,"remain":null,"selfAct":[],"banker":null},{"userId":"1000077858","name":"vkxou1090074","seat":2,"sex":1,"icon":"","point":0,"outCardIds":[],"status":1,"recover":[],"ip":"192.168.1.126","outedIds":[],"moldIds":[],"angangIds":[],"nextSeat":null,"wanfa":16,"remain":null,"handCardIds":[306,413,308,109,110,303,111,114,314,214,104,311,407,207,103,113],"userId":-114,"mySeat":1,"seat":1,"nextSeat":2,"gameType":1,"remain":null,"selfAct":[],"banker":null},{"userId":"1000077858","name":"vkxou1090074","seat":2,"sex":1,"icon":"","point":0,"outCardIds":[],"status":1,"recover":[],"ip":"192.168.1.126","outedIds":[],"moldIds":[],"angangIds":[],"nextSeat":null,"wanfa":16,"remain":null,"handCardIds":[306,413,308,109,110,303,111,114,314,214,104,311,407,207,103,113],"userId":-115,"mySeat":2,"seat":2,"nextSeat":3,"gameType":1,"remain":null,"selfAct":[],"banker":null};
 */

var PlayBackModel = {
	seatSeq:{         //座位
		1:[1,2,3],    //1号
		2:[2,3,1],    //2号
		3:[3,1,2]     //3号
	},
	tableId:0,        //房间号
	time:0,           //记录时间
	/**
	 * {Array.<RoomPlayerVo>}
	 */
	players:[],   	  //
	list:[],
	cardData1:[],  	  //我现在的牌
	cardData2:[],  	  //我下座现在的牌
	cardData3:[],  	  //我上座现在的牌
	cardData4:[],
	outCardData1:[],  //我出的牌
	outCardData2:[],  	  //我下座出的牌
	outCardData3:[],  	  //我上座出的牌
	outCardData4:[],  	  //我上座出的牌
	mySeat:0,         //我的座位
	nextSeat:0,       //下个座位
	btMap:{},         //报停
	step:0,
	outCard:{},
	wanfa:0,          //玩法
	playerLength:2,

	init:function(message,isDaiKai){
		// cc.log("message.play::::::::"+JSON.stringify(message))
		// cc.log("message.resList::::::::"+JSON.stringify(message.resList))

		this.wanfa = message.playType;
		//DTZAI.MAX_CARD = this.wanfa;
		this.tableId = message.tableId;
		this.time = message.time.substr(0,16);
		this.outCard = message.outCard;
		this.cardData1 = [];
		this.cardData2 = [];
		this.cardData3 = [];
		this.cardData4 = [];
		this.outCardData1 = [];
		this.outCardData2 = [];
		this.outCardData3 = [];
		this.outCardData4 = [];
		this.list = [];
		this.players = message.play.split(";");
		this.roomName ="";
		if(message.generalExt){
            var data = JSON.parse(message.generalExt);
            // cc.log("data.roomName =",data.roomName);
            if(data.roomName){
                this.roomName =data.roomName;
            }
        }
        // cc.log("this.roomName =",this.roomName);
		for(var i=0;i<message.resList.length;i++){
			this.list.push(JSON.parse(message.resList[i]));
		}
		// cc.log("message.resList::::::::"+JSON.stringify(this.list))
		
        this.closingMsg = JSON.parse(message.closingMsg);
		// var closingMsg = JSON.parse(message.closingMsg);
		ClosingInfoModel.ext = this.closingMsg.ext;
		ClosingInfoModel.pdkcutCard = this.closingMsg.cutCard || [];
		ClosingInfoModel.isReplay = true;
        ClosingInfoModel.closingPlayers = this.list;
        ClosingInfoModel.intParams = this.closingMsg.intParams;
        if(ClosingInfoModel.intParams)
        	QFRoomModel.isSave67 = ClosingInfoModel.intParams[3];

		if(TotalRecordModel.isDaiKai || !this.getPlayerVo()){
			this.mySeat = this.list[0].seat;
		}else{
			this.mySeat = this.getPlayerVo().seat;
		}
		// cc.log("this.list = ",JSON.stringify(this.list));
		this.playerLength = 2;
		if(this.list.length==2){
			this.seatSeq = {1:[1,2],2:[2,1]};
		}else if(this.list.length==3){
			this.playerLength = 3;
			this.seatSeq = {1:[1,2,3],2:[2,3,1],3:[3,1,2]};
		}else{
			this.playerLength = 4;
			for(var i=0;i< this.list.length;i++) {
				for (var j=0;j< message.playerMsg.length;j++) {
					if (message.playerMsg[j].userId == this.list[i].userId) {
						this.list[i].group = message.playerMsg[j].group;
					}
				}
			}
			this.seatSeq = {1:[1,2,3,4],2:[2,3,4,1],3:[3,4,1,2],4:[4,1,2,3]};
		}
		this.step = this.players.length-(message.playerMsg.length)-1;//数组前三位是玩家的初始牌信息

		this.checkTuoGuan();
	},

	checkTuoGuan:function(){
		this.tgState = {1:[0],2:[0],3:[0],4:[0]};
		var curState = {1:0,2:0,3:0,4:0};
		for(var i = this.list.length;i<this.players.length;++i){
			var data = this.players[i].split("_");
			if(data[1] == 100){
				curState[data[0]] = Number(data[2]);
				this.players.splice(i,1);
				i--;
			}else{
				for(var key in this.tgState){
					this.tgState[key].push(curState[key]);
				}
			}
		}
	},

	baoting:function(seat){
		this.btMap[seat] = 1;
	},

	isNextSeatBt:function(){
		var nextSeat = this.seatSeq[this.mySeat][1];
		if(this.btMap[nextSeat])
			return true;
		return false;
	},

	/**
	 * 获取player对象
	 * @param userId
	 * @returns {RoomPlayerVo}
	 */
	getPlayerVo:function(userId){
		userId = userId || PlayerModel.userId;
		var player = null;
//        for(var i=0;i<3;i++){
		for(var i=0;i<this.list.length;i++){
			var p = this.list[i];
			if(parseInt(p.userId) == userId){
				player = p;
				break;
			}
		}
		return player;
	},

	setData:function(step,state){
		if(step > 0 && step <=this.step && state == false){
//    		var index = step+2;
			var index = step+(this.list.length-1);
			var seat = this.players[index].split("_")[0];
			if(this.players[index].split("_")[1].split(",") == null|| this.players[index].split("_")[1].split(",")==""){
				if(seat == this.mySeat){
					this.outCardData1 = [];
				}else if(seat == this.seatSeq[this.mySeat][1]){
					this.outCardData2 = [];
				}else if(seat == this.seatSeq[this.mySeat][2]){
					this.outCardData3 = [];
				}else{
					this.outCardData4 = [];
				}
				return;
			}
			var outCard = this.players[index].split("_")[1].split(",");
			if(seat == this.mySeat){
				this.outCardData1 = [];
				for(var j=0;j<outCard.length;j++){
					for(var i=0;i<this.cardData1.length;i++){
						if(this.cardData1[i] == outCard[j]){
							this.cardData1.splice(i,1);
							this.outCardData1.push(outCard[j]);
							break;
						}
					}
				}
			}else if(seat == this.seatSeq[this.mySeat][1]){
				this.outCardData2 = [];
				for(var j=0;j<outCard.length;j++){
					for(var i=0;i<this.cardData2.length;i++){
						if(this.cardData2[i] == outCard[j]){
							this.cardData2.splice(i,1);
							this.outCardData2.push(outCard[j]);
							break;
						}
					}
				}
			}else if(seat == this.seatSeq[this.mySeat][2]){
				this.outCardData3 = [];
				for(var j=0;j<outCard.length;j++){
					for(var i=0;i<this.cardData3.length;i++){
						if(this.cardData3[i] == outCard[j]){
							this.cardData3.splice(i,1);
							this.outCardData3.push(outCard[j]);
							break;
						}
					}
				}
			}else{
				this.outCardData4 = [];
				for(var j=0;j<outCard.length;j++){
					for(var i=0;i<this.cardData4.length;i++){
						if(this.cardData4[i] == outCard[j]){
							this.cardData4.splice(i,1);
							this.outCardData4.push(outCard[j]);
							break;
						}
					}
				}
			}
		}else if(step > 0 && step <=this.step && state == true){
//    		var index = step+2;
			var index = step+(this.list.length-1);
			var seat = this.players[index].split("_")[0];
			var outCard = this.players[index].split("_")[1].split(",");
			this.outCardData1 = [];
			this.outCardData2 = [];
			this.outCardData3 = [];
			this.outCardData4 = [];
			if(outCard != null && outCard != ""){
				if(seat == this.mySeat){
					this.outCardData1 = [];
					for(var j=0;j<outCard.length;j++){
						this.cardData1.push(outCard[j]);
						this.outCardData1.push(outCard[j]);
					}
				}else if(seat == this.seatSeq[this.mySeat][1]){
					this.outCardData2 = [];
					for(var j=0;j<outCard.length;j++){
						this.cardData2.push(outCard[j]);
						this.outCardData2.push(outCard[j]);
					}
				}else if(seat == this.seatSeq[this.mySeat][2]){
					this.outCardData3 = [];
					for(var j=0;j<outCard.length;j++){
						this.cardData3.push(outCard[j]);
						this.outCardData3.push(outCard[j]);
					}
				}else{
					this.outCardData4 = [];
					for(var j=0;j<outCard.length;j++){
						this.cardData4.push(outCard[j]);
						this.outCardData4.push(outCard[j]);
					}
				}
			}
			if(step>1){
				var beforeSeat = this.players[index-1].split("_")[0];
				var beforeOutCard = this.players[index-1].split("_")[1].split(",");
				if(beforeOutCard != null && beforeOutCard != ""){
					if(beforeSeat == this.mySeat){
						this.outCardData1 = [];
						for(var j=0;j<beforeOutCard.length;j++){
							this.outCardData1.push(beforeOutCard[j]);
						}
					}else if(beforeSeat == this.seatSeq[this.mySeat][1]){
						this.outCardData2 = [];
						for(var j=0;j<beforeOutCard.length;j++){
							this.outCardData2.push(beforeOutCard[j]);
						}
					}else if(beforeSeat == this.seatSeq[this.mySeat][2]){
						this.outCardData3 = [];
						for(var j=0;j<beforeOutCard.length;j++){
							this.outCardData3.push(beforeOutCard[j]);
						}
					}else{
						this.outCardData4 = [];
						for(var j=0;j<beforeOutCard.length;j++){
							this.outCardData4.push(beforeOutCard[j]);
						}
					}
				}
				if(step>2){
					var nextSeat = this.players[index-2].split("_")[0];
					var nextOutCard = this.players[index-2].split("_")[1].split(",");
					if(nextOutCard != null && nextOutCard != ""){
						if(nextSeat == this.mySeat){
							this.outCardData1 = [];
							for(var j=0;j<nextOutCard.length;j++){
								this.outCardData1.push(nextOutCard[j]);
							}
						}else if(nextSeat == this.seatSeq[this.mySeat][1]){
							this.outCardData2 = [];
							for(var j=0;j<nextOutCard.length;j++){
								this.outCardData2.push(nextOutCard[j]);
							}
						}else if(nextSeat == this.seatSeq[this.mySeat][2]){
							this.outCardData3 = [];
							for(var j=0;j<nextOutCard.length;j++){
								this.outCardData3.push(nextOutCard[j]);
							}
						}else{
							this.outCardData4 = [];
							for(var j=0;j<nextOutCard.length;j++){
								this.outCardData4.push(nextOutCard[j]);
							}
						}
					}
				}
				if(step>3){
					if (this.playerLength == 4){
						var nextSeat = this.players[index-3].split("_")[0];
						var nextOutCard = this.players[index-3].split("_")[1].split(",");
						if(nextOutCard != null && nextOutCard != ""){
							if(nextSeat == this.mySeat){
								this.outCardData1 = [];
								for(var j=0;j<nextOutCard.length;j++){
									this.outCardData1.push(nextOutCard[j]);
								}
							}else if(nextSeat == this.seatSeq[this.mySeat][1]){
								this.outCardData2 = [];
								for(var j=0;j<nextOutCard.length;j++){
									this.outCardData2.push(nextOutCard[j]);
								}
							}else if(nextSeat == this.seatSeq[this.mySeat][2]){
								this.outCardData3 = [];
								for(var j=0;j<nextOutCard.length;j++){
									this.outCardData3.push(nextOutCard[j]);
								}
							}else{
								this.outCardData4 = [];
								for(var j=0;j<nextOutCard.length;j++){
									this.outCardData4.push(nextOutCard[j]);
								}
							}
						}
					}
				}
			}
		}else if(step == 0 && state == false){
			for(var i=0;i<this.list.length;i++){
				if(parseInt(this.list[i].seat) == this.mySeat){
					this.cardData1 = this.players[this.mySeat-1].split(",");
					this.outCardData1 = [];
				}else if(parseInt(this.list[i].seat) == this.seatSeq[this.mySeat][1]){
					this.cardData2 = this.players[this.seatSeq[this.mySeat][1]-1].split(",");
					this.outCardData2 = [];
				}else if(parseInt(this.list[i].seat) == this.seatSeq[this.mySeat][2]){
					this.cardData3 = this.players[this.seatSeq[this.mySeat][2]-1].split(",");
					this.outCardData3 = [];
				}else{
					this.cardData4 = this.players[this.seatSeq[this.mySeat][3]-1].split(",");
					this.outCardData4 = [];
				}
			}
		}
	},

	getPlayerSeq:function(userId,ownSeat,seat){
		if(userId == PlayerModel.userId)
			return 1;
		var seqArray = this.seatSeq[ownSeat];
		var seq = ArrayUtil.indexOf(seqArray,seat)+1;
		return seq;
	},
}