/**
 * Created by zhoufan on 2016/11/29.
 */
var PHZSmallResultCell = ccui.Widget.extend({
	ctor: function (data, wanfa) {
		this._super();
		var action = data.action;
		var cards = data.cards || [];
		var huxi = data.huxi || "";
		this.anchorX = 0;
		this.anchorY = 0;
		this.setContentSize(60, 260);
		if (action != 0) {
			if (action == 10)
				action = 3;

			var resStr = "res/res_phz/act" + action + ".png";

			if (wanfa == GameTypeEunmZP.WHZ) {
				if (action == 3) resStr = "res/res_phz/act3_1.png";
				else if (action == 4 || action == 11 || action == 18) resStr = "res/res_phz/act4_1.png";
			} else if (wanfa == GameTypeEunmZP.LDS || wanfa == GameTypeEunmZP.JHSWZ || wanfa == GameTypeEunmZP.YZCHZ) {
				if (action == 3) resStr = "res/res_phz/act3_2.png";
				else if (action == 4) resStr = "res/res_phz/act4_2.png";
			} else if (wanfa == GameTypeEunmZP.GLZP) {
				if (action == 3) resStr = "res/res_phz/act3_glzp.png";
				else if (action == 4) resStr = "res/res_phz/act4_glzp.png";
				else if (action == 7) resStr = "res/res_phz/act4_glzp.png";
			} else if (wanfa == GameTypeEunmZP.WCPHZ) {
				if (action == 4) resStr = "res/res_phz/act4_3.png";
			}

			var header = new cc.Sprite(resStr);

			header.x = 30;
			header.y = 280;
			if (PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()) {
				header.x = 35;
				header.y = 295;
			}
			this.addChild(header);
		}
		var zorder = cards.length;
		for (var i = 0; i < cards.length; i++) {
			zorder--;
			// cc.log("smallresult",wanfa,cards[i])
			if (wanfa == GameTypeEunmZP.WCPHZ && cards[i] == 999) {
				var card = new cc.Sprite("#small_half_face_1.png");
				card.anchorX = card.anchorY = 0;
				card.x = 6;
				card.y = i * 48 * 1.2;
				this.addChild(card, zorder);
				var hudie = new cc.Sprite("res/res_phz/hudie.png");
				hudie.x = card.width / 2
				hudie.y = card.height / 2 + 10
				hudie.scale = 0.3;
				card.addChild(hudie);
			} else {
				var vo = PHZAI.getPHZDef(cards[i]);
				if (action == 4 && i > 0 && wanfa != GameTypeEunmZP.WHZ)
					vo.a = 1;
				if (action == 3 && i > 0)
					vo.a = 1;

				if ((wanfa == GameTypeEunmZP.LDS || wanfa == GameTypeEunmZP.YZCHZ || wanfa == GameTypeEunmZP.JHSWZ) && (action == 4 || action == 3)) {
					vo.a = 0;
				}
				var ishu = false;
				if (cards[i] == ClosingInfoModel.huCard) {
					ishu = true;
				}
				vo.ishu = ishu;
				var card;
				if (wanfa == GameTypeEunmZP.YZCHZ) {
					card = new YZCHZCard(PHZAI.getDisplayVo(this.direct, 3), vo);
				} else {
					card = new PHZCard(PHZAI.getDisplayVo(this.direct, 3), vo);
				}
				card.x = 6;
				card.y = -30 + i * 48 * 1.4;
				card.scale = 1.4;
				this.addChild(card, zorder);
			}
		}
		var label = UICtor.cLabel(huxi + "", 30, cc.size(60, 30), cc.color(255, 243, 221), 1, 1);//cc.color(129,49,0) ColorUtil.WHITE
		label.x = 33;
		label.y = -45;
		this.addChild(label);
		this.label_huxi = label;
		if (PHZRoomModel.wanfa == GameTypeEunmZP.ZHZ) {
			label.setVisible(false);
		}
	}
});

