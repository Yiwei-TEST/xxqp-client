/**
 * Created by Administrator on 2020/1/19.
 */

var RuleSelect_HHHGW = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(8);
        this.createChangeScoreBox(10);//创建低于xx分加xx分
        this.getItemByIdx(10,0).itemBtn.setContentSize(120,60);
        this.updateItemShow();

        this.btn_ext = new ccui.Button();
        this.btn_ext.setTitleText("名堂详情");
        this.btn_ext.setTitleColor(cc.color.RED);
        this.btn_ext.setTitleFontName("res/font/bjdmj/fznt.ttf");
        this.btn_ext.setTitleFontSize(40);
        this.btn_ext.addTouchEventListener(this.onClickShowExt,this);
        this.btn_ext.setPosition(430,0);
        this.getItemByIdx(4,1).addChild(this.btn_ext);
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数",type:1,content:["6局","8局","10局"],col:3},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数",type:1,content:["3人","2人"],col:3},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"],col:3},//3
            {title:"名堂",type:1,content:["红拐弯(234)","红拐弯(468)"],col:3},//4
            {title:"玩法",type:2,content:["15胡可自摸","自摸加一囤","自摸2番"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//7
            {title:"加倍",type:1,content:["不加倍","加倍"]},//8
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//9
            {title:"加分",type:2,content:["低于"]}//10
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[],[0],[0],[0],[0],[]];
        this.diScore = parseInt(cc.sys.localStorage.getItem("HHHGW_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("HHHGW_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("HHHGW_allowBoxScore")) || 10;/** 低于xx分 **/

        var params = null;
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
            if(params[1] == GameTypeEunmZP.HHHGW){
                this.readSelectData(params);
            }
        }

        this.extSelectLayer = new ExtSelectLayer(params);
        this.extSelectLayer.setVisible(false);
        this.addChild(this.extSelectLayer,1);

        return true;
    },

    onClickShowExt:function(sender,type){
        if(type == ccui.Widget.TOUCH_ENDED){
            var mingtang = 1;
            if(this.getItemByIdx(4,1).isSelected())mingtang = 2;
            this.extSelectLayer.setVisible(true);
            this.extSelectLayer.showItemWithType(mingtang);
        }
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

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 350 + (788/(this.layoutArr[row].itemArr.length));

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setPosition(0,BoxBg.height/2);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setPosition(BoxBg.width,BoxBg.height/2);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.diScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.diScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.diScore = num;
        }
        this.scoreLabel.setString("小于"+ this.diScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        if(tag == 501 && item.isSelected()){
            this.getItemByIdx(5,2).setSelected(false);
        }else if(tag == 502 && item.isSelected()){
            this.getItemByIdx(5,1).setSelected(false);
        }

        this.updateItemShow();
    },

    updateItemShow:function(){

        this.getLayoutByIdx(8).visible = false;
        this.getLayoutByIdx(9).visible = false;

        var is2ren = this.getItemByIdx(2,1).isSelected();
        var isjb = this.getItemByIdx(8,1).isSelected();

        this.layoutArr[3].setVisible(is2ren);
        this.layoutArr[8].setVisible(is2ren);
        this.layoutArr[9].setVisible(is2ren && isjb);
        this.layoutArr[10].setVisible(is2ren);

        this.numBox.setVisible(is2ren && isjb);
        this.addNumBox.itemBox.setVisible(is2ren);
        this.allowNumBox.itemBox.setVisible(is2ren);

        var istg = !this.getItemByIdx(6,0).isSelected();
        this.layoutArr[7].setVisible(istg);

    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 3;
        var zsNumArr = [3,4,5];
        var temp = 0;
        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
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
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp];
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3-i;
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
            {2:2000,3:1300,4:1000},{2:2500,3:1700,4:1300},{2:3000,3:2000,4:1500}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        var jushu = 6;
        var jushuArr = [6,8,10];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }

        var choupai = 0;
        if(this.getItemByIdx(3,1).isSelected()){
            choupai = 10;
        }else if(this.getItemByIdx(3,2).isSelected()){
            choupai = 20;
        }

        var mingtang = 1;
        if(this.getItemByIdx(4,1).isSelected()){
            mingtang = 2;
        }

        var kzm_15 = 0;
        if(this.getItemByIdx(5,0).isSelected())kzm_15 = 1;

        var zmjyt = 0;
        if(this.getItemByIdx(5,1).isSelected())zmjyt = 1;

        var zm2f = 0;
        if(this.getItemByIdx(5,2).isSelected())zm2f = 1;

        var tuoguan = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            tuoguan = 300;
        }

        var tgType = 2;
        if (this.getItemByIdx(7,0).isSelected()){
            tgType = 1;
        }else if (this.getItemByIdx(7,2).isSelected()){
            tgType = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(8,1).isSelected())isDouble = 1;

        cc.sys.localStorage.setItem("HHHGW_diScore",this.diScore);

        var doubleNum = 0;
        if(renshu == 2){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(9,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(10,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("HHHGW_addBoxScore",morefen);
        cc.sys.localStorage.setItem("HHHGW_allowBoxScore",allowScore);

        this.extSelectLayer.saveSelect();
        var extData = this.extSelectLayer.getSelectData(mingtang);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.HHHGW,//玩法ID 1
            costWay,//支付方式 2
            choupai,//抽牌 3
            kzm_15,//15胡可自摸 4
            zmjyt,//自摸加一囤 5
            zm2f,//自摸2番 6
            renshu,//人数 7
            mingtang,//名堂 (1:234和2:468) 8
            extData.tianhu,//天胡 9
            extData.dihu,//地胡 10
            extData.pph,//碰碰胡 11
            extData.sbd,//十八大 12
            extData.slx,//十六小 13
            extData.wuhu,//乌胡 14
            extData.dianhu,//点胡 15
            extData.hdh,//海底胡 16
            extData.honghu,//红胡 17
            tuoguan,   //托管时间 18
            tgType,//单局托管 19
            isDouble,//是否翻倍 20
            this.diScore,//翻倍上限 21
            doubleNum,//翻倍倍数 22
            allowScore, //低于xx分 23
            morefen,//加xx分 24
        ];
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 6;
        var jushuArr = [6,8,10];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 3;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 3 - i;
                break;
            }
        }
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costWay = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costWay = 2;
        }

        return [GameTypeEunmZP.HHHGW,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[0],[1],[0],[0],[0],[],[0],[0],[0],[0],[]];

        var jushuArr = [6,8,10];
        var idx = ArrayUtil.indexOf(jushuArr,params[0]);
        defaultConfig[0][0] = (idx>=0)?idx:0;//局数
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:parseInt(params[2]) - 1;//房费
        defaultConfig[2][0] = params[7] == 2?1:0;//人数
        defaultConfig[3][0] = params[3]==20?2:params[3]==10?1:0;//抽牌
        defaultConfig[4][0] = params[8]==2?1:0;//名堂

        defaultConfig[6][0] = params[18] == 300?4:params[18]/60;//托管时间
        defaultConfig[7][0] = params[19]== 1 ? 0:params[19]== 2 ? 1 : 2;//单局托管/整局/三局

        defaultConfig[8][0] = params[20]== 1 ? 1:0;//是否翻倍
        defaultConfig[9][0] = parseInt(params[22]) - 2 >= 0 ? parseInt(params[22]) - 2 : 0;//翻倍数

        if(params[4] == 1)defaultConfig[5].push(0);
        if(params[5] == 1)defaultConfig[5].push(1);
        if(params[6] == 1)defaultConfig[5].push(2);

        if(params[23] && params[23] != 0 && params[24] && params[24] != 0){
            defaultConfig[10].push(0);
        }

        this.diScore = params[21]?parseInt(params[21]):10;//多少分翻倍
        this.allowScore = parseInt(params[23])||10;
        this.addScore = parseInt(params[24])||10;

        this.defaultConfig = defaultConfig;
    },
});

