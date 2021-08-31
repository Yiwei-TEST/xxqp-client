/**
 * Created by Administrator on 2019/10/9.
 */
var RuleSelect_XXEQS = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        //this.createTipLabel(2);
        this.createNumBox(8);
        this.createChangeScoreBox(10);//创建低于xx分加xx分
        this.getItemByIdx(10,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","16局"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//3
            {title:"庄分",type:1,content:["无庄分","2分","5分","10分"]},//4
            {title:"玩法",type:2,content:["自摸加1分","自摸红字加1分","充分"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6 9
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//7 10
            {title:"加倍",type:1,content:["不加倍","加倍"]},//8 11
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//9 12
            {title:"加分",type:2,content:["低于"]},//10 13
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[],[0],[1],[0],[0],[]];
        this.xxeqsDScore = parseInt(cc.sys.localStorage.getItem("XXEQS_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("XXEQS_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("XXEQS_allowBoxScore")) || 10;/** 低于xx分 **/

        if(this.createRoomLayer.clubData){

            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[0].content = ["群主支付"];
                this.defaultConfig[0][0] = 0;
            }
            if(ClickClubModel.getClubIsGold()){
                this.ruleConfig[0].content = ["白金豆AA支付"];
                this.defaultConfig[0][0] = 0;
            }

            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == GameTypeEunmZP.XXEQS){
                this.readSelectData(params);
            }
        }

        return true;
    },

    createTipLabel:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        var str = "注：两人模式，不管多少胡息起胡，都是从"+ '\n' +"9胡息开始算分";
        var scoreLabel = this.showLabel = UICtor.cLabel(str,22,null,cc.color(189,32,26));
        scoreLabel.setAnchorPoint(0,0.5);
        scoreLabel.x = (20 + 788/(this.layoutArr[row].itemArr.length));
        this.layoutArr[row].addChild(scoreLabel,0);
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

    onShow:function(){
        this.updateZsNum();
    },

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 350 + (788/(this.layoutArr[row].itemArr.length));

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.xxeqsDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.xxeqsDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.xxeqsDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.xxeqsDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[8].setVisible(true);
            this.layoutArr[3].setVisible(true);
            if(this.getItemByIdx(8,0).isSelected()){
                this.layoutArr[9].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[9].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[10].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(10,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[3].setVisible(false);
            this.layoutArr[8].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.layoutArr[10].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(6,0).isSelected()){
            this.layoutArr[7].setVisible(false);
        }else{
            this.layoutArr[7].setVisible(true);
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = 0;
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = 0;
            }else{
                zsNum = 0;
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){

        var num = 0;

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushu +i*8;
                break;
            }
        }

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
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var choupai = 0;
        var choupaiArr = [0,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                choupai = choupaiArr[i];
                break;
            }
        }

        var zhuangfen = 0;//庄分
        var zhuangfenArr = [0,2,5,10];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                zhuangfen = zhuangfenArr[i];
                break;
            }
        }

        var zmjyf = 0;
        if (this.getItemByIdx(5,0).isSelected()) zmjyf = 1;
        var zmhzjyf = 0;
        if (this.getItemByIdx(5,1).isSelected()) zmhzjyf = 1;
        var chongfen = 0;
        if (this.getItemByIdx(5,2).isSelected()) chongfen = 1;

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(7,0).isSelected()){
            djtg = 1;
        }
        if (this.getItemByIdx(7,2).isSelected()){
            djtg = 3;
        }


        var isDouble = 0;
        if(this.getItemByIdx(8,1).isSelected())isDouble = 1;

        var dScore = this.xxeqsDScore;
        cc.sys.localStorage.setItem("XXEQS_diScore",dScore);

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(10,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("XXEQS_addBoxScore",morefen);
        cc.sys.localStorage.setItem("XXEQS_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.XXEQS,//玩法ID 1
            0,//占位 2
            0,//占位 3
            0,//占位  4
            0,//占位 5
            0,//占位 6
            renshu,//人数 7
            0,//占位 8
            costWay,//支付方式 9
            0,//占位 10
            choupai,//抽牌 11
            zhuangfen,//庄分 12
            zmjyf,//自摸加分 13
            zmhzjyf,//自摸红字加1分 14
            chongfen,//充分 15
            allowScore, //16 低于xx分
            morefen,//17 加xx分
            0,//占位 18
            0,//占位 19
            autoPlay,//可托管 20
            isDouble,//是否翻倍 21
            dScore,//翻倍上限 22
            doubleNum,//翻倍倍数 23
            djtg,//单局托管 24
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        var jushuArr = [8,16];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 2;
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
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        return [GameTypeEunmZP.XXEQS,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[0],[0],[],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = params[0] == 8 ? 0 : 1;//局数
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = params[11] == 0 ? 0:(params[11] == 10 ? 1 : 2);//抽牌

        if(params[13] == "1")defaultConfig[5].push(0);//海底胡
        if(params[14] == "1")defaultConfig[5].push(1);//十六小
        if(params[15] == "1")defaultConfig[5].push(2);//十八大

        var zhuangfenArr = [0,2,5,10];
        defaultConfig[4][0] = zhuangfenArr.indexOf(parseInt(params[12]));//自摸

        defaultConfig[6][0] = params[20] == 300?4:params[20]/60;//托管时间
        defaultConfig[7][0] = params[24]== 1 ? 0:params[24]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[8][0] = params[21]== 1 ? 1:0;//是否翻倍
        defaultConfig[9][0] = parseInt(params[23]) - 2 >= 0 ? parseInt(params[23]) - 2 : 0;//翻倍数
        if(params[16] && params[16] != 0 && params[17] && params[17] != 0){
            defaultConfig[10].push(0);
        }
        this.xxeqsDScore = params[22]?parseInt(params[22]):10;//多少分翻倍

        this.allowScore = parseInt(params[16])||10;
        this.addScore = parseInt(params[17])||10;

        this.defaultConfig = defaultConfig;
    },
});