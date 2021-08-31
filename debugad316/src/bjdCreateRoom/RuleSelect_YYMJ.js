/**
 * Created by Administrator on 2020/4/1.
 */
var RuleSelect_YYMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(9);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["一字撬有喜","一条龙","流局未听牌罚分","门清","门清将将胡接炮"],col:3},//3
            {title:"罚分",type:1,content:["罚1分","罚2分","罚4分"]},//4
            {title:"封顶",type:1,content:["不封顶","32倍封顶","64倍封顶"],col:3},//5
            {title:"抓鸟",type:1,content:["抓1鸟","抓2鸟"],col:3},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//8
            {title:"玩法选择",type:1,content:["不加倍","加倍"],col:3},//9
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//10
            {title:"加分",type:2,content:["低于"]}//11
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[1],[0],[0],[]];
        this.zzDScore = parseInt(cc.sys.localStorage.getItem("YYMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("YYMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("YYMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.YYMJ){
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
            this.layoutArr[9].setVisible(true);
            if(this.getItemByIdx(9,0).isSelected()){
                this.layoutArr[10].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[10].setVisible(true);
                this.numBox.visible=true;
            }
            this.layoutArr[11].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(11,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[9].setVisible(false);
            this.layoutArr[10].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[11].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if(this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].visible = false;
        }else{
            this.layoutArr[8].visible = true;
        }

        if(this.getItemByIdx(3,3).isSelected()){
            this.getItemByIdx(3,4).setItemState(true);
        }else{
            this.getItemByIdx(3,4).setItemState(false);
        }

        if(this.getItemByIdx(3,2).isSelected()){
            this.layoutArr[4].setVisible(true);
        }else{
            this.layoutArr[4].setVisible(false);
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

        var yzqyx = this.getItemByIdx(3,0).isSelected() ? 1 : 0;//一字撬有喜
        var ytl = this.getItemByIdx(3,1).isSelected() ? 1 : 0;//一条龙
        var ljff = this.getItemByIdx(3,2).isSelected() ? 1 : 0;//流局罚分
        var menqing = this.getItemByIdx(3,3).isSelected() ? 1 : 0;//门清
        var mqjjh = this.getItemByIdx(3,4).isSelected() ? 1 : 0;//门清将将胡

        if(menqing === 0){//未勾选门清，没有门清将将胡、门清七小对
            mqjjh = 0;
        }

        if(ljff == 1){//勾选流局罚分，才有罚分
           if(this.getItemByIdx(4,0).isSelected()){
               ljff = 1;
           }else if(this.getItemByIdx(4,1).isSelected()){
               ljff = 2;
           }else{
               ljff = 4;
           }
        }

        var fengding = 0;
        if(this.getItemByIdx(5,1).isSelected()){
            fengding = 32;
        }else if(this.getItemByIdx(5,2).isSelected()){
            fengding = 64;
        }

        var niaoPai = 1;
        if(this.getItemByIdx(6,1).isSelected()){
            niaoPai = 2;
        }

        var csTuoguan =0;
        var timeArr = [0,60,120,180,300];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                csTuoguan = timeArr[i];
                break;
            }
        }

        var Djtg = 1;
        if(this.getItemByIdx(8,1).isSelected())
            Djtg = 2;
        else if(this.getItemByIdx(8,2).isSelected())
            Djtg = 3;

        var IsDouble = 0;
        if(this.getItemByIdx(9,1).isSelected()){
            IsDouble = 1;
        }

        var DScore = this.zzDScore;
        cc.sys.localStorage.setItem("YYMJ_diScore",DScore);
        var DoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                DoubleNum = 2 + i;
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("YYMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("YYMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.YYMJ,//玩法ID 1
            costway,//支付方式 2
            0,//  *****  无用占位  3
            niaoPai,// 4 *****  抓鸟
            0,// 5 *****  无用占位
            0,// 6 *****  无用占位
            renshu,//人数 7
            yzqyx,// 8 *****  一字撬有喜
            0,// 9 *****  无用占位
            0,// 10 *****  无用占位
            ytl,// 11 *****  一条龙
            ljff,// 12 *****  流局罚分
            fengding,// 13 *****  封顶
            mqjjh,// 14 ***** 门清将将胡
            0,// 15 *****  无用占位
            menqing,// 16 *****  门清
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
        return [GameTypeEunmMJ.YYMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in YYMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 8 ? 0 : 1;//局数
        defaultConfig[1][0] = params[2] == 3|| params[2] == 4?0:parseInt(params[2]) - 1;//房费
        defaultConfig[2][0] = params[7] == 4 ? 0 : params[7] == 3 ? 1 : 2;//人数

        if(params[8] == 1){
            defaultConfig[3].push(0);
        }
        if(params[11] == 1){
            defaultConfig[3].push(1);
        }
        if(params[12] != 0){
            defaultConfig[3].push(2);
        }
        if(params[16] == 1){
            defaultConfig[3].push(3);
            if(params[14] == 1){
                defaultConfig[3].push(4);
            }
        }
        defaultConfig[4][0] = params[12] == 4 ? 2 : (params[12] == 2 ? 1 : 0);//罚分
        defaultConfig[5][0] = params[13] == 32 ? 1 : (params[13] == 64 ? 2 : 0);//封顶
        defaultConfig[6][0] = params[4] == 1 ? 0 : 1;//抓鸟
        defaultConfig[7][0] = params[28]?params[28] == 300?4:params[28]/60:0;//托管时间
        defaultConfig[8][0] = params[29]== 1 ? 0:params[29]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[9][0] = params[19] == 0 ? 0 : 1;
        defaultConfig[10][0] = params[21] - 2;
        if(params[34] && parseInt(params[34]) > 0)defaultConfig[11].push(0);
        this.zzDScore = parseInt(params[20]);
        this.allowScore = parseInt(params[35])||10;
        this.addScore = parseInt(params[34])||10;
        this.defaultConfig = defaultConfig;
    },
});