var ExtSelectLayer = cc.Layer.extend({
    ctor:function(params){
        this._super();

        this.ruleConfig1 = [
            {title:"天胡:",type:1,content:["4番","5番"],col:2},//0
            {title:"地胡:",type:1,content:["3番","4番"],col:2},//1
            {title:"碰碰胡:",type:1,content:["4番","5番"],col:2},//2
            {title:"18大:",type:1,content:["4番起","5番起"],col:2},//3
            {title:"16小:",type:1,content:["4番起","5番起"],col:2},//4
            {title:"可选",type:2,content:["乌胡5番","点胡3番","海底胡2番","红胡2番起"],col:2},//5
        ];

        this.defArr1 = [[0],[0],[0],[0],[0],[0,1,2,3]];

        this.ruleConfig2 = [
            {title:"可选",type:2,content:["天胡8番","地胡6番","碰碰胡8番","18大8番起","16小8番起",
                "乌胡8番","点胡6番","海底胡6番","红胡4番起"],col:2},//0
        ];

        this.defArr2 = [[0,1,2,3,4,5,6,7,8]];

        this.readSaveData(params);

        this.initLayer();
    },

    readSaveData:function(params){
        var data1 = null;
        var data2 = null;
        if(params && params.length > 0){
            var keys = ["tianhu","dihu","pph","sbd","slx","wuhu","dianhu","hdh","honghu"];
            var data = {};
            for(var i = 0;i<9;++i){
                data[keys[i]] = params[i+9];
            }
            if(params[8] == 1){
                data1 = data;
            }else{
                data2 = data;
            }
        }else{
            data1 = cc.sys.localStorage.getItem("HHHGW_MT_1");
            data2 = cc.sys.localStorage.getItem("HHHGW_MT_2");
            data1 && (data1 = JSON.parse(data1));
            data2 && (data2 = JSON.parse(data2));
        }

        if(data1){
            var defArr = [[0],[0],[0],[0],[0],[]];
            if(data1.tianhu == 2)defArr[0][0] = 1;
            if(data1.dihu == 2)defArr[1][0] = 1;
            if(data1.pph == 2)defArr[2][0] = 1;
            if(data1.sbd == 2)defArr[3][0] = 1;
            if(data1.slx == 2)defArr[4][0] = 1;
            if(data1.wuhu == 1)defArr[5].push(0);
            if(data1.dianhu == 1)defArr[5].push(1);
            if(data1.hdh == 1)defArr[5].push(2);
            if(data1.honghu == 1)defArr[5].push(3);
            this.defArr1 = defArr;
        }

        if(data2){
            var defArr = [[]];
            if(data2.tianhu == 1)defArr[0].push(0);
            if(data2.dihu == 1)defArr[0].push(1);
            if(data2.pph == 1)defArr[0].push(2);
            if(data2.sbd == 1)defArr[0].push(3);
            if(data2.slx == 1)defArr[0].push(4);
            if(data2.wuhu == 1)defArr[0].push(5);
            if(data2.dianhu == 1)defArr[0].push(6);
            if(data2.hdh == 1)defArr[0].push(7);
            if(data2.honghu == 1)defArr[0].push(8);
            this.defArr2 = defArr;
        }

    },

    saveSelect:function(){
        var data1 = this.getSelectData(1);
        var data2 = this.getSelectData(2);

        cc.sys.localStorage.setItem("HHHGW_MT_1",JSON.stringify(data1));
        cc.sys.localStorage.setItem("HHHGW_MT_2",JSON.stringify(data2));
    },

    getSelectData:function(type) {
        var data = {};
        if(type == 1){

            data.tianhu = 1;
            data.dihu = 1;
            data.pph = 1;
            data.sbd = 1;
            data.slx = 1;
            data.wuhu = 0;
            data.dianhu = 0;
            data.hdh = 0;
            data.honghu = 0;
            if(this.layoutArr1[0].itemArr[1].isSelected())data.tianhu = 2;
            if(this.layoutArr1[1].itemArr[1].isSelected())data.dihu = 2;
            if(this.layoutArr1[2].itemArr[1].isSelected())data.pph = 2;
            if(this.layoutArr1[3].itemArr[1].isSelected())data.sbd = 2;
            if(this.layoutArr1[4].itemArr[1].isSelected())data.slx = 2;

            if(this.layoutArr1[5].itemArr[0].isSelected())data.wuhu = 1;
            if(this.layoutArr1[5].itemArr[1].isSelected())data.dianhu = 1;
            if(this.layoutArr1[5].itemArr[2].isSelected())data.hdh = 1;
            if(this.layoutArr1[5].itemArr[3].isSelected())data.honghu = 1;


        }else{
            data.tianhu = 0;
            data.dihu = 0;
            data.pph = 0;
            data.sbd = 0;
            data.slx = 0;
            data.wuhu = 0;
            data.dianhu = 0;
            data.hdh = 0;
            data.honghu = 0;
            if(this.layoutArr2[0].itemArr[0].isSelected())data.tianhu = 1;
            if(this.layoutArr2[0].itemArr[1].isSelected())data.dihu = 1;
            if(this.layoutArr2[0].itemArr[2].isSelected())data.pph = 1;
            if(this.layoutArr2[0].itemArr[3].isSelected())data.sbd = 1;
            if(this.layoutArr2[0].itemArr[4].isSelected())data.slx = 1;

            if(this.layoutArr2[0].itemArr[5].isSelected())data.wuhu = 1;
            if(this.layoutArr2[0].itemArr[6].isSelected())data.dianhu = 1;
            if(this.layoutArr2[0].itemArr[7].isSelected())data.hdh = 1;
            if(this.layoutArr2[0].itemArr[8].isSelected())data.honghu = 1;
        }
        return data;
    },

    initLayer:function(){

        var bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/di1.png");
        bg.setPosition(cc.winSize.width/2 + 220,cc.winSize.height/2);
        bg.setContentSize(1400,720);
        this.addChild(bg);

        this.layerBg = bg;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                if(this.isVisible() && cc.rectContainsPoint(bg.getBoundingBox(),touch.getLocation())){
                    return true;
                }
                return false;
            }.bind(this)
        }), this);

        this.btn_close = new ccui.Button("res/ui/bjdmj/popup/x.png");
        this.btn_close.setPosition(bg.width - 40,bg.height - 40);
        bg.addChild(this.btn_close,1);

        this.btn_close.addTouchEventListener(this.onClickBtn,this);

        this.layoutArr1 = [];
        this.layoutArr2 = [];

        this.contentNode1 = new cc.Node();
        this.contentNode2 = new cc.Node();
        bg.addChild(this.contentNode1);
        bg.addChild(this.contentNode2);

        var contentH = this.addSelectItems(this.contentNode1,this.ruleConfig1,this.layoutArr1,this.defArr1);
        this.contentNode1.setPosition(0,bg.height/2 + contentH/2);

        var contentH = this.addSelectItems(this.contentNode2,this.ruleConfig2,this.layoutArr2,this.defArr2);
        this.contentNode2.setPosition(0,bg.height/2 + contentH/2);

        this.contentNode1.setVisible(false);
        this.contentNode2.setVisible(false);

    },

    showItemWithType:function(type){
        this.contentNode1.setVisible(type == 1);
        this.contentNode2.setVisible(type == 2);
    },

    addSelectItems:function(node,rule,arr,defArr){
        var contentH = 0;
        var startY = 0;
        for(var i = 0;i<rule.length;++i){
            var layout = new SelectLayout(rule[i].title,rule[i].type,rule[i].col);
            layout.setTag(i*100);
            var height = layout.showItemList(rule[i].content);

            layout.setChangeHandel(this.changeHandle.bind(this));
            layout.setPosition(65,startY-height/2);

            startY -= height;

            layout.setDefault(defArr[i]);

            contentH += height;
            node.addChild(layout);

            arr.push(layout);
        }
        return contentH;
    },

    changeHandle:function(item){

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                this.setVisible(false);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

});