/**
 * Created by Administrator on 2019/9/6.
 */

/**
 * Created by Administrator on 2019/9/6.
 */
var RuleSelect_ZZPH = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(12);
        this.createChangeScoreBox(14);//创建低于xx分加xx分
        this.getItemByIdx(14,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["4局","8局","16局"]},//1
            {title:"人数",type:1,content:["4人","3人","2人"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//3
            {title:"胡牌",type:1,content:["强制胡牌","不强制"]},//4
            {title:"坐庄",type:1,content:["先进房坐庄","随机坐庄"]},//5
            {title:"中庄",type:1,content:["连庄","中庄*2","不连庄不中庄"],col:3},//6
            {title:"高级",type:2,content:["开始后打乱位置","无对","反中庄","打鸟玩法"],col:3},//7
            {title:"打鸟",type:1,content:["有庄有鸟(3/6分)","围鸟(3/6分)","围鸟加鸟(8/16分)","自由压鸟(3/5/6/10分)"],col:2},//8
            {title:"小七",type:1,content:["小七对带坎","小七对不带坎"],col:3},//9
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//10
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//11
            {title:"加倍",type:1,content:["不加倍","加倍"]},//12
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//13
            {title:"加分",type:2,content:["低于"]},//14
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];
        this.ZZPHDScore = parseInt(cc.sys.localStorage.getItem("ZZPH_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("ZZPH_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("ZZPH_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmZP.ZZPH){
                this.readSelectData(params);
            }
        }

        return true;
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
        this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",10,"分"],1);
        this.allowNumBox.setWidgetPosition(380,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
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
        BoxBg.x = 400 + (788/(this.layoutArr[row].itemArr.length));

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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.ZZPHDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.ZZPHDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.ZZPHDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.ZZPHDScore + "分");
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
            this.layoutArr[3].setVisible(true);
            this.layoutArr[12].setVisible(true);
            if(this.getItemByIdx(12,0).isSelected()){
                this.layoutArr[13].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[13].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[14].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(14,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[3].setVisible(false);
            this.layoutArr[12].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.layoutArr[14].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(10,0).isSelected()){
            this.layoutArr[11].setVisible(false);
        }else{
            this.layoutArr[11].setVisible(true);
        }

        if(this.getItemByIdx(7,3).isSelected()){
            this.layoutArr[8].setVisible(true);
        }else{
            this.layoutArr[8].setVisible(false);
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [3,5,10];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        for(var i = 0;i<3;++i){
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
        var jushu = 4;
        var jushuArr = [4,8,16];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
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

        var choupai = 0;//抽牌
        if(this.getItemByIdx(2,2).isSelected()){
            var choupaiArr = [0,10,20];
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(3,i).isSelected()){
                    choupai = choupaiArr[i];
                    break;
                }
            }
        }
        var hupai = 1;
        if(this.getItemByIdx(4,1).isSelected()) hupai=2;
        var zhuang = 1;//坐庄
        if(this.getItemByIdx(5,1).isSelected()) zhuang = 2;
        var zhongzhuang = 1;
        if(this.getItemByIdx(6,1).isSelected()) zhongzhuang=2;
        if(this.getItemByIdx(6,2).isSelected()) zhongzhuang=3;

        var randomSeat = 0;
        if(this.getItemByIdx(7,0).isSelected()) randomSeat=1;
        var noDui = 0;
        if(this.getItemByIdx(7,1).isSelected()) noDui=1;
        var fanZhongZhuang = 0;
        if(this.getItemByIdx(7,2).isSelected()) fanZhongZhuang=1;
        var isdaNiao = 0;
        if(this.getItemByIdx(7,3).isSelected()) isdaNiao=1;
        var daNiaoWF = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(8,i).isSelected()){
                daNiaoWF = i+1;
                break;
            }
        }

        var xqd = 1;
        if(this.getItemByIdx(9,1).isSelected()) xqd=2;


        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(10,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(11,0).isSelected()){
            djtg = 1;
        } else if (this.getItemByIdx(11,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(12,1).isSelected())isDouble = 1;

        var dScore = this.ZZPHDScore;
        cc.sys.localStorage.setItem("ZZPH_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,2).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(13,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }
        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(14,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.log("autoPlay =",autoPlay);
        cc.sys.localStorage.setItem("ZZPH_addBoxScore",morefen);
        cc.sys.localStorage.setItem("ZZPH_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.ZZPH,//玩法ID 1
            costWay,//支付方式 2
            choupai,//抽牌 3
            hupai,//强制胡牌 1强制 2不强制 4
            zhuang,//坐庄 2先进房坐庄 2随机 5
            zhongzhuang,//中庄 1连庄 2中庄x2 3不连庄不中庄 6
            renshu,//人数 7
            autoPlay,//托管时间 8
            djtg,//单局托管 9
            isDouble,//是否翻倍 10
            dScore,//翻倍上限 11
            doubleNum,//翻倍倍数 12
            allowScore,//13 低于 xx分
            morefen,//14 加xx分
            randomSeat,//15 打乱位置
            noDui,//16 无对
            fanZhongZhuang,//17 反中庄
            isdaNiao,//18 0不勾选 1勾选
            daNiaoWF,//19 1有庄有鸟  2围鸟 3围鸟加鸟 4自由压鸟 打鸟玩法
            xqd,//20 小七对 1带坎 2不带坎 
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 4;
        var jushuArr = [4,8,16];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
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

        return [GameTypeEunmZP.ZZPH,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[2] == 3||params[2] == 4?0:parseInt(params[2]) - 1;//房费
        defaultConfig[1][0] = params[0] == 16?2:params[0] == 8?1:0;//局数
        defaultConfig[2][0] = params[7] == 3?1:params[7] == 2?2:0;//人数
        defaultConfig[3][0] = params[3] == 0?0:(params[3] == 10 ? 1 : 2);//抽牌
        defaultConfig[4][0] = parseInt(params[4])-1;
        defaultConfig[5][0] = parseInt(params[5])-1;
        defaultConfig[6][0] = parseInt(params[6])-1;
        defaultConfig[8][0] = params[19]?parseInt(params[19])-1:0;
        defaultConfig[9][0] = params[20]?parseInt(params[20])-1:0;
        defaultConfig[10][0] = params[8] == 300?4:params[8]/60;//托管时间
        defaultConfig[11][0] = params[9]== 1 ? 0:params[9]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[12][0] = params[10]== 1 ? 1:0;//是否翻倍
        defaultConfig[13][0] = parseInt(params[12]) - 2 >= 0 ? parseInt(params[12]) - 2 : 0;//翻倍数

        if(params[15] == 1)
            defaultConfig[7].push(0);
        if(params[16] == 1)
            defaultConfig[7].push(1);
        if(params[17] == 1)
            defaultConfig[7].push(2);
        if(params[18] == 1)
            defaultConfig[7].push(3);

        if(params[13] && params[13] != 0 && params[14] && params[14] != 0){
            defaultConfig[14].push(0);
        }

        this.zhzDScore = params[11]?parseInt(params[11]):10;//多少分翻倍

        this.allowScore = parseInt(params[13])||10;
        this.addScore = parseInt(params[14])||10;

        this.defaultConfig = defaultConfig;
    },
});