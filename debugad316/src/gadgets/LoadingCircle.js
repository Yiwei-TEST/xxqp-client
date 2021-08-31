var LoadingCircle = BasePopup.extend({

	ctor:function(loadingStr){
		this._str = loadingStr;
		this._super("res/loadingCircle.json");
	},

	selfRender:function(){
		this.label = this.getWidget("Label_35");
		//this.lmc = this.getWidget("Image_7");
		this.show(this._str);
	},

	show:function(str){
		this._str = str;
		this.label.setString(str);
		if(!this._runAnimat){
			ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/loading/loading.ExportJson");
			this.ani = new ccs.Armature("loading");
			this.ani.setPosition(this.root.width/2 ,this.root.height/2+40);
			this.ani.getAnimation().play("Animation1",-1,1);
			this.root.addChild(this.ani);
			this._runAnimat = true;
		}
		this.visible = true;

		//需求要求在登录时两秒内登录进去的不显示转圈
		if(this._str == "正在登录"){
			this.root.setVisible(false);
			var self = this;
			this.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
				self.root.setVisible(true);
			})));
		}
	},

	hide:function(){
		if(this._runAnimat){
			this.ani.removeFromParent(true)
			ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/loading/loading.ExportJson");
			this._runAnimat = false;
		}
		this.visible = false;
		this.root.setVisible(true);
		this.stopAllActions();
	},

	onExit:function(){
		//this.lmc.stopAllActions();
		ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/loading/loading.ExportJson");
		this._super();
	}
});