/**
 * Created by cyp on 2019/6/27.
 * 叫分按钮层
 */
var SDHJiaoFenBtnLayer = cc.Layer.extend({
    curFen:110,
    ctor:function(){
        this._super();

        this.initLayer();
    },

    handleTableData:function(type,data){
        if(type == SDHTabelType.CreateTable){
            this.setJiaPaiState();
            if(SDHRoomModel.remain == 1 &&SDHRoomModel.nextSeat == SDHRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.countTime();
                this.setJiaoFenBtnState(SDHRoomModel.ext[1],SDHRoomModel.ext[4]);
            }else{
                this.layerBg.setVisible(false);
            }
        }else if(type == SDHTabelType.DealCard){
            this.setJiaPaiState();
            this.layerBg.setVisible(false);
            if(data.nextSeat == SDHRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.countTime();
                this.setJiaoFenBtnState(0,false);
            }
        }else if(type == SDHTabelType.JiaoFen){
            var params = data.params;
            if(params[3] == SDHRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.countTime();
                this.setJiaoFenBtnState(SDHRoomModel.ext[1],SDHRoomModel.ext[4]);
            }else{
                this.layerBg.setVisible(false);
            }
        }
        if(SDHRoomModel.replay){//回放不显示
            this.layerBg.setVisible(false);
        }
    },

    initLayer:function(){
        var bg = new ccui.ImageView("res/res_sdh/dia.png");
        bg.setAnchorPoint(0.5,0);
        bg.setScale9Enabled(true);
        bg.setCapInsets(cc.rect(bg.width/3,bg.height/3,bg.width/3,bg.height/3));
        bg.setPosition(cc.winSize.width/2,410);
        this.addChild(bg);

        this.layerBg = bg;
        this.layerBg.setVisible(false);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                if(bg.isVisible() && cc.rectContainsPoint(bg.getBoundingBox(),touch.getLocation())){
                    return true;
                }
                return false;
            }
        }), this);

        var tipStr = "拍分说明:选拍后只能叫分50分及以下的分值，选拍后输赢翻倍";
        var label_pf_tip = UICtor.cLabel(tipStr,36);
        label_pf_tip.setPosition(bg.width/2,30);
        bg.addChild(label_pf_tip,1);

        var qijiaofen = SDHRoomModel.intParams[9] || 80;
        if(SDHRoomModel.intParams[9] == 1){
            qijiaofen = 60;
        }

        var fenArr = [];
        for(var i = qijiaofen;i >= 5;i-=5){
            fenArr.push(i);
        }

        var startY = 225;
        if(fenArr.length > 16){
            bg.setContentSize(bg.width,bg.height + 113);
            startY = 338;
        }

        this.jiaoFenBtnArr = [];
        var offsetX = 180;
        for(var i = 0;i<fenArr.length;++i){
            var btn = new ccui.Button("res/res_sdh/jf.png","res/res_sdh/jf.png","res/res_sdh/jf1.png");
            btn.setPosition(210 + (i%8)*offsetX,startY - Math.floor(i/8)*113);
            btn.addTouchEventListener(this.onClickJiaoFenBtn,this);
            bg.addChild(btn,1);

            var shuzi = fenArr[i];
            btn.flag = shuzi;
            btn.setTitleFontName("res/res_sdh/font/jiaofen2.fnt");
            btn.setTitleText(shuzi);

            this.jiaoFenBtnArr.push(btn);
        }

        this.checkBox_paifen = new ccui.CheckBox("res/res_sdh/pai1.png","","res/res_sdh/pai.png","","res/res_sdh/pai3.png");
        this.checkBox_paifen.addEventListener(this.onClickPaiFen,this);
        this.checkBox_paifen.setPosition(bg.width - 230,startY);
        bg.addChild(this.checkBox_paifen,1);

        var btn_bujiao = new ccui.Button("res/res_sdh/anniu_bujiao_1.png","res/res_sdh/anniu_bujiao_1.png","res/res_sdh/anniu_bujiao_2.png");
        btn_bujiao.setPosition(bg.width - 230,startY - 113);
        btn_bujiao.setScale(1.38);
        btn_bujiao.addTouchEventListener(this.onClickJiaoFenBtn,this);
        btn_bujiao.flag = 0;
        bg.addChild(btn_bujiao,1);

        this.btn_bujiao = btn_bujiao;

        var spr = new cc.Scale9Sprite("res/res_sdh/dushi.png");
        spr.setAnchorPoint(1,0.5);
        this.progressBar = new cc.ProgressTimer(spr);
        this.progressBar.setPosition(bg.width/2,bg.height - 9);
        this.progressBar.setBarChangeRate(cc.p(1,0));
        this.progressBar.setMidpoint(cc.p(1,0));
        this.progressBar.setType(cc.ProgressTimer.TYPE_BAR);
        bg.addChild(this.progressBar,1);
        this.progressBar.setPercentage(100);
    },

    setJiaPaiState:function(){
        var canJiaPai = SDHRoomModel.intParams[12] == 1;
        this.checkBox_paifen.setBright(canJiaPai);
        this.checkBox_paifen.setTouchEnabled(canJiaPai);

        this.checkBox_paifen.setSelected(false);

    },

    setJiaoFenBtnState:function(curFen,isPai,isClickPai){
        if(!isClickPai)this.curFen = curFen;

        if(curFen == 0){
            curFen = isPai?55:110;
        }

        for(var i = 0;i<this.jiaoFenBtnArr.length;++i){
            var btn = this.jiaoFenBtnArr[i];
            var canOpt = btn.flag < curFen;
            btn.setBright(canOpt);
            btn.setTouchEnabled(canOpt);
            btn.setTitleFontName(canOpt?"res/res_sdh/font/jiaofen2.fnt":"res/res_sdh/font/jiaofen1.fnt");

        }
        if(isPai == 1){
            this.checkBox_paifen.setSelected(true);
            this.checkBox_paifen.setTouchEnabled(false);
        }else if(isPai == 2){
            this.checkBox_paifen.setBright(false);
            this.checkBox_paifen.setTouchEnabled(false);
        }
    },

    onClickPaiFen:function(target,type){
        var fen  = this.curFen;
        if(type == ccui.CheckBox.EVENT_SELECTED){
            if(fen > 0)fen = Math.min(this.curFen,55);
            else fen = 55;
        }
        this.setJiaoFenBtnState(fen,false,true);
    },

    onClickJiaoFenBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            var pai = this.checkBox_paifen.isSelected()?1:0;
            if(sender.flag == 0)pai = 0;
            sySocket.sendComReqMsg(3100,[sender.flag,pai]);


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    countTime:function(){
        var time = SDHRoomModel.getCountTime();

        this.progressBar.stopAllActions();
        this.progressBar.setPercentage(100);
        var action = new cc.ProgressTo(time - 5,1);
        this.progressBar.runAction(cc.sequence(action,cc.blink(10,10)));
    },
});