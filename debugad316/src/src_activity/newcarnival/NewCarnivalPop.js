/**
 * Created by zyq on 2020/9/9.
 */

var NewCarnivalPop = BasePopup.extend({
    giftConfigs : {
        1:["一",1,1,"khlh3"],
        2:["二",2,2,"khlihe1"],
        3:["三",3,1,"khlh3"],
        4:["四",4,1,"khlh3"],
        5:["五",5,1,"khlh3"],
        6:["六",6,1,"khlh3"],
        7:["七",7,3,"khlihe1"],
        15:["十五",8,4,"khle2"]},
    curActive:0,
    totalActive:0,
    ctor: function () {
        this._super("res/newCarnivalPop.json");
    },

    selfRender: function () {
        this.addCustomEvent(SyEvent.NEW_CARNIVAL_REFRESH,this,this.refreshTaskProcess);
        var giftConfig = this.giftConfigs[TaskInfoModel.extParam[0]||1]
        var Label_tip_1 = this.getWidget("Label_tip_1");
        Label_tip_1.setString("第"+giftConfig[0]+"天狂欢进度：")

        var Button_wenhao = this.getWidget("Button_wenhao");
        UITools.addClickEvent(Button_wenhao, this , this.onQuestion);

        for(var j = 0;j<NewCarnivalModel.giftList.length;j++){
            if(TaskInfoModel.extParam[1] == NewCarnivalModel.giftList[j].taskId){
                this.curActive = NewCarnivalModel.giftList[j].process
            }
        }

        var Label_tip_2 = this.getWidget("Label_tip_2");
        Label_tip_2.setString(""+this.curActive)

        //var Label_progress = this.getWidget("Label_progress_"+(giftConfig[1]||1));
        //Label_progress.setString(""+this.totalActive)

        this.Button_award = []

        for(var i = 0;i<NewCarnivalModel.giftInfo.length;i++){
            var Label_progress = this.getWidget("Label_progress_"+(i+1));
            if(TaskInfoModel.extParam[1] == NewCarnivalModel.giftInfo[i][0]){
                this.totalActive = NewCarnivalModel.giftInfo[i][2]
                Label_progress.setString(""+this.totalActive)
            }
            var Button_award = this.getWidget("Button_award_"+(i+1));
            Button_award.taskId = NewCarnivalModel.giftInfo[i][0]
            UITools.addClickEvent(Button_award, this , this.onAward);
            this.Button_award.push(Button_award)
            //var isOpened = false
            //for(var j = 0;j<NewCarnivalModel.openedGift.length;j++){
            //    cc.log("liwu_open",NewCarnivalModel.giftInfo[i][0],NewCarnivalModel.openedGift[j])
            //    if(NewCarnivalModel.giftInfo[i][0] == NewCarnivalModel.openedGift[j]){
            //        isOpened = true
            if(NewCarnivalModel.giftList[i].state == 2){
                Button_award.setTouchEnabled(false)
                Button_award.loadTextures("res/res_activity/newcarnival/newCarnivalPop/liwu_open_"+this.giftConfigs[NewCarnivalModel.giftInfo[i][1]][2]+".png","","")
                Label_progress.setString("已领取")
            }else if(NewCarnivalModel.giftList[i].state == 1){
                Button_award.setOpacity(0);
                var aniName = giftConfig[3]
                ccs.armatureDataManager.addArmatureFileInfo("res/res_activity/newcarnival/animation/"+aniName+"/"+aniName+".ExportJson");
                var ani = new ccs.Armature(aniName);
                ani.getAnimation().play("Animation1",-1,1);
                ani.setPosition(Button_award.width/2,Button_award.height/2)
                ani.setName("AwardAnim")
                Button_award.addChild(ani)
                Button_award.isOpen = true
                Button_award.setTouchEnabled(true)

            }else if(NewCarnivalModel.giftInfo[i][1]<TaskInfoModel.extParam[0] && NewCarnivalModel.giftList[i].state == 0){
                Button_award.setTouchEnabled(false)
                Button_award.loadTextures("res/res_activity/newcarnival/newCarnivalPop/liwu_past_"+this.giftConfigs[NewCarnivalModel.giftInfo[i][1]][2]+".png","","")
                Label_progress.setString("已过期")
            }

            if(NewCarnivalModel.giftInfo[i][1]>TaskInfoModel.extParam[0] ||
                (NewCarnivalModel.giftInfo[i][1] == TaskInfoModel.extParam[0] && this.totalActive > this.curActive)){
                Button_award.giftInfo = NewCarnivalModel.giftInfo[i]
            //}else{
            //    cc.log("Button_award",NewCarnivalModel.giftInfo[i][1],TaskInfoModel.extParam[0],this.totalActive,this.curActive)
            //    Button_award.setTouchEnabled(false)
            }
        }

        this.ListView = this.getWidget("ListView");
        this.Image_item = this.getWidget("Image_item");
        this.Image_item.retain()
        this.Image_item.removeFromParent(true)
        this.loadTaskList()
    },

    loadTaskList:function(){
        // this.ListView.removeAllChildren()
        // for(var i = 0;i<NewCarnivalModel.taskInfos.length;i++){
        //     var taskInfo = NewCarnivalModel.taskInfos[i]
        //     var item = this.Image_item.clone()
        //     this.ListView.pushBackCustomItem(item)
        //     item.taskId = taskInfo.taskId
        //     var Image_type = ccui.helper.seekWidgetByName(item,"Image_type");
        //     Image_type.loadTexture("res/res_activity/newcarnival/newCarnivalPop/taskicon_"+taskInfo.taskIcon+".png")
        //     var Label_item_1 = ccui.helper.seekWidgetByName(item,"Label_item_1");
        //     Label_item_1.setString(""+taskInfo.taskDesc)
        //     var Label_item_2 = ccui.helper.seekWidgetByName(item,"Label_item_2");
        //     Label_item_2.setString("进度"+(taskInfo.process>taskInfo.param?taskInfo.param:taskInfo.process)+"/"+taskInfo.param)
        //     var Label_item_3 = ccui.helper.seekWidgetByName(item,"Label_item_3");
        //     Label_item_3.setString("狂欢度+"+taskInfo.activeVal)
        //     var Button_ptlq = ccui.helper.seekWidgetByName(item,"Button_ptlq");
        //     Button_ptlq.temp = 1
        //     Button_ptlq.taskId = taskInfo.taskId
        //     UITools.addClickEvent(Button_ptlq, this , this.onClickBtn);
        //     var Button_dblq = ccui.helper.seekWidgetByName(item,"Button_dblq");
        //     Button_dblq.temp = 2
        //     Button_dblq.taskId = taskInfo.taskId
        //     UITools.addClickEvent(Button_dblq, this , this.onClickBtn);
        //     var Button_ljqw = ccui.helper.seekWidgetByName(item,"Button_ljqw");
        //     Button_ljqw.temp = 3
        //     Button_ljqw.taskId = taskInfo.taskId
        //     Button_ljqw.taskIcon = taskInfo.taskIcon
        //     UITools.addClickEvent(Button_ljqw, this , this.onClickBtn);
        //     var Image_ylq = ccui.helper.seekWidgetByName(item,"Image_ylq");
        //     Button_dblq.visible = Button_ptlq.visible = (taskInfo.state == 1)?true:false
        //     Button_ljqw.visible = (taskInfo.state == 0)?true:false
        //     Image_ylq.visible = (taskInfo.state == 2)?true:false
        //     if(taskInfo.state == 1  && SyConfig.isIos()){
        //         Button_dblq.visible = false
        //         Button_ptlq.loadTextures("res/res_activity/newcarnival/newCarnivalPop/lingqu.png","","")
        //         Button_ptlq.y = 0
        //     }
        //     var ListView_award = ccui.helper.seekWidgetByName(item,"ListView_award");
        //     var item_award = ccui.helper.seekWidgetByName(item,"item_award");
        //     item_award.retain()
        //     ListView_award.removeAllChildren()
        //     ListView_award.setTouchEnabled(false)
        //     var rewardParam = taskInfo.rewardParam
        //     var awards = []
        //     var split = rewardParam.split("#")
        //     for(var j = 0;j<split.length;j++){
        //         awards.push(split[j].split("_"))
        //     }
        //     for(var k = 0;k<awards.length;k++){
        //         var item_award = item_award.clone()
        //         ListView_award.pushBackCustomItem(item_award)
        //         var Image_award = ccui.helper.seekWidgetByName(item_award,"Image_award");
        //         Image_award.loadTexture(PropDataMgr.getPropIcon(awards[k][0]))
        //         var Label_award = ccui.helper.seekWidgetByName(item_award,"Label_award");
        //         Label_award.setString("×"+awards[k][1])
        //     }
        // }
    },

    refreshTaskProcess:function(event){
        var taskIndex = event.getUserData();

        if(taskIndex == 1){
            if(TaskInfoModel.refreshTaskData.state == 1){
                this.curActive = TaskInfoModel.refreshTaskData.process || 0
                var Label_tip_2 = this.getWidget("Label_tip_2");
                Label_tip_2.setString(""+this.curActive)
                if(this.totalActive <= this.curActive){
                    var giftConfig = this.giftConfigs[TaskInfoModel.extParam[0]]
                    var Button_award = this.Button_award[giftConfig[1]-1]
                    Button_award.setOpacity(0);
                    var ani = Button_award.getChildByName("AwardAnim")
                    if(!ani){
                        var aniName = giftConfig[3]
                        ccs.armatureDataManager.addArmatureFileInfo("res/res_activity/newcarnival/animation/"+aniName+"/"+aniName+".ExportJson");
                        var ani = new ccs.Armature(aniName);
                        ani.getAnimation().play("Animation1",-1,1);
                        ani.setPosition(Button_award.width/2,Button_award.height/2)
                        Button_award.addChild(ani)
                        ani.setName("AwardAnim")
                    }
                    Button_award.isOpen = true
                }
            }else if(TaskInfoModel.refreshTaskData.state == 2){
                var day = 1
                for(var i = 0;i<NewCarnivalModel.giftInfo.length;i++){
                    if(NewCarnivalModel.giftInfo[i][0] == TaskInfoModel.refreshTaskData.taskId){
                        day = NewCarnivalModel.giftInfo[i][1]
                    }
                }
                for(var i = 0;i<this.Button_award.length;i++){
                    if(this.Button_award[i].taskId == TaskInfoModel.refreshTaskData.taskId){
                        this.Button_award[i].isOpen = false
                        this.Button_award[i].loadTextures("res/res_activity/newcarnival/newCarnivalPop/liwu_open_"+this.giftConfigs[day][2]+".png","","")
                        this.Button_award[i].setTouchEnabled(false)
                        this.Button_award[i].removeAllChildren()
                        this.Button_award[i].setOpacity(255)
                        var Label_progress = this.getWidget("Label_progress_"+(i+1));
                        Label_progress.setString("已领取")
                        break
                    }
                }
            }
        }else if(taskIndex == 2){
            //for(var i = 0;i<TaskInfoModel.taskInfos.length;i++){
            //    if(TaskInfoModel.taskInfos[i].state == 1){
            //        SyEventManager.dispatchEvent(SyEvent.NEW_CARNIVAL_REFRESH);
            //    }
            //}
            //if(this.getClickBtn.type == 1){
            //    cc.log("this.ListView")
                //for(var i = 0;i<NewCarnivalModel.taskInfos.length;i++){
                //    if(NewCarnivalModel.taskInfos[i].taskId == TaskInfoModel.refreshTaskData.taskId){
                //        NewCarnivalModel.taskInfos[i].state = TaskInfoModel.refreshTaskData.state
                //        break
                //    }
                    //var item = this.ListView.getItem(i)
                    //cc.log("this.ListView1",JSON.stringify(item))
                    //if(item.taskId == TaskInfoModel.refreshTaskData.taskId){
                    //    cc.log("this.ListView2",i)
                    //    this.ListView.removeItem(i)
                    //    this.ListView.pushBackCustomItem(item)
                    //    var Image_ylq = ccui.helper.seekWidgetByName(item,"Image_ylq");
                    //    Image_ylq.visible = true
                    //    var Button_ptlq = ccui.helper.seekWidgetByName(item,"Button_ptlq");
                    //    var Button_dblq = ccui.helper.seekWidgetByName(item,"Button_dblq");
                    //    Button_dblq.visible = Button_ptlq.visible = false
                    //    break
                    //}
                //}
                this.loadTaskList()
                //var item = this.getClickBtn.getParent()
                //var Image_ylq = ccui.helper.seekWidgetByName(item,"Image_ylq");
                //Image_ylq.visible = true
                //var Button_ptlq = ccui.helper.seekWidgetByName(item,"Button_ptlq");
                //var Button_dblq = ccui.helper.seekWidgetByName(item,"Button_dblq");
                //Button_dblq.visible = Button_ptlq.visible = false

            //}else if(this.getClickBtn.type == 2){
            //    var day = 1
            //    for(var i = 0;i<NewCarnivalModel.giftInfo.length;i++){
            //        if(NewCarnivalModel.giftInfo[i][0] == TaskInfoModel.refreshTaskData.taskId){
            //            day = NewCarnivalModel.giftInfo[i][1]
            //        }
            //    }
            //    for(var i = 0;i<this.Button_award.length;i++){
            //        if(this.Button_award[i].taskId == TaskInfoModel.refreshTaskData.taskId){
            //            this.Button_award[i].isOpen = false
            //            this.Button_award[i].loadTextures("res/res_activity/newcarnival/newCarnivalPop/liwu_open_"+this.giftConfigs[day][2]+".png","","")
            //            this.Button_award[i].setTouchEnabled(false)
            //            this.Button_award[i].removeAllChildren()
            //            this.Button_award[i].setOpacity(255)
            //            var Label_progress = this.getWidget("Label_progress_"+(i+1));
            //            Label_progress.setString("已领取")
            //            break
            //        }
            //    }
            //}
        }
        //this.getClickBtn = null
    },

    onClickBtn:function(obj){
        //cc.log("onClickBtn",obj.temp,obj.taskIcon)
        obj.type = 1
        this.getClickBtn = obj
        if(obj.temp == 1){//普通领取
            cc.log("sendComReqMsg 1006")
            sySocket.sendComReqMsg(1006, [1,12,parseInt(obj.taskId)]);
        }else if(obj.temp == 2){//多倍领取
            NewCarnivalModel.taskId = obj.taskId
            if(SyConfig.IS_LOAD_AD){
                SdkUtil.byAdvertytoApp("945308403",0,8);
            }else if (SyConfig.IS_LOAD_AD_NEW){
                SdkUtil.byAdvertytoApp("945459250",0,8);
            }
        }else if(obj.temp == 3){//立即前往娱乐场跑得快
            if(obj.taskIcon == 2||obj.taskIcon == 3||obj.taskIcon == 4||obj.taskIcon == 8||obj.taskIcon == 9||obj.taskIcon == 11 || (SyConfig.isIos()&&obj.taskIcon == 10)){
                sySocket.sendComReqMsg(137 , [] , [] , 2);
                var pop = new SignInPop();
                PopupManager.addPopup(pop);
                sySocket.sendComReqMsg(137 , [] , ""+1 , 6);
                PopupManager.remove(this)
            }else if(obj.taskIcon == 6){//分享
                var pop = new BjdShareGiftPop();
                PopupManager.addPopup(pop);
            }else if(obj.taskIcon == 7){//比赛场
                var mc = new GoldMatchPop();
                PopupManager.addPopup(mc);
            }else if(obj.taskIcon == 10){
                var mc = new NewQianDaoPop();
                PopupManager.addPopup(mc);
            }
        }
    },

    onAward:function(obj){
        obj.type = 2
        this.getClickBtn = obj
        cc.log("onAward",obj.isOpen)
        if(obj.isOpen){
            sySocket.sendComReqMsg(1006, [1,12,parseInt(obj.taskId)]);
        }else if(obj.giftInfo){
            for(var i = 0;i<NewCarnivalModel.giftList.length;i++){
                if(obj.giftInfo[0] == NewCarnivalModel.giftList[i].taskId){
                    var pop = new NewAwardPop(NewCarnivalModel.giftList[i]);
                    PopupManager.addPopup(pop);
                }
            }
        }
    },

    onQuestion:function(){
        var pop = new NewQuestionPop();
        PopupManager.addPopup(pop);
    },

    onCloseHandler : function(){
        if(!cc.sys.localStorage.getItem("New_Carnival_FirstTime")){
            NewCarnivalModel.newCarnivalGuide = true
            SyEventManager.dispatchEvent(SyEvent.NEW_CARNIVAL_GUIDE);
        }
        PopupManager.remove(this);
    },
})

