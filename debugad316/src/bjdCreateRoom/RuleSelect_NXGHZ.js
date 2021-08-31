/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_NXGHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);

        this.createNumBox(8);
        this.createChangeScoreBox(10);//创建低于xx分加xx分
        this.getItemByIdx(10,0).itemBtn.setContentSize(80,40);

        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"],col:3},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数",type:1,content:["3人","2人"],col:3},//2
            {title:"名堂",type:1,content:["小卓版","大卓版"],col:3},//3
            {title:"特殊",type:2,content:["手牵手","背靠背"],col:3},//4
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//8
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//9
            {title:"加分",type:2,content:["低于"]},//10
        ];

        this.defaultConfig = [[0],[1],[0],[0],[],[0],[0],[1],[0],[0],[]];

        this.csDScore = parseInt(cc.sys.localStorage.getItem("NXGHZ_diScore")) || 30;
        this.addScore = parseInt(cc.sys.localStorage.getItem("NXGHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("NXGHZ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.NXGHZ){
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
        this.addLabel.setAnchorPoint(0.5,0.5);
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

        this.getLayoutByIdx(8).visible = false;
        this.getLayoutByIdx(9).visible = false;

        var is2ren = false;
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[8].setVisible(true);
            if(this.getItemByIdx(8,0).isSelected()){
                this.layoutArr[9].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[9].setVisible(true);
                this.numBox.visible=true;

            }
            this.layoutArr[10].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(10,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            is2ren = true;
        }else{
            this.layoutArr[8].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[10].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        var istg = !this.getItemByIdx(6,0).isSelected();
        this.layoutArr[7].setVisible(istg);

        this.layoutArr[5].setVisible(is2ren);
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 0;
        var zsNumArr = [0,0];
        var temp = 0;
        var renshu = 3;

        for(var i = 0;i < 2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
                temp = i;
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

        var num = 0;

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
        BoxBg.x = 380 + (788/(this.layoutArr[row].itemArr.length));

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,0);
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
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.csDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 30 && num <= 150){
            if (num%10 == 5){
                this.csDScore = num - 5;
            }else{
                this.csDScore = num;
            }
        }else if ( num < 30){
            this.csDScore = 30;
        }
        cc.log("this.csDScore =",this.csDScore);
        this.scoreLabel.setString("小于"+ this.csDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected())jushu = 16;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 3;
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        var zhuoban = 0
        if(this.getItemByIdx(3,1).isSelected())zhuoban = 1;

        var shouqianshou = 0
        if(this.getItemByIdx(4,0).isSelected())shouqianshou = 1;
        var beikaobei = 0
        if(this.getItemByIdx(4,1).isSelected())beikaobei = 1;

        var choupai = 0;
        var choupaiArr = [0,10,20]
        if(renshu == 2) {
            for (var i = 0; i < 3; ++i) {
                if (this.getItemByIdx(5, i).isSelected()) {
                    choupai = choupaiArr[i];
                    break;
                }
            }
        }

        var csTuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                csTuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            csTuoguan = 300;
        }
        var csDjtg = 2;
        if (this.getItemByIdx(7,0).isSelected()){
            csDjtg = 1;
        }else if (this.getItemByIdx(7,2).isSelected()){
            csDjtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(8,1).isSelected()){
            isDouble = 1;
        }

        var csDScore = this.csDScore;
        cc.sys.localStorage.setItem("NXGHZ_diScore",csDScore);
        var csDoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                csDoubleNum = 2 + i;
                break;
            }
        }
        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(10,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("NXGHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("NXGHZ_allowBoxScore",allowScore);


        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.NXGHZ,//玩法ID 1
            costway,//支付方式 2
            0,//封顶 3
            0,//飘 4
            0,//无息平 5
            0,//吊吊手 6
            renshu,//人数 7
            csTuoguan,//托管时间//8
            csDjtg,//单局托管，和整局托管//9
            isDouble,//是否加倍 10
            csDScore,// 加倍分 11
            csDoubleNum,// 加倍数 12

            morefen,//13 "加xx分"
            allowScore,//14 "低于xx分"
            choupai,//抽牌 15
            zhuoban,//小0，大1卓版 16
            beikaobei,//背靠背 17
            shouqianshou,//手牵手 18
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected())jushu = 16;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 3;
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        return [GameTypeEunmZP.NXGHZ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[0],[],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 16?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?1:0;

        defaultConfig[3][0] = params[16] == 1?1:0;
        if(params[18] == "1")defaultConfig[4].push(0);
        if(params[17] == "1")defaultConfig[4].push(1);
        defaultConfig[5][0] = params[15] == 20?2:params[15] == 10?1:0;

        defaultConfig[6][0] = params[8]?params[8] == 300?4:params[8]/60:0;
        defaultConfig[7][0] = params[9]== 1 ? 0:params[9]== 2 ? 1 : 2;//单局托管/整局/三局

        defaultConfig[8][0] = params[10] == 1?1:0;
        defaultConfig[9][0] = params[12] -2;

        if(params[13] && parseInt(params[13]) > 0)defaultConfig[10].push(0);

        this.csDScore = parseInt(params[11]) || 30;
        this.addScore = parseInt(params[13])||10;
        this.allowScore = parseInt(params[14])||10;


        this.defaultConfig = defaultConfig;
    },
});