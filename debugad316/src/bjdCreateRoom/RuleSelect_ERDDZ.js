/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_ERDDZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(7);
        this.createChangeScoreBox(9);//创建低于xx分加xx分
        this.getItemByIdx(9,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["4局","8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"封顶",type:1,content:["不封顶","24倍","48倍","96倍","192倍"],col:3},//2
            {title:"让牌",type:1,content:["不让牌","可让2张","可让3张","可让4张"],col:4},//3
            {title:"玩法",type:2,content:["三张","三带二","四带二","底牌翻倍","不带加倍","轮流先叫"],col:3},//4
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//5
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//6
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//7
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//8
            {title:"加分",type:2,content:["低于"]},//9
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0,1,2],[0],[1],[0],[0],[]];
        this.hzDScore = parseInt(cc.sys.localStorage.getItem("ERDDZ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("ERDDZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("ERDDZ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmPK.ERDDZ){
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

        var isjb = this.getItemByIdx(7,1).isSelected();

        this.layoutArr[8].setVisible(isjb);

        this.numBox.setVisible(isjb);

        var istg = !this.getItemByIdx(5,0).isSelected();
        this.layoutArr[6].setVisible(istg);

    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 3;
        var zsNumArr = [3,5,10];
        var temp = 0;
        var renshu = 2;
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
            if(this.getItemByIdx(1,0).isSelected()){
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp];
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 2;

        var temp = 0;
        for(var i = 0;i<3;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:2000},{2:3000},{2:5000}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    //row 第几列
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.hzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.hzDScore;
        // cc.log("temp =,num = ",temp,num);
        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }
        // cc.log("num && num >= 10 && num < 40 ",num && num >= 10 && num < 40)
        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.hzDScore = num - 5;
            }else{
                this.hzDScore = num;
            }
        }else if ( num < 10){
            this.hzDScore = 5;
        }
        cc.log("this.hzDScore =",this.hzDScore);
        this.scoreLabel.setString("小于"+ this.hzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 4;
        if(this.getItemByIdx(0,1).isSelected())jushu = 8;
        if(this.getItemByIdx(0,2).isSelected())jushu = 16;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 2;

        var fengding = 0;
        var fdArr = [0,24,48,96,192];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                fengding = fdArr[i];
            }
        }

        var rangpai = 0;
        for(var i = 1;i<4;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                rangpai = i + 1;
                break;
            }
        }

        var sanzhang = 0;
        if(this.getItemByIdx(4,0).isSelected())sanzhang = 1;

        var sandaier = 0;
        if(this.getItemByIdx(4,1).isSelected())sandaier = 1;

        var sidaier = 0;
        if(this.getItemByIdx(4,2).isSelected())sidaier = 1;

        var dpfb = 0;
        if(this.getItemByIdx(4,3).isSelected())dpfb = 1;

        var bdjb = 0;
        if(this.getItemByIdx(4,4).isSelected())bdjb = 1;

        var llxj = 0;
        if(this.getItemByIdx(4,5).isSelected())llxj = 1;

        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(5,4).isSelected())tuoguan = 300;

        var tgType = 2;
        if (this.getItemByIdx(6,0).isSelected()){
            tgType = 1;
        }else if (this.getItemByIdx(6,2).isSelected()){
            tgType = 3;
        }

        var isjb = 0;
        if(this.getItemByIdx(7,1).isSelected())isjb = 1;

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                doubleNum = 2 + i;
                break;
            }
        }

        cc.sys.localStorage.setItem("ERDDZ_diScore",this.hzDScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(9,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("ERDDZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("ERDDZ_allowBoxScore",allowScore);

        data.params = [
            jushu,//0 局数
            GameTypeEunmPK.ERDDZ,//1 玩法ID
            costway,//2 支付方式
            fengding,//3 封顶
            rangpai,//4 让牌
            sanzhang,//5 三张
            sandaier,//6 三带二
            renshu,//7 人数
            sidaier,//8 四带二
            dpfb,//9 底牌翻倍
            bdjb,//10 不带加倍
            llxj,//11 轮流先叫
            tuoguan,//12 托管
            tgType,//13 托管类型
            isjb,//14 是否加倍
            this.hzDScore,//15 加倍分
            doubleNum,//16 加倍数
            morefen,//17 "加xx分"
            allowScore,//18 "低于xx分"
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 4;
        if(this.getItemByIdx(0,1).isSelected())jushu = 8;
        if(this.getItemByIdx(0,2).isSelected())jushu = 16;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 2;

        return [GameTypeEunmPK.ERDDZ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[1],[0],[0],[],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0]==16?2:params[0]==8?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;

        var fdArr = [0,24,48,96,192];
        var idx = ArrayUtil.indexOf(fdArr,params[3]);
        defaultConfig[2][0] = idx >= 0?idx:0;

        defaultConfig[3][0] = params[4]==4?3:params[4]==3?2:params[4]==2?1:0;

        if(params[5] == 1)defaultConfig[4].push(0);
        if(params[6] == 1)defaultConfig[4].push(1);
        if(params[8] == 1)defaultConfig[4].push(2);
        if(params[9] == 1)defaultConfig[4].push(3);
        if(params[10] == 1)defaultConfig[4].push(4);
        if(params[11] == 1)defaultConfig[4].push(5);

        defaultConfig[5][0] = params[12]?params[12] == 300?4:params[12]/60:0;
        defaultConfig[6][0] = (params[13]-1) || 0;

        defaultConfig[7][0] = params[14] == 1?1:0;
        defaultConfig[8][0] = params[16]-2;

        if(params[18] > 0)defaultConfig[9].push(0);

        this.hzDScore = parseInt(params[15]);

        this.addScore = parseInt(params[17])||10;
        this.allowScore = parseInt(params[18])||10;

        this.defaultConfig = defaultConfig;
    },
});