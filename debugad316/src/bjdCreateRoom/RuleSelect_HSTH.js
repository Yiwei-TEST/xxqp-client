/**
 * Created by cyp on 2019/11/13.
 */
var RuleSelect_HSTH = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(7);
        this.createChangeScoreBox(9);//创建低于xx分加xx分
        this.getItemByIdx(9,0).itemBtn.setContentSize(120,60);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1局","2局","4局","6局"],col:4},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:4},//1
            {title:"人数",type:1,content:["4人","2人"],col:4},//2
            {title:"牌数",type:1,content:["8副","9副","10副","12副","13副","14副"],col:3},//3
            {title:"玩法",type:2,content:["显示剩余牌","5同奖分","沉死分给对手","托管必打"],col:3},//4
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//5
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//6
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//7
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//8
            {title:"加分",type:2,content:["低于"]},//9
        ];

        this.defaultConfig = [[0],[1],[0],[0],[3],[0],[0],[0],[0],[]];

        this.hzDScore = parseInt(cc.sys.localStorage.getItem("HSTH_diScore")) || 50;
        this.addScore = parseInt(cc.sys.localStorage.getItem("HSTH_addBoxScore")) || 50;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("HSTH_allowBoxScore")) || 50;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmPK.HSTH){
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
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        var istg = !this.getItemByIdx(5,0).isSelected();
        this.layoutArr[6].setVisible(istg);

        this.getLayoutByIdx(7).visible = false;
        this.getLayoutByIdx(8).visible = false;

        var is2ren = this.getItemByIdx(2,1).isSelected();
        var isjb = this.getItemByIdx(7,1).isSelected();

        this.layoutArr[7].setVisible(is2ren);
        this.layoutArr[8].setVisible(is2ren && isjb);
        this.layoutArr[9].setVisible(is2ren);

        this.numBox.setVisible(is2ren && isjb);
        this.addNumBox.itemBox.setVisible(is2ren);
        this.allowNumBox.itemBox.setVisible(is2ren);
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 3;
        var zsNumArr = [1,3,4,5];
        var temp = 0;
        var renshu = 4;
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        for(var i = 0;i<4;++i){
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
        var renshu = 4;
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        var temp = 0;
        for(var i = 0;i<4;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:2000,4:1000},{2:2000,4:1000},{2:2500,4:1300},{2:3000,4:1500}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    createChangeScoreBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.addNumBox = new changeEditBox(["",50,"分"],50,50,2000);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.addNumBox.setWidgetPosition(850,0);//设置位置
        this.addNumBox.setScoreLabel(this.addScore);//设置初始值
        this.layoutArr[row].addChild(this.addNumBox);

        this.addLabel = UICtor.cLabel("加",38,null,cc.color(126,49,2));
        //this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",50,"分"],50,50,2000);
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
        reduceBtn.setPosition(0,BoxBg.height/2);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setPosition(BoxBg.width,BoxBg.height/2);
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
            num = num - 50;
        }else{
            num = num + 50;
        }
        if (num >= 50 && num <= 2000){
            this.hzDScore = num;
        }

        cc.log("this.hzDScore =",this.hzDScore);
        this.scoreLabel.setString("小于"+ this.hzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 2;
        var jushuArr = [1,2,4,6];
        for(var i = 0;i<4;++i){
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
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        var paishu = 8;
        var paishuArr = [8,9,10,12,13,14];
        for(var i = 0;i<6;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                paishu = paishuArr[i];
                break;
            }
        }

        var xsps = 0;
        if(this.getItemByIdx(4,0).isSelected())xsps = 1;

        var wtjf = 0;
        if(this.getItemByIdx(4,1).isSelected())wtjf = 1;

        var csfgds = 0;
        if(this.getItemByIdx(4,2).isSelected())csfgds = 1;

        var tgbd = 0;
        if(this.getItemByIdx(4,3).isSelected())tgbd = 1;

        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(5,4).isSelected()){
            tuoguan = 300;
        }
        var tuoguan_type = 2;
        for(var i = 0;i<3;++i){
            if (this.getItemByIdx(6,i).isSelected()){
                tuoguan_type = i+1;
            }
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

        cc.sys.localStorage.setItem("HSTH_diScore",this.hzDScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(9,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("HSTH_addBoxScore",morefen);
        cc.sys.localStorage.setItem("HSTH_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.HSTH,//玩法ID 1
            costway,//支付方式 2
            xsps,//显示牌数 3
            paishu,//几副牌 4
            wtjf,//5同奖分 5
            csfgds,//沉死分给对手 6
            renshu,//人数 7
            tgbd,//托管必打 8
            tuoguan,//托管时间 9
            tuoguan_type,//托管类型 10
            isjb,//是否加倍 11
            this.hzDScore,//加倍分 12
            doubleNum,//加倍数 13
            morefen,//"加xx分" 14
            allowScore,//"低于xx分" 15
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 2;
        var jushuArr = [2,4,6];
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
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        return [GameTypeEunmPK.HSTH,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[0],[],[0],[0],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 1?0:((params[0]/2 - 1) || 0);
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?1:0;

        var paishuArr = [8,9,10,12,13,14];
        var idx = ArrayUtil.indexOf(paishuArr,params[4]);
        defaultConfig[3][0] = idx > 0?idx:0;


        if(params[3] == "1")defaultConfig[4].push(0);
        if(params[5] == "1")defaultConfig[4].push(1);
        if(params[6] == "1")defaultConfig[4].push(2);
        if(params[8] == "1")defaultConfig[4].push(3);

        defaultConfig[5][0] = params[9]?params[9] == 300?4:params[9]/60:0;
        defaultConfig[6][0] = (params[10]>0?(params[10]-1):1);

        defaultConfig[7][0] = params[11] == 1?1:0;
        defaultConfig[8][0] = params[13]-2;

        if(params[15] > 0)defaultConfig[9].push(0);

        this.hzDScore = parseInt(params[12])||50;

        this.addScore = parseInt(params[14])||50;
        this.allowScore = parseInt(params[15])||50;

        this.defaultConfig = defaultConfig;
    },
});