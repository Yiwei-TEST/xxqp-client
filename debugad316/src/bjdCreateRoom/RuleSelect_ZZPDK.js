/**
 * Created by cyp on 2019/3/21.
 */            
var RuleSelect_ZZPDK = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(15);
        this.createChangeScoreBox(17);//创建低于xx分加xx分
        this.getItemByIdx(17,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},// 0
            {title:"人数选择",type:1,content:["3人","2人"]},// 1
            {title:"局数选择",type:1,content:["5局","8局","10局","15局","20局"],col:5},// 2
            {title:"红10",type:1,content:["不选红10","5分","10分","翻倍"]},// 3
            {title:"玩法选择",type:1,content:["16张(三个A,一个2)","15张(三个K,一个A,一个2)"],col:2},// 4
            {title:"三张",type:2,content:["三张","三带一","三带两单","三带一对"],col:4},// 5
            {title:"报单",type:1,content:["报单顶大","放走包赔"],col:2},// 6
            {title:"炸弹算分",type:1,content:["10分","翻倍","不算分"]},// 7
            {title:"炸弹归属",type:1,content:["打出玩家","获胜玩家"]},// 8
            {title:"翻倍封顶",type:1,content:["1炸封顶","2炸封顶","3炸封顶"]},// 9
            {title:"可选",type:2,content:["显示剩余牌数","三张和飞机可少带接完","首局必出黑桃3","无炸弹","回看","炸弹不可拆","3A算炸弹","允许4带2","允许4带3","4带1为炸"
            ,"三张和飞机可少带出完"],col:2},// 10
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//11
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//12
            {title:"打鸟",type:1,content:["不打鸟","10分","20分","50分"]},//13
            {title:"飘分",type:1,content:["不飘分","每局飘1","每局飘2","飘123","飘235","飘258"],col:3},//14
            {title:"加倍",type:1,content:["不加倍","加倍"]},//15
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//16
            {title:"加分",type:2,content:["低于"]},//17
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[],[0],[0],[0],[0],[1],[1],[0],[0],[0],[0],[0],[]];
        this.diScore = parseInt(cc.sys.localStorage.getItem("ZZPDK_diScore")) || 20;
        this.addScore = parseInt(cc.sys.localStorage.getItem("ZZPDK_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("ZZPDK_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmPK.ZZPDK){
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
        if(tag < 300){
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
        this.allowNumBox = new changeEditBox(["",10,"分"],1);

        this.addLabel = UICtor.cLabel("加",38,null,cc.color(126,49,2));
        this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox.setWidgetPosition(380,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
    },

    updateItemShow:function(){
        if(this.getItemByIdx(1,1).isSelected()){
            // this.layoutArr[6].itemArr[3].setVisible(false);
            this.layoutArr[15].setVisible(true);
            if(this.getItemByIdx(15,0).isSelected()){
                this.layoutArr[16].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[16].setVisible(true);
                this.numBox.visible=true;
            }
            this.layoutArr[17].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(17,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            this.getItemByIdx(6,1).visible = false;
            this.getItemByIdx(6,1).setSelected(false);
            this.getItemByIdx(6,0).setSelected(true);
        }else{
            // this.layoutArr[6].itemArr[3].setVisible(true);
            this.layoutArr[15].setVisible(false);
            this.layoutArr[16].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[17].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
            this.getItemByIdx(6,1).visible = true;
        }

        if (this.getItemByIdx(11,0).isSelected()){
            this.layoutArr[12].visible = false;
        }else{
            this.layoutArr[12].visible = true;
        }

        if(!this.getItemByIdx(13,0).isSelected()){
            this.getItemByIdx(14,0).setSelected(true);
            for (var i= 1;i<6;i++){
                this.getItemByIdx(14,i).setItemState(false);
            }
            for (var i= 1;i<4;i++){
                this.getItemByIdx(13,i).setItemState(true);
            }
        }else{
            for (var i= 1;i<6;i++){
                this.getItemByIdx(14,i).setItemState(true);
            }
        }
        if(!this.getItemByIdx(14,0).isSelected()){
            this.getItemByIdx(13,0).setSelected(true);
            for (var i= 1;i<6;i++){
                this.getItemByIdx(14,i).setItemState(true);
            }
            for (var i= 1;i<4;i++){
                this.getItemByIdx(13,i).setItemState(false);
            }
        }else{
            for (var i= 1;i<4;i++){
                this.getItemByIdx(13,i).setItemState(true);
            }
        }

        if(this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[9].visible = false;
            this.layoutArr[8].visible = true;
        }else if(this.getItemByIdx(7,1).isSelected()){
            this.layoutArr[9].visible = true;
            this.layoutArr[8].visible = false;
        }if(this.getItemByIdx(7,2).isSelected()){
            this.layoutArr[9].visible = false;
            this.layoutArr[8].visible = false;
        }
    },

    updateZsNum:function(){
        var zsNum = 5;
        var zsNumArr = [3,5,5,8,10];
        var temp = 0;
        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        for(var i = 0;i<5;++i){
            var item = this.getItemByIdx(2,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = zsNumArr[temp];
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp]
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        if (this.numBox){
            return
        }
        var lineNum = Math.ceil(this.layoutArr[row].itemArr.length/3);
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 350 + (730/(this.layoutArr[row].itemArr.length));
        BoxBg.y = 70*(lineNum-1)/2 - 70*parseInt(this.layoutArr[row].itemArr.length/3);

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


        // cc.log("this.dnScore =",this.dnScore);
        var scoreLabel = this.scoreLabel = UICtor.cLabel("低于"+this.diScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.diScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 60){
            this.diScore = num;
        }else if ( num < 10){
            this.diScore = 10;
        }
        // cc.log("this.diScore =",this.diScore);
        this.scoreLabel.setString("低于"+ this.diScore + "分");
    },
    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
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

        var jushu = 5;
        var jushuList = [5,8,10,15,20];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                jushu = jushuList[i];
                break;
            }
        }

        
        // if(renshu == 2)heitao3 = 0;

        

        var hongshi = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                hongshi = i;
                break;
            }
        }

        var wanfa = 1;
        if(this.getItemByIdx(4,1).isSelected())wanfa = 2;

        var sandai = 0;
        if(this.getItemByIdx(5,0).isSelected())sandai = 1;

        var sandaiyi = 0;
        if(this.getItemByIdx(5,1).isSelected())sandaiyi = 1;

        var sandaier = 0;
        if(this.getItemByIdx(5,2).isSelected())sandaier = 1;

        var sandaidui = 0;
        if(this.getItemByIdx(5,3).isSelected())sandaidui = 1;

        var baodan = 0;
        if(this.getItemByIdx(6,1).isSelected()) baodan = 1;

        var zdsf = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                zdsf = i;
                break;
            }
        }

        var zdgs = 2;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                zdgs = i;
                break;
            }
        }
        var zdfb = 0;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                zdfb = i;
                break;
            }
        }
        var showCardNum = 0;
        if(this.getItemByIdx(10,0).isSelected())showCardNum = 1;

        var threeFj = 0;
        if(this.getItemByIdx(10,1).isSelected())threeFj = 1;

        var heitao3 = 0;
        if(this.getItemByIdx(10,2).isSelected())heitao3 = 1;

        var wuzhadan = 0;
        if(this.getItemByIdx(10,3).isSelected())wuzhadan = 1;

        var huikan = 0;
        if(this.getItemByIdx(10,4).isSelected())huikan = 1;

        var zdbkc = 1;
        if(this.getItemByIdx(10,5).isSelected())zdbkc = 0;

        var saszd = 0;
        if(this.getItemByIdx(10,6).isSelected())saszd = 1;

        var siDaiEr = 0;
        if(this.getItemByIdx(10,7).isSelected())siDaiEr = 1;
        var siDaiSan = 0;
        if(this.getItemByIdx(10,8).isSelected())siDaiSan = 1;
        var siDaiYi = 0;
        if(this.getItemByIdx(10,9).isSelected())siDaiYi = 1;
        var sdcw = 0;
        if(this.getItemByIdx(10,10).isSelected())sdcw = 1;

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(11,4).isSelected()){
            autoPlay = 300;
        }

        

        var dScore = this.diScore;
        cc.sys.localStorage.setItem("ZZPDK_diScore",dScore);

        var daniao = 0;
        var niaoArr = [0,10,20,50];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(13,i).isSelected()){
                daniao = niaoArr[i];
            }
        }

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(16,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var djtg = 1;
        if (this.getItemByIdx(12,1).isSelected()){
            djtg = 2;
        }else if (this.getItemByIdx(12,2).isSelected()){
            djtg = 3;
        }

        var piaofen = 0;
        for (var i = 0; i < 6; i++) {
            if (this.getItemByIdx(14,i).isSelected()){
                piaofen = i ;
            }
        }
        var isDouble = 0;
        if(this.getItemByIdx(15,1).isSelected())isDouble = 1;

        var morefen = 0;//低于多少分加多少分
        var allowScore = 0;
        if(this.getItemByIdx(17,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        // cc.sys.localStorage.setItem("ZZPDK_addBoxScore",morefen);
        // cc.sys.localStorage.setItem("ZZPDK_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.ZZPDK,//玩法ID 1 
            wanfa,//张数 2 1 16张玩法 2 15张玩法
            siDaiEr,//允许四带二 3
            siDaiSan,//允许四带三 4
            siDaiYi,//四带一为炸 5
            heitao3,//黑桃3 6
            renshu,//人数 7
            showCardNum,//显示剩余牌数 8
            costWay,//支付方式 9
            hongshi,//红10 10
            baodan,//报单 0 报单顶大 1 放走包赔 11
            threeFj,//三张和飞机可少带接完 12
            zdsf,//炸弹算分 0 10分 1 翻倍 2 不算分 13
            zdgs,//炸弹归属 0 打出玩家 1 获胜玩家 14
            zdfb,//炸弹翻倍 0 1炸封顶 1 2炸封顶 2 3炸封顶 15
            sandai,//三张 16
            sandaiyi,//三带一 17
            sandaier,//三带两单 18
            sandaidui,//三带一对 19
            sdcw,//少带出完 20
            autoPlay,//可托管 21
            isDouble,// 是否加倍 0 1 22
            dScore,// 低于多少分加倍 23
            doubleNum,// 加几倍 24
            wuzhadan,//无炸弹 25
            huikan,//回看 26
            djtg,//单局托管 27
            daniao,//打鸟28
            zdbkc,//炸弹不可拆 29
            saszd,//3A算炸弹 30
            piaofen,//飘分 31 
            morefen,//加xx分 32
            allowScore,//低于xx分 33
        ];
        cc.log("data.params = ",JSON.stringify(data.params));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
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

        var jushu = 5;
        var jushuList = [5,8,10,15,20];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                jushu = jushuList[i];
                break;
            }
        }

        var wanfa = 16;
        if(this.getItemByIdx(4,1).isSelected())wanfa = 15;

        return [wanfa,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[0],[0],[0],[0],[],[0],[0],[0],[0],[],[0],[0],[0],[0],[0],[0],[]];
        var jushuList = [5,8,10,15,20];
        var index = jushuList.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
        defaultConfig[1][0] = params[7] == 2 ? 1 : 0;
        defaultConfig[2][0] = index != -1 ? index : 0;
        defaultConfig[3][0] = params[10];
        defaultConfig[4][0] = params[1] == 15 ? 1 : 0;
        defaultConfig[6][0] = params[11];
        defaultConfig[7][0] = params[13];
        defaultConfig[8][0] = params[14];
        defaultConfig[9][0] = params[15];
        defaultConfig[11][0] = params[21] == 1?1:params[21] == 300?4:params[21]/60;
        defaultConfig[12][0] = parseInt(params[27]) - 1 >= 0?parseInt(params[27]) - 1:1;
        defaultConfig[13][0] = params[28] == 10?1:params[28] == 20?2:params[28]==50?3:0;
        defaultConfig[14][0] = parseInt(params[31]);
        defaultConfig[15][0] = params[22] == 1 ? 1 : 0;
        defaultConfig[16][0] = params[24] - 2;

        if(params[16] == "1")defaultConfig[5].push(0);
        if(params[17] == "0")defaultConfig[5].push(1);
        if(params[18] == "1")defaultConfig[5].push(2);
        if(params[19] == "1")defaultConfig[5].push(3);

        if(params[8] == "1")defaultConfig[10].push(0);
        if(params[12] == "0")defaultConfig[10].push(1);
        if(params[6] == "1")defaultConfig[10].push(2);
        if(params[25] == "1")defaultConfig[10].push(3);
        if(params[26] == "1")defaultConfig[10].push(4);
        if(params[29] == "0")defaultConfig[10].push(5);
        if(params[30] == "1")defaultConfig[10].push(6);
        if(params[3] == "1")defaultConfig[10].push(7);
        if(params[4] == "1")defaultConfig[10].push(8);
        if(params[5] == "1")defaultConfig[10].push(9);
        if(params[20] == "1")defaultConfig[10].push(10);

        if(params[32] && parseInt(params[32]) > 0){
            defaultConfig[17].push(0);
        }
        this.diScore = parseInt(params[23]);
        this.addScore = parseInt(params[32])||10;
        this.allowScore = parseInt(params[33])||10;
        this.defaultConfig = defaultConfig;
    },
});