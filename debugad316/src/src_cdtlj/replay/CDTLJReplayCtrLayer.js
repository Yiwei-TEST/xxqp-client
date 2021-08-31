/**
 * Created by cyp on 2019/10/10.
 */
var CDTLJReplayCtrLayer = cc.Layer.extend({
    step:0,
    isPause:false,
    _dt:0,
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

    onEnterTransitionDidFinish:function(){
        this._super();

        this.scheduleUpdate();
    },

    initLayer:function(){
        this.bg_btn = new cc.Sprite("res/ui/replay/playback.png");
        this.bg_btn.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 90);
        this.addChild(this.bg_btn);

        this.btn_left = new ccui.Button("res/ui/replay/playback1.png","res/ui/replay/playback1.png","");
        this.btn_left.setPosition(this.bg_btn.width/2 -235,this.bg_btn.height/2);
        this.bg_btn.addChild(this.btn_left,1);

        this.btn_play = new ccui.Button("res/ui/replay/playback3.png","res/ui/replay/playback3.png","res/ui/replay/playback5.png");
        this.btn_play.setPosition(this.bg_btn.width/2 -80,this.bg_btn.height/2);
        this.bg_btn.addChild(this.btn_play,1);

        this.btn_right = new ccui.Button("res/ui/replay/playback2.png","res/ui/replay/playback2.png","");
        this.btn_right.setPosition(this.bg_btn.width/2 + 80,this.bg_btn.height/2);
        this.bg_btn.addChild(this.btn_right,1);

        this.btn_back = new ccui.Button("res/ui/replay/playback4.png","res/ui/replay/playback4.png","");
        this.btn_back.setPosition(this.bg_btn.width/2 + 235,this.bg_btn.height/2);
        this.bg_btn.addChild(this.btn_back,1);


        this.btn_left.addTouchEventListener(this.onClickBtn,this);
        this.btn_play.addTouchEventListener(this.onClickBtn,this);
        this.btn_right.addTouchEventListener(this.onClickBtn,this);
        this.btn_back.addTouchEventListener(this.onClickBtn,this);

        this.label_step = UICtor.cLabel("进度:1/15",45);
        this.label_step.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 200);
        this.label_step.setColor(cc.color.YELLOW);
        this.addChild(this.label_step);

        this.label_hfm = UICtor.cLabel("回放码:" + BaseRoomModel.curHfm,36);
        this.label_hfm.setAnchorPoint(0.5,1);
        this.label_hfm.setPosition(cc.winSize.width/2,this.bg_btn.y + this.bg_btn.height/2);
        this.addChild(this.label_hfm);
    },

    setShowStep:function(){
        this.label_step.setString("进度:" + (this.step) + "/" + CDTLJReplayMgr.msgArr.length);
    },

    autoPlay:function(){
        if(this.step < CDTLJReplayMgr.msgArr.length - 1){
            this.step++;
            CDTLJReplayMgr.sendPlayMsg(this.step);
            this.setShowStep();
        }else if(this.step == CDTLJReplayMgr.msgArr.length - 1){
            CDTLJReplayMgr.sendOverMsg();

            this.setPause(true);
        }
    },

    update:function(dt){
        this._dt += dt;
        if(this._dt > 1.5){
            this._dt = 0;

            if(!this.isPause){
                this.autoPlay();
            }
        }
    },


    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_back){
                var parent = this.getParent();
                PopupManager.remove(parent);
            }else if(sender == this.btn_right){
                if(this.step < CDTLJReplayMgr.tablesArr.length - 1){
                    this._dt = 0;

                    this.step += 4;
                    if(this.step >= CDTLJReplayMgr.tablesArr.length){
                        this.step = CDTLJReplayMgr.tablesArr.length - 1;
                    }

                    CDTLJReplayMgr.sendTableMsg(this.step);
                    this.setShowStep();

                }

            }else if(sender == this.btn_left){
                if(this.step > 0){
                    this._dt = 0;

                    this.step -= 4;
                    if(this.step < 0){
                        this.step = 0;
                    }
                    CDTLJReplayMgr.sendTableMsg(this.step);
                    this.setShowStep();
                }

            }else if(sender == this.btn_play){
                this.setPause(!this.isPause);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    setPause:function(isPause){
        this.isPause = isPause;
        this.btn_play.setBright(!this.isPause);
    },
});