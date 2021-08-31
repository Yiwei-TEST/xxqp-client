/**
 * Created by Administrator on 2020/2/28.
 */
/**
 * Created by Administrator on 2019/11/9.
 */
var RuleSelect_NYMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(8);
        this.createChangeScoreBox(10);//创建低于xx分加xx分
        this.getItemByIdx(10,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["金马翻倍","允许飘","红中当王","杠翻倍","王牌可出"],col:3},//3
            {title:"奖马",type:1,content:["抓2马","抓4马","抓6马","一马全中"]},//4
            {title:"底分",type:1,content:["1分","2分","5分"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
            {title:"玩法选择",type:1,content:["不加倍","加倍"],col:3},//8
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//9
            {title:"加分",type:2,content:["低于"]}//10
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[0],[1],[0],[0],[]];
        this.zzDScore = parseInt(cc.sys.localStorage.getItem("NYMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("NYMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("NYMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.NYMJ){
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
        }else{
            this.layoutArr[8].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[10].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if(this.getItemByIdx(6,0).isSelected()){
            this.layoutArr[7].visible = false;
        }else{
            this.layoutArr[7].visible = true;
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
            jushu = 16;
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

        var jmfb = this.getItemByIdx(3,0).isSelected() ? 1: 0;//金马翻倍

        var piaofen = this.getItemByIdx(3,1).isSelected() ? 13: 0;//允许飘分

        var hzWang = this.getItemByIdx(3,2).isSelected() ? 1: 0;//红中当王

        var gangFB = this.getItemByIdx(3,3).isSelected() ? 1: 0;//杠翻倍

        var kcWang = this.getItemByIdx(3,4).isSelected() ? 1: 0;//可出王

        var mashu = 0;
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(4,i).isSelected()){//买几马
                mashu = (i + 1) * 2;
                break;
            }
        }

        var ymqz = this.getItemByIdx(4,3).isSelected() ? 1 : 0;//一马全中
        if(ymqz){
            mashu = 1;
        }

        var difen = 1;//底分
        if(this.getItemByIdx(5,1).isSelected()){
            difen = 2;
        }else if(this.getItemByIdx(5,2).isSelected()){
            difen = 5;
        }

        var csTuoguan =0;
        var timeArr = [0,60,120,180,300];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                csTuoguan = timeArr[i];
                break;
            }
        }

        var Djtg = 1;
        if(this.getItemByIdx(7,1).isSelected())
            Djtg = 2;
        else if(this.getItemByIdx(7,2).isSelected())
            Djtg = 3;

        var IsDouble = 0;
        if(this.getItemByIdx(8,1).isSelected()){
            IsDouble = 1;
        }

        var DScore = this.zzDScore;
        cc.sys.localStorage.setItem("NYMJ_diScore",DScore);
        var DoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                DoubleNum = 2 + i;
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(10,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("NYMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("NYMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.NYMJ,//玩法ID 1
            costway,//支付方式 2
            0,//  *****  无用占位  3
            0,// 4 *****  无用占位
            piaofen,// 5 *****  允许飘分
            difen,// 6 *****  底分
            renshu,//人数 7
            hzWang,// 8 *****  红中当王
            jmfb,// 9 *****  金马翻倍
            mashu,// 10 *****  抓鸟数
            ymqz,// 11 *****  一码全中
            gangFB,// 12 *****  杠翻倍
            kcWang,// 13 *****  王牌可出
            0,// 14 *****  无用占位
            0,// 15 *****  无用占位
            0,// 16 *****  无用占位
            0,// 17 *****  无用占位
            0,  //  *****  无用占位  18
            IsDouble,// 是否加倍 19
            DScore,// 加倍分 20
            DoubleNum,// 加倍数 21
            0,  //  *****  无用占位  22
            0,  //  *****  无用占位  23
            0,  //  24 *****  无用占位
            0,  //  25 *****  无用占位
            0,  //  26 流局算杠
            0,  // 27 10倍不计分
            csTuoguan,//托管时间  28
            Djtg,//单局托管 29
            0,//30 *****  无用占位
            0,//31 *****  无用占位
            0,//32 *****  无用占位
            0,//33 *****  无用占位
            morefen,//34 "加xx分"
            allowScore,//35 "低于xx分"
            0,//36 *****  无用占位
            0,//37 *****  无用占位
            0,// 38 *****  无用占位
            0//39 *****  无用占位
        ];

        cc.log("data.params =",JSON.stringify(data.params[37]));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 16;
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
        return [GameTypeEunmMJ.NYMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in NYMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 8 ? 0 : 1;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0: parseInt(params[2]) - 1;//房费
        defaultConfig[2][0] = params[7] == 4 ? 0 : params[7] == 3 ? 1 : 2;//人数

        if(params[9] == 1){
            defaultConfig[3].push(0);
        }
        if(params[5] != 0){
            defaultConfig[3].push(1);
        }
        if(params[8] == 1){
            defaultConfig[3].push(2);
        }
        if(params[12] == 1){
            defaultConfig[3].push(3);
        }
        defaultConfig[4][0] = params[10] == 4 ? 1 : (params[10] == 6 ? 2 : 0);//抓马
        if(params[11] == 1){
            defaultConfig[4][0] = 3;
        }
        defaultConfig[5][0] = params[6] == 2 ? 1 : (params[6] == 5 ? 2 : 0);//底分
        defaultConfig[6][0] = params[28]?params[28] == 300?4:params[28]/60:0;//托管时间
        defaultConfig[7][0] = params[29]== 1 ? 0:params[29]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[8][0] = params[19] == 0 ? 0 : 1;
        defaultConfig[9][0] = params[21] - 2;
        if(params[34] && parseInt(params[34]) > 0)defaultConfig[10].push(0);
        this.zzDScore = parseInt(params[20]);
        this.allowScore = parseInt(params[35])||10;
        this.addScore = parseInt(params[34])||10;
        this.defaultConfig = defaultConfig;
    },
});