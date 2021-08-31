/**
 * Created by Administrator on 2020/1/19.
 */

var RuleSelect_AXWMQ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox(12);//创建低于xx分加xx分
        this.getItemByIdx(12,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","16局"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"名堂",type:1,content:["老名堂版","小卓版","大卓版","全名堂版","钻石版"],col:3},//3
            {title:"特殊",type:2,content:["项对","飘对","龙摆尾","全求人","活捉小三","上下五千年"],col:3},//4
            {title:"逗溜子",type:1,content:["不逗溜子","逗20","逗30","逗50"],col:4},//5
            {title:"起胡胡息",type:1,content:["10息","15息"],col:3},//6
            {title:"底牌数量",type:1,content:["22张","41张"],col:3},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//9
            {title:"加倍",type:1,content:["不加倍","加倍"]},//10
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//11
            {title:"加分",type:2,content:["低于"]}//12
        ];

        this.defaultConfig = [[1],[0],[0],[0],[],[0],[0],[0],[0],[1],[0],[0],[]];
        this.glzpDScore = parseInt(cc.sys.localStorage.getItem("AXWMQ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("AXWMQ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("AXWMQ_allowBoxScore")) || 10;/** 低于xx分 **/

        if(this.createRoomLayer.clubData){

            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[0].content = ["群主支付"];
                this.defaultConfig[0][0] = 0;
            }

            if(ClickClubModel.getClubIsGold()){
                this.ruleConfig[0].content = ["白金豆AA支付"];
                this.defaultConfig[0][0] = 0;
            }

            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == GameTypeEunmZP.AXWMQ){
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

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 350 + (788/(this.layoutArr[row].itemArr.length));

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.glzpDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.glzpDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.glzpDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.glzpDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){

        var is2ren = this.getItemByIdx(2,1).isSelected();
        var istg = !this.getItemByIdx(8,0).isSelected();
        var isjb = this.getItemByIdx(10,1).isSelected();

        this.layoutArr[6].setVisible(is2ren);
        this.layoutArr[7].setVisible(is2ren);
        this.layoutArr[9].setVisible(istg);
        this.layoutArr[10].setVisible(is2ren);
        this.layoutArr[11].setVisible(is2ren && isjb);
        this.layoutArr[12].setVisible(is2ren);

        this.numBox.setVisible(is2ren && isjb);
        this.addNumBox.setVisible(is2ren);
        this.allowNumBox.setVisible(is2ren);

        var ists = this.getItemByIdx(3,1).isSelected() || this.getItemByIdx(3,2).isSelected();
        this.layoutArr[4].setVisible(ists);

    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [5,10];
        var temp = 0;
        var renshu = 3;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(1,i);
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
                zsNum = zsNumArr[temp];
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(0);
    },

    updateDouziNum:function(){
        var num = 0;

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var jushu = 8;
        var jushuArr = [8,16];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }

        var mingtang = 1;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                mingtang = i + 1;
                break;
            }
        }

        var qihuhuxi = 0;
        var dipaiNum = 0;
        if(renshu == 2){
            qihuhuxi = 10;
            dipaiNum = 22;
            if(this.getItemByIdx(6,1).isSelected())qihuhuxi = 15;
            if(this.getItemByIdx(7,1).isSelected())dipaiNum = 41;
        }

        var douliuzi = 0;
        if(this.getItemByIdx(5,1).isSelected())douliuzi = 20;
        if(this.getItemByIdx(5,2).isSelected())douliuzi = 30;
        if(this.getItemByIdx(5,3).isSelected())douliuzi = 50;

        var tianhu = 0;
        var dingdui = 0;
        var piaodui = 0;
        var longbaiwei = 0;
        var quanqiuren = 0;
        var hzxs = 0;
        var sxwqn = 0;

        if(mingtang == 2 || mingtang == 3){

            if(this.getItemByIdx(4,0).isSelected())dingdui = 1;//项对
            if(this.getItemByIdx(4,1).isSelected())piaodui = 1;//飘对
            if(this.getItemByIdx(4,2).isSelected())longbaiwei = 1;//龙摆尾
            if(this.getItemByIdx(4,3).isSelected())quanqiuren = 1;//全求人
            if(this.getItemByIdx(4,4).isSelected())hzxs = 1;//活捉小三
            if(this.getItemByIdx(4,5).isSelected())sxwqn = 1;//上下五千年


        }


        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(8,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(9,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(9,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(10,1).isSelected())isDouble = 1;

        cc.sys.localStorage.setItem("AXWMQ_diScore",this.glzpDScore);

        var doubleNum = 0;
        if(renshu == 2){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(11,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("AXWMQ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("AXWMQ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.AXWMQ,//玩法ID 1
            costWay, // 支付方式 2
            mingtang, // 名堂 3
            qihuhuxi, // 起胡胡息 4
            dipaiNum, // 底牌数 5
            douliuzi, // 逗溜子 6
            renshu, //人数 7
            0, // 8
            0, // 9
            tianhu, // 天胡 10
            dingdui, // 项对 11
            piaodui, // 飘对 12
            longbaiwei, // 龙摆尾 13
            quanqiuren,// 全求人 14
            hzxs,// 活捉小三 15
            sxwqn, // 上下五千年 16
            0,// 17
            autoPlay,//托管时间 18
            djtg,// 托管类型 19
            isDouble,//是否翻倍 20
            this.glzpDScore,//翻倍上限 21
            doubleNum,//翻倍倍数 22

            allowScore, //23 低于xx分
            morefen,//24 加xx分
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        var jushuArr = [8,16];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        return [GameTypeEunmZP.AXWMQ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[0],[],[0],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = (params[2] == 3 || params[2]==4)?0:parseInt(params[2]) - 1;//房费
        defaultConfig[1][0] = params[0] == 8 ? 0 : 1 ;//局数
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = (params[3] - 1) || 0;//名堂

        defaultConfig[6][0] = params[4] == 15?1:0;//起胡胡息
        defaultConfig[7][0] = params[5] == 41?1:0;//底牌数

        defaultConfig[5][0] = params[6]==50?3:params[6]==30?2:params[6]==20?1:0;

        defaultConfig[8][0] = params[18] == 300?4:params[18]/60;//托管时间
        defaultConfig[9][0] = params[19]== 1 ? 0:params[19]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[10][0] = params[20]== 1 ? 1:0;//是否翻倍
        defaultConfig[11][0] = params[22]-2;//翻倍数


        if(params[11] == 1)defaultConfig[4].push(0);
        if(params[12] == 1)defaultConfig[4].push(1);
        if(params[13] == 1)defaultConfig[4].push(2);
        if(params[14] == 1)defaultConfig[4].push(3);
        if(params[15] == 1)defaultConfig[4].push(4);
        if(params[16] == 1)defaultConfig[4].push(5);


        if(params[23] > 0 && params[24] > 0){
            defaultConfig[12].push(0);
        }

        this.glzpDScore = parseInt(params[21]) || 10;//多少分翻倍
        this.allowScore = parseInt(params[23]) || 10;
        this.addScore = parseInt(params[24]) || 10;

        this.defaultConfig = defaultConfig;
    },
});