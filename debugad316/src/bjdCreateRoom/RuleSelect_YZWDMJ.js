/**
 * Created by Administrator on 2019/8/6.
 */
var RuleSelect_YZWDMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(8);
        this.createChangeScoreBox(10);//创建低于xx分加xx分
        this.getItemByIdx(10,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1局","6局","8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"可选",type:2,content:["两片","抢杠胡","七对可胡","庄闲分","底分2分","无筒子","碰碰胡x2","七对x2","清一色x2"],col:3}, //3
            {title:"码牌",type:1,content:["4码","6码","8码","数字码"],col:3},            //4
            {title:"飘分",type:1,content:["不飘分","1","2","3","自由下飘","首局定飘"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},    //6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},             //7
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},                           //8
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},                  //9
            {title:"加分",type:2,content:["低于"]},//10
        ];

        this.defaultConfig = [[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];
        this.syDScore = parseInt(cc.sys.localStorage.getItem("YZWDMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("YZWDMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("YZWDMJ_allowBoxScore")) || 10;/** 低于xx分 **/
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
            if(params[1] == GameTypeEunmMJ.YZWDMJ){
                this.readSelectData(params);
            }
        }

        return true;
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

        if (this.getItemByIdx(6,0).isSelected()){
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

        var zsNum = 4;//5;
        var zsNumArr = [1,4,5,8];//[5,8,10];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
                break;
            }
        }

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
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
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
            {2:2500,3:1700,4:1200},{2:2500,3:1700,4:1200},{2:3000,3:2000,4:1500},{2:4500,3:3000,4:2300}
        ]

        var num = configArr[temp][renshu];

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.syDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.syDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.syDScore = num - 5;
            }else{
                this.syDScore = num;
            }
        }else if ( num < 10){
            this.syDScore = 5;
        }
        cc.log("this.syDScore =",this.syDScore);
        this.scoreLabel.setString("小于"+ this.syDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var jushuArr = [1,6,8,16];
        var jushu = 6;
        for(var i = 0;i<jushuArr.length;++i){
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
            if(this.getItemByIdx(1,1).isSelected()) costway = 2;
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var lp = 0;if (this.getItemByIdx(3,0).isSelected()) lp = 1;
        var qgh = 0;if (this.getItemByIdx(3,1).isSelected()) qgh = 1;
        var qdkh = 0;if (this.getItemByIdx(3,2).isSelected()) qdkh = 1;
        var zxf = 0;if (this.getItemByIdx(3,3).isSelected()) zxf = 1;
        var df2f = 0;if (this.getItemByIdx(3,4).isSelected()) df2f = 1;
        var wutongzi = 0;if (this.getItemByIdx(3,5).isSelected()) wutongzi = 1;
        var pph = 0;if (this.getItemByIdx(3,6).isSelected()) pph = 1;
        var qd = 0;if (this.getItemByIdx(3,7).isSelected()) qd = 1;
        var qys = 0;if (this.getItemByIdx(3,8).isSelected()) qys = 1;

        var mapai = 4;
        for (var i = 0; i < 4; i++) {
            if (this.getItemByIdx(4,i).isSelected()){
                mapai = mapai +i*2;
            }
        }

        var piaofen = 0;
        for (var i = 0; i < 6; i++) {
            if(this.getItemByIdx(5,i).isSelected()){
                piaofen = i;
            }
        }

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(7,0).isSelected()){
            djtg = 1;
        }
        if (this.getItemByIdx(7,2).isSelected()){
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

        var dScore = 0;
        dScore = this.syDScore;
        cc.sys.localStorage.setItem("YZWDMJ_diScore",dScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(10,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("YZWDMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("YZWDMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.YZWDMJ, //玩法ID 1
            costway, //支付方式 2
            lp,     //两片 3（0,1）
            qgh,    //抢杠胡 4（0,1）
            qdkh,   //七对可胡 5（0,1）
            zxf,    //庄闲分   6（0,1）
            renshu, //人数  7（2,3,4）
            pph,   //碰碰胡  8（0,1）
            df2f,  //底分2分 9(0,1)
            mapai, //码牌 10(4,6,8,10 10数字码)
            autoPlay,//托管时间 11
            djtg,//单局托管 12
            isDouble,//是否加倍 13
            doubleNum,//加倍倍数 14
            dScore,//底分 15
            piaofen,//飘分 16
            wutongzi,//无筒子 17
            qd,//七对 18
            qys,//清一色 19
            morefen,//20 "加xx分"
            allowScore,//21 "低于xx分"
        ];

        // cc.log("data.params =",JSON.stringify(data));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushuArr = [1,6,8,16];
        var jushu = 6;
        for(var i = 0;i<jushuArr.length;++i){
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
        return [GameTypeEunmMJ.YZWDMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];

        var jushuArr = [1,6,8,16];
        var idx = jushuArr.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = idx > 0?idx:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] ==3?1:params[7]==2?2:0 ;
        defaultConfig[4][0] = parseInt(params[10])/2 - 2 ;
        defaultConfig[5][0] = parseInt(params[16]);
        defaultConfig[6][0] = params[11]==1?1:params[11] == 300?4:params[11]/60;
        defaultConfig[7][0] = params[12]?params[12]-1:1;
        defaultConfig[8][0] = params[13] == 1 ? 1 :0;
        defaultConfig[9][0] = params[14] == 3 ? 1 :params[14]==4?2:0;

        if(params[20] && parseInt(params[20]) > 0)defaultConfig[10].push(0);

        if(params[3] == "1")defaultConfig[3].push(0);
        if(params[4] == "1")defaultConfig[3].push(1);
        if(params[5] == "1")defaultConfig[3].push(2);
        if(params[6] == "1")defaultConfig[3].push(3);
        if(params[9] == "1")defaultConfig[3].push(4);
        if(params[17] == "1")defaultConfig[3].push(5);
        if(params[8] == "1")defaultConfig[3].push(6);
        if(params[18] == "1")defaultConfig[3].push(7);
        if(params[19] == "1")defaultConfig[3].push(8);

        this.syDScore = parseInt(params[15]) || 5;

        this.addScore = parseInt(params[20])||10;
        this.allowScore = parseInt(params[21])||10;

        this.defaultConfig = defaultConfig;
    },
});