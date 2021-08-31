/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_YJMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(12);
        this.createChangeScoreBox(14);//创建低于xx分加xx分
        this.getItemByIdx(14,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["6局","12局"],col:3},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"],col:3},//2
            {title:"番数上限",type:1,content:["24倍","无上限"],col:3},//3
            {title:"门清",type:1,content:["有门清","无门清"],col:3},//4
            {title:"一字撬",type:1,content:["有喜","没喜"],col:3},//5
            {title:"抓鸟",type:1,content:["抓1鸟","抓2鸟"],col:3},//6
            {title:"卡撬",type:1,content:["卡撬","不卡撬"],col:3},//7
            {title:"玩法",type:2,content:["码码胡"],col:3},//8
            {title:"抽牌",type:1,content:["不抽牌","抽13张","抽26张"],col:3},//9
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//10
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//11
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//12
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//13
            {title:"加分",type:2,content:["低于"]},//14
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[],[2],[0],[1],[0],[0],[]];
        this.csDScore = parseInt(cc.sys.localStorage.getItem("YJMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("YJMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("YJMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.YJMJ){
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
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[12].setVisible(true);
            if(this.getItemByIdx(12,0).isSelected()){
                this.layoutArr[13].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[13].setVisible(true);
                this.numBox.visible=true;

            }
            this.layoutArr[14].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(13,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            is2ren = true;
        }else{
            this.layoutArr[12].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[14].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        var isyouxi = this.getItemByIdx(5,0).isSelected();
        this.layoutArr[7].setVisible(isyouxi);

        this.layoutArr[9].setVisible(is2ren);

        var istg = !this.getItemByIdx(10,0).isSelected();
        this.layoutArr[11].setVisible(istg);
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 0;
        var zsNumArr = [5,10];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
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
                zsNum = zsNumArr[temp];
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.csDScore+"分",38,null,cc.color(126,49,2));
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
        var num = this.csDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.csDScore = num - 5;
            }else{
                this.csDScore = num;
            }
        }else if ( num < 10){
            this.csDScore = 5;
        }
        cc.log("this.csDScore =",this.csDScore);
        this.scoreLabel.setString("小于"+ this.csDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 6;
        if(this.getItemByIdx(0,1).isSelected())jushu = 12;

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

        var fanshu = 1;
        if(this.getItemByIdx(3,1).isSelected())fanshu = 0;

        var menqing = 1;
        if(this.getItemByIdx(4,1).isSelected())menqing = 0;

        var youxi = 1;
        if(this.getItemByIdx(5,1).isSelected())youxi = 0;

        var kaqiao = 1;
        if(this.getItemByIdx(7,1).isSelected())kaqiao = 0;

        var mamahu = 0;
        if(this.getItemByIdx(8,0).isSelected())mamahu = 1;

        var birdNum = 1;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                birdNum = i+1;
                break;
            }
        }

        var isDouble = 0;
        if(this.getItemByIdx(12,1).isSelected()){
            isDouble = 1;
        }

        var csDScore = this.csDScore;
        cc.sys.localStorage.setItem("YJMJ_diScore",csDScore);
        var csDoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(13,i).isSelected()){
                csDoubleNum = 2 + i;
                break;
            }
        }

        var choupai = 0;
        if(renshu == 2){
            if(this.getItemByIdx(9,1).isSelected())choupai = 13;
            if(this.getItemByIdx(9,2).isSelected())choupai = 26;
        }

        var csTuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                csTuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(10,4).isSelected()){
            csTuoguan = 300;
        }
        var csDjtg = 2;
        if (this.getItemByIdx(11,0).isSelected()){
            csDjtg = 1;
        }else if (this.getItemByIdx(11,2).isSelected()){
            csDjtg = 3;
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(14,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("YJMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("YJMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.YJMJ,//玩法ID 1
            fanshu,//番数上限 2
            menqing,//门清 3
            birdNum,//抓鸟数 4
            youxi,//是否有喜 5
            kaqiao,//卡撬 6
            renshu,//人数 7
            0, // 8
            0, // 9
            costway,//支付方式 10

            csTuoguan,//托管时间//11
            csDjtg,//单局托管，和整局托管//12

            isDouble,//是否加倍 13
            csDScore,// 加倍分 14
            csDoubleNum,// 加倍数 15

            morefen,//16 "加xx分"
            allowScore,//17 "低于xx分"
            choupai,//18 抽牌
            mamahu,//19 码码胡
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 6;
        if(this.getItemByIdx(0,1).isSelected())jushu = 8;

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
        return [GameTypeEunmMJ.YJMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[],[2],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 12?1:0;
        defaultConfig[1][0] = params[10] == 3||params[10] == 4?0:params[10] - 1;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;
        defaultConfig[3][0] = params[2] == 1?0:1;
        defaultConfig[4][0] = params[3] == 1?0:1;
        defaultConfig[5][0] = params[5] == 1?0:1;
        defaultConfig[6][0] = (params[4]-1) || 0;
        defaultConfig[7][0] = params[6] == 1?0:1;

        if(params[19] == 1)defaultConfig[8].push(0);

        defaultConfig[9][0] = params[18] == 13?1:params[18]==26?2:0;

        defaultConfig[10][0] = params[11]?params[11] == 300?4:params[11]/60:0;
        defaultConfig[11][0] = params[12]== 1 ? 0:params[12]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[12][0] = params[13] == 1?1:0;
        defaultConfig[13][0] = params[15] -2;

        if(params[16] && parseInt(params[16]) > 0)defaultConfig[14].push(0);
        this.csDScore = parseInt(params[14]) || 5;


        this.addScore = parseInt(params[16])||10;
        this.allowScore = parseInt(params[17])||10;
        this.defaultConfig = defaultConfig;
    },
});