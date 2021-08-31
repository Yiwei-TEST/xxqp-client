/**
 * Created by cyp on 2019/10/9.
 */

var YYBSTouXiangTipLayer = cc.Layer.extend({
    _dt:0,
    _count:0,
    ctor:function(){
        this._super();

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
    },

    onEnter:function(){
        this._super();
    },

    initLayer:function(){
        var bg = new cc.Sprite("res/ui/bjdmj/popup/popup_bg_1.png");
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        var title = new cc.Sprite("res/ui/alertPop/alert_img_title.png");
        title.setPosition(bg.width/2,bg.height - 42);
        bg.addChild(title,1);

        var content_bg = new cc.Scale9Sprite("res/ui/setUp/scale9bg1.png");
        content_bg.setContentSize(1125,375);
        content_bg.setPosition(bg.width/2,bg.height/2);
        bg.addChild(content_bg,0);

        this.btn_agree = new ccui.Button("res/res_yybs/tongyi.png","res/res_yybs/tongyi.png","");
        this.btn_agree.setPosition(bg.width/2 + 200,100);
        this.btn_agree.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(this.btn_agree,1);

        this.btn_refuse = new ccui.Button("res/res_yybs/jujue.png","res/res_yybs/jujue.png","");
        this.btn_refuse.setPosition(bg.width/2 - 200,this.btn_agree.y);
        this.btn_refuse.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(this.btn_refuse,1);

        this.label_tip = UICtor.cLabel("这是提示信息",45);
        this.label_tip.setPosition(content_bg.width/2,content_bg.height/2);
        this.label_tip.setColor(cc.color(126,49,2));
        this.label_tip.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        content_bg.addChild(this.label_tip);

        this.label_time = UICtor.cLabel("",60);
        this.label_time.setPosition(bg.width - 120,bg.height - 50);
        this.label_time.setColor(cc.color(126,49,2));
        bg.addChild(this.label_time,1);

    },

    setLayerInfo:function(type,time){
        if(type == 1){
            this.btn_agree.setVisible(false);
            this.btn_refuse.setVisible(false);
            this.label_tip.setString("正在询问其他玩家是否同意投降");
        }else if(type == 2){
            this.btn_agree.setVisible(true);
            this.btn_refuse.setVisible(true);
            this.label_tip.setString("庄家投降,是否同意");
        }else if(type == 3){
            this.btn_agree.setVisible(false);
            this.btn_refuse.setVisible(false);
            this.label_tip.setString("已同意庄家投降,等待其他玩家选择");
        }
        this.setCountTime(parseInt(time/1000));
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_agree){
                sySocket.sendComReqMsg(3105,[2]);
            }else if(sender == this.btn_refuse){
                sySocket.sendComReqMsg(3105,[3]);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    setCountTime:function(time){
        if(time > 0){
            this._count = time;
            this.label_time.setString(time);
            this.scheduleUpdate();
            this._dt = 0;
        }
    },

    update:function(dt){
        this._dt += dt;
        if(this._dt > 1){
            this._dt = 0;

            this.countTime();
        }
    },

    countTime:function(){
        this._count--;
        if(this._count >= 0){
            this.label_time.setString(this._count);
        }else{
            this._count = 0;
            this.label_time.setString("");
            this.unscheduleUpdate();
        }
    },
});
