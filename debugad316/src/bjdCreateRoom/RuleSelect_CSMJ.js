/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_CSMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(13);
        this.createChangeScoreBox(15);//创建低于xx分加xx分
        this.getItemByIdx(15,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","12局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["六六顺","缺一色","板板胡","四喜","节节高","金童玉女","一枝花","中途四喜","中途六六顺","三同","假将胡","门清",
                "开四杠","起手和中途胡不算鸟分","\n全求人必须吊将","杠/补算分","门清自摸","中途解散算小胡分",
                "小胡自动胡","小胡固定2分","假将胡可抢放杠"],col:3},//3
            {title:"飘分",type:1,content:["不飘分","飘1分","飘2分","飘3分","自由飘分"],col:3},//4
            {title:"可选",type:2,content:["缺一门","不可吃","只能大胡","小胡自摸"]},//5
            {title:"抓鸟",type:1,content:["中鸟加分","中鸟翻倍","中鸟加倍"],col:3},//6
            {title:" ",type:1,content:["抓2鸟","抓4鸟","抓6鸟"],col:3},//7
            {title:" ",type:1,content:["鸟不落空","四八空鸟"],col:3},//8
            {title:"底分",type:1,content:["1分","2分","3分","5分"]},//9
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//10
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管","二局托管"],col:4},//11
            {title:"封顶",type:1,content:["不封顶","15分封顶","21分封顶","42分封顶","28分封顶"]},//12
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//13
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//14
            {title:"加分",type:2,content:["低于"]},//15
        ];

        this.defaultConfig = [[0],[1],[0],[0,1,2,3,10,13],[0],[],[0],[0],[0],[0],[0],[1],[0],[0],[0],[]];
        this.csDScore = parseInt(cc.sys.localStorage.getItem("CSMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("CSMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("CSMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.CSMJ){
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

        //小胡自摸和只能大胡两个选项只能同时选中一个
        if(tag == 502 && item.isSelected()){
            this.getItemByIdx(5,3).setSelected(false);
        }
        if(tag == 503 && item.isSelected()){
            this.getItemByIdx(5,2).setSelected(false);
        }

        if(tag == 311 && item.isSelected()){
            this.getItemByIdx(3,16).setSelected(false);
        }
        if(tag == 316 && item.isSelected()){
            this.getItemByIdx(3,11).setSelected(false);
        }
        
        this.updateItemShow();
    },

    updateItemShow:function(){
        this.getLayoutByIdx(13).visible = false;
        this.getLayoutByIdx(14).visible = false;

        var is2ren = false;
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[13].setVisible(true);
            if(this.getItemByIdx(13,0).isSelected()){
                this.layoutArr[14].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[14].setVisible(true);
                this.numBox.visible=true;

            }
            this.layoutArr[15].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(15,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            is2ren = true;
        }else{
            this.layoutArr[13].setVisible(false);
            this.layoutArr[14].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[15].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        //中鸟翻倍，中鸟加倍只能选2鸟
        //if(this.getItemByIdx(6,1).isSelected() || this.getItemByIdx(6,2).isSelected()){
        //    this.getItemByIdx(7,0).setSelected(true);
        //    this.getItemByIdx(7,1).setItemState(false);
        //    this.getItemByIdx(7,2).setItemState(false);
        //}else{
        //    this.getItemByIdx(7,1).setItemState(true);
        //    this.getItemByIdx(7,2).setItemState(true);
        //}

        this.layoutArr[5].setVisible(is2ren);

        for(var i = 0;i<this.layoutArr[5].itemArr.length;++i){
            this.layoutArr[5].itemArr[i].setItemState(is2ren);
        }

        //只有二人玩法有门清选项
        //this.getItemByIdx(3,11).setItemState(is2ren);
        //this.getItemByIdx(3,16).setItemState(is2ren);

        //选缺一门后没有金童玉女，三同
        var isqym = this.layoutArr[5].itemArr[0].isSelected();
        this.getItemByIdx(3,5).setItemState(!isqym);
        this.getItemByIdx(3,9).setItemState(!isqym);

        var is3ren = this.getItemByIdx(2,1).isSelected();
        this.layoutArr[8].setVisible(is3ren);

        for(var i = 0;i<this.layoutArr[8].itemArr.length;++i){
            this.layoutArr[8].itemArr[i].setItemState(is3ren);
        }

        var istg = !this.getItemByIdx(10,0).isSelected();
        this.layoutArr[11].setVisible(istg);
        this.getItemByIdx(11,0).setItemState(istg);
        this.getItemByIdx(11,1).setItemState(istg);

        var jjh = this.getItemByIdx(3,10).isSelected();
        this.getItemByIdx(3,20).setItemState(jjh);

        //this.layoutArr[12].visible = is2ren;
        //for(var i = 0;i<this.layoutArr[12].itemArr.length;++i){
        //    this.layoutArr[12].itemArr[i].setItemState(is2ren);
        //}
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [2,2,2];
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
                // zsNum = Math.ceil(zsNumArr[temp]/renshu);
                zsNum = 1;
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.csDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
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
        cc.log("this.csDScore =",this.csDScore);
        this.scoreLabel.setString("小于"+ this.csDScore + "分");
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

        

        var queYiSe = 0;
        if (this.getItemByIdx(3,1).isSelected()) queYiSe =1;
        var banbanHu = 0;
        if (this.getItemByIdx(3,2).isSelected()) banbanHu =1;
        var yiZhiHua = 0;
        if (this.getItemByIdx(3,6).isSelected()) yiZhiHua =1;
        var liuliuShun = 0;
        if (this.getItemByIdx(3,0).isSelected()) liuliuShun =1;
        var daSiXi = 0;
        if (this.getItemByIdx(3,3).isSelected()) daSiXi =1;
        var jinTongYuNu = 0;
        if (this.getItemByIdx(3,5).isSelected()) jinTongYuNu =1;
        var jieJieGao = 0;
        if (this.getItemByIdx(3,4).isSelected()) jieJieGao =1;
        var sanTong = 0;
        if (this.getItemByIdx(3,9).isSelected()) sanTong =1;
        var zhongTuLiuLiuShun = 0;
        if (this.getItemByIdx(3,8).isSelected()) zhongTuLiuLiuShun =1;
        var zhongTuSiXi = 0;
        if (this.getItemByIdx(3,7).isSelected()) zhongTuSiXi =1;
        var isCalcBanker = 0;
        var jiajianghu = 0;
        if (this.getItemByIdx(3,10).isSelected()) jiajianghu =1;

        var kePiao = 0;
        if (this.getItemByIdx(4,1).isSelected()) kePiao =2;
        else if(this.getItemByIdx(4,2).isSelected())kePiao=3;
        else if(this.getItemByIdx(4,3).isSelected())kePiao=4;
        else if(this.getItemByIdx(4,4).isSelected())kePiao = 1;

        var queyimeng = 0;
        if (this.getItemByIdx(5,0).isSelected()) queyimeng =1;
        var bukechi = 0;
        if (this.getItemByIdx(5,1).isSelected()) bukechi =1;
        var zhinengdahu = 0;
        if (this.getItemByIdx(5,2).isSelected()) zhinengdahu =1;
        var xiaohuzimo = 0;
        if (this.getItemByIdx(5,3).isSelected()) xiaohuzimo =1;
        
        var calcBird =1;
        if (this.getItemByIdx(6,1).isSelected()) calcBird =2;
        else if(this.getItemByIdx(6,2).isSelected()) calcBird =3;

        var birdNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                birdNum = 2 +2*i;
                break;
            }
        }

        var kongniao = 2;
        if(this.getItemByIdx(8,1).isSelected())kongniao = 1;

        var csIsDouble = 0;
        if(this.getItemByIdx(13,1).isSelected()){
            csIsDouble = 1;
        }
        var gpsWarn = 0;//无用
        var csDScore = 0;
        csDScore = this.csDScore;
        cc.sys.localStorage.setItem("CSMJ_diScore",csDScore);
        var csDoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(14,i).isSelected()){
                csDoubleNum = 2 + i;
                break;
            }
        }

        var difen = 1;
        if(this.getItemByIdx(9,1).isSelected())difen = 2;
        if(this.getItemByIdx(9,2).isSelected())difen = 3;
        if(this.getItemByIdx(9,3).isSelected())difen = 5;

        var csTuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                csTuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(10,4).isSelected()){
            csTuoguan = 300;
        }
        var csDjtg = 2;
        if (this.getItemByIdx(11,0).isSelected()){
            csDjtg = 1;
        }else if (this.getItemByIdx(11,2).isSelected()){
            csDjtg = 3;
        }else if (this.getItemByIdx(11,3).isSelected()){
            csDjtg = 4;
        }

        var menqing = 0;
        if(this.getItemByIdx(3,11).isSelected()){
            menqing = 1;
        }

        var kaisigang = 0;
        if(this.getItemByIdx(3,12).isSelected()){
            kaisigang = 1;
        }

        var qshbsnf = 0;
        if(this.getItemByIdx(3,13).isSelected()){
            qshbsnf = 1;
        }

        var qqrbxdj = 0;
        if(this.getItemByIdx(3,14).isSelected()){
            qqrbxdj = 1;
        }

        var gbsf = 0;
        if(this.getItemByIdx(3,15).isSelected()){
            gbsf = 1;
        }

        var menQingZM  = 0;
        if(this.getItemByIdx(3,16).isSelected()){
            menQingZM  = 1;
        }

        var ztjssxhf  = 0;
        if(this.getItemByIdx(3,17).isSelected()){
            ztjssxhf  = 1;
        }

        var xhzdh = 0;//小胡自动胡
        if(this.getItemByIdx(3,18).isSelected())xhzdh  = 1;

        var xhgd2f = 0;//小胡固定2分
        if(this.getItemByIdx(3,19).isSelected())xhgd2f  = 1;

        var jjhkqfg = 0;//假将胡可抢放杠
        if(this.getItemByIdx(3,20).isSelected())jjhkqfg  = 1;

        var fengding = 0;
        var fengdingArr = [0,15,21,42,28];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(12,i).isSelected()){
                fengding = fengdingArr[i];
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(15,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("CSMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("CSMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.CSMJ,//玩法ID 1
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
            kePiao,//可飘 16
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
            ztjssxhf,// 40 中途解散算小胡分
            xhzdh, //41 小胡自动胡
            xhgd2f, // 42 小胡固定2分
            jjhkqfg, // 43 假将胡可抢放杠
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushuArr = [8,12,16];
        var jushu = 8;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = jushuArr[i];
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
        return [GameTypeEunmMJ.CSMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[0],[],[0],[0],[0],[0],[0],[1],[0],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 16?2:params[0] == 12?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;
        defaultConfig[4][0] = params[16] == 1?4:params[16] == 2?1:params[16] == 3?2:params[16] == 4?3:0;
        defaultConfig[6][0] = params[3]-1;
        defaultConfig[7][0] = params[4] == 6?2:params[4] == 4?1:0;
        defaultConfig[8][0] = params[22] == 1?1:0;
        defaultConfig[9][0] = params[38] == 5?3:((params[38]-1) || 0);
        defaultConfig[10][0] = params[28]?params[28] == 300?4:params[28]/60:0;
        defaultConfig[11][0] = params[29]== 1 ? 0:params[29]== 2 ? 1:params[29]== 3 ? 2 : 3;//单局托管/整局/三局
        defaultConfig[12][0] = params[31] == 15?1:params[31]==21?2:params[31]==42?3:params[31]==28?4:0;
        defaultConfig[13][0] = params[19] == 1?1:0;
        defaultConfig[14][0] = params[21] -2;

        if(params[34] && parseInt(params[34]) > 0)defaultConfig[15].push(0);
        this.csDScore = parseInt(params[20]);
        
        if(params[9] == "1")defaultConfig[3].push(0);
        if(params[6] == "1")defaultConfig[3].push(1);
        if(params[17] == "1")defaultConfig[3].push(2);
        if(params[10] == "1")defaultConfig[3].push(3);
        if(params[12] == "1")defaultConfig[3].push(4);
        if(params[11] == "1")defaultConfig[3].push(5);
        if(params[8] == "1")defaultConfig[3].push(6);
        if(params[15] == "1")defaultConfig[3].push(7);
        if(params[14] == "1")defaultConfig[3].push(8);
        if(params[13] == "1")defaultConfig[3].push(9);
        if(params[27] == "1")defaultConfig[3].push(10);
        if(params[30] == "1")defaultConfig[3].push(11);
        if(params[32] == "1")defaultConfig[3].push(12);
        if(params[33] == "1")defaultConfig[3].push(13);
        if(params[37] == "1")defaultConfig[3].push(14);
        if(params[36] == "1")defaultConfig[3].push(15);
        if(params[39] == "1")defaultConfig[3].push(16);
        if(params[40] == "1")defaultConfig[3].push(17);
        if(params[41] == "1")defaultConfig[3].push(18);
        if(params[42] == "1")defaultConfig[3].push(19);
        if(params[43] == "1")defaultConfig[3].push(20);


        if(params[26] == "1")defaultConfig[5].push(0);
        if(params[23] == "1")defaultConfig[5].push(1);
        if(params[24] == "1")defaultConfig[5].push(2);
        if(params[25] == "1")defaultConfig[5].push(3);

        this.addScore = parseInt(params[34])||10;
        this.allowScore = parseInt(params[35])||10;
        this.defaultConfig = defaultConfig;
    },
});