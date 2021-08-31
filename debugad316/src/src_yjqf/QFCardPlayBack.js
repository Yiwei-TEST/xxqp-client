/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {cc.Class}
 */
var QFCardPlayBack = cc.Class.extend({
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
		this._nJifen = 0;
		this._nXifen = 0;
		this._playerVo = vo;
		this.seq = seq;
		this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq);
		this.iconbg.temp = vo.seat;
		this.iconbg.visible = true;
		this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
		this.name.setString(vo.name);
		this.statusImg = ccui.helper.seekWidgetByName(root,"ybq"+seq);
		this.zhunbei = ccui.helper.seekWidgetByName(root,"zhunbei"+seq);
		this.zhunbei.visible = false;
		ccui.helper.seekWidgetByName(root,"CreaterSignImg"+seq).setVisible(vo.seat == 1);
		ccui.helper.seekWidgetByName(root,"ipSame"+seq).visible = false;
		ccui.helper.seekWidgetByName(root,"jiahaoImg"+seq).visible = false;
		ccui.helper.seekWidgetByName(root,"zl"+seq).visible = false;
		this.zongjifen = ccui.helper.seekWidgetByName(root,"Label_zongjifen" + seq);
		this.jifen = ccui.helper.seekWidgetByName(root,"Label_jifen" + seq);
		this.xifen = ccui.helper.seekWidgetByName(root,"Label_xifen" + seq);
		this.zongxifen = ccui.helper.seekWidgetByName(root,"Label_zongxifen" + seq);

		this._cards = [];
		this.showIcon();
		this.refreshAllScore();
	},

	refreshAllScore:function(){
		this.jifen.setString(this._nJifen);
		this.xifen.setString(this._nXifen);
		this.zongjifen.setString(this._playerVo.totalPoint || 0);
		this.zongxifen.setString(this._playerVo.ext[3]);
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
		var defaultimg = (this._playerVo.sex==1) ? "res/res_yjqf/images/default_m.png" : "res/res_yjqf/images/default_w.png";
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
			var sten = new cc.Sprite("res/res_yjqf/images/img_14_c.png");
			var clipnode = new cc.ClippingNode();
			clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 77, y: 120, alphaThreshold: 0.8});
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
			sprite.x = sprite.y = 44;
			sprite.x = 77;
			sprite.y = 120;
			this.iconbg.addChild(sprite,5,345);
		}
	},

	showMingci:function(){
		var seq = this._playerVo.ext[2];
		if (seq  > 0)
			ccui.helper.seekWidgetByName(this.iconbg,"mingciSp" + seq).visible = true;
	},

	getPath:function(sex,audioName){
		var path = (sex==1) ? "man/" : "woman/";
		return "res/audio/"+path+audioName;
	},

	/**
	 * 显示player的状态 准备、要不起
	 */
	showStatus:function(status){
		if(status == -1){
			this.statusImg.visible = true;
			this.zhunbei.visible = false;
			AudioManager.play(this.getPath(this._playerVo.sex,"buyao.wav"));
		}else if(status == 1){
			this.statusImg.visible = false;
			this.zhunbei.visible = true;
		}
	},

	getPalyerWidget: function(widgetName){
		return ccui.helper.seekWidgetByName(this.iconbg, widgetName);
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
				return t1-t2;
			}else{
				return n1-n2;
			}
		};
		this._cards.sort(s1);
	}

});