/**
 * Created by Administrator on 2019/8/6.
 */
var RuleSelect_AHMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox(12);//创建低于xx分加xx分
        this.createDiFenBox(6);//底分
        this.getItemByIdx(12,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:1,content:["四王","七王"],col:3},            //3
            {title:"抓鸟",type:1,content:["不抓鸟","抓1鸟","抓2鸟","抓3鸟","抓4鸟"],col:3},//4
            {title:"抓鸟选择",type:2,content:["159中鸟"],col:3},//5
            {title:"底分",type:2,content:[""]},//6
            {title:"可选",type:2,content:["庄闲分","王代硬","一炮多响"],col:3},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},    //8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},             //9
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},                           //10
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},                  //11
            {title:"加分",type:2,content:["低于"]},//12
        ];

        this.defaultConfig = [[0],[0],[0],[0],[0],[],[1],[],[0],[1],[0],[0],[]];
        this.syDScore = parseInt(cc.sys.localStorage.getItem("AHMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("AHMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("AHMJ_allowBoxScore")) || 10;/** 低于xx分 **/
        this.addDiFen = parseInt(cc.sys.localStorage.getItem("AHMJ_addDiFen")) || 1;/** 底分 **/

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
            if(params[1] == GameTypeEunmMJ.AHMJ){
                this.readSelectData(params);
            }
        }

        return true;
    },

    createDiFenBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.diFenBox = new changeEditBox(["",1,"分"],1,1,10);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.diFenBox.setWidgetPosition(170,0);//设置位置
        this.diFenBox.setScoreLabel(this.addDiFen);//设置初始值
        this.layoutArr[row].addChild(this.diFenBox);

        this.getItemByIdx(row,0).visible = false;
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

    onShow:function(){
        this.updateZsNum();
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }
        this.updateItemShow();
    },

    updateItemShow:function(){
        if (this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[10].visible = true;
            if (this.getItemByIdx(10,1).isSelected()){
                this.layoutArr[11].visible= true;
                this.numBox.visible = true;
            }else{
                this.layoutArr[11].visible= false;
                this.numBox.visible = false;
            }
            this.layoutArr[12].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(12,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.numBox.visible = false;
            this.layoutArr[10].visible = false;
            this.layoutArr[11].visible= false;
            this.layoutArr[12].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if (this.getItemByIdx(8,0).isSelected()){
            this.layoutArr[9].visible = false;
        }else{
            this.layoutArr[9].visible = true;
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [5,10];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
                break;
            }
        }

        for(var i = 0;i<2;++i){
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
                zsNum = zsNumArr[temp]
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 4;
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000,4:1500},{2:5000,3:3300,4:2500}
        ]

        var num = configArr[temp][renshu];

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.syDScore+"分",38,null,cc.color(126,49,2));
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
        var num = this.syDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.syDScore = num - 5;
            }else{
                this.syDScore = num;
            }
        }else if ( num < 10){
            this.syDScore = 5;
        }
        // cc.log("this.syDScore =",this.syDScore);
        this.scoreLabel.setString("小于"+ this.syDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 16;
        }

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected()) costway = 2;
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        // var difen = 1;
        // for (var i = 0; i < 3; i++) {
        //     if(this.getItemByIdx(3,i).isSelected()){
        //         difen = i + 1;
        //         break;
        //     }
        // }

        var wang = 1;
        if(this.getItemByIdx(3,1).isSelected()){
            wang = 2;
        }

        var zhuaniao = 0;
        for (var i = 0; i < 5; i++) {
            if(this.getItemByIdx(4,i).isSelected()){
                zhuaniao = i ;
                break;
            }
        }
        var niao159 =0 ;if(this.getItemByIdx(5,0).isSelected())niao159 = 1;

        var zhaungxian = 0;if(this.getItemByIdx(7,0).isSelected())zhaungxian = 1;
        var wangdaiying = 0;if(this.getItemByIdx(7,1).isSelected())wangdaiying = 1;
        var yipaoduoxiang = 0;if(this.getItemByIdx(7,2).isSelected())yipaoduoxiang = 1;


        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }


        if(this.getItemByIdx(8,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(9,0).isSelected()){
            djtg = 1;
        }
        if (this.getItemByIdx(9,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(10,1).isSelected())isDouble = 1;

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var dScore = 0;
        dScore = this.syDScore;
        cc.sys.localStorage.setItem("AHMJ_diScore",dScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("AHMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("AHMJ_allowBoxScore",allowScore);

        var difen = 0;
        difen = this.diFenBox.localScore;
        cc.sys.localStorage.setItem("AHMJ_addDiFen",difen);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.AHMJ, //玩法ID 1
            costway, //支付方式 2
            0,//底分 3
            wang,//王 4
            zhuaniao,//抓鸟 5
            zhaungxian,//庄闲分 6
            renshu, //人数  7（2,3,4）
            wangdaiying,//王代硬 8
            yipaoduoxiang,//一炮多响 9
            autoPlay,//托管时间 10
            djtg,//单局托管 11
            isDouble,//是否加倍 12
            doubleNum,//加倍倍数 13
            morefen,//14 "加xx分"
            allowScore,//15 "低于xx分加多少分"的分数
            dScore,//16 低于多少分加多少分的分数
            niao159,//17 159中鸟
            difen,//18 底分
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 16;
        }

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }


        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }
        return [GameTypeEunmMJ.AHMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[0],[0],[0],[0],[],[1],[],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 16?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 4 ? 0: params[7] == 3?1:2;
        defaultConfig[3][0] = parseInt(params[4])-1;
        defaultConfig[4][0] = parseInt(params[5]);
        defaultConfig[8][0] = params[10]?params[10] == 300?4:params[10]/60:0;
        defaultConfig[9][0] = params[11]== 1 ? 0:params[11]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[10][0] = params[12] == 1?1:0;
        defaultConfig[11][0] = parseInt(params[13])-2;
        if(params[15] && params[15] != 0 && params[16] && params[16] != 0){
            defaultConfig[12].push(0);
        }
        if (params[17] == 1) defaultConfig[5].push(0);

        if (params[6] == 1) defaultConfig[7].push(0);
        if (params[8] == 1) defaultConfig[7].push(1);
        if (params[9] == 1) defaultConfig[7].push(2);

        this.syDScore = parseInt(params[16]) || 5;
        this.addScore = parseInt(params[14])|| 10;
        this.allowScore = parseInt(params[15])||10;
        this.addDiFen = parseInt(params[18])|| 1;

        this.defaultConfig = defaultConfig;
    },
});