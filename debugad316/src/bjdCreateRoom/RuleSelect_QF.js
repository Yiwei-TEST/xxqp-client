/**
 * Created by Administrator on 2019/8/6.
 */
var RuleSelect_QF = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        // this.createNumBox(7);
        this.getItemByIdx(4,3).y = this.getItemByIdx(4,0).y;
        this.getItemByIdx(4,4).y = this.getItemByIdx(4,1).y;
        this.layoutArr[4].titleLabel .y += this.layoutArr[4].itemSpaceH * 1;
        for (var i = 5; i < this.layoutArr.length; i++) {
            this.layoutArr[i].y += this.layoutArr[i].itemSpaceH * 2 ;
        }

        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"人数选择",type:1,content:["3人","2人"]},//1
            {title:"是否留6和7",type:1,content:["留","不留"]},//2
            {title:"喜分方式",type:1,content:["加法","乘法"]}, //3
            {title:"排名奖惩",type:1,content:["一名奖100分 二名扣40分 末名扣60分","一名奖100分 二名扣30分 末名扣70分","一名奖40分 二名不扣分 末名扣40分"
                                            ,"一名奖60分 末名扣60分","一名奖40分 末名扣40分"],col:1},//4
            {title:"奖分",type:1,content:["100分","200分"],col:3}, //5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0]];

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
            if(params[1] == GameTypeEunmPK.QF){
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

        this.updateItemShow(item);
    },

    updateItemShow:function(item){
        var tag =item?item.getTag(): -1;
        // cc.log("tag =",tag);
        this.getItemByIdx(4,3).visible = this.getItemByIdx(4,4).visible = this.getItemByIdx(1,1).isSelected();
        this.getItemByIdx(4,0).visible =this.getItemByIdx(4,1).visible = this.getItemByIdx(4,2).visible = this.getItemByIdx(1,0).isSelected();
        if((tag >= 100 && tag < 200)){
            if(this.getItemByIdx(1,1).isSelected()){
                this.getItemByIdx(4,3).setSelected(true);
                for (var i = 0; i < 3; i++) {
                    this.getItemByIdx(4,i).setSelected(false)
                }
            }else if(this.getItemByIdx(1,0).isSelected()){
                this.getItemByIdx(4,0).setSelected(true);
                for (var i = 3; i < 5; i++) {
                    this.getItemByIdx(4,i).setSelected(false)
                }
            }
        }

        if (this.getItemByIdx(6,0).isSelected()){
            this.layoutArr[7].setVisible(false);
        }else{
            this.layoutArr[7].setVisible(true);
        }
        
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var renshu = 3;
        for(var i = 0;i < 2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = 5;
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = Math.ceil(5/renshu);
            }else{
                zsNum = 5;
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 3;
        for(var i = 0;i < 2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }

        var configArr = {2:3000,3:2000};

        var num = configArr[renshu];

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
        BoxBg.x = 180 + (788/(this.layoutArr[row].itemArr.length));

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
        addBtn.setPosition(165,0);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.syDScore+"分",24,null,cc.color(126,49,2));
        scoreLabel.setAnchorPoint(0,0);
        scoreLabel.setPosition(50,0);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.syDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.syDScore = num - 5;
            }else{
                this.syDScore = num;
            }
        }else if ( num < 10){
            this.syDScore = 5;
        }
        cc.log("this.syDScore =",this.syDScore);
        this.scoreLabel.setString("小于"+ this.syDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 1000;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected()) costway = 2;
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }

        var save67 = 1;
        if (this.getItemByIdx(2,1).isSelected()) save67 = 2;

        var xf = 1;
        if (this.getItemByIdx(3,1).isSelected()) xf = 2;

        var pmjc = 1;
        for(var i = 0;i<5;++i){
            if (this.getItemByIdx(4,i).isSelected())
                pmjc = i+1; 
        }
        var jf = 1;
        if(this.getItemByIdx(5,1).isSelected()) jf = 2;

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            autoPlay = 300;
        }
        var djtg = 1;
        if (this.getItemByIdx(7,1).isSelected()){
            djtg = 2;
        }
        data.params = [
            jushu,//局数            0
            GameTypeEunmPK.QF, //玩法ID 1
            costway,     //支付方式 2
            save67,     //留67     3（1留 2不留）
            xf,       //喜分       4（1喜分算加法,2喜分算乘法）
            pmjc,     //排名奖惩     5（1奖100扣40 60 2奖100扣30 70 3奖40扣0 40）
            jf,       //奖分 6（1 100分 2 200分)
            renshu,   //人数 7
            autoPlay,//托管时间 8
            djtg,//托管方式 9
        ];

        // cc.log("data.params =",JSON.stringify(data));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 1000;
        

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costway = 2;
        }


        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 3-i;
                break;
            }
        }
        return [GameTypeEunmPK.QF,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0]];
        // cc.log("params =",JSON.stringify(params));

        defaultConfig[0][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[1][0] = params[7] == 3?0:1;
        defaultConfig[2][0] = parseInt(params[3])-1;
        defaultConfig[3][0] = parseInt(params[4])-1;
        defaultConfig[4][0] = parseInt(params[5])-1;
        defaultConfig[5][0] = parseInt(params[6])-1;
        defaultConfig[6][0] = params[8]==1?1:params[8] == 300?4:params[8]/60;
        defaultConfig[7][0] = params[9]== 1 ? 0 : 1;//单局托管/整局

        this.defaultConfig = defaultConfig;
    },
});