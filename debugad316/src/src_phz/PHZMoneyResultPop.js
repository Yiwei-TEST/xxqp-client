/**
 * Created by zhoufan on 2016/11/29.
 */
// var PHZSmallResultCell = ccui.Widget.extend({
//     ctor:function(data){
//         this._super();
//         var action = data.action;
//         var cards = data.cards;
//         var huxi = data.huxi;
//         this.anchorX=0;
//         this.anchorY=0;
//         this.setContentSize(32,260);
//         if(action!=0){
//             if(action==10)
//                 action=3;
//             var header = new cc.Sprite("res/ui/phz/act"+action+".png");
//             header.x = 21;
//             header.y = 240;
//             this.addChild(header);
//         }
// 		var zorder = cards.length;
//         for(var i=0;i<cards.length;i++){
// 			zorder--;
//             var vo = PHZAI.getPHZDef(cards[i]);
//             if(action==4 && i>0)
//                 vo.a = 1;
//             if(action==3 && i>0)
//                 vo.a = 1;
// 			var ishu = false;
// 			if(cards[i]==ClosingInfoModel.huCard){
// 				ishu = true;
// 			}
// 			vo.ishu = ishu;
//             var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
//             card.x = 6;
//             card.y = 40 + i * 39;
//             this.addChild(card,zorder);

//         }
//         var label = UICtor.cLabel(huxi+"",24,cc.size(32,30),cc.color(128,51,6),1,1);
//         label.x = 21;
//         label.y = 15;
//         this.addChild(label);
//     }
// });

