/**
 * Created by Administrator on 2017/7/5.
 */
/**
 * Created by zhoufan on 2016/10/22.
 */
var ZZPHJetton = cc.Sprite.extend({

    ctor:function(){
        this._super("res/res_phz/zzph/coin_icon.png");
    },
    reuse:function() {
    },
    unuse:function() {
        this.retain();
    }

});

ZZPHJetton.getFromPool = function(){
    if(cc.pool.hasObject(ZZPHJetton)) {
        return cc.pool.getFromPool(ZZPHJetton);
    }else{
        return new ZZPHJetton();
    }
};

/**
 *
 * @param root
 * @param fromPlayer {pos}
 * @param targetPlayer {pos}
 * @param isDisPatch {boolean}
 */
ZZPHJetton.runEffect = function(root,fromPlayer,targetPlayer,isDisPatch , coinNumber){
    var MAX = coinNumber || 16;
    MAX > 16 ? 16 : MAX;
    var MAX_ZORDER = 2000;
    var runActionFunc = function(target,i,targetX,targetY,sprite){

        var action = cc.sequence(cc.delayTime(i*0.03),cc.moveTo(0.5,targetX,targetY),cc.callFunc(function(){
            sprite.setLocalZOrder(MAX_ZORDER+i);
            target.pushJettonData(sprite);
            if(target.getJettonCount()>10){
                target.shiftJettonData();
            }
        }));

        if(i == (MAX - 1)){//最后一个到达，将之前的金币全部移除
            cc.log("最后一个金币了 执行移除...");
            action = cc.sequence(cc.delayTime(i*0.03),cc.moveTo(0.5,targetX,targetY),cc.callFunc(function(){
                sprite.setLocalZOrder(MAX_ZORDER+i);
                target.pushJettonData(sprite);
                target.playJettonArmature();
            }),cc.delayTime(0.1),cc.callFunc(function(){
                target.cleanJettonData();
                if(isDisPatch){
                    //SyEventManager.dispatchEvent(SyEvent.DOUNIU_JETTON_FINISH,"");
                }
            }));
        }
        sprite.runAction(action);
    }

/*
    var targetX = targetPlayer.getContainer().x;
    var targetY = targetPlayer.getContainer().y;
    var x = fromPlayer.getContainer().x;
    var y = fromPlayer.getContainer().y;*/

    var targetX = targetPlayer.getContainer().x + targetPlayer.getContainer().width/4;
    var targetY = targetPlayer.getContainer().y + targetPlayer.getContainer().height/2; //- 40
    cc.log("targetX , targetY..." , targetX , targetY);
    var x = fromPlayer.getContainer().x+ targetPlayer.getContainer().width/4;
    var y = fromPlayer.getContainer().y+ targetPlayer.getContainer().height/2;

    for(var i = 0;i < MAX; i ++){
        var sprite = ZZPHJetton.getFromPool();

        sprite.x=x+MathUtil.mt_rand(-15,15);
        sprite.y=y+MathUtil.mt_rand(-15,15);
        targetX=targetX+MathUtil.mt_rand(-10,10);
        targetY=targetY+MathUtil.mt_rand(-15,15);

        /*
        sprite.x = x;
        sprite.y = y;
        targetX = targetX;
        targetY = targetY;
        */

        root.addChild(sprite,MAX_ZORDER-i);
        runActionFunc(targetPlayer,i,targetX,targetY,sprite);
    }
};