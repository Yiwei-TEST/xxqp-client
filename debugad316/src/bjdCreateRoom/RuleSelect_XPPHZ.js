/**
 * Created by Administrator on 2020/4/16.
 */
var RuleSelect_XPPHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(9);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["10局","15局","20局"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"选项",type:1,content:["1-2-3","2-4-6","3-6-9"]},//3
            {title:"冲分",type:1,content:["不可冲","冲2","冲4","冲6","冲8"]},//4
            {title:"玩法",type:2,content:["箍臭"]},//5
            {title:"抽牌",type:1,content:["不抽牌","抽10张","抽15张","抽20张"]},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//8
            {title:"加倍",type:1,content:["不加倍","加倍"]},//9
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//10
            {title:"加分",type:2,content:["低于"]},//11
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[],[0],[0],[1],[0],[0],[]];
        this.dnScore = parseInt(cc.sys.localStorage.getItem("XPPHZ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("XPPHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("XPPHZ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.XPPHZ){
                this.readSelectData(params);
            }
        }

        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 203 ){
            this.updateZsNum();
        }
        this.updateItemShow();
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
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",10,"分"],1);
        this.allowNumBox.setWidgetPosition(380,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
    },

    updateItemShow:function(){
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[9].setVisible(true);
            this.layoutArr[6].setVisible(true);
            if(this.getItemByIdx(9,0).isSelected()){
                this.layoutArr[10].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[10].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[11].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(11,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            this.layoutArr[8].setVisible(true);
        }else{
            this.layoutArr[9].setVisible(false);
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
            this.layoutArr[8].setVisible(false);
            this.layoutArr[6].setVisible(false);
        }

        if (this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].setVisible(false);
        }else{
            this.layoutArr[8].setVisible(true);
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = 4;
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = 2;
            }else{
                zsNum = 4;
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){

        var num = 2500;

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
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
        reduceBtn.setPosition(-5,0);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(BoxBg.width-addBtn.width+5,-4);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.dnScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.dnScore;
        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.dnScore = num;
        }
        // cc.log("this.dnScore =",this.dnScore);
        this.scoreLabel.setString("低于"+this.dnScore + "分");
    },
    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var jushu = 10;
        var jushuArr = [10,15,20];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }

        var choupai = 0;
        if(this.getItemByIdx(6,1).isSelected()){
            choupai = 10;
        }else if(this.getItemByIdx(6,2).isSelected()){
            choupai = 15;
        }else if(this.getItemByIdx(6,3).isSelected()){
            choupai = 20;
        }

        var xuanxiang = 1;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                xuanxiang = i+1;
                break;
            }
        }

        var chongfen = 0;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                chongfen = i;
                break;
            }
        }

        var guchou = 0;
        if(this.getItemByIdx(5,0).isSelected()){
            guchou = 1;
        }


        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(7,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(8,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(8,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(9,1).isSelected())isDouble = 1;

        var dScore = this.dnScore;
        cc.sys.localStorage.setItem("XPPHZ_diScore",dScore);

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("XPPHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("XPPHZ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.XPPHZ,//玩法ID 1
            costWay,//支付方式 2
            choupai,//抽牌 3
            xuanxiang,//选项 4
            chongfen,//冲分 5
            guchou,// 箍臭 6
            renshu,//人数 7
            autoPlay,//可托管 8
            djtg,//单局托管 9
            isDouble,//是否翻倍 10
            dScore,//翻倍上限 11
            doubleNum,//翻倍倍数 12
            allowScore,//13 "低于xx分"
            morefen,//14 "加xx分"
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 10;
        var jushuArr = [10,15,20];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
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

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }
        return [GameTypeEunmZP.XPPHZ,costWay,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[0],[0],[0],[0],[],[0],[0],[0],[0],[0],[]];

        defaultConfig[0][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;//支付方式
        defaultConfig[1][0] = params[0] == 15 ? 1:params[0] == 20 ? 2:0; //局数
        defaultConfig[2][0] = params[7] == 2 ? 1 : 0;//人数
        defaultConfig[3][0] = parseInt(params[4]) - 1;//选项
        defaultConfig[4][0] = parseInt(params[5]);//冲分
        defaultConfig[6][0] = params[3] == 10 ? 1 :params[3] == 15 ? 2:params[3] == 20 ? 3:0;//抽牌
        defaultConfig[7][0] = params[8]==1?1:params[8] == 300?4:params[8]/60;//托管时间
        defaultConfig[8][0] = params[9]== 1 ? 0 : params[9]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[9][0] = params[10] == 1 ? 1 :0;//是否翻倍
        defaultConfig[10][0] = params[12] == 3 ? 1 :params[12]==4?2:0;//翻几倍
        if(params[14] && parseInt(params[14]) > 0){
            defaultConfig[11].push(0);
        }

        if(params[6] == "1")defaultConfig[5].push(0);

        this.dnScore = params[11]?parseInt(params[11]):5;
        this.addScore = parseInt(params[14])||10;
        this.allowScore = parseInt(params[13])||10;
        this.defaultConfig = defaultConfig;
    },
});