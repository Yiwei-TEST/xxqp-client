/**
 * Created by cyp on 2019/3/20.
 */
var RuleSelect_SYZP = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(7);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},
            {title:"人数",type:1,content:["3人","2人"]},
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//2
            {title:"托管",type:1,content:["单局托管","整局托管"],col:3},//3
            {title:"局数",type:1,content:["10局","20局"]},//4
            {title:"胡息",type:1,content:["3息一囤","5息一囤"]},//5
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//6
            {title:"加倍",type:1,content:["不加倍","加倍"]},//7
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//8
            // {title:"翻倍上限",type:1,content:["小于20分","小于30分","小于40分","小于50分"]}//9
        ];

        this.defaultConfig = [[1],[0],[0],[1],[0],[0],[0],[0],[0]];
        this.dnScore = parseInt(cc.sys.localStorage.getItem("SYZP_diScore")) || 5;

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
            if(params[1] == GameTypeEunmZP.SYZP){
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

        // var tagArr = [100,101,600,601];
        // if(ArrayUtil.indexOf(tagArr,tag) != -1){
            this.updateItemShow();
        // }
    },

    updateItemShow:function(){
        if(this.getItemByIdx(1,1).isSelected()){
            this.layoutArr[6].setVisible(true);
            this.layoutArr[7].setVisible(true);

            if(this.getItemByIdx(7,0).isSelected()){
                this.layoutArr[8].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[8].setVisible(true);
                this.numBox.setVisible(true);
            }

        }else{
            this.layoutArr[6].setVisible(false);
            this.layoutArr[7].setVisible(false);
            this.layoutArr[8].setVisible(false);
            this.numBox.setVisible(false);
        }

        if(this.getItemByIdx(2,0).isSelected()){
            this.layoutArr[3].setVisible(false);
        }else{
            this.layoutArr[3].setVisible(true);
        }
        this.updateLayout();
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        var zsNumArr = [4,8]
        var renshu = 3;
        var temp = 0;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }
        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(4,i);
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
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(4,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:2500,3:1700},{2:4500,3:3000}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
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


        // cc.log("this.dnScore =",this.dnScore);
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

        if (num && num >= 5 && num <= 100){
            this.dnScore = num;
        }
        // cc.log("this.dnScore =",this.dnScore);
        this.scoreLabel.setString(this.dnScore + "分");
    },
    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 10;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                jushu = jushu * Math.pow(2,i);
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
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

        var limitScore = 0;
        var limitScoreArr = [0,150,200,300];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                limitScore = limitScoreArr[i];
                break;
            }
        }
        var hongheihu = 0;
        var kelianzhuang = 0;

        var huxi = 3;
        if(this.getItemByIdx(5,1).isSelected())huxi = 5;

        var choupai = 0;
        var choupaiArr = [0,10,20];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                choupai = choupaiArr[i];
                break;
            }
        }

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(2,4).isSelected()){
            autoPlay = 300;
        }

        var isDouble = 0;
        if(this.getItemByIdx(7,1).isSelected())isDouble = 1;

        // var dScore = 20;
        // for(var i = 0;i<4;++i){
        //     if(this.getItemByIdx(9,i).isSelected()){
        //         dScore = 20 + i*10;
        //         break;
        //     }
        // }
        var dScore = 0;
        dScore = this.dnScore;
        cc.sys.localStorage.setItem("SYZP_diScore",dScore);

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                doubleNum = 2 + i;
            }
        }
        var djtg = 2;
        if (this.getItemByIdx(3,0).isSelected()){
            djtg = 1;
        }
        data.params = [
            jushu,//局数 0 
            GameTypeEunmZP.SYZP,//玩法ID 1
            0,0,0,0,0,
            renshu,//人数 7
            200,
            costWay,//支付方式 9
            limitScore,//连庄上限 10
            hongheihu,//红黑胡选项 11
            kelianzhuang,//可连庄 12
            huxi,//多少息一屯 13
            choupai,//抽牌 14
            0,0,0,0,0,0,0,0,
            autoPlay,//可托管 23
            isDouble,//是否翻倍 24
            dScore,//翻倍上限 25
            doubleNum,//翻倍倍数 26
            djtg,//单局托管 27
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 10;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(3,i).isSelected()){
                jushu = jushu * Math.pow(2,i);
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
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

        return [GameTypeEunmZP.SYZP,costWay,jushu,renshu];

    },

        //俱乐部创建玩法包厢,读取配置选项
        readSelectData:function(params){
            cc.log("===========readSelectData============" + params);
            var defaultConfig = [[0],[0],[0],[0],[0],[0],[0],[0],[0]];

            defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
            defaultConfig[1][0] = params[7] == 2 ? 1: 0;
            defaultConfig[2][0] = params[23]==1?1:params[23] == 300?4:params[23]/60;
            defaultConfig[3][0] = params[27]? params[27]-1 :1;
            defaultConfig[4][0] = params[0] == 20?1:0;
            defaultConfig[5][0] = params[13] == 5 ? 1 : 0;
            defaultConfig[6][0] = params[14] == 10 ? 1 :params[14]==20?2: 0;
            defaultConfig[7][0] = params[24] == 1 ? 1 :0;
            defaultConfig[8][0] = params[26] == 3 ? 1 :params[26]==4?2:0;
            // defaultConfig[9][0] = ((params[25] -20)/10) || 0;
            this.dnScore = params[25]?parseInt(params[25]):5;
            // if(params[23] == "1")defaultConfig[2].push(0);

            this.defaultConfig = defaultConfig;
        },
});