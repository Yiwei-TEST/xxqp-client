/**
 * Created by cyp on 2019/3/14.
 */

var BjdCreateRuleConfig = {
    CSMJ:{ruleConfig:[
        {title:"局数",type:1,content:["8局","16局","32局"]},
        {title:"玩法",type:2,content:["假将胡","步步高","金童玉女","三同","一枝花","中途六六顺","中途四喜"]},
        {title:"人数",type:1,content:["4人","3人","2人"]},
        {title:"坐飘",type:1,content:["不飘","一飘二","二飘五","五飘十"]},
        {title:"可选",type:1,content:["抓鸟乘法","抓鸟加法","抓鸟加一番"]}
    ],defaultConfig:[[0],[0,1,2],[0],[0],[1]]},
    ZZMJ:{ruleConfig:[
        {title:"局数",type:1,content:["8局","16局","32局"]},
        {title:"玩法",type:2,content:["假将胡","步步高","金童玉女","三同","一枝花","中途六六顺","中途四喜"]},
        {title:"人数",type:1,content:["4人","3人","2人"]},
        {title:"坐飘",type:1,content:["不飘","一飘二","二飘五","五飘十"]},
        {title:"可选",type:1,content:["抓鸟乘法","抓鸟加法","抓鸟加一番"]}
    ],defaultConfig:[[0],[0,1,2],[0],[0],[1]]},
    HZMJ:{ruleConfig:[
        {title:"局数",type:1,content:["8局","16局","32局"]},
        {title:"玩法",type:2,content:["假将胡","步步高","金童玉女","三同","一枝花","中途六六顺","中途四喜"]},
        {title:"人数",type:1,content:["4人","3人","2人"]},
        {title:"坐飘",type:1,content:["不飘","一飘二","二飘五","五飘十"]},
        {title:"可选",type:1,content:["抓鸟乘法","抓鸟加法","抓鸟加一番"]}
    ],defaultConfig:[[0],[0,1,2],[0],[0],[1]]},
    BSMJ:{ruleConfig:[
        {title:"局数选择",type:1,content:["8局","12局","26局"]},
        {title:"房费",type:1,content:["AA支付","房主支付"]},
        {title:"人数选择",type:1,content:["4人","3人","2人"]},
        {title:"玩法",type:2,content:["有风","一条龙","四归一","来门报听"]},
        {title:"买点",type:2,content:["买死点上限1","买死点上限2","买活点上限1","买活点上限2","买活点固定1","查叫"]},
    ],defaultConfig:[[0],[0],[0],[],[]]},
    SYMJ:{ruleConfig:[
        {title:"局数选择",type:1,content:["8局","12局","16局"]},
        {title:"房费",type:1,content:["AA支付","房主支付"]},
        {title:"人数选择",type:1,content:["4人","3人","2人"]},
        {title:"可选",type:2,content:["带风","加锤","可以吃","清一色可吃","可抢公杠胡","可胡放杠胡","抢杠胡包三家","点杠三家付","点杠杠开包三家","杠后炮三家付"]},
        {title:"抓鸟",type:2,content:["不抓鸟","抓2鸟","抓4鸟","抓6鸟"]},
    ],defaultConfig:[[0],[0],[0],[],[0]]},
    PDK:{ruleConfig:[
        {title:"局数",type:1,content:["8局","16局","32局"]},
        {title:"玩法",type:2,content:["假将胡","步步高","金童玉女","三同","一枝花","中途六六顺","中途四喜"]},
        {title:"人数",type:1,content:["4人","3人","2人"]},
        {title:"坐飘",type:1,content:["不飘","一飘二","二飘五","五飘十"]},
        {title:"可选",type:1,content:["抓鸟乘法","抓鸟加法","抓鸟加一番"]}
    ],defaultConfig:[[0],[0,1,2],[0],[0],[1]]},
    CDPHZ:{ruleConfig:[
        {title:"局数",type:1,content:["8局","16局","32局"]},
        {title:"玩法",type:2,content:["假将胡","步步高","金童玉女","三同","一枝花","中途六六顺","中途四喜"]},
        {title:"人数",type:1,content:["4人","3人","2人"]},
        {title:"坐飘",type:1,content:["不飘","一飘二","二飘五","五飘十"]},
        {title:"可选",type:1,content:["抓鸟乘法","抓鸟加法","抓鸟加一番"]}
    ],defaultConfig:[[0],[0,1,2],[0],[0],[1]]},
    LDFPF:{ruleConfig:[
        {title:"房费",type:1,content:["AA支付","房主支付"],col:3}, //0
        {title:"人数选择",type:1,content:["3人","2人"],col:3},//1
        {title:"单局封顶",type:1,content:["200息","400息"],col:3},//2
        {title:"起胡胡息",type:1,content:["六胡起胡","十胡起胡","十五胡起胡"],col:3},//3
        {title:"可选玩法",type:2,content:["首局随机庄家","飘胡","可托管","放炮必胡"],col:3},//4
        {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//5
        {title:"选择打鸟",type:1,content:["不打鸟","胡息打鸟","分数打鸟","局内打鸟"],col:3},//6
        {title:"加倍",type:1,content:["不加倍","加倍"]},//7
        {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//8
        {title:"翻倍上限",type:1,content:["小于20分","小于30分","小于40分","小于50分"]}//9
    ],defaultConfig:[[1],[1],[0],[2],[3],[0],[0],[0],[0],[0]]},
}


var RuleSelectBase = cc.Layer.extend({
    gameType:"CSMJ",
    createRoomLayer:null,
    ctor:function(gameType,createLayer){
        this._super();

        this.gameType = gameType || "CSMJ";
        this.createRoomLayer = createLayer;

        if(this.setConfigData()){
            this.getRuleDataFromLocal();
            this.initLayer();
        }
    },

    setConfigData:function(){
        if(BjdCreateRuleConfig[this.gameType]){
            this.ruleConfig = BjdCreateRuleConfig[this.gameType].ruleConfig;
            this.defaultConfig = BjdCreateRuleConfig[this.gameType].defaultConfig;
            return true;
        }
        cc.log("==========请设置玩法规则配置===================");
        return false;
    },

    saveRuleDataToLocal:function(){
        var ruleData = this.getRuleDataFromSelect();
        var jsonStr = JSON.stringify(ruleData);
        cc.log("============saveRuleDataToLocal===========:" + jsonStr);
        cc.sys.localStorage.setItem("sy_rule_select_" + this.gameType,jsonStr);
    },

    getRuleDataFromLocal:function(){

        if(this.createRoomLayer.clubData)return;

        var jsonStr = cc.sys.localStorage.getItem("sy_rule_select_" + this.gameType);

        if(jsonStr){
            var ruleData = JSON.parse(jsonStr);
            var tempData = [];
            for(var i = 0;i<ruleData.length;++i){
                var temp = [];
                for(var j = 0;j<ruleData[i].length;++j){
                    if(ruleData[i][j] == 1){
                        temp.push(j);
                    }
                }
                tempData.push(temp);
            }
            // cc.log("tempData =",JSON.stringify(tempData));
            // cc.log("this.defaultConfig =",JSON.stringify(this.defaultConfig));
            //添加玩法增加了新的一行后，原本的玩法配置无法正常初始化界面，直接使用初始值
            if (tempData.length == this.defaultConfig.length)
                this.defaultConfig = tempData;
        }
    },

    getRuleDataFromSelect:function() {
        var ruleData = [];
        for(var i = 0;i<this.layoutArr.length;++i){
            var rule = [];
            for(var j = 0;j<this.layoutArr[i].itemArr.length;++j){
                rule.push(this.layoutArr[i].itemArr[j].isSelected()?1:0);
            }
            ruleData.push(rule);
        }
        return ruleData;
    },

    //获取用于创建房间的传给服务端的数据
    getSocketRuleData:function(){
        return {params:[],strParams:""};
    },

    getItemByName:function(name){
        for(var i = 0;i<this.layoutArr.length;++i){
            for(var j = 0;j<this.layoutArr[i].itemArr.length;++j){
                if(this.layoutArr[i].itemArr[j].getName() == name){
                    return this.layoutArr[i].itemArr[j];
                }
            }
        }
        return null;
    },

    getItemByIdx:function(row,col){
        var item = null;
        if(this.layoutArr[row] && this.layoutArr[row].itemArr[col]){
            item = this.layoutArr[row].itemArr[col];
        }
        return item;
    },

    getLayoutByIdx: function (row) {
        var layout = null;
        if(this.layoutArr[row]){
            layout = this.layoutArr[row];
        }
        return layout;
    },

    initLayer:function(){
        this.scrollView = new ccui.ScrollView();
        this.scrollView.setContentSize(1400,650);
        this.scrollView.setInnerContainerSize(this.scrollView.getContentSize());
        this.scrollView.setPosition(cc.winSize.width/2 - 440,270);
        this.addChild(this.scrollView);

        this.layoutArr = [];

        var contentH = 0;
        for(var i = 0;i<this.ruleConfig.length;++i){
            var layout = new SelectLayout(this.ruleConfig[i].title,this.ruleConfig[i].type,this.ruleConfig[i].col);
            layout.setTag(i*100);
            var height = layout.showItemList(this.ruleConfig[i].content);
            layout.setChangeHandel(this.changeHandle.bind(this));

            layout.setDefault(this.defaultConfig[i]);

            layout.tempHeight = height;
            contentH += height;
            this.scrollView.addChild(layout);

            this.layoutArr.push(layout);
        }

        contentH = Math.max(this.scrollView.height,contentH);
        this.scrollView.setInnerContainerSize(cc.size(this.scrollView.width,contentH));

        var startY = contentH;
        if(contentH > this.scrollView.height)this.scrollView.setBounceEnabled(true);
        for(var i = 0;i<this.layoutArr.length;++i){
            this.layoutArr[i].setPosition(65,startY - this.layoutArr[i].tempHeight/2);
            if(i > 0){
                var line = new cc.Sprite("res/ui/createRoom/createroom_img_line.png");
                line.setPosition(this.scrollView.width/2 - this.layoutArr[i].x-30,this.layoutArr[i].tempHeight/2);
                this.layoutArr[i].addChild(line);
            }
            startY -= this.layoutArr[i].tempHeight;
        }

    },

    //跟据是否隐藏一些选项，调整界面显示
    updateLayout:function(){
        var contentH = 0;
        for(var i = 0;i<this.layoutArr.length;++i){
            if(this.layoutArr[i].isVisible()){
                contentH += this.layoutArr[i].tempHeight;
            }
        }
        var contentH = Math.max(this.scrollView.height,contentH);
        this.scrollView.setInnerContainerSize(cc.size(this.scrollView.width,contentH));

        var startY = contentH;
        for(var i = 0;i<this.layoutArr.length;++i){
            if(this.layoutArr[i].isVisible()){
                this.layoutArr[i].setPositionY(startY - this.layoutArr[i].tempHeight/2);
                startY -= this.layoutArr[i].tempHeight;
            }
        }
    },

    onShow:function(){

    },

    changeHandle:function(item){

    },


});

var SelectLayout = ccui.Widget.extend({
    layoutType:1,//1--单选布局，2--多选布局
    titleStr:"",//标题文字
    listNum:4,//每行布局多少选择项

    ctor:function(titleStr,type,listNum){
        this._super();

        this.titleStr = titleStr || "";
        this.layoutType = type || 1;
        this.listNum = listNum || 4;

        this.initWidget();

    },

    initWidget:function(){
        this.titleLabel = UICtor.cLabel(this.titleStr,45,null,cc.color("#ad6b57"));
        this.addChild(this.titleLabel);
        this.titleLabel.x = 50

        this.itemContent = new ccui.Widget();
        this.addChild(this.itemContent,1);
    },

    showItemList:function(listArr){
        this.itemContent.removeAllChildren();
        this.itemArr = [];

        var lineNum = 1;

        var temp = 0;
        for(var i = 0;i<listArr.length;++i){
            if(temp == this.listNum || listArr[i][0] == "\n"){
                temp = 0;lineNum++;
            }
            temp++;
        }

        var itemSpaceH = this.itemSpaceH = 100;
        var startY = itemSpaceH*(lineNum-1)/2;

        var row = 0;var col = 0;
        for(var i = 0;i<listArr.length;++i){

            if(listArr[i][0] == "\n"){//配置换行，处理选项过长的显示问题
                col = 0;row++;
                listArr[i] = listArr[i].replace("\n","");
            }

            var item = new SelectBox(this.layoutType,listArr[i]);
            item.x = 200 + (1160/this.listNum)*(col);
            item.y = startY - itemSpaceH*row;
            item.setName(listArr[i]);
            item.setTag(this.getTag() + i);
            this.itemContent.addChild(item);
            item.addChangeCb(this,this.onStateChange);

            this.itemArr.push(item);

            col++;
            if(col == this.listNum){
                row++;col = 0;
            }
        }
        return lineNum*itemSpaceH;
    },

    setDefault:function(idxArr){
        if(idxArr && idxArr.length > 0){
            for(var i = 0;i<idxArr.length;++i){
                this.itemArr[idxArr[i]] && this.itemArr[idxArr[i]].setSelected(true);
            }
        }
    },

    setChangeHandel:function(cb){
        this.changeHandle = cb;
    },

    onStateChange:function(item){
        if(this.layoutType == 1){
            for(var i = 0;i<this.itemArr.length;++i){
                if(this.itemArr[i] != item){
                    this.itemArr[i].setSelected(false);
                }
            }
        }

        if(this.changeHandle){
            this.changeHandle(item);
        }
    }

});

var SelectBox = ccui.Widget.extend({
    selectType:1,//1--单选框，2--复选框
    labelStr:"",//选项框文字
    changeTarget:null,
    changeCb:null,
    ctor:function(type,labelStr){
        this._super();

        this.selectType = type;
        this.labelStr = labelStr;

        this.initWidget();
    },

    addChangeCb:function(target,cb){
        this.changeTarget = target;
        this.changeCb = cb;
    },

    setItemState:function(flag){
        if(!flag && this.isSelected()){
            this.isShow = "1";
            this.setSelected(false);
        }

        if(flag && !this.isSelected() && this.isShow == "1"){
            this.setSelected(true);
            this.isShow = null;
        }

        this.checkBox.setTouchEnabled(flag);
        this.itemBtn.setTouchEnabled(flag);

        this.itemLabel.setOpacity(flag?255:50);
        this.checkBox.setOpacity(flag?255:50);

    },

    setItemEnable:function(flag){
        this.checkBox.setTouchEnabled(flag);
        this.itemBtn.setTouchEnabled(flag);

        this.itemLabel.setOpacity(flag?255:50);
        this.checkBox.setOpacity(flag?255:50);
    },

    initWidget:function(){
        var resFile1 = "res/ui/createRoom/createroom_btn_fang_2.png";
        var resFile2 = "res/ui/createRoom/createroom_btn_yuan_2.png";
        if(this.selectType == 1){
            this.checkBox = new ccui.CheckBox(resFile2,resFile2,resFile2.replace(/2/,"1"),null,null,ccui.Widget.LOCAL_TEXTURE);
        }else{
            this.checkBox = new ccui.CheckBox(resFile1,resFile1,resFile1.replace(/2/,"1"),null,null,ccui.Widget.LOCAL_TEXTURE);
            this.checkBox.y = 2;
            this.checkBox.x = 4;
        }
        this.checkBox.addEventListener(this.onClickBox,this);
        this.addChild(this.checkBox);

        this.itemLabel = UICtor.cLabel(this.labelStr,38,null,cc.color(116,102,65));
        this.itemLabel.setAnchorPoint(0,0.5);
        this.itemLabel.setPosition(50,0);
        this.addChild(this.itemLabel);

        var img = "res/ui/bjdmj/popup/light_touming.png";
        var itemBtn = ccui.Button(img,img,"");
        itemBtn.ignoreAnchorPointForPosition(false);
        itemBtn.ignoreContentAdaptWithSize(false);
        itemBtn.setScale9Enabled(true);
        itemBtn.setAnchorPoint(0,0.5);
        itemBtn.setContentSize(cc.size(160,40));
        itemBtn.setPosition(30,0);
        itemBtn.addClickEventListener(this.onClickBtn.bind(this));
        this.addChild(itemBtn);

        this.itemBtn = itemBtn;

    },

    onClickBox:function(target,type){
        if(type == ccui.CheckBox.EVENT_SELECTED){

        }else if(type == ccui.CheckBox.EVENT_UNSELECTED){
            if(this.selectType == 1){
                this.checkBox.setSelected(true);
            }
        }
        if((this.selectType == 1 && type == ccui.CheckBox.EVENT_SELECTED) || this.selectType == 2){
            this.changeCb && this.changeCb.call(this.changeTarget,this);
        }
        this.setLabelColor();
    },

    onClickBtn:function(){
        if(this.selectType == 1 ){
            if(!this.checkBox.isSelected()){
                this.checkBox.setSelected(true);
                this.changeCb && this.changeCb.call(this.changeTarget,this);
            }
        }else{
            this.checkBox.setSelected(!this.checkBox.isSelected());
            this.changeCb && this.changeCb.call(this.changeTarget,this);
        }
        this.setLabelColor();
    },

    setSelected:function(flag){
        this.checkBox.setSelected(flag);
        this.setLabelColor();
    },

    isSelected:function(){
        return this.checkBox.isSelected();
    },

    setLabelColor:function(){
        var color = cc.color(116,102,65);
        if(this.checkBox.isSelected()){
           color = cc.color(212,59,43);
        }
        this.itemLabel.setColor(color);
    },

    setLabelString:function(Name){
        this.itemLabel.setString(Name);
    },

});

var changeEditBox = ccui.Widget.extend({
    labelStr:[],//显示文字（格式 “改变” + 值 + “xxx”）
    addButton:null,//增加按钮
    reduceButton:null,//减少按钮
    changeVal:0,//增加或减少的值
    minVal:1,//最小值
    maxVal:100,//最大值
    localScore:10,//当前值显示
    showLabel:null,//显示文字

    ctor:function(labelStr,changeVal,minVal,maxVal){
        this._super();

        this.labelStr = labelStr;
        this.changeVal = changeVal;
        this.minVal = minVal || 1;
        this.maxVal = maxVal || 100;

        this.initWidget();
    },

    initWidget:function () {

        var BoxBg = new cc.Scale9Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        BoxBg.setAnchorPoint(0,0.5);
        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,-4);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        this.reduceButton = reduceBtn;

        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setAnchorPoint(0,0);

        addBtn.setPosition(BoxBg.width-addBtn.width+5,-4);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);
        this.addButton = addBtn;

        UITools.addClickEvent(reduceBtn,this,this.onChangeClick);
        UITools.addClickEvent(addBtn,this,this.onChangeClick);

        var str = (this.labelStr[0] || "") + (this.labelStr[1]||"") + (this.labelStr[2]||"");
        this.localScore = parseInt(this.labelStr[1] + "");
        var scoreLabel = this.showLabel = UICtor.cLabel(str,38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        this.itemBox = BoxBg;
        this.itemBox.visible = true;
        this.addChild(BoxBg);
    },

    onChangeClick:function(render) {
        var temp = parseInt(render.temp);
        var num = this.localScore;

        if (temp == 1){
            num = num - this.changeVal;
        }else{
            num = num + this.changeVal;
        }

        if (num && num >= this.minVal && num <= this.maxVal){
            this.localScore = num;
        }else if ( num < 1){
            this.localScore = this.minVal;
        }
        // cc.log("this.addBoxScore =",this.addBoxScore);
        var str = (this.labelStr[0] || "") + (this.localScore||"") + (this.labelStr[2]||"");
        this.showLabel.setString(str);
    },

    setWidgetPosition:function(x,y){
        this.itemBox.setPosition(x,y);
    },

    setScoreLabel:function(num){
        this.localScore = num;
        var str = (this.labelStr[0] || "") + num + (this.labelStr[2]||"");
        this.showLabel.setString(str);
    },

    setTouchEnable:function(isOpen){
        this.addButton.setEnabled(!!isOpen);
        this.reduceButton.setEnabled(!!isOpen);
        this.itemBox.setOpacity(!!isOpen ? 255 : 150);
    },

});