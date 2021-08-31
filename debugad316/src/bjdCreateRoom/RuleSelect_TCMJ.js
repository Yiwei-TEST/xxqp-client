/**
 * Created by Administrator on 2020/1/3.
 */
/**
 * Created by Administrator on 2019/11/9.
 */

var RuleSelect_TCMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(9);
        this.createNewBox(4);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数",type:1,content:["10局","16局","24局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数",type:1,content:["4人","3人","2人"]},//2
            {title:"底分",type:1,content:["1分","2分","3分"]},//3
            {title:"玩法",type:1,content:["258将","乱将"]},//4
            {title:"飘分",type:1,content:["飘1分","飘2分","飘3分","不飘","定飘"]},//5
            {title:"",type:1,content:["1分","2分","3分"]},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//8
            {title:"加倍",type:1,content:["不加倍","加倍"]},//9
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//10
            {title:"加分",type:2,content:["低于"]}//11
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];
        this.glzpDScore = parseInt(cc.sys.localStorage.getItem("TCMJ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("TCMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("TCMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.TCMJ){
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

    createNewBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        var num = cc.sys.localStorage.getItem("GDCSMJ_MAGENGANG") || this.hasLaiZi;
        this.newBoxType2 = new SelectBox(2,"有癞");
        this.newBoxType2.setPosition(780,0);//设置位置
        this.layoutArr[row].addChild(this.newBoxType2);
        this.newBoxType2.setSelected(num == 1);
    },

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 430 + (788/(this.layoutArr[row].itemArr.length));

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
            this.layoutArr[9].setVisible(true);
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
        }else{
            this.layoutArr[9].setVisible(false);
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].setVisible(false);
        }else{
            this.layoutArr[8].setVisible(true);
        }
        if(this.getItemByIdx(5,4).isSelected()){
            this.layoutArr[6].setVisible(true);
        }else{
            this.layoutArr[6].setVisible(false);
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
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var jushu = 10;
        var jushuArr = [10,16,24];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(0,i).isSelected()){
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
        for(var i = 1;i<3;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                difen = i + 1;
                break;
            }
        }

        var jiang = 1;//258 将  乱将
        if(this.getItemByIdx(4,1).isSelected()){
            jiang = 0;
        }

        var laizi = this.newBoxType2.isSelected() ? 1 : 0;

        var piaofen = 0;//0不飘 飘1,2,3 ：11,12,13  定飘1,2,3  1,2,3
        if(this.getItemByIdx(5,0).isSelected()){
            piaofen = 11;
        }else if(this.getItemByIdx(5,1).isSelected()){
            piaofen = 12;
        }else if(this.getItemByIdx(5,2).isSelected()){
            piaofen = 13;
        }else if(this.getItemByIdx(5,4).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(6,i).isSelected()){
                    piaofen = i + 1;
                    break;
                }
            }
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

        var dScore = this.glzpDScore;
        cc.sys.localStorage.setItem("TCMJ_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,2).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(10,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("TCMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("TCMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.TCMJ,//玩法ID 1
            costWay, // 支付方式  2
            0, // **** 无用占位  3
            jiang, // 258将1 / 乱将0    4
            piaofen, // **** 飘分  5
            difen, // **** 底分  6
            renshu,      //人数    7（2,3,4）
            0, // **** 无用占位  8
            0, // **** 无用占位  9
            0, // **** 无用占位  10
            0, // **** 无用占位  11
            0, // **** 无用占位  12
            0, // **** 无用占位  13
            0, // **** 无用占位  14
            0, // **** 无用占位  15
            0, // **** 无用占位  16
            0, // **** 无用占位  17
            0, // **** 无用占位  18
            isDouble, //加倍     19
            dScore, //加倍分     20
            doubleNum,   //加倍数  21
            0, // **** 无用占位  22
            0, // **** 无用占位  23
            0, // **** 无用占位  24
            0, // **** 无用占位  25
            0, // **** 无用占位  26
            0, // **** 无用占位  27
            autoPlay,   //托管时间    28（0,60,120,180,300）
            djtg,       //单局托管 29
            0, // **** 无用占位  30
            0, // **** 无用占位  31
            0, // **** 无用占位  32
            0, // **** 无用占位  33
            allowScore, //低于xx分  34
            morefen,     //加xx分    35
            0, // **** 无用占位  36
            laizi // **** 是否有癞子  37
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 10;
        var jushuArr = [10,16,24];
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

        return [GameTypeEunmMJ.TCMJ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];

        var inning = [10,16,24];
        var index = inning.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = index !== -1 ? index : 0;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:parseInt(params[2]) - 1;//房费
        defaultConfig[2][0] = params[7] == 4 ? 0 : (params[7] == 3 ? 1 : 2);//人数
        defaultConfig[3][0] = parseInt(params[6]) - 1;//底分
        defaultConfig[4][0] = params[4]== 1 ? 0:1;//258将，乱将
        var piaofenArr = [11,12,13,0];
        var tempIndex = piaofenArr.indexOf(parseInt(params[5]));
        defaultConfig[5][0] = tempIndex != -1 ? tempIndex : 4; // 十个花，溜花
        if(tempIndex === -1){
            defaultConfig[6][0] = params[5] == 2 ? 1 : params[5] == 3 ? 2 : 0;//定跑几分
        }
        defaultConfig[7][0] = params[28] == 300?4:params[28]/60;//托管时间
        defaultConfig[8][0] = params[29]== 1 ? 0:params[29]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[9][0] = params[19]== 1 ? 1:0;//是否翻倍
        defaultConfig[10][0] = parseInt(params[21]) - 2 >= 0 ? parseInt(params[21]) - 2 : 0;//翻倍数
        if(params[34] && parseInt(params[34]) > 0 && params[35] && parseInt(params[35]) > 0){
            defaultConfig[11].push(0);
        }
        this.addScore = parseInt(params[35])||10;
        this.allowScore = parseInt(params[34])||10;
        this.glzpDScore = params[20]?parseInt(params[20]):10;//多少分翻倍
        this.hasLaiZi = params[37] == 1 ? 1 : 0;

        this.defaultConfig = defaultConfig;
    },
});