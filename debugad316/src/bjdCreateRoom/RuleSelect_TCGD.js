/**
 * Created by cyp on 2019/11/13.
 */
var RuleSelect_TCGD = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["4局","6局","8局"],col:3},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"底分",type:1,content:["1","2","3"],col:3},//2
            {title:"玩法",type:2,content:["显示牌数"],col:4},//3
            {title:"红2",type:1,content:["红2不可单出","红2可单出"],col:3},//4
            {title:"报牌",type:1,content:["7张","10张"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0]];

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
            if(params[1] == GameTypeEunmPK.TCGD){
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
        if(tag < 200){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        var istg = !this.getItemByIdx(6,0).isSelected();
        this.layoutArr[7].setVisible(istg);
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 8;
        var zsNumArr = [8,12,16];
        var temp = 0;
        var renshu = 4;

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

        var temp = 0;
        for(var i = 0;i<3;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {4:2000},{4:3000},{4:4000}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 4;
        if(this.getItemByIdx(0,1).isSelected())jushu = 6;
        if(this.getItemByIdx(0,2).isSelected())jushu = 8;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 4;

        var difen = 1;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                difen = i+1;
                break;
            }
        }

        var xsps = 0;
        if(this.getItemByIdx(3,0).isSelected())xsps = 1;

        var h2dc = 1;
        if(this.getItemByIdx(4,1).isSelected())h2dc = 2;

        var baopaiNum = 7;
        if(this.getItemByIdx(5,1).isSelected())baopaiNum = 10;

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
        for(var i = 0;i<3;++i){
            if (this.getItemByIdx(7,i).isSelected()){
                tuoguan_type = i+1;
            }
        }

        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.TCGD,//玩法ID 1
            costway,//支付方式 2
            difen,//底分 3
            0,// 4
            0,// 5
            0,// 6
            renshu,//人数 7
            0,// 8
            tuoguan,//托管时间 9
            tuoguan_type,//托管类型 10
            h2dc,//红2可单出 11
            xsps,//显示牌数 12
            baopaiNum,//报牌数 13
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 4;
        if(this.getItemByIdx(0,1).isSelected())jushu = 6;
        if(this.getItemByIdx(0,2).isSelected())jushu = 8;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 4;

        return [GameTypeEunmPK.TCGD,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0]];

        defaultConfig[0][0] = params[0] == 8?2:params[0]==6?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = (params[3] - 1) || 0;

        if(params[12] == "1")defaultConfig[3].push(0);

        defaultConfig[4][0] = params[11] == 2?1:0;
        defaultConfig[5][0] = params[13] == 10?1:0;

        defaultConfig[6][0] = params[9]?params[9] == 300?4:params[9]/60:0;
        defaultConfig[7][0] = (params[10]>0?(params[10]-1):1);

        this.defaultConfig = defaultConfig;
    },
});