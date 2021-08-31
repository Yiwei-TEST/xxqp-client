var HongBaoModel = {
	allMsg:[],
	init:function(obj){
		this.allMsg.push(obj);
	},
	
	getOneMsg:function(){
		if(this.allMsg.length>0)
			return this.allMsg.shift();
		return null;
	}
}
var HongBaoPop = BasePopup.extend({
	type:null,
	data:null,
	ctor:function(type,data){
		this.type = type;
		this.data = data;
		this._super("res/hongBao.json");
	},
	
	selfRender:function(){
		this.hongBaoType = this.getWidget("Image_hongbaoType");
		this.btn = this.getWidget("Button_36");
		UITools.addClickEvent(this.btn,this,this.onOpenHongBao);
		if(this.type==3){
			this.hongBaoType.loadTexture("res/ui/images/img_87.png");
			this.btn.loadTextureNormal("res/ui/images/img_90.png");
		}else{
			this.hongBaoType.loadTexture("res/ui/images/img_88.png");
			this.btn.loadTextureNormal("res/ui/images/img_89.png");
		}
		this.hongbaoArmature = null;
		if(this.type==4){
			ccs.armatureDataManager.addArmatureFileInfo(
					"res/plist/hongbao_ok0.png",
					"res/plist/hongbao_ok0.plist",
			"res/plist/hongbao_ok.ExportJson");
			this.hongbaoArmature = new ccs.Armature("hongbao_ok");
			this.hongbaoArmature.x = 640;
			this.hongbaoArmature.y = 360;
			this.root.addChild(this.hongbaoArmature,1);
			this.hongbaoArmature.getAnimation().setSpeedScale(0.5);
			this.hongbaoArmature.getAnimation().play("hongbao",-1,1);
		}
	},
	
	onOpenHongBao:function(){
		if(this.hongbaoArmature)
			this.hongbaoArmature.getAnimation().stop();
		var money = 0;
		var maxMoney = 0;
		var win = 0;
		var obj = {};
		for(var i=0;i<this.data.length;i++){
			if(maxMoney<this.data[i].money){
				win = i;
				maxMoney = this.data[i].money;
			}
			if(this.data[i].userId == PlayerModel.userId){
				money = this.data[i].money;
			}
		}
		PopupManager.remove(this);
		obj.type = this.type;
		obj.money = money;
		obj.win = win;
		var mc = new HongBaoInfo(this.data,obj);
		PopupManager.addPopup(mc);
	}
});
var HongBaoInfo = BasePopup.extend({
	data:null,
	obj:null,
	ctor:function(data,obj){
		this.data = data;
		this.obj = obj;
		this._super("res/hongBaoInfo.json");
	},
	
	selfRender:function(){
		this.img = this.getWidget("Image_60");
		this.lab = this.getWidget("Label_10");
		this.shareBtn = this.getWidget("Button_36");
		this.list = this.getWidget("ListView_13");
		UITools.addClickEvent(this.shareBtn,this,this.onShare);
		this.getWidget("Label_10").setString(this.obj.money+"元");
		this.showHongBaoList();
	},
	
	showHongBaoList:function(){
		this.img.loadTexture((this.obj.type==4) ? "res/ui/images/img_88.png" : "res/ui/images/img_87.png");
		for(var i=0;i<this.data.length;i++){
			var isMaxMoney = false;
			var item = new HongBaoList();
			if(this.obj.win==i){
				isMaxMoney = true;
			}
			item.setData(this.data[i],isMaxMoney,this.obj.money,this.obj.type);
			this.list.pushBackCustomItem(item);
		}
	},
	
	onShare:function(){
		var obj={};
		var tableId = 0;
		obj.tableId=tableId;
		obj.userId=PlayerModel.userId;
		obj.userName=PlayerModel.username;
		obj.callURL=SdkUtil.SHARE_URL+'?userId='+PlayerModel.userId;
		obj.title= '迅游棋牌-好友专属棋牌';
		if(this.obj.type==3){
			obj.description="恭喜"+PlayerModel.name+"在【迅游棋牌】中被现金红包砸中，还不快来围观，下一个被现金红包砸中的可能就是你！";
		}else{
			obj.description="恭喜"+PlayerModel.name+"在【迅游棋牌】中获得"+this.obj.money+"元幸运红包，还没抢到的速来，人人有份、永不落空！";
		}
		obj.shareType=1;
		SharePop.show(obj);
	}
});
var HongBaoList = ccui.Widget.extend({
	ctor:function(){
		this._super()
		this.setContentSize(425,50);
		var Panel_14=this.Panel_14= UICtor.cPanel(cc.size(425,50),cc.color(150,200,255),0);
		Panel_14.setAnchorPoint(cc.p(0,0));
		Panel_14.setPosition(0,0);
		var Image_1=this.Image_1= UICtor.cImg("res/ui/images/img_85.png");
		Image_1.setPosition(120,25);
		Panel_14.addChild(Image_1);
		var Label_name=this.Label_name= UICtor.cLabel("周星星",20,cc.size(200,0),cc.color(255,216,59),0,0);
		Label_name.setPosition(23,11);
		Label_name.anchorX = Label_name.anchorY = 0;
		Panel_14.addChild(Label_name);
		var Label_time=this.Label_time= UICtor.cLabel("17:30",20,cc.size(0,0),cc.color(255,216,59),0,0);
		Label_time.setPosition(212,25);
		Panel_14.addChild(Label_time);
		var Label_money=this.Label_money= UICtor.cLabel("6.6元",20,cc.size(0,0),cc.color(255,216,59),0,0);
		Label_money.setPosition(358,25);
		Panel_14.addChild(Label_money);
		this.addChild(Panel_14);
	},
	
	setData:function(data,isMaxMoney,money,type){
		this.Label_name.setString(data.userName);
		this.Label_time.setString("");
		this.Label_money.setString(data.money+"元");
		this.Image_1.visible = (isMaxMoney && type==3) ? true : false;
	}
});