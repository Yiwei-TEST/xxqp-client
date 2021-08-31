/**
 * Created by Administrator on 2017/2/28.
 */
var DTZCreateRoom = CreateRoomPop.extend({

    ctor:function(root,index,wanfaList,isLeaderPay){
        if(index){
            this.root = root;
            this.index = index;
            this.isClubSaveConfig = (this.index >= 1);
            this.isLeaderPay = isLeaderPay || false;
            this.wanfaList = wanfaList;
            this.selfRender();
        }else{
            this.isClubSaveConfig = false;
            this.isLeaderPay = false;
            this._super("res/DTZcreateRoom.json");
        }
    },

    addTCustomEvent:function(eventType,target,cb){
        SyEventManager.addEventListener(eventType, target, cb);
    },

    selfRender:function(){
        if(!this.index) {
            CreateRoomPop.prototype.selfRender.call(this);
        }
        //}else{
        //    var btn = this.Button_17 = this.getWidget("Button_17");
        //    UITools.addClickEvent(btn,this,this.onDTZCreate);
        //    //this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onRoomSuc);
        //}
        this.choiceEndScore = 0;//选择了第几个终局奖励分数
        this.jushu = this.getLocalItem("sy_pdk_jushu") || 10;
        this.wanfa = this.getLocalItem("sy_pdk_wanfa") || 16 ;
        this.heitao3 = this.getLocalItem("sy_pdk_heitao3") || 0;
        this.renshu = this.getLocalItem("sy_pdk_renshu")  || 4;
        this.showCardNumber = this.getLocalItem("sy_pdk_showCardNumber")  || 0;

        //打筒子
        this.getWanfaRecord();
        //
        this.hasKingCard = this.getLocalItem("sy_pkd_hasKingCard") || 0;

        //dtz游戏配置
        this.renshuConfig = [4, 3, 2];
        this.costConfig = [1 , 2]; //AA 房主支付
        this.typeConfig = {4:[113,114,212],3:[115,116,211],2:[117,118,210]};
        this.wanfaConfig = this.typeConfig[this.renshu];
        this.maxScoreConfig = [600 , 1000];
        this.exScoreConfig = [0 , 100 , 200 , 300 , 500 , 800, 1000];
        this.lbDisplayExscoreInPanel = this.getWidget("txt_exScoreDisplayReal");
        this.lbDisplayExscore = this.getWidget("txt_exScoreDisplayReal");
        this.panelExscore = this.getWidget("panelExScoreList");

        if(this.isClubSaveConfig){
            this.costConfig = [1 ,2 ,3];
        }

        // 可选项

        ////是否选择随机先出
        var widgetFirstOut = {"txt_RandomFirstOut" : 1  , "btn_RandomFirstOut" : 1};
        this.addDtzClickEvent(widgetFirstOut , this.onClickFirstOut);

        //是否增加王筒子
        var widgetWTZ = {"txt_wangtongzi" : 1  , "btn_wangtongzi" : 1};
        this.addDtzClickEvent(widgetWTZ , this.onClickWTZ);

        //是否选择有牌必打
        var widgetBida = {"txt_bida" : 1  , "btn_bida" : 1};
        this.addDtzClickEvent(widgetBida , this.onClickBida);

        //是否选择托管
        var widgetTuoguan = {"txt_tuoguan" : 1, "btn_tuoguan" : 1};
        this.addDtzClickEvent(widgetTuoguan , this.onClickTuoguan);

        //是否选择可带牌

        var widgetDaiPai = {"txt_kedaipai" : 1, "btn_kedaipai" : 1};
        this.addDtzClickEvent(widgetDaiPai , this.onClickDaiPai);

        //是否选择反作弊
        //var widgetFzb = {"txt_fanzuobi":1 , "btn_fanzuobi":1};
        //this.addDtzClickEvent(widgetFzb , this.onClickFzb);

        //游戏选择
        var widgetGame = {"btn_game_1":1,"btn_game_2":2,"btn_game_3":3,"txt_game_1":1,"txt_game_2":2,"txt_game_3":3};
        this.addDtzClickEvent(widgetGame , this.onGameClick);

        //支付房费选择
        var widgetsCost = {"btn_cost_1":1,"btn_cost_2":2,"txt_cost_1":1,"txt_cost_2":2};
        if(this.isClubSaveConfig){
            widgetsCost = {"btn_cost_1":1,"btn_cost_2":2,"btn_cost_3":3,"txt_cost_1":1,"txt_cost_2":2,"txt_cost_3":3};
            if (this.isLeaderPay){
                this.getWidget("txt_cost_3").x = this.getWidget("txt_cost_1").x;
                this.getWidget("btn_cost_3").x = this.getWidget("btn_cost_1").x;
                this.costWay = 3;
                for ( var i = 1;i <= 2;i++){
                    this.getWidget("txt_cost_"+i).visible = this.getWidget("btn_cost_"+i).visible = false;
                }
            }
        }

        this.addDtzClickEvent(widgetsCost,this.onCostClick);

        //玩法选择
        var widgetsPlay = {"btn_wanfa_1":1,"btn_wanfa_2":2,"btn_wanfa_3":3,"txt_wanfa_1":1,"txt_wanfa_2":2,"txt_wanfa_3":3};
        this.addDtzClickEvent(widgetsPlay,this.onTypeClick);

        //分数选择
        var widgetScore = {"btn_score_1":1 , "btn_score_2":2 , "txt_score_1":1 , "txt_score_2":2};// "txt_score_1":1 , "txt_socre_2":2
        this.addDtzClickEvent(widgetScore,this.onScoreClick);

        //终局奖励
        var widgetExScore = {"btn_EndScore_0":0 ,"btn_EndScore_1":1 , "btn_EndScore_2":2 , "btn_EndScore_3":3 , "btn_EndScore_4":4 ,
            "txt_EndScore_0":0 , "txt_EndScore_1":1 , "txt_EndScore_2":2 , "txt_EndScore_3":3 ,"txt_EndScore_4":4 ,"txt_EndScore_5":5 ,"txt_EndScore_6":6 ,};
        UITools.addClickEvent(this.getWidget("imgExScore") , this , this.showExscorePanel);
        UITools.addClickEvent(this.lbDisplayExscoreInPanel , this , this.showExscorePanel);
        this.addDtzClickEvent(widgetExScore , this.onExScoreClick);

        //添加复选框的文字点击事件
        var widgetExChoice = {"txt_ChoiceDarkCard" : 1  , "btn_ChoiceDarkCard" : 1  , "txt_ShowLastCardNum" : 2 , "btn_ShowLastCardNum" : 2 };//
        this.addDtzClickEvent(widgetExChoice , this.onClickExTxt);

        //添加复选框按钮的点击时间
        //var widgetExBtnChoice = {"btn_ChoiceDarkCard" : 1  , "btn_ShowLastCardNum" : 2}; //
        //this.addCheckboxEvent(widgetExBtnChoice , this.onCheckBox);

        //屏蔽按键
        this.addClickEvent({"mainMask":1} , this.onDoNothing);

        var daikaiBtn = this.Button_17 = this.getWidget("Button_28");
        if(daikaiBtn){
            UITools.addClickEvent(daikaiBtn,this,this.onDaiCreate);
        }

        var btn = this.Button_17 = this.getWidget("Button_29");
        if(btn){
            UITools.addClickEvent(btn,this,this.onDaiKaiList);
        }
        var Label_18 = this.getWidget("Label_18");
        Label_18.setString("注：牌局开始后立即扣除钻石，中途解散计算当局筒子分");

        this.updateFirstOut();
        this.updateBida();
        this.updateWTZ();
        this.updateTuoguan();
        this.updateKeDaiPai();
        //this.updateFanZuoBi();
        this.initBtnStatu();

        if(SdkUtil.isYYBReview()){
            this.getWidget("Image_Cost").visible = false;
            this.getWidget("Image_ExScore").y += 70;
            this.getWidget("Image_exChoice").y += 70;
            this.getWidget("Label_18").visible = false;
        }
    },


    /**
     * 针对层出不穷的可选项需求 影藏 显示 位置移动 等处理
     */
    dealExBtns:function(){

        this.updateSelect();//老代码兼容

        //王筒子可选项 显示 影藏 位置更新
        var wtzBtn = this["btn_wangtongzi"];
        var wtzTxt = this["txt_wangtongzi"];
        cc.log("wtzBtn ... x" , wtzBtn.x , wtzTxt.x);
        if(DTZRoomModel.is4Ren(this.wanfa)){
            wtzBtn.x = 640;
            wtzTxt.x = 676;
        }else{
            wtzBtn.x = 890;
            wtzTxt.x = 926;
        }
        wtzBtn.visible = (DTZRoomModel.is3FuPai(this.wanfa) && !DTZRoomModel.is4Ren(this.wanfa));
        wtzTxt.visible = (DTZRoomModel.is3FuPai(this.wanfa) && !DTZRoomModel.is4Ren(this.wanfa));

        //有牌必打可选项 显示 影藏 位置更新
        var bidaBtn = this["btn_bida"];
        var bidaTxt = this["txt_bida"];
        bidaBtn.visible = DTZRoomModel.is2Ren(this.wanfa);
        bidaTxt.visible = DTZRoomModel.is2Ren(this.wanfa);

        //托管可选项 显示 影藏 位置更新
        var tuoguanBtn = this["btn_tuoguan"];
        var tuoguanTxt = this["txt_tuoguan"];
        if(DTZRoomModel.is3Ren(this.wanfa) || DTZRoomModel.is2Ren(this.wanfa)){
            if(DTZRoomModel.is3Ren(this.wanfa)){
                tuoguanBtn.visible = tuoguanTxt.visible = true;
                cc.log("tuoguanBtn..pos " , tuoguanBtn.x , tuoguanTxt.x);
                tuoguanBtn.x = 198;
                //}else if(DTZRoomModel.is2Ren(this.wanfa) && (this.isBida == 1)){
            //    tuoguanBtn.visible = tuoguanTxt.visible = true;
            //    tuoguanBtn.x = 454;
            //    tuoguanTxt.x = 496;
            }else{
                bidaBtn.x = 198;
                tuoguanBtn.x = 454;
                tuoguanBtn.visible = tuoguanTxt.visible = false;
            }
        }else{
            tuoguanBtn.x = 454;
            tuoguanBtn.visible = tuoguanTxt.visible =false;
        }
        tuoguanTxt.x = tuoguanBtn.x + 40;
        bidaTxt.x = bidaBtn.x + 40;
        tuoguanBtn.visible = tuoguanTxt.visible = true;

        //可带排可选项的 显示影藏
        var daipaiBtn = this["btn_kedaipai"];
        var daipaiTxt = this["txt_kedaipai"];
        daipaiBtn.visible = daipaiTxt.visible = true;
        if(DTZRoomModel.is3Ren(this.wanfa) || DTZRoomModel.is2Ren(this.wanfa)){
            if(DTZRoomModel.is2Ren(this.wanfa)){
            //if((this.isBida == 1) && DTZRoomModel.is2Ren(this.wanfa)){
                daipaiBtn.x = 687;
            }else{
                daipaiBtn.x = 456;
            }
            //daipaiTxt.x = daipaiBtn.x + 40;
        }else{
            daipaiBtn.x = 198;
        }
        daipaiTxt.x = daipaiBtn.x + 40;
        //三副牌默认勾选 四副牌默认不勾选
        if(!this._hasDefaultDaiPaiValue){
            if(DTZRoomModel.is3FuPai(this.wanfa)){
                this.isDaiPai = 1;
            }else{
                this.isDaiPai = 0;
            }
            this.updateKeDaiPai();
        }
    },

    getWanfaRecord:function(){
            //打筒子
            var costWay  = this.getLocalItem("sy_dtz_cost") || 1;
            if (!this.isClubSaveConfig && costWay == 3 ){
                costWay = 1;
            }
            this.costWay = costWay;
            this.wanfa = this.getLocalItem("sy_dtz_wanfa") || DTZRoomModel.wanfa3;
            this.maxScore = this.getLocalItem("sy_dtz_maxScore") || 600;
            this.exScore = this.getLocalItem("sy_dtz_exScore") || 0;
            this.isDark8 = parseInt(this.getLocalItem("sy_dtz_isDark8")) == 0 ? 0 : 1;
            this.isRemove67 = 0;//this.getLocalItem("sy_dtz_isRemove67") || 0;
            this.isShowNumber = parseInt(this.getLocalItem("sy_dtz_isShowNum")) == 0 ? 0 : 1;
            this.renshu = this.getLocalItem("sy_dtz_renshuv2")  || 4;
            this.isFirstOut = this.getLocalItem("sy_dtz_isFirstOut") || 0;
            this.isBida = parseInt(this.getLocalItem("sy_dtz_isBida")) == 1 ? 1 : 0 ;            //新增有牌必打
            this.isWangTongZi = parseInt(this.getLocalItem("sy_dtz_isWangTongZi")) == 1 ? 1 : 0; // 新增王筒子
            this.isTuoguan = parseInt(this.getLocalItem("sy_dtz_isTuoguan")) == 1? 1 : 0;        //新增托管
            this.isDaiPai = parseInt(this.getLocalItem("sy_dtz_isDaiPai")) == 1 ? 1:0;
            this.isFanZuoBi = parseInt(this.getLocalItem("sy_dtz_isFanZuoBi")) == 1 ? 1:0;  // 反作弊
            if(isNaN(parseInt(this.getLocalItem("sy_dtz_isDaiPai")))){
                this._hasDefaultDaiPaiValue = false;
            }else{
                this._hasDefaultDaiPaiValue = true;
            }
            cc.log("this.isWangtongzi :" , this.isWangTongZi);
    },

    //onDaikai:function(){
    //    FloatLabelUtil.comText("即将开放");
    //},
    //
    //onYikai:function(){
    //    FloatLabelUtil.comText("即将开放");
    //},

    onDoNothing:function(){
        cc.log("点击在创建房间的背景图")
        return false;
    },

    //初始化按钮状态
    initBtnStatu:function(){
        var indexofGame = ArrayUtil.indexOf(this.renshuConfig , this.renshu) + 1;
        var indexofCost = ArrayUtil.indexOf(this.costConfig , this.costWay) + 1;
        var indexofWanfa = ArrayUtil.indexOf(this.wanfaConfig , this.wanfa) + 1;
        var indexofmaxScore = ArrayUtil.indexOf(this.maxScoreConfig , this.maxScore) + 1;
        var indexofExScore = ArrayUtil.indexOf(this.exScoreConfig , this.exScore);
        cc.log("初始化创建房间的按钮信息 " , indexofCost + " " + indexofWanfa + " " + indexofmaxScore  + " " + indexofExScore);

        //游戏
        for(var i = 1 ; i <= this.renshuConfig.length ; i ++) {
            this.getDtzWidget("btn_game_" + i).setBright(indexofGame == i);
            var txtItem = this.getDtzWidget("txt_game_" + i);
            if(indexofGame != i){
                txtItem.setColor(cc.color(93 , 33 , 7))
            }else{
                txtItem.setColor(cc.color(254 , 115 , 34));
            }
        }

        //创房消耗
        for(var i = 1 ; i <= this.costConfig.length ; i ++){
            this.getDtzWidget("btn_cost_" + i).setBright(indexofCost == i);
            var txtItem = this.getDtzWidget("txt_cost_" + i);
            if(indexofCost != i){
                txtItem.setColor(cc.color(93 , 33 , 7))
            }else{
                txtItem.setColor(cc.color(254 , 115 , 34));
            }
        }

        //玩法
        for(var i = 1 ; i <= this.wanfaConfig.length ; i ++){
            this.getDtzWidget("btn_wanfa_" + i).setBright(indexofWanfa == i);
            var txtItem = this.getDtzWidget("txt_wanfa_" + i);
            if(indexofWanfa != i){
                txtItem.setColor(cc.color(93 , 33 , 7))
            }else{
                txtItem.setColor(cc.color(254 , 115 , 34));
            }
        }

        //分数选择
        for(var j = 1 ; j <= this.maxScoreConfig.length ; j ++){
            this.getDtzWidget("btn_score_" + j).setBright(indexofmaxScore == j);
            var txtItem = this.getDtzWidget("txt_score_" + j);
            if(indexofmaxScore != j){
                txtItem.setColor(cc.color(93 , 33 , 7));
            }else{
                txtItem.setColor(cc.color(254 , 115 , 34));
            }

            //修改钻石消耗的描述
            this.updateCost();
        }

        //终局奖励
        var txtItem = this.getDtzWidget("txt_EndScore_" + indexofExScore);
        if(txtItem){
            this.onExScoreClick(txtItem);
        }else{
            txtItem = this.getDtzWidget("txt_EndScore_" + 0);
            this.onExScoreClick(txtItem);
        }
        this.panelExscore.visible = false;

        //for(var g = 0 ; g < this.exScoreConfig.length ; g++){
        //    if(this.getDtzWidget("btn_EndScore_" + g)){
        //        this.getDtzWidget("btn_EndScore_" + g).setBright(indexofExScore == g);
        //    }
        //    this.choiceEndScore = indexofExScore;
        //    var txtItem = this.getDtzWidget("txt_EndScore_" + g);
        //    if(indexofExScore != g){
        //        txtItem.setColor(cc.color(93 , 33 , 7))
        //    }else{
        //        txtItem.setColor(cc.color(254 , 115 , 34));
        //    }
        //}


        //可选
        this.initExSelect();
        this.dealExBtns();
        //this.updateSelect();
    },

    initExSelect:function(){
        //可选
        var btn = this["btn_ChoiceDarkCard"];
        var txt = this["txt_ChoiceDarkCard"];
        if(this.isDark8){
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
        }else{
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
        }

        btn = this["btn_ShowLastCardNum"];
        txt = this["txt_ShowLastCardNum"];
        if(this.isShowNumber){
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
        }else{
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
        }

    },

    //刷新钻石消耗显示
    updateCost:function(){
        //刷新钻石显示
        var AAlable = this.getDtzWidget("txt_cost_1_" + 1);
        var FangZhuLable = this.getDtzWidget("txt_cost_2_" + 1);
        var QunZhuLable = this.getDtzWidget("txt_cost_3_" + 1);

        if(this.maxScore == 600){
            if(this.renshu == 4){
                AAlable.setString("10/人");
                FangZhuLable.setString("40");
            }else if(this.renshu == 3){
                AAlable.setString("10/人");
                FangZhuLable.setString("30");
            }else if(this.renshu == 2){
                AAlable.setString("15/人");
                FangZhuLable.setString("30");
            }

        }else if(this.maxScore == 1000){
            if(this.renshu == 4){
                AAlable.setString("15/人");
                FangZhuLable.setString("60");
            }else if(this.renshu == 3){
                AAlable.setString("20/人");
                FangZhuLable.setString("60");
            }else if(this.renshu == 2){
                AAlable.setString("30/人");
                FangZhuLable.setString("60");
            }
        }

        if(QunZhuLable){
            QunZhuLable.setString(FangZhuLable.getString());
        }

    },

    /**
     * 2人 3人默认要选中 暗牌选项
     */
    updateSelect:function(){
        if(this.renshu == 4){
            this.isDark8 = parseInt(this.getLocalItem("sy_dtz_isDark8")) == 0 ? 0 : 1;
            this.initExSelect();
            this["txt_ShowLastCardNum"].setString("记牌器");
            //隐藏随机出头选项
            this["txt_RandomFirstOut"].visible = false;
            this["btn_RandomFirstOut"].visible = false;
        }else{
            this.onClickExTxt(this["btn_ChoiceDarkCard"]);
            this["txt_ShowLastCardNum"].setString("显示剩余牌");
            //显示随机出头选项
            this["txt_RandomFirstOut"].visible = true;
            this["btn_RandomFirstOut"].visible = true;
        }
        var desc = "暗8张底牌";
        //三副牌
        var darkNumber = 8;
        if(DTZRoomModel.is3FuPai(this.wanfa)){//this.wanfa == 113 || this.wanfa == 115 || this.wanfa == 117
            if(this.renshu == 4){
                darkNumber = 8;
            }else if(this.renshu == 3){
                darkNumber = 9;
            }else if(this.renshu == 2){
                darkNumber = 66;
            }
        }else if(DTZRoomModel.is4FuPai(this.wanfa))
        {
            //四副牌
            if(this.renshu == 4){
                darkNumber = 8;
            }else if(this.renshu == 3){
                darkNumber = 52;

            }else if(this.renshu == 2){
                darkNumber = 96;
            }
        }

        if(this.isWangTongZi && DTZRoomModel.is3FuPai(this.wanfa) && !DTZRoomModel.is4Ren(this.wanfa)){
            darkNumber = darkNumber + 6;
        }



        //增加判断是否勾选了王筒子 修改文字描述




        this["btn_ChoiceDarkCard"].visible = true;
        this["txt_ChoiceDarkCard"].visible = true;
        this["btn_kedaipai"].y = -31.5;
        this["txt_kedaipai"].y = -29.5;
        if (this.wanfa == 212){
            this["btn_ChoiceDarkCard"].visible = false;
            this["txt_ChoiceDarkCard"].visible = false;
            this["btn_kedaipai"].y = 15.5;
            this["txt_kedaipai"].y = 18.5;
        }else if (this.wanfa == 211){
            darkNumber = 44;
        }else if (this.wanfa == 210){
            darkNumber = 88;
        }

        desc = "暗"+darkNumber+"张底牌";
        this["txt_ChoiceDarkCard"].setString(desc);
    },

    //选择游戏
    onGameClick:function(obj){
        var clickId = parseInt(obj.temp);
        cc.log("onGameClick..." , clickId);
        var values = this.renshuConfig;
        for(var i=1;i<=3;i++){
            if(i != clickId){
                this["btn_game_" + i].setBright(false);
                this["txt_game_" + i].setColor(cc.color(93 , 33 , 7));
            }
        }
        var btn = this["btn_game_" + clickId];
        var txt = this["txt_game_" + clickId];
        txt.setColor(cc.color(254 , 115 , 34));
        btn.setBright(true);
        var wanfaIndex = ArrayUtil.indexOf(this.wanfaConfig, this.wanfa);
        this.renshu = values[clickId - 1];
        this.wanfaConfig = this.typeConfig[this.renshu];
        this.wanfa = this.wanfaConfig[wanfaIndex];
        this.updateCost();
        //暗牌默认选中
        this.dealExBtns();
        //this.updateSelect();
    },

    //选择消耗房费方式
    onCostClick:function(obj){

        var clickId = parseInt(obj.temp);
        cc.log("onCostClick..." , clickId);
        var values = this.costConfig;
        var indexLength = 2;
        if(this.isClubSaveConfig){
            indexLength = 3;
        }

        for(var i=1;i<=indexLength;i++){
            if(i != clickId){
                this["btn_cost_" + i].setBright(false);
                this["txt_cost_" + i].setColor(cc.color(93 , 33 , 7));
            }

        }
        var btn = this["btn_cost_" + clickId];
        var txt = this["txt_cost_" + clickId];
        txt.setColor(cc.color(254 , 115 , 34));
        btn.setBright(true);
        this.costWay = values[clickId - 1];
    },

    //选择玩法
    onTypeClick:function(obj){
        var clickId = parseInt(obj.temp);
        var values = this.typeConfig[this.renshu];
        for(var i=1;i<=3;i++){
            if(i != clickId){
                this["btn_wanfa_" + i].setBright(false);
                this["txt_wanfa_" + i].setColor(cc.color(93 , 33 , 7));
            }

        }
        var btn = this["btn_wanfa_" + clickId];
        var txt = this["txt_wanfa_" + clickId];
        txt.setColor(cc.color(254 , 115 , 34));
        btn.setBright(true);
        this.wanfa = values[clickId - 1];
        this.dealExBtns();
        //this.updateSelect();
    },

    //选择分数
    onScoreClick:function(obj){
        var clickId = parseInt(obj.temp);
        var values = this.maxScoreConfig;
        for(var i=1;i<=2;i++){
            if(i != clickId){
                this["btn_score_" + i].setBright(false);
                this["txt_score_" + i].setColor(cc.color( 93 , 33 , 7));
            }
        }
        var btn = this["btn_score_" + clickId];
        var txt = this["txt_score_" + clickId];
        btn.setBright(true);
        txt.setColor(cc.color(254 , 115 , 34));
        this.maxScore = values[clickId - 1];
        //修改钻石消耗的描述
        this.updateCost();
    },

    //选择终局奖励分数
    onExScoreClick:function(obj){
        var clickId = parseInt(obj.temp);
        var values = this.exScoreConfig;
        for(var i = 0 ; i <= this.exScoreConfig.length - 1 ; i ++){
            if(i != clickId){
                if(this["btn_EndScore_" + i]){
                    this["btn_EndScore_" + i].setBright(false);
                }
                this["txt_EndScore_" + i].setColor(cc.color(93 , 33 , 7));
            }
        }
        var btn = this["btn_EndScore_" + clickId];
        var txt = this["txt_EndScore_" + clickId];

        if(btn){
            btn.setBright(true);
        }
        this.choiceEndScore = clickId;
        txt.setColor(cc.color(254 , 115 , 34));

        if(this.choiceEndScore == 0){
            this.exScore = 0;
        }else{
            this.exScore = values[clickId];
        }


        if(clickId >= 4){
            var btn = this["btn_EndScore_" + 4];
            if(btn){
                btn.setBright(true);
            }

            this.showExscorePanel();
            this.lbDisplayExscoreInPanel.setString(this.exScore + "分");
            this.lbDisplayExscore.setString(this.exScore + "分");
        }

    },


    showExscorePanel:function(){
        this.panelExscore.visible = !this.panelExscore.visible;
    },

    //选择扑八张
    onClickDark8Card:function(){
        var btn = this["btn_ChoiceDarkCard"];
        var txt = this["txt_ChoiceDarkCard"];
        if(btn.isBright()){
            if(this.renshu != 4){//三人 两人 不可以取消
                return;
            }
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
            this.isDark8 = 0;
        }else{
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
            this.isDark8 = 1;
        }
    },

    //选择反作弊
    onClickFzb:function(){
        this.onNormolClick("btn_fanzuobi","txt_fanzuobi","isFanZuoBi");
    },

    updateFanZuoBi:function(){
        this.onNormolUpdate("btn_fanzuobi", "txt_fanzuobi" , "isFanZuoBi");
    },

    updateFirstOut:function(){
        var btn = this["btn_RandomFirstOut"];
        var txt = this["txt_RandomFirstOut"];
        if(this.isFirstOut == 1){
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
        }else if(this.isFirstOut == 0){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
        }
    },

    updateWTZ:function(){
        var btn = this["btn_wangtongzi"];
        var txt = this["txt_wangtongzi"];
        if(this.isWangTongZi == 1){
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
        }else if(this.isWangTongZi == 0){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
        }
        this.dealExBtns();
    },

    updateBida:function(){
        var btn = this["btn_bida"];
        var txt = this["txt_bida"];
        if(this.isBida == 1){
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
        }else if(this.isBida == 0){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
        }
    },

    updateTuoguan:function(){
        var btn = this["btn_tuoguan"];
        var txt = this["txt_tuoguan"];
        if(this.isTuoguan == 1){
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
        }else if(this.isTuoguan == 0){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
        }
    },


    updateKeDaiPai:function(){
        cc.log("updateKeDaiPai::" , this.isDaiPai);
        var btn = this["btn_kedaipai"];
        var txt = this["txt_kedaipai"];
        if(this.isDaiPai == 1){
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
        }else if(this.isDaiPai == 0){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
        }
    },


    //选择随机显出
    onClickFirstOut:function(){
        var btn = this["btn_RandomFirstOut"];
        var txt = this["txt_RandomFirstOut"];
        if(btn.isBright()){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
            this.isFirstOut = 0;
        }else{
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
            this.isFirstOut = 1;
        }
    },

    //选择王筒子
    onClickWTZ:function(){
        var btn = this["btn_wangtongzi"];
        var txt = this["txt_wangtongzi"];
        if(btn.isBright()){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
            this.isWangTongZi = 0;
        }else{
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
            this.isWangTongZi = 1;
        }
        this.dealExBtns();
    },

    //选择有牌必打
    onClickBida:function(){
        var btn = this["btn_bida"];
        var txt = this["txt_bida"];
        if(btn.isBright()){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
            this.isBida = 0;
        }else{
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
            this.isBida = 1;
        }
        //刷新 托管的显示
        this.dealExBtns()
    },

    //选择托管
    onClickTuoguan:function(){
        var btn = this["btn_tuoguan"];
        var txt = this["txt_tuoguan"];
        if(btn.isBright()){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
            this.isTuoguan = 0;
        }else{
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
            this.isTuoguan = 1;
        }
    },

    //选择可带牌
    onClickDaiPai:function(){
        var btn = this["btn_kedaipai"];
        var txt = this["txt_kedaipai"];
        if(btn.isBright()){
            cc.log("选中可带牌");
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
            this.isDaiPai = 0;
        }else{
            cc.log("取消可带牌");
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
            this.isDaiPai = 1;
        }
    },

    //是否显示剩余牌数
    onClickShowNum:function(){
        var btn = this["btn_ShowLastCardNum"];
        var txt = this["txt_ShowLastCardNum"];
        if(btn.isBright()){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setBright(false);
            this.isShowNumber = 0;
        }else{
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setBright(true);
            this.isShowNumber = 1;
        }

    },


    //是否不要6，7
    onClickRemoveSome:function(){
        var btn = this["btn_Remove67"];
        var txt = this["txt_Remove67"];
        if(btn.isSelected()){
            txt.setColor(cc.color(93 , 33 , 7));
            btn.setSelected(false);
            this.isRemove67 = 0;
        }else{
            txt.setColor(cc.color(254 , 115 , 34));
            btn.setSelected(true);
            this.isRemove67 = 1;
        }

    },

    //点击可选项的文字
    onClickExTxt:function(obj){
        var tag = parseInt(obj.temp);
        if(tag == 1){//扑八张
            this.onClickDark8Card();
        }else if (tag == 2){//
            this.onClickShowNum();
        }

    },


    onCheckBox:function(obj,type) {
        var funcId = parseInt(obj.temp);
        var txtNode = null;
        var btnNode = null;

        if(funcId == 1){
            btnNode = this["btn_ChoiceDarkCard"];
            txtNode = this["txt_ChoiceDarkCard"];
        }else if (funcId == 2){
            btnNode = this["btn_ShowLastCardNum"];
            txtNode = this["txt_ShowLastCardNum"];
        }

        if(this.renshu != 4 && funcId == 1){//3 人 2 人 的暗牌选项不可取消
            cc.log("不是四个人 返回");
            return;
        }

        if (type == ccui.CheckBox.EVENT_SELECTED) {

            if(funcId == 1){
                this.isDark8 = 1;
            }else if(funcId == 2){
                this.isShowNumber = 1;
            }

            txtNode.setColor(cc.color(254 , 115 , 34));

        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){

            if(funcId == 1){
                this.isDark8 = 0;
            }else if(funcId == 2){
                this.isShowNumber = 0;
            }

            txtNode.setColor(cc.color(93 , 33 , 7));

        }
    },

    addCheckboxEvent:function(widgets){
        for(var key in widgets){
            var widget = this[key] = this.getDtzWidget(key);
            widget.temp = parseInt(widgets[key]);
            widget.addEventListener(this.onCheckBox,this);
        }
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            if(!widget){
                cc.log("1111");
            }else{
                widget.temp = parseInt(widgets[key]);
                UITools.addClickEvent(widget,this,selector);
            }

        }
    },

    addDtzClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    getWidget:function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

    getDtzWidget:function(name){
        //return ccui.helper.seekWidgetByName(this.getWidget("NodeDTZ") , name);
        if(ccui.helper.seekWidgetByName(this.root,name) == null){
            cc.log("获取Node失败..." , name);
        }
        return ccui.helper.seekWidgetByName(this.root,name);
    }

});