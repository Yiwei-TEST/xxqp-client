/**
 * Created by cyp on 2019/8/3.
 */
var RuleSelect_YZCHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(12);
        this.createQjfdNumBox(9);
        this.createChangeScoreBox(14);//创建低于xx分加xx分
        this.getItemByIdx(14,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();

    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数",type:1,content:["1局","6局","8局","10局","12局"],col:4},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数",type:1,content:["3人","2人"],col:3},//2
            {title:"选王",type:1,content:["无王","单王","双王","三王","四王"],col:3},//3
            {title:"醒",type:1,content:["跟醒","翻醒"],col:3},//4
            {title:"玩法",type:2,content:["双醒","红转朱黑"],col:3},//5
            {title:"胡息",type:1,content:["15胡起胡","18胡起胡","21胡起胡"],col:3},//6
            {title:"限胡",type:1,content:["不限胡","按王限胡","按番限胡"],col:3},//7
            {title:"单局封顶",type:1,content:["不封顶","300封顶","600封顶","800封顶"]},//8
            {title:"全局封顶",type:2,content:["全局封顶"]},//9
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//10
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//11
            {title:"加倍",type:1,content:["不加倍","加倍"]},//12
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//13
            {title:"加分",type:2,content:["低于"]},//14
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[],[0],[0],[0],[],[0],[1],[0],[0],[]];
        this.dScore = parseInt(cc.sys.localStorage.getItem("YZCHZ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("YZCHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("YZCHZ_allowBoxScore")) || 10;/** 低于xx分 **/

        this.qjfdScore = parseInt(cc.sys.localStorage.getItem("YZCHZ_qjfdScore")) || 500;

        if(this.createRoomLayer.clubData){

            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[1].content = ["群主支付"];
                this.defaultConfig[1][0] = 0;
            }
            if(ClickClubModel.getClubIsGold()){
                this.ruleConfig[1].content = ["白金豆AA支付"];
                this.defaultConfig[1][0] = 0;
            }

            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == GameTypeEunmZP.YZCHZ){
                this.readSelectData(params);
            }
        }

        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    createChangeScoreBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.addNumBox = new changeEditBox(["",10,"分"],1);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.addNumBox.setWidgetPosition(850,0);//设置位置
        this.addNumBox.setScoreLabel(this.addScore);//设置初始值
        this.layoutArr[row].addChild(this.addNumBox);

        this.addLabel = UICtor.cLabel("加",38,null,cc.color(126,49,2));
        this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",10,"分"],1);
        this.allowNumBox.setWidgetPosition(380,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();

    },

    updateItemShow:function(){
        this.getLayoutByIdx(12).visible = false;
        this.getLayoutByIdx(13).visible = false;

        var is2ren = false;
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[12].setVisible(true);
            if(this.getItemByIdx(12,0).isSelected()){
                this.layoutArr[13].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[13].setVisible(true);
                this.numBox.visible=true;

            }
            is2ren = true;
            this.layoutArr[14].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(14,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[12].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[14].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        var istg = !this.getItemByIdx(10,0).isSelected();
        this.layoutArr[11].setVisible(istg);
        this.getItemByIdx(11,0).setItemState(istg);
        this.getItemByIdx(11,1).setItemState(istg);
        this.getItemByIdx(11,2).setItemState(istg);

        for(var i = 0;i<1;++i){
            this.getItemByIdx(9,i).setItemState(is2ren);
        }
        this.numBoxQjfd.setVisible(is2ren && this.getItemByIdx(9,0).isSelected());

        this.getItemByIdx(6,1).setItemState(is2ren);
        this.getItemByIdx(6,2).setItemState(is2ren);
        if(is2ren){
            if(this.getItemByIdx(6,1).isSelected() || this.getItemByIdx(6,2).isSelected()){
                this.getItemByIdx(6,0).setSelected(false);
            }
        }else{
            this.getItemByIdx(6,0).setSelected(true);
        }

        var siwang = this.getItemByIdx(3,4).isSelected();
        this.getItemByIdx(7,1).setItemState(siwang);
        this.getItemByIdx(7,2).setItemState(siwang);
        if(siwang){
            if(this.getItemByIdx(7,1).isSelected() || this.getItemByIdx(7,2).isSelected()){
                this.getItemByIdx(7,0).setSelected(false);
            }
        }else{
            this.getItemByIdx(7,0).setSelected(true);
        }
    },

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 400 + (788/(this.layoutArr[row].itemArr.length));

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,-4);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(BoxBg.width-addBtn.width+5,-4);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);
        //cc.log("this.dScore =",this.dScore);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.dScore+"分",38,null,cc.color(126,49,2));
        //scoreLabel.setAnchorPoint(0.5,0.5);
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.dScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num <= 100){
            this.dScore = num;
        }
        // cc.log("this.dScore =",this.dScore);
        this.scoreLabel.setString("小于"+ this.dScore + "分");
    },

    createQjfdNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 500;

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-reduceBtn.width/2,-4);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(BoxBg.width-addBtn.width/2,-4);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);
        cc.log("this.dScore =",this.qjfdScore);

        var scoreLabel = this.qjfdScoreLabel = UICtor.cLabel(this.qjfdScore+"分封顶",38,null,cc.color(126,49,2));
        //scoreLabel.setAnchorPoint(0.5,0.5);
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeQjfdScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeQjfdScoreClick);

        this.numBoxQjfd = BoxBg;
        this.numBoxQjfd.visible = false;
    },

    onChangeQjfdScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.qjfdScore;

        if (temp == 1){
            num = num - 100;
        }else{
            num = num + 100;
        }

        if (num && num >= 500 && num <= 5000){
            this.qjfdScore = num;
        }
        // cc.log("this.dScore =",this.dScore);
        this.qjfdScoreLabel.setString(this.qjfdScore + "分封顶");
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 0;
        var zsNumArr = [1,4,5,6,8];
        var renshu = 3;
        var temp = 0;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        for(var i = 0;i<5;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = zsNumArr[temp];
        }else{
            if(this.getItemByIdx(1,0).isSelected()){
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp];
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<5;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:1000,3:1000,4:1000},{2:2500,3:1700,4:1300},{2:3000,3:2000,4:1500},{2:3000,3:2000,4:1500},{2:4500,3:3000,4:2300}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }
        var costWay = 1;

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected())jushu = 6;
        if(this.getItemByIdx(0,2).isSelected())jushu = 8;
        if(this.getItemByIdx(0,3).isSelected())jushu = 10;
        if(this.getItemByIdx(0,4).isSelected())jushu = 12;

        var xuangwang = 0;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                xuangwang = i;
            }
        }

        var xing = 0;
        if(this.getItemByIdx(4,1).isSelected())xing = 1;

        var shuangxing = 0;
        if(this.getItemByIdx(5,0).isSelected())shuangxing = 1;

        var xianhu = 0;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                xianhu = i;
            }
        }

        var huxi = 15;
        if(this.getItemByIdx(6,1).isSelected())huxi = 18;
        if(this.getItemByIdx(6,2).isSelected())huxi = 21;

        var hzzh = 0;
        if(this.getItemByIdx(5,1).isSelected())hzzh = 1;

        var fengding = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                fengding = i;
            }
        }

        var quanjufengding = 0;
        if(this.getItemByIdx(9,0).isSelected()){
            quanjufengding = this.qjfdScore;
        }

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(10,4).isSelected()){
            autoPlay = 300;
        }

        var isDouble = 0;
        if(this.getItemByIdx(12,1).isSelected())isDouble = 1;

        var dScore = this.dScore;


        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(13,i).isSelected()){
                doubleNum = 2 + i;
            }
        }
        var djtg = 2;
        if (this.getItemByIdx(11,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(11,2).isSelected()){
            djtg = 3;
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(14,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("YZCHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("YZCHZ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.YZCHZ,//玩法ID 1
            costWay,//支付方式 2
            xianhu,//限胡 3
            xuangwang,//选王 4
            xing,// 醒 5
            shuangxing,// 双醒 6
            renshu,//人数 7
            fengding,// 封顶 8
            autoPlay,//托管 9
            djtg,//单局托管 10
            isDouble,//是否翻倍 11
            dScore,//翻倍上限 12
            doubleNum,//翻倍倍数 13
            huxi,//起胡胡息14
            hzzh,//红转朱黑15
            quanjufengding,//全局封顶 16
            morefen,//17 "加xx分"
            allowScore,//18 "低于xx分"
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var costWay = 1;

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected())jushu = 6;
        if(this.getItemByIdx(0,2).isSelected())jushu = 8;
        if(this.getItemByIdx(0,3).isSelected())jushu = 10;
        if(this.getItemByIdx(0,4).isSelected())jushu = 12;

        return [GameTypeEunmZP.YZCHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[1],[0],[0],[0],[],[0],[0],[0],[],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 12?4:params[0] == 10?3:params[0]==8?2:params[0]==6?1:0;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;//支付方式
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = params[4];//选王
        defaultConfig[4][0] = params[5];//醒
        defaultConfig[6][0] = params[14] == 18?1:params[14] == 21?2:0;//起胡胡息
        defaultConfig[7][0] = params[3];//限胡
        defaultConfig[8][0] = params[8];//封顶


        if(params[16] > 0){
            defaultConfig[9].push(0);
        }

        if(params[17] && parseInt(params[17]) > 0)defaultConfig[14].push(0);

        this.qjfdScore = (params[16] > 0)?parseInt(params[16]):500;//全局封顶分

        defaultConfig[10][0] = params[9] == 300?4:params[9]/60;//托管
        defaultConfig[11][0] = params[10]== 1 ? 0:params[10]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[12][0] = params[11] == 1 ? 1 :0;//是否加倍
        defaultConfig[13][0] = params[13] == 3 ? 1 :params[13]==4?2:0;//翻倍倍数

        this.dScore = params[12]?parseInt(params[12]):10;//翻倍分

        if(params[6] == "1")defaultConfig[5].push(0);//双醒
        if(params[15] == "1")defaultConfig[5].push(1);//红转朱黑

        this.addScore = parseInt(params[17])||10;
        this.allowScore = parseInt(params[18])||10;
        this.defaultConfig = defaultConfig;
    },
});