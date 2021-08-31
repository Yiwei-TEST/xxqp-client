 /**
 * Created by cyp on 2019/3/20.
 */
var RuleSelect_LYZP = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(7);
        this.createChangeScoreBox(9);//创建低于xx分加xx分
        this.getItemByIdx(9,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
        this.getItemByIdx(3,0).visible = false;
        this.getItemByIdx(3,3).x = this.getItemByIdx(3,2).x;
        // this.getItemByIdx(3,3).y = this.getItemByIdx(3,2).y;
        this.getItemByIdx(3,2).x = this.getItemByIdx(3,1).x;
        this.getItemByIdx(3,1).x = this.getItemByIdx(3,0).x;

    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"人数",type:1,content:["3人","2人"]},//1
            {title:"局数",type:1,content:["8局","16局"]},//2
            {title:"玩法",type:2,content:["举手做声","不带无胡","不带一点红","吃边打边"],col:4},//3
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//4
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//5
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//6
            {title:"加倍",type:1,content:["不加倍","加倍"]},//7
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//8
            {title:"加分",type:2,content:["低于"]},//9
            // {title:"翻倍上限",type:1,content:["小于20分","小于30分","小于40分","小于50分"]}//9
        ];

        this.defaultConfig = [[1],[0],[0],[],[0],[0],[1],[0],[0],[]];
        this.lyzpDScore = parseInt(cc.sys.localStorage.getItem("LYZP_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("LYZP_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("LYZP_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.LYZP){
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
        // if(tag < 200){
            this.updateZsNum();
        // }

        // var tagArr = [100,101,102,201,500,501];
        // if(ArrayUtil.indexOf(tagArr,tag) != -1){
            this.updateItemShow();
        // }
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
            this.layoutArr[7].setVisible(true);
            this.layoutArr[4].setVisible(true);

            if(this.getItemByIdx(7,0).isSelected()){
                this.layoutArr[8].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.numBox.setVisible(true);
                this.layoutArr[8].setVisible(true);
            }
            this.layoutArr[9].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(9,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[7].setVisible(false);
            this.layoutArr[8].setVisible(false);
            this.numBox.setVisible(false);
            this.layoutArr[4].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if (this.getItemByIdx(5,0).isSelected()){
            this.layoutArr[6].setVisible(false);
        }else{
            this.layoutArr[6].setVisible(true);
        }
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
        cc.log("this.lyzpDScore =",this.lyzpDScore);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.lyzpDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
     onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.lyzpDScore;
        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.lyzpDScore = num;
        }
        // cc.log("this.lyzpDScore =",this.lyzpDScore);
        this.scoreLabel.setString("小于"+ this.lyzpDScore + "分");
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [4,8];
        var renshu = 3; 
        var temp = 0;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }
        for(var i = 0;i<2;++i){
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
         for(var i = 0;i<2;++i){
             var item = this.getItemByIdx(2,i);
             if(item.isSelected()){
                 temp = i;
                 break;
             }
         }

         var configArr = [
             {2:3000,3:2000},{2:5000,3:3400}
         ]

         var num = configArr[temp][renshu];

         this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
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

        var jushu = 8;
        if(this.getItemByIdx(2,1).isSelected())jushu = 16; 


        var jszs = 0;
        // if(this.getItemByIdx(3,0).isSelected())jszs = 1;

        var bdwh = 0;
        if(this.getItemByIdx(3,1).isSelected())bdwh = 1;
        var bdydh = 0;
        if(this.getItemByIdx(3,2).isSelected())bdydh = 1;
        var cbdb = 0;
        if(this.getItemByIdx(3,3).isSelected())cbdb = 1;


        var choupai = 0;
        var choupaiArr = [0,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                choupai = choupaiArr[i]; 
                break; 
            }
        }

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(5,4).isSelected()){
            autoPlay = 300;
        }

        var isDouble = 0;
        if(this.getItemByIdx(7,1).isSelected())isDouble = 1;

        var dScore = 0;
        dScore = this.lyzpDScore;
        // for(var i = 0;i<4;++i){
        //     if(this.getItemByIdx(9,i).isSelected()){
        //         dScore = 20 + i*10;
        //         break;
        //     }
        // }

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                doubleNum = 2 + i;
            }
        }
        var djtg = 2;
        if (this.getItemByIdx(6,0).isSelected()){
            djtg = 1;
        }else  if (this.getItemByIdx(6,2).isSelected()){
            djtg = 3;
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(9,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("LYZP_addBoxScore",morefen);
        cc.sys.localStorage.setItem("LYZP_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.LYZP,//玩法ID 1
            0,0,0,0,0,
            renshu,//人数 7
            200,
            costWay,//支付方式 9
            jszs,//举手做声 10 
            bdwh,//不带无胡 11
            bdydh,//不带一点红 12
            cbdb,//吃边打边 13
            choupai,//抽牌 14
            autoPlay,//可托管 15
            isDouble,//是否翻倍 16
            dScore,//翻倍上限 17 
            doubleNum,//翻倍倍数 18
            djtg,//单局托管 19
            0,//占位
            morefen,//21 "加xx分"
            allowScore,//22 "低于xx分"
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

        var jushu = 8;
        if(this.getItemByIdx(2,1).isSelected())jushu = 16; 

        return [GameTypeEunmZP.LYZP,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[0],[0],[],[0],[0],[0],[0],[0],[]];
        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
        defaultConfig[1][0] = params[7] == 3?0:1;
        defaultConfig[2][0] = params[0] == 16?1:0;
        defaultConfig[4][0] = params[14] == 10 ? 1 :params[14]==20?2: 0;
        defaultConfig[5][0] = params[15]==1?1:params[15] == 300?4:params[15]/60;
        defaultConfig[6][0] = params[19]== 1 ? 0:params[19]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[7][0] = params[16] == 1 ? 1 :0;
        defaultConfig[8][0] = params[18] == 3 ? 1 :params[18]==4?2:0;
        this.lyzpDScore = params[17]?parseInt(params[17]):10;
        if(params[21] && parseInt(params[21]) > 0){
            defaultConfig[9].push(0);
        }
        if(params[10] == "1")defaultConfig[3].push(0);
        if(params[11] == "1")defaultConfig[3].push(1);
        if(params[12] == "1")defaultConfig[3].push(2);
        if(params[13] == "1")defaultConfig[3].push(3);
        this.addScore = parseInt(params[21])||10;
        this.allowScore = parseInt(params[22])||10;
        this.defaultConfig = defaultConfig;
    },
});