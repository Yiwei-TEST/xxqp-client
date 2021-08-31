/**
 * Created by Administrator on 2016/7/9.//
 */
var PDKRoomEffects = {

    getPlayerSeq:function(seat){
        var seqArray = PDKRoomModel.seatSeq[PDKRoomModel.mySeat];
        var seq = ArrayUtil.indexOf(seqArray,seat)+1;
        return seq;
    },

    arriveTarget:function(root,target,tplayer,beilv){
        var seat = tplayer._playerVo.seat;
        var seq = this.getPlayerSeq(seat);
        var point = (PDKRoomModel.renshu-1)*beilv;
        tplayer.updatePointByBomb(point);
        var label = new cc.LabelBMFont("+" + point,"res/font/font_res_huang.fnt");
        label.x = target.x;
        label.y = target.y-30;
        if(seq == 3 || seq == 1){
            label.anchorX = 0;
            label.x = target.x - 50;
        }else if(seq == 2){
            label.anchorX = 1;
            label.x = target.x + 50;
        }
        root.addChild(label,3000);
        label.runAction(cc.sequence(cc.moveTo(1,label.x,target.y+50),cc.callFunc(function(){
            label.removeFromParent(true);
        })));
    },

    addFloatLabel:function(root,startPlace,target,tplayer,point,seat,otherSeat){
        //汪海望要求修改动画
        var seq = this.getPlayerSeq(seat);
        var otherSeq = this.getPlayerSeq(otherSeat);
        var label = new cc.LabelBMFont("-"+point,"res/font/font_res_hui.fnt");
        label.x = startPlace.x;
        if(otherSeq == 3 || otherSeq == 1){
            label.anchorX = 0;
            label.x = startPlace.x - 50;
        }else if(otherSeq == 2){
            label.anchorX = 1;
            label.x = startPlace.x + 50;
        }
        label.y = startPlace.y;
        root.addChild(label,3000);
        var self = this;
        label.runAction(cc.sequence(cc.moveTo(1,label.x,startPlace.y+50),cc.callFunc(function(){
            label.removeFromParent(true);
        })));
        if(tplayer)
            this.arriveTarget(root,target,tplayer,point);
    },

    /**
     * 炸弹实时展示扣分效果
     * @param players {Array.<CardPlayer>}
     * @param root {UIWidget}
     * @param seat {number}
     */
    bomb:function(players,root,seat,beilv){
        var beilv = beilv || 1;
        var point = beilv*10;
        var target = ccui.helper.seekWidgetByName(root,"player"+this.getPlayerSeq(seat));
        var others = PDKRoomModel.seatSeq[seat];
        for(var i=0;i<others.length;i++){
            if(i>0){
                var otherSeat = others[i];
                var seq = this.getPlayerSeq(otherSeat);
                var startPlace = ccui.helper.seekWidgetByName(root,"player"+seq);
                players[otherSeat].updatePointByBomb(-point);
                var tplayer = (i==(others.length-1)) ? players[seat] : null;
                this.addFloatLabel(root,startPlace,target,tplayer,point,seat,otherSeat);
            }
        }
    },

    finish:function(animate){
        animate.stop();
        animate.removeFromParent(true);
    },

    getAniPos:function(type,seq){
        var _pos = {"x":0,"y":0};
        if(type == PDKAI.BOMB || type == PDKAI.PLANE){
            _pos.x = SyConfig.DESIGN_WIDTH/2;
            _pos.y = cc.winSize.height/2 + 100;
        }else{
            var temp = 600;
            if(PDKRoomModel.isMoneyRoom()){
                temp = 500;
            }
            if(seq == 1){
                _pos.x = SyConfig.DESIGN_WIDTH/2;
                _pos.y = cc.winSize.height/2 - 50;
            }else if(seq == 2){
                _pos.x = SyConfig.DESIGN_WIDTH/2 + temp;
                _pos.y = cc.winSize.height/2 + 150;
            }else if(seq == 3){
                _pos.x = SyConfig.DESIGN_WIDTH/2 - temp;
                _pos.y = cc.winSize.height/2 + 150;
            }
        }

        return _pos;
    },
    playForYLC:function(root,cardPattern,seq){
        if(!cardPattern)
            return;
        var type = cardPattern.type;
        // var type = PDKAI.BOMB;
        var prefix = "";
        var pos_x = this.getAniPos(type,seq).x;
        var pos_y = this.getAniPos(type,seq).y;
        if(type == PDKAI.BOMB){
            prefix = "baozhade";
        }else if(type == PDKAI.PLANE){
           prefix = "feijide";
        }else if(type == PDKAI.PAIR && cardPattern.length>2){
           prefix = "lianduide";
        }else if(type == PDKAI.SHUNZI){
           prefix = "shunzide";
        }else if(type == PDKAI.THREE){
            prefix = "sandaier";
        }

        ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/PDKAni/" + prefix + "/" + prefix + ".ExportJson");
        var armature = new ccs.Armature(prefix);
        armature.x = pos_x;
        if(type == PDKAI.PLANE){
            armature.x = 0;
        }
        armature.y = pos_y;
        root.addChild(armature,1000);
        armature.getAnimation().setMovementEventCallFunc(function (bone, evt) {
            if (evt == ccs.MovementEventType.complete) {
                armature.getAnimation().stop();
                armature.removeFromParent(true);
            }
        },this);
        armature.getAnimation().play("Animation1", -1, 0);
        if(type == PDKAI.PLANE){
             var controlPoints2 = [ cc.p(-10, pos_y),
                                cc.p(cc.winSize.width/2+600, pos_y-200),
                                cc.p(cc.winSize.width, cc.winSize.height)];
            var bezierTo1 = cc.bezierTo(2, controlPoints2);
            armature.runAction(bezierTo1);
            ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/PDKAni/feijide2/feijide2.ExportJson");
            var armature2 = new ccs.Armature("feijide2");
            armature2.x = pos_x;
            armature2.y = pos_y;
            root.addChild(armature2,1000);
            armature2.getAnimation().setMovementEventCallFunc(function (bone, evt) {
                if (evt == ccs.MovementEventType.complete) {
                    armature2.getAnimation().stop();
                    armature2.removeFromParent(true);
                }
            },this);
            armature2.getAnimation().play("Animation1", -1, 0);
        }
    },
    /**
     *
     * @param root
     * @param cardPattern {CardPattern}
     */
    play:function(root,cardPattern){
        if(!cardPattern)
            return;
        var type = cardPattern.type;
        var plist = "";
        var prefix = "";
        var unit = 0;
        var x = root.width/2;
        var y = root.height/2;
        // if(type == PDKAI.PAIR && cardPattern.length>2){
        //     plist = "res/plist/liandui.plist";
        //     prefix = "liandui";
        //     unit = 1/12;
        // }else if(type == PDKAI.BOMB){
        if(type == PDKAI.BOMB){
            plist = "res/plist/zhadan.plist";
            prefix = "zhadan";
            unit = 1/16;
            y+=80;
        }else if(type == PDKAI.PLANE){
            // plist = "res/plist/feiji.plist";
            // prefix = "feiji";
            // unit = 1/16;
            // x=root.width;
        }
        // }else if(type == PDKAI.SHUNZI){
        //     plist = "res/plist/shunzi.plist";
        //     prefix = "shunzi";
        //     unit = 1/16;
        // }
        if(plist!="" && prefix!="" && unit>0){
            var self = this;
            var action = null;
            var animate = new AnimateSprite(plist,prefix,unit);
            if(type == PDKAI.PLANE){
                action = cc.sequence(cc.moveTo(1.5,0,root.height/2),cc.callFunc(function(){
                    self.finish(animate);
                }))
            }else{
                animate.setRepeatTimes(1);
                animate.setCallBack(this.finish,this);
            }
            animate.play();
            animate.x = x;
            animate.y = y;
            root.addChild(animate,1000);
            if(action){
                animate.runAction(action);
            }
        }
    }

}