/**
 * Created by Administrator on 2019/12/17.
 */
var RuleSelect_XTBP = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["4局","8局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数选择",type:1,content:["4人","3人"],col:3},//2
            {title:"玩法",type:2,content:["双进单出","自选加飘","大倒不封顶","投降2倍"]},//3
            {title:"操作",type:2,content:["可查牌","可看底","可看分","可喊来米"]},//4
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//5
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//6
        ];

        this.defaultConfig = [[0],[1],[0],[],[],[0],[1]];

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
            if(params[1] == GameTypeEunmPK.XTBP){
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
        var istg = !this.getItemByIdx(5,0).isSelected();
        this.layoutArr[6].setVisible(istg);
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 3;
        var zsNumArr = [3,5];
        var temp = 0;
        var renshu = 4;
        if(this.getItemByIdx(2,1).isSelected())renshu = 3;

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
                zsNum = zsNumArr[temp]
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
        var jushu = 4;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 8;
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
        if(this.getItemByIdx(2,1).isSelected())renshu = 3;

        var sjdc = 0;
        if(this.getItemByIdx(3,0).isSelected()){
            sjdc = 1;
        }

        var zxjp = 0;//自选飘分
        if(this.getItemByIdx(3,1).isSelected()){
            zxjp = 1;
        }

        var ddbfd = 0;//大倒不封顶
        if(this.getItemByIdx(3,2).isSelected()){
            ddbfd = 1;
        }

        var tx2bei = 0;//投降2倍
        if(this.getItemByIdx(3,3).isSelected()){
            tx2bei = 1;
        }

        var kcp = 0;//可查牌
        if(this.getItemByIdx(4,0).isSelected()){
            kcp = 1;
        }

        var kkd = 0;//可看底
        if(this.getItemByIdx(4,1).isSelected()){
            kkd = 1;
        }

        var kkf = 0;//可看分
        if(this.getItemByIdx(4,2).isSelected()){
            kkf = 1;
        }

        var kklm = 0;//可喊来米
        if(this.getItemByIdx(4,3).isSelected()){
            kklm = 1;
        }

        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(5,4).isSelected()){
            tuoguan = 300;
        }
        var tuoguan_type = 2;
        for(var i = 0;i<3;++i){
            if (this.getItemByIdx(6,i).isSelected()){
                tuoguan_type = i+1;
            }
        }


        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.XTBP,//玩法ID 1
            costway,//支付方式 2
            sjdc,//双进单出 3
            0,//报副留守 4
            kcp,//允许查牌 5
            0,//抽六 6
            renshu,//人数 7
            0,//投降需询问 8
            0,//60分起叫 9
            0,//小光分 10
            0,//大倒提前结束 11
            0,//叫分加拍 12
            0,//叫分进档 13
            tuoguan,//托管时间 14
            tuoguan_type,//托管类型 15
            zxjp,//16 //自选加飘
            kkd,//17 //可看底
            kkf,//18 //可看分
            kklm,//19 //可喊来米
            ddbfd,//20 //大倒不封顶
            tx2bei,//21 //投降2倍
        ];

        cc.log("data.params =",JSON.stringify(data.params));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 4;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 8;
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
        if(this.getItemByIdx(2,1).isSelected())renshu = 3;

        return [GameTypeEunmPK.XTBP,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[],[0],[1]];

        defaultConfig[0][0] = params[0] == 8?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 3?1:0;

        if(params[3] == "1")defaultConfig[3].push(0);
        if(params[16] == "1")defaultConfig[3].push(1);
        if(params[20] == "1")defaultConfig[3].push(2);
        if(params[21] == "1")defaultConfig[3].push(3);

        if(params[5] == "1")defaultConfig[4].push(0);
        if(params[17] == "1")defaultConfig[4].push(1);
        if(params[18] == "1")defaultConfig[4].push(2);
        if(params[19] == "1")defaultConfig[4].push(3);

        defaultConfig[5][0] = params[14]?params[14] == 300?4:params[14]/60:0;
        defaultConfig[6][0] = (params[15]>0?(params[15]-1):1);


        this.defaultConfig = defaultConfig;
    },
});