var NewAwardPop = cc.Layer.extend({
    ctor: function (taskInfo) {
        this.taskInfo = taskInfo
        this._super()
        SyEventManager.addEventListener(SyEvent.GOLDEN_EGGS_OPEN, this, this.onOpenPacket);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded: function (touch, event) {
            }.bind(this)
        }), this);
        this.initLayer()
    },
    initLayer:function() {
        // var grayLayer = new cc.LayerColor(cc.color(0, 0, 0, 180));
        // this.addChild(grayLayer);
        // var layerBg = new cc.Sprite("res/res_activity/newcarnival/newCarnivalPop/bg_1.png");
        // layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        // this.addChild(layerBg);
        //
        // var closeBtn = new ccui.Button("res/ui/bjdmj/popup/close2.png","","");
        // closeBtn.setPosition(layerBg.width-10,layerBg.height-10);
        // layerBg.addChild(closeBtn)
        // UITools.addClickEvent(closeBtn, this , this.onClose);
        //
        // var sureBtn = new ccui.Button("res/res_activity/newcarnival/newCarnivalPop/sure.png","","");
        // sureBtn.setPosition(layerBg.width/2,68);
        // layerBg.addChild(sureBtn)
        // UITools.addClickEvent(sureBtn, this , this.onClose);
        //
        // var fontName = "res/font/bjdmj/fznt.ttf";
        // var title = new ccui.Text("奖励说明",fontName,40);
        // title.setPosition(layerBg.width/2,layerBg.height-50);
        // title.setColor(cc.color("#90382e"));
        // layerBg.addChild(title);
        //
        // var bg = UICtor.cImg("res/res_activity/newcarnival/newCarnivalPop/bg_2.png");
        // bg.setPosition(layerBg.width/2,layerBg.height/2+20);
        // bg.setScale9Enabled(true)
        // bg.setContentSize(780,400)
        // layerBg.addChild(bg);
        //
        // var rewardParam = this.taskInfo.rewardParam
        // var awards = []
        // var split = rewardParam.split("#")
        // for(var i = 0;i<split.length;i++){
        //     awards.push(split[i].split("_"))
        // }
        // for(var i = 0;i<awards.length;i++){
        //     var bg_item = new cc.Sprite("res/res_activity/newcarnival/newCarnivalPop/bg_3.png")
        //     layerBg.addChild(bg_item);
        //     bg_item.setPosition(132+(i%4)*186,422-parseInt(i/4)*180)
        //     var item = new cc.Sprite(PropDataMgr.getPropIcon(awards[i][0]))
        //     item.setPosition(bg_item.width/2,bg_item.height/2+16);
        //     bg_item.addChild(item);
        //     var numText = new ccui.Text("×"+awards[i][1],fontName,28);
        //     numText.setPosition(bg_item.width/2,22);
        //     numText.setColor(cc.color("#90382e"));
        //     bg_item.addChild(numText);
        // }
    },
    onClose : function(){
        PopupManager.remove(this);
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
})

