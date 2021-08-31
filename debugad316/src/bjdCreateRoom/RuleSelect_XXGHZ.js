/**
 * Created by Administrator on 2019/9/6.
 */

/**
 * Created by Administrator on 2019/9/6.
 */
var RuleSelect_XXGHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(9);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["满百结算"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//3
            {title:"玩法",type:2,content:["红黑胡","天地胡","30胡息","放炮必胡"]},//4
            {title:"打坨",type:1,content:["不打坨","坨对坨4番","坨对坨3番"],col:3},//5
            {title:"坐庄",type:1,content:["随机","先进房坐庄"]},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//8
            {title:"加倍",type:1,content:["不加倍","加倍"]},//9
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//10
            {title:"加分",type:2,content:["低于"]},//11
        ];

        this.defaultConfig = [[1],[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];
        this.xxghzDScore = parseInt(cc.sys.localStorage.getItem("XXGHZ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("XXGHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("XXGHZ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.XXGHZ){
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.xxghzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.xxghzDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.xxghzDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.xxghzDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[3].setVisible(true);
            this.layoutArr[9].setVisible(true);
            if(this.getItemByIdx(9,0).isSelected()){
                this.layoutArr[10].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[10].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[11].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(11,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[3].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].setVisible(false);
        }else{
            this.layoutArr[8].setVisible(true);
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = 0;
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = 0;
            }else{
                zsNum = 0;
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var num = 0;

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 1000;

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
        var hhh = this.getItemByIdx(4,0).isSelected() ? 1 : 0;//黑红胡
        var tdh = this.getItemByIdx(4,1).isSelected() ? 1 : 0;//天地胡
        var sshfb = this.getItemByIdx(4,2).isSelected() ? 1 : 0;//30胡翻倍
        var fpbh = this.getItemByIdx(4,3).isSelected() ? 1 : 0;//放炮必胡

        var datuo = 0;
        for(var i = 1;i<3;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                datuo = 4 - i + 1;//4,3,2
                break;
            }
        }
        var zhuang = 0;//坐庄
        if(this.getItemByIdx(6,1).isSelected()){
            zhuang = 1;
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

        var djtg = 2;
        if (this.getItemByIdx(8,0).isSelected()){
            djtg = 1;
        } else if (this.getItemByIdx(8,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(9,1).isSelected())isDouble = 1;

        var dScore = this.xxghzDScore;
        cc.sys.localStorage.setItem("XXGHZ_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,1).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(10,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("XXGHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("XXGHZ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.XXGHZ,//玩法ID 1
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
            0, // 12 *****无用占位
            0, // 13 *****无用占位
            choupai,//抽牌 14
            zhuang,//坐庄 15
            0,// 16 *****无用占位
            0,// 17 *****无用占位
            0,// 18 *****无用占位
            0,// 19 *****无用占位
            0,// 20 *****无用占位
            0,// 21 *****无用占位
            0,// 22 *****无用占位
            autoPlay,//托管时间 23
            isDouble,//是否翻倍 24
            dScore,//翻倍上限 25
            doubleNum,//翻倍倍数 26
            djtg,//单局托管 27
            datuo,// 28 打坨
            0,// 29 *****无用占位
            0,// 30 *****无用占位
            0,// 31 *****无用占位
            0,// 32 *****无用占位
            sshfb,// 33 30胡翻倍
            0,// 34 *****无用占位
            0,// 35 *****无用占位
            tdh,// 36 天地胡
            0,// 37 *****无用占位
            0,// 38 *****无用占位
            0,// 39 *****无用占位
            0,// 40 *****无用占位
            fpbh,// 41 放炮必胡
            0,0,0,0,// 42~45 *****无用占位
            allowScore,//46 低于 xx分
            morefen,//47 加xx分
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 1;

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

        return [GameTypeEunmZP.XXGHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = 0;//局数
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = params[14] == 0?0:(params[14] == 10 ? 1 : 2);//抽牌
        var arr = [0,4,3];
        var index = arr.indexOf(parseInt(params[28]));
        defaultConfig[5][0] = index != -1 ? index : 0;
        defaultConfig[6][0] = params[15] == 1 ? 1:0;//坐庄
        defaultConfig[7][0] = params[23] == 300?4:params[23]/60;//托管时间
        defaultConfig[8][0] = params[27]== 1 ? 0:params[27]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[9][0] = params[24]== 1 ? 1:0;//是否翻倍
        defaultConfig[10][0] = parseInt(params[26]) - 2 >= 0 ? parseInt(params[26]) - 2 : 0;//翻倍数

        if(params[46] && params[46] != 0 && params[47] && params[47] != 0){
            defaultConfig[11].push(0);
        }

        this.zhzDScore = params[25]?parseInt(params[25]):10;//多少分翻倍
        this.allowScore = parseInt(params[46])||10;
        this.addScore = parseInt(params[47])||10;

        if(params[11] == "1")defaultConfig[4].push(0);//红黑胡
        if(params[36] == "1")defaultConfig[4].push(1);//天地胡
        if(params[33] == "1")defaultConfig[4].push(2);//30胡翻倍
        if(params[41] == "1")defaultConfig[4].push(3);//放炮必胡

        this.defaultConfig = defaultConfig;
    },
});