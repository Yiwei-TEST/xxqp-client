/**
 * Created by zhoufan on 2016/8/12.
 */

var RecordAudioButton = cc.Sprite.extend({

    isBright:false,
    yuyin:null,

    ctor:function(yuyin,progCycle,btnImg,btnImgGray){
        this.yuyin = yuyin;
        this.progCycle = progCycle;
        this.btnImg = btnImg || "res/ui/common/pdkRoom_4.png";
        this.btnImgGray = btnImgGray || "res/ui/common/pdkRoom_5.png";
        this._super(this.btnImg);
        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        });
        cc.eventManager.addListener(this._touchListener, this);
        this.isBright = false;
        this.highlighted = false;
        this.lastRecordTime = 0;
        this.isStart = false;
        this.prog= new cc.ProgressTimer(new cc.Sprite(this.btnImg));
        this.prog.setMidpoint(cc.p(0,0));
        this.prog.setBarChangeRate(cc.p(0,1));
        this.prog.type=cc.ProgressTimer.TYPE_BAR;
        this.prog.setPercentage(100);
        this.prog.x = this.width/2;
        this.prog.y = this.height/2;
        this.addChild(this.prog);
    },

    hitTest: function (pt) {
        var bb = cc.rect(0,0,this.width, this.height);
        return cc.rectContainsPoint(bb, this.convertToNodeSpace(pt));
    },

    setBright:function(isBright){
        if(isBright==this.isBright)
            return;
        this.isBright = isBright;
        if(isBright){
            this.setTexture(this.btnImg);
        }else{
            this.setTexture(this.btnImgGray);
        }
    },

    onTouchBegan: function (touch, event) {
        if(!this.isBright || BaseRoomModel.isBanVoiceAndProps())
            return false;
        var touchPoint = touch.getLocation();
        var hit = false;
        if(this.hitTest(touchPoint))
            hit = true;
        if (!hit) {
            return false;
        }else{
            var now = new Date().getTime();
            if(now-this.lastRecordTime<1000)
                return false;
            this.highlighted = true;
            this.yuyin.visible = true;
            IMSdkUtil.startAudioRecord();
            if(!this.isStart){
                this.isStart = true;
                this.dt = 0;
                this.progCycle.setPercentage(0);
                this.schedule(this.onProgCycle,0.03);
            }
        }
        return true;
    },

    onProgCycle:function(dt){
        this.dt += dt;
        if(this.dt<10){
            this.progCycle.setPercentage((this.dt/10)*100);
        }else{
            this.unschedule(this.onProgCycle);
            this.isStart = false;
            this.onTouchEnded();
        }
    },

    onProgBar:function(dt){
        this.dt += dt;
        if(this.dt<2){
            this.prog.setPercentage((this.dt/2)*100);
        }else{
            this.setBright(true);
            this.unschedule(this.onProgBar);
        }
    },

    onTouchMoved:function(touch, event){
        var touchPoint = touch.getLocation();
        this.highlighted = this.hitTest(touchPoint);
    },

    onTouchEnded:function(touch, event){
        this.lastRecordTime = new Date().getTime();
        if(!this.yuyin.visible)
            return;
        this.yuyin.visible = false;
        if(this.isStart){
            this.unschedule(this.onProgCycle);
        }
        this.isStart = false;
        this.dt = 0;
        if(!this.highlighted){
            IMSdkUtil.stopAudioRecord(true);
            return;
        }
        this.highlighted = false;
        IMSdkUtil.stopAudioRecord(false);
        this.setBright(false);
        this.schedule(this.onProgBar,0.03);
    },

    onExit:function(){
        this.unscheduleAllCallbacks();
        if(this._touchListener)
            cc.eventManager.removeListener(this._touchListener);
        this._touchListener = null;
        this._super();
    }

})