var PHZMoneyResultPop=BasePopup.extend({
	pointInfo:null,
	isRePlay:null,
    ctor: function (data,isRePlay) {
        this.data = data;
        this.isRePlay = isRePlay;
        this._super("res/phzSmallResult.json");//phzMoneyResultPop
    },

    selfRender: function () {
		this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
        var isHuang = false;
		this.winUserId = 0;
		this.data.sort(function (user1 , user2){
			var point1 = parseInt(user1.point);
			var point2 = parseInt(user2.point);
			return  point1 < point2;
		});
		var myPoint = 0;
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].seat == PHZRoomModel.mySeat){
				myPoint = this.data[i].totalPoint;
			}
		}
		var Image_84 = this.getWidget("Image_84");
		var imgUrl = myPoint > 0 ? "res/res_phz/phzSmallResult/image_win.png" : "res/res_phz/phzSmallResult/image_lose.png";
		Image_84.loadTexture(imgUrl);

        if(ClosingInfoModel.ext[3] == GameTypeEunmZP.SYBP || ClosingInfoModel.ext[3] == 34  || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38){
        	if(ClosingInfoModel.huSeat){
        	}else{
        		isHuang = true;
        	}
        }else{
	        for(var i=0;i<this.data.length;i++){
	            if(this.data[i].point>0){
	                break;
	            }else if(this.data[i].point==0){
	                isHuang = true;
	                break;
	            }
	        }
        }
		this.getWidget("Image_HZ").visible = isHuang;

		for(var i=1;i<=4;i++){
			var user = this.getWidget("user"+i);
		    if(user){
				user.visible = false;
				if(ClosingInfoModel.closingPlayers.length > 2 && i > 2){
					user.x -= 250;
				}
			}
		}
        for(var i=0;i<this.data.length;i++){
        	if(this.isSpecialPHZ()){
        		this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i],this.pointInfo[i] , i);
        	}else {
        		this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
        	}
        }
        this.list = this.getWidget("ListView_6");
        var cards = ClosingInfoModel.cards;
        for(var i=0;i<cards.length;i++){
            var cell = new PHZSmallResultCell(cards[i]);
            this.list.pushBackCustomItem(cell);
        }
		var offX = 50;
		var Image_1 = this.getWidget("resultView");
		var leftCards = ClosingInfoModel.leftCards;
		var allLeftCards = ClosingInfoModel.startLeftCards;
		var dipaiHeight = 570;

		var dipaiPanel = this.getWidget("Panel_dipai");
		dipaiPanel.x += 100;

		this.getWidget("Panel_maipai").x += 100;
		if(ClosingInfoModel.closingPlayers.length > 2){
			this.getWidget("Panel_maipai").visible = false;
			dipaiPanel.y += 80;
		}

		var indexY = 20;
        for(var i=0;i<leftCards.length;i++){ //leftCards
			var index = i;
            var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),PHZAI.getPHZDef(leftCards[i]));
			var diffY = card.getContentSize().height * 0.96;
			var numY = Math.floor(index/indexY);
			var numX = index%indexY;
			card.x = 120 + numX * offX;
			card.y = card.y - diffY * numY - 25;
			//if(ArrayUtil.indexOf(leftCards , allLeftCards[i]) >= 0){
			//}else{
			//	card.graySmallCard();
			//}
			dipaiPanel.addChild(card);
        }
        if(ClosingInfoModel.huxi>0){
            var huxi = this.getWidget("huxi");
			huxi.setString("胡息:"+ClosingInfoModel.huxi);
        }else{
            this.getWidget("huxi").visible = false;
        }

		/*天胡 +10,地胡 +10,自摸 +10,
		胡牌时只有一张红字，一点朱  翻倍,
		胡牌时有10-12张红字，小红胡  翻倍,
		胡牌时有13张红字或以上,大红胡 +60,
		胡牌时全是黑字，乌胡 +60*/
		//ClosingInfoModel.fanTypes = [1,2,3,4,5,6,7];
		var mingtangList = ["  天胡     +10","  地胡     +10","  自摸     +10",
			"一点朱     x2","小红胡     x2","大红胡     +60","  乌胡     +60"];
		var str = "";
		var tunStr = ""
		if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
			mingtangList = ["  天胡     +10","  地胡     +10","  自摸     +10",
				"一点朱     x2","小红胡     x2","  红胡     x2","  黑胡     x2"];
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun
			}
		}
		// var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
            mingtangList = ["  自摸     2番","  小红胡     2番","  大红胡     4番","  一点红     3番","  黑胡     5番","  地胡     2番",
            "  天胡     2番"];
            // cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
            if(ClosingInfoModel.intParams[2] == 1){
            	mingtangList = ["  自摸     2番","  小红胡     2番","  大红胡     2番","  一点红     3番","  黑胡     2番","  地胡     2番",
            		"  天胡     2番"];
            }
            if (ClosingInfoModel.tun){
                tunStr = "\n"+"囤数:" + ClosingInfoModel.tun + "\n";
            }
        }

		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
			mingtangList = ["  自摸     2倍","  小红胡     3番","  大红胡     5番","  一点红     " + (ClosingInfoModel.intParams[20] == 1?"3":"4") +"番","  黑胡     5番","  地胡     2番",
				"  天胡     2番","  飘胡      ","  海底胡     2番","  十红     3番","  放炮     " + ClosingInfoModel.intParams[12] + "倍"];
			// cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun + "\n";
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
            var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
            mingtangList = ["  自摸     2番","  毛胡     =15",intParams[14] == 3?"  一点朱     2番":"  一点朱     4番",
                intParams[14] == 3?"小红胡     2番":"小红胡     3番",intParams[14] == 3?"大红胡     2番":" 大红胡     5番",
                intParams[14] == 3?"黑胡     2番":"  黑胡     5番","  放炮     "+ ClosingInfoModel.ext[7] + "番"];
            if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun
			}
        }

		if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
			mingtangList = ["  天胡     +100","  地胡     +100","  自摸     x2",
				"一点朱     x2"," 十红     x2","  十三红     +100","  乌胡     +100",
				"一块扁     x2","海底捞     x2","  20卡     x2","  30卡     +100","  飘胡     +30"
			];
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
			var tempFan = 0;
			var data = ClosingInfoModel.fanTypes || [];
			//cc.log(" 当前小结数据 ",JSON.stringify(data));
			var configObj = {
				1:"  天胡 ",4:"  点胡 ",5:"  红胡 ",
				6:"  红乌 ", 7:"  黑胡 ", 8:" 大字胡 ",
				9:"  小胡 ", 10:" 对子胡 ",15:" 地胡 ",
				18:"  自摸 ",19:"  黄番 ",21:"  海胡 ",22:"  听胡 ",
				23:"  对子胡 ",24:"  耍猴 ",25:"  团胡 ",
				26:"  红胡 ",27:"  点胡 ",28:"  黑胡 "
			};

			if(PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ){
				configObj[25] = "  大团圆 ";
				configObj[29] = "  行行息 ";
				configObj[30] = "  假行行 ";
				configObj[31] = "  四七红 ";
				configObj[32] = "  背靠背 ";
				configObj[33] = "  对子胡 ";
			}
			if(PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
				configObj[10] = configObj[33] = " 碰碰胡 ";
				configObj[8] = " 十八大 ";
				configObj[9] = " 十六小 ";
				configObj[7] = configObj[28] = " 乌胡 ";
				configObj[21] = " 海底胡 ";
				configObj[3] = " 自摸 ";
			}

			var menziStr = "";
			for(var i=0;i<data.length;i++) {
				if(data[i]){
					var tempVal = parseInt(data[i]);
					var tunshu = tempVal % 100;
					tempVal = Math.floor(tempVal/100);
					var tempTunStr = (tempVal % 10) === 0 ? "囤" : "番";
					if((tempVal % 10) === 1){
						tempFan += tunshu;
					}
					tempVal = Math.floor(tempVal/10);
					var typeVal = tempVal % 100;
					if(configObj[typeVal]){
						if(typeVal == 19){
							menziStr += configObj[typeVal] + "*" + tunshu;
						}else{
							menziStr += configObj[typeVal] + "+" + tunshu + tempTunStr;
						}
					}
				}
				menziStr += "\n";
			}	
			if(ClosingInfoModel.tun > 0){
				str += "囤数: "+ClosingInfoModel.tun + "\n";
			}
			if(ClosingInfoModel.fan > 0){
				str += "番数: "+ClosingInfoModel.fan + "\n";
			}
			str += menziStr;
			if(ClosingInfoModel.totalTun){
				str += "共计:"+ClosingInfoModel.totalTun + "\n";
			}
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1:"  天胡  ",2:"  自摸加3胡  ",3:"  自摸加番  ",4:" 一点红 ",
				5:"  红胡  ",7:"  黑胡  ",8:" 大字胡 ",
				9:" 小字胡 ",10:" 碰碰胡 ",14:" 30胡息 ",
				15:" 地胡  "
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}
		}
		if (ClosingInfoModel.fanTypes){
			for(var i=0;i<ClosingInfoModel.fanTypes.length;i++) {
				for(var j=0;j<mingtangList.length;j++) {
					if (ClosingInfoModel.fanTypes[i] == j + 1){
						str = str + mingtangList[j] + "\n"
					}
				}
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
            str = tunStr + str;
            var xingStr = ClosingInfoModel.intParams[10] == 1?"  跟醒     ":"  翻醒     ";
            if (ClosingInfoModel.intParams[10]>0)
                str = xingStr+ ClosingInfoModel.ext[26]  + str;
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
            str = tunStr + str;
            var xingStr = ClosingInfoModel.intParams[10] == 1?"  跟醒     ":"  翻醒     ";
            if (ClosingInfoModel.intParams[10]>0)
                str = xingStr+ ClosingInfoModel.ext[26]  + str;
        }else{
			str = str + tunStr;
        }

		var zimo = this.getWidget("zimo"); //自摸文本
		zimo.setString("" + str);

		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

        var renshu = ClosingInfoModel.ext[7];
        if(!this.isRePlay){
        	for(var n=0;n<renshu;n++) {
        		var onePlayerVo = ClosingInfoModel.closingPlayers[n];
        		var oneCards = onePlayerVo.cards;//剩余的牌的id值
        		var cardVo = PHZAI.getVoArray(oneCards);//剩余的牌
        		var zorder = cardVo.length;
        		var result = PHZAI.sortHandsVo(cardVo);
        		for (var i = 0; i < result.length; i++) {
        			var seat = onePlayerVo.seat;
        			var seq = PHZRoomModel.getPlayerSeq("", seat);
        			var cardArray = result[i];
        			for (var j = 0; j < cardArray.length; j++) {
						//cc.log("seq============="+seq)
        				if(seq!=1) {
        				}
        			}
        		}
        	}
        }
        this.Button_2 = this.getWidget("Button_2");
        this.Button_Ready = this.getWidget("btnReady");
		this.Button_Ready.loadTextureNormal("res/res_phz/phzBigResult/btn_start_another.png");
        //UITools.addClickEvent(this.Button_2,this,this.onContinue);
        UITools.addClickEvent(this.Button_Ready,this,this.onContinue);
        this.Button_zm = this.getWidget("Button_15");
        this.Button_toResultView = this.getWidget("btnToResultView");
        UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
        UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
        this.onJieSuan();
		var btn_jiesan = this.getWidget("btn_jiesan");
		//版本号
		if(this.getWidget("Label_version")){
			this.getWidget("Label_version").setString(SyVersion.v);
		}

		if(this.getWidget("Label_jushu")){
			this.getWidget("Label_jushu").visible = false;
		}

		//var btn_share = this.getWidget("btn_share");
		//btn_share.visible = false;
		//UITools.addClickEvent(btn_share,this,this.onShare);
		btn_jiesan.visible = false;
		//UITools.addClickEvent(btn_jiesan,this,this.onBreak);


		var btn_handXq = this.getWidget("btn_handXq");
		UITools.addClickEvent(btn_handXq,this,this.onToHome);
		btn_handXq.loadTextureNormal("res/res_phz/phzBigResult/btn_return_hall.png");

		var Image_40 = this.getWidget("Image_40"); //自摸图片
		Image_40.visible = false;

		this.addCustomEvent(SyEvent.SETTLEMENT_SUCCESS,this,this.onSettlement);
		this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.changeSrvOver);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);


		var btnok = this.getWidget("Button_2");
		//var btClose = this.getWidget("close_btn");
		//btClose.visible = true;
		btnok.loadTextureNormal("res/res_phz/phzBigResult/btn_start_another.png");
		UITools.addClickEvent(btnok,this,this.onContinue);
		//UITools.addClickEvent(btClose , this , this.onToHome);

		var btnshare = this.getWidget("btn_share");
		if (btnshare) {
			UITools.addClickEvent(btnshare, this, this.onToHome);
		}

		this.moneyModeId = ClosingInfoModel.ext[10];
		this.moneyBeilv = ClosingInfoModel.ext[11];
		this.moneyCost = ClosingInfoModel.ext[12];

		if(this.getWidget("Label_time")){
			this.getWidget("Label_time").setString("");
			this.getWidget("Label_time").visible = false;
		}

		//显示金币场
		//this.getWidget("lbBeilv").setString("娱乐场");
		//this.getWidget("lbMoneyStr").setString(this.moneyCost);
		//this.getWidget("lbBeilvStr").setString(this.moneyBeilv + "倍");
		//this.getWidget("lbTime").setString(ClosingInfoModel.ext[2]);
		if ((PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ || PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK ) && !this.isRePlay){
            if (PHZRoomModel.intParams[10] > 0  && ClosingInfoModel.ext[25] > 0 ){
                var vo = PHZAI.getPHZDef(parseInt(ClosingInfoModel.ext[25]));
                var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
                card.x = 1350;
                card.y = 675;
                this.resultView.addChild(card);
                var string = PHZRoomModel.intParams[10] == 1?"跟醒":"翻醒";
                var label = UICtor.cLabel(string,24,cc.size(80,30),cc.color(128,51,6),1,1);//cc.color(129,49,0) ColorUtil.WHITE
                label.x = 25;
                label.y = 70;
                card.addChild(label);
            }
        }
         this.getWidget("Label_roomnum").setString("序号:"+ClosingInfoModel.ext[0] + "  底分:"+(PHZRoomModel.goldMsg[2] || 0) + "\n" + ClosingInfoModel.ext[2]);
	},
    
    isSpecialPHZ:function(){
    	return (ClosingInfoModel.ext[3] == 38 && ClosingInfoModel.ext[7] == 4)
    },

    refreshSingle:function(widget,user,pointInfo , index){
		cc.log("index..." , index);
		//user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
		widget.visible = true;
    	if(user.isShuXing){
    		if(user.seat == user.isShuXing){
    			ccui.helper.seekWidgetByName(widget,"sx").visible = true;
    		}else{
    			ccui.helper.seekWidgetByName(widget,"sx").visible = false;
    		}
    	}else{
    		ccui.helper.seekWidgetByName(widget,"sx").visible = false;
    	}

        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
		ccui.helper.seekWidgetByName(widget, "uid").setString("UID:" + user.userId);
		var defaultimg = "res/res_phz/default_m.png";
		var sprite = new cc.Sprite(defaultimg);
		sprite.scale=0.98;
		sprite.x = 45;
		sprite.y = 45;
        widget.addChild(sprite,5,345);
		//sprite.setScale(1.05);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

        var point = ccui.helper.seekWidgetByName(widget,"point");

		if (user.totalPoint != null ){

		}

		if (index == 0){
			var nowPoint = this.getWidget("nowPoint");
			nowPoint.setString("共计:" + user.point);

			if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
				nowPoint.setString("共计:"+user.bopiPoint);
			}

			if(PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ || PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ
				|| PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ || PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ
				|| PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
				nowPoint.setString("");
			}
		}

		var fontName =  "res/font/font_point_2.fnt";
		if(user.totalPoint >= 0){
			fontName =  "res/font/font_point_1.fnt";
		}else{
			fontName =  "res/font/font_point_2.fnt";
		}
		var coinPoint = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
		coinPoint.anchorX = 0;
		coinPoint.x = 5;
		coinPoint.scale = 0.5;
		point.addChild(coinPoint);
		var label = new cc.LabelBMFont(user.totalPoint + "", fontName);
		label.anchorX = 0;
		label.x = 50;
		label.scale = 0.8;
		point.addChild(label);

		if(PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
			var piaoNum = user.strExt[10];
    		if (piaoNum!=-1){
    			var pngUrl ="res/res_phz/biao_piao"+piaoNum+".png";
    			var piaofen = new cc.Sprite(pngUrl);
    			// piaofen.anchorX = piaofen.anchorY = 0;
    			piaofen.x = 75;
    			piaofen.y = 15;
    			widget.addChild(piaofen,10);
    		}
        }
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        if(ClosingInfoModel.ext[3] == GameTypeEunmZP.SYZP || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38){
        	if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount){//最后的结算
        		PopupManager.remove(this);
        		var mc = new PHZBigResultPop(data);
        		PopupManager.addPopup(mc);
        		var obj = HongBaoModel.getOneMsg();
        		if(obj){
        			var mc = new HongBaoPop(obj.type,obj.data);
        			PopupManager.addPopup(mc);
        		}
        	}else{
        		sySocket.sendComReqMsg(3);
        	}
        }else{
        	if(ClosingInfoModel.ext[6] == 1){//最后的结算
        		PopupManager.remove(this);
        		var mc = new PHZBigResultPop(data);
        		PopupManager.addPopup(mc);
        		var obj = HongBaoModel.getOneMsg();
        		if(obj){
        			var mc = new HongBaoPop(obj.type,obj.data);
        			PopupManager.addPopup(mc);
        		}
        	}else{
        		sySocket.sendComReqMsg(3);
        	}
        }
    },

	onBreak:function(){
		AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
			sySocket.sendComReqMsg(7);
		},null,2)
	},

	onShare:function(){

	},
    
    onHandCard:function(){
		cc.log("onHandCard ClosingInfoModel.huSeat..." , ClosingInfoModel.huSeat);
    	var mc = new PHZHandCardPop(this.data,ClosingInfoModel.ext[1] , this.winUserId);
    	PopupManager.open(mc,true);
    },
    
    onJieSuan:function(){
		this.resultView.visible = true;
		this.roomView.visible = false;
    },
    
    onZhuoMian:function(){

		this.resultView.visible = false;
		this.roomView.visible = true;

    },

	onSettlement:function(){
		PopupManager.remove(this);
	},

	askCheckServer:function(){
		this.isChangingSrv = true;
		var strparams = [];
		var moneyWanfa = 33;
		var modeId = this.moneyModeId;//moneyWanfa * 10 + this.moneyRoomLevel;
		strparams.push("1");
		strparams.push(modeId+"");
		cc.log("金币场请求切服..." , strparams );
		//LayerManager.showLayer(LayerFactory.DTZ_MONEY_LOADING);
		//PopupManager.addPopup(new DTZMoneyLoadingPopup(moneyWanfa));
		var self = this;
		setTimeout(function(){
			self.isChangingSrv = false;
			SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});
			sy.scene.hideLoading();
		} , 5000);
		sySocket.sendComReqMsg(29 , [moneyWanfa] , strparams);//先请求后台分配服务器
	},

	changeSrvOver:function(){
		cc.log("选服完毕 请求后台加入房间消息 "  , this.isChangingSrv);
		if(this.isChangingSrv){//由切服出发的重连成功才继续进入金币场
			this.doJoinMoneyRoom();
		}
	},

	doJoinMoneyRoom:function(){
		var moneyWanfa = 33;
		var roomTypeValue = moneyWanfa;
		var roomTypeAndLevel = this.moneyModeId;// moneyWanfa * 10 + this.moneyRoomLevel;
		//cc.log("roomTypeValue roomTypeAndLevel" , roomTypeValue,String(roomTypeAndLevel));
		sySocket.sendComReqMsg(2,[parseInt(1) , roomTypeValue],String(roomTypeAndLevel));
		this.isChangingSrv = false;
		LayerManager.showLayer(LayerFactory.HOME);
		PopupManager.remove(this);
		//PopupManager.removeAll();

		//这里不再移除结算页面 一旦请求成功收到Createtable消息会移除所有弹框
	},

	/**
	 * 金币场开始下一局
	 */
	onContinue:function(){
		//var keyId = GoldRoomConfigModel.curClickRoomkeyId;
		//cc.log("GoldRoomConfigModel.curClickRoomkeyId=="+GoldRoomConfigModel.curClickRoomkeyId)
		//// if(keyId && keyId > 0){
		//this.clickStartAnother = true;
		//ComReq.comReqChangeSrv([] , ["" + keyId],1);

		var data = CheckJoinModel.getJoinMatchData();
		if(data){
			CheckJoinModel.toMatchRoom(data.playType,data.matchType,data.keyId);
		}else{
			PopupManager.remove(this);
			LayerManager.showLayer(LayerFactory.HOME);
		}
	},

	/**
	 * 返回大厅
	 */
	onToHome: function () {
		LayerManager.showLayer(LayerFactory.HOME);
        if(LayerManager.getLayer(LayerFactory.GOLD_LAYER)){
            LayerManager.showLayer(LayerFactory.GOLD_LAYER);
        }
		PopupManager.remove(this);
		PopupManager.removeAll();
	},

	onChooseCallBack:function(event){
		var status = event.getUserData();
		if(status == ServerUtil.GET_SERVER_ERROR){
			sy.scene.hideLoading();
			FloatLabelUtil.comText("切服失败");
		}else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
			this.onSuc();
		}
	},

	onSuc:function(){
		sy.scene.hideLoading();
		if(this.clickStartAnother){
			this.clickStartAnother = false;
			var keyId = GoldRoomConfigModel.curClickRoomkeyId;
			var goldRoomId = GoldRoomConfigModel.goldRoomId;
			// cc.log("onSuc===",keyId,goldRoomId);
			sySocket.sendComReqMsg(2,[],[""+keyId,""+goldRoomId],1);
		}
	},

});
