/**
 * Created by Administrator on 2020/1/19.
 */

var RuleSelect_CDPHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox(12);//创建低于xx分加xx分
        this.getItemByIdx(12,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","16局"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"底分",type:1,content:["1分","2分","3分","4分","5分"],col:5},//3
            {title:"分数上限",type:1,content:["无","100","200","300","500"]},//4
            {title:"玩法",type:1,content:["全名堂","红黑点","多红多番"]},//5
            {title:"",type:2,content:["大团圆","行行息","假行行","四七红","听胡","耍猴",
                "海胡","背靠背","亮张","首局随机庄","三提五坎","天地胡",
                "红黑胡","点胡","大小字胡","对子胡","黄番"]},//6
            {title:"抽牌",type:1,content:["不抽牌","抽10张","抽20张"]},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//9
            {title:"加倍",type:1,content:["不加倍","加倍"]},//10
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//11
            {title:"加分",type:2,content:["低于"]}//12
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0,1,2,3,4,5,6,7,10,11,12,13,14,15,16],[0],[0],[1],[0],[0],[]];
        this.glzpDScore = parseInt(cc.sys.localStorage.getItem("CDPHZ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("CDPHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("CDPHZ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.CDPHZ){
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
            this.layoutArr[10].setVisible(true);
            if(this.getItemByIdx(10,0).isSelected()){
                this.layoutArr[11].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[11].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[12].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(12,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            this.layoutArr[7].setVisible(true);
        }else{
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.layoutArr[12].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
            this.layoutArr[7].setVisible(false);
        }
        if(this.getItemByIdx(8,0).isSelected()){
            this.layoutArr[9].setVisible(false);
        }else{
            this.layoutArr[9].setVisible(true);
        }

        var isQmt = this.getItemByIdx(5,0).isSelected();
        for(var i = 0;i<17;++i){
            if(i == 8 || i == 9)continue;
            this.getItemByIdx(6,i).setItemState(isQmt);
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
        var renshu = 3;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(1,i);
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
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(1,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000},{2:5000,3:3300}
        ]

        var num = configArr[temp][renshu];

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


        var wanfa = 1;//全名堂
        if(this.getItemByIdx(5,1).isSelected())wanfa = 2;//红黑点
        if(this.getItemByIdx(5,2).isSelected())wanfa = 3;//多红多番


        var lbf = 0;

        var dty = 0;
        if(this.getItemByIdx(6,0).isSelected())dty = 1;//大团圆

        var hhx = 0;
        if(this.getItemByIdx(6,1).isSelected())hhx = 1;//行行息

        var jhh = 0;
        if(this.getItemByIdx(6,2).isSelected())jhh = 1;//假行行

        var sqh = 0;
        if(this.getItemByIdx(6,3).isSelected())sqh = 1;//四七红

        var tinghu = 0;
        if(this.getItemByIdx(6,4).isSelected())tinghu = 1;//听胡

        var shuahou = 0;
        if(this.getItemByIdx(6,5).isSelected())shuahou = 1;//耍猴

        var haihu = 0;
        if(this.getItemByIdx(6,6).isSelected())haihu = 1;//海胡

        var bkb = 0;
        if(this.getItemByIdx(6,7).isSelected())bkb = 1;//背靠背

        var liangzhang = 0;
        if(this.getItemByIdx(6,8).isSelected())liangzhang = 1;//亮张

        var zhuang = 0;//首局随机庄家
        if(this.getItemByIdx(6,9).isSelected())zhuang = 1;

        var stwk = 0;//三提五砍
        if(this.getItemByIdx(6,10).isSelected())stwk = 1;

        var tiandihu = 0;//天地胡
        if(this.getItemByIdx(6,11).isSelected())tiandihu = 1;

        var hongheihu = 0;//红黑胡
        if(this.getItemByIdx(6,12).isSelected())hongheihu = 1;

        var dianhu = 0;//点胡
        if(this.getItemByIdx(6,13).isSelected())dianhu = 1;

        var daxiaozihu = 0;//大小字胡
        if(this.getItemByIdx(6,14).isSelected())daxiaozihu = 1;

        var duizihu = 0;//对子胡
        if(this.getItemByIdx(6,15).isSelected())duizihu = 1;

        var huangfan = 0;//黄番
        if(this.getItemByIdx(6,16).isSelected())huangfan = 1;

        var choupai = 0;
        if(this.getItemByIdx(7,1).isSelected()){
            choupai = 10;
        }else if(this.getItemByIdx(7,2).isSelected()){
            choupai = 20;
        }

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

        var dScore = this.glzpDScore;
        cc.sys.localStorage.setItem("CDPHZ_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,1).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(11,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("CDPHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("CDPHZ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.CDPHZ,//玩法ID 1
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
            hhx,// 19  行行息
            dty,// 20  大团圆
            jhh,// 21  假行行
            sqh,// 22  四七红
            autoPlay,   //托管时间    23（0,60,120,180,300）
            isDouble,//是否翻倍 24
            dScore,//翻倍上限 25
            doubleNum,//翻倍倍数 26
            djtg,//单局托管 27
            0,// 28  *****无用占位
            0,// 29  *****无用占位
            0,// 30  *****无用占位
            tinghu,// 31  听胡
            shuahou,// 32  耍猴
            haihu,// 33  海胡
            bkb,// 34  背靠背
            liangzhang,// 35  亮张
            stwk,// 36 三提五砍
            hongheihu,// 37 红黑胡
            dianhu,// 38 点胡
            daxiaozihu,// 39 大小字胡
            duizihu,// 40 对子胡
            huangfan,// 41 黄番
            tiandihu,// 42 天地胡
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

        return [GameTypeEunmZP.CDPHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[0],[0],[0],[],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = params[0] == 8 ? 0 : 1 ;//局数
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = parseInt(params[45]) - 1;//底分 1 | 2
        var scoreArr = [0,100,200,300,500];
        var score = scoreArr.indexOf(parseInt(params[18]));//分数上限
        defaultConfig[4][0] = score !== -1 ? score:0;//分数上限

        defaultConfig[5][0] = params[16] == 2 ? 1:params[16]==3?2:0;//全名堂

        defaultConfig[7][0] = params[14] == 0?0:(params[14] == 10 ? 1 : 2);//抽牌
        defaultConfig[8][0] = params[23] == 300?4:params[23]/60;//托管时间
        defaultConfig[9][0] = params[27]== 1 ? 0:params[27]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[10][0] = params[24]== 1 ? 1:0;//是否翻倍
        defaultConfig[11][0] = parseInt(params[26]) - 2 >= 0 ? parseInt(params[26]) - 2 : 0;//翻倍数


        if(params[20] == 1)defaultConfig[6].push(0);
        if(params[19] == 1)defaultConfig[6].push(1);
        if(params[21] == 1)defaultConfig[6].push(2);
        if(params[22] == 1)defaultConfig[6].push(3);
        if(params[31] == 1)defaultConfig[6].push(4);
        if(params[32] == 1)defaultConfig[6].push(5);
        if(params[33] == 1)defaultConfig[6].push(6);
        if(params[34] == 1)defaultConfig[6].push(7);
        if(params[35] == 1)defaultConfig[6].push(8);
        if(params[15] == 1)defaultConfig[6].push(9);
        if(params[36] == 1)defaultConfig[6].push(10);

        if(params[42] == 1)defaultConfig[6].push(11);
        if(params[37] == 1)defaultConfig[6].push(12);
        if(params[38] == 1)defaultConfig[6].push(13);
        if(params[39] == 1)defaultConfig[6].push(14);
        if(params[40] == 1)defaultConfig[6].push(15);
        if(params[41] == 1)defaultConfig[6].push(16);



        if(params[46] && params[46] != 0 && params[47] && params[47] != 0){
            defaultConfig[12].push(0);
        }

        this.glzpDScore = params[25]?parseInt(params[25]):10;//多少分翻倍
        this.allowScore = parseInt(params[46])||10;
        this.addScore = parseInt(params[47])||10;

        this.defaultConfig = defaultConfig;
    },
});