var PHZSmallResultPop = BasePopup.extend({
	pointInfo: null,
	isRePlay: null,
	ctor: function (data, isRePlay) {
		this.data = data;
		this.isRePlay = isRePlay;
		var path = "res/phzSmallResult.json";
		if (PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()) {
			path = "res/phzSmallResultTwo.json";
		}
		this._super(path);
	},

	showXingPai: function () {
		var xingId = ClosingInfoModel.ext[11];
		// cc.log("==========showXingPai============",xingId);
		if (xingId) {
			var parent = this.getWidget("resultView");

			var labeltip = new cc.LabelTTF("??????", "res/font/bjdmj/fznt.ttf", 30);
			labeltip.setColor(cc.color.RED);
			labeltip.setPosition(1550, 675);
			parent.addChild(labeltip, 10);

			var vo = PHZAI.getPHZDef(xingId);
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct, 3), vo);
			card.x = labeltip.x - 28;
			card.y = labeltip.y - 100;
			card.scale = 1.2;
			parent.addChild(card, 10);
		}
	},

	showWangReplace: function () {
		var data = ClosingInfoModel.ext[8];
		//cc.log("==========showWangReplace============",data);
		if (data) {
			var parent = this.getWidget("resultView");
			var ids = data.split(";");

			for (var i = 0; i < ids.length; ++i) {
				var vo1 = PHZAI.getPHZDef(81);
				var card1 = new PHZCard(PHZAI.getDisplayVo(this.direct, 3), vo1);
				card1.x = 1524 + i * 60;
				card1.y = 765;
				card1.scale = 1.2;
				parent.addChild(card1, 10);

				var vo = PHZAI.getPHZDef(ids[i]);
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct, 3), vo);
				card.x = card1.x;
				card.y = card1.y - 60;
				card.scale = 1.2;
				parent.addChild(card, 11);
			}
		}
	},

	selfRender: function () {
		this.addCustomEvent(SyEvent.SOCKET_OPENED, this, this.onSuc);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC, this, this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR, this, this.onChooseCallBack);
        this.addCustomEvent(SyEvent.SETTLEMENT_SUCCESS,this,this.onSettlement);


		var isHuang = false;
		this.winUserId = 0;
		this.data.sort(function (user1, user2) {
			var point1 = parseInt(user1.point);
			var point2 = parseInt(user2.point);
			return point1 < point2;
		});
		var myPoint = 0;
		var isYk = false;
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].seat == PHZRoomModel.mySeat || (this.isRePlay && this.data[i].userId == PlayerModel.userId)) {
				myPoint = this.data[i].point;
				isYk = true;
			}
		}
		var Image_84 = this.getWidget("Image_84");
		var imgUrl = myPoint > 0 ? "res/res_phz/phzSmallResult/image_win.png" : "res/res_phz/phzSmallResult/image_lose.png";

		if (this.isRePlay && !isYk) {
			imgUrl = "res/res_phz/phzSmallResult/image_win.png";
		}

		Image_84.loadTexture(imgUrl);

		if (PHZRoomModel.wanfa == GameTypeEunmZP.SYBP || PHZRoomModel.wanfa == GameTypeEunmZP.LDS
			|| PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) {
			if (ClosingInfoModel.huSeat) {/**/

			} else {
				isHuang = true;
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP) {
			if (ClosingInfoModel.tun == 0) {
				isHuang = true;
			}
		} else {
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].point > 0) {
					break;
				} else if (this.data[i].point == 0) {
					isHuang = true;
					break;
				}
			}
		}
		this.getWidget("Image_HZ").visible = isHuang;
		//		this.getWidget("Image_Win").visible = !isHuang;
		//
		//
		if (this.data.length == 3) {
			this.getWidget("user4").visible = false;
			//this.getWidget("user2Bg").setPosition(370,132);
			//this.getWidget("user3Bg").setPosition(850,132);
		} else if (this.data.length == 2) {
			this.getWidget("user4").visible = false;
			this.getWidget("user3").visible = false;
		}
		//        if(this.isSpecialPHZ()){
		//        	var chihongPai = this.getWidget("Image_chihong");
		//        	var dangdiPai = parseInt(ClosingInfoModel.ext[9]);
		//        	if(dangdiPai>0){
		//        		var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),PHZAI.getPHZDef(dangdiPai));
		//        		card.x = chihongPai.width+20;
		//        		card.y = chihongPai.height/2-20;
		//        		chihongPai.addChild(card);
		//        	}else{
		//        		chihongPai.visible = false;
		//        	}
		//        }else{
		//        	this.getWidget("Image_chihong").visible = false;
		//        }

		if (PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) {
			this.showXingPai();
			this.showWangReplace();
		}

		var xingSeat = -1;
		var huSeat = -1;
		for (var i = 0; i < this.data.length; i++) {
			if (this.isSpecialPHZ()) {
				this.refreshSingle(this.getWidget("user" + (i + 1)), this.data[i], this.pointInfo[i], i);
			} else {
				this.refreshSingle(this.getWidget("user" + (i + 1)), this.data[i], "", i);
			}
			if (this.data[i].seat == this.data[i].isShuXing) {
				xingSeat = i;
			}
			if (ClosingInfoModel.huSeat == this.data[i].seat) {
				huSeat = i;
			}
			// if(i>0){
			//??????????????????????????????????????????????????? ???????????????
			/*if(ClosingInfoModel.ext[3]==32 || (ClosingInfoModel.ext[3]==38 && ClosingInfoModel.ext[7]==3)){
				ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"name").setPosition(172,35);
				ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"point").setPosition(256,28);
			}else{
				ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"name").setPosition(172,51);
				ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"point").setPosition(256,35);
			}*/
			// }
		}
		this.list = this.getWidget("ListView_6");
		var cards = ClosingInfoModel.cards;
		if (PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()) {
			this.list_two = this.getWidget("ListView_6_0");
			this.list_two.visible = true;
		}

		if (PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()) {
			if (ClosingInfoModel.huSeat) {
				if (ClosingInfoModel.allCardsCombo[0].seat != ClosingInfoModel.huSeat) {
					ClosingInfoModel.allCardsCombo.reverse();
				}
			} else {
				if (ClosingInfoModel.allCardsCombo[0].seat != this.data[0].seat) {
					ClosingInfoModel.allCardsCombo.reverse();
				}
			}
			for (var i = 0; i < ClosingInfoModel.allCardsCombo.length; i++) {
				var cards = ClosingInfoModel.allCardsCombo[i].phzCard || [];
				for (var j = 0; j < cards.length; j++) {
					// cc.log("cards[i] =",JSON.stringify(cards[i]));
					var cell = new PHZSmallResultCell(cards[j], PHZRoomModel.wanfa);
					if (i == 0) {
						if (isHuang) {
							if (j === cards.length - 1) {
								break;
							}
						}
						this.list.pushBackCustomItem(cell);
					} else {
						if (j === cards.length - 1) {
							break;
						}
						this.list_two.pushBackCustomItem(cell);
					}
				}
			}
			if (isHuang) {//???????????????
				var temp = ClosingInfoModel.allCardsCombo[0].phzCard;
				var selfCard = temp[temp.length - 1].cards || [];
				var cardVo = PHZAI.getVoArray(selfCard);//????????????
				var result = PHZAI.sortHandsVo(cardVo);
				for (var i = 0; i < result.length; i++) {
					var cell = new onCell(result[i], true);
					this.list.pushBackCustomItem(cell);
				}
			}
			var temp = ClosingInfoModel.allCardsCombo[1].phzCard;
			var otherCards = temp[temp.length - 1].cards || [];
			var cardVo = PHZAI.getVoArray(otherCards);//????????????
			cardVo.scale = 1.4;
			var result = PHZAI.sortHandsVo(cardVo);
			for (var i = 0; i < result.length; i++) {
				var cell = new onCell(result[i], true);
				this.list_two.pushBackCustomItem(cell);
			}
		} else {
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].cards.length > 4) {
					for (var t = 0; t < cards[i].cards.length / 2; ++t) {
						var tempCards = cards[i].cards.slice(t * 2, t * 2 + 2);
						var data = ObjectUtil.deepCopy(cards[i]);
						data.cards = tempCards;
						var cell = new PHZSmallResultCell(data, PHZRoomModel.wanfa);
						this.list.pushBackCustomItem(cell);
					}
				} else {
					var cell = new PHZSmallResultCell(cards[i], PHZRoomModel.wanfa);
					this.list.pushBackCustomItem(cell);
				}
			}
		}
		var offX = 50;
		var Image_1 = this.getWidget("resultView");
		var leftCards = ClosingInfoModel.leftCards;
		var allLeftCards = ClosingInfoModel.startLeftCards;
		var dipaiHeight = 570;
		// cc.log("leftCards", JSON.stringify(leftCards));
		// cc.log("huCards", JSON.stringify(ClosingInfoModel.huCard));
		var dipaiPanel = this.getWidget("Panel_dipai");
		//
		//var dipai = new cc.Sprite("res/res_phz/enddipai.png");
		//dipai.anchorX=dipai.anchorY=0;
		//dipai.x = initX;
		//dipai.y = dipaiHeight;
		//Image_1.addChild(dipai);

		var cpNum = 0;
		if (ClosingInfoModel.ext[14]) {
			cpNum = parseInt(ClosingInfoModel.ext[14]);
		}

		var indexY = 20;
		if (PHZRoomModel.wanfa == GameTypeEunmZP.ZHZ) {
			indexY = 18;
		}
		var otherDipai = [];
		if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP) {
			otherDipai.push(parseInt(ClosingInfoModel.ext[25]));
			var valArr = PHZRoomModel.getCardsByString(ClosingInfoModel.ext[27]);
			if (valArr.length > 0) {
				ArrayUtil.merge(valArr, otherDipai);
			}
			ArrayUtil.merge(leftCards, otherDipai);
			var temp = leftCards;
			leftCards = otherDipai;
			otherCards = temp;
		}

		var scaleNum = 1.1;
		if (PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()) {
			indexY = 39;
			scaleNum = 1.1;
			if (leftCards.length > 30) {
				scaleNum = 0.9;
				if (leftCards.length >= 35) {
					scaleNum = 0.8;
				}
			} else if (leftCards.length > 25) {
				scaleNum = 0.9;
			}
		}

		for (var i = 0; i < leftCards.length; i++) { //leftCards
			// if (i >= cpNum){
			var index = i;
			var vo = PHZAI.getPHZDef(leftCards[i]);
			if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP) {
				if (otherCards.indexOf(leftCards[i]) === -1) {
					vo.zhe = 1;
				}
				if (i == leftCards.length - otherDipai.length) {
					vo.ishu = true;
				}
			} else {
				// if (i == 0){
				// 	vo.ishu = true;
				// }
			}
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct, 3), vo);
			// if(ArrayUtil.indexOf(leftCards , allLeftCards[i]) >= 0){
			// }else{
			// 	card.graySmallCard();
			// }
			var diffY = card.getContentSize().height * 0.96;
			// if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
			card.scale = scaleNum;
			// }
			var numY = Math.floor(index / indexY);
			var numX = index % indexY;
			card.x = 115 + numX * offX * scaleNum;
			card.y = card.y - diffY * numY - 5;
			// card.scale = 1.2;
			dipaiPanel.addChild(card);
			// }
		}
		var maipaiPanel = this.getWidget("Panel_maipai");
		var maiPaiCards = ClosingInfoModel.chouCards;
		if (maiPaiCards && maiPaiCards.length > 0) {
			for (var i = 0; i < maiPaiCards.length; i++) {
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct, 3), PHZAI.getPHZDef(maiPaiCards[i]));
				var diffY = card.getContentSize().height * 0.5;
				var numY = Math.floor(i / indexY);
				var numX = i % indexY;
				card.x = 60 + numX * offX;
				card.y = card.y - diffY * numY;
				maipaiPanel.addChild(card);
			}
		} else {
			maipaiPanel.visible = false;
		}
		if (PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()) {
			maipaiPanel.visible = false;
		}

		if (ClosingInfoModel.huxi > 0) {
			var huxi = this.getWidget("huxi");
			huxi.setString("??????:" + ClosingInfoModel.huxi);
		} else {
			this.getWidget("huxi").visible = false;
		}

		/*?????? +10,?????? +10,?????? +10,
		???????????????????????????????????????  ??????,
		????????????10-12?????????????????????  ??????,
		????????????13??????????????????,????????? +60,
		?????????????????????????????? +60*/
		//ClosingInfoModel.fanTypes = [1,2,3,4,5,6,7];
		var mingtangList = ["  ??????     +10", "  ??????     +10", "  ??????     +10",
			"?????????     x2", "?????????     x2", "?????????     +60", "  ??????     +60"];
		var str = "";
		var tunStr = ""
		if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP) {
			mingtangList = ["  ??????     +10", "  ??????     +10", "  ??????     +10",
				"?????????     x2", "?????????     x2", "  ??????     x2", "  ??????     x2"];
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF) {
			mingtangList = ["  ??????     +100", "  ??????     +100", "  ??????     x2",
				"?????????     x2", " ??????     x2", "  ?????????     +100", "  ??????     +100",
				"?????????     x2", "?????????     x2", "  20???     x2", "  30???     +100", "  ??????     +30"
			];
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP) {
			var intParams = this.isRePlay ? PHZRePlayModel.intParams : PHZRoomModel.intParams;
			mingtangList = ["  ??????     2???", "  ??????     =15", intParams[14] == 3 ? "  ?????????     2???" : "  ?????????     4???",
				intParams[14] == 3 ? "?????????     2???" : "?????????     3???", intParams[14] == 3 ? "?????????     2???" : " ?????????     5???",
				intParams[14] == 3 ? "??????     2???" : "  ??????     5???", "  ??????     " + ClosingInfoModel.ext[7] + "???"];
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP) {
			mingtangList = ["  ??????     2???", "  ??????     2???", "  ??????     2???", "  ?????????     2???", "  ??????     2???", "  ??????     2???",
				"  ??????     =21", "  ?????????     =16", "  ?????????     =24", "  ??????     "];
			//cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.ZHZ) {
			var fenshu20 = "+20???";
			var fenshu40 = "+40???";
			if (ClosingInfoModel.intParams && ClosingInfoModel.intParams[5] == 1) {
				fenshu20 = "+10???"
				fenshu40 = "+10???"
			}
			mingtangList = ["  ??????     +10???", "  ?????????     " + fenshu20, "  ?????????     " + fenshu20, "  ?????????     " + fenshu20, "  ??????     " + fenshu20, "  ??????     " + fenshu20,
				"  ??????     " + fenshu20, "  ?????????     +10???", "  ?????????     +10???", "  ?????????     +10???", "  ?????????     +40???", "  ?????????     " + fenshu20, "  ????????????     " + fenshu40,
				"  ?????????     +20???", "  ?????????     +20???"];
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) {
			mingtangList = ["  ?????????    60???", "  ??????    100???", "  ?????????    100???", "  ??????    100???", "  ?????????    60???",
				"  ?????????    80???", "  ??????    120???", "  ??????    100???", "  ??????    100???", "  ??????    30???",
				"  ??????    100???", "  ??????    100???", "  ??????    60???", "  ?????????    60???", "  ??????    0",
				"  ??????    20???", "  ??????    30???", "  ??????    40???", "  ??????    10???"];
		}

		var intParams = this.isRePlay ? PHZRePlayModel.intParams : PHZRoomModel.intParams;
		var exHaoFen = 0;
		var exMingTangFen = 0;
		if (intParams && intParams[10] == 2) {//?????????10
			exHaoFen = 10;
		}
		if (intParams && intParams[11] == 2) {//????????????20
			exMingTangFen = 20;
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ) {
			mingtangList = ["  ??????     2???", "  ?????????     2???", "  ?????????     4???", "  ?????????     3???", "  ??????     5???", "  ??????     2???",
				"  ??????     2???"];
			// cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (intParams[2] == 1) {
				mingtangList = ["  ??????     2???", "  ?????????     2???", "  ?????????     2???", "  ?????????     3???", "  ??????     2???", "  ??????     2???",
					"  ??????     2???"];
			}
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun + "\n";
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK) {
			mingtangList = ["  ??????     2???", "  ?????????     3???", "  ?????????     5???", "  ?????????     " + (ClosingInfoModel.intParams[20] == 1 ? "3" : "4") + "???", "  ??????     5???", "  ??????     2???",
				"  ??????     2???", "  ??????      ", "  ?????????     2???", "  ??????     3???", "  ??????     " + ClosingInfoModel.intParams[12] + "???"];
			// cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun + "\n";
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP) {
			mingtangList = ["  ??????     2???", "  ??????     3???"];
			// cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun + "\n";
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP) {
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun + "\n";
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS) {
			mingtangList = ["?????????", "???????????????", "?????????", "?????????", "?????????"];
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) {
			// cc.log("==========ClosingInfoModel.fanTypes============" + JSON.stringify(ClosingInfoModel.fanTypes));
			if (ClosingInfoModel.fanTypes) {
				for (var i = 0; i < ClosingInfoModel.fanTypes.length; i++) {
					if (ClosingInfoModel.fanTypes[i] > 0 && mingtangList[i]) {
						var temp = mingtangList[i].match(/\d+/);
						if (temp) {
							var num = parseInt(temp);
							if (i == 5 && ClosingInfoModel.fanTypes[i] > 1) {
								num = num + (ClosingInfoModel.fanTypes[i] - 1) * 10;
							}
							if (i >= 0 && i < 14 && exMingTangFen > 0) num += exMingTangFen;
							if (i > 14 && i < 19 && exHaoFen > 0) num += exHaoFen;
							if (i == 14) num = ClosingInfoModel.fanTypes[i];

							mingtangList[i] = mingtangList[i].replace(/\d+/, String(num));
						}

						if (i == 6 && ClosingInfoModel.fanTypes[i] == 2) {
							mingtangList[i] = mingtangList[i].replace("??????", "??????");
						}
						if (i == 1 && ClosingInfoModel.fanTypes[i] == 2) {
							mingtangList[i] = mingtangList[i].replace("??????", "??????");
						}

						str += mingtangList[i];
						if (ClosingInfoModel.fanTypes[i] > 1 && (i != 5) && (i != 14) && (i != 6) && (i != 1)) {
							str += ("x" + ClosingInfoModel.fanTypes[i]);
						}
						str += "\n";
					}
				}
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDS) {
			var configObj = {
				1: "??????    4???", 2: "?????????    8???", 3: "??????    8???", 4: "?????????    16???", 5: "??????    16???",
				6: "?????????    3???", 7: "??????    2???", 8: "??????    4???", 9: "??????    4???", 10: "??????    2???", 11: "??????    2???", 12: "??????    2???"
			};

			var xingScore = ClosingInfoModel.ext[10];
			if (xingScore >= 0) {
				var xingType = intParams[5] == 1 ? "??????    " : "??????    ";
				str += (xingType + (xingScore / 3) + "\n");
				str += ("??????    " + (Number(xingScore) + Number(ClosingInfoModel.huxi)) + "\n");
			}

			var data = ClosingInfoModel.fanTypes || [];

			for (var i = 0; i < data.length; i++) {
				if (configObj[data[i]]) {
					str += configObj[data[i]];
				}
				str += "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) {
			var configObj = {
				1: "??????    4???", 2: "?????????    8???", 3: "??????    8???", 4: "?????????    16???", 5: "??????    16???",
				6: "?????????    3???", 7: "??????    2???", 8: "??????    4???", 9: "??????    4???", 10: "??????    2???", 11: "??????    2???", 12: "??????    2???"
			};

			var xingScore = ClosingInfoModel.ext[10];
			if (xingScore >= 0) {
				var xingType = intParams[5] == 1 ? "??????    " : "??????    ";
				str += (xingType + xingScore + "\n");
				str += ("??????    " + (Number(xingScore) + Number(ClosingInfoModel.huxi)) + "\n");
			}

			var data = ClosingInfoModel.fanTypes || [];

			for (var i = 0; i < data.length; i++) {
				if (configObj[data[i]]) {
					str += configObj[data[i]];
				}
				str += "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ) {
			var configObj = {
				1: "??????    4???", 2: "?????????    8???", 3: "??????    8???", 4: "?????????    16???", 5: "??????    16???", 6: "?????????    32???",
				7: "?????????    3???", 8: "??????    2???", 9: "??????    4???", 10: "?????????    3???", 11: "?????????    4???", 12: "??????    2???"
			};

			var xingScore = ClosingInfoModel.ext[10];
			if (xingScore >= 0) {
				var xingType = intParams[5] == 1 ? "??????    " : "??????    ";
				str += (xingType + (xingScore) + "\n");
				var tun = Number(xingScore);
				var qihu = intParams[14] || 15;
				if (ClosingInfoModel.huxi >= qihu) tun += (2 + Math.floor((ClosingInfoModel.huxi - qihu) / 3));
				str += ("??????    " + tun + "\n");
			}

			var data = ClosingInfoModel.fanTypes || [];

			for (var i = 0; i < data.length; i++) {
				if (configObj[data[i]]) {
					str += configObj[data[i]];
				}
				str += "\n";
			}

		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ) {
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1: "  ??????    +100", 2: "  ??????(??????) +100", 3: "  ??????    +10",
				4: " ?????????    x2", 5: " ??????(??????)  x2", 6: " ??????(??????) +100",
				7: "  ??????    +100", 8: " ?????????    x2", 9: " ?????????   x2",
				10: "", 11: " ??????    +10", 12: " 30??????(??????) +100",
				13: " ??????    +10", 14: " 30??????   x2", 15: " ??????    x2",
				16: " ??????   +100"
			};
			for (var i = 0; i < data.length; i++) {
				if (configObj[data[i]]) {
					str += configObj[data[i]];
				}
				str += "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ) {
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1: "  ??????     x2", 4: " ?????????    x2", 5: "  ??????     x2",
				7: "  ??????     x2", 15: " ??????    x2"
			};
			for (var i = 0; i < data.length; i++) {
				if (configObj[data[i]]) {
					str += configObj[data[i]];
				}
				str += "\n";
			}
			if (ClosingInfoModel.tun) {
				tunStr = "\n" + "??????:" + ClosingInfoModel.tun + "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ) {
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1: "  ??????  ", 2: "  ?????????3???  ", 3: "  ????????????  ", 4: " ????????? ",
				5: "  ??????  ", 7: "  ??????  ", 8: " ????????? ",
				9: " ????????? ", 10: " ????????? ", 14: " 30?????? ",
				15: " ??????  "
			};
			for (var i = 0; i < data.length; i++) {
				if (configObj[data[i]]) {
					str += configObj[data[i]];
				}
				str += "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ) {
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				3: "  ??????  +2??? ", 4: " ?????????  +3??? ", 5: "  ?????????  +4??? ",
				6: "  ?????????  +2??? ", 7: "  ??????  +5??? ", 16: " 18??? +6??? ",
				17: " ???????????? +6??? ", 18: " ?????? +1??? ", 19: " ?????? x2 ",
				20: " ?????????????????? "
			};
			for (var i = 0; i < data.length; i++) {
				if (configObj[data[i]]) {
					str += configObj[data[i]];
				}
				str += "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ) {
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1: " ?????? ", 2: " ?????? ", 3: " ?????? ", 4: " ?????? ", 5: " ????????? ",
				6: " ?????? ", 7: " ????????? ", 8: " ????????? ", 9: " ????????? ", 10: " ?????? ",
				11: " ?????? ", 12: " ????????? ", 13: " ?????? "
			};
			for (var i = 0; i < data.length; i++) {
				if (configObj[Math.floor(data[i] / 100)]) {
					if (Math.floor(data[i] / 100) == 13 && ClosingInfoModel.intParams[31] > 0) {//???????????????
						str += configObj[Math.floor(data[i] / 100)] + " + " + data[i] % 100 + "???";
					} else {
						str += configObj[Math.floor(data[i] / 100)] + "   " + data[i] % 100 + "???";
					}
				}
				str += "\n";
			}
			if (ClosingInfoModel.tun) {
				if (data.length < 4) {
					tunStr += "\n";
				}
				if (ClosingInfoModel.tun != 0 && ClosingInfoModel.intParams[34] > 0) {
					tunStr += "??????+" + ClosingInfoModel.intParams[34] + "  " + "??????:" + ClosingInfoModel.tun + "\n";
				} else {
					tunStr += "??????:" + ClosingInfoModel.tun + "\n";
				}
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ) {
			if (ClosingInfoModel.tun) {
				str += "??????:" + ClosingInfoModel.tun + "\n";
			}
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1: " ?????? ", 4: " ?????? ", 5: " ?????? ",
				6: " ?????? ", 7: " ????????? "
			};
			for (var i = 0; i < data.length; i++) {
				if (configObj[Math.floor(data[i] / 100)]) {
					if (Math.floor(data[i] / 100) == 13 && PHZRoomModel.intParams[31] > 0) {//???????????????
						str += configObj[Math.floor(data[i] / 100)] + " + " + data[i] % 100 + "???";
					} else {
						str += configObj[Math.floor(data[i] / 100)] + "   " + data[i] % 100 + "???";
					}
				}
				str += "\n";
			}
			if (ClosingInfoModel.fan) {
				tunStr += "?????????:" + ClosingInfoModel.fan + "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW) {
			var tempFan = 0;
			var data = ClosingInfoModel.fanTypes || [];
			//cc.log(" ?????????????????? ",JSON.stringify(data));
			var configObj = {
				1: "  ?????? ", 4: "  ?????? ", 5: "  ?????? ",
				6: "  ?????? ", 7: "  ?????? ", 8: " ????????? ",
				9: "  ?????? ", 10: " ????????? ", 15: " ?????? ",
				18: "  ?????? ", 19: "  ?????? ", 21: "  ?????? ", 22: "  ?????? ",
				23: "  ????????? ", 24: "  ?????? ", 25: "  ?????? ",
				26: "  ?????? ", 27: "  ?????? ", 28: "  ?????? "
			};

			if (PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ) {
				configObj[25] = "  ????????? ";
				configObj[29] = "  ????????? ";
				configObj[30] = "  ????????? ";
				configObj[31] = "  ????????? ";
				configObj[32] = "  ????????? ";
				configObj[33] = "  ????????? ";
			}
			if (PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW) {
				configObj[10] = configObj[33] = " ????????? ";
				configObj[8] = " ????????? ";
				configObj[9] = " ????????? ";
				configObj[7] = configObj[28] = " ?????? ";
				configObj[21] = " ????????? ";
				configObj[3] = " ?????? ";
			}

			var menziStr = "";
			for (var i = 0; i < data.length; i++) {
				if (data[i]) {
					var tempVal = parseInt(data[i]);
					var tunshu = tempVal % 100;
					tempVal = Math.floor(tempVal / 100);
					var tempTunStr = (tempVal % 10) === 0 ? "???" : "???";
					if ((tempVal % 10) === 1) {
						tempFan += tunshu;
					}
					tempVal = Math.floor(tempVal / 10);
					var typeVal = tempVal % 100;
					if (configObj[typeVal]) {
						if (typeVal == 19) {
							menziStr += configObj[typeVal] + "*" + tunshu;
						} else {
							menziStr += configObj[typeVal] + "+" + tunshu + tempTunStr;
						}
					}
				}
				menziStr += "\n";
			}

			if (ClosingInfoModel.tun > 0) {
				str += "??????: " + ClosingInfoModel.tun + "\n";
			}
			if (ClosingInfoModel.fan > 0) {
				str += "??????: " + ClosingInfoModel.fan + "\n";
			}
			str += menziStr;
			if (ClosingInfoModel.totalTun) {
				str += "??????:" + ClosingInfoModel.totalTun + "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP) {
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				2: " ?????? " + intParams[19] + " ??? ", 1: " ?????? " + intParams[12] + " ??? "
			};
			if (configObj[data[0]]) {
				str += configObj[data[0]] + "\n";
			}

		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS) {
			if (ClosingInfoModel.fanTypes) {
				for (var i = 0; i < ClosingInfoModel.fanTypes.length; i++) {
					if (ClosingInfoModel.fanTypes[i] > 0) {
						str = str + mingtangList[i] + ClosingInfoModel.fanTypes[i] + "\n"
					}
				}
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.DYBP) {
			var confingData = {
				1: "  ??????     +10", 2: "  ??????     +10", 3: "  ??????     +10",
				4: "?????????     x2", 5: "?????????     x2", 6: "?????????     60", 7: "  ??????     60"
			};
			var tempFanTypes = ClosingInfoModel.fanTypes || [];

			var otherConfingData = { 1: "  ??????     x2", 2: "  ??????     x2" };

			cc.log(" ??????????????? ");
			cc.log(" ???????????? tempFanTypes = ", JSON.stringify(tempFanTypes));

			var isZiMo = false;

			//????????????
			for (var i = 0; i < tempFanTypes.length; i++) {
				if (confingData[tempFanTypes[i]]) {
					if (parseInt(tempFanTypes[i]) >= 4) {
						str = str + confingData[tempFanTypes[i]] + "\n";
					}
					if (!isZiMo && tempFanTypes[i] == 3) {
						isZiMo = true;
					}
				}
			}

			//???????????????
			for (var i = 0; i < tempFanTypes.length; i++) {
				if (otherConfingData[tempFanTypes[i]]) {
					if (ClosingInfoModel.intParams[31] == 2) {
						str = str + otherConfingData[tempFanTypes[i]] + "\n";
					} else {
						str = str + confingData[tempFanTypes[i]] + "\n";
					}
				}
			}

			if (isZiMo) {
				str = str + confingData[3] + "\n";
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ) {
			if (ClosingInfoModel.fanTypes) {
				for (var i = 0; i < ClosingInfoModel.fanTypes.length; i++) {
					if (ClosingInfoModel.fanTypes[i] == 18) {
						str = str + "??????+1???" + "\n"
					}
				}
			}
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].point > 0) {
					if (this.data[i].strExt[12] && this.data[i].strExt[12] > 0)
						str = str + "??????" + this.data[i].strExt[12] + "???" + "\n"
					if (this.data[i].strExt[11] && this.data[i].strExt[11] != -1)
						str = str + "???" + this.data[i].strExt[11] + "???" + "\n"
				}
			}
		} else {
			if (ClosingInfoModel.fanTypes) {
				for (var i = 0; i < ClosingInfoModel.fanTypes.length; i++) {
					for (var j = 0; j < mingtangList.length; j++) {
						if (ClosingInfoModel.fanTypes[i] == j + 1) {
							str = str + mingtangList[j] + "\n"
						}
					}
				}
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ) {
			str = tunStr + str;
			var xingStr = intParams[10] == 1 ? "  ??????     " : "  ??????     ";
			if (ClosingInfoModel.intParams[10] > 0)
				str = xingStr + ClosingInfoModel.ext[26] + str;
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK) {
			str = tunStr + str;
			var xingStr = intParams[10] == 1 ? "  ??????     " : "  ??????     ";
			if (ClosingInfoModel.intParams[10] > 0)
				str = xingStr + ClosingInfoModel.ext[26] + str;
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP) {
			if (xingSeat !== -1 && this.data[xingSeat]) {
				str += "??????  +" + this.data[xingSeat].point;
				if (!isHuang) {
					var score = this.data[xingSeat].point + this.data[huSeat].point;
					this.getWidget("nowPoint").setString("??????:" + score);
					if (PHZRoomModel.mySeat == this.data[xingSeat].seat) {
						Image_84.loadTexture("res/res_phz/phzSmallResult/image_win.png");
					}
				}
			}
			str = tunStr + str;
			var xingStr = intParams[10] == 1 ? "  ??????     " : "  ??????     ";
			str = xingStr + ClosingInfoModel.ext[26] + str;
		} else {
			str = str + tunStr;
		}

		var zimo = this.getWidget("zimo"); //????????????
		zimo.setString("" + str);

		if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW) {
			zimo.y += 10;
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS) {
			zimo.y += 20;
		}

		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

		var renshu = ClosingInfoModel.ext[7];

		this.Button_2 = this.getWidget("Button_2");
		this.Button_Ready = this.getWidget("btnReady");
		UITools.addClickEvent(this.Button_2, this, this.onOk);
		UITools.addClickEvent(this.Button_Ready, this, this.onOk);
		//this.Button_hand = this.getWidget("Button_hand");
		//UITools.addClickEvent(this.Button_hand,this,this.onHandCard);
		//this.Button_js = this.getWidget("Button_14");
		this.Button_zm = this.getWidget("Button_15");
		this.Button_zm.visible = false;
		this.Button_toResultView = this.getWidget("btnToResultView");

		var xipai_btn = this.getWidget("xipai_btn");
		UITools.addClickEvent(xipai_btn, this, this.onXiPai);
		if (PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1) {
			xipai_btn.visible = false;
		} else {
			xipai_btn.visible = PHZRoomModel.creditConfig[10] == 1;
		}
		var xpkf = PHZRoomModel.creditXpkf ? PHZRoomModel.creditXpkf.toString() : 0;
		this.getWidget("label_xpkf").setString(xpkf);

		//UITools.addClickEvent(this.Button_js,this,this.onJieSuan);
		UITools.addClickEvent(this.Button_zm, this, this.onZhuoMian);
		UITools.addClickEvent(this.Button_toResultView, this, this.onJieSuan);
		this.onJieSuan();
		var btn_jiesan = this.getWidget("btn_jiesan");
		var btn_share = this.getWidget("btn_share");
		btn_share.visible = false;
		UITools.addClickEvent(btn_share, this, this.onShare);
		UITools.addClickEvent(btn_jiesan, this, this.onBreak);


		var btn_handXq = this.getWidget("btn_handXq");
		btn_handXq.visible = false;
		UITools.addClickEvent(btn_handXq, this, this.onHandCard);

		if (PHZRoomModel.isMoneyRoom()) {
			btn_jiesan.setVisible(false);
			btn_handXq.setVisible(false);
			this.Button_zm.loadTextureNormal("res/res_phz/phzBigResult/btn_return_hall.png");
			this.Button_2.loadTextureNormal("res/res_phz/phzBigResult/btn_start_another.png");
			this.Button_Ready.loadTextureNormal("res/res_phz/phzBigResult/btn_start_another.png");
			this.Button_2.setScale(0.9);
			this.Button_zm.setScale(0.9);
		}

		var Image_40 = this.getWidget("Image_40"); //????????????
		Image_40.visible = false;

		//?????????
		if (this.getWidget("Label_version")) {
			this.getWidget("Label_version").setString(SyVersion.v);
		}
		var date = new Date();
		var hours = date.getHours().toString();
		hours = hours.length < 2 ? "0" + hours : hours;
		var minutes = date.getMinutes().toString();
		minutes = minutes.length < 2 ? "0" + minutes : minutes;
		if (this.getWidget("Label_time")) {
			this.getWidget("Label_time").setString(hours + ":" + minutes);
		}

		this.getWidget("Label_roomnum").setString("?????????:" + ClosingInfoModel.ext[0]);
		var jushuStr = "???" + PHZRoomModel.nowBurCount + "???";
		if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP || PHZRoomModel.wanfa == GameTypeEunmZP.CZZP
			|| PHZRoomModel.wanfa == GameTypeEunmZP.LYZP || PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) {
			jushuStr = "???" + PHZRoomModel.nowBurCount + "/" + PHZRoomModel.totalBurCount + "??? ";
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ) {
			jushuStr += "    ?????????" + (this.isRePlay ? ClosingInfoModel.ext[27] : PHZRoomModel.intParams[49])
		}
		this.getWidget("Label_jushu").setString(jushuStr);
		//????????????
		var wanfaStr = "";
		if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP && !this.isRePlay) {
			var intParams = this.isRePlay ? PHZRePlayModel.intParams : PHZRoomModel.intParams;
			var huxi = intParams[11] == 2 ? 6 : intParams[11] == 3 ? 3 : 9;
			var tunStr = " 3?????????";
			if (intParams[10] == 2) {
				tunStr = " 1?????????";
			}
			var zhuanhuanStr = huxi + "???1??????";
			if (intParams[12] == 2) {
				zhuanhuanStr = huxi + "???" + huxi / 3 + "??????";
			}
			wanfaStr = wanfaStr + " " + zhuanhuanStr + tunStr;
			if (intParams[14] == 2) {
				wanfaStr = wanfaStr + " ?????????";
			}
			if (intParams[14] == 3) {
				wanfaStr = wanfaStr + " ?????????2???";
			}
		}
		this.getWidget("Label_wanfa").setString(wanfaStr);
		if (this.isRePlay) {
			var str = "???" + PHZRePlayModel.playCount + "???"
			if (PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ) {
				str = "???" + PHZRePlayModel.playCount + "???" + "    ?????????" + ClosingInfoModel.ext[27]
			}
			this.getWidget("Label_jushu").setString(str);
		}

		// cc.log("ClosingInfoModel.ext[25] ="+ClosingInfoModel.ext[25]+" ClosingInfoModel.ext[26] ="+ClosingInfoModel.ext[26]);
		if ((PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ || PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK) && !this.isRePlay) {
			if (PHZRoomModel.intParams[10] > 0 && ClosingInfoModel.ext[25] > 0) {
				var vo = PHZAI.getPHZDef(parseInt(ClosingInfoModel.ext[25]));
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct, 3), vo);
				card.x = 1350;
				card.y = 675;
				this.resultView.addChild(card);
				var string = PHZRoomModel.intParams[10] == 1 ? "??????" : "??????";
				var label = UICtor.cLabel(string, 24, cc.size(80, 30), cc.color(128, 51, 6), 1, 1);//cc.color(129,49,0) ColorUtil.WHITE
				label.x = 25;
				label.y = 70;
				card.addChild(label);
			}
		}

		if (this.isRePlay) {
			this.getWidget("replay_tip").visible = true;
		} else {
			this.getWidget("replay_tip").visible = false;
		}

		if (PHZRoomModel.isMoneyRoom()) {
			this.getWidget("Label_roomnum").setString("??????:" + ClosingInfoModel.ext[0]);
			this.getWidget("Label_jushu").setString("??????:" + PHZRoomModel.goldMsg[2]);
		}
	},

	onSettlement:function(){
        PopupManager.remove(this);
    },

	onXiPai: function (obj) {
		// obj.setTouchEnabled(false);
		sySocket.sendComReqMsg(4501, [], "");
		this.issent = true;
		PopupManager.remove(this);
		this.onOk(obj);
	},

	isSpecialPHZ: function () {
		return (ClosingInfoModel.ext[3] == 38 && ClosingInfoModel.ext[7] == 4)
	},

	refreshSingle: function (widget, user, pointInfo, index) {
		// cc.log("index..." , index);
		// user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";

		if (user.isShuXing) {
			if (user.seat == user.isShuXing) {
				ccui.helper.seekWidgetByName(widget, "sx").visible = true;
			} else {
				ccui.helper.seekWidgetByName(widget, "sx").visible = false;
			}
		} else {
			ccui.helper.seekWidgetByName(widget, "sx").visible = false;
		}

		ccui.helper.seekWidgetByName(widget, "name").setString(user.name);
		ccui.helper.seekWidgetByName(widget, "uid").setString("UID:" + user.userId);
		var defaultimg = "res/res_phz/default_m.png";
		var sprite = new cc.Sprite(defaultimg);
		sprite.scale = 0.98;
		sprite.x = 45;
		sprite.y = 45;
		widget.addChild(sprite, 5, 345);
		//sprite.setScale(1.05);
		if (user.icon) {
			cc.loader.loadImg(user.icon, { width: 75, height: 75 }, function (error, img) {
				if (!error) {
					sprite.setTexture(img);
				}
			});
		}

		var point = ccui.helper.seekWidgetByName(widget, "point");

		var pointStr = "";
		var totalPointStr = "";
		if (parseInt(user.point) > 0) {
			pointStr = "+" + user.point;
		} else {
			pointStr = "" + user.point;
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP) {
			if (user.bopiPoint != 0) {
				if (parseInt(user.bopiPoint) > 0) {
					pointStr = pointStr + " ?????? +" + user.bopiPoint;
				} else {
					pointStr = pointStr + " ?????? " + user.bopiPoint;
				}
			}
		}

		var label = new cc.LabelTTF(pointStr, "res/font/bjdmj/fznt.ttf", 30);
		label.setColor(cc.color(128, 21, 6));
		//var label = new cc.LabelBMFont(user.point+"",fnt);
		label.anchorX = 0;
		label.x = 0;
		label.y = 18;
		point.addChild(label, 6);

		//cc.log("pointStr==="+pointStr);

		if (user.totalPoint != null) {
			//if (parseInt(user.totalPoint) > 0 ){
			//	totalPointStr = "+" + user.totalPoint;
			//}else{
			if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF) {
				totalPointStr = "" + user.allHuxi;
				// }else if(PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
				// 	totalPointStr = "" + user.finalPoint;
			} else {
				totalPointStr = "" + user.totalPoint;
			}


			//}

			var str = ""
			if (PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS) {
				label.y = 23
				var chongfen = 0
				if (user.strExt[2] >= 0) {
					if (parseInt(user.point) > 0) {
						chongfen = "+" + ClosingInfoModel.fanTypes[3]
					} else {
						for (var i = 0; i < this.data.length; i++) {
							if (this.data[i].point > 0) {
								chongfen = -(parseInt(this.data[i].strExt[2]) + parseInt(user.strExt[2]))
								break;
							}
						}
					}
					str = "???" + chongfen + "\n"
				}
			}
			str += "??????:" + totalPointStr;

			//cc.log("totalPoint==="+user.totalPoint);
			var totalPoint = ccui.helper.seekWidgetByName(widget, "totalPoint");
			totalPoint.setString(str);
			if (PHZRoomModel.isMatchRoom() || PHZRoomModel.isMoneyRoom()) {
				totalPoint.setString(totalPointStr);
				this.showMoneyIcon(label1);
			}
		}

		//?????????????????????
		if (user.userId == ClosingInfoModel.ext[1]) {
			var fangzhu = new cc.Sprite("res/res_phz/fangzhu.png");
			fangzhu.anchorX = fangzhu.anchorY = 0;
			fangzhu.x = 50;
			fangzhu.y = 50;
			widget.addChild(fangzhu, 10);
		}
		if (index == 0) {
			var nowPoint = this.getWidget("nowPoint");
			nowPoint.setString("??????:" + user.point);

			if (PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) {
				nowPoint.setString("??????:" + user.bopiPoint);
			}

			if (PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ || PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ
				|| PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ || PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ
				|| PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW) {
				nowPoint.setString("");
			}
		}
		// cc.log("user.strExt[10] =",JSON.stringify(user.strExt));
		if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP || PHZRoomModel.wanfa == GameTypeEunmZP.WHZ || PHZRoomModel.wanfa == GameTypeEunmZP.LSZP || PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ) {
			var piaoNum = user.strExt[10];
			if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) {
				piaoNum = user.finalPoint || -1;
			} else if (PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ) {
				piaoNum = user.strExt[11]
			}
			if (piaoNum != -1) {
				var pngUrl = "res/res_phz/biao_piao" + piaoNum + ".png";
				var piaofen = new cc.Sprite(pngUrl);
				// piaofen.anchorX = piaofen.anchorY = 0;
				piaofen.x = 75;
				piaofen.y = 15;
				widget.addChild(piaofen, 10);
			}
		} else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS) {
			if (PHZRoomModel.bankerSeat == user.seat) {
				var zhuang = new cc.Sprite("res/res_phz/Z_zhuang.png");
				zhuang.x = 17;
				zhuang.y = 7;
				widget.addChild(zhuang, 10);
			}
			var piaoNum = user.strExt[2];
			if (piaoNum != -1) {
				var pngUrl = "res/res_phz/xxeqs/img_chongfen_" + piaoNum + ".png";
				var piaofen = new cc.Sprite(pngUrl);
				piaofen.x = 78;
				piaofen.y = 15;
				widget.addChild(piaofen, 10);
			}
		}
	},

	showMoneyIcon: function (label) {
		var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
		icon.setAnchorPoint(1, 0.5);
		icon.setScale(0.5);
		icon.setPosition(label.x, label.y);
		label.getParent().addChild(icon);
	},

	onOk: function (obj) {
		obj.setTouchEnabled(false);
		if (PHZRoomModel.isMoneyRoom() && !this.isRePlay) {
			this.moneyRoomStartAnother();
			return;
		}

		if (ClosingInfoModel.isReplay || !LayerManager.isInRoom()) {
			if (ClosingInfoModel.isReplay) {
				LayerManager.showLayer(LayerFactory.HOME);
			}
			PopupManager.remove(this);
			return;
		}
		var data = this.data;
		// var isDjtgEnd = 0;
		if (ClosingInfoModel.ext[3] == GameTypeEunmZP.SYZP || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38) {
			if (PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1) {//???????????????
				PopupManager.remove(this);
				var mc = new PHZBigResultPop(data);
				PopupManager.addPopup(mc);
				var obj = HongBaoModel.getOneMsg();
				if (obj) {
					var mc = new HongBaoPop(obj.type, obj.data);
					PopupManager.addPopup(mc);
				}
			} else {
				if (PHZRoomModel.isStart) {
					PHZRoomModel.cleanSPanel();
					PopupManager.remove(this);
					sySocket.sendComReqMsg(3);
				} else {
					sySocket.sendComReqMsg(3);
				}
			}
		} else {
			if (ClosingInfoModel.ext[6] == 1) {//???????????????
				PopupManager.remove(this);
				var mc = new PHZBigResultPop(data);
				PopupManager.addPopup(mc);
				var obj = HongBaoModel.getOneMsg();
				if (obj) {
					var mc = new HongBaoPop(obj.type, obj.data);
					PopupManager.addPopup(mc);
				}
			} else {
				if (PHZRoomModel.isStart) {
					PHZRoomModel.cleanSPanel();
					PopupManager.remove(this);
					sySocket.sendComReqMsg(3);
				} else {
					sySocket.sendComReqMsg(3);
				}
			}
		}
	},

	onBreak: function () {
		AlertPop.show("???????????????????????????????????????????????????????????????", function () {
			sySocket.sendComReqMsg(7);
		})
	},

	onShare: function () {

	},

	onHandCard: function () {
		//cc.log("onHandCard ClosingInfoModel.huSeat..." , ClosingInfoModel.huSeat);
		var mc = new PHZHandCardPop(this.data, ClosingInfoModel.ext[1], this.winUserId);
		PopupManager.open(mc, true);
	},

	onJieSuan: function () {
		/*    	this.Button_js.setBright(true);
				this.Button_zm.setBright(false);
				this.panel_16.visible = true;
				this.panel_17.visible = false;*/

		this.resultView.visible = true;
		this.roomView.visible = false;
	},

	onZhuoMian: function () {
		if (PHZRoomModel.isMoneyRoom() && !this.isRePlay) {
			PopupManager.remove(this);
			if (LayerManager.getLayer(LayerFactory.GOLD_LAYER)) {
				LayerManager.showLayer(LayerFactory.GOLD_LAYER);
			} else {
				LayerManager.showLayer(LayerFactory.HOME);
			}
			return;
		}

		/*    	this.Button_js.setBright(false);
				this.Button_zm.setBright(true);
				this.panel_16.visible = false;
				this.panel_17.visible = true;*/

		this.resultView.visible = false;
		this.roomView.visible = true;

	},

	//?????????????????????
	moneyRoomStartAnother: function () {
		//var keyId = GoldRoomConfigModel.curClickRoomkeyId;
		//cc.log("GoldRoomConfigModel.curClickRoomkeyId=="+GoldRoomConfigModel.curClickRoomkeyId)
		//this.clickStartAnother = true;
		//ComReq.comReqChangeSrv([] , ["" + keyId],1);

		var data = CheckJoinModel.getJoinMatchData();
		if (data) {
			CheckJoinModel.toMatchRoom(data.playType, data.matchType, data.keyId);
		} else {
			PopupManager.remove(this);
			LayerManager.showLayer(LayerFactory.HOME);
		}
	},

	onChooseCallBack: function (event) {
		var status = event.getUserData();
		if (status == ServerUtil.GET_SERVER_ERROR) {
			sy.scene.hideLoading();
			FloatLabelUtil.comText("????????????");
		} else if (status == ServerUtil.NO_NEED_CHANGE_SOCKET) {
			this.onSuc();
		}
	},

	onSuc: function () {
		sy.scene.hideLoading();
		if (this.clickStartAnother) {
			this.clickStartAnother = false;
			var keyId = GoldRoomConfigModel.curClickRoomkeyId;
			var goldRoomId = GoldRoomConfigModel.goldRoomId;
			// cc.log("onSuc===",keyId,goldRoomId);
			sySocket.sendComReqMsg(2, [], ["" + keyId, "" + goldRoomId], 1);
		}
	},
});
