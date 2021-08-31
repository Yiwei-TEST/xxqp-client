/**
 * Created by zhoufan on 2016/11/29.
 */
var XPPHZSmallResultCell = ccui.Widget.extend({
    ctor:function(data,wanfa){
        this._super();
        var action = data.action;
        var cards = data.cards || [];
        var huxi = data.huxi || "";
        this.anchorX=0;
        this.anchorY=0;
        this.setContentSize(60,260);
        if(action!=0){
            if(action==10)
                action=3;
			var resStr = "res/res_phz/act"+action+".png";
            var header = new cc.Sprite(resStr);
            header.x = 30;
            header.y = 280;
            this.addChild(header);
        }
		var zorder = cards.length;
        for(var i=0;i<cards.length;i++){
			zorder--;
			var vo = PHZAI.getPHZDef(cards[i]);
			if ((action == 4 || action == 3) && i > 0)
				vo.a = 1;
			var ishu = false;
			if (cards[i] == ClosingInfoModel.huCard) {
				ishu = true;
			}
			vo.ishu = ishu;
			var card = new XPPHZCard(PHZAI.getDisplayVo(this.direct, 3), vo);
			card.x = 6;
			card.y = 22 + i * 71;
			this.addChild(card, zorder);
        }
        var label = UICtor.cLabel(huxi+"",30,cc.size(60,30),cc.color(128,51,6),1,1);//cc.color(129,49,0) ColorUtil.WHITE
        label.x = 33;
        label.y = -18;
        this.addChild(label);
		this.label_huxi = label;
    }
});

