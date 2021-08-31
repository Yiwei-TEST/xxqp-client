 /**
 * Created by cyp on 2019/3/20.
 */
var RuleSelect_HYSHK = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(14);
        this.createChangeScoreBox(16);//创建低于xx分加xx分
        this.updateItemShow();
        this.getItemByIdx(7,9).visible = false;
        this.getItemByIdx(7,11).x = this.getItemByIdx(7,10).x;
        this.getItemByIdx(7,10).x = this.getItemByIdx(7,9).x;
        this.getItemByIdx(16,0).itemBtn.setContentSize(80,40);
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"人数",type:1,content:["3人","2人"]},//1
            {title:"局数",type:1,content:["1局","8局","10局","20局"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//3
            {title:"醒",type:1,content:["不带醒","跟醒","翻醒"]},//4
            {title:"必胡",type:1,content:["无","有胡必胡","放炮必胡"]},//5
            {title:"放炮",type:1,content:["放炮1倍","放炮2倍","放炮3倍"]},//6
            {title:"玩法",type:2,content:["海底胡","一五十","飘胡","红黑点","天胡","地胡","自摸翻倍","一点红三倍","可胡示众牌","加锤","明偎","21张"]},//7
            {title:"底分",type:1,content:["底分1分","底分2分","底分3分"],col:3},//8
            {title:"玩法",type:1,content:["10红3倍/13红5倍","10红3倍多1红+3胡"],col:3},//9
            {title:"坐庄",type:1,content:["随机","先进房坐庄"],col:3},//10
            {title:"明龙",type:1,content:["出牌后明龙","发牌后明龙"],col:3},//11
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//12
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//13
            {title:"加倍",type:1,content:["不加倍","加倍"]},//14
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//15
            {title:"加分",type:2,content:["低于"]},//16
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[10,11],[0],[0],[0],[0],[0],[1],[0],[0],[]];
        // this.defaultConfig[7].push(10);
        this.dnScore = parseInt(cc.sys.localStorage.getItem("HYSHK_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("HYSHK_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("HYSHK_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.HYSHK){
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

         this.addLabel = UICtor.cLabel("加",38,null,cc.color(126,49,2));
         //this.addLabel.setAnchorPoint(0.5,0.5);
         this.addLabel.setPosition(770,0);
         this.layoutArr[row].addChild(this.addLabel);

         this.allowNumBox = new changeEditBox(["",10,"分"],1);
         this.allowNumBox.setWidgetPosition(380,0);
         this.allowNumBox.setScoreLabel(this.allowScore);
         this.layoutArr[row].addChild(this.allowNumBox);
     },

    updateItemShow:function(){
        if(this.getItemByIdx(1,1).isSelected()){
            this.layoutArr[3].visible = true;
            this.layoutArr[14].visible = true;
            if (this.getItemByIdx(14,1).isSelected()){
                this.layoutArr[15].visible = this.numBox.visible = true;
            }else{
                this.layoutArr[15].visible = this.numBox.visible = false;
            }
            this.layoutArr[16].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(16,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[3].visible = false;
            this.layoutArr[14].visible = false;
            this.layoutArr[15].visible = false;
            this.numBox.visible = false;
            this.layoutArr[16].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if (this.getItemByIdx(12,0).isSelected()){
            this.layoutArr[13].visible = false;
        }else{
            this.layoutArr[13].visible = true;
        }

        if (this.getItemByIdx(7,3).isSelected()){
            this.layoutArr[9].visible = true;
        }else{
            this.layoutArr[9].visible = false;
        }

        this.getItemByIdx(7,7).setItemState(this.getItemByIdx(7,3).isSelected());
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        var renshu = 3;
        var zsNumArr = [4,4,4,8];
        var temp = 0;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        for(var i = 0;i<4;++i){
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
                zsNum = zsNumArr[temp];
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

     updateDouziNum:function(){
         var renshu = 3;
         for(var i = 0;i<2;++i){
             if(this.getItemByIdx(1,i).isSelected()){
                 renshu = 3-i;
                 break;
             }
         }

         var temp = 0;
         for(var i = 0;i<4;++i){
             var item = this.getItemByIdx(2,i);
             if(item.isSelected()){
                 temp = i;
                 break;
             }
         }

         var configArr = [
             {2:2500,3:1700},{2:2500,3:1700},{2:2500,3:1700},{2:4500,3:3000}
         ]

         var num = configArr[temp][renshu];

         this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
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
        this.scoreLabel.setString("小于"+this.dnScore + "分");
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

        var jushu = 1;
        if (this.getItemByIdx(2,1).isSelected()){
            jushu = 8;
        }
        if (this.getItemByIdx(2,2).isSelected()){
            jushu = 10;
        }
        if (this.getItemByIdx(2,3).isSelected()){
            jushu = 20;
        }

        var choupai = 0;
        var choupaiArr = [0,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                choupai = choupaiArr[i];
                break;
            }
        }

        var xing = 0;
        for (var i = 0; i < 3; i++) {
            if(this.getItemByIdx(4,i).isSelected()){
                xing = i;
                break;
            }
        }

        var bihu = 0;
        for (var i = 0; i < 3; i++) {
            if(this.getItemByIdx(5,i).isSelected()){
                bihu = i;
                break;
            }
        }

        var fangpao = 1;
        for (var i = 0; i < 3; i++) {
            if(this.getItemByIdx(6,i).isSelected()){
                fangpao = i + 1;
                break;
            }
        }

        var hdh = 0; if(this.getItemByIdx(7,0).isSelected()) hdh = 1;
        var ywh = 0; if(this.getItemByIdx(7,1).isSelected()) ywh = 1;
        var ph = 0; if(this.getItemByIdx(7,2).isSelected()) ph = 1;
        var hhd = 0; if(this.getItemByIdx(7,3).isSelected()) hhd = 1;
        var th = 0; if(this.getItemByIdx(7,4).isSelected()) th = 1;
        var dh = 0; if(this.getItemByIdx(7,5).isSelected()) dh = 1;
        var zmfb = 0; if(this.getItemByIdx(7,6).isSelected()) zmfb = 1;
        var ydhsb = 0; if(this.getItemByIdx(7,7).isSelected()) ydhsb = 1;
        var khszp = 0; if(this.getItemByIdx(7,8).isSelected()) khszp = 1;
        var jc = 0; if(this.getItemByIdx(7,9).isSelected()) jc = 1;
        var mw = 0; if(this.getItemByIdx(7,10).isSelected()) mw = 1;
        // var morefen = 0; if(this.getItemByIdx(7,11).isSelected()) morefen = 1;
        var esyz = 0; if(this.getItemByIdx(7,11).isSelected()) esyz = 1;

        var difen = 0;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                difen = i;
                break;
            }
        }

        var shsb = 1;if(this.getItemByIdx(9,1).isSelected()) shsb = 2;

        var zuozhuang = 0;
        if (this.getItemByIdx(10,1).isSelected()) zuozhuang = 1;

        var minglong = 1;
        if (this.getItemByIdx(11,1).isSelected()) minglong = 2;
        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(12,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(12,4).isSelected()){
            autoPlay = 300;
        }
        var djtg = 2;
        if (this.getItemByIdx(13,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(13,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(14,1).isSelected())isDouble = 1;

        var dScore = 0;
        dScore = this.dnScore;
        cc.sys.localStorage.setItem("HYSHK_diScore",dScore);

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(15,i).isSelected()){
                doubleNum = 2 + i;
            }
        }
        

        var morefen = 0;
        var allowScore = 0;
        if(this.getItemByIdx(16,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("HYSHK_addBoxScore",morefen);
        cc.sys.localStorage.setItem("HYSHK_allowBoxScore",allowScore);


        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.HYSHK,//玩法ID 1
            0,0,0,0,0,
            renshu,//人数 7
            200,
            costWay,//支付方式 9
            xing,//醒 0 1 2 10
            bihu,//必胡 0 1有胡必胡 2放炮必胡 11
            fangpao,//放炮 1 2 3 倍 12
            hdh,//海底胡 13
            ywh,//一五十 14
            ph,//飘胡 15
            hhd,//红黑点 16
            th,//天胡 17
            dh,//地胡 18
            zmfb,//自摸翻倍 19
            ydhsb,//一点红三倍 20
            khszp,//可胡示众牌 21
            jc,//加锤 22
            esyz,//21张 23
            shsb,//十红三倍 1 13红五背 2 多一红+3胡 24
            zuozhuang,//坐庄 0 随机 1先进房坐庄 25
            choupai,//抽牌 0张 10张 20张 26
            autoPlay,// 托管 27
            djtg,// 1 单局托管 2整局托管 28 
            isDouble,//加倍  29
            dScore,//低于多少分加倍 30
            doubleNum,//加倍倍数 31
            difen,//底分2分 32
            morefen,//加xx分 33
            minglong,//明龙 1 出牌 2 发牌 34
            allowScore, //低于xx分  35
            mw,//明偎 36
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
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
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var jushu = 1;
        if (this.getItemByIdx(2,1).isSelected()){
            jushu = 8;
        }
        if (this.getItemByIdx(2,2).isSelected()){
            jushu = 10;
        }
        if (this.getItemByIdx(2,3).isSelected()){
            jushu = 20;
        }
        return [GameTypeEunmZP.HYSHK,costWay,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[],[0],[0],[0],[0],[0],[1],[0],[0],[]];

        var inningArr = [1,8,10,20];
        var index = inningArr.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
        defaultConfig[1][0] = params[7] == 3 ? 0: 1;
        defaultConfig[2][0] = index > - 1 ? index : 0;//params[0] == 20?1:0;
        defaultConfig[3][0] = parseInt(params[26])/10;
        defaultConfig[4][0] = parseInt(params[10]);
        defaultConfig[5][0] = parseInt(params[11]);
        defaultConfig[6][0] = parseInt(params[12])-1;
        defaultConfig[8][0] = parseInt(params[32]);
        defaultConfig[9][0] = parseInt(params[24])-1;
        defaultConfig[10][0] = parseInt(params[25]);
        defaultConfig[11][0] = parseInt(params[34]) - 1;
        defaultConfig[12][0] = params[27] == 300?4:params[27]/60;
        defaultConfig[13][0] = parseInt(params[28])-1 >= 0 ? parseInt(params[28])-1 : 1;
        defaultConfig[14][0] = parseInt(params[29]);
        defaultConfig[15][0] = parseInt(params[31])-2;
        this.dnScore = params[30]?parseInt(params[30]):5;

        if(params[13] == "1")defaultConfig[7].push(0);
        if(params[14] == "1")defaultConfig[7].push(1);
        if(params[15] == "1")defaultConfig[7].push(2);
        if(params[16] == "1")defaultConfig[7].push(3);
        if(params[17] == "1")defaultConfig[7].push(4);
        if(params[18] == "1")defaultConfig[7].push(5);
        if(params[19] == "1")defaultConfig[7].push(6);
        if(params[20] == "1")defaultConfig[7].push(7);
        if(params[21] == "1")defaultConfig[7].push(8);
        if(params[22] == "1")defaultConfig[7].push(9);
        if(params[36] == "1")defaultConfig[7].push(10);
        if(params[23] == "1")defaultConfig[7].push(11);

        if(params[33] && parseInt(params[33]) > 0){
            defaultConfig[16].push(0);
        }
        this.addScore = parseInt(params[33])||10;
        this.allowScore = parseInt(params[35])||10;
        this.defaultConfig = defaultConfig;
    },
});