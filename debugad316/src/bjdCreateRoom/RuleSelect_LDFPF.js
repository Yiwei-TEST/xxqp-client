/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_LDFPF = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3}, //0
            // {title:"人数选择",type:1,content:["3人","2人"],col:3},//1
            {title:"人数选择",type:1,content:["2人"],col:3},//1
            {title:"单局封顶",type:1,content:["200息","400息","一局"],col:3},//2
            {title:"起胡胡息",type:1,content:["六胡起胡","十胡起胡","十五胡起胡"],col:3},//3
            {title:"可选玩法",type:2,content:["首局随机庄家","飘胡","放炮必胡","开局洗牌"],col:3},//4
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//5
            {title:"选择打鸟",type:1,content:["不打鸟","胡息打鸟","分数打鸟","局内打鸟"],col:3},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//8
            {title:"加倍",type:1,content:["不加倍","加倍"]},//9
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//10
            {title:"加分",type:2,content:["低于"]},//11
            // {title:"翻倍上限",type:1,content:["小于20分","小于30分","小于40分","小于50分"]}//11
        ];

        this.defaultConfig = [[1],[1],[1],[2],[2],[0],[0],[0],[1],[0],[0],[]];
        this.ldfpfDifen = parseInt(cc.sys.localStorage.getItem("LDFPF_difen")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("LDFPF_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("LDFPF_allowBoxScore")) || 10;/** 低于xx分 **/
        this.dnScore = parseInt(cc.sys.localStorage.getItem("LDFPF_dnscore")) || 10;

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
            if(params[1] == GameTypeEunmZP.LDFPF){
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

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        if (this.numBox){
            return
        }
        var lineNum = Math.ceil(this.layoutArr[row].itemArr.length/3);
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 350 + (730/(this.layoutArr[row].itemArr.length));
        BoxBg.y = 70*(lineNum-1)/2 - 70*parseInt(this.layoutArr[row].itemArr.length/3);

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel(this.dnScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.dnScore;
        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }
        // cc.log("num =",num);

        if (num && num >= 5 && num <= 100){
            this.dnScore = num;
        }
        // cc.log("this.dnScore =",this.dnScore);
        this.scoreLabel.setString( this.dnScore + "分");
    },

    //row 第几列
    createDifenBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        if (this.difenBox){
            return
        }
        var lineNum = Math.ceil(this.layoutArr[row].itemArr.length/3);
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 350 + (730/(this.layoutArr[row].itemArr.length));
        BoxBg.y = 70*(lineNum-1)/2 - 70*parseInt(this.layoutArr[row].itemArr.length/3);

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,-4);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);

        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(BoxBg.width-addBtn.width+5,-4);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);


        //cc.log("this.ldfpfDifen =",this.ldfpfDifen);
        var scoreLabel = this.difenLabel = UICtor.cLabel("小于" + this.ldfpfDifen+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeDifenClick);
        UITools.addClickEvent(addBtn,this,this.onChangeDifenClick);

        this.difenBox = BoxBg;
        this.difenBox.visible = false;
    },

    onChangeDifenClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = parseInt(this.ldfpfDifen);
        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 105){
            this.ldfpfDifen = num;
        }
        this.difenLabel.setString("小于" + this.ldfpfDifen + "分");
    },

    onShow:function(){
        this.createNumBox(6);
        this.createDifenBox(9);
        this.updateZsNum();
        this.updateItemShow();
    },

    changeHandle:function(item){
        var tag = item.getTag();
        // cc.log("tag =", tag);
        if(tag < 400){
            this.updateZsNum();
        }
        
        //var tagArr = [100,101,600,601];
        //if(ArrayUtil.indexOf(tagArr,tag) != -1){
            this.updateItemShow();
        //}

        ////加倍分数框
        //if(item == this.getItemByIdx(6,2)){
        //    this.numBox.visible = true;
        //} else if(item == this.getItemByIdx(6,0) || item == this.getItemByIdx(6,1)
        //    || item == this.getItemByIdx(6,3)) {
        //    this.numBox.visible = false;
        //}
    },
    updateItemShow: function () {
        this.getItemByIdx(1, 0).setSelected(true);
        // if(this.getItemByIdx(1,1).isSelected()){
            // this.updateLayout();
            this.layoutArr[5].setVisible(true);
            this.layoutArr[9].setVisible(true);
            if(this.getItemByIdx(9,0).isSelected()){
                this.layoutArr[10].setVisible(false);
                this.difenBox.setVisible(false);
            }else{
                this.layoutArr[10].setVisible(true);
                this.difenBox.setVisible(true);
            }
            this.layoutArr[11].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(11,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        // }else{
            // this.layoutArr[5].setVisible(false);
            // this.layoutArr[9].setVisible(false);
            // this.layoutArr[10].setVisible(false);
            // this.difenBox.setVisible(false);
            // this.layoutArr[11].setVisible(false);
            // this.addNumBox.itemBox.visible = false;
            // this.allowNumBox.itemBox.visible = false;
        // }
        if(this.getItemByIdx(6,2).isSelected()){
            this.numBox.visible = true;
        }else if(this.getItemByIdx(6,0).isSelected() ||this.getItemByIdx(6,1).isSelected()
            ||this.getItemByIdx(6,3).isSelected()) {
            this.numBox.visible = false;
        }

        if(this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].visible = false;
        }else{
            this.layoutArr[8].visible = true;
        }
        // this.updateLayout();
    },
    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 2;
        var renshu = 2;
        // for(var i = 0;i<2;++i){
        //     if(this.getItemByIdx(1,i).isSelected()){
        //         renshu = 3-i;
        //         break;
        //     }
        // }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = 2;
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                // zsNum = Math.ceil(4/renshu);
                zsNum = 1;
            }else{
                zsNum = 2;
            }
        }

        if(this.getItemByIdx(2,2).isSelected()){
            zsNum = 1;
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 2;
        // for(var i = 0;i<2;++i){
        //     if(this.getItemByIdx(1,i).isSelected()){
        //         renshu = 3-i;
        //         break;
        //     }
        // }

        var configArr = {2:2500,3:1700}

        var num = configArr[renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var renshu = 2;
        // for(var i = 0;i<2;++i){
        //     if(this.getItemByIdx(1,i).isSelected()){
        //         renshu = 3-i;
        //         break;
        //     }
        // }
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }


        var limitScore = 200;
        var jushu = 1000;
        if(this.getItemByIdx(2,1).isSelected()){
            limitScore = 400;
            jushu = 1000;
        } else if(this.getItemByIdx(2, 2).isSelected()){
            limitScore = 200;
            jushu = 1;
        }



        var huxi = 15;
        if(this.getItemByIdx(3,0).isSelected())huxi = 6;
        if(this.getItemByIdx(3,1).isSelected())huxi = 10;

        var sjzj = 0;
        if(this.getItemByIdx(4,0).isSelected())sjzj = 1;

        var piaohu = 0;
        if(this.getItemByIdx(4,1).isSelected())piaohu = 1;


        var fangpaobihu = 1;
        if(this.getItemByIdx(4,2).isSelected()){
            fangpaobihu = 1;
        }else{
            fangpaobihu = 0;
        }

        var xipai = 0;
        if(this.getItemByIdx(4,3).isSelected()){
            xipai =1;
        }
        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(7,4).isSelected()){
            autoPlay = 300;
        }

        var choupai = 0;
        var choupaiArr = [0,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                choupai = choupaiArr[i];
                break;
            }
        }

        var isDouble = 0;
        if(this.getItemByIdx(9,1).isSelected())isDouble = 1;

        var dScore = this.ldfpfDifen;
        cc.sys.localStorage.setItem("LDFPF_difen",dScore);

        // for(var i = 0;i<4;++i){
        //     if(this.getItemByIdx(11,i).isSelected()){
        //         dScore = 20 + i*10;
        //         break;
        //     }
        // }

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var daniao = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                daniao = 0 + i;
            }
        }
        var djtg = 2;
        if(this.getItemByIdx(8,0).isSelected()){
            djtg = 1;
        }else if(this.getItemByIdx(8,2).isSelected()){
            djtg = 3;
        }
        var daniaoScore = 0;
        daniaoScore = this.dnScore;
        cc.sys.localStorage.setItem("LDFPF_dnscore",daniaoScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("LDFPF_addBoxScore",morefen);
        cc.sys.localStorage.setItem("LDFPF_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数
            GameTypeEunmZP.LDFPF,//玩法ID
            0,0,0,0,0,
            renshu,//人数
            200,
            costWay,//支付方式
            limitScore,//单局封顶
            0,//红黑胡选项
            0,//可连庄
            huxi,//胡息 13
            0,0,0,0,0,0,0,0,0,
            autoPlay,//可托管 23
            0,0,0,
            sjzj,//首局随机庄家 27
            piaohu,//飘胡 28
            choupai,//抽牌 29
            isDouble,//是否翻倍 30
            dScore,//翻倍上限 31
            doubleNum,//翻倍倍数 32
            fangpaobihu,//放炮必胡 33
            daniao,// 打鸟 34 
            daniaoScore,//打鸟分 35
            djtg,//单局托管 36
            morefen,//37 "加xx分"
            allowScore,//38 "低于xx分"
            xipai,//39 第一局洗牌
        ];
        cc.log("data =", JSON.stringify(data.params));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var renshu = 2;
        // for(var i = 0;i<2;++i){
        //     if(this.getItemByIdx(1,i).isSelected()){
        //         renshu = 3-i;
        //         break;
        //     }
        // }
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var jushu = 1000;
        if(this.getItemByIdx(2,1).isSelected()){
            jushu = 1000;
        } else if(this.getItemByIdx(2, 2).isSelected()){
            jushu = 1;
        }
        return [GameTypeEunmZP.LDFPF,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[1],[1],[2],[2],[0],[0],[0],[0],[0],[0],[]];

        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
        // defaultConfig[1][0] = params[7] == 2 ? 1: 0;
        defaultConfig[1][0] = 1;
        defaultConfig[2][0] = params[10] == 400 ? 1: 0;
        if (params[0] == 1){
            defaultConfig[2][0] = 2;
        }
        defaultConfig[3][0] = params[13] == 10?1:params[13] == 15?2:0;
        defaultConfig[5][0] = params[29] == 10 ? 1 :params[29]==20?2: 0;
        defaultConfig[6][0] = params[34] == 1 ? 1 :params[34] == 2 ? 2 : params[34] == 3 ? 3:0;
        defaultConfig[7][0] = params[23]==1?1:params[23] == 300?4:params[23]/60;
        defaultConfig[8][0] = params[36]== 1 ? 0:params[36]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[9][0] = params[30] == 1 ? 1 :0;
        defaultConfig[10][0] = params[32] == 3 ? 1 :params[32]==4?2:0;
        // defaultConfig[11][0] = ((params[31] -20)/10) || 0;
        if(params[37] && parseInt(params[37]) > 0)defaultConfig[11].push(0);
        this.ldfpfDifen = params[31];

        if(params[27] == "1")defaultConfig[4].push(0);
        if(params[28] == "1")defaultConfig[4].push(1);
        if(params[33] == "1")defaultConfig[4].push(2);
        if(params[39] == "1")defaultConfig[4].push(3);

        this.dnScore = params[35];
        // cc.log("this.dnScore", this.dnScore);
        this.addScore = parseInt(params[37])||10;
        this.allowScore = parseInt(params[38])||10;
        this.defaultConfig = defaultConfig;

        // this.scoreLabel.setString(this.dnScore + "分");
    },
});