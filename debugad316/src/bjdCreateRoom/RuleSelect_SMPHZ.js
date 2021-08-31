/**
 * Created by Administrator on 2020/1/19.
 */

var RuleSelect_SMPHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(12);
        this.createChangeScoreBox(14);//创建低于xx分加xx分
        this.getItemByIdx(14,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","16局"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"底分",type:1,content:["1分","2分","3分","4分","5分"],col:5},//3
            {title:"分数上限",type:1,content:["无","100","200","300","500"]},//4
            {title:"首局坐庄",type:1,content:["随机","房主"]},//5
            {title:"玩法",type:1,content:["土炮胡","全名堂"]},//6
            {title:"",type:2,content:["对子胡","团胡"]},//7
            {title:"",type:1,content:["大六八番","小六八番"]},//8
            {title:"抽牌",type:1,content:["不抽牌","抽10张","抽20张"]},//9
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//10
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//11
            {title:"加倍",type:1,content:["不加倍","加倍"]},//12
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//13
            {title:"加分",type:2,content:["低于"]}//14
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];
        this.glzpDScore = parseInt(cc.sys.localStorage.getItem("SMPHZ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("SMPHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("SMPHZ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.SMPHZ){
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
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[12].setVisible(true);
            if(this.getItemByIdx(12,0).isSelected()){
                this.layoutArr[13].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[13].setVisible(true);
                this.numBox.setVisible(true);0
            }
            this.layoutArr[14].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(14,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            this.layoutArr[9].setVisible(true);
        }else{
            this.layoutArr[12].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.layoutArr[14].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
            this.layoutArr[9].setVisible(false);
        }
        if(this.getItemByIdx(10,0).isSelected()){
            this.layoutArr[11].setVisible(false);
        }else{
            this.layoutArr[11].setVisible(true);
        }

        if(this.getItemByIdx(6,0).isSelected()){
            this.getItemByIdx(7,0).setItemState(true);
            this.getItemByIdx(7,1).setItemState(false);
            this.layoutArr[8].setVisible(false);
        }else if(this.getItemByIdx(6,1).isSelected()){
            this.getItemByIdx(7,0).setItemState(false);
            this.getItemByIdx(7,1).setItemState(true);
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
        var jushuArr = [8,16];
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

        var difen = 1;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                difen = i + 1;
                break;
            }
        }

        var score = 0;//分数上限
        var scoreArr = [0,100,200,300,500];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                score = scoreArr[i];
                break;
            }
        }

        var zhuang = 0;//随机庄家
        if(this.getItemByIdx(5,1).isSelected()){
            zhuang = 1;//房主
        }

        var wanfa = 0;//土炮胡
        if(this.getItemByIdx(6,1).isSelected()){
            wanfa = 1;//全名堂
        }

        var dzh = 0;
        if(wanfa == 0) {
            dzh = this.getItemByIdx(7, 0).isSelected() ? 1 : 0;//对子胡
        }

        var th = 0;
        var lbf = 0;

        if(wanfa == 1) {
            th = this.getItemByIdx(7,1).isSelected() ? 1 : 0;//团胡
            lbf = this.getItemByIdx(8,0).isSelected() ? 1 : 2;//大、小六八番
        }

        var choupai = 0;
        if(this.getItemByIdx(9,1).isSelected()){
            choupai = 10;
        }else if(this.getItemByIdx(9,2).isSelected()){
            choupai = 20;
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

        var djtg = 2;
        if (this.getItemByIdx(11,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(11,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(12,1).isSelected())isDouble = 1;

        var dScore = this.glzpDScore;
        cc.sys.localStorage.setItem("SMPHZ_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,1).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(13,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(14,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("SMPHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("SMPHZ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.SMPHZ,//玩法ID 1
            0, // **** 无用占位  2
            0, // **** 无用占位  3
            0, // **** 无用占位  4
            0, // **** 无用占位  5
            0, // **** 无用占位  6
            renshu,      //人数    7（2,3,4）
            0, // **** 无用占位   8
            costWay, // 支付方式  9
            0, // **** 无用占位  10
            0, // **** 无用占位  11
            0, // **** 无用占位  12
            0, // **** 无用占位  13
            choupai,//  抽牌 14
            zhuang,//   坐庄 15
            wanfa, // 土炮胡0全名堂1  16
            lbf,// 17  六八番
            score,// 18  上限封顶
            dzh,// 19  对子胡
            th,// 20  团胡
            0,// 21  *****无用占位
            0,// 22  *****无用占位
            autoPlay,   //托管时间    23（0,60,120,180,300）
            isDouble,//是否翻倍 24
            dScore,//翻倍上限 25
            doubleNum,//翻倍倍数 26
            djtg,//单局托管 27
            0,// 28  *****无用占位
            0,// 29  *****无用占位
            0,// 30  *****无用占位
            0,// 31  *****无用占位
            0,// 32  *****无用占位
            0,// 33  *****无用占位
            0,// 34  *****无用占位
            0,// 35  *****无用占位
            0,// 36  *****无用占位
            0,// 37  *****无用占位
            0,// 38  *****无用占位
            0,// 39  *****无用占位
            0,// 40  *****无用占位
            0,// 41  *****无用占位
            0,// 42  *****无用占位
            0,// 43  *****无用占位
            0,// 44  *****无用占位
            difen,// 45 底分 1 | 2
            allowScore, //46 低于xx分
            morefen,//47 加xx分
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

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
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

        return [GameTypeEunmZP.SMPHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = params[0] == 8 ? 0 : 1 ;//局数
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = parseInt(params[45]) - 1;//底分 1 | 2
        var scoreArr = [0,100,200,300,500];
        var score = scoreArr.indexOf(parseInt(params[18]));//分数上限
        defaultConfig[4][0] = score !== -1 ? score:0;//分数上限
        defaultConfig[5][0] = params[15] == 1 ? 1:0;//坐庄
        defaultConfig[6][0] = params[16] == 1 ? 1:0;//土炮胡/全名堂
        defaultConfig[8][0] = params[17] == 1 ? 0:1;//大小六八番
        defaultConfig[9][0] = params[14] == 0?0:(params[14] == 10 ? 1 : 2);//抽牌
        defaultConfig[10][0] = params[23] == 300?4:params[23]/60;//托管时间
        defaultConfig[11][0] = params[27]== 1 ? 0:params[27]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[12][0] = params[24]== 1 ? 1:0;//是否翻倍
        defaultConfig[13][0] = parseInt(params[26]) - 2 >= 0 ? parseInt(params[26]) - 2 : 0;//翻倍数

        if(params[16] == 0){
            if(params[19] == 1){
                defaultConfig[7].push(0);
            }
        }else{
            if(params[20] == 1){
                defaultConfig[7].push(1);
            }
        }

        if(params[46] && params[46] != 0 && params[47] && params[47] != 0){
            defaultConfig[14].push(0);
        }

        this.glzpDScore = params[25]?parseInt(params[25]):10;//多少分翻倍
        this.allowScore = parseInt(params[46])||10;
        this.addScore = parseInt(params[47])||10;

        this.defaultConfig = defaultConfig;
    },
});