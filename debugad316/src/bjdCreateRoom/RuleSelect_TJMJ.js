/**
 * Created by Administrator on 2019/10/11.
 */
var RuleSelect_TJMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(11);
        this.createNewBox(5);
        this.createDiFenBox(6);
        this.createChangeScoreBox(13);//创建低于xx分加xx分
        this.getItemByIdx(13,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"可选",type:2,content:["报听","可吃牌","豪华七对","自摸胡","杠后三张牌","大进大出","双豪华七对","天胡可抢杠"],col:3},//3
            {title:"天胡抢杠",type:1,content:["炮胡3自摸2","炮胡2自摸3"],col:3},//4
            {title:"抓鸟",type:1,content:["抓1鸟","抓2鸟"],col:3},//5
            {title:"底分",type:2,content:[""]},//6
            {title:"抽牌",type:1,content:["不抽牌","抽13张","抽26张"],col:3},//7
            {title:"王牌",type:1,content:["四王","八王"],col:3},//8
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//9
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//10
            {title:"玩法选择",type:1,content:["不加倍","加倍"],col:3},//11
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//12
            {title:"加分",type:2,content:["低于"]},//13
        ];

        this.defaultConfig = [[0],[1],[0],[0,1,2,3,4,5,7],[0],[1],[],[0],[0],[0],[1],[0],[0],[]];
        this.zzDScore = parseInt(cc.sys.localStorage.getItem("TJMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("TJMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("TJMJ_allowBoxScore")) || 10;/** 低于xx分 **/
        this.addDiFen = parseInt(cc.sys.localStorage.getItem("TJMJ_addDiFen")) || 1;/** 底分 **/

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
            if(params[1] == GameTypeEunmMJ.TJMJ){
                this.readSelectData(params);
            }
        }

        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    createDiFenBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.diFenBox = new changeEditBox(["",1,"分"],1,1,50);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.diFenBox.setWidgetPosition(170,0);//设置位置
        this.diFenBox.setScoreLabel(this.addDiFen);//设置初始值
        this.layoutArr[row].addChild(this.diFenBox);
        this.getItemByIdx(row,0).visible = false;
    },

    createNewBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.newBoxType2 = new SelectBox(2,"鸟必中");
        this.newBoxType2.setPosition(970,0);//设置位置
        this.layoutArr[row].addChild(this.newBoxType2);
        this.newBoxType2.setSelected(this.nblkScore == 1);
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
        this.getLayoutByIdx(11).visible = false;
        this.getLayoutByIdx(12).visible = false;

        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[11].setVisible(true);
            if(this.getItemByIdx(11,0).isSelected()){
                this.layoutArr[12].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[12].setVisible(true);
                this.numBox.visible=true;
            }
            this.layoutArr[13].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(13,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            this.layoutArr[7].setVisible(true);
        }else{
            this.layoutArr[11].setVisible(false);
            this.layoutArr[12].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[13].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
            this.layoutArr[7].setVisible(false);
        }

        if (this.getItemByIdx(9,0).isSelected()){
            this.layoutArr[10].visible = false;
        }else{
            this.layoutArr[10].visible = true;
        }

        this.layoutArr[4].visible = this.getItemByIdx(3,7).isSelected();
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
        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000,4:1500},{2:5000,3:3300,4:2500}
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
        var baoting = this.getItemByIdx(3,0).isSelected() ? 1 : 0;//报听
        var chi = this.getItemByIdx(3,1).isSelected() ? 1 : 0;//可吃牌
        var qidui = this.getItemByIdx(3,2).isSelected() ? 1 : 0;//豪华七对
        var zimoHu = this.getItemByIdx(3,3).isSelected() ? 1 : 0;//自摸胡
        var ghszp = this.getItemByIdx(3,4).isSelected() ? 1 : 0;//杠后三张牌
        var djdc = this.getItemByIdx(3,5).isSelected() ? 1 : 0;//大进大出
        var shhqxd = this.getItemByIdx(3,6).isSelected() ? 1 : 0;//双豪华七小对
        var thkqg = this.getItemByIdx(3,7).isSelected() ? 1 : 0;//天胡可抢杠

        var paohu = 0;
        if(thkqg){
            paohu = this.getItemByIdx(4,0).isSelected() ? 1 : 2;
        }

        var znNum = 1;
        if(this.getItemByIdx(5,1).isSelected())
            znNum = 2;

        var nblk = 0;
        if(this.getItemByIdx(2,2).isSelected()){
            nblk = this.newBoxType2.isSelected() ? 1 : 0;
        }

        var difen = 0;
        difen = this.diFenBox.localScore;
        cc.sys.localStorage.setItem("TJMJ_addDiFen",difen);

        var choupai = 0;
        if(this.getItemByIdx(7,1).isSelected()){
            choupai = 13;
        }else if(this.getItemByIdx(7,2).isSelected()){
            choupai = 26;
        }

        var wang = 0;
        if(this.getItemByIdx(8,1).isSelected()){
            wang = 1;
        }

        var csTuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                csTuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(9,4).isSelected()){
            csTuoguan = 300;
        }

        var Djtg = 1;
        if(this.getItemByIdx(10,1).isSelected())
            Djtg = 2;
        else if(this.getItemByIdx(10,2).isSelected())
            Djtg = 3;

        var IsDouble = 0;
        if(this.getItemByIdx(11,1).isSelected()){
            IsDouble = 1;
        }

        var DScore = this.zzDScore;
        cc.sys.localStorage.setItem("TJMJ_diScore",DScore);
        var DoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(12,i).isSelected()){
                DoubleNum = 2 + i;
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(13,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("TJMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("TJMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.TJMJ,//玩法ID 1
            costway,//支付方式 2
            0,//  *****  无用占位  3
            znNum,//打鸟数 4
            baoting,//报听 5
            qidui,//豪华七对 6
            renshu,//人数 7
            shhqxd,// 双豪华七小对  8
            zimoHu,//自摸胡 9
            paohu,// 0不传 1炮胡3自摸2 2炮胡2自摸3  10
            thkqg,// 天胡可抢杠 11
            djdc,// 大进大出  12
            0,// *****  无用占位 13
            0,  //  *****  无用占位  14
            chi,// 可吃牌  15
            ghszp,// 杠后三张牌  16
            nblk,// 鸟不落空   17
            difen,  // 底分  18
            IsDouble,// 是否加倍 19
            DScore,// 加倍分 20
            DoubleNum,// 加倍数 21
            0,  //  *****  无用占位  22
            0,  //  *****  无用占位  23
            choupai,  //  抽牌的数量  24
            wang,  //  王牌 4王 0 8王 1  25
            0,  //  *****  无用占位  26
            0,  //  *****  无用占位  27
            csTuoguan,//托管时间  28
            Djtg,//单局托管 29
            0,  //  *****  无用占位  30
            0,//fengding,//31 封顶 0,1,2  0~32~64
            0,  //  *****  无用占位  32
            0,  //  *****  无用占位  33
            morefen,//34 "加xx分"
            allowScore//35 "低于xx分"
        ];

        cc.log("data.params =",JSON.stringify(data));
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
        return [GameTypeEunmMJ.TJMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in TJMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[],[0],[1],[],[0],[0],[0],[1],[0],[0],[]];
        defaultConfig[0][0] = params[0] == 8 ? 0 : 1;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0: parseInt(params[2]) - 1;
        defaultConfig[2][0] = params[7] == 4 ? 0 : params[7] == 3 ? 1 : 2;
        defaultConfig[4][0] = params[10] == 2 ? 1 : 0;
        defaultConfig[5][0] = parseInt(params[4]) - 1;
        this.nblkScore = params[17];
        defaultConfig[7][0] = params[24] == 0 ? 0 : params[24] == 13 ? 1 : 2;/**** 新增抽牌两人 */
        defaultConfig[8][0] = params[25] == 0 ? 0 : 1;//4王-8王
        defaultConfig[9][0] = params[28] == 1?1:params[28] == 300?4:params[28]/60;
        defaultConfig[10][0] = params[29]== 1 ? 0:params[29]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[11][0] = params[19];
        defaultConfig[12][0] = params[21] - 2;
        if(params[34] && parseInt(params[34]) > 0 && params[35] && parseInt(params[35]) > 0)defaultConfig[13].push(0);
        this.zzDScore = parseInt(params[20]);
        if(params[5]=="1")defaultConfig[3].push(0);
        if(params[15] == "1")defaultConfig[3].push(1);
        if(params[6] == "1")defaultConfig[3].push(2);
        if(params[9] == "1")defaultConfig[3].push(3);
        if(params[16] == "1")defaultConfig[3].push(4);
        if(params[12] == "1")defaultConfig[3].push(5);
        if(params[8] == "1")defaultConfig[3].push(6);
        if(params[11] == "1")defaultConfig[3].push(7);
        this.allowScore = parseInt(params[35])||10;
        this.addScore = parseInt(params[34])||10;
        this.addDiFen = parseInt(params[18])|| 1;//底分
        this.defaultConfig = defaultConfig;
    },
});