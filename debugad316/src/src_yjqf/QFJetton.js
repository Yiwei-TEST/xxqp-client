/**
 * Created by Administrator on 2017/7/5.
 */
/**
 * Created by zhoufan on 2016/10/22.
 */
var QFJetton = cc.Sprite.extend({

    ctor:function(){
        this._super("res/res_yjqf/images/coin_icon.png");
    },
    reuse:function() {
    },
    unuse:function() {
        this.retain();
    }

});

QFJetton.getFromPool = function(){
    if(cc.pool.hasObject(QFJetton)) {
        return cc.pool.getFromPool(QFJetton);
    }else{
        return new QFJetton();
    }
};

/**
 *
 * @param root
 * @param fromPlayer {pos}
 * @param targetPlayer {pos}
 * @param isDisPatch {boolean}
 */
QFJetton.runEffect = function(root,fromPlayer,targetPlayer,isDisPatch , coinNumber){
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
                // target.playJettonArmature();
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

    var targetX = targetPlayer.getContainer().x;
    var targetY = targetPlayer.getContainer().y; //- 40
    cc.log("targetX , targetY..." , targetX , targetY);
    var x = fromPlayer.x;
    var y = fromPlayer.y;

    for(var i = 0;i < MAX; i ++){
        var sprite = QFJetton.getFromPool();

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