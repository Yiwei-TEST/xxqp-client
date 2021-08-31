/**
 * Created by Administrator on 2019/11/9.
 */

var RuleSelect_HBGZP = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(11);
        this.createChangeScoreBox(13);//创建低于xx分加xx分
        this.getItemByIdx(13,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","10局"]},//1
            {title:"人数",type:1,content:["4人","3人","2人"]},//2
            {title:"底分",type:1,content:["1分","2分","3分","4分","5分"],col:5},//3
            {title:"胡牌",type:1,content:["7个子","9个子","14个子"]},//4
            {title:"玩法",type:1,content:["十个花","溜花"]},//5
            {title:"",type:1,content:["不跑","带跑","定跑"]},//6
            {title:"",type:1,content:["跑1分","跑2分","跑3分"]},//7
            {title:"",type:2,content:["一炮多响"]},//8
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//9
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//10
            {title:"加倍",type:1,content:["不加倍","加倍"]},//11
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//12
            {title:"加分",type:2,content:["低于"]}//13
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0],[],[0],[1],[0],[0],[]];
        this.glzpDScore = parseInt(cc.sys.localStorage.getItem("HBGZP_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("HBGZP_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("HBGZP_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.HBGZP){
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
        //this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",10,"分"],1);
        this.allowNumBox.setWidgetPosition(380,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.glzpDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.glzpDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.glzpDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.glzpDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[11].setVisible(true);
            if(this.getItemByIdx(11,0).isSelected()){
                this.layoutArr[12].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[12].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[13].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(13,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[11].setVisible(false);
            this.layoutArr[12].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(9,0).isSelected()){
            this.layoutArr[10].setVisible(false);
        }else{
            this.layoutArr[10].setVisible(true);
        }
        if(this.getItemByIdx(6,1).isSelected()){
            this.layoutArr[7].setVisible(true);
        }else{
            this.layoutArr[7].setVisible(false);
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
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var jushu = 8;
        var jushuArr = [8,10];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
                break;
            }
        }

        var difen = 1;
        for(var i = 1;i<5;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                difen = i + 1;
                break;
            }
        }

        var gezi = 7;//算子
        if(this.getItemByIdx(4,1).isSelected()){
            gezi = 9;
        }else  if(this.getItemByIdx(4,2).isSelected()){
            gezi = 14;
        }

        var hua = 1;//十个花
        if(this.getItemByIdx(5,1).isSelected()){
            hua = 2;
        }

        var pao = 0;//不跑/带跑/定跑
        if(this.getItemByIdx(6,1).isSelected()){
            pao = 1;
        }else if(this.getItemByIdx(6,2).isSelected()){
            pao = 2;
        }

        var paoScore = 0;//跑分
        if(pao == 1){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(7,i).isSelected()){
                    paoScore = i + 1;
                    break;
                }
            }
        }

        var ypdx = this.getItemByIdx(8,0).isSelected() ? 1 : 0;//一炮多响

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(9,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(10,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(10,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(11,1).isSelected())isDouble = 1;

        var dScore = this.glzpDScore;
        cc.sys.localStorage.setItem("HBGZP_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,2).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(12,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(13,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("HBGZP_addBoxScore",morefen);
        cc.sys.localStorage.setItem("HBGZP_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.HBGZP,//玩法ID 1
            costWay, // 支付方式  2
            0, // **** 无用占位  3
            0, // **** 无用占位  4
            0, // **** 无用占位  5
            0, // **** 无用占位  6
            renshu,      //人数    7（2,3,4）
            autoPlay,   //托管时间    8（0,60,120,180,300）
            0, // **** 无用占位  9
            0, // **** 无用占位  10
            0, // **** 无用占位  11
            0, // **** 无用占位  12
            0, // **** 无用占位  13
            0, // **** 无用占位  14
            0, // **** 无用占位  15
            0, // **** 无用占位  16
            difen, // 底分  17
            isDouble, //加倍     18
            dScore, //加倍分     19
            doubleNum,   //加倍数  20
            djtg,       //单局托管  21
            gezi,       //个子   22
            hua,        //花   23
            pao,        //跑   24
            paoScore,   //跑分 25
            ypdx,       //一炮多响  26
            allowScore, //低于xx分  27
            morefen     //加xx分    28
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        var jushuArr = [8,10];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
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

        return [GameTypeEunmZP.HBGZP,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0],[],[0],[1],[0],[0],[]];

        var inning = [5,10,20,30];
        var index = inning.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = params[2] == 3||params[2] == 4?0:parseInt(params[2]) - 1;//房费
        defaultConfig[1][0] = index !== -1 ? index : 0;//局数
        defaultConfig[2][0] = params[7] == 4 ? 0 : (params[7] == 3 ? 1 : 2);//人数
        defaultConfig[3][0] = parseInt(params[17]) - 1;//底分
        defaultConfig[4][0] = params[22]== 9 ? 1:params[22]== 14 ? 2 : 0;//个子 7,9,14
        defaultConfig[5][0] = params[23] == 1 ? 0 : 1; // 十个花，溜花
        defaultConfig[6][0] = params[24] == 1 ? 1 : params[24] == 2 ? 2 : 0;// 不跑，带跑，定跑
        defaultConfig[7][0] = params[25] == 2 ? 1 :  params[25] == 3 ? 2 : 0;//跑1,2,3分
        if(params[26] != 0){
            defaultConfig[8].push(0);//一炮多响
        }
        defaultConfig[9][0] = params[8] == 300?4:params[8]/60;//托管时间
        defaultConfig[10][0] = params[21]== 1 ? 0:params[21]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[11][0] = params[18]== 1 ? 1:0;//是否翻倍
        defaultConfig[12][0] = parseInt(params[19]) - 2 >= 0 ? parseInt(params[19]) - 2 : 0;//翻倍数
        if(params[27] && parseInt(params[27]) > 0){
            defaultConfig[13].push(0);
        }
        this.addScore = parseInt(params[28])||10;
        this.allowScore = parseInt(params[27])||10;
        this.glzpDScore = params[19]?parseInt(params[19]):10;//多少分翻倍

        this.defaultConfig = defaultConfig;
    },
});