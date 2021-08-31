 /**
 * Created by cyp on 2019/3/20.
 */
var RuleSelect_HYLHQ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox();//创建低于xx分加xx分
        this.getItemByIdx(12,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"人数",type:1,content:["4人","3人","2人"]},//1
            {title:"局数",type:1,content:["1局","8局","10局","20局"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//3
            {title:"醒",type:1,content:["不带醒","跟醒","翻醒"]},//4
            {title:"玩法",type:2,content:["1息1屯","一五十","明偎","红黑点","天胡","地胡","自摸翻倍","放炮包赔","放炮必胡","有胡必胡","底分2分","21张","红黑2番"]},//5
            {title:"起胡",type:1,content:["6胡息","9胡息","15胡息"],col:3},//6
            {title:"坐庄",type:1,content:["随机","先进房坐庄"],col:3},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//9
            {title:"加倍",type:1,content:["不加倍","加倍"]},//10
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//11
            {title:"加分",type:2,content:["低于"]},//12
        ]; 

        this.defaultConfig = [[1],[0],[0],[0],[0],[2,9],[0],[0],[0],[1],[0],[0],[]];
        this.dnScore = parseInt(cc.sys.localStorage.getItem("HYLHQ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("HYLHQ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("HYLHQ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.HYLHQ){
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
        this.updateItemShow(item);
    },

     createChangeScoreBox:function(){
         this.addNumBox = new changeEditBox(["",10,"分"],1);
         //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
         this.addNumBox.setWidgetPosition(850,0);//设置位置
         this.addNumBox.setScoreLabel(this.addScore);//设置初始值
         this.layoutArr[12].addChild(this.addNumBox);

         this.addLabel = UICtor.cLabel("加",38,null,cc.color(126,49,2));
         //this.addLabel.setAnchorPoint(0.5,0.5);
         this.addLabel.setPosition(770,0);
         this.layoutArr[12].addChild(this.addLabel);

         this.allowNumBox = new changeEditBox(["",10,"分"],1);
         this.allowNumBox.setWidgetPosition(380,0);
         this.allowNumBox.setScoreLabel(this.allowScore);
         this.layoutArr[12].addChild(this.allowNumBox);
    },

    updateItemShow:function(item){
        if(this.getItemByIdx(1,2).isSelected()){
            this.layoutArr[3].visible = true;
            this.layoutArr[10].visible = true;
            if (this.getItemByIdx(10,1).isSelected()){
                this.layoutArr[11].visible = this.numBox.visible = true;
            }else{
                this.layoutArr[11].visible = this.numBox.visible = false;
            }
            this.layoutArr[12].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(12,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[3].visible = false;
            this.layoutArr[10].visible = false;
            this.layoutArr[11].visible = false;
            this.numBox.visible = false;
            this.layoutArr[12].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if (this.getItemByIdx(1,0).isSelected()){
            this.getItemByIdx(5,11).visible = false;
            this.getItemByIdx(5,11).setSelected(false);
        }else{
            this.getItemByIdx(5,11).visible = true;
        }

        if (this.getItemByIdx(8,0).isSelected()){
            this.layoutArr[9].visible = false;
        }else{
            this.layoutArr[9].visible = true;
        }

        if(this.getItemByIdx(5,0).isSelected()){
            this.getItemByIdx(5,12).visible = true;
        }else{
            this.getItemByIdx(5,12).visible = false;
            this.getItemByIdx(5, 12).setSelected(false);
        }
        if (this.getItemByIdx(5,3) == item){
            this.getItemByIdx(5,12).setSelected(false);
        }else if (this.getItemByIdx(5,12) == item){
            this.getItemByIdx(5,3).setSelected(false);
        }
    },  

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        var renshu = 4;
        var zsNumArr = [4,4,4,8];
        var temp = 0;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 4-i;
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
         var renshu = 4;
         for(var i = 0;i<3;++i){
             if(this.getItemByIdx(1,i).isSelected()){
                 renshu = 4-i;
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
             {2:2500,3:1700,4:1300},{2:2500,3:1700,4:1300},{2:2500,3:1700,4:1300},{2:4500,3:3000,4:2300}
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

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 4-i;
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

        var yxyt = 0;
        if (this.getItemByIdx(5,0).isSelected()) yxyt = 1;
        var ywh = 0;
        if (this.getItemByIdx(5,1).isSelected()) ywh = 1;
        var mw = 0;
        if (this.getItemByIdx(5,2).isSelected()) mw = 1;
        var hhd = 0;
        if (this.getItemByIdx(5,3).isSelected()) hhd = 1;
        var th = 0;
        if (this.getItemByIdx(5,4).isSelected()) th = 1;
        var dh = 0;
        if (this.getItemByIdx(5,5).isSelected()) dh = 1;
        var zmfb = 0;
        if (this.getItemByIdx(5,6).isSelected()) zmfb = 1;
        var fpbp = 0;
        if (this.getItemByIdx(5,7).isSelected()) fpbp = 1;
        var fpbh = 0;
        if (this.getItemByIdx(5,8).isSelected()) fpbh = 1;
        var yhbh = 0;
        if (this.getItemByIdx(5,9).isSelected()) yhbh = 1;
        var df2f = 0;
        if (this.getItemByIdx(5,10).isSelected()) df2f = 1;
        var eyz = 0;
        if (this.getItemByIdx(5,11).isSelected()) eyz = 1;
        var hh2f = 0;
        if (this.getItemByIdx(5,12).isSelected()) hh2f = 1;

        var qihu = 6;
        if (this.getItemByIdx(6,1).isSelected()) qihu = 9;
        if (this.getItemByIdx(6,2).isSelected()) qihu = 15;

        var zuozhuang = 0;
        if (this.getItemByIdx(6,1).isSelected()) zuozhuang = 1;
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
        }else if (this.getItemByIdx(9,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(10,1).isSelected())isDouble = 1;

        var dScore = 0;
        dScore = this.dnScore;
        cc.sys.localStorage.setItem("HYLHQ_diScore",dScore);

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var morefen = 0;
        var allowScore = 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("HYLHQ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("HYLHQ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.HYLHQ,//玩法ID 1
            hh2f,// 红黑2番 2
            0,0,0,0,
            renshu,//人数 7
            200,
            costWay,//支付方式 9
            xing,//醒 0不带醒 1跟醒 2翻醒 10
            yxyt,//一息一囤 11
            ywh,//一五十 12
            mw,//明偎 13
            hhd,//红黑点 14
            th,//天胡 15
            dh,//地胡 16
            zmfb,//自摸翻倍 17
            fpbp,//放炮包赔 18
            fpbh,//放炮必胡 19
            eyz,//21张 20
            qihu,//起胡胡息 6 9 15 21 
            zuozhuang,//坐庄 0 随机 1先进房坐庄 22
            choupai,//抽牌 0张 20张 23
            autoPlay,// 托管 24
            djtg,// 1 单局托管 2整局托管 25 
            isDouble,//加倍  26
            dScore,//低于多少分加倍 27
            doubleNum,//加倍倍数 28
            yhbh,//有胡必胡 0 1 29
            df2f,//底分2分 0 1  30
            morefen,// 加xx分 31
            allowScore,//低于xx分  32
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

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 4-i;
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
        return [GameTypeEunmZP.HYLHQ,costWay,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[0],[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];

        var inningArr = [1,8,10,20];
        var index = inningArr.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
        defaultConfig[1][0] = params[7] == 3 ? 1:params[7] == 2 ? 2: 0;
        defaultConfig[2][0] = index > - 1 ? index : 0;
        defaultConfig[3][0] = parseInt(params[23])/10;
        defaultConfig[4][0] = parseInt(params[10]);
        defaultConfig[6][0] = params[21] == 15?2:params[21] == 9?1:0;
        defaultConfig[7][0] = parseInt(params[22]);
        defaultConfig[8][0] = params[24] == 300?4:params[24]/60;
        defaultConfig[9][0] = parseInt(params[25])-1 >= 0 ? parseInt(params[25])-1 : 1;
        defaultConfig[10][0] = parseInt(params[26]);
        defaultConfig[11][0] = parseInt(params[28])-2;

        this.dnScore = params[27]?parseInt(params[27]):5;

        if(params[11] == "1")defaultConfig[5].push(0);
        if(params[12] == "1")defaultConfig[5].push(1);
        if(params[13] == "1")defaultConfig[5].push(2);
        if(params[14] == "1")defaultConfig[5].push(3);
        if(params[15] == "1")defaultConfig[5].push(4);
        if(params[16] == "1")defaultConfig[5].push(5);
        if(params[17] == "1")defaultConfig[5].push(6);
        if(params[18] == "1")defaultConfig[5].push(7);
        if(params[19] == "1")defaultConfig[5].push(8);
        if(params[29] != "0")defaultConfig[5].push(9);
        if(params[30] == "1")defaultConfig[5].push(10);
        if(params[20] == "1")defaultConfig[5].push(11);
        if(params[2] == "1")defaultConfig[5].push(12);

        if(params[31] && parseInt(params[31]) > 0){
            defaultConfig[12].push(0);
        }
        this.addScore = parseInt(params[31])||10;
        this.allowScore = parseInt(params[32])||10;
        this.defaultConfig = defaultConfig;
    },
});