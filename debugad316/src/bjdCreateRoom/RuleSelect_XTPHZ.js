
/**
 * Created by Administrator on 2019/9/6.
 */
var RuleSelect_XTPHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(13);
        this.createChangeScoreBox(15);//创建低于xx分加xx分
        this.getItemByIdx(15,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["5局","6局","8局","10局"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//3
            {title:"起胡",type:1,content:["15息起胡","10息起胡"]},//4
            {title:"选息",type:1,content:["1息1囤","3息1囤"]},//5
            {title:"封顶",type:1,content:["不封顶","100分封顶","200分封顶","2番封顶","4番封顶"],col:3},//5
            {title:"偎牌",type:1,content:["明偎","暗偎"]},//7
            {title:"玩法",type:2,content:["自摸加番","一五十","30胡翻倍","一点红"
                ,"天地胡","大小字","碰碰胡","黑红胡","株洲计分","自摸加3胡"]},//8
            {title:"红胡",type:1,content:["10红","13红"]},//9
            {title:"坐庄",type:1,content:["随机","先进房坐庄"]},//10
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//11
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//12
            {title:"加倍",type:1,content:["不加倍","加倍"]},//13
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//14
            {title:"加分",type:2,content:["低于"]},//15
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[1],[0],[0],[],[0],[1],[0],[0],[0],[0],[]];
        this.xtphzDScore = parseInt(cc.sys.localStorage.getItem("XTPHZ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("XTPHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("XTPHZ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.XTPHZ){
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

    //createHHBox:function(){
    //    this.getItemByIdx(7,8).itemBtn.setContentSize(120,40);
    //    this.honghuLayout = new SelectLayout();
    //    this.honghuLayout.showItemList(["10红","13红"]);
    //    this.getLayoutByIdx(7).addChild(this.honghuLayout);
    //    if(this.honghuLayout.itemArr[this.xtphzHHNum]){
    //        this.honghuLayout.itemArr[this.xtphzHHNum].setSelected(true);
    //    }else{
    //        this.honghuLayout.itemArr[0].setSelected(true);
    //    }
    //    this.honghuLayout.x = 200;
    //    this.honghuLayout.y = -70;
    //},

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.xtphzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.xtphzDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.xtphzDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.xtphzDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
         if(tag < 300){
            this.updateZsNum();
         }

        if(tag == 800){
            if(this.getItemByIdx(8,0).isSelected()){
                this.getItemByIdx(8,9).setSelected(false);
            }
        }else if(tag == 809){
            if(this.getItemByIdx(8,9).isSelected()){
                this.getItemByIdx(8,0).setSelected(false);
            }
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[3].setVisible(true);
            this.layoutArr[13].setVisible(true);
            if(this.getItemByIdx(13,0).isSelected()){
                this.layoutArr[14].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[14].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[15].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(15,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[3].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.layoutArr[14].setVisible(false);
            this.layoutArr[15].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(11,0).isSelected()){
            this.layoutArr[12].setVisible(false);
        }else{
            this.layoutArr[12].setVisible(true);
        }
        this.layoutArr[9].visible = this.getItemByIdx(8,7).isSelected();

        this.getItemByIdx(8,9).setItemState(this.getItemByIdx(8,8).isSelected());
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 3;
        var zsNumArr = [3,3,4,6];
        var renshu = 3;
        var temp = 0;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }
        for(var i = 0;i<4;++i){
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
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<4;++i){
            var item = this.getItemByIdx(1,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:2000,3:1300},{2:2000,3:1300},{2:2500,3:1700},{2:3500,3:2300}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        var jushuArr = [5,6,8,10];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
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

        var choupai = 0;//抽牌
        if(this.getItemByIdx(2,1).isSelected()){
            var choupaiArr = [0,10,20];
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(3,i).isSelected()){
                    choupai = choupaiArr[i];
                    break;

                }
            }
        }

        var qihu = 15;//起胡
        if(this.getItemByIdx(4,1).isSelected()){
            qihu = 10;
        }

        var xuanxi = 1;//选息
        if(this.getItemByIdx(5,1).isSelected()){
            xuanxi = 2;
        }

        var fenshuDing = 0;
        var fanshuDing = 0;
        if(this.getItemByIdx(6,1).isSelected()){
            fanshuDing = 0;
            fenshuDing = 100;
        }else if(this.getItemByIdx(6,2).isSelected()){
            fanshuDing = 0;
            fenshuDing = 200;
        }else if(this.getItemByIdx(6,3).isSelected()){
            fenshuDing = 0;
            fanshuDing = 1;
        }else if(this.getItemByIdx(6,4).isSelected()){
            fenshuDing = 0;
            fanshuDing = 2;
        }

        var weipai = 1;//偎牌 1明偎,0暗偎
        if(this.getItemByIdx(7,1).isSelected()){
            weipai = 0;
        }

        var zmjf = this.getItemByIdx(8,0).isSelected() ? 1 : 0;//自摸加番
        var yws = this.getItemByIdx(8,1).isSelected() ? 1 : 0;//一五十
        var sshfb = this.getItemByIdx(8,2).isSelected() ? 1 : 0;//30胡翻倍
        var ydh = this.getItemByIdx(8,3).isSelected() ? 1 : 0;//一点红
        var tdh = this.getItemByIdx(8,4).isSelected() ? 1 : 0;//天地胡
        var dxz = this.getItemByIdx(8,5).isSelected() ? 1 : 0;//大小字
        var pph = this.getItemByIdx(8,6).isSelected() ? 1 : 0;//碰碰胡
        var hhh = this.getItemByIdx(8,7).isSelected() ? 1 : 0;//黑红胡
        var zzjf = this.getItemByIdx(8,8).isSelected() ? 1 : 0;//株洲计分
        var zmj3 = this.getItemByIdx(8,9).isSelected() ? 1 : 0;//自摸加3胡

        if(zzjf == 0){
            zmj3 = 0;
        }

        var hh10 = 0;
        if(hhh){
            hh10 = this.getItemByIdx(9,0).isSelected() ? 10 : 13;
        }

        var zhuang = 0;//坐庄
        if(this.getItemByIdx(10,1).isSelected()){
            zhuang = 1;
        }

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(11,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(12,0).isSelected()){
            djtg = 1;
        }else  if (this.getItemByIdx(12,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(13,1).isSelected())isDouble = 1;

        var dScore = this.xtphzDScore;
        cc.sys.localStorage.setItem("XTPHZ_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,1).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(14,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(15,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("XTPHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("XTPHZ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.XTPHZ,//玩法ID 1
            0,// 2 *****无用占位
            0,// 3 *****无用占位
            0,// 4 *****无用占位
            0,// 5 *****无用占位
            0,// 6 *****无用占位
            renshu,//人数 7
            0,// 8 *****无用占位
            costWay,//支付方式 9
            0,// 10 *****无用占位
            hhh,//红黑胡 11
            fenshuDing, // 12 分数封顶
            xuanxi,//选息 13
            choupai,//抽牌 14
            zhuang,//坐庄 15
            weipai,//偎牌 16
            fanshuDing,// 17 番数封顶
            zzjf,// 18  株洲计分
            zmj3,// 19 自摸加3胡
            0,// 20 *****无用占位
            0,// 21 *****无用占位
            0,// 22 *****无用占位
            autoPlay,//托管时间 23
            isDouble,//是否翻倍 24
            dScore,//翻倍上限 25
            doubleNum,//翻倍倍数 26
            djtg,//单局托管 27
            0,// 28 无用占位
            0,// 29 无用占位
            qihu,// 30 单局最低胡息起胡 10/15
            zmjf,// 31 自摸加番
            yws,// 32 一五十
            sshfb,// 33 30胡翻倍
            0,// 34 *****无用占位
            ydh,// 35 一点红
            tdh,// 36 天地胡
            dxz,// 37 大小字
            pph,// 38 碰碰胡
            0,// 39 *****无用占位
            0,// 40 *****无用占位
            0,// 41 *****无用占位
            0,// 42 *****无用占位
            0,// 43 *****无用占位
            hh10,//44 10胡或者13
            0,// 45 *****无用占位
            allowScore,//46 低于 xx分
            morefen,//47 加xx分
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 5;
        var jushuArr = [5,6,8,10];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 2;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
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

        return [GameTypeEunmZP.XTPHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[0],[0],[0],[0],[1],[0],[0],[],[0],[1],[0],[1],[0],[0],[]];

        var jushuArr = [5,6,8,10];
        var index = jushuArr.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = index != -1? index:0;//局数
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = params[14] == 0?0:(params[14] == 10 ? 1 : 2);//抽牌
        defaultConfig[4][0] = params[30] == 10 ? 1 : 0;//起胡
        defaultConfig[5][0] = parseInt(params[13]) - 1 >= 0 ? parseInt(params[13]) - 1 : 0;//胡息
        
        if(params[12] == 100){
            defaultConfig[6][0] = 1;
        }else if(params[12] == 200){
            defaultConfig[6][0] = 2;
        }
        if(params[17] == 1){
            defaultConfig[6][0] = 3;
        }else if(params[17] == 2){
            defaultConfig[6][0] = 4;
        }
        if(params[12] == 0 && params[17] == 0){
            defaultConfig[6][0] = 0;
        }

        defaultConfig[7][0] = params[16] == 1 ? 0:1;//偎牌
        defaultConfig[9][0] = params[44] == 13 ? 1 : 0;//红胡 10红/13红
        defaultConfig[10][0] = params[15] == 1 ? 1:0;//坐庄
        defaultConfig[11][0] = params[23] == 300?4:params[23]/60;//托管时间
        defaultConfig[12][0] = params[27]== 1 ? 0:params[27]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[13][0] = params[24]== 1 ? 1:0;//是否翻倍
        defaultConfig[14][0] = parseInt(params[26]) - 2 >= 0 ? parseInt(params[26]) - 2 : 0;//翻倍数

        if(params[46] && params[46] != 0 && params[47] && params[47] != 0){
            defaultConfig[15].push(0);
        }

        this.zhzDScore = params[25]?parseInt(params[25]):10;//多少分翻倍
        this.allowScore = parseInt(params[46])||10;
        this.addScore = parseInt(params[47])||10;

        if(params[11] == "1")defaultConfig[8].push(7);//红黑胡
        if(params[31] == "1")defaultConfig[8].push(0);//自摸加番
        if(params[32] == "1")defaultConfig[8].push(1);//一五十
        if(params[33] == "1")defaultConfig[8].push(2);//30胡翻倍
        if(params[35] == "1")defaultConfig[8].push(3);//一点红
        if(params[36] == "1")defaultConfig[8].push(4);//天地胡
        if(params[37] == "1")defaultConfig[8].push(5);//大小字
        if(params[38] == "1")defaultConfig[8].push(6);//碰碰胡
        if(params[18] == "1")defaultConfig[8].push(8);//株洲计分
        if(params[19] == "1")defaultConfig[8].push(9);//自摸加3胡

        this.defaultConfig = defaultConfig;
    },
});