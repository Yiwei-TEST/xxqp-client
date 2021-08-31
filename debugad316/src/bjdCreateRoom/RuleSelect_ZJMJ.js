/**
 * Created by Administrator on 2020/4/23.
 */
var RuleSelect_ZJMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(7);
        this.createChangeScoreBox(9);//创建低于xx分加xx分
        this.getItemByIdx(9,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","10局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["板板胡","将将胡","荒庄荒杠","红中癞子","四红中可胡","大胡算分","黑胡"],col:3},//3
            {title:"抓鸟",type:1,content:["不抓鸟","抓2鸟","抓4鸟","抓6鸟","抓8鸟"],col:5},//4
            //{title:"底分",type:1,content:["1分","2分","5分"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//5
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//6
            {title:"玩法选择",type:1,content:["不加倍","加倍"],col:3},//7
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//8
            {title:"加分",type:2,content:["低于"]}//9
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[1],[0],[0],[]];
        this.zzDScore = parseInt(cc.sys.localStorage.getItem("ZJMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("ZJMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("ZJMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.ZJMJ){
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
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[7].setVisible(true);
            if(this.getItemByIdx(7,0).isSelected()){
                this.layoutArr[8].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[8].setVisible(true);
                this.numBox.visible=true;
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
            this.numBox.visible=false;
            this.layoutArr[9].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if(this.getItemByIdx(5,0).isSelected()){
            this.layoutArr[6].visible = false;
        }else{
            this.layoutArr[6].visible = true;
        }

        if(this.getItemByIdx(3,3).isSelected()){
            this.getItemByIdx(3,6).setItemState(true);
        }else{
            this.getItemByIdx(3,6).setItemState(false);
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
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
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
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp]
            }
        }
        zsNum = 0;
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.zzDScore+"分",38,null,cc.color(126,49,2));
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
        var num = this.zzDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.zzDScore = num - 5;
            }else{
                this.zzDScore = num;
            }
        }else if ( num < 10){
            this.zzDScore = 5;
        }
        this.scoreLabel.setString("小于"+ this.zzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 10;
        }

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

        var bbh = this.getItemByIdx(3,0).isSelected() ? 1: 0;//板板胡

        var jjh = this.getItemByIdx(3,1).isSelected() ? 1: 0;//将将胡

        var hzhg = this.getItemByIdx(3,2).isSelected() ? 1: 0;//荒庄荒杠

        var hzWang = this.getItemByIdx(3,3).isSelected() ? 1: 0;//红中癞子

        var hz4 = this.getItemByIdx(3,4).isSelected() ? 1: 0;//四红中可胡

        var dhsf = this.getItemByIdx(3,5).isSelected() ? 1: 0;//大胡算分

        var heihu = 0;
        if(hzWang){//开启红中为王才有黑胡
            heihu = this.getItemByIdx(3,6).isSelected() ? 1: 0;//黑胡
        }

        var niaoshu = 0;
        for(var i = 0;i < 5;++i){
            if(this.getItemByIdx(4,i).isSelected()){//抓几鸟
                niaoshu = i * 2;
                break;
            }
        }

        var csTuoguan =0;
        var timeArr = [0,60,120,180,300];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                csTuoguan = timeArr[i];
                break;
            }
        }

        var Djtg = 1;
        if(this.getItemByIdx(6,1).isSelected())
            Djtg = 2;
        else if(this.getItemByIdx(6,2).isSelected())
            Djtg = 3;

        var IsDouble = 0;
        if(this.getItemByIdx(7,1).isSelected()){
            IsDouble = 1;
        }

        var DScore = this.zzDScore;
        cc.sys.localStorage.setItem("ZJMJ_diScore",DScore);
        var DoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                DoubleNum = 2 + i;
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(9,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("ZJMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("ZJMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.ZJMJ,//玩法ID 1
            costway,//支付方式 2
            niaoshu,// 3中鸟数
            0,// 4  无用占位
            0,// 5  无用占位
            1,// 6  可胡7对，默认1
            renshu,// 7playerCount人数
            csTuoguan,// 8托管[选项 0未选中，1选中]
            0,// 9  无用占位
            0,// 10 无用占位
            0,// 11 无用占位
            0,// 12 无用占位
            0,// 13 无用占位
            0,// 14 无用占位
            0,// 15 无用占位
            0,// 16 无用占位
            0,// 17 无用占位
            1,// 18 底分暂时默认1
            1,// 19 默认开启159中鸟
            IsDouble,// 20是否加倍
            DScore,// 21 加倍分
            DoubleNum,// 22加倍数
            0,//23 无用占位
            0,//24 无用占位
            0,//25 无用占位
            Djtg,//26 1 单局托管 2 整局托管
            0,//27 无用占位
            0,//28 无用占位
            hz4,// 29 起手四红中可胡
            0,//30 无用占位
            0,//31 无用占位
            0,//32 无用占位
            morefen,//33 "加xx分"
            allowScore,//34 "低于xx分"
            0,//35 无用占位
            0,//36 无用占位
            0,// 37 无用占位
            jjh,//38将将胡
            bbh,//39板板胡
            hzhg,//40是否荒庄慌杠
            hzWang,//41是否有红中癞子
            dhsf,//42大胡算分
            heihu,//43黑胡
        ];

        cc.log("data.params =",JSON.stringify(data.params[37]));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 10;
        }

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
        return [GameTypeEunmMJ.ZJMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in ZJMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 8 ? 0 : 1;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0: parseInt(params[2]) - 1;//房费
        defaultConfig[2][0] = params[7] == 4 ? 0 : params[7] == 3 ? 1 : 2;//人数

        if(params[39] == 1){
            defaultConfig[3].push(0);
        }
        if(params[38] != 0){
            defaultConfig[3].push(1);
        }
        if(params[40] == 1){
            defaultConfig[3].push(2);
        }
        if(params[41] == 1){
            defaultConfig[3].push(3);
        }
        if(params[29] == 1){
            defaultConfig[3].push(4);
        }
        if(params[42] == 1){
            defaultConfig[3].push(5);
        }
        if(params[43] == 1){
            defaultConfig[3].push(6);
        }
        var niaoIndex = parseInt(params[3]) / 2;
        defaultConfig[4][0] = niaoIndex > 1 ? niaoIndex : 0;
        defaultConfig[5][0] = params[8]?params[8] == 300?4:params[8]/60:0;//托管时间
        defaultConfig[6][0] = params[26]== 1 ? 0:params[26]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[7][0] = params[20] == 0 ? 0 : 1;
        defaultConfig[8][0] = params[22] - 2;
        if(params[34] && parseInt(params[34]) > 0)defaultConfig[9].push(0);
        this.zzDScore = parseInt(params[21]);
        this.allowScore = parseInt(params[34])||10;
        this.addScore = parseInt(params[33])||10;
        this.defaultConfig = defaultConfig;
    },
});