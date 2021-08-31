/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_BSMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(7);
        this.createChangeScoreBox(9);//创建低于xx分加xx分
        this.getItemByIdx(9,0).itemBtn.setContentSize(120,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["4局","8局","12局"]},// 0
            {title:"房费",type:1,content:["AA支付","房主支付"]},// 1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},// 2
            {title:"玩法",type:2,content:["有风","一条龙","四归一","来门报听","查叫","查大叫"]},// 3
            {title:"买点",type:2,content:["买死点上限1","买死点上限2","买活点上限1","买活点上限2","买活点固定1"],col:3},// 4
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//5
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//6
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//7
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//8
            {title:"加分",type:2,content:["低于"]},//9
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[1],[0],[0],[]];

        this.dhDScore = parseInt(cc.sys.localStorage.getItem("BSMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("BSMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("BSMJ_allowBoxScore")) || 10;/** 低于xx分 **/
        this.addDiFen = parseInt(cc.sys.localStorage.getItem("BSMJ_addDiFen")) || 1;/** 底分 **/

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
            if(params[1] == GameTypeEunmMJ.BSMJ){
                this.readSelectData(params);
            }
        }
        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    changeHandle:function(item){
        cc.log("changeHandle in RuleSelect_BSMJ")
        var tag = item.getTag();
        cc.log("changeHandle tag",tag);
        if(tag < 300){
            this.updateZsNum();
        }

        if (this.getItemByIdx(4, 1) == item || this.getItemByIdx(4, 2) == item ||
            this.getItemByIdx(4, 3) == item ||this.getItemByIdx(4, 4) == item ||
            this.getItemByIdx(4, 0) == item ){// 点击的是买点一行
            for(var i = 0;i<5;++i) {
                if (this.getItemByIdx(4, i) == item) {
                    //this.getItemByIdx(4, i).setSelected(true);
                }
                else{
                    this.getItemByIdx(4, i).setSelected(false);
                }
            }
        }

        if (this.getItemByIdx(3, 4) == item){//查叫、查大叫互斥
            this.getItemByIdx(3, 5).setSelected(false);
        }else if (this.getItemByIdx(3, 5) == item){
            this.getItemByIdx(3, 4).setSelected(false);
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        cc.log("updateItemShow in RuleSelect_BSMJ");
        if (this.getItemByIdx(5,0).isSelected()){
            this.layoutArr[6].visible = false;
        }else{
            this.layoutArr[6].visible = true;
        }

        if(this.getItemByIdx(4, 0).isSelected() || this.getItemByIdx(4, 1).isSelected()){
            this.getItemByIdx(3, 1).setItemState(false);
            this.getItemByIdx(3, 2).setItemState(false);
            this.getItemByIdx(3, 3).setItemState(false);
        }else{
            this.getItemByIdx(3, 1).setItemState(true);
            this.getItemByIdx(3, 2).setItemState(true);
            this.getItemByIdx(3, 3).setItemState(true);
        }

        if (this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[7].visible = true;
            if (this.getItemByIdx(7,1).isSelected()){
                this.layoutArr[8].visible= true;
                this.numBox.visible = true;
            }else{
                this.layoutArr[8].visible= false;
                this.numBox.visible = false;
            }
            this.layoutArr[9].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(9,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.numBox.visible = false;
            this.layoutArr[7].visible = false;
            this.layoutArr[8].visible= false;
            this.layoutArr[9].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
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

        var zsNum = 18;

        var zsArr = {0:[4,6,6],1:[7,12,12],2:[11,18,18]};

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
                zsArr = {0:[2,2,2],1:[4,4,3],2:[6,6,5]};
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
            {2:2000,3:2000,4:1500},{2:4000,3:4000,4:3000},{2:6000,3:6000,4:4500}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        cc.log("getSocketRuleData in RuleSelect_BSMJ")
        var data = {params:[],strParams:""};
        var jushu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = 4 + i*4;
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
        var gps = 0;
        var youfeng = 0;
        if(this.getItemByIdx(3,0).isSelected())youfeng = 1;
        var yitiaolong = 0;
        if(this.getItemByIdx(3,1).isSelected())yitiaolong = 1;
        var siguiyi = 0;
        if(this.getItemByIdx(3,2).isSelected())siguiyi = 1;
        var baoting = 0;
        if(this.getItemByIdx(3,3).isSelected())baoting = 1;
        var buyPoint = 0;
        for(var i = 0;i<5;++i) {
            if (this.getItemByIdx(4, i).isSelected())buyPoint = i+1;
        }
        var chajiao = 0;
        if(this.getItemByIdx(3,4).isSelected())chajiao = 1;
        else if(this.getItemByIdx(3,5).isSelected())chajiao = 2;
        var tuoguan = 0;
        // if(this.getItemByIdx(3,5).isSelected())tuoguan = 1;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(5,4).isSelected()){
            tuoguan = 300;
        }
        var djtg = 1;
        if(this.getItemByIdx(6,1).isSelected()){
            djtg = 2;
        }else if(this.getItemByIdx(6,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(7,1).isSelected())isDouble = 1;

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var dScore = this.dhDScore;
        cc.sys.localStorage.setItem("BSMJ_diScore",dScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(9,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("BSMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("BSMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数0
            GameTypeEunmMJ.BSMJ,//玩法ID 1
            costway,//支付方式2
            renshu,//人数3
            gps,//无用4
            youfeng,//有风5
            yitiaolong,//一条龙6
            siguiyi,//四归一7
            baoting,//报听8
            buyPoint,//买点9
            chajiao,//查叫10
            tuoguan,//托管 11
            djtg,//12 1 单局托管 2 整局托管 3三局托管
            isDouble,// 13 是否翻倍
            dScore,// 14 加分
            doubleNum,// 15 翻几倍
            morefen,// 16 加xx分
            allowScore//17 低于xx分
        ];

        //cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = 8 + i*4;
                break;
            }
        }

        var costway = 1;  
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()) {
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

        return [GameTypeEunmMJ.BSMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[1],[0],[],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 4?0: params[0] == 8?1 : 2;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0: params[2] - 1;//支付方式
        defaultConfig[2][0] = params[3] == 4?0: params[3] == 3?1 : 2;//人数
        defaultConfig[4][0] = params[9] - 1;//买点
        defaultConfig[5][0] = params[11] == 1?1:params[11] == 300?4:params[11]/60;
        defaultConfig[6][0] = params[12] == 2 ? 1 : params[12] == 3 ? 2 : 0;//params[12]?params[12] - 1:1;//单局托管
        defaultConfig[7][0] = params[13] == 1?1:0;
        defaultConfig[8][0] = parseInt(params[15])-2;

        if(params[5] == "1")defaultConfig[3].push(0);
        if(params[6] == "1")defaultConfig[3].push(1);
        if(params[7] == "1")defaultConfig[3].push(2);
        if(params[8] == "1")defaultConfig[3].push(3);
        if(params[10] == "1")defaultConfig[3].push(4);
        if(params[10] == "2")defaultConfig[3].push(5);

        if(params[16] && params[16] != 0 && params[17] && params[17] != 0){
            defaultConfig[9].push(0);
        }

        this.dhDScore = parseInt(params[14]) || 5;
        this.addScore = parseInt(params[16])|| 10;
        this.allowScore = parseInt(params[17])||10;

        this.defaultConfig = defaultConfig;
    },
});