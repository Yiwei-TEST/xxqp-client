/**
 * Created by leiwenwen on 2019/3/16.
 */
var PyqMutexPop = BasePopup.extend({
    ctor:function(){
        this.mutexData = null;
        this.poolId = null;
        this._super("res/mutexPop.json");
    },

    selfRender:function(){
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(200);
        this.addChild(gray,-1);

        var addBtn= this.getWidget("Button_add");
        addBtn.temp = 1;
        var reduceBtn = this.getWidget("Button_reduce");
        var findBtn = this.getWidget("Button_find");


        this.ScrollView_m = this.getWidget("ScrollView_m");
        this.ScrollView_m.setBounceEnabled(true);
        this.scrollItem = ccui.helper.seekWidgetByName(this.ScrollView_m,"Image_mutex");
        this.scrollItem.retain();
        this.scrollItem.setVisible(false);


        var inputBg = this.getWidget("Image_input");
        this.inputBox = new cc.EditBox(cc.size(inputBg.width - 165, inputBg.height - 15),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = inputBg.width/2 - 75;
        this.inputBox.y = inputBg.height/2;
        this.inputBox.setPlaceholderFont("",40);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox.setPlaceHolder("输入ID查找");
        inputBg.addChild(this.inputBox,1);
        this.inputBox.setFont("",40);

        UITools.addClickEvent(findBtn,this,this.onFind);
        UITools.addClickEvent(addBtn,this,this.onClick);
        UITools.addClickEvent(reduceBtn,this,this.onReduce);

        this.getMutexData(1);

        this.addCustomEvent("MUTEX_UPDATa", this, this.getMutexData);
    },

    getMutexData:function(_optType,_userId){
        var _optType = _optType || 1;
        var _userId = _userId || null;
        var params = {
            groupId:ClickClubModel.getCurClubId(),
            pageNo:1,
            pageSize:30,
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            optType :_optType//1、互斥池列表，2、单个互斥池成员列表
        }
        var userId = this.inputBox.getString();
        if (userId && userId != ""){
            params.queryUserId = userId;
        }
        var self = this;
        NetworkJT.loginReq("groupActionNew", "loadGroupRejectPool",params , function (data) {
            if (data) {
                cc.log("getMutexData==",JSON.stringify(data));
                if(data.message.dataList && data.message.dataList.length > 0){
                    self.showScrollItem(data.message.dataList);
                }else{
                    if(params.queryUserId){
                        FloatLabelUtil.comText("未找到该ID的互斥池");
                    }else{
                        self.showScrollItem([]);
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    updateMutexData:function(_optType){
        var _optType = _optType || 1;
        var params = {
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            optType :_optType //1：新建互斥池，2：删除互斥池，3：增加成员，4：删除成员
        }
        if (_optType == 1){
            params.name = "";
        }else if (_optType == 2){
            params.poolId = this.poolId;
        }
        var self = this;
        NetworkJT.loginReq("groupActionNew", "updateGroupRejectPool",params , function (data) {
            if (data) {
                cc.log("updateGroupRejectPool==",JSON.stringify(data));
                if(data.message){
                    if (_optType == 1 || _optType == 2){
                        self.getMutexData();
                        FloatLabelUtil.comText(data.message);
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    showScrollItem:function(data){
        this.ScrollView_m.removeAllChildren();
        var itemNum = data.length;
        var spaceW = 279;
        var contentW = Math.max(this.ScrollView_m.width,itemNum*(spaceW + 30) + 10);
        this.ScrollView_m.setInnerContainerSize(cc.size(contentW,this.ScrollView_m.height));

        this.mutexData = [];
        for(var i = 0;i < data.length;++i) {
            var newItem = this.scrollItem.clone();
            newItem.data = data[i];
            this.mutexData.push(newItem);
            newItem.x =  i*( spaceW + 30)  + spaceW/2 + 10;
            this.setItemInfo(newItem,i);
            this.ScrollView_m.addChild(newItem);
            newItem.setVisible(true);
        }
    },

    setItemInfo:function(item,i){
        item.getChildByName("Label_mutex").setString(i+1);
        item.getChildByName("Label_mutex1").setString(item.data.name || "");
        item.getChildByName("Label_num").setString(item.data.count || 0 + "人");
        var removeBtn = item.getChildByName("Button_remove");
        UITools.addClickEvent(item,this,this.onDown);
        removeBtn.visible = false;
        removeBtn.temp = 2;
        removeBtn.itemData = item.data;
        UITools.addClickEvent(removeBtn,this,this.onClick);
    },


    onReduce:function(){
        for(var i = 0;i<this.mutexData.length;++i) {
            var mutexItem = this.mutexData[i];
            var removeBtn = mutexItem.getChildByName("Button_remove");
            if (removeBtn.isVisible()){
                removeBtn.visible = false;
            }else{
                removeBtn.visible = true;
            }
        }
    },

    onDown:function(obj){
        this.inputBox.setString("");
        var mc = new PyqMutexDownPop(this,obj.data);
        PopupManager.addPopup(mc);
    },

    onClick:function(obj){
        var optType = obj.temp;
        if (optType == 2){
            this.poolId = obj.itemData.keyId || 0;
        }
        this.updateMutexData(optType)
    },

    onFind:function(){
        this.getMutexData(1);
    },

});