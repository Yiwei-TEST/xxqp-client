/**
 * Created by Administrator on 2016/7/9.
 */
var QFRoomEffects = {

    getPlayerSeq:function(seat){
        var seqArray = QFRoomModel.seatSeq[QFRoomModel.mySeat];
        var seq = ArrayUtil.indexOf(seqArray,seat)+1;
        return seq;
    },

    arriveTarget:function(root,target,tplayer){
        tplayer.updatePointByBomb(20);
        var label = new cc.LabelBMFont("+20","res/font/font_res_huang.fnt");
        label.x = target.x;
        label.y = target.y-30;
        root.addChild(label,3000);
        label.runAction(cc.sequence(cc.moveTo(1,label.x,target.y+50),cc.callFunc(function(){
            label.removeFromParent(true);
        })));
    },

    addFloatLabel:function(root,startPlace,target,tplayer){
        var label = new cc.LabelBMFont("-10","res/font/font_res_hui.fnt");
        label.x = startPlace.x;
        label.y = startPlace.y;
        root.addChild(label,3000);
        var self = this;
        label.runAction(cc.sequence(cc.moveTo(1,target.x,target.y),cc.callFunc(function(){
            label.removeFromParent(true);
            if(tplayer)
                self.arriveTarget(root,target,tplayer);
        })));
    },


    finish:function(animate){
        animate.stop();
        animate.removeFromParent(true);
    },


    /**
     * 老版的播放效果
     */
    /**
     * 注意增加动画特效要增加 = null的初始化 !!!!
     * @param root
     * @param cardPattern {CardPattern}
     */
    play:function(root , cardPattern , showPos){

        if(this.root != root){ //全局性的特效一定要释放 (开始新的一个房间的时候)
            this.boomArmature = null;
            this.xiArmature = null;
            this.kingXiArmature = null;
            this.tongziArmature = null;
            this.superboomArmature = null;
            this.planeArmature = null;
            this.redNode = null;
        }
        this.root = root;
        if(!cardPattern)
            return;

        if(this.curArmature != null && this.isPlayArmature == true){//上一个还在播放
            this.curArmature.getAnimation().stop();
            this.curArmature.visible = false;
            this.isPlayArmature = false;
            this.redKuangEnd();
        }

        var type = cardPattern.type;
        var value = cardPattern.value;
        var plist = "";
        var prefix = "";
        var unit = 0;
        var x = root.width/2;
        var y = root.height/2;
        var exAction = null;
        var tScale = 1;

        if(showPos.x != 0 && showPos.y != 0){
            x = showPos.x;
            y = showPos.y;
        }

        if(type == QFAI.LIANDUI){
            plist = "res/plist/liandui.plist";
            prefix = "liandui";
            unit = 1/12;
        // }else if(type == QFAI.BOMB){
        //     plist = "res/plist/zhadan.plist";
        //     prefix = "zhadan";
        //     unit = 1/14;
        //     y += 80;
        //     //exAction = this.doudongAction();
        // }
        }else if(type == QFAI.PLANE){
            // plist = "res/plist/feiji.plist";
            // prefix = "feiji";
            // unit = 1/20;
            // x = root.width;
        }else if(type == QFAI.SHUNZI){
            plist = "res/plist/shunzi.plist";
            prefix = "shunzi";
            unit = 1/16;
        }
        if(plist!="" && prefix!="" && unit>0){
            var self = this;
            var action = null;
            var animate = new AnimateSprite(plist,prefix,unit);
            animate.x = x;
            animate.y = y;
            animate.scale = tScale;
            if(type == QFAI.PLANE || type == QFAI.PLANEWithCard){
                action = cc.sequence(cc.moveTo(1 , 0 , y),cc.callFunc(function(){ // root.height/2
                    self.finish(animate);
                }))
            }else{
                animate.setRepeatTimes(1);
                animate.setCallBack(this.finish,this);
            }
            animate.play();

            root.addChild(animate,1000);
            if(action){
                animate.runAction(action);
            }
        }
        if(exAction != null){
            //cc.log("显示抖动屏幕特效");
            this.root.runAction(exAction);
        }
    },

    //炸弹特效
    boomEffect:function(){
        //var x = this.root.width/2;
        //var y = this.root.height/2;
        //
        //    if(this.isPlayArmature){
        //        return;
        //    }
        //    this.isPlayArmature = true;
        //    if(!this.boomArmature){
        //        ccs.armatureDataManager.addArmatureFileInfo(
        //            "res/plist/dtzAM1.ExportJson");
        //        this.boomArmature = new ccs.Armature("dtzAM1");
        //        this.boomArmature.x = x;
        //        this.boomArmature.y = y;
        //        this.root.addChild(this.boomArmature,199);
        //        this.boomArmature.getAnimation().setFrameEventCallFunc(function(bone, evt) {
        //            cc.log("boomArmature evt..." , evt);
        //            if(evt == "showblink"){
        //                this.redKuangAction();
        //            }
        //            if(evt == "finish"){
        //                this.isPlayArmature = false;
        //                this.boomArmature.getAnimation().stop();
        //                this.boomArmature.visible = false;
        //                this.redKuangEnd();
        //            }
        //        }.bind(this));
        //    }
        //    this.boomArmature.visible = true;
        //    var self = this;
        //    this.boomArmature.getAnimation().play("dtzAM1",-1,0);
        //    this.curArmature = this.boomArmature;
            //AudioManager.play("res/audio/dn/jetton.mp3");
    },

    //飞机特效
    planeEffect:function(){
        var x = this.root.width/2;
        var y = this.root.height/2;

        if(this.isPlayArmature){
            return;
        }
        this.isPlayArmature = true;
        if(!this.planeArmature){
            ccs.armatureDataManager.addArmatureFileInfo(
                "res/plist/dtzAM5.ExportJson");
            this.planeArmature = new ccs.Armature("dtzAM5");
            this.planeArmature.x = x;
            this.planeArmature.y = y;
            this.root.addChild(this.planeArmature,199);
            this.planeArmature.getAnimation().setFrameEventCallFunc(function(bone, evt) {
                cc.log("planeArmature evt..." , evt);
                if(evt == "finish"){
                    self.isPlayArmature = false;
                    self.planeArmature.getAnimation().stop();
                    self.planeArmature.visible = false;
                    if(this.redNode){
                        this.redNode.visible = false;
                    }
                }
            });
        }
        this.planeArmature.visible = true;
        var self = this;
        this.planeArmature.getAnimation().play("dtzAM5",-1,0);
        this.curArmature = this.planeArmature;
        //AudioManager.play("res/audio/dn/jetton.mp3");

    },

    //创建并执行 红色底框闪烁动画
    redKuangAction:function(){

        var x = this.root.width/2;
        var y = this.root.height/2;

    },

    //销毁红色底框
    redKuangEnd: function () {
        if(this.redNode){
            this.redNode.removeFromParent();//这个不一定要删除 考虑做成只隐藏就行了
            this.redNode = null;

            //this.redNode.visible = false;
        }
    },

    //创建抖动动画
    doudongAction:function(rootNode){
        var doudongAction = null;
        cc.log("moveto..." , this.root.x , this.root.y);

        return doudongAction;
    },

}