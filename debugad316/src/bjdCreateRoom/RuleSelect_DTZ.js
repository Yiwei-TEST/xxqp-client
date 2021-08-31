/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_DTZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);

        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},// 0
            {title:"游戏选择",type:1,content:["4人打筒子","3人打筒子","2人打筒子"]},// 1
            {title:"分数选择",type:1,content:["600分","1000分"]},// 2
            {title:"玩法选择",type:1,content:["三副牌","四副牌","快乐四喜"]},// 3
            {title:"终局奖励",type:1,content:["无奖励","100分","200分","300分","500分","800分","1000分"]},// 4
            {title:"可选",type:2,content:["可带牌","暗8张底牌","显示剩余牌","随机出头","王筒子","有牌必打"]},// 5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
        ];

        this.defaultConfig = [[1],[1],[0],[0],[0],[0,2,3],[0],[1]];
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
            if(params[1] == 113 || params[1] == 114 || params[1] == 115 || params[1] == 116 || params[1] == 117 || params[1] == 118
                || params[1] == 210 || params[1] == 211 || params[1] == 212){
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
        if(tag < 400){
            this.updateZsNum();
        }

        var tagArr = [100,101,102,300,301,302,501,504,600,601,602,603,604];
        if(ArrayUtil.indexOf(tagArr,tag) >= 0){
            this.updateItemShow();
        }
    },

    updateItemShow:function() {

        var idx1 = 0;
        var idx2 = 0;
        for (var i = 0; i < 3; ++i) {
            if (this.getItemByIdx(1, i).isSelected())idx1 = i;
            if (this.getItemByIdx(3, i).isSelected())idx2 = i;
        }


        //4人 3副牌 暗8张底牌 可带牌 托管 记牌器(显示剩余牌)
        //3人 3副牌 暗8张底牌 可带牌 托管 显示剩余牌 随机出头 王筒子
        //2人 3副牌 暗8张底牌 可带牌 托管 显示剩余牌 随机出头 王筒子 有牌必打

        //4人 4副牌 暗8张底牌 可带牌 托管 记牌器(显示剩余牌)
        //3人 4副牌 暗8张底牌 可带牌 托管 显示剩余牌 随机出头
        //2人 4副牌 暗8张底牌 可带牌 托管 显示剩余牌 随机出头 有牌必打

        //4人 快乐四喜 可带牌 托管 记牌器(显示剩余牌)
        //3人 快乐四喜 暗8张底牌 可带牌 托管 显示剩余牌 随机出头
        //2人 快乐四喜 暗8张底牌 可带牌 托管 显示剩余牌 随机出头 有牌必打

        var arr = [0, 1,2];
        if (!(idx1 == 0 && idx2 == 2)) {
            arr.push(1);//暗底牌选项
        }
        if (idx1 == 1 || idx1 == 2) {
            arr.push(3);//随机出头选项
        }
        if ((idx1 == 1 || idx1 == 2) && idx2 == 0) {
            arr.push(4);//王筒子选项
        }
        if (idx1 == 2) {
            arr.push(5);//有牌必打选项
        }
        for (var i = 0; i < this.layoutArr[5].itemArr.length; ++i) {
            var flag = ArrayUtil.indexOf(arr, i) >= 0;
            this.layoutArr[5].itemArr[i].setItemState(flag);
        }

        this.getItemByIdx(5,2).itemLabel.setString(idx1 == 0 ? "记牌器" : "显示剩余牌");
        if (idx1 != 0) {//2人3人默认选中暗牌选项
            this.getItemByIdx(5,1).setSelected(true);
        }

        var numConfig = [[8, 9, 66], [8, 52, 96], [8, 44, 88]];
        var darkNum = numConfig[idx2][idx1];

        if(this.getItemByIdx(5,4).isSelected()){
            darkNum += 6;
        }

        this.getItemByIdx(5,1).itemLabel.setString("暗" + darkNum + "张底牌");

        if(this.getItemByIdx(6,0).isSelected()){
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

        var zsNum = 3;
        var zsNumArr = [3,6];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(2,i);
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
            } else{
                zsNum = zsNumArr[temp]
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var fentype = 0;
        if(this.getItemByIdx(2,1).isSelected())fentype = 1;

        var paitype = 0;
        if(this.getItemByIdx(3,1).isSelected())paitype = 1;
        if(this.getItemByIdx(3,2).isSelected())paitype = 2;


        var configArr = [
            [{2:1500,3:1000,4:1000},{2:1500,3:1000,4:1000},{2:2000,3:1300,4:1000}],
            [{2:3000,3:2000,4:1500},{2:3000,3:2000,4:1500},{2:3500,3:2300,4:1800}]
        ]

        var num = configArr[fentype][paitype][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

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


        var maxScore = 600;
        if(this.getItemByIdx(2,1).isSelected())maxScore = 1000;

        var exScore = 0;
        var exScoreArr = [0,100,200,300,500,800,1000];
        for(var i = 0;i<7;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                exScore = exScoreArr[i];
                break;
            }
        }

        var isDark8 = 0;
        if(this.getItemByIdx(5,1).isSelected())isDark8 = 1;

        var isShowNumber = 0;
        if(this.getItemByIdx(5,2).isSelected())isShowNumber = 1;

        var isFirstOut = 0;
        if(this.getItemByIdx(5,3).isSelected())isFirstOut = 1;

        var isDaiPai = 0;
        if(this.getItemByIdx(5,0).isSelected())isDaiPai = 1;

        var isWangTongZi = 0;
        if(this.getItemByIdx(5,4).isSelected())isWangTongZi = 1;

        var isBida = 0;
        if(this.getItemByIdx(5,5).isSelected())isBida = 1;

        var autoPlay = 0;
        // if(this.getItemByIdx(5,1).isSelected())autoPlay = 1;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            autoPlay = 300;
        }
        var typeConfig = {4:[113,114,212],3:[115,116,211],2:[117,118,210]};
        var wanfaIdx = 0;
        if(this.getItemByIdx(3,1).isSelected())wanfaIdx = 1;
        if(this.getItemByIdx(3,2).isSelected())wanfaIdx = 2;
        var djtg = 1;
        if(this.getItemByIdx(7,1).isSelected())
            djtg = 2;
        else if(this.getItemByIdx(7,2).isSelected())
            djtg = 3;
        data.params = [
            30, // 0
            typeConfig[renshu][wanfaIdx], //1
            costWay,//2
            maxScore,//3
            exScore,//4
            isDark8,//5
            0,//6
            renshu,//7,
            isShowNumber,//8 
            isFirstOut , //9
            isBida,//10
            isWangTongZi,//11
            autoPlay,//12
            isDaiPai,//13
            wanfaIdx,//14
            djtg,//15
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
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

        var typeConfig = {4:[113,114,212],3:[115,116,211],2:[117,118,210]};
        var wanfaIdx = 0;
        if(this.getItemByIdx(3,1).isSelected())wanfaIdx = 1;
        if(this.getItemByIdx(3,2).isSelected())wanfaIdx = 2;

        return [typeConfig[renshu][wanfaIdx],costWay,30,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[1],[0],[0],[0],[],[0],[0]];

        defaultConfig[0][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[1][0] = params[7] == 3 ? 1 : params[7] == 2 ? 2 : 0;
        defaultConfig[2][0] = params[3] == 1000 ? 1 : 0;
        defaultConfig[3][0] = params[14] || 0;//暂时不知道怎么做
        defaultConfig[4][0] = params[4] == 100 ? 1 :params[4] == 200 ? 2 :params[4] == 300 ? 3 :params[4] == 500 ? 4
                            :params[4] == 800 ? 5:params[4] == 1000 ? 6:0;
        defaultConfig[6][0] = params[12]==1?1:params[12] == 300?4:params[12]/60;
        defaultConfig[7][0] = params[15]?params[15]-1:1;



        if(params[13] == "1")defaultConfig[5].push(0);
        // if(params[12] == "1")defaultConfig[5].push(1);
        if(params[5] == "1")defaultConfig[5].push(1);
        if(params[8] == "1")defaultConfig[5].push(2);
        if(params[9] == "1")defaultConfig[5].push(3);
        if(params[11] == "1")defaultConfig[5].push(4);
        if(params[10] == "1")defaultConfig[5].push(5);

        this.defaultConfig = defaultConfig;
    },
});