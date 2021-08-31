var RuleSelect_XPLP = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createChongFenBox(4);//创建冲分的加减
        this.createNumBox(8);
        this.createChangeScoreBox(10);//创建低于xx分加xx分
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["6局","9局","12局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽16张","抽32张"],col:3},//3
            {title:"冲分",type:1,content:["可冲","不可冲","必冲"]},//4
            {title:"玩法",type:2,content:["庄闲","只准自摸胡","有胡必胡","吃、碰后不出同张","不带花","箍臭"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},//8
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},//9
            {title:"加分",type:2,content:["低于"]},//10
        ];

        this.defaultConfig = [[0],[1],[0],[0],[0],[],[0],[1],[0],[0],[]];
        this.csDScore = parseInt(cc.sys.localStorage.getItem("XPLP_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("XPLP_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("XPLP_allowBoxScore")) || 10;/** 低于xx分 **/
        this.cfScore = parseInt(cc.sys.localStorage.getItem("XPLP_cfScore")) || 1;
        if(this.createRoomLayer.clubData){

            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[1].content = ["群主支付"];
                this.defaultConfig[1][0] = 0;
            }

            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == GameTypeEunmZP.XPLP){
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
        this.getLayoutByIdx(8).visible = false;
        this.getLayoutByIdx(9).visible = false;

        if(this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[8].setVisible(true);
            if(this.getItemByIdx(8,0).isSelected()){
                this.layoutArr[9].setVisible(false);
                this.numBox.visible=false;
            }else{
                this.layoutArr[9].setVisible(true);
                this.numBox.visible=true;
            }
            this.layoutArr[10].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(10,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[8].setVisible(false);
            this.layoutArr[9].setVisible(false);
            this.numBox.visible=false;
            this.layoutArr[10].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        var istg = !this.getItemByIdx(6,0).isSelected();
        this.layoutArr[7].setVisible(istg);
        //this.getItemByIdx(7,0).setItemState(istg);
        //this.getItemByIdx(7,1).setItemState(istg);

        if(this.getItemByIdx(4,2).isSelected()){//勾选必冲
            this.chongfenBox.visible=true;
        }else{
            this.chongfenBox.visible=false;
        }

        if(this.getItemByIdx(2,0).isSelected()){//勾选必冲
            this.layoutArr[3].setVisible(false);
        }else{
            this.layoutArr[3].setVisible(true);
            if(this.getItemByIdx(2,1).isSelected()){
                this.getItemByIdx(3,2).setVisible(false);
            }else{
                this.getItemByIdx(3,2).setVisible(true);
            }
        }

    },

    updateZsNum:function(){
        var zsNum = 5;
        if(this.getItemByIdx(0,1).isSelected())zsNum = 10;

        this.createRoomLayer && this.createRoomLayer.updateZsNum(0);
    },

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null;
        }
        var BoxBg = this.createBoxFunc(row,this.onChangeScoreClick);
        this.numBox = BoxBg;
        this.numBox.visible = false;
        this.numBox = BoxBg;
        this.numBox.visible = false;

        var scoreLabel = UICtor.cLabel("小于"+this.csDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);
        this.scoreLabel = scoreLabel;
    },

     //row 第几列
     createChongFenBox:function (row) {
        if (!this.layoutArr[row]){
            return null;
        }
        var BoxBg = this.createBoxFunc(row,this.onClickChongFen);
        this.chongfenBox = BoxBg;
        this.chongfenBox.visible = false;
        this.chongfenBox = BoxBg;
        this.chongfenBox.visible = false;
        this.chongfenBox.x = 680 + (788/(this.layoutArr[row].itemArr.length));

         var scoreLabel = UICtor.cLabel("冲"+this.cfScore+"分",38,null,cc.color(126,49,2));
         scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
         BoxBg.addChild(scoreLabel,0);
         this.chongfenLabel = scoreLabel;
    },

    createBoxFunc:function(row,callFunc){
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

        UITools.addClickEvent(reduceBtn,this,callFunc);
        UITools.addClickEvent(addBtn,this,callFunc);
        return BoxBg;
    },

    onClickChongFen:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.cfScore;

        if (temp == 1){
            num = num - 1;
        }else{
            num = num + 1;
        }
        if (num > 4){
            this.cfScore = 4;
        }else if (num < 1){
            this.cfScore = 1;
        }else{
            this.cfScore = num;
        }
        this.chongfenLabel.setString("冲"+ this.cfScore + "分");
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
        var jushu = 6;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = 6 + 3*i;
                break;
            }
        }

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
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

        var choupai = 0;
        if(renshu < 4){
            if(this.getItemByIdx(3,1).isSelected()){
                choupai = 16;
            }
            if(renshu == 2 && this.getItemByIdx(3,2).isSelected()){
                choupai = 32;
            }
        }

        var chongfen = 0;
        if(this.getItemByIdx(4,0).isSelected()){
            chongfen = 5;
        }else if(this.getItemByIdx(4,2).isSelected()){
            chongfen = this.cfScore;
        }

        var zhuangxian = this.getItemByIdx(5,0).isSelected() ? 1 : 0;//庄闲
        var zimo = this.getItemByIdx(5,1).isSelected() ? 1 : 0;//只准自摸胡
        var yhbh = this.getItemByIdx(5,2).isSelected() ? 1 : 0;//有胡必胡
        var chipeng = this.getItemByIdx(5,3).isSelected() ? 1 : 0;//吃碰后不出同张
        var nohua = this.getItemByIdx(5,4).isSelected() ? 1 : 0;//不带花
        var guchou = this.getItemByIdx(5,5).isSelected() ? 1 : 0;//箍臭

        var csTuoguan =0;
        var tuoguanArr = [0,60,120,180,300];
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                csTuoguan = tuoguanArr[i];
                break;
            }
        }

        var csDjtg = 2;
        if (this.getItemByIdx(7,0).isSelected()){
            csDjtg = 1;
        }else if (this.getItemByIdx(7,2).isSelected()){
            csDjtg = 3;
        }

        var csIsDouble = this.getItemByIdx(8,0).isSelected() ? 0 : 1;
        var csDScore = this.csDScore;
        cc.sys.localStorage.setItem("XPLP_cfScore",this.cfScore);
        cc.sys.localStorage.setItem("XPLP_diScore",csDScore);

        var csDoubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(9,i).isSelected()){
                csDoubleNum = 2 + i;
                break;
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(10,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("XPLP_addBoxScore",morefen);
        cc.sys.localStorage.setItem("XPLP_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmZP.XPLP,//玩法ID 1
            costway,//支付方式 2
            zhuangxian,//庄闲 3
            guchou,//箍臭 4
            chipeng,//吃碰后不出同张 5
            nohua,//不带花 6
            renshu,//人数 7
            yhbh,//有炮必胡 8
            csTuoguan,//托管 9
            0,//10
            choupai,//抽牌 11
            csIsDouble,//是否加倍 12
            csDScore,// 加倍分 13
            csDoubleNum,// 加倍数 14
            zimo,//只准自摸胡 15
            0,// 16
            0,// 17
            0,// 18
            csDjtg,//单局托管 19
            chongfen,// 20  冲分
            morefen,//21 "加xx分"
            allowScore,//22 "低于xx分"
            0,//23
            0,//24
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
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
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
        return [GameTypeEunmZP.XPLP,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[0],[0],[],[0],[1],[0],[0],[]];

         defaultConfig[0][0] = params[0] == 6 ? 0 : params[1] == 9 ? 1 : 2;
         defaultConfig[1][0] = params[2] == 3 ? 0 : params[2] - 1;
         defaultConfig[2][0] = params[7] == 2?2:params[7] == 3?1:0;
         defaultConfig[3][0] = params[11] == 16 ? 1 : params[11] == 32 ? 2 : 0;
         defaultConfig[4][0] = params[20] == 5 ? 0 : params[20] == 0 ? 1 : 2;

        if(params[20] > 0 && params[20] < 5){
            this.cfScore = params[20];
        }

        if(params[3] == 1)defaultConfig[5].push(0);
        if(params[15] == 1)defaultConfig[5].push(1);
        if(params[8] == 1)defaultConfig[5].push(2);
        if(params[5] == 1)defaultConfig[5].push(3);
        if(params[6] == 1)defaultConfig[5].push(4);
        if(params[4] == 1)defaultConfig[5].push(5);

         defaultConfig[6][0] = params[9]?params[9] == 300?4:params[9]/60:0;
         defaultConfig[7][0] = params[19]== 1 ? 0:(params[19]== 2 ? 1 : 2);//单局托管/整局/三局
         defaultConfig[8][0] = params[12] == 1?1:0;
         defaultConfig[9][0] = parseInt(params[14]) - 2;
         if(params[21] && parseInt(params[21]) > 0)defaultConfig[10].push(0);
         this.csDScore = parseInt(params[13]);

        this.addScore = parseInt(params[21])||10;
        this.allowScore = parseInt(params[22])||10;
        this.defaultConfig = defaultConfig;
    },
});