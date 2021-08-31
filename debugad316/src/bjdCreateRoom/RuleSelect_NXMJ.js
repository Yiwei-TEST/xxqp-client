/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_NXMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(10);
        this.createChangeScoreBox(12);//创建低于xx分加xx分
        this.createSelectBox();
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["门清","平胡不接炮"],col:3},//3
            {title:"",type:1,content:["全开放","半开放"],col:3},//4
            {title:" ",type:1,content:["杠二选二","杠四选一"],col:3},//5
            {title:"抓鸟",type:1,content:["中鸟翻倍","中鸟加分"],col:3},//6
            {title:" ",type:1,content:["不抓鸟","抓1鸟","抓2鸟","抓4鸟","抓6鸟"],col:3},//7
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//8
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//9
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//10
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//11
            {title:"加分",type:2,content:["低于"]},//12
        ];

        this.defaultConfig = [[0],[1],[0,3],[0],[0],[0],[0],[0],[0],[0],[0],[0],[]];
        this.csDScore = parseInt(cc.sys.localStorage.getItem("NXMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("NXMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("NXMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.NXMJ){
                this.readSelectData(params);
            }
        }

        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    createChangeScoreBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.addNumBox = new changeEditBox(["",10,"分"],1);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.addNumBox.setWidgetPosition(850,0);//设置位置
        this.addNumBox.setScoreLabel(this.addScore);//设置初始值
        this.layoutArr[row].addChild(this.addNumBox);

        this.addLabel = UICtor.cLabel("加",38,null,cc.color(126,49,2));
        //this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",10,"分"],1);
        this.allowNumBox.setWidgetPosition(380,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }
        this.updateItemShow();
    },

    updateItemShow:function(){
        this.getLayoutByIdx(10).visible = false;
        this.getLayoutByIdx(11).visible = false;

        var is2ren = false;
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[10].setVisible(true);
            if(this.getItemByIdx(10,0).isSelected()){
                this.layoutArr[11].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[11].setVisible(true);
                this.numBox.visible=true;

            }
            this.layoutArr[12].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(12,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            is2ren = true;
        }else{
            this.layoutArr[10].setVisible(false);
            this.layoutArr[11].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[12].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        this.czSelectBox.visible = is2ren

        //中鸟翻倍，中鸟加倍只能选2鸟
        //if(this.getItemByIdx(6,1).isSelected() || this.getItemByIdx(6,2).isSelected()){
        //    this.getItemByIdx(7,0).setSelected(true);
        //    this.getItemByIdx(7,1).setItemState(false);
        //    this.getItemByIdx(7,2).setItemState(false);
        //}else{
        //    this.getItemByIdx(7,1).setItemState(true);
        //    this.getItemByIdx(7,2).setItemState(true);
        //}

        //只有二人玩法有门清选项
        //this.getItemByIdx(3,11).setItemState(is2ren);
        //this.getItemByIdx(3,16).setItemState(is2ren);
        //
        ////选缺一门后没有金童玉女，三同
        //var isqym = this.layoutArr[5].itemArr[0].isSelected();
        //this.getItemByIdx(3,5).setItemState(!isqym);
        //this.getItemByIdx(3,9).setItemState(!isqym);

        var istg = !this.getItemByIdx(8,0).isSelected();
        this.layoutArr[9].setVisible(istg);
        this.getItemByIdx(9,0).setItemState(istg);
        this.getItemByIdx(9,1).setItemState(istg);

    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        if(this.getItemByIdx(0,1).isSelected())zsNum = 10;

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
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000,4:1500},{2:5000,3:3300,4:2500}
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.csDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    createSelectBox:function(){
        if(this.layoutArr[6]){
            this.pnSelectBox = new SelectBox(2,"飘鸟");
            this.layoutArr[6].addChild(this.pnSelectBox);
            this.pnSelectBox.x = 980;
            this.layoutArr[6].itemArr.push(this.pnSelectBox)
            this.pnSelectBox.setSelected(this.defaultConfig[6][1])
        }
        if(this.layoutArr[2]){
            this.czSelectBox = new SelectBox(2,"抽40张");
            this.layoutArr[2].addChild(this.czSelectBox,2);
            this.czSelectBox.x = 1050;
            this.layoutArr[2].itemArr.push(this.czSelectBox)
            this.czSelectBox.setSelected(this.defaultConfig[2][1])
        }
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.csDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.csDScore = num - 5;
            }else{
                this.csDScore = num;
            }
        }else if ( num < 10){
            this.csDScore = 5;
        }
        this.scoreLabel.setString("小于"+ this.csDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = 8 + 8*i;
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

        var zhongTuLiuLiuShun = 0;
        var zhongTuSiXi = 0;
        var isCalcBanker = 0;
        var jiajianghu = 0;
        var queyimeng = 0;
        var bukechi = 0;
        var zhinengdahu = 0;
        var xiaohuzimo = 0;

        var liuliuShun = 0;
        var queYiSe = 0;
        var banbanHu = 0;
        var daSiXi = 0;
        var jieJieGao = 0;
        var jinTongYuNu = 0;
        var yiZhiHua = 0;
        var sanTong = 0;
        var yidianhong = 0
        if (this.getItemByIdx(4,1).isSelected()){
            queYiSe = 1;
            banbanHu = 1;
            yiZhiHua = 1;
        }else{
            queYiSe = 1;
            banbanHu = 1;
            yiZhiHua = 1;
            liuliuShun = 1;
            daSiXi = 1;
            jieJieGao = 1;
            jinTongYuNu = 1;
            sanTong = 1;
            yidianhong = 1;
        }


        var calcBird =1;
        if (this.getItemByIdx(6,1).isSelected()) calcBird =2;
        var kePiao = 0;
        if(this.pnSelectBox.isSelected()) kePiao = 1

        var birdNum = 0;
        var birdArr = [0,1,2,4,6]
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                birdNum = birdArr[i];
                break;
            }
        }

        var csIsDouble = 0;
        if(this.getItemByIdx(10,1).isSelected()){
            csIsDouble = 1;
        }
        var gpsWarn = 0;//无用
        var csDScore = 0;
        csDScore = this.csDScore;
        cc.sys.localStorage.setItem("NXMJ_diScore",csDScore);
        var csDoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                csDoubleNum = 2 + i;
                break;
            }
        }

        var difen = 1;

        var csTuoguan =0;
        var tuoguanArr = [0,60,120,180,300]
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                csTuoguan = tuoguanArr[i];
                break;
            }
        }
        var csDjtg = 2;
        if (this.getItemByIdx(9,0).isSelected()){
            csDjtg = 1;
        }else if (this.getItemByIdx(9,2).isSelected()){
            csDjtg = 3;
        }

        var phbjp = 0;//平胡不接炮
        if(this.getItemByIdx(3,1).isSelected()){
            phbjp = 1;
        }

        var menqing = 0;//门清
        var qshbsnf = 0;
        var qqrbxdj = 0;
        var gbsf = 0;
        var fengding = 0;
        var kongniao = 0;
        var menQingZM  = 0;
        if(this.getItemByIdx(3,0).isSelected()){
            menQingZM = 1;
        }
        var kaisigang = 0
        if(this.getItemByIdx(5,1).isSelected()){
            kaisigang = 1;
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(12,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("NXMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("NXMJ_allowBoxScore",allowScore);

        var chou40zhang = 0;
        if(this.getItemByIdx(2,3).isSelected() && this.getItemByIdx(2,2).isSelected()) chou40zhang = 1;

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.NXMJ,//玩法ID 1
            costway,//支付方式 2
            calcBird,//鸟分 1乘法 2加法 3
            birdNum,//抓鸟数 4
            gpsWarn,//gps 无用 5
            queYiSe,//缺一色 6
            renshu,//人数 7
            yiZhiHua,//一枝花 8
            liuliuShun,//六六顺 9
            daSiXi,//大四喜 10
            jinTongYuNu,//金童玉女 11
            jieJieGao,//节节高 12
            sanTong ,//三同 13
            zhongTuLiuLiuShun,//中途六六顺 14
            zhongTuSiXi,//中途四喜 15
            kePiao,//可飘 飘鸟 16
            banbanHu,//板板胡 17
            isCalcBanker,//庄闲算分 18
            csIsDouble,// 是否加倍 19
            csDScore,// 加倍分 20
            csDoubleNum,// 加倍数 21
            kongniao,//空鸟选择 22
            bukechi,//不能吃 23
            zhinengdahu,//只能大胡 24
            xiaohuzimo,//小胡自摸 25
            queyimeng,//缺一门 26
            jiajianghu,//假将胡 27
            csTuoguan,//托管时间//28
            csDjtg,//单局托管，和整局托管//29
            menqing,//门清30
            fengding,//封顶31
            kaisigang,//开四杠32
            qshbsnf,//起手和中途胡不算鸟分33
            morefen,//34 "加xx分"
            allowScore,//35 "低于xx分"
            gbsf,//36 杠补算分
            qqrbxdj,//37 全求人必须吊将
            difen,//38 底分
            menQingZM,//39门清自摸
            phbjp,//40平胡不接炮
            chou40zhang,//41抽40张
            yidianhong,//42一点红
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
        return [GameTypeEunmMJ.NXMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[0],[0],[0],[0],[0],[0],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 16?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;
        if(params[41] == 1)defaultConfig[2][1] = 3;

        if(params[39] == "1")defaultConfig[3].push(0);
        if(params[40] == "1")defaultConfig[3].push(1);

        defaultConfig[4][0] = params[9] == 1?0:1;
        defaultConfig[5][0] = params[32];
        defaultConfig[6][0] = params[3]-1;
        if(params[16] == 1)defaultConfig[6][1] = 2;
        defaultConfig[7][0] = params[4] == 6 ? 4 : params[4] == 4 ? 3 : params[4];
        defaultConfig[8][0] = params[28]?params[28] == 300?4:params[28]/60:0;
        defaultConfig[9][0] = params[29]== 1 ? 0:params[29]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[10][0] = params[19] == 1?1:0;
        defaultConfig[11][0] = params[21] -2;
        if(params[34] && parseInt(params[34]) > 0)defaultConfig[12].push(0);
        this.csDScore = parseInt(params[20]);

        this.addScore = parseInt(params[34])||10;
        this.allowScore = parseInt(params[35])||10;
        this.defaultConfig = defaultConfig;
    },
});