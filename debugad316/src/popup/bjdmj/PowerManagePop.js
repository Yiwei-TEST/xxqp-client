var PowerManageList = ccui.Widget.extend({
    ctor: function () {
        this._super();
        this.root = ccs.uiReader.widgetFromJsonFile("res/powerManageList.json");
        // this.root.setPositionX(10);
        this.addChild(this.root);
        this.setContentSize(this.root.getContentSize().width, this.root.getContentSize().height + 10);

        var btn_delete = ccui.helper.seekWidgetByName(this.root, "Button_delete");
        UITools.addClickEvent(btn_delete, this, this.onDelete);
    },
    onDelete:function(){
        /*  0号位 ：1请求权限列表，2添加，3删除
            1号位： 权限ID（1：钻石，2：业务员，3：亲友圈）
            2号位： 角色ID或亲友圈ID
            3号位: 查询的页数
        */
        sySocket.sendComReqMsg(4520, [3, this.dataType, this.id]);
    },
    setItemWithData:function(data){
        this.dataType = parseInt(data.type);
        this.id = parseInt(data.id);

        ccui.helper.seekWidgetByName(this.root,"name").setString(data.name);;
        ccui.helper.seekWidgetByName(this.root,"ID").setString(data.id);

        var dayString = "未知";
        var timeString = "未知";
        if(data.date){
            var y = data.date.getFullYear();
            var m = data.date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = data.date.getDate();
            d = d < 10 ? ('0' + d) : d;
            dayString = y + '-' + m + '-' + d;

            var hours = data.date.getHours().toString();
            hours = hours.length < 2 ? "0" + hours : hours;
            var minutes = data.date.getMinutes().toString();
            minutes = minutes.length < 2 ? "0" + minutes : minutes;
            timeString = hours + ":" + minutes;
        }
        
        ccui.helper.seekWidgetByName(this.root,"day").setString(dayString);
        ccui.helper.seekWidgetByName(this.root, "time").setString(timeString);
    },
})
var PowerManagePop = BasePopup.extend({
    ctor:function(){
        this.itemData = [];
        this.curPage = 1;
        this._super("res/powerManagePop.json");
    },

    selfRender:function(){
        this.btnList = [];//需要显示的页签列表
        this.dataType = 1;
        this.ListView_manage = this.getWidget("ListView_manage");
        for (var i = 0; i < 3; i++) {
            var index = i + 1;
            var btn_manage = this.getWidget("btn_manage_" + index);
            btn_manage.temp = index;
            this.btnList.push(btn_manage);
            UITools.addClickEvent(btn_manage, this, this.onBtnListClick);
        } 

        this.localBtn = null;

        this.btn_add = this.getWidget("Button_add");
        UITools.addClickEvent(this.btn_add,this,this.onAdd);

        this.btn_find = this.getWidget("Button_find");
        UITools.addClickEvent(this.btn_find, this, this.onFind);

        this.btn_pageRight = this.getWidget("btnDataRight");
        this.btn_pageRight.temp = 1;
        UITools.addClickEvent(this.btn_pageRight, this, this.onFlipPage);

        this.btn_pageLeft = this.getWidget("btnDataLeft");
        this.btn_pageLeft.temp = -1;
        UITools.addClickEvent(this.btn_pageLeft, this, this.onFlipPage);

        this.lbDataPage = this.getWidget("lbDataPage");
        
        var Image_13 = this.getWidget("Image_13");
        this.inputNum = new cc.EditBox(cc.size(Image_13.width - 20, Image_13.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputNum.setPosition(Image_13.width / 2, Image_13.height / 2);
        this.inputNum.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputNum.setMaxLength(7);
        this.inputNum.setFont("Arial", 45);
        this.inputNum.setDelegate(this);
        this.inputNum.setPlaceHolder("输入玩家ID");
        this.inputNum.setPlaceholderFont("Arial", 45);
        Image_13.addChild(this.inputNum, 1);

        this.ListView_mumber = this.getWidget("ListView_mumber");
        
        SyEventManager.addEventListener(SyEvent.REFRESH_USERDATA_POWERMANAGE, this, this.refreshData);
        SyEventManager.addEventListener(SyEvent.DELETE_USERDATA_POWERMANAGE, this, this.deleteData);
        SyEventManager.addEventListener(SyEvent.ADD_USERDATA_POWERMANAGE, this, this.addData);

        this.onBtnListClick(this.getWidget("btn_manage_1"));
    },
    addData: function (message) {
        var data = message.getUserData();
        var dataType = data.params[0];
        var mainData = data.strParams;
        for (var i = 0; i < mainData.length; i++) {
            var userData = mainData[i].split("|+|");
            var tempArr = {};
            tempArr.id = userData[0];
            tempArr.name = userData[1];
            if(userData[2]){
                var date = new Date(parseInt(userData[2]));
                tempArr.date = date;
            }else{
                tempArr.date = null;
            }
            
            tempArr.type = dataType;
            this.itemData.unshift(tempArr);
        }
        this.showItem();
    },
    deleteData:function(message){
        var data = message.getUserData();
        for (var i = 0; i < this.itemData.length; i++) {
            if (data.strParams[0] == this.itemData[i].id){
                this.itemData.splice(i,1);
                break;
            }
        }
        this.showItem();
    },
    refreshData:function (message) {
        this.itemData = [];
        var data = message.getUserData();
        var dataType = data.params[0];
        if (dataType){
            this.dataType = dataType;
        }
        var page = data.params[1];
        if(page){
            this.curPage = page;
            this.lbDataPage.setString(this.curPage);
        }
        var mainData = data.strParams;
        for (var i = 0; i < mainData.length;i++){
            var userData = mainData[i].split("|+|");
            var tempArr = {};
            tempArr.id = userData[0];
            tempArr.name = userData[1];
            if (userData[2] != "null") {
                var date = new Date(parseInt(userData[2]));
                tempArr.date = date;
            } else {
                tempArr.date = null;
            }
            tempArr.type = dataType;
            this.itemData.push(tempArr);
        }
        this.showItem();
    },
    showItem:function(){
        this.ListView_mumber.removeAllChildren();
        if(this.itemData.length == 0){
            this.getWidget("labelNoData").visible = true;
        }else{
            this.getWidget("labelNoData").visible = false;
        }
        for (var i = 0;i<this.itemData.length;i++){
            var item = new PowerManageList();
            item.setItemWithData(this.itemData[i]);
            this.ListView_mumber.pushBackCustomItem(item);
        }
    },
    onBtnListClick:function(obj){
        if(obj == this.localBtn){
            return;
        }
        this.localBtn = obj;
        var temp = obj.temp;
        this.dataType = temp;
        this.ListView_mumber.removeAllChildren();
        this.itemData = [];
        this.setBtnState(temp);
        /*  0号位 ：1请求权限列表，2添加，3删除
            1号位： 权限ID（1：钻石，2：业务员，3：亲友圈）
            2号位： 角色ID或亲友圈ID 
            3号位: 查询的页数 
        */
        sySocket.sendComReqMsg(4520,[1,temp,0,1]);
    },
    setBtnState: function (temp) {
        //cc.log("temp:;;"+temp)
        if(temp == 3){
            this.inputNum.setPlaceHolder("输入亲友圈ID");
            this.getWidget("Label_xhtj_1").setString("亲友圈信息");
        }else{
            this.inputNum.setPlaceHolder("输入玩家ID");
            this.getWidget("Label_xhtj_1").setString("玩家信息");
        }
        var items = this.ListView_manage.getItems();
        for (var i = 0; i < items.length; i++) {
            var j = items[i].temp;
            if (temp == j) {
                items[i].setBright(true);
                items[i].getChildByName("txt").setColor(cc.color("#b53802"));
            } else {
                items[i].setBright(false);
                items[i].getChildByName("txt").setColor(cc.color("#885f31"));
            }
        }
    },

    onAdd:function(){
        // cc.log("this.dataType ==", this.dataType);
        var pop = new PowerManageAddPop(this.dataType);
        PopupManager.addPopup(pop);
    },

    onFind: function () {
        var Id = this.inputNum.getString();
        if (!Id) {
            FloatLabelUtil.comText("请输入玩家ID");
            return;
        }
        sySocket.sendComReqMsg(4520, [1, this.dataType, parseInt(Id)]);
    },

    onFlipPage:function(obj){
        var temp = obj.temp;
        cc.log("temp =", temp);
        var page = this.curPage + temp;
        if(page == 0){
            return;
        }
        cc.log("page =",page);
        sySocket.sendComReqMsg(4520, [1, this.dataType, 0, page]);
    },
}); 