/**
 * Created by cyp on 2020/2/14.
 */
var RuleSelect_CDTLJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1局","4局","8局"],col:3},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数选择",type:1,content:["4人"],col:3},//2
            {title:"玩法",type:2,content:["允许查牌","四王定主算十级"],col:3},//3
            {title:"封顶",type:1,content:["不封顶","8级封顶","10级封顶","12级封顶"],col:3},//4
            {title:"超时扣分",type:1,content:["不扣分","3分钟","4分钟","5分钟"],col:3},//5
            {title:"扣分倍数",type:1,content:["3倍","6倍","9倍"],col:3},//6
        ];

        this.defaultConfig = [[0],[1],[0],[],[0],[0],[0]];

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
            if(params[1] == GameTypeEunmPK.CDTLJ){
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

        var is10ji = this.getItemByIdx(4,2).isSelected();
        this.getItemByIdx(3,1).setItemState(is10ji);
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

        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected())jushu = 4;
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

        var swdzssj = 0;
        if(this.getItemByIdx(3,1).isSelected()){
            swdzssj = 1;
        }

        var fengding = 0;
        var fengdingArr = [0,8,10,12];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                fengding = fengdingArr[i];
                break;
            }
        }

        var tuoguan =0;
        var timeArr = [0,180,240,300];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                tuoguan = timeArr[i];
                break;
            }
        }

        var koufen_beishu = 0;
        if(tuoguan > 0){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(6,i).isSelected()){
                    koufen_beishu = (i+1)*3;
                    break;
                }
            }
        }


        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.CDTLJ,//玩法ID 1
            costway,//支付方式 2
            0,// 3
            swdzssj,//四王定庄算十级 4
            yxcp,//允许查牌 5
            fengding,//封顶 6
            renshu,//人数 7
            tuoguan,//超时扣分 8
            koufen_beishu,//扣分倍数 9
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected())jushu = 4;
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
        //for(var i = 0;i<2;++i){
        //    if(this.getItemByIdx(2,i).isSelected()){
        //        renshu = 4-i;
        //        break;
        //    }
        //}
        return [GameTypeEunmPK.CDTLJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0]];

        defaultConfig[0][0] = params[0] == 8?2:params[0]==4?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;

        if(params[5] == "1")defaultConfig[3].push(0);
        if(params[4] == "1")defaultConfig[3].push(1);

        var fdArr = [0,8,10,12];
        var idx = ArrayUtil.indexOf(fdArr,params[6]);
        defaultConfig[4][0] = idx>0?idx:0;

        var timeArr = [0,180,240,300];
        var idx = ArrayUtil.indexOf(timeArr,params[8]);
        defaultConfig[5][0] = idx>0?idx:0;

        var bsArr = [3,6,9];
        var idx = ArrayUtil.indexOf(bsArr,params[9]);
        defaultConfig[6][0] = idx>0?idx:0;


        this.defaultConfig = defaultConfig;
    },
});