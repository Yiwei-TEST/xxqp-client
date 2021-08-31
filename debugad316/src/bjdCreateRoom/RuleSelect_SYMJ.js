/**
 * Created by Administrator on 2019/8/6.
 */
var RuleSelect_SYMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(7);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","12局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"可选",type:2,content:["带风","加锤","可以吃","清一色可吃","可抢公杠胡","可胡放杠胡","抢杠胡包三家","点杠三家付","点杠杠开包三家","杠后炮三家付","抢杠胡算自摸"],col:3}, //3
            {title:"抓鸟",type:1,content:["不抓鸟","抓2鸟","抓4鸟","抓6鸟"],col:3},            //4
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},    //5
            {title:"托管",type:1,content:["单局托管","整局托管"],col:3},                       //6
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},                           //7
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3}                  //8
        ];

        this.defaultConfig = [[0],[0],[0],[],[0],[0],[1],[0],[0]];
        this.syDScore = parseInt(cc.sys.localStorage.getItem("SYMJ_diScore")) || 5;
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
            if(params[1] == GameTypeEunmMJ.SYMJ){
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
        this.getLayoutByIdx(6).visible = false;
        this.getLayoutByIdx(7).visible = false;
        this.getLayoutByIdx(8).visible = false;

        if(!this.tempData){
            this.tempData = [false,false];//记录可以吃、清一色可吃
        }

        if(this.getItemByIdx(3,2).isSelected() && this.getItemByIdx(3,3).isSelected()){ //可吃、清一色可吃 只能二选一
            if(this.tempData[0] && !this.tempData[1]){
                this.getItemByIdx(3,2).setSelected(false);
            }else  if(!this.tempData[0] && this.tempData[1]){
                this.getItemByIdx(3,3).setSelected(false);
            }
        }
        this.tempData[0] = this.getItemByIdx(3,2).isSelected();
        this.tempData[1] = this.getItemByIdx(3,3).isSelected();

        if(this.getItemByIdx(5,0).isSelected()){//设置托管时间
            this.layoutArr[6].setVisible(false);
        }else{
            this.layoutArr[6].setVisible(true);
        }

        var renshu = 0;
        var arr = [0,1,2,3,4,5,6,7,8,9];//默认是4人
        if(this.getItemByIdx(2,1).isSelected()){//3人
            renshu = 1;
        }else if(this.getItemByIdx(2,2).isSelected()){//2人
            arr = [0,1,2,3,4,10];
            renshu = 2;
            this.getLayoutByIdx(7).setVisible(true);
        }

        for(var i = 0;i < 11;++i){
            if(arr.indexOf(i) !== -1){
                this.getItemByIdx(3,i).setItemState(true);
            }else{
                this.getItemByIdx(3,i).setItemState(false);
            }
        }
        if(renshu < 2){
            if(!this.getItemByIdx(3,4).isSelected()){//如果没有选可胡抢杠胡
                this.getItemByIdx(3,6).setSelected(false);//不可选抢杠胡三家付
            }
            var strArr = ["抢杠胡包三家","点杠三家付","点杠杠开包三家","杠后炮三家付","抢杠胡承包","点杠两家付","点杠杠开承包","杠后炮两家付"];
            for(var i = 0;i < 4;++i){
                this.getItemByIdx(3,6 + i).setLabelString(strArr[i + (renshu ? 4 : 0)]);
            }
        }else{
            if(!this.getItemByIdx(3,4).isSelected()){//如果没有选可胡抢杠胡
                this.getItemByIdx(3,10).setSelected(false);//不可选抢杠胡算自摸
            }
            if(this.getItemByIdx(7,0).isSelected()){//设置加倍
                this.layoutArr[8].setVisible(false);
                this.numBox.visible = false;
            }else{
                this.layoutArr[8].setVisible(true);
                this.numBox.visible = true;
            }
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 4;
        var zsNumArr = [4,6,8];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
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
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
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
            {2:2500,3:1700,4:1300},{2:4500,3:3000,4:2300},{2:4500,3:3000,4:2300}
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.syDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
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
            if(this.getItemByIdx(1,1).isSelected()) costway = 2;
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var daiFeng = 0;
        if (this.getItemByIdx(3,0).isSelected()) daiFeng = 1;

        var jiaChui = 0;
        if (this.getItemByIdx(3,1).isSelected()) jiaChui = 1;

        var keChi = 0;
        if (this.getItemByIdx(3,2).isSelected()) keChi = 1;
        else if (this.getItemByIdx(3,3).isSelected()) keChi = 2;

        var kqggh = 0;//可抢公杠胡
        if (this.getItemByIdx(3,4).isSelected()) kqggh = 1;

        var khfgh = 0;//可胡放杠胡
        var qghbsj = 0;//抢杠胡包三家
        var dgsjf = 0;//点杠三家付
        var dggkbsj = 0;//点杠杠开包三家
        var ghpsjf = 0;//杠后炮三家付
        var qghszm = 0;//抢杠胡算自摸
        var isDouble = 0;//是否加倍
        var doubleNum = 2;//加倍数
        var doubleScore = this.syDScore;//加倍分

        if(renshu == 4){
            if (this.getItemByIdx(3,5).isSelected()) khfgh = 1;
            if (this.getItemByIdx(3,6).isSelected()) qghbsj = 1;
            if (this.getItemByIdx(3,7).isSelected()) dgsjf = 1;
            if (this.getItemByIdx(3,8).isSelected()) dggkbsj = 1;
            if (this.getItemByIdx(3,9).isSelected()) ghpsjf = 1;
        }else if(renshu == 3){
            if (this.getItemByIdx(3,5).isSelected()) khfgh = 1;
            if (this.getItemByIdx(3,6).isSelected()) qghbsj = 2;
            if (this.getItemByIdx(3,7).isSelected()) dgsjf = 2;
            if (this.getItemByIdx(3,8).isSelected()) dggkbsj = 2;
            if (this.getItemByIdx(3,9).isSelected()) ghpsjf = 2;
        }else{
            if (this.getItemByIdx(7,1).isSelected()){
                isDouble = 1;
            }
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(8,i).isSelected()){
                    doubleNum = 2 + i;
                    break;
                }
            }
            doubleScore = this.syDScore;//加倍分
            cc.sys.localStorage.setItem("SYMJ_diScore",doubleScore);
            if(kqggh){//如果勾选了可抢公杠胡
                if (this.getItemByIdx(3,10).isSelected()) qghszm = 1;
            }
        }

        var birdNum = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                birdNum = i*2;
                break;
            }
        }

        var csTuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                csTuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(5,4).isSelected()){
            csTuoguan = 300;
        }

        var syDjtg = 2;
        if (this.getItemByIdx(6,0).isSelected()){
            syDjtg = 1;
        }

        data.params = [
            jushu,//局数                              0
            GameTypeEunmMJ.SYMJ, //玩法ID                1
            costway,     //支付方式                   2
            daiFeng,     //带风                       3（0,1）
            keChi,       //可以吃                     4（0,1,2）/未选，可吃，清一色可吃
            birdNum,     //抓鸟数                     5（0,2,4,6鸟）
            jiaChui,     //加锤                       6（0,1）
            renshu,      //人数                       7（2,3,4）
            csTuoguan,   //托管时间                   8（0,60,120,180,300）
            kqggh,       //可抢公杠胡                 9
            qghbsj,      //抢杠胡包三家 (承包)        10（0，1，2）
            0,           //上中下鸟                   11
            khfgh,       //可胡放杠胡                 12
            dgsjf,       //点杠三家付（两家付）       13（0，1，2）
            dggkbsj,     //点杠杠开包三家(承包)       14（0，1，2）
            ghpsjf,      //杠后炮三家付（两家付）     15（0，1，2）
            qghszm,      //抢杠胡算自摸               16
            1,           //底分                       17
            isDouble,    //加倍                       18
            doubleScore, //加倍分                     19
            doubleNum,   //加倍数                     20
            syDjtg       //单局托管                   21
        ];

        cc.log("data.params =",JSON.stringify(data));
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
        return [GameTypeEunmMJ.SYMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[0],[0],[],[0],[0],[1],[0],[0]];

        defaultConfig[0][0] = params[0] == 8?0: params[0] == 12?1 : 2;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0: params[2] - 1;//支付方式
        defaultConfig[2][0] = params[7] == 4?0: params[7] == 3?1 : 2;//人数
        defaultConfig[4][0] = params[5] / 2;//抓鸟数
        defaultConfig[5][0] = params[8] == 1?1:params[8] == 300?4:params[8]/60;//托管时间
        defaultConfig[6][0] = params[21]?params[21] - 1:1;//单局托管
        defaultConfig[7][0] = params[18] == 1?1:0;//加倍
        defaultConfig[8][0] = params[20] > 0 ? (params[20] - 2) : 0;//加倍数

        if(params[3] == "1")defaultConfig[3].push(0);
        if(params[6] == "1")defaultConfig[3].push(1);
        if(params[4] == "1")defaultConfig[3].push(2);
        else if(params[4] == "2")defaultConfig[3].push(3);
        if(params[9] == "1")defaultConfig[3].push(4);

        this.syDScore = parseInt(params[19]) || 5;

        if(params[7] == 4){
            if(params[12] == "1")defaultConfig[3].push(5);
            if(params[10] == "1")defaultConfig[3].push(6);
            if(params[13] == "1")defaultConfig[3].push(7);
            if(params[14] == "1")defaultConfig[3].push(8);
            if(params[15] == "1")defaultConfig[3].push(9);
        }else if(params[7] == 3){
            if(params[12] == "1")defaultConfig[3].push(5);
            if(params[10] == "2")defaultConfig[3].push(6);
            if(params[13] == "2")defaultConfig[3].push(7);
            if(params[14] == "2")defaultConfig[3].push(8);
            if(params[15] == "2")defaultConfig[3].push(9);
        }else if(params[7] == 2){
            if(params[16] == "1")defaultConfig[3].push(10);
        }

        this.defaultConfig = defaultConfig;
    },
});