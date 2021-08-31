/**
 * Created by cyp on 2019/3/20.
 */
var RuleSelect_ZHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","16局"]},//1
            {title:"人数",type:1,content:["4人","3人","2人"]},//2
            {title:"起胡",type:1,content:["3红","4红"]},//3
            {title:"选王",type:1,content:["无王","单王","双王","三王","四王"],col:3},//4
            {title:"可选",type:2,content:["双合翻倍","大胡十分","碰碰胡","四碰单吊","80分封顶"
                ,"一挂匾","十一红","满堂红","蝴蝶飞","板板胡","湘阴句句红","汨罗句句红","十二红","随机坐庄","蝴蝶不可上手","听牌后蝴蝶不可上手"],col:3},//5
            {title:"板板胡",type:1,content:["闲家胡桌面第一张","闲家胡自己摸的第一张"],col:3},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//8
            {title:"抽牌",type:1,content:["不抽底牌","抽牌20张"]},//9
            {title:"加倍",type:1,content:["不加倍","加倍"]},//10
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//11
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[],[0],[0],[1],[0],[0],[0]];
        this.zhzDScore = parseInt(cc.sys.localStorage.getItem("ZHZ_diScore")) || 10;


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
            if(params[1] == GameTypeEunmZP.ZHZ){
                this.readSelectData(params);
            }
        }

        return true;
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
        //cc.log("this.zhzDScore =",this.zhzDScore);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.zhzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
     onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.zhzDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.zhzDScore = num;
        }
        cc.log("this.zhzDScore =",this.zhzDScore);
        this.scoreLabel.setString("小于"+ this.zhzDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        // if(tag < 200){
            this.updateZsNum();
        // }

        // var tagArr = [100,101,600,601];
        // if(ArrayUtil.indexOf(tagArr,tag) != -1){
            this.updateItemShow(tag);
        // }
    },

    updateItemShow:function(tag){
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[9].setVisible(true);
            this.layoutArr[10].setVisible(true);
            if(this.getItemByIdx(10,0).isSelected()){
                this.layoutArr[11].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[11].setVisible(true);
                this.numBox.setVisible(true);
            }
        }else{
            this.layoutArr[10].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.layoutArr[11].setVisible(false);
        }

        if (this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].setVisible(false);
        }else{
            this.layoutArr[8].setVisible(true);
        }


        if(this.getItemByIdx(5,10).isSelected() && tag == 510)
            this.getItemByIdx(5,11).setSelected(false)
        if(this.getItemByIdx(5,11).isSelected())
            this.getItemByIdx(5,10).setSelected(false)
        if(this.getItemByIdx(5,14).isSelected() && tag == 514)
            this.getItemByIdx(5,15).setSelected(false)
        if(this.getItemByIdx(5,15).isSelected())
            this.getItemByIdx(5,14).setSelected(false)
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [5,10];
        var renshu = 4;
        var temp = 0;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
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
        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(1,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000,4:1500},{2:5000,3:3400,4:2500}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        for(var i = 0;i<1;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushu +i*8;
                break;
            }
        }

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
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var qihu = 1;//3红
        if (this.getItemByIdx(3,1).isSelected()) qihu = 2;//四红

        var xuanwang = 0;//无王
        for (var i = 0; i < 5; i++) {
            if(this.getItemByIdx(4,i).isSelected()){
                xuanwang = i;
                break;
            }
        }

        var shfb = 0;
        if (this.getItemByIdx(5,0).isSelected()) shfb = 1;
        var dh10f = 0;
        if (this.getItemByIdx(5,1).isSelected()) dh10f = 1;
        var pph = 0;
        if (this.getItemByIdx(5,2).isSelected()) pph = 1;
        var sbdd = 0;
        if (this.getItemByIdx(5,3).isSelected()) sbdd = 1;
        var fd80f = 0;
        if (this.getItemByIdx(5,4).isSelected()) fd80f = 1;
        var ykb = 0;
        if (this.getItemByIdx(5,5).isSelected()) ykb = 1;
        var syh = 0;
        if (this.getItemByIdx(5,6).isSelected()) syh = 1;
        var mth = 0;
        if (this.getItemByIdx(5,7).isSelected()) mth = 1;
        var hdf = 0;
        if (this.getItemByIdx(5,8).isSelected()) hdf = 1;
        var bbh = 0;
        if (this.getItemByIdx(5,9).isSelected()) bbh = 1;
        var jjh = 0;
        if (this.getItemByIdx(5,10).isSelected()) jjh = 1;
        if (this.getItemByIdx(5,11).isSelected()) jjh = 2;
        var seh = 0;
        if (this.getItemByIdx(5,12).isSelected()) seh = 1;
        var sjzz = 0;
        if (this.getItemByIdx(5,13).isSelected()) sjzz = 1;
        var hdbkss = 0;
        if (this.getItemByIdx(5,14).isSelected()) hdbkss = 1;
        if (this.getItemByIdx(5,15).isSelected()) hdbkss = 2;

        var bbhtype = 1;
        if (this.getItemByIdx(6,1).isSelected()) bbhtype =2 ;

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
        }
        if (this.getItemByIdx(8,2).isSelected()){
            djtg = 3;
        }

        var choupai = 0;
        var choupaiArr = [0,20];
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                choupai = choupaiArr[i];
                break;
            }
        }

        var isDouble = 0;
        if(this.getItemByIdx(10,1).isSelected())isDouble = 1;

        var dScore = this.zhzDScore;
        cc.sys.localStorage.setItem("ZHZ_diScore",dScore);

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                doubleNum = 2 + i;
            }
        }


        data.params = [
            jushu,//局数 0 
            GameTypeEunmZP.ZHZ,//玩法ID 1
            qihu,//起胡 1 三红 2 四红 2
            xuanwang,//选王 0-4王 3
            shfb,//双合翻倍  4
            dh10f,//大胡10分 5
            pph,//碰碰胡 6
            renshu,//人数 7
            sbdd,//四碰单调 8
            costWay,//支付方式 9
            fd80f,//80分封顶 10
            ykb,//一挂匾 11
            syh,//十一红 12
            mth,//满堂红 13
            hdf,//蝴蝶飞 14
            bbh,//板板胡 15
            jjh,//句句红 16
            seh,//十二红 17
            sjzz,//随机坐庄 18
            bbhtype,//1 闲家胡桌面第一张 2 闲家胡自己摸的第一张 19
            autoPlay,//可托管 20
            isDouble,//是否翻倍 21
            dScore,//翻倍上限 22
            doubleNum,//翻倍倍数 23
            djtg,//单局托管 24
            choupai,//抽牌 25
            hdbkss,//蝴蝶不可上手 26
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        for(var i = 0;i<1;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushu +i*8;
                break;
            }
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
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
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        return [GameTypeEunmZP.ZHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        // cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[0],[0],[0],[0],[],[0],[0],[1],[0],[0],[0]];
        defaultConfig[0][0] = params[9] == 3||params[9] == 4?0:params[9] - 1;
        defaultConfig[1][0] = params[0] == 16?2:params[0] == 12?1:0;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;
        defaultConfig[3][0] = params[2] == 2?1:0;
        defaultConfig[4][0] = parseInt(params[3]);
        defaultConfig[6][0] = params[19]==2?1:0;
        defaultConfig[7][0] = params[20]==1?1:params[20] == 300?4:params[20]/60;
        defaultConfig[8][0] = params[24]?params[24]-1:0;
        defaultConfig[9][0] = params[25]==20?1:0;
        defaultConfig[10][0] = parseInt(params[21]);
        defaultConfig[11][0] = parseInt(params[23]) - 2;

        this.zhzDScore = params[22]?parseInt(params[22]):10;

        if(params[4] == "1")defaultConfig[5].push(0);
        if(params[5] == "1")defaultConfig[5].push(1);
        if(params[6] == "1")defaultConfig[5].push(2);
        if(params[8] == "1")defaultConfig[5].push(3);
        if(params[10] == "1")defaultConfig[5].push(4);
        if(params[11] == "1")defaultConfig[5].push(5);
        if(params[12] == "1")defaultConfig[5].push(6);
        if(params[13] == "1")defaultConfig[5].push(7);
        if(params[14] == "1")defaultConfig[5].push(8);
        if(params[15] == "1")defaultConfig[5].push(9);
        if(params[16] == "1")defaultConfig[5].push(10);
        if(params[16] == "2")defaultConfig[5].push(11);
        if(params[17] == "1")defaultConfig[5].push(12);
        if(params[18] == "1")defaultConfig[5].push(13);
        if(params[26] == "1")defaultConfig[5].push(14);
        if(params[26] == "2")defaultConfig[5].push(15);

        this.defaultConfig = defaultConfig;
    },
});