/**
 * Created by cyp on 2019/3/20.
 */
var RuleSelect_CZZP = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.getItemByIdx(2,0).visible = false;
        this.getItemByIdx(2,2).x = this.getItemByIdx(2,1).x;
        this.getItemByIdx(2,1).x = this.getItemByIdx(2,0).x;
        this.getItemByIdx(8,0).visible = false;
        this.getItemByIdx(8,2).x = this.getItemByIdx(8,1).x;
        this.getItemByIdx(8,1).x = this.getItemByIdx(8,0).x;
        // cc.log("this.czzpDScore =",this.czzpDScore);
        this.createNumBox(14);
        this.createChangeScoreBox(17);//创建低于xx分加xx分
        this.getItemByIdx(17,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数",type:1,content:["8局","12局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数",type:1,content:["4人","3人","2人"]},//2
            {title:"囤息转换",type:1,content:["3息一囤","1息一囤"]},//3
            {title:"起胡",type:1,content:["9息","6息","3息"]},//4
            {title:"计分选择",type:1,content:["9息1囤","9息3囤"]},//5
            {title:"必胡",type:1,content:["无","点炮必胡","有胡必胡"]},//6
            {title:"玩法",type:1,content:["无","红黑点","红黑点2倍"]},//7
            {title:"",type:2,content:["自摸翻倍","毛胡","15张玩法"]},//8
            {title:"飘分",type:1,content:["不飘","飘1/2/3","飘2/3/5"]},//9
            {title:"首局坐庄",type:1,content:["随机","房主"]},//10
            {title:"明龙规则",type:1,content:["出牌后明龙","发牌后明龙"]},//11
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//12 
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//13
            {title:"加倍",type:1,content:["不加倍","加倍"]},//14
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//15
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//16
            {title:"加分",type:2,content:["低于"]},//17
            // {title:"翻倍上限",type:1,content:["小于20分","小于30分","小于40分","小于50分"]}//16
        ];

        this.defaultConfig = [[1],[1],[1],[0],[0],[0],[0],[0],[],[0],[0],[0],[0],[1],[0],[0],[0],[]];
        this.czzpDScore = parseInt(cc.sys.localStorage.getItem("CZZP_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("CZZP_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("CZZP_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.CZZP){
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
        // if(tag < 200){
            this.updateZsNum();
        // }


        this.updateItemShow();
            
        // var tagArr = [202,1400,1401];
        // if(ArrayUtil.indexOf(tagArr,tag) >= 0){
        //     this.updateLayout();
        // }
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
        cc.log("this.czzpDScore =",this.czzpDScore);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.czzpDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

     onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.czzpDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            // if (num%10 == 5){
            //     this.czzpDScore = num - 5;
            // }else{
                this.czzpDScore = num;
            // }
        }
        cc.log("this.czzpDScore =",this.czzpDScore);
        this.scoreLabel.setString("小于"+ this.czzpDScore + "分");
    },

    updateItemShow:function(){
        // 翻倍
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[14].setVisible(true);
            this.layoutArr[16].setVisible(true);
            if(this.getItemByIdx(14,0).isSelected()){
                this.layoutArr[15].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[15].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[17].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(17,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[14].setVisible(false);
            this.layoutArr[15].setVisible(false);
            this.layoutArr[16].setVisible(false);
            this.numBox.setVisible(false);
            this.layoutArr[17].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        //托管
        if(this.getItemByIdx(12,0).isSelected()){
            this.layoutArr[13].setVisible(false);
        }else{
            this.layoutArr[13].setVisible(true);
        }

        //胡息
        if (this.getItemByIdx(2,0).isSelected()&&(!this.getItemByIdx(2,1).isSelected() && !this.getItemByIdx(2,2).isSelected())){
            if (this.getItemByIdx(4,0).isSelected()){
                this.getItemByIdx(4,2).setSelected(true);
            }
            this.getItemByIdx(4,0).setTouchEnabled(false);
            this.getItemByIdx(4,0).itemBtn.setTouchEnabled(false);
            this.getItemByIdx(4,0).itemLabel.setOpacity(50);
            this.getItemByIdx(4,0).setOpacity(50);
            this.getItemByIdx(4,0).setSelected(false);

        }else{
            this.getItemByIdx(4,0).setTouchEnabled(true);
            this.getItemByIdx(4,0).itemBtn.setTouchEnabled(true);
            this.getItemByIdx(4,0).itemLabel.setOpacity(255);
            this.getItemByIdx(4,0).setOpacity(255);
            // this.getItemByIdx(4,0).setSelected(true);
            // this.getItemByIdx(4,0).setItemState(true);
            // this.getItemByIdx(4,2).setSelected(false);
        }

        //3息1囤
        if (this.getItemByIdx(3,0).isSelected()){
            //起胡9息
            if (this.getItemByIdx(4,0).isSelected()){
                this.getItemByIdx(5,1).setVisible(true);
                this.getItemByIdx(5,0).itemLabel.setString("9息1囤");
                this.getItemByIdx(5,1).itemLabel.setString("9息3囤");
            }else if (this.getItemByIdx(4,1).isSelected()){//起胡6息
                this.getItemByIdx(5,1).setVisible(true);
                this.getItemByIdx(5,0).itemLabel.setString("6息1囤");
                this.getItemByIdx(5,1).itemLabel.setString("6息2囤");
            }else if (this.getItemByIdx(4,2).isSelected()){//起胡3息
                this.getItemByIdx(5,0).itemLabel.setString("3息1囤");
                this.getItemByIdx(5,1).setVisible(false);
            }
        }else if(this.getItemByIdx(3,1).isSelected()){//1息1囤
            this.getItemByIdx(5,1).setVisible(true);
            //起胡9息
            if (this.getItemByIdx(4,0).isSelected()){
                this.getItemByIdx(5,0).itemLabel.setString("9息1囤");
                this.getItemByIdx(5,1).itemLabel.setString("9息9囤");
            }else if (this.getItemByIdx(4,1).isSelected()){//起胡6息
                this.getItemByIdx(5,0).itemLabel.setString("6息1囤");
                this.getItemByIdx(5,1).itemLabel.setString("6息6囤");
            }else if (this.getItemByIdx(4,2).isSelected()){//起胡3息
                this.getItemByIdx(5,0).itemLabel.setString("3息1囤");
                this.getItemByIdx(5,1).itemLabel.setString("3息3囤");
            }
        }
        

    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        var zsNumArr = [4,6,8]
        var renshu = 4;
        var temp = 0;
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
                zsNum = zsNumArr[temp];
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
            {2:2500,3:1700,4:1300},{2:3000,3:2000,4:1500},{2:4500,3:3000,4:2300},{2:4500,3:3000,4:2300}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        if (this.getItemByIdx(0,1).isSelected()) jushu = 12;
        if (this.getItemByIdx(0,2).isSelected()) jushu = 16;

        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }
        
        //囤息转换 1 3息一囤 2 1息一囤
        var txzh = 1;
        if (this.getItemByIdx(3,1).isSelected()) txzh=2;
        //起胡胡息 1 9胡 2 6胡 3 3胡
        var qhhx = 1;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                qhhx = i+1;
                break;
            }
        }
        //计分选择
        var jfxz = 1;
        if (this.getItemByIdx(5,1).isSelected()) jfxz=2;
        //必胡 1 无 2点炮必胡 3 有胡必胡
        var bihu = 1;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                bihu = i+1;
                break;
            }
        }
        //红黑点 1 无 2 红黑点 3 红黑点2倍
        var hhd = 1;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                hhd = i+1;
                break;
            }
        }
        //自摸翻倍
        var zmfb = 0;
        if (this.getItemByIdx(8,0).isSelected()) zmfb=1;
        //毛胡
        var mh = 0;
        if (this.getItemByIdx(8,1).isSelected()) mh=1;
        //15张玩法
        var swzwf = 0;
        if (this.getItemByIdx(8,2).isSelected()) swzwf=1;
        //飘分 1 无 2 飘1/2/3 3 飘2/3/5
        var pf = 1;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                pf = i+1;
                break;
            }
        }
        //首局坐庄 1 随机 2 房主
        var sjzz = 1;
        if (this.getItemByIdx(10,1).isSelected()) sjzz=2;
        //明龙 1 出牌后明龙 2 发牌后明龙
        var mlgz = 1;
        if (this.getItemByIdx(11,1).isSelected()) mlgz=2;

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(12,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(12,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(13,0).isSelected()){
            djtg = 1;
        }else  if (this.getItemByIdx(13,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(14,1).isSelected())isDouble = 1;

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(15,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var dScore = 0;
        dScore = this.czzpDScore;
        cc.sys.localStorage.setItem("CZZP_diScore",dScore);

        // var dScore = 20;
        // for(var i = 0;i<4;++i){
        //     if(this.getItemByIdx(16,i).isSelected()){
        //         dScore = 20 + i*10;
        //         break;
        //     }
        // }
        var choupai = 0;
        var choupaiArr = [0,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(16,i).isSelected()){
                choupai = choupaiArr[i];
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(17,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("CZZP_addBoxScore",morefen);
        cc.sys.localStorage.setItem("CZZP_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0 
            GameTypeEunmZP.CZZP,//玩法ID 1
            0,0,0,0,0,
            renshu,//人数 7
            200,
            costWay,//支付方式 9
            txzh,//囤息转换 1 3息一囤 2 1息一囤 10
            qhhx,//起胡胡息 1 9胡 2 6胡 3 3胡 11
            jfxz,//计分选择 12
            bihu,//必胡 1 无 2点炮必胡 3 有胡必胡 13
            hhd,//红黑点 1 无 2 红黑点 3 红黑点2倍 14
            zmfb,//自摸翻倍 15
            mh,//毛胡 16
            swzwf,//15张玩法 17
            pf,//飘分 1 无 2 飘1/2/3 3 飘2/3/5 18
            sjzz,//首局坐庄 1 随机 2 房主 19
            mlgz,//明龙 1 出牌后明龙 2 发牌后明龙 20
            autoPlay,//可托管 21
            isDouble,//是否翻倍 22
            dScore,//翻倍上限 23
            doubleNum,//翻倍倍数 24
            djtg,//单局托管 25
            choupai,//抽牌 26
            morefen,//27 "加xx分"
            allowScore,//28 "低于xx分"
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        if (this.getItemByIdx(0,1).isSelected()) jushu = 12;
        if (this.getItemByIdx(0,2).isSelected()) jushu = 16;

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        return [GameTypeEunmZP.CZZP,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[1],[1],[0],[0],[0],[0],[0],[],[0],[0],[0],[0],[1],[0],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 8?0:params[0]==12?1:2;
        defaultConfig[1][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
        defaultConfig[2][0] = params[7] == 3?1:params[7] == 2?2:0;
        defaultConfig[3][0] = params[10]-1;
        defaultConfig[4][0] = params[11]-1;
        defaultConfig[5][0] = params[12]-1;
        defaultConfig[6][0] = params[13]-1;
        defaultConfig[7][0] = params[14]-1;
        defaultConfig[9][0] = params[18]-1;
        defaultConfig[10][0] = params[19]-1;
        defaultConfig[11][0] = params[20]-1;
        defaultConfig[12][0] = params[21]==1?1:params[21] == 300?4:params[21]/60;
        defaultConfig[13][0] = params[25]== 1 ? 0:params[25]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[14][0] = params[22] == 1 ? 1 :0;
        defaultConfig[15][0] = params[24] == 3 ? 1 :params[24]==4?2:0;
        defaultConfig[16][0] = params[26] == 10 ? 1 :params[26]==20?2: 0;
        // defaultConfig[16][0] = ((params[23] -20)/10) || 0;
        this.czzpDScore = params[23]?parseInt(params[23]):10;
        if(params[15] == "1")defaultConfig[8].push(0);
        if(params[16] == "1")defaultConfig[8].push(1);
        if(params[17] == "1")defaultConfig[8].push(2);

        if(params[27] && parseInt(params[27]) > 0){
            defaultConfig[17].push(0);
        }
        this.addScore = parseInt(params[27])||10;
        this.allowScore = parseInt(params[28])||10;
        this.defaultConfig = defaultConfig;
    },
});