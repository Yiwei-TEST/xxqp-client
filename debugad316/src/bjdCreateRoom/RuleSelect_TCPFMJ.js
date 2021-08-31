/**
 * Created by Administrator on 2020/1/3.
 */

var RuleSelect_TCPFMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox(12);//创建低于xx分加xx分
        this.getItemByIdx(12,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数",type:1,content:["6局","8局","12局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数",type:1,content:["4人","3人","2人"]},//2
            {title:"跑风",type:1,content:["明跑","暗跑"]},//3
            {title:"玩法",type:1,content:["明牌玩法","暗牌玩法"]},//4
            {title:"",type:1,content:["碰一对","一碰到底"]},//5
            {title:"飘分",type:1,content:["不飘","选飘","定飘"]},//6
            {title:"",type:1,content:["1分","2分","3分"]},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//9
            {title:"加倍",type:1,content:["不加倍","加倍"]},//10
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//11
            {title:"加分",type:2,content:["低于"]}//12
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];
        this.tcpfmjDScore = parseInt(cc.sys.localStorage.getItem("TCPFMJ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("TCPFMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("TCPFMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.TCPFMJ){
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
        // this.addLabel.setAnchorPoint(0.5,0.5);
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
        var BoxBg = new cc.Sprite("res/ui/phz/phzCreateRoom/img_15.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 430 + (788/(this.layoutArr[row].itemArr.length));

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/phz/phzCreateRoom/img_16.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,0);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/phz/phzCreateRoom/img_14.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(BoxBg.width-addBtn.width+5,-4);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.tcpfmjDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.tcpfmjDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.tcpfmjDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.tcpfmjDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        if(this.getItemByIdx(2,2).isSelected()){
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
        }else{
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.layoutArr[12].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(8,0).isSelected()){
            this.layoutArr[9].setVisible(false);
        }else{
            this.layoutArr[9].setVisible(true);
        }
        if(this.getItemByIdx(6,2).isSelected()){
            this.layoutArr[7].setVisible(true);
        }else{
            this.layoutArr[7].setVisible(false);
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 0;

        var zsArr = {0:[4,5,6],1:[6,7,8],2:[8,9,10]};

        var renshu = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 2-i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<3;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = zsArr[temp][renshu];
        }else{
            if(this.getItemByIdx(1,0).isSelected()){
                zsArr = {0:[2,2,2],1:[3,3,2],2:[4,3,3]};
                zsNum = zsArr[temp][renshu];
            }else{
                zsNum = zsArr[temp][renshu];
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
        for(var i = 0;i<3;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:2000,3:1700,4:1500},{2:3000,3:2400,4:2000},{2:4500,3:3000,4:2500}
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
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var jushu = 6;
        var jushuArr = [6,8,12];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
                break;
            }
        }

        var  paofeng = 1;
        if(this.getItemByIdx(3,1).isSelected()){
            paofeng = 0;
        } 

        var anpai = 0;//暗牌 0 明牌 1
        if(this.getItemByIdx(4,1).isSelected()){
            anpai = 1;
        }

        var peng = 0;//碰一对 0 一碰到底 1
        if(this.getItemByIdx(5,1).isSelected()){
            peng = 1;
        }

        var piaofen = 0;//
        var dingpiao = 0;
        if(this.getItemByIdx(6,0).isSelected()){
            piaofen = 0;
        }else if(this.getItemByIdx(6,1).isSelected()){
            piaofen = 1;
        }else if(this.getItemByIdx(6,2).isSelected()){
            piaofen = 2;
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(7,i).isSelected()){
                    dingpiao = i + 1;
                    break;
                }
            }
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

        var dScore = this.tcpfmjDScore;
        cc.sys.localStorage.setItem("TCPFMJ_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,2).isSelected()){
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
        cc.sys.localStorage.setItem("TCPFMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("TCPFMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.TCPFMJ,//玩法ID 1
            costWay,//支付方式 2
            paofeng,//跑风 0-暗跑 1-明跑 3
            anpai,//暗牌 0-明牌玩法 1-暗牌玩法 4
            peng,//0-碰一对 1-一碰到底 5
            piaofen,//飘分 0-不飘 1-选飘 2-定飘 6
            renshu,//人数 7
            dingpiao,//定飘分数 8
            autoPlay,//托管时间 9
            djtg,//单局托管，和整局托管//10
            isDouble,// 是否加倍 11
            this.tcpfmjDScore,// 加倍分 12
            doubleNum,// 加倍数 13
            morefen,//14 "加xx分"
            allowScore,//15 "低于xx分"
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 6;
        var jushuArr = [6,8,12];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
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

        return [GameTypeEunmMJ.TCPFMJ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        // cc.log("===========readSelectData============" + params);

        var defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];

        var inning = [6,8,12];
        var index = inning.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = index !== -1 ? index : 0;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:parseInt(params[2]) - 1;//房费
        defaultConfig[2][0] = params[7] == 4 ? 0 : (params[7] == 3 ? 1 : 2);//人数

        defaultConfig[3][0] = parseInt(params[3]) == 0?1:0;
        defaultConfig[4][0] = parseInt(params[4]);
        defaultConfig[5][0] = parseInt(params[5]);
        defaultConfig[6][0] = parseInt(params[6]);
        defaultConfig[7][0] = (parseInt(params[8]) == 0 || parseInt(params[8]) == 4)?0:params[8]-1;

        defaultConfig[8][0] = params[9]?params[9] == 300?4:params[9]/60:0;
        defaultConfig[9][0] = params[10]== 1 ? 0:params[10]== 2 ? 1 : 2;//单局托管/整局/三局

        defaultConfig[10][0] = params[11] == 1?1:0;
        defaultConfig[11][0] = params[13]==0?params[13]:params[13]  - 2;

        if(params[14] && parseInt(params[14]) > 0)defaultConfig[12].push(0);
        this.tcpfmjDScore = parseInt(params[12]);
        this.addScore = parseInt(params[14])||10;
        this.allowScore = parseInt(params[15])||10;

        this.defaultConfig = defaultConfig;
    },
});