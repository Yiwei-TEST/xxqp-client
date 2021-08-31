/**
 * Created by Administrator on 2016/6/27.
 */
var ClubAgentManagePop = BasePopup.extend({
    ctor: function (root) {
        this.parentNode = root;
        this.mode = 0;
        this.myValue = 0;//上级给我的分
        this.maxValue = 0;//当前可给下级的最大值
        this.configDataList = [];//当前界面的数据
        this.curConfigDataList = [];//当前已经修改的数据
        this.creditAllotMode = 0;
        this._super("res/clubAgencyManagePop.json");
    },

    selfRender: function() {

        var Button_change = this.getWidget("Button_change");
        UITools.addClickEvent(Button_change,this,this.onChange);

        var Button_save = this.getWidget("Button_save");
        UITools.addClickEvent(Button_save,this,this.onSave);

        this.listView = this.getWidget("ListView");

        //你正在对某人操作
        this.Label_7 = this.getWidget("Label_7");
        var targetUserId = this.parentNode.opUserId || "";
        this.Label_7.setString("你正在对“"+targetUserId+"”玩家进行赠送分成操作");


        this.labelNoData = this.getWidget("labelNoData");//暂无数据
        this.labelNoData.visible = false;

        this.Panel_tips = this.getWidget("Panel_tips");//显示提示弹框
        this.Panel_tips.visible = false;
        this.labelTips = this.getWidget("labelTips");//显示提示内容
        var ruleBtn = this.getWidget("ruleBtn");//提示按钮

        UITools.addClickEvent(ruleBtn,this,this.onRule);
        UITools.addClickEvent(this.Panel_tips,this,this.onRule);
        this.showRuleText();


        this.Label_agencyWay = this.getWidget("Label_agencyWay");//显示分成模式
        this.Label_agencyWay.setString("");

        this.addCustomEvent(SyEvent.UPDATA_AGENt_PROCE,this,this.updateData);

        this.loadCreditConfig();
    },


    //获取配置列表
    loadCreditConfig:function(){
        var self = this;
        var targetUserId = self.parentNode.opUserId;
        NetworkJT.loginReq("groupCreditAction", "loadCreditConfig", {
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            targetUserId:targetUserId
        }, function (data) {
            if (data) {
                if(self){
                    //cc.log("loadCreditConfig",JSON.stringify(data));
                    if (data.message && data.message.creditAllotMode){
                        self.creditAllotMode = data.message.creditAllotMode;
                    }
                    //cc.log("data.message.creditAllotMode",data.message.creditAllotMode)
                    //cc.log("self.creditAllotMode",self.creditAllotMode)
                    self.showAllotModeText();
                    self.refreshConfigList(data.message.dataList);
                    if (!data.message.dataList || data.message.dataList.length == 0){
                        self.labelNoData.visible = true
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    refreshConfigList:function(configDataList){
        if(!configDataList){
            //cc.log("获取俱乐部成员数据失败...");
            return;
        }
        this.listView.removeAllItems();
        if (configDataList.length > 0){
            this.maxValue = configDataList[0].maxValue;
            this.myValue = configDataList[0].myValue;
        }
        this.configDataList = configDataList;
        for(var index = 0 ; index < configDataList.length; index++){
            var value = configDataList[index].myValue;
            var maxValue = configDataList[index].maxValue;
            if (value < this.myValue){
                this.myValue = value;
            }
            if (maxValue < this.maxValue){
                this.maxValue = maxValue;
            }
            var configItem = new ClubAgentManageItem(configDataList[index] , this , index);
            this.listView.pushBackCustomItem(configItem);

        }
    },

    /**
     * groupId
     userId
     targetUserId=下级的用户id
     credit=抽水值
     mode=设置方式：1：批量，其他：多个数据保存
     configs=保存多个值时设置：格式configId1,credit1;configId2,credit2....
     * */
    //获取配置列表
    updateCreditConfig:function(configs){
        var self = this;
        var targetUserId = self.parentNode.opUserId;
        if (configs && configs.length > 0){
            NetworkJT.loginReq("groupCreditAction", "updateCreditConfig", {
                groupId:ClickClubModel.getCurClubId(),
                userId:PlayerModel.userId,
                sessCode:PlayerModel.sessCode,
                targetUserId:targetUserId,
                configs:configs
            }, function (data) {
                if (data) {
                    if(self){
                        //cc.log("updateCreditConfig",JSON.stringify(data));
                        FloatLabelUtil.comText("保存成功");
                        self.refreshConfigList(data.message.dataList);
                        PopupManager.remove(self);
                    }
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        }else{
            FloatLabelUtil.comText("未修改任何值无法保存");
        }
    },


    updateData:function(event){
        var data = event.getUserData();
        var configId = data.configId;
        var nextValue = data.num;
        var items = this.listView.getItems();
        for(var i = 0 ; i < items.length ; i++){
            if (configId == 0 || items[i].configId == configId){
                items[i].updateData(nextValue);
            }
        }

        //cc.log("updateData......",configId,nextValue);
        for(var i = 0 ; i < this.configDataList.length ; i++){
            var configData = this.configDataList[i];
            //cc.log("configData.configId",configData.configId)
            if (configId == 0 || configData.configId == configId){
                var curConfigs = {};
                curConfigs.configId = configData.configId;
                curConfigs.nextValue = nextValue;
                if (this.curConfigDataList.length > 0){
                    var isPush= true;
                    for(var j = 0 ; j < this.curConfigDataList.length ; j++){
                        //cc.log("this.curConfigDataLis",this.curConfigDataList[j].configId)
                        if (configId == this.curConfigDataList[j].configId){
                            isPush= false;
                            this.curConfigDataList[j].nextValue = curConfigs.nextValue;
                            break;
                        }
                    }
                    if (isPush){
                        this.curConfigDataList.push(curConfigs);
                    }
                }else{
                    this.curConfigDataList.push(curConfigs);
                }

            }
        }

        //cc.log("this.curConfigDataList........",JSON.stringify(this.curConfigDataList));
    },

    //筛选掉重复修改，但是和原来的值一直的数据
    getFinalConfigData:function(){
        //cc.log("onSave........");
        var curConfigDataList = [];
        for(var i = 0 ; i < this.curConfigDataList.length ; i++){
            var configData = this.curConfigDataList[i];
            for(var j = 0 ; j < this.configDataList.length ; j++){
                if (configData.configId == this.configDataList[j].configId && configData.nextValue != this.configDataList[j].nextValue) {
                    var curConfigs = {};
                    curConfigs.configId = configData.configId;
                    curConfigs.nextValue = configData.nextValue;
                    curConfigDataList.push(curConfigs);
                }
            }
        }
        return curConfigDataList;
    },


    showRuleText:function(){
        var str = "赠送分成规则："	+
            "\n1、请确认正在对谁进行设置分成，同时注意分成模式（大赢家分成，参与分成）；"+
            "\n2、若为大赢家分成模式，则满足可设置给下级的分成值≤可分配的赠送分（群主可设置下级的分成值≤初始赠送分；"+
            "\n3、若为参与分成模式，群主给组长分配的分成值需满足 给组长分成值*玩法人数≤初始赠送分，组长对下级拉手以及下级拉手对应给下级的分成值≤可分配赠送分；"+
            "\n4、可针对各个玩法单独进行给下级赠送分分成值设定，也可以批量设定；"+
            "\n5、批量设定分成值最大只可设定为所有玩法中可分配的最低赠送分；" +
            "\n6、若上级修改了分配值后，分成界面将被修改过得玩法数据列的赠送分数值变为红色，提示玩家即使更新设定；" +
            "\n7、所有玩法分成值设定完成后需点击保存修改才实际生效；";
        this.labelTips.setString("" + str);
    },

    showAllotModeText:function(){
        var str = "";
        //cc.log("this.creditAllotMode",this.creditAllotMode);
        if (this.creditAllotMode == 1){
            str = "大赢家分成";
        } else if (this.creditAllotMode == 2){
            str = "参与分成";
        }
        this.Label_agencyWay.setString(str);
    },

    //查询提示
    onRule:function(){
        if (this.Panel_tips.isVisible()){
            this.Panel_tips.visible  = false;
        }else{
            this.Panel_tips.visible  = true;
        }
    },

    onChange:function(){
        this.mode = 1;
        var mc = new ClubAgentProceedPop(1,this);
        PopupManager.addPopup(mc);
        //cc.log("onChange........");
    },

    onSave:function(){
        var configs = "";
        var finalConfigs = this.getFinalConfigData();
        //cc.log("finalConfigs===",JSON.stringify(finalConfigs));
        for(var i = 0 ; i < finalConfigs.length ; i++){
            configs = configs + finalConfigs[i].configId +"," + finalConfigs[i].nextValue  + ";";
        }
        this.updateCreditConfig(configs);

    }

});