/**
 * Created by zhoufan on 2016/11/29.
 */

var ZZPHSmallResultPop=BasePopup.extend({
	pointInfo:null,
	isRePlay:null,
    ctor: function (data,isRePlay) {
        this.data = data;
        this.isRePlay = isRePlay;
		var path = "res/zzphSmallResult.json";
        this._super(path);
    },

    selfRender: function () {
		this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        var isFangpao = ClosingInfoModel.ext[15];
		this.winUserId = 0;
		this.data.sort(function (user1 , user2){
			var point1 = parseInt(user1.point);
			var point2 = parseInt(user2.point);
			return  point1 < point2;
		});
		var myPoint = 0;
        // cc.log("this.data=",JSON.stringify(this.data));
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].seat == PHZRoomModel.mySeat){
				myPoint = this.data[i].point;
			}
		}
		if(isFangpao == 0){
			this.getWidget("Image_fangpao").visible = false;
		}

		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

        if(this.data.length==3){
        	this.getWidget("user4").visible = false;
        }else if(this.data.length==2){
			this.getWidget("user4").visible = false;
			this.getWidget("user3").visible = false;
		}

		var xingSeat = -1;
		var huSeat = -1;
		var liuzhuangseat = -1;
        for(var i=0;i<this.data.length;i++){
			if(ClosingInfoModel.huSeat == this.data[i].seat){
				huSeat = i;
			}
			if (!ClosingInfoModel.huSeat && PHZRoomModel.banker == this.data[i].seat){
				this.getWidget("Image_chouzhuang").y = this.getWidget("user"+(i+1)).y;
				this.getWidget("Image_chouzhuang").visible = true;
			}

			if(this.data[i].seat == isFangpao){
	 			this.getWidget("Image_fangpao").y = this.getWidget("user"+(i+1)).y;
	 		}
        	this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
        }

		// cc.log("ClosingInfoModel.fan = ",JSON.stringify(ClosingInfoModel.fan));
		if (ClosingInfoModel.huSeat){
			var type_string = "res/res_phz/zzph/smallresult/type_" + ClosingInfoModel.fan + ".png";
			this.getWidget("Image_hutype").loadTexture(type_string);
		}else{
			this.getWidget("Image_hutype").visible =false;
		}
		
        var renshu = ClosingInfoModel.ext[7];

        this.Button_2 = this.getWidget("Button_2");
        UITools.addClickEvent(this.Button_2,this,this.onOk);

		//版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }
        var date = new Date();
        var hours = date.getHours().toString();
        hours = hours.length < 2 ? "0"+hours : hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length < 2 ? "0"+minutes : minutes;
        if(this.getWidget("Label_time")){
            this.getWidget("Label_time").setString(hours+":"+minutes);
        }
        this.getWidget("Label_roomnum").setString("房间号:"+ClosingInfoModel.ext[0]);
        var jushuStr = PHZRoomModel.nowBurCount + "/" + PHZRoomModel.totalBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);
        //玩法显示
        var wanfaStr = "";
        this.getWidget("Label_wanfa").setString(wanfaStr);
		if(this.isRePlay){
			this.getWidget("Label_jushu").setString("第" + PHZRePlayModel.playCount + "局");
		}

        if (this.isRePlay){
            this.getWidget("replay_tip").visible =  true;
        }
        // cc.log("ClosingInfoModel.leftCards =",JSON.stringify(ClosingInfoModel.leftCards));
        var leftCards = ClosingInfoModel.leftCards;
        for(var i=0;i<leftCards.length;i++){ //leftCards
            var vo = PHZAI.getPHZDef(leftCards[i]);
			var card = new ZZPHCard(PHZAI.getDisplayVo(this.direct,2),vo);
			card.x = (i%10)*52;
			card.y = 208 - Math.floor(i/10)*52;
			this.getWidget("Panel_dipai").addChild(card);
        }

		var btn_zm = this.getWidget("Button_desk");
		var btn_ok = this.getWidget("Button_24");
		var btn_left_card = this.getWidget("Button_card");

        UITools.addClickEvent(btn_zm,this,this.onZhuoMian);
        UITools.addClickEvent(this.getWidget("Button_23"), this, this.onJieSuan);
        UITools.addClickEvent(btn_ok,this,this.onOk);
		UITools.addClickEvent(btn_left_card,this,this.ShowLeftCards);
		
		var xipai_btn = this.getWidget("xipai_btn");
		UITools.addClickEvent(xipai_btn, this, function () {
			sySocket.sendComReqMsg(4501, [], "");
			this.issent = true;
			PopupManager.remove(this);
			this.onOk();
		});
		if (ClosingInfoModel.ext[6] == 1 || ClosingInfoModel.isBreak) {
			xipai_btn.visible = false;
		} else {
			xipai_btn.visible = PHZRoomModel.creditConfig[10] == 1;
		}
		var xpkf = PHZRoomModel.creditXpkf.toString() || 0;
		this.getWidget("label_xpkf").setString(xpkf);
		if(PHZRoomModel.isMoneyRoom()){
			btn_zm.loadTextureNormal("res/res_phz/phzBigResult/btn_return_hall.png");
			btn_ok.loadTextureNormal("res/res_phz/phzBigResult/btn_start_another.png");
			this.Button_2.loadTextureNormal("res/res_phz/phzBigResult/btn_start_another.png");
			btn_zm.setScale(0.9);
			btn_ok.setScale(0.9);
			btn_left_card.setVisible(false);
		}
	},
	ShowLeftCards:function(){
		this.getWidget("Panel_dipai").visible = !this.getWidget("Panel_dipai").isVisible();
	},
	onJieSuan:function(){
		this.resultView.visible = true;
		this.roomView.visible = false;
    },
    onZhuoMian:function(){
		if(PHZRoomModel.isMoneyRoom() && !this.isRePlay){
			PopupManager.remove(this);
			if(LayerManager.getLayer(LayerFactory.GOLD_LAYER)){
				LayerManager.showLayer(LayerFactory.GOLD_LAYER);
			}else{
				LayerManager.showLayer(LayerFactory.HOME);
			}
			return;
		}

		this.resultView.visible = false;
		this.roomView.visible = true;
    },

	showMoneyIcon:function(label){
		var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
		icon.setAnchorPoint(1,0.5);
		icon.setPosition(-10,label.height/2);
		label.addChild(icon);
	},

    refreshSingle:function(widget,user,pointInfo , index){
		// cc.log("index..." , index);
		//user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
		// cc.log("user =",JSON.stringify(user));
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
		ccui.helper.seekWidgetByName(widget, "uid").setString("UID:" + user.userId);
        var defaultimg = "res/res_phz/default_m.png";
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale=0.95;
        sprite.x = 60;
        sprite.y = 60;
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

		var pointStr = "";
		var totalPointStr = "";
		pointStr = user.point + "胡";

		if(PHZRoomModel.isMoneyRoom()){
			pointStr = user.totalPoint>0?("+" + user.totalPoint):("" + user.totalPoint);
		}
        
		var label = new cc.LabelBMFont(pointStr, "res/res_phz/zzph/smallresult/score.fnt");

		label.anchorX = 0;
		label.x = 0;
		label.y = 15;
		point.addChild(label,6);

		if(PHZRoomModel.isMoneyRoom()){
			this.showMoneyIcon(label);
		}

		if(user.bopiPoint >= 0){
            ccui.helper.seekWidgetByName(widget,"Image_daniao").loadTexture("res/res_phz/zzph/img_n"+user.bopiPoint+".png");
            ccui.helper.seekWidgetByName(widget,"Image_daniao").visible = true;
        }else{
            ccui.helper.seekWidgetByName(widget,"Image_daniao").visible = false;
        }

		if(PHZRoomModel.isMoneyRoom()){
			ccui.helper.seekWidgetByName(widget,"Image_daniao").visible = false;
		}

        var difX = 50;
		if(user.cards && user.cards.length > 0 || user.moldCards.length > 0){
			var voArray = [];
			var result = []
			if(user.cards.length > 0 ){
				for (var i = 0; i < user.cards.length; i++) {
			        voArray.push(PHZAI.getPHZDef(user.cards[i]));
				}
	            result = PHZAI.sortHandsVo(voArray);
	            for(var i=0;i<result.length;i++){
		            var array = result[i];
		            var zorder = array.length;
		            for(var j=0;j<array.length;j++){
		                var card = null;
		                card = new ZZPHCard(PHZAI.getDisplayVo(1,4),array[j]);
		                card.scale = 0.75;
		                card.x = i*difX*0.75;
		                card.y = j*50*0.75;
		                ccui.helper.seekWidgetByName(widget,"Panel_cards").addChild(card,zorder);
		                zorder--;
		            }
		        }
			}
				
			var lastCardsX = result.length * difX * 0.75 + 30;
	        if(user.moldCards && user.moldCards.length > 0){
	    		for (var i = 0; i < user.moldCards.length; i++) {
	    			var action = user.moldCards[i].action;
		        	var cards = user.moldCards[i].cards;
					var zorder = cards.length;
					var initX = i == 0?result.length * difX * 0.75 + 30:lastCardsX + difX;
		        	for(var j=0;j<cards.length;j++){
						zorder--;
			            var vo = PHZAI.getPHZDef(cards[j]);
			            var card = this.createBigCards(vo);
			            card.x = lastCardsX = initX + j*50;
			            card.y = 66;
			            card.scale = 0.5;
			            ccui.helper.seekWidgetByName(widget,"Panel_cards").addChild(card,zorder);
			        }

	            	if(action!=0){
			            if(action==10)
			                action=3;
						var resStr = "res/res_phz/zzph/smallresult/act"+action+".png";
			            var header = new cc.Sprite(resStr);
			            header.y = 132;
			            header.x = lastCardsX - 50;
			            ccui.helper.seekWidgetByName(widget,"Panel_cards").addChild(header,999);
			        }
	    		}
	    	}
	    		
		    if(ClosingInfoModel.huSeat == user.seat && ClosingInfoModel.huCard){
		      	var cardVo = PHZAI.getPHZDef(ClosingInfoModel.huCard);
			    var card = this.createBigCards(cardVo);
			    var resStr = "res/res_phz/zzph/smallresult/hubg.png";
			    var hubg = new cc.Sprite(resStr);
			    hubg.scale = 1.3;
			    card.addChild(hubg);
			    card.scale = 0.6;
			    hubg.setPosition(card.width/2,card.height/2);
			    card.x = lastCardsX + 75;
			    card.y = 75;
		      	ccui.helper.seekWidgetByName(widget,"Panel_cards").addChild(card,999);
		      	this.getWidget("Image_hutype").y = widget.y;
		    }        
		    cc.log("PHZRoomModel.banker =",PHZRoomModel.banker);
		    cc.log("user.seat =",user.seat);
		    if(PHZRoomModel.banker && PHZRoomModel.banker == user.seat){
		    	ccui.helper.seekWidgetByName(widget,"zhuang").visible = true;
		    	var string = "庄";
		    cc.log("ClosingInfoModel.totalTun =",ClosingInfoModel.totalTun);
		    	
		    	if (parseInt(ClosingInfoModel.totalTun) > 1){
		    		if(ClosingInfoModel.intParams[6] == 2){
		    			string = "中庄";
		    		}else if(ClosingInfoModel.intParams[6] == 1){
		    			string = "庄"+ClosingInfoModel.totalTun;
		    		}else{
		    			string = "庄";	
		    		}
		    	}
		    	ccui.helper.seekWidgetByName(widget,"label_zhuang").setString(string);
		    }
    	}
    },

    createBigCards:function(phzvo){
    	var pmType = PHZSetModel.pmxz;
        var kuangText = "#big_face"+pmType+".png";
        var per = 0.2;
        var kuang = new cc.Sprite(kuangText);
        var png = "cards_back.png";
        if(phzvo.c>0){
            png = this.getPaiPngurl(phzvo);
            var bg1 = this.getSprite(png);
            bg1.x = kuang.width/2;
            bg1.y = kuang.height*per;
            bg1.setFlippedY(-180);
            bg1.setFlippedX(-180);
            bg1.scale = 0.8;
            kuang.addChild(bg1);

            var bg = this.getSprite(png);
            bg.x = kuang.width/2;
            bg.y = kuang.height*(1-per);
            bg.scale = 0.8;
            kuang.addChild(bg);
        }
        return kuang;
    },
    getPaiPngurl:function(phzVo){
        var t = phzVo.t==1 ? "s" : "b";
        var paiType = PHZSetModel.zpxz;
        var png = "big_cards" + paiType + "_" + phzVo.n + t + ".png";
        return png
    },
    getSprite:function(texture){
        var frame = cc.spriteFrameCache.getSpriteFrame(texture);
        if(!frame){
            cc.log("PHZ texture::"+texture+" is not exist!!!");
        }
        return new cc.Sprite("#"+texture);
    },
	onOk:function(){

		if(PHZRoomModel.isMoneyRoom() && !this.isRePlay){
			this.moneyRoomStartAnother();
			return;
		}

		if(ClosingInfoModel.isReplay || (!LayerManager.isInRoom() && !ClosingInfoModel.isBreak)){
			PopupManager.remove(this);
			return;
		}
		var data = this.data;
		if(ClosingInfoModel.ext[6] == 1 || ClosingInfoModel.isBreak){//最后的结算
			PopupManager.remove(this);
			var mc = new ZZPHBigResultPop(data);
			PopupManager.addPopup(mc);
			var obj = HongBaoModel.getOneMsg();
			if(obj){
				var mc = new HongBaoPop(obj.type,obj.data);
				PopupManager.addPopup(mc);
			}
		}else{
			if (PHZRoomModel.isStart){
				PHZRoomModel.cleanSPanel();
				PopupManager.remove(this);
				sySocket.sendComReqMsg(3);
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

	//金币场继续游戏
	moneyRoomStartAnother:function(){
		//var keyId = GoldRoomConfigModel.curClickRoomkeyId;
		//cc.log("GoldRoomConfigModel.curClickRoomkeyId=="+GoldRoomConfigModel.curClickRoomkeyId)
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
