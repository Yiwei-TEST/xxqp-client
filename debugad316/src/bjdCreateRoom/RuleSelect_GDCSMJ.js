/**
 * Created by Administrator on 2019/11/9.
 */
var RuleSelect_GDCSMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(12);
        this.createNewBox(8);
        this.createChangeScoreBox(14);//创建低于xx分加xx分
        this.getItemByIdx(14,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"玩法",type:2,content:["无字(100张)","无风(108张)","必胡"],col:3},//3
            //{title:"胡牌",type:1,content:["吃胡","自摸"]},//4
            {title:"",type:2,content:["10倍不计分","跟庄1分"],col:3},//4
            //{title:"",type:1,content:["鸡胡可吃胡","鸡胡不可吃胡"],col:3},//6
            {title:"结算",type:2,content:["流局算杠","吃杠杠爆全包","连庄"],col:3},//5
            {title:"封顶",type:1,content:["封顶10倍","不设封顶"]},//6
            {title:"翻鬼",type:1,content:["翻鬼","不翻鬼"]},//7
            {title:"奖马",type:1,content:["无马","2马","5马","8马"],col:3},//8
            {title:"买马",type:1,content:["无马","1马","2马"]},//9
            {title:"托管",type:1,content:["不托管","10秒","15秒","30秒"],col:4},//10
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//11
            {title:"玩法选择",type:1,content:["不加倍","加倍"],col:3},//12
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//13
            {title:"加分",type:2,content:["低于"]}//14
        ];

        this.defaultConfig = [[0],[1],[0],[2],[],[0,1,2],[0],[1],[0],[0],[0],[1],[0],[0],[]];
        this.zzDScore = parseInt(cc.sys.localStorage.getItem("GDCSMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("GDCSMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("GDCSMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.GDCSMJ){
                this.readSelectData(params);
            }
        }

        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    createNewBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        var num = cc.sys.localStorage.getItem("GDCSMJ_MAGENGANG") || this.nblkScore;
        this.newBoxType2 = new SelectBox(2,"马跟杠");
        this.newBoxType2.setPosition(595,-50);//设置位置
        this.layoutArr[row].addChild(this.newBoxType2);
        this.newBoxType2.setSelected(num == 1);
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
        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[12].setVisible(true);
            if(this.getItemByIdx(12,0).isSelected()){
                this.layoutArr[13].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[13].setVisible(true);
                this.numBox.visible=true;
            }
            this.layoutArr[14].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(14,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            this.layoutArr[9].setVisible(false);
        }else{
            this.layoutArr[9].setVisible(true);
            this.layoutArr[12].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[14].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if(this.getItemByIdx(10,0).isSelected()){
            this.layoutArr[11].visible = false;
        }else{
            this.layoutArr[11].visible = true;
        }

        this.newBoxType2.visible = !this.getItemByIdx(8,0).isSelected();//无马，没有马跟杠

        if(this.getItemByIdx(2,0).isSelected()){
            this.getItemByIdx(4,1).setItemState(true);//有跟庄+1
        }else{
            this.getItemByIdx(4,1).setItemState(false);//没有跟庄+1
        }

        //if(this.getItemByIdx(4,0).isSelected()){//吃胡
        //    this.layoutArr[6].visible = true;
        //   this.getItemByIdx(5,0).setItemState(false);//没有10倍计分
        //}else{
        //   this.getItemByIdx(5,0).setItemState(true);
        //    this.layoutArr[6].visible = false;
        //}

        if(!this.tempData){
            this.tempData = [false,false];//记录可以无字、无风
        }

        if(this.getItemByIdx(3,0).isSelected() && this.getItemByIdx(3,1).isSelected()){ //无字、无风 只能二选一
            if(this.tempData[0] && !this.tempData[1]){
                this.getItemByIdx(3,0).setSelected(false);
            }else  if(!this.tempData[0] && this.tempData[1]){
                this.getItemByIdx(3,1).setSelected(false);
            }
        }
        this.tempData[0] = this.getItemByIdx(3,0).isSelected();
        this.tempData[1] = this.getItemByIdx(3,1).isSelected();
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [5,10];
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
            if(this.getItemByIdx(0,0).isSelected()){
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.zzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.zzDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.zzDScore = num - 5;
            }else{
                this.zzDScore = num;
            }
        }else if ( num < 10){
            this.zzDScore = 5;
        }
        this.scoreLabel.setString("小于"+ this.zzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};

        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 16;
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

        var wuzi = 0;
        var wufeng = 0;
        if(this.getItemByIdx(3,0).isSelected()){
            wuzi = 1;
            wufeng = 0;
        }else if(this.getItemByIdx(3,1).isSelected()){
            wuzi = 0;
            wufeng = 1;
        }

        var bihu = this.getItemByIdx(3,2).isSelected() ? 1 : 0;//必胡

        //var chihu = this.getItemByIdx(4,0).isSelected() ? 1 : 0;//吃胡 / 自摸
        //if(this.getItemByIdx(4,0).isSelected()){
        //    chihu = this.getItemByIdx(6,0).isSelected() ? 1 : 2;
        //}

        var sbbjf = this.getItemByIdx(4,0).isSelected() ? 1 : 0;//10倍不计分
        //if(this.getItemByIdx(4,1).isSelected()){
        //    sbbjf = this.getItemByIdx(5,0).isSelected() ? 1 : 0;
        //}

        var genzhuang = this.getItemByIdx(4,1).isSelected() ? 1 : 0;//跟庄+1
        if(renshu != 4){//不是四人，没有跟庄
            genzhuang = 0;
        }
        var ljsg = this.getItemByIdx(5,0).isSelected() ? 1 : 0;//流局算杠
        var cggbqb = this.getItemByIdx(5,1).isSelected() ? 1 : 0;//吃杠杠爆全包
        var lianzhuan = this.getItemByIdx(5,2).isSelected() ? 1 : 0;//连庄

        var fengding = this.getItemByIdx(6,0).isSelected() ? 1 : 0;//10被封顶，不封顶

        var fangui = this.getItemByIdx(7,0).isSelected() ? 1 : 0;//翻鬼,不翻鬼

        var maArr = [0,2,5,8];
        var mashu = 0;
        for(var i = 0;i<maArr.length;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                mashu = maArr[i];
                break;
            }
        }

        var magenGang = this.newBoxType2.isSelected() ? 1 : 0;
        if(mashu == 0){//没有奖马就没有马跟杠
            magenGang = 0;
        }
        cc.sys.localStorage.setItem("GDCSMJ_MAGENGANG",magenGang);
        var maima = 0;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                maima = i;
                break;
            }
        }
        if(renshu == 2){//2人不买马
            maima = 0;
        }

        var csTuoguan =0;
        var timeArr = [0,10,15,30];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                csTuoguan = timeArr[i];
                break;
            }
        }

        var Djtg = 1;
        if(this.getItemByIdx(11,1).isSelected())
            Djtg = 2;
        else if(this.getItemByIdx(11,2).isSelected())
            Djtg = 3;

        var IsDouble = 0;
        if(this.getItemByIdx(12,1).isSelected()){
            IsDouble = 1;
        }

        var DScore = this.zzDScore;
        cc.sys.localStorage.setItem("GDCSMJ_diScore",DScore);
        var DoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(13,i).isSelected()){
                DoubleNum = 2 + i;
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(14,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("GDCSMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("GDCSMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.GDCSMJ,//玩法ID 1
            costway,//支付方式 2
            0,//  *****  无用占位  3
            mashu,// 4 奖马 0 2 5 8
            0,// 5 *****  无用占位
            0,// 6 *****  无用占位
            renshu,//人数 7
            0,// 8 *****  无用占位
            0,// 9 *****  无用占位
            0,// 10 *****  无用占位
            0,// 11 *****  无用占位
            0,// 12 *****  无用占位
            0,// 13 *****  无用占位
            0,// 14 *****  无用占位
            0,// 15 *****  无用占位
            0,// 16 *****  无用占位
            0,// 17 *****  无用占位
            0,  //  *****  无用占位  18
            IsDouble,// 是否加倍 19
            DScore,// 加倍分 20
            DoubleNum,// 加倍数 21
            wuzi,  //  22  无字
            wufeng,  //  23 无风
            0,  //  24 *****  无用占位
            0,  //  25 *****  无用占位
            ljsg,  //  26 流局算杠
            sbbjf,  // 27 10倍不计分
            csTuoguan,//托管时间  28
            Djtg,//单局托管 29
            bihu,  //  30 有胡必胡
            fengding,//31 封顶
            genzhuang,//32 跟庄1分
            cggbqb,//33 吃杠杠爆全包
            morefen,//34 "加xx分"
            allowScore,//35 "低于xx分"
            lianzhuan,//36 连庄
            fangui,//37 翻鬼
            magenGang,// 38 马跟杠
            maima//39 买马 0,1,2
        ];

        cc.log("data.params =",JSON.stringify(data.params[37]));
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 16;
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
        return [GameTypeEunmMJ.GDCSMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        //cc.log("readSelectData in GDCSMJ =",JSON.stringify(params));
        var defaultConfig = [[0],[1],[0],[],[],[],[0],[1],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 8 ? 0 : 1;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0: parseInt(params[2]) - 1;//房费
        defaultConfig[2][0] = params[7] == 4 ? 0 : params[7] == 3 ? 1 : 2;//人数

        if(params[22]=="1")defaultConfig[3].push(0);//无字
        if(params[23] == "1")defaultConfig[3].push(1);//无风
        if(params[30] == "1")defaultConfig[3].push(2);//有胡必胡

        //defaultConfig[4][0] = params[25] == 0 ? 1 : 0;//吃胡、自摸

        if(params[27]=="1")defaultConfig[4].push(0);//10倍不计分
        if(params[32] == "1")defaultConfig[4].push(1);//跟庄1分

        //defaultConfig[6][0] = params[25] == 2 ? 1 : 0;//1鸡胡可吃胡2鸡胡不能吃胡

        if(params[26]=="1")defaultConfig[5].push(0);//流局算杠
        if(params[33] == "1")defaultConfig[5].push(1);//吃杠杠爆全包
        if(params[36]=="1")defaultConfig[5].push(2);//连庄

        defaultConfig[6][0] = params[31] == 1 ? 0 : 1;//封顶
        defaultConfig[7][0] = params[37] == 1 ? 0 : 1;//翻鬼

        var maArr = [0,2,5,8];
        var index = maArr.indexOf(parseInt(params[4]));
        defaultConfig[8][0] = index != -1 ? index : 0;//奖马
        this.nblkScore = params[38] == 1 ? 1 : 0;//马跟杠

        defaultConfig[9][0] = params[39] == 1 ? 1 : (params[39] == 2 ? 2 : 0);//买马

        var timeArr = [0,10,15,30];
        var localIndex = timeArr.indexOf(parseInt(params[28]));
        defaultConfig[10][0] = localIndex != -1 ? localIndex : 0;//托管时间
        defaultConfig[11][0] = params[29]== 1 ? 0:params[29]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[12][0] = params[19] == 0 ? 0 : 1;
        defaultConfig[13][0] = params[21] - 2;
        if(params[34] && parseInt(params[34]) > 0)defaultConfig[14].push(0);
        this.zzDScore = parseInt(params[20]);
        this.allowScore = parseInt(params[35])||10;
        this.addScore = parseInt(params[34])||10;
        this.defaultConfig = defaultConfig;
    },
});