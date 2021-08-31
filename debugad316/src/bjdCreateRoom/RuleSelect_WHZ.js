/**
 * Created by cyp on 2019/7/12.
 */
var RuleSelect_WHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.updateItemShow();

    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数",type:1,content:["3人","2人"]},//2
            {title:"玩法",type:2,content:["卡歪","闲家地胡","胡>歪","庄家地胡","首轮随机庄"],col:3},//3
            {title:"豪分",type:1,content:["10/20/30","20/30/40"]},//4
            {title:"名堂",type:1,content:["60/80/100","80/100/120"]},//5
            {title:"飘分",type:1,content:["不飘","飘1/2/4","飘2/3/5"]},//6
            {title:"埋牌",type:1,content:["不埋牌","埋10张","埋20张"]},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管"],col:3},//9
            {title:"加倍",type:1,content:["不加倍","加倍"]},//10
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//11
        ];

        this.defaultConfig = [[0],[1],[0],[0,1,3],[0],[0],[0],[0],[0],[0],[0],[0]];
        this.whzDScore = parseInt(cc.sys.localStorage.getItem("WHZ_diScore")) || 10;

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
            if(params[1] == GameTypeEunmZP.WHZ){
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
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();

    },

    updateItemShow:function(){
        this.getLayoutByIdx(10).visible = false;
        this.getLayoutByIdx(11).visible = false;

        var is2ren = false;
        if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[10].setVisible(true);
            if(this.getItemByIdx(10,0).isSelected()){
                this.layoutArr[11].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[11].setVisible(true);
                this.numBox.visible=true;

            }
            is2ren = true;
        }else{
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.numBox.visible=false;
        }

        var istg = !this.getItemByIdx(8,0).isSelected();
        this.layoutArr[9].setVisible(istg);
        this.getItemByIdx(9,0).setItemState(istg);
        this.getItemByIdx(9,1).setItemState(istg);

        for(var i = 0;i<3;++i){
            this.getItemByIdx(7,i).setItemState(is2ren);
        }
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
        cc.log("this.whzDScore =",this.whzDScore);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.whzDScore+"分",38,null,cc.color(126,49,2));
        //scoreLabel.setAnchorPoint(0.5,0.5);
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.whzDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num <= 100){
            this.whzDScore = num;
        }
        // cc.log("this.whzDScore =",this.whzDScore);
        this.scoreLabel.setString("小于"+ this.whzDScore + "分");
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        var zsNumArr = [4,8];
        var renshu = 3;
        var temp = 0;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
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
                zsNum = zsNumArr[temp];
            }
        }
        zsNum = 0;
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var num = 0;
        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

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
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected())jushu = 16;

        var kawai = 2;
        if(this.getItemByIdx(3,0).isSelected())kawai = 1;

        var xianjiadihu = 0;
        if(this.getItemByIdx(3,1).isSelected())xianjiadihu = 1;

        var hudayuwai = 0;
        if(this.getItemByIdx(3,2).isSelected())hudayuwai = 1;

        var zhuangjiadihu = 0;
        if(this.getItemByIdx(3,3).isSelected())zhuangjiadihu = 1;

        var sjzj = 0;
        if(this.getItemByIdx(3,4).isSelected())sjzj = 1;

        var haofen = 1;
        if(this.getItemByIdx(4,1).isSelected())haofen = 2;

        var mingtang = 1;
        if(this.getItemByIdx(5,1).isSelected())mingtang = 2;

        var piaofen = 0;
        if(this.getItemByIdx(6,1).isSelected())piaofen = 1;
        if(this.getItemByIdx(6,2).isSelected())piaofen = 2;

        var maipai = 1;
        if(this.getItemByIdx(7,1).isSelected())maipai = 2;
        if(this.getItemByIdx(7,2).isSelected())maipai = 3;

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

        var isDouble = 0;
        if(this.getItemByIdx(10,1).isSelected())isDouble = 1;

        var dScore = this.whzDScore;


        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                doubleNum = 2 + i;
            }
        }
        var djtg = 2;
        if (this.getItemByIdx(9,0).isSelected()){
            djtg = 1;
        }
        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.WHZ,//玩法ID 1
            costWay,//支付方式 2
            hudayuwai,//胡>歪3
            kawai,//卡歪4
            maipai,//埋牌5
            xianjiadihu,//闲家地胡6
            renshu,//人数 7
            zhuangjiadihu,//庄家地胡8
            sjzj,//首轮随机庄家9
            haofen,//豪分10
            mingtang,//名堂11
            piaofen,//飘分12
            autoPlay,//可托管 13
            isDouble,//是否翻倍 14
            dScore,//翻倍上限 15
            doubleNum,//翻倍倍数 16
            djtg,//单局托管 17
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var costWay = 1;

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected())jushu = 16;

        return [GameTypeEunmZP.WHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[0],[0],[0],[0]];
        defaultConfig[0][0] = params[0] == 16?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 3?0:1;
        defaultConfig[4][0] = params[10] == 2?1:0;
        defaultConfig[5][0] = params[11] == 2?1:0;
        defaultConfig[6][0] = params[12] == 2?2:params[12] == 1?1:0;
        defaultConfig[7][0] = params[5] == 3?2:params[5] == 2?1:0;
        defaultConfig[8][0] = params[13] == 300?4:params[13]/60;
        defaultConfig[9][0] = params[17]?params[17]-1:0;
        defaultConfig[10][0] = params[14] == 1 ? 1 :0;
        defaultConfig[11][0] = params[16] == 3 ? 1 :params[16]==4?2:0;

        this.whzDScore = params[15]?parseInt(params[15]):10;

        if(params[4] == "1")defaultConfig[3].push(0);
        if(params[6] == "1")defaultConfig[3].push(1);
        if(params[3] == "1")defaultConfig[3].push(2);
        if(params[8] == "1")defaultConfig[3].push(3);
        if(params[9] == "1")defaultConfig[3].push(4);

        this.defaultConfig = defaultConfig;
    },
});