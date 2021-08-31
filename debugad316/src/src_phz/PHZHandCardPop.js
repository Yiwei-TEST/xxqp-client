/**
 * Created by hjc on 2017/4/1.
 */
var PHZHandCardPop=BasePopup.extend({
    ctor:function (data,userId,winUserId) {
        this.data = data;
        this.userId = userId;
		this.winUserId = winUserId;
		cc.log("this.data , this.userId..." , this.data , this.userId , this.winUserId);
		cc.log("this.huSeat!!!" , this.winUserId);
        this._super("res/phzHandCard.json");
    },

    selfRender:function () {
    	this.fzSezt = 0;
    	for(var i=0;i<this.data.length;i++){
    		if(this.data[i].userId == PlayerModel.userId){
    			var temp = this.data[0];
    			this.data[0] = this.data[i];
    			this.data[i] = temp;
    		}
    	}

		cc.log("PHZHandCardPop :: this.data.length..." , this.data.length);
		var playerIndex = 0;
/*		this.getWidget("Image_26").visible = !this.isHuang;*/


    	for(var i = 0 ; i < 4 ; i ++){
    		var item = this.getWidget("Image_"+(i+1));
    		if(i<this.data.length){
    			if(this.data[i].userId == PlayerModel.userId){
    				//item.loadTexture("res/res_phz/img_46.png");
    			}
				if(i == 0 && this.isHuang == false){
					item.loadTexture("res/res_phz/phzHandCard/winBg.png");
				}

				if(this.data[i].firstCards.length > 0){
					var handCardItem = this.getWidget("Image_" + (playerIndex + 1));
					this.refreshSingle(handCardItem,this.data[i],playerIndex);
					playerIndex ++
				}else{
					var shuxingItem = this.getWidget("Image_4");
					this.refreshSingle(shuxingItem,this.data[i],4);
				}

    		}else{
    			item.visible = false;
				this.getWidget("Image_shuxing").visible = false;
    		}	
    	}
    },
    
    refreshSingle:function(widget,user,index){
    	//var defaultimg = (user.sex==1) ? "res/ui/images/default_m.png" : "res/ui/images/default_w.png";
        // user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        
		var defaultimg = "res/res_phz/default_m.png";
    	var sprite = new cc.Sprite(defaultimg);
    	sprite.scale=0.8;
    	sprite.x = 42;
    	sprite.y = 42;
    	ccui.helper.seekWidgetByName(widget,"user").addChild(sprite,5,345);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

		if(this.winUserId == user.userId ){
			cc.log("当前玩家是胜利玩家 显示胜利图标...");
			var winIcon = this.getWidget("win" + (index+1));
			if(winIcon){
				winIcon.visible = true;
			}else{
				cc.log("未获取到胜利标志..." , index);
			}
		}

    	if(this.userId==user.userId){
    		var fz = new cc.Sprite("res/res_phz/fangzhu.png");
    		fz.x = 100;
    		fz.y = 100;
    		sprite.addChild(fz);
    	}
    	ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
		ccui.helper.seekWidgetByName(widget , "uid").setString("UID:" + user.userId);
    	var list = ccui.helper.seekWidgetByName(widget,"ListView");
    	var voArray = [];
    	if(user.firstCards){
    		for(var i=0;i<user.firstCards.length;i++){
    			voArray.push(PHZAI.getPHZDef(user.firstCards[i]));
    		}
    		var vo = PHZAI.sortHandsVo(voArray);
			cc.log("vo.length.." , vo.length);
			if(vo.length == 0){

			}
    		for(var i=0;i<vo.length;i++){
    			var cell = new onCell(vo[i]);
    			list.pushBackCustomItem(cell);
    		}
    	}
    }
});

var onCell = ccui.Widget.extend({
	ctor:function(data,isSmallResult){
		this._super();
		this.anchorX=0;
		this.anchorY=0;
		this.scale = 0.8;
		this.setContentSize(50,260);
		var tempY = 50;
		if(PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()){
			tempY = 14;
            if (isSmallResult){
                this.scale = 1.4;
            }
		}
		for(var i=0;i<data.length;i++){
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),data[i]);
			card.x = 40;
			card.y = tempY+ i*48*1.4;
			this.addChild(card,data.length-i);
		}
	}
});