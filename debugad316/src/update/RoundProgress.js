var RoundProgress = cc.Node.extend({
    progressCooling : null, // 进度条
    ctor : function(resNormal, resProgress) {
        this._super();


        this.sprStencil = new cc.Sprite(resNormal);
        this.addChild(this.sprStencil, 2);


        this.progressSp = new cc.Sprite(resProgress);
        this.progressSp.anchorX = 0;
        this.progressSp.x = 8;
        this.progressSp.y = this.sprStencil.height/2 + 2;
        this.sprStencil.addChild(this.progressSp);
        this.progressSp.setTextureRect(cc.rect(0, 0, 0, 51));

    },



    setPercentage:function(percent){
        if(this.progressSp){
            var baseHeight = 604;
            var nowWidth = parseInt(baseHeight*(percent/100));
            this.progressSp.setTextureRect(cc.rect(0, 0, nowWidth, 51));
        }else{
        }

    },
});