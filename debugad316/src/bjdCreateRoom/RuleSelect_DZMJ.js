/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_DZMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(9);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1","10","20"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["可吃","仅自摸","大道","小道","混一色","外飘"],col:3},//3
            {title:"坐飘",type:1,content:["不飘","飘1","飘2","飘3"],col:4},//4
            {title:"封顶",type:1,content:["16","32","64"],col:3},//5
            {title:"底分",type:1,content:["1分","2分","3分","4分","5分"],col:3},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//8
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//9
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//10
            {title:"加分",type:2,content:["低于"]},//11
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[1],[0],[0],[]];
        this.hzDScore = parseInt(cc.sys.localStorage.getItem("DZMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("DZMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("DZMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.DZMJ){
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
        this.getLayoutByIdx(9).visible = false;
        this.getLayoutByIdx(10).visible = false;

        var is2ren = this.getItemByIdx(2,2).isSelected();
        var isjb = this.getItemByIdx(9,1).isSelected();
        var isjf = this.getItemByIdx(11,0).isSelected();

        this.layoutArr[9].setVisible(is2ren);
        this.layoutArr[10].setVisible(is2ren && isjb);
        this.layoutArr[11].setVisible(is2ren);

        this.numBox.setVisible(is2ren && isjb);
        this.addNumBox.itemBox.setVisible(is2ren);
        this.allowNumBox.itemBox.setVisible(is2ren);

        var istg = !this.getItemByIdx(7,0).isSelected();
        this.layoutArr[8].setVisible(istg);

    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        var zsNumArr = [1,4,8];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        for(var i = 0;i<3;++i){
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.hzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.hzDScore;
        // cc.log("temp =,num = ",temp,num);
        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }
        // cc.log("num && num >= 10 && num < 40 ",num && num >= 10 && num < 40)
        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.hzDScore = num - 5;
            }else{
                this.hzDScore = num;
            }
        }else if ( num < 10){
            this.hzDScore = 5;
        }
        cc.log("this.hzDScore =",this.hzDScore);
        this.scoreLabel.setString("小于"+ this.hzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected())jushu = 10;
        if(this.getItemByIdx(0,2).isSelected())jushu = 20;

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

        var zhuaMa = 0;

        var piaofen = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                piaofen = i;
                break;
            }
        }

        var fengding = 16;
        if(this.getItemByIdx(5,1).isSelected())fengding = 32;
        if(this.getItemByIdx(5,2).isSelected())fengding = 64;

        var difen = 1;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                difen = i+1;
                break;
            }
        }

        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(7,4).isSelected())tuoguan = 300;

        var tgType = 2;
        if (this.getItemByIdx(8,0).isSelected()){
            tgType = 1;
        }else if (this.getItemByIdx(8,2).isSelected()){
            tgType = 3;
        }

        var ischi = 0;
        if(this.getItemByIdx(3,0).isSelected())ischi = 1;

        var isZm = 0;
        if(this.getItemByIdx(3,1).isSelected())isZm = 1;

        var dadao = 0;
        if(this.getItemByIdx(3,2).isSelected())dadao = 1;

        var xiaodao = 0;
        if(this.getItemByIdx(3,3).isSelected())xiaodao = 1;

        var hys = 0;
        if(this.getItemByIdx(3,4).isSelected())hys = 1;

        var waipiao = 0;
        if(this.getItemByIdx(3,5).isSelected())waipiao = 1;

        var isjb = 0;
        if(this.getItemByIdx(9,1).isSelected())isjb = 1;


        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                doubleNum = 2 + i;
                break;
            }
        }

        cc.sys.localStorage.setItem("DZMJ_diScore",this.hzDScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("DZMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("DZMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//0 局数
            GameTypeEunmMJ.DZMJ,//1 玩法ID
            costway,//2 支付方式
            zhuaMa,//3 抓码
            piaofen,//4 飘分
            difen,//5 底分
            fengding,//6 封顶
            renshu,//7 人数
            ischi,//8 可吃
            isZm,//9 仅自摸
            dadao,//10 大道
            xiaodao,//11 小道
            hys,//12 混一色
            tuoguan,//13 托管
            tgType,//14 托管类型
            isjb,//15 是否加倍
            this.hzDScore,//16 加倍分
            doubleNum,//17 加倍数
            morefen,//18 "加xx分"
            allowScore,//19 "低于xx分"
            waipiao,//20 外飘
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 10;
        if(this.getItemByIdx(0,1).isSelected())jushu = 20;

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
        return [GameTypeEunmMJ.DZMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0]==20?2:params[0]==10?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;

        defaultConfig[4][0] = params[4] || 0;
        defaultConfig[5][0] = params[6] == 64?2:params[16] == 32?1:0;
        defaultConfig[6][0] = (params[5]-1) || 0;

        defaultConfig[7][0] = params[13]?params[13] == 300?4:params[13]/60:0;
        defaultConfig[8][0] = (params[14]-1) || 1;

        defaultConfig[9][0] = params[15] == 1?1:0;
        defaultConfig[10][0] = params[17]-2;

        if(params[19] > 0)defaultConfig[11].push(0);

        this.hzDScore = parseInt(params[16]);
        
        if(params[8] == 1)defaultConfig[3].push(0);
        if(params[9] == 1)defaultConfig[3].push(1);
        if(params[10] == 1)defaultConfig[3].push(2);
        if(params[11] == 1)defaultConfig[3].push(3);
        if(params[12] == 1)defaultConfig[3].push(4);
        if(params[20] == 1)defaultConfig[3].push(5);


        this.addScore = parseInt(params[18])||10;
        this.allowScore = parseInt(params[19])||10;

        this.defaultConfig = defaultConfig;
    },
});