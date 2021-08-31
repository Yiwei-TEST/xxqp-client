var MissionItem = ccui.Widget.extend({
        // tag = 2;//1 任务标签
        // missionExplain = 3;// 任务描述
        // awardExplain = 4;// 奖励描述
        // type = 5;// 任务类型
        // finishNum = 6;// 完成需求数
        // awardId = 7;// 奖励id
        // awardIcon = 8;// 奖励图标
        // awardNum = 9;// 奖励数量

    id:null,
    type:null,
    ctor:function(){
        this._super();
        // cc.log("data =",data);
        this.root = ccs.uiReader.widgetFromJsonFile("res/MissionItem.json");
        // this.root.setPosition();
        this.root.setPositionX(10);
        this.addChild(this.root);
        this.setContentSize(this.root.getContentSize().width,this.root.getContentSize().height +10);
    },

    setItemWithData:function(data){
        // cc.log("data =",JSON.stringify(data));
        var name = ccui.helper.seekWidgetByName(this.root,"name");
        name.setString(data.missionExplain);
        this.num = ccui.helper.seekWidgetByName(this.root,"num");
        this.num.setString("0/"+data.finishNum);
        var award = ccui.helper.seekWidgetByName(this.root,"award");
        var awardString = "";
        // if(data.awardIcon == )
        if(data.awardNum > 0)
            awardString = "白金豆x" + data.awardNum;
        award.setString(awardString);
        this.Progress = ccui.helper.seekWidgetByName(this.root,"Progress");
        this.Progress.setPercent(0);
        this.type = data.type;
        this.id = data.id;
        this.finishNum = data.finishNum;
        this.awardNum = data.awardNum;
        this.Button_qianwang = ccui.helper.seekWidgetByName(this.root,"Button_qianwang");
        UITools.addClickEvent(this.Button_qianwang,this,this.onClickQianwangBtn);

        this.Button_lingqu = ccui.helper.seekWidgetByName(this.root,"Button_lingqu");
        UITools.addClickEvent(this.Button_lingqu,this,this.onClickLingquBtn);   
        this.Image_finish =  ccui.helper.seekWidgetByName(this.root,"Image_finish");
    }, 

    onClickQianwangBtn:function(){
        if(this.type == 1){//签到任务
            sySocket.sendComReqMsg(1115,[4]);
            if(PopupManager.getClassByPopup(MissionPop)){
                PopupManager.removeClassByPopup(MissionPop)
            }
        }else if(this.type == 2){//局数任务
            if(PopupManager.getClassByPopup(MissionPop)){
                PopupManager.removeClassByPopup(MissionPop)
            }
        }else if(this.type == 3){//分享任务
            var pop = new BjdShareGiftPop();
            PopupManager.addPopup(pop);
            if(PopupManager.getClassByPopup(MissionPop)){
                PopupManager.removeClassByPopup(MissionPop)
            }
        }else if(this.type == 4){//比赛场任务
            var pop = new GoldMatchPop();
            PopupManager.addPopup(pop);
            if(PopupManager.getClassByPopup(MissionPop)){
                PopupManager.removeClassByPopup(MissionPop)
            }
        }
    },
    refreshItemStatus:function(data){
        this.Progress.setPercent((data.progressBar/this.finishNum)*100);
        this.num.setString(data.progressBar+"/"+this.finishNum);
        this.Button_qianwang.visible = (data.isComplete == 0 && data.isObtain == 0);
        this.Button_lingqu.visible = (data.isComplete == 1 && data.isObtain == 0);
        this.Image_finish.visible = (data.isObtain == 1);
    },
    isFinish:function(){
        var pop = new AwardPop(this.awardNum);
        PopupManager.addPopup(pop);
        this.Button_qianwang.visible = false;
        this.Button_lingqu.visible = false;
        this.Image_finish.visible = true;
    },
    onClickLingquBtn:function(){
        sySocket.sendComReqMsg(1117 , [3,this.id]);
    } 
});


var MissionPop = BasePopup.extend({
    ctor:function(){
        this._super("res/MissionPop.json");
    },

    selfRender:function(){
        this.itemList = [];
        this.ListView_daily = this.getWidget("ListView_daily");
        this.ListView_daily.setScrollBarEnabled(false);
        if(BeansConfigModel.dailyTask){
            for (var i = 0; i < BeansConfigModel.dailyTask.length; i++) {
                var item = new MissionItem();
                item.setItemWithData(BeansConfigModel.dailyTask[i]);
                this.itemList.push(item);
                this.ListView_daily.pushBackCustomItem(item);
            }        
            this.RefreshStatus(BeansConfigModel.dailyTask);
        }

        this.ListView_challenge = this.getWidget("ListView_challenge");
        this.ListView_challenge.setScrollBarEnabled(false);
        if(BeansConfigModel.challengeTask){
            for (var i = 0; i < BeansConfigModel.challengeTask.length; i++) {
                var item = new MissionItem();
                item.setItemWithData(BeansConfigModel.challengeTask[i]);
                this.itemList.push(item);
                this.ListView_challenge.pushBackCustomItem(item);
            }
            this.RefreshStatus(BeansConfigModel.challengeTask);
        }
        

        var CheckBox_daily = this.getWidget("CheckBox_daily");
        var CheckBox_challenge = this.getWidget("CheckBox_challenge");

        UITools.addClickEvent(CheckBox_daily,this,function () {
            if(CheckBox_daily.isSelected()){
                CheckBox_daily.setSelected(false);
            }
            CheckBox_challenge.setSelected(false);
            this.ListView_challenge.visible=false;
            this.ListView_daily.visible= true;
        });

        UITools.addClickEvent(CheckBox_challenge,this,function () {
            if(CheckBox_challenge.isSelected()){
                CheckBox_challenge.setSelected(false);
            }
            CheckBox_daily.setSelected(false);
            this.ListView_challenge.visible=true;
            this.ListView_daily.visible= false;
        });

        if(BeansConfigModel.challengeTask){
            CheckBox_challenge.visible = true;
        }
        
        // cc.log("this.itemList =",JSON.stringify(this.itemList));
    },
    RefreshStatus:function(data){
        cc.log("data =",JSON.stringify(data));
        for (var j = 0; j < data.length; j++) {
            for (var i = 0; i < this.itemList.length; i++) {
                if(this.itemList[i].id == data[j].id){
                    this.itemList[i].refreshItemStatus(data[j]);
                }
            }
        }
    },

    MissionFinish:function(taskId){
        // cc.log("taskId =",taskId);
        for (var i = 0; i < this.itemList.length; i++) {
            if(this.itemList[i].id == taskId){
                this.itemList[i].isFinish();
            }
        }
    },

    onClose:function(){
        this.itemList = [];
        BeansConfigModel.dailyTask=null;
        BeansConfigModel.challengeTask=null;
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});
