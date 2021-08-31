/**
 * Created by Administrator on 2019/10/11.
 */
var RuleSelect_YYNXMJ = RuleSelectBase.extend({
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
            {title:"玩法",type:2,content:["海底捞加2分","杠上花加2分","小胡可抢杠"],col:3},//3
            {title:"中鸟",type:1,content:["飞鸟","平鸟"],col:3},//4
            {title:"抓鸟",type:1,content:["抓1鸟","抓2鸟"],col:3},//5
            {title:"抽牌",type:1,content:["不抽","抽1门"],col:3},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//8
            {title:"玩法选择",type:1,content:["不加倍","加倍"],col:3},//9
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//10
            {title:"加分",type:2,content:["低于"]},//11
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[1],[0],[0],[1],[0],[0],[]];
        this.zzDScore = parseInt(cc.sys.localStorage.getItem("YYNXMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("YYNXMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("YYNXMJ_allowBoxScore")) || 10;/** 低于xx分 **/


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
            if(params[1] == GameTypeEunmMJ.YYNXMJ){
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
        this.getLayoutByIdx(9).visible = false;
        this.getLayoutByIdx(10).visible = false;

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
            this.layoutArr[6].setVisible(true);
        }else{
            this.layoutArr[9].setVisible(false);
            this.layoutArr[10].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[11].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
            this.layoutArr[6].setVisible(false);
        }

        if (this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].visible = false;
        }else{
            this.layoutArr[8].visible = true;
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
        var BoxBg = new cc.Sprite("res/ui/phz/phzCreateRoom/img_15.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 430 + (788/(this.layoutArr[row].itemArr.length));

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/phz/phzCreateRoom/img_16.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,0);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/phz/phzCreateRoom/img_14.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(BoxBg.width-addBtn.width+5,0);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.zzDScore+"分",24,null,cc.color(126,49,2));
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

        var hdl2f = 0;
        var gsh2f = 0;
        var kqgh = 0;
        if(this.getItemByIdx(3,0).isSelected()) hdl2f =1;
        if(this.getItemByIdx(3,1).isSelected()) gsh2f =1;
        if(this.getItemByIdx(3,2).isSelected()) kqgh =1;

        var zhongniao = 1;
        if(this.getItemByIdx(4,1).isSelected()) zhongniao = 2;

        var zhuaniao = 1;
        if(this.getItemByIdx(5,1).isSelected()) zhuaniao = 2;

        var choupai = 0;
        if(this.getItemByIdx(6,1).isSelected()) choupai = 1;

        var csTuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                csTuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(7,4).isSelected()){
            csTuoguan = 300;
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
        cc.sys.localStorage.setItem("YYNXMJ_diScore",DScore);
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
        cc.sys.localStorage.setItem("YYNXMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("YYNXMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.YYNXMJ,//玩法ID 1
            costway,//支付方式 2
            hdl2f,//  海底捞2分  3
            gsh2f,//杠上花2分 4
            kqgh,//小胡可抢杠胡 5
            zhongniao,//中鸟 1飞鸟 2平鸟 6
            renshu,//人数 7
            zhuaniao,// 抓鸟 1抓1鸟 2抓2鸟  8
            choupai,// 抽牌 0不抽 1抽1门 9
            csTuoguan,//托管时间  10
            Djtg,//单局托管 11
            IsDouble,// 是否加倍 12
            DScore,// 加倍分 13
            DoubleNum,// 加倍数 14
            morefen,//15 "加xx分"
            allowScore//16 "低于xx分"
        ];

        // cc.log("data.params =",JSON.stringify(data));
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
        return [GameTypeEunmMJ.YYNXMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in YYNXMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[],[0],[1],[0],[0],[1],[0],[0],[]];
        defaultConfig[0][0] = params[0] == 8 ? 0 : 1;
        defaultConfig[1][0] = params[2] == 3|| params[2] == 4?0:parseInt(params[2]) - 1;
        defaultConfig[2][0] = params[7] == 4 ? 0 : params[7] == 3 ? 1 : 2;

        if(params[3] == 1)defaultConfig[3].push[0];
        if(params[4] == 1)defaultConfig[3].push[1];
        if(params[5] == 1)defaultConfig[3].push[2];

        defaultConfig[4][0] = parseInt(params[6]) - 1;
        defaultConfig[5][0] = parseInt(params[8]) - 1;
        defaultConfig[66][0] = parseInt(params[8]);
        defaultConfig[7][0] = params[10] == 1?1:params[10] == 300?4:params[10]/60;
        defaultConfig[8][0] = params[11]== 1 ? 0:params[11]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[9][0] = params[12];
        defaultConfig[10][0] = params[14] - 2;
        if(params[15] && parseInt(params[15]) > 0 && params[16] && parseInt(params[16]) > 0)defaultConfig[11].push(0);
        this.zzDScore = parseInt(params[13]);
        this.allowScore = parseInt(params[16])||10;
        this.addScore = parseInt(params[15])||10;
        this.defaultConfig = defaultConfig;
    },
});