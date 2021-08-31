/**
 * Created by cyp on 2019/3/21.
 */
var RuleSelect_HZMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(13);
        //暂时隐藏有炮必胡的选项
        // this.getItemByIdx(3,4).visible = false;
        // this.getItemByIdx(3,7).x = this.getItemByIdx(3,6).x;
        // this.getItemByIdx(3,7).y = this.getItemByIdx(3,6).y;
        // this.getItemByIdx(3,6).x = this.getItemByIdx(3,5).x;
        // this.getItemByIdx(3,6).y = this.getItemByIdx(3,5).y;
        // this.getItemByIdx(3,5).x = this.getItemByIdx(3,4).x;
        this.createChangeScoreBox(15);//创建低于xx分加xx分
        this.getItemByIdx(15,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1局","6局","8局","12局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"可选",type:2,content:["庄闲（算分）","点炮胡","抢杠胡","抢杠包三家","有炮必胡","可胡七对",
                "无红中自摸+1分","无红中接炮+1分","无红中得分翻倍", "自摸算1分","不中鸟算全中","起手四红中可胡",
                "八红中","自摸必胡","有红中不可接炮","不能一炮多响","中途解散算杠分"],col:3},//3
            {title:"",type:2,content:["七对、碰碰胡、清一色+1分"],col:3},//4
            {title:"玩法选择",type:1,content:["不抓鸟","抓2鸟","抓4鸟","抓6鸟","一鸟全中","窝窝鸟"],col:3},//5
            {title:"玩法选择",type:2,content:["159中鸟"]},//6
            {title:"玩法选择",type:1,content:["中鸟+1分","中鸟+2分","中鸟翻倍"],col:3},//7
            {title:"玩法选择",type:1,content:["无红中鸟+0","无红中鸟+1","无红中鸟+2"],col:3},//8
            {title:"飘分",type:1,content:["不飘分","自由飘分","首局定飘","1分","2分","3分"],col:3},//9
            {title:"底分",type:1,content:["1分","2分","3分","5分","10分"]},//10
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//11
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//12
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//13
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//14
            {title:"加分",type:2,content:["低于"]},//15
        ];

        this.defaultConfig = [[0],[1],[0],[],[],[0],[],[0],[1],[0],[0],[0],[1],[0],[0],[]];
        this.hzDScore = parseInt(cc.sys.localStorage.getItem("HZMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("HZMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("HZMJ_allowBoxScore")) || 10;/** 低于xx分 **/

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
            if(params[1] == GameTypeEunmMJ.HZMJ){
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
        cc.log("changeHandle in RuleSelect_HZMJ")
        var tag = item.getTag();
        cc.log("changeHandle tag",tag);
        if(tag < 300){
            this.updateZsNum();
        }
        // //2人显示加倍、不加倍按钮
        // if (item == this.getItemByIdx(2,2)){
        //     this.getLayoutByIdx(8).visible = true;
        // }else if (item == this.getItemByIdx(2,0) || item == this.getItemByIdx(2,1)){
        //     this.getLayoutByIdx(8).visible = false;
        //     this.getLayoutByIdx(9).visible = false
        // }
        // // 加倍显示翻几倍按钮
        // if (item == this.getItemByIdx(8,1)){
        //     this.getLayoutByIdx(9).visible = true;
        // }else if (item == this.getItemByIdx(8,0)){
        //     this.getLayoutByIdx(9).visible = false;
        // }

        //抓2只，4只，6只鸟， 159中鸟
        if (item == this.getItemByIdx(5,1) ||item == this.getItemByIdx(5,2) ||item == this.getItemByIdx(5,3) ){
            this.getItemByIdx(6,0).setSelected(true);
        }else if(item == this.getItemByIdx(5,0) ||item == this.getItemByIdx(5,4)){
            this.getItemByIdx(6,0).setSelected(false);
        }
        //159中鸟不可点
        if (item == this.getItemByIdx(6,0)){
            item.setSelected(!item.isSelected());
        }

        //加倍分数框
        if(item == this.getItemByIdx(12,1)){
            this.numBox.visible = true;
        } else if(item == this.getItemByIdx(12,0)){
            this.numBox.visible = false;
        }

        // 没有选择点跑胡玩法时 有炮必胡无法点击
        if(item == this.getItemByIdx(3,4)){
            if (!this.getItemByIdx(3,1).isSelected()){
                item.setSelected(!item.isSelected());
            }
        }

        if(item == this.getItemByIdx(3,1)) {
            if (!this.getItemByIdx(3,1).isSelected()){
                this.getItemByIdx(3,4).setSelected(false);
            }
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        // cc.log("updateItemShow in RuleSelect_HZMJ")
        this.getLayoutByIdx(13).visible = false;
        this.getLayoutByIdx(14).visible = false;
        if (this.getItemByIdx(11,0).isSelected()){
            this.layoutArr[12].visible = false;
        }else{
            this.layoutArr[12].visible = true;
        }
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
        }else{
            this.layoutArr[13].setVisible(false);
            this.layoutArr[14].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[15].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        var isshow = false;
        for(var i = 1;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                isshow = true;
                break;
            }
        }
        this.getItemByIdx(3,10).setItemState(isshow);

        var dianpaohu = this.getItemByIdx(3,1).isSelected();
        this.getItemByIdx(3,14).setItemState(dianpaohu);

    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [1,2,2,2,2];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        for(var i = 0;i<5;++i){
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
        for(var i = 0;i<5;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000,4:1500},{2:3000,3:2000,4:1500},{2:3000,3:2000,4:1500},{2:4500,3:3000,4:2300},{2:5000,3:3300,4:2500}
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.hzDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.hzDScore;
        // cc.log("temp =,num = ",temp,num);
        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }
        // cc.log("num && num >= 10 && num < 40 ",num && num >= 10 && num < 40)
        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.hzDScore = num - 5;
            }else{
                this.hzDScore = num;
            }
        }else if ( num < 10){
            this.hzDScore = 5;
        }
        cc.log("this.hzDScore =",this.hzDScore);
        this.scoreLabel.setString("小于"+ this.hzDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushuArr = [1,6,8,12,16];
        var jushu = 6;
        for(var i = 0;i<5;++i){
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


        var hzNiao = 0;
        for(var i = 0; i < 6; i ++){
            if(this.getItemByIdx(5,i).isSelected()){
                hzNiao = i*2;
                break;
            }
        }

        var hzZmh = 1;
        if(this.getItemByIdx(3,1).isSelected()){
            hzZmh = 0;
        }

        var hzZhuangXian = 0;
        if(this.getItemByIdx(3,0).isSelected()){
            hzZhuangXian = 1;
        }
        var hzKhqd = 0;
        if(this.getItemByIdx(3,5).isSelected()){
            hzKhqd = 1;
        }
        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }
        var hzTuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                hzTuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(11,4).isSelected()){
            hzTuoguan = 300;
        }
        var hzQgh = 0;
        if(this.getItemByIdx(3,2).isSelected()){
            hzQgh = 1;
        }
        var hzQghbsj = 0;
        if(this.getItemByIdx(3,3).isSelected()){
            hzQghbsj = 1;
        }
        var zjjj =0;
        var ynqz = 0;
        if(hzNiao == 8)ynqz = 1;
        if(hzNiao == 10)zjjj = 1;//窝窝鸟

        var whzfb = 0;
        if(this.getItemByIdx(3,8).isSelected()){
            whzfb = 1;
        }
        var zmsyf = 2;
        if(this.getItemByIdx(3,9).isSelected()){
            zmsyf = 1;
        }

        var whzbzn = 0;//无用
        var hzNiaoFen = 0;
        if(this.getItemByIdx(8,1).isSelected()){
            hzNiaoFen = 1;
        }
        if(this.getItemByIdx(8,2).isSelected()){
            hzNiaoFen = 2;
        }

        var hzYpbh= 0;
        if(this.getItemByIdx(3,4).isSelected()){
            hzYpbh = 1;
        }
        var dgkq = 0;//无用
        var hzPiaoFen = 0;

        for(var i = 0;i<6;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                hzPiaoFen = i;
            }
        }

        var difen = 1;
        if(this.getItemByIdx(10,1).isSelected())difen = 2;
        if(this.getItemByIdx(10,2).isSelected())difen = 3;
        if(this.getItemByIdx(10,3).isSelected())difen = 5;
        if(this.getItemByIdx(10,4).isSelected())difen = 10;
        var hzNiaoway = 0;
        var njf = 1;
        if(this.getItemByIdx(7,1).isSelected())njf = 2;
        if(this.getItemByIdx(7,2).isSelected())njf = 3;

        if(this.getItemByIdx(6,0).isSelected()){
            hzNiaoway = 1;
        }
        var hzIsDouble = 0;
        if(this.getItemByIdx(13,1).isSelected()){
            hzIsDouble = 1;
        }
        var hzDScore = 0;


        hzDScore = this.hzDScore;
        cc.sys.localStorage.setItem("HZMJ_diScore",hzDScore);
        var hzDoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(14,i).isSelected()){
                hzDoubleNum = 2 + i;
                break;
            }
        }
        var hzWhzzm = 0;
        if (this.getItemByIdx(3,6).isSelected()){
            hzWhzzm =1;
        }
        var hzWhzfp = 0;
        if (this.getItemByIdx(3,7).isSelected()){
            hzWhzfp= 1;
        }
        var hzQdpphqys = 0;
        if (this.getItemByIdx(4,0).isSelected()){
            hzQdpphqys = 1;
        }

        var hzDjtg = 2;
        if (this.getItemByIdx(12,0).isSelected()){
            hzDjtg = 1;
        }else if (this.getItemByIdx(12,2).isSelected()){
            hzDjtg = 3;
        }

        var bznsqz = 0;
        if(this.getItemByIdx(3,10).isSelected())bznsqz = 1;

        var qsshzkh = 0;
        if(this.getItemByIdx(3,11).isSelected())qsshzkh = 1;

        var bahongzhong = 0;
        if(this.getItemByIdx(3,12).isSelected())bahongzhong = 1;

        var zmbh = 0;
        if(this.getItemByIdx(3,13).isSelected())zmbh = 1;

        var yhzbkjp = 0;
        if(this.getItemByIdx(3,14).isSelected())yhzbkjp = 1;

        var bnypdx = 0;
        if(this.getItemByIdx(3,15).isSelected())bnypdx = 1;

        var ztjssgf = 0;
        if(this.getItemByIdx(3,16).isSelected())ztjssgf = 1;

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(15,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("HZMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("HZMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.HZMJ,//玩法ID 1
            costway,//支付方式 2
            hzNiao,// 3中鸟数
            hzZmh,// 4点炮自摸：[选项 1未选中，0选中]
            hzZhuangXian,// 5 分庄闲：[选项 0未选中，1选中]
            hzKhqd,// 6可胡七小对：[选项 0未选中，1选中]
            renshu,// 7playerCount人数
            hzTuoguan,// 8托管[选项 0未选中，1选中]
            hzQgh,// 9抢杠胡：[选项 0未选中，1选中]
            hzQghbsj,// 10抢杠胡包三家：[选项 0未选中，1选中]
            zjjj,// 11抓几奖几
            ynqz,// 12一鸟全中：[选项 0未选中，1选中]
            njf,// 13鸟加分
            hzNiaoFen,// 14无红中加鸟,加1鸟，加2鸟
            hzYpbh,// 15有炮必胡：[选项 0未选中，1选中]
            dgkq,// 16点杠可胡：[选项 0未选中，1选中]
            hzPiaoFen,// 17飘分：[选项 0未选中，1选中]
            difen,// 18底分
            hzNiaoway,// 19 159中鸟：[选项 0未选中，1选中]
            hzIsDouble,// 20是否加倍
            hzDScore,// 21 加倍分
            hzDoubleNum,// 22加倍数
            hzWhzzm,//23无红中自摸+1
            hzWhzfp,//24无红中放炮+1
            hzQdpphqys,//25七对碰碰胡清一色+1
            hzDjtg,//26 1 单局托管 2 整局托管
            whzfb,//27 无红中得分翻倍
            zmsyf,//28 自摸算一分
            qsshzkh,// 29 起手四红中可胡
            bznsqz,//30 不中鸟算全中
            bahongzhong,//31 八红中
            zmbh,//32 自摸比胡
            morefen,//33 "加xx分"
            allowScore,//34 "低于xx分"
            yhzbkjp,//35 有红中不可接炮
            bnypdx,// 36 不能一炮多响
            ztjssgf// 37 中途解散算杠分
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushuArr = [1,6,8,12,16];
        var jushu = 1;
        for(var i = 0;i<5;++i){
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
        return [GameTypeEunmMJ.HZMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);
        var defaultConfig = [[0],[0],[0],[],[],[0],[],[0],[1],[0],[0],[0],[0],[0],[0],[]];
        var jushuList = [1,6,8,12,16];
        var index = jushuList.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = index != -1 ? index : 0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;
        defaultConfig[5][0] = parseInt(params[3]/2) || 0;
        defaultConfig[7][0] = params[13]-1;
        defaultConfig[8][0] = params[14];
        defaultConfig[9][0] = params[17] || 0;
        defaultConfig[10][0] = params[18] == 10 ? 4 : params[18] == 5 ? 3:((params[18]-1) || 0);
        defaultConfig[11][0] = params[8]?params[8] == 300?4:params[8]/60:0;
        defaultConfig[12][0] = parseInt(params[26]) - 1 >= 0?parseInt(params[26])-1:1;
        defaultConfig[13][0] = params[20];
        defaultConfig[14][0] = params[22]-2;

        if(params[33] && parseInt(params[33]) > 0)defaultConfig[15].push(0);

        this.hzDScore = parseInt(params[21]);

        if(params[5] == "1")defaultConfig[3].push(0);
        if(params[4] == "0")defaultConfig[3].push(1);
        if(params[9] == "1")defaultConfig[3].push(2);
        if(params[10] == "1")defaultConfig[3].push(3);
        if(params[15] == "1")defaultConfig[3].push(4);
        if(params[6] == "1")defaultConfig[3].push(5);
        if(params[23] == "1")defaultConfig[3].push(6);
        if(params[24] == "1")defaultConfig[3].push(7);
        if(params[27] == "1")defaultConfig[3].push(8);
        if(params[28] == "1")defaultConfig[3].push(9);
        if(params[29] == "1")defaultConfig[3].push(11);
        if(params[30] == "1")defaultConfig[3].push(10);
        if(params[31] == "1")defaultConfig[3].push(12);
        if(params[32] == "1")defaultConfig[3].push(13);
        if(params[35] == "1")defaultConfig[3].push(14);
        if(params[36] == "1")defaultConfig[3].push(15);
        if(params[37] == "1")defaultConfig[3].push(16);

        if(params[19] == "1")defaultConfig[6].push(0);

        if (params[25] == "1")defaultConfig[4].push(0);

        this.addScore = parseInt(params[33])||10;
        this.allowScore = parseInt(params[34])||10;
        this.defaultConfig = defaultConfig;
    },
});