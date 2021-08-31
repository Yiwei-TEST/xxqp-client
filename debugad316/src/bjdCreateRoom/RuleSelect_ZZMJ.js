/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_ZZMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox(12);//创建低于xx分加xx分
        this.getItemByIdx(12,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
        // this.getLayoutByIdx(5).visible= false;
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","12局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"可选",type:2,content:["庄闲（算分）","可胡七对","可抢公杠胡","抢杠胡包三家","点炮胡","有炮必胡","流局算杠分","放杠+3分","可吃","缺一门"],col:3},//3
            {title:"玩法选择",type:1,content:["不抓鸟","抓2鸟(159)","抓4鸟(159)","抓6鸟(159)","抓8鸟(159)","一鸟全中","胡几抓几"],col:4},//4
            {title:"飘分",type:1,content:["不飘分","1","2","3","自由下飘","首局定飘"],col:3},//5
            {title:"坐庄",type:1,content:["随机","先进房坐庄"],col:3},//6
            {title:"底分",type:1,content:["1","2","5","10"]},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//9
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//10
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//11
            {title:"加分",type:2,content:["低于"]},//12
        ];

        this.defaultConfig = [[0],[1],[0],[7],[0],[0],[0],[0],[0],[1],[0],[0],[]];
        this.zzDScore = parseInt(cc.sys.localStorage.getItem("ZZMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("ZZMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("ZZMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.ZZMJ){
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
        this.addLabel.setAnchorPoint(0.5,0.5);
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
        this.getLayoutByIdx(10).visible = false;
        this.getLayoutByIdx(11).visible = false;

        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[10].setVisible(true);
            if(this.getItemByIdx(10,0).isSelected()){
                this.layoutArr[11].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[11].setVisible(true);
                this.numBox.visible=true;

            }
            this.layoutArr[12].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(12,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[12].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if (!this.getItemByIdx(3,2).isSelected()){
            this.getItemByIdx(3,3).setSelected(false);
        }
        if (!this.getItemByIdx(3,4).isSelected()){
            this.getItemByIdx(3,5).setSelected(false);
        }

        if (this.getItemByIdx(8,0).isSelected()){
            this.layoutArr[9].visible = false;
        }else{
            this.layoutArr[9].visible = true;
        }

        this.getItemByIdx(3,9).visible = this.getItemByIdx(2,2).isSelected();
        this.getItemByIdx(3,9).setItemState(this.getItemByIdx(2,2).isSelected());
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [2,2,2];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
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
            if(this.getItemByIdx(1,0).isSelected()){
                // zsNum = Math.ceil(zsNumArr[temp]/renshu);
                zsNum = 1;
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
        for(var i = 0;i<3;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000,4:1500},{2:4500,3:3000,4:2300},{2:5000,3:3300,4:2500}
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
        cc.log("this.zzDScore =",this.zzDScore);
        this.scoreLabel.setString("小于"+ this.zzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
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

        // var zzHuScore = 1;
        // if (this.getItemByIdx(3,1).isSelected())
        //     zzHuScore = 2;
        var zzZxsf = 0;
        if (this.getItemByIdx(3,0).isSelected())
            zzZxsf=1;
        var zzKhqd = 0;
        if (this.getItemByIdx(3,1).isSelected())
            zzKhqd=1;
        var zzKqgg = 0;
        if (this.getItemByIdx(3,2).isSelected())
            zzKqgg=1;
        var zzQghbsj = 0;
        if (this.getItemByIdx(3,3).isSelected())
            zzQghbsj=1;
        var zzYpbh = 0;
        if (this.getItemByIdx(3,5).isSelected())
            zzYpbh=1;
        var tuoguan = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(8,4).isSelected()){
            tuoguan = 300;
        }
        var zzDph = 0;
        if (this.getItemByIdx(3,4).isSelected())
            zzDph=1;
        var zzHzsgf = 0;
        if (this.getItemByIdx(3,6).isSelected())
            zzHzsgf=1;
        var zzFgjsf = 0;
        if (this.getItemByIdx(3,7).isSelected())
            zzFgjsf = 1;
        var zzZn =0;
        for(var i = 0; i < 7; i ++){
            if(this.getItemByIdx(4,i).isSelected()){
                zzZn = i*2;
                break;
            }
        }
        var zzDf = 1;
        for(var i = 0; i < 2; i ++){
            if(this.getItemByIdx(7,i).isSelected()){    
                zzDf = i+1;
                break;
            }
        }
        if(this.getItemByIdx(7,2).isSelected())
            zzDf = 5;
            
        if(this.getItemByIdx(7,3).isSelected())
            zzDf = 10;
        var ZZDjtg = 1;
        if(this.getItemByIdx(9,1).isSelected())
            ZZDjtg = 2;
        else if(this.getItemByIdx(9,2).isSelected())
            ZZDjtg = 3;
        var zzIsDouble = 0;
        if(this.getItemByIdx(10,1).isSelected()){
            zzIsDouble = 1;
        }
        var zzDScore = 0;
        zzDScore = this.zzDScore;
        cc.sys.localStorage.setItem("ZZMJ_diScore",zzDScore);
        var zzDoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                zzDoubleNum = 2 + i;
                break;
            }
        }
        
        var zzZhuangtype = 1;
        if (this.getItemByIdx(6,1).isSelected())
            zzZhuangtype=2;
        // cc.log("zzZn = ,zzDf =",zzZn ,zzDf);

        var keChi = 0;
        if (this.getItemByIdx(3,8).isSelected()){
            keChi = 1;
        }

        var queYiMen = 0;
        if (this.getItemByIdx(3,9).isSelected() && this.getItemByIdx(2,2).isSelected()){
            queYiMen = 1;
        }

        var piaofen = 0;
        for (var i = 0; i < 6; i++) {
            if(this.getItemByIdx(5,i).isSelected()){
                piaofen = i;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("ZZMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("ZZMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.ZZMJ,//玩法ID 1
            costway,//支付方式 2
            zzZxsf,//庄闲算分 3
            zzKhqd,//可胡七对 4
            zzKqgg,//可抢公杠胡 5
            zzQghbsj,//抢杠胡包三家 6
            renshu,//人数 7
            zzYpbh,//有炮必胡 8
            tuoguan,//托管 9
            zzZn,//抓鸟 0 不抓 10 一鸟全中 12 摸几奖几 10
            zzDf,//底分 11
            zzIsDouble,// 20是否加倍 12
            zzDScore,// 加倍分 13
            zzDoubleNum,// 加倍数 14
            zzDph,//点炮胡 15
            zzZhuangtype,//坐庄 1随机 2先进房坐庄 16
            zzHzsgf,//黄庄算杠分 17
            zzFgjsf,//放杠加3分 18
            ZZDjtg,//单局托管 19
            piaofen,//飘分 20
            morefen,//21 "加xx分"
            allowScore,//22 "低于xx分"
            queYiMen,//23 缺一门
            keChi,//24 可吃
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushuArr = [8,12,16];
        var jushu = 8;
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
        return [GameTypeEunmMJ.ZZMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in ZZMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[0],[0],[0],[0],[]];
        defaultConfig[0][0] = params[0] == 16?2:params[0] == 12?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0: params[2] - 1;
        defaultConfig[2][0] = params[7] == 3?1:params[7]==2?2:0;
        defaultConfig[4][0] = parseInt(params[10])/2;
        defaultConfig[5][0] = parseInt(params[20]);
        defaultConfig[6][0] = params[16]-1;
        defaultConfig[7][0] = params[11] == 2?1:params[11] == 5?2:params[11]==10?3:0;
        defaultConfig[8][0] = params[9] == 1?1:params[9] == 300?4:params[9]/60;
        defaultConfig[9][0] = params[19]== 1 ? 0:params[19]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[10][0] = params[12];
        defaultConfig[11][0] = params[14] - 2;
        if(params[21] && parseInt(params[21]) > 0)defaultConfig[12].push(0);
        this.zzDScore = parseInt(params[13]);
        if(params[3]=="1")defaultConfig[3].push(0);
        if(params[4] == "1")defaultConfig[3].push(1);
        if(params[5] == "1")defaultConfig[3].push(2);
        if(params[6] == "1")defaultConfig[3].push(3);
        if(params[15] == "1")defaultConfig[3].push(4);
        if(params[8] == "1")defaultConfig[3].push(5);
        if(params[17] == "1")defaultConfig[3].push(6);
        if(params[18] == "1")defaultConfig[3].push(7);
        if(params[23] == "1")defaultConfig[3].push(9);
        if(params[24] == "1")defaultConfig[3].push(8);
        this.addScore = parseInt(params[21])||10;
        this.allowScore = parseInt(params[22])||10;
        this.defaultConfig = defaultConfig;
    },
});