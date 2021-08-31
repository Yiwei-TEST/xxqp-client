var CoolProgress = cc.Node.extend({
    progressCooling : null, // 进度条
    ctor : function(resNormal, resProgress, defaultPrecent , timelabelFnt , defalutBeginTime) {
        this._super();

        this.sprStencil = new cc.Sprite(resNormal);
        this.sprStencil.attr({
            x : 0,
            y : 0
        });
        this.sprStencil.scale = 0.90;
        this.addChild(this.sprStencil, 2);

        var font = "res/font/bbt_scorte.fnt";
        this.timeLabel = new cc.LabelBMFont(defalutBeginTime + "", font);
        this.timeLabel.anchorX = this.timeLabel.anchorY = 0.5;
        this.timeLabel.scale = 0.85;
        this.timeLabel.x = this.timeLabel.y = 0;
        if(this.timeLabel){
            this.addChild(this.timeLabel , 10 , 10);
        }

        this.progressSp = new cc.Sprite(resProgress);
        this.progressSp.attr({
            x : 0,
            y : 0
        });

        this.progressCooling = new cc.ProgressTimer(this.progressSp);
        this.progressCooling.setType(cc.ProgressTimer.TYPE_RADIAL);
        this.progressCooling.setPercentage(defaultPrecent);  // 回复到0
        this.progressCooling.attr({
            x : 0,
            y : 0
        });
        this.addChild(this.progressCooling, 5);
    },

    ///**
    // * 主动启用定时器
    // * 暂未使用
    // */
    //beginProgress : function(needTime, beginPrecent , endPrecent) {
    //    needTime = needTime || 1;
    //    this.setString(needTime);
    //    this.progressCooling.stopAllActions();
    //    this.progressCooling.setPercentage(beginPrecent);
    //    this.visible = true;
    //    if(this.progressCooling){
    //        this.progressCooling.runAction(cc.sequence(cc.progressTo(needTime + 1, endPrecent),//30s的动画 为了看到1 执行31s
    //            cc.callFunc(this.coolEndCallback, this)));
    //    }
    //},

    setPercentage:function(newPrecent){
        if(this.progressCooling){
            this.progressCooling.setPercentage(newPrecent);
        }else{
            cc.log("this.progressCooling error" , this.progressCooling);
        }

    },

    getTimeLabel:function(){
        return this.timeLabel;
    },

    setString:function(newTime){
        if(this.timeLabel) {
            this.timeLabel.setString(newTime + "");
        }else{
            cc.log("this.timeLabel error" , this.timeLabel);
        }
    },

    coolEndCallback : function() {
        this.progressCooling.setPercentage(0);  // 回复到0
        this.visible = false;
    }
});