/**
 * Created by Administrator on 2019/9/24.
 */
/**
 * Created by Administrator on 2019/9/6.
 */
var RuleSelect_WCPHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(12);
        this.createChangeScoreBox(14);//创建低于xx分加xx分
        this.getItemByIdx(14,0).itemBtn.setContentSize(80,40);
        this.createAddScoreBox(6);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","10局","20局"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"玩法",type:1,content:["臭牌臭庄","臭牌不臭庄"]},//3
            {title:"30胡",type:1,content:["10牌","15牌"]},//4
            {title:"自摸",type:1,content:["自摸+1分","自摸不加分"]},//5
            {title:"见+1分",type:1,content:["30胡息以上见1加分"]},//6
            {title:"飘分",type:1,content:["不飘","自由飘"]},//7
            {title:"坐飘",type:1,content:["不坐飘","坐飘1","坐飘2","坐飘3","坐飘4","坐飘5"]},//8
            {title:"抽牌",type:1,content:["不抽底","抽底19张"]},//9
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//10
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//11
            {title:"加倍",type:1,content:["不加倍","加倍"]},//12
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//13
            {title:"加分",type:2,content:["低于"]},//14
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];
        this.wcphzDScore = parseInt(cc.sys.localStorage.getItem("WCPHZ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("WCPHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("WCPHZ_allowBoxScore")) || 10;/** 低于xx分 **/
        this.jjfScore = parseInt(cc.sys.localStorage.getItem("WCPHZ_jjfBoxScore")) || 1;/** 见+1分 **/

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
            if(params[1] == GameTypeEunmZP.WCPHZ){
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

    createAddScoreBox:function(row){
        if (!this.layoutArr[row]){
            return null
        }
        this.addScoreBox = new changeEditBox(["",1,"分"],1,1,9);
        this.addScoreBox.setWidgetPosition(610,0);
        this.addScoreBox.setScoreLabel(this.jjfScore);
        this.layoutArr[row].addChild(this.addScoreBox);
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.wcphzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.wcphzDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.wcphzDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.wcphzDScore + "分");
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
            this.layoutArr[9].setVisible(true);
            if(this.getItemByIdx(12,0).isSelected()){
                this.layoutArr[13].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[13].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[14].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(13,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[9].setVisible(false);
            this.layoutArr[12].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.layoutArr[14].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(10,0).isSelected()){
            this.layoutArr[11].setVisible(false);
        }else{
            this.layoutArr[11].setVisible(true);
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsArr = [5,6,12];

        var zsNum = 0;

        var temp = 0;
        var renshu = 3;
        if(this.getItemByIdx(2,1).isSelected()){
            renshu = 2;
        }

        for(var i = 0;i<3;++i){
            var item = this.getItemByIdx(1,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = zsArr[temp];
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = Math.ceil(zsArr[temp]/renshu);
            }else{
                zsNum = zsArr[temp];
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
        var jushu = 10;
        var jushuArr = [8,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
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

        var cpcz = this.getItemByIdx(3,1).isSelected() ? 1 : 0;//臭牌臭庄
        var hu30 = this.getItemByIdx(4,1).isSelected() ? 15 : 10;//30胡 10.10牌,15.15牌
        var zimo = this.getItemByIdx(5,1).isSelected() ? 0 : 1;//0自摸不加分,1自摸+1牌
        var jjf = this.addScoreBox.localScore || 1;//见+1分,30胡息以上见1+n
        var piaofen = this.getItemByIdx(7,1).isSelected() ? 1 : 0;//0不飘,1自由飘
        var zuopiao = 0;
        for(var i = 0;i<=5;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                zuopiao = i;
                break
            }
        }

        var choupai = 0;//抽牌
        if(this.getItemByIdx(2,1).isSelected()){
            if(this.getItemByIdx(9,1).isSelected()){
                choupai = 19
            }
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

        var dScore = this.wcphzDScore;
        cc.sys.localStorage.setItem("WCPHZ_diScore",dScore);

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
        cc.sys.localStorage.setItem("WCPHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("WCPHZ_allowBoxScore",allowScore);
        cc.sys.localStorage.setItem("WCPHZ_allowBoxScore",jjf);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.WCPHZ,//玩法ID 1
            0,// 2 *****无用占位
            0,// 3 *****无用占位
            0,// 4 *****无用占位
            0,// 5 *****无用占位
            0,// 6 *****无用占位
            renshu,//人数 7
            0,// 8 *****无用占位
            costWay,//支付方式 9
            0,// 10 *****无用占位
            0,// 11 *****无用占位
            0,// 12 *****无用占位
            0,// 13 *****无用占位
            choupai,//抽牌 14
            0,//坐庄 15
            cpcz,// 16 玩法:0臭牌臭庄,1臭牌不臭庄
            hu30,// 17 30胡:10.10牌,15.15牌
            zimo,// 18 自摸:0自摸不加分,1自摸+1牌
            jjf,// 19 见+1分,30胡息以上见1+n
            piaofen,// 20 飘分: 0不飘
            zuopiao,// 21 坐飘: 0不飘
            0,// 22 *****无用占位
            autoPlay,//托管时间 23
            isDouble,//是否翻倍 24
            dScore,//翻倍上限 25
            doubleNum,//翻倍倍数 26
            djtg,//单局托管 27
            0,// 28  *****无用占位
            0,// 29  *****无用占位
            0,// 30  *****无用占位
            0,//31 *****无用占位
            0,// 32  *****无用占位
            0,// 33  *****无用占位
            0,// 34  *****无用占位
            0,// 35  *****无用占位
            0,// 36  *****无用占位
            0,// 37  *****无用占位
            0,// 38  *****无用占位
            0,// 39  *****无用占位
            0,// 40  *****无用占位
            0,//41 *****无用占位
            0,// 42  *****无用占位
            0,//43 *****无用占位
            0,// 44  *****无用占位
            0,// 45 *****无用占位
            allowScore, //46 低于xx分
            morefen,//47 加xx分
        ];

        cc.log("data.params =",JSON.stringify(data.params))

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        var jushuArr = [8,10,20];
        for(var i = 0;i<3;++i){
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

        return [GameTypeEunmZP.WCPHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = params[0] == 8 ? 0 : params[0] == 10?1:2;//局数
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[9][0] = params[14] == 0?0:1;//抽牌
        defaultConfig[3][0] = params[16] == 1 ? 1:0;//臭牌
        defaultConfig[4][0] = params[17] == 10 ? 0:1;//30胡
        defaultConfig[5][0] = params[18] == 1 ? 0:1;//自摸
        defaultConfig[7][0] = params[20] == 1 ? 1:0;//飘分
        defaultConfig[8][0] = params[21];//坐飘
        defaultConfig[10][0] = params[23] == 300?4:params[23]/60;//托管时间
        defaultConfig[11][0] = params[27]== 1 ? 0:params[27]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[12][0] = params[24]== 1 ? 1:0;//是否翻倍
        defaultConfig[13][0] = parseInt(params[26]) - 2 >= 0 ? parseInt(params[26]) - 2 : 0;//翻倍数

        if(params[46] && params[46] != 0 && params[47] && params[47] != 0){
            defaultConfig[14].push(0);
        }

        this.wcphzDScore = params[25]?parseInt(params[25]):10;//多少分翻倍
        this.allowScore = parseInt(params[46])||10;
        this.addScore = parseInt(params[47])||10;
        this.jjfScore = parseInt(params[19])||1;

        /***
         * 需要重新修改
         */
        if(params[41] == "1")defaultConfig[4].push(0);//三提五坎
        if(params[44] == "1")defaultConfig[4].push(1);//爬坡

        this.defaultConfig = defaultConfig;
    },
});