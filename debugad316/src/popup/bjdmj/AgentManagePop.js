var AgentManagePop = BasePopup.extend({
    ctor:function(){
        this._super("res/agentManage.json");
    },

    selfRender:function(){
        var close_btn = this.getWidget("close_btn");

        var btn_game_item_1  = this.getWidget("btn_game_item_1");
        btn_game_item_1.temp = 2;
        var btn_game_item_2  = this.getWidget("btn_game_item_2");
        btn_game_item_2.temp = 1;

        this.Image_player = this.getWidget("Image_player");//玩家列表信息
        this.Image_club = this.getWidget("Image_club");//亲友圈列表信息
        this.Image_changeClubID = this.getWidget("Image_changeClubID");//靓号修改

        this.Label_noData = this.getWidget("Label_noData");//没有数据
        this.Label_noData.visible = false;

        this.Image_check = this.getWidget("Image_check");//查找玩家id
        this.Image_check.visible = false;

        var inputBg2 = ccui.helper.seekWidgetByName(this.Image_check,"inputBg");
        this.inputBox_check = new cc.EditBox(cc.size(inputBg2.width - 10, inputBg2.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox_check.x = inputBg2.width/2;
        this.inputBox_check.y = inputBg2.height/2;
        //this.inputBox2.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg2.addChild(this.inputBox_check,1);
        this.inputBox_check.setFont("Arial",40);
        this.inputBox_check.setPlaceholderFont("Arial",40);
        this.inputBox_check.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        this.inputBox_check.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox_check.setPlaceHolder("请输入玩家ID");
        this.inputBox_check.setMaxLength(8);

        var tempSearch = ccui.helper.seekWidgetByName(this.Image_check,"btn_search");
        UITools.addClickEvent(tempSearch,this,this.onCheckUserId);

        this.label_begin = ccui.helper.seekWidgetByName(this.Image_club,"label_begin");
        this.label_end = ccui.helper.seekWidgetByName(this.Image_club,"label_end");

        var todayTime = this.formartTimeStr(new Date().getTime());
        var beginTime = todayTime;
        var endTime = todayTime;

        this.label_begin.setString(beginTime);
        this.label_end.setString(endTime);

        var btn_change_time = ccui.helper.seekWidgetByName(this.Image_club,"btn_chang_time");
        UITools.addClickEvent(btn_change_time,this,this.onClickChangeTime);

        this.btn_search = ccui.helper.seekWidgetByName(this.Image_club,"btn_search");
        UITools.addClickEvent(this.btn_search,this,this.onClickSearch);

        this.Label_count = ccui.helper.seekWidgetByName(this.Image_club,"Label_count");
        this.Label_count.string = "总计钻石消耗:0";

        UITools.addClickEvent(close_btn,this,this.onClose);
        UITools.addClickEvent(btn_game_item_1,this,this.onTitleClick);
        UITools.addClickEvent(btn_game_item_2,this,this.onTitleClick);

        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);

        this.btnGameItemArr = [];
        for(var i = 1;i < 4;++i){
            var btn = this.getWidget("btn_game_item_"+i);
            btn.temp = i;
            this.btnGameItemArr.push(btn);
            UITools.addClickEvent(btn , this , this.onTitleClick);
        }

        this.onTitleClick(btn_game_item_1);

        this.initSetUpData();

        this.localPlayerData = null;
    },

    initSetUpData:function(){
        var inputBg1 = ccui.helper.seekWidgetByName(this.Image_changeClubID,"Image_2");
        this.inputBox1 = new cc.EditBox(cc.size(inputBg1.width - 10, inputBg1.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox1.x = inputBg1.width/2;
        this.inputBox1.y = inputBg1.height/2;
        //this.inputBox1.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg1.addChild(this.inputBox1,1);
        this.inputBox1.setFont("Arial",40);
        this.inputBox1.setPlaceholderFont("Arial",40);
        this.inputBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        this.inputBox1.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox1.setPlaceHolder("请输入亲友圈ID");
        this.inputBox1.setMaxLength(8);

        var inputBg2 = ccui.helper.seekWidgetByName(this.Image_changeClubID,"Image_3");
        this.inputBox2 = new cc.EditBox(cc.size(inputBg2.width - 10, inputBg2.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox2.x = inputBg2.width/2;
        this.inputBox2.y = inputBg2.height/2;
        //this.inputBox2.setPlaceholderFontColor(cc.color(139,123,108));
        inputBg2.addChild(this.inputBox2,1);
        this.inputBox2.setFont("Arial",40);
        this.inputBox2.setPlaceholderFont("Arial",40);
        this.inputBox2.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        this.inputBox2.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox2.setPlaceHolder("请输入靓号ID");
        this.inputBox2.setMaxLength(8);

        var Button_setup = ccui.helper.seekWidgetByName(this.Image_changeClubID,"Button_set");
        UITools.addClickEvent(Button_setup,this,this.onSetUpClick);
    },

    onCheckUserId:function(){
        var userId = this.inputBox_check.string;
        var self = this;
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getBindOneMsg");
        if(userId == ""){
            FloatLabelUtil.comText("玩家ID不能为空");
            return;
        }
        Network.sypost(url,"getBindOneMsg",{payBindId:PlayerModel.userId,armId:userId},
            function(data){
                var tempData = [];
                if(data && Object.keys(data).length > 0){
                    tempData = [data];
                }
                self.localPlayerData = null;
                self.initList(self.Image_player,tempData,true);
            },function(data){
                if(data.msg){
                    FloatLabelUtil.comText(data.msg);
                }else{
                    FloatLabelUtil.comText("拉取数据失败");
                }
            }
        );
    },

    onSetUpClick:function(){
        var beforeId = this.inputBox1.string;
        var afterId = this.inputBox2.string;
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","updateGroupId");
        if(beforeId == ""){
            FloatLabelUtil.comText("亲友圈ID不能为空");
            return;
        }
        if(afterId == ""){
            FloatLabelUtil.comText("靓号ID不能为空");
            return;
        }
        Network.sypost(url,"updateGroupId",{beforeId:beforeId,afterId:afterId},
            function(data){
                FloatLabelUtil.comText("修改成功");
            },function(data){
                if(data.msg){
                    FloatLabelUtil.comText(data.msg);
                }else{
                    FloatLabelUtil.comText("修改失败");
                }
            }
        );
    },

    getUserData:function(){
        var self = this;
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getBackStageManagement");
        var userId = PlayerModel.userId;
        Network.sypost(url,"getBackStageManagement",{payBindId:userId},
            function(data){
                self.localPlayerData = data;
                self.initList(self.Image_player,self.localPlayerData,true);
            },function(data){
                if(data.msg){
                    FloatLabelUtil.comText(data.msg);
                }else{
                    FloatLabelUtil.comText("拉取数据失败");
                }
            }
        );
    },

    getClubData:function(){
        var self = this;
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","queryBindConsumption");
        var todayTime = this.label_begin.string;
        var userId = PlayerModel.userId;
        Network.sypost(url,"queryBindConsumption",{payBindId:userId,dataDate:todayTime},
            function(data){
                self.localClubData = data;
                self.initList(self.Image_club,self.localClubData);
            },function(data){
                if(data.msg){
                    FloatLabelUtil.comText(data.msg);
                }else{
                    FloatLabelUtil.comText("拉取数据失败");
                }
            }
        );
    },

    onTitleClick:function(obj){
       var temp = obj.temp;

        this.btnGameItemArr[0].setBright(temp == 1);
        this.btnGameItemArr[1].setBright(temp == 2);
        this.btnGameItemArr[2].setBright(temp == 3);

        if(temp == 2){
            this.getClubData();
       }else if(temp == 1){
           if(this.localPlayerData){
               this.initList(this.Image_player,this.localPlayerData,true);
           }else{
               this.getUserData();
           }
       }
        this.Image_player.visible = temp == 1;
        this.Image_club.visible = temp == 2;
        this.Image_changeClubID.visible = temp == 3;
        this.Image_check.visible = temp == 1;
        if(temp == 3){
            this.Label_noData.visible = false;
        }
    },

    onItemClick:function(obj){
        var data = obj.tempData;
        var self = this;
        AlertPop.show("是否给ID为"+data.userId +"的玩家开启亲友圈？",function(){
            var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","openCreateGroup");
            Network.sypost(url,"openCreateGroup",{payBindId:PlayerModel.userId,armId:data.userId},
                function(data){
                    FloatLabelUtil.comText("开启成功");
                    // obj.setBright(false);
                    // obj.setEnabled(false);
                    self.getUserData();
                },function(data){
                    if(data.msg){
                        FloatLabelUtil.comText(data.msg);
                    }else{
                        FloatLabelUtil.comText("开启失败");
                    }
                }
            );
        },function(){

        });
    },

    showIcon:function(widget,icon){
        var defaultimg = "res/res_phz/default_m.png";
        var sprite = new cc.Sprite(defaultimg);
        var scale = 0.98;
        sprite.scale = 0.98;
        sprite.x = widget.width / 2;
        sprite.y = widget.height / 2;
        sprite.setContentSize(widget.width * scale,widget.height * scale);
        widget.addChild(sprite,0);

        var tempImg = icon;
        if(tempImg == "null" || tempImg == "undefined" || tempImg == ""){
            tempImg = "res/res_icon/1.png";
        }
        if(tempImg){
            cc.loader.loadImg(tempImg, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }
    },

    initPlayerItemData:function(widget,data){
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var Label_name = ccui.helper.seekWidgetByName(widget,"Label_name");
        var Label_id = ccui.helper.seekWidgetByName(widget,"Label_id");
        var Label_time = ccui.helper.seekWidgetByName(widget,"Label_time");

        this.showIcon(icon,data.headimgurl);
        Label_name.string = data.name;
        Label_id.string = "ID:"+data.userId;
        Label_time.string = this.formartTimeStr(data.payBindTime,true);
    },

    initClubItemData:function(widget,data){
        var clubName = ccui.helper.seekWidgetByName(widget,"clubName");
        var clubID = ccui.helper.seekWidgetByName(widget,"clubID");
        var playerName = ccui.helper.seekWidgetByName(widget,"playerName");
        var playerID = ccui.helper.seekWidgetByName(widget,"playerID");
        var count = ccui.helper.seekWidgetByName(widget,"count");

        clubName.string = data.name;
        clubID.string = "ID:"+data.createdUser;
        playerName.string = data.groupName;
        playerID.string = "ID:"+data.groupId;
        count.string = "" + Number(data.totalPay) / 100;
    },

    initList:function(widget,data,isPlayer){
        var list = ccui.helper.seekWidgetByName(widget,"ListView_List");
        var itemTemp = ccui.helper.seekWidgetByName(widget,"Image_item");
        itemTemp.visible = false;

        list.removeAllChildren();

        data = data || [];

        var count = 0;

        for(var i = 0;i < data.length;++i){
            var Image_item = ccui.helper.seekWidgetByName(list,"Image_item"+i);
            if(!Image_item){
                Image_item = itemTemp.clone();
                Image_item.setName("Image_item" + i);
                list.pushBackCustomItem(Image_item);

                if(isPlayer){
                    var Button_click = ccui.helper.seekWidgetByName(Image_item,"Button_click");
                    Button_click.tempData = data[i];
                    UITools.addClickEvent(Button_click,this,this.onItemClick);

                    Button_click.setBright(data[i].isCreateGroup == 0);
                    Button_click.setEnabled(data[i].isCreateGroup == 0);
                }else{
                    count += data[i].totalPay;
                }
            }
            Image_item.visible = true;
            if(isPlayer){
                this.initPlayerItemData(Image_item,data[i]);
            }else{
                this.initClubItemData(Image_item,data[i]);
            }
        }

        if(!isPlayer){
            this.Label_count.string = "总计钻石消耗:" + count;
        }

        this.Label_noData.visible = data.length == 0 && !this.Image_changeClubID.visible;
    },

    onClickSearch:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        this.getClubData();
    },

    onClickChangeTime:function(){
        var beginTime = this.getLocalItem("sy_dn_beginTime") || 0;
        var endTime = this.getLocalItem("sy_dn_endTime") || 0;
        var mc = new ClubChoiceTimePop(this , beginTime , endTime,3);
        PopupManager.addPopup(mc);
    },

    changeSearchTime:function(event){
        var data = event.getUserData();
        var beginTime = this.formartTimeStr(data.beginTime);
        var endTime = this.formartTimeStr(data.endTime);

        this.label_begin.setString(beginTime);
        this.label_end.setString(endTime);

        cc.sys.localStorage.setItem("sy_dn_beginTime",(beginTime));
        cc.sys.localStorage.setItem("sy_dn_endTime",(endTime));
    },

    formartTimeStr:function(shijianchuo,isAdd){
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        m = m < 10 ? "0" + m : "" + m;
        var d = time.getDate();
        d = d < 10 ? "0" + d : "" + d;
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        var result = y+m+d;
        if(isAdd){
            result = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
        }
        return result;
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    onClose:function(){
       PopupManager.remove(this);
    },
});