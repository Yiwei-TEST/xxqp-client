/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_JZMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox(12);//创建低于xx分加xx分
        this.getItemByIdx(12,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"抓鸟",type:1,content:["不抓鸟","抓2鸟","抓4鸟","抓6鸟","抓8鸟"],col:3},//3
            {title:"鸟分",type:1,content:["相加结算","翻番结算"],col:3},//4
            {title:"每鸟分数",type:1,content:["加胡牌分","加1分","加2分","加3分","加4分"],col:3},//5
            {title:"抽牌",type:1,content:["不抽底","抽底13张","抽底26张"]},//6
            {title:"封顶",type:1,content:["不封顶","21分封顶","31分封顶","42分封顶"]},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//9
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//10
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//11
            {title:"加分",type:2,content:["低于"]},//12
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];
        this.csDScore = parseInt(cc.sys.localStorage.getItem("JZMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("JZMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("JZMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.JZMJ){
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

        var is2ren = this.getItemByIdx(2,2).isSelected();
        var isjb = this.getItemByIdx(10,1).isSelected();

        this.layoutArr[6].setVisible(is2ren);
        this.layoutArr[10].setVisible(is2ren);
        this.layoutArr[11].setVisible(is2ren && isjb);
        this.layoutArr[12].setVisible(is2ren);

        this.numBox.setVisible(is2ren && isjb);
        this.addNumBox.itemBox.setVisible(is2ren);
        this.allowNumBox.itemBox.setVisible(is2ren);

        var istg = !this.getItemByIdx(8,0).isSelected();
        this.layoutArr[9].setVisible(istg);

        var isxj = this.getItemByIdx(4,0).isSelected();
        this.layoutArr[5].setVisible(isxj);

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
                zsNum = zsNumArr[temp]
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(0);
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

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var zhuaNiao = 0;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                zhuaNiao = 2*i;
                break;
            }
        }
        var niaoType = 1;
        if(this.getItemByIdx(4,1).isSelected())niaoType = 2;

        var mnjf = 0;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                mnjf = i;
                break;
            }
        }

        var choudi = 0;
        if(renshu == 2){
            if(this.getItemByIdx(6,1).isSelected())choudi = 13;
            if(this.getItemByIdx(6,2).isSelected())choudi = 26;
        }

        var isdouble = 0;
        if(this.getItemByIdx(10,1).isSelected())isdouble = 1;

        cc.sys.localStorage.setItem("JZMJ_diScore",this.csDScore);
        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                doubleNum = 2 + i;
                break;
            }
        }

        var tgTime =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                tgTime = i*60;
                break;
            }
        }
        if(this.getItemByIdx(8,4).isSelected())tgTime = 300;

        var tgType = 2;
        if(this.getItemByIdx(9,0).isSelected())tgType = 1;
        if(this.getItemByIdx(9,2).isSelected())tgType = 3;

        var fengding = 0;
        var fengdingArr = [0,21,31,42];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                fengding = fengdingArr[i];
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("JZMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("JZMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.JZMJ,//玩法ID 1
            costway,//支付方式 2
            zhuaNiao,//抓鸟数 3
            niaoType,//抓鸟算分 4
            choudi,//抽底 5
            fengding,//封顶 6
            renshu,//人数 7
            tgTime,//托管时间//8
            tgType,//单局托管，和整局托管//9
            isdouble,// 是否加倍 10
            this.csDScore,// 加倍分 11
            doubleNum,//加倍数 12
            morefen,//"加xx分" 13
            allowScore,//"低于xx分" 14
            mnjf,// 每鸟加分 15
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


        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }
        return [GameTypeEunmMJ.JZMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 16?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;

        defaultConfig[3][0] = parseInt(params[3]/2) || 0;//抓鸟
        defaultConfig[4][0] = params[4] == 2?1:0;//抓鸟算分
        defaultConfig[5][0] = parseInt(params[15]) || 0;
        defaultConfig[6][0] = params[5] == 26?2:params[5] == 13?1:0;//抽底

        var fengdingArr = [0,21,31,42];
        var idx = ArrayUtil.indexOf(fengdingArr,params[6]);
        defaultConfig[7][0] = idx>=0?idx:0;//封顶

        defaultConfig[8][0] = params[8]?params[8] == 300?4:params[8]/60:0;
        defaultConfig[9][0] = params[9]== 1 ? 0:params[9]== 2 ? 1 : 2;//单局托管/整局/三局

        defaultConfig[10][0] = params[10] == 1?1:0;
        defaultConfig[11][0] = params[12]-2;

        if(params[13] && parseInt(params[13]) > 0)defaultConfig[12].push(0);
        this.csDScore = parseInt(params[11]);

        this.addScore = parseInt(params[13])||10;
        this.allowScore = parseInt(params[14])||10;
        this.defaultConfig = defaultConfig;
    },
});