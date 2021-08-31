/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {cc.Class}
 */
var PDKReplayPlayer = cc.Class.extend({
	/** @lends CardPlayer.prototype */
	_cards:null,

	/**
	 * {RoomPlayerVo}
	 */

	_playerVo:null,
	_isBt:false,
	_iconUrl:"",
	/**
	 *
	 * @param name {RoomPlayerVo}
	 * @param root {Object}
	 */
	ctor:function(vo,root,seq){
		this._isBt = false;
		this._iconUrl = "";
		this._playerVo = vo;
		this.seq = seq;
		this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq);
		this.iconbg.temp = vo.seat;
		this.iconbg.visible = true;
		this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
		this.tuoguanSpr = ccui.helper.seekWidgetByName(root,"tuoguan"+seq);
		this.tuoguanSpr.setVisible(false);
		this.name.setString(vo.name);
		this.statusImg = ccui.helper.seekWidgetByName(root,"ybq"+seq);
		this.statusTexture = "";
		this.bt = ccui.helper.seekWidgetByName(root,"bt"+seq);
		if(this.bt){
			var animate = this.bt.getChildByTag(123);
			if(!animate){
				animate = new AnimateSprite("res/plist/baodan.plist","baodan",1/10);
				animate.anchorX=animate.anchorY=0;
				animate.x=animate.y=0;
				animate.scale = 1.5;
				this.bt.addChild(animate,1,123);
			}else{
				animate.stop();
			}
		}
		this._cards = [];
		this.showIcon();
        this.piaofen_img = this.iconbg.getChildByName("piaofen_img");
        if (!this.piaofen_img){
            this.piaofen_img = new cc.Sprite("res/ui/common/biao_piao0.png");
            this.iconbg.addChild(this.piaofen_img,10,99999);
            this.piaofen_img.setName("piaofen_img");
            this.piaofen_img.x = 75;
            this.piaofen_img.y = 15;
        }

        this.daniao_img = this.iconbg.getChildByName("daniao_img");
        if (!this.daniao_img){
            this.daniao_img = new cc.Sprite("res/ui/common/niao.png");
            this.iconbg.addChild(this.daniao_img,10,99999);
            this.daniao_img.setName("daniao_img");
            this.daniao_img.x = this.iconbg.width - 10;
            this.daniao_img.y = 10;
        } 
        this.hidePiaoFenImg();
        this.hideDaNiaoImg();

        var creditLabel = ccui.helper.seekWidgetByName(this.iconbg,"credit");
        if(cc.isNumber(vo.credit)){
        	creditLabel.setString("赛:" + MathUtil.toDecimal(vo.credit/100));
		}else{
        	creditLabel.setString("");
		}

	},

	updateTuoguan:function(state){ 
		this.tuoguanSpr.setVisible(state);
	},

	showPiaoFenImg:function(type){
		var pngUrl ="res/ui/pdk/pdkRoom/biao_piao"+type+".png";
        this.piaofen_img.setTexture(pngUrl);
        this.piaofen_img.visible =true;
	},


	hidePiaoFenImg:function(){
		this.piaofen_img.visible = false;
	},

	showDaNiaoImg:function(type){
        this.daniao_img.visible = type;
	},

	
	hideDaNiaoImg:function(){
		this.daniao_img.visible = false;
	},

	showInfo:function(){
		var mc = new PlayerInfoPop(this._playerVo);
		PopupManager.addPopup(mc);
	},

	/**
	 * @returns {RoomPlayerVo}
	 */
	getPlayerVo:function(){
		return this._playerVo;
	},

	showIcon:function(){
		//this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
		var url = this._playerVo.icon;
		var defaultimg = (this._playerVo.sex==1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";
		if(!url)
			url = defaultimg;
		if(this._iconUrl == url)
			return;
		if(this.iconbg.getChildByTag(345))
			this.iconbg.removeChildByTag(345);
		this._iconUrl = url;
		var sprite = new cc.Sprite(defaultimg);
		//this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
		if(this._playerVo.icon){
			sprite.x = sprite.y = 0;
			var sten = new cc.Sprite("res/ui/common/img_14_c.png");
			var clipnode = new cc.ClippingNode();
			clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 66, y: 66, alphaThreshold: 0.85});
			clipnode.addChild(sprite);
			this.iconbg.addChild(clipnode,5,345);
			var self = this;
			cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
				if (!error) {
					sprite.setTexture(img);
					sprite.x = 0;
					sprite.y = 0;
				}else{
					self._iconUrl = "";
				}
			});
		}else{
			sprite.x = sprite.y = 66;
			this.iconbg.addChild(sprite,5,345);
		}
	},

	getPath:function(sex,audioName){
		var path = (sex==1) ? "man/" : "woman/";
		return "res/audio/"+path+audioName;
	},

	/**
	 * 显示player的状态 准备、要不起
	 */
	showStatus:function(status){
		this.statusImg.visible = true;
		var tMap ={"-1":"res/ui/images/img_35.png","1":"res/ui/images/img_34.png"};
		var texture = tMap[status];
		var old = this.statusTexture;
		if(status==-1)
			cc.log(this._playerVo.sex);
		AudioManager.play(this.getPath(this._playerVo.sex,"buyao.wav"));
		if(old && old == texture)
			return;
		this.statusTexture = texture;
		this.statusImg.loadTexture(texture);
	},

	/**
	 * 报停
	 */
	baoting:function(){
		if(this._isBt)
			return;
		if(this.seq != 1){
			var animate = this.bt.getChildByTag(123);
			animate.stop();
			animate.play();
			this.bt.visible = true;
		}
		this._isBt = true;
		PlayBackModel.baoting(this._playerVo.seat);
		var self = this;
		setTimeout(function(){AudioManager.play(self.getPath(self._playerVo.sex,"baojing.wav"));},1000);
	},

	/**
	 * 拥有的牌
	 * @returns {null}
	 */
	getCards:function(){
		return this._cards;
	},

	deal:function(cards){
		this._cards = cards;
		this.sort();
	},

	sort:function(){
		//var length = this._cards.length;
		var s1 = function(c1,c2){
			var n1 = c1.i;
			var n2 = c2.i;
			if(n1 == n2){
				var t1 = c1.t;
				var t2 = c2.t;
				return t2-t1;
			}else{
				return n2-n1;
			}
		}
		this._cards.sort(s1);
	}

});