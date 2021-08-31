var ClubCreditCreatePop = BasePopup.extend({

    ctor:function(creditParms,isCredit){
        this.creditParms = [];
        if (isCredit && parseInt(isCredit)){
            this.creditParms = creditParms || [];
        }
        this.giveRanges = this.creditParms[9] || 0;
        if (this.giveRanges){
            this.qzbdFen = 0;
        }
        this._super("res/clubCreditCreatePop.json");
    },


    selfRender:function(){


        this.initData();

        this.Button_36 = this.getWidget("Button_36");
        UITools.addClickEvent(this.Button_36,this,this.onTrue);

        //选择固定还是比例的赠送
        var widgetGive = {"Button_give1" : 1  , "Label_give1" : 1,"Button_give2":2,"Label_give2":2};
        this.addDtzClickEvent(widgetGive,this.onGiveType);
        this.displayGiveType();

        //选择大赢家还是所有赢家
        var widgetGiveWay = {"Button_giveWay1":1,"Label_giveWay1":1,"Button_giveWay2":2,"Label_giveWay2":2};
        this.addDtzClickEvent(widgetGiveWay,this.onGiveWay);
        this.displayGiveWay();


        //隐藏比例赠送，所有赢家
        this.Button_give2.visible = this.Label_give2.visible = this.Button_giveWay2.visible = this.Label_giveWay2.visible = false;


        this.CheckBox_xipai = this.getWidget("CheckBox_xipai");
        this.Image_xpkf = this.getWidget("Image_xpkf");
        this.CheckBox_xipai.addEventListener(function (target,type) {
            if(type == ccui.CheckBox.EVENT_SELECTED){
                this.Image_xpkf.setVisible(true);
                this.isXiPai = 1;
            }else if(type == ccui.CheckBox.EVENT_UNSELECTED){
                this.Image_xpkf.setVisible(false); 
                this.isXiPai = 0;
                this.xpkfFen = 0;
            }
        },this);

        this.CheckAAPay = this.getWidget("CheckAAPay");

        this.CheckAAPay.addEventListener(function (target,type) {
            if(type == ccui.CheckBox.EVENT_SELECTED){
                this.isAAPay = 1;
                this.updateBDZS();
            }else if(type == ccui.CheckBox.EVENT_UNSELECTED){
                this.isAAPay = 0;
                this.updateBDZS();
            }
        },this);

        this.inputJoin = this.getWidget("Label_join");
        this.inputExit = this.getWidget("Label_exit");
        this.inputScore = this.getWidget("Label_giveScore");
        this.inputDf = this.getWidget("Label_dfScore");
        this.inputGiveStart = this.getWidget("Label_startScore");
        this.inputQzbd = this.getWidget("Label_qzbd");
        this.inputXpkf = this.getWidget("Label_xpkf");

        this.inputJoin.setString("");
        this.inputExit.setString("");
        this.inputScore.setString("");
        this.inputDf.setString("");
        this.inputGiveStart.setString("");
        this.inputQzbd.setString("");
        this.inputXpkf.setString("");


        //输入金额
        var widgetInput = {"Image_join" : 1  , "Image_exit" : 2,"Image_score":3,"Image_score_df":4,"Image_score_start":7,"Image_score_qzbd":8,
            "Image_range1_1":31,"Image_range1_2":32,"Image_range2_1":33,"Image_range2_2":34,"Image_range3_2":35,"Image_xpkf":36};
        this.addDtzClickEvent(widgetInput,this.onInputNumber);



        this.showInitData();

        this.addCustomEvent(SyEvent.UPDATA_CREDIT_NUM,this,this.upDateCreditNum);

        this.btn_help = this.getWidget("btn_help");
        this.btn_help.addTouchEventListener(this.onClickHelpBtn,this);

        var Label_tips = this.getWidget("Label_tips");
        Label_tips.visible = ClickClubModel.getIsSwitchCoin()
    },

    updateBDZS:function(){
        this.getWidget("Panel_giveRange").setVisible(this.isAAPay == 0);
        this.getWidget("Image_score_start").setVisible(this.isAAPay == 0);
        this.getWidget("Label_22").setVisible(this.isAAPay == 0);
    },

    onClickHelpBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            this.showHelp(true);
        }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
            this.showHelp(false);
        }
    },

    showHelp:function(isShow){
        if(isShow){
            if(!this.helpBg){
                var di = cc.Scale9Sprite("res/ui/bjdmj/di.png");
                di.setContentSize(300,200);
                di.setPosition(cc.winSize.width/2 + 20,cc.winSize.height/2 + 50);
                this.addChild(di,2);

                this.helpBg = di;

                var str  = "该保底赠送分在未产生赠送分且比赛输赢分不为0时触发，且仅提供给群主,不参与赠送分成";

                var label = new cc.LabelTTF(str,"Arial",24);
                label.setColor(cc.color.BLACK);
                label.setDimensions(cc.size(di.width - 40,0));
                label.setPosition(di.width/2,di.height/2);
                di.addChild(label);
            }
            this.helpBg.setVisible(true);
        }else{
            this.helpBg && this.helpBg.setVisible(false);
        }
    },

    upDateCreditNum: function(event) {
        var data = event.getUserData();
        var temp = data.temp;
        var num = data.num;
        var numStr = Number(num);
        cc.log("this.index===",temp,num)
        if (temp == 1){
            if ( numStr <= 0){
                FloatLabelUtil.comText("不能小于等于0");
                return
            }else if ( numStr < this.exitScore){
                FloatLabelUtil.comText("不能小于踢出分");
                return
            }
            this.joinScore = numStr;
            this.inputJoin.setString(numStr);
        }else if (temp == 2){
            if ( numStr <= 0){
                FloatLabelUtil.comText("不能小于等于0");
                return
            }else if ( numStr > this.joinScore){
                FloatLabelUtil.comText("不能大于参与分");
                return
            }
            this.exitScore = numStr;
            this.inputExit.setString(numStr);
        }else if (temp == 3){
            var str = numStr;
            if (this.giveType == 2){
                if ( numStr < 0 || numStr > 100){
                    FloatLabelUtil.comText("比例不能超过100%");
                    return
                }
                str = str + "%";
            }
            for(var i = 1; i <= 3; i++) {
                if (numStr < Number(this["Label_keep" + i].getString())) {
                    FloatLabelUtil.comText("赠送群主分不能小于赠送保底值");
                    return
                }
            }
            //cc.log("numScoreMin==",numScoreMin);
            this.giveScore = numStr;
            this.inputScore.setString(str);
        }else if (temp == 4){
            if ( numStr <= 0){
                FloatLabelUtil.comText("不能小于等于0");
                return
            }
            this.dfScore = numStr;
            this.inputDf.setString(numStr);
        }else if (temp == 7){
            if ( numStr <= 0){
                FloatLabelUtil.comText("不能小于等于0");
                return
            }

            if ( numStr <= this.giveScore){
                FloatLabelUtil.comText("初始赠送分必须大于赠送分");
                return
            }
            var rangeScoreMax = 0;
            for(var i = 1; i <= 2; i++) {
                if (Number(this["Label_range" + i].getString()) > rangeScoreMax) {
                    rangeScoreMax = Number(this["Label_range" + i].getString());
                }
            }

            if (numStr <  rangeScoreMax){
                FloatLabelUtil.comText("赠送初始分不能小于保底区间值");
                return
            }
            this["Label_range" + 3].setString("" + numStr);
            this.giveStart = numStr;
            this.inputGiveStart.setString(numStr);
        }else if(temp == 8){
            if ( numStr < 0){
                FloatLabelUtil.comText("不能小于0");
                return
            }
            if ( numStr > this.giveScore){
                FloatLabelUtil.comText("群主保底赠送分不能大于赠送分");
                return
            }
            this.qzbdFen = numStr;
            this.inputQzbd.setString(numStr);
        }else if (temp >= 31 && temp <= 35){
            var rangeParams = [31,33];
            var keepParams = [32,34,35];
            var giveScoreNum = 0;
            var rangeScoreMax = 0;
            for(var i = 1; i <= 3; i++){
                giveScoreNum = giveScoreNum + Number(this["Label_keep"+i].getString());
                //cc.log("keepParams[i-1]==",keepParams[i-1],temp)
                if (temp == keepParams[i-1]){
                    if (numStr > this.giveScore){
                        FloatLabelUtil.comText("保底值不能大于赠送群主分");
                        return
                    }
                    this["Label_keep"+i].setString(""+numStr);
                }
                if (temp == rangeParams[i-1]){
                    if ( i == 1 && numStr > Number(this["Label_range" + (i+1)].getString()) && Number(this["Label_range" + (i+1)].getString()) != 0){
                        FloatLabelUtil.comText("赠送区间1不能大于赠送区间2");
                        return
                    }else if ( i == 2 && numStr <  Number(this["Label_range" + (i-1)].getString()) && Number(this["Label_range" + (i-1)].getString()) != 0 ){
                        FloatLabelUtil.comText("赠送区间2不能小于赠送区间1");
                        return
                    }
                    if (numStr > this.giveStart){
                        FloatLabelUtil.comText("赠送区间不能大于赠送初始分");
                        return
                    } else if (numStr < this.giveStart){
                        this["Label_rangeNum" + (i + 1)].setString("" + (numStr + 0.01));
                    }
                    this["Label_range"+i].setString(""+numStr);
                }
            }
        }else if(temp == 36){
            if ( numStr < 0){
                FloatLabelUtil.comText("不能小于0");
                return
            }
            if ( numStr >= 100){
                FloatLabelUtil.comText("洗牌扣分不能大于100分");
                return
            }
            this.xpkfFen = numStr;
            // this.qzbdFen = numStr;
            this.inputXpkf.setString(numStr);
        }

        //cc.log("upDateCreditNum",temp,num)
    },

    onInputNumber: function(obj) {
        var temp = obj.temp;
        var mc = new ClubCreditInputPop(temp);
        PopupManager.addPopup(mc);
    },

    showInitData: function() {
        var _xpBool = this.isXiPai == 1?true:false;
        this.CheckBox_xipai.setSelected(_xpBool);
        var _aapayBool = this.isAAPay == 1?true:false;
        this.CheckAAPay.setSelected(_aapayBool);
        this.Image_xpkf.setVisible(_xpBool);
        this.inputJoin.setString(this.joinScore);
        this.inputExit.setString(this.exitScore);
        var str = this.giveScore;
        if (this.giveType == 2){
            str = str + "%";
        }
        this.inputScore.setString(str);
        this.inputDf.setString(this.dfScore);
        this.inputGiveStart.setString(this.giveStart);
        this.inputQzbd.setString(this.qzbdFen);
        this.inputXpkf.setString(this.xpkfFen);

        this.Panel_giveRange = this.getWidget("Panel_giveRange");
        this.Image_range1_1 = this.Panel_giveRange.getChildByName("Image_range1_1");
        this.Label_range1 = this.Image_range1_1.getChildByName("Label_range1_1");
        this.Image_range2_1 = this.Panel_giveRange.getChildByName("Image_range2_1");
        this.Label_range2 = this.Image_range2_1.getChildByName("Label_range2_1");
        this.Label_range3 = this.Panel_giveRange.getChildByName("Label_range3_1");

        this.Label_rangeNum1 = this.Panel_giveRange.getChildByName("Label_rangeNum1");
        this.Label_rangeNum2 = this.Panel_giveRange.getChildByName("Label_rangeNum2");
        this.Label_rangeNum3 = this.Panel_giveRange.getChildByName("Label_rangeNum3");


        this.Image_range1_2 = this.Panel_giveRange.getChildByName("Image_range1_2");
        this.Image_range2_2 = this.Panel_giveRange.getChildByName("Image_range2_2");
        this.Image_range3_2 = this.Panel_giveRange.getChildByName("Image_range3_2");
        this.Label_keep1 = this.Image_range1_2.getChildByName("Label_range1_2");
        this.Label_keep2 = this.Image_range2_2.getChildByName("Label_range2_2");
        this.Label_keep3 = this.Image_range3_2.getChildByName("Label_range3_2");

        this.updateBDZS();

        if (this.giveRanges){
            var sParams = this.giveRanges.split("#");
            for(var i = 1; i <= sParams.length; i++){
                var eParams = sParams[i-1].split("|");
                //cc.log("this.giveRanges==",this.giveRanges,sParams,eParams)
                this["Label_keep"+i].setString(""+MathUtil.toDecimal(eParams[2]/100));
                this["Label_range"+i].setString(""+MathUtil.toDecimal(eParams[1]/100));
                this["Label_rangeNum"+i].setString(""+MathUtil.toDecimal(eParams[0]/100));
            }
        }else{
            for(var i = 1; i <= 3; i++) {
                this["Label_keep"+i].setString(""+this.qzbdFen || 0);
                this["Label_range"+i].setString(""+0);
                this["Label_rangeNum"+i].setString(""+0);
            }
        }


        var giveStartStr = this.inputGiveStart.getString();
        this.Label_range3.setString(""+giveStartStr);

    },

    initData: function() {
        cc.log("this.creditParms =",JSON.stringify(this.creditParms));
        //最低参加分
        this.joinScore = this.creditParms[0] || 1;
        //最低踢出分
        this.exitScore = this.creditParms[1] || 1;
        //底分
        this.dfScore = this.creditParms[2] || 1;
        //赠送分
        this.giveScore = this.creditParms[3] || 0;
        //1固定2比例
        this.giveType = this.creditParms[4] || 1;
        //1大赢家2是AA制
        this.giveWay = this.creditParms[5] || 1;
        //赠送初始分
        this.giveStart = this.creditParms[6] || 0;
        //是否除以100
        this.isDivide = this.creditParms[7] || 0;
        //群主保底赠送分
        this.qzbdFen = this.creditParms[8] || 0;
        //是否选择洗牌
        this.isXiPai = this.creditParms[10] || 0;
        //洗牌扣分
        this.xpkfFen = this.creditParms[11] || 0;
        //是否AA支付
        this.isAAPay = Math.floor(this.creditParms[12] || 0);
    },

    isHasData: function(_string) {
        if (!_string || _string == "") {
            return false;
        }
        return true;
    },

    /**
     * ---------------------
     *作者：o向阳花o
     *来源：CSDN
     *原文：https://blog.csdn.net/w_han__/article/details/78048757
     *版权声明：本文为博主原创文章，转载请附上博文链接！
     **/
    isNumberOrCharacter: function(_string) {
        var charecterCount = 0;
        for(var i=0; i < _string.length; i++){
            var character = _string.substr(i,1);
            var temp = character.charCodeAt();
            if (48 <= temp && temp <= 57){

            }else if(temp == 88){
                charecterCount += 1;
            }else if(temp == 120){
                charecterCount += 1;
            }else{
                return false;
            }
        }
        if(charecterCount <= 1){
            return true
        }
    },

    onGiveType:function(obj){
        var values = [1,2];
        var temp = obj.temp;
        if (this.giveType != obj.temp){
            this.giveScore = 0;
            this.inputScore.setString(this.giveScore);
        }
        for (var i = 1; i <= values.length ;i++){
            var btn = this.getWidget("Button_give"+i);
            var text = this.getWidget("Label_give"+i);
            if (temp == values[i-1]){
                btn.setBright(true);
                text.setColor(cc.color(254 , 115 , 34))
            }else{
                btn.setBright(false);
                text.setColor(cc.color(93 , 33 , 7));
            }
        }
        this.giveType = temp;
    },

    displayGiveType:function(){
        var values = [1,2];
        for (var i = 1; i <= values.length ;i++){
            var btn = this.getWidget("Button_give"+i);
            var text = this.getWidget("Label_give"+i);
            if (this.giveType == values[i-1]){
                btn.setBright(true);
                text.setColor(cc.color(254 , 115 , 34))
            }else{
                btn.setBright(false);
                text.setColor(cc.color(93 , 33 , 7));
            }
        }

    },

    onGiveWay:function(obj){
        var values = [1,2];
        var temp = obj.temp;
        for (var i = 1; i <= values.length ;i++){
            var btn = this.getWidget("Button_giveWay"+i);
            var text = this.getWidget("Label_giveWay"+i);
            if (temp == i){
                btn.setBright(true);
                text.setColor(cc.color(254 , 115 , 34))
            }else{
                btn.setBright(false);
                text.setColor(cc.color(93 , 33 , 7));
            }
        }
        this.giveWay = values[temp -1];
    },

    displayGiveWay:function(){
        var values = [1,2];
        for (var i = 1; i <= values.length ;i++){
            var btn = this.getWidget("Button_giveWay"+i);
            if (this.giveWay == values[i-1]){
                this.onGiveWay(btn);
            }
        }
    },

    onTrue:function(){
        var giveRanges = "";
        var rangeNum1 = Number(this["Label_range" + 1].getString());
        var rangeNum2 = Number(this["Label_range" + 2].getString());
        var giveNum2 = Number(this["Label_rangeNum" + 2].getString());
        var giveNum3 = Number(this["Label_rangeNum" + 3].getString());
        var rangeSParams = [0,giveNum2,giveNum3];
        var rangeEParams = [rangeNum1,rangeNum2,this.giveStart];
        for(var i = 1; i <= 3; i++){
            var keepNum = this["Label_keep"+i].getString();
            if ( i == 3){
                giveRanges = giveRanges + Math.round(rangeSParams[i-1]*100) + "|" + Math.round(rangeEParams[i-1]*100) + "|" + Math.round(keepNum*100);
            }else{
                giveRanges = giveRanges + Math.round(rangeSParams[i-1]*100) + "|" + Math.round(rangeEParams[i-1]*100) + "|" + Math.round(keepNum*100) + "#";
            }

        }
        //cc.log("giveRanges====",giveRanges)
        var creditParms = [this.joinScore,this.exitScore,this.dfScore,this.giveScore,this.giveType,this.giveWay,
            this.giveStart,this.isDivide,this.qzbdFen,giveRanges,this.isXiPai,this.xpkfFen,this.isAAPay];
        SyEventManager.dispatchEvent(SyEvent.UPDATA_CREDIT_PARMS,creditParms);
        // cc.log("creditParms =",JSON.stringify(creditParms));
        //return creditParms;
        PopupManager.remove(this);
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    getWidget:function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    addDtzClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            //cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

})