var NewQuestionPop = cc.Layer.extend({
    ctor:function() {
        this._super()
        SyEventManager.addEventListener(SyEvent.GOLDEN_EGGS_OPEN,this,this.onOpenPacket);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            },
            onTouchEnded:function(touch,event){
            }.bind(this)
        }), this);
        this.initLayer()
    },
    initLayer:function() {
        var grayLayer = new cc.LayerColor(cc.color(0, 0, 0, 180));
        this.addChild(grayLayer);
        var layerBg = new cc.Sprite("res/res_activity/newcarnival/newCarnivalPop/bg_1.png");
        layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(layerBg);

        var closeBtn = new ccui.Button("res/ui/bjdmj/popup/close2.png","","");
        closeBtn.setPosition(layerBg.width-10,layerBg.height-10);
        layerBg.addChild(closeBtn)
        UITools.addClickEvent(closeBtn, this , this.onClose);

        var str = "活动开启后，连续每天登录完成对应的任务，获得狂欢度，可激活每天的狂欢礼包。\n"+
        "连续7天激活所有礼包后，可获得10元话费卡，中间可不能断哦！\n"+
        "第15天登录完成当天的任务可激活超级大礼包。"
        var fontName = "res/font/bjdmj/fznt.ttf";
        var label = new ccui.Text(str,fontName,34);
        label.setAnchorPoint(0.5,1);
        label.setColor(cc.color("#b23614"));
        label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        label.setPosition(layerBg.width/2,layerBg.height-40);
        label.setTextAreaSize(cc.size(760,600))
        layerBg.addChild(label);
    },
    onClose : function(){
        PopupManager.remove(this);
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
})