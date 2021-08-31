/**
 * Created by cyp on 2019/6/26.
 */
var RuleSelect_TDH = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(8);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","12局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["明杠过杠不能再补","将将胡必须自摸","清一色可吃","将碰胡接炮不算将将胡","\n大胡底分10分","80分封顶"],col:3},//3
            {title:"飘分",type:1,content:["不飘分","飘1分","飘2分","飘3分","自由飘分"],col:3},//4
            {title:"抓鸟",type:1,content:["不抓鸟","单鸟"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//8
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//9
        ];

        this.defaultConfig = [[0],[1],[0],[0,1],[0],[1],[0],[0],[0],[0]];
        this.tdhDScore = parseInt(cc.sys.localStorage.getItem("TDH_diScore")) || 5;

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
            if(params[1] == GameTypeEunmMJ.TDH){
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
        this.getLayoutByIdx(8).visible = false;
        this.getLayoutByIdx(9).visible = false;

        var is2ren = false;
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[8].setVisible(true);
            if(this.getItemByIdx(8,0).isSelected()){
                this.layoutArr[9].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[9].setVisible(true);
                this.numBox.visible=true;

            }
            is2ren = true;
        }else{
            this.layoutArr[8].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.numBox.visible=false;
        }

        var istg = !this.getItemByIdx(6,0).isSelected();
        this.layoutArr[7].setVisible(istg);
        this.getItemByIdx(7,0).setItemState(istg);
        this.getItemByIdx(7,1).setItemState(istg);
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
            {2:3000,3:2000,4:1500},{2:4500,3:3000,4:2300},{2:5000,3:3300,4:2500}
        ]

        var num = configArr[temp][renshu];

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.tdhDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.tdhDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.tdhDScore = num - 5;
            }else{
                this.tdhDScore = num;
            }
        }else if ( num < 10){
            this.tdhDScore = 5;
        }
        cc.log("this.csDScore =",this.tdhDScore);
        this.scoreLabel.setString("小于"+ this.tdhDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = 8 + 4*i;
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

        var ggbb = 0;
        if(this.getItemByIdx(3,0).isSelected())ggbb = 1;//明杠过杠不能再补
        var jjhzm = 0;
        if(this.getItemByIdx(3,1).isSelected())jjhzm = 1;//将将胡必须自摸
        var qyskc = 0;
        if(this.getItemByIdx(3,2).isSelected())qyskc = 1;//清一色可吃

        var dahudifen = 0;
        if(this.getItemByIdx(3,4).isSelected())dahudifen = 1;//大胡底分10分

        var bashifengding = 0;
        if(this.getItemByIdx(3,5).isSelected())bashifengding = 1;//80分封顶

        var gzbdp = 0;

        var pphjp = 0;
        if(this.getItemByIdx(3,3).isSelected())pphjp = 1;//碰碰胡接炮不算将将胡

        var kePiao = 0;
        if (this.getItemByIdx(4,1).isSelected()) kePiao =2;
        else if(this.getItemByIdx(4,2).isSelected())kePiao=3;
        else if(this.getItemByIdx(4,3).isSelected())kePiao=4;
        else if(this.getItemByIdx(4,4).isSelected())kePiao = 1;

        var zhuaiao = 0;
        if(this.getItemByIdx(5,1).isSelected())zhuaiao = 1;

        var is_double = 0;
        if(this.getItemByIdx(8,1).isSelected()){
            is_double = 1;
        }

        cc.sys.localStorage.setItem("TDH_diScore",this.tdhDScore);
        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                doubleNum = 2 + i;
                break;
            }
        }

        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            tuoguan = 300;
        }
        var tuoguan_type = 2;
        if (this.getItemByIdx(7,0).isSelected()){
            tuoguan_type = 1;
        }
        if (this.getItemByIdx(7,2).isSelected()){
            tuoguan_type = 3;
        }


        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.TDH,//玩法ID 1
            costway,//支付方式 2
            is_double,//是否加倍3
            this.tdhDScore,//加倍分4
            doubleNum,//加倍数5
            kePiao,//飘分6
            renshu,//人数7
            tuoguan,//托管8
            tuoguan_type,//单局或整局托管9
            zhuaiao,//抓鸟10
            ggbb,//明杠过杠不能再补11
            jjhzm,//将将胡必须自摸12
            qyskc,//清一色可吃13
            gzbdp,//跟张不点炮14
            pphjp,//将碰胡接炮不算将将胡15
            dahudifen,//大胡底分10分 16
            bashifengding,//80分封顶 17
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 4;
        for(var i = 0;i<3;++i){
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
        return [GameTypeEunmMJ.TDH,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[0],[0]];

        defaultConfig[0][0] = params[0] == 16?2:params[0] == 12?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;

        if(params[11] == "1")defaultConfig[3].push(0);
        if(params[12] == "1")defaultConfig[3].push(1);
        if(params[13] == "1")defaultConfig[3].push(2);
        if(params[15] == "1")defaultConfig[3].push(3);
        if(params[16] == "1")defaultConfig[3].push(4);
        if(params[17] == "1")defaultConfig[3].push(5);

        defaultConfig[4][0] = params[6] == 1?4:params[6] == 2?1:params[6] == 3?2:params[6] == 4?3:0;
        defaultConfig[5][0] = params[10] == 1?1:0;
        defaultConfig[6][0] = params[8]?params[8] == 300?4:params[8]/60:0;
        defaultConfig[7][0] = params[9]?params[9]-1:1;
        defaultConfig[8][0] = params[3] == 1?1:0;
        defaultConfig[9][0] = params[5] -2;

        this.tdhDScore = parseInt(params[4]);

        this.defaultConfig = defaultConfig;
    },
});