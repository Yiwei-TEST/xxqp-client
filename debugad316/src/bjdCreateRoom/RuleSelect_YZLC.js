/**
 * Created by Administrator on 2020/3/14.
 */
var RuleSelect_YZLC = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(8);
        this.createChangeScoreBox(10);//创建低于xx分加xx分
        this.getItemByIdx(10,0).itemBtn.setContentSize(120,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1局","6局","8局","10局","20局"],col:5},// 0
            {title:"房费",type:1,content:["AA支付","房主支付"]},// 1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},// 2
            {title:"玩法",type:1,content:["曲戳","定戳"]},// 3
            {title:"放戳",type:1,content:["14戳","15戳"]},// 4
            {title:"可选",type:2,content:["见红加分","起胡2分","红戳4番","番戳"]},// 5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//8
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//9
            {title:"加分",type:2,content:["低于"]},//10
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[],[0],[1],[0],[0],[]];

        this.dhDScore = parseInt(cc.sys.localStorage.getItem("YZLC_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("YZLC_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("YZLC_allowBoxScore")) || 10;/** 低于xx分 **/
        this.addDiFen = parseInt(cc.sys.localStorage.getItem("YZLC_addDiFen")) || 1;/** 底分 **/

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
            if(params[1] == GameTypeEunmZP.YZLC){
                this.readSelectData(params);
            }
        }
        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    changeHandle:function(item){
        cc.log("changeHandle in RuleSelect_YZLC");
        var tag = item.getTag();
        cc.log("changeHandle tag",tag);
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        cc.log("updateItemShow in RuleSelect_YZLC");
        if (this.getItemByIdx(6,0).isSelected()){
            this.layoutArr[7].visible = false;
        }else{
            this.layoutArr[7].visible = true;
        }

        if (this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[8].visible = true;
            if (this.getItemByIdx(8,1).isSelected()){
                this.layoutArr[9].visible= true;
                this.numBox.visible = true;
            }else{
                this.layoutArr[9].visible= false;
                this.numBox.visible = false;
            }
            this.layoutArr[10].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(10,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.numBox.visible = false;
            this.layoutArr[8].visible = false;
            this.layoutArr[9].visible= false;
            this.layoutArr[10].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if (this.getItemByIdx(2,0).isSelected()){//如果是4人
            this.getItemByIdx(4,1).setVisible(false);
            this.getItemByIdx(4,0).setLabelString("11戳");
        }else{
            this.getItemByIdx(4,1).setVisible(true);
            this.getItemByIdx(4,0).setLabelString("14戳");
        }

        if(this.getItemByIdx(3,1).isSelected()){//如果选了定戳
            this.getItemByIdx(5,3).setItemState(false);
        }else{
            this.getItemByIdx(5,3).setItemState(true);
        }
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.dhDScore+"分",38,null,cc.color(126,49,2));
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
        var num = this.dhDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.dhDScore = num - 5;
            }else{
                this.dhDScore = num;
            }
        }else if ( num < 10){
            this.dhDScore = 5;
        }
        // cc.log("this.dhDScore =",this.dhDScore);
        this.scoreLabel.setString("小于"+ this.dhDScore + "分");
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;

        var zsArr = [1,4,5,6,12];

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<zsArr.length;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = zsArr[temp];
        }else{
            if(this.getItemByIdx(1,0).isSelected()){
                zsNum = Math.ceil(zsArr[temp]/renshu);
            }else{
                zsNum = zsArr[temp];
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
        for(var i = 0;i<4;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:2500,3:1700,4:1300},{2:3000,3:2000,4:1500},{2:3500,3:2300,4:1800},{2:6000,3:4000,4:3000}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        cc.log("getSocketRuleData in RuleSelect_YZLC");
        var data = {params:[],strParams:""};
        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 6;
        }else if(this.getItemByIdx(0,2).isSelected()){
            jushu = 8;
        }else if(this.getItemByIdx(0,3).isSelected()){
            jushu = 10;
        }else if(this.getItemByIdx(0,4).isSelected()){
            jushu = 20;
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

        var wanfa = 0;
        if(this.getItemByIdx(3,1).isSelected()){
            wanfa = 1;
        }
        var chuo = 14;
        if(renshu == 4){
            chuo = 11;
        }else{
            if(this.getItemByIdx(4,1).isSelected()){
                chuo = 15;
            }
        }

        var jhjf = this.getItemByIdx(5, 0).isSelected() ? 1 : 0;//见红加分
        var qh2f = this.getItemByIdx(5, 1).isSelected() ? 1 : 0;//起胡2分
        var hc4f = this.getItemByIdx(5, 2).isSelected() ? 1 : 0;//红戳4番
        var fachuo = this.getItemByIdx(5, 3).isSelected() ? 1 : 0;//番戳
        if(wanfa == 1){
            fachuo = 0;
        }

        var tuoguan = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            tuoguan = 300;
        }
        var djtg = 1;
        if(this.getItemByIdx(7,1).isSelected()){
            djtg = 2;
        }else if(this.getItemByIdx(7,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(8,1).isSelected())isDouble = 1;

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var dScore = this.dhDScore;
        cc.sys.localStorage.setItem("YZLC_diScore",dScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(10,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("YZLC_addBoxScore",morefen);
        cc.sys.localStorage.setItem("YZLC_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数0
            GameTypeEunmZP.YZLC,//玩法ID 1
            0,//无用  2
            0,//无用  3
            0,//无用  4
            0,//无用  5
            0,//无用  6
            renshu,//人数  7
            0,//无用  8
            costway,//支付方式  9
            0,//无用  10
            0,//无用 11
            0,//12 无用
            0,//无用  13
            0,//无用  14
            0,// 15 无用
            wanfa,// 16 曲戳，定戳
            chuo,// 17 放戳
            jhjf,//18 见红加分
            qh2f,//起胡2分  19
            hc4f,//红戳4番  20
            fachuo,//番戳  21
            0,//无用  22
            tuoguan,//无用  23
            isDouble,// 24 是否翻倍
            dScore,// 25 加分
            doubleNum,// 26 翻几倍
            djtg,//1 单局托管 2 整局托管  27
            0,//无用  28
            0,//无用  29
            0,//无用  30
            0,//无用  31
            0,//无用  32
            0,//无用  33
            0,//无用  34
            0,//无用  35
            0,//无用  36
            0,//无用  37
            0,//无用  38
            0,//无用  39
            0,//无用  40
            0,//无用  41
            0,//无用  42
            0,//无用  43
            0,//无用  44
            0,//无用  45
            allowScore,//低于xx分  46
            morefen//加xx分  47
        ];

        //cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        var jushuArr = [6,8,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
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

        return [GameTypeEunmZP.YZLC,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[1],[0],[0],[0],[],[0],[1],[0],[0],[]];

        var jushuArr = [1,6,8,10,20];
        var index = jushuArr.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = index !== -1 ? index : 0;//局数
        defaultConfig[1][0] = params[9] == 3||params[9] == 4?0:parseInt(params[9]) - 1;//房费
        defaultConfig[2][0] = params[7] == 4 ? 0 : (params[7] == 3 ? 1 : 2);//人数
        defaultConfig[3][0] = params[16] == 0 ? 0:1;//曲戳，定戳
        defaultConfig[4][0] = params[17] == 15 ? 1:0;//戳数
        defaultConfig[6][0] = params[23] == 300?4:params[23]/60;//托管时间
        defaultConfig[7][0] = params[27]== 1 ? 0:params[27]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[8][0] = params[24]== 1 ? 1:0;//是否翻倍
        defaultConfig[9][0] = parseInt(params[26]) - 2 >= 0 ? parseInt(params[26]) - 2 : 0;//翻倍数

        if(params[18] == 1){//见红加分
            defaultConfig[5].push(0);
        }

        if(params[19] == 1){//起胡2分
            defaultConfig[5].push(1);
        }

        if(params[20] == 1){//红戳4番
            defaultConfig[5].push(2);
        }

        if(params[21] == 1){//番戳
            defaultConfig[5].push(3);
        }

        if(params[46] && params[46] != 0 && params[47] && params[47] != 0){
            defaultConfig[10].push(0);
        }

        this.dhDScore = params[25]?parseInt(params[25]):10;//多少分翻倍
        this.allowScore = parseInt(params[46])||10;
        this.addScore = parseInt(params[47])||10;

        this.defaultConfig = defaultConfig;
    },
});