var XPPHZSmallResultPop=BasePopup.extend({
	pointInfo:null,
	isRePlay:null,
    ctor: function (data,isRePlay) {
        this.data = data;
        this.isRePlay = isRePlay;
		var path = "res/phzSmallResult.json";
		// if(PHZRoomModel.is2Ren()){
		// 	path = "res/phzSmallResultTwo.json";
		// }
        this._super(path);
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
		var isYk = false;
        // cc.log("this.data=",JSON.stringify(this.data));
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].seat == PHZRoomModel.mySeat || (this.isRePlay && this.data[i].userId == PlayerModel.userId)){
				myPoint = this.data[i].point;
				isYk = true;
			}
		}
		var Image_84 = this.getWidget("Image_84");
		var imgUrl = myPoint > 0 ? "res/res_phz/phzSmallResult/image_win.png" : "res/res_phz/phzSmallResult/image_lose.png";

		if(this.isRePlay && !isYk){
			imgUrl = "res/res_phz/phzSmallResult/image_win.png";
		}

		Image_84.loadTexture(imgUrl);
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].point>0){
                break;
            }else if(this.data[i].point==0){
                isHuang = true;
                break;
            }
        }
		this.getWidget("Image_HZ").visible = isHuang;

        if(this.data.length==3){
        	this.getWidget("user4").visible = false;
        }else if(this.data.length==2){
			this.getWidget("user4").visible = false;
			this.getWidget("user3").visible = false;
		}
		var zhuangSeat = -1;
		var xingSeat = -1;
		var huSeat = -1;
        for(var i=0;i<this.data.length;i++){
        	this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
			if(this.data[i].seat == this.data[i].isShuXing){
				xingSeat = i;
			}
			if(ClosingInfoModel.huSeat == this.data[i].seat){
				huSeat = i;
			}
        }
        this.list = this.getWidget("ListView_6");
        var cards = ClosingInfoModel.cards;
		for(var i=0;i<cards.length;i++){
			if(cards[i].cards.length > 4){
				for(var t = 0;t<cards[i].cards.length/2;++t){
					var tempCards = cards[i].cards.slice(t*2,t*2+2);
					var data = ObjectUtil.deepCopy(cards[i]);
					data.cards = tempCards;
					var cell = new XPPHZSmallResultCell(data,PHZRoomModel.wanfa);
					this.list.pushBackCustomItem(cell);
				}
			}else{
				var cell = new XPPHZSmallResultCell(cards[i],PHZRoomModel.wanfa);
				this.list.pushBackCustomItem(cell);
			}
		}
		var offX = 56;
		var Image_1 = this.getWidget("resultView");
		var leftCards = ClosingInfoModel.leftCards;
		var allLeftCards = ClosingInfoModel.startLeftCards;
		var dipaiHeight = 570;

		var dipaiPanel = this.getWidget("Panel_dipai");
		var cpNum = 0;
		if (ClosingInfoModel.ext[14]){
			cpNum = parseInt(ClosingInfoModel.ext[14]);
		}

		var indexY = 20;
		var otherDipai = [];
		var scaleNum = 1;


        for(var i=0;i<leftCards.length;i++){ //leftCards
			var index = i;
            var vo = PHZAI.getPHZDef(leftCards[i]);
			var card = new XPPHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
			var diffY = card.getContentSize().height;
			var numY = Math.floor(index/indexY);
			var numX = index%indexY;
			card.x = 110 + numX * offX * scaleNum;
			card.y = card.y - diffY * numY;
			dipaiPanel.addChild(card);
        }
        var maipaiPanel = this.getWidget("Panel_maipai");
        var maiPaiCards = ClosingInfoModel.chouCards;
        if (maiPaiCards && maiPaiCards.length > 0){
            for(var i=0;i<maiPaiCards.length;i++){ 
                var card = new XPPHZCard(PHZAI.getDisplayVo(this.direct,3),PHZAI.getPHZDef(maiPaiCards[i]));
                var diffY = card.getContentSize().height *0.5;
                var numY = Math.floor(i/indexY);
                var numX = i%indexY;
                card.x = 60 + numX * offX;
                card.y = card.y - diffY * numY;
                maipaiPanel.addChild(card);
            }
        }else{
            maipaiPanel.visible=false;
        }

        if(ClosingInfoModel.huxi>0){
            var huxi = this.getWidget("huxi");
			huxi.setString("胡息:"+ClosingInfoModel.huxi);
        }else{
            this.getWidget("huxi").visible = false;
        }

        var configObj = {0:"",1:"平胡",2:"自摸",3:"点炮"};

        var fan = ClosingInfoModel.fan || 0;
        var str = configObj[fan];

        var zimo = this.getWidget("zimo"); //自摸文本
        zimo.setString(str);
		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

        var renshu = ClosingInfoModel.ext[7];

        this.Button_2 = this.getWidget("Button_2");
        this.Button_Ready = this.getWidget("btnReady");
        UITools.addClickEvent(this.Button_2,this,this.onOk);
        UITools.addClickEvent(this.Button_Ready,this,this.onOk);
        //this.Button_hand = this.getWidget("Button_hand");
        //UITools.addClickEvent(this.Button_hand,this,this.onHandCard);
        //this.Button_js = this.getWidget("Button_14");
        this.Button_zm = this.getWidget("Button_15");
        this.Button_toResultView = this.getWidget("btnToResultView");


        //UITools.addClickEvent(this.Button_js,this,this.onJieSuan);
        UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
        UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
        this.onJieSuan();
		var btn_jiesan = this.getWidget("btn_jiesan");
		var btn_share = this.getWidget("btn_share");
		btn_share.visible = false;
		UITools.addClickEvent(btn_share,this,this.onShare);
		UITools.addClickEvent(btn_jiesan,this,this.onBreak);


		var btn_handXq = this.getWidget("btn_handXq");
		UITools.addClickEvent(btn_handXq,this,this.onHandCard);

		if(PHZRoomModel.isMoneyRoom()){
			btn_jiesan.setVisible(false);
			btn_handXq.setVisible(false);
			this.Button_zm.loadTextureNormal("res/ui/bjdmj/btn_return_hall.png");
			this.Button_2.loadTextureNormal("res/ui/bjdmj/btn_start_another.png");
			this.Button_Ready.loadTextureNormal("res/ui/bjdmj/btn_start_another.png");
			this.Button_2.setScale(0.9);
			this.Button_zm.setScale(0.9);
		}


		var Image_40 = this.getWidget("Image_40"); //自摸图片
		Image_40.visible = false;

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
        var jushuStr = "第" + PHZRoomModel.nowBurCount + "局";

        this.getWidget("Label_jushu").setString(jushuStr);
        //玩法显示
        var wanfaStr = "";
        this.getWidget("Label_wanfa").setString(wanfaStr);
		if(this.isRePlay){
			var str = "第" + PHZRePlayModel.playCount + "局"
			this.getWidget("Label_jushu").setString(str);
		}

        if (this.isRePlay){
            this.getWidget("replay_tip").visible =  true;
        }

		if(PHZRoomModel.isMoneyRoom()){
			this.getWidget("Label_roomnum").setString("序号:"+ClosingInfoModel.ext[0]);
			this.getWidget("Label_jushu").setString("底分:" + PHZRoomModel.goldMsg[2]);
		}
	},

    refreshSingle:function(widget,user,pointInfo , index){
		// cc.log("index..." , index);
		//user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
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

		var pointStr = "";
		var totalPointStr = "";
		if (parseInt(user.point) > 0 ){
			pointStr = "+" + user.point;
		}else{
			pointStr = "" + user.point;
		}
		var label = new cc.LabelTTF(pointStr, "res/font/bjdmj/fznt.ttf", 30);
		label.setColor(cc.color(128,21,6));
		//var label = new cc.LabelBMFont(user.point+"",fnt);
		label.anchorX = 0;
		label.x = 0;
		label.y = 18;
		point.addChild(label,6);

		//cc.log("pointStr==="+pointStr);

		if (user.totalPoint != null ){
            totalPointStr = "" + user.totalPoint;
			var str = "";
			str = "累计:" + totalPointStr;
			var totalPoint = ccui.helper.seekWidgetByName(widget,"totalPoint");
			var label1 = new cc.LabelTTF(str, "res/font/bjdmj/fznt.ttf", 30);
			label1.setColor(cc.color(128,21,6));
			//var label = new cc.LabelBMFont(user.totalPoint+"","res/font/font_res_phz1.fnt");
			label1.anchorX = 0;
			//label1.anchorY = 0;
			label1.x = 0;
			label1.y = 15;
			totalPoint.addChild(label1,6);

			if(PHZRoomModel.isMatchRoom() || PHZRoomModel.isMoneyRoom()){
				label1.x += 40;
				label1.setString(totalPointStr);
				this.showMoneyIcon(label1);
			}
		}

        //增加房主的显示
		if(user.userId == ClosingInfoModel.ext[1]){
			var fangzhu = new cc.Sprite("res/res_phz/fangzhu.png");
			fangzhu.anchorX = fangzhu.anchorY = 0;
			fangzhu.x = 50;
			fangzhu.y = 50;
			widget.addChild(fangzhu,10);
		}
		if (index == 0){
			var nowPoint = this.getWidget("nowPoint");
			nowPoint.setString("共计:" + user.point);
		}
    },

	showMoneyIcon:function(label){
		var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
		icon.setAnchorPoint(1,0.5);
		icon.setScale(0.5);
		icon.setPosition(label.x,label.y);
		label.getParent().addChild(icon);
	},

	onOk:function(){
		if(PHZRoomModel.isMoneyRoom() && !this.isRePlay){
			this.moneyRoomStartAnother();
			return;
		}

		if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
			PopupManager.remove(this);
			return;
		}
		var data = this.data;
        // var isDjtgEnd = 0;
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
    
    onHandCard:function(){
		//cc.log("onHandCard ClosingInfoModel.huSeat..." , ClosingInfoModel.huSeat);
    	var mc = new PHZHandCardPop(this.data,ClosingInfoModel.ext[1] , this.winUserId);
    	PopupManager.open(mc,true);
    },
    
    onJieSuan:function(){
/*    	this.Button_js.setBright(true);
    	this.Button_zm.setBright(false);
    	this.panel_16.visible = true;
    	this.panel_17.visible = false;*/

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

	//金币场继续游戏
	moneyRoomStartAnother:function(){
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
