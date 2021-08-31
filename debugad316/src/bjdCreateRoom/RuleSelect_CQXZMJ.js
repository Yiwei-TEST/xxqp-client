/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_CQXZMJ = RuleSelectBase.extend({
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
            {title:"局数选择",type:1,content:["4局","8局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"自摸",type:1,content:["自摸加底","自摸加番"],col:3},//3
            {title:"点杠花",type:1,content:["点杠花(点炮)","点杠花(自摸)"],col:3},//4
            {title:"换张",type:1,content:["换三张","换四张"],col:3},//5
            {title:"玩法",type:2,content:["幺九将对","门清中张","天地胡","放牛必须过庄"],col:3},//6
            {title:"封顶",type:1,content:["2番","3番","4番","5番"],col:4},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//9
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//10
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//11
            {title:"加分",type:2,content:["低于"]},//12
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[0],[],[0],[0],[1],[0],[0],[]];
        this.xzDScore = parseInt(cc.sys.localStorage.getItem("CQXZMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("CQXZMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("CQXZMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.CQXZMJ){
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

        if (this.getItemByIdx(8,0).isSelected()){
            this.layoutArr[9].visible = false;
        }else{
            this.layoutArr[9].visible = true;
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [5,8,10];
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.xzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.xzDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.xzDScore = num - 5;
            }else{
                this.xzDScore = num;
            }
        }else if ( num < 10){
            this.xzDScore = 5;
        }
        cc.log("this.xzDScore =",this.xzDScore);
        this.scoreLabel.setString("小于"+ this.xzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 4;
        for(var i = 0;i<2;++i){
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

        var zimo = 0;
        if(this.getItemByIdx(3,1).isSelected()){
            zimo = 1;
        }

        var diangang = 0;
        if(this.getItemByIdx(4,1).isSelected()){
            diangang = 1;
        }

        var huanzhang = 0;
        if(this.getItemByIdx(5,1).isSelected()){
            huanzhang = 1;
        }

        var yjjd = 0;
        if(this.getItemByIdx(6,0).isSelected()){
            yjjd = 1;
        }
        var mqzz = 0;
        if(this.getItemByIdx(6,1).isSelected()){
            mqzz = 1;
        }
        var tdh = 0;
        if(this.getItemByIdx(6,2).isSelected()){
            tdh = 1;
        }
        var fngz = 0;
        if(this.getItemByIdx(6,3).isSelected()){
            fngz = 1;
        }
        var fengding = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                fengding = i+2;
                break;
            }
        }

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

        var djtg = 1;
        if(this.getItemByIdx(9,1).isSelected())
            djtg = 2;
        else if(this.getItemByIdx(9,2).isSelected())
            djtg = 3;
        var zzIsDouble = 0;
        if(this.getItemByIdx(10,1).isSelected()){
            zzIsDouble = 1;
        }
        var xzDScore = 0;
        xzDScore = this.xzDScore;
        cc.sys.localStorage.setItem("CQXZMJ_diScore",xzDScore);
        var DoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                DoubleNum = 2 + i;
                break;
            }
        }
        

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("CQXZMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("CQXZMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.CQXZMJ,//玩法ID 1
            costway,//支付方式 2
            zimo,//自摸 3
            diangang,//点杠花 4
            huanzhang,//换张 5
            yjjd,//幺九做对 6
            renshu,//人数 7
            tuoguan,//托管 8
            zzIsDouble,// 是否加倍 9
            xzDScore,// 加倍分 10
            DoubleNum,// 加倍数 11
            djtg,//单局托管 12
            morefen,//13 "加xx分"
            allowScore,//14 "低于xx分"
            mqzz,//门清中张 15
            tdh,//天地胡 16
            fngz,//放牛过庄 17
            fengding,//封顶 18
        ];

        // cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 4;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = Math.pow(2,i)*4;
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
        return [GameTypeEunmMJ.CQXZMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in CQXZMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[0],[0],[0],[],[0],[0],[1],[0],[0],[]];
        defaultConfig[0][0] = params[0] == 16?2:params[0] == 12?1:0;
        defaultConfig[1][0] = params[2] == 3|| params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 3?1:params[7]==2?2:0;
        defaultConfig[3][0] = params[3] || 0;
        defaultConfig[4][0] = params[4] || 0;
        defaultConfig[5][0] = params[5] || 0;
        defaultConfig[7][0] = parseInt(params[18]) - 2;
        defaultConfig[8][0] = params[8] == 300?4:params[8]/60;//托管时间;
        defaultConfig[9][0] = params[12]== 1 ? 0:params[12]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[10][0] = params[9]== 1 ? 1:0;//是否翻倍
        defaultConfig[11][0] = parseInt(params[11]) - 2 >= 0 ? parseInt(params[11]) - 2 : 0;//翻倍数

        if(params[6] == 1)defaultConfig[6].push(0);
        if(params[15] == 1)defaultConfig[6].push(1);
        if(params[16] == 1)defaultConfig[6].push(2);
        if(params[17] == 1)defaultConfig[6].push(3);

        if(params[13] && parseInt(params[13]) > 0)defaultConfig[12].push(0);
        this.xzDScore = parseInt(params[10]);
        this.addScore = parseInt(params[13])||10;
        this.allowScore = parseInt(params[14])||10;
        this.defaultConfig = defaultConfig;
    },
});