
/**
 * var trs = new PopupTest("res/societyFoundAddSeek.json");  
 * PopupManager.open(trs);  
 * PopupTest继承于BasePopup
 */	
var PopupManager = {
	root : null,
	popupList : [],
	isEffect : false,
	/**
	 * 初始化管理（注入弹出层）
	 * @param value    
	 * 
	 */	
	init : function(value){
		this.popupList = [];
		this.root = value;
	},
	/**
	 * 弹出一个显示对象
	 * @param mc   		显示对象
	 * @param state   	显示状态  默认:不删除也不隐藏    true:隐藏上一个显示  false:删除上个显示
	 * 
	 */	
	open : function(mc,state){
		if(mc){
			if(state == false){ // 删除上个显示
				this.removePopup(this.popupList.pop());
			}
			else if(state == true){  // 隐藏上一个显示
				this.hideLastPopup();
			}
			this.addPopup(mc);
		}
	},
	
	tweenOpen : function(mc){
		mc.onOpen();
	},
	
	/**
	 * 添加一个弹框
	 * @param value   		显示对象
	 */	
	addPopup : function(value,zorder){
		var popupItem = value;
		this.checkList(popupItem);
		this.popupList.push(popupItem);
		this.root.addChild(popupItem,zorder || 0);
		this.tweenOpen(popupItem);

		if(popupItem.show_version){
			this.showVersion(popupItem,popupItem.version_pos);
		}
	},

	//一些弹窗界面要显示版本号，在这里统一加
	showVersion:function(layer,pos){
		var pos = pos || cc.p(0,0);
		var label = new UICtor.cLabel(SyVersion.v,30);
		label.setAnchorPoint(0,0);
		label.setPosition(pos);
		layer.addChild(label,10);
	},
	/**
	 * 删除全部弹框
	 * 
	 */	
	removeAll : function(){
		while(this.popupList.length){
			var popupItem = this.popupList.pop();
			this.removePopup(popupItem);
		}
	},
	
	/**
	 * 删除显示对象
	 * @param value    
	 * 
	 */	
	remove : function(popup){
		if(!popup) return;
		this.removePopupByList(popup);
		var len = this.popupList.length - 1;
		if(len >= 0){
			this.popupList[len].visible = true;
		}
	},
	
	/**
	 * 删除当前显示对象
	 * @param value    
	 * 
	 */	
	removeCurrent : function(){
		this.removePopup(this.popupList.pop());
	},
	
	/**
	 * 从列表里删除
	 * @param value    
	 * 
	 */	
	removePopupByList : function(popup){
		var len = this.popupList.length;
		for(var i = 0; i < len; i++){
			var popupItem = this.popupList[i];
			if(popup == popupItem){
				this.popupList.splice(i, 1);
				this.removePopup(popupItem);
				break;
			}
		}
	},
	
	/**
	 * 删除弹框
	 * @param popupItem    
	 * 
	 */	
	removePopup : function(popupItem){
		if(!popupItem) return;
		popupItem.onDealClose();
		popupItem.onClose();
		popupItem.removeFromParent(true);
	},
	
	/**
	 * 两个对象是否相同
	 * 
	 */	
	isAlike : function(mc,mc1){
		if (mc["constructor"] == clubFenChengPop || mc["constructor"] == clubChengYuanPop) {// 返回太难做了 只能叠加弹窗了
			return false;
		}
		return mc["constructor"] == mc1["constructor"];
	},
	
	/**
	 * 根据一个构造类删除一个显示对象
	 * @param value 构造类
	 */	
	removeClassByPopup : function(value){
		var len = this.popupList.length;
		for(var i = 0; i < len; i++){
			if(this.popupList[i]["constructor"] == value){
				this.remove(this.popupList[i]);
				break;
			}
		}
	},
	
	/**
	 * 检查显示对象 如果有相同的就删除
	 * @param popupItem    
	 * 
	 */	
	checkList : function(popupItem){
		var len = this.popupList.length;
		for(var i = 0; i < len; i++){
			if(this.isAlike(popupItem,this.popupList[i])){
				this.removePopup(this.popupList[i]);
				this.popupList.splice(i, 1);
				break;
			}
		}
	},
	
	/**
	 * 是否有该显示对象
	 * @param mc    
	 * 
	 */	
	hasPopup : function(popup){
		return this.popupList.indexOf(popup) != -1;
	},
	
	/**
	 * 根据一个构造类获取该构造类的显示
	 * @param value 构造类
	 */	
	getClassByPopup : function(value){
		var len = this.popupList.length;
		for(var i = 0; i < len; i++){
			if(this.popupList[i]["constructor"] == value){
				return this.popupList[i];
			}
		}
		return null;
	},
	
	
	/**
	 * 根据一个构造类判断有该构造类的显示
	 * @param value 构造类
	 */	
	hasClassByPopup : function(value){
		var len = this.popupList.length;
		for(var i = 0; i < len; i++){
			if(this.popupList[i]["constructor"] == value){
				return true;
			}
		}
		return false;
	},
	
	/**
	 * 隐藏最后一个显示对象  
	 * 
	 */	
	hideLastPopup : function(){
		var len = this.popupList.length - 1;
		if(len >= 0){
			this.popupList[len].visible = false;
		}
	},

	/**
	 * 隐藏某个Pop
	 *
	 */
	hidePopup : function(value){
		var len = this.popupList.length;
		for(var i = 0; i < len; i++){
			if(this.popupList[i]["constructor"] == value){
				this.popupList[i].visible = false;
			}
		}
	},

	/**
	 * 隐藏某个Pop
	 *
	 */
	showPopup : function(value){
		var len = this.popupList.length;
		for(var i = 0; i < len; i++){
			if(this.popupList[i]["constructor"] == value){
				this.popupList[i].visible = true;
			}
		}
	},


	/**
	 * 返回最后一个显示对象
	 */
	getCurPopupName:function(){
		var len = this.popupList.length - 1;
		if(len >= 0){
			if(this.popupList[len].visible = true){
				return this.popupList[len]["constructor"];
			}

		}
	},
}