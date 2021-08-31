/**
 * Created by cyp on 2020/2/14.
 */
var RuleSelect_YYBS = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["5局","10局"],col:3},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数选择",type:1,content:["4人"],col:3},//2
            {title:"玩法",type:2,content:["可查牌","抽6"],col:3},//3
            {title:"抢庄",type:1,content:["带红2","不带红2"],col:3},//4
            {title:"反主",type:1,content:["3次","5次","不限制"],col:3},//5
            {title:"反分",type:1,content:["小反125大反155","小反130大反160"],col:3},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//8
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[1]];

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
            if(params[1] == GameTypeEunmPK.YYBS){
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
        var istg = !this.getItemByIdx(7,0).isSelected();
        this.layoutArr[8].setVisible(istg);
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
        //for(var i = 0;i<2;++i){
        //    if(this.getItemByIdx(2,i).isSelected()){
        //        renshu = 4-i;
        //        break;
        //    }
        //}

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

        zsNum = 0;

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){

        var num = 0;

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 5;

        if(this.getItemByIdx(0,1).isSelected())jushu = 10;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 4;
        //for(var i = 0;i<2;++i){
        //    if(this.getItemByIdx(2,i).isSelected()){
        //        renshu = 4-i;
        //        break;
        //    }
        //}

        var yxcp = 0;
        if(this.getItemByIdx(3,0).isSelected()){
            yxcp = 1;
        }

        var chouliu = 0;
        if(this.getItemByIdx(3,1).isSelected()){
            chouliu = 1;
        }

        var daihong2 = 1;
        if(this.getItemByIdx(4,0).isSelected()){
            daihong2 = 2;
        }

        var fanzhuNum = 3;
        if(this.getItemByIdx(5,1).isSelected())fanzhuNum = 5;
        if(this.getItemByIdx(5,2).isSelected())fanzhuNum = 99;

        var fanfen = 0;
        if(this.getItemByIdx(6,1).isSelected())fanfen = 1;

        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(7,4).isSelected()){
            tuoguan = 300;
        }
        var tuoguan_type = 2;
        for(var i = 0;i<3;++i){
            if (this.getItemByIdx(8,i).isSelected()){
                tuoguan_type = i+1;
            }
        }


        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.YYBS,//玩法ID 1
            costway,//支付方式 2
            0,//双进单出 3
            0,//报副留守 4
            yxcp,//允许查牌 5
            chouliu,//抽六 6
            renshu,//人数 7
            0,//投降需询问 8
            0,//起叫分 9
            0,//小光分 10
            0,//大倒提前结束 11
            0,//叫分加拍 12
            0,//叫分进档 13
            tuoguan,//托管时间 14
            tuoguan_type,//托管类型 15
            daihong2,//带红2 16
            fanzhuNum,//反主次数 17
            fanfen,//反分 18
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 5;
        if(this.getItemByIdx(0,1).isSelected())jushu = 10;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }


        var renshu = 4;
        //for(var i = 0;i<2;++i){
        //    if(this.getItemByIdx(2,i).isSelected()){
        //        renshu = 4-i;
        //        break;
        //    }
        //}
        return [GameTypeEunmPK.YYBS,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[1]];

        defaultConfig[0][0] = params[0] == 10?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 3?1:0;

        if(params[5] == "1")defaultConfig[3].push(0);
        if(params[6] == "1")defaultConfig[3].push(1);

        defaultConfig[4][0] = params[16]==1?1:0;
        defaultConfig[5][0] = params[17] == 3?0:params[17]==5?1:2;
        defaultConfig[6][0] = params[18]==1?1:0;

        defaultConfig[7][0] = params[14]?params[14] == 300?4:params[14]/60:0;
        defaultConfig[8][0] = (params[15]>0?(params[15]-1):1);


        this.defaultConfig = defaultConfig;
    },
});