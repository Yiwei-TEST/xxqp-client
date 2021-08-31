var ZsjlLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        this.beginTime = this.endTime = new Date();

        this.curPage = 1;

        SyEventManager.addEventListener(SyEvent.RESET_TIME, this, this.changeSearchTime);
        SyEventManager.addEventListener("Zszs_Back", this, this.onMsgBack);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
    },

    onEnterTransitionDidFinish:function(){
        this._super();
        this.getRecordData(1);
    },

    getRecordData:function(page,userId){
        userId = userId || -1;

        var b = this.getTimeStr(this.beginTime);
        var e = this.getTimeStr(this.endTime);

        sySocket.sendComReqMsg(1111,[5,page,Number(userId)],[b,e]);
    },

    onMsgBack:function(event){
        var msg = event.getUserData();

        if(msg.params[0] == 3){
            var data = msg.strParams[0];
            if(data){
                data = JSON.parse(data);

                var page = msg.params[1];
                if(data.length > 0){
                    this.curPage = page;
                    this.label_page.setString(this.curPage);
                    this.label_no_data.setVisible(false);

                    this.updateScrollItem(data);
                }else{
                    if(page == 1){
                        this.label_no_data.setVisible(true);
                        this.updateScrollItem([]);
                    }else{
                        FloatLabelUtil.comText("没有更多数据了");
                    }
                }

            }
        }
    },

    getTimeStr:function(date){
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        return year + "-" + month + "-" + day;
    },

    initLayer:function(){
        this.layerBg = new cc.Sprite("res/ui/zszs/bg_zsjl.png");
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.layerBg);

        var title = new cc.Sprite("res/ui/zszs/title_zsjl.png");
        title.setPosition(this.layerBg.width/2,this.layerBg.height - 45);
        this.layerBg.addChild(title);

        var img = "res/ui/bjdmj/popup/x.png";
        this.btn_close = new ccui.Button(img,img,"");
        this.btn_close.setPosition(this.layerBg.width - 45,this.layerBg.height - 45);
        this.btn_close.addTouchEventListener(this.onClickBtn,this);
        this.layerBg.addChild(this.btn_close,1);

        var dateBg = new cc.Sprite("res/ui/zszs/bg_date.png");
        dateBg.setAnchorPoint(0,0.5);
        dateBg.setPosition(50,this.layerBg.height - 144);
        this.layerBg.addChild(dateBg);

        var img = "res/ui/bjdmj/popup/light_touming.png";
        this.btn_change_date = new ccui.Button(img,img,"");
        this.btn_change_date.ignoreContentAdaptWithSize(false);
        this.btn_change_date.setContentSize(dateBg.width,dateBg.height);
        this.btn_change_date.setPosition(dateBg.width/2,dateBg.height/2);
        this.btn_change_date.addTouchEventListener(this.onClickBtn,this);
        dateBg.addChild(this.btn_change_date);

        this.label_date = new ccui.Text("10月26日-10月26日","res/font/bjdmj/fznt.ttf",42);
        this.label_date.setPosition(dateBg.width/2 + 30,dateBg.height/2);
        dateBg.addChild(this.label_date);

        this.label_date.setString(UITools.formatTime(this.beginTime) + "-" + UITools.formatTime(this.endTime));

        var txtArr = ["赠送人","被赠送人","赠送数量","时间"];

        var offsetX = 300;
        var startX = this.layerBg.width/2 - (txtArr.length - 1)/2*offsetX;
        for(var i = 0;i<txtArr.length;++i){
            var txt = new ccui.Text(txtArr[i],"res/font/bjdmj/fznt.ttf",45);
            txt.setPosition(startX + offsetX*i,this.layerBg.height - 240);
            this.layerBg.addChild(txt);
        }

        var inputbg = new cc.Sprite("res/ui/zszs/bg_input_2.png");
        inputbg.setPosition(this.layerBg.width/2 + 150,85);
        this.layerBg.addChild(inputbg);

        this.inputId = new cc.EditBox(cc.size(inputbg.width - 20, inputbg.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputId.setPosition(inputbg.width/2,inputbg.height/2);
        this.inputId.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputId.setMaxLength(9);
        this.inputId.setFont("Arial",45);
        this.inputId.setDelegate(this);
        this.inputId.setPlaceHolder("输入玩家ID");
        this.inputId.setPlaceholderFont("Arial" ,45);
        inputbg.addChild(this.inputId,1);

        var img = "res/ui/zszs/btn_cbzsr.png";
        this.btn_cbzsr = new ccui.Button(img,img,"");
        this.btn_cbzsr.setPosition(this.layerBg.width - 170,80);
        this.btn_cbzsr.addTouchEventListener(this.onClickBtn,this);
        this.layerBg.addChild(this.btn_cbzsr,1);

        var page_bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/inputbg.png");
        page_bg.setContentSize(100,80);
        page_bg.setPosition(200,85);
        this.layerBg.addChild(page_bg);

        this.label_page = new cc.LabelTTF("1","Arial",54);
        this.label_page.setPosition(page_bg.width/2,page_bg.height/2);
        page_bg.addChild(this.label_page);

        var img = "res/ui/bjdmj/popup/pyq/xiaozu/zuo1.png";
        this.btn_left = new ccui.Button(img,img,"");
        this.btn_left.setPosition(page_bg.width/2 - 100,page_bg.height/2);
        this.btn_left.addTouchEventListener(this.onClickBtn,this);
        page_bg.addChild(this.btn_left);

        var img = "res/ui/bjdmj/popup/pyq/xiaozu/you1.png";
        this.btn_right = new ccui.Button(img,img,"");
        this.btn_right.setPosition(page_bg.width/2 + 100,page_bg.height/2);
        this.btn_right.addTouchEventListener(this.onClickBtn,this);
        page_bg.addChild(this.btn_right);

        this.scrollView = new ccui.ScrollView();
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setContentSize(this.layerBg.width,420);
        this.scrollView.setPosition(0,160);
        this.layerBg.addChild(this.scrollView,1);

        this.label_no_data = new ccui.Text("暂无数据","res/font/bjdmj/fznt.ttf",45);
        this.label_no_data.setPosition(this.layerBg.width/2,this.layerBg.height/2 - 30);
        this.label_no_data.setVisible(false);
        this.layerBg.addChild(this.label_no_data);

    },

    updateScrollItem:function(data){
        this.scrollView.removeAllChildren();

        var num = data.length;
        var itemH = 125;
        var contentH = Math.max(this.scrollView.height,itemH*num);
        this.scrollView.setInnerContainerSize(cc.size(this.scrollView.width,contentH));

        for(var i = 0;i<num;++i){
            var item = new ZsjlItem();
            item.setItemWithData(data[i]);
            item.setPosition(this.scrollView.width/2,contentH - (i+0.5)*itemH);
            this.scrollView.addChild(item);
        }
    },

    changeSearchTime:function(event){
        var data = event.getUserData();

        this.beginTime = new Date(data.beginTime);
        this.endTime = new Date(data.endTime);

        this.label_date.setString(UITools.formatTime(this.beginTime) + "-" + UITools.formatTime(this.endTime));

        this.getRecordData(this.curPage,this.inputId.getString());
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                PopupManager.remove(this);
            }else if(sender == this.btn_change_date){
                var mc = new ClubChoiceTimePop(this,this.beginTime,this.endTime,3);
                PopupManager.addPopup(mc);
            }else if(sender == this.btn_cbzsr){
                var userId = this.inputId.getString();
                this.getRecordData(1,userId);
            }else if(sender == this.btn_left){
                var userId = this.inputId.getString();

                if(this.curPage > 1){
                    this.getRecordData(this.curPage - 1,userId);
                }

            }else if(sender == this.btn_right){
                var userId = this.inputId.getString();
                this.getRecordData(this.curPage + 1,userId);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    editBoxTextChanged: function (sender, text) {
        if(!text)return;

        var last = text.substring(text.length - 1, text.length);
        var num = last.charCodeAt();
        if (num < 48 || num > 57) {
            last = text.substring(0, text.length - 1);
            sender.setString(last);
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});

var ZsjlItem = cc.Node.extend({
    ctor:function(){
        this._super();

        this.initNode();
    },

    initNode:function(){
        this.itembg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/tiao.png");
        this.itembg.setContentSize(1240,120);
        this.addChild(this.itembg);

        this.labelArr = [];

        var txtArr = ["玩家的名字\nID:1234567","玩家的名字\nID:1234567","9999","2020/12/29\n12:12"];

        var offsetX = 300;
        var startX = this.itembg.width/2 - (txtArr.length - 1)/2*offsetX;
        for(var i = 0;i<txtArr.length;++i){
            var txt = new ccui.Text(txtArr[i],"res/font/bjdmj/fznt.ttf",42);
            txt.setColor(cc.color("#b37e5d"));
            txt.setPosition(startX + offsetX*i,this.itembg.height/2);
            txt.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.itembg.addChild(txt);
            this.labelArr.push(txt);
        }
    },

    setItemWithData:function(data){
        var sendName = UITools.truncateLabel(data.sendName,5);
        var sendId = data.sendUserid;
        var acceptName = UITools.truncateLabel(data.acceptName,5);
        var acceptId = data.acceptUserid;
        var num = data.diamondNum;
        var time = data.sendTime;

        var strArr = [];

        strArr.push(sendName + "\nID:" + sendId);
        strArr.push(acceptName + "\nID:" + acceptId);
        strArr.push(num);
        strArr.push(this.getTimeStr(time));

        for(var i = 0;i<this.labelArr.length;++i){
            var label = this.labelArr[i];
            label.setString(strArr[i]);
        }
    },

    getTimeStr:function(time){
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        if(month < 10) month = "0" + month;
        if(day < 10) day = "0" + day;
        if(hour < 10) hour = "0" + hour;
        if(min < 10) min = "0" + min;
        if(sec < 10) sec = "0" + sec;

        return year + "/" + month + "/" + day + "\n" + hour + ":" + min + ":" + sec;
    },
});