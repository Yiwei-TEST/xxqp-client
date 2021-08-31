/**
 * Created by cyp on 2019/10/23.
 */
var RuleSelect_DT = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(4);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1局","2局","4局","100分","600分","200分","300分","400分","500分"],col:3},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数选择",type:1,content:["4人","2人"],col:3},//2
            {title:"玩法",type:2,content:["去掉3和4","看队友牌","看手牌数","不打顺子","不打港","正五十K分花色",
                "仅最后飞机三条可少带","\n炸弹不带王","一游方到达100分,中途解散算分","\n中途解散算喜分"],col:3},//3
            {title:"喜分",type:2,content:["炸弹有喜","四红四黑"],col:3},//4
            {title:"喜分比例",type:1,content:["1:50","1:100","1:200","1:300"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
        ];

        this.tianZhaXf = parseInt(cc.sys.localStorage.getItem("DT_TZXF")) || 3;

        this.defaultConfig = [[0],[1],[0],[],[],[0],[0],[0]];

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
            if(params[1] == GameTypeEunmPK.DT){
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

    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 980;

        var label = UICtor.cLabel("天炸喜分",40);
        label.setColor(cc.color(116,102,65));
        label.setPosition(-90,BoxBg.height/2);
        BoxBg.addChild(label);

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,-2);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(240,-2);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel(this.tianZhaXf + "分",36,null,cc.color(126,49,2));
        scoreLabel.setAnchorPoint(0.5,0.5);
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.tianZhaXf;

        if (temp == 1){
            num = num - 1;
        }else{
            num = num + 1;
        }

        if (num >= 3 && num <= 8){
            this.tianZhaXf = num;
        }
        this.scoreLabel.setString(this.tianZhaXf + "分");
    },

    updateItemShow:function(){
        var istg = !this.getItemByIdx(6,0).isSelected();
        this.layoutArr[7].setVisible(istg);

        var zdyx = this.getItemByIdx(4,0).isSelected();
        this.numBox.setVisible(zdyx);

        if(!zdyx){
            this.getItemByIdx(4,1).setSelected(false);
        }

        var is2ren = this.getItemByIdx(2,1).isSelected();
        this.getItemByIdx(3,8).setItemState(!is2ren);
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [5,5,10,5,10];
        var temp = 0;

        var renshu = 4;
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

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
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp]
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 4;
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        var temp = 0;
        for(var i = 0;i<9;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,4:1500},{2:3000,4:1500},{2:5000,4:2500},{2:3000,4:1500},{2:5000,4:2500},
            {2:3000,4:1500},{2:3500,4:1800},{2:3500,4:1800},{2:4500,4:2300}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 1;
        var jushuArr = [1,2,4,100,600,200,300,400,500];
        for(var i = 0;i<9;++i){
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
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        var qudiao34 = 0;
        if(this.getItemByIdx(3,0).isSelected()){
            qudiao34 = 1;
        }

        var kdyp = 0;
        if(this.getItemByIdx(3,1).isSelected()){
            kdyp = 1;
        }

        var sjfz = 0;

        var ksps = 0;
        if(this.getItemByIdx(3,2).isSelected()){
            ksps = 1;
        }

        var bdsz = 0;
        if(this.getItemByIdx(3,3).isSelected()){
            bdsz = 1;
        }

        var bdg = 0;
        if(this.getItemByIdx(3,4).isSelected()){
            bdg = 1;
        }

        var zwskfhs = 0;
        if(this.getItemByIdx(3,5).isSelected()){
            zwskfhs = 1;
        }

        var jzhfjstksd = 0;
        if(this.getItemByIdx(3,6).isSelected()){
            jzhfjstksd = 1;
        }

        var zdbdw = 0;
        if(this.getItemByIdx(3,7).isSelected()){
            zdbdw = 1;
        }

        var suanfen_ztjs_100 = 0;
        if(this.getItemByIdx(3,8).isSelected()){
            suanfen_ztjs_100 = 1;
        }

        var suanfen_ztjs_xf = 0;
        if(this.getItemByIdx(3,9).isSelected()){
            suanfen_ztjs_xf = 1;
        }

        var zdyx = 0;
        if(this.getItemByIdx(4,0).isSelected()){
            zdyx = 1;
        }

        var shsh = 0;
        if(this.getItemByIdx(4,1).isSelected()){
            shsh = 1;
        }

        var xfbl = 50;
        if(this.getItemByIdx(5,1).isSelected())xfbl = 100;
        if(this.getItemByIdx(5,2).isSelected())xfbl = 200;
        if(this.getItemByIdx(5,3).isSelected())xfbl = 300;


        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            tuoguan = 300;
        }
        var tuoguan_type = 2;
        for(var i = 0;i<3;++i){
            if (this.getItemByIdx(7,i).isSelected()){
                tuoguan_type = i+1;
            }
        }

        cc.sys.localStorage.setItem("DT_TZXF",this.tianZhaXf);

        data.params = [
            jushu,//局数 0
            GameTypeEunmPK.DT,//玩法ID 1
            costway,//支付方式 2
            qudiao34,//去掉三四 3
            kdyp,//看队友牌 4
            sjfz,//随机分组 5
            ksps,//看手牌数 6
            renshu,//人数 7
            bdsz,//不打顺子 8
            bdg,//不打港 9
            zwskfhs,//正五十K分花色 10
            jzhfjstksd,//仅最后飞机三条可少带 11
            zdbdw,//炸弹不带王 12
            shsh,//四红四黑 13
            tuoguan,//托管时间 14
            tuoguan_type,//托管类型 15
            zdyx,//炸弹有喜 16
            xfbl,//喜分比例 17
            this.tianZhaXf,//天炸喜分18
            suanfen_ztjs_100,// 19 一游100分，中途解散算分
            suanfen_ztjs_xf, // 20 中途解散算喜分
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 1;
        var jushuArr = [1,2,4,100,600,200,300,400,500];
        for(var i = 0;i<9;++i){
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
        if(this.getItemByIdx(2,1).isSelected())renshu = 2;

        return [GameTypeEunmPK.DT,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[],[0],[0],[0]];

        var jushuCfg = {1:0,2:1,4:2,100:3,600:4,200:5,300:6,400:7,500:8};
        defaultConfig[0][0] = jushuCfg[params[0]] || 0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7]==2?1:0;

        if(params[3] == "1")defaultConfig[3].push(0);
        if(params[4] == "1")defaultConfig[3].push(1);

        if(params[6] == "1")defaultConfig[3].push(2);
        if(params[8] == "1")defaultConfig[3].push(3);
        if(params[9] == "1")defaultConfig[3].push(4);
        if(params[10] == "1")defaultConfig[3].push(5);
        if(params[11] == "1")defaultConfig[3].push(6);
        if(params[12] == "1")defaultConfig[3].push(7);
        if(params[19] == "1")defaultConfig[3].push(8);
        if(params[20] == "1")defaultConfig[3].push(9);

        if(params[16] == "1")defaultConfig[4].push(0);
        if(params[13] == "1")defaultConfig[4].push(1);

        defaultConfig[5][0] = params[17] == 100?1:params[17]==200?2:params[17]==300?3:0;
        defaultConfig[6][0] = params[14]?params[14] == 300?4:params[14]/60:0;
        defaultConfig[7][0] = (params[15]>0?(params[15]-1):1);

        this.tianZhaXf = parseInt(params[18]) || 3;

        this.defaultConfig = defaultConfig;
    },
});