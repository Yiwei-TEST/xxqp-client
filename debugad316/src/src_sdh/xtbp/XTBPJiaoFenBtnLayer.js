/**
 * Created by cyp on 2019/6/27.
 * 叫分按钮层
 */
var XTBPJiaoFenBtnLayer = cc.Layer.extend({
    curFen:0,
    ctor:function(){
        this._super();

        this.initLayer();
    },

    handleTableData:function(type,data){
        if(type == SDHTabelType.CreateTable){
            if(SDHRoomModel.remain == 1 &&SDHRoomModel.nextSeat == SDHRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.countTime();
                this.setJiaoFenBtnState(SDHRoomModel.ext[1]);
            }else{
                this.layerBg.setVisible(false);
            }
        }else if(type == SDHTabelType.DealCard){
            this.layerBg.setVisible(false);
            if(data.nextSeat == SDHRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.countTime();
                this.setJiaoFenBtnState(0);
            }
        }else if(type == SDHTabelType.JiaoFen){
            var params = data.params;
            if(params[3] == SDHRoomModel.mySeat){
                this.layerBg.setVisible(true);
                this.countTime();
                this.setJiaoFenBtnState(SDHRoomModel.ext[1]);
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
        bg.setContentSize(bg.width,bg.height + 45);
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

        this.jiaoFenBtnArr = [];
        var offsetX = 180;
        for(var i = 0;i<25;++i){
            var btn = new ccui.Button("res/res_sdh/jf.png","res/res_sdh/jf.png","res/res_sdh/jf1.png");
            btn.setPosition(250 + (i%9)*offsetX,bg.height - 75 - Math.floor(i/9)*113);
            btn.addTouchEventListener(this.onClickJiaoFenBtn,this);
            bg.addChild(btn,1);

            var shuzi = 80 + 5*i;
            btn.flag = shuzi;
            btn.setTitleFontName("res/res_sdh/font/jiaofen2.fnt");
            btn.setTitleText(shuzi);

            this.jiaoFenBtnArr.push(btn);
        }

        var btn_bujiao = new ccui.Button("res/res_sdh/anniu_bujiao_1.png","res/res_sdh/anniu_bujiao_1.png","res/res_sdh/anniu_bujiao_2.png");
        btn_bujiao.setPosition(bg.width - 360,bg.height - 300);
        btn_bujiao.setScale(1.38);
        btn_bujiao.addTouchEventListener(this.onClickJiaoFenBtn,this);
        btn_bujiao.flag = 0;
        bg.addChild(btn_bujiao,1);

        this.btn_bujiao = btn_bujiao;

        var spr = new cc.Scale9Sprite("res/res_sdh/dushi.png");
        spr.setAnchorPoint(1,0.5);
        this.progressBar = new cc.ProgressTimer(spr);
        this.progressBar.setPosition(bg.width/2,343);
        this.progressBar.setBarChangeRate(cc.p(1,0));
        this.progressBar.setMidpoint(cc.p(1,0));
        this.progressBar.setType(cc.ProgressTimer.TYPE_BAR);
        bg.addChild(this.progressBar,1);
        this.progressBar.setPercentage(100);
    },

    setJiaoFenBtnState:function(curFen){
        this.curFen = curFen;

        for(var i = 0;i<this.jiaoFenBtnArr.length;++i){
            var btn = this.jiaoFenBtnArr[i];
            var canOpt = btn.flag > curFen;
            btn.setBright(canOpt);
            btn.setTouchEnabled(canOpt);
            btn.setTitleFontName(canOpt?"res/res_sdh/font/jiaofen2.fnt":"res/res_sdh/font/jiaofen1.fnt");

        }
    },

    onClickJiaoFenBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            sySocket.sendComReqMsg(3100,[sender.flag,